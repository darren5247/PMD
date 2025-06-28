import { createContext, useContext, useState, useEffect } from "react";
import { ICookieConsent } from "@src/types/cookies";
import { getCookie, setCookie, deleteCookie } from "@src/utils/cookies";

interface ICookieConsentContext {
  cookieConsent: ICookieConsent | null;
  updateCookieConsent: (consent: ICookieConsent) => void;
  shouldShowBanner: boolean;
  setShouldShowBanner: (show: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
}

const defaultConsent: ICookieConsent = {
  necessary: true,
  analytics: true,
  marketing: true,
};

const CookieConsentContext = createContext<ICookieConsentContext>({
  cookieConsent: null,
  updateCookieConsent: () => {},
  shouldShowBanner: true,
  setShouldShowBanner: () => {},
  acceptAll: () => {},
  rejectAll: () => {},
});

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cookieConsent, setCookieConsent] = useState<ICookieConsent | null>(
    null,
  );
  const [shouldShowBanner, setShouldShowBanner] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const savedConsent = getCookie("cookie-consent");

    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        if (
          typeof parsedConsent === "object" &&
          "necessary" in parsedConsent &&
          "analytics" in parsedConsent &&
          "marketing" in parsedConsent
        ) {
          setCookieConsent(parsedConsent);
          setShouldShowBanner(false);
          setIsInitialized(true);
        } else {
          deleteCookie("cookie-consent");
          setShouldShowBanner(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error parsing cookie consent:", error);
        deleteCookie("cookie-consent");
        setShouldShowBanner(true);
        setIsInitialized(true);
      }
    } else {
      setShouldShowBanner(true);
      setIsInitialized(true);
    }
  }, []);

  const updateCookieConsent = (consent: ICookieConsent) => {
    setCookieConsent(consent);
    setCookie("cookie-consent", JSON.stringify(consent), 365 * 24 * 60 * 60);
    setShouldShowBanner(false);
  };

  const acceptAll = () => {
    const fullConsent: ICookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    updateCookieConsent(fullConsent);
  };

  const rejectAll = () => {
    const rejectedConsent: ICookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    updateCookieConsent(rejectedConsent);
  };

  // Don't render children until we've initialized the consent state
  if (!isInitialized) {
    return (
      <CookieConsentContext.Provider
        value={{
          cookieConsent: null,
          updateCookieConsent: () => {},
          shouldShowBanner: false, // Don't show banner during SSR
          setShouldShowBanner: () => {},
          acceptAll: () => {},
          rejectAll: () => {},
        }}
      >
        {children}
      </CookieConsentContext.Provider>
    );
  }

  return (
    <CookieConsentContext.Provider
      value={{
        cookieConsent,
        updateCookieConsent,
        shouldShowBanner,
        setShouldShowBanner,
        acceptAll,
        rejectAll,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieConsentContext);
