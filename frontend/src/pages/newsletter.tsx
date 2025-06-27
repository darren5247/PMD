import { GetServerSideProps, NextPage } from "next";
import { useContext, useState } from "react";
import { AppContext } from "@src/state";
import Page from "@src/components/Page";
import Form from "@src/components/Form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Label from "@src/components/Label";
import Field from "@src/components/Field";
import InputText from "@src/components/InputText";
import Divider from "@src/components/Divider";
import axios from "axios";

const apiBrevo = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BREVO_API_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY || "",
  },
});

import { EAccountData, EUrlsPages, newsletterRules } from "@src/constants";

import {
  ENotificationActionTypes,
  ENotificationTypes,
  IError,
} from "@src/types";

interface INewsletterAddForm {
  [EAccountData.name]: string;
  [EAccountData.nameLast]: string;
  [EAccountData.email]: string;
}

interface INewsletterRemovalForm {
  [EAccountData.email]: string;
}

type TNewsletterRemovalForm = INewsletterRemovalForm | FieldValues;

type TNewsletterAddForm = INewsletterAddForm | FieldValues;

interface INewsletterPageProps {
  prevUrl: string | undefined;
}

const NewsletterPage: NextPage<INewsletterPageProps> = ({ prevUrl }) => {
  const { dispatch } = useContext(AppContext);
  const [errors, setErrors] = useState<IError[]>([]);
  const { control, handleSubmit, formState, reset } =
    useForm<TNewsletterAddForm>();

  const handleCheckNewsletterRemoval: SubmitHandler<TNewsletterRemovalForm> = ({
    email,
  }) => {
    if (!handleError({ email })) {
      handleNewsletterRemoval(email);
    }
  };

  const handleNewsletterSubscribe: SubmitHandler<TNewsletterAddForm> = ({
    name,
    nameLast,
    email,
  }) => {
    if (!handleError({ name, email })) {
      handleSubscribe(name, nameLast, email);
    }
  };

  const handleSubscribe = async (
    name: string,
    nameLast: string,
    email: string,
  ) => {
    try {
      const brevoRequest = {
        attributes: {
          FIRSTNAME: name,
          LASTNAME: nameLast,
          NEWSLETTER_SOURCE: "newsletter (page)",
          OPT_IN: true,
        },
        email: email,
        listIds: [
          34, // Newsletter
        ],
        updateEnabled: true,
        emailBlacklisted: false,
      };
      await apiBrevo.post("/contacts", brevoRequest);
      reset();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "You have signed up for our newsletter! Check your email.",
          type: ENotificationTypes.SUCCESS,
        },
      });
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
    }
  };

  const handleNewsletterRemoval = async (email: string) => {
    try {
      const brevoRequest = {
        attributes: {
          OPT_IN: false,
        },
        email: email,
        unlinkListIds: [
          34, // Newsletter
        ],
        emailBlacklisted: true,
      };
      await apiBrevo.put(
        "/contacts/" + email + "?identifierType=email_id",
        brevoRequest,
      );
      reset();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message:
            "You have successfully removed yourself from our email newsletter",
          type: ENotificationTypes.SUCCESS,
        },
      });
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
    }
  };

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in newsletterRules) {
      if (!newsletterRules[key].rule(form[key]))
        newErrors.push({ name: key, message: newsletterRules[key].message });
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
    setErrors(newErrors);
    if (newErrors.length > 0) return true;
  };

  const findErrors = (string: string) =>
    errors.find((el) => el?.name === string);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.NEWSLETTER}
      title="Newsletter - Piano Music Database"
      description="Sign up for our free email newsletter to receive updates from us about upcoming features, new music, deep dives into piano teaching, and more."
      image=""
    >
      <div className="flex flex-col justify-center items-center w-full text-center">
        <h1>Newsletter</h1>
        <p className="mt-3 max-w-[716px] text-justify">
          Sign up for our free email newsletter to receive updates from us about
          upcoming features, new music, deep dives into piano teaching, and
          more.
        </p>

        <h2 id="sign-up" className="mt-14">
          Sign Up
        </h2>
        <Form>
          <div className="flex flex-col gap-y-6 pt-5 pb-16">
            <div>
              <Field
                labelEl={
                  <Label
                    htmlFor={EAccountData.name}
                    label="First Name"
                    labelRequired={<span className="text-pmdRed"> *</span>}
                  />
                }
                labelClassName="font-bold mb-1"
                name={EAccountData.name}
                component={InputText}
                control={control}
                formState={formState}
                placeholder="First Name"
                className="!px-5 pt-[17px] pb-4"
                error={
                  formState.errors[EAccountData.name] ||
                  findErrors(EAccountData.name)
                }
              />
              <p className="pt-1 text-pmdRed text-sm text-left">
                {findErrors(EAccountData.name)?.message}
              </p>
            </div>
            <div>
              <Field
                labelEl={
                  <Label htmlFor={EAccountData.nameLast} label="Last Name" />
                }
                labelClassName="font-bold mb-1"
                name={EAccountData.nameLast}
                component={InputText}
                control={control}
                formState={formState}
                placeholder="Last Name"
                className="!px-5 pt-[17px] pb-4"
              />
            </div>
            <div>
              <Field
                labelEl={
                  <Label
                    htmlFor={EAccountData.email}
                    label="Email"
                    labelRequired={<span className="text-pmdRed"> *</span>}
                  />
                }
                labelClassName="font-bold mb-1"
                name={EAccountData.email}
                component={InputText}
                control={control}
                formState={formState}
                placeholder="Email"
                className="!px-5 pt-[17px] pb-4"
                error={
                  formState.errors[EAccountData.email] ||
                  findErrors(EAccountData.email)
                }
              />
              <p className="py-1 text-pmdRed text-sm text-left">
                {findErrors(EAccountData.email)?.message}
              </p>
            </div>
            <p className="my-1 max-w-[348px] text-pmdGray text-xs text-justify">
              By signing up to our email newsletter, you agree to the{" "}
              <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}>
                <a className="text-pmdGray" title="Terms & Conditions">
                  Terms & Conditions
                </a>
              </Link>{" "}
              and{" "}
              <Link href={`/${EUrlsPages.PRIVACY_POLICY}`}>
                <a className="text-pmdGray" title="Privacy Policy">
                  Privacy Policy
                </a>
              </Link>
              .
            </p>
            <a
              title="Sign Up for Our Email Newsletter"
              className="mx-auto !py-2 w-full cursor-pointer button"
              onClick={handleSubmit(handleNewsletterSubscribe)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSubmit(handleNewsletterSubscribe);
                }
              }}
              tabIndex={0}
            >
              Sign Up for Our Email Newsletter
            </a>
          </div>
        </Form>

        <Divider />

        <div
          id="manage"
          className="flex flex-col justify-center items-center mt-16 w-full text-center"
        >
          <h4 id="manage-communications">Manage Communications</h4>
          <p className="mt-3 max-w-[716px] text-justify">
            Manage your email subscription with Piano Music Database. Make the
            choice whether or not to receive our official email newsletter with
            updates and news.
          </p>
          <Form>
            <div className="flex flex-col gap-y-2 p-8">
              <div className="mt-4">
                <Field
                  labelEl={
                    <Label
                      htmlFor={EAccountData.email}
                      label="Email"
                      labelRequired={<span className="text-pmdRed"> *</span>}
                    />
                  }
                  labelClassName="font-bold mb-1"
                  name={EAccountData.email}
                  component={InputText}
                  control={control}
                  formState={formState}
                  placeholder="Email"
                  className="!px-5 pt-[17px] pb-4"
                  error={
                    formState.errors[EAccountData.email] ||
                    findErrors(EAccountData.email)
                  }
                />
                <p className="py-1 text-pmdRed text-sm text-left">
                  {findErrors(EAccountData.email)?.message}
                </p>
              </div>
              <a
                title="Stop Receiving Our Email Newsletter"
                className="mx-auto !py-2 w-full cursor-pointer button"
                onClick={handleSubmit(handleCheckNewsletterRemoval)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSubmit(handleCheckNewsletterRemoval);
                  }
                }}
                tabIndex={0}
              >
                Stop Receiving Our Email Newsletter
              </a>
            </div>
          </Form>
        </div>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? "",
    },
  };
};

export default NewsletterPage;
