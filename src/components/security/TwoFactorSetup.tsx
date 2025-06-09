import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QrCode, Shield, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const verifyTokenSchema = z.object({
  token: z.string().min(6, 'Token must be 6 digits').max(6, 'Token must be 6 digits')
});

type VerifyTokenForm = z.infer<typeof verifyTokenSchema>;

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface SetupData {
  qrCodeUrl: string;
  backupCodes: string[];
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<VerifyTokenForm>({
    resolver: zodResolver(verifyTokenSchema)
  });

  const setup2FA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to setup 2FA');
      }

      const data = await response.json();
      setSetupData(data);
      setStep('verify');

      toast({
        title: "2FA Setup Initiated",
        description: "Scan the QR code with your authenticator app"
      });

    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to setup 2FA",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (data: VerifyTokenForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/2fa/verify-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: data.token })
      });

      if (!response.ok) {
        throw new Error('Invalid verification token');
      }

      setStep('backup');
      toast({
        title: "2FA Activated!",
        description: "Two-factor authentication has been successfully enabled"
      });

    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid token",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    if (setupData?.backupCodes) {
      const codesText = setupData.backupCodes.join('\n');
      navigator.clipboard.writeText(codesText);
      setCopiedCodes(true);
      
      toast({
        title: "Backup Codes Copied",
        description: "Save these codes in a secure location"
      });

      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  const downloadBackupCodes = () => {
    if (setupData?.backupCodes) {
      const codesText = `OnlyFur 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${setupData.backupCodes.join('\n')}\n\nKeep these codes secure and accessible.`;
      const blob = new Blob([codesText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onlyfur-2fa-backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <CardTitle>Enable Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              You'll need an authenticator app like Google Authenticator, Authy, or 1Password to generate verification codes.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Benefits of 2FA:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Protects your account even if your password is compromised</li>
                <li>Prevents unauthorized access to your content and earnings</li>
                <li>Required for certain platform features</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={setup2FA} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Setting up...' : 'Start Setup'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <QrCode className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Use your authenticator app to scan this code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {setupData?.qrCodeUrl && (
            <div className="flex justify-center">
              <img 
                src={setupData.qrCodeUrl} 
                alt="2FA QR Code"
                className="w-48 h-48 border rounded-lg"
              />
            </div>
          )}

          <Alert>
            <AlertDescription>
              After scanning the QR code, enter the 6-digit code from your authenticator app below.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(verifyToken)} className="space-y-4">
            <div>
              <Label htmlFor="token">Verification Code</Label>
              <Input
                id="token"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                className="text-center text-lg tracking-wider"
                {...register('token')}
              />
              {errors.token && (
                <p className="text-sm text-red-600 mt-1">{errors.token.message}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setStep('setup')}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === 'backup') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <CardTitle>2FA Enabled Successfully!</CardTitle>
          <CardDescription>
            Save your backup codes for account recovery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Save these backup codes in a secure location. 
              Each code can only be used once.
            </AlertDescription>
          </Alert>

          {setupData?.backupCodes && (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  {setupData.backupCodes.map((code, index) => (
                    <div key={index} className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {code}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyBackupCodes}
                  className="flex-1"
                >
                  {copiedCodes ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedCodes ? 'Copied!' : 'Copy Codes'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadBackupCodes}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={onComplete} className="w-full">
              Complete Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TwoFactorSetup;
