"use client"

import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const cardVariants = {
  default: "bg-slate-800/40 backdrop-blur-md border border-slate-700/50",
  glass: "bg-slate-800/20 backdrop-blur-lg border border-slate-600/30 shadow-glass",
  glow: "bg-slate-800/40 backdrop-blur-md border border-primary-500/30 shadow-glow",
  coral: "bg-slate-800/40 backdrop-blur-md border border-coral-500/30 shadow-coral-glow",
  teal: "bg-slate-800/40 backdrop-blur-md border border-teal-500/30 shadow-teal-glow"
}

const GlassCard = forwardRef(({ 
  className, 
  variant = "default",
  hover = true,
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6",
        cardVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

GlassCard.displayName = "GlassCard"

const GlassCardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight text-slate-100", className)}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-400", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

export { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardDescription, 
  GlassCardContent 
}