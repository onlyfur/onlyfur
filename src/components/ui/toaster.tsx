import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // useToast returns { toast, Toaster }, so we need to use the Toaster component from useToast
  const { Toaster: ToastComponent } = useToast();
  return <ToastComponent />;
}
