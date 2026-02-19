import { useEffect, useState } from 'react';

export interface IsOnlineValues {
  error: null | string;
  isOffline: boolean;
  isOnline: boolean;
}

const INCORRECT_ENV_ERROR =
  "It looks like you're using 'useIsOnline' in an unsupported environment. This package only works in a browser environment.";

const missingWindow = typeof window === 'undefined';

const missingNavigator = typeof navigator === 'undefined';

const useIsOnline = (): IsOnlineValues => {
  if (missingWindow || missingNavigator) {
    return {
      error: INCORRECT_ENV_ERROR,
      isOnline: false,
      isOffline: false,
    };
  }

  const [isOnline, setOnlineStatus] = useState(window.navigator.onLine);

  useEffect(() => {
    const toggleOnlineStatus = () => setOnlineStatus(window.navigator.onLine);

    window.addEventListener('online', toggleOnlineStatus);
    window.addEventListener('offline', toggleOnlineStatus);

    return () => {
      window.removeEventListener('online', toggleOnlineStatus);
      window.removeEventListener('offline', toggleOnlineStatus);
    };
  }, [isOnline]);

  return {
    error: null,
    isOffline: !isOnline,
    isOnline,
  };
};

export { useIsOnline };
