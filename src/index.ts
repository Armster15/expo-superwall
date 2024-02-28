import { Platform } from "react-native";
import { ExpoSuperwallModule, emitter } from "./ExpoSuperwallModule";
import type {
  SubscriptionStatus,
  Experiment,
  PaywallInfo,
} from "./ExpoSuperwall.types";

export * from "./ExpoSuperwall.types";

/**
 * Initialize Superwall. Only call this once in your app.
 */
export function configure(superwallApiKey: string) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.configure(superwallApiKey);
  }
}

/**
 * Syncs subscription status with RevenueCat
 */
export function syncSubscriptionStatus(revenueCatApiKey: string) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.syncSubscriptionStatus(revenueCatApiKey);
  }
}

/**
 * Set user ID of current user
 */
export function identify(userId: string) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.identify(userId);
  }
}

/**
 * Resets the userId, on-device paywall assignments, and data stored by Superwall.
 */
export function reset() {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.reset();
  }
}

/**
 * Sets user attributes for use in paywalls and the Superwall dashboard.
 */
export function setUserAttributes(attributes: { [key: string]: any }) {
  if (Platform.OS === "ios") {
    ExpoSuperwallModule.setUserAttributes(attributes);
  }
}

/**
 * Gets subscription status of current user.
 */
export function getSubscriptionStatus() {
  if (Platform.OS === "ios") {
    return ExpoSuperwallModule.getSubscriptionStatus() as SubscriptionStatus;
  }
  return undefined;
}

/**
 * The heart of the SDK. Register events throughout your app and then in the Superwall dashboard configure what events show a paywall.
 *
 * Superwall recommends that you `register` everything in your app, so you can paywall basically anything in your app through the dashboard without having to push new code/builds.
 *
 * You can also use the promisified nature of the register function to choose whether the user can access the feature even if they don’t make a purchase.
 *
 * @example
 * ```ts
 * Superwall.register("StartWorkout").then(() => {
 *   navigation.startWorkout();
 * });
 * ```
 *
 * This is the equivalent of the following in Swift:
 * ```swift
 * Superwall.shared.register(event: "StartWorkout") {
 *   navigation.startWorkout()
 * }
 * ```
 */
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

/**
 * @group Events
 */
export function addPaywallDismissListener(
  listener: (paywallInfo: PaywallInfo) => void
) {
  return emitter?.addListener(ON_PAYWALL_DISMSS, listener);
}

/**
 * @group Events
 */
export function addPaywallPresentListener(
  listener: (paywallInfo: PaywallInfo) => void
) {
  return emitter?.addListener(ON_PAYWALL_PRESENT, listener);
}

/**
 * @group Events
 */
export function addPaywallErrorListener(
  listener: (res: { description: string }) => void
) {
  return emitter?.addListener(ON_PAYWALL_ERROR, listener);
}

/**
 * @group Events
 */
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

/**
 * Handle custom paywall actions.
 *
 * Superwall allows you to create buttons that can have custom actions.
 * Use this event listener to listen to custom action events so you can handle them accordingly.
 *
 * @example
 * ```ts
 * const listener = Superwall.addCustomPaywallActionListener(({ name }) => {
 *  if(name === "Help Center") {
 *    HelpCenterManager.present();
 *  }
 * })
 *
 * listener.remove(); // To remove event listener if need be
 * ```
 *
 * @group Events
 */
export function addCustomPaywallActionListener(
  listener: (res: { name: string }) => void
) {
  return emitter?.addListener(ON_CUSTOM_PAYWALL_ACTION, listener);
}
