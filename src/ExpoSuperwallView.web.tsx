import * as React from 'react';

import { ExpoSuperwallViewProps } from './ExpoSuperwall.types';

export default function ExpoSuperwallView(props: ExpoSuperwallViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
