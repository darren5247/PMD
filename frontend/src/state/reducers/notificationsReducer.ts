import { handleNewNotification } from "@src/api/helpers";
import {
  TApplicationActions,
  ENotificationActionTypes,
  INotification,
} from "@src/types";

export const notificationsReducer = (
  state: INotification[],
  action: TApplicationActions,
) => {
  switch (action.type) {
    case ENotificationActionTypes.SET_MESSAGE: {
      const newNotification = handleNewNotification(action.payload);
      return [...state, newNotification];
    }
    case ENotificationActionTypes.DELETE_MESSAGE: {
      const filteredArr = state.filter((el) => el.id !== action.payload.id);
      return filteredArr;
    }
    default: {
      return state;
    }
  }
};
