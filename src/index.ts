import { useEffect, useState } from 'react';
import { getNetworkInformation, getConnection } from './getConnection';

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

const useIsOnline = (): IsOnlineValues => {
  const missingWindow = typeof window === 'undefined';
  const [isOnline, setOnlineStatus] = useState(() =>
    missingWindow ? false : window.navigator.onLine
  );
  const [connection, setConnectionStatus] = useState<NetworkConnection | null>(
    null
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return void 0;
    }
    const toggleOnlineStatus = () => setOnlineStatus(window.navigator.onLine);
    let active = true;
    const toggleConnectionStatus = async () => {
      const connection = await getConnection();
      if (active) setConnectionStatus(connection);
    };
    const conn = getNetworkInformation();

    window.addEventListener('online', toggleOnlineStatus);
    window.addEventListener('offline', toggleOnlineStatus);
    conn?.addEventListener?.('change', toggleConnectionStatus);

    // Subscribe before reading so changes during mounting cannot be missed.
    toggleOnlineStatus();
    toggleConnectionStatus();

    return () => {
      active = false;
      window.removeEventListener('online', toggleOnlineStatus);
      window.removeEventListener('offline', toggleOnlineStatus);
      conn?.removeEventListener?.('change', toggleConnectionStatus);
    };
  }, []);

  return {
    error: missingWindow ? INCORRECT_ENV_ERROR : null,
    isOffline: missingWindow ? false : !isOnline,
    isOnline,
    connection,
  };
};

export { useIsOnline };
