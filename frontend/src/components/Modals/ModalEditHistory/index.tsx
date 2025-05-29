import { FC } from 'react';
import Modal from '@src/components/Modal';
import ImageNext from '@src/components/ImageNext';
import { IconPencilRed, } from '@src/common/assets/icons';
import EditHistory from '@src/components/EditHistory';

import {
    IStrapiEdit
} from '@src/types';

interface IModalEditHistoryProps {
    item: string;
    edits?: IStrapiEdit[];
    isOpen: boolean;
    onClose: () => void;
};

const ModalEditHistory: FC<IModalEditHistoryProps> = ({
    item,
    edits,
    isOpen,
    onClose
}): JSX.Element => {
    return (
        <Modal
            id='modalEditHistory'
            onClose={onClose}
            isOpen={isOpen}
            clickOutsideEnabled={true}
            layoutClassName='w-full max-h-full mx-[20px] max-w-[350px]'
            crossClassName='w-10 h-10 top-2 right-2'
        >
            <div className='flex gap-2 py-4 pr-12 pl-5'>
                <ImageNext src={IconPencilRed} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
                <p className='pt-1 text-pmdGrayDark'><strong>Edit History</strong></p>
            </div>
            <div className='px-4 pt-4 pb-6 border-pmdGrayLight border-t max-h-screen overflow-auto text-black scrollbar'>
                {(edits && edits.length > 0 && edits[0].id) ? (
                    (edits.length > 1) ? (
                        <div className='flex flex-col mt-8 mb-10 text-pmdGrayDark'>
                            {item && (
                                <p className='mb-4 text-lg'><strong>Entire edit history for <br />{item}</strong></p>
                            )}
                            <div className='flex flex-col justify-center items-center text-center'>
                                {edits
                                    .sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime())
                                    .map((edit: IStrapiEdit) => (
                                        <EditHistory edit={edit} key={edit.id} />
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col mt-8 mb-10 text-pmdGrayDark'>
                            {item && (
                                <p className='mb-4 text-lg'><strong>Entire edit history for <br />{item}</strong></p>
                            )}
                            <div className='flex flex-col justify-center items-center text-center'>
                                <EditHistory edit={edits[0]} key={edits[0].id} />
                            </div>
                        </div>
                    )
                ) : (
                    <div className='flex flex-col justify-center items-center px-4 text-center'>
                        {item ? (
                            <div className='flex flex-col justify-center items-center gap-4 mt-6 mb-6 align-middle'>
                                <p>No edits made yet for <br />{item}</p>
                            </div>
                        ) : (
                            <div className='flex flex-col justify-center items-center gap-6 mt-6 mb-4 align-middle'>
                                <p>No edits made yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ModalEditHistory;
