import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import Link from 'next/link';
import cn from 'classnames';
import { EUrlsPages } from '@src/constants';
import Page from '@src/components/Page';
import ImageNext from '@src/components/ImageNext';
import Divider from '@src/components/Divider';
import { IconPlus, IconFeedback } from '@src/common/assets/icons';
import Chip from '@src/components/Chip';
import {
    ENotificationActionTypes,
    ENotificationTypes,
    IStrapiComposer,
    TUserAttributes
} from '@src/types';
import { ModalEditDisclaimer } from '@src/components/Modals';

interface IComposersAddedPageProps {
    prevUrl: string | undefined;
};

const ComposersAddedPage: NextPage<IComposersAddedPageProps> = ({ prevUrl }) => {
    const router = useRouter();
    const { query } = router;
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    let [composers, setComposers] = useState<IStrapiComposer[]>([]);
    const [currentPage, setCurrentPage] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(Number(query.pageSize) && Number(query.pageSize) > 1 ? Number(query.pageSize) : 10);
    const [isLoadingComposers, setIsLoadingComposers] = useState(false);
    const [showModalEditDisclaimer, setShowModalEditDisclaimer] = useState<boolean>(false);

    const { dispatch } = useContext(AppContext);

    useEffect(() => {
        const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
        if (accountData.id) {
            if (accountData.name) {
                setUserName(accountData.name);
                if (accountData.email) {
                    setUserEmail(accountData.email);
                };
            } else {
                router.push(`/${EUrlsPages.ACCOUNT_SETTINGS}`, undefined, { shallow: false });
            };
        } else {
            router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
        };

        // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
        const { page } = query;

        // Page
        if (page) setCurrentPage(Number(page as string));

        const getComposers = async () => {
            try {
                setIsLoadingComposers(true);
                const fetchedData = [];
                const { data } = await api.get(
                    `composers?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=name:asc&populate[composers][fields][0]=name&populate[composers][fields][1]=name&populate[users][fields][2]=name&populate[users][fields][3]=email&fields[0]=name&fields[1]=createdAt&fields[2]=updatedAt&fields[3]=publishedAt&fields[4]=adminReview&filters[users][email][$eq]=${userEmail}&publicationState=preview`
                );
                fetchedData.push(...data?.data);

                // Redirect to last page if current page is greater than total pages
                if (data?.meta?.pagination?.pageCount < currentPage && data?.meta?.pagination?.pageCount > 0) {
                    setCurrentPage(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
                    router.push({
                        pathname: router.pathname,
                        query: { ...router.query, page: data.meta.pagination.pageCount }
                    });
                } else {
                    setComposers(fetchedData);
                    setTotalPages(data?.meta?.pagination?.pageCount || 1);
                }
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
            } finally {
                setIsLoadingComposers(false);
            }
        };

        getComposers();
    }, [dispatch, router, currentPage, pageSize, query, setComposers, setIsLoadingComposers, userEmail]
    );

    return (
        <Page
            showBackBar={true}
            showBackBarShare={false}
            showBackBarFeedback={true}
            url={EUrlsPages.COMPOSERS_ADDED}
            prevUrl={prevUrl}
            title='Composers Added - Piano Music Database'
            description='View composers added to Piano Music Database by you and quickly edit details of those composers.'
            image=''
        >
            <div className='max-w-[460px] text-center'>
                <h1 className='mx-auto'>
                    Composers Added
                </h1>
                <>
                    {isLoadingComposers ? (
                        <p className='mt-6'>Loading Composers...</p>
                    ) : (
                        (composers && composers.length) ? (
                            <div>
                                <div id='edits' className='flex flex-row flex-wrap justify-center items-center gap-x-5 gap-y-2 bg-pmdGrayBright my-6 px-3 py-8 rounded-lg w-full text-center'>
                                    <p>Need to edit a composer?</p>
                                    <a
                                        title='Send Edits'
                                        aria-label='Send Edits'
                                        aria-haspopup='dialog'
                                        aria-expanded={showModalEditDisclaimer}
                                        aria-controls='modalEditDisclaimer'
                                        className='flex flex-row gap-2 cursor-pointer'
                                        onClick={() => { setShowModalEditDisclaimer(true); }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                setShowModalEditDisclaimer(true);
                                            }
                                        }}
                                        tabIndex={0}
                                    >
                                        <ImageNext
                                            src={IconFeedback}
                                            alt=''
                                            height={20}
                                            width={20}
                                            className='z-0'
                                        />
                                        <strong>Send Edits</strong>
                                    </a>
                                    <ModalEditDisclaimer
                                        type='Composers-Added Edit Composer Disclaimer'
                                        url={`${EUrlsPages.COMPOSERS_ADDED}`}
                                        onClose={() => { setShowModalEditDisclaimer(false); }}
                                        isOpen={showModalEditDisclaimer}
                                    />
                                </div>
                                <Divider className='mt-0 mb-0' />
                                <div className='flex justify-center mx-auto mt-8 px-4 text-center'>
                                    <a
                                        title='Add New Composer'
                                        className='flex flex-row justify-center items-center gap-2 align-middle cursor-pointer'
                                        href={`/${EUrlsPages.ADD_COMPOSER}`}
                                    >
                                        <ImageNext
                                            src={IconPlus}
                                            alt=''
                                            height={16}
                                            width={15}
                                            className='z-0'
                                        />
                                        <strong>Add New Composer</strong>
                                    </a>
                                </div>
                                {userName && (
                                    <div className='flex flex-row justify-center items-center gap-4 mt-8 mb-4 px-4 align-middle'>
                                        <p>Composers added by:</p>
                                        <Chip title={userName} />
                                    </div>
                                )}
                                {composers.map((composer) => (
                                    <div className='flex flex-row gap-4 even:bg-white odd:bg-pmdGrayBright mt-6 p-4 text-left' key={composer.id}>
                                        <div className='flex flex-col gap-4 text-left'>
                                            <p><strong>#{composer.id}</strong></p>
                                            <Link href={`/${EUrlsPages.COMPOSER}/${encodeURIComponent(composer.attributes.name)}?id=${composer.id}`}>
                                                <a title={`View composer #${composer.id}`} className='flex flex-row'>View</a>
                                            </Link>
                                            {/* <Link href={`/${EUrlsPages.EDIT_COMPOSER}/${encodeURIComponent(composer.attributes.name)}?id=${composer.id}`}>
                                                    <a title={`Edit composer #${composer.id}`} className='flex flex-row'>Edit</a>
                                                </Link> */}
                                        </div>
                                        <div className='flex flex-col gap-2 text-left'>
                                            <div className='flex flex-row gap-4 pb-2 border-pmdGray border-b text-left'>
                                                <p><em>{composer.attributes.name}</em></p>
                                            </div>
                                            <div className='flex flex-row gap-4 text-left'>
                                                <p>Created {composer.attributes.createdAt.replace('T', ' at ').replace('Z', ' GMT')}</p>
                                            </div>
                                            <div className='flex flex-row gap-4 text-left'>
                                                <p>Updated {composer.attributes.updatedAt.replace('T', ' at ').replace('Z', ' GMT')}</p>
                                            </div>
                                            {composer.attributes.publishedAt ? (
                                                <div className='flex flex-row gap-4 text-left'>
                                                    <p>Published {composer.attributes.publishedAt.replace('T', ' at ').replace('Z', ' GMT')}</p>
                                                </div>
                                            ) : (
                                                (composer.attributes.adminReview) ? (
                                                    composer.attributes.adminReview == 'Complete' ? (
                                                        <div className='flex flex-col text-left'>
                                                            <p>Under Review</p>
                                                            <p>Review Status: Complete, Awaiting Publish</p>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col text-left'>
                                                            <p>Under Review</p>
                                                            <p>Review Status: {composer.attributes.adminReview}</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <p>Under Review</p>
                                                )
                                            )}
                                        </div>

                                    </div>
                                ))}
                                {composers.length > 9 && (
                                    <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                                        <Link
                                            href={(
                                                EUrlsPages.COMPOSERS_ADDED +
                                                '?page=1#worksAdded'
                                            )}
                                        >
                                            <a
                                                title='First Page'
                                                className={cn(
                                                    currentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                    'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                )}
                                            >
                                                First
                                            </a>
                                        </Link>
                                        <Link
                                            href={(
                                                EUrlsPages.COMPOSERS_ADDED +
                                                ('?page=' + (currentPage - 1))
                                                + '#worksAdded'
                                            )}
                                        >
                                            <a
                                                title='Previous Page'
                                                className={cn(
                                                    currentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                    'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                )}
                                            >
                                                Prev
                                            </a>
                                        </Link>
                                        <span className='mx-2'>{currentPage} of {totalPages}</span>
                                        <Link
                                            href={(
                                                EUrlsPages.COMPOSERS_ADDED +
                                                ('?page=' + (currentPage + 1))
                                                + '#worksAdded'
                                            )}
                                        >
                                            <a
                                                title='Next Page'
                                                className={cn(
                                                    currentPage === totalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                    'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                )}
                                            >
                                                Next
                                            </a>
                                        </Link>
                                        <Link
                                            href={(
                                                EUrlsPages.COMPOSERS_ADDED +
                                                ('?page=' + totalPages)
                                                + '#worksAdded'
                                            )}
                                        >
                                            <a
                                                title='Last Page'
                                                className={cn(
                                                    currentPage === totalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                    'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                )}
                                            >
                                                Last
                                            </a>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex flex-col justify-center items-center px-4 text-center'>
                                {userName ? (
                                    <div className='flex flex-col justify-center items-center gap-4 mt-6 mb-6 align-middle'>
                                        <Link href={`/${EUrlsPages.ADD_COMPOSER}`}><a
                                            title='Add New Composer'
                                            className='flex flex-row justify-center items-center gap-2 align-middle cursor-pointer'
                                        >
                                            <ImageNext
                                                src={IconPlus}
                                                alt=''
                                                height={16}
                                                width={15}
                                                className='z-0'
                                            />
                                            <strong>Add New Composer</strong>
                                        </a></Link>
                                        <div className='flex flex-row flex-wrap justify-center items-center gap-4 mt-2 mb-4 align-middle'>
                                            <p>No composers added yet by:</p>
                                            <Chip title={userName} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex flex-col justify-center items-center gap-6 mt-6 mb-4 align-middle'>
                                        <Link href={`/${EUrlsPages.ADD_COMPOSER}`}><a
                                            title='Add New Composer'
                                            className='flex flex-row justify-center items-center gap-2 align-middle cursor-pointer'
                                        >
                                            <ImageNext
                                                src={IconPlus}
                                                alt=''
                                                height={16}
                                                width={15}
                                                className='z-0'
                                            />
                                            <strong>Add New Composer</strong>
                                        </a></Link>
                                        <p>No composers added yet.</p>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </>
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

export default ComposersAddedPage;
