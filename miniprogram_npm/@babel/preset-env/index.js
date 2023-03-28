module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975013839, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPluginRequired = isPluginRequired;
exports.default = exports.getPolyfillPlugins = exports.getModulesPluginNames = exports.transformIncludesAndExcludes = void 0;

var _semver = require("semver");

var _debug = require("./debug");

var _getOptionSpecificExcludes = _interopRequireDefault(require("./get-option-specific-excludes"));

var _filterItems = require("./filter-items");

var _moduleTransformations = _interopRequireDefault(require("./module-transformations"));

var _normalizeOptions = _interopRequireDefault(require("./normalize-options"));

var _shippedProposals = require("../data/shipped-proposals");

var _pluginsCompatData = require("./plugins-compat-data");

var _overlappingPlugins = _interopRequireDefault(require("@babel/compat-data/overlapping-plugins"));

var _usagePlugin = _interopRequireDefault(require("./polyfills/corejs2/usage-plugin"));

var _usagePlugin2 = _interopRequireDefault(require("./polyfills/corejs3/usage-plugin"));

var _usagePlugin3 = _interopRequireDefault(require("./polyfills/regenerator/usage-plugin"));

var _entryPlugin = _interopRequireDefault(require("./polyfills/corejs2/entry-plugin"));

var _entryPlugin2 = _interopRequireDefault(require("./polyfills/corejs3/entry-plugin"));

var _entryPlugin3 = _interopRequireDefault(require("./polyfills/regenerator/entry-plugin"));

var _helperCompilationTargets = _interopRequireWildcard(require("@babel/helper-compilation-targets"));

var _availablePlugins = _interopRequireDefault(require("./available-plugins"));

var _utils = require("./utils");

var _helperPluginUtils = require("@babel/helper-plugin-utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPluginRequired(targets, support) {
  return (0, _helperCompilationTargets.isRequired)("fake-name", targets, {
    compatData: {
      "fake-name": support
    }
  });
}

const pluginLists = {
  withProposals: {
    withoutBugfixes: _pluginsCompatData.plugins,
    withBugfixes: Object.assign({}, _pluginsCompatData.plugins, _pluginsCompatData.pluginsBugfixes)
  },
  withoutProposals: {
    withoutBugfixes: (0, _utils.filterStageFromList)(_pluginsCompatData.plugins, _shippedProposals.proposalPlugins),
    withBugfixes: (0, _utils.filterStageFromList)(Object.assign({}, _pluginsCompatData.plugins, _pluginsCompatData.pluginsBugfixes), _shippedProposals.proposalPlugins)
  }
};

function getPluginList(proposals, bugfixes) {
  if (proposals) {
    if (bugfixes) return pluginLists.withProposals.withBugfixes;else return pluginLists.withProposals.withoutBugfixes;
  } else {
    if (bugfixes) return pluginLists.withoutProposals.withBugfixes;else return pluginLists.withoutProposals.withoutBugfixes;
  }
}

const getPlugin = pluginName => {
  const plugin = _availablePlugins.default[pluginName];

  if (!plugin) {
    throw new Error(`Could not find plugin "${pluginName}". Ensure there is an entry in ./available-plugins.js for it.`);
  }

  return plugin;
};

const transformIncludesAndExcludes = opts => {
  return opts.reduce((result, opt) => {
    const target = opt.match(/^(es|es6|es7|esnext|web)\./) ? "builtIns" : "plugins";
    result[target].add(opt);
    return result;
  }, {
    all: opts,
    plugins: new Set(),
    builtIns: new Set()
  });
};

exports.transformIncludesAndExcludes = transformIncludesAndExcludes;

const getModulesPluginNames = ({
  modules,
  transformations,
  shouldTransformESM,
  shouldTransformDynamicImport,
  shouldTransformExportNamespaceFrom,
  shouldParseTopLevelAwait
}) => {
  const modulesPluginNames = [];

  if (modules !== false && transformations[modules]) {
    if (shouldTransformESM) {
      modulesPluginNames.push(transformations[modules]);
    }

    if (shouldTransformDynamicImport && shouldTransformESM && modules !== "umd") {
      modulesPluginNames.push("proposal-dynamic-import");
    } else {
      if (shouldTransformDynamicImport) {
        console.warn("Dynamic import can only be supported when transforming ES modules" + " to AMD, CommonJS or SystemJS. Only the parser plugin will be enabled.");
      }

      modulesPluginNames.push("syntax-dynamic-import");
    }
  } else {
    modulesPluginNames.push("syntax-dynamic-import");
  }

  if (shouldTransformExportNamespaceFrom) {
    modulesPluginNames.push("proposal-export-namespace-from");
  } else {
    modulesPluginNames.push("syntax-export-namespace-from");
  }

  if (shouldParseTopLevelAwait) {
    modulesPluginNames.push("syntax-top-level-await");
  }

  return modulesPluginNames;
};

exports.getModulesPluginNames = getModulesPluginNames;

const getPolyfillPlugins = ({
  useBuiltIns,
  corejs,
  polyfillTargets,
  include,
  exclude,
  proposals,
  shippedProposals,
  regenerator,
  debug
}) => {
  const polyfillPlugins = [];

  if (useBuiltIns === "usage" || useBuiltIns === "entry") {
    const pluginOptions = {
      corejs,
      polyfillTargets,
      include,
      exclude,
      proposals,
      shippedProposals,
      regenerator,
      debug
    };

    if (corejs) {
      if (useBuiltIns === "usage") {
        if (corejs.major === 2) {
          polyfillPlugins.push([_usagePlugin.default, pluginOptions]);
        } else {
          polyfillPlugins.push([_usagePlugin2.default, pluginOptions]);
        }

        if (regenerator) {
          polyfillPlugins.push([_usagePlugin3.default, pluginOptions]);
        }
      } else {
        if (corejs.major === 2) {
          polyfillPlugins.push([_entryPlugin.default, pluginOptions]);
        } else {
          polyfillPlugins.push([_entryPlugin2.default, pluginOptions]);

          if (!regenerator) {
            polyfillPlugins.push([_entryPlugin3.default, pluginOptions]);
          }
        }
      }
    }
  }

  return polyfillPlugins;
};

exports.getPolyfillPlugins = getPolyfillPlugins;

function supportsStaticESM(caller) {
  return !!(caller == null ? void 0 : caller.supportsStaticESM);
}

function supportsDynamicImport(caller) {
  return !!(caller == null ? void 0 : caller.supportsDynamicImport);
}

function supportsExportNamespaceFrom(caller) {
  return !!(caller == null ? void 0 : caller.supportsExportNamespaceFrom);
}

function supportsTopLevelAwait(caller) {
  return !!(caller == null ? void 0 : caller.supportsTopLevelAwait);
}

var _default = (0, _helperPluginUtils.declare)((api, opts) => {
  api.assertVersion(7);
  const {
    bugfixes,
    configPath,
    debug,
    exclude: optionsExclude,
    forceAllTransforms,
    ignoreBrowserslistConfig,
    include: optionsInclude,
    loose,
    modules,
    shippedProposals,
    spec,
    targets: optionsTargets,
    useBuiltIns,
    corejs: {
      version: corejs,
      proposals
    },
    browserslistEnv
  } = (0, _normalizeOptions.default)(opts);
  let hasUglifyTarget = false;

  if (optionsTargets == null ? void 0 : optionsTargets.uglify) {
    hasUglifyTarget = true;
    delete optionsTargets.uglify;
    console.log("");
    console.log("The uglify target has been deprecated. Set the top level");
    console.log("option `forceAllTransforms: true` instead.");
    console.log("");
  }

  if ((optionsTargets == null ? void 0 : optionsTargets.esmodules) && optionsTargets.browsers) {
    console.log("");
    console.log("@babel/preset-env: esmodules and browsers targets have been specified together.");
    console.log(`\`browsers\` target, \`${optionsTargets.browsers}\` will be ignored.`);
    console.log("");
  }

  const targets = (0, _helperCompilationTargets.default)(optionsTargets, {
    ignoreBrowserslistConfig,
    configPath,
    browserslistEnv
  });
  const include = transformIncludesAndExcludes(optionsInclude);
  const exclude = transformIncludesAndExcludes(optionsExclude);
  const transformTargets = forceAllTransforms || hasUglifyTarget ? {} : targets;
  const compatData = getPluginList(shippedProposals, bugfixes);
  const shouldSkipExportNamespaceFrom = modules === "auto" && (api.caller == null ? void 0 : api.caller(supportsExportNamespaceFrom)) || modules === false && !(0, _helperCompilationTargets.isRequired)("proposal-export-namespace-from", transformTargets, {
    compatData,
    includes: include.plugins,
    excludes: exclude.plugins
  });
  const modulesPluginNames = getModulesPluginNames({
    modules,
    transformations: _moduleTransformations.default,
    shouldTransformESM: modules !== "auto" || !(api.caller == null ? void 0 : api.caller(supportsStaticESM)),
    shouldTransformDynamicImport: modules !== "auto" || !(api.caller == null ? void 0 : api.caller(supportsDynamicImport)),
    shouldTransformExportNamespaceFrom: !shouldSkipExportNamespaceFrom,
    shouldParseTopLevelAwait: !api.caller || api.caller(supportsTopLevelAwait)
  });
  const pluginNames = (0, _helperCompilationTargets.filterItems)(compatData, include.plugins, exclude.plugins, transformTargets, modulesPluginNames, (0, _getOptionSpecificExcludes.default)({
    loose
  }), _shippedProposals.pluginSyntaxMap);
  (0, _filterItems.removeUnnecessaryItems)(pluginNames, _overlappingPlugins.default);
  const polyfillPlugins = getPolyfillPlugins({
    useBuiltIns,
    corejs,
    polyfillTargets: targets,
    include: include.builtIns,
    exclude: exclude.builtIns,
    proposals,
    shippedProposals,
    regenerator: pluginNames.has("transform-regenerator"),
    debug
  });
  const pluginUseBuiltIns = useBuiltIns !== false;
  const plugins = Array.from(pluginNames).map(pluginName => {
    if (pluginName === "proposal-class-properties" || pluginName === "proposal-private-methods" || pluginName === "proposal-private-property-in-object") {
      return [getPlugin(pluginName), {
        loose: loose ? "#__internal__@babel/preset-env__prefer-true-but-false-is-ok-if-it-prevents-an-error" : "#__internal__@babel/preset-env__prefer-false-but-true-is-ok-if-it-prevents-an-error"
      }];
    }

    return [getPlugin(pluginName), {
      spec,
      loose,
      useBuiltIns: pluginUseBuiltIns
    }];
  }).concat(polyfillPlugins);

  if (debug) {
    console.log("@babel/preset-env: `DEBUG` option");
    console.log("\nUsing targets:");
    console.log(JSON.stringify((0, _helperCompilationTargets.prettifyTargets)(targets), null, 2));
    console.log(`\nUsing modules transform: ${modules.toString()}`);
    console.log("\nUsing plugins:");
    pluginNames.forEach(pluginName => {
      (0, _debug.logPluginOrPolyfill)(pluginName, targets, _pluginsCompatData.plugins);
    });

    if (!useBuiltIns) {
      console.log("\nUsing polyfills: No polyfills were added, since the `useBuiltIns` option was not set.");
    } else {
      console.log(`\nUsing polyfills with \`${useBuiltIns}\` option:`);
    }
  }

  return {
    plugins
  };
});

exports.default = _default;
}, function(modId) {var map = {"./debug":1679975013840,"./get-option-specific-excludes":1679975013841,"./filter-items":1679975013842,"./module-transformations":1679975013843,"./normalize-options":1679975013844,"../data/shipped-proposals":1679975013850,"./plugins-compat-data":1679975013845,"./polyfills/corejs2/usage-plugin":1679975013851,"./polyfills/corejs3/usage-plugin":1679975013854,"./polyfills/regenerator/usage-plugin":1679975013856,"./polyfills/corejs2/entry-plugin":1679975013857,"./polyfills/corejs3/entry-plugin":1679975013858,"./polyfills/regenerator/entry-plugin":1679975013859,"./available-plugins":1679975013846,"./utils":1679975013853}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013840, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logUsagePolyfills = exports.logEntryPolyfills = exports.logPluginOrPolyfill = void 0;

var _helperCompilationTargets = require("@babel/helper-compilation-targets");

const wordEnds = size => {
  return size > 1 ? "s" : "";
};

const logPluginOrPolyfill = (item, targetVersions, list) => {
  const filteredList = (0, _helperCompilationTargets.getInclusionReasons)(item, targetVersions, list);
  const formattedTargets = JSON.stringify(filteredList).replace(/,/g, ", ").replace(/^\{"/, '{ "').replace(/"\}$/, '" }');
  console.log(`  ${item} ${formattedTargets}`);
};

exports.logPluginOrPolyfill = logPluginOrPolyfill;

const logEntryPolyfills = (polyfillName, importPolyfillIncluded, polyfills, filename, polyfillTargets, allBuiltInsList) => {
  if (process.env.BABEL_ENV === "test") {
    filename = filename.replace(/\\/g, "/");
  }

  if (!importPolyfillIncluded) {
    console.log(`\n[${filename}] Import of ${polyfillName} was not found.`);
    return;
  }

  if (!polyfills.size) {
    console.log(`\n[${filename}] Based on your targets, polyfills were not added.`);
    return;
  }

  console.log(`\n[${filename}] Replaced ${polyfillName} entries with the following polyfill${wordEnds(polyfills.size)}:`);

  for (const polyfill of polyfills) {
    logPluginOrPolyfill(polyfill, polyfillTargets, allBuiltInsList);
  }
};

exports.logEntryPolyfills = logEntryPolyfills;

const logUsagePolyfills = (polyfills, filename, polyfillTargets, allBuiltInsList) => {
  if (process.env.BABEL_ENV === "test") {
    filename = filename.replace(/\\/g, "/");
  }

  if (!polyfills.size) {
    console.log(`\n[${filename}] Based on your code and targets, core-js polyfills were not added.`);
    return;
  }

  console.log(`\n[${filename}] Added following core-js polyfill${wordEnds(polyfills.size)}:`);

  for (const polyfill of polyfills) {
    logPluginOrPolyfill(polyfill, polyfillTargets, allBuiltInsList);
  }
};

exports.logUsagePolyfills = logUsagePolyfills;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013841, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
const defaultExcludesForLooseMode = ["transform-typeof-symbol"];

function _default({
  loose
}) {
  return loose ? defaultExcludesForLooseMode : null;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013842, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeUnnecessaryItems = removeUnnecessaryItems;

function removeUnnecessaryItems(items, overlapping) {
  items.forEach(item => {
    var _overlapping$item;

    (_overlapping$item = overlapping[item]) == null ? void 0 : _overlapping$item.forEach(name => items.delete(name));
  });
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013843, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  auto: "transform-modules-commonjs",
  amd: "transform-modules-amd",
  commonjs: "transform-modules-commonjs",
  cjs: "transform-modules-commonjs",
  systemjs: "transform-modules-systemjs",
  umd: "transform-modules-umd"
};
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013844, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeCoreJSOption = normalizeCoreJSOption;
exports.default = normalizeOptions;
exports.validateUseBuiltInsOption = exports.validateModulesOption = exports.checkDuplicateIncludeExcludes = exports.normalizePluginName = void 0;

var _data = _interopRequireDefault(require("core-js-compat/data"));

var _semver = require("semver");

var _corejs2BuiltIns = _interopRequireDefault(require("@babel/compat-data/corejs2-built-ins"));

var _pluginsCompatData = require("./plugins-compat-data");

var _moduleTransformations = _interopRequireDefault(require("./module-transformations"));

var _options = require("./options");

var _helperValidatorOption = require("@babel/helper-validator-option");

var _getPlatformSpecificDefault = require("./polyfills/corejs2/get-platform-specific-default");

var _package = require("../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v = new _helperValidatorOption.OptionValidator(_package.name);
const allPluginsList = Object.keys(_pluginsCompatData.plugins);
const modulePlugins = ["proposal-dynamic-import", ...Object.keys(_moduleTransformations.default).map(m => _moduleTransformations.default[m])];

const getValidIncludesAndExcludes = (type, corejs) => new Set([...allPluginsList, ...(type === "exclude" ? modulePlugins : []), ...(corejs ? corejs == 2 ? [...Object.keys(_corejs2BuiltIns.default), ..._getPlatformSpecificDefault.defaultWebIncludes] : Object.keys(_data.default) : [])]);

const pluginToRegExp = plugin => {
  if (plugin instanceof RegExp) return plugin;

  try {
    return new RegExp(`^${normalizePluginName(plugin)}$`);
  } catch (e) {
    return null;
  }
};

const selectPlugins = (regexp, type, corejs) => Array.from(getValidIncludesAndExcludes(type, corejs)).filter(item => regexp instanceof RegExp && regexp.test(item));

const flatten = array => [].concat(...array);

const expandIncludesAndExcludes = (plugins = [], type, corejs) => {
  if (plugins.length === 0) return [];
  const selectedPlugins = plugins.map(plugin => selectPlugins(pluginToRegExp(plugin), type, corejs));
  const invalidRegExpList = plugins.filter((p, i) => selectedPlugins[i].length === 0);
  v.invariant(invalidRegExpList.length === 0, `The plugins/built-ins '${invalidRegExpList.join(", ")}' passed to the '${type}' option are not
    valid. Please check data/[plugin-features|built-in-features].js in babel-preset-env`);
  return flatten(selectedPlugins);
};

const normalizePluginName = plugin => plugin.replace(/^(@babel\/|babel-)(plugin-)?/, "");

exports.normalizePluginName = normalizePluginName;

const checkDuplicateIncludeExcludes = (include = [], exclude = []) => {
  const duplicates = include.filter(opt => exclude.indexOf(opt) >= 0);
  v.invariant(duplicates.length === 0, `The plugins/built-ins '${duplicates.join(", ")}' were found in both the "include" and
    "exclude" options.`);
};

exports.checkDuplicateIncludeExcludes = checkDuplicateIncludeExcludes;

const normalizeTargets = targets => {
  if (typeof targets === "string" || Array.isArray(targets)) {
    return {
      browsers: targets
    };
  }

  return Object.assign({}, targets);
};

const validateModulesOption = (modulesOpt = _options.ModulesOption.auto) => {
  v.invariant(_options.ModulesOption[modulesOpt.toString()] || modulesOpt === _options.ModulesOption.false, `The 'modules' option must be one of \n` + ` - 'false' to indicate no module processing\n` + ` - a specific module type: 'commonjs', 'amd', 'umd', 'systemjs'` + ` - 'auto' (default) which will automatically select 'false' if the current\n` + `   process is known to support ES module syntax, or "commonjs" otherwise\n`);
  return modulesOpt;
};

exports.validateModulesOption = validateModulesOption;

const validateUseBuiltInsOption = (builtInsOpt = false) => {
  v.invariant(_options.UseBuiltInsOption[builtInsOpt.toString()] || builtInsOpt === _options.UseBuiltInsOption.false, `The 'useBuiltIns' option must be either
    'false' (default) to indicate no polyfill,
    '"entry"' to indicate replacing the entry polyfill, or
    '"usage"' to import only used polyfills per file`);
  return builtInsOpt;
};

exports.validateUseBuiltInsOption = validateUseBuiltInsOption;

function normalizeCoreJSOption(corejs, useBuiltIns) {
  let proposals = false;
  let rawVersion;

  if (useBuiltIns && corejs === undefined) {
    rawVersion = 2;
    console.warn("\nWARNING: We noticed you're using the `useBuiltIns` option without declaring a " + "core-js version. Currently, we assume version 2.x when no version " + "is passed. Since this default version will likely change in future " + "versions of Babel, we recommend explicitly setting the core-js version " + "you are using via the `corejs` option.\n" + "\nYou should also be sure that the version you pass to the `corejs` " + "option matches the version specified in your `package.json`'s " + "`dependencies` section. If it doesn't, you need to run one of the " + "following commands:\n\n" + "  npm install --save core-js@2    npm install --save core-js@3\n" + "  yarn add core-js@2              yarn add core-js@3\n");
  } else if (typeof corejs === "object" && corejs !== null) {
    rawVersion = corejs.version;
    proposals = Boolean(corejs.proposals);
  } else {
    rawVersion = corejs;
  }

  const version = rawVersion ? (0, _semver.coerce)(String(rawVersion)) : false;

  if (!useBuiltIns && version) {
    console.log("\nThe `corejs` option only has an effect when the `useBuiltIns` option is not `false`\n");
  }

  if (useBuiltIns && (!version || version.major < 2 || version.major > 3)) {
    throw new RangeError("Invalid Option: The version passed to `corejs` is invalid. Currently, " + "only core-js@2 and core-js@3 are supported.");
  }

  return {
    version,
    proposals
  };
}

function normalizeOptions(opts) {
  v.validateTopLevelOptions(opts, _options.TopLevelOptions);
  const useBuiltIns = validateUseBuiltInsOption(opts.useBuiltIns);
  const corejs = normalizeCoreJSOption(opts.corejs, useBuiltIns);
  const include = expandIncludesAndExcludes(opts.include, _options.TopLevelOptions.include, !!corejs.version && corejs.version.major);
  const exclude = expandIncludesAndExcludes(opts.exclude, _options.TopLevelOptions.exclude, !!corejs.version && corejs.version.major);
  checkDuplicateIncludeExcludes(include, exclude);
  return {
    bugfixes: v.validateBooleanOption(_options.TopLevelOptions.bugfixes, opts.bugfixes, false),
    configPath: v.validateStringOption(_options.TopLevelOptions.configPath, opts.configPath, process.cwd()),
    corejs,
    debug: v.validateBooleanOption(_options.TopLevelOptions.debug, opts.debug, false),
    include,
    exclude,
    forceAllTransforms: v.validateBooleanOption(_options.TopLevelOptions.forceAllTransforms, opts.forceAllTransforms, false),
    ignoreBrowserslistConfig: v.validateBooleanOption(_options.TopLevelOptions.ignoreBrowserslistConfig, opts.ignoreBrowserslistConfig, false),
    loose: v.validateBooleanOption(_options.TopLevelOptions.loose, opts.loose, false),
    modules: validateModulesOption(opts.modules),
    shippedProposals: v.validateBooleanOption(_options.TopLevelOptions.shippedProposals, opts.shippedProposals, false),
    spec: v.validateBooleanOption(_options.TopLevelOptions.spec, opts.spec, false),
    targets: normalizeTargets(opts.targets),
    useBuiltIns: useBuiltIns,
    browserslistEnv: v.validateStringOption(_options.TopLevelOptions.browserslistEnv, opts.browserslistEnv)
  };
}
}, function(modId) { var map = {"./plugins-compat-data":1679975013845,"./module-transformations":1679975013843,"./options":1679975013847,"./polyfills/corejs2/get-platform-specific-default":1679975013848,"../package.json":1679975013849}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013845, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginsBugfixes = exports.plugins = void 0;

var _plugins = _interopRequireDefault(require("@babel/compat-data/plugins"));

var _pluginBugfixes = _interopRequireDefault(require("@babel/compat-data/plugin-bugfixes"));

var _availablePlugins = _interopRequireDefault(require("./available-plugins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginsFiltered = {};
exports.plugins = pluginsFiltered;
const bugfixPluginsFiltered = {};
exports.pluginsBugfixes = bugfixPluginsFiltered;

for (const plugin of Object.keys(_plugins.default)) {
  if (Object.hasOwnProperty.call(_availablePlugins.default, plugin)) {
    pluginsFiltered[plugin] = _plugins.default[plugin];
  }
}

for (const plugin of Object.keys(_pluginBugfixes.default)) {
  if (Object.hasOwnProperty.call(_availablePlugins.default, plugin)) {
    bugfixPluginsFiltered[plugin] = _pluginBugfixes.default[plugin];
  }
}

pluginsFiltered["proposal-class-properties"] = pluginsFiltered["proposal-private-methods"];
}, function(modId) { var map = {"./available-plugins":1679975013846}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013846, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pluginSyntaxAsyncGenerators = _interopRequireDefault(require("@babel/plugin-syntax-async-generators"));

var _pluginSyntaxClassProperties = _interopRequireDefault(require("@babel/plugin-syntax-class-properties"));

var _pluginSyntaxDynamicImport = _interopRequireDefault(require("@babel/plugin-syntax-dynamic-import"));

var _pluginSyntaxExportNamespaceFrom = _interopRequireDefault(require("@babel/plugin-syntax-export-namespace-from"));

var _pluginSyntaxJsonStrings = _interopRequireDefault(require("@babel/plugin-syntax-json-strings"));

var _pluginSyntaxLogicalAssignmentOperators = _interopRequireDefault(require("@babel/plugin-syntax-logical-assignment-operators"));

var _pluginSyntaxNullishCoalescingOperator = _interopRequireDefault(require("@babel/plugin-syntax-nullish-coalescing-operator"));

var _pluginSyntaxNumericSeparator = _interopRequireDefault(require("@babel/plugin-syntax-numeric-separator"));

var _pluginSyntaxObjectRestSpread = _interopRequireDefault(require("@babel/plugin-syntax-object-rest-spread"));

var _pluginSyntaxOptionalCatchBinding = _interopRequireDefault(require("@babel/plugin-syntax-optional-catch-binding"));

var _pluginSyntaxOptionalChaining = _interopRequireDefault(require("@babel/plugin-syntax-optional-chaining"));

var _pluginSyntaxTopLevelAwait = _interopRequireDefault(require("@babel/plugin-syntax-top-level-await"));

var _pluginProposalAsyncGeneratorFunctions = _interopRequireDefault(require("@babel/plugin-proposal-async-generator-functions"));

var _pluginProposalClassProperties = _interopRequireDefault(require("@babel/plugin-proposal-class-properties"));

var _pluginProposalDynamicImport = _interopRequireDefault(require("@babel/plugin-proposal-dynamic-import"));

var _pluginProposalExportNamespaceFrom = _interopRequireDefault(require("@babel/plugin-proposal-export-namespace-from"));

var _pluginProposalJsonStrings = _interopRequireDefault(require("@babel/plugin-proposal-json-strings"));

var _pluginProposalLogicalAssignmentOperators = _interopRequireDefault(require("@babel/plugin-proposal-logical-assignment-operators"));

var _pluginProposalNullishCoalescingOperator = _interopRequireDefault(require("@babel/plugin-proposal-nullish-coalescing-operator"));

var _pluginProposalNumericSeparator = _interopRequireDefault(require("@babel/plugin-proposal-numeric-separator"));

var _pluginProposalObjectRestSpread = _interopRequireDefault(require("@babel/plugin-proposal-object-rest-spread"));

var _pluginProposalOptionalCatchBinding = _interopRequireDefault(require("@babel/plugin-proposal-optional-catch-binding"));

var _pluginProposalOptionalChaining = _interopRequireDefault(require("@babel/plugin-proposal-optional-chaining"));

var _pluginProposalPrivateMethods = _interopRequireDefault(require("@babel/plugin-proposal-private-methods"));

var _pluginProposalUnicodePropertyRegex = _interopRequireDefault(require("@babel/plugin-proposal-unicode-property-regex"));

var _pluginTransformAsyncToGenerator = _interopRequireDefault(require("@babel/plugin-transform-async-to-generator"));

var _pluginTransformArrowFunctions = _interopRequireDefault(require("@babel/plugin-transform-arrow-functions"));

var _pluginTransformBlockScopedFunctions = _interopRequireDefault(require("@babel/plugin-transform-block-scoped-functions"));

var _pluginTransformBlockScoping = _interopRequireDefault(require("@babel/plugin-transform-block-scoping"));

var _pluginTransformClasses = _interopRequireDefault(require("@babel/plugin-transform-classes"));

var _pluginTransformComputedProperties = _interopRequireDefault(require("@babel/plugin-transform-computed-properties"));

var _pluginTransformDestructuring = _interopRequireDefault(require("@babel/plugin-transform-destructuring"));

var _pluginTransformDotallRegex = _interopRequireDefault(require("@babel/plugin-transform-dotall-regex"));

var _pluginTransformDuplicateKeys = _interopRequireDefault(require("@babel/plugin-transform-duplicate-keys"));

var _pluginTransformExponentiationOperator = _interopRequireDefault(require("@babel/plugin-transform-exponentiation-operator"));

var _pluginTransformForOf = _interopRequireDefault(require("@babel/plugin-transform-for-of"));

var _pluginTransformFunctionName = _interopRequireDefault(require("@babel/plugin-transform-function-name"));

var _pluginTransformLiterals = _interopRequireDefault(require("@babel/plugin-transform-literals"));

var _pluginTransformMemberExpressionLiterals = _interopRequireDefault(require("@babel/plugin-transform-member-expression-literals"));

var _pluginTransformModulesAmd = _interopRequireDefault(require("@babel/plugin-transform-modules-amd"));

var _pluginTransformModulesCommonjs = _interopRequireDefault(require("@babel/plugin-transform-modules-commonjs"));

var _pluginTransformModulesSystemjs = _interopRequireDefault(require("@babel/plugin-transform-modules-systemjs"));

var _pluginTransformModulesUmd = _interopRequireDefault(require("@babel/plugin-transform-modules-umd"));

var _pluginTransformNamedCapturingGroupsRegex = _interopRequireDefault(require("@babel/plugin-transform-named-capturing-groups-regex"));

var _pluginTransformNewTarget = _interopRequireDefault(require("@babel/plugin-transform-new-target"));

var _pluginTransformObjectSuper = _interopRequireDefault(require("@babel/plugin-transform-object-super"));

var _pluginTransformParameters = _interopRequireDefault(require("@babel/plugin-transform-parameters"));

var _pluginTransformPropertyLiterals = _interopRequireDefault(require("@babel/plugin-transform-property-literals"));

var _pluginTransformRegenerator = _interopRequireDefault(require("@babel/plugin-transform-regenerator"));

var _pluginTransformReservedWords = _interopRequireDefault(require("@babel/plugin-transform-reserved-words"));

var _pluginTransformShorthandProperties = _interopRequireDefault(require("@babel/plugin-transform-shorthand-properties"));

var _pluginTransformSpread = _interopRequireDefault(require("@babel/plugin-transform-spread"));

var _pluginTransformStickyRegex = _interopRequireDefault(require("@babel/plugin-transform-sticky-regex"));

var _pluginTransformTemplateLiterals = _interopRequireDefault(require("@babel/plugin-transform-template-literals"));

var _pluginTransformTypeofSymbol = _interopRequireDefault(require("@babel/plugin-transform-typeof-symbol"));

var _pluginTransformUnicodeEscapes = _interopRequireDefault(require("@babel/plugin-transform-unicode-escapes"));

var _pluginTransformUnicodeRegex = _interopRequireDefault(require("@babel/plugin-transform-unicode-regex"));

var _transformAsyncArrowsInClass = _interopRequireDefault(require("@babel/preset-modules/lib/plugins/transform-async-arrows-in-class"));

var _transformEdgeDefaultParameters = _interopRequireDefault(require("@babel/preset-modules/lib/plugins/transform-edge-default-parameters"));

var _transformEdgeFunctionName = _interopRequireDefault(require("@babel/preset-modules/lib/plugins/transform-edge-function-name"));

var _transformTaggedTemplateCaching = _interopRequireDefault(require("@babel/preset-modules/lib/plugins/transform-tagged-template-caching"));

var _transformSafariBlockShadowing = _interopRequireDefault(require("@babel/preset-modules/lib/plugins/transform-safari-block-shadowing"));

var _transformSafariForShadowing = _interopRequireDefault(require("@babel/preset-modules/lib/plugins/transform-safari-for-shadowing"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  "bugfix/transform-async-arrows-in-class": _transformAsyncArrowsInClass.default,
  "bugfix/transform-edge-default-parameters": _transformEdgeDefaultParameters.default,
  "bugfix/transform-edge-function-name": _transformEdgeFunctionName.default,
  "bugfix/transform-safari-block-shadowing": _transformSafariBlockShadowing.default,
  "bugfix/transform-safari-for-shadowing": _transformSafariForShadowing.default,
  "bugfix/transform-tagged-template-caching": _transformTaggedTemplateCaching.default,
  "proposal-async-generator-functions": _pluginProposalAsyncGeneratorFunctions.default,
  "proposal-class-properties": _pluginProposalClassProperties.default,
  "proposal-dynamic-import": _pluginProposalDynamicImport.default,
  "proposal-export-namespace-from": _pluginProposalExportNamespaceFrom.default,
  "proposal-json-strings": _pluginProposalJsonStrings.default,
  "proposal-logical-assignment-operators": _pluginProposalLogicalAssignmentOperators.default,
  "proposal-nullish-coalescing-operator": _pluginProposalNullishCoalescingOperator.default,
  "proposal-numeric-separator": _pluginProposalNumericSeparator.default,
  "proposal-object-rest-spread": _pluginProposalObjectRestSpread.default,
  "proposal-optional-catch-binding": _pluginProposalOptionalCatchBinding.default,
  "proposal-optional-chaining": _pluginProposalOptionalChaining.default,
  "proposal-private-methods": _pluginProposalPrivateMethods.default,
  "proposal-unicode-property-regex": _pluginProposalUnicodePropertyRegex.default,
  "syntax-async-generators": _pluginSyntaxAsyncGenerators.default,
  "syntax-class-properties": _pluginSyntaxClassProperties.default,
  "syntax-dynamic-import": _pluginSyntaxDynamicImport.default,
  "syntax-export-namespace-from": _pluginSyntaxExportNamespaceFrom.default,
  "syntax-json-strings": _pluginSyntaxJsonStrings.default,
  "syntax-logical-assignment-operators": _pluginSyntaxLogicalAssignmentOperators.default,
  "syntax-nullish-coalescing-operator": _pluginSyntaxNullishCoalescingOperator.default,
  "syntax-numeric-separator": _pluginSyntaxNumericSeparator.default,
  "syntax-object-rest-spread": _pluginSyntaxObjectRestSpread.default,
  "syntax-optional-catch-binding": _pluginSyntaxOptionalCatchBinding.default,
  "syntax-optional-chaining": _pluginSyntaxOptionalChaining.default,
  "syntax-top-level-await": _pluginSyntaxTopLevelAwait.default,
  "transform-arrow-functions": _pluginTransformArrowFunctions.default,
  "transform-async-to-generator": _pluginTransformAsyncToGenerator.default,
  "transform-block-scoped-functions": _pluginTransformBlockScopedFunctions.default,
  "transform-block-scoping": _pluginTransformBlockScoping.default,
  "transform-classes": _pluginTransformClasses.default,
  "transform-computed-properties": _pluginTransformComputedProperties.default,
  "transform-destructuring": _pluginTransformDestructuring.default,
  "transform-dotall-regex": _pluginTransformDotallRegex.default,
  "transform-duplicate-keys": _pluginTransformDuplicateKeys.default,
  "transform-exponentiation-operator": _pluginTransformExponentiationOperator.default,
  "transform-for-of": _pluginTransformForOf.default,
  "transform-function-name": _pluginTransformFunctionName.default,
  "transform-literals": _pluginTransformLiterals.default,
  "transform-member-expression-literals": _pluginTransformMemberExpressionLiterals.default,
  "transform-modules-amd": _pluginTransformModulesAmd.default,
  "transform-modules-commonjs": _pluginTransformModulesCommonjs.default,
  "transform-modules-systemjs": _pluginTransformModulesSystemjs.default,
  "transform-modules-umd": _pluginTransformModulesUmd.default,
  "transform-named-capturing-groups-regex": _pluginTransformNamedCapturingGroupsRegex.default,
  "transform-new-target": _pluginTransformNewTarget.default,
  "transform-object-super": _pluginTransformObjectSuper.default,
  "transform-parameters": _pluginTransformParameters.default,
  "transform-property-literals": _pluginTransformPropertyLiterals.default,
  "transform-regenerator": _pluginTransformRegenerator.default,
  "transform-reserved-words": _pluginTransformReservedWords.default,
  "transform-shorthand-properties": _pluginTransformShorthandProperties.default,
  "transform-spread": _pluginTransformSpread.default,
  "transform-sticky-regex": _pluginTransformStickyRegex.default,
  "transform-template-literals": _pluginTransformTemplateLiterals.default,
  "transform-typeof-symbol": _pluginTransformTypeofSymbol.default,
  "transform-unicode-escapes": _pluginTransformUnicodeEscapes.default,
  "transform-unicode-regex": _pluginTransformUnicodeRegex.default
};
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013847, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseBuiltInsOption = exports.ModulesOption = exports.TopLevelOptions = void 0;
const TopLevelOptions = {
  bugfixes: "bugfixes",
  configPath: "configPath",
  corejs: "corejs",
  debug: "debug",
  exclude: "exclude",
  forceAllTransforms: "forceAllTransforms",
  ignoreBrowserslistConfig: "ignoreBrowserslistConfig",
  include: "include",
  loose: "loose",
  modules: "modules",
  shippedProposals: "shippedProposals",
  spec: "spec",
  targets: "targets",
  useBuiltIns: "useBuiltIns",
  browserslistEnv: "browserslistEnv"
};
exports.TopLevelOptions = TopLevelOptions;
const ModulesOption = {
  false: false,
  auto: "auto",
  amd: "amd",
  commonjs: "commonjs",
  cjs: "cjs",
  systemjs: "systemjs",
  umd: "umd"
};
exports.ModulesOption = ModulesOption;
const UseBuiltInsOption = {
  false: false,
  entry: "entry",
  usage: "usage"
};
exports.UseBuiltInsOption = UseBuiltInsOption;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013848, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.defaultWebIncludes = void 0;
const defaultWebIncludes = ["web.timers", "web.immediate", "web.dom.iterable"];
exports.defaultWebIncludes = defaultWebIncludes;

function _default(targets) {
  const targetNames = Object.keys(targets);
  const isAnyTarget = !targetNames.length;
  const isWebTarget = targetNames.some(name => name !== "node");
  return isAnyTarget || isWebTarget ? defaultWebIncludes : null;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013849, function(require, module, exports) {
module.exports = {
  "name": "@babel/preset-env",
  "version": "7.12.1",
  "description": "A Babel preset for each environment.",
  "author": "Henry Zhu <hi@henryzoo.com>",
  "homepage": "https://babeljs.io/",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/babel/babel.git",
    "directory": "packages/babel-preset-env"
  },
  "main": "lib/index.js",
  "dependencies": {
    "@babel/compat-data": "^7.12.1",
    "@babel/helper-compilation-targets": "^7.12.1",
    "@babel/helper-module-imports": "^7.12.1",
    "@babel/helper-plugin-utils": "^7.10.4",
    "@babel/helper-validator-option": "^7.12.1",
    "@babel/plugin-proposal-async-generator-functions": "^7.12.1",
    "@babel/plugin-proposal-class-properties": "^7.12.1",
    "@babel/plugin-proposal-dynamic-import": "^7.12.1",
    "@babel/plugin-proposal-export-namespace-from": "^7.12.1",
    "@babel/plugin-proposal-json-strings": "^7.12.1",
    "@babel/plugin-proposal-logical-assignment-operators": "^7.12.1",
    "@babel/plugin-proposal-nullish-coalescing-operator": "^7.12.1",
    "@babel/plugin-proposal-numeric-separator": "^7.12.1",
    "@babel/plugin-proposal-object-rest-spread": "^7.12.1",
    "@babel/plugin-proposal-optional-catch-binding": "^7.12.1",
    "@babel/plugin-proposal-optional-chaining": "^7.12.1",
    "@babel/plugin-proposal-private-methods": "^7.12.1",
    "@babel/plugin-proposal-unicode-property-regex": "^7.12.1",
    "@babel/plugin-syntax-async-generators": "^7.8.0",
    "@babel/plugin-syntax-class-properties": "^7.12.1",
    "@babel/plugin-syntax-dynamic-import": "^7.8.0",
    "@babel/plugin-syntax-export-namespace-from": "^7.8.3",
    "@babel/plugin-syntax-json-strings": "^7.8.0",
    "@babel/plugin-syntax-logical-assignment-operators": "^7.10.4",
    "@babel/plugin-syntax-nullish-coalescing-operator": "^7.8.0",
    "@babel/plugin-syntax-numeric-separator": "^7.10.4",
    "@babel/plugin-syntax-object-rest-spread": "^7.8.0",
    "@babel/plugin-syntax-optional-catch-binding": "^7.8.0",
    "@babel/plugin-syntax-optional-chaining": "^7.8.0",
    "@babel/plugin-syntax-top-level-await": "^7.12.1",
    "@babel/plugin-transform-arrow-functions": "^7.12.1",
    "@babel/plugin-transform-async-to-generator": "^7.12.1",
    "@babel/plugin-transform-block-scoped-functions": "^7.12.1",
    "@babel/plugin-transform-block-scoping": "^7.12.1",
    "@babel/plugin-transform-classes": "^7.12.1",
    "@babel/plugin-transform-computed-properties": "^7.12.1",
    "@babel/plugin-transform-destructuring": "^7.12.1",
    "@babel/plugin-transform-dotall-regex": "^7.12.1",
    "@babel/plugin-transform-duplicate-keys": "^7.12.1",
    "@babel/plugin-transform-exponentiation-operator": "^7.12.1",
    "@babel/plugin-transform-for-of": "^7.12.1",
    "@babel/plugin-transform-function-name": "^7.12.1",
    "@babel/plugin-transform-literals": "^7.12.1",
    "@babel/plugin-transform-member-expression-literals": "^7.12.1",
    "@babel/plugin-transform-modules-amd": "^7.12.1",
    "@babel/plugin-transform-modules-commonjs": "^7.12.1",
    "@babel/plugin-transform-modules-systemjs": "^7.12.1",
    "@babel/plugin-transform-modules-umd": "^7.12.1",
    "@babel/plugin-transform-named-capturing-groups-regex": "^7.12.1",
    "@babel/plugin-transform-new-target": "^7.12.1",
    "@babel/plugin-transform-object-super": "^7.12.1",
    "@babel/plugin-transform-parameters": "^7.12.1",
    "@babel/plugin-transform-property-literals": "^7.12.1",
    "@babel/plugin-transform-regenerator": "^7.12.1",
    "@babel/plugin-transform-reserved-words": "^7.12.1",
    "@babel/plugin-transform-shorthand-properties": "^7.12.1",
    "@babel/plugin-transform-spread": "^7.12.1",
    "@babel/plugin-transform-sticky-regex": "^7.12.1",
    "@babel/plugin-transform-template-literals": "^7.12.1",
    "@babel/plugin-transform-typeof-symbol": "^7.12.1",
    "@babel/plugin-transform-unicode-escapes": "^7.12.1",
    "@babel/plugin-transform-unicode-regex": "^7.12.1",
    "@babel/preset-modules": "^0.1.3",
    "@babel/types": "^7.12.1",
    "core-js-compat": "^3.6.2",
    "semver": "^5.5.0"
  },
  "peerDependencies": {
    "@babel/core": "^7.0.0-0"
  },
  "devDependencies": {
    "@babel/core": "^7.12.1",
    "@babel/helper-plugin-test-runner": "7.10.4",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0"
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013850, function(require, module, exports) {
/* eslint sort-keys: "error" */
// These mappings represent the syntax proposals that have been
// shipped by browsers, and are enabled by the `shippedProposals` option.

const proposalPlugins = new Set([
  "proposal-class-properties",
  "proposal-private-methods"
]);

// use intermediary object to enforce alphabetical key order
const pluginSyntaxObject = {
  "proposal-async-generator-functions": "syntax-async-generators",
  "proposal-class-properties": "syntax-class-properties",
  "proposal-json-strings": "syntax-json-strings",
  "proposal-nullish-coalescing-operator": "syntax-nullish-coalescing-operator",
  "proposal-numeric-separator": "syntax-numeric-separator",
  "proposal-object-rest-spread": "syntax-object-rest-spread",
  "proposal-optional-catch-binding": "syntax-optional-catch-binding",
  "proposal-optional-chaining": "syntax-optional-chaining",
  // note: we don't have syntax-private-methods
  "proposal-private-methods": "syntax-class-properties",
  "proposal-unicode-property-regex": null,
};

const pluginSyntaxEntries = Object.keys(pluginSyntaxObject).map(function (key) {
  return [key, pluginSyntaxObject[key]];
});

const pluginSyntaxMap = new Map(pluginSyntaxEntries);

module.exports = { pluginSyntaxMap, proposalPlugins };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013851, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _corejs2BuiltIns = _interopRequireDefault(require("@babel/compat-data/corejs2-built-ins"));

var _helperCompilationTargets = require("@babel/helper-compilation-targets");

var _getPlatformSpecificDefault = _interopRequireDefault(require("./get-platform-specific-default"));

var _builtInDefinitions = require("./built-in-definitions");

var _utils = require("../../utils");

var _debug = require("../../debug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NO_DIRECT_POLYFILL_IMPORT = `
  When setting \`useBuiltIns: 'usage'\`, polyfills are automatically imported when needed.
  Please remove the \`import '@babel/polyfill'\` call or use \`useBuiltIns: 'entry'\` instead.`;

function _default({
  types: t
}, {
  include,
  exclude,
  polyfillTargets,
  debug
}) {
  const polyfills = (0, _helperCompilationTargets.filterItems)(_corejs2BuiltIns.default, include, exclude, polyfillTargets, (0, _getPlatformSpecificDefault.default)(polyfillTargets));
  const addAndRemovePolyfillImports = {
    ImportDeclaration(path) {
      if ((0, _utils.isPolyfillSource)((0, _utils.getImportSource)(path))) {
        console.warn(NO_DIRECT_POLYFILL_IMPORT);
        path.remove();
      }
    },

    Program(path) {
      path.get("body").forEach(bodyPath => {
        if ((0, _utils.isPolyfillSource)((0, _utils.getRequireSource)(bodyPath))) {
          console.warn(NO_DIRECT_POLYFILL_IMPORT);
          bodyPath.remove();
        }
      });
    },

    ReferencedIdentifier({
      node: {
        name
      },
      parent,
      scope
    }) {
      if (t.isMemberExpression(parent)) return;
      if (!(0, _utils.has)(_builtInDefinitions.BuiltIns, name)) return;
      if (scope.getBindingIdentifier(name)) return;
      const BuiltInDependencies = _builtInDefinitions.BuiltIns[name];
      this.addUnsupported(BuiltInDependencies);
    },

    CallExpression(path) {
      if (path.node.arguments.length) return;
      const callee = path.node.callee;
      if (!t.isMemberExpression(callee)) return;
      if (!callee.computed) return;

      if (!path.get("callee.property").matchesPattern("Symbol.iterator")) {
        return;
      }

      this.addImport("web.dom.iterable");
    },

    BinaryExpression(path) {
      if (path.node.operator !== "in") return;
      if (!path.get("left").matchesPattern("Symbol.iterator")) return;
      this.addImport("web.dom.iterable");
    },

    YieldExpression(path) {
      if (path.node.delegate) {
        this.addImport("web.dom.iterable");
      }
    },

    MemberExpression: {
      enter(path) {
        const {
          node
        } = path;
        const {
          object,
          property
        } = node;
        if ((0, _utils.isNamespaced)(path.get("object"))) return;
        let evaluatedPropType = object.name;
        let propertyName = "";
        let instanceType = "";

        if (node.computed) {
          if (t.isStringLiteral(property)) {
            propertyName = property.value;
          } else {
            const result = path.get("property").evaluate();

            if (result.confident && result.value) {
              propertyName = result.value;
            }
          }
        } else {
          propertyName = property.name;
        }

        if (path.scope.getBindingIdentifier(object.name)) {
          const result = path.get("object").evaluate();

          if (result.value) {
            instanceType = (0, _utils.getType)(result.value);
          } else if (result.deopt && result.deopt.isIdentifier()) {
            evaluatedPropType = result.deopt.node.name;
          }
        }

        if ((0, _utils.has)(_builtInDefinitions.StaticProperties, evaluatedPropType)) {
          const BuiltInProperties = _builtInDefinitions.StaticProperties[evaluatedPropType];

          if ((0, _utils.has)(BuiltInProperties, propertyName)) {
            const StaticPropertyDependencies = BuiltInProperties[propertyName];
            this.addUnsupported(StaticPropertyDependencies);
          }
        }

        if ((0, _utils.has)(_builtInDefinitions.InstanceProperties, propertyName)) {
          let InstancePropertyDependencies = _builtInDefinitions.InstanceProperties[propertyName];

          if (instanceType) {
            InstancePropertyDependencies = InstancePropertyDependencies.filter(module => module.includes(instanceType));
          }

          this.addUnsupported(InstancePropertyDependencies);
        }
      },

      exit(path) {
        const {
          name
        } = path.node.object;
        if (!(0, _utils.has)(_builtInDefinitions.BuiltIns, name)) return;
        if (path.scope.getBindingIdentifier(name)) return;
        const BuiltInDependencies = _builtInDefinitions.BuiltIns[name];
        this.addUnsupported(BuiltInDependencies);
      }

    },

    VariableDeclarator(path) {
      const {
        node
      } = path;
      const {
        id,
        init
      } = node;
      if (!t.isObjectPattern(id)) return;
      if (init && path.scope.getBindingIdentifier(init.name)) return;

      for (const {
        key
      } of id.properties) {
        if (!node.computed && t.isIdentifier(key) && (0, _utils.has)(_builtInDefinitions.InstanceProperties, key.name)) {
          const InstancePropertyDependencies = _builtInDefinitions.InstanceProperties[key.name];
          this.addUnsupported(InstancePropertyDependencies);
        }
      }
    }

  };
  return {
    name: "corejs2-usage",

    pre({
      path
    }) {
      this.polyfillsSet = new Set();

      this.addImport = function (builtIn) {
        if (!this.polyfillsSet.has(builtIn)) {
          this.polyfillsSet.add(builtIn);
          (0, _utils.createImport)(path, builtIn);
        }
      };

      this.addUnsupported = function (builtIn) {
        const modules = Array.isArray(builtIn) ? builtIn : [builtIn];

        for (const module of modules) {
          if (polyfills.has(module)) {
            this.addImport(module);
          }
        }
      };
    },

    post() {
      if (debug) {
        (0, _debug.logUsagePolyfills)(this.polyfillsSet, this.file.opts.filename, polyfillTargets, _corejs2BuiltIns.default);
      }
    },

    visitor: addAndRemovePolyfillImports
  };
}
}, function(modId) { var map = {"./get-platform-specific-default":1679975013848,"./built-in-definitions":1679975013852,"../../utils":1679975013853,"../../debug":1679975013840}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013852, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaticProperties = exports.InstanceProperties = exports.BuiltIns = void 0;
const ArrayNatureIterators = ["es6.object.to-string", "es6.array.iterator", "web.dom.iterable"];
const CommonIterators = ["es6.string.iterator", ...ArrayNatureIterators];
const PromiseDependencies = ["es6.object.to-string", "es6.promise"];
const BuiltIns = {
  DataView: "es6.typed.data-view",
  Float32Array: "es6.typed.float32-array",
  Float64Array: "es6.typed.float64-array",
  Int8Array: "es6.typed.int8-array",
  Int16Array: "es6.typed.int16-array",
  Int32Array: "es6.typed.int32-array",
  Map: ["es6.map", ...CommonIterators],
  Number: "es6.number.constructor",
  Promise: PromiseDependencies,
  RegExp: ["es6.regexp.constructor"],
  Set: ["es6.set", ...CommonIterators],
  Symbol: ["es6.symbol", "es7.symbol.async-iterator"],
  Uint8Array: "es6.typed.uint8-array",
  Uint8ClampedArray: "es6.typed.uint8-clamped-array",
  Uint16Array: "es6.typed.uint16-array",
  Uint32Array: "es6.typed.uint32-array",
  WeakMap: ["es6.weak-map", ...CommonIterators],
  WeakSet: ["es6.weak-set", ...CommonIterators]
};
exports.BuiltIns = BuiltIns;
const InstanceProperties = {
  __defineGetter__: ["es7.object.define-getter"],
  __defineSetter__: ["es7.object.define-setter"],
  __lookupGetter__: ["es7.object.lookup-getter"],
  __lookupSetter__: ["es7.object.lookup-setter"],
  anchor: ["es6.string.anchor"],
  big: ["es6.string.big"],
  bind: ["es6.function.bind"],
  blink: ["es6.string.blink"],
  bold: ["es6.string.bold"],
  codePointAt: ["es6.string.code-point-at"],
  copyWithin: ["es6.array.copy-within"],
  endsWith: ["es6.string.ends-with"],
  entries: ArrayNatureIterators,
  every: ["es6.array.is-array"],
  fill: ["es6.array.fill"],
  filter: ["es6.array.filter"],
  finally: ["es7.promise.finally", ...PromiseDependencies],
  find: ["es6.array.find"],
  findIndex: ["es6.array.find-index"],
  fixed: ["es6.string.fixed"],
  flags: ["es6.regexp.flags"],
  flatMap: ["es7.array.flat-map"],
  fontcolor: ["es6.string.fontcolor"],
  fontsize: ["es6.string.fontsize"],
  forEach: ["es6.array.for-each"],
  includes: ["es6.string.includes", "es7.array.includes"],
  indexOf: ["es6.array.index-of"],
  italics: ["es6.string.italics"],
  keys: ArrayNatureIterators,
  lastIndexOf: ["es6.array.last-index-of"],
  link: ["es6.string.link"],
  map: ["es6.array.map"],
  match: ["es6.regexp.match"],
  name: ["es6.function.name"],
  padStart: ["es7.string.pad-start"],
  padEnd: ["es7.string.pad-end"],
  reduce: ["es6.array.reduce"],
  reduceRight: ["es6.array.reduce-right"],
  repeat: ["es6.string.repeat"],
  replace: ["es6.regexp.replace"],
  search: ["es6.regexp.search"],
  slice: ["es6.array.slice"],
  small: ["es6.string.small"],
  some: ["es6.array.some"],
  sort: ["es6.array.sort"],
  split: ["es6.regexp.split"],
  startsWith: ["es6.string.starts-with"],
  strike: ["es6.string.strike"],
  sub: ["es6.string.sub"],
  sup: ["es6.string.sup"],
  toISOString: ["es6.date.to-iso-string"],
  toJSON: ["es6.date.to-json"],
  toString: ["es6.object.to-string", "es6.date.to-string", "es6.regexp.to-string"],
  trim: ["es6.string.trim"],
  trimEnd: ["es7.string.trim-right"],
  trimLeft: ["es7.string.trim-left"],
  trimRight: ["es7.string.trim-right"],
  trimStart: ["es7.string.trim-left"],
  values: ArrayNatureIterators
};
exports.InstanceProperties = InstanceProperties;
const StaticProperties = {
  Array: {
    from: ["es6.array.from", "es6.string.iterator"],
    isArray: "es6.array.is-array",
    of: "es6.array.of"
  },
  Date: {
    now: "es6.date.now"
  },
  Object: {
    assign: "es6.object.assign",
    create: "es6.object.create",
    defineProperty: "es6.object.define-property",
    defineProperties: "es6.object.define-properties",
    entries: "es7.object.entries",
    freeze: "es6.object.freeze",
    getOwnPropertyDescriptors: "es7.object.get-own-property-descriptors",
    getOwnPropertySymbols: "es6.symbol",
    is: "es6.object.is",
    isExtensible: "es6.object.is-extensible",
    isFrozen: "es6.object.is-frozen",
    isSealed: "es6.object.is-sealed",
    keys: "es6.object.keys",
    preventExtensions: "es6.object.prevent-extensions",
    seal: "es6.object.seal",
    setPrototypeOf: "es6.object.set-prototype-of",
    values: "es7.object.values"
  },
  Math: {
    acosh: "es6.math.acosh",
    asinh: "es6.math.asinh",
    atanh: "es6.math.atanh",
    cbrt: "es6.math.cbrt",
    clz32: "es6.math.clz32",
    cosh: "es6.math.cosh",
    expm1: "es6.math.expm1",
    fround: "es6.math.fround",
    hypot: "es6.math.hypot",
    imul: "es6.math.imul",
    log1p: "es6.math.log1p",
    log10: "es6.math.log10",
    log2: "es6.math.log2",
    sign: "es6.math.sign",
    sinh: "es6.math.sinh",
    tanh: "es6.math.tanh",
    trunc: "es6.math.trunc"
  },
  String: {
    fromCodePoint: "es6.string.from-code-point",
    raw: "es6.string.raw"
  },
  Number: {
    EPSILON: "es6.number.epsilon",
    MIN_SAFE_INTEGER: "es6.number.min-safe-integer",
    MAX_SAFE_INTEGER: "es6.number.max-safe-integer",
    isFinite: "es6.number.is-finite",
    isInteger: "es6.number.is-integer",
    isSafeInteger: "es6.number.is-safe-integer",
    isNaN: "es6.number.is-nan",
    parseFloat: "es6.number.parse-float",
    parseInt: "es6.number.parse-int"
  },
  Promise: {
    all: CommonIterators,
    race: CommonIterators
  },
  Reflect: {
    apply: "es6.reflect.apply",
    construct: "es6.reflect.construct",
    defineProperty: "es6.reflect.define-property",
    deleteProperty: "es6.reflect.delete-property",
    get: "es6.reflect.get",
    getOwnPropertyDescriptor: "es6.reflect.get-own-property-descriptor",
    getPrototypeOf: "es6.reflect.get-prototype-of",
    has: "es6.reflect.has",
    isExtensible: "es6.reflect.is-extensible",
    ownKeys: "es6.reflect.own-keys",
    preventExtensions: "es6.reflect.prevent-extensions",
    set: "es6.reflect.set",
    setPrototypeOf: "es6.reflect.set-prototype-of"
  }
};
exports.StaticProperties = StaticProperties;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013853, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.intersection = intersection;
exports.filterStageFromList = filterStageFromList;
exports.getImportSource = getImportSource;
exports.getRequireSource = getRequireSource;
exports.isPolyfillSource = isPolyfillSource;
exports.getModulePath = getModulePath;
exports.createImport = createImport;
exports.isNamespaced = isNamespaced;
exports.has = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _helperModuleImports = require("@babel/helper-module-imports");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const has = Object.hasOwnProperty.call.bind(Object.hasOwnProperty);
exports.has = has;

function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

function intersection(first, second, third) {
  const result = new Set();

  for (const el of first) {
    if (second.has(el) && third.has(el)) result.add(el);
  }

  return result;
}

function filterStageFromList(list, stageList) {
  return Object.keys(list).reduce((result, item) => {
    if (!stageList.has(item)) {
      result[item] = list[item];
    }

    return result;
  }, {});
}

function getImportSource({
  node
}) {
  if (node.specifiers.length === 0) return node.source.value;
}

function getRequireSource({
  node
}) {
  if (!t.isExpressionStatement(node)) return;
  const {
    expression
  } = node;
  const isRequire = t.isCallExpression(expression) && t.isIdentifier(expression.callee) && expression.callee.name === "require" && expression.arguments.length === 1 && t.isStringLiteral(expression.arguments[0]);
  if (isRequire) return expression.arguments[0].value;
}

function isPolyfillSource(source) {
  return source === "@babel/polyfill" || source === "core-js";
}

const modulePathMap = {
  "regenerator-runtime": "regenerator-runtime/runtime"
};

function getModulePath(mod) {
  return modulePathMap[mod] || `core-js/modules/${mod}`;
}

function createImport(path, mod) {
  return (0, _helperModuleImports.addSideEffect)(path, getModulePath(mod));
}

function isNamespaced(path) {
  if (!path.node) return false;
  const binding = path.scope.getBinding(path.node.name);
  if (!binding) return false;
  return binding.path.isImportNamespaceSpecifier();
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013854, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _data = _interopRequireDefault(require("core-js-compat/data"));

var _corejs3ShippedProposals = _interopRequireDefault(require("@babel/compat-data/corejs3-shipped-proposals"));

var _getModulesListForTargetVersion = _interopRequireDefault(require("core-js-compat/get-modules-list-for-target-version"));

var _helperCompilationTargets = require("@babel/helper-compilation-targets");

var _builtInDefinitions = require("./built-in-definitions");

var _utils = require("../../utils");

var _debug = require("../../debug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NO_DIRECT_POLYFILL_IMPORT = `
  When setting \`useBuiltIns: 'usage'\`, polyfills are automatically imported when needed.
  Please remove the direct import of \`core-js\` or use \`useBuiltIns: 'entry'\` instead.`;
const corejs3PolyfillsWithoutProposals = Object.keys(_data.default).filter(name => !name.startsWith("esnext.")).reduce((memo, key) => {
  memo[key] = _data.default[key];
  return memo;
}, {});

const corejs3PolyfillsWithShippedProposals = _corejs3ShippedProposals.default.reduce((memo, key) => {
  memo[key] = _data.default[key];
  return memo;
}, Object.assign({}, corejs3PolyfillsWithoutProposals));

function _default(_, {
  corejs,
  include,
  exclude,
  polyfillTargets,
  proposals,
  shippedProposals,
  debug
}) {
  const polyfills = (0, _helperCompilationTargets.filterItems)(proposals ? _data.default : shippedProposals ? corejs3PolyfillsWithShippedProposals : corejs3PolyfillsWithoutProposals, include, exclude, polyfillTargets, null);
  const available = new Set((0, _getModulesListForTargetVersion.default)(corejs.version));

  function resolveKey(path, computed) {
    const {
      node,
      parent,
      scope
    } = path;
    if (path.isStringLiteral()) return node.value;
    const {
      name
    } = node;
    const isIdentifier = path.isIdentifier();
    if (isIdentifier && !(computed || parent.computed)) return name;

    if (!isIdentifier || scope.getBindingIdentifier(name)) {
      const {
        value
      } = path.evaluate();
      if (typeof value === "string") return value;
    }
  }

  function resolveSource(path) {
    const {
      node,
      scope
    } = path;
    let builtIn, instanceType;

    if (node) {
      builtIn = node.name;

      if (!path.isIdentifier() || scope.getBindingIdentifier(builtIn)) {
        const {
          deopt,
          value
        } = path.evaluate();

        if (value !== undefined) {
          instanceType = (0, _utils.getType)(value);
        } else if (deopt == null ? void 0 : deopt.isIdentifier()) {
          builtIn = deopt.node.name;
        }
      }
    }

    return {
      builtIn,
      instanceType,
      isNamespaced: (0, _utils.isNamespaced)(path)
    };
  }

  const addAndRemovePolyfillImports = {
    ImportDeclaration(path) {
      if ((0, _utils.isPolyfillSource)((0, _utils.getImportSource)(path))) {
        console.warn(NO_DIRECT_POLYFILL_IMPORT);
        path.remove();
      }
    },

    Program: {
      enter(path) {
        path.get("body").forEach(bodyPath => {
          if ((0, _utils.isPolyfillSource)((0, _utils.getRequireSource)(bodyPath))) {
            console.warn(NO_DIRECT_POLYFILL_IMPORT);
            bodyPath.remove();
          }
        });
      },

      exit(path) {
        const filtered = (0, _utils.intersection)(polyfills, this.polyfillsSet, available);
        const reversed = Array.from(filtered).reverse();

        for (const module of reversed) {
          if (!this.injectedPolyfills.has(module)) {
            (0, _utils.createImport)(path, module);
          }
        }

        filtered.forEach(module => this.injectedPolyfills.add(module));
      }

    },

    Import() {
      this.addUnsupported(_builtInDefinitions.PromiseDependencies);
    },

    Function({
      node
    }) {
      if (node.async) {
        this.addUnsupported(_builtInDefinitions.PromiseDependencies);
      }
    },

    "ForOfStatement|ArrayPattern"() {
      this.addUnsupported(_builtInDefinitions.CommonIterators);
    },

    SpreadElement({
      parentPath
    }) {
      if (!parentPath.isObjectExpression()) {
        this.addUnsupported(_builtInDefinitions.CommonIterators);
      }
    },

    YieldExpression({
      node
    }) {
      if (node.delegate) {
        this.addUnsupported(_builtInDefinitions.CommonIterators);
      }
    },

    ReferencedIdentifier({
      node: {
        name
      },
      scope
    }) {
      if (scope.getBindingIdentifier(name)) return;
      this.addBuiltInDependencies(name);
    },

    MemberExpression(path) {
      const source = resolveSource(path.get("object"));
      const key = resolveKey(path.get("property"));
      this.addPropertyDependencies(source, key);
    },

    ObjectPattern(path) {
      const {
        parentPath,
        parent,
        key
      } = path;
      let source;

      if (parentPath.isVariableDeclarator()) {
        source = resolveSource(parentPath.get("init"));
      } else if (parentPath.isAssignmentExpression()) {
        source = resolveSource(parentPath.get("right"));
      } else if (parentPath.isFunctionExpression()) {
        const grand = parentPath.parentPath;

        if (grand.isCallExpression() || grand.isNewExpression()) {
          if (grand.node.callee === parent) {
            source = resolveSource(grand.get("arguments")[key]);
          }
        }
      }

      for (const property of path.get("properties")) {
        if (property.isObjectProperty()) {
          const key = resolveKey(property.get("key"));
          this.addPropertyDependencies(source, key);
        }
      }
    },

    BinaryExpression(path) {
      if (path.node.operator !== "in") return;
      const source = resolveSource(path.get("right"));
      const key = resolveKey(path.get("left"), true);
      this.addPropertyDependencies(source, key);
    }

  };
  return {
    name: "corejs3-usage",

    pre() {
      this.injectedPolyfills = new Set();
      this.polyfillsSet = new Set();

      this.addUnsupported = function (builtIn) {
        const modules = Array.isArray(builtIn) ? builtIn : [builtIn];

        for (const module of modules) {
          this.polyfillsSet.add(module);
        }
      };

      this.addBuiltInDependencies = function (builtIn) {
        if ((0, _utils.has)(_builtInDefinitions.BuiltIns, builtIn)) {
          const BuiltInDependencies = _builtInDefinitions.BuiltIns[builtIn];
          this.addUnsupported(BuiltInDependencies);
        }
      };

      this.addPropertyDependencies = function (source = {}, key) {
        const {
          builtIn,
          instanceType,
          isNamespaced
        } = source;
        if (isNamespaced) return;

        if (_builtInDefinitions.PossibleGlobalObjects.has(builtIn)) {
          this.addBuiltInDependencies(key);
        } else if ((0, _utils.has)(_builtInDefinitions.StaticProperties, builtIn)) {
          const BuiltInProperties = _builtInDefinitions.StaticProperties[builtIn];

          if ((0, _utils.has)(BuiltInProperties, key)) {
            const StaticPropertyDependencies = BuiltInProperties[key];
            return this.addUnsupported(StaticPropertyDependencies);
          }
        }

        if (!(0, _utils.has)(_builtInDefinitions.InstanceProperties, key)) return;
        let InstancePropertyDependencies = _builtInDefinitions.InstanceProperties[key];

        if (instanceType) {
          InstancePropertyDependencies = InstancePropertyDependencies.filter(m => m.includes(instanceType) || _builtInDefinitions.CommonInstanceDependencies.has(m));
        }

        this.addUnsupported(InstancePropertyDependencies);
      };
    },

    post() {
      if (debug) {
        (0, _debug.logUsagePolyfills)(this.injectedPolyfills, this.file.opts.filename, polyfillTargets, _data.default);
      }
    },

    visitor: addAndRemovePolyfillImports
  };
}
}, function(modId) { var map = {"./built-in-definitions":1679975013855,"../../utils":1679975013853,"../../debug":1679975013840}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013855, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PossibleGlobalObjects = exports.CommonInstanceDependencies = exports.StaticProperties = exports.InstanceProperties = exports.BuiltIns = exports.PromiseDependencies = exports.CommonIterators = void 0;
const ArrayNatureIterators = ["es.array.iterator", "web.dom-collections.iterator"];
const CommonIterators = ["es.string.iterator", ...ArrayNatureIterators];
exports.CommonIterators = CommonIterators;
const ArrayNatureIteratorsWithTag = ["es.object.to-string", ...ArrayNatureIterators];
const CommonIteratorsWithTag = ["es.object.to-string", ...CommonIterators];
const TypedArrayDependencies = ["es.typed-array.copy-within", "es.typed-array.every", "es.typed-array.fill", "es.typed-array.filter", "es.typed-array.find", "es.typed-array.find-index", "es.typed-array.for-each", "es.typed-array.includes", "es.typed-array.index-of", "es.typed-array.iterator", "es.typed-array.join", "es.typed-array.last-index-of", "es.typed-array.map", "es.typed-array.reduce", "es.typed-array.reduce-right", "es.typed-array.reverse", "es.typed-array.set", "es.typed-array.slice", "es.typed-array.some", "es.typed-array.sort", "es.typed-array.subarray", "es.typed-array.to-locale-string", "es.typed-array.to-string", "es.object.to-string", "es.array.iterator", "es.array-buffer.slice"];
const TypedArrayStaticMethods = {
  from: "es.typed-array.from",
  of: "es.typed-array.of"
};
const PromiseDependencies = ["es.promise", "es.object.to-string"];
exports.PromiseDependencies = PromiseDependencies;
const PromiseDependenciesWithIterators = [...PromiseDependencies, ...CommonIterators];
const SymbolDependencies = ["es.symbol", "es.symbol.description", "es.object.to-string"];
const MapDependencies = ["es.map", "esnext.map.delete-all", "esnext.map.every", "esnext.map.filter", "esnext.map.find", "esnext.map.find-key", "esnext.map.includes", "esnext.map.key-of", "esnext.map.map-keys", "esnext.map.map-values", "esnext.map.merge", "esnext.map.reduce", "esnext.map.some", "esnext.map.update", ...CommonIteratorsWithTag];
const SetDependencies = ["es.set", "esnext.set.add-all", "esnext.set.delete-all", "esnext.set.difference", "esnext.set.every", "esnext.set.filter", "esnext.set.find", "esnext.set.intersection", "esnext.set.is-disjoint-from", "esnext.set.is-subset-of", "esnext.set.is-superset-of", "esnext.set.join", "esnext.set.map", "esnext.set.reduce", "esnext.set.some", "esnext.set.symmetric-difference", "esnext.set.union", ...CommonIteratorsWithTag];
const WeakMapDependencies = ["es.weak-map", "esnext.weak-map.delete-all", ...CommonIteratorsWithTag];
const WeakSetDependencies = ["es.weak-set", "esnext.weak-set.add-all", "esnext.weak-set.delete-all", ...CommonIteratorsWithTag];
const URLSearchParamsDependencies = ["web.url", ...CommonIteratorsWithTag];
const BuiltIns = {
  AggregateError: ["esnext.aggregate-error", ...CommonIterators],
  ArrayBuffer: ["es.array-buffer.constructor", "es.array-buffer.slice", "es.object.to-string"],
  DataView: ["es.data-view", "es.array-buffer.slice", "es.object.to-string"],
  Date: ["es.date.to-string"],
  Float32Array: ["es.typed-array.float32-array", ...TypedArrayDependencies],
  Float64Array: ["es.typed-array.float64-array", ...TypedArrayDependencies],
  Int8Array: ["es.typed-array.int8-array", ...TypedArrayDependencies],
  Int16Array: ["es.typed-array.int16-array", ...TypedArrayDependencies],
  Int32Array: ["es.typed-array.int32-array", ...TypedArrayDependencies],
  Uint8Array: ["es.typed-array.uint8-array", ...TypedArrayDependencies],
  Uint8ClampedArray: ["es.typed-array.uint8-clamped-array", ...TypedArrayDependencies],
  Uint16Array: ["es.typed-array.uint16-array", ...TypedArrayDependencies],
  Uint32Array: ["es.typed-array.uint32-array", ...TypedArrayDependencies],
  Map: MapDependencies,
  Number: ["es.number.constructor"],
  Observable: ["esnext.observable", "esnext.symbol.observable", "es.object.to-string", ...CommonIteratorsWithTag],
  Promise: PromiseDependencies,
  RegExp: ["es.regexp.constructor", "es.regexp.exec", "es.regexp.to-string"],
  Set: SetDependencies,
  Symbol: SymbolDependencies,
  URL: ["web.url", ...URLSearchParamsDependencies],
  URLSearchParams: URLSearchParamsDependencies,
  WeakMap: WeakMapDependencies,
  WeakSet: WeakSetDependencies,
  clearImmediate: ["web.immediate"],
  compositeKey: ["esnext.composite-key"],
  compositeSymbol: ["esnext.composite-symbol", ...SymbolDependencies],
  fetch: PromiseDependencies,
  globalThis: ["es.global-this", "esnext.global-this"],
  parseFloat: ["es.parse-float"],
  parseInt: ["es.parse-int"],
  queueMicrotask: ["web.queue-microtask"],
  setTimeout: ["web.timers"],
  setInterval: ["web.timers"],
  setImmediate: ["web.immediate"]
};
exports.BuiltIns = BuiltIns;
const InstanceProperties = {
  at: ["esnext.string.at"],
  anchor: ["es.string.anchor"],
  big: ["es.string.big"],
  bind: ["es.function.bind"],
  blink: ["es.string.blink"],
  bold: ["es.string.bold"],
  codePointAt: ["es.string.code-point-at"],
  codePoints: ["esnext.string.code-points"],
  concat: ["es.array.concat"],
  copyWithin: ["es.array.copy-within"],
  description: ["es.symbol", "es.symbol.description"],
  endsWith: ["es.string.ends-with"],
  entries: ArrayNatureIteratorsWithTag,
  every: ["es.array.every"],
  exec: ["es.regexp.exec"],
  fill: ["es.array.fill"],
  filter: ["es.array.filter"],
  finally: ["es.promise.finally", ...PromiseDependencies],
  find: ["es.array.find"],
  findIndex: ["es.array.find-index"],
  fixed: ["es.string.fixed"],
  flags: ["es.regexp.flags"],
  flat: ["es.array.flat", "es.array.unscopables.flat"],
  flatMap: ["es.array.flat-map", "es.array.unscopables.flat-map"],
  fontcolor: ["es.string.fontcolor"],
  fontsize: ["es.string.fontsize"],
  forEach: ["es.array.for-each", "web.dom-collections.for-each"],
  includes: ["es.array.includes", "es.string.includes"],
  indexOf: ["es.array.index-of"],
  italics: ["es.string.italics"],
  join: ["es.array.join"],
  keys: ArrayNatureIteratorsWithTag,
  lastIndex: ["esnext.array.last-index"],
  lastIndexOf: ["es.array.last-index-of"],
  lastItem: ["esnext.array.last-item"],
  link: ["es.string.link"],
  match: ["es.string.match", "es.regexp.exec"],
  matchAll: ["es.string.match-all", "esnext.string.match-all"],
  map: ["es.array.map"],
  name: ["es.function.name"],
  padEnd: ["es.string.pad-end"],
  padStart: ["es.string.pad-start"],
  reduce: ["es.array.reduce"],
  reduceRight: ["es.array.reduce-right"],
  repeat: ["es.string.repeat"],
  replace: ["es.string.replace", "es.regexp.exec"],
  replaceAll: ["esnext.string.replace-all"],
  reverse: ["es.array.reverse"],
  search: ["es.string.search", "es.regexp.exec"],
  slice: ["es.array.slice"],
  small: ["es.string.small"],
  some: ["es.array.some"],
  sort: ["es.array.sort"],
  splice: ["es.array.splice"],
  split: ["es.string.split", "es.regexp.exec"],
  startsWith: ["es.string.starts-with"],
  strike: ["es.string.strike"],
  sub: ["es.string.sub"],
  sup: ["es.string.sup"],
  toFixed: ["es.number.to-fixed"],
  toISOString: ["es.date.to-iso-string"],
  toJSON: ["es.date.to-json", "web.url.to-json"],
  toPrecision: ["es.number.to-precision"],
  toString: ["es.object.to-string", "es.regexp.to-string", "es.date.to-string"],
  trim: ["es.string.trim"],
  trimEnd: ["es.string.trim-end"],
  trimLeft: ["es.string.trim-start"],
  trimRight: ["es.string.trim-end"],
  trimStart: ["es.string.trim-start"],
  values: ArrayNatureIteratorsWithTag,
  __defineGetter__: ["es.object.define-getter"],
  __defineSetter__: ["es.object.define-setter"],
  __lookupGetter__: ["es.object.lookup-getter"],
  __lookupSetter__: ["es.object.lookup-setter"]
};
exports.InstanceProperties = InstanceProperties;
const StaticProperties = {
  Array: {
    from: ["es.array.from", "es.string.iterator"],
    isArray: ["es.array.is-array"],
    of: ["es.array.of"]
  },
  Date: {
    now: "es.date.now"
  },
  Object: {
    assign: "es.object.assign",
    create: "es.object.create",
    defineProperty: "es.object.define-property",
    defineProperties: "es.object.define-properties",
    entries: "es.object.entries",
    freeze: "es.object.freeze",
    fromEntries: ["es.object.from-entries", "es.array.iterator"],
    getOwnPropertyDescriptor: "es.object.get-own-property-descriptor",
    getOwnPropertyDescriptors: "es.object.get-own-property-descriptors",
    getOwnPropertyNames: "es.object.get-own-property-names",
    getOwnPropertySymbols: "es.symbol",
    getPrototypeOf: "es.object.get-prototype-of",
    is: "es.object.is",
    isExtensible: "es.object.is-extensible",
    isFrozen: "es.object.is-frozen",
    isSealed: "es.object.is-sealed",
    keys: "es.object.keys",
    preventExtensions: "es.object.prevent-extensions",
    seal: "es.object.seal",
    setPrototypeOf: "es.object.set-prototype-of",
    values: "es.object.values"
  },
  Math: {
    DEG_PER_RAD: "esnext.math.deg-per-rad",
    RAD_PER_DEG: "esnext.math.rad-per-deg",
    acosh: "es.math.acosh",
    asinh: "es.math.asinh",
    atanh: "es.math.atanh",
    cbrt: "es.math.cbrt",
    clamp: "esnext.math.clamp",
    clz32: "es.math.clz32",
    cosh: "es.math.cosh",
    degrees: "esnext.math.degrees",
    expm1: "es.math.expm1",
    fround: "es.math.fround",
    fscale: "esnext.math.fscale",
    hypot: "es.math.hypot",
    iaddh: "esnext.math.iaddh",
    imul: "es.math.imul",
    imulh: "esnext.math.imulh",
    isubh: "esnext.math.isubh",
    log1p: "es.math.log1p",
    log10: "es.math.log10",
    log2: "es.math.log2",
    radians: "esnext.math.radians",
    scale: "esnext.math.scale",
    seededPRNG: "esnext.math.seeded-prng",
    sign: "es.math.sign",
    signbit: "esnext.math.signbit",
    sinh: "es.math.sinh",
    tanh: "es.math.tanh",
    trunc: "es.math.trunc",
    umulh: "esnext.math.umulh"
  },
  String: {
    fromCodePoint: "es.string.from-code-point",
    raw: "es.string.raw"
  },
  Number: {
    EPSILON: "es.number.epsilon",
    MIN_SAFE_INTEGER: "es.number.min-safe-integer",
    MAX_SAFE_INTEGER: "es.number.max-safe-integer",
    fromString: "esnext.number.from-string",
    isFinite: "es.number.is-finite",
    isInteger: "es.number.is-integer",
    isSafeInteger: "es.number.is-safe-integer",
    isNaN: "es.number.is-nan",
    parseFloat: "es.number.parse-float",
    parseInt: "es.number.parse-int"
  },
  Map: {
    from: ["esnext.map.from", ...MapDependencies],
    groupBy: ["esnext.map.group-by", ...MapDependencies],
    keyBy: ["esnext.map.key-by", ...MapDependencies],
    of: ["esnext.map.of", ...MapDependencies]
  },
  Set: {
    from: ["esnext.set.from", ...SetDependencies],
    of: ["esnext.set.of", ...SetDependencies]
  },
  WeakMap: {
    from: ["esnext.weak-map.from", ...WeakMapDependencies],
    of: ["esnext.weak-map.of", ...WeakMapDependencies]
  },
  WeakSet: {
    from: ["esnext.weak-set.from", ...WeakSetDependencies],
    of: ["esnext.weak-set.of", ...WeakSetDependencies]
  },
  Promise: {
    all: PromiseDependenciesWithIterators,
    allSettled: ["es.promise.all-settled", "esnext.promise.all-settled", ...PromiseDependenciesWithIterators],
    any: ["esnext.promise.any", "esnext.aggregate-error", ...PromiseDependenciesWithIterators],
    race: PromiseDependenciesWithIterators,
    try: ["esnext.promise.try", ...PromiseDependenciesWithIterators]
  },
  Reflect: {
    apply: "es.reflect.apply",
    construct: "es.reflect.construct",
    defineMetadata: "esnext.reflect.define-metadata",
    defineProperty: "es.reflect.define-property",
    deleteMetadata: "esnext.reflect.delete-metadata",
    deleteProperty: "es.reflect.delete-property",
    get: "es.reflect.get",
    getMetadata: "esnext.reflect.get-metadata",
    getMetadataKeys: "esnext.reflect.get-metadata-keys",
    getOwnMetadata: "esnext.reflect.get-own-metadata",
    getOwnMetadataKeys: "esnext.reflect.get-own-metadata-keys",
    getOwnPropertyDescriptor: "es.reflect.get-own-property-descriptor",
    getPrototypeOf: "es.reflect.get-prototype-of",
    has: "es.reflect.has",
    hasMetadata: "esnext.reflect.has-metadata",
    hasOwnMetadata: "esnext.reflect.has-own-metadata",
    isExtensible: "es.reflect.is-extensible",
    metadata: "esnext.reflect.metadata",
    ownKeys: "es.reflect.own-keys",
    preventExtensions: "es.reflect.prevent-extensions",
    set: "es.reflect.set",
    setPrototypeOf: "es.reflect.set-prototype-of"
  },
  Symbol: {
    asyncIterator: ["es.symbol.async-iterator"],
    dispose: ["esnext.symbol.dispose"],
    hasInstance: ["es.symbol.has-instance", "es.function.has-instance"],
    isConcatSpreadable: ["es.symbol.is-concat-spreadable", "es.array.concat"],
    iterator: ["es.symbol.iterator", ...CommonIteratorsWithTag],
    match: ["es.symbol.match", "es.string.match"],
    observable: ["esnext.symbol.observable"],
    patternMatch: ["esnext.symbol.pattern-match"],
    replace: ["es.symbol.replace", "es.string.replace"],
    search: ["es.symbol.search", "es.string.search"],
    species: ["es.symbol.species", "es.array.species"],
    split: ["es.symbol.split", "es.string.split"],
    toPrimitive: ["es.symbol.to-primitive", "es.date.to-primitive"],
    toStringTag: ["es.symbol.to-string-tag", "es.object.to-string", "es.math.to-string-tag", "es.json.to-string-tag"],
    unscopables: ["es.symbol.unscopables"]
  },
  ArrayBuffer: {
    isView: ["es.array-buffer.is-view"]
  },
  Int8Array: TypedArrayStaticMethods,
  Uint8Array: TypedArrayStaticMethods,
  Uint8ClampedArray: TypedArrayStaticMethods,
  Int16Array: TypedArrayStaticMethods,
  Uint16Array: TypedArrayStaticMethods,
  Int32Array: TypedArrayStaticMethods,
  Uint32Array: TypedArrayStaticMethods,
  Float32Array: TypedArrayStaticMethods,
  Float64Array: TypedArrayStaticMethods
};
exports.StaticProperties = StaticProperties;
const CommonInstanceDependencies = new Set(["es.object.to-string", "es.object.define-getter", "es.object.define-setter", "es.object.lookup-getter", "es.object.lookup-setter", "es.regexp.exec"]);
exports.CommonInstanceDependencies = CommonInstanceDependencies;
const PossibleGlobalObjects = new Set(["global", "globalThis", "self", "window"]);
exports.PossibleGlobalObjects = PossibleGlobalObjects;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013856, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("../../utils");

function _default() {
  return {
    name: "regenerator-usage",

    pre() {
      this.usesRegenerator = false;
    },

    visitor: {
      Function(path) {
        const {
          node
        } = path;

        if (!this.usesRegenerator && (node.generator || node.async)) {
          this.usesRegenerator = true;
          (0, _utils.createImport)(path, "regenerator-runtime");
        }
      }

    },

    post() {
      if (this.opts.debug && this.usesRegenerator) {
        let filename = this.file.opts.filename;

        if (process.env.BABEL_ENV === "test") {
          filename = filename.replace(/\\/g, "/");
        }

        console.log(`\n[${filename}] Based on your code and targets, added regenerator-runtime.`);
      }
    }

  };
}
}, function(modId) { var map = {"../../utils":1679975013853}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013857, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _corejs2BuiltIns = _interopRequireDefault(require("@babel/compat-data/corejs2-built-ins"));

var _helperCompilationTargets = require("@babel/helper-compilation-targets");

var _getPlatformSpecificDefault = _interopRequireDefault(require("./get-platform-specific-default"));

var _utils = require("../../utils");

var _debug = require("../../debug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(_, {
  include,
  exclude,
  polyfillTargets,
  regenerator,
  debug
}) {
  const polyfills = (0, _helperCompilationTargets.filterItems)(_corejs2BuiltIns.default, include, exclude, polyfillTargets, (0, _getPlatformSpecificDefault.default)(polyfillTargets));
  const isPolyfillImport = {
    ImportDeclaration(path) {
      if ((0, _utils.isPolyfillSource)((0, _utils.getImportSource)(path))) {
        this.replaceBySeparateModulesImport(path);
      }
    },

    Program(path) {
      path.get("body").forEach(bodyPath => {
        if ((0, _utils.isPolyfillSource)((0, _utils.getRequireSource)(bodyPath))) {
          this.replaceBySeparateModulesImport(bodyPath);
        }
      });
    }

  };
  return {
    name: "corejs2-entry",
    visitor: isPolyfillImport,

    pre() {
      this.importPolyfillIncluded = false;

      this.replaceBySeparateModulesImport = function (path) {
        this.importPolyfillIncluded = true;

        if (regenerator) {
          (0, _utils.createImport)(path, "regenerator-runtime");
        }

        const modules = Array.from(polyfills).reverse();

        for (const module of modules) {
          (0, _utils.createImport)(path, module);
        }

        path.remove();
      };
    },

    post() {
      if (debug) {
        (0, _debug.logEntryPolyfills)("@babel/polyfill", this.importPolyfillIncluded, polyfills, this.file.opts.filename, polyfillTargets, _corejs2BuiltIns.default);
      }
    }

  };
}
}, function(modId) { var map = {"./get-platform-specific-default":1679975013848,"../../utils":1679975013853,"../../debug":1679975013840}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013858, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _data = _interopRequireDefault(require("core-js-compat/data"));

var _entries = _interopRequireDefault(require("core-js-compat/entries"));

var _getModulesListForTargetVersion = _interopRequireDefault(require("core-js-compat/get-modules-list-for-target-version"));

var _helperCompilationTargets = require("@babel/helper-compilation-targets");

var _utils = require("../../utils");

var _debug = require("../../debug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBabelPolyfillSource(source) {
  return source === "@babel/polyfill" || source === "babel-polyfill";
}

function isCoreJSSource(source) {
  if (typeof source === "string") {
    source = source.replace(/\\/g, "/").replace(/(\/(index)?)?(\.js)?$/i, "").toLowerCase();
  }

  return (0, _utils.has)(_entries.default, source) && _entries.default[source];
}

const BABEL_POLYFILL_DEPRECATION = `
  \`@babel/polyfill\` is deprecated. Please, use required parts of \`core-js\`
  and \`regenerator-runtime/runtime\` separately`;

function _default(_, {
  corejs,
  include,
  exclude,
  polyfillTargets,
  debug
}) {
  const polyfills = (0, _helperCompilationTargets.filterItems)(_data.default, include, exclude, polyfillTargets, null);
  const available = new Set((0, _getModulesListForTargetVersion.default)(corejs.version));

  function shouldReplace(source, modules) {
    if (!modules) return false;

    if (modules.length === 1 && polyfills.has(modules[0]) && available.has(modules[0]) && (0, _utils.getModulePath)(modules[0]) === source) {
      return false;
    }

    return true;
  }

  const isPolyfillImport = {
    ImportDeclaration(path) {
      const source = (0, _utils.getImportSource)(path);
      if (!source) return;

      if (isBabelPolyfillSource(source)) {
        console.warn(BABEL_POLYFILL_DEPRECATION);
      } else {
        const modules = isCoreJSSource(source);

        if (shouldReplace(source, modules)) {
          this.replaceBySeparateModulesImport(path, modules);
        }
      }
    },

    Program: {
      enter(path) {
        path.get("body").forEach(bodyPath => {
          const source = (0, _utils.getRequireSource)(bodyPath);
          if (!source) return;

          if (isBabelPolyfillSource(source)) {
            console.warn(BABEL_POLYFILL_DEPRECATION);
          } else {
            const modules = isCoreJSSource(source);

            if (shouldReplace(source, modules)) {
              this.replaceBySeparateModulesImport(bodyPath, modules);
            }
          }
        });
      },

      exit(path) {
        const filtered = (0, _utils.intersection)(polyfills, this.polyfillsSet, available);
        const reversed = Array.from(filtered).reverse();

        for (const module of reversed) {
          if (!this.injectedPolyfills.has(module)) {
            (0, _utils.createImport)(path, module);
          }
        }

        filtered.forEach(module => this.injectedPolyfills.add(module));
      }

    }
  };
  return {
    name: "corejs3-entry",
    visitor: isPolyfillImport,

    pre() {
      this.injectedPolyfills = new Set();
      this.polyfillsSet = new Set();

      this.replaceBySeparateModulesImport = function (path, modules) {
        for (const module of modules) {
          this.polyfillsSet.add(module);
        }

        path.remove();
      };
    },

    post() {
      if (debug) {
        (0, _debug.logEntryPolyfills)("core-js", this.injectedPolyfills.size > 0, this.injectedPolyfills, this.file.opts.filename, polyfillTargets, _data.default);
      }
    }

  };
}
}, function(modId) { var map = {"../../utils":1679975013853,"../../debug":1679975013840}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013859, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("../../utils");

function isRegeneratorSource(source) {
  return source === "regenerator-runtime/runtime";
}

function _default() {
  const visitor = {
    ImportDeclaration(path) {
      if (isRegeneratorSource((0, _utils.getImportSource)(path))) {
        this.regeneratorImportExcluded = true;
        path.remove();
      }
    },

    Program(path) {
      path.get("body").forEach(bodyPath => {
        if (isRegeneratorSource((0, _utils.getRequireSource)(bodyPath))) {
          this.regeneratorImportExcluded = true;
          bodyPath.remove();
        }
      });
    }

  };
  return {
    name: "regenerator-entry",
    visitor,

    pre() {
      this.regeneratorImportExcluded = false;
    },

    post() {
      if (this.opts.debug && this.regeneratorImportExcluded) {
        let filename = this.file.opts.filename;

        if (process.env.BABEL_ENV === "test") {
          filename = filename.replace(/\\/g, "/");
        }

        console.log(`\n[${filename}] Based on your targets, regenerator-runtime import excluded.`);
      }
    }

  };
}
}, function(modId) { var map = {"../../utils":1679975013853}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975013839);
})()
//miniprogram-npm-outsideDeps=["semver","@babel/compat-data/overlapping-plugins","@babel/helper-compilation-targets","@babel/helper-plugin-utils","core-js-compat/data","@babel/compat-data/corejs2-built-ins","@babel/helper-validator-option","@babel/compat-data/plugins","@babel/compat-data/plugin-bugfixes","@babel/plugin-syntax-async-generators","@babel/plugin-syntax-class-properties","@babel/plugin-syntax-dynamic-import","@babel/plugin-syntax-export-namespace-from","@babel/plugin-syntax-json-strings","@babel/plugin-syntax-logical-assignment-operators","@babel/plugin-syntax-nullish-coalescing-operator","@babel/plugin-syntax-numeric-separator","@babel/plugin-syntax-object-rest-spread","@babel/plugin-syntax-optional-catch-binding","@babel/plugin-syntax-optional-chaining","@babel/plugin-syntax-top-level-await","@babel/plugin-proposal-async-generator-functions","@babel/plugin-proposal-class-properties","@babel/plugin-proposal-dynamic-import","@babel/plugin-proposal-export-namespace-from","@babel/plugin-proposal-json-strings","@babel/plugin-proposal-logical-assignment-operators","@babel/plugin-proposal-nullish-coalescing-operator","@babel/plugin-proposal-numeric-separator","@babel/plugin-proposal-object-rest-spread","@babel/plugin-proposal-optional-catch-binding","@babel/plugin-proposal-optional-chaining","@babel/plugin-proposal-private-methods","@babel/plugin-proposal-unicode-property-regex","@babel/plugin-transform-async-to-generator","@babel/plugin-transform-arrow-functions","@babel/plugin-transform-block-scoped-functions","@babel/plugin-transform-block-scoping","@babel/plugin-transform-classes","@babel/plugin-transform-computed-properties","@babel/plugin-transform-destructuring","@babel/plugin-transform-dotall-regex","@babel/plugin-transform-duplicate-keys","@babel/plugin-transform-exponentiation-operator","@babel/plugin-transform-for-of","@babel/plugin-transform-function-name","@babel/plugin-transform-literals","@babel/plugin-transform-member-expression-literals","@babel/plugin-transform-modules-amd","@babel/plugin-transform-modules-commonjs","@babel/plugin-transform-modules-systemjs","@babel/plugin-transform-modules-umd","@babel/plugin-transform-named-capturing-groups-regex","@babel/plugin-transform-new-target","@babel/plugin-transform-object-super","@babel/plugin-transform-parameters","@babel/plugin-transform-property-literals","@babel/plugin-transform-regenerator","@babel/plugin-transform-reserved-words","@babel/plugin-transform-shorthand-properties","@babel/plugin-transform-spread","@babel/plugin-transform-sticky-regex","@babel/plugin-transform-template-literals","@babel/plugin-transform-typeof-symbol","@babel/plugin-transform-unicode-escapes","@babel/plugin-transform-unicode-regex","@babel/preset-modules/lib/plugins/transform-async-arrows-in-class","@babel/preset-modules/lib/plugins/transform-edge-default-parameters","@babel/preset-modules/lib/plugins/transform-edge-function-name","@babel/preset-modules/lib/plugins/transform-tagged-template-caching","@babel/preset-modules/lib/plugins/transform-safari-block-shadowing","@babel/preset-modules/lib/plugins/transform-safari-for-shadowing","@babel/types","@babel/helper-module-imports","@babel/compat-data/corejs3-shipped-proposals","core-js-compat/get-modules-list-for-target-version","core-js-compat/entries"]
//# sourceMappingURL=index.js.map