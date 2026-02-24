const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For development, you can use Mailtrap or log to terminal
    // If SMTP credentials exist in env, use them. Otherwise log to terminal.

    if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const message = {
            from: `${process.env.FROM_NAME || 'ShopSphere'} <${process.env.FROM_EMAIL || 'no-reply@shopsphere.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } else {
        console.log('--- EMAIL MOCK ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.message}`);
        console.log('------------------');
        // We simulate success even without SMTP
        return true;
    }
};

module.exports = sendEmail;
