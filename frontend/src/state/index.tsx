import React, {
  createContext,
  useReducer,
  Dispatch,
  FC,
  useEffect,
} from "react";
import {
  userReducer,
  notificationsReducer,
  tooltipReducer,
  isLoadingReducer,
} from "./reducers";
import {
  TApplicationType,
  TApplicationActions,
  EUserTypes,
  TUserAttributes,
} from "@src/types";

type InitialStateType = TApplicationType & {};

interface IAppProviderProps {
  children: React.ReactNode;
}

const initialState: TApplicationType = {
  user: null,
  notifications: [],
  tooltip: null,
  isLoading: false,
};

const AppContext = createContext<{
  state: TApplicationType;
  dispatch: Dispatch<TApplicationActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainAppReducer = (
  { user, notifications, tooltip }: InitialStateType,
  action: TApplicationActions,
) => ({
  user: userReducer(user, action),
  notifications: notificationsReducer(notifications, action),
  tooltip: tooltipReducer(tooltip, action),
  isLoading: isLoadingReducer(action),
});

const AppProvider: FC<IAppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mainAppReducer, initialState);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      dispatch({
        type: EUserTypes.LOG_IN,
        payload: accountData,
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
