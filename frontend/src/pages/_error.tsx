import type { GetServerSideProps, NextPage } from 'next';
import Page from '@src/components/Page';

interface IErrorPageProps {
  prevUrl: string | undefined;
};

const ErrorPage: NextPage<IErrorPageProps> = ({ prevUrl }) => {
  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url='error'
      prevUrl={prevUrl}
      title='Error - Piano Music Database'
      description='An error occurred and the request was unable to be completed. Start a new search at PianoMusicDatabase.com/search. Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers.'
      image=''
    >
      <>
        <h1>Error</h1>
        <h2 className='mt-10'><em>An error occurred.</em></h2>
        <p className='mt-2'>An internal error or misconfiguration occurred and the request was unable to be completed.</p>
      </>
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

export default ErrorPage;