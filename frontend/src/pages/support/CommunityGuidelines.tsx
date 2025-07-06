import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Heart, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Flag,
  MessageCircle,
  Camera,
  Palette,
  Crown,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityGuidelines: React.FC = () => {
  const coreValues = [
    {
      icon: Heart,
      title: 'Respect & Inclusivity',
      description: 'Treat all community members with kindness and respect, regardless of their background, experience level, or personal characteristics.',
      color: 'text-pink-500'
    },
    {
      icon: Star,
      title: 'Authentic Expression',
      description: 'Celebrate the diversity of the furry fandom while maintaining authenticity in your interactions and content.',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Prioritize the safety and wellbeing of all community members, especially when creating or sharing content.',
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Support fellow creators and fans, foster collaboration, and help newcomers feel welcome.',
      color: 'text-green-500'
    }
  ];

  const contentGuidelines = [
    {
      category: 'Furry Art & Photography',
      icon: Palette,
      allowed: [
        'Original furry artwork in all styles and mediums',
        'Fursuit photography and videos',
        'Character reference sheets and designs',
        'Convention and meetup photography',
        'Art tutorials and process videos',
        'Commission showcases and portfolios'
      ],
      notAllowed: [
        'Artwork depicting minors in any context',
        'Non-consensual or stolen artwork',
        'Extremely violent or disturbing content',
        'Content that promotes illegal activities'
      ]
    },
    {
      category: 'Video Content',
      icon: Camera,
      allowed: [
        'Fursuit performances and dancing',
        'Convention vlogs and experiences',
        'Art creation timelapses',
        'Educational content about furry culture',
        'Character acting and roleplay',
        'Gaming content with furry themes'
      ],
      notAllowed: [
        'Videos featuring real minors',
        'Extremely graphic or disturbing content',
        'Content encouraging dangerous behaviors',
        'Unauthorized recordings of others'
      ]
    },
    {
      category: 'Community Interaction',
      icon: MessageCircle,
      allowed: [
        'Constructive feedback and criticism',
        'Sharing personal furry experiences',
        'Organizing community events',
        'Collaborative projects and challenges',
        'Supporting creators through tips and subscriptions',
        'Respectful discussions about furry topics'
      ],
      notAllowed: [
        'Harassment, bullying, or targeted attacks',
        'Spam or excessive self-promotion',
        'Sharing personal information without consent',
        'Impersonating other users',
        'Manipulating platform features'
      ]
    }
  ];

  const behaviorStandards = [
    {
      title: 'Respectful Communication',
      description: 'Use kind, constructive language in all interactions',
      examples: [
        'Provide helpful feedback on artwork',
        'Ask questions respectfully',
        'Disagree without being disagreeable',
        'Use appropriate language for the platform'
      ]
    },
    {
      title: 'Consent & Boundaries',
      description: 'Always respect others\' boundaries and obtain consent',
      examples: [
        'Ask before sharing someone else\'s content',
        'Respect "no" as a complete answer',
        'Don\'t pressure creators for specific content',
        'Honor content creators\' pricing and terms'
      ]
    },
    {
      title: 'Authentic Representation',
      description: 'Be honest about who you are and what you create',
      examples: [
        'Use your own artwork and photos',
        'Credit other artists when sharing their work',
        'Don\'t impersonate other community members',
        'Be transparent about commissioned vs. original work'
      ]
    },
    {
      title: 'Supporting the Community',
      description: 'Help make OnlyFur a welcoming space for everyone',
      examples: [
        'Welcome new community members',
        'Share knowledge and resources',
        'Report inappropriate content or behavior',
        'Participate in community events and discussions'
      ]
    }
  ];

  const violationConsequences = [
    {
      severity: 'Minor Violations',
      examples: ['Spam posting', 'Minor guideline oversights', 'Inappropriate language'],
      consequences: ['Warning message', 'Content removal', 'Temporary restrictions'],
      color: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10'
    },
    {
      severity: 'Moderate Violations',
      examples: ['Harassment', 'Sharing inappropriate content', 'Repeated minor violations'],
      consequences: ['Account suspension (1-7 days)', 'Content removal', 'Feature restrictions'],
      color: 'border-orange-200 bg-orange-50 dark:bg-orange-900/10'
    },
    {
      severity: 'Severe Violations',
      examples: ['Illegal content', 'Doxxing', 'Serious harassment', 'Safety threats'],
      consequences: ['Permanent account ban', 'Content deletion', 'Law enforcement referral'],
      color: 'border-red-200 bg-red-50 dark:bg-red-900/10'
    }
  ];

  const reportingGuidelines = [
    {
      when: 'Content Violations',
      description: 'Report content that violates our guidelines',
      action: 'Use the report button on posts, comments, or messages'
    },
    {
      when: 'User Behavior',
      description: 'Report users who harass, spam, or break community rules',
      action: 'Report from their profile or through direct messages'
    },
    {
      when: 'Safety Concerns',
      description: 'Report anything that makes you feel unsafe',
      action: 'Use priority reporting or contact safety@onlyfur.net'
    },
    {
      when: 'Technical Issues',
      description: 'Report bugs or technical problems',
      action: 'Contact support through the help center'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full mb-6">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Community Guidelines</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Building a Positive Community Together
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          These guidelines help us maintain a safe, welcoming, and creative environment 
          where all members of the furry community can thrive and express themselves authentically.
        </p>
      </div>

      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {coreValues.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${value.color}`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Guidelines */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Content Guidelines</h2>
        <div className="space-y-8">
          {contentGuidelines.map((guideline, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <guideline.icon className="w-6 h-6 mr-3 text-primary" />
                  {guideline.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Encouraged Content
                    </h4>
                    <ul className="space-y-2">
                      {guideline.allowed.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      Prohibited Content
                    </h4>
                    <ul className="space-y-2">
                      {guideline.notAllowed.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <XCircle className="w-3 h-3 text-red-500 mt-1 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Behavior Standards */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Behavior Standards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {behaviorStandards.map((standard, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{standard.title}</CardTitle>
                <CardDescription>{standard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-3">Examples:</h4>
                <ul className="space-y-2">
                  {standard.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                      <span className="text-sm">{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Violation Consequences */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Violation Consequences</h2>
        <div className="space-y-6">
          {violationConsequences.map((violation, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${violation.color}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{violation.severity}</h3>
                    <div className="flex flex-wrap gap-2">
                      {violation.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Possible Consequences:</h4>
                  <ul className="space-y-1">
                    {violation.consequences.map((consequence, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-sm">{consequence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reporting Guidelines */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How to Report Violations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reportingGuidelines.map((guideline, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Flag className="w-4 h-4 mr-2 text-red-500" />
                  {guideline.when}
                </h3>
                <p className="text-muted-foreground mb-3">{guideline.description}</p>
                <p className="text-sm font-medium">{guideline.action}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-16">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Remember:</strong> These guidelines apply to all areas of OnlyFur, including profiles, 
            content, comments, messages, and any other interactions. When in doubt, choose kindness and respect.
          </AlertDescription>
        </Alert>
      </div>

      {/* Call to Action */}
      <Card className="text-center bg-linear-to-r from-purple-500 to-blue-500 text-white border-0">
        <CardContent className="p-8">
          <Crown className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Help Us Build an Amazing Community</h2>
          <p className="text-lg mb-6 opacity-90">
            By following these guidelines, you help create a space where creativity flourishes 
            and every member feels welcome and valued.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/safety">
                <Shield className="w-4 h-4 mr-2" />
                Learn About Safety
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityGuidelines;
