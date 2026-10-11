import { cn } from "../../lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        // toned-down glass and shadow for perf
        "rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm shadow-[0_0_18px_-14px_rgba(0,217,255,0.25)]",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        "drop-shadow-[0_0_12px_rgba(157,0,255,0.35)]",
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground/90", className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
