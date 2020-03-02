# use-is-online

Simple React Hook for checking if you're connected to the internet.

Read about [Hooks](https://reactjs.org/docs/hooks-intro.html) feature.


## Installation

```
yarn add use-is-online --save 
```

## Examples

```javascript
import React, { Fragment } from 'react';
import { useIsOnline } from 'use-is-online';
import InternetEnabledFeature from './InternetConnectedFeature';
import OfflineEnabledFeature from './OfflineEnabledFeature';

Using useIsOnline to display different messages if connectivity is present. 

const BasicApp = () => {
  const { isOnline, isOffline, error } = useIsOnline();

  return (
    <Fragment>
      {error ? <div> there's an error {error} </div> : null }
      {isOnline ? <div> We're online! </div> : <div> Uh-oh looks like you should connect to the internet </div>}
      {isOffline ? <div> We're offline! You can still post great cat photos! </div> : <div> We're online. </div>}
    </Fragment>
  );
};

Using useIsOnline to enable certain features based on connectivity.

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
