import { useEffect, useState } from "react";
import useAdsenseAd from "@src/hooks/useAdsenseAd";
import { useCookieConsent } from "@src/context/CookieConsentContext";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface IAdUnit {
  name: string;
  slot: string;
  format: string;
  responsive: boolean;
  location: string;
}

interface IAdsenseAdProps {
  location: string;
  style?: React.CSSProperties;
}

const AdsenseAd: React.FC<IAdsenseAdProps> = ({ location, style }) => {
  const [adUnit, setAdUnit] = useState<IAdUnit | null>(null);
  const { cookieConsent } = useCookieConsent();
  const { adsenseConfig, getAdsenseConfig } = useAdsenseAd();

  useEffect(() => {
    getAdsenseConfig();
  }, [location]);

  useEffect(() => {
    if (adsenseConfig?.adUnits) {
      const matchingAdUnit = adsenseConfig.adUnits.find(
        (unit) => unit.location === location,
      );
      setAdUnit(matchingAdUnit || null);
    }
  }, [adsenseConfig, location]);

  useEffect(() => {
    if (adsenseConfig && adUnit && cookieConsent?.marketing) {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("Error loading Adsense ad:", err);
      }
    }
  }, [adsenseConfig, adUnit, cookieConsent?.marketing]);

  if (!adsenseConfig || !adUnit || !cookieConsent?.marketing) return null;

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: "block" }}
      data-ad-client={`ca-pub-${adsenseConfig.publisherId}`}
      data-ad-slot={adUnit.slot}
      data-ad-format={adUnit.format}
      data-full-width-responsive={adUnit.responsive}
    />
  );
};

export default AdsenseAd;
