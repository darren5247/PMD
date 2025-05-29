import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@src/api/config';
import ImageNext from '@src/components/ImageNext';
import SearchFilterComponentItem from '@src/components/SearchFilterComponentItem';
import { CFilterOptionsElements, IFilterOption } from '@src/constants';
import { IconArrow } from '@src/common/assets/icons';

interface ISearchFiltersItemProps {
    isAnd: boolean;
    currentFilter: string | null;
    isOpen: boolean;
    onClose?: () => void;
};

export const SearchFiltersItem: FC<ISearchFiltersItemProps> = ({
    isAnd,
    currentFilter,
    isOpen,
    onClose
}): JSX.Element => {
    const router = useRouter();
    const { query } = router;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<IFilterOption | null>(null);
    const [facetedFilters, setFacetedFilters] = useState<IFilterOption[] | null>(null);

    const [textQuery, setTextQuery] = useState<string | null>(null);
    const [elementCategoryFilter, setElementCategoryFilter] = useState<string | null>(null);
    const [levelFilter, setLevelFilter] = useState<string | null>(null);

    useEffect(() => {
        // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
        const { category, level, q } = query;

        // Set Filters based on the query params on page load (if any)
        const setFilter = (filterType: string, queryKey: string, fallbackKey: string | null) => {
            const filterValue = query[queryKey] || fallbackKey;
            if (filterValue) {
                switch (filterType) {
                    case 'text':
                        setTextQuery(filterValue as string);
                        break;
                    case 'category':
                        setElementCategoryFilter(filterValue as string);
                        break;
                    case 'level':
                        setLevelFilter(filterValue as string);
                        break;
                    default:
                        break;
                }
            }
        };

        // Check for the NEW filters - overwrites the old filters
        setFilter('text', 'q', q as string);
        setFilter('category', 'element_categories', category as string);
        setFilter('level', 'levels', level as string);
    }, [query]);

    // Fetch data on component mount
    useEffect(() => {
        let andIndex = 0;
        const setCurrentFilter = () => {
            const filtersCurrently =
                // (textQuery ? `&filters[$or][0][works][title][$containsi]=${textQuery}&filters[$or][1][works][composers][name][$containsi]=${textQuery}&filters[$or][2][works][level][title][$containsi]=${textQuery}&filters[$or][3][works][eras][name][$containsi]=${textQuery}` : '') +
                (elementCategoryFilter ? `&filters[$and][${andIndex++}][$or][0][elements][element_categories][name][$eq]=` + elementCategoryFilter : '') +
                (levelFilter ? `&filters[$and][${andIndex++}][$or][0][elements][levels][title][$eq]=` + levelFilter : '')
            return (filtersCurrently && filtersCurrently !== '' ? filtersCurrently : '');
        }

        // Fetch data from the API
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const fetchedFilters: IFilterOption[] = [];
                for (const filterOption of CFilterOptionsElements) {
                    const { data } = await api.get(
                        `${filterOption.apiEndpoint}?pagination[page]=1&fields[0]=id&pagination[pageSize]=1${setCurrentFilter()}&filters[$and][0][works][id][$null]=false`
                    );
                    if (data?.data[0]?.attributes.works.data.length > 0) {
                        fetchedFilters.push(filterOption);
                    }
                    // Update progress bar after each API call by adding filters to the faceted filters
                    setFacetedFilters([...fetchedFilters]);
                }
            } catch (error) {
                console.error('Error fetching filter data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch data only once when the modal is opened
        if (isOpen && facetedFilters === null) {
            if (!isAnd && currentFilter && currentFilter !== '') {
                setSelectedFilter(CFilterOptionsElements.find((option) => option.filterID === currentFilter) || null);
                setFacetedFilters(CFilterOptionsElements.filter((option) => option.filterID == currentFilter));
                setIsLoading(false);
            } else {
                if (
                    (textQuery && textQuery !== '') ||
                    (elementCategoryFilter && elementCategoryFilter !== '') ||
                    (levelFilter && levelFilter !== '')
                ) {
                    // fetchData();
                    setFacetedFilters(CFilterOptionsElements);
                    setIsLoading(false);
                } else {
                    setFacetedFilters(CFilterOptionsElements);
                    setIsLoading(false);
                }
            }
        }
    }, [
        isAnd,
        currentFilter,
        isOpen,
        facetedFilters,
        textQuery,
        elementCategoryFilter,
        levelFilter
    ]);

    // Update the filter and URL
    const selectFilter = (filter: IFilterOption) => {
        setSelectedFilter(filter);
    };

    return (
        <div className='flex flex-col gap-2 w-full text-center'>
            {selectedFilter ? (
                <>
                    <SearchFilterComponentItem
                        isAnd={isAnd}
                        currentFilter={currentFilter || ''}
                        filterName={selectedFilter.filterName}
                        apiEndpoint={selectedFilter.apiEndpoint}
                        apiEndpointFilters={selectedFilter.apiEndpointFilters}
                        apiEndpointPageSize={selectedFilter.apiEndpointPageSize}
                        apiTitleOrName={selectedFilter.apiTitleOrName}
                        apiSort={selectedFilter.apiSort}
                        queryKey={selectedFilter.queryKey}
                        placeholder={selectedFilter.placeholder}
                        onSelect={() => {
                            setSelectedFilter(null);
                            onClose && onClose();
                        }}
                        onBack={() => {
                            setSelectedFilter(null);
                        }}
                    />
                    {!isAnd ? '' : (
                        <a
                            title='Back to All Filters'
                            className='flex justify-center items-center gap-3 px-3 py-3 border border-pmdGrayLight rounded w-full min-w-min text-lg text-center no-underline align-middle cursor-pointer grow'
                            onClick={() => {
                                setSelectedFilter(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedFilter(null);
                                }
                            }}
                            tabIndex={0}
                        >
                            <ImageNext src={IconArrow} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
                            Back to All Filters
                        </a>
                    )}
                </>
            ) : (
                <h2 className='font-bold text-lg'>Choose a Filter</h2>
            )}
            {
                !selectedFilter && facetedFilters ? (
                    (isLoading) ? (
                        <div className='flex flex-col justify-center items-center gap-4 mt-2 w-full h-full'>
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
                            <p className='text-pmdGray text-center italic'>Loading filters...</p>
                            {facetedFilters && (
                                <div className='flex flex-col justify-center items-start gap-0 w-full h-full'>
                                    <div className='bg-pmdRed rounded-full h-1' style={{ width: `${(facetedFilters.length / CFilterOptionsElements.length) * 100}%`, transition: 'width 0.3s linear', transformOrigin: 'right' }}></div>
                                    <p className='text-pmdGray text-xs'>{((facetedFilters.length / CFilterOptionsElements.length) * 100).toFixed(1)}%</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ul id='filterOptions' className='flex flex-col items-stretch gap-4 text-left whitespace-nowrap list-none'>
                            {facetedFilters.map((option, index) => (
                                <li id={'filter' + index.toString() + '-' + option.filterName} key={index} className='flex w-full grow'>
                                    <a
                                        title={'Filter by ' + option.filterName}
                                        className='flex px-2 py-3 border border-pmdGrayLight rounded w-full min-w-min text-pmdGrayDark text-base no-underline cursor-pointer grow'
                                        onClick={() => {
                                            console.log(`Filter option clicked: ${option.filterName}`);
                                            selectFilter(option);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                console.log(`Filter option clicked: ${option.filterName}`);
                                                selectFilter(option);
                                            }
                                        }}
                                        tabIndex={0}
                                    >
                                        {option.filterName}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )
                ) : ((isLoading) && (
                    <div className='flex flex-col justify-center items-center gap-4 mt-2 w-full h-full'>
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
                        <p className='text-pmdGray text-center italic'>Loading filters...</p>
                    </div>
                ))
            }
        </div>
    );
};

export default SearchFiltersItem;
