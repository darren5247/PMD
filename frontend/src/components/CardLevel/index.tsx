import { FC } from 'react';
import Link from 'next/link';
import { EUrlsPages } from '@src/constants';
import { IconSearchRed } from '@src/common/assets/icons';
import ImageNext from '@src/components/ImageNext';

interface ICardLevelProps {
  title: string | undefined;
  id: number;
  isSearchable: boolean | null;
};

export const CardLevel: FC<ICardLevelProps> = ({
  title,
  id,
  isSearchable
}): JSX.Element => {
  return (
    <div id={`level${id}`} className='flex flex-col justify-top items-center gap-y-2 bg-white shadow-musicCard px-4 py-[20px] rounded-lg min-w-[250px] text-center'>
      <div className='my-2'>
        <h3 className='flex items-start w-full overflow-hidden font-extrabold text-base leading-[19.5px] lg:leading-[20px] tracking-thigh'>{title}</h3>
      </div>
      {/* {(isSearchable === true) && (
        <p className='mt-3 mb-2'><Link href={`/${EUrlsPages.SEARCH}/?musicWorks[refinementList][level][0]=${encodeURI(title ? title : '')}`}><a className='flex gap-2' title={`Search Level ${id} (${title})`} aria-label={`Search Level ${id} (${title})`}><ImageNext src={IconSearchRed} width={18} height={18} /><strong>Search</strong></a></Link></p>
      )} */}
    </div>
  );
};

export default CardLevel;
