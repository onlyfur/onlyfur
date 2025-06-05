import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { MessagingProvider } from '@/contexts/MessagingContext';
import { AdminProvider } from '@/contexts/AdminContext';
import MainLayout from '@/layouts/MainLayout';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import SecuritySettings from '@/pages/SecuritySettings';
import Subscribers from '@/pages/Subscribers';
import Analytics from '@/pages/Analytics';
import Explore from '@/pages/Explore';
import ContentUpload from '@/pages/ContentUpload';
import ContentManagement from '@/pages/ContentManagement';
import ContentFeed from '@/pages/ContentFeed';
import SubscriptionSettings from '@/pages/SubscriptionSettings';
import Subscribe from '@/pages/Subscribe';
import Billing from '@/pages/Billing';
import Earnings from '@/pages/Earnings';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ContentModeration from '@/pages/admin/ContentModeration';
import PaymentManagement from '@/pages/admin/PaymentManagement';
import TagManagement from '@/pages/admin/TagManagement';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Placeholder components for future implementation
const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
    </div>
  </div>
);

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto p-6">
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This feature will be implemented in the next phase.</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="onlyfur-theme">
      <AuthProvider>
        <ContentProvider>
          <PaymentProvider>
            <MessagingProvider>
              <AdminProvider>
                <Router>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Landing />} />
              <Route path="explore" element={<Explore />} />
              
              {/* Auth Routes */}
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/settings"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/security"
                element={
                  <ProtectedRoute>
                    <SecuritySettings />
                  </ProtectedRoute>
                }
              />

              {/* Content Management Routes */}
              <Route
                path="content"
                element={
                  <ProtectedRoute>
                    <ContentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="content/upload"
                element={
                  <ProtectedRoute>
                    <ContentUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="content/edit/:id"
                element={
                  <ProtectedRoute>
                    <ContentUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="feed"
                element={
                  <ProtectedRoute>
                    <ContentFeed />
                  </ProtectedRoute>
                }
              />

              {/* Messaging Routes */}
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages/:conversationId"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />

              {/* Coming Soon Routes */}
              <Route
                path="notifications"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Notifications" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="favorites"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Favorites" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="bookmarks"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Bookmarks" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Creator Routes */}
              <Route
                path="creator"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Creator Studio" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/upload"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Upload Content" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/subscribers"
                element={
                  <ProtectedRoute>
                    <Subscribers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscribers"
                element={
                  <ProtectedRoute>
                    <Subscribers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/earnings"
                element={
                  <ProtectedRoute>
                    <Earnings />
                  </ProtectedRoute>
                }
              />

              {/* Payment & Subscription Routes */}
              <Route
                path="subscribe/:creatorId"
                element={
                  <ProtectedRoute>
                    <Subscribe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscription-settings"
                element={
                  <ProtectedRoute>
                    <SubscriptionSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="billing"
                element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="earnings"
                element={
                  <ProtectedRoute>
                    <Earnings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/content"
                element={
                  <ProtectedRoute>
                    <ContentModeration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/tags"
                element={
                  <ProtectedRoute>
                    <TagManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/payments"
                element={
                  <ProtectedRoute>
                    <PaymentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/analytics"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Advanced Analytics" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/support"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Support Management" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/settings"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Platform Settings" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/system"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="System Monitoring" />
                  </ProtectedRoute>
                }
              />

              {/* Legal Pages */}
              <Route path="about" element={<ComingSoon title="About Us" />} />
              <Route path="how-it-works" element={<ComingSoon title="How It Works" />} />
              <Route path="creator-program" element={<ComingSoon title="Creator Program" />} />
              <Route path="terms" element={<ComingSoon title="Terms of Service" />} />
              <Route path="privacy" element={<ComingSoon title="Privacy Policy" />} />
              <Route path="contact" element={<ComingSoon title="Contact Us" />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
                </Router>
              </AdminProvider>
            </MessagingProvider>
          </PaymentProvider>
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
