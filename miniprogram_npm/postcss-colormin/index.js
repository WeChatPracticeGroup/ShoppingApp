module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018119, function(require, module, exports) {

const browserslist = require('browserslist');
const { isSupported } = require('caniuse-api');
const valueParser = require('postcss-value-parser');
const minifyColor = require('./minifyColor');

/**
 * @param {{nodes: valueParser.Node[]}} parent
 * @param {(node: valueParser.Node, index: number, parent: {nodes: valueParser.Node[]}) => false | undefined} callback
 * @return {void}
 */
function walk(parent, callback) {
  parent.nodes.forEach((node, index) => {
    const bubble = callback(node, index, parent);

    if (node.type === 'function' && bubble !== false) {
      walk(node, callback);
    }
  });
}

/*
 * IE 8 & 9 do not properly handle clicks on elements
 * with a `transparent` `background-color`.
 *
 * https://developer.mozilla.org/en-US/docs/Web/Events/click#Internet_Explorer
 */
const browsersWithTransparentBug = new Set(['ie 8', 'ie 9']);
const mathFunctions = new Set(['calc', 'min', 'max', 'clamp']);

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
 * @param {string} value
 * @param {Record<string, boolean>} options
 * @return {string}
 */
function transform(value, options) {
  const parsed = valueParser(value);

  walk(parsed, (node, index, parent) => {
    if (node.type === 'function') {
      if (/^(rgb|hsl)a?$/i.test(node.value)) {
        const { value: originalValue } = node;

        node.value = minifyColor(valueParser.stringify(node), options);
        /** @type {string} */ (node.type) = 'word';

        const next = parent.nodes[index + 1];

        if (
          node.value !== originalValue &&
          next &&
          (next.type === 'word' || next.type === 'function')
        ) {
          parent.nodes.splice(
            index + 1,
            0,
            /** @type {valueParser.SpaceNode} */ ({
              type: 'space',
              value: ' ',
            })
          );
        }
      } else if (isMathFunctionNode(node)) {
        return false;
      }
    } else if (node.type === 'word') {
      node.value = minifyColor(node.value, options);
    }
  });

  return parsed.toString();
}

/**
 * @param {Record<string, boolean>} options
 * @param {string[]} browsers
 * @return {Record<string, boolean>}
 */
function addPluginDefaults(options, browsers) {
  const defaults = {
    // Does the browser support 4 & 8 character hex notation
    transparent:
      browsers.some((b) => browsersWithTransparentBug.has(b)) === false,
    // Does the browser support "transparent" value properly
    alphaHex: isSupported('css-rrggbbaa', browsers),
    name: true,
  };
  return { ...defaults, ...options };
}
/**
 * @type {import('postcss').PluginCreator<Record<string, boolean>>}
 * @param {Record<string, boolean>} config
 * @return {import('postcss').Plugin}
 */
function pluginCreator(config = {}) {
  return {
    postcssPlugin: 'postcss-colormin',

    prepare(result) {
      /** @type {typeof result.opts & browserslist.Options} */
      const resultOptions = result.opts || {};
      const browsers = browserslist(null, {
        stats: resultOptions.stats,
        path: __dirname,
        env: resultOptions.env,
      });

      const cache = new Map();
      const options = addPluginDefaults(config, browsers);

      return {
        OnceExit(css) {
          css.walkDecls((decl) => {
            if (
              /^(composes|font|src$|filter|-webkit-tap-highlight-color)/i.test(
                decl.prop
              )
            ) {
              return;
            }

            const value = decl.value;

            if (!value) {
              return;
            }

            const cacheKey = JSON.stringify({ value, options, browsers });

            if (cache.has(cacheKey)) {
              decl.value = cache.get(cacheKey);

              return;
            }

            const newValue = transform(value, options);

            decl.value = newValue;
            cache.set(cacheKey, newValue);
          });
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./minifyColor":1679975018120}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018120, function(require, module, exports) {

const { colord, extend } = require('colord');
const namesPlugin = require('colord/plugins/names');
const minifierPlugin = require('colord/plugins/minify');

extend(/** @type {any[]} */ ([namesPlugin, minifierPlugin]));

/**
 * Performs color value minification
 *
 * @param {string} input - CSS value
 * @param {Record<string, boolean>} options  object with colord.minify() options
 * @return {string}
 */
module.exports = function minifyColor(input, options = {}) {
  const instance = colord(input);

  if (instance.isValid()) {
    // Try to shorten the string if it is a valid CSS color value
    const minified = instance.minify(options);

    // Fall back to the original input if it's smaller or has equal length
    return minified.length < input.length ? minified : input.toLowerCase();
  } else {
    // Possibly malformed, so pass through
    return input;
  }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018119);
})()
//miniprogram-npm-outsideDeps=["browserslist","caniuse-api","postcss-value-parser","colord","colord/plugins/names","colord/plugins/minify"]
//# sourceMappingURL=index.js.map