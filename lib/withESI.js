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
var prop_types_1 = __importDefault(require("prop-types"));
var react_1 = __importDefault(require("react"));
/**
 * Higher Order Component generating a <esi:include> tag server-side, and rendering the wrapped component client-side.
 */
function withESI(WrappedComponent, fragmentID) {
    var _a;
    return _a = /** @class */ (function (_super) {
            __extends(WithESI, _super);
            function WithESI(props) {
                var _this = _super.call(this, props) || this;
                _this.state = {
                    childProps: {},
                    initialChildPropsLoaded: true
                };
                _this.esi = {};
                var esi = props.esi, childProps = __rest(props, ["esi"]);
                _this.esi = esi || {};
                _this.state.childProps = childProps;
                if (!process.browser) {
                    return _this;
                }
                if (window.__REACT_ESI__ && window.__REACT_ESI__[fragmentID]) {
                    // Inject server-side computed initial props
                    _this.state.childProps = __assign(__assign({}, window.__REACT_ESI__[fragmentID]), _this.state.childProps);
                    return _this;
                }
                if (WrappedComponent.getInitialProps) {
                    // No server-side rendering for this component, getInitialProps will be called during componentDidMount
                    _this.state.initialChildPropsLoaded = false;
                }
                return _this;
            }
            WithESI.prototype.componentDidMount = function () {
                var _this = this;
                if (this.state.initialChildPropsLoaded) {
                    return;
                }
                WrappedComponent
                    .getInitialProps({ props: this.state.childProps })
                    .then(function (initialProps) {
                    return _this.setState({
                        childProps: initialProps,
                        initialChildPropsLoaded: true
                    });
                });
            };
            WithESI.prototype.render = function () {
                if (process.browser) {
                    return (react_1.default.createElement("div", null,
                        react_1.default.createElement(WrappedComponent, __assign({}, this.state.childProps))));
                }
                // Prevent Webpack and other bundlers to ship server.js
                // tslint:disable-next-line
                var server = eval('require("./server")');
                return (react_1.default.createElement("div", { dangerouslySetInnerHTML: {
                        __html: server.createIncludeElement(fragmentID, this.props, this.esi)
                    } }));
            };
            return WithESI;
        }(react_1.default.Component)),
        _a.WrappedComponent = WrappedComponent,
        _a.displayName = "WithESI(" + (WrappedComponent.displayName ||
            WrappedComponent.name ||
            "Component") + ")",
        _a.propTypes = {
            esi: prop_types_1.default.shape({
                attrs: prop_types_1.default.objectOf(prop_types_1.default.string) // extra attributes to add to the <esi:include> tag
            })
        },
        _a;
}
exports.default = withESI;
//# sourceMappingURL=withESI.js.map