import { ReactElement, forwardRef, useEffect, useState } from 'react';
import cn from 'classnames';

export interface ICheckboxProps {
  placeholder?: string;
  className?: string;
  checkboxLabel?: string | ReactElement;
  checkboxLabelClassName?: string;
  icon?: ReactElement;
  checkedIcon?: ReactElement;
  defaultChecked?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  tabIndex?: number;
  disabled?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
  (
    {
      className,
      checkboxLabel,
      checkboxLabelClassName,
      icon,
      defaultChecked,
      checkedIcon,
      onClick,
      onChange,
      onKeyDown,
      tabIndex,
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useState(checked || false);
    useEffect(() => {
      setIsChecked(checked || false);
    }, [checked]);

    const handleChecked = () => {
      if (!disabled) {
        setIsChecked(!isChecked);
        if (onClick) onClick();
      }
    };

    return (
      <div className='flex items-center text-sm' onClick={handleChecked}>
        {icon && !isChecked && (
          <div {...props} ref={ref}>
            {icon}
          </div>
        )}
        {checkedIcon && isChecked && (
          <div {...props} ref={ref}>
            {checkedIcon}
          </div>
        )}
        {!icon && !isChecked && (
          <input
            type='checkbox'
            ref={ref}
            className={cn(
              `relative h-[16px] w-[16px] cursor-pointer appearance-none rounded border-[1.5px] border-solid border-pmdGrayLight checked:border-pmdRed checked:bg-pmdRed checked:before:absolute checked:before:left-px checked:before:-top-[2px] checked:before:content-checkbox-chevron-small`,
              className,
              { '!cursor-not-allowed !bg-pmdGrayLight !checked:border-pmdGrayLight !checked:bg-pmdGrayLight': disabled }
            )}
            checked={isChecked}
            readOnly={disabled}
            onKeyDown={onKeyDown}
            onChange={onChange}
            tabIndex={tabIndex}
            {...props}
          />
        )}
        {!checkedIcon && isChecked && (
          <input
            type='checkbox'
            ref={ref}
            className={cn(
              `relative h-[16px] w-[16px] cursor-pointer appearance-none rounded border-[1.5px] border-solid border-pmdGrayLight checked:border-pmdRed checked:bg-pmdRed checked:before:absolute checked:before:left-px checked:before:-top-[2px] checked:before:content-checkbox-chevron-small`,
              className,
              { '!cursor-not-allowed !bg-pmdGrayLight !border-pmdGrayLight !checked:border-pmdGrayLight !checked:bg-pmdGrayLight': disabled }
            )}
            checked={isChecked}
            readOnly={disabled}
            onKeyDown={onKeyDown}
            onChange={onChange}
            tabIndex={tabIndex}
            {...props}
          />
        )}
        {checkboxLabel && (
          <label className={cn('ml-[10px] cursor-pointer', checkboxLabelClassName)}>
            {checkboxLabel}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
