import { FC, useContext, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import apiImage from '@src/api/configImage';
import Field from '@src/components/Field';
import TextArea from '@src/components/TextArea';
import InputText from '@src/components/InputText';
import InputNumber from '@src/components/InputNumber';
import MultipleAutocomplete from '@src/components/MultipleAutocomplete';
import FieldRadio from '@src/components/FieldRadio';
import FieldSelectMultiple from '@src/components/FieldSelectMultiple';
import Label from '@src/components/Label';
import LabelTooltip from '@src/components/LabelTooltip';
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
  EWork,
  EUrlsPages,
  CLevels,
  CEras,
  CInstrumentations,
  CStudentAges,
  CStudentTypes,
  CDirtyLevels,
  CDirtyEras,
  CDirtyInstrumentations,
  CDirtyStudentsAges,
  CDirtyStudentTypes,
  defaultWorkValues
} from '@src/constants';

import {
  handleTransformBoolean,
  handleTransformString,
} from '@src/api/helpers';

import {
  ENotificationActionTypes,
  ENotificationTypes,
  IDataName,
  IDataTitle,
  TUserAttributes
} from '@src/types';

import {
  ModalResetAddWorkForm,
  ModalFeedback,
  ModalImageUploading
} from '@src/components/Modals';

export interface IAddWorkForm {
  [EWork.title]: string;
  [EWork.alternateTitle]: string;
  [EWork.composers]: string[];
  [EWork.publishers]: string[];
  [EWork.collections]: string[];
  [EWork.videoEmbedCode]: string;
  [EWork.urlSpotify]: string;
  [EWork.urlAppleMusic]: string;
  [EWork.moods]: string[];
  [EWork.styles]: string[];
  [EWork.themes]: string[];
  [EWork.elements]: string[];
  [EWork.level]: string;
  [EWork.studentAges]: string[];
  [EWork.studentTypes]: string[];
  [EWork.teachingTips]: string[];
  [EWork.timeSignatures]: string[];
  [EWork.keySignatures]: string[];
  [EWork.measureCount]: string;
  [EWork.instrumentations]: string;
  [EWork.yearPublished]: string;
  [EWork.eras]: string;
  [EWork.holidays]: string[];
  [EWork.hasLyrics]: string;
  [EWork.hasTeacherDuet]: string;
  [EWork.description]: string;
};

export type TAddWorkForm = IAddWorkForm | FieldValues;

const AddWork: FC = (): JSX.Element => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [firstControlValue, setFirstControlValue] = useState(defaultWorkValues);
  const handleIsOpenClearModal = () => setIsOpenClearModal(!isOpenClearModal);
  const [isOpenClearModal, setIsOpenClearModal] = useState(false);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(true);
  const { control, formState, handleSubmit, watch, setValue } = useForm<TAddWorkForm>();
  const [userName, setUserName] = useState<string | null>(null);

  const [isTitle, setIsTitle] = useState(false);
  const [titleText, setTitleText] = useState<string | ''>('');
  const [isTitleOverLimit, setIsTitleOverLimit] = useState(false);
  const [isAlternateTitleOverLimit, setIsAlternateTitleOverLimit] = useState(false);
  const [isVideoEmbedCodeOverLimit, setIsVideoEmbedCodeOverLimit] = useState(false);
  const [isURLSpotifyOverLimit, setIsURLSpotifyOverLimit] = useState(false);
  const [isURLAppleMusicOverLimit, setIsURLAppleMusicOverLimit] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState<string | ''>('');
  const [isDescriptionOverLimit, setIsDescriptionOverLimit] = useState(false);

  const [isLoadingComposers, setIsLoadingComposers] = useState(false);
  const [composers, setComposers] = useState<string[] | null>(null);
  const [dirtyComposers, setDirtyComposers] = useState<IDataName[]>([]);
  const [composersOptions, setComposersOptions] = useState<string[] | null>(null);
  const [composersOptionsLength, setComposersOptionsLength] = useState<string | null>(null);

  const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);
  const [publishers, setPublishers] = useState<string[] | null>(null);
  const [dirtyPublishers, setDirtyPublishers] = useState<IDataName[]>([]);
  const [publishersOptions, setPublishersOptions] = useState<string[] | null>(null);
  const [publishersOptionsLength, setPublishersOptionsLength] = useState<string | null>(null);

  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [dirtyCollections, setDirtyCollections] = useState<IDataTitle[]>([]);
  const [collections, setCollections] = useState<string[] | null>(null);
  const [collectionsOptions, setCollectionsOptions] = useState<string[] | null>(null);
  const [collectionsOptionsLength, setCollectionsOptionsLength] = useState<string | null>(null);

  const [isLoadingMoods, setIsLoadingMoods] = useState(false);
  const [dirtyMoods, setDirtyMoods] = useState<IDataTitle[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [moodsOptions, setMoodsOptions] = useState<string[] | null>(null);
  const [moodsOptionsLength, setMoodsOptionsLength] = useState<string | null>(null);

  const [isLoadingStyles, setIsLoadingStyles] = useState(false);
  const [dirtyStyles, setDirtyStyles] = useState<IDataTitle[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [stylesOptions, setStylesOptions] = useState<string[] | null>(null);
  const [stylesOptionsLength, setStylesOptionsLength] = useState<string | null>(null);

  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [dirtyThemes, setDirtyThemes] = useState<IDataTitle[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [themesOptions, setThemesOptions] = useState<string[] | null>(null);
  const [themesOptionsLength, setThemesOptionsLength] = useState<string | null>(null);

  const [isLoadingElements, setIsLoadingElements] = useState(false);
  const [dirtyElements, setDirtyElements] = useState<IDataName[]>([]);
  const [elements, setElements] = useState<string[]>([]);
  const [elementsOptions, setElementsOptions] = useState<string[] | null>(null);
  const [elementsOptionsLength, setElementsOptionsLength] = useState<string | null>(null);

  const [level, setLevel] = useState<string>();
  const [levelOptions, setLevelOptions] = useState<string[] | null>(null);

  const [studentAges, setStudentAges] = useState<string[]>([]);
  const [studentAgeOptions, setStudentAgeOptions] = useState<string[] | null>(null);

  const [studentTypes, setStudentTypes] = useState<string[]>([]);
  const [studentTypeOptions, setStudentTypeOptions] = useState<string[] | null>(null);

  const [isLoadingTeachingTips, setIsLoadingTeachingTips] = useState(false);
  const [dirtyTeachingTips, setDirtyTeachingTips] = useState<IDataTitle[]>([]);
  const [teachingTips, setTeachingTips] = useState<string[]>([]);
  const [teachingTipsOptions, setTeachingTipsOptions] = useState<string[] | null>(null);
  const [teachingTipsOptionsLength, setTeachingTipsOptionsLength] = useState<string | null>(null);

  const [isLoadingTimeSignatures, setIsLoadingTimeSignatures] = useState(false);
  const [dirtyTimeSignatures, setDirtyTimeSignatures] = useState<IDataTitle[]>([]);
  const [timeSignatures, setTimeSignatures] = useState<string[]>([]);
  const [timeSignaturesOptions, setTimeSignaturesOptions] = useState<string[] | null>(null);
  const [timeSignaturesOptionsLength, setTimeSignaturesOptionsLength] = useState<string | null>(null);

  const [isLoadingKeySignatures, setIsLoadingKeySignatures] = useState(false);
  const [dirtyKeySignatures, setDirtyKeySignatures] = useState<IDataTitle[]>([]);
  const [keySignatures, setKeySignatures] = useState<string[]>([]);
  const [keySignaturesOptions, setKeySignaturesOptions] = useState<string[] | null>(null);
  const [keySignaturesOptionsLength, setKeySignaturesOptionsLength] = useState<string | null>(null);

  const [era, setEra] = useState<string>();

  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [dirtyHolidays, setDirtyHolidays] = useState<IDataName[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [holidaysOptions, setHolidaysOptions] = useState<string[] | null>(null);
  const [holidaysOptionsLength, setHolidaysOptionsLength] = useState<string | null>(null);

  const [instrumentation, setInstrumentation] = useState<string>();

  const [isLyrics, setIsLyrics] = useState<string | null>(null);

  const [isTeacherDuet, setIsTeacherDuet] = useState<string | null>(null);

  const [isOpenModalImageUploading, setIsOpenModalImageUploading] = useState(false);
  const handleIsOpenModalImageUploading = () => setIsOpenModalImageUploading(!isOpenModalImageUploading);
  const [file, setFile] = useState<File>();

  const handleFile = (image: File) => {
    setFile(image);
    console.log(image);
  };


  useEffect(() => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');

    if (addWorkData) {
      if (addWorkData[EWork.title]) {
        setIsTitle(true);
        setTitleText(addWorkData[EWork.title]);
        setValue(EWork.title, addWorkData[EWork.title]);
        if (addWorkData[EWork.title].length > 100) {
          setIsTitleOverLimit(true);
        } else {
          setIsTitleOverLimit(false);
        }
      };
      if (addWorkData[EWork.alternateTitle]) {
        setValue(EWork.alternateTitle, addWorkData[EWork.alternateTitle]);
        if (addWorkData[EWork.alternateTitle].length > 100) {
          setIsAlternateTitleOverLimit(true);
        } else {
          setIsAlternateTitleOverLimit(false);
        }
      };
      if (addWorkData[EWork.composers] && addWorkData[EWork.composers].length > 0) {
        setComposers(addWorkData[EWork.composers]?.map((item: IDataName) => item));
      };
      if (addWorkData[EWork.publishers] && addWorkData[EWork.publishers].length > 0) {
        setPublishers(addWorkData[EWork.publishers]?.map((item: IDataName) => item));
      };
      if (addWorkData[EWork.collections] && addWorkData[EWork.collections].length > 0) {
        setCollections(addWorkData[EWork.collections]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.videoEmbedCode]) {
        setValue(EWork.videoEmbedCode, addWorkData[EWork.videoEmbedCode]);
        if (addWorkData[EWork.videoEmbedCode].length > 250) {
          setIsVideoEmbedCodeOverLimit(true);
        } else {
          setIsVideoEmbedCodeOverLimit(false);
        }
      };
      if (addWorkData[EWork.urlSpotify]) {
        setValue(EWork.urlSpotify, addWorkData[EWork.urlSpotify]);
        if (addWorkData[EWork.urlSpotify].length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        }
      };
      if (addWorkData[EWork.urlAppleMusic]) {
        setValue(EWork.urlAppleMusic, addWorkData[EWork.urlAppleMusic]);
        if (addWorkData[EWork.urlAppleMusic].length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        }
      };
      if (addWorkData[EWork.moods] && addWorkData[EWork.moods].length > 0) {
        setMoods(addWorkData[EWork.moods]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.styles] && addWorkData[EWork.styles].length > 0) {
        setStyles(addWorkData[EWork.styles]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.themes] && addWorkData[EWork.themes].length > 0) {
        setThemes(addWorkData[EWork.themes]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.elements] && addWorkData[EWork.elements].length > 0) {
        setElements(addWorkData[EWork.elements]?.map((item: IDataName) => item));
      };
      if (addWorkData[EWork.level]) {
        setLevel(addWorkData[EWork.level]);
      };
      if (addWorkData[EWork.studentAges] && addWorkData[EWork.studentAges].length > 0) {
        setStudentAges(addWorkData[EWork.studentAges]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.studentTypes] && addWorkData[EWork.studentTypes].length > 0) {
        setStudentTypes(addWorkData[EWork.studentTypes]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.teachingTips] && addWorkData[EWork.teachingTips].length > 0) {
        setTeachingTips(addWorkData[EWork.teachingTips]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.timeSignatures] && addWorkData[EWork.timeSignatures].length > 0) {
        setTimeSignatures(addWorkData[EWork.timeSignatures]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.keySignatures] && addWorkData[EWork.keySignatures].length > 0) {
        setKeySignatures(addWorkData[EWork.keySignatures]?.map((item: IDataTitle) => item));
      };
      if (addWorkData[EWork.measureCount]) {
        setValue(EWork.measureCount, addWorkData[EWork.measureCount]);
      };
      if (addWorkData[EWork.instrumentations]) {
        setInstrumentation(addWorkData[EWork.instrumentations]);
      };
      if (addWorkData[EWork.yearPublished]) {
        setValue(EWork.yearPublished, addWorkData[EWork.yearPublished]);
      };
      if (addWorkData[EWork.eras]) {
        setEra(addWorkData[EWork.eras]);
      };
      if (addWorkData[EWork.holidays] && addWorkData[EWork.holidays].length > 0) {
        setHolidays(addWorkData[EWork.holidays]?.map((item: IDataName) => item));
      };
      if (addWorkData[EWork.hasLyrics]) {
        if (addWorkData[EWork.hasLyrics] === 'boolean') {
          const localValue = handleTransformBoolean(
            addWorkData[EWork.hasLyrics]
          );
          setIsLyrics(localValue)
        } else {
          setIsLyrics(addWorkData[EWork.hasLyrics]);
        }
      } else {
        setIsLyrics(null);
      };
      if (addWorkData[EWork.hasTeacherDuet]) {
        if (addWorkData[EWork.hasTeacherDuet] === 'boolean') {
          const localValue = handleTransformBoolean(
            addWorkData[EWork.hasTeacherDuet]
          );
          setIsTeacherDuet(localValue)
        } else {
          setIsTeacherDuet(addWorkData[EWork.hasTeacherDuet]);
        }
      } else {
        setIsTeacherDuet(null);
      };
      if (addWorkData[EWork.description]) {
        setIsDescription(true);
        setDescriptionText(addWorkData[EWork.description]);
        setValue(EWork.description, addWorkData[EWork.description]);
        if (addWorkData[EWork.description].length > 1000) {
          setIsDescriptionOverLimit(true);
        } else {
          setIsDescriptionOverLimit(false);
        }
      };
    };

    const getComposers = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingComposers(true);
        const fetchedData = [];
        const { data } = await api.get(
          'composers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview'
        );
        fetchedData.push(...data?.data);
        setComposersOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `composers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`
            );
            fetchedData.push(...response.data.data);
            setComposersOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyComposers(fetchedData);
        if (fetchedData) {
          const cleanComposers = fetchedData?.map((item: IDataName) => item?.attributes?.name);
          const filteredData = cleanComposers?.filter((composer: string) => {
            if (addWorkData && addWorkData[EWork.composers] && addWorkData[EWork.composers].length > 0) {
              return !addWorkData[EWork.composers].some((composerParsed: string) => composerParsed === composer)
            } else {
              return true;
            };
          });
          setComposersOptions(filteredData);
        } else {
          setComposersOptions(null);
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
        setIsLoadingComposers(false);
      };
    };

    const getPublishers = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingPublishers(true);
        const fetchedData = [];
        const { data } = await api.get(
          'publishers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview'
        );
        fetchedData.push(...data?.data);
        setPublishersOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `publishers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`
            );
            fetchedData.push(...response.data.data);
            setPublishersOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyPublishers(fetchedData);
        if (fetchedData) {
          const cleanPublishers = fetchedData?.map((item: IDataName) => item?.attributes?.name);
          const filteredData = cleanPublishers?.filter((publisher: string) => {
            if (addWorkData && addWorkData[EWork.publishers] && addWorkData[EWork.publishers].length > 0) {
              return !addWorkData[EWork.publishers].some((publisherParsed: string) => publisherParsed === publisher)
            } else {
              return true;
            };
          });
          setPublishersOptions(filteredData);
        } else {
          setPublishersOptions(null);
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
        setIsLoadingPublishers(false);
      };
    };

    const getCollections = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
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
            if (addWorkData && addWorkData[EWork.collections] && addWorkData[EWork.collections].length > 0) {
              return !addWorkData[EWork.collections].some((collectionParsed: string) => collectionParsed === collection)
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

    const getElements = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingElements(true);
        const fetchedData = [];
        const { data } = await api.get(
          'elements?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview'
        );
        fetchedData.push(...data?.data);
        setElementsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `elements?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`
            );
            fetchedData.push(...response.data.data);
            setElementsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyElements(fetchedData);
        if (fetchedData) {
          const cleanElements = fetchedData?.map((item: IDataName) => item?.attributes?.name);
          const filteredData = cleanElements?.filter((element: string) => {
            if (addWorkData && addWorkData[EWork.elements] && addWorkData[EWork.elements].length > 0) {
              return !addWorkData[EWork.elements].some((elementParsed: string) => elementParsed === element)
            } else {
              return true;
            };
          });
          setElementsOptions(filteredData);
        } else {
          setElementsOptions(null);
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
        setIsLoadingElements(false);
      };
    };

    const getMoods = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingMoods(true);
        const fetchedData = [];
        const { data } = await api.get(
          'moods?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
        );
        fetchedData.push(...data?.data);
        setMoodsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `moods?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
            );
            fetchedData.push(...response.data.data);
            setMoodsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyMoods(fetchedData);
        if (fetchedData) {
          const cleanMoods = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanMoods?.filter((mood: string) => {
            if (addWorkData && addWorkData[EWork.moods] && addWorkData[EWork.moods].length > 0) {
              return !addWorkData[EWork.moods].some((moodParsed: string) => moodParsed === mood)
            } else {
              return true;
            };
          });
          setMoodsOptions(filteredData);
        } else {
          setMoodsOptions(null);
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
        setIsLoadingMoods(false);
      };
    };

    const getStyles = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingStyles(true);
        const fetchedData = [];
        const { data } = await api.get(
          'styles?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
        );
        fetchedData.push(...data?.data);
        setStylesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `styles?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
            );
            fetchedData.push(...response.data.data);
            setStylesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyStyles(fetchedData);
        if (fetchedData) {
          const cleanStyles = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanStyles?.filter((style: string) => {
            if (addWorkData && addWorkData[EWork.styles] && addWorkData[EWork.styles].length > 0) {
              return !addWorkData[EWork.styles].some((styleParsed: string) => styleParsed === style)
            } else {
              return true;
            };
          });
          setStylesOptions(filteredData);
        } else {
          setStylesOptions(null);
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
        setIsLoadingStyles(false);
      };
    };

    const getThemes = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingThemes(true);
        const fetchedData = [];
        const { data } = await api.get(
          'themes?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
        );
        fetchedData.push(...data?.data);
        setThemesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `themes?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
            );
            fetchedData.push(...response.data.data);
            setThemesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyThemes(fetchedData);
        if (fetchedData) {
          const cleanThemes = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanThemes?.filter((theme: string) => {
            if (addWorkData && addWorkData[EWork.themes] && addWorkData[EWork.themes].length > 0) {
              return !addWorkData[EWork.themes].some((themeParsed: string) => themeParsed === theme)
            } else {
              return true;
            };
          });
          setThemesOptions(filteredData);
        } else {
          setThemesOptions(null);
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
        setIsLoadingThemes(false);
      };
    };

    const getTeachingTips = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingTeachingTips(true);
        const fetchedData = [];
        const { data } = await api.get(
          'teaching-tips?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
        );
        fetchedData.push(...data?.data);
        setTeachingTipsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `teaching-tips?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
            );
            fetchedData.push(...response.data.data);
            setTeachingTipsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyTeachingTips(fetchedData);
        if (fetchedData) {
          const cleanTeachingTips = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanTeachingTips?.filter((teachingTip: string) => {
            if (addWorkData && addWorkData[EWork.teachingTips] && addWorkData[EWork.teachingTips].length > 0) {
              return !addWorkData[EWork.teachingTips].some((teachingTipParsed: string) => teachingTipParsed === teachingTip)
            } else {
              return true;
            };
          });
          setTeachingTipsOptions(filteredData);
        } else {
          setTeachingTipsOptions(null);
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
        setIsLoadingTeachingTips(false);
      };
    };

    const getTimeSignatures = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingTimeSignatures(true);
        const fetchedData = [];
        const { data } = await api.get(
          'time-signatures?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
        );
        fetchedData.push(...data?.data);
        setTimeSignaturesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `time-signatures?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
            );
            fetchedData.push(...response.data.data);
            setTimeSignaturesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyTimeSignatures(fetchedData);
        if (fetchedData) {
          const cleanTimeSignatures = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanTimeSignatures?.filter((timeSignature: string) => {
            if (addWorkData && addWorkData.timeSignatures && addWorkData.timeSignatures.length > 0) {
              return !addWorkData.TimeSignatures.some((timeSignatureParsed: string) => timeSignatureParsed === timeSignature)
            } else {
              return true;
            };
          });
          setTimeSignaturesOptions(filteredData);
        } else {
          setTimeSignaturesOptions(null);
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
        setIsLoadingTimeSignatures(false);
      };
    };

    const getKeySignatures = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingKeySignatures(true);
        const fetchedData = [];
        const { data } = await api.get(
          'key-signatures?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
        );
        fetchedData.push(...data?.data);
        setKeySignaturesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `key-signatures?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
            );
            fetchedData.push(...response.data.data);
            setKeySignaturesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyKeySignatures(fetchedData);
        if (fetchedData) {
          const cleanKeySignatures = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
          const filteredData = cleanKeySignatures?.filter((KeySignature: string) => {
            if (addWorkData && addWorkData.KeySignatures && addWorkData.KeySignatures.length > 0) {
              return !addWorkData.KeySignatures.some((KeySignatureParsed: string) => KeySignatureParsed === KeySignature)
            } else {
              return true;
            };
          });
          setKeySignaturesOptions(filteredData);
        } else {
          setKeySignaturesOptions(null);
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
        setIsLoadingKeySignatures(false);
      };
    };

    const getHolidays = async () => {
      const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
      try {
        setIsLoadingHolidays(true);
        const fetchedData = [];
        const { data } = await api.get(
          'holidays?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name'
        );
        fetchedData.push(...data?.data);
        setHolidaysOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            let response = await api.get(
              `holidays?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name`
            );
            fetchedData.push(...response.data.data);
            setHolidaysOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
          };
        };
        setDirtyHolidays(fetchedData);
        if (fetchedData) {
          const cleanHolidays = fetchedData?.map((item: IDataName) => item?.attributes?.name);
          const filteredData = cleanHolidays?.filter((holiday: string) => {
            if (addWorkData && addWorkData.holidays && addWorkData.Holidays.length > 0) {
              return !addWorkData.holidays.some((holidayParsed: string) => holidayParsed === holiday)
            } else {
              return true;
            };
          });
          setHolidaysOptions(filteredData);
        } else {
          setHolidaysOptions(null);
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
        setIsLoadingHolidays(false);
      };
    };

    const getLevels = async () => {
      try {
        setLevelOptions(CLevels);
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

    const getStudentAges = async () => {
      try {
        setStudentAgeOptions(CStudentAges);
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

    const getStudentTypes = async () => {
      try {
        setStudentTypeOptions(CStudentTypes);
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

    getComposers();
    getPublishers();
    getCollections();
    getElements();
    getTeachingTips();
    getTimeSignatures();
    getKeySignatures();
    getHolidays();

    getMoods();
    getStyles();
    getThemes();
    getLevels();
    getStudentAges();
    getStudentTypes();

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

  const getComposers = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingComposers(true);
      const fetchedData = [];
      const { data } = await api.get(
        'composers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview'
      );
      fetchedData.push(...data?.data);
      setComposersOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `composers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`
          );
          fetchedData.push(...response.data.data);
          setComposersOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyComposers(fetchedData);
      if (fetchedData) {
        const cleanComposers = fetchedData?.map((item: IDataName) => item?.attributes?.name);
        const filteredData = cleanComposers?.filter((composer: string) => {
          if (addWorkData && addWorkData[EWork.composers] && addWorkData[EWork.composers].length > 0) {
            return !addWorkData[EWork.composers].some((composerParsed: string) => composerParsed === composer)
          } else {
            return true;
          };
        });
        setComposersOptions(filteredData);
      } else {
        setComposersOptions(null);
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
      setIsLoadingComposers(false);
    };
  };

  const getPublishers = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingPublishers(true);
      const fetchedData = [];
      const { data } = await api.get(
        'publishers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview'
      );
      fetchedData.push(...data?.data);
      setPublishersOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `publishers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`
          );
          fetchedData.push(...response.data.data);
          setPublishersOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyPublishers(fetchedData);
      if (fetchedData) {
        const cleanPublishers = fetchedData?.map((item: IDataName) => item?.attributes?.name);
        const filteredData = cleanPublishers?.filter((publisher: string) => {
          if (addWorkData && addWorkData[EWork.publishers] && addWorkData[EWork.publishers].length > 0) {
            return !addWorkData[EWork.publishers].some((publisherParsed: string) => publisherParsed === publisher)
          } else {
            return true;
          };
        });
        setPublishersOptions(filteredData);
      } else {
        setPublishersOptions(null);
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
      setIsLoadingPublishers(false);
    };
  };

  const getCollections = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
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
          if (addWorkData && addWorkData[EWork.collections] && addWorkData[EWork.collections].length > 0) {
            return !addWorkData[EWork.collections].some((collectionParsed: string) => collectionParsed === collection)
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

  const getElements = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingElements(true);
      const fetchedData = [];
      const { data } = await api.get(
        'elements?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview'
      );
      fetchedData.push(...data?.data);
      setElementsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `elements?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`
          );
          fetchedData.push(...response.data.data);
          setElementsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyElements(fetchedData);
      if (fetchedData) {
        const cleanElements = fetchedData?.map((item: IDataName) => item?.attributes?.name);
        const filteredData = cleanElements?.filter((element: string) => {
          if (addWorkData && addWorkData[EWork.elements] && addWorkData[EWork.elements].length > 0) {
            return !addWorkData[EWork.elements].some((elementParsed: string) => elementParsed === element)
          } else {
            return true;
          };
        });
        setElementsOptions(filteredData);
      } else {
        setElementsOptions(null);
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
      setIsLoadingElements(false);
    };
  };

  const getMoods = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingMoods(true);
      const fetchedData = [];
      const { data } = await api.get(
        'moods?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
      );
      fetchedData.push(...data?.data);
      setMoodsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `moods?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
          );
          fetchedData.push(...response.data.data);
          setMoodsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyMoods(fetchedData);
      if (fetchedData) {
        const cleanMoods = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanMoods?.filter((mood: string) => {
          if (addWorkData && addWorkData[EWork.moods] && addWorkData[EWork.moods].length > 0) {
            return !addWorkData[EWork.moods].some((moodParsed: string) => moodParsed === mood)
          } else {
            return true;
          };
        });
        setMoodsOptions(filteredData);
      } else {
        setMoodsOptions(null);
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
      setIsLoadingMoods(false);
    };
  };

  const getStyles = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingStyles(true);
      const fetchedData = [];
      const { data } = await api.get(
        'styles?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
      );
      fetchedData.push(...data?.data);
      setStylesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `styles?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
          );
          fetchedData.push(...response.data.data);
          setStylesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyStyles(fetchedData);
      if (fetchedData) {
        const cleanStyles = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanStyles?.filter((style: string) => {
          if (addWorkData && addWorkData[EWork.styles] && addWorkData[EWork.styles].length > 0) {
            return !addWorkData[EWork.styles].some((styleParsed: string) => styleParsed === style)
          } else {
            return true;
          };
        });
        setStylesOptions(filteredData);
      } else {
        setStylesOptions(null);
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
      setIsLoadingStyles(false);
    };
  };

  const getThemes = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingThemes(true);
      const fetchedData = [];
      const { data } = await api.get(
        'themes?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
      );
      fetchedData.push(...data?.data);
      setThemesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `themes?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
          );
          fetchedData.push(...response.data.data);
          setThemesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyThemes(fetchedData);
      if (fetchedData) {
        const cleanThemes = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanThemes?.filter((theme: string) => {
          if (addWorkData && addWorkData[EWork.themes] && addWorkData[EWork.themes].length > 0) {
            return !addWorkData[EWork.themes].some((themeParsed: string) => themeParsed === theme)
          } else {
            return true;
          };
        });
        setThemesOptions(filteredData);
      } else {
        setThemesOptions(null);
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
      setIsLoadingThemes(false);
    };
  };

  const getTeachingTips = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingTeachingTips(true);
      const fetchedData = [];
      const { data } = await api.get(
        'teaching-tips?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
      );
      fetchedData.push(...data?.data);
      setTeachingTipsOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `teaching-tips?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
          );
          fetchedData.push(...response.data.data);
          setTeachingTipsOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyTeachingTips(fetchedData);
      if (fetchedData) {
        const cleanTeachingTips = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanTeachingTips?.filter((teachingTip: string) => {
          if (addWorkData && addWorkData[EWork.teachingTips] && addWorkData[EWork.teachingTips].length > 0) {
            return !addWorkData[EWork.teachingTips].some((teachingTipParsed: string) => teachingTipParsed === teachingTip)
          } else {
            return true;
          };
        });
        setTeachingTipsOptions(filteredData);
      } else {
        setTeachingTipsOptions(null);
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
      setIsLoadingTeachingTips(false);
    };
  };

  const getTimeSignatures = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingTimeSignatures(true);
      const fetchedData = [];
      const { data } = await api.get(
        'time-signatures?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
      );
      fetchedData.push(...data?.data);
      setTimeSignaturesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `time-signatures?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
          );
          fetchedData.push(...response.data.data);
          setTimeSignaturesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyTimeSignatures(fetchedData);
      if (fetchedData) {
        const cleanTimeSignatures = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanTimeSignatures?.filter((timeSignature: string) => {
          if (addWorkData && addWorkData.timeSignatures && addWorkData.TimeSignatures.length > 0) {
            return !addWorkData.timeSignatures.some((timeSignatureParsed: string) => timeSignatureParsed === timeSignature)
          } else {
            return true;
          };
        });
        setTimeSignaturesOptions(filteredData);
      } else {
        setTimeSignaturesOptions(null);
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
      setIsLoadingTimeSignatures(false);
    };
  };

  const getKeySignatures = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingKeySignatures(true);
      const fetchedData = [];
      const { data } = await api.get(
        'key-signatures?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title'
      );
      fetchedData.push(...data?.data);
      setKeySignaturesOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `key-signatures?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title`
          );
          fetchedData.push(...response.data.data);
          setKeySignaturesOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyKeySignatures(fetchedData);
      if (fetchedData) {
        const cleanKeySignatures = fetchedData?.map((item: IDataTitle) => item?.attributes?.title);
        const filteredData = cleanKeySignatures?.filter((keySignature: string) => {
          if (addWorkData && addWorkData.keySignatures && addWorkData.keySignatures.length > 0) {
            return !addWorkData.keySignatures.some((keySignatureParsed: string) => keySignatureParsed === keySignature)
          } else {
            return true;
          };
        });
        setKeySignaturesOptions(filteredData);
      } else {
        setKeySignaturesOptions(null);
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
      setIsLoadingKeySignatures(false);
    };
  };

  const getHolidays = async () => {
    const addWorkData = JSON.parse(localStorage.getItem('addWorkForm') || '{}');
    try {
      setIsLoadingHolidays(true);
      const fetchedData = [];
      const { data } = await api.get(
        'holidays?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name'
      );
      fetchedData.push(...data?.data);
      setHolidaysOptionsLength((data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize) + '/' + data?.meta?.pagination?.total);
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          let response = await api.get(
            `holidays?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name`
          );
          fetchedData.push(...response.data.data);
          setHolidaysOptionsLength((response?.data?.meta?.pagination?.page * response?.data?.meta?.pagination?.pageSize) + '/' + response?.data?.meta?.pagination?.total);
        };
      };
      setDirtyHolidays(fetchedData);
      if (fetchedData) {
        const cleanHolidays = fetchedData?.map((item: IDataName) => item?.attributes?.name);
        const filteredData = cleanHolidays?.filter((holiday: string) => {
          if (addWorkData && addWorkData.holidays && addWorkData.Holidays.length > 0) {
            return !addWorkData.holidays.some((holidayParsed: string) => holidayParsed === holiday)
          } else {
            return true;
          };
        });
        setHolidaysOptions(filteredData);
      } else {
        setHolidaysOptions(null);
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
      setIsLoadingHolidays(false);
    };
  };

  const handleComposers = (composersRaw: string[]) => {
    if (!(composersRaw === composers)) {
      setComposers(composersRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyComposers?.map((item: IDataName) => item?.attributes?.name);
    if (dirtyData && parsedLocalData) {
      const composersParsed = parsedLocalData.composers;
      const filteredData = dirtyData.filter((item: string) => {
        return !composersParsed?.some((composer: IDataName) => composer?.attributes?.name === item);
      });
      setComposersOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.composers]: composersRaw
      })
    );
  };

  const handlePublishers = (publishersRaw: string[]) => {
    if (!(publishersRaw === publishers)) {
      setPublishers(publishersRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyPublishers?.map((item: IDataName) => item?.attributes?.name);
    if (dirtyData && parsedLocalData) {
      const publishersParsed = parsedLocalData.publishersRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !publishersParsed?.some((publisher: IDataName) => publisher?.attributes?.name === item);
      });
      setPublishersOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.publishers]: publishersRaw
      })
    );
  };

  const handleCollections = (collectionsRaw: string[]) => {
    if (!(collectionsRaw === collections)) {
      setCollections(collectionsRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
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
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.collections]: collectionsRaw
      })
    );
  };

  const handleMoods = (moodsRaw: string[]) => {
    if (!(moodsRaw === moods)) {
      setMoods(moodsRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyMoods?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const moodsParsed = parsedLocalData.moodsRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !moodsParsed?.some((mood: IDataTitle) => mood?.attributes?.title === item);
      });
      setMoodsOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.moods]: moodsRaw
      })
    );
  };

  const handleStyles = (stylesRaw: string[]) => {
    if (!(stylesRaw === styles)) {
      setStyles(stylesRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyStyles?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const stylesParsed = parsedLocalData.stylesRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !stylesParsed?.some((style: IDataTitle) => style?.attributes?.title === item);
      });
      setStylesOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.styles]: stylesRaw
      })
    );
  };

  const handleThemes = (themesRaw: string[]) => {
    if (!(themesRaw === themes)) {
      setThemes(themesRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyThemes?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const themesParsed = parsedLocalData.themesRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !themesParsed?.some((theme: IDataTitle) => theme?.attributes?.title === item);
      });
      setThemesOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.themes]: themesRaw
      })
    );
  };

  const handleElements = (elementsRaw: string[]) => {
    if (!(elementsRaw === elements)) {
      setElements(elementsRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyElements?.map((item: IDataName) => item?.attributes?.name);
    if (dirtyData && parsedLocalData) {
      const elementsParsed = parsedLocalData.elementsRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !elementsParsed?.some((element: IDataName) => element?.attributes?.name === item);
      });
      setElementsOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.elements]: elementsRaw
      })
    );
  };

  const handleLevel = (levelRaw: string) => {
    if (!(levelRaw === level)) {
      setLevel(levelRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = CDirtyLevels?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const levelParsed = parsedLocalData.levelRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !levelParsed?.some((level: IDataTitle) => level?.attributes?.title === item);
      });
      setLevelOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.level]: levelRaw
      })
    );
  };

  const handleStudentAges = (studentAgesRaw: string[]) => {
    if (!(studentAgesRaw === studentAges)) {
      setStudentAges(studentAgesRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = CDirtyStudentsAges?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const studentAgesParsed = parsedLocalData.studentAgesRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !studentAgesParsed?.some((studentAges: IDataTitle) => studentAges?.attributes?.title === item);
      });
      setStudentAgeOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.studentAges]: studentAgesRaw
      })
    );
  };

  const handleStudentTypes = (studentTypesRaw: string[]) => {
    if (!(studentTypesRaw === studentTypes)) {
      setStudentTypes(studentTypesRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = CDirtyStudentTypes?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const studentTypesParsed = parsedLocalData.studentTypesRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !studentTypesParsed?.some((studentTypes: IDataTitle) => studentTypes?.attributes?.title === item);
      });
      setStudentTypeOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.studentTypes]: studentTypesRaw
      })
    );
  };

  const handleTeachingTips = (teachingTipsRaw: string[]) => {
    if (!(teachingTipsRaw === teachingTips)) {
      setTeachingTips(teachingTipsRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyTeachingTips?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const teachingTipsParsed = parsedLocalData.teachingTipsRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !teachingTipsParsed?.some((teachingTip: IDataTitle) => teachingTip?.attributes?.title === item);
      });
      setTeachingTipsOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.teachingTips]: teachingTipsRaw
      })
    );
  };

  const handleTimeSignatures = (timeSignaturesRaw: string[]) => {
    if (!(timeSignaturesRaw === timeSignatures)) {
      setTimeSignatures(timeSignaturesRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyTimeSignatures?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const timeSignaturesParsed = parsedLocalData.timeSignaturesRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !timeSignaturesParsed?.some((timeSignature: IDataTitle) => timeSignature?.attributes?.title === item);
      });
      setTimeSignaturesOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.timeSignatures]: timeSignaturesRaw
      })
    );
  };

  const handleKeySignatures = (keySignaturesRaw: string[]) => {
    if (!(keySignaturesRaw === keySignatures)) {
      setKeySignatures(keySignaturesRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyKeySignatures?.map((item: IDataTitle) => item?.attributes?.title);
    if (dirtyData && parsedLocalData) {
      const keySignaturesParsed = parsedLocalData.keySignaturesRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !keySignaturesParsed?.some((keySignature: IDataTitle) => keySignature?.attributes?.title === item);
      });
      setKeySignaturesOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.keySignatures]: keySignaturesRaw
      })
    );
  };

  const handleInstrumentation = (instrumentationRaw: string) => {
    if (!(instrumentationRaw === instrumentation)) {
      setInstrumentation(instrumentationRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.instrumentations]: instrumentationRaw
      })
    );
  };

  const handleEra = (eraRaw: string) => {
    if (!(eraRaw === era)) {
      setEra(eraRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.eras]: eraRaw
      })
    );
  };

  const handleHolidays = (holidaysRaw: string[]) => {
    if (!(holidaysRaw === holidays)) {
      setHolidays(holidaysRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyHolidays?.map((item: IDataName) => item?.attributes?.name);
    if (dirtyData && parsedLocalData) {
      const holidaysParsed = parsedLocalData.holidaysRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !holidaysParsed?.some((holiday: IDataName) => holiday?.attributes?.name === item);
      });
      setHolidaysOptions(filteredData);
    }
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.holidays]: holidaysRaw
      })
    );
  };

  const handleIsLyrics = (lyricsRaw: string) => {
    if (!(lyricsRaw === isLyrics)) {
      setIsLyrics(lyricsRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.hasLyrics]: lyricsRaw
      })
    );
  };

  const handleIsTeacherDuet = (teacherDuetRaw: string) => {
    if (!(teacherDuetRaw === isTeacherDuet)) {
      setIsTeacherDuet(teacherDuetRaw);
    }
    const localData = localStorage.getItem('addWorkForm');
    const parsedLocalData = JSON.parse(localData as any);
    localStorage.setItem(
      'addWorkForm',
      JSON.stringify({
        ...parsedLocalData,
        [EWork.hasTeacherDuet]: teacherDuetRaw
      })
    );
  };

  const handleAddWork: SubmitHandler<TAddWorkForm> = (data) => {
    let lyricsBoolean: boolean | null = null;
    let teacherDuetBoolean: boolean | null = null;
    if (isLyrics) {
      lyricsBoolean = handleTransformString(isLyrics)
    } else {
      lyricsBoolean = null;
    };
    if (isTeacherDuet) {
      teacherDuetBoolean = handleTransformString(isTeacherDuet)
    } else {
      teacherDuetBoolean = null;
    };

    let form = {
      ...data,
      [EWork.composers]: composers,
      [EWork.publishers]: publishers,
      [EWork.collections]: collections,
      [EWork.moods]: moods,
      [EWork.styles]: styles,
      [EWork.themes]: themes,
      [EWork.elements]: elements,
      [EWork.level]: level,
      [EWork.studentAges]: studentAges,
      [EWork.studentTypes]: studentTypes,
      [EWork.teachingTips]: teachingTips,
      [EWork.timeSignatures]: timeSignatures,
      [EWork.keySignatures]: keySignatures,
      [EWork.instrumentations]: instrumentation,
      [EWork.eras]: era,
      [EWork.holidays]: holidays,
      [EWork.hasLyrics]: lyricsBoolean,
      [EWork.hasTeacherDuet]: teacherDuetBoolean
    };

    if (form && isSubmitAllowed) {
      if (!handleError()) {
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
      const data = await api.post('works', { data: preparedForm },);
      if (data && data?.data?.data?.id && file) {
        handleImageData(data)
      };
      clearAddWorkForm();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: `"${data?.data.data.attributes?.title}" Added Successfully`,
          type: ENotificationTypes.SUCCESS
        }
      });
      router.push(`/${EUrlsPages.ADDED_WORK}`, undefined, { shallow: false });
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: (error?.response?.data.error?.message ? error?.response?.data.error?.message == 'Not Found' ? 'A selection has been deleted. Please reset and try again.' : error?.response?.data.error?.message : 'Something went wrong. Try again.'),
            type: ENotificationTypes.ERROR
          }
        });
      };
      setIsSubmitAllowed(true);
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
        formData.append('path', 'uploads/works');
        formData.append('ref', 'api::work.work');
        formData.append('refId', data?.data.data.id);
        console.log(formData);
        const dataImage = await apiImage.post('upload', formData);
        console.log(dataImage);
        if (dataImage && dataImage?.request?.status === 200) {
          setIsOpenModalImageUploading(false);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Work Image Uploaded Successfully',
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
    dirtyComposers: IDataName[],
    dirtyPublishers: IDataName[],
    dirtyCollections: IDataTitle[],
    dirtyMoods: IDataTitle[],
    dirtyStyles: IDataTitle[],
    dirtyThemes: IDataTitle[],
    dirtyElements: IDataName[],
    dirtyTeachingTips: IDataTitle[],
    dirtyTimeSignatures: IDataTitle[],
    dirtyKeySignatures: IDataTitle[],
    dirtyHolidays: IDataName[]
  ) => {
    const form = { ...data };
    form[EWork.composers] = dirtyComposers
      ?.filter((item: IDataName) => {
        for (let i = 0; i <= data?.composers?.length; i++) {
          if (item.attributes.name === data.composers[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.publishers] = dirtyPublishers
      ?.filter((item: IDataName) => {
        for (let i = 0; i <= data?.publishers?.length; i++) {
          if (item.attributes.name === data.publishers[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.collections] = dirtyCollections
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.collections?.length; i++) {
          if (item.attributes.title === data.collections[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.moods] = dirtyMoods
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.moods?.length; i++) {
          if (item.attributes.title === data.moods[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.styles] = dirtyStyles
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.styles?.length; i++) {
          if (item.attributes.title === data.styles[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.themes] = dirtyThemes
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.themes?.length; i++) {
          if (item.attributes.title === data.themes[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.elements] = dirtyElements
      ?.filter((item: IDataName) => {
        for (let i = 0; i <= data?.elements?.length; i++) {
          if (item.attributes.name === data.elements[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.level] = CDirtyLevels
      ?.filter((item: any) => {
        if (item.attributes.title === data.level) {
          return item;
        }
      })
      .map((item) => item.id);
    form[EWork.studentAges] = CDirtyStudentsAges
      ?.filter((item: any) => {
        for (let i = 0; i <= data?.studentAges?.length; i++) {
          if (item.attributes.title === data.studentAges[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.studentTypes] = CDirtyStudentTypes
      ?.filter((item: any) => {
        for (let i = 0; i <= data?.studentTypes?.length; i++) {
          if (item.attributes.title === data.studentTypes[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.teachingTips] = dirtyTeachingTips
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.elements?.length; i++) {
          if (item.attributes.title === data.teachingTips[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.timeSignatures] = dirtyTimeSignatures
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.timeSignatures?.length; i++) {
          if (item.attributes.title === data.timeSignatures[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.keySignatures] = dirtyKeySignatures
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.keySignatures?.length; i++) {
          if (item.attributes.title === data.keySignatures[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.eras] = CDirtyEras
      ?.filter((item: any) => {
        if (item.attributes.name === data.eras) {
          return item;
        }
      })
      .map((item) => item.id);
    form[EWork.holidays] = dirtyHolidays
      ?.filter((item: IDataName) => {
        for (let i = 0; i <= data?.holidays?.length; i++) {
          if (item.attributes.name === data.holidays[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[EWork.instrumentations]  = CDirtyInstrumentations
      ?.filter((item: any) => {
        if (item.attributes.name === data.instrumentations) {
          return item;
        }
      })
      .map((item) => item.id);
    if (form[EWork.measureCount]) {
      form[EWork.measureCount] = Number(data.measureCount);
    } else {
      form[EWork.measureCount] = NaN;
    };
    if (form[EWork.title] && data.title) {
      form[EWork.title] = data.title.trim();
    };
    if (form[EWork.alternateTitle] && data.alternateTitle) {
      form[EWork.alternateTitle] = data.alternateTitle.trim();
    };
    if (form[EWork.videoEmbedCode] && data.videoEmbedCode) {
      form[EWork.videoEmbedCode] = data.videoEmbedCode.trim();
    };
    if (form[EWork.urlSpotify] && data.urlSpotify) {
      form[EWork.urlSpotify] = data.urlSpotify.trim();
    };
    if (form[EWork.urlAppleMusic] && data.urlAppleMusic) {
      form[EWork.urlAppleMusic] = data.urlAppleMusic.trim();
    };
    if (form[EWork.description] && data.description) {
      form[EWork.description] = data.description.trim();
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
      dirtyComposers,
      dirtyPublishers,
      dirtyCollections,
      dirtyMoods,
      dirtyStyles,
      dirtyThemes,
      dirtyElements,
      dirtyTeachingTips,
      dirtyTimeSignatures,
      dirtyKeySignatures,
      dirtyHolidays
    );
    return reforgedData;
  };

  useEffect(() => {
    const subscription = watch((data: any) => {
      const localData = localStorage.getItem('addWorkForm');

      if (localData) {
        const parsedLocalData = JSON.parse(localData);
        if (data[EWork.hasLyrics]) {
          data[EWork.hasLyrics] = handleTransformString(data[EWork.hasLyrics]);
        } else {
          delete data[EWork.hasLyrics];
        };
        if (data[EWork.hasTeacherDuet]) {
          data[EWork.hasTeacherDuet] = handleTransformString(data[EWork.hasTeacherDuet]);
        } else {
          delete data[EWork.hasTeacherDuet];
        };
        localStorage.setItem(
          'addWorkForm',
          JSON.stringify({
            ...parsedLocalData,
            ...data,
            [EWork.title]: data[EWork.title] ? data[EWork.title] : parsedLocalData.title,
            [EWork.alternateTitle]: data[EWork.alternateTitle] ? data[EWork.alternateTitle] : parsedLocalData.alternateTitle,
            [EWork.composers]: composers ? composers : parsedLocalData.composers,
            [EWork.publishers]: publishers ? publishers : parsedLocalData.publishers,
            [EWork.collections]: collections ? collections : parsedLocalData.collections,
            [EWork.videoEmbedCode]: data[EWork.videoEmbedCode] ? data[EWork.videoEmbedCode] : parsedLocalData.videoEmbedCode,
            [EWork.urlSpotify]: data[EWork.urlSpotify] ? data[EWork.urlSpotify] : parsedLocalData.urlSpotify,
            [EWork.urlAppleMusic]: data[EWork.urlAppleMusic] ? data[EWork.urlAppleMusic] : parsedLocalData.urlAppleMusic,
            [EWork.moods]: moods ? moods : parsedLocalData.moods,
            [EWork.styles]: styles ? styles : parsedLocalData.styles,
            [EWork.themes]: themes ? themes : parsedLocalData.themes,
            [EWork.elements]: elements ? elements : parsedLocalData.elements,
            [EWork.level]: level ? level : parsedLocalData.level,
            [EWork.studentAges]: studentAges ? studentAges : parsedLocalData.studentAges,
            [EWork.studentTypes]: studentTypes ? studentTypes : parsedLocalData.studentTypes,
            [EWork.teachingTips]: teachingTips ? teachingTips : parsedLocalData.teachingTips,
            [EWork.timeSignatures]: timeSignatures ? timeSignatures : parsedLocalData.timeSignatures,
            [EWork.keySignatures]: keySignatures ? keySignatures : parsedLocalData.keySignatures,
            [EWork.measureCount]: data[EWork.measureCount] ? data[EWork.measureCount] : parsedLocalData.measureCount,
            [EWork.holidays]: holidays ? holidays : parsedLocalData.holidays,
            [EWork.eras]: era ? era : parsedLocalData.era,
            [EWork.instrumentations]: instrumentation ? instrumentation : parsedLocalData.instrumentation,
            [EWork.yearPublished]: data[EWork.yearPublished] ? data[EWork.yearPublished] : parsedLocalData.yearPublished,
            [EWork.hasLyrics]: data[EWork.hasLyrics] ? data[EWork.hasLyrics] : parsedLocalData.hasLyrics,
            [EWork.hasTeacherDuet]: data[EWork.hasTeacherDuet] ? data[EWork.hasTeacherDuet] : parsedLocalData.hasTeacherDuet,
            [EWork.description]: data[EWork.description] ? data[EWork.description] : parsedLocalData.description
          })
        );
      } else {
        localStorage.setItem(
          'addWorkForm',
          JSON.stringify({
            ...data,
            [EWork.composers]: (composers && composers?.length > 0) ? composers : null,
            [EWork.publishers]: (publishers && publishers?.length > 0) ? publishers : null,
            [EWork.collections]: (collections && collections?.length > 0) ? collections : null,
            [EWork.moods]: (moods && moods?.length > 0) ? moods : null,
            [EWork.styles]: (styles && styles?.length > 0) ? styles : null,
            [EWork.themes]: (themes && themes?.length > 0) ? themes : null,
            [EWork.elements]: (elements && elements?.length > 0) ? elements : null,
            [EWork.level]: level ? level : null,
            [EWork.studentAges]: (studentAges && studentAges?.length > 0) ? studentAges : null,
            [EWork.studentTypes]: (studentTypes && studentTypes?.length > 0) ? studentTypes : null,
            [EWork.teachingTips]: (teachingTips && teachingTips?.length > 0) ? teachingTips : null,
            [EWork.timeSignatures]: (timeSignatures && timeSignatures?.length > 0) ? timeSignatures : null,
            [EWork.keySignatures]: (keySignatures && keySignatures?.length > 0) ? keySignatures : null,
            [EWork.eras]: era ? era : null,
            [EWork.instrumentations]: instrumentation ? instrumentation : null,
            [EWork.holidays]: (holidays && holidays?.length > 0) ? holidays : null
          })
        );
      };

      if (data[EWork.title]) {
        setIsTitle(true);
        if (data[EWork.title].length > 100) {
          setIsTitleOverLimit(true);
        } else {
          setIsTitleOverLimit(false);
        };
      } else {
        setIsTitle(false);
      };
      if (data[EWork.alternateTitle]) {
        if (data[EWork.alternateTitle].length > 100) {
          setIsAlternateTitleOverLimit(true);
        } else {
          setIsAlternateTitleOverLimit(false);
        };
      };
      if (data[EWork.videoEmbedCode]) {
        if (data[EWork.videoEmbedCode].length > 250) {
          setIsVideoEmbedCodeOverLimit(true);
        } else {
          setIsVideoEmbedCodeOverLimit(false);
        };
      };
      if (data[EWork.urlSpotify]) {
        if (data[EWork.urlSpotify].length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        };
      };
      if (data[EWork.urlAppleMusic]) {
        if (data[EWork.urlAppleMusic].length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        };
      };
      if (data[EWork.description]) {
        setIsDescription(true);
        if (data[EWork.description].length > 100) {
          setIsDescriptionOverLimit(true);
        } else {
          setIsDescriptionOverLimit(false);
        };
      } else {
        setIsDescription(false);
      };

      setFirstControlValue((prevState) => ({
        ...prevState,
        [EWork.title]: data[EWork.title],
        [EWork.alternateTitle]: data[EWork.alternateTitle],
        [EWork.videoEmbedCode]: data[EWork.videoEmbedCode],
        [EWork.urlSpotify]: data[EWork.urlSpotify],
        [EWork.urlAppleMusic]: data[EWork.urlAppleMusic],
        [EWork.level]: data[EWork.level],
        [EWork.measureCount]: data[EWork.measureCount],
        [EWork.instrumentations]: data[EWork.instrumentations],
        [EWork.yearPublished]: data[EWork.yearPublished],
        [EWork.eras]: data[EWork.eras],
        [EWork.holidays]: data[EWork.holidays],
        [EWork.hasLyrics]: data[EWork.hasLyrics],
        [EWork.hasTeacherDuet]: data[EWork.hasTeacherDuet],
        [EWork.description]: data[EWork.description]
      }));
    });

    return () => subscription.unsubscribe();
  }, [watch, setFirstControlValue, composers, publishers, collections, moods, styles, themes, elements, level, studentAges, studentTypes, teachingTips, timeSignatures, keySignatures, instrumentation, era, holidays, isTeacherDuet, setValue]);

  const handleError = () => {
    const newErrors = [];
    if (!isTitle) {
      newErrors.push({ name: 'title', message: 'Enter a Title' });
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

  const clearAddWorkForm = () => {
    setIsTitle(false);
    setTitleText('');
    setValue(EWork.title, '');
    setIsTitleOverLimit(false);
    setValue(EWork.alternateTitle, '');
    setIsAlternateTitleOverLimit(false);
    setComposers(null);
    setComposersOptions(null);
    getComposers();
    setPublishers(null);
    setPublishersOptions(null);
    getPublishers();
    setCollections(null);
    setCollectionsOptions(null);
    getCollections();
    setValue(EWork.videoEmbedCode, '');
    setValue(EWork.urlSpotify, '');
    setValue(EWork.urlAppleMusic, '');
    setIsVideoEmbedCodeOverLimit(false);
    setMoods([]);
    setMoodsOptions(null);
    getMoods();
    setStyles([]);
    setStylesOptions(null);
    getStyles();
    setThemes([]);
    setThemesOptions(null);
    getThemes();
    setElements([]);
    setElementsOptions(null);
    getElements();
    setLevel('');
    setLevelOptions(CLevels);
    setStudentAges([]);
    setStudentAgeOptions(CStudentAges);
    setStudentTypes([]);
    setStudentTypeOptions(CStudentTypes);
    setTeachingTips([]);
    setTeachingTipsOptions(null);
    getTeachingTips();
    setTimeSignatures([]);
    setTimeSignaturesOptions(null);
    getTimeSignatures();
    setKeySignatures([]);
    setKeySignaturesOptions(null);
    getKeySignatures();
    setValue(EWork.measureCount, '');
    setInstrumentation('');
    setValue(EWork.yearPublished, '');
    setEra('');
    setHolidays([]);
    setHolidaysOptions(null);
    getHolidays();
    setIsLyrics(null);
    setIsTeacherDuet(null);
    setIsDescription(false);
    setDescriptionText('');
    setValue(EWork.description, '');
    setIsDescriptionOverLimit(false);
    setFile(undefined);
    (document.getElementById('workImage') as HTMLInputElement).value = '';
    localStorage.removeItem('addWorkForm');
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
          type={titleText ? ('Add Work Disclaimer - ' + titleText) : firstControlValue[EWork.title] ? ('Add Work Disclaimer - ' + firstControlValue[EWork.title]) : 'Add Work Disclaimer - No Title Yet'}
          url={`${EUrlsPages.ADD_WORK}`}
          onClose={() => { setShowModalFeedback(false); }}
          isOpen={showModalFeedback}
        />
      </div>
      <Divider className='mt-0 mb-0' />
      <div className='flex flex-col gap-y-6 mx-auto py-8'>
        <div className='flex flex-wrap gap-6 grow'>
          <div className='grow'>
            <Field
              labelEl={
                <LabelTooltip
                  htmlFor={EWork.title}
                  label='Title'
                  labelRequired={<span className='text-pmdRed'> *</span>}
                  tooltip={2}
                />
              }
              name={EWork.title}
              component={InputText}
              control={control}
              formState={formState}
              placeholder='Title'
              className='!px-5 pt-[17px] pb-4'
              error={!isTitle || isTitleOverLimit}
            />
            {isTitleOverLimit && (
              <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
                Title is too long (Max 100 characters)
              </p>
            )}
          </div>
          <div className='grow'>
            <Field
              labelEl={
                <LabelTooltip
                  htmlFor={EWork.alternateTitle}
                  label='Alternate Title'
                  tooltip={3}
                />
              }
              name={EWork.alternateTitle}
              component={InputText}
              control={control}
              formState={formState}
              placeholder='Alternate Title'
              className='!px-5 pt-[17px] pb-4'
              error={isAlternateTitleOverLimit}
            />
            {isAlternateTitleOverLimit && (
              <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
                Alternate Title is too long (Max 100 characters)
              </p>
            )}
          </div>
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingComposers ? (
            <p>Loading {(composersOptionsLength) && (composersOptionsLength)} Composers...</p>
          ) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-2'
                    htmlFor={EWork.composers}
                    label='Composer(s)'
                    labelRequired={<span className='text-pmdRed'> *</span>}
                    tooltip={4}
                  />
                }
                name={EWork.composers}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Composer(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={composersOptions}
                setValues={handleComposers}
                values={composers}
                onFilter={setComposersOptions}
                error={(!composers)}
              />
              <Link
                href={`/${EUrlsPages.ADD_COMPOSER}`}
              >
                <a
                  title='Add New Composer'
                  className={cn(
                    `pt-1.5 flex gap-2 cursor-pointer text-sm`,
                    (composers && composers.length) && '!pt-3.5'
                  )}
                >
                  <ImageNext src={IconPlus} height={16} width={16} />
                  <em>Add New Composer</em>
                </a>
              </Link>
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingPublishers ? (
            <p>Loading {(publishersOptionsLength) && (publishersOptionsLength)} Publishers...</p>
          ) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-2'
                    htmlFor={EWork.publishers}
                    label='Publisher(s)'
                    tooltip={20}
                  />
                }
                name={EWork.publishers}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Publisher(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={publishersOptions}
                setValues={handlePublishers}
                values={publishers}
                onFilter={setPublishersOptions}
              />
              <Link
                href={`/${EUrlsPages.ADD_PUBLISHER}`}
              >
                <a
                  title='Add New Publisher'
                  className={cn(
                    `pt-1.5 flex gap-2 cursor-pointer text-sm`,
                    (publishers && publishers.length && 'pt-3.5')
                  )}
                >
                  <ImageNext src={IconPlus} height={16} width={16} />
                  <em>Add New Publisher</em>
                </a>
              </Link>
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingCollections ? (
            <p>Loading {(collectionsOptionsLength) && (collectionsOptionsLength)} Collections...</p>
          ) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.collections}
                    label='Collection(s)'
                    tooltip={12}
                  />
                }
                name={EWork.collections}
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
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <Field
            labelEl={
              <LabelTooltip
                className='mb-1'
                htmlFor={EWork.videoEmbedCode}
                label='YouTube Link'
                tooltip={38}
              />
            }
            name={EWork.videoEmbedCode}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='https://youtu.be/__?start=__'
            className='!px-5 pt-[17px] pb-4'
            error={isVideoEmbedCodeOverLimit}
          />
          {isVideoEmbedCodeOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              YouTube Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EWork.urlSpotify}
              label='Spotify Link'
            />}
            name={EWork.urlSpotify}
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
              htmlFor={EWork.urlAppleMusic}
              label='Apple Music Link'
            />}
            name={EWork.urlAppleMusic}
            component={InputText}
            control={control}
            formState={formState}
            placeholder='https://music.apple.com/__/album/__/__?i=__'
            className='!px-5 pt-[17px] pb-4'
            error={isURLAppleMusicOverLimit}
          />
          {isURLAppleMusicOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Apple Music Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingMoods ? (<>
            <p>Loading {(moodsOptionsLength) && (moodsOptionsLength)} Moods...</p>
          </>) : (<>
            <div className='sm:max-w-[180px] grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.moods}
                    label='Mood(s)'
                    tooltip={22}
                  />
                }
                name={EWork.moods}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Mood(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={moodsOptions}
                setValues={handleMoods}
                values={moods}
                onFilter={setMoodsOptions}
              />
            </div>
          </>)}
          {isLoadingStyles ? (<>
            <Divider className='mt-0 mb-0' />
            <p>Loading {(stylesOptionsLength) && (stylesOptionsLength)} Styles...</p>
          </>) : (<>
            <div className='sm:max-w-[180px] grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.styles}
                    label='Style(s)'
                    tooltip={23}
                  />
                }
                name={EWork.styles}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Style(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={stylesOptions}
                setValues={handleStyles}
                values={styles}
                onFilter={setStylesOptions}
              />
            </div>
          </>)}
          {isLoadingThemes ? (<>
            <Divider className='mt-0 mb-0' />
            <p>Loading {(themesOptionsLength) && (themesOptionsLength)} Themes...</p>
          </>) : (<>
            <div className='sm:max-w-[180px] grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.themes}
                    label='Theme(s)'
                    tooltip={24}
                  />
                }
                name={EWork.themes}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Theme(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={themesOptions}
                setValues={handleThemes}
                values={themes}
                onFilter={setThemesOptions}
              />
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingElements ? (
            <p>Loading {(elementsOptionsLength) && (elementsOptionsLength)} Elements...</p>
          ) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.elements}
                    label='Element(s)'
                    tooltip={25}
                  />
                }
                name={EWork.elements}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Element(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={elementsOptions}
                setValues={handleElements}
                values={elements}
                onFilter={setElementsOptions}
              />
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <LabelTooltip
            htmlFor={EWork.level}
            label='Level'
            labelRequired={<span className='text-pmdRed'> *</span>}
            tooltip={21}
          />
          <div>
            <FieldRadio
              htmlFor={EWork.level}
              suggestions={levelOptions}
              setValue={handleLevel}
              value={level}
              error={!level}
              withoutChips
            />
          </div>
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          <div className='grow'>
            <Field
              labelEl={
                <LabelTooltip
                  className='mb-1'
                  htmlFor={EWork.studentAges}
                  label='Student Age(s)'
                  tooltip={30}
                />
              }
              name={EWork.studentAges}
              component={FieldSelectMultiple}
              control={control}
              formState={formState}
              placeholder='Student Age(s)'
              className='!px-5 pt-[17px] pb-4'
              suggestions={studentAgeOptions}
              setValues={handleStudentAges}
              values={studentAges}
            />
          </div>
          <div className='grow'>
            <Field
              labelEl={
                <LabelTooltip
                  className='mb-1'
                  htmlFor={EWork.studentTypes}
                  label='Student Type(s)'
                  tooltip={31}
                />
              }
              name={EWork.studentTypes}
              component={FieldSelectMultiple}
              control={control}
              formState={formState}
              placeholder='Student Type(s)'
              className='!px-5 pt-[17px] pb-4'
              suggestions={studentTypeOptions}
              setValues={handleStudentTypes}
              values={studentTypes}
            />
          </div>
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          {isLoadingTeachingTips ? (<>
            <p>Loading {(teachingTipsOptionsLength) && (teachingTipsOptionsLength)} Teaching Tips...</p>
          </>) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.teachingTips}
                    label='Teaching Tip(s)'
                    tooltip={27}
                  />
                }
                name={EWork.teachingTips}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Teaching Tip(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={teachingTipsOptions}
                setValues={handleTeachingTips}
                values={teachingTips}
                onFilter={setTeachingTipsOptions}
              />
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          {isLoadingTimeSignatures ? (<>
            <p>Loading {(timeSignaturesOptionsLength) && (timeSignaturesOptionsLength)} Time Signatures...</p>
          </>) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.timeSignatures}
                    label='Time Signature(s)'
                    tooltip={28}
                  />
                }
                name={EWork.timeSignatures}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Time Signature(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={timeSignaturesOptions}
                setValues={handleTimeSignatures}
                values={timeSignatures}
                onFilter={setTimeSignaturesOptions}
              />
            </div>
          </>)}
          {isLoadingKeySignatures ? (<>
            <p>Loading {(keySignaturesOptionsLength) && (keySignaturesOptionsLength)} Key Signatures...</p>
          </>) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.keySignatures}
                    label='Key Signature(s)'
                    tooltip={29}
                  />
                }
                name={EWork.keySignatures}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Key Signature(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={keySignaturesOptions}
                setValues={handleKeySignatures}
                values={keySignatures}
                onFilter={setKeySignaturesOptions}
              />
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <Field
            labelEl={
              <LabelTooltip
                className='mb-1'
                htmlFor={EWork.measureCount}
                label='Number of Measures'
                tooltip={33}
              />
            }
            name={EWork.measureCount}
            component={InputNumber}
            control={control}
            formState={formState}
            placeholder='Number of Measures'
            className='!px-5 pt-[17px] pb-4'
          />
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <LabelTooltip
            htmlFor={EWork.instrumentations}
            label='Instrumentation'
            tooltip={34}
          />
          <div>
            <FieldRadio
              name={EWork.instrumentations}
              suggestions={CInstrumentations}
              setValue={handleInstrumentation}
              value={instrumentation}
              withoutChips
            />
          </div>
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <Field
            labelEl={
              <LabelTooltip
                className='mb-1'
                htmlFor={EWork.yearPublished}
                label='Year'
                tooltip={32}
              />
            }
            name={EWork.yearPublished}
            component={InputNumber}
            control={control}
            formState={formState}
            min={500}
            max={2039}
            placeholder='Year'
            className='!px-5 pt-[17px] pb-4'
          />
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <div className='grow'>
            <LabelTooltip
              htmlFor={EWork.eras}
              label='Era'
              labelRequired={<span className='text-pmdRed'> *</span>}
              tooltip={40}
            />
            <div>
              <FieldRadio
                name={EWork.eras}
                suggestions={CEras}
                setValue={handleEra}
                value={era}
                error={!era}
                withoutChips
                viewAllThreshold={9}
                hideViewAll={true}
              />
            </div>
          </div>
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          {isLoadingHolidays ? (<>
            <p>Loading {(holidaysOptionsLength) && (holidaysOptionsLength)} Holidays...</p>
          </>) : (<>
            <div className='grow'>
              <Field
                labelEl={
                  <LabelTooltip
                    className='mb-1'
                    htmlFor={EWork.holidays}
                    label='Holiday(s)'
                    tooltip={35}
                  />
                }
                name={EWork.holidays}
                component={MultipleAutocomplete}
                control={control}
                formState={formState}
                placeholder='Holiday(s)'
                className='!px-5 pt-[17px] pb-4'
                suggestions={holidaysOptions}
                setValues={handleHolidays}
                values={holidays}
                onFilter={setHolidaysOptions}
              />
            </div>
          </>)}
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='flex flex-wrap gap-6 grow'>
          <div className='grow'>
            <LabelTooltip
              htmlFor={EWork.hasLyrics}
              label='Lyrics?'
              tooltip={36}
            />
            <div>
              <FieldRadio
                name={EWork.hasLyrics}
                suggestions={['Yes', 'No']}
                setValue={handleIsLyrics}
                value={isLyrics}
                withoutChips
              />
            </div>
          </div>
          <div className='grow'>
            <LabelTooltip
              htmlFor={EWork.hasTeacherDuet}
              label='Teacher Duet?'
              tooltip={37}
            />
            <div>
              <FieldRadio
                name={EWork.hasTeacherDuet}
                suggestions={['Yes', 'No']}
                setValue={handleIsTeacherDuet}
                value={isTeacherDuet}
                withoutChips
              />
            </div>
          </div>
        </div>
        <Divider className='mt-0 mb-0' />
        <div className='grow'>
          <Field
            labelEl={<Label
              htmlFor={EWork.description}
              label='Description'
            />}
            name={EWork.description}
            component={TextArea}
            rows={7}
            control={control}
            formState={formState}
            placeholder='Description'
            className='!px-5 pt-[17px] pb-4'
            error={isDescriptionOverLimit}
          />
          {isDescriptionOverLimit && (
            <p className='mt-1.5 font-bold text-pmdRed text-xl italic'>
              Description is too long (Max 1000 characters)
            </p>
          )}
        </div>
        <Divider className='mt-0 mb-0' />
        <div
          id='InputImage'
          className='flex flex-col grow'
        >
          <Label
            htmlFor='workImage'
            label='Image'
            desc='JPG/PNG, Max File Size 4MB, Max Height 2000px, Max Width 2000px'
          />
          <p className='mb-2 text-red-300 text-xs'>Please crop the image to under 2000x2000px BEFORE uploading. <br />Cropping upon upload is coming soon.</p>
          <div className='flex flex-row justify-center items-center w-full text-left'>
            <input
              type='file'
              id='workImage'
              name='workImage'
              accept='image/png, image/jpeg'
              autoComplete='off'
              className='!flex !justify-center !items-center hover:bg-pmdGrayBright px-5 py-5 border border-pmdGray rounded-lg focus-visible:outline-0 w-full !text-pmdGray hover:text-pmdGrayDark placeholder:text-pmdGray text-sm !text-left tracking-thigh cursor-pointer'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 4194304) {
                  if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    const img = new window.Image();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      img.src = event.target?.result as string;
                      img.onload = () => {
                        if (img.width <= 2000 || img.height <= 2000) {
                          handleFile(file);
                        } else {
                          dispatch({
                            type: ENotificationActionTypes.SET_MESSAGE,
                            payload: {
                              message: 'Image is too large (Max 2000x2000px)',
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
                      message: 'Image file size is too large (Max 4MB)',
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
      </div>
      <Divider className='mt-0 mb-0' />
      {userName && (
        <>
          <div className='flex flex-wrap items-center gap-2 mt-6'>
            <p>This work is being added by:</p>
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
              <p><strong>NOTE:</strong> <em>New works are not publicly visible until reviewed by staff!</em></p>
              <p>You can view the status of your added works in <Link href={`/${EUrlsPages.WORKS_ADDED}`}><a className='text-pmdGray' title='Works Added'>Works Added</a></Link></p>
            </div>
            <p className='mt-3 mb-8 text-pmdGray text-sm'><em>By adding a work to Piano Music Database, you agree to the <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}><a className='text-pmdGray' title='Terms and Conditions'>terms and conditions</a></Link>.</em></p>
            {(firstControlValue[EWork.title] || isTitle) && (composers && composers.length > 0) && (firstControlValue[EWork.eras] || era) && (firstControlValue[EWork.level] || level) ? (
              (!(isTitleOverLimit || isAlternateTitleOverLimit || isVideoEmbedCodeOverLimit || isURLSpotifyOverLimit || isURLAppleMusicOverLimit || isDescriptionOverLimit)) ? (
                <div className='flex flex-col gap-4 w-full'>
                  <button
                    type='button'
                    title='Submit New Work'
                    className='mx-auto mb-6 cursor-pointer button'
                    onClick={handleSubmit(handleAddWork)}
                  >
                    <div className='flex flex-row gap-x-3'>
                      <ImageNext src={IconPlusWhite} height={16} width={16} />
                      Add New Work
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
                      aria-controls='modalResetAddWorkForm'
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
                    Add New Work
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
                      aria-controls='modalResetAddWorkForm'
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
              (!(isTitleOverLimit || isAlternateTitleOverLimit || isVideoEmbedCodeOverLimit || isURLSpotifyOverLimit || isURLAppleMusicOverLimit || isDescriptionOverLimit)) ? (
                (composers && composers.length > 0) ? (
                  (firstControlValue[EWork.level] || level) ? (
                    (firstControlValue[EWork.eras] || era) ? (
                      <div className='flex flex-col gap-4 w-full'>
                        <a
                          title='Add a Title to your new work!'
                          className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                          href='#top'
                        >
                          <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                          Add New Work
                        </a>
                        <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                          <span><em>You are missing a <strong>Title</strong>!</em></span>
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
                            aria-controls='modalResetAddWorkForm'
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
                          title='Select an Era for your new work!'
                          className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                          href='#top'
                        >
                          <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                          Add New Work
                        </a>
                        <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                          <span><em>You must select an <strong>Era</strong>!</em></span>
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
                            aria-controls='modalResetAddWorkForm'
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
                    <div className='flex flex-col gap-4 w-full'>
                      <a
                        title='Select a Level for your new work!'
                        className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                        href='#top'
                      >
                        <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                        Add New Work
                      </a>
                      <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                        <span><em>You must select a <strong>Level</strong>!</em></span>
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
                          aria-controls='modalResetAddWorkForm'
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
                  <div className='flex flex-col gap-4 w-full'>
                    <a
                      title='Add at least one Composer to your new work!'
                      className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                      href='#top'
                    >
                      <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                      Add New Work
                    </a>
                    <p className='flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center'>
                      <span><em>You must select at least one <strong>Composer</strong>!</em></span>
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
                        aria-controls='modalResetAddWorkForm'
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
                <div className='flex flex-col gap-4 w-full'>
                  <a
                    title='Check all fields for errors and try again!'
                    className='flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button'
                    href='#top'
                  >
                    <ImageNext src={IconPlusWhite} height={16} width={16} />
                    Add New Work
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
                      aria-controls='modalResetAddWorkForm'
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
      <ModalResetAddWorkForm
        handleClear={() => {
          handleIsOpenClearModal();
          clearAddWorkForm();
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
        description='Your work image is uploading. This may take a few moments...'
        isOpen={isOpenModalImageUploading}
        onClose={handleIsOpenModalImageUploading}
      />
    </>
  );
};

export default AddWork;
