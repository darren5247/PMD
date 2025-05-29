import { INewNotification, INotification } from '@src/types';

export const handleNewNotification = (notification: INewNotification) => {
    const newNotification: INotification = {
        id: Math.floor(Math.random() * 101 + 1),
        message: notification.message,
        type: notification.type
    };
    return newNotification;
};
