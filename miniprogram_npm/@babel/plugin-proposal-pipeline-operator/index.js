module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975013751, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginSyntaxPipelineOperator = _interopRequireDefault(require("@babel/plugin-syntax-pipeline-operator"));

var _minimalVisitor = _interopRequireDefault(require("./minimalVisitor"));

var _smartVisitor = _interopRequireDefault(require("./smartVisitor"));

var _fsharpVisitor = _interopRequireDefault(require("./fsharpVisitor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const visitorsPerProposal = {
  minimal: _minimalVisitor.default,
  smart: _smartVisitor.default,
  fsharp: _fsharpVisitor.default
};

var _default = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  return {
    name: "proposal-pipeline-operator",
    inherits: _pluginSyntaxPipelineOperator.default,
    visitor: visitorsPerProposal[options.proposal]
  };
});

exports.default = _default;
}, function(modId) {var map = {"./minimalVisitor":1679975013752,"./smartVisitor":1679975013754,"./fsharpVisitor":1679975013755}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013752, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@babel/core");

var _buildOptimizedSequenceExpression = _interopRequireDefault(require("./buildOptimizedSequenceExpression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const minimalVisitor = {
  BinaryExpression(path) {
    const {
      scope,
      node
    } = path;
    const {
      operator,
      left,
      right
    } = node;
    if (operator !== "|>") return;
    const placeholder = scope.generateUidIdentifierBasedOnNode(left);

    const call = _core.types.callExpression(right, [_core.types.cloneNode(placeholder)]);

    path.replaceWith((0, _buildOptimizedSequenceExpression.default)({
      assign: _core.types.assignmentExpression("=", _core.types.cloneNode(placeholder), left),
      call,
      path
    }));
  }

};
var _default = minimalVisitor;
exports.default = _default;
}, function(modId) { var map = {"./buildOptimizedSequenceExpression":1679975013753}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013753, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@babel/core");

const buildOptimizedSequenceExpression = ({
  assign,
  call,
  path
}) => {
  const {
    left: placeholderNode,
    right: pipelineLeft
  } = assign;
  const {
    callee: calledExpression
  } = call;
  let optimizeArrow = _core.types.isArrowFunctionExpression(calledExpression) && _core.types.isExpression(calledExpression.body) && !calledExpression.async && !calledExpression.generator;
  let param;

  if (optimizeArrow) {
    const {
      params
    } = calledExpression;

    if (params.length === 1 && _core.types.isIdentifier(params[0])) {
      param = params[0];
    } else if (params.length > 0) {
      optimizeArrow = false;
    }
  } else if (_core.types.isIdentifier(calledExpression, {
    name: "eval"
  })) {
    const evalSequence = _core.types.sequenceExpression([_core.types.numericLiteral(0), calledExpression]);

    call.callee = evalSequence;
    path.scope.push({
      id: _core.types.cloneNode(placeholderNode)
    });
    return _core.types.sequenceExpression([assign, call]);
  }

  if (optimizeArrow && !param) {
    return _core.types.sequenceExpression([pipelineLeft, calledExpression.body]);
  }

  path.scope.push({
    id: _core.types.cloneNode(placeholderNode)
  });

  if (param) {
    path.get("right").scope.rename(param.name, placeholderNode.name);
    return _core.types.sequenceExpression([assign, calledExpression.body]);
  }

  return _core.types.sequenceExpression([assign, call]);
};

var _default = buildOptimizedSequenceExpression;
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013754, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@babel/core");

const updateTopicReferenceVisitor = {
  PipelinePrimaryTopicReference(path) {
    path.replaceWith(_core.types.cloneNode(this.topicId));
  },

  PipelineTopicExpression(path) {
    path.skip();
  }

};
const smartVisitor = {
  BinaryExpression(path) {
    const {
      scope
    } = path;
    const {
      node
    } = path;
    const {
      operator,
      left,
      right
    } = node;
    if (operator !== "|>") return;
    const placeholder = scope.generateUidIdentifierBasedOnNode(left);
    scope.push({
      id: placeholder
    });
    let call;

    if (_core.types.isPipelineTopicExpression(right)) {
      path.get("right").traverse(updateTopicReferenceVisitor, {
        topicId: placeholder
      });
      call = right.expression;
    } else {
      let callee = right.callee;

      if (_core.types.isIdentifier(callee, {
        name: "eval"
      })) {
        callee = _core.types.sequenceExpression([_core.types.numericLiteral(0), callee]);
      }

      call = _core.types.callExpression(callee, [_core.types.cloneNode(placeholder)]);
    }

    path.replaceWith(_core.types.sequenceExpression([_core.types.assignmentExpression("=", _core.types.cloneNode(placeholder), left), call]));
  }

};
var _default = smartVisitor;
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975013755, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@babel/core");

var _buildOptimizedSequenceExpression = _interopRequireDefault(require("./buildOptimizedSequenceExpression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fsharpVisitor = {
  BinaryExpression(path) {
    const {
      scope,
      node
    } = path;
    const {
      operator,
      left,
      right
    } = node;
    if (operator !== "|>") return;
    const placeholder = scope.generateUidIdentifierBasedOnNode(left);
    const call = right.type === "AwaitExpression" ? _core.types.awaitExpression(_core.types.cloneNode(placeholder)) : _core.types.callExpression(right, [_core.types.cloneNode(placeholder)]);
    const sequence = (0, _buildOptimizedSequenceExpression.default)({
      assign: _core.types.assignmentExpression("=", _core.types.cloneNode(placeholder), left),
      call,
      path
    });
    path.replaceWith(sequence);
  }

};
var _default = fsharpVisitor;
exports.default = _default;
}, function(modId) { var map = {"./buildOptimizedSequenceExpression":1679975013753}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975013751);
})()
//miniprogram-npm-outsideDeps=["@babel/helper-plugin-utils","@babel/plugin-syntax-pipeline-operator","@babel/core"]
//# sourceMappingURL=index.js.map