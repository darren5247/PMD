import {
  forwardRef,
  FocusEventHandler,
  ChangeEventHandler,
  MouseEventHandler,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import { IconSearch } from "@src/common/assets/icons";
import ImageNext from "@src/components/ImageNext";
import InputText from "@src/components/InputText";

interface ISearchInputItemProps {
  className?: string;
  placeholder?: string;
  onFocus?: FocusEventHandler;
  onClick?: MouseEventHandler;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onSubmit?: MouseEventHandler;
}

const SearchInputItem = forwardRef<HTMLInputElement, ISearchInputItemProps>(
  ({ className, ...props }, ref) => {
    const router = useRouter();
    const [queryCurrent, setQueryCurrent] = useState("");

    useEffect(() => {
      const query = router.query.q || "";
      setQueryCurrent(Array.isArray(query) ? query.join("") : query);
    }, [router]);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setQueryCurrent(e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className={cn("relative mx-auto w-full mr-[-8px]", className)}>
        <div className="flex flex-row justify-center items-stretch gap-2 w-full">
          <ImageNext
            aria-hidden="true"
            alt=""
            src={IconSearch}
            className="top-1/2 left-[15px] absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
          />
          <div className="w-full">
            <InputText
              ref={ref}
              {...props}
              value={queryCurrent}
              onChange={handleChange}
              className={cn(
                "min-[440px]:!text-lg",
                queryCurrent ? "pr-[12px]" : "pr-[4px]",
              )}
            />
          </div>
          <button
            title="Search"
            type="button"
            onClick={props.onSubmit}
            className="!px-2 !py-2 text-white button"
          >
            <p className="text-white text-xs">Search</p>
          </button>
        </div>
      </div>
    );
  },
);

SearchInputItem.displayName = "SearchInputItem";

export default SearchInputItem;
