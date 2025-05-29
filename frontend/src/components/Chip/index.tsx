import { FC } from 'react';
import cn from 'classnames';

interface IChipProps {
    className?: string;
    title?: string | null;
};

const Chip: FC<IChipProps> = ({
    className,
    title,
    ...props
}): JSX.Element => {
    return (
        <div
            className={cn(
                'flex gap-1 rounded-[5px] bg-pmdGrayLight py-[5px] px-2 tracking-thigh text-pmdGrayDark',
                className,
            )}
            {...props}
        >
            {title ? (
                <p className='overflow-hidden text-sm leading-[16px]'>{title}</p>
            ) : (
                <p className='overflow-hidden text-sm leading-[16px]'>‎ </p>
            )}
        </div>
    );
};

export default Chip;
