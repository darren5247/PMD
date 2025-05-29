import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Page from '@src/components/Page';
import Link from 'next/link';
import cn from 'classnames';
import CardComposer from '@src/components/CardComposer';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiComposer
} from '@src/types';
import { EUrlsPages } from '@src/constants';

interface IComposersPageProps {
  prevUrl: string | undefined;
};

const ComposersPage: NextPage<IComposersPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const [composers, setComposers] = useState<IStrapiComposer[]>([]);
  const [currentPage, setCurrentPage] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingComposers, setIsLoadingComposers] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(
    () => {
      // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
      const { page } = query;

      // Page
      if (page) setCurrentPage(Number(page as string));

      const getComposers = async () => {
        try {
          setIsLoadingComposers(true);
          const fetchedData = [];
          const { data } = await api.get(
            `composers?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=name:asc&fields[0]=name&fields[1]=birth_year&fields[2]=death_year&fields[3]=nationality&populate[image][fields][4]=height&populate[image][fields][5]=width&populate[image][fields][6]=url&populate[image][fields][7]=alternativeText&populate[works][fields][8]=title&filters[publishedAt][$null]=false&publicationState=live`
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
    }, [dispatch, router, currentPage, query, setComposers, setIsLoadingComposers]
  );

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.COMPOSERS}
      title='Composers - Piano Music Database'
      description='Explore composers on Piano Music Database. Buy their sheet music, find the perfect works that make up their repertoire, and discover other details about your favorite composers.'
      image=''
    >
      <div className='flex flex-col justify-center items-center text-center'>
        <h1>Composers</h1>
        <p className='mt-3 max-w-[800px]'>Explore composers on Piano Music Database.</p>
        <div id='composers' className='flex flex-col flex-wrap justify-center items-center mt-8'>
          {isLoadingComposers ? (
            <p>Loading composers...</p>
          ) : (
            (composers ? (
              <div className='flex flex-col justify-center items-stretch gap-4 text-center align-middle'>
                {composers.map((composer) => (
                  <CardComposer
                    key={`ComposerItem-${composer.id}`}
                    name={composer.attributes.name}
                    birth_year={composer.attributes.birth_year}
                    death_year={composer.attributes.death_year}
                    nationality={composer.attributes.nationality}
                    imageURL={composer.attributes.image?.data?.attributes.url}
                    works={composer.attributes.works.data}
                    id={composer.id}
                    hideLabel={true}
                  />
                ))}
                <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                  <Link
                    href={(
                      EUrlsPages.COMPOSERS +
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
                      EUrlsPages.COMPOSERS +
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
                      EUrlsPages.COMPOSERS +
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
                      EUrlsPages.COMPOSERS +
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

export default ComposersPage;