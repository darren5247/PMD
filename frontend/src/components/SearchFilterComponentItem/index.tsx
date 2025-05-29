import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Divider from '@src/components/Divider';
import api from '@src/api/config';

interface ISearchFilterComponentItemProps {
  isAnd: boolean; // Flag to indicate if the filter is for 'and' or 'or' condition
  currentFilter: string; // Current filter value (e.g., 'elementFilter', 'composerFilter')
  filterName: string; // Name of the filter (e.g., 'Element', 'Composer')
  apiEndpoint: string; // API endpoint to fetch data (e.g., 'elements', 'composers')
  apiEndpointFilters?: string; // Optional filters for the API endpoint
  apiEndpointPageSize?: number; // Optional page size for the API endpoint
  apiTitleOrName?: string; // Optional title or name for the filter label field
  apiSort?: string; // Optional sort parameter for the API endpoint
  queryKey: string; // Query key to update in the URL (e.g., 'element', 'composer')
  placeholder: string; // Placeholder text for the dropdown
  onBack: () => void; // Callback to go back to the previous view
  onSelect: () => void; // Callback when an item is selected
}

const SearchFilterComponentItem: FC<ISearchFilterComponentItemProps> = ({
  isAnd,
  currentFilter,
  filterName,
  apiEndpoint,
  apiEndpointFilters,
  apiEndpointPageSize = 10,
  apiTitleOrName,
  apiSort,
  queryKey,
  placeholder,
  onBack,
  onSelect
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
        const fetchedData = [];
        const { data } = await api.get(
          `${apiEndpoint}?pagination[page]=1${apiEndpointFilters}&pagination[pageSize]=${apiEndpointPageSize}&sort[0]=${apiSort}`,
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
              `${apiEndpoint}?pagination[page]=${i}${apiEndpointFilters}&pagination[pageSize]=${apiEndpointPageSize}&sort[0]=${apiSort}`
            );
            fetchedData.push(...response.data.data);
            const currentPage = response.data.meta.pagination.page;
            setCurrentPage(currentPage);
            const progress = (currentPage / pageCount) * 100;
            const progressElement = document.querySelector('#progressFilter') as HTMLElement | null;
            if (progressElement) {
              progressElement.style.width = `${progress}%`;
            }
          }
        }
        if (apiTitleOrName === 'title') {
          const itemsData = fetchedData.map((item: any) => item.attributes.title);
          setItems(itemsData);
          localStorage.setItem(`${filterName.toLowerCase()}Data`, JSON.stringify(itemsData));
        } else {
          const itemsData = fetchedData.map((item: any) => item.attributes.name);
          setItems(itemsData);
          localStorage.setItem(`${filterName.toLowerCase()}Data`, JSON.stringify(itemsData));
        }
        localStorage.setItem(`${filterName.toLowerCase()}Timestamp`, new Date().getTime().toString());
      } catch (error) {
        console.error(`Error fetching ${filterName.toLowerCase()} data:`, error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if data is cached in localStorage and not older than 5 minutes
    const cachedData = localStorage.getItem(`${filterName.toLowerCase()}Data`);
    const cachedTimestamp = localStorage.getItem(`${filterName.toLowerCase()}Timestamp`);
    const now = new Date().getTime();
    const parsedTimestamp = parseInt(cachedTimestamp || '0', 10);

    if (cachedData && cachedTimestamp && now - parsedTimestamp < 5 * 60 * 1000) {
      // Use cached data if it is less than 5 minutes old
      setItems(JSON.parse(cachedData));
      setIsLoading(false);
      console.log(`Using cached ${filterName.toLowerCase()} data`);
    } else {
      // Fetch new data from the API
      fetchData();
    }
  }, [apiEndpoint, apiEndpointFilters, apiEndpointPageSize, apiTitleOrName, apiSort, filterName]);

  // Update the filter and URL
  const changeFilter = (value: string) => {
    // Update the URL with the new filter
    const updatedQuery = { ...router.query };
    delete updatedQuery[queryKey];
    router.push({
      pathname: router.pathname,
      query: { ...updatedQuery, [queryKey]: value },
    });
    onSelect(); // Call the onSelect callback when a filter is selected

    // // DETECT IF THE FILTER IS FOR 'AND' OR 'OR' CONDITION
    // if (!isAnd) {
    //   // If the filter is for 'or' condition, update the URL with the new filter
    //   const updatedQuery = { ...router.query };
    //   delete updatedQuery[queryKey];
    //   router.push({
    //     pathname: router.pathname,
    //     query: { ...updatedQuery, [queryKey]: value },
    //   });
    //   onSelect(); // Call the onSelect callback when a filter is selected
    // } else {
    //   // If the filter is for 'and' condition, remove the existing filter from the URL
    //   const existingFilter = router.query[queryKey];

    //   const updatedFilter = existingFilter
    //     ? Array.isArray(existingFilter)
    //       ? [...existingFilter, value]
    //       : [existingFilter, value]
    //     : [value];

    //   router.push({
    //     pathname: router.pathname,
    //     query: { ...router.query, [queryKey]: updatedFilter },
    //   });

    //   onSelect(); // Call the onSelect callback when a filter is selected
    // }
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
            <select
              id={queryKey}
              className='flex px-2 py-3 border border-pmdGrayLight rounded max-w-[220px] text-pmdGrayDark text-base no-underline cursor-pointer grow'
              onChange={(e) => changeFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  changeFilter(e.currentTarget.value);
                }
              }}
              tabIndex={0}
            >
              <option value=''>{placeholder}</option>
              {items.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )
      )}
    </div>
  );
};

export default SearchFilterComponentItem;