module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975001486, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeGenerator = void 0;
exports.default = generate;

var _sourceMap = require("./source-map");

var _printer = require("./printer");

class Generator extends _printer.default {
  constructor(ast, opts = {}, code) {
    const format = normalizeOptions(code, opts);
    const map = opts.sourceMaps ? new _sourceMap.default(opts, code) : null;
    super(format, map);
    this.ast = void 0;
    this.ast = ast;
  }

  generate() {
    return super.generate(this.ast);
  }

}

function normalizeOptions(code, opts) {
  const format = {
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    shouldPrintComment: opts.shouldPrintComment,
    retainLines: opts.retainLines,
    retainFunctionParens: opts.retainFunctionParens,
    comments: opts.comments == null || opts.comments,
    compact: opts.compact,
    minified: opts.minified,
    concise: opts.concise,
    indent: {
      adjustMultilineComment: true,
      style: "  ",
      base: 0
    },
    decoratorsBeforeExport: !!opts.decoratorsBeforeExport,
    jsescOption: Object.assign({
      quotes: "double",
      wrap: true,
      minimal: false
    }, opts.jsescOption),
    recordAndTupleSyntaxType: opts.recordAndTupleSyntaxType,
    topicToken: opts.topicToken
  };
  {
    format.jsonCompatibleStrings = opts.jsonCompatibleStrings;
  }

  if (format.minified) {
    format.compact = true;

    format.shouldPrintComment = format.shouldPrintComment || (() => format.comments);
  } else {
    format.shouldPrintComment = format.shouldPrintComment || (value => format.comments || value.indexOf("@license") >= 0 || value.indexOf("@preserve") >= 0);
  }

  if (format.compact === "auto") {
    format.compact = code.length > 500000;

    if (format.compact) {
      console.error("[BABEL] Note: The code generator has deoptimised the styling of " + `${opts.filename} as it exceeds the max of ${"500KB"}.`);
    }
  }

  if (format.compact) {
    format.indent.adjustMultilineComment = false;
  }

  return format;
}

class CodeGenerator {
  constructor(ast, opts, code) {
    this._generator = void 0;
    this._generator = new Generator(ast, opts, code);
  }

  generate() {
    return this._generator.generate();
  }

}

exports.CodeGenerator = CodeGenerator;

function generate(ast, opts, code) {
  const gen = new Generator(ast, opts, code);
  return gen.generate();
}
}, function(modId) {var map = {"./source-map":1679975001487,"./printer":1679975001488}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001487, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _genMapping = require("@jridgewell/gen-mapping");

class SourceMap {
  constructor(opts, code) {
    var _opts$sourceFileName;

    this._map = void 0;
    this._rawMappings = void 0;
    this._sourceFileName = void 0;
    this._lastGenLine = 0;
    this._lastSourceLine = 0;
    this._lastSourceColumn = 0;
    const map = this._map = new _genMapping.GenMapping({
      sourceRoot: opts.sourceRoot
    });
    this._sourceFileName = (_opts$sourceFileName = opts.sourceFileName) == null ? void 0 : _opts$sourceFileName.replace(/\\/g, "/");
    this._rawMappings = undefined;

    if (typeof code === "string") {
      (0, _genMapping.setSourceContent)(map, this._sourceFileName, code);
    } else if (typeof code === "object") {
      Object.keys(code).forEach(sourceFileName => {
        (0, _genMapping.setSourceContent)(map, sourceFileName.replace(/\\/g, "/"), code[sourceFileName]);
      });
    }
  }

  get() {
    return (0, _genMapping.encodedMap)(this._map);
  }

  getDecoded() {
    return (0, _genMapping.decodedMap)(this._map);
  }

  getRawMappings() {
    return this._rawMappings || (this._rawMappings = (0, _genMapping.allMappings)(this._map));
  }

  mark(generated, line, column, identifierName, filename, force) {
    const generatedLine = generated.line;
    if (this._lastGenLine !== generatedLine && line == null) return;

    if (!force && this._lastGenLine === generatedLine && this._lastSourceLine === line && this._lastSourceColumn === column) {
      return;
    }

    this._rawMappings = undefined;
    this._lastGenLine = generatedLine;
    this._lastSourceLine = line;
    this._lastSourceColumn = column;
    (0, _genMapping.addMapping)(this._map, {
      name: identifierName,
      generated,
      source: line == null ? undefined : (filename == null ? void 0 : filename.replace(/\\/g, "/")) || this._sourceFileName,
      original: line == null ? undefined : {
        line: line,
        column: column
      }
    });
  }

}

exports.default = SourceMap;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001488, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buffer = require("./buffer");

var n = require("./node");

var _t = require("@babel/types");

var generatorFunctions = require("./generators");

const {
  isProgram,
  isFile,
  isEmptyStatement
} = _t;
const SCIENTIFIC_NOTATION = /e/i;
const ZERO_DECIMAL_INTEGER = /\.0+$/;
const NON_DECIMAL_LITERAL = /^0[box]/;
const PURE_ANNOTATION_RE = /^\s*[@#]__PURE__\s*$/;
const {
  needsParens,
  needsWhitespaceAfter,
  needsWhitespaceBefore
} = n;

class Printer {
  constructor(format, map) {
    this.inForStatementInitCounter = 0;
    this._printStack = [];
    this._indent = 0;
    this._insideAux = false;
    this._parenPushNewlineState = null;
    this._noLineTerminator = false;
    this._printAuxAfterOnNextUserNode = false;
    this._printedComments = new WeakSet();
    this._endsWithInteger = false;
    this._endsWithWord = false;
    this.format = format;
    this._buf = new _buffer.default(map);
  }

  generate(ast) {
    this.print(ast);

    this._maybeAddAuxComment();

    return this._buf.get();
  }

  indent() {
    if (this.format.compact || this.format.concise) return;
    this._indent++;
  }

  dedent() {
    if (this.format.compact || this.format.concise) return;
    this._indent--;
  }

  semicolon(force = false) {
    this._maybeAddAuxComment();

    this._append(";", !force);
  }

  rightBrace() {
    if (this.format.minified) {
      this._buf.removeLastSemicolon();
    }

    this.token("}");
  }

  space(force = false) {
    if (this.format.compact) return;

    if (force) {
      this._space();
    } else if (this._buf.hasContent()) {
      const lastCp = this.getLastChar();

      if (lastCp !== 32 && lastCp !== 10) {
        this._space();
      }
    }
  }

  word(str) {
    if (this._endsWithWord || this.endsWith(47) && str.charCodeAt(0) === 47) {
      this._space();
    }

    this._maybeAddAuxComment();

    this._append(str);

    this._endsWithWord = true;
  }

  number(str) {
    this.word(str);
    this._endsWithInteger = Number.isInteger(+str) && !NON_DECIMAL_LITERAL.test(str) && !SCIENTIFIC_NOTATION.test(str) && !ZERO_DECIMAL_INTEGER.test(str) && str.charCodeAt(str.length - 1) !== 46;
  }

  token(str) {
    const lastChar = this.getLastChar();
    const strFirst = str.charCodeAt(0);

    if (str === "--" && lastChar === 33 || strFirst === 43 && lastChar === 43 || strFirst === 45 && lastChar === 45 || strFirst === 46 && this._endsWithInteger) {
      this._space();
    }

    this._maybeAddAuxComment();

    this._append(str);
  }

  newline(i = 1) {
    if (this.format.retainLines || this.format.compact) return;

    if (this.format.concise) {
      this.space();
      return;
    }

    const charBeforeNewline = this.endsWithCharAndNewline();
    if (charBeforeNewline === 10) return;

    if (charBeforeNewline === 123 || charBeforeNewline === 58) {
      i--;
    }

    if (i <= 0) return;

    for (let j = 0; j < i; j++) {
      this._newline();
    }
  }

  endsWith(char) {
    return this.getLastChar() === char;
  }

  getLastChar() {
    return this._buf.getLastChar();
  }

  endsWithCharAndNewline() {
    return this._buf.endsWithCharAndNewline();
  }

  removeTrailingNewline() {
    this._buf.removeTrailingNewline();
  }

  exactSource(loc, cb) {
    this._catchUp("start", loc);

    this._buf.exactSource(loc, cb);
  }

  source(prop, loc) {
    this._catchUp(prop, loc);

    this._buf.source(prop, loc);
  }

  withSource(prop, loc, cb) {
    this._catchUp(prop, loc);

    this._buf.withSource(prop, loc, cb);
  }

  _space() {
    this._append(" ", true);
  }

  _newline() {
    this._append("\n", true);
  }

  _append(str, queue = false) {
    this._maybeAddParen(str);

    this._maybeIndent(str);

    if (queue) this._buf.queue(str);else this._buf.append(str);
    this._endsWithWord = false;
    this._endsWithInteger = false;
  }

  _maybeIndent(str) {
    if (this._indent && this.endsWith(10) && str.charCodeAt(0) !== 10) {
      this._buf.queueIndentation(this._getIndent());
    }
  }

  _maybeAddParen(str) {
    const parenPushNewlineState = this._parenPushNewlineState;
    if (!parenPushNewlineState) return;
    let i;

    for (i = 0; i < str.length && str[i] === " "; i++) continue;

    if (i === str.length) {
      return;
    }

    const cha = str[i];

    if (cha !== "\n") {
      if (cha !== "/" || i + 1 === str.length) {
        this._parenPushNewlineState = null;
        return;
      }

      const chaPost = str[i + 1];

      if (chaPost === "*") {
        if (PURE_ANNOTATION_RE.test(str.slice(i + 2, str.length - 2))) {
          return;
        }
      } else if (chaPost !== "/") {
        this._parenPushNewlineState = null;
        return;
      }
    }

    this.token("(");
    this.indent();
    parenPushNewlineState.printed = true;
  }

  _catchUp(prop, loc) {
    if (!this.format.retainLines) return;
    const pos = loc ? loc[prop] : null;

    if ((pos == null ? void 0 : pos.line) != null) {
      const count = pos.line - this._buf.getCurrentLine();

      for (let i = 0; i < count; i++) {
        this._newline();
      }
    }
  }

  _getIndent() {
    return this.format.indent.style.repeat(this._indent);
  }

  startTerminatorless(isLabel = false) {
    if (isLabel) {
      this._noLineTerminator = true;
      return null;
    } else {
      return this._parenPushNewlineState = {
        printed: false
      };
    }
  }

  endTerminatorless(state) {
    this._noLineTerminator = false;

    if (state != null && state.printed) {
      this.dedent();
      this.newline();
      this.token(")");
    }
  }

  print(node, parent) {
    if (!node) return;
    const oldConcise = this.format.concise;

    if (node._compact) {
      this.format.concise = true;
    }

    const printMethod = this[node.type];

    if (!printMethod) {
      throw new ReferenceError(`unknown node of type ${JSON.stringify(node.type)} with constructor ${JSON.stringify(node == null ? void 0 : node.constructor.name)}`);
    }

    this._printStack.push(node);

    const oldInAux = this._insideAux;
    this._insideAux = !node.loc;

    this._maybeAddAuxComment(this._insideAux && !oldInAux);

    let shouldPrintParens = needsParens(node, parent, this._printStack);

    if (this.format.retainFunctionParens && node.type === "FunctionExpression" && node.extra && node.extra.parenthesized) {
      shouldPrintParens = true;
    }

    if (shouldPrintParens) this.token("(");

    this._printLeadingComments(node);

    const loc = isProgram(node) || isFile(node) ? null : node.loc;
    this.withSource("start", loc, () => {
      printMethod.call(this, node, parent);
    });

    this._printTrailingComments(node);

    if (shouldPrintParens) this.token(")");

    this._printStack.pop();

    this.format.concise = oldConcise;
    this._insideAux = oldInAux;
  }

  _maybeAddAuxComment(enteredPositionlessNode) {
    if (enteredPositionlessNode) this._printAuxBeforeComment();
    if (!this._insideAux) this._printAuxAfterComment();
  }

  _printAuxBeforeComment() {
    if (this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = true;
    const comment = this.format.auxiliaryCommentBefore;

    if (comment) {
      this._printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  }

  _printAuxAfterComment() {
    if (!this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = false;
    const comment = this.format.auxiliaryCommentAfter;

    if (comment) {
      this._printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  }

  getPossibleRaw(node) {
    const extra = node.extra;

    if (extra && extra.raw != null && extra.rawValue != null && node.value === extra.rawValue) {
      return extra.raw;
    }
  }

  printJoin(nodes, parent, opts = {}) {
    if (!(nodes != null && nodes.length)) return;
    if (opts.indent) this.indent();
    const newlineOpts = {
      addNewlines: opts.addNewlines
    };

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      if (opts.statement) this._printNewline(true, node, parent, newlineOpts);
      this.print(node, parent);

      if (opts.iterator) {
        opts.iterator(node, i);
      }

      if (opts.separator && i < nodes.length - 1) {
        opts.separator.call(this);
      }

      if (opts.statement) this._printNewline(false, node, parent, newlineOpts);
    }

    if (opts.indent) this.dedent();
  }

  printAndIndentOnComments(node, parent) {
    const indent = node.leadingComments && node.leadingComments.length > 0;
    if (indent) this.indent();
    this.print(node, parent);
    if (indent) this.dedent();
  }

  printBlock(parent) {
    const node = parent.body;

    if (!isEmptyStatement(node)) {
      this.space();
    }

    this.print(node, parent);
  }

  _printTrailingComments(node) {
    this._printComments(this._getComments(false, node));
  }

  _printLeadingComments(node) {
    this._printComments(this._getComments(true, node), true);
  }

  printInnerComments(node, indent = true) {
    var _node$innerComments;

    if (!((_node$innerComments = node.innerComments) != null && _node$innerComments.length)) return;
    if (indent) this.indent();

    this._printComments(node.innerComments);

    if (indent) this.dedent();
  }

  printSequence(nodes, parent, opts = {}) {
    opts.statement = true;
    return this.printJoin(nodes, parent, opts);
  }

  printList(items, parent, opts = {}) {
    if (opts.separator == null) {
      opts.separator = commaSeparator;
    }

    return this.printJoin(items, parent, opts);
  }

  _printNewline(leading, node, parent, opts) {
    if (this.format.retainLines || this.format.compact) return;

    if (this.format.concise) {
      this.space();
      return;
    }

    let lines = 0;

    if (this._buf.hasContent()) {
      if (!leading) lines++;
      if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;
      const needs = leading ? needsWhitespaceBefore : needsWhitespaceAfter;
      if (needs(node, parent)) lines++;
    }

    this.newline(Math.min(2, lines));
  }

  _getComments(leading, node) {
    return node && (leading ? node.leadingComments : node.trailingComments) || [];
  }

  _printComment(comment, skipNewLines) {
    if (!this.format.shouldPrintComment(comment.value)) return;
    if (comment.ignore) return;
    if (this._printedComments.has(comment)) return;

    this._printedComments.add(comment);

    const isBlockComment = comment.type === "CommentBlock";
    const printNewLines = isBlockComment && !skipNewLines && !this._noLineTerminator;
    if (printNewLines && this._buf.hasContent()) this.newline(1);
    const lastCharCode = this.getLastChar();

    if (lastCharCode !== 91 && lastCharCode !== 123) {
      this.space();
    }

    let val = !isBlockComment && !this._noLineTerminator ? `//${comment.value}\n` : `/*${comment.value}*/`;

    if (isBlockComment && this.format.indent.adjustMultilineComment) {
      var _comment$loc;

      const offset = (_comment$loc = comment.loc) == null ? void 0 : _comment$loc.start.column;

      if (offset) {
        const newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
        val = val.replace(newlineRegex, "\n");
      }

      const indentSize = Math.max(this._getIndent().length, this.format.retainLines ? 0 : this._buf.getCurrentColumn());
      val = val.replace(/\n(?!$)/g, `\n${" ".repeat(indentSize)}`);
    }

    if (this.endsWith(47)) this._space();
    this.withSource("start", comment.loc, () => {
      this._append(val);
    });
    if (printNewLines) this.newline(1);
  }

  _printComments(comments, inlinePureAnnotation) {
    if (!(comments != null && comments.length)) return;

    if (inlinePureAnnotation && comments.length === 1 && PURE_ANNOTATION_RE.test(comments[0].value)) {
      this._printComment(comments[0], this._buf.hasContent() && !this.endsWith(10));
    } else {
      for (const comment of comments) {
        this._printComment(comment);
      }
    }
  }

  printAssertions(node) {
    var _node$assertions;

    if ((_node$assertions = node.assertions) != null && _node$assertions.length) {
      this.space();
      this.word("assert");
      this.space();
      this.token("{");
      this.space();
      this.printList(node.assertions, node);
      this.space();
      this.token("}");
    }
  }

}

Object.assign(Printer.prototype, generatorFunctions);
{
  Printer.prototype.Noop = function Noop() {};
}
var _default = Printer;
exports.default = _default;

function commaSeparator() {
  this.token(",");
  this.space();
}
}, function(modId) { var map = {"./buffer":1679975001489,"./node":1679975001490,"./generators":1679975001493}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001489, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function SourcePos() {
  return {
    identifierName: undefined,
    line: undefined,
    column: undefined,
    filename: undefined,
    force: false
  };
}

const SPACES_RE = /^[ \t]+$/;

class Buffer {
  constructor(map) {
    this._map = null;
    this._buf = "";
    this._last = 0;
    this._queue = [];
    this._position = {
      line: 1,
      column: 0
    };
    this._sourcePosition = SourcePos();
    this._disallowedPop = null;
    this._map = map;
  }

  get() {
    this._flush();

    const map = this._map;
    const result = {
      code: this._buf.trimRight(),
      decodedMap: map == null ? void 0 : map.getDecoded(),

      get map() {
        return result.map = map ? map.get() : null;
      },

      set map(value) {
        Object.defineProperty(result, "map", {
          value,
          writable: true
        });
      },

      get rawMappings() {
        return result.rawMappings = map == null ? void 0 : map.getRawMappings();
      },

      set rawMappings(value) {
        Object.defineProperty(result, "rawMappings", {
          value,
          writable: true
        });
      }

    };
    return result;
  }

  append(str) {
    this._flush();

    const {
      line,
      column,
      filename,
      identifierName,
      force
    } = this._sourcePosition;

    this._append(str, line, column, identifierName, filename, force);
  }

  queue(str) {
    if (str === "\n") {
      while (this._queue.length > 0 && SPACES_RE.test(this._queue[0][0])) {
        this._queue.shift();
      }
    }

    const {
      line,
      column,
      filename,
      identifierName,
      force
    } = this._sourcePosition;

    this._queue.unshift([str, line, column, identifierName, filename, force]);
  }

  queueIndentation(str) {
    this._queue.unshift([str, undefined, undefined, undefined, undefined, false]);
  }

  _flush() {
    let item;

    while (item = this._queue.pop()) {
      this._append(...item);
    }
  }

  _append(str, line, column, identifierName, filename, force) {
    this._buf += str;
    this._last = str.charCodeAt(str.length - 1);
    let i = str.indexOf("\n");
    let last = 0;

    if (i !== 0) {
      this._mark(line, column, identifierName, filename, force);
    }

    while (i !== -1) {
      this._position.line++;
      this._position.column = 0;
      last = i + 1;

      if (last < str.length) {
        this._mark(++line, 0, identifierName, filename, force);
      }

      i = str.indexOf("\n", last);
    }

    this._position.column += str.length - last;
  }

  _mark(line, column, identifierName, filename, force) {
    var _this$_map;

    (_this$_map = this._map) == null ? void 0 : _this$_map.mark(this._position, line, column, identifierName, filename, force);
  }

  removeTrailingNewline() {
    if (this._queue.length > 0 && this._queue[0][0] === "\n") {
      this._queue.shift();
    }
  }

  removeLastSemicolon() {
    if (this._queue.length > 0 && this._queue[0][0] === ";") {
      this._queue.shift();
    }
  }

  getLastChar() {
    let last;

    if (this._queue.length > 0) {
      const str = this._queue[0][0];
      last = str.charCodeAt(0);
    } else {
      last = this._last;
    }

    return last;
  }

  endsWithCharAndNewline() {
    const queue = this._queue;

    if (queue.length > 0) {
      const last = queue[0][0];
      const lastCp = last.charCodeAt(0);
      if (lastCp !== 10) return;

      if (queue.length > 1) {
        const secondLast = queue[1][0];
        return secondLast.charCodeAt(0);
      } else {
        return this._last;
      }
    }
  }

  hasContent() {
    return this._queue.length > 0 || !!this._last;
  }

  exactSource(loc, cb) {
    this.source("start", loc, true);
    cb();
    this.source("end", loc);

    this._disallowPop("start", loc);
  }

  source(prop, loc, force) {
    if (prop && !loc) return;

    this._normalizePosition(prop, loc, this._sourcePosition, force);
  }

  withSource(prop, loc, cb) {
    if (!this._map) return cb();
    const originalLine = this._sourcePosition.line;
    const originalColumn = this._sourcePosition.column;
    const originalFilename = this._sourcePosition.filename;
    const originalIdentifierName = this._sourcePosition.identifierName;
    this.source(prop, loc);
    cb();

    if ((!this._sourcePosition.force || this._sourcePosition.line !== originalLine || this._sourcePosition.column !== originalColumn || this._sourcePosition.filename !== originalFilename) && (!this._disallowedPop || this._disallowedPop.line !== originalLine || this._disallowedPop.column !== originalColumn || this._disallowedPop.filename !== originalFilename)) {
      this._sourcePosition.line = originalLine;
      this._sourcePosition.column = originalColumn;
      this._sourcePosition.filename = originalFilename;
      this._sourcePosition.identifierName = originalIdentifierName;
      this._sourcePosition.force = false;
      this._disallowedPop = null;
    }
  }

  _disallowPop(prop, loc) {
    if (prop && !loc) return;
    this._disallowedPop = this._normalizePosition(prop, loc, SourcePos(), false);
  }

  _normalizePosition(prop, loc, targetObj, force) {
    const pos = loc ? loc[prop] : null;
    const origLine = targetObj.line;
    const origColumn = targetObj.column;
    const origFilename = targetObj.filename;
    targetObj.identifierName = prop === "start" && (loc == null ? void 0 : loc.identifierName) || null;
    targetObj.line = pos == null ? void 0 : pos.line;
    targetObj.column = pos == null ? void 0 : pos.column;
    targetObj.filename = loc == null ? void 0 : loc.filename;

    if (force || targetObj.line !== origLine || targetObj.column !== origColumn || targetObj.filename !== origFilename) {
      targetObj.force = force;
    }

    return targetObj;
  }

  getCurrentColumn() {
    const extra = this._queue.reduce((acc, item) => item[0] + acc, "");

    const lastIndex = extra.lastIndexOf("\n");
    return lastIndex === -1 ? this._position.column + extra.length : extra.length - 1 - lastIndex;
  }

  getCurrentLine() {
    const extra = this._queue.reduce((acc, item) => item[0] + acc, "");

    let count = 0;

    for (let i = 0; i < extra.length; i++) {
      if (extra[i] === "\n") count++;
    }

    return this._position.line + count;
  }

}

exports.default = Buffer;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001490, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.needsParens = needsParens;
exports.needsWhitespace = needsWhitespace;
exports.needsWhitespaceAfter = needsWhitespaceAfter;
exports.needsWhitespaceBefore = needsWhitespaceBefore;

var whitespace = require("./whitespace");

var parens = require("./parentheses");

var _t = require("@babel/types");

const {
  FLIPPED_ALIAS_KEYS,
  isCallExpression,
  isExpressionStatement,
  isMemberExpression,
  isNewExpression
} = _t;

function expandAliases(obj) {
  const newObj = {};

  function add(type, func) {
    const fn = newObj[type];
    newObj[type] = fn ? function (node, parent, stack) {
      const result = fn(node, parent, stack);
      return result == null ? func(node, parent, stack) : result;
    } : func;
  }

  for (const type of Object.keys(obj)) {
    const aliases = FLIPPED_ALIAS_KEYS[type];

    if (aliases) {
      for (const alias of aliases) {
        add(alias, obj[type]);
      }
    } else {
      add(type, obj[type]);
    }
  }

  return newObj;
}

const expandedParens = expandAliases(parens);
const expandedWhitespaceNodes = expandAliases(whitespace.nodes);
const expandedWhitespaceList = expandAliases(whitespace.list);

function find(obj, node, parent, printStack) {
  const fn = obj[node.type];
  return fn ? fn(node, parent, printStack) : null;
}

function isOrHasCallExpression(node) {
  if (isCallExpression(node)) {
    return true;
  }

  return isMemberExpression(node) && isOrHasCallExpression(node.object);
}

function needsWhitespace(node, parent, type) {
  if (!node) return 0;

  if (isExpressionStatement(node)) {
    node = node.expression;
  }

  let linesInfo = find(expandedWhitespaceNodes, node, parent);

  if (!linesInfo) {
    const items = find(expandedWhitespaceList, node, parent);

    if (items) {
      for (let i = 0; i < items.length; i++) {
        linesInfo = needsWhitespace(items[i], node, type);
        if (linesInfo) break;
      }
    }
  }

  if (typeof linesInfo === "object" && linesInfo !== null) {
    return linesInfo[type] || 0;
  }

  return 0;
}

function needsWhitespaceBefore(node, parent) {
  return needsWhitespace(node, parent, "before");
}

function needsWhitespaceAfter(node, parent) {
  return needsWhitespace(node, parent, "after");
}

function needsParens(node, parent, printStack) {
  if (!parent) return false;

  if (isNewExpression(parent) && parent.callee === node) {
    if (isOrHasCallExpression(node)) return true;
  }

  return find(expandedParens, node, parent, printStack);
}
}, function(modId) { var map = {"./whitespace":1679975001491,"./parentheses":1679975001492}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001491, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodes = exports.list = void 0;

var _t = require("@babel/types");

const {
  FLIPPED_ALIAS_KEYS,
  isArrayExpression,
  isAssignmentExpression,
  isBinary,
  isBlockStatement,
  isCallExpression,
  isFunction,
  isIdentifier,
  isLiteral,
  isMemberExpression,
  isObjectExpression,
  isOptionalCallExpression,
  isOptionalMemberExpression,
  isStringLiteral
} = _t;

function crawl(node, state = {}) {
  if (isMemberExpression(node) || isOptionalMemberExpression(node)) {
    crawl(node.object, state);
    if (node.computed) crawl(node.property, state);
  } else if (isBinary(node) || isAssignmentExpression(node)) {
    crawl(node.left, state);
    crawl(node.right, state);
  } else if (isCallExpression(node) || isOptionalCallExpression(node)) {
    state.hasCall = true;
    crawl(node.callee, state);
  } else if (isFunction(node)) {
    state.hasFunction = true;
  } else if (isIdentifier(node)) {
    state.hasHelper = state.hasHelper || isHelper(node.callee);
  }

  return state;
}

function isHelper(node) {
  if (isMemberExpression(node)) {
    return isHelper(node.object) || isHelper(node.property);
  } else if (isIdentifier(node)) {
    return node.name === "require" || node.name[0] === "_";
  } else if (isCallExpression(node)) {
    return isHelper(node.callee);
  } else if (isBinary(node) || isAssignmentExpression(node)) {
    return isIdentifier(node.left) && isHelper(node.left) || isHelper(node.right);
  } else {
    return false;
  }
}

function isType(node) {
  return isLiteral(node) || isObjectExpression(node) || isArrayExpression(node) || isIdentifier(node) || isMemberExpression(node);
}

const nodes = {
  AssignmentExpression(node) {
    const state = crawl(node.right);

    if (state.hasCall && state.hasHelper || state.hasFunction) {
      return {
        before: state.hasFunction,
        after: true
      };
    }
  },

  SwitchCase(node, parent) {
    return {
      before: !!node.consequent.length || parent.cases[0] === node,
      after: !node.consequent.length && parent.cases[parent.cases.length - 1] === node
    };
  },

  LogicalExpression(node) {
    if (isFunction(node.left) || isFunction(node.right)) {
      return {
        after: true
      };
    }
  },

  Literal(node) {
    if (isStringLiteral(node) && node.value === "use strict") {
      return {
        after: true
      };
    }
  },

  CallExpression(node) {
    if (isFunction(node.callee) || isHelper(node)) {
      return {
        before: true,
        after: true
      };
    }
  },

  OptionalCallExpression(node) {
    if (isFunction(node.callee)) {
      return {
        before: true,
        after: true
      };
    }
  },

  VariableDeclaration(node) {
    for (let i = 0; i < node.declarations.length; i++) {
      const declar = node.declarations[i];
      let enabled = isHelper(declar.id) && !isType(declar.init);

      if (!enabled) {
        const state = crawl(declar.init);
        enabled = isHelper(declar.init) && state.hasCall || state.hasFunction;
      }

      if (enabled) {
        return {
          before: true,
          after: true
        };
      }
    }
  },

  IfStatement(node) {
    if (isBlockStatement(node.consequent)) {
      return {
        before: true,
        after: true
      };
    }
  }

};
exports.nodes = nodes;

nodes.ObjectProperty = nodes.ObjectTypeProperty = nodes.ObjectMethod = function (node, parent) {
  if (parent.properties[0] === node) {
    return {
      before: true
    };
  }
};

nodes.ObjectTypeCallProperty = function (node, parent) {
  var _parent$properties;

  if (parent.callProperties[0] === node && !((_parent$properties = parent.properties) != null && _parent$properties.length)) {
    return {
      before: true
    };
  }
};

nodes.ObjectTypeIndexer = function (node, parent) {
  var _parent$properties2, _parent$callPropertie;

  if (parent.indexers[0] === node && !((_parent$properties2 = parent.properties) != null && _parent$properties2.length) && !((_parent$callPropertie = parent.callProperties) != null && _parent$callPropertie.length)) {
    return {
      before: true
    };
  }
};

nodes.ObjectTypeInternalSlot = function (node, parent) {
  var _parent$properties3, _parent$callPropertie2, _parent$indexers;

  if (parent.internalSlots[0] === node && !((_parent$properties3 = parent.properties) != null && _parent$properties3.length) && !((_parent$callPropertie2 = parent.callProperties) != null && _parent$callPropertie2.length) && !((_parent$indexers = parent.indexers) != null && _parent$indexers.length)) {
    return {
      before: true
    };
  }
};

const list = {
  VariableDeclaration(node) {
    return node.declarations.map(decl => decl.init);
  },

  ArrayExpression(node) {
    return node.elements;
  },

  ObjectExpression(node) {
    return node.properties;
  }

};
exports.list = list;
[["Function", true], ["Class", true], ["Loop", true], ["LabeledStatement", true], ["SwitchStatement", true], ["TryStatement", true]].forEach(function ([type, amounts]) {
  if (typeof amounts === "boolean") {
    amounts = {
      after: amounts,
      before: amounts
    };
  }

  [type].concat(FLIPPED_ALIAS_KEYS[type] || []).forEach(function (type) {
    nodes[type] = function () {
      return amounts;
    };
  });
});
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001492, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowFunctionExpression = ArrowFunctionExpression;
exports.AssignmentExpression = AssignmentExpression;
exports.Binary = Binary;
exports.BinaryExpression = BinaryExpression;
exports.ClassExpression = ClassExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.DoExpression = DoExpression;
exports.FunctionExpression = FunctionExpression;
exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
exports.Identifier = Identifier;
exports.LogicalExpression = LogicalExpression;
exports.NullableTypeAnnotation = NullableTypeAnnotation;
exports.ObjectExpression = ObjectExpression;
exports.OptionalIndexedAccessType = OptionalIndexedAccessType;
exports.OptionalCallExpression = exports.OptionalMemberExpression = OptionalMemberExpression;
exports.SequenceExpression = SequenceExpression;
exports.TSAsExpression = TSAsExpression;
exports.TSInferType = TSInferType;
exports.TSTypeAssertion = TSTypeAssertion;
exports.TSIntersectionType = exports.TSUnionType = TSUnionType;
exports.UnaryLike = UnaryLike;
exports.IntersectionTypeAnnotation = exports.UnionTypeAnnotation = UnionTypeAnnotation;
exports.UpdateExpression = UpdateExpression;
exports.AwaitExpression = exports.YieldExpression = YieldExpression;

var _t = require("@babel/types");

const {
  isArrayTypeAnnotation,
  isArrowFunctionExpression,
  isAssignmentExpression,
  isAwaitExpression,
  isBinary,
  isBinaryExpression,
  isCallExpression,
  isClassDeclaration,
  isClassExpression,
  isConditional,
  isConditionalExpression,
  isExportDeclaration,
  isExportDefaultDeclaration,
  isExpressionStatement,
  isFor,
  isForInStatement,
  isForOfStatement,
  isForStatement,
  isIfStatement,
  isIndexedAccessType,
  isIntersectionTypeAnnotation,
  isLogicalExpression,
  isMemberExpression,
  isNewExpression,
  isNullableTypeAnnotation,
  isObjectPattern,
  isOptionalCallExpression,
  isOptionalMemberExpression,
  isReturnStatement,
  isSequenceExpression,
  isSwitchStatement,
  isTSArrayType,
  isTSAsExpression,
  isTSIntersectionType,
  isTSNonNullExpression,
  isTSOptionalType,
  isTSRestType,
  isTSTypeAssertion,
  isTSUnionType,
  isTaggedTemplateExpression,
  isThrowStatement,
  isTypeAnnotation,
  isUnaryLike,
  isUnionTypeAnnotation,
  isVariableDeclarator,
  isWhileStatement,
  isYieldExpression
} = _t;
const PRECEDENCE = {
  "||": 0,
  "??": 0,
  "&&": 1,
  "|": 2,
  "^": 3,
  "&": 4,
  "==": 5,
  "===": 5,
  "!=": 5,
  "!==": 5,
  "<": 6,
  ">": 6,
  "<=": 6,
  ">=": 6,
  in: 6,
  instanceof: 6,
  ">>": 7,
  "<<": 7,
  ">>>": 7,
  "+": 8,
  "-": 8,
  "*": 9,
  "/": 9,
  "%": 9,
  "**": 10
};

const isClassExtendsClause = (node, parent) => (isClassDeclaration(parent) || isClassExpression(parent)) && parent.superClass === node;

const hasPostfixPart = (node, parent) => (isMemberExpression(parent) || isOptionalMemberExpression(parent)) && parent.object === node || (isCallExpression(parent) || isOptionalCallExpression(parent) || isNewExpression(parent)) && parent.callee === node || isTaggedTemplateExpression(parent) && parent.tag === node || isTSNonNullExpression(parent);

function NullableTypeAnnotation(node, parent) {
  return isArrayTypeAnnotation(parent);
}

function FunctionTypeAnnotation(node, parent, printStack) {
  return isUnionTypeAnnotation(parent) || isIntersectionTypeAnnotation(parent) || isArrayTypeAnnotation(parent) || isTypeAnnotation(parent) && isArrowFunctionExpression(printStack[printStack.length - 3]);
}

function UpdateExpression(node, parent) {
  return hasPostfixPart(node, parent) || isClassExtendsClause(node, parent);
}

function ObjectExpression(node, parent, printStack) {
  return isFirstInContext(printStack, {
    expressionStatement: true,
    arrowBody: true
  });
}

function DoExpression(node, parent, printStack) {
  return !node.async && isFirstInContext(printStack, {
    expressionStatement: true
  });
}

function Binary(node, parent) {
  if (node.operator === "**" && isBinaryExpression(parent, {
    operator: "**"
  })) {
    return parent.left === node;
  }

  if (isClassExtendsClause(node, parent)) {
    return true;
  }

  if (hasPostfixPart(node, parent) || isUnaryLike(parent) || isAwaitExpression(parent)) {
    return true;
  }

  if (isBinary(parent)) {
    const parentOp = parent.operator;
    const parentPos = PRECEDENCE[parentOp];
    const nodeOp = node.operator;
    const nodePos = PRECEDENCE[nodeOp];

    if (parentPos === nodePos && parent.right === node && !isLogicalExpression(parent) || parentPos > nodePos) {
      return true;
    }
  }
}

function UnionTypeAnnotation(node, parent) {
  return isArrayTypeAnnotation(parent) || isNullableTypeAnnotation(parent) || isIntersectionTypeAnnotation(parent) || isUnionTypeAnnotation(parent);
}

function OptionalIndexedAccessType(node, parent) {
  return isIndexedAccessType(parent, {
    objectType: node
  });
}

function TSAsExpression() {
  return true;
}

function TSTypeAssertion() {
  return true;
}

function TSUnionType(node, parent) {
  return isTSArrayType(parent) || isTSOptionalType(parent) || isTSIntersectionType(parent) || isTSUnionType(parent) || isTSRestType(parent);
}

function TSInferType(node, parent) {
  return isTSArrayType(parent) || isTSOptionalType(parent);
}

function BinaryExpression(node, parent) {
  return node.operator === "in" && (isVariableDeclarator(parent) || isFor(parent));
}

function SequenceExpression(node, parent) {
  if (isForStatement(parent) || isThrowStatement(parent) || isReturnStatement(parent) || isIfStatement(parent) && parent.test === node || isWhileStatement(parent) && parent.test === node || isForInStatement(parent) && parent.right === node || isSwitchStatement(parent) && parent.discriminant === node || isExpressionStatement(parent) && parent.expression === node) {
    return false;
  }

  return true;
}

function YieldExpression(node, parent) {
  return isBinary(parent) || isUnaryLike(parent) || hasPostfixPart(node, parent) || isAwaitExpression(parent) && isYieldExpression(node) || isConditionalExpression(parent) && node === parent.test || isClassExtendsClause(node, parent);
}

function ClassExpression(node, parent, printStack) {
  return isFirstInContext(printStack, {
    expressionStatement: true,
    exportDefault: true
  });
}

function UnaryLike(node, parent) {
  return hasPostfixPart(node, parent) || isBinaryExpression(parent, {
    operator: "**",
    left: node
  }) || isClassExtendsClause(node, parent);
}

function FunctionExpression(node, parent, printStack) {
  return isFirstInContext(printStack, {
    expressionStatement: true,
    exportDefault: true
  });
}

function ArrowFunctionExpression(node, parent) {
  return isExportDeclaration(parent) || ConditionalExpression(node, parent);
}

function ConditionalExpression(node, parent) {
  if (isUnaryLike(parent) || isBinary(parent) || isConditionalExpression(parent, {
    test: node
  }) || isAwaitExpression(parent) || isTSTypeAssertion(parent) || isTSAsExpression(parent)) {
    return true;
  }

  return UnaryLike(node, parent);
}

function OptionalMemberExpression(node, parent) {
  return isCallExpression(parent, {
    callee: node
  }) || isMemberExpression(parent, {
    object: node
  });
}

function AssignmentExpression(node, parent) {
  if (isObjectPattern(node.left)) {
    return true;
  } else {
    return ConditionalExpression(node, parent);
  }
}

function LogicalExpression(node, parent) {
  switch (node.operator) {
    case "||":
      if (!isLogicalExpression(parent)) return false;
      return parent.operator === "??" || parent.operator === "&&";

    case "&&":
      return isLogicalExpression(parent, {
        operator: "??"
      });

    case "??":
      return isLogicalExpression(parent) && parent.operator !== "??";
  }
}

function Identifier(node, parent, printStack) {
  if (node.name === "let") {
    const isFollowedByBracket = isMemberExpression(parent, {
      object: node,
      computed: true
    }) || isOptionalMemberExpression(parent, {
      object: node,
      computed: true,
      optional: false
    });
    return isFirstInContext(printStack, {
      expressionStatement: isFollowedByBracket,
      forHead: isFollowedByBracket,
      forInHead: isFollowedByBracket,
      forOfHead: true
    });
  }

  return node.name === "async" && isForOfStatement(parent) && node === parent.left;
}

function isFirstInContext(printStack, {
  expressionStatement = false,
  arrowBody = false,
  exportDefault = false,
  forHead = false,
  forInHead = false,
  forOfHead = false
}) {
  let i = printStack.length - 1;
  let node = printStack[i];
  i--;
  let parent = printStack[i];

  while (i >= 0) {
    if (expressionStatement && isExpressionStatement(parent, {
      expression: node
    }) || exportDefault && isExportDefaultDeclaration(parent, {
      declaration: node
    }) || arrowBody && isArrowFunctionExpression(parent, {
      body: node
    }) || forHead && isForStatement(parent, {
      init: node
    }) || forInHead && isForInStatement(parent, {
      left: node
    }) || forOfHead && isForOfStatement(parent, {
      left: node
    })) {
      return true;
    }

    if (hasPostfixPart(node, parent) && !isNewExpression(parent) || isSequenceExpression(parent) && parent.expressions[0] === node || isConditional(parent, {
      test: node
    }) || isBinary(parent, {
      left: node
    }) || isAssignmentExpression(parent, {
      left: node
    })) {
      node = parent;
      i--;
      parent = printStack[i];
    } else {
      return false;
    }
  }

  return false;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001493, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateLiterals = require("./template-literals");

Object.keys(_templateLiterals).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _templateLiterals[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _templateLiterals[key];
    }
  });
});

var _expressions = require("./expressions");

Object.keys(_expressions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _expressions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _expressions[key];
    }
  });
});

var _statements = require("./statements");

Object.keys(_statements).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _statements[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _statements[key];
    }
  });
});

var _classes = require("./classes");

Object.keys(_classes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _classes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _classes[key];
    }
  });
});

var _methods = require("./methods");

Object.keys(_methods).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _methods[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _methods[key];
    }
  });
});

var _modules = require("./modules");

Object.keys(_modules).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _modules[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _modules[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _flow = require("./flow");

Object.keys(_flow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _flow[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _flow[key];
    }
  });
});

var _base = require("./base");

Object.keys(_base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _base[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base[key];
    }
  });
});

var _jsx = require("./jsx");

Object.keys(_jsx).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _jsx[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jsx[key];
    }
  });
});

var _typescript = require("./typescript");

Object.keys(_typescript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _typescript[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _typescript[key];
    }
  });
});
}, function(modId) { var map = {"./template-literals":1679975001494,"./expressions":1679975001495,"./statements":1679975001496,"./classes":1679975001497,"./methods":1679975001498,"./modules":1679975001499,"./types":1679975001500,"./flow":1679975001501,"./base":1679975001502,"./jsx":1679975001503,"./typescript":1679975001504}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001494, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaggedTemplateExpression = TaggedTemplateExpression;
exports.TemplateElement = TemplateElement;
exports.TemplateLiteral = TemplateLiteral;

function TaggedTemplateExpression(node) {
  this.print(node.tag, node);
  this.print(node.typeParameters, node);
  this.print(node.quasi, node);
}

function TemplateElement(node, parent) {
  const isFirst = parent.quasis[0] === node;
  const isLast = parent.quasis[parent.quasis.length - 1] === node;
  const value = (isFirst ? "`" : "}") + node.value.raw + (isLast ? "`" : "${");
  this.token(value);
}

function TemplateLiteral(node) {
  const quasis = node.quasis;

  for (let i = 0; i < quasis.length; i++) {
    this.print(quasis[i], node);

    if (i + 1 < quasis.length) {
      this.print(node.expressions[i], node);
    }
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001495, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogicalExpression = exports.BinaryExpression = exports.AssignmentExpression = AssignmentExpression;
exports.AssignmentPattern = AssignmentPattern;
exports.AwaitExpression = void 0;
exports.BindExpression = BindExpression;
exports.CallExpression = CallExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.Decorator = Decorator;
exports.DoExpression = DoExpression;
exports.EmptyStatement = EmptyStatement;
exports.ExpressionStatement = ExpressionStatement;
exports.Import = Import;
exports.MemberExpression = MemberExpression;
exports.MetaProperty = MetaProperty;
exports.ModuleExpression = ModuleExpression;
exports.NewExpression = NewExpression;
exports.OptionalCallExpression = OptionalCallExpression;
exports.OptionalMemberExpression = OptionalMemberExpression;
exports.ParenthesizedExpression = ParenthesizedExpression;
exports.PrivateName = PrivateName;
exports.SequenceExpression = SequenceExpression;
exports.Super = Super;
exports.ThisExpression = ThisExpression;
exports.UnaryExpression = UnaryExpression;
exports.UpdateExpression = UpdateExpression;
exports.V8IntrinsicIdentifier = V8IntrinsicIdentifier;
exports.YieldExpression = void 0;

var _t = require("@babel/types");

var n = require("../node");

const {
  isCallExpression,
  isLiteral,
  isMemberExpression,
  isNewExpression
} = _t;

function UnaryExpression(node) {
  if (node.operator === "void" || node.operator === "delete" || node.operator === "typeof" || node.operator === "throw") {
    this.word(node.operator);
    this.space();
  } else {
    this.token(node.operator);
  }

  this.print(node.argument, node);
}

function DoExpression(node) {
  if (node.async) {
    this.word("async");
    this.space();
  }

  this.word("do");
  this.space();
  this.print(node.body, node);
}

function ParenthesizedExpression(node) {
  this.token("(");
  this.print(node.expression, node);
  this.token(")");
}

function UpdateExpression(node) {
  if (node.prefix) {
    this.token(node.operator);
    this.print(node.argument, node);
  } else {
    this.startTerminatorless(true);
    this.print(node.argument, node);
    this.endTerminatorless();
    this.token(node.operator);
  }
}

function ConditionalExpression(node) {
  this.print(node.test, node);
  this.space();
  this.token("?");
  this.space();
  this.print(node.consequent, node);
  this.space();
  this.token(":");
  this.space();
  this.print(node.alternate, node);
}

function NewExpression(node, parent) {
  this.word("new");
  this.space();
  this.print(node.callee, node);

  if (this.format.minified && node.arguments.length === 0 && !node.optional && !isCallExpression(parent, {
    callee: node
  }) && !isMemberExpression(parent) && !isNewExpression(parent)) {
    return;
  }

  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);

  if (node.optional) {
    this.token("?.");
  }

  this.token("(");
  this.printList(node.arguments, node);
  this.token(")");
}

function SequenceExpression(node) {
  this.printList(node.expressions, node);
}

function ThisExpression() {
  this.word("this");
}

function Super() {
  this.word("super");
}

function isDecoratorMemberExpression(node) {
  switch (node.type) {
    case "Identifier":
      return true;

    case "MemberExpression":
      return !node.computed && node.property.type === "Identifier" && isDecoratorMemberExpression(node.object);

    default:
      return false;
  }
}

function shouldParenthesizeDecoratorExpression(node) {
  if (node.type === "CallExpression") {
    node = node.callee;
  }

  if (node.type === "ParenthesizedExpression") {
    return false;
  }

  return !isDecoratorMemberExpression(node);
}

function Decorator(node) {
  this.token("@");
  const {
    expression
  } = node;

  if (shouldParenthesizeDecoratorExpression(expression)) {
    this.token("(");
    this.print(expression, node);
    this.token(")");
  } else {
    this.print(expression, node);
  }

  this.newline();
}

function OptionalMemberExpression(node) {
  this.print(node.object, node);

  if (!node.computed && isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  let computed = node.computed;

  if (isLiteral(node.property) && typeof node.property.value === "number") {
    computed = true;
  }

  if (node.optional) {
    this.token("?.");
  }

  if (computed) {
    this.token("[");
    this.print(node.property, node);
    this.token("]");
  } else {
    if (!node.optional) {
      this.token(".");
    }

    this.print(node.property, node);
  }
}

function OptionalCallExpression(node) {
  this.print(node.callee, node);
  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);

  if (node.optional) {
    this.token("?.");
  }

  this.token("(");
  this.printList(node.arguments, node);
  this.token(")");
}

function CallExpression(node) {
  this.print(node.callee, node);
  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);
  this.token("(");
  this.printList(node.arguments, node);
  this.token(")");
}

function Import() {
  this.word("import");
}

function buildYieldAwait(keyword) {
  return function (node) {
    this.word(keyword);

    if (node.delegate) {
      this.token("*");
    }

    if (node.argument) {
      this.space();
      const terminatorState = this.startTerminatorless();
      this.print(node.argument, node);
      this.endTerminatorless(terminatorState);
    }
  };
}

const YieldExpression = buildYieldAwait("yield");
exports.YieldExpression = YieldExpression;
const AwaitExpression = buildYieldAwait("await");
exports.AwaitExpression = AwaitExpression;

function EmptyStatement() {
  this.semicolon(true);
}

function ExpressionStatement(node) {
  this.print(node.expression, node);
  this.semicolon();
}

function AssignmentPattern(node) {
  this.print(node.left, node);
  if (node.left.optional) this.token("?");
  this.print(node.left.typeAnnotation, node);
  this.space();
  this.token("=");
  this.space();
  this.print(node.right, node);
}

function AssignmentExpression(node, parent) {
  const parens = this.inForStatementInitCounter && node.operator === "in" && !n.needsParens(node, parent);

  if (parens) {
    this.token("(");
  }

  this.print(node.left, node);
  this.space();

  if (node.operator === "in" || node.operator === "instanceof") {
    this.word(node.operator);
  } else {
    this.token(node.operator);
  }

  this.space();
  this.print(node.right, node);

  if (parens) {
    this.token(")");
  }
}

function BindExpression(node) {
  this.print(node.object, node);
  this.token("::");
  this.print(node.callee, node);
}

function MemberExpression(node) {
  this.print(node.object, node);

  if (!node.computed && isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  let computed = node.computed;

  if (isLiteral(node.property) && typeof node.property.value === "number") {
    computed = true;
  }

  if (computed) {
    this.token("[");
    this.print(node.property, node);
    this.token("]");
  } else {
    this.token(".");
    this.print(node.property, node);
  }
}

function MetaProperty(node) {
  this.print(node.meta, node);
  this.token(".");
  this.print(node.property, node);
}

function PrivateName(node) {
  this.token("#");
  this.print(node.id, node);
}

function V8IntrinsicIdentifier(node) {
  this.token("%");
  this.word(node.name);
}

function ModuleExpression(node) {
  this.word("module");
  this.space();
  this.token("{");

  if (node.body.body.length === 0) {
    this.token("}");
  } else {
    this.newline();
    this.printSequence(node.body.body, node, {
      indent: true
    });
    this.rightBrace();
  }
}
}, function(modId) { var map = {"../node":1679975001490}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001496, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreakStatement = void 0;
exports.CatchClause = CatchClause;
exports.ContinueStatement = void 0;
exports.DebuggerStatement = DebuggerStatement;
exports.DoWhileStatement = DoWhileStatement;
exports.ForOfStatement = exports.ForInStatement = void 0;
exports.ForStatement = ForStatement;
exports.IfStatement = IfStatement;
exports.LabeledStatement = LabeledStatement;
exports.ReturnStatement = void 0;
exports.SwitchCase = SwitchCase;
exports.SwitchStatement = SwitchStatement;
exports.ThrowStatement = void 0;
exports.TryStatement = TryStatement;
exports.VariableDeclaration = VariableDeclaration;
exports.VariableDeclarator = VariableDeclarator;
exports.WhileStatement = WhileStatement;
exports.WithStatement = WithStatement;

var _t = require("@babel/types");

const {
  isFor,
  isForStatement,
  isIfStatement,
  isStatement
} = _t;

function WithStatement(node) {
  this.word("with");
  this.space();
  this.token("(");
  this.print(node.object, node);
  this.token(")");
  this.printBlock(node);
}

function IfStatement(node) {
  this.word("if");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.space();
  const needsBlock = node.alternate && isIfStatement(getLastStatement(node.consequent));

  if (needsBlock) {
    this.token("{");
    this.newline();
    this.indent();
  }

  this.printAndIndentOnComments(node.consequent, node);

  if (needsBlock) {
    this.dedent();
    this.newline();
    this.token("}");
  }

  if (node.alternate) {
    if (this.endsWith(125)) this.space();
    this.word("else");
    this.space();
    this.printAndIndentOnComments(node.alternate, node);
  }
}

function getLastStatement(statement) {
  if (!isStatement(statement.body)) return statement;
  return getLastStatement(statement.body);
}

function ForStatement(node) {
  this.word("for");
  this.space();
  this.token("(");
  this.inForStatementInitCounter++;
  this.print(node.init, node);
  this.inForStatementInitCounter--;
  this.token(";");

  if (node.test) {
    this.space();
    this.print(node.test, node);
  }

  this.token(";");

  if (node.update) {
    this.space();
    this.print(node.update, node);
  }

  this.token(")");
  this.printBlock(node);
}

function WhileStatement(node) {
  this.word("while");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.printBlock(node);
}

const buildForXStatement = function (op) {
  return function (node) {
    this.word("for");
    this.space();

    if (op === "of" && node.await) {
      this.word("await");
      this.space();
    }

    this.token("(");
    this.print(node.left, node);
    this.space();
    this.word(op);
    this.space();
    this.print(node.right, node);
    this.token(")");
    this.printBlock(node);
  };
};

const ForInStatement = buildForXStatement("in");
exports.ForInStatement = ForInStatement;
const ForOfStatement = buildForXStatement("of");
exports.ForOfStatement = ForOfStatement;

function DoWhileStatement(node) {
  this.word("do");
  this.space();
  this.print(node.body, node);
  this.space();
  this.word("while");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.semicolon();
}

function buildLabelStatement(prefix, key = "label") {
  return function (node) {
    this.word(prefix);
    const label = node[key];

    if (label) {
      this.space();
      const isLabel = key == "label";
      const terminatorState = this.startTerminatorless(isLabel);
      this.print(label, node);
      this.endTerminatorless(terminatorState);
    }

    this.semicolon();
  };
}

const ContinueStatement = buildLabelStatement("continue");
exports.ContinueStatement = ContinueStatement;
const ReturnStatement = buildLabelStatement("return", "argument");
exports.ReturnStatement = ReturnStatement;
const BreakStatement = buildLabelStatement("break");
exports.BreakStatement = BreakStatement;
const ThrowStatement = buildLabelStatement("throw", "argument");
exports.ThrowStatement = ThrowStatement;

function LabeledStatement(node) {
  this.print(node.label, node);
  this.token(":");
  this.space();
  this.print(node.body, node);
}

function TryStatement(node) {
  this.word("try");
  this.space();
  this.print(node.block, node);
  this.space();

  if (node.handlers) {
    this.print(node.handlers[0], node);
  } else {
    this.print(node.handler, node);
  }

  if (node.finalizer) {
    this.space();
    this.word("finally");
    this.space();
    this.print(node.finalizer, node);
  }
}

function CatchClause(node) {
  this.word("catch");
  this.space();

  if (node.param) {
    this.token("(");
    this.print(node.param, node);
    this.print(node.param.typeAnnotation, node);
    this.token(")");
    this.space();
  }

  this.print(node.body, node);
}

function SwitchStatement(node) {
  this.word("switch");
  this.space();
  this.token("(");
  this.print(node.discriminant, node);
  this.token(")");
  this.space();
  this.token("{");
  this.printSequence(node.cases, node, {
    indent: true,

    addNewlines(leading, cas) {
      if (!leading && node.cases[node.cases.length - 1] === cas) return -1;
    }

  });
  this.token("}");
}

function SwitchCase(node) {
  if (node.test) {
    this.word("case");
    this.space();
    this.print(node.test, node);
    this.token(":");
  } else {
    this.word("default");
    this.token(":");
  }

  if (node.consequent.length) {
    this.newline();
    this.printSequence(node.consequent, node, {
      indent: true
    });
  }
}

function DebuggerStatement() {
  this.word("debugger");
  this.semicolon();
}

function variableDeclarationIndent() {
  this.token(",");
  this.newline();

  if (this.endsWith(10)) {
    for (let i = 0; i < 4; i++) this.space(true);
  }
}

function constDeclarationIndent() {
  this.token(",");
  this.newline();

  if (this.endsWith(10)) {
    for (let i = 0; i < 6; i++) this.space(true);
  }
}

function VariableDeclaration(node, parent) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }

  this.word(node.kind);
  this.space();
  let hasInits = false;

  if (!isFor(parent)) {
    for (const declar of node.declarations) {
      if (declar.init) {
        hasInits = true;
      }
    }
  }

  let separator;

  if (hasInits) {
    separator = node.kind === "const" ? constDeclarationIndent : variableDeclarationIndent;
  }

  this.printList(node.declarations, node, {
    separator
  });

  if (isFor(parent)) {
    if (isForStatement(parent)) {
      if (parent.init === node) return;
    } else {
      if (parent.left === node) return;
    }
  }

  this.semicolon();
}

function VariableDeclarator(node) {
  this.print(node.id, node);
  if (node.definite) this.token("!");
  this.print(node.id.typeAnnotation, node);

  if (node.init) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.init, node);
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001497, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClassAccessorProperty = ClassAccessorProperty;
exports.ClassBody = ClassBody;
exports.ClassExpression = exports.ClassDeclaration = ClassDeclaration;
exports.ClassMethod = ClassMethod;
exports.ClassPrivateMethod = ClassPrivateMethod;
exports.ClassPrivateProperty = ClassPrivateProperty;
exports.ClassProperty = ClassProperty;
exports.StaticBlock = StaticBlock;
exports._classMethodHead = _classMethodHead;

var _t = require("@babel/types");

const {
  isExportDefaultDeclaration,
  isExportNamedDeclaration
} = _t;

function ClassDeclaration(node, parent) {
  if (!this.format.decoratorsBeforeExport || !isExportDefaultDeclaration(parent) && !isExportNamedDeclaration(parent)) {
    this.printJoin(node.decorators, node);
  }

  if (node.declare) {
    this.word("declare");
    this.space();
  }

  if (node.abstract) {
    this.word("abstract");
    this.space();
  }

  this.word("class");
  this.printInnerComments(node);

  if (node.id) {
    this.space();
    this.print(node.id, node);
  }

  this.print(node.typeParameters, node);

  if (node.superClass) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.superClass, node);
    this.print(node.superTypeParameters, node);
  }

  if (node.implements) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements, node);
  }

  this.space();
  this.print(node.body, node);
}

function ClassBody(node) {
  this.token("{");
  this.printInnerComments(node);

  if (node.body.length === 0) {
    this.token("}");
  } else {
    this.newline();
    this.indent();
    this.printSequence(node.body, node);
    this.dedent();
    if (!this.endsWith(10)) this.newline();
    this.rightBrace();
  }
}

function ClassProperty(node) {
  this.printJoin(node.decorators, node);
  this.source("end", node.key.loc);
  this.tsPrintClassMemberModifiers(node, true);

  if (node.computed) {
    this.token("[");
    this.print(node.key, node);
    this.token("]");
  } else {
    this._variance(node);

    this.print(node.key, node);
  }

  if (node.optional) {
    this.token("?");
  }

  if (node.definite) {
    this.token("!");
  }

  this.print(node.typeAnnotation, node);

  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value, node);
  }

  this.semicolon();
}

function ClassAccessorProperty(node) {
  this.printJoin(node.decorators, node);
  this.source("end", node.key.loc);
  this.tsPrintClassMemberModifiers(node, true);
  this.word("accessor");
  this.printInnerComments(node);
  this.space();

  if (node.computed) {
    this.token("[");
    this.print(node.key, node);
    this.token("]");
  } else {
    this._variance(node);

    this.print(node.key, node);
  }

  if (node.optional) {
    this.token("?");
  }

  if (node.definite) {
    this.token("!");
  }

  this.print(node.typeAnnotation, node);

  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value, node);
  }

  this.semicolon();
}

function ClassPrivateProperty(node) {
  this.printJoin(node.decorators, node);

  if (node.static) {
    this.word("static");
    this.space();
  }

  this.print(node.key, node);
  this.print(node.typeAnnotation, node);

  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value, node);
  }

  this.semicolon();
}

function ClassMethod(node) {
  this._classMethodHead(node);

  this.space();
  this.print(node.body, node);
}

function ClassPrivateMethod(node) {
  this._classMethodHead(node);

  this.space();
  this.print(node.body, node);
}

function _classMethodHead(node) {
  this.printJoin(node.decorators, node);
  this.source("end", node.key.loc);
  this.tsPrintClassMemberModifiers(node, false);

  this._methodHead(node);
}

function StaticBlock(node) {
  this.word("static");
  this.space();
  this.token("{");

  if (node.body.length === 0) {
    this.token("}");
  } else {
    this.newline();
    this.printSequence(node.body, node, {
      indent: true
    });
    this.rightBrace();
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001498, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowFunctionExpression = ArrowFunctionExpression;
exports.FunctionDeclaration = exports.FunctionExpression = FunctionExpression;
exports._functionHead = _functionHead;
exports._methodHead = _methodHead;
exports._param = _param;
exports._parameters = _parameters;
exports._params = _params;
exports._predicate = _predicate;

var _t = require("@babel/types");

const {
  isIdentifier
} = _t;

function _params(node) {
  this.print(node.typeParameters, node);
  this.token("(");

  this._parameters(node.params, node);

  this.token(")");
  this.print(node.returnType, node);
}

function _parameters(parameters, parent) {
  for (let i = 0; i < parameters.length; i++) {
    this._param(parameters[i], parent);

    if (i < parameters.length - 1) {
      this.token(",");
      this.space();
    }
  }
}

function _param(parameter, parent) {
  this.printJoin(parameter.decorators, parameter);
  this.print(parameter, parent);
  if (parameter.optional) this.token("?");
  this.print(parameter.typeAnnotation, parameter);
}

function _methodHead(node) {
  const kind = node.kind;
  const key = node.key;

  if (kind === "get" || kind === "set") {
    this.word(kind);
    this.space();
  }

  if (node.async) {
    this._catchUp("start", key.loc);

    this.word("async");
    this.space();
  }

  if (kind === "method" || kind === "init") {
    if (node.generator) {
      this.token("*");
    }
  }

  if (node.computed) {
    this.token("[");
    this.print(key, node);
    this.token("]");
  } else {
    this.print(key, node);
  }

  if (node.optional) {
    this.token("?");
  }

  this._params(node);
}

function _predicate(node) {
  if (node.predicate) {
    if (!node.returnType) {
      this.token(":");
    }

    this.space();
    this.print(node.predicate, node);
  }
}

function _functionHead(node) {
  if (node.async) {
    this.word("async");
    this.space();
  }

  this.word("function");
  if (node.generator) this.token("*");
  this.printInnerComments(node);
  this.space();

  if (node.id) {
    this.print(node.id, node);
  }

  this._params(node);

  this._predicate(node);
}

function FunctionExpression(node) {
  this._functionHead(node);

  this.space();
  this.print(node.body, node);
}

function ArrowFunctionExpression(node) {
  if (node.async) {
    this.word("async");
    this.space();
  }

  const firstParam = node.params[0];

  if (!this.format.retainLines && !this.format.auxiliaryCommentBefore && !this.format.auxiliaryCommentAfter && node.params.length === 1 && isIdentifier(firstParam) && !hasTypesOrComments(node, firstParam)) {
    this.print(firstParam, node);
  } else {
    this._params(node);
  }

  this._predicate(node);

  this.space();
  this.token("=>");
  this.space();
  this.print(node.body, node);
}

function hasTypesOrComments(node, param) {
  var _param$leadingComment, _param$trailingCommen;

  return !!(node.typeParameters || node.returnType || node.predicate || param.typeAnnotation || param.optional || (_param$leadingComment = param.leadingComments) != null && _param$leadingComment.length || (_param$trailingCommen = param.trailingComments) != null && _param$trailingCommen.length);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001499, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportAllDeclaration = ExportAllDeclaration;
exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
exports.ExportDefaultSpecifier = ExportDefaultSpecifier;
exports.ExportNamedDeclaration = ExportNamedDeclaration;
exports.ExportNamespaceSpecifier = ExportNamespaceSpecifier;
exports.ExportSpecifier = ExportSpecifier;
exports.ImportAttribute = ImportAttribute;
exports.ImportDeclaration = ImportDeclaration;
exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
exports.ImportSpecifier = ImportSpecifier;

var _t = require("@babel/types");

const {
  isClassDeclaration,
  isExportDefaultSpecifier,
  isExportNamespaceSpecifier,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isStatement
} = _t;

function ImportSpecifier(node) {
  if (node.importKind === "type" || node.importKind === "typeof") {
    this.word(node.importKind);
    this.space();
  }

  this.print(node.imported, node);

  if (node.local && node.local.name !== node.imported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.local, node);
  }
}

function ImportDefaultSpecifier(node) {
  this.print(node.local, node);
}

function ExportDefaultSpecifier(node) {
  this.print(node.exported, node);
}

function ExportSpecifier(node) {
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }

  this.print(node.local, node);

  if (node.exported && node.local.name !== node.exported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.exported, node);
  }
}

function ExportNamespaceSpecifier(node) {
  this.token("*");
  this.space();
  this.word("as");
  this.space();
  this.print(node.exported, node);
}

function ExportAllDeclaration(node) {
  this.word("export");
  this.space();

  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }

  this.token("*");
  this.space();
  this.word("from");
  this.space();
  this.print(node.source, node);
  this.printAssertions(node);
  this.semicolon();
}

function ExportNamedDeclaration(node) {
  if (this.format.decoratorsBeforeExport && isClassDeclaration(node.declaration)) {
    this.printJoin(node.declaration.decorators, node);
  }

  this.word("export");
  this.space();
  ExportDeclaration.apply(this, arguments);
}

function ExportDefaultDeclaration(node) {
  if (this.format.decoratorsBeforeExport && isClassDeclaration(node.declaration)) {
    this.printJoin(node.declaration.decorators, node);
  }

  this.word("export");
  this.space();
  this.word("default");
  this.space();
  ExportDeclaration.apply(this, arguments);
}

function ExportDeclaration(node) {
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar, node);
    if (!isStatement(declar)) this.semicolon();
  } else {
    if (node.exportKind === "type") {
      this.word("type");
      this.space();
    }

    const specifiers = node.specifiers.slice(0);
    let hasSpecial = false;

    for (;;) {
      const first = specifiers[0];

      if (isExportDefaultSpecifier(first) || isExportNamespaceSpecifier(first)) {
        hasSpecial = true;
        this.print(specifiers.shift(), node);

        if (specifiers.length) {
          this.token(",");
          this.space();
        }
      } else {
        break;
      }
    }

    if (specifiers.length || !specifiers.length && !hasSpecial) {
      this.token("{");

      if (specifiers.length) {
        this.space();
        this.printList(specifiers, node);
        this.space();
      }

      this.token("}");
    }

    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      this.print(node.source, node);
      this.printAssertions(node);
    }

    this.semicolon();
  }
}

function ImportDeclaration(node) {
  this.word("import");
  this.space();
  const isTypeKind = node.importKind === "type" || node.importKind === "typeof";

  if (isTypeKind) {
    this.word(node.importKind);
    this.space();
  }

  const specifiers = node.specifiers.slice(0);
  const hasSpecifiers = !!specifiers.length;

  while (hasSpecifiers) {
    const first = specifiers[0];

    if (isImportDefaultSpecifier(first) || isImportNamespaceSpecifier(first)) {
      this.print(specifiers.shift(), node);

      if (specifiers.length) {
        this.token(",");
        this.space();
      }
    } else {
      break;
    }
  }

  if (specifiers.length) {
    this.token("{");
    this.space();
    this.printList(specifiers, node);
    this.space();
    this.token("}");
  } else if (isTypeKind && !hasSpecifiers) {
    this.token("{");
    this.token("}");
  }

  if (hasSpecifiers || isTypeKind) {
    this.space();
    this.word("from");
    this.space();
  }

  this.print(node.source, node);
  this.printAssertions(node);
  {
    var _node$attributes;

    if ((_node$attributes = node.attributes) != null && _node$attributes.length) {
      this.space();
      this.word("with");
      this.space();
      this.printList(node.attributes, node);
    }
  }
  this.semicolon();
}

function ImportAttribute(node) {
  this.print(node.key);
  this.token(":");
  this.space();
  this.print(node.value);
}

function ImportNamespaceSpecifier(node) {
  this.token("*");
  this.space();
  this.word("as");
  this.space();
  this.print(node.local, node);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001500, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArgumentPlaceholder = ArgumentPlaceholder;
exports.ArrayPattern = exports.ArrayExpression = ArrayExpression;
exports.BigIntLiteral = BigIntLiteral;
exports.BooleanLiteral = BooleanLiteral;
exports.DecimalLiteral = DecimalLiteral;
exports.Identifier = Identifier;
exports.NullLiteral = NullLiteral;
exports.NumericLiteral = NumericLiteral;
exports.ObjectPattern = exports.ObjectExpression = ObjectExpression;
exports.ObjectMethod = ObjectMethod;
exports.ObjectProperty = ObjectProperty;
exports.PipelineBareFunction = PipelineBareFunction;
exports.PipelinePrimaryTopicReference = PipelinePrimaryTopicReference;
exports.PipelineTopicExpression = PipelineTopicExpression;
exports.RecordExpression = RecordExpression;
exports.RegExpLiteral = RegExpLiteral;
exports.SpreadElement = exports.RestElement = RestElement;
exports.StringLiteral = StringLiteral;
exports.TopicReference = TopicReference;
exports.TupleExpression = TupleExpression;

var _t = require("@babel/types");

var _jsesc = require("jsesc");

const {
  isAssignmentPattern,
  isIdentifier
} = _t;

function Identifier(node) {
  this.exactSource(node.loc, () => {
    this.word(node.name);
  });
}

function ArgumentPlaceholder() {
  this.token("?");
}

function RestElement(node) {
  this.token("...");
  this.print(node.argument, node);
}

function ObjectExpression(node) {
  const props = node.properties;
  this.token("{");
  this.printInnerComments(node);

  if (props.length) {
    this.space();
    this.printList(props, node, {
      indent: true,
      statement: true
    });
    this.space();
  }

  this.token("}");
}

function ObjectMethod(node) {
  this.printJoin(node.decorators, node);

  this._methodHead(node);

  this.space();
  this.print(node.body, node);
}

function ObjectProperty(node) {
  this.printJoin(node.decorators, node);

  if (node.computed) {
    this.token("[");
    this.print(node.key, node);
    this.token("]");
  } else {
    if (isAssignmentPattern(node.value) && isIdentifier(node.key) && node.key.name === node.value.left.name) {
      this.print(node.value, node);
      return;
    }

    this.print(node.key, node);

    if (node.shorthand && isIdentifier(node.key) && isIdentifier(node.value) && node.key.name === node.value.name) {
      return;
    }
  }

  this.token(":");
  this.space();
  this.print(node.value, node);
}

function ArrayExpression(node) {
  const elems = node.elements;
  const len = elems.length;
  this.token("[");
  this.printInnerComments(node);

  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];

    if (elem) {
      if (i > 0) this.space();
      this.print(elem, node);
      if (i < len - 1) this.token(",");
    } else {
      this.token(",");
    }
  }

  this.token("]");
}

function RecordExpression(node) {
  const props = node.properties;
  let startToken;
  let endToken;

  if (this.format.recordAndTupleSyntaxType === "bar") {
    startToken = "{|";
    endToken = "|}";
  } else if (this.format.recordAndTupleSyntaxType === "hash") {
    startToken = "#{";
    endToken = "}";
  } else {
    throw new Error(`The "recordAndTupleSyntaxType" generator option must be "bar" or "hash" (${JSON.stringify(this.format.recordAndTupleSyntaxType)} received).`);
  }

  this.token(startToken);
  this.printInnerComments(node);

  if (props.length) {
    this.space();
    this.printList(props, node, {
      indent: true,
      statement: true
    });
    this.space();
  }

  this.token(endToken);
}

function TupleExpression(node) {
  const elems = node.elements;
  const len = elems.length;
  let startToken;
  let endToken;

  if (this.format.recordAndTupleSyntaxType === "bar") {
    startToken = "[|";
    endToken = "|]";
  } else if (this.format.recordAndTupleSyntaxType === "hash") {
    startToken = "#[";
    endToken = "]";
  } else {
    throw new Error(`${this.format.recordAndTupleSyntaxType} is not a valid recordAndTuple syntax type`);
  }

  this.token(startToken);
  this.printInnerComments(node);

  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];

    if (elem) {
      if (i > 0) this.space();
      this.print(elem, node);
      if (i < len - 1) this.token(",");
    }
  }

  this.token(endToken);
}

function RegExpLiteral(node) {
  this.word(`/${node.pattern}/${node.flags}`);
}

function BooleanLiteral(node) {
  this.word(node.value ? "true" : "false");
}

function NullLiteral() {
  this.word("null");
}

function NumericLiteral(node) {
  const raw = this.getPossibleRaw(node);
  const opts = this.format.jsescOption;
  const value = node.value + "";

  if (opts.numbers) {
    this.number(_jsesc(node.value, opts));
  } else if (raw == null) {
    this.number(value);
  } else if (this.format.minified) {
    this.number(raw.length < value.length ? raw : value);
  } else {
    this.number(raw);
  }
}

function StringLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (!this.format.minified && raw != null) {
    this.token(raw);
    return;
  }

  const val = _jsesc(node.value, Object.assign(this.format.jsescOption, this.format.jsonCompatibleStrings && {
    json: true
  }));

  return this.token(val);
}

function BigIntLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (!this.format.minified && raw != null) {
    this.word(raw);
    return;
  }

  this.word(node.value + "n");
}

function DecimalLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (!this.format.minified && raw != null) {
    this.word(raw);
    return;
  }

  this.word(node.value + "m");
}

const validTopicTokenSet = new Set(["^^", "@@", "^", "%", "#"]);

function TopicReference() {
  const {
    topicToken
  } = this.format;

  if (validTopicTokenSet.has(topicToken)) {
    this.token(topicToken);
  } else {
    const givenTopicTokenJSON = JSON.stringify(topicToken);
    const validTopics = Array.from(validTopicTokenSet, v => JSON.stringify(v));
    throw new Error(`The "topicToken" generator option must be one of ` + `${validTopics.join(", ")} (${givenTopicTokenJSON} received instead).`);
  }
}

function PipelineTopicExpression(node) {
  this.print(node.expression, node);
}

function PipelineBareFunction(node) {
  this.print(node.callee, node);
}

function PipelinePrimaryTopicReference() {
  this.token("#");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001501, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnyTypeAnnotation = AnyTypeAnnotation;
exports.ArrayTypeAnnotation = ArrayTypeAnnotation;
exports.BooleanLiteralTypeAnnotation = BooleanLiteralTypeAnnotation;
exports.BooleanTypeAnnotation = BooleanTypeAnnotation;
exports.DeclareClass = DeclareClass;
exports.DeclareExportAllDeclaration = DeclareExportAllDeclaration;
exports.DeclareExportDeclaration = DeclareExportDeclaration;
exports.DeclareFunction = DeclareFunction;
exports.DeclareInterface = DeclareInterface;
exports.DeclareModule = DeclareModule;
exports.DeclareModuleExports = DeclareModuleExports;
exports.DeclareOpaqueType = DeclareOpaqueType;
exports.DeclareTypeAlias = DeclareTypeAlias;
exports.DeclareVariable = DeclareVariable;
exports.DeclaredPredicate = DeclaredPredicate;
exports.EmptyTypeAnnotation = EmptyTypeAnnotation;
exports.EnumBooleanBody = EnumBooleanBody;
exports.EnumBooleanMember = EnumBooleanMember;
exports.EnumDeclaration = EnumDeclaration;
exports.EnumDefaultedMember = EnumDefaultedMember;
exports.EnumNumberBody = EnumNumberBody;
exports.EnumNumberMember = EnumNumberMember;
exports.EnumStringBody = EnumStringBody;
exports.EnumStringMember = EnumStringMember;
exports.EnumSymbolBody = EnumSymbolBody;
exports.ExistsTypeAnnotation = ExistsTypeAnnotation;
exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
exports.FunctionTypeParam = FunctionTypeParam;
exports.IndexedAccessType = IndexedAccessType;
exports.InferredPredicate = InferredPredicate;
exports.InterfaceDeclaration = InterfaceDeclaration;
exports.GenericTypeAnnotation = exports.ClassImplements = exports.InterfaceExtends = InterfaceExtends;
exports.InterfaceTypeAnnotation = InterfaceTypeAnnotation;
exports.IntersectionTypeAnnotation = IntersectionTypeAnnotation;
exports.MixedTypeAnnotation = MixedTypeAnnotation;
exports.NullLiteralTypeAnnotation = NullLiteralTypeAnnotation;
exports.NullableTypeAnnotation = NullableTypeAnnotation;
Object.defineProperty(exports, "NumberLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return _types2.NumericLiteral;
  }
});
exports.NumberTypeAnnotation = NumberTypeAnnotation;
exports.ObjectTypeAnnotation = ObjectTypeAnnotation;
exports.ObjectTypeCallProperty = ObjectTypeCallProperty;
exports.ObjectTypeIndexer = ObjectTypeIndexer;
exports.ObjectTypeInternalSlot = ObjectTypeInternalSlot;
exports.ObjectTypeProperty = ObjectTypeProperty;
exports.ObjectTypeSpreadProperty = ObjectTypeSpreadProperty;
exports.OpaqueType = OpaqueType;
exports.OptionalIndexedAccessType = OptionalIndexedAccessType;
exports.QualifiedTypeIdentifier = QualifiedTypeIdentifier;
Object.defineProperty(exports, "StringLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return _types2.StringLiteral;
  }
});
exports.StringTypeAnnotation = StringTypeAnnotation;
exports.SymbolTypeAnnotation = SymbolTypeAnnotation;
exports.ThisTypeAnnotation = ThisTypeAnnotation;
exports.TupleTypeAnnotation = TupleTypeAnnotation;
exports.TypeAlias = TypeAlias;
exports.TypeAnnotation = TypeAnnotation;
exports.TypeCastExpression = TypeCastExpression;
exports.TypeParameter = TypeParameter;
exports.TypeParameterDeclaration = exports.TypeParameterInstantiation = TypeParameterInstantiation;
exports.TypeofTypeAnnotation = TypeofTypeAnnotation;
exports.UnionTypeAnnotation = UnionTypeAnnotation;
exports.Variance = Variance;
exports.VoidTypeAnnotation = VoidTypeAnnotation;
exports._interfaceish = _interfaceish;
exports._variance = _variance;

var _t = require("@babel/types");

var _modules = require("./modules");

var _types2 = require("./types");

const {
  isDeclareExportDeclaration,
  isStatement
} = _t;

function AnyTypeAnnotation() {
  this.word("any");
}

function ArrayTypeAnnotation(node) {
  this.print(node.elementType, node);
  this.token("[");
  this.token("]");
}

function BooleanTypeAnnotation() {
  this.word("boolean");
}

function BooleanLiteralTypeAnnotation(node) {
  this.word(node.value ? "true" : "false");
}

function NullLiteralTypeAnnotation() {
  this.word("null");
}

function DeclareClass(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.word("class");
  this.space();

  this._interfaceish(node);
}

function DeclareFunction(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.word("function");
  this.space();
  this.print(node.id, node);
  this.print(node.id.typeAnnotation.typeAnnotation, node);

  if (node.predicate) {
    this.space();
    this.print(node.predicate, node);
  }

  this.semicolon();
}

function InferredPredicate() {
  this.token("%");
  this.word("checks");
}

function DeclaredPredicate(node) {
  this.token("%");
  this.word("checks");
  this.token("(");
  this.print(node.value, node);
  this.token(")");
}

function DeclareInterface(node) {
  this.word("declare");
  this.space();
  this.InterfaceDeclaration(node);
}

function DeclareModule(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.space();
  this.print(node.id, node);
  this.space();
  this.print(node.body, node);
}

function DeclareModuleExports(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.token(".");
  this.word("exports");
  this.print(node.typeAnnotation, node);
}

function DeclareTypeAlias(node) {
  this.word("declare");
  this.space();
  this.TypeAlias(node);
}

function DeclareOpaqueType(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.OpaqueType(node);
}

function DeclareVariable(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.word("var");
  this.space();
  this.print(node.id, node);
  this.print(node.id.typeAnnotation, node);
  this.semicolon();
}

function DeclareExportDeclaration(node) {
  this.word("declare");
  this.space();
  this.word("export");
  this.space();

  if (node.default) {
    this.word("default");
    this.space();
  }

  FlowExportDeclaration.apply(this, arguments);
}

function DeclareExportAllDeclaration() {
  this.word("declare");
  this.space();

  _modules.ExportAllDeclaration.apply(this, arguments);
}

function EnumDeclaration(node) {
  const {
    id,
    body
  } = node;
  this.word("enum");
  this.space();
  this.print(id, node);
  this.print(body, node);
}

function enumExplicitType(context, name, hasExplicitType) {
  if (hasExplicitType) {
    context.space();
    context.word("of");
    context.space();
    context.word(name);
  }

  context.space();
}

function enumBody(context, node) {
  const {
    members
  } = node;
  context.token("{");
  context.indent();
  context.newline();

  for (const member of members) {
    context.print(member, node);
    context.newline();
  }

  if (node.hasUnknownMembers) {
    context.token("...");
    context.newline();
  }

  context.dedent();
  context.token("}");
}

function EnumBooleanBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "boolean", explicitType);
  enumBody(this, node);
}

function EnumNumberBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "number", explicitType);
  enumBody(this, node);
}

function EnumStringBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "string", explicitType);
  enumBody(this, node);
}

function EnumSymbolBody(node) {
  enumExplicitType(this, "symbol", true);
  enumBody(this, node);
}

function EnumDefaultedMember(node) {
  const {
    id
  } = node;
  this.print(id, node);
  this.token(",");
}

function enumInitializedMember(context, node) {
  const {
    id,
    init
  } = node;
  context.print(id, node);
  context.space();
  context.token("=");
  context.space();
  context.print(init, node);
  context.token(",");
}

function EnumBooleanMember(node) {
  enumInitializedMember(this, node);
}

function EnumNumberMember(node) {
  enumInitializedMember(this, node);
}

function EnumStringMember(node) {
  enumInitializedMember(this, node);
}

function FlowExportDeclaration(node) {
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar, node);
    if (!isStatement(declar)) this.semicolon();
  } else {
    this.token("{");

    if (node.specifiers.length) {
      this.space();
      this.printList(node.specifiers, node);
      this.space();
    }

    this.token("}");

    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      this.print(node.source, node);
    }

    this.semicolon();
  }
}

function ExistsTypeAnnotation() {
  this.token("*");
}

function FunctionTypeAnnotation(node, parent) {
  this.print(node.typeParameters, node);
  this.token("(");

  if (node.this) {
    this.word("this");
    this.token(":");
    this.space();
    this.print(node.this.typeAnnotation, node);

    if (node.params.length || node.rest) {
      this.token(",");
      this.space();
    }
  }

  this.printList(node.params, node);

  if (node.rest) {
    if (node.params.length) {
      this.token(",");
      this.space();
    }

    this.token("...");
    this.print(node.rest, node);
  }

  this.token(")");

  if (parent && (parent.type === "ObjectTypeCallProperty" || parent.type === "DeclareFunction" || parent.type === "ObjectTypeProperty" && parent.method)) {
    this.token(":");
  } else {
    this.space();
    this.token("=>");
  }

  this.space();
  this.print(node.returnType, node);
}

function FunctionTypeParam(node) {
  this.print(node.name, node);
  if (node.optional) this.token("?");

  if (node.name) {
    this.token(":");
    this.space();
  }

  this.print(node.typeAnnotation, node);
}

function InterfaceExtends(node) {
  this.print(node.id, node);
  this.print(node.typeParameters, node);
}

function _interfaceish(node) {
  var _node$extends;

  this.print(node.id, node);
  this.print(node.typeParameters, node);

  if ((_node$extends = node.extends) != null && _node$extends.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends, node);
  }

  if (node.mixins && node.mixins.length) {
    this.space();
    this.word("mixins");
    this.space();
    this.printList(node.mixins, node);
  }

  if (node.implements && node.implements.length) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements, node);
  }

  this.space();
  this.print(node.body, node);
}

function _variance(node) {
  if (node.variance) {
    if (node.variance.kind === "plus") {
      this.token("+");
    } else if (node.variance.kind === "minus") {
      this.token("-");
    }
  }
}

function InterfaceDeclaration(node) {
  this.word("interface");
  this.space();

  this._interfaceish(node);
}

function andSeparator() {
  this.space();
  this.token("&");
  this.space();
}

function InterfaceTypeAnnotation(node) {
  this.word("interface");

  if (node.extends && node.extends.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends, node);
  }

  this.space();
  this.print(node.body, node);
}

function IntersectionTypeAnnotation(node) {
  this.printJoin(node.types, node, {
    separator: andSeparator
  });
}

function MixedTypeAnnotation() {
  this.word("mixed");
}

function EmptyTypeAnnotation() {
  this.word("empty");
}

function NullableTypeAnnotation(node) {
  this.token("?");
  this.print(node.typeAnnotation, node);
}

function NumberTypeAnnotation() {
  this.word("number");
}

function StringTypeAnnotation() {
  this.word("string");
}

function ThisTypeAnnotation() {
  this.word("this");
}

function TupleTypeAnnotation(node) {
  this.token("[");
  this.printList(node.types, node);
  this.token("]");
}

function TypeofTypeAnnotation(node) {
  this.word("typeof");
  this.space();
  this.print(node.argument, node);
}

function TypeAlias(node) {
  this.word("type");
  this.space();
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  this.space();
  this.token("=");
  this.space();
  this.print(node.right, node);
  this.semicolon();
}

function TypeAnnotation(node) {
  this.token(":");
  this.space();
  if (node.optional) this.token("?");
  this.print(node.typeAnnotation, node);
}

function TypeParameterInstantiation(node) {
  this.token("<");
  this.printList(node.params, node, {});
  this.token(">");
}

function TypeParameter(node) {
  this._variance(node);

  this.word(node.name);

  if (node.bound) {
    this.print(node.bound, node);
  }

  if (node.default) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.default, node);
  }
}

function OpaqueType(node) {
  this.word("opaque");
  this.space();
  this.word("type");
  this.space();
  this.print(node.id, node);
  this.print(node.typeParameters, node);

  if (node.supertype) {
    this.token(":");
    this.space();
    this.print(node.supertype, node);
  }

  if (node.impltype) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.impltype, node);
  }

  this.semicolon();
}

function ObjectTypeAnnotation(node) {
  if (node.exact) {
    this.token("{|");
  } else {
    this.token("{");
  }

  const props = [...node.properties, ...(node.callProperties || []), ...(node.indexers || []), ...(node.internalSlots || [])];

  if (props.length) {
    this.space();
    this.printJoin(props, node, {
      addNewlines(leading) {
        if (leading && !props[0]) return 1;
      },

      indent: true,
      statement: true,
      iterator: () => {
        if (props.length !== 1 || node.inexact) {
          this.token(",");
          this.space();
        }
      }
    });
    this.space();
  }

  if (node.inexact) {
    this.indent();
    this.token("...");

    if (props.length) {
      this.newline();
    }

    this.dedent();
  }

  if (node.exact) {
    this.token("|}");
  } else {
    this.token("}");
  }
}

function ObjectTypeInternalSlot(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this.token("[");
  this.token("[");
  this.print(node.id, node);
  this.token("]");
  this.token("]");
  if (node.optional) this.token("?");

  if (!node.method) {
    this.token(":");
    this.space();
  }

  this.print(node.value, node);
}

function ObjectTypeCallProperty(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this.print(node.value, node);
}

function ObjectTypeIndexer(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this._variance(node);

  this.token("[");

  if (node.id) {
    this.print(node.id, node);
    this.token(":");
    this.space();
  }

  this.print(node.key, node);
  this.token("]");
  this.token(":");
  this.space();
  this.print(node.value, node);
}

function ObjectTypeProperty(node) {
  if (node.proto) {
    this.word("proto");
    this.space();
  }

  if (node.static) {
    this.word("static");
    this.space();
  }

  if (node.kind === "get" || node.kind === "set") {
    this.word(node.kind);
    this.space();
  }

  this._variance(node);

  this.print(node.key, node);
  if (node.optional) this.token("?");

  if (!node.method) {
    this.token(":");
    this.space();
  }

  this.print(node.value, node);
}

function ObjectTypeSpreadProperty(node) {
  this.token("...");
  this.print(node.argument, node);
}

function QualifiedTypeIdentifier(node) {
  this.print(node.qualification, node);
  this.token(".");
  this.print(node.id, node);
}

function SymbolTypeAnnotation() {
  this.word("symbol");
}

function orSeparator() {
  this.space();
  this.token("|");
  this.space();
}

function UnionTypeAnnotation(node) {
  this.printJoin(node.types, node, {
    separator: orSeparator
  });
}

function TypeCastExpression(node) {
  this.token("(");
  this.print(node.expression, node);
  this.print(node.typeAnnotation, node);
  this.token(")");
}

function Variance(node) {
  if (node.kind === "plus") {
    this.token("+");
  } else {
    this.token("-");
  }
}

function VoidTypeAnnotation() {
  this.word("void");
}

function IndexedAccessType(node) {
  this.print(node.objectType, node);
  this.token("[");
  this.print(node.indexType, node);
  this.token("]");
}

function OptionalIndexedAccessType(node) {
  this.print(node.objectType, node);

  if (node.optional) {
    this.token("?.");
  }

  this.token("[");
  this.print(node.indexType, node);
  this.token("]");
}
}, function(modId) { var map = {"./modules":1679975001499,"./types":1679975001500}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001502, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockStatement = BlockStatement;
exports.Directive = Directive;
exports.DirectiveLiteral = DirectiveLiteral;
exports.File = File;
exports.InterpreterDirective = InterpreterDirective;
exports.Placeholder = Placeholder;
exports.Program = Program;

function File(node) {
  if (node.program) {
    this.print(node.program.interpreter, node);
  }

  this.print(node.program, node);
}

function Program(node) {
  this.printInnerComments(node, false);
  this.printSequence(node.directives, node);
  if (node.directives && node.directives.length) this.newline();
  this.printSequence(node.body, node);
}

function BlockStatement(node) {
  var _node$directives;

  this.token("{");
  this.printInnerComments(node);
  const hasDirectives = (_node$directives = node.directives) == null ? void 0 : _node$directives.length;

  if (node.body.length || hasDirectives) {
    this.newline();
    this.printSequence(node.directives, node, {
      indent: true
    });
    if (hasDirectives) this.newline();
    this.printSequence(node.body, node, {
      indent: true
    });
    this.removeTrailingNewline();
    this.source("end", node.loc);
    if (!this.endsWith(10)) this.newline();
    this.rightBrace();
  } else {
    this.source("end", node.loc);
    this.token("}");
  }
}

function Directive(node) {
  this.print(node.value, node);
  this.semicolon();
}

const unescapedSingleQuoteRE = /(?:^|[^\\])(?:\\\\)*'/;
const unescapedDoubleQuoteRE = /(?:^|[^\\])(?:\\\\)*"/;

function DirectiveLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (!this.format.minified && raw != null) {
    this.token(raw);
    return;
  }

  const {
    value
  } = node;

  if (!unescapedDoubleQuoteRE.test(value)) {
    this.token(`"${value}"`);
  } else if (!unescapedSingleQuoteRE.test(value)) {
    this.token(`'${value}'`);
  } else {
    throw new Error("Malformed AST: it is not possible to print a directive containing" + " both unescaped single and double quotes.");
  }
}

function InterpreterDirective(node) {
  this.token(`#!${node.value}\n`);
}

function Placeholder(node) {
  this.token("%%");
  this.print(node.name);
  this.token("%%");

  if (node.expectedNode === "Statement") {
    this.semicolon();
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001503, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSXAttribute = JSXAttribute;
exports.JSXClosingElement = JSXClosingElement;
exports.JSXClosingFragment = JSXClosingFragment;
exports.JSXElement = JSXElement;
exports.JSXEmptyExpression = JSXEmptyExpression;
exports.JSXExpressionContainer = JSXExpressionContainer;
exports.JSXFragment = JSXFragment;
exports.JSXIdentifier = JSXIdentifier;
exports.JSXMemberExpression = JSXMemberExpression;
exports.JSXNamespacedName = JSXNamespacedName;
exports.JSXOpeningElement = JSXOpeningElement;
exports.JSXOpeningFragment = JSXOpeningFragment;
exports.JSXSpreadAttribute = JSXSpreadAttribute;
exports.JSXSpreadChild = JSXSpreadChild;
exports.JSXText = JSXText;

function JSXAttribute(node) {
  this.print(node.name, node);

  if (node.value) {
    this.token("=");
    this.print(node.value, node);
  }
}

function JSXIdentifier(node) {
  this.word(node.name);
}

function JSXNamespacedName(node) {
  this.print(node.namespace, node);
  this.token(":");
  this.print(node.name, node);
}

function JSXMemberExpression(node) {
  this.print(node.object, node);
  this.token(".");
  this.print(node.property, node);
}

function JSXSpreadAttribute(node) {
  this.token("{");
  this.token("...");
  this.print(node.argument, node);
  this.token("}");
}

function JSXExpressionContainer(node) {
  this.token("{");
  this.print(node.expression, node);
  this.token("}");
}

function JSXSpreadChild(node) {
  this.token("{");
  this.token("...");
  this.print(node.expression, node);
  this.token("}");
}

function JSXText(node) {
  const raw = this.getPossibleRaw(node);

  if (raw != null) {
    this.token(raw);
  } else {
    this.token(node.value);
  }
}

function JSXElement(node) {
  const open = node.openingElement;
  this.print(open, node);
  if (open.selfClosing) return;
  this.indent();

  for (const child of node.children) {
    this.print(child, node);
  }

  this.dedent();
  this.print(node.closingElement, node);
}

function spaceSeparator() {
  this.space();
}

function JSXOpeningElement(node) {
  this.token("<");
  this.print(node.name, node);
  this.print(node.typeParameters, node);

  if (node.attributes.length > 0) {
    this.space();
    this.printJoin(node.attributes, node, {
      separator: spaceSeparator
    });
  }

  if (node.selfClosing) {
    this.space();
    this.token("/>");
  } else {
    this.token(">");
  }
}

function JSXClosingElement(node) {
  this.token("</");
  this.print(node.name, node);
  this.token(">");
}

function JSXEmptyExpression(node) {
  this.printInnerComments(node);
}

function JSXFragment(node) {
  this.print(node.openingFragment, node);
  this.indent();

  for (const child of node.children) {
    this.print(child, node);
  }

  this.dedent();
  this.print(node.closingFragment, node);
}

function JSXOpeningFragment() {
  this.token("<");
  this.token(">");
}

function JSXClosingFragment() {
  this.token("</");
  this.token(">");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975001504, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TSAnyKeyword = TSAnyKeyword;
exports.TSArrayType = TSArrayType;
exports.TSAsExpression = TSAsExpression;
exports.TSBigIntKeyword = TSBigIntKeyword;
exports.TSBooleanKeyword = TSBooleanKeyword;
exports.TSCallSignatureDeclaration = TSCallSignatureDeclaration;
exports.TSConditionalType = TSConditionalType;
exports.TSConstructSignatureDeclaration = TSConstructSignatureDeclaration;
exports.TSConstructorType = TSConstructorType;
exports.TSDeclareFunction = TSDeclareFunction;
exports.TSDeclareMethod = TSDeclareMethod;
exports.TSEnumDeclaration = TSEnumDeclaration;
exports.TSEnumMember = TSEnumMember;
exports.TSExportAssignment = TSExportAssignment;
exports.TSExpressionWithTypeArguments = TSExpressionWithTypeArguments;
exports.TSExternalModuleReference = TSExternalModuleReference;
exports.TSFunctionType = TSFunctionType;
exports.TSImportEqualsDeclaration = TSImportEqualsDeclaration;
exports.TSImportType = TSImportType;
exports.TSIndexSignature = TSIndexSignature;
exports.TSIndexedAccessType = TSIndexedAccessType;
exports.TSInferType = TSInferType;
exports.TSInterfaceBody = TSInterfaceBody;
exports.TSInterfaceDeclaration = TSInterfaceDeclaration;
exports.TSIntersectionType = TSIntersectionType;
exports.TSIntrinsicKeyword = TSIntrinsicKeyword;
exports.TSLiteralType = TSLiteralType;
exports.TSMappedType = TSMappedType;
exports.TSMethodSignature = TSMethodSignature;
exports.TSModuleBlock = TSModuleBlock;
exports.TSModuleDeclaration = TSModuleDeclaration;
exports.TSNamedTupleMember = TSNamedTupleMember;
exports.TSNamespaceExportDeclaration = TSNamespaceExportDeclaration;
exports.TSNeverKeyword = TSNeverKeyword;
exports.TSNonNullExpression = TSNonNullExpression;
exports.TSNullKeyword = TSNullKeyword;
exports.TSNumberKeyword = TSNumberKeyword;
exports.TSObjectKeyword = TSObjectKeyword;
exports.TSOptionalType = TSOptionalType;
exports.TSParameterProperty = TSParameterProperty;
exports.TSParenthesizedType = TSParenthesizedType;
exports.TSPropertySignature = TSPropertySignature;
exports.TSQualifiedName = TSQualifiedName;
exports.TSRestType = TSRestType;
exports.TSStringKeyword = TSStringKeyword;
exports.TSSymbolKeyword = TSSymbolKeyword;
exports.TSThisType = TSThisType;
exports.TSTupleType = TSTupleType;
exports.TSTypeAliasDeclaration = TSTypeAliasDeclaration;
exports.TSTypeAnnotation = TSTypeAnnotation;
exports.TSTypeAssertion = TSTypeAssertion;
exports.TSTypeLiteral = TSTypeLiteral;
exports.TSTypeOperator = TSTypeOperator;
exports.TSTypeParameter = TSTypeParameter;
exports.TSTypeParameterDeclaration = exports.TSTypeParameterInstantiation = TSTypeParameterInstantiation;
exports.TSTypePredicate = TSTypePredicate;
exports.TSTypeQuery = TSTypeQuery;
exports.TSTypeReference = TSTypeReference;
exports.TSUndefinedKeyword = TSUndefinedKeyword;
exports.TSUnionType = TSUnionType;
exports.TSUnknownKeyword = TSUnknownKeyword;
exports.TSVoidKeyword = TSVoidKeyword;
exports.tsPrintBraced = tsPrintBraced;
exports.tsPrintClassMemberModifiers = tsPrintClassMemberModifiers;
exports.tsPrintFunctionOrConstructorType = tsPrintFunctionOrConstructorType;
exports.tsPrintPropertyOrMethodName = tsPrintPropertyOrMethodName;
exports.tsPrintSignatureDeclarationBase = tsPrintSignatureDeclarationBase;
exports.tsPrintTypeLiteralOrInterfaceBody = tsPrintTypeLiteralOrInterfaceBody;
exports.tsPrintUnionOrIntersectionType = tsPrintUnionOrIntersectionType;

function TSTypeAnnotation(node) {
  this.token(":");
  this.space();
  if (node.optional) this.token("?");
  this.print(node.typeAnnotation, node);
}

function TSTypeParameterInstantiation(node, parent) {
  this.token("<");
  this.printList(node.params, node, {});

  if (parent.type === "ArrowFunctionExpression" && node.params.length === 1) {
    this.token(",");
  }

  this.token(">");
}

function TSTypeParameter(node) {
  this.word(node.name);

  if (node.constraint) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.constraint, node);
  }

  if (node.default) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.default, node);
  }
}

function TSParameterProperty(node) {
  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }

  if (node.readonly) {
    this.word("readonly");
    this.space();
  }

  this._param(node.parameter);
}

function TSDeclareFunction(node) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }

  this._functionHead(node);

  this.token(";");
}

function TSDeclareMethod(node) {
  this._classMethodHead(node);

  this.token(";");
}

function TSQualifiedName(node) {
  this.print(node.left, node);
  this.token(".");
  this.print(node.right, node);
}

function TSCallSignatureDeclaration(node) {
  this.tsPrintSignatureDeclarationBase(node);
  this.token(";");
}

function TSConstructSignatureDeclaration(node) {
  this.word("new");
  this.space();
  this.tsPrintSignatureDeclarationBase(node);
  this.token(";");
}

function TSPropertySignature(node) {
  const {
    readonly,
    initializer
  } = node;

  if (readonly) {
    this.word("readonly");
    this.space();
  }

  this.tsPrintPropertyOrMethodName(node);
  this.print(node.typeAnnotation, node);

  if (initializer) {
    this.space();
    this.token("=");
    this.space();
    this.print(initializer, node);
  }

  this.token(";");
}

function tsPrintPropertyOrMethodName(node) {
  if (node.computed) {
    this.token("[");
  }

  this.print(node.key, node);

  if (node.computed) {
    this.token("]");
  }

  if (node.optional) {
    this.token("?");
  }
}

function TSMethodSignature(node) {
  const {
    kind
  } = node;

  if (kind === "set" || kind === "get") {
    this.word(kind);
    this.space();
  }

  this.tsPrintPropertyOrMethodName(node);
  this.tsPrintSignatureDeclarationBase(node);
  this.token(";");
}

function TSIndexSignature(node) {
  const {
    readonly,
    static: isStatic
  } = node;

  if (isStatic) {
    this.word("static");
    this.space();
  }

  if (readonly) {
    this.word("readonly");
    this.space();
  }

  this.token("[");

  this._parameters(node.parameters, node);

  this.token("]");
  this.print(node.typeAnnotation, node);
  this.token(";");
}

function TSAnyKeyword() {
  this.word("any");
}

function TSBigIntKeyword() {
  this.word("bigint");
}

function TSUnknownKeyword() {
  this.word("unknown");
}

function TSNumberKeyword() {
  this.word("number");
}

function TSObjectKeyword() {
  this.word("object");
}

function TSBooleanKeyword() {
  this.word("boolean");
}

function TSStringKeyword() {
  this.word("string");
}

function TSSymbolKeyword() {
  this.word("symbol");
}

function TSVoidKeyword() {
  this.word("void");
}

function TSUndefinedKeyword() {
  this.word("undefined");
}

function TSNullKeyword() {
  this.word("null");
}

function TSNeverKeyword() {
  this.word("never");
}

function TSIntrinsicKeyword() {
  this.word("intrinsic");
}

function TSThisType() {
  this.word("this");
}

function TSFunctionType(node) {
  this.tsPrintFunctionOrConstructorType(node);
}

function TSConstructorType(node) {
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }

  this.word("new");
  this.space();
  this.tsPrintFunctionOrConstructorType(node);
}

function tsPrintFunctionOrConstructorType(node) {
  const {
    typeParameters
  } = node;
  const parameters = node.parameters;
  this.print(typeParameters, node);
  this.token("(");

  this._parameters(parameters, node);

  this.token(")");
  this.space();
  this.token("=>");
  this.space();
  const returnType = node.typeAnnotation;
  this.print(returnType.typeAnnotation, node);
}

function TSTypeReference(node) {
  this.print(node.typeName, node);
  this.print(node.typeParameters, node);
}

function TSTypePredicate(node) {
  if (node.asserts) {
    this.word("asserts");
    this.space();
  }

  this.print(node.parameterName);

  if (node.typeAnnotation) {
    this.space();
    this.word("is");
    this.space();
    this.print(node.typeAnnotation.typeAnnotation);
  }
}

function TSTypeQuery(node) {
  this.word("typeof");
  this.space();
  this.print(node.exprName);
}

function TSTypeLiteral(node) {
  this.tsPrintTypeLiteralOrInterfaceBody(node.members, node);
}

function tsPrintTypeLiteralOrInterfaceBody(members, node) {
  this.tsPrintBraced(members, node);
}

function tsPrintBraced(members, node) {
  this.token("{");

  if (members.length) {
    this.indent();
    this.newline();

    for (const member of members) {
      this.print(member, node);
      this.newline();
    }

    this.dedent();
    this.rightBrace();
  } else {
    this.token("}");
  }
}

function TSArrayType(node) {
  this.print(node.elementType, node);
  this.token("[]");
}

function TSTupleType(node) {
  this.token("[");
  this.printList(node.elementTypes, node);
  this.token("]");
}

function TSOptionalType(node) {
  this.print(node.typeAnnotation, node);
  this.token("?");
}

function TSRestType(node) {
  this.token("...");
  this.print(node.typeAnnotation, node);
}

function TSNamedTupleMember(node) {
  this.print(node.label, node);
  if (node.optional) this.token("?");
  this.token(":");
  this.space();
  this.print(node.elementType, node);
}

function TSUnionType(node) {
  this.tsPrintUnionOrIntersectionType(node, "|");
}

function TSIntersectionType(node) {
  this.tsPrintUnionOrIntersectionType(node, "&");
}

function tsPrintUnionOrIntersectionType(node, sep) {
  this.printJoin(node.types, node, {
    separator() {
      this.space();
      this.token(sep);
      this.space();
    }

  });
}

function TSConditionalType(node) {
  this.print(node.checkType);
  this.space();
  this.word("extends");
  this.space();
  this.print(node.extendsType);
  this.space();
  this.token("?");
  this.space();
  this.print(node.trueType);
  this.space();
  this.token(":");
  this.space();
  this.print(node.falseType);
}

function TSInferType(node) {
  this.token("infer");
  this.space();
  this.print(node.typeParameter);
}

function TSParenthesizedType(node) {
  this.token("(");
  this.print(node.typeAnnotation, node);
  this.token(")");
}

function TSTypeOperator(node) {
  this.word(node.operator);
  this.space();
  this.print(node.typeAnnotation, node);
}

function TSIndexedAccessType(node) {
  this.print(node.objectType, node);
  this.token("[");
  this.print(node.indexType, node);
  this.token("]");
}

function TSMappedType(node) {
  const {
    nameType,
    optional,
    readonly,
    typeParameter
  } = node;
  this.token("{");
  this.space();

  if (readonly) {
    tokenIfPlusMinus(this, readonly);
    this.word("readonly");
    this.space();
  }

  this.token("[");
  this.word(typeParameter.name);
  this.space();
  this.word("in");
  this.space();
  this.print(typeParameter.constraint, typeParameter);

  if (nameType) {
    this.space();
    this.word("as");
    this.space();
    this.print(nameType, node);
  }

  this.token("]");

  if (optional) {
    tokenIfPlusMinus(this, optional);
    this.token("?");
  }

  this.token(":");
  this.space();
  this.print(node.typeAnnotation, node);
  this.space();
  this.token("}");
}

function tokenIfPlusMinus(self, tok) {
  if (tok !== true) {
    self.token(tok);
  }
}

function TSLiteralType(node) {
  this.print(node.literal, node);
}

function TSExpressionWithTypeArguments(node) {
  this.print(node.expression, node);
  this.print(node.typeParameters, node);
}

function TSInterfaceDeclaration(node) {
  const {
    declare,
    id,
    typeParameters,
    extends: extendz,
    body
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  this.word("interface");
  this.space();
  this.print(id, node);
  this.print(typeParameters, node);

  if (extendz != null && extendz.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(extendz, node);
  }

  this.space();
  this.print(body, node);
}

function TSInterfaceBody(node) {
  this.tsPrintTypeLiteralOrInterfaceBody(node.body, node);
}

function TSTypeAliasDeclaration(node) {
  const {
    declare,
    id,
    typeParameters,
    typeAnnotation
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  this.word("type");
  this.space();
  this.print(id, node);
  this.print(typeParameters, node);
  this.space();
  this.token("=");
  this.space();
  this.print(typeAnnotation, node);
  this.token(";");
}

function TSAsExpression(node) {
  const {
    expression,
    typeAnnotation
  } = node;
  this.print(expression, node);
  this.space();
  this.word("as");
  this.space();
  this.print(typeAnnotation, node);
}

function TSTypeAssertion(node) {
  const {
    typeAnnotation,
    expression
  } = node;
  this.token("<");
  this.print(typeAnnotation, node);
  this.token(">");
  this.space();
  this.print(expression, node);
}

function TSEnumDeclaration(node) {
  const {
    declare,
    const: isConst,
    id,
    members
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  if (isConst) {
    this.word("const");
    this.space();
  }

  this.word("enum");
  this.space();
  this.print(id, node);
  this.space();
  this.tsPrintBraced(members, node);
}

function TSEnumMember(node) {
  const {
    id,
    initializer
  } = node;
  this.print(id, node);

  if (initializer) {
    this.space();
    this.token("=");
    this.space();
    this.print(initializer, node);
  }

  this.token(",");
}

function TSModuleDeclaration(node) {
  const {
    declare,
    id
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  if (!node.global) {
    this.word(id.type === "Identifier" ? "namespace" : "module");
    this.space();
  }

  this.print(id, node);

  if (!node.body) {
    this.token(";");
    return;
  }

  let body = node.body;

  while (body.type === "TSModuleDeclaration") {
    this.token(".");
    this.print(body.id, body);
    body = body.body;
  }

  this.space();
  this.print(body, node);
}

function TSModuleBlock(node) {
  this.tsPrintBraced(node.body, node);
}

function TSImportType(node) {
  const {
    argument,
    qualifier,
    typeParameters
  } = node;
  this.word("import");
  this.token("(");
  this.print(argument, node);
  this.token(")");

  if (qualifier) {
    this.token(".");
    this.print(qualifier, node);
  }

  if (typeParameters) {
    this.print(typeParameters, node);
  }
}

function TSImportEqualsDeclaration(node) {
  const {
    isExport,
    id,
    moduleReference
  } = node;

  if (isExport) {
    this.word("export");
    this.space();
  }

  this.word("import");
  this.space();
  this.print(id, node);
  this.space();
  this.token("=");
  this.space();
  this.print(moduleReference, node);
  this.token(";");
}

function TSExternalModuleReference(node) {
  this.token("require(");
  this.print(node.expression, node);
  this.token(")");
}

function TSNonNullExpression(node) {
  this.print(node.expression, node);
  this.token("!");
}

function TSExportAssignment(node) {
  this.word("export");
  this.space();
  this.token("=");
  this.space();
  this.print(node.expression, node);
  this.token(";");
}

function TSNamespaceExportDeclaration(node) {
  this.word("export");
  this.space();
  this.word("as");
  this.space();
  this.word("namespace");
  this.space();
  this.print(node.id, node);
}

function tsPrintSignatureDeclarationBase(node) {
  const {
    typeParameters
  } = node;
  const parameters = node.parameters;
  this.print(typeParameters, node);
  this.token("(");

  this._parameters(parameters, node);

  this.token(")");
  const returnType = node.typeAnnotation;
  this.print(returnType, node);
}

function tsPrintClassMemberModifiers(node, isField) {
  if (isField && node.declare) {
    this.word("declare");
    this.space();
  }

  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }

  if (node.static) {
    this.word("static");
    this.space();
  }

  if (node.override) {
    this.word("override");
    this.space();
  }

  if (node.abstract) {
    this.word("abstract");
    this.space();
  }

  if (isField && node.readonly) {
    this.word("readonly");
    this.space();
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975001486);
})()
//miniprogram-npm-outsideDeps=["@jridgewell/gen-mapping","@babel/types","jsesc"]
//# sourceMappingURL=index.js.map