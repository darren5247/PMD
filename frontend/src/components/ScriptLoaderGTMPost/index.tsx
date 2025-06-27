import { FC } from "react";
// import { useCookieConsent } from '@src/context/CookieConsentContext';

const ScriptLoader: FC = () => {
  // const { cookieConsent } = useCookieConsent();

  // if (!cookieConsent) return null;

  return (
    <>
      {/* Analytics Scripts - Google Tag Manager - requires analytics consent
      {cookieConsent.analytics && (
        <>
          {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
            <noscript
              dangerouslySetInnerHTML={
                {
                  __html: `<iframe src='https://googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}' height='0' width='0' style='display: none; visibility: hidden;' />`
                }
              }
            />
          )}
        </>
      )} */}
      {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src='https://googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}' height='0' width='0' style='display: none; visibility: hidden;' />`,
          }}
        />
      )}
    </>
  );
};

export default ScriptLoader;
