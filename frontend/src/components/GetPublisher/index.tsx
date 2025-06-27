import { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/state";
import api from "@src/api/config";
import CardPublisher from "@src/components/CardPublisher";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiPublisher,
} from "@src/types";

interface IGetPublisherProps {
  publisherId: string | null;
}

export const GetPublisher: FC<IGetPublisherProps> = ({
  publisherId,
}): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [publishers, setPublishers] = useState<IStrapiPublisher[]>([]);
  const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);

  useEffect(() => {
    const getAPIPublishers = async () => {
      try {
        setIsLoadingPublishers(true);
        const fetchedData = [];
        const { data } = await api.get(
          `publishers?pagination[page]=1&pagination[pageSize]=10&sort[0]=name:asc&fields[0]=name&fields[1]=nationality&populate[image][fields][2]=height&populate[image][fields][3]=width&populate[image][fields][4]=url&populate[image][fields][5]=alternativeText&populate[works][fields][6]=title&filters[id][$eq]=${publisherId ? publisherId : "0"}`,
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
              `publishers?pagination[page]=1&pagination[pageSize]=10&sort[0]=name:asc&fields[0]=name&fields[1]=nationality&populate[image][fields][2]=height&populate[image][fields][3]=width&populate[image][fields][4]=url&populate[image][fields][5]=alternativeText&populate[works][fields][6]=title&filters[id][$eq]=${publisherId ? publisherId : "0"}`,
            );
            fetchedData.push(...response.data.data);
          }
        }
        setPublishers(fetchedData);
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
        setIsLoadingPublishers(false);
      }
    };

    getAPIPublishers();
  }, [publisherId, dispatch]);

  return (
    <>
      {!isLoadingPublishers && publishers && publishers.length > 0 && (
        <CardPublisher
          key={`Publisher-${publishers[0].id}`}
          name={publishers[0].attributes.name}
          nationality={publishers[0].attributes.nationality}
          imageURL={publishers[0].attributes.image?.data?.attributes.url}
          id={publishers[0].id}
          hideLabel={true}
        />
      )}
    </>
  );
};

export default GetPublisher;
