import { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import ImageNext from '@src/components/ImageNext';
import { EUrlsPages } from '@src/constants';
import { handleTitleWithJustNumber } from '@src/api/helpers';
import { IconGlobeGray, IconLinkGray, IconLockGray } from '@src/common/assets/icons';
import {
  IStrapiList
} from '@src/types';

interface IItemList {
  index?: string;
  list: IStrapiList;
};

const ItemList: FC<IItemList> = ({ index, list }): JSX.Element => {
  return (
    <div key={index ? index : 0} className='flex flex-row justify-center items-center gap-2 text-center align-middle'>
      <Link href={'/' + EUrlsPages.LIST + '/' + encodeURIComponent(handleTitleWithJustNumber(list.attributes.title ? list.attributes.title : '')) + '?id=' + list.attributes.uid}><a title={list.attributes.title} className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-4 border border-pmdGrayBright rounded-md h-fill no-underline transition-all cursor-pointer grow'>
        <div className='flex max-[410px]:flex-col justify-between items-center gap-4 my-auto'>
          <div className='min-[410px]:min-w-60 max-w-60 text-left'>
            <p
              className={cn(
                'font-medium text-pmdRed text-lg max-[410px]:text-center',
                { 'break-all': list.attributes.title.split(' ').some(word => word.length > 8) }
              )}
            >
              {list.attributes.title.length > 20 ? `${list.attributes.title}` : list.attributes.title}
            </p>
          </div>
          <div className='flex flex-row justify-start items-start gap-2 min-[410px]:min-w-[88px] max-w-[88px] text-pmdGray text-sm text-left'>
            {list.attributes.visibility.data ? (
              (list.attributes.visibility.data.id === 1 || list.attributes.visibility.data.id === 2 ? (
                list.attributes.visibility.data.id === 1 ? (
                  <div className='flex justify-center items-center gap-2 align-middle'>
                    <div className='min-w-5 min-h-5'><ImageNext src={IconLinkGray} alt='' height={20} width={20} /></div>
                    <p className='min-w-[60px]'>Unlisted</p>
                  </div>
                ) : (
                  <div className='flex justify-center items-center gap-2 align-middle'>
                    <div className='min-w-5 min-h-5'><ImageNext src={IconLockGray} alt='' height={20} width={20} /></div>
                    <p className='min-w-[60px]'>Private</p>
                  </div>
                )) : (
                <div className='flex justify-center items-center gap-2 align-middle'>
                  <div className='min-w-5 min-h-5'><ImageNext src={IconGlobeGray} alt='' height={20} width={20} /></div>
                  <p className='min-w-[60px]'>Public</p>
                </div>
              ))
            ) : ''}
          </div>
        </div>
      </a></Link>
    </div>
  );
};

export default ItemList;
