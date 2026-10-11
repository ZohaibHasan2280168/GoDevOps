import { Badge } from "./badge"

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    dots: 1
  },
  intermediate: {
    label: "Intermediate", 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dots: 2
  },
  advanced: {
    label: "Advanced",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30", 
    dots: 3
  },
  expert: {
    label: "Expert",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    dots: 4
  }
}

export function DifficultyBadge({ level = "beginner", showDots = true }) {
  const config = difficultyConfig[level] || difficultyConfig.beginner

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${config.color} border`}>
        {config.label}
      </Badge>
      {showDots && (
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i < config.dots ? config.color.split(' ')[1] : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}