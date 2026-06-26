import { useEffect, useState } from 'react';

export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

export type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'none'
  | 'wifi'
  | 'wimax'
  | 'other'
  | 'unknown';

export interface NetworkConnection {
  downlink?: number;
  effectiveType?: EffectiveConnectionType;
  rtt?: number;
  saveData?: boolean;
  type?: ConnectionType;
}

export interface IsOnlineValues {
  error: null | string;
  isOffline: boolean;
  isOnline: boolean;
  connection: NetworkConnection | null;
}

const INCORRECT_ENV_ERROR =
  "It looks like you're using 'useIsOnline' in an unsupported environment. This package only works in a browser environment.";

const missingWindow = typeof window === 'undefined';

const missingNavigator = typeof navigator === 'undefined';

const getConnection = (): NetworkConnection | null => {
  if (missingWindow || missingNavigator) {
    return null;
  }
  const conn =
    (window.navigator as any).connection ||
    (window.navigator as any).mozConnection ||
    (window.navigator as any).webkitConnection;

  if (!conn) {
    return null;
  }

  return {
    downlink: conn.downlink,
    effectiveType: conn.effectiveType,
    rtt: conn.rtt,
    saveData: conn.saveData,
    type: conn.type,
  };
};

const useIsOnline = (): IsOnlineValues => {
  if (missingWindow || missingNavigator) {
    return {
      error: INCORRECT_ENV_ERROR,
      isOnline: false,
      isOffline: false,
      connection: null,
    };
  }

  const [isOnline, setOnlineStatus] = useState(window.navigator.onLine);
  const [connection, setConnectionStatus] = useState<NetworkConnection | null>(getConnection());

  useEffect(() => {
    const toggleOnlineStatus = () => setOnlineStatus(window.navigator.onLine);
    const toggleConnectionStatus = () => setConnectionStatus(getConnection());

    window.addEventListener('online', toggleOnlineStatus);
    window.addEventListener('offline', toggleOnlineStatus);

    const conn =
      (window.navigator as any).connection ||
      (window.navigator as any).mozConnection ||
      (window.navigator as any).webkitConnection;

    if (conn) {
      conn.addEventListener('change', toggleConnectionStatus);
    }

    return () => {
      window.removeEventListener('online', toggleOnlineStatus);
      window.removeEventListener('offline', toggleOnlineStatus);
      if (conn) {
        conn.removeEventListener('change', toggleConnectionStatus);
      }
    };
  }, []);

  return {
    error: null,
    isOffline: !isOnline,
    isOnline,
    connection,
  };
};

export { useIsOnline };
