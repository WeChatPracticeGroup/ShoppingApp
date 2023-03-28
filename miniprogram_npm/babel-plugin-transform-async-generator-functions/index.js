module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014312, function(require, module, exports) {


exports.__esModule = true;

exports.default = function (_ref) {
  var t = _ref.types;

  var yieldStarVisitor = {
    Function: function Function(path) {
      path.skip();
    },
    YieldExpression: function YieldExpression(_ref2, state) {
      var node = _ref2.node;

      if (!node.delegate) return;
      var callee = state.addHelper("asyncGeneratorDelegate");
      node.argument = t.callExpression(callee, [t.callExpression(state.addHelper("asyncIterator"), [node.argument]), t.memberExpression(state.addHelper("asyncGenerator"), t.identifier("await"))]);
    }
  };

  return {
    inherits: require("babel-plugin-syntax-async-generators"),
    visitor: {
      Function: function Function(path, state) {
        if (!path.node.async || !path.node.generator) return;

        path.traverse(yieldStarVisitor, state);

        (0, _babelHelperRemapAsyncToGenerator2.default)(path, state.file, {
          wrapAsync: t.memberExpression(state.addHelper("asyncGenerator"), t.identifier("wrap")),
          wrapAwait: t.memberExpression(state.addHelper("asyncGenerator"), t.identifier("await"))
        });
      }
    }
  };
};

var _babelHelperRemapAsyncToGenerator = require("babel-helper-remap-async-to-generator");

var _babelHelperRemapAsyncToGenerator2 = _interopRequireDefault(_babelHelperRemapAsyncToGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014312);
})()
//miniprogram-npm-outsideDeps=["babel-plugin-syntax-async-generators","babel-helper-remap-async-to-generator"]
//# sourceMappingURL=index.js.map