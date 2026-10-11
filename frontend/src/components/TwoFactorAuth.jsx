import { useState, useEffect, useCallback } from "react"
import { ModernButton } from "./ui/modern-button"
import { Shield, Clock, RefreshCw, Smartphone, Mail, ArrowLeft } from "lucide-react"
import { apiCall } from "../config/api"

const TwoFactorAuth = ({ email, userId, onVerify, onCancel }) => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [rememberDevice, setRememberDevice] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCooldown])



  const sendOTP = useCallback(async () => {
    try {
      setError("")
      const response = await apiCall('/2fa/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      })
      
      if (response.success) {
        setTimeLeft(600) // Reset timer
        setCanResend(false)
        setResendCooldown(30) // 30 second cooldown
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP')
    }
  }, [email])

  const handleVerify = async (e) => {
    e.preventDefault() // Prevent form submission
    
    // Validate input
    if (!code) {
      setError("Please enter verification code")
      return
    }
    
    const cleanCode = code.replace(/\s/g, '').trim()
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setError("Please enter a valid 6-digit code")
      return
    }
    
    if (!userId) {
      setError("Missing user information. Please try logging in again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log('Attempting verification...', { userId, codeLength: cleanCode.length })
      
      // Call the parent's onVerify function which handles the API call
      if (onVerify) {
        const result = await onVerify(userId, cleanCode)
        console.log('Verification result:', result)
        
        if (!result) {
          throw new Error('No response from verification service')
        }
        
        if (result.success === true) {
          console.log('Verification successful in TwoFactorAuth')
          setError("")
          setLoading(false)
          if (onVerify) {
            await onVerify(result) // Pass the entire result to parent
          }
        } else {
          const errorMessage = result.message || "Invalid verification code. Please try again."
          console.error('Verification failed:', errorMessage)
          setError(errorMessage)
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('2FA verification error:', error)
      setError(error.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Two-Factor Authentication</h1>
            <p className="text-gray-300 text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">
                Authenticator App
              </span>
            </div>

            <div>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest"
                autoComplete="one-time-code"
              />
            </div>



            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberDevice"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberDevice" className="text-sm text-gray-300">
                Remember this device for 30 days
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <ModernButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={onCancel}
                className="flex-1 h-11"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </ModernButton>
              
              <ModernButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={loading || code.length !== 6}
                className="flex-1 h-11"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </ModernButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorAuth