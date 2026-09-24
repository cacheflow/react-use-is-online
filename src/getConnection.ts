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

export const missingWindow = typeof window === 'undefined';

interface NetworkInformation extends NetworkConnection {
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}

type NetworkNavigator = Navigator & {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
};

export const getNetworkInformation = (): NetworkInformation | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const navigator = window.navigator as NetworkNavigator;
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null
  );
};

export const readConnection = (): NetworkConnection | null => {
  const conn = getNetworkInformation();
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

type EffectiveType = 'offline' | 'slow-2g' | '2g' | '3g' | '4g';

type ConnectionEstimate = {
  effectiveType: EffectiveType;
  rtt: number | null;
  downlink: number | null; // Mbps estimate
  saveData: false;
};

export async function getConnectionEstimate(): Promise<ConnectionEstimate> {
  const url = `https://www.google.com/generate_204?cacheBust=${Date.now()}`;

  try {
    const start = performance.now();
    const response = await fetch(url, {
      cache: 'no-store',
      mode: 'no-cors',
    });

    const end = performance.now();
    const rtt = end - start;

    return {
      effectiveType: classifyEffectiveType(rtt),
      rtt: Math.round(rtt),
      downlink: estimateDownlinkFromRtt(rtt),
      saveData: false,
    };
  } catch {
    return {
      effectiveType: 'offline',
      rtt: null,
      downlink: null,
      saveData: false,
    };
  }
}

function classifyEffectiveType(rtt: number): EffectiveType {
  if (rtt > 2000) {
    return 'slow-2g';
  }
  if (rtt > 1400) {
    return '2g';
  }

  if (rtt > 300) {
    return '3g';
  }

  return '4g';
}

function estimateDownlinkFromRtt(rtt: number): number {
  if (rtt > 2000) {
    return 0.05;
  }

  if (rtt > 1400) {
    return 0.25;
  }

  if (rtt > 300) {
    return 1.5;
  }

  return 10;
}

export const getConnection = async (): Promise<NetworkConnection | null> => {
  if (typeof window === 'undefined') {
    return null;
  }
  const connection = readConnection();
  if (connection) return connection;

  const estimate = await getConnectionEstimate();
  return {
    downlink: estimate.downlink ?? undefined,
    effectiveType:
      estimate.effectiveType === 'offline' ? undefined : estimate.effectiveType,
    rtt: estimate.rtt ?? undefined,
    saveData: estimate.saveData,
  };
};
