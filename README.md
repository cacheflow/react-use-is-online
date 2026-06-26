# use-is-online

Simple React Hook for checking if you're connected to the internet.

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

> **Note:** The `connection` object will be `null` in browsers that do not support it (e.g. Safari, Firefox) or in Server-Side Rendering (SSR) environments.

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
