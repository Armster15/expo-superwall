import { Platform } from "react-native";
import {
  requireNativeModule,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
export const ExpoSuperwallModule =
  Platform.OS === "ios" ? requireNativeModule("ExpoSuperwall") : undefined;

export const emitter =
  ExpoSuperwallModule === undefined
    ? undefined
    : new EventEmitter(ExpoSuperwallModule);

export { Subscription };
