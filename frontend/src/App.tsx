import React, { Suspense } from 'react';
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

// Core pages that should load immediately
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Lazy load all other pages for better code splitting
const AuthCallback = React.lazy(() => import('@/pages/AuthCallback'));
const OAuthDebugger = React.lazy(() => import('@/components/auth/OAuthDebugger'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const UserProfile = React.lazy(() => import('@/pages/UserProfilePage'));
const Explore = React.lazy(() => import('@/pages/Explore'));
const EnhancedSearchInterface = React.lazy(() => import('@/components/search/EnhancedSearchInterface'));
const MySubscriptions = React.lazy(() => import('@/components/subscription/MySubscriptions'));
const EnhancedUserProfile = React.lazy(() => import('@/components/profile/EnhancedUserProfile'));
const EnhancedContentUpload = React.lazy(() => import('@/components/upload/EnhancedContentUpload'));

const ContentUpload = React.lazy(() => import('@/pages/ContentUpload'));
const ContentManagement = React.lazy(() => import('@/pages/ContentManagement'));
const ContentFeed = React.lazy(() => import('@/pages/ContentFeed'));
const SubscriptionSettings = React.lazy(() => import('@/pages/SubscriptionSettings'));
const Subscribe = React.lazy(() => import('@/pages/Subscribe'));
const Billing = React.lazy(() => import('@/pages/Billing'));
const Earnings = React.lazy(() => import('@/pages/Earnings'));
const Messages = React.lazy(() => import('@/pages/Messages'));
const CreatorDashboard = React.lazy(() => import('@/pages/CreatorDashboard'));

// V3.9 Enhanced Pages with AI and Smooth Animations
const HomeV3 = React.lazy(() => import('@/pages/HomeV3'));
const ExploreV3 = React.lazy(() => import('@/pages/ExploreV3'));
const ProfileV3 = React.lazy(() => import('@/pages/ProfileV3'));
const MessagingV3 = React.lazy(() => import('@/pages/MessagingV3'));
const CreatorDashboardV3 = React.lazy(() => import('@/pages/CreatorDashboardV3'));

// Footer Pages
const Contact = React.lazy(() => import('@/pages/Contact'));

// Admin Pages - Group lazy loaded for better chunking
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('@/pages/admin/UserManagement'));
const UserCredentialsManagement = React.lazy(() => import('@/pages/admin/UserCredentialsManagement'));
const ContentModeration = React.lazy(() => import('@/pages/admin/ContentModeration'));
const PaymentManagement = React.lazy(() => import('@/pages/admin/PaymentManagement'));
const TagManagement = React.lazy(() => import('@/pages/admin/TagManagement'));

// Platform Pages
const About = React.lazy(() => import('@/pages/platform/About'));
const HowItWorks = React.lazy(() => import('@/pages/platform/HowItWorks'));
const CreatorProgram = React.lazy(() => import('@/pages/platform/CreatorProgram'));
const SuccessStories = React.lazy(() => import('@/pages/platform/SuccessStories'));

// Support Pages
const HelpCenter = React.lazy(() => import('@/pages/support/HelpCenter'));
const Safety = React.lazy(() => import('@/pages/support/Safety'));
const CommunityGuidelinesPage = React.lazy(() => import('@/pages/support/CommunityGuidelines'));
const ContactUs = React.lazy(() => import('@/pages/support/ContactUs'));

// Legal Pages
const PrivacyPolicy = React.lazy(() => import('@/pages/legal/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('@/pages/legal/TermsOfService'));
const CookiePolicy = React.lazy(() => import('@/pages/legal/CookiePolicy'));
const DMCA = React.lazy(() => import('@/pages/legal/DMCA'));

// Help Articles - Lazy loaded for better chunking
const HowToCreateAccount = React.lazy(() => import('@/pages/help/articles/how-to-create-account'));
const SettingUpCreatorProfile = React.lazy(() => import('@/pages/help/articles/setting-up-creator-profile'));
const UploadOrganizeContent = React.lazy(() => import('@/pages/help/articles/upload-organize-content'));
const FindingCreators = React.lazy(() => import('@/pages/help/articles/finding-creators'));
const FirstSubscription = React.lazy(() => import('@/pages/help/articles/first-subscription'));
const ContentPrivacyLevels = React.lazy(() => import('@/pages/help/articles/content-privacy-levels'));
const PricingStrategies = React.lazy(() => import('@/pages/help/articles/pricing-strategies'));
const SchedulingFeatures = React.lazy(() => import('@/pages/help/articles/scheduling-features'));
const UnderstandingAnalytics = React.lazy(() => import('@/pages/help/articles/understanding-analytics'));
const CustomCommissions = React.lazy(() => import('@/pages/help/articles/custom-commissions'));
const PaymentSystem = React.lazy(() => import('@/pages/help/articles/payment-system'));
const MessagingCreators = React.lazy(() => import('@/pages/help/articles/messaging-creators'));
const CommunityGuidelinesArticle = React.lazy(() => import('@/pages/help/articles/community-guidelines'));
const SubscriptionManagement = React.lazy(() => import('@/pages/help/articles/subscription-management'));
const AccountSecurity = React.lazy(() => import('@/pages/help/articles/account-security'));
const ReportUserContent = React.lazy(() => import('@/pages/help/articles/report-user-content'));
const MobileApp = React.lazy(() => import('@/pages/help/articles/mobile-app'));
const MessagingTips = React.lazy(() => import('@/pages/help/articles/messaging-tips'));
const MessageLimits = React.lazy(() => import('@/pages/help/articles/message-limits'));
const PaymentMethods = React.lazy(() => import('@/pages/help/articles/payment-methods'));
const CreatorEarnings = React.lazy(() => import('@/pages/help/articles/creator-earnings'));
const SubscriptionTiersOverview = React.lazy(() => import('@/pages/help/articles/subscription-tiers-overview'));

// Additional help articles
const LoginTroubleshooting = React.lazy(() => import('@/pages/help/articles/login-troubleshooting'));
const PasswordReset = React.lazy(() => import('@/pages/help/articles/password-reset'));
const OAuthGuide = React.lazy(() => import('@/pages/help/articles/oauth-guide'));
const SessionManagement = React.lazy(() => import('@/pages/help/articles/session-management'));
const EmailVerification = React.lazy(() => import('@/pages/help/articles/email-verification'));
const ProfileSetup = React.lazy(() => import('@/pages/help/articles/profile-setup'));
const ContentProtection = React.lazy(() => import('@/pages/help/articles/content-protection'));
const PrivacySettings = React.lazy(() => import('@/pages/help/articles/privacy-settings'));
const TwoFactorAuthentication = React.lazy(() => import('@/pages/help/articles/two-factor-authentication'));
const BrowserCompatibility = React.lazy(() => import('@/pages/help/articles/browser-compatibility'));
const AgeVerification = React.lazy(() => import('@/pages/help/articles/age-verification'));
const BulkMessaging = React.lazy(() => import('@/pages/help/articles/bulk-messaging'));
const AdvancedSearchFeatures = React.lazy(() => import('@/pages/help/articles/advanced-search-features'));
const NeuralSearch = React.lazy(() => import('@/pages/help/articles/neural-search'));
const SupportedFormats = React.lazy(() => import('@/pages/help/articles/supported-formats'));
const UploadTroubleshooting = React.lazy(() => import('@/pages/help/articles/upload-troubleshooting'));
const VideoQuality = React.lazy(() => import('@/pages/help/articles/video-quality'));
const RefundPolicy = React.lazy(() => import('@/pages/help/articles/refund-policy'));
const TaxInformation = React.lazy(() => import('@/pages/help/articles/tax-information'));

// Test Pages
const TestProtectedPage = React.lazy(() => import('./pages/TestProtectedPage'));
const MessagingV3Simple = React.lazy(() => import('./pages/MessagingV3Simple'));

// V3.7 New Creator Components
const LiveStreamingStudio = React.lazy(() => import('@/pages/creator/LiveStreamingStudio'));
const AdvancedAnalyticsV2 = React.lazy(() => import('@/pages/creator/AdvancedAnalyticsV2'));
const AIContentAssistant = React.lazy(() => import('@/pages/creator/AIContentAssistant'));
const AIContentCreationStudio = React.lazy(() => import('@/components/ai/AIContentCreationStudio'));

// AI Components
const AISettingsManager = React.lazy(() => import('@/components/ai/AISettingsManager'));

// Account Setup Page
const AccountSetup = React.lazy(() => import('@/pages/AccountSetup'));

// Footer Pages
const BestPractices = React.lazy(() => import('./pages/BestPractices'));
const AnalyticsGuide = React.lazy(() => import('./pages/AnalyticsGuide'));
const TaxInfo = React.lazy(() => import('./pages/TaxInfo'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
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
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Public routes */}
                        <Route
                          path="/"
                          element={
                            <PublicRoute>
                              <Landing />
                            </PublicRoute>
                          }
                        />
                        <Route
                          path="/login"
                          element={
                            <PublicRoute>
                              <Login />
                            </PublicRoute>
                          }
                        />
                        <Route
                          path="/register"
                          element={
                            <PublicRoute>
                              <Register />
                            </PublicRoute>
                          }
                        />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/oauth-debugger" element={<OAuthDebugger />} />

                        {/* Protected routes with layout */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Dashboard />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Profile />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile/:userId"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <UserProfile />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/explore"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Explore />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/content/upload"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <ContentUpload />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/content/manage"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <ContentManagement />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/content/feed"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <ContentFeed />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/subscriptions"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <SubscriptionSettings />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/my-subscriptions"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <MySubscriptions />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/subscribe/:creatorId"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Subscribe />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/billing"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Billing />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/earnings"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Earnings />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/messages"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Messages />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/creator-dashboard"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <CreatorDashboard />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />

                        {/* V3.9 Enhanced Routes */}
                        <Route
                          path="/home-v3"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <HomeV3 />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/explore-v3"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <ExploreV3 />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile-v3"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <ProfileV3 />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/messaging-v3"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <MessagingV3 />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/creator-dashboard-v3"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <CreatorDashboardV3 />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />

                        {/* Admin Routes */}
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <AdminDashboard />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/users"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <UserManagement />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/credentials"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <UserCredentialsManagement />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/content"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <ContentModeration />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/payments"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <PaymentManagement />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/tags"
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <TagManagement />
                              </MainLayout>
                            </ProtectedRoute>
                          }
                        />

                        {/* Public Footer Routes */}
                        <Route path="/contact" element={<Contact />} />
                        
                        {/* Platform Pages */}
                        <Route path="/about" element={<About />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/creator-program" element={<CreatorProgram />} />
                        <Route path="/success-stories" element={<SuccessStories />} />

                        {/* Support Pages */}
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/safety" element={<Safety />} />
                        <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
                        <Route path="/contact-us" element={<ContactUs />} />

                        {/* Legal Pages */}
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/cookies" element={<CookiePolicy />} />
                        <Route path="/dmca" element={<DMCA />} />

                        {/* Help Articles */}
                        <Route path="/help/how-to-create-account" element={<HowToCreateAccount />} />
                        <Route path="/help/setting-up-creator-profile" element={<SettingUpCreatorProfile />} />
                        <Route path="/help/upload-organize-content" element={<UploadOrganizeContent />} />
                        <Route path="/help/finding-creators" element={<FindingCreators />} />
                        <Route path="/help/first-subscription" element={<FirstSubscription />} />
                        <Route path="/help/content-privacy-levels" element={<ContentPrivacyLevels />} />
                        <Route path="/help/pricing-strategies" element={<PricingStrategies />} />
                        <Route path="/help/scheduling-features" element={<SchedulingFeatures />} />
                        <Route path="/help/understanding-analytics" element={<UnderstandingAnalytics />} />
                        <Route path="/help/custom-commissions" element={<CustomCommissions />} />
                        <Route path="/help/payment-system" element={<PaymentSystem />} />
                        <Route path="/help/messaging-creators" element={<MessagingCreators />} />
                        <Route path="/help/community-guidelines-article" element={<CommunityGuidelinesArticle />} />
                        <Route path="/help/subscription-management" element={<SubscriptionManagement />} />
                        <Route path="/help/account-security" element={<AccountSecurity />} />
                        <Route path="/help/report-user-content" element={<ReportUserContent />} />
                        <Route path="/help/mobile-app" element={<MobileApp />} />
                        <Route path="/help/messaging-tips" element={<MessagingTips />} />
                        <Route path="/help/message-limits" element={<MessageLimits />} />
                        <Route path="/help/payment-methods" element={<PaymentMethods />} />
                        <Route path="/help/creator-earnings" element={<CreatorEarnings />} />
                        <Route path="/help/subscription-tiers-overview" element={<SubscriptionTiersOverview />} />

                        {/* Additional Help Articles */}
                        <Route path="/help/login-troubleshooting" element={<LoginTroubleshooting />} />
                        <Route path="/help/password-reset" element={<PasswordReset />} />
                        <Route path="/help/oauth-guide" element={<OAuthGuide />} />
                        <Route path="/help/session-management" element={<SessionManagement />} />
                        <Route path="/help/email-verification" element={<EmailVerification />} />
                        <Route path="/help/profile-setup" element={<ProfileSetup />} />
                        <Route path="/help/content-protection" element={<ContentProtection />} />
                        <Route path="/help/privacy-settings" element={<PrivacySettings />} />
                        <Route path="/help/two-factor-authentication" element={<TwoFactorAuthentication />} />
                        <Route path="/help/browser-compatibility" element={<BrowserCompatibility />} />
                        <Route path="/help/age-verification" element={<AgeVerification />} />
                        <Route path="/help/bulk-messaging" element={<BulkMessaging />} />
                        <Route path="/help/advanced-search-features" element={<AdvancedSearchFeatures />} />
                        <Route path="/help/neural-search" element={<NeuralSearch />} />
                        <Route path="/help/supported-formats" element={<SupportedFormats />} />
                        <Route path="/help/upload-troubleshooting" element={<UploadTroubleshooting />} />
                        <Route path="/help/video-quality" element={<VideoQuality />} />
                        <Route path="/help/refund-policy" element={<RefundPolicy />} />
                        <Route path="/help/tax-information" element={<TaxInformation />} />

                        {/* Test Routes */}
                        <Route path="/test-protected" element={<ProtectedRoute><TestProtectedPage /></ProtectedRoute>} />
                        <Route path="/messaging-v3-simple" element={<ProtectedRoute><MessagingV3Simple /></ProtectedRoute>} />

                        {/* Creator Routes */}
                        <Route path="/creator/streaming" element={<ProtectedRoute><LiveStreamingStudio /></ProtectedRoute>} />
                        <Route path="/creator/analytics" element={<ProtectedRoute><AdvancedAnalyticsV2 /></ProtectedRoute>} />
                        <Route path="/creator/ai-assistant" element={<ProtectedRoute><AIContentAssistant /></ProtectedRoute>} />
                        <Route path="/creator/ai-studio" element={<ProtectedRoute><AIContentCreationStudio /></ProtectedRoute>} />

                        {/* Account Setup */}
                        <Route path="/account-setup" element={<ProtectedRoute><AccountSetup /></ProtectedRoute>} />

                        {/* Other Routes */}
                        <Route path="/best-practices" element={<BestPractices />} />
                        <Route path="/analytics-guide" element={<AnalyticsGuide />} />
                        <Route path="/tax-info" element={<TaxInfo />} />

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
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
