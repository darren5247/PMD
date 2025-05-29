import { useContext, FC, useEffect, useState } from 'react';
import { AppContext } from '@src/state';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Modal from '@src/components/Modal';
import ImageNext from '@src/components/ImageNext';
import { IconPlusWhite, IconBookmark } from '@src/common/assets/icons';
import api from '@src/api/config';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Field from '@src/components/Field';
import Form from '@src/components/Form';
import InputText from '@src/components/InputText';
import ItemListAdd from '@src/components/ItemListAdd';
import {
    ENotificationActionTypes,
    ENotificationTypes,
    TUserAttributes,
    IStrapiList
} from '@src/types';
import Divider from '@src/components/Divider';

interface ICreateListForm {
    name: string;
    visibility: string;
};

type TCreateListForm = ICreateListForm | FieldValues;

interface IModalListAddToProps {
    isOpen: boolean;
    onClose: () => void;
    workId: number;
    workTitle: string;
};

const ModalListAddTo: FC<IModalListAddToProps> = ({
    isOpen,
    onClose,
    workId,
    workTitle
}): JSX.Element => {
    const router = useRouter();
    const { query } = router;
    const [userId, setUserId] = useState<number | null>(null);
    const [email, setUserEmail] = useState<string | null>(null);
    const [lists, setLists] = useState<IStrapiList[]>([]);
    const [currentPage, setCurrentPage] = useState(Number(query.pageLists) && Number(query.pageLists) > 0 ? Number(query.pageLists) : 1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(Number(query.pageSize) && Number(query.pageSize) > 1 ? Number(query.pageSize) : 10);
    const [isLoadingLists, setIsLoadingLists] = useState(false);
    const [listNameBuffer, setListNameBuffer] = useState<string | null>(null);
    const { control, handleSubmit, formState, reset, register } = useForm<TCreateListForm>();

    const { dispatch } = useContext(AppContext);

    useEffect(
        () => {
            const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
            if (accountData.id) {
                setUserId(accountData.id);
                if (accountData.email) {
                    setUserEmail(accountData.email);
                }
            }

            // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
            const { pageLists } = query;

            // Page
            if (pageLists) setCurrentPage(Number(pageLists as string));

            const getLists = async () => {
                try {
                    setIsLoadingLists(true);
                    const fetchedData = [];
                    const { data } = await api.get(
                        `lists?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=updatedAt:desc&populate[fields][0]=uid&populate[fields][1]=title&populate[fields][2]=description&populate[fields][3]=detail&populate[fields][4]=updatedAt&populate[users][fields][0]=name&populate[owners][fields][1]=name&populate[visibility][fields][2]=currentVisibility&filters[owners][email][$contains]=${accountData.email}`
                    );
                    fetchedData.push(...data?.data);

                    // Get last page if current page is greater than total pages
                    if (data?.meta?.pagination?.pageCount < currentPage && data?.meta?.pagination?.pageCount > 0) {
                        setCurrentPage(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
                        getLists();
                    } else {
                        fetchedData.sort((a, b) => {
                            const orderA = a.attributes.updatedAt || 0;
                            const orderB = b.attributes.updatedAt || 0;
                            if (orderA === orderB) {
                                return a.attributes.title.localeCompare(b.attributes.title);
                            }
                            return orderA - orderB;
                        });
                        fetchedData.forEach(list => {
                            if (list.attributes.works) {
                                list.attributes.works.sort((a: any, b: any) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
                            }
                        });
                        setLists(fetchedData);
                        setTotalPages(data?.meta?.pagination?.pageCount || 1);
                    }
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
                    setLists([]);
                } finally {
                    setIsLoadingLists(false);
                };
            };

            if (isOpen) {
                getLists();

            }
        }, [isOpen, dispatch, email, router, setLists, setIsLoadingLists, setUserEmail, setUserId, currentPage, pageSize, query]
    );

    const submitCreateList: SubmitHandler<TCreateListForm> = ({ name, visibility }) => {
        if (userId !== null && name !== null && name !== undefined && name !== '' && visibility !== null) {
            handleCreateList(name, visibility);
        };
    };

    const handleCreateList = async (name: string, visibility: string) => {
        const uid: number = Math.floor(100000000 + Math.random() * 900000000);
        if (userId !== null && name !== null && name !== undefined && name !== '' && visibility !== null) {
            try {
                const dataAdded = await api.post('lists', {
                    data: {
                        uid: uid,
                        owners: [userId],
                        users: [userId],
                        title: name,
                        visibility: visibility === 'public' ? 3 : visibility === 'unlisted' ? 1 : 2,
                    }
                });
                if (dataAdded !== null && dataAdded !== undefined && dataAdded.data.data.id) {
                    setLists([
                        {
                            id: dataAdded.data.data.id,
                            attributes: {
                                uid: uid.toString(),
                                title: name,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                description: '',
                                details: '',
                                visibility: {
                                    data: {
                                        id: visibility === 'public' ? 3 : visibility === 'unlisted' ? 1 : 2,
                                        attributes: {
                                            currentVisibility: visibility === 'public' ? 'public' : visibility === 'unlisted' ? 'unlisted' : 'private'
                                        }
                                    }
                                },
                                owners: {
                                    data: null
                                },
                                users: {
                                    data: null
                                },
                                list_works: null
                            }
                        },
                        ...lists]
                    );
                    reset();
                    dispatch({
                        type: ENotificationActionTypes.SET_MESSAGE,
                        payload: {
                            message: 'List created successfully!',
                            type: ENotificationTypes.SUCCESS
                        }
                    });
                }
            } catch (error: any) {
                if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
                    dispatch({
                        type: ENotificationActionTypes.SET_MESSAGE,
                        payload: {
                            message: 'Error creating list, please try again.',
                            type: ENotificationTypes.ERROR
                        }
                    });
                } else {
                    dispatch({
                        type: ENotificationActionTypes.SET_MESSAGE,
                        payload: {
                            message: error?.response?.data.error?.message,
                            type: ENotificationTypes.ERROR
                        }
                    });
                };
            }
        } else {
            dispatch({
                type: ENotificationActionTypes.SET_MESSAGE,
                payload: {
                    message: 'Fill in the required fields.',
                    type: ENotificationTypes.ERROR
                }
            });
        };
    };

    const getListsSpecificPage = async () => {
        try {
            setIsLoadingLists(true);
            const fetchedData = [];
            const { data } = await api.get(
                `lists?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=updatedAt:desc&populate[fields][0]=uid&populate[fields][1]=title&populate[fields][2]=description&populate[fields][3]=detail&populate[fields][4]=updatedAt&populate[users][fields][0]=name&populate[owners][fields][1]=name&populate[visibility][fields][2]=currentVisibility&filters[owners][email][$contains]=${email}`
            );
            fetchedData.push(...data?.data);

            // Redirect to last page if current page is greater than total pages
            if (data?.meta?.pagination?.pageCount < currentPage && data?.meta?.pagination?.pageCount > 0) {
                setCurrentPage(data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0 ? data.meta.pagination.pageCount : 1);
                getListsSpecificPage();
            } else {
                fetchedData.sort((a, b) => {
                    const orderA = a.attributes.updatedAt || 0;
                    const orderB = b.attributes.updatedAt || 0;
                    if (orderA === orderB) {
                        return a.attributes.title.localeCompare(b.attributes.title);
                    }
                    return orderA - orderB;
                });
                fetchedData.forEach(list => {
                    if (list.attributes.works) {
                        list.attributes.works.sort((a: any, b: any) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
                    }
                });
                setLists(fetchedData);
                setTotalPages(data?.meta?.pagination?.pageCount || 1);
            }
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
            setLists([]);
        } finally {
            setIsLoadingLists(false);
        };
    };

    return (
        <Modal
            id='ModalListAddTo'
            onClose={onClose}
            isOpen={isOpen}
            layoutClassName='w-full h-auto max-h-screen mx-[20px] max-w-[420px] text-black text-center flex flex-col justify-center items-center'
            crossClassName='w-10 h-10 top-[9px] right-2'
        >
            <div className='flex justify-start items-center gap-3 py-4 pr-12 pl-5 w-full text-left align-middle'>
                <ImageNext src={IconBookmark} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
                <p className='mr-4 text-pmdGrayDark'><strong>Add to Your Lists</strong></p>
            </div>
            <div className='pt-6 border-pmdGrayLight border-t max-h-screen overflow-y-auto scrollbar'>
                <div className='flex flex-col justify-center items-center gap-4 w-full text-center align-middle'>
                    <p className='px-3 text-center'>
                        Piece being added to your lists:
                    </p>
                    <p className='px-3 font-medium text-lg text-center'>
                        {workTitle}
                    </p>
                    <Divider />
                    <div id='lists-list' className='flex flex-col flex-wrap justify-center items-center w-full max-w-[1100px]'>
                        {isLoadingLists ? (
                            <p className='px-3'>Loading your lists...</p>
                        ) : (
                            lists.length > 0 ? (
                                <section id='yourLists' className='flex flex-col justify-center items-center gap-2 mx-auto text-center align-middle'>
                                    <h3 id='your-lists' className='px-3'>Your Lists</h3>
                                    <p className='px-3 text-center'>
                                        Add to your lists by clicking on the list:
                                    </p>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-col justify-center items-stretch gap-6 max-[410px]:gap-10 my-6 min-[410px]:my-4 text-center align-middle'>
                                            {lists && lists[0].attributes.visibility && lists.map((list, index) => (
                                                <ItemListAdd key={index} workId={workId} list={list} />
                                            ))}
                                            {lists.length > 9 && (
                                                <div className='flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm'>
                                                    <a
                                                        onClick={() => currentPage !== 1 && setCurrentPage(1) && getListsSpecificPage()}
                                                        title='First Page'
                                                        className={cn(
                                                            currentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                        )}
                                                    >
                                                        First
                                                    </a>
                                                    <a
                                                        onClick={() => currentPage !== 1 && setCurrentPage(currentPage - 1) && getListsSpecificPage()}
                                                        title='Previous Page'
                                                        className={cn(
                                                            currentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                        )}
                                                    >
                                                        Prev
                                                    </a>
                                                    <span className='mx-2'>{currentPage} of {totalPages}</span>
                                                    <a
                                                        onClick={() => currentPage !== totalPages && setCurrentPage(currentPage + 1) && getListsSpecificPage()}
                                                        title='Next Page'
                                                        className={cn(
                                                            currentPage === totalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                        )}
                                                    >
                                                        Next
                                                    </a>
                                                    <a
                                                        onClick={() => currentPage !== totalPages && setCurrentPage(totalPages) && getListsSpecificPage()}
                                                        title='Last Page'
                                                        className={cn(
                                                            currentPage === totalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                                                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                                                        )}
                                                    >
                                                        Last
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <div className='flex flex-col justify-center items-center gap-2 text-center align-middle'>
                                    <p className='px-3'>No Lists!</p>
                                </div>
                            )
                        )}
                    </div>
                    <Divider />
                    <div className='flex flex-col justify-center items-center gap-1 mt-4 mb-2 px-3 text-center align-middle'>
                        <h3 id='create-new-list'>Create A New List</h3>
                        <div className='flex flex-col justify-center items-center gap-3 text-center align-middle'>
                            <Form onSubmit={handleSubmit(submitCreateList)}>
                                <div className='flex gap-2 w-full h-full grow'>
                                    <div className='flex justify-start mb-1 ml-2 text-pmdGray text-sm'>
                                        <p>{listNameBuffer ? listNameBuffer.length : 0}/144</p>
                                    </div>
                                </div>
                                <div className='relative flex max-[298px]:flex-col justify-start max-[298px]:justify-center items-start max-[298px]:items-center gap-1 text-left max-[298px]:text-center align-middle'>
                                    <div className='relative flex flex-col justify-start items-start gap-1 text-left align-top'>
                                        <div className='flex flex-col justify-center items-center gap-2 text-center align-middle'>
                                            <Field
                                                name='name'
                                                component={InputText}
                                                control={control}
                                                formState={formState}
                                                required
                                                placeholder='Name'
                                                className='pt-[13px] pr-3 pb-[13px] !pl-5'
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setListNameBuffer(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='relative flex flex-col justify-center items-center text-center align-middle'>
                                        <div className='flex flex-col justify-center items-center text-center align-middle'>
                                            <select
                                                id='visibility'
                                                {...register('visibility')}
                                                className='px-3 py-3.5 rounded-md w-full text-sm cursor-pointer'
                                                required
                                                defaultValue='unlisted'
                                            >
                                                <option value='public'>Public</option>
                                                <option value='unlisted'>Unlisted</option>
                                                <option value='private'>Private</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-3 mt-2 mb-12 w-full text-center align-middle'>
                                    <button title='Create List' className='flex justify-center items-center gap-2 mx-auto !px-2 !py-1 w-full !font-medium text-center align-middle cursor-pointer button' type='submit'>
                                        <ImageNext src={IconPlusWhite} alt='' height={16} width={16} />
                                        <p>Create List</p>
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalListAddTo;