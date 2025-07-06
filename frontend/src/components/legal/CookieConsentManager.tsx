import React from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import CookieConsentPopup from './CookieConsentPopup';

const CookieConsentManager: React.FC = () => {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <CookieConsentPopup
      onAccept={acceptCookies}
      onDecline={declineCookies}
    />
  );
};

export default CookieConsentManager;
