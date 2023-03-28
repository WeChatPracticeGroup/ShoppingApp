module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018161, function(require, module, exports) {

const valueParser = require('postcss-value-parser');
const { getArguments } = require('cssnano-utils');
const isColorStop = require('./isColorStop.js');

const angles = {
  top: '0deg',
  right: '90deg',
  bottom: '180deg',
  left: '270deg',
};

/**
 * @param {valueParser.Dimension} a
 * @param {valueParser.Dimension} b
 * @return {boolean}
 */
function isLessThan(a, b) {
  return (
    a.unit.toLowerCase() === b.unit.toLowerCase() &&
    parseFloat(a.number) >= parseFloat(b.number)
  );
}
/**
 * @param {import('postcss').Declaration} decl
 * @return {void}
 */
function optimise(decl) {
  const value = decl.value;

  if (!value) {
    return;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue.includes('var(') || normalizedValue.includes('env(')) {
    return;
  }

  if (!normalizedValue.includes('gradient')) {
    return;
  }

  decl.value = valueParser(value)
    .walk((node) => {
      if (node.type !== 'function' || !node.nodes.length) {
        return false;
      }

      const lowerCasedValue = node.value.toLowerCase();

      if (
        lowerCasedValue === 'linear-gradient' ||
        lowerCasedValue === 'repeating-linear-gradient' ||
        lowerCasedValue === '-webkit-linear-gradient' ||
        lowerCasedValue === '-webkit-repeating-linear-gradient'
      ) {
        let args = getArguments(node);

        if (
          node.nodes[0].value.toLowerCase() === 'to' &&
          args[0].length === 3
        ) {
          node.nodes = node.nodes.slice(2);
          node.nodes[0].value =
            angles[
              /** @type {'top'|'right'|'bottom'|'left'}*/ (
                node.nodes[0].value.toLowerCase()
              )
            ];
        }

        /** @type {valueParser.Dimension | false} */
        let lastStop;

        args.forEach((arg, index) => {
          if (arg.length !== 3) {
            return;
          }

          let isFinalStop = index === args.length - 1;
          let thisStop = valueParser.unit(arg[2].value);

          if (lastStop === undefined) {
            lastStop = thisStop;

            if (
              !isFinalStop &&
              lastStop &&
              lastStop.number === '0' &&
              lastStop.unit.toLowerCase() !== 'deg'
            ) {
              arg[1].value = arg[2].value = '';
            }

            return;
          }

          if (lastStop && thisStop && isLessThan(lastStop, thisStop)) {
            arg[2].value = '0';
          }

          lastStop = thisStop;

          if (isFinalStop && arg[2].value === '100%') {
            arg[1].value = arg[2].value = '';
          }
        });

        return false;
      }

      if (
        lowerCasedValue === 'radial-gradient' ||
        lowerCasedValue === 'repeating-radial-gradient'
      ) {
        let args = getArguments(node);
        /** @type {valueParser.Dimension | false} */
        let lastStop;

        const hasAt = args[0].find((n) => n.value.toLowerCase() === 'at');

        args.forEach((arg, index) => {
          if (!arg[2] || (!index && hasAt)) {
            return;
          }

          let thisStop = valueParser.unit(arg[2].value);

          if (!lastStop) {
            lastStop = thisStop;

            return;
          }

          if (lastStop && thisStop && isLessThan(lastStop, thisStop)) {
            arg[2].value = '0';
          }

          lastStop = thisStop;
        });

        return false;
      }

      if (
        lowerCasedValue === '-webkit-radial-gradient' ||
        lowerCasedValue === '-webkit-repeating-radial-gradient'
      ) {
        let args = getArguments(node);
        /** @type {valueParser.Dimension | false} */
        let lastStop;

        args.forEach((arg) => {
          let color;
          let stop;

          if (arg[2] !== undefined) {
            if (arg[0].type === 'function') {
              color = `${arg[0].value}(${valueParser.stringify(arg[0].nodes)})`;
            } else {
              color = arg[0].value;
            }

            if (arg[2].type === 'function') {
              stop = `${arg[2].value}(${valueParser.stringify(arg[2].nodes)})`;
            } else {
              stop = arg[2].value;
            }
          } else {
            if (arg[0].type === 'function') {
              color = `${arg[0].value}(${valueParser.stringify(arg[0].nodes)})`;
            }

            color = arg[0].value;
          }

          color = color.toLowerCase();

          const colorStop =
            stop !== undefined
              ? isColorStop(color, stop.toLowerCase())
              : isColorStop(color);

          if (!colorStop || !arg[2]) {
            return;
          }

          let thisStop = valueParser.unit(arg[2].value);

          if (!lastStop) {
            lastStop = thisStop;

            return;
          }

          if (lastStop && thisStop && isLessThan(lastStop, thisStop)) {
            arg[2].value = '0';
          }

          lastStop = thisStop;
        });

        return false;
      }
    })
    .toString();
}
/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-minify-gradients',
    OnceExit(css) {
      css.walkDecls(optimise);
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./isColorStop.js":1679975018162}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018162, function(require, module, exports) {

const { unit } = require('postcss-value-parser');
const { colord, extend } = require('colord');
const namesPlugin = require('colord/plugins/names');

extend([/** @type {any} */ (namesPlugin)]);

/* Code derived from https://github.com/pigcan/is-color-stop */

const lengthUnits = new Set([
  'PX',
  'IN',
  'CM',
  'MM',
  'EM',
  'REM',
  'POINTS',
  'PC',
  'EX',
  'CH',
  'VW',
  'VH',
  'VMIN',
  'VMAX',
  '%',
]);

/**
 * @param {string} input
 * @return {boolean}
 */
function isCSSLengthUnit(input) {
  return lengthUnits.has(input.toUpperCase());
}
/**
 * @param {string|undefined} str
 * @return {boolean}
 */
function isStop(str) {
  if (str) {
    let stop = false;
    const node = unit(str);
    if (node) {
      const number = Number(node.number);
      if (number === 0 || (!isNaN(number) && isCSSLengthUnit(node.unit))) {
        stop = true;
      }
    } else {
      stop = /^calc\(\S+\)$/g.test(str);
    }
    return stop;
  }
  return true;
}
/**
 * @param {string} color
 * @param {string} [stop]
 * @return {boolean}
 */
module.exports = function isColorStop(color, stop) {
  return colord(color).isValid() && isStop(stop);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018161);
})()
//miniprogram-npm-outsideDeps=["postcss-value-parser","cssnano-utils","colord","colord/plugins/names"]
//# sourceMappingURL=index.js.map