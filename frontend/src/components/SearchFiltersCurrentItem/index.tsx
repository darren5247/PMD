import { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import ModalSearchFiltersItem from '@src/components/Modals/ModalSearchFiltersItem';
import ChipSearchItem from '@src/components/ChipSearchItem';
import { useMediaQuery } from '@src/common/hooks';
import { CFilterKeys, CItemKeys, IItemKey } from '@src/constants';
import SearchFormItem from '@src/components/SearchFormItem';
import SearchFiltersItem from '../SearchFiltersItem';

interface ISearchFiltersCurrentItemProps {
  itemType: string;
  className?: string;
  onReset: (filterName?: string) => void; // Callback upon resetting filters, optionally with a filter name
};

const SearchFiltersCurrentItem: FC<ISearchFiltersCurrentItemProps> = ({ itemType, className, onReset }): JSX.Element => {
  const router = useRouter();
  const { query } = router;

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(3);

  const isBreakpoint = useMediaQuery('(min-width: 1250px)');
  const [showModalSearchFilters, setShowModalSearchFilters] = useState<boolean>(false);
  const [isFiltering, setFiltering] = useState<boolean>(true);
  const [isFilteringMultiple, setFilteringMultiple] = useState<boolean>(true);
  const [isAndFilter, setIsAndFilter] = useState<boolean>(true);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [itemTypeState, setItemTypeState] = useState<IItemKey | null>(null);

  const [textQuery, setTextQuery] = useState<string | null>(null);
  const [elementCategoryFilter, setElementCategoryFilter] = useState<string | string[] | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | string[] | null>(null);

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { q, category, level } = query;

    // Check if any filter is set
    setFiltering(
      !!(
        category ||
        level
      )
    );

    // Check if multiple filters are set
    setFilteringMultiple(
      [
        q && q !== '',
        category && category !== '',
        level && level !== ''
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
          default:
            break;
        }
      }
    };

    // Check for the NEW filters - overwrites the old filters
    CFilterKeys.forEach((filterKey) => {
      setFilter(filterKey.newKey, query[filterKey.newKey] as string);
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
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        'px-2 min-[1250px]:max-w-[332px] min-[1250px]:min-w-[332px] min-[1250px]:max-h-screen min-[1250px]:overflow-y-auto min-[1250px]:pb-8 pt-1',
        isBreakpoint && 'sticky flex flex-col gap-4',
        !isBreakpoint && 'flex flex-col gap-6',
        show && 'top-28',
        !show && 'top-4'
      )}
    >
      <SearchFormItem pageLink={itemTypeState?.pageLink ? itemTypeState?.pageLink : ''} />
      {textQuery || isFiltering ? (
        <div
          className={cn(
            'w-full h-full flex flex-col gap-2 p-3 align-middle justify-center items-center bg-pmdGrayBright border border-pmdGray rounded-md',
            className
          )}
        >
          <div className='flex flex-col justify-center items-center gap-2 mx-auto w-full align-middle'>
            <div className='flex flex-col justify-center items-center gap-2 mx-auto w-full align-middle'>
              <h2 className='font-bold text-lg'>Current Filter{isFilteringMultiple ? 's' : ''}</h2>
              <div
                className='flex flex-col justify-center items-center gap-2 mx-auto mb-2 w-full text-center'
              >
                {(textQuery && textQuery.length) && (
                  <div className='flex flex-wrap justify-center items-center gap-2'>
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
                  <div className='flex justify-center items-center mx-auto my-2 w-full whitespace-nowrap'>
                    <h2 id='and-searchterm' className='relative pr-[.3em] pl-[.3em] font-extrabold text-pmdGray text-base min-[380px]:text-lg md:text-xl italic leading-[22px] md:leading-[29px] tracking-[0.1px] min-[380px]:tracking-[0.546667px]'>and</h2>
                  </div>
                )}
                {isFiltering ? (
                  <div
                    className={cn(
                      'flex justify-center items-center gap-2 mx-auto mb-2 w-full text-center',
                      isFiltering ? 'flex-col' : 'flex-row'
                    )}
                  >
                    {CFilterKeys
                      .filter((filterKey) => {
                        if (!filterKey || filterKey.oldKey === 'query') {
                          return false;
                        }
                        const filterValue = (() => {
                          switch (filterKey.filter) {
                            case 'elementCategoryFilter':
                              return elementCategoryFilter;
                            case 'levelFilter':
                              return levelFilter;
                            default:
                              return null;
                          }
                        })();

                        return filterValue;
                      })
                      .flatMap((filterKey) => {
                        const filterValue = (() => {
                          switch (filterKey.filter) {
                            case 'elementCategoryFilter':
                              return elementCategoryFilter;
                            case 'levelFilter':
                              return levelFilter;
                            default:
                              return null;
                          }
                        })();

                        // If the filter value is an array, return each value separately
                        if (Array.isArray(filterValue)) {
                          return filterValue.map((value) => ({
                            ...filterKey,
                            value,
                          }));
                        }

                        // Otherwise, return the single value
                        return [{ ...filterKey, value: filterValue }];
                      })
                      .map((filterKey, index, array) => (
                        <div key={`${filterKey.filter}-${index}`} className='flex flex-col items-center gap-2 w-full'>
                          <div className='flex flex-row justify-center items-center gap-2'>
                            <ChipSearchItem
                              className='flex flex-row justify-center items-stretch gap-0 h-full'
                              id={`${filterKey.label.replace(/\s+/g, '')}-${index}`}
                              title={filterKey.value || ''}
                              label={filterKey.label}
                              onReset={() =>
                                resetSpecificFilter(
                                  filterKey.filter,
                                  filterKey.prefix,
                                  filterKey.oldKey,
                                  filterKey.newKey,
                                  (filterKey.value || '')
                                )
                              }
                            />
                          </div>
                          {index < array.length - 1 && (
                            <div className='flex justify-center items-center mx-auto my-2 w-full whitespace-nowrap'>
                              <h2 id={'and-' + filterKey.label} className='relative pr-[.3em] pl-[.3em] font-extrabold text-pmdGray text-base min-[380px]:text-lg md:text-xl italic leading-[22px] md:leading-[29px] tracking-[0.1px] min-[380px]:tracking-[0.546667px]'>and</h2>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : ''}
              </div>
            </div>
            {isFilteringMultiple && (
              <div className='flex justify-center items-center mt-3 align-middle'>
                <a
                  title='Reset All Filters'
                  className='text-base cursor-pointer'
                  onClick={resetAllFilters}
                >
                  Reset all filters.
                </a>
              </div>
            )}
          </div>
        </div>
      ) : ''}
      <div
        className={cn(
          'w-full h-full flex flex-col gap-2 p-3 align-middle justify-center items-center bg-pmdGrayBright border border-pmdGray rounded-md',
          className
        )}
      >
        <SearchFiltersItem
          isAnd={true}
          currentFilter={currentFilter}
          isOpen={true}
        />
      </div>
      <ModalSearchFiltersItem
        isAnd={isAndFilter}
        currentFilter={currentFilter}
        onClose={() => { setShowModalSearchFilters(false); }}
        isOpen={showModalSearchFilters}
      />
    </div>
  );
};

export default SearchFiltersCurrentItem;