import { FC, useEffect, useContext, useState } from "react";
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
  EComposer,
  publisherRules,
  ECollection,
  defaultComposerValues,
  EUrlsPages,
} from "@src/constants";

import {
  ENotificationActionTypes,
  ENotificationTypes,
  IDataName,
  IDataTitle,
  TUserAttributes,
} from "@src/types";

import {
  ModalResetAddComposerForm,
  ModalFeedback,
  ModalImageUploading,
} from "@src/components/Modals";

interface IAddComposerForm {
  [EComposer.name]: string;
  [EComposer.birth_year]: string;
  [EComposer.death_year]: string;
  [EComposer.nationality]: string;
  [EComposer.ethnicity]: string;
  [EComposer.gender]: string;
  [EComposer.pronouns]: string;
  [EComposer.excerpt]: string;
  [EComposer.urlSpotify]: string;
  [EComposer.urlAppleMusic]: string;
  [EComposer.urlWebsite]: string;
  [EComposer.urlSocialInstagram]: string;
  [EComposer.urlSocialFacebook]: string;
  [EComposer.urlSocialX]: string;
  [EComposer.urlSocialLinkedIn]: string;
  [EComposer.urlSocialYouTube]: string;
  [EComposer.collections]: ECollection[];
}

type TAddComposerForm = IAddComposerForm | FieldValues;

const AddComposer: FC = (): JSX.Element => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [firstControlValue, setFirstControlValue] = useState(
    defaultComposerValues,
  );
  const handleIsOpenClearModal = () => setIsOpenClearModal(!isOpenClearModal);
  const [isOpenClearModal, setIsOpenClearModal] = useState(false);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(true);
  const { control, handleSubmit, formState, setValue, watch } =
    useForm<TAddComposerForm>();
  const [userName, setUserName] = useState<string | null>(null);

  const [isName, setIsName] = useState(false);
  const [nameText, setNameText] = useState<string | "">("");
  const [isNameOverLimit, setIsNameOverLimit] = useState(false);
  const [isNationalityOverLimit, setIsNationalityOverLimit] = useState(false);
  const [isEthnicityOverLimit, setIsEthnicityOverLimit] = useState(false);
  const [isGenderOverLimit, setIsGenderOverLimit] = useState(false);
  const [isPronounsOverLimit, setIsPronounsOverLimit] = useState(false);
  const [isExcerptOverLimit, setIsExcerptOverLimit] = useState(false);
  const [isURLSpotifyOverLimit, setIsURLSpotifyOverLimit] = useState(false);
  const [isURLAppleMusicOverLimit, setIsURLAppleMusicOverLimit] =
    useState(false);
  const [isURLWebsiteOverLimit, setIsURLWebsiteOverLimit] = useState(false);
  const [isURLSocialInstagramOverLimit, setIsURLSocialInstagramOverLimit] =
    useState(false);
  const [isURLSocialFacebookOverLimit, setIsURLSocialFacebookOverLimit] =
    useState(false);
  const [isURLSocialXOverLimit, setIsURLSocialXOverLimit] = useState(false);
  const [isURLSocialLinkedInOverLimit, setIsURLSocialLinkedInOverLimit] =
    useState(false);
  const [isURLSocialYouTubeOverLimit, setIsURLSocialYouTubeOverLimit] =
    useState(false);

  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [dirtyCollections, setDirtyCollections] = useState<IDataTitle[]>([]);
  const [collections, setCollections] = useState<string[] | null>(null);
  const [collectionsOptions, setCollectionsOptions] = useState<string[] | null>(
    null,
  );
  const [collectionsOptionsLength, setCollectionsOptionsLength] = useState<
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
    const addComposerData = JSON.parse(
      localStorage.getItem("addComposerForm") || "{}",
    );

    if (addComposerData) {
      if (addComposerData.name) {
        setIsName(true);
        setNameText(addComposerData.name);
        setValue(EComposer.name, addComposerData.name);
        if (addComposerData.name.length > 100) {
          setIsNameOverLimit(true);
        } else {
          setIsNameOverLimit(false);
        }
      }
      setValue(EComposer.birth_year, addComposerData.birth_year);
      setValue(EComposer.death_year, addComposerData.death_year);
      if (addComposerData.nationality) {
        setValue(EComposer.nationality, addComposerData.nationality);
        if (addComposerData.nationality.length > 100) {
          setIsNationalityOverLimit(true);
        } else {
          setIsNationalityOverLimit(false);
        }
      }
      if (addComposerData.ethnicity) {
        setValue(EComposer.ethnicity, addComposerData.ethnicity);
        if (addComposerData.ethnicity.length > 100) {
          setIsEthnicityOverLimit(true);
        } else {
          setIsEthnicityOverLimit(false);
        }
      }
      if (addComposerData.gender) {
        setValue(EComposer.gender, addComposerData.gender);
        if (addComposerData.gender.length > 100) {
          setIsGenderOverLimit(true);
        } else {
          setIsGenderOverLimit(false);
        }
      }
      if (addComposerData.pronouns) {
        setValue(EComposer.pronouns, addComposerData.pronouns);
        if (addComposerData.pronouns.length > 100) {
          setIsPronounsOverLimit(true);
        } else {
          setIsPronounsOverLimit(false);
        }
      }
      if (addComposerData.excerpt) {
        setValue(EComposer.excerpt, addComposerData.excerpt);
        if (addComposerData.excerpt.length > 1000) {
          setIsExcerptOverLimit(true);
        } else {
          setIsExcerptOverLimit(false);
        }
      }
      if (addComposerData.urlSpotify) {
        setValue(EComposer.urlSpotify, addComposerData.urlSpotify);
        if (addComposerData.urlSpotify.length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        }
      }
      if (addComposerData.urlAppleMusic) {
        setValue(EComposer.urlAppleMusic, addComposerData.urlAppleMusic);
        if (addComposerData.urlAppleMusic.length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        }
      }
      if (addComposerData.urlWebsite) {
        setValue(EComposer.urlWebsite, addComposerData.urlWebsite);
        if (addComposerData.urlWebsite.length > 250) {
          setIsURLWebsiteOverLimit(true);
        } else {
          setIsURLWebsiteOverLimit(false);
        }
      }
      if (addComposerData.urlSocialInstagram) {
        setValue(
          EComposer.urlSocialInstagram,
          addComposerData.urlSocialInstagram,
        );
        if (addComposerData.urlSocialInstagram.length > 250) {
          setIsURLSocialInstagramOverLimit(true);
        } else {
          setIsURLSocialInstagramOverLimit(false);
        }
      }
      if (addComposerData.urlSocialFacebook) {
        setValue(
          EComposer.urlSocialFacebook,
          addComposerData.urlSocialFacebook,
        );
        if (addComposerData.urlSocialFacebook.length > 250) {
          setIsURLSocialFacebookOverLimit(true);
        } else {
          setIsURLSocialFacebookOverLimit(false);
        }
      }
      if (addComposerData.urlSocialX) {
        setValue(EComposer.urlSocialX, addComposerData.urlSocialX);
        if (addComposerData.urlSocialX.length > 250) {
          setIsURLSocialXOverLimit(true);
        } else {
          setIsURLSocialXOverLimit(false);
        }
      }
      if (addComposerData.urlSocialLinkedIn) {
        setValue(
          EComposer.urlSocialLinkedIn,
          addComposerData.urlSocialLinkedIn,
        );
        if (addComposerData.urlSocialLinkedIn.length > 250) {
          setIsURLSocialLinkedInOverLimit(true);
        } else {
          setIsURLSocialLinkedInOverLimit(false);
        }
      }
      if (addComposerData.urlSocialYouTube) {
        setValue(EComposer.urlSocialYouTube, addComposerData.urlSocialYouTube);
        if (addComposerData.urlSocialYouTube.length > 250) {
          setIsURLSocialYouTubeOverLimit(true);
        } else {
          setIsURLSocialYouTubeOverLimit(false);
        }
      }
      if (
        addComposerData.collections &&
        addComposerData.collections.length > 0
      ) {
        setCollections(
          addComposerData.collections?.map((item: IDataName) => item),
        );
      }
    }

    const getCollections = async () => {
      const addComposerData = JSON.parse(
        localStorage.getItem("addComposerForm") || "{}",
      );
      try {
        setIsLoadingCollections(true);
        const fetchedData = [];
        const { data } = await api.get(
          "collections?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview",
        );
        fetchedData.push(...data?.data);
        setCollectionsOptionsLength(
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
              `collections?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview`,
            );
            fetchedData.push(...response.data.data);
            setCollectionsOptionsLength(
              response?.data?.meta?.pagination?.page *
                response?.data?.meta?.pagination?.pageSize +
                "/" +
                response?.data?.meta?.pagination?.total,
            );
          }
        }
        setDirtyCollections(fetchedData);
        if (fetchedData) {
          const cleanCollections = fetchedData?.map(
            (item: IDataTitle) => item?.attributes?.title,
          );
          const filteredData = cleanCollections?.filter(
            (collection: string) => {
              if (
                addComposerData &&
                addComposerData.collections &&
                addComposerData.collections.length > 0
              ) {
                return !addComposerData.collections.some(
                  (collectionParsed: string) => collectionParsed === collection,
                );
              } else {
                return true;
              }
            },
          );
          setCollectionsOptions(filteredData);
        } else {
          setCollectionsOptions(null);
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
        setIsLoadingCollections(false);
      }
    };

    getCollections();

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

  const getCollections = async () => {
    const addComposerData = JSON.parse(
      localStorage.getItem("addComposerForm") || "{}",
    );
    try {
      setIsLoadingCollections(true);
      const fetchedData = [];
      const { data } = await api.get(
        "collections?pagination[page]=1&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview",
      );
      fetchedData.push(...data?.data);
      setCollectionsOptionsLength(
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
            `collections?pagination[page]=${i}&pagination[pageSize]=100&sort[0]=title:asc&fields[0]=title&publicationState=preview`,
          );
          fetchedData.push(...response.data.data);
          setCollectionsOptionsLength(
            response?.data?.meta?.pagination?.page *
              response?.data?.meta?.pagination?.pageSize +
              "/" +
              response?.data?.meta?.pagination?.total,
          );
        }
      }
      setDirtyCollections(fetchedData);
      if (fetchedData) {
        const cleanCollections = fetchedData?.map(
          (item: IDataTitle) => item?.attributes?.title,
        );
        const filteredData = cleanCollections?.filter((collection: string) => {
          if (
            addComposerData &&
            addComposerData.collections &&
            addComposerData.collections.length > 0
          ) {
            return !addComposerData.collections.some(
              (collectionParsed: string) => collectionParsed === collection,
            );
          } else {
            return true;
          }
        });
        setCollectionsOptions(filteredData);
      } else {
        setCollectionsOptions(null);
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
      setIsLoadingCollections(false);
    }
  };

  const handleCollections = (collectionsRaw: string[]) => {
    if (!(collectionsRaw === collections)) {
      setCollections(collectionsRaw);
    }
    const localData = localStorage.getItem("addComposerForm");
    const parsedLocalData = JSON.parse(localData as any);
    const dirtyData = dirtyCollections?.map(
      (item: IDataTitle) => item?.attributes?.title,
    );
    if (dirtyData && parsedLocalData) {
      const collectionsParsed = parsedLocalData.collectionsRaw;
      const filteredData = dirtyData.filter((item: string) => {
        return !collectionsParsed?.some(
          (collection: IDataTitle) => collection?.attributes?.title === item,
        );
      });
      setCollectionsOptions(filteredData);
    }
    localStorage.setItem(
      "addComposerForm",
      JSON.stringify({
        ...parsedLocalData,
        [EComposer.collections]: collectionsRaw,
      }),
    );
  };

  const handleAddComposer: SubmitHandler<TAddComposerForm> = (data) => {
    const form = {
      ...data,
      [EComposer.collections]: collections,
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
      const data = await api.post("composers", { data: preparedForm });
      if (data && data?.data?.data?.id && file) {
        handleImageData(data);
      }
      clearAddComposerForm();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: `"${data?.data.data.attributes?.name}" Added Successfully`,
          type: ENotificationTypes.SUCCESS,
        },
      });
      router.push(`/${EUrlsPages.ADDED_COMPOSER}`, undefined, {
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
        formData.append("path", "uploads/composers");
        formData.append("ref", "api::composer.composer");
        formData.append("refId", data?.data.data.id);
        console.log(formData);
        const dataImage = await apiImage.post("upload", formData);
        console.log(dataImage);
        if (dataImage && dataImage?.request?.status === 200) {
          setIsOpenModalImageUploading(false);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Portrait Image Uploaded Successfully",
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

  const prepareForm = (data: any, dirtyCollections: IDataTitle[]) => {
    const form = { ...data };
    form[EComposer.collections] = dirtyCollections
      ?.filter((item: IDataTitle) => {
        for (let i = 0; i <= data?.collections?.length; i++) {
          if (item.attributes.title === data.collections[i]) {
            return item;
          }
        }
      })
      .map((item) => item.id);
    if (form[EComposer.nationality] && data.nationality) {
      form[EComposer.nationality] = data.nationality.trim();
    }
    if (form[EComposer.ethnicity] && data.ethnicity) {
      form[EComposer.ethnicity] = data.ethnicity.trim();
    }
    if (form[EComposer.gender] && data.gender) {
      form[EComposer.gender] = data.gender.trim();
    }
    if (form[EComposer.pronouns] && data.pronouns) {
      form[EComposer.pronouns] = data.pronouns.trim();
    }
    if (form[EComposer.excerpt] && data.excerpt) {
      form[EComposer.excerpt] = data.excerpt.trim();
    }
    if (form[EComposer.urlSpotify] && data.urlSpotify) {
      form[EComposer.urlSpotify] = data.urlSpotify.trim();
    }
    if (form[EComposer.urlAppleMusic] && data.urlAppleMusic) {
      form[EComposer.urlAppleMusic] = data.urlAppleMusic.trim();
    }
    if (form[EComposer.urlWebsite] && data.urlWebsite) {
      form[EComposer.urlWebsite] = data.urlWebsite.trim();
    }
    if (form[EComposer.urlSocialInstagram] && data.urlSocialInstagram) {
      form[EComposer.urlSocialInstagram] = data.urlSocialInstagram.trim();
    }
    if (form[EComposer.urlSocialFacebook] && data.urlSocialFacebook) {
      form[EComposer.urlSocialFacebook] = data.urlSocialFacebook.trim();
    }
    if (form[EComposer.urlSocialX] && data.urlSocialX) {
      form[EComposer.urlSocialX] = data.urlSocialX.trim();
    }
    if (form[EComposer.urlSocialLinkedIn] && data.urlSocialLinkedIn) {
      form[EComposer.urlSocialLinkedIn] = data.urlSocialLinkedIn.trim();
    }
    if (form[EComposer.urlSocialYouTube] && data.urlSocialYouTube) {
      form[EComposer.urlSocialYouTube] = data.urlSocialYouTube.trim();
    }
    form.publishedAt = null;
    form.adminReview = "For Review";
    if (state.user) {
      form.users = state.user;
    }
    return form;
  };

  const preparedFormData = (data: any) => {
    const reforgedData = prepareForm(data, dirtyCollections);
    return reforgedData;
  };

  useEffect(() => {
    const subscription = watch((data: any) => {
      const localData = localStorage.getItem("addComposerForm");

      if (localData) {
        const parsedLocalData = JSON.parse(localData);
        localStorage.setItem(
          "addComposerForm",
          JSON.stringify({
            ...parsedLocalData,
            ...data,
            [EComposer.name]: data[EComposer.name]
              ? data[EComposer.name]
              : parsedLocalData.name,
            [EComposer.birth_year]: data[EComposer.birth_year]
              ? data[EComposer.birth_year]
              : parsedLocalData.birth_year,
            [EComposer.death_year]: data[EComposer.death_year]
              ? data[EComposer.death_year]
              : parsedLocalData.death_year,
            [EComposer.nationality]: data[EComposer.nationality]
              ? data[EComposer.nationality]
              : parsedLocalData.nationality,
            [EComposer.ethnicity]: data[EComposer.ethnicity]
              ? data[EComposer.ethnicity]
              : parsedLocalData.ethnicity,
            [EComposer.gender]: data[EComposer.gender]
              ? data[EComposer.gender]
              : parsedLocalData.gender,
            [EComposer.pronouns]: data[EComposer.pronouns]
              ? data[EComposer.pronouns]
              : parsedLocalData.pronouns,
            [EComposer.excerpt]: data[EComposer.excerpt]
              ? data[EComposer.excerpt]
              : parsedLocalData.excerpt,
            [EComposer.urlSpotify]: data[EComposer.urlSpotify]
              ? data[EComposer.urlSpotify]
              : parsedLocalData.urlSpotify,
            [EComposer.urlAppleMusic]: data[EComposer.urlAppleMusic]
              ? data[EComposer.urlAppleMusic]
              : parsedLocalData.urlAppleMusic,
            [EComposer.urlWebsite]: data[EComposer.urlWebsite]
              ? data[EComposer.urlWebsite]
              : parsedLocalData.urlWebsite,
            [EComposer.urlSocialInstagram]: data[EComposer.urlSocialInstagram]
              ? data[EComposer.urlSocialInstagram]
              : parsedLocalData.urlSocialInstagram,
            [EComposer.urlSocialFacebook]: data[EComposer.urlSocialFacebook]
              ? data[EComposer.urlSocialFacebook]
              : parsedLocalData.urlSocialFacebook,
            [EComposer.urlSocialX]: data[EComposer.urlSocialX]
              ? data[EComposer.urlSocialX]
              : parsedLocalData.urlSocialX,
            [EComposer.urlSocialLinkedIn]: data[EComposer.urlSocialLinkedIn]
              ? data[EComposer.urlSocialLinkedIn]
              : parsedLocalData.urlSocialLinkedIn,
            [EComposer.urlSocialYouTube]: data[EComposer.urlSocialYouTube]
              ? data[EComposer.urlSocialYouTube]
              : parsedLocalData.urlSocialYouTube,
            [EComposer.collections]: collections
              ? collections
              : parsedLocalData.collections,
          }),
        );
      } else {
        localStorage.setItem(
          "addComposerForm",
          JSON.stringify({
            ...data,
            [EComposer.collections]:
              collections && collections?.length > 0 ? collections : null,
          }),
        );
      }

      if (data[EComposer.name]) {
        setIsName(true);
        if (data[EComposer.name].length > 100) {
          setIsNameOverLimit(true);
        } else {
          setIsNameOverLimit(false);
        }
      } else {
        setIsName(false);
      }
      if (data[EComposer.nationality]) {
        if (data[EComposer.nationality].length > 100) {
          setIsNationalityOverLimit(true);
        } else {
          setIsNationalityOverLimit(false);
        }
      }
      if (data[EComposer.ethnicity]) {
        if (data[EComposer.ethnicity].length > 100) {
          setIsEthnicityOverLimit(true);
        } else {
          setIsEthnicityOverLimit(false);
        }
      }
      if (data[EComposer.gender]) {
        if (data[EComposer.gender].length > 100) {
          setIsGenderOverLimit(true);
        } else {
          setIsGenderOverLimit(false);
        }
      }
      if (data[EComposer.pronouns]) {
        if (data[EComposer.pronouns].length > 100) {
          setIsPronounsOverLimit(true);
        } else {
          setIsPronounsOverLimit(false);
        }
      }
      if (data[EComposer.excerpt]) {
        if (data[EComposer.excerpt].length > 1000) {
          setIsExcerptOverLimit(true);
        } else {
          setIsExcerptOverLimit(false);
        }
      }
      if (data[EComposer.urlSpotify]) {
        if (data[EComposer.urlSpotify].length > 250) {
          setIsURLSpotifyOverLimit(true);
        } else {
          setIsURLSpotifyOverLimit(false);
        }
      }
      if (data[EComposer.urlAppleMusic]) {
        if (data[EComposer.urlAppleMusic].length > 250) {
          setIsURLAppleMusicOverLimit(true);
        } else {
          setIsURLAppleMusicOverLimit(false);
        }
      }
      if (data[EComposer.urlWebsite]) {
        if (data[EComposer.urlWebsite].length > 250) {
          setIsURLWebsiteOverLimit(true);
        } else {
          setIsURLWebsiteOverLimit(false);
        }
      }
      if (data[EComposer.urlSocialInstagram]) {
        if (data[EComposer.urlSocialInstagram].length > 250) {
          setIsURLSocialInstagramOverLimit(true);
        } else {
          setIsURLSocialInstagramOverLimit(false);
        }
      }
      if (data[EComposer.urlSocialFacebook]) {
        if (data[EComposer.urlSocialFacebook].length > 250) {
          setIsURLSocialFacebookOverLimit(true);
        } else {
          setIsURLSocialFacebookOverLimit(false);
        }
      }
      if (data[EComposer.urlSocialX]) {
        if (data[EComposer.urlSocialX].length > 250) {
          setIsURLSocialXOverLimit(true);
        } else {
          setIsURLSocialXOverLimit(false);
        }
      }
      if (data[EComposer.urlSocialLinkedIn]) {
        if (data[EComposer.urlSocialLinkedIn].length > 250) {
          setIsURLSocialLinkedInOverLimit(true);
        } else {
          setIsURLSocialLinkedInOverLimit(false);
        }
      }
      if (data[EComposer.urlSocialYouTube]) {
        if (data[EComposer.urlSocialYouTube].length > 250) {
          setIsURLSocialYouTubeOverLimit(true);
        } else {
          setIsURLSocialYouTubeOverLimit(false);
        }
      }

      setFirstControlValue((prevState) => ({
        ...prevState,
        [EComposer.name]: data[EComposer.name],
        [EComposer.birth_year]: data[EComposer.birth_year],
        [EComposer.death_year]: data[EComposer.death_year],
        [EComposer.nationality]: data[EComposer.nationality],
        [EComposer.ethnicity]: data[EComposer.ethnicity],
        [EComposer.gender]: data[EComposer.gender],
        [EComposer.pronouns]: data[EComposer.pronouns],
        [EComposer.excerpt]: data[EComposer.excerpt],
        [EComposer.urlSpotify]: data[EComposer.urlSpotify],
        [EComposer.urlAppleMusic]: data[EComposer.urlAppleMusic],
        [EComposer.urlWebsite]: data[EComposer.urlWebsite],
        [EComposer.urlSocialInstagram]: data[EComposer.urlSocialInstagram],
        [EComposer.urlSocialFacebook]: data[EComposer.urlSocialFacebook],
        [EComposer.urlSocialX]: data[EComposer.urlSocialX],
        [EComposer.urlSocialLinkedIn]: data[EComposer.urlSocialLinkedIn],
        [EComposer.urlSocialYouTube]: data[EComposer.urlSocialYouTube],
      }));
    });

    return () => subscription.unsubscribe();
  }, [watch, setFirstControlValue, collections, setValue]);

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in publisherRules) {
      if (!publisherRules[key].rule(form[key]))
        newErrors.push({ name: key, message: publisherRules[key].message });
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

  const clearAddComposerForm = () => {
    setIsName(false);
    setNameText("");
    setValue(EComposer.name, "");
    setValue(EComposer.birth_year, "");
    setValue(EComposer.death_year, "");
    setValue(EComposer.nationality, "");
    setValue(EComposer.ethnicity, "");
    setValue(EComposer.gender, "");
    setValue(EComposer.pronouns, "");
    setValue(EComposer.excerpt, "");
    setValue(EComposer.urlSpotify, "");
    setValue(EComposer.urlAppleMusic, "");
    setValue(EComposer.urlWebsite, "");
    setValue(EComposer.urlSocialInstagram, "");
    setValue(EComposer.urlSocialFacebook, "");
    setValue(EComposer.urlSocialX, "");
    setValue(EComposer.urlSocialLinkedIn, "");
    setValue(EComposer.urlSocialYouTube, "");
    setFile(undefined);
    (document.getElementById("composerImage") as HTMLInputElement).value = "";
    setCollections(null);
    setCollectionsOptions(null);
    getCollections();
    localStorage.removeItem("addComposerForm");
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
            nameText
              ? "Add Composer Disclaimer - " + nameText
              : firstControlValue[EComposer.name]
                ? "Add Composer Disclaimer - " +
                  firstControlValue[EComposer.name]
                : "Add Composer Disclaimer - No Name Yet"
          }
          url={`${EUrlsPages.ADD_COMPOSER}`}
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
              <Label
                htmlFor={EComposer.name}
                label="Name"
                labelRequired={<span className="text-pmdRed"> *</span>}
              />
            }
            name={EComposer.name}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Name"
            className="!px-5 pt-[17px] pb-4"
            error={!isName || isNameOverLimit}
          />
          {isNameOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Name is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-6 grow">
          <div className="grow">
            <Field
              labelEl={
                <Label
                  htmlFor={EComposer.birth_year}
                  label="Birth Year (YYYY)"
                />
              }
              name={EComposer.birth_year}
              component={InputNumber}
              control={control}
              formState={formState}
              min={500}
              max={2039}
              placeholder="Birth Year (YYYY)"
              className="!px-5 pt-[17px] pb-4"
            />
          </div>
          <div className="grow">
            <Field
              labelEl={
                <Label
                  htmlFor={EComposer.death_year}
                  label="Death Year (YYYY)"
                />
              }
              name={EComposer.death_year}
              component={InputNumber}
              control={control}
              formState={formState}
              min={500}
              max={2039}
              placeholder="Death Year (YYYY)"
              className="!px-5 pt-[17px] pb-4"
            />
          </div>
        </div>
        <div className="grow">
          <Field
            labelEl={
              <Label htmlFor={EComposer.nationality} label="Nationality" />
            }
            name={EComposer.nationality}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Nationality"
            className="!px-5 pt-[17px] pb-4"
            error={isNationalityOverLimit}
          />
          {isNationalityOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Nationality is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={<Label htmlFor={EComposer.ethnicity} label="Ethnicity" />}
            name={EComposer.ethnicity}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Ethnicity"
            className="!px-5 pt-[17px] pb-4"
            error={isEthnicityOverLimit}
          />
          {isEthnicityOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Ethnicity is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={<Label htmlFor={EComposer.gender} label="Gender" />}
            name={EComposer.gender}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Gender"
            className="!px-5 pt-[17px] pb-4"
            error={isGenderOverLimit}
          />
          {isGenderOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Gender is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={<Label htmlFor={EComposer.pronouns} label="Pronouns" />}
            name={EComposer.pronouns}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="Pronouns"
            className="!px-5 pt-[17px] pb-4"
            error={isPronounsOverLimit}
          />
          {isPronounsOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Pronouns is too long (Max 100 characters)
            </p>
          )}
        </div>
        <div className="grow">
          <Field
            labelEl={<Label htmlFor={EComposer.excerpt} label="Bio" />}
            name={EComposer.excerpt}
            component={TextArea}
            rows={7}
            control={control}
            formState={formState}
            placeholder="Bio (max 1000 characters)"
            className="!px-5 pt-[17px] pb-4"
            error={isExcerptOverLimit}
          />
          {isExcerptOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Description is too long (Max 1000 characters)
            </p>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="grow">
          <Field
            labelEl={
              <Label htmlFor={EComposer.urlSpotify} label="Spotify Link" />
            }
            name={EComposer.urlSpotify}
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
                htmlFor={EComposer.urlAppleMusic}
                label="Apple Music Link"
              />
            }
            name={EComposer.urlAppleMusic}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://music.apple.com/__/artist/__/__"
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
              <Label htmlFor={EComposer.urlWebsite} label="Custom Link" />
            }
            name={EComposer.urlWebsite}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://example.com/composer"
            className="!px-5 pt-[17px] pb-4"
            error={isURLWebsiteOverLimit}
          />
          {isURLWebsiteOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              Custom Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-6 grow">
          <div className="grow">
            <Field
              labelEl={
                <Label
                  htmlFor={EComposer.urlSocialInstagram}
                  label="Instagram Link"
                />
              }
              name={EComposer.urlSocialInstagram}
              component={InputText}
              control={control}
              formState={formState}
              placeholder="https://instagram.com/__"
              className="!px-5 pt-[17px] pb-4"
              error={isURLSocialInstagramOverLimit}
            />
            {isURLSocialInstagramOverLimit && (
              <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
                Instagram Link is too long (Max 250 characters)
              </p>
            )}
          </div>
          <div className="grow">
            <Field
              labelEl={
                <Label
                  htmlFor={EComposer.urlSocialFacebook}
                  label="Facebook Link"
                />
              }
              name={EComposer.urlSocialFacebook}
              component={InputText}
              control={control}
              formState={formState}
              placeholder="https://facebook.com/__"
              className="!px-5 pt-[17px] pb-4"
              error={isURLSocialFacebookOverLimit}
            />
            {isURLSocialFacebookOverLimit && (
              <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
                Facebook Link is too long (Max 250 characters)
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 grow">
          <div className="grow">
            <Field
              labelEl={
                <Label htmlFor={EComposer.urlSocialX} label="X/Twitter Link" />
              }
              name={EComposer.urlSocialX}
              component={InputText}
              control={control}
              formState={formState}
              placeholder="https://x.com/__"
              className="!px-5 pt-[17px] pb-4"
              error={isURLSocialXOverLimit}
            />
            {isURLSocialXOverLimit && (
              <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
                X/Twitter Link is too long (Max 250 characters)
              </p>
            )}
          </div>
          <div className="grow">
            <Field
              labelEl={
                <Label
                  htmlFor={EComposer.urlSocialLinkedIn}
                  label="LinkedIn Link"
                />
              }
              name={EComposer.urlSocialLinkedIn}
              component={InputText}
              control={control}
              formState={formState}
              placeholder="https://linkedin.com/in/__"
              className="!px-5 pt-[17px] pb-4"
              error={isURLSocialLinkedInOverLimit}
            />
            {isURLSocialLinkedInOverLimit && (
              <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
                LinkedIn Link is too long (Max 250 characters)
              </p>
            )}
          </div>
        </div>
        <div className="grow">
          <Field
            labelEl={
              <Label
                htmlFor={EComposer.urlSocialYouTube}
                label="YouTube Channel Link"
              />
            }
            name={EComposer.urlSocialYouTube}
            component={InputText}
            control={control}
            formState={formState}
            placeholder="https://youtube.com/user/__ or https://youtube.com/@__"
            className="!px-5 pt-[17px] pb-4"
            error={isURLSocialYouTubeOverLimit}
          />
          {isURLSocialYouTubeOverLimit && (
            <p className="mt-1.5 font-bold text-pmdRed text-xl italic">
              YouTube Channel Link is too long (Max 250 characters)
            </p>
          )}
        </div>
        <Divider className="mt-0 mb-0" />
        <div id="InputImage" className="flex flex-col grow">
          <Label
            htmlFor="composerImage"
            label="Portrait Image"
            desc="JPG/PNG, Max File Size 2MB, Max Height 600px, Max Width 600px"
          />
          <p className="mb-2 text-red-300 text-xs">
            Please crop the image to under 600x600px BEFORE uploading. <br />
            Cropping upon upload is coming soon.
          </p>
          <div className="flex flex-row justify-center items-center w-full text-left">
            <input
              type="file"
              id="composerImage"
              name="composerImage"
              accept="image/png, image/jpeg"
              autoComplete="off"
              className="!flex !justify-center !items-center hover:bg-pmdGrayBright px-5 py-5 border border-pmdGray rounded-lg focus-visible:outline-0 w-full !text-pmdGray hover:text-pmdGrayDark placeholder:text-pmdGray text-sm !text-left tracking-thigh cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 2097152) {
                  if (file.type === "image/jpeg" || file.type === "image/png") {
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
                              message: "Image is too large (Max 600x600px)",
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
                      message: "Image file size is too large (Max 2MB)",
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
        <Divider className="mt-0 mb-0" />
        <div className="flex flex-wrap gap-6 grow">
          {isLoadingCollections ? (
            <p>
              Loading {collectionsOptionsLength && collectionsOptionsLength}{" "}
              Collections...
            </p>
          ) : (
            <>
              <div className="grow">
                <Field
                  labelEl={
                    <Label
                      htmlFor={EComposer.collections}
                      label="Collection(s)"
                    />
                  }
                  name={EComposer.collections}
                  component={MultipleAutocomplete}
                  control={control}
                  formState={formState}
                  placeholder="Collection(s)"
                  className="!px-5 pt-[17px] pb-4"
                  suggestions={collectionsOptions}
                  setValues={handleCollections}
                  values={collections}
                  onFilter={setCollectionsOptions}
                />
                <Link href={`/${EUrlsPages.ADD_COLLECTION}`}>
                  <a
                    title="Add New Collection"
                    className="flex gap-2 mt-4 text-sm cursor-pointer"
                  >
                    <ImageNext src={IconPlus} height={16} width={16} />
                    <em>Add New Collection</em>
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      {userName && (
        <>
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <p>This composer is being added by:</p>
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
                  New composers are not publicly visible until reviewed by
                  staff!
                </em>
              </p>
              <p>
                You can view the status of your added composers in{" "}
                <Link href={`/${EUrlsPages.COMPOSERS_ADDED}`}>
                  <a className="text-pmdGray" title="Composers Added">
                    Composers Added
                  </a>
                </Link>
              </p>
            </div>
            <p className="mt-3 mb-8 text-pmdGray text-sm">
              <em>
                By adding a composer to Piano Music Database, you agree to the{" "}
                <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}>
                  <a className="text-pmdGray" title="Terms and Conditions">
                    terms and conditions
                  </a>
                </Link>
                .
              </em>
            </p>
            {firstControlValue[EComposer.name] || isName ? (
              !(
                isNameOverLimit ||
                isNationalityOverLimit ||
                isExcerptOverLimit ||
                isURLSpotifyOverLimit ||
                isURLAppleMusicOverLimit ||
                isURLWebsiteOverLimit ||
                isURLSocialInstagramOverLimit ||
                isURLSocialFacebookOverLimit ||
                isURLSocialXOverLimit ||
                isURLSocialLinkedInOverLimit ||
                isURLSocialYouTubeOverLimit
              ) ? (
                <div className="flex flex-col gap-4 w-full">
                  <button
                    type="button"
                    title="Submit New Composer"
                    className="mx-auto mb-6 cursor-pointer button"
                    onClick={handleSubmit(handleAddComposer)}
                  >
                    <div className="flex flex-row gap-x-3">
                      <ImageNext src={IconPlusWhite} height={16} width={16} />
                      Add New Composer
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
                      aria-controls="modalResetAddComposerForm"
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
                    Add New Composer
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
                      aria-controls="modalResetAddComposerForm"
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
            ) : !isNameOverLimit ? (
              <div className="flex flex-col gap-4 w-full">
                <a
                  title="Your new composer needs a Name!"
                  className="flex flex-row gap-x-3 !bg-pmdGray mx-auto mb-2 !text-pmdGrayLight cursor-default button"
                  href="#top"
                >
                  <ImageNext src={IconPlusGrayBright} height={16} width={16} />
                  Add New Composer
                </a>
                <p className="flex flex-col justify-center gap-2 bg-orange-500 px-3 py-10 rounded-lg w-full text-white text-lg text-center">
                  <span>
                    <em>
                      You are missing a <strong>Name</strong>!
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
                    aria-controls="modalResetAddComposerForm"
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
                  Add New Composer
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
                    aria-controls="modalResetAddComposerForm"
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
      <ModalResetAddComposerForm
        handleClear={() => {
          handleIsOpenClearModal();
          clearAddComposerForm();
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
        description="Your portrait image is uploading. This may take a few moments..."
        isOpen={isOpenModalImageUploading}
        onClose={handleIsOpenModalImageUploading}
      />
    </>
  );
};

export default AddComposer;
