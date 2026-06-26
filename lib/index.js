"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsOnline = void 0;
var react_1 = require("react");
var INCORRECT_ENV_ERROR = "It looks like you're using 'useIsOnline' in an unsupported environment. This package only works in a browser environment.";
var missingWindow = typeof window === 'undefined';
var missingNavigator = typeof navigator === 'undefined';
var getConnection = function () {
    if (missingWindow || missingNavigator) {
        return null;
    }
    var conn = window.navigator.connection ||
        window.navigator.mozConnection ||
        window.navigator.webkitConnection;
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
var useIsOnline = function () {
    if (missingWindow || missingNavigator) {
        return {
            error: INCORRECT_ENV_ERROR,
            isOnline: false,
            isOffline: false,
            connection: null,
        };
    }
    var _a = (0, react_1.useState)(window.navigator.onLine), isOnline = _a[0], setOnlineStatus = _a[1];
    var _b = (0, react_1.useState)(getConnection()), connection = _b[0], setConnectionStatus = _b[1];
    (0, react_1.useEffect)(function () {
        var toggleOnlineStatus = function () { return setOnlineStatus(window.navigator.onLine); };
        var toggleConnectionStatus = function () { return setConnectionStatus(getConnection()); };
        window.addEventListener('online', toggleOnlineStatus);
        window.addEventListener('offline', toggleOnlineStatus);
        var conn = window.navigator.connection ||
            window.navigator.mozConnection ||
            window.navigator.webkitConnection;
        if (conn) {
            conn.addEventListener('change', toggleConnectionStatus);
        }
        return function () {
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
        isOnline: isOnline,
        connection: connection,
    };
};
exports.useIsOnline = useIsOnline;
