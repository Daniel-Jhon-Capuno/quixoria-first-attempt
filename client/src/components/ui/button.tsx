import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 " +
  // Smooth transition for all interactive states
  "transition-all duration-150 ease-out " +
  // Hover: lift up slightly
  "hover:-translate-y-0.5 " +
  // Active/click: press down
  "active:translate-y-0 active:scale-[0.97] ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary/80 " +
          "shadow-md shadow-primary/30 " +
          "hover:shadow-lg hover:shadow-primary/40 hover:bg-primary/90 " +
          "active:shadow-sm active:shadow-primary/20",

        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/80 " +
          "shadow-md shadow-destructive/30 " +
          "hover:shadow-lg hover:shadow-destructive/40 hover:bg-destructive/90 " +
          "active:shadow-sm active:shadow-destructive/20",

        outline:
          "border border-input bg-background " +
          "shadow-sm shadow-black/10 " +
          "hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:shadow-black/15 hover:border-primary/40 " +
          "active:shadow-none",

        secondary:
          "bg-secondary text-secondary-foreground border border-secondary/80 " +
          "shadow-sm shadow-black/10 " +
          "hover:bg-secondary/80 hover:shadow-md hover:shadow-black/15 " +
          "active:shadow-none",

        ghost:
          "border border-transparent " +
          "hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:shadow-black/10 " +
          "active:shadow-none",

        link:
          "text-primary underline-offset-4 hover:underline " +
          "hover:translate-y-0 active:translate-y-0 active:scale-100",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm:      "min-h-8 rounded-md px-3 text-xs",
        lg:      "min-h-10 rounded-md px-8",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }