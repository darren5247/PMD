import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import cn from "classnames";
import Link from "next/link";
import { EUrlsPages } from "@src/constants";
import { handleCleanContent } from "@src/api/helpers";
import { apiElement } from "@src/api/apis";
import api from "@src/api/config";
import { AppContext } from "@src/state";
import { IStrapiElement, IStrapiPiece } from "@src/types";
import Page from "@src/components/Page";
import ImageNext from "@src/components/ImageNext";
import ImagePicture from "@src/components/ImagePicture";
import ContentDivider from "@src/components/ContentDivider";
import Works from "@src/components/Works";
import { IconSearchWhite, IconFeedbackWhite } from "@src/common/assets/icons";
import { handleTitleWithJustNumber } from "@src/api/helpers";
import { ModalFeedback } from "@src/components/Modals";

import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  },
});

interface IElementDetailsPageProps {
  musicElement: IStrapiElement;
  prevUrl: string | undefined;
}

const ElementDetailsPage: NextPage<IElementDetailsPageProps> = ({
  musicElement,
  prevUrl,
}) => {
  const router = useRouter();
  const { query } = router;
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);

  const checkNumberName = (dirtyName: string) => {
    const parsedName = parseInt(dirtyName);
    if (isNaN(parsedName)) {
      return dirtyName;
    } else {
      const words = toWords.convert(parsedName);
      return encodeURIComponent(words);
    }
  };

  let elementURL: string | undefined;
  if (musicElement && musicElement.attributes.name) {
    elementURL =
      EUrlsPages.ELEMENT +
      "/" +
      encodeURIComponent(checkNumberName(musicElement.attributes.name)) +
      "?id=" +
      musicElement.id;
  } else {
    elementURL = "";
  }

  let elementID: number | undefined;
  if (musicElement && musicElement.id) {
    elementID = musicElement.id;
  } else {
    elementID = undefined;
  }

  const [pieces, setPieces] = useState<IStrapiPiece[]>([]);
  const [currentPagePieces, setCurrentPagePieces] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [totalPagesPieces, setTotalPagesPieces] = useState(1);
  const [isLoadingPieces, setIsLoadingPieces] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { page, pagePieces, pagepieces } = query;

    // Page
    if (page) setCurrentPagePieces(Number(page as string));
    if (pagePieces) {
      setCurrentPagePieces(Number(pagePieces as string));
    } else {
      if (pagepieces) {
        setCurrentPagePieces(Number(pagepieces as string));
      }
    }

    if (elementID) {
      const getPieces = async () => {
        try {
          setIsLoadingPieces(true);
          const fetchedData = [];
          const { data } = await api.get(
            `works?pagination[page]=${currentPagePieces}&pagination[pageSize]=10&sort[0]=title:asc&populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[works][fields][2]=title&populate[works][populate][composers][fields][3]=name&populate[level][fields][4]=title&fields[5]=publishedAt&populate[scoreExcerpt][fields][6]=height&populate[scoreExcerpt][fields][7]=width&populate[scoreExcerpt][fields][8]=url&populate[image][fields][9]=height&populate[image][fields][10]=width&populate[image][fields][11]=url&populate[image][fields][12]=alternativeText&populate[eras][fields][13]=name&filters[publishedAt][$null]=false&publicationState=live&filters[elements][id][$in]=${elementID}`,
          );
          fetchedData.push(...data?.data);

          // Redirect to last page if current page is greater than total pages
          if (
            data?.meta?.pagination?.pageCount < currentPagePieces &&
            data?.meta?.pagination?.pageCount > 0
          ) {
            setCurrentPagePieces(
              data.meta.pagination.pageCount &&
                data.meta.pagination.pageCount > 0
                ? data.meta.pagination.pageCount
                : 1,
            );
            router.push({
              pathname: encodeURIComponent(
                handleTitleWithJustNumber(musicElement.attributes.name),
              ),
              query: pagePieces
                ? {
                    id: musicElement.id,
                    pageCollections: pagePieces,
                    pagePieces: data.meta.pagination.pageCount,
                  }
                : {
                    id: musicElement.id,
                    pagePieces: data.meta.pagination.pageCount,
                  },
            });
          } else {
            setPieces(fetchedData);
            setTotalPagesPieces(data?.meta?.pagination?.pageCount || 1);
          }
        } catch (error: any) {
          if (error?.response?.data) {
            console.error(
              "Error Getting Pieces for Composer-" +
                elementID +
                ": " +
                error?.response?.data.error?.message,
            );
          }
        } finally {
          setIsLoadingPieces(false);
        }
      };

      getPieces();
    }
  }, [
    elementID,
    dispatch,
    router,
    currentPagePieces,
    query,
    setPieces,
    setIsLoadingPieces,
    musicElement?.id,
    musicElement?.attributes?.name,
  ]);

  return (
    <>
      {musicElement && musicElement.attributes.name ? (
        <Page
          showBackBar={true}
          showBackBarShare={true}
          showBackBarFeedback={true}
          url={elementURL}
          prevUrl={prevUrl}
          title={
            musicElement.attributes.name
              ? `${musicElement.attributes.name} - Piano Music Database`
              : "Element - Piano Music Database"
          }
          description={
            musicElement.attributes.description
              ? musicElement.attributes.description
              : `Explore ${musicElement.attributes.name} on Piano Music Database. Elements are the fundamental pedagogical concepts and techniques contained in each piece of piano music.`
          }
          image=""
        >
          <article className="flex flex-col justify-center items-center gap-y-3 text-center">
            {!musicElement.attributes.publishedAt && (
              <section id="review" className="flex justify-center">
                <div className="bg-orange-500 shadow-workNav mx-4 mb-12 py-4 rounded-lg">
                  <h2 className="px-4 text-white text-2xl text-center tracking-thigh">
                    <strong>UNDER REVIEW</strong>
                  </h2>
                  <hr className="mt-4 mb-3" />
                  <p className="px-4 text-white text-center tracking-thigh">
                    <strong>
                      This element is currently <em>under review</em> by staff.
                    </strong>
                  </p>
                  <p className="mt-4 px-4 text-white text-center tracking-thigh">
                    <strong>
                      This page is publicly viewable while under review, but the
                      element will not appear in PMD search results.
                    </strong>
                  </p>
                  <p className="mt-4 px-4 text-white text-center tracking-thigh">
                    <strong>
                      Also, some data may not be viewable on this page while
                      under review.
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
                      type={"Draft - " + elementURL}
                      url={elementURL}
                      onClose={() => {
                        setShowModalFeedback(false);
                      }}
                      isOpen={showModalFeedback}
                    />
                  </div>
                </div>
              </section>
            )}
            <div className="flex flex-col mb-4 max-w-[1000px] overflow-auto text-center">
              <div className="flex md:flex-row flex-col justify-center items-top max-md:items-center gap-x-6 gap-y-8">
                {musicElement.attributes.illustration.data ? (
                  <div className="p-3 min-w-auto sm:min-w-[300px] max-w-[240px] sm:max-w-[300px]">
                    <ImagePicture
                      className="shadow-musicCard"
                      alt={
                        musicElement.attributes.illustration.data?.attributes
                          .alternativeText
                      }
                      src={
                        musicElement.attributes.illustration.data?.attributes
                          .url
                          ? musicElement.attributes.illustration.data
                              ?.attributes.url
                          : ""
                      }
                      height={
                        musicElement.attributes.illustration.data?.attributes
                          .height
                          ? musicElement.attributes.illustration.data
                              ?.attributes.height
                          : 0
                      }
                      width={
                        musicElement.attributes.illustration.data?.attributes
                          .width
                          ? musicElement.attributes.illustration.data
                              ?.attributes.width
                          : 0
                      }
                    />
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={cn("mt-4 flex gap-y-4 flex-col text-center", {
                    "md:text-left": musicElement.attributes.illustration.data,
                  })}
                >
                  {musicElement.attributes.name ? (
                    <h1
                      className={cn({
                        "pb-2": !musicElement.attributes.illustration.data,
                      })}
                    >
                      {musicElement.attributes.name}
                    </h1>
                  ) : (
                    ""
                  )}
                  {musicElement.attributes.category ? (
                    <p>
                      <strong>
                        <em>{musicElement.attributes.category}</em>
                      </strong>
                    </p>
                  ) : (
                    ""
                  )}
                  {musicElement.attributes.description ? (
                    <div
                      className="md:w-full md:max-w-[816px] text-justify"
                      dangerouslySetInnerHTML={{
                        __html: handleCleanContent(
                          musicElement.attributes.description,
                        ),
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </article>
          <div className="flex flex-col justify-center items-center gap-y-3 text-center">
            {isLoadingPieces ? (
              <p className="mt-16">Loading Pieces...</p>
            ) : pieces.length > 0 && pieces.length ? (
              <div className="flex flex-col justify-center items-center gap-1 mt-10 text-center align-middle">
                <ContentDivider
                  title={pieces.length > 2 ? "Pieces" : "Piece"}
                  className="mx-auto mb-1 md:max-w-[816px]"
                />
                {/* <div className='flex text-xs'>
                    <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][collections][0]=${encodeURI(musicElement.attributes.name)}`}><a className='flex flex-row items-center gap-2' title={`Search for pieces in ${musicElement.attributes.name}`}><ImageNext src={IconSearchRed} alt='' height={12} width={12} className='z-0' /><strong>See All in a New Search</strong></a></Link>
                  </div> */}
                <div className="flex flex-row flex-wrap justify-center items-center gap-3 mt-2 mb-4 max-w-[1200px] text-center align-middle">
                  <Works
                    works={pieces.slice(0, 10).map((piece) => ({
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
                {pieces.length > 9 && (
                  <div className="flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm">
                    <Link
                      href={
                        encodeURIComponent(
                          handleTitleWithJustNumber(
                            musicElement.attributes.name,
                          ),
                        ) +
                        ("?id=" + musicElement.id + "&page=1") +
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
                            musicElement.attributes.name,
                          ),
                        ) +
                        ("?id=" +
                          musicElement.id +
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
                            musicElement.attributes.name,
                          ),
                        ) +
                        ("?id=" +
                          musicElement.id +
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
                            musicElement.attributes.name,
                          ),
                        ) +
                        ("?id=" +
                          musicElement.id +
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
          </div>
        </Page>
      ) : (
        <Page
          showBackBar={true}
          showBackBarShare={false}
          showBackBarFeedback={true}
          url={`${EUrlsPages.ELEMENT}/not-found`}
          prevUrl={prevUrl}
          title="Element Not Found - Piano Music Database"
          description="Explore elements on Piano Music Database. Elements are the fundamental pedagogical concepts and techniques contained in each piece of piano music."
          image=""
        >
          <>
            <h1>Error 404: Element Not Found</h1>
            <h2 className="mt-10">
              <em>This element was not able to be located.</em>
            </h2>
            <p className="mt-6 max-w-[846px]">
              The element you are looking for has moved, is no longer available,
              has been archived, or was not valid.
            </p>
            <p className="mt-2 max-w-[844px]">
              If you were looking for a specific element, make sure the URL is
              formatted like this: <br />
              <strong>/{EUrlsPages.ELEMENT}/NAMEHERE?id=IDHERE</strong> <br />
              The ID is a number we use to connect you to the correct element.
              Some elements may have the same name, so we can not know which
              element you are looking for without an ID in the URL.
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
    const response = await apiElement.get(
      (context?.query?.id as string) || "0",
    );
    return {
      props: {
        musicElement: response.data.data,
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  } catch (error) {
    console.error("Error fetching element:", error);
    return {
      props: {
        musicElement: null,
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  }
};

export default ElementDetailsPage;
