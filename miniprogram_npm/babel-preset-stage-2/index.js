module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014355, function(require, module, exports) {


exports.__esModule = true;

var _babelPresetStage = require("babel-preset-stage-3");

var _babelPresetStage2 = _interopRequireDefault(_babelPresetStage);

var _babelPluginTransformClassProperties = require("babel-plugin-transform-class-properties");

var _babelPluginTransformClassProperties2 = _interopRequireDefault(_babelPluginTransformClassProperties);

var _babelPluginTransformDecorators = require("babel-plugin-transform-decorators");

var _babelPluginTransformDecorators2 = _interopRequireDefault(_babelPluginTransformDecorators);

var _babelPluginSyntaxDynamicImport = require("babel-plugin-syntax-dynamic-import");

var _babelPluginSyntaxDynamicImport2 = _interopRequireDefault(_babelPluginSyntaxDynamicImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  presets: [_babelPresetStage2.default],
  plugins: [_babelPluginSyntaxDynamicImport2.default, _babelPluginTransformClassProperties2.default, _babelPluginTransformDecorators2.default]
};
module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014355);
})()
//miniprogram-npm-outsideDeps=["babel-preset-stage-3","babel-plugin-transform-class-properties","babel-plugin-transform-decorators","babel-plugin-syntax-dynamic-import"]
//# sourceMappingURL=index.js.map