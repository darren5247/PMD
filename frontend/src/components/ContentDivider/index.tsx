import { FC } from 'react';
import cn from 'classnames';
import Divider from '@src/components/Divider';

interface IContentDivider {
  title?: string;
  className?: string;
};

const ContentDivider: FC<IContentDivider> = ({
  title,
  className
}): JSX.Element => {
  return (
    <div className={cn(`flex w-full items-center`, className)}>
      <Divider className='bg-pmdGrayLight mt-[16px] w-full h-px' />
      <h2 id={title} className='relative pr-[.3em] pl-[.3em] font-extrabold text-pmdGray text-base min-[380px]:text-lg md:text-2xl leading-[22px] md:leading-[29px] tracking-[0.1px] min-[380px]:tracking-[0.546667px] whitespace-nowrap'>
        {title}
      </h2>
      <Divider className='bg-pmdGrayLight mt-[16px] w-full h-px' />
    </div>
  );
};

export default ContentDivider;
