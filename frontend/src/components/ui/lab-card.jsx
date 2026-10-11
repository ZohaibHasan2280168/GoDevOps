"use client"

import { Link } from "react-router-dom"
import { Clock, Users, Trophy, Lock, Play } from "lucide-react"
import { GlassCard, GlassCardContent, GlassCardHeader } from "./glass-card"
import { ModernButton } from "./modern-button"
import { Badge } from "./badge"

export function LabCard({ 
  lab, 
  isPremium = false, 
  userProgress = 0, 
  isCompleted = false,
  isLocked = false 
}) {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-600 text-white'
      case 'intermediate': return 'bg-yellow-600 text-white'
      case 'advanced': return 'bg-orange-600 text-white'
      case 'expert': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <GlassCard className="group">
      <GlassCardHeader className="relative p-4 pb-2">
        {isPremium && (
          <Badge className="absolute top-2 right-2 bg-yellow-600 text-black border-0 text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-t-lg flex items-center justify-center">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
        )}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-100 mb-2">
              {lab.title}
            </h3>
            <Badge className={`text-xs ${getDifficultyColor(lab.difficulty)}`}>
              {lab.difficulty}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">{userProgress}%</div>
            <div className="w-8 h-1 bg-slate-700 rounded-full mt-1">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${userProgress}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCardHeader>
      
      <GlassCardContent className="p-4 pt-2">
        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
          {lab.description}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lab.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {lab.participants}
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {lab.points} pts
          </div>
        </div>

        <ModernButton 
          variant={isCompleted ? "glass" : "primary"} 
          size="sm" 
          className="w-full"
          asChild
          disabled={isLocked}
        >
          <Link to={`/labs/${lab.id}`}>
            <Play className="w-4 h-4 mr-2" />
            {isCompleted ? "Review" : "Start Lab"}
          </Link>
        </ModernButton>
      </GlassCardContent>
    </GlassCard>
  )
}