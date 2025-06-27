import { FC, useRef, useState, useEffect, useContext } from "react";
import { useOnClickOutside } from "usehooks-ts";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconUserProfileOutlinedRed,
  IconLoginRed,
  IconHeart,
  IconBookmark,
} from "@src/common/assets/icons";
// import { IconCoin, IconCheckRed } from '@src/common/assets/icons';
import ImageNext from "@src/components/ImageNext";
import { useOnEventOutside } from "@src/common/hooks";
import { EUrlsPages } from "@src/constants";
import { AppContext } from "@src/state";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  EUserTypes,
  INavigationItem,
  TUserAttributes,
} from "@src/types";

const navLinksMenu = [
  { title: "Home", href: EUrlsPages.HOMEPAGE },
  { title: "Start a Search", href: `/${EUrlsPages.SEARCH}` },
  { title: "Collections", href: `/${EUrlsPages.COLLECTIONS}` },
  { title: "Composers", href: `/${EUrlsPages.COMPOSERS}` },
  { title: "Publishers", href: `/${EUrlsPages.PUBLISHERS}` },
  { title: "Levels of Difficulty", href: `/${EUrlsPages.LEVELS}` },
  { title: "Elements", href: `/${EUrlsPages.ELEMENTS}` },
];

interface INavigationDropdownProps {
  onClose: (value: boolean) => void;
  className?: string;
  showBackBar?: boolean;
  showLevelBar?: boolean;
  currentUrl?: string;
}

export const NavigationDropdown: FC<INavigationDropdownProps> = ({
  onClose,
  className,
  showBackBar,
  showLevelBar,
  currentUrl,
}): JSX.Element => {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setUserEmail] = useState<string | null>(null);
  const [name, setUserName] = useState<string | null>(null);
  const [subStatus, setUserSubStatus] = useState<boolean | null>(null);
  const ref = useRef(null);
  const router = useRouter();
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      setUserId(accountData.id);
      if (accountData.email) {
        setUserEmail(accountData.email);
      }
      if (accountData.name) {
        setUserName(accountData.name);
      }
      if (accountData.subscriptionStatus == "active") {
        setUserSubStatus(true);
      } else {
        setUserSubStatus(false);
      }
    }
  }, []);

  const handleScrollOutside = (): void => {
    onClose(false);
  };

  const handleLogOut = () => {
    dispatch({
      type: EUserTypes.LOG_OUT,
      payload: null,
    });
    dispatch({
      type: ENotificationActionTypes.SET_MESSAGE,
      payload: {
        message: "Logged out",
        type: ENotificationTypes.SUCCESS,
      },
    });
    if (currentUrl !== EUrlsPages.LOG_IN && currentUrl !== "") {
      localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    } else {
      router.reload();
    }
  };

  useOnClickOutside(ref, handleScrollOutside, "mousedown");

  useOnEventOutside(ref, handleScrollOutside, "scroll");

  const navLinks: INavigationItem[] = userId
    ? subStatus
      ? [
          {
            title: "Dashboard",
            href: `/${EUrlsPages.ACCOUNT_DASHBOARD}`,
            icon: IconUserProfileOutlinedRed,
          },
          {
            title: "Favorites",
            href: `/${EUrlsPages.FAVORITES}`,
            icon: IconHeart,
          },
          {
            title: "Lists",
            href: `/${EUrlsPages.LISTS_CREATED}`,
            icon: IconBookmark,
          },
          {
            title: "Log Out",
            href: `/${EUrlsPages.LOG_IN}`,
            onClick: (func?: (arg?: any) => any) => {
              if (func) func();
            },
            icon: IconLoginRed,
          },
        ]
      : [
          {
            title: "Dashboard",
            href: `/${EUrlsPages.ACCOUNT_DASHBOARD}`,
            icon: IconUserProfileOutlinedRed,
          },
          {
            title: "Favorites",
            href: `/${EUrlsPages.FAVORITES}`,
            icon: IconHeart,
          },
          {
            title: "Lists",
            href: `/${EUrlsPages.LISTS_CREATED}`,
            icon: IconBookmark,
          },
          // REMOVE LISTS and UNCOMMENT PRICING when subscription is ready
          // {
          //   title: 'Pricing',
          //   href: `/${EUrlsPages.PRICING}`,
          //   icon: IconCoin
          // },
          {
            title: "Log Out",
            href: `/${EUrlsPages.LOG_IN}`,
            onClick: (func?: (arg?: any) => any) => {
              if (func) func();
            },
            icon: IconLoginRed,
          },
        ]
    : [
        {
          title: "Dashboard",
          href: `/${EUrlsPages.ACCOUNT_DASHBOARD}`,
          icon: IconUserProfileOutlinedRed,
        },
        {
          title: "Favorites",
          href: `/${EUrlsPages.FAVORITES}`,
          icon: IconHeart,
        },
        {
          title: "Lists",
          href: `/${EUrlsPages.LISTS_CREATED}`,
          icon: IconBookmark,
        },
        {
          title: "Log Out",
          href: `/${EUrlsPages.LOG_IN}`,
          onClick: (func?: (arg?: any) => any) => {
            if (func) func();
          },
          icon: IconLoginRed,
        },
      ];

  return (
    <nav
      id="navDropdown"
      ref={ref}
      className={cn(
        "absolute z-50 right-0 mx-1 overflow-hidden rounded-lg bg-white shadow-navDropdown",
        className,
        {
          "top-[94px]": showBackBar && !showLevelBar,
        },
        {
          "top-[127px]": showBackBar && showLevelBar,
        },
      )}
    >
      <div className="flex flex-row">
        <div className="flex flex-col border-r">
          <p className="bg-pmdGrayBright px-3 max-sm:px-2 pt-3 pb-1 border-b">
            <strong>Links</strong>
          </p>
          <ul className="flex flex-col list-none">
            {navLinksMenu.map((item) => (
              <li className="grow" key={item.title}>
                <Link href={item.href}>
                  <a
                    title={item.title}
                    className="flex hover:bg-pmdGrayBright px-3 max-sm:px-2 py-3 border-b font-medium text-sm no-underline leading-[18px] tracking-[0.01em] transition-all"
                  >
                    {item.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <p className="bg-pmdGrayBright px-3 max-sm:px-2 pt-3 pb-1 border-b">
            <strong>Account</strong>
          </p>
          {name && (
            <p className="px-3 max-sm:px-2 pt-3 w-full max-w-[130px] overflow-hidden text-sm no-underline leading-[18px] tracking-[0.01em] transition-all">
              {name}
            </p>
          )}
          {email && (
            <p className="px-3 max-sm:px-2 pt-1 pb-3 border-b w-full max-w-[130px] overflow-hidden text-sm no-underline leading-[18px] tracking-[0.01em] transition-all">
              {email.replace(/(.).*(.@.).*(\..*)/, "$1*$2*$3")}
            </p>
          )}
          <ul className="flex flex-col list-none">
            {navLinks.map((item) => (
              <li className="grow" key={item.title}>
                {item.onClick ? (
                  <a
                    title={item.title}
                    className="flex gap-x-2 hover:bg-pmdGrayBright px-3 max-sm:px-2 py-3 border-b font-medium text-sm no-underline leading-[18px] tracking-[0.01em] transition-all cursor-pointer"
                    onClick={() => {
                      if (item.onClick) item.onClick(handleLogOut());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleLogOut();
                      }
                    }}
                    tabIndex={0}
                  >
                    <ImageNext src={item.icon} alt="" height={16} width={16} />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link href={item.href}>
                    <a
                      title={item.title}
                      className="flex gap-x-2 hover:bg-pmdGrayBright px-3 max-sm:px-2 py-3 border-b font-medium text-sm no-underline leading-[18px] tracking-[0.01em] transition-all"
                    >
                      <ImageNext
                        src={item.icon}
                        alt=""
                        height={16}
                        width={16}
                      />
                      <span>{item.title}</span>
                    </a>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationDropdown;
