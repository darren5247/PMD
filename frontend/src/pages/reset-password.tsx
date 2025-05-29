import { GetServerSideProps, NextPage } from 'next';
import { useContext, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Page from '@src/components/Page';
import Label from '@src/components/Label';
import Field from '@src/components/Field';
import Form from '@src/components/Form';
import InputText from '@src/components/InputText';
import { ModalFeedback } from '@src/components/Modals';
import { EAccountLogin, EUrlsPages } from '@src/constants';
import { AppContext } from '@src/state';
import { ENotificationActionTypes, ENotificationTypes } from '@src/types';
import api from '@src/api/config';

interface IResetPasswordForm {
    password: string;
};

type TResetPasswordForm = IResetPasswordForm | FieldValues;

interface IResetPasswordPageProps {
    prevUrl: string | undefined;
};

const ResetPasswordPage: NextPage<IResetPasswordPageProps> = ({ prevUrl }) => {
    const { control, handleSubmit, formState } = useForm<TResetPasswordForm>();
    const router = useRouter();
    const { dispatch } = useContext(AppContext);
    const { code } = router.query;
    const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);

    const handleCreateNewPassword: SubmitHandler<TResetPasswordForm> = async ({
        password
    }) => {
        if (!code) {
            dispatch({
                type: ENotificationActionTypes.SET_MESSAGE,
                payload: { message: 'No Security Code Provided! Open the link in your email.', type: ENotificationTypes.ERROR }
            });
            return;
        };
        try {
            await api.post(`auth/reset-password`, {
                code,
                password,
                passwordConfirmation: password
            });
            router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
            dispatch({
                type: ENotificationActionTypes.SET_MESSAGE,
                payload: {
                    message: 'Password Updated!',
                    type: ENotificationTypes.SUCCESS
                }
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

    return (
        <Page
            showBackBar={true}
            url={EUrlsPages.RESET_PASSWORD}
            prevUrl={prevUrl}
            title='Reset Password - Piano Music Database'
            description='Did you forget or otherwise need to reset your Piano Music Database account password? Follow the instructions sent to your email and complete the provided form.'
            image=''
        >
            <div className='max-w-[320px]' id='resetpassword'>
                <h1 className='mx-auto'>
                    Reset Password
                </h1>
                <p className='mx-auto mt-4 text-pmdGrayDark text-sm'>
                    Enter the new password for your account. This will replace your previous
                    password.
                </p>
                <Form onSubmit={handleSubmit(handleCreateNewPassword)}>
                    <div className='flex flex-col gap-[22px] mx-auto pt-5'>
                        <div>
                            <Field
                                labelEl={<Label
                                    htmlFor={EAccountLogin.EMAIL}
                                    label='New Password'
                                    labelRequired={<span className='text-pmdRed'> *</span>}
                                />}
                                name={EAccountLogin.PASSWORD}
                                component={InputText}
                                control={control}
                                formState={formState}
                                placeholder='New Password'
                                className='pt-[17px] pr-[19px] pb-[16px] !pl-5'
                                error={formState.errors.password}
                            />
                        </div>
                        <div className='flex items-center mb-12 text-center'>
                            <button title='Reset Password' className='mx-auto button' type='submit'>Reset Password</button>
                        </div>
                    </div>
                    <p className='text-pmdGrayDark text-sm text-center'>
                        Didn’t do this? <a title='Report this activity' className='cursor-pointer' onClick={() => { setShowModalFeedback(true); }}>Report this activity</a>
                    </p>
                </Form>
            </div>
            <ModalFeedback
                type='ReportPasswordReset'
                url={`${EUrlsPages.RESET_PASSWORD}`}
                onClose={() => { setShowModalFeedback(false); }}
                isOpen={showModalFeedback}
            />
        </Page>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            prevUrl: context.req.headers.referer ?? ''
        }
    };
};

export default ResetPasswordPage;
