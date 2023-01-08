"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jsdom-global/register");
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var enzyme_to_json_1 = __importDefault(require("enzyme-to-json"));
var index_1 = require("./index");
var map = {};
beforeEach(function () {
    window.addEventListener = jest.fn(function (event, cb) {
        map[event] = cb;
    });
    window.removeEventListener = jest.fn(function (event) {
        map[event] = undefined;
    });
});
describe('useIsOnline in browser', function () {
    it('should return true when it is connected to the internet', function () {
        Object.defineProperty(window.navigator, "onLine", {
            configurable: true,
            value: true
        });
        var Component = function () {
            var isOnline = (0, index_1.useIsOnline)().isOnline;
            return (react_1.default.createElement("div", null, isOnline));
        };
        var wrapper = (0, enzyme_1.mount)(react_1.default.createElement(Component, null));
        var errorText = wrapper.find('div');
        expect((0, enzyme_to_json_1.default)(wrapper)).toMatchSnapshot();
        wrapper.unmount();
        expect(errorText.props().children).toBe(true);
        expect(window.addEventListener).toBeCalledTimes(2);
        expect(window.removeEventListener).toBeCalledTimes(2);
    });
    it('should return false when it is not connected to the internet', function () {
        Object.defineProperty(window.navigator, "onLine", {
            configurable: true,
            value: true
        });
        var Component = function () {
            var isOffline = (0, index_1.useIsOnline)().isOffline;
            return (react_1.default.createElement("div", null, isOffline));
        };
        var wrapper = (0, enzyme_1.mount)(react_1.default.createElement(Component, null));
        var errorText = wrapper.find('div');
        expect((0, enzyme_to_json_1.default)(wrapper)).toMatchSnapshot();
        wrapper.unmount();
        expect(errorText.props().children).toBe(false);
        expect(window.addEventListener).toBeCalledTimes(2);
        expect(window.removeEventListener).toBeCalledTimes(2);
    });
    it('should update isOffline when it becomes disconnected from the internet', function () {
        Object.defineProperty(window.navigator, "onLine", {
            configurable: true,
            value: true
        });
        var Component = function () {
            var isOffline = (0, index_1.useIsOnline)().isOffline;
            return (react_1.default.createElement("div", null, isOffline));
        };
        var wrapper = (0, enzyme_1.mount)(react_1.default.createElement(Component, null));
        Object.defineProperty(window.navigator, "onLine", {
            configurable: true,
            value: false
        });
        wrapper.unmount();
        wrapper.mount();
        expect(wrapper.find('div').props().children).toBe(true);
    });
    it('should update isOnline when it becomes re-connected to the internet', function () {
        Object.defineProperty(window.navigator, "onLine", {
            configurable: true,
            value: false
        });
        var Component = function () {
            var _a = (0, index_1.useIsOnline)(), isOnline = _a.isOnline, isOffline = _a.isOffline;
            return (react_1.default.createElement("div", null, isOnline));
        };
        var wrapper = (0, enzyme_1.mount)(react_1.default.createElement(Component, null));
        Object.defineProperty(window.navigator, "onLine", {
            configurable: true,
            value: true
        });
        wrapper.unmount();
        wrapper.mount();
        expect(wrapper.find('div').props().children).toBe(true);
    });
});
