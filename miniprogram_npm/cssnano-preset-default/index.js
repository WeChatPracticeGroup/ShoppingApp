module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975016835, function(require, module, exports) {

/**
 * @author Ben Briggs
 * @license MIT
 * @module cssnano:preset:default
 * @overview
 *
 * This default preset for cssnano only includes transforms that make no
 * assumptions about your CSS other than what is passed in. In previous
 * iterations of cssnano, assumptions were made about your CSS which caused
 * output to look different in certain use cases, but not others. These
 * transforms have been moved from the defaults to other presets, to make
 * this preset require only minimal configuration.
 */

const cssDeclarationSorter = require('css-declaration-sorter');
const postcssDiscardComments = require('postcss-discard-comments');
const postcssReduceInitial = require('postcss-reduce-initial');
const postcssMinifyGradients = require('postcss-minify-gradients');
const postcssSvgo = require('postcss-svgo');
const postcssReduceTransforms = require('postcss-reduce-transforms');
const postcssConvertValues = require('postcss-convert-values');
const postcssCalc = require('postcss-calc');
const postcssColormin = require('postcss-colormin');
const postcssOrderedValues = require('postcss-ordered-values');
const postcssMinifySelectors = require('postcss-minify-selectors');
const postcssMinifyParams = require('postcss-minify-params');
const postcssNormalizeCharset = require('postcss-normalize-charset');
const postcssMinifyFontValues = require('postcss-minify-font-values');
const postcssNormalizeUrl = require('postcss-normalize-url');
const postcssMergeLonghand = require('postcss-merge-longhand');
const postcssDiscardDuplicates = require('postcss-discard-duplicates');
const postcssDiscardOverridden = require('postcss-discard-overridden');
const postcssNormalizeRepeatStyle = require('postcss-normalize-repeat-style');
const postcssMergeRules = require('postcss-merge-rules');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssUniqueSelectors = require('postcss-unique-selectors');
const postcssNormalizeString = require('postcss-normalize-string');
const postcssNormalizePositions = require('postcss-normalize-positions');
const postcssNormalizeWhitespace = require('postcss-normalize-whitespace');
const postcssNormalizeUnicode = require('postcss-normalize-unicode');
const postcssNormalizeDisplayValues = require('postcss-normalize-display-values');
const postcssNormalizeTimingFunctions = require('postcss-normalize-timing-functions');
const { rawCache } = require('cssnano-utils');

/** @typedef {{
discardComments?: false | import('postcss-discard-comments').Options & { exclude?: true},
reduceInitial?:  false | { exclude?: true}
minifyGradients?:  false | { exclude?: true}
svgo?: false | import('postcss-svgo').Options & { exclude?: true},
reduceTransforms?:  false | { exclude?: true}
convertValues?: false | import('postcss-convert-values').Options & { exclude?: true},
calc?: false | import('postcss-calc').PostCssCalcOptions & { exclude?: true},
colormin?: false | Record<string, any> & { exclude?: true},
orderedValues?: false | { exclude?: true},
minifySelectors?: false | { exclude?: true},
minifyParams?: false | { exclude?: true},
normalizeCharset?: false | import('postcss-normalize-charset').Options & { exclude?: true},
minifyFontValues?: false | import('postcss-minify-font-values').Options & { exclude?: true},
normalizeUrl?: false | import('postcss-normalize-url').Options & { exclude?: true},
mergeLonghand?: false | { exclude?: true},
discardDuplicates?: false | { exclude?: true},
discardOverridden?: false | { exclude?: true},
normalizeRepeatStyle?: false | { exclude?: true},
mergeRules?: false | { exclude?: true},
discardEmpty?: false | { exclude?: true},
uniqueSelectors?: false | { exclude?: true},
normalizeString?: false | import('postcss-normalize-string').Options & { exclude?: true},
normalizePositions?: false | { exclude?: true},
normalizeWhitespace?: false| { exclude?: true},
normalizeUnicode?: false | { exclude?: true},
normalizeDisplayValues?: false | { exclude?: true},
normalizeTimingFunctions?: false | { exclude?: true},
rawCache?: false | { exclude?: true}}} Options */

const defaultOpts = {
  convertValues: {
    length: false,
  },
  normalizeCharset: {
    add: false,
  },
  cssDeclarationSorter: {
    keepOverrides: true,
  },
};

/**
 * @param {Options} opts
 * @return {{plugins: [import('postcss').PluginCreator<any>, boolean | Record<string, any> | undefined][]}}
 */
function defaultPreset(opts = {}) {
  const options = Object.assign({}, defaultOpts, opts);

  /** @type {[import('postcss').PluginCreator<any>, boolean | Record<string, any> | undefined][]} **/
  const plugins = [
    [postcssDiscardComments, options.discardComments],
    [postcssMinifyGradients, options.minifyGradients],
    [postcssReduceInitial, options.reduceInitial],
    [postcssSvgo, options.svgo],
    [postcssNormalizeDisplayValues, options.normalizeDisplayValues],
    [postcssReduceTransforms, options.reduceTransforms],
    [postcssColormin, options.colormin],
    [postcssNormalizeTimingFunctions, options.normalizeTimingFunctions],
    [postcssCalc, options.calc],
    [postcssConvertValues, options.convertValues],
    [postcssOrderedValues, options.orderedValues],
    [postcssMinifySelectors, options.minifySelectors],
    [postcssMinifyParams, options.minifyParams],
    [postcssNormalizeCharset, options.normalizeCharset],
    [postcssDiscardOverridden, options.discardOverridden],
    [postcssNormalizeString, options.normalizeString],
    [postcssNormalizeUnicode, options.normalizeUnicode],
    [postcssMinifyFontValues, options.minifyFontValues],
    [postcssNormalizeUrl, options.normalizeUrl],
    [postcssNormalizeRepeatStyle, options.normalizeRepeatStyle],
    [postcssNormalizePositions, options.normalizePositions],
    [postcssNormalizeWhitespace, options.normalizeWhitespace],
    [postcssMergeLonghand, options.mergeLonghand],
    [postcssDiscardDuplicates, options.discardDuplicates],
    [postcssMergeRules, options.mergeRules],
    [postcssDiscardEmpty, options.discardEmpty],
    [postcssUniqueSelectors, options.uniqueSelectors],
    [cssDeclarationSorter, options.cssDeclarationSorter],
    [rawCache, options.rawCache],
  ];

  return { plugins };
}

module.exports = defaultPreset;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975016835);
})()
//miniprogram-npm-outsideDeps=["css-declaration-sorter","postcss-discard-comments","postcss-reduce-initial","postcss-minify-gradients","postcss-svgo","postcss-reduce-transforms","postcss-convert-values","postcss-calc","postcss-colormin","postcss-ordered-values","postcss-minify-selectors","postcss-minify-params","postcss-normalize-charset","postcss-minify-font-values","postcss-normalize-url","postcss-merge-longhand","postcss-discard-duplicates","postcss-discard-overridden","postcss-normalize-repeat-style","postcss-merge-rules","postcss-discard-empty","postcss-unique-selectors","postcss-normalize-string","postcss-normalize-positions","postcss-normalize-whitespace","postcss-normalize-unicode","postcss-normalize-display-values","postcss-normalize-timing-functions","cssnano-utils"]
//# sourceMappingURL=index.js.map