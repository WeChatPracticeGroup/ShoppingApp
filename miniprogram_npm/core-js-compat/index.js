module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975015906, function(require, module, exports) {

const compat = require('./compat');
const data = require('./data');
const entries = require('./entries');
const getModulesListForTargetVersion = require('./get-modules-list-for-target-version');
const modules = require('./modules');

module.exports = Object.assign(compat, {
  compat,
  data,
  entries,
  getModulesListForTargetVersion,
  modules,
});

}, function(modId) {var map = {"./compat":1679975015907,"./get-modules-list-for-target-version":1679975015909}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975015907, function(require, module, exports) {

const { compare, filterOutStabilizedProposals, has, intersection } = require('./helpers');
const data = require('./data');
const entries = require('./entries');
const getModulesListForTargetVersion = require('./get-modules-list-for-target-version');
const allModules = require('./modules');
const targetsParser = require('./targets-parser');

function throwInvalidFilter(filter) {
  throw TypeError(`Specified invalid module name or pattern: ${ filter }`);
}

function atLeastSomeModules(modules, filter) {
  if (!modules.length) throwInvalidFilter(filter);
  return modules;
}

function getModules(filter) {
  if (typeof filter == 'string') {
    if (has(entries, filter)) return entries[filter];
    return atLeastSomeModules(allModules.filter(it => it.startsWith(filter)), filter);
  } else if (filter instanceof RegExp) return atLeastSomeModules(allModules.filter(it => filter.test(it)), filter);
  throwInvalidFilter(filter);
}

function normalizeModules(option) {
  // TODO: use `.flatMap` in core-js@4
  return new Set(Array.isArray(option) ? [].concat.apply([], option.map(getModules)) : getModules(option));
}

function checkModule(name, targets) {
  const result = {
    required: !targets,
    targets: {},
  };

  if (!targets) return result;

  const requirements = data[name];

  for (const [engine, version] of targets) {
    if (!has(requirements, engine) || compare(version, '<', requirements[engine])) {
      result.required = true;
      result.targets[engine] = version;
    }
  }

  return result;
}

module.exports = function ({
  filter = null, // TODO: Obsolete, remove from `core-js@4`
  modules = null,
  exclude = [],
  targets = null,
  version = null,
  inverse = false,
} = {}) {
  if (modules == null) modules = filter;
  inverse = !!inverse;

  const parsedTargets = targets ? targetsParser(targets) : null;

  const result = {
    list: [],
    targets: {},
  };

  exclude = normalizeModules(exclude);

  modules = modules ? [...normalizeModules(modules)] : allModules;

  if (exclude.size) modules = modules.filter(it => !exclude.has(it));

  modules = intersection(modules, version ? getModulesListForTargetVersion(version) : allModules);

  if (!inverse) modules = filterOutStabilizedProposals(modules);

  for (const key of modules) {
    const check = checkModule(key, parsedTargets);

    if (check.required ^ inverse) {
      result.list.push(key);
      result.targets[key] = check.targets;
    }
  }

  return result;
};

}, function(modId) { var map = {"./helpers":1679975015908,"./get-modules-list-for-target-version":1679975015909,"./targets-parser":1679975015910}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975015908, function(require, module, exports) {

// eslint-disable-next-line es/no-object-hasown -- safe
const has = Object.hasOwn || Function.call.bind({}.hasOwnProperty);

function semver(input) {
  if (input instanceof semver) return input;
  // eslint-disable-next-line new-cap -- ok
  if (!(this instanceof semver)) return new semver(input);
  const match = /(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(input);
  if (!match) throw TypeError(`Invalid version: ${ input }`);
  const [, $major, $minor, $patch] = match;
  this.major = +$major;
  this.minor = $minor ? +$minor : 0;
  this.patch = $patch ? +$patch : 0;
}

semver.prototype.toString = function () {
  return `${ this.major }.${ this.minor }.${ this.patch }`;
};

function compare($a, operator, $b) {
  const a = semver($a);
  const b = semver($b);
  for (const component of ['major', 'minor', 'patch']) {
    if (a[component] < b[component]) return operator === '<' || operator === '<=' || operator === '!=';
    if (a[component] > b[component]) return operator === '>' || operator === '>=' || operator === '!=';
  } return operator === '==' || operator === '<=' || operator === '>=';
}

function filterOutStabilizedProposals(modules) {
  const modulesSet = new Set(modules);

  for (const $module of modulesSet) {
    if ($module.startsWith('esnext.') && modulesSet.has($module.replace(/^esnext\./, 'es.'))) {
      modulesSet.delete($module);
    }
  }

  return [...modulesSet];
}

function intersection(list, order) {
  const set = list instanceof Set ? list : new Set(list);
  return order.filter(name => set.has(name));
}

function sortObjectByKey(object, fn) {
  return Object.keys(object).sort(fn).reduce((memo, key) => {
    memo[key] = object[key];
    return memo;
  }, {});
}

module.exports = {
  compare,
  filterOutStabilizedProposals,
  has,
  intersection,
  semver,
  sortObjectByKey,
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975015909, function(require, module, exports) {

const { compare, intersection, semver } = require('./helpers');
const modulesByVersions = require('./modules-by-versions');
const modules = require('./modules');

module.exports = function (raw) {
  const corejs = semver(raw);
  if (corejs.major !== 3) {
    throw RangeError('This version of `core-js-compat` works only with `core-js@3`.');
  }
  const result = [];
  for (const version of Object.keys(modulesByVersions)) {
    if (compare(version, '<=', corejs)) {
      result.push(...modulesByVersions[version]);
    }
  }
  return intersection(result, modules);
};

}, function(modId) { var map = {"./helpers":1679975015908}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975015910, function(require, module, exports) {

const browserslist = require('browserslist');
const { compare, has } = require('./helpers');
const external = require('./external');

const aliases = new Map([
  ['and_chr', 'chrome-android'],
  ['and_ff', 'firefox-android'],
  ['ie_mob', 'ie'],
  ['ios_saf', 'ios'],
  ['oculus', 'quest'],
  ['op_mob', 'opera-android'],
  // TODO: Remove from `core-js@4`
  ['opera_mobile', 'opera-android'],
  ['react', 'react-native'],
  ['reactnative', 'react-native'],
]);

const validTargets = new Set([
  'android',
  'bun',
  'chrome',
  'chrome-android',
  'deno',
  'edge',
  'electron',
  'firefox',
  'firefox-android',
  'hermes',
  'ie',
  'ios',
  'node',
  'opera',
  'opera-android',
  'phantom',
  'quest',
  'react-native',
  'rhino',
  'safari',
  'samsung',
]);

const toLowerKeys = function (object) {
  return Object.entries(object).reduce((accumulator, [key, value]) => {
    accumulator[key.toLowerCase()] = value;
    return accumulator;
  }, {});
};

module.exports = function (targets) {
  const { browsers, esmodules, node, ...rest } = (typeof targets != 'object' || Array.isArray(targets))
    ? { browsers: targets } : toLowerKeys(targets);

  const list = Object.entries(rest);

  if (browsers) {
    if (typeof browsers == 'string' || Array.isArray(browsers)) {
      list.push(...browserslist(browsers).map(it => it.split(' ')));
    } else {
      list.push(...Object.entries(browsers));
    }
  }
  if (esmodules) {
    list.push(...Object.entries(external.modules));
  }
  if (node) {
    list.push(['node', node === 'current' ? process.versions.node : node]);
  }

  const normalized = list.map(([engine, version]) => {
    if (has(browserslist.aliases, engine)) {
      engine = browserslist.aliases[engine];
    }
    if (aliases.has(engine)) {
      engine = aliases.get(engine);
    }
    return [engine, String(version)];
  }).filter(([engine]) => {
    return validTargets.has(engine);
  }).sort(([a], [b]) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });

  const reducedByMinVersion = new Map();
  for (const [engine, version] of normalized) {
    if (!reducedByMinVersion.has(engine) || compare(version, '<=', reducedByMinVersion.get(engine))) {
      reducedByMinVersion.set(engine, version);
    }
  }

  return reducedByMinVersion;
};

}, function(modId) { var map = {"./helpers":1679975015908}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975015906);
})()
//miniprogram-npm-outsideDeps=["./data","./entries","./modules","./modules-by-versions","browserslist","./external"]
//# sourceMappingURL=index.js.map