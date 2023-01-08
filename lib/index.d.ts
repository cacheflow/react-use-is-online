export interface IValues {
    error: null | string;
    isOffline: boolean;
    isOnline: boolean;
}
declare const useIsOnline: () => IValues;
export { useIsOnline };
