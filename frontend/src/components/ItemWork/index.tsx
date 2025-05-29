import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import cn from 'classnames';
import Link from 'next/link';
import { EUrlsPages } from '@src/constants';
import ContentDivider from '@src/components/ContentDivider';
import BuyLink from '@src/components/BuyLink';
import ChipIcon from '@src/components/ChipIcon';
import Edit from '@src/components/Edit';
import VideoPlayer from '@src/components/VideoPlayer';
import WorkElements from '@src/components/WorkElements';
import ImageNext from '@src/components/ImageNext';
import ImagePicture from '@src/components/ImagePicture';
import { handleCleanContent } from '@src/api/helpers';
import { ModalFeedback, ModalEdit } from '@src/components/Modals';
import { handleTitleWithJustNumber } from '@src/api/helpers';
import Divider from '@src/components/Divider';
import ModalEditHistory from '@src/components/Modals/ModalEditHistory';
import { stripeService } from '@src/services/stripe';
import AdsenseAd from '@src/components/AdsenseAd';
import { ICookieConsent } from '@src/types/cookies';
import { useCookieConsent } from '@src/context/CookieConsentContext';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
  IStrapiPiece,
  IStrapiComposer
} from '@src/types';
import {
  IconBuyDownloadIndividual,
  IconOpen,
  IconFeedbackWhite,
  IconListenOnSpotify,
  IconListenOnAppleMusic,
  IconHeartWhite,
  IconHeartFilledWhite,
  IconBookmark,
  IconBookmarkWhite
} from '@src/common/assets/icons';
import {
  ModalListAddTo
} from '@src/components/Modals';

interface IItemWorkProps {
  musicWork: IStrapiPiece | null;
  isEdit?: boolean;
};

export const ItemWork: FC<IItemWorkProps> = ({ musicWork, isEdit }): JSX.Element => {
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const [showModalEditHistory, setShowModalEditHistory] = useState<boolean>(false);
  const [showModalEditTitle, setShowModalEditTitle] = useState<boolean>(false);
  const [showModalEditTitle2, setShowModalEditTitle2] = useState<boolean>(false);
  const [showModalEditAlternateTitle, setShowModalEditAlternateTitle] = useState<boolean>(false);
  const [accountData, setAccountData] = useState<TUserAttributes | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setUserEmail] = useState<string | null>(null);
  const [favId, setFavId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isSubmitFavoriteAllowed, setIsSubmitAllowed] = useState(true);
  const [isOpenModalListAddTo, setIsOpenModalListAddTo] = useState(false);
  const handleIsOpenModalListAddTo = () => setIsOpenModalListAddTo(!isOpenModalListAddTo);
  const [subscription, setSubscription] = useState<any>(null);
  const { cookieConsent } = useCookieConsent();
  const [preferences, setPreferences] = useState<ICookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  // Update preferences when cookieConsent changes
  useEffect(() => {
    if (cookieConsent) {
      setPreferences(cookieConsent);
    }
  }, [cookieConsent]);

  // Check if user is subscribed
  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      setAccountData(accountData);

      // const getSubscription = async () => {
      //   const { subscription } = await stripeService.getSubscriptionStatus();
      //   setSubscription(subscription);
      // }
      // getSubscription();
    }
  }, []);

  useEffect(
    () => {
      const getFavorites = async () => {
        try {
          setIsLoadingFavorites(true);
          setIsSubmitAllowed(false);
          const { data } = await api.get(
            `favorites?pagination[page]=1&pagination[pageSize]=1&populate[work][fields][0]=title&populate[user][fields][1]=email&filters[user][id][$eq]=${userId}&filters[work][id][$eq]=${musicWork?.id ? musicWork.id : 0}`
          );
          if (data !== null || data !== undefined || data?.data.length > 0) {
            const favoriteID = (data?.data.length > 0 && data?.data[0].id) ? data?.data[0].id : null;
            setFavId(favoriteID);
            const newIsFavorite = (data?.data.length > 0 && data?.data[0].id) ? true : false
            setIsFavorite(newIsFavorite);
          } else {
            setFavId(null);
            setIsFavorite(null);
          }
        } catch (error: any) {
          setFavId(null);
          setIsFavorite(null);
        } finally {
          setIsLoadingFavorites(false);
          setIsSubmitAllowed(true);
        };
      };

      const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');

      if (accountData.email) {
        setUserId(accountData.id);
        setUserEmail(accountData.email);
        if (userId && email) {
          getFavorites();
        } else {
          setFavId(null);
          setIsFavorite(null);
        }
      };
    }, [dispatch, userId, email, router, musicWork]
  );

  const handleAddFavorite = async () => {
    if (userId !== null && musicWork?.id !== null) {
      try {
        setIsLoadingFavorites(true);
        const dataAdded = await api.post('favorites', {
          data: {
            user: {
              id: userId
            },
            work: {
              id: musicWork?.id ? musicWork.id : 0
            },
          }
        });
        if (dataAdded !== null && dataAdded !== undefined && dataAdded.data.data.id) {
          const favoriteID = dataAdded.data.data.id ? dataAdded.data.data.id : null;
          setFavId(favoriteID);
          const newIsFavorite = dataAdded.data.data.id ? true : false;
          setIsFavorite(newIsFavorite);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: musicWork?.attributes.title ? `Favorite Added: ${musicWork?.attributes.title.trim()}` : `Favorite Added`,
              type: ENotificationTypes.SUCCESS
            }
          });
        }
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error adding favorite, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
      };
    };
  };

  const handleRemoveFavorite = async (id: string) => {
    if (userId !== null && id !== null) {
      try {
        setIsLoadingFavorites(true);
        setIsSubmitAllowed(false);
        await api.delete(`favorites/${id}`, {
          data: {
            user: {
              id: userId
            },
            work: {
              id: id
            },
          }
        });
        setIsFavorite(false);
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: musicWork?.attributes.title ? `Favorite Removed: ${musicWork?.attributes.title.trim()}` : `Favorite Removed`,
            type: ENotificationTypes.SUCCESS
          }
        });
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error removing favorite, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
      };
    };
  };

  const handleChangeFavorite = async (favorite: boolean) => {
    if (musicWork?.id !== null && userId !== null) {
      try {
        setIsLoadingFavorites(true);
        setIsSubmitAllowed(false);
        const { data } = await api.get(
          `favorites?pagination[page]=1&pagination[pageSize]=1&populate[work][fields][0]=title&populate[work][populate][eras][fields][1]=name&populate[work][populate][composers][fields][2]=name&populate[work][populate][level][fields][3]=title&populate[user][fields][4]=email&filters[user][id][$eq]=${userId}&filters[work][id][$eq]=${musicWork?.id ? musicWork.id : 0}`
        );
        if (data !== null && data !== undefined && data.data.length > 0 && data.data[0].id) {
          if (!favorite) {
            handleRemoveFavorite(data.data[0].id.toString());
          } else {
            setIsFavorite(true);
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: musicWork?.attributes.title ? `Favorite Added: ${musicWork?.attributes.title.trim()}` : `Favorite Added`,
                type: ENotificationTypes.SUCCESS
              }
            });
          }
        } else {
          if (favorite) {
            handleAddFavorite();
          } else {
            setIsFavorite(false);
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: musicWork?.attributes.title ? `Favorite Removed: ${musicWork?.attributes.title.trim()}` : `Favorite Removed`,
                type: ENotificationTypes.SUCCESS
              }
            });
          }
        };
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error updating favorite, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
        setIsSubmitAllowed(true);
      };
    };
  };

  if (musicWork) {
    if (musicWork.attributes.composers.data?.length) {
      musicWork.attributes.composers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name)
          return -1;
        if (a.attributes.name > b.attributes.name)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.publishers.data?.length) {
      musicWork.attributes.publishers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name)
          return -1;
        if (a.attributes.name > b.attributes.name)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.styles.data?.length) {
      musicWork.attributes.styles.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.moods.data?.length) {
      musicWork.attributes.moods.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.themes.data?.length) {
      musicWork.attributes.themes.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.studentAges.data?.length) {
      musicWork.attributes.studentAges.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.studentTypes.data?.length) {
      musicWork.attributes.studentTypes.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.timeSignatures.data?.length) {
      musicWork.attributes.timeSignatures.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.keySignatures.data?.length) {
      musicWork.attributes.keySignatures.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
    if (musicWork.attributes.teachingTips.data?.length) {
      musicWork.attributes.teachingTips.data?.sort((a, b) => {
        if (a.attributes.title < b.attributes.title)
          return -1;
        if (a.attributes.title > b.attributes.title)
          return 1;
        return 0;
      })
    }
  };

  let workComposers: string | undefined;
  let workComposersRaw: IStrapiComposer[];
  if (musicWork && musicWork.attributes.composers.data?.length) {
    workComposers = '';
    workComposersRaw = musicWork?.attributes?.composers?.data;
    workComposersRaw.forEach(composer => {
      if (workComposers) {
        if (workComposersRaw.length == 2) {
          workComposers = workComposers + ' and ' + composer.attributes.name;
        } else {
          workComposers = workComposers + ', ' + composer.attributes.name;
        }
      } else {
        workComposers = composer.attributes.name;
      };
    });
  } else { workComposers = ''; };

  let titleSaved: string | undefined;
  let workTitleDisplay: string | undefined;
  let workTitleEncoded: string | undefined;
  let workURL: string | undefined;
  if (musicWork && musicWork.attributes.title) {
    titleSaved = musicWork.attributes.title;
    workTitleDisplay = titleSaved + ' by ' + workComposers;
    workTitleEncoded = encodeURIComponent(handleTitleWithJustNumber(titleSaved)) + '-' + encodeURIComponent(handleTitleWithJustNumber(workComposers));
    workURL = EUrlsPages.WORK + '/' + workTitleEncoded + '?id=' + musicWork.id;
  } else { titleSaved = ''; workTitleDisplay = ''; workTitleEncoded = ''; workURL = ''; };

  return (
    <>
      {(musicWork) && (
        <article id={`${musicWork.id}`} className='flex flex-col justify-center items-center gap-y-3 text-center'>
          {musicWork.attributes.promoText && (
            <div className='bg-pmdGrayLight shadow-workNav mb-12 py-8 rounded-b-lg w-full text-left'>
              <div
                dangerouslySetInnerHTML={
                  {
                    __html: handleCleanContent(musicWork.attributes.promoText)
                  }
                }
              />
            </div>
          )}
          {/* {isEdit && (
            <section id='edit' className='flex justify-center'>
              <div className='bg-orange-500 shadow-workNav mx-4 mb-12 py-4 rounded-lg'>
                <h2 className='px-4 text-white text-2xl text-center tracking-thigh'><strong>Edit Mode</strong></h2>
                <Divider className='mt-4 mb-3' />
                <p className='mt-4 px-4 text-white text-center tracking-thigh'><strong>Click on an Edit button to edit that field.</strong></p>
                {(musicWork.attributes.edits?.data && musicWork.attributes.edits?.data?.length > 0) && (
                  <>
                    <Divider className='mt-4 mb-3' />
                    <a
                      title='Show Edit History'
                      aria-label='Show Edit History'
                      aria-haspopup='dialog'
                      aria-expanded={showModalEditHistory}
                      aria-controls='modalEditHistory'
                      onClick={() => { setShowModalEditHistory(true); }}
                      className='mt-4 px-4 text-white text-center tracking-thigh cursor-pointer'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setShowModalEditHistory(true);
                        }
                      }}
                      tabIndex={0}
                    ><strong>View the full Edit History for this work</strong></a>
                    <ModalEditHistory
                      item={workTitleDisplay}
                      edits={musicWork.attributes.edits?.data ? musicWork.attributes.edits?.data : undefined}
                      onClose={() => { setShowModalEditHistory(false); }}
                      isOpen={showModalEditHistory}
                    />
                  </>
                )}
              </div>
            </section>
          )} */}
          {!musicWork.attributes.publishedAt && (
            <section id='review' className='flex justify-center'>
              <div className='bg-orange-500 shadow-workNav mx-4 mb-12 py-4 rounded-lg'>
                <h2 className='px-4 text-white text-2xl text-center tracking-thigh'><strong>UNDER REVIEW</strong></h2>
                <Divider className='mt-4 mb-3' />
                <p className='px-4 text-white text-center tracking-thigh'><strong>This work is currently <em>under review</em> by staff.</strong></p>
                <p className='mt-4 px-4 text-white text-center tracking-thigh'><strong>This page is publicly viewable while under review, but the work will not appear in PMD search results.</strong></p>
                <p className='mt-4 px-4 text-white text-center tracking-thigh'><strong>Also, some data may not be viewable on this page while under review.</strong></p>
                <p className='px-4 text-white text-center tracking-thigh'><strong>This includes related collections, composers, and publishers which are under review.</strong></p>
                <Divider className='mt-4 mb-3' />
                <div id='feedback' className='flex flex-row flex-wrap justify-center gap-x-5 gap-y-2 px-4 text-white text-center tracking-thigh'>
                  <p><strong><em>See any issues or have suggestions?</em></strong></p>
                  <a
                    title='Send Feedback'
                    aria-label='Send Feedback'
                    aria-haspopup='dialog'
                    aria-expanded={showModalFeedback}
                    aria-controls='modalFeedback'
                    className='flex flex-row gap-2 text-white cursor-pointer'
                    onClick={() => { setShowModalFeedback(true); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowModalFeedback(true);
                      }
                    }}
                    tabIndex={0}
                  >
                    <ImageNext
                      src={IconFeedbackWhite}
                      alt=''
                      height={20}
                      width={20}
                      className='z-0'
                    />
                    Send Feedback
                  </a>
                  <ModalFeedback
                    type={'DraftWork - ' + workURL}
                    url={workURL}
                    onClose={() => { setShowModalFeedback(false); }}
                    isOpen={showModalFeedback}
                  />
                </div>
              </div>
            </section>
          )}
          {/* {!isEdit && (
            <section id='review' className='flex justify-center'>
              <div className='bg-orange-500 shadow-workNav mx-4 mb-12 py-4 rounded-lg'>
                <div id='feedback' className='flex flex-row flex-wrap justify-center gap-x-5 gap-y-2 px-4 text-white text-center tracking-thigh'>
                  <p><strong><em>See any issues or have suggestions?</em></strong></p>
                  <Link href={'/' + EUrlsPages.EDIT_WORK + '/' + workTitleEncoded + '?id=' + musicWork.id}><a
                    title='Send Feedback'
                    className='flex flex-row gap-2 text-white cursor-pointer'
                  >
                    <ImageNext
                      src={IconFeedbackWhite}
                      alt=''
                      height={20}
                      width={20}
                      className='z-0'
                    />
                    Edit
                  </a></Link>
                </div>
              </div>
            </section>
          )} */}
          <div className='flex flex-col justify-center items-center gap-y-3 text-center'>
            <div className='flex flex-col mb-4 max-w-[1000px] text-center'>
              <div className='flex min-[935px]:flex-row flex-col justify-center items-top max-[935px]:items-center gap-x-6 gap-y-8 text-center'>
                {musicWork.attributes.image?.data ? (
                  <div className='min-[935px]:mt-5 min-w-auto sm:min-w-[300px] max-w-[240px] sm:max-w-[300px]'>
                    <ImagePicture
                      alt={musicWork.attributes.image?.data?.attributes.alternativeText ? musicWork.attributes.image?.data?.attributes.alternativeText : musicWork.attributes.title ? musicWork.attributes.title : ''}
                      src={musicWork.attributes.image?.data?.attributes.url ? musicWork.attributes.image?.data?.attributes.url : ''}
                      height={musicWork.attributes.image?.data?.attributes.height ? musicWork.attributes.image?.data?.attributes.height : 0}
                      width={musicWork.attributes.image?.data?.attributes.width ? musicWork.attributes.image?.data?.attributes.width : 0}
                    />
                  </div>
                ) : ''}
                <div
                  className={cn(
                    'mt-4 mb-1 flex gap-y-4 flex-col text-center justify-center items-center',
                    {
                      'min-[935px]:text-left': musicWork.attributes.image?.data
                    }
                  )}
                >
                  {musicWork.attributes.title ? (
                    <div
                      className={cn(
                        'flex flex-col justify-center gap-2 max-[420px]:max-w-64 max-[615px]:max-w-96 max-w-[575px] overflow-y-auto max-[615px]:text-center',
                        {
                          'pb-2 max-w-[700px] max-[615px]:text-center': !musicWork.attributes.image?.data
                        }
                      )}
                    >
                      <h1
                        className={cn(
                          'flex gap-2 justify-center items-center w-full max-w-auto py-1.5 max-[615px]:text-center whitespace-normal',
                          {
                            'pb-2': !musicWork.attributes.image?.data
                          }
                        )}
                      >
                        {musicWork.attributes.title}
                        {/* {isEdit && (<Edit
                      editLabel='Edit Title'
                      size={16}
                      onClick={() => { setShowModalEditTitle(true); }}
                      aria-label='Edit Title'
                      aria-haspopup='dialog'
                      aria-expanded={showModalEditTitle}
                      aria-controls='modalEditWorkTitle'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setShowModalEditTitle(true);
                        }
                      }}
                      tabIndex={0}
                    />)}
                    <ModalEdit
                      type='Work'
                      field='Title'
                      currentContent={musicWork.attributes.title}
                      work={musicWork.id.toString()}
                      edits={musicWork.attributes.edits?.data?.filter(edit => edit.attributes.field === 'Title') ?? undefined}
                      onClose={() => { setShowModalEditTitle(false); }}
                      isOpen={showModalEditTitle}
                    /> */}
                      </h1>
                    </div>
                  ) : ''}
                  <h2
                    className={cn(
                      'min-[935px]:w-full min-[935px]:max-w-[816px] min-[935px]:flex',
                      {
                        'flex align-middle items-center justify-center': !musicWork.attributes.image?.data
                      }
                    )}>
                    {musicWork.attributes.composers?.data?.length ? (
                      <div
                        className={cn(
                          'flex flex-row flex-wrap gap-1 pr-1.5 mt-1 w-full mx-auto min-[935px]:justify-center min-[935px]:text-left',
                          {
                            'text-center justify-center items-center': !musicWork.attributes.image.data
                          }
                        )}>
                        {musicWork.attributes.composers.data.map((composer, composerIndex) => (
                          <span className='text-base' key={`${composer.attributes.name}-${composerIndex}`}>
                            <Link href={`/${EUrlsPages.COMPOSER}/${composer.attributes.name}?id=${composer.id}`}>
                              <a className='text-base' title={`View ${composer.attributes.name}`}>{composer.attributes.name}</a>
                            </Link>
                            {musicWork.attributes.composers.data && composerIndex < musicWork.attributes.composers.data.length - 1 && ', '}
                          </span>
                        ))}</div>
                    ) : ''}
                  </h2>
                  {musicWork.attributes.description ? (
                    <div
                      className='min-[935px]:flex max-w-[575px] max-w-auto max-[420px]:max-w-64 max-[615px]:max-w-96 overflow-auto text-justify'
                    >
                      <div
                        className='flex min-[935px]:w-full min-[935px]:max-w-[816px] text-justify'
                        dangerouslySetInnerHTML={
                          {
                            __html: handleCleanContent(musicWork.attributes.description)
                          }
                        }
                      />
                    </div>
                  ) : ''}
                </div>
              </div>
            </div>
          </div>
          {(musicWork.attributes.scoreExcerpt.data?.attributes.formats?.large?.url ??
            musicWork.attributes.scoreExcerpt.data?.attributes.url) && (
              <div id='excerpt' className='mx-auto mb-8'>
                <div className='w-full max-md:w-[calc(76vw-16px)] max-w-screen max-md:overflow-x-auto'>
                  <div className='min-w-[707px] max-w-[707px] min-h-[164px] max-h-[164px]'>
                    <ImagePicture
                      alt={`Excerpt of ${musicWork.attributes.title}`}
                      src={
                        musicWork.attributes.scoreExcerpt.data?.attributes.formats?.large?.url ??
                        musicWork.attributes.scoreExcerpt.data?.attributes.url
                      }
                      height={164}
                      width={707}
                    />
                  </div>
                </div>
              </div>
            )}
          {userId && (
            <div className='flex flex-wrap justify-center items-center gap-4 mb-8 w-full h-full align-middle'>
              {isLoadingFavorites ? (
                <a
                  title={musicWork?.attributes.title ? 'Loading Favorite Status of ' + musicWork?.attributes.title : 'Loading Favorite Status'}
                  className='flex flex-row justify-center items-center gap-2 bg-pmdRed px-6 py-4 rounded-[5px] min-w-[148px] text-white text-sm text-center no-underline align-middle leading-[16px] tracking-thigh cursor-pointer'
                >
                  <div className='h-[16px] shrink-0'>
                    <svg
                      className="w-7 h-7 text-pmdRed animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  Loading
                </a>
              ) : (
                isFavorite ? (
                  <a
                    title={musicWork?.attributes.title ? 'Unfavorite ' + musicWork?.attributes.title : 'Unfavorite'}
                    onClick={() => {
                      isSubmitFavoriteAllowed == true && handleChangeFavorite(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        isSubmitFavoriteAllowed == true && handleChangeFavorite(false);
                      }
                    }}
                    tabIndex={0}
                    className='flex flex-row justify-center items-center gap-2 bg-pmdRed px-6 py-4 rounded-[5px] min-w-[148px] text-white text-sm text-center no-underline align-middle leading-[16px] tracking-thigh cursor-pointer'
                  >
                    <div className='h-[16px] shrink-0'>
                      <ImageNext src={IconHeartFilledWhite} width={16} height={16} />
                    </div>
                    Unfavorite
                  </a>
                ) : (
                  <a
                    title={musicWork?.attributes.title ? 'Favorite ' + musicWork?.attributes.title : 'Favorite'}
                    onClick={() => {
                      isSubmitFavoriteAllowed == true && handleChangeFavorite(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        isSubmitFavoriteAllowed == true && handleChangeFavorite(true);
                      }
                    }}
                    tabIndex={0}
                    className='flex flex-row justify-center items-center gap-2 bg-pmdRed px-6 py-4 rounded-[5px] min-w-[148px] text-white text-sm text-center no-underline align-middle leading-[16px] tracking-thigh cursor-pointer'
                  >
                    <div className='h-[16px] shrink-0'>
                      <ImageNext src={IconHeartWhite} width={16} height={16} />
                    </div>
                    Favorite
                  </a>
                )
              )}
              <div className='flex justify-center items-center align-middle'>
                <a
                  tabIndex={0}
                  className='flex flex-row justify-center items-center gap-2 bg-pmdRed px-6 py-4 rounded-[5px] min-w-[148px] text-white text-sm text-center no-underline align-middle leading-[16px] tracking-thigh cursor-pointer'
                  title='Add to List'
                  aria-label='Add to List'
                  aria-haspopup='dialog'
                  aria-expanded={isOpenModalListAddTo}
                  aria-controls={'ModalListAddTo' + (musicWork?.id ?? 0)}
                  onClick={handleIsOpenModalListAddTo}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleIsOpenModalListAddTo();
                    }
                  }}
                >
                  <div className='h-[16px] shrink-0'>
                    <ImageNext src={IconBookmarkWhite} width={16} height={16} />
                  </div>
                  Add to List
                </a>
                <ModalListAddTo
                  workId={musicWork?.id ?? 0}
                  workTitle={musicWork?.attributes.title ?? ''}
                  isOpen={isOpenModalListAddTo}
                  onClose={handleIsOpenModalListAddTo}
                />
              </div>
            </div>
          )}
          <section id='overview' className='mx-auto mb-14 px-4 max-w-[707px]'>
            {musicWork.attributes.sheetMusicLinks?.length ? (
              <div id='get' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                <div className='flex flex-col min-w-[175px] text-left'>
                  <p><strong>Get the <br />Sheet Music</strong></p>
                </div>
                {musicWork.attributes.sheetMusicLinks?.length ? (
                  <div className='flex flex-row flex-wrap justify-left items-left gap-2 mt-2 mb-5 text-left'>
                    {musicWork.attributes.sheetMusicLinks.map((sheetMusicLink) => (
                      <BuyLink key={sheetMusicLink.url ? sheetMusicLink.url : sheetMusicLink.sellerName} sellerName={sheetMusicLink.sellerName} itemName={`Get ${musicWork.attributes.title}`} url={sheetMusicLink.url} linkText={sheetMusicLink.linkText} sellerImage={sheetMusicLink.sellerImage.data?.attributes.url} sellerImageHeight={sheetMusicLink.sellerImage.data?.attributes.height} sellerImageWidth={sheetMusicLink.sellerImage.data?.attributes.width} />
                    ))}
                  </div>
                ) : ''}
              </div>
            ) : ''}
            {musicWork.attributes.collections?.data?.length ? (
              <>
                {musicWork.attributes.collections.data?.map((collection) => (
                  (collection.attributes?.purchase_link?.length ? (
                    <div key={collection.id} id='getcollection' className='flex flex-col'>
                      <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                        <div className='flex flex-col min-w-[175px] text-left'>
                          <p><strong>Included in</strong></p>
                        </div>
                        <div className='flex flex-col w-full h-full'>
                          <div className='flex gap-2'>
                            <Link key={collection.attributes.title} href={`/${EUrlsPages.COLLECTION}/${collection.attributes.title}?id=${collection.id}`}><a className='text-base' title={`View ${collection.attributes.title}`}>{collection.attributes.title}</a></Link>
                          </div>
                          {collection.attributes?.purchase_link?.length ? (
                            <div className='flex flex-row flex-wrap gap-2 mt-2 mb-5'>
                              {collection.attributes?.purchase_link?.map((sheetMusicLink) => (
                                <div key={sheetMusicLink.url ? sheetMusicLink.url : sheetMusicLink.sellerName}>
                                  <BuyLink sellerName={sheetMusicLink.sellerName} itemName={`Get ${collection.attributes.title} which includes ${musicWork.attributes.title}`} url={sheetMusicLink.url} linkText={sheetMusicLink.linkText} sellerImage={sheetMusicLink.sellerImage.data?.attributes.url} sellerImageHeight={sheetMusicLink.sellerImage.data?.attributes.height} sellerImageWidth={sheetMusicLink.sellerImage.data?.attributes.width} />
                                </div>
                              ))}
                            </div>
                          ) : ''}
                        </div>
                      </div>
                    </div>
                  ) : '')
                ))}
              </>
            ) : ''}
            {musicWork.attributes.score?.data?.attributes.url && (
              <div id='download' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                <div className='flex flex-col min-w-[175px] text-left'>
                  <p><strong>Individual <br />Download</strong></p>
                </div>
                <div className='flex md:flex-col flex-wrap gap-2 max-md:mt-2 pb-4'>
                  <div>
                    <BuyLink
                      sellerName='Download'
                      itemName={`Get ${workTitleDisplay}`}
                      url={musicWork.attributes.score?.data!.attributes.url}
                      linkText='Download'
                      sellerImage={IconBuyDownloadIndividual}
                      sellerImageWidth={60}
                      sellerImageHeight={40}
                    />
                  </div>
                </div>
              </div>
            )}
            {(musicWork.attributes.urlSpotify || musicWork.attributes.urlAppleMusic) && (
              <div id='listen' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                <div className='flex flex-col min-w-[175px] text-left'>
                  <p><strong>Listen</strong></p>
                </div>
                <div className='flex flex-wrap gap-2 max-md:mt-2 pb-4'>
                  {(musicWork.attributes.urlSpotify) && (
                    <div className='flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-1 rounded-lg text-center'>
                      <Link href={musicWork.attributes.urlSpotify}>
                        <a className='group flex justify-center items-center text-center' title={`Listen to ${workTitleDisplay} on Spotify`} target='_blank' rel='noopener noreferrer'>
                          <ImageNext
                            alt='Listen on Spotify'
                            src={IconListenOnSpotify}
                            height={40}
                            width={110}
                            className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                          />
                        </a>
                      </Link>
                    </div>
                  )}
                  {(musicWork.attributes.urlAppleMusic) && (
                    <div className='flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-1 rounded-lg text-center'>
                      <Link href={musicWork.attributes.urlAppleMusic}>
                        <a className='group flex justify-center items-center text-center' title={`Listen to ${workTitleDisplay} on Apple Music`} target='_blank' rel='noopener noreferrer'>
                          <ImageNext
                            alt='Listen on Apple Music'
                            src={IconListenOnAppleMusic}
                            height={40}
                            width={110}
                            className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                          />
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            {musicWork.attributes.eras.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.eras.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Eras</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Era</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.eras.data?.map((era, eraIndex) => (
                      <p key={era.attributes.name}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][era][0]=${encodeURI(era.attributes.name)}`}><a
                        title={`Link to search page filtered by the student age: ${era.attributes.name}`}
                      ><span className='inline'>{era.attributes.name}</span></a></Link> */}
                        <span className='inline'>{era.attributes.name}</span>
                        {musicWork.attributes.eras.data?.length ? (eraIndex < musicWork.attributes.eras.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.level?.data?.attributes?.title && (
              <div id='level' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                <p className='min-w-[175px] text-left'><strong>Difficulty Level</strong></p>
                <div className='flex'>
                  {/* <div><Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][level][0]=${encodeURI(musicWork.attributes.level?.data?.attributes?.title as string)}`}><a
                    className='flex'
                    title={`Link to search page filtered by the level: ${musicWork.attributes.level?.data?.attributes?.title}`}
                  ><p>{musicWork.attributes.level?.data?.attributes?.title}</p></a></Link></div> */}
                  <p>{musicWork.attributes.level?.data?.attributes?.title}</p>
                </div>
              </div>
            )}
            {musicWork.attributes.moods.data?.length ? (
              <div id='mood' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                {musicWork.attributes.moods.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Moods</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Mood</strong></p>)}
                <div className='flex flex-wrap'>
                  {musicWork.attributes.moods.data?.map((mood, moodIndex) => (
                    <p key={mood.attributes.title}>
                      {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][moods][0]=${encodeURI(mood.attributes.title)}`}><a
                      title={`Link to search page filtered by the mood: ${mood.attributes.title}`}
                    ><span className='inline'>{mood.attributes.title}</span></a></Link> */}
                      <span className='inline'>{mood.attributes.title}</span>
                      {musicWork.attributes.moods.data?.length ? (moodIndex < musicWork.attributes.moods.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                    </p>
                  ))}
                </div>
              </div>
            ) : ''}
            {musicWork.attributes.styles.data?.length ? (
              <div id='style' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                {musicWork.attributes.styles.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Styles</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Style</strong></p>)}
                <div className='flex flex-wrap'>
                  {musicWork.attributes.styles.data?.map((style, styleIndex) => (
                    <p key={style.attributes.title}>
                      {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][styles][0]=${encodeURI(style.attributes.title)}`}><a
                      title={`Link to search page filtered by the style: ${style.attributes.title}`}
                    ><span className='inline'>{style.attributes.title}</span></a></Link> */}
                      <span className='inline'>{style.attributes.title}</span>
                      {musicWork.attributes.styles.data?.length ? (styleIndex < musicWork.attributes.styles.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                    </p>
                  ))}
                </div>
              </div>
            ) : ''}
            {musicWork.attributes.themes.data?.length ? (
              <div id='theme' className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                {musicWork.attributes.themes.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Themes</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Theme</strong></p>)}
                <div className='flex flex-wrap'>
                  {musicWork.attributes.themes.data?.map((theme, themeIndex) => (
                    <p key={theme.attributes.title}>
                      {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][themes][0]=${encodeURI(theme.attributes.title)}`}><a
                      title={`Link to search page filtered by the theme: ${theme.attributes.title}`}
                    ><span className='inline'>{theme.attributes.title}</span></a></Link> */}
                      <span className='inline'>{theme.attributes.title}</span>
                      {musicWork.attributes.themes.data?.length ? (themeIndex < musicWork.attributes.themes.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                    </p>
                  ))}
                </div>
              </div>
            ) : ''}
          </section>

          {/* Adsense Ad */}
          {/* {cookieConsent && preferences.marketing && (!accountData?.id || !subscription) && (
            <div className="my-4">
              <AdsenseAd
                location="work_page_above_video"
                style={{ display: 'block', marginBottom: '20px' }}
              />
            </div>
          )} */}
          <div className="my-4">
            <AdsenseAd
              location="work_page_above_video"
              style={{ display: 'block', marginBottom: '20px' }}
            />
          </div>

          {musicWork.attributes.videoEmbedCode && (
            <>
              <ContentDivider title={'Video'} className='mx-auto my-4 md:max-w-[816px]' />
              <div id='video' className='mx-auto mb-14 w-full md:max-w-[816px]'>
                <VideoPlayer videoURL={musicWork.attributes.videoEmbedCode} videoName={musicWork.attributes.title} />
              </div>
            </>
          )}

          {musicWork.attributes.elements.data?.length ? (
            <WorkElements elements={musicWork.attributes.elements.data} published={musicWork.attributes.publishedAt !== null ? true : false} />
          ) : ('')}

          <ContentDivider title={'Details'} className='mx-auto my-4 md:max-w-[816px]' />
          <section id='details' className='mx-auto px-4 md:max-w-[707px]'>
            <div className='flex md:flex-row flex-col justify-left items-left text-left'>
              <p className='min-w-[175px] text-left'><strong>Title</strong></p>
              <div className='flex gap-2 max-w-[175px] overflow-auto'>
                <p className='flex'>{musicWork.attributes.title}</p>
                {/* {isEdit && (<Edit
                  editLabel='Edit Title'
                  size={16}
                  onClick={() => { setShowModalEditTitle2(true); }}
                  aria-label='Edit Title'
                  aria-haspopup='dialog'
                  aria-expanded={showModalEditTitle2}
                  aria-controls='modalEditWorkTitle'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowModalEditTitle2(true);
                    }
                  }}
                  tabIndex={0}
                />)}
                <ModalEdit
                  type='Work'
                  field='Title'
                  currentContent={musicWork.attributes.title}
                  work={musicWork.id.toString()}
                  edits={musicWork.attributes.edits?.data?.filter(edit => edit.attributes.field === 'Title') ?? undefined}
                  onClose={() => { setShowModalEditTitle2(false); }}
                  isOpen={showModalEditTitle2}
                /> */}
              </div>
            </div>
            {musicWork.attributes.alternateTitle && (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  <p className='min-w-[175px] text-left'><strong>Alternate Title</strong></p>
                  <div className='flex gap-2 max-w-[175px] overflow-auto'>
                    <p>{musicWork.attributes.alternateTitle}</p>
                    {/* {isEdit && (<Edit
                      editLabel='Edit Alternate Title'
                      size={16}
                      onClick={() => { setShowModalEditAlternateTitle(true); }}
                      aria-label='Edit Alternate Title'
                      aria-haspopup='dialog'
                      aria-expanded={showModalEditAlternateTitle}
                      aria-controls='modalEditWorkAlternateTitle'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setShowModalEditAlternateTitle(true);
                        }
                      }}
                      tabIndex={0}
                    />)}
                    <ModalEdit
                      type='Work'
                      field='Alternate Title'
                      currentContent={musicWork.attributes.alternateTitle}
                      work={musicWork.id.toString()}
                      edits={musicWork.attributes.edits?.data?.filter(edit => edit.attributes.field === 'Alternate Title') ?? undefined}
                      onClose={() => { setShowModalEditAlternateTitle(false); }}
                      isOpen={showModalEditAlternateTitle}
                    /> */}
                  </div>
                </div>
              </>
            )}
            {musicWork.attributes.composers.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.composers.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Composers</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Composer</strong></p>)}
                  <div className='flex flex-wrap gap-2'>
                    {musicWork.attributes.composers.data?.map((composer, composerIndex) => (
                      <span className='text-base' key={`${composer.attributes.name}-${composerIndex}`}>
                        <Link href={`/${EUrlsPages.COMPOSER}/${composer.attributes.name}?id=${composer.id}`}>
                          <a className='text-base' title={`View ${composer.attributes.name}`}>{composer.attributes.name}</a>
                        </Link>
                        {musicWork.attributes.composers.data && composerIndex < musicWork.attributes.composers.data.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.publishers.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.publishers.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Publishers</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Publisher</strong></p>)}
                  <div className='flex flex-wrap gap-2'>
                    {musicWork.attributes.publishers.data?.map((publisher, publisherIndex) => (
                      <span className='text-base' key={`${publisher.attributes.name}-${publisherIndex}`}>
                        <Link href={`/${EUrlsPages.PUBLISHER}/${publisher.attributes.name}?id=${publisher.id}`}>
                          <a className='text-base' title={`View ${publisher.attributes.name}`}>{publisher.attributes.name}</a>
                        </Link>
                        {musicWork.attributes.publishers.data && publisherIndex < musicWork.attributes.publishers.data.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.collections.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.collections.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Collections</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Collection</strong></p>)}
                  <div className='flex flex-wrap gap-2'>
                    {musicWork.attributes.collections.data?.map((collection, collectionIndex) => (
                      <span className='text-base' key={`${collection.attributes.title}-${collectionIndex}`}>
                        <Link href={`/${EUrlsPages.COLLECTION}/${collection.attributes.title}?id=${collection.id}`}>
                          <a className='text-base' title={`View ${collection.attributes.title}`}>{collection.attributes.title}</a>
                        </Link>
                        {musicWork.attributes.collections.data && collectionIndex < musicWork.attributes.collections.data.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.yearPublished && (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  <p className='min-w-[175px] text-left'><strong>Year</strong></p>
                  <div className='flex'>
                    <p>{musicWork.attributes.yearPublished}</p>
                  </div>
                </div>
              </>
            )}
            {musicWork.attributes.instrumentations.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.instrumentations.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Instrumentations</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Instrumentation</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.instrumentations.data?.map((instrumentation, instrumentationIndex) => (
                      <p key={instrumentation.attributes.name}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][instrumentation][0]=${encodeURI(instrumentation.attributes.name)}`}><a
                        title={`Link to search page filtered by the instrumentation: ${instrumentation.attributes.name}`}
                      ><span className='inline'>{instrumentation.attributes.name}</span></a></Link> */}
                        <span className='inline'>{instrumentation.attributes.name}</span>
                        {musicWork.attributes.instrumentations.data?.length ? (instrumentationIndex < musicWork.attributes.instrumentations.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.keySignatures.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.keySignatures.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Key Signatures</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Key Signature</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.keySignatures.data?.map((keySignature, keySignatureIndex) => (
                      <p key={keySignature.attributes.title}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][key_signatures][0]=${encodeURI(keySignature.attributes.title)}`}><a
                        title={`Link to search page filtered by the key signature: ${keySignature.attributes.title}`}
                      ><span className='inline'>{keySignature.attributes.title}</span></a></Link> */}
                        <span className='inline'>{keySignature.attributes.title}</span>
                        {musicWork.attributes.keySignatures.data?.length ? (keySignatureIndex < musicWork.attributes.keySignatures.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.timeSignatures.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.timeSignatures.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Time Signatures</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Time Signature</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.timeSignatures.data?.map((timeSignature, timeSignatureIndex) => (
                      <p key={timeSignature.attributes.title}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][time_signatures][0]=${encodeURI(timeSignature.attributes.title)}`}><a
                        title={`Link to search page filtered by the time signature: ${timeSignature.attributes.title}`}
                      ><span className='inline'>{timeSignature.attributes.title}</span></a></Link> */}
                        <span className='inline'>{timeSignature.attributes.title}</span>
                        {musicWork.attributes.timeSignatures.data?.length ? (timeSignatureIndex < musicWork.attributes.timeSignatures.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.measureCount ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  <p className='min-w-[175px] text-left'><strong># of Measures</strong></p>
                  <div className='flex gap-2 max-w-[175px] overflow-auto'>
                    <p>{musicWork.attributes.measureCount.toString()}</p>
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.hasTeacherDuet?.toString() && (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  <p className='min-w-[175px] text-left'><strong>Teacher Duet</strong></p>
                  <div className='flex'>
                    <p>{(musicWork.attributes.hasTeacherDuet.toString() == 'true') ? ('Yes') : ('No')}</p>
                  </div>
                </div>
              </>
            )}
            {musicWork.attributes.hasLyrics?.toString() && (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  <p className='min-w-[175px] text-left'><strong>Lyrics</strong></p>
                  <div className='flex gap-2 max-w-[175px] overflow-auto'>
                    <p>{(musicWork.attributes.hasLyrics.toString() == 'true') ? ('Yes') : ('No')}</p>
                  </div>
                </div>
              </>
            )}
            {musicWork.attributes.holidays.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.holidays.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Holidays</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Holiday</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.holidays.data?.map((holiday, holidayIndex) => (
                      <p key={holiday.attributes.name}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][holiday][0]=${encodeURI(holiday.attributes.name)}`}><a
                        title={`Link to search page filtered by the holiday: ${holiday.attributes.name}`}
                      ><span className='inline'>{holiday.attributes.name}</span></a></Link> */}
                        <span className='inline'>{holiday.attributes.name}</span>
                        {musicWork.attributes.holidays.data?.length ? (holidayIndex < musicWork.attributes.holidays.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.studentAges.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.studentAges.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Student Ages</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Student Age</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.studentAges.data?.map((studentAge, studentAgeIndex) => (
                      <p key={studentAge.attributes.title}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][student_ages][0]=${encodeURI(studentAge.attributes.title)}`}><a
                        title={`Link to search page filtered by the student age: ${studentAge.attributes.title}`}
                      ><span className='inline'>{studentAge.attributes.title}</span></a></Link> */}
                        <span className='inline'>{studentAge.attributes.title}</span>
                        {musicWork.attributes.studentAges.data?.length ? (studentAgeIndex < musicWork.attributes.studentAges.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.studentTypes.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.studentTypes.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Student Types</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Student Type</strong></p>)}
                  <div className='flex flex-wrap'>
                    {musicWork.attributes.studentTypes.data?.map((studentType, studentTypeIndex) => (
                      <p key={studentType.attributes.title}>
                        {/* <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][student_types][0]=${encodeURI(studentType.attributes.title)}`}><a
                        title={`Link to search page filtered by the student type: ${studentType.attributes.title}`}
                      ><span className='inline'>{studentType.attributes.title}</span></a></Link> */}
                        {studentType.attributes.title}
                        {musicWork.attributes.studentTypes.data?.length ? (studentTypeIndex < musicWork.attributes.studentTypes.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
            {musicWork.attributes.teachingTips.data?.length ? (
              <>
                <div className='flex md:flex-row flex-col justify-left items-left mt-4 text-left'>
                  {musicWork.attributes.teachingTips.data?.length > 1 ? (<p className='min-w-[175px] text-left'><strong>Teaching Tips</strong></p>) : (<p className='min-w-[175px] text-left'><strong>Teaching Tips</strong></p>)}
                  <div className='flex flex-col gap-2 max-w-[175px] overflow-auto text-left'>
                    {musicWork.attributes.teachingTips.data?.map((teachingTip, teachingTipIndex) => (
                      <p key={teachingTip.attributes.title}>{teachingTip.attributes.title}{musicWork.attributes.teachingTips.data?.length ? (teachingTipIndex < musicWork.attributes.teachingTips.data?.length - 1 ? (<span className='pr-1.5'>, </span>) : null) : ''}</p>
                    ))}
                  </div>
                </div>
              </>
            ) : ''}
          </section>
        </article>
      )}
    </>
  );
};

export default ItemWork;
