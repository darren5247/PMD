import { GetServerSideProps, NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Page from '@src/components/Page';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import Link from 'next/link';
import cn from 'classnames';
import Works from '@src/components/Works';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
  IStrapiFavorite,
  IStrapiPieceTable
} from '@src/types';
import { EUrlsPages } from '@src/constants';

interface IFavoritesPageProps {
  prevUrl: string | undefined;
};

const FavoritesPage: NextPage<IFavoritesPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const [email, setUserEmail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<IStrapiFavorite[]>([]);
  const [works, setWorks] = useState<IStrapiPieceTable[]>([]);
  const [currentPage, setCurrentPage] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(Number(query.pageSize) && Number(query.pageSize) > 1 ? Number(query.pageSize) : 10);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(
    () => {
      const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
      if (accountData.id) {
        if (accountData.email) {
          setUserEmail(accountData.email);
        };
      } else {
        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search + window.location.hash);
        router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
      };

      // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
      const { page } = query;

      // Page
      if (page) setCurrentPage(Number(page as string));

      const getFavorites = async () => {
        try {
          setIsLoadingFavorites(true);
          const fetchedData = [];
          const { data } = await api.get(
            `favorites?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=createdAt:desc&populate[work][fields][0]=title&populate[work][populate][eras][fields][1]=name&populate[work][populate][composers][fields][2]=name&populate[work][populate][level][fields][3]=title&populate[user][fields][4]=email&populate[work][fields][5]=createdAt&filters[user][id][$eq]=${accountData.id}`
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
            setFavorites(fetchedData);
            fetchedData.sort((a, b) => {
              const createdAtA = a.attributes.createdAt || 0;
              const createdAtB = b.attributes.createdAt || 0;
              if (createdAtA === createdAtB) {
                const titleA = a.attributes.work.data.attributes.title.toLowerCase();
                const titleB = b.attributes.work.data.attributes.title.toLowerCase();
                return titleA.localeCompare(titleB);
              }
              return createdAtA - createdAtB;
            });
            const fetchedDataFiltered = fetchedData.map((favorite) => {
              try {
                const w = favorite.attributes.work.data;
                return {
                  id: w.id,
                  title: w.attributes.title,
                  eras: w.attributes.eras?.data?.map((c: { attributes: { name: string } }) => c.attributes.name).join(', ') || '',
                  composers: w.attributes.composers?.data?.map((c: { attributes: { name: string } }) => c.attributes.name).join(', ') || '',
                  level: w.attributes.level?.data?.attributes?.title || '',
                };
              } catch (error) {
                console.error('Error processing favorite:', favorite, error);
                return null;
              }
            }).filter(favorite => favorite !== null);
            setWorks(fetchedDataFiltered);
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
          setFavorites([]);
        } finally {
          setIsLoadingFavorites(false);
        };
      };

      getFavorites();
    }, [dispatch, router, currentPage, pageSize, query, setWorks, setIsLoadingFavorites]
  );

  const onRemove = async (favoritedWorkId: number, favoriteId: number) => {
    if (favoriteId !== null) {
      handleRemove(favoritedWorkId, favoriteId);
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error removing piece from favorites, please refresh and try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleRemove = async (favoritedWorkId: number, favoriteId: number) => {
    if (favoritedWorkId !== null && favoriteId !== undefined) {
      try {
        const { data } = await api.delete(
          `favorites/${favoriteId}`
        );
        if (data !== null && data !== undefined) {
          const newWorks = works.filter(work => work.id !== favoritedWorkId);
          setWorks(newWorks);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Piece removed from favorites`,
              type: ENotificationTypes.SUCCESS
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error removing piece from favorites, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        };
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error removing piece from favorites, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error removing piece from favorites (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
      };
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error removing piece from favorites, please refresh and try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.FAVORITES}
      title='Favorites - Piano Music Database'
      image=''
    >
      <div className='flex flex-col justify-center items-center text-center favorites-center'>
        <h1>Favorites</h1>
        <p className='mt-3 max-w-[570px]'>Add pieces to your favorites to quickly save those pieces for later. <br />Simply click the heart beside a work to favorite or unfavorite it. <br />Your favorite works can also be added to lists, for further organization.</p>
        <div id='favorites' className='flex flex-col flex-wrap justify-center mt-8 w-full max-w-[1100px] favorites-center'>
          {isLoadingFavorites ? (
            <p>Loading favorites...</p>
          ) : (
            favorites.length > 0 ? (
              <div className='flex flex-row flex-wrap justify-center items-stretch gap-3 my-4 max-w-[816px] text-center align-middle favorites-center'>
                <Works label='Your Favorites' onRemoveFavoriteItem={onRemove} works={works} isFavoritePage={true} />
                {favorites.length > 9 && (
                  <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                    <Link
                      href={(
                        '/' + EUrlsPages.FAVORITES +
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
                        '/' + EUrlsPages.FAVORITES +
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
                        '/' + EUrlsPages.FAVORITES +
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
                        '/' + EUrlsPages.FAVORITES +
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
                )}
              </div>
            ) : (
              <p>No favorites found.</p>
            )
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

export default FavoritesPage;