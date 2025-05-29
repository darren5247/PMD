import { GetServerSideProps, NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import Page from '@src/components/Page';
import Label from '@src/components/Label';
import Field from '@src/components/Field';
import Form from '@src/components/Form';
import InputText from '@src/components/InputText';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import axios from 'axios';
import Divider from '@src/components/Divider';
import { EAccountLogin, EAccountData, EUrlsPages, signUpRules } from '@src/constants';
import {
  ModalAcceptTerms
} from '@src/components/Modals';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IError,
  TUserAttributes
} from '@src/types';

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

interface ICreateAccountForm {
  [EAccountData.name]: string;
  [EAccountData.nameLast]: string;
  [EAccountData.userOccupation]: string;
  [EAccountLogin.EMAIL]: string;
  [EAccountLogin.PASSWORD]: string;
  marketingConsent: boolean;
};

type TCreateAccountForm = ICreateAccountForm | FieldValues;

interface ICreateAccountPageProps {
  prevUrl: string | undefined;
};

const CreateAccountPage: NextPage<ICreateAccountPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const [data, setData] = useState<any>(null);
  const [errors, setErrors] = useState<IError[]>([]);
  const { control, handleSubmit, formState, reset, register } = useForm<TCreateAccountForm>();
  const [isOpenModalAcceptTerms, setIsOpenModalAcceptTerms] = useState(false);
  const handleIsOpenModalAcceptTerms = () => {
    handleData(data);
    setIsOpenModalAcceptTerms(!isOpenModalAcceptTerms);
  };

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
        if (!accountData.name) {
          router.push(`/${EUrlsPages.ACCOUNT_SETTINGS}`, undefined, { shallow: false });
        } else {
          router.push(`/${EUrlsPages.ACCOUNT_DASHBOARD}`, undefined, { shallow: false });
        };
    };
  }, [router]);

  const handleCreateAccount: SubmitHandler<TCreateAccountForm> = ({ name, nameLast, userOccupation, email, password, marketingConsent }) => {
    if (!handleError({ name: name, email: email, password: password })) {
      setIsOpenModalAcceptTerms(true);
      setData({ name: name, nameLast: nameLast, userOccupation: userOccupation, username: email, userType: 'User', email: email.toLowerCase(), password, acceptedTerms: true, marketingConsent });
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Fill in the required fields.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleData = async (form: any) => {
    try {
      await api.post(`auth/local/register/`, form);
      { form.marketingConsent ? handleSubscribe(form.name, form.nameLast, form.userOccupation, form.email) : handleUnsubscribe(form.name, form.nameLast, form.userOccupation, form.email) };
      router.push(`/${EUrlsPages.CONFIRM_CODE}?email=${encodeURIComponent(form.email)}`, undefined, { shallow: false });
      reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message; 
      if (errorMessage?.includes('Email or Username are already taken')) {
        await api.post('confirm-opt/resend', {
          email: form.email
        }).then(response =>{
          if (response.data?.ok) {
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: 'Account already exists. Confirmation email re-sent.',
                type: ENotificationTypes.ERROR
              }
            });
            router.push(`/${EUrlsPages.CONFIRM_CODE}?email=${encodeURIComponent(form.email)}`, undefined, { shallow: false });
          } 
        }).catch(err => {
          const alreadyConfirmed = err?.response?.data?.error?.message?.includes('Already confirmed');
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: alreadyConfirmed
                ? 'Account already confirmed.'
                : 'Failed to resend confirmation code.',
                type: ENotificationTypes.ERROR
              }
            });
            if(alreadyConfirmed) router.push(`/${EUrlsPages.LOG_IN}?email=${encodeURIComponent(form.email)}`, undefined, { shallow: false });
        })
      } else {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: errorMessage || 'An error occurred.',
            type: ENotificationTypes.ERROR
          }
        });
      }
    };
  };

  const handleSubscribe = async (name: string, nameLast: string, userOccupation: string, email: string) => {
    try {
      const brevoRequest = {
        'attributes': {
          'FIRSTNAME': name,
          'LASTNAME': nameLast,
          'JOB_TITLE': userOccupation,
          'NEWSLETTER_SOURCE': 'create-account',
          'OPT_IN': true
        },
        'email': email,
        'listIds': [
          34, // Newsletter
          22 // Free Account
        ],
        'updateEnabled': true,
        'emailBlacklisted': false
      };
      await apiBrevo.post('/contacts', brevoRequest);
    } catch (error: any) {
      if (error?.response?.data && error?.response?.data.error?.message !== 'Unable to create contact, email is already associated with another Contact') {
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

  const handleUnsubscribe = async (name: string, nameLast: string, userOccupation: string, email: string) => {
    try {
      const brevoRequest = {
        'attributes': {
          'FIRSTNAME': name,
          'LASTNAME': nameLast,
          'JOB_TITLE': userOccupation,
          'NEWSLETTER_SOURCE': 'create-account',
          'OPT_IN': false
        },
        'email': email,
        'listIds': [
          22 // Free Account
        ],
        'unlinkListIds': [
          34 // Newsletter
        ],
        'emailBlacklisted': true
      };
      await apiBrevo.post('/contacts', brevoRequest);
    } catch (error: any) {
      if (error?.response?.data && error?.response?.data.error?.message !== 'Unable to create contact, email is already associated with another Contact') {
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

  const handleError = (form: any) => {
    let newErrors = [];
    for (const key in signUpRules) {
      if (!signUpRules[key].rule(form[key])) {
        newErrors.push({ name: key, message: signUpRules[key].message });
      };
    };
    setErrors(newErrors);
    if (newErrors.length > 0) {
      return true
    };
  };

  const findErrors = (string: string) => errors.find((el) => el?.name === string);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.CREATE_ACCOUNT}
      prevUrl={prevUrl}
      title='Create Account - Piano Music Database'
      description='Create a Piano Music Database account and access exclusive benefits such as adding piano music to the database.'
      image=''
    >
      <div className='flex flex-col text-center' id='createaccount'>
        <h1>Welcome to <br /><em className='font-medium'>PMD Plus</em> Early Access!</h1>
        <div className='flex flex-col gap-2 mx-auto my-4 sm:max-w-[640px]'>
          <p className='text-sm text-justify'>
            <em className='font-medium'>PMD Plus</em> is our new subscription plan that is currently in development. While it is in development, we are opening it up for our users to try out for free! During Early Access, you will be able to use all of the upcoming <em className='font-medium'>PMD Plus</em> features, including full, unlimited access to the search engine, favorites, and lists. Once the Early Access period is over, you will need to upgrade to <em className='font-medium'>PMD Plus</em> in order to keep your data and continue using these features. We will let you know as Early Access is coming to close so that you have lots of time to make a decision. You will get a special discount for <em className='font-medium'>PMD Plus</em> when it officially launches as a thank you for helping us test out the next generation of Piano Music Database!
          </p>
          <p className='text-sm text-justify'>
            *<em className='font-medium'>PMD Plus</em> Early Access is under development, and you may run into occasional bugs during usage. If you would like, you can report these to us, so that we are made aware of them and can incorporate fixes into future versions.
          </p>
          <p className='mt-4 text-base text-center'>
            To get Early Access to <em className='font-medium'>PMD Plus</em>, <br />create your free account by clicking <strong>Continue</strong> below.
          </p>
        </div>
        <Divider className='!my-8' />
        <div className='flex flex-col gap-2 mx-auto sm:max-w-[340px]'>
          <h3 id='create'>Create Your Account</h3>
          <Form onSubmit={handleSubmit(handleCreateAccount)}>
            <div className='flex flex-col gap-y-5 mt-2'>
              <div>
                <Field
                  labelEl={<Label
                    htmlFor={EAccountData.name}
                    label='First Name'
                    labelRequired={<span className='text-pmdRed'> *</span>}
                  />}
                  name={EAccountData.name}
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder='First Name'
                  className='pt-[17px] pr-[19px] pb-[16px] !pl-5'
                  error={formState.errors.name || findErrors(EAccountData.name)}
                />
                <p className='text-pmdRed text-sm leading-[14px]'>
                  {findErrors(EAccountData.name)?.message}
                </p>
              </div>
              <div>
                <Field
                  labelEl={<Label
                    htmlFor={EAccountData.nameLast}
                    label='Last Name'
                  />}
                  name={EAccountData.nameLast}
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder='Last Name'
                  className='pt-[17px] pr-[19px] pb-[16px] !pl-5'
                />
              </div>
              <div>
                <Field
                  labelEl={<Label
                    htmlFor={EAccountData.userOccupation}
                    label='Occupation'
                  />}
                  name={EAccountData.userOccupation}
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder='Occupation'
                  className='pt-[17px] pr-[19px] pb-[16px] !pl-5'
                />
              </div>
              <div>
                <Field
                  labelEl={<Label
                    htmlFor={EAccountLogin.EMAIL}
                    label='Email'
                    labelRequired={<span className='text-pmdRed'> *</span>}
                  />}
                  name={EAccountLogin.EMAIL}
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder='Email'
                  className='pt-[17px] pr-[19px] pb-[16px] !pl-5'
                  error={formState.errors.email || findErrors(EAccountLogin.EMAIL)}
                />
                <p className='text-pmdRed text-sm leading-[14px]'>
                  {findErrors(EAccountLogin.EMAIL)?.message}
                </p>
              </div>
              <div>
                <Field
                  labelEl={<Label
                    htmlFor={EAccountLogin.PASSWORD}
                    label='Password'
                    labelRequired={<span className='text-pmdRed'> *</span>}
                  />}
                  name={EAccountLogin.PASSWORD}
                  type='password'
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder='Password'
                  className='pt-[17px] pr-[19px] pb-[14px] !pl-5'
                  error={formState.errors.password || findErrors(EAccountLogin.PASSWORD)}
                />
                <p className='text-pmdRed text-sm leading-[14px]'>
                  {findErrors(EAccountLogin.PASSWORD)?.message}
                </p>
              </div>
              <div className='flex items-center gap-2 mt-2 grow'>
                <input
                  title='Sign Up for Our Email Newsletter?'
                  type='checkbox'
                  className='border border-pmdGray rounded-lg focus-visible:outline-0 w-6 h-6 cursor-pointer'
                  {...register('marketingConsent')}
                />
                <label
                  className='inline-block text-black text-sm cursor-text'
                  htmlFor='marketingConsent'
                >
                  Sign Up for Our Email Newsletter?
                </label>
              </div>
            </div>
            <p className='mt-4 mb-8 text-pmdGray text-sm text-center'>
              By creating an account, you agree to the
              <br />
              <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}>
                <a
                  title='Terms & Conditions'
                  className='text-pmdGray cursor-pointer'
                >
                  Terms & Conditions
                </a>
              </Link>{' '}
              and{' '}
              <Link href={`/${EUrlsPages.PRIVACY_POLICY}`}>
                <a
                  title='Privacy Policy'
                  className='text-pmdGray cursor-pointer'
                >
                  Privacy Policy
                </a>
              </Link>
              .
            </p>
            <div className='flex items-center mb-12 text-center'>
              <button
                title='Create Account'
                className='mx-auto !py-2 w-full button'
                type='submit'
              >Continue</button>
              <ModalAcceptTerms
                isOpen={isOpenModalAcceptTerms}
                onClose={handleIsOpenModalAcceptTerms}
              />
            </div>
            <p className='text-pmdGrayDark text-sm text-center'>
              Already have an account? <Link href={`/${EUrlsPages.LOG_IN}`}>
                <a
                  title='Log In'
                  className='text-pmdRed hover:text-pmdGray underline cursor-pointer'
                >
                  Log In
                </a>
              </Link>
            </p>
          </Form>
        </div>
      </div>
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

export default CreateAccountPage;
