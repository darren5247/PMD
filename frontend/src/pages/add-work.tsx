import { GetServerSideProps, NextPage } from 'next';
import Page from '@src/components/Page';
import AddWork from '@src/components/AddWork';
import { EUrlsPages } from '@src/constants';

interface IAddWorkPageProps {
    prevUrl: string | undefined;
};

const AddWorkPage: NextPage<IAddWorkPageProps> = ({ prevUrl }) => {
    return (
        <Page
            showBackBar={true}
            showBackBarShare={false}
            showBackBarFeedback={false}
            url={EUrlsPages.ADD_WORK}
            prevUrl={prevUrl}
            title='Add a Work to Piano Music Database'
            description='Add a work to Piano Music Database. Added pieces have over 25 different pedagogical data points (level, element, mood, style, and more) that are included in Piano Music Database.'
            image=''
        >
            <div className='flex flex-col max-w-[600px]'>
                <h1>Add a Work</h1>
                <div className='flex flex-col gap-3 mt-3 mb-6'>
                    <p>Submit a new piano piece to our database by filling out this form.</p>
                    <p className='text-sm'>Fill out this form <strong>fully</strong> and <strong>accurately</strong> <em>including proper capitalization.</em></p>
                    <p className='my-4 text-sm'><span className='font-bold text-pmdRed text-base'>*</span> indicates a required field <br /><em className='text-xs'>Required Fields: Title, Composer, Level, Era</em></p>
                </div>
                <AddWork />
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

export default AddWorkPage;