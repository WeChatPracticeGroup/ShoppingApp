module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018123, function(require, module, exports) {

const CommentRemover = require('./lib/commentRemover');
const commentParser = require('./lib/commentParser');

/** @typedef {object} Options
 *  @property {boolean=} removeAll
 *  @property {boolean=} removeAllButFirst
 *  @property {(s: string) => boolean=} remove
 */
/**
 * @type {import('postcss').PluginCreator<Options>}
 * @param {Options} opts
 * @return {import('postcss').Plugin}
 */
function pluginCreator(opts = {}) {
  const remover = new CommentRemover(opts);
  const matcherCache = new Map();
  const replacerCache = new Map();

  /**
   * @param {string} source
   * @return {[number, number, number][]}
   */
  function matchesComments(source) {
    if (matcherCache.has(source)) {
      return matcherCache.get(source);
    }

    const result = commentParser(source).filter(([type]) => type);

    matcherCache.set(source, result);

    return result;
  }

  /**
   * @param {string} source
   * @param {(s: string) => string[]} space
   * @return {string}
   */
  function replaceComments(source, space, separator = ' ') {
    const key = source + '@|@' + separator;

    if (replacerCache.has(key)) {
      return replacerCache.get(key);
    }
    const parsed = commentParser(source).reduce((value, [type, start, end]) => {
      const contents = source.slice(start, end);

      if (!type) {
        return value + contents;
      }

      if (remover.canRemove(contents)) {
        return value + separator;
      }

      return `${value}/*${contents}*/`;
    }, '');

    const result = space(parsed).join(' ');

    replacerCache.set(key, result);

    return result;
  }

  return {
    postcssPlugin: 'postcss-discard-comments',

    OnceExit(css, { list }) {
      css.walk((node) => {
        if (node.type === 'comment' && remover.canRemove(node.text)) {
          node.remove();

          return;
        }

        if (typeof node.raws.between === 'string') {
          node.raws.between = replaceComments(node.raws.between, list.space);
        }

        if (node.type === 'decl') {
          if (node.raws.value && node.raws.value.raw) {
            if (node.raws.value.value === node.value) {
              node.value = replaceComments(node.raws.value.raw, list.space);
            } else {
              node.value = replaceComments(node.value, list.space);
            }

            /** @type {null | {value: string, raw: string}} */ (
              node.raws.value
            ) = null;
          }

          if (node.raws.important) {
            node.raws.important = replaceComments(
              node.raws.important,
              list.space
            );

            const b = matchesComments(node.raws.important);

            node.raws.important = b.length ? node.raws.important : '!important';
          } else {
            node.value = replaceComments(node.value, list.space);
          }

          return;
        }

        if (
          node.type === 'rule' &&
          node.raws.selector &&
          node.raws.selector.raw
        ) {
          node.raws.selector.raw = replaceComments(
            node.raws.selector.raw,
            list.space,
            ''
          );

          return;
        }

        if (node.type === 'atrule') {
          if (node.raws.afterName) {
            const commentsReplaced = replaceComments(
              node.raws.afterName,
              list.space
            );

            if (!commentsReplaced.length) {
              node.raws.afterName = commentsReplaced + ' ';
            } else {
              node.raws.afterName = ' ' + commentsReplaced + ' ';
            }
          }

          if (node.raws.params && node.raws.params.raw) {
            node.raws.params.raw = replaceComments(
              node.raws.params.raw,
              list.space
            );
          }
        }
      });
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;

}, function(modId) {var map = {"./lib/commentRemover":1679975018124,"./lib/commentParser":1679975018125}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018124, function(require, module, exports) {


/** @param {import('../index.js').Options} options */
function CommentRemover(options) {
  this.options = options;
}
/**
 * @param {string} comment
 * @return {boolean | undefined}
 */
CommentRemover.prototype.canRemove = function (comment) {
  const remove = this.options.remove;

  if (remove) {
    return remove(comment);
  } else {
    const isImportant = comment.indexOf('!') === 0;

    if (!isImportant) {
      return true;
    }

    if (this.options.removeAll || this._hasFirst) {
      return true;
    } else if (this.options.removeAllButFirst && !this._hasFirst) {
      this._hasFirst = true;
      return false;
    }
  }
};

module.exports = CommentRemover;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018125, function(require, module, exports) {


/**
 * @param {string} input
 * @return {[number, number, number][]}
 */
module.exports = function commentParser(input) {
  /** @type [number, number, number][] */
  const tokens = [];
  const length = input.length;
  let pos = 0;
  let next;

  while (pos < length) {
    next = input.indexOf('/*', pos);

    if (~next) {
      tokens.push([0, pos, next]);
      pos = next;

      next = input.indexOf('*/', pos + 2);
      tokens.push([1, pos + 2, next]);
      pos = next + 2;
    } else {
      tokens.push([0, pos, length]);
      pos = length;
    }
  }

  return tokens;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018123);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map