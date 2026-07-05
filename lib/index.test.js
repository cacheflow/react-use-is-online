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
if (!global.fetch) {
    global.fetch = (function () { return Promise.resolve({}); });
}
describe('useIsOnline in browser', function () {
    var mockFetch;
    var mockPerformanceNow;
    var setOnLine = function (onLine) {
        Object.defineProperty(window.navigator, 'onLine', {
            configurable: true,
            value: onLine,
        });
    };
    var setConnection = function (connection) {
        Object.defineProperty(window.navigator, 'connection', {
            configurable: true,
            value: connection,
        });
    };
    beforeEach(function () {
        jest.clearAllMocks();
        setOnLine(true);
        setConnection(undefined);
        // Mock fetch to simulate getConnectionEstimate calls
        mockFetch = jest.spyOn(global, 'fetch').mockImplementation(function () {
            return Promise.resolve({
                status: 204,
                ok: true,
            });
        });
        // Mock performance.now to simulate deterministic latency
        var perfTime = 1000;
        mockPerformanceNow = jest
            .spyOn(performance, 'now')
            .mockImplementation(function () {
            var current = perfTime;
            perfTime += 100; // default 100ms diff
            return current;
        });
    });
    afterEach(function () {
        mockFetch.mockRestore();
        mockPerformanceNow.mockRestore();
    });
    it('should return true when it is connected to the internet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setOnLine(true);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).not.toBeNull();
                        })];
                case 1:
                    _a.sent();
                    expect(result.current.isOnline).toBe(true);
                    expect(result.current.isOffline).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return false when it is not connected to the internet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setOnLine(false);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).not.toBeNull();
                        })];
                case 1:
                    _a.sent();
                    expect(result.current.isOffline).toBe(true);
                    expect(result.current.isOnline).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update isOffline when it becomes disconnected from the internet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setOnLine(true);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).not.toBeNull();
                        })];
                case 1:
                    _a.sent();
                    expect(result.current.isOffline).toBe(false);
                    setOnLine(false);
                    (0, react_1.fireEvent)(window, new Event('offline'));
                    expect(result.current.isOffline).toBe(true);
                    expect(result.current.isOnline).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update isOnline when it becomes re-connected to the internet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setOnLine(false);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).not.toBeNull();
                        })];
                case 1:
                    _a.sent();
                    expect(result.current.isOnline).toBe(false);
                    setOnLine(true);
                    (0, react_1.fireEvent)(window, new Event('online'));
                    expect(result.current.isOnline).toBe(true);
                    expect(result.current.isOffline).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should register and clean up window event listeners', function () { return __awaiter(void 0, void 0, void 0, function () {
        var addSpy, removeSpy, _a, unmount, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    addSpy = jest.spyOn(window, 'addEventListener');
                    removeSpy = jest.spyOn(window, 'removeEventListener');
                    _a = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }), unmount = _a.unmount, result = _a.result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).not.toBeNull();
                        })];
                case 1:
                    _b.sent();
                    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function));
                    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function));
                    unmount();
                    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
                    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
                    addSpy.mockRestore();
                    removeSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return connection details when connection API is supported', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnection = new EventTarget();
                    mockConnection.downlink = 10;
                    mockConnection.effectiveType = '4g';
                    mockConnection.rtt = 50;
                    mockConnection.saveData = false;
                    mockConnection.type = 'wifi';
                    setConnection(mockConnection);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).toEqual(expect.objectContaining({
                                effectiveType: '4g',
                                downlink: 10,
                                type: 'wifi',
                            }));
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update connection details when change event is fired', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnection = new EventTarget();
                    mockConnection.downlink = 10;
                    mockConnection.effectiveType = '4g';
                    mockConnection.rtt = 50;
                    mockConnection.saveData = false;
                    mockConnection.type = 'wifi';
                    setConnection(mockConnection);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            var _a;
                            expect((_a = result.current.connection) === null || _a === void 0 ? void 0 : _a.effectiveType).toBe('4g');
                        })];
                case 1:
                    _a.sent();
                    mockConnection.effectiveType = '4g';
                    mockConnection.downlink = 10;
                    (0, react_1.fireEvent)(window, new Event('change'));
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            var _a, _b;
                            expect((_a = result.current.connection) === null || _a === void 0 ? void 0 : _a.effectiveType).toBe('4g');
                            expect((_b = result.current.connection) === null || _b === void 0 ? void 0 : _b.downlink).toBe(10);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return fallback connection estimate when connection API is not supported', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setConnection(undefined);
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).toEqual(expect.objectContaining({
                                effectiveType: '4g',
                                downlink: 10,
                            }));
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return offline connection estimate when fetch fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setConnection(undefined);
                    mockFetch.mockRejectedValueOnce(new Error('Network error'));
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).toEqual(expect.objectContaining({
                                effectiveType: undefined,
                                rtt: undefined,
                                downlink: undefined,
                            }));
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should classify connection based on latency correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var perfTime, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setConnection(undefined);
                    perfTime = 1000;
                    mockPerformanceNow.mockImplementation(function () {
                        var current = perfTime;
                        perfTime += 2500;
                        return current;
                    });
                    result = (0, react_1.renderHook)(function () { return (0, index_1.useIsOnline)(); }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(result.current.connection).toEqual(expect.objectContaining({
                                effectiveType: 'slow-2g',
                                downlink: 0.05,
                            }));
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('useIsOnline in non-browser environment', function () {
    beforeEach(function () {
        jest.resetModules();
    });
    it('should default states when window is missing', function () {
        jest.mock('./getConnection', function () { return ({
            missingWindow: true,
            getConnection: jest.fn(),
        }); });
        var useIsOnlineMock = require('./index').useIsOnline;
        var result = (0, react_1.renderHook)(function () { return useIsOnlineMock(); }).result;
        expect(result.current.error).toContain('only works in a browser environment');
        expect(result.current.isOnline).toBe(false);
        expect(result.current.isOffline).toBe(false);
        expect(result.current.connection).toBeNull();
    });
});
