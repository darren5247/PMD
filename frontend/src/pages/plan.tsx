import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Page from '@src/components/Page';
import { EUrlsPages } from '@src/constants';
import { stripeService } from '@src/services/stripe';
import { TUserAttributes } from '@src/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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
    const [subscription, setSubscription] = useState<any>(null);
    const [currentSubscriptionDetails, setCurrentSubscriptionDetails] = useState<ISubscriptionDetails | null>(null);

    useEffect(() => {
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
            }
        };

        const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
        if (accountData.id) {
            if (accountData.name) {
                getSubscription();
            } else {
                router.push(`/${EUrlsPages.ACCOUNT_SETTINGS}`, undefined, { shallow: false });
            };
        } else {
            router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
        };
    }, [router]);

    const PRICING_PLANS = [
        {
            title: 'Monthly',
            price: 5,
            interval: 'month' as const,
            priceId: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY}`,
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3',
            ],
        },
        {
            title: 'Yearly',
            price: 50,
            interval: 'year' as const,
            priceId: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY}`,
            features: [
                'All Monthly Features',
                'Two Months Free',
                'Priority Support',
            ],
        },
    ];

    const handleCancelSubscription = async () => {
        try {
            await stripeService.cancelSubscription();
            router.reload();
        } catch (error) {
            console.error('Error canceling subscription:', error);
        }
    };

    const handleUpdatePayment = async () => {
        try {
            const { url } = await stripeService.updatePaymentMethod();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
        }
    };

    const handleUpgrade = async (newPriceId: string) => {
        try {
            setLoading(true);
            const response = await stripeService.changeSubscription(newPriceId);
            if (response.type === 'portal') {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Error upgrading subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDowngrade = async (newPriceId: string) => {
        try {
            setLoading(true);
            const response = await stripeService.changeSubscription(newPriceId);
            if (response.type === 'portal') {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Error downgrading subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPaymentMethodDisplay = (paymentMethod: any) => {
        switch (paymentMethod.type) {
            case 'card':
                return (
                    <>
                        {paymentMethod.card.brand} •••• {paymentMethod.card.last4}
                        <br />
                        <span className='text-pmdGray text-sm'>
                            Expires {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
                        </span>
                    </>
                );
            case 'us_bank_account':
                return (
                    <>
                        {paymentMethod.us_bank_account.bank_name} •••• {paymentMethod.us_bank_account.last4}
                        <br />
                        <span className='text-pmdGray text-sm'>
                            US Bank Account
                        </span>
                    </>
                );
            case 'sepa_debit':
                return (
                    <>
                        {paymentMethod.sepa_debit.bank_name} •••• {paymentMethod.sepa_debit.last4}
                        <br />
                        <span className='text-pmdGray text-sm'>
                            SEPA Direct Debit
                        </span>
                    </>
                );
            case 'ideal':
                return `iDEAL - ${paymentMethod.ideal.bank}`;
            case 'google_pay':
                return 'Google Pay';
            case 'apple_pay':
                return 'Apple Pay';
            default:
                return paymentMethod.type;
        }
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
                    <p className='text-center'>Get access to exclusive features, priority support, and more.</p>
                </div>
                <div className='flex justify-center items-center gap-6 mx-auto w-full'>
                    <div className='mx-auto max-w-md'>
                        <div className='bg-white shadow-md mt-8 p-6 rounded-lg'>
                            <h2 className='mb-8'>Subscription Details</h2>
                            {currentSubscriptionDetails ? (
                                <div className='flex flex-col gap-4 text-left'>
                                    <div className='pb-4 border-b'>
                                        <h3 className='mb-2'>Plan Information</h3>
                                        <p><strong>Plan Name:</strong> <Link href={`/${EUrlsPages.PRICING}`}><a title='PMD Plus Pricing'>PMD Plus</a></Link></p>
                                        <p><strong>Billing Interval:</strong> {(currentSubscriptionDetails && currentSubscriptionDetails.interval === 'year') ? 'Yearly' : (currentSubscriptionDetails && currentSubscriptionDetails.interval === 'month') ? 'Monthly' : ''}</p>
                                        <p><strong>Status:</strong>
                                            <span className={`capitalize ml-1 ${currentSubscriptionDetails.status === 'active' ? 'text-green-600' :
                                                currentSubscriptionDetails.status === 'incomplete' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {currentSubscriptionDetails.status}
                                            </span>
                                        </p>
                                    </div>

                                    <div className='pb-4 border-b'>
                                        <h3 className='mb-2'>Billing Information</h3>
                                        <p><span>Current Cost:</span> ${currentSubscriptionDetails.amount}/{currentSubscriptionDetails.interval}</p>
                                        {currentSubscriptionDetails.paymentMethod && (
                                            <p>
                                                <span>Payment Method:</span>{' '}
                                                {getPaymentMethodDisplay(currentSubscriptionDetails.paymentMethod)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className='mb-2'>Dates</h3>
                                        <p><strong>Start Date:</strong> {currentSubscriptionDetails.startDate}</p>
                                        <p><strong>Current Period Ends:</strong> {currentSubscriptionDetails.currentPeriodEnd}</p>
                                        {currentSubscriptionDetails.cancelAtPeriodEnd && (
                                            <p className='mt-2 text-red-600'>
                                                Your subscription will end on {currentSubscriptionDetails.currentPeriodEnd}
                                            </p>
                                        )}
                                    </div>

                                    <div className='flex flex-col justify-center items-center gap-12 mx-auto mt-12 w-full'>
                                        <button
                                            title='Manage Payment'
                                            className='disabled:bg-green-500 disabled:opacity-50 disabled:text-white button'
                                            onClick={handleUpdatePayment}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleUpdatePayment();
                                                }
                                            }}
                                            tabIndex={0}
                                        >Manage Payment</button>
                                        {(currentSubscriptionDetails.interval && currentSubscriptionDetails.interval == 'year') && (
                                            <button
                                                title='Change to Monthly'
                                                className='disabled:bg-green-500 disabled:opacity-50 disabled:text-white button'
                                                onClick={() => handleDowngrade(PRICING_PLANS[0].priceId)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleDowngrade(PRICING_PLANS[0].priceId);
                                                    }
                                                }}
                                                tabIndex={0}
                                            >Change to Monthly</button>
                                        )}
                                        {(currentSubscriptionDetails.interval && currentSubscriptionDetails.interval == 'month') && (
                                            <button
                                                title='Change to Yearly'
                                                className='disabled:bg-green-500 disabled:opacity-50 disabled:text-white button'
                                                onClick={() => handleUpgrade(PRICING_PLANS[1].priceId)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleUpgrade(PRICING_PLANS[1].priceId);
                                                    }
                                                }}
                                                tabIndex={0}
                                            >Change to Yearly</button>
                                        )}
                                        <button title='Cancel Subscription' onClick={handleCancelSubscription} className='buttonwhite'>Cancel Subscription</button>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col justify-center items-center gap-3'>
                                    <p>No active subscription found.</p>
                                    <p>Check out our plans:</p>
                                    <Link href={`/${EUrlsPages.PRICING}`}><a title='Pricing' className='mb-3 cursor-pointer button'>Pricing</a></Link>
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