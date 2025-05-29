import { forwardRef } from 'react';
import cn from 'classnames';

const InputNumber = forwardRef<HTMLInputElement, any>(
   ({ className, ...props }, ref) => {
      return (
          <a title={props?.placeholder}><input
            onKeyDown={(event: any) => {
               if (
                 !/[0-9]/.test(event.key) &&
                 event.key !== 'Backspace' &&
                 event.key !== 'ArrowLeft' &&
                 event.key !== 'ArrowRight' &&
                 event.key !== 'ArrowUp' &&
                 event.key !== 'ArrowDown' &&
                 event.key !== 'Control' &&
                 event.key !== 'Shift' &&
                 event.key !== 'Escape' &&
                 event.key !== 'Delete' &&
                 event.key !== 'Tab' &&
                 !(event.ctrlKey && event.key === 'a') // Allow Ctrl+A
               ) {
                 event.preventDefault();
               }
            }}
            min={0}
            type='number'
            inputMode='numeric'
            ref={ref}
            {...props}
            autoComplete='off'
            className={cn(
               `w-full rounded-lg border py-4 pl-10 pr-8 text-sm
          tracking-thigh placeholder:text-pmdGray
          focus-visible:outline-0`,
               props?.error ? 'border-pmdRed text-pmdRed' : 'border-pmdGray text-black',
               className
            )}
          /></a>
      );
   }
);
InputNumber.displayName = 'InputNumber';

export default InputNumber;
