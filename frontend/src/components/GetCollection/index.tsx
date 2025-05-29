import { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import CardCollection from '@src/components/CardCollection';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiCollection
} from '@src/types';

interface IGetcollectionProps {
  collectionId: string | null
}

export const Getcollection: FC<IGetcollectionProps> = ({ collectionId }): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [collections, setCollections] = useState<IStrapiCollection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  useEffect(
    () => {
      const getAPICollections = async () => {
        try {
          setIsLoadingCollections(true);
          const fetchedData = [];
          const { data } = await api.get(
            `collections?pagination[page]=1&pagination[pageSize]=10&sort[0]=title:asc&populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[works][fields][1]=title&fields[0]=title&fields[1]=published_date&fields[2]=composed_date&populate[image][fields][3]=height&populate[image][fields][4]=width&populate[image][fields][5]=url&populate[image][fields][6]=alternativeText&filters[publishedAt][$null]=false&publicationState=live&filters[id][$eq]=${collectionId ? collectionId : '0'}`
          );
          fetchedData.push(...data?.data);
          if (
            data?.meta?.pagination &&
            fetchedData.length > 0 &&
            data?.meta?.pagination.page < data?.meta?.pagination.pageCount
          ) {
            const { page, pageCount } = data?.meta?.pagination;
            for (let i = page + 1; i <= pageCount; i++) {
              let response = await api.get(
                `collections?pagination[page]=${i}&pagination[pageSize]=10&sort[0]=title:asc&populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[works][fields][1]=title&fields[0]=title&fields[1]=published_date&fields[2]=composed_date&populate[image][fields][3]=height&populate[image][fields][4]=width&populate[image][fields][5]=url&populate[image][fields][6]=alternativeText&filters[publishedAt][$null]=false&publicationState=live&filters[id][$eq]=${collectionId ? collectionId : '0'}`
              );
              fetchedData.push(...response.data.data);
            };
          };
          setCollections(fetchedData);
        } catch (error: any) {
          if (error?.response?.data) {
            dispatch({
              type: ENotificationActionTypes.SET_MESSAGE,
              payload: {
                message: error?.response?.data.error?.message,
                type: ENotificationTypes.ERROR
              }
            });
          };
        } finally {
          setIsLoadingCollections(false);
        }
      };

      getAPICollections();
    }, [collectionId, dispatch]
  );

  return (
    <>
      {(!isLoadingCollections && collections && collections.length > 0) && (
        <CardCollection
          key={`Collection-${collections[0].id}`}
          title={collections[0].attributes.title}
          collection={collections[0]}
          id={collections[0].id}
          hideLabel={true}
        />
      )}
    </>
  );
};

export default Getcollection;
