import { FC } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
import { IconOpen, IconSearchRed } from '@src/common/assets/icons';
import ImageNext from '@src/components/ImageNext';
import ImagePicture from '@src/components/ImagePicture';
import { EUrlsPages } from '@src/constants';

interface ICardElementProps {
  name: string | undefined;
  desc: string | undefined;
  cat: string | undefined;
  illustrationWidth: number | undefined;
  illustrationHeight: number | undefined;
  illustrationURL: string | StaticImageData | undefined;
  id: number | undefined;
  hideSearch?: boolean;
  hideLabel?: boolean;
};

export const CardElement: FC<ICardElementProps> = ({
  name,
  desc,
  cat,
  illustrationWidth,
  illustrationHeight,
  illustrationURL,
  id,
  hideSearch,
  hideLabel
}): JSX.Element => {
  return (
    <div id={`${id}-${name}`} className='flex flex-col justify-center items-center gap-y-2 bg-white shadow-elementCard pb-4 rounded-lg max-w-[252px] text-center'>
      {!hideLabel && (
        <div className='bg-pmdGrayBright py-2 rounded-t-lg w-full text-pmdGray text-sm'><p>Element</p></div>
      )}
      <div
        className={cn('mb-2 flex flex-col justify-center items-center text-center ',
          {
            'mt-6': hideLabel
          },
          {
            'mt-2': !hideLabel
          }
        )}
      >
        <h3 className='flex justify-center items-center px-4 min-h-[96px] !text-2xl text-center'><strong>{name}</strong></h3>
        {illustrationURL && (
          <ImagePicture
            alt={`Image of the ${name} element`}
            width={illustrationWidth}
            height={illustrationHeight}
            src={typeof illustrationURL === 'string' ? illustrationURL : illustrationURL?.src}
            className='w-[calc(100%-20px)]'
          />
        )}
        {cat ? (<p className='flex justify-center items-center mt-1.5 mb-1 px-3 min-h-[42px] max-h-[42px] overflow-y-auto text-sm leading-[21px]'>
          <strong><em>{cat}</em></strong>
        </p>) : ''}
        {desc ? (<p className='flex mb-1 px-3 min-h-[135px] max-h-[135px] overflow-y-auto text-sm leading-[21px]'>
          {desc}
        </p>) : ''}
        {name ? (
          <div className='flex gap-2 mt-3 mb-2'>
            {/* {!hideSearch && (
              <>
                <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][elements][0]=${encodeURIComponent(name)}`}><a className='flex gap-2' title={`Search ${name}`} aria-label={`Search ${name}`}><ImageNext src={IconSearchRed} width={18} height={18} /><strong>Search</strong></a></Link>
                <span className='px-2 text-pmdGray'>|</span>
              </>
            )} */}
            <Link href={`/${EUrlsPages.ELEMENT}/${encodeURIComponent(name)}?id=${id}`}><a className='flex gap-2' title={`View ${name}`} aria-label={`View ${name}`}><ImageNext src={IconOpen} width={18} height={18} /><strong>View</strong></a></Link>
          </div>
        ) : ''}
      </div>
    </div>
  );
};

export default CardElement;
