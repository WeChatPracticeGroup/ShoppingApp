module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018166, function(require, module, exports) {

const charset = 'charset';
// eslint-disable-next-line no-control-regex
const nonAscii = /[^\x00-\x7F]/;

/**
 * @typedef {{add?: boolean}} Options
 */
/**
 * @type {import('postcss').PluginCreator<Options>}
 * @param {Options} opts
 * @return {import('postcss').Plugin}
 */
function pluginCreator(opts = {}) {
  return {
    postcssPlugin: 'postcss-normalize-' + charset,

    OnceExit(css, { AtRule }) {
      /** @type {import('postcss').AtRule | undefined} */
      let charsetRule;
      /** @type {import('postcss').Node | undefined} */
      let nonAsciiNode;

      css.walk((node) => {
        if (node.type === 'atrule' && node.name === charset) {
          if (!charsetRule) {
            charsetRule = node;
          }
          node.remove();
        } else if (
          !nonAsciiNode &&
          node.parent === css &&
          nonAscii.test(node.toString())
        ) {
          nonAsciiNode = node;
        }
      });

      if (nonAsciiNode) {
        if (!charsetRule && opts.add !== false) {
          charsetRule = new AtRule({
            name: charset,
            params: '"utf-8"',
          });
        }
        if (charsetRule) {
          charsetRule.source = nonAsciiNode.source;
          css.prepend(charsetRule);
        }
      }
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018166);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map