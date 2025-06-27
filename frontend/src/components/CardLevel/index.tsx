import { FC } from "react";

interface ICardLevelProps {
  title: string | undefined;
  id: number;
  isSearchable: boolean | null;
}

export const CardLevel: FC<ICardLevelProps> = ({ title, id }): JSX.Element => {
  return (
    <div
      id={`level${id}`}
      className="flex flex-col justify-top items-center gap-y-2 bg-white shadow-musicCard px-4 py-[20px] rounded-lg min-w-[250px] text-center"
    >
      <div className="my-2">
        <h3 className="flex items-start w-full overflow-hidden font-extrabold text-base leading-[19.5px] lg:leading-[20px] tracking-thigh">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CardLevel;
