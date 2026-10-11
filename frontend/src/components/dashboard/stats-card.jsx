import { GlassCard, GlassCardContent } from "../ui/glass-card"
import { ProgressRing } from "../ui/progress-ring"

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  progress, 
  trend,
  color = "primary" 
}) {
  const colorClasses = {
    primary: "text-primary-400",
    success: "text-green-400", 
    warning: "text-yellow-400",
    danger: "text-red-400"
  }

  return (
    <GlassCard className="hover:border-primary-400/30 transition-all duration-300 m-2">
      <GlassCardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-md bg-slate-800/50 ${colorClasses[color]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-slate-400">{title}</p>
              <p className="text-xl font-bold text-slate-100">{value}</p>
            </div>
          </div>
          {progress !== undefined && (
            <ProgressRing progress={progress} size={40} />
          )}
        </div>
        
        {subtitle && (
          <p className="text-xs text-slate-400">{subtitle}</p>
        )}
        
        {trend && (
          <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last week
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  )
}