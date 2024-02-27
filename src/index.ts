import { Platform } from "react-native";
import { ExpoSuperwallModule, emitter } from "./ExpoSuperwallModule";
import type {
  SubscriptionStatus,
  Experiment,
  PaywallInfo,
} from "./ExpoSuperwall.types";

export function configure(superwallApiKey: string) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.configure(superwallApiKey);
  }
}

/** Syncs subscription status with RevenueCat */
export function syncSubscriptionStatus(revenueCatApiKey: string) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.syncSubscriptionStatus(revenueCatApiKey);
  }
}

export function identify(userId: string) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.identify(userId);
  }
}

export function reset() {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.reset();
  }
}

export function setUserAttributes(attributes: { [key: string]: any }) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.setUserAttributes(attributes);
  }
}

export function getSubscriptionStatus() {
  if (Platform.OS === "ios") {
    return ExpoSuperwallModule.getSubscriptionStatus() as SubscriptionStatus;
  }
  return undefined;
}

export async function register(
  event: string,
  params?: { [name: string]: any }
): Promise<void> {
  if (Platform.OS === "ios") {
    return ExpoSuperwallModule.register(event, params);
  }
}

export async function getPresentationResult(
  forEvent: string,
  params?: { [name: string]: any }
): Promise<
  | { value: "eventNotFound" }
  | { value: "noRuleMatch" }
  | { value: "paywall"; experiment: Experiment }
  | { value: "holdout"; experiment: Experiment }
  | { value: "userIsSubscribed" }
  | { value: "paywallNotAvailable" }
  | undefined
> {
  if (Platform.OS === "ios") {
    return ExpoSuperwallModule.getPresentationResult(forEvent, params);
  }
  return undefined;
}

const ON_PAYWALL_DISMSS = "onPaywallDismiss";
const ON_PAYWALL_PRESENT = "onPaywallPresent";
const ON_PAYWALL_ERROR = "onPaywallError";
const ON_PAYWALL_SKIP = "onPaywallSkip";
const ON_CUSTOM_PAYWALL_ACTION = "onCustomPaywallAction";

export function addPaywallDismissListener(
  listener: (paywallInfo: PaywallInfo) => void
) {
  return emitter?.addListener(ON_PAYWALL_DISMSS, listener);
}

export function addPaywallPresentListener(
  listener: (paywallInfo: PaywallInfo) => void
) {
  return emitter?.addListener(ON_PAYWALL_PRESENT, listener);
}

export function addPaywallErrorListener(
  listener: (res: { description: string }) => void
) {
  return emitter?.addListener(ON_PAYWALL_ERROR, listener);
}

export function addPaywallSkipListener(
  listener: (
    res:
      | {
          /** Paywall not shown because user is subscribed */
          reason: "userIsSubscribed";
        }
      | {
          /** Paywall not shown because user is in a holdout group in Experiment */
          reason: "holdout";
          experimentId: string;
          experiment: Experiment | null;
        }
      | {
          /** Paywall not shown because user doesn't match any rules */
          reason: "noRuleMatch";
        }
      | {
          /** Paywall not shown because this event isn't part of a campaign */
          reason: "notPartOfCampaign";
        }
  ) => void
) {
  return emitter?.addListener(ON_PAYWALL_SKIP, listener);
}

export function addCustomPaywallActionListener(
  listener: (res: { name: string }) => void
) {
  return emitter?.addListener(ON_CUSTOM_PAYWALL_ACTION, listener);
}
