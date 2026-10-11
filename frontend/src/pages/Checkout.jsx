import { useState, memo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ModernButton } from "../components/ui/modern-button"
import { Badge } from "../components/ui/badge"
import { useApp } from "../contexts/app-context"
import { apiCall } from "../config/api"
import { 
  CreditCard, 
  Shield, 
  Lock, 
  Check, 
  ArrowLeft,
  Wallet,
  Bitcoin,
  DollarSign,
  AlertCircle,
  Smartphone,
  Building2,
  Banknote
} from "lucide-react"

const PaymentMethodCard = memo(({ method, selected, onSelect }) => {
  const Icon = method.icon
  return (
    <div
      onClick={() => onSelect(method.id)}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        selected
          ? "bg-primary-500/10 border-primary-500"
          : "bg-slate-800/30 border-slate-700/50 hover:border-primary-500/30"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${selected ? 'bg-primary-500/20' : 'bg-slate-700/50'}`}>
          <Icon className={`h-6 w-6 ${selected ? 'text-primary-400' : 'text-slate-400'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100">{method.name}</h3>
          <p className="text-sm text-slate-400">{method.description}</p>
        </div>
        {selected && (
          <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </div>
  )
})

PaymentMethodCard.displayName = 'PaymentMethodCard'

const CheckoutPage = memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useApp()
  const selectedPlan = location.state?.plan || {
    name: "Pro",
    price: "$19",
    period: "month"
  }

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    country: "",
    phoneNumber: "",
    accountNumber: "",
    selectedBank: ""
  })

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, Amex",
      icon: CreditCard
    },
    {
      id: "jazzcash",
      name: "JazzCash",
      description: "Mobile wallet payment",
      icon: Smartphone
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      description: "Mobile wallet payment",
      icon: Smartphone
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Pakistani banks",
      icon: Building2
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Fast and secure",
      icon: Wallet
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      description: "Bitcoin, Ethereum",
      icon: Bitcoin
    }
  ]

  const pakistaniBanks = [
    { id: "hbl", name: "Habib Bank Limited (HBL)" },
    { id: "ubl", name: "United Bank Limited (UBL)" },
    { id: "mcb", name: "MCB Bank Limited" },
    { id: "abl", name: "Allied Bank Limited (ABL)" },
    { id: "nbl", name: "National Bank of Pakistan (NBP)" },
    { id: "bafl", name: "Bank Alfalah Limited" },
    { id: "meezanbank", name: "Meezan Bank Limited" },
    { id: "faysal", name: "Faysal Bank Limited" },
    { id: "askari", name: "Askari Bank Limited" },
    { id: "soneri", name: "Soneri Bank Limited" },
    { id: "standard", name: "Standard Chartered Bank" },
    { id: "js", name: "JS Bank Limited" },
    { id: "samba", name: "Samba Bank Limited" },
    { id: "silk", name: "Silk Bank Limited" },
    { id: "summit", name: "Summit Bank Limited" },
    { id: "dubai", name: "Dubai Islamic Bank" },
    { id: "albaraka", name: "Al Baraka Bank" },
    { id: "bankislami", name: "BankIslami Pakistan Limited" }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError("")

    try {
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}`
      const paymentMethodName = paymentMethods.find(m => m.id === selectedPaymentMethod)?.name

      // Call backend API to upgrade user to premium
      const response = await apiCall('/payment/upgrade-to-premium', {
        method: 'POST',
        body: JSON.stringify({
          transactionId,
          paymentMethod: paymentMethodName,
          plan: selectedPlan.name,
          amount: selectedPlan.price
        })
      })

      // Update user context with premium status
      if (response.user) {
        setUser(response.user)
      }

      // Navigate to success page
      navigate('/payment-success', { 
        state: { 
          plan: selectedPlan,
          paymentMethod: paymentMethods.find(m => m.id === selectedPaymentMethod),
          transactionId,
          date: new Date().toLocaleDateString()
        } 
      })
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="bg-slate-950 min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/premium')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Complete Your Purchase</h1>
          <p className="text-slate-400">Secure checkout powered by industry-leading encryption</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Payment Method</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedPaymentMethod === method.id}
                    onSelect={setSelectedPaymentMethod}
                  />
                ))}
              </div>
            </div>

            {/* Payment Details Form */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Payment Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message Display */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {selectedPaymentMethod === "card" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedPaymentMethod === "jazzcash" && (
                  <>
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 mb-4">
                        <Smartphone className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">JazzCash Payment</h3>
                      <p className="text-slate-400 text-sm mb-6">
                        Enter your JazzCash mobile account number
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        JazzCash Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="03XX-XXXXXXX"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        You will receive a payment request on your JazzCash app
                      </p>
                    </div>
                  </>
                )}

                {selectedPaymentMethod === "easypaisa" && (
                  <>
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                        <Smartphone className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">EasyPaisa Payment</h3>
                      <p className="text-slate-400 text-sm mb-6">
                        Enter your EasyPaisa mobile account number
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        EasyPaisa Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="03XX-XXXXXXX"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        You will receive a payment request on your EasyPaisa app
                      </p>
                    </div>
                  </>
                )}

                {selectedPaymentMethod === "bank" && (
                  <>
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                        <Building2 className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">Bank Transfer</h3>
                      <p className="text-slate-400 text-sm mb-6">
                        Select your bank and enter account details
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Select Bank
                      </label>
                      <select
                        name="selectedBank"
                        value={formData.selectedBank}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-500"
                        required
                      >
                        <option value="">Choose your bank</option>
                        {pakistaniBanks.map((bank) => (
                          <option key={bank.id} value={bank.id}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Account Number / IBAN
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="PK36XXXXXXXXXXXXXXXXXXXX"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Enter your IBAN or account number for verification
                      </p>
                    </div>
                  </>
                )}

                {selectedPaymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <Wallet className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                    <p className="text-slate-300 mb-4">
                      You will be redirected to PayPal to complete your purchase
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === "crypto" && (
                  <div className="text-center py-8">
                    <Bitcoin className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                    <p className="text-slate-300 mb-4">
                      You will receive wallet address and payment instructions
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IN">India</option>
                    <option value="PK">Pakistan</option>
                  </select>
                </div>

                <ModernButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Pay {selectedPlan.price}
                    </>
                  )}
                </ModernButton>
              </form>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <Shield className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{selectedPlan.name} Plan</h3>
                    <p className="text-sm text-slate-400">Billed {selectedPlan.period}ly</p>
                  </div>
                  <Badge className="bg-primary-500/20 text-primary-300">
                    Popular
                  </Badge>
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-3">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-lg font-bold text-slate-100">
                    <span>Total</span>
                    <span>{selectedPlan.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-slate-300">What's Included:</h3>
                <ul className="space-y-2">
                  {[
                    "Unlimited labs access",
                    "Advanced analytics",
                    "Priority support",
                    "Certificate generation",
                    "Exclusive pro labs"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-400">
                      <Check className="h-4 w-4 text-primary-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-2 p-3 bg-slate-900/50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
                  Cancel anytime. No questions asked. Full refund within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

CheckoutPage.displayName = 'CheckoutPage'
export default CheckoutPage