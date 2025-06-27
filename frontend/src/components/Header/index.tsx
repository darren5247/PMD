import { FC, useState, useEffect } from "react";
import cn from "classnames";
import Link from "next/link";
import {
  IconLogoWhite,
  IconSearchRed,
  IconShare,
  IconFeedback,
  IconUserProfileOutlinedRed,
} from "@src/common/assets/icons";
import { ModalShare, ModalFeedback } from "@src/components/Modals";
import { useMediaQuery } from "@src/common/hooks";
import ImageNext from "@src/components/ImageNext";
import NavMenu from "@src/components/NavMenu";
import { EUrlsPages } from "@src/constants";
import { TUserAttributes } from "@src/types";

interface IHeaderProps {
  className?: string;
  classNameLogo?: string;
  classNameSearchForm?: string;
  classNameNavMenu?: string;
  classNameBackBar?: string;
  classNameLevelBar?: string;
  showBackBar: boolean;
  showBackBarShare?: boolean;
  showBackBarFeedback?: boolean;
  showLevelBar?: boolean;
  prevUrl?: string;
  currentUrl?: string;
  urlShare?: string;
  title?: string;
}

const Header: FC<IHeaderProps> = ({
  className,
  classNameLogo,
  classNameNavMenu,
  classNameBackBar,
  classNameLevelBar,
  showBackBar,
  showBackBarShare,
  showBackBarFeedback,
  showLevelBar,
  currentUrl,
  urlShare,
  title,
}): JSX.Element => {
  const [showModalShare, setShowModalShare] = useState<boolean>(false);
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false);
  const isXXsLogoText = useMediaQuery("(max-width: 700px)");
  const isXXs = useMediaQuery("(max-width: 393px)");
  const [userId, setUserId] = useState<number | null>(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(3);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      setUserId(accountData.id);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY < 0 ? 1 : window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      role="banner"
      className="top-0 z-40 fixed w-full h-[50px] transition-all no-print"
    >
      <div
        className={cn(
          `pb-2 lg:py-0 w-full flex flex-col items-center bg-pmdRed shadow-header transition-transform ${show ? "translate-y-0" : "-translate-y-full"}`,
          className,
          {
            "!pb-0": showBackBar,
          },
        )}
      >
        <div
          className={cn(
            `flex w-full max-w-[1250px] gap-y-2 items-center justify-between`,
            {
              "lg:!fixed": showBackBar,
            },
          )}
        >
          <div
            className={cn(
              "order-0 mt-2 lg:my-1 ml-3 min-w-fit cursor-pointer",
              classNameLogo,
            )}
          >
            <Link href={EUrlsPages.HOMEPAGE}>
              <a
                title="Piano Music Database"
                className="flex justify-center items-center gap-x-4 hover:opacity-75 focus:opacity-75 px-2 hover:underline no-underline focus:no-underline align-middle"
              >
                <ImageNext
                  src={IconLogoWhite}
                  alt=""
                  height={38}
                  width={38}
                  className="align-middle"
                />
                <span
                  className={cn(
                    `text-white text-xl `,
                    {
                      "hidden ": isXXs && userId,
                    },
                    {
                      "hidden ": isXXsLogoText && !userId,
                    },
                  )}
                >
                  <strong>Piano Music Database</strong>
                </span>
              </a>
            </Link>
          </div>
          {userId ? (
            <NavMenu
              currentUrl={currentUrl}
              showBackBar={showBackBar}
              showLevelBar={showLevelBar}
              className={cn(
                "order-2 mt-2 lg:my-2 ml-3 mr-6 ",
                classNameNavMenu,
                {
                  "mx-auto order-0": isXXs,
                },
              )}
            />
          ) : (
            <div className="order-2 lg:my-3 mt-2 mr-6 ml-3">
              <div className="flex flex-row gap-4">
                <div className="max-[429px]:hidden">
                  <Link href={`/${EUrlsPages.ABOUT}`}>
                    <a
                      title="About"
                      className="flex justify-center items-center gap-x-2 !px-2 !py-1 !rounded-md text-white !max-[340px]:text-[10px] !max-sm:text-xs !text-sm no-underline focus:no-underline align-middle"
                    >
                      <p className="!font-medium">About</p>
                    </a>
                  </Link>
                </div>
                <Link href={`/${EUrlsPages.LOG_IN}`}>
                  <a
                    title="Log In"
                    className="flex justify-center items-center gap-x-2 !px-2 !py-1 !rounded-md text-white !max-[340px]:text-[10px] !max-sm:text-xs !text-sm no-underline focus:no-underline align-middle"
                  >
                    <p className="!font-medium">Log In</p>
                  </a>
                </Link>
                <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
                  <a
                    title="Create Account"
                    className="flex justify-center items-center gap-x-2 !px-2 !py-1 !rounded-md !max-[340px]:text-[10px] !max-sm:text-xs !text-sm text-center no-underline focus:no-underline align-middle buttonwhite"
                  >
                    <ImageNext
                      src={IconUserProfileOutlinedRed}
                      alt=""
                      height={16}
                      width={16}
                      className="max-[355px]:hidden align-middle"
                    />
                    <p className="!font-medium text-pmdRed">Create Account</p>
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
        {showBackBar && (
          <div
            className={cn(
              "z-0 h-[35px] w-full px-2 mt-[9px] lg:mt-[50px] gap-4 flex align-middle text-center items-center justify-center bg-pmdGrayBright shadow-activeFilter text-sm max-sm:text-xs max-[340px]:text-[10px]",
              classNameBackBar,
            )}
          >
            <div className="flex justify-between items-center gap-4 w-full max-w-[1200px]">
              {userId ? (
                <div id="barlink">
                  <Link href={"/" + EUrlsPages.SEARCH}>
                    <a
                      title="Start a Search"
                      className="flex flex-row justify-center items-center gap-1 align-middle cursor-pointer"
                    >
                      <ImageNext
                        src={IconSearchRed}
                        alt=""
                        height={16}
                        width={16}
                        className="z-0"
                      />
                      <strong className="max-[299px]:hidden">
                        Start a Search
                      </strong>
                    </a>
                  </Link>
                </div>
              ) : (
                <div id="barlink">
                  <Link href={"/" + EUrlsPages.CREATE_ACCOUNT}>
                    <a
                      title="Create a Free Account"
                      className="flex flex-row justify-center items-center gap-1 align-middle cursor-pointer"
                    >
                      <ImageNext
                        src={IconUserProfileOutlinedRed}
                        alt=""
                        height={16}
                        width={16}
                        className="z-0"
                      />
                      <strong className="max-[299px]:hidden">
                        Create Account
                      </strong>
                    </a>
                  </Link>
                </div>
              )}
              {showBackBarShare && (
                <div id="share">
                  <a
                    title="Share"
                    aria-label="Share"
                    aria-haspopup="dialog"
                    aria-expanded={showModalShare}
                    aria-controls="modalShare"
                    onClick={() => {
                      setShowModalShare(true);
                    }}
                    className="flex flex-row justify-center items-center gap-1 align-middle cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setShowModalShare(true);
                      }
                    }}
                    tabIndex={0}
                  >
                    <ImageNext
                      src={IconShare}
                      alt=""
                      height={17}
                      width={19}
                      className="z-0"
                    />
                    <strong className="max-[299px]:hidden">Share</strong>
                  </a>
                  <ModalShare
                    url={urlShare ? urlShare : currentUrl ? currentUrl : ""}
                    text={title ? title : ""}
                    onClose={() => {
                      setShowModalShare(false);
                    }}
                    isOpen={showModalShare}
                  />
                </div>
              )}
              {showBackBarFeedback ? (
                <div id="feedback">
                  <a
                    title="Send Feedback"
                    aria-label="Send Feedback"
                    aria-haspopup="dialog"
                    aria-expanded={showModalFeedback}
                    aria-controls="modalFeedback"
                    onClick={() => {
                      setShowModalFeedback(true);
                    }}
                    className="flex flex-row justify-center items-center gap-1 align-middle cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setShowModalFeedback(true);
                      }
                    }}
                    tabIndex={0}
                  >
                    <ImageNext
                      src={IconFeedback}
                      alt=""
                      height={20}
                      width={20}
                      className="z-0"
                    />
                    <strong className="max-[299px]:hidden">Feedback</strong>
                  </a>
                  <ModalFeedback
                    type={
                      urlShare
                        ? urlShare
                        : currentUrl
                          ? currentUrl
                          : "Unknown Type"
                    }
                    url={
                      urlShare
                        ? urlShare
                        : currentUrl
                          ? currentUrl
                          : "Unknown URL"
                    }
                    onClose={() => {
                      setShowModalFeedback(false);
                    }}
                    isOpen={showModalFeedback}
                  />
                </div>
              ) : (
                <div className="min-[298px]:ml-24"></div>
              )}
            </div>
          </div>
        )}
        {showLevelBar && (
          <div
            className={cn(
              "z-0 h-[33px] w-full flex items-center justify-center bg-pmdGrayLight shadow-activeFilter text-sm",
              classNameLevelBar,
            )}
          >
            <div className="flex justify-center items-center w-full max-w-[1250px]">
              <p className="max-[390px]:hidden flex justify-center items-center bg-pmdGrayLight px-4 py-2 no-underline">
                Levels:
              </p>
              <Link href="#level1">
                <a
                  title="Level 1 - Primary"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  1
                </a>
              </Link>
              <Link href="#level2">
                <a
                  title="Level 2 - Early Elementary"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  2
                </a>
              </Link>
              <Link href="#level3">
                <a
                  title="Level 3 - Late Elementary"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  3
                </a>
              </Link>
              <Link href="#level4">
                <a
                  title="Level 4 - Early Intermediate"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  4
                </a>
              </Link>
              <Link href="#level5">
                <a
                  title="Level 5 - Late Intermediate"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  5
                </a>
              </Link>
              <Link href="#level6">
                <a
                  title="Level 6 - Advanced"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  6
                </a>
              </Link>
              <Link href="#level7">
                <a
                  title="Level 7 - Master"
                  className="flex justify-center items-center bg-pmdGrayLight hover:bg-pmdGrayBright px-4 max-[340px]:px-3 py-2 no-underline"
                >
                  7
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
