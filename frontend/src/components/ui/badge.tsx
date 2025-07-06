import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { 
    variant?: "default" | "outline-solid" | "secondary" | "destructive" | "success" | "warning" 
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "outline-solid" && "border border-input bg-background text-muted-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "warning" && "bg-yellow-100 text-yellow-800",
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
