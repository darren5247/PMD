import { FC } from "react";
import cn from "classnames";

import ImageNext from "../ImageNext";

import { IconCrossInCircle } from "@src/common/assets/icons";

interface IChipRemovableProps {
  className?: string;
  onClose: () => void;
  title: string;
}

const ChipRemovable: FC<IChipRemovableProps> = ({
  className,
  title,
  onClose,
  ...props
}): JSX.Element => {
  return (
    <div
      className={cn(
        "flex gap-1 rounded-[5px] bg-pmdGrayLight py-[5px] px-2 tracking-thigh text-pmdGrayDark",
        className,
      )}
      {...props}
    >
      <p className="overflow-hidden text-sm leading-[16px]">{title}</p>
      <a
        title={`Remove ${title}`}
        className="h-[16px] cursor-pointer shrink-0"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
        tabIndex={0}
      >
        <ImageNext src={IconCrossInCircle} width={16} height={16} />
      </a>
    </div>
  );
};

export default ChipRemovable;
