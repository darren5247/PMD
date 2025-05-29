import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { PricingCard } from '@src/components/PricingCard';
import Page from '@src/components/Page';
import { EUrlsPages } from '@src/constants';
import Link from 'next/link';
import { stripeService } from '@src/services/stripe';
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

        getSubscription();
    }, [router]);

    const currentPlanId = subscription?.items?.data[0]?.price?.id || null;

    const PRICING_PLANS = [
        {
            title: 'Monthly',
            price: 5,
            interval: 'month' as const,
            priceId: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY}`,
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3'
            ],
        },
        {
            title: 'Yearly',
            price: 50,
            interval: 'year' as const,
            priceId: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY}`,
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3'
            ],
        },
    ];

    const handleSubscribe = async (priceId: string) => {
        try {
            setLoading(true);
            const { sessionURL } = await stripeService.createCheckoutSession(priceId);
            console.log("session===>>>>", sessionURL)
            if (sessionURL) {
                window.location.href = sessionURL;
            } else {
                throw new Error('Error creating checkout session');
            }
        } catch (error) {
            console.error('Error changing subscription:', error);
        } finally {
            setLoading(false);
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
                {currentSubscriptionDetails && (
                    <div className='flex flex-col justify-center items-center gap-3 my-10'>
                        <p className='text-lg text-center'><strong>You already are subscribed!</strong></p>
                        <Link href={`/${EUrlsPages.PLAN}`}><a title='Your Plan Details' className='!px-4 !py-1 cursor-pointer button'>Your Plan Details</a></Link>
                    </div>
                )}
                <h2 className='mt-8 text-center'>
                    Plans
                </h2>
                <div className='flex flex-wrap justify-center items-center gap-4'>
                    {PRICING_PLANS.map((plan) => (
                        <PricingCard
                            key={plan.priceId}
                            {...plan}
                            isCurrentPlan={currentPlanId === plan.priceId}
                            currentPlanInterval={currentSubscriptionDetails?.interval as 'month' | 'year'}
                            onSubscribe={handleSubscribe}
                            onUpgrade={handleUpgrade}
                            onDowngrade={handleDowngrade}
                            loading={loading}
                        />
                    ))}
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