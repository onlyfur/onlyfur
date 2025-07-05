import { User } from '@/types';

export const needsAccountSetup = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check if user has a setupComplete property (from backend)
  if ('setupComplete' in user) {
    return !(user as any).setupComplete;
  }
  
  // Fallback: Check if user has completed basic setup
  return (
    !user.bio || 
    user.bio.trim() === '' ||
    !user.displayName ||
    user.displayName.trim() === user.email?.split('@')[0] // Default display name
  );
};

export const getRedirectPathAfterLogin = (user: User | null): string => {
  if (!user) return '/login';
  
  // Check if user needs setup
  if (needsAccountSetup(user)) {
    return '/setup';
  }
  
  // Redirect based on role
  if (user.role === 'CREATOR' || user.role === 'creator') {
    return '/creator-dashboard';
  }
  
  if (user.role === 'ADMIN' || user.role === 'admin') {
    return '/admin';
  }
  
  return '/dashboard';
};

export const isNewUser = (user: User | null): boolean => {
  if (!user) return false;
  
  // Consider user new if account was created within the last 5 minutes
  const accountAge = Date.now() - new Date(user.createdAt).getTime();
  const fiveMinutesInMs = 5 * 60 * 1000;
  
  return accountAge < fiveMinutesInMs;
};
