import { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import ImageNext from '../ImageNext';
import { IconSearchRed } from '@src/common/assets/icons';

interface IChipIconProps {
    className?: string;
    chipLabel: string;
    chipSearchIcon?: string;
    chipSearchIconTitle?: string;
    chipSearchIconLink?: string;
    chipIcon: string;
    chipIconTitle: string;
    chipIconLink: string;
};

const ChipIcon: FC<IChipIconProps> = ({
    className,
    chipLabel,
    chipSearchIcon,
    chipSearchIconTitle,
    chipSearchIconLink,
    chipIcon,
    chipIconTitle,
    chipIconLink,
    ...props
}): JSX.Element => {
    return (
        <div
            className={cn(
                'flex flex-wrap text-left items-left justify-left gap-2 rounded-[5px] bg-pmdGrayLight py-[5px] px-2 tracking-thigh text-pmdGrayDark',
                className,
            )}
            {...props}
        >
            <div className='overflow-hidden text-sm leading-[16px]'>
                {chipLabel}
            </div>
            {/* {chipSearchIconLink ? (<Link href={chipSearchIconLink}><a title={chipSearchIconTitle ? chipSearchIconTitle : 'Search'} className='pl-2 border-pmdGray border-l h-[16px] cursor-pointer shrink-0'>
                <ImageNext src={chipSearchIcon ? chipSearchIcon : IconSearchRed} width={16} height={16} />
            </a></Link>) : ''} */}
            <Link href={chipIconLink}><a title={chipIconTitle ? chipIconTitle : 'View'} className='pl-2 border-pmdGray border-l h-[16px] cursor-pointer shrink-0'>
                <ImageNext src={chipIcon} width={16} height={16} />
            </a></Link>
        </div>
    );
};

export default ChipIcon;
