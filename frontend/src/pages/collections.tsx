import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import Page from '@src/components/Page';
import CardCollection from '@src/components/CardCollection';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiCollection
} from '@src/types';
import { EUrlsPages } from '@src/constants';

interface ICollectionsPageProps {
  prevUrl: string | undefined;
};

const CollectionsPage: NextPage<ICollectionsPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const [collections, setCollections] = useState<IStrapiCollection[]>([]);
  const [currentPage, setCurrentPage] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(
    () => {
      // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
      const { page } = query;

      // Page
      if (page) setCurrentPage(Number(page as string));

      const getCollections = async () => {
        try {
          setIsLoadingCollections(true);
          const fetchedData = [];
          const { data } = await api.get(
            `collections?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=title:asc&populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[works][fields][1]=title&fields[0]=title&fields[1]=published_date&fields[2]=composed_date&populate[image][fields][3]=height&populate[image][fields][4]=width&populate[image][fields][5]=url&populate[image][fields][6]=alternativeText&filters[publishedAt][$null]=false&publicationState=live`
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
            setCollections(fetchedData);
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
          setIsLoadingCollections(false);
        }
      };

      getCollections();
    }, [dispatch, router, currentPage, query, setCollections, setIsLoadingCollections]
  );

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.COLLECTIONS}
      title='Collections - Piano Music Database'
      description='Explore collections on Piano Music Database. Buy the sheet music, find the perfect works that make up the collection, and discover other details.'
      image=''
    >
      <div className='flex flex-col justify-center items-center text-center'>
        <h1>Collections</h1>
        <p className='mt-3 max-w-[816px]'>Explore collections on Piano Music Database. Buy the sheet music, find the works that make up the collection, and discover other details.</p>
        <div id='collections' className='flex flex-col flex-wrap justify-center items-center mt-8 w-full max-w-[1100px]'>
          {isLoadingCollections ? (
            <p>Loading collections...</p>
          ) : (
            (collections ? (
              <div className='flex flex-col justify-center items-stretch gap-4 text-center align-middle'>
                {collections.map((collection) => (
                  <CardCollection
                    key={`CollectionItem-${collection.id}`}
                    title={collection.attributes.title}
                    collection={collection}
                    id={collection.id}
                    hideLabel={true}
                  />
                ))}
                <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                  <Link
                    href={(
                      EUrlsPages.COLLECTIONS +
                      '?page=1'
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
                      EUrlsPages.COLLECTIONS +
                      ('?page=' + (currentPage - 1))
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
                      EUrlsPages.COLLECTIONS +
                      ('?page=' + (currentPage + 1))
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
                      EUrlsPages.COLLECTIONS +
                      ('?page=' + totalPages)
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
              </div>
            ) : '')
          )}
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

export default CollectionsPage;