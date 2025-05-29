export enum EUserTypes {
   LOG_IN = 'logIn',
   LOG_OUT = 'logOut'
};

export type TAccountData = {
   email: string;
   password: string;
   username: string;
};

export interface IUserAttributes {
   id: number;
   username: string;
   email: string;
   name: string;
   nameLast: string;
   userType: string;
   userOccupation: string;
   provider: string;
   confirmed: boolean;
   blocked: boolean;
   createdAt: string;
   updatedAt: string;
   subscriptionStatus: string;
   acceptedTerms: boolean;
   works: TUserWork[];
   composers: TUserWorkComposer[];
   publishers: TUserWorkPublisher[];
   collections: TUserWorkCollection[];
};

export type TUserAttributes = {
   id: number;
   username: string;
   email: string;
   name: string;
   nameLast: string;
   userType: string;
   userOccupation: string;
   provider: string;
   confirmed: boolean;
   blocked: boolean;
   createdAt: string;
   updatedAt: string;
   acceptedTerms: boolean;
   subscriptionStatus: string;
   works: TUserWork[];
   composers: TUserWorkComposer[];
   publishers: TUserWorkPublisher[];
   collections: TUserWorkCollection[];
};

export interface TUserWork {
   id: number;
   title: string;
   composers: TUserWorkComposer[];
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
};

export interface TUserWorkComposer {
   id: number;
   name: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
};

export interface TUserWorkPublisher {
   id: number;
   name: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   collections: TUserWorkCollection[];
};

export interface TUserWorkCollection {
   id: number;
   title: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   composers: TUserWorkComposer[];
   publishers: TUserWorkPublisher[];
   works: TUserWork[];
};

export type TUserTypes = {
   id: number;
   name: string;
};

export type TUser = {
   jwt: string;
   user: TUserAttributes;
};

interface IBaseData {
   id: number;
};

export interface IDataName extends IBaseData {
   attributes: {
      name: string;
   };
};

export interface IDataTitle extends IBaseData {
   attributes: {
      title: string;
   };
};