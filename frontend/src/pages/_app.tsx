import '@fontsource-variable/montserrat';
import '../../styles/globals.css';
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AppProvider } from '@src/state';
import { CookieConsentProvider } from '@src/context/CookieConsentContext';
import CookieBanner from '@src/components/CookieBanner';
import ScriptLoader from '@src/components/ScriptLoader';

function PianoMusicDatabase({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      const handleBack = (e: PopStateEvent) => {
        if (
          (!router.asPath.includes('/search') &&
            // @ts-ignore
            e.target?.location.href.includes('/search')) ||
          (router.asPath.includes('/search') &&
            // @ts-ignore
            e.target?.location.href.includes('/search'))
        )
          router.reload();
      };
      window.addEventListener('popstate', handleBack, false)
      return () => window.removeEventListener('popstate', handleBack, false)
    }, [router]
  );

  useEffect(
    () => {
      const handleStart = (url: string) =>
        url !== router.asPath && setLoading(true)
      const handleComplete = (url: string) =>
        url === router.asPath && setLoading(false)

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError', handleComplete)

      return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleComplete)
        router.events.off('routeChangeError', handleComplete)
      };
    }
  );

  return (
    <AppProvider>
      {/*
      OPTION 1 - Using AppProvider and ScriptLoader
      This is the basic way to use CookieConsent with the Piano Music Database.
      It allows loading scripts and manage state, but does not provide a structured way to
      manage cookie consent.
      */}
      <Component {...pageProps} />
      <ScriptLoader />
      <CookieConsentProvider>
        <CookieBanner />
      </CookieConsentProvider>
      
      {/*
      OPTION 2 - Using CookieConsentProvider and CookieBanner
      This is the recommended way to use CookieConsent with the Piano Music Database.
      It allows managing cookie consent in a more structured way.
      <CookieConsentProvider>
      <Component {...pageProps} />
      <ScriptLoader />
        <CookieBanner />
      </CookieConsentProvider>
      */}
    </AppProvider>
  );
};

export default PianoMusicDatabase;
