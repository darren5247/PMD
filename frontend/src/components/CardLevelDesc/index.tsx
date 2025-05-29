import { FC } from 'react';
import Link from 'next/link';
import { EUrlsPages } from '@src/constants';
import { IconSearchRed } from '@src/common/assets/icons';
import ImageNext from '@src/components/ImageNext';
import { handleCleanContent } from '@src/api/helpers';

interface ICardLevelDescProps {
  title: string | undefined;
  description: string | undefined;
  id: number;
  isSearchable: boolean | null;
}

export const CardLevelDesc: FC<ICardLevelDescProps> = ({
  title,
  description,
  id,
  isSearchable
}): JSX.Element => {
  return (
    <div id={`level${id}`} className='pt-6'>
      <div className='flex flex-col justify-center items-center bg-white shadow-musicCard rounded-lg max-w-[800px] text-center'>
        <div className='flex flex-col justify-center items-center gap-y-2 bg-pmdGrayBright px-4 py-5 w-full text-center'>
          <h2 className='text-xl'>Level {id}</h2>
          <h2><strong>{title}</strong></h2>
        </div>
        <div className='flex flex-col px-6 py-5 w-full text-left grow'>
          {description ? (<div
            dangerouslySetInnerHTML={
              {
                __html: handleCleanContent(description)
              }
            }
          />) : ''}
        </div>
        {/* {(isSearchable === true) && (
          <p className='mt-4 mb-10'><Link href={`/${EUrlsPages.SEARCH}/?musicWorks[refinementList][level][0]=${encodeURI(title ? title : '')}`}><a className='flex gap-2' title={`Search Level ${id} (${title})`} aria-label={`Search Level ${id} (${title})`}><ImageNext src={IconSearchRed} width={18} height={18} /><strong>Search {title}</strong></a></Link></p>
        )} */}
      </div>
    </div>
  );
};

export default CardLevelDesc;
