import { FC } from "react";
import { handleCleanContent } from "@src/api/helpers";

interface ICardLevelDescProps {
  title: string | undefined;
  description: string | undefined;
  id: number;
}

export const CardLevelDesc: FC<ICardLevelDescProps> = ({
  title,
  description,
  id,
}): JSX.Element => {
  return (
    <div id={`level${id}`} className="pt-6">
      <div className="flex flex-col justify-center items-center bg-white shadow-musicCard rounded-lg max-w-[800px] text-center">
        <div className="flex flex-col justify-center items-center gap-y-2 bg-pmdGrayBright px-4 py-5 w-full text-center">
          <h2 className="text-xl">Level {id}</h2>
          <h2>
            <strong>{title}</strong>
          </h2>
        </div>
        <div className="flex flex-col px-6 py-5 w-full text-left grow">
          {description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: handleCleanContent(description),
              }}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default CardLevelDesc;
