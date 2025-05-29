import { GetServerSideProps, NextPage } from 'next';
import cn from 'classnames';
import { pageApiGet } from '@src/api/apis';
import parse, { Element } from 'html-react-parser';
import { IStrapiPages, IStrapiPage } from '@src/types';
import Page from '@src/components/Page';
import Link from 'next/link';
import ImageNext from '@src/components/ImageNext';
import { IconSearchWhite } from '@src/common/assets/icons';
import { EUrlsPages } from '@src/constants';
import GetPiece from '@src/components/GetPiece';
import GetPieceTable from '@src/components/GetPieceTable';
import GetComposer from '@src/components/GetComposer';
import GetCollection from '@src/components/GetCollection';
import GetPublisher from '@src/components/GetPublisher';
import GetElement from '@src/components/GetElement';
import GetYouTubeVideo from '@src/components/GetYouTubeVideo';

interface IPageDetailsPageProps {
  itemPages: IStrapiPages | null;
  itemPage: IStrapiPage | null;
  prevUrl: string | undefined;
};

const PageDetailsPage: NextPage<IPageDetailsPageProps> = ({
  itemPages,
  itemPage,
  prevUrl
}) => {
  if (itemPages && itemPages.data && itemPages.data.length > 0) {
    itemPage = itemPages.data[0];
  } else {
    itemPage = null;
  };

  return (
    <>
      {itemPage && itemPage.attributes.name ? (
        <Page
          showBackBar={itemPage.attributes.showBackBar}
          showBackBarShare={itemPage.attributes.showBackBarShare}
          showBackBarFeedback={itemPage.attributes.showBackBarFeedback}
          url={encodeURIComponent(itemPage.attributes.slug)}
          prevUrl={prevUrl}
          title={`${itemPage.attributes.name} - Piano Music Database`}
          description={itemPage.attributes.descriptionSEO ? itemPage.attributes.descriptionSEO : 'Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.'}
          image={itemPage.attributes.image.data?.attributes?.url ? itemPage.attributes.image.data.attributes.url : ''}
          className={cn(
            itemPage.attributes.widthFull && '!max-w-full !mx-0 !px-0'
          )}
          classNameMain={cn(
            itemPage.attributes.hideName && '!mt-0 lg:!mt-0',
            (itemPage.attributes.widthFull && itemPage.attributes.showBackBar) && '!mt-[35px] lg:!mt-[35px] !max-w-full !mx-0 !px-0',
            (itemPage.attributes.widthFull && !itemPage.attributes.showBackBar) && '!mt-0 lg:!mt-0 !max-w-full !mx-0 !px-0'
          )}
        >
          <>
            {(itemPage.attributes.name && !itemPage.attributes.hideName) ? (<h1 className='mb-10 w-full'>{itemPage.attributes.name}</h1>) : ''}
            <div className='w-full'>
              {itemPage.attributes.content ? (
                parse(itemPage.attributes.content,
                  {
                    replace(domNode) {
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetPiece'
                      ) {
                        return <GetPiece workId={domNode.attribs.id ? domNode.attribs.id : '0'} />;
                      };
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetPieceTable'
                      ) {
                        return <GetPieceTable workIds={domNode.attribs.id ? domNode.attribs.id : '0'} />;
                      };
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetComposer'
                      ) {
                        return <GetComposer composerId={domNode.attribs.id ? domNode.attribs.id : '0'} />;
                      };
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetCollection'
                      ) {
                        return <GetCollection collectionId={domNode.attribs.id ? domNode.attribs.id : '0'} />;
                      };
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetPublisher'
                      ) {
                        return <GetPublisher publisherId={domNode.attribs.id ? domNode.attribs.id : '0'} />;
                      };
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetElement'
                      ) {
                        return <GetElement elementId={domNode.attribs.id ? domNode.attribs.id : '0'} />;
                      };
                      if (
                        domNode instanceof Element &&
                        domNode.attribs.class === 'GetYouTubeVideo'
                      ) {
                        return <div id={domNode.attribs.id ? ('video-' + domNode.attribs.id) : 'video-dQw4w9WgXcQ'} className='mx-auto mb-14 w-full md:max-w-[816px]'><GetYouTubeVideo videoId={domNode.attribs.id ? domNode.attribs.id : 'dQw4w9WgXcQ'} /></div>;
                      };
                    },
                  }
                )
              ) : (
                ''
              )}
            </div>
            {itemPage.attributes.showLastUpdated ? (<p className={cn(
              'w-full mt-14 text-pmdGray italic',
              itemPage.attributes.widthFull && 'max-w-[1000px] px-4'
            )}>Last Updated on {itemPage.attributes.updatedAt.replace('T', ' at ').replace('Z', ' GMT')}</p>) : ''}
          </>
        </Page>
      ) :
        (
          <Page
            showBackBar={true}
            showBackBarShare={false}
            showBackBarFeedback={true}
            url='error'
            prevUrl={prevUrl}
            title='Page Not Found - Piano Music Database'
            description='Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.'
            image=''
          >
            <>
              <h1>Error 404: Page Not Found</h1>
              <h2 className='mt-10'><em>This page was not able to be located.</em></h2>
              <p className='mt-6 max-w-[810px]'>The page you are looking for has moved, is no longer available, has been archived, or was not valid.</p>
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
    var urlReq = context.req!.url;
    var url = '';
    if (urlReq) {
      if (urlReq.includes('_next')) {
        const urlREGEXDev = urlReq.match(/\/([^/.]*)\.json/);
        const urlREGEXDevItem = urlREGEXDev?.[1];
        url = `${urlREGEXDevItem}`;
      } else {
        const urlREGEX = urlReq.match(/^\/([^/\?]+)/);
        if (urlREGEX) {
          const urlREGEXLocalItem = urlREGEX[1];
          url = urlREGEXLocalItem;
        } else {
          const urlREGEXWithoutSlash = urlReq.match(/^[^/\?]+/);
          const urlREGEXRemoteItem = urlREGEXWithoutSlash?.[0];
          url = `${urlREGEXRemoteItem}`;
        };
      };
    };
    const response = await pageApiGet.get(
      (url as string) || ''
    );
    return {
      props: {
        itemPages: response.data,
        prevUrl: context.req.headers.referer ?? ''
      }
    };
  } catch (e) {
    return {
      props: {
        itemPages: null,
        prevUrl: context.req.headers.referer ?? ''
      }
    };
  };
};

export default PageDetailsPage;
