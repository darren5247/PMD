import { useState } from 'react';
import { stripeService } from '@src/services/stripe';

export const useStripe = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscription = async (priceId: string) => {
        try {
            setLoading(true);
            const { sessionURL } = await stripeService.createCheckoutSession(priceId);

            // Redirect to Stripe Checkout
            if (sessionURL) {
                window.location.href = sessionURL;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubscription,
        loading,
        error,
    };
};