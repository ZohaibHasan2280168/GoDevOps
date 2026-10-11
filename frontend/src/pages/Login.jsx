import { useState, useCallback } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { ModernButton } from "../components/ui/modern-button"
import { Shield, Loader2, Check, ArrowRight } from "lucide-react"
import TwoFactorAuth from "../components/TwoFactorAuth"

const LoginPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, verify2FA, isAuthenticated, user, loading: authLoading } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [twoFactorData, setTwoFactorData] = useState(null)
  
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const deviceInfo = {
      userAgent: navigator.userAgent,
      ipAddress: 'client-ip', // This would be set by backend
      deviceName: navigator.platform,
      location: 'Unknown'
    }

    const result = await login(email, password, deviceInfo)
    
    if (result.success) {
      if (result.requiresTwoFactor) {
        // Show 2FA screen
        setTwoFactorData({
          email: result.email,
          userId: result.userId
        })
        setShowTwoFactor(true)
      } else {
        // Complete login
        setSuccess(true)
        // Always navigate to dashboard
        navigate('/dashboard', { replace: true })
      }
    } else {
      setError(result.message || "Invalid credentials. Please try again.")
    }
    setLoading(false)
  }, [email, password, login, navigate, redirectTo])

  const handle2FAVerify = useCallback(async (userId, code) => {
    try {
      console.log('Starting 2FA verification in Login page...')
      const response = await verify2FA(userId, code)
      console.log('2FA Verification response:', response)
      
      if (response.success) {
        console.log('Verification successful, preparing navigation...')
        setSuccess(true)
        setShowTwoFactor(false)
        
        // Force immediate navigation to dashboard
        console.log('Navigating to dashboard...')
        window.location.href = '/dashboard'
      }
      return response
    } catch (error) {
      console.error('2FA verification error:', error)
      return {
        success: false,
        message: error.message || 'Verification failed'
      }
    }
  }, [verify2FA, twoFactorData, navigate, redirectTo])

  const handle2FACancel = useCallback(() => {
    setShowTwoFactor(false)
    setTwoFactorData(null)
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (showTwoFactor && twoFactorData) {
    return (
      <TwoFactorAuth
        email={twoFactorData.email}
        userId={twoFactorData.userId}
        onVerify={handle2FAVerify}
        onCancel={handle2FACancel}
      />
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Already Logged In</h2>
          <p className="text-slate-400 mb-4">You are already signed in as {user.name}</p>
          <Link 
            to={user.role === 'admin' ? '/secure-admin-dashboard' : '/dashboard'} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-gray-300 text-sm">Sign in to continue your journey</p>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => alert('Google OAuth setup required. Please use email login for now.')}
              className="w-full h-11 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center gap-3 text-gray-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-800 px-2 text-gray-400">or continue with email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                {error}
              </p>
            )}
            
            <ModernButton 
              variant="primary" 
              size="sm" 
              type="submit" 
              disabled={loading || success} 
              className="w-full h-11"
            >
              {success ? (
                <Check className="h-4 w-4" />
              ) : loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </ModernButton>
          </form>
          
          <div className="mt-4 text-center text-sm">
      <span className="text-gray-400">Don't have an account? </span>
      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="font-medium text-blue-400 hover:text-blue-300"
      >
        Sign up
      </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage