import { FC } from "react";
import Link from "next/link";
import cn from "classnames";
import { EUrlsPages } from "@src/constants";
import { IconOpen } from "@src/common/assets/icons";
import ImageNext from "@src/components/ImageNext";
import ImagePicture from "@src/components/ImagePicture";
import { IStrapiPiece } from "@src/types";

import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  },
});

interface ICardComposerProps {
  name: string | undefined;
  birth_year: string | undefined;
  death_year: string | undefined;
  nationality: string | undefined;
  imageURL?: string | undefined;
  hideLabel?: boolean;
  id: number | undefined;
}

export const CardComposer: FC<ICardComposerProps> = ({
  name,
  birth_year,
  death_year,
  nationality,
  imageURL,
  hideLabel,
  id,
}): JSX.Element => {
  const checkNumberName = (dirtyName: string) => {
    const parsedName = parseInt(dirtyName);
    if (isNaN(parsedName)) {
      return dirtyName;
    } else {
      const words = toWords.convert(parsedName);
      return encodeURIComponent(words);
    }
  };

  return (
    <div
      id={`${id}-${name}`}
      className="flex flex-col justify-center items-center gap-y-2 bg-white shadow-musicCard pb-4 rounded-lg min-w-full sm:min-w-[580px] sm:min-w-auto max-w-[580px] text-center"
    >
      {!hideLabel && (
        <div className="bg-pmdGrayBright py-2 rounded-t-lg w-full text-pmdGray text-sm">
          <p>Composer</p>
        </div>
      )}
      <div
        className={cn(
          "mb-2 flex flex-row max-md:flex-col justify-center items-center text-center ",
          {
            "mt-6": hideLabel,
          },
          {
            "mt-2": !hideLabel,
          },
        )}
      >
        {imageURL && (
          <ImagePicture
            alt={name ? name : ""}
            src={imageURL}
            height={100}
            width={100}
            layout="fixed"
            objectFit="cover"
            className="shadow-musicCard mx-6 rounded-full w-[100px] min-w-[100px] h-[100px] min-h-[100px] overflow-hidden"
          />
        )}
        <div className="flex flex-col justify-center items-center text-center">
          {name ? (
            <div className="flex px-3 pb-2">
              <h3 className="flex justify-center items-center px-4 min-h-[96px] !text-2xl text-center">
                <strong>{name}</strong>
              </h3>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {nationality ? (
        <p>
          <em>{nationality}</em>
        </p>
      ) : (
        ""
      )}
      {birth_year && death_year ? (
        <p>
          Born {birth_year}, Died {death_year}
        </p>
      ) : (
        ""
      )}
      {birth_year && !death_year ? `Born ${birth_year}` : ""}
      {death_year && !birth_year ? `Died ${death_year}` : ""}
      {name ? (
        <p className="flex gap-2 mt-3 mb-4">
          {/* {works && works.length ? (
            <>
              <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][composers][0]=${encodeURIComponent(name)}`}><a className='flex gap-2' title={`Search ${name}`} aria-label={`Search ${name}`}><ImageNext src={IconSearchRed} width={18} height={18} /><strong>Search</strong></a></Link>
              <span className='px-2 text-pmdGray'>|</span>
            </>
          ) : ''} */}
          <Link
            href={`/${EUrlsPages.COMPOSER}/${checkNumberName(name)}?id=${id}`}
          >
            <a
              className="flex gap-2"
              title={`View ${name}`}
              aria-label={`View ${name}`}
            >
              <ImageNext src={IconOpen} width={18} height={18} />
              <strong>View</strong>
            </a>
          </Link>
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default CardComposer;
