import { FC } from 'react';
import cn from 'classnames';

interface ILayoutProps {
  children?: JSX.Element[] | JSX.Element;
  className?: string;
};

export const Layout: FC<ILayoutProps> = ({
  children,
  className
}): JSX.Element => {
  return (
    <div className={cn('bg-white text-black min-h-screen flex flex-col', className)}>
      {children}
    </div>
  );
};

export default Layout;
