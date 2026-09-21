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
exports.getConnection = exports.getConnectionEstimate = exports.readConnection = exports.getNetworkInformation = exports.missingWindow = void 0;
exports.missingWindow = typeof window === 'undefined';
var getNetworkInformation = function () {
    if (typeof window === 'undefined')
        return null;
    var navigator = window.navigator;
    return (navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection ||
        null);
};
exports.getNetworkInformation = getNetworkInformation;
var readConnection = function () {
    var conn = (0, exports.getNetworkInformation)();
    if (!conn)
        return null;
    return {
        downlink: conn.downlink,
        effectiveType: conn.effectiveType,
        rtt: conn.rtt,
        saveData: conn.saveData,
        type: conn.type,
    };
};
exports.readConnection = readConnection;
function getConnectionEstimate() {
    return __awaiter(this, void 0, void 0, function () {
        var url, start, response, end, rtt, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = "https://www.google.com/generate_204?cacheBust=".concat(Date.now());
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    start = performance.now();
                    return [4 /*yield*/, fetch(url, {
                            cache: 'no-store',
                            mode: 'no-cors',
                        })];
                case 2:
                    response = _b.sent();
                    end = performance.now();
                    rtt = end - start;
                    return [2 /*return*/, {
                            effectiveType: classifyEffectiveType(rtt),
                            rtt: Math.round(rtt),
                            downlink: estimateDownlinkFromRtt(rtt),
                            saveData: false,
                        }];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, {
                            effectiveType: 'offline',
                            rtt: null,
                            downlink: null,
                            saveData: false,
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getConnectionEstimate = getConnectionEstimate;
function classifyEffectiveType(rtt) {
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
function estimateDownlinkFromRtt(rtt) {
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
var getConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, estimate;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (typeof window === 'undefined')
                    return [2 /*return*/, null];
                connection = (0, exports.readConnection)();
                if (connection)
                    return [2 /*return*/, connection];
                return [4 /*yield*/, getConnectionEstimate()];
            case 1:
                estimate = _c.sent();
                return [2 /*return*/, {
                        downlink: (_a = estimate.downlink) !== null && _a !== void 0 ? _a : undefined,
                        effectiveType: estimate.effectiveType === 'offline' ? undefined : estimate.effectiveType,
                        rtt: (_b = estimate.rtt) !== null && _b !== void 0 ? _b : undefined,
                        saveData: estimate.saveData,
                    }];
        }
    });
}); };
exports.getConnection = getConnection;
