import { userAPI } from '@src/api/config';

export const stripeService = {
    createCheckoutSession: async (priceId: string) => {
        const response = await userAPI.post('/stripe/create-checkout-session',
            { priceId },
        );
        return response.data;
    },

    getSubscriptionStatus: async () => {
        console.log("response")
        const response = await userAPI.get('/stripe/subscription-status');
        console.log("response", response)
        return response.data;
    },

    async cancelSubscription() {
        const response = await userAPI.post('/stripe/cancel-subscription');
        return response.data;
    },

    async updatePaymentMethod() {
        const response = await userAPI.post('/stripe/update-payment-method');
        return response.data;
    },

    async getPaymentMethod() {
        const response = await userAPI.get('/stripe/payment-method');
        return response.data;
    },

    async changeSubscription(newPriceId: string) {
        const response = await userAPI.post('/stripe/change-subscription', {
            newPriceId,
        });

        if (response.data.url) {
            window.location.href = response.data.url;
        } else {
            return response.data;
        }
    }
};
