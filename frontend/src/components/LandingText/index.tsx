import type { GetServerSideProps } from "next";
import { FC } from "react";
import { handleDeEncodeLanding } from "@src/api/helpers";

interface ILandingTextProps {
  queries?: string;
}

const LandingText: FC<ILandingTextProps> = ({ queries }): JSX.Element => {
  let landingTextLine1: string | undefined;
  let landingTextLine2: string | undefined;
  if (queries) {
    const matchLanding: RegExpMatchArray | null =
      queries.match(/landing=(.*?)(?:&|$)/);
    if (matchLanding) {
      const landingTextUnencoded = matchLanding[1] as string;
      landingTextLine1 = handleDeEncodeLanding(landingTextUnencoded);
    } else {
      landingTextLine1 = "";
    }
    const matchLandingLine2: RegExpMatchArray | null = queries.match(
      /landing2=(.*?)(?:&|$)/,
    );
    if (matchLandingLine2) {
      const landingLine2TextUnencoded = matchLandingLine2[1] as string;
      landingTextLine2 = handleDeEncodeLanding(landingLine2TextUnencoded);
    } else {
      landingTextLine2 = "";
    }
  } else {
    landingTextLine1 = "";
    landingTextLine2 = "";
  }

  return (
    <>
      {landingTextLine1 && (
        <div className="bg-pmdGrayLight shadow-workNav px-4 py-8 w-full text-xl text-center">
          <p>
            <strong>{`${landingTextLine1}`}</strong>
          </p>
          {landingTextLine2 && (
            <p>
              <strong>{`${landingTextLine2}`}</strong>
            </p>
          )}
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ILandingTextProps
> = async ({ req }) => {
  const queries = `${req.url ? req.url : ""}`;

  return {
    props: {
      queries,
    },
  };
};

export default LandingText;
