# 🧪 2FA Testing Guide

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000` (or your port)
3. User account created and logged in

## Step-by-Step Testing

### Step 1: Enable 2FA (Setup QR Code)
```bash
# Login first to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "yourpassword"
  }'

# Copy the token from response, then setup 2FA
curl -X POST http://localhost:5000/api/2fa/setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "secret": "JBSWY3DPEHPK3PXP",
  "manualEntryKey": "JBSWY3DPEHPK3PXP"
}
```

### Step 2: Scan QR Code with Google Authenticator
1. Open Google Authenticator app
2. Tap "+" to add account
3. Choose "Scan QR code"
4. Scan the QR code from the response
5. Note the 6-digit code generated

### Step 3: Verify and Enable 2FA
```bash
# Use the 6-digit code from your authenticator app
curl -X POST http://localhost:5000/api/2fa/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "code": "123456"
  }'
```

**Expected Response:**
```json
{
  "message": "2FA verified successfully",
  "enabled": true
}
```

### Step 4: Check 2FA Status
```bash
curl -X GET http://localhost:5000/api/2fa/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "enabled": true,
  "method": "totp"
}
```

### Step 5: Test Login with 2FA
```bash
# Logout and login again - should require 2FA
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "yourpassword"
  }'
```

**Expected Response (2FA Required):**
```json
{
  "requiresTwoFactor": true,
  "message": "Two-factor authentication required",
  "email": "test@example.com",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

### Step 6: Complete 2FA Login
```bash
# Get fresh code from authenticator app and verify
curl -X POST http://localhost:5000/api/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "code": "654321"
  }'
```

**Expected Response (Login Success):**
```json
{
  "message": "2FA verification successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Test User",
    "email": "test@example.com",
    "twoFactorEnabled": true
  }
}
```

## Frontend Testing

### 1. Navigate to Settings
1. Login to your app
2. Go to Settings → Security
3. Click "Setup Authenticator 2FA"

### 2. Scan QR Code
1. QR code should appear
2. Scan with Google Authenticator
3. Enter 6-digit code
4. Click "Enable 2FA"

### 3. Test Login Flow
1. Logout
2. Login with email/password
3. Should show 2FA screen
4. Enter code from authenticator
5. Should login successfully

## Troubleshooting

### QR Code Not Showing
- Check browser console for errors
- Verify `qrcode` package is installed
- Check network requests in DevTools

### Invalid Code Error
- Ensure time sync on device
- Try multiple codes (TOTP changes every 30 seconds)
- Check secret key is saved correctly

### 404 Errors
- Verify backend server is running
- Check routes are properly mounted
- Confirm CORS is configured

### Database Issues
- Check MongoDB connection
- Verify User model has 2FA fields
- Check user document structure

## Success Indicators

✅ QR code displays correctly  
✅ Google Authenticator shows "CyberVerse" account  
✅ 6-digit codes generate every 30 seconds  
✅ Verification enables 2FA successfully  
✅ Login requires 2FA after enabling  
✅ 2FA verification completes login  
✅ Status shows enabled: true  

## Security Notes

- TOTP codes expire every 30 seconds
- Secret is stored encrypted in database
- 2FA is required for all logins once enabled
- No backup codes implemented yet
- Device trust not implemented in this version

---

**Ready to test! 🚀**