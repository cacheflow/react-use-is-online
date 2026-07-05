"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsOnline = void 0;
var react_1 = require("react");
var getConnection_1 = require("./getConnection");
var INCORRECT_ENV_ERROR = "It looks like you're using 'useIsOnline' in an unsupported environment. This package only works in a browser environment.";
var useIsOnline = function () {
    if (getConnection_1.missingWindow) {
        return {
            error: INCORRECT_ENV_ERROR,
            isOnline: false,
            isOffline: false,
            connection: null,
        };
    }
    var _a = (0, react_1.useState)(window.navigator.onLine), isOnline = _a[0], setOnlineStatus = _a[1];
    var _b = (0, react_1.useState)(null), connection = _b[0], setConnectionStatus = _b[1];
    (0, react_1.useEffect)(function () {
        var active = true;
        var conn = null;
        var toggleOnlineStatus = function () {
            if (active) {
            }
        };
        var toggleConnectionStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
            var connStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, getConnection_1.getConnection)()];
                    case 1:
                        connStatus = _a.sent();
                        if (active) {
                            setConnectionStatus(connStatus);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
            var currentConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, getConnection_1.getConnection)()];
                    case 1:
                        currentConnection = _a.sent();
                        if (!active) {
                            return [2 /*return*/];
                        }
                        setConnectionStatus(currentConnection);
                        window.addEventListener('online', toggleOnlineStatus);
                        window.addEventListener('offline', toggleOnlineStatus);
                        conn =
                            window.navigator.connection ||
                                window.navigator.mozConnection ||
                                window.navigator.webkitConnection;
                        if (conn) {
                            conn.addEventListener('change', toggleConnectionStatus);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        setup();
        return function () {
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
        isOnline: isOnline,
        connection: connection,
    };
};
exports.useIsOnline = useIsOnline;
