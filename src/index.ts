import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoSuperwall.web.ts
// and on native platforms to ExpoSuperwall.ts
import ExpoSuperwallModule from './ExpoSuperwallModule';
import ExpoSuperwallView from './ExpoSuperwallView';
import { ChangeEventPayload, ExpoSuperwallViewProps } from './ExpoSuperwall.types';

// Get the native constant value.
export const PI = ExpoSuperwallModule.PI;

export function hello(): string {
  return ExpoSuperwallModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoSuperwallModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoSuperwallModule ?? NativeModulesProxy.ExpoSuperwall);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoSuperwallView, ExpoSuperwallViewProps, ChangeEventPayload };
