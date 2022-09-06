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
var express_1 = __importDefault(require("express"));
var react_1 = __importDefault(require("react"));
var stream_1 = __importDefault(require("stream"));
var supertest_1 = __importDefault(require("supertest"));
process.env.REACT_ESI_SECRET = "dummy";
process.env.REACT_ESI_PATH = "/_custom";
var server_1 = require("./server");
test("path", function () {
    expect(server_1.path).toBe("/_custom");
});
test("createIncludeElement", function () {
    var elem = server_1.createIncludeElement("fragmentID", { name: "Kévin" }, { attrs: { alt: "\"'<&Alt>'\"" } });
    expect(elem).toMatchSnapshot();
});
var fragmentURL = "/_custom?fragment=fragmentID&props=%7B%22name%22%3A%22K%C3%A9vin%22%7D&sign=f7ddf06659aadbcba0cdad4c927ac5bf38167d714e1a15cad13115e7e9d21a9d";
test("serveFragment", function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, resolver, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express_1.default();
                resolver = function (fragmentID, props, req, res) {
                    expect(fragmentID).toBe("fragmentID");
                    expect(props).toMatchObject({ name: "Kévin" });
                    expect(req.header("user-agent")).toBe("test");
                    expect(res).toBeDefined();
                    return function (p) { return react_1.default.createElement("div", null,
                        "Hello ",
                        p.name); };
                };
                app.get(server_1.path, function (req, res) {
                    return server_1.serveFragment(req, res, resolver);
                });
                return [4 /*yield*/, supertest_1.default(app)
                        .get(fragmentURL)
                        .set("user-agent", "test")
                        .expect(200)];
            case 1:
                response = _a.sent();
                expect(response.text).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); });
test("serveFragment with pipeStream option", function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, resolver, response, addedScript;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express_1.default();
                resolver = function (fragmentID, props, req, res) {
                    expect(fragmentID).toBe("fragmentID");
                    expect(props).toMatchObject({ name: "Kévin" });
                    expect(req.header("user-agent")).toBe("test");
                    expect(res).toBeDefined();
                    return function (p) { return react_1.default.createElement("div", null,
                        "Hello ",
                        p.name); };
                };
                app.get(server_1.path, function (req, res) {
                    return server_1.serveFragment(req, res, resolver, {
                        pipeStream: function (input) {
                            var transformer = new stream_1.default.Transform({
                                transform: function (chunk, encoding, callback) {
                                    callback(undefined, "<div>hi there</div>");
                                },
                            });
                            input.pipe(transformer);
                            return transformer;
                        },
                    });
                });
                return [4 /*yield*/, supertest_1.default(app)
                        .get(fragmentURL)
                        .set("user-agent", "test")
                        .expect(200)];
            case 1:
                response = _a.sent();
                addedScript = "<script>window.__REACT_ESI__ = window.__REACT_ESI__ || {}; window.__REACT_ESI__['fragmentID'] = {\"name\":\"Kévin\"};document.currentScript.remove();</script>";
                expect(response.text).toEqual(addedScript + "<div>hi there</div>");
                return [2 /*return*/];
        }
    });
}); });
test("initial props", function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, resolver, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express_1.default();
                resolver = function (fragmentID, props, req, res) {
                    expect(fragmentID).toBe("fragmentID");
                    expect(props).toMatchObject({ name: "Kévin" });
                    expect(req.header("user-agent")).toBe("test");
                    expect(res).toBeDefined();
                    var Component = function (p) { return react_1.default.createElement("div", null,
                        "Hello ",
                        p.name); };
                    Component.getInitialProps = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, { name: "Anne" }];
                        });
                    }); };
                    return Component;
                };
                app.get(server_1.path, function (req, res) {
                    return server_1.serveFragment(req, res, resolver);
                });
                return [4 /*yield*/, supertest_1.default(app)
                        .get(fragmentURL)
                        .set("user-agent", "test")
                        .expect(200)];
            case 1:
                response = _a.sent();
                expect(response.text).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); });
test("invalid signature", function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, resolver, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express_1.default();
                resolver = function () { return function () { return react_1.default.createElement("div", null); }; };
                app.get(server_1.path, function (req, res) {
                    return server_1.serveFragment(req, res, resolver);
                });
                return [4 /*yield*/, supertest_1.default(app)
                        .get("/_custom?fragment=fragmentID&props=%7B%22foo%22%3A%22bar%22%7D&sign=invalid")
                        .expect(400)];
            case 1:
                response = _a.sent();
                expect(response.text).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=server.test.js.map