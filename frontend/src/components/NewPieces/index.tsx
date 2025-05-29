import { FC } from 'react';
import ContentDivider from '@src/components/ContentDivider';
import { IStrapiPiece } from '@src/types';
import Works from '@src/components/Works';

interface INewPiecesProps {
  newPieces: IStrapiPiece[];
};

export const NewPieces: FC<INewPiecesProps> = ({ newPieces }): JSX.Element => {
  return (
    <>
      {newPieces ? (
        <div id='pieces'>
          <ContentDivider title={'New Pieces'} className='mx-auto mt-20 mb-4 md:max-w-[816px]' />
          <p className='mx-auto mt-3 px-4 md:max-w-[816px] text-center'>
            These are the newest pieces that we have on the site.
          </p>
          <div className='flex flex-row flex-wrap justify-center items-center gap-3 my-4 w-full max-w-[1200px] md:max-w-[816px] text-center align-middle'>
            <div className='mt-5 mb-4 px-1'>
              <Works works={Object.values(newPieces).slice(0, 10).map(piece => ({
                id: piece.id,
                title: piece.attributes.title,
                composers: piece.attributes.composers?.data?.map(composer => composer.attributes.name) || null,
                level: piece.attributes.level?.data?.attributes.title,
                eras: piece.attributes.eras?.data?.map(era => era.attributes.name) || null
              }))} />
            </div>
          </div>
        </div>
      ) : ''}
    </>
  );
};

export default NewPieces;
