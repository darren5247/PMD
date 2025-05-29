import { FC } from 'react';
import cn from 'classnames';

import ImageNext from '../ImageNext';

import { IconCrossInCircle } from '@src/common/assets/icons';

interface IChipSearchItemProps {
  className?: string;
  id: string;
  label: string;
  title: string;
  onReset: () => void;
};

const ChipSearchItem: FC<IChipSearchItemProps> = ({
  className,
  id,
  label,
  title,
  onReset,
  ...props
}): JSX.Element => {
  return (
    <div
      id={id}
      className={cn(
        'flex flex-col items-stretch bg-pmdGrayLight shadow-activeFilter w-min text-white align-middle whitespace-nowrap',
        className,
      )}
      {...props}
    >
      <p className='bg-pmdGray p-1 rounded-t text-white capitalize align-middle'><strong>{label}</strong></p>
      <div className='flex flex-row justify-center items-stretch gap-0 max-[468px]:py-1 pl-1'>
        <div className='flex flex-row justify-center items-center gap-0'>
          <a
            title={decodeURIComponent(title)}
            className='no-underline'
          >
            <p className='px-1 text-black'>
              {
              label == 'Search Term' ? (
                decodeURIComponent(title).length > 17 ? `${decodeURIComponent(title).substring(0, 17)}...` : decodeURIComponent(title)
              ) : (
                decodeURIComponent(title).length > 12 ? `${decodeURIComponent(title).substring(0, 12)}...` : decodeURIComponent(title)
              )
              }
            </p>
          </a>
        </div>
        <a
          className='flex justify-center items-stretch bg-pmdGrayLight px-1 rounded-b cursor-pointer'
          title={label == 'Search Term' ? ('Remove Search: ' + decodeURIComponent(title)) : ('Remove Filter: ' + decodeURIComponent(title))}
          onClick={onReset}
        >
          <ImageNext
            className='min-w-[14px]'
            src={IconCrossInCircle}
          />
        </a>
      </div>
    </div>
  );
};

export default ChipSearchItem;
