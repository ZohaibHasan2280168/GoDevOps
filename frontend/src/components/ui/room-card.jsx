import { Link } from "react-router-dom"
import { Users, Clock, Zap, Crown, Play } from "lucide-react"
import { GlassCard, GlassCardContent, GlassCardHeader } from "./glass-card"
import { ModernButton } from "./modern-button"
import { Badge } from "./badge"
import { DifficultyBadge } from "./difficulty-badge"

export function RoomCard({ room, isActive = false, isPremium = false }) {
  return (
    <GlassCard className={`group transition-all duration-300 m-2 ${
      isActive ? 'border-green-400/50 bg-green-500/5' : 'hover:border-primary-400/50'
    }`}>
      <GlassCardHeader className="relative p-4 pb-2">
        {isPremium && (
          <Badge className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )}
        {isActive && (
          <Badge className="absolute top-0 left-0 bg-green-500/20 text-green-400 border-green-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        )}
        
        <div className="mt-4">
          <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-primary-400 transition-colors">
            {room.name}
          </h3>
          <DifficultyBadge level={room.difficulty} />
        </div>
      </GlassCardHeader>
      
      <GlassCardContent className="p-4 pt-2">
        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {room.currentPlayers}/{room.maxPlayers}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {room.timeLeft}
          </div>
        </div>

        <ModernButton 
          variant={isActive ? "success" : "primary"} 
          size="sm" 
          className="w-full"
          asChild
        >
          <Link to={`/rooms/${room.id}`}>
            <Play className="w-4 h-4 mr-2" />
            {isActive ? "Join Room" : "Enter Room"}
          </Link>
        </ModernButton>
      </GlassCardContent>
    </GlassCard>
  )
}