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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var withESI_1 = __importDefault(require("./withESI"));
var Dummy = function (props) { return react_1.default.createElement("div", null,
    "Hello ",
    props.name); };
test("exposes WrappedComponent", function () {
    var DummyESI = withESI_1.default(Dummy, "id");
    expect(DummyESI).toHaveProperty("WrappedComponent", Dummy);
});
test("client-side", function () {
    var DummyESI = withESI_1.default(Dummy, "id");
    expect(DummyESI.displayName).toBe("WithESI(Dummy)");
    global.process.browser = true;
    var component = react_test_renderer_1.default.create(react_1.default.createElement(DummyESI, { name: "K\u00E9vin" }));
    expect(component).toMatchSnapshot();
});
test("client-side with serialized props", function () {
    var DummyESI = withESI_1.default(Dummy, "id");
    expect(DummyESI.displayName).toBe("WithESI(Dummy)");
    global.process.browser = true;
    global.__REACT_ESI__ = { id: { name: "Anne" } };
    var component = react_test_renderer_1.default.create(react_1.default.createElement(DummyESI, null));
    expect(component).toMatchSnapshot();
});
test("client-side call getInitialProps", function () { return __awaiter(void 0, void 0, void 0, function () {
    var called, Component, ComponentESI;
    return __generator(this, function (_a) {
        called = false;
        Component = function (props) { return react_1.default.createElement("div", null,
            "Hello ",
            props.name); };
        Component.getInitialProps = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                called = true;
                return [2 /*return*/, { name: "Kévin" }];
            });
        }); };
        ComponentESI = withESI_1.default(Component, "initial-props");
        global.process.browser = true;
        react_test_renderer_1.default.create(react_1.default.createElement(ComponentESI, null));
        expect(called).toBe(true);
        return [2 /*return*/];
    });
}); });
test("server-side", function () {
    var DummyESI = withESI_1.default(Dummy, "id");
    expect(DummyESI.displayName).toBe("WithESI(Dummy)");
    process.env.REACT_ESI_SECRET = "dummy";
    global.process.browser = false;
    var component = react_test_renderer_1.default.create(react_1.default.createElement(DummyESI, { esi: { attrs: { onerror: "continue" } }, name: "K\u00E9vin" }));
    expect(component).toMatchSnapshot();
});
//# sourceMappingURL=withESI.test.js.map