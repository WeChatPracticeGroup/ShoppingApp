module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975015161, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBrowserScope = exports.setBrowserScope = exports.getLatestStableBrowsers = exports.find = exports.isSupported = exports.getSupport = exports.features = undefined;

var _lodash = require("lodash.memoize");

var _lodash2 = _interopRequireDefault(_lodash);

var _browserslist = require("browserslist");

var _browserslist2 = _interopRequireDefault(_browserslist);

var _caniuseLite = require("caniuse-lite");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var featuresList = Object.keys(_caniuseLite.features);

var browsers = void 0;
function setBrowserScope(browserList) {
  browsers = (0, _utils.cleanBrowsersList)(browserList);
}

function getBrowserScope() {
  return browsers;
}

var parse = (0, _lodash2.default)(_utils.parseCaniuseData, function (feat, browsers) {
  return feat.title + browsers;
});

function getSupport(query) {
  var feature = void 0;
  try {
    feature = (0, _caniuseLite.feature)(_caniuseLite.features[query]);
  } catch (e) {
    var res = find(query);
    if (res.length === 1) return getSupport(res[0]);
    throw new ReferenceError("Please provide a proper feature name. Cannot find " + query);
  }
  return parse(feature, browsers);
}

function isSupported(feature, browsers) {
  var data = void 0;
  try {
    data = (0, _caniuseLite.feature)(_caniuseLite.features[feature]);
  } catch (e) {
    var res = find(feature);
    if (res.length === 1) {
      data = _caniuseLite.features[res[0]];
    } else {
      throw new ReferenceError("Please provide a proper feature name. Cannot find " + feature);
    }
  }

  return (0, _browserslist2.default)(browsers, { ignoreUnknownVersions: true }).map(function (browser) {
    return browser.split(" ");
  }).every(function (browser) {
    return data.stats[browser[0]] && data.stats[browser[0]][browser[1]] === "y";
  });
}

function find(query) {
  if (typeof query !== "string") {
    throw new TypeError("The `query` parameter should be a string.");
  }

  if (~featuresList.indexOf(query)) {
    // exact match
    return query;
  }

  return featuresList.filter(function (file) {
    return (0, _utils.contains)(file, query);
  });
}

function getLatestStableBrowsers() {
  return (0, _browserslist2.default)("last 1 version");
}

setBrowserScope();

exports.features = featuresList;
exports.getSupport = getSupport;
exports.isSupported = isSupported;
exports.find = find;
exports.getLatestStableBrowsers = getLatestStableBrowsers;
exports.setBrowserScope = setBrowserScope;
exports.getBrowserScope = getBrowserScope;
}, function(modId) {var map = {"./utils":1679975015162}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975015162, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contains = contains;
exports.parseCaniuseData = parseCaniuseData;
exports.cleanBrowsersList = cleanBrowsersList;

var _lodash = require("lodash.uniq");

var _lodash2 = _interopRequireDefault(_lodash);

var _browserslist = require("browserslist");

var _browserslist2 = _interopRequireDefault(_browserslist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function contains(str, substr) {
  return !!~str.indexOf(substr);
}

function parseCaniuseData(feature, browsers) {
  var support = {};
  var letters;
  var letter;

  browsers.forEach(function (browser) {
    support[browser] = {};
    for (var info in feature.stats[browser]) {
      letters = feature.stats[browser][info].replace(/#\d+/, "").trim().split(" ");
      info = parseFloat(info.split("-")[0]); //if info is a range, take the left
      if (isNaN(info)) continue;
      for (var i = 0; i < letters.length; i++) {
        letter = letters[i];
        if (letter === "d") {
          // skip this letter, we don't support it yet
          continue;
        } else if (letter === "y") {
          // min support asked, need to find the min value
          if (typeof support[browser][letter] === "undefined" || info < support[browser][letter]) {
            support[browser][letter] = info;
          }
        } else {
          // any other support, need to find the max value
          if (typeof support[browser][letter] === "undefined" || info > support[browser][letter]) {
            support[browser][letter] = info;
          }
        }
      }
    }
  });

  return support;
}

function cleanBrowsersList(browserList) {
  return (0, _lodash2.default)((0, _browserslist2.default)(browserList).map(function (browser) {
    return browser.split(" ")[0];
  }));
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975015161);
})()
//miniprogram-npm-outsideDeps=["lodash.memoize","browserslist","caniuse-lite","lodash.uniq"]
//# sourceMappingURL=index.js.map