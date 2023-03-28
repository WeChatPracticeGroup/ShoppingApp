module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975018031, function(require, module, exports) {

const path = require('path');
const Conf = require('./lib/conf');
const defaults = require('./lib/defaults');

// https://github.com/npm/npm/blob/latest/lib/config/core.js#L101-L200
module.exports = opts => {
	const conf = new Conf(Object.assign({}, defaults.defaults));

	conf.add(Object.assign({}, opts), 'cli');
	conf.addEnv();
	conf.loadPrefix();

	const projectConf = path.resolve(conf.localPrefix, '.npmrc');
	const userConf = conf.get('userconfig');

	if (!conf.get('global') && projectConf !== userConf) {
		conf.addFile(projectConf, 'project');
	} else {
		conf.add({}, 'project');
	}

	conf.addFile(conf.get('userconfig'), 'user');

	if (conf.get('prefix')) {
		const etc = path.resolve(conf.get('prefix'), 'etc');
		conf.root.globalconfig = path.resolve(etc, 'npmrc');
		conf.root.globalignorefile = path.resolve(etc, 'npmignore');
	}

	conf.addFile(conf.get('globalconfig'), 'global');
	conf.loadUser();

	const caFile = conf.get('cafile');

	if (caFile) {
		conf.loadCAFile(caFile);
	}

	return conf;
};

module.exports.defaults = Object.assign({}, defaults.defaults);

}, function(modId) {var map = {"./lib/conf":1679975018032,"./lib/defaults":1679975018035}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018032, function(require, module, exports) {

const fs = require('fs');
const path = require('path');
const ConfigChain = require('config-chain').ConfigChain;
const util = require('./util');

class Conf extends ConfigChain {
	// https://github.com/npm/npm/blob/latest/lib/config/core.js#L208-L222
	constructor(base) {
		super(base);
		this.root = base;
	}

	// https://github.com/npm/npm/blob/latest/lib/config/core.js#L332-L342
	add(data, marker) {
		try {
			for (const x of Object.keys(data)) {
				data[x] = util.parseField(data[x], x);
			}
		} catch (err) {
			throw err;
		}

		return super.add(data, marker);
	}

	// https://github.com/npm/npm/blob/latest/lib/config/core.js#L312-L325
	addFile(file, name) {
		name = name || file;

		const marker = {__source__: name};

		this.sources[name] = {path: file, type: 'ini'};
		this.push(marker);
		this._await();

		try {
			const contents = fs.readFileSync(file, 'utf8');
			this.addString(contents, file, 'ini', marker);
		} catch (err) {
			this.add({}, marker);
		}

		return this;
	}

	// https://github.com/npm/npm/blob/latest/lib/config/core.js#L344-L360
	addEnv(env) {
		env = env || process.env;

		const conf = {};

		Object.keys(env)
			.filter(x => /^npm_config_/i.test(x))
			.forEach(x => {
				if (!env[x]) {
					return;
				}

				const p = x.toLowerCase()
					.replace(/^npm_config_/, '')
					.replace(/(?!^)_/g, '-');

				conf[p] = env[x];
			});

		return super.addEnv('', conf, 'env');
	}

	// https://github.com/npm/npm/blob/latest/lib/config/load-prefix.js
	loadPrefix() {
		const cli = this.list[0];

		Object.defineProperty(this, 'prefix', {
			enumerable: true,
			set: prefix => {
				const g = this.get('global');
				this[g ? 'globalPrefix' : 'localPrefix'] = prefix;
			},
			get: () => {
				const g = this.get('global');
				return g ? this.globalPrefix : this.localPrefix;
			}
		});

		Object.defineProperty(this, 'globalPrefix', {
			enumerable: true,
			set: prefix => {
				this.set('prefix', prefix);
			},
			get: () => {
				return path.resolve(this.get('prefix'));
			}
		});

		let p;

		Object.defineProperty(this, 'localPrefix', {
			enumerable: true,
			set: prefix => {
				p = prefix;
			},
			get: () => {
				return p;
			}
		});

		if (Object.prototype.hasOwnProperty.call(cli, 'prefix')) {
			p = path.resolve(cli.prefix);
		} else {
			try {
				const prefix = util.findPrefix(process.cwd());
				p = prefix;
			} catch (err) {
				throw err;
			}
		}

		return p;
	}

	// https://github.com/npm/npm/blob/latest/lib/config/load-cafile.js
	loadCAFile(file) {
		if (!file) {
			return;
		}

		try {
			const contents = fs.readFileSync(file, 'utf8');
			const delim = '-----END CERTIFICATE-----';
			const output = contents
				.split(delim)
				.filter(x => Boolean(x.trim()))
				.map(x => x.trimLeft() + delim);

			this.set('ca', output);
		} catch (err) {
			if (err.code === 'ENOENT') {
				return;
			}

			throw err;
		}
	}

	// https://github.com/npm/npm/blob/latest/lib/config/set-user.js
	loadUser() {
		const defConf = this.root;

		if (this.get('global')) {
			return;
		}

		if (process.env.SUDO_UID) {
			defConf.user = Number(process.env.SUDO_UID);
			return;
		}

		const prefix = path.resolve(this.get('prefix'));

		try {
			const stats = fs.statSync(prefix);
			defConf.user = stats.uid;
		} catch (err) {
			if (err.code === 'ENOENT') {
				return;
			}

			throw err;
		}
	}
}

module.exports = Conf;

}, function(modId) { var map = {"./util":1679975018033}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018033, function(require, module, exports) {

const fs = require('fs');
const path = require('path');
const types = require('./types');

// https://github.com/npm/npm/blob/latest/lib/config/core.js#L409-L423
const envReplace = str => {
	if (typeof str !== 'string' || !str) {
		return str;
	}

	// Replace any ${ENV} values with the appropriate environment
	const regex = /(\\*)\$\{([^}]+)\}/g;

	return str.replace(regex, (orig, esc, name) => {
		esc = esc.length > 0 && esc.length % 2;

		if (esc) {
			return orig;
		}

		if (process.env[name] === undefined) {
			throw new Error(`Failed to replace env in config: ${orig}`);
		}

		return process.env[name];
	});
};

// https://github.com/npm/npm/blob/latest/lib/config/core.js#L362-L407
const parseField = (field, key) => {
	if (typeof field !== 'string') {
		return field;
	}

	const typeList = [].concat(types[key]);
	const isPath = typeList.indexOf(path) !== -1;
	const isBool = typeList.indexOf(Boolean) !== -1;
	const isString = typeList.indexOf(String) !== -1;
	const isNumber = typeList.indexOf(Number) !== -1;

	field = `${field}`.trim();

	if (/^".*"$/.test(field)) {
		try {
			field = JSON.parse(field);
		} catch (err) {
			throw new Error(`Failed parsing JSON config key ${key}: ${field}`);
		}
	}

	if (isBool && !isString && field === '') {
		return true;
	}

	switch (field) { // eslint-disable-line default-case
		case 'true': {
			return true;
		}

		case 'false': {
			return false;
		}

		case 'null': {
			return null;
		}

		case 'undefined': {
			return undefined;
		}
	}

	field = envReplace(field);

	if (isPath) {
		const regex = process.platform === 'win32' ? /^~(\/|\\)/ : /^~\//;

		if (regex.test(field) && process.env.HOME) {
			field = path.resolve(process.env.HOME, field.substr(2));
		}

		field = path.resolve(field);
	}

	if (isNumber && !field.isNan()) {
		field = Number(field);
	}

	return field;
};

// https://github.com/npm/npm/blob/latest/lib/config/find-prefix.js
const findPrefix = name => {
	name = path.resolve(name);

	let walkedUp = false;

	while (path.basename(name) === 'node_modules') {
		name = path.dirname(name);
		walkedUp = true;
	}

	if (walkedUp) {
		return name;
	}

	const find = (name, original) => {
		const regex = /^[a-zA-Z]:(\\|\/)?$/;

		if (name === '/' || (process.platform === 'win32' && regex.test(name))) {
			return original;
		}

		try {
			const files = fs.readdirSync(name);

			if (files.indexOf('node_modules') !== -1 || files.indexOf('package.json') !== -1) {
				return name;
			}

			const dirname = path.dirname(name);

			if (dirname === name) {
				return original;
			}

			return find(dirname, original);
		} catch (err) {
			if (name === original) {
				if (err.code === 'ENOENT') {
					return original;
				}

				throw err;
			}

			return original;
		}
	};

	return find(name, name);
};

exports.envReplace = envReplace;
exports.findPrefix = findPrefix;
exports.parseField = parseField;

}, function(modId) { var map = {"./types":1679975018034}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018034, function(require, module, exports) {

	// Generated with `lib/make.js`
	
	const path = require('path');
	const Stream = require('stream').Stream;
	const url = require('url');

	const Umask = () => {};
	const getLocalAddresses = () => [];
	const semver = () => {};

	exports.types = {
  access: [null, 'restricted', 'public'],
  'allow-same-version': Boolean,
  'always-auth': Boolean,
  also: [null, 'dev', 'development'],
  'auth-type': ['legacy', 'sso', 'saml', 'oauth'],
  'bin-links': Boolean,
  browser: [null, String],
  ca: [null, String, Array],
  cafile: path,
  cache: path,
  'cache-lock-stale': Number,
  'cache-lock-retries': Number,
  'cache-lock-wait': Number,
  'cache-max': Number,
  'cache-min': Number,
  cert: [null, String],
  color: ['always', Boolean],
  depth: Number,
  description: Boolean,
  dev: Boolean,
  'dry-run': Boolean,
  editor: String,
  'engine-strict': Boolean,
  force: Boolean,
  'fetch-retries': Number,
  'fetch-retry-factor': Number,
  'fetch-retry-mintimeout': Number,
  'fetch-retry-maxtimeout': Number,
  git: String,
  'git-tag-version': Boolean,
  global: Boolean,
  globalconfig: path,
  'global-style': Boolean,
  group: [Number, String],
  'https-proxy': [null, url],
  'user-agent': String,
  'ham-it-up': Boolean,
  'heading': String,
  'if-present': Boolean,
  'ignore-prepublish': Boolean,
  'ignore-scripts': Boolean,
  'init-module': path,
  'init-author-name': String,
  'init-author-email': String,
  'init-author-url': ['', url],
  'init-license': String,
  'init-version': semver,
  json: Boolean,
  key: [null, String],
  'legacy-bundling': Boolean,
  link: Boolean,
  // local-address must be listed as an IP for a local network interface
  // must be IPv4 due to node bug
  'local-address': getLocalAddresses(),
  loglevel: ['silent', 'error', 'warn', 'notice', 'http', 'timing', 'info', 'verbose', 'silly'],
  logstream: Stream,
  'logs-max': Number,
  long: Boolean,
  maxsockets: Number,
  message: String,
  'metrics-registry': [null, String],
  'node-version': [null, semver],
  offline: Boolean,
  'onload-script': [null, String],
  only: [null, 'dev', 'development', 'prod', 'production'],
  optional: Boolean,
  'package-lock': Boolean,
  parseable: Boolean,
  'prefer-offline': Boolean,
  'prefer-online': Boolean,
  prefix: path,
  production: Boolean,
  progress: Boolean,
  'proprietary-attribs': Boolean,
  proxy: [null, false, url],
  // allow proxy to be disabled explicitly
  'rebuild-bundle': Boolean,
  registry: [null, url],
  rollback: Boolean,
  save: Boolean,
  'save-bundle': Boolean,
  'save-dev': Boolean,
  'save-exact': Boolean,
  'save-optional': Boolean,
  'save-prefix': String,
  'save-prod': Boolean,
  scope: String,
  'script-shell': [null, String],
  'scripts-prepend-node-path': [false, true, 'auto', 'warn-only'],
  searchopts: String,
  searchexclude: [null, String],
  searchlimit: Number,
  searchstaleness: Number,
  'send-metrics': Boolean,
  shell: String,
  shrinkwrap: Boolean,
  'sign-git-tag': Boolean,
  'sso-poll-frequency': Number,
  'sso-type': [null, 'oauth', 'saml'],
  'strict-ssl': Boolean,
  tag: String,
  timing: Boolean,
  tmp: path,
  unicode: Boolean,
  'unsafe-perm': Boolean,
  usage: Boolean,
  user: [Number, String],
  userconfig: path,
  umask: Umask,
  version: Boolean,
  'tag-version-prefix': String,
  versions: Boolean,
  viewer: String,
  _exit: Boolean
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975018035, function(require, module, exports) {

	// Generated with `lib/make.js`
	
	const os = require('os');
	const path = require('path');

	const temp = os.tmpdir();
	const uidOrPid = process.getuid ? process.getuid() : process.pid;
	const hasUnicode = () => true;
	const isWindows = process.platform === 'win32';

	const osenv = {
		editor: () => process.env.EDITOR || process.env.VISUAL || (isWindows ? 'notepad.exe' : 'vi'),
		shell: () => isWindows ? (process.env.COMSPEC || 'cmd.exe') : (process.env.SHELL || '/bin/bash')
	};

	const umask = {
		fromString: () => process.umask()
	};

	let home = os.homedir();

	if (home) {
		process.env.HOME = home;
	} else {
		home = path.resolve(temp, 'npm-' + uidOrPid);
	}

	const cacheExtra = process.platform === 'win32' ? 'npm-cache' : '.npm';
	const cacheRoot = process.platform === 'win32' ? process.env.APPDATA : home;
	const cache = path.resolve(cacheRoot, cacheExtra);

	let defaults;
	let globalPrefix;

	Object.defineProperty(exports, 'defaults', {
  get: function () {
    if (defaults) return defaults;

    if (process.env.PREFIX) {
      globalPrefix = process.env.PREFIX;
    } else if (process.platform === 'win32') {
      // c:\node\node.exe --> prefix=c:\node\
      globalPrefix = path.dirname(process.execPath);
    } else {
      // /usr/local/bin/node --> prefix=/usr/local
      globalPrefix = path.dirname(path.dirname(process.execPath)); // destdir only is respected on Unix

      if (process.env.DESTDIR) {
        globalPrefix = path.join(process.env.DESTDIR, globalPrefix);
      }
    }

    defaults = {
      access: null,
      'allow-same-version': false,
      'always-auth': false,
      also: null,
      'auth-type': 'legacy',
      'bin-links': true,
      browser: null,
      ca: null,
      cafile: null,
      cache: cache,
      'cache-lock-stale': 60000,
      'cache-lock-retries': 10,
      'cache-lock-wait': 10000,
      'cache-max': Infinity,
      'cache-min': 10,
      cert: null,
      color: true,
      depth: Infinity,
      description: true,
      dev: false,
      'dry-run': false,
      editor: osenv.editor(),
      'engine-strict': false,
      force: false,
      'fetch-retries': 2,
      'fetch-retry-factor': 10,
      'fetch-retry-mintimeout': 10000,
      'fetch-retry-maxtimeout': 60000,
      git: 'git',
      'git-tag-version': true,
      global: false,
      globalconfig: path.resolve(globalPrefix, 'etc', 'npmrc'),
      'global-style': false,
      group: process.platform === 'win32' ? 0 : process.env.SUDO_GID || process.getgid && process.getgid(),
      'ham-it-up': false,
      heading: 'npm',
      'if-present': false,
      'ignore-prepublish': false,
      'ignore-scripts': false,
      'init-module': path.resolve(home, '.npm-init.js'),
      'init-author-name': '',
      'init-author-email': '',
      'init-author-url': '',
      'init-version': '1.0.0',
      'init-license': 'ISC',
      json: false,
      key: null,
      'legacy-bundling': false,
      link: false,
      'local-address': undefined,
      loglevel: 'notice',
      logstream: process.stderr,
      'logs-max': 10,
      long: false,
      maxsockets: 50,
      message: '%s',
      'metrics-registry': null,
      'node-version': process.version,
      'offline': false,
      'onload-script': false,
      only: null,
      optional: true,
      'package-lock': true,
      parseable: false,
      'prefer-offline': false,
      'prefer-online': false,
      prefix: globalPrefix,
      production: process.env.NODE_ENV === 'production',
      'progress': !process.env.TRAVIS && !process.env.CI,
      'proprietary-attribs': true,
      proxy: null,
      'https-proxy': null,
      'user-agent': 'npm/{npm-version} ' + 'node/{node-version} ' + '{platform} ' + '{arch}',
      'rebuild-bundle': true,
      registry: 'https://registry.npmjs.org/',
      rollback: true,
      save: true,
      'save-bundle': false,
      'save-dev': false,
      'save-exact': false,
      'save-optional': false,
      'save-prefix': '^',
      'save-prod': false,
      scope: '',
      'script-shell': null,
      'scripts-prepend-node-path': 'warn-only',
      searchopts: '',
      searchexclude: null,
      searchlimit: 20,
      searchstaleness: 15 * 60,
      'send-metrics': false,
      shell: osenv.shell(),
      shrinkwrap: true,
      'sign-git-tag': false,
      'sso-poll-frequency': 500,
      'sso-type': 'oauth',
      'strict-ssl': true,
      tag: 'latest',
      'tag-version-prefix': 'v',
      timing: false,
      tmp: temp,
      unicode: hasUnicode(),
      'unsafe-perm': process.platform === 'win32' || process.platform === 'cygwin' || !(process.getuid && process.setuid && process.getgid && process.setgid) || process.getuid() !== 0,
      usage: false,
      user: process.platform === 'win32' ? 0 : 'nobody',
      userconfig: path.resolve(home, '.npmrc'),
      umask: process.umask ? process.umask() : umask.fromString('022'),
      version: false,
      versions: false,
      viewer: process.platform === 'win32' ? 'browser' : 'man',
      _exit: true
    };
    return defaults;
  }
})

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975018031);
})()
//miniprogram-npm-outsideDeps=["path","fs","config-chain","stream","url","os"]
//# sourceMappingURL=index.js.map