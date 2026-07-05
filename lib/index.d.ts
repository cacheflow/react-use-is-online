export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';
export type ConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
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
declare const useIsOnline: () => IsOnlineValues;
export { useIsOnline };
