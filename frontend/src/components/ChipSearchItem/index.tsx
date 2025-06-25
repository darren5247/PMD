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
        'flex flex-col items-stretch bg-pmdGrayLight shadow-activeFilter w-full text-white align-middle whitespace-nowrap rounded',
        className,
      )}
      {...props}
    >
      <div className='flex flex-row justify-center items-center gap-0 w-full'>
        <div className='flex flex-col justify-center items-stretch gap-2 pb-2 border-pmdGray border-r w-full'>
          <p className='bg-pmdGray p-1 border-pmdGray border-b rounded-tl text-white capitalize align-middle'><strong>{label}</strong></p>
          <p className='flex-grow text-black break-words whitespace-pre-line'>
            {decodeURIComponent(title)}
          </p>
        </div>
        <a
          className='flex justify-center items-stretch bg-pmdGrayLight px-1.5 py-4 cursor-pointer'
          title={label == 'Search Term' ? ('Remove Search: ' + decodeURIComponent(title)) : ('Remove Filter: ' + decodeURIComponent(title))}
          onClick={onReset}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onReset();
            }
          }}
          tabIndex={0}
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
