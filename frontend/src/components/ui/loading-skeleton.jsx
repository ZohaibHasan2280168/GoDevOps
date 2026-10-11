export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 animate-pulse">
      <div className="h-16 w-16 bg-slate-700 rounded-2xl mb-4"></div>
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-full"></div>
    </div>
  )
}