import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import Link from "next/link";
import cn from "classnames";
import { EUrlsPages } from "@src/constants";
import Page from "@src/components/Page";
import ImageNext from "@src/components/ImageNext";
import Divider from "@src/components/Divider";
import { IconPlus, IconFeedback } from "@src/common/assets/icons";
import Chip from "@src/components/Chip";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiCollection,
  TUserAttributes,
} from "@src/types";
import { ModalEditDisclaimer } from "@src/components/Modals";

interface ICollectionsAddedPageProps {
  prevUrl: string | undefined;
}

const CollectionsAddedPage: NextPage<ICollectionsAddedPageProps> = ({
  prevUrl,
}) => {
  const router = useRouter();
  const { query } = router;
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [collections, setCollections] = useState<IStrapiCollection[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const pageSize =
    Number(query.pageSize) && Number(query.pageSize) > 1
      ? Number(query.pageSize)
      : 10;
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [showModalEditDisclaimer, setShowModalEditDisclaimer] =
    useState<boolean>(false);
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      if (accountData.name) {
        setUserName(accountData.name);
        if (accountData.email) {
          setUserEmail(accountData.email);
        }
      }
    } else {
      localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    }

    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { page } = query;

    // Page
    if (page) setCurrentPage(Number(page as string));

    const getCollections = async () => {
      try {
        setIsLoadingCollections(true);
        const fetchedData = [];
        const { data } = await api.get(
          `collections?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=title:asc&populate[collections][fields][0]=title&populate[collections][fields][1]=title&populate[user][fields][2]=title&populate[user][fields][3]=email&fields[0]=title&fields[1]=createdAt&fields[2]=updatedAt&fields[3]=publishedAt&fields[4]=adminReview&filters[user][email][$eq]=${userEmail}&publicationState=preview`,
        );
        fetchedData.push(...data?.data);

        // Redirect to last page if current page is greater than total pages
        if (
          data?.meta?.pagination?.pageCount < currentPage &&
          data?.meta?.pagination?.pageCount > 0
        ) {
          setCurrentPage(
            data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0
              ? data.meta.pagination.pageCount
              : 1,
          );
          router.push({
            pathname: router.pathname,
            query: { ...router.query, page: data.meta.pagination.pageCount },
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
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } finally {
        setIsLoadingCollections(false);
      }
    };

    getCollections();
  }, [
    dispatch,
    router,
    currentPage,
    pageSize,
    query,
    setCollections,
    setIsLoadingCollections,
    userEmail,
  ]);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.COLLECTIONS_ADDED}
      prevUrl={prevUrl}
      title="Collections Added - Piano Music Database"
      description="View collections added to Piano Music Database by you and quickly edit details of those collections."
      image=""
    >
      <div className="max-w-[460px] text-center">
        <h1 className="mx-auto">Collections Added</h1>
        <>
          {isLoadingCollections ? (
            <p className="mt-6">Loading Collections...</p>
          ) : collections && collections.length ? (
            <div>
              <div
                id="edits"
                className="flex flex-row flex-wrap justify-center items-center gap-x-5 gap-y-2 bg-pmdGrayBright my-6 px-3 py-8 rounded-lg w-full text-center"
              >
                <p>Need to edit a collection?</p>
                <a
                  title="Send Edits"
                  aria-label="Send Edits"
                  aria-haspopup="dialog"
                  aria-expanded={showModalEditDisclaimer}
                  aria-controls="modalEditDisclaimer"
                  className="flex flex-row gap-2 cursor-pointer"
                  onClick={() => {
                    setShowModalEditDisclaimer(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowModalEditDisclaimer(true);
                    }
                  }}
                  tabIndex={0}
                >
                  <ImageNext
                    src={IconFeedback}
                    alt=""
                    height={20}
                    width={20}
                    className="z-0"
                  />
                  <strong>Send Edits</strong>
                </a>
                <ModalEditDisclaimer
                  type="Collections-Added Edit Collection Disclaimer"
                  url={`${EUrlsPages.COLLECTIONS_ADDED}`}
                  onClose={() => {
                    setShowModalEditDisclaimer(false);
                  }}
                  isOpen={showModalEditDisclaimer}
                />
              </div>
              <Divider className="mt-0 mb-0" />
              <div className="flex justify-center mx-auto mt-8 px-4 text-center">
                <a
                  title="Add New Collection"
                  className="flex flex-row justify-center items-center gap-2 align-middle cursor-pointer"
                  href={`/${EUrlsPages.ADD_COLLECTION}`}
                >
                  <ImageNext
                    src={IconPlus}
                    alt=""
                    height={16}
                    width={15}
                    className="z-0"
                  />
                  <strong>Add New Collection</strong>
                </a>
              </div>
              {userName && (
                <div className="flex flex-row justify-center items-center gap-4 mt-8 mb-4 px-4 align-middle">
                  <p>Collections added by:</p>
                  <Chip title={userName} />
                </div>
              )}
              {collections.map((collection) => (
                <div
                  className="flex flex-row gap-4 even:bg-white odd:bg-pmdGrayBright mt-6 p-4 text-left"
                  key={collection.id}
                >
                  <div className="flex flex-col gap-4 text-left">
                    <p>
                      <strong>#{collection.id}</strong>
                    </p>
                    <Link
                      href={`/${EUrlsPages.COLLECTION}/${encodeURIComponent(collection.attributes.title)}?id=${collection.id}`}
                    >
                      <a
                        title={`View collection #${collection.id}`}
                        className="flex flex-row"
                      >
                        View
                      </a>
                    </Link>
                    {/* <Link href={`/${EUrlsPages.EDIT_COLLECTION}/${encodeURIComponent(collection.attributes.title)}?id=${collection.id}`}>
                                                    <a title={`Edit collection #${collection.id}`} className='flex flex-row'>Edit</a>
                                                </Link> */}
                  </div>
                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex flex-row gap-4 pb-2 border-pmdGray border-b text-left">
                      <p>
                        <em>{collection.attributes.title}</em>
                      </p>
                    </div>
                    <div className="flex flex-row gap-4 text-left">
                      <p>
                        Created{" "}
                        {collection.attributes.createdAt
                          .replace("T", " at ")
                          .replace("Z", " GMT")}
                      </p>
                    </div>
                    <div className="flex flex-row gap-4 text-left">
                      <p>
                        Updated{" "}
                        {collection.attributes.updatedAt
                          .replace("T", " at ")
                          .replace("Z", " GMT")}
                      </p>
                    </div>
                    {collection.attributes.publishedAt ? (
                      <div className="flex flex-row gap-4 text-left">
                        <p>
                          Published{" "}
                          {collection.attributes.publishedAt
                            .replace("T", " at ")
                            .replace("Z", " GMT")}
                        </p>
                      </div>
                    ) : collection.attributes.adminReview ? (
                      collection.attributes.adminReview == "Complete" ? (
                        <div className="flex flex-col text-left">
                          <p>Under Review</p>
                          <p>Review Status: Complete, Awaiting Publish</p>
                        </div>
                      ) : (
                        <div className="flex flex-col text-left">
                          <p>Under Review</p>
                          <p>
                            Review Status: {collection.attributes.adminReview}
                          </p>
                        </div>
                      )
                    ) : (
                      <p>Under Review</p>
                    )}
                  </div>
                </div>
              ))}
              {collections.length > 9 && (
                <div className="flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm">
                  <Link
                    href={EUrlsPages.COLLECTIONS_ADDED + "?page=1#worksAdded"}
                  >
                    <a
                      title="First Page"
                      className={cn(
                        currentPage === 1
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
                      EUrlsPages.COLLECTIONS_ADDED +
                      ("?page=" + (currentPage - 1)) +
                      "#worksAdded"
                    }
                  >
                    <a
                      title="Previous Page"
                      className={cn(
                        currentPage === 1
                          ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                          : "cursor-pointer",
                        "bg-pmdGrayBright px-2 py-1 rounded-md",
                      )}
                    >
                      Prev
                    </a>
                  </Link>
                  <span className="mx-2">
                    {currentPage} of {totalPages}
                  </span>
                  <Link
                    href={
                      EUrlsPages.COLLECTIONS_ADDED +
                      ("?page=" + (currentPage + 1)) +
                      "#worksAdded"
                    }
                  >
                    <a
                      title="Next Page"
                      className={cn(
                        currentPage === totalPages
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
                      EUrlsPages.COLLECTIONS_ADDED +
                      ("?page=" + totalPages) +
                      "#worksAdded"
                    }
                  >
                    <a
                      title="Last Page"
                      className={cn(
                        currentPage === totalPages
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
            <div className="flex flex-col justify-center items-center px-4 text-center">
              {userName ? (
                <div className="flex flex-col justify-center items-center gap-4 mt-6 mb-6 align-middle">
                  <Link href={`/${EUrlsPages.ADD_COLLECTION}`}>
                    <a
                      title="Add New Collection"
                      className="flex flex-row justify-center items-center gap-2 align-middle cursor-pointer"
                    >
                      <ImageNext
                        src={IconPlus}
                        alt=""
                        height={16}
                        width={15}
                        className="z-0"
                      />
                      <strong>Add New Collection</strong>
                    </a>
                  </Link>
                  <div className="flex flex-row flex-wrap justify-center items-center gap-4 mt-2 mb-4 align-middle">
                    <p>No collections added yet by:</p>
                    <Chip title={userName} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-6 mt-6 mb-4 align-middle">
                  <Link href={`/${EUrlsPages.ADD_COLLECTION}`}>
                    <a
                      title="Add New Collection"
                      className="flex flex-row justify-center items-center gap-2 align-middle cursor-pointer"
                    >
                      <ImageNext
                        src={IconPlus}
                        alt=""
                        height={16}
                        width={15}
                        className="z-0"
                      />
                      <strong>Add New Collection</strong>
                    </a>
                  </Link>
                  <p>No collections added yet.</p>
                </div>
              )}
            </div>
          )}
        </>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? "",
    },
  };
};

export default CollectionsAddedPage;
