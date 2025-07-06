import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  MessageCircle,
  Bell,
  Settings,
  CreditCard,
  BarChart3,
  Upload,
  Users,
  Crown,
  Heart,
  Bookmark,
  Shield,
  DollarSign,
  Wallet,
  Receipt,
  Tag as TagIcon,
  TrendingUp,
  Video,
  Brain,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return null;
  }

  const generalNavigation: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: 'BarChart3' },
    { title: 'Profile', href: '/profile', icon: 'User' },
    { title: 'Content Feed', href: '/feed', icon: 'Home' },
    { title: 'Messages', href: '/messages', icon: 'MessageCircle', badge: 3 },
    { title: 'Notifications', href: '/notifications', icon: 'Bell', badge: 12 },
    { title: 'Bookmarks', href: '/bookmarks', icon: 'Bookmark' },
  ];

  const creatorNavigation: NavItem[] = [
    { title: 'My Content', href: '/content', icon: 'Crown' },
    { title: 'Upload Content', href: '/content/upload', icon: 'Upload' },
    { title: 'Analytics', href: '/creator/analytics', icon: 'BarChart3' },
    { title: 'Advanced Analytics', href: '/creator/analytics-v2', icon: 'TrendingUp', badge: 'NEW' },
    { title: 'Live Streaming', href: '/creator/streaming', icon: 'Video', badge: 'v3.7' },
    { title: 'AI Assistant', href: '/creator/ai-assistant', icon: 'Brain', badge: 'AI' },
    { title: 'Subscribers', href: '/creator/subscribers', icon: 'Users', badge: 127 },
    { title: 'Earnings', href: '/creator/earnings', icon: 'DollarSign' },
    { title: 'Subscription Tiers', href: '/subscription-settings', icon: 'Crown' },
  ];

  const adminNavigation: NavItem[] = [
    { title: 'Admin Dashboard', href: '/admin', icon: 'Shield' },
    { title: 'User Management', href: '/admin/users', icon: 'Users' },
    { title: 'Content Moderation', href: '/admin/content', icon: 'Shield' },
    { title: 'Tag Management', href: '/admin/tags', icon: 'TagIcon' },
    { title: 'Payment Management', href: '/admin/payments', icon: 'CreditCard' },
    { title: 'Support Tickets', href: '/admin/support', icon: 'MessageCircle' },
    { title: 'System Monitoring', href: '/admin/system', icon: 'BarChart3' },
    { title: 'Platform Settings', href: '/admin/settings', icon: 'Settings' },
  ];

  const billingNavigation: NavItem[] = [
    { title: 'Billing & Subscriptions', href: '/billing', icon: 'CreditCard' },
    { title: 'Payment Methods', href: '/billing?tab=payment-methods', icon: 'Wallet' },
    { title: 'Transaction History', href: '/billing?tab=transactions', icon: 'Receipt' },
  ];

  const settingsNavigation: NavItem[] = [
    { title: 'Settings', href: '/settings', icon: 'Settings' },
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Home,
      User,
      MessageCircle,
      Bell,
      Settings,
      CreditCard,
      BarChart3,
      Upload,
      Users,
      Crown,
      Heart,
      Bookmark,
      Shield,
      DollarSign,
      Wallet,
      Receipt,
      TagIcon,
      TrendingUp,
      Video,
      Brain,
    };
    return icons[iconName] || Home;
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavSection = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = getIcon(item.icon || 'Home');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
                item.disabled && 'pointer-events-none opacity-50'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="h-5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className={cn('w-64 bg-background border-r h-full overflow-y-auto', className)}>
      <div className="p-4">
        {/* User Info */}
        <div className="mb-6 p-3 rounded-lg bg-muted">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {(user.displayName || user.username || 'U')?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.displayName || user.username || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role || 'user'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        {renderNavSection('General', generalNavigation)}
        
        {user.role === 'creator' && renderNavSection('Creator Tools', creatorNavigation)}
        
        {renderNavSection('Billing & Payments', billingNavigation)}
        
        {user.role === 'admin' && renderNavSection('Administration', adminNavigation)}
        
        {renderNavSection('Settings', settingsNavigation)}
      </div>
    </aside>
  );
};

export default Sidebar;
