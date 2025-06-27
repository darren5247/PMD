import type { NextPage } from "next";
import Page from "@src/components/Page";

const ServerErrorPage: NextPage = () => {
  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url="500"
      title="Error 500: Internal Server Error - Piano Music Database"
      description="A server-side error occurred. The server encountered an internal error or misconfiguration and was unable to complete your request. Start a NEW search at PianoMusicDatabase.com/search."
      image=""
    >
      <>
        <h1>Error 500: Internal Server Error</h1>
        <h2 className="mt-10">
          <em>A server-side error occurred.</em>
        </h2>
        <p className="mt-2">
          The server encountered an internal error or misconfiguration and was
          unable to complete your request.
        </p>
      </>
    </Page>
  );
};

export default ServerErrorPage;
