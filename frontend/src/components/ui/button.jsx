import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  // base + cyber glow states using semantic tokens
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 will-change-transform",
  {
    variants: {
      variant: {
        default:
          // toned-down glow for performance
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_14px_-10px_var(--primary)]/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40",
        outline: "border bg-background/50 backdrop-blur-md hover:bg-background/70 dark:border-border/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/30 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      glow: {
        none: "",
        cyan: "shadow-[0_0_16px_-10px_rgba(0,217,255,0.45)]",
        purple: "shadow-[0_0_16px_-10px_rgba(157,0,255,0.45)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  },
)

function Button({ className, variant, size, glow, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, glow, className }))} {...props} />
}

export { Button, buttonVariants }
