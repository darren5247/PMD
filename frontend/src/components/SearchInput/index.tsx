import {
  forwardRef,
  FocusEventHandler,
  ChangeEventHandler,
  MouseEventHandler,
} from "react";
import cn from "classnames";
import { IconSearch } from "@src/common/assets/icons";
import ImageNext from "@src/components/ImageNext";
import InputText from "@src/components/InputText";

interface ISearchInputProps {
  className?: string;
  placeholder?: string;
  onFocus?: FocusEventHandler;
  onClick?: MouseEventHandler;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const SearchInput = forwardRef<HTMLInputElement, ISearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative mt-[8px] w-full", className)}>
        <ImageNext
          aria-hidden="true"
          alt=""
          src={IconSearch}
          className="top-1/2 left-[15px] absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
        />
        <InputText ref={ref} {...props} className="!pr-4" />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export default SearchInput;
