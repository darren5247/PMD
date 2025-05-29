import { FC, ReactNode } from 'react';
import cn from 'classnames';

interface ILabelProps {
    className?: string;
    onClick?: (a?: any) => void;
    children?: ReactNode;
    htmlFor?: string;
    desc?: string;
    descClassName?: string;
    label?: string;
    labelRequired?: JSX.Element;
    labelClassName?: string;
};

const Label: FC<ILabelProps> = ({
    className,
    htmlFor,
    desc,
    descClassName,
    label,
    labelRequired,
    labelClassName
}): JSX.Element => {
    return (
        <div className={cn('flex flex-col text-left gap-x-2.5 gap-y-0.5', className)}>
            <label
                className={cn('inline-block text-sm cursor-text text-black', labelClassName)}
                htmlFor={htmlFor}
            >
                {label}{labelRequired}
            </label>
            <p className={cn('text-xs text-pmdGray mb-1', descClassName)}>{desc}</p>
        </div>
    );
};

export default Label;
