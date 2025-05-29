export enum ECookieCategories {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing'
}

export interface ICookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ICookieConsentContext {
  cookieConsent: ICookieConsent | null;
  updateCookieConsent: (consent: ICookieConsent) => void;
  shouldShowBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
} 