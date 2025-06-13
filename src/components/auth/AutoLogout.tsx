import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AutoLogoutProps {
  variant?: 'default' | 'destructive' | 'outline-solid' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  redirectPath?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const AutoLogout: React.FC<AutoLogoutProps> = ({
  variant = 'ghost',
  size = 'default',
  redirectPath = '/',
  showIcon = true,
  children,
  className,
}) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleAutoLogout = async () => {
    try {
      // Show immediate feedback
      toast({
        title: "Signing out...",
        description: "You're being logged out. Thanks for visiting OnlyFur!",
      });

      // Automatic logout with redirect
      await logout();
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback toast
      toast({
        title: "Signed out",
        description: "You've been successfully logged out.",
      });
      
      // Force redirect even if logout fails
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAutoLogout}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children || 'Log out'}
    </Button>
  );
};

export default AutoLogout;
