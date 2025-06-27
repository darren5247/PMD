import { FC, ReactNode, useContext } from "react";
import cn from "classnames";
import ImageNext from "../ImageNext";
import { IconQuestion } from "@src/common/assets/icons";
import { AppContext } from "@src/state";
import { setTooltips } from "@src/state/action-creators";

interface ILabelTooltipProps {
  className?: string;
  onClick?: (a?: any) => void;
  children?: ReactNode;
  htmlFor?: string;
  label?: string;
  labelRequired?: JSX.Element;
  tooltip: number;
  labelClassName?: string;
}

const LabelTooltip: FC<ILabelTooltipProps> = ({
  className,
  onClick,
  htmlFor,
  label,
  labelRequired,
  tooltip,
  labelClassName,
}): JSX.Element => {
  const { dispatch } = useContext(AppContext);

  const handleTooltip = async () => {
    if (onClick) onClick();
    const serverTooltip = await setTooltips(tooltip);
    dispatch(serverTooltip);
  };

  return (
    <div className={cn("flex gap-2.5", className)}>
      <label
        className={`inline-block text-sm mb-1 cursor-text text-black ${labelClassName}`}
        htmlFor={htmlFor}
      >
        {label}
        {labelRequired}
      </label>
      <a
        title={`Information about ${label}`}
        className="cursor-pointer"
        onClick={handleTooltip}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTooltip();
          }
        }}
        tabIndex={0}
      >
        <ImageNext src={IconQuestion} />
      </a>
    </div>
  );
};

export default LabelTooltip;
