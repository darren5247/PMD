import { FC } from "react";
import Link from "next/link";
import cn from "classnames";
import { EUrlsPages } from "@src/constants";
import { IStrapiCollection } from "@src/types";
import { IconOpen } from "@src/common/assets/icons";
import ImagePicture from "@src/components/ImagePicture";
import ImageNext from "@src/components/ImageNext";
import { handleTitleWithJustNumber } from "@src/api/helpers";

interface ICardCollectionProps {
  title: string | undefined;
  collection: IStrapiCollection | null;
  hideLabel?: boolean;
  id: number | undefined;
}

export const CardCollection: FC<ICardCollectionProps> = ({
  title,
  collection,
  hideLabel,
  id,
}): JSX.Element => {
  if (collection) {
    if (collection.attributes.composers.data?.length) {
      collection.attributes.composers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name) return -1;
        if (a.attributes.name > b.attributes.name) return 1;
        return 0;
      });
    }
    if (collection.attributes.publishers.data?.length) {
      collection.attributes.publishers.data?.sort((a, b) => {
        if (a.attributes.name < b.attributes.name) return -1;
        if (a.attributes.name > b.attributes.name) return 1;
        return 0;
      });
    }
  }

  return (
    <div
      id={`${id}-${title}`}
      className="flex flex-col justify-between items-center gap-y-2 bg-white shadow-musicCard pb-4 rounded-lg min-w-full sm:min-w-[580px] sm:min-w-auto max-w-[580px] text-center grow"
    >
      {!hideLabel && (
        <div className="bg-pmdGrayBright py-2 rounded-t-lg w-full text-pmdGray text-sm">
          <p>Collection</p>
        </div>
      )}
      <div className="flex flex-col max-md:flex-col justify-center items-center px-4 text-center grow">
        <div
          className={cn(
            "mb-2 flex flex-row max-md:flex-col justify-center items-center text-center grow",
            {
              "mt-6": hideLabel,
            },
            {
              "mt-2": !hideLabel,
            },
          )}
        >
          {collection?.attributes.image?.data?.attributes && (
            <ImagePicture
              alt={title ? title : ""}
              src={collection?.attributes.image.data?.attributes.url}
              height={100}
              width={100}
              layout="fixed"
              objectFit="cover"
              className="shadow-musicCard mx-6 rounded-full w-[100px] min-w-[100px] h-[100px] min-h-[100px] overflow-hidden"
            />
          )}
          <div className="flex flex-col justify-center items-center text-center grow">
            {title ? (
              <div className="flex px-3 pb-2 grow">
                <h3 className="flex justify-center items-center px-4 min-h-[96px] !text-2xl text-center grow">
                  <strong>{title}</strong>
                </h3>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {collection?.attributes.composers.data?.length ? (
          <p className="pr-1.5 pb-2">
            Composed{" "}
            {collection?.attributes.composed_date
              ? `in ${collection?.attributes.composed_date}`
              : ""}{" "}
            <span>by </span>
            {collection?.attributes.composers.data?.map((composer, i) => (
              <span key={composer.attributes.name}>
                {composer.attributes.name}
                {collection?.attributes.composers.data?.length
                  ? collection?.attributes.composers.data?.length > 3
                    ? i < collection?.attributes.composers.data?.length - 2
                      ? ", "
                      : i < collection?.attributes.composers.data?.length - 1
                        ? ", and "
                        : null
                    : collection?.attributes.composers.data?.length < 2
                      ? ""
                      : i < collection?.attributes.composers.data?.length - 1
                        ? " and "
                        : null
                  : ""}
              </span>
            ))}
          </p>
        ) : collection?.attributes.composed_date ? (
          <p className="pb-2">
            Composed in {collection?.attributes.composed_date}
          </p>
        ) : (
          ""
        )}
        {collection?.attributes.publishers.data?.length ? (
          <p className="pr-1.5 pb-2">
            Published{" "}
            {collection?.attributes.published_date
              ? `in ${collection?.attributes.published_date}`
              : ""}{" "}
            <span>by </span>
            {collection?.attributes.publishers.data?.map((publisher, i) => (
              <span key={publisher.attributes.name}>
                {publisher.attributes.name}
                {collection?.attributes.publishers.data?.length
                  ? collection?.attributes.publishers.data?.length > 3
                    ? i < collection?.attributes.publishers.data?.length - 2
                      ? ", "
                      : i < collection?.attributes.publishers.data?.length - 1
                        ? ", and "
                        : null
                    : collection?.attributes.publishers.data?.length < 2
                      ? ""
                      : i < collection?.attributes.publishers.data?.length - 1
                        ? " and "
                        : null
                  : ""}
              </span>
            ))}
          </p>
        ) : collection?.attributes.published_date ? (
          <p className="pb-2">
            Published in {collection?.attributes.published_date}
          </p>
        ) : (
          ""
        )}
        {title ? (
          <p className="flex gap-2 mt-3 mb-4">
            {/* {collection?.attributes.works.data?.length ? (
              <>
                <Link href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][collections][0]=${encodeURIComponent(title)}`}><a className='flex gap-2' title={`Search ${title}`} aria-label={`Search ${title}`}><ImageNext src={IconSearchRed} width={18} height={18} /><strong>Search</strong></a></Link>
                <span className='px-2 text-pmdGray'>|</span>
              </>
            ) : ''} */}
            <Link
              href={`/${EUrlsPages.COLLECTION}/${handleTitleWithJustNumber(title)}?id=${id}`}
            >
              <a
                className="flex gap-2"
                title={`View ${title}`}
                aria-label={`View ${title}`}
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
    </div>
  );
};

export default CardCollection;
