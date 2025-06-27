import { GetServerSideProps, NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import { EUrlsPages } from "@src/constants";
import { apiList } from "@src/api/apis";
import api from "@src/api/config";
import Chip from "@src/components/Chip";
import { AppContext } from "@src/state";
import parse, { Element } from "html-react-parser";
import Page from "@src/components/Page";
import Link from "next/link";
import ImageNext from "@src/components/ImageNext";
import {
  IconSearchWhite,
  IconGlobeWhite,
  IconLockWhite,
  IconLinkWhite,
  IconLockRed,
  IconLinkRed,
  IconGlobeRed,
  IconPencilRed,
  IconDeleteWhite,
} from "@src/common/assets/icons";
import { handleTitleWithJustNumber } from "@src/api/helpers";
import Works from "@src/components/Works";
import GetPiece from "@src/components/GetPiece";
import GetPieceTable from "@src/components/GetPieceTable";
import GetComposer from "@src/components/GetComposer";
import GetCollection from "@src/components/GetCollection";
import GetPublisher from "@src/components/GetPublisher";
import GetElement from "@src/components/GetElement";
import { marked } from "marked";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
  IStrapiPieceTable,
  IStrapiList,
} from "@src/types";
import { ModalListDelete } from "@src/components/Modals";

interface IListDetailsPageProps {
  listData: IStrapiList[];
  prevUrl: string | undefined;
}

const ListDetailsPage: NextPage<IListDetailsPageProps> = ({
  listData,
  prevUrl,
}) => {
  const router = useRouter();
  const { query } = router;
  const [userId, setUserId] = useState<number | null>(null);
  const [visibilityRestriction, setVisibilityRestriction] = useState<
    boolean | null
  >(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [isUser, setIsUser] = useState<boolean | null>(null);
  const [contentClean, setContentClean] = useState<string>("");
  const [descValue, setDescValue] = useState<string | null>(null);
  const [descValueOld, setDescValueOld] = useState<string | null>(null);
  const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);
  const [detailsValue, setDetailsValue] = useState<string | null>(null);
  const [detailsValueOld, setDetailsValueOld] = useState<string | null>(null);
  const [isEditingDetails, setIsEditingDetails] = useState<boolean>(false);
  const [visibilityValue, setVisibilityValue] = useState<string | null>(null);
  const [works, setWorks] = useState<IStrapiPieceTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const [isOpenModalListDelete, setIsOpenModalListDelete] = useState(false);
  const handleIsOpenModalListDelete = () =>
    setIsOpenModalListDelete(!isOpenModalListDelete);

  const { dispatch } = useContext(AppContext);

  let listURL: string | undefined;
  if (listData && listData[0].attributes && listData[0].attributes.title) {
    listURL =
      EUrlsPages.LIST +
      "/" +
      encodeURIComponent(
        handleTitleWithJustNumber(listData[0].attributes.title),
      ) +
      "?id=" +
      listData[0].attributes.uid;
  } else {
    listURL = "";
  }

  useEffect(() => {
    // Get/Set Queries on Page Load (Doing these will update the filters with the current queries)
    const { page } = query;
    // Page
    if (page) setCurrentPage(Number(page as string));

    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id && listData) {
      setUserId(accountData.id);

      if (
        listData[0].attributes.owners?.data?.some(
          (owner: { id: number }) => owner.id === accountData.id,
        )
      ) {
        setIsOwner(true);
      }
      if (
        listData[0].attributes.users?.data?.some(
          (user: { id: number }) => user.id === accountData.id,
        )
      ) {
        setIsUser(true);
      }
      if (
        listData[0].attributes.visibility.data?.attributes.currentVisibility
      ) {
        setVisibilityValue(
          listData[0].attributes.visibility.data?.attributes.currentVisibility,
        );
        if (
          listData[0].attributes.visibility.data?.attributes
            .currentVisibility == "private"
        ) {
          if (
            listData[0].attributes.owners?.data?.some(
              (owner: { id: number }) => owner.id === accountData.id,
            ) ||
            listData[0].attributes.users?.data?.some(
              (user: { id: number }) => user.id === accountData.id,
            )
          ) {
            setVisibilityRestriction(false);
          } else {
            setVisibilityRestriction(true);
          }
        } else {
          setVisibilityRestriction(false);
        }
      }
    } else {
      if (
        listData &&
        listData[0].attributes.visibility.data?.attributes.currentVisibility ==
          "private"
      ) {
        setVisibilityRestriction(true);
      } else {
        setVisibilityRestriction(false);
      }
    }

    if (listData && listData[0].attributes.details) {
      const parsedContent = marked.parse(listData[0].attributes.details);
      setContentClean(parsedContent as string);
      setDetailsValue(listData[0].attributes.details);
      setDetailsValueOld(listData[0].attributes.details);
    }

    if (listData && listData[0].attributes.description) {
      setDescValue(listData[0].attributes.description);
      setDescValueOld(listData[0].attributes.description);
    }

    const getListWorks = async () => {
      try {
        setIsLoading(true);
        const fetchedData = [];
        const { data } = await api.get(
          `list-works?pagination[page]=${currentPage}&pagination[pageSize]=10&sort[0]=order:asc&populate[work][fields][0]=title&populate[work][populate][eras][fields][1]=name&populate[work][populate][composers][fields][2]=name&populate[work][populate][level][fields][3]=title&populate[fields][4]=order&populate[fields][5]=desc&populate[visibility][populate][fields][6]=currentVisibility&publicationState=preview&filters[list][id][$eq]=${listData[0].id ? listData[0].id : 0}`,
        );
        fetchedData.push(...data?.data);

        // Redirect to last page if current page is greater than total pages
        if (
          data?.meta?.pagination?.pageCount < currentPage &&
          data?.meta?.pagination?.pageCount > 0
        ) {
          setCurrentPage(
            data.meta.pagination.pageCount && data.meta.pagination.pageCount > 0
              ? data.meta.pagination.pageCount
              : 1,
          );
          router.push({
            pathname: router.pathname,
            query: { ...router.query, page: data.meta.pagination.pageCount },
          });
        } else {
          fetchedData.sort((a, b) => {
            const orderA = a.attributes.order || 0;
            const orderB = b.attributes.order || 0;
            if (orderA === orderB) {
              const titleA =
                a.attributes.work.data.attributes.title.toLowerCase();
              const titleB =
                b.attributes.work.data.attributes.title.toLowerCase();
              return titleA.localeCompare(titleB);
            }
            return orderA - orderB;
          });

          const fetchedDataFiltered = fetchedData
            .map((work) => {
              try {
                const w = work.attributes.work.data;
                return {
                  id: w.id,
                  title: w.attributes.title,
                  eras:
                    w.attributes.eras?.data
                      ?.map(
                        (c: { attributes: { name: string } }) =>
                          c.attributes.name,
                      )
                      .join(", ") || "",
                  composers:
                    w.attributes.composers?.data
                      ?.map(
                        (c: { attributes: { name: string } }) =>
                          c.attributes.name,
                      )
                      .join(", ") || "",
                  level: w.attributes.level?.data?.attributes?.title || "",
                  order: work.attributes.order || 0,
                  notes: work.attributes.notes || "",
                  listId: listData[0].id,
                  listWorkId: work.id,
                  owner: accountData.id
                    ? listData[0].attributes.owners?.data?.some(
                        (owner: { id: number }) => owner.id === accountData.id,
                      )
                    : false,
                  user: accountData.id
                    ? listData[0].attributes.users?.data?.some(
                        (user: { id: number }) => user.id === accountData.id,
                      )
                    : false,
                };
              } catch (error) {
                console.error("Error processing work:", work, error);
                return null;
              }
            })
            .filter((work) => work !== null);

          setWorks(fetchedDataFiltered);
          setTotalPages(data?.meta?.pagination?.pageCount || 1);
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
        setIsLoading(false);
      }
    };

    getListWorks();
  }, [
    router,
    dispatch,
    listData,
    setWorks,
    setIsLoading,
    userId,
    currentPage,
    query,
  ]);

  const handleOrderChange = (listWorkId: number, newOrder: number) => {
    const newWorks = works.map((work) =>
      work.listWorkId === listWorkId ? { ...work, order: newOrder } : work,
    );
    newWorks.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA === orderB) {
        const titleA = a.title ? a.title.toLowerCase() : "";
        const titleB = b.title ? b.title.toLowerCase() : "";
        return titleA.localeCompare(titleB);
      }
      return orderA - orderB;
    });
    setWorks(newWorks);
  };

  const handleChangeDesc = async (newDesc: string) => {
    if (listData[0].id !== null && userId !== null && newDesc !== null) {
      try {
        const { data } = await api.put(`lists/${listData[0].id}`, {
          data: {
            description: newDesc,
          },
        });
        if (data !== null && data !== undefined) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Description updated`,
              type: ENotificationTypes.SUCCESS,
            },
          });
          setDescValue(newDesc);
          setDescValueOld(newDesc);
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error updating description, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } catch (error: any) {
        if (
          error?.response?.data &&
          error?.response?.data.error?.message === "Not Found"
        ) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error updating description, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error updating description (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      }
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "Error updating description, please try again.",
          type: ENotificationTypes.ERROR,
        },
      });
    }
  };

  const handleChangeDetails = async (newDetails: string) => {
    if (listData[0].id !== null && userId !== null && newDetails !== null) {
      try {
        const { data } = await api.put(`lists/${listData[0].id}`, {
          data: {
            details: newDetails,
          },
        });
        if (data !== null && data !== undefined) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Details updated`,
              type: ENotificationTypes.SUCCESS,
            },
          });
          setDetailsValue(newDetails);
          setDetailsValueOld(newDetails);
          const parsedContent = marked.parse(newDetails);
          setContentClean(parsedContent as string);
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error updating details, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } catch (error: any) {
        if (
          error?.response?.data &&
          error?.response?.data.error?.message === "Not Found"
        ) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error updating details, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error updating details (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      }
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "Error updating details, please try again.",
          type: ENotificationTypes.ERROR,
        },
      });
    }
  };

  const handleChangeVisibility = async (newVisibility: string) => {
    if (listData[0].id !== null && userId !== null && newVisibility !== null) {
      try {
        const { data } = await api.put(`lists/${listData[0].id}`, {
          data: {
            visibility:
              newVisibility === "public"
                ? 3
                : newVisibility === "unlisted"
                  ? 1
                  : 2,
          },
        });
        if (data !== null && data !== undefined) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Visibility updated to ${newVisibility === "public" ? "Public" : newVisibility === "unlisted" ? "Unlisted" : "Private"}`,
              type: ENotificationTypes.SUCCESS,
            },
          });
          setVisibilityValue(newVisibility);
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error updating visibility, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } catch (error: any) {
        if (
          error?.response?.data &&
          error?.response?.data.error?.message === "Not Found"
        ) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error updating visibility, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error updating visibility (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      }
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "Error updating visibility, please try again.",
          type: ENotificationTypes.ERROR,
        },
      });
    }
  };

  const onRemove = async (listWorkId: number) => {
    if (listWorkId !== null) {
      handleRemove(listWorkId);
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message:
            "Error removing piece from list, please refresh and try again.",
          type: ENotificationTypes.ERROR,
        },
      });
    }
  };

  const handleRemove = async (listWorkId: number) => {
    if (listWorkId !== null) {
      try {
        const { data } = await api.delete(`list-works/${listWorkId}`);
        if (data !== null && data !== undefined) {
          const newWorks = works.filter(
            (work) => work.listWorkId !== listWorkId,
          );
          setWorks(newWorks);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Piece removed from list`,
              type: ENotificationTypes.SUCCESS,
            },
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error removing piece from list, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        }
      } catch (error: any) {
        if (
          error?.response?.data &&
          error?.response?.data.error?.message === "Not Found"
        ) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error removing piece from list, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error removing piece from list (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      }
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message:
            "Error removing piece from list, please refresh and try again.",
          type: ENotificationTypes.ERROR,
        },
      });
    }
  };

  return (
    <>
      {visibilityRestriction !== true &&
      listData &&
      listData[0].attributes &&
      listData[0].attributes.title ? (
        <Page
          showBackBar={true}
          showBackBarShare={
            listData[0].attributes.visibility.data?.attributes
              .currentVisibility === "private"
              ? false
              : true
          }
          showBackBarFeedback={true}
          url={listURL}
          prevUrl={prevUrl}
          title={
            listData[0].attributes.title
              ? `${listData[0].attributes.title} - Piano Music Database`
              : "List - Piano Music Database"
          }
          description={
            listData[0].attributes.description
              ? listData[0].attributes.description
              : `Explore ${listData[0].attributes.title} on Piano Music Database. Buy the sheet music, find the works that make up the list, and discover other details.`
          }
          image=""
        >
          <div className="flex flex-col justify-center items-center w-full text-center">
            <div className="flex flex-col justify-center items-center gap-y-3 mb-4 text-center">
              <div className="flex flex-col mb-4 max-w-[1000px] text-center">
                <div className="flex md:flex-row flex-col justify-center items-top max-md:items-center gap-x-6 gap-y-8">
                  <div className="flex flex-col justify-center gap-y-2 mt-4 text-center">
                    <h1 className="justify-center items-center pb-2 w-full max-w-[816px] overflow-ellipsis overflow-hidden text-center whitespace-normal">
                      {listData[0].attributes.title}
                    </h1>
                    <div className="flex flex-col justify-center items-center gap-4 mb-2 text-center align-middle">
                      <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-center align-middle">
                        {listData[0].attributes.owners &&
                          listData[0].attributes.owners.data &&
                          listData[0].attributes.owners.data.length > 0 &&
                          listData[0].attributes.owners.data.map(
                            (
                              owner: {
                                id: number;
                                attributes: { name: string };
                              },
                              index: number,
                            ) => (
                              <div
                                key={index}
                                className="flex flex-wrap items-center gap-2"
                              >
                                <Chip title={owner.attributes.name} />
                                {userId === owner.id && (
                                  <Link
                                    href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}
                                  >
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
                                )}
                              </div>
                            ),
                          )}
                      </div>
                      {listData[0].attributes.users &&
                        listData[0].attributes.users.data &&
                        listData[0].attributes.users.data.length > 0 &&
                        listData[0].attributes.users.data
                          .filter(
                            (user: { id: number }) =>
                              !listData[0].attributes.owners?.data?.some(
                                (owner: { id: number }) => owner.id === user.id,
                              ),
                          )
                          .map(
                            (
                              user: {
                                id: number;
                                attributes: { name: string };
                              },
                              index: number,
                            ) => (
                              <div
                                key={index}
                                className="flex flex-wrap items-center gap-2"
                              >
                                <p className="text-pmdGray">
                                  {user.attributes.name}
                                </p>
                                {userId === user.id && (
                                  <Link
                                    href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}
                                  >
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
                                )}
                              </div>
                            ),
                          )}
                    </div>
                    <div className="flex min-[825px]:flex-row flex-col justify-center items-center min-[825px]:items-start gap-x-8 gap-y-2 max-w-[816px] text-center">
                      {isOwner || isUser ? (
                        <>
                          {descValue ? (
                            <div className="relative justify-start items-start w-full h-full text-justify align-middle cursor-text">
                              {!isEditingDesc ? (
                                <a
                                  tabIndex={0}
                                  title={`Edit this desc`}
                                  className="flex px-4 pb-3 w-full h-auto text-pmdGrayDark !no-underline"
                                  onClick={() => {
                                    setIsEditingDesc(true);
                                    setTimeout(() => {
                                      const descInput = document.getElementById(
                                        `list-desc-input-${listData[0].id}`,
                                      ) as HTMLTextAreaElement;
                                      if (descInput) {
                                        descInput.focus();
                                        descInput.setSelectionRange(
                                          descInput.value.length,
                                          descInput.value.length,
                                        ); // Set cursor at the end
                                      }
                                    }, 0);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      setIsEditingDesc(true);
                                      setTimeout(() => {
                                        const descInput =
                                          document.getElementById(
                                            `list-desc-input-${listData[0].id}`,
                                          ) as HTMLTextAreaElement;
                                        if (descInput) {
                                          descInput.focus();
                                          descInput.setSelectionRange(
                                            descInput.value.length,
                                            descInput.value.length,
                                          ); // Set cursor at the end
                                        }
                                      }, 0);
                                    }
                                  }}
                                >
                                  <p>{descValue}</p>
                                </a>
                              ) : (
                                <div className="flex flex-col w-full h-full">
                                  <textarea
                                    id={`list-desc-input-${listData[0].id}`}
                                    name={`list-desc-input-${listData[0].id}`}
                                    className="flex bg-transparent px-4 pt-2 pb-3 border border-pmdGrayLight outline-none w-full h-full"
                                    value={descValue}
                                    onChange={(e) =>
                                      setDescValue(e.target.value)
                                    }
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      className="bg-green-500 p-1 rounded w-[25px] h-[25px] text-white"
                                      onClick={() => {
                                        handleChangeDesc(
                                          descValue ? descValue : "",
                                        );
                                        setIsEditingDesc(false);
                                      }}
                                    >
                                      ✔
                                    </button>
                                    <button
                                      className="bg-red-500 p-1 rounded w-[25px] h-[25px] text-white"
                                      onClick={() => {
                                        setDescValue(
                                          descValueOld ? descValueOld : null,
                                        );
                                        setIsEditingDesc(false);
                                      }}
                                    >
                                      ✖
                                    </button>
                                    <div className="flex justify-end mt-1 text-pmdGray text-sm">
                                      {descValue ? descValue.length : 0}/255
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="relative justify-start items-start w-full h-auto text-left align-middle cursor-text">
                              {!isEditingDesc ? (
                                <a
                                  tabIndex={0}
                                  title={`Add a description`}
                                  className="flex px-4 pb-3 w-full h-auto text-pmdGrayDark !no-underline"
                                  onClick={() => {
                                    setIsEditingDesc(true);
                                    setTimeout(() => {
                                      const descInput = document.getElementById(
                                        `list-desc-input-${listData[0].id}`,
                                      ) as HTMLTextAreaElement;
                                      if (descInput) {
                                        descInput.focus();
                                        descInput.setSelectionRange(
                                          descInput.value.length,
                                          descInput.value.length,
                                        ); // Set cursor at the end
                                      }
                                    }, 0);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      setIsEditingDesc(true);
                                      setTimeout(() => {
                                        const descInput =
                                          document.getElementById(
                                            `list-desc-input-${listData[0].id}`,
                                          ) as HTMLTextAreaElement;
                                        if (descInput) {
                                          descInput.focus();
                                          descInput.setSelectionRange(
                                            descInput.value.length,
                                            descInput.value.length,
                                          ); // Set cursor at the end
                                        }
                                      }, 0);
                                    }
                                  }}
                                >
                                  <p>
                                    <em>No Description!</em> <br />
                                    Click here to add a description.
                                  </p>
                                </a>
                              ) : (
                                <div className="relative justify-start items-start w-full h-full text-sm text-left align-middle">
                                  <textarea
                                    id={`list-desc-input-${listData[0].id}`}
                                    name={`list-desc-input-${listData[0].id}`}
                                    className="flex bg-transparent px-4 pt-2 pb-3 border border-pmdGrayLight outline-none w-full h-auto"
                                    value={descValue ? descValue : ""}
                                    onChange={(e) =>
                                      setDescValue(e.target.value)
                                    }
                                  />
                                  <div className="flex gap-2 mt-2 w-full h-full grow">
                                    <button
                                      className="bg-green-500 p-1 rounded w-[25px] h-[25px] text-white"
                                      onClick={() => {
                                        handleChangeDesc(
                                          descValue ? descValue : "",
                                        );
                                        setIsEditingDesc(false);
                                      }}
                                    >
                                      ✔
                                    </button>
                                    <button
                                      className="bg-red-500 p-1 rounded w-[25px] h-[25px] text-white"
                                      onClick={() => {
                                        setDescValue(
                                          descValueOld ? descValueOld : null,
                                        );
                                        setIsEditingDesc(false);
                                      }}
                                    >
                                      ✖
                                    </button>
                                    <div className="flex justify-end mt-1 text-pmdGray text-sm">
                                      {descValue ? descValue.length : 0}/255
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <div
                            className={cn(
                              "flex flex-col justify-center gap-y-2 min-[825px]:min-w-[250px] max-w-[250px]  text-center",
                              {
                                "min-[825px]:text-justify":
                                  listData[0].attributes.description ||
                                  isOwner ||
                                  isUser,
                              },
                            )}
                          >
                            {listData[0].attributes.updatedAt && (
                              <p>
                                <span className="font-medium">
                                  Last Updated:
                                </span>{" "}
                                {new Date(
                                  listData[0].attributes.updatedAt,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {listData[0].attributes.createdAt && (
                              <p>
                                <span className="font-medium">Created:</span>{" "}
                                {new Date(
                                  listData[0].attributes.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {isOwner || (isOwner && isUser) ? (
                              <div className="flex flex-col max-[825px]:justify-center max-[825px]:items-center gap-2 max-[825px]:text-center max-[825px]:align-middle">
                                <a
                                  tabIndex={0}
                                  className="flex justify-center items-center gap-2 my-2 !px-4 !py-2 w-fit min-w-[137px] !font-medium text-center align-middle cursor-pointer button"
                                  title="Delete List"
                                  aria-label="Delete List"
                                  aria-haspopup="dialog"
                                  aria-expanded={isOpenModalListDelete}
                                  aria-controls={
                                    "ModalListDelete" + listData[0].id
                                  }
                                  onClick={handleIsOpenModalListDelete}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      handleIsOpenModalListDelete();
                                    }
                                  }}
                                >
                                  <ImageNext
                                    src={IconDeleteWhite}
                                    alt=""
                                    height={16}
                                    width={16}
                                  />
                                  <p className="text-sm">Delete List</p>
                                </a>
                              </div>
                            ) : (
                              ""
                            )}
                            <ModalListDelete
                              listId={listData[0].id.toString()}
                              listTitle={listData[0].attributes.title}
                              isOpen={isOpenModalListDelete}
                              onClose={handleIsOpenModalListDelete}
                            />
                            {visibilityValue && (
                              <div className="relative flex flex-col max-[825px]:justify-center max-[825px]:items-center max-[825px]:text-center">
                                <p>
                                  <span className="font-medium">
                                    List Visibility:
                                  </span>
                                </p>
                                <div className="flex flex-col max-[825px]:justify-center max-[825px]:items-center gap-2 max-[825px]:text-center max-[825px]:align-middle">
                                  <a
                                    className="flex justify-center items-center gap-2 !px-4 !py-2 w-fit min-w-[137px] !font-medium text-center cursor-pointer button"
                                    title="Change the visibility"
                                    tabIndex={0}
                                    onClick={() => {
                                      const dropdown = document.getElementById(
                                        "visibility-dropdown",
                                      );
                                      if (dropdown) {
                                        dropdown.classList.toggle("hidden");
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        const dropdown =
                                          document.getElementById(
                                            "visibility-dropdown",
                                          );
                                        if (dropdown) {
                                          dropdown.classList.toggle("hidden");
                                        }
                                      }
                                    }}
                                  >
                                    {visibilityValue === "public" ? (
                                      <div className="flex gap-2">
                                        <ImageNext
                                          src={IconGlobeWhite}
                                          alt=""
                                          height={28}
                                          width={28}
                                        />
                                        <p>Public</p>
                                      </div>
                                    ) : visibilityValue === "unlisted" ? (
                                      <div className="flex gap-2">
                                        <ImageNext
                                          src={IconLinkWhite}
                                          alt=""
                                          height={28}
                                          width={28}
                                        />
                                        <p>Unlisted</p>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        <ImageNext
                                          src={IconLockWhite}
                                          alt=""
                                          height={28}
                                          width={28}
                                        />
                                        <p>Private</p>
                                      </div>
                                    )}
                                  </a>
                                </div>
                                <div
                                  id="visibility-dropdown"
                                  className="hidden top-20 z-50 absolute shadow-lg border rounded text-center align-middle"
                                >
                                  <button
                                    className="flex justify-center gap-2 bg-white hover:bg-pmdGrayBright px-4 py-2 w-full text-pmdRed hover:text-pmdGray text-center align-middle"
                                    onClick={() => {
                                      handleChangeVisibility("public");
                                      const dropdown = document.getElementById(
                                        "visibility-dropdown",
                                      );
                                      if (dropdown) {
                                        dropdown.classList.add("hidden");
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        handleChangeVisibility("public");
                                        const dropdown =
                                          document.getElementById(
                                            "visibility-dropdown",
                                          );
                                        if (dropdown) {
                                          dropdown.classList.add("hidden");
                                        }
                                      }
                                    }}
                                  >
                                    <ImageNext
                                      src={IconGlobeRed}
                                      alt=""
                                      height={28}
                                      width={28}
                                    />
                                    <p>Public</p>
                                  </button>
                                  <button
                                    className="flex justify-center gap-2 bg-white hover:bg-pmdGrayBright px-4 py-2 w-full text-pmdRed hover:text-pmdGray text-center align-middle"
                                    onClick={() => {
                                      handleChangeVisibility("unlisted");
                                      const dropdown = document.getElementById(
                                        "visibility-dropdown",
                                      );
                                      if (dropdown) {
                                        dropdown.classList.add("hidden");
                                      }
                                    }}
                                  >
                                    <ImageNext
                                      src={IconLinkRed}
                                      alt=""
                                      height={28}
                                      width={28}
                                    />
                                    <p>Unlisted</p>
                                  </button>
                                  <button
                                    className="flex justify-center gap-2 bg-white hover:bg-pmdGrayBright px-4 py-2 w-full text-pmdRed hover:text-pmdGray text-center align-middle"
                                    onClick={() => {
                                      handleChangeVisibility("private");
                                      const dropdown = document.getElementById(
                                        "visibility-dropdown",
                                      );
                                      if (dropdown) {
                                        dropdown.classList.add("hidden");
                                      }
                                    }}
                                  >
                                    <ImageNext
                                      src={IconLockRed}
                                      alt=""
                                      height={28}
                                      width={28}
                                    />
                                    <p>Private</p>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative justify-start items-start w-full h-full text-left align-middle cursor-text">
                            <p>{descValue}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isOwner || isUser ? (
              <>
                {detailsValue ? (
                  <div className="relative justify-start items-start w-full h-full text-sm text-left align-middle cursor-text">
                    {!isEditingDetails ? (
                      <div className="flex flex-col justify-center gap-y-2 mt-4 text-center">
                        <div className="relative w-full max-w-[816px]">
                          <div className="flex gap-2 mt-2 mb-0 ml-2 w-full text-left">
                            <p className="text-stone-400 text-sm">Details</p>
                            <a
                              tabIndex={0}
                              title={`Edit the details`}
                              className="flex h-full text-xs !no-underline cursor-pointer"
                              onClick={() => {
                                setIsEditingDetails(true);
                                setTimeout(() => {
                                  const detailsInput = document.getElementById(
                                    `list-details-input-${listData[0].id}`,
                                  ) as HTMLTextAreaElement;
                                  if (detailsInput) {
                                    detailsInput.focus();
                                    detailsInput.setSelectionRange(
                                      detailsInput.value.length,
                                      detailsInput.value.length,
                                    ); // Set cursor at the end
                                  }
                                }, 0);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setIsEditingDetails(true);
                                  setTimeout(() => {
                                    const detailsInput =
                                      document.getElementById(
                                        `list-details-input-${listData[0].id}`,
                                      ) as HTMLTextAreaElement;
                                    if (detailsInput) {
                                      detailsInput.focus();
                                      detailsInput.setSelectionRange(
                                        detailsInput.value.length,
                                        detailsInput.value.length,
                                      ); // Set cursor at the end
                                    }
                                  }, 0);
                                }
                              }}
                            >
                              <p>Edit</p>
                            </a>
                          </div>
                          <div
                            className="px-3 py-2 border border-pmgGray rounded-md max-h-40 overflow-y transition-max-height duration-300 ease-in-out"
                            id="content-frame"
                          >
                            <div className="pb-8 w-full text-justify">
                              {parse(contentClean, {
                                replace(domNode) {
                                  if (
                                    domNode instanceof Element &&
                                    domNode.attribs.class === "GetPiece"
                                  ) {
                                    return (
                                      <GetPiece
                                        workId={
                                          domNode.attribs.id
                                            ? domNode.attribs.id
                                            : "0"
                                        }
                                      />
                                    );
                                  }
                                  if (
                                    domNode instanceof Element &&
                                    domNode.attribs.class === "GetPieceTable"
                                  ) {
                                    return (
                                      <GetPieceTable
                                        workIds={
                                          domNode.attribs.id
                                            ? domNode.attribs.id
                                            : "0"
                                        }
                                      />
                                    );
                                  }
                                  if (
                                    domNode instanceof Element &&
                                    domNode.attribs.class === "GetComposer"
                                  ) {
                                    return (
                                      <GetComposer
                                        composerId={
                                          domNode.attribs.id
                                            ? domNode.attribs.id
                                            : "0"
                                        }
                                      />
                                    );
                                  }
                                  if (
                                    domNode instanceof Element &&
                                    domNode.attribs.class === "GetCollection"
                                  ) {
                                    return (
                                      <GetCollection
                                        collectionId={
                                          domNode.attribs.id
                                            ? domNode.attribs.id
                                            : "0"
                                        }
                                      />
                                    );
                                  }
                                  if (
                                    domNode instanceof Element &&
                                    domNode.attribs.class === "GetPublisher"
                                  ) {
                                    return (
                                      <GetPublisher
                                        publisherId={
                                          domNode.attribs.id
                                            ? domNode.attribs.id
                                            : "0"
                                        }
                                      />
                                    );
                                  }
                                  if (
                                    domNode instanceof Element &&
                                    domNode.attribs.class === "GetElement"
                                  ) {
                                    return (
                                      <GetElement
                                        elementId={
                                          domNode.attribs.id
                                            ? domNode.attribs.id
                                            : "0"
                                        }
                                      />
                                    );
                                  }
                                },
                              })}
                            </div>
                          </div>
                          <button
                            className="bottom-0 left-0 absolute bg-pmdGrayDark bg-clip-padding mask-to-t to-transparent bg-opacity-5 backdrop-filter backdrop-blur-sm backdrop-contrast-100 backdrop-saturate-100 pt-4 pb-1 border-pmdGrayBright border-b w-full font-bold text-pmdRed text-center transition-all duration-300 ease-in-out"
                            onClick={() => {
                              const frame =
                                document.getElementById("content-frame");
                              if (frame) {
                                frame.classList.toggle("max-h-40");
                                frame.classList.toggle("max-h-96");
                                const button =
                                  frame.nextElementSibling as HTMLButtonElement;
                                if (button) {
                                  button.textContent = frame.classList.contains(
                                    "max-h-96",
                                  )
                                    ? "Collapse"
                                    : "Expand";
                                }
                              }
                            }}
                          >
                            Expand
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full h-full">
                        <div className="flex gap-2 mt-2 mb-0 ml-2 w-full text-left">
                          <p className="text-stone-400 text-sm">Details</p>
                        </div>
                        <textarea
                          id={`list-details-input-${listData[0].id}`}
                          name={`list-details-input-${listData[0].id}`}
                          className="flex bg-transparent px-4 pt-2 pb-3 border border-pmdGrayLight outline-none w-full h-full"
                          value={detailsValue}
                          onChange={(e) => setDetailsValue(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2 w-full h-full grow">
                          <button
                            className="bg-green-500 p-1 rounded w-[25px] h-[25px] text-white"
                            onClick={() => {
                              handleChangeDetails(
                                detailsValue ? detailsValue : "",
                              );
                              setIsEditingDetails(false);
                            }}
                          >
                            ✔
                          </button>
                          <button
                            className="bg-red-500 p-1 rounded w-[25px] h-[25px] text-white"
                            onClick={() => {
                              setDetailsValue(
                                detailsValueOld ? detailsValueOld : null,
                              );
                              setIsEditingDetails(false);
                            }}
                          >
                            ✖
                          </button>
                          <div className="flex justify-end mt-1 text-pmdGray text-sm">
                            <p>{detailsValue ? detailsValue.length : 0}/2000</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative justify-start items-start w-full h-full text-left align-middle cursor-text">
                    {!isEditingDetails ? (
                      <a
                        tabIndex={0}
                        title={`Add details`}
                        className="flex px-4 pt-2 pb-3 w-full h-full text-pmdGrayDark !no-underline"
                        onClick={() => {
                          setIsEditingDetails(true);
                          setTimeout(() => {
                            const detailsInput = document.getElementById(
                              `list-details-input-${listData[0].id}`,
                            ) as HTMLTextAreaElement;
                            if (detailsInput) {
                              detailsInput.focus();
                              detailsInput.setSelectionRange(
                                detailsInput.value.length,
                                detailsInput.value.length,
                              ); // Set cursor at the end
                            }
                          }, 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setIsEditingDetails(true);
                            setTimeout(() => {
                              const detailsInput = document.getElementById(
                                `list-details-input-${listData[0].id}`,
                              ) as HTMLTextAreaElement;
                              if (detailsInput) {
                                detailsInput.focus();
                                detailsInput.setSelectionRange(
                                  detailsInput.value.length,
                                  detailsInput.value.length,
                                ); // Set cursor at the end
                              }
                            }, 0);
                          }
                        }}
                      >
                        <p>
                          <em>No Details!</em> <br />
                          Click here to add details.
                        </p>
                      </a>
                    ) : (
                      <div className="flex flex-col w-full h-full">
                        <div className="flex gap-2 mt-2 mb-0 ml-2 w-full text-left">
                          <p className="text-stone-400 text-sm">Details</p>
                        </div>
                        <textarea
                          id={`list-details-input-${listData[0].id}`}
                          name={`list-details-input-${listData[0].id}`}
                          className="flex bg-transparent px-4 pt-2 pb-3 border border-pmdGrayLight outline-none w-full h-full"
                          value={detailsValue ? detailsValue : ""}
                          onChange={(e) => setDetailsValue(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2 w-full h-full grow">
                          <button
                            className="bg-green-500 px-1 pt-0.5 rounded w-[25px] h-[25px] text-white"
                            onClick={() => {
                              handleChangeDetails(
                                detailsValue ? detailsValue : "",
                              );
                              setIsEditingDetails(false);
                            }}
                          >
                            ✔
                          </button>
                          <button
                            className="bg-red-500 px-1 pt-0.5 rounded w-[25px] h-[25px] text-white"
                            onClick={() => {
                              setDetailsValue(
                                detailsValueOld ? detailsValueOld : null,
                              );
                              setIsEditingDetails(false);
                            }}
                          >
                            ✖
                          </button>
                          <div className="flex justify-end mt-1 text-pmdGray text-sm">
                            <p>{detailsValue ? detailsValue.length : 0}/2000</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : detailsValue ? (
              <div className="relative w-full max-w-[816px]">
                <div className="flex gap-2 mt-2 mb-0 ml-2 w-full text-left">
                  <p className="text-stone-400 text-sm">Details</p>
                </div>
                <div
                  className="px-3 py-2 border border-pmgGray rounded-md max-h-40 overflow-y transition-max-height duration-300 ease-in-out"
                  id="content-frame"
                >
                  <div className="pb-8 w-full text-justify">
                    {parse(contentClean, {
                      replace(domNode) {
                        if (
                          domNode instanceof Element &&
                          domNode.attribs.class === "GetPiece"
                        ) {
                          return (
                            <GetPiece
                              workId={
                                domNode.attribs.id ? domNode.attribs.id : "0"
                              }
                            />
                          );
                        }
                        if (
                          domNode instanceof Element &&
                          domNode.attribs.class === "GetPieceTable"
                        ) {
                          return (
                            <GetPieceTable
                              workIds={
                                domNode.attribs.id ? domNode.attribs.id : "0"
                              }
                            />
                          );
                        }
                        if (
                          domNode instanceof Element &&
                          domNode.attribs.class === "GetComposer"
                        ) {
                          return (
                            <GetComposer
                              composerId={
                                domNode.attribs.id ? domNode.attribs.id : "0"
                              }
                            />
                          );
                        }
                        if (
                          domNode instanceof Element &&
                          domNode.attribs.class === "GetCollection"
                        ) {
                          return (
                            <GetCollection
                              collectionId={
                                domNode.attribs.id ? domNode.attribs.id : "0"
                              }
                            />
                          );
                        }
                        if (
                          domNode instanceof Element &&
                          domNode.attribs.class === "GetPublisher"
                        ) {
                          return (
                            <GetPublisher
                              publisherId={
                                domNode.attribs.id ? domNode.attribs.id : "0"
                              }
                            />
                          );
                        }
                        if (
                          domNode instanceof Element &&
                          domNode.attribs.class === "GetElement"
                        ) {
                          return (
                            <GetElement
                              elementId={
                                domNode.attribs.id ? domNode.attribs.id : "0"
                              }
                            />
                          );
                        }
                      },
                    })}
                  </div>
                </div>
                <button
                  className="bottom-0 left-0 absolute bg-pmdGrayDark bg-clip-padding mask-to-t to-transparent bg-opacity-5 backdrop-filter backdrop-blur-sm backdrop-contrast-100 backdrop-saturate-100 pt-4 pb-1 border-pmdGrayBright border-b w-full font-bold text-pmdRed text-center transition-all duration-300 ease-in-out"
                  onClick={() => {
                    const frame = document.getElementById("content-frame");
                    if (frame) {
                      frame.classList.toggle("max-h-40");
                      frame.classList.toggle("max-h-96");
                      const button =
                        frame.nextElementSibling as HTMLButtonElement;
                      if (button) {
                        button.textContent = frame.classList.contains(
                          "max-h-96",
                        )
                          ? "Collapse"
                          : "Expand";
                      }
                    }
                  }}
                >
                  Expand
                </button>
              </div>
            ) : (
              ""
            )}

            <div
              id="list-works"
              className="flex flex-col flex-wrap justify-center items-center mt-10 w-full"
            >
              {isLoading ? (
                <p>Loading works...</p>
              ) : works && works.length > 0 ? (
                <div className="relative w-full max-w-[816px]">
                  <Works
                    works={works}
                    // onOrderChange={handleOrderChange}
                    onRemoveListItem={onRemove}
                  />
                </div>
              ) : (
                <div className="relative flex flex-col justify-center gap-y-2 mx-auto w-auto max-w-[816px] text-center">
                  <Chip
                    title="This list is currently empty!"
                    className="flex justify-center items-center !text-red-600 text-center align-middle"
                  />
                  <Chip
                    title="Find and add some pieces to this list."
                    className="flex justify-center items-center text-center align-middle"
                  />
                </div>
              )}
            </div>
            {works.length > 9 && (
              <div className="flex justify-center items-center gap-3 min-[340px]:gap-5 mt-6 mb-3 text-sm">
                <Link href={"/" + listURL + "&page=1"}>
                  <a
                    title="First Page"
                    className={cn(
                      currentPage === 1
                        ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                        : "cursor-pointer",
                      "bg-pmdGrayBright px-2 py-1 rounded-md",
                    )}
                  >
                    First
                  </a>
                </Link>
                <Link href={"/" + listURL + ("&page=" + (currentPage - 1))}>
                  <a
                    title="Previous Page"
                    className={cn(
                      currentPage === 1
                        ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                        : "cursor-pointer",
                      "bg-pmdGrayBright px-2 py-1 rounded-md",
                    )}
                  >
                    Prev
                  </a>
                </Link>
                <span className="mx-2">
                  {currentPage} of {totalPages}
                </span>
                <Link href={"/" + listURL + ("&page=" + (currentPage + 1))}>
                  <a
                    title="Next Page"
                    className={cn(
                      currentPage === totalPages
                        ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                        : "cursor-pointer",
                      "bg-pmdGrayBright px-2 py-1 rounded-md",
                    )}
                  >
                    Next
                  </a>
                </Link>
                <Link href={"/" + listURL + ("&page=" + totalPages)}>
                  <a
                    title="Last Page"
                    className={cn(
                      currentPage === totalPages
                        ? "cursor-not-allowed pointer-events-none text-pmdGray no-underline"
                        : "cursor-pointer",
                      "bg-pmdGrayBright px-2 py-1 rounded-md",
                    )}
                  >
                    Last
                  </a>
                </Link>
              </div>
            )}
          </div>
        </Page>
      ) : visibilityRestriction == true ? (
        <Page
          showBackBar={true}
          showBackBarShare={false}
          showBackBarFeedback={true}
          prevUrl={prevUrl}
          url={`${EUrlsPages.LIST}/private`}
          title="Private List - Piano Music Database"
          description="Explore lists on Piano Music Database. Buy the sheet music, find the works that make up the list, and discover other details."
          image=""
        >
          <>
            <h1>List is Private</h1>
            <h2 className="mt-10">
              <em>This list has a private visibility.</em>
            </h2>
            <p className="mt-6 max-w-[864px]">
              The list you are looking for has been set to private visibility.
            </p>
            <p className="mt-2 max-w-[864px]">
              If you are an owner or member of this list, try logging into the
              correct account associated with this list.
            </p>
            <p className="mt-2 max-w-[844px]">
              If you were looking for a specific list, make sure the URL is
              formatted like this: <br />
              <strong>/{EUrlsPages.LIST}/TITLEHERE?id=IDHERE</strong> <br />
              The ID is a number we use to connect you to the correct list. Some
              lists may have the same title, so we can not know which list you
              are looking for without an ID in the URL.
            </p>
            <p className="mt-6">
              Try searching to find what you are looking for.
            </p>
            <div className="flex flex-col justify-center items-center gap-y-4 my-8 w-full">
              <Link href={`/${EUrlsPages.SEARCH}`}>
                <a
                  aria-label="Start a Search"
                  title="Start a Search"
                  className="flex gap-2 md:!px-20 !pt-[30px] !pb-8 text-2xl button"
                >
                  <ImageNext
                    src={IconSearchWhite}
                    alt=""
                    height={20}
                    width={21}
                    className="max-[314px]:hidden z-0"
                  />{" "}
                  Start a Search
                </a>
              </Link>
            </div>
          </>
        </Page>
      ) : (
        <Page
          showBackBar={true}
          showBackBarShare={false}
          showBackBarFeedback={true}
          prevUrl={prevUrl}
          url={`${EUrlsPages.LIST}/not-found`}
          title="List Not Found - Piano Music Database"
          description="Explore lists on Piano Music Database. Buy the sheet music, find the works that make up the list, and discover other details."
          image=""
        >
          <>
            <h1>Error 404: List Not Found</h1>
            <h2 className="mt-10">
              <em>This list was not able to be located.</em>
            </h2>
            <p className="mt-6 max-w-[864px]">
              The list you are looking for has moved, is no longer available,
              has been archived, or was not valid.
            </p>
            <p className="mt-2 max-w-[844px]">
              If you were looking for a specific list, make sure the URL is
              formatted like this: <br />
              <strong>/{EUrlsPages.LIST}/TITLEHERE?id=IDHERE</strong> <br />
              The ID is a number we use to connect you to the correct list. Some
              lists may have the same title, so we can not know which list you
              are looking for without an ID in the URL.
            </p>
            <p className="mt-6">
              Try searching to find what you are looking for.
            </p>
            <div className="flex flex-col justify-center items-center gap-y-4 my-8 w-full">
              <Link href={`/${EUrlsPages.SEARCH}`}>
                <a
                  aria-label="Start a Search"
                  title="Start a Search"
                  className="flex gap-2 md:!px-20 !pt-[30px] !pb-8 text-2xl button"
                >
                  <ImageNext
                    src={IconSearchWhite}
                    alt=""
                    height={20}
                    width={21}
                    className="max-[314px]:hidden z-0"
                  />{" "}
                  Start a Search
                </a>
              </Link>
            </div>
          </>
        </Page>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await apiList.get((context?.query?.id as string) || "0");
    return {
      props: {
        listData: response.data.data,
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  } catch (error) {
    console.error("Error fetching list data:", error);
    return {
      props: {
        listData: null,
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  }
};

export default ListDetailsPage;
