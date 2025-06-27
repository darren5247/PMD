import { FC, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  IconLogoWhite,
  IconCheckboxChevron,
  IconFacebook,
  IconInstagram,
  IconThreads,
  IconPinterest,
  IconDiscord,
  IconUserProfileOutlinedRed,
  IconLoginRed,
  IconHeart,
  IconBookmark,
  IconBigEmail,
} from "@src/common/assets/icons";
import Divider from "@src/components/Divider";
import ImageNext from "@src/components/ImageNext";
import { AppContext } from "@src/state";
import {
  ENotificationActionTypes,
  ENotificationTypes,
  EUserTypes,
  INavigationItem,
  TUserAttributes,
  IError,
} from "@src/types";
import { useCookieConsent } from "@src/context/CookieConsentContext";
import Form from "@src/components/Form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Label from "@src/components/Label";
import Field from "@src/components/Field";
import InputText from "@src/components/InputText";
import axios from "axios";

const apiBrevo = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BREVO_API_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY || "",
  },
});

import {
  EAccountData,
  EUrlsPages,
  LIB_VERSION,
  newsletterRules,
} from "@src/constants";

interface INewsletterForm {
  [EAccountData.name]: string;
  [EAccountData.nameLast]: string;
  [EAccountData.email]: string;
}

type TNewsletterForm = INewsletterForm | FieldValues;

const Footer: FC = (): JSX.Element => {
  const currentYear: number = new Date().getFullYear();
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const { setShouldShowBanner, shouldShowBanner } = useCookieConsent();
  const [userId, setUserId] = useState<number | null>(null);

  const [errors, setErrors] = useState<IError[]>([]);
  const { control, handleSubmit, formState, reset } =
    useForm<TNewsletterForm>();

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      setUserId(accountData.id);
    }
  }, []);

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
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname + window.location.search + window.location.hash,
    );
    router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
  };

  const navLinks: INavigationItem[] = userId
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
          title: "Create Account",
          href: `/${EUrlsPages.CREATE_ACCOUNT}`,
          icon: IconUserProfileOutlinedRed,
        },
        {
          title: "Log In",
          href: `/${EUrlsPages.LOG_IN}`,
          icon: IconLoginRed,
        },
      ];

  const footerNavigation = userId
    ? [
        {
          title: "Links",
          linkList: [
            {
              title: "Start a Search",
              href: `/${EUrlsPages.SEARCH}`,
              target: "_self",
            },
            {
              title: "Collections",
              href: `/${EUrlsPages.COLLECTIONS}`,
              target: "_self",
            },
            {
              title: "Composers",
              href: `/${EUrlsPages.COMPOSERS}`,
              target: "_self",
            },
            {
              title: "Publishers",
              href: `/${EUrlsPages.PUBLISHERS}`,
              target: "_self",
            },
            {
              title: "Levels of Difficulty",
              href: `/${EUrlsPages.LEVELS}`,
              target: "_self",
            },
            {
              title: "Elements of Piano",
              href: `/${EUrlsPages.ELEMENTS}`,
              target: "_self",
            },
            // { title: 'Discover Lists', href: `/${EUrlsPages.LIST_DISCOVERY}`, target: '_self' }
          ],
        },
        {
          title: "Help",
          linkList: [
            {
              title: "Help Center",
              href: `/${EUrlsPages.HELP}`,
              target: "_self",
            },
            {
              title: "Tutorials",
              href: `/${EUrlsPages.TUTORIALS}`,
              target: "_self",
            },
            { title: "FAQ", href: `/${EUrlsPages.FAQ}`, target: "_self" },
          ],
        },
        {
          title: "Legal",
          linkList: [
            {
              title: "Terms & Conditions",
              href: `/${EUrlsPages.TERMS_AND_CONDITIONS}`,
              target: "_self",
            },
            {
              title: "Privacy Policy",
              href: `/${EUrlsPages.PRIVACY_POLICY}`,
              target: "_self",
            },
            {
              title: "Cookie Policy",
              href: `/${EUrlsPages.COOKIE_POLICY}`,
              target: "_self",
            },
          ],
        },
        {
          title: "Company",
          linkList: [
            { title: "About", href: `/${EUrlsPages.ABOUT}`, target: "_self" },
            { title: "Press", href: `/${EUrlsPages.PRESS}`, target: "_self" },
            {
              title: "Contact",
              href: `/${EUrlsPages.CONTACT}`,
              target: "_self",
            },
          ],
        },
      ]
    : [
        {
          title: "Links",
          linkList: [
            { title: "FAQ", href: `/${EUrlsPages.FAQ}`, target: "_self" },
            {
              title: "Email Newsletter",
              href: `/${EUrlsPages.NEWSLETTER}`,
              target: "_self",
            },
            { title: "Interactive Demo", href: `/demo`, target: "_self" },
          ],
        },
        {
          title: "Legal",
          linkList: [
            {
              title: "Terms & Conditions",
              href: `/${EUrlsPages.TERMS_AND_CONDITIONS}`,
              target: "_self",
            },
            {
              title: "Privacy Policy",
              href: `/${EUrlsPages.PRIVACY_POLICY}`,
              target: "_self",
            },
            {
              title: "Cookie Policy",
              href: `/${EUrlsPages.COOKIE_POLICY}`,
              target: "_self",
            },
          ],
        },
        {
          title: "Company",
          linkList: [
            { title: "About", href: `/${EUrlsPages.ABOUT}`, target: "_self" },
            { title: "Press", href: `/${EUrlsPages.PRESS}`, target: "_self" },
            {
              title: "Contact",
              href: `/${EUrlsPages.CONTACT}`,
              target: "_self",
            },
          ],
        },
      ];

  const handleNewsletterSignUp: SubmitHandler<TNewsletterForm> = ({
    name,
    nameLast,
    email,
  }) => {
    if (!handleError({ name, email })) {
      handleSubscribe(name, nameLast, email);
    }
  };

  const handleSubscribe = async (
    name: string,
    nameLast: string,
    email: string,
  ) => {
    try {
      const brevoRequest = {
        attributes: {
          FIRSTNAME: name,
          LASTNAME: nameLast,
          NEWSLETTER_SOURCE: `newsletter (in footer on this page: ${process.env.NEXT_PUBLIC_DOMAIN_URL || "pianomusicdatabase.com"}${router.asPath})`,
          OPT_IN: true,
        },
        email: email,
        listIds: [
          34, // Newsletter
        ],
        updateEnabled: true,
        emailBlacklisted: false,
      };
      await apiBrevo.post("/contacts", brevoRequest);
      reset();
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "You have signed up for our newsletter! Check your email.",
          type: ENotificationTypes.SUCCESS,
        },
      });
    } catch (error: any) {
      if (error?.response?.data) {
        dispatch({
          type: ENotificationActionTypes.SET_MESSAGE,
          payload: {
            message: error?.response?.data.message,
            type: ENotificationTypes.ERROR,
          },
        });
      }
    }
  };

  const handleError = (form: any) => {
    const newErrors = [];
    for (const key in newsletterRules) {
      if (!newsletterRules[key].rule(form[key]))
        newErrors.push({ name: key, message: newsletterRules[key].message });
    }
    newErrors.forEach((el) =>
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: el.message,
          type: ENotificationTypes.ERROR,
        },
      }),
    );
    setErrors(newErrors);
    if (newErrors.length > 0) return true;
  };

  const findErrors = (string: string) =>
    errors.find((el) => el?.name === string);

  return (
    <footer
      role="contentinfo"
      id="footer"
      className="flex flex-col justify-center items-center w-full no-print"
    >
      {!userId ? (
        <div className='flex flex-col justify-center items-center bg-[url("/lines.png")] bg-pmdRed bg-cover bg-no-repeat bg-bottom bg-local px-4 py-16 w-full text-white text-center'>
          <h2
            id="try"
            className="flex justify-center items-center mb-2 font-medium text-center"
          >
            <em>PMD Plus</em>
          </h2>
          <p>
            All features <strong>FREE</strong> during Early Access
          </p>
          <div className="flex flex-row flex-wrap justify-center items-center gap-x-12 gap-y-4 mt-5 mb-7 w-full text-center align-middle">
            <div className="flex flex-row gap-2">
              <ImageNext
                src={IconCheckboxChevron}
                alt=""
                height={24}
                width={24}
              />
              Unlock Search Filters
            </div>
            <div className="flex flex-row gap-2">
              <ImageNext
                src={IconCheckboxChevron}
                alt=""
                height={24}
                width={24}
              />
              Save Unlimited Favorites
            </div>
            <div className="flex flex-row gap-2">
              <ImageNext
                src={IconCheckboxChevron}
                alt=""
                height={24}
                width={24}
              />
              Create Unlimited Lists
            </div>
          </div>
          <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
            <a
              title="Create Account"
              className="!px-10 !py-3 text-lg buttonwhite"
            >
              Create Account
            </a>
          </Link>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col justify-center items-center bg-pmdGrayDark px-0 w-full align-top">
        <div className="flex md:flex-row flex-col justify-center md:justify-between items-center md:items-start gap-20 mt-20 md:mt-12 mb-24 md:mb-16 px-8 md:px-12 w-full max-w-[1250px] align-top">
          <div className="flex flex-col justify-start items-start gap-2 text-white text-left align-middle">
            <div className="flex flex-col items-start gap-2 max-w-[320px]">
              <div className="flex gap-4">
                <ImageNext
                  src={IconBigEmail}
                  height={48}
                  width={48}
                  className="min-w-[32px] min-h-[32px]"
                />
                <p className="text-white text-xl">
                  <strong>
                    Sign Up for Our{" "}
                    <span className="flex">Email Newsletter</span>
                  </strong>
                </p>
              </div>
              <p className="text-pmdGrayLight text-sm text-left">
                <em>
                  Sign up for our free email newsletter to receive updates from
                  us about upcoming features, new music, deep dives into piano
                  teaching, and more.
                </em>
              </p>
            </div>
            <Form>
              <div className="flex flex-col gap-y-5 pt-3 max-w-[320px]">
                <div>
                  <Field
                    labelEl={
                      <Label
                        htmlFor={EAccountData.name}
                        label="First Name"
                        labelClassName="text-pmdGrayLight"
                        labelRequired={<span className="text-pmdRed"> *</span>}
                      />
                    }
                    labelClassName="font-bold mb-1"
                    name={EAccountData.name}
                    component={InputText}
                    control={control}
                    formState={formState}
                    placeholder="First Name"
                    className="!px-5 pt-[17px] pb-4"
                    error={
                      formState.errors[EAccountData.name] ||
                      findErrors(EAccountData.name)
                    }
                  />
                  <p className="pt-1 text-pmdRed text-sm text-left">
                    {findErrors(EAccountData.name)?.message}
                  </p>
                </div>
                <div>
                  <Field
                    labelEl={
                      <Label
                        htmlFor={EAccountData.nameLast}
                        label="Last Name"
                        labelClassName="text-pmdGrayLight"
                      />
                    }
                    labelClassName="font-bold mb-1"
                    name={EAccountData.nameLast}
                    component={InputText}
                    control={control}
                    formState={formState}
                    placeholder="Last Name"
                    className="!px-5 pt-[17px] pb-4"
                  />
                </div>
                <div>
                  <Field
                    labelEl={
                      <Label
                        htmlFor={EAccountData.email}
                        label="Email"
                        labelClassName="text-pmdGrayLight"
                        labelRequired={<span className="text-pmdRed"> *</span>}
                      />
                    }
                    labelClassName="font-bold mb-1"
                    name={EAccountData.email}
                    component={InputText}
                    control={control}
                    formState={formState}
                    placeholder="Email"
                    className="!px-5 pt-[17px] pb-4"
                    error={
                      formState.errors[EAccountData.email] ||
                      findErrors(EAccountData.email)
                    }
                  />
                  <p className="py-1 text-pmdRed text-sm text-left">
                    {findErrors(EAccountData.email)?.message}
                  </p>
                </div>
                <p className="text-[#727272] text-xs">
                  By signing up to our email newsletter, you agree to the{" "}
                  <Link href={`/${EUrlsPages.TERMS_AND_CONDITIONS}`}>
                    <a
                      className="text-[#727272] hover:text-pmdGray focus:text-pmdGrayBright active:!text-pmdGrayLight"
                      title="Terms & Conditions"
                    >
                      Terms & Conditions
                    </a>
                  </Link>{" "}
                  and{" "}
                  <Link href={`/${EUrlsPages.PRIVACY_POLICY}`}>
                    <a
                      className="text-[#727272] hover:text-pmdGray focus:text-pmdGrayBright active:!text-pmdGrayLight"
                      title="Privacy Policy"
                    >
                      Privacy Policy
                    </a>
                  </Link>
                  .
                </p>
                <div className="flex">
                  <a
                    title="Sign up for our email newsletter"
                    className="mx-auto w-full text-center cursor-pointer button"
                    onClick={handleSubmit(handleNewsletterSignUp)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSubmit(handleNewsletterSignUp);
                      }
                    }}
                    tabIndex={0}
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </Form>
          </div>
          <Divider className="md:hidden" />
          <div className="flex flex-col justify-start items-center min-[890px]:items-start gap-10 text-white text-left align-middle">
            <div className="flex max-[420px]:flex-col flex-wrap justify-between sm:justify-start items-start gap-10 max-[1086px]:max-w-[300px] text-white text-left align-middle">
              {footerNavigation.map((navItem, idx) => (
                <div key={`${navItem.title}${idx}`}>
                  <p className="text-xl">
                    <strong>{navItem.title}</strong>
                  </p>
                  <ul className="pt-[2px] text-sm leading-[30px] list-none">
                    {navItem.linkList.map((link) => (
                      <li
                        className="whitespace-nowrap"
                        key={`${link.href + link.title}`}
                      >
                        <Link href={link.href}>
                          <a
                            title={link.title}
                            target={link.target}
                            className="text-pmdGrayLight focus:text-white hover:underline no-underline focus:no-underline"
                          >
                            {link.title}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-start items-center md:items-start gap-2 w-min text-white text-left align-middle">
              <p className="text-xl">
                <strong>Account</strong>
              </p>
              <ul className="flex flex-row max-[889px]:flex-col bg-gradient-to-b from-white to-pmdGrayLight shadow-pmdRed shadow-tooltip border-pmdGray rounded-md divide-x divide-y divide-pmdGrayLight w-max text-sm leading-[30px] list-none">
                {navLinks.map((item) => (
                  <li
                    className="bg-transparent border-none rounded-md whitespace-nowrap"
                    key={item.title}
                  >
                    {item.onClick ? (
                      <a
                        title={item.title}
                        className="flex items-center gap-2 bg-transparent hover:!bg-pmdGrayBright focus:!bg-pmdGray active:!bg-pmdGrayLight px-4 py-2 border-none rounded-md w-full h-full hover:underline no-underline focus:no-underline tracking-thigh cursor-pointer"
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
                        <div className="min-w-4 min-h-4">
                          <ImageNext
                            src={item.icon}
                            alt=""
                            height={16}
                            width={16}
                          />
                        </div>
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link href={item.href}>
                        <a
                          title={item.title}
                          className="flex items-center gap-2 bg-transparent hover:!bg-pmdGrayBright focus:!bg-pmdGray active:!bg-pmdGrayLight px-4 py-2 border-none rounded-md w-full h-full hover:underline no-underline focus:no-underline tracking-thigh cursor-pointer"
                        >
                          <div className="min-w-4 min-h-4">
                            <ImageNext
                              src={item.icon}
                              alt=""
                              height={16}
                              width={16}
                            />
                          </div>
                          <span>{item.title}</span>
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-pmdRed w-full">
          <div className="flex md:flex-row flex-col flex-wrap justify-center min-[840px]:justify-between items-center gap-16 mx-auto my-16 md:my-10 px-2 md:px-12 max-w-[1000px] md:max-w-[1250px] align-middle">
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
              <Link href="https://facebook.com/pianomusicdatabase">
                <a
                  title="Visit the Facebook for Piano Music Database"
                  className="hover:opacity-75 focus:opacity-75 my-auto min-w-[18px] no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageNext src={IconFacebook} alt="Facebook" />
                </a>
              </Link>
              <Link href="https://instagram.com/pianomusicdatabase">
                <a
                  title="Visit the Instagram for Piano Music Database"
                  className="hover:opacity-75 focus:opacity-75 my-auto min-w-[18px] no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageNext src={IconInstagram} alt="Instagram" />
                </a>
              </Link>
              <Link href="https://threads.net/pianomusicdatabase">
                <a
                  title="Visit the Threads for Piano Music Database"
                  className="hover:opacity-75 focus:opacity-75 my-auto min-w-[18px] no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageNext src={IconThreads} alt="Threads" />
                </a>
              </Link>
              <Link href="https://pinterest.com/pianomusicdatabase">
                <a
                  title="Visit the Pinterest for Piano Music Database"
                  className="hover:opacity-75 focus:opacity-75 my-auto min-w-[18px] no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageNext src={IconPinterest} alt="Pinterest" />
                </a>
              </Link>
              <Link href="https://discord.gg/G8vEbn7ajF">
                <a
                  title="Join the Discord for Piano Music Database"
                  className="hover:opacity-75 focus:opacity-75 my-auto min-w-[18px] no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageNext src={IconDiscord} alt="Discord" />
                </a>
              </Link>
            </div>
            <div className="align-right flex flex-col gap-y-3 text-center md:text-right">
              <Link href={EUrlsPages.HOMEPAGE}>
                <a
                  title="Piano Music Database"
                  className="flex md:flex-row flex-col justify-center items-center gap-4 hover:opacity-75 focus:opacity-75 md:pl-5 hover:underline no-underline focus:no-underline align-middle"
                >
                  <ImageNext
                    src={IconLogoWhite}
                    alt="Piano Music Database"
                    height={38}
                    width={38}
                    className="align-right"
                  />
                  <strong className="text-white text-2xl align-middle">
                    Piano Music Database
                  </strong>
                </a>
              </Link>
              <div className="flex flex-row flex-wrap justify-center md:justify-end gap-x-2 gap-y-1 text-white text-xs text-center md:text-right">
                <div>
                  <p>© 2021-{currentYear} Piano Music Database LLC.</p>
                </div>
                {LIB_VERSION ? (
                  <div>
                    <p>
                      <em className="pl-4 text-[10px]">v{LIB_VERSION}</em>
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-row flex-wrap justify-end gap-x-2 gap-y-1 text-white text-xs text-right">
                <a
                  title="Change Cookie Preferences"
                  aria-label="Change Cookie Preferences"
                  aria-haspopup="dialog"
                  aria-expanded={shouldShowBanner}
                  aria-controls="cookieConsent"
                  className="text-white italic cursor-pointer"
                  onClick={() => setShouldShowBanner(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShouldShowBanner(true);
                    }
                  }}
                  tabIndex={0}
                >
                  Change Cookie Preferences
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
