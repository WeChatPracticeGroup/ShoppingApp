module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018175, function(require, module, exports) {

const path = require('path');
const valueParser = require('postcss-value-parser');
const normalize = require('normalize-url');

const multiline = /\\[\r\n]/;
// eslint-disable-next-line no-useless-escape
const escapeChars = /([\s\(\)"'])/g;

// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
// Windows paths like `c:\`
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;

/**
 * Originally in sindresorhus/is-absolute-url
 *
 * @param {string} url
 */
function isAbsolute(url) {
  if (WINDOWS_PATH_REGEX.test(url)) {
    return false;
  }
  return ABSOLUTE_URL_REGEX.test(url);
}

/**
 * @param {string} url
 * @param {normalize.Options} options
 * @return {string}
 */
function convert(url, options) {
  if (isAbsolute(url) || url.startsWith('//')) {
    let normalizedURL;

    try {
      normalizedURL = normalize(url, options);
    } catch (e) {
      normalizedURL = url;
    }

    return normalizedURL;
  }

  // `path.normalize` always returns backslashes on Windows, need replace in `/`
  return path.normalize(url).replace(new RegExp('\\' + path.sep, 'g'), '/');
}

/**
 * @param {import('postcss').AtRule} rule
 * @return {void}
 */
function transformNamespace(rule) {
  rule.params = valueParser(rule.params)
    .walk((node) => {
      if (
        node.type === 'function' &&
        node.value.toLowerCase() === 'url' &&
        node.nodes.length
      ) {
        /** @type {valueParser.Node} */ (node).type = 'string';
        /** @type {any} */ (node).quote =
          node.nodes[0].type === 'string' ? node.nodes[0].quote : '"';
        node.value = node.nodes[0].value;
      }
      if (node.type === 'string') {
        node.value = node.value.trim();
      }
      return false;
    })
    .toString();
}

/**
 * @param {import('postcss').Declaration} decl
 * @param {normalize.Options} opts
 * @return {void}
 */
function transformDecl(decl, opts) {
  decl.value = valueParser(decl.value)
    .walk((node) => {
      if (node.type !== 'function' || node.value.toLowerCase() !== 'url') {
        return false;
      }

      node.before = node.after = '';

      if (!node.nodes.length) {
        return false;
      }
      let url = node.nodes[0];
      let escaped;

      url.value = url.value.trim().replace(multiline, '');

      // Skip empty URLs
      // Empty URL function equals request to current stylesheet where it is declared
      if (url.value.length === 0) {
        /** @type {any} */ (url).quote = '';

        return false;
      }

      if (/^data:(.*)?,/i.test(url.value)) {
        return false;
      }

      if (!/^.+-extension:\//i.test(url.value)) {
        url.value = convert(url.value, opts);
      }

      if (escapeChars.test(url.value) && url.type === 'string') {
        escaped = url.value.replace(escapeChars, '\\$1');

        if (escaped.length < url.value.length + 2) {
          url.value = escaped;
          /** @type {valueParser.Node} */ (url).type = 'word';
        }
      } else {
        url.type = 'word';
      }

      return false;
    })
    .toString();
}

/** @typedef {normalize.Options} Options */
/**
 * @type {import('postcss').PluginCreator<Options>}
 * @param {Options} opts
 * @return {import('postcss').Plugin}
 */
function pluginCreator(opts) {
  opts = Object.assign(
    {},
    {
      normalizeProtocol: false,
      sortQueryParameters: false,
      stripHash: false,
      stripWWW: false,
      stripTextFragment: false,
    },
    opts
  );

  return {
    postcssPlugin: 'postcss-normalize-url',

    OnceExit(css) {
      css.walk((node) => {
        if (node.type === 'decl') {
          return transformDecl(node, opts);
        } else if (
          node.type === 'atrule' &&
          node.name.toLowerCase() === 'namespace'
        ) {
          return transformNamespace(node);
        }
      });
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018175);
})()
//miniprogram-npm-outsideDeps=["path","postcss-value-parser","normalize-url"]
//# sourceMappingURL=index.js.map