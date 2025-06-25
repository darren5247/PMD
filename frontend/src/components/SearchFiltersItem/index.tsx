import { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import ChipSearchItem from '@src/components/ChipSearchItem';
import { useMediaQuery } from '@src/common/hooks';
import { CFilterKeys, CItemKeys, IItemKey, CFilterOptionsItems, IFilterOption } from '@src/constants';
import SearchFormItem from '@src/components/SearchFormItem';
import SearchFilterComponentItem from '@src/components/SearchFilterComponentItem';

interface ISearchFiltersItemProps {
  itemType: string;
  itemTypeTitleOrName: string;
  className?: string;
  mobileBreakpoint: string; // Optional mobile breakpoint e.g. 1250px
  onReset: (filterName?: string) => void; // Callback upon resetting filters, optionally with a filter name
};

const SearchFiltersItem: FC<ISearchFiltersItemProps> = ({ itemType, itemTypeTitleOrName, className, mobileBreakpoint, onReset }): JSX.Element => {
  const router = useRouter();
  const { query } = router;
  const [isLoading, setIsLoading] = useState(true);
  const [facetedFilters, setFacetedFilters] = useState<IFilterOption[] | null>(null);

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(3);

  const isBreakpoint = useMediaQuery(mobileBreakpoint ? `(min-width: ${mobileBreakpoint})` : '(min-width: 1250px)');
  const [isFiltering, setFiltering] = useState<boolean>(true);
  const [isFilteringMultiple, setFilteringMultiple] = useState<boolean>(true);
  const [itemTypeState, setItemTypeState] = useState<IItemKey | null>(null);

  const [textQuery, setTextQuery] = useState<string | null>(null);
  const [elementCategoryFilter, setElementCategoryFilter] = useState<string | string[] | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | string[] | null>(null);
  const [eraFilter, setEraFilter] = useState<string | string[] | null>(null);

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { q, category, level, era } = query;

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
          case 'era':
            setEraFilter(filterValue as string);
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
    setFilter('era', 'eras', era as string);
  }, [query]);

  // Fetch data on component mount
  useEffect(() => {
    if (facetedFilters === null) {
      if (
        (textQuery && textQuery !== '') ||
        (elementCategoryFilter && elementCategoryFilter !== '') ||
        (levelFilter && levelFilter !== '') ||
        (eraFilter && eraFilter !== '')
      ) {
        // fetchData();
        setFacetedFilters(CFilterOptionsItems.filter((item) => {
          if (item.itemType === itemType) {
            return item;
          } else {
            return null;
          }
        }));
        setIsLoading(false);
      } else {
        setFacetedFilters(CFilterOptionsItems.filter((item) => {
          if (item.itemType === itemType) {
            return item;
          } else {
            return null;
          }
        }));
        setIsLoading(false);
      }
    }
  }, [
    itemType,
    facetedFilters,
    textQuery,
    elementCategoryFilter,
    levelFilter,
    eraFilter
  ]);

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { q, category, level, era } = query;

    // Check if any filter is set
    setFiltering(
      !!(
        category ||
        level ||
        era
      )
    );

    // Check if multiple filters are set
    setFilteringMultiple(
      [
        q && q !== '',
        category && category !== '',
        level && level !== '',
        era && era !== ''
      ].filter(Boolean).length > 1
    );

    // Set Item Type State
    const itemTypeFound = CItemKeys.find((item) => item.value === itemType);
    if (itemTypeFound) {
      setItemTypeState(itemTypeFound);
    } else {
      setItemTypeState(null);
    };

    // Set Filters based on the query params on page load (if any)
    const setFilter = (queryKey: string, fallbackKey: string | null) => {
      const filterValue = query[queryKey] || fallbackKey;
      if (filterValue) {
        // Set the filter value based on the filter type
        switch (queryKey) {
          case 'q':
            setTextQuery(filterValue as string);
            break;
          case 'category':
            setElementCategoryFilter(filterValue as string);
            break;
          case 'level':
            setLevelFilter(filterValue as string);
            break;
          case 'era':
            setEraFilter(filterValue as string);
            break;
          default:
            break;
        }
      }
    };

    // Only apply filters relevant to the current itemType
    CFilterKeys.filter(filterKey => filterKey.itemType === itemType).forEach((filterKey) => {
      if (filterKey.filterOptions && Array.isArray(filterKey.filterOptions)) {
        filterKey.filterOptions.forEach((option) => {
          setFilter(option.newKey, query[option.newKey] as string);
        });
      }
    });
  }, [query, itemType]);

  // Reset the text query filter
  const resetText = () => {
    setTextQuery('');
    const { q, ...rest } = router.query;
    router.push({ pathname: router.pathname, query: rest });
    onReset('q'); // Call the onReset callback when this filter is reset
  };

  // Reset SPECIFIC filters using CFilterKeys data
  const resetSpecificFilter = (filterFilter: string, filterPrefix: string, filterOldKey: string, filterNewKey: string, filterValue: string) => {
    const resetFilter = (filter: string | string[] | null, setFilter: (value: string | string[] | null) => void) => {
      if (Array.isArray(filter)) {
        // If the filter is an array, remove the specific filterValue
        const updatedFilter = filter.filter((value) => value !== filterValue);
        setFilter(updatedFilter.length > 0 ? updatedFilter : null);
      } else {
        // If the filter is not an array, set it to null
        setFilter(null);
      }
    };

    switch (filterFilter) {
      case 'elementCategoryFilter':
        resetFilter(elementCategoryFilter, setElementCategoryFilter);
        break;
      case 'levelFilter':
        resetFilter(levelFilter, setLevelFilter);
        break;
      case 'eraFilter':
        resetFilter(eraFilter, setEraFilter);
        break;
      default:
        console.warn(`Unknown filter: ${filterFilter}`);
    }

    const { [filterNewKey]: _, [`${filterPrefix}[${filterOldKey}]`]: __, ...rest } = router.query;
    router.push({ pathname: router.pathname, query: rest });
    onReset(filterNewKey); // Call the onReset callback when this filter is reset
  };

  // Reset ALL filters
  const resetAllFilters = () => {
    setTextQuery('');
    setElementCategoryFilter('');
    setLevelFilter('');
    setEraFilter('');
    onReset(); // Call the onReset callback when all filters are reset

    // Reset all filters in the URL
    router.push({
      pathname: router.pathname,
      query: {}
    })
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY < 0 ? 1 : window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);function renderActiveFilterChips(
  itemType: string,
  elementCategoryFilter: string | string[] | null,
  levelFilter: string | string[] | null,
  eraFilter: string | string[] | null,
  resetSpecificFilter: (
    filterFilter: string,
    filterPrefix: string,
    filterOldKey: string,
    filterNewKey: string,
    filterValue: string
  ) => void
) {
  // Find the filter config for the current itemType
  const filterConfig = CFilterKeys.find(fk => fk.itemType === itemType);
  if (!filterConfig || !Array.isArray(filterConfig.filterOptions)) return null;

  // Only use the child array (filterOptions)
  return filterConfig.filterOptions
    .filter((filterOption) => {
      // Get the value for this filter from state
      let filterValue: string | string[] | null = null;
      switch (filterOption.filter) {
        case 'elementCategoryFilter':
          filterValue = elementCategoryFilter;
          break;
        case 'levelFilter':
          filterValue = levelFilter;
          break;
        case 'eraFilter':
          filterValue = eraFilter;
          break;
        default:
          filterValue = null;
      }
      return filterValue;
    })
    .flatMap((filterOption) => {
      let filterValue: string | string[] | null = null;
      switch (filterOption.filter) {
        case 'elementCategoryFilter':
          filterValue = elementCategoryFilter;
          break;
        case 'levelFilter':
          filterValue = levelFilter;
          break;
        case 'eraFilter':
          filterValue = eraFilter;
          break;
        default:
          filterValue = null;
      }
      if (Array.isArray(filterValue)) {
        return filterValue.map((value) => ({
          ...filterOption,
          value,
        }));
      }
      return [{ ...filterOption, value: filterValue }];
    })
    .map((filterOption, index, array) => (
      <div key={`${filterOption.filter}-${index}`} className='flex flex-col justify-center items-center gap-2 mx-auto w-full text-center'>
        <div className='flex flex-wrap justify-center items-stretch gap-2 mx-auto w-full max-w-[279px] text-center'>
          <ChipSearchItem
            className='flex flex-row justify-center items-stretch gap-0 h-full'
            id={`${filterOption.label.replace(/\s+/g, '')}-${index}`}
            title={filterOption.value || ''}
            label={filterOption.label}
            onReset={() =>
              resetSpecificFilter(
                filterOption.filter,
                filterOption.prefix,
                filterOption.oldKey,
                filterOption.newKey,
                (filterOption.value || '')
              )
            }
          />
        </div>
        {index < array.length - 1 && (
          <div className='flex justify-center items-center mx-auto w-full whitespace-nowrap'>
            <h2 id={'and-' + filterOption.label} className='relative pr-[.3em] pl-[.3em] font-extrabold text-pmdGray text-base min-[380px]:text-lg md:text-xl italic leading-[22px] md:leading-[29px] tracking-[0.1px] min-[380px]:tracking-[0.546667px]'>and</h2>
          </div>
        )}
      </div>
    ));
}

  return (
    <div
      className={cn(
        'px-2 pt-1',
        isBreakpoint && 'sticky flex flex-col gap-4 pb-8 max-w-[320px]',
        !isBreakpoint && 'flex flex-col gap-6',
        show && 'top-28',
        !show && 'top-4'
      )}
    >
      <SearchFormItem pageLink={itemTypeState?.pageLink ? itemTypeState?.pageLink : ''} />
      {(CItemKeys.find(item => item.value === itemType)?.cleanFiltersOptions || []).map((filterOption, idx) => {
        return (
          <div
            key={filterOption.value || idx}
            className={cn(
              'w-full h-full flex flex-col gap-4 p-3 align-middle justify-center items-center bg-pmdGrayBright border border-pmdGray rounded-md',
              className
            )}
          >
            <SearchFilterComponentItem
              isAnd={true}
              itemType={itemType}
              itemTypeTitleOrName={itemTypeTitleOrName}
              filterName={filterOption.label ?? ''}
              apiEndpoint={filterOption.apiEndpoint ?? ''}
              apiField={filterOption.apiEndpoint ?? ''}
              apiEndpointFilters={filterOption.apiEndpointFilters}
              apiEndpointPageSize={filterOption.apiEndpointPageSize}
              apiTitleOrName={filterOption?.apiTitleOrName}
              apiSort={filterOption?.apiSort}
              queryKey={filterOption.label.toLowerCase() ?? ''}
              placeholder={filterOption.label ?? ''}
            />
          </div>
        );
      })}
      {textQuery || isFiltering ? (
        <div
          className={cn(
            'w-full h-full flex flex-col gap-2 p-3 align-middle justify-center items-center bg-pmdGrayBright border border-pmdGray rounded-md',
            className
          )}
        >
          <div className='flex flex-col justify-center items-center gap-4 mx-auto w-full align-middle'>
            <div className='flex flex-col justify-center items-center gap-2 mx-auto w-full align-middle'>
              <h2 className='font-bold text-lg'>Current Filter{isFilteringMultiple ? 's' : ''}</h2>
              <div className='flex flex-col justify-center items-center gap-2 mx-auto w-full text-center'>
                {(textQuery && textQuery.length) && (
                  <div className='flex flex-wrap justify-center items-stretch gap-2 mx-auto w-full max-w-[279px] text-center'>
                    <ChipSearchItem
                      className='flex flex-row justify-center items-stretch gap-0 h-full grow'
                      id='searchterm'
                      title={textQuery}
                      label='Search Term'
                      onReset={resetText}
                    />
                  </div>
                )}
                {!(textQuery && textQuery.length) || isFilteringMultiple && (
                  <div className='flex justify-center items-center mx-auto w-full whitespace-nowrap'>
                    <h2 id='and-searchterm' className='relative pr-[.3em] pl-[.3em] font-extrabold text-pmdGray text-base min-[380px]:text-lg md:text-xl italic leading-[22px] md:leading-[29px] tracking-[0.1px] min-[380px]:tracking-[0.546667px]'>and</h2>
                  </div>
                )}
                {isFiltering ? (
                  <div
                    className={cn(
                      'flex justify-center items-center gap-2 mx-auto w-full text-center',
                      isFiltering ? 'flex-col' : 'flex-row'
                    )}
                  >
                    {(() => {
                      // Find the filter config for the current itemType
                      const filterConfig = CFilterKeys.find(fk => fk.itemType === itemType);
                      if (!filterConfig || !Array.isArray(filterConfig.filterOptions)) return null;

                      // Only use the child array (filterOptions)
                      return filterConfig.filterOptions
                        .filter((filterOption) => {
                          // Get the value for this filter from state
                          let filterValue: string | string[] | null = null;
                          switch (filterOption.filter) {
                            case 'elementCategoryFilter':
                              filterValue = elementCategoryFilter;
                              break;
                            case 'levelFilter':
                              filterValue = levelFilter;
                              break;
                            case 'eraFilter':
                              filterValue = eraFilter;
                              break;
                            default:
                              filterValue = null;
                          }
                          return filterValue;
                        })
                        .flatMap((filterOption) => {
                          let filterValue: string | string[] | null = null;
                          switch (filterOption.filter) {
                            case 'elementCategoryFilter':
                              filterValue = elementCategoryFilter;
                              break;
                            case 'levelFilter':
                              filterValue = levelFilter;
                              break;
                            case 'eraFilter':
                              filterValue = eraFilter;
                              break;
                            default:
                              filterValue = null;
                          }
                          if (Array.isArray(filterValue)) {
                            return filterValue.map((value) => ({
                              ...filterOption,
                              value,
                            }));
                          }
                          return [{ ...filterOption, value: filterValue }];
                        })
                        .map((filterOption, index, array) => (
                          <div key={`${filterOption.filter}-${index}`} className='flex flex-col justify-center items-center gap-2 mx-auto w-full text-center'>
                            <div className='flex flex-wrap justify-center items-stretch gap-2 mx-auto w-full max-w-[279px] text-center'>
                              <ChipSearchItem
                                className='flex flex-row justify-center items-stretch gap-0 h-full'
                                id={`${filterOption.label.replace(/\s+/g, '')}-${index}`}
                                title={filterOption.value || ''}
                                label={filterOption.label}
                                onReset={() =>
                                  resetSpecificFilter(
                                    filterOption.filter,
                                    filterOption.prefix,
                                    filterOption.oldKey,
                                    filterOption.newKey,
                                    (filterOption.value || '')
                                  )
                                }
                              />
                            </div>
                            {index < array.length - 1 && (
                              <div className='flex justify-center items-center mx-auto w-full whitespace-nowrap'>
                                <h2 id={'and-' + filterOption.label} className='relative pr-[.3em] pl-[.3em] font-extrabold text-pmdGray text-base min-[380px]:text-lg md:text-xl italic leading-[22px] md:leading-[29px] tracking-[0.1px] min-[380px]:tracking-[0.546667px]'>and</h2>
                              </div>
                            )}
                          </div>
                        ));
                    })()}
                  </div>
                ) : ''}
              </div>
            </div>
            <div className='flex justify-center items-center align-middle'>
              <a
                title='Remove All Filters'
                className='text-base cursor-pointer'
                onClick={resetAllFilters}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    resetAllFilters();
                  }
                }}
                tabIndex={0}
              >
                {isFilteringMultiple ? (
                  'Remove all filters.'
                ) : (
                  'Remove filter.'
                )}
              </a>
            </div>
          </div>
        </div>
      ) : ''}
    </div>
  );
};

export default SearchFiltersItem;