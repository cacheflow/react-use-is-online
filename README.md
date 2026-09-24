# use-is-online

Simple React Hook for observing the browser's online/offline status.

Read about [Hooks](https://reactjs.org/docs/hooks-intro.html) feature.


[![npm Version](https://img.shields.io/npm/v/react-use-is-online.svg)](https://www.npmjs.com/package/react-use-is-online) [![License](https://img.shields.io/npm/l/react-use-is-online.svg)](https://www.npmjs.com/package/react-use-is-online) [![Linux Build Status](https://travis-ci.com/cacheflow/react-use-is-online.svg?branch=master)]


## Installation

### Installing with Yarn 
```
yarn add react-use-is-online
```

#### Installing with NPM 

```
npm install react-use-is-online 
```


## Demo 
https://stackblitz.com/edit/react-use-is-online1

## Examples

Using useIsOnline to display different messages if connectivity is present. 

```javascript
import React, { Fragment } from 'react';
import { useIsOnline } from 'react-use-is-online';
import InternetEnabledFeature from './InternetConnectedFeature';
import OfflineEnabledFeature from './OfflineEnabledFeature';


const BasicApp = () => {
  const { isOnline, isOffline, error } = useIsOnline();

  return (
    <Fragment>
      {isOnline ? <div> We're online! </div> : <div> Uh-oh looks like you should connect to the internet </div>}
      {isOffline ? <div> We're offline! You can still post great cat photos! </div> : <div> We're not online. </div>}
    </Fragment>
  );
};
```

Using useIsOnline to enable certain features based on connectivity.


```javascript
import React, { Fragment } from 'react';
import { useIsOnline } from 'react-use-is-online';
import InternetEnabledFeature from './InternetConnectedFeature';
import OfflineEnabledFeature from './OfflineEnabledFeature';


const AdvancedApp = () => {
  const { isOnline, isOffline, error } = useIsOnline();

  return (
    <Fragment>
      {
        isOnline ? <InternetEnabledFeature/> : <OfflineFeature/>
      }
    </Fragment>
  );
};
```


## Network Connection Details (v1.4.0+)

`useIsOnline` returns a `connection` object containing properties from the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). 

> **Note:** When the Network Information API is unavailable, the hook falls back to request-timing estimates of effective connection type, RTT, and downlink. `connection` is `null` while details are loading and during server rendering.

```javascript
import React from 'react';
import { useIsOnline } from 'react-use-is-online';

const NetworkSpeedApp = () => {
  const { isOnline, connection } = useIsOnline();

  if (!isOnline) {
    return <div>You are currently offline.</div>;
  }

  return (
    <div>
      <p>Status: Online</p>
      {connection ? (
        <ul>
          <li>Effective Type: {connection.effectiveType} (e.g., '4g')</li>
          <li>Estimated Downlink: {connection.downlink} Mbps</li>
          <li>Estimated RTT: {connection.rtt} ms</li>
          <li>Data Saver Mode: {connection.saveData ? 'Enabled' : 'Disabled'}</li>
          <li>Connection Type: {connection.type} (e.g., 'wifi')</li>
        </ul>
      ) : (
        <p>Network information details not supported by this browser.</p>
      )}
    </div>
  );
};
```

## Connectivity behavior

Online status reflects `navigator.onLine`; it is a browser signal, not a guarantee
that the internet or your backend is reachable. Use it for connectivity hints,
and handle request failures independently.

Connection details use the browser's Network Information API when available,
including prefixed implementations. Otherwise, `getConnectionEstimate()` times a
request to Google's `generate_204` endpoint and uses the existing latency thresholds
to estimate effective connection type and downlink. These are approximate estimates.
The fallback returns `saveData: false` and does not identify a physical connection
type such as Wi-Fi. Failed probes leave RTT, downlink, and effective type undefined
in the hook's connection object; online status still follows `navigator.onLine`.

During server rendering, both status booleans are `false`, `connection` is `null`,
and `error` describes the browser-only environment. This fallback prevents access
to browser globals; it does not guarantee identical server and client markup.


- Register connectivity listeners synchronously and refresh status after subscribing.
- Preserve `getConnectionEstimate` and automatic connection estimates when network
  information is unavailable, without delaying online/offline subscriptions.
- Fix connection change coverage and remove unused Enzyme production dependencies.
