const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendOTP(email, otp, expiresAt) {
    const mailOptions = {
      from: `"GoDevOps Cloud" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your GoDevOps 2FA Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">GoDevOps</h1>
            <p style="color: white; margin: 5px 0;">DevOps & Cloud Engineering Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; margin: 10px 0;">
                ${otp}
              </div>
              <p style="color: #666; margin: 10px 0;">Enter this code to complete your verification</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⏰ This code expires at:</strong> ${new Date(expiresAt).toLocaleString()}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              If you didn't request this code, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              © 2026 GoDevOps. This is an automated security message.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();