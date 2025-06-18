import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Book, Shield, CreditCard, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>(['getting-started']);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using OnlyFur',
      color: 'text-blue-500',
      articles: 12
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Manage your subscriptions and payments',
      color: 'text-green-500',
      articles: 8
    },
    {
      icon: Shield,
      title: 'Safety & Privacy',
      description: 'Stay safe and protect your privacy',
      color: 'text-purple-500',
      articles: 8
    },
    {
      icon: Search,
      title: 'Search Features',
      description: 'Find content and creators effectively',
      color: 'text-indigo-500',
      articles: 4
    },
    {
      icon: MessageCircle,
      title: 'Messaging & Communication',
      description: 'How to connect with others',
      color: 'text-pink-500',
      articles: 7
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Manage your account preferences',
      color: 'text-gray-500',
      articles: 9
    }
  ];

  const faqData = [
    {
      id: 'getting-started',
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account on OnlyFur?',
          answer: 'You can create an account by clicking the "Sign Up" button and choosing between a Creator or Subscriber role. You can register with email or use Google authentication for quick access.'
        },
        {
          question: 'What\'s the difference between Creator and Subscriber accounts?',
          answer: 'Creator accounts allow you to upload content, manage subscriptions, and earn money from your content. Subscriber accounts let you discover and support creators by purchasing subscriptions and accessing exclusive content.'
        },
        {
          question: 'Is OnlyFur safe for the furry community?',
          answer: 'Yes! OnlyFur is designed specifically for the furry community with strict community guidelines, content moderation, and safety features to ensure a welcoming environment for all users.'
        }
      ]
    },
    {
      id: 'subscriptions',
      category: 'Billing & Subscriptions',
      questions: [
        {
          question: 'How do subscription tiers work?',
          answer: 'OnlyFur offers multiple subscription tiers (Basic, Pro, VIP) with different features and content access levels. Higher tiers provide more content access, better messaging capabilities, and additional perks.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards, PayPal, and other secure payment methods. All payments are processed securely through industry-standard payment processors.'
        }
      ]
    },
    {
      id: 'search',
      category: 'Search Features',
      questions: [
        {
          question: 'What is Neural Search and how does it work?',
          answer: 'Neural Search is our AI-powered search technology that understands the meaning behind your queries, not just keywords. It uses advanced machine learning to deliver more relevant results based on context and intent.'
        },
        {
          question: 'How do I use advanced search filters?',
          answer: 'Click the filter icon in the search bar to access advanced filters. You can filter by content type, creator category, date range, and more to refine your search results.'
        },
        {
          question: 'Can I search using an image?',
          answer: 'Yes! Our Visual Search feature allows you to upload an image to find similar content or creators with matching styles. Simply switch to "Visual" search mode in the search modal.'
        }
      ]
    },
    {
      id: 'creators',
      category: 'Creator Resources',
      questions: [
        {
          question: 'How do I start earning as a creator?',
          answer: 'Create a creator account, set up your profile, choose your subscription pricing, and start uploading content. You can earn through subscriptions, tips, and custom content requests.'
        },
        {
          question: 'What content can I upload?',
          answer: 'You can upload photos, videos, artwork, stories, and other furry-related content. All content must comply with our community guidelines and terms of service.'
        },
        {
          question: 'How much can I earn on OnlyFur?',
          answer: 'Earnings vary based on your content quality, audience size, and engagement. Our creator tiers offer different revenue sharing rates, with higher tiers keeping more of their earnings.'
        }
      ]
    }
  ];

  const popularArticles = [
    'How to set up your creator profile',
    'Understanding subscription tiers',
    'Community guidelines and safety',
    'Payment and withdrawal options',
    'Content uploading best practices',
    'Managing your subscribers',
    'Using Neural Search features',
    'Advanced search techniques',
    'Privacy settings and content visibility',
    'Two-factor authentication setup'
  ];

  // List of all neural search help articles and their categories
  const neuralHelpArticles = [
    {
      title: 'How to Create Your OnlyFur Account',
      url: '/help/articles/how-to-create-account',
      category: 'Getting Started',
    },
    {
      title: 'Age Verification Process',
      url: '/help/articles/age-verification',
      category: 'Safety & Privacy',
    },
    {
      title: 'Content Protection for Creators',
      url: '/help/articles/content-protection',
      category: 'Safety & Privacy',
    },
    {
      title: 'Bulk Messaging',
      url: '/help/articles/bulk-messaging',
      category: 'Messaging & Communication',
    },
    {
      title: 'Tax Information for Creators',
      url: '/help/articles/tax-information',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Refund Policy',
      url: '/help/articles/refund-policy',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Subscription Management',
      url: '/help/articles/subscription-management',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Content Privacy Levels',
      url: '/help/articles/content-privacy-levels',
      category: 'Safety & Privacy',
    },
    {
      title: 'Messaging Creators',
      url: '/help/articles/messaging-creators',
      category: 'Messaging & Communication',
    },
    {
      title: 'Creator Earnings',
      url: '/help/articles/creator-earnings',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Account Security',
      url: '/help/articles/account-security',
      category: 'Safety & Privacy',
    },
    {
      title: 'Mobile App',
      url: '/help/articles/mobile-app',
      category: 'Getting Started',
    },
    {
      title: 'Upload & Organize Content',
      url: '/help/articles/upload-organize-content',
      category: 'Creator Resources',
    },
    {
      title: 'Finding Creators',
      url: '/help/articles/finding-creators',
      category: 'Search Features',
    },
    {
      title: 'Your First Subscription',
      url: '/help/articles/first-subscription',
      category: 'Getting Started',
    },
    {
      title: 'Subscription Tiers Overview',
      url: '/help/articles/subscription-tiers-overview',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Payment Methods',
      url: '/help/articles/payment-methods',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'How Payments Work',
      url: '/help/articles/payment-system',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Message Limits',
      url: '/help/articles/message-limits',
      category: 'Messaging & Communication',
    },
    {
      title: 'Messaging Tips',
      url: '/help/articles/messaging-tips',
      category: 'Messaging & Communication',
    },
    {
      title: 'Report User Content',
      url: '/help/articles/report-user-content',
      category: 'Safety & Privacy',
    },
    {
      title: 'Community Guidelines',
      url: '/help/articles/community-guidelines',
      category: 'Safety & Privacy',
    },
    {
      title: 'Pricing Strategies',
      url: '/help/articles/pricing-strategies',
      category: 'Billing & Subscriptions',
    },
    {
      title: 'Scheduling Features',
      url: '/help/articles/scheduling-features',
      category: 'Creator Resources',
    },
    {
      title: 'Understanding Analytics',
      url: '/help/articles/understanding-analytics',
      category: 'Creator Resources',
    },
    {
      title: 'Custom Commissions',
      url: '/help/articles/custom-commissions',
      category: 'Creator Resources',
    },
    {
      title: 'Setting Up Creator Profile',
      url: '/help/articles/setting-up-creator-profile',
      category: 'Getting Started',
    },
    {
      title: 'Supported Formats',
      url: '/help/articles/supported-formats',
      category: 'Creator Resources',
    },
    {
      title: 'Upload Troubleshooting',
      url: '/help/articles/upload-troubleshooting',
      category: 'Creator Resources',
    },
    {
      title: 'Video Quality',
      url: '/help/articles/video-quality',
      category: 'Creator Resources',
    },
    {
      title: 'Browser Compatibility',
      url: '/help/articles/browser-compatibility',
      category: 'Safety & Privacy',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Find answers to your questions and get help with OnlyFur
        </p>
        
        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get personalized help from our support team
            </CardDescription>
            <Button className="mt-4" variant="outline">
              Send Message
            </Button>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Book className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <CardTitle>Creator Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Comprehensive guide for new creators
            </CardDescription>
            <Button className="mt-4" variant="outline">
              Read Guide
            </Button>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <CardTitle>Safety Center</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Learn about safety features and best practices
            </CardDescription>
            <Button className="mt-4" variant="outline">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <category.icon className={`h-6 w-6 ${category.color} mr-3`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{category.articles}</Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-4">
                      {neuralHelpArticles.filter(a => a.category === category.title).map((article, idx) => (
                        <li key={idx}>
                          <Link to={article.url} className="text-blue-600 hover:underline">{article.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqData.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.questions.map((faq, index) => (
                      <Collapsible
                        key={index}
                        open={openSections.includes(`${section.id}-${index}`)}
                        onOpenChange={() => toggleSection(`${section.id}-${index}`)}
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-muted transition-colors">
                          <span className="font-medium">{faq.question}</span>
                          {openSections.includes(`${section.id}-${index}`) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div key={index} className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{article}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Email Support</h4>
                  <p className="text-sm text-muted-foreground">support@onlyfur.com</p>
                  <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Creator Support</h4>
                  <p className="text-sm text-muted-foreground">creators@onlyfur.com</p>
                  <p className="text-xs text-muted-foreground">Specialized creator assistance</p>
                </div>
                <Button className="w-full" variant="outline">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
