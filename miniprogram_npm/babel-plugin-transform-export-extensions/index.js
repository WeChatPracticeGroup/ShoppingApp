module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014347, function(require, module, exports) {


exports.__esModule = true;

exports.default = function (_ref) {
  var t = _ref.types;

  function build(node, nodes, scope) {
    var first = node.specifiers[0];
    if (!t.isExportNamespaceSpecifier(first) && !t.isExportDefaultSpecifier(first)) return;

    var specifier = node.specifiers.shift();
    var uid = scope.generateUidIdentifier(specifier.exported.name);

    var newSpecifier = void 0;
    if (t.isExportNamespaceSpecifier(specifier)) {
      newSpecifier = t.importNamespaceSpecifier(uid);
    } else {
      newSpecifier = t.importDefaultSpecifier(uid);
    }

    nodes.push(t.importDeclaration([newSpecifier], node.source));
    nodes.push(t.exportNamedDeclaration(null, [t.exportSpecifier(uid, specifier.exported)]));

    build(node, nodes, scope);
  }

  return {
    inherits: require("babel-plugin-syntax-export-extensions"),

    visitor: {
      ExportNamedDeclaration: function ExportNamedDeclaration(path) {
        var node = path.node,
            scope = path.scope;

        var nodes = [];
        build(node, nodes, scope);
        if (!nodes.length) return;

        if (node.specifiers.length >= 1) {
          nodes.push(node);
        }
        path.replaceWithMultiple(nodes);
      }
    }
  };
};

module.exports = exports["default"];
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014347);
})()
//miniprogram-npm-outsideDeps=["babel-plugin-syntax-export-extensions"]
//# sourceMappingURL=index.js.map