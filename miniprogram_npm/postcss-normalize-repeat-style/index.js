module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018170, function(require, module, exports) {

const valueParser = require('postcss-value-parser');
const mappings = require('./lib/map');

/**
 * @param {unknown} item
 * @param {number} index
 * @return {boolean}
 */
function evenValues(item, index) {
  return index % 2 === 0;
}

const repeatKeywords = new Set(mappings.values());

/**
 * @param {valueParser.Node} node
 * @return {boolean}
 */
function isCommaNode(node) {
  return node.type === 'div' && node.value === ',';
}

const variableFunctions = new Set(['var', 'env', 'constant']);
/**
 * @param {valueParser.Node} node
 * @return {boolean}
 */
function isVariableFunctionNode(node) {
  if (node.type !== 'function') {
    return false;
  }

  return variableFunctions.has(node.value.toLowerCase());
}

/**
 * @param {string} value
 * @return {string}
 */
function transform(value) {
  const parsed = valueParser(value);

  if (parsed.nodes.length === 1) {
    return value;
  }
  /** @type {{start: number?, end: number?}[]} */
  const ranges = [];
  let rangeIndex = 0;
  let shouldContinue = true;

  parsed.nodes.forEach((node, index) => {
    // After comma (`,`) follows next background
    if (isCommaNode(node)) {
      rangeIndex += 1;
      shouldContinue = true;

      return;
    }

    if (!shouldContinue) {
      return;
    }

    // After separator (`/`) follows `background-size` values
    // Avoid them
    if (node.type === 'div' && node.value === '/') {
      shouldContinue = false;

      return;
    }

    if (!ranges[rangeIndex]) {
      ranges[rangeIndex] = {
        start: null,
        end: null,
      };
    }

    // Do not try to be processed `var and `env` function inside background
    if (isVariableFunctionNode(node)) {
      shouldContinue = false;
      ranges[rangeIndex].start = null;
      ranges[rangeIndex].end = null;

      return;
    }

    const isRepeatKeyword =
      node.type === 'word' && repeatKeywords.has(node.value.toLowerCase());

    if (ranges[rangeIndex].start === null && isRepeatKeyword) {
      ranges[rangeIndex].start = index;
      ranges[rangeIndex].end = index;

      return;
    }

    if (ranges[rangeIndex].start !== null) {
      if (node.type === 'space') {
        return;
      } else if (isRepeatKeyword) {
        ranges[rangeIndex].end = index;

        return;
      }

      return;
    }
  });

  ranges.forEach((range) => {
    if (range.start === null) {
      return;
    }

    const nodes = parsed.nodes.slice(
      range.start,
      /** @type {number} */ (range.end) + 1
    );

    if (nodes.length !== 3) {
      return;
    }
    const key = nodes
      .filter(evenValues)
      .map((n) => n.value.toLowerCase())
      .toString();

    const match = mappings.get(key);

    if (match) {
      nodes[0].value = match;
      nodes[1].value = nodes[2].value = '';
    }
  });

  return parsed.toString();
}

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-normalize-repeat-style',
    prepare() {
      const cache = new Map();
      return {
        OnceExit(css) {
          css.walkDecls(
            /^(background(-repeat)?|(-\w+-)?mask-repeat)$/i,
            (decl) => {
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
            }
          );
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./lib/map":1679975018171}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018171, function(require, module, exports) {

module.exports = new Map([
  [['repeat', 'no-repeat'].toString(), 'repeat-x'],
  [['no-repeat', 'repeat'].toString(), 'repeat-y'],
  [['repeat', 'repeat'].toString(), 'repeat'],
  [['space', 'space'].toString(), 'space'],
  [['round', 'round'].toString(), 'round'],
  [['no-repeat', 'no-repeat'].toString(), 'no-repeat'],
]);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018170);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser"]
//# sourceMappingURL=index.js.map