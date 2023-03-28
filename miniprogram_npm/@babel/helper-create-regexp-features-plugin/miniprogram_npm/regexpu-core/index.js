module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679974997473, function(require, module, exports) {


const generate = require('@babel/regjsgen').generate;
const parse = require('regjsparser').parse;
const regenerate = require('regenerate');
const unicodeMatchProperty = require('unicode-match-property-ecmascript');
const unicodeMatchPropertyValue = require('unicode-match-property-value-ecmascript');
const iuMappings = require('./data/iu-mappings.js');
const ESCAPE_SETS = require('./data/character-class-escape-sets.js');

function flatMap(array, callback) {
	const result = [];
	array.forEach(item => {
		const res = callback(item);
		if (Array.isArray(res)) {
			result.push.apply(result, res);
		} else {
			result.push(res);
		}
	});
	return result;
}

const SPECIAL_CHARS = /([\\^$.*+?()[\]{}|])/g;

// Prepare a Regenerate set containing all code points, used for negative
// character classes (if any).
const UNICODE_SET = regenerate().addRange(0x0, 0x10FFFF);

const ASTRAL_SET = regenerate().addRange(0x10000, 0x10FFFF);

const NEWLINE_SET = regenerate().add(
	// `LineTerminator`s (https://mths.be/es6#sec-line-terminators):
	0x000A, // Line Feed <LF>
	0x000D, // Carriage Return <CR>
	0x2028, // Line Separator <LS>
	0x2029  // Paragraph Separator <PS>
);

// Prepare a Regenerate set containing all code points that are supposed to be
// matched by `/./u`. https://mths.be/es6#sec-atom
const DOT_SET_UNICODE = UNICODE_SET.clone() // all Unicode code points
	.remove(NEWLINE_SET);

const getCharacterClassEscapeSet = (character, unicode, ignoreCase) => {
	if (unicode) {
		if (ignoreCase) {
			return ESCAPE_SETS.UNICODE_IGNORE_CASE.get(character);
		}
		return ESCAPE_SETS.UNICODE.get(character);
	}
	return ESCAPE_SETS.REGULAR.get(character);
};

const getUnicodeDotSet = (dotAll) => {
	return dotAll ? UNICODE_SET : DOT_SET_UNICODE;
};

const getUnicodePropertyValueSet = (property, value) => {
	const path = value ?
		`${ property }/${ value }` :
		`Binary_Property/${ property }`;
	try {
		return require(`regenerate-unicode-properties/${ path }.js`);
	} catch (exception) {
		throw new Error(
			`Failed to recognize value \`${ value }\` for property ` +
			`\`${ property }\`.`
		);
	}
};

const handleLoneUnicodePropertyNameOrValue = (value) => {
	// It could be a `General_Category` value or a binary property.
	// Note: `unicodeMatchPropertyValue` throws on invalid values.
	try {
		const property = 'General_Category';
		const category = unicodeMatchPropertyValue(property, value);
		return getUnicodePropertyValueSet(property, category);
	} catch (exception) {}
	// It’s not a `General_Category` value, so check if it’s a property
	// of strings.
	try {
		return getUnicodePropertyValueSet('Property_of_Strings', value);
	} catch (exception) {}
	// Lastly, check if it’s a binary property of single code points.
	// Note: `unicodeMatchProperty` throws on invalid properties.
	const property = unicodeMatchProperty(value);
	return getUnicodePropertyValueSet(property);
};

const getUnicodePropertyEscapeSet = (value, isNegative) => {
	const parts = value.split('=');
	const firstPart = parts[0];
	let set;
	if (parts.length == 1) {
		set = handleLoneUnicodePropertyNameOrValue(firstPart);
	} else {
		// The pattern consists of two parts, i.e. `Property=Value`.
		const property = unicodeMatchProperty(firstPart);
		const value = unicodeMatchPropertyValue(property, parts[1]);
		set = getUnicodePropertyValueSet(property, value);
	}
	if (isNegative) {
		if (set.strings) {
			throw new Error('Cannot negate Unicode property of strings');
		}
		return {
			characters: UNICODE_SET.clone().remove(set.characters),
			strings: new Set()
		};
	}
	return {
		characters: set.characters.clone(),
		strings: set.strings
			// We need to escape strings like *️⃣ to make sure that they can be safely used in unions.
			? new Set(set.strings.map(str => str.replace(SPECIAL_CHARS, '\\$1')))
			: new Set()
	};
};

const getUnicodePropertyEscapeCharacterClassData = (property, isNegative) => {
	const set = getUnicodePropertyEscapeSet(property, isNegative);
	const data = getCharacterClassEmptyData();
	data.singleChars = set.characters;
	if (set.strings.size > 0) {
		data.longStrings = set.strings;
		data.maybeIncludesStrings = true;
	}
	return data;
};

function configNeedCaseFoldAscii() {
	return !!config.modifiersData.i;
}

function configNeedCaseFoldUnicode() {
	// config.modifiersData.i : undefined | false
	if (config.modifiersData.i === false) return false;
	if (!config.transform.unicodeFlag) return false;
	return Boolean(config.modifiersData.i || config.flags.ignoreCase);
}

// Given a range of code points, add any case-folded code points in that range
// to a set.
regenerate.prototype.iuAddRange = function(min, max) {
	const $this = this;
	do {
		const folded = caseFold(min, configNeedCaseFoldAscii(), configNeedCaseFoldUnicode());
		if (folded) {
			$this.add(folded);
		}
	} while (++min <= max);
	return $this;
};
regenerate.prototype.iuRemoveRange = function(min, max) {
	const $this = this;
	do {
		const folded = caseFold(min, configNeedCaseFoldAscii(), configNeedCaseFoldUnicode());
		if (folded) {
			$this.remove(folded);
		}
	} while (++min <= max);
	return $this;
};

const update = (item, pattern) => {
	let tree = parse(pattern, config.useUnicodeFlag ? 'u' : '', {
		lookbehind: true,
		namedGroups: true,
		unicodePropertyEscape: true,
		unicodeSet: true,
		modifiers: true,
	});
	switch (tree.type) {
		case 'characterClass':
		case 'group':
		case 'value':
			// No wrapping needed.
			break;
		default:
			// Wrap the pattern in a non-capturing group.
			tree = wrap(tree, pattern);
	}
	Object.assign(item, tree);
};

const wrap = (tree, pattern) => {
	// Wrap the pattern in a non-capturing group.
	return {
		'type': 'group',
		'behavior': 'ignore',
		'body': [tree],
		'raw': `(?:${ pattern })`
	};
};

const caseFold = (codePoint, includeAscii, includeUnicode) => {
	let folded = (includeUnicode ? iuMappings.get(codePoint) : undefined) || [];
	if (typeof folded === 'number') folded = [folded];
	if (includeAscii) {
		if (codePoint >= 0x41 && codePoint <= 0x5A) {
			folded.push(codePoint + 0x20);
		} else if (codePoint >= 0x61 && codePoint <= 0x7A) {
			folded.push(codePoint - 0x20);
		}
	}
	return folded.length == 0 ? false : folded;
};

const buildHandler = (action) => {
	switch (action) {
		case 'union':
			return {
				single: (data, cp) => {
					data.singleChars.add(cp);
				},
				regSet: (data, set2) => {
					data.singleChars.add(set2);
				},
				range: (data, start, end) => {
					data.singleChars.addRange(start, end);
				},
				iuRange: (data, start, end) => {
					data.singleChars.iuAddRange(start, end);
				},
				nested: (data, nestedData) => {
					data.singleChars.add(nestedData.singleChars);
					for (const str of nestedData.longStrings) data.longStrings.add(str);
					if (nestedData.maybeIncludesStrings) data.maybeIncludesStrings = true;
				}
			};
		case 'union-negative': {
			const regSet = (data, set2) => {
				data.singleChars = UNICODE_SET.clone().remove(set2).add(data.singleChars);
			};
			return {
				single: (data, cp) => {
					const unicode = UNICODE_SET.clone();
					data.singleChars = data.singleChars.contains(cp) ? unicode : unicode.remove(cp);
				},
				regSet: regSet,
				range: (data, start, end) => {
					data.singleChars = UNICODE_SET.clone().removeRange(start, end).add(data.singleChars);
				},
				iuRange: (data, start, end) => {
					data.singleChars = UNICODE_SET.clone().iuRemoveRange(start, end).add(data.singleChars);
				},
				nested: (data, nestedData) => {
					regSet(data, nestedData.singleChars);
					if (nestedData.maybeIncludesStrings) throw new Error('ASSERTION ERROR');
				}
			};
		}
		case 'intersection': {
			const regSet = (data, set2) => {
				if (data.first) data.singleChars = set2;
				else data.singleChars.intersection(set2);
			};
			return {
				single: (data, cp) => {
					data.singleChars = data.first || data.singleChars.contains(cp) ? regenerate(cp) : regenerate();
					data.longStrings.clear();
					data.maybeIncludesStrings = false;
				},
				regSet: (data, set) => {
					regSet(data, set);
					data.longStrings.clear();
					data.maybeIncludesStrings = false;
				},
				range: (data, start, end) => {
					if (data.first) data.singleChars.addRange(start, end);
					else data.singleChars.intersection(regenerate().addRange(start, end));
					data.longStrings.clear();
					data.maybeIncludesStrings = false;
				},
				iuRange: (data, start, end) => {
					if (data.first) data.singleChars.iuAddRange(start, end);
					else data.singleChars.intersection(regenerate().iuAddRange(start, end));
					data.longStrings.clear();
					data.maybeIncludesStrings = false;
				},
				nested: (data, nestedData) => {
					regSet(data, nestedData.singleChars);

					if (data.first) {
						data.longStrings = nestedData.longStrings;
						data.maybeIncludesStrings = nestedData.maybeIncludesStrings;
					} else {
						for (const str of data.longStrings) {
							if (!nestedData.longStrings.has(str)) data.longStrings.delete(str);
						}
						if (!nestedData.maybeIncludesStrings) data.maybeIncludesStrings = false;
					}
				}
			};
		}
		case 'subtraction': {
			const regSet = (data, set2) => {
				if (data.first) data.singleChars.add(set2);
				else data.singleChars.remove(set2);
			};
			return {
				single: (data, cp) => {
					if (data.first) data.singleChars.add(cp);
					else data.singleChars.remove(cp);
				},
				regSet: regSet,
				range: (data, start, end) => {
					if (data.first) data.singleChars.addRange(start, end);
					else data.singleChars.removeRange(start, end);
				},
				iuRange: (data, start, end) => {
					if (data.first) data.singleChars.iuAddRange(start, end);
					else data.singleChars.iuRemoveRange(start, end);
				},
				nested: (data, nestedData) => {
					regSet(data, nestedData.singleChars);

					if (data.first) {
						data.longStrings = nestedData.longStrings;
						data.maybeIncludesStrings = nestedData.maybeIncludesStrings;
					} else {
						for (const str of data.longStrings) {
							if (nestedData.longStrings.has(str)) data.longStrings.delete(str);
						}
					}
				}
			};
		}
		// The `default` clause is only here as a safeguard; it should never be
		// reached. Code coverage tools should ignore it.
		/* istanbul ignore next */
		default:
			throw new Error(`Unknown set action: ${ characterClassItem.kind }`);
	}
};

const getCharacterClassEmptyData = () => ({
	transformed: config.transform.unicodeFlag,
	singleChars: regenerate(),
	longStrings: new Set(),
	hasEmptyString: false,
	first: true,
	maybeIncludesStrings: false
});

const maybeFold = (codePoint) => {
	const caseFoldAscii = configNeedCaseFoldAscii();
	const caseFoldUnicode = configNeedCaseFoldUnicode();

	if (caseFoldAscii || caseFoldUnicode) {
		const folded = caseFold(codePoint, caseFoldAscii, caseFoldUnicode);
		if (folded) {
			return [codePoint, folded];
		}
	}
	return [codePoint];
};

const computeClassStrings = (classStrings, regenerateOptions) => {
	let data = getCharacterClassEmptyData();

	const caseFoldAscii = configNeedCaseFoldAscii();
	const caseFoldUnicode = configNeedCaseFoldUnicode();

	for (const string of classStrings.strings) {
		if (string.characters.length === 1) {
			maybeFold(string.characters[0].codePoint).forEach((cp) => {
				data.singleChars.add(cp);
			});
		} else {
			let stringifiedString;
			if (caseFoldUnicode || caseFoldAscii) {
				stringifiedString = '';
				for (const ch of string.characters) {
					let set = regenerate(ch.codePoint);
					const folded = maybeFold(ch.codePoint);
					if (folded) set.add(folded);
					stringifiedString += set.toString(regenerateOptions);
				}
			} else {
				stringifiedString = string.characters.map(ch => generate(ch)).join('')
			}

			data.longStrings.add(stringifiedString);
			data.maybeIncludesStrings = true;
		}
	}

	return data;
}

const computeCharacterClass = (characterClassItem, regenerateOptions) => {
	let data = getCharacterClassEmptyData();

	let handlePositive;
	let handleNegative;

	switch (characterClassItem.kind) {
		case 'union':
			handlePositive = buildHandler('union');
			handleNegative = buildHandler('union-negative');
			break;
		case 'intersection':
			handlePositive = buildHandler('intersection');
			handleNegative = buildHandler('subtraction');
			if (config.transform.unicodeSetsFlag) data.transformed = true;
			break;
		case 'subtraction':
			handlePositive = buildHandler('subtraction');
			handleNegative = buildHandler('intersection');
			if (config.transform.unicodeSetsFlag) data.transformed = true;
			break;
		// The `default` clause is only here as a safeguard; it should never be
		// reached. Code coverage tools should ignore it.
		/* istanbul ignore next */
		default:
			throw new Error(`Unknown character class kind: ${ characterClassItem.kind }`);
	}

	const caseFoldAscii = configNeedCaseFoldAscii();
	const caseFoldUnicode = configNeedCaseFoldUnicode();

	for (const item of characterClassItem.body) {
		switch (item.type) {
			case 'value':
				maybeFold(item.codePoint).forEach((cp) => {
					handlePositive.single(data, cp);
				});
				break;
			case 'characterClassRange':
				const min = item.min.codePoint;
				const max = item.max.codePoint;
				handlePositive.range(data, min, max);
				if (caseFoldAscii || caseFoldUnicode) {
					handlePositive.iuRange(data, min, max);
					data.transformed = true;
				}
				break;
			case 'characterClassEscape':
				handlePositive.regSet(data, getCharacterClassEscapeSet(
					item.value,
					config.flags.unicode,
					config.flags.ignoreCase
				));
				break;
			case 'unicodePropertyEscape':
				const nestedData = getUnicodePropertyEscapeCharacterClassData(item.value, item.negative);
				handlePositive.nested(data, nestedData);
				data.transformed =
					data.transformed ||
					config.transform.unicodePropertyEscapes ||
					(config.transform.unicodeSetsFlag && nestedData.maybeIncludesStrings);
				break;
			case 'characterClass':
				const handler = item.negative ? handleNegative : handlePositive;
				const res = computeCharacterClass(item, regenerateOptions);
				handler.nested(data, res);
				data.transformed = true;
				break;
			case 'classStrings':
				handlePositive.nested(data, computeClassStrings(item, regenerateOptions));
				data.transformed = true;
				break;
			// The `default` clause is only here as a safeguard; it should never be
			// reached. Code coverage tools should ignore it.
			/* istanbul ignore next */
			default:
				throw new Error(`Unknown term type: ${ item.type }`);
		}

		data.first = false;
	}

	if (characterClassItem.negative && data.maybeIncludesStrings) {
		throw new SyntaxError('Cannot negate set containing strings');
	}

	return data;
}

const processCharacterClass = (
	characterClassItem,
	regenerateOptions,
	computed = computeCharacterClass(characterClassItem, regenerateOptions)
) => {
	const negative = characterClassItem.negative;
	const { singleChars, transformed, longStrings } = computed;
	if (transformed) {
		const setStr = singleChars.toString(regenerateOptions);

		if (negative) {
			if (config.useUnicodeFlag) {
				update(characterClassItem, `[^${setStr[0] === '[' ? setStr.slice(1, -1) : setStr}]`)
			} else {
				if (config.flags.unicode) {
					if (config.flags.ignoreCase) {
						const astralCharsSet = singleChars.clone().intersection(ASTRAL_SET);
						// Assumption: singleChars do not contain lone surrogates.
						// Regex like /[^\ud800]/u is not supported
						const surrogateOrBMPSetStr = singleChars
							.clone()
							.remove(astralCharsSet)
							.addRange(0xd800, 0xdfff)
							.toString({ bmpOnly: true });
						// Don't generate negative lookahead for astral characters
						// because the case folding is not working anyway as we break
						// code points into surrogate pairs.
						const astralNegativeSetStr = ASTRAL_SET
							.clone()
							.remove(astralCharsSet)
							.toString(regenerateOptions);
						// The transform here does not support lone surrogates.
						update(
							characterClassItem,
							`(?!${surrogateOrBMPSetStr})[\\s\\S]|${astralNegativeSetStr}`
						);
					} else {
						// Generate negative set directly when case folding is not involved.
						update(
							characterClassItem,
							UNICODE_SET.clone().remove(singleChars).toString(regenerateOptions)
						);
					}
				} else {
					update(characterClassItem, `(?!${setStr})[\\s\\S]`);
				}
			}
		} else {
			const hasEmptyString = longStrings.has('');
			const pieces = Array.from(longStrings).sort((a, b) => b.length - a.length);

			if (setStr !== '[]' || longStrings.size === 0) {
				pieces.splice(pieces.length - (hasEmptyString ? 1 : 0), 0, setStr);
			}

			update(characterClassItem, pieces.join('|'));
		}
	}
	return characterClassItem;
};

const assertNoUnmatchedReferences = (groups) => {
	const unmatchedReferencesNames = Object.keys(groups.unmatchedReferences);
	if (unmatchedReferencesNames.length > 0) {
		throw new Error(`Unknown group names: ${unmatchedReferencesNames}`);
	}
};

const processModifiers = (item, regenerateOptions, groups) => {
	const enabling = item.modifierFlags.enabling;
	const disabling = item.modifierFlags.disabling;

	delete item.modifierFlags;
	item.behavior = 'ignore';

	const oldData = Object.assign({}, config.modifiersData);

	enabling.split('').forEach(flag => {
		config.modifiersData[flag] = true;
	});
	disabling.split('').forEach(flag => {
		config.modifiersData[flag] = false;
	});

	item.body = item.body.map(term => {
		return processTerm(term, regenerateOptions, groups);
	});

	config.modifiersData = oldData;

	return item;
}

const processTerm = (item, regenerateOptions, groups) => {
	switch (item.type) {
		case 'dot':
			if (config.transform.unicodeFlag) {
				update(
					item,
					getUnicodeDotSet(config.flags.dotAll || config.modifiersData.s).toString(regenerateOptions)
				);
			} else if (config.transform.dotAllFlag || config.modifiersData.s) {
				// TODO: consider changing this at the regenerate level.
				update(item, '[\\s\\S]');
			}
			break;
		case 'characterClass':
			item = processCharacterClass(item, regenerateOptions);
			break;
		case 'unicodePropertyEscape':
			const data = getUnicodePropertyEscapeCharacterClassData(item.value, item.negative);
			if (data.maybeIncludesStrings) {
				if (!config.flags.unicodeSets) {
					throw new Error(
						'Properties of strings are only supported when using the unicodeSets (v) flag.'
					);
				}
				if (config.transform.unicodeSetsFlag) {
					data.transformed = true;
					item = processCharacterClass(item, regenerateOptions, data);
				}
			} else if (config.transform.unicodePropertyEscapes) {
				update(
					item,
					data.singleChars.toString(regenerateOptions)
				);
			}
			break;
		case 'characterClassEscape':
			if (config.transform.unicodeFlag) {
				update(
					item,
					getCharacterClassEscapeSet(
						item.value,
						/* config.transform.unicodeFlag implies config.flags.unicode */ true,
						config.flags.ignoreCase
					).toString(regenerateOptions)
				);
			}
			break;
		case 'group':
			if (item.behavior == 'normal') {
				groups.lastIndex++;
			}
			if (item.name) {
				const name = item.name.value;

				if (groups.namesConflicts[name]) {
					throw new Error(
						`Group '${ name }' has already been defined in this context.`
					);
				}
				groups.namesConflicts[name] = true;

				if (config.transform.namedGroups) {
					delete item.name;
				}

				const index = groups.lastIndex;
				if (!groups.names[name]) {
					groups.names[name] = [];
				}
				groups.names[name].push(index);

				if (groups.onNamedGroup) {
					groups.onNamedGroup.call(null, name, index);
				}

				if (groups.unmatchedReferences[name]) {
					delete groups.unmatchedReferences[name];
				}
			}
			if (item.modifierFlags && config.transform.modifiers) {
				return processModifiers(item, regenerateOptions, groups);
			}
			/* falls through */
		case 'quantifier':
			item.body = item.body.map(term => {
				return processTerm(term, regenerateOptions, groups);
			});
			break;
		case 'disjunction':
			const outerNamesConflicts = groups.namesConflicts;
			item.body = item.body.map(term => {
				groups.namesConflicts = Object.create(outerNamesConflicts);
				return processTerm(term, regenerateOptions, groups);
			});
			break;
		case 'alternative':
			item.body = flatMap(item.body, term => {
				const res = processTerm(term, regenerateOptions, groups);
				// Alternatives cannot contain alternatives; flatten them.
				return res.type === 'alternative' ? res.body : res;
			});
			break;
		case 'value':
			const codePoint = item.codePoint;
			const set = regenerate(codePoint);
			const folded = maybeFold(codePoint);
			set.add(folded);
			update(item, set.toString(regenerateOptions));
			break;
		case 'reference':
			if (item.name) {
				const name = item.name.value;
				const indexes = groups.names[name];
				if (!indexes) {
					groups.unmatchedReferences[name] = true;
				}

				if (config.transform.namedGroups) {
					if (indexes) {
						const body = indexes.map(index => ({
							'type': 'reference',
							'matchIndex': index,
							'raw': '\\' + index,
						}));
						if (body.length === 1) {
							return body[0];
						}
						return {
							'type': 'alternative',
							'body': body,
							'raw': body.map(term => term.raw).join(''),
						};
					}

					// This named reference comes before the group where it’s defined,
					// so it’s always an empty match.
					return {
						'type': 'group',
						'behavior': 'ignore',
						'body': [],
						'raw': '(?:)',
					};
				}
			}
			break;
		case 'anchor':
			if (config.modifiersData.m) {
				if (item.kind == 'start') {
					update(item, `(?:^|(?<=${NEWLINE_SET.toString()}))`);
				} else if (item.kind == 'end') {
					update(item, `(?:$|(?=${NEWLINE_SET.toString()}))`);
				}
			}
		case 'empty':
			// Nothing to do here.
			break;
		// The `default` clause is only here as a safeguard; it should never be
		// reached. Code coverage tools should ignore it.
		/* istanbul ignore next */
		default:
			throw new Error(`Unknown term type: ${ item.type }`);
	}
	return item;
};

const config = {
	'flags': {
		'ignoreCase': false,
		'unicode': false,
		'unicodeSets': false,
		'dotAll': false,
		'multiline': false,
	},
	'transform': {
		'dotAllFlag': false,
		'unicodeFlag': false,
		'unicodeSetsFlag': false,
		'unicodePropertyEscapes': false,
		'namedGroups': false,
		'modifiers': false,
	},
	'modifiersData': {
		'i': undefined,
		's': undefined,
		'm': undefined,
	},
	get useUnicodeFlag() {
		return (this.flags.unicode || this.flags.unicodeSets) && !this.transform.unicodeFlag;
	}
};

const validateOptions = (options) => {
	if (!options) return;

	for (const key of Object.keys(options)) {
		const value = options[key];
		switch (key) {
			case 'dotAllFlag':
			case 'unicodeFlag':
			case 'unicodePropertyEscapes':
			case 'namedGroups':
				if (value != null && value !== false && value !== 'transform') {
					throw new Error(`.${key} must be false (default) or 'transform'.`);
				}
				break;
			case 'modifiers':
			case 'unicodeSetsFlag':
				if (value != null && value !== false && value !== 'parse' && value !== 'transform') {
					throw new Error(`.${key} must be false (default), 'parse' or 'transform'.`);
				}
				break;
			case 'onNamedGroup':
			case 'onNewFlags':
				if (value != null && typeof value !== 'function') {
					throw new Error(`.${key} must be a function.`);
				}
				break;
			default:
				throw new Error(`.${key} is not a valid regexpu-core option.`);
		}
	}
};

const hasFlag = (flags, flag) => flags ? flags.includes(flag) : false;
const transform = (options, name) => options ? options[name] === 'transform' : false;

const rewritePattern = (pattern, flags, options) => {
	validateOptions(options);

	config.flags.unicode = hasFlag(flags, 'u');
	config.flags.unicodeSets = hasFlag(flags, 'v');
	config.flags.ignoreCase = hasFlag(flags, 'i');
	config.flags.dotAll = hasFlag(flags, 's');
	config.flags.multiline = hasFlag(flags, 'm');

	config.transform.dotAllFlag = config.flags.dotAll && transform(options, 'dotAllFlag');
	config.transform.unicodeFlag = (config.flags.unicode || config.flags.unicodeSets) && transform(options, 'unicodeFlag');
	config.transform.unicodeSetsFlag = config.flags.unicodeSets && transform(options, 'unicodeSetsFlag');

	// unicodeFlag: 'transform' implies unicodePropertyEscapes: 'transform'
	config.transform.unicodePropertyEscapes = config.flags.unicode && (
		transform(options, 'unicodeFlag') || transform(options, 'unicodePropertyEscapes')
	);
	config.transform.namedGroups = transform(options, 'namedGroups');
	config.transform.modifiers = transform(options, 'modifiers');

	config.modifiersData.i = undefined;
	config.modifiersData.s = undefined;
	config.modifiersData.m = undefined;

	const regjsparserFeatures = {
		'unicodeSet': Boolean(options && options.unicodeSetsFlag),
		'modifiers': Boolean(options && options.modifiers),

		// Enable every stable RegExp feature by default
		'unicodePropertyEscape': true,
		'namedGroups': true,
		'lookbehind': true,
	};

	const regenerateOptions = {
		'hasUnicodeFlag': config.useUnicodeFlag,
		'bmpOnly': !config.flags.unicode
	};

	const groups = {
		'onNamedGroup': options && options.onNamedGroup,
		'lastIndex': 0,
		'names': Object.create(null), // { [name]: Array<index> }
		'namesConflicts': Object.create(null), // { [name]: true }
		'unmatchedReferences': Object.create(null) // { [name]: true }
	};

	const tree = parse(pattern, flags, regjsparserFeatures);

	if (config.transform.modifiers) {
		if (/\(\?[a-z]*-[a-z]+:/.test(pattern)) {
			// the pattern _likely_ contain inline disabled modifiers
			// we need to traverse to make sure that they are actually modifiers and to collect them
			const allDisabledModifiers = Object.create(null)
			const itemStack = [tree];
			let node;
			while (node = itemStack.pop(), node != undefined) {
				if (Array.isArray(node)) {
					Array.prototype.push.apply(itemStack, node);
				} else if (typeof node == 'object' && node != null) {
					for (const key of Object.keys(node)) {
						const value = node[key];
						if (key == 'modifierFlags') {
							if (value.disabling.length > 0){
								value.disabling.split('').forEach((flag)=>{
									allDisabledModifiers[flag] = true
								});
							}
						} else if (typeof value == 'object' && value != null) {
							itemStack.push(value);
						}
					}
				}
			}
			for (const flag of Object.keys(allDisabledModifiers)) {
				config.modifiersData[flag] = true;
			}
		}
	}

	// Note: `processTerm` mutates `tree` and `groups`.
	processTerm(tree, regenerateOptions, groups);
	assertNoUnmatchedReferences(groups);

	const onNewFlags = options && options.onNewFlags;
	if (onNewFlags) {
		let newFlags = flags.split('').filter((flag) => !config.modifiersData[flag]).join('');
		if (config.transform.unicodeSetsFlag) {
			newFlags = newFlags.replace('v', 'u');
		}
		if (config.transform.unicodeFlag) {
			newFlags = newFlags.replace('u', '');
		}
		if (config.transform.dotAllFlag === 'transform') {
			newFlags = newFlags.replace('s', '');
		}
		onNewFlags(newFlags);
	}

	return generate(tree);
};

module.exports = rewritePattern;

}, function(modId) {var map = {"./data/iu-mappings.js":1679974997474,"./data/character-class-escape-sets.js":1679974997475}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679974997474, function(require, module, exports) {
module.exports = new Map([
	[0x4B, 0x212A],
	[0x53, 0x17F],
	[0x6B, 0x212A],
	[0x73, 0x17F],
	[0xB5, 0x39C],
	[0xC5, 0x212B],
	[0xDF, 0x1E9E],
	[0xE5, 0x212B],
	[0x17F, 0x53],
	[0x1C4, 0x1C5],
	[0x1C5, 0x1C4],
	[0x1C7, 0x1C8],
	[0x1C8, 0x1C7],
	[0x1CA, 0x1CB],
	[0x1CB, 0x1CA],
	[0x1F1, 0x1F2],
	[0x1F2, 0x1F1],
	[0x345, 0x1FBE],
	[0x392, 0x3D0],
	[0x395, 0x3F5],
	[0x398, 0x3F4],
	[0x399, 0x1FBE],
	[0x39A, 0x3F0],
	[0x39C, 0xB5],
	[0x3A0, 0x3D6],
	[0x3A1, 0x3F1],
	[0x3A3, 0x3C2],
	[0x3A6, 0x3D5],
	[0x3A9, 0x2126],
	[0x3B8, 0x3F4],
	[0x3C2, 0x3A3],
	[0x3C9, 0x2126],
	[0x3D0, 0x392],
	[0x3D1, 0x3F4],
	[0x3D5, 0x3A6],
	[0x3D6, 0x3A0],
	[0x3F0, 0x39A],
	[0x3F1, 0x3A1],
	[0x3F4, [
		0x398,
		0x3D1,
		0x3B8
	]],
	[0x3F5, 0x395],
	[0x412, 0x1C80],
	[0x414, 0x1C81],
	[0x41E, 0x1C82],
	[0x421, 0x1C83],
	[0x422, 0x1C85],
	[0x42A, 0x1C86],
	[0x462, 0x1C87],
	[0x1C80, 0x412],
	[0x1C81, 0x414],
	[0x1C82, 0x41E],
	[0x1C83, 0x421],
	[0x1C84, 0x1C85],
	[0x1C85, [
		0x422,
		0x1C84
	]],
	[0x1C86, 0x42A],
	[0x1C87, 0x462],
	[0x1C88, 0xA64A],
	[0x1E60, 0x1E9B],
	[0x1E9B, 0x1E60],
	[0x1E9E, 0xDF],
	[0x1F80, 0x1F88],
	[0x1F81, 0x1F89],
	[0x1F82, 0x1F8A],
	[0x1F83, 0x1F8B],
	[0x1F84, 0x1F8C],
	[0x1F85, 0x1F8D],
	[0x1F86, 0x1F8E],
	[0x1F87, 0x1F8F],
	[0x1F88, 0x1F80],
	[0x1F89, 0x1F81],
	[0x1F8A, 0x1F82],
	[0x1F8B, 0x1F83],
	[0x1F8C, 0x1F84],
	[0x1F8D, 0x1F85],
	[0x1F8E, 0x1F86],
	[0x1F8F, 0x1F87],
	[0x1F90, 0x1F98],
	[0x1F91, 0x1F99],
	[0x1F92, 0x1F9A],
	[0x1F93, 0x1F9B],
	[0x1F94, 0x1F9C],
	[0x1F95, 0x1F9D],
	[0x1F96, 0x1F9E],
	[0x1F97, 0x1F9F],
	[0x1F98, 0x1F90],
	[0x1F99, 0x1F91],
	[0x1F9A, 0x1F92],
	[0x1F9B, 0x1F93],
	[0x1F9C, 0x1F94],
	[0x1F9D, 0x1F95],
	[0x1F9E, 0x1F96],
	[0x1F9F, 0x1F97],
	[0x1FA0, 0x1FA8],
	[0x1FA1, 0x1FA9],
	[0x1FA2, 0x1FAA],
	[0x1FA3, 0x1FAB],
	[0x1FA4, 0x1FAC],
	[0x1FA5, 0x1FAD],
	[0x1FA6, 0x1FAE],
	[0x1FA7, 0x1FAF],
	[0x1FA8, 0x1FA0],
	[0x1FA9, 0x1FA1],
	[0x1FAA, 0x1FA2],
	[0x1FAB, 0x1FA3],
	[0x1FAC, 0x1FA4],
	[0x1FAD, 0x1FA5],
	[0x1FAE, 0x1FA6],
	[0x1FAF, 0x1FA7],
	[0x1FB3, 0x1FBC],
	[0x1FBC, 0x1FB3],
	[0x1FBE, [
		0x345,
		0x399
	]],
	[0x1FC3, 0x1FCC],
	[0x1FCC, 0x1FC3],
	[0x1FF3, 0x1FFC],
	[0x1FFC, 0x1FF3],
	[0x2126, [
		0x3A9,
		0x3C9
	]],
	[0x212A, 0x4B],
	[0x212B, [
		0xC5,
		0xE5
	]],
	[0xA64A, 0x1C88],
	[0x10400, 0x10428],
	[0x10401, 0x10429],
	[0x10402, 0x1042A],
	[0x10403, 0x1042B],
	[0x10404, 0x1042C],
	[0x10405, 0x1042D],
	[0x10406, 0x1042E],
	[0x10407, 0x1042F],
	[0x10408, 0x10430],
	[0x10409, 0x10431],
	[0x1040A, 0x10432],
	[0x1040B, 0x10433],
	[0x1040C, 0x10434],
	[0x1040D, 0x10435],
	[0x1040E, 0x10436],
	[0x1040F, 0x10437],
	[0x10410, 0x10438],
	[0x10411, 0x10439],
	[0x10412, 0x1043A],
	[0x10413, 0x1043B],
	[0x10414, 0x1043C],
	[0x10415, 0x1043D],
	[0x10416, 0x1043E],
	[0x10417, 0x1043F],
	[0x10418, 0x10440],
	[0x10419, 0x10441],
	[0x1041A, 0x10442],
	[0x1041B, 0x10443],
	[0x1041C, 0x10444],
	[0x1041D, 0x10445],
	[0x1041E, 0x10446],
	[0x1041F, 0x10447],
	[0x10420, 0x10448],
	[0x10421, 0x10449],
	[0x10422, 0x1044A],
	[0x10423, 0x1044B],
	[0x10424, 0x1044C],
	[0x10425, 0x1044D],
	[0x10426, 0x1044E],
	[0x10427, 0x1044F],
	[0x10428, 0x10400],
	[0x10429, 0x10401],
	[0x1042A, 0x10402],
	[0x1042B, 0x10403],
	[0x1042C, 0x10404],
	[0x1042D, 0x10405],
	[0x1042E, 0x10406],
	[0x1042F, 0x10407],
	[0x10430, 0x10408],
	[0x10431, 0x10409],
	[0x10432, 0x1040A],
	[0x10433, 0x1040B],
	[0x10434, 0x1040C],
	[0x10435, 0x1040D],
	[0x10436, 0x1040E],
	[0x10437, 0x1040F],
	[0x10438, 0x10410],
	[0x10439, 0x10411],
	[0x1043A, 0x10412],
	[0x1043B, 0x10413],
	[0x1043C, 0x10414],
	[0x1043D, 0x10415],
	[0x1043E, 0x10416],
	[0x1043F, 0x10417],
	[0x10440, 0x10418],
	[0x10441, 0x10419],
	[0x10442, 0x1041A],
	[0x10443, 0x1041B],
	[0x10444, 0x1041C],
	[0x10445, 0x1041D],
	[0x10446, 0x1041E],
	[0x10447, 0x1041F],
	[0x10448, 0x10420],
	[0x10449, 0x10421],
	[0x1044A, 0x10422],
	[0x1044B, 0x10423],
	[0x1044C, 0x10424],
	[0x1044D, 0x10425],
	[0x1044E, 0x10426],
	[0x1044F, 0x10427],
	[0x104B0, 0x104D8],
	[0x104B1, 0x104D9],
	[0x104B2, 0x104DA],
	[0x104B3, 0x104DB],
	[0x104B4, 0x104DC],
	[0x104B5, 0x104DD],
	[0x104B6, 0x104DE],
	[0x104B7, 0x104DF],
	[0x104B8, 0x104E0],
	[0x104B9, 0x104E1],
	[0x104BA, 0x104E2],
	[0x104BB, 0x104E3],
	[0x104BC, 0x104E4],
	[0x104BD, 0x104E5],
	[0x104BE, 0x104E6],
	[0x104BF, 0x104E7],
	[0x104C0, 0x104E8],
	[0x104C1, 0x104E9],
	[0x104C2, 0x104EA],
	[0x104C3, 0x104EB],
	[0x104C4, 0x104EC],
	[0x104C5, 0x104ED],
	[0x104C6, 0x104EE],
	[0x104C7, 0x104EF],
	[0x104C8, 0x104F0],
	[0x104C9, 0x104F1],
	[0x104CA, 0x104F2],
	[0x104CB, 0x104F3],
	[0x104CC, 0x104F4],
	[0x104CD, 0x104F5],
	[0x104CE, 0x104F6],
	[0x104CF, 0x104F7],
	[0x104D0, 0x104F8],
	[0x104D1, 0x104F9],
	[0x104D2, 0x104FA],
	[0x104D3, 0x104FB],
	[0x104D8, 0x104B0],
	[0x104D9, 0x104B1],
	[0x104DA, 0x104B2],
	[0x104DB, 0x104B3],
	[0x104DC, 0x104B4],
	[0x104DD, 0x104B5],
	[0x104DE, 0x104B6],
	[0x104DF, 0x104B7],
	[0x104E0, 0x104B8],
	[0x104E1, 0x104B9],
	[0x104E2, 0x104BA],
	[0x104E3, 0x104BB],
	[0x104E4, 0x104BC],
	[0x104E5, 0x104BD],
	[0x104E6, 0x104BE],
	[0x104E7, 0x104BF],
	[0x104E8, 0x104C0],
	[0x104E9, 0x104C1],
	[0x104EA, 0x104C2],
	[0x104EB, 0x104C3],
	[0x104EC, 0x104C4],
	[0x104ED, 0x104C5],
	[0x104EE, 0x104C6],
	[0x104EF, 0x104C7],
	[0x104F0, 0x104C8],
	[0x104F1, 0x104C9],
	[0x104F2, 0x104CA],
	[0x104F3, 0x104CB],
	[0x104F4, 0x104CC],
	[0x104F5, 0x104CD],
	[0x104F6, 0x104CE],
	[0x104F7, 0x104CF],
	[0x104F8, 0x104D0],
	[0x104F9, 0x104D1],
	[0x104FA, 0x104D2],
	[0x104FB, 0x104D3],
	[0x10570, 0x10597],
	[0x10571, 0x10598],
	[0x10572, 0x10599],
	[0x10573, 0x1059A],
	[0x10574, 0x1059B],
	[0x10575, 0x1059C],
	[0x10576, 0x1059D],
	[0x10577, 0x1059E],
	[0x10578, 0x1059F],
	[0x10579, 0x105A0],
	[0x1057A, 0x105A1],
	[0x1057C, 0x105A3],
	[0x1057D, 0x105A4],
	[0x1057E, 0x105A5],
	[0x1057F, 0x105A6],
	[0x10580, 0x105A7],
	[0x10581, 0x105A8],
	[0x10582, 0x105A9],
	[0x10583, 0x105AA],
	[0x10584, 0x105AB],
	[0x10585, 0x105AC],
	[0x10586, 0x105AD],
	[0x10587, 0x105AE],
	[0x10588, 0x105AF],
	[0x10589, 0x105B0],
	[0x1058A, 0x105B1],
	[0x1058C, 0x105B3],
	[0x1058D, 0x105B4],
	[0x1058E, 0x105B5],
	[0x1058F, 0x105B6],
	[0x10590, 0x105B7],
	[0x10591, 0x105B8],
	[0x10592, 0x105B9],
	[0x10594, 0x105BB],
	[0x10595, 0x105BC],
	[0x10597, 0x10570],
	[0x10598, 0x10571],
	[0x10599, 0x10572],
	[0x1059A, 0x10573],
	[0x1059B, 0x10574],
	[0x1059C, 0x10575],
	[0x1059D, 0x10576],
	[0x1059E, 0x10577],
	[0x1059F, 0x10578],
	[0x105A0, 0x10579],
	[0x105A1, 0x1057A],
	[0x105A3, 0x1057C],
	[0x105A4, 0x1057D],
	[0x105A5, 0x1057E],
	[0x105A6, 0x1057F],
	[0x105A7, 0x10580],
	[0x105A8, 0x10581],
	[0x105A9, 0x10582],
	[0x105AA, 0x10583],
	[0x105AB, 0x10584],
	[0x105AC, 0x10585],
	[0x105AD, 0x10586],
	[0x105AE, 0x10587],
	[0x105AF, 0x10588],
	[0x105B0, 0x10589],
	[0x105B1, 0x1058A],
	[0x105B3, 0x1058C],
	[0x105B4, 0x1058D],
	[0x105B5, 0x1058E],
	[0x105B6, 0x1058F],
	[0x105B7, 0x10590],
	[0x105B8, 0x10591],
	[0x105B9, 0x10592],
	[0x105BB, 0x10594],
	[0x105BC, 0x10595],
	[0x10C80, 0x10CC0],
	[0x10C81, 0x10CC1],
	[0x10C82, 0x10CC2],
	[0x10C83, 0x10CC3],
	[0x10C84, 0x10CC4],
	[0x10C85, 0x10CC5],
	[0x10C86, 0x10CC6],
	[0x10C87, 0x10CC7],
	[0x10C88, 0x10CC8],
	[0x10C89, 0x10CC9],
	[0x10C8A, 0x10CCA],
	[0x10C8B, 0x10CCB],
	[0x10C8C, 0x10CCC],
	[0x10C8D, 0x10CCD],
	[0x10C8E, 0x10CCE],
	[0x10C8F, 0x10CCF],
	[0x10C90, 0x10CD0],
	[0x10C91, 0x10CD1],
	[0x10C92, 0x10CD2],
	[0x10C93, 0x10CD3],
	[0x10C94, 0x10CD4],
	[0x10C95, 0x10CD5],
	[0x10C96, 0x10CD6],
	[0x10C97, 0x10CD7],
	[0x10C98, 0x10CD8],
	[0x10C99, 0x10CD9],
	[0x10C9A, 0x10CDA],
	[0x10C9B, 0x10CDB],
	[0x10C9C, 0x10CDC],
	[0x10C9D, 0x10CDD],
	[0x10C9E, 0x10CDE],
	[0x10C9F, 0x10CDF],
	[0x10CA0, 0x10CE0],
	[0x10CA1, 0x10CE1],
	[0x10CA2, 0x10CE2],
	[0x10CA3, 0x10CE3],
	[0x10CA4, 0x10CE4],
	[0x10CA5, 0x10CE5],
	[0x10CA6, 0x10CE6],
	[0x10CA7, 0x10CE7],
	[0x10CA8, 0x10CE8],
	[0x10CA9, 0x10CE9],
	[0x10CAA, 0x10CEA],
	[0x10CAB, 0x10CEB],
	[0x10CAC, 0x10CEC],
	[0x10CAD, 0x10CED],
	[0x10CAE, 0x10CEE],
	[0x10CAF, 0x10CEF],
	[0x10CB0, 0x10CF0],
	[0x10CB1, 0x10CF1],
	[0x10CB2, 0x10CF2],
	[0x10CC0, 0x10C80],
	[0x10CC1, 0x10C81],
	[0x10CC2, 0x10C82],
	[0x10CC3, 0x10C83],
	[0x10CC4, 0x10C84],
	[0x10CC5, 0x10C85],
	[0x10CC6, 0x10C86],
	[0x10CC7, 0x10C87],
	[0x10CC8, 0x10C88],
	[0x10CC9, 0x10C89],
	[0x10CCA, 0x10C8A],
	[0x10CCB, 0x10C8B],
	[0x10CCC, 0x10C8C],
	[0x10CCD, 0x10C8D],
	[0x10CCE, 0x10C8E],
	[0x10CCF, 0x10C8F],
	[0x10CD0, 0x10C90],
	[0x10CD1, 0x10C91],
	[0x10CD2, 0x10C92],
	[0x10CD3, 0x10C93],
	[0x10CD4, 0x10C94],
	[0x10CD5, 0x10C95],
	[0x10CD6, 0x10C96],
	[0x10CD7, 0x10C97],
	[0x10CD8, 0x10C98],
	[0x10CD9, 0x10C99],
	[0x10CDA, 0x10C9A],
	[0x10CDB, 0x10C9B],
	[0x10CDC, 0x10C9C],
	[0x10CDD, 0x10C9D],
	[0x10CDE, 0x10C9E],
	[0x10CDF, 0x10C9F],
	[0x10CE0, 0x10CA0],
	[0x10CE1, 0x10CA1],
	[0x10CE2, 0x10CA2],
	[0x10CE3, 0x10CA3],
	[0x10CE4, 0x10CA4],
	[0x10CE5, 0x10CA5],
	[0x10CE6, 0x10CA6],
	[0x10CE7, 0x10CA7],
	[0x10CE8, 0x10CA8],
	[0x10CE9, 0x10CA9],
	[0x10CEA, 0x10CAA],
	[0x10CEB, 0x10CAB],
	[0x10CEC, 0x10CAC],
	[0x10CED, 0x10CAD],
	[0x10CEE, 0x10CAE],
	[0x10CEF, 0x10CAF],
	[0x10CF0, 0x10CB0],
	[0x10CF1, 0x10CB1],
	[0x10CF2, 0x10CB2],
	[0x118A0, 0x118C0],
	[0x118A1, 0x118C1],
	[0x118A2, 0x118C2],
	[0x118A3, 0x118C3],
	[0x118A4, 0x118C4],
	[0x118A5, 0x118C5],
	[0x118A6, 0x118C6],
	[0x118A7, 0x118C7],
	[0x118A8, 0x118C8],
	[0x118A9, 0x118C9],
	[0x118AA, 0x118CA],
	[0x118AB, 0x118CB],
	[0x118AC, 0x118CC],
	[0x118AD, 0x118CD],
	[0x118AE, 0x118CE],
	[0x118AF, 0x118CF],
	[0x118B0, 0x118D0],
	[0x118B1, 0x118D1],
	[0x118B2, 0x118D2],
	[0x118B3, 0x118D3],
	[0x118B4, 0x118D4],
	[0x118B5, 0x118D5],
	[0x118B6, 0x118D6],
	[0x118B7, 0x118D7],
	[0x118B8, 0x118D8],
	[0x118B9, 0x118D9],
	[0x118BA, 0x118DA],
	[0x118BB, 0x118DB],
	[0x118BC, 0x118DC],
	[0x118BD, 0x118DD],
	[0x118BE, 0x118DE],
	[0x118BF, 0x118DF],
	[0x118C0, 0x118A0],
	[0x118C1, 0x118A1],
	[0x118C2, 0x118A2],
	[0x118C3, 0x118A3],
	[0x118C4, 0x118A4],
	[0x118C5, 0x118A5],
	[0x118C6, 0x118A6],
	[0x118C7, 0x118A7],
	[0x118C8, 0x118A8],
	[0x118C9, 0x118A9],
	[0x118CA, 0x118AA],
	[0x118CB, 0x118AB],
	[0x118CC, 0x118AC],
	[0x118CD, 0x118AD],
	[0x118CE, 0x118AE],
	[0x118CF, 0x118AF],
	[0x118D0, 0x118B0],
	[0x118D1, 0x118B1],
	[0x118D2, 0x118B2],
	[0x118D3, 0x118B3],
	[0x118D4, 0x118B4],
	[0x118D5, 0x118B5],
	[0x118D6, 0x118B6],
	[0x118D7, 0x118B7],
	[0x118D8, 0x118B8],
	[0x118D9, 0x118B9],
	[0x118DA, 0x118BA],
	[0x118DB, 0x118BB],
	[0x118DC, 0x118BC],
	[0x118DD, 0x118BD],
	[0x118DE, 0x118BE],
	[0x118DF, 0x118BF],
	[0x16E40, 0x16E60],
	[0x16E41, 0x16E61],
	[0x16E42, 0x16E62],
	[0x16E43, 0x16E63],
	[0x16E44, 0x16E64],
	[0x16E45, 0x16E65],
	[0x16E46, 0x16E66],
	[0x16E47, 0x16E67],
	[0x16E48, 0x16E68],
	[0x16E49, 0x16E69],
	[0x16E4A, 0x16E6A],
	[0x16E4B, 0x16E6B],
	[0x16E4C, 0x16E6C],
	[0x16E4D, 0x16E6D],
	[0x16E4E, 0x16E6E],
	[0x16E4F, 0x16E6F],
	[0x16E50, 0x16E70],
	[0x16E51, 0x16E71],
	[0x16E52, 0x16E72],
	[0x16E53, 0x16E73],
	[0x16E54, 0x16E74],
	[0x16E55, 0x16E75],
	[0x16E56, 0x16E76],
	[0x16E57, 0x16E77],
	[0x16E58, 0x16E78],
	[0x16E59, 0x16E79],
	[0x16E5A, 0x16E7A],
	[0x16E5B, 0x16E7B],
	[0x16E5C, 0x16E7C],
	[0x16E5D, 0x16E7D],
	[0x16E5E, 0x16E7E],
	[0x16E5F, 0x16E7F],
	[0x16E60, 0x16E40],
	[0x16E61, 0x16E41],
	[0x16E62, 0x16E42],
	[0x16E63, 0x16E43],
	[0x16E64, 0x16E44],
	[0x16E65, 0x16E45],
	[0x16E66, 0x16E46],
	[0x16E67, 0x16E47],
	[0x16E68, 0x16E48],
	[0x16E69, 0x16E49],
	[0x16E6A, 0x16E4A],
	[0x16E6B, 0x16E4B],
	[0x16E6C, 0x16E4C],
	[0x16E6D, 0x16E4D],
	[0x16E6E, 0x16E4E],
	[0x16E6F, 0x16E4F],
	[0x16E70, 0x16E50],
	[0x16E71, 0x16E51],
	[0x16E72, 0x16E52],
	[0x16E73, 0x16E53],
	[0x16E74, 0x16E54],
	[0x16E75, 0x16E55],
	[0x16E76, 0x16E56],
	[0x16E77, 0x16E57],
	[0x16E78, 0x16E58],
	[0x16E79, 0x16E59],
	[0x16E7A, 0x16E5A],
	[0x16E7B, 0x16E5B],
	[0x16E7C, 0x16E5C],
	[0x16E7D, 0x16E5D],
	[0x16E7E, 0x16E5E],
	[0x16E7F, 0x16E5F],
	[0x1E900, 0x1E922],
	[0x1E901, 0x1E923],
	[0x1E902, 0x1E924],
	[0x1E903, 0x1E925],
	[0x1E904, 0x1E926],
	[0x1E905, 0x1E927],
	[0x1E906, 0x1E928],
	[0x1E907, 0x1E929],
	[0x1E908, 0x1E92A],
	[0x1E909, 0x1E92B],
	[0x1E90A, 0x1E92C],
	[0x1E90B, 0x1E92D],
	[0x1E90C, 0x1E92E],
	[0x1E90D, 0x1E92F],
	[0x1E90E, 0x1E930],
	[0x1E90F, 0x1E931],
	[0x1E910, 0x1E932],
	[0x1E911, 0x1E933],
	[0x1E912, 0x1E934],
	[0x1E913, 0x1E935],
	[0x1E914, 0x1E936],
	[0x1E915, 0x1E937],
	[0x1E916, 0x1E938],
	[0x1E917, 0x1E939],
	[0x1E918, 0x1E93A],
	[0x1E919, 0x1E93B],
	[0x1E91A, 0x1E93C],
	[0x1E91B, 0x1E93D],
	[0x1E91C, 0x1E93E],
	[0x1E91D, 0x1E93F],
	[0x1E91E, 0x1E940],
	[0x1E91F, 0x1E941],
	[0x1E920, 0x1E942],
	[0x1E921, 0x1E943],
	[0x1E922, 0x1E900],
	[0x1E923, 0x1E901],
	[0x1E924, 0x1E902],
	[0x1E925, 0x1E903],
	[0x1E926, 0x1E904],
	[0x1E927, 0x1E905],
	[0x1E928, 0x1E906],
	[0x1E929, 0x1E907],
	[0x1E92A, 0x1E908],
	[0x1E92B, 0x1E909],
	[0x1E92C, 0x1E90A],
	[0x1E92D, 0x1E90B],
	[0x1E92E, 0x1E90C],
	[0x1E92F, 0x1E90D],
	[0x1E930, 0x1E90E],
	[0x1E931, 0x1E90F],
	[0x1E932, 0x1E910],
	[0x1E933, 0x1E911],
	[0x1E934, 0x1E912],
	[0x1E935, 0x1E913],
	[0x1E936, 0x1E914],
	[0x1E937, 0x1E915],
	[0x1E938, 0x1E916],
	[0x1E939, 0x1E917],
	[0x1E93A, 0x1E918],
	[0x1E93B, 0x1E919],
	[0x1E93C, 0x1E91A],
	[0x1E93D, 0x1E91B],
	[0x1E93E, 0x1E91C],
	[0x1E93F, 0x1E91D],
	[0x1E940, 0x1E91E],
	[0x1E941, 0x1E91F],
	[0x1E942, 0x1E920],
	[0x1E943, 0x1E921]
]);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679974997475, function(require, module, exports) {
// Generated using `npm run build`. Do not edit.


const regenerate = require('regenerate');

exports.REGULAR = new Map([
	['d', regenerate()
		.addRange(0x30, 0x39)],
	['D', regenerate()
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0xFFFF)],
	['s', regenerate(0x20, 0xA0, 0x1680, 0x202F, 0x205F, 0x3000, 0xFEFF)
		.addRange(0x9, 0xD)
		.addRange(0x2000, 0x200A)
		.addRange(0x2028, 0x2029)],
	['S', regenerate()
		.addRange(0x0, 0x8)
		.addRange(0xE, 0x1F)
		.addRange(0x21, 0x9F)
		.addRange(0xA1, 0x167F)
		.addRange(0x1681, 0x1FFF)
		.addRange(0x200B, 0x2027)
		.addRange(0x202A, 0x202E)
		.addRange(0x2030, 0x205E)
		.addRange(0x2060, 0x2FFF)
		.addRange(0x3001, 0xFEFE)
		.addRange(0xFF00, 0xFFFF)],
	['w', regenerate(0x5F)
		.addRange(0x30, 0x39)
		.addRange(0x41, 0x5A)
		.addRange(0x61, 0x7A)],
	['W', regenerate(0x60)
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x40)
		.addRange(0x5B, 0x5E)
		.addRange(0x7B, 0xFFFF)]
]);

exports.UNICODE = new Map([
	['d', regenerate()
		.addRange(0x30, 0x39)],
	['D', regenerate()
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x10FFFF)],
	['s', regenerate(0x20, 0xA0, 0x1680, 0x202F, 0x205F, 0x3000, 0xFEFF)
		.addRange(0x9, 0xD)
		.addRange(0x2000, 0x200A)
		.addRange(0x2028, 0x2029)],
	['S', regenerate()
		.addRange(0x0, 0x8)
		.addRange(0xE, 0x1F)
		.addRange(0x21, 0x9F)
		.addRange(0xA1, 0x167F)
		.addRange(0x1681, 0x1FFF)
		.addRange(0x200B, 0x2027)
		.addRange(0x202A, 0x202E)
		.addRange(0x2030, 0x205E)
		.addRange(0x2060, 0x2FFF)
		.addRange(0x3001, 0xFEFE)
		.addRange(0xFF00, 0x10FFFF)],
	['w', regenerate(0x5F)
		.addRange(0x30, 0x39)
		.addRange(0x41, 0x5A)
		.addRange(0x61, 0x7A)],
	['W', regenerate(0x60)
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x40)
		.addRange(0x5B, 0x5E)
		.addRange(0x7B, 0x10FFFF)]
]);

exports.UNICODE_IGNORE_CASE = new Map([
	['d', regenerate()
		.addRange(0x30, 0x39)],
	['D', regenerate()
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x10FFFF)],
	['s', regenerate(0x20, 0xA0, 0x1680, 0x202F, 0x205F, 0x3000, 0xFEFF)
		.addRange(0x9, 0xD)
		.addRange(0x2000, 0x200A)
		.addRange(0x2028, 0x2029)],
	['S', regenerate()
		.addRange(0x0, 0x8)
		.addRange(0xE, 0x1F)
		.addRange(0x21, 0x9F)
		.addRange(0xA1, 0x167F)
		.addRange(0x1681, 0x1FFF)
		.addRange(0x200B, 0x2027)
		.addRange(0x202A, 0x202E)
		.addRange(0x2030, 0x205E)
		.addRange(0x2060, 0x2FFF)
		.addRange(0x3001, 0xFEFE)
		.addRange(0xFF00, 0x10FFFF)],
	['w', regenerate(0x5F, 0x17F, 0x212A)
		.addRange(0x30, 0x39)
		.addRange(0x41, 0x5A)
		.addRange(0x61, 0x7A)],
	['W', regenerate(0x60)
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x40)
		.addRange(0x5B, 0x5E)
		.addRange(0x7B, 0x17E)
		.addRange(0x180, 0x2129)
		.addRange(0x212B, 0x10FFFF)]
]);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679974997473);
})()
//miniprogram-npm-outsideDeps=["@babel/regjsgen","regjsparser","regenerate","unicode-match-property-ecmascript","unicode-match-property-value-ecmascript"]
//# sourceMappingURL=index.js.map