import { useState } from 'react';
import adsenseAdService from '@src/services/adsense-ad';

interface IAdUnit {
    name: string;
    slot: string;
    format: string;
    responsive: boolean;
    location: string;
}

interface IAdsenseConfig {
    publisherId: string;
    adUnits: IAdUnit[];
}

const useAdsenseAd = () => {
    const [adsenseConfig, setAdsenseConfig] = useState<IAdsenseConfig | null>(null);

    const getAdsenseConfig = async () => {
        const response = await adsenseAdService.getAdsenseConfig();

        setAdsenseConfig(response.data?.attributes);
    }

    return {
        getAdsenseConfig,
        adsenseConfig,
    }
}

export default useAdsenseAd;