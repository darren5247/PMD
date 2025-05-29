import { FC, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '@src/api/config';
import { AppContext } from '@src/state';
import { CItemKeys, IItemKey } from '@src/constants';
import { Oval } from 'react-loader-spinner';
import Divider from '@src/components/Divider';
import PaginationItem from '@src/components/PaginationItem';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiElement,
  TUserAttributes
} from '@src/types';
import CardElement from '../CardElement';

interface ISearchResultsProps {
  itemType: string;
  className?: string;
};

const SearchResults: FC<ISearchResultsProps> = ({ itemType, className }): JSX.Element => {
  const router = useRouter();
  const { query } = router;
  const { dispatch } = useContext(AppContext);
  const [userId, setUserId] = useState<number | null>(null);
  const [itemTypeState, setItemTypeState] = useState<IItemKey | null>(null);

  const [results, setResults] = useState<IStrapiElement[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(Number(query.pageSize) && Number(query.pageSize) > 1 ? Number(query.pageSize) : 10);
  const [sort, setSort] = useState<string | null>(null);

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { page, pageSize, size, count, sort } = query;

    // Page
    if (page) setCurrentPage(Number(page as string));

    // Page Size
    if (pageSize) setPageSize(Number(pageSize as string));
    if (size) setPageSize(Number(size as string));
    if (count) setPageSize(Number(count as string));

    // Sort
    if (sort) setSort(sort as string);
  }, [query, currentPage, pageSize]);

  useEffect(() => {
    // Get User ID from Local Storage
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      setUserId(accountData.id);
    };

    // Set Item Type State
    const itemTypeFound = CItemKeys.find((item) => item.value === itemType);
    if (itemTypeFound) {
      setItemTypeState(itemTypeFound);
    } else {
      setItemTypeState(null);
    };

    const getResults = async () => {
      try {
        setIsLoadingResults(true);

        // Create Clean Filter: Sort
        const sortQuery = query.sort;
        let sortQueryClean: string = '&sort[0]=name:asc';
        const sortOptions = itemTypeState?.sortOptions || CItemKeys.find((item) => item.value === itemType)?.sortOptions || [];
        if (sortQuery && sortOptions.length > 0) {
          const matchingSortOption = sortOptions.find((option) => option.value === sortQuery);
          if (matchingSortOption) {
            sortQueryClean = `&sort[0]=${matchingSortOption.value}`;
          };
        };

        // Create Clean Filter: Text Search
        const textSearchOptions = itemTypeState?.textSearchOptions || CItemKeys.find((item) => item.value === itemType)?.textSearchOptions || [];
        const searchQueryClean = query.q
          ? textSearchOptions
            .map((option, index) => `&filters[$or][${index}]${option}[$containsi]=${query.q}`)
            .join('')
          : '';

        // Create Clean Filters based on cleanFilterOptions
        const cleanFiltersQuery = itemTypeState?.cleanFiltersOptions
          ? itemTypeState?.cleanFiltersOptions
            .map((option, index) => {
              const filterKey = option.label?.toLowerCase();
              const filterValue = filterKey ? query[filterKey] : null;
              return filterValue ? `&filters[$and][${index}]${option.value}[$eq]=${filterValue}` : '';
            })
            .join('')
          : '';

        // Fetch Results
        const { data } = await api.get(
          `${itemType}?pagination[page]=${currentPage}&pagination[pageSize]=${(pageSize && pageSize != 0 && pageSize > 1 && pageSize < 51) ? pageSize : 10}${sortQueryClean}${itemTypeState?.apiEndpointFilters || CItemKeys.find((item) => item.value === itemType)?.apiEndpointFilters}${cleanFiltersQuery}${searchQueryClean}`
        );

        // Redirect to last page if current page is greater than total pages
        if (data?.meta?.pagination?.pageCount < currentPage && data?.meta?.pagination?.pageCount > 0) {
          setCurrentPage(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
          router.push({
            pathname: router.pathname,
            query: { ...router.query, page: data.meta.pagination.pageCount }
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
              type: ENotificationTypes.ERROR
            }
          });
        };
        setResults([]);
      } finally {
        setIsLoadingResults(false);
      };
    };

    const getResultsLoggedOut = async () => {
      try {
        setIsLoadingResults(true);

        // Create Clean Filter: Sort
        const sortQuery = query.sort;
        let sortQueryClean: string = '&sort[0]=name:asc';
        const sortOptions = itemTypeState?.sortOptions || CItemKeys.find((item) => item.value === itemType)?.sortOptions || [];
        if (sortQuery && sortOptions.length > 0) {
          const matchingSortOption = sortOptions.find((option) => option.value === sortQuery);
          if (matchingSortOption) {
            sortQueryClean = `&sort[0]=${matchingSortOption.value}`;
          };
        };

        // Fetch Results
        const { data } = await api.get(
          `${itemType}?pagination[page]=1&pagination[pageSize]=${(pageSize && pageSize != 0 && pageSize > 1 && pageSize < 51) ? pageSize : 10}${sortQueryClean}${itemTypeState?.apiEndpointFilters || CItemKeys.find((item) => item.value === itemType)?.apiEndpointFilters}`
        );

        // Redirect to last page if current page is greater than total pages
        if (data?.meta?.pagination?.pageCount < currentPage && data?.meta?.pagination?.pageCount > 0) {
          setCurrentPage(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
          router.push({
            pathname: router.pathname,
            query: { ...router.query, page: data.meta.pagination.pageCount }
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
              type: ENotificationTypes.ERROR
            }
          });
        };
        setResults([]);
      } finally {
        setIsLoadingResults(false);
      };
    };

    if (userId !== null) {
      getResults();
    } else {
      getResultsLoggedOut();
    }
  }, [router, router.query, dispatch, currentPage, pageSize, query, userId, itemType, itemTypeState]);

  return (
    <div className='flex flex-col justify-center items-stretch pt-1 pb-0 w-full h-full align-middle'>
      {isLoadingResults ? (
        <div className='flex flex-col justify-center items-center bg-pmdGrayBright p-12 border border-pmdGray rounded-md h-full align-middle'>
          <Oval
            height={80}
            width={80}
            color='#7f1d1d'
            wrapperClass='flex items-center justify-center mb-4'
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#a8a29e'
          />
          <p className='font-bold text-2xl'>Loading...</p>
          <a
            href={`/${itemTypeState?.pageLink || CItemKeys.find((item) => item.value === itemType)?.pageLink}`}
            title='Start a New Search'
            className='mt-12 text-base underline italic cursor-pointer'
          >
            Try a new search
          </a>
        </div>
      ) : (
        (results && results.length > 0 && results[0].id) ? (
          <div className='flex flex-col justify-center items-center gap-3 text-center align-middle'>
            <div className='flex flex-row flex-wrap justify-center items-stretch gap-3 text-center align-middle'>
              {results.map((result) => (
                <CardElement
                  key={`${itemType}Item-${result.id}`}
                  name={result.attributes.name}
                  desc={result.attributes.description}
                  cat={result.attributes.element_categories.data?.[0]?.attributes.name ?? ''}
                  illustrationWidth={result.attributes.illustration.data?.attributes.width}
                  illustrationHeight={result.attributes.illustration.data?.attributes.height}
                  illustrationURL={result.attributes.illustration.data?.attributes.url}
                  id={result.id}
                  hideSearch={false}
                  hideLabel={true}
                />
              ))}
            </div>
            <PaginationItem
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              sort={sort || ''}
              sortOptions={
                CItemKeys.find((item) => item.value === itemType)?.sortOptions || []
              }
            />
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center bg-pmdGrayBright p-12 border border-pmdGray rounded-md w-full h-full align-middle'>
            <p className='mb-6 font-bold text-2xl'>No Results Found!</p>
            <Divider className='flex' />
            <p className='mt-6 font-bold text-lg'>Tips:</p>
            <p className='mt-1 text-lg'>Remove a filter.</p>
            <p className='mt-1 text-lg'>Select different filters.</p>
            <p className='mt-1 text-lg'><a
              href={`/${itemTypeState?.pageLink || CItemKeys.find((item) => item.value === itemType)?.pageLink}`}
              title='Reset All Filters'
              className='underline cursor-pointer'
            >
              Reset all filters.
            </a></p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;