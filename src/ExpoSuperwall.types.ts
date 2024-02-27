export enum SubscriptionStatus {
  /** The user has an active subscription */
  Active = 0,
  /** The user doesn't have an active subscription */
  Inactive = 1,
  /** The subscription status is unknown */
  Unknown = 2,
}

export type Experiment = {
  experiment_id: string;
  trigger_experiment_group_id: string;
  variant_id: string;
  variant_type: "HOLDOUT" | "TREATMENT";
};

export type Product = {
  /** The type of product */
  product: "primary" | "secondary" | "tertiary";
  productId: string;
};

export type PaywallInfo = {
  /** The identifier set for this paywall in the Superwall dashboard. */
  identifier: string;

  /**
   * The trigger experiment that caused the paywall to present.
   *
   * An experiment is a set of paywall variants determined by probabilities.
   * An experiment will result in a user seeing a paywall unless they are in a holdout group.
   */
  experiment: Experiment;

  /** The trigger session ID associated with the paywall. */
  triggerSessionId?: string;

  /** The products associated with the paywall. */
  products: Product[];

  /** An array of product IDs that this paywall is displaying in `[Primary, Secondary, Tertiary]` order. */
  productIds: string[];

  /** The name set for this paywall in Superwall's web dashboard. */
  name: string;

  /** The URL where this paywall is hosted. */
  url: string;

  /** The name of the event that triggered this Paywall. Defaults to `nil` if `triggeredByEvent` is false. */
  presentedByEventWithName?: string;

  /** The Superwall internal id (for debugging) of the event that triggered this Paywall. Defaults to `nil` if `triggeredByEvent` is false. */
  presentedByEventWithId?: string;

  /** The ISO date string describing when the event triggered this paywall. Defaults to `nil` if `triggeredByEvent` is false. */
  presentedByEventAt?: string;

  /** How the paywall was presented, either 'programmatically', 'identifier', or 'event'. */
  presentedBy: "programmatically" | "identifier" | "event";

  /** The source function that retrieved the paywall. Either `implicit`, `getPaywall`, or `register`. `nil` only when preloading. */
  presentationSourceType?: "implicit" | "getPaywall" | "register";

  /** An iso date string indicating when the paywall response began loading. */
  responseLoadStartTime?: string;

  /** An iso date string indicating when the paywall response finished loading. */
  responseLoadCompleteTime?: string;

  /** An iso date string indicating when the paywall response failed to load. */
  responseLoadFailTime?: string;

  /** The time in seconds it took to load the paywall response. */
  responseLoadDuration?: number;

  /** An iso date string indicating when the paywall webview began loading. */
  webViewLoadStartTime?: string;

  /** An iso date string indicating when the paywall webview finished loading. */
  webViewLoadCompleteTime?: string;

  /** An iso date string indicating when the paywall webview failed to load. */
  webViewLoadFailTime?: string;

  /** The time in seconds it took to load the paywall website. */
  webViewLoadDuration?: number;

  /** An iso date string indicating when the paywall products began loading. */
  productsLoadStartTime?: string;

  /** An iso date string indicating when the paywall products finished loading. */
  productsLoadCompleteTime?: string;

  /** An iso date string indicating when the paywall products failed to load. */
  productsLoadFailTime?: string;

  /** The time in seconds it took to load the paywall products. */
  productsLoadDuration?: number;

  /** The paywall.js version installed on the paywall website.  */
  paywalljsVersion?: string;

  /** Indicates whether the paywall is showing free trial content */
  isFreeTrialAvailable: boolean;

  /** Indicates whether the ``Superwall/register(event:params:handler:feature:)`` `feature` block executes or not. */
  featureGatingBehavior: "GATED" | "NON_GATED" | null;

  /**
   * An enum describing why this paywall was last closed. `none` if not yet closed.
   * Swift enum is PaywallCloseReason
   */
  closeReason: unknown;
};
