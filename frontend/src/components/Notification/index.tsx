import { FC } from "react";
import cn from "classnames";
import ImageNext from "../ImageNext";
import { IconCrossWhite } from "@src/common/assets/icons";
import { ENotificationTypes, INotification } from "@src/types";

interface INotificationProps {
  className?: string;
  onClose: () => void;
  notification: INotification;
}

const Notification: FC<INotificationProps> = ({
  className,
  notification,
  onClose,
  ...props
}): JSX.Element => {
  const handleBackground = (type: string) => {
    switch (type) {
      case ENotificationTypes.ERROR:
        return "bg-orange-500";
      case ENotificationTypes.SUCCESS:
        return "bg-green-500";
      case ENotificationTypes.WARNING:
        return "bg-yellow-500";
      case ENotificationTypes.INFO:
        return "bg-blue-500";
      default:
        return "bg-pmdGrayDark";
    }
  };

  const timeout = () => {
    setTimeout(() => {
      onClose();
    }, 5000);
  };

  timeout();

  return (
    <div
      id={"notification" + notification.message}
      className={cn(
        "relative rounded-lg text-lg pt-1 leading-[20px] tracking-thigh text-white overflow-hidden shadow-button",
        handleBackground(notification.type),
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-center gap-2 px-6 py-2 w-full text-left align-middle">
        <p>
          <strong>{notification.message}</strong>
        </p>
        <a
          title="Close Notification"
          className="bg-pmdGrayDark hover:bg-pmdGray ml-4 p-4 rounded-full cursor-pointer"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
          tabIndex={0}
        >
          <ImageNext
            className="min-w-[12px] min-h-[12px]"
            src={IconCrossWhite}
            width={12}
            height={12}
          />
        </a>
      </div>
      <div
        className="bg-white rounded-full h-1"
        style={{ animation: "progress 5s linear" }}
      ></div>
      <style>{`
      @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
      }
      `}</style>
    </div>
  );
};

export default Notification;
