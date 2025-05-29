import { FC } from 'react';
import cn from 'classnames';

interface IDivider {
  className?: string;
};

const Divider: FC<IDivider> = ({ className }): JSX.Element => {
  return <div className={cn('h-px w-full bg-pmdGrayLight mt-[16px] mb-[16px]', className)} />;
};

export default Divider;
