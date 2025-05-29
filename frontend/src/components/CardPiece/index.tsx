import { FC } from 'react';
import Link from 'next/link';
import ImageNext from '@src/components/ImageNext';
import ImagePicture from '@src/components/ImagePicture';
import { EUrlsPages } from '@src/constants';
import { IStrapiPiece, IStrapiComposer } from '@src/types';
import { IconOpen } from '@src/common/assets/icons';
import { handleTitleWithJustNumber } from '@src/api/helpers';

interface ICardPieceProps {
  piece: IStrapiPiece;
  hideLabel?: boolean;
};

export const CardPiece: FC<ICardPieceProps> = ({ piece, hideLabel }): JSX.Element => {
  let workComposers: string | undefined;
  let workComposersRaw: IStrapiComposer[];
  if (piece.attributes.composers?.data) {
    workComposers = '';
    workComposersRaw = piece.attributes.composers?.data;
    workComposersRaw.forEach(composer => {
      if (workComposers) {
        if (workComposersRaw.length == 2) {
          workComposers = workComposers + ' and ' + composer.attributes.name;
        } else {
          workComposers = workComposers + ', ' + composer.attributes.name;
        }
      } else {
        workComposers = composer.attributes.name;
      }
    });
  }
  else { workComposers = ''; };

  if (piece) {
    if (piece.attributes.composers.data?.length) {
      piece.attributes.composers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name)
          return -1;
        if (a.attributes.name > b.attributes.name)
          return 1;
        return 0;
      })
    }
  }

  let titleSaved: string | undefined;
  let workTitleDisplay: string | undefined;
  let workTitleEncoded: string | undefined;
  let workURL: string | undefined;
  if (piece.attributes.title) {
    titleSaved = piece.attributes.title;
    workTitleDisplay = titleSaved + 'by ' + workComposers;
    workTitleEncoded = encodeURIComponent(handleTitleWithJustNumber(titleSaved)) + '-' + encodeURIComponent(workComposers);
    workURL = '/' + EUrlsPages.WORK + '/' + workTitleEncoded + '?id=' + piece.id;
  }
  else { titleSaved = ''; workTitleDisplay = ''; workTitleEncoded = ''; workURL = ''; };

  return (
    <div className='flex flex-col justify-center items-center gap-y-2 bg-white shadow-musicCard pb-4 rounded-lg min-w-[280px] max-w-[500px] text-center'>
      {!hideLabel && (
        <div className='bg-pmdGrayBright py-2 rounded-t-lg w-full text-pmdGray text-sm'><p>Piece</p></div>
      )}
      <div className='flex flex-row max-md:flex-col justify-center items-center text-center'>
        <div className='flex flex-col justify-center items-center text-center'>
          <div className='gap-y-1 px-4'>
            <h3 className='flex justify-center items-center min-h-[96px] !text-2xl text-center'><strong>{titleSaved}</strong></h3>
            <p>{workComposers}</p>
          </div>
          {piece.attributes.level?.data?.attributes.title && (
            <p className='mb-4 px-4'><strong><em>{piece.attributes.level?.data?.attributes.title}</em></strong></p>
          )}
        </div>
      </div>
      {piece.attributes.scoreExcerpt.data?.attributes && (
        <ImagePicture
          alt={piece.attributes.title ? piece.attributes.title : ''}
          src={piece.attributes.scoreExcerpt.data?.attributes.url}
          height={116}
          width={500}
          className='w-[calc(100%-20px)]'
        />
      )}
      <div className='mt-3 mb-2'><Link href={workURL}><a className='flex gap-2' title={`View ${workTitleDisplay}`} aria-label={`View ${workTitleDisplay}`}><ImageNext src={IconOpen} width={20} height={20} /><strong>View</strong></a></Link></div>
    </div>
  );
};

export default CardPiece;