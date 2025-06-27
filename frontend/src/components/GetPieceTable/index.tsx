import { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import Works from "@src/components/Works";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiPiece,
} from "@src/types";

interface IGetPieceTableProps {
  workIds: string | null;
}

export const GetPieceTable: FC<IGetPieceTableProps> = ({
  workIds,
}): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [pieces, setPieces] = useState<IStrapiPiece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(false);

  useEffect(() => {
    const getAPIPieces = async () => {
      try {
        setIsLoadingPieces(true);
        const fetchedData = [];
        const { data } = await api.get(
          `works?pagination[page]=1&pagination[pageSize]=${workIds ? workIds.split(",").length : "1"}&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title${
            workIds
              ? workIds
                  .split(",")
                  .map(
                    (id: string) => `&filters[$and][0][id][$eq]=${id.trim()}`,
                  )
                  .join("")
              : "0"
          }&publicationState=preview`,
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
              `works?pagination[page]=${i}&pagination[pageSize]=${workIds ? workIds.split(",").length : "1"}&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&fields[0]=title${
                workIds
                  ? workIds
                      .split(",")
                      .map(
                        (id: string) =>
                          `&filters[$and][0][id][$eq]=${id.trim()}`,
                      )
                      .join("")
                  : "0"
              }&publicationState=preview`,
            );
            fetchedData.push(...response.data.data);
          }
        }
        const sortedPieces = fetchedData.sort((a, b) => {
          const ids = workIds ? workIds.split(",") : [];
          return ids.indexOf(a.id.toString()) - ids.indexOf(b.id.toString());
        });
        setPieces(sortedPieces);
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
        setPieces([]);
      } finally {
        setIsLoadingPieces(false);
      }
    };

    getAPIPieces();
  }, [workIds, dispatch]);

  return (
    <>
      {!isLoadingPieces && pieces && pieces.length > 0 && (
        <div className="flex flex-row flex-wrap justify-center items-center gap-3 my-4 w-full max-w-[1200px] md:max-w-[816px] text-center align-middle">
          <div className="mt-5 mb-4 px-1">
            <Works
              works={Object.values(pieces)
                .slice(0, 10)
                .map((piece) => ({
                  id: piece.id,
                  title: piece.attributes.title,
                  composers:
                    piece.attributes.composers?.data?.map(
                      (composer) => composer.attributes.name,
                    ) || null,
                  level: piece.attributes.level?.data?.attributes.title,
                  eras:
                    piece.attributes.eras?.data?.map(
                      (composer) => composer.attributes.name,
                    ) || null,
                }))}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GetPieceTable;
