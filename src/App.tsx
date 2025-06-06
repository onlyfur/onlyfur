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
import GoogleCallback from '@/pages/GoogleCallback';
import OAuthDebugger from '@/components/auth/OAuthDebugger';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Explore from '@/pages/Explore';
import ContentUpload from '@/pages/ContentUpload';
import ContentManagement from '@/pages/ContentManagement';
import ContentFeed from '@/pages/ContentFeed';
import SubscriptionSettings from '@/pages/SubscriptionSettings';
import Subscribe from '@/pages/Subscribe';
import Billing from '@/pages/Billing';
import Earnings from '@/pages/Earnings';
import Messages from '@/pages/Messages';
import CreatorDashboard from '@/pages/CreatorDashboard';

// Footer Pages
import Contact from '@/pages/Contact';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ContentModeration from '@/pages/admin/ContentModeration';
import PaymentManagement from '@/pages/admin/PaymentManagement';
import TagManagement from '@/pages/admin/TagManagement';

// Footer Pages
// Platform
import About from '@/pages/platform/About';
import HowItWorks from '@/pages/platform/HowItWorks';
import CreatorProgram from '@/pages/platform/CreatorProgram';
import SuccessStories from '@/pages/platform/SuccessStories';

// Support
import HelpCenter from '@/pages/support/HelpCenter';
import Safety from '@/pages/support/Safety';
import CommunityGuidelines from '@/pages/support/CommunityGuidelines';
import ContactUs from '@/pages/support/ContactUs';

// Legal
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TermsOfService from '@/pages/legal/TermsOfService';
import CookiePolicy from '@/pages/legal/CookiePolicy';
import DMCA from '@/pages/legal/DMCA';

// Creator Resources
import CreatorResources from '@/pages/creators/CreatorResources';
import BestPractices from '@/pages/creators/BestPractices';
import AnalyticsGuide from '@/pages/creators/AnalyticsGuide';
import TaxInfo from '@/pages/creators/TaxInfo';

// Help Articles
import CreateAccount from '@/pages/help/articles/CreateAccount';
import SettingUpCreatorProfile from '@/pages/help/articles/SettingUpCreatorProfile';
import UploadOrganizeContent from '@/pages/help/articles/UploadOrganizeContent';

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
              <Route
                path="auth/callback/google"
                element={<GoogleCallback />}
              />
              <Route
                path="auth/debug"
                element={<OAuthDebugger />}
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
                path="creator-dashboard"
                element={
                  <ProtectedRoute>
                    <CreatorDashboard />
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
                path="profile/:username"
                element={
                  <ProtectedRoute>
                    <UserProfile />
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
                    <ComingSoon title="Settings" />
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
                    <ComingSoon title="Analytics" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/subscribers"
                element={
                  <ProtectedRoute>
                    <ComingSoon title="Subscribers" />
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

              {/* Platform Pages */}
              <Route path="about" element={<About />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="creator-program" element={<CreatorProgram />} />
              <Route path="success-stories" element={<SuccessStories />} />

              {/* Support Pages */}
              <Route path="help" element={<HelpCenter />} />
              <Route path="help/articles/create-account" element={<CreateAccount />} />
              <Route path="help/articles/setting-up-creator-profile" element={<SettingUpCreatorProfile />} />
              <Route path="help/articles/upload-organize-content" element={<UploadOrganizeContent />} />
              <Route path="safety" element={<Safety />} />
              <Route path="guidelines" element={<CommunityGuidelines />} />
              <Route path="contact" element={<ContactUs />} />

              {/* Legal Pages */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="cookies" element={<CookiePolicy />} />
              <Route path="dmca" element={<DMCA />} />

              {/* Creator Resources */}
              <Route path="creator-resources" element={<CreatorResources />} />
              <Route path="best-practices" element={<BestPractices />} />
              <Route path="analytics-guide" element={<AnalyticsGuide />} />
              <Route path="tax-info" element={<TaxInfo />} />

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
