import { Crown, Check, Zap } from "lucide-react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "./glass-card"
import { ModernButton } from "./modern-button"
import { Badge } from "./badge"

export function PremiumUpgrade({ compact = false }) {
  const features = [
    "Access to all premium labs",
    "Priority room access",
    "Advanced progress analytics",
    "Custom lab environments", 
    "1-on-1 mentorship sessions",
    "Exclusive certification paths"
  ]

  if (compact) {
    return (
      <GlassCard className="border-gradient-to-r from-yellow-500/30 to-orange-500/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
        <GlassCardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                <Crown className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="font-semibold text-slate-100">Upgrade to Premium</p>
                <p className="text-xs text-slate-400">Unlock advanced features</p>
              </div>
            </div>
            <ModernButton variant="primary" size="sm">
              Upgrade
            </ModernButton>
          </div>
        </GlassCardContent>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="border-gradient-to-r from-yellow-500/30 to-orange-500/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
      <GlassCardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500">
            <Crown className="w-8 h-8 text-black" />
          </div>
        </div>
        <GlassCardTitle className="text-2xl mb-2">
          Upgrade to Premium
        </GlassCardTitle>
        <p className="text-slate-400">
          Unlock the full potential of your cybersecurity learning journey
        </p>
      </GlassCardHeader>
      
      <GlassCardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-100">$19</span>
            <span className="text-slate-400">/month</span>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Zap className="w-3 h-3 mr-1" />
            50% Off First Month
          </Badge>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-slate-300">{feature}</span>
            </div>
          ))}
        </div>

        <ModernButton variant="primary" className="w-full" size="lg">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Now
        </ModernButton>

        <p className="text-xs text-slate-500 text-center">
          Cancel anytime. No hidden fees.
        </p>
      </GlassCardContent>
    </GlassCard>
  )
}