import { useContext, FC } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@src/state";
import cn from "classnames";
import Modal from "@src/components/Modal";
import ImageNext from "@src/components/ImageNext";
import { IconDelete } from "@src/common/assets/icons";
import api from "@src/api/config";
import { ENotificationActionTypes, ENotificationTypes } from "@src/types";
import { EUrlsPages } from "@src/constants";

interface IModalListDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listTitle: string;
}

const ModalListDelete: FC<IModalListDeleteProps> = ({
  isOpen,
  onClose,
  listId,
  listTitle,
}): JSX.Element => {
  const router = useRouter();
  const { dispatch } = useContext(AppContext);

  const handleRemove = async () => {
    if (listId !== null) {
      try {
        const { data } = await api.delete(`lists/${listId}`);
        if (data !== null && data !== undefined) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `List Deleted Successfully`,
              type: ENotificationTypes.SUCCESS,
            },
          });
          setTimeout(() => {
            router.push(`/${EUrlsPages.LISTS_CREATED}`, undefined, {
              shallow: false,
            });
          }, 500);
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: "Error deleting list, please try again.",
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
              message: "Error deleting list, please try again.",
              type: ENotificationTypes.ERROR,
            },
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error deleting list (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR,
            },
          });
        }
      }
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "Error deleting list, please refresh and try again.",
          type: ENotificationTypes.ERROR,
        },
      });
    }
  };

  return (
    <Modal
      id="ModalListDelete"
      onClose={onClose}
      isOpen={isOpen}
      layoutClassName="w-full h-auto max-h-screen mx-[20px] max-w-[500px] text-black text-center flex flex-col justify-center items-center"
      crossClassName="hidden"
    >
      <div className="flex gap-2 py-4 pr-12 pl-5">
        <ImageNext
          src={IconDelete}
          height={22}
          width={22}
          className="min-w-[22px] min-h-[22px]"
        />
        <p className="pt-1 text-pmdGrayDark">
          <strong>Delete List?</strong>
        </p>
      </div>
      <div className="px-[20px] pt-4 pb-8 border-pmdGrayLight border-t max-h-screen overflow-auto scrollbar">
        <div className="flex flex-col justify-center items-center gap-4 p-4 w-full text-center align-middle">
          {/* <h3 className='font-medium text-red-500 text-center'>
                        {listTitle}
                    </h3> */}
          <div className="flex max-[410px]:flex-col justify-between items-center gap-4 my-auto">
            <div className="min-[410px]:min-w-60 max-w-60 text-center">
              <h3
                className={cn(
                  "font-medium text-pmdRed max-[410px]:text-center",
                  {
                    "break-all": listTitle
                      .split(" ")
                      .some((word) => word.length > 8),
                  },
                )}
              >
                {listTitle.length > 20 ? `${listTitle}` : listTitle}
              </h3>
            </div>
          </div>
          <p className="text-lg text-center">
            Are you sure you want to delete this list?
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              id={`continue-list-deletion-${listId}`}
              tabIndex={0}
              title="Proceed with Deletion"
              className="bg-[#f0f0f0] hover:!bg-[#eeeeee] focus:bg-[#f7f7f7] active:bg-[#f7f7f7] px-4 py-2 border border-red-500 hover:!border-red-300 focus:border-red-700 active:border-red-700 rounded-md text-red-500 hover:!text-red-300 focus:text-red-700 active:text-red-700 !no-underline cursor-pointer"
              onClick={() => {
                setTimeout(() => {
                  handleRemove();
                }, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setTimeout(() => {
                    handleRemove();
                  }, 0);
                }
              }}
            >
              Delete List
            </a>
            <a
              id={`undo-list-deletion-${listId}`}
              tabIndex={0}
              title="Do Not Delete"
              className="bg-[#f0f0f0] hover:!bg-[#eeeeee] focus:bg-[#f7f7f7] active:bg-[#f7f7f7] px-4 py-2 border border-green-500 hover:!border-green-300 focus:border-green-700 active:border-green-700 rounded-md text-green-500 hover:!text-green-300 focus:text-green-700 active:text-green-700 !no-underline cursor-pointer"
              onClick={() => {
                setTimeout(() => {
                  onClose();
                }, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setTimeout(() => {
                    onClose();
                  }, 0);
                }
              }}
            >
              Keep List
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalListDelete;
