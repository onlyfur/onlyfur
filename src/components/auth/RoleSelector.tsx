import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Heart, 
  Upload, 
  DollarSign, 
  Users, 
  Camera, 
  MessageCircle, 
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'creator' | 'subscriber' | null;
  onRoleSelect: (role: 'creator' | 'subscriber') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  const roles = [
    {
      id: 'subscriber' as const,
      title: 'Join as Subscriber',
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
        'Free and premium content access',
        'Direct messaging with creators',
        'Community discussions',
        'Personalized recommendations'
      ],
      gradient: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'creator' as const,
      title: 'Join as Creator',
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
        'Creator community access',
        'Professional tools and features'
      ],
      gradient: 'from-orange-500 to-red-600',
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Journey</h2>
        <p className="text-muted-foreground">
          Select how you'd like to experience the OnlyFur platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <Card 
              key={role.id}
              className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary shadow-lg' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              {role.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-linear-to-br ${role.gradient} flex items-center justify-center text-white mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    What You Can Do
                  </h4>
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    Key Benefits
                  </h4>
                  {role.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={isSelected ? "default" : "outline"}
                  className="w-full mt-6"
                  onClick={() => onRoleSelect(role.id)}
                >
                  {isSelected ? 'Selected' : `Choose ${role.id === 'creator' ? 'Creator' : 'Subscriber'}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedRole && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            You selected <strong>{selectedRole === 'creator' ? 'Creator' : 'Subscriber'}</strong>. 
            You can always change this later in your profile settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
