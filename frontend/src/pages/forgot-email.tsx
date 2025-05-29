import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Page from '@src/components/Page';
import { ModalFeedback } from '@src/components/Modals';
import { EUrlsPages } from '@src/constants';

interface IForgotEmailPageProps {
  prevUrl: string | undefined;
};

const ForgotEmailPage: NextPage<IForgotEmailPageProps> = ({ prevUrl }) => {
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.FORGOT_EMAIL}
      prevUrl={prevUrl}
      title='Forgot Email? - Piano Music Database'
      description='Did you forget your Piano Music Database account email? Contact us and provide relevant information and we may be able to connect you with the email on your account.'
      image=''
    >
      <div className='flex flex-col mx-auto max-w-[340px]'>
        <h1>
          Forgot Your Email?
        </h1>
        <p className='mt-4 mb-2 text-pmdGrayDark text-sm'>
          Contact us and provide relevant information and we may be able to connect you with the email on your account.
        </p>
        <p className='mt-4 mb-2 text-pmdGrayDark text-sm'>
          <a className='cursor-pointer button' title='Email Piano Music Database using Contact@PianoMusicDatabase.com' onClick={() => { setShowModalFeedback(true); }} tabIndex={0}>Contact Us</a>
        </p>
        <p className='mt-4 mb-2 text-pmdGrayDark text-sm'>
          Or, send an email to <Link href='mailto:Contact@PianoMusicDatabase.com?subject=Forgot Email for Piano Music Database Account'><a className='break-all sm:break-normal' title='Email Piano Music Database using Contact@PianoMusicDatabase.com'>Contact@PianoMusicDatabase.com</a></Link>
        </p>
        <p className='mt-4 mb-12 text-pmdGrayDark text-sm'>
          <Link href={`/${EUrlsPages.REQUEST_PASSWORD}`}>
            <a title='Forgot Password?'>Forgot Password?</a>
          </Link>
        </p>
        <p className='text-pmdGrayDark text-sm text-center'>
          <Link href={`/${EUrlsPages.LOG_IN}`}>
            <a title='Log In'>Log In</a>
          </Link>{/*  or <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
            <a title='Create Account'>Create Account</a>
          </Link> */}
        </p>
      </div>
      <ModalFeedback
        type='ForgotEmail'
        url={`${EUrlsPages.FORGOT_EMAIL}`}
        onClose={() => { setShowModalFeedback(false); }}
        isOpen={showModalFeedback}
      />
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

export default ForgotEmailPage;
