import { GetServerSideProps, NextPage } from 'next';
import Page from '@src/components/Page';
import AddCollection from '@src/components/AddCollection';
import { EUrlsPages } from '@src/constants';

interface IAddCollectionPageProps {
    prevUrl: string | undefined;
};

const AddCollectionPage: NextPage<IAddCollectionPageProps> = ({ prevUrl }) => {
    return (
        <Page
            showBackBar={true}
            showBackBarShare={false}
            showBackBarFeedback={false}
            url={EUrlsPages.ADD_COLLECTION}
            prevUrl={prevUrl}
            title='Add a Collection to Piano Music Database'
            description='Add a collection to Piano Music Database. Added collection can have title, catalogue numbers, composed dates, published dates, ISBN codes, and video links that are included in Piano Music Database.'
            image=''
        >
            <div className='flex flex-col max-w-[600px]'>
                <h1>Add a Collection</h1>
                <div className='flex flex-col gap-3 mt-3 mb-6'>
                    <p>Submit a new collection of piano pieces to our database by filling out this form.</p>
                    <p className='text-sm'>Fill out this form <strong>fully</strong> and <strong>accurately</strong> <em>including proper capitalization.</em></p>
                    <p className='my-4 text-sm'><span className='font-bold text-pmdRed text-base'>*</span> indicates a required field <br /><em className='text-xs'>Required Field: Title</em></p>
                </div>
                <AddCollection />
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

export default AddCollectionPage;