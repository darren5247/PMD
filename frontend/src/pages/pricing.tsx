import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Page from '@src/components/Page';
import { useRouter } from 'next/router';
import { EUrlsPages } from '@src/constants';
import { TUserAttributes } from '@src/types/user';
import { stripeService } from '@src/services/stripe';

interface IPricingPageProps {
    prevUrl: string | undefined;
}

interface ISubscriptionDetails {
    plan: string;
    interval: string;
    status: string;
    startDate: string;
    currentPeriodEnd: string;
    amount: number;
    cancelAtPeriodEnd: boolean;
    paymentMethod?: {
        card: {
            brand: string;
            last4: string;
            expMonth: number;
            expYear: number;
        }
    };
}

const PricingPage: NextPage<IPricingPageProps> = ({ prevUrl }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState<ISubscriptionDetails | null>(null);
    const [currentSubscriptionDetails, setCurrentSubscriptionDetails] = useState<ISubscriptionDetails | null>(null);
    const accountData: TUserAttributes = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('accountData') || '{}') : {};

    const FEATURES = [
        {
            label: 'Ad-free experience',
            visitor: false,
            free: false,
            plus: true,
        },
        {
            label: 'Exclusive discounts',
            visitor: false,
            free: false,
            plus: true,
        },
        {
            label: 'Facebook group access',
            visitor: false,
            free: true,
            plus: true,
        },
        {
            label: 'div',
            visitor: false,
            free: false,
            plus: false,
        },
        {
            label: 'View database items',
            visitor: true,
            free: true,
            plus: true,
        },
        {
            label: 'View pedagogical elements',
            visitor: false,
            free: false,
            plus: true,
        },
        {
            label: 'Add database items',
            visitor: false,
            free: true,
            plus: true,
        },
        {
            label: 'div',
            visitor: false,
            free: false,
            plus: false,
        },
        {
            label: 'Search with filters',
            visitor: false,
            free: true,
            plus: true,
        },
        {
            label: 'Search by elements',
            visitor: false,
            free: false,
            plus: true,
        },
        {
            label: 'div',
            visitor: false,
            free: false,
            plus: false,
        },
        {
            label: 'Save favorites (maximum 10)',
            visitor: false,
            free: true,
            plus: true,
        },
        {
            label: 'Save favorites (unlimited)',
            visitor: false,
            free: false,
            plus: true,
        },
        {
            label: 'div',
            visitor: false,
            free: false,
            plus: false,
        },
        {
            label: 'View public lists',
            visitor: true,
            free: true,
            plus: true,
        },
        {
            label: 'Create public lists',
            visitor: false,
            free: true,
            plus: true,
        },
        {
            label: 'Create private lists',
            visitor: false,
            free: false,
            plus: true,
        },
    ];


    const getSubscription = async () => {
        const { subscription } = await stripeService.getSubscriptionStatus();

        if (subscription) {
            setSubscription(subscription);

            setCurrentSubscriptionDetails({
                plan: subscription.items.data[0].plan.product,
                interval: subscription.items.data[0].price.recurring.interval,
                status: subscription.status,
                startDate: new Date(subscription.start_date * 1000).toLocaleDateString(),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
                amount: subscription.items.data[0].price.unit_amount / 100,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                paymentMethod: await stripeService.getPaymentMethod(),
            });
        } else {
            setCurrentSubscriptionDetails(null);
        }
    };

    const handleSubscribe = async (priceId: string) => {
        const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');

        if (!accountData.id) {
            window.location.href = `/${EUrlsPages.LOG_IN}`;
            return;
        } else {
            getSubscription();

            if (currentSubscriptionDetails && currentSubscriptionDetails.status === 'active') {
                window.location.href = `/${EUrlsPages.PLAN}`;
                return;
            } else {
                try {
                    setLoading(true);
                    const { sessionURL } = await stripeService.createCheckoutSession(priceId);
                    if (sessionURL) {
                        window.location.href = sessionURL;
                    } else {
                        throw new Error('Error creating checkout session');
                    }
                } catch (error) {
                    console.error('Error subscribing:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
    };

    return (
        <Page
            showBackBar={true}
            showBackBarShare={true}
            showBackBarFeedback={true}
            prevUrl={prevUrl}
            url={EUrlsPages.PRICING}
            title='Pricing - Piano Music Database'
            description='Choose your plan and subscribe to PMD Plus. Get access to exclusive features, priority support, and more.'
            image=''
        >
            <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-3'>
                    <h1 className='text-center'>PMD Plus</h1>
                </div>
                <div className='flex flex-col justify-center items-center gap-3 mb-6'>
                    <p className='max-w-96 text-lg text-center'>Check out our features and then choose a plan to get started with PMD Plus.</p>
                </div>
                <div className='flex min-[940px]:flex-row flex-col justify-center items-start gap-12'>
                    <div className='mx-auto w-full overflow-x-auto'>
                        <table className='min-w-full overflow-hidden text-sm sm:text-base border-separate border-spacing-y-2'>
                            <thead>
                                <tr className='bg-gray-100 border-gray-200 border-b rounded'>
                                    <th className='py-2 pr-3 sm:pr-6 pl-2 font-semibold text-left'>Benefit</th>
                                    <th className='sm:px-2 py-2 pl-1 font-semibold text-center whitespace-nowrap'>Free</th>
                                    <th className='sm:px-2 py-2 pl-1 font-semibold text-center whitespace-nowrap'>Plus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURES.map((feature, idx) =>
                                    feature.label === 'div' ? (
                                        <tr key={`div-${idx}`}>
                                            <td colSpan={4}>
                                                <div className='mr-3 sm:mr-6 ml-2 border-gray-200 border-t' />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr
                                            key={idx}
                                            className='bg-white hover:bg-gray-50 border-gray-200 border-b last:border-b-0 rounded transition-colors'
                                        >
                                            <td className='py-2 pr-3 sm:pr-6 pl-2 w-min sm:w-full max-w-[222px]'>{feature.label}</td>
                                            <td className='sm:px-2 py-2 pl-1 min-w-[49px] sm:min-w-[78px] text-center'>
                                                {feature.free ? (
                                                    <span className='inline-block bg-green-300 px-2 py-1 rounded font-bold text-green-800'>✓</span>
                                                ) : (
                                                    <span className='inline-block bg-gray-100 px-2 py-1 rounded text-gray-600'>✗</span>
                                                )}
                                            </td>
                                            <td className='sm:px-2 py-2 pl-1 min-w-[49px] sm:min-w-[78px] text-center'>
                                                {feature.plus ? (
                                                    <span className='inline-block bg-green-300 px-2 py-1 rounded font-bold text-green-800'>✓</span>
                                                ) : (
                                                    <span className='inline-block bg-gray-100 px-2 py-1 rounded text-gray-600'>✗</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-4 mt-2 w-full'>
                        <h2 className='text-center'>
                            Choose Your Plan
                        </h2>
                        <div id='plan-choice' className='flex flex-col justify-center items-stretch gap-4 mx-auto w-full align-middle'>
                            <div id='plan-monthly' className='flex min-[465px]:flex-row flex-col justify-center items-center gap-y-8 bg-white shadow-elementCard px-3 py-10 rounded text-center'>
                                <h3 className='px-4 min-w-[140px] !text-2xl text-left'><strong>Monthly</strong></h3>
                                <p className='flex flex-col justify-center items-center mt-2 mb-1 px-3 w-full text-sm'>
                                    <span><strong>$5</strong></span>
                                    <span className='ml-1 text-pmdGray'> per month</span>
                                </p>
                                <button
                                    onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY : '')}
                                    className={`button ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500'} !px-4 !py-2`}
                                >
                                    {loading ? 'Processing...' : 'Subscribe'}
                                </button>
                            </div>
                            <div id='plan-yearly' className='flex min-[465px]:flex-row flex-col justify-center items-center gap-y-8 bg-white shadow-elementCard px-3 py-10 rounded text-center'>
                                <h3 className='px-4 min-w-[140px] !text-2xl text-left'><strong>Yearly</strong></h3>
                                <p className='flex flex-col justify-center items-center mt-2 mb-1 px-3 w-full text-sm'>
                                    <span>
                                        <span className='mr-2 text-pmdGray line-through'>$60</span>
                                        <strong>$50</strong>
                                    </span>
                                    <span className='ml-1 text-pmdGray'> per year</span>
                                    <span className='ml-2 font-semibold text-green-600'>(Save $10!)</span>
                                </p>
                                <button
                                    onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY : '')}
                                    className={`button ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500'} !px-4 !py-2`}
                                >
                                    {loading ? 'Processing...' : 'Subscribe'}
                                </button>
                            </div>
                            {accountData.id ? (
                                accountData.subscriptionStatus !== 'active' && (
                                    <div id='plan-free' className='flex min-[465px]:flex-row flex-col justify-center items-center gap-y-8 bg-white shadow-elementCard px-3 py-10 rounded text-center'>
                                        <a
                                            title='Continue with Free Account'
                                            href={`/${EUrlsPages.ACCOUNT_DASHBOARD}`}
                                            className='!px-4 !py-2 w-full text-sm'
                                        >
                                            Continue with Free Account
                                        </a>
                                    </div>
                                )
                            ) : (
                                <div id='plan-free' className='flex min-[465px]:flex-row flex-col justify-center items-center gap-y-8 bg-white shadow-elementCard px-3 py-10 rounded text-center'>
                                    <h3 className='px-4 min-w-[140px] !text-2xl text-left'><strong>Create Free Account</strong></h3>
                                    <a
                                        title='Create Free Account'
                                        href={`/${EUrlsPages.CREATE_ACCOUNT}`}
                                        className='!px-4 !py-2 w-full text-sm button'
                                    >
                                        Create Account
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        return {
            props: {
                prevUrl: context.req.headers.referer ?? '',
            }
        };
    } catch (error) {
        return {
            props: {
                prevUrl: context.req.headers.referer ?? '',
            }
        };
    }
};

export default PricingPage;