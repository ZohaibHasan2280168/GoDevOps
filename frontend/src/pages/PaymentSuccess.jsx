import { memo, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { ModernButton } from "../components/ui/modern-button"
import { 
  CheckCircle, 
  Download, 
  Mail, 
  ArrowRight,
  Award,
  Sparkles
} from "lucide-react"

const PaymentSuccessPage = memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const paymentData = location.state || {}

  useEffect(() => {
    // If no payment data, redirect to premium page
    if (!paymentData.plan) {
      navigate('/premium')
    }
  }, [paymentData, navigate])

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert('Receipt download started!')
  }

  return (
    <div className="bg-slate-950 min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-slate-300">
            Welcome to CyberVerse Premium
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                {paymentData.plan?.name} Plan
              </h2>
              <p className="text-slate-400">Subscription activated</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-400">
                {paymentData.plan?.price}
              </div>
              <p className="text-slate-400">per {paymentData.plan?.period}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Transaction ID</h3>
              <p className="text-slate-100 font-mono">{paymentData.transactionId}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Payment Method</h3>
              <p className="text-slate-100">{paymentData.paymentMethod?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Date</h3>
              <p className="text-slate-100">{paymentData.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Status</h3>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-gradient-to-r from-primary-500/10 to-teal-500/10 border border-primary-500/20 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-primary-400" />
            <h2 className="text-2xl font-bold text-slate-100">What's Next?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <span className="text-primary-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Check Your Email
                </h3>
                <p className="text-slate-400 text-sm">
                  We've sent a confirmation email with your receipt and subscription details
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <span className="text-primary-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Explore Premium Labs
                </h3>
                <p className="text-slate-400 text-sm">
                  Access exclusive cybersecurity challenges and advanced scenarios
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <span className="text-primary-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Track Your Progress
                </h3>
                <p className="text-slate-400 text-sm">
                  Use advanced analytics to monitor your learning journey
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <span className="text-primary-400 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Earn Certificates
                </h3>
                <p className="text-slate-400 text-sm">
                  Complete labs and earn professional certificates to showcase your skills
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <ModernButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleDownloadReceipt}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
          </ModernButton>

          <Link to="/certificates" className="w-full">
            <ModernButton variant="glass" size="lg" className="w-full">
              <Award className="mr-2 h-5 w-5" />
              View Certificates
            </ModernButton>
          </Link>

          <Link to="/dashboard" className="w-full">
            <ModernButton variant="primary" size="lg" className="w-full">
              <span>Go to Dashboard</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </ModernButton>
          </Link>
        </div>

        {/* Email Confirmation Notice */}
        <div className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <Mail className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-slate-300">
              A confirmation email has been sent to your registered email address. 
              If you don't see it, please check your spam folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

PaymentSuccessPage.displayName = 'PaymentSuccessPage'
export default PaymentSuccessPage