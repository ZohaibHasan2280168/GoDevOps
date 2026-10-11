import { useState, useEffect } from "react"
import { ModernButton } from "./ui/modern-button"
import { Shield, Smartphone, Mail, QrCode, Key, Trash2, AlertTriangle, Check, RefreshCw } from "lucide-react"
import { apiCall } from "../config/api"

const TwoFactorSettings = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [twoFactorStatus, setTwoFactorStatus] = useState(null)
  const [setupData, setSetupData] = useState(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [trustedDevices, setTrustedDevices] = useState([])

  useEffect(() => {
    fetchTwoFactorStatus()
    fetchTrustedDevices()
  }, [])

  const fetchTwoFactorStatus = async () => {
    try {
      const response = await apiCall('/2fa/status')
      setTwoFactorStatus(response)
    } catch (error) {
      console.error('Failed to fetch 2FA status:', error)
    }
  }

  const fetchTrustedDevices = async () => {
    try {
      const response = await apiCall('/2fa/trusted-devices')
      setTrustedDevices(response.devices || [])
    } catch (error) {
      console.error('Failed to fetch trusted devices:', error)
    }
  }

  const handleSetup2FA = async () => {
    setSetupLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiCall('/2fa/setup', {
        method: 'POST'
      })

      setSetupData({
        method: 'totp',
        ...response
      })
    } catch (error) {
      setError(error.message || 'Failed to setup 2FA')
    } finally {
      setSetupLoading(false)
    }
  }

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a 6-digit code")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Get user ID from the stored user data
      const userId = user?.id || localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User ID not found')
      }

      const response = await apiCall('/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          code: verificationCode.trim()
        })
      })

      // Store the new token if provided
      if (response.token) {
        localStorage.setItem('token', response.token)
      }

      setSuccess("2FA enabled successfully!")
      setSetupData(null)
      setVerificationCode("")
      await fetchTwoFactorStatus()
      onUpdate?.()
    } catch (error) {
      setError(error.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await apiCall('/2fa/disable', { method: 'POST' })
      setSuccess("2FA disabled successfully")
      await fetchTwoFactorStatus()
      await fetchTrustedDevices()
      onUpdate?.()
    } catch (error) {
      setError(error.message || 'Failed to disable 2FA')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDevice = async (deviceId) => {
    if (!confirm("Remove this trusted device?")) return

    try {
      await apiCall(`/2fa/trusted-devices/${deviceId}`, { method: 'DELETE' })
      await fetchTrustedDevices()
      setSuccess("Device removed successfully")
    } catch (error) {
      setError(error.message || 'Failed to remove device')
    }
  }

  const handleRemoveAllDevices = async () => {
    if (!confirm("Remove all trusted devices? You'll need to verify 2FA on all devices next time.")) return

    try {
      await apiCall('/2fa/trusted-devices', { method: 'DELETE' })
      await fetchTrustedDevices()
      setSuccess("All devices removed successfully")
    } catch (error) {
      setError(error.message || 'Failed to remove devices')
    }
  }

  if (setupData) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Setup {setupData.method === 'email' ? 'Email' : 'Authenticator'} 2FA
          </h3>

          {setupData.method === 'email' ? (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Email OTP</span>
                </div>
                <p className="text-gray-300 text-sm">
                  A 6-digit code has been sent to your email address. Enter it below to complete setup.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">Authenticator App</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                
                {setupData.qrCode && (
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img src={setupData.qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-gray-800 rounded border">
                  <p className="text-xs text-gray-400 mb-1">Manual entry key:</p>
                  <code className="text-sm text-white font-mono break-all">{setupData.secret}</code>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter verification code
            </label>
            <input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full h-11 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl font-mono tracking-widest"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <ModernButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setSetupData(null)
                setVerificationCode("")
                setError("")
              }}
              className="flex-1"
            >
              Cancel
            </ModernButton>
            <ModernButton
              variant="primary"
              size="sm"
              onClick={handleVerifySetup}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enable 2FA
                </>
              )}
            </ModernButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </h3>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-2">
            {success}
          </p>
        )}

        {twoFactorStatus?.enabled ? (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">2FA Enabled</span>
                  <span className="text-sm text-gray-400">
                    ({twoFactorStatus.method === 'email' ? 'Email OTP' : 'Authenticator App'})
                  </span>
                </div>
                <ModernButton
                  variant="destructive"
                  size="sm"
                  onClick={handleDisable2FA}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Disable
                    </>
                  )}
                </ModernButton>
              </div>
            </div>

            {trustedDevices.length > 0 && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">Trusted Devices ({trustedDevices.length})</h4>
                  <ModernButton
                    variant="secondary"
                    size="sm"
                    onClick={handleRemoveAllDevices}
                  >
                    Remove All
                  </ModernButton>
                </div>
                <div className="space-y-2">
                  {trustedDevices.map((device) => (
                    <div key={device.deviceId} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                      <div>
                        <p className="text-sm font-medium text-white">{device.deviceName}</p>
                        <p className="text-xs text-gray-400">
                          Last used: {new Date(device.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveDevice(device.deviceId)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">2FA Not Enabled</span>
              </div>
              <p className="text-gray-300 text-sm">
                Enable two-factor authentication to add an extra layer of security to your account.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-green-400" />
                <span className="font-medium text-white">Authenticator App</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Use Google Authenticator, Authy, or similar apps for secure 2FA
              </p>
              <ModernButton
                variant="primary"
                size="sm"
                onClick={handleSetup2FA}
                disabled={setupLoading}
                className="w-full"
              >
                {setupLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Setup Authenticator 2FA'
                )}
              </ModernButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TwoFactorSettings