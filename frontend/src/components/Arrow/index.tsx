import { FC } from "react";
import cn from "classnames";

interface IArrowProps {
  className?: string;
  onClick?: () => void;
  side: "right" | "left";
  type: "musicCard" | "elementCard";
  arrowClassName?: string;
  disabled?: boolean;
}

export const Arrow: FC<IArrowProps> = ({
  onClick,
  side,
  type,
  arrowClassName = "",
  disabled = false,
}): JSX.Element => {
  return (
    <button
      aria-label={cn({
        Previous: side === "left",
        Next: side === "right",
      })}
      title={cn({
        Previous: side === "left",
        Next: side === "right",
      })}
      className={cn(
        `absolute top-[calc(50%-1px)] z-20 flex h-[50px] w-[50px] -translate-y-1/2 cursor-pointer items-center justify-center
        rounded-full bg-pmdGrayLight fill-pmdRed stroke-pmdRed shadow-activeFilter hover:bg-pmdGray disabled:fill-pmdGray disabled:stroke-pmdGray disabled:cursor-default disabled:hover:!bg-pmdGrayLight `,
        arrowClassName,
        {
          "-left-[17px]": side === "left" && type === "musicCard",
          "-right-[14px]": side === "right" && type === "musicCard",
          "-left-[23px]": side === "left" && type === "elementCard",
          "-right-[25px]": side === "right" && type === "elementCard",
        },
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick && onClick();
        }
      }}
      tabIndex={0}
      disabled={disabled}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(`mt-px fill-inherit pl-px`, {
          "rotate-180": side === "right",
        })}
      >
        <g id="pmdArrow">
          <path
            id="Arrow"
            d="M11.2485 0C11.6893 0 12.1178 0.178968 12.4606 0.524121C13.1218 1.21443 13.1218 2.36493 12.4606 3.05524L7.28155 8.4882L12.4851 13.9212C13.1462 14.6115 13.1462 15.762 12.4851 16.4523C11.8239 17.1426 10.722 17.1426 10.0609 16.4523L3.63295 9.75376C3.30237 9.4086 3.13096 8.97397 3.13096 8.4882C3.13096 8.00243 3.31461 7.55501 3.63295 7.22264L10.0364 0.524121C10.3792 0.178968 10.82 0 11.2485 0Z"
            fill="inherit"
          />
        </g>
      </svg>
    </button>
  );
};

export default Arrow;
