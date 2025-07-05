import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  hasConsent: boolean;
  showBanner: boolean;
  preferences: CookiePreferences | null;
  acceptCookies: (preferences: CookiePreferences) => void;
  declineCookies: () => void;
  updatePreferences: (preferences: CookiePreferences) => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = 'onlyfur_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'onlyfur_cookie_preferences';
const CONSENT_VERSION = '1.0'; // Update this when cookie policy changes

interface StoredConsent {
  hasConsent: boolean;
  timestamp: number;
  version: string;
  preferences: CookiePreferences;
}

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  // Load consent state on mount
  useEffect(() => {
    const loadConsentState = () => {
      try {
        const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
        
        if (storedConsent) {
          const consent: StoredConsent = JSON.parse(storedConsent);
          
          // Check if consent is still valid (version matches and not expired)
          const isValid = consent.version === CONSENT_VERSION && 
                          consent.timestamp > Date.now() - (365 * 24 * 60 * 60 * 1000); // 1 year
          
          if (isValid && consent.hasConsent) {
            setHasConsent(true);
            setPreferences(consent.preferences);
            setShowBanner(false);
            
            // Set actual cookies based on preferences
            setCookiesBasedOnPreferences(consent.preferences);
          } else {
            // Invalid or expired consent
            setHasConsent(false);
            setShowBanner(true);
            setPreferences(null);
            clearStoredConsent();
          }
        } else {
          // No stored consent
          setHasConsent(false);
          setShowBanner(true);
          setPreferences(null);
        }
      } catch (error) {
        console.error('Error loading cookie consent:', error);
        // Fallback to showing banner
        setHasConsent(false);
        setShowBanner(true);
        setPreferences(null);
      }
    };

    // Small delay to prevent flash of banner
    const timer = setTimeout(loadConsentState, 500);
    return () => clearTimeout(timer);
  }, []);

  const setCookiesBasedOnPreferences = (prefs: CookiePreferences) => {
    // Set functional cookies
    if (prefs.functional) {
      // Enable functional features like theme persistence, language settings
      document.cookie = 'onlyfur_functional=enabled; path=/; max-age=31536000; SameSite=Lax';
    } else {
      document.cookie = 'onlyfur_functional=disabled; path=/; max-age=0';
    }

    // Set analytics cookies
    if (prefs.analytics) {
      // Enable analytics tracking (Google Analytics, etc.)
      document.cookie = 'onlyfur_analytics=enabled; path=/; max-age=31536000; SameSite=Lax';
      
      // Initialize Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
    } else {
      document.cookie = 'onlyfur_analytics=disabled; path=/; max-age=0';
      
      // Disable Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
    }

    // Set marketing cookies
    if (prefs.marketing) {
      // Enable marketing and advertising cookies
      document.cookie = 'onlyfur_marketing=enabled; path=/; max-age=31536000; SameSite=Lax';
      
      // Initialize marketing tools if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    } else {
      document.cookie = 'onlyfur_marketing=disabled; path=/; max-age=0';
      
      // Disable marketing tools if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
    }
  };

  const storeConsent = (prefs: CookiePreferences) => {
    const consent: StoredConsent = {
      hasConsent: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      preferences: prefs
    };

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error storing cookie consent:', error);
    }
  };

  const clearStoredConsent = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    } catch (error) {
      console.error('Error clearing cookie consent:', error);
    }
  };

  const acceptCookies = (prefs: CookiePreferences) => {
    setHasConsent(true);
    setPreferences(prefs);
    setShowBanner(false);
    
    storeConsent(prefs);
    setCookiesBasedOnPreferences(prefs);

    // Trigger custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: { hasConsent: true, preferences: prefs } 
    }));
  };

  const declineCookies = () => {
    const minimalPrefs: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };

    acceptCookies(minimalPrefs);
  };

  const updatePreferences = (newPrefs: CookiePreferences) => {
    setPreferences(newPrefs);
    storeConsent(newPrefs);
    setCookiesBasedOnPreferences(newPrefs);

    // Trigger custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: { hasConsent: true, preferences: newPrefs } 
    }));
  };

  const resetConsent = () => {
    setHasConsent(false);
    setPreferences(null);
    setShowBanner(true);
    clearStoredConsent();

    // Clear all non-essential cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (!name.startsWith('onlyfur_auth') && !name.startsWith('onlyfur_session')) {
        document.cookie = `${name}=; path=/; max-age=0`;
      }
    });

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: { hasConsent: false, preferences: null } 
    }));
  };

  const value: CookieConsentContextType = {
    hasConsent,
    showBanner,
    preferences,
    acceptCookies,
    declineCookies,
    updatePreferences,
    resetConsent
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

// Helper hooks for specific cookie categories
export const useAnalytics = () => {
  const { preferences } = useCookieConsent();
  return preferences?.analytics || false;
};

export const useMarketing = () => {
  const { preferences } = useCookieConsent();
  return preferences?.marketing || false;
};

export const useFunctional = () => {
  const { preferences } = useCookieConsent();
  return preferences?.functional || false;
};
