import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Page from "@src/components/Page";
import cn from "classnames";
import Link from "next/link";
import CardElement from "@src/components/CardElement";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiElement,
} from "@src/types";
import { EUrlsPages } from "@src/constants";
import ModalElementCategories from "@src/components/Modals/ModalElementCategories";

interface IElementsPageProps {
  prevUrl: string | undefined;
}

const ElementsPage: NextPage<IElementsPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const [elements, setElements] = useState<IStrapiElement[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingElements, setIsLoadingElements] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const handleIsOpenElementCategoriesModal = () =>
    setIsOpenElementCategoriesModal(!isOpenElementCategoriesModal);
  const [isOpenElementCategoriesModal, setIsOpenElementCategoriesModal] =
    useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const getElements = async () => {
      try {
        setIsLoadingElements(true);
        const fetchedData = [];
        const { data } = await api.get(
          `elements?pagination[page]=${currentPage}&pagination[pageSize]=12&sort[0]=name:asc&populate[illustration][fields][0]=height&populate[illustration][fields][1]=width&populate[illustration][fields][2]=url&fields[0]=name&fields[1]=description&fields[2]=category&filters[category][$eq]=${category}&publicationState=live`,
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
          setElements(fetchedData);
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
        setIsLoadingElements(false);
      }
    };

    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { page, category } = query;

    // Page
    if (page) setCurrentPage(Number(page as string));
    // Category
    if (category) {
      setCurrentCategory(category as string);
      getElements();
    }
  }, [dispatch, router, currentPage, query, setElements, setIsLoadingElements]);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.ELEMENTS}
      title="Elements of Piano - Piano Music Database"
      description="Elements are the fundamental pedagogical concepts and techniques contained in each piece of piano music in the database. Knowing the elements of a particular piece helps you understand how difficult the piece is to play and what a student needs to know in order to successfully play it."
      image=""
    >
      <div className="flex flex-col justify-center items-center text-center">
        <h1>Elements of Piano</h1>
        <p className="mt-3 max-w-[816px] text-justify">
          Elements are the fundamental pedagogical concepts and techniques
          contained in each piece of piano music in the database. Knowing the
          elements of a particular piece helps you understand how difficult the
          piece is to play and what a student needs to know in order to
          successfully play it.
        </p>

        <hr
          id="category-selector"
          className="my-8 border-pmdGrayLight border-t-2 w-full"
        />

        <p className="mt-6 mb-3 text-sm text-center italic">
          Click the button below to see a list of element categories. <br />
          Then, select a category to explore all of those elements.
        </p>
        <button
          id="category-selector-button"
          title="Choose a Category"
          aria-label="Choose a Category"
          aria-haspopup="listbox"
          aria-expanded={isOpenElementCategoriesModal}
          aria-controls="modalElementCategories"
          className="text-2xl button"
          onClick={handleIsOpenElementCategoriesModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleIsOpenElementCategoriesModal();
            }
          }}
          tabIndex={0}
        >
          Choose a Category
        </button>
        <ModalElementCategories
          currentCategory={currentCategory}
          isOpen={isOpenElementCategoriesModal}
          onClose={handleIsOpenElementCategoriesModal}
        />
        <div
          id="elements"
          className="flex flex-col flex-wrap justify-center items-center mt-8"
        >
          {isLoadingElements ? (
            currentCategory ? (
              <p>Loading elements ({currentCategory})...</p>
            ) : (
              <p>Loading elements...</p>
            )
          ) : elements && elements.length && currentCategory ? (
            <div className="flex flex-col justify-center items-center gap-2 align-middle">
              <em className="text-xl">
                Showing elements for category:{" "}
                <strong>{currentCategory}</strong>
              </em>
              <div className="flex flex-col justify-center items-center gap-3 my-4 max-w-[1200px] text-center align-middle">
                <div className="flex flex-row flex-wrap justify-center items-stretch gap-3 text-center align-middle">
                  {elements.map((element) => (
                    <CardElement
                      key={`ElementItem-${element.id}`}
                      name={element.attributes.name}
                      desc={element.attributes.description}
                      cat={element.attributes.category}
                      illustrationWidth={
                        element.attributes.illustration.data?.attributes.width
                      }
                      illustrationHeight={
                        element.attributes.illustration.data?.attributes.height
                      }
                      illustrationURL={
                        element.attributes.illustration.data?.attributes.url
                      }
                      id={element.id}
                      hideLabel={true}
                    />
                  ))}
                </div>
                <div className="flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm">
                  <Link
                    href={
                      EUrlsPages.ELEMENTS +
                      "?category=" +
                      currentCategory +
                      "&page=1"
                    }
                  >
                    <a
                      title="First Page"
                      className={cn(
                        currentPage === 1
                          ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                          : "cursor-pointer",
                      )}
                    >
                      First
                    </a>
                  </Link>
                  <Link
                    href={
                      EUrlsPages.ELEMENTS +
                      "?category=" +
                      currentCategory +
                      ("&page=" + (currentPage - 1))
                    }
                  >
                    <a
                      title="Previous Page"
                      className={cn(
                        currentPage === 1
                          ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                          : "cursor-pointer",
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
                      EUrlsPages.ELEMENTS +
                      "?category=" +
                      currentCategory +
                      ("&page=" + (currentPage + 1))
                    }
                  >
                    <a
                      title="Next Page"
                      className={cn(
                        currentPage === totalPages
                          ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                          : "cursor-pointer",
                      )}
                    >
                      Next
                    </a>
                  </Link>
                  <Link
                    href={
                      EUrlsPages.ELEMENTS +
                      "?category=" +
                      currentCategory +
                      ("&page=" + totalPages)
                    }
                  >
                    <a
                      title="Last Page"
                      className={cn(
                        currentPage === totalPages
                          ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                          : "cursor-pointer",
                      )}
                    >
                      Last
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<
  IElementsPageProps
> = async ({ req }) => {
  return {
    props: {
      prevUrl: req.headers.referer ?? "",
    },
  };
};

export default ElementsPage;
