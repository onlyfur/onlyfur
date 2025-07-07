import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Heart, 
  Star
} from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'creator' | 'subscriber' | null;
  onRoleSelect: (role: 'creator' | 'subscriber') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  const [activeTab, setActiveTab] = useState<'subscriber' | 'creator'>('subscriber');
  const roles = [
    {
      id: 'subscriber' as const,
      title: 'For Furry Fans',
      description: 'Discover and support amazing furry creators',
      icon: Heart,
      features: [
        'Access exclusive furry content',
        'Connect with favorite creators',
        'Join the furry community',
        'Support artists you love',
        'Get early access to new content'
      ],
      benefits: [
        'Free & premium content',
        'Direct messaging',
        'Community discussions',
        'Personalized recommendations'
      ],
      gradient: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'creator' as const,
      title: 'For Creators',
      description: 'Monetize your furry content and build your pack',
      icon: Crown,
      features: [
        'Upload and sell furry content',
        'Build your subscriber base',
        'Earn money from your art',
        'Connect with your pack',
        'Access creator tools'
      ],
      benefits: [
        'Multiple revenue streams',
        'Advanced analytics',
        'Creator community',
        'Pro tools & features'
      ],
      gradient: 'from-orange-500 to-red-600',
      popular: false
    }
  ];

  const activeRole = roles.find((role) => role.id === activeTab);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">Choose Your OnlyFur Experience</h2>
        <p className="text-muted-foreground text-lg mb-4">Select how you'd like to experience the platform</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={activeTab === 'subscriber' ? 'default' : 'outline'}
          className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200 ${activeTab === 'subscriber' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveTab('subscriber')}
        >
          Subscriber Plans
        </Button>
        <Button
          variant={activeTab === 'creator' ? 'default' : 'outline'}
          className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200 ${activeTab === 'creator' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveTab('creator')}
        >
          Creator Plans
        </Button>
      </div>

      {/* Show only the selected plan */}
      <div className="max-w-2xl mx-auto">
        {activeRole && (
          <Card
            key={activeRole.id}
            className={`relative group transition-all duration-300 border-2 ${selectedRole === activeRole.id ? 'border-primary shadow-2xl scale-105' : 'border-transparent hover:border-primary/40 hover:shadow-lg'} bg-gradient-to-br ${activeRole.gradient} bg-opacity-10 backdrop-blur-md`}
            onClick={() => onRoleSelect(activeRole.id)}
          >
            {activeRole.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground shadow">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 shadow-lg bg-gradient-to-br ${activeRole.gradient}`}> 
                <activeRole.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold mb-1">{activeRole.title}</CardTitle>
              <CardDescription className="text-base text-muted-foreground mb-2">{activeRole.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-2">What You Get</h4>
                <ul className="space-y-1">
                  {activeRole.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-yellow-600 mb-2">Key Benefits</h4>
                <ul className="space-y-1">
                  {activeRole.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="gradient"
                className="w-full mt-4 font-semibold text-lg transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleSelect(activeRole.id);
                }}
              >
                {selectedRole === activeRole.id ? 'Selected' : `Choose ${activeRole.id === 'creator' ? 'Creator' : 'Subscriber'}`}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedRole && (
        <div className="text-center p-4 bg-muted rounded-lg border mt-6 max-w-xl mx-auto">
          <p className="text-base text-muted-foreground">
            You selected <strong>{selectedRole === 'creator' ? 'Creator' : 'Subscriber'}</strong>. You can always change this later in your profile settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
