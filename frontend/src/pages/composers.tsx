import { GetServerSideProps, NextPage } from "next";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Page from "@src/components/Page";
import { useMediaQuery } from "@src/common/hooks";
import { EUrlsPages, CFilterKeys, CItemKeys } from "@src/constants";
import SearchFiltersItem from "@src/components/SearchFiltersItem";
import SearchResultsItem from "@src/components/SearchResultsItem";
import { TUserAttributes } from "@src/types";
import Link from "next/link";
import Chip from "@src/components/Chip";

interface IComposersPageProps {
  prevUrl?: string | undefined;
}

const ComposersPage: NextPage<IComposersPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const composersBreakpoint =
    CItemKeys.find((item) => item.value === "composers")?.pageBreakpoint ||
    "100000px";
  const isBreakpoint = useMediaQuery(`(min-width: ${composersBreakpoint})`);
  const [userId, setUserId] = useState<number | null>(null);
  const [pageTitleClean, setPageTitleClean] = useState<string | null>(null);
  const [pageDescClean, setPageDescClean] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [pageSize, setPageSize] = useState(
    Number(query.pageSize) && Number(query.pageSize) > 1
      ? Number(query.pageSize)
      : 10,
  );

  const [textQuery, setTextQuery] = useState<string | null>(null);

  const [eraFilter, setEraFilter] = useState<string | null>(null);

  useEffect(() => {
    // Check for all the OLD filters and replace them with the NEW versions if they exist
    const updatedQuery = { ...query };

    // Loop through the CFilterKeys and update the query object
    // Check if the old key exists in the query object and update it to the new key
    CFilterKeys.filter(({ itemType }) => itemType === "composers").forEach(
      ({ filterOptions }) => {
        filterOptions.forEach(({ oldKey, prefix, newKey }) => {
          if (oldKey === "query") {
            const oldTypesenseFilter = `${prefix}[${oldKey}]`;
            if (query[oldTypesenseFilter]) {
              updatedQuery[newKey] = query[oldTypesenseFilter];
              delete updatedQuery[oldTypesenseFilter];
            }
          } else {
            for (let i = 0; i <= 8; i++) {
              const oldTypesenseFilterWithNumbers = `${prefix}[${oldKey}][${i}]`;
              if (query[oldTypesenseFilterWithNumbers]) {
                updatedQuery[newKey] = query[oldTypesenseFilterWithNumbers];
                delete updatedQuery[oldTypesenseFilterWithNumbers];
              }
            }
          }
        });
      },
    );

    // Check if the updated query is different from the current query
    // If they are different, update the URL with the new query parameters
    if (JSON.stringify(updatedQuery) !== JSON.stringify(query)) {
      router.push(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true },
      );
    }
  }, [query, router]);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      setUserId(accountData.id);
    }

    // Set Filters based on the query params on page load (if any)
    const setFilter = (queryKey: string, fallbackKey: string | null) => {
      const filterValue = query[queryKey] || fallbackKey;
      if (filterValue) {
        // Set the filter value based on the filter type
        switch (queryKey) {
          case "q":
            setTextQuery(filterValue as string);
            break;
          case "era":
            setEraFilter(filterValue as string);
            break;
          default:
            break;
        }
      }
    };

    // Check for the NEW filters - overwrites the old filters
    CFilterKeys.forEach((filterKey) => {
      filterKey.filterOptions.forEach(({ newKey }) => {
        setFilter(newKey, query[newKey] as string);
      });
    });

    // Get/Set Page-Based Queries on Page Load
    const { page, pageSize, size, count } = query;
    // Set Page
    if (page) setCurrentPage(Number(page as string));
    // Set Page Size
    if (pageSize) setPageSize(Number(pageSize as string));
    if (size) setPageSize(Number(size as string));
    if (count) setPageSize(Number(count as string));
  }, [query, currentPage, pageSize, textQuery]);

  useEffect(() => {
    function pageTitle() {
      if ((textQuery && textQuery !== "") || (eraFilter && eraFilter !== "")) {
        const filtersArray = [
          eraFilter &&
            (Array.isArray(eraFilter)
              ? `the ${eraFilter.join(" and ")} eras`
              : `the ${eraFilter} era`),
        ].filter(Boolean);

        const filters =
          filtersArray.length === 2
            ? filtersArray.join(" and ")
            : filtersArray.join(", ");

        setPageTitleClean(
          `Search for ${textQuery ? `${textQuery} ` : ""}Composers${eraFilter && eraFilter !== "" ? ` from ${decodeURIComponent(filters)}` : ""} on Piano Music Database`,
        );
      } else {
        setPageTitleClean("Search for Composers on Piano Music Database");
      }
    }

    function pageDesc() {
      if ((textQuery && textQuery !== "") || (eraFilter && eraFilter !== "")) {
        const filtersArray = [
          eraFilter &&
            (Array.isArray(eraFilter)
              ? `the ${eraFilter.join(" and ")} eras`
              : `the ${eraFilter} era`),
        ].filter(Boolean);

        const filters =
          filtersArray.length === 2
            ? filtersArray.join(" and ")
            : filtersArray.join(", ");

        setPageDescClean(
          `Search for ${textQuery ? `${textQuery} ` : ""}Composers${eraFilter && eraFilter !== "" ? `from ${decodeURIComponent(filters)}` : ""} on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, composer, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.`,
        );
      } else {
        setPageDescClean(
          "Search for Composers on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, composer, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.",
        );
      }
    }

    pageTitle();
    pageDesc();
  }, [textQuery, eraFilter]);

  function pageTitle() {
    if ((textQuery && textQuery !== "") || (eraFilter && eraFilter !== "")) {
      const filtersArray = [
        eraFilter &&
          (Array.isArray(eraFilter)
            ? `the ${eraFilter.join(" and ")} eras`
            : `the ${eraFilter} era`),
      ].filter(Boolean);

      const filters =
        filtersArray.length === 2
          ? filtersArray.join(" and ")
          : filtersArray.join(", ");

      setPageTitleClean(
        `Search for ${textQuery ? `${textQuery} ` : ""}Composers${eraFilter && eraFilter !== "" ? `from ${decodeURIComponent(filters)}` : ""} on Piano Music Database`,
      );
    } else {
      setPageTitleClean("Search for Composers on Piano Music Database");
    }
  }

  function pageDesc() {
    if ((textQuery && textQuery !== "") || (eraFilter && eraFilter !== "")) {
      const filtersArray = [
        eraFilter &&
          (Array.isArray(eraFilter)
            ? `the ${eraFilter.join(" and ")} eras`
            : `the ${eraFilter} era`),
      ].filter(Boolean);

      const filters =
        filtersArray.length === 2
          ? filtersArray.join(" and ")
          : filtersArray.join(", ");

      setPageDescClean(
        `Search for ${textQuery ? `${textQuery} ` : ""}Composers${eraFilter && eraFilter !== "" ? `from ${decodeURIComponent(filters)}` : ""} on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, composer, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.`,
      );
    } else {
      setPageDescClean(
        "Search for Composers on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, composer, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.",
      );
    }
  }

  const checkFiltering = (filterName?: string) => {
    if (filterName && filterName !== "") {
      switch (filterName) {
        case "q":
          setTextQuery(null);
          break;
        case "era":
          setEraFilter(null);
          break;
      }
      pageTitle();
      pageDesc();
    } else {
      // Reset all filters
      setTextQuery(null);
      setEraFilter(null);
      pageTitle();
      pageDesc();
    }
  };

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.COMPOSERS}
      title={
        pageTitleClean ? pageTitleClean : "Composers - Piano Music Database"
      }
      description={
        pageDescClean
          ? pageDescClean
          : "Explore composers on Piano Music Database. Buy their sheet music, find the perfect works that make up their repertoire, and discover other details about your favorite composers."
      }
      image=""
      className="!mx-0 !px-0 !max-w-full"
      classNameMain="!max-w-full !mx-0 !px-0"
    >
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="mx-3">Composers</h1>
        <p className="mx-3 mt-3 max-w-[778px] text-justify">
          Explore composers on Piano Music Database. Buy their sheet music, find
          the perfect works that make up their repertoire, and discover other
          details about your favorite composers.
        </p>
        {userId ? (
          <div
            id="search"
            className={cn(
              "flex justify-center gap-x-3 gap-y-6 mx-auto mt-6",
              isBreakpoint ? "flex-row items-start" : "flex-col items-stretch",
            )}
          >
            <SearchFiltersItem
              itemType="composers"
              className="flex"
              onReset={(filterName?: string) => checkFiltering(filterName)}
              mobileBreakpoint={composersBreakpoint}
              itemTypeTitleOrName="name"
            />
            <div
              id="searchResults"
              className={cn(
                "flex flex-col justify-center items-stretch gap-6",
                isBreakpoint ? "mx-0" : "mx-3",
              )}
            >
              <SearchResultsItem
                apiTitleOrName="name"
                itemType="composers"
                showLabel={false}
                pageBreakpoint={composersBreakpoint}
              />
            </div>
          </div>
        ) : (
          <div
            id="search"
            className={cn(
              "flex justify-center gap-x-3 gap-y-6 mx-auto mt-6 w-full",
              isBreakpoint ? "flex-row items-start" : "flex-col items-stretch",
            )}
          >
            <div id="locked" className="flex justify-center items-stretch">
              <div
                id="warning"
                className={cn(
                  'z-10 bg-[url("/lines2.svg")] bg-pmdGrayBright bg-opacity-80 bg-cover bg-no-repeat bg-bottom bg-local mx-3 mt-1 p-2 border border-pmdGray rounded w-full h-max font-bold text-center',
                  isBreakpoint ? "max-w-[304px]" : "max-w-full",
                )}
              >
                <div className="flex flex-col justify-center items-center my-4">
                  <h2 className="animate-text">
                    Unlock <br />
                    Advanced <br />
                    Search
                  </h2>
                  <p className="mt-8 mb-2 font-bold text-pmdGrayDark">
                    Filter by
                  </p>
                  <div className="flex flex-col justify-center items-center gap-2 mb-8 align-middle">
                    <Chip
                      title="Search Term"
                      className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
                    />
                    {/* <Chip title='Era' className='bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium' /> */}
                  </div>
                  <h2 className="animate-text">Free</h2>
                  <p className="font-medium text-pmdGray text-xs">
                    during <em>PMD Plus</em> Early Access
                  </p>
                  <div className="flex flex-col justify-center items-center gap-y-4 mt-8 w-full">
                    <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
                      <a
                        aria-label="Create Free Account"
                        title="Create Free Account"
                        className="flex gap-2 text-2xl button"
                      >
                        Create Account
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="searchResults"
              className={cn(
                "flex flex-col justify-center items-stretch gap-6",
                isBreakpoint ? "mx-0" : "mx-3",
              )}
            >
              <SearchResultsItem
                apiTitleOrName="name"
                itemType="composers"
                showLabel={false}
                pageBreakpoint={composersBreakpoint}
              />
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<
  IComposersPageProps
> = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? "",
    },
  };
};

export default ComposersPage;
