"use client"

import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
  secondary: "bg-slate-700 hover:bg-slate-600 text-white font-semibold border border-slate-600",
  coral: "bg-red-600 hover:bg-red-700 text-white font-semibold",
  teal: "bg-teal-600 hover:bg-teal-700 text-white font-semibold",
  sunflower: "bg-yellow-600 hover:bg-yellow-700 text-white font-semibold",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-600",
  glass: "bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-600"
}

const sizeVariants = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
  xl: "px-10 py-5 text-xl rounded-2xl"
}

const ModernButton = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  asChild,
  ...props 
}, ref) => {
  const Comp = asChild ? "div" : "button"
  
  return (
    <Comp
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={!asChild ? disabled : undefined}
      {...props}
    >
      {children}
    </Comp>
  )
})

ModernButton.displayName = "ModernButton"

export { ModernButton }