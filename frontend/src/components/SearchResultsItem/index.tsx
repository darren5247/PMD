import { FC, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import api from "@src/api/config";
import { AppContext } from "@src/state";
import { useMediaQuery } from "@src/common/hooks";
import { EUrlsPages, CItemKeys, IItemKey } from "@src/constants";
import { Oval } from "react-loader-spinner";
import Divider from "@src/components/Divider";
import PaginationItem from "@src/components/PaginationItem";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiElement,
  IStrapiCollection,
  IStrapiComposer,
  IStrapiPublisher,
  TUserAttributes,
} from "@src/types";
import TableItem from "../TableItem";

interface ISearchResultsItemProps {
  itemType: string;
  showLabel: boolean;
  apiTitleOrName: string;
  pageBreakpoint?: string;
}

const SearchResultsItem: FC<ISearchResultsItemProps> = ({
  itemType,
  showLabel,
  apiTitleOrName,
  pageBreakpoint,
}): JSX.Element => {
  const router = useRouter();
  const { query } = router;
  const isBreakpoint = useMediaQuery(
    `(min-width: ${pageBreakpoint ? pageBreakpoint : "1250px"})`,
  );
  const { dispatch } = useContext(AppContext);
  const [userId, setUserId] = useState<number | null>(null);
  const [itemTypeState, setItemTypeState] = useState<IItemKey | null>(null);

  const [results, setResults] = useState<
    | IStrapiElement[]
    | IStrapiCollection[]
    | IStrapiComposer[]
    | IStrapiPublisher[]
  >([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(query.pageSize) && Number(query.pageSize) > 1
      ? Number(query.pageSize)
      : 10,
  );
  const [sort, setSort] = useState<string | null>(null);

  useEffect(() => {
    // Page
    if (query.page) setCurrentPage(Number(query.page as string));

    // Page Size
    if (query.pageSize) setPageSize(Number(query.pageSize as string));
    if (query.size) setPageSize(Number(query.size as string));
    if (query.count) setPageSize(Number(query.count as string));

    // Sort
    if (query.sort) setSort(query.sort as string);

    // Get User ID from Local Storage
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      setUserId(accountData.id);
    }

    // Set Item Type State
    const itemTypeFound = CItemKeys.find((item) => item.value === itemType);
    if (itemTypeFound) {
      setItemTypeState(itemTypeFound);
    } else {
      setItemTypeState(null);
    }

    const getResults = async () => {
      try {
        setIsLoadingResults(true);

        // Create Clean Filter: Sort
        const sortQuery = query.sort;
        let sortQueryClean: string = apiTitleOrName
          ? apiTitleOrName == "name"
            ? "&sort[0]=name:asc"
            : "&sort[0]=title:asc"
          : "&sort[0]=name:asc";
        const sortOptions = itemTypeState?.sortOptions || [];
        if (sortOptions.length > 0) {
          if (sortQuery) {
            const matchingSortOption = sortOptions.find(
              (option) => option.value === sortQuery,
            );
            if (matchingSortOption) {
              sortQueryClean = `&sort[0]=${matchingSortOption.value}`;
            }
          } else {
            sortQueryClean = `&sort[0]=${sortOptions[0].value}`;
          }
        }

        // Create Clean Filter: Text Search
        const textSearchOptions = itemTypeState?.textSearchOptions || [];
        const searchQueryClean = query.q
          ? textSearchOptions
              .map(
                (option, index) =>
                  `&filters[$or][${index}]${option}[$containsi]=${query.q}`,
              )
              .join("")
          : "";

        // Create Clean Filters based on cleanFilterOptions
        const cleanFiltersQuery = itemTypeState?.cleanFiltersOptions
          ? itemTypeState?.cleanFiltersOptions
              .map((option, index) => {
                const filterKey = option.label?.toLowerCase();
                const filterValue = filterKey ? query[filterKey] : null;
                return filterValue
                  ? `&filters[$and][${index}]${option.value}[$eq]=${filterValue}`
                  : "";
              })
              .join("")
          : "";

        // Fetch Results
        const pageSizeClamped = Math.max(
          1,
          Math.min(Number(query.pageSize) || 10, 50),
        );
        const { data } = await api.get(
          `${itemType}?pagination[page]=${currentPage}&pagination[pageSize]=${pageSizeClamped}${sortQueryClean}${itemTypeState?.apiEndpointFilters || CItemKeys.find((item) => item.value === itemType)?.apiEndpointFilters}${cleanFiltersQuery}${searchQueryClean}`,
        );

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
          setResults(data?.data);
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
        setResults([]);
      } finally {
        setIsLoadingResults(false);
      }
    };

    // Get Results
    getResults();
  }, [
    router,
    router.query,
    dispatch,
    currentPage,
    pageSize,
    query,
    userId,
    itemType,
    apiTitleOrName,
    itemTypeState,
  ]);

  return (
    <div className="flex flex-col justify-center items-stretch pt-1 pb-0 w-full h-full align-middle">
      {isLoadingResults ? (
        <div className="flex flex-col justify-center items-center bg-pmdGrayBright p-12 border border-pmdGray rounded-md h-full align-middle">
          <Oval
            height={80}
            width={80}
            color="#7f1d1d"
            wrapperClass="flex items-center justify-center mb-4"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#a8a29e"
          />
          <p className="font-bold text-2xl">Loading...</p>
          <a
            href={`/${itemTypeState?.pageLink || CItemKeys.find((item) => item.value === itemType)?.pageLink}`}
            title="Start a New Search"
            className="mt-12 text-base underline italic cursor-pointer"
          >
            Try a new search
          </a>
        </div>
      ) : results && results.length > 0 && results[0].id ? (
        <div className="flex flex-col justify-center items-center gap-3 text-center align-middle">
          <div className="flex flex-row flex-wrap justify-center items-stretch gap-3 text-center align-middle">
            <TableItem
              label={
                showLabel == true
                  ? itemTypeState?.labelPlural ||
                    CItemKeys.find((item) => item.value === itemType)
                      ?.labelPlural
                  : undefined
              }
              col1Label={
                itemTypeState?.apiTitleOrName
                  ? itemTypeState.apiTitleOrName.charAt(0).toUpperCase() +
                    itemTypeState.apiTitleOrName.slice(1)
                  : CItemKeys.find((item) => item.value === itemType)
                        ?.apiTitleOrName
                    ? CItemKeys.find((item) => item.value === itemType)!
                        .apiTitleOrName.charAt(0)
                        .toUpperCase() +
                      CItemKeys.find(
                        (item) => item.value === itemType,
                      )!.apiTitleOrName.slice(1)
                    : ""
              }
              col2Label={(() => {
                const label = itemTypeState?.cleanFiltersOptions?.[0]?.label;
                if (label === "Era") {
                  if (itemType === "composers" || itemType === "publishers") {
                    return undefined;
                  } else {
                    return label;
                  }
                } else {
                  return label;
                }
              })()}
              col3Label={
                itemTypeState?.cleanFiltersOptions?.[1]?.label ?? undefined
              }
              col4Label={
                itemTypeState?.cleanFiltersOptions?.[2]?.label ?? undefined
              }
              col1Width={itemTypeState?.col1Width}
              col2Width={itemTypeState?.col2Width}
              col3Width={itemTypeState?.col3Width}
              col4Width={itemTypeState?.col4Width}
              pageBreakpoint={pageBreakpoint || "1250px"}
              items={results.map((result) => {
                let itemData;
                switch (itemType) {
                  case "elements":
                    itemData = result as IStrapiElement;
                    return {
                      id: itemData.id,
                      linkURL: `/${EUrlsPages.ELEMENT}/${encodeURIComponent(itemData.attributes.name)}?id=${itemData.id}`,
                      linkAlt: `View Element ${itemData.attributes.name}`,
                      col1: itemData.attributes.name,
                      col2:
                        itemData.attributes.element_categories?.data?.[0]
                          ?.attributes?.name ?? "",
                      col3: itemData.attributes.levels?.data?.[0]?.attributes
                        ?.title
                        ? itemData.attributes.levels?.data?.[0]?.attributes
                            ?.title + (isBreakpoint ? "" : " Level")
                        : "",
                    };
                  case "collections":
                    itemData = result as IStrapiCollection;
                    return {
                      id: itemData.id,
                      linkURL: `/${EUrlsPages.COLLECTION}/${encodeURIComponent(itemData.attributes.title)}?id=${itemData.id}`,
                      linkAlt: `View Collection ${itemData.attributes.title}`,
                      col1: itemData.attributes.title,
                      // col2: itemData.attributes.eras?.data?.[0]?.attributes?.name
                      //   ? (itemData.attributes.eras?.data?.[0]?.attributes?.name + (isBreakpoint ? '' : ' Era'))
                      //   : ''
                    };
                  case "composers":
                    itemData = result as IStrapiComposer;
                    return {
                      id: itemData.id,
                      linkURL: `/${EUrlsPages.COMPOSER}/${encodeURIComponent(itemData.attributes.name)}?id=${itemData.id}`,
                      linkAlt: `View Composer ${itemData.attributes.name}`,
                      col1: itemData.attributes.name,
                      // col2: itemData.attributes.eras?.data?.[0]?.attributes?.name
                      //   ? (itemData.attributes.eras?.data?.[0]?.attributes?.name + (isBreakpoint ? '' : ' Era'))
                      //   : ''
                    };
                  case "publishers":
                    itemData = result as IStrapiPublisher;
                    return {
                      id: itemData.id,
                      linkURL: `/${EUrlsPages.PUBLISHER}/${encodeURIComponent(itemData.attributes.name)}?id=${itemData.id}`,
                      linkAlt: `View Publisher ${itemData.attributes.name}`,
                      col1: itemData.attributes.name,
                      // col2: itemData.attributes.eras?.data?.[0]?.attributes?.name
                      //   ? (itemData.attributes.eras?.data?.[0]?.attributes?.name + (isBreakpoint ? '' : ' Era'))
                      //   : ''
                    };
                  default:
                    return {
                      id: 0,
                      linkURL: "#",
                      linkAlt: "Data Missing",
                      col1: "Data Missing",
                    };
                }
              })}
            />
          </div>
          <PaginationItem
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            sort={sort || ""}
            sortOptions={
              CItemKeys.find((item) => item.value === itemType)?.sortOptions ||
              []
            }
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center bg-pmdGrayBright p-12 border border-pmdGray rounded-md w-full h-full align-middle">
          <p className="mb-6 font-bold text-2xl">No Results Found!</p>
          <Divider className="flex" />
          <p className="mt-6 font-bold text-lg">Tips:</p>
          <p className="mt-1 text-lg">Remove a filter.</p>
          <p className="mt-1 text-lg">Select different filters.</p>
          <p className="mt-1 text-lg">
            <a
              href={`/${itemTypeState?.pageLink || CItemKeys.find((item) => item.value === itemType)?.pageLink}`}
              title="Remove All Filters"
              className="underline cursor-pointer"
            >
              Remove all filters.
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsItem;
