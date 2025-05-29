import { FC, useContext, useEffect } from 'react';
import Modal from '@src/components/Modal';
import ImageNext from '@src/components/ImageNext';
import { IconQuestion } from '@src/common/assets/icons';
import Divider from '@src/components/Divider';
import Chip from '@src/components/Chip';
import api from '@src/api/config';
import { AppContext } from '@src/state';
import { ENotificationActionTypes, ENotificationTypes } from '@src/types';

interface IModalCheckYourEmailProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
};

const ModalCheckYourEmail: FC<IModalCheckYourEmailProps> = ({
    isOpen,
    onClose,
    email
}): JSX.Element => {
    const { dispatch } = useContext(AppContext);
    const handleForgotManually = async () => {
        try {
            await api.post(`auth/forgot-password`, {
                email
            });
        } catch (error: any) {
            if (error?.response?.data) {
                dispatch({
                    type: ENotificationActionTypes.SET_MESSAGE,
                    payload: {
                        message: error?.response?.data.error?.message,
                        type: ENotificationTypes.ERROR
                    }
                });
            };
        };
    };

    useEffect(() => {
        const handleForgotAutomatically = async () => {
            try {
                await api.post(`auth/forgot-password`, {
                    email
                });
            } catch (error: any) {
                if (error?.response?.data) {
                    dispatch({
                        type: ENotificationActionTypes.SET_MESSAGE,
                        payload: {
                            message: error?.response?.data.error?.message,
                            type: ENotificationTypes.ERROR
                        }
                    });
                };
            };
        };

        if (email) {
            handleForgotAutomatically();
        };
    }, [email, dispatch]);

    return (
        <Modal
            id='modalCheckYourEmail'
            onClose={onClose}
            isOpen={isOpen}
            clickOutsideEnabled={true}
            layoutClassName='w-full h-auto max-h-screen mx-[20px] max-w-[350px]'
            crossClassName='w-10 h-10 top-2 right-2'
        >
            <div className='flex gap-2 pt-4 pr-12 pl-5'>
                <ImageNext src={IconQuestion} className='min-w-[14px] min-h-[14px]' />
                <p className='pt-1 text-pmdGrayDark'><strong>Check Your Email!</strong></p>
            </div>
            <Divider className='mt-0 mb-0' />
            <div className='px-5 pb-6 overflow-y-auto scrollbar'>
                <p className='text-pmdGrayDark text-sm'>
                    You will receive an email with your <strong>Password Reset Link</strong>.
                </p>
                <div className='flex flex-wrap justify-center items-center gap-2 mx-auto my-[30px] text-pmdGrayDark text-sm text-center'>
                    <p>Email sent to:</p>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Chip className='break-all sm:break-normal' title={email} />
                    </div>
                </div>
                <div className='flex flex-wrap justify-center items-center gap-2 mx-auto my-[30px] text-pmdGrayDark text-sm text-center'>
                    <p>Email sent from:</p>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Chip className='break-all sm:break-normal' title='no-reply@pianomusicdatabase.com' />
                    </div>
                </div>
                <p>Email sent from:</p>
                <div className='flex flex-wrap items-center gap-2'>
                    <Chip className='break-all sm:break-normal' title='no-reply@pianomusicdatabase.com' />
                </div>
                <p className='text-pmdGrayDark text-xs'>
                    <em>Code is valid for 30 minutes.</em>
                </p>
                <p className='mb-[20px] text-pmdGrayDark text-xs'>
                    <em>Check spam and wait at least 25 minutes.</em>
                </p>
                <p className='text-pmdGrayDark text-xs'>
                    <em>Didn’t get an email? <a className='cursor-pointer' title='Resend Reset Email' onClick={handleForgotManually}>Resend Reset Email</a></em>
                </p>
            </div>
        </Modal>
    );
};

export default ModalCheckYourEmail;
