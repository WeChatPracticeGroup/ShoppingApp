module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018228, function(require, module, exports) {

const selectorParser = require('postcss-selector-parser');

/**
 * @param {string} selectors
 * @param {selectorParser.SyncProcessor<void>} callback
 * @return {string}
 */
function parseSelectors(selectors, callback) {
  return selectorParser(callback).processSync(selectors);
}

/**
 * @param {import('postcss').Rule} rule
 * @return {string}
 */
function unique(rule) {
  const selector = [...new Set(rule.selectors)];
  selector.sort();
  return selector.join();
}

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-unique-selectors',
    OnceExit(css) {
      css.walkRules((nodes) => {
        /** @type {string[]} */
        let comments = [];
        /** @type {selectorParser.SyncProcessor<void>} */
        const removeAndSaveComments = (selNode) => {
          selNode.walk((sel) => {
            if (sel.type === 'comment') {
              comments.push(sel.value);
              sel.remove();
              return;
            } else {
              return;
            }
          });
        };
        if (nodes.raws.selector && nodes.raws.selector.raw) {
          parseSelectors(nodes.raws.selector.raw, removeAndSaveComments);
          nodes.raws.selector.raw = unique(nodes);
        }
        nodes.selector = parseSelectors(nodes.selector, removeAndSaveComments);
        nodes.selector = unique(nodes);
        nodes.selectors = nodes.selectors.concat(comments);
      });
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018228);
})()
//miniprogram-npm-outsideDeps=["postcss-selector-parser"]
//# sourceMappingURL=index.js.map