module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018169, function(require, module, exports) {

const valueParser = require('postcss-value-parser');

const directionKeywords = new Set(['top', 'right', 'bottom', 'left', 'center']);

const center = '50%';
const horizontal = new Map([
  ['right', '100%'],
  ['left', '0'],
]);
const verticalValue = new Map([
  ['bottom', '100%'],
  ['top', '0'],
]);
const mathFunctions = new Set(['calc', 'min', 'max', 'clamp']);
const variableFunctions = new Set(['var', 'env', 'constant']);
/**
 * @param {valueParser.Node} node
 * @return {boolean}
 */
function isCommaNode(node) {
  return node.type === 'div' && node.value === ',';
}

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
 * @param {valueParser.Node} node
 * @return {boolean}
 */
function isMathFunctionNode(node) {
  if (node.type !== 'function') {
    return false;
  }
  return mathFunctions.has(node.value.toLowerCase());
}

/**
 * @param {valueParser.Node} node
 * @return {boolean}
 */
function isNumberNode(node) {
  if (node.type !== 'word') {
    return false;
  }

  const value = parseFloat(node.value);

  return !isNaN(value);
}

/**
 * @param {valueParser.Node} node
 * @return {boolean}
 */
function isDimensionNode(node) {
  if (node.type !== 'word') {
    return false;
  }

  const parsed = valueParser.unit(node.value);

  if (!parsed) {
    return false;
  }

  return parsed.unit !== '';
}

/**
 * @param {string} value
 * @return {string}
 */
function transform(value) {
  const parsed = valueParser(value);
  /** @type {({start: number, end: number} | {start: null, end: null})[]} */
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

    const isPositionKeyword =
      (node.type === 'word' &&
        directionKeywords.has(node.value.toLowerCase())) ||
      isDimensionNode(node) ||
      isNumberNode(node) ||
      isMathFunctionNode(node);

    if (ranges[rangeIndex].start === null && isPositionKeyword) {
      ranges[rangeIndex].start = index;
      ranges[rangeIndex].end = index;

      return;
    }

    if (ranges[rangeIndex].start !== null) {
      if (node.type === 'space') {
        return;
      } else if (isPositionKeyword) {
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

    const nodes = parsed.nodes.slice(range.start, range.end + 1);

    if (nodes.length > 3) {
      return;
    }

    const firstNode = nodes[0].value.toLowerCase();
    const secondNode =
      nodes[2] && nodes[2].value ? nodes[2].value.toLowerCase() : null;

    if (nodes.length === 1 || secondNode === 'center') {
      if (secondNode) {
        nodes[2].value = nodes[1].value = '';
      }

      const map = new Map([...horizontal, ['center', center]]);

      if (map.has(firstNode)) {
        nodes[0].value = /** @type {string}*/ (map.get(firstNode));
      }

      return;
    }

    if (secondNode !== null) {
      if (firstNode === 'center' && directionKeywords.has(secondNode)) {
        nodes[0].value = nodes[1].value = '';

        if (horizontal.has(secondNode)) {
          nodes[2].value = /** @type {string} */ (horizontal.get(secondNode));
        }
        return;
      }

      if (horizontal.has(firstNode) && verticalValue.has(secondNode)) {
        nodes[0].value = /** @type {string} */ (horizontal.get(firstNode));
        nodes[2].value = /** @type {string} */ (verticalValue.get(secondNode));

        return;
      } else if (verticalValue.has(firstNode) && horizontal.has(secondNode)) {
        nodes[0].value = /** @type {string} */ (horizontal.get(secondNode));
        nodes[2].value = /** @type {string} */ (verticalValue.get(firstNode));

        return;
      }
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
    postcssPlugin: 'postcss-normalize-positions',

    OnceExit(css) {
      const cache = new Map();

      css.walkDecls(
        /^(background(-position)?|(-\w+-)?perspective-origin)$/i,
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
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018169);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser"]
//# sourceMappingURL=index.js.map