module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014314, function(require, module, exports) {


exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = function (_ref) {
  var t = _ref.types;

  var ALREADY_VISITED = (0, _symbol2.default)();

  function findConstructorCall(path) {
    var methods = path.get("body.body");

    for (var _iterator = methods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var method = _ref2;

      if (method.node.kind === "constructorCall") {
        return method;
      }
    }

    return null;
  }

  function handleClassWithCall(constructorCall, classPath) {
    var _classPath = classPath,
        node = _classPath.node;

    var ref = node.id || classPath.scope.generateUidIdentifier("class");

    if (classPath.parentPath.isExportDefaultDeclaration()) {
      classPath = classPath.parentPath;
      classPath.insertAfter(t.exportDefaultDeclaration(ref));
    }

    classPath.replaceWithMultiple(buildWrapper({
      CLASS_REF: classPath.scope.generateUidIdentifier(ref.name),
      CALL_REF: classPath.scope.generateUidIdentifier(ref.name + "Call"),
      CALL: t.functionExpression(null, constructorCall.node.params, constructorCall.node.body),
      CLASS: t.toExpression(node),
      WRAPPER_REF: ref
    }));

    constructorCall.remove();
  }

  return {
    inherits: require("babel-plugin-syntax-class-constructor-call"),

    visitor: {
      Class: function Class(path) {
        if (path.node[ALREADY_VISITED]) return;
        path.node[ALREADY_VISITED] = true;

        var constructorCall = findConstructorCall(path);

        if (constructorCall) {
          handleClassWithCall(constructorCall, path);
        } else {
          return;
        }
      }
    }
  };
};

var _babelTemplate = require("babel-template");

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildWrapper = (0, _babelTemplate2.default)("\n  let CLASS_REF = CLASS;\n  var CALL_REF = CALL;\n  var WRAPPER_REF = function (...args) {\n    if (this instanceof WRAPPER_REF) {\n      return Reflect.construct(CLASS_REF, args);\n    } else {\n      return CALL_REF.apply(this, args);\n    }\n  };\n  WRAPPER_REF.__proto__ = CLASS_REF;\n  WRAPPER_REF;\n");

module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014314);
})()
//miniprogram-npm-outsideDeps=["babel-runtime/core-js/get-iterator","babel-runtime/core-js/symbol","babel-plugin-syntax-class-constructor-call","babel-template"]
//# sourceMappingURL=index.js.map