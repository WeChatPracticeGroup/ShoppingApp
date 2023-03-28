module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018129, function(require, module, exports) {

const processors = require('./lib/decl');
/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-merge-longhand',

    OnceExit(css) {
      css.walkRules((rule) => {
        processors.forEach((p) => {
          p.explode(rule);
          p.merge(rule);
        });
      });
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./lib/decl":1679975018130}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018130, function(require, module, exports) {

const borders = require('./borders');
const columns = require('./columns');
const margin = require('./margin');
const padding = require('./padding');

module.exports = [borders, columns, margin, padding];

}, function(modId) { var map = {"./borders":1679975018131,"./columns":1679975018149,"./margin":1679975018150,"./padding":1679975018153}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018131, function(require, module, exports) {

const { list } = require('postcss');
const stylehacks = require('stylehacks');
const insertCloned = require('../insertCloned.js');
const parseTrbl = require('../parseTrbl.js');
const hasAllProps = require('../hasAllProps.js');
const getDecls = require('../getDecls.js');
const getRules = require('../getRules.js');
const getValue = require('../getValue.js');
const mergeRules = require('../mergeRules.js');
const minifyTrbl = require('../minifyTrbl.js');
const minifyWsc = require('../minifyWsc.js');
const canMerge = require('../canMerge.js');
const trbl = require('../trbl.js');
const isCustomProp = require('../isCustomProp.js');
const canExplode = require('../canExplode.js');
const getLastNode = require('../getLastNode.js');
const parseWsc = require('../parseWsc.js');
const { isValidWsc } = require('../validateWsc.js');

const wsc = ['width', 'style', 'color'];
const defaults = ['medium', 'none', 'currentcolor'];
const colorMightRequireFallback =
  /(hsla|rgba|color|hwb|lab|lch|oklab|oklch)\(/i;

/**
 * @param {...string} parts
 * @return {string}
 */
function borderProperty(...parts) {
  return `border-${parts.join('-')}`;
}
/**
 * @param {string} value
 * @return {string}
 */
function mapBorderProperty(value) {
  return borderProperty(value);
}

const directions = trbl.map(mapBorderProperty);
const properties = wsc.map(mapBorderProperty);
/** @type {string[]} */
const directionalProperties = directions.reduce(
  (prev, curr) => prev.concat(wsc.map((prop) => `${curr}-${prop}`)),
  /** @type {string[]} */ ([])
);

const precedence = [
  ['border'],
  directions.concat(properties),
  directionalProperties,
];

const allProperties = precedence.reduce((a, b) => a.concat(b));

/**
 * @param {string} prop
 * @return {number | undefined}
 */
function getLevel(prop) {
  for (let i = 0; i < precedence.length; i++) {
    if (precedence[i].includes(prop.toLowerCase())) {
      return i;
    }
  }
}

/** @type {(value: string) => boolean} */
const isValueCustomProp = (value) =>
  value !== undefined && value.search(/var\s*\(\s*--/i) !== -1;

/**
 * @param {string[]} values
 * @return {boolean}
 */
function canMergeValues(values) {
  return !values.some(isValueCustomProp);
}

/**
 * @param {import('postcss').Declaration} decl
 * @return {string}
 */
function getColorValue(decl) {
  if (decl.prop.substr(-5) === 'color') {
    return decl.value;
  }

  return parseWsc(decl.value)[2] || defaults[2];
}

/**
 * @param {[string, string, string]} values
 * @param {[string, string, string]} nextValues
 * @return {string[]}
 */
function diffingProps(values, nextValues) {
  return wsc.reduce((prev, curr, i) => {
    if (values[i] === nextValues[i]) {
      return prev;
    }

    return [...prev, curr];
  }, /** @type {string[]} */ ([]));
}

/**
 * @param {{values: [string, string, string], nextValues: [string, string, string], decl: import('postcss').Declaration, nextDecl: import('postcss').Declaration, index: number}} arg
 * @return {void}
 */
function mergeRedundant({ values, nextValues, decl, nextDecl, index }) {
  if (!canMerge([decl, nextDecl])) {
    return;
  }

  if (stylehacks.detect(decl) || stylehacks.detect(nextDecl)) {
    return;
  }

  const diff = diffingProps(values, nextValues);

  if (diff.length !== 1) {
    return;
  }

  const prop = /** @type {string} */ (diff.pop());
  const position = wsc.indexOf(prop);

  const prop1 = `${nextDecl.prop}-${prop}`;
  const prop2 = `border-${prop}`;

  let props = parseTrbl(values[position]);

  props[index] = nextValues[position];

  const borderValue2 = values.filter((e, i) => i !== position).join(' ');
  const propValue2 = minifyTrbl(props);

  const origLength = (minifyWsc(decl.value) + nextDecl.prop + nextDecl.value)
    .length;
  const newLength1 =
    decl.value.length + prop1.length + minifyWsc(nextValues[position]).length;
  const newLength2 = borderValue2.length + prop2.length + propValue2.length;

  if (newLength1 < newLength2 && newLength1 < origLength) {
    nextDecl.prop = prop1;
    nextDecl.value = nextValues[position];
  }

  if (newLength2 < newLength1 && newLength2 < origLength) {
    decl.value = borderValue2;
    nextDecl.prop = prop2;
    nextDecl.value = propValue2;
  }
}

/**
 * @param {string | string[]} mapped
 * @return {boolean}
 */
function isCloseEnough(mapped) {
  return (
    (mapped[0] === mapped[1] && mapped[1] === mapped[2]) ||
    (mapped[1] === mapped[2] && mapped[2] === mapped[3]) ||
    (mapped[2] === mapped[3] && mapped[3] === mapped[0]) ||
    (mapped[3] === mapped[0] && mapped[0] === mapped[1])
  );
}

/**
 * @param {string[]} mapped
 * @return {string[]}
 */
function getDistinctShorthands(mapped) {
  return [...new Set(mapped)];
}
/**
 * @param {import('postcss').Rule} rule
 * @return {void}
 */
function explode(rule) {
  rule.walkDecls(/^border/i, (decl) => {
    if (!canExplode(decl, false)) {
      return;
    }

    if (stylehacks.detect(decl)) {
      return;
    }

    const prop = decl.prop.toLowerCase();

    // border -> border-trbl
    if (prop === 'border') {
      if (isValidWsc(parseWsc(decl.value))) {
        directions.forEach((direction) => {
          insertCloned(
            /** @type {import('postcss').Rule} */ (decl.parent),
            decl,
            { prop: direction }
          );
        });

        decl.remove();
      }
    }

    // border-trbl -> border-trbl-wsc
    if (directions.some((direction) => prop === direction)) {
      let values = parseWsc(decl.value);

      if (isValidWsc(values)) {
        wsc.forEach((d, i) => {
          insertCloned(
            /** @type {import('postcss').Rule} */ (decl.parent),
            decl,
            {
              prop: `${prop}-${d}`,
              value: values[i] || defaults[i],
            }
          );
        });

        decl.remove();
      }
    }

    // border-wsc -> border-trbl-wsc
    wsc.some((style) => {
      if (prop !== borderProperty(style)) {
        return false;
      }

      if (isCustomProp(decl)) {
        decl.prop = decl.prop.toLowerCase();
        return false;
      }
      parseTrbl(decl.value).forEach((value, i) => {
        insertCloned(
          /** @type {import('postcss').Rule} */ (decl.parent),
          decl,
          {
            prop: borderProperty(trbl[i], style),
            value,
          }
        );
      });

      return decl.remove();
    });
  });
}

/**
 * @param {import('postcss').Rule} rule
 * @return {void}
 */
function merge(rule) {
  // border-trbl-wsc -> border-trbl
  trbl.forEach((direction) => {
    const prop = borderProperty(direction);

    mergeRules(
      rule,
      wsc.map((style) => borderProperty(direction, style)),
      (rules, lastNode) => {
        if (canMerge(rules, false) && !rules.some(stylehacks.detect)) {
          insertCloned(
            /** @type {import('postcss').Rule} */ (lastNode.parent),
            lastNode,
            {
              prop,
              value: rules.map(getValue).join(' '),
            }
          );
          for (const node of rules) {
            node.remove();
          }

          return true;
        }
        return false;
      }
    );
  });

  // border-trbl-wsc -> border-wsc
  wsc.forEach((style) => {
    const prop = borderProperty(style);

    mergeRules(
      rule,
      trbl.map((direction) => borderProperty(direction, style)),
      (rules, lastNode) => {
        if (canMerge(rules) && !rules.some(stylehacks.detect)) {
          insertCloned(
            /** @type {import('postcss').Rule} */ (lastNode.parent),
            lastNode,
            {
              prop,
              value: minifyTrbl(rules.map(getValue).join(' ')),
            }
          );

          for (const node of rules) {
            node.remove();
          }

          return true;
        }
        return false;
      }
    );
  });

  // border-trbl -> border-wsc
  mergeRules(rule, directions, (rules, lastNode) => {
    if (rules.some(stylehacks.detect)) {
      return false;
    }

    const values = rules.map(({ value }) => value);

    if (!canMergeValues(values)) {
      return false;
    }

    const parsed = values.map((value) => parseWsc(value));

    if (!parsed.every(isValidWsc)) {
      return false;
    }

    wsc.forEach((d, i) => {
      const value = parsed.map((v) => v[i] || defaults[i]);

      if (canMergeValues(value)) {
        insertCloned(
          /** @type {import('postcss').Rule} */ (lastNode.parent),
          lastNode,
          {
            prop: borderProperty(d),
            value: minifyTrbl(
              /** @type {[string, string, string, string]} */ (value)
            ),
          }
        );
      } else {
        insertCloned(
          /** @type {import('postcss').Rule} */ (lastNode.parent),
          lastNode
        );
      }
    });

    for (const node of rules) {
      node.remove();
    }

    return true;
  });

  // border-wsc -> border
  // border-wsc -> border + border-color
  // border-wsc -> border + border-dir
  mergeRules(rule, properties, (rules, lastNode) => {
    if (rules.some(stylehacks.detect)) {
      return false;
    }

    const values = rules.map((node) => parseTrbl(node.value));
    const mapped = [0, 1, 2, 3].map((i) =>
      [values[0][i], values[1][i], values[2][i]].join(' ')
    );

    if (!canMergeValues(mapped)) {
      return false;
    }

    const [width, style, color] = rules;
    const reduced = getDistinctShorthands(mapped);

    if (isCloseEnough(mapped) && canMerge(rules, false)) {
      const first =
        mapped.indexOf(reduced[0]) !== mapped.lastIndexOf(reduced[0]);

      const border = insertCloned(
        /** @type {import('postcss').Rule} */ (lastNode.parent),
        lastNode,
        {
          prop: 'border',
          value: first ? reduced[0] : reduced[1],
        }
      );

      if (reduced[1]) {
        const value = first ? reduced[1] : reduced[0];
        const prop = borderProperty(trbl[mapped.indexOf(value)]);

        rule.insertAfter(
          border,
          Object.assign(lastNode.clone(), {
            prop,
            value,
          })
        );
      }
      for (const node of rules) {
        node.remove();
      }

      return true;
    } else if (reduced.length === 1) {
      rule.insertBefore(
        color,
        Object.assign(lastNode.clone(), {
          prop: 'border',
          value: [width, style].map(getValue).join(' '),
        })
      );
      rules
        .filter((node) => node.prop.toLowerCase() !== properties[2])
        .forEach((node) => node.remove());

      return true;
    }
    return false;
  });

  // border-wsc -> border + border-trbl
  mergeRules(rule, properties, (rules, lastNode) => {
    if (rules.some(stylehacks.detect)) {
      return false;
    }

    const values = rules.map((node) => parseTrbl(node.value));
    const mapped = [0, 1, 2, 3].map((i) =>
      [values[0][i], values[1][i], values[2][i]].join(' ')
    );
    const reduced = getDistinctShorthands(mapped);
    const none = 'medium none currentcolor';

    if (reduced.length > 1 && reduced.length < 4 && reduced.includes(none)) {
      const filtered = mapped.filter((p) => p !== none);
      const mostCommon = reduced.sort(
        (a, b) =>
          mapped.filter((v) => v === b).length -
          mapped.filter((v) => v === a).length
      )[0];
      const borderValue = reduced.length === 2 ? filtered[0] : mostCommon;

      rule.insertBefore(
        lastNode,
        Object.assign(lastNode.clone(), {
          prop: 'border',
          value: borderValue,
        })
      );

      directions.forEach((dir, i) => {
        if (mapped[i] !== borderValue) {
          rule.insertBefore(
            lastNode,
            Object.assign(lastNode.clone(), {
              prop: dir,
              value: mapped[i],
            })
          );
        }
      });

      for (const node of rules) {
        node.remove();
      }

      return true;
    }
    return false;
  });

  // border-trbl -> border
  // border-trbl -> border + border-trbl
  mergeRules(rule, directions, (rules, lastNode) => {
    if (rules.some(stylehacks.detect)) {
      return false;
    }

    const values = rules.map((node) => {
      const wscValue = parseWsc(node.value);

      if (!isValidWsc(wscValue)) {
        return node.value;
      }

      return wscValue.map((value, i) => value || defaults[i]).join(' ');
    });

    const reduced = getDistinctShorthands(values);

    if (isCloseEnough(values)) {
      const first =
        values.indexOf(reduced[0]) !== values.lastIndexOf(reduced[0]);

      rule.insertBefore(
        lastNode,
        Object.assign(lastNode.clone(), {
          prop: 'border',
          value: minifyWsc(first ? values[0] : values[1]),
        })
      );

      if (reduced[1]) {
        const value = first ? reduced[1] : reduced[0];
        const prop = directions[values.indexOf(value)];
        rule.insertBefore(
          lastNode,
          Object.assign(lastNode.clone(), {
            prop: prop,
            value: minifyWsc(value),
          })
        );
      }

      for (const node of rules) {
        node.remove();
      }

      return true;
    }
    return false;
  });

  // border-trbl-wsc + border-trbl (custom prop) -> border-trbl + border-trbl-wsc (custom prop)
  directions.forEach((direction) => {
    wsc.forEach((style, i) => {
      const prop = `${direction}-${style}`;

      mergeRules(rule, [direction, prop], (rules, lastNode) => {
        if (lastNode.prop !== direction) {
          return false;
        }

        const values = parseWsc(lastNode.value);

        if (!isValidWsc(values)) {
          return false;
        }

        const wscProp = rules.filter((r) => r !== lastNode)[0];

        if (!isValueCustomProp(values[i]) || isCustomProp(wscProp)) {
          return false;
        }

        const wscValue = values[i];

        values[i] = wscProp.value;

        if (canMerge(rules, false) && !rules.some(stylehacks.detect)) {
          insertCloned(
            /** @type {import('postcss').Rule} */ (lastNode.parent),
            lastNode,
            {
              prop,
              value: wscValue,
            }
          );
          lastNode.value = minifyWsc(/** @type {any} */ (values));

          wscProp.remove();

          return true;
        }
        return false;
      });
    });
  });

  // border-wsc + border (custom prop) -> border + border-wsc (custom prop)
  wsc.forEach((style, i) => {
    const prop = borderProperty(style);
    mergeRules(rule, ['border', prop], (rules, lastNode) => {
      if (lastNode.prop !== 'border') {
        return false;
      }

      const values = parseWsc(lastNode.value);

      if (!isValidWsc(values)) {
        return false;
      }

      const wscProp = rules.filter((r) => r !== lastNode)[0];

      if (!isValueCustomProp(values[i]) || isCustomProp(wscProp)) {
        return false;
      }

      const wscValue = values[i];

      values[i] = wscProp.value;

      if (canMerge(rules, false) && !rules.some(stylehacks.detect)) {
        insertCloned(
          /** @type {import('postcss').Rule} */ (lastNode.parent),
          lastNode,
          {
            prop,
            value: wscValue,
          }
        );
        lastNode.value = minifyWsc(/** @type {any} */ (values));
        wscProp.remove();

        return true;
      }
      return false;
    });
  });

  // optimize border-trbl
  let decls = getDecls(rule, directions);

  while (decls.length) {
    const lastNode = decls[decls.length - 1];

    wsc.forEach((d, i) => {
      const names = directions
        .filter((name) => name !== lastNode.prop)
        .map((name) => `${name}-${d}`);

      let nodes = rule.nodes.slice(0, rule.nodes.indexOf(lastNode));

      const border = getLastNode(nodes, 'border');

      if (border) {
        nodes = nodes.slice(nodes.indexOf(border));
      }

      const props = nodes.filter(
        (node) =>
          node.type === 'decl' &&
          names.includes(node.prop) &&
          node.important === lastNode.important
      );
      const rules = getRules(
        /** @type {import('postcss').Declaration[]} */ (props),
        names
      );

      if (hasAllProps(rules, ...names) && !rules.some(stylehacks.detect)) {
        const values = rules.map((node) => (node ? node.value : null));
        const filteredValues = values.filter(Boolean);
        const lastNodeValue = list.space(lastNode.value)[i];

        values[directions.indexOf(lastNode.prop)] = lastNodeValue;

        let value = minifyTrbl(values.join(' '));

        if (
          filteredValues[0] === filteredValues[1] &&
          filteredValues[1] === filteredValues[2]
        ) {
          value = /** @type {string} */ (filteredValues[0]);
        }

        let refNode = props[props.length - 1];

        if (value === lastNodeValue) {
          refNode = lastNode;
          let valueArray = list.space(lastNode.value);
          valueArray.splice(i, 1);
          lastNode.value = valueArray.join(' ');
        }

        insertCloned(
          /** @type {import('postcss').Rule} */ (refNode.parent),
          /** @type {import('postcss').Declaration} */ (refNode),
          {
            prop: borderProperty(d),
            value,
          }
        );

        decls = decls.filter((node) => !rules.includes(node));
        for (const node of rules) {
          node.remove();
        }
      }
    });

    decls = decls.filter((node) => node !== lastNode);
  }

  rule.walkDecls('border', (decl) => {
    const nextDecl = decl.next();

    if (!nextDecl || nextDecl.type !== 'decl') {
      return false;
    }

    const index = directions.indexOf(nextDecl.prop);

    if (index === -1) {
      return;
    }

    const values = parseWsc(decl.value);
    const nextValues = parseWsc(nextDecl.value);

    if (!isValidWsc(values) || !isValidWsc(nextValues)) {
      return;
    }

    const config = {
      values,
      nextValues,
      decl,
      nextDecl,
      index,
    };

    return mergeRedundant(config);
  });

  rule.walkDecls(/^border($|-(top|right|bottom|left)$)/i, (decl) => {
    let values = parseWsc(decl.value);

    if (!isValidWsc(values)) {
      return;
    }

    const position = directions.indexOf(decl.prop);
    let dirs = [...directions];

    dirs.splice(position, 1);
    wsc.forEach((d, i) => {
      const props = dirs.map((dir) => `${dir}-${d}`);

      mergeRules(rule, [decl.prop, ...props], (rules) => {
        if (!rules.includes(decl)) {
          return false;
        }

        const longhands = rules.filter((p) => p !== decl);

        if (
          longhands[0].value.toLowerCase() ===
            longhands[1].value.toLowerCase() &&
          longhands[1].value.toLowerCase() ===
            longhands[2].value.toLowerCase() &&
          values[i] !== undefined &&
          longhands[0].value.toLowerCase() === values[i].toLowerCase()
        ) {
          for (const node of longhands) {
            node.remove();
          }

          insertCloned(
            /** @type {import('postcss').Rule} */ (decl.parent),
            decl,
            {
              prop: borderProperty(d),
              value: values[i],
            }
          );

          /** @type {string|null} */ (values[i]) = null;
        }
        return false;
      });

      const newValue = values.join(' ');

      if (newValue) {
        decl.value = newValue;
      } else {
        decl.remove();
      }
    });
  });

  // clean-up values
  rule.walkDecls(/^border($|-(top|right|bottom|left)$)/i, (decl) => {
    decl.value = minifyWsc(decl.value);
  });

  // border-spacing-hv -> border-spacing
  rule.walkDecls(/^border-spacing$/i, (decl) => {
    const value = list.space(decl.value);

    // merge vertical and horizontal dups
    if (value.length > 1 && value[0] === value[1]) {
      decl.value = value.slice(1).join(' ');
    }
  });

  // clean-up rules
  decls = getDecls(rule, allProperties);

  while (decls.length) {
    const lastNode = decls[decls.length - 1];
    const lastPart = lastNode.prop.split('-').pop();

    // remove properties of lower precedence
    const lesser = decls.filter(
      (node) =>
        !stylehacks.detect(lastNode) &&
        !stylehacks.detect(node) &&
        !isCustomProp(lastNode) &&
        node !== lastNode &&
        node.important === lastNode.important &&
        /** @type {number} */ (getLevel(node.prop)) >
          /** @type {number} */ (getLevel(lastNode.prop)) &&
        (node.prop.toLowerCase().includes(lastNode.prop) ||
          node.prop.toLowerCase().endsWith(/** @type {string} */ (lastPart)))
    );

    for (const node of lesser) {
      node.remove();
    }
    decls = decls.filter((node) => !lesser.includes(node));

    // get duplicate properties
    let duplicates = decls.filter(
      (node) =>
        !stylehacks.detect(lastNode) &&
        !stylehacks.detect(node) &&
        node !== lastNode &&
        node.important === lastNode.important &&
        node.prop === lastNode.prop &&
        !(!isCustomProp(node) && isCustomProp(lastNode))
    );

    if (duplicates.length) {
      if (colorMightRequireFallback.test(getColorValue(lastNode))) {
        const preserve = duplicates
          .filter(
            (node) => !colorMightRequireFallback.test(getColorValue(node))
          )
          .pop();

        duplicates = duplicates.filter((node) => node !== preserve);
      }
      for (const node of duplicates) {
        node.remove();
      }
    }

    decls = decls.filter(
      (node) => node !== lastNode && !duplicates.includes(node)
    );
  }
}

module.exports = {
  explode,
  merge,
};

}, function(modId) { var map = {"../insertCloned.js":1679975018132,"../parseTrbl.js":1679975018133,"../hasAllProps.js":1679975018134,"../getDecls.js":1679975018135,"../getRules.js":1679975018136,"../getValue.js":1679975018138,"../mergeRules.js":1679975018139,"../minifyTrbl.js":1679975018140,"../minifyWsc.js":1679975018141,"../canMerge.js":1679975018145,"../trbl.js":1679975018147,"../isCustomProp.js":1679975018146,"../canExplode.js":1679975018148,"../getLastNode.js":1679975018137,"../parseWsc.js":1679975018142,"../validateWsc.js":1679975018143}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018132, function(require, module, exports) {

/**
 * @param {import('postcss').Rule} rule
 * @param {import('postcss').Declaration} decl
 * @param {Partial<import('postcss').DeclarationProps>=} props
 * @return {import('postcss').Declaration}
 */
module.exports = function insertCloned(rule, decl, props) {
  const newNode = Object.assign(decl.clone(), props);

  rule.insertAfter(decl, newNode);

  return newNode;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018133, function(require, module, exports) {

const { list } = require('postcss');
/** @type {(v: string | string[]) => [string, string, string, string]} */
module.exports = (v) => {
  const s = typeof v === 'string' ? list.space(v) : v;
  return [
    s[0], // top
    s[1] || s[0], // right
    s[2] || s[0], // bottom
    s[3] || s[1] || s[0], // left
  ];
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018134, function(require, module, exports) {

/** @type {(rule: import('postcss').Declaration[], ...props: string[]) => boolean} */
module.exports = (rule, ...props) => {
  return props.every((p) =>
    rule.some((node) => node.prop && node.prop.toLowerCase().includes(p))
  );
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018135, function(require, module, exports) {

/**
 * @param {import('postcss').Rule} rule
 * @param {string[]} properties
 * @return {import('postcss').Declaration[]}
 */
module.exports = function getDecls(rule, properties) {
  return /** @type {import('postcss').Declaration[]} */ (
    rule.nodes.filter(
      (node) =>
        node.type === 'decl' && properties.includes(node.prop.toLowerCase())
    )
  );
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018136, function(require, module, exports) {

const getLastNode = require('./getLastNode.js');

/**
 * @param {import('postcss').Declaration[]} props
 * @param {string[]} properties
 * @return {import('postcss').Declaration[]}
 */
module.exports = function getRules(props, properties) {
  return properties
    .map((property) => {
      return getLastNode(props, property);
    })
    .filter(Boolean);
};

}, function(modId) { var map = {"./getLastNode.js":1679975018137}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018137, function(require, module, exports) {

/** @type {(rule: import('postcss').AnyNode[], prop: string) => import('postcss').Declaration} */
module.exports = (rule, prop) => {
  return /** @type {import('postcss').Declaration} */ (
    rule.filter((n) => n.type === 'decl' && n.prop.toLowerCase() === prop).pop()
  );
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018138, function(require, module, exports) {

/**
 * @param {import('postcss').Declaration} arg
 * @return {string}
 */
module.exports = function getValue({ value }) {
  return value;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018139, function(require, module, exports) {

const hasAllProps = require('./hasAllProps.js');
const getDecls = require('./getDecls.js');
const getRules = require('./getRules.js');

/**
 * @param {import('postcss').Declaration} propA
 * @param {import('postcss').Declaration} propB
 * @return {boolean}
 */
function isConflictingProp(propA, propB) {
  if (
    !propB.prop ||
    propB.important !== propA.important ||
    propA.prop === propB.prop
  ) {
    return false;
  }

  const partsA = propA.prop.split('-');
  const partsB = propB.prop.split('-');

  /* Be safe: check that the first part matches. So we don't try to
   * combine e.g. border-color and color.
   */
  if (partsA[0] !== partsB[0]) {
    return false;
  }

  const partsASet = new Set(partsA);
  return partsB.every((partB) => partsASet.has(partB));
}

/**
 * @param {import('postcss').Declaration[]} match
 * @param {import('postcss').Declaration[]} nodes
 * @return {boolean}
 */
function hasConflicts(match, nodes) {
  const firstNode = Math.min(...match.map((n) => nodes.indexOf(n)));
  const lastNode = Math.max(...match.map((n) => nodes.indexOf(n)));
  const between = nodes.slice(firstNode + 1, lastNode);

  return match.some((a) => between.some((b) => isConflictingProp(a, b)));
}

/**
 * @param {import('postcss').Rule} rule
 * @param {string[]} properties
 * @param {(rules: import('postcss').Declaration[], last: import('postcss').Declaration, props: import('postcss').Declaration[]) => boolean} callback
 * @return {void}
 */
module.exports = function mergeRules(rule, properties, callback) {
  let decls = getDecls(rule, properties);

  while (decls.length) {
    const last = decls[decls.length - 1];
    const props = decls.filter((node) => node.important === last.important);
    const rules = getRules(props, properties);

    if (
      hasAllProps(rules, ...properties) &&
      !hasConflicts(
        rules,
        /** @type import('postcss').Declaration[]*/ (rule.nodes)
      )
    ) {
      if (callback(rules, last, props)) {
        decls = decls.filter((node) => !rules.includes(node));
      }
    }

    decls = decls.filter((node) => node !== last);
  }
};

}, function(modId) { var map = {"./hasAllProps.js":1679975018134,"./getDecls.js":1679975018135,"./getRules.js":1679975018136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018140, function(require, module, exports) {

const parseTrbl = require('./parseTrbl.js');

/** @type {(v: string | [string, string, string, string]) => string} */
module.exports = (v) => {
  const value = parseTrbl(v);

  if (value[3] === value[1]) {
    value.pop();

    if (value[2] === value[0]) {
      value.pop();

      if (value[0] === value[1]) {
        value.pop();
      }
    }
  }

  return value.join(' ');
};

}, function(modId) { var map = {"./parseTrbl.js":1679975018133}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018141, function(require, module, exports) {

const parseWsc = require('./parseWsc.js');
const minifyTrbl = require('./minifyTrbl.js');
const { isValidWsc } = require('./validateWsc.js');

const defaults = ['medium', 'none', 'currentcolor'];

/** @type {(v: string) => string} */
module.exports = (v) => {
  const values = parseWsc(v);

  if (!isValidWsc(values)) {
    return minifyTrbl(v);
  }

  const value = [...values, '']
    .reduceRight((prev, cur, i, arr) => {
      if (
        cur === undefined ||
        (cur.toLowerCase() === defaults[i] &&
          (!i || (arr[i - 1] || '').toLowerCase() !== cur.toLowerCase()))
      ) {
        return prev;
      }

      return cur + ' ' + prev;
    })
    .trim();

  return minifyTrbl(value || 'none');
};

}, function(modId) { var map = {"./parseWsc.js":1679975018142,"./minifyTrbl.js":1679975018140,"./validateWsc.js":1679975018143}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018142, function(require, module, exports) {

const { list } = require('postcss');
const { isWidth, isStyle, isColor } = require('./validateWsc.js');

const none = /^\s*(none|medium)(\s+none(\s+(none|currentcolor))?)?\s*$/i;

/* Approximate https://drafts.csswg.org/css-values-4/#typedef-dashed-ident */
// eslint-disable-next-line no-control-regex
const varRE = /--(\w|-|[^\x00-\x7F])+/g;
/** @type {(v: string) => string} */
const toLower = (v) => {
  let match;
  let lastIndex = 0;
  let result = '';
  varRE.lastIndex = 0;
  while ((match = varRE.exec(v)) !== null) {
    if (match.index > lastIndex) {
      result += v.substring(lastIndex, match.index).toLowerCase();
    }
    result += match[0];
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < v.length) {
    result += v.substring(lastIndex).toLowerCase();
  }
  if (result === '') {
    return v;
  }
  return result;
};

/**
 * @param {string} value
 * @return {[string, string, string]}
 */
module.exports = function parseWsc(value) {
  if (none.test(value)) {
    return ['medium', 'none', 'currentcolor'];
  }

  let width, style, color;

  const values = list.space(value);
  if (
    values.length > 1 &&
    isStyle(values[1]) &&
    values[0].toLowerCase() === 'none'
  ) {
    values.unshift();
    width = '0';
  }

  /** @type {string[]} */
  const unknown = [];

  values.forEach((v) => {
    if (isStyle(v)) {
      style = toLower(v);
    } else if (isWidth(v)) {
      width = toLower(v);
    } else if (isColor(v)) {
      color = toLower(v);
    } else {
      unknown.push(v);
    }
  });

  if (unknown.length) {
    if (!width && style && color) {
      width = unknown.pop();
    }

    if (width && !style && color) {
      style = unknown.pop();
    }

    if (width && style && !color) {
      color = unknown.pop();
    }
  }

  return /** @type {[string, string, string]} */ ([width, style, color]);
};

}, function(modId) { var map = {"./validateWsc.js":1679975018143}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018143, function(require, module, exports) {

const colors = require('./colornames.js');

const widths = new Set(['thin', 'medium', 'thick']);
const styles = new Set([
  'none',
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
 * @param {string} value
 * @return {boolean}
 */
function isStyle(value) {
  return value !== undefined && styles.has(value.toLowerCase());
}

/**
 * @param {string} value
 * @return {boolean}
 */
function isWidth(value) {
  return (
    (value && widths.has(value.toLowerCase())) ||
    /^(\d+(\.\d+)?|\.\d+)(\w+)?$/.test(value)
  );
}

/**
 * @param {string} value
 * @return {boolean}
 */
function isColor(value) {
  if (!value) {
    return false;
  }

  value = value.toLowerCase();

  if (/rgba?\(/.test(value)) {
    return true;
  }

  if (/hsla?\(/.test(value)) {
    return true;
  }

  if (/#([0-9a-z]{6}|[0-9a-z]{3})/.test(value)) {
    return true;
  }

  if (value === 'transparent') {
    return true;
  }

  if (value === 'currentcolor') {
    return true;
  }

  return colors.has(value);
}

/**
 * @param {[string, string, string]} wscs
 * @return {boolean}
 */
function isValidWsc(wscs) {
  const validWidth = isWidth(wscs[0]);
  const validStyle = isStyle(wscs[1]);
  const validColor = isColor(wscs[2]);

  return (
    (validWidth && validStyle) ||
    (validWidth && validColor) ||
    (validStyle && validColor)
  );
}

module.exports = { isStyle, isWidth, isColor, isValidWsc };

}, function(modId) { var map = {"./colornames.js":1679975018144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018144, function(require, module, exports) {

/* https://www.w3.org/TR/css-color-4/#named-colors */
module.exports = new Set([
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
]);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018145, function(require, module, exports) {

const isCustomProp = require('./isCustomProp');

/** @type {(node: import('postcss').Declaration) => boolean} */
const important = (node) => node.important;
/** @type {(node: import('postcss').Declaration) => boolean} */
const unimportant = (node) => !node.important;

/* Cannot be combined with other values in shorthand 
  https://www.w3.org/TR/css-cascade-5/#shorthand */
const cssWideKeywords = ['inherit', 'initial', 'unset', 'revert'];
/**
 * @type {(props: import('postcss').Declaration[], includeCustomProps?: boolean) => boolean}
 */
module.exports = (props, includeCustomProps = true) => {
  const uniqueProps = new Set(props.map((node) => node.value.toLowerCase()));

  if (uniqueProps.size > 1) {
    for (const unmergeable of cssWideKeywords) {
      if (uniqueProps.has(unmergeable)) {
        return false;
      }
    }
  }

  if (
    includeCustomProps &&
    props.some(isCustomProp) &&
    !props.every(isCustomProp)
  ) {
    return false;
  }

  return props.every(unimportant) || props.every(important);
};

}, function(modId) { var map = {"./isCustomProp":1679975018146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018146, function(require, module, exports) {

/** @type {(node: import('postcss').Declaration) => boolean} */
module.exports = (node) => node.value.search(/var\s*\(\s*--/i) !== -1;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018147, function(require, module, exports) {

module.exports = ['top', 'right', 'bottom', 'left'];

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018148, function(require, module, exports) {

const isCustomProp = require('./isCustomProp');

const globalKeywords = new Set(['inherit', 'initial', 'unset', 'revert']);

/** @type {(prop: import('postcss').Declaration, includeCustomProps?: boolean) => boolean} */
module.exports = (prop, includeCustomProps = true) => {
  if (
    !prop.value ||
    (includeCustomProps && isCustomProp(prop)) ||
    (prop.value && globalKeywords.has(prop.value.toLowerCase()))
  ) {
    return false;
  }
  return true;
};

}, function(modId) { var map = {"./isCustomProp":1679975018146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018149, function(require, module, exports) {

const { list } = require('postcss');
const { unit } = require('postcss-value-parser');
const stylehacks = require('stylehacks');
const canMerge = require('../canMerge.js');
const getDecls = require('../getDecls.js');
const getValue = require('../getValue.js');
const mergeRules = require('../mergeRules.js');
const insertCloned = require('../insertCloned.js');
const isCustomProp = require('../isCustomProp.js');
const canExplode = require('../canExplode.js');

const properties = ['column-width', 'column-count'];
const auto = 'auto';
const inherit = 'inherit';

/**
 * Normalize a columns shorthand definition. Both of the longhand
 * properties' initial values are 'auto', and as per the spec,
 * omitted values are set to their initial values. Thus, we can
 * remove any 'auto' definition when there are two values.
 *
 * Specification link: https://www.w3.org/TR/css3-multicol/
 *
 * @param {[string, string]} values
 * @return {string}
 */
function normalize(values) {
  if (values[0].toLowerCase() === auto) {
    return values[1];
  }

  if (values[1].toLowerCase() === auto) {
    return values[0];
  }

  if (
    values[0].toLowerCase() === inherit &&
    values[1].toLowerCase() === inherit
  ) {
    return inherit;
  }

  return values.join(' ');
}
/**
 * @param {import('postcss').Rule} rule
 * @return {void}
 */
function explode(rule) {
  rule.walkDecls(/^columns$/i, (decl) => {
    if (!canExplode(decl)) {
      return;
    }

    if (stylehacks.detect(decl)) {
      return;
    }

    let values = list.space(decl.value);

    if (values.length === 1) {
      values.push(auto);
    }

    values.forEach((value, i) => {
      let prop = properties[1];
      const dimension = unit(value);
      if (value.toLowerCase() === auto) {
        prop = properties[i];
      } else if (dimension && dimension.unit !== '') {
        prop = properties[0];
      }

      insertCloned(/** @type {import('postcss').Rule} */ (decl.parent), decl, {
        prop,
        value,
      });
    });

    decl.remove();
  });
}

/**
 * @param {import('postcss').Rule} rule
 * @return {void}
 */
function cleanup(rule) {
  let decls = getDecls(rule, ['columns'].concat(properties));

  while (decls.length) {
    const lastNode = decls[decls.length - 1];

    // remove properties of lower precedence
    const lesser = decls.filter(
      (node) =>
        !stylehacks.detect(lastNode) &&
        !stylehacks.detect(node) &&
        node !== lastNode &&
        node.important === lastNode.important &&
        lastNode.prop === 'columns' &&
        node.prop !== lastNode.prop
    );

    for (const node of lesser) {
      node.remove();
    }
    decls = decls.filter((node) => !lesser.includes(node));

    // get duplicate properties
    let duplicates = decls.filter(
      (node) =>
        !stylehacks.detect(lastNode) &&
        !stylehacks.detect(node) &&
        node !== lastNode &&
        node.important === lastNode.important &&
        node.prop === lastNode.prop &&
        !(!isCustomProp(node) && isCustomProp(lastNode))
    );

    for (const node of duplicates) {
      node.remove();
    }
    decls = decls.filter(
      (node) => node !== lastNode && !duplicates.includes(node)
    );
  }
}

/**
 * @param {import('postcss').Rule} rule
 * @return {void}
 */
function merge(rule) {
  mergeRules(rule, properties, (rules, lastNode) => {
    if (canMerge(rules) && !rules.some(stylehacks.detect)) {
      insertCloned(
        /** @type {import('postcss').Rule} */ (lastNode.parent),
        lastNode,
        {
          prop: 'columns',
          value: normalize(/** @type [string, string] */ (rules.map(getValue))),
        }
      );

      for (const node of rules) {
        node.remove();
      }

      return true;
    }
    return false;
  });

  cleanup(rule);
}

module.exports = {
  explode,
  merge,
};

}, function(modId) { var map = {"../canMerge.js":1679975018145,"../getDecls.js":1679975018135,"../getValue.js":1679975018138,"../mergeRules.js":1679975018139,"../insertCloned.js":1679975018132,"../isCustomProp.js":1679975018146,"../canExplode.js":1679975018148}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018150, function(require, module, exports) {

const base = require('./boxBase.js');

module.exports = base('margin');

}, function(modId) { var map = {"./boxBase.js":1679975018151}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018151, function(require, module, exports) {

const stylehacks = require('stylehacks');
const canMerge = require('../canMerge.js');
const getDecls = require('../getDecls.js');
const minifyTrbl = require('../minifyTrbl.js');
const parseTrbl = require('../parseTrbl.js');
const insertCloned = require('../insertCloned.js');
const mergeRules = require('../mergeRules.js');
const mergeValues = require('../mergeValues.js');
const trbl = require('../trbl.js');
const isCustomProp = require('../isCustomProp.js');
const canExplode = require('../canExplode.js');

/**
 * @param {string} prop
 * @return {{explode: (rule: import('postcss').Rule) => void, merge: (rule: import('postcss').Rule) => void}}
 */
module.exports = (prop) => {
  const properties = trbl.map((direction) => `${prop}-${direction}`);
  /** @type {(rule: import('postcss').Rule) => void} */
  const cleanup = (rule) => {
    let decls = getDecls(rule, [prop].concat(properties));

    while (decls.length) {
      const lastNode = decls[decls.length - 1];

      // remove properties of lower precedence
      const lesser = decls.filter(
        (node) =>
          !stylehacks.detect(lastNode) &&
          !stylehacks.detect(node) &&
          node !== lastNode &&
          node.important === lastNode.important &&
          lastNode.prop === prop &&
          node.prop !== lastNode.prop
      );

      for (const node of lesser) {
        node.remove();
      }
      decls = decls.filter((node) => !lesser.includes(node));

      // get duplicate properties
      let duplicates = decls.filter(
        (node) =>
          !stylehacks.detect(lastNode) &&
          !stylehacks.detect(node) &&
          node !== lastNode &&
          node.important === lastNode.important &&
          node.prop === lastNode.prop &&
          !(!isCustomProp(node) && isCustomProp(lastNode))
      );

      for (const node of duplicates) {
        node.remove();
      }
      decls = decls.filter(
        (node) => node !== lastNode && !duplicates.includes(node)
      );
    }
  };

  const processor = {
    /** @type {(rule: import('postcss').Rule) => void} */
    explode: (rule) => {
      rule.walkDecls(new RegExp('^' + prop + '$', 'i'), (decl) => {
        if (!canExplode(decl)) {
          return;
        }

        if (stylehacks.detect(decl)) {
          return;
        }

        const values = parseTrbl(decl.value);

        trbl.forEach((direction, index) => {
          insertCloned(
            /** @type {import('postcss').Rule} */ (decl.parent),
            decl,
            {
              prop: properties[index],
              value: values[index],
            }
          );
        });

        decl.remove();
      });
    },
    /** @type {(rule: import('postcss').Rule) => void} */
    merge: (rule) => {
      mergeRules(rule, properties, (rules, lastNode) => {
        if (canMerge(rules) && !rules.some(stylehacks.detect)) {
          insertCloned(
            /** @type {import('postcss').Rule} */ (lastNode.parent),
            lastNode,
            {
              prop,
              value: minifyTrbl(mergeValues(...rules)),
            }
          );
          for (const node of rules) {
            node.remove();
          }

          return true;
        }
        return false;
      });

      cleanup(rule);
    },
  };

  return processor;
};

}, function(modId) { var map = {"../canMerge.js":1679975018145,"../getDecls.js":1679975018135,"../minifyTrbl.js":1679975018140,"../parseTrbl.js":1679975018133,"../insertCloned.js":1679975018132,"../mergeRules.js":1679975018139,"../mergeValues.js":1679975018152,"../trbl.js":1679975018147,"../isCustomProp.js":1679975018146,"../canExplode.js":1679975018148}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018152, function(require, module, exports) {

const getValue = require('./getValue.js');

/** @type {(...rules: import('postcss').Declaration[]) => string} */
module.exports = (...rules) => rules.map(getValue).join(' ');

}, function(modId) { var map = {"./getValue.js":1679975018138}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018153, function(require, module, exports) {

const base = require('./boxBase');

module.exports = base('padding');

}, function(modId) { var map = {"./boxBase":1679975018151}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018129);
})()
//miniprogram-npm-outsideDeps=["postcss","stylehacks","postcss-value-parser"]
//# sourceMappingURL=index.js.map