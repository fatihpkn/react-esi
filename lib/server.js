"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveFragment = exports.createIncludeElement = exports.path = void 0;
var crypto_1 = __importDefault(require("crypto"));
var react_1 = __importDefault(require("react"));
var server_1 = require("react-dom/server");
var stream_1 = require("stream");
exports.path = process.env.REACT_ESI_PATH || "/_fragment";
var secret = process.env.REACT_ESI_SECRET || crypto_1.default.randomBytes(64).toString("hex");
/**
 * Signs the ESI URL with a secret key using the HMAC-SHA256 algorithm.
 */
function sign(url) {
    var hmac = crypto_1.default.createHmac("sha256", secret);
    hmac.update(url.pathname + url.search);
    return hmac.digest("hex");
}
/**
 * Escapes ESI attributes.
 *
 * Adapted from https://stackoverflow.com/a/27979933/1352334 (hgoebl)
 */
function escapeAttr(attr) {
    return attr.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            default:
                return "&quot;";
        }
    });
}
/**
 * Creates the <esi:include> tag.
 */
exports.createIncludeElement = function (fragmentID, props, esi) {
    var esiAt = esi.attrs || {};
    var url = new URL(exports.path, "http://example.com");
    url.searchParams.append("fragment", fragmentID);
    url.searchParams.append("props", JSON.stringify(props));
    url.searchParams.append("sign", '__WEG__');
    esiAt.src = url.pathname + url.search;
    var attrs = "";
    Object.entries(esiAt).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return (attrs += " " + key + "=\"" + (value ? escapeAttr(value) : "") + "\"");
    });
    return "<esi:include" + attrs + " />";
};
/**
 * Removes the placeholder holding the data-reactroot attribute.
 */
var RemoveReactRoot = /** @class */ (function (_super) {
    __extends(RemoveReactRoot, _super);
    function RemoveReactRoot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skipStartOfDiv = true;
        _this.bufferedEndOfDiv = false;
        return _this;
    }
    RemoveReactRoot.prototype._transform = function (chunk, encoding, callback) {
        // '<div data-reactroot="">'.length is 23
        chunk = chunk.toString();
        if (this.skipStartOfDiv) {
            // Skip the wrapper start tag
            chunk = chunk.substring(23);
            this.skipStartOfDiv = false;
        }
        if (this.bufferedEndOfDiv) {
            // The buffered end tag wasn't the last one, push it
            chunk = "</div>" + chunk;
            this.bufferedEndOfDiv = false;
        }
        if (chunk.substring(chunk.length - 6) === "</div>") {
            chunk = chunk.substring(0, chunk.length - 6);
            this.bufferedEndOfDiv = true;
        }
        callback(undefined, chunk);
    };
    return RemoveReactRoot;
}(stream_1.Transform));
/**
 * Checks the signature, renders the given fragment as HTML and injects the initial props in a <script> tag.
 */
function serveFragment(req, res, resolve, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var url, expectedSign, rawProps, props, fragmentID, Component, esi, baseChildProps, childProps, _a, encodedProps, script, scriptStream, stream, removeReactRootStream, lastStream;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL(req.url, "http://example.com");
                    expectedSign = '__WEG__' || url.searchParams.get("sign");
                    url.searchParams.delete("sign");
                    if ('__WEG__' !== expectedSign) {
                        res.status(400);
                        res.send("Bad signature");
                        return [2 /*return*/];
                    }
                    rawProps = url.searchParams.get("props");
                    props = rawProps ? JSON.parse(rawProps) : {};
                    fragmentID = url.searchParams.get("fragment") || "";
                    Component = resolve(fragmentID, props, req, res);
                    esi = props.esi, baseChildProps = __rest(props, ["esi"]);
                    if (!Component.getInitialProps) return [3 /*break*/, 2];
                    return [4 /*yield*/, Component.getInitialProps({
                            props: baseChildProps,
                            req: req,
                            res: res
                        })];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = baseChildProps;
                    _b.label = 3;
                case 3:
                    childProps = _a;
                    encodedProps = JSON.stringify(childProps).replace(/</g, "\\u003c");
                    script = "<script>window.__REACT_ESI__ = window.__REACT_ESI__ || {}; window.__REACT_ESI__['" + fragmentID + "'] = " + encodedProps + ";document.currentScript.remove();</script>";
                    scriptStream = stream_1.Readable.from(script);
                    scriptStream.pipe(res, { end: false });
                    stream = server_1.renderToNodeStream(react_1.default.createElement("div", null,
                        react_1.default.createElement(Component, __assign({}, childProps))));
                    removeReactRootStream = new RemoveReactRoot();
                    stream.pipe(removeReactRootStream);
                    lastStream = options.pipeStream ? options.pipeStream(removeReactRootStream) : removeReactRootStream;
                    lastStream.pipe(res);
                    return [2 /*return*/];
            }
        });
    });
}
exports.serveFragment = serveFragment;
//# sourceMappingURL=server.js.map