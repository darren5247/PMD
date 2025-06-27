import { FC } from "react";
import cn from "classnames";
import { IStrapiEdit } from "@src/types";

interface IEditHistoryProps {
  className?: string;
  edit: IStrapiEdit;
  hideType?: boolean;
}

const EditHistory: FC<IEditHistoryProps> = ({
  className,
  edit,
  hideType,
  ...props
}): JSX.Element => {
  function getEditDateTime(dateTime: string): string {
    if (dateTime) {
      const now = new Date();
      const diffInMinutes =
        (now.getTime() - new Date(dateTime).getTime()) / (1000 * 60);
      const minutes = Math.floor(diffInMinutes % 60);
      const hours = Math.floor((diffInMinutes % 1440) / 60);
      const days = Math.floor((diffInMinutes % 525600) / 1440);
      const years = Math.floor(diffInMinutes / 525600);

      if (diffInMinutes < 1) {
        return "Moments";
      } else if (diffInMinutes < 60) {
        return Math.floor(diffInMinutes) + " Minutes";
      } else if (diffInMinutes < 1440) {
        // 1440 minutes in a day
        return `${hours} Hours ${minutes} Minutes`;
      } else if (diffInMinutes < 525600) {
        // 525600 minutes in a year
        return `${days} Days ${hours} Hours ${minutes} Minutes`;
      } else {
        return `${years} Years ${days} Days ${hours} Hours ${minutes} Minutes`;
      }
    } else {
      return "Unknown Time";
    }
  }

  return (
    <div
      key={edit.id}
      className={cn(
        "odd:bg-pmdGrayBright even:bg-white flex flex-col gap-2 text-left w-full first:border-t border-x border-b border-pmdGrayLight p-3",
        className,
      )}
      {...props}
    >
      {!hideType && (
        <>
          <p>
            <strong>Type:</strong> {edit.attributes.type}
          </p>
          <p>
            <strong>Field:</strong> {edit.attributes.field}
          </p>
        </>
      )}
      <p>
        <strong>Edited Version:</strong> {edit.attributes.newContent}
      </p>
      <p>
        <strong>Original Version:</strong> {edit.attributes.currentContent}
      </p>
      {edit.attributes.reason && (
        <p>
          <strong>Edit Reason:</strong> {edit.attributes.reason}
        </p>
      )}
      <p>
        <strong>Status:</strong> <em>{edit.attributes.status}</em>
      </p>
      {edit.attributes.reasonRejected && (
        <p>
          <strong>Rejected for:</strong> {edit.attributes.reasonRejected}
        </p>
      )}
      <p>
        <a
          className="text-black hover:text-black no-underline"
          title={new Date(edit.attributes.createdAt).toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        >
          Edited {getEditDateTime(edit.attributes.createdAt)} Ago
        </a>
      </p>
    </div>
  );
};

export default EditHistory;
