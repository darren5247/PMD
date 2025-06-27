import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import Link from "next/link";
import Page from "@src/components/Page";
import { EUrlsPages } from "@src/constants";
import { stripeService } from "@src/services/stripe";
import { TUserAttributes } from "@src/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ImageNext from "@src/components/ImageNext";
import { IconOpen } from "@src/common/assets/icons";

interface IPricingPageProps {
  prevUrl: string | undefined;
}

interface ISubscriptionDetails {
  plan: string;
  interval: string;
  status: string;
  startDate: string;
  currentPeriodEnd: string;
  amount: number | string | null;
  cancelAt: string | null;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    card: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
}

const PricingPage: NextPage<IPricingPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentSubscriptionDetails, setCurrentSubscriptionDetails] =
    useState<ISubscriptionDetails | null>(null);

  useEffect(() => {
    const getSubscription = async () => {
      setLoading(true);
      const response = await stripeService.getSubscriptionStatus();

      console.log("Subscription Status Response:", response);

      if (response && response.subscription) {
        const subscription = response.subscription;
        const paymentMethod = response.paymentMethod;

        const formattedDetails: ISubscriptionDetails = {
          plan: subscription.plan.nickname,
          interval: subscription.plan.interval,
          status: subscription.status,
          startDate: new Date(subscription.start_date * 1000).toLocaleDateString(),
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ).toLocaleDateString(),
          amount: subscription.plan.amount / 100, // Convert cents to dollars
          cancelAt: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toLocaleDateString()
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          paymentMethod: paymentMethod || undefined,
        };
        setCurrentSubscriptionDetails(formattedDetails);
        console.log("Formatted Subscription Details:", formattedDetails);
      } else if (response && response.subscriptions && response.status === "problem_subscription") {
        const subscription = response.subscriptions.data[0];
        // Determine currency symbol
        let symbol = "";
        switch (subscription.currency?.toLowerCase()) {
          case "usd":
            symbol = "$";
            break;
          case "eur":
            symbol = "€";
            break;
          case "gbp":
            symbol = "£";
            break;
          case "jpy":
            symbol = "¥";
            break;
          case "aud":
            symbol = "A$";
            break;
          case "cad":
            symbol = "C$";
            break;
          case "chf":
            symbol = "CHF";
            break;
          case "cny":
            symbol = "¥";
            break;
          case "inr":
            symbol = "₹";
            break;
          default:
            symbol = subscription.currency
              ? subscription.currency.toUpperCase()
              : "";
        }
        const formattedDetails: ISubscriptionDetails = {
          plan: subscription.items.data[0].plan.product,
          interval: subscription.items.data[0].price.recurring.interval,
          status: subscription.status,
          startDate: new Date(
            subscription.start_date * 1000,
          ).toLocaleDateString(),
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ).toLocaleDateString(),
          amount: `${symbol}${(subscription.items.data[0].price.unit_amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          cancelAt: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          paymentMethod: await stripeService.getPaymentMethod(),
        };
        setCurrentSubscriptionDetails(formattedDetails);
        console.log("Formatted Subscription Details (Problem):", formattedDetails);
      } else if (response && response.status === "no_subscription") {
        setCurrentSubscriptionDetails(null);
        console.log("No active subscription found.");
        // Optionally, you can redirect to the pricing page or show a message
        // router.push(`/${EUrlsPages.PRICING}`);
      } else {
        console.log("No subscription details available.");
        setCurrentSubscriptionDetails(null);
      }
        setLoading(false);
    };

    const accountData: TUserAttributes = JSON.parse(
      localStorage.getItem("accountData") || "{}",
    );
    if (accountData.id) {
      if (accountData.name) {
        getSubscription();
      }
    } else {
      localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    }
  }, [router]);

  const PRICING_PLANS = [
    {
      title: "Monthly",
      price: 5,
      interval: "month" as const,
      priceId: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY}`,
    },
    {
      title: "Annual",
      price: 50,
      interval: "year" as const,
      priceId: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY}`,
    },
  ];

  const handleUpdatePayment = async () => {
    try {
      const { url } = await stripeService.updatePaymentMethod();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
    }
  };

  const handleUpgrade = async (newPriceId: string) => {
    try {
      setLoading(true);
      const response = await stripeService.changeSubscription(newPriceId);
      if (response.type === "portal") {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async (newPriceId: string) => {
    try {
      setLoading(true);
      const response = await stripeService.changeSubscription(newPriceId);
      if (response.type === "portal") {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error downgrading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodDisplay = (paymentMethod: any) => {
    console.log("Payment Method:", paymentMethod);
    if (!paymentMethod) {
      return <span className="text-pmdGray text-sm">N/A</span>;
    }
    switch (paymentMethod.type) {
      case "card":
        return (
          <>
            Card
            <br />
            <p className="mt-1 pl-2 border-pmdGray border-l-2 text-pmdGray">
              <span className="capitalize">{paymentMethod.card.brand}</span>{" "}
              •••• {paymentMethod.card.last4}
              <br />
              <span className="text-sm">
                Expires {paymentMethod.card.exp_month}/
                {paymentMethod.card.exp_year}
              </span>
            </p>
          </>
        );
      case "us_bank_account":
        return (
          <>
            {paymentMethod.us_bank_account.bank_name} ••••{" "}
            {paymentMethod.us_bank_account.last4}
            <br />
            <span className="pl-2 border-pmdGray border-l-2 text-pmdGray text-sm">
              US Bank Account
            </span>
          </>
        );
      case "sepa_debit":
        return (
          <>
            {paymentMethod.sepa_debit.bank_name} ••••{" "}
            {paymentMethod.sepa_debit.last4}
            <br />
            <span className="pl-2 border-pmdGray border-l-2 text-pmdGray text-sm">
              SEPA Direct Debit
            </span>
          </>
        );
      case "ideal":
        return `iDEAL - ${paymentMethod.ideal.bank}`;
      case "google_pay":
        return "Google Pay";
      case "apple_pay":
        return "Apple Pay";
      default:
        return paymentMethod.type;
    }
  };

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.PLAN}
      title="Manage Subscription - Piano Music Database"
      description="Learn more about your PMD Plus subscription plan. Get access to exclusive features, priority support, and more with PMD Plus."
      image=""
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3">
          <h1 className="text-center">PMD Plus</h1>
        </div>
        {loading ? (
          <div className="flex justify-center items-center gap-6 mx-auto w-full">
            <div className="mx-auto max-w-md">
              <div className="bg-white shadow-md mt-8 p-6 rounded-lg">
                <h2 className="mb-8 pb-3 border-pmdGrayLight border-b">
                  Subscription Details
                </h2>
                <p className="text-center">Loading...</p>
                <p className="mt-2 text-pmdGrayDark text-center">
                  Details not loading?{" "}
                  <Link href={`/${EUrlsPages.PLAN}`}>
                    <a
                      title="Manage Subscription"
                      className="text-pmdRed hover:text-pmdGray underline cursor-pointer"
                    >
                      Reload
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-6 mx-auto w-full">
            <div className="mx-auto max-w-md">
              <div className="bg-white shadow-md mt-8 p-6 rounded-lg">
                <h2 className="mb-8 pb-3 border-pmdGrayLight border-b">
                  Subscription Details
                </h2>
                {currentSubscriptionDetails ? (
                  <div className="flex flex-col gap-4 text-left">
                    <div
                      id="plan-info"
                      className="flex flex-col gap-1 text-left"
                    >
                      <h3 id="plan-information" className="mb-2">
                        Plan Information
                      </h3>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={`capitalize ml-1 ${
                            currentSubscriptionDetails.status === "active"
                              ? "text-green-600"
                              : currentSubscriptionDetails.status ===
                                  "incomplete"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {currentSubscriptionDetails.status}
                        </span>
                      </p>
                      {currentSubscriptionDetails.cancelAtPeriodEnd && (
                        <p className="mt-1 pl-2 border-red-600 border-l-2 text-red-600">
                          Cancelled - Ends on{" "}
                          {currentSubscriptionDetails.currentPeriodEnd} at{" "}
                          {currentSubscriptionDetails.cancelAt}
                          <br />
                          <a
                            title="Renew to undo cancellation"
                            className="flex flex-row gap-2 cursor-pointer"
                            onClick={handleUpdatePayment}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleUpdatePayment();
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext
                              src={IconOpen}
                              alt=""
                              height={16}
                              width={16}
                              className="z-0"
                            />
                            RENEW to undo cancellation
                          </a>
                        </p>
                      )}
                      <p>
                        <strong>Plan Name:</strong> PMD Plus{" "}
                        {currentSubscriptionDetails &&
                        currentSubscriptionDetails.interval === "year"
                          ? "Yearly"
                          : currentSubscriptionDetails &&
                              currentSubscriptionDetails.interval === "month"
                            ? "Monthly"
                            : ""}
                      </p>
                      {currentSubscriptionDetails.interval &&
                        currentSubscriptionDetails.interval == "year" && (
                          <a
                            title="Change to Monthly"
                            className="flex items-center gap-2 w-full align-middle cursor-pointer"
                            onClick={() =>
                              handleDowngrade(PRICING_PLANS[0].priceId)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleDowngrade(PRICING_PLANS[0].priceId);
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext
                              src={IconOpen}
                              alt=""
                              height={16}
                              width={16}
                              className="z-0"
                            />
                            Change to Monthly
                          </a>
                        )}
                      {currentSubscriptionDetails.interval &&
                        currentSubscriptionDetails.interval == "month" && (
                          <a
                            title="Change to Annual"
                            className="flex items-center gap-2 w-full align-middle cursor-pointer"
                            onClick={() =>
                              handleUpgrade(PRICING_PLANS[1].priceId)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleUpgrade(PRICING_PLANS[1].priceId);
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext
                              src={IconOpen}
                              alt=""
                              height={16}
                              width={16}
                              className="z-0"
                            />
                            Change to Annual
                          </a>
                        )}
                    </div>

                    <hr className="my-4" />

                    <div
                      id="billing-info"
                      className="flex flex-col gap-1 text-left"
                    >
                      <h3 id="billing-information" className="mb-2">
                        Billing Information
                      </h3>
                      <p>
                        <strong>Current Cost:</strong>{" "}
                        {currentSubscriptionDetails.amount}
                      </p>
                      <p>
                        <strong>Billing Interval:</strong>{" "}
                        {currentSubscriptionDetails &&
                        currentSubscriptionDetails.interval === "year"
                          ? "Yearly"
                          : currentSubscriptionDetails &&
                              currentSubscriptionDetails.interval === "month"
                            ? "Monthly"
                            : ""}
                      </p>
                      {currentSubscriptionDetails.paymentMethod && (
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {getPaymentMethodDisplay(
                            currentSubscriptionDetails.paymentMethod,
                          )}
                        </p>
                      )}
                      {currentSubscriptionDetails.cancelAtPeriodEnd ? (
                        <a
                          title="Renew to undo cancellation"
                          className="flex justify-start gap-2 w-full text-left align-middle cursor-pointer"
                          onClick={handleUpdatePayment}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleUpdatePayment();
                            }
                          }}
                          tabIndex={0}
                        >
                          <ImageNext
                            src={IconOpen}
                            alt=""
                            height={16}
                            width={16}
                            className="z-0"
                          />
                          RENEW to Undo Cancellation
                        </a>
                      ) : (
                        <>
                          <a
                            title="Manage Payment"
                            className="flex justify-start gap-2 w-full text-left align-middle cursor-pointer"
                            onClick={handleUpdatePayment}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleUpdatePayment();
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext
                              src={IconOpen}
                              alt=""
                              height={16}
                              width={16}
                              className="z-0"
                            />
                            Manage Payment
                          </a>
                        </>
                      )}
                    </div>

                    <hr className="my-4" />

                    <div id="dates" className="flex flex-col gap-1 text-left">
                      <h3 id="important-dates" className="mb-2">
                        Important Dates
                      </h3>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {currentSubscriptionDetails.startDate}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {currentSubscriptionDetails.currentPeriodEnd}
                      </p>
                      {currentSubscriptionDetails.cancelAtPeriodEnd && (
                        <p className="mt-1 pl-2 border-red-600 border-l-2 text-red-600">
                          Cancelled - Ends on{" "}
                          {currentSubscriptionDetails.currentPeriodEnd} at{" "}
                          {currentSubscriptionDetails.cancelAt}
                          <br />
                          <a
                            title="Renew to undo cancellation"
                            className="flex flex-row gap-2 cursor-pointer"
                            onClick={handleUpdatePayment}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleUpdatePayment();
                              }
                            }}
                            tabIndex={0}
                          >
                            <ImageNext
                              src={IconOpen}
                              alt=""
                              height={16}
                              width={16}
                              className="z-0"
                            />
                            RENEW to undo cancellation
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    id="no-active-subscription"
                    className="flex flex-col justify-center items-center gap-3"
                  >
                    <p>No active subscription found.</p>
                    <p>Check out our plans:</p>
                    <Link href={`/${EUrlsPages.PRICING}`}>
                      <a title="Pricing" className="mb-3 cursor-pointer button">
                        Pricing
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        prevUrl: context.req.headers.referer ?? "",
      },
    };
  }
};

export default PricingPage;
