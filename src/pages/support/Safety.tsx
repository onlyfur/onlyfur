import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  UserCheck, 
  Flag,
  Heart,
  CheckCircle,
  XCircle,
  Users,
  MessageCircle,
  Camera,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Safety: React.FC = () => {
  const safetyFeatures = [
    {
      icon: UserCheck,
      title: 'Age Verification',
      description: 'All users must verify they are 18+ to join our platform',
      details: 'We use industry-standard age verification to ensure a mature, responsible community.'
    },
    {
      icon: Eye,
      title: 'Content Moderation',
      description: 'Professional moderation team reviews content 24/7',
      details: 'Trained moderators ensure all content meets our community standards.'
    },
    {
      icon: Lock,
      title: 'Privacy Controls',
      description: 'Granular privacy settings for all users',
      details: 'Control who can see your content, message you, and interact with your profile.'
    },
    {
      icon: Flag,
      title: 'Easy Reporting',
      description: 'One-click reporting for inappropriate content or behavior',
      details: 'Quick and anonymous reporting system with fast response times.'
    }
  ];

  const safetyTips = [
    {
      category: 'Personal Information',
      icon: Lock,
      tips: [
        'Never share your real name, address, or phone number publicly',
        'Use OnlyFur\'s messaging system instead of external platforms',
        'Be cautious about sharing location information in content',
        'Keep financial information private and secure'
      ]
    },
    {
      category: 'Online Interactions',
      icon: MessageCircle,
      tips: [
        'Trust your instincts - if something feels wrong, it probably is',
        'Report users who make you feel uncomfortable',
        'Don\'t feel pressured to create content you\'re not comfortable with',
        'Set clear boundaries and communicate them clearly'
      ]
    },
    {
      category: 'Content Creation',
      icon: Camera,
      tips: [
        'Only share content you own or have permission to use',
        'Consider the long-term implications of content you post',
        'Use watermarks to protect your original artwork',
        'Be aware of what\'s visible in the background of photos/videos'
      ]
    },
    {
      category: 'Financial Safety',
      icon: Shield,
      tips: [
        'Only use OnlyFur\'s official payment systems',
        'Never send money or gifts to other users outside the platform',
        'Be wary of "investment opportunities" or "get rich quick" schemes',
        'Keep records of all transactions for tax purposes'
      ]
    }
  ];

  const reportingProcess = [
    {
      step: 1,
      title: 'Identify the Issue',
      description: 'Determine what type of content or behavior needs to be reported',
      examples: ['Harassment', 'Inappropriate content', 'Spam', 'Copyright violation']
    },
    {
      step: 2,
      title: 'Use Report Button',
      description: 'Click the report button on the content or user profile',
      examples: ['Content report button', 'Profile report option', 'Message reporting']
    },
    {
      step: 3,
      title: 'Provide Details',
      description: 'Give specific information about the issue',
      examples: ['Describe the problem', 'Select violation type', 'Add context if needed']
    },
    {
      step: 4,
      title: 'Review & Action',
      description: 'Our team reviews and takes appropriate action within 24 hours',
      examples: ['Content removal', 'User warnings', 'Account suspension', 'Legal action if needed']
    }
  ];

  const communityStandards = [
    {
      allowed: true,
      category: 'Furry Art & Content',
      items: [
        'Original furry videography and photography',
        'Fursuit / Murrsuit photos and videos',
        'Character art',
        'Convention and meetup content',
        'Tutorial and educational content'
      ]
    },
    {
      allowed: true,
      category: 'Community Interaction',
      items: [
        'Respectful discussions about furry topics',
        'Constructive feedback on artwork',
        'Sharing convention experiences',
        'Supporting fellow community members',
        'Collaborative projects and events'
      ]
    },
    {
      allowed: false,
      category: 'Prohibited Content',
      items: [
        'Content involving minors',
        'Non-consensual content',
        'Harassment or bullying',
        'Hate speech or discrimination',
        'Content that violates copyright'
      ]
    },
    {
      allowed: false,
      category: 'Prohibited Behavior',
      items: [
        'Impersonating other users',
        'Spam or excessive self-promotion',
        'Sharing personal information of others',
        'Manipulating platform features',
        'Circumventing safety measures'
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Safety Center</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Your Safety is Our Priority
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Learn about our safety features, community standards, and how we work together 
          to maintain a safe, welcoming environment for all furry community members.
        </p>
      </div>

      {/* Safety Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How We Keep You Safe</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {safetyFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-2">{feature.description}</p>
                    <p className="text-sm text-muted-foreground">{feature.details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Safety Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {safetyTips.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <category.icon className="w-5 h-5 mr-3 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reporting Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How to Report Issues</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {reportingProcess.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 font-bold">{step.step}</span>
                </div>
                <h3 className="font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                <div className="space-y-1">
                  {step.examples.map((example, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs mr-1 mb-1">
                      {example}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Standards */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Community Standards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {communityStandards.map((standard, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${
              standard.allowed 
                ? 'border-green-200 bg-green-50 dark:bg-green-900/10' 
                : 'border-red-200 bg-red-50 dark:bg-red-900/10'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  {standard.allowed ? (
                    <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-3 text-red-600" />
                  )}
                  {standard.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {standard.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      {standard.allowed ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <Alert className="mb-16 border-orange-200 bg-orange-50 dark:bg-orange-900/10">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <strong>Emergency Situations:</strong> If you believe someone is in immediate danger, 
          contact your local emergency services (911, 999, etc.) first, then report the situation to us. 
          For serious safety concerns, email safety@onlyfur.com for priority handling.
        </AlertDescription>
      </Alert>

      {/* Resources */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Additional Resources</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">Community Guidelines</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Detailed rules and expectations for community behavior
              </p>
              <Button variant="outline" asChild>
                <Link to="/guidelines">Read Guidelines</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FileText className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold mb-2">Privacy Policy</h3>
              <p className="text-muted-foreground text-sm mb-4">
                How we protect and use your personal information
              </p>
              <Button variant="outline" asChild>
                <Link to="/privacy">View Policy</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get help from our support team anytime
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact">Get Help</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
        <CardContent className="p-8">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Safety is a Shared Responsibility</h2>
          <p className="text-lg mb-6 opacity-90">
            Help us maintain a safe community by following guidelines and reporting issues when you see them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/guidelines">
                <Heart className="w-4 h-4 mr-2" />
                Read Community Guidelines
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link to="/contact">
                <Flag className="w-4 h-4 mr-2" />
                Report an Issue
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Safety;
