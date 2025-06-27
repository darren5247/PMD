import { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import CardComposer from "@src/components/CardComposer";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiComposer,
} from "@src/types";

interface IGetComposerProps {
  composerId: string | null;
}

export const GetComposer: FC<IGetComposerProps> = ({
  composerId,
}): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [composers, setComposers] = useState<IStrapiComposer[]>([]);
  const [isLoadingComposers, setIsLoadingComposers] = useState(false);

  useEffect(() => {
    const getAPIComposers = async () => {
      try {
        setIsLoadingComposers(true);
        const fetchedData = [];
        const { data } = await api.get(
          `composers?pagination[page]=1&pagination[pageSize]=10&sort[0]=name:asc&fields[0]=name&fields[1]=birth_year&fields[2]=death_year&fields[3]=nationality&populate[image][fields][4]=height&populate[image][fields][5]=width&populate[image][fields][6]=url&populate[image][fields][7]=alternativeText&populate[works][fields][8]=title&filters[id][$eq]=${composerId ? composerId : "0"}`,
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
              `composers?pagination[page]=${i}&pagination[pageSize]=10&sort[0]=name:asc&fields[0]=name&fields[1]=birth_year&fields[2]=death_year&fields[3]=nationality&populate[image][fields][4]=height&populate[image][fields][5]=width&populate[image][fields][6]=url&populate[image][fields][7]=alternativeText&populate[works][fields][8]=title&filters[id][$eq]=${composerId ? composerId : "0"}`,
            );
            fetchedData.push(...response.data.data);
          }
        }
        setComposers(fetchedData);
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
        setIsLoadingComposers(false);
      }
    };

    getAPIComposers();
  }, [composerId, dispatch]);

  return (
    <>
      {!isLoadingComposers && composers && composers.length > 0 && (
        <CardComposer
          key={`Composer-${composers[0].id}`}
          name={composers[0].attributes.name}
          birth_year={composers[0].attributes.birth_year}
          death_year={composers[0].attributes.death_year}
          nationality={composers[0].attributes.nationality}
          imageURL={composers[0].attributes.image?.data?.attributes.url}
          id={composers[0].id}
          hideLabel={true}
        />
      )}
    </>
  );
};

export default GetComposer;
