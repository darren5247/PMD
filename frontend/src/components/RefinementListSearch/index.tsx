import { FC, MouseEvent, useRef, useState } from 'react';
import cn from 'classnames';
import {
  useRefinementList,
  UseRefinementListProps
} from 'react-instantsearch-hooks-web';
import { useOnEventOutside } from '@src/common/hooks';
import { useExcludeRefinement } from '@src/common/hooks';
import SearchInput from '@src/components/SearchInput';

interface IRefinementListSearchProps extends UseRefinementListProps {
  className?: string;
  placeholder: string;
  title: string;
  showExclude?: boolean;
};

const RefinementListSearch: FC<IRefinementListSearchProps> = ({
  className,
  attribute,
  title,
  placeholder
}): JSX.Element => {
  const ref = useRef(null);
  const [dropdown, setDropdown] = useState(false);

  const { searchForItems, items, refine } = useRefinementList({
    attribute,
    operator: 'and',
    showMore: false,
    limit: 10000,
    sortBy: ['isRefined', 'name:asc']
  });

  const { refine: excludeRefine } = useExcludeRefinement(
    { attribute: 'exclude-elements' },
    { $$widgetType: 'pmd.excludeRefinementList' }
  );

  const handleCloseDropdown = () => {
    setDropdown(false);
  };

  useOnEventOutside(ref, handleCloseDropdown, 'scroll');

  useOnEventOutside(ref, handleCloseDropdown, 'mousedown');

  return (
    <div className={cn(`relative`, className)}>
      <p className='mt-3 lg:mt-0 ml-2 font-extrabold text-sm'>
        {title}
      </p>
      <SearchInput
        placeholder={placeholder}
        onClick={() => {
          setDropdown(true)
        }}
        onChange={(e) => {
          searchForItems(e.currentTarget.value)
        }}
      />
      {dropdown && (
        <ul
          className='top-[100%] left-0 z-10 absolute bg-white shadow-navDropdown rounded w-[305px] lg:w-[260px] max-h-[170px] overflow-y-auto text-base leading-[18px] tracking-[0.01em] list-none scrollbar'
          ref={ref}
        >
          {items.map((item) =>
            item.count ? (
              <li
                className='relative flex items-center hover:bg-pmdGrayLight cursor-pointer'
                onClick={() => {
                  refine(item.value)
                  handleCloseDropdown()
                }}
                key={item.label}
              >
                <a title={item.label} className='px-[10px] py-[10px] !text-pmdGrayDark !no-underline'>
                  <span>{`${item.label}`}</span>
                  <div className='z-10 absolute inset-0 flex justify-end items-center max-lg:bg-opacity-100 lg:opacity-0 hover:opacity-100 duration-300'>
                    <div
                      className='bg-white mr-[10px] cursor-pointer'
                      onClick={(e: MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation()
                        excludeRefine(item.value)
                        handleCloseDropdown()
                      }}
                    >
                      {/* {showExclude?
                    (<span className='inline-block bg-black max-lg:bg-white lg:bg-opacity-5 pl-[5px] w-[50px] text-pmdRed text-xs underline leading-[13px]'><strong>Exclude instead</strong></span>) : null
                    } */}
                    </div>
                  </div>
                </a>
              </li>
            ) : undefined,
          )}
        </ul>
      )}
    </div>
  );
};

export default RefinementListSearch;
