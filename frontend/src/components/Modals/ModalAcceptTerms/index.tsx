import { useContext, FC, useEffect, useState } from "react";
import { AppContext } from "@src/state";
import Modal from "@src/components/Modal";
import ImageNext from "@src/components/ImageNext";
import { IconSearchRed } from "@src/common/assets/icons";
import api from "@src/api/config";
import { handleCleanContent } from "@src/api/helpers";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiPage,
} from "@src/types";

interface IModalAcceptTermsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAcceptTerms: FC<IModalAcceptTermsProps> = ({
  isOpen,
  onClose,
}): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [terms, setTerms] = useState<IStrapiPage[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);

  useEffect(() => {
    const getTerms = async () => {
      try {
        setIsLoadingTerms(true);
        const fetchedData = [];
        const { data } = await api.get(
          `pages?pagination[page]=1&pagination[pageSize]=1&filters[id][$in]=5`,
        );
        fetchedData.push(...data?.data);
        setTerms(fetchedData);
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
        setIsLoadingTerms(false);
      }
    };

    getTerms();
  }, [dispatch]);

  return (
    <Modal
      id="ModalListAddTo"
      onClose={onClose}
      isOpen={isOpen}
      layoutClassName="w-full h-auto max-h-screen mx-[20px] max-w-[420px] text-black text-center flex flex-col justify-center items-center"
      crossClassName="w-10 h-10 top-[9px] right-2"
    >
      <div className="flex justify-start items-center gap-3 py-4 pr-12 pl-5 w-full text-left align-middle">
        <ImageNext
          src={IconSearchRed}
          height={22}
          width={22}
          className="min-w-[22px] min-h-[22px]"
        />
        <p className="mr-4 text-pmdGrayDark">
          <strong>Accept Terms to Continue</strong>
        </p>
      </div>
      <div className="px-3 pt-6 pb-12 border-pmdGrayLight border-t max-h-screen overflow-y-auto scrollbar">
        <div className="flex flex-col justify-center items-center gap-4 w-full text-center align-middle">
          <p className="text-left">
            To access your account, first read through and accept these terms
            and conditions:
          </p>
          {isLoadingTerms ? (
            <p className="pt-2 pb-4">Loading terms...</p>
          ) : terms ? (
            <div className="flex flex-col gap-y-6 pt-2 pb-4">
              <div className="bg-pmdGrayBright shadow-musicCard px-2 pt-6 pb-8 rounded-md max-w-[1000px] min-h-60 max-h-[calc(90vh-300px)] overflow-y-auto text-left scrollbar">
                {terms[0]?.attributes.name ? (
                  <h1 className="mb-4">{terms[0]?.attributes.name}</h1>
                ) : (
                  ""
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: handleCleanContent(terms[0]?.attributes.content),
                  }}
                />
                {terms[0]?.attributes.showLastUpdated ? (
                  <p className="mt-12 text-pmdGray text-center italic">
                    These Terms were Last Updated on{" "}
                    {terms[0]?.attributes.updatedAt
                      .replace("T", " at ")
                      .replace("Z", " GMT")}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <p className="pt-2 pb-4">
              <em>Please wait for terms to load...</em>
            </p>
          )}
          <a
            title="I Have Read and Agreed the Terms and Conditions"
            className="mx-auto cursor-pointer button"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClose();
              }
            }}
            tabIndex={0}
          >
            I Have Read & Agreed to the Terms
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAcceptTerms;
