const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class TwoFactorService {
  // Generate 6-digit OTP for email
  generateEmailOTP() {
    return {
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      maxAttempts: 3
    };
  }

  // Generate TOTP secret for authenticator apps
  generateTOTPSecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: `CyberVerse (${userEmail})`,
      issuer: 'CyberVerse',
      length: 32
    });
    return secret;
  }

  // Generate QR code for TOTP setup
  async generateQRCode(secret) {
    try {
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
      return qrCodeUrl;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  // Verify TOTP token
  verifyTOTP(token, secret) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2
    });
  }

  // Generate device ID for trusted devices
  generateDeviceId(userAgent, ipAddress) {
    return crypto
      .createHash('sha256')
      .update(`${userAgent}-${ipAddress}`)
      .digest('hex');
  }

  // Check if device is trusted
  isDeviceTrusted(user, deviceId) {
    return user.trustedDevices.some(device => device.deviceId === deviceId);
  }

  // Add trusted device
  addTrustedDevice(user, deviceInfo) {
    const device = {
      deviceId: deviceInfo.deviceId,
      deviceName: deviceInfo.deviceName || 'Unknown Device',
      userAgent: deviceInfo.userAgent,
      ipAddress: deviceInfo.ipAddress,
      location: deviceInfo.location || 'Unknown Location',
      lastUsed: new Date(),
      createdAt: new Date()
    };

    // Remove existing device with same ID
    user.trustedDevices = user.trustedDevices.filter(d => d.deviceId !== device.deviceId);
    user.trustedDevices.push(device);
    
    // Keep only 10 most recent devices
    if (user.trustedDevices.length > 10) {
      user.trustedDevices = user.trustedDevices
        .sort((a, b) => b.lastUsed - a.lastUsed)
        .slice(0, 10);
    }
  }

  // Check if 2FA is required for login
  shouldRequire2FA(user, deviceId) {
    if (!user.twoFactorEnabled) return false;
    
    if (user.securitySettings?.requireTwoFactorOnLogin) {
      return true;
    }

    if (user.securitySettings?.requireTwoFactorOnNewDevice) {
      return !this.isDeviceTrusted(user, deviceId);
    }

    return false;
  }
}

module.exports = new TwoFactorService();