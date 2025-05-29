import { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { useMediaQuery } from '@src/common/hooks';
import { useHits } from 'react-instantsearch-hooks-web';
import { instantSearchUIState } from '@src/types';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import SearchPagination from '@src/components/SearchPagination';
import SearchFiltersCurrent from '@src/components/SearchFiltersCurrent';
import { useClearRefinements } from 'react-instantsearch-hooks-web';
import WorksDesktop from '@src/components/WorksDesktop';
import WorksMobile from '@src/components/WorksMobile';
import { IconFilter, IconFilterFull } from '@src/common/assets/icons';
import ImageNext from '@src/components/ImageNext';
import { ITypesensePiece, TUserAttributes } from '@src/types';
import SearchFiltersMobile from '@src/components/SearchFiltersMobile';
import SearchFiltersMobileLocked from '@src/components/SearchFiltersMobileLocked';

const SearchMobile: FC = (): JSX.Element => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { canRefine } = useClearRefinements();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      setUserId(accountData.id);
    };
  }, []);

  let breakpointCalc: string;
  const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
  if (accountData.id) {
    breakpointCalc = '(min-width: 826px)';
  } else {
    breakpointCalc = '(min-width: 786px)';
  };
  const isBreakpoint = useMediaQuery(breakpointCalc);
  const { uiState } = useInstantSearch<instantSearchUIState>();
  const { hits } = useHits<Omit<ITypesensePiece, 'id'> & { id: string }>();

  return (
    <div className='flex flex-col justify-center items-center mt-12 w-full text-center align-middle'>
      {userId ? (
        <div className='flex flex-col justify-center items-center w-full text-center align-middle grow'>
          <div
            className={cn(
              'z-10 flex flex-row flex-wrap gap-x-4 mt-4 pb-4 px-4 w-full items-center justify-center border-b border-pmdGrayLight bg-white shadow-header',
              { 'justify-between': canRefine }
            )}
          >
            <a
              className='flex flex-grow justify-center gap-2 !py-2 w-full cursor-pointer button'
              title='Filters'
              onClick={
                () => {
                  setShowFilters(true)
                }
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowFilters(true);
                }
              }}
              tabIndex={0}
            >
              {canRefine ? (
                <ImageNext
                  src={IconFilter}
                  width={16}
                  height={16}
                />
              ) : (
                <ImageNext
                  src={IconFilterFull}
                  width={16}
                  height={16}
                />
              )}
              Filters
            </a>
            <SearchFiltersMobile
              onClose={
                () => {
                  setShowFilters(false)
                }
              }
              isOpen={showFilters}
            />
          </div>
          <div className='w-[calc(100vw)] max-w-[calc(100vw-2px)]'>
            {(
              uiState?.musicWorks?.refinementList ??
              uiState?.musicWorks?.toggle ??
              uiState?.musicWorks?.excludeRefinementList) && (
                <div className='flex justify-center items-center border-b border-l align-middle tracking-normal'>
                  <SearchFiltersCurrent />
                </div>
              )
            }
          </div>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center w-full text-center align-middle grow'>
          <div
            className={cn(
              'z-10 flex flex-row flex-wrap gap-x-4 mt-4 pb-4 px-4 w-full items-center justify-center border-b border-pmdGrayLight bg-white shadow-header',
              { 'justify-between': canRefine }
            )}
          >
            <a
              className='flex flex-grow justify-center gap-2 !py-2 w-full cursor-pointer button'
              title='Filters'
              onClick={
                () => {
                  setShowFilters(true)
                }
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowFilters(true);
                }
              }}
              tabIndex={0}
            >
              {canRefine ? (
                <ImageNext
                  src={IconFilter}
                  width={16}
                  height={16}
                />
              ) : (
                <ImageNext
                  src={IconFilterFull}
                  width={16}
                  height={16}
                />
              )}
              Filters
            </a>
            <SearchFiltersMobileLocked
              onClose={
                () => {
                  setShowFilters(false)
                }
              }
              isOpen={showFilters}
            />
          </div>
          <div className='w-[calc(100vw)] max-w-[calc(100vw-2px)]'>
            {(
              uiState?.musicWorks?.refinementList ??
              uiState?.musicWorks?.toggle ??
              uiState?.musicWorks?.excludeRefinementList) && (
                <div className='flex justify-center items-center border-b border-l align-middle tracking-normal'>
                  <SearchFiltersCurrent />
                </div>
              )
            }
          </div>
        </div>
      )}
      {isBreakpoint == null ? '' : isBreakpoint ? (
        <div className='flex justify-center mx-auto pt-8'>
          <WorksDesktop
            works={hits.map(hit => ({
              ...hit,
              id: Number(hit.id),
              eras: [hit.era]
            }))}
            isFavoritePage={false}
          />
        </div>
      ) : (
        <div className='flex mx-auto px-3 pt-8'>
          <WorksMobile
            works={hits.map(hit => ({
              ...hit,
              id: Number(hit.id),
              eras: [hit.era]
            }))}
            isFavoritePage={false}
          />
        </div>
      )}
      {hits.length ? <SearchPagination /> :
        <div className='flex justify-center bg-pmdGray mx-[32px] mt-[32px] mb-20 p-[14px] rounded-md text-white text-sm lg:text-xl leading-[29px] tracking-thigh transition-all'>
          <strong>No Results Found!</strong>
        </div>
      }
    </div>
  );
};

export default SearchMobile;
