import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { MessagingProvider } from '@/contexts/MessagingContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import MainLayout from '@/layouts/MainLayout';
import CookieConsentManager from '@/components/legal/CookieConsentManager';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AuthCallback from '@/pages/AuthCallback';
import OAuthDebugger from '@/components/auth/OAuthDebugger';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Explore from '@/pages/Explore';
import EnhancedSearchInterface from '@/components/search/EnhancedSearchInterface';
import MySubscriptions from '@/components/subscription/MySubscriptions';
import EnhancedUserProfile from '@/components/profile/EnhancedUserProfile';
import EnhancedContentUpload from '@/components/upload/EnhancedContentUpload';

import ContentUpload from '@/pages/ContentUpload';
import ContentManagement from '@/pages/ContentManagement';
import ContentFeed from '@/pages/ContentFeed';
import SubscriptionSettings from '@/pages/SubscriptionSettings';
import Subscribe from '@/pages/Subscribe';
import Billing from '@/pages/Billing';
import Earnings from '@/pages/Earnings';
import Messages from '@/pages/Messages';
import CreatorDashboard from '@/pages/CreatorDashboard';

// V3.9 Enhanced Pages with AI and Smooth Animations
import HomeV3 from '@/pages/HomeV3';
import ExploreV3 from '@/pages/ExploreV3';
import ProfileV3 from '@/pages/ProfileV3';
import MessagingV3 from '@/pages/MessagingV3';
import CreatorDashboardV3 from '@/pages/CreatorDashboardV3';

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
import CommunityGuidelinesPage from '@/pages/support/CommunityGuidelines';
import ContactUs from '@/pages/support/ContactUs';

// Legal
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TermsOfService from '@/pages/legal/TermsOfService';
import CookiePolicy from '@/pages/legal/CookiePolicy';
import DMCA from '@/pages/legal/DMCA';

// Creator Resources - Removed as requested

// Help Articles
import HowToCreateAccount from '@/pages/help/articles/how-to-create-account';
import SettingUpCreatorProfile from '@/pages/help/articles/setting-up-creator-profile';
import UploadOrganizeContent from '@/pages/help/articles/upload-organize-content';
import FindingCreators from '@/pages/help/articles/finding-creators';
import FirstSubscription from '@/pages/help/articles/first-subscription';
import ContentPrivacyLevels from '@/pages/help/articles/content-privacy-levels';
import PricingStrategies from '@/pages/help/articles/pricing-strategies';
import SchedulingFeatures from '@/pages/help/articles/scheduling-features';
import UnderstandingAnalytics from '@/pages/help/articles/understanding-analytics';
import CustomCommissions from '@/pages/help/articles/custom-commissions';
import PaymentSystem from '@/pages/help/articles/payment-system';
import MessagingCreators from '@/pages/help/articles/messaging-creators';
import CommunityGuidelinesArticle from '@/pages/help/articles/community-guidelines';
import SubscriptionManagement from '@/pages/help/articles/subscription-management';
import AccountSecurity from '@/pages/help/articles/account-security';
import ReportUserContent from '@/pages/help/articles/report-user-content';
import MobileApp from '@/pages/help/articles/mobile-app';
import MessagingTips from '@/pages/help/articles/messaging-tips';
import MessageLimits from '@/pages/help/articles/message-limits';
import PaymentMethods from '@/pages/help/articles/payment-methods';
import CreatorEarnings from '@/pages/help/articles/creator-earnings';
import SubscriptionTiersOverview from '@/pages/help/articles/subscription-tiers-overview';

// Additional missing help articles
import LoginTroubleshooting from '@/pages/help/articles/login-troubleshooting';
import PasswordReset from '@/pages/help/articles/password-reset';
import OAuthGuide from '@/pages/help/articles/oauth-guide';
import SessionManagement from '@/pages/help/articles/session-management';
import EmailVerification from '@/pages/help/articles/email-verification';
import ProfileSetup from '@/pages/help/articles/profile-setup';
import ContentProtection from '@/pages/help/articles/content-protection';
import PrivacySettings from '@/pages/help/articles/privacy-settings';
import TwoFactorAuthentication from '@/pages/help/articles/two-factor-authentication';
import BrowserCompatibility from '@/pages/help/articles/browser-compatibility';
import AgeVerification from '@/pages/help/articles/age-verification';
import BulkMessaging from '@/pages/help/articles/bulk-messaging';
import AdvancedSearchFeatures from '@/pages/help/articles/advanced-search-features';
import NeuralSearch from '@/pages/help/articles/neural-search';
import SupportedFormats from '@/pages/help/articles/supported-formats';
import UploadTroubleshooting from '@/pages/help/articles/upload-troubleshooting';
import VideoQuality from '@/pages/help/articles/video-quality';
import RefundPolicy from '@/pages/help/articles/refund-policy';
import TaxInformation from '@/pages/help/articles/tax-information';

// V3.7 New Creator Components
import LiveStreamingStudio from '@/pages/creator/LiveStreamingStudio';
import AdvancedAnalyticsV2 from '@/pages/creator/AdvancedAnalyticsV2';
import AIContentAssistant from '@/pages/creator/AIContentAssistant';
import AIContentCreationStudio from '@/components/ai/AIContentCreationStudio';

// AI Components
import AISettingsManager from '@/components/ai/AISettingsManager';

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
      <CookieConsentProvider>
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
              <Route path="home-v3" element={<HomeV3 />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore-v3" element={<ExploreV3 />} />
              <Route path="search" element={<EnhancedSearchInterface />} />
              
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
                path="auth/callback"
                element={<AuthCallback />}
              />
              <Route
                path="auth/callback/google"
                element={<AuthCallback />}
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
                path="creator-dashboard-v3"
                element={
                  <ProtectedRoute>
                    <CreatorDashboardV3 />
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
              <Route
                path="profile-v2/:userId"
                element={<EnhancedUserProfile />}
              />
              <Route
                path="profile-v3/:userId?"
                element={<ProfileV3 />}
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
                path="content-v2/upload"
                element={
                  <ProtectedRoute>
                    <EnhancedContentUpload />
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
              <Route
                path="messages-v3"
                element={
                  <ProtectedRoute>
                    <MessagingV3 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages-v3/:conversationId"
                element={
                  <ProtectedRoute>
                    <MessagingV3 />
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
                path="creator/analytics-v2"
                element={
                  <ProtectedRoute>
                    <AdvancedAnalyticsV2 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/streaming"
                element={
                  <ProtectedRoute>
                    <LiveStreamingStudio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/ai-assistant"
                element={
                  <ProtectedRoute>
                    <AIContentAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="creator/ai-studio"
                element={
                  <ProtectedRoute>
                    <AIContentCreationStudio />
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
              <Route
                path="my-subscriptions"
                element={
                  <ProtectedRoute>
                    <MySubscriptions />
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
                    <AISettingsManager />
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
              <Route path="help" element={<HelpCenter />} />              <Route path="help/articles/create-account" element={<HowToCreateAccount />} />
              <Route path="help/articles/how-to-create-account" element={<HowToCreateAccount />} />
              <Route path="help/articles/setting-up-creator-profile" element={<SettingUpCreatorProfile />} />
              <Route path="help/articles/upload-organize-content" element={<UploadOrganizeContent />} />
              <Route path="help/articles/finding-creators" element={<FindingCreators />} />
              <Route path="help/articles/subscription-tiers-overview" element={<SubscriptionTiersOverview />} />
              <Route path="help/articles/first-subscription" element={<FirstSubscription />} />
              <Route path="help/articles/content-privacy-levels" element={<ContentPrivacyLevels />} />
              <Route path="help/articles/pricing-strategies" element={<PricingStrategies />} />
              <Route path="help/articles/scheduling-features" element={<SchedulingFeatures />} />
              <Route path="help/articles/understanding-analytics" element={<UnderstandingAnalytics />} />
              <Route path="help/articles/custom-commissions" element={<CustomCommissions />} />
              <Route path="help/articles/payment-system" element={<PaymentSystem />} />
              <Route path="help/articles/messaging-creators" element={<MessagingCreators />} />
              <Route path="help/articles/community-guidelines" element={<CommunityGuidelinesArticle />} />
              <Route path="help/articles/subscription-management" element={<SubscriptionManagement />} />
              <Route path="help/articles/account-security" element={<AccountSecurity />} />
              <Route path="help/articles/report-user-content" element={<ReportUserContent />} />
              <Route path="help/articles/mobile-app" element={<MobileApp />} />
              <Route path="help/articles/messaging-tips" element={<MessagingTips />} />
              <Route path="help/articles/message-limits" element={<MessageLimits />} />
              <Route path="help/articles/payment-methods" element={<PaymentMethods />} />
              <Route path="help/articles/creator-earnings" element={<CreatorEarnings />} />
              
              {/* Account Settings */}
              <Route path="help/articles/login-troubleshooting" element={<LoginTroubleshooting />} />
              <Route path="help/articles/password-reset" element={<PasswordReset />} />
              <Route path="help/articles/oauth-guide" element={<OAuthGuide />} />
              <Route path="help/articles/session-management" element={<SessionManagement />} />
              <Route path="help/articles/email-verification" element={<EmailVerification />} />
              <Route path="help/articles/profile-setup" element={<ProfileSetup />} />
              
              {/* Safety & Privacy */}
              <Route path="help/articles/content-protection" element={<ContentProtection />} />
              <Route path="help/articles/privacy-settings" element={<PrivacySettings />} />
              <Route path="help/articles/two-factor-authentication" element={<TwoFactorAuthentication />} />
              <Route path="help/articles/browser-compatibility" element={<BrowserCompatibility />} />
              <Route path="help/articles/age-verification" element={<AgeVerification />} />
              
              {/* Communication */}
              <Route path="help/articles/bulk-messaging" element={<BulkMessaging />} />
              
              {/* Search Features */}
              <Route path="help/articles/advanced-search-features" element={<AdvancedSearchFeatures />} />
              <Route path="help/articles/neural-search" element={<NeuralSearch />} />
              
              {/* Creator Tools */}
              <Route path="help/articles/supported-formats" element={<SupportedFormats />} />
              <Route path="help/articles/upload-troubleshooting" element={<UploadTroubleshooting />} />
              <Route path="help/articles/video-quality" element={<VideoQuality />} />
              
              {/* Billing */}
              <Route path="help/articles/refund-policy" element={<RefundPolicy />} />
              <Route path="help/articles/tax-information" element={<TaxInformation />} />
              <Route path="safety" element={<Safety />} />
              <Route path="guidelines" element={<CommunityGuidelinesPage />} />
              <Route path="contact" element={<ContactUs />} />

              {/* Legal Pages */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="cookies" element={<CookiePolicy />} />
              <Route path="dmca" element={<DMCA />} />

              {/* Creator Resources - Removed as requested */}

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
                    <CookieConsentManager />
                  </Router>
                </AdminProvider>
              </MessagingProvider>
            </PaymentProvider>
          </ContentProvider>
        </AuthProvider>
      </CookieConsentProvider>
    </ThemeProvider>
  );
}

export default App;
