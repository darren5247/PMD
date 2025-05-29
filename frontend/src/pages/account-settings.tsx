import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import Page from '@src/components/Page';
import Form from '@src/components/Form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import Label from '@src/components/Label';
import Field from '@src/components/Field';
import { ModalNewsletterAccount } from '@src/components/Modals';
import InputText from '@src/components/InputText';
import { stripeService } from '@src/services/stripe';
import axios from 'axios';

const apiBrevo = axios.create(
  {
    baseURL: process.env.NEXT_PUBLIC_BREVO_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY || ''
    }
  }
);

import {
  EAccountLogin,
  EAccountData,
  EUrlsPages,
  accountSettingsRules
} from '@src/constants';

import {
  ENotificationActionTypes,
  ENotificationTypes,
  IError,
  TUserAttributes
} from '@src/types';

interface ISettingsForm {
  [EAccountLogin.EMAIL]: string;
  [EAccountLogin.PASSWORD]: string;
  [EAccountData.name]: string;
  [EAccountData.nameLast]: string;
  [EAccountData.email]: string;
  [EAccountData.username]: string;
  [EAccountData.userType]: string;
  [EAccountData.userOccupation]: string;
  [EAccountData.acceptedTerms]: boolean;
};

type TSettingsForm = ISettingsForm | FieldValues;

interface IAccountSettingsPageProps {
  prevUrl: string | undefined;
};

const AccountSettingsPage: NextPage<IAccountSettingsPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const {
    state: { user },
    dispatch
  } = useContext(AppContext);
  const [errors, setErrors] = useState<IError[]>([]);
  const [termAcceptance, setTermAcceptance] = useState(false);
  const { control, handleSubmit, formState, setValue } = useForm<TSettingsForm>();
  const [isOpenModalNewsletterAccount, setIsOpenModalNewsletterAccount] = useState(false);
  const handleIsOpenModalNewsletterAccount = () => setIsOpenModalNewsletterAccount(!isOpenModalNewsletterAccount);
  const [subscribed, setSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [accountData, setAccountData] = useState<TUserAttributes | null>(null);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      if (accountData.name) {
        setValue(EAccountData.name, accountData.name);
      };
      if (accountData.nameLast) {
        setValue(EAccountData.nameLast, accountData.nameLast);
      };
      if (accountData.email) {
        setValue(EAccountData.email, accountData.email);
      }
      if (accountData.username) {
        setValue(EAccountData.username, accountData.username);
      };
      if (accountData.userType) {
        setValue(EAccountData.userType, accountData.userType);
      };
      if (accountData.userOccupation) {
        setValue(EAccountData.userOccupation, accountData.userOccupation);
      };
      if (accountData.acceptedTerms) {
        setValue(EAccountData.acceptedTerms, accountData.acceptedTerms);
        setTermAcceptance(accountData.acceptedTerms);
      };
    } else {
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    };
  }, [router, setValue]);

  // Check if user is subscribed to PMD Plus
  useEffect(() => {
    const getSubscription = async () => {
      const { subscription } = await stripeService.getSubscriptionStatus();
      setSubscription(subscription);
    }
    getSubscription();

    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    setAccountData(accountData);
  }, []);

  // Check if user is subscribed to Email Newsletters
  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    let email: string = '';
    if (accountData.email) {
      email = accountData.email;
    };

    const checkSubscribed = async (email: string) => {
      try {
        const data = await apiBrevo.get(('/contacts/' + email + '?identifierType=email_id'));
        setSubscribed([8, 28, 29, 30, 31].some(id => data.data.listIds.includes(id)));
      } catch (error: any) {
      };
    };

    checkSubscribed(email);
  }, [dispatch, setSubscribed]);

  const handleChangeDetailsSettings: SubmitHandler<TSettingsForm> = ({ name, nameLast, email, username, userType, userOccupation }) => {
    if (!handleError({ name }) && user) {
      localStorage.setItem('accountData', JSON.stringify({
        ...user,
        name,
        nameLast,
        email,
        username,
        userType,
        userOccupation,
        [EAccountData.acceptedTerms]: termAcceptance
      }));
      handleDetails({
        ...user,
        name,
        nameLast,
        email,
        username,
        userType,
        userOccupation,
        [EAccountData.acceptedTerms]: termAcceptance
      });
    };
  };

  const handleDetails = async (form: any) => {
    try {
      await api.put(`users/${user?.id}`, form);
      handleChangeSubscription();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Account Details Updated',
          type: ENotificationTypes.SUCCESS
        }
      });
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.error?.message,
            type: ENotificationTypes.ERROR
          }
        });
      };
    };
  };

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in accountSettingsRules) {
      if (!accountSettingsRules[key].rule(form[key]))
        newErrors.push({ name: key, message: accountSettingsRules[key].message });
    };
    newErrors.forEach((el) =>
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: el.message,
          type: ENotificationTypes.ERROR
        }
      })
    );
    setErrors(newErrors);
    if (newErrors.length > 0) return true;
  };

  const findErrors = (string: string) =>
    errors.find((el) => el?.name === string);

  // Determine if user is already subscribed or unsubscribed and update subscription status accordingly
  const handleChangeSubscription = async () => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.email) {
      if (!subscribed) {
        await handleUnsubscribe(accountData.name, accountData.nameLast, accountData.email, accountData.userOccupation);
      } else {
        await handleSubscribe(accountData.name, accountData.nameLast, accountData.email, accountData.userOccupation);
      }
    }
  };

  // Subscribe user to Email Newsletters
  const handleSubscribe = async (name: string, nameLast: string, email: string, occupation: string) => {
    try {
      const brevoRequest = {
        'attributes': {
          'FIRSTNAME': name,
          'LASTNAME': nameLast,
          'JOB_TITLE': occupation,
          'NEWSLETTER_SOURCE': 'account-settings',
          'OPT_IN': true
        },
        'email': email,
        'listIds': [
          34, // Newsletter
          ((accountData?.id || subscription) ? 23 : 22) // Free Account (22) OR Plus Account (23)
        ],
        'emailBlacklisted': false
      };
      await apiBrevo.put(('/contacts/' + email + '?identifierType=email_id'), brevoRequest);
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.message,
            type: ENotificationTypes.ERROR
          }
        });
      };
    };
  };

  // Unsubscribe user from Email Newsletters
  const handleUnsubscribe = async (name: string, nameLast: string, email: string, occupation: string) => {
    try {
      const brevoRequest = {
        'attributes': {
          'FIRSTNAME': name,
          'LASTNAME': nameLast,
          'JOB_TITLE': occupation,
          'OPT_IN': false
        },
        'email': email,
        'listIds': [
          ((accountData?.id || subscription) ? 23 : 22) // Free Account (22) OR Plus Account (23)
        ],
        'unlinkListIds': [
          34 // Newsletter
        ],
        'emailBlacklisted': true
      };
      await apiBrevo.put(('/contacts/' + email + '?identifierType=email_id'), brevoRequest);
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.message,
            type: ENotificationTypes.ERROR
          }
        });
      };
    };
  };

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.ACCOUNT_SETTINGS}
      prevUrl={prevUrl}
      title='Account Settings - Piano Music Database'
      description='Edit your Piano Music Database account and access exclusive benefits such as favorites and custom lists.'
      image=''
    >
      <Form>
        <div className='flex flex-col sm:max-w-[340px]'>
          <h1>Account Settings</h1>
          <p className='mt-2'>Fill out your account details below.</p>
          <h2 className='mt-6 text-sm'><strong>Your Details</strong></h2>
          <div className='flex flex-col gap-y-6 pt-3 pb-8'>
            <div>
              <Field
                labelEl={<Label
                  htmlFor={EAccountData.name}
                  label='First Name'
                  labelRequired={<span className='text-pmdRed'> *</span>}
                />}
                labelClassName='font-bold mb-1'
                name={EAccountData.name}
                component={InputText}
                control={control}
                formState={formState}
                placeholder='Your First Name'
                className='!px-5 pt-[17px] pb-4'
                error={
                  formState.errors[EAccountData.name] ||
                  findErrors(EAccountData.name)
                }
              />
              <p className='pt-1 text-pmdRed text-sm'>
                {findErrors(EAccountData.name)?.message}
              </p>
            </div>
            <div>
              <Field
                labelEl={<Label
                  htmlFor={EAccountData.nameLast}
                  label='Last Name'
                />}
                labelClassName='font-bold mb-1'
                name={EAccountData.nameLast}
                component={InputText}
                control={control}
                formState={formState}
                placeholder='Your Last Name'
                className='!px-5 pt-[17px] pb-4'
              />
            </div>
            <div>
              <Field
                labelEl={<Label
                  htmlFor={EAccountData.email}
                  label='Email'
                />}
                labelClassName='font-bold mb-1'
                name={EAccountData.email}
                component={InputText}
                control={control}
                formState={formState}
                placeholder='Your Email (Contact us to change)'
                className='bg-pmdGrayLight !px-5 pt-[17px] pb-4 cursor-not-allowed'
                disabled={true}
              />
              <p className='pt-1 text-pmdGray text-sm italic'>
                <Link href={`/${EUrlsPages.CONTACT}`}><a title='Contact us' className='text-pmdGray'>Contact us</a></Link> to change your email address.
              </p>
            </div>
            <div>
              <Field
                labelEl={<Label
                  htmlFor={EAccountData.userOccupation}
                  label='Your Occupation(s)'
                />}
                labelClassName='font-bold mb-1'
                name={EAccountData.userOccupation}
                component={InputText}
                control={control}
                formState={formState}
                placeholder='Occupation(s)'
                className='!px-5 pt-[17px] pb-4'
                error={
                  formState.errors[EAccountData.userOccupation] ||
                  findErrors(EAccountData.userOccupation)
                }
              />
              <p className='pt-1 text-pmdRed text-sm'>
                {findErrors(EAccountData.userOccupation)?.message}
              </p>
            </div>
          </div>
          <a
            title='Save Details'
            className='mx-auto mb-10 !py-2 text-center cursor-pointer button'
            onClick={handleSubmit(handleChangeDetailsSettings)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSubmit(handleChangeDetailsSettings);
              }
            }}
            tabIndex={0}
          >
            Save Details
          </a>
          <p className='flex justify-end mt-10 pr-1 w-full text-sm text-end'>
            <a
              title='Communication Preferences'
              aria-label='Communication Preferences'
              aria-haspopup='dialog'
              aria-expanded={isOpenModalNewsletterAccount}
              aria-controls='modalNewsletterAccount'
              className='cursor-pointer'
              onClick={handleIsOpenModalNewsletterAccount}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleIsOpenModalNewsletterAccount();
                }
              }}
              tabIndex={0}
            >
              <em>Communication Preferences</em>
            </a>
          </p>
          <p className='flex justify-end mt-10 pr-1 w-full text-sm text-end'>
            <Link href={`/${EUrlsPages.REQUEST_PASSWORD}`}>
              <a title='Request Password Reset'>
                <em>Request Password Reset</em>
              </a>
            </Link>
          </p>
        </div>
        <ModalNewsletterAccount
          isOpen={isOpenModalNewsletterAccount}
          onClose={handleIsOpenModalNewsletterAccount}
        />
      </Form>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? ''
    }
  };
};

export default AccountSettingsPage;
