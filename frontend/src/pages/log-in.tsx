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
import { EAccountLogin, EUrlsPages, logInRules } from '@src/constants';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  EUserTypes,
  IError,
  TUserAttributes
} from '@src/types';

interface ILogInForm {
  [EAccountLogin.EMAIL]: string;
  [EAccountLogin.PASSWORD]: string;
};

type TLogInForm = ILogInForm | FieldValues;

interface ILogInPageProps {
  prevUrl: string | undefined;
};

const LogInPage: NextPage<ILogInPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const [errors, setErrors] = useState<IError[]>([]);
  const { control, handleSubmit, formState, reset } = useForm<TLogInForm>();

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl, undefined, { shallow: false });
      } else {
        router.push(`/${EUrlsPages.ACCOUNT_DASHBOARD}`, undefined, { shallow: false });
      };
    };
  }, [router]);

  const handleLogIn: SubmitHandler<TLogInForm> = ({ email, password }) => {
    if (!handleError({ email: email, password: password })) {
      handleData(email, password);
    }
  };

  const handleLogInDispatch = (user: TUserAttributes) => {
    dispatch({
      type: EUserTypes.LOG_IN,
      payload: user
    });
    dispatch({
      type: ENotificationActionTypes.SET_MESSAGE,
      payload: {
        message: 'Logged In',
        type: ENotificationTypes.SUCCESS
      }
    });
  };

  const handleData = async (email: string, password: string) => {
    try {
      const { data } = await api.post(`auth/local`, {
        identifier: email,
        password: password
      });
      const { jwt } = data;
      handleLogInDispatch(data?.user);
      if (jwt) {
        document.cookie = `jwt=${jwt}; max-age=2592000; SameSite=Strict`;
        const userData = await api.get(`users/me?populate[works][fields]0]=id&populate[works][fields][1]=title&populate[works][fields][2]=createdAt&populate[works][fields][3]=updatedAt&populate[works][fields][4]=publishedAt&populate[works][populate][composers][fields][0]=name`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const accountData: TUserAttributes = userData.data;
        localStorage?.setItem('accountData', JSON.stringify(accountData));
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl, undefined, { shallow: false });
        } else {
          router.push(`/${EUrlsPages.ACCOUNT_DASHBOARD}`, undefined, { shallow: false });
        };
      };
      reset();
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: (
              (error?.response?.data.error.message) ? (
                (error?.response?.data.error.message == 'Invalid identifier or password') ? (
                  'Incorrect Username or Password. Try again.'
                ) : (
                  (error?.response?.data.error.message == 'Your account email is not confirmed') ? (
                    'Email not confirmed! Click the link in the email we sent to confirm.'
                  ) : (
                    error?.response?.data.error.message
                  )
                )
              ) : (
                'An error occurred. Please try again.'
              )
            ),
            type: ENotificationTypes.ERROR
          }
        });
      };
    };
  };

  const handleError = (form: any) => {
    let newErrors = [];
    for (const key in logInRules) {
      if (!logInRules[key].rule(form[key]))
        newErrors.push({ name: key, message: logInRules[key].message });
    };
    setErrors(newErrors);
    if (newErrors.length > 0) {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Incorrect Username or Password. Try again.',
          type: ENotificationTypes.ERROR
        }
      });
      return true;
    } else {
      return false;
    };
  };

  const findErrors = (string: string) => errors.find((el) => el?.name === string);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.LOG_IN}
      prevUrl={prevUrl}
      title='Log In - Piano Music Database'
      description='Log into your Piano Music Database account and access your account with its benefits such as adding piano music to the database.'
      image=''
    >
      <div className='flex flex-col sm:max-w-[340px]' id='login'>
        <h1>Log In</h1>
        <Form onSubmit={handleSubmit(handleLogIn)}>
          <div className='flex flex-col gap-y-4 pt-5 pb-3'>
            <div>
              <Field
                labelEl={<Label
                  htmlFor={EAccountLogin.EMAIL}
                  label='Email'
                  labelRequired={<span className='text-pmdRed'> *</span>}
                />}
                name={EAccountLogin.EMAIL}
                type='email'
                component={InputText}
                control={control}
                formState={formState}
                placeholder={'Email'}
                className='pt-[17px] pr-[19px] pb-[16px] !pl-5'
                error={formState.errors.email || findErrors(EAccountLogin.EMAIL)}
              />
              <p className='pt-[4px] text-pmdRed text-sm leading-[14px]'>
                {findErrors(EAccountLogin.EMAIL)?.message}
              </p>
            </div>
            <div>
              <Field
                labelEl={<Label
                  htmlFor={EAccountLogin.EMAIL}
                  label='Password'
                  labelRequired={<span className='text-pmdRed'> *</span>}
                />}
                name={EAccountLogin.PASSWORD}
                type='password'
                component={InputText}
                control={control}
                formState={formState}
                placeholder={'Password'}
                className='pt-[17px] pr-[19px] pb-[14px] !pl-5'
                error={formState.errors.password || findErrors(EAccountLogin.PASSWORD)}
              />
              <p className='pt-[4px] text-pmdRed text-sm leading-[14px]'>
                {findErrors(EAccountLogin.PASSWORD)?.message}
              </p>
            </div>
          </div>
          <p className='mb-8 text-pmdGrayDark text-sm text-end'>
            <Link href={`/${EUrlsPages.REQUEST_PASSWORD}`}>
              <a
                title='Forgot Password?'
                className='cursor-pointer'
              >
                Forgot Password?
              </a>
            </Link>
          </p>
          <div className='flex items-center mb-12 text-center'>
            <button title='Log In' className='mx-auto !py-2 w-full button' type='submit'>Log In</button>
          </div>
          <p className='text-pmdGrayDark text-sm text-center'>
            Don’t have an account? <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
              <a
                title='Create Account'
                className='text-pmdRed hover:text-pmdGray underline cursor-pointer'
              >
                Create Account
              </a>
            </Link>
          </p>
        </Form>
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

export default LogInPage;
