import { useContext, FC, useState } from 'react';
import { AppContext } from '@src/state';
import api from '@src/api/config';
import cn from 'classnames';
import Link from 'next/link';
import ImageNext from '@src/components/ImageNext';
import { EUrlsPages } from '@src/constants';
import { handleTitleWithJustNumber } from '@src/api/helpers';
import { IconGlobeGray, IconLinkGray, IconLockGray, IconOpen } from '@src/common/assets/icons';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  IStrapiList
} from '@src/types';

interface IItemListAdd {
  index?: string;
  workId: number;
  list: IStrapiList;
};

const ItemListAdd: FC<IItemListAdd> = ({ index, workId, list }): JSX.Element => {
  const [highestOrder, setHighestOrder] = useState<number>(0);

  const { dispatch } = useContext(AppContext);

  const getHighestOrder = async (listId: number) => {
    if (listId !== null && listId !== undefined && listId !== 0) {
      try {
        const { data } = await api.get(
          `lists/${listId}`
        );
        if (data?.data && data?.data.attributes['list-works']?.data.length > 0) {
          const orders = data.data.attributes['list-works'].data.map((work: any) => work.attributes.order);
          const highestOrderValue = Math.max(...orders);
          setHighestOrder(highestOrderValue);
        } else {
          setHighestOrder(0);
        }
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
      };
    };
  };

  const handleAddToList = async (listId: number) => {
    if (workId !== null && workId !== undefined && workId !== 0 && listId !== null && listId !== undefined && listId !== 0) {
      getHighestOrder(listId);
      try {
        const dataAdded = await api.post('list-works', {
          data: {
            order: highestOrder + 1,
            work: {
              id: workId
            },
            list: {
              id: listId
            },
          }
        });
        if (dataAdded !== null && dataAdded !== undefined) {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Added to list successfully!',
              type: ENotificationTypes.SUCCESS
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error adding to list, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        };
      } catch (error: any) {
        if (error?.response?.data && error?.response?.data.error?.message === 'Not Found') {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: 'Error adding to list, please try again.',
              type: ENotificationTypes.ERROR
            }
          });
        } else {
          dispatch({
            type: ENotificationActionTypes.SET_MESSAGE,
            payload: {
              message: `Error adding to list (${error?.response?.data.error?.message}), please try again.`,
              type: ENotificationTypes.ERROR
            }
          });
        };
      } finally {
        setHighestOrder(0);
      };
    } else {
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: 'Error adding to list, please refresh and try again.',
          type: ENotificationTypes.ERROR
        }
      });
    };
  };

  return (
    <div key={index} className='flex flex-row max-[410px]:flex-col justify-center items-stretch gap-0 mx-2 text-center align-middle'>
      <a
        title={list.attributes.title} className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-4 border border-pmdGrayBright rounded-l-md h-fill no-underline transition-all cursor-pointer grow'
        tabIndex={0}
        onClick={() => {
          handleAddToList(list.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleAddToList(list.id);
          }
        }}
      >
        <div className='flex max-[410px]:flex-col justify-between items-center gap-4 my-auto'>
          <div className='min-[410px]:min-w-44 max-w-44 text-left'>
            <p
              className={cn(
                'font-medium text-pmdRed text-lg max-[410px]:text-center',
                { 'break-all': list.attributes.title.split(' ').some(word => word.length > 8) }
              )}
            >
              {list.attributes.title.length > 20 ? `${list.attributes.title}` : list.attributes.title}
            </p>
          </div>
          <div className='flex flex-row justify-start items-start gap-2 text-pmdGray text-sm text-left'>
            {list.attributes.visibility.data ? (
              (list.attributes.visibility.data.id === 1 || list.attributes.visibility.data.id === 2 ? (
                list.attributes.visibility.data.id === 1 ? (
                  <div className='flex justify-center items-center gap-2 align-middle'>
                    <div className='min-w-5 min-h-5'><ImageNext src={IconLinkGray} alt='' height={20} width={20} /></div>
                    <p className='min-w-[60px]'>Unlisted</p>
                  </div>
                ) : (
                  <div className='flex justify-center items-center gap-2 align-middle'>
                    <div className='min-w-5 min-h-5'><ImageNext src={IconLockGray} alt='' height={20} width={20} /></div>
                    <p className='min-w-[60px]'>Private</p>
                  </div>
                )) : (
                <div className='flex justify-center items-center gap-2 align-middle'>
                  <div className='min-w-5 min-h-5'><ImageNext src={IconGlobeGray} alt='' height={20} width={20} /></div>
                  <p className='min-w-[60px]'>Public</p>
                </div>
              ))
            ) : ''}
          </div>
        </div>
      </a>
      <Link href={'/' + EUrlsPages.LIST + '/' + encodeURIComponent(handleTitleWithJustNumber(list.attributes.title ? list.attributes.title : '')) + '?id=' + list.attributes.uid}><a title={list.attributes.title} className='flex flex-row justify-center items-center gap-2 bg-white hover:bg-pmdGrayBright shadow-header px-4 py-4 max-[410px]:py-3 border border-pmdGrayBright rounded-r-md h-fill text-sm text-center no-underline transition-all cursor-pointer grow'><div className='min-w-4 min-h-4'><ImageNext src={IconOpen} alt='' height={16} width={16} /></div> View</a></Link>
    </div>
  );
};

export default ItemListAdd;
