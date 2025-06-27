import { forwardRef } from "react";
import cn from "classnames";

const TextArea = forwardRef<HTMLTextAreaElement, any>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        autoComplete="off"
        className={cn(
          `w-full rounded-lg border pt-[15px] pb-4 pl-[46px] text-sm
        tracking-thigh placeholder:text-pmdGray
        focus-visible:outline-0 resize-none`,
          error ? "border-pmdRed text-pmdRed" : "border-pmdGray text-black",
          className,
        )}
      />
    );
  },
);
TextArea.displayName = "TextArea";

export default TextArea;
