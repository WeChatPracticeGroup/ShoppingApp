module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018154, function(require, module, exports) {

const browserslist = require('browserslist');
const { sameParent } = require('cssnano-utils');
const {
  ensureCompatibility,
  sameVendor,
  noVendor,
} = require('./lib/ensureCompatibility');

/**
 * @param {import('postcss').Declaration} a
 * @param {import('postcss').Declaration} b
 * @return {boolean}
 */
function declarationIsEqual(a, b) {
  return (
    a.important === b.important && a.prop === b.prop && a.value === b.value
  );
}

/**
 * @param {import('postcss').Declaration[]} array
 * @param {import('postcss').Declaration} decl
 * @return {number}
 */
function indexOfDeclaration(array, decl) {
  return array.findIndex((d) => declarationIsEqual(d, decl));
}

/**
 * Returns filtered array of matched or unmatched declarations
 * @param {import('postcss').Declaration[]} a
 * @param {import('postcss').Declaration[]} b
 * @param {boolean} [not=false]
 * @return {import('postcss').Declaration[]}
 */
function intersect(a, b, not) {
  return a.filter((c) => {
    const index = indexOfDeclaration(b, c) !== -1;
    return not ? !index : index;
  });
}

/**
 * @param {import('postcss').Declaration[]} a
 * @param {import('postcss').Declaration[]} b
 * @return {boolean}
 */
function sameDeclarationsAndOrder(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((d, index) => declarationIsEqual(d, b[index]));
}

/**
 * @param {import('postcss').Rule} ruleA
 * @param {import('postcss').Rule} ruleB
 * @param {string[]=} browsers
 * @param {Map<string, boolean>=} compatibilityCache
 * @return {boolean}
 */
function canMerge(ruleA, ruleB, browsers, compatibilityCache) {
  const a = ruleA.selectors;
  const b = ruleB.selectors;

  const selectors = a.concat(b);

  if (!ensureCompatibility(selectors, browsers, compatibilityCache)) {
    return false;
  }

  const parent = sameParent(
    /** @type {any} */ (ruleA),
    /** @type {any} */ (ruleB)
  );
  if (
    parent &&
    ruleA.parent &&
    ruleA.parent.type === 'atrule' &&
    /** @type {import('postcss').AtRule} */ (ruleA.parent).name.includes(
      'keyframes'
    )
  ) {
    return false;
  }
  return parent && (selectors.every(noVendor) || sameVendor(a, b));
}

/**
 * @param {import('postcss').ChildNode} node
 * @return {node is import('postcss').Declaration}
 */
function isDeclaration(node) {
  return node.type === 'decl';
}
/**
 * @param {import('postcss').Rule} rule
 * @return {import('postcss').Declaration[]}
 */
function getDecls(rule) {
  return rule.nodes.filter(isDeclaration);
}

/** @type {(...rules: import('postcss').Rule[]) => string} */
const joinSelectors = (...rules) => rules.map((s) => s.selector).join();

/**
 * @param {...import('postcss').Rule} rules
 * @return {number}
 */
function ruleLength(...rules) {
  return rules.map((r) => (r.nodes.length ? String(r) : '')).join('').length;
}

/**
 * @param {string} prop
 * @return {{prefix: string?, base:string?, rest:string[]}}
 */
function splitProp(prop) {
  // Treat vendor prefixed properties as if they were unprefixed;
  // moving them when combined with non-prefixed properties can
  // cause issues. e.g. moving -webkit-background-clip when there
  // is a background shorthand definition.

  const parts = prop.split('-');
  if (prop[0] !== '-') {
    return {
      prefix: '',
      base: parts[0],
      rest: parts.slice(1),
    };
  }
  // Don't split css variables
  if (prop[1] === '-') {
    return {
      prefix: null,
      base: null,
      rest: [prop],
    };
  }
  // Found prefix
  return {
    prefix: parts[1],
    base: parts[2],
    rest: parts.slice(3),
  };
}

/**
 * @param {string} propA
 * @param {string} propB
 * @return {boolean}
 */
function isConflictingProp(propA, propB) {
  if (propA === propB) {
    // Same specificity
    return true;
  }
  const a = splitProp(propA);
  const b = splitProp(propB);
  // Don't resort css variables
  if (!a.base && !b.base) {
    return true;
  }

  // Different base and none is `place`;
  if (a.base !== b.base && a.base !== 'place' && b.base !== 'place') {
    return false;
  }

  // Conflict if rest-count mismatches
  if (a.rest.length !== b.rest.length) {
    return true;
  }

  /* Do not merge conflicting border properties */
  if (a.base === 'border') {
    const allRestProps = new Set([...a.rest, ...b.rest]);
    if (
      allRestProps.has('image') ||
      allRestProps.has('width') ||
      allRestProps.has('color') ||
      allRestProps.has('style')
    ) {
      return true;
    }
  }
  // Conflict if rest parameters are equal (same but unprefixed)
  return a.rest.every((s, index) => b.rest[index] === s);
}

/**
 * @param {import('postcss').Rule} first
 * @param {import('postcss').Rule} second
 * @return {boolean} merged
 */
function mergeParents(first, second) {
  // Null check for detached rules
  if (!first.parent || !second.parent) {
    return false;
  }

  // Check if parents share node
  if (first.parent === second.parent) {
    return false;
  }

  // sameParent() already called by canMerge()

  second.remove();
  first.parent.append(second);
  return true;
}

/**
 * @param {import('postcss').Rule} first
 * @param {import('postcss').Rule} second
 * @return {import('postcss').Rule} mergedRule
 */
function partialMerge(first, second) {
  let intersection = intersect(getDecls(first), getDecls(second));
  if (intersection.length === 0) {
    return second;
  }
  let nextRule = second.next();
  if (!nextRule) {
    // Grab next cousin
    /** @type {any} */
    const parentSibling =
      /** @type {import('postcss').Container<import('postcss').ChildNode>} */ (
        second.parent
      ).next();
    nextRule = parentSibling && parentSibling.nodes && parentSibling.nodes[0];
  }
  if (nextRule && nextRule.type === 'rule' && canMerge(second, nextRule)) {
    let nextIntersection = intersect(getDecls(second), getDecls(nextRule));
    if (nextIntersection.length > intersection.length) {
      mergeParents(second, nextRule);
      first = second;
      second = nextRule;
      intersection = nextIntersection;
    }
  }

  const firstDecls = getDecls(first);
  // Filter out intersections with later conflicts in First
  intersection = intersection.filter((decl, intersectIndex) => {
    const indexOfDecl = indexOfDeclaration(firstDecls, decl);
    const nextConflictInFirst = firstDecls
      .slice(indexOfDecl + 1)
      .filter((d) => isConflictingProp(d.prop, decl.prop));
    if (nextConflictInFirst.length === 0) {
      return true;
    }
    const nextConflictInIntersection = intersection
      .slice(intersectIndex + 1)
      .filter((d) => isConflictingProp(d.prop, decl.prop));
    if (nextConflictInFirst.length !== nextConflictInIntersection.length) {
      return false;
    }
    return nextConflictInFirst.every((d, index) =>
      declarationIsEqual(d, nextConflictInIntersection[index])
    );
  });

  // Filter out intersections with previous conflicts in Second
  const secondDecls = getDecls(second);
  intersection = intersection.filter((decl) => {
    const nextConflictIndex = secondDecls.findIndex((d) =>
      isConflictingProp(d.prop, decl.prop)
    );
    if (nextConflictIndex === -1) {
      return false;
    }
    if (!declarationIsEqual(secondDecls[nextConflictIndex], decl)) {
      return false;
    }
    if (
      decl.prop.toLowerCase() !== 'direction' &&
      decl.prop.toLowerCase() !== 'unicode-bidi' &&
      secondDecls.some(
        (declaration) => declaration.prop.toLowerCase() === 'all'
      )
    ) {
      return false;
    }
    secondDecls.splice(nextConflictIndex, 1);
    return true;
  });

  if (intersection.length === 0) {
    // Nothing to merge
    return second;
  }

  const receivingBlock = second.clone();
  receivingBlock.selector = joinSelectors(first, second);
  receivingBlock.nodes = [];

  /** @type {import('postcss').Container<import('postcss').ChildNode>} */ (
    second.parent
  ).insertBefore(second, receivingBlock);

  const firstClone = first.clone();
  const secondClone = second.clone();

  /**
   * @param {function(import('postcss').Declaration):void} callback
   * @this {import('postcss').Rule}
   * @return {function(import('postcss').Declaration)}
   */
  function moveDecl(callback) {
    return (decl) => {
      if (indexOfDeclaration(intersection, decl) !== -1) {
        callback.call(this, decl);
      }
    };
  }
  firstClone.walkDecls(
    moveDecl((decl) => {
      decl.remove();
      receivingBlock.append(decl);
    })
  );
  secondClone.walkDecls(moveDecl((decl) => decl.remove()));
  const merged = ruleLength(firstClone, receivingBlock, secondClone);
  const original = ruleLength(first, second);
  if (merged < original) {
    first.replaceWith(firstClone);
    second.replaceWith(secondClone);
    [firstClone, receivingBlock, secondClone].forEach((r) => {
      if (r.nodes.length === 0) {
        r.remove();
      }
    });
    if (!secondClone.parent) {
      return receivingBlock;
    }
    return secondClone;
  } else {
    receivingBlock.remove();
    return second;
  }
}

/**
 * @param {string[]} browsers
 * @param {Map<string, boolean>} compatibilityCache
 * @return {function(import('postcss').Rule)}
 */
function selectorMerger(browsers, compatibilityCache) {
  /** @type {import('postcss').Rule | null} */
  let cache = null;
  return function (rule) {
    // Prime the cache with the first rule, or alternately ensure that it is
    // safe to merge both declarations before continuing
    if (!cache || !canMerge(rule, cache, browsers, compatibilityCache)) {
      cache = rule;
      return;
    }
    // Ensure that we don't deduplicate the same rule; this is sometimes
    // caused by a partial merge
    if (cache === rule) {
      cache = rule;
      return;
    }

    // Parents merge: check if the rules have same parents, but not same parent nodes
    mergeParents(cache, rule);

    // Merge when declarations are exactly equal
    // e.g. h1 { color: red } h2 { color: red }
    if (sameDeclarationsAndOrder(getDecls(rule), getDecls(cache))) {
      rule.selector = joinSelectors(cache, rule);
      cache.remove();
      cache = rule;
      return;
    }
    // Merge when both selectors are exactly equal
    // e.g. a { color: blue } a { font-weight: bold }
    if (cache.selector === rule.selector) {
      const cached = getDecls(cache);
      rule.walk((node) => {
        if (node.type === 'decl' && indexOfDeclaration(cached, node) !== -1) {
          node.remove();
          return;
        }
        /** @type {import('postcss').Rule} */ (cache).append(node);
      });
      rule.remove();
      return;
    }
    // Partial merge: check if the rule contains a subset of the last; if
    // so create a joined selector with the subset, if smaller.
    cache = partialMerge(cache, rule);
  };
}
/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-merge-rules',

    prepare(result) {
      /** @type {typeof result.opts & browserslist.Options} */
      const resultOpts = result.opts || {};
      const browsers = browserslist(null, {
        stats: resultOpts.stats,
        path: __dirname,
        env: resultOpts.env,
      });

      const compatibilityCache = new Map();
      return {
        OnceExit(css) {
          css.walkRules(selectorMerger(browsers, compatibilityCache));
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./lib/ensureCompatibility":1679975018155}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018155, function(require, module, exports) {

const { isSupported } = require('caniuse-api');
const selectorParser = require('postcss-selector-parser');

const simpleSelectorRe = /^#?[-._a-z0-9 ]+$/i;

const cssSel2 = 'css-sel2';
const cssSel3 = 'css-sel3';
const cssGencontent = 'css-gencontent';
const cssFirstLetter = 'css-first-letter';
const cssFirstLine = 'css-first-line';
const cssInOutOfRange = 'css-in-out-of-range';
const formValidation = 'form-validation';

const vendorPrefix =
  /-(ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)-/;

const level2Sel = new Set(['=', '~=', '|=']);
const level3Sel = new Set(['^=', '$=', '*=']);

/**
 * @param {string} selector
 * @return {RegExpMatchArray | null}
 */
function filterPrefixes(selector) {
  return selector.match(vendorPrefix);
}

/**
 * Internet Explorer use :-ms-input-placeholder.
 * Microsoft Edge use ::-ms-input-placeholder.
 *
 * @type {(selector: string) => number}
 */
const findMsInputPlaceholder = (selector) =>
  ~selector.search(/-ms-input-placeholder/i);

/**
 * @param {string[]} selectorsA
 * @param {string[]} selectorsB
 * @return {boolean}
 */
function sameVendor(selectorsA, selectorsB) {
  /** @type {(selectors: string[]) => string} */
  let same = (selectors) => selectors.map(filterPrefixes).join();
  /** @type {(selectors: string[]) => string | undefined} */
  let findMsVendor = (selectors) => selectors.find(findMsInputPlaceholder);
  return (
    same(selectorsA) === same(selectorsB) &&
    !(findMsVendor(selectorsA) && findMsVendor(selectorsB))
  );
}

/**
 * @param {string} selector
 * @return {boolean}
 */
function noVendor(selector) {
  return !vendorPrefix.test(selector);
}

const pseudoElements = {
  ':active': cssSel2,
  ':after': cssGencontent,
  ':any-link': 'css-any-link',
  ':before': cssGencontent,
  ':checked': cssSel3,
  ':default': 'css-default-pseudo',
  ':dir': 'css-dir-pseudo',
  ':disabled': cssSel3,
  ':empty': cssSel3,
  ':enabled': cssSel3,
  ':first-child': cssSel2,
  ':first-letter': cssFirstLetter,
  ':first-line': cssFirstLine,
  ':first-of-type': cssSel3,
  ':focus': cssSel2,
  ':focus-within': 'css-focus-within',
  ':focus-visible': 'css-focus-visible',
  ':has': 'css-has',
  ':hover': cssSel2,
  ':in-range': cssInOutOfRange,
  ':indeterminate': 'css-indeterminate-pseudo',
  ':invalid': formValidation,
  ':is': 'css-matches-pseudo',
  ':lang': cssSel2,
  ':last-child': cssSel3,
  ':last-of-type': cssSel3,
  ':link': cssSel2,
  ':matches': 'css-matches-pseudo',
  ':not': cssSel3,
  ':nth-child': cssSel3,
  ':nth-last-child': cssSel3,
  ':nth-last-of-type': cssSel3,
  ':nth-of-type': cssSel3,
  ':only-child': cssSel3,
  ':only-of-type': cssSel3,
  ':optional': 'css-optional-pseudo',
  ':out-of-range': cssInOutOfRange,
  ':placeholder-shown': 'css-placeholder-shown',
  ':required': formValidation,
  ':root': cssSel3,
  ':target': cssSel3,
  '::after': cssGencontent,
  '::backdrop': 'dialog',
  '::before': cssGencontent,
  '::first-letter': cssFirstLetter,
  '::first-line': cssFirstLine,
  '::marker': 'css-marker-pseudo',
  '::placeholder': 'css-placeholder',
  '::selection': 'css-selection',
  ':valid': formValidation,
  ':visited': cssSel2,
};

/**
 * @param {string} selector
 * @return {boolean}
 */
function isCssMixin(selector) {
  return selector[selector.length - 1] === ':';
}

/**
 * @param {string} selector
 * @return {boolean}
 */
function isHostPseudoClass(selector) {
  return selector.includes(':host');
}

const isSupportedCache = new Map();

// Move to util in future
/**
 * @param {string} feature
 * @param {string[] | undefined} browsers
 */
function isSupportedCached(feature, browsers) {
  const key = JSON.stringify({ feature, browsers });
  let result = isSupportedCache.get(key);

  if (!result) {
    result = isSupported(feature, /** @type {string[]} */ (browsers));
    isSupportedCache.set(key, result);
  }

  return result;
}

/**
 * @param {string[]} selectors
 * @param{string[]=} browsers
 * @param{Map<string,boolean>=} compatibilityCache
 * @return {boolean}
 */
function ensureCompatibility(selectors, browsers, compatibilityCache) {
  // Should not merge mixins
  if (selectors.some(isCssMixin)) {
    return false;
  }

  // Should not merge :host selector https://github.com/angular/angular-cli/issues/18672
  if (selectors.some(isHostPseudoClass)) {
    return false;
  }
  return selectors.every((selector) => {
    if (simpleSelectorRe.test(selector)) {
      return true;
    }
    if (compatibilityCache && compatibilityCache.has(selector)) {
      return compatibilityCache.get(selector);
    }
    let compatible = true;
    selectorParser((ast) => {
      ast.walk((node) => {
        const { type, value } = node;
        if (type === 'pseudo') {
          const entry =
            pseudoElements[/** @type {keyof pseudoElements} */ (value)];
          if (!entry && noVendor(value)) {
            compatible = false;
          }
          if (entry && compatible) {
            compatible = isSupportedCached(entry, browsers);
          }
        }
        if (type === 'combinator') {
          if (value.includes('~')) {
            compatible = isSupportedCached(cssSel3, browsers);
          }
          if (value.includes('>') || value.includes('+')) {
            compatible = isSupportedCached(cssSel2, browsers);
          }
        }
        if (type === 'attribute' && node.attribute) {
          // [foo]
          if (!node.operator) {
            compatible = isSupportedCached(cssSel2, browsers);
          }
          if (value) {
            // [foo="bar"], [foo~="bar"], [foo|="bar"]
            if (level2Sel.has(/** @type {string} */ (node.operator))) {
              compatible = isSupportedCached(cssSel2, browsers);
            }
            // [foo^="bar"], [foo$="bar"], [foo*="bar"]
            if (level3Sel.has(/** @type {string} */ (node.operator))) {
              compatible = isSupportedCached(cssSel3, browsers);
            }
          }

          // [foo="bar" i]
          if (node.insensitive) {
            compatible = isSupportedCached('css-case-insensitive', browsers);
          }
        }
        if (!compatible) {
          // If this node was not compatible,
          // break out early from walking the rest
          return false;
        }
      });
    }).processSync(selector);
    if (compatibilityCache) {
      compatibilityCache.set(selector, compatible);
    }
    return compatible;
  });
}

module.exports = { sameVendor, noVendor, pseudoElements, ensureCompatibility };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018154);
})()
//miniprogram-npm-outsideDeps=["browserslist","cssnano-utils","caniuse-api","postcss-selector-parser"]
//# sourceMappingURL=index.js.map