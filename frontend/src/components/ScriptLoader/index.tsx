import { FC } from "react";
import Script from "next/script";
// import { useCookieConsent } from '@src/context/CookieConsentContext';

const ScriptLoader: FC = () => {
  // const { cookieConsent } = useCookieConsent();

  // if (!cookieConsent) return null;

  return (
    <>
      {/* Analytics Scripts - Google Analytics - requires analytics consent
      {cookieConsent.analytics && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            id='google-analytics-tag'
            strategy='afterInteractive'
            async={true}
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          />
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `}
          </Script>
        </>
      )} */}

      {/* Analytics Scripts - Google Tag Manager - requires analytics consents
      {cookieConsent.analytics && process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
        <Script id='google-tag-manager' strategy='afterInteractive'>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');
          `}
        </Script>
      )} */}

      {/* Marketing Scripts - Google Adsense - requires marketing consent
      {cookieConsent.marketing && process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
        <Script
          id='adsbygoogle-init'
          strategy='afterInteractive'
          async={true}
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin='anonymous'
        />
      )} */}

      {/* Analytics Scripts - Google Analytics - requires analytics consent */}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            id="google-analytics-tag"
            strategy="afterInteractive"
            async={true}
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `}
          </Script>
        </>
      )}

      {/* Analytics Scripts - Google Tag Manager - requires analytics consents */}
      {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');
        `}
        </Script>
      )}

      {/* Marketing Scripts - Google Adsense - requires marketing consent */}
      {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async={true}
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
      )}
    </>
  );
};

export default ScriptLoader;
