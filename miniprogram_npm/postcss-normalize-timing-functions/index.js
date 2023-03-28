module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018173, function(require, module, exports) {

const valueParser = require('postcss-value-parser');

/** @type {(node: valueParser.Node) => number} */
const getValue = (node) => parseFloat(node.value);

/* Works because toString() normalizes the formatting,
   so comparing the string forms behaves the same as number equality*/
const conversions = new Map([
  [[0.25, 0.1, 0.25, 1].toString(), 'ease'],
  [[0, 0, 1, 1].toString(), 'linear'],
  [[0.42, 0, 1, 1].toString(), 'ease-in'],
  [[0, 0, 0.58, 1].toString(), 'ease-out'],
  [[0.42, 0, 0.58, 1].toString(), 'ease-in-out'],
]);
/**
 * @param {valueParser.Node} node
 * @return {void | false}
 */
function reduce(node) {
  if (node.type !== 'function') {
    return false;
  }

  if (!node.value) {
    return;
  }

  const lowerCasedValue = node.value.toLowerCase();

  if (lowerCasedValue === 'steps') {
    // Don't bother checking the step-end case as it has the same length
    // as steps(1)
    if (
      node.nodes[0].type === 'word' &&
      getValue(node.nodes[0]) === 1 &&
      node.nodes[2] &&
      node.nodes[2].type === 'word' &&
      (node.nodes[2].value.toLowerCase() === 'start' ||
        node.nodes[2].value.toLowerCase() === 'jump-start')
    ) {
      /** @type string */ (node.type) = 'word';
      node.value = 'step-start';

      delete (/** @type Partial<valueParser.FunctionNode> */ (node).nodes);

      return;
    }

    if (
      node.nodes[0].type === 'word' &&
      getValue(node.nodes[0]) === 1 &&
      node.nodes[2] &&
      node.nodes[2].type === 'word' &&
      (node.nodes[2].value.toLowerCase() === 'end' ||
        node.nodes[2].value.toLowerCase() === 'jump-end')
    ) {
      /** @type string */ (node.type) = 'word';
      node.value = 'step-end';

      delete (/** @type Partial<valueParser.FunctionNode> */ (node).nodes);

      return;
    }

    // The end case is actually the browser default, so it isn't required.
    if (
      node.nodes[2] &&
      node.nodes[2].type === 'word' &&
      (node.nodes[2].value.toLowerCase() === 'end' ||
        node.nodes[2].value.toLowerCase() === 'jump-end')
    ) {
      node.nodes = [node.nodes[0]];

      return;
    }

    return false;
  }

  if (lowerCasedValue === 'cubic-bezier') {
    const values = node.nodes
      .filter((list, index) => {
        return index % 2 === 0;
      })
      .map(getValue);

    if (values.length !== 4) {
      return;
    }

    const match = conversions.get(values.toString());

    if (match) {
      /** @type string */ (node.type) = 'word';
      node.value = match;

      delete (/** @type Partial<valueParser.FunctionNode> */ (node).nodes);

      return;
    }
  }
}

/**
 * @param {string} value
 * @return {string}
 */
function transform(value) {
  return valueParser(value).walk(reduce).toString();
}

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-normalize-timing-functions',

    OnceExit(css) {
      const cache = new Map();

      css.walkDecls(
        /^(-\w+-)?(animation|transition)(-timing-function)?$/i,
        (decl) => {
          const value = decl.value;

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
return __REQUIRE__(1679975018173);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser"]
//# sourceMappingURL=index.js.map