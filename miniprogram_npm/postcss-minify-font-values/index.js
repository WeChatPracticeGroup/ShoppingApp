module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018156, function(require, module, exports) {

const valueParser = require('postcss-value-parser');
const minifyWeight = require('./lib/minify-weight');
const minifyFamily = require('./lib/minify-family');
const minifyFont = require('./lib/minify-font');

/**
 * @param {string} value
 * @return {boolean}
 */
function hasVariableFunction(value) {
  const lowerCasedValue = value.toLowerCase();

  return lowerCasedValue.includes('var(') || lowerCasedValue.includes('env(');
}

/**
 * @param {string} prop
 * @param {string} value
 * @param {Options} opts
 * @return {string}
 */
function transform(prop, value, opts) {
  let lowerCasedProp = prop.toLowerCase();

  if (lowerCasedProp === 'font-weight' && !hasVariableFunction(value)) {
    return minifyWeight(value);
  } else if (lowerCasedProp === 'font-family' && !hasVariableFunction(value)) {
    const tree = valueParser(value);

    tree.nodes = minifyFamily(tree.nodes, opts);

    return tree.toString();
  } else if (lowerCasedProp === 'font') {
    const tree = valueParser(value);

    tree.nodes = minifyFont(tree.nodes, opts);

    return tree.toString();
  }

  return value;
}

/** @typedef {{removeAfterKeyword?: boolean, removeDuplicates?: boolean, removeQuotes?: boolean}} Options */

/**
 * @type {import('postcss').PluginCreator<Options>}
 * @param {Options} opts
 * @return {import('postcss').Plugin}
 */
function pluginCreator(opts) {
  opts = Object.assign(
    {},
    {
      removeAfterKeyword: false,
      removeDuplicates: true,
      removeQuotes: true,
    },
    opts
  );

  return {
    postcssPlugin: 'postcss-minify-font-values',
    prepare() {
      const cache = new Map();
      return {
        OnceExit(css) {
          css.walkDecls(/font/i, (decl) => {
            const value = decl.value;

            if (!value) {
              return;
            }

            const prop = decl.prop;

            const cacheKey = `${prop}|${value}`;

            if (cache.has(cacheKey)) {
              decl.value = cache.get(cacheKey);

              return;
            }

            const newValue = transform(prop, value, opts);

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

}, function(modId) {var map = {"./lib/minify-weight":1679975018157,"./lib/minify-family":1679975018158,"./lib/minify-font":1679975018159}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018157, function(require, module, exports) {

/**
 * @param {string} value
 * @return {string}
 */
module.exports = function (value) {
  const lowerCasedValue = value.toLowerCase();

  return lowerCasedValue === 'normal'
    ? '400'
    : lowerCasedValue === 'bold'
    ? '700'
    : value;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018158, function(require, module, exports) {

const { stringify } = require('postcss-value-parser');

/**
 * @param {string[]} list
 * @return {string[]}
 */
function uniqueFontFamilies(list) {
  return list.filter((item, i) => {
    if (item.toLowerCase() === 'monospace') {
      return true;
    }
    return i === list.indexOf(item);
  });
}

const globalKeywords = ['inherit', 'initial', 'unset'];
const genericFontFamilykeywords = new Set([
  'sans-serif',
  'serif',
  'fantasy',
  'cursive',
  'monospace',
  'system-ui',
]);

/**
 * @param {string} value
 * @param {number} length
 * @return {string[]}
 */
function makeArray(value, length) {
  let array = [];
  while (length--) {
    array[length] = value;
  }
  return array;
}

// eslint-disable-next-line no-useless-escape
const regexSimpleEscapeCharacters = /[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/;

/**
 * @param {string} string
 * @param {boolean} escapeForString
 * @return {string}
 */
function escape(string, escapeForString) {
  let counter = 0;
  let character;
  let charCode;
  let value;
  let output = '';

  while (counter < string.length) {
    character = string.charAt(counter++);
    charCode = character.charCodeAt(0);

    // \r is already tokenized away at this point
    // `:` can be escaped as `\:`, but that fails in IE < 8
    if (!escapeForString && /[\t\n\v\f:]/.test(character)) {
      value = '\\' + charCode.toString(16) + ' ';
    } else if (
      !escapeForString &&
      regexSimpleEscapeCharacters.test(character)
    ) {
      value = '\\' + character;
    } else {
      value = character;
    }

    output += value;
  }

  if (!escapeForString) {
    if (/^-[-\d]/.test(output)) {
      output = '\\-' + output.slice(1);
    }

    const firstChar = string.charAt(0);

    if (/\d/.test(firstChar)) {
      output = '\\3' + firstChar + ' ' + output.slice(1);
    }
  }

  return output;
}

const regexKeyword = new RegExp(
  [...genericFontFamilykeywords].concat(globalKeywords).join('|'),
  'i'
);
const regexInvalidIdentifier = /^(-?\d|--)/;
const regexSpaceAtStart = /^\x20/;
const regexWhitespace = /[\t\n\f\r\x20]/g;
const regexIdentifierCharacter = /^[a-zA-Z\d\xa0-\uffff_-]+$/;
const regexConsecutiveSpaces = /(\\(?:[a-fA-F0-9]{1,6}\x20|\x20))?(\x20{2,})/g;
const regexTrailingEscape = /\\[a-fA-F0-9]{0,6}\x20$/;
const regexTrailingSpace = /\x20$/;

/**
 * @param {string} string
 * @return {string}
 */
function escapeIdentifierSequence(string) {
  let identifiers = string.split(regexWhitespace);
  let index = 0;
  /** @type {string[] | string} */
  let result = [];
  let escapeResult;

  while (index < identifiers.length) {
    let subString = identifiers[index++];

    if (subString === '') {
      result.push(subString);
      continue;
    }

    escapeResult = escape(subString, false);

    if (regexIdentifierCharacter.test(subString)) {
      // the font family name part consists of allowed characters exclusively
      if (regexInvalidIdentifier.test(subString)) {
        // the font family name part starts with two hyphens, a digit, or a
        // hyphen followed by a digit
        if (index === 1) {
          // if this is the first item
          result.push(escapeResult);
        } else {
          // if it’s not the first item, we can simply escape the space
          // between the two identifiers to merge them into a single
          // identifier rather than escaping the start characters of the
          // second identifier
          result[index - 2] += '\\';
          result.push(escape(subString, true));
        }
      } else {
        // the font family name part doesn’t start with two hyphens, a digit,
        // or a hyphen followed by a digit
        result.push(escapeResult);
      }
    } else {
      // the font family name part contains invalid identifier characters
      result.push(escapeResult);
    }
  }

  result = result.join(' ').replace(regexConsecutiveSpaces, ($0, $1, $2) => {
    const spaceCount = $2.length;
    const escapesNeeded = Math.floor(spaceCount / 2);
    const array = makeArray('\\ ', escapesNeeded);

    if (spaceCount % 2) {
      array[escapesNeeded - 1] += '\\ ';
    }

    return ($1 || '') + ' ' + array.join(' ');
  });

  // Escape trailing spaces unless they’re already part of an escape
  if (regexTrailingSpace.test(result) && !regexTrailingEscape.test(result)) {
    result = result.replace(regexTrailingSpace, '\\ ');
  }

  if (regexSpaceAtStart.test(result)) {
    result = '\\ ' + result.slice(1);
  }

  return result;
}
/**
 * @param {import('postcss-value-parser').Node[]} nodes
 * @param {import('../index').Options} opts
 * @return {import('postcss-value-parser').WordNode[]}
 */
module.exports = function (nodes, opts) {
  /** @type {import('postcss-value-parser').Node[]} */
  const family = [];
  /** @type {import('postcss-value-parser').WordNode | null} */
  let last = null;
  let i, max;

  nodes.forEach((node, index, arr) => {
    if (node.type === 'string' || node.type === 'function') {
      family.push(node);
    } else if (node.type === 'word') {
      if (!last) {
        last = /** @type {import('postcss-value-parser').WordNode} */ ({
          type: 'word',
          value: '',
        });
        family.push(last);
      }

      last.value += node.value;
    } else if (node.type === 'space') {
      if (last && index !== arr.length - 1) {
        last.value += ' ';
      }
    } else {
      last = null;
    }
  });

  let normalizedFamilies = family.map((node) => {
    if (node.type === 'string') {
      const isKeyword = regexKeyword.test(node.value);

      if (
        !opts.removeQuotes ||
        isKeyword ||
        /[0-9]/.test(node.value.slice(0, 1))
      ) {
        return stringify(node);
      }

      let escaped = escapeIdentifierSequence(node.value);

      if (escaped.length < node.value.length + 2) {
        return escaped;
      }
    }

    return stringify(node);
  });

  if (opts.removeAfterKeyword) {
    for (i = 0, max = normalizedFamilies.length; i < max; i += 1) {
      if (genericFontFamilykeywords.has(normalizedFamilies[i].toLowerCase())) {
        normalizedFamilies = normalizedFamilies.slice(0, i + 1);
        break;
      }
    }
  }

  if (opts.removeDuplicates) {
    normalizedFamilies = uniqueFontFamilies(normalizedFamilies);
  }

  return [
    /** @type {import('postcss-value-parser').WordNode} */ ({
      type: 'word',
      value: normalizedFamilies.join(),
    }),
  ];
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018159, function(require, module, exports) {

const { unit } = require('postcss-value-parser');
const keywords = require('./keywords');
const minifyFamily = require('./minify-family');
const minifyWeight = require('./minify-weight');

/**
 * @param {import('postcss-value-parser').Node[]} nodes
 * @param {import('../index').Options} opts
 * @return {import('postcss-value-parser').Node[]}
 */
module.exports = function (nodes, opts) {
  let i, max, node, family;
  let familyStart = NaN;
  let hasSize = false;

  for (i = 0, max = nodes.length; i < max; i += 1) {
    node = nodes[i];

    if (node.type === 'word') {
      if (hasSize) {
        continue;
      }

      const value = node.value.toLowerCase();

      if (
        value === 'normal' ||
        value === 'inherit' ||
        value === 'initial' ||
        value === 'unset'
      ) {
        familyStart = i;
      } else if (keywords.style.has(value) || unit(value)) {
        familyStart = i;
      } else if (keywords.variant.has(value)) {
        familyStart = i;
      } else if (keywords.weight.has(value)) {
        node.value = minifyWeight(value);
        familyStart = i;
      } else if (keywords.stretch.has(value)) {
        familyStart = i;
      } else if (keywords.size.has(value) || unit(value)) {
        familyStart = i;
        hasSize = true;
      }
    } else if (
      node.type === 'function' &&
      nodes[i + 1] &&
      nodes[i + 1].type === 'space'
    ) {
      familyStart = i;
    } else if (node.type === 'div' && node.value === '/') {
      familyStart = i + 1;
      break;
    }
  }

  familyStart += 2;

  family = minifyFamily(nodes.slice(familyStart), opts);

  return nodes.slice(0, familyStart).concat(family);
};

}, function(modId) { var map = {"./keywords":1679975018160,"./minify-family":1679975018158,"./minify-weight":1679975018157}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018160, function(require, module, exports) {

module.exports = {
  style: new Set(['italic', 'oblique']),
  variant: new Set(['small-caps']),
  weight: new Set([
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'bold',
    'lighter',
    'bolder',
  ]),
  stretch: new Set([
    'ultra-condensed',
    'extra-condensed',
    'condensed',
    'semi-condensed',
    'semi-expanded',
    'expanded',
    'extra-expanded',
    'ultra-expanded',
  ]),
  size: new Set([
    'xx-small',
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large',
    'larger',
    'smaller',
  ]),
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018156);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser"]
//# sourceMappingURL=index.js.map