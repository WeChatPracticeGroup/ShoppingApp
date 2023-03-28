module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014348, function(require, module, exports) {


exports.__esModule = true;

exports.default = function (_ref) {
  var t = _ref.types;

  function getTempId(scope) {
    var id = scope.path.getData("functionBind");
    if (id) return id;

    id = scope.generateDeclaredUidIdentifier("context");
    return scope.path.setData("functionBind", id);
  }

  function getStaticContext(bind, scope) {
    var object = bind.object || bind.callee.object;
    return scope.isStatic(object) && object;
  }

  function inferBindContext(bind, scope) {
    var staticContext = getStaticContext(bind, scope);
    if (staticContext) return staticContext;

    var tempId = getTempId(scope);
    if (bind.object) {
      bind.callee = t.sequenceExpression([t.assignmentExpression("=", tempId, bind.object), bind.callee]);
    } else {
      bind.callee.object = t.assignmentExpression("=", tempId, bind.callee.object);
    }
    return tempId;
  }

  return {
    inherits: require("babel-plugin-syntax-function-bind"),

    visitor: {
      CallExpression: function CallExpression(_ref2) {
        var node = _ref2.node,
            scope = _ref2.scope;

        var bind = node.callee;
        if (!t.isBindExpression(bind)) return;

        var context = inferBindContext(bind, scope);
        node.callee = t.memberExpression(bind.callee, t.identifier("call"));
        node.arguments.unshift(context);
      },
      BindExpression: function BindExpression(path) {
        var node = path.node,
            scope = path.scope;

        var context = inferBindContext(node, scope);
        path.replaceWith(t.callExpression(t.memberExpression(node.callee, t.identifier("bind")), [context]));
      }
    }
  };
};

module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014348);
})()
//miniprogram-npm-outsideDeps=["babel-plugin-syntax-function-bind"]
//# sourceMappingURL=index.js.map