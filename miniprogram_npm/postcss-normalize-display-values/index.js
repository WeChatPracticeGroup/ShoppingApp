module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018167, function(require, module, exports) {

const valueParser = require('postcss-value-parser');
const mappings = require('./lib/map.js');

/**
 * @param {string} value
 * @return {string}
 */
function transform(value) {
  const { nodes } = valueParser(value);

  if (nodes.length === 1) {
    return value;
  }

  const values = nodes
    .filter((list, index) => index % 2 === 0)
    .filter((node) => node.type === 'word')
    .map((n) => n.value.toLowerCase());

  if (values.length === 0) {
    return value;
  }

  const match = mappings.get(values.toString());

  if (!match) {
    return value;
  }

  return match;
}

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-normalize-display-values',

    prepare() {
      const cache = new Map();
      return {
        OnceExit(css) {
          css.walkDecls(/^display$/i, (decl) => {
            const value = decl.value;

            if (!value) {
              return;
            }

            if (cache.has(value)) {
              decl.value = cache.get(value);

              return;
            }

            const result = transform(value);

            decl.value = result;
            cache.set(value, result);
          });
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./lib/map.js":1679975018168}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018168, function(require, module, exports) {

const block = 'block';
const flex = 'flex';
const flow = 'flow';
const flowRoot = 'flow-root';
const grid = 'grid';
const inline = 'inline';
const inlineBlock = 'inline-block';
const inlineFlex = 'inline-flex';
const inlineGrid = 'inline-grid';
const inlineTable = 'inline-table';
const listItem = 'list-item';
const ruby = 'ruby';
const rubyBase = 'ruby-base';
const rubyText = 'ruby-text';
const runIn = 'run-in';
const table = 'table';
const tableCell = 'table-cell';
const tableCaption = 'table-caption';

/**
 * Specification: https://drafts.csswg.org/css-display/#the-display-properties
 */

module.exports = new Map([
  [[block, flow].toString(), block],
  [[block, flowRoot].toString(), flowRoot],
  [[inline, flow].toString(), inline],
  [[inline, flowRoot].toString(), inlineBlock],
  [[runIn, flow].toString(), runIn],
  [[listItem, block, flow].toString(), listItem],
  [[inline, flow, listItem].toString(), inline + ' ' + listItem],
  [[block, flex].toString(), flex],
  [[inline, flex].toString(), inlineFlex],
  [[block, grid].toString(), grid],
  [[inline, grid].toString(), inlineGrid],
  [[inline, ruby].toString(), ruby],
  // `block ruby` is same
  [[block, table].toString(), table],
  [[inline, table].toString(), inlineTable],
  [[tableCell, flow].toString(), tableCell],
  [[tableCaption, flow].toString(), tableCaption],
  [[rubyBase, flow].toString(), rubyBase],
  [[rubyText, flow].toString(), rubyText],
]);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018167);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser"]
//# sourceMappingURL=index.js.map