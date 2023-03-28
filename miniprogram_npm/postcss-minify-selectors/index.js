module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018164, function(require, module, exports) {

const parser = require('postcss-selector-parser');
const canUnquote = require('./lib/canUnquote.js');

const pseudoElements = new Set([
  '::before',
  '::after',
  '::first-letter',
  '::first-line',
]);

/**
 * @param {parser.Attribute} selector
 * @return {void}
 */
function attribute(selector) {
  if (selector.value) {
    if (selector.raws.value) {
      // Join selectors that are split over new lines
      selector.raws.value = selector.raws.value.replace(/\\\n/g, '').trim();
    }
    if (canUnquote(selector.value)) {
      selector.quoteMark = null;
    }

    if (selector.operator) {
      selector.operator = /** @type {parser.AttributeOperator} */ (
        selector.operator.trim()
      );
    }
  }

  selector.rawSpaceBefore = '';
  selector.rawSpaceAfter = '';
  selector.spaces.attribute = { before: '', after: '' };
  selector.spaces.operator = { before: '', after: '' };
  selector.spaces.value = {
    before: '',
    after: selector.insensitive ? ' ' : '',
  };

  if (selector.raws.spaces) {
    selector.raws.spaces.attribute = {
      before: '',
      after: '',
    };

    selector.raws.spaces.operator = {
      before: '',
      after: '',
    };

    selector.raws.spaces.value = {
      before: '',
      after: selector.insensitive ? ' ' : '',
    };

    if (selector.insensitive) {
      selector.raws.spaces.insensitive = {
        before: '',
        after: '',
      };
    }
  }

  selector.attribute = selector.attribute.trim();
}

/**
 * @param {parser.Combinator} selector
 * @return {void}
 */
function combinator(selector) {
  const value = selector.value.trim();
  selector.spaces.before = '';
  selector.spaces.after = '';
  selector.rawSpaceBefore = '';
  selector.rawSpaceAfter = '';
  selector.value = value.length ? value : ' ';
}

const pseudoReplacements = new Map([
  [':nth-child', ':first-child'],
  [':nth-of-type', ':first-of-type'],
  [':nth-last-child', ':last-child'],
  [':nth-last-of-type', ':last-of-type'],
]);

/**
 * @param {parser.Pseudo} selector
 * @return {void}
 */
function pseudo(selector) {
  const value = selector.value.toLowerCase();

  if (selector.nodes.length === 1 && pseudoReplacements.has(value)) {
    const first = selector.at(0);
    const one = first.at(0);

    if (first.length === 1) {
      if (one.value === '1') {
        selector.replaceWith(
          parser.pseudo({
            value: /** @type {string} */ (pseudoReplacements.get(value)),
          })
        );
      }

      if (one.value && one.value.toLowerCase() === 'even') {
        one.value = '2n';
      }
    }

    if (first.length === 3) {
      const two = first.at(1);
      const three = first.at(2);

      if (
        one.value &&
        one.value.toLowerCase() === '2n' &&
        two.value === '+' &&
        three.value === '1'
      ) {
        one.value = 'odd';

        two.remove();
        three.remove();
      }
    }

    return;
  }

  selector.walk((child) => {
    if (child.type === 'selector' && child.parent) {
      const uniques = new Set();
      child.parent.each((sibling) => {
        const siblingStr = String(sibling);

        if (!uniques.has(siblingStr)) {
          uniques.add(siblingStr);
        } else {
          sibling.remove();
        }
      });
    }
  });

  if (pseudoElements.has(value)) {
    selector.value = selector.value.slice(1);
  }
}

const tagReplacements = new Map([
  ['from', '0%'],
  ['100%', 'to'],
]);

/**
 * @param {parser.Tag} selector
 * @return {void}
 */
function tag(selector) {
  const value = selector.value.toLowerCase();

  if (tagReplacements.has(value)) {
    selector.value = /** @type {string} */ (tagReplacements.get(value));
  }
}

/**
 * @param {parser.Universal} selector
 * @return {void}
 */
function universal(selector) {
  const next = selector.next();

  if (next && next.type !== 'combinator') {
    selector.remove();
  }
}

const reducers = new Map(
  /** @type {[string, ((selector: parser.Node) => void)][]}*/ ([
    ['attribute', attribute],
    ['combinator', combinator],
    ['pseudo', pseudo],
    ['tag', tag],
    ['universal', universal],
  ])
);

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-minify-selectors',

    OnceExit(css) {
      const cache = new Map();
      const processor = parser((selectors) => {
        const uniqueSelectors = new Set();

        selectors.walk((sel) => {
          // Trim whitespace around the value
          sel.spaces.before = sel.spaces.after = '';
          const reducer = reducers.get(sel.type);
          if (reducer !== undefined) {
            reducer(sel);
            return;
          }

          const toString = String(sel);

          if (
            sel.type === 'selector' &&
            sel.parent &&
            sel.parent.type !== 'pseudo'
          ) {
            if (!uniqueSelectors.has(toString)) {
              uniqueSelectors.add(toString);
            } else {
              sel.remove();
            }
          }
        });
        selectors.nodes.sort();
      });

      css.walkRules((rule) => {
        const selector =
          rule.raws.selector && rule.raws.selector.value === rule.selector
            ? rule.raws.selector.raw
            : rule.selector;

        // If the selector ends with a ':' it is likely a part of a custom mixin,
        // so just pass through.
        if (selector[selector.length - 1] === ':') {
          return;
        }

        if (cache.has(selector)) {
          rule.selector = cache.get(selector);

          return;
        }

        const optimizedSelector = processor.processSync(selector);

        rule.selector = optimizedSelector;
        cache.set(selector, optimizedSelector);
      });
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./lib/canUnquote.js":1679975018165}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018165, function(require, module, exports) {

/**
 * Can unquote attribute detection from mothereff.in
 * Copyright Mathias Bynens <https://mathiasbynens.be/>
 * https://github.com/mathiasbynens/mothereff.in
 */
const escapes = /\\([0-9A-Fa-f]{1,6})[ \t\n\f\r]?/g;
const range =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u002c\u002e\u002f\u003A-\u0040\u005B-\u005E\u0060\u007B-\u009f]/;

/**
 * @param {string} value
 * @return {boolean}
 */
module.exports = function canUnquote(value) {
  if (value === '-' || value === '') {
    return false;
  }

  value = value.replace(escapes, 'a').replace(/\\./g, 'a');

  return !(range.test(value) || /^(?:-?\d|--)/.test(value));
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018164);
})()
//miniprogram-npm-outsideDeps=["postcss-selector-parser"]
//# sourceMappingURL=index.js.map