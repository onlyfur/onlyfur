import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  Shield, 
  Star, 
  Crown, 
  Sparkles,
  Target,
  Globe,
  Camera,
  Paintbrush
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe in fostering a welcoming, inclusive space where furry creators and fans can express themselves freely and authentically.',
      color: 'text-pink-500'
    },
    {
      icon: Shield,
      title: 'Safety & Privacy',
      description: 'Your security and privacy are paramount. We use industry-leading protection to keep your content and personal information safe.',
      color: 'text-blue-500'
    },
    {
      icon: Star,
      title: 'Creator Empowerment',
      description: 'We provide creators with the tools, resources, and support they need to turn their passion into sustainable income.',
      color: 'text-yellow-500'
    },
    {
      icon: Users,
      title: 'Authentic Connections',
      description: 'We facilitate genuine relationships between creators and their supporters, building lasting communities around shared interests.',
      color: 'text-green-500'
    }
  ];

  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      description: 'Lifelong furry fan with 10+ years experience building creator platforms.',
      avatar: '🦊'
    },
    {
      name: 'Jordan Smith',
      role: 'Head of Community',
      description: 'Former convention organizer passionate about furry community building.',
      avatar: '🐺'
    },
    {
      name: 'Riley Parker',
      role: 'Lead Developer',
      description: 'Full-stack engineer dedicated to creating the best creator experience.',
      avatar: '🐱'
    },
    {
      name: 'Sam Rivera',
      role: 'Creative Director',
      description: 'Professional furry artist helping shape platform design and features.',
      avatar: '🦝'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full mb-6">
          <Crown className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">About OnlyFur</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Empowering the Furry Creative Community
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          OnlyFur is the premier platform connecting furry creators with their fans, providing a safe, 
          supportive environment where creativity thrives and authentic relationships flourish.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-16 border-primary/20 bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
            <Target className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            To create the world's most supportive platform for furry creators, where artists, performers, 
            and content creators can build sustainable careers while fostering meaningful connections with 
            their community. We're dedicated to celebrating furry creativity in all its forms.
          </p>
        </CardContent>
      </Card>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  The Beginning
                </h3>
                <p className="text-muted-foreground mb-4">
                  OnlyFur was born from the realization that furry creators needed a dedicated space 
                  to share their work and connect with fans. Traditional platforms often 
                  misunderstood or restricted furry content, leaving creators without proper support.
                </p>
                <p className="text-muted-foreground">
                  Founded in 2023 by passionate members of the furry community, we set out to build 
                  something different - a platform that truly understands and celebrates furry creativity.
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-primary" />
                  Growing Community
                </h3>
                <p className="text-muted-foreground mb-4">
                  What started as a small platform has grown into a thriving community where creators 
                  from around the world share everything from traditional art and digital illustrations 
                  to fursuit photography and performance videos.
                </p>
                <p className="text-muted-foreground">
                  Today, OnlyFur supports creators at every stage of their journey, from hobbyists 
                  sharing their first drawings to professional artists building full-time careers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${value.color}`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Different</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <Camera className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-3">Furry-First Design</h3>
              <p className="text-muted-foreground">
                Built specifically for the furry community, with features and tools designed 
                around furry content and creativity.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Paintbrush className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-semibold mb-3">Creator-Centric</h3>
              <p className="text-muted-foreground">
                Every feature is designed with creators in mind, from flexible pricing 
                options to comprehensive analytics.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-3">Community Safety</h3>
              <p className="text-muted-foreground">
                Robust moderation and safety features ensure a positive environment 
                for all community members.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-lg mb-6 opacity-90">
            Whether you're a creator or a fan, there's a place for you in the OnlyFur community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Join as Fan
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
              <Link to="/creator-program">
                Become a Creator
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
