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
export declare const missingWindow: boolean;
type EffectiveType = 'offline' | 'slow-2g' | '2g' | '3g' | '4g';
type ConnectionEstimate = {
  effectiveType: EffectiveType;
  rtt: number | null;
  downlink: number | null;
  saveData: false;
};
export declare function getConnectionEstimate(): Promise<ConnectionEstimate>;
export declare const getConnection: () => Promise<ConnectionEstimate | null>;
export {};
