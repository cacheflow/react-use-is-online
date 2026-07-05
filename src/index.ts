import { useEffect, useState } from 'react';
import { getConnection, missingWindow } from './getConnection';

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

interface NetworkInformation {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;

  onchange: ((this: NetworkInformation, ev: Event) => any) | null;
}

interface Navigator {
  connection?: NetworkInformation;
}

const INCORRECT_ENV_ERROR =
  "It looks like you're using 'useIsOnline' in an unsupported environment. This package only works in a browser environment.";

const useIsOnline = (): IsOnlineValues => {
  if (missingWindow) {
    return {
      error: INCORRECT_ENV_ERROR,
      isOnline: false,
      isOffline: false,
      connection: null,
    };
  }

  const [isOnline, setOnlineStatus] = useState(window.navigator.onLine);
  const [connection, setConnectionStatus] = useState<NetworkConnection | null>(
    null
  );

  useEffect(() => {
    let active = true;
    let conn: any = null;

    const toggleOnlineStatus = () => {
      if (active) {
        
      }
    };

    const toggleConnectionStatus = async () => {
      const connStatus = await getConnection();
      if (active) {
        setConnectionStatus(connStatus);
      }
    };

    const setup = async () => {
      const currentConnection = await getConnection();
      
      if (!active) {
        return;
      }
      
      setConnectionStatus(currentConnection);

      window.addEventListener('online', toggleOnlineStatus);
      window.addEventListener('offline', toggleOnlineStatus);

      conn =
        (window.navigator as any).connection ||
        (window.navigator as any).mozConnection ||
        (window.navigator as any).webkitConnection;

      if (conn) {
        conn.addEventListener('change', toggleConnectionStatus);
      }
    };

    setup();

    return () => {
      active = false;
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
