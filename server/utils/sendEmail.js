const nodemailer = require('nodemailer');

// Creates the optimal transporter (prioritizing Google Gmail App Password)
const createTransporter = () => {
    // 1. Google Gmail SMTP (Official Google mail service)
    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_EMAIL;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;

    if (gmailUser && gmailPass) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass, // 16-character Google App Password (e.g. abcd efgh ijkl mnop)
            },
        });
    }

    // 2. Custom SMTP Host (Google Workspace, Brevo, Sendgrid, etc.)
    if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    return null;
};

// Generates an elegant, high-conversion HTML email template for OTP
const generateOtpHtml = (otp, type = 'Verification', recipientName = '') => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0E0D12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0E0D12; padding: 30px 15px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background: #17151D; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                        <!-- Header Banner -->
                        <tr>
                            <td align="center" style="padding: 35px 20px 20px 20px; background: linear-gradient(135deg, rgba(232,99,10,0.15) 0%, rgba(245,158,11,0.05) 100%); border-bottom: 1px solid rgba(255,255,255,0.06);">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF;">
                                    Shop<span style="color: #E8630A;">Sphere</span>
                                </h1>
                                <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #F59E0B; font-weight: 700;">
                                    Secure Account Verification
                                </p>
                            </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td style="padding: 35px 30px;">
                                <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">
                                    ${recipientName ? `Hello ${recipientName},` : 'Hello,'}
                                </h2>
                                <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 22px; color: #A09BAA;">
                                    Use the 6-digit One-Time Password (OTP) below to complete your ${type.toLowerCase()}. This code is valid for <strong>10 minutes</strong>.
                                </p>

                                <!-- OTP Code Box -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                    <tr>
                                        <td align="center" style="background: #201D27; border: 2px dashed #E8630A; border-radius: 16px; padding: 20px;">
                                            <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; display: block; padding-left: 12px;">
                                                ${otp}
                                            </span>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 15px 0; font-size: 12px; line-height: 18px; color: #8A8494;">
                                    🔒 <strong>Security Tip:</strong> Never share this code with anyone, including our support team. We will never ask for your OTP.
                                </p>
                                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #8A8494;">
                                    If you did not request this verification code, please disregard this email or secure your account.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 20px; background-color: #121015; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #666070;">
                                © ${new Date().getFullYear()} ShopSphere Marketo Inc. All rights reserved.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

const sendEmail = async (options) => {
    const transporter = createTransporter();

    const senderEmail = process.env.GMAIL_USER || process.env.FROM_EMAIL || 'no-reply@shopsphere.com';
    const senderName = process.env.FROM_NAME || 'ShopSphere Marketo';

    const mailOptions = {
        from: `"${senderName}" <${senderEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message || options.text,
        html: options.html || (options.otp ? generateOtpHtml(options.otp, options.type, options.name) : options.message),
    };

    if (transporter) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`[Google/SMTP Mail Delivered] Message ID: ${info.messageId} to ${options.email}`);
            return { success: true, messageId: info.messageId, delivered: true };
        } catch (error) {
            console.error('[Google/SMTP Mail Error]:', error.message);
            // Log fallback in dev so user is not blocked
            console.log(`[DEV OTP LOG for ${options.email}]: OTP is ${options.otp || 'N/A'}`);
            throw new Error(`Email delivery failed: ${error.message}`);
        }
    } else {
        // Fallback for local development when credentials are not yet set
        console.log('================== EMAIL DISPATCH (DEV MOCK) ==================');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`OTP Code: ${options.otp || 'N/A'}`);
        console.log('To send real emails to inboxes, add GMAIL_USER & GMAIL_APP_PASSWORD in server/.env');
        console.log('================================================================');
        return { success: true, mock: true, otp: options.otp };
    }
};

module.exports = sendEmail;
