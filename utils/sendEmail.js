const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (options) => {
    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a1a15; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #c9a227; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c9a227; letter-spacing: 5px; text-transform: uppercase; font-size: 24px;">Security Protocol</h1>
        </div>
        <div style="background-color: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(201,162,39,0.2);">
            <p style="font-size: 16px; line-height: 1.6; color: #ffffff; text-align: center;">Your unique access key for verification is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 42px; font-weight: bold; color: #c9a227; letter-spacing: 15px; background: rgba(201,162,39,0.1); padding: 15px 30px; border-radius: 10px;">${options.otp}</span>
            </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.5); text-align: center;">This code will expire in 5 minutes. Do not share this key.</p>
        </div>
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid rgba(201,162,39,0.2); padding-top: 20px;">
            <p style="font-size: 10px; color: #c9a227; text-transform: uppercase; letter-spacing: 2px;">Trade Balance Network • AES-256 Encrypted</p>
        </div>
    </div>
    `;

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: html,
    };

    return transporter.sendMail(mailOptions);
};

const sendPasswordChangeEmail = async (email, name) => {
    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a1a15; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #c9a227; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c9a227; letter-spacing: 5px; text-transform: uppercase; font-size: 24px;">Security Alert</h1>
        </div>
        <div style="background-color: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(201,162,39,0.2);">
            <p style="font-size: 16px; line-height: 1.6; color: #ffffff;">Hello ${name},</p>
            <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.8);">Your account password has been <strong>successfully changed</strong>. If you did not perform this action, please contact our security team immediately.</p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 10px 20px; background: rgba(0,255,0,0.1); border: 1px solid #00ff00; color: #00ff00; border-radius: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                    Security Status: Secure
                </div>
            </div>
        </div>
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid rgba(201,162,39,0.2); padding-top: 20px;">
            <p style="font-size: 10px; color: #c9a227; text-transform: uppercase; letter-spacing: 2px;">Trade Balance Network • AES-256 Encrypted</p>
        </div>
    </div>
    `;

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Security Alert: Password Changed',
        html: html,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, sendPasswordChangeEmail };
