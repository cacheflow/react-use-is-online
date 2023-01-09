"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsOnline = void 0;
var react_1 = require("react");
var NOT_BROWSER_ENV_ERROR = 'useIsOnline only works in a browser environment.';
var notABrowserEnv = typeof window === 'undefined';
var navigatorNotPresent = typeof navigator === 'undefined';
var useIsOnline = function () {
    if (notABrowserEnv || navigatorNotPresent) {
        return {
            error: NOT_BROWSER_ENV_ERROR,
            isOnline: false,
            isOffline: false,
        };
    }
    var _a = (0, react_1.useState)(window.navigator.onLine), isOnline = _a[0], setOnlineStatus = _a[1];
    (0, react_1.useEffect)(function () {
        var toggleOnlineStatus = function () { return setOnlineStatus(window.navigator.onLine); };
        window.addEventListener('online', toggleOnlineStatus);
        window.addEventListener('offline', toggleOnlineStatus);
        return function () {
            window.removeEventListener('online', toggleOnlineStatus);
            window.removeEventListener('offline', toggleOnlineStatus);
        };
    }, [isOnline]);
    return {
        error: null,
        isOffline: !isOnline,
        isOnline: isOnline,
    };
};
exports.useIsOnline = useIsOnline;
