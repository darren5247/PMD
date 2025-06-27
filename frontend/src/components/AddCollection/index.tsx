import { FC, useEffect, useContext, useState } from "react";
import cn from "classnames";
import { useRouter } from "next/router";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import apiImage from "@src/api/configImage";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Field from "@src/components/Field";
import MultipleAutocomplete from "@src/components/MultipleAutocomplete";
import InputText from "@src/components/InputText";
import InputNumber from "@src/components/InputNumber";
import TextArea from "@src/components/TextArea";
import Label from "@src/components/Label";
import LabelTooltip from "@src/components/LabelTooltip";
import Divider from "@src/components/Divider";
import Chip from "@src/components/Chip";
import ImageNext from "@src/components/ImageNext";
import ImagePicture from "@src/components/ImagePicture";
import Link from "next/link";
import {
  IconPencilRed,
  IconPlus,
  IconPlusWhite,
  IconPlusGrayBright,
  IconChevronUpWhite,
  IconFeedback,
  IconDelete,
} from "@src/common/assets/icons";

import {
  ECollection,
  collectionRules,
  EComposer,
  EPublisher,
  defaultCollectionValues,
  EUrlsPages,
} from "@src/constants";

import {
  ENotificationActionTypes,
  ENotificationTypes,
  IDataName,
  TUserAttributes,
} from "@src/types";

import {
  ModalResetAddCollectionForm,
  ModalFeedback,
  ModalImageUploading,
} from "@src/components/Modals";

interface IAddCollectionForm {
  [ECollection.title]: string;
  [ECollection.catalogue_number]: string;
  [ECollection.composed_date]: string;
  [ECollection.published_date]: string;
  [ECollection.isbn_10]: string;
  [ECollection.isbn_13]: string;
  [ECollection.videoYouTube]: string;
  [ECollection.urlSpotify]: string;
  [ECollection.urlAppleMusic]: string;
  [ECollection.urlWebsite]: string;
  [ECollection.description]: string;
  [ECollection.composers]: EComposer[];
  [ECollection.publishers]: EPublisher[];
}

type TAddCollectionForm = IAddCollectionForm | FieldValues;

const AddCollection: FC = (): JSX.Element => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [firstControlValue, setFirstControlValue] = useState(
    defaultCollectionValues,
  );
  const handleIsOpenClearModal = () => setIsOpenClearModal(!isOpenClearModal);
  const [isOpenClearModal, setIsOpenClearModal] = useState(false);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(true);
  const { control, handleSubmit, formState, setValue, watch } =
    useForm<TAddCollectionForm>();
  const [userName, setUserName] = useState<string | null>(null);

  const [isTitle, setIsTitle] = useState(false);
  const [titleText, setTitleText] = useState<string | "">("");
  const [isTitleOverLimit, setIsTitleOverLimit] = useState(false);
  const [isCatalogueOverLimit, setIsCatalogueOverLimit] = useState(false);
  const [isVideoYoutubeOverLimit, setIsVideoYoutubeOverLimit] = useState(false);
  const [isURLSpotifyOverLimit, setIsURLSpotifyOverLimit] = useState(false);
  const [isURLAppleMusicOverLimit, setIsURLAppleMusicOverLimit] =
    useState(false);
  const [isURLWebsiteOverLimit, setIsURLWebsiteOverLimit] = useState(false);
  const [isDescriptionOverLimit, setIsDescriptionOverLimit] = useState(false);

  const [isLoadingComposers, setIsLoadingComposers] = useState(false);
  const [composers, setComposers] = useState<string[] | null>(null);
  const [dirtyComposers, setDirtyComposers] = useState<IDataName[]>([]);
  const [composersOptions, setComposersOptions] = useState<string[] | null>(
    null,
  );
  const [composersOptionsLength, setComposersOptionsLength] = useState<
    string | null
  >(null);

  const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);
  const [publishers, setPublishers] = useState<string[] | null>(null);
  const [dirtyPublishers, setDirtyPublishers] = useState<IDataName[]>([]);
  const [publishersOptions, setPublishersOptions] = useState<string[] | null>(
    null,
  );
  const [publishersOptionsLength, setPublishersOptionsLength] = useState<
    string | null
  >(null);

  const [isOpenModalImageUploading, setIsOpenModalImageUploading] =
    useState(false);
  const handleIsOpenModalImageUploading = () =>
    setIsOpenModalImageUploading(!isOpenModalImageUploading);
  const [file, setFile] = useState<File>();

  const handleFile = (image: File) => {
    setFile(image);
    console.log(image);
  };

  useEffect(() => {
    const addCollectionData = JSON.parse(
      localStorage.getItem("addCollectionForm") || "{}",
    );

    if (addCollectionData) {
      if (addCollectionData.title) {
        setIsTitle(true);
        setTitleText(addCollectionData.title);
        setValue(ECollection.title, addCollectionData.title);
        if (addCollectionData.title.length > 100) {
          setIsTitleOverLimit(true);
        } else {
          setIsTitleOverLimit(false);
        }
      }
      if (addCollectionData.catalogue_number) {
        setValue(
          ECollection.catalogue_number,
          addCollectionData.catalogue_number,
        );
        if (addCollectionData.catalogue_number.length > 100) {
          setIsCatalogueOverLimit(true);
        } else {
          setIsCatalogueOverLimit(false);
        }
      }
      setValue(ECollection.composed_date, addCollectionData.composed_date);
      setValue(ECollection.published_date, addCollectionData.published_date);
      setValue(ECollection.isbn_10, addCollectionData.isbn_10);
      setValue(ECollection.isbn_13, addCollectionData.isbn_13);
      if (addCollectionData.videoYouTube) {
        setValue(ECollection.videoYouTube, addCollectionData.videoYouTube);
        if (addCollectionData.videoYouTube.length > 250) {
          setIsVideoYoutubeOverLimit(true);
        } else {
          setIsVideoYoutubeOverLimit(false);
        }
      }
      if (addCollectionData.urlSpotify) {
        setValue(ECollection.urlSpotify, addCollectionData.urlSpotify);
        if (addCollectionData.urlSpotify.length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        }
      }
      if (addCollectionData.urlAppleMusic) {
        setValue(ECollection.urlAppleMusic, addCollectionData.urlAppleMusic);
        if (addCollectionData.urlAppleMusic.length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        }
      }
      if (addCollectionData.urlWebsite) {
        setValue(ECollection.urlWebsite, addCollectionData.urlWebsite);
        if (addCollectionData.urlWebsite.length > 250) {
          setIsURLWebsiteOverLimit(true);
        } else {
          setIsURLWebsiteOverLimit(false);
        }
      }
      if (addCollectionData.description) {
        setValue(ECollection.description, addCollectionData.description);
        if (addCollectionData.description.length > 250) {
          setIsDescriptionOverLimit(true);
        } else {
          setIsDescriptionOverLimit(false);
        }
      }
      if (
        addCollectionData.composers &&
        addCollectionData.composers.length > 0
      ) {
        setComposers(
          addCollectionData.composers?.map((item: IDataName) => item),
        );
      }
      if (
        addCollectionData.publishers &&
        addCollectionData.publishers.length > 0
      ) {
        setPublishers(
          addCollectionData.publishers?.map((item: IDataName) => item),
        );
      }
    }

    const getComposers = async () => {
      const addCollectionData = JSON.parse(
        localStorage.getItem("addCollectionForm") || "{}",
      );
      try {
        setIsLoadingComposers(true);
        const fetchedData = [];
        const { data } = await api.get(
          "composers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview",
        );
        fetchedData.push(...data?.data);
        setComposersOptionsLength(
          data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize +
            "/" +
            data?.meta?.pagination?.total,
        );
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            const response = await api.get(
              `composers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`,
            );
            fetchedData.push(...response.data.data);
            setComposersOptionsLength(
              response?.data?.meta?.pagination?.page *
                response?.data?.meta?.pagination?.pageSize +
                "/" +
                response?.data?.meta?.pagination?.total,
            );
          }
        }
        setDirtyComposers(fetchedData);
        if (fetchedData) {
          const cleanComposers = fetchedData?.map(
            (item: IDataName) => item?.attributes?.name,
          );
          const filteredData = cleanComposers?.filter((composer: string) => {
            if (
              addCollectionData &&
              addCollectionData.composers &&
              addCollectionData.composers.length > 0
            ) {
              return !addCollectionData.composers.some(
                (composerParsed: string) => composerParsed === composer,
              );
            } else {
              return true;
            }
          });
          setComposersOptions(filteredData);
        } else {
          setComposersOptions(null);
        }
      } catch (error: any) {
        if (error?.response?.data) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } finally {
        setIsLoadingComposers(false);
      }
    };

    const getPublishers = async () => {
      const addCollectionData = JSON.parse(
        localStorage.getItem("addCollectionForm") || "{}",
      );
      try {
        setIsLoadingPublishers(true);
        const fetchedData = [];
        const { data } = await api.get(
          "publishers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview",
        );
        fetchedData.push(...data?.data);
        setPublishersOptionsLength(
          data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize +
            "/" +
            data?.meta?.pagination?.total,
        );
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            const response = await api.get(
              `publishers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`,
            );
            fetchedData.push(...response.data.data);
            setPublishersOptionsLength(
              response?.data?.meta?.pagination?.page *
                response?.data?.meta?.pagination?.pageSize +
                "/" +
                response?.data?.meta?.pagination?.total,
            );
          }
        }
        setDirtyPublishers(fetchedData);
        if (fetchedData) {
          const cleanPublishers = fetchedData?.map(
            (item: IDataName) => item?.attributes?.name,
          );
          const filteredData = cleanPublishers?.filter((publisher: string) => {
            if (
              addCollectionData &&
              addCollectionData.publishers &&
              addCollectionData.publishers.length > 0
            ) {
              return !addCollectionData.publishers.some(
                (publisherParsed: string) => publisherParsed === publisher,
              );
            } else {
              return true;
            }
          });
          setPublishersOptions(filteredData);
        } else {
          setPublishersOptions(null);
        }
      } catch (error: any) {
        if (error?.response?.data) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } finally {
        setIsLoadingPublishers(false);
      }
    };

    getComposers();
    getPublishers();

    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      if (accountData.name) {
        setUserName(accountData.name);
      }
    } else {
      localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    }
  }, [router, dispatch, setValue]);

  const getComposers = async () => {
    const addCollectionData = JSON.parse(
      localStorage.getItem("addCollectionForm") || "{}",
    );
    try {
      setIsLoadingComposers(true);
      const fetchedData = [];
      const { data } = await api.get(
        "composers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview",
      );
      fetchedData.push(...data?.data);
      setComposersOptionsLength(
        data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize +
          "/" +
          data?.meta?.pagination?.total,
      );
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          const response = await api.get(
            `composers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`,
          );
          fetchedData.push(...response.data.data);
          setComposersOptionsLength(
            response?.data?.meta?.pagination?.page *
              response?.data?.meta?.pagination?.pageSize +
              "/" +
              response?.data?.meta?.pagination?.total,
          );
        }
      }
      setDirtyComposers(fetchedData);
      if (fetchedData) {
        const cleanComposers = fetchedData?.map(
          (item: IDataName) => item?.attributes?.name,
        );
        const filteredData = cleanComposers?.filter((composer: string) => {
          if (
            addCollectionData &&
            addCollectionData.composers &&
            addCollectionData.composers.length > 0
          ) {
            return !addCollectionData.composers.some(
              (composerParsed: string) => composerParsed === composer,
            );
          } else {
            return true;
          }
        });
        setComposersOptions(filteredData);
      } else {
        setComposersOptions(null);
      }
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.error?.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
    } finally {
      setIsLoadingComposers(false);
    }
  };

  const getPublishers = async () => {
    const addCollectionData = JSON.parse(
      localStorage.getItem("addCollectionForm") || "{}",
    );
    try {
      setIsLoadingPublishers(true);
      const fetchedData = [];
      const { data } = await api.get(
        "publishers?pagination[page]=1&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview",
      );
      fetchedData.push(...data?.data);
      setPublishersOptionsLength(
        data?.meta?.pagination?.page * data?.meta?.pagination?.pageSize +
          "/" +
          data?.meta?.pagination?.total,
      );
      if (
        data?.meta?.pagination &&
        fetchedData.length > 0 &&
        data?.meta?.pagination.page < data?.meta?.pagination.pageCount
      ) {
        const { page, pageCount } = data?.meta?.pagination;
        for (let i = page + 1; i <= pageCount; i++) {
          const response = await api.get(
            `publishers?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=name:asc&fields[0]=name&publicationState=preview`,
          );
          fetchedData.push(...response.data.data);
          setPublishersOptionsLength(
            response?.data?.meta?.pagination?.page *
              response?.data?.meta?.pagination?.pageSize +
              "/" +
              response?.data?.meta?.pagination?.total,
          );
        }
      }
      setDirtyPublishers(fetchedData);
      if (fetchedData) {
        const cleanPublishers = fetchedData?.map(
          (item: IDataName) => item?.attributes?.name,
        );
        const filteredData = cleanPublishers?.filter((publisher: string) => {
          if (
            addCollectionData &&
            addCollectionData.publishers &&
            addCollectionData.publishers.length > 0
          ) {
            return !addCollectionData.publishers.some(
              (publisherParsed: string) => publisherParsed === publisher,
            );
          } else {
            return true;
          }
        });
        setPublishersOptions(filteredData);
      } else {
        setPublishersOptions(null);
      }
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.error?.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
    } finally {
      setIsLoadingPublishers(false);
    }
  };

  const handleComposers = (composersRaw: string[]) => {
    if (!(composersRaw === composers)) {
      setComposers(composersRaw);
    }
    const localData = localStorage.getItem("addCollectionForm");
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyComposers?.map(
      (item: IDataName) => item?.attributes?.name,
    );
    if (dirtyData && parsedLocalData) {
      const composersParsed = parsedLocalData.composers;
      const filteredData = dirtyData.filter((item: string) => {
        return !composersParsed?.some(
          (composer: IDataName) => composer?.attributes?.name === item,
        );
      });
      setComposersOptions(filteredData);
    }
    localStorage.setItem(
      "addCollectionForm",
      JSON.stringify({
        ...parsedLocalData,
        [ECollection.composers]: composersRaw,
      }),
    );
  };

  const handlePublishers = (publishersRaw: string[]) => {
    if (!(publishersRaw === publishers)) {
      setPublishers(publishersRaw);
    }
    const localData = localStorage.getItem("addCollectionForm");
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyPublishers?.map(
      (item: IDataName) => item?.attributes?.name,
    );
    if (dirtyData && parsedLocalData) {
      const publishersParsed = parsedLocalData.publishersRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !publishersParsed?.some(
          (publisher: IDataName) => publisher?.attributes?.name === item,
        );
      });
      setPublishersOptions(filteredData);
    }
    localStorage.setItem(
      "addCollectionForm",
      JSON.stringify({
        ...parsedLocalData,
        [ECollection.publishers]: publishersRaw,
      }),
    );
  };

  const handleAddCollection: SubmitHandler<TAddCollectionForm> = (data) => {
    const form = {
      ...data,
      [ECollection.composers]: composers,
      [ECollection.publishers]: publishers,
    };

    if (form && isSubmitAllowed) {
      if (!handleError(form)) {
        setIsSubmitAllowed(false);
        handleData(form);
      } else {
        setIsSubmitAllowed(true);
      }
    }
  };

  const handleData = async (form: any) => {
    try {
      const preparedForm = preparedFormData(form);
      const data = await api.post("collections", { data: preparedForm });
      if (data && data?.data?.data?.id && file) {
        handleImageData(data);
      }
      clearAddCollectionForm();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: `"${data?.data.data.attributes?.title}" Added Successfully`,
          type: ENotificationTypes.SUCCESS,
        },
      });
      router.push(`/${EUrlsPages.ADDED_COLLECTION}`, undefined, {
        shallow: false,
      });
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.error?.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
      setIsSubmitAllowed(true);
    }
  };

  const handleImageData = async (data: any) => {
    try {
      if (data && data?.data?.data?.id && file) {
        setIsOpenModalImageUploading(true);
        console.log(file);
        const formData = new FormData();
        formData.append("field", "image");
        formData.append("files", file);
        formData.append("path", "uploads/collections");
        formData.append("ref", "api::collection.collection");
        formData.append("refId", data?.data.data.id);
        console.log(formData);
        const dataImage = await apiImage.post("upload", formData);
        console.log(dataImage);
        if (dataImage && dataImage?.request?.status === 200) {
          setIsOpenModalImageUploading(false);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Collection Image Uploaded Successfully",
              type: ENotificationTypes.SUCCESS,
            },
          });
        }
      }
    } catch (error: any) {
      if (error?.response?.data) {
        setIsOpenModalImageUploading(false);
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.error?.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
      setIsSubmitAllowed(true);
    }
  };

  const prepareForm = (
    data: any,
    dirtyComposers: IDataName[],
    dirtyPublishers: IDataName[],
  ) => {
    const form = { ...data };
    form[ECollection.composers] = dirtyComposers
      ?.filter((item: IDataName) => {
        for (let i = 0; i <= data?.composers?.length; i++) {
          if (item.attributes.name === data.composers[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    form[ECollection.publishers] = dirtyPublishers
      ?.filter((item: IDataName) => {
        for (let i = 0; i <= data?.publishers?.length; i++) {
          if (item.attributes.name === data.publishers[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    if (form[ECollection.title] && data.title) {
      form[ECollection.title] = data.title.trim();
    }
    if (form[ECollection.catalogue_number] && data.catalogue_number) {
      form[ECollection.catalogue_number] = data.catalogue_number.trim();
    }
    if (form[ECollection.description] && data.description) {
      form[ECollection.description] = data.description.trim();
    }
    if (form[ECollection.videoYouTube] && data.videoYouTube) {
      form[ECollection.videoYouTube] = data.videoYouTube.trim();
    }
    if (form[ECollection.urlSpotify] && data.urlSpotify) {
      form[ECollection.urlSpotify] = data.urlSpotify.trim();
    }
    if (form[ECollection.urlAppleMusic] && data.urlAppleMusic) {
      form[ECollection.urlAppleMusic] = data.urlAppleMusic.trim();
    }
    if (form[ECollection.urlWebsite] && data.urlWebsite) {
      form[ECollection.urlWebsite] = data.urlWebsite.trim();
    }
    form.publishedAt = null;
    form.adminReview = "For Review";
    if (state.user) {
      form.user = state.user;
    }
    return form;
  };

  const preparedFormData = (data: any) => {
    const reforgedData = prepareForm(data, dirtyComposers, dirtyPublishers);
    return reforgedData;
  };

  useEffect(() => {
    const subscription = watch((data: any) => {
      const localData = localStorage.getItem("addCollectionForm");

      if (localData) {
        const parsedLocalData = JSON.parse(localData);
        localStorage.setItem(
          "addCollectionForm",
          JSON.stringify({
            ...parsedLocalData,
            ...data,
            [ECollection.title]: data[ECollection.title]
              ? data[ECollection.title]
              : parsedLocalData.title,
            [ECollection.catalogue_number]: data[ECollection.catalogue_number]
              ? data[ECollection.catalogue_number]
              : parsedLocalData.catalogue_number,
            [ECollection.composed_date]: data[ECollection.composed_date]
              ? data[ECollection.composed_date]
              : parsedLocalData.composed_date,
            [ECollection.published_date]: data[ECollection.published_date]
              ? data[ECollection.published_date]
              : parsedLocalData.published_date,
            [ECollection.description]: data[ECollection.description]
              ? data[ECollection.description]
              : parsedLocalData.description,
            [ECollection.isbn_10]: data[ECollection.isbn_10]
              ? data[ECollection.isbn_10]
              : parsedLocalData.isbn_10,
            [ECollection.isbn_13]: data[ECollection.isbn_13]
              ? data[ECollection.isbn_13]
              : parsedLocalData.isbn_13,
            [ECollection.composers]: composers
              ? composers
              : parsedLocalData.composers,
            [ECollection.publishers]: publishers
              ? publishers
              : parsedLocalData.publishers,
            [ECollection.videoYouTube]: data[ECollection.videoYouTube]
              ? data[ECollection.videoYouTube]
              : parsedLocalData.videoYouTube,
            [ECollection.urlSpotify]: data[ECollection.urlSpotify]
              ? data[ECollection.urlSpotify]
              : parsedLocalData.urlSpotify,
            [ECollection.urlAppleMusic]: data[ECollection.urlAppleMusic]
              ? data[ECollection.urlAppleMusic]
              : parsedLocalData.urlAppleMusic,
          }),
        );
      } else {
        localStorage.setItem(
          "addCollectionForm",
          JSON.stringify({
            ...data,
            [ECollection.composers]:
              composers && composers?.length > 0 ? composers : null,
            [ECollection.publishers]:
              publishers && publishers?.length > 0 ? publishers : null,
          }),
        );
      }

      if (data[ECollection.title]) {
        setIsTitle(true);
        if (data[ECollection.title].length > 100) {
          setIsTitleOverLimit(true);
        } else {
          setIsTitleOverLimit(false);
        }
      } else {
        setIsTitle(false);
      }
      if (data[ECollection.catalogue_number]) {
        if (data[ECollection.catalogue_number].length > 100) {
          setIsCatalogueOverLimit(true);
        } else {
          setIsCatalogueOverLimit(false);
        }
      }
      if (data[ECollection.videoYouTube]) {
        if (data[ECollection.videoYouTube].length > 250) {
          setIsVideoYoutubeOverLimit(true);
        } else {
          setIsVideoYoutubeOverLimit(false);
        }
      }
      if (data[ECollection.urlSpotify]) {
        if (data[ECollection.urlSpotify].length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        }
      }
      if (data[ECollection.urlAppleMusic]) {
        if (data[ECollection.urlAppleMusic].length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        }
      }
      if (data[ECollection.urlWebsite]) {
        if (data[ECollection.urlWebsite].length > 250) {
          setIsURLWebsiteOverLimit(true);
        } else {
          setIsURLWebsiteOverLimit(false);
        }
      }

      setFirstControlValue((prevState) => ({
        ...prevState,
        [ECollection.title]: data[ECollection.title],
        [ECollection.catalogue_number]: data[ECollection.catalogue_number],
        [ECollection.composed_date]: data[ECollection.composed_date],
        [ECollection.published_date]: data[ECollection.published_date],
        [ECollection.description]: data[ECollection.description],
        [ECollection.isbn_10]: data[ECollection.isbn_10],
        [ECollection.isbn_13]: data[ECollection.isbn_13],
        [ECollection.videoYouTube]: data[ECollection.videoYouTube],
        [ECollection.urlSpotify]: data[ECollection.urlSpotify],
        [ECollection.urlAppleMusic]: data[ECollection.urlAppleMusic],
        [ECollection.urlWebsite]: data[ECollection.urlWebsite],
      }));
    });

    return () => subscription.unsubscribe();
  }, [watch, setFirstControlValue, composers, publishers, setValue]);

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in collectionRules) {
      if (!collectionRules[key].rule(form[key]))
        newErrors.push({ name: key, message: collectionRules[key].message });
    }
    newErrors.forEach((el) =>
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: el.message,
          type: ENotificationTypes.ERROR,
        },
      }),
    );
    if (newErrors.length > 0) return true;
  };

  const clearAddCollectionForm = () => {
    setIsTitle(false);
    setTitleText("");
    setValue(ECollection.title, "");
    setValue(ECollection.catalogue_number, "");
    setValue(ECollection.composed_date, "");
    setValue(ECollection.published_date, "");
    setValue(ECollection.isbn_10, "");
    setValue(ECollection.isbn_13, "");
    setValue(ECollection.videoYouTube, "");
    setValue(ECollection.urlSpotify, "");
    setValue(ECollection.urlAppleMusic, "");
    setValue(ECollection.urlWebsite, "");
    setValue(ECollection.description, "");
    setFile(undefined);
    (document.getElementById("collectionImage") as HTMLInputElement).value = "";
    setComposers(null);
    setComposersOptions(null);
    getComposers();
    setPublishers(null);
    setPublishersOptions(null);
    getPublishers();
    localStorage.removeItem("addCollectionForm");
    scrollTo(0, 0);
    setIsSubmitAllowed(true);
  };

  return (
    <>
      <div
        id="feedback"
        className="flex flex-row flex-wrap justify-center items-center gap-x-5 gap-y-2 bg-pmdGrayBright mb-3 px-3 py-8 rounded-lg w-full text-center"
      >
        <p>Got feedback, questions, or suggestions?</p>
        <a
          title="Send Feedback"
          onClick={() => {
            setShowModalFeedback(true);
          }}
          className="flex flex-row gap-2 cursor-pointer"
        >
          <ImageNext
            src={IconFeedback}
            alt=""
            height={20}
            width={20}
            className="z-0"
          />
          <strong>Send Feedback</strong>
        </a>
        <ModalFeedback
          type={
            titleText
              ? "Add Collection Disclaimer - " + titleText
              : firstControlValue[ECollection.title]
                ? "Add Collection Disclaimer - " +
                  firstControlValue[ECollection.title]
                : "Add Collection Disclaimer - No Title Yet"
          }
          url={`${EUrlsPages.ADD_COLLECTION}`}
          onClose={() => {
            setShowModalFeedback(false);
          }}
          isOpen={showModalFeedback}
        />
      </div>
      <Divider className="mt-0 mb-0" />
      <div className="flex flex-col gap-y-6 pt-2 pb-8">
        <div className="grow">
          <Field
            labelEl={
              <LabelTooltip
                className="mb-1"
                htmlFor={ECollection.title}
                label="Title"
                labelRequired={<span className="text-pmdRed"> *</span>}
                tooltip={14}
              />
            }
            name={ECollection.title}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Title"
            className="!px-5 pt-[17px] pb-4"
            error={!isTitle || isTitleOverLimit}
          />
          {isTitleOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Title is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={
              <LabelTooltip
                className="mb-1"
                htmlFor={ECollection.catalogue_number}
                label="Catalogue #"
                tooltip={15}
              />
            }
            name={ECollection.catalogue_number}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Catalogue #"
            className="!px-5 pt-[17px] pb-4"
            error={isCatalogueOverLimit}
          />
          {isCatalogueOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Catalogue # is too long (Max 100 characters)
            </p>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="flex flex-wrap gap-6 grow">
          <div className="grow">
            <Field
              labelEl={
                <Label
                  htmlFor={ECollection.composed_date}
                  label="Year Composed (YYYY)"
                />
              }
              name={ECollection.composed_date}
              component={InputNumber}
              control={control}
              formState={formState}
              min={500}
              max={2039}
              placeholder="Year Composed (YYYY)"
              className="!px-5 pt-[17px] pb-4"
            />
          </div>
          <div className="grow">
            <Field
              labelEl={
                <LabelTooltip
                  className="mb-1"
                  htmlFor={ECollection.published_date}
                  label="Year Published (YYYY)"
                  tooltip={17}
                />
              }
              name={ECollection.published_date}
              component={InputNumber}
              control={control}
              formState={formState}
              min={500}
              max={2039}
              placeholder="Year Published (YYYY)"
              className="!px-5 pt-[17px] pb-4"
            />
          </div>
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="flex flex-wrap gap-6 grow">
          {isLoadingComposers ? (
            <p>
              Loading {composersOptionsLength && composersOptionsLength}{" "}
              Composers...
            </p>
          ) : (
            <>
              <div className="grow">
                <Field
                  labelEl={
                    <Label
                      htmlFor={ECollection.composers}
                      label="Composer(s)"
                    />
                  }
                  name={ECollection.composers}
                  component={MultipleAutocomplete}
                  control={control}
                  formState={formState}
                  placeholder="Composer(s)"
                  className="!px-5 pt-[17px] pb-4"
                  suggestions={composersOptions}
                  setValues={handleComposers}
                  values={composers}
                  onFilter={setComposersOptions}
                  error={!composers}
                />
                <Link href={`/${EUrlsPages.ADD_COMPOSER}`}>
                  <a
                    title="Add New Composer"
                    className={cn(
                      `pt-1.5 flex gap-2 cursor-pointer text-sm`,
                      composers && composers.length && "!pt-3.5",
                    )}
                  >
                    <ImageNext src={IconPlus} height={16} width={16} />
                    <em>Add New Composer</em>
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="flex flex-wrap gap-6 grow">
          {isLoadingPublishers ? (
            <p>
              Loading {publishersOptionsLength && publishersOptionsLength}{" "}
              Publishers...
            </p>
          ) : (
            <>
              <div className="grow">
                <Field
                  labelEl={
                    <Label
                      htmlFor={ECollection.publishers}
                      label="Publisher(s)"
                    />
                  }
                  name={ECollection.publishers}
                  component={MultipleAutocomplete}
                  control={control}
                  formState={formState}
                  placeholder="Publisher(s)"
                  className="!px-5 pt-[17px] pb-4"
                  suggestions={publishersOptions}
                  setValues={handlePublishers}
                  values={publishers}
                  onFilter={setPublishersOptions}
                />
                <Link href={`/${EUrlsPages.ADD_PUBLISHER}`}>
                  <a
                    title="Add New Publisher"
                    className={cn(
                      `pt-1.5 flex gap-2 cursor-pointer text-sm`,
                      publishers && publishers.length && "pt-3.5",
                    )}
                  >
                    <ImageNext src={IconPlus} height={16} width={16} />
                    <em>Add New Publisher</em>
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="grow">
          <Field
            labelEl={
              <Label htmlFor={ECollection.description} label="Description" />
            }
            name={ECollection.description}
            component={TextArea}
            rows={7}
            control={control}
            formState={formState}
            placeholder="Description"
            className="!px-5 pt-[17px] pb-4"
            error={isDescriptionOverLimit}
          />
          {isDescriptionOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Description is too long (Max 1000 characters)
            </p>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="flex flex-wrap gap-6 grow">
          <div className="grow">
            <Field
              labelEl={<Label htmlFor={ECollection.isbn_10} label="ISBN 10" />}
              name={ECollection.isbn_10}
              component={InputNumber}
              control={control}
              formState={formState}
              placeholder="ISBN 10"
              className="!px-5 pt-[17px] pb-4"
            />
          </div>
          <div className="grow">
            <Field
              labelEl={<Label htmlFor={ECollection.isbn_13} label="ISBN 13" />}
              name={ECollection.isbn_13}
              component={InputNumber}
              control={control}
              formState={formState}
              placeholder="ISBN 13"
              className="!px-5 pt-[17px] pb-4"
            />
          </div>
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="grow">
          <Field
            labelEl={
              <Label htmlFor={ECollection.videoYouTube} label="YouTube Link" />
            }
            name={ECollection.videoYouTube}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://youtu.be/__?start=__"
            className="!px-5 pt-[17px] pb-4"
            error={isVideoYoutubeOverLimit}
          />
          {isVideoYoutubeOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              YouTube Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={
              <Label htmlFor={ECollection.urlSpotify} label="Spotify Link" />
            }
            name={ECollection.urlSpotify}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://open.spotify.com/track/__"
            className="!px-5 pt-[17px] pb-4"
            error={isURLSpotifyOverLimit}
          />
          {isURLSpotifyOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Spotify Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={
              <Label
                htmlFor={ECollection.urlAppleMusic}
                label="Apple Music Link"
              />
            }
            name={ECollection.urlAppleMusic}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://music.apple.com/__/album/__/__?i=__"
            className="!px-5 pt-[17px] pb-4"
            error={isURLAppleMusicOverLimit}
          />
          {isURLAppleMusicOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Apple Music Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={
              <Label htmlFor={ECollection.urlWebsite} label="Custom Link" />
            }
            name={ECollection.urlWebsite}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://example.com/collection"
            className="!px-5 pt-[17px] pb-4"
            error={isURLWebsiteOverLimit}
          />
          {isURLWebsiteOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Custom Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div id="InputImage" className="flex flex-col grow">
          <Label
            htmlFor="collectionImage"
            label="Collection Image"
            desc="JPG/PNG, Max File Size 4MB, Max Height 2000px, Max Width 2000px"
          />
          <p className="mb-2 text-red-300 text-xs">
            Please crop the image to under 2000x2000px BEFORE uploading. <br />
            Cropping upon upload is coming soon.
          </p>
          <div className="flex flex-row justify-center items-center w-full text-left">
            <input
              type="file"
              id="collectionImage"
              name="collectionImage"
              accept="image/png, image/jpeg"
              autoComplete="off"
              className="!flex !justify-center !items-center hover:bg-pmdGrayBright px-5 py-5 border border-pmdGray rounded-lg focus-visible:outline-0 w-full !text-pmdGray hover:text-pmdGrayDark placeholder:text-pmdGray text-sm !text-left tracking-thigh cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 4194304) {
                  if (file.type === "image/jpeg" || file.type === "image/png") {
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
                              message: "Image is too large (Max 2000x2000px)",
                              type: ENotificationTypes.ERROR,
                            },
                          });
                        }
                      };
                    };
                    reader.readAsDataURL(file);
                  } else {
                    dispatch({
                      type: ENotificationActionTypes.SET_MESSAGE,
                      payload: {
                        message: "Image is the wrong format (JPG/PNG)",
                        type: ENotificationTypes.ERROR,
                      },
                    });
                  }
                } else {
                  dispatch({
                    type: ENotificationActionTypes.SET_MESSAGE,
                    payload: {
                      message: "Image file size is too large (Max 4MB)",
                      type: ENotificationTypes.ERROR,
                    },
                  });
                }
              }}
            />
          </div>
          {file && file.name && (
            <div id={"UploadedImage-" + file.name} className="flex mt-2 w-full">
              <div className="flex flex-col bg-pmdGrayBright rounded-lg">
                <ImagePicture
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="object-contain"
                  layout="fixed"
                  height={90}
                  width={90}
                />
                <p className="px-3 pt-2 text-pmdGray text-xs">{file.name}</p>
                <a
                  onClick={() => setFile(undefined)}
                  title="Remove Image"
                  className="flex justify-center items-center gap-2 px-3 py-2 text-pmdRed text-xs cursor-pointer"
                >
                  <ImageNext src={IconDelete} height={12} width={12} />
                  Remove
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {userName && (
        <>
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <p>This collection is being added by:</p>
            <div className="flex flex-wrap items-center gap-2">
              <Chip title={userName} />
              <Link href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}>
                <a title="Edit Account Name">
                  <ImageNext
                    src={IconPencilRed}
                    alt=""
                    height={16}
                    width={16}
                    className="z-0"
                  />
                </a>
              </Link>
            </div>
            <div className="flex flex-col gap-y-4 bg-pmdGrayBright mt-3 px-6 py-4 rounded-lg w-full text-sm text-center">
              <p>
                <strong>NOTE:</strong>{" "}
                <em>
                  New collections are not publicly visible until reviewed by
                  staff!
                </em>
              </p>
              <p>
                You can view the status of your added collections in{" "}
                <Link href={`/${EUrlsPages.COLLECTIONS_ADDED}`}>
                  <a className="text-pmdGray" title="Collections Added">
                    Collections Added
                  </a>
                </Link>
              </p>
            </div>
            <p className="mt-3 mb-8 text-pmdGray text-sm">
              <em>
                By adding a collection to Piano Music Database, you agree to the{" "}
                <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}>
                  <a className="text-pmdGray" title="Terms and Conditions">
                    terms and conditions
                  </a>
                </Link>
                .
              </em>
            </p>
            {firstControlValue[ECollection.title] || isTitle ? (
              !(
                isTitleOverLimit ||
                isURLSpotifyOverLimit ||
                isURLAppleMusicOverLimit ||
                isURLWebsiteOverLimit
              ) ? (
                <div className="flex flex-col gap-4 w-full">
                  <button
                    type="button"
                    title="Submit New Collection"
                    className="mx-auto mb-6 cursor-pointer button"
                    onClick={handleSubmit(handleAddCollection)}
                  >
                    <div className="flex flex-row gap-x-3">
                      <ImageNext src={IconPlusWhite} height={16} width={16} />
                      Add New Collection
                    </div>
                  </button>
                  <Divider className="mt-0 mb-0" />
                  <p className="flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end">
                    <span className="text-pmdGrayDark">
                      <em>Need to start over?</em>
                    </span>
                    <a
                      title="Reset this form"
                      aria-label="Reset this form"
                      aria-haspopup="dialog"
                      aria-expanded={isOpenClearModal}
                      aria-controls="modalResetAddCollectionForm"
                      className="cursor-pointer"
                      onClick={handleIsOpenClearModal}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleIsOpenClearModal();
                        }
                      }}
                      tabIndex={0}
                    >
                      <em>
                        <strong>Reset this form</strong>
                      </em>
                    </a>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <a
                    title="Check all fields for errors and try again!"
                    className="flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button"
                    href="#top"
                  >
                    <ImageNext
                      src={IconPlusGrayBright}
                      height={16}
                      width={16}
                    />
                    Add New Collection
                  </a>
                  <p className="flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center">
                    <span>
                      <em>Check all fields for errors and try again!</em>
                    </span>
                    <a
                      title="Back to Top"
                      className="flex flex-row justify-center items-center gap-x-3 !text-white !hover:text-pmdGrayLight !focus:text-pmdGrayLight !active:text-pmdGrayLight text-center cursor-pointer"
                      href="#top"
                    >
                      <ImageNext
                        src={IconChevronUpWhite}
                        height={16}
                        width={16}
                      />
                      <em>
                        <strong>Back to Top</strong>
                      </em>
                    </a>
                  </p>
                  <Divider className="mt-0 mb-0" />
                  <p className="flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end">
                    <span className="text-pmdGrayDark">
                      <em>Need to start over?</em>
                    </span>
                    <a
                      title="Reset this form"
                      aria-label="Reset this form"
                      aria-haspopup="dialog"
                      aria-expanded={isOpenClearModal}
                      aria-controls="modalResetAddCollectionForm"
                      className="cursor-pointer"
                      onClick={handleIsOpenClearModal}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleIsOpenClearModal();
                        }
                      }}
                      tabIndex={0}
                    >
                      <em>
                        <strong>Reset this form</strong>
                      </em>
                    </a>
                  </p>
                </div>
              )
            ) : !(
                isTitleOverLimit ||
                isURLSpotifyOverLimit ||
                isURLAppleMusicOverLimit ||
                isURLWebsiteOverLimit
              ) ? (
              <div className="flex flex-col gap-4 w-full">
                <a
                  title="Add a Title to your new collection!"
                  className="flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button"
                  href="#top"
                >
                  <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                  Add New Collection
                </a>
                <p className="flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center">
                  <span>
                    <em>
                      You are missing a <strong>Title</strong>!
                    </em>
                  </span>
                  <a
                    title="Back to Top"
                    className="flex flex-row justify-center items-center gap-x-3 !text-white !hover:text-pmdGrayLight !focus:text-pmdGrayLight !active:text-pmdGrayLight text-center cursor-pointer"
                    href="#top"
                  >
                    <ImageNext
                      src={IconChevronUpWhite}
                      height={16}
                      width={16}
                    />
                    <em>
                      <strong>Back to Top</strong>
                    </em>
                  </a>
                </p>
                <Divider className="mt-0 mb-0" />
                <p className="flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end">
                  <span className="text-pmdGrayDark">
                    <em>Need to start over?</em>
                  </span>
                  <a
                    title="Reset this form"
                    aria-label="Reset this form"
                    aria-haspopup="dialog"
                    aria-expanded={isOpenClearModal}
                    aria-controls="modalResetAddCollectionForm"
                    className="cursor-pointer"
                    onClick={handleIsOpenClearModal}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleIsOpenClearModal();
                      }
                    }}
                    tabIndex={0}
                  >
                    <em>
                      <strong>Reset this form</strong>
                    </em>
                  </a>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <a
                  title="Check all fields for errors and try again!"
                  className="flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button"
                  href="#top"
                >
                  <ImageNext src={IconPlusWhite} height={16} width={16} />
                  Add New Collection
                </a>
                <p className="flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center">
                  <span>
                    <em>Check all fields for errors and try again!</em>
                  </span>
                  <a
                    title="Back to Top"
                    className="flex flex-row justify-center items-center gap-x-3 !text-white !hover:text-pmdGrayLight !focus:text-pmdGrayLight !active:text-pmdGrayLight text-center cursor-pointer"
                    href="#top"
                  >
                    <ImageNext
                      src={IconChevronUpWhite}
                      height={16}
                      width={16}
                    />
                    <em>
                      <strong>Back to Top</strong>
                    </em>
                  </a>
                </p>
                <Divider className="mt-0 mb-0" />
                <p className="flex justify-end gap-2 mt-6 pr-1 w-full text-sm text-end">
                  <span className="text-pmdGrayDark">
                    <em>Need to start over?</em>
                  </span>
                  <a
                    title="Reset this form"
                    aria-label="Reset this form"
                    aria-haspopup="dialog"
                    aria-expanded={isOpenClearModal}
                    aria-controls="modalResetAddCollectionForm"
                    className="cursor-pointer"
                    onClick={handleIsOpenClearModal}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleIsOpenClearModal();
                      }
                    }}
                    tabIndex={0}
                  >
                    <em>
                      <strong>Reset this form</strong>
                    </em>
                  </a>
                </p>
              </div>
            )}
          </div>
        </>
      )}
      <ModalResetAddCollectionForm
        handleClear={() => {
          handleIsOpenClearModal();
          clearAddCollectionForm();
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "All fields/selections reset",
              type: ENotificationTypes.SUCCESS,
            },
          });
        }}
        isOpen={isOpenClearModal}
        onClose={handleIsOpenClearModal}
      />
      <ModalImageUploading
        description="Your collection image is uploading. This may take a few moments..."
        isOpen={isOpenModalImageUploading}
        onClose={handleIsOpenModalImageUploading}
      />
    </>
  );
};

export default AddCollection;
