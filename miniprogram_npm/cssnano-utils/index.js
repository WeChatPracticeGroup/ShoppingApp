module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975016836, function(require, module, exports) {

const rawCache = require('./rawCache.js');
const getArguments = require('./getArguments.js');
const sameParent = require('./sameParent.js');

module.exports = { rawCache, getArguments, sameParent };

}, function(modId) {var map = {"./rawCache.js":1679975016837,"./getArguments.js":1679975016838,"./sameParent.js":1679975016839}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975016837, function(require, module, exports) {


/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'cssnano-util-raw-cache',
    /**
     * @param {import('postcss').Root} css
     * @param {{result: import('postcss').Result & {root: {rawCache?: any}}}} arg
     */
    OnceExit(css, { result }) {
      result.root.rawCache = {
        colon: ':',
        indent: '',
        beforeDecl: '',
        beforeRule: '',
        beforeOpen: '',
        beforeClose: '',
        beforeComment: '',
        after: '',
        emptyBody: '',
        commentLeft: '',
        commentRight: '',
      };
    },
  };
}

pluginCreator.postcss = true;

module.exports = pluginCreator;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975016838, function(require, module, exports) {

/**
 * Extracts the arguments of a CSS function or AtRule.
 *
 * @param {import('postcss-value-parser').ParsedValue | import('postcss-value-parser').FunctionNode} node
 * @return {import('postcss-value-parser').Node[][]}
 */
module.exports = function getArguments(node) {
  /** @type {import('postcss-value-parser').Node[][]} */
  const list = [[]];
  for (const child of node.nodes) {
    if (child.type !== 'div') {
      list[list.length - 1].push(child);
    } else {
      list.push([]);
    }
  }
  return list;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975016839, function(require, module, exports) {


/**
 * @param {import('postcss').AnyNode} nodeA
 * @param {import('postcss').AnyNode} nodeB
 * @return {boolean}
 */
function checkMatch(nodeA, nodeB) {
  if (nodeA.type === 'atrule' && nodeB.type === 'atrule') {
    return (
      nodeA.params === nodeB.params &&
      nodeA.name.toLowerCase() === nodeB.name.toLowerCase()
    );
  }
  return nodeA.type === nodeB.type;
}

/** @typedef {import('postcss').AnyNode & {parent?: Child}} Child */
/**
 * @param {Child} nodeA
 * @param {Child} nodeB
 * @return {boolean}
 */
function sameParent(nodeA, nodeB) {
  if (!nodeA.parent) {
    // A is orphaned, return if B is orphaned as well
    return !nodeB.parent;
  }

  if (!nodeB.parent) {
    // B is orphaned and A is not
    return false;
  }

  // Check if parents match
  if (!checkMatch(nodeA.parent, nodeB.parent)) {
    return false;
  }

  // Check parents' parents
  return sameParent(nodeA.parent, nodeB.parent);
}

module.exports = sameParent;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975016836);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map