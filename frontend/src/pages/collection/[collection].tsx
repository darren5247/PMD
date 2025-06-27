import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import cn from "classnames";
import { EUrlsPages } from "@src/constants";
import { handleCleanContent } from "@src/api/helpers";
import { apiCollection } from "@src/api/apis";
import { AppContext } from "@src/state";
import Page from "@src/components/Page";
import Link from "next/link";
import ImageNext from "@src/components/ImageNext";
import ImagePicture from "@src/components/ImagePicture";
import ContentDivider from "@src/components/ContentDivider";
import VideoPlayer from "@src/components/VideoPlayer";
import BuyLink from "@src/components/BuyLink";
import Works from "@src/components/Works";
import {
  IconSearchWhite,
  IconFeedbackWhite,
  IconListenOnSpotify,
  IconListenOnAppleMusic,
} from "@src/common/assets/icons";
import { ModalFeedback } from "@src/components/Modals";
import { handleTitleWithJustNumber } from "@src/api/helpers";
import api from "@src/api/config";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiCollection,
  IStrapiPiece,
} from "@src/types";

interface ICollectionDetailsPageProps {
  musicCollection: IStrapiCollection;
  prevUrl: string | undefined;
}

const CollectionDetailsPage: NextPage<ICollectionDetailsPageProps> = ({
  musicCollection,
  prevUrl,
}) => {
  const router = useRouter();
  const { query } = router;
  const [works, setWorks] = useState<IStrapiPiece[]>([]);
  const [currentPagePieces, setCurrentPage] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [totalPagesPieces, setTotalPages] = useState(1);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const [isLoadingWorks, setIsLoadingWorks] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { page } = query;

    // Page
    if (page) setCurrentPage(Number(page as string));

    const getWorks = async () => {
      try {
        setIsLoadingWorks(true);
        const fetchedData = [];
        const { data } = await api.get(
          `works?pagination[page]=${currentPagePieces}&pagination[pageSize]=10&sort[0]=title:asc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title&filters[publishedAt][$null]=false&publicationState=live&filters[collections][id][$eq]=${musicCollection.id ? musicCollection.id : 0}`,
        );
        fetchedData.push(...data?.data);

        // Redirect to last page if current page is greater than total pages
        if (
          data?.meta?.pagination?.pageCount < currentPagePieces &&
          data?.meta?.pagination?.pageCount > 0
        ) {
          setCurrentPage(
            data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0
              ? data.meta.pagination.pageCount
              : 1,
          );
          router.push({
            pathname: encodeURIComponent(
              handleTitleWithJustNumber(musicCollection.attributes.title),
            ),
            query: { ...router.query, page: data.meta.pagination.pageCount },
          });
        } else {
          setWorks(fetchedData);
          setTotalPages(data?.meta?.pagination?.pageCount || 1);
        }
      } catch (error: any) {
        if (error?.response?.data) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } finally {
        setIsLoadingWorks(false);
      }
    };

    getWorks();
  }, [
    dispatch,
    router,
    currentPagePieces,
    query,
    setWorks,
    setIsLoadingWorks,
    musicCollection?.id,
    musicCollection?.attributes?.title,
  ]);

  if (musicCollection) {
    if (musicCollection.attributes.composers.data?.length) {
      musicCollection.attributes.composers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name) return -1;
        if (a.attributes.name > b.attributes.name) return 1;
        return 0;
      });
    }
    if (musicCollection.attributes.publishers.data?.length) {
      musicCollection.attributes.publishers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name) return -1;
        if (a.attributes.name > b.attributes.name) return 1;
        return 0;
      });
    }
  }

  const cleanWebsite = (websiteLink: string) => {
    return websiteLink.replace(/(^\w+:|^)\/\//, "");
  };

  return (
    <>
      {musicCollection && musicCollection.attributes.title ? (
        <Page
          showBackBar={true}
          showBackBarShare={true}
          showBackBarFeedback={true}
          url={
            EUrlsPages.COLLECTION +
            "/" +
            encodeURIComponent(
              handleTitleWithJustNumber(musicCollection.attributes.title),
            ) +
            "?id=" +
            musicCollection.id
          }
          prevUrl={prevUrl}
          title={
            musicCollection.attributes.title
              ? `${musicCollection.attributes.title} - Piano Music Database`
              : "Collection - Piano Music Database"
          }
          description={
            musicCollection.attributes.description
              ? musicCollection.attributes.description
              : `Explore ${musicCollection.attributes.title} on Piano Music Database. Buy the sheet music, find the works that make up the collection, and discover other details.`
          }
          image={
            musicCollection.attributes.imageSEO?.data
              ? musicCollection.attributes.imageSEO.data?.attributes.url
              : ""
          }
        >
          <article className="flex flex-col justify-center items-center gap-y-3 text-center">
            {!musicCollection.attributes.publishedAt && (
              <section id="review" className="flex justify-center">
                <div className="bg-orange-500 shadow-workNav mx-4 mb-12 py-4 rounded-lg">
                  <h2 className="px-4 text-white text-2xl text-center tracking-thigh">
                    <strong>UNDER REVIEW</strong>
                  </h2>
                  <hr className="mt-4 mb-3" />
                  <p className="px-4 text-white text-center tracking-thigh">
                    <strong>
                      This collection is currently <em>under review</em> by
                      staff.
                    </strong>
                  </p>
                  <p className="mt-4 px-4 text-white text-center tracking-thigh">
                    <strong>
                      This page is publicly viewable while under review, but the
                      collection will not appear in PMD search results.
                    </strong>
                  </p>
                  <p className="mt-4 px-4 text-white text-center tracking-thigh">
                    <strong>
                      Also, some data may not be viewable on this page while
                      under review.
                    </strong>
                  </p>
                  <p className="px-4 text-white text-center tracking-thigh">
                    <strong>
                      This includes related works, composers, and publishers
                      which are under review.
                    </strong>
                  </p>
                  <hr className="mt-4 mb-3" />
                  <div
                    id="feedback"
                    className="flex flex-row flex-wrap justify-center gap-x-5 gap-y-2 px-4 text-white text-center tracking-thigh"
                  >
                    <p>
                      <strong>
                        <em>See any issues or have suggestions?</em>
                      </strong>
                    </p>
                    <a
                      title="Send Feedback"
                      aria-label="Send Feedback"
                      aria-haspopup="dialog"
                      aria-expanded={showModalFeedback}
                      aria-controls="modalFeedback"
                      className="flex flex-row gap-2 text-white cursor-pointer"
                      onClick={() => {
                        setShowModalFeedback(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setShowModalFeedback(true);
                        }
                      }}
                      tabIndex={0}
                    >
                      <ImageNext
                        src={IconFeedbackWhite}
                        alt=""
                        height={20}
                        width={20}
                        className="z-0"
                      />
                      Send Feedback
                    </a>
                    <ModalFeedback
                      type={
                        "DraftCollection - " +
                        EUrlsPages.COLLECTION +
                        "/" +
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicCollection.attributes.title,
                          ),
                        ) +
                        "?id=" +
                        musicCollection.id
                      }
                      url={
                        EUrlsPages.COLLECTION +
                        "/" +
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicCollection.attributes.title,
                          ),
                        ) +
                        "?id=" +
                        musicCollection.id
                      }
                      onClose={() => {
                        setShowModalFeedback(false);
                      }}
                      isOpen={showModalFeedback}
                    />
                  </div>
                </div>
              </section>
            )}
            <div className="flex flex-col justify-center items-center gap-y-3 text-center">
              <div className="flex flex-col mb-4 max-w-[1000px] overflow-auto text-center">
                <div className="flex min-[935px]:flex-row flex-col justify-center items-top max-[935px]:items-center gap-x-6 gap-y-8">
                  {musicCollection.attributes.image.data ? (
                    <div className="min-[935px]:mt-5 min-w-auto sm:min-w-[300px] max-w-[240px] sm:max-w-[300px]">
                      <ImagePicture
                        alt={
                          musicCollection.attributes.image.data?.attributes
                            .alternativeText
                            ? musicCollection.attributes.image.data?.attributes
                                .alternativeText
                            : musicCollection.attributes.title
                        }
                        src={
                          musicCollection.attributes.image.data?.attributes.url
                            ? musicCollection.attributes.image.data?.attributes
                                .url
                            : ""
                        }
                        height={
                          musicCollection.attributes.image.data?.attributes
                            .height
                            ? musicCollection.attributes.image.data?.attributes
                                .height
                            : 0
                        }
                        width={
                          musicCollection.attributes.image.data?.attributes
                            .width
                            ? musicCollection.attributes.image.data?.attributes
                                .width
                            : 0
                        }
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    className={cn(
                      "flex flex-col justify-center gap-2 max-[420px]:max-w-64 max-[615px]:max-w-96 max-w-[575px] overflow-y-auto max-[935px]:justify-center",
                      {
                        "pb-2 max-w-[700px] text-center justify-center items-center":
                          !musicCollection.attributes.image?.data,
                      },
                    )}
                  >
                    <h1
                      className={cn(
                        "flex gap-2 justify-center items-center min-[935px]:w-fit max-w-auto py-1.5 max-[935px]:justify-center min-[935px]:text-left whitespace-normal",
                        {
                          "pb-2": !musicCollection.attributes.image.data,
                        },
                      )}
                    >
                      {musicCollection.attributes.title}
                    </h1>
                    {musicCollection.attributes.composers?.data?.length ? (
                      <div
                        className={cn(
                          "flex flex-row flex-wrap gap-1 pr-1.5 mt-2 w-full mx-auto max-[935px]:justify-center [935px]:text-left",
                          {
                            "text-center justify-center items-center":
                              !musicCollection.attributes.image.data,
                          },
                        )}
                      >
                        Composed{" "}
                        {musicCollection.attributes.composed_date
                          ? `in ${musicCollection.attributes.composed_date}`
                          : ""}{" "}
                        <span>by </span>
                        {musicCollection.attributes.composers.data.map(
                          (composer, composerIndex) => (
                            <span
                              className="text-base"
                              key={`${composer.attributes.name}-${composerIndex}`}
                            >
                              <Link
                                href={`/${EUrlsPages.COMPOSER}/${composer.attributes.name}?id=${composer.id}`}
                              >
                                <a
                                  className="text-base"
                                  title={`View ${composer.attributes.name}`}
                                >
                                  {composer.attributes.name}
                                </a>
                              </Link>
                              {musicCollection.attributes.composers.data &&
                                composerIndex <
                                  musicCollection.attributes.composers.data
                                    .length -
                                    1 &&
                                ", "}
                            </span>
                          ),
                        )}
                      </div>
                    ) : musicCollection.attributes.composed_date ? (
                      <p
                        className={cn(
                          "flex flex-row flex-wrap gap-1 pr-1.5 mt-2 w-full mx-auto max-[935px]:justify-center [935px]:text-left",
                          {
                            "text-center justify-center items-center":
                              !musicCollection.attributes.image.data,
                          },
                        )}
                      >
                        Composed in {musicCollection.attributes.composed_date}
                      </p>
                    ) : (
                      ""
                    )}
                    {musicCollection.attributes.publishers?.data?.length ? (
                      <div
                        className={cn(
                          "flex flex-row flex-wrap gap-1 pr-1.5 mt-2 w-full mx-auto max-[935px]:justify-center [935px]:text-left",
                          {
                            "text-center justify-center items-center":
                              !musicCollection.attributes.image.data,
                          },
                        )}
                      >
                        Published{" "}
                        {musicCollection.attributes.published_date
                          ? `in ${musicCollection.attributes.published_date}`
                          : ""}{" "}
                        <span>by </span>
                        {musicCollection.attributes.publishers.data.map(
                          (publisher, publisherIndex) => (
                            <span
                              className="text-base"
                              key={`${publisher.attributes.name}-${publisherIndex}`}
                            >
                              <Link
                                href={`/${EUrlsPages.PUBLISHER}/${publisher.attributes.name}?id=${publisher.id}`}
                              >
                                <a
                                  className="text-base"
                                  title={`View ${publisher.attributes.name}`}
                                >
                                  {publisher.attributes.name}
                                </a>
                              </Link>
                              {musicCollection.attributes.publishers.data &&
                                publisherIndex <
                                  musicCollection.attributes.publishers.data
                                    .length -
                                    1 &&
                                ", "}
                            </span>
                          ),
                        )}
                      </div>
                    ) : musicCollection.attributes.published_date ? (
                      <p
                        className={cn(
                          "flex flex-row flex-wrap gap-1 pr-1.5 mt-2 w-full mx-auto max-[935px]:justify-center [935px]:text-left",
                          {
                            "text-center justify-center items-center":
                              !musicCollection.attributes.image.data,
                          },
                        )}
                      >
                        Published in {musicCollection.attributes.published_date}
                      </p>
                    ) : (
                      ""
                    )}
                    {musicCollection.attributes.description ? (
                      <div className="min-[935px]:flex max-w-[575px] max-w-auto max-[420px]:max-w-64 max-[615px]:max-w-96 overflow-auto text-justify">
                        <div
                          className="flex min-[935px]:w-full min-[935px]:max-w-[816px] text-justify"
                          dangerouslySetInnerHTML={{
                            __html: handleCleanContent(
                              musicCollection.attributes.description,
                            ),
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    {musicCollection.attributes.catalogue_number ? (
                      <p>
                        Catalogue Number:{" "}
                        {musicCollection.attributes.catalogue_number}
                      </p>
                    ) : (
                      ""
                    )}
                    {musicCollection.attributes.isbn_10 ||
                    musicCollection.attributes.isbn_13 ? (
                      <div
                        className={cn(
                          "w-full md:max-w-[816px] mx-auto max-md:justify-center text-justify flex flex-wrap gap-x-6 gap-y-2 mt-2",
                          {
                            "text-center justify-center items-center":
                              !musicCollection.attributes.image.data,
                          },
                        )}
                      >
                        {musicCollection.attributes.isbn_10 ? (
                          <p>ISBN-10: {musicCollection.attributes.isbn_10}</p>
                        ) : (
                          ""
                        )}
                        {musicCollection.attributes.isbn_13 ? (
                          <p>ISBN-13: {musicCollection.attributes.isbn_13}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            {musicCollection.attributes.purchase_link?.length ? (
              <div
                id="get"
                className="flex flex-wrap justify-center items-center gap-4 mx-4 mt-8 mb-12"
              >
                {musicCollection.attributes.purchase_link.map(
                  (purchase_link) => (
                    <div
                      key={
                        purchase_link.url
                          ? purchase_link.url
                          : purchase_link.sellerName
                      }
                    >
                      <BuyLink
                        sellerName={purchase_link.sellerName}
                        itemName={`Sheet music for ${musicCollection.attributes.title}`}
                        url={purchase_link.url}
                        linkText={purchase_link.linkText}
                        sellerImage={
                          purchase_link.sellerImage.data?.attributes.url
                        }
                        sellerImageHeight={
                          purchase_link.sellerImage.data?.attributes.height
                        }
                        sellerImageWidth={
                          purchase_link.sellerImage.data?.attributes.width
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            ) : (
              ""
            )}
            {(musicCollection.attributes.urlSpotify ||
              musicCollection.attributes.urlAppleMusic) && (
              <div
                id="listen"
                className={cn("mb-8", {
                  "!mb-1": musicCollection.attributes.urlWebsite,
                })}
              >
                <div className="flex flex-wrap justify-center items-center gap-2 max-md:mt-2 text-center">
                  {musicCollection.attributes.urlSpotify && (
                    <div className="flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-1 rounded-lg text-center">
                      <Link href={musicCollection.attributes.urlSpotify}>
                        <a
                          className="group flex justify-center items-center text-center"
                          title={`Listen to ${musicCollection.attributes.title} on Spotify`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ImageNext
                            alt="Listen on Spotify"
                            src={IconListenOnSpotify}
                            height={40}
                            width={110}
                            className="group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out"
                          />
                        </a>
                      </Link>
                    </div>
                  )}
                  {musicCollection.attributes.urlAppleMusic && (
                    <div className="flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-1 rounded-lg text-center">
                      <Link href={musicCollection.attributes.urlAppleMusic}>
                        <a
                          className="group flex justify-center items-center text-center"
                          title={`Listen to ${musicCollection.attributes.title} on Apple Music`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ImageNext
                            alt="Listen on Apple Music"
                            src={IconListenOnAppleMusic}
                            height={40}
                            width={110}
                            className="group-active:opacity-40 group-focus:opacity-60 group-hover:opacity-60 transition-opacity duration-150 ease-in-out"
                          />
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            {musicCollection.attributes.urlWebsite && (
              <div id="website" className="mb-8">
                <div className="flex flex-row flex-wrap justify-center items-center gap-x-2 gap-y-1 shadow-musicCard p-3 rounded-lg text-center">
                  <Link href={musicCollection.attributes.urlWebsite}>
                    <a
                      className="flex justify-center items-center text-center"
                      title={musicCollection.attributes.urlWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cleanWebsite(musicCollection.attributes.urlWebsite)}
                    </a>
                  </Link>
                </div>
              </div>
            )}
            {musicCollection.attributes.videoYouTube && (
              <>
                <ContentDivider
                  title={"Video"}
                  className="mx-auto my-4 md:max-w-[816px]"
                />
                <div className="mx-auto mb-20 w-full md:max-w-[816px]">
                  <VideoPlayer
                    videoURL={musicCollection.attributes.videoYouTube}
                    videoName={musicCollection.attributes.title}
                  />
                </div>
              </>
            )}
            {isLoadingWorks ? (
              <p className="mt-16">Loading Pieces...</p>
            ) : works.length > 0 && works.length ? (
              <div className="flex flex-col justify-center items-center gap-1 mt-10 text-center align-middle">
                <ContentDivider
                  title={works.length > 2 ? "Pieces" : "Piece"}
                  className="mx-auto mb-1 md:max-w-[816px]"
                />
                {/* <div className='flex text-xs'>
                    <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][collections][0]=${encodeURI(musicCollection.attributes.title)}`}><a className='flex flex-row items-center gap-2' title={`Search for pieces in ${musicCollection.attributes.title}`}><ImageNext src={IconSearchRed} alt='' height={12} width={12} className='z-0' /><strong>See All in a New Search</strong></a></Link>
                  </div> */}
                <div className="flex flex-row flex-wrap justify-center items-center gap-3 mt-2 mb-4 max-w-[1200px] text-center align-middle">
                  <Works
                    works={works.slice(0, 10).map((piece) => ({
                      id: piece.id,
                      title: piece.attributes.title,
                      composers:
                        piece.attributes.composers?.data?.map(
                          (composer) => composer.attributes.name,
                        ) || null,
                      level: piece.attributes.level?.data?.attributes.title,
                      eras:
                        piece.attributes.eras?.data?.map(
                          (era) => era.attributes.name,
                        ) || null,
                    }))}
                  />
                </div>
                {works.length > 9 && (
                  <div className="flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm">
                    <Link
                      href={
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicCollection.attributes.title,
                          ),
                        ) +
                        ("?id=" + musicCollection.id + "&page=1") +
                        "#Pieces"
                      }
                    >
                      <a
                        title="First Page"
                        className={cn(
                          currentPagePieces === 1
                            ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                            : "cursor-pointer",
                          "bg-pmdGrayBright px-2 py-1 rounded-md",
                        )}
                      >
                        First
                      </a>
                    </Link>
                    <Link
                      href={
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicCollection.attributes.title,
                          ),
                        ) +
                        ("?id=" +
                          musicCollection.id +
                          "&page=" +
                          (currentPagePieces - 1)) +
                        "#Pieces"
                      }
                    >
                      <a
                        title="Previous Page"
                        className={cn(
                          currentPagePieces === 1
                            ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                            : "cursor-pointer",
                          "bg-pmdGrayBright px-2 py-1 rounded-md",
                        )}
                      >
                        Prev
                      </a>
                    </Link>
                    <span className="mx-2">
                      {currentPagePieces} of {totalPagesPieces}
                    </span>
                    <Link
                      href={
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicCollection.attributes.title,
                          ),
                        ) +
                        ("?id=" +
                          musicCollection.id +
                          "&page=" +
                          (currentPagePieces + 1)) +
                        "#Pieces"
                      }
                    >
                      <a
                        title="Next Page"
                        className={cn(
                          currentPagePieces === totalPagesPieces
                            ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                            : "cursor-pointer",
                          "bg-pmdGrayBright px-2 py-1 rounded-md",
                        )}
                      >
                        Next
                      </a>
                    </Link>
                    <Link
                      href={
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicCollection.attributes.title,
                          ),
                        ) +
                        ("?id=" +
                          musicCollection.id +
                          "&page=" +
                          totalPagesPieces) +
                        "#Pieces"
                      }
                    >
                      <a
                        title="Last Page"
                        className={cn(
                          currentPagePieces === totalPagesPieces
                            ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                            : "cursor-pointer",
                          "bg-pmdGrayBright px-2 py-1 rounded-md",
                        )}
                      >
                        Last
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </article>
        </Page>
      ) : (
        <Page
          showBackBar={true}
          showBackBarShare={false}
          showBackBarFeedback={true}
          prevUrl={prevUrl}
          url={`${EUrlsPages.COLLECTION}/not-found`}
          title="Collection Not Found - Piano Music Database"
          description="Explore collections on Piano Music Database. Buy the sheet music, find the works that make up the collection, and discover other details."
          image=""
        >
          <>
            <h1>Error 404: Collection Not Found</h1>
            <h2 className="mt-10">
              <em>This collection was not able to be located.</em>
            </h2>
            <p className="mt-6 max-w-[864px]">
              The collection you are looking for has moved, is no longer
              available, has been archived, or was not valid.
            </p>
            <p className="mt-2 max-w-[844px]">
              If you were looking for a specific collection, make sure the URL
              is formatted like this: <br />
              <strong>/{EUrlsPages.COLLECTION}/TITLEHERE?id=IDHERE</strong>{" "}
              <br />
              The ID is a number we use to connect you to the correct
              collection. Some collections may have the same title, so we can
              not know which collection you are looking for without an ID in the
              URL.
            </p>
            <p className="mt-6">
              Try searching to find what you are looking for.
            </p>
            <div className="flex flex-col justify-center items-center gap-y-4 my-8 w-full">
              <Link href={`/${EUrlsPages.SEARCH}`}>
                <a
                  aria-label="Start a Search"
                  title="Start a Search"
                  className="flex gap-2 md:!px-20 !pt-[30px] !pb-8 text-2xl button"
                >
                  <ImageNext
                    src={IconSearchWhite}
                    alt=""
                    height={20}
                    width={21}
                    className="max-[314px]:hidden z-0"
                  />{" "}
                  Start a Search
                </a>
              </Link>
            </div>
          </>
        </Page>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await apiCollection.get(
      (context?.query?.id as string) || "0",
    );
    return {
      props: {
        musicCollection: response.data.data,
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return {
      props: {
        musicCollection: null,
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  }
};

export default CollectionDetailsPage;
