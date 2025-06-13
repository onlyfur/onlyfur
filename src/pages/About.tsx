import React from 'react';
import { Heart, Users, Shield, Star, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize creating a safe, welcoming space for the furry community to express themselves and connect.',
      color: 'text-pink-500'
    },
    {
      icon: Shield,
      title: 'Safety & Privacy',
      description: 'Your security and privacy are paramount. We use industry-leading practices to protect your content and data.',
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Creator Empowerment',
      description: 'We believe creators should have control over their content and fair compensation for their work.',
      color: 'text-green-500'
    },
    {
      icon: Star,
      title: 'Quality Content',
      description: 'We foster an environment where high-quality, creative content thrives and is properly valued.',
      color: 'text-purple-500'
    }
  ];

  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      bio: 'Passionate about empowering creators and building inclusive communities.',
      avatar: '🦊'
    },
    {
      name: 'Sam Rivera',
      role: 'Head of Community',
      bio: 'Dedicated to fostering a safe and welcoming environment for all users.',
      avatar: '🐺'
    },
    {
      name: 'Jordan Fox',
      role: 'Lead Developer',
      bio: 'Building the technology that powers creator success.',
      avatar: '🦝'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">About OnlyFur</span>
          <Crown className="h-4 w-4 text-primary" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
          Building the Future of Furry Content
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          OnlyFur is a platform built by the furry community, for the furry community. We're creating a space where 
          creators can monetize their passion while providing fans with exclusive access to high-quality furry content.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <Card className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-none">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex p-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white mb-4 mx-auto w-fit">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              To create a sustainable ecosystem where furry creators can thrive financially while providing their 
              audience with authentic, high-quality content. We believe in fair compensation, creative freedom, 
              and building genuine connections within the furry community.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground">
            The principles that guide everything we do
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className={`inline-flex p-3 rounded-full bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4 mx-auto w-fit`}>
                  <value.icon className={`h-6 w-6 ${value.color}`} />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground">
            The passionate individuals building OnlyFur
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <Badge variant="outline" className="mx-auto">{member.role}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {member.bio}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mb-16">
        <Card className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-none">
          <CardContent className="py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">Growing</div>
                <div className="text-purple-100">Creator Community</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Fresh</div>
                <div className="text-purple-100">Content Daily</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-purple-100">Community Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Have questions or want to learn more? We'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Card className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">General Inquiries</h3>
              <p className="text-muted-foreground">hello@onlyfur.com</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Creator Support</h3>
              <p className="text-muted-foreground">creators@onlyfur.com</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Technical Support</h3>
              <p className="text-muted-foreground">support@onlyfur.com</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
