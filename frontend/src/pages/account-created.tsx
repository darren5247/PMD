import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Page from "@src/components/Page";
import Chip from "@src/components/Chip";
import { EUrlsPages } from "@src/constants";

interface IAccountCreatedPageProps {
  prevUrl: string | undefined;
}

const AccountCreatedPage: NextPage<IAccountCreatedPageProps> = ({
  prevUrl,
}) => {
  const router = useRouter();
  const { query } = router;
  const [userEmail, setUserEmail] = useState<string>("your email");
  // const email: string = new URLSearchParams(window.location.search).get('email') || 'your email';

  useEffect(() => {
    if (query.email) {
      setUserEmail(query.email as string);
    }
  }, [query, router]);

  return (
    <>
      <Page
        showBackBar={true}
        showBackBarShare={false}
        showBackBarFeedback={true}
        url={EUrlsPages.ACCOUNT_CREATED}
        prevUrl={prevUrl}
        title="Account Created - Piano Music Database"
        description="Create a Piano Music Database account and access exclusive benefits such as adding piano music to the database."
        image=""
      >
        <div id="accountcreated" className="max-w-[500px]">
          <h1 className="mb-5 text-center">Account Created</h1>
          <p className="mb-4 px-3 text-pmdGrayDark text-sm text-center">
            <strong>You must confirm your email before continuing!</strong>
          </p>
          <p className="mb-8 px-3 text-pmdGrayDark text-sm text-center">
            Check your email - we sent you a link to click. After clicking that
            link, you will be able to log in and use your account.
          </p>
          {userEmail && (
            <div className="flex flex-wrap justify-center items-center gap-2 mx-auto mb-8 px-3 text-pmdGrayDark text-sm text-center">
              <p>Email sent to:</p>
              <div className="flex flex-wrap items-center gap-2">
                <Chip className="break-all sm:break-normal" title={userEmail} />
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center items-center gap-2 mx-auto mb-8 px-3 text-pmdGrayDark text-sm text-center">
            <p>Email sent from:</p>
            <div className="flex flex-wrap items-center gap-2">
              <Chip
                className="break-all sm:break-normal"
                title="no-reply@pianomusicdatabase.com"
              />
            </div>
          </div>
          <p className="mb-12 px-3 text-pmdGrayDark text-sm text-center">
            Didn’t get an email? Wait 15 minutes and check spam. If the email is
            not received after a while, try to{" "}
            <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
              <a title="Create Account">Create an Account</a>
            </Link>{" "}
            again.
          </p>
          <p className="text-pmdGrayDark text-sm text-center">
            <Link href={`/${EUrlsPages.LOG_IN}`}>
              <a title="Log In">Log In</a>
            </Link>{" "}
            or{" "}
            <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
              <a title="Create Account">Create Account</a>
            </Link>
          </p>
        </div>
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? "",
    },
  };
};

export default AccountCreatedPage;
