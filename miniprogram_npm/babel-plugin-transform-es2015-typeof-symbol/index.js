module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014344, function(require, module, exports) {


exports.__esModule = true;

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = function (_ref) {
  var t = _ref.types;

  var IGNORE = (0, _symbol2.default)();

  return {
    visitor: {
      Scope: function Scope(_ref2) {
        var scope = _ref2.scope;

        if (!scope.getBinding("Symbol")) {
          return;
        }

        scope.rename("Symbol");
      },
      UnaryExpression: function UnaryExpression(path) {
        var node = path.node,
            parent = path.parent;

        if (node[IGNORE]) return;
        if (path.find(function (path) {
          return path.node && !!path.node._generated;
        })) return;

        if (path.parentPath.isBinaryExpression() && t.EQUALITY_BINARY_OPERATORS.indexOf(parent.operator) >= 0) {
          var opposite = path.getOpposite();
          if (opposite.isLiteral() && opposite.node.value !== "symbol" && opposite.node.value !== "object") {
            return;
          }
        }

        if (node.operator === "typeof") {
          var call = t.callExpression(this.addHelper("typeof"), [node.argument]);
          if (path.get("argument").isIdentifier()) {
            var undefLiteral = t.stringLiteral("undefined");
            var unary = t.unaryExpression("typeof", node.argument);
            unary[IGNORE] = true;
            path.replaceWith(t.conditionalExpression(t.binaryExpression("===", unary, undefLiteral), undefLiteral, call));
          } else {
            path.replaceWith(call);
          }
        }
      }
    }
  };
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014344);
})()
//miniprogram-npm-outsideDeps=["babel-runtime/core-js/symbol"]
//# sourceMappingURL=index.js.map