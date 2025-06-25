import { userAPI } from '@src/api/config';

const checkJwtOrRedirect = () => {
    const jwt = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1];

    const handleRedirect = (message: string) => {
        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search + window.location.hash);
        localStorage.removeItem('accountData');
        window.location.href = '/log-in';
        throw new Error(message);
    };

    if (!jwt) {
        handleRedirect('JWT not found, redirecting to login.');
    }

    // Optionally, check if JWT is expired (basic check for exp in payload)
    try {
        if (!jwt) {
            handleRedirect('JWT not found, redirecting to login.');
        } else {
            const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf-8'));
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                handleRedirect('JWT expired, redirecting to login.');
            }
        }
    } catch {
        handleRedirect('Invalid JWT, redirecting to login.');
    }
};

export const stripeService = {
    createCheckoutSession: async (priceId: string) => {
        checkJwtOrRedirect();
        const response = await userAPI.post('/stripe/create-checkout-session',
            { priceId },
        );
        return response.data;
    },

    getSubscriptionStatus: async () => {
        checkJwtOrRedirect();
        const response = await userAPI.get('/stripe/subscription-status');
        return response.data;
    },

    async cancelSubscription() {
        checkJwtOrRedirect();
        const response = await userAPI.post('/stripe/cancel-subscription');
        return response.data;
    },

    async updatePaymentMethod() {
        checkJwtOrRedirect();
        const response = await userAPI.post('/stripe/update-payment-method');
        return response.data;
    },

    async getPaymentMethod() {
        checkJwtOrRedirect();
        const response = await userAPI.get('/stripe/payment-method');
        return response.data;
    },

    async changeSubscription(newPriceId: string) {
        checkJwtOrRedirect();
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
