import { FC, useState, useEffect } from 'react';
import { useHits } from 'react-instantsearch-hooks-web';
import { instantSearchUIState } from '@src/types';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import SearchPagination from '@src/components/SearchPagination';
import SearchFiltersCurrent from '@src/components/SearchFiltersCurrent';
import SearchFiltersDesktop from '@src/components/SearchFiltersDesktop';
import SearchFiltersDesktopLocked from '@src/components/SearchFiltersDesktopLocked';
import WorksDesktop from '@src/components/WorksDesktop';
import { ITypesensePiece, TUserAttributes } from '@src/types';

const SearchDesktop: FC = (): JSX.Element => {
  const { uiState } = useInstantSearch<instantSearchUIState>();
  const { hits } = useHits<Omit<ITypesensePiece, 'id'> & { id: string }>();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      setUserId(accountData.id);
    };
  }, []);

  return (
    <div className='flex flex-row mt-12'>
      {userId ? (
        <SearchFiltersDesktop />
      ) : (
        <SearchFiltersDesktopLocked />
      )}
      <div className='p-4'>
        {(
          uiState?.musicWorks?.refinementList ??
          uiState?.musicWorks?.toggle ??
          uiState?.musicWorks?.excludeRefinementList) && (
            <div className='flex items-center mr-4 pb-0.5 max-w-[644px] min-[1360px]:max-w-[736px] align-middle tracking-normal'>
              <SearchFiltersCurrent />
            </div>
          )
        }
        <WorksDesktop
          works={hits.map(hit => ({
            ...hit,
            id: Number(hit.id),
            eras: [hit.era]
          }))}
          isFavoritePage={false}
        />
        {hits.length ? <SearchPagination /> :
          <div className='flex justify-center bg-pmdGray mx-[32px] mt-[32px] mb-20 p-[14px] rounded-md text-white text-sm lg:text-xl leading-[29px] tracking-thigh transition-all'>
            <strong>{'No Results Found!'}</strong>
          </div>
        }
      </div>
    </div>
  );
};

export default SearchDesktop;
