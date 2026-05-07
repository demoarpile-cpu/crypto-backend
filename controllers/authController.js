const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateOtp = require('../utils/generateOtp');
const { sendEmail, sendPasswordChangeEmail } = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const register = async (req, res) => {
    const { full_name, email, password, sponsor_id, phone } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // Check for existing user
        const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const role = email.includes('admin') ? 'admin' : 'user';

        await pool.execute(
            'INSERT INTO users (full_name, email, password, is_verified, role, sponsor_id, phone) VALUES (?, ?, ?, TRUE, ?, ?, ?)',
            [full_name, email, hashedPassword, role, sponsor_id || 'SYSTEM', phone || null]
        );

        res.status(201).json({
            message: 'Registration successful. You can now login directly.',
            email
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    try {
        const [users] = await pool.execute(
            'SELECT id, otp, otp_expiry FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        await pool.execute(
            'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE id = ?',
            [user.id]
        );

        res.json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Resend OTP
// @route   POST /api/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await pool.execute(
            'UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?',
            [otp, otpExpiry, email]
        );

        await sendEmail({
            email,
            subject: 'New Verification Code - Pre-Launch',
            otp
        });

        res.json({ message: 'New OTP sent to your email' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email first', email });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Change password
// @route   POST /api/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

        // Send Confirmation Email
        try {
            await sendPasswordChangeEmail(user.email, user.full_name);
        } catch (emailError) {
            console.error('Password change email failed:', emailError);
        }

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    verifyOtp,
    resendOtp,
    login,
    changePassword
};
