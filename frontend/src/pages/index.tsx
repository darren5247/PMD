import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import Page from "@src/components/Page";
import PopularPieces from "@src/components/PopularPieces";
import NewPieces from "@src/components/NewPieces";
import FeaturedPiece from "@src/components/FeaturedPiece";
import ImageNext from "@src/components/ImageNext";
import ImagePicture from "@src/components/ImagePicture";
import {
  IconSearchWhite,
  IconSimpleDiscover,
  IconSimpleOrganize,
  IconSimpleShare,
} from "@src/common/assets/icons";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiPiece,
  // IStrapiMood,
  // IStrapiStyle,
  // IStrapiElement,
  // IStrapiLevel,
  IStrapiHomepageBanner,
  TUserAttributes,
} from "@src/types";
import { EUrlsPages } from "@src/constants";

interface IIndexPageProps {
  queries?: string;
}

const IndexPage: NextPage<IIndexPageProps> = ({ queries }) => {
  const { dispatch } = useContext(AppContext);
  const [userId, setUserId] = useState<number | null>(null);
  const [piece, setPiece] = useState<IStrapiPiece[]>([]);
  const [isLoadingPiece, setIsLoadingPiece] = useState(false);
  const [pieces, setPieces] = useState<IStrapiPiece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(false);
  const [newPieces, setNewPieces] = useState<IStrapiPiece[]>([]);
  const [isLoadingNewPieces, setIsLoadingNewPieces] = useState(false);
  const [banner, setBanner] = useState<IStrapiHomepageBanner>(
    {} as IStrapiHomepageBanner,
  );
  const [isLoadingBanner, setIsLoadingBanner] = useState(false);

  useEffect(() => {
    const getPiece = async () => {
      try {
        setIsLoadingPiece(true);
        const fetchedData = [];
        const { data } = await api.get(
          "works?pagination[page]=1&pagination[pageSize]=1&sort[0]=id:asc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title&fields[1]=isFeatured&filters[isFeatured][$notNull]=true",
        );
        fetchedData.push(...data?.data);
        setPiece(fetchedData);
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
        setPiece([]);
      } finally {
        setIsLoadingPiece(false);
      }
    };

    const getPieces = async () => {
      try {
        setIsLoadingPieces(true);
        const fetchedData = [];
        const { data } = await api.get(
          "works?pagination[page]=1&pagination[pageSize]=10&sort[0]=popularPiecesIndex:asc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title&fields[1]=popularPiecesIndex&filters[popularPiecesIndex][$notNull]=true",
        );
        fetchedData.push(...data?.data);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            const response = await api.get(
              `works?pagination[page]=${i}&pagination[pageSize]=10&sort[0]=popularPiecesIndex:asc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title&fields[1]=popularPiecesIndex&filters[popularPiecesIndex][$notNull]=true`,
            );
            fetchedData.push(...response.data.data);
          }
        }
        setPieces(fetchedData);
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
        setPieces([]);
      } finally {
        setIsLoadingPieces(false);
      }
    };

    const getNewPieces = async () => {
      try {
        setIsLoadingNewPieces(true);
        const fetchedData = [];
        const { data } = await api.get(
          "works?pagination[page]=1&pagination[pageSize]=10&sort[0]=publishedAt:desc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title&fields[1]=isFeatured&filters[publishedAt][$notNull]=true&publicationState=live",
        );
        fetchedData.push(...data?.data);
        setNewPieces(fetchedData);
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
        setNewPieces([]);
      } finally {
        setIsLoadingNewPieces(false);
      }
    };

    const getHomepageBanner = async () => {
      try {
        setIsLoadingBanner(true);
        const { data } = await api.get(
          "homepage-banner?populate[BannerImage][fields][0]=height&populate[BannerImage][fields][1]=width&populate[BannerImage][fields][2]=url",
        );
        setBanner(data.data);
      } catch (error: any) {
        if (
          error?.response?.data &&
          error?.response?.data.error?.message === "Not found"
        ) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR,
            },
          });
        }
        setBanner({} as IStrapiHomepageBanner);
      } finally {
        setIsLoadingBanner(false);
      }
    };

    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      setUserId(accountData.id);
      getPiece();
      getPieces();
      getNewPieces();
      getHomepageBanner();
    }
  }, [dispatch]);

  return (
    <Page
      showBackBar={userId ? true : false}
      showBackBarShare={userId ? true : false}
      showBackBarFeedback={userId ? true : false}
      queries={queries}
      url=""
      title="Piano Music Database - Find the Perfect Piece"
      description="Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com."
      image=""
      className="!mx-0 !px-0 !max-w-full"
      classNameMain="!mt-0 lg:!mt-0 !max-w-full !mx-0 !px-0"
    >
      {userId ? (
        <article
          id="home"
          className="flex flex-col justify-center items-center w-full text-center"
        >
          <div className="flex flex-col justify-center items-center !mt-36 !px-4 w-full text-center">
            <div className="flex flex-col justify-center items-center w-full text-center">
              <h1 className="my-3 font-extrabold text-5xl">
                Find the perfect piece.
              </h1>
              <p className="max-w-[500px] text-2xl">
                A search engine that helps you discover piano music based on
                level, element, mood, theme, style, and more!
              </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-y-4 mt-16 mb-8 w-full">
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
            {isLoadingBanner! && banner ? (
              ""
            ) : banner.attributes?.BannerLink ? (
              <Link href={banner.attributes?.BannerLink}>
                <a
                  title={
                    banner.attributes?.BannerLinkTitle
                      ? banner.attributes?.BannerLinkTitle
                      : ""
                  }
                  className="mt-16"
                >
                  <div className="flex flex-col justify-center items-center gap-y-4 w-full max-w-[1200px]">
                    <ImagePicture
                      alt={
                        banner.attributes?.BannerLinkTitle
                          ? banner.attributes?.BannerLinkTitle
                          : ""
                      }
                      src={banner.attributes?.BannerImage?.data.attributes.url}
                      height={
                        banner.attributes?.BannerImage?.data.attributes.height
                      }
                      width={
                        banner.attributes?.BannerImage?.data.attributes.width
                      }
                      className="hover:cursor-pointer"
                    />
                  </div>
                </a>
              </Link>
            ) : (
              banner.attributes?.BannerImage?.data.attributes.url && (
                <div className="flex flex-col justify-center items-center gap-y-4 mt-16 mb-8 w-full max-w-[1200px]">
                  <ImagePicture
                    alt={
                      banner.attributes?.BannerLinkTitle
                        ? banner.attributes?.BannerLinkTitle
                        : ""
                    }
                    src={banner?.attributes?.BannerImage?.data.attributes.url}
                    height={
                      banner.attributes?.BannerImage?.data.attributes.height
                    }
                    width={
                      banner.attributes?.BannerImage?.data.attributes.width
                    }
                  />
                </div>
              )
            )}
            {isLoadingPiece! && piece ? (
              <p
                id="piece"
                className="flex flex-col flex-wrap justify-center items-center mt-10 mb-20 w-full max-w-[1250px] min-h-[594px] text-center"
              >
                Loading Featured Piece...
              </p>
            ) : (
              <FeaturedPiece featuredPieces={piece} />
            )}
            {isLoadingPieces! && pieces ? (
              <p
                id="pieces"
                className="flex flex-col flex-wrap justify-center items-center mt-10 mb-20 w-full max-w-[1250px] min-h-[542px] text-center"
              >
                Loading Popular Pieces...
              </p>
            ) : (
              <PopularPieces popularPieces={pieces} />
            )}
            {isLoadingNewPieces! && newPieces ? (
              <p
                id="new-pieces"
                className="flex flex-col flex-wrap justify-center items-center mt-10 mb-20 w-full max-w-[1250px] min-h-[542px] text-center"
              >
                Loading New Pieces...
              </p>
            ) : (
              <NewPieces newPieces={newPieces} />
            )}
          </div>
        </article>
      ) : (
        <article
          id="home"
          className="flex flex-col justify-center items-center w-full text-center"
        >
          <div className="flex flex-col justify-center items-center !mt-[106px] !px-4 w-full text-center">
            <div className="flex max-[874px]:flex-col justify-center items-center gap-20 w-full max-w-[900px] text-center">
              <div className="flex flex-col justify-left max-[874px]:justify-center items-start max-[874px]:items-center gap-2 w-full sm:min-w-[440px] text-left max-[874px]:text-center">
                <h1
                  id="animated-heading"
                  className="my-3 text-5xl text-left max-[874px]:text-center"
                >
                  <span>Powerful tools to...</span>
                  <div className="animated-words">
                    <div className="animate-text word1">discover</div>
                    <div className="animate-text word2">organize</div>
                    <div className="animate-text word3">share</div>
                    <div className="animate-text word4">study</div>
                    <div className="animate-text word5">master</div>
                  </div>
                  <span>piano music.</span>
                </h1>
                <p className="max-w-[500px] text-2xl">
                  Piano Music Database is an online platform that connects you
                  with the perfect piece.
                </p>
                <p className="max-w-[500px] text-2xl">
                  We have an advanced repertoire search engine, personal library
                  management tools, educational resources, and a community of
                  piano music enthusiasts <br />
                  <strong>all in one place</strong>.
                </p>
                <p className="mt-6 max-w-[500px] text-2xl">
                  <em>Join now to see what you can find!</em>
                </p>
                <div className="flex flex-col justify-center items-stretch gap-y-4 mt-10 w-full grow">
                  <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
                    <a
                      aria-label="Create Free Account"
                      title="Create Free Account"
                      className="flex justify-center items-center gap-2 md:!px-20 !pt-[30px] !pb-8 text-2xl text-center button"
                    >
                      Create Free Account
                    </a>
                  </Link>
                  <p>
                    Already have an account?{" "}
                    <Link href={`/${EUrlsPages.LOG_IN}`}>
                      <a title="Log In">Log In</a>
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex md:flex-col flex-wrap gap-8 min-[874px]:gap-20 max-[874px]:mt-8 w-full max-w-[440px] min-[874px]:max-w-80 shrink">
                <ImageNext
                  src={IconSimpleDiscover}
                  alt="Use our search engine to find pieces that match your teaching goals and the preferences of your students."
                />
                <p className="min-[874px]:hidden mb-10">
                  Use our search engine to find pieces that match your teaching
                  goals and the preferences of your students.
                </p>
                <ImageNext
                  src={IconSimpleOrganize}
                  alt="Quickly save your favorites, or create a custom repertoire list to share with students, colleagues, or friends."
                />
                <p className="min-[874px]:hidden mb-10">
                  Quickly save your favorites, or create a custom repertoire
                  list to share with students, colleagues, or friends.
                </p>
                <ImageNext
                  src={IconSimpleShare}
                  alt="List your piano music on our database to find new fans and drive traffic to your store."
                />
                <p className="min-[874px]:hidden mb-10">
                  List your piano music on our database to find new fans and
                  drive traffic to your store.
                </p>
              </div>
            </div>
            {isLoadingBanner! && banner ? (
              ""
            ) : banner.attributes?.BannerLink ? (
              <Link href={banner.attributes?.BannerLink}>
                <a
                  title={
                    banner.attributes?.BannerLinkTitle
                      ? banner.attributes?.BannerLinkTitle
                      : ""
                  }
                  className="mt-16"
                >
                  <div className="flex flex-col justify-center items-center gap-y-4 w-full max-w-[1200px]">
                    <ImagePicture
                      alt={
                        banner.attributes?.BannerLinkTitle
                          ? banner.attributes?.BannerLinkTitle
                          : ""
                      }
                      src={banner.attributes?.BannerImage?.data.attributes.url}
                      height={
                        banner.attributes?.BannerImage?.data.attributes.height
                      }
                      width={
                        banner.attributes?.BannerImage?.data.attributes.width
                      }
                      className="hover:cursor-pointer"
                    />
                  </div>
                </a>
              </Link>
            ) : (
              banner.attributes?.BannerImage?.data.attributes.url && (
                <div className="flex flex-col justify-center items-center gap-y-4 mt-16 mb-8 w-full max-w-[1200px]">
                  <ImagePicture
                    alt={
                      banner.attributes?.BannerLinkTitle
                        ? banner.attributes?.BannerLinkTitle
                        : ""
                    }
                    src={banner?.attributes?.BannerImage?.data.attributes.url}
                    height={
                      banner.attributes?.BannerImage?.data.attributes.height
                    }
                    width={
                      banner.attributes?.BannerImage?.data.attributes.width
                    }
                  />
                </div>
              )
            )}
          </div>
        </article>
      )}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async ({
  req,
}) => {
  const queries = `${req.url ? req.url : ""}`;

  return {
    props: {
      queries,
    },
  };
};

export default IndexPage;
