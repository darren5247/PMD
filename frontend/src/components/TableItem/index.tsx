import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@src/state";
import cn from "classnames";
import { useMediaQuery } from "@src/common/hooks";
import { TUserAttributes } from "@src/types";
import { ITableItem } from "@src/constants";
import TableRowItem from "../TableRowItem";

interface ITableItemProps {
  label?: string | undefined;
  items: ITableItem[];
  col1Label: string;
  col2Label?: string;
  col3Label?: string;
  col4Label?: string;
  col1Width?: string; // Optional width for the first column
  col2Width?: string; // Optional width for the second column
  col3Width?: string; // Optional width for the third column
  col4Width?: string; // Optional width for the fourth column
  pageBreakpoint: string; // Optional mobile breakpoint e.g. 1250px
}

const TableItem: FC<ITableItemProps> = ({
  label,
  items,
  col1Label,
  col2Label,
  col3Label,
  col4Label,
  col1Width,
  col2Width,
  col3Width,
  col4Width,
  pageBreakpoint,
}): JSX.Element => {
  const router = useRouter();
  const isBreakpoint = useMediaQuery(
    pageBreakpoint ? `(min-width: ${pageBreakpoint})` : "(min-width: 1250px)",
  );
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setUserEmail] = useState<string | null>(null);

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );

    if (accountData.email) {
      setUserId(accountData.id);
      setUserEmail(accountData.email);
    }
  }, [dispatch, userId, email, router]);

  return (
    <section id={label ? label : "items"} className="relative mx-auto w-full">
      {label && label !== "" && (
        <div className="mb-1 ml-2 w-full text-left">
          <p className="text-stone-400 text-sm">{label}</p>
        </div>
      )}
      {isBreakpoint === null ? (
        <div className="h-screen"></div>
      ) : isBreakpoint ? (
        <div className="flex justify-center mx-auto w-full">
          <div className="border-pmdGrayLight border-r border-l rounded-tl-md rounded-tr-md w-full">
            <div
              key="worksTableHeadingRowTop"
              id="worksTableHeadingRowTop"
              className="flex flex-row justify-end bg-pmdGrayDark px-4 py-3 rounded-t-md w-full !text-white text-left"
            >
              <div className="flex flex-row flex-1 gap-4 text-sm align-middle tracking-normal">
                <div
                  className={cn(
                    "w-full",
                    col1Width
                      ? `min-w-[${col1Width}] max-w-[${col1Width}]`
                      : "min-w-[230px]",
                  )}
                >
                  <strong>{col1Label}</strong>
                </div>
                {col2Label ? (
                  <div
                    className={cn(
                      col2Width
                        ? `min-w-[${col2Width}] max-w-[${col2Width}]`
                        : "min-w-[165px] max-w-[165px]",
                    )}
                  >
                    <strong>{col2Label}</strong>
                  </div>
                ) : (
                  ""
                )}
                {col3Label ? (
                  <div
                    className={cn(
                      col3Width
                        ? `min-w-[${col3Width}] max-w-[${col3Width}]`
                        : "min-w-[110px] max-w-[110px]",
                    )}
                  >
                    <strong>{col3Label}</strong>
                  </div>
                ) : (
                  ""
                )}
                {col4Label ? (
                  <div
                    className={cn(
                      col4Width
                        ? `min-w-[${col4Width}] max-w-[${col4Width}]`
                        : "min-w-[100px] max-w-[100px]",
                    )}
                  >
                    <strong>{col4Label}</strong>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {items.map(({ id, linkURL, linkAlt, col1, col2, col3, col4 }) => (
              <TableRowItem
                key={`item${id.toString()}`}
                id={id}
                linkURL={linkURL}
                linkAlt={linkAlt}
                col1={col1}
                col2={col2}
                col3={col3}
                col4={col4}
                col1Width={col1Width}
                col2Width={col2Width}
                col3Width={col3Width}
                col4Width={col4Width}
                pageBreakpoint={pageBreakpoint}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex mx-auto w-full">
          <div className="border-pmdGrayLight border-x border-t w-full">
            {items.map(({ id, linkURL, linkAlt, col1, col2, col3, col4 }) => (
              <TableRowItem
                key={`item${id.toString()}`}
                id={id}
                linkURL={linkURL}
                linkAlt={linkAlt}
                col1={col1}
                col2={col2}
                col3={col3}
                col4={col4}
                pageBreakpoint={pageBreakpoint}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TableItem;
