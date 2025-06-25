import { FC, useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import apiImage from '@src/api/configImage';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Field from '@src/components/Field';
import MultipleAutocomplete from '@src/components/MultipleAutocomplete';
import InputText from '@src/components/InputText';
import TextArea from '@src/components/TextArea';
import Label from '@src/components/Label';
import Divider from '@src/components/Divider';
import Chip from '@src/components/Chip';
import ImageNext from '@src/components/ImageNext';
import ImagePicture from '@src/components/ImagePicture';
import Link from 'next/link';
import {
  IconPencilRed,
  IconPlus,
  IconPlusWhite,
  IconPlusGrayBright,
  IconChevronUpWhite,
  IconFeedback,
  IconDelete
} from '@src/common/assets/icons';

import {
  EPublisher,
  publisherRules,
  ECollection,
  defaultPublisherValues,
  EUrlsPages
} from '@src/constants';

import {
  ENotificationActionTypes,
  ENotificationTypes,
  IError,
  IDataName,
  IDataTitle,
  TUserAttributes
} from '@src/types';

import {
  ModalResetAddPublisherForm,
  ModalFeedback,
  ModalImageUploading
} from '@src/components/Modals';

interface IAddPublisherForm {
  [EPublisher.name]: string;
  [EPublisher.nationality]: string;
  [EPublisher.excerpt]: string;
  [EPublisher.urlSpotify]: string;
  [EPublisher.urlAppleMusic]: string;
  [EPublisher.urlWebsite]: string;
  [EPublisher.urlSocialInstagram]: string;
  [EPublisher.urlSocialFacebook]: string;
  [EPublisher.urlSocialX]: string;
  [EPublisher.urlSocialLinkedIn]: string;
  [EPublisher.urlSocialYouTube]: string;
  [EPublisher.collections]: ECollection[];
};

type TAddPublisherForm = IAddPublisherForm | FieldValues;

const AddPublisher: FC = (): JSX.Element => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [firstControlValue, setFirstControlValue] = useState(defaultPublisherValues);
  const [errors, setErrors] = useState<IError[]>([]);
  const handleIsOpenClearModal = () => setIsOpenClearModal(!isOpenClearModal);
  const [isOpenClearModal, setIsOpenClearModal] = useState(false);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(true);
  const { control, handleSubmit, formState, setValue, watch } = useForm<TAddPublisherForm>();
  const [userName, setUserName] = useState<string | null>(null);

  const [isName, setIsName] = useState(false);
  const [nameText, setNameText] = useState<string | ''>('');
  const [isNameOverLimit, setIsNameOverLimit] = useState(false);
  const [isNationalityOverLimit, setIsNationalityOverLimit] = useState(false);
  const [isExcerptOverLimit, setIsExcerptOverLimit] = useState(false);
  const [isURLSpotifyOverLimit, setIsURLSpotifyOverLimit] = useState(false);
  const [isURLAppleMusicOverLimit, setIsURLAppleMusicOverLimit] = useState(false);
  const [isURLWebsiteOverLimit, setIsURLWebsiteOverLimit] = useState(false);
  const [isURLSocialInstagramOverLimit, setIsURLSocialInstagramOverLimit] = useState(false);
  const [isURLSocialFacebookOverLimit, setIsURLSocialFacebookOverLimit] = useState(false);
  const [isURLSocialXOverLimit, setIsURLSocialXOverLimit] = useState(false);
  const [isURLSocialLinkedInOverLimit, setIsURLSocialLinkedInOverLimit] = useState(false);
  const [isURLSocialYouTubeOverLimit, setIsURLSocialYouTubeOverLimit] = useState(false);

  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [dirtyCollections, setDirtyCollections] = useState<IDataTitle[]>([]);
  const [collections, setCollections] = useState<string[] | null>(null);
  const [collectionsOptions, setCollectionsOptions] = useState<string[] | null>(null);
  const [collectionsOptionsLength, setCollectionsOptionsLength] = useState<string | null>(null);

  const [isOpenModalImageUploading, setIsOpenModalImageUploading] = useState(false);
  const handleIsOpenModalImageUploading = () => setIsOpenModalImageUploading(!isOpenModalImageUploading);
  const [file, setFile] = useState<File>();

  const handleFile = (image: File) => {
    setFile(image);
    console.log(image);
  };


  useEffect(() => {
    const addPublisherData = JSON.parse(localStorage.getItem('addPublisherForm') || '{}');

    if (addPublisherData) {
      if (addPublisherData.name) {
        setIsName(true);
        setNameText(addPublisherData.name);
        setValue(EPublisher.name, addPublisherData.name);
        if (addPublisherData.name.length > 100) {
          setIsNameOverLimit(true);
        } else {
          setIsNameOverLimit(false);
        }
      };
      if (addPublisherData.nationality) {
        setValue(EPublisher.nationality, addPublisherData.nationality);
        if (addPublisherData.nationality.length > 100) {
          setIsNationalityOverLimit(true);
        } else {
          setIsNationalityOverLimit(false);
        }
      };
      if (addPublisherData.excerpt) {
        setValue(EPublisher.excerpt, addPublisherData.excerpt);
        if (addPublisherData.excerpt.length > 250) {
          setIsExcerptOverLimit(true);
        } else {
          setIsExcerptOverLimit(false);
        }
      };
      if (addPublisherData.urlSpotify) {
        setValue(EPublisher.urlSpotify, addPublisherData.urlSpotify);
        if (addPublisherData.urlSpotify.length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        }
      };
      if (addPublisherData.urlAppleMusic) {
        setValue(EPublisher.urlAppleMusic, addPublisherData.urlAppleMusic);
        if (addPublisherData.urlAppleMusic.length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        }
      };
      if (addPublisherData.urlWebsite) {
        setValue(EPublisher.urlWebsite, addPublisherData.urlWebsite);
        if (addPublisherData.urlWebsite.length > 250) {
          setIsURLWebsiteOverLimit(true);
        } else {
          setIsURLWebsiteOverLimit(false);
        }
      };
      if (addPublisherData.urlSocialInstagram) {
        setValue(EPublisher.urlSocialInstagram, addPublisherData.urlSocialInstagram);
        if (addPublisherData.urlSocialInstagram.length > 250) {
          setIsURLSocialInstagramOverLimit(true);
        } else {
          setIsURLSocialInstagramOverLimit(false);
        }
      };
      if (addPublisherData.urlSocialFacebook) {
        setValue(EPublisher.urlSocialFacebook, addPublisherData.urlSocialFacebook);
        if (addPublisherData.urlSocialFacebook.length > 250) {
          setIsURLSocialFacebookOverLimit(true);
        } else {
          setIsURLSocialFacebookOverLimit(false);
        }
      };
      if (addPublisherData.urlSocialX) {
        setValue(EPublisher.urlSocialX, addPublisherData.urlSocialX);
        if (addPublisherData.urlSocialX.length > 250) {
          setIsURLSocialXOverLimit(true);
        } else {
          setIsURLSocialXOverLimit(false);
        }
      };
      if (addPublisherData.urlSocialLinkedIn) {
        setValue(EPublisher.urlSocialLinkedIn, addPublisherData.urlSocialLinkedIn);
        if (addPublisherData.urlSocialLinkedIn.length > 250) {
          setIsURLSocialLinkedInOverLimit(true);
        } else {
          setIsURLSocialLinkedInOverLimit(false);
        }
      };
      if (addPublisherData.urlSocialYouTube) {
        setValue(EPublisher.urlSocialYouTube, addPublisherData.urlSocialYouTube);
        if (addPublisherData.urlSocialYouTube.length > 250) {
          setIsURLSocialYouTubeOverLimit(true);
        } else {
          setIsURLSocialYouTubeOverLimit(false);
        }
      };
      if (addPublisherData.collections && addPublisherData.collections.length > 0) {
        setCollections(addPublisherData.collections?.map((item: IDataName) => item));
      };
    };

    const getCollections = async () => {
      const addPublisherData = JSON.parse(localStorage.getItem('addPublisherForm') || '{}');
      try {
        setIsLoadingCollections(true);
        const fetchedData = [];
        const { data } = await api.get(
          'collections?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview'
        );
        fetchedData.push(...data?.data);
        setCollectionsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `collections?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview`
            );
            fetchedData.push(...response.data.data);
            setCollectionsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyCollections(fetchedData);
        if (fetchedData) {
          const cleanCollections = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanCollections?.filter((collection: string) => {
            if (addPublisherData && addPublisherData.collections && addPublisherData.collections.length > 0) {
              return !addPublisherData.collections.some((collectionParsed: string) => collectionParsed === collection)
            } else {
              return true;
            };
          });
          setCollectionsOptions(filteredData);
        } else {
          setCollectionsOptions(null);
        };
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
      } finally {
        setIsLoadingCollections(false);
      };
    };

    getCollections();

    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      if (accountData.name) {
        setUserName(accountData.name);
      };
    } else {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search + window.location.hash);
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    };
  }, [router, dispatch, setValue]);

  const getCollections = async () => {
    const addPublisherData = JSON.parse(localStorage.getItem('addPublisherForm') || '{}');
    try {
      setIsLoadingCollections(true);
      const fetchedData = [];
      const { data } = await api.get(
        'collections?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview'
      );
      fetchedData.push(...data?.data);
      setCollectionsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `collections?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview`
          );
          fetchedData.push(...response.data.data);
          setCollectionsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyCollections(fetchedData);
      if (fetchedData) {
        const cleanCollections = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanCollections?.filter((collection: string) => {
          if (addPublisherData && addPublisherData.collections && addPublisherData.collections.length > 0) {
            return !addPublisherData.collections.some((collectionParsed: string) => collectionParsed === collection)
          } else {
            return true;
          };
        });
        setCollectionsOptions(filteredData);
      } else {
        setCollectionsOptions(null);
      };
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
    } finally {
      setIsLoadingCollections(false);
    };
  };

  const handleCollections = (collectionsRaw: string[]) => {
    if (!(collectionsRaw === collections)) {
      setCollections(collectionsRaw);
    }
    const localData = localStorage.getItem('addPublisherForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyCollections?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const collectionsParsed = parsedLocalData.collectionsRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !collectionsParsed?.some((collection: IDataTitle) => collection?.attributes?.title === item);
      });
      setCollectionsOptions(filteredData);
    }
    localStorage.setItem(
      'addPublisherForm',
      JSON.stringify({
        ...parsedLocalData,
        [EPublisher.collections]: collectionsRaw
      })
    );
  };

  const handleAddPublisher: SubmitHandler<TAddPublisherForm> = (data) => {
    let form = {
      ...data,
      [EPublisher.collections]: collections
    };

    if (form && isSubmitAllowed) {
      if (!handleError(form)) {
        setIsSubmitAllowed(false);
        handleData(form);
      } else {
        setIsSubmitAllowed(true);
      };
    };
  };

  const handleData = async (form: any) => {
    try {
      const preparedForm = preparedFormData(form);
      const data = await api.post('publishers', { data: preparedForm },);
      if (data && data?.data?.data?.id && file) {
        handleImageData(data)
      };
      clearAddPublisherForm();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: `"${data?.data.data.attributes?.name}" Added Successfully`,
          type: ENotificationTypes.SUCCESS
        }
      });
      router.push(`/${EUrlsPages.ADDED_PUBLISHER}`, undefined, { shallow: false });
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

  const handleImageData = async (data: any) => {
    try {
      if (data && data?.data?.data?.id && file) {
        setIsOpenModalImageUploading(true);
        console.log(file);
        const formData = new FormData();
        formData.append('field', 'image');
        formData.append('files', file);
        formData.append('path', 'uploads/publishers');
        formData.append('ref', 'api::publisher.publisher');
        formData.append('refId', data?.data.data.id);
        console.log(formData);
        const dataImage = await apiImage.post('upload', formData);
        console.log(dataImage);
        if (dataImage && dataImage?.request?.status === 200) {
          setIsOpenModalImageUploading(false);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Publisher Image Uploaded Successfully',
              type: ENotificationTypes.SUCCESS
            }
          });
        };
      };
    } catch (error: any) {
      if (error?.response?.data) {
        setIsOpenModalImageUploading(false);
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.error?.message,
            type: ENotificationTypes.ERROR
          }
        });
      };
      setIsSubmitAllowed(true);
    };
  };

  const prepareForm = (
    data: any,
    dirtyCollections: IDataTitle[]
  ) => {
    const form = { ...data };
    form[EPublisher.collections] = dirtyCollections
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.collections?.length; i++) {
          if (item.attributes.title === data.collections[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    if (form[EPublisher.name] && data.name) {
      form[EPublisher.name] = data.name.trim();
    };
    if (form[EPublisher.nationality] && data.nationality) {
      form[EPublisher.nationality] = data.nationality.trim();
    };
    if (form[EPublisher.excerpt] && data.excerpt) {
      form[EPublisher.excerpt] = data.excerpt.trim();
    };
    if (form[EPublisher.urlSpotify] && data.urlSpotify) {
      form[EPublisher.urlSpotify] = data.urlSpotify.trim();
    };
    if (form[EPublisher.urlAppleMusic] && data.urlAppleMusic) {
      form[EPublisher.urlAppleMusic] = data.urlAppleMusic.trim();
    };
    if (form[EPublisher.urlWebsite] && data.urlWebsite) {
      form[EPublisher.urlWebsite] = data.urlWebsite.trim();
    };
    if (form[EPublisher.urlSocialInstagram] && data.urlSocialInstagram) {
      form[EPublisher.urlSocialInstagram] = data.urlSocialInstagram.trim();
    };
    if (form[EPublisher.urlSocialFacebook] && data.urlSocialFacebook) {
      form[EPublisher.urlSocialFacebook] = data.urlSocialFacebook.trim();
    };
    if (form[EPublisher.urlSocialX] && data.urlSocialX) {
      form[EPublisher.urlSocialX] = data.urlSocialX.trim();
    };
    if (form[EPublisher.urlSocialLinkedIn] && data.urlSocialLinkedIn) {
      form[EPublisher.urlSocialLinkedIn] = data.urlSocialLinkedIn.trim();
    };
    if (form[EPublisher.urlSocialYouTube] && data.urlSocialYouTube) {
      form[EPublisher.urlSocialYouTube] = data.urlSocialYouTube.trim();
    };
    form.publishedAt = null;
    form.adminReview = 'For Review';
    if (state.user) {
      form.users = state.user;
    };
    return form;
  };

  const preparedFormData = (data: any) => {
    const reforgedData = prepareForm(
      data,
      dirtyCollections
    );
    return reforgedData;
  };

  useEffect(() => {
    const subscription = watch((data: any) => {
      const localData = localStorage.getItem('addPublisherForm');

      if (localData) {
        const parsedLocalData = JSON.parse(localData);
        localStorage.setItem(
          'addPublisherForm',
          JSON.stringify({
            ...parsedLocalData,
            ...data,
            [EPublisher.name]: data[EPublisher.name] ? data[EPublisher.name] : parsedLocalData.name,
            [EPublisher.nationality]: data[EPublisher.nationality] ? data[EPublisher.nationality] : parsedLocalData.nationality,
            [EPublisher.excerpt]: data[EPublisher.excerpt] ? data[EPublisher.excerpt] : parsedLocalData.excerpt,
            [EPublisher.collections]: collections ? collections : parsedLocalData.collections,
            [EPublisher.urlSpotify]: data[EPublisher.urlSpotify] ? data[EPublisher.urlSpotify] : parsedLocalData.urlSpotify,
            [EPublisher.urlAppleMusic]: data[EPublisher.urlAppleMusic] ? data[EPublisher.urlAppleMusic] : parsedLocalData.urlAppleMusic,
            [EPublisher.urlWebsite]: data[EPublisher.urlWebsite] ? data[EPublisher.urlWebsite] : parsedLocalData.urlWebsite,
            [EPublisher.urlSocialInstagram]: data[EPublisher.urlSocialInstagram] ? data[EPublisher.urlSocialInstagram] : parsedLocalData.urlSocialInstagram,
            [EPublisher.urlSocialFacebook]: data[EPublisher.urlSocialFacebook] ? data[EPublisher.urlSocialFacebook] : parsedLocalData.urlSocialFacebook,
            [EPublisher.urlSocialX]: data[EPublisher.urlSocialX] ? data[EPublisher.urlSocialX] : parsedLocalData.urlSocialX,
            [EPublisher.urlSocialLinkedIn]: data[EPublisher.urlSocialLinkedIn] ? data[EPublisher.urlSocialLinkedIn] : parsedLocalData.urlSocialLinkedIn,
            [EPublisher.urlSocialYouTube]: data[EPublisher.urlSocialYouTube] ? data[EPublisher.urlSocialYouTube] : parsedLocalData.urlSocialYouTube
          })
        );
      } else {
        localStorage.setItem(
          'addPublisherForm',
          JSON.stringify({
            ...data,
            [EPublisher.collections]: (collections && collections?.length > 0) ? collections : null
          })
        );
      };

      if (data[EPublisher.name]) {
        setIsName(true);
        if (data[EPublisher.name].length > 100) {
          setIsNameOverLimit(true);
        } else {
          setIsNameOverLimit(false);
        }
      } else {
        setIsName(false);
      };
      if (data[EPublisher.nationality]) {
        if (data[EPublisher.nationality].length > 1000) {
          setIsNationalityOverLimit(true);
        } else {
          setIsNationalityOverLimit(false);
        }
      };
      if (data[EPublisher.excerpt]) {
        if (data[EPublisher.excerpt].length > 1000) {
          setIsExcerptOverLimit(true);
        } else {
          setIsExcerptOverLimit(false);
        }
      };
      if (data[EPublisher.urlSpotify]) {
        if (data[EPublisher.urlSpotify].length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        };
      };
      if (data[EPublisher.urlAppleMusic]) {
        if (data[EPublisher.urlAppleMusic].length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        };
      };
      if (data[EPublisher.urlWebsite]) {
        if (data[EPublisher.urlWebsite].length > 250) {
          setIsURLWebsiteOverLimit(true);
        } else {
          setIsURLWebsiteOverLimit(false);
        };
      };
      if (data[EPublisher.urlSocialInstagram]) {
        if (data[EPublisher.urlSocialInstagram].length > 250) {
          setIsURLSocialInstagramOverLimit(true);
        } else {
          setIsURLSocialInstagramOverLimit(false);
        };
      };
      if (data[EPublisher.urlSocialFacebook]) {
        if (data[EPublisher.urlSocialFacebook].length > 250) {
          setIsURLSocialFacebookOverLimit(true);
        } else {
          setIsURLSocialFacebookOverLimit(false);
        };
      };
      if (data[EPublisher.urlSocialX]) {
        if (data[EPublisher.urlSocialX].length > 250) {
          setIsURLSocialXOverLimit(true);
        } else {
          setIsURLSocialXOverLimit(false);
        };
      };
      if (data[EPublisher.urlSocialLinkedIn]) {
        if (data[EPublisher.urlSocialLinkedIn].length > 250) {
          setIsURLSocialLinkedInOverLimit(true);
        } else {
          setIsURLSocialLinkedInOverLimit(false);
        };
      };
      if (data[EPublisher.urlSocialYouTube]) {
        if (data[EPublisher.urlSocialYouTube].length > 250) {
          setIsURLSocialYouTubeOverLimit(true);
        } else {
          setIsURLSocialYouTubeOverLimit(false);
        };
      };

      setFirstControlValue((prevState) => ({
        ...prevState,
        [EPublisher.name]: data[EPublisher.name],
        [EPublisher.nationality]: data[EPublisher.nationality],
        [EPublisher.excerpt]: data[EPublisher.excerpt],
        [EPublisher.urlSpotify]: data[EPublisher.urlSpotify],
        [EPublisher.urlAppleMusic]: data[EPublisher.urlAppleMusic],
        [EPublisher.urlWebsite]: data[EPublisher.urlWebsite],
        [EPublisher.urlSocialInstagram]: data[EPublisher.urlSocialInstagram],
        [EPublisher.urlSocialFacebook]: data[EPublisher.urlSocialFacebook],
        [EPublisher.urlSocialX]: data[EPublisher.urlSocialX],
        [EPublisher.urlSocialLinkedIn]: data[EPublisher.urlSocialLinkedIn],
        [EPublisher.urlSocialYouTube]: data[EPublisher.urlSocialYouTube]
      }));
    });

    return () => subscription.unsubscribe();
  }, [watch, setFirstControlValue, collections, setValue]);

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in publisherRules) {
      if (!publisherRules[key].rule(form[key]))
        newErrors.push({ name: key, message: publisherRules[key].message });
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
    setErrors(newErrors);
    if (newErrors.length > 0) return true;
  };

  const clearAddPublisherForm = () => {
    setIsName(false);
    setNameText('');
    setValue(EPublisher.name, '');
    setValue(EPublisher.nationality, '');
    setValue(EPublisher.excerpt, '');
    setValue(EPublisher.urlSpotify, '');
    setValue(EPublisher.urlAppleMusic, '');
    setValue(EPublisher.urlWebsite, '');
    setValue(EPublisher.urlSocialInstagram, '');
    setValue(EPublisher.urlSocialFacebook, '');
    setValue(EPublisher.urlSocialX, '');
    setValue(EPublisher.urlSocialLinkedIn, '');
    setValue(EPublisher.urlSocialYouTube, '');
    setCollections(null);
    setCollectionsOptions(null);
    getCollections();
    setFile(undefined);
    (document.getElementById('publisherImage') as HTMLInputElement).value = '';
    localStorage.removeItem('addPublisherForm');
    scrollTo(0, 0);
    setIsSubmitAllowed(true);
  };

  return (
    <>
      <div id='feedback' className='flex flex-row flex-wrap justify-center items-center gap-x-5 gap-y-2 bg-pmdGrayBright mb-3 px-3 py-8 rounded-lg w-full text-center'>
        <p>Got feedback, questions, or suggestions?</p>
        <a
          title='Send Feedback'
          onClick={() => { setShowModalFeedback(true); }}
          className='flex flex-row gap-2 cursor-pointer'
        >
          <ImageNext
            src={IconFeedback}
            alt=''
            height={20}
            width={20}
            className='z-0'
          />
          <strong>Send Feedback</strong>
        </a>
        <ModalFeedback
          type={nameText ? ('Add Publisher Disclaimer - ' + nameText) : firstControlValue[EPublisher.name] ? ('Add Publisher Disclaimer - ' + firstControlValue[EPublisher.name]) : 'Add Publisher Disclaimer - No Name Yet'}
          url={`${EUrlsPages.ADD_PUBLISHER}`}
          onClose={() => { setShowModalFeedback(false); }}
          isOpen={showModalFeedback}
        />
      </div>
      <Divider className='mt-0 mb-0' />
      <div className='flex flex-col gap-y-6 pt-2 pb-8'>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.name}
              label='Name'
              labelRequired={<span className='text-pmdRed'> *</span>}
            />}
            name={EPublisher.name}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='Name'
            className='!px-5 pt-[17px] pb-4'
            error={!isName || isNameOverLimit}
          />
          {isNameOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Name is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.nationality}
              label='Nationality'
            />}
            name={EPublisher.nationality}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='Nationality'
            className='!px-5 pt-[17px] pb-4'
            error={isNationalityOverLimit}
          />
          {isNationalityOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Nationality is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.excerpt}
              label='Description'
            />}
            name={EPublisher.excerpt}
            component={TextArea}
            rows={7}
            control={control}
            formState={formState}
            placeholder='Description (max 1000 characters)'
            className='!px-5 pt-[17px] pb-4'
            error={isExcerptOverLimit}
          />
          {isExcerptOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Description is too long (Max 1000 characters)
            </p>
          )}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.urlSpotify}
              label='Spotify Link'
            />}
            name={EPublisher.urlSpotify}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='https://open.spotify.com/track/__'
            className='!px-5 pt-[17px] pb-4'
            error={isURLSpotifyOverLimit}
          />
          {isURLSpotifyOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Spotify Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.urlAppleMusic}
              label='Apple Music Link'
            />}
            name={EPublisher.urlAppleMusic}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='https://music.apple.com/__/artist/__/__'
            className='!px-5 pt-[17px] pb-4'
            error={isURLAppleMusicOverLimit}
          />
          {isURLAppleMusicOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Apple Music Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.urlWebsite}
              label='Custom Link'
            />}
            name={EPublisher.urlWebsite}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='https://example.com/publisher'
            className='!px-5 pt-[17px] pb-4'
            error={isURLWebsiteOverLimit}
          />
          {isURLWebsiteOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Custom Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className='flex flex-wrap gap-6 grow'>
          <div className='grow'>
            <Field
              labelEl={<Label
                htmlFor={EPublisher.urlSocialInstagram}
                label='Instagram Link'
              />}
              name={EPublisher.urlSocialInstagram}
              component={InputText}
              control={control}
              formState={formState}
              placeholder='https://instagram.com/__'
              className='!px-5 pt-[17px] pb-4'
              error={isURLSocialInstagramOverLimit}
            />
            {isURLSocialInstagramOverLimit && (
              <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
                Instagram Link is too long (Max 250 characters)
              </p>
            )}
          </div>
          <div className='grow'>
            <Field
              labelEl={<Label
                htmlFor={EPublisher.urlSocialFacebook}
                label='Facebook Link'
              />}
              name={EPublisher.urlSocialFacebook}
              component={InputText}
              control={control}
              formState={formState}
              placeholder='https://facebook.com/__'
              className='!px-5 pt-[17px] pb-4'
              error={isURLSocialFacebookOverLimit}
            />
            {isURLSocialFacebookOverLimit && (
              <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
                Facebook Link is too long (Max 250 characters)
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-wrap gap-6 grow'>
          <div className='grow'>
            <Field
              labelEl={<Label
                htmlFor={EPublisher.urlSocialX}
                label='X/Twitter Link'
              />}
              name={EPublisher.urlSocialX}
              component={InputText}
              control={control}
              formState={formState}
              placeholder='https://x.com/__'
              className='!px-5 pt-[17px] pb-4'
              error={isURLSocialXOverLimit}
            />
            {isURLSocialXOverLimit && (
              <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
                X/Twitter Link is too long (Max 250 characters)
              </p>
            )}
          </div>
          <div className='grow'>
            <Field
              labelEl={<Label
                htmlFor={EPublisher.urlSocialLinkedIn}
                label='LinkedIn Link'
              />}
              name={EPublisher.urlSocialLinkedIn}
              component={InputText}
              control={control}
              formState={formState}
              placeholder='https://linkedin.com/in/__'
              className='!px-5 pt-[17px] pb-4'
              error={isURLSocialLinkedInOverLimit}
            />
            {isURLSocialLinkedInOverLimit && (
              <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
                LinkedIn Link is too long (Max 250 characters)
              </p>
            )}
          </div>
        </div>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EPublisher.urlSocialYouTube}
              label='YouTube Channel Link'
            />}
            name={EPublisher.urlSocialYouTube}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='https://youtube.com/user/__ or https://youtube.com/@__'
            className='!px-5 pt-[17px] pb-4'
            error={isURLSocialYouTubeOverLimit}
          />
          {isURLSocialYouTubeOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              YouTube Channel Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <Divider className='mt-0 mb-0' />
        <div
          id='InputImage'
          className='flex flex-col grow'
        >
          <Label
            htmlFor='publisherImage'
            label='Publisher Image'
            desc='JPG/PNG, Max File Size 2MB, Max Height 600px, Max Width 600px'
          />
          <p className='mb-2 text-red-300 text-xs'>Please crop the image to under 600x600px BEFORE uploading. <br/>Cropping upon upload is coming soon.</p>
          <div className='flex flex-row justify-center items-center w-full text-left'>
            <input
              type='file'
              id='publisherImage'
              name='publisherImage'
              accept='image/png, image/jpeg'
              autoComplete='off'
              className='!flex !justify-center !items-center hover:bg-pmdGrayBright px-5 py-5 border border-pmdGray rounded-lg focus-visible:outline-0 w-full !text-pmdGray hover:text-pmdGrayDark placeholder:text-pmdGray text-sm !text-left tracking-thigh cursor-pointer'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 2097152) {
                  if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    const img = new window.Image();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      img.src = event.target?.result as string;
                      img.onload = () => {
                        if (img.width <= 600 || img.height <= 600) {
                          handleFile(file);
                        } else {
                          dispatch({
                            type: ENotificationActionTypes.SET_MESSAGE,
                            payload: {
                              message: 'Image is too large (Max 600x600px)',
                              type: ENotificationTypes.ERROR
                            }
                          });
                        }
                      };
                    };
                    reader.readAsDataURL(file);
                  } else {
                    dispatch({
                      type: ENotificationActionTypes.SET_MESSAGE,
                      payload: {
                        message: 'Image is the wrong format (JPG/PNG)',
                        type: ENotificationTypes.ERROR
                      }
                    });
                  }
                } else {
                  dispatch({
                    type: ENotificationActionTypes.SET_MESSAGE,
                    payload: {
                      message: 'Image file size is too large (Max 2MB)',
                      type: ENotificationTypes.ERROR
                    }
                  });
                }
              }}
            />
          </div>
          {(file && file.name) && (
            <div id={'UploadedImage-' + file.name} className='flex mt-2 w-full'>
              <div className='flex flex-col bg-pmdGrayBright rounded-lg'>
                <ImagePicture
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className='object-contain'
                  layout='fixed'
                  height={90}
                  width={90}
                />
                <p className='px-3 pt-2 text-pmdGray text-xs'>{file.name}</p>
                <a
                  onClick={() => setFile(undefined)}
                  title='Remove Image'
                  className='flex justify-center items-center gap-2 px-3 py-2 text-pmdRed text-xs cursor-pointer'
                >
                  <ImageNext src={IconDelete} height={12} width={12} />
                  Remove
                </a>
              </div>
            </div>
          )}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingCollections ? (
            <p>Loading {(collectionsOptionsLength) && (collectionsOptionsLength)} Collections...</p>
          ) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <Label
                    htmlFor={EPublisher.collections}
                    label='Collection(s)'
                  />
                }
                name={EPublisher.collections}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Collection(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={collectionsOptions}
                setValues={handleCollections}
                values={collections}
                onFilter={setCollectionsOptions}
              />
              <Link
                href={`/${EUrlsPages.ADD_COLLECTION}`}
              >
                <a
                  title='Add New Collection'
                  className='flex gap-2 mt-4 text-sm cursor-pointer'
                >
                  <ImageNext src={IconPlus} height={16} width={16} />
                  <em>Add New Collection</em>
                </a>
              </Link>
            </div>
          </>)}
        </div>
      </div>
      {userName && (
        <>
          <div className='flex flex-wrap items-center gap-2 mt-6'>
            <p>This publisher is being added by:</p>
            <div className='flex flex-wrap items-center gap-2'>
              <Chip title={userName} />
              <Link href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}><a title='Edit Account Name'>
                <ImageNext
                  src={IconPencilRed}
                  alt=''
                  height={16}
                  width={16}
                  className='z-0'
                />
              </a></Link>
            </div>
            <div className='flex flex-col gap-y-4 bg-pmdGrayBright mt-3 px-6 py-4 rounded-lg w-full text-sm text-center'>
              <p><strong>NOTE:</strong> <em>New publishers are not publicly visible until reviewed by staff!</em></p>
              <p>You can view the status of your added publishers in <Link href={`/${EUrlsPages.PUBLISHERS_ADDED}`}><a className='text-pmdGray' title='Publishers Added'>Publishers Added</a></Link></p>
            </div>
            <p className='mt-3 mb-8 text-pmdGray text-sm'><em>By adding a publisher to Piano Music Database, you agree to the <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}><a className='text-pmdGray' title='Terms and Conditions'>terms and conditions</a></Link>.</em></p>
            {firstControlValue[EPublisher.name] || isName ? (
              (!(isNameOverLimit || isNationalityOverLimit || isExcerptOverLimit || isURLSpotifyOverLimit || isURLAppleMusicOverLimit || isURLWebsiteOverLimit || isURLSocialInstagramOverLimit || isURLSocialFacebookOverLimit || isURLSocialXOverLimit || isURLSocialLinkedInOverLimit || isURLSocialYouTubeOverLimit)) ? (
                <div className='flex flex-col gap-4 w-full'>
                  <button
                    type='button'
                    title='Submit New Publisher'
                    className='mx-auto mb-6 cursor-pointer button'
                    onClick={handleSubmit(handleAddPublisher)}
                  >
                    <div className='flex flex-row gap-x-3'>
                      <ImageNext src={IconPlusWhite} height={16} width={16} />
                      Add New Publisher
                    </div>
                  </button>
                  <Divider className='mt-0 mb-0' />
                  <p className='flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end'>
                    <span className='text-pmdGrayDark'>
                      <em>Need to start over?</em>
                    </span>
                    <a
                      title='Reset this form'
                      aria-label='Reset this form'
                      aria-haspopup='dialog'
                      aria-expanded={isOpenClearModal}
                      aria-controls='modalResetAddPublisherForm'
                      className='cursor-pointer'
                      onClick={handleIsOpenClearModal}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleIsOpenClearModal();
                        }
                      }}
                      tabIndex={0}
                    >
                      <em><strong>Reset this form</strong></em>
                    </a>
                  </p>
                </div>
              ) : (
                <div className='flex flex-col gap-4 w-full'>
                  <a
                    title='Check all fields for errors and try again!'
                    className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                    href='#top'
                  >
                    <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                    Add New Publisher
                  </a>
                  <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                    <span><em>Check all fields for errors and try again!</em></span>
                    <a
                      title='Back to Top'
                      className='flex flex-row justify-center items-center gap-x-3 !text-white !hover:text-pmdGrayLight !focus:text-pmdGrayLight !active:text-pmdGrayLight text-center cursor-pointer'
                      href='#top'
                    >
                      <ImageNext src={IconChevronUpWhite} height={16} width={16} />
                      <em><strong>Back to Top</strong></em>
                    </a>
                  </p>
                  <Divider className='mt-0 mb-0' />
                  <p className='flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end'>
                    <span className='text-pmdGrayDark'>
                      <em>Need to start over?</em>
                    </span>
                    <a
                      title='Reset this form'
                      aria-label='Reset this form'
                      aria-haspopup='dialog'
                      aria-expanded={isOpenClearModal}
                      aria-controls='modalResetAddPublisherForm'
                      className='cursor-pointer'
                      onClick={handleIsOpenClearModal}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleIsOpenClearModal();
                        }
                      }}
                      tabIndex={0}
                    >
                      <em><strong>Reset this form</strong></em>
                    </a>
                  </p>
                </div>
              )
            ) : (
              (!(isNameOverLimit)) ? (
                <div className='flex flex-col gap-4 w-full'>
                  <a
                    title='Your new publisher needs a Name!'
                    className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                    href='#top'
                  >
                    <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                    Add New Publisher
                  </a>
                  <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                    <span><em>You are missing a <strong>Name</strong>!</em></span>
                    <a
                      title='Back to Top'
                      className='flex flex-row justify-center items-center gap-x-3 !text-white !hover:text-pmdGrayLight !focus:text-pmdGrayLight !active:text-pmdGrayLight text-center cursor-pointer'
                      href='#top'
                    >
                      <ImageNext src={IconChevronUpWhite} height={16} width={16} />
                      <em><strong>Back to Top</strong></em>
                    </a>
                  </p>
                  <Divider className='mt-0 mb-0' />
                  <p className='flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end'>
                    <span className='text-pmdGrayDark'>
                      <em>Need to start over?</em>
                    </span>
                    <a
                      title='Reset this form'
                      aria-label='Reset this form'
                      aria-haspopup='dialog'
                      aria-expanded={isOpenClearModal}
                      aria-controls='modalResetAddPublisherForm'
                      className='cursor-pointer'
                      onClick={handleIsOpenClearModal}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleIsOpenClearModal();
                        }
                      }}
                      tabIndex={0}
                    >
                      <em><strong>Reset this form</strong></em>
                    </a>
                  </p>
                </div>
              ) : (
                <div className='flex flex-col gap-4 w-full'>
                  <a
                    title='Check all fields for errors and try again!'
                    className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                    href='#top'
                  >
                    <ImageNext src={IconPlusWhite} height={16} width={16} />
                    Add New Publisher
                  </a>
                  <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                    <span><em>Check all fields for errors and try again!</em></span>
                    <a
                      title='Back to Top'
                      className='flex flex-row justify-center items-center gap-x-3 !text-white !hover:text-pmdGrayLight !focus:text-pmdGrayLight !active:text-pmdGrayLight text-center cursor-pointer'
                      href='#top'
                    >
                      <ImageNext src={IconChevronUpWhite} height={16} width={16} />
                      <em><strong>Back to Top</strong></em>
                    </a>
                  </p>
                  <Divider className='mt-0 mb-0' />
                  <p className='flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end'>
                    <span className='text-pmdGrayDark'>
                      <em>Need to start over?</em>
                    </span>
                    <a
                      title='Reset this form'
                      aria-label='Reset this form'
                      aria-haspopup='dialog'
                      aria-expanded={isOpenClearModal}
                      aria-controls='modalResetAddPublisherForm'
                      className='cursor-pointer'
                      onClick={handleIsOpenClearModal}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleIsOpenClearModal();
                        }
                      }}
                      tabIndex={0}
                    >
                      <em><strong>Reset this form</strong></em>
                    </a>
                  </p>
                </div>
              )
            )}
          </div>
        </>
      )}
      <ModalResetAddPublisherForm
        handleClear={() => {
          handleIsOpenClearModal();
          clearAddPublisherForm();
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'All fields/selections reset',
              type: ENotificationTypes.SUCCESS
            }
          });
        }}
        isOpen={isOpenClearModal}
        onClose={handleIsOpenClearModal}
      />
      <ModalImageUploading
        description='Your publisher image is uploading. This may take a few moments...'
        isOpen={isOpenModalImageUploading}
        onClose={handleIsOpenModalImageUploading}
      />
    </>
  );
};

export default AddPublisher;
