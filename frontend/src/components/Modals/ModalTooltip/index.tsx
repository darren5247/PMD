import { FC, useContext } from 'react';
import Modal from '@src/components/Modal';
import ImageNext from '@src/components/ImageNext';
import { IconQuestion } from '@src/common/assets/icons';
import { AppContext } from '@src/state';
import { ETooltipActionTypes, ITooltipInfo } from '@src/types';

interface IModalTooltipProps {
    tooltip: ITooltipInfo;
};

const ModalTooltip: FC<IModalTooltipProps> = ({ tooltip }): JSX.Element => {
    const { dispatch } = useContext(AppContext);

    const handleDeleteTooltip = () => {
        if (typeof window != 'undefined' && window.document) {
            document.body.style.overflow = 'visible';
        }
        dispatch({
            type: ETooltipActionTypes.DELETE_TOOLTIP,
            payload: null
        });
    };
    return (
        <Modal
            id={'modalTooltip' + tooltip.attributes.tooltipTitle}
            onClose={handleDeleteTooltip}
            isOpen={true}
            clickOutsideEnabled={true}
            layoutClassName='w-full mx-[20px] max-w-[350px]'
            crossClassName='w-10 h-10 top-2 right-2'
        >
            <div className='flex gap-2 py-4 pr-12 pl-5'>
                <ImageNext src={IconQuestion} height={22} width={22} />
                <p className='pt-1 text-pmdGrayDark'><strong>{tooltip.attributes.tooltipTitle}</strong></p>
            </div>
            <div className='px-4 pt-4 pb-2 border-pmdGrayLight border-t max-h-[500px] overflow-auto text-pmdGrayDark scrollbar'>
                <div className='text-pmdGrayDark text-sm leading-[20px] whitespace-pre-line' dangerouslySetInnerHTML={{ __html: tooltip.attributes.tooltipText }}></div>
            </div>
        </Modal>
    );
};

export default ModalTooltip;
