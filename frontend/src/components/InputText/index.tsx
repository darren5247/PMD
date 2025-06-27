import { forwardRef } from "react";
import cn from "classnames";

const InputText = forwardRef<HTMLInputElement, any>(
  ({ className, error, ...props }, ref) => {
    return (
      <a title={props?.placeholder}>
        <input
          ref={ref}
          {...props}
          autoComplete="off"
          className={cn(
            `w-full rounded-lg border py-4 pl-10 pr-8 text-sm
        tracking-thigh placeholder:text-pmdGray
        focus-visible:outline-0`,
            error ? "border-pmdRed text-pmdRed" : "border-pmdGray text-black",
            className,
          )}
        />
      </a>
    );
  },
);
InputText.displayName = "InputText";

export default InputText;
