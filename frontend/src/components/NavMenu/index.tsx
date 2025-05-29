import { FC, useState } from 'react';
import cn from 'classnames';
import { useMediaQuery } from '@src/common/hooks';
import { IconHeaderMenu } from '@src/common/assets/icons';
import ImageNext from '@src/components/ImageNext';
import NavigationDropdown from './components/NavigationDropdown';

interface INavMenuProps {
  className?: string;
  showBackBar?: boolean;
  showLevelBar?: boolean;
  currentUrl?: string;
}

const NavMenu: FC<INavMenuProps> = ({ className, showBackBar, showLevelBar, currentUrl }): JSX.Element => {
  const isXs = useMediaQuery('(max-width: 766px)');
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => setDropdown(!dropdown);

  return (
    <div className='flex gap-x-2 order-2 shrink-0'>
      <a
        title='Menu'
        aria-label='Menu'
        aria-haspopup='true'
        aria-expanded={dropdown}
        aria-controls='navDropdown'
        className={cn(
          `relative flex cursor-pointer items-center text-white no-underline hover:underline focus:no-underline hover:opacity-75 focus:opacity-75`,
          className
        )}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
          }
        }}
        tabIndex={0}
      >
        <span
          className={cn(
            `mr-3 inline h-4 font-extrabold leading-[19.5px] tracking-[.2px] text-white `,
            {
              'hidden ':
                isXs,
            }
          )}
        >
          Menu
        </span>
        <ImageNext src={IconHeaderMenu} alt='' aria-hidden='true' height={34} width={34} />
      </a>
      {dropdown && <NavigationDropdown currentUrl={currentUrl} showBackBar={showBackBar} showLevelBar={showLevelBar} onClose={setDropdown} />}
    </div>
  );
};

export default NavMenu;