import { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import CardPiece from "@src/components/CardPiece";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiPiece,
} from "@src/types";

interface IGetPieceProps {
  workId: string | null;
}

export const GetPiece: FC<IGetPieceProps> = ({ workId }): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [pieces, setPieces] = useState<IStrapiPiece[]>([]);
  const [isLoadingPieces, setIsLoadingPieces] = useState(false);

  useEffect(() => {
    const getAPIPieces = async () => {
      try {
        setIsLoadingPieces(true);
        const fetchedData = [];
        const { data } = await api.get(
          `works?pagination[page]=1&pagination[pageSize]=4&sort[0]=popularPiecesIndex:asc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[scoreExcerpt][fields][2]=height&populate[scoreExcerpt][fields][3]=width&populate[scoreExcerpt][fields][4]=url&populate[image][fields][5]=height&populate[image][fields][6]=width&populate[image][fields][7]=url&populate[eras][fields][8]=name&fields[0]=title&fields[1]=popularPiecesIndex&filters[id][$eq]=${workId ? workId : "0"}`,
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
              `works?pagination[page]=${i}&pagination[pageSize]=4&sort[0]=popularPiecesIndex:asc&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[scoreExcerpt][fields][2]=height&populate[scoreExcerpt][fields][3]=width&populate[scoreExcerpt][fields][4]=url&populate[image][fields][5]=height&populate[image][fields][6]=width&populate[image][fields][7]=url&populate[eras][fields][8]=name&fields[0]=title&fields[1]=popularPiecesIndex&filters[id][$eq]=${workId ? workId : "0"}`,
            );
            fetchedData.push(...response.data.data);
          }
        }
        setPieces(fetchedData);
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
  }, [workId, dispatch]);

  return (
    <>
      {!isLoadingPieces && pieces && pieces.length > 0 && (
        <CardPiece
          key={`Piece-${pieces[0].id}`}
          piece={pieces[0]}
          hideLabel={true}
        />
      )}
    </>
  );
};

export default GetPiece;
