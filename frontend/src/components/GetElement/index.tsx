import { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import CardElement from '@src/components/CardElement';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiElement
} from '@src/types';

interface IGetElementProps {
  elementId: string | null
}

export const GetElement: FC<IGetElementProps> = ({ elementId }): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [elements, setElements] = useState<IStrapiElement[]>([]);
  const [isLoadingElements, setIsLoadingElements] = useState(false);

  useEffect(
    () => {
      const getAPIElements = async () => {
        try {
          setIsLoadingElements(true);
          const fetchedData = [];
          const { data } = await api.get(
            `elements?pagination[page]=1&pagination[pageSize]=10&sort[0]=name:asc&populate[illustration][fields][0]=height&populate[illustration][fields][1]=width&populate[illustration][fields][2]=url&fields[0]=name&fields[1]=description&fields[2]=category&filters[id][$eq]=${elementId ? elementId : '0'}`
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
                `elements?pagination[page]=${i}&pagination[pageSize]=10&sort[0]=name:asc&populate[illustration][fields][0]=height&populate[illustration][fields][1]=width&populate[illustration][fields][2]=url&fields[0]=name&fields[1]=description&fields[2]=category&filters[id][$eq]=${elementId ? elementId : '0'}`
              );
              fetchedData.push(...response.data.data);
            };
          };
          setElements(fetchedData);
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
          setElements([]);
        } finally {
          setIsLoadingElements(false);
        };
      };

      getAPIElements();
    }, [elementId, dispatch]
  );

  return (
    <>
      {(!isLoadingElements && elements && elements.length > 0) && (
        <CardElement
          key={`Element-${elements[0].id}`}
          name={elements[0].attributes.name}
          desc={elements[0].attributes.description}
          cat={elements[0].attributes.category}
          illustrationWidth={elements[0].attributes.illustration.data.attributes.width}
          illustrationHeight={elements[0].attributes.illustration.data.attributes.height}
          illustrationURL={elements[0].attributes.illustration.data.attributes.url}
          id={elements[0].id}
          hideLabel={true}
        />
      )}
    </>
  );
};

export default GetElement;
