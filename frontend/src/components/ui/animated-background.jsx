"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Simple gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
      </div>

      {/* Dark overlay behind form */}
      <div className="absolute inset-0 bg-slate-950/60" />
    </div>
  )
}