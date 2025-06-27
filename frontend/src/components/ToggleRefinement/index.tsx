import { FC } from "react";
import cn from "classnames";
import {
  useToggleRefinement,
  UseToggleRefinementProps,
} from "react-instantsearch-hooks-web";

interface IToggleRefinementProps extends UseToggleRefinementProps {
  label: string;
  type: "checkbox" | "radio";
  className?: string;
}

const ToggleRefinement: FC<IToggleRefinementProps> = ({
  attribute,
  label,
  type,
  className,
}): JSX.Element => {
  const { value, refine } = useToggleRefinement({ attribute });
  return (
    <>
      {value.onFacetValue.count && (
        <div
          className={cn(
            "max-h-[266px] !mt-2 align-middle items-center text-sm",
            className,
          )}
        >
          <a
            title={label}
            className="flex flex-row gap-x-2 text-pmdGrayDark hover:text-pmdGray !no-underline align-middle"
          >
            <input
              checked={value.isRefined}
              type={type}
              name={"Select " + label}
              id={value.name}
              className="checked:before:top-[2px] checked:before:left-[1px] checked:before:absolute relative checked:bg-pmdRed border-[1.5px] border-pmdGray border-solid rounded w-[20px] h-[20px] checked:before:content-checkbox-chevron appearance-none cursor-pointer"
              onChange={() => {
                refine(value.onFacetValue);
              }}
            />
            <label
              htmlFor={value.name}
              className="mt-[2px] tracking-normal cursor-pointer"
            >
              <span>{`${label}`}</span>
            </label>
          </a>
        </div>
      )}
    </>
  );
};

export default ToggleRefinement;
