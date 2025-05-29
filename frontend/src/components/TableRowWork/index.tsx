import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@src/state';
import cn from 'classnames';
import api from '@src/api/config';
import Link from 'next/link';
import { EUrlsPages } from '@src/constants';
import ImageNext from '@src/components/ImageNext';
import { handleTitleWithJustNumber } from '@src/api/helpers';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
  IStrapiEra
} from '@src/types';
import {
  IconBookmark,
  IconDeleteWhite,
  IconHeart,
  IconHeartFilled
} from '@src/common/assets/icons';
import {
  ModalListAddTo
} from '@src/components/Modals';

interface ITableRowWorkProps {
  id: number;
  title: string | undefined;
  composers: string[] | null;
  level: string | undefined;
  eras: string[] | null;
  notes?: string | undefined;
  order?: number | undefined;
  listId?: number | undefined;
  listWorkId?: number | undefined;
  owner?: boolean | undefined;
  user?: boolean | undefined;
  onOrderChange?: (listWorkId: number, newOrder: number) => void;
  onRemoveListItem?: (listWorkId: number) => void;
  onRemoveFavoriteItem?: (favoritedWorkId: number, favoriteId: number) => void;
  isFavoritePage?: boolean | undefined;
  isMobile?: boolean | undefined;
  isRemovingListItem?: boolean | undefined;
  isRemovingFavoriteItem?: boolean | undefined;
};

const TableRowWork: FC<ITableRowWorkProps> = ({ id, title, composers, level, eras, notes, order, listId, listWorkId, owner, user, onOrderChange, onRemoveListItem, onRemoveFavoriteItem, isFavoritePage, isMobile, isRemovingListItem, isRemovingFavoriteItem }): JSX.Element => {
  const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setUserEmail] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState<string | null>(null);
  const [notesValueOld, setNotesValueOld] = useState<string | null>(null);
  const [favId, setFavId] = useState<number | null>(null);
  const [isFavPage, setIsFavPage] = useState<boolean | null>(false);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [isUser, setIsUser] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isSubmitFavoriteAllowed, setIsSubmitAllowed] = useState(true);
  const [isRemovingListItemFrameOpen, setIsRemovingListItemFrameOpen] = useState<boolean>(false);
  const [isRemovingFavoriteItemFrameOpen, setIsRemovingFavoriteItemFrameOpen] = useState<boolean>(false);
  const [isOpenModalListAddTo, setIsOpenModalListAddTo] = useState(false);
  const handleIsOpenModalListAddTo = () => setIsOpenModalListAddTo(!isOpenModalListAddTo);

  const { dispatch } = useContext(AppContext);

  let titleText: string | undefined;
  if (title) {
    titleText = title.trim();
  } else {
    titleText = '';
  };

  if (composers && composers.length > 0) {
    if (Array.isArray(composers)) {
      composers.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
    } else {
      composers = [composers];
    }
  };

  let composerText: string | undefined;
  if (composers && composers.length > 0) {
    if (composers.length > 1) {
      composerText = '';
      const composerLength: number = composers.length;
      composers.map((composer, idx) => (
        composerText += composer + (idx < composerLength - 1 ? ', ' : '')
      ));
    } else {
      composerText = '';
      composerText = composers[0];
    };
  } else {
    composerText = '';
  };

  let workURL: string | undefined;
  workURL = '/' + EUrlsPages.WORK + '/' + encodeURIComponent(handleTitleWithJustNumber(titleText ? titleText : '')) + '-' + encodeURIComponent(handleTitleWithJustNumber(composerText ? composerText : '')) + '?id=' + id;

  useEffect(
    () => {
      const getFavorites = async () => {
        try {
          setIsLoadingFavorites(true);
          setIsSubmitAllowed(false);
          const { data } = await api.get(
            `favorites?pagination[page]=1&pagination[pageSize]=1&populate[work][fields][0]=title&populate[user][fields][1]=email&filters[user][id][$eq]=${userId}&filters[work][id][$eq]=${id}`
          );
          if (data !== null || data !== undefined || data?.data.length > 0) {
            const favoriteID = (data?.data.length > 0 && data?.data[0].id) ? data?.data[0].id : null;
            setFavId(favoriteID);
            const newIsFavorite = (data?.data.length > 0 && data?.data[0].id) ? true : false
            setIsFavorite(newIsFavorite);
          } else {
            setFavId(null);
            setIsFavorite(null);
          }
        } catch (error: any) {
          setFavId(null);
          setIsFavorite(null);
        } finally {
          setIsLoadingFavorites(false);
          setIsSubmitAllowed(true);
        };
      };

      const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');

      if (accountData.email) {
        setUserId(accountData.id);
        setUserEmail(accountData.email);
        { userId && getFavorites(); }
        setIsOwner(owner ? true : false);
        setIsUser(user ? true : false);
        setOrderId(order ? order : 0);
        setNotesValue(notes ? notes : '');
        setNotesValueOld(notes ? notes : '');
        setIsRemovingListItemFrameOpen(isRemovingListItem ? true : false);
        setIsRemovingFavoriteItemFrameOpen(isRemovingFavoriteItem ? true : false);
        setIsFavPage(isFavoritePage ? true : false);
      };
    }, [dispatch, userId, email, router, id, order, owner, user, notes, isRemovingListItem, isRemovingFavoriteItem, isFavoritePage]
  );

  const handleAddFavorite = async () => {
    if (userId !== null && id !== null) {
      try {
        setIsLoadingFavorites(true);
        const dataAdded = await api.post('favorites', {
          data: {
            user: {
              id: userId
            },
            work: {
              id: id
            },
          }
        });
        if (dataAdded !== null && dataAdded !== undefined && dataAdded.data.data.id) {
          const favoriteID = dataAdded.data.data.id ? dataAdded.data.data.id : null;
          setFavId(favoriteID);
          const newIsFavorite = dataAdded.data.data.id ? true : false;
          setIsFavorite(newIsFavorite);
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: title ? `Favorite Added: ${title?.trim()}` : `Favorite Added`,
              type: ENotificationTypes.SUCCESS
            }
          });
        }
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error adding favorite, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
      };
    };
  };

  const handleRemoveFavorite = async (id: string) => {
    if (userId !== null && id !== null) {
      try {
        setIsLoadingFavorites(true);
        setIsSubmitAllowed(false);
        await api.delete(`favorites/${id}`, {
          data: {
            user: {
              id: userId
            },
            work: {
              id: id
            },
          }
        });
        setIsFavorite(false);
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: title ? `Favorite Removed: ${title?.trim()}` : `Favorite Removed`,
            type: ENotificationTypes.SUCCESS
          }
        });
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error removing favorite, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
      };
    };
  };

  const handleChangeFavorite = async (favorite: boolean) => {
    if (id !== null && userId !== null) {
      try {
        setIsLoadingFavorites(true);
        setIsSubmitAllowed(false);
        const { data } = await api.get(
          `favorites?pagination[page]=1&pagination[pageSize]=1&populate[work][fields][0]=title&populate[user][fields][1]=email&filters[user][id][$eq]=${userId}&filters[work][id][$eq]=${id}`
        );
        if (data !== null && data !== undefined && data.data.length > 0 && data.data[0].id) {
          if (!favorite) {
            handleRemoveFavorite(data.data[0].id.toString());
          } else {
            setIsFavorite(true);
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: title ? `Favorite Added: ${title?.trim()}` : `Favorite Added`,
                type: ENotificationTypes.SUCCESS
              }
            });
          }
        } else {
          if (favorite) {
            handleAddFavorite();
          } else {
            setIsFavorite(false);
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: title ? `Favorite Removed: ${title?.trim()}` : `Favorite Removed`,
                type: ENotificationTypes.SUCCESS
              }
            });
          }
        };
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error updating favorite, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: error?.response?.data.error?.message,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
        setIsSubmitAllowed(true);
      };
    };
  };

  const handleChangeOrder = async (newOrder: number) => {
    if (id !== null && userId !== null && listWorkId !== null && order !== null && newOrder !== null) {
      if (newOrder < 1 || newOrder > 999) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: 'Order must be between 1 and 999.',
            type: ENotificationTypes.ERROR
          }
        });
        return;
      };
      try {
        setIsLoadingFavorites(true);
        setIsSubmitAllowed(false);
        const { data } = await api.put(
          `list-works/${listWorkId}`, {
          data: {
            order: newOrder,
          }
        }
        );
        if (data !== null && data !== undefined) {
          setOrderId(newOrder);
          if (listWorkId !== undefined) {
            onOrderChange && onOrderChange(listWorkId, newOrder); // Call the callback function to update the order in the parent component
          }
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error updating order, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        };
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error updating order, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error updating order (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
        setIsSubmitAllowed(true);
      };
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error updating order, please try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleChangeNotes = async (newNotes: string) => {
    if (id !== null && userId !== null && listWorkId !== null && order !== null && newNotes !== null) {
      try {
        setIsLoadingFavorites(true);
        setIsSubmitAllowed(false);
        const { data } = await api.put(
          `list-works/${listWorkId}`, {
          data: {
            notes: newNotes,
          }
        }
        );
        if (data !== null && data !== undefined) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Note updated`,
              type: ENotificationTypes.SUCCESS
            }
          });
          setNotesValue(newNotes);
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error updating note, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        };
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error updating note, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error updating note (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setIsLoadingFavorites(false);
        setIsSubmitAllowed(true);
      };
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error updating note, please try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleRemoveListItemStart = async (listWorkId: number) => {
    if (listWorkId !== null && listWorkId !== undefined) {
      setIsRemovingListItemFrameOpen(true);
      setTimeout(() => {
        const undoRemovalLink = document.getElementById(`undo-list-removal-${id}`);
        if (undoRemovalLink) {
          undoRemovalLink.focus();
        }
      }, 0);
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error removing piece from list, please try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleRemoveListItemFollowThrough = async (listWorkId: number) => {
    if (listWorkId !== null || listWorkId !== undefined) {
      onRemoveListItem && onRemoveListItem(listWorkId);
      setIsRemovingListItemFrameOpen(false);
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error removing piece from list, please try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleRemoveFavoriteItemStart = async () => {
    if (favId !== null && favId !== undefined) {
      setIsRemovingFavoriteItemFrameOpen(true);
      setTimeout(() => {
        const undoRemovalLink = document.getElementById(`undo-fav-removal-${id}`);
        if (undoRemovalLink) {
          undoRemovalLink.focus();
        }
      }, 0);
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error removing piece from favorites, please try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  const handleRemoveFavoriteItemFollowThrough = async () => {
    if (favId !== null || favId !== undefined) {
      if (favId !== null) {
        onRemoveFavoriteItem && onRemoveFavoriteItem(Number(id), favId);
      }
      setIsRemovingFavoriteItemFrameOpen(false);
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error removing piece from favorites, please try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  return (
    <>
      {isRemovingListItemFrameOpen == true ? (
        <div
          className={cn(
            'z-10 absolute inset-0 flex flex-col justify-center items-center bg-pmdGrayLight bg-opacity-75 backdrop-blur-sm border border-pmdGrayLight rounded-t-md text-center align-middle',
            { '!rounded-none': isMobile }
          )}
        >
          <div className='flex flex-col justify-center items-center gap-4 p-4 w-full text-center align-middle'>
            <h3 className='font-medium text-red-500 text-center'>
              {titleText}
            </h3>
            <p className='text-lg text-center'>
              Are you sure you want to remove this piece?
            </p>
            <div className='flex flex-wrap justify-center items-center gap-4'>
              <a
                id={`continue-list-removal-${id}`}
                tabIndex={0}
                title='Proceed with Removal'
                className='bg-[#f0f0f0] hover:!bg-[#eeeeee] focus:bg-[#f7f7f7] active:bg-[#f7f7f7] px-4 py-2 border border-red-500 hover:!border-red-300 focus:border-red-700 active:border-red-700 rounded-md text-red-500 hover:!text-red-300 focus:text-red-700 active:text-red-700 !no-underline cursor-pointer'
                onClick={() => {
                  setTimeout(() => {
                    handleRemoveListItemFollowThrough(listWorkId ? listWorkId : 0);
                  }, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setTimeout(() => {
                      handleRemoveListItemFollowThrough(listWorkId ? listWorkId : 0);
                    }, 0);
                  }
                }}
              >Remove Piece</a>
              <a
                id={`undo-list-removal-${id}`}
                tabIndex={0}
                title='Undo Removal'
                className='bg-[#f0f0f0] hover:!bg-[#eeeeee] focus:bg-[#f7f7f7] active:bg-[#f7f7f7] px-4 py-2 border border-green-500 hover:!border-green-300 focus:border-green-700 active:border-green-700 rounded-md text-green-500 hover:!text-green-300 focus:text-green-700 active:text-green-700 !no-underline cursor-pointer'
                onClick={() => {
                  setTimeout(() => {
                    setIsRemovingListItemFrameOpen(false);
                  }, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setTimeout(() => {
                      setIsRemovingListItemFrameOpen(false);
                    }, 0);
                  }
                }}
              >Keep Piece</a>
            </div>
          </div>
        </div>
      ) : ''}
      {isRemovingFavoriteItemFrameOpen == true ? (
        <div
          className={cn(
            'z-10 absolute inset-0 flex flex-col justify-center items-center bg-pmdGrayLight bg-opacity-75 backdrop-blur-sm border border-pmdGrayLight rounded-t-md text-center align-middle',
            { '!rounded-none': isMobile }
          )}
        >
          <div className='flex flex-col justify-center items-center gap-4 p-4 w-full text-center align-middle'>
            <h3 className='font-medium text-red-500 text-center'>
              {titleText}
            </h3>
            <p className='text-lg text-center'>
              Are you sure you want to unfavorite this piece?
            </p>
            <div className='flex flex-wrap justify-center items-center gap-4'>
              <a
                id={`continue-fav-removal-${id}`}
                tabIndex={0}
                title='Proceed with Unfavorite'
                className='bg-[#f0f0f0] hover:!bg-[#eeeeee] focus:bg-[#f7f7f7] active:bg-[#f7f7f7] px-4 py-2 border border-red-500 hover:!border-red-300 focus:border-red-700 active:border-red-700 rounded-md text-red-500 hover:!text-red-300 focus:text-red-700 active:text-red-700 !no-underline cursor-pointer'
                onClick={() => {
                  setTimeout(() => {
                    handleRemoveFavoriteItemFollowThrough();
                  }, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setTimeout(() => {
                      handleRemoveFavoriteItemFollowThrough();
                    }, 0);
                  }
                }}
              >Unfavorite Piece</a>
              <a
                id={`undo-fav-removal-${id}`}
                tabIndex={0}
                title='Do Not Unfavorite'
                className='bg-[#f0f0f0] hover:!bg-[#eeeeee] focus:bg-[#f7f7f7] active:bg-[#f7f7f7] px-4 py-2 border border-green-500 hover:!border-green-300 focus:border-green-700 active:border-green-700 rounded-md text-green-500 hover:!text-green-300 focus:text-green-700 active:text-green-700 !no-underline cursor-pointer'
                onClick={() => {
                  setTimeout(() => {
                    setIsRemovingFavoriteItemFrameOpen(false);
                  }, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setTimeout(() => {
                      setIsRemovingFavoriteItemFrameOpen(false);
                    }, 0);
                  }
                }}
              >Do Not Unfavorite</a>
            </div>
          </div>
        </div>
      ) : ''}
      {isMobile ? (
        <div key={`work${id.toString()}`} id={`work${id}`} className='flex flex-row items-stretch gap-0 even:bg-white odd:bg-pmdGrayBright border-pmdGrayLight border-b w-full grow'>
          <div className='flex flex-col justify-start items-stretch gap-0 w-full text-sm text-left align-middle grow'>
            <Link href={workURL}>
              <a
                className='flex justify-end items-stretch hover:bg-pmdGrayLight focus:bg-pmdGray px-1 min-[333px]:px-4 pt-5 pb-4 w-full !text-pmdGrayDark !no-underline cursor-pointer grow'
                title={`${titleText} by ${composerText}`}
              >
                <div className='flex flex-col flex-1 justify-center items-center w-full text-sm text-center grow'>
                  <div className='flex justify-center items-stretch w-full font-bold text-xl grow'>{titleText}</div>
                  <div className='mt-[12px] text-lg'>{composerText}</div>
                  <div className='flex mt-[12px]'>
                    <div
                      className="after:top-[-1px] after:right-0 after:absolute relative after:bg-pmdGray pr-3 after:w-px after:h-full after:content-[']"
                    >
                      {level ? (<span>{level} Level</span>) : <span><em>Level N/A</em></span>}
                    </div>
                    {eras ?
                      (typeof eras === 'object' && eras?.length ? (
                        <p className='ml-3'>
                          {eras?.map((era, i) => (
                            <span key={era}>
                              {era}
                              {eras?.length ? (
                                eras?.length > 3 ? (
                                  i < eras?.length - 2 ? ', ' : i < eras?.length - 1 ? ', and ' : null
                                ) :
                                  eras?.length < 2 ? '' : i < eras?.length - 1 ? ' and ' : null
                              ) : ''}
                            </span>
                          ))} {eras?.length > 1 ? 'Eras' : 'Era'}</p>
                      ) : (eras ? (<span>{`${eras} Era`}</span>) : '')) : ''}
                  </div>
                </div>
              </a>
            </Link>
            {notesValue ? (
              (isOwner || isUser) ? (
                <div className='relative justify-start items-start border-pmdGrayLight border-t w-full h-full text-sm text-left align-middle cursor-text'>
                  {!isEditing ? (
                    <a
                      tabIndex={0}
                      title={`Edit this note`}
                      className='flex px-4 pt-2 pb-3 w-full h-full text-pmdGray hover:text-pmdGrayDark !no-underline'
                      onClick={() => {
                        setIsEditing(true);
                        setTimeout(() => {
                          const noteInput = document.getElementById(`note-input-${id}`) as HTMLTextAreaElement;
                          if (noteInput) {
                            noteInput.focus();
                            noteInput.setSelectionRange(noteInput.value.length, noteInput.value.length); // Set cursor at the end
                          }
                        }, 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setIsEditing(true);
                          setTimeout(() => {
                            const noteInput = document.getElementById(`note-input-${id}`) as HTMLTextAreaElement;
                            if (noteInput) {
                              noteInput.focus();
                              noteInput.setSelectionRange(noteInput.value.length, noteInput.value.length); // Set cursor at the end
                            }
                          }, 0);
                        }
                      }}
                    >
                      <p>{notesValue}</p>
                    </a>
                  ) : (
                    <div className='flex flex-row gap-2 p-2'>
                      <textarea
                        id={`note-input-${id}`}
                        name={`note-input-${id}`}
                        className='flex bg-transparent px-4 pt-2 pb-3 border-none outline-none w-full h-full'
                        value={notesValue ? notesValue : ''}
                        onChange={(e) => setNotesValue(e.target.value)}
                      />
                      <div className='flex flex-col gap-2 grow'>
                        <div className='flex flex-row gap-2 w-full h-full'>
                          <button
                            type='button'
                            className='bg-green-500 p-1 rounded w-[25px] h-[25px] text-white'
                            onClick={() => {
                              handleChangeNotes(notesValue ? notesValue : '');
                              setNotesValue(notesValue);
                              setNotesValueOld(notesValue);
                              setIsEditing(false);
                            }}
                          >
                            ✔
                          </button>
                          <button
                            type='button'
                            className='bg-red-500 p-1 rounded w-[25px] h-[25px] text-white'
                            onClick={() => {
                              setNotesValue(notesValueOld ? notesValueOld : null);
                              setIsEditing(false);
                            }}
                          >
                            ✖
                          </button>
                        </div>
                        <div className='flex justify-end mt-1 text-pmdGray text-sm'>
                          <p>{notesValue ? notesValue.length : 0}/255</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className='justify-start items-start px-4 pt-2 pb-3 border-pmdGrayLight border-t w-full h-full overflow-y-auto text-pmdGray hover:text-pmdGrayDark text-sm text-left align-middle cursor-text'>
                  <p>{notesValue ? notesValue : notes ? notes : ''}</p>
                </div>
              )
            ) : (
              (isOwner || isUser) ? (
                <div className='relative justify-start items-start border-pmdGrayLight border-t w-full h-full text-sm text-left align-middle cursor-text'>
                  {!isEditing ? (
                    <a
                      tabIndex={0}
                      title={`Add a note to ${titleText}`}
                      className='flex px-4 pt-2 pb-3 w-full h-full text-pmdGray hover:text-pmdGrayDark !no-underline'
                      onClick={() => {
                        setIsEditing(true);
                        setTimeout(() => {
                          const noteInput = document.getElementById(`note-input-${id}`) as HTMLTextAreaElement;
                          if (noteInput) {
                            noteInput.focus();
                            noteInput.setSelectionRange(noteInput.value.length, noteInput.value.length); // Set cursor at the end
                          }
                        }, 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setIsEditing(true);
                          setTimeout(() => {
                            const noteInput = document.getElementById(`note-input-${id}`) as HTMLTextAreaElement;
                            if (noteInput) {
                              noteInput.focus();
                              noteInput.setSelectionRange(noteInput.value.length, noteInput.value.length); // Set cursor at the end
                            }
                          }, 0);
                        }
                      }}
                    >
                      <p><em>No Note Yet!</em> <br />Click here to add a note.</p>
                    </a>
                  ) : (
                    <div className='flex flex-row gap-2 p-2'>
                      <textarea
                        id={`note-input-${id}`}
                        name={`note-input-${id}`}
                        className='flex bg-transparent px-4 pt-2 pb-3 border-none outline-none w-full h-full'
                        value={notesValue ? notesValue : ''}
                        onChange={(e) => setNotesValue(e.target.value)}
                      />
                      <div className='flex flex-col gap-2 grow'>
                        <div className='flex flex-row gap-2 w-full h-full'>
                          <button
                            className='bg-green-500 p-1 rounded w-[25px] h-[25px] text-white'
                            onClick={() => {
                              handleChangeNotes(notesValue ? notesValue : '');
                              setNotesValueOld(notesValue);
                              setIsEditing(false);
                            }}
                          >
                            ✔
                          </button>
                          <button
                            className='bg-red-500 p-1 rounded w-[25px] h-[25px] text-white'
                            onClick={() => {
                              setNotesValue(notesValueOld ? notesValueOld : null);
                              setIsEditing(false);
                            }}
                          >
                            ✖
                          </button>
                        </div>
                        <div className='flex justify-end mt-1 text-pmdGray text-sm'>
                          <p>{notesValue ? notesValue.length : 0}/255</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                notesValue || notes ? (
                  <div className='justify-start items-start px-4 pt-2 pb-3 border-pmdGrayLight border-t w-full h-full text-pmdGray hover:text-pmdGrayDark text-sm text-left align-middle cursor-text'>
                    <p>{notesValue ? notesValue : notes ? notes : ''}</p>
                  </div>
                ) : ''
              )
            )}
          </div>
          {userId ? (
            <div className='flex flex-col justify-center items-center gap-4 py-2 border-pmdGrayLight border-l w-min min-w-[64px] max-w-[64px] text-center align-middle shrink'>
              <div className='flex flex-col justify-center items-center gap-2 text-sm text-center align-middle shrink'>
                <div className='flex justify-center items-center w-full min-w-[50px] max-w-[50px] h-full align-middle'>
                  {isLoadingFavorites ? (
                    <svg
                      className='w-7 h-7 text-pmdRed animate-spin'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                  ) : (
                    isFavorite ? (
                      isFavPage ? (
                        <div className='flex justify-center items-center w-full h-full align-middle'>
                          <a
                            title={'Unfavorite ' + titleText} className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                            onClick={() => favId !== undefined && handleRemoveFavoriteItemStart()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                favId !== undefined && handleRemoveFavoriteItemStart();
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext src={IconHeartFilled} alt='' height={28} width={28} />
                          </a>
                        </div>
                      ) : (
                        <div className='flex justify-center items-center w-full h-full align-middle'>
                          <a
                            title={'Unfavorite ' + titleText} className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                            onClick={() => {
                              isSubmitFavoriteAllowed == true && handleChangeFavorite(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                isSubmitFavoriteAllowed == true && handleChangeFavorite(false);
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext src={IconHeartFilled} alt='' height={28} width={28} />
                          </a>
                        </div>
                      )
                    ) : (
                      <div className='flex justify-center items-center w-full h-full align-middle'>
                        <a
                          title={'Favorite ' + titleText}
                          className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                          onClick={() => {
                            isSubmitFavoriteAllowed == true && handleChangeFavorite(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              isSubmitFavoriteAllowed == true && handleChangeFavorite(true);
                            }
                          }}
                          tabIndex={0}
                        >
                          <ImageNext src={IconHeart} alt='' height={28} width={28} />
                        </a>
                      </div>
                    )
                  )}
                </div>
                <div className='flex justify-center items-center py-2 w-full min-w-[50px] max-w-[50px] h-full align-middle'>
                  <div className='flex justify-center items-center w-full h-full align-middle'>
                    <a
                      tabIndex={0}
                      className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                      title='Add to List'
                      aria-label='Add to List'
                      aria-haspopup='dialog'
                      aria-expanded={isOpenModalListAddTo}
                      aria-controls={'ModalListAddTo' + id}
                      onClick={handleIsOpenModalListAddTo}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleIsOpenModalListAddTo();
                        }
                      }}
                    >
                      <ImageNext src={IconBookmark} alt='' height={28} width={28} />
                    </a>
                    <ModalListAddTo
                      workId={id}
                      workTitle={titleText}
                      isOpen={isOpenModalListAddTo}
                      onClose={handleIsOpenModalListAddTo}
                    />
                  </div>
                </div>
              </div>
              {(isOwner || isUser) ? (
                <div className='flex flex-col justify-center items-center gap-4 pt-3 border-pmdGrayLight border-t text-center align-middle'>
                  {orderId ? (
                    <div className='flex flex-col justify-center items-center gap-2 pb-3 border-pmdGrayLight border-b text-sm text-left align-middle'>
                      <div className='flex flex-col justify-center items-center gap-1 text-sm text-left align-middle'>
                        <p className='text-pmdGray'>Order</p>
                        <div
                          className='justify-center items-center bg-pmdGrayLight py-3 rounded-md w-12 font-bold !text-[#858585] text-center align-middle'
                        >
                          <p>{orderId}</p>
                        </div>
                      </div>
                      <div className='flex flex-col justify-center items-stretch gap-0 text-sm text-left align-middle'>
                        <a
                          title='Move Up'
                          tabIndex={0}
                          className={cn(
                            '!px-2 !py-0 !rounded-t-md !rounded-b-none border-b cursor-pointer button',
                            { '!bg-[#cfb1b1] !cursor-not-allowed !pointer-events-none': orderId <= 1 }
                          )}
                          onClick={() => handleChangeOrder(orderId - 1)}
                        >
                          ↑
                        </a>
                        <a
                          title='Move Down'
                          tabIndex={0}
                          className={cn(
                            '!px-2 !py-0 !rounded-b-md !rounded-t-none border-pmdGray cursor-pointer button',
                            { '!bg-[#cfb1b1] !cursor-not-allowed !pointer-events-none': orderId >= 999 }
                          )}
                          onClick={() => handleChangeOrder(orderId + 1)}
                        >
                          ↓
                        </a>
                      </div>
                    </div>
                  ) : ''}
                  <div className='flex justify-center items-center w-full text-center align-middle'>
                    <a
                      tabIndex={0}
                      title='Remove piece from this list'
                      className='disabled:bg-[#cfb1b1] !px-1 !pt-1 !pb-0.5 rounded-md w-14 !font-medium cursor-pointer disabled:cursor-not-allowed button'
                      onClick={() => listWorkId !== undefined && handleRemoveListItemStart(listWorkId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          listWorkId !== undefined && handleRemoveListItemStart(listWorkId);
                        }
                      }}
                    >
                      <div className='min-w-3 min-h-3'><ImageNext src={IconDeleteWhite} alt='' height={12} width={12} /></div>
                      <p className='text-xs'>Remove</p>
                    </a>
                  </div>
                </div>
              ) : ''}
            </div>
          ) : ''}
        </div>
      ) : (
        <div key={`work${id.toString()}`} id={`work${id}`} className='group flex flex-row gap-0 even:bg-white odd:bg-pmdGrayBright border-pmdGrayLight border-b'>
          <div className='flex flex-col justify-start items-start gap-0 w-full text-sm text-left align-middle'>
            {notesValue ? (
              <>
                <Link href={workURL}>
                  <a
                    className='flex justify-end hover:bg-pmdGrayLight focus:bg-pmdGray px-4 pt-4 pb-3.5 w-full h-min !text-pmdGrayDark !no-underline align-middle cursor-pointer'
                    title={`${titleText} by ${composerText}`}
                  >
                    <div className='flex flex-row flex-1 gap-4 text-sm text-left align-middle'>
                      {accountData.id ? (
                        <div className='w-full min-w-[230px] max-w-[230px] font-bold text-lg'>{titleText}</div>
                      ) : (
                        <div className='w-full min-w-[230px] font-bold text-lg'>{titleText}</div>
                      )}
                      <div className='min-w-[165px] max-w-[165px]'>{composerText}</div>
                      <span className='min-w-[110px] max-w-[110px]'>{level && level}</span>
                      {eras ?
                        (typeof eras === 'object' && eras?.length ? (
                          <span className='min-w-[100px] max-w-[100px]'>
                            {eras?.map((era, i) => (
                              <span key={era}>
                                {era}
                                {eras?.length ? (
                                  eras?.length > 3 ? (
                                    i < eras?.length - 2 ? ', ' : i < eras?.length - 1 ? ', and ' : null
                                  ) :
                                    eras?.length < 2 ? '' : i < eras?.length - 1 ? ' and ' : null
                                ) : ''}
                              </span>
                            ))}</span>
                        ) : (eras ? (<span>{`${eras}`}</span>) : '')) : ''}
                    </div>
                  </a>
                </Link>
                {(isOwner || isUser) ? (
                  <div className='relative justify-start items-start border-pmdGrayLight border-t w-full h-full text-sm text-left align-middle cursor-text'>
                    {!isEditing ? (
                      <a
                        tabIndex={0}
                        title={`Edit this note`}
                        className='flex px-4 pt-2 pb-3 w-full h-full text-pmdGray hover:text-pmdGrayDark !no-underline'
                        onClick={() => {
                          setIsEditing(true);
                          setTimeout(() => {
                            const noteInput = document.getElementById(`note-input-${id}`) as HTMLTextAreaElement;
                            if (noteInput) {
                              noteInput.focus();
                              noteInput.setSelectionRange(noteInput.value.length, noteInput.value.length); // Set cursor at the end
                            }
                          }, 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setIsEditing(true);
                            setTimeout(() => {
                              const noteInput = document.getElementById(`note-input-${id}`) as HTMLTextAreaElement;
                              if (noteInput) {
                                noteInput.focus();
                                noteInput.setSelectionRange(noteInput.value.length, noteInput.value.length); // Set cursor at the end
                              }
                            }, 0);
                          }
                        }}
                      >
                        <p>{notesValue}</p>
                      </a>
                    ) : (
                      <div className='flex flex-row gap-2 p-2'>
                        <textarea
                          id={`note-input-${id}`}
                          name={`note-input-${id}`}
                          className='flex bg-transparent px-4 pt-2 pb-3 border-none outline-none w-full h-full'
                          value={notesValue ? notesValue : ''}
                          onChange={(e) => setNotesValue(e.target.value)}
                        />
                        <div className='flex flex-col gap-2 grow'>
                          <div className='flex flex-row gap-2 w-full h-full'>
                            <button
                              className='bg-green-500 p-1 rounded w-[25px] h-[25px] text-white'
                              onClick={() => {
                                handleChangeNotes(notesValue ? notesValue : '');
                                setNotesValue(notesValue);
                                setNotesValueOld(notesValue);
                                setIsEditing(false);
                              }}
                            >
                              ✔
                            </button>
                            <button
                              className='bg-red-500 p-1 rounded w-[25px] h-[25px] text-white'
                              onClick={() => {
                                setNotesValue(notesValueOld ? notesValueOld : null);
                                setIsEditing(false);
                              }}
                            >
                              ✖
                            </button>
                          </div>
                          <div className='flex justify-end mt-1 text-pmdGray text-sm'>
                            <p>{notesValue ? notesValue.length : 0}/255</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='justify-start items-start px-4 pt-2 pb-3 border-pmdGrayLight border-t w-full h-full overflow-y-auto text-pmdGray hover:text-pmdGrayDark text-sm text-left align-middle cursor-text'>
                    <p>{notesValue}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href={workURL}>
                  <a
                    className='flex justify-end hover:bg-pmdGrayLight focus:bg-pmdGray px-4 pt-4 pb-3.5 w-full h-full !text-pmdGrayDark !no-underline align-middle cursor-pointer'
                    title={`${titleText} by ${composerText}`}
                  >
                    <div className='flex flex-row flex-1 gap-4 text-sm text-left align-middle'>
                      {accountData.id ? (
                        <div className='w-full min-w-[230px] max-w-[230px] font-bold text-lg'>{titleText}</div>
                      ) : (
                        <div className='w-full min-w-[230px] max-w-[230px] font-bold text-lg'>{titleText}</div>
                      )}
                      <div className='min-w-[165px] max-w-[165px]'>{composerText}</div>
                      <span className='min-w-[110px] max-w-[110px]'>{level && level}</span>
                      {eras ?
                        (typeof eras === 'object' && eras?.length ? (
                          <span className='min-w-[100px] max-w-[100px]'>
                            {eras?.map((era, i) => (
                              <span key={era}>
                                {era}
                                {eras?.length ? (
                                  eras?.length > 3 ? (
                                    i < eras?.length - 2 ? ', ' : i < eras?.length - 1 ? ', and ' : null
                                  ) :
                                    eras?.length < 2 ? '' : i < eras?.length - 1 ? ' and ' : null
                                ) : ''}
                              </span>
                            ))}</span>
                        ) : (eras ? (<span>{`${eras}`}</span>) : '')) : ''}
                    </div>
                  </a>
                </Link>
                {(isOwner || isUser) ? (
                  <div className='relative justify-start items-start border-pmdGrayLight border-t w-full h-full text-sm text-left align-middle cursor-text'>
                    {!isEditing ? (
                      <a
                        tabIndex={0}
                        title={`Add a note to ${titleText}`}
                        className='flex px-4 pt-2 pb-3 text-pmdGray hover:text-pmdGrayDark !no-underline'
                        onClick={() => {
                          setIsEditing(true);
                          setTimeout(() => {
                            const noteInput = document.getElementById(`note-input-${id}`);
                            noteInput?.focus();
                          }, 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setIsEditing(true);
                            setTimeout(() => {
                              const noteInput = document.getElementById(`note-input-${id}`);
                              noteInput?.focus();
                            }, 0);
                          }
                        }}
                      >
                        <p><em>No Note Yet!</em> <br />Click here to add a note.</p>
                      </a>
                    ) : (
                      <div className='flex flex-row gap-2 p-2'>
                        <textarea
                          id={`note-input-${id}`}
                          name={`note-input-${id}`}
                          className='flex bg-transparent px-4 pt-2 pb-3 border-none outline-none w-full h-full'
                          value={notesValue ? notesValue : ''}
                          onChange={(e) => setNotesValue(e.target.value)}
                        />
                        <div className='flex flex-col gap-2 grow'>
                          <div className='flex flex-row gap-2 w-full h-full'>
                            <button
                              className='bg-green-500 p-1 rounded w-[25px] h-[25px] text-white'
                              onClick={() => {
                                handleChangeNotes(notesValue ? notesValue : '');
                                setNotesValue(notesValue);
                                setNotesValueOld(notesValue);
                                setIsEditing(false);
                              }}
                            >
                              ✔
                            </button>
                            <button
                              className='bg-red-500 p-1 rounded w-[25px] h-[25px] text-white'
                              onClick={() => {
                                setNotesValue(notesValueOld ? notesValueOld : null);
                                setIsEditing(false);
                              }}
                            >
                              ✖
                            </button>
                          </div>
                          <div className='flex justify-end mt-1 text-pmdGray text-sm'>
                            <p>{notesValue ? notesValue.length : 0}/255</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  notesValue || notes ? (
                    <div className='justify-start items-start px-4 pt-2 pb-3 border-pmdGrayLight border-t w-full h-full text-pmdGray hover:text-pmdGrayDark text-sm text-left align-middle cursor-text'>
                      <p>{notesValue ? notesValue : notes ? notes : ''}</p>
                    </div>
                  ) : ''
                )}
              </>
            )}
          </div>
          {userId ? (
            <div
              className={cn(
                'flex flex-col justify-center items-center gap-2 border-pmdGrayLight border-l w-min min-w-[128px] max-w-[128px] text-center align-middle shrink',
                { 'pb-4': (isOwner || isUser) && orderId }
              )}
            >
              <div className='flex flex-row justify-center items-center gap-2 text-sm text-center align-middle shrink'>
                <div className='flex justify-center items-center w-full min-w-[50px] max-w-[50px] h-full align-middle'>
                  {isLoadingFavorites ? (
                    <svg
                      className='w-7 h-7 text-pmdRed animate-spin'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                  ) : (
                    isFavorite ? (
                      isFavPage ? (
                        <div className='flex justify-center items-center w-full h-full align-middle'>
                          <a
                            title={'Unfavorite ' + titleText} className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                            onClick={() => favId !== undefined && handleRemoveFavoriteItemStart()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                favId !== undefined && handleRemoveFavoriteItemStart();
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext src={IconHeartFilled} alt='' height={28} width={28} />
                          </a>
                        </div>
                      ) : (
                        <div className='flex justify-center items-center w-full h-full align-middle'>
                          <a
                            title={'Unfavorite ' + titleText} className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                            onClick={() => {
                              isSubmitFavoriteAllowed == true && handleChangeFavorite(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                isSubmitFavoriteAllowed == true && handleChangeFavorite(false);
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext src={IconHeartFilled} alt='' height={28} width={28} />
                          </a>
                        </div>
                      )
                    ) : (
                      <div className='flex justify-center items-center w-full h-full align-middle'>
                        <a
                          title={'Favorite ' + titleText}
                          className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                          onClick={() => {
                            isSubmitFavoriteAllowed == true && handleChangeFavorite(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              isSubmitFavoriteAllowed == true && handleChangeFavorite(true);
                            }
                          }}
                          tabIndex={0}
                        >
                          <ImageNext src={IconHeart} alt='' height={28} width={28} />
                        </a>
                      </div>
                    )
                  )}
                </div>
                <div className='flex justify-center items-center py-2 w-full min-w-[50px] max-w-[50px] h-full align-middle'>
                  <div className='flex justify-center items-center w-full h-full align-middle'>
                    <a
                      tabIndex={0}
                      className='flex justify-center items-center hover:opacity-75 focus:opacity-75 p-2 w-full h-full align-middle cursor-pointer'
                      title='Add to List'
                      aria-label='Add to List'
                      aria-haspopup='dialog'
                      aria-expanded={isOpenModalListAddTo}
                      aria-controls={'ModalListAddTo' + id}
                      onClick={handleIsOpenModalListAddTo}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleIsOpenModalListAddTo();
                        }
                      }}
                    >
                      <ImageNext src={IconBookmark} alt='' height={28} width={28} />
                    </a>
                    <ModalListAddTo
                      workId={id}
                      workTitle={titleText}
                      isOpen={isOpenModalListAddTo}
                      onClose={handleIsOpenModalListAddTo}
                    />
                  </div>
                </div>
              </div>
              {(isOwner || isUser) ? (
                <div className='flex flex-col justify-center items-center gap-4 pt-3 border-pmdGrayLight border-t text-center align-middle'>
                  {orderId ? (
                    <div className='flex justify-center items-center gap-2 text-sm text-left align-middle'>
                      <div className='flex flex-col justify-center items-center gap-1 text-sm text-left align-middle'>
                        <p className='text-pmdGray'>Order</p>
                        <div
                          className='justify-center items-center bg-pmdGrayLight px-2 py-3 rounded-md w-12 font-bold !text-[#858585] text-center align-middle'
                        >
                          <p>{orderId}</p>
                        </div>
                      </div>
                      <div className='flex flex-col justify-center items-stretch gap-0 text-sm text-left align-middle'>
                        <a
                          title='Move Up'
                          tabIndex={0}
                          className={cn(
                            '!px-2 !py-0 !rounded-t-md !rounded-b-none border-b cursor-pointer button',
                            { '!bg-[#cfb1b1] !cursor-not-allowed !pointer-events-none': orderId <= 1 }
                          )}
                          onClick={() => handleChangeOrder(orderId - 1)}
                        >
                          ↑
                        </a>
                        <a
                          title='Move Down'
                          tabIndex={0}
                          className={cn(
                            '!px-2 !py-0 !rounded-b-md !rounded-t-none border-pmdGray cursor-pointer button',
                            { '!bg-[#cfb1b1] !cursor-not-allowed !pointer-events-none': orderId >= 999 }
                          )}
                          onClick={() => handleChangeOrder(orderId + 1)}
                        >
                          ↓
                        </a>
                      </div>
                    </div>
                  ) : ''}
                  <div className='flex justify-center items-center px-2 w-full text-center align-middle'>
                    <a
                      tabIndex={0}
                      title='Remove piece from this list'
                      className='!flex !flex-row justify-center items-center gap-2 disabled:bg-[#cfb1b1] !px-2 !pt-2 !pb-2 rounded-md w-full !font-medium text-center align-middle cursor-pointer disabled:cursor-not-allowed button'
                      onClick={() => listWorkId !== undefined && handleRemoveListItemStart(listWorkId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          listWorkId !== undefined && handleRemoveListItemStart(listWorkId);
                        }
                      }}
                    >
                      <div className='min-w-4 min-h-4'><ImageNext src={IconDeleteWhite} alt='' height={16} width={16} /></div>
                      <p className='text-xs'>Remove</p>
                    </a>
                  </div>
                </div>
              ) : ''}
            </div>
          ) : ''}
        </div>
      )}
    </>
  );
};

export default TableRowWork;
