import { FC, useEffect } from 'react';
import cn from 'classnames';
import {
  ClearRefinements,
  useInstantSearch
} from 'react-instantsearch-hooks-web';
import { useExcludeRefinement } from '@src/common/hooks';
import SearchFiltersCurrent from '@src/components/SearchFiltersCurrent';
import Modal from '@src/components/Modal';
import RefinementList from '@src/components/RefinementList';
import RefinementListSearch from '@src/components/RefinementListSearch';
import ToggleRefinement from '@src/components/ToggleRefinement';
import { instantSearchUIState } from '@src/types';
import ImageNext from '@src/components/ImageNext';
import { IconFilterRed } from '@src/common/assets/icons';
import Divider from '@src/components/Divider';
import SearchForm from '@src/components/SearchForm';

interface ISearchFiltersMobileProps {
  isOpen: boolean;
  onClose: () => void;
};

const SearchFiltersMobile: FC<ISearchFiltersMobileProps> = ({
  isOpen,
  onClose
}): JSX.Element => {
  const { uiState } = useInstantSearch<instantSearchUIState>();
  const { clearAll } = useExcludeRefinement(
    { attribute: 'exclude-elements' },
    { $$widgetType: 'pmd.excludeRefinementList' }
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  return (
    <Modal
      onClose={onClose}
      isOpen={true}
      clickOutsideEnabled={true}
      layoutClassName={cn(
        'w-full max-h-full mx-[20px] max-w-[335px]',
        !isOpen && 'hidden invisible'
      )}
      overlayClassName={cn(
        'lg:hidden !justify-end fixed !items-start w-screen !p-0',
        !isOpen && 'hidden invisible'
      )}
      crossClassName='w-10 h-10 top-2 right-2'
    >
      <div className='flex gap-2 py-4 pr-12 pl-5'>
        <ImageNext src={IconFilterRed} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
        <p className='pt-1 text-pmdGrayDark'><strong>Filters</strong></p>
      </div>
      <div className='pt-4 border-pmdGrayLight border-t max-h-screen overflow-scroll text-black scrollbar'>
        {(
          uiState?.musicWorks?.refinementList ??
          uiState?.musicWorks?.toggle ??
          uiState?.musicWorks?.excludeRefinementList) && (
            <div className='flex items-center mx-auto mt-2 mb-4 border-pmdGrayLight border-y w-full text-sm tracking-normal'>
              <SearchFiltersCurrent />
            </div>
          )}
        <div className='flex flex-col px-4'>
          <div className='flex flex-col justify-start items-start align-middle'>
            <span className='ml-2 font-extrabold text-sm'>Search</span>
            <SearchForm className='!mx-0 mt-2' />
          </div>
          <Divider className='!mt-6 !mb-1' />
          <RefinementListSearch showExclude attribute='elements' placeholder='Pedagogical concepts' title='Search by Element' />
          <Divider className='!mt-6 !mb-1' />
          <RefinementListSearch className='mt-[10px]' attribute='name' placeholder='Composer name' title='Search by Composer' />
          <Divider className='!mt-6 !mb-1' />
          <RefinementListSearch className='mt-[10px]' attribute='collections' placeholder='Collection title' title='Search by Collection' />
          <Divider className='!mt-6 !mb-1' />
          <RefinementList
            attribute='level'
            title='Difficulty Level'
            type='checkbox'
          />
          <RefinementList
            attribute='era'
            title='Era'
            type='checkbox'
          />
          <RefinementListSearch
            className='mt-[10px]'
            attribute='moods'
            title='Mood'
            placeholder='Mood'
          />
          <RefinementListSearch
            className='mt-[10px]'
            attribute='styles'
            title='Style'
            placeholder='Style'
          />
          <RefinementListSearch
            className='mt-[10px]'
            attribute='themes'
            title='Theme'
            placeholder='Theme'
          />
          <RefinementList
            attribute='holiday'
            title='Holiday'
            type='checkbox'
          />
          <RefinementList
            attribute='instrumentation'
            title='Instrumentation'
            type='checkbox'
          />
          <RefinementList
            attribute='student_ages'
            title='Student Age'
            type='checkbox'
          />
          <RefinementList
            attribute='student_types'
            title='Student Type'
            type='checkbox'
          />
          <RefinementList
            attribute='key_signatures'
            title='Key Signature'
            type='checkbox'
          />
          <RefinementList
            attribute='time_signatures'
            title='Time Signature'
            type='checkbox'
          />
          <RefinementListSearch
            className='mt-[10px]'
            attribute='publisher'
            title='Search by Publisher'
            placeholder='Publisher name'
          />
          <div className='relative flex flex-col gap-y-1 mx-2 mt-6 pb-6 border-pmdGray border-b text-sm'>
            <span className='relative w-fit font-extrabold'>Extras</span>
            <div className='flex flex-col'>
              <ToggleRefinement
                attribute='has_teacher_duet'
                label='Has Teacher Duet'
                type='checkbox'
              />
              <ToggleRefinement
                attribute='has_lyrics'
                label='Has Lyrics'
                type='checkbox'
              />
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center mx-auto py-6 w-full align-middle'>
          <div className='flex flex-row justify-center items-center gap-x-2 align-middle'>
            <a title='Reset All Filters' className='text-sm'>
              <ClearRefinements
                classNames={{
                  button: 'button !px-4 !py-2 text-sm cursor-pointer',
                  disabledButton: 'opacity-30',
                }}
                translations={{
                  resetButtonText: 'Reset All Filters',
                }}
                onClickCapture={clearAll}
              />
            </a>
            <a
              title='Save Filters and Close Menu'
              className='!px-4 !py-2 text-sm cursor-pointer button'
              onClick={() => {
                window.scrollTo(0, 0)
                onClose()
              }}
            >
              Save & Close
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchFiltersMobile;
