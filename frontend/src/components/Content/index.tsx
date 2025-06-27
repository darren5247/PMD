import { FC, useContext } from "react";
import cn from "classnames";
import Notification from "@src/components/Notification";
import { AppContext } from "@src/state";
import { ENotificationActionTypes, INotification } from "@src/types";
import ModalTooltip from "../Modals/ModalTooltip";

interface IContentProps {
  className?: string;
  children?: JSX.Element[] | JSX.Element;
}

export const Content: FC<IContentProps> = ({
  children,
  className,
}): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  const handleDeleteNotification = (item: INotification) => {
    dispatch({
      type: ENotificationActionTypes.DELETE_MESSAGE,
      payload: item,
    });
  };

  return (
    <main
      role="main"
      className={cn("flex flex-col items-center grow lg:pt-0", className)}
    >
      <div className="top-2 left-2 z-[50] fixed flex flex-col gap-3 pr-4 w-full text-center">
        {state.notifications.map((notification) => (
          <Notification
            notification={notification}
            onClose={() => handleDeleteNotification(notification)}
            key={notification.id}
          />
        ))}
        {state.tooltip && <ModalTooltip tooltip={state.tooltip} />}
      </div>
      {children}
    </main>
  );
};

export default Content;
