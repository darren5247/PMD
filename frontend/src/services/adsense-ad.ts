import api from '@src/api/config';

const adsenseAdService = {
    getAdsenseConfig: async () => {
        const response = await api.get('/adsense-config');
        return response.data;
    },
}

export default adsenseAdService;