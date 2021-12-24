# use-is-online

Simple React Hook for checking if you're connected to the internet.

Read about [Hooks](https://reactjs.org/docs/hooks-intro.html) feature.


[![npm Version](https://img.shields.io/npm/v/react-use-is-online.svg)](https://www.npmjs.com/package/react-use-is-online) [![License](https://img.shields.io/npm/l/react-use-is-online.svg)](https://www.npmjs.com/package/react-use-is-online) [![Linux Build Status](https://travis-ci.com/cacheflow/react-use-is-online.svg?branch=master)](https://travis-ci.com/cacheflow/react-use-is-online) [![Bundle size](https://badgen.net/bundlephobia/min/react-use-is-online?label=size)](https://bundlephobia.com/result?p=react-use-is-online) [![Bundle size](https://badgen.net/bundlephobia/minzip/react-use-is-online?label=gzip%20size)](https://bundlephobia.com/result?p=react-use-is-online)


## Installation

```
yarn add react-use-is-online --save 
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


