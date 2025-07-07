import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Crown, Mail, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import RoleSelector from '@/components/auth/RoleSelector';
import EnhancedRoleSelector from '@/components/auth/EnhancedRoleSelector';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { getRedirectPathAfterLogin, isNewUser } from '@/utils/userUtils';


const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['creator', 'subscriber']), // required
  selectedTier: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  newsletter: z.boolean(), // required
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'creator' | 'subscriber' | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'subscriber',
    },
  });

  const agreeToTerms = watch('agreeToTerms');

  // Update form role and tier when selectors change
  React.useEffect(() => {
    if (selectedRole) {
      setValue('role', selectedRole);
    }
  }, [selectedRole, setValue]);

  React.useEffect(() => {
    if (selectedTier) {
      setValue('selectedTier', selectedTier);
    }
  }, [selectedTier, setValue]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Form data:', data);
      console.log('Selected role:', selectedRole);
      console.log('Selected tier:', selectedTier);
      
      // Register the user with all the data
      await registerUser({
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        role: data.role,
        password: data.password,
        selectedTier: data.selectedTier || selectedTier,
        agreeToTerms: data.agreeToTerms,
        newsletter: data.newsletter,
      }, (user) => {
        // Show success toast
        toast({
          title: "Registration Successful!",
          description: `Welcome to OnlyFur, ${data.displayName}! You've been automatically signed in.`,
        });
        
        // Check if selected plan requires payment
        const freeTiers = ['free-creator', 'basic-creator', 'free-subscriber', 'basic-subscriber'];
        const requiresPayment = selectedTier && !freeTiers.includes(selectedTier);
        
        if (requiresPayment) {
          // Redirect to payment setup
          navigate('/payment-setup', { 
            state: { 
              userId: user.id,
              selectedTier: selectedTier,
              userEmail: user.email,
              canSkip: true 
            } 
          });
        } else {
          // For new users, always redirect to setup first, then dashboard
          if (isNewUser(user)) {
            navigate('/setup');
          } else {
            const redirectPath = getRedirectPathAfterLogin(user);
            navigate(redirectPath);
          }
        }
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && selectedRole) {
      setCurrentStep(2);
      setError(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const canProceedToStep2 = selectedRole !== null;

  // Google registration handler
  const handleGoogleRegister = async (credential: string) => {
    if (!selectedRole || !selectedTier) {
      setError('Please select your role and plan before using Google registration');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the auth service with Google credential and registration data
      await loginWithGoogle(credential, selectedRole, (user) => {
        // Show success toast
        toast({
          title: "Registration Successful!",
          description: `Welcome to OnlyFur, ${user.displayName}! You've been automatically signed in.`,
        });
        
        // Check if selected plan requires payment
        const freeTiers = ['free-creator', 'basic-creator', 'free-subscriber', 'basic-subscriber'];
        const requiresPayment = selectedTier && !freeTiers.includes(selectedTier);
        
        if (requiresPayment) {
          // Redirect to payment setup
          navigate('/payment-setup', { 
            state: { 
              userId: user.id,
              selectedTier: selectedTier,
              userEmail: user.email,
              canSkip: true 
            } 
          });
        } else {
          // For new users, redirect to setup, then dashboard
          if (isNewUser(user)) {
            navigate('/setup');
          } else {
            const redirectPath = getRedirectPathAfterLogin(user);
            navigate(redirectPath);
          }
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google registration failed';
      setError(errorMessage);
      toast({
        title: "Google Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-purple-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Logo size="lg" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Join the OnlyFur Pack</h1>
          <p className="text-muted-foreground mt-2">
            Start your furry creator journey or discover amazing content
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
          {/* Step 1: Role Selection */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Choose Your Path</CardTitle>
                <CardDescription>
                  Select your account type to get started with OnlyFur
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <EnhancedRoleSelector
                  selectedRole={selectedRole}
                  selectedTier={selectedTier}
                  onRoleSelect={setSelectedRole}
                  onTierSelect={setSelectedTier}
                  showTierSelection={true}
                />

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => navigate('/')} className="button-interactive">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    disabled={!canProceedToStep2}
                    className="button-interactive"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Account Details */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  Complete your {selectedRole} registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Google Register Button */}
                <div className="mb-6">
                  <GoogleLoginButton 
                    mode="register" 
                    userType={selectedRole || 'subscriber'} 
                    onSuccess={handleGoogleRegister}
                  />
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          placeholder="username"
                          className="pl-10"
                          {...register('username')}
                        />
                      </div>
                      {errors.username && (
                        <p className="text-sm text-destructive">{errors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Your Name"
                        {...register('displayName')}
                      />
                      {errors.displayName && (
                        <p className="text-sm text-destructive">{errors.displayName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        {...register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms || false}
                      onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={handlePrevStep} className="button-interactive">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading} className="button-interactive">
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Register;
