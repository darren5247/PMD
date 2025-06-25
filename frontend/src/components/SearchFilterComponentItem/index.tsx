import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Divider from '@src/components/Divider';
import api from '@src/api/config';
import { CFilterOptionsItems } from '@src/constants';
import FieldAutocompleteSingle from '@src/components/FieldAutocompleteSingle';

interface ISearchFilterComponentItemProps {
  isAnd: boolean; // Flag to indicate if the filter is for 'and' or 'or' condition
  itemType: string; // Type of item (e.g., 'elements', 'composers')
  itemTypeTitleOrName: string; // Title or Name for the item type
  filterName: string; // Name of the filter (e.g., 'Element', 'Composer')
  apiField: string; // API field to fetch data (e.g., 'element_categories', 'composers')
  apiEndpoint: string; // API endpoint to fetch data (e.g., 'elements', 'composers')
  apiEndpointFilters?: string; // Optional filters for the API endpoint
  apiEndpointPageSize?: number; // Optional page size for the API endpoint
  apiTitleOrName?: string; // Optional title or name for the filter label field
  apiSort?: string; // Optional sort parameter for the API endpoint
  queryKey: string; // Query key to update in the URL (e.g., 'element', 'composer')
  placeholder: string; // Placeholder text for the dropdown
}

const SearchFilterComponentItem: FC<ISearchFilterComponentItemProps> = ({
  isAnd,
  itemType,
  itemTypeTitleOrName,
  filterName,
  apiEndpoint,
  apiField,
  apiEndpointFilters,
  apiEndpointPageSize = 10,
  apiTitleOrName,
  apiSort,
  queryKey,
  placeholder,
}): JSX.Element => {
  const router = useRouter();

  const [items, setItems] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Number | null>(null);
  const [totalPages, setTotalPages] = useState<Number | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Facet filters for all options in CFilterOptionsItems
        // Find the filter options for the current itemType
        const filterOptions = CFilterOptionsItems.find(opt => opt.itemType === itemType);

        // Facet filters for all options in the matched filterOptions
        const facetFilters = filterOptions && filterOptions.filterOptions
          ? filterOptions.filterOptions.map((option: any, index: number) => {
            const queryValue = router.query[option.queryKey];
            if (queryValue && queryValue !== '' && queryValue !== 'undefined' && queryValue !== undefined) {
              return `&filters[$and][${index}][${itemType}][${option.apiField}][${option.apiTitleOrName}][$eq]=${queryValue}`;
            }
            return '';
          }).join('')
          : '';

        // Facet filters using the q or Text Search query
        const textSearchFilter = router.query.q
          ? `&filters[$and][${filterOptions && filterOptions.filterOptions ? filterOptions.filterOptions.length : 0}][${itemType}][${itemTypeTitleOrName}][$containsi]=${router.query.q}`
          : '';

        // Call the API to fetch data
        const fetchedData = [];
        const { data } = await api.get(
          `${apiEndpoint}?pagination[page]=1${apiEndpointFilters}&pagination[pageSize]=${apiEndpointPageSize}&sort[0]=${apiSort}${facetFilters}${textSearchFilter}`,
        );
        fetchedData.push(...data?.data);
        setCurrentPage(data?.meta?.pagination.page);
        setTotalPages(data?.meta?.pagination.pageCount);

        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `${apiEndpoint}?pagination[page]=${i}${apiEndpointFilters}&pagination[pageSize]=${apiEndpointPageSize}&sort[0]=${apiSort}${facetFilters}${textSearchFilter}`
            );
            fetchedData.push(...response.data.data);
            const currentPage = response.data.meta.pagination.page;
            setCurrentPage(currentPage);

            // Calculate the progress percentage
            const progress = (currentPage / pageCount) * 100;
            const progressElement = document.querySelector('#progressFilter') as HTMLElement | null;
            if (progressElement) {
              progressElement.style.width = `${progress}%`;
            }
          }
        }

        // Set the items based on the API response
        if (apiTitleOrName === 'title') {
          const itemsData = fetchedData.map((item: any) => item.attributes.title);
          setItems(itemsData);
        } else {
          const itemsData = fetchedData.map((item: any) => item.attributes.name);
          setItems(itemsData);
        }
      } catch (error) {
        console.error(`Error fetching ${filterName.toLowerCase()} data:`, error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemType, itemTypeTitleOrName, apiEndpoint, apiField, apiEndpointFilters, apiEndpointPageSize, apiTitleOrName, apiSort, filterName, queryKey, router]);

  // Update the filter and URL
  const changeFilter = (value: string) => {
    // Update the URL with the new filter
    const updatedQuery = { ...router.query };
    delete updatedQuery[queryKey];
    router.push({
      pathname: router.pathname,
      query: { ...updatedQuery, [queryKey]: value },
    });
  };

  return (
    <div className='flex flex-col gap-6 text-left'>
      {isLoading ? (
        <>
          <div className='flex flex-col justify-center items-center gap-2 mt-2 min-h-[80px] text-pmdGray text-center italic align-middle'>
            <svg
              aria-hidden='true'
              className='fill-pmdRed w-14 h-14 text-pmdGrayLight animate-spin'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
              <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
            </svg>
            <p>Loading {filterName.toLowerCase()} options...</p>
            {(currentPage && totalPages) ? (
              <div className='flex flex-col justify-center items-start gap-0 w-full h-full'>
                <div id='progressFilter' className='bg-pmdRed rounded-full h-1' style={{ width: `${(Number(currentPage) / Number(totalPages)) * 100}%`, transition: 'width 0.3s linear', transformOrigin: 'right' }}></div>
                <p>{((Number(currentPage) / Number(totalPages)) * 100).toFixed(2)}%</p>
              </div>
            ) : (
              <div className='flex flex-col justify-center items-start gap-0 w-full h-full'>
                <div id='progressFilter' className='bg-pmdRed rounded-full h-1' style={{ width: `1%`, transition: 'width 0.3s linear', transformOrigin: 'right' }}></div>
                <p>1%</p>
              </div>
            )}
          </div>
          <Divider className='!my-2' />
        </>
      ) : (
        items && (
          <div className='flex flex-col gap-1 text-left'>
            <label htmlFor={queryKey}>
              <strong>{filterName}</strong>
            </label>
            <FieldAutocompleteSingle
              name={queryKey}
              value={
                Array.isArray(router.query[queryKey])
                  ? (router.query[queryKey] as string[])[0] || ''
                  : (router.query[queryKey] as string) || ''
              }
              setValue={(val: string) => {
                changeFilter(val);
              }}
              suggestions={items}
              placeholder={placeholder}
              error={undefined}
              hideChips={true}
            />
          </div>
        )
      )}
    </div>
  );
};

export default SearchFilterComponentItem;