import { EIsLoadingTypes, TApplicationActions } from "@src/types";

export const isLoadingReducer = (action: TApplicationActions) => {
  switch (action.type) {
    case EIsLoadingTypes.IS_LOADING:
      return true;
    case EIsLoadingTypes.NOT_IS_LOADING:
      return false;
    default:
      return false;
  }
};
