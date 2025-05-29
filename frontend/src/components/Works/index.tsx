import { FC } from 'react';
import { useMediaQuery } from '@src/common/hooks';
import WorksDesktop from '@src/components/WorksDesktop';
import WorksMobile from '@src/components/WorksMobile';
import { IStrapiPieceTable, TUserAttributes } from '@src/types';

interface IWorksProps {
  label?: string | undefined;
  breakpoint?: string | undefined;
  works: IStrapiPieceTable[];
  isFavoritePage?: boolean | undefined;
  onOrderChange?: (listWorkId: number, newOrder: number) => void;
  onRemoveListItem?: (listWorkId: number) => void;
  onRemoveFavoriteItem?: (favoritedWorkId: number, favoriteId: number) => void;
};

const Works: FC<IWorksProps> = ({ label, breakpoint, works, isFavoritePage, onOrderChange, onRemoveListItem, onRemoveFavoriteItem }): JSX.Element => {
  let breakpointCalc: string;
  const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
  if (accountData.id) {
    breakpointCalc = breakpoint ? `(min-width: ${breakpoint})` : '(min-width: 844px)';
  } else {
    breakpointCalc = breakpoint ? `(min-width: ${breakpoint})` : '(min-width: 716px)';
  };
  const isBreakpoint = useMediaQuery(breakpointCalc);

  return (
    <section id='works' className='relative mx-auto w-full'>
      {label && label !== '' && (
        <div className='mt-2 mb-0 ml-2 w-full text-left'>
          <p className='text-stone-400 text-sm'>{label}</p>
        </div>
      )}
      {isBreakpoint === null ? (
        <div className='h-screen'></div>
      ) : isBreakpoint ? (
        <div className='flex justify-center mx-auto w-full'>
          <WorksDesktop
            works={works}
            isFavoritePage={isFavoritePage === true ? true : false}
            onOrderChange={onOrderChange}
            onRemoveListItem={onRemoveListItem}
            onRemoveFavoriteItem={onRemoveFavoriteItem}
          />
        </div>
      ) : (
        <div className='flex mx-auto w-full'>
          <WorksMobile
            works={works}
            isFavoritePage={isFavoritePage === true ? true : false}
            onOrderChange={onOrderChange}
            onRemoveListItem={onRemoveListItem}
            onRemoveFavoriteItem={onRemoveFavoriteItem}
          />
        </div>
      )}
    </section>
  );
};

export default Works;
