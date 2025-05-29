import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';
import { EUrlsPages } from '@src/constants';
import { apiPiece } from '@src/api/apis';
import { IStrapiPiece, IStrapiComposer } from '@src/types';
import Page from '@src/components/Page';
import ImageNext from '@src/components/ImageNext';
import { IconSearchWhite } from '@src/common/assets/icons';
import { handleTitleWithJustNumber } from '@src/api/helpers';
import ItemWork from '@src/components/ItemWork';

interface IWorkDetailsPageProps {
  musicWork: IStrapiPiece;
  prevUrl: string | undefined;
};

const WorkDetailsPage: NextPage<IWorkDetailsPageProps> = ({ musicWork, prevUrl }) => {
  const router = useRouter();
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

  useEffect(
    () => {
      // Fix route for A Little Study by Ben Crosland (changed id from 381 to 2751)
      if (router.query.id && router.query.id === '381') {
        router.push(`/${EUrlsPages.WORK}/A%20Little%20Study-Ben%20Crosland?id=2751`, undefined, { shallow: false });
      }
    }, [router]
  );

  return (
    <>
      {musicWork && musicWork.attributes.title ? (
        <Page
          showBackBar={true}
          showBackBarShare={true}
          showBackBarFeedback={true}
          url={workURL}
          prevUrl={prevUrl}
          title={`${workTitleDisplay} - Piano Music Database`}
          description={`Explore ${workTitleDisplay} on Piano Music Database. Buy the sheet music, watch a performance, and learn about its elements, level, mood, and more.`}
          image={musicWork.attributes.imageSEO?.data ? musicWork.attributes.imageSEO.data?.attributes.url : ''}
          className={cn({ '!max-w-full !mx-0 !px-0': musicWork.attributes.promoText })}
          classNameMain={cn({ '!mt-[35px] lg:!mt-[35px] !max-w-full !mx-0 !px-0': musicWork.attributes.promoText })}
        >
          <ItemWork musicWork={musicWork} />
        </Page>
      ) :
        (
          <Page
            showBackBar={true}
            showBackBarShare={false}
            showBackBarFeedback={true}
            url={`${EUrlsPages.WORK}/not-found`}
            prevUrl={prevUrl}
            title='Piece Not Found - Piano Music Database'
            description='Explore piano music on Piano Music Database. Buy the sheet music, find the works that make up the collection, and discover other details.'
            image=''
          >
            <>
              <h1>Error 404: Piece Not Found</h1>
              <h2 className='mt-10'><em>This piece was not able to be located.</em></h2>
              <p className='mt-6 max-w-[810px]'>The piece you are looking for has moved, is no longer available, has been archived, or was not valid.</p>
              <p className='mt-2 max-w-[808px]'>If you were looking for a specific piece, make sure the URL is formatted like this: <br /><strong>/{EUrlsPages.WORK}/TITLEHERE?id=IDHERE</strong> <br />The ID is a number we use to connect you to the correct piece. Some pieces may have the same title, so we can not know which piece you are looking for without an ID in the URL.</p>
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
    const response = await apiPiece.get(
      (context?.query?.id as string) || '0'
    );
    return {
      props: {
        musicWork: response.data.data,
        prevUrl: context.req.headers.referer ?? ''
      }
    };
  } catch (e) {
    return {
      props: {
        musicWork: null,
        prevUrl: context.req.headers.referer ?? ''
      }
    };
  };
};

export default WorkDetailsPage;
