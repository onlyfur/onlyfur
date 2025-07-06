import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Upload, User, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const accountSetupSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name too long'),
  bio: z.string().max(500, 'Bio too long').optional(),
  preferredRole: z.enum(['subscriber', 'creator']),
  avatar: z.string().optional(),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

type AccountSetupForm = z.infer<typeof accountSetupSchema>;

const INTEREST_OPTIONS = [
  'Art', 'Photography', 'Gaming', 'Music', 'Fitness', 'Cooking',
  'Travel', 'Fashion', 'Technology', 'Education', 'Entertainment',
  'Lifestyle', 'Beauty', 'Sports', 'Comedy', 'ASMR'
];

const AccountSetup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountSetupForm>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      preferredRole: user?.role === 'CREATOR' ? 'creator' : 'subscriber',
      interests: [],
    },
  });

  const preferredRole = watch('preferredRole');

  const handleInterestToggle = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setValue('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AccountSetupForm) => {
    setIsLoading(true);
    
    try {      // Update user profile with setup data
      const updateData = {
        displayName: data.displayName,
        bio: data.bio,
        role: data.preferredRole.toUpperCase() as 'CREATOR' | 'SUBSCRIBER',
        avatar: data.avatar,
        // interests: data.interests, // This would need to be added to User type
      };

      // Call update user API
      updateUser(updateData);
      
      toast({
        title: "Account setup complete!",
        description: "Welcome to OnlyFur! Your account has been set up successfully.",
      });

      // Redirect based on role
      if (data.preferredRole === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Account setup failed:', error);
      toast({
        title: "Setup failed",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSkip = () => {
    // Just redirect to dashboard without updating
    toast({
      title: "Setup skipped",
      description: "You can complete your profile setup later in settings.",
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Welcome to OnlyFur!</CardTitle>
              <CardDescription className="text-lg">
                Let's set up your account to get started
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview || user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Label 
                    htmlFor="avatar-upload" 
                    className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Upload a profile picture</p>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="How you want to be known"
                  {...register('displayName')}
                  className={errors.displayName ? 'border-destructive' : ''}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive">{errors.displayName.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  {...register('bio')}
                  className={`resize-none ${errors.bio ? 'border-destructive' : ''}`}
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I want to be a *</Label>                <Select 
                  value={preferredRole} 
                  onValueChange={(value: string) => setValue('preferredRole', value as 'subscriber' | 'creator')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscriber">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Subscriber</div>
                          <div className="text-sm text-muted-foreground">Browse and support creators</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="creator">
                      <div className="flex items-center space-x-2">
                        <Palette className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Creator</div>
                          <div className="text-sm text-muted-foreground">Share content and earn</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Interests *</Label>
                <p className="text-sm text-muted-foreground">
                  Select topics you're interested in to personalize your experience
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-sm text-destructive">{errors.interests.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="sm:w-auto"
                  disabled={isLoading}
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSetup;
