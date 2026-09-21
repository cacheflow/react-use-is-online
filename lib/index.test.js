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
var react_1 = require("@testing-library/react");
var index_1 = require("./index");
var getConnection_1 = require("./getConnection");
var setNavigator = function (key, value) {
    Object.defineProperty(window.navigator, key, { configurable: true, value: value });
};
var createConnection = function () {
    return Object.assign(new EventTarget(), {
        downlink: 10,
        effectiveType: '4g',
        rtt: 50,
        saveData: false,
        type: 'wifi',
    });
};
describe('useIsOnline', function () {
    var originalFetch = global.fetch;
    beforeEach(function () {
        setNavigator('onLine', true);
        for (var _i = 0, _a = ['connection', 'mozConnection', 'webkitConnection']; _i < _a.length; _i++) {
            var key = _a[_i];
            setNavigator(key, undefined);
        }
        // A pending fetch must never delay connectivity subscriptions.
        global.fetch = jest.fn(function () { return new Promise(function () { }); });
    });
    afterEach(function () {
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });
    it('returns browser status immediately while the fallback probe is pending', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
            expect(result.current).toEqual({
                isOnline: true,
                isOffline: false,
                connection: null,
                error: null,
            });
            expect(global.fetch).toHaveBeenCalledTimes(1);
            return [2 /*return*/];
        });
    }); });
    it('initializes offline and handles immediate online/offline transitions', function () {
        setNavigator('onLine', false);
        var result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
        expect(result.current.isOffline).toBe(true);
        setNavigator('onLine', true);
        (0, react_1.fireEvent)(window, new Event('online'));
        expect(result.current.isOnline).toBe(true);
        expect(result.current.isOffline).toBe(false);
        setNavigator('onLine', false);
        (0, react_1.fireEvent)(window, new Event('offline'));
        expect(result.current.isOnline).toBe(false);
        expect(result.current.isOffline).toBe(true);
    });
    it.each(['connection', 'mozConnection', 'webkitConnection'])('reads and updates %s on the connection object', function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var conn, result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    conn = createConnection();
                    setNavigator(key, conn);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () { return expect(result.current.connection).not.toBeNull(); })];
                case 1:
                    _b.sent();
                    expect(result.current.connection).toEqual({
                        downlink: 10,
                        effectiveType: '4g',
                        rtt: 50,
                        saveData: false,
                        type: 'wifi',
                    });
                    conn.downlink = 1.5;
                    conn.effectiveType = '3g';
                    conn.saveData = true;
                    return [4 /*yield*/, (0, react_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                conn.dispatchEvent(new Event('change'));
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _b.sent();
                    expect(result.current.connection).toEqual(expect.objectContaining({
                        downlink: 1.5,
                        effectiveType: '3g',
                        saveData: true,
                    }));
                    _a = expect;
                    return [4 /*yield*/, (0, getConnection_1.getConnection)()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toEqual(result.current.connection);
                    expect(global.fetch).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('supports partial information without inventing measurements', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNavigator('connection', { saveData: true });
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () { return expect(result.current.connection).not.toBeNull(); })];
                case 1:
                    _a.sent();
                    expect(result.current.connection).toEqual({
                        downlink: undefined,
                        effectiveType: undefined,
                        rtt: undefined,
                        saveData: true,
                        type: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('removes the exact subscribed window and connection listeners', function () {
        var conn = createConnection();
        setNavigator('connection', conn);
        var addWindow = jest.spyOn(window, 'addEventListener');
        var removeWindow = jest.spyOn(window, 'removeEventListener');
        var addConnection = jest.spyOn(conn, 'addEventListener');
        var removeConnection = jest.spyOn(conn, 'removeEventListener');
        var unmount = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).unmount;
        unmount();
        var _loop_1 = function (event_1) {
            var subscription = addWindow.mock.calls.find(function (_a) {
                var type = _a[0];
                return type === event_1;
            });
            expect(subscription).toBeDefined();
            expect(removeWindow).toHaveBeenCalledWith(event_1, subscription[1]);
        };
        for (var _i = 0, _a = ['online', 'offline']; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            _loop_1(event_1);
        }
        expect(addConnection).toHaveBeenCalledWith('change', expect.any(Function));
        expect(removeConnection).toHaveBeenCalledWith('change', addConnection.mock.calls[0][1]);
    });
    it.each([
        [100, '4g', 10],
        [500, '3g', 1.5],
        [1500, '2g', 0.25],
        [2500, 'slow-2g', 0.05],
    ])('restores estimates for %sms probes', function (latency, effectiveType, downlink) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = jest.fn().mockResolvedValue({});
                    jest
                        .spyOn(performance, 'now')
                        .mockReturnValueOnce(0)
                        .mockReturnValueOnce(latency);
                    _a = expect;
                    return [4 /*yield*/, (0, getConnection_1.getConnectionEstimate)()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        effectiveType: effectiveType,
                        downlink: downlink,
                        rtt: latency,
                        saveData: false,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('populates hook connection details using the fallback', function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = 0;
                    jest.spyOn(performance, 'now').mockImplementation(function () { return now; });
                    global.fetch = jest.fn().mockImplementation(function () {
                        now = 500;
                        return Promise.resolve({});
                    });
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            return expect(result.current.connection).toEqual({
                                effectiveType: '3g',
                                downlink: 1.5,
                                rtt: 500,
                                saveData: false,
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('preserves browser online status when a fallback probe fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            return expect(result.current.connection).toEqual({
                                effectiveType: undefined,
                                downlink: undefined,
                                rtt: undefined,
                                saveData: false,
                            });
                        })];
                case 1:
                    _a.sent();
                    expect(result.current.isOnline).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('ignores a fallback result after unmounting', function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveProbe, _a, result, unmount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    global.fetch = jest.fn(function () {
                        return new Promise(function (resolve) {
                            resolveProbe = resolve;
                        });
                    });
                    _a = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }), result = _a.result, unmount = _a.unmount;
                    unmount();
                    return [4 /*yield*/, (0, react_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                resolveProbe({});
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _b.sent();
                    expect(result.current.connection).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
