import { GetServerSideProps, NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Page from "@src/components/Page";
import CardLevelDesc from "@src/components/CardLevelDesc";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiLevel,
} from "@src/types";
import { EUrlsPages } from "@src/constants";

interface ILevelsPageProps {
  prevUrl: string | undefined;
}

const LevelsPage: NextPage<ILevelsPageProps> = ({ prevUrl }) => {
  const [levels, setLevels] = useState<IStrapiLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const getLevels = async () => {
      try {
        setIsLoading(true);
        const fetchedData = [];
        const { data } = await api.get(
          "levels?pagination[page]=1&pagination[pageSize]=7&sort[0]=id:asc&fields[0]=title&fields[1]=description&fields[2]=isSearchable",
        );
        fetchedData.push(...data?.data);
        if (
          data?.meta?.pagination &&
          fetchedData.length > 0 &&
          data?.meta?.pagination.page < data?.meta?.pagination.pageCount
        ) {
          const { page, pageCount } = data?.meta?.pagination;
          for (let i = page + 1; i <= pageCount; i++) {
            const response = await api.get(
              `levels?pagination[page]=${i}&pagination[pageSize]=7&sort[0]=id:asc&fields[0]=title&fields[1]=description&fields[2]=isSearchable`,
            );
            fetchedData.push(...response.data.data);
          }
        }
        setLevels(fetchedData);
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
        setIsLoading(false);
      }
    };

    getLevels();
  }, [dispatch]);

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      showLevelBar={true}
      prevUrl={prevUrl}
      url={EUrlsPages.LEVELS}
      title="Levels of Difficulty - Piano Music Database"
      description="Piano Music Database has 7 levels that increase in difficulty from absolute beginner to virtuosic repertoire. Level 1 - Primary, Level 2 - Early Elementary, Level 3 - Late Elementary, Level 4 - Early Intermediate, Level 5 - Late Intermediate, Level 6 - Advanced, Level 7 - Master"
      image=""
    >
      <div className="flex flex-col justify-center items-center mt-6 text-center">
        <h1>Levels of Difficulty</h1>
        <p className="mt-3 mb-3 max-w-[870px] text-justify">
          Piano Music Database uses <strong>7 levels</strong> that increase in
          difficulty starting with the simplest pre-reading piano music and
          ending with the most virtuosic repertoire for professionals. <br />
          PMD levels are broad compared to other leveling systems. <br />
          The goal with our leveling system is to organize a piece into a
          difficulty range and to use its{" "}
          <Link href={`/${EUrlsPages.ELEMENTS}`}>
            <a title="Learn more about our elements">elements</a>
          </Link>{" "}
          to give the full picture of its difficulty. This page goes over our
          leveling system and each level in the system in great detail. It
          explains how we determine the difference between the levels, the
          common{" "}
          <Link href={`/${EUrlsPages.ELEMENTS}`}>
            <a title="Learn more about our elements">elements</a>
          </Link>{" "}
          found in each level, and lists a few representative pieces for each
          level.
        </p>
        <p className="mt-6 mb-9 text-sm text-center italic">
          Use the level selector at the top of this page to jump to a specific
          level quickly and learn more about it.
        </p>
        {isLoading ? (
          <p>Loading levels...</p>
        ) : levels ? (
          <div className="flex flex-row flex-wrap justify-center items-top gap-3 max-w-[1200px] text-center align-middle">
            {levels.map((level) => (
              <CardLevelDesc
                key={`LevelItem-${level.id}`}
                title={level.attributes.title}
                description={level.attributes.description}
                id={level.id}
              />
            ))}
          </div>
        ) : (
          ""
        )}
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

export default LevelsPage;
