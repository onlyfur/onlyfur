import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description: string
  variant?: "default" | "destructive"
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const toastState = {
  toasts: [] as ToastProps[],
  setToasts: (toasts: ToastProps[]) => {
    toastState.toasts = toasts;
  }
};

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  toastState.setToasts([...toastState.toasts, { title, description, variant }]);
};

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toastFn = React.useCallback(({ title, description, variant = "default" }: ToastProps) => {
    setToasts((prev) => [...prev, { title, description, variant }])
  }, [])

  const Toaster = () => {
    return (
      <ToastPrimitives.Provider>
        <ToastPrimitives.Viewport className="fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
          {toasts.map((t, i) => (
            <ToastPrimitives.Root
              key={i}
              className={cn(toastVariants({ variant: t.variant }))}
            >
              <div className="grid gap-1">
                {t.title && <ToastPrimitives.Title className="text-sm font-semibold">{t.title}</ToastPrimitives.Title>}
                <ToastPrimitives.Description className="text-sm opacity-90">
                  {t.description}
                </ToastPrimitives.Description>
              </div>
              <ToastPrimitives.Close className="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-1 group-hover:opacity-100">
                ×
              </ToastPrimitives.Close>
            </ToastPrimitives.Root>
          ))}
        </ToastPrimitives.Viewport>
      </ToastPrimitives.Provider>
    )
  }

  return { toast: toastFn, Toaster }
}
