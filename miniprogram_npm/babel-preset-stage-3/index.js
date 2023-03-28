module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014356, function(require, module, exports) {


exports.__esModule = true;

var _babelPluginSyntaxTrailingFunctionCommas = require("babel-plugin-syntax-trailing-function-commas");

var _babelPluginSyntaxTrailingFunctionCommas2 = _interopRequireDefault(_babelPluginSyntaxTrailingFunctionCommas);

var _babelPluginTransformAsyncToGenerator = require("babel-plugin-transform-async-to-generator");

var _babelPluginTransformAsyncToGenerator2 = _interopRequireDefault(_babelPluginTransformAsyncToGenerator);

var _babelPluginTransformExponentiationOperator = require("babel-plugin-transform-exponentiation-operator");

var _babelPluginTransformExponentiationOperator2 = _interopRequireDefault(_babelPluginTransformExponentiationOperator);

var _babelPluginTransformObjectRestSpread = require("babel-plugin-transform-object-rest-spread");

var _babelPluginTransformObjectRestSpread2 = _interopRequireDefault(_babelPluginTransformObjectRestSpread);

var _babelPluginTransformAsyncGeneratorFunctions = require("babel-plugin-transform-async-generator-functions");

var _babelPluginTransformAsyncGeneratorFunctions2 = _interopRequireDefault(_babelPluginTransformAsyncGeneratorFunctions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  plugins: [_babelPluginSyntaxTrailingFunctionCommas2.default, _babelPluginTransformAsyncToGenerator2.default, _babelPluginTransformExponentiationOperator2.default, _babelPluginTransformAsyncGeneratorFunctions2.default, _babelPluginTransformObjectRestSpread2.default]
};
module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014356);
})()
//miniprogram-npm-outsideDeps=["babel-plugin-syntax-trailing-function-commas","babel-plugin-transform-async-to-generator","babel-plugin-transform-exponentiation-operator","babel-plugin-transform-object-rest-spread","babel-plugin-transform-async-generator-functions"]
//# sourceMappingURL=index.js.map