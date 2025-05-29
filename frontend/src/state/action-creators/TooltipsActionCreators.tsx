import axios from 'axios';
import {
    TApplicationActions,
    ENotificationActionTypes,
    ETooltipActionTypes
} from '@src/types';

export const setTooltips = async (tooltip: number): Promise<TApplicationActions> => {
    const APIURL = process.env.NEXT_PUBLIC_API_URL ?? '';

    try {
        const { data } = await axios.get(
            `${APIURL}tooltips/${tooltip}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.NEXT_PUBLIC_API_KEY ? `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` : ''
                }
            }
        );

        return {
            type: ETooltipActionTypes.SET_TOOLTIP,
            payload: data?.data
        };
    } catch (err: any) {
        return {
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: err.message
        };
    };
};
