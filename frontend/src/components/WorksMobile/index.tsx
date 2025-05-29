import { FC } from 'react';
import TableRowWork from '@src/components/TableRowWork';
import { IStrapiPieceTable } from '@src/types';

interface IWorksMobileProps {
  works: IStrapiPieceTable[];
  isFavoritePage: boolean;
  onOrderChange?: (listWorkId: number, newOrder: number) => void;
  onRemoveListItem?: (listWorkId: number) => void;
  onRemoveFavoriteItem?: (favoritedWorkId: number, favoriteId: number) => void;
};

const WorksMobile: FC<IWorksMobileProps> = ({ works, isFavoritePage, onOrderChange, onRemoveListItem, onRemoveFavoriteItem }): JSX.Element => {
  return (
    <>
      <div className='border-pmdGrayLight border-x border-t w-full'>
        {works.map((work) =>
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
            isMobile={true}
          />
        )}
      </div>
    </>
  );
};

export default WorksMobile;