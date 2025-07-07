import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Routes where sidebar should be hidden
  const hideSidebarRoutes = ['/', '/login', '/register', '/about', '/how-it-works'];
  const shouldShowSidebar = isAuthenticated && !hideSidebarRoutes.includes(location.pathname);

  // Routes where footer should be hidden or minimal
  const hideFooterRoutes = ['/messages', '/creator/upload'];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 relative">
        {shouldShowSidebar && (
          <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-40 lg:w-64 lg:top-16">
            <Sidebar />
          </div>
        )}
        
        <main 
          className={cn(
            'flex-1 overflow-auto min-h-[calc(100vh-4rem)]',
            shouldShowSidebar ? 'lg:ml-64' : '',
            'w-full'
          )}
        >
          {children || <Outlet />}
        </main>
      </div>

      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
