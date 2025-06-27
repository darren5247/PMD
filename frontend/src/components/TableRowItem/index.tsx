import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@src/state";
import cn from "classnames";
import { useMediaQuery } from "@src/common/hooks";
import Link from "next/link";
import { TUserAttributes } from "@src/types";

interface ITableRowItemProps {
  id: number;
  linkURL: string;
  linkAlt: string;
  col1: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col1Width?: string; // Optional width for the first column
  col2Width?: string; // Optional width for the second column
  col3Width?: string; // Optional width for the third column
  col4Width?: string; // Optional width for the fourth column
  pageBreakpoint: string; // Optional mobile breakpoint e.g. 1250px
}

const TableRowItem: FC<ITableRowItemProps> = ({
  id,
  linkURL,
  linkAlt,
  col1,
  col2,
  col3,
  col4,
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
  }, [dispatch, userId, email, router, id]);

  return (
    <>
      {!isBreakpoint ? (
        <div
          key={`item${id.toString()}`}
          id={`item${id}`}
          className="flex flex-row items-stretch gap-0 even:bg-white odd:bg-pmdGrayBright border-pmdGrayLight border-b w-full grow"
        >
          <div className="flex flex-col justify-start items-stretch gap-0 w-full text-sm text-left align-middle grow">
            <Link href={linkURL}>
              <a
                className="flex justify-end items-stretch hover:bg-pmdGrayLight focus:bg-pmdGray px-1 min-[333px]:px-4 pt-5 pb-4 w-full !text-pmdGrayDark !no-underline cursor-pointer grow"
                title={linkAlt}
              >
                <div className="flex flex-col flex-1 justify-center items-center w-full text-sm text-center grow">
                  <div className="flex justify-center items-stretch w-full font-bold text-xl grow">
                    {col1}
                  </div>
                  {col2 ? <div className="mt-[12px] text-lg">{col2}</div> : ""}
                  {col3 ? <div className="mt-[12px] text-lg">{col3}</div> : ""}
                  {col4 ? <div className="mt-[12px] text-lg">{col4}</div> : ""}
                </div>
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <div
          key={`item${id.toString()}`}
          id={`item${id}`}
          className="group flex flex-row gap-0 even:bg-white odd:bg-pmdGrayBright border-pmdGrayLight border-b"
        >
          <div className="flex flex-col justify-start items-start gap-0 w-full text-sm text-left align-middle">
            <Link href={linkURL}>
              <a
                className="flex justify-end hover:bg-pmdGrayLight focus:bg-pmdGray px-4 pt-4 pb-3.5 w-full h-full !text-pmdGrayDark !no-underline align-middle cursor-pointer"
                title={linkAlt}
              >
                <div className="flex flex-row flex-1 items-center gap-4 text-sm text-left align-middle">
                  <div
                    className={cn("font-bold text-lg")}
                    style={
                      col1Width
                        ? {
                            minWidth: col1Width,
                            maxWidth: col1Width,
                            width: col1Width,
                          }
                        : {
                            minWidth: "230px",
                            maxWidth: "230px",
                            width: "230px",
                          }
                    }
                  >
                    {col1}
                  </div>
                  {col2 ? (
                    <div
                      style={
                        col2Width
                          ? {
                              minWidth: col2Width,
                              maxWidth: col2Width,
                              width: col2Width,
                            }
                          : {
                              minWidth: "165px",
                              maxWidth: "165px",
                              width: "165px",
                            }
                      }
                    >
                      {col2}
                    </div>
                  ) : (
                    ""
                  )}
                  {col3 ? (
                    <div
                      style={
                        col3Width
                          ? {
                              minWidth: col3Width,
                              maxWidth: col3Width,
                              width: col3Width,
                            }
                          : {
                              minWidth: "110px",
                              maxWidth: "110px",
                              width: "110px",
                            }
                      }
                    >
                      {col3}
                    </div>
                  ) : (
                    ""
                  )}
                  {col4 ? (
                    <div
                      style={
                        col4Width
                          ? {
                              minWidth: col4Width,
                              maxWidth: col4Width,
                              width: col4Width,
                            }
                          : {
                              minWidth: "100px",
                              maxWidth: "100px",
                              width: "100px",
                            }
                      }
                    >
                      {col4}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default TableRowItem;
