import type { NextPage } from "next";
import Page from "@src/components/Page";

const NotFoundPage: NextPage = () => {
  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url="404"
      title="Error 404: Not Found - Piano Music Database"
      description="The content was not able to be located. The page/content you are looking for has moved, is no longer available, has been archived, or was not valid. Start a new search at PianoMusicDatabase.com/search."
      image=""
    >
      <>
        <h1>Error 404: Not Found</h1>
        <h2 className="mt-10">
          <em>This content was not able to be located.</em>
        </h2>
        <p className="mt-2">
          The page/content you are looking for has moved, is no longer
          available, has been archived, or was not valid.
        </p>
        <p className="mt-2">Try searching to find what you are looking for.</p>
      </>
    </Page>
  );
};

export default NotFoundPage;
