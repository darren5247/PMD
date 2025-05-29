import { FC } from 'react';
import TableRowWork from '@src/components/TableRowWork';
import { IStrapiPieceTable, TUserAttributes } from '@src/types';

interface IWorksDesktopProps {
  works: IStrapiPieceTable[];
  isFavoritePage: boolean;
  onOrderChange?: (listWorkId: number, newOrder: number) => void;
  onRemoveListItem?: (listWorkId: number) => void;
  onRemoveFavoriteItem?: (favoritedWorkId: number, favoriteId: number) => void;
};

const WorksDesktop: FC<IWorksDesktopProps> = ({ works, isFavoritePage, onOrderChange, onRemoveListItem, onRemoveFavoriteItem }): JSX.Element => {
  const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');

  return (
    <div className='border-pmdGrayLight border-r border-l rounded-tl-md rounded-tr-md w-full'>
      <div key='worksTableHeadingRowTop' id='worksTableHeadingRowTop' className='flex flex-row justify-end bg-pmdGrayDark px-4 py-3 rounded-t-md w-full !text-white text-left'>
        <div className='flex flex-row flex-1 gap-4 text-sm align-middle tracking-normal'>
          {accountData.id ? (
            <div className='w-full min-w-[230px] max-w-[230px]'><strong>Title</strong></div>
          ) : (
            <div className='w-full min-w-[230px]'><strong>Title</strong></div>
          )}
          <div className='min-w-[165px] max-w-[165px]'><strong>Composer</strong></div>
          <div className='min-w-[110px] max-w-[110px]'><strong>Level</strong></div>
          <div className='min-w-[100px] max-w-[100px]'><strong>Era</strong></div>
        </div>
      </div>
      {works.map((work) => (
        <TableRowWork
          key={work.id}
          id={work.id}
          title={work.title}
          composers={work.composers}
          level={work.level}
          eras={work.eras}
          notes={work.notes}
          order={work.order}
          listId={work.listId}
          listWorkId={work.listWorkId}
          owner={work.owner}
          user={work.user}
          onOrderChange={onOrderChange}
          onRemoveListItem={onRemoveListItem}
          onRemoveFavoriteItem={onRemoveFavoriteItem}
          isFavoritePage={isFavoritePage}
          isMobile={false}
        />
      ))}
    </div>
  );
};

export default WorksDesktop;
