import { INewNotification, INotification } from './notification';
import { TUserAttributes, EUserTypes } from './user';

export type TActionMap<M> = {
   [Key in keyof M]: M[Key] extends undefined
   ? {
      type: Key;
   }
   : {
      type: Key;
      payload: M[Key];
   };
};

export enum EIsLoadingTypes {
   IS_LOADING = 'isLoading',
   NOT_IS_LOADING = 'notIsLoading'
};

export enum ENotificationActionTypes {
   SET_MESSAGE = 'setMessage',
   DELETE_MESSAGE = 'deleteMessage'
};

export enum ETooltipActionTypes {
   SET_TOOLTIP = 'setTooltip',
   DELETE_TOOLTIP = 'deleteTooltip'
};

export interface ITooltipInfo {
   id: number;
   attributes: {
      tooltipTitle: string;
      tooltipText: string;
   };
};

export interface IError {
   name: string;
   message: string;
};

export interface INavigationItem {
   title: string;
   description?: string;
   icon: any;
   href: string;
   onClick?: (arg?: any) => any;
};

export type TApplicationType = {
   user: TUserAttributes | null;
   notifications: INotification[] | never[];
   tooltip: ITooltipInfo | null;
   isLoading: boolean;
};

export type TApplicationPayload = {
   [EUserTypes.LOG_IN]: TUserAttributes;
   [EUserTypes.LOG_OUT]: null;
   [ENotificationActionTypes.SET_MESSAGE]: INewNotification;
   [ENotificationActionTypes.DELETE_MESSAGE]: INotification;
   [ETooltipActionTypes.SET_TOOLTIP]: ITooltipInfo;
   [ETooltipActionTypes.DELETE_TOOLTIP]: null;
   [EIsLoadingTypes.IS_LOADING]: true;
   [EIsLoadingTypes.NOT_IS_LOADING]: false;
};

export type TApplicationActions = TActionMap<TApplicationPayload>[keyof TActionMap<TApplicationPayload>];
