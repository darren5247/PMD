import { EUserTypes, TUserAttributes, TApplicationActions } from "@src/types";

export const userReducer = (
  state: TUserAttributes | null,
  action: TApplicationActions,
) => {
  switch (action.type) {
    case EUserTypes.LOG_IN:
      return {
        ...state,
        ...action.payload,
      };
    case EUserTypes.LOG_OUT:
      document.cookie = `jwt=; max-age=0;`;
      localStorage?.removeItem("accountData");
      return null;
    default:
      return state;
  }
};
