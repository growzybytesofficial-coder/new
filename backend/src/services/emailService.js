import nodemailer from 'nodemailer';

const getTransporter = () => {
  // If SMTP is fully configured in environment, use it
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback / Development mode: log to console or try to create standard Ethereal mock email
  console.log('⚠️ SMTP Credentials are not configured. Emails will be logged to console.');
  return null;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.MAIL_FROM || '"IT SAATHI" <Support@itsaathi.com>',
    to,
    subject,
    text,
    html,
  };

  if (!transporter) {
    console.log('\n=========================================');
    console.log(`✉️ EMAIL LOGGED (No SMTP Configured):`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Text): ${text}`);
    console.log('=========================================\n');
    return { messageId: 'console-log-id' };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    // Do not crash the application, return standard object indicating failure
    return { error: error.message };
  }
};
