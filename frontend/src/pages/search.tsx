import { history } from "instantsearch.js/es/lib/routers/index.js";
import type { GetServerSideProps, NextPage } from "next";
import { renderToString } from "react-dom/server";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { getServerState } from "react-instantsearch-hooks-server";
import {
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web";
import { useMediaQuery } from "@src/common/hooks";
import Content from "@src/components/Content";
import PageHead from "@src/components/PageHead";
import Footer from "@src/components/Footer";
import Header from "@src/components/Header";
import Layout from "@src/components/Layout";
import { Configure } from "@src/components/Configure";
import SearchDesktop from "@src/components/SearchDesktop";
import SearchMobile from "@src/components/SearchMobile";
import {
  typesenseInstantsearchDesktopAdapter,
  typesenseInstantsearchMobileAdapter,
} from "@src/utils";
import { EUrlsPages } from "@src/constants";
import { handleDeEncodeQueries } from "@src/api/helpers";
import { TUserAttributes } from "@src/types";

interface ISearchPageProps {
  serverState?: InstantSearchServerState;
  url?: string;
  queries?: string;
}

const SearchPage: NextPage<ISearchPageProps> = ({
  serverState,
  url,
  queries,
}) => {
  let breakpointCalc: string;
  const accountData: TUserAttributes =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("accountData") || "{}")
      : {};
  if (accountData.id) {
    breakpointCalc = "(min-width: 1188px)";
  } else {
    breakpointCalc = "(min-width: 1060px)";
  }
  const isBreakpoint = useMediaQuery(breakpointCalc);
  function capitalizeFirstLetter(string: string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  }

  let queriesDeEncoded: string | undefined;
  if (queries) {
    queriesDeEncoded = handleDeEncodeQueries(queries);
  } else {
    queriesDeEncoded = "";
  }
  let pageTitle: string | undefined;
  let pageDesc: string | undefined;
  if (queriesDeEncoded) {
    pageTitle =
      "Search for " +
      capitalizeFirstLetter(queriesDeEncoded) +
      " on Piano Music Database";
    pageDesc =
      "Search for " +
      capitalizeFirstLetter(queriesDeEncoded) +
      " on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.";
  } else {
    pageTitle = "Search Piano Music Database - Find the Perfect Piece";
    pageDesc =
      "Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.";
  }

  return (
    <InstantSearchSSRProvider {...serverState}>
      <PageHead
        url={EUrlsPages.SEARCH}
        title={pageTitle}
        description={pageDesc}
        image=""
      />
      <Layout className="flex scrollbar">
        <InstantSearch
          searchClient={
            isBreakpoint
              ? typesenseInstantsearchDesktopAdapter.searchClient
              : typesenseInstantsearchMobileAdapter.searchClient
          }
          indexName="musicWorks"
          routing={{
            router: history({
              getLocation() {
                if (typeof window === "undefined") {
                  return new URL(url!) as unknown as Location;
                }

                return window.location;
              },
            }),
          }}
        >
          <Header
            showBackBar={true}
            showBackBarFeedback={true}
            classNameSearchForm="pt-2"
          />
          <Content>
            <div className="w-full">
              <section id="works" className="mx-auto">
                {isBreakpoint === null ? (
                  <div className="h-screen"></div>
                ) : isBreakpoint ? (
                  <div className="flex justify-center mx-auto mt-8">
                    <Configure hitsPerPage={35} />
                    <SearchDesktop />
                  </div>
                ) : (
                  <div className="flex mx-auto mt-10">
                    <Configure hitsPerPage={20} />
                    <SearchMobile />
                  </div>
                )}
              </section>
            </div>
          </Content>
          <Footer />
        </InstantSearch>
      </Layout>
    </InstantSearchSSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps<ISearchPageProps> = async ({
  req,
}) => {
  const protocol = req.headers.referer?.split("://")[0] ?? "https";
  const url = `${protocol}://${req.headers.host ? req.headers.host : ""}${req.url ? req.url : ""}`;
  const queries = `${req.url ? req.url : ""}`;

  const serverState = await getServerState(<SearchPage url={url} />, {
    renderToString,
  });

  return {
    props: {
      serverState,
      url,
      queries,
    },
  };
};

export default SearchPage;
