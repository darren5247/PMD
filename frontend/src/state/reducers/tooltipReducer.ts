import {
  TApplicationActions,
  ETooltipActionTypes,
  ITooltipInfo,
} from "@src/types";

export const tooltipReducer = (
  state: ITooltipInfo | null,
  action: TApplicationActions,
) => {
  switch (action.type) {
    case ETooltipActionTypes.SET_TOOLTIP:
      return { ...state, ...action.payload };
    case ETooltipActionTypes.DELETE_TOOLTIP:
      return null;
    default:
      return state;
  }
};
