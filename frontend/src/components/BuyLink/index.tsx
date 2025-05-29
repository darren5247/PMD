import { FC } from 'react';
import Link from 'next/link';
import ImageNext from '@src/components/ImageNext';
import { IconBuyBuy } from '@src/common/assets/icons';

interface IBuyLinkProps {
  sellerName: string | undefined;
  itemName: string | undefined;
  url: string | undefined;
  linkText: string | undefined;
  sellerImage: string | undefined;
  sellerImageHeight: number | undefined;
  sellerImageWidth: number | undefined;
};

export const BuyLink: FC<IBuyLinkProps> = ({
  sellerName,
  itemName,
  url,
  linkText,
  sellerImage,
  sellerImageHeight,
  sellerImageWidth
}): JSX.Element => {

  return (
    <div className='flex max-sm:flex-wrap justify-center items-center gap-x-2 shadow-musicCard px-1 py-2 rounded-lg text-center'>
      <div className='shrink-0'>
        <Link href={url ? url : '#'}>
          <a className='flex justify-center items-center text-center' title={itemName ? itemName : 'Buy Now'} target='_blank' rel='noopener noreferrer'>
            <ImageNext
              alt={sellerName ? sellerName : ''}
              src={sellerImage ? sellerImage : IconBuyBuy}
              height={sellerImageHeight ? sellerImageHeight : 40}
              width={sellerImageWidth ? sellerImageWidth : 60}
            />
          </a>
        </Link>
      </div>
      <p className='flex justify-center items-center text-center'><Link href={url ? url : '#'}><a title={itemName ? itemName : 'Buy Now'} target='_blank' rel='noopener noreferrer' className='p-5'><strong>{linkText ? linkText : 'Buy Now'}</strong></a></Link></p>
    </div >
  );
};

export default BuyLink;
