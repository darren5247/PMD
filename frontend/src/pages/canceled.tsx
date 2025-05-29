import { GetServerSideProps, NextPage } from 'next';
import Page from '@src/components/Page';
import { EUrlsPages } from '@src/constants';
import Link from 'next/link';

interface IPlusCanceledPageProps {
  prevUrl: string | undefined;
}

const PlusCanceledPage: NextPage<IPlusCanceledPageProps> = ({ prevUrl }) => {
  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.CANCELED}
      title='Subscription Canceled - Piano Music Database'
      description='Your subscription to PMD Plus was canceled or otherwise encountered an error.'
      image=''
    >
      <h1 className='my-4'>Payment Error!</h1>
      <p className='mb-2 text-lg text-center'>We could not process your payment.</p>
      <p className='mb-2 text-lg text-center'>The payment was canceled or encountered an error.</p>
      <p className='mb-4 text-lg text-center'>Please try again.</p>
      <Link href={`/${EUrlsPages.PRICING}`}><a title='Pricing' className='mb-6 cursor-pointer button'>Pricing</a></Link>
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

export default PlusCanceledPage;