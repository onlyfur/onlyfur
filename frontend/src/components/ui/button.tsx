import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:from-pink-600 hover:to-orange-500 hover:shadow-lg hover:scale-[1.02] border-0 cursor-pointer shadow-md hover:shadow-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-xl",
        outline:
          "border border-gradient bg-gradient-to-r from-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-400 hover:from-pink-500 hover:to-orange-400 hover:text-white hover:border-pink-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-xl",
        secondary:
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-xl",
        ghost: "text-pink-600 dark:text-pink-400 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-orange-400/10 hover:text-pink-700 dark:hover:text-pink-300 hover:scale-[1.02] cursor-pointer transition-all duration-200",
        link: "text-pink-600 dark:text-pink-400 underline-offset-4 hover:underline cursor-pointer hover:text-pink-700 dark:hover:text-pink-300 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
