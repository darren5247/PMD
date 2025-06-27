import { FC, useEffect, useContext, useState } from "react";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import Form from "@src/components/Form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Field from "@src/components/Field";
import InputText from "@src/components/InputText";
import TextArea from "@src/components/TextArea";
import Label from "@src/components/Label";
import Divider from "@src/components/Divider";
import Modal from "@src/components/Modal";
import Chip from "@src/components/Chip";
import Link from "next/link";
import ImageNext from "@src/components/ImageNext";
import { IconFeedback, IconPencil } from "@src/common/assets/icons";

import { EFeedback, EUrlsPages } from "@src/constants";

import {
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
} from "@src/types";

interface IEditDisclaimerForm {
  [EFeedback.feedbackText]: string;
  [EFeedback.feedbackEmail]: string;
}

type TEditDisclaimerForm = IEditDisclaimerForm | FieldValues;

interface IModalEditDisclaimerProps {
  type: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const ModalEditDisclaimer: FC<IModalEditDisclaimerProps> = ({
  type,
  url,
  isOpen,
  onClose,
}): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const { control, handleSubmit, formState, setValue, watch } =
    useForm<TEditDisclaimerForm>();
  const [userName, setUserName] = useState<string | null>(null);
  const typeDisplay = type || "No Type";

  useEffect(() => {
    const addFeedbackData = JSON.parse(
      localStorage.getItem("addFeedbackForm") || "{}",
    );
    if (addFeedbackData) {
      setValue(EFeedback.feedbackText, addFeedbackData.feedbackText);
      setValue(EFeedback.feedbackEmail, addFeedbackData.feedbackEmail);
    } else {
      setValue(EFeedback.feedbackType, typeDisplay);
    }

    console.log("URL:", url);

    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      if (accountData.name) {
        setUserName(accountData.name);
      }
    }
  }, [setValue, typeDisplay]);

  useEffect(() => {
    const subscription = watch((data: any) => {
      handleSetLocalValue(data);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAddFeedback: SubmitHandler<TEditDisclaimerForm> = ({
    feedbackText,
    feedbackEmail,
  }) => {
    if (
      !handleError({
        feedbackText,
        feedbackEmail,
      })
    ) {
      handleData({
        feedbackText,
        feedbackEmail,
      });
    }
  };

  const handleData = async (form: any) => {
    try {
      form.publishedAt = null;
      form.feedbackType = typeDisplay;
      if (state.user) {
        form.users = state.user;
      }
      await api.post(`feedbacks`, { data: form });
      clearAddFeedbackForm();
      {
        onClose;
      }
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "Feedback Submitted Successfully",
          type: ENotificationTypes.SUCCESS,
        },
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
    }
  };

  const handleSetLocalValue = (data: any) => {
    const localData = localStorage.getItem("addFeedbackForm");

    if (localData) {
      const parseLocalData = JSON.parse(localData);
      localStorage.setItem(
        "addFeedbackForm",
        JSON.stringify({
          ...parseLocalData,
          [EFeedback.feedbackText]: data[EFeedback.feedbackText],
          [EFeedback.feedbackEmail]: data[EFeedback.feedbackEmail],
        }),
      );
    } else {
      localStorage.setItem(
        "addFeedbackForm",
        JSON.stringify({
          [EFeedback.feedbackText]: data[EFeedback.feedbackText],
          [EFeedback.feedbackEmail]: data[EFeedback.feedbackEmail],
        }),
      );
    }
  };

  const handleError = (form: any) => {
    const newErrors = [];
    if (!form[EFeedback.feedbackText]) {
      newErrors.push({ name: "feedbackText", message: "Enter some feedback" });
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

  const clearAddFeedbackForm = () => {
    setValue(EFeedback.feedbackText, "");
    setValue(EFeedback.feedbackEmail, "");
    localStorage.removeItem("addFeedbackForm");
    onClose();
  };

  return (
    <Modal
      id="modalEditDisclaimer"
      onClose={onClose}
      isOpen={isOpen}
      clickOutsideEnabled={true}
      layoutClassName="w-full max-h-full mx-[20px] max-w-[350px]"
      crossClassName="w-10 h-10 top-2 right-2"
    >
      <div className="flex gap-2 py-4 pr-12 pl-5">
        <ImageNext
          src={IconFeedback}
          height={22}
          width={22}
          className="min-w-[22px] min-h-[22px]"
        />
        <p className="pt-1 text-pmdGrayDark">
          <strong>Send Edits</strong>
        </p>
      </div>
      <div className="px-4 pt-4 pb-6 border-pmdGrayLight border-t max-h-screen overflow-auto text-black scrollbar">
        <div className="flex flex-col gap-3 mt-3 mb-6 text-pmdGrayDark">
          <p>
            Use this form to tell us about edits you would like to make to
            anything previously submitted.
          </p>
          <p>
            Be sure to include any relevant information that will help us
            identify where your edits belong.
          </p>
          <p>We will follow up with you when we have applied your edits.</p>
          <p className="text-sm">
            <span className="font-bold text-pmdRed text-base">*</span> indicates
            a required field
          </p>
        </div>
        <Divider className="mt-0 mb-0" />
        <Form className="flex flex-col">
          <div className="flex flex-col gap-6 pt-2 pb-8">
            <div className="grow">
              <Field
                labelEl={
                  <Label
                    htmlFor={EFeedback.feedbackText}
                    label="Your Edits"
                    labelRequired={<span className="text-pmdRed"> *</span>}
                  />
                }
                name={EFeedback.feedbackText}
                component={TextArea}
                rows={7}
                control={control}
                formState={formState}
                placeholder="Edited details, corrections, etc..."
                className="!px-5 pt-[17px] pb-4"
              />
            </div>
            {!userName ? (
              <div className="grow">
                <Field
                  labelEl={
                    <Label htmlFor={EFeedback.feedbackEmail} label="Email" />
                  }
                  name={EFeedback.feedbackEmail}
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder="Email"
                  className="!px-5 pt-[17px] pb-4"
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {userName ? (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <p>This form will be sent by:</p>
              <div className="flex flex-wrap items-center gap-2">
                <Chip title={userName} />
                <Link href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}>
                  <a title="Edit Account Name">
                    <ImageNext
                      src={IconPencil}
                      alt=""
                      height={16}
                      width={16}
                      className="z-0"
                    />
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            ""
          )}
          <p className="mt-3 mb-8 text-pmdGray text-sm">
            <em>
              By sending this form to Piano Music Database, you agree to the{" "}
              <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}>
                <a className="text-pmdGray" title="Terms and Conditions">
                  terms and conditions
                </a>
              </Link>
              .
            </em>
          </p>
          <div className="mt-1 mb-3">
            <a
              title="Send Edits"
              className="mx-auto !px-4 cursor-pointer button"
              onClick={handleSubmit(handleAddFeedback)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSubmit(handleAddFeedback);
                }
              }}
              tabIndex={0}
            >
              Send Edits
            </a>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalEditDisclaimer;
