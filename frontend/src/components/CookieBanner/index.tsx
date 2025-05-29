import { FC, useState, useEffect } from 'react';
import { useCookieConsent } from '@src/context/CookieConsentContext';
import { ICookieConsent } from '@src/types/cookies';
import { useMediaQuery } from '@src/common/hooks';

const CookieBanner: FC = () => {
  const isBreakpoint = useMediaQuery('(max-width: 426px)');
  const { shouldShowBanner, acceptAll, rejectAll, updateCookieConsent, cookieConsent } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ICookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  // Update preferences when cookieConsent changes
  useEffect(() => {
    if (cookieConsent) {
      setPreferences(cookieConsent);
    }
    if (shouldShowBanner && cookieConsent) {
      setShowDetails(true);
    }
  }, [shouldShowBanner, cookieConsent]);

  if (!shouldShowBanner) return null;

  const handleSavePreferences = () => {
    updateCookieConsent({
      ...preferences,
      necessary: true
    });
  };

  const handleToggle = (category: keyof ICookieConsent) => {
    if (category === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div id='cookieConsent' className='right-0 bottom-0 left-0 z-50 fixed bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
      <div className='mx-auto p-5 max-w-7xl'>
        <div className='flex min-[737px]:flex-row flex-col justify-between items-start min-[737px]:items-center gap-4'>
          <div className='flex-1'>
            <h2 className='mb-2 font-semibold text-pmdGrayDark text-lg'>Cookie Preferences</h2>
            <p className='text-pmdGrayDark text-sm'>
              We use cookies to enhance your browsing experience and analyze our traffic.
            </p>
          </div>
          <div className='flex flex-wrap justify-center items-center gap-3'>
            <button
              title='Show/Hide Cookie Settings'
              aria-label='Show/Hide Cookie Settings'
              className='shadow !px-2 min-[737px]:!px-4 !py-1 min-[737px]:!py-2 min-w-[78px] min-[427px]:min-w-[121px] min-[737px]:min-w-[151px] text-sm buttonwhite'
              onClick={() => setShowDetails(!showDetails)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowDetails(!showDetails);
                }
              }}
              tabIndex={0}
            >
              Settings
            </button>
            <button
              title='Reject All Cookies'
              aria-label='Reject All Cookies'
              className='!px-2 min-[737px]:!px-4 !py-1 min-[737px]:!py-2 min-w-[78px] min-[427px]:min-w-[121px] min-[737px]:min-w-[151px] text-sm button'
              onClick={rejectAll}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  rejectAll();
                }
              }}
              tabIndex={0}
            >
              {isBreakpoint ? 'Reject' : 'Reject All'}
            </button>
            <button
              title='Accept All Cookies'
              aria-label='Accept All Cookies'
              className='!px-2 min-[737px]:!px-4 !py-1 min-[737px]:!py-2 min-w-[78px] min-[427px]:min-w-[121px] min-[737px]:min-w-[151px] text-sm button'
              onClick={acceptAll}
              ref={(el) => el && el.focus()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  acceptAll();
                }
              }}
              tabIndex={0}
            >
              {isBreakpoint ? 'Accept' : 'Accept All'}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className='mt-6 pt-6 border-pmdGrayLight border-t'>
            <div className='flex flex-col gap-3 max-h-[310px] overflow-y-auto'>
              <div className='flex justify-between items-start gap-8 bg-pmdGrayLight p-4 rounded-lg'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-pmdGrayDark'>Necessary Cookies</h3>
                  <p className='mt-1 text-pmdGrayDark text-sm'>Essential cookies for necessary website functionality and uninterrupted sessions/form entry.</p>
                </div>
                <div className='flex items-center h-6'>
                  <input
                    type='checkbox'
                    checked={true}
                    disabled
                    className='border-pmdGrayLight rounded w-6 h-6 cursor-not-allowed'
                    aria-label='Necessary Cookies'
                  />
                </div>
              </div>

              <div className='flex justify-between items-start gap-8 bg-pmdGrayLight p-4 rounded-lg'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-pmdGrayDark'>Analytics Cookies</h3>
                  <p className='mt-1 text-pmdGrayDark text-sm'>Help us improve our website by understanding visitor interactions.</p>
                </div>
                <div className='flex items-center h-6'>
                  <input
                    type='checkbox'
                    checked={preferences.analytics}
                    onChange={() => handleToggle('analytics')}
                    className='border-pmdGrayLight rounded w-6 h-6 cursor-pointer'
                    aria-label='Analytics Cookies'
                  />
                </div>
              </div>

              <div className='flex justify-between items-start gap-8 bg-pmdGrayLight p-4 rounded-lg'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-pmdGrayDark'>Marketing Cookies</h3>
                  <p className='mt-1 text-pmdGrayDark text-sm'>Used to show relevant and personalized advertisements.</p>
                </div>
                <div className='flex items-center h-6'>
                  <input
                    type='checkbox'
                    checked={preferences.marketing}
                    onChange={() => handleToggle('marketing')}
                    className='border-pmdGrayLight rounded w-6 h-6 cursor-pointer'
                    aria-label='Marketing Cookies'
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end pt-4'>
              <button
                title='Save Preferences'
                aria-label='Save Preferences'
                onClick={handleSavePreferences}
                className='!px-6 !py-2.5 text-sm button'
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner; 