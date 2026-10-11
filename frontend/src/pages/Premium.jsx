import { Link, useNavigate } from "react-router-dom"
import { ModernButton } from "../components/ui/modern-button"
import { Badge } from "../components/ui/badge"
import { Shield, Zap, Crown, Check, ArrowRight, Star } from "lucide-react"
import { memo, useMemo } from "react"

// Memoized plan card component
const PlanCard = memo(({ plan, index, onGetStarted }) => (
  <div
    className={`relative p-8 rounded-xl border transition-all duration-300 ${
      plan.popular
        ? "bg-slate-800/50 border-primary-500/50 scale-105"
        : "bg-slate-800/30 border-slate-700/50 hover:border-primary-500/30"
    }`}
    style={{ transform: 'translateZ(0)', willChange: 'transform' }}
  >
  
    
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-slate-100 mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-slate-100">{plan.price}</span>
        <span className="text-slate-400">/{plan.period}</span>
      </div>
      <p className="text-slate-400">{plan.description}</p>
    </div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, featureIndex) => (
        <li key={featureIndex} className="flex items-center gap-3">
          <Check className="h-5 w-5 text-primary-400 flex-shrink-0" />
          <span className="text-slate-300">{feature}</span>
        </li>
      ))}
    </ul>

    <ModernButton
      variant={plan.current ? "glass" : plan.popular ? "primary" : "outline"}
      size="lg"
      className="w-full"
      disabled={plan.current}
      onClick={() => !plan.current && onGetStarted(plan)}
    >
      {plan.current ? (
        "Current Plan"
      ) : (
        <>
          <span>Get Started</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </ModernButton>
  </div>
))

// Memoized feature card component
const FeatureCard = memo(({ feature, index }) => {
  const Icon = feature.icon
  return (
    <div 
      className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
        <Icon className="h-6 w-6 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-100 mb-2">{feature.title}</h3>
      <p className="text-slate-400">{feature.description}</p>
    </div>
  )
})

const PremiumPage = memo(() => {
  const navigate = useNavigate()

  // Memoized plans data
  const plans = useMemo(() => [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 labs per month",
        "Basic progress tracking",
        "Community support",
        "Standard difficulty labs"
      ],
      current: true
    },
    {
      name: "Pro",
      price: "$7",
      period: "month",
      description: "For serious learners",
      features: [
        "Unlimited labs access",
        "Advanced progress analytics",
        "Priority support",
        "All difficulty levels",
        "Exclusive pro labs",
        "Custom learning paths",
        "Certificate generation"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$100",
      period: "year",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Custom lab creation",
        "Advanced reporting",
        "Dedicated support",
        "Custom branding"
      ]
    }
  ], [])

  const handleGetStarted = (plan) => {
    navigate('/checkout', { state: { plan } })
  }

  // Memoized features data
  const features = useMemo(() => [
    {
      icon: Zap,
      title: "Unlimited Access",
      description: "Access all labs and challenges without restrictions"
    },
    {
      icon: Shield,
      title: "Advanced Labs",
      description: "Exclusive premium cybersecurity scenarios"
    },
    {
      icon: Crown,
      title: "Priority Support",
      description: "Get help when you need it with priority assistance"
    }
  ], [])

  return (
    <div className="page-container bg-[rgb(17,24,39)] text-text">

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-500/10 border border-primary-500/20 px-4 py-2 text-sm">
            <Crown className="h-4 w-4 text-primary-400" />
            <span className="text-primary-300">Premium Access</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get unlimited access to advanced cybersecurity training and exclusive content
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} index={index} onGetStarted={handleGetStarted} />
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-8">
            Why Go Premium?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>

        <div className="text-center p-8 rounded-xl bg-slate-800/30 border border-slate-700/50" style={{ transform: 'translateZ(0)' }}>
          <h3 className="text-2xl font-bold text-slate-100 mb-4">
            Ready to Go Premium?
          </h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Join thousands of cybersecurity professionals who have advanced their careers with premium training
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton variant="primary" size="lg">
              <Link to="/register">
                <span>Start Free Trial</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </ModernButton>
            <ModernButton variant="glass" size="lg">
              <Link to="/dashboard">
                Back to Dashboard
              </Link>
            </ModernButton>
          </div>
        </div>
      </div>
    </div>
  )
})

PremiumPage.displayName = 'PremiumPage'
export default PremiumPage