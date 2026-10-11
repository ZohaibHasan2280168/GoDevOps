# 🔐 Two-Factor Authentication (2FA) Setup Guide

## Overview
CyberVerse now supports comprehensive Two-Factor Authentication with two methods:
- **Email OTP**: 6-digit codes sent to your email
- **TOTP (Authenticator App)**: Google Authenticator, Authy, etc.

## 🚀 Features

### ✅ Security Features
- OTP hashed before storing (SHA-256)
- OTP expires in 10 minutes
- 5 wrong attempts → temporary lockout
- HTTPS required for production
- JWT only issued after OTP verification
- Rate-limited OTP sending (3 per 10 minutes)
- Device trust management (30-day remember)

### ✅ User Experience
- Seamless integration with existing login flow
- No breaking changes to current authentication
- Countdown timer for OTP expiry
- Resend OTP with 30-second cooldown
- "Remember device" option
- Trusted device management

## 📦 Installation & Setup

### 1. Backend Dependencies
All required packages are already installed:
```bash
# Already in package.json
- speakeasy (TOTP generation)
- qrcode (QR code generation)
- nodemailer (Email service)
- crypto (Hashing)
```

### 2. Environment Variables
Update your `.env` file:
```env
# Email Configuration for 2FA
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

### 3. Gmail App Password Setup
1. Enable 2-Step Verification on your Google account
2. Go to Google Account Settings → Security → 2-Step Verification
3. Generate an "App Password" for "Mail"
4. Use this 16-character password in `GMAIL_APP_PASSWORD`

## 🔧 API Endpoints

### Authentication Flow
```bash
# 1. Login (returns requiresTwoFactor if 2FA enabled)
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1",
    "deviceName": "Chrome on Windows"
  }
}

# 2. Complete 2FA verification
POST /api/auth/verify-2fa
{
  "email": "user@example.com",
  "code": "123456",
  "rememberDevice": true,
  "deviceInfo": { ... }
}
```

### 2FA Management
```bash
# Get 2FA status
GET /api/2fa/status

# Setup 2FA (Email or TOTP)
POST /api/2fa/setup
{ "method": "email" | "totp" }

# Verify setup and enable 2FA
POST /api/2fa/verify-setup
{ "method": "email", "code": "123456" }

# Send OTP for login
POST /api/2fa/send-otp
{ "email": "user@example.com" }

# Verify OTP for login
POST /api/2fa/verify-otp
{
  "email": "user@example.com",
  "otp": "123456",
  "rememberDevice": true,
  "deviceInfo": { ... }
}

# Disable 2FA
POST /api/2fa/disable

# Manage trusted devices
GET /api/2fa/trusted-devices
DELETE /api/2fa/trusted-devices/:deviceId
DELETE /api/2fa/trusted-devices
```

## 🎯 Usage Examples

### 1. Enable Email 2FA
```javascript
// Frontend example
const enable2FA = async () => {
  // Step 1: Setup
  const setupResponse = await fetch('/api/2fa/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'email' })
  })
  
  // Step 2: User receives email with OTP
  // Step 3: Verify and enable
  const verifyResponse = await fetch('/api/2fa/verify-setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      method: 'email', 
      code: '123456' 
    })
  })
}
```

### 2. Enable TOTP (Authenticator App)
```javascript
const enableTOTP = async () => {
  // Step 1: Setup - returns QR code
  const setupResponse = await fetch('/api/2fa/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'totp' })
  })
  
  const { qrCode, secret } = await setupResponse.json()
  
  // Step 2: User scans QR code with authenticator app
  // Step 3: User enters code from app
  const verifyResponse = await fetch('/api/2fa/verify-setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      method: 'totp', 
      code: '123456' 
    })
  })
}
```

### 3. Login with 2FA
```javascript
const loginWith2FA = async (email, password) => {
  // Step 1: Initial login
  const loginResponse = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const loginData = await loginResponse.json()
  
  if (loginData.requiresTwoFactor) {
    // Step 2: Show 2FA screen
    // For email method, OTP is automatically sent
    // For TOTP method, user opens authenticator app
    
    // Step 3: Verify 2FA
    const verifyResponse = await fetch('/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        code: '123456',
        rememberDevice: true
      })
    })
    
    const { token, user } = await verifyResponse.json()
    // Login complete!
  }
}
```

## 🧪 Testing

### Test with cURL

#### 1. Setup Email 2FA
```bash
# Login first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Setup 2FA
curl -X POST http://localhost:5000/api/2fa/setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"method":"email"}'

# Verify setup (check email for OTP)
curl -X POST http://localhost:5000/api/2fa/verify-setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"method":"email","code":"123456"}'
```

#### 2. Login with 2FA
```bash
# Initial login (will return requiresTwoFactor: true)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Complete 2FA verification
curl -X POST http://localhost:5000/api/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "code":"123456",
    "rememberDevice":true
  }'
```

## 🔒 Security Best Practices

### Production Checklist
- [ ] Use HTTPS only
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure proper CORS origins
- [ ] Set up proper email service (not Gmail for production)
- [ ] Enable rate limiting
- [ ] Monitor failed 2FA attempts
- [ ] Regular security audits

### Database Security
- [ ] OTP codes are hashed (SHA-256)
- [ ] TOTP secrets are encrypted
- [ ] No plaintext sensitive data
- [ ] Proper indexing on frequently queried fields

## 🐛 Troubleshooting

### Common Issues

#### 1. Email not sending
```bash
# Check Gmail app password
# Verify GMAIL_USER and GMAIL_APP_PASSWORD in .env
# Check console for email service errors
```

#### 2. QR Code not displaying
```bash
# Ensure qrcode package is installed
# Check browser console for image loading errors
# Verify TOTP secret generation
```

#### 3. OTP verification failing
```bash
# Check OTP expiry (10 minutes)
# Verify code format (6 digits)
# Check attempt limits (3 max)
# Ensure proper string comparison
```

#### 4. Device trust not working
```bash
# Verify deviceInfo is being sent
# Check device ID generation
# Ensure cookies are enabled
```

## 📱 Frontend Components

### TwoFactorAuth Component
- Handles OTP input and verification
- Shows countdown timer
- Resend functionality
- Device trust option

### TwoFactorSettings Component
- 2FA setup and management
- QR code display for TOTP
- Trusted device management
- Enable/disable 2FA

## 🔄 Migration Guide

### From Disabled to Enabled 2FA
1. No database migration needed (schema already exists)
2. Enable routes in server.js ✅
3. Update frontend components ✅
4. Configure email service ✅
5. Test thoroughly ✅

### Existing Users
- 2FA is disabled by default
- Users can enable it in Settings → Security
- No impact on existing login flow
- Backward compatible

## 📊 Monitoring & Analytics

### Key Metrics to Track
- 2FA adoption rate
- Failed verification attempts
- Device trust usage
- Email delivery success rate
- TOTP vs Email preference

### Logging
- All 2FA events are logged
- Failed attempts tracked
- Device registrations logged
- Security events monitored

## 🚀 Future Enhancements

### Planned Features
- [ ] SMS OTP support
- [ ] Hardware key support (WebAuthn)
- [ ] Backup codes
- [ ] Admin 2FA enforcement
- [ ] Geolocation-based trust
- [ ] Push notifications

### Performance Optimizations
- [ ] OTP caching
- [ ] Rate limiting per user
- [ ] Async email sending
- [ ] Device fingerprinting

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Test with provided cURL examples
4. Verify environment configuration

**Happy Securing! 🔐**