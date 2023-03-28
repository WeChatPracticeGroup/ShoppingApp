module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018177, function(require, module, exports) {

const valueParser = require('postcss-value-parser');
const {
  normalizeGridAutoFlow,
  normalizeGridColumnRowGap,
  normalizeGridColumnRow,
} = require('./rules/grid');

// rules
const animation = require('./rules/animation');
const border = require('./rules/border');
const boxShadow = require('./rules/boxShadow');
const flexFlow = require('./rules/flexFlow');
const transition = require('./rules/transition');
const listStyle = require('./rules/listStyle');
const column = require('./rules/columns');
const vendorUnprefixed = require('./lib/vendorUnprefixed.js');

/** @type {[string, (parsed: valueParser.ParsedValue) => string][]} */
const borderRules = [
  ['border', border],
  ['border-block', border],
  ['border-inline', border],
  ['border-block-end', border],
  ['border-block-start', border],
  ['border-inline-end', border],
  ['border-inline-start', border],
  ['border-top', border],
  ['border-right', border],
  ['border-bottom', border],
  ['border-left', border],
];

/** @type {[string, (parsed: valueParser.ParsedValue) => string | string[] | valueParser.ParsedValue][]} */
const grid = [
  ['grid-auto-flow', normalizeGridAutoFlow],
  ['grid-column-gap', normalizeGridColumnRowGap], // normal | <length-percentage>
  ['grid-row-gap', normalizeGridColumnRowGap], // normal | <length-percentage>
  ['grid-column', normalizeGridColumnRow], // <grid-line>+
  ['grid-row', normalizeGridColumnRow], // <grid-line>+
  ['grid-row-start', normalizeGridColumnRow], // <grid-line>
  ['grid-row-end', normalizeGridColumnRow], // <grid-line>
  ['grid-column-start', normalizeGridColumnRow], // <grid-line>
  ['grid-column-end', normalizeGridColumnRow], // <grid-line>
];

/** @type {[string, (parsed: valueParser.ParsedValue) => string | valueParser.ParsedValue][]} */
const columnRules = [
  ['column-rule', border],
  ['columns', column],
];

/** @type {Map<string, ((parsed: valueParser.ParsedValue) => string | string[] | valueParser.ParsedValue)>} */
const rules = new Map([
  ['animation', animation],
  ['outline', border],
  ['box-shadow', boxShadow],
  ['flex-flow', flexFlow],
  ['list-style', listStyle],
  ['transition', transition],
  ...borderRules,
  ...grid,
  ...columnRules,
]);

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
 * @param {valueParser.ParsedValue} parsed
 * @return {boolean}
 */
function shouldAbort(parsed) {
  let abort = false;

  parsed.walk((node) => {
    if (
      node.type === 'comment' ||
      isVariableFunctionNode(node) ||
      (node.type === 'word' && node.value.includes(`___CSS_LOADER_IMPORT___`))
    ) {
      abort = true;

      return false;
    }
  });

  return abort;
}

/**
 * @param {import('postcss').Declaration} decl
 * @return {string}
 */
function getValue(decl) {
  let { value, raws } = decl;

  if (raws && raws.value && raws.value.raw) {
    value = raws.value.raw;
  }

  return value;
}
/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-ordered-values',
    prepare() {
      const cache = new Map();
      return {
        OnceExit(css) {
          css.walkDecls((decl) => {
            const lowerCasedProp = decl.prop.toLowerCase();
            const normalizedProp = vendorUnprefixed(lowerCasedProp);
            const processor = rules.get(normalizedProp);

            if (!processor) {
              return;
            }

            const value = getValue(decl);

            if (cache.has(value)) {
              decl.value = cache.get(value);

              return;
            }

            const parsed = valueParser(value);

            if (parsed.nodes.length < 2 || shouldAbort(parsed)) {
              cache.set(value, value);

              return;
            }

            const result = processor(parsed);

            decl.value = result.toString();
            cache.set(value, result.toString());
          });
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./rules/grid":1679975018178,"./rules/animation":1679975018180,"./rules/border":1679975018183,"./rules/boxShadow":1679975018185,"./rules/flexFlow":1679975018187,"./rules/transition":1679975018188,"./rules/listStyle":1679975018189,"./rules/columns":1679975018191,"./lib/vendorUnprefixed.js":1679975018186}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018178, function(require, module, exports) {

const joinGridValue = require('../lib/joinGridValue');

/**
 * @param {import('postcss-value-parser').ParsedValue} gridAutoFlow
 * @return {import('postcss-value-parser').ParsedValue | string}
 */
const normalizeGridAutoFlow = (gridAutoFlow) => {
  let newValue = { front: '', back: '' };
  let shouldNormalize = false;
  gridAutoFlow.walk((node) => {
    if (node.value === 'dense') {
      shouldNormalize = true;
      newValue.back = node.value;
    } else if (['row', 'column'].includes(node.value.trim().toLowerCase())) {
      shouldNormalize = true;
      newValue.front = node.value;
    } else {
      shouldNormalize = false;
    }
  });
  if (shouldNormalize) {
    return `${newValue.front.trim()} ${newValue.back.trim()}`;
  }
  return gridAutoFlow;
};

/**
 * @param {import('postcss-value-parser').ParsedValue} gridGap
 * @return {import('postcss-value-parser').ParsedValue | string}
 */
const normalizeGridColumnRowGap = (gridGap) => {
  let newValue = { front: '', back: '' };
  let shouldNormalize = false;
  gridGap.walk((node) => {
    // console.log(node);
    if (node.value === 'normal') {
      shouldNormalize = true;
      newValue.front = node.value;
    } else {
      newValue.back = `${newValue.back} ${node.value}`;
    }
  });
  if (shouldNormalize) {
    return `${newValue.front.trim()} ${newValue.back.trim()}`;
  }
  return gridGap;
};

/**
 * @param {import('postcss-value-parser').ParsedValue} grid
 * @return {string | string[]}
 */
const normalizeGridColumnRow = (grid) => {
  // cant do normalization here using node, so copy it as a string
  let gridValue = grid.toString().split('/'); // node -> string value, split ->  " 2 / 3 span " ->  [' 2','3 span ']
  if (gridValue.length > 1) {
    return joinGridValue(
      gridValue.map((gridLine) => {
        let normalizeValue = {
          front: '',
          back: '',
        };
        gridLine = gridLine.trim(); // '3 span ' -> '3 span'
        gridLine.split(' ').forEach((node) => {
          // ['3','span']
          if (node === 'span') {
            normalizeValue.front = node; // span _
          } else {
            normalizeValue.back = `${normalizeValue.back} ${node}`; // _ 3
          }
        });
        return `${normalizeValue.front.trim()} ${normalizeValue.back.trim()}`; // span 3
      })
      // returns "2 / span 3"
    );
  }
  // doing this separating if `/` is not present as while joining('/') , it will add `/` at the end
  return gridValue.map((gridLine) => {
    let normalizeValue = {
      front: '',
      back: '',
    };
    gridLine = gridLine.trim();
    gridLine.split(' ').forEach((node) => {
      if (node === 'span') {
        normalizeValue.front = node;
      } else {
        normalizeValue.back = `${normalizeValue.back} ${node}`;
      }
    });
    return `${normalizeValue.front.trim()} ${normalizeValue.back.trim()}`;
  });
};

module.exports = {
  normalizeGridAutoFlow,
  normalizeGridColumnRowGap,
  normalizeGridColumnRow,
};

}, function(modId) { var map = {"../lib/joinGridValue":1679975018179}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018179, function(require, module, exports) {

/**
 * @param {string[]} grid
 * @return {string}
 */
module.exports = function joinGridVal(grid) {
  return grid.join(' / ').trim();
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018180, function(require, module, exports) {

const { unit } = require('postcss-value-parser');
const { getArguments } = require('cssnano-utils');
const addSpace = require('../lib/addSpace');
const getValue = require('../lib/getValue');

// animation: [ none | <keyframes-name> ] || <time> || <single-timing-function> || <time> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state>
const functions = new Set(['steps', 'cubic-bezier', 'frames']);
const keywords = new Set([
  'ease',
  'ease-in',
  'ease-in-out',
  'ease-out',
  'linear',
  'step-end',
  'step-start',
]);

const directions = new Set([
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
]);
const fillModes = new Set(['none', 'forwards', 'backwards', 'both']);
const playStates = new Set(['running', 'paused']);
const timeUnits = new Set(['ms', 's']);

/**
 * @param {string} value
 * @param {string} type
 * @return {boolean}
 */
const isTimingFunction = (value, type) => {
  return (type === 'function' && functions.has(value)) || keywords.has(value);
};
/**
 * @param {string} value
 * @return {boolean}
 */
const isDirection = (value) => {
  return directions.has(value);
};
/**
 * @param {string} value
 * @return {boolean}
 */
const isFillMode = (value) => {
  return fillModes.has(value);
};
/**
 * @param {string} value
 * @return {boolean}
 */
const isPlayState = (value) => {
  return playStates.has(value);
};
/**
 * @param {string} value
 * @return {boolean}
 */
const isTime = (value) => {
  const quantity = unit(value);

  return quantity && timeUnits.has(quantity.unit);
};
/**
 * @param {string} value
 * @return {boolean}
 */
const isIterationCount = (value) => {
  const quantity = unit(value);

  return value === 'infinite' || (quantity && !quantity.unit);
};

const stateConditions = [
  { property: 'duration', delegate: isTime },
  { property: 'timingFunction', delegate: isTimingFunction },
  { property: 'delay', delegate: isTime },
  { property: 'iterationCount', delegate: isIterationCount },
  { property: 'direction', delegate: isDirection },
  { property: 'fillMode', delegate: isFillMode },
  { property: 'playState', delegate: isPlayState },
];
/**
 * @param {import('postcss-value-parser').Node[][]} args
 * @return {import('postcss-value-parser').Node[][]}
 */
function normalize(args) {
  const list = [];

  for (const arg of args) {
    /** @type {Record<string, import('postcss-value-parser').Node[]>} */
    const state = {
      name: [],
      duration: [],
      timingFunction: [],
      delay: [],
      iterationCount: [],
      direction: [],
      fillMode: [],
      playState: [],
    };

    arg.forEach((node) => {
      let { type, value } = node;

      if (type === 'space') {
        return;
      }

      value = value.toLowerCase();

      const hasMatch = stateConditions.some(({ property, delegate }) => {
        if (delegate(value, type) && !state[property].length) {
          state[property] = [node, addSpace()];
          return true;
        }
      });

      if (!hasMatch) {
        state.name = [...state.name, node, addSpace()];
      }
    });

    list.push([
      ...state.name,
      ...state.duration,
      ...state.timingFunction,
      ...state.delay,
      ...state.iterationCount,
      ...state.direction,
      ...state.fillMode,
      ...state.playState,
    ]);
  }
  return list;
}
/**
 * @param {import('postcss-value-parser').ParsedValue} parsed
 * @return {string}
 */
module.exports = function normalizeAnimation(parsed) {
  const values = normalize(getArguments(parsed));

  return getValue(values);
};

}, function(modId) { var map = {"../lib/addSpace":1679975018181,"../lib/getValue":1679975018182}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018181, function(require, module, exports) {

/** @return {import('postcss-value-parser').SpaceNode} */
module.exports = function addSpace() {
  return /** @type import('postcss-value-parser').SpaceNode */ ({
    type: 'space',
    value: ' ',
  });
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018182, function(require, module, exports) {

const { stringify } = require('postcss-value-parser');

/**
 * @param {import('postcss-value-parser').Node[][]} values
 * @return {string}
 */
module.exports = function getValue(values) {
  return stringify(flatten(values));
};
/**
 * @param {import('postcss-value-parser').Node[][]} values
 * @return {import('postcss-value-parser').Node[]}
 */
function flatten(values) {
  /** @type {import('postcss-value-parser').Node[]} */
  const nodes = [];
  for (const [index, arg] of values.entries()) {
    arg.forEach((val, idx) => {
      if (
        idx === arg.length - 1 &&
        index === values.length - 1 &&
        val.type === 'space'
      ) {
        return;
      }
      nodes.push(val);
    });

    if (index !== values.length - 1) {
      nodes[nodes.length - 1].type = 'div';
      nodes[nodes.length - 1].value = ',';
    }
  }
  return nodes;
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018183, function(require, module, exports) {

const { unit, stringify } = require('postcss-value-parser');
const mathFunctions = require('../lib/mathfunctions.js');

// border: <line-width> || <line-style> || <color>
// outline: <outline-color> || <outline-style> || <outline-width>

const borderWidths = new Set(['thin', 'medium', 'thick']);

const borderStyles = new Set([
  'none',
  'auto', // only in outline-style
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
]);

/**
 * @param {import('postcss-value-parser').ParsedValue} border
 * @return {string}
 */
module.exports = function normalizeBorder(border) {
  const order = { width: '', style: '', color: '' };

  border.walk((node) => {
    const { type, value } = node;
    if (type === 'word') {
      if (borderStyles.has(value.toLowerCase())) {
        order.style = value;
        return false;
      }
      if (borderWidths.has(value.toLowerCase()) || unit(value.toLowerCase())) {
        if (order.width !== '') {
          order.width = `${order.width} ${value}`;
          return false;
        }
        order.width = value;
        return false;
      }
      order.color = value;
      return false;
    }
    if (type === 'function') {
      if (mathFunctions.has(value.toLowerCase())) {
        order.width = stringify(node);
      } else {
        order.color = stringify(node);
      }
      return false;
    }
  });

  return `${order.width} ${order.style} ${order.color}`.trim();
};

}, function(modId) { var map = {"../lib/mathfunctions.js":1679975018184}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018184, function(require, module, exports) {

// All of the curently implemented math functions
module.exports = new Set(['calc', 'clamp', 'max', 'min']);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018185, function(require, module, exports) {

const { unit } = require('postcss-value-parser');
const { getArguments } = require('cssnano-utils');
const addSpace = require('../lib/addSpace');
const getValue = require('../lib/getValue');
const mathFunctions = require('../lib/mathfunctions.js');
const vendorUnprefixed = require('../lib/vendorUnprefixed.js');

// box-shadow: inset? && <length>{2,4} && <color>?

/**
 * @param {import('postcss-value-parser').ParsedValue} parsed
 * @return {string}
 */
module.exports = function normalizeBoxShadow(parsed) {
  let args = getArguments(parsed);

  const normalized = normalize(args);

  if (normalized === false) {
    return parsed.toString();
  }

  return getValue(normalized);
};
/**
 * @param {import('postcss-value-parser').Node[][]} args
 * @return {false | import('postcss-value-parser').Node[][]}
 */
function normalize(args) {
  const list = [];
  let abort = false;
  for (const arg of args) {
    /** @type {import('postcss-value-parser').Node[]} */
    let val = [];
    /** @type {Record<'inset'|'color', import('postcss-value-parser').Node[]>} */
    let state = {
      inset: [],
      color: [],
    };

    arg.forEach((node) => {
      const { type, value } = node;

      if (
        type === 'function' &&
        mathFunctions.has(vendorUnprefixed(value.toLowerCase()))
      ) {
        abort = true;
        return;
      }

      if (type === 'space') {
        return;
      }

      if (unit(value)) {
        val = [...val, node, addSpace()];
      } else if (value.toLowerCase() === 'inset') {
        state.inset = [...state.inset, node, addSpace()];
      } else {
        state.color = [...state.color, node, addSpace()];
      }
    });

    if (abort) {
      return false;
    }

    list.push([...state.inset, ...val, ...state.color]);
  }
  return list;
}

}, function(modId) { var map = {"../lib/addSpace":1679975018181,"../lib/getValue":1679975018182,"../lib/mathfunctions.js":1679975018184,"../lib/vendorUnprefixed.js":1679975018186}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018186, function(require, module, exports) {

/**
 * @param {string} prop
 * @return {string}
 */
function vendorUnprefixed(prop) {
  return prop.replace(/^-\w+-/, '');
}

module.exports = vendorUnprefixed;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018187, function(require, module, exports) {

// flex-flow: <flex-direction> || <flex-wrap>

const flexDirection = new Set([
  'row',
  'row-reverse',
  'column',
  'column-reverse',
]);

const flexWrap = new Set(['nowrap', 'wrap', 'wrap-reverse']);

/**
 * @param {import('postcss-value-parser').ParsedValue} flexFlow
 * @return {string}
 */
module.exports = function normalizeFlexFlow(flexFlow) {
  let order = {
    direction: '',
    wrap: '',
  };

  flexFlow.walk(({ value }) => {
    if (flexDirection.has(value.toLowerCase())) {
      order.direction = value;
      return;
    }

    if (flexWrap.has(value.toLowerCase())) {
      order.wrap = value;
      return;
    }
  });

  return `${order.direction} ${order.wrap}`.trim();
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018188, function(require, module, exports) {

const { unit } = require('postcss-value-parser');
const { getArguments } = require('cssnano-utils');
const addSpace = require('../lib/addSpace');
const getValue = require('../lib/getValue');

// transition: [ none | <single-transition-property> ] || <time> || <single-transition-timing-function> || <time>

const timingFunctions = new Set([
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'step-start',
  'step-end',
]);

/**
 * @param {import('postcss-value-parser').Node[][]} args
 * @return {import('postcss-value-parser').Node[][]}
 */
function normalize(args) {
  const list = [];
  for (const arg of args) {
    /** @type {Record<string, import('postcss-value-parser').Node[]>} */
    let state = {
      timingFunction: [],
      property: [],
      time1: [],
      time2: [],
    };

    arg.forEach((node) => {
      const { type, value } = node;

      if (type === 'space') {
        return;
      }

      if (
        type === 'function' &&
        new Set(['steps', 'cubic-bezier']).has(value.toLowerCase())
      ) {
        state.timingFunction = [...state.timingFunction, node, addSpace()];
      } else if (unit(value)) {
        if (!state.time1.length) {
          state.time1 = [...state.time1, node, addSpace()];
        } else {
          state.time2 = [...state.time2, node, addSpace()];
        }
      } else if (timingFunctions.has(value.toLowerCase())) {
        state.timingFunction = [...state.timingFunction, node, addSpace()];
      } else {
        state.property = [...state.property, node, addSpace()];
      }
    });

    list.push([
      ...state.property,
      ...state.time1,
      ...state.timingFunction,
      ...state.time2,
    ]);
  }
  return list;
}
/**
 * @param {import('postcss-value-parser').ParsedValue} parsed
 * @return {string}
 */
module.exports = function normalizeTransition(parsed) {
  const values = normalize(getArguments(parsed));

  return getValue(values);
};

}, function(modId) { var map = {"../lib/addSpace":1679975018181,"../lib/getValue":1679975018182}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018189, function(require, module, exports) {

const valueParser = require('postcss-value-parser');
const listStyleTypes = require('./listStyleTypes.json');

const definedTypes = new Set(listStyleTypes['list-style-type']);

const definedPosition = new Set(['inside', 'outside']);

/**
 * @param {import('postcss-value-parser').ParsedValue} listStyle
 * @return {string}
 */
module.exports = function listStyleNormalizer(listStyle) {
  const order = { type: '', position: '', image: '' };

  listStyle.walk((decl) => {
    if (decl.type === 'word') {
      if (definedTypes.has(decl.value)) {
        // its a type field
        order.type = `${order.type} ${decl.value}`;
      } else if (definedPosition.has(decl.value)) {
        order.position = `${order.position} ${decl.value}`;
      } else if (decl.value === 'none') {
        if (
          order.type
            .split(' ')
            .filter((e) => e !== '' && e !== ' ')
            .includes('none')
        ) {
          order.image = `${order.image} ${decl.value}`;
        } else {
          order.type = `${order.type} ${decl.value}`;
        }
      } else {
        order.type = `${order.type} ${decl.value}`;
      }
    }
    if (decl.type === 'function') {
      order.image = `${order.image} ${valueParser.stringify(decl)}`;
    }
  });

  return `${order.type.trim()} ${order.position.trim()} ${order.image.trim()}`.trim();
};

}, function(modId) { var map = {"./listStyleTypes.json":1679975018190}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018190, function(require, module, exports) {
module.exports = {
  "list-style-type": [
    "afar",
    "amharic",
    "amharic-abegede",
    "arabic-indic",
    "armenian",
    "asterisks",
    "bengali",
    "binary",
    "cambodian",
    "circle",
    "cjk-decimal",
    "cjk-earthly-branch",
    "cjk-heavenly-stem",
    "cjk-ideographic",
    "decimal",
    "decimal-leading-zero",
    "devanagari",
    "disc",
    "disclosure-closed",
    "disclosure-open",
    "ethiopic",
    "ethiopic-abegede",
    "ethiopic-abegede-am-et",
    "ethiopic-abegede-gez",
    "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et",
    "ethiopic-halehame",
    "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et",
    "ethiopic-halehame-am",
    "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez",
    "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et",
    "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er",
    "ethiopic-halehame-ti-et",
    "ethiopic-halehame-tig",
    "ethiopic-numeric",
    "footnotes",
    "georgian",
    "gujarati",
    "gurmukhi",
    "hangul",
    "hangul-consonant",
    "hebrew",
    "hiragana",
    "hiragana-iroha",
    "japanese-formal",
    "japanese-informal",
    "kannada",
    "katakana",
    "katakana-iroha",
    "khmer",
    "korean-hangul-formal",
    "korean-hanja-formal",
    "korean-hanja-informal",
    "lao",
    "lower-alpha",
    "lower-armenian",
    "lower-greek",
    "lower-hexadecimal",
    "lower-latin",
    "lower-norwegian",
    "lower-roman",
    "malayalam",
    "mongolian",
    "myanmar",
    "octal",
    "oriya",
    "oromo",
    "persian",
    "sidama",
    "simp-chinese-formal",
    "simp-chinese-informal",
    "somali",
    "square",
    "string",
    "symbols",
    "tamil",
    "telugu",
    "thai",
    "tibetan",
    "tigre",
    "tigrinya-er",
    "tigrinya-er-abegede",
    "tigrinya-et",
    "tigrinya-et-abegede",
    "trad-chinese-formal",
    "trad-chinese-informal",
    "upper-alpha",
    "upper-armenian",
    "upper-greek",
    "upper-hexadecimal",
    "upper-latin",
    "upper-norwegian",
    "upper-roman",
    "urdu"
  ]
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018191, function(require, module, exports) {

const { unit } = require('postcss-value-parser');

/**
 * @param {string} value
 * @return {boolean}
 */
function hasUnit(value) {
  const parsedVal = unit(value);
  return parsedVal && parsedVal.unit !== '';
}

/**
 * @param {import('postcss-value-parser').ParsedValue} columns
 * @return {import('postcss-value-parser').ParsedValue | string}
 */
module.exports = (columns) => {
  /** @type {string[]} */
  const widths = [];
  /** @type {string[]} */
  const other = [];
  columns.walk((node) => {
    const { type, value } = node;
    if (type === 'word') {
      if (hasUnit(value)) {
        widths.push(value);
      } else {
        other.push(value);
      }
    }
  });

  // only transform if declaration is not invalid or a single value
  if (other.length === 1 && widths.length === 1) {
    return `${widths[0].trimStart()} ${other[0].trimStart()}`;
  }

  return columns;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018177);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser","cssnano-utils"]
//# sourceMappingURL=index.js.map