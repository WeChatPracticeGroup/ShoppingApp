module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018128, function(require, module, exports) {

const OVERRIDABLE_RULES = new Set(['keyframes', 'counter-style']);
const SCOPE_RULES = new Set(['media', 'supports']);

/**
 * @param {string} prop
 * @return {string}
 */
function vendorUnprefixed(prop) {
  return prop.replace(/^-\w+-/, '');
}

/**
 * @param {string} name
 * @return {boolean}
 */
function isOverridable(name) {
  return OVERRIDABLE_RULES.has(vendorUnprefixed(name.toLowerCase()));
}

/**
 * @param {string} name
 * @return {boolean}
 */
function isScope(name) {
  return SCOPE_RULES.has(vendorUnprefixed(name.toLowerCase()));
}

/**
 * @param {import('postcss').AtRule} node
 * @return {string}
 */
function getScope(node) {
  /** @type {import('postcss').Container<import('postcss').ChildNode> | import('postcss').Document | undefined} */
  let current = node.parent;

  const chain = [node.name.toLowerCase(), node.params];

  while (current) {
    if (
      current.type === 'atrule' &&
      isScope(/** @type import('postcss').AtRule */ (current).name)
    ) {
      chain.unshift(
        /** @type import('postcss').AtRule */ (current).name +
          ' ' +
          /** @type import('postcss').AtRule */ (current).params
      );
    }
    current = current.parent;
  }

  return chain.join('|');
}

/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-discard-overridden',
    prepare() {
      const cache = new Map();
      /** @type {{node: import('postcss').AtRule, scope: string}[]} */
      const rules = [];

      return {
        OnceExit(css) {
          css.walkAtRules((node) => {
            if (isOverridable(node.name)) {
              const scope = getScope(node);

              cache.set(scope, node);
              rules.push({
                node,
                scope,
              });
            }
          });

          rules.forEach((rule) => {
            if (cache.get(rule.scope) !== rule.node) {
              rule.node.remove();
            }
          });
        },
      };
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018128);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map