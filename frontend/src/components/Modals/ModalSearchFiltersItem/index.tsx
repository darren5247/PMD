import { FC } from 'react';
import Modal from '@src/components/Modal';
import ImageNext from '@src/components/ImageNext';
import { IconFilterRed } from '@src/common/assets/icons';
import SearchFiltersItem from '@src/components/SearchFiltersItem';

interface IModalSearchFiltersItemProps {
    isAnd: boolean;
    currentFilter: string | null;
    isOpen: boolean;
    onClose: () => void;
};

const ModalSearchFiltersItem: FC<IModalSearchFiltersItemProps> = ({
    isAnd,
    currentFilter,
    isOpen,
    onClose
}): JSX.Element => {
    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            clickOutsideEnabled={true}
            layoutClassName='w-full max-h-full mx-[20px]'
            crossClassName='w-10 h-10 top-2 right-2'
        >
            <div className='flex gap-2 py-4 pr-12 pl-5'>
                <ImageNext src={IconFilterRed} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
                <p className='pt-1 text-pmdGrayDark'><strong>Filter by</strong></p>
            </div>
            <div className='px-3 min-[428px]:px-4 pt-4 pb-6 border-pmdGrayLight border-t min-w-[230px] max-w-72 max-h-screen overflow-auto text-black scrollbar'>
                {isOpen && (
                    <SearchFiltersItem
                        isAnd={isAnd}
                        currentFilter={currentFilter}
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                )}
            </div>
        </Modal >
    );
};

export default ModalSearchFiltersItem;
