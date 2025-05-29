export enum ENotificationTypes {
    ERROR = 'error',
    SUCCESS = 'success',
    WARNING = 'warning',
    INFO = 'info'
};

export interface INewNotification {
    type: ENotificationTypes;
    message: string;
};

export interface INotification extends INewNotification {
    id: number;
};
