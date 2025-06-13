import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  HelpCircle, 
  Search, 
  ChevronDown,
  ChevronRight,
  User,
  CreditCard,
  Upload,
  MessageCircle,
  Shield,
  Settings,
  Star,
  FileText,
  Video,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>(['getting-started']);

  const getArticleLink = (article: any) => {
    const articleLinks: { [key: string]: string } = {
      'How to create your OnlyFur account': '/help/articles/how-to-create-account',
      'Setting up your profile as a creator': '/help/articles/setting-up-creator-profile',
      'Understanding subscription tiers': '/help/articles/subscription-tiers-overview',
      'Finding and following creators': '/help/articles/finding-creators',
      'Your first subscription - what to expect': '/help/articles/first-subscription',
      'Uploading and organizing your content': '/help/articles/upload-organize-content',
      'Setting content privacy levels': '/help/articles/content-privacy-levels',
      'Pricing strategies for creators': '/help/articles/pricing-strategies',
      'Using scheduling features': '/help/articles/scheduling-features',
      'Understanding creator analytics': '/help/articles/understanding-analytics',
      'Custom content and commissions': '/help/articles/custom-commissions',
      'How payments work on OnlyFur': '/help/articles/payment-system',
      'Updating your payment method': '/help/articles/payment-methods',
      'Creator earnings and payouts': '/help/articles/creator-earnings',
      'Subscription renewal and cancellation': '/help/articles/subscription-management',
      'Refund policy and requests': '/help/articles/refund-policy',
      'Tax information for creators': '/help/articles/tax-information',
      'How to message creators': '/help/articles/messaging-creators',
      'Message limits by subscription tier': '/help/articles/message-limits',
      'Sending tips through messages': '/help/articles/messaging-tips',
      'Blocking and reporting users': '/help/articles/report-user-content',
      'Creator bulk messaging features': '/help/articles/bulk-messaging',
      'Community guidelines overview': '/help/articles/community-guidelines',
      'Privacy settings and controls': '/help/articles/privacy-settings',
      'Content protection for creators': '/help/articles/content-protection',
      'Reporting inappropriate content or behavior': '/help/articles/report-user-content',
      'Age verification process': '/help/articles/age-verification',
      'Supported file formats and sizes': '/help/articles/supported-formats',
      'Troubleshooting upload issues': '/help/articles/upload-troubleshooting',
      'Video quality and streaming': '/help/articles/video-quality',
      'Mobile app features and limitations': '/help/articles/mobile-app',
      'Browser compatibility': '/help/articles/browser-compatibility',
      'Account security': '/help/articles/account-security',
      'Password reset guide': '/help/articles/password-reset',
      'Login troubleshooting': '/help/articles/login-troubleshooting',
      'Session management': '/help/articles/session-management',
      'Google OAuth guide': '/help/articles/oauth-guide',
      'Two-factor authentication': '/help/articles/two-factor-authentication',
      'Age Verification': '/help/articles/age-verification',
      'Content Protection': '/help/articles/content-protection',
      'Bulk Messaging': '/help/articles/bulk-messaging',
      'Tax Information': '/help/articles/tax-information',
      'Refund Policy': '/help/articles/refund-policy'

    };
    
    return articleLinks[article.title] || '/help';
  };

  const getPopularArticleLink = (article: string) => {
    const popularLinks: { [key: string]: string } = {
      'How to create your OnlyFur account': '/help/articles/how-to-create-account',
      'Uploading and organizing your content': '/help/articles/upload-organize-content',
      'How payments work on OnlyFur': '/help/articles/payment-system',
      'Community guidelines overview': '/help/articles/community-guidelines',
      'Creator earnings and payouts': '/help/articles/creator-earnings',
      'Subscription renewal and cancellation': '/help/articles/subscription-management',
      'How to message creators': '/help/articles/messaging-creators',
      'Setting content privacy levels': '/help/articles/content-privacy-levels',
      'Mobile app features and limitations': '/help/articles/mobile-app',
      'Account security': '/help/articles/account-security',
      'Password reset guide': '/help/articles/password-reset',
      'Login troubleshooting': '/help/articles/login-troubleshooting'
    };
    
    return popularLinks[article] || '/help';
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: User,
      description: 'New to OnlyFur? Start here!',
      color: 'text-blue-500',
      articles: [
      {
          title: 'How to create your OnlyFur account',
          description: 'Step-by-step guide to joining our community',
          popular: true
        },
        {
          title: 'Setting up your profile as a creator',
          description: 'Complete your creator profile to attract subscribers'
        },
        {
          title: 'Understanding subscription tiers',
          description: 'Learn about Basic, Pro, and VIP subscriber levels'
        },
        {
          title: 'Finding and following creators',
          description: 'Discover amazing furry content creators'
        },
        {
          title: 'Your first subscription - what to expect',
          description: 'Guide for new subscribers'
        },
        {
          title: 'Account security',
          description: 'Best practices for keeping your OnlyFur account secure',
          popular: true
        },
        {
          title: 'Password reset guide',
          description: 'Learn how to securely reset your password'
        },
        {
          title: 'Login troubleshooting',
          description: 'Resolve common login issues and access problems'
        },
        {
          title: 'Two-factor authentication',
          description: 'Set up 2FA for enhanced account protection'
        },
        {
          title: 'Google OAuth guide',
          description: 'Use Google Sign-In for convenient and secure access'
        },
        {
          title: 'Session management',
          description: 'Monitor and control your active login sessions'
        }
      ]
    },
    {
      id: 'creator-tools',
      title: 'Creator Tools',
      icon: Upload,
      description: 'Make the most of creator features',
      color: 'text-purple-500',
      articles: [
        {
          title: 'Uploading and organizing your content',
          description: 'Best practices for content management',
          popular: true
        },
        {
          title: 'Setting content privacy levels',
          description: 'Control who can see your content',
          popular: true
        },
        {
          title: 'Pricing strategies for creators',
          description: 'Tips for setting subscription and tip prices'
        },
        {
          title: 'Using scheduling features',
          description: 'Plan and schedule your content releases'
        },
        {
          title: 'Understanding creator analytics',
          description: 'Track your performance and growth'
        },
        {
          title: 'Custom content and commissions',
          description: 'Offer personalized content to subscribers'
        },
        {
          title: 'Creator earnings and payouts',
          description: 'Understanding how creators earn money and receive payments',
          popular: true
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      icon: CreditCard,
      description: 'Everything about payments',
      color: 'text-green-500',
      articles: [
        {
          title: 'How payments work on OnlyFur',
          description: 'Understanding our payment system',
          popular: true
        },
        {
          title: 'Updating your payment method',
          description: 'Change credit cards and payment details'
        },
        {
          title: 'Subscription renewal and cancellation',
          description: 'Manage your subscription settings',
          popular: true
        },
        {
          title: 'Refund policy and requests',
          description: 'When and how refunds are processed'
        },
        {
          title: 'Tax information for creators',
          description: 'Important tax considerations'
        }
      ]
    },
    {
      id: 'messaging',
      title: 'Messaging & Communication',
      icon: MessageCircle,
      description: 'Connect with the community',
      color: 'text-pink-500',
      articles: [
        {
          title: 'How to message creators',
          description: 'Start conversations with your favorite creators',
          popular: true
        },
        {
          title: 'Message limits by subscription tier',
          description: 'Understanding messaging restrictions'
        },
        {
          title: 'Sending tips through messages',
          description: 'Show appreciation with monetary tips'
        },
        {
          title: 'Blocking and reporting users',
          description: 'Keep your experience safe and positive'
        },
        {
          title: 'Creator bulk messaging features',
          description: 'Reach multiple subscribers efficiently'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Privacy',
      icon: Shield,
      description: 'Stay safe on our platform',
      color: 'text-red-500',
      articles: [
        {
          title: 'Community guidelines overview',
          description: 'Understanding our community standards',
          popular: true
        },
        {
          title: 'Privacy settings and controls',
          description: 'Manage your privacy preferences'
        },
        {
          title: 'Content protection for creators',
          description: 'How we protect your original content'
        },
        {
          title: 'Reporting inappropriate content or behavior',
          description: 'Help keep our community safe'
        },
        {
          title: 'Age verification process',
          description: 'Why and how we verify user ages'
        }
      ]
    },
      {
        id: 'technical',
        title: 'Technical Support',
        icon: Settings,
        description: 'Troubleshooting and technical help',
        color: 'text-orange-500',
        articles: [
          {
            title: 'Supported file formats and sizes',
            description: 'What content types you can upload'
          },
          {
            title: 'Troubleshooting upload issues',
            description: 'Fix common upload problems'
          },
          {
            title: 'Video quality and streaming',
            description: 'Optimize your video content'
          },
          {
            title: 'Mobile app features and limitations',
            description: 'Using OnlyFur on mobile devices',
            popular: true
          },
          {
            title: 'Browser compatibility',
            description: 'Supported browsers and requirements'
          },
          {
            title: 'Login troubleshooting',
            description: 'Resolve common login and access issues',
            popular: true
          },
          {
            title: 'Session management',
            description: 'Monitor and control your active sessions'
          }
        ]
      }
  ];


  const popularArticles = [
    'How to create your OnlyFur account',
    'Uploading and organizing your content',
    'How payments work on OnlyFur',
    'Community guidelines overview',
    'Creator earnings and payouts',
    'Subscription renewal and cancellation',
    'How to message creators',
    'Setting content privacy levels',
    'Mobile app features and limitations',
    'Account security',
    'Password reset guide',
    'Login troubleshooting'
  ];

  const quickLinks = [
    { title: 'Contact Support', href: '/contact', icon: Mail },
    { title: 'Community Guidelines', href: '/guidelines', icon: FileText },
    { title: 'Video Tutorials', href: '#', icon: Video },
    { title: 'Creator Resources', href: '/creator-resources', icon: Star }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Help Center</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          How Can We Help You?
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions, learn how to use OnlyFur features, and get support when you need it.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <link.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium text-sm">
                  <Link to={link.href} className="hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      {searchQuery === '' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <Link key={index} to={getPopularArticleLink(article)}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <h3 className="font-medium">{article}</h3>
                        <Badge variant="secondary" className="mt-1">Popular</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse by Category'}
        </h2>
        
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <Collapsible
                open={openCategories.includes(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${category.color}`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline-solid">{category.articles.length} articles</Badge>
                        {openCategories.includes(category.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {category.articles.map((article, index) => (
                        <Link
                          key={index}
                          to={getArticleLink(article)}
                          className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium mb-1 flex items-center">
                                {article.title}
                                {article.popular && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">{article.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && searchQuery && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any articles matching "{searchQuery}". Try a different search term or browse our categories.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Support */}
      <Card className="bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? Our support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/guidelines">
                <FileText className="w-4 h-4 mr-2" />
                Community Guidelines
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;
