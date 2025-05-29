import { FC } from 'react';
import ContentDivider from '@src/components/ContentDivider';
import CardPiece from '@src/components/CardPiece';
import { IStrapiPiece } from '@src/types';

interface IFeaturedPieceProps {
  featuredPieces: IStrapiPiece[] | null
}

export const FeaturedPiece: FC<IFeaturedPieceProps> = ({ featuredPieces }): JSX.Element => {
  return (
    <>
      {featuredPieces ? (
        <>
          {Object.values(featuredPieces).map((featuredPiece) => (
            <div key={`FeaturedPiece-${featuredPiece.id}`} id={`FeaturedPiece-${featuredPiece.id}`}>
              <ContentDivider title={'Featured Piece'} className='mx-auto mt-20 mb-4 md:max-w-[816px]' />
              <p className='mx-auto mt-3 px-4 md:max-w-[816px] text-center'>
                {`${featuredPiece.attributes.isFeatured}`}
              </p>
              <div className='flex justify-center items-center mx-2 mt-5 mb-4 text-center'>
                <CardPiece
                  key={`FeaturedPiece-${featuredPiece.id}`}
                  piece={featuredPiece}
                  hideLabel={true}
                />
              </div>
            </div>
          ))}
        </>
      ) : ''}
    </>
  );
};

export default FeaturedPiece;
