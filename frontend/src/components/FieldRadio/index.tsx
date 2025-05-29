import React, { forwardRef, useEffect, useState } from 'react';
import Checkbox from '../Checkbox';
import ChipRemovable from '../ChipRemovable';
import cn from 'classnames';

const FieldRadio = forwardRef<HTMLDivElement, any>(({ className, viewAllThreshold, hideViewAll = false, ...props }) => {
  const { setValue, value, suggestions, withoutChips } = props;
  const [isViewAll, setIsViewAll] = useState(false);

  const handleClick = (el: string) => {
    if (value === el) {
      setValue(null);
    } else {
      setValue(el);
    };
  };

  useEffect(() => {
    hideViewAll && setIsViewAll(true);

    if (value && suggestions && suggestions.length > 0) {
      const index = suggestions.indexOf(value);
      if (index >= (viewAllThreshold ? viewAllThreshold : 8)) {
        setIsViewAll(true);
      }
    }
  }, [value, suggestions, hideViewAll, viewAllThreshold]);

  return (
    <div>
      <div className={`flex flex-col gap-2.5 overflow-hidden ${isViewAll ? 'max-h-[100%]' : 'max-h-[192px]'}`}>
        {suggestions &&
          suggestions.slice(0, isViewAll ? suggestions.length : (viewAllThreshold ? viewAllThreshold : 8)).map((el: string, i: number) => (
            <Checkbox
              key={i}
              checkboxLabel={el}
              checked={value === el}
              defaultChecked={value === el}
              onClick={() => handleClick(el)}
              icon={
                <div
                  className={cn(
                    'h-[18px] w-[18px] cursor-pointer rounded-full border-[1.5px] border-pmdGrayLight',
                    { 'border-pmdRed': props?.error }
                  )}
                />
              }
              checkedIcon={
                <div className='flex justify-center items-center bg-pmdRed rounded-full w-[18px] h-[18px] cursor-pointer'>
                  <div className='bg-white rounded-full w-[6px] h-[6px]' />
                </div>
              }
            />
          ))}
      </div>
      {!isViewAll && suggestions?.length > (viewAllThreshold ? viewAllThreshold : 8) && (
        <a
          className='inline w-fit font-extrabold text-sm leading-[17px] tracking-[0.2px] cursor-pointer'
          onClick={() => setIsViewAll(true)}
          title='View All'
        >
          View All
        </a>
      )}
      {value && !withoutChips && (
        <div className='flex flex-wrap gap-2 mt-[15px]'>
          <ChipRemovable key={value} onClose={() => handleClick(value)} title={value} />
        </div>
      )}
    </div>
  );
}
);
FieldRadio.displayName = 'FieldRadio';

export default FieldRadio;
