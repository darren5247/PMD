import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Page from "@src/components/Page";
import Label from "@src/components/Label";
import Field from "@src/components/Field";
import Form from "@src/components/Form";
import InputText from "@src/components/InputText";
import ModalCheckYourEmail from "@src/components/Modals/ModalCheckYourEmail";
import { EAccountLogin, EUrlsPages, resetPasswordRules } from "@src/constants";
import { IError } from "@src/types";

interface IRequestPasswordForm {
  email: string;
}

type TRequestPasswordForm = IRequestPasswordForm | FieldValues;

interface IRequestPasswordPageProps {
  prevUrl: string | undefined;
}

const RequestPasswordPage: NextPage<IRequestPasswordPageProps> = ({
  prevUrl,
}) => {
  const { control, handleSubmit, formState } = useForm<TRequestPasswordForm>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<IError[]>([]);

  const handleReset: SubmitHandler<TRequestPasswordForm> = ({
    email: formEmail,
  }) => {
    if (!handleError({ email: formEmail })) {
      setEmail(formEmail);
      setIsOpenModal(true);
    }
  };

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in resetPasswordRules) {
      if (!resetPasswordRules[key].rule(form[key]))
        newErrors.push({ name: key, message: resetPasswordRules[key].message });
    }
    setErrors(newErrors);
    if (newErrors.length > 0) return true;
  };

  const findErrors = (string: string) =>
    errors.find((el) => el?.name === string);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.REQUEST_PASSWORD}
      prevUrl={prevUrl}
      title="Request New Password - Piano Music Database"
      description="Did you forget or otherwise need to reset your Piano Music Database account password? Provide your email and follow the instructions sent to your email."
      image=""
    >
      <div className="max-w-[320px]">
        <h1 className="mx-auto">Request Password Reset</h1>
        <p className="mx-auto mt-4 text-pmdGrayDark text-sm">
          Enter the email used for your account.
          <br />
          You will receive an email with
          <br />
          further instructions.
        </p>
        <Form onSubmit={handleSubmit(handleReset)}>
          <div className="mx-auto pt-5 pb-2.5">
            <Field
              labelEl={
                <Label
                  htmlFor={EAccountLogin.EMAIL}
                  label="Email"
                  labelRequired={<span className="text-pmdRed"> *</span>}
                />
              }
              name={EAccountLogin.EMAIL}
              component={InputText}
              control={control}
              formState={formState}
              placeholder={"Email"}
              className="pt-[17px] pr-[19px] pb-[16px] !pl-5"
              error={formState.errors.email || findErrors(EAccountLogin.EMAIL)}
            />
            <p className="pt-[4px] text-pmdRed text-sm leading-[14px]">
              {findErrors(EAccountLogin.EMAIL)?.message}
            </p>
          </div>
          <p className="mb-8 pr-3 text-pmdGrayDark text-sm text-end">
            <Link href={`/${EUrlsPages.FORGOT_EMAIL}`}>
              <a title="Forgot Email?">Forgot Email?</a>
            </Link>
          </p>
          <div className="flex items-center mb-12 text-center">
            <button
              title="Request Password Reset"
              className="mx-auto !px-[54px] button"
              type="submit"
            >
              Request Password Reset
            </button>
          </div>
          <p className="text-pmdGrayDark text-sm text-center">
            <Link href={`/${EUrlsPages.LOG_IN}`}>
              <a title="Log In">Log In</a>
            </Link>
            {/*  or <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
              <a title='Create Account'>
                Create Account
              </a>
            </Link> */}
          </p>
        </Form>
      </div>
      <ModalCheckYourEmail
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        email={email}
      />
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

export default RequestPasswordPage;
