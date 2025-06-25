import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Page from '@src/components/Page';
import { EUrlsPages } from '@src/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TUserAttributes } from '@src/types/user';
import { stripeService } from '@src/services/stripe';

interface IPlusSuccessPageProps {
  prevUrl: string | undefined;
  sessionId: string | null;
}

interface ISubscriptionDetails {
  plan: string;
  interval: string;
  status: string;
  startDate: string;
}

const PlusSuccessPage: NextPage<IPlusSuccessPageProps> = ({ prevUrl, sessionId }) => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<ISubscriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getSubscriptionDetails = async () => {
      if (!sessionId) {
        setError('We could not process your payment. No session ID was provided. This means we could not verify your payment. Please try again.');
        setLoading(false);
        return;
      }

      try {
        const { subscription } = await stripeService.getSubscriptionStatus();

        if (subscription) {
          setSubscription({
            plan: subscription.items.data[0].plan.product,
            interval: subscription.items.data[0].price.recurring.interval,
            status: subscription.status,
            startDate: new Date(subscription.start_date * 1000).toLocaleDateString()
          });
        }
      } catch (err) {
        setError(`Failed to load subscription details: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');

    if (!accountData.id) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search + window.location.hash);
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    } else {
      getSubscriptionDetails();
    }
  }, [router, sessionId]);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={false}
      prevUrl={prevUrl}
      url={EUrlsPages.SUCCESS}
      title='Subscription Processed - Piano Music Database'
      description='Your subscription has been processed. Subscribe to PMD Plus and get access to exclusive features, priority support, and more.'
      image=''
    >
      <div className='mx-auto px-4 py-16 max-w-3xl text-center'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <div className='border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin'></div>
          </div>
        ) : error ? (
          <div>
            <h1 className='my-4'>Payment Error!</h1>
            <p className='mb-4 text-lg text-center'>There was an error during the subscription process: <br /><em>{error}</em></p>
          </div>
        ) : subscription ? (
          <div>
            <h1 className='my-4'>Welcome to PMD Plus!</h1>
            <p className='mb-2 text-lg text-center'>We hope you enjoy the powerful features.</p>
            <div className='bg-white shadow-md my-8 p-6 rounded-lg'>
              <h2 className='mb-4 text-xl'>Subscription Details</h2>
              <div className='space-y-3 text-left'>
                <p>
                  <strong>Billing Interval:</strong> <span className='capitalize'>{subscription.interval}ly</span>
                </p>
                <p>
                  <strong>Start Date:</strong> {subscription.startDate}
                </p>
                <p>
                  <strong>Status:</strong> <span className='capitalize'>{subscription.status}</span>
                </p>
                <p>
                  <Link href={`/${EUrlsPages.PLAN}`}><a title='Plan Details' className='cursor-pointer'>Plan Details</a></Link>
                  </p>
              </div>
            </div>
            <div className='flex flex-col justify-center items-center gap-6 mb-6'>
              <Link href={`/${EUrlsPages.ACCOUNT_DASHBOARD}`}><a title='Account Dashboard' className='cursor-pointer button'>Account Dashboard</a></Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 className='my-4'>Subscription Not Found!</h1>
            <p className='mb-4 text-lg text-center'>No subscription information was found in our database. <br />Please <Link href={`/${EUrlsPages.CONTACT}`}><a title='Contact'>contact</a></Link> us so we can assist you.</p>
          </div>
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session_id } = context.query;

  return {
    props: {
      prevUrl: context.req.headers.referer ?? '',
      sessionId: session_id || null
    }
  };
};

export default PlusSuccessPage; 