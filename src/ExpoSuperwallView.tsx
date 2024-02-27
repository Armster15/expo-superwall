import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoSuperwallViewProps } from './ExpoSuperwall.types';

const NativeView: React.ComponentType<ExpoSuperwallViewProps> =
  requireNativeViewManager('ExpoSuperwall');

export default function ExpoSuperwallView(props: ExpoSuperwallViewProps) {
  return <NativeView {...props} />;
}
