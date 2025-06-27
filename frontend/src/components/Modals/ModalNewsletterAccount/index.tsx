import { FC, useContext, useState, useEffect } from "react";
import { AppContext } from "@src/state";
import Label from "@src/components/Label";
import Checkbox from "@src/components/Checkbox";
import Modal from "@src/components/Modal";
import ImageNext from "@src/components/ImageNext";
import { IconEmailRed } from "@src/common/assets/icons";
// import { stripeService } from '@src/services/stripe';
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
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
} from "@src/types";

interface IModalNewsletterAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNewsletterAccount: FC<IModalNewsletterAccountProps> = ({
  isOpen,
  onClose,
}): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const [subscribed, setSubscribed] = useState(false);
  // const [subscription, setSubscription] = useState<any>(null);
  // const [accountData, setAccountData] = useState<TUserAttributes | null>(null);

  // // Check if user is subscribed to PMD Plus
  // useEffect(() => {
  //   // const getSubscription = async () => {
  //   //   const { subscription } = await stripeService.getSubscriptionStatus();
  //   //   setSubscription(subscription);
  //   // }
  //   // getSubscription();

  //   const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
  //   setAccountData(accountData);
  // }, []);

  // Check if user is subscribed to Email Newsletters
  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    let email: string = "";
    if (accountData.email) {
      email = accountData.email;
    }

    const checkSubscribed = async (email: string) => {
      try {
        const data = await apiBrevo.get(
          "/contacts/" + email + "?identifierType=email_id",
        );
        setSubscribed(data.data.listIds.includes(8));
      } catch (error: any) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSubscribed(email);
  }, [dispatch, setSubscribed]);

  // Determine if user is already subscribed or unsubscribed and update subscription status accordingly
  const handleChangeSubscription = async () => {
    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.email) {
      if (subscribed) {
        setSubscribed(false);
        await handleUnsubscribe(accountData.email);
      } else {
        setSubscribed(true);
        await handleSubscribe(
          accountData.name,
          accountData.nameLast,
          accountData.email,
          accountData.userOccupation,
        );
      }
    }
  };

  // Subscribe user to Email Newsletters
  const handleSubscribe = async (
    name: string,
    nameLast: string,
    email: string,
    occupation: string,
  ) => {
    try {
      const brevoRequest = {
        attributes: {
          FIRSTNAME: name,
          LASTNAME: nameLast,
          JOB_TITLE: occupation,
          NEWSLETTER_SOURCE: "account-settings",
          OPT_IN: true,
        },
        email: email,
        listIds: [
          34, // Newsletter
          // ((accountData?.id || subscription) ? 23 : 22) // Free Account (22) OR Plus Account (23)
          22, // Free Account (22)
        ],
        emailBlacklisted: false,
      };
      await apiBrevo.put(
        "/contacts/" + email + "?identifierType=email_id",
        brevoRequest,
      );
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message: "You have signed up for our newsletter! Check your email.",
          type: ENotificationTypes.SUCCESS,
        },
      });
      onClose();
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

  // Unsubscribe user from Email Newsletters
  const handleUnsubscribe = async (email: string) => {
    try {
      const brevoRequest = {
        attributes: {
          OPT_IN: false,
        },
        email: email,
        listIds: [
          // ((accountData?.id || subscription) ? 23 : 22) // Free Account (22) OR Plus Account (23)
          22, // Free Account (22)
        ],
        unlinkListIds: [
          34, // Newsletter
        ],
        emailBlacklisted: true,
      };
      await apiBrevo.put(
        "/contacts/" + email + "?identifierType=email_id",
        brevoRequest,
      );
      dispatch({
        type: ENotificationActionTypes.SET_MESSAGE,
        payload: {
          message:
            "You have successfully removed yourself from our email newsletter",
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

  return (
    <Modal
      id="modalNewsletterAccount"
      onClose={onClose}
      isOpen={isOpen}
      clickOutsideEnabled={true}
      layoutClassName="w-full max-h-full mx-[20px] max-w-[350px]"
      crossClassName="w-10 h-10 top-2 right-2"
    >
      <div className="flex gap-2 py-4 pr-12 pl-5">
        <ImageNext
          src={IconEmailRed}
          height={22}
          width={22}
          className="min-w-[22px] min-h-[22px]"
        />
        <p className="pt-1 text-pmdGrayDark">
          <strong>Communication Preferences</strong>
        </p>
      </div>
      <div className="px-4 pt-2 pb-8 border-pmdGrayLight border-t max-h-screen overflow-auto scrollbar">
        <div className="flex flex-col gap-8 mt-6 w-full">
          <div className="flex flex-col">
            <div className="flex gap-2.5">
              <input
                type="checkbox"
                name="directContact"
                disabled
                checked
                readOnly
                className="checked:before:-top-[5px] checked:before:left-px checked:before:absolute relative bg-pmdGrayLight checked:bg-pmdGrayLight border-[1.5px] border-pmdGrayLight checked:border-pmdGrayLight border-solid rounded w-[16px] h-[16px] checked:before:content-checkbox-chevron-small appearance-none cursor-not-allowed"
              />
              <Label
                htmlFor="directContact"
                label="Direct Contact (Required)"
              />
            </div>
            <p className="text-pmdGray text-xs">
              <em>
                You may receive direct emails which include important updates to
                your account and responses to feedback and support requests.
              </em>
            </p>
          </div>
          <div className="flex flex-col">
            <a
              title="Marketing Contact (Optional)"
              className="flex gap-2.5 no-underline"
            >
              <Checkbox
                checkboxLabel="Marketing Contact (Optional)"
                checked={subscribed}
                disabled={subscribed === null}
                checkboxLabelClassName="text-pmdGrayDark"
                className="focus-visible:outline-0 w-6 h-6"
                onClick={() => {
                  handleChangeSubscription();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleChangeSubscription();
                  }
                }}
                tabIndex={0}
              />
            </a>
            <p className="mt-1.5 text-pmdGray text-xs">
              <em>
                Sign up for our free email newsletter to receive updates from us
                about upcoming features, new music, deep dives into piano
                teaching, and more.
              </em>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNewsletterAccount;
