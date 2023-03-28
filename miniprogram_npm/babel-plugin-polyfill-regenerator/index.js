module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014299, function(require, module, exports) {


exports.__esModule = true;
exports.default = void 0;

var _helperDefinePolyfillProvider = _interopRequireDefault(require("@babel/helper-define-polyfill-provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runtimeCompat = "#__secret_key__@babel/runtime__compatibility";

var _default = (0, _helperDefinePolyfillProvider.default)(({
  debug,
  targets,
  babel
}, options) => {
  if (!shallowEqual(targets, babel.targets())) {
    throw new Error("This plugin does not use the targets option. Only preset-env's targets" + " or top-level targets need to be configured for this plugin to work." + " See https://github.com/babel/babel-polyfills/issues/36 for more" + " details.");
  }

  const {
    [runtimeCompat]: {
      useBabelRuntime
    } = {
      useBabelRuntime: ""
    }
  } = options;
  const pureName = useBabelRuntime ? `${useBabelRuntime}/regenerator` : "regenerator-runtime";
  return {
    name: "regenerator",
    polyfills: ["regenerator-runtime"],

    usageGlobal(meta, utils) {
      if (isRegenerator(meta)) {
        debug("regenerator-runtime");
        utils.injectGlobalImport("regenerator-runtime/runtime.js");
      }
    },

    usagePure(meta, utils, path) {
      if (isRegenerator(meta)) {
        path.replaceWith(utils.injectDefaultImport(pureName, "regenerator-runtime"));
      }
    }

  };
});

exports.default = _default;

const isRegenerator = meta => meta.kind === "global" && meta.name === "regeneratorRuntime";

function shallowEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014299);
})()
//miniprogram-npm-outsideDeps=["@babel/helper-define-polyfill-provider"]
//# sourceMappingURL=index.js.map