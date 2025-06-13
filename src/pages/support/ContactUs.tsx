import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Shield,
  CreditCard,
  Flag,
  Settings,
  Users
} from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email with detailed responses',
      contact: 'support@onlyfur.com',
      responseTime: '24-48 hours',
      availability: '24/7'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available in-app',
      responseTime: '5-15 minutes',
      availability: 'Mon-Fri 9AM-6PM PST'
    },
    {
      icon: Phone,
      title: 'Emergency Line',
      description: 'For urgent safety concerns only',
      contact: '+1 (555) 123-4567',
      responseTime: 'Immediate',
      availability: '24/7'
    }
  ];

  const supportCategories = [
    {
      value: 'account',
      label: 'Account Issues',
      icon: Users,
      description: 'Login problems, account settings, verification'
    },
    {
      value: 'billing',
      label: 'Billing & Payments',
      icon: CreditCard,
      description: 'Subscription issues, payment problems, refunds'
    },
    {
      value: 'technical',
      label: 'Technical Support',
      icon: Settings,
      description: 'App bugs, upload issues, performance problems'
    },
    {
      value: 'safety',
      label: 'Safety & Abuse',
      icon: Shield,
      description: 'Report harassment, inappropriate content, safety concerns'
    },
    {
      value: 'content',
      label: 'Content Issues',
      icon: Flag,
      description: 'Copyright claims, content removal, moderation'
    },
    {
      value: 'general',
      label: 'General Questions',
      icon: HelpCircle,
      description: 'Platform questions, feature requests, feedback'
    }
  ];

  const faqQuestions = [
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and follow the email instructions.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Go to Settings > Subscription > Cancel Subscription. You\'ll keep access until the end of your billing period.'
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'Click the report button on any content or contact our safety team directly.'
    },
    {
      question: 'When do creators get paid?',
      answer: 'Creator earnings are processed weekly on Fridays for the previous week\'s earnings.'
    },
    {
      question: 'How do I verify my creator account?',
      answer: 'Submit ID verification through your creator dashboard. The process takes 1-3 business days.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="text-center bg-green-50 dark:bg-green-900/10 border-green-200">
          <CardContent className="p-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-600" />
            <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for contacting us. We've received your message and will respond within 24-48 hours.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Your submission details:</h3>
              <p><strong>Category:</strong> {supportCategories.find(c => c.value === formData.category)?.label}</p>
              <p><strong>Subject:</strong> {formData.subject}</p>
              <p><strong>Priority:</strong> {formData.priority}</p>
              <p><strong>Ticket ID:</strong> #OF{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 px-4 py-2 rounded-full mb-6">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Contact Support</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
          We're Here to Help
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Have a question, need assistance, or want to report an issue? Our support team is ready to help 
          you get the most out of OnlyFur.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <method.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Contact:</strong> {method.contact}</p>
                  <p><strong>Response:</strong> {method.responseTime}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{method.availability}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-2">
                            <category.icon className="w-4 h-4" />
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select onValueChange={(value) => handleInputChange('priority', value)} defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General question</SelectItem>
                      <SelectItem value="normal">Normal - Standard issue</SelectItem>
                      <SelectItem value="high">High - Urgent issue</SelectItem>
                      <SelectItem value="emergency">Emergency - Safety concern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please provide as much detail as possible about your issue..."
                    rows={6}
                    required
                  />
                </div>

                {/* Emergency Notice */}
                {formData.priority === 'emergency' && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      For immediate safety concerns, please also call our emergency line at +1 (555) 123-4567 
                      or contact local emergency services if needed.
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions. You might find what you're looking for here!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqQuestions.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Need more detailed help? Check out our comprehensive help center.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/help">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Visit Help Center
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Categories Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Support Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <category.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">{category.label}</h4>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Response Times */}
      <div className="mt-16">
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Expected Response Times</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm font-medium">Emergency</div>
                <div className="text-xs text-muted-foreground">Immediate</div>
              </div>
              <div>
                <div className="text-sm font-medium">High Priority</div>
                <div className="text-xs text-muted-foreground">Within 4 hours</div>
              </div>
              <div>
                <div className="text-sm font-medium">Normal</div>
                <div className="text-xs text-muted-foreground">24-48 hours</div>
              </div>
              <div>
                <div className="text-sm font-medium">Low Priority</div>
                <div className="text-xs text-muted-foreground">2-5 business days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;
