import { FC, useEffect, useContext, useState } from 'react';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import Form from '@src/components/Form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Field from '@src/components/Field';
import InputText from '@src/components/InputText';
import TextArea from '@src/components/TextArea';
import Label from '@src/components/Label';
import Divider from '@src/components/Divider';
import Modal from '@src/components/Modal';
import Chip from '@src/components/Chip';
import Link from 'next/link';
import ImageNext from '@src/components/ImageNext';
import { IconPencilRed, IconPencil } from '@src/common/assets/icons';
import EditHistory from '@src/components/EditHistory';

import {
    EUrlsPages
} from '@src/constants';

import {
    ENotificationActionTypes,
    ENotificationTypes,
    IStrapiEdit,
    TUserAttributes,
} from '@src/types';

interface IEditForm {
    newContent: string;
    reason: string;
};

type TEditForm = IEditForm | FieldValues;

interface IModalEditProps {
    type: string;
    field: string;
    currentContent: string;
    edits?: IStrapiEdit[];
    work?: string;
    collection?: string;
    publisher?: string;
    composer?: string;
    isOpen: boolean;
    onClose: () => void;
};

const ModalEdit: FC<IModalEditProps> = ({
    type,
    field,
    currentContent,
    edits,
    work,
    collection,
    publisher,
    composer,
    isOpen,
    onClose
}): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);
    const { control, handleSubmit, formState, setValue, watch } = useForm<TEditForm>();
    const [userName, setUserName] = useState<string | null>(null);
    const typeDisplay = type || 'Unknown Type';
    const fieldDisplay = field || 'Unknown Field';

    useEffect(() => {
        const editData = JSON.parse(localStorage.getItem('EditForm' + typeDisplay + fieldDisplay) || '{}');
        if (editData) {
            setValue('newContent', editData.newContent);
            setValue('reason', editData.reason);
        };

        const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
        if (accountData.id) {
            if (accountData.name) {
                setUserName(accountData.name);
            };
        };

        const handleSetLocalValue = (data: any) => {
            const localData = localStorage.getItem('EditForm' + typeDisplay + fieldDisplay);

            if (localData) {
                const parseLocalData = JSON.parse(localData);
                localStorage.setItem(
                    'EditForm' + typeDisplay + fieldDisplay,
                    JSON.stringify({
                        ...parseLocalData,
                        newContent: data.newContent,
                        reason: data.reason
                    })
                );
            } else {
                localStorage.setItem(
                    'EditForm' + typeDisplay + fieldDisplay,
                    JSON.stringify({
                        newContent: data.newContent,
                        reason: data.reason
                    })
                );
            };
        };
        const subscription = watch((data: any) => {
            handleSetLocalValue(data);
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue, typeDisplay, fieldDisplay]);

    const handleEdit: SubmitHandler<TEditForm> = ({ newContent, reason }) => {
        if (!handleError({ newContent })) {
            handleData({ newContent, reason });
        };
    };

    const handleData = async (form: any) => {
        try {
            form.currentContent = currentContent;
            form.type = typeDisplay;
            form.field = fieldDisplay;
            form.status = 'Pending Review';
            if (work) {
                form.work = work;
            };
            if (collection) {
                form.collection = collection;
            };
            if (publisher) {
                form.publisher = publisher;
            };
            if (composer) {
                form.composer = composer;
            };
            if (state.user) {
                form.user = state.user;
            };
            await api.post(`edits`, { data: form });
            if (edits) {
                edits.push(form);
            } else {
                edits = [form];
            }
            clearEditForm();
            { onClose };
            dispatch({
                type: ENotificationActionTypes.SET_MESSAGE,
                payload: {
                    message: 'New ' + fieldDisplay + ' Sent for Review',
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

    const handleError = (form: any) => {
        const newErrors = [];
        if (!form.newContent) {
            newErrors.push({ name: 'newContent', message: 'Enter a new ' + fieldDisplay });
        };
        newErrors.forEach((el) =>
            dispatch({
                type: ENotificationActionTypes.SET_MESSAGE,
                payload: {
                    message: el.message,
                    type: ENotificationTypes.ERROR
                }
            })
        );
        if (newErrors.length > 0) return true;
    };

    const clearEditForm = () => {
        setValue('newContent', '');
        setValue('reason', '');
        localStorage.removeItem('EditForm' + typeDisplay + fieldDisplay);
        { onClose };
    };

    return (
        <Modal
            id={'modalEdit' + typeDisplay + fieldDisplay}
            onClose={onClose}
            isOpen={isOpen}
            clickOutsideEnabled={true}
            layoutClassName='w-full max-h-full mx-[20px] max-w-[350px]'
            crossClassName='w-10 h-10 top-2 right-2'
        >
            <div className='flex gap-2 py-4 pr-12 pl-5'>
                <ImageNext src={IconPencilRed} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
                <p className='pt-1 text-pmdGrayDark'><strong>{fieldDisplay && 'Edit ' + fieldDisplay}</strong></p>
            </div>
            <div className='px-4 pt-4 pb-6 border-pmdGrayLight border-t max-h-screen overflow-auto text-black scrollbar'>
                <Form className='flex flex-col'>
                    <div className='flex flex-col gap-6 pt-2 pb-8'>
                        <div className='grow'>
                            <Label
                                label={'Current ' + fieldDisplay}
                            />
                            <p>{currentContent ? currentContent : 'Unknown ' + fieldDisplay}</p>
                        </div>
                        <div className='grow'>
                            <Field
                                labelEl={<Label
                                    htmlFor='newContent'
                                    label={'New ' + fieldDisplay}
                                    labelRequired={<span className='text-pmdRed'> *</span>}
                                />}
                                name='newContent'
                                component={InputText}
                                control={control}
                                formState={formState}
                                placeholder={'New ' + fieldDisplay}
                                className='!px-5 pt-[17px] pb-4'
                            />
                        </div>
                        <div className='grow'>
                            <Field
                                labelEl={<Label
                                    htmlFor='reason'
                                    label='Reason (Optional)'
                                />}
                                name='reason'
                                component={TextArea}
                                rows={7}
                                control={control}
                                formState={formState}
                                placeholder='Reason for Edit'
                                className='!px-5 pt-[17px] pb-4'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4 bg-pmdGrayBright mt-1 mb-6 px-6 py-4 rounded-lg w-full text-sm text-center'>
                        <p><strong>NOTE:</strong> <em>Edits are not publicly visible until reviewed by staff!</em></p>
                        <p>You can view your edits in <Link href={`/${EUrlsPages.EDIT_HISTORY}`}><a className='text-pmdGray' title='Edit History'>Edit History</a></Link></p>
                    </div>
                    {userName ? (
                        <div className='flex flex-wrap items-center gap-2 mt-3'>
                            <p>This edit will be sent by:</p>
                            <div className='flex flex-wrap items-center gap-2'>
                                <Chip title={userName} />
                                <Link href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}><a title='Edit Account Name'>
                                    <ImageNext
                                        src={IconPencil}
                                        alt=''
                                        height={16}
                                        width={16}
                                        className='z-0'
                                    />
                                </a></Link>
                            </div>
                        </div>
                    ) : ''}
                    <p className='mt-3 mb-8 text-pmdGray text-sm'><em>By sending edits to Piano Music Database, you agree to the <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}><a className='text-pmdGray' title='Terms and Conditions'>terms and conditions</a></Link>.</em></p>
                    <div className='mt-6 mb-8'>
                        <a
                            title='Submit Edit'
                            className='mx-auto !px-4 cursor-pointer button'
                            onClick={handleSubmit(handleEdit)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSubmit(handleEdit);
                                }
                            }}
                            tabIndex={0}
                        >
                            Submit Edit
                        </a>
                    </div>
                </Form>
                {(edits && edits.length > 0 && edits.filter((edit) => edit.attributes.status !== 'Rejected').length > 0 && edits[0].id) && (
                    <>
                        <Divider className='!mb-12' />
                        <div className='flex flex-col mb-10 text-pmdGrayDark'>
                            <p className='mb-2 text-lg'><strong>Edit History</strong></p>
                            <div className='flex flex-col justify-center items-center text-center'>
                                {edits
                                    .filter((edit) => edit.attributes.status !== 'Rejected')
                                    .sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime())
                                    .map((edit: IStrapiEdit) => (
                                        <EditHistory edit={edit} hideType={true} key={edit.id} />
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ModalEdit;
