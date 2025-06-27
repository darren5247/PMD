import { FC } from "react";
import cn from "classnames";
import ImageNext from "../ImageNext";
import { IconPencil } from "@src/common/assets/icons";

interface IEditProps {
  className?: string;
  editLabel?: string;
  size?: number;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
  tabIndex?: number;
}

const Edit: FC<IEditProps> = ({
  className,
  editLabel,
  size,
  onClick,
  onKeyDown,
  tabIndex,
  ...props
}): JSX.Element => {
  return (
    <a
      id={editLabel ? "Edit-" + editLabel : ""}
      title={editLabel ? editLabel : "Edit"}
      className={cn(
        "flex text-left items-center justify-left gap-2 rounded-2 bg-pmdGrayLight !p-2 tracking-thigh button cursor-pointer",
        size
          ? "max-h-[" + size + "px] max-w-[" + size + "px]"
          : "max-h-[40px] max-w-[40px]",
        className,
      )}
      {...props}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onKeyDown && onKeyDown(e);
        }
      }}
      tabIndex={tabIndex ? tabIndex : 0}
    >
      <ImageNext
        src={IconPencil}
        width={size ? size : 40}
        height={size ? size : 40}
      />
    </a>
  );
};

export default Edit;
