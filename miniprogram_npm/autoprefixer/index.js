module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975014134, function(require, module, exports) {
let browserslist = require('browserslist')
let { agents } = require('caniuse-lite/dist/unpacker/agents')
let pico = require('picocolors')

let Browsers = require('./browsers')
let Prefixes = require('./prefixes')
let dataPrefixes = require('../data/prefixes')
let getInfo = require('./info')

let autoprefixerData = { browsers: agents, prefixes: dataPrefixes }

const WARNING =
  '\n' +
  '  Replace Autoprefixer `browsers` option to Browserslist config.\n' +
  '  Use `browserslist` key in `package.json` or `.browserslistrc` file.\n' +
  '\n' +
  '  Using `browsers` option can cause errors. Browserslist config can\n' +
  '  be used for Babel, Autoprefixer, postcss-normalize and other tools.\n' +
  '\n' +
  '  If you really need to use option, rename it to `overrideBrowserslist`.\n' +
  '\n' +
  '  Learn more at:\n' +
  '  https://github.com/browserslist/browserslist#readme\n' +
  '  https://twitter.com/browserslist\n' +
  '\n'

function isPlainObject(obj) {
  return Object.prototype.toString.apply(obj) === '[object Object]'
}

let cache = new Map()

function timeCapsule(result, prefixes) {
  if (prefixes.browsers.selected.length === 0) {
    return
  }
  if (prefixes.add.selectors.length > 0) {
    return
  }
  if (Object.keys(prefixes.add).length > 2) {
    return
  }
  /* c8 ignore next 11 */
  result.warn(
    'Autoprefixer target browsers do not need any prefixes.' +
      'You do not need Autoprefixer anymore.\n' +
      'Check your Browserslist config to be sure that your targets ' +
      'are set up correctly.\n' +
      '\n' +
      '  Learn more at:\n' +
      '  https://github.com/postcss/autoprefixer#readme\n' +
      '  https://github.com/browserslist/browserslist#readme\n' +
      '\n'
  )
}

module.exports = plugin

function plugin(...reqs) {
  let options
  if (reqs.length === 1 && isPlainObject(reqs[0])) {
    options = reqs[0]
    reqs = undefined
  } else if (reqs.length === 0 || (reqs.length === 1 && !reqs[0])) {
    reqs = undefined
  } else if (reqs.length <= 2 && (Array.isArray(reqs[0]) || !reqs[0])) {
    options = reqs[1]
    reqs = reqs[0]
  } else if (typeof reqs[reqs.length - 1] === 'object') {
    options = reqs.pop()
  }

  if (!options) {
    options = {}
  }

  if (options.browser) {
    throw new Error(
      'Change `browser` option to `overrideBrowserslist` in Autoprefixer'
    )
  } else if (options.browserslist) {
    throw new Error(
      'Change `browserslist` option to `overrideBrowserslist` in Autoprefixer'
    )
  }

  if (options.overrideBrowserslist) {
    reqs = options.overrideBrowserslist
  } else if (options.browsers) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        pico.red(WARNING.replace(/`[^`]+`/g, i => pico.yellow(i.slice(1, -1))))
      )
    }
    reqs = options.browsers
  }

  let brwlstOpts = {
    ignoreUnknownVersions: options.ignoreUnknownVersions,
    stats: options.stats,
    env: options.env
  }

  function loadPrefixes(opts) {
    let d = autoprefixerData
    let browsers = new Browsers(d.browsers, reqs, opts, brwlstOpts)
    let key = browsers.selected.join(', ') + JSON.stringify(options)

    if (!cache.has(key)) {
      cache.set(key, new Prefixes(d.prefixes, browsers, options))
    }

    return cache.get(key)
  }

  return {
    postcssPlugin: 'autoprefixer',

    prepare(result) {
      let prefixes = loadPrefixes({
        from: result.opts.from,
        env: options.env
      })

      return {
        OnceExit(root) {
          timeCapsule(result, prefixes)
          if (options.remove !== false) {
            prefixes.processor.remove(root, result)
          }
          if (options.add !== false) {
            prefixes.processor.add(root, result)
          }
        }
      }
    },

    info(opts) {
      opts = opts || {}
      opts.from = opts.from || process.cwd()
      return getInfo(loadPrefixes(opts))
    },

    options,
    browsers: reqs
  }
}

plugin.postcss = true

/**
 * Autoprefixer data
 */
plugin.data = autoprefixerData

/**
 * Autoprefixer default browsers
 */
plugin.defaults = browserslist.defaults

/**
 * Inspect with default Autoprefixer
 */
plugin.info = () => plugin().info()

}, function(modId) {var map = {"./browsers":1679975014135,"./prefixes":1679975014137,"../data/prefixes":1679975014210,"./info":1679975014211}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014135, function(require, module, exports) {
let browserslist = require('browserslist')
let { agents } = require('caniuse-lite/dist/unpacker/agents')

let utils = require('./utils')

class Browsers {
  /**
   * Return all prefixes for default browser data
   */
  static prefixes() {
    if (this.prefixesCache) {
      return this.prefixesCache
    }

    this.prefixesCache = []
    for (let name in agents) {
      this.prefixesCache.push(`-${agents[name].prefix}-`)
    }

    this.prefixesCache = utils
      .uniq(this.prefixesCache)
      .sort((a, b) => b.length - a.length)

    return this.prefixesCache
  }

  /**
   * Check is value contain any possible prefix
   */
  static withPrefix(value) {
    if (!this.prefixesRegexp) {
      this.prefixesRegexp = new RegExp(this.prefixes().join('|'))
    }

    return this.prefixesRegexp.test(value)
  }

  constructor(data, requirements, options, browserslistOpts) {
    this.data = data
    this.options = options || {}
    this.browserslistOpts = browserslistOpts || {}
    this.selected = this.parse(requirements)
  }

  /**
   * Return browsers selected by requirements
   */
  parse(requirements) {
    let opts = {}
    for (let i in this.browserslistOpts) {
      opts[i] = this.browserslistOpts[i]
    }
    opts.path = this.options.from
    return browserslist(requirements, opts)
  }

  /**
   * Return prefix for selected browser
   */
  prefix(browser) {
    let [name, version] = browser.split(' ')
    let data = this.data[name]

    let prefix = data.prefix_exceptions && data.prefix_exceptions[version]
    if (!prefix) {
      prefix = data.prefix
    }
    return `-${prefix}-`
  }

  /**
   * Is browser is selected by requirements
   */
  isSelected(browser) {
    return this.selected.includes(browser)
  }
}

module.exports = Browsers

}, function(modId) { var map = {"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014136, function(require, module, exports) {
let { list } = require('postcss')

/**
 * Throw special error, to tell beniary,
 * that this error is from Autoprefixer.
 */
module.exports.error = function (text) {
  let err = new Error(text)
  err.autoprefixer = true
  throw err
}

/**
 * Return array, that doesn’t contain duplicates.
 */
module.exports.uniq = function (array) {
  return [...new Set(array)]
}

/**
 * Return "-webkit-" on "-webkit- old"
 */
module.exports.removeNote = function (string) {
  if (!string.includes(' ')) {
    return string
  }

  return string.split(' ')[0]
}

/**
 * Escape RegExp symbols
 */
module.exports.escapeRegexp = function (string) {
  return string.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&')
}

/**
 * Return regexp to check, that CSS string contain word
 */
module.exports.regexp = function (word, escape = true) {
  if (escape) {
    word = this.escapeRegexp(word)
  }
  return new RegExp(`(^|[\\s,(])(${word}($|[\\s(,]))`, 'gi')
}

/**
 * Change comma list
 */
module.exports.editList = function (value, callback) {
  let origin = list.comma(value)
  let changed = callback(origin, [])

  if (origin === changed) {
    return value
  }

  let join = value.match(/,\s*/)
  join = join ? join[0] : ', '
  return changed.join(join)
}

/**
 * Split the selector into parts.
 * It returns 3 level deep array because selectors can be comma
 * separated (1), space separated (2), and combined (3)
 * @param {String} selector selector string
 * @return {Array<Array<Array>>} 3 level deep array of split selector
 * @see utils.test.js for examples
 */
module.exports.splitSelector = function (selector) {
  return list.comma(selector).map(i => {
    return list.space(i).map(k => {
      return k.split(/(?=\.|#)/g)
    })
  })
}

/**
 * Return true if a given value only contains numbers.
 * @param {*} value
 * @returns {boolean}
 */
module.exports.isPureNumber = function (value) {
  if (typeof value === 'number') {
    return true
  }
  if (typeof value === 'string') {
    return /^[0-9]+$/.test(value)
  }
  return false
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014137, function(require, module, exports) {
let vendor = require('./vendor')
let Declaration = require('./declaration')
let Resolution = require('./resolution')
let Transition = require('./transition')
let Processor = require('./processor')
let Supports = require('./supports')
let Browsers = require('./browsers')
let Selector = require('./selector')
let AtRule = require('./at-rule')
let Value = require('./value')
let utils = require('./utils')
let hackFullscreen = require('./hacks/fullscreen')
let hackPlaceholder = require('./hacks/placeholder')
let hackPlaceholderShown = require('./hacks/placeholder-shown')
let hackFileSelectorButton = require('./hacks/file-selector-button')
let hackFlex = require('./hacks/flex')
let hackOrder = require('./hacks/order')
let hackFilter = require('./hacks/filter')
let hackGridEnd = require('./hacks/grid-end')
let hackAnimation = require('./hacks/animation')
let hackFlexFlow = require('./hacks/flex-flow')
let hackFlexGrow = require('./hacks/flex-grow')
let hackFlexWrap = require('./hacks/flex-wrap')
let hackGridArea = require('./hacks/grid-area')
let hackPlaceSelf = require('./hacks/place-self')
let hackGridStart = require('./hacks/grid-start')
let hackAlignSelf = require('./hacks/align-self')
let hackAppearance = require('./hacks/appearance')
let hackFlexBasis = require('./hacks/flex-basis')
let hackMaskBorder = require('./hacks/mask-border')
let hackMaskComposite = require('./hacks/mask-composite')
let hackAlignItems = require('./hacks/align-items')
let hackUserSelect = require('./hacks/user-select')
let hackFlexShrink = require('./hacks/flex-shrink')
let hackBreakProps = require('./hacks/break-props')
let hackWritingMode = require('./hacks/writing-mode')
let hackBorderImage = require('./hacks/border-image')
let hackAlignContent = require('./hacks/align-content')
let hackBorderRadius = require('./hacks/border-radius')
let hackBlockLogical = require('./hacks/block-logical')
let hackGridTemplate = require('./hacks/grid-template')
let hackInlineLogical = require('./hacks/inline-logical')
let hackGridRowAlign = require('./hacks/grid-row-align')
let hackTransformDecl = require('./hacks/transform-decl')
let hackFlexDirection = require('./hacks/flex-direction')
let hackImageRendering = require('./hacks/image-rendering')
let hackBackdropFilter = require('./hacks/backdrop-filter')
let hackBackgroundClip = require('./hacks/background-clip')
let hackTextDecoration = require('./hacks/text-decoration')
let hackJustifyContent = require('./hacks/justify-content')
let hackBackgroundSize = require('./hacks/background-size')
let hackGridRowColumn = require('./hacks/grid-row-column')
let hackGridRowsColumns = require('./hacks/grid-rows-columns')
let hackGridColumnAlign = require('./hacks/grid-column-align')
let hackPrintColorAdjust = require('./hacks/print-color-adjust')
let hackOverscrollBehavior = require('./hacks/overscroll-behavior')
let hackGridTemplateAreas = require('./hacks/grid-template-areas')
let hackTextEmphasisPosition = require('./hacks/text-emphasis-position')
let hackTextDecorationSkipInk = require('./hacks/text-decoration-skip-ink')
let hackGradient = require('./hacks/gradient')
let hackIntrinsic = require('./hacks/intrinsic')
let hackPixelated = require('./hacks/pixelated')
let hackImageSet = require('./hacks/image-set')
let hackCrossFade = require('./hacks/cross-fade')
let hackDisplayFlex = require('./hacks/display-flex')
let hackDisplayGrid = require('./hacks/display-grid')
let hackFilterValue = require('./hacks/filter-value')
let hackAutofill = require('./hacks/autofill')

Selector.hack(hackAutofill)
Selector.hack(hackFullscreen)
Selector.hack(hackPlaceholder)
Selector.hack(hackPlaceholderShown)
Selector.hack(hackFileSelectorButton)
Declaration.hack(hackFlex)
Declaration.hack(hackOrder)
Declaration.hack(hackFilter)
Declaration.hack(hackGridEnd)
Declaration.hack(hackAnimation)
Declaration.hack(hackFlexFlow)
Declaration.hack(hackFlexGrow)
Declaration.hack(hackFlexWrap)
Declaration.hack(hackGridArea)
Declaration.hack(hackPlaceSelf)
Declaration.hack(hackGridStart)
Declaration.hack(hackAlignSelf)
Declaration.hack(hackAppearance)
Declaration.hack(hackFlexBasis)
Declaration.hack(hackMaskBorder)
Declaration.hack(hackMaskComposite)
Declaration.hack(hackAlignItems)
Declaration.hack(hackUserSelect)
Declaration.hack(hackFlexShrink)
Declaration.hack(hackBreakProps)
Declaration.hack(hackWritingMode)
Declaration.hack(hackBorderImage)
Declaration.hack(hackAlignContent)
Declaration.hack(hackBorderRadius)
Declaration.hack(hackBlockLogical)
Declaration.hack(hackGridTemplate)
Declaration.hack(hackInlineLogical)
Declaration.hack(hackGridRowAlign)
Declaration.hack(hackTransformDecl)
Declaration.hack(hackFlexDirection)
Declaration.hack(hackImageRendering)
Declaration.hack(hackBackdropFilter)
Declaration.hack(hackBackgroundClip)
Declaration.hack(hackTextDecoration)
Declaration.hack(hackJustifyContent)
Declaration.hack(hackBackgroundSize)
Declaration.hack(hackGridRowColumn)
Declaration.hack(hackGridRowsColumns)
Declaration.hack(hackGridColumnAlign)
Declaration.hack(hackOverscrollBehavior)
Declaration.hack(hackGridTemplateAreas)
Declaration.hack(hackPrintColorAdjust)
Declaration.hack(hackTextEmphasisPosition)
Declaration.hack(hackTextDecorationSkipInk)
Value.hack(hackGradient)
Value.hack(hackIntrinsic)
Value.hack(hackPixelated)
Value.hack(hackImageSet)
Value.hack(hackCrossFade)
Value.hack(hackDisplayFlex)
Value.hack(hackDisplayGrid)
Value.hack(hackFilterValue)

let declsCache = new Map()

class Prefixes {
  constructor(data, browsers, options = {}) {
    this.data = data
    this.browsers = browsers
    this.options = options
    ;[this.add, this.remove] = this.preprocess(this.select(this.data))
    this.transition = new Transition(this)
    this.processor = new Processor(this)
  }

  /**
   * Return clone instance to remove all prefixes
   */
  cleaner() {
    if (this.cleanerCache) {
      return this.cleanerCache
    }

    if (this.browsers.selected.length) {
      let empty = new Browsers(this.browsers.data, [])
      this.cleanerCache = new Prefixes(this.data, empty, this.options)
    } else {
      return this
    }

    return this.cleanerCache
  }

  /**
   * Select prefixes from data, which is necessary for selected browsers
   */
  select(list) {
    let selected = { add: {}, remove: {} }

    for (let name in list) {
      let data = list[name]
      let add = data.browsers.map(i => {
        let params = i.split(' ')
        return {
          browser: `${params[0]} ${params[1]}`,
          note: params[2]
        }
      })

      let notes = add
        .filter(i => i.note)
        .map(i => `${this.browsers.prefix(i.browser)} ${i.note}`)
      notes = utils.uniq(notes)

      add = add
        .filter(i => this.browsers.isSelected(i.browser))
        .map(i => {
          let prefix = this.browsers.prefix(i.browser)
          if (i.note) {
            return `${prefix} ${i.note}`
          } else {
            return prefix
          }
        })
      add = this.sort(utils.uniq(add))

      if (this.options.flexbox === 'no-2009') {
        add = add.filter(i => !i.includes('2009'))
      }

      let all = data.browsers.map(i => this.browsers.prefix(i))
      if (data.mistakes) {
        all = all.concat(data.mistakes)
      }
      all = all.concat(notes)
      all = utils.uniq(all)

      if (add.length) {
        selected.add[name] = add
        if (add.length < all.length) {
          selected.remove[name] = all.filter(i => !add.includes(i))
        }
      } else {
        selected.remove[name] = all
      }
    }

    return selected
  }

  /**
   * Sort vendor prefixes
   */
  sort(prefixes) {
    return prefixes.sort((a, b) => {
      let aLength = utils.removeNote(a).length
      let bLength = utils.removeNote(b).length

      if (aLength === bLength) {
        return b.length - a.length
      } else {
        return bLength - aLength
      }
    })
  }

  /**
   * Cache prefixes data to fast CSS processing
   */
  preprocess(selected) {
    let add = {
      'selectors': [],
      '@supports': new Supports(Prefixes, this)
    }
    for (let name in selected.add) {
      let prefixes = selected.add[name]
      if (name === '@keyframes' || name === '@viewport') {
        add[name] = new AtRule(name, prefixes, this)
      } else if (name === '@resolution') {
        add[name] = new Resolution(name, prefixes, this)
      } else if (this.data[name].selector) {
        add.selectors.push(Selector.load(name, prefixes, this))
      } else {
        let props = this.data[name].props

        if (props) {
          let value = Value.load(name, prefixes, this)
          for (let prop of props) {
            if (!add[prop]) {
              add[prop] = { values: [] }
            }
            add[prop].values.push(value)
          }
        } else {
          let values = (add[name] && add[name].values) || []
          add[name] = Declaration.load(name, prefixes, this)
          add[name].values = values
        }
      }
    }

    let remove = { selectors: [] }
    for (let name in selected.remove) {
      let prefixes = selected.remove[name]
      if (this.data[name].selector) {
        let selector = Selector.load(name, prefixes)
        for (let prefix of prefixes) {
          remove.selectors.push(selector.old(prefix))
        }
      } else if (name === '@keyframes' || name === '@viewport') {
        for (let prefix of prefixes) {
          let prefixed = `@${prefix}${name.slice(1)}`
          remove[prefixed] = { remove: true }
        }
      } else if (name === '@resolution') {
        remove[name] = new Resolution(name, prefixes, this)
      } else {
        let props = this.data[name].props
        if (props) {
          let value = Value.load(name, [], this)
          for (let prefix of prefixes) {
            let old = value.old(prefix)
            if (old) {
              for (let prop of props) {
                if (!remove[prop]) {
                  remove[prop] = {}
                }
                if (!remove[prop].values) {
                  remove[prop].values = []
                }
                remove[prop].values.push(old)
              }
            }
          }
        } else {
          for (let p of prefixes) {
            let olds = this.decl(name).old(name, p)
            if (name === 'align-self') {
              let a = add[name] && add[name].prefixes
              if (a) {
                if (p === '-webkit- 2009' && a.includes('-webkit-')) {
                  continue
                } else if (p === '-webkit-' && a.includes('-webkit- 2009')) {
                  continue
                }
              }
            }
            for (let prefixed of olds) {
              if (!remove[prefixed]) {
                remove[prefixed] = {}
              }
              remove[prefixed].remove = true
            }
          }
        }
      }
    }

    return [add, remove]
  }

  /**
   * Declaration loader with caching
   */
  decl(prop) {
    if (!declsCache.has(prop)) {
      declsCache.set(prop, Declaration.load(prop))
    }

    return declsCache.get(prop)
  }

  /**
   * Return unprefixed version of property
   */
  unprefixed(prop) {
    let value = this.normalize(vendor.unprefixed(prop))
    if (value === 'flex-direction') {
      value = 'flex-flow'
    }
    return value
  }

  /**
   * Normalize prefix for remover
   */
  normalize(prop) {
    return this.decl(prop).normalize(prop)
  }

  /**
   * Return prefixed version of property
   */
  prefixed(prop, prefix) {
    prop = vendor.unprefixed(prop)
    return this.decl(prop).prefixed(prop, prefix)
  }

  /**
   * Return values, which must be prefixed in selected property
   */
  values(type, prop) {
    let data = this[type]

    let global = data['*'] && data['*'].values
    let values = data[prop] && data[prop].values

    if (global && values) {
      return utils.uniq(global.concat(values))
    } else {
      return global || values || []
    }
  }

  /**
   * Group declaration by unprefixed property to check them
   */
  group(decl) {
    let rule = decl.parent
    let index = rule.index(decl)
    let { length } = rule.nodes
    let unprefixed = this.unprefixed(decl.prop)

    let checker = (step, callback) => {
      index += step
      while (index >= 0 && index < length) {
        let other = rule.nodes[index]
        if (other.type === 'decl') {
          if (step === -1 && other.prop === unprefixed) {
            if (!Browsers.withPrefix(other.value)) {
              break
            }
          }

          if (this.unprefixed(other.prop) !== unprefixed) {
            break
          } else if (callback(other) === true) {
            return true
          }

          if (step === +1 && other.prop === unprefixed) {
            if (!Browsers.withPrefix(other.value)) {
              break
            }
          }
        }

        index += step
      }
      return false
    }

    return {
      up(callback) {
        return checker(-1, callback)
      },
      down(callback) {
        return checker(+1, callback)
      }
    }
  }
}

module.exports = Prefixes

}, function(modId) { var map = {"./vendor":1679975014138,"./declaration":1679975014139,"./resolution":1679975014141,"./transition":1679975014142,"./processor":1679975014143,"./supports":1679975014147,"./browsers":1679975014135,"./selector":1679975014149,"./at-rule":1679975014151,"./value":1679975014144,"./utils":1679975014136,"./hacks/fullscreen":1679975014152,"./hacks/placeholder":1679975014153,"./hacks/placeholder-shown":1679975014154,"./hacks/file-selector-button":1679975014155,"./hacks/flex":1679975014156,"./hacks/order":1679975014158,"./hacks/filter":1679975014159,"./hacks/grid-end":1679975014160,"./hacks/animation":1679975014161,"./hacks/flex-flow":1679975014162,"./hacks/flex-grow":1679975014163,"./hacks/flex-wrap":1679975014164,"./hacks/grid-area":1679975014165,"./hacks/place-self":1679975014166,"./hacks/grid-start":1679975014167,"./hacks/align-self":1679975014168,"./hacks/appearance":1679975014169,"./hacks/flex-basis":1679975014170,"./hacks/mask-border":1679975014171,"./hacks/mask-composite":1679975014172,"./hacks/align-items":1679975014173,"./hacks/user-select":1679975014174,"./hacks/flex-shrink":1679975014175,"./hacks/break-props":1679975014176,"./hacks/writing-mode":1679975014177,"./hacks/border-image":1679975014178,"./hacks/align-content":1679975014179,"./hacks/border-radius":1679975014180,"./hacks/block-logical":1679975014181,"./hacks/grid-template":1679975014182,"./hacks/inline-logical":1679975014183,"./hacks/grid-row-align":1679975014184,"./hacks/transform-decl":1679975014185,"./hacks/flex-direction":1679975014186,"./hacks/image-rendering":1679975014187,"./hacks/backdrop-filter":1679975014188,"./hacks/background-clip":1679975014189,"./hacks/text-decoration":1679975014190,"./hacks/justify-content":1679975014191,"./hacks/background-size":1679975014192,"./hacks/grid-row-column":1679975014193,"./hacks/grid-rows-columns":1679975014194,"./hacks/grid-column-align":1679975014195,"./hacks/print-color-adjust":1679975014196,"./hacks/overscroll-behavior":1679975014197,"./hacks/grid-template-areas":1679975014198,"./hacks/text-emphasis-position":1679975014199,"./hacks/text-decoration-skip-ink":1679975014200,"./hacks/gradient":1679975014201,"./hacks/intrinsic":1679975014202,"./hacks/pixelated":1679975014203,"./hacks/image-set":1679975014204,"./hacks/cross-fade":1679975014205,"./hacks/display-flex":1679975014206,"./hacks/display-grid":1679975014207,"./hacks/filter-value":1679975014208,"./hacks/autofill":1679975014209}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014138, function(require, module, exports) {
module.exports = {
  prefix(prop) {
    let match = prop.match(/^(-\w+-)/)
    if (match) {
      return match[0]
    }

    return ''
  },

  unprefixed(prop) {
    return prop.replace(/^-\w+-/, '')
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014139, function(require, module, exports) {
let Prefixer = require('./prefixer')
let Browsers = require('./browsers')
let utils = require('./utils')

class Declaration extends Prefixer {
  /**
   * Always true, because we already get prefixer by property name
   */
  check(/* decl */) {
    return true
  }

  /**
   * Return prefixed version of property
   */
  prefixed(prop, prefix) {
    return prefix + prop
  }

  /**
   * Return unprefixed version of property
   */
  normalize(prop) {
    return prop
  }

  /**
   * Check `value`, that it contain other prefixes, rather than `prefix`
   */
  otherPrefixes(value, prefix) {
    for (let other of Browsers.prefixes()) {
      if (other === prefix) {
        continue
      }
      if (value.includes(other)) {
        return value.replace(/var\([^)]+\)/, '').includes(other)
      }
    }
    return false
  }

  /**
   * Set prefix to declaration
   */
  set(decl, prefix) {
    decl.prop = this.prefixed(decl.prop, prefix)
    return decl
  }

  /**
   * Should we use visual cascade for prefixes
   */
  needCascade(decl) {
    if (!decl._autoprefixerCascade) {
      decl._autoprefixerCascade =
        this.all.options.cascade !== false && decl.raw('before').includes('\n')
    }
    return decl._autoprefixerCascade
  }

  /**
   * Return maximum length of possible prefixed property
   */
  maxPrefixed(prefixes, decl) {
    if (decl._autoprefixerMax) {
      return decl._autoprefixerMax
    }

    let max = 0
    for (let prefix of prefixes) {
      prefix = utils.removeNote(prefix)
      if (prefix.length > max) {
        max = prefix.length
      }
    }
    decl._autoprefixerMax = max

    return decl._autoprefixerMax
  }

  /**
   * Calculate indentation to create visual cascade
   */
  calcBefore(prefixes, decl, prefix = '') {
    let max = this.maxPrefixed(prefixes, decl)
    let diff = max - utils.removeNote(prefix).length

    let before = decl.raw('before')
    if (diff > 0) {
      before += Array(diff).fill(' ').join('')
    }

    return before
  }

  /**
   * Remove visual cascade
   */
  restoreBefore(decl) {
    let lines = decl.raw('before').split('\n')
    let min = lines[lines.length - 1]

    this.all.group(decl).up(prefixed => {
      let array = prefixed.raw('before').split('\n')
      let last = array[array.length - 1]
      if (last.length < min.length) {
        min = last
      }
    })

    lines[lines.length - 1] = min
    decl.raws.before = lines.join('\n')
  }

  /**
   * Clone and insert new declaration
   */
  insert(decl, prefix, prefixes) {
    let cloned = this.set(this.clone(decl), prefix)
    if (!cloned) return undefined

    let already = decl.parent.some(
      i => i.prop === cloned.prop && i.value === cloned.value
    )
    if (already) {
      return undefined
    }

    if (this.needCascade(decl)) {
      cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
    }
    return decl.parent.insertBefore(decl, cloned)
  }

  /**
   * Did this declaration has this prefix above
   */
  isAlready(decl, prefixed) {
    let already = this.all.group(decl).up(i => i.prop === prefixed)
    if (!already) {
      already = this.all.group(decl).down(i => i.prop === prefixed)
    }
    return already
  }

  /**
   * Clone and add prefixes for declaration
   */
  add(decl, prefix, prefixes, result) {
    let prefixed = this.prefixed(decl.prop, prefix)
    if (
      this.isAlready(decl, prefixed) ||
      this.otherPrefixes(decl.value, prefix)
    ) {
      return undefined
    }
    return this.insert(decl, prefix, prefixes, result)
  }

  /**
   * Add spaces for visual cascade
   */
  process(decl, result) {
    if (!this.needCascade(decl)) {
      super.process(decl, result)
      return
    }

    let prefixes = super.process(decl, result)

    if (!prefixes || !prefixes.length) {
      return
    }

    this.restoreBefore(decl)
    decl.raws.before = this.calcBefore(prefixes, decl)
  }

  /**
   * Return list of prefixed properties to clean old prefixes
   */
  old(prop, prefix) {
    return [this.prefixed(prop, prefix)]
  }
}

module.exports = Declaration

}, function(modId) { var map = {"./prefixer":1679975014140,"./browsers":1679975014135,"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014140, function(require, module, exports) {
let Browsers = require('./browsers')
let vendor = require('./vendor')
let utils = require('./utils')

/**
 * Recursively clone objects
 */
function clone(obj, parent) {
  let cloned = new obj.constructor()

  for (let i of Object.keys(obj || {})) {
    let value = obj[i]
    if (i === 'parent' && typeof value === 'object') {
      if (parent) {
        cloned[i] = parent
      }
    } else if (i === 'source' || i === null) {
      cloned[i] = value
    } else if (Array.isArray(value)) {
      cloned[i] = value.map(x => clone(x, cloned))
    } else if (
      i !== '_autoprefixerPrefix' &&
      i !== '_autoprefixerValues' &&
      i !== 'proxyCache'
    ) {
      if (typeof value === 'object' && value !== null) {
        value = clone(value, cloned)
      }
      cloned[i] = value
    }
  }

  return cloned
}

class Prefixer {
  /**
   * Add hack to selected names
   */
  static hack(klass) {
    if (!this.hacks) {
      this.hacks = {}
    }
    return klass.names.map(name => {
      this.hacks[name] = klass
      return this.hacks[name]
    })
  }

  /**
   * Load hacks for some names
   */
  static load(name, prefixes, all) {
    let Klass = this.hacks && this.hacks[name]
    if (Klass) {
      return new Klass(name, prefixes, all)
    } else {
      return new this(name, prefixes, all)
    }
  }

  /**
   * Clone node and clean autprefixer custom caches
   */
  static clone(node, overrides) {
    let cloned = clone(node)
    for (let name in overrides) {
      cloned[name] = overrides[name]
    }
    return cloned
  }

  constructor(name, prefixes, all) {
    this.prefixes = prefixes
    this.name = name
    this.all = all
  }

  /**
   * Find prefix in node parents
   */
  parentPrefix(node) {
    let prefix

    if (typeof node._autoprefixerPrefix !== 'undefined') {
      prefix = node._autoprefixerPrefix
    } else if (node.type === 'decl' && node.prop[0] === '-') {
      prefix = vendor.prefix(node.prop)
    } else if (node.type === 'root') {
      prefix = false
    } else if (
      node.type === 'rule' &&
      node.selector.includes(':-') &&
      /:(-\w+-)/.test(node.selector)
    ) {
      prefix = node.selector.match(/:(-\w+-)/)[1]
    } else if (node.type === 'atrule' && node.name[0] === '-') {
      prefix = vendor.prefix(node.name)
    } else {
      prefix = this.parentPrefix(node.parent)
    }

    if (!Browsers.prefixes().includes(prefix)) {
      prefix = false
    }

    node._autoprefixerPrefix = prefix

    return node._autoprefixerPrefix
  }

  /**
   * Clone node with prefixes
   */
  process(node, result) {
    if (!this.check(node)) {
      return undefined
    }

    let parent = this.parentPrefix(node)

    let prefixes = this.prefixes.filter(
      prefix => !parent || parent === utils.removeNote(prefix)
    )

    let added = []
    for (let prefix of prefixes) {
      if (this.add(node, prefix, added.concat([prefix]), result)) {
        added.push(prefix)
      }
    }

    return added
  }

  /**
   * Shortcut for Prefixer.clone
   */
  clone(node, overrides) {
    return Prefixer.clone(node, overrides)
  }
}

module.exports = Prefixer

}, function(modId) { var map = {"./browsers":1679975014135,"./vendor":1679975014138,"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014141, function(require, module, exports) {
let FractionJs = require('fraction.js')

let Prefixer = require('./prefixer')
let utils = require('./utils')

const REGEXP = /(min|max)-resolution\s*:\s*\d*\.?\d+(dppx|dpcm|dpi|x)/gi
const SPLIT = /(min|max)-resolution(\s*:\s*)(\d*\.?\d+)(dppx|dpcm|dpi|x)/i

class Resolution extends Prefixer {
  /**
   * Return prefixed query name
   */
  prefixName(prefix, name) {
    if (prefix === '-moz-') {
      return name + '--moz-device-pixel-ratio'
    } else {
      return prefix + name + '-device-pixel-ratio'
    }
  }

  /**
   * Return prefixed query
   */
  prefixQuery(prefix, name, colon, value, units) {
    value = new FractionJs(value)

    // 1dpcm = 2.54dpi
    // 1dppx = 96dpi
    if (units === 'dpi') {
      value = value.div(96)
    } else if (units === 'dpcm') {
      value = value.mul(2.54).div(96)
    }
    value = value.simplify()

    if (prefix === '-o-') {
      value = value.n + '/' + value.d
    }
    return this.prefixName(prefix, name) + colon + value
  }

  /**
   * Remove prefixed queries
   */
  clean(rule) {
    if (!this.bad) {
      this.bad = []
      for (let prefix of this.prefixes) {
        this.bad.push(this.prefixName(prefix, 'min'))
        this.bad.push(this.prefixName(prefix, 'max'))
      }
    }

    rule.params = utils.editList(rule.params, queries => {
      return queries.filter(query => this.bad.every(i => !query.includes(i)))
    })
  }

  /**
   * Add prefixed queries
   */
  process(rule) {
    let parent = this.parentPrefix(rule)
    let prefixes = parent ? [parent] : this.prefixes

    rule.params = utils.editList(rule.params, (origin, prefixed) => {
      for (let query of origin) {
        if (
          !query.includes('min-resolution') &&
          !query.includes('max-resolution')
        ) {
          prefixed.push(query)
          continue
        }

        for (let prefix of prefixes) {
          let processed = query.replace(REGEXP, str => {
            let parts = str.match(SPLIT)
            return this.prefixQuery(
              prefix,
              parts[1],
              parts[2],
              parts[3],
              parts[4]
            )
          })
          prefixed.push(processed)
        }
        prefixed.push(query)
      }

      return utils.uniq(prefixed)
    })
  }
}

module.exports = Resolution

}, function(modId) { var map = {"./prefixer":1679975014140,"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014142, function(require, module, exports) {
let { list } = require('postcss')
let parser = require('postcss-value-parser')

let Browsers = require('./browsers')
let vendor = require('./vendor')

class Transition {
  constructor(prefixes) {
    this.props = ['transition', 'transition-property']
    this.prefixes = prefixes
  }

  /**
   * Process transition and add prefixes for all necessary properties
   */
  add(decl, result) {
    let prefix, prop
    let add = this.prefixes.add[decl.prop]
    let vendorPrefixes = this.ruleVendorPrefixes(decl)
    let declPrefixes = vendorPrefixes || (add && add.prefixes) || []

    let params = this.parse(decl.value)
    let names = params.map(i => this.findProp(i))
    let added = []

    if (names.some(i => i[0] === '-')) {
      return
    }

    for (let param of params) {
      prop = this.findProp(param)
      if (prop[0] === '-') continue

      let prefixer = this.prefixes.add[prop]
      if (!prefixer || !prefixer.prefixes) continue

      for (prefix of prefixer.prefixes) {
        if (vendorPrefixes && !vendorPrefixes.some(p => prefix.includes(p))) {
          continue
        }

        let prefixed = this.prefixes.prefixed(prop, prefix)
        if (prefixed !== '-ms-transform' && !names.includes(prefixed)) {
          if (!this.disabled(prop, prefix)) {
            added.push(this.clone(prop, prefixed, param))
          }
        }
      }
    }

    params = params.concat(added)
    let value = this.stringify(params)

    let webkitClean = this.stringify(
      this.cleanFromUnprefixed(params, '-webkit-')
    )
    if (declPrefixes.includes('-webkit-')) {
      this.cloneBefore(decl, `-webkit-${decl.prop}`, webkitClean)
    }
    this.cloneBefore(decl, decl.prop, webkitClean)
    if (declPrefixes.includes('-o-')) {
      let operaClean = this.stringify(this.cleanFromUnprefixed(params, '-o-'))
      this.cloneBefore(decl, `-o-${decl.prop}`, operaClean)
    }

    for (prefix of declPrefixes) {
      if (prefix !== '-webkit-' && prefix !== '-o-') {
        let prefixValue = this.stringify(
          this.cleanOtherPrefixes(params, prefix)
        )
        this.cloneBefore(decl, prefix + decl.prop, prefixValue)
      }
    }

    if (value !== decl.value && !this.already(decl, decl.prop, value)) {
      this.checkForWarning(result, decl)
      decl.cloneBefore()
      decl.value = value
    }
  }

  /**
   * Find property name
   */
  findProp(param) {
    let prop = param[0].value
    if (/^\d/.test(prop)) {
      for (let [i, token] of param.entries()) {
        if (i !== 0 && token.type === 'word') {
          return token.value
        }
      }
    }
    return prop
  }

  /**
   * Does we already have this declaration
   */
  already(decl, prop, value) {
    return decl.parent.some(i => i.prop === prop && i.value === value)
  }

  /**
   * Add declaration if it is not exist
   */
  cloneBefore(decl, prop, value) {
    if (!this.already(decl, prop, value)) {
      decl.cloneBefore({ prop, value })
    }
  }

  /**
   * Show transition-property warning
   */
  checkForWarning(result, decl) {
    if (decl.prop !== 'transition-property') {
      return
    }

    let isPrefixed = false
    let hasAssociatedProp = false

    decl.parent.each(i => {
      if (i.type !== 'decl') {
        return undefined
      }
      if (i.prop.indexOf('transition-') !== 0) {
        return undefined
      }
      let values = list.comma(i.value)
      // check if current Rule's transition-property comma separated value list needs prefixes
      if (i.prop === 'transition-property') {
        values.forEach(value => {
          let lookup = this.prefixes.add[value]
          if (lookup && lookup.prefixes && lookup.prefixes.length > 0) {
            isPrefixed = true
          }
        })
        return undefined
      }
      // check if another transition-* prop in current Rule has comma separated value list
      hasAssociatedProp = hasAssociatedProp || values.length > 1
      return false
    })

    if (isPrefixed && hasAssociatedProp) {
      decl.warn(
        result,
        'Replace transition-property to transition, ' +
          'because Autoprefixer could not support ' +
          'any cases of transition-property ' +
          'and other transition-*'
      )
    }
  }

  /**
   * Process transition and remove all unnecessary properties
   */
  remove(decl) {
    let params = this.parse(decl.value)
    params = params.filter(i => {
      let prop = this.prefixes.remove[this.findProp(i)]
      return !prop || !prop.remove
    })
    let value = this.stringify(params)

    if (decl.value === value) {
      return
    }

    if (params.length === 0) {
      decl.remove()
      return
    }

    let double = decl.parent.some(i => {
      return i.prop === decl.prop && i.value === value
    })
    let smaller = decl.parent.some(i => {
      return i !== decl && i.prop === decl.prop && i.value.length > value.length
    })

    if (double || smaller) {
      decl.remove()
      return
    }

    decl.value = value
  }

  /**
   * Parse properties list to array
   */
  parse(value) {
    let ast = parser(value)
    let result = []
    let param = []
    for (let node of ast.nodes) {
      param.push(node)
      if (node.type === 'div' && node.value === ',') {
        result.push(param)
        param = []
      }
    }
    result.push(param)
    return result.filter(i => i.length > 0)
  }

  /**
   * Return properties string from array
   */
  stringify(params) {
    if (params.length === 0) {
      return ''
    }
    let nodes = []
    for (let param of params) {
      if (param[param.length - 1].type !== 'div') {
        param.push(this.div(params))
      }
      nodes = nodes.concat(param)
    }
    if (nodes[0].type === 'div') {
      nodes = nodes.slice(1)
    }
    if (nodes[nodes.length - 1].type === 'div') {
      nodes = nodes.slice(0, +-2 + 1 || undefined)
    }
    return parser.stringify({ nodes })
  }

  /**
   * Return new param array with different name
   */
  clone(origin, name, param) {
    let result = []
    let changed = false
    for (let i of param) {
      if (!changed && i.type === 'word' && i.value === origin) {
        result.push({ type: 'word', value: name })
        changed = true
      } else {
        result.push(i)
      }
    }
    return result
  }

  /**
   * Find or create separator
   */
  div(params) {
    for (let param of params) {
      for (let node of param) {
        if (node.type === 'div' && node.value === ',') {
          return node
        }
      }
    }
    return { type: 'div', value: ',', after: ' ' }
  }

  cleanOtherPrefixes(params, prefix) {
    return params.filter(param => {
      let current = vendor.prefix(this.findProp(param))
      return current === '' || current === prefix
    })
  }

  /**
   * Remove all non-webkit prefixes and unprefixed params if we have prefixed
   */
  cleanFromUnprefixed(params, prefix) {
    let remove = params
      .map(i => this.findProp(i))
      .filter(i => i.slice(0, prefix.length) === prefix)
      .map(i => this.prefixes.unprefixed(i))

    let result = []
    for (let param of params) {
      let prop = this.findProp(param)
      let p = vendor.prefix(prop)
      if (!remove.includes(prop) && (p === prefix || p === '')) {
        result.push(param)
      }
    }
    return result
  }

  /**
   * Check property for disabled by option
   */
  disabled(prop, prefix) {
    let other = ['order', 'justify-content', 'align-self', 'align-content']
    if (prop.includes('flex') || other.includes(prop)) {
      if (this.prefixes.options.flexbox === false) {
        return true
      }

      if (this.prefixes.options.flexbox === 'no-2009') {
        return prefix.includes('2009')
      }
    }
    return undefined
  }

  /**
   * Check if transition prop is inside vendor specific rule
   */
  ruleVendorPrefixes(decl) {
    let { parent } = decl

    if (parent.type !== 'rule') {
      return false
    } else if (!parent.selector.includes(':-')) {
      return false
    }

    let selectors = Browsers.prefixes().filter(s =>
      parent.selector.includes(':' + s)
    )

    return selectors.length > 0 ? selectors : false
  }
}

module.exports = Transition

}, function(modId) { var map = {"./browsers":1679975014135,"./vendor":1679975014138}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014143, function(require, module, exports) {
let parser = require('postcss-value-parser')

let Value = require('./value')
let insertAreas = require('./hacks/grid-utils').insertAreas

const OLD_LINEAR = /(^|[^-])linear-gradient\(\s*(top|left|right|bottom)/i
const OLD_RADIAL = /(^|[^-])radial-gradient\(\s*\d+(\w*|%)\s+\d+(\w*|%)\s*,/i
const IGNORE_NEXT = /(!\s*)?autoprefixer:\s*ignore\s+next/i
const GRID_REGEX = /(!\s*)?autoprefixer\s*grid:\s*(on|off|(no-)?autoplace)/i

const SIZES = [
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'inline-size',
  'min-inline-size',
  'max-inline-size',
  'block-size',
  'min-block-size',
  'max-block-size'
]

function hasGridTemplate(decl) {
  return decl.parent.some(
    i => i.prop === 'grid-template' || i.prop === 'grid-template-areas'
  )
}

function hasRowsAndColumns(decl) {
  let hasRows = decl.parent.some(i => i.prop === 'grid-template-rows')
  let hasColumns = decl.parent.some(i => i.prop === 'grid-template-columns')
  return hasRows && hasColumns
}

class Processor {
  constructor(prefixes) {
    this.prefixes = prefixes
  }

  /**
   * Add necessary prefixes
   */
  add(css, result) {
    // At-rules
    let resolution = this.prefixes.add['@resolution']
    let keyframes = this.prefixes.add['@keyframes']
    let viewport = this.prefixes.add['@viewport']
    let supports = this.prefixes.add['@supports']

    css.walkAtRules(rule => {
      if (rule.name === 'keyframes') {
        if (!this.disabled(rule, result)) {
          return keyframes && keyframes.process(rule)
        }
      } else if (rule.name === 'viewport') {
        if (!this.disabled(rule, result)) {
          return viewport && viewport.process(rule)
        }
      } else if (rule.name === 'supports') {
        if (
          this.prefixes.options.supports !== false &&
          !this.disabled(rule, result)
        ) {
          return supports.process(rule)
        }
      } else if (rule.name === 'media' && rule.params.includes('-resolution')) {
        if (!this.disabled(rule, result)) {
          return resolution && resolution.process(rule)
        }
      }

      return undefined
    })

    // Selectors
    css.walkRules(rule => {
      if (this.disabled(rule, result)) return undefined

      return this.prefixes.add.selectors.map(selector => {
        return selector.process(rule, result)
      })
    })

    function insideGrid(decl) {
      return decl.parent.nodes.some(node => {
        if (node.type !== 'decl') return false
        let displayGrid =
          node.prop === 'display' && /(inline-)?grid/.test(node.value)
        let gridTemplate = node.prop.startsWith('grid-template')
        let gridGap = /^grid-([A-z]+-)?gap/.test(node.prop)
        return displayGrid || gridTemplate || gridGap
      })
    }
    function insideFlex(decl) {
      return decl.parent.some(node => {
        return node.prop === 'display' && /(inline-)?flex/.test(node.value)
      })
    }

    let gridPrefixes =
      this.gridStatus(css, result) &&
      this.prefixes.add['grid-area'] &&
      this.prefixes.add['grid-area'].prefixes

    css.walkDecls(decl => {
      if (this.disabledDecl(decl, result)) return undefined

      let parent = decl.parent
      let prop = decl.prop
      let value = decl.value

      if (prop === 'color-adjust') {
        if (parent.every(i => i.prop !== 'print-color-adjust')) {
          result.warn(
            'Replace color-adjust to print-color-adjust. ' +
              'The color-adjust shorthand is currently deprecated.',
            { node: decl }
          )
        }
      } else if (prop === 'grid-row-span') {
        result.warn(
          'grid-row-span is not part of final Grid Layout. Use grid-row.',
          { node: decl }
        )
        return undefined
      } else if (prop === 'grid-column-span') {
        result.warn(
          'grid-column-span is not part of final Grid Layout. Use grid-column.',
          { node: decl }
        )
        return undefined
      } else if (prop === 'display' && value === 'box') {
        result.warn(
          'You should write display: flex by final spec ' +
            'instead of display: box',
          { node: decl }
        )
        return undefined
      } else if (prop === 'text-emphasis-position') {
        if (value === 'under' || value === 'over') {
          result.warn(
            'You should use 2 values for text-emphasis-position ' +
              'For example, `under left` instead of just `under`.',
            { node: decl }
          )
        }
      } else if (
        /^(align|justify|place)-(items|content)$/.test(prop) &&
        insideFlex(decl)
      ) {
        if (value === 'start' || value === 'end') {
          result.warn(
            `${value} value has mixed support, consider using ` +
              `flex-${value} instead`,
            { node: decl }
          )
        }
      } else if (prop === 'text-decoration-skip' && value === 'ink') {
        result.warn(
          'Replace text-decoration-skip: ink to ' +
            'text-decoration-skip-ink: auto, because spec had been changed',
          { node: decl }
        )
      } else {
        if (gridPrefixes && this.gridStatus(decl, result)) {
          if (decl.value === 'subgrid') {
            result.warn('IE does not support subgrid', { node: decl })
          }
          if (/^(align|justify|place)-items$/.test(prop) && insideGrid(decl)) {
            let fixed = prop.replace('-items', '-self')
            result.warn(
              `IE does not support ${prop} on grid containers. ` +
                `Try using ${fixed} on child elements instead: ` +
                `${decl.parent.selector} > * { ${fixed}: ${decl.value} }`,
              { node: decl }
            )
          } else if (
            /^(align|justify|place)-content$/.test(prop) &&
            insideGrid(decl)
          ) {
            result.warn(`IE does not support ${decl.prop} on grid containers`, {
              node: decl
            })
          } else if (prop === 'display' && decl.value === 'contents') {
            result.warn(
              'Please do not use display: contents; ' +
                'if you have grid setting enabled',
              { node: decl }
            )
            return undefined
          } else if (decl.prop === 'grid-gap') {
            let status = this.gridStatus(decl, result)
            if (
              status === 'autoplace' &&
              !hasRowsAndColumns(decl) &&
              !hasGridTemplate(decl)
            ) {
              result.warn(
                'grid-gap only works if grid-template(-areas) is being ' +
                  'used or both rows and columns have been declared ' +
                  'and cells have not been manually ' +
                  'placed inside the explicit grid',
                { node: decl }
              )
            } else if (
              (status === true || status === 'no-autoplace') &&
              !hasGridTemplate(decl)
            ) {
              result.warn(
                'grid-gap only works if grid-template(-areas) is being used',
                { node: decl }
              )
            }
          } else if (prop === 'grid-auto-columns') {
            result.warn('grid-auto-columns is not supported by IE', {
              node: decl
            })
            return undefined
          } else if (prop === 'grid-auto-rows') {
            result.warn('grid-auto-rows is not supported by IE', { node: decl })
            return undefined
          } else if (prop === 'grid-auto-flow') {
            let hasRows = parent.some(i => i.prop === 'grid-template-rows')
            let hasCols = parent.some(i => i.prop === 'grid-template-columns')

            if (hasGridTemplate(decl)) {
              result.warn('grid-auto-flow is not supported by IE', {
                node: decl
              })
            } else if (value.includes('dense')) {
              result.warn('grid-auto-flow: dense is not supported by IE', {
                node: decl
              })
            } else if (!hasRows && !hasCols) {
              result.warn(
                'grid-auto-flow works only if grid-template-rows and ' +
                  'grid-template-columns are present in the same rule',
                { node: decl }
              )
            }
            return undefined
          } else if (value.includes('auto-fit')) {
            result.warn('auto-fit value is not supported by IE', {
              node: decl,
              word: 'auto-fit'
            })
            return undefined
          } else if (value.includes('auto-fill')) {
            result.warn('auto-fill value is not supported by IE', {
              node: decl,
              word: 'auto-fill'
            })
            return undefined
          } else if (prop.startsWith('grid-template') && value.includes('[')) {
            result.warn(
              'Autoprefixer currently does not support line names. ' +
                'Try using grid-template-areas instead.',
              { node: decl, word: '[' }
            )
          }
        }
        if (value.includes('radial-gradient')) {
          if (OLD_RADIAL.test(decl.value)) {
            result.warn(
              'Gradient has outdated direction syntax. ' +
                'New syntax is like `closest-side at 0 0` ' +
                'instead of `0 0, closest-side`.',
              { node: decl }
            )
          } else {
            let ast = parser(value)

            for (let i of ast.nodes) {
              if (i.type === 'function' && i.value === 'radial-gradient') {
                for (let word of i.nodes) {
                  if (word.type === 'word') {
                    if (word.value === 'cover') {
                      result.warn(
                        'Gradient has outdated direction syntax. ' +
                          'Replace `cover` to `farthest-corner`.',
                        { node: decl }
                      )
                    } else if (word.value === 'contain') {
                      result.warn(
                        'Gradient has outdated direction syntax. ' +
                          'Replace `contain` to `closest-side`.',
                        { node: decl }
                      )
                    }
                  }
                }
              }
            }
          }
        }
        if (value.includes('linear-gradient')) {
          if (OLD_LINEAR.test(value)) {
            result.warn(
              'Gradient has outdated direction syntax. ' +
                'New syntax is like `to left` instead of `right`.',
              { node: decl }
            )
          }
        }
      }

      if (SIZES.includes(decl.prop)) {
        if (!decl.value.includes('-fill-available')) {
          if (decl.value.includes('fill-available')) {
            result.warn(
              'Replace fill-available to stretch, ' +
                'because spec had been changed',
              { node: decl }
            )
          } else if (decl.value.includes('fill')) {
            let ast = parser(value)
            if (ast.nodes.some(i => i.type === 'word' && i.value === 'fill')) {
              result.warn(
                'Replace fill to stretch, because spec had been changed',
                { node: decl }
              )
            }
          }
        }
      }

      let prefixer

      if (decl.prop === 'transition' || decl.prop === 'transition-property') {
        // Transition
        return this.prefixes.transition.add(decl, result)
      } else if (decl.prop === 'align-self') {
        // align-self flexbox or grid
        let display = this.displayType(decl)
        if (display !== 'grid' && this.prefixes.options.flexbox !== false) {
          prefixer = this.prefixes.add['align-self']
          if (prefixer && prefixer.prefixes) {
            prefixer.process(decl)
          }
        }
        if (this.gridStatus(decl, result) !== false) {
          prefixer = this.prefixes.add['grid-row-align']
          if (prefixer && prefixer.prefixes) {
            return prefixer.process(decl, result)
          }
        }
      } else if (decl.prop === 'justify-self') {
        // justify-self flexbox or grid
        if (this.gridStatus(decl, result) !== false) {
          prefixer = this.prefixes.add['grid-column-align']
          if (prefixer && prefixer.prefixes) {
            return prefixer.process(decl, result)
          }
        }
      } else if (decl.prop === 'place-self') {
        prefixer = this.prefixes.add['place-self']
        if (
          prefixer &&
          prefixer.prefixes &&
          this.gridStatus(decl, result) !== false
        ) {
          return prefixer.process(decl, result)
        }
      } else {
        // Properties
        prefixer = this.prefixes.add[decl.prop]
        if (prefixer && prefixer.prefixes) {
          return prefixer.process(decl, result)
        }
      }

      return undefined
    })

    // Insert grid-area prefixes. We need to be able to store the different
    // rules as a data and hack API is not enough for this
    if (this.gridStatus(css, result)) {
      insertAreas(css, this.disabled)
    }

    // Values
    return css.walkDecls(decl => {
      if (this.disabledValue(decl, result)) return

      let unprefixed = this.prefixes.unprefixed(decl.prop)
      let list = this.prefixes.values('add', unprefixed)
      if (Array.isArray(list)) {
        for (let value of list) {
          if (value.process) value.process(decl, result)
        }
      }
      Value.save(this.prefixes, decl)
    })
  }

  /**
   * Remove unnecessary pefixes
   */
  remove(css, result) {
    // At-rules
    let resolution = this.prefixes.remove['@resolution']

    css.walkAtRules((rule, i) => {
      if (this.prefixes.remove[`@${rule.name}`]) {
        if (!this.disabled(rule, result)) {
          rule.parent.removeChild(i)
        }
      } else if (
        rule.name === 'media' &&
        rule.params.includes('-resolution') &&
        resolution
      ) {
        resolution.clean(rule)
      }
    })

    // Selectors
    for (let checker of this.prefixes.remove.selectors) {
      css.walkRules((rule, i) => {
        if (checker.check(rule)) {
          if (!this.disabled(rule, result)) {
            rule.parent.removeChild(i)
          }
        }
      })
    }

    return css.walkDecls((decl, i) => {
      if (this.disabled(decl, result)) return

      let rule = decl.parent
      let unprefixed = this.prefixes.unprefixed(decl.prop)

      // Transition
      if (decl.prop === 'transition' || decl.prop === 'transition-property') {
        this.prefixes.transition.remove(decl)
      }

      // Properties
      if (
        this.prefixes.remove[decl.prop] &&
        this.prefixes.remove[decl.prop].remove
      ) {
        let notHack = this.prefixes.group(decl).down(other => {
          return this.prefixes.normalize(other.prop) === unprefixed
        })

        if (unprefixed === 'flex-flow') {
          notHack = true
        }

        if (decl.prop === '-webkit-box-orient') {
          let hacks = { 'flex-direction': true, 'flex-flow': true }
          if (!decl.parent.some(j => hacks[j.prop])) return
        }

        if (notHack && !this.withHackValue(decl)) {
          if (decl.raw('before').includes('\n')) {
            this.reduceSpaces(decl)
          }
          rule.removeChild(i)
          return
        }
      }

      // Values
      for (let checker of this.prefixes.values('remove', unprefixed)) {
        if (!checker.check) continue
        if (!checker.check(decl.value)) continue

        unprefixed = checker.unprefixed
        let notHack = this.prefixes.group(decl).down(other => {
          return other.value.includes(unprefixed)
        })

        if (notHack) {
          rule.removeChild(i)
          return
        }
      }
    })
  }

  /**
   * Some rare old values, which is not in standard
   */
  withHackValue(decl) {
    return decl.prop === '-webkit-background-clip' && decl.value === 'text'
  }

  /**
   * Check for grid/flexbox options.
   */
  disabledValue(node, result) {
    if (this.gridStatus(node, result) === false && node.type === 'decl') {
      if (node.prop === 'display' && node.value.includes('grid')) {
        return true
      }
    }
    if (this.prefixes.options.flexbox === false && node.type === 'decl') {
      if (node.prop === 'display' && node.value.includes('flex')) {
        return true
      }
    }
    if (node.type === 'decl' && node.prop === 'content') {
      return true
    }

    return this.disabled(node, result)
  }

  /**
   * Check for grid/flexbox options.
   */
  disabledDecl(node, result) {
    if (this.gridStatus(node, result) === false && node.type === 'decl') {
      if (node.prop.includes('grid') || node.prop === 'justify-items') {
        return true
      }
    }
    if (this.prefixes.options.flexbox === false && node.type === 'decl') {
      let other = ['order', 'justify-content', 'align-items', 'align-content']
      if (node.prop.includes('flex') || other.includes(node.prop)) {
        return true
      }
    }

    return this.disabled(node, result)
  }

  /**
   * Check for control comment and global options
   */
  disabled(node, result) {
    if (!node) return false

    if (node._autoprefixerDisabled !== undefined) {
      return node._autoprefixerDisabled
    }

    if (node.parent) {
      let p = node.prev()
      if (p && p.type === 'comment' && IGNORE_NEXT.test(p.text)) {
        node._autoprefixerDisabled = true
        node._autoprefixerSelfDisabled = true
        return true
      }
    }

    let value = null
    if (node.nodes) {
      let status
      node.each(i => {
        if (i.type !== 'comment') return
        if (/(!\s*)?autoprefixer:\s*(off|on)/i.test(i.text)) {
          if (typeof status !== 'undefined') {
            result.warn(
              'Second Autoprefixer control comment ' +
                'was ignored. Autoprefixer applies control ' +
                'comment to whole block, not to next rules.',
              { node: i }
            )
          } else {
            status = /on/i.test(i.text)
          }
        }
      })

      if (status !== undefined) {
        value = !status
      }
    }
    if (!node.nodes || value === null) {
      if (node.parent) {
        let isParentDisabled = this.disabled(node.parent, result)
        if (node.parent._autoprefixerSelfDisabled === true) {
          value = false
        } else {
          value = isParentDisabled
        }
      } else {
        value = false
      }
    }
    node._autoprefixerDisabled = value
    return value
  }

  /**
   * Normalize spaces in cascade declaration group
   */
  reduceSpaces(decl) {
    let stop = false
    this.prefixes.group(decl).up(() => {
      stop = true
      return true
    })
    if (stop) {
      return
    }

    let parts = decl.raw('before').split('\n')
    let prevMin = parts[parts.length - 1].length
    let diff = false

    this.prefixes.group(decl).down(other => {
      parts = other.raw('before').split('\n')
      let last = parts.length - 1

      if (parts[last].length > prevMin) {
        if (diff === false) {
          diff = parts[last].length - prevMin
        }

        parts[last] = parts[last].slice(0, -diff)
        other.raws.before = parts.join('\n')
      }
    })
  }

  /**
   * Is it flebox or grid rule
   */
  displayType(decl) {
    for (let i of decl.parent.nodes) {
      if (i.prop !== 'display') {
        continue
      }

      if (i.value.includes('flex')) {
        return 'flex'
      }

      if (i.value.includes('grid')) {
        return 'grid'
      }
    }

    return false
  }

  /**
   * Set grid option via control comment
   */
  gridStatus(node, result) {
    if (!node) return false

    if (node._autoprefixerGridStatus !== undefined) {
      return node._autoprefixerGridStatus
    }

    let value = null
    if (node.nodes) {
      let status
      node.each(i => {
        if (i.type !== 'comment') return
        if (GRID_REGEX.test(i.text)) {
          let hasAutoplace = /:\s*autoplace/i.test(i.text)
          let noAutoplace = /no-autoplace/i.test(i.text)
          if (typeof status !== 'undefined') {
            result.warn(
              'Second Autoprefixer grid control comment was ' +
                'ignored. Autoprefixer applies control comments to the whole ' +
                'block, not to the next rules.',
              { node: i }
            )
          } else if (hasAutoplace) {
            status = 'autoplace'
          } else if (noAutoplace) {
            status = true
          } else {
            status = /on/i.test(i.text)
          }
        }
      })

      if (status !== undefined) {
        value = status
      }
    }

    if (node.type === 'atrule' && node.name === 'supports') {
      let params = node.params
      if (params.includes('grid') && params.includes('auto')) {
        value = false
      }
    }

    if (!node.nodes || value === null) {
      if (node.parent) {
        let isParentGrid = this.gridStatus(node.parent, result)
        if (node.parent._autoprefixerSelfDisabled === true) {
          value = false
        } else {
          value = isParentGrid
        }
      } else if (typeof this.prefixes.options.grid !== 'undefined') {
        value = this.prefixes.options.grid
      } else if (typeof process.env.AUTOPREFIXER_GRID !== 'undefined') {
        if (process.env.AUTOPREFIXER_GRID === 'autoplace') {
          value = 'autoplace'
        } else {
          value = true
        }
      } else {
        value = false
      }
    }

    node._autoprefixerGridStatus = value
    return value
  }
}

module.exports = Processor

}, function(modId) { var map = {"./value":1679975014144,"./hacks/grid-utils":1679975014146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014144, function(require, module, exports) {
let Prefixer = require('./prefixer')
let OldValue = require('./old-value')
let vendor = require('./vendor')
let utils = require('./utils')

class Value extends Prefixer {
  /**
   * Clone decl for each prefixed values
   */
  static save(prefixes, decl) {
    let prop = decl.prop
    let result = []

    for (let prefix in decl._autoprefixerValues) {
      let value = decl._autoprefixerValues[prefix]

      if (value === decl.value) {
        continue
      }

      let item
      let propPrefix = vendor.prefix(prop)

      if (propPrefix === '-pie-') {
        continue
      }

      if (propPrefix === prefix) {
        item = decl.value = value
        result.push(item)
        continue
      }

      let prefixed = prefixes.prefixed(prop, prefix)
      let rule = decl.parent

      if (!rule.every(i => i.prop !== prefixed)) {
        result.push(item)
        continue
      }

      let trimmed = value.replace(/\s+/, ' ')
      let already = rule.some(
        i => i.prop === decl.prop && i.value.replace(/\s+/, ' ') === trimmed
      )

      if (already) {
        result.push(item)
        continue
      }

      let cloned = this.clone(decl, { value })
      item = decl.parent.insertBefore(decl, cloned)

      result.push(item)
    }

    return result
  }

  /**
   * Is declaration need to be prefixed
   */
  check(decl) {
    let value = decl.value
    if (!value.includes(this.name)) {
      return false
    }

    return !!value.match(this.regexp())
  }

  /**
   * Lazy regexp loading
   */
  regexp() {
    return this.regexpCache || (this.regexpCache = utils.regexp(this.name))
  }

  /**
   * Add prefix to values in string
   */
  replace(string, prefix) {
    return string.replace(this.regexp(), `$1${prefix}$2`)
  }

  /**
   * Get value with comments if it was not changed
   */
  value(decl) {
    if (decl.raws.value && decl.raws.value.value === decl.value) {
      return decl.raws.value.raw
    } else {
      return decl.value
    }
  }

  /**
   * Save values with next prefixed token
   */
  add(decl, prefix) {
    if (!decl._autoprefixerValues) {
      decl._autoprefixerValues = {}
    }
    let value = decl._autoprefixerValues[prefix] || this.value(decl)

    let before
    do {
      before = value
      value = this.replace(value, prefix)
      if (value === false) return
    } while (value !== before)

    decl._autoprefixerValues[prefix] = value
  }

  /**
   * Return function to fast find prefixed value
   */
  old(prefix) {
    return new OldValue(this.name, prefix + this.name)
  }
}

module.exports = Value

}, function(modId) { var map = {"./prefixer":1679975014140,"./old-value":1679975014145,"./vendor":1679975014138,"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014145, function(require, module, exports) {
let utils = require('./utils')

class OldValue {
  constructor(unprefixed, prefixed, string, regexp) {
    this.unprefixed = unprefixed
    this.prefixed = prefixed
    this.string = string || prefixed
    this.regexp = regexp || utils.regexp(prefixed)
  }

  /**
   * Check, that value contain old value
   */
  check(value) {
    if (value.includes(this.string)) {
      return !!value.match(this.regexp)
    }
    return false
  }
}

module.exports = OldValue

}, function(modId) { var map = {"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014146, function(require, module, exports) {
let parser = require('postcss-value-parser')
let list = require('postcss').list

let uniq = require('../utils').uniq
let escapeRegexp = require('../utils').escapeRegexp
let splitSelector = require('../utils').splitSelector

function convert(value) {
  if (
    value &&
    value.length === 2 &&
    value[0] === 'span' &&
    parseInt(value[1], 10) > 0
  ) {
    return [false, parseInt(value[1], 10)]
  }

  if (value && value.length === 1 && parseInt(value[0], 10) > 0) {
    return [parseInt(value[0], 10), false]
  }

  return [false, false]
}

exports.translate = translate

function translate(values, startIndex, endIndex) {
  let startValue = values[startIndex]
  let endValue = values[endIndex]

  if (!startValue) {
    return [false, false]
  }

  let [start, spanStart] = convert(startValue)
  let [end, spanEnd] = convert(endValue)

  if (start && !endValue) {
    return [start, false]
  }

  if (spanStart && end) {
    return [end - spanStart, spanStart]
  }

  if (start && spanEnd) {
    return [start, spanEnd]
  }

  if (start && end) {
    return [start, end - start]
  }

  return [false, false]
}

exports.parse = parse

function parse(decl) {
  let node = parser(decl.value)

  let values = []
  let current = 0
  values[current] = []

  for (let i of node.nodes) {
    if (i.type === 'div') {
      current += 1
      values[current] = []
    } else if (i.type === 'word') {
      values[current].push(i.value)
    }
  }

  return values
}

exports.insertDecl = insertDecl

function insertDecl(decl, prop, value) {
  if (value && !decl.parent.some(i => i.prop === `-ms-${prop}`)) {
    decl.cloneBefore({
      prop: `-ms-${prop}`,
      value: value.toString()
    })
  }
}

// Track transforms

exports.prefixTrackProp = prefixTrackProp

function prefixTrackProp({ prop, prefix }) {
  return prefix + prop.replace('template-', '')
}

function transformRepeat({ nodes }, { gap }) {
  let { count, size } = nodes.reduce(
    (result, node) => {
      if (node.type === 'div' && node.value === ',') {
        result.key = 'size'
      } else {
        result[result.key].push(parser.stringify(node))
      }
      return result
    },
    {
      key: 'count',
      size: [],
      count: []
    }
  )

  // insert gap values
  if (gap) {
    size = size.filter(i => i.trim())
    let val = []
    for (let i = 1; i <= count; i++) {
      size.forEach((item, index) => {
        if (index > 0 || i > 1) {
          val.push(gap)
        }
        val.push(item)
      })
    }

    return val.join(' ')
  }

  return `(${size.join('')})[${count.join('')}]`
}

exports.prefixTrackValue = prefixTrackValue

function prefixTrackValue({ value, gap }) {
  let result = parser(value).nodes.reduce((nodes, node) => {
    if (node.type === 'function' && node.value === 'repeat') {
      return nodes.concat({
        type: 'word',
        value: transformRepeat(node, { gap })
      })
    }
    if (gap && node.type === 'space') {
      return nodes.concat(
        {
          type: 'space',
          value: ' '
        },
        {
          type: 'word',
          value: gap
        },
        node
      )
    }
    return nodes.concat(node)
  }, [])

  return parser.stringify(result)
}

// Parse grid-template-areas

let DOTS = /^\.+$/

function track(start, end) {
  return { start, end, span: end - start }
}

function getColumns(line) {
  return line.trim().split(/\s+/g)
}

exports.parseGridAreas = parseGridAreas

function parseGridAreas({ rows, gap }) {
  return rows.reduce((areas, line, rowIndex) => {
    if (gap.row) rowIndex *= 2

    if (line.trim() === '') return areas

    getColumns(line).forEach((area, columnIndex) => {
      if (DOTS.test(area)) return

      if (gap.column) columnIndex *= 2

      if (typeof areas[area] === 'undefined') {
        areas[area] = {
          column: track(columnIndex + 1, columnIndex + 2),
          row: track(rowIndex + 1, rowIndex + 2)
        }
      } else {
        let { column, row } = areas[area]

        column.start = Math.min(column.start, columnIndex + 1)
        column.end = Math.max(column.end, columnIndex + 2)
        column.span = column.end - column.start

        row.start = Math.min(row.start, rowIndex + 1)
        row.end = Math.max(row.end, rowIndex + 2)
        row.span = row.end - row.start
      }
    })

    return areas
  }, {})
}

// Parse grid-template

function testTrack(node) {
  return node.type === 'word' && /^\[.+]$/.test(node.value)
}

function verifyRowSize(result) {
  if (result.areas.length > result.rows.length) {
    result.rows.push('auto')
  }
  return result
}

exports.parseTemplate = parseTemplate

function parseTemplate({ decl, gap }) {
  let gridTemplate = parser(decl.value).nodes.reduce(
    (result, node) => {
      let { type, value } = node

      if (testTrack(node) || type === 'space') return result

      // area
      if (type === 'string') {
        result = verifyRowSize(result)
        result.areas.push(value)
      }

      // values and function
      if (type === 'word' || type === 'function') {
        result[result.key].push(parser.stringify(node))
      }

      // divider(/)
      if (type === 'div' && value === '/') {
        result.key = 'columns'
        result = verifyRowSize(result)
      }

      return result
    },
    {
      key: 'rows',
      columns: [],
      rows: [],
      areas: []
    }
  )

  return {
    areas: parseGridAreas({
      rows: gridTemplate.areas,
      gap
    }),
    columns: prefixTrackValue({
      value: gridTemplate.columns.join(' '),
      gap: gap.column
    }),
    rows: prefixTrackValue({
      value: gridTemplate.rows.join(' '),
      gap: gap.row
    })
  }
}

// Insert parsed grid areas

/**
 * Get an array of -ms- prefixed props and values
 * @param  {Object} [area] area object with column and row data
 * @param  {Boolean} [addRowSpan] should we add grid-column-row value?
 * @param  {Boolean} [addColumnSpan] should we add grid-column-span value?
 * @return {Array<Object>}
 */
function getMSDecls(area, addRowSpan = false, addColumnSpan = false) {
  let result = [
    {
      prop: '-ms-grid-row',
      value: String(area.row.start)
    }
  ]
  if (area.row.span > 1 || addRowSpan) {
    result.push({
      prop: '-ms-grid-row-span',
      value: String(area.row.span)
    })
  }
  result.push({
    prop: '-ms-grid-column',
    value: String(area.column.start)
  })
  if (area.column.span > 1 || addColumnSpan) {
    result.push({
      prop: '-ms-grid-column-span',
      value: String(area.column.span)
    })
  }
  return result
}

function getParentMedia(parent) {
  if (parent.type === 'atrule' && parent.name === 'media') {
    return parent
  }
  if (!parent.parent) {
    return false
  }
  return getParentMedia(parent.parent)
}

/**
 * change selectors for rules with duplicate grid-areas.
 * @param  {Array<Rule>} rules
 * @param  {Array<String>} templateSelectors
 * @return {Array<Rule>} rules with changed selectors
 */
function changeDuplicateAreaSelectors(ruleSelectors, templateSelectors) {
  ruleSelectors = ruleSelectors.map(selector => {
    let selectorBySpace = list.space(selector)
    let selectorByComma = list.comma(selector)

    if (selectorBySpace.length > selectorByComma.length) {
      selector = selectorBySpace.slice(-1).join('')
    }
    return selector
  })

  return ruleSelectors.map(ruleSelector => {
    let newSelector = templateSelectors.map((tplSelector, index) => {
      let space = index === 0 ? '' : ' '
      return `${space}${tplSelector} > ${ruleSelector}`
    })

    return newSelector
  })
}

/**
 * check if selector of rules are equal
 * @param  {Rule} ruleA
 * @param  {Rule} ruleB
 * @return {Boolean}
 */
function selectorsEqual(ruleA, ruleB) {
  return ruleA.selectors.some(sel => {
    return ruleB.selectors.includes(sel)
  })
}

/**
 * Parse data from all grid-template(-areas) declarations
 * @param  {Root} css css root
 * @return {Object} parsed data
 */
function parseGridTemplatesData(css) {
  let parsed = []

  // we walk through every grid-template(-areas) declaration and store
  // data with the same area names inside the item
  css.walkDecls(/grid-template(-areas)?$/, d => {
    let rule = d.parent
    let media = getParentMedia(rule)
    let gap = getGridGap(d)
    let inheritedGap = inheritGridGap(d, gap)
    let { areas } = parseTemplate({ decl: d, gap: inheritedGap || gap })
    let areaNames = Object.keys(areas)

    // skip node if it doesn't have areas
    if (areaNames.length === 0) {
      return true
    }

    // check parsed array for item that include the same area names
    // return index of that item
    let index = parsed.reduce((acc, { allAreas }, idx) => {
      let hasAreas = allAreas && areaNames.some(area => allAreas.includes(area))
      return hasAreas ? idx : acc
    }, null)

    if (index !== null) {
      // index is found, add the grid-template data to that item
      let { allAreas, rules } = parsed[index]

      // check if rule has no duplicate area names
      let hasNoDuplicates = rules.some(r => {
        return r.hasDuplicates === false && selectorsEqual(r, rule)
      })

      let duplicatesFound = false

      // check need to gather all duplicate area names
      let duplicateAreaNames = rules.reduce((acc, r) => {
        if (!r.params && selectorsEqual(r, rule)) {
          duplicatesFound = true
          return r.duplicateAreaNames
        }
        if (!duplicatesFound) {
          areaNames.forEach(name => {
            if (r.areas[name]) {
              acc.push(name)
            }
          })
        }
        return uniq(acc)
      }, [])

      // update grid-row/column-span values for areas with duplicate
      // area names. @see #1084 and #1146
      rules.forEach(r => {
        areaNames.forEach(name => {
          let area = r.areas[name]
          if (area && area.row.span !== areas[name].row.span) {
            areas[name].row.updateSpan = true
          }

          if (area && area.column.span !== areas[name].column.span) {
            areas[name].column.updateSpan = true
          }
        })
      })

      parsed[index].allAreas = uniq([...allAreas, ...areaNames])
      parsed[index].rules.push({
        hasDuplicates: !hasNoDuplicates,
        params: media.params,
        selectors: rule.selectors,
        node: rule,
        duplicateAreaNames,
        areas
      })
    } else {
      // index is NOT found, push the new item to the parsed array
      parsed.push({
        allAreas: areaNames,
        areasCount: 0,
        rules: [
          {
            hasDuplicates: false,
            duplicateRules: [],
            params: media.params,
            selectors: rule.selectors,
            node: rule,
            duplicateAreaNames: [],
            areas
          }
        ]
      })
    }

    return undefined
  })

  return parsed
}

/**
 * insert prefixed grid-area declarations
 * @param  {Root}  css css root
 * @param  {Function} isDisabled check if the rule is disabled
 * @return {void}
 */
exports.insertAreas = insertAreas

function insertAreas(css, isDisabled) {
  // parse grid-template declarations
  let gridTemplatesData = parseGridTemplatesData(css)

  // return undefined if no declarations found
  if (gridTemplatesData.length === 0) {
    return undefined
  }

  // we need to store the rules that we will insert later
  let rulesToInsert = {}

  css.walkDecls('grid-area', gridArea => {
    let gridAreaRule = gridArea.parent
    let hasPrefixedRow = gridAreaRule.first.prop === '-ms-grid-row'
    let gridAreaMedia = getParentMedia(gridAreaRule)

    if (isDisabled(gridArea)) {
      return undefined
    }

    let gridAreaRuleIndex = css.index(gridAreaMedia || gridAreaRule)

    let value = gridArea.value
    // found the data that matches grid-area identifier
    let data = gridTemplatesData.filter(d => d.allAreas.includes(value))[0]

    if (!data) {
      return true
    }

    let lastArea = data.allAreas[data.allAreas.length - 1]
    let selectorBySpace = list.space(gridAreaRule.selector)
    let selectorByComma = list.comma(gridAreaRule.selector)
    let selectorIsComplex =
      selectorBySpace.length > 1 &&
      selectorBySpace.length > selectorByComma.length

    // prevent doubling of prefixes
    if (hasPrefixedRow) {
      return false
    }

    // create the empty object with the key as the last area name
    // e.g if we have templates with "a b c" values, "c" will be the last area
    if (!rulesToInsert[lastArea]) {
      rulesToInsert[lastArea] = {}
    }

    let lastRuleIsSet = false

    // walk through every grid-template rule data
    for (let rule of data.rules) {
      let area = rule.areas[value]
      let hasDuplicateName = rule.duplicateAreaNames.includes(value)

      // if we can't find the area name, update lastRule and continue
      if (!area) {
        let lastRule = rulesToInsert[lastArea].lastRule
        let lastRuleIndex
        if (lastRule) {
          lastRuleIndex = css.index(lastRule)
        } else {
          /* c8 ignore next 2 */
          lastRuleIndex = -1
        }

        if (gridAreaRuleIndex > lastRuleIndex) {
          rulesToInsert[lastArea].lastRule = gridAreaMedia || gridAreaRule
        }
        continue
      }

      // for grid-templates inside media rule we need to create empty
      // array to push prefixed grid-area rules later
      if (rule.params && !rulesToInsert[lastArea][rule.params]) {
        rulesToInsert[lastArea][rule.params] = []
      }

      if ((!rule.hasDuplicates || !hasDuplicateName) && !rule.params) {
        // grid-template has no duplicates and not inside media rule

        getMSDecls(area, false, false)
          .reverse()
          .forEach(i =>
            gridAreaRule.prepend(
              Object.assign(i, {
                raws: {
                  between: gridArea.raws.between
                }
              })
            )
          )

        rulesToInsert[lastArea].lastRule = gridAreaRule
        lastRuleIsSet = true
      } else if (rule.hasDuplicates && !rule.params && !selectorIsComplex) {
        // grid-template has duplicates and not inside media rule
        let cloned = gridAreaRule.clone()
        cloned.removeAll()

        getMSDecls(area, area.row.updateSpan, area.column.updateSpan)
          .reverse()
          .forEach(i =>
            cloned.prepend(
              Object.assign(i, {
                raws: {
                  between: gridArea.raws.between
                }
              })
            )
          )

        cloned.selectors = changeDuplicateAreaSelectors(
          cloned.selectors,
          rule.selectors
        )

        if (rulesToInsert[lastArea].lastRule) {
          rulesToInsert[lastArea].lastRule.after(cloned)
        }
        rulesToInsert[lastArea].lastRule = cloned
        lastRuleIsSet = true
      } else if (
        rule.hasDuplicates &&
        !rule.params &&
        selectorIsComplex &&
        gridAreaRule.selector.includes(rule.selectors[0])
      ) {
        // grid-template has duplicates and not inside media rule
        // and the selector is complex
        gridAreaRule.walkDecls(/-ms-grid-(row|column)/, d => d.remove())
        getMSDecls(area, area.row.updateSpan, area.column.updateSpan)
          .reverse()
          .forEach(i =>
            gridAreaRule.prepend(
              Object.assign(i, {
                raws: {
                  between: gridArea.raws.between
                }
              })
            )
          )
      } else if (rule.params) {
        // grid-template is inside media rule
        // if we're inside media rule, we need to store prefixed rules
        // inside rulesToInsert object to be able to preserve the order of media
        // rules and merge them easily
        let cloned = gridAreaRule.clone()
        cloned.removeAll()

        getMSDecls(area, area.row.updateSpan, area.column.updateSpan)
          .reverse()
          .forEach(i =>
            cloned.prepend(
              Object.assign(i, {
                raws: {
                  between: gridArea.raws.between
                }
              })
            )
          )

        if (rule.hasDuplicates && hasDuplicateName) {
          cloned.selectors = changeDuplicateAreaSelectors(
            cloned.selectors,
            rule.selectors
          )
        }

        cloned.raws = rule.node.raws

        if (css.index(rule.node.parent) > gridAreaRuleIndex) {
          // append the prefixed rules right inside media rule
          // with grid-template
          rule.node.parent.append(cloned)
        } else {
          // store the rule to insert later
          rulesToInsert[lastArea][rule.params].push(cloned)
        }

        // set new rule as last rule ONLY if we didn't set lastRule for
        // this grid-area before
        if (!lastRuleIsSet) {
          rulesToInsert[lastArea].lastRule = gridAreaMedia || gridAreaRule
        }
      }
    }

    return undefined
  })

  // append stored rules inside the media rules
  Object.keys(rulesToInsert).forEach(area => {
    let data = rulesToInsert[area]
    let lastRule = data.lastRule
    Object.keys(data)
      .reverse()
      .filter(p => p !== 'lastRule')
      .forEach(params => {
        if (data[params].length > 0 && lastRule) {
          lastRule.after({ name: 'media', params })
          lastRule.next().append(data[params])
        }
      })
  })

  return undefined
}

/**
 * Warn user if grid area identifiers are not found
 * @param  {Object} areas
 * @param  {Declaration} decl
 * @param  {Result} result
 * @return {void}
 */
exports.warnMissedAreas = warnMissedAreas

function warnMissedAreas(areas, decl, result) {
  let missed = Object.keys(areas)

  decl.root().walkDecls('grid-area', gridArea => {
    missed = missed.filter(e => e !== gridArea.value)
  })

  if (missed.length > 0) {
    decl.warn(result, 'Can not find grid areas: ' + missed.join(', '))
  }

  return undefined
}

/**
 * compare selectors with grid-area rule and grid-template rule
 * show warning if grid-template selector is not found
 * (this function used for grid-area rule)
 * @param  {Declaration} decl
 * @param  {Result} result
 * @return {void}
 */
exports.warnTemplateSelectorNotFound = warnTemplateSelectorNotFound

function warnTemplateSelectorNotFound(decl, result) {
  let rule = decl.parent
  let root = decl.root()
  let duplicatesFound = false

  // slice selector array. Remove the last part (for comparison)
  let slicedSelectorArr = list
    .space(rule.selector)
    .filter(str => str !== '>')
    .slice(0, -1)

  // we need to compare only if selector is complex.
  // e.g '.grid-cell' is simple, but '.parent > .grid-cell' is complex
  if (slicedSelectorArr.length > 0) {
    let gridTemplateFound = false
    let foundAreaSelector = null

    root.walkDecls(/grid-template(-areas)?$/, d => {
      let parent = d.parent
      let templateSelectors = parent.selectors

      let { areas } = parseTemplate({ decl: d, gap: getGridGap(d) })
      let hasArea = areas[decl.value]

      // find the the matching selectors
      for (let tplSelector of templateSelectors) {
        if (gridTemplateFound) {
          break
        }
        let tplSelectorArr = list.space(tplSelector).filter(str => str !== '>')

        gridTemplateFound = tplSelectorArr.every(
          (item, idx) => item === slicedSelectorArr[idx]
        )
      }

      if (gridTemplateFound || !hasArea) {
        return true
      }

      if (!foundAreaSelector) {
        foundAreaSelector = parent.selector
      }

      // if we found the duplicate area with different selector
      if (foundAreaSelector && foundAreaSelector !== parent.selector) {
        duplicatesFound = true
      }

      return undefined
    })

    // warn user if we didn't find template
    if (!gridTemplateFound && duplicatesFound) {
      decl.warn(
        result,
        'Autoprefixer cannot find a grid-template ' +
          `containing the duplicate grid-area "${decl.value}" ` +
          `with full selector matching: ${slicedSelectorArr.join(' ')}`
      )
    }
  }
}

/**
 * warn user if both grid-area and grid-(row|column)
 * declarations are present in the same rule
 * @param  {Declaration} decl
 * @param  {Result} result
 * @return {void}
 */
exports.warnIfGridRowColumnExists = warnIfGridRowColumnExists

function warnIfGridRowColumnExists(decl, result) {
  let rule = decl.parent
  let decls = []
  rule.walkDecls(/^grid-(row|column)/, d => {
    if (
      !d.prop.endsWith('-end') &&
      !d.value.startsWith('span') &&
      !d.prop.endsWith('-gap')
    ) {
      decls.push(d)
    }
  })
  if (decls.length > 0) {
    decls.forEach(d => {
      d.warn(
        result,
        'You already have a grid-area declaration present in the rule. ' +
          `You should use either grid-area or ${d.prop}, not both`
      )
    })
  }

  return undefined
}

// Gap utils

exports.getGridGap = getGridGap

function getGridGap(decl) {
  let gap = {}

  // try to find gap
  let testGap = /^(grid-)?((row|column)-)?gap$/
  decl.parent.walkDecls(testGap, ({ prop, value }) => {
    if (/^(grid-)?gap$/.test(prop)) {
      let [row, , column] = parser(value).nodes

      gap.row = row && parser.stringify(row)
      gap.column = column ? parser.stringify(column) : gap.row
    }
    if (/^(grid-)?row-gap$/.test(prop)) gap.row = value
    if (/^(grid-)?column-gap$/.test(prop)) gap.column = value
  })

  return gap
}

/**
 * parse media parameters (for example 'min-width: 500px')
 * @param  {String} params parameter to parse
 * @return {}
 */
function parseMediaParams(params) {
  if (!params) {
    return []
  }
  let parsed = parser(params)
  let prop
  let value

  parsed.walk(node => {
    if (node.type === 'word' && /min|max/g.test(node.value)) {
      prop = node.value
    } else if (node.value.includes('px')) {
      value = parseInt(node.value.replace(/\D/g, ''))
    }
  })

  return [prop, value]
}

/**
 * Compare the selectors and decide if we
 * need to inherit gap from compared selector or not.
 * @type {String} selA
 * @type {String} selB
 * @return {Boolean}
 */
function shouldInheritGap(selA, selB) {
  let result

  // get arrays of selector split in 3-deep array
  let splitSelectorArrA = splitSelector(selA)
  let splitSelectorArrB = splitSelector(selB)

  if (splitSelectorArrA[0].length < splitSelectorArrB[0].length) {
    // abort if selectorA has lower descendant specificity then selectorB
    // (e.g '.grid' and '.hello .world .grid')
    return false
  } else if (splitSelectorArrA[0].length > splitSelectorArrB[0].length) {
    // if selectorA has higher descendant specificity then selectorB
    // (e.g '.foo .bar .grid' and '.grid')

    let idx = splitSelectorArrA[0].reduce((res, [item], index) => {
      let firstSelectorPart = splitSelectorArrB[0][0][0]
      if (item === firstSelectorPart) {
        return index
      }
      return false
    }, false)

    if (idx) {
      result = splitSelectorArrB[0].every((arr, index) => {
        return arr.every(
          (part, innerIndex) =>
            // because selectorA has more space elements, we need to slice
            // selectorA array by 'idx' number to compare them
            splitSelectorArrA[0].slice(idx)[index][innerIndex] === part
        )
      })
    }
  } else {
    // if selectorA has the same descendant specificity as selectorB
    // this condition covers cases such as: '.grid.foo.bar' and '.grid'
    result = splitSelectorArrB.some(byCommaArr => {
      return byCommaArr.every((bySpaceArr, index) => {
        return bySpaceArr.every(
          (part, innerIndex) => splitSelectorArrA[0][index][innerIndex] === part
        )
      })
    })
  }

  return result
}
/**
 * inherit grid gap values from the closest rule above
 * with the same selector
 * @param  {Declaration} decl
 * @param  {Object} gap gap values
 * @return {Object | Boolean} return gap values or false (if not found)
 */
exports.inheritGridGap = inheritGridGap

function inheritGridGap(decl, gap) {
  let rule = decl.parent
  let mediaRule = getParentMedia(rule)
  let root = rule.root()

  // get an array of selector split in 3-deep array
  let splitSelectorArr = splitSelector(rule.selector)

  // abort if the rule already has gaps
  if (Object.keys(gap).length > 0) {
    return false
  }

  // e.g ['min-width']
  let [prop] = parseMediaParams(mediaRule.params)

  let lastBySpace = splitSelectorArr[0]

  // get escaped value from the selector
  // if we have '.grid-2.foo.bar' selector, will be '\.grid\-2'
  let escaped = escapeRegexp(lastBySpace[lastBySpace.length - 1][0])

  let regexp = new RegExp(`(${escaped}$)|(${escaped}[,.])`)

  // find the closest rule with the same selector
  let closestRuleGap
  root.walkRules(regexp, r => {
    let gridGap

    // abort if are checking the same rule
    if (rule.toString() === r.toString()) {
      return false
    }

    // find grid-gap values
    r.walkDecls('grid-gap', d => (gridGap = getGridGap(d)))

    // skip rule without gaps
    if (!gridGap || Object.keys(gridGap).length === 0) {
      return true
    }

    // skip rules that should not be inherited from
    if (!shouldInheritGap(rule.selector, r.selector)) {
      return true
    }

    let media = getParentMedia(r)
    if (media) {
      // if we are inside media, we need to check that media props match
      // e.g ('min-width' === 'min-width')
      let propToCompare = parseMediaParams(media.params)[0]
      if (propToCompare === prop) {
        closestRuleGap = gridGap
        return true
      }
    } else {
      closestRuleGap = gridGap
      return true
    }

    return undefined
  })

  // if we find the closest gap object
  if (closestRuleGap && Object.keys(closestRuleGap).length > 0) {
    return closestRuleGap
  }
  return false
}

exports.warnGridGap = warnGridGap

function warnGridGap({ gap, hasColumns, decl, result }) {
  let hasBothGaps = gap.row && gap.column
  if (!hasColumns && (hasBothGaps || (gap.column && !gap.row))) {
    delete gap.column
    decl.warn(
      result,
      'Can not implement grid-gap without grid-template-columns'
    )
  }
}

/**
 * normalize the grid-template-rows/columns values
 * @param  {String} str grid-template-rows/columns value
 * @return {Array} normalized array with values
 * @example
 * let normalized = normalizeRowColumn('1fr repeat(2, 20px 50px) 1fr')
 * normalized // <= ['1fr', '20px', '50px', '20px', '50px', '1fr']
 */
function normalizeRowColumn(str) {
  let normalized = parser(str).nodes.reduce((result, node) => {
    if (node.type === 'function' && node.value === 'repeat') {
      let key = 'count'

      let [count, value] = node.nodes.reduce(
        (acc, n) => {
          if (n.type === 'word' && key === 'count') {
            acc[0] = Math.abs(parseInt(n.value))
            return acc
          }
          if (n.type === 'div' && n.value === ',') {
            key = 'value'
            return acc
          }
          if (key === 'value') {
            acc[1] += parser.stringify(n)
          }
          return acc
        },
        [0, '']
      )

      if (count) {
        for (let i = 0; i < count; i++) {
          result.push(value)
        }
      }

      return result
    }
    if (node.type === 'space') {
      return result
    }
    return result.concat(parser.stringify(node))
  }, [])

  return normalized
}

exports.autoplaceGridItems = autoplaceGridItems

/**
 * Autoplace grid items
 * @param {Declaration} decl
 * @param {Result} result
 * @param {Object} gap gap values
 * @param {String} autoflowValue grid-auto-flow value
 * @return {void}
 * @see https://github.com/postcss/autoprefixer/issues/1148
 */
function autoplaceGridItems(decl, result, gap, autoflowValue = 'row') {
  let { parent } = decl

  let rowDecl = parent.nodes.find(i => i.prop === 'grid-template-rows')
  let rows = normalizeRowColumn(rowDecl.value)
  let columns = normalizeRowColumn(decl.value)

  // Build array of area names with dummy values. If we have 3 columns and
  // 2 rows, filledRows will be equal to ['1 2 3', '4 5 6']
  let filledRows = rows.map((_, rowIndex) => {
    return Array.from(
      { length: columns.length },
      (v, k) => k + rowIndex * columns.length + 1
    ).join(' ')
  })

  let areas = parseGridAreas({ rows: filledRows, gap })
  let keys = Object.keys(areas)
  let items = keys.map(i => areas[i])

  // Change the order of cells if grid-auto-flow value is 'column'
  if (autoflowValue.includes('column')) {
    items = items.sort((a, b) => a.column.start - b.column.start)
  }

  // Insert new rules
  items.reverse().forEach((item, index) => {
    let { column, row } = item
    let nodeSelector = parent.selectors
      .map(sel => sel + ` > *:nth-child(${keys.length - index})`)
      .join(', ')

    // create new rule
    let node = parent.clone().removeAll()

    // change rule selector
    node.selector = nodeSelector

    // insert prefixed row/column values
    node.append({ prop: '-ms-grid-row', value: row.start })
    node.append({ prop: '-ms-grid-column', value: column.start })

    // insert rule
    parent.after(node)
  })

  return undefined
}

}, function(modId) { var map = {"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014147, function(require, module, exports) {
let featureQueries = require('caniuse-lite/data/features/css-featurequeries.js')
let feature = require('caniuse-lite/dist/unpacker/feature')
let { parse } = require('postcss')

let Browsers = require('./browsers')
let brackets = require('./brackets')
let Value = require('./value')
let utils = require('./utils')

let data = feature(featureQueries)

let supported = []
for (let browser in data.stats) {
  let versions = data.stats[browser]
  for (let version in versions) {
    let support = versions[version]
    if (/y/.test(support)) {
      supported.push(browser + ' ' + version)
    }
  }
}

class Supports {
  constructor(Prefixes, all) {
    this.Prefixes = Prefixes
    this.all = all
  }

  /**
   * Return prefixer only with @supports supported browsers
   */
  prefixer() {
    if (this.prefixerCache) {
      return this.prefixerCache
    }

    let filtered = this.all.browsers.selected.filter(i => {
      return supported.includes(i)
    })

    let browsers = new Browsers(
      this.all.browsers.data,
      filtered,
      this.all.options
    )
    this.prefixerCache = new this.Prefixes(
      this.all.data,
      browsers,
      this.all.options
    )
    return this.prefixerCache
  }

  /**
   * Parse string into declaration property and value
   */
  parse(str) {
    let parts = str.split(':')
    let prop = parts[0]
    let value = parts[1]
    if (!value) value = ''
    return [prop.trim(), value.trim()]
  }

  /**
   * Create virtual rule to process it by prefixer
   */
  virtual(str) {
    let [prop, value] = this.parse(str)
    let rule = parse('a{}').first
    rule.append({ prop, value, raws: { before: '' } })
    return rule
  }

  /**
   * Return array of Declaration with all necessary prefixes
   */
  prefixed(str) {
    let rule = this.virtual(str)
    if (this.disabled(rule.first)) {
      return rule.nodes
    }

    let result = { warn: () => null }

    let prefixer = this.prefixer().add[rule.first.prop]
    prefixer && prefixer.process && prefixer.process(rule.first, result)

    for (let decl of rule.nodes) {
      for (let value of this.prefixer().values('add', rule.first.prop)) {
        value.process(decl)
      }
      Value.save(this.all, decl)
    }

    return rule.nodes
  }

  /**
   * Return true if brackets node is "not" word
   */
  isNot(node) {
    return typeof node === 'string' && /not\s*/i.test(node)
  }

  /**
   * Return true if brackets node is "or" word
   */
  isOr(node) {
    return typeof node === 'string' && /\s*or\s*/i.test(node)
  }

  /**
   * Return true if brackets node is (prop: value)
   */
  isProp(node) {
    return (
      typeof node === 'object' &&
      node.length === 1 &&
      typeof node[0] === 'string'
    )
  }

  /**
   * Return true if prefixed property has no unprefixed
   */
  isHack(all, unprefixed) {
    let check = new RegExp(`(\\(|\\s)${utils.escapeRegexp(unprefixed)}:`)
    return !check.test(all)
  }

  /**
   * Return true if we need to remove node
   */
  toRemove(str, all) {
    let [prop, value] = this.parse(str)
    let unprefixed = this.all.unprefixed(prop)

    let cleaner = this.all.cleaner()

    if (
      cleaner.remove[prop] &&
      cleaner.remove[prop].remove &&
      !this.isHack(all, unprefixed)
    ) {
      return true
    }

    for (let checker of cleaner.values('remove', unprefixed)) {
      if (checker.check(value)) {
        return true
      }
    }

    return false
  }

  /**
   * Remove all unnecessary prefixes
   */
  remove(nodes, all) {
    let i = 0
    while (i < nodes.length) {
      if (
        !this.isNot(nodes[i - 1]) &&
        this.isProp(nodes[i]) &&
        this.isOr(nodes[i + 1])
      ) {
        if (this.toRemove(nodes[i][0], all)) {
          nodes.splice(i, 2)
          continue
        }

        i += 2
        continue
      }

      if (typeof nodes[i] === 'object') {
        nodes[i] = this.remove(nodes[i], all)
      }

      i += 1
    }
    return nodes
  }

  /**
   * Clean brackets with one child
   */
  cleanBrackets(nodes) {
    return nodes.map(i => {
      if (typeof i !== 'object') {
        return i
      }

      if (i.length === 1 && typeof i[0] === 'object') {
        return this.cleanBrackets(i[0])
      }

      return this.cleanBrackets(i)
    })
  }

  /**
   * Add " or " between properties and convert it to brackets format
   */
  convert(progress) {
    let result = ['']
    for (let i of progress) {
      result.push([`${i.prop}: ${i.value}`])
      result.push(' or ')
    }
    result[result.length - 1] = ''
    return result
  }

  /**
   * Compress value functions into a string nodes
   */
  normalize(nodes) {
    if (typeof nodes !== 'object') {
      return nodes
    }

    nodes = nodes.filter(i => i !== '')

    if (typeof nodes[0] === 'string') {
      let firstNode = nodes[0].trim()

      if (
        firstNode.includes(':') ||
        firstNode === 'selector' ||
        firstNode === 'not selector'
      ) {
        return [brackets.stringify(nodes)]
      }
    }
    return nodes.map(i => this.normalize(i))
  }

  /**
   * Add prefixes
   */
  add(nodes, all) {
    return nodes.map(i => {
      if (this.isProp(i)) {
        let prefixed = this.prefixed(i[0])
        if (prefixed.length > 1) {
          return this.convert(prefixed)
        }

        return i
      }

      if (typeof i === 'object') {
        return this.add(i, all)
      }

      return i
    })
  }

  /**
   * Add prefixed declaration
   */
  process(rule) {
    let ast = brackets.parse(rule.params)
    ast = this.normalize(ast)
    ast = this.remove(ast, rule.params)
    ast = this.add(ast, rule.params)
    ast = this.cleanBrackets(ast)
    rule.params = brackets.stringify(ast)
  }

  /**
   * Check global options
   */
  disabled(node) {
    if (!this.all.options.grid) {
      if (node.prop === 'display' && node.value.includes('grid')) {
        return true
      }
      if (node.prop.includes('grid') || node.prop === 'justify-items') {
        return true
      }
    }

    if (this.all.options.flexbox === false) {
      if (node.prop === 'display' && node.value.includes('flex')) {
        return true
      }
      let other = ['order', 'justify-content', 'align-items', 'align-content']
      if (node.prop.includes('flex') || other.includes(node.prop)) {
        return true
      }
    }

    return false
  }
}

module.exports = Supports

}, function(modId) { var map = {"./browsers":1679975014135,"./brackets":1679975014148,"./value":1679975014144,"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014148, function(require, module, exports) {
function last(array) {
  return array[array.length - 1]
}

let brackets = {
  /**
   * Parse string to nodes tree
   */
  parse(str) {
    let current = ['']
    let stack = [current]

    for (let sym of str) {
      if (sym === '(') {
        current = ['']
        last(stack).push(current)
        stack.push(current)
        continue
      }

      if (sym === ')') {
        stack.pop()
        current = last(stack)
        current.push('')
        continue
      }

      current[current.length - 1] += sym
    }

    return stack[0]
  },

  /**
   * Generate output string by nodes tree
   */
  stringify(ast) {
    let result = ''
    for (let i of ast) {
      if (typeof i === 'object') {
        result += `(${brackets.stringify(i)})`
        continue
      }

      result += i
    }
    return result
  }
}

module.exports = brackets

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014149, function(require, module, exports) {
let { list } = require('postcss')

let OldSelector = require('./old-selector')
let Prefixer = require('./prefixer')
let Browsers = require('./browsers')
let utils = require('./utils')

class Selector extends Prefixer {
  constructor(name, prefixes, all) {
    super(name, prefixes, all)
    this.regexpCache = new Map()
  }

  /**
   * Is rule selectors need to be prefixed
   */
  check(rule) {
    if (rule.selector.includes(this.name)) {
      return !!rule.selector.match(this.regexp())
    }

    return false
  }

  /**
   * Return prefixed version of selector
   */
  prefixed(prefix) {
    return this.name.replace(/^(\W*)/, `$1${prefix}`)
  }

  /**
   * Lazy loadRegExp for name
   */
  regexp(prefix) {
    if (!this.regexpCache.has(prefix)) {
      let name = prefix ? this.prefixed(prefix) : this.name
      this.regexpCache.set(
        prefix,
        new RegExp(`(^|[^:"'=])${utils.escapeRegexp(name)}`, 'gi')
      )
    }

    return this.regexpCache.get(prefix)
  }

  /**
   * All possible prefixes
   */
  possible() {
    return Browsers.prefixes()
  }

  /**
   * Return all possible selector prefixes
   */
  prefixeds(rule) {
    if (rule._autoprefixerPrefixeds) {
      if (rule._autoprefixerPrefixeds[this.name]) {
        return rule._autoprefixerPrefixeds
      }
    } else {
      rule._autoprefixerPrefixeds = {}
    }

    let prefixeds = {}
    if (rule.selector.includes(',')) {
      let ruleParts = list.comma(rule.selector)
      let toProcess = ruleParts.filter(el => el.includes(this.name))

      for (let prefix of this.possible()) {
        prefixeds[prefix] = toProcess
          .map(el => this.replace(el, prefix))
          .join(', ')
      }
    } else {
      for (let prefix of this.possible()) {
        prefixeds[prefix] = this.replace(rule.selector, prefix)
      }
    }

    rule._autoprefixerPrefixeds[this.name] = prefixeds
    return rule._autoprefixerPrefixeds
  }

  /**
   * Is rule already prefixed before
   */
  already(rule, prefixeds, prefix) {
    let index = rule.parent.index(rule) - 1

    while (index >= 0) {
      let before = rule.parent.nodes[index]

      if (before.type !== 'rule') {
        return false
      }

      let some = false
      for (let key in prefixeds[this.name]) {
        let prefixed = prefixeds[this.name][key]
        if (before.selector === prefixed) {
          if (prefix === key) {
            return true
          } else {
            some = true
            break
          }
        }
      }
      if (!some) {
        return false
      }

      index -= 1
    }

    return false
  }

  /**
   * Replace selectors by prefixed one
   */
  replace(selector, prefix) {
    return selector.replace(this.regexp(), `$1${this.prefixed(prefix)}`)
  }

  /**
   * Clone and add prefixes for at-rule
   */
  add(rule, prefix) {
    let prefixeds = this.prefixeds(rule)

    if (this.already(rule, prefixeds, prefix)) {
      return
    }

    let cloned = this.clone(rule, { selector: prefixeds[this.name][prefix] })
    rule.parent.insertBefore(rule, cloned)
  }

  /**
   * Return function to fast find prefixed selector
   */
  old(prefix) {
    return new OldSelector(this, prefix)
  }
}

module.exports = Selector

}, function(modId) { var map = {"./old-selector":1679975014150,"./prefixer":1679975014140,"./browsers":1679975014135,"./utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014150, function(require, module, exports) {
class OldSelector {
  constructor(selector, prefix) {
    this.prefix = prefix
    this.prefixed = selector.prefixed(this.prefix)
    this.regexp = selector.regexp(this.prefix)

    this.prefixeds = selector
      .possible()
      .map(x => [selector.prefixed(x), selector.regexp(x)])

    this.unprefixed = selector.name
    this.nameRegexp = selector.regexp()
  }

  /**
   * Is rule a hack without unprefixed version bottom
   */
  isHack(rule) {
    let index = rule.parent.index(rule) + 1
    let rules = rule.parent.nodes

    while (index < rules.length) {
      let before = rules[index].selector
      if (!before) {
        return true
      }

      if (before.includes(this.unprefixed) && before.match(this.nameRegexp)) {
        return false
      }

      let some = false
      for (let [string, regexp] of this.prefixeds) {
        if (before.includes(string) && before.match(regexp)) {
          some = true
          break
        }
      }

      if (!some) {
        return true
      }

      index += 1
    }

    return true
  }

  /**
   * Does rule contain an unnecessary prefixed selector
   */
  check(rule) {
    if (!rule.selector.includes(this.prefixed)) {
      return false
    }
    if (!rule.selector.match(this.regexp)) {
      return false
    }
    if (this.isHack(rule)) {
      return false
    }
    return true
  }
}

module.exports = OldSelector

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014151, function(require, module, exports) {
let Prefixer = require('./prefixer')

class AtRule extends Prefixer {
  /**
   * Clone and add prefixes for at-rule
   */
  add(rule, prefix) {
    let prefixed = prefix + rule.name

    let already = rule.parent.some(
      i => i.name === prefixed && i.params === rule.params
    )
    if (already) {
      return undefined
    }

    let cloned = this.clone(rule, { name: prefixed })
    return rule.parent.insertBefore(rule, cloned)
  }

  /**
   * Clone node with prefixes
   */
  process(node) {
    let parent = this.parentPrefix(node)

    for (let prefix of this.prefixes) {
      if (!parent || parent === prefix) {
        this.add(node, prefix)
      }
    }
  }
}

module.exports = AtRule

}, function(modId) { var map = {"./prefixer":1679975014140}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014152, function(require, module, exports) {
let Selector = require('../selector')

class Fullscreen extends Selector {
  /**
   * Return different selectors depend on prefix
   */
  prefixed(prefix) {
    if (prefix === '-webkit-') {
      return ':-webkit-full-screen'
    }
    if (prefix === '-moz-') {
      return ':-moz-full-screen'
    }
    return `:${prefix}fullscreen`
  }
}

Fullscreen.names = [':fullscreen']

module.exports = Fullscreen

}, function(modId) { var map = {"../selector":1679975014149}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014153, function(require, module, exports) {
let Selector = require('../selector')

class Placeholder extends Selector {
  /**
   * Add old mozilla to possible prefixes
   */
  possible() {
    return super.possible().concat(['-moz- old', '-ms- old'])
  }

  /**
   * Return different selectors depend on prefix
   */
  prefixed(prefix) {
    if (prefix === '-webkit-') {
      return '::-webkit-input-placeholder'
    }
    if (prefix === '-ms-') {
      return '::-ms-input-placeholder'
    }
    if (prefix === '-ms- old') {
      return ':-ms-input-placeholder'
    }
    if (prefix === '-moz- old') {
      return ':-moz-placeholder'
    }
    return `::${prefix}placeholder`
  }
}

Placeholder.names = ['::placeholder']

module.exports = Placeholder

}, function(modId) { var map = {"../selector":1679975014149}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014154, function(require, module, exports) {
let Selector = require('../selector')

class PlaceholderShown extends Selector {
  /**
   * Return different selectors depend on prefix
   */
  prefixed(prefix) {
    if (prefix === '-ms-') {
      return ':-ms-input-placeholder'
    }
    return `:${prefix}placeholder-shown`
  }
}

PlaceholderShown.names = [':placeholder-shown']

module.exports = PlaceholderShown

}, function(modId) { var map = {"../selector":1679975014149}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014155, function(require, module, exports) {
let Selector = require('../selector')
let utils = require('../utils')

class FileSelectorButton extends Selector {
  constructor(name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(this.prefixes.map(() => '-webkit-'))
    }
  }

  /**
   * Return different selectors depend on prefix
   */
  prefixed(prefix) {
    if (prefix === '-webkit-') {
      return '::-webkit-file-upload-button'
    }
    return `::${prefix}file-selector-button`
  }
}

FileSelectorButton.names = ['::file-selector-button']

module.exports = FileSelectorButton

}, function(modId) { var map = {"../selector":1679975014149,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014156, function(require, module, exports) {
let list = require('postcss').list

let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class Flex extends Declaration {
  /**
   * Change property name for 2009 spec
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-flex'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex'
  }

  /**
   * Spec 2009 supports only first argument
   * Spec 2012 disallows unitless basis
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec === 2009) {
      decl.value = list.space(decl.value)[0]
      decl.value = Flex.oldValues[decl.value] || decl.value
      return super.set(decl, prefix)
    }
    if (spec === 2012) {
      let components = list.space(decl.value)
      if (components.length === 3 && components[2] === '0') {
        decl.value = components.slice(0, 2).concat('0px').join(' ')
      }
    }
    return super.set(decl, prefix)
  }
}

Flex.names = ['flex', 'box-flex']

Flex.oldValues = {
  auto: '1',
  none: '0'
}

module.exports = Flex

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014157, function(require, module, exports) {
/**
 * Return flexbox spec versions by prefix
 */
module.exports = function (prefix) {
  let spec
  if (prefix === '-webkit- 2009' || prefix === '-moz-') {
    spec = 2009
  } else if (prefix === '-ms-') {
    spec = 2012
  } else if (prefix === '-webkit-') {
    spec = 'final'
  }

  if (prefix === '-webkit- 2009') {
    prefix = '-webkit-'
  }

  return [spec, prefix]
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014158, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class Order extends Declaration {
  /**
   * Change property name for 2009 and 2012 specs
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-ordinal-group'
    }
    if (spec === 2012) {
      return prefix + 'flex-order'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return property name by final spec
   */
  normalize() {
    return 'order'
  }

  /**
   * Fix value for 2009 spec
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec === 2009 && /\d/.test(decl.value)) {
      decl.value = (parseInt(decl.value) + 1).toString()
      return super.set(decl, prefix)
    }
    return super.set(decl, prefix)
  }
}

Order.names = ['order', 'flex-order', 'box-ordinal-group']

module.exports = Order

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014159, function(require, module, exports) {
let Declaration = require('../declaration')

class Filter extends Declaration {
  /**
   * Check is it Internet Explorer filter
   */
  check(decl) {
    let v = decl.value
    return (
      !v.toLowerCase().includes('alpha(') &&
      !v.includes('DXImageTransform.Microsoft') &&
      !v.includes('data:image/svg+xml')
    )
  }
}

Filter.names = ['filter']

module.exports = Filter

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014160, function(require, module, exports) {
let Declaration = require('../declaration')
let { isPureNumber } = require('../utils')

class GridEnd extends Declaration {
  /**
   * Change repeating syntax for IE
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let clonedDecl = this.clone(decl)

    let startProp = decl.prop.replace(/end$/, 'start')
    let spanProp = prefix + decl.prop.replace(/end$/, 'span')

    if (decl.parent.some(i => i.prop === spanProp)) {
      return undefined
    }

    clonedDecl.prop = spanProp

    if (decl.value.includes('span')) {
      clonedDecl.value = decl.value.replace(/span\s/i, '')
    } else {
      let startDecl
      decl.parent.walkDecls(startProp, d => {
        startDecl = d
      })
      if (startDecl) {
        if (isPureNumber(startDecl.value)) {
          let value = Number(decl.value) - Number(startDecl.value) + ''
          clonedDecl.value = value
        } else {
          return undefined
        }
      } else {
        decl.warn(
          result,
          `Can not prefix ${decl.prop} (${startProp} is not found)`
        )
      }
    }

    decl.cloneBefore(clonedDecl)

    return undefined
  }
}

GridEnd.names = ['grid-row-end', 'grid-column-end']

module.exports = GridEnd

}, function(modId) { var map = {"../declaration":1679975014139,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014161, function(require, module, exports) {
let Declaration = require('../declaration')

class Animation extends Declaration {
  /**
   * Don’t add prefixes for modern values.
   */
  check(decl) {
    return !decl.value.split(/\s+/).some(i => {
      let lower = i.toLowerCase()
      return lower === 'reverse' || lower === 'alternate-reverse'
    })
  }
}

Animation.names = ['animation', 'animation-direction']

module.exports = Animation

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014162, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class FlexFlow extends Declaration {
  /**
   * Use two properties for 2009 spec
   */
  insert(decl, prefix, prefixes) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec !== 2009) {
      return super.insert(decl, prefix, prefixes)
    }
    let values = decl.value
      .split(/\s+/)
      .filter(i => i !== 'wrap' && i !== 'nowrap' && 'wrap-reverse')
    if (values.length === 0) {
      return undefined
    }

    let already = decl.parent.some(
      i =>
        i.prop === prefix + 'box-orient' || i.prop === prefix + 'box-direction'
    )
    if (already) {
      return undefined
    }

    let value = values[0]
    let orient = value.includes('row') ? 'horizontal' : 'vertical'
    let dir = value.includes('reverse') ? 'reverse' : 'normal'

    let cloned = this.clone(decl)
    cloned.prop = prefix + 'box-orient'
    cloned.value = orient
    if (this.needCascade(decl)) {
      cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
    }
    decl.parent.insertBefore(decl, cloned)

    cloned = this.clone(decl)
    cloned.prop = prefix + 'box-direction'
    cloned.value = dir
    if (this.needCascade(decl)) {
      cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
    }
    return decl.parent.insertBefore(decl, cloned)
  }
}

FlexFlow.names = ['flex-flow', 'box-direction', 'box-orient']

module.exports = FlexFlow

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014163, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class Flex extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex'
  }

  /**
   * Return flex property for 2009 and 2012 specs
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-flex'
    }
    if (spec === 2012) {
      return prefix + 'flex-positive'
    }
    return super.prefixed(prop, prefix)
  }
}

Flex.names = ['flex-grow', 'flex-positive']

module.exports = Flex

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014164, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class FlexWrap extends Declaration {
  /**
   * Don't add prefix for 2009 spec
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec !== 2009) {
      return super.set(decl, prefix)
    }
    return undefined
  }
}

FlexWrap.names = ['flex-wrap']

module.exports = FlexWrap

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014165, function(require, module, exports) {
let Declaration = require('../declaration')
let utils = require('./grid-utils')

class GridArea extends Declaration {
  /**
   * Translate grid-area to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let values = utils.parse(decl)

    let [rowStart, rowSpan] = utils.translate(values, 0, 2)
    let [columnStart, columnSpan] = utils.translate(values, 1, 3)

    ;[
      ['grid-row', rowStart],
      ['grid-row-span', rowSpan],
      ['grid-column', columnStart],
      ['grid-column-span', columnSpan]
    ].forEach(([prop, value]) => {
      utils.insertDecl(decl, prop, value)
    })

    utils.warnTemplateSelectorNotFound(decl, result)
    utils.warnIfGridRowColumnExists(decl, result)

    return undefined
  }
}

GridArea.names = ['grid-area']

module.exports = GridArea

}, function(modId) { var map = {"../declaration":1679975014139,"./grid-utils":1679975014146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014166, function(require, module, exports) {
let Declaration = require('../declaration')
let utils = require('./grid-utils')

class PlaceSelf extends Declaration {
  /**
   * Translate place-self to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    // prevent doubling of prefixes
    if (decl.parent.some(i => i.prop === '-ms-grid-row-align')) {
      return undefined
    }

    let [[first, second]] = utils.parse(decl)

    if (second) {
      utils.insertDecl(decl, 'grid-row-align', first)
      utils.insertDecl(decl, 'grid-column-align', second)
    } else {
      utils.insertDecl(decl, 'grid-row-align', first)
      utils.insertDecl(decl, 'grid-column-align', first)
    }

    return undefined
  }
}

PlaceSelf.names = ['place-self']

module.exports = PlaceSelf

}, function(modId) { var map = {"../declaration":1679975014139,"./grid-utils":1679975014146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014167, function(require, module, exports) {
let Declaration = require('../declaration')

class GridStart extends Declaration {
  /**
   * Do not add prefix for unsupported value in IE
   */
  check(decl) {
    let value = decl.value
    return !value.includes('/') && !value.includes('span')
  }

  /**
   * Return a final spec property
   */
  normalize(prop) {
    return prop.replace('-start', '')
  }

  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    let result = super.prefixed(prop, prefix)
    if (prefix === '-ms-') {
      result = result.replace('-start', '')
    }
    return result
  }
}

GridStart.names = ['grid-row-start', 'grid-column-start']

module.exports = GridStart

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014168, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class AlignSelf extends Declaration {
  check(decl) {
    return (
      decl.parent &&
      !decl.parent.some(i => {
        return i.prop && i.prop.startsWith('grid-')
      })
    )
  }

  /**
   * Change property name for 2012 specs
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2012) {
      return prefix + 'flex-item-align'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return property name by final spec
   */
  normalize() {
    return 'align-self'
  }

  /**
   * Change value for 2012 spec and ignore prefix for 2009
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec === 2012) {
      decl.value = AlignSelf.oldValues[decl.value] || decl.value
      return super.set(decl, prefix)
    }
    if (spec === 'final') {
      return super.set(decl, prefix)
    }
    return undefined
  }
}

AlignSelf.names = ['align-self', 'flex-item-align']

AlignSelf.oldValues = {
  'flex-end': 'end',
  'flex-start': 'start'
}

module.exports = AlignSelf

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014169, function(require, module, exports) {
let Declaration = require('../declaration')
let utils = require('../utils')

class Appearance extends Declaration {
  constructor(name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(
        this.prefixes.map(i => {
          if (i === '-ms-') {
            return '-webkit-'
          }
          return i
        })
      )
    }
  }
}

Appearance.names = ['appearance']

module.exports = Appearance

}, function(modId) { var map = {"../declaration":1679975014139,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014170, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class FlexBasis extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex-basis'
  }

  /**
   * Return flex property for 2012 spec
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2012) {
      return prefix + 'flex-preferred-size'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Ignore 2009 spec and use flex property for 2012
   */
  set(decl, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2012 || spec === 'final') {
      return super.set(decl, prefix)
    }
    return undefined
  }
}

FlexBasis.names = ['flex-basis', 'flex-preferred-size']

module.exports = FlexBasis

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014171, function(require, module, exports) {
let Declaration = require('../declaration')

class MaskBorder extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return this.name.replace('box-image', 'border')
  }

  /**
   * Return flex property for 2012 spec
   */
  prefixed(prop, prefix) {
    let result = super.prefixed(prop, prefix)
    if (prefix === '-webkit-') {
      result = result.replace('border', 'box-image')
    }
    return result
  }
}

MaskBorder.names = [
  'mask-border',
  'mask-border-source',
  'mask-border-slice',
  'mask-border-width',
  'mask-border-outset',
  'mask-border-repeat',
  'mask-box-image',
  'mask-box-image-source',
  'mask-box-image-slice',
  'mask-box-image-width',
  'mask-box-image-outset',
  'mask-box-image-repeat'
]

module.exports = MaskBorder

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014172, function(require, module, exports) {
let Declaration = require('../declaration')

class MaskComposite extends Declaration {
  /**
   * Prefix mask-composite for webkit
   */
  insert(decl, prefix, prefixes) {
    let isCompositeProp = decl.prop === 'mask-composite'

    let compositeValues

    if (isCompositeProp) {
      compositeValues = decl.value.split(',')
    } else {
      compositeValues = decl.value.match(MaskComposite.regexp) || []
    }

    compositeValues = compositeValues.map(el => el.trim()).filter(el => el)
    let hasCompositeValues = compositeValues.length

    let compositeDecl

    if (hasCompositeValues) {
      compositeDecl = this.clone(decl)
      compositeDecl.value = compositeValues
        .map(value => MaskComposite.oldValues[value] || value)
        .join(', ')

      if (compositeValues.includes('intersect')) {
        compositeDecl.value += ', xor'
      }

      compositeDecl.prop = prefix + 'mask-composite'
    }

    if (isCompositeProp) {
      if (!hasCompositeValues) {
        return undefined
      }

      if (this.needCascade(decl)) {
        compositeDecl.raws.before = this.calcBefore(prefixes, decl, prefix)
      }

      return decl.parent.insertBefore(decl, compositeDecl)
    }

    let cloned = this.clone(decl)
    cloned.prop = prefix + cloned.prop

    if (hasCompositeValues) {
      cloned.value = cloned.value.replace(MaskComposite.regexp, '')
    }

    if (this.needCascade(decl)) {
      cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
    }

    decl.parent.insertBefore(decl, cloned)

    if (!hasCompositeValues) {
      return decl
    }

    if (this.needCascade(decl)) {
      compositeDecl.raws.before = this.calcBefore(prefixes, decl, prefix)
    }
    return decl.parent.insertBefore(decl, compositeDecl)
  }
}

MaskComposite.names = ['mask', 'mask-composite']

MaskComposite.oldValues = {
  add: 'source-over',
  subtract: 'source-out',
  intersect: 'source-in',
  exclude: 'xor'
}

MaskComposite.regexp = new RegExp(
  `\\s+(${Object.keys(MaskComposite.oldValues).join(
    '|'
  )})\\b(?!\\))\\s*(?=[,])`,
  'ig'
)

module.exports = MaskComposite

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014173, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class AlignItems extends Declaration {
  /**
   * Change property name for 2009 and 2012 specs
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-align'
    }
    if (spec === 2012) {
      return prefix + 'flex-align'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return property name by final spec
   */
  normalize() {
    return 'align-items'
  }

  /**
   * Change value for 2009 and 2012 specs
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec === 2009 || spec === 2012) {
      decl.value = AlignItems.oldValues[decl.value] || decl.value
    }
    return super.set(decl, prefix)
  }
}

AlignItems.names = ['align-items', 'flex-align', 'box-align']

AlignItems.oldValues = {
  'flex-end': 'end',
  'flex-start': 'start'
}

module.exports = AlignItems

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014174, function(require, module, exports) {
let Declaration = require('../declaration')

class UserSelect extends Declaration {
  /**
   * Change prefixed value for IE
   */
  set(decl, prefix) {
    if (prefix === '-ms-' && decl.value === 'contain') {
      decl.value = 'element'
    }
    return super.set(decl, prefix)
  }

  /**
   * Avoid prefixing all in IE
   */
  insert(decl, prefix, prefixes) {
    if (decl.value === 'all' && prefix === '-ms-') {
      return undefined
    } else {
      return super.insert(decl, prefix, prefixes)
    }
  }
}

UserSelect.names = ['user-select']

module.exports = UserSelect

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014175, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class FlexShrink extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex-shrink'
  }

  /**
   * Return flex property for 2012 spec
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2012) {
      return prefix + 'flex-negative'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Ignore 2009 spec and use flex property for 2012
   */
  set(decl, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2012 || spec === 'final') {
      return super.set(decl, prefix)
    }
    return undefined
  }
}

FlexShrink.names = ['flex-shrink', 'flex-negative']

module.exports = FlexShrink

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014176, function(require, module, exports) {
let Declaration = require('../declaration')

class BreakProps extends Declaration {
  /**
   * Change name for -webkit- and -moz- prefix
   */
  prefixed(prop, prefix) {
    return `${prefix}column-${prop}`
  }

  /**
   * Return property name by final spec
   */
  normalize(prop) {
    if (prop.includes('inside')) {
      return 'break-inside'
    }
    if (prop.includes('before')) {
      return 'break-before'
    }
    return 'break-after'
  }

  /**
   * Change prefixed value for avoid-column and avoid-page
   */
  set(decl, prefix) {
    if (
      (decl.prop === 'break-inside' && decl.value === 'avoid-column') ||
      decl.value === 'avoid-page'
    ) {
      decl.value = 'avoid'
    }
    return super.set(decl, prefix)
  }

  /**
   * Don’t prefix some values
   */
  insert(decl, prefix, prefixes) {
    if (decl.prop !== 'break-inside') {
      return super.insert(decl, prefix, prefixes)
    }
    if (/region/i.test(decl.value) || /page/i.test(decl.value)) {
      return undefined
    }
    return super.insert(decl, prefix, prefixes)
  }
}

BreakProps.names = [
  'break-inside',
  'page-break-inside',
  'column-break-inside',
  'break-before',
  'page-break-before',
  'column-break-before',
  'break-after',
  'page-break-after',
  'column-break-after'
]

module.exports = BreakProps

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014177, function(require, module, exports) {
let Declaration = require('../declaration')

class WritingMode extends Declaration {
  insert(decl, prefix, prefixes) {
    if (prefix === '-ms-') {
      let cloned = this.set(this.clone(decl), prefix)

      if (this.needCascade(decl)) {
        cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
      }
      let direction = 'ltr'

      decl.parent.nodes.forEach(i => {
        if (i.prop === 'direction') {
          if (i.value === 'rtl' || i.value === 'ltr') direction = i.value
        }
      })

      cloned.value = WritingMode.msValues[direction][decl.value] || decl.value
      return decl.parent.insertBefore(decl, cloned)
    }

    return super.insert(decl, prefix, prefixes)
  }
}

WritingMode.names = ['writing-mode']

WritingMode.msValues = {
  ltr: {
    'horizontal-tb': 'lr-tb',
    'vertical-rl': 'tb-rl',
    'vertical-lr': 'tb-lr'
  },
  rtl: {
    'horizontal-tb': 'rl-tb',
    'vertical-rl': 'bt-rl',
    'vertical-lr': 'bt-lr'
  }
}

module.exports = WritingMode

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014178, function(require, module, exports) {
let Declaration = require('../declaration')

class BorderImage extends Declaration {
  /**
   * Remove fill parameter for prefixed declarations
   */
  set(decl, prefix) {
    decl.value = decl.value.replace(/\s+fill(\s)/, '$1')
    return super.set(decl, prefix)
  }
}

BorderImage.names = ['border-image']

module.exports = BorderImage

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014179, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class AlignContent extends Declaration {
  /**
   * Change property name for 2012 spec
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2012) {
      return prefix + 'flex-line-pack'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return property name by final spec
   */
  normalize() {
    return 'align-content'
  }

  /**
   * Change value for 2012 spec and ignore prefix for 2009
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec === 2012) {
      decl.value = AlignContent.oldValues[decl.value] || decl.value
      return super.set(decl, prefix)
    }
    if (spec === 'final') {
      return super.set(decl, prefix)
    }
    return undefined
  }
}

AlignContent.names = ['align-content', 'flex-line-pack']

AlignContent.oldValues = {
  'flex-end': 'end',
  'flex-start': 'start',
  'space-between': 'justify',
  'space-around': 'distribute'
}

module.exports = AlignContent

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014180, function(require, module, exports) {
let Declaration = require('../declaration')

class BorderRadius extends Declaration {
  /**
   * Change syntax, when add Mozilla prefix
   */
  prefixed(prop, prefix) {
    if (prefix === '-moz-') {
      return prefix + (BorderRadius.toMozilla[prop] || prop)
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return unprefixed version of property
   */
  normalize(prop) {
    return BorderRadius.toNormal[prop] || prop
  }
}

BorderRadius.names = ['border-radius']

BorderRadius.toMozilla = {}
BorderRadius.toNormal = {}

for (let ver of ['top', 'bottom']) {
  for (let hor of ['left', 'right']) {
    let normal = `border-${ver}-${hor}-radius`
    let mozilla = `border-radius-${ver}${hor}`

    BorderRadius.names.push(normal)
    BorderRadius.names.push(mozilla)

    BorderRadius.toMozilla[normal] = mozilla
    BorderRadius.toNormal[mozilla] = normal
  }
}

module.exports = BorderRadius

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014181, function(require, module, exports) {
let Declaration = require('../declaration')

class BlockLogical extends Declaration {
  /**
   * Use old syntax for -moz- and -webkit-
   */
  prefixed(prop, prefix) {
    if (prop.includes('-start')) {
      return prefix + prop.replace('-block-start', '-before')
    }
    return prefix + prop.replace('-block-end', '-after')
  }

  /**
   * Return property name by spec
   */
  normalize(prop) {
    if (prop.includes('-before')) {
      return prop.replace('-before', '-block-start')
    }
    return prop.replace('-after', '-block-end')
  }
}

BlockLogical.names = [
  'border-block-start',
  'border-block-end',
  'margin-block-start',
  'margin-block-end',
  'padding-block-start',
  'padding-block-end',
  'border-before',
  'border-after',
  'margin-before',
  'margin-after',
  'padding-before',
  'padding-after'
]

module.exports = BlockLogical

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014182, function(require, module, exports) {
let Declaration = require('../declaration')
let {
  parseTemplate,
  warnMissedAreas,
  getGridGap,
  warnGridGap,
  inheritGridGap
} = require('./grid-utils')

class GridTemplate extends Declaration {
  /**
   * Translate grid-template to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    if (decl.parent.some(i => i.prop === '-ms-grid-rows')) {
      return undefined
    }

    let gap = getGridGap(decl)

    /**
     * we must insert inherited gap values in some cases:
     * if we are inside media query && if we have no grid-gap value
     */
    let inheritedGap = inheritGridGap(decl, gap)

    let { rows, columns, areas } = parseTemplate({
      decl,
      gap: inheritedGap || gap
    })

    let hasAreas = Object.keys(areas).length > 0
    let hasRows = Boolean(rows)
    let hasColumns = Boolean(columns)

    warnGridGap({
      gap,
      hasColumns,
      decl,
      result
    })

    warnMissedAreas(areas, decl, result)

    if ((hasRows && hasColumns) || hasAreas) {
      decl.cloneBefore({
        prop: '-ms-grid-rows',
        value: rows,
        raws: {}
      })
    }

    if (hasColumns) {
      decl.cloneBefore({
        prop: '-ms-grid-columns',
        value: columns,
        raws: {}
      })
    }

    return decl
  }
}

GridTemplate.names = ['grid-template']

module.exports = GridTemplate

}, function(modId) { var map = {"../declaration":1679975014139,"./grid-utils":1679975014146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014183, function(require, module, exports) {
let Declaration = require('../declaration')

class InlineLogical extends Declaration {
  /**
   * Use old syntax for -moz- and -webkit-
   */
  prefixed(prop, prefix) {
    return prefix + prop.replace('-inline', '')
  }

  /**
   * Return property name by spec
   */
  normalize(prop) {
    return prop.replace(/(margin|padding|border)-(start|end)/, '$1-inline-$2')
  }
}

InlineLogical.names = [
  'border-inline-start',
  'border-inline-end',
  'margin-inline-start',
  'margin-inline-end',
  'padding-inline-start',
  'padding-inline-end',
  'border-start',
  'border-end',
  'margin-start',
  'margin-end',
  'padding-start',
  'padding-end'
]

module.exports = InlineLogical

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014184, function(require, module, exports) {
let Declaration = require('../declaration')

class GridRowAlign extends Declaration {
  /**
   * Do not prefix flexbox values
   */
  check(decl) {
    return !decl.value.includes('flex-') && decl.value !== 'baseline'
  }

  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    return prefix + 'grid-row-align'
  }

  /**
   * Change IE property back
   */
  normalize() {
    return 'align-self'
  }
}

GridRowAlign.names = ['grid-row-align']

module.exports = GridRowAlign

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014185, function(require, module, exports) {
let Declaration = require('../declaration')

class TransformDecl extends Declaration {
  /**
   * Recursively check all parents for @keyframes
   */
  keyframeParents(decl) {
    let { parent } = decl
    while (parent) {
      if (parent.type === 'atrule' && parent.name === 'keyframes') {
        return true
      }
      ;({ parent } = parent)
    }
    return false
  }

  /**
   * Is transform contain 3D commands
   */
  contain3d(decl) {
    if (decl.prop === 'transform-origin') {
      return false
    }

    for (let func of TransformDecl.functions3d) {
      if (decl.value.includes(`${func}(`)) {
        return true
      }
    }

    return false
  }

  /**
   * Replace rotateZ to rotate for IE 9
   */
  set(decl, prefix) {
    decl = super.set(decl, prefix)
    if (prefix === '-ms-') {
      decl.value = decl.value.replace(/rotatez/gi, 'rotate')
    }
    return decl
  }

  /**
   * Don't add prefix for IE in keyframes
   */
  insert(decl, prefix, prefixes) {
    if (prefix === '-ms-') {
      if (!this.contain3d(decl) && !this.keyframeParents(decl)) {
        return super.insert(decl, prefix, prefixes)
      }
    } else if (prefix === '-o-') {
      if (!this.contain3d(decl)) {
        return super.insert(decl, prefix, prefixes)
      }
    } else {
      return super.insert(decl, prefix, prefixes)
    }
    return undefined
  }
}

TransformDecl.names = ['transform', 'transform-origin']

TransformDecl.functions3d = [
  'matrix3d',
  'translate3d',
  'translateZ',
  'scale3d',
  'scaleZ',
  'rotate3d',
  'rotateX',
  'rotateY',
  'perspective'
]

module.exports = TransformDecl

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014186, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class FlexDirection extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex-direction'
  }

  /**
   * Use two properties for 2009 spec
   */
  insert(decl, prefix, prefixes) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec !== 2009) {
      return super.insert(decl, prefix, prefixes)
    }
    let already = decl.parent.some(
      i =>
        i.prop === prefix + 'box-orient' || i.prop === prefix + 'box-direction'
    )
    if (already) {
      return undefined
    }

    let v = decl.value
    let orient, dir
    if (v === 'inherit' || v === 'initial' || v === 'unset') {
      orient = v
      dir = v
    } else {
      orient = v.includes('row') ? 'horizontal' : 'vertical'
      dir = v.includes('reverse') ? 'reverse' : 'normal'
    }

    let cloned = this.clone(decl)
    cloned.prop = prefix + 'box-orient'
    cloned.value = orient
    if (this.needCascade(decl)) {
      cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
    }
    decl.parent.insertBefore(decl, cloned)

    cloned = this.clone(decl)
    cloned.prop = prefix + 'box-direction'
    cloned.value = dir
    if (this.needCascade(decl)) {
      cloned.raws.before = this.calcBefore(prefixes, decl, prefix)
    }
    return decl.parent.insertBefore(decl, cloned)
  }

  /**
   * Clean two properties for 2009 spec
   */
  old(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return [prefix + 'box-orient', prefix + 'box-direction']
    } else {
      return super.old(prop, prefix)
    }
  }
}

FlexDirection.names = ['flex-direction', 'box-direction', 'box-orient']

module.exports = FlexDirection

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014187, function(require, module, exports) {
let Declaration = require('../declaration')

class ImageRendering extends Declaration {
  /**
   * Add hack only for crisp-edges
   */
  check(decl) {
    return decl.value === 'pixelated'
  }

  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    if (prefix === '-ms-') {
      return '-ms-interpolation-mode'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Change property and value for IE
   */
  set(decl, prefix) {
    if (prefix !== '-ms-') return super.set(decl, prefix)
    decl.prop = '-ms-interpolation-mode'
    decl.value = 'nearest-neighbor'
    return decl
  }

  /**
   * Return property name by spec
   */
  normalize() {
    return 'image-rendering'
  }

  /**
   * Warn on old value
   */
  process(node, result) {
    return super.process(node, result)
  }
}

ImageRendering.names = ['image-rendering', 'interpolation-mode']

module.exports = ImageRendering

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014188, function(require, module, exports) {
let Declaration = require('../declaration')
let utils = require('../utils')

class BackdropFilter extends Declaration {
  constructor(name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(
        this.prefixes.map(i => {
          return i === '-ms-' ? '-webkit-' : i
        })
      )
    }
  }
}

BackdropFilter.names = ['backdrop-filter']

module.exports = BackdropFilter

}, function(modId) { var map = {"../declaration":1679975014139,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014189, function(require, module, exports) {
let Declaration = require('../declaration')
let utils = require('../utils')

class BackgroundClip extends Declaration {
  constructor(name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(
        this.prefixes.map(i => {
          return i === '-ms-' ? '-webkit-' : i
        })
      )
    }
  }

  check(decl) {
    return decl.value.toLowerCase() === 'text'
  }
}

BackgroundClip.names = ['background-clip']

module.exports = BackgroundClip

}, function(modId) { var map = {"../declaration":1679975014139,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014190, function(require, module, exports) {
let Declaration = require('../declaration')

const BASIC = [
  'none',
  'underline',
  'overline',
  'line-through',
  'blink',
  'inherit',
  'initial',
  'unset'
]

class TextDecoration extends Declaration {
  /**
   * Do not add prefixes for basic values.
   */
  check(decl) {
    return decl.value.split(/\s+/).some(i => !BASIC.includes(i))
  }
}

TextDecoration.names = ['text-decoration']

module.exports = TextDecoration

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014191, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class JustifyContent extends Declaration {
  /**
   * Change property name for 2009 and 2012 specs
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-pack'
    }
    if (spec === 2012) {
      return prefix + 'flex-pack'
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Return property name by final spec
   */
  normalize() {
    return 'justify-content'
  }

  /**
   * Change value for 2009 and 2012 specs
   */
  set(decl, prefix) {
    let spec = flexSpec(prefix)[0]
    if (spec === 2009 || spec === 2012) {
      let value = JustifyContent.oldValues[decl.value] || decl.value
      decl.value = value
      if (spec !== 2009 || value !== 'distribute') {
        return super.set(decl, prefix)
      }
    } else if (spec === 'final') {
      return super.set(decl, prefix)
    }
    return undefined
  }
}

JustifyContent.names = ['justify-content', 'flex-pack', 'box-pack']

JustifyContent.oldValues = {
  'flex-end': 'end',
  'flex-start': 'start',
  'space-between': 'justify',
  'space-around': 'distribute'
}

module.exports = JustifyContent

}, function(modId) { var map = {"./flex-spec":1679975014157,"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014192, function(require, module, exports) {
let Declaration = require('../declaration')

class BackgroundSize extends Declaration {
  /**
   * Duplication parameter for -webkit- browsers
   */
  set(decl, prefix) {
    let value = decl.value.toLowerCase()
    if (
      prefix === '-webkit-' &&
      !value.includes(' ') &&
      value !== 'contain' &&
      value !== 'cover'
    ) {
      decl.value = decl.value + ' ' + decl.value
    }
    return super.set(decl, prefix)
  }
}

BackgroundSize.names = ['background-size']

module.exports = BackgroundSize

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014193, function(require, module, exports) {
let Declaration = require('../declaration')
let utils = require('./grid-utils')

class GridRowColumn extends Declaration {
  /**
   * Translate grid-row / grid-column to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let values = utils.parse(decl)
    let [start, span] = utils.translate(values, 0, 1)

    let hasStartValueSpan = values[0] && values[0].includes('span')

    if (hasStartValueSpan) {
      span = values[0].join('').replace(/\D/g, '')
    }

    ;[
      [decl.prop, start],
      [`${decl.prop}-span`, span]
    ].forEach(([prop, value]) => {
      utils.insertDecl(decl, prop, value)
    })

    return undefined
  }
}

GridRowColumn.names = ['grid-row', 'grid-column']

module.exports = GridRowColumn

}, function(modId) { var map = {"../declaration":1679975014139,"./grid-utils":1679975014146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014194, function(require, module, exports) {
let Declaration = require('../declaration')
let {
  prefixTrackProp,
  prefixTrackValue,
  autoplaceGridItems,
  getGridGap,
  inheritGridGap
} = require('./grid-utils')
let Processor = require('../processor')

class GridRowsColumns extends Declaration {
  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    if (prefix === '-ms-') {
      return prefixTrackProp({ prop, prefix })
    }
    return super.prefixed(prop, prefix)
  }

  /**
   * Change IE property back
   */
  normalize(prop) {
    return prop.replace(/^grid-(rows|columns)/, 'grid-template-$1')
  }

  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let { parent, prop, value } = decl
    let isRowProp = prop.includes('rows')
    let isColumnProp = prop.includes('columns')

    let hasGridTemplate = parent.some(
      i => i.prop === 'grid-template' || i.prop === 'grid-template-areas'
    )

    /**
     * Not to prefix rows declaration if grid-template(-areas) is present
     */
    if (hasGridTemplate && isRowProp) {
      return false
    }

    let processor = new Processor({ options: {} })
    let status = processor.gridStatus(parent, result)
    let gap = getGridGap(decl)
    gap = inheritGridGap(decl, gap) || gap

    let gapValue = isRowProp ? gap.row : gap.column

    if ((status === 'no-autoplace' || status === true) && !hasGridTemplate) {
      gapValue = null
    }

    let prefixValue = prefixTrackValue({
      value,
      gap: gapValue
    })

    /**
     * Insert prefixes
     */
    decl.cloneBefore({
      prop: prefixTrackProp({ prop, prefix }),
      value: prefixValue
    })

    let autoflow = parent.nodes.find(i => i.prop === 'grid-auto-flow')
    let autoflowValue = 'row'

    if (autoflow && !processor.disabled(autoflow, result)) {
      autoflowValue = autoflow.value.trim()
    }
    if (status === 'autoplace') {
      /**
       * Show warning if grid-template-rows decl is not found
       */
      let rowDecl = parent.nodes.find(i => i.prop === 'grid-template-rows')

      if (!rowDecl && hasGridTemplate) {
        return undefined
      } else if (!rowDecl && !hasGridTemplate) {
        decl.warn(
          result,
          'Autoplacement does not work without grid-template-rows property'
        )
        return undefined
      }

      /**
       * Show warning if grid-template-columns decl is not found
       */
      let columnDecl = parent.nodes.find(i => {
        return i.prop === 'grid-template-columns'
      })
      if (!columnDecl && !hasGridTemplate) {
        decl.warn(
          result,
          'Autoplacement does not work without grid-template-columns property'
        )
      }

      /**
       * Autoplace grid items
       */
      if (isColumnProp && !hasGridTemplate) {
        autoplaceGridItems(decl, result, gap, autoflowValue)
      }
    }

    return undefined
  }
}

GridRowsColumns.names = [
  'grid-template-rows',
  'grid-template-columns',
  'grid-rows',
  'grid-columns'
]

module.exports = GridRowsColumns

}, function(modId) { var map = {"../declaration":1679975014139,"./grid-utils":1679975014146,"../processor":1679975014143}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014195, function(require, module, exports) {
let Declaration = require('../declaration')

class GridColumnAlign extends Declaration {
  /**
   * Do not prefix flexbox values
   */
  check(decl) {
    return !decl.value.includes('flex-') && decl.value !== 'baseline'
  }

  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    return prefix + 'grid-column-align'
  }

  /**
   * Change IE property back
   */
  normalize() {
    return 'justify-self'
  }
}

GridColumnAlign.names = ['grid-column-align']

module.exports = GridColumnAlign

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014196, function(require, module, exports) {
let Declaration = require('../declaration')

class PrintColorAdjust extends Declaration {
  /**
   * Change property name for WebKit-based browsers
   */
  prefixed(prop, prefix) {
    if (prefix === '-moz-') {
      return 'color-adjust'
    } else {
      return prefix + 'print-color-adjust'
    }
  }

  /**
   * Return property name by spec
   */
  normalize() {
    return 'print-color-adjust'
  }
}

PrintColorAdjust.names = ['print-color-adjust', 'color-adjust']

module.exports = PrintColorAdjust

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014197, function(require, module, exports) {
let Declaration = require('../declaration')

class OverscrollBehavior extends Declaration {
  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    return prefix + 'scroll-chaining'
  }

  /**
   * Return property name by spec
   */
  normalize() {
    return 'overscroll-behavior'
  }

  /**
   * Change value for IE
   */
  set(decl, prefix) {
    if (decl.value === 'auto') {
      decl.value = 'chained'
    } else if (decl.value === 'none' || decl.value === 'contain') {
      decl.value = 'none'
    }
    return super.set(decl, prefix)
  }
}

OverscrollBehavior.names = ['overscroll-behavior', 'scroll-chaining']

module.exports = OverscrollBehavior

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014198, function(require, module, exports) {
let Declaration = require('../declaration')
let {
  parseGridAreas,
  warnMissedAreas,
  prefixTrackProp,
  prefixTrackValue,
  getGridGap,
  warnGridGap,
  inheritGridGap
} = require('./grid-utils')

function getGridRows(tpl) {
  return tpl
    .trim()
    .slice(1, -1)
    .split(/["']\s*["']?/g)
}

class GridTemplateAreas extends Declaration {
  /**
   * Translate grid-template-areas to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let hasColumns = false
    let hasRows = false
    let parent = decl.parent
    let gap = getGridGap(decl)
    gap = inheritGridGap(decl, gap) || gap

    // remove already prefixed rows
    // to prevent doubling prefixes
    parent.walkDecls(/-ms-grid-rows/, i => i.remove())

    // add empty tracks to rows
    parent.walkDecls(/grid-template-(rows|columns)/, trackDecl => {
      if (trackDecl.prop === 'grid-template-rows') {
        hasRows = true
        let { prop, value } = trackDecl
        trackDecl.cloneBefore({
          prop: prefixTrackProp({ prop, prefix }),
          value: prefixTrackValue({ value, gap: gap.row })
        })
      } else {
        hasColumns = true
      }
    })

    let gridRows = getGridRows(decl.value)

    if (hasColumns && !hasRows && gap.row && gridRows.length > 1) {
      decl.cloneBefore({
        prop: '-ms-grid-rows',
        value: prefixTrackValue({
          value: `repeat(${gridRows.length}, auto)`,
          gap: gap.row
        }),
        raws: {}
      })
    }

    // warnings
    warnGridGap({
      gap,
      hasColumns,
      decl,
      result
    })

    let areas = parseGridAreas({
      rows: gridRows,
      gap
    })

    warnMissedAreas(areas, decl, result)

    return decl
  }
}

GridTemplateAreas.names = ['grid-template-areas']

module.exports = GridTemplateAreas

}, function(modId) { var map = {"../declaration":1679975014139,"./grid-utils":1679975014146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014199, function(require, module, exports) {
let Declaration = require('../declaration')

class TextEmphasisPosition extends Declaration {
  set(decl, prefix) {
    if (prefix === '-webkit-') {
      decl.value = decl.value.replace(/\s*(right|left)\s*/i, '')
    }
    return super.set(decl, prefix)
  }
}

TextEmphasisPosition.names = ['text-emphasis-position']

module.exports = TextEmphasisPosition

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014200, function(require, module, exports) {
let Declaration = require('../declaration')

class TextDecorationSkipInk extends Declaration {
  /**
   * Change prefix for ink value
   */
  set(decl, prefix) {
    if (decl.prop === 'text-decoration-skip-ink' && decl.value === 'auto') {
      decl.prop = prefix + 'text-decoration-skip'
      decl.value = 'ink'
      return decl
    } else {
      return super.set(decl, prefix)
    }
  }
}

TextDecorationSkipInk.names = [
  'text-decoration-skip-ink',
  'text-decoration-skip'
]

module.exports = TextDecorationSkipInk

}, function(modId) { var map = {"../declaration":1679975014139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014201, function(require, module, exports) {
let parser = require('postcss-value-parser')
let range = require('normalize-range')

let OldValue = require('../old-value')
let Value = require('../value')
let utils = require('../utils')

let IS_DIRECTION = /top|left|right|bottom/gi

class Gradient extends Value {
  /**
   * Change degrees for webkit prefix
   */
  replace(string, prefix) {
    let ast = parser(string)
    for (let node of ast.nodes) {
      let gradientName = this.name // gradient name
      if (node.type === 'function' && node.value === gradientName) {
        node.nodes = this.newDirection(node.nodes)
        node.nodes = this.normalize(node.nodes, gradientName)
        if (prefix === '-webkit- old') {
          let changes = this.oldWebkit(node)
          if (!changes) {
            return false
          }
        } else {
          node.nodes = this.convertDirection(node.nodes)
          node.value = prefix + node.value
        }
      }
    }
    return ast.toString()
  }

  /**
   * Replace first token
   */
  replaceFirst(params, ...words) {
    let prefix = words.map(i => {
      if (i === ' ') {
        return { type: 'space', value: i }
      }
      return { type: 'word', value: i }
    })
    return prefix.concat(params.slice(1))
  }

  /**
   * Convert angle unit to deg
   */
  normalizeUnit(str, full) {
    let num = parseFloat(str)
    let deg = (num / full) * 360
    return `${deg}deg`
  }

  /**
   * Normalize angle
   */
  normalize(nodes, gradientName) {
    if (!nodes[0]) return nodes

    if (/-?\d+(.\d+)?grad/.test(nodes[0].value)) {
      nodes[0].value = this.normalizeUnit(nodes[0].value, 400)
    } else if (/-?\d+(.\d+)?rad/.test(nodes[0].value)) {
      nodes[0].value = this.normalizeUnit(nodes[0].value, 2 * Math.PI)
    } else if (/-?\d+(.\d+)?turn/.test(nodes[0].value)) {
      nodes[0].value = this.normalizeUnit(nodes[0].value, 1)
    } else if (nodes[0].value.includes('deg')) {
      let num = parseFloat(nodes[0].value)
      num = range.wrap(0, 360, num)
      nodes[0].value = `${num}deg`
    }

    if (
      gradientName === 'linear-gradient' ||
      gradientName === 'repeating-linear-gradient'
    ) {
      let direction = nodes[0].value

      // Unitless zero for `<angle>` values are allowed in CSS gradients and transforms.
      // Spec: https://github.com/w3c/csswg-drafts/commit/602789171429b2231223ab1e5acf8f7f11652eb3
      if (direction === '0deg' || direction === '0') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'top')
      } else if (direction === '90deg') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'right')
      } else if (direction === '180deg') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'bottom') // default value
      } else if (direction === '270deg') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'left')
      }
    }

    return nodes
  }

  /**
   * Replace old direction to new
   */
  newDirection(params) {
    if (params[0].value === 'to') {
      return params
    }
    IS_DIRECTION.lastIndex = 0 // reset search index of global regexp
    if (!IS_DIRECTION.test(params[0].value)) {
      return params
    }

    params.unshift(
      {
        type: 'word',
        value: 'to'
      },
      {
        type: 'space',
        value: ' '
      }
    )

    for (let i = 2; i < params.length; i++) {
      if (params[i].type === 'div') {
        break
      }
      if (params[i].type === 'word') {
        params[i].value = this.revertDirection(params[i].value)
      }
    }

    return params
  }

  /**
   * Look for at word
   */
  isRadial(params) {
    let state = 'before'
    for (let param of params) {
      if (state === 'before' && param.type === 'space') {
        state = 'at'
      } else if (state === 'at' && param.value === 'at') {
        state = 'after'
      } else if (state === 'after' && param.type === 'space') {
        return true
      } else if (param.type === 'div') {
        break
      } else {
        state = 'before'
      }
    }
    return false
  }

  /**
   * Change new direction to old
   */
  convertDirection(params) {
    if (params.length > 0) {
      if (params[0].value === 'to') {
        this.fixDirection(params)
      } else if (params[0].value.includes('deg')) {
        this.fixAngle(params)
      } else if (this.isRadial(params)) {
        this.fixRadial(params)
      }
    }
    return params
  }

  /**
   * Replace `to top left` to `bottom right`
   */
  fixDirection(params) {
    params.splice(0, 2)

    for (let param of params) {
      if (param.type === 'div') {
        break
      }
      if (param.type === 'word') {
        param.value = this.revertDirection(param.value)
      }
    }
  }

  /**
   * Add 90 degrees
   */
  fixAngle(params) {
    let first = params[0].value
    first = parseFloat(first)
    first = Math.abs(450 - first) % 360
    first = this.roundFloat(first, 3)
    params[0].value = `${first}deg`
  }

  /**
   * Fix radial direction syntax
   */
  fixRadial(params) {
    let first = []
    let second = []
    let a, b, c, i, next

    for (i = 0; i < params.length - 2; i++) {
      a = params[i]
      b = params[i + 1]
      c = params[i + 2]
      if (a.type === 'space' && b.value === 'at' && c.type === 'space') {
        next = i + 3
        break
      } else {
        first.push(a)
      }
    }

    let div
    for (i = next; i < params.length; i++) {
      if (params[i].type === 'div') {
        div = params[i]
        break
      } else {
        second.push(params[i])
      }
    }

    params.splice(0, i, ...second, div, ...first)
  }

  revertDirection(word) {
    return Gradient.directions[word.toLowerCase()] || word
  }

  /**
   * Round float and save digits under dot
   */
  roundFloat(float, digits) {
    return parseFloat(float.toFixed(digits))
  }

  /**
   * Convert to old webkit syntax
   */
  oldWebkit(node) {
    let { nodes } = node
    let string = parser.stringify(node.nodes)

    if (this.name !== 'linear-gradient') {
      return false
    }
    if (nodes[0] && nodes[0].value.includes('deg')) {
      return false
    }
    if (
      string.includes('px') ||
      string.includes('-corner') ||
      string.includes('-side')
    ) {
      return false
    }

    let params = [[]]
    for (let i of nodes) {
      params[params.length - 1].push(i)
      if (i.type === 'div' && i.value === ',') {
        params.push([])
      }
    }

    this.oldDirection(params)
    this.colorStops(params)

    node.nodes = []
    for (let param of params) {
      node.nodes = node.nodes.concat(param)
    }

    node.nodes.unshift(
      { type: 'word', value: 'linear' },
      this.cloneDiv(node.nodes)
    )
    node.value = '-webkit-gradient'

    return true
  }

  /**
   * Change direction syntax to old webkit
   */
  oldDirection(params) {
    let div = this.cloneDiv(params[0])

    if (params[0][0].value !== 'to') {
      return params.unshift([
        { type: 'word', value: Gradient.oldDirections.bottom },
        div
      ])
    } else {
      let words = []
      for (let node of params[0].slice(2)) {
        if (node.type === 'word') {
          words.push(node.value.toLowerCase())
        }
      }

      words = words.join(' ')
      let old = Gradient.oldDirections[words] || words

      params[0] = [{ type: 'word', value: old }, div]
      return params[0]
    }
  }

  /**
   * Get div token from exists parameters
   */
  cloneDiv(params) {
    for (let i of params) {
      if (i.type === 'div' && i.value === ',') {
        return i
      }
    }
    return { type: 'div', value: ',', after: ' ' }
  }

  /**
   * Change colors syntax to old webkit
   */
  colorStops(params) {
    let result = []
    for (let i = 0; i < params.length; i++) {
      let pos
      let param = params[i]
      let item
      if (i === 0) {
        continue
      }

      let color = parser.stringify(param[0])
      if (param[1] && param[1].type === 'word') {
        pos = param[1].value
      } else if (param[2] && param[2].type === 'word') {
        pos = param[2].value
      }

      let stop
      if (i === 1 && (!pos || pos === '0%')) {
        stop = `from(${color})`
      } else if (i === params.length - 1 && (!pos || pos === '100%')) {
        stop = `to(${color})`
      } else if (pos) {
        stop = `color-stop(${pos}, ${color})`
      } else {
        stop = `color-stop(${color})`
      }

      let div = param[param.length - 1]
      params[i] = [{ type: 'word', value: stop }]
      if (div.type === 'div' && div.value === ',') {
        item = params[i].push(div)
      }
      result.push(item)
    }
    return result
  }

  /**
   * Remove old WebKit gradient too
   */
  old(prefix) {
    if (prefix === '-webkit-') {
      let type
      if (this.name === 'linear-gradient') {
        type = 'linear'
      } else if (this.name === 'repeating-linear-gradient') {
        type = 'repeating-linear'
      } else if (this.name === 'repeating-radial-gradient') {
        type = 'repeating-radial'
      } else {
        type = 'radial'
      }
      let string = '-gradient'
      let regexp = utils.regexp(
        `-webkit-(${type}-gradient|gradient\\(\\s*${type})`,
        false
      )

      return new OldValue(this.name, prefix + this.name, string, regexp)
    } else {
      return super.old(prefix)
    }
  }

  /**
   * Do not add non-webkit prefixes for list-style and object
   */
  add(decl, prefix) {
    let p = decl.prop
    if (p.includes('mask')) {
      if (prefix === '-webkit-' || prefix === '-webkit- old') {
        return super.add(decl, prefix)
      }
    } else if (
      p === 'list-style' ||
      p === 'list-style-image' ||
      p === 'content'
    ) {
      if (prefix === '-webkit-' || prefix === '-webkit- old') {
        return super.add(decl, prefix)
      }
    } else {
      return super.add(decl, prefix)
    }
    return undefined
  }
}

Gradient.names = [
  'linear-gradient',
  'repeating-linear-gradient',
  'radial-gradient',
  'repeating-radial-gradient'
]

Gradient.directions = {
  top: 'bottom', // default value
  left: 'right',
  bottom: 'top',
  right: 'left'
}

// Direction to replace
Gradient.oldDirections = {
  'top': 'left bottom, left top',
  'left': 'right top, left top',
  'bottom': 'left top, left bottom',
  'right': 'left top, right top',

  'top right': 'left bottom, right top',
  'top left': 'right bottom, left top',
  'right top': 'left bottom, right top',
  'right bottom': 'left top, right bottom',
  'bottom right': 'left top, right bottom',
  'bottom left': 'right top, left bottom',
  'left top': 'right bottom, left top',
  'left bottom': 'right top, left bottom'
}

module.exports = Gradient

}, function(modId) { var map = {"../old-value":1679975014145,"../value":1679975014144,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014202, function(require, module, exports) {
let OldValue = require('../old-value')
let Value = require('../value')

function regexp(name) {
  return new RegExp(`(^|[\\s,(])(${name}($|[\\s),]))`, 'gi')
}

class Intrinsic extends Value {
  regexp() {
    if (!this.regexpCache) this.regexpCache = regexp(this.name)
    return this.regexpCache
  }

  isStretch() {
    return (
      this.name === 'stretch' ||
      this.name === 'fill' ||
      this.name === 'fill-available'
    )
  }

  replace(string, prefix) {
    if (prefix === '-moz-' && this.isStretch()) {
      return string.replace(this.regexp(), '$1-moz-available$3')
    }
    if (prefix === '-webkit-' && this.isStretch()) {
      return string.replace(this.regexp(), '$1-webkit-fill-available$3')
    }
    return super.replace(string, prefix)
  }

  old(prefix) {
    let prefixed = prefix + this.name
    if (this.isStretch()) {
      if (prefix === '-moz-') {
        prefixed = '-moz-available'
      } else if (prefix === '-webkit-') {
        prefixed = '-webkit-fill-available'
      }
    }
    return new OldValue(this.name, prefixed, prefixed, regexp(prefixed))
  }

  add(decl, prefix) {
    if (decl.prop.includes('grid') && prefix !== '-webkit-') {
      return undefined
    }
    return super.add(decl, prefix)
  }
}

Intrinsic.names = [
  'max-content',
  'min-content',
  'fit-content',
  'fill',
  'fill-available',
  'stretch'
]

module.exports = Intrinsic

}, function(modId) { var map = {"../old-value":1679975014145,"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014203, function(require, module, exports) {
let OldValue = require('../old-value')
let Value = require('../value')

class Pixelated extends Value {
  /**
   * Use non-standard name for WebKit and Firefox
   */
  replace(string, prefix) {
    if (prefix === '-webkit-') {
      return string.replace(this.regexp(), '$1-webkit-optimize-contrast')
    }
    if (prefix === '-moz-') {
      return string.replace(this.regexp(), '$1-moz-crisp-edges')
    }
    return super.replace(string, prefix)
  }

  /**
   * Different name for WebKit and Firefox
   */
  old(prefix) {
    if (prefix === '-webkit-') {
      return new OldValue(this.name, '-webkit-optimize-contrast')
    }
    if (prefix === '-moz-') {
      return new OldValue(this.name, '-moz-crisp-edges')
    }
    return super.old(prefix)
  }
}

Pixelated.names = ['pixelated']

module.exports = Pixelated

}, function(modId) { var map = {"../old-value":1679975014145,"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014204, function(require, module, exports) {
let Value = require('../value')

class ImageSet extends Value {
  /**
   * Use non-standard name for WebKit and Firefox
   */
  replace(string, prefix) {
    let fixed = super.replace(string, prefix)
    if (prefix === '-webkit-') {
      fixed = fixed.replace(/("[^"]+"|'[^']+')(\s+\d+\w)/gi, 'url($1)$2')
    }
    return fixed
  }
}

ImageSet.names = ['image-set']

module.exports = ImageSet

}, function(modId) { var map = {"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014205, function(require, module, exports) {
let list = require('postcss').list

let Value = require('../value')

class CrossFade extends Value {
  replace(string, prefix) {
    return list
      .space(string)
      .map(value => {
        if (value.slice(0, +this.name.length + 1) !== this.name + '(') {
          return value
        }

        let close = value.lastIndexOf(')')
        let after = value.slice(close + 1)
        let args = value.slice(this.name.length + 1, close)

        if (prefix === '-webkit-') {
          let match = args.match(/\d*.?\d+%?/)
          if (match) {
            args = args.slice(match[0].length).trim()
            args += `, ${match[0]}`
          } else {
            args += ', 0.5'
          }
        }
        return prefix + this.name + '(' + args + ')' + after
      })
      .join(' ')
  }
}

CrossFade.names = ['cross-fade']

module.exports = CrossFade

}, function(modId) { var map = {"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014206, function(require, module, exports) {
let flexSpec = require('./flex-spec')
let OldValue = require('../old-value')
let Value = require('../value')

class DisplayFlex extends Value {
  constructor(name, prefixes) {
    super(name, prefixes)
    if (name === 'display-flex') {
      this.name = 'flex'
    }
  }

  /**
   * Faster check for flex value
   */
  check(decl) {
    return decl.prop === 'display' && decl.value === this.name
  }

  /**
   * Return value by spec
   */
  prefixed(prefix) {
    let spec, value
    ;[spec, prefix] = flexSpec(prefix)

    if (spec === 2009) {
      if (this.name === 'flex') {
        value = 'box'
      } else {
        value = 'inline-box'
      }
    } else if (spec === 2012) {
      if (this.name === 'flex') {
        value = 'flexbox'
      } else {
        value = 'inline-flexbox'
      }
    } else if (spec === 'final') {
      value = this.name
    }

    return prefix + value
  }

  /**
   * Add prefix to value depend on flebox spec version
   */
  replace(string, prefix) {
    return this.prefixed(prefix)
  }

  /**
   * Change value for old specs
   */
  old(prefix) {
    let prefixed = this.prefixed(prefix)
    if (!prefixed) return undefined
    return new OldValue(this.name, prefixed)
  }
}

DisplayFlex.names = ['display-flex', 'inline-flex']

module.exports = DisplayFlex

}, function(modId) { var map = {"./flex-spec":1679975014157,"../old-value":1679975014145,"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014207, function(require, module, exports) {
let Value = require('../value')

class DisplayGrid extends Value {
  constructor(name, prefixes) {
    super(name, prefixes)
    if (name === 'display-grid') {
      this.name = 'grid'
    }
  }

  /**
   * Faster check for flex value
   */
  check(decl) {
    return decl.prop === 'display' && decl.value === this.name
  }
}

DisplayGrid.names = ['display-grid', 'inline-grid']

module.exports = DisplayGrid

}, function(modId) { var map = {"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014208, function(require, module, exports) {
let Value = require('../value')

class FilterValue extends Value {
  constructor(name, prefixes) {
    super(name, prefixes)
    if (name === 'filter-function') {
      this.name = 'filter'
    }
  }
}

FilterValue.names = ['filter', 'filter-function']

module.exports = FilterValue

}, function(modId) { var map = {"../value":1679975014144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014209, function(require, module, exports) {
let Selector = require('../selector')
let utils = require('../utils')

class Autofill extends Selector {
  constructor(name, prefixes, all) {
    super(name, prefixes, all)

    if (this.prefixes) {
      this.prefixes = utils.uniq(this.prefixes.map(() => '-webkit-'))
    }
  }

  /**
   * Return different selectors depend on prefix
   */
  prefixed(prefix) {
    if (prefix === '-webkit-') {
      return ':-webkit-autofill'
    }
    return `:${prefix}autofill`
  }
}

Autofill.names = [':autofill']

module.exports = Autofill

}, function(modId) { var map = {"../selector":1679975014149,"../utils":1679975014136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014210, function(require, module, exports) {
let unpack = require('caniuse-lite/dist/unpacker/feature')

function browsersSort(a, b) {
  a = a.split(' ')
  b = b.split(' ')
  if (a[0] > b[0]) {
    return 1
  } else if (a[0] < b[0]) {
    return -1
  } else {
    return Math.sign(parseFloat(a[1]) - parseFloat(b[1]))
  }
}

// Convert Can I Use data
function f(data, opts, callback) {
  data = unpack(data)

  if (!callback) {
    ;[callback, opts] = [opts, {}]
  }

  let match = opts.match || /\sx($|\s)/
  let need = []

  for (let browser in data.stats) {
    let versions = data.stats[browser]
    for (let version in versions) {
      let support = versions[version]
      if (support.match(match)) {
        need.push(browser + ' ' + version)
      }
    }
  }

  callback(need.sort(browsersSort))
}

// Add data for all properties
let result = {}

function prefix(names, data) {
  for (let name of names) {
    result[name] = Object.assign({}, data)
  }
}

function add(names, data) {
  for (let name of names) {
    result[name].browsers = result[name].browsers
      .concat(data.browsers)
      .sort(browsersSort)
  }
}

module.exports = result

// Border Radius
let prefixBorderRadius = require('caniuse-lite/data/features/border-radius')

f(prefixBorderRadius, browsers =>
  prefix(
    [
      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius'
    ],
    {
      mistakes: ['-khtml-', '-ms-', '-o-'],
      feature: 'border-radius',
      browsers
    }
  )
)

// Box Shadow
let prefixBoxshadow = require('caniuse-lite/data/features/css-boxshadow')

f(prefixBoxshadow, browsers =>
  prefix(['box-shadow'], {
    mistakes: ['-khtml-'],
    feature: 'css-boxshadow',
    browsers
  })
)

// Animation
let prefixAnimation = require('caniuse-lite/data/features/css-animation')

f(prefixAnimation, browsers =>
  prefix(
    [
      'animation',
      'animation-name',
      'animation-duration',
      'animation-delay',
      'animation-direction',
      'animation-fill-mode',
      'animation-iteration-count',
      'animation-play-state',
      'animation-timing-function',
      '@keyframes'
    ],
    {
      mistakes: ['-khtml-', '-ms-'],
      feature: 'css-animation',
      browsers
    }
  )
)

// Transition
let prefixTransition = require('caniuse-lite/data/features/css-transitions')

f(prefixTransition, browsers =>
  prefix(
    [
      'transition',
      'transition-property',
      'transition-duration',
      'transition-delay',
      'transition-timing-function'
    ],
    {
      mistakes: ['-khtml-', '-ms-'],
      browsers,
      feature: 'css-transitions'
    }
  )
)

// Transform 2D
let prefixTransform2d = require('caniuse-lite/data/features/transforms2d')

f(prefixTransform2d, browsers =>
  prefix(['transform', 'transform-origin'], {
    feature: 'transforms2d',
    browsers
  })
)

// Transform 3D
let prefixTransforms3d = require('caniuse-lite/data/features/transforms3d')

f(prefixTransforms3d, browsers => {
  prefix(['perspective', 'perspective-origin'], {
    feature: 'transforms3d',
    browsers
  })
  return prefix(['transform-style'], {
    mistakes: ['-ms-', '-o-'],
    browsers,
    feature: 'transforms3d'
  })
})

f(prefixTransforms3d, { match: /y\sx|y\s#2/ }, browsers =>
  prefix(['backface-visibility'], {
    mistakes: ['-ms-', '-o-'],
    feature: 'transforms3d',
    browsers
  })
)

// Gradients
let prefixGradients = require('caniuse-lite/data/features/css-gradients')

f(prefixGradients, { match: /y\sx/ }, browsers =>
  prefix(
    [
      'linear-gradient',
      'repeating-linear-gradient',
      'radial-gradient',
      'repeating-radial-gradient'
    ],
    {
      props: [
        'background',
        'background-image',
        'border-image',
        'mask',
        'list-style',
        'list-style-image',
        'content',
        'mask-image'
      ],
      mistakes: ['-ms-'],
      feature: 'css-gradients',
      browsers
    }
  )
)

f(prefixGradients, { match: /a\sx/ }, browsers => {
  browsers = browsers.map(i => {
    if (/firefox|op/.test(i)) {
      return i
    } else {
      return `${i} old`
    }
  })
  return add(
    [
      'linear-gradient',
      'repeating-linear-gradient',
      'radial-gradient',
      'repeating-radial-gradient'
    ],
    {
      feature: 'css-gradients',
      browsers
    }
  )
})

// Box sizing
let prefixBoxsizing = require('caniuse-lite/data/features/css3-boxsizing')

f(prefixBoxsizing, browsers =>
  prefix(['box-sizing'], {
    feature: 'css3-boxsizing',
    browsers
  })
)

// Filter Effects
let prefixFilters = require('caniuse-lite/data/features/css-filters')

f(prefixFilters, browsers =>
  prefix(['filter'], {
    feature: 'css-filters',
    browsers
  })
)

// filter() function
let prefixFilterFunction = require('caniuse-lite/data/features/css-filter-function')

f(prefixFilterFunction, browsers =>
  prefix(['filter-function'], {
    props: [
      'background',
      'background-image',
      'border-image',
      'mask',
      'list-style',
      'list-style-image',
      'content',
      'mask-image'
    ],
    feature: 'css-filter-function',
    browsers
  })
)

// Backdrop-filter
let prefixBackdrop = require('caniuse-lite/data/features/css-backdrop-filter')

f(prefixBackdrop, { match: /y\sx|y\s#2/ }, browsers =>
  prefix(['backdrop-filter'], {
    feature: 'css-backdrop-filter',
    browsers
  })
)

// element() function
let prefixElementFunction = require('caniuse-lite/data/features/css-element-function')

f(prefixElementFunction, browsers =>
  prefix(['element'], {
    props: [
      'background',
      'background-image',
      'border-image',
      'mask',
      'list-style',
      'list-style-image',
      'content',
      'mask-image'
    ],
    feature: 'css-element-function',
    browsers
  })
)

// Multicolumns
let prefixMulticolumns = require('caniuse-lite/data/features/multicolumn')

f(prefixMulticolumns, browsers => {
  prefix(
    [
      'columns',
      'column-width',
      'column-gap',
      'column-rule',
      'column-rule-color',
      'column-rule-width',
      'column-count',
      'column-rule-style',
      'column-span',
      'column-fill'
    ],
    {
      feature: 'multicolumn',
      browsers
    }
  )

  let noff = browsers.filter(i => !/firefox/.test(i))
  prefix(['break-before', 'break-after', 'break-inside'], {
    feature: 'multicolumn',
    browsers: noff
  })
})

// User select
let prefixUserSelect = require('caniuse-lite/data/features/user-select-none')

f(prefixUserSelect, browsers =>
  prefix(['user-select'], {
    mistakes: ['-khtml-'],
    feature: 'user-select-none',
    browsers
  })
)

// Flexible Box Layout
let prefixFlexbox = require('caniuse-lite/data/features/flexbox')

f(prefixFlexbox, { match: /a\sx/ }, browsers => {
  browsers = browsers.map(i => {
    if (/ie|firefox/.test(i)) {
      return i
    } else {
      return `${i} 2009`
    }
  })
  prefix(['display-flex', 'inline-flex'], {
    props: ['display'],
    feature: 'flexbox',
    browsers
  })
  prefix(['flex', 'flex-grow', 'flex-shrink', 'flex-basis'], {
    feature: 'flexbox',
    browsers
  })
  prefix(
    [
      'flex-direction',
      'flex-wrap',
      'flex-flow',
      'justify-content',
      'order',
      'align-items',
      'align-self',
      'align-content'
    ],
    {
      feature: 'flexbox',
      browsers
    }
  )
})

f(prefixFlexbox, { match: /y\sx/ }, browsers => {
  add(['display-flex', 'inline-flex'], {
    feature: 'flexbox',
    browsers
  })
  add(['flex', 'flex-grow', 'flex-shrink', 'flex-basis'], {
    feature: 'flexbox',
    browsers
  })
  add(
    [
      'flex-direction',
      'flex-wrap',
      'flex-flow',
      'justify-content',
      'order',
      'align-items',
      'align-self',
      'align-content'
    ],
    {
      feature: 'flexbox',
      browsers
    }
  )
})

// calc() unit
let prefixCalc = require('caniuse-lite/data/features/calc')

f(prefixCalc, browsers =>
  prefix(['calc'], {
    props: ['*'],
    feature: 'calc',
    browsers
  })
)

// Background options
let prefixBackgroundOptions = require('caniuse-lite/data/features/background-img-opts')

f(prefixBackgroundOptions, browsers =>
  prefix(['background-origin', 'background-size'], {
    feature: 'background-img-opts',
    browsers
  })
)

// background-clip: text
let prefixBackgroundClipText = require('caniuse-lite/data/features/background-clip-text')

f(prefixBackgroundClipText, browsers =>
  prefix(['background-clip'], {
    feature: 'background-clip-text',
    browsers
  })
)

// Font feature settings
let prefixFontFeature = require('caniuse-lite/data/features/font-feature')

f(prefixFontFeature, browsers =>
  prefix(
    [
      'font-feature-settings',
      'font-variant-ligatures',
      'font-language-override'
    ],
    {
      feature: 'font-feature',
      browsers
    }
  )
)

// CSS font-kerning property
let prefixFontKerning = require('caniuse-lite/data/features/font-kerning')

f(prefixFontKerning, browsers =>
  prefix(['font-kerning'], {
    feature: 'font-kerning',
    browsers
  })
)

// Border image
let prefixBorderImage = require('caniuse-lite/data/features/border-image')

f(prefixBorderImage, browsers =>
  prefix(['border-image'], {
    feature: 'border-image',
    browsers
  })
)

// Selection selector
let prefixSelection = require('caniuse-lite/data/features/css-selection')

f(prefixSelection, browsers =>
  prefix(['::selection'], {
    selector: true,
    feature: 'css-selection',
    browsers
  })
)

// Placeholder selector
let prefixPlaceholder = require('caniuse-lite/data/features/css-placeholder')

f(prefixPlaceholder, browsers => {
  prefix(['::placeholder'], {
    selector: true,
    feature: 'css-placeholder',
    browsers: browsers.concat(['ie 10 old', 'ie 11 old', 'firefox 18 old'])
  })
})

// Placeholder-shown selector
let prefixPlaceholderShown = require('caniuse-lite/data/features/css-placeholder-shown')

f(prefixPlaceholderShown, browsers => {
  prefix([':placeholder-shown'], {
    selector: true,
    feature: 'css-placeholder-shown',
    browsers
  })
})

// Hyphenation
let prefixHyphens = require('caniuse-lite/data/features/css-hyphens')

f(prefixHyphens, browsers =>
  prefix(['hyphens'], {
    feature: 'css-hyphens',
    browsers
  })
)

// Fullscreen selector
let prefixFullscreen = require('caniuse-lite/data/features/fullscreen')

f(prefixFullscreen, browsers =>
  prefix([':fullscreen'], {
    selector: true,
    feature: 'fullscreen',
    browsers
  })
)

f(prefixFullscreen, { match: /x(\s#2|$)/ }, browsers =>
  prefix(['::backdrop'], {
    selector: true,
    feature: 'fullscreen',
    browsers
  })
)

// File selector button
let prefixFileSelectorButton = require('caniuse-lite/data/features/css-file-selector-button')

f(prefixFileSelectorButton, browsers =>
  prefix(['::file-selector-button'], {
    selector: true,
    feature: 'file-selector-button',
    browsers
  })
)

// :autofill
let prefixAutofill = require('caniuse-lite/data/features/css-autofill')

f(prefixAutofill, browsers =>
  prefix([':autofill'], {
    selector: true,
    feature: 'css-autofill',
    browsers
  })
)

// Tab size
let prefixTabsize = require('caniuse-lite/data/features/css3-tabsize')

f(prefixTabsize, browsers =>
  prefix(['tab-size'], {
    feature: 'css3-tabsize',
    browsers
  })
)

// Intrinsic & extrinsic sizing
let prefixIntrinsic = require('caniuse-lite/data/features/intrinsic-width')

let sizeProps = [
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'inline-size',
  'min-inline-size',
  'max-inline-size',
  'block-size',
  'min-block-size',
  'max-block-size',
  'grid',
  'grid-template',
  'grid-template-rows',
  'grid-template-columns',
  'grid-auto-columns',
  'grid-auto-rows'
]

f(prefixIntrinsic, browsers =>
  prefix(['max-content', 'min-content'], {
    props: sizeProps,
    feature: 'intrinsic-width',
    browsers
  })
)

f(prefixIntrinsic, { match: /x|\s#4/ }, browsers =>
  prefix(['fill', 'fill-available'], {
    props: sizeProps,
    feature: 'intrinsic-width',
    browsers
  })
)

f(prefixIntrinsic, { match: /x|\s#5/ }, browsers =>
  prefix(['fit-content'], {
    props: sizeProps,
    feature: 'intrinsic-width',
    browsers
  })
)

// Stretch value

let prefixStretch = require('caniuse-lite/data/features/css-width-stretch')

f(prefixStretch, browsers =>
  prefix(['stretch'], {
    props: sizeProps,
    feature: 'css-width-stretch',
    browsers
  })
)

// Zoom cursors
let prefixCursorsNewer = require('caniuse-lite/data/features/css3-cursors-newer')

f(prefixCursorsNewer, browsers =>
  prefix(['zoom-in', 'zoom-out'], {
    props: ['cursor'],
    feature: 'css3-cursors-newer',
    browsers
  })
)

// Grab cursors
let prefixCursorsGrab = require('caniuse-lite/data/features/css3-cursors-grab')

f(prefixCursorsGrab, browsers =>
  prefix(['grab', 'grabbing'], {
    props: ['cursor'],
    feature: 'css3-cursors-grab',
    browsers
  })
)

// Sticky position
let prefixSticky = require('caniuse-lite/data/features/css-sticky')

f(prefixSticky, browsers =>
  prefix(['sticky'], {
    props: ['position'],
    feature: 'css-sticky',
    browsers
  })
)

// Pointer Events
let prefixPointer = require('caniuse-lite/data/features/pointer')

f(prefixPointer, browsers =>
  prefix(['touch-action'], {
    feature: 'pointer',
    browsers
  })
)

// Text decoration
let prefixDecoration = require('caniuse-lite/data/features/text-decoration')

f(prefixDecoration, { match: /x.*#[235]/ }, browsers =>
  prefix(['text-decoration-skip', 'text-decoration-skip-ink'], {
    feature: 'text-decoration',
    browsers
  })
)

let prefixDecorationShorthand = require('caniuse-lite/data/features/mdn-text-decoration-shorthand')

f(prefixDecorationShorthand, browsers =>
  prefix(['text-decoration'], {
    feature: 'text-decoration',
    browsers
  })
)

let prefixDecorationColor = require('caniuse-lite/data/features/mdn-text-decoration-color')

f(prefixDecorationColor, browsers =>
  prefix(['text-decoration-color'], {
    feature: 'text-decoration',
    browsers
  })
)

let prefixDecorationLine = require('caniuse-lite/data/features/mdn-text-decoration-line')

f(prefixDecorationLine, browsers =>
  prefix(['text-decoration-line'], {
    feature: 'text-decoration',
    browsers
  })
)

let prefixDecorationStyle = require('caniuse-lite/data/features/mdn-text-decoration-style')

f(prefixDecorationStyle, browsers =>
  prefix(['text-decoration-style'], {
    feature: 'text-decoration',
    browsers
  })
)

// Text Size Adjust
let prefixTextSizeAdjust = require('caniuse-lite/data/features/text-size-adjust')

f(prefixTextSizeAdjust, browsers =>
  prefix(['text-size-adjust'], {
    feature: 'text-size-adjust',
    browsers
  })
)

// CSS Masks
let prefixCssMasks = require('caniuse-lite/data/features/css-masks')

f(prefixCssMasks, browsers => {
  prefix(
    [
      'mask-clip',
      'mask-composite',
      'mask-image',
      'mask-origin',
      'mask-repeat',
      'mask-border-repeat',
      'mask-border-source'
    ],
    {
      feature: 'css-masks',
      browsers
    }
  )
  prefix(
    [
      'mask',
      'mask-position',
      'mask-size',
      'mask-border',
      'mask-border-outset',
      'mask-border-width',
      'mask-border-slice'
    ],
    {
      feature: 'css-masks',
      browsers
    }
  )
})

// CSS clip-path property
let prefixClipPath = require('caniuse-lite/data/features/css-clip-path')

f(prefixClipPath, browsers =>
  prefix(['clip-path'], {
    feature: 'css-clip-path',
    browsers
  })
)

// Fragmented Borders and Backgrounds
let prefixBoxdecoration = require('caniuse-lite/data/features/css-boxdecorationbreak')

f(prefixBoxdecoration, browsers =>
  prefix(['box-decoration-break'], {
    feature: 'css-boxdecorationbreak',
    browsers
  })
)

// CSS3 object-fit/object-position
let prefixObjectFit = require('caniuse-lite/data/features/object-fit')

f(prefixObjectFit, browsers =>
  prefix(['object-fit', 'object-position'], {
    feature: 'object-fit',
    browsers
  })
)

// CSS Shapes
let prefixShapes = require('caniuse-lite/data/features/css-shapes')

f(prefixShapes, browsers =>
  prefix(['shape-margin', 'shape-outside', 'shape-image-threshold'], {
    feature: 'css-shapes',
    browsers
  })
)

// CSS3 text-overflow
let prefixTextOverflow = require('caniuse-lite/data/features/text-overflow')

f(prefixTextOverflow, browsers =>
  prefix(['text-overflow'], {
    feature: 'text-overflow',
    browsers
  })
)

// Viewport at-rule
let prefixDeviceadaptation = require('caniuse-lite/data/features/css-deviceadaptation')

f(prefixDeviceadaptation, browsers =>
  prefix(['@viewport'], {
    feature: 'css-deviceadaptation',
    browsers
  })
)

// Resolution Media Queries
let prefixResolut = require('caniuse-lite/data/features/css-media-resolution')

f(prefixResolut, { match: /( x($| )|a #2)/ }, browsers =>
  prefix(['@resolution'], {
    feature: 'css-media-resolution',
    browsers
  })
)

// CSS text-align-last
let prefixTextAlignLast = require('caniuse-lite/data/features/css-text-align-last')

f(prefixTextAlignLast, browsers =>
  prefix(['text-align-last'], {
    feature: 'css-text-align-last',
    browsers
  })
)

// Crisp Edges Image Rendering Algorithm
let prefixCrispedges = require('caniuse-lite/data/features/css-crisp-edges')

f(prefixCrispedges, { match: /y x|a x #1/ }, browsers =>
  prefix(['pixelated'], {
    props: ['image-rendering'],
    feature: 'css-crisp-edges',
    browsers
  })
)

f(prefixCrispedges, { match: /a x #2/ }, browsers =>
  prefix(['image-rendering'], {
    feature: 'css-crisp-edges',
    browsers
  })
)

// Logical Properties
let prefixLogicalProps = require('caniuse-lite/data/features/css-logical-props')

f(prefixLogicalProps, browsers =>
  prefix(
    [
      'border-inline-start',
      'border-inline-end',
      'margin-inline-start',
      'margin-inline-end',
      'padding-inline-start',
      'padding-inline-end'
    ],
    {
      feature: 'css-logical-props',
      browsers
    }
  )
)

f(prefixLogicalProps, { match: /x\s#2/ }, browsers =>
  prefix(
    [
      'border-block-start',
      'border-block-end',
      'margin-block-start',
      'margin-block-end',
      'padding-block-start',
      'padding-block-end'
    ],
    {
      feature: 'css-logical-props',
      browsers
    }
  )
)

// CSS appearance
let prefixAppearance = require('caniuse-lite/data/features/css-appearance')

f(prefixAppearance, { match: /#2|x/ }, browsers =>
  prefix(['appearance'], {
    feature: 'css-appearance',
    browsers
  })
)

// CSS Scroll snap points
let prefixSnappoints = require('caniuse-lite/data/features/css-snappoints')

f(prefixSnappoints, browsers =>
  prefix(
    [
      'scroll-snap-type',
      'scroll-snap-coordinate',
      'scroll-snap-destination',
      'scroll-snap-points-x',
      'scroll-snap-points-y'
    ],
    {
      feature: 'css-snappoints',
      browsers
    }
  )
)

// CSS Regions
let prefixRegions = require('caniuse-lite/data/features/css-regions')

f(prefixRegions, browsers =>
  prefix(['flow-into', 'flow-from', 'region-fragment'], {
    feature: 'css-regions',
    browsers
  })
)

// CSS image-set
let prefixImageSet = require('caniuse-lite/data/features/css-image-set')

f(prefixImageSet, browsers =>
  prefix(['image-set'], {
    props: [
      'background',
      'background-image',
      'border-image',
      'cursor',
      'mask',
      'mask-image',
      'list-style',
      'list-style-image',
      'content'
    ],
    feature: 'css-image-set',
    browsers
  })
)

// Writing Mode
let prefixWritingMode = require('caniuse-lite/data/features/css-writing-mode')

f(prefixWritingMode, { match: /a|x/ }, browsers =>
  prefix(['writing-mode'], {
    feature: 'css-writing-mode',
    browsers
  })
)

// Cross-Fade Function
let prefixCrossFade = require('caniuse-lite/data/features/css-cross-fade')

f(prefixCrossFade, browsers =>
  prefix(['cross-fade'], {
    props: [
      'background',
      'background-image',
      'border-image',
      'mask',
      'list-style',
      'list-style-image',
      'content',
      'mask-image'
    ],
    feature: 'css-cross-fade',
    browsers
  })
)

// Read Only selector
let prefixReadOnly = require('caniuse-lite/data/features/css-read-only-write')

f(prefixReadOnly, browsers =>
  prefix([':read-only', ':read-write'], {
    selector: true,
    feature: 'css-read-only-write',
    browsers
  })
)

// Text Emphasize
let prefixTextEmphasis = require('caniuse-lite/data/features/text-emphasis')

f(prefixTextEmphasis, browsers =>
  prefix(
    [
      'text-emphasis',
      'text-emphasis-position',
      'text-emphasis-style',
      'text-emphasis-color'
    ],
    {
      feature: 'text-emphasis',
      browsers
    }
  )
)

// CSS Grid Layout
let prefixGrid = require('caniuse-lite/data/features/css-grid')

f(prefixGrid, browsers => {
  prefix(['display-grid', 'inline-grid'], {
    props: ['display'],
    feature: 'css-grid',
    browsers
  })
  prefix(
    [
      'grid-template-columns',
      'grid-template-rows',
      'grid-row-start',
      'grid-column-start',
      'grid-row-end',
      'grid-column-end',
      'grid-row',
      'grid-column',
      'grid-area',
      'grid-template',
      'grid-template-areas',
      'place-self'
    ],
    {
      feature: 'css-grid',
      browsers
    }
  )
})

f(prefixGrid, { match: /a x/ }, browsers =>
  prefix(['grid-column-align', 'grid-row-align'], {
    feature: 'css-grid',
    browsers
  })
)

// CSS text-spacing
let prefixTextSpacing = require('caniuse-lite/data/features/css-text-spacing')

f(prefixTextSpacing, browsers =>
  prefix(['text-spacing'], {
    feature: 'css-text-spacing',
    browsers
  })
)

// :any-link selector
let prefixAnyLink = require('caniuse-lite/data/features/css-any-link')

f(prefixAnyLink, browsers =>
  prefix([':any-link'], {
    selector: true,
    feature: 'css-any-link',
    browsers
  })
)

// unicode-bidi

let bidiIsolate = require('caniuse-lite/data/features/mdn-css-unicode-bidi-isolate')

f(bidiIsolate, browsers =>
  prefix(['isolate'], {
    props: ['unicode-bidi'],
    feature: 'css-unicode-bidi',
    browsers
  })
)

let bidiPlaintext = require('caniuse-lite/data/features/mdn-css-unicode-bidi-plaintext')

f(bidiPlaintext, browsers =>
  prefix(['plaintext'], {
    props: ['unicode-bidi'],
    feature: 'css-unicode-bidi',
    browsers
  })
)

let bidiOverride = require('caniuse-lite/data/features/mdn-css-unicode-bidi-isolate-override')

f(bidiOverride, { match: /y x/ }, browsers =>
  prefix(['isolate-override'], {
    props: ['unicode-bidi'],
    feature: 'css-unicode-bidi',
    browsers
  })
)

// overscroll-behavior selector
let prefixOverscroll = require('caniuse-lite/data/features/css-overscroll-behavior')

f(prefixOverscroll, { match: /a #1/ }, browsers =>
  prefix(['overscroll-behavior'], {
    feature: 'css-overscroll-behavior',
    browsers
  })
)

// text-orientation
let prefixTextOrientation = require('caniuse-lite/data/features/css-text-orientation')

f(prefixTextOrientation, browsers =>
  prefix(['text-orientation'], {
    feature: 'css-text-orientation',
    browsers
  })
)

// print-color-adjust
let prefixPrintAdjust = require('caniuse-lite/data/features/css-print-color-adjust')

f(prefixPrintAdjust, browsers =>
  prefix(['print-color-adjust', 'color-adjust'], {
    feature: 'css-print-color-adjust',
    browsers
  })
)

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975014211, function(require, module, exports) {
let browserslist = require('browserslist')

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

const NAMES = {
  ie: 'IE',
  ie_mob: 'IE Mobile',
  ios_saf: 'iOS Safari',
  op_mini: 'Opera Mini',
  op_mob: 'Opera Mobile',
  and_chr: 'Chrome for Android',
  and_ff: 'Firefox for Android',
  and_uc: 'UC for Android',
  and_qq: 'QQ Browser',
  kaios: 'KaiOS Browser',
  baidu: 'Baidu Browser',
  samsung: 'Samsung Internet'
}

function prefix(name, prefixes, note) {
  let out = `  ${name}`
  if (note) out += ' *'
  out += ': '
  out += prefixes.map(i => i.replace(/^-(.*)-$/g, '$1')).join(', ')
  out += '\n'
  return out
}

module.exports = function (prefixes) {
  if (prefixes.browsers.selected.length === 0) {
    return 'No browsers selected'
  }

  let versions = {}
  for (let browser of prefixes.browsers.selected) {
    let parts = browser.split(' ')
    let name = parts[0]
    let version = parts[1]

    name = NAMES[name] || capitalize(name)
    if (versions[name]) {
      versions[name].push(version)
    } else {
      versions[name] = [version]
    }
  }

  let out = 'Browsers:\n'
  for (let browser in versions) {
    let list = versions[browser]
    list = list.sort((a, b) => parseFloat(b) - parseFloat(a))
    out += `  ${browser}: ${list.join(', ')}\n`
  }

  let coverage = browserslist.coverage(prefixes.browsers.selected)
  let round = Math.round(coverage * 100) / 100.0
  out += `\nThese browsers account for ${round}% of all users globally\n`

  let atrules = []
  for (let name in prefixes.add) {
    let data = prefixes.add[name]
    if (name[0] === '@' && data.prefixes) {
      atrules.push(prefix(name, data.prefixes))
    }
  }
  if (atrules.length > 0) {
    out += `\nAt-Rules:\n${atrules.sort().join('')}`
  }

  let selectors = []
  for (let selector of prefixes.add.selectors) {
    if (selector.prefixes) {
      selectors.push(prefix(selector.name, selector.prefixes))
    }
  }
  if (selectors.length > 0) {
    out += `\nSelectors:\n${selectors.sort().join('')}`
  }

  let values = []
  let props = []
  let hadGrid = false
  for (let name in prefixes.add) {
    let data = prefixes.add[name]
    if (name[0] !== '@' && data.prefixes) {
      let grid = name.indexOf('grid-') === 0
      if (grid) hadGrid = true
      props.push(prefix(name, data.prefixes, grid))
    }

    if (!Array.isArray(data.values)) {
      continue
    }
    for (let value of data.values) {
      let grid = value.name.includes('grid')
      if (grid) hadGrid = true
      let string = prefix(value.name, value.prefixes, grid)
      if (!values.includes(string)) {
        values.push(string)
      }
    }
  }

  if (props.length > 0) {
    out += `\nProperties:\n${props.sort().join('')}`
  }
  if (values.length > 0) {
    out += `\nValues:\n${values.sort().join('')}`
  }
  if (hadGrid) {
    out += '\n* - Prefixes will be added only on grid: true option.\n'
  }

  if (!atrules.length && !selectors.length && !props.length && !values.length) {
    out +=
      "\nAwesome! Your browsers don't require any vendor prefixes." +
      '\nNow you can remove Autoprefixer from build steps.'
  }

  return out
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975014134);
})()
//miniprogram-npm-outsideDeps=["browserslist","caniuse-lite/dist/unpacker/agents","picocolors","postcss","fraction.js","postcss-value-parser","caniuse-lite/data/features/css-featurequeries.js","caniuse-lite/dist/unpacker/feature","normalize-range","caniuse-lite/data/features/border-radius","caniuse-lite/data/features/css-boxshadow","caniuse-lite/data/features/css-animation","caniuse-lite/data/features/css-transitions","caniuse-lite/data/features/transforms2d","caniuse-lite/data/features/transforms3d","caniuse-lite/data/features/css-gradients","caniuse-lite/data/features/css3-boxsizing","caniuse-lite/data/features/css-filters","caniuse-lite/data/features/css-filter-function","caniuse-lite/data/features/css-backdrop-filter","caniuse-lite/data/features/css-element-function","caniuse-lite/data/features/multicolumn","caniuse-lite/data/features/user-select-none","caniuse-lite/data/features/flexbox","caniuse-lite/data/features/calc","caniuse-lite/data/features/background-img-opts","caniuse-lite/data/features/background-clip-text","caniuse-lite/data/features/font-feature","caniuse-lite/data/features/font-kerning","caniuse-lite/data/features/border-image","caniuse-lite/data/features/css-selection","caniuse-lite/data/features/css-placeholder","caniuse-lite/data/features/css-placeholder-shown","caniuse-lite/data/features/css-hyphens","caniuse-lite/data/features/fullscreen","caniuse-lite/data/features/css-file-selector-button","caniuse-lite/data/features/css-autofill","caniuse-lite/data/features/css3-tabsize","caniuse-lite/data/features/intrinsic-width","caniuse-lite/data/features/css-width-stretch","caniuse-lite/data/features/css3-cursors-newer","caniuse-lite/data/features/css3-cursors-grab","caniuse-lite/data/features/css-sticky","caniuse-lite/data/features/pointer","caniuse-lite/data/features/text-decoration","caniuse-lite/data/features/mdn-text-decoration-shorthand","caniuse-lite/data/features/mdn-text-decoration-color","caniuse-lite/data/features/mdn-text-decoration-line","caniuse-lite/data/features/mdn-text-decoration-style","caniuse-lite/data/features/text-size-adjust","caniuse-lite/data/features/css-masks","caniuse-lite/data/features/css-clip-path","caniuse-lite/data/features/css-boxdecorationbreak","caniuse-lite/data/features/object-fit","caniuse-lite/data/features/css-shapes","caniuse-lite/data/features/text-overflow","caniuse-lite/data/features/css-deviceadaptation","caniuse-lite/data/features/css-media-resolution","caniuse-lite/data/features/css-text-align-last","caniuse-lite/data/features/css-crisp-edges","caniuse-lite/data/features/css-logical-props","caniuse-lite/data/features/css-appearance","caniuse-lite/data/features/css-snappoints","caniuse-lite/data/features/css-regions","caniuse-lite/data/features/css-image-set","caniuse-lite/data/features/css-writing-mode","caniuse-lite/data/features/css-cross-fade","caniuse-lite/data/features/css-read-only-write","caniuse-lite/data/features/text-emphasis","caniuse-lite/data/features/css-grid","caniuse-lite/data/features/css-text-spacing","caniuse-lite/data/features/css-any-link","caniuse-lite/data/features/mdn-css-unicode-bidi-isolate","caniuse-lite/data/features/mdn-css-unicode-bidi-plaintext","caniuse-lite/data/features/mdn-css-unicode-bidi-isolate-override","caniuse-lite/data/features/css-overscroll-behavior","caniuse-lite/data/features/css-text-orientation","caniuse-lite/data/features/css-print-color-adjust"]
//# sourceMappingURL=index.js.map