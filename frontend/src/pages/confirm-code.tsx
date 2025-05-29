import { GetServerSideProps, NextPage } from 'next';
import Page from '@src/components/Page';
import { EUrlsPages } from '@src/constants';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@src/api/config';
import { AppContext } from '@src/state';
import { ENotificationActionTypes, ENotificationTypes } from '@src/types';

interface IAccountCreatedPageProps {
  prevUrl: string | undefined;
};

const AccountCreatedPage: NextPage<IAccountCreatedPageProps> = ({ prevUrl }) => {

  const { dispatch } = useContext(AppContext);

  const router = useRouter();
  const { email } = router.query;

  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post('confirm-opt', {
        email,
        code,
      });

      if (res.data.ok) {
        router.push(`/${EUrlsPages.LOG_IN}`);
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: res.data.message,
            type: ENotificationTypes.SUCCESS
          }
        });
      }
    } catch (err: any) {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: err?.response?.data.error.message,
          type: ENotificationTypes.ERROR
        }
      });
    }
  }

  return (
    <>
      <Page
        showBackBar={true}
        showBackBarShare={false}
        showBackBarFeedback={true}
        url={EUrlsPages.CONFIRM_CODE}
        prevUrl={prevUrl}
        title='Confirm Your Account'
        description='Enter received the 6-digit code to confirm email'
        image=''
      >
        <div className="max-w-[600px] mx-auto p-6">
          <h1 className="mb-10 text-center">Confirm Your Account</h1>
          <div className="max-w-md mx-auto">
            <p className="mb-10 text-gray-600">Please enter the 6-digit code sent to your email: <strong>{email}</strong></p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Enter code"
                required
              />
              <button title='Verify Code' className='mx-auto !py-2 w-full button' type='submit'>Verify Code</button>
            </form>
          </div>
        </div>
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? ''
    }
  };
};

export default AccountCreatedPage;
