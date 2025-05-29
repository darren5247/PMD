import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { EUrlsPages } from '@src/constants';
import { handleCleanContent } from '@src/api/helpers';
import { apiComposer } from '@src/api/apis';
import api from '@src/api/config';
import { AppContext } from '@src/state';
import { IStrapiComposer, IStrapiPiece, IStrapiCollection } from '@src/types';
import Page from '@src/components/Page';
import ImageNext from '@src/components/ImageNext';
import ImagePicture from '@src/components/ImagePicture';
import ContentDivider from '@src/components/ContentDivider';
import CardCollection from '@src/components/CardCollection';
import Works from '@src/components/Works';
import { IconSearchRed, IconSearchWhite, IconFeedbackWhite, IconListenOnSpotify, IconListenOnAppleMusic, IconSocialInstagram, IconSocialFacebook, IconSocialX, IconSocialLinkedIn, IconSocialYouTube } from '@src/common/assets/icons';
import { ModalFeedback } from '@src/components/Modals';
import { handleTitleWithJustNumber } from '@src/api/helpers';

import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false
  }
});

interface IComposerDetailsPageProps {
  musicComposer: IStrapiComposer;
  prevUrl: string | undefined;
};

const ComposerDetailsPage: NextPage<IComposerDetailsPageProps> = ({ musicComposer, prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);

  const checkNumberName = (dirtyName: string) => {
    let parsedName = parseInt(dirtyName);
    if (isNaN(parsedName)) {
      return dirtyName;
    } else {
      let words = toWords.convert(parsedName);
      return encodeURIComponent(words);
    };
  };

  let composerURL: string | undefined;
  if (musicComposer && musicComposer.attributes.name) {
    composerURL = EUrlsPages.COMPOSER + '/' + encodeURIComponent(checkNumberName(musicComposer.attributes.name)) + '?id=' + musicComposer.id;
  } else { composerURL = '' };

  let composerID: number | undefined;
  if (musicComposer && musicComposer.id) {
    composerID = musicComposer.id;
  } else { composerID = undefined };

  const [collections, setCollections] = useState<IStrapiCollection[]>([]);
  const [collectionLength, setCollectionLength] = useState<number>();
  const [currentPageCollections, setCurrentPageCollections] = useState(Number(query.pageCollections) && Number(query.pageCollections) > 0 ? Number(query.pageCollections) : 1);
  const [totalPagesCollections, setTotalPagesCollections] = useState(1);
  const [pageSizeCollections, setPageSizeCollections] = useState(8);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  const [pieces, setPieces] = useState<IStrapiPiece[]>([]);
  const [pieceLength, setPieceLength] = useState<number>();
  const [currentPagePieces, setCurrentPagePieces] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
  const [totalPagesPieces, setTotalPagesPieces] = useState(1);
  const [pageSizePieces, setPageSizePieces] = useState(10);
  const [isLoadingPieces, setIsLoadingPieces] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(
    () => {
      // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
      const { page, pageCollections, pagecollections, pagePieces, pagepieces } = query;

      // Page
      if (page) setCurrentPagePieces(Number(page as string));
      if (pageCollections) {
        setCurrentPageCollections(Number(pageCollections as string));
      } else {
        if (pagecollections) {
          setCurrentPageCollections(Number(pagecollections as string));
        }
      }
      if (pagePieces) {
        setCurrentPagePieces(Number(pagePieces as string));
      } else {
        if (pagepieces) {
          setCurrentPagePieces(Number(pagepieces as string));
        }
      }

      if (composerID) {
        const getCollections = async () => {
          try {
            setIsLoadingCollections(true);
            const fetchedData = [];
            const { data } = await api.get(
              `collections?pagination[page]=${currentPageCollections}&pagination[pageSize]=${pageSizeCollections}&sort[0]=title:asc&populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[collections][fields][2]=title&populate[works][fields][1]=title&fields[0]=title&fields[1]=published_date&fields[2]=composed_date&populate[image][fields][3]=height&populate[image][fields][4]=width&populate[image][fields][5]=url&populate[image][fields][6]=alternativeText&filters[publishedAt][$null]=false&publicationState=live&filters[composers][id][$in]=${composerID}`
            );
            fetchedData.push(...data?.data);

            // Redirect to last page if current page is greater than total pages
            if (data?.meta?.pagination?.pageCount < currentPageCollections && data?.meta?.pagination?.pageCount > 0) {
              setCurrentPageCollections(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
              router.push({
                pathname: encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)),
                query: pagePieces ? { id: musicComposer.id, pagePieces: pagePieces, pageCollections: data.meta.pagination.pageCount } : { id: musicComposer.id, pageCollections: data.meta.pagination.pageCount }
              });
            } else {
              setCollections(fetchedData);
              setCollectionLength(data?.meta.pagination.total);
              setTotalPagesCollections(data?.meta?.pagination?.pageCount || 1);
            }
          } catch (error: any) {
            if (error?.response?.data) {
              console.error('Error Getting Collections for Composer-' + composerID + ': ' + error?.response?.data.error?.message);
            };
          } finally {
            setIsLoadingCollections(false);
          };
        };

        const getPieces = async () => {
          try {
            setIsLoadingPieces(true);
            const fetchedData = [];
            const { data } = await api.get(
              `works?pagination[page]=${currentPagePieces}&pagination[pageSize]=${pageSizePieces}&sort[0]=title:asc&populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[works][fields][2]=title&populate[works][populate][composers][fields][3]=name&populate[level][fields][4]=title&fields[5]=publishedAt&populate[scoreExcerpt][fields][6]=height&populate[scoreExcerpt][fields][7]=width&populate[scoreExcerpt][fields][8]=url&populate[image][fields][9]=height&populate[image][fields][10]=width&populate[image][fields][11]=url&populate[image][fields][12]=alternativeText&populate[eras][fields][13]=name&filters[publishedAt][$null]=false&publicationState=live&filters[composers][id][$in]=${composerID}`
            );
            fetchedData.push(...data?.data);

            // Redirect to last page if current page is greater than total pages
            if (data?.meta?.pagination?.pageCount < currentPagePieces && data?.meta?.pagination?.pageCount > 0) {
              setCurrentPagePieces(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
              router.push({
                pathname: encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)),
                query: pagePieces ? { id: musicComposer.id, pageCollections: pagePieces, pagePieces: data.meta.pagination.pageCount } : { id: musicComposer.id, pagePieces: data.meta.pagination.pageCount }
              });
            } else {
              setPieces(fetchedData);
              setPieceLength(data?.meta.pagination.total);
              setTotalPagesPieces(data?.meta?.pagination?.pageCount || 1);
            }
          } catch (error: any) {
            if (error?.response?.data) {
              console.error('Error Getting Pieces for Composer-' + composerID + ': ' + error?.response?.data.error?.message);
            };
          } finally {
            setIsLoadingPieces(false);
          };
        };

        getCollections();
        getPieces();
      };
    }, [composerID, dispatch, router, currentPageCollections, pageSizeCollections, currentPagePieces, pageSizePieces, query, setCollections, setIsLoadingCollections, setPieces, setIsLoadingPieces, musicComposer?.id, musicComposer?.attributes?.name]
  );

  const cleanWebsite = (websiteLink: string) => {
    return websiteLink.replace(/(^\w+:|^)\/\//, '');
  };

  return (
    <>
      {musicComposer && musicComposer.attributes.name ? (
        <Page
          showBackBar={true}
          showBackBarShare={true}
          showBackBarFeedback={true}
          url={composerURL}
          prevUrl={prevUrl}
          title={musicComposer.attributes.name ? `${musicComposer.attributes.name} - Piano Music Database` : 'Composer - Piano Music Database'}
          description={musicComposer.attributes.excerpt ? musicComposer.attributes.excerpt : `Explore ${musicComposer.attributes.name} on Piano Music Database.`}
          image={musicComposer.attributes.imageSEO?.data ? musicComposer.attributes.imageSEO.data?.attributes.url : ''}
          className='!max-w-full'
          classNameMain='!max-w-full'
        >
          <article className='flex flex-col justify-center items-center gap-y-3 text-center'>
            {!musicComposer.attributes.publishedAt && (
              <section id='review' className='flex justify-center'>
                <div className='bg-orange-500 shadow-workNav mx-4 mb-12 py-4 rounded-lg'>
                  <h2 className='px-4 text-white text-2xl text-center tracking-thigh'><strong>UNDER REVIEW</strong></h2>
                  <hr className='mt-4 mb-3' />
                  <p className='px-4 text-white text-center tracking-thigh'><strong>This composer is currently <em>under review</em> by staff.</strong></p>
                  <p className='mt-4 px-4 text-white text-center tracking-thigh'><strong>This page is publicly viewable while under review, but the composer will not appear in PMD search results.</strong></p>
                  <p className='mt-4 px-4 text-white text-center tracking-thigh'><strong>Also, some data may not be viewable on this page while under review.</strong></p>
                  <p className='px-4 text-white text-center tracking-thigh'><strong>This includes related works and collections which are under review.</strong></p>
                  <hr className='mt-4 mb-3' />
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
                      type={'DraftComposer - ' + composerURL}
                      url={composerURL}
                      onClose={() => { setShowModalFeedback(false); }}
                      isOpen={showModalFeedback}
                    />
                  </div>
                </div>
              </section>
            )}
            <div className='flex flex-col justify-center items-center gap-y-3 text-center'>
              <div className='flex flex-col mb-4 max-w-[1000px] overflow-auto text-center'>
                <div className='flex min-[935px]:flex-row flex-col justify-center items-top max-[935px]:items-center gap-x-6 gap-y-8'>
                  {musicComposer.attributes.image.data ? (
                    <div className='min-[935px]:mt-5 min-w-auto sm:min-w-[300px] max-w-[240px] sm:max-w-[300px]'>
                      <ImagePicture
                        alt={musicComposer.attributes.image.data?.attributes.alternativeText ? musicComposer.attributes.image.data?.attributes.alternativeText : musicComposer.attributes.name}
                        src={musicComposer.attributes.image.data?.attributes.url ? musicComposer.attributes.image.data?.attributes.url : ''}
                        height={musicComposer.attributes.image.data?.attributes.height ? musicComposer.attributes.image.data?.attributes.height : 0}
                        width={musicComposer.attributes.image.data?.attributes.width ? musicComposer.attributes.image.data?.attributes.width : 0}
                      />
                    </div>
                  ) : ''}
                  <div
                    className={cn(
                      'flex flex-col justify-center gap-2 max-[420px]:max-w-64 max-[615px]:max-w-96 max-w-[575px] overflow-y-auto max-[935px]:justify-center text-center min-[935px]:text-left',
                      {
                        'pb-2 max-w-[700px] text-center justify-center items-center': !musicComposer.attributes.image?.data
                      }
                    )}
                  >
                    <h1
                      className={cn(
                        'flex gap-2 justify-center items-center min-[935px]:w-fit max-w-auto py-1.5 max-[935px]:justify-center min-[935px]:text-left whitespace-normal',
                        {
                          'pb-2': !musicComposer.attributes.image.data
                        }
                      )}
                    >
                      {musicComposer.attributes.name}
                    </h1>
                    {(musicComposer.attributes.ethnicity && musicComposer.attributes.nationality) ? (
                      <p>{musicComposer.attributes.ethnicity} {musicComposer.attributes.nationality}</p>
                    ) : (
                      <>
                        {musicComposer.attributes.ethnicity ? (<p>{musicComposer.attributes.ethnicity}</p>) : ''}
                        {musicComposer.attributes.nationality ? (<p>{musicComposer.attributes.nationality}</p>) : ''}
                      </>
                    )}
                    {(musicComposer.attributes.gender && musicComposer.attributes.pronouns) ? (
                      <p>{musicComposer.attributes.gender} {musicComposer.attributes.pronouns}</p>
                    ) : (
                      <>
                        {musicComposer.attributes.gender ? (<p>{musicComposer.attributes.gender}</p>) : ''}
                        {musicComposer.attributes.pronouns ? (<p>{musicComposer.attributes.pronouns}</p>) : ''}
                      </>
                    )}
                    {musicComposer.attributes.birth_year && musicComposer.attributes.death_year ? (<p>Born {musicComposer.attributes.birth_year}, Died {musicComposer.attributes.death_year}</p>) : ''}
                    {musicComposer.attributes.birth_year && !(musicComposer.attributes.death_year) ? (`Born ${musicComposer.attributes.birth_year}`) : ''}
                    {musicComposer.attributes.death_year && !(musicComposer.attributes.birth_year) ? (`Died ${musicComposer.attributes.death_year}`) : ''}
                    {musicComposer.attributes.excerpt ? (<div
                      className={cn(
                        'w-full md:max-w-[816px] mx-auto max-md:justify-center text-justify flex mt-2',
                        {
                          'text-center justify-center items-center': !musicComposer.attributes.image.data
                        }
                      )}
                      dangerouslySetInnerHTML={
                        {
                          __html: handleCleanContent(musicComposer.attributes.excerpt)
                        }
                      }
                    />) : ''}
                  </div>
                </div>
              </div>
            </div>
            {(musicComposer.attributes.urlSpotify || musicComposer.attributes.urlAppleMusic) && (
              <div id='listen' className={cn(
                'mb-4',
                {
                  '!mb-1': musicComposer.attributes.urlWebsite
                }
              )}>
                <div className='flex flex-wrap justify-center items-center gap-2 max-md:mt-2 text-center'>
                  {(musicComposer.attributes.urlSpotify) && (
                    <div className='flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-1 rounded-lg text-center'>
                      <Link href={musicComposer.attributes.urlSpotify}>
                        <a className='group flex justify-center items-center text-center' title={`Listen to ${musicComposer.attributes.name} on Spotify`} target='_blank' rel='noopener noreferrer'>
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
                  {(musicComposer.attributes.urlAppleMusic) && (
                    <div className='flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-1 rounded-lg text-center'>
                      <Link href={musicComposer.attributes.urlAppleMusic}>
                        <a className='group flex justify-center items-center text-center' title={`Listen to ${musicComposer.attributes.name} on Apple Music`} target='_blank' rel='noopener noreferrer'>
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
            {(musicComposer.attributes.urlWebsite) && (
              <div id='website' className={cn(
                'mb-4',
                {
                  '!mb-1': (musicComposer.attributes.urlSocialInstagram || musicComposer.attributes.urlSocialFacebook || musicComposer.attributes.urlSocialX || musicComposer.attributes.urlSocialLinkedIn)
                }
              )}>
                <div className='flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-3 rounded-lg text-center'>
                  <Link href={musicComposer.attributes.urlWebsite}>
                    <a className='flex justify-center items-center text-center' title={musicComposer.attributes.urlWebsite} target='_blank' rel='noopener noreferrer'>
                      {cleanWebsite(musicComposer.attributes.urlWebsite)}
                    </a>
                  </Link>
                </div>
              </div>
            )}
            {(musicComposer.attributes.urlSocialInstagram || musicComposer.attributes.urlSocialFacebook || musicComposer.attributes.urlSocialX || musicComposer.attributes.urlSocialLinkedIn) && (
              <div id='social' className='mb-4'>
                <div className='flex flex-wrap justify-center items-center gap-2 max-md:mt-2 text-center'>
                  {(musicComposer.attributes.urlSocialInstagram) && (
                    <Link href={musicComposer.attributes.urlSocialInstagram}>
                      <a className='group flex justify-center items-center text-center' title={`${musicComposer.attributes.name} on Instagram`} target='_blank' rel='noopener noreferrer'>
                        <ImageNext
                          alt='Instagram'
                          src={IconSocialInstagram}
                          height={40}
                          width={40}
                          className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                        />
                      </a>
                    </Link>
                  )}
                  {(musicComposer.attributes.urlSocialFacebook) && (
                    <Link href={musicComposer.attributes.urlSocialFacebook}>
                      <a className='group flex justify-center items-center text-center' title={`${musicComposer.attributes.name} on Facebook`} target='_blank' rel='noopener noreferrer'>
                        <ImageNext
                          alt='Facebook'
                          src={IconSocialFacebook}
                          height={40}
                          width={40}
                          className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                        />
                      </a>
                    </Link>
                  )}
                  {(musicComposer.attributes.urlSocialX) && (
                    <Link href={musicComposer.attributes.urlSocialX}>
                      <a className='group flex justify-center items-center text-center' title={`${musicComposer.attributes.name} on X/Twitter`} target='_blank' rel='noopener noreferrer'>
                        <ImageNext
                          alt='X/Twitter'
                          src={IconSocialX}
                          height={40}
                          width={40}
                          className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                        />
                      </a>
                    </Link>
                  )}
                  {(musicComposer.attributes.urlSocialLinkedIn) && (
                    <Link href={musicComposer.attributes.urlSocialLinkedIn}>
                      <a className='group flex justify-center items-center text-center' title={`${musicComposer.attributes.name} on LinkedIn`} target='_blank' rel='noopener noreferrer'>
                        <ImageNext
                          alt='LinkedIn'
                          src={IconSocialLinkedIn}
                          height={40}
                          width={40}
                          className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                        />
                      </a>
                    </Link>
                  )}
                  {(musicComposer.attributes.urlSocialYouTube) && (
                    <Link href={musicComposer.attributes.urlSocialYouTube}>
                      <a className='group flex justify-center items-center text-center' title={`${musicComposer.attributes.name} on YouTube`} target='_blank' rel='noopener noreferrer'>
                        <ImageNext
                          alt='YouTube'
                          src={IconSocialYouTube}
                          height={40}
                          width={40}
                          className='group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out'
                        />
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            )}
            {isLoadingCollections ? (
              <p id='Collections' className='mt-10'>Loading Collections...</p>
            ) : (
              ((collections.length > 0 && collectionLength) ? (
                <div className='flex flex-col justify-center items-center gap-1 mt-10 text-center align-middle'>
                  <ContentDivider title={collections.length > 2 ? 'Collections' : 'Collection'} className='mx-auto mb-1 md:max-w-[816px]' />
                  <div className='flex flex-col justify-center items-center gap-3 my-4 max-w-[1200px] text-center align-middle'>
                    <div className='flex flex-wrap justify-center gap-3 text-center align-middle'>
                      {collections.map((collection) => (
                        <CardCollection
                          key={`CollectionItem-${collection.id}`}
                          title={collection.attributes.title}
                          collection={collection}
                          id={collection.id}
                        />
                      ))}
                    </div>
                    {collections.length > 9 && (
                      <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pagePieces ? ('?id=' + musicComposer.id + '&pageCollections=1' + '&pagePieces=' + query.pagePieces) : ('?id=' + musicComposer.id + '&pageCollections=1'))
                            + '#Collections'
                          )}
                        >
                          <a
                            title='First Page'
                            className={cn(
                              currentPageCollections === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            First
                          </a>
                        </Link>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pagePieces ? ('?id=' + musicComposer.id + '&pageCollections=' + (currentPageCollections - 1) + '&pagePieces=' + query.pagePieces) : ('?id=' + musicComposer.id + '&pageCollections=' + (currentPageCollections - 1)))
                            + '#Collections'
                          )}
                        >
                          <a
                            title='Previous Page'
                            className={cn(
                              currentPageCollections === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            Prev
                          </a>
                        </Link>
                        <span className='mx-2'>{currentPageCollections} of {totalPagesCollections}</span>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pagePieces ? ('?id=' + musicComposer.id + '&pageCollections=' + (currentPageCollections + 1) + '&pagePieces=' + query.pagePieces) : ('?id=' + musicComposer.id + '&pageCollections=' + (currentPageCollections + 1)))
                            + '#Collections'
                          )}
                        >
                          <a
                            title='Next Page'
                            className={cn(
                              currentPageCollections === totalPagesCollections ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            Next
                          </a>
                        </Link>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pagePieces ? ('?id=' + musicComposer.id + '&pageCollections=' + totalPagesCollections + '&pagePieces=' + query.pagePieces) : ('?id=' + musicComposer.id + '&pageCollections=' + totalPagesCollections))
                            + '#Collections'
                          )}
                        >
                          <a
                            title='Last Page'
                            className={cn(
                              currentPageCollections === totalPagesCollections ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            Last
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : '')
            )}
            {isLoadingPieces ? (
              <p id='Pieces' className='mt-10'>Loading Pieces...</p>
            ) : (
              ((pieces.length > 0 && pieceLength) ? (
                <div className='flex flex-col justify-center items-center gap-1 mt-10 text-center align-middle'>
                  <ContentDivider title={pieces.length > 2 ? 'Pieces' : 'Piece'} className='mx-auto mb-1 md:max-w-[816px]' />
                  {/* <div className='flex text-xs'>
                    <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][composers][0]=${encodeURI(musicComposer.attributes.name)}`}><a className='flex flex-row items-center gap-2' title={`Search for pieces by ${musicComposer.attributes.name}`}><ImageNext src={IconSearchRed} alt='' height={12} width={12} className='z-0' /><strong>See All in a New Search</strong></a></Link>
                    </div> */}
                  <div className='flex flex-row flex-wrap justify-center items-center gap-3 mt-2 mb-4 w-full max-w-[1200px] md:max-w-[816px] text-center align-middle'>
                    <Works works={pieces.slice(0, 10).map(piece => ({
                      id: piece.id,
                      title: piece.attributes.title,
                      composers: piece.attributes.composers?.data?.map(composer => composer.attributes.name) || null,
                      level: piece.attributes.level?.data?.attributes.title,
                      eras: piece.attributes.eras?.data?.map(era => era.attributes.name) || null
                    }))} />
                    {pieces.length > 9 && (
                      <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pageCollections ? ('?id=' + musicComposer.id + '&pagePieces=1' + '&pageCollections=' + query.pageCollections) : ('?id=' + musicComposer.id + '&pagePieces=1'))
                            + '#Pieces'
                          )}
                        >
                          <a
                            title='First Page'
                            className={cn(
                              currentPagePieces === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            First
                          </a>
                        </Link>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pageCollections ? ('?id=' + musicComposer.id + '&pagePieces=' + (currentPagePieces - 1) + '&pageCollections=' + query.pageCollections) : ('?id=' + musicComposer.id + '&pagePieces=' + (currentPagePieces - 1)))
                            + '#Pieces'
                          )}
                        >
                          <a
                            title='Previous Page'
                            className={cn(
                              currentPagePieces === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            Prev
                          </a>
                        </Link>
                        <span className='mx-2'>{currentPagePieces} of {totalPagesPieces}</span>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pageCollections ? ('?id=' + musicComposer.id + '&pagePieces=' + (currentPagePieces + 1) + '&pageCollections=' + query.pageCollections) : ('?id=' + musicComposer.id + '&pagePieces=' + (currentPagePieces + 1)))
                            + '#Pieces'
                          )}
                        >
                          <a
                            title='Next Page'
                            className={cn(
                              currentPagePieces === totalPagesPieces ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            Next
                          </a>
                        </Link>
                        <Link
                          href={(
                            encodeURIComponent(handleTitleWithJustNumber(musicComposer.attributes.name)) +
                            (query.pageCollections ? ('?id=' + musicComposer.id + '&pagePieces=' + totalPagesPieces + '&pageCollections=' + query.pageCollections) : ('?id=' + musicComposer.id + '&pagePieces=' + totalPagesPieces))
                            + '#Pieces'
                          )}
                        >
                          <a
                            title='Last Page'
                            className={cn(
                              currentPagePieces === totalPagesPieces ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                              'bg-pmdGrayBright px-2 py-1 rounded-md',
                            )}
                          >
                            Last
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : '')
            )}
          </article>
        </Page>
      ) :
        (
          <Page
            showBackBar={true}
            showBackBarShare={false}
            showBackBarFeedback={true}
            url={`${EUrlsPages.COMPOSER}/not-found`}
            prevUrl={prevUrl}
            title='Composer Not Found - Piano Music Database'
            description='Explore composers on Piano Music Database.'
            image=''
          >
            <>
              <h1>Error 404: Composer Not Found</h1>
              <h2 className='mt-10'><em>This composer was not able to be located.</em></h2>
              <p className='mt-6 max-w-[846px]'>The composer you are looking for has moved, is no longer available, has been archived, or was not valid.</p>
              <p className='mt-2 max-w-[844px]'>If you were looking for a specific composer, make sure the URL is formatted like this: <br /><strong>/{EUrlsPages.COMPOSER}/NAMEHERE?id=IDHERE</strong> <br />The ID is a number we use to connect you to the correct composer. Some composers may have the same name, so we can not know which composer you are looking for without an ID in the URL.</p>
              <p className='mt-6'>Try searching to find what you are looking for.</p>
              <div className='flex flex-col justify-center items-center gap-y-4 my-8 w-full'>
                <Link href={`/${EUrlsPages.SEARCH}`}>
                  <a
                    aria-label='Start a Search'
                    title='Start a Search'
                    className='flex gap-2 md:!px-20 !pt-[30px] !pb-8 text-2xl button'
                  ><ImageNext src={IconSearchWhite} alt='' height={20} width={21} className='max-[314px]:hidden z-0' /> Start a Search</a></Link>
              </div>
            </>
          </Page>
        )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await apiComposer.get(
      (context?.query?.id as string) || '0'
    );
    return {
      props: {
        musicComposer: response.data.data,
        prevUrl: context.req.headers.referer ?? ''
      }
    };
  } catch (e) {
    return {
      props: {
        musicComposer: null,
        prevUrl: context.req.headers.referer ?? ''
      }
    };
  }
};

export default ComposerDetailsPage;
