module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975017832, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.workletVersion=exports.getWhiteExtList=exports.analyseCode=exports.getLatestVersion=exports.uploadJsServer=exports.cloud=exports.getDevSourceMap=exports.proxy=exports.packNpmManually=exports.packNpm=exports.getCompiledResult=exports.preview=exports.upload=exports.Project=void 0;const tslib_1=require("tslib"),project_1=require("./ci/project");Object.defineProperty(exports,"Project",{enumerable:!0,get:function(){return project_1.Project}});const upload_1=require("./ci/upload"),preview_1=require("./ci/preview"),getDevSourceMap_1=require("./ci/getDevSourceMap"),packnpm_1=require("./core/npm/packnpm");Object.defineProperty(exports,"packNpm",{enumerable:!0,get:function(){return packnpm_1.packNpm}}),Object.defineProperty(exports,"packNpmManually",{enumerable:!0,get:function(){return packnpm_1.packNpmManually}});const request_1=require("./utils/request");Object.defineProperty(exports,"proxy",{enumerable:!0,get:function(){return request_1.setCiProxy}});const uploadFunction_1=require("./cloud/uploadFunction"),createTimeTrigger_1=require("./cloud/createTimeTrigger"),uploadContainer_1=require("./cloud/uploadContainer"),uploadFile_1=require("./cloud/uploadFile"),report_1=require("./utils/report"),jsserver_1=require("./ci/jsserver");Object.defineProperty(exports,"uploadJsServer",{enumerable:!0,get:function(){return jsserver_1.uploadJsServer}});const code_analyse_1=require("./ci/code-analyse");Object.defineProperty(exports,"analyseCode",{enumerable:!0,get:function(){return code_analyse_1.analyseCode}});const getCompiledResult_1=require("./ci/getCompiledResult");Object.defineProperty(exports,"getCompiledResult",{enumerable:!0,get:function(){return getCompiledResult_1.getCompiledResult}});const getLatestVersion_1=require("./ci/getLatestVersion");Object.defineProperty(exports,"getLatestVersion",{enumerable:!0,get:function(){return getLatestVersion_1.getLatestVersion}});const white_ext_list_1=require("./utils/white_ext_list");Object.defineProperty(exports,"getWhiteExtList",{enumerable:!0,get:function(){return white_ext_list_1.getWhiteExtList}}),exports.upload=(0,report_1.wrapReport)("upload",upload_1.upload),exports.preview=(0,report_1.wrapReport)("preview",preview_1.preview),exports.getDevSourceMap=(0,report_1.wrapReport)("getDevSourceMap",getDevSourceMap_1.getDevSourceMap),exports.cloud={uploadFunction:uploadFunction_1.uploadFunction,createTimeTrigger:createTimeTrigger_1.createTimeTrigger,uploadStaticStorage:e=>(0,uploadFile_1.uploadFiles)(e,"staticstorage"),uploadStorage:e=>(0,uploadFile_1.uploadFiles)(e,"storage"),uploadContainer:uploadContainer_1.uploadContainer},(0,tslib_1.__exportStar)(require("./core"),exports),(0,tslib_1.__exportStar)(require("./summer"),exports),exports.workletVersion=require("./utils/babel_plugin_worklet").version;
}(require("licia/lazyImport")(require), require)
}, function(modId) {var map = {"./ci/project":1679975017833,"./ci/upload":1679975017870,"./ci/preview":1679975017950,"./ci/getDevSourceMap":1679975017952,"./core/npm/packnpm":1679975017953,"./utils/request":1679975017835,"./cloud/uploadFunction":1679975017955,"./cloud/createTimeTrigger":1679975017989,"./cloud/uploadContainer":1679975017990,"./cloud/uploadFile":1679975017991,"./utils/report":1679975017992,"./ci/jsserver":1679975017993,"./ci/code-analyse":1679975017949,"./ci/getCompiledResult":1679975017995,"./ci/getLatestVersion":1679975017996,"./utils/white_ext_list":1679975017924,"./core":1679975017916,"./summer":1679975017997,"./utils/babel_plugin_worklet":1679975017893}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017833, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.Project=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),glob_1=(0,tslib_1.__importDefault)(require("glob")),fs_1=(0,tslib_1.__importDefault)(require("fs")),projectattr_1=require("./projectattr"),tools_1=require("../utils/tools"),config_1=require("../config"),locales_1=(0,tslib_1.__importDefault)(require("../utils/locales/locales")),error_1=require("../utils/error"),request_1=require("../utils/request"),projectconfig_1=require("../core/json/projectconfig"),defaultIgnores=["node_modules/**/*","**/node_modules/**","**/.git/**",".git/**/*","**/.svn/**",".svn/**/*",".DS_Store","**/.DS_Store"];class Project{constructor(t){this.miniprogramRoot="",this.pluginRoot="",this._appid="",this._projectPath="",this._dirSet=new Set,this._fileSet=new Set,this._fileBufferCache={},this._privateKey="",this._ignores=[];const{appid:e,type:i,projectPath:r,ignores:s,privateKey:o="",privateKeyPath:a=""}=t;if(!e)throw new error_1.CodeError(locales_1.default.config.SHOULD_NOT_BE_EMPTY.format("appid"),config_1.PARAM_ERROR);if(!r)throw new error_1.CodeError(locales_1.default.config.SHOULD_NOT_BE_EMPTY.format("projectPath"),config_1.PARAM_ERROR);if(o)this._privateKey=o;else{if(!a)throw new error_1.CodeError(locales_1.default.config.SHOULD_NOT_BE_EMPTY.format("privateKeyPath"),config_1.PARAM_ERROR);try{this._privateKey=fs_1.default.readFileSync(a).toString("utf8")}catch(t){throw new error_1.CodeError(t.toString(),config_1.PARAM_ERROR)}}this._appid=e,this._type=i||"miniProgram",this._projectPath=path_1.default.isAbsolute(r)?(0,tools_1.normalizePath)(r):(0,tools_1.normalizePath)(path_1.default.join(process.cwd(),r)),this.init(s)}init(t=[]){(0,request_1.initGlobalProxy)(),this._ignores=t,this.updateFiles()}cacheDirName(t){this._dirSet.has(t)||(this._dirSet.add(t),this.cacheDirName(path_1.default.posix.dirname(t)))}getTargetPath(t,e){return(0,tools_1.normalizePath)(path_1.default.posix.join(t,e)).replace(/\/$/,"").replace(/^\//,"")}updateFiles(){this._fileBufferCache={};const t=glob_1.default.sync("**",{nodir:!1,ignore:[...defaultIgnores,...this._ignores],nosort:!0,strict:!1,silent:!0,cwd:this.projectPath,absolute:!1,mark:!0,dot:!0});for(const e of t){const t=e.replace(/\\/g,path_1.default.posix.sep),i=fs_1.default.statSync(path_1.default.posix.join(this.projectPath,e));i.isDirectory()&&this.cacheDirName(t.replace(/\/$/,"")),i.isFile()&&(this._fileSet.add(t),this.cacheDirName(path_1.default.posix.dirname(t)))}}async attr(){return this._attr||(this._attr=await(0,projectattr_1.getProjectAttr)(this._privateKey,this._appid)),this._attr}get projectPath(){return this._projectPath}get appid(){return this._appid}get type(){return this._type}get privateKey(){return this._privateKey||""}getFilesAndDirs(){return{files:Array.from(this._fileSet),dirs:Array.from(this._dirSet)}}async getExtAppid(){if(this._extAppid)return this._extAppid;if(null!==this._extAppid)try{const t=await(0,projectconfig_1.getProjectConfigJSON)(this),{miniprogramRoot:e=""}=t,i=await this.getFile(e,"ext.json"),r=JSON.parse(i.toString("utf-8"));return r.extEnable&&r.extAppid?this._extAppid=r.extAppid:this._extAppid=null,this._extAppid}catch(t){this._extAppid=null}}stat(t,e){const i=this.getTargetPath(t,e);if(this._fileSet.has(i)){return{isFile:!0,isDirectory:!1,size:fs_1.default.statSync(path_1.default.posix.join(this.projectPath,i)).size}}if(this._dirSet.has(i))return{isFile:!1,isDirectory:!0}}getFile(t,e){const i=this.getTargetPath(t,e),r=(0,tools_1.normalizePath)(path_1.default.posix.join(this.projectPath,i));return this._fileBufferCache[i]?this._fileBufferCache[i]:fs_1.default.readFileSync(r,null)}getFileList(t,e=""){return Array.from(this._fileSet).filter(i=>(!e||path_1.default.posix.extname(i)===e)&&(!t||0===i.indexOf(t)))}async onFileChange(t,e){if(e=(0,tools_1.normalizePath)(e).replace(/\/$/,"").replace(/^\//,""),"add"!==t&&"addDir"!==t||(this.cacheDirName(path_1.default.posix.dirname(e)),this._fileSet.add(e)),"addDir"===t&&this.cacheDirName(e),"unlink"===t&&this._fileSet.has(e)&&this._fileSet.delete(e),"unlinkDir"===t&&this._dirSet.has(e)){this._dirSet.delete(e);const t=e+"/",i=Array.from(this._dirSet);for(const e of i)0===e.indexOf(t)&&this._dirSet.delete(e);const r=Array.from(this._fileSet);for(const e of r)0===e.indexOf(t)&&this._fileSet.delete(e)}"change"===t&&this._fileSet.has(e)&&delete this._fileBufferCache[e]}}exports.Project=Project;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./projectattr":1679975017834,"../utils/tools":1679975017847,"../config":1679975017839,"../utils/locales/locales":1679975017841,"../utils/error":1679975017840,"../utils/request":1679975017835,"../core/json/projectconfig":1679975017851}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017834, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getProjectAttr=void 0;const tslib_1=require("tslib"),request_1=require("../utils/request"),sign_1=require("../utils/sign"),log_1=(0,tslib_1.__importDefault)(require("../utils/log")),config_1=require("../config"),url_config_1=require("../utils/url_config"),jsonParse_1=require("../utils/jsonParse"),testCache={};async function getProjectAttr(e,t){try{if(global.useAttrCache&&testCache[t])return testCache[t];const r=await(0,sign_1.getSignature)(e,t),{body:o}=await(0,request_1.request)({url:url_config_1.GET_ATTR_URL,method:"post",body:JSON.stringify({appid:t,signature:r}),headers:{"content-type":"application/json"}}),s=(0,jsonParse_1.jsonRespParse)(o,url_config_1.GET_ATTR_URL);if(0===s.errCode)return global.useAttrCache&&(testCache[t]=s.data),s.data;log_1.default.error(`get ${t} project attr fail errCode: ${s.errCode}, errMsg: ${s.errMsg}`)}catch(e){log_1.default.error(`get ${t} project attr fail ${e}`)}return config_1.DefaultProjectAttr}exports.getProjectAttr=getProjectAttr;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/request":1679975017835,"../utils/sign":1679975017838,"../utils/log":1679975017836,"../config":1679975017839,"../utils/url_config":1679975017845,"../utils/jsonParse":1679975017846}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017835, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.initGlobalProxy=exports.getCiProxy=exports.setCiProxy=exports.request=void 0;const tslib_1=require("tslib"),log_1=(0,tslib_1.__importDefault)(require("./log")),interruptibletask_1=require("./interruptibletask"),req=require("request"),getGlobalProxySettings=require("get-proxy");class RequestTask extends interruptibletask_1.InterruptibleTask{constructor(e){super(e),this._alreadyRefresh=!1,this._promise.catch(e=>{log_1.default.error(`${this._opt.url} ${e}`)})}static async formateQuery(e){const t=Object.assign({},e),{needRandom:r}=t;delete t.needRandom;const s=(t.url||"").split("?"),o=s[0],i=[];return-1!==r&&i.push("_r="+Math.random()),s[1]&&i.push(s[1]),t.url=`${o}?${i.join("&")}`,t}abort(){this._aborted||(this._aborted=!0,this._realRequest&&"function"==typeof this._realRequest.abort&&this._realRequest.abort())}async request(){if(this._aborted)throw interruptibletask_1.AbortEvent;const e=await RequestTask.formateQuery(this._opt);return RequestTask.requestProxy&&(e.proxy=RequestTask.requestProxy),new Promise((t,r)=>{this._realRequest=req(e,(e,s,o)=>{e?r(e):t({resp:s,body:o})}),this._realRequest.on("abort",()=>{r(interruptibletask_1.AbortEvent)})})}async run(e){return this._opt=Object.assign({},e),await this.request()}}function request(e){return new RequestTask(e)}function setCiProxy(e){RequestTask.requestProxy=e,log_1.default.info("miniprogram-ci is using proxy: "+e)}function getCiProxy(){return RequestTask.requestProxy}function initGlobalProxy(){const e=getCiProxy(),t=`${process.env.no_proxy||""},${process.env.NO_PROXY||""}`.split(",").map(e=>e.trim());if(!e&&!t.includes("servicewechat.com")){const e=getGlobalProxySettings();e&&setCiProxy(e)}}RequestTask.requestProxy="",exports.request=request,exports.setCiProxy=setCiProxy,exports.getCiProxy=getCiProxy,exports.initGlobalProxy=initGlobalProxy;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./log":1679975017836,"./interruptibletask":1679975017837,"request":1679975017835}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017836, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default={info:console.info,log:console.log,warn:console.warn,error:console.error,debug:(...e)=>{}};
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017837, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.InterruptibleTask=exports.AbortEvent=void 0,exports.AbortEvent="abort";class InterruptibleTask{constructor(...t){this._aborted=!1,this._args=t,this._promise=this.run(...t)}then(t,r){return this._promise.then(t,r)}catch(t){return this._promise.catch(t)}abort(){this._aborted||(this._aborted=!0)}}exports.InterruptibleTask=InterruptibleTask;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017838, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getSignature=exports.getRandomString=void 0;const tslib_1=require("tslib"),config_1=require("../config"),crypto_1=(0,tslib_1.__importDefault)(require("crypto")),request_1=require("./request"),error_1=require("./error"),locales_1=(0,tslib_1.__importDefault)(require("./locales/locales")),url_config_1=require("./url_config"),jsonParse_1=require("./jsonParse");async function getRandomString(r){try{const{body:e}=await(0,request_1.request)({url:url_config_1.GET_RAND_STRING,method:"post",body:JSON.stringify({appid:r,clientRand:Math.floor(1e8*Math.random())}),headers:{"content-type":"application/json"}}),t=(0,jsonParse_1.jsonRespParse)(e,url_config_1.GET_RAND_STRING);if(0===t.errCode)return t.data.randomString;throw new Error(`errCode: ${t.errCode}; errMsg: ${t.errMsg}`)}catch(r){throw new error_1.CodeError(r.toString(),config_1.GET_SIGNATURE_RAND_STRING_ERR)}}async function getSignature(r,e){const t={appid:e,rand_str:await getRandomString(e)};try{return crypto_1.default.privateEncrypt({key:r,padding:crypto_1.default.constants.RSA_PKCS1_PADDING},Buffer.from(JSON.stringify(t))).toString("base64")}catch(r){throw new error_1.CodeError(locales_1.default.config.GENERATE_LOCAL_SIGNATURE_FAIL.format(r.toString()),config_1.GENERATE_LOCAL_SIGNATURE_ERR)}}exports.getRandomString=getRandomString,exports.getSignature=getSignature;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../config":1679975017839,"./request":1679975017835,"./error":1679975017840,"./locales/locales":1679975017841,"./url_config":1679975017845,"./jsonParse":1679975017846}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017839, function(require, module, exports) {
!function(require, directRequire){
var COMPILE_TYPE;Object.defineProperty(exports,"__esModule",{value:!0}),exports.extendedLibMap=exports.jsonVariablePropertyWhiteList=exports.DefaultProjectAttr=exports.TABBAR_ICON_WHITE_LIST=exports.COMPILE_TYPE=exports.APP_TYPE=exports.MINI_GAME_WORKERS_PACKAGE_ROOT=exports.MINI_GAME_MAIN_PACKAGE_ROOT=exports.MINI_PROGRAM_MAIN_PACKAGE_ROOT=exports.PROJECT_TYPE_ERROR=exports.GET_LATEST_VERSION_CGI_ERR=exports.UPLOAD_JS_SERVER_CGI_ERR=exports.CODE_PROTECT_TRANSLATE_FILENAME=exports.UPLOAD_CGI_ERR=exports.GENERATE_LOCAL_SIGNATURE_ERR=exports.GET_SIGNATURE_RAND_STRING_ERR=exports.APP_JSON_NOT_FOUND=exports.JSON_CONTENT_ERR=exports.FILE_NOT_UTF8=exports.JSON_PARSE_ERR=exports.FILE_NOT_FOUND=exports.PLUGIN_JSON_PARSE_ERR=exports.PLUGIN_JSON_CONTENT_ERR=exports.PLUGIN_JSON_FILE_NOT_FOUND=exports.GAME_PLUGIN_LIB_MD5_NOT_MATCH=exports.SUMMER_PLUGIN_CODE_ERR=exports.SUMMER_PLUGIN_ERR=exports.MINIFY_WXML_ERR=exports.POST_WXSS_ERR=exports.FILE_FLAT_ERR=exports.JS_ES6_ERR=exports.BABILI_JS_ERR=exports.UGLIFY_JS_ERR=exports.BABEL_TRANS_JS_ERR=exports.JS_NOT_FOUND=exports.WXML_NOT_FOUND=exports.PARAM_ERROR=exports.CI_VERSION=void 0,exports.CI_VERSION="1.9.5",exports.PARAM_ERROR=1e4,exports.WXML_NOT_FOUND=10007,exports.JS_NOT_FOUND=10008,exports.BABEL_TRANS_JS_ERR=10032,exports.UGLIFY_JS_ERR=10033,exports.BABILI_JS_ERR=10034,exports.JS_ES6_ERR=10035,exports.FILE_FLAT_ERR=10036,exports.POST_WXSS_ERR=10037,exports.MINIFY_WXML_ERR=10038,exports.SUMMER_PLUGIN_ERR=10045,exports.SUMMER_PLUGIN_CODE_ERR=10046,exports.GAME_PLUGIN_LIB_MD5_NOT_MATCH=10081,exports.PLUGIN_JSON_FILE_NOT_FOUND=10091,exports.PLUGIN_JSON_CONTENT_ERR=10092,exports.PLUGIN_JSON_PARSE_ERR=10093,exports.FILE_NOT_FOUND=10005,exports.JSON_PARSE_ERR=10006,exports.FILE_NOT_UTF8=10031,exports.JSON_CONTENT_ERR=10009,exports.APP_JSON_NOT_FOUND=2e4,exports.GET_SIGNATURE_RAND_STRING_ERR=20001,exports.GENERATE_LOCAL_SIGNATURE_ERR=20002,exports.UPLOAD_CGI_ERR=20003,exports.CODE_PROTECT_TRANSLATE_FILENAME=20004,exports.UPLOAD_JS_SERVER_CGI_ERR=20005,exports.GET_LATEST_VERSION_CGI_ERR=20006,exports.PROJECT_TYPE_ERROR=3e4,exports.MINI_PROGRAM_MAIN_PACKAGE_ROOT="__APP__",exports.MINI_GAME_MAIN_PACKAGE_ROOT="__GAME__",exports.MINI_GAME_WORKERS_PACKAGE_ROOT="workers.js",exports.APP_TYPE={NORMAL:0,PLUGIN:1,SHOP:2,MINISHOP:3,GAME:4,CARD:5,NATIVE:7},function(_){_.miniProgram="miniProgram",_.miniProgramPlugin="miniProgramPlugin",_.miniGame="miniGame",_.miniGamePlugin="miniGamePlugin"}(COMPILE_TYPE=exports.COMPILE_TYPE||(exports.COMPILE_TYPE={})),exports.TABBAR_ICON_WHITE_LIST=[".png",".jpg",".jpeg"],exports.DefaultProjectAttr={platform:!1,appType:0,isSandbox:!1,released:!1,setting:{MaxCodeSize:2,MaxSubpackageSubCodeSize:2,MaxSubpackageFullCodeSize:12,NavigateMiniprogramLimit:10,MaxSubPackageLimit:100,MinTabbarCount:2,MaxTabbarCount:5,MaxTabbarIconSize:40}},exports.jsonVariablePropertyWhiteList={windowPropertWhiteList:["navigationBarBackgroundColor","navigationBarTextStyle","backgroundColor","backgroundTextStyle","backgroundColorTop","backgroundColorBottom","backgroundColorContent"],tabBarPropertyWhiteList:["color","selectedColor","backgroundColor","borderStyle"],tabbarListItemPropertyWhiteList:["iconPath","selectedIconPath"]},exports.extendedLibMap={kbone:{packages:["miniprogram-element","miniprogram-render"]},weui:{packages:["weui-miniprogram"]}};
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017840, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.CodeError=void 0;const tslib_1=require("tslib"),log_1=(0,tslib_1.__importDefault)(require("./log"));class CodeError extends Error{constructor(r,e){super(r),log_1.default.error(e,r),this.code=e}}exports.CodeError=CodeError;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./log":1679975017836}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017841, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),en_1=(0,tslib_1.__importDefault)(require("./en")),zh_1=(0,tslib_1.__importDefault)(require("./zh")),systemLocale="$SYSTEM",supportedLocales=["zh","en"];let locale="en";const toSupportedLocale=e=>("$SYSTEM"===e&&"zh_CN"===(e=navigator.language)&&(e="zh"),supportedLocales.find(t=>e.toLowerCase().includes(t))||"zh"),setLocale=e=>{locale=toSupportedLocale(e)};exports.default={get config(){return"en"===locale?en_1.default:zh_1.default},setLocale:setLocale};
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./en":1679975017842,"./zh":1679975017844}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017842, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const fomatable_string_1=require("./fomatable_string"),config={GENERATE_LOCAL_SIGNATURE_FAIL:"generate local signature fail. Usually this happens the content or encoding of private key file is incorrect. Detail: %s",PARAM_ERROR:'function: "%s" lack of parameter: "%s"',SHOULD_NOT_BE_EMPTY:"%s should not be empty",JSON_CONTENT_SHOULD_BE:"%s field needs to be %s",SHOULD_MATCH:"%s should match %s",SHOULD_EQUAL:"%s should equal to %s",SHOULD_AT_LEAST_ONE_ITEM:"%s should have at least on item",OR:"Or",CORRESPONDING_FILE_NOT_FOUND:'%s could not find the corresponding file: "%s"',JSON_SHOULD_NOT_CONTAIN:"%s should not contain %s",JSON_SHOULD_NOT_START_WITH:"%s should not begin with '%s'",NOT_FOUND:"%s not found",NOT_FOUND_IN_ROOT_DIR:"%s is not found in the project root directory",MINIPROGRAM_APP_JSON_NOT_FOUND:'In the directory %s specified by "miniprogramRoot" in project.config.json, %s is not found in that directory.If you don\'t know what "miniprogramRoot" means for, just leave it as empty string.',PLUGIN_JSON_NOT_FOUND:"In the miniprogram local development plug-in directory %s specified by pluginRoot in project.config.json, %s is not found",PLUGIN_PATH_SAME_WITH_MINIPROGRAM:"The plugin directory %s specified by pluginRoot in project.config.json is the same as the miniprogram directory %s, please modify it to a different directory",CONTENT_EXIST:"%s already exists",FILE_NOT_FOUND:'"%s" file not found, or the file read failed',JSON_PARSE_ERROR:"%s File parsing error",ENTRANCE_NOT_FOUND:"No pages : %s defined in the entry page \napp.json is found",JSON_PAGE_FILE_NOT_EXISTS:'%s %s "%s" could not find the corresponding %s file',SHOULD_NOT_IN:"%s Should not exist in %s",JSON_CUSTOM_COMPILE_PATH_NOT_EXISTS_TITLE:"app.json or custom compilation condition error",JSON_CUSTOM_COMPILE_PATH_NOT_EXISTS:"The startup page %s specified in the custom compilation is not defined in app.json",JSON_ENTRY_PAGE_PATH_NOT_FOUND:"No entry page defined in %s is found in %s",JSON_TABBAR_AT_LEAST:'["tabBar"]["list"] must contain at least %s items',JSON_TABBAR_AT_MOST:'["tabBar"]["list"] cannot contain more than %s items',JSON_TABBAR_PATH_EMPTY:'["tabBar"]["list"][%s]["pagePath"] cannot be empty',JSON_TABBAR_PATH_SAME_WITH_OTHER:'["tabBar"]["list"][%s]["pagePath"] is same with ["tabBar"]["list"][%s]["pagePath"]',JSON_TABBAR_ICON_MAX_SIZE:'The size of ["tabBar"]["list"][%s]["%s"] exceeds %skb',JSON_TABBAR_ICON_EXT:'["tabBar"]["list"][%s]["%s"] Wrong file format, only %s format is supported',EXT_SHOULD_BE_ERROR:'extension name of %s should be "%s"',JSON_CONTENT_SHOULD_NOT_BE:"%s cannot be %s",JSON_RESOLVE_ALIAS_ILLEGAL:'Invalid %s or %s in resolveAlias field, contains consecutive "//"',JSON_RESOLVE_ALIAS_INCLUDE_STAR:'The key "%s" or value "%s" in resolveAlias field should end with "/*"',JSON_RESOLVE_ALIAS_SHOULD_NOT_START_WITH:'The value "%s" in resolveAlias field should not start with "./"',APP_JSON_SHOULD_SET_LAZYCODELOADING:'You need to add "lazyCodeLoading": "requiredComponents" in app.json, because the value of "renderer" in %s is "skyline"',PAGE_JSON_SHOULD_SET_DISABLESCROLL_TRUE:'According to the configuration of the page or app.json, the value of "renderer" in %s page is "skyline", you need to add "disableScroll": true in the page configuration',PAGE_JSON_SHOULD_SET_NAVIGATIONSTYLE_CUSTOM:'According to the configuration of the page or app.json, the value of "renderer" in %s page is "skyline", you need to add "navigationStyle": custom in the page configuration',JSON_CONTENT_EXISTED:"%s already exists",JSON_CONTENT_NOT_FOUND:"%s does not exist",LACK_OF_FILE:"File %s is missing",JSON_PAGES_REPEAT:"%s is repeated in %s",JSON_CONTENT_REPEAT:"%s could not be declared both in %s",EXT_JSON_INVALID:'%s is not a 3rdMiniProgramAppid, ext.json cannot take effect;Read the documentation: "%s"',GAME_EXT_JSON_INVALID:"%s is not a 3rdMiniGameAppid, ext.json cannot take effect;",EXT_APPID_SHOULD_NOT_BE_EMPTY:"extAppid should not be empty",FILE_NOT_UTF8:"%s file is not in UTF-8 encoding",INVALID:"invalid %s",DIRECTORY:"Directory",EXCEED_LIMIT:"%s exceed limit %s",PLEASE_CHOOSE_PLUGIN_MODE:"If you are developing a plugin, choose the plugin mode",TRIPLE_NUMBER_DOT:"number.number.number",PAGE_PATH:"Page Path",PLUGINS_SAME_ALIAS:"%s and %s have same alias",SAME_ITEM:'%s and %s have same "%s"',ALREADY_EXISTS:"already exists",SAME_KEY_PAGE_PUBLICCOMPONENTS:'There can not be the same key: %s in ["pages"] and ["publicComponents"]',GAME_DEV_PLUGIN_SHOULD_NOT_USE_LOCAL_PATH:"Dev plugin: %s shall never specify a local path",GAME_PLUGIN_SIGNATURE_MD5_NOT_MATCH_CONTENT:'MD5 hash of the plugin library file "%s": "%s" not matching the value "%s" given by its signature.json, thus the compiling process has been interrupted.\nThis indicates you might have changed the content of the file.\nRestore the original content of this file may help solve the issue and remove this warning.\n\nTo learn more, you may refer to the documentation.\n',FILE:"FILE",PROCESSING:"processing: %s",DONE:"done: %s",UPLOAD:"upload",SUCCESS:"success",PROJECT_TYPE_ERROR:"project.type is %s, but appid(%s) is %s",MINI_PROGRAM:"MiniProgram",MINI_GAME:"MiniGame",NOT_ALLOWED_REQUIRE_VAR:"Require variable is not allowed",NOT_ALLOWED_REQUIRE_ASSIGN:"Assigning the require function to other variables is not allowed",NOT_FOUND_NPM_ENTRY:"Npm package entry file not found",NOT_FOUND_NODE_MODULES:"NPM packages not found. Please confirm npm packages which need to build are belong to `miniprogramRoot` directory. Or you may edit project.config.json's `packNpmManually` and `packNpmRelationList`",JSON_ENTRANCE_DECLARE_PATH_ERR:'["entranceDeclare"]["locationMessage"]["path"] "%s" should belong to pages or pages in sub packages',JSON_ENTRANCE_DECLARE_PATH_EMPTY:'["entranceDeclare"]["locationMessage"]["path"] should not be empty',JSON_REQUIRED_PRIVATE_INFOS_MUTUALLY_EXCLUSIVE:"requiredPrivateInfos %s is is mutually exclusive with %s.",COULD_NOT_USE_CODE_PROTECT:"Code protect is not available",SUMMER_COMPILING_MODULE:"Compiling %s",SUMMER_COMPILE_JSON:"Compile jSON files",SUMMER_OPTIMIZE_CODE:"Optimize code",SUMMER_PACK_FILES:"Pack resource file",SUMMER_COMPRESS_PACK:"Compress code package",SUMMER_SEAL_PACK:"Seal code package",SUMMER_APPEND_BABEL_HELPERS:"Append babel helper files",SUMMER_COMPILE_PAGE_JSON:"Compile json files of %s pages",SUMMER_COMPILE_PLUGIN_PAGE_JSON:"Compiling json files of %s plugin pages",SUMMER_COMPILE:"Compile %s",SUMMER_COMPILE_MINIPROGRAM:"Compile miniprogram",SUMMER_COMPILE_PLUGIN:"Compile plugin"},formatConfig={};for(const[e,o]of Object.entries(config))formatConfig[e]=new fomatable_string_1.FormatableString(o);exports.default=formatConfig;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./fomatable_string":1679975017843}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017843, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.FormatableString=void 0;class FormatableString extends String{format(...t){const e=t[0];let r=this;return"[object Array]"===Object.prototype.toString.call(e)?(e.forEach(t=>{r=r.replace("%s",t)}),r):(t.forEach(t=>{r=r.replace("%s",t)}),""+r)}}exports.FormatableString=FormatableString;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017844, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const fomatable_string_1=require("./fomatable_string"),config={GENERATE_LOCAL_SIGNATURE_FAIL:"生成本地签名失败。通常是key文件编码或者内容有误。错误详情: %s",PARAM_ERROR:'方法："%s" 缺少参数："%s"',SHOULD_NOT_BE_EMPTY:"%s 不能为空",JSON_CONTENT_SHOULD_BE:"%s 字段需为 %s",SHOULD_AT_LEAST_ONE_ITEM:"%s 需至少存在一项",SHOULD_MATCH:"%s 需与 %s 匹配",SHOULD_EQUAL:"%s 需等于 %s",EXT_SHOULD_BE_ERROR:'%s 的拓展名需为 "%s"',OR:"或",CORRESPONDING_FILE_NOT_FOUND:"未找到 %s 对应的 %s 文件",JSON_SHOULD_NOT_START_WITH:"%s 不应该以 '%s' 开头",JSON_SHOULD_NOT_CONTAIN:"%s 不应该包含 %s",NOT_FOUND:"%s 未找到",NOT_FOUND_IN_ROOT_DIR:"在项目根目录未找到 %s ",MINIPROGRAM_APP_JSON_NOT_FOUND:"根据 project.config.json 中 miniprogramRoot 指定的小程序目录 %s，在该目录下未找到 %s。\n如果你不理解 miniprogramRoot 字段的含义，请在 project.config.json 中将 miniprogramRoot 设为空字符串。\n详见文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html",PLUGIN_JSON_NOT_FOUND:"根据 project.config.json 中 pluginRoot 指定的小程序本地开发插件目录 %s，%s 未找到",PLUGIN_PATH_SAME_WITH_MINIPROGRAM:"project.config.json 中 pluginRoot 指定的小程序本地开发插件目录 %s，与小程序目录 %s 相同，请修改为不同目录",FILE_NOT_FOUND:"未找到 %s 文件，或者文件读取失败",JSON_PARSE_ERROR:"%s 文件解析错误",ENTRANCE_NOT_FOUND:"未找到入口页面\napp.json 中定义的 pages : %s",JSON_PAGE_FILE_NOT_EXISTS:'未找到 %s 中的定义的 %s "%s" 对应的 %s 文件',SHOULD_NOT_IN:"%s 不应该在 %s 中",JSON_CUSTOM_COMPILE_PATH_NOT_EXISTS_TITLE:"app.json 或自定义编译条件错误",JSON_CUSTOM_COMPILE_PATH_NOT_EXISTS:"app.json 中未定义自定义编译中指定的启动页面 %s",JSON_ENTRY_PAGE_PATH_NOT_FOUND:"未在 %s 中找到 %s 定义的入口页面",JSON_TABBAR_AT_LEAST:'["tabBar"]["list"] 需至少包含 %s 项',JSON_TABBAR_AT_MOST:'["tabBar"]["list"] 不能超过 %s 项',JSON_TABBAR_PATH_EMPTY:'["tabBar"]["list"][%s]["pagePath"] 不能为空',JSON_TABBAR_PATH_SAME_WITH_OTHER:'["tabBar"]["list"][%s]["pagePath"] 和 ["tabBar"]["list"][%s]["pagePath"] 相同',JSON_TABBAR_ICON_MAX_SIZE:'["tabBar"]["list"][%s]["%s"] 大小超过 %skb',JSON_TABBAR_ICON_EXT:'["tabBar"]["list"][%s]["%s"] 文件格式错误，仅支持 %s 格式',JSON_CONTENT_SHOULD_NOT_BE:"%s 不能为 %s",JSON_RESOLVE_ALIAS_ILLEGAL:'resolveAlias 配置中 %s 或 %s 不合法，包含连续的 "//"',JSON_RESOLVE_ALIAS_INCLUDE_STAR:'resolveAlias 配置中 %s 或 %s 需要用 "/*" 结尾',JSON_RESOLVE_ALIAS_SHOULD_NOT_START_WITH:'resolveAlias 配置中 %s 不能以 "./" 开头',JSON_REQUIRED_PRIVATE_INFOS_MUTUALLY_EXCLUSIVE:"requiredPrivateInfos %s 与 %s 互斥",APP_JSON_SHOULD_SET_LAZYCODELOADING:'%s 中 "renderer" 设置为 "skyline"，需在 app.json 添加 "lazyCodeLoading": "requiredComponents"',PAGE_JSON_SHOULD_SET_DISABLESCROLL_TRUE:'根据页面或 app.json 的配置，%s 页面 "renderer" 为 "skyline"，需在页面配置中添加 "disableScroll": true',PAGE_JSON_SHOULD_SET_NAVIGATIONSTYLE_CUSTOM:'根据页面或 app.json 的配置，%s 页面 "renderer" 为 "skyline"，需在页面配置中添加 "navigationStyle": custom',CONTENT_EXIST:"%s 已经存在",JSON_CONTENT_EXISTED:"%s 已经存在",JSON_CONTENT_NOT_FOUND:"%s 不存在",LACK_OF_FILE:"缺少文件 %s",JSON_PAGES_REPEAT:"%s 在 %s 中重复",JSON_CONTENT_REPEAT:"%s 不能同时在 %s 中声明",EXT_JSON_INVALID:'%s 不是 3rdMiniProgramAppid, ext.json 无法生效；查看文档: "%s"',GAME_EXT_JSON_INVALID:'%s 不是 3rdMiniGameAppid, ext.json 无法生效；"%s"',EXT_APPID_SHOULD_NOT_BE_EMPTY:"extAppid 不能为空",FILE_NOT_UTF8:"%s 文件不是 UTF-8 格式",INVALID:"无效的 %s",DIRECTORY:"目录",EXCEED_LIMIT:"%s 超过限制 %s",PLEASE_CHOOSE_PLUGIN_MODE:"如果正在开发插件，请选择插件模式",TRIPLE_NUMBER_DOT:"数字.数字.数字",PAGE_PATH:"页面路径",PLUGINS_SAME_ALIAS:"%s 和 %s 的别名相同",SAME_ITEM:'%s 和 %s 的 "%s" 相同',ALREADY_EXISTS:"已存在",SAME_KEY_PAGE_PUBLICCOMPONENTS:'["pages"] 与 ["publicComponents"] 不能存在相同的 key: %s',GAME_DEV_PLUGIN_SHOULD_NOT_USE_LOCAL_PATH:"开发版插件 %s 不能使用 %s 指定本地路径",GAME_PLUGIN_SIGNATURE_MD5_NOT_MATCH_CONTENT:'插件文件 "%s" 的 MD5: "%s" 与其 signature.json 所给定的值: "%s" 不匹配, 因此编译过程已经中断。\n这表示此文件的内容可能已经被修改。\n恢复此文件的原始内容可能可以解决此问题并移除此警告。\n\n要了解更多，可以参考文档。\n',FILE:"文件",PROCESSING:"处理中: %s",DONE:"完成: %s",UPLOAD:"上传",SUCCESS:"成功",PROJECT_TYPE_ERROR:"project.type 是 %s, 但 appid(%s) 是 %s",MINI_PROGRAM:"小程序",MINI_GAME:"小游戏",NOT_ALLOWED_REQUIRE_VAR:"不允许require变量",NOT_ALLOWED_REQUIRE_ASSIGN:"不允许将require函数赋值给其他变量",NOT_FOUND_NPM_ENTRY:"未找到npm包入口文件",NOT_FOUND_NODE_MODULES:"没有找到可以构建的 NPM 包，请确认需要参与构建的 npm 都在 `miniprogramRoot` 目录内，或配置 project.config.json 的 packNpmManually 和 packNpmRelationList 进行构建",JSON_ENTRANCE_DECLARE_PATH_ERR:'["entranceDeclare"]["locationMessage"]["path"] "%s" 需在 pages 数组或分包 pages 数组中',JSON_ENTRANCE_DECLARE_PATH_EMPTY:'["entranceDeclare"]["locationMessage"]["path"] 不能为空',COULD_NOT_USE_CODE_PROTECT:"无法使用代码保护功能",SUMMER_COMPILING_MODULE:"编译 %s",SUMMER_COMPILE_JSON:"编译 JSON 文件",SUMMER_OPTIMIZE_CODE:"优化代码",SUMMER_PACK_FILES:"打包资源文件",SUMMER_COMPRESS_PACK:"压缩代码包",SUMMER_SEAL_PACK:"封装代码包",SUMMER_APPEND_BABEL_HELPERS:"追加 babel helper 文件",SUMMER_COMPILE_PAGE_JSON:"编译 %s 个页面json文件",SUMMER_COMPILE_PLUGIN_PAGE_JSON:"编译插件 %s 个页面json文件",SUMMER_COMPILE:"编译 %s",SUMMER_COMPILE_MINIPROGRAM:"编译打包小程序",SUMMER_COMPILE_PLUGIN:"编译打包插件"},formatConfig={};for(const[_,E]of Object.entries(config))formatConfig[_]=new fomatable_string_1.FormatableString(E);exports.default=formatConfig;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./fomatable_string":1679975017843}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017845, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.tcbTencentCloudUrl=exports.dbTencentCloudUrl=exports.scfTencentCloudUrl=exports.cloudCosUploadURL=exports.get3rdCloudCodeSecret=exports.cloudAPIAgentURL=exports.GET_LATEST_VERSION=exports.UPLOAD_JS_SERVER=exports.GET_ASYNC_RESULT=exports.GET_UPLOAD_TOKEN=exports.GET_CLOUD_API_SIGNATURE=exports.TRANSLATE_FILENAME=exports.GET_DEV_SOURCE_MAP=exports.GET_RAND_STRING=exports.GET_ONLINE_SCHEMA=exports.GET_WHITE_EXT_LIST=exports.TEST_SOURCE_URL=exports.UPLOAD_URL=exports.GET_ATTR_URL=void 0;const Domain="https://servicewechat.com";exports.GET_ATTR_URL=Domain+"/wxa/ci/getattr",exports.UPLOAD_URL=Domain+"/wxa/ci/upload",exports.TEST_SOURCE_URL=Domain+"/wxa/ci/testSourceURL",exports.GET_WHITE_EXT_LIST=Domain+"/wxa/ci/getwhiteextlist",exports.GET_ONLINE_SCHEMA=Domain+"/wxa/ci/getonlineschema",exports.GET_RAND_STRING=Domain+"/wxa/ci/getrandstr",exports.GET_DEV_SOURCE_MAP=Domain+"/wxa/ci/get_dev_sourcemap",exports.TRANSLATE_FILENAME=Domain+"/wxa/ci/translate_filename",exports.GET_CLOUD_API_SIGNATURE=Domain+"/wxa/ci/getqcloudapisignature",exports.GET_UPLOAD_TOKEN=Domain+"/wxa/ci/getuploadtoken",exports.GET_ASYNC_RESULT=Domain+"/wxa/ci/getasyncresult",exports.UPLOAD_JS_SERVER=Domain+"/wxa/ci/uploadjsserver",exports.GET_LATEST_VERSION=Domain+"/wxa/ci/getlatestversion",exports.cloudAPIAgentURL=Domain+"/wxa/ci/cloudapihttpagent",exports.get3rdCloudCodeSecret=Domain+"/wxa/ci/getcloudcodesecret",exports.cloudCosUploadURL=Domain+"/wxa/ci/cloudcosupload",exports.scfTencentCloudUrl="https://scf.tencentcloudapi.com",exports.dbTencentCloudUrl="https://flexdb.tencentcloudapi.com",exports.tcbTencentCloudUrl="https://tcb.tencentcloudapi.com";
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017846, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.jsonRespParse=exports.jsonParse=void 0;const tslib_1=require("tslib"),log_1=(0,tslib_1.__importDefault)(require("./log"));function jsonParse(e){try{return JSON.parse(e)}catch(r){throw log_1.default.info("jsonParse error, input string:"),log_1.default.info(e),r}}function jsonRespParse(e,r=""){try{return JSON.parse(e)}catch(s){throw log_1.default.info(`CGI[${r}] response parse error, response body: ${e}`),s}}exports.jsonParse=jsonParse,exports.jsonRespParse=jsonRespParse;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./log":1679975017836}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017847, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWorkersPath=exports.formatTime=exports.formatNumber=exports.generateMD5=exports.formatSourceMap=exports.isFileIncluded=exports.isFileIgnored=exports.leading=exports.trailing=exports.escapeQuot=exports.mkdirSync=exports.rmSync=exports.isHexColor=exports.formatJSONParseErr=exports.bufferToUtf8String=exports.getType=exports.normalizePath=void 0;const tslib_1=require("tslib"),fs_1=(0,tslib_1.__importDefault)(require("fs")),path_1=(0,tslib_1.__importDefault)(require("path")),babel_code_frame_1=(0,tslib_1.__importDefault)(require("babel-code-frame")),minimatch_1=(0,tslib_1.__importDefault)(require("minimatch")),crypto_1=(0,tslib_1.__importDefault)(require("crypto")),jsonlint=require("./jsonlint");function normalizePath(e=""){const t=path_1.default.posix.normalize(e.replace(/\\/g,"/"));return!e.startsWith("//")&&!e.startsWith("\\\\")||t.startsWith("//")?t:"/"+t}function getType(e){return Object.prototype.toString.call(e).toLowerCase().split(" ")[1].replace("]","")}exports.normalizePath=normalizePath,exports.getType=getType;const bufferToUtf8String=e=>{const t=e.toString();if(0===Buffer.compare(Buffer.from(t,"utf8"),e))return t};function getErrLine(e,t,r,o){r=r>0?r:1;return`${o}\n${(0,babel_code_frame_1.default)(e,t,r)}`}exports.bufferToUtf8String=bufferToUtf8String;const formatJSONParseErr=e=>{const t=e.data||"";try{jsonlint.parser.parse(t)}catch(r){try{const o=`Expecting ${r.expected}, got ${r.token}`,n=getErrLine(t,r.line,r.loc.first_column,o);return`${e.filePath}\n${n}`}catch(e){}}return`${e.filePath}\n${e.error}`};exports.formatJSONParseErr=formatJSONParseErr;const isHexColor=e=>/^#[a-f\d]{3}$/i.test(e)||/^#[a-f\d]{4}$/i.test(e)||/^#[a-f\d]{6}$/i.test(e)||/^#[a-f\d]{8}$/i.test(e);function rmSync(e){try{if(e=path_1.default.resolve(e),!fs_1.default.existsSync(e))return;if(fs_1.default.lstatSync(e).isDirectory()){const t=fs_1.default.readdirSync(e);if(t.length>0)for(let r=0,o=t.length;r<o;r++)rmSync(path_1.default.posix.join(e,t[r]));fs_1.default.rmdirSync(e)}else fs_1.default.unlinkSync(e)}catch(e){}}function mkdirSync(e){if(e=path_1.default.resolve(e),fs_1.default.existsSync(e)){if(fs_1.default.lstatSync(e).isDirectory())return;fs_1.default.unlinkSync(e)}mkdirSync(path_1.default.dirname(e)),fs_1.default.mkdirSync(e)}function escapeQuot(e,t="`"){return e?"`"===t?e.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$/g,"\\$"):'"'===t?e.replace(/\\/g,"\\\\").replace(/\r\n/g,"\n").replace(/\n/g,"\\n").replace(/"/g,'\\"'):"'"===t?e.replace(/\\/g,"\\\\").replace(/\r\n/g,"\n").replace(/\n/g,"\\n").replace(/'/g,"\\'"):e:e}function trailing(e,t,r=!1){return r?e.endsWith(t)?e.slice(0,e.length-1):e:e.endsWith(t)?e:e+t}function leading(e,t,r=!1){return r?e.startsWith(t)?e.slice(1):e:e.startsWith(t)?e:t+e}exports.isHexColor=isHexColor,exports.rmSync=rmSync,exports.mkdirSync=mkdirSync,exports.escapeQuot=escapeQuot,exports.trailing=trailing,exports.leading=leading;const FFSPRGRulesFactory=function(e){let t=null,r=Object.create(null);return function(e,o){if(o.length<1)return!1;if(t===o){if(void 0!==r[e])return r[e]}else t=o,r=Object.create(null);const n=e.replace(/\\/g,"/").toLowerCase();if(!n)return!1;const i=n.slice(n.lastIndexOf("/")+1);let a=!1;for(const e of o){if(!e)continue;const t=e.value.toLowerCase();if("prefix"===e.type)a=i.startsWith(t);else if("suffix"===e.type)a=i.endsWith(t);else if("folder"===e.type)a=leading(n,"/").startsWith(trailing(leading(t,"/"),"/"));else if("file"===e.type)a=leading(n,"/")===leading(t,"/");else if("glob"===e.type)try{a=(0,minimatch_1.default)(n,t)||(0,minimatch_1.default)(leading(n,"/"),t)}catch(e){a=!1}else if("regexp"===e.type)try{a=new RegExp(t,"igm").test(n)||new RegExp(t,"igm").test(leading(n,"/"))}catch(e){a=!1}if(a)break}return r[e]=a,a}};function formatSourceMap(e){if(e){if("string"===getType(e))return e;try{return JSON.stringify(e)}catch(e){}}}function generateMD5(e){const t=crypto_1.default.createHash("md5");return t.update(e),t.digest("hex")}exports.isFileIgnored=FFSPRGRulesFactory(),exports.isFileIncluded=FFSPRGRulesFactory(),exports.formatSourceMap=formatSourceMap,exports.generateMD5=generateMD5;const formatNumber=e=>e>9?""+e:"0"+e;exports.formatNumber=formatNumber;const formatTime=e=>{const t=e.getFullYear(),r=e.getMonth()+1,o=e.getDate(),n=e.getHours(),i=e.getMinutes(),a=e.getSeconds();return`${[t,r,o].map(exports.formatNumber).join("/")} ${[n,i,a].map(exports.formatNumber).join(":")}`};exports.formatTime=formatTime;const getWorkersPath=e=>"string"==typeof e?e:e.path;exports.getWorkersPath=getWorkersPath;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"fs":1679975017848,"./jsonlint":1679975017850}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017848, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const fsagent_1=require("./fsagent");exports.default=new fsagent_1.FSAgent;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./fsagent":1679975017849}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017849, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.FSAgent=void 0;const tslib_1=require("tslib"),fs_1=(0,tslib_1.__importDefault)(require("fs")),log_1=(0,tslib_1.__importDefault)(require("./log")),tools_1=require("./tools");class FSAgent{constructor(e){e&&(this._agent=e)}setAgent(e){this._agent=e}stat(e){var t;return e=(0,tools_1.normalizePath)(e),(null===(t=this._agent)||void 0===t?void 0:t.stat)?(log_1.default.debug("FSAgent use agent.stat for "+e),this._agent.stat(e)):new Promise((t,r)=>{log_1.default.debug("FSAgent use fs.stat for "+e),fs_1.default.stat(e,(e,i)=>{if(e)return r(e);t(i)})})}exists(e){var t;return e=(0,tools_1.normalizePath)(e),(null===(t=this._agent)||void 0===t?void 0:t.exists)?(log_1.default.debug("FSAgent use agent.exists for "+e),this._agent.exists(e)):new Promise((t,r)=>{log_1.default.debug("FSAgent use fs.exists for "+e),fs_1.default.exists(e,e=>{t(e)})})}readFile(e){var t;return e=(0,tools_1.normalizePath)(e),(null===(t=this._agent)||void 0===t?void 0:t.readFile)?(log_1.default.debug("FSAgent use agent.readFile for "+e),this._agent.readFile(e)):new Promise((t,r)=>{log_1.default.debug("FSAgent use fs.readFile for "+e),fs_1.default.readFile(e,null,(e,i)=>{if(e)return r(e);t(i)})})}writeFile(e,t,r=null){var i;return e=(0,tools_1.normalizePath)(e),(null===(i=this._agent)||void 0===i?void 0:i.writeFile)?(log_1.default.debug("FSAgent use agent.writeFile for "+e),this._agent.writeFile(e,t,r)):new Promise((i,s)=>{log_1.default.debug("FSAgent use fs.writeFile for "+e),fs_1.default.writeFile(e,t,r,e=>{if(e)return s(e);i()})})}readdir(e){var t;return e=(0,tools_1.normalizePath)(e),(null===(t=this._agent)||void 0===t?void 0:t.readdir)?(log_1.default.debug("FSAgent use agent.readdir for "+e),this._agent.readdir(e)):new Promise((t,r)=>{fs_1.default.readdir(e,(e,i)=>{if(e)return r(e);t(i)})})}}exports.FSAgent=FSAgent;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"fs":1679975017848,"./log":1679975017836,"./tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017850, function(require, module, exports) {
!function(require, directRequire){
const jsonlint=function(){const t={trace:function(){},yy:{},symbols_:{error:2,JSONString:3,STRING:4,JSONNumber:5,NUMBER:6,JSONNullLiteral:7,NULL:8,JSONBooleanLiteral:9,TRUE:10,FALSE:11,JSONText:12,JSONValue:13,EOF:14,JSONObject:15,JSONArray:16,"{":17,"}":18,JSONMemberList:19,JSONMember:20,":":21,",":22,"[":23,"]":24,JSONElementList:25,$accept:0,$end:1},terminals_:{2:"error",4:"STRING",6:"NUMBER",8:"NULL",10:"TRUE",11:"FALSE",14:"EOF",17:"{",18:"}",21:":",22:",",23:"[",24:"]"},productions_:[0,[3,1],[5,1],[7,1],[9,1],[9,1],[12,2],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[15,2],[15,3],[20,3],[19,1],[19,3],[16,2],[16,3],[25,1],[25,3]],performAction:function(t,e,n,i,s,r,h){const l=r.length-1;switch(s){case 1:this.$=t.replace(/\\(\\|")/g,"$1").replace(/\\n/g,"\n").replace(/\\r/g,"\r").replace(/\\t/g,"\t").replace(/\\v/g,"\v").replace(/\\f/g,"\f").replace(/\\b/g,"\b");break;case 2:this.$=Number(t);break;case 3:this.$=null;break;case 4:this.$=!0;break;case 5:this.$=!1;break;case 6:return this.$=r[l-1];case 13:this.$={};break;case 14:this.$=r[l-1];break;case 15:this.$=[r[l-2],r[l]];break;case 16:this.$={},this.$[r[l][0]]=r[l][1];break;case 17:this.$=r[l-2],r[l-2][r[l][0]]=r[l][1];break;case 18:this.$=[];break;case 19:this.$=r[l-1];break;case 20:this.$=[r[l]];break;case 21:this.$=r[l-2],r[l-2].push(r[l])}},table:[{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],12:1,13:2,15:7,16:8,17:[1,14],23:[1,15]},{1:[3]},{14:[1,16]},{14:[2,7],18:[2,7],22:[2,7],24:[2,7]},{14:[2,8],18:[2,8],22:[2,8],24:[2,8]},{14:[2,9],18:[2,9],22:[2,9],24:[2,9]},{14:[2,10],18:[2,10],22:[2,10],24:[2,10]},{14:[2,11],18:[2,11],22:[2,11],24:[2,11]},{14:[2,12],18:[2,12],22:[2,12],24:[2,12]},{14:[2,3],18:[2,3],22:[2,3],24:[2,3]},{14:[2,4],18:[2,4],22:[2,4],24:[2,4]},{14:[2,5],18:[2,5],22:[2,5],24:[2,5]},{14:[2,1],18:[2,1],21:[2,1],22:[2,1],24:[2,1]},{14:[2,2],18:[2,2],22:[2,2],24:[2,2]},{3:20,4:[1,12],18:[1,17],19:18,20:19},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:23,15:7,16:8,17:[1,14],23:[1,15],24:[1,21],25:22},{1:[2,6]},{14:[2,13],18:[2,13],22:[2,13],24:[2,13]},{18:[1,24],22:[1,25]},{18:[2,16],22:[2,16]},{21:[1,26]},{14:[2,18],18:[2,18],22:[2,18],24:[2,18]},{22:[1,28],24:[1,27]},{22:[2,20],24:[2,20]},{14:[2,14],18:[2,14],22:[2,14],24:[2,14]},{3:20,4:[1,12],20:29},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:30,15:7,16:8,17:[1,14],23:[1,15]},{14:[2,19],18:[2,19],22:[2,19],24:[2,19]},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:31,15:7,16:8,17:[1,14],23:[1,15]},{18:[2,17],22:[2,17]},{18:[2,15],22:[2,15]},{22:[2,21],24:[2,21]}],defaultActions:{16:[2,6]},parseError:function(t,e){throw new Error(t)},parse:function(t){const e=this;let n=[0],i=[null],s=[];const r=this.table;let h="",l=0,o=0,c=0;this.lexer.setInput(t),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,void 0===this.lexer.yylloc&&(this.lexer.yylloc={});let a,u,y,p,f,g,_,m,x,b=this.lexer.yylloc;function d(){let t;return t=e.lexer.lex()||1,"number"!=typeof t&&(t=e.symbols_[t]||t),t}s.push(b),"function"==typeof this.yy.parseError&&(this.parseError=this.yy.parseError);const E={};for(;;){y=n[n.length-1],this.defaultActions[y]?p=this.defaultActions[y]:(null==a&&(a=d()),p=r[y]&&r[y][a]);let t="";if(void 0===p||!p.length||!p[0]){if(!c){for(g in x=[],r[y])this.terminals_[g]&&g>2&&x.push("'"+this.terminals_[g]+"'");t=this.lexer.showPosition?"Parse error on line "+(l+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+x.join(", ")+", got '"+this.terminals_[a]+"'":"Parse error on line "+(l+1)+": Unexpected "+(1===a?"end of input":"'"+(this.terminals_[a]||a)+"'"),this.parseError(t,{text:this.lexer.match,token:this.terminals_[a]||a,line:this.lexer.yylineno,loc:b,expected:x})}if(3===c){if(1===a)throw new Error(t||"Parsing halted.");o=this.lexer.yyleng,h=this.lexer.yytext,l=this.lexer.yylineno,b=this.lexer.yylloc,a=d()}for(;!(2..toString()in r[y]);){if(0===y)throw new Error(t||"Parsing halted.");S=1,n.length=n.length-2*S,i.length=i.length-S,s.length=s.length-S,y=n[n.length-1]}u=a,a=2,y=n[n.length-1],p=r[y]&&r[y][2],c=3}if(p[0]instanceof Array&&p.length>1)throw new Error("Parse Error: multiple actions possible at state: "+y+", token: "+a);switch(p[0]){case 1:n.push(a),i.push(this.lexer.yytext),s.push(this.lexer.yylloc),n.push(p[1]),a=null,u?(a=u,u=null):(o=this.lexer.yyleng,h=this.lexer.yytext,l=this.lexer.yylineno,b=this.lexer.yylloc,c>0&&c--);break;case 2:if(_=this.productions_[p[1]][1],E.$=i[i.length-_],E._$={first_line:s[s.length-(_||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(_||1)].first_column,last_column:s[s.length-1].last_column},f=this.performAction.call(E,h,o,l,this.yy,p[1],i,s),void 0!==f)return f;_&&(n=n.slice(0,-1*_*2),i=i.slice(0,-1*_),s=s.slice(0,-1*_)),n.push(this.productions_[p[1]][0]),i.push(E.$),s.push(E._$),m=r[n[n.length-2]][n[n.length-1]],n.push(m);break;case 3:return!0}}var S;return!0}},e=function(){const t={EOF:1,parseError:function(t,e){if(!this.yy.parseError)throw new Error(t);this.yy.parseError(t,e)},setInput:function(t){return this._input=t,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this},input:function(){const t=this._input[0];this.yytext+=t,this.yyleng++,this.match+=t,this.matched+=t;return t.match(/\n/)&&this.yylineno++,this._input=this._input.slice(1),t},unput:function(t){return this._input=t+this._input,this},more:function(){return this._more=!0,this},less:function(t){this._input=this.match.slice(t)+this._input},pastInput:function(){const t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){let t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){const t=this.pastInput(),e=new Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},next:function(){if(this.done)return this.EOF;let t,e,n,i,s;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");const r=this._currentRules();for(let t=0;t<r.length&&(n=this._input.match(this.rules[r[t]]),!n||e&&!(n[0].length>e[0].length)||(e=n,i=t,this.options.flex));t++);return e?(s=e[0].match(/\n.*/g),s&&(this.yylineno+=s.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:s?s[s.length-1].length-1:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.yyleng=this.yytext.length,this._more=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],t=this.performAction.call(this,this.yy,this,r[i],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),t||void 0):""===this._input?this.EOF:void this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){const t=this.next();return void 0!==t?t:this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(t){this.begin(t)},options:{},performAction:function(t,e,n,i){switch(n){case 0:break;case 1:return 6;case 2:return e.yytext=e.yytext.substr(1,e.yyleng-2),4;case 3:return 17;case 4:return 18;case 5:return 23;case 6:return 24;case 7:return 22;case 8:return 21;case 9:return 10;case 10:return 11;case 11:return 8;case 12:return 14;case 13:return"INVALID"}},rules:[/^(?:\s+)/,/^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/,/^(?:"(?:\\[\\"bfnrt/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:null\b)/,/^(?:$)/,/^(?:.)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13],inclusive:!0}}};return t}();return t.lexer=e,t}();jsonlint.parseError=jsonlint.lexer.parseError=function(t,e){throw e},module.exports={parser:jsonlint,parse:function(){return jsonlint.parse.apply(jsonlint,arguments)}};
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017851, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getProjectConfigJSON=void 0;const tslib_1=require("tslib"),lodash_1=require("lodash"),common_1=require("../../utils/common"),common_2=require("./common"),schemaValidate_1=require("../validate/schemaValidate"),cache_1=require("../../utils/cache"),tools_1=require("../../utils/tools"),config_1=require("../../config"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),reactiveCache_1=require("./reactiveCache"),PROJECT_CONFIG_JSON="project.config.json",rootConfig=["svr","client","qcloudRoot","miniprogramRoot","pluginRoot","cloudfunctionRoot","jsserverRoot","testRoot"];function formatPath(o=""){return o&&"/"!==o?(o=(0,tools_1.normalizePath)(o+"/")).replace(/^(\/)*/,"").replace(/\.\.\//g,"").replace(/^\.\//,""):""}const _getProjectConfigJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.PROJECT_CONFIG,o=>{if(!o.stat("",PROJECT_CONFIG_JSON))return o.type!==config_1.COMPILE_TYPE.miniGamePlugin&&o.type!==config_1.COMPILE_TYPE.miniProgramPlugin||(0,common_1.throwError)({msg:locales_1.default.config.NOT_FOUND.format("project.config.json"),code:config_1.FILE_NOT_FOUND,filePath:PROJECT_CONFIG_JSON}),{};const e=o.getFile("",PROJECT_CONFIG_JSON),r=(0,common_1.checkUTF8)(e,PROJECT_CONFIG_JSON),t=(0,common_2.checkJSONFormat)(r,PROJECT_CONFIG_JSON),i=(0,schemaValidate_1.schemaValidate)("projectconfig",t);if(i.error.length){const o=i.error.map(o=>"type"===o.errorType||"enum"===o.errorType||"anyOf"===o.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([o.errorProperty,o.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([o.requireProperty])).join("\n");(0,common_1.throwError)({msg:o,filePath:PROJECT_CONFIG_JSON})}return o.miniprogramRoot=t.miniprogramRoot||"",o.pluginRoot=t.pluginRoot||"",rootConfig.forEach(o=>{"string"==typeof t[o]?t[o]=formatPath(t[o]):t[o]=""}),o.type!==config_1.COMPILE_TYPE.miniGamePlugin&&o.type!==config_1.COMPILE_TYPE.miniProgramPlugin||t.pluginRoot||(0,common_1.throwError)({msg:locales_1.default.config.SHOULD_NOT_BE_EMPTY.format('["pluginRoot"]'),filePath:PROJECT_CONFIG_JSON}),o.type!==config_1.COMPILE_TYPE.miniGamePlugin&&o.type!==config_1.COMPILE_TYPE.miniProgramPlugin||t.pluginRoot!==t.miniprogramRoot||(0,common_1.throwError)({msg:locales_1.default.config.PLUGIN_PATH_SAME_WITH_MINIPROGRAM.format([t.pluginRoot,t.miniprogramRoot]),filePath:PROJECT_CONFIG_JSON}),t}),getProjectConfigJSON=function(o){return(0,lodash_1.cloneDeep)(_getProjectConfigJSON(o))};exports.getProjectConfigJSON=getProjectConfigJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/common":1679975017852,"./common":1679975017853,"../validate/schemaValidate":1679975017857,"../../utils/cache":1679975017855,"../../utils/tools":1679975017847,"../../config":1679975017839,"../../utils/locales/locales":1679975017841,"./reactiveCache":1679975017856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017852, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getAllTargetTypeFilesWithOtherTypeFilesOfSameName=exports.checkPath=exports.ECheckPathType=exports.checkUTF8=exports.throwError=exports.getAllPagesInfo=exports.getAllPages=void 0;const tslib_1=require("tslib"),tools_1=require("./tools"),config_1=require("../config"),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("./locales/locales")),getAllPages=e=>{const t=[...e.pages];if(e.subPackages)for(const o of e.subPackages)for(const e of o.pages)t.push((0,tools_1.normalizePath)(path_1.default.posix.join(o.root,e)));return t};exports.getAllPages=getAllPages;const getAllPagesInfo=e=>{const t=e.pages.map(e=>({path:e,root:config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT,name:config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT}));if(e.subPackages)for(const o of e.subPackages)for(const e of o.pages)t.push({path:(0,tools_1.normalizePath)(path_1.default.posix.join(o.root,e)),root:o.root,name:o.name||""});return t};function throwError(e){const{msg:t,code:o=config_1.JSON_CONTENT_ERR,filePath:r}=e,a=new Error(`${r}: ${t}`);throw a.code=o,a.path=r,a}function checkUTF8(e,t){let o="";try{o=(0,tools_1.bufferToUtf8String)(e)}catch(e){o=""}return void 0===o&&throwError({msg:locales_1.default.config.FILE_NOT_UTF8.format(t),code:config_1.FILE_NOT_UTF8,filePath:t}),o}var ECheckPathType;function checkPath(e){const{value:t,tips:o,filePath:r="app.json",code:a=config_1.JSON_CONTENT_ERR,checkPathType:s=e.checkPathType||ECheckPathType.NORMAL}=e;"string"!==(0,tools_1.getType)(t)&&throwError({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([o,"string"]),code:a,filePath:r}),""===t&&throwError({msg:locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format([o,"''"]),code:a,filePath:r}),t.includes("\\")&&throwError({msg:locales_1.default.config.JSON_SHOULD_NOT_CONTAIN.format([o,"\\"]),code:a,filePath:r}),t.includes("//")&&throwError({msg:locales_1.default.config.JSON_SHOULD_NOT_CONTAIN.format([o,"//"]),code:a,filePath:r}),s===ECheckPathType.NORMAL&&t.startsWith(".")&&throwError({msg:locales_1.default.config.JSON_SHOULD_NOT_START_WITH.format([o,"."]),code:a,filePath:r}),s===ECheckPathType.NORMAL&&t.startsWith("/")&&throwError({msg:locales_1.default.config.JSON_SHOULD_NOT_START_WITH.format([o,"/"]),code:a,filePath:r}),t.startsWith(" ")&&throwError({msg:locales_1.default.config.JSON_SHOULD_NOT_START_WITH.format([o," "]),code:a,filePath:r}),(t.includes("../")||t.endsWith("/.."))&&throwError({msg:locales_1.default.config.JSON_SHOULD_NOT_CONTAIN.format([o,"../"]),code:a,filePath:r})}function getAllTargetTypeFilesWithOtherTypeFilesOfSameName(e,t,o,r){if(!t)return[];const a=e.getFileList(r,t);if(!o||0===o.length)return a;const s=o.map(t=>new Set(e.getFileList(r,t).map(e=>e.slice(0,-t.length))));return a.map(e=>e.slice(0,-t.length)).filter(e=>s.every(t=>t.has(e))).map(e=>`${e}${t}`)}exports.getAllPagesInfo=getAllPagesInfo,exports.throwError=throwError,exports.checkUTF8=checkUTF8,function(e){e.NORMAL="NORMAL",e.TAB_BAR_ICON="TAB_BAR_ICON"}(ECheckPathType=exports.ECheckPathType||(exports.ECheckPathType={})),exports.checkPath=checkPath,exports.getAllTargetTypeFilesWithOtherTypeFilesOfSameName=getAllTargetTypeFilesWithOtherTypeFilesOfSameName;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./tools":1679975017847,"../config":1679975017839,"./locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017853, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.transValidateResult=exports.getPageJSONVariableDecalearProperty=exports.checkComponentPath=exports.getUseExtendLib=exports.checkFilePathIsInIndependentSubpackage=exports.checkPagePathIsInIndependentSubpackage=exports.checkPagePathIsInSubPackage=exports.checkJSONFormat=void 0;const tslib_1=require("tslib"),tools_1=require("../../utils/tools"),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),common_1=require("../../utils/common"),config_1=require("../../config"),lodash_1=require("lodash"),getAppJSON_1=require("./app/getAppJSON");function checkJSONFormat(e,t){let o={};e||(0,common_1.throwError)({filePath:t,msg:"Empty file is NOT a valid json file",code:config_1.JSON_PARSE_ERR});try{o=JSON.parse(e)}catch(o){const n=(0,tools_1.formatJSONParseErr)({filePath:t,data:e,error:o});(0,common_1.throwError)({filePath:t,msg:n,code:config_1.JSON_PARSE_ERR})}return o}function checkPagePathIsInSubPackage(e,t){const{subPackages:o,subpackages:n}=e;if(o||n)for(const e of o||n)if(0===t.indexOf(e.root))return e}function checkPagePathIsInIndependentSubpackage(e,t){const o=checkPagePathIsInSubPackage(e,t);if(o&&!0===o.independent)return o}function checkFilePathIsInIndependentSubpackage(e,t){const{subPackages:o}=e;if(o)for(const e of o)if(!0===e.independent){const o=e.root.replace(/^\//,"");if(0===t.indexOf(o))return o}}function checkNodeModulesFile(e,t,o,n){let a=path_1.default.posix.join(o,"index")+".json",r=e.stat(t,a);return(null==r?void 0:r.isFile)?a:(a=path_1.default.posix.join(o,n)+".json",r=e.stat(t,a),(null==r?void 0:r.isFile)?a:(a=o+".json",r=e.stat(t,a),(null==r?void 0:r.isFile)?a:""))}function resolveComponentPath(e,t,o,n){n=(0,tools_1.normalizePath)(n);let a=path_1.default.posix.join(o,n)+".json";const r=e.stat(t,a);if(null==r?void 0:r.isFile)return n;let i=o.split(path_1.default.posix.sep);for(i=i.filter(e=>!!e),a="";i.length;){if(a=checkNodeModulesFile(e,t,path_1.default.posix.join(i.join(path_1.default.posix.sep),"miniprogram_npm",n),n),a)break;i.pop()}if(!a){a=checkNodeModulesFile(e,t,path_1.default.posix.join("miniprogram_npm",n),n)}return a&&(/\.json$/.test(a)&&(a=a.substring(0,a.length-5)),a=path_1.default.posix.relative(o,a)),a}exports.checkJSONFormat=checkJSONFormat,exports.checkPagePathIsInSubPackage=checkPagePathIsInSubPackage,exports.checkPagePathIsInIndependentSubpackage=checkPagePathIsInIndependentSubpackage,exports.checkFilePathIsInIndependentSubpackage=checkFilePathIsInIndependentSubpackage;const innerCheckComponentPath=e=>{const{value:t,tips:o,project:n,root:a,relativePath:r}=e,i=path_1.default.posix.join(a,r);if(t.startsWith("plugin://")||t.startsWith("plugin-private://"))return t;const s=(0,exports.getUseExtendLib)(n,r);if(t.startsWith("/")){if(s.length){const e=s.map(e=>"/miniprogram_npm/"+e);let o=!1;for(const n of e)if(t.startsWith(n)){o=!0;break}if(o)return t}if(n.stat(a,t+".json"))return t;if(n.stat(a,t+"/index.json"))return t+"/index";(0,common_1.throwError)({msg:locales_1.default.config.NOT_FOUND.format(o),filePath:i})}if(t.startsWith(".")){if(t.startsWith("../")){const e=t.replace(/^(\.\.\/)+/,"");if(n.stat(a,path_1.default.posix.join(`/${e}.json`)))return t;if(n.stat(a,path_1.default.posix.join(`/${e}/index.json`)))return t+"/index"}if(n.stat(a,path_1.default.posix.join(path_1.default.posix.dirname(r),t+".json")))return t;if(n.stat(a,path_1.default.posix.join(path_1.default.posix.dirname(r),t+"/index.json")))return t+"/index";(0,common_1.throwError)({msg:locales_1.default.config.NOT_FOUND.format(`${o}: "${t}"`),filePath:i})}for(const e of s)if(t.startsWith(e))return"miniprogram-element"===e?`/miniprogram_npm/${e}/index`:t.replace(e,"/miniprogram_npm/"+e);const c=resolveComponentPath(n,a,path_1.default.posix.dirname(r),t);return c||(0,common_1.throwError)({msg:locales_1.default.config.NOT_FOUND.format(`${o}: "${t}"`),filePath:i}),c.startsWith(".")?c:"./"+c},getUseExtendLib=(e,t)=>{var o;const n=(0,getAppJSON_1.getRawAppJSON)(e);let a=[];if("[object Object]"===Object.prototype.toString.call(n.useExtendedLib)){const e=Object.keys(config_1.extendedLibMap),t=Object.keys(n.useExtendedLib).filter(t=>!e.includes(t));t.length&&(0,common_1.throwError)({msg:t.join(", ")+' is not allowed in ["useExtendedLib"]',filePath:"app.json"}),a=Object.keys(n.useExtendedLib||{}).filter(e=>n.useExtendedLib[e]).map(e=>config_1.extendedLibMap[e].packages),a=(0,lodash_1.flattenDeep)(a)}const r=checkPagePathIsInSubPackage(n,t);if((null==r?void 0:r.useExtendedLib)&&"[object Object]"===Object.prototype.toString.call(r.useExtendedLib)){const e=Object.keys(config_1.extendedLibMap),t=Object.keys(r.useExtendedLib).filter(t=>!e.includes(t));t.length&&(0,common_1.throwError)({msg:`${t.join(", ")} is not allowed in subPackages[${null===(o=n.subPackages)||void 0===o?void 0:o.indexOf(r)}]["useExtendedLib"]`,filePath:"app.json"});const i=Object.keys(r.useExtendedLib||{}).filter(e=>r.useExtendedLib[e]).map(e=>config_1.extendedLibMap[e].packages);a=(0,lodash_1.uniq)(a.concat((0,lodash_1.flattenDeep)(i)))}return a};exports.getUseExtendLib=getUseExtendLib;const checkComponentPath=e=>{const{project:t,root:o,relativePath:n,inputJSON:a}=e,{usingComponents:r,componentGenerics:i}=a;if(r)for(const e in r){const a=r[e]||"";r[e]=innerCheckComponentPath({tips:`["usingComponents"]["${e}"]`,value:a,project:t,root:o,relativePath:n})}if(i)for(const e in i){const a="object"==typeof i[e],r=a?i[e].default:i[e];if(!r||"string"!=typeof r)continue;const s=innerCheckComponentPath({tips:`["componentGenerics"]["${e}"]`,value:r,project:t,root:o,relativePath:n});a?i[e].default=s:i[e]=s}};function getPageJSONVariableDecalearProperty(e){const{windowPropertWhiteList:t}=config_1.jsonVariablePropertyWhiteList;let o=[];return"[object Object]"===Object.prototype.toString.call(e)&&(o=o.concat(Object.keys(e).filter(e=>t.includes(e)).map(t=>({property:`["${t}"]`,value:e[t]})).filter(e=>e.value.startsWith("@")))),o}function transValidateResult(e){return e.error.map(e=>"type"===e.errorType||"enum"===e.errorType||"anyOf"===e.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([e.errorProperty,e.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([e.requireProperty])).join("\n")}exports.checkComponentPath=checkComponentPath,exports.getPageJSONVariableDecalearProperty=getPageJSONVariableDecalearProperty,exports.transValidateResult=transValidateResult;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/tools":1679975017847,"../../utils/locales/locales":1679975017841,"../../utils/common":1679975017852,"../../config":1679975017839,"./app/getAppJSON":1679975017854}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017854, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getAppJSON=exports.getRawAppJSON=exports.checkAppJSON=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),projectconfig_1=require("../projectconfig"),common_1=require("../../../utils/common"),config_1=require("../../../config"),common_2=require("../common"),cache_1=require("../../../utils/cache"),lodash_1=require("lodash"),schemaValidate_1=require("../../validate/schemaValidate"),tools_1=require("../../../utils/tools"),theme_1=require("../theme"),reactiveCache_1=require("../reactiveCache"),checkAppFields_1=require("./checkAppFields");function transValidateResult(e){return e.error.map(e=>{if("type"===e.errorType||"enum"===e.errorType||"anyOf"===e.errorType)return locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([e.errorProperty,e.correctType]);{const c=""===e.errorProperty?e.requireProperty:`${e.errorProperty}.${e.requireProperty}`;return locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([c])}}).join("\n")}function checkAppJSON(e){const{inputJSON:c}=e;let{filePath:r}=e;const a=(0,theme_1.getThemeLocation)(e.project);if(!a){const e=(0,checkAppFields_1.getAppJSONVariableDecalearProperty)(c);e.length&&(0,common_1.throwError)({msg:'appJSON["themeLocation"] is required because:\n'+e.map(e=>`"${e.value}" as variable was declared at ${r}:${e.property}`).join("\n"),filePath:r})}let o={light:{},dark:{}};a&&(o=(0,theme_1.checkThemeJSON)(e.project,{themeLocation:a}));const t=(0,theme_1.mergeThemeJSONToAppJSON)(o,c),p=(0,checkAppFields_1.getAppJSONVariableDecalearProperty)(t.appJSONLight);p.length&&(0,common_1.throwError)({msg:p.map(e=>`"${e.value}" as variable was declared at ${r}:${e.property}, but not found at ${a}["light"]`).join("\n"),filePath:r});const i=(0,checkAppFields_1.getAppJSONVariableDecalearProperty)(t.appJSONDark);i.length&&(0,common_1.throwError)({msg:i.map(e=>`"${e.value}" as variable was declared at ${r}:${e.property}, but not found at ${a}["dark"]`).join("\n"),filePath:r});const n=(0,schemaValidate_1.schemaValidate)("app",t.appJSONLight),l=(0,schemaValidate_1.schemaValidate)("app",t.appJSONDark);if(n.warning&&(c.__warning__=locales_1.default.config.INVALID.format(n.warning)),a&&l.warning&&(c.__warning__=locales_1.default.config.INVALID.format(l.warning)),n.error.length){const e=transValidateResult(n);a&&(r+=` or ${a}["light"]`),(0,common_1.throwError)({msg:e,filePath:r})}if(a&&l.error.length){const e=transValidateResult(l);a&&(r+=` or ${a}["dark"]`),(0,common_1.throwError)({msg:e,filePath:r})}const s=Object.assign(Object.assign({},e),{mode:"light",inputJSON:t.appJSONLight}),h=Object.assign(Object.assign({},e),{mode:"dark",inputJSON:t.appJSONDark});(0,checkAppFields_1.checkMainPkgPages)(e),(0,checkAppFields_1.checkSubpackages)(e),(0,checkAppFields_1.checkTabbar)(s),a&&(0,checkAppFields_1.checkTabbar)(h),(0,checkAppFields_1.checkWorkers)(e),(0,checkAppFields_1.checkFunctionalPages)(e),(0,checkAppFields_1.checkOpenLocationPagePath)(e),(0,checkAppFields_1.checkOpenDataContext)(e,c),(0,checkAppFields_1.checkPlugins)(e),(0,checkAppFields_1.checkWindow)(s),a&&(0,checkAppFields_1.checkWindow)(h),(0,checkAppFields_1.checkComponentPath)(e);const _=(0,common_1.getAllPagesInfo)(c);return(0,checkAppFields_1.checkEntryPagePath)(e,_),(0,checkAppFields_1.checkPreloadRule)(e,_),(0,checkAppFields_1.checkTabbarPage)(e),(0,checkAppFields_1.checkMainPkgPageIsInSubpkg)(e),(0,checkAppFields_1.checkMainPkgPluginIsInSubPkg)(e),(0,checkAppFields_1.checkEntranceDeclare)(e),(0,checkAppFields_1.checkRenderer)(e),(0,checkAppFields_1.checkResolveAlias)(e),(0,checkAppFields_1.checkRequiredPrivateInfos)(e),c}exports.checkAppJSON=checkAppJSON,exports.getRawAppJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.RAW_APP_JSON,e=>{const c=(0,projectconfig_1.getProjectConfigJSON)(e),{miniprogramRoot:r=""}=c,a=(0,tools_1.normalizePath)(path_1.default.posix.join(r,"app.json"));e.stat(r,"app.json")||(""===r?(0,common_1.throwError)({msg:locales_1.default.config.NOT_FOUND_IN_ROOT_DIR.format(a),code:config_1.FILE_NOT_FOUND,filePath:a}):(0,common_1.throwError)({msg:locales_1.default.config.MINIPROGRAM_APP_JSON_NOT_FOUND.format(r,"app.json"),code:config_1.FILE_NOT_FOUND,filePath:a}));const o=e.getFile(r,"app.json");return(0,common_2.checkJSONFormat)((0,common_1.checkUTF8)(o,a),a)}),exports.getAppJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.APP_JSON,e=>{const c=(0,lodash_1.cloneDeep)((0,exports.getRawAppJSON)(e)),r=(0,projectconfig_1.getProjectConfigJSON)(e),{miniprogramRoot:a=""}=r;return checkAppJSON({project:e,miniprogramRoot:a,filePath:(0,tools_1.normalizePath)(path_1.default.posix.join(a,"app.json")),inputJSON:c}),c});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/locales/locales":1679975017841,"../projectconfig":1679975017851,"../../../utils/common":1679975017852,"../../../config":1679975017839,"../common":1679975017853,"../../../utils/cache":1679975017855,"../../validate/schemaValidate":1679975017857,"../../../utils/tools":1679975017847,"../theme":1679975017867,"../reactiveCache":1679975017856,"./checkAppFields":1679975017869}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017855, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.cacheManager=exports.CACHE_KEY=void 0;const reactiveCache_1=require("../core/json/reactiveCache");var CACHE_KEY;!function(e){e.PROJECT_CONFIG="project.config",e.RAW_APP_JSON="raw|app.json",e.APP_JSON="app.json",e.EXT_JSON="ext.json",e.PAGE_JSON="page.json",e.COMPILED_APP_JSON="compiled.app.json",e.COMPILED_PAGE_JSON="compiled.page.json",e.GAME_JSON="game.json",e.PLUGIN_JSON="plugin.json",e.SITE_MAP_JSON="sitemap.json",e.THEME_JSON="theme.json",e.PLUGIN_THEME_JSON="plugin|theme.json",e.APP_JSON_THEME_LOCATION="app.json.themeLocation",e.APP_JSON_USING_COMPONENTS="app.json.usingComponents"}(CACHE_KEY=exports.CACHE_KEY||(exports.CACHE_KEY={}));let cache={};exports.cacheManager={get:(e,c)=>{if(cache[e.projectPath])return cache[e.projectPath][c]},set:(e,c,a)=>{cache[e.projectPath]||(cache[e.projectPath]={}),cache[e.projectPath][c]=a},clean:()=>{cache={},(0,reactiveCache_1.cleanReactiveCache)()},remove:e=>{for(const c in cache)cache[c]&&delete cache[c][e]}};
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../core/json/reactiveCache":1679975017856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017856, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.cleanReactiveCache=exports.wrapCompileJSONFunc=exports.tryToGetReactiveJSONCompiler=exports.ReactiveJSONCompiler=exports.tryToGetReactiveProject=exports.ReactiveProject=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),tools_1=require("../../utils/tools"),reactivity_1=require("@vue/reactivity"),lodash_1=require("lodash"),process_1=require("process"),config_1=require("../../config"),isDevtools=process.__nwjs&&"wechatwebdevtools"===nw.App.manifest.appname;function info(...e){}function log(...e){isDevtools&&console.log.apply(console,e)}function error(...e){isDevtools&&console.error.apply(console,e)}function isAttrEqual(e,t){return"object"==typeof e&&"object"==typeof t&&(!(!e||!t)&&(e.platform===t.platform&&e.appType===t.appType&&e.gameApp===t.gameApp&&e.isSandbox===t.isSandbox&&e.released===t.released&&(e.setting.MaxCodeSize===t.setting.MaxCodeSize&&e.setting.MaxSubpackageSubCodeSize===t.setting.MaxSubpackageSubCodeSize&&e.setting.MaxSubpackageFullCodeSize===t.setting.MaxSubpackageFullCodeSize&&e.setting.NavigateMiniprogramLimit===t.setting.NavigateMiniprogramLimit&&e.setting.MaxSubPackageLimit===t.setting.MaxSubPackageLimit&&e.setting.MinTabbarCount===t.setting.MinTabbarCount&&e.setting.MaxTabbarCount===t.setting.MaxTabbarCount&&e.setting.MaxTabbarIconSize===t.setting.MaxTabbarIconSize)))}function makeReadonly(e){return e&&"object"==typeof e?(0,reactivity_1.readonly)(e):e}class ReactiveProject{constructor(e){if(this.fileBoxs=new Map,this.statBoxs=new Map,this.resetFileChangeListener=()=>{},this.project=e,e.onFileChange){const t=e.onFileChange;e.onFileChange=(i,o)=>{t.call(e,i,o),this.onFileChange(i,o)},this.resetFileChangeListener=()=>{e.onFileChange=t}}this.miniprogramRootBox=(0,reactivity_1.ref)(e.miniprogramRoot),this.pluginRootBox=(0,reactivity_1.ref)(e.pluginRoot),this.appidBox=(0,reactivity_1.ref)(e.appid),this.typeBox=(0,reactivity_1.ref)(e.type),this.attrBox=(0,reactivity_1.ref)(config_1.DefaultProjectAttr)}release(){this.resetFileChangeListener(),log("[reactiveCache] reactiveProject release")}async attr(){return this.attrSync()}getFileList(e,t){return this.project.getFileList(e,t)}getFilesAndDirs(){return this.project.getFilesAndDirs()}getExtAppid(){return this.project.getExtAppid()}updateFiles(){throw new Error("Method updateFiles not implemented.")}async updateProject(){this.appidBox.value!==this.project.appid&&(this.appidBox.value=this.project.appid),this.typeBox.value!==this.project.type&&(this.typeBox.value=this.project.type),this.miniprogramRootBox.value!==this.project.miniprogramRoot&&(this.miniprogramRootBox.value=this.project.miniprogramRoot),this.pluginRootBox.value!==this.project.pluginRoot&&(this.pluginRootBox.value=this.project.pluginRoot);const e=await this.project.attr();return isAttrEqual(e,this.attrBox.value)||(this.attrBox.value=e),new Promise(e=>{setTimeout(e,0)})}onFileChange(e,t){if("change"===e){const e=this.fileBoxs.get(t);if(e){const i=this.project.getFile("",t);e.value&&0===i.compare(e.value)||(e.value=i)}}else if("unlink"===e){const e=this.fileBoxs.get(t);e&&(this.fileBoxs.delete(t),e.value=void 0);const i=this.statBoxs.get(t);if(i){const e=this.project.stat("",t);(0,lodash_1.isEqual)(e,i.value)||(i.value=e)}}else if("unlinkDir"===e){const e=t+"/";let i=Array.from(this.fileBoxs.keys());for(const t of i)if(0===t.indexOf(e)){const e=this.fileBoxs.get(t);this.fileBoxs.delete(t),e.value=void 0}i=Array.from(this.statBoxs.keys());for(const t of i)if(0===t.indexOf(e)){const e=this.statBoxs.get(t);void 0!==e.value&&(this.statBoxs.delete(t),e.value=void 0)}}else if("add"===e||"addDir"===e){const e=this.statBoxs.get(t);if(e){const i=this.project.stat("",t);(0,lodash_1.isEqual)(i,e.value)||(e.value=i)}}}getFile(e,t){const i=this.getTargetPath(e,t),o=this.fileBoxs.get(i);if(o)return o.value;{const o=(0,reactivity_1.ref)(this.project.getFile(e,t));return this.fileBoxs.set(i,o),o.value}}stat(e,t){const i=this.getTargetPath(e,t),o=this.statBoxs.get(i);if(o)return o.value;{const o=(0,reactivity_1.ref)(this.project.stat(e,t));return this.statBoxs.set(i,o),o.value}}attrSync(){return this.attrBox.value}get appid(){return this.appidBox.value}get type(){return this.typeBox.value}get nameMappingFromDevtools(){return this.project.nameMappingFromDevtools}get projectPath(){return this.project.projectPath}get privateKey(){return this.project.privateKey}get miniprogramRoot(){return this.miniprogramRootBox.value}set miniprogramRoot(e){this.miniprogramRootBox.value=e,this.project.miniprogramRoot=e}get pluginRoot(){return this.pluginRootBox.value}set pluginRoot(e){this.pluginRootBox.value=e,this.project.pluginRoot=e}getTargetPath(e,t){return(0,tools_1.normalizePath)(path_1.default.posix.join(e,t)).replace(/\/$/,"").replace(/^\//,"")}}exports.ReactiveProject=ReactiveProject;const reactiveProjectMap=new Map;function tryToGetReactiveProject(e){let t=reactiveProjectMap.get(e.projectPath);return t||(t=new ReactiveProject(e),reactiveProjectMap.set(e.projectPath,t),t)}exports.tryToGetReactiveProject=tryToGetReactiveProject;let isPending=!1;const pendingRunner=new Set,resolvedPromise=Promise.resolve();function runInNextTick(e){pendingRunner.add(e),isPending||(isPending=!0,resolvedPromise.then(()=>{const e=Date.now();try{const t=Array.from(pendingRunner);pendingRunner.clear(),isPending=!1,t.forEach(e=>{e()})}finally{info(`[reactiveCache] nextTick update cost ${Date.now()-e} ms`)}}))}class ReactiveJSONCompiler{constructor(e){this.pageComputeds=new Map,this.jsonComputeds=new Map,this.project=e}release(){log("[reactiveCache] reactiveJSONCompiler release")}registerOrGet(e,t,...i){let o=this.jsonComputeds.get(e);if(!o){o=(0,reactivity_1.ref)(void 0),this.jsonComputeds.set(e,o);let r=void 0;r=(0,reactivity_1.effect)(()=>{try{info(`[reactiveCache] ${e} start to update`);const r=t.call(null,this.project,...i);(0,lodash_1.isEqual)(r,o.value)?info(`[reactiveCache] ${e} update finish, value no change`):(o.value=makeReadonly(r),info(`[reactiveCache] ${e} update finish, new value: `,o.value))}catch(t){o.value=t instanceof Error?t:new Error(t.toString()),log(`[reactiveCache] update ${e} failed: `,t)}},{scheduler(){r&&r.active&&runInNextTick(r)}})}const{value:r}=o;if(r instanceof Error)throw r;return r}static setOriginGetPageJSON(e){this.originGetPageJSON=e}static setOriginCheckPageJSON(e){this.originCheckPageJSON=e}getPageJSON(e,t){let i=this.pageComputeds.get(t.pagePath);i||(i={checked:(0,reactivity_1.ref)(void 0),compiled:(0,reactivity_1.ref)(void 0)},this.pageComputeds.set(t.pagePath,i));const o=i[e];if(void 0===o.value){let i=void 0;i=(0,reactivity_1.effect)(()=>{try{info(`[reactiveCache] start to update ${e} ${t.pagePath}`);const i="compiled"===e?ReactiveJSONCompiler.originGetPageJSON(this.project,t):ReactiveJSONCompiler.originCheckPageJSON(this.project,t);o.value=makeReadonly(i),info(`[reactiveCache] update finish ${e} ${t.pagePath}`)}catch(i){o.value=i instanceof Error?i:new Error(i.toString()),log(`[reactiveCache] update ${e} ${t.pagePath} failed: `,i)}},{scheduler(){i&&i.active&&(0,process_1.nextTick)(i)}})}const r=o.value;if(r instanceof Error)throw r;return r}}exports.ReactiveJSONCompiler=ReactiveJSONCompiler;const reactiveJSONCompilerMap=new Map;function tryToGetReactiveJSONCompiler(e){let t=reactiveJSONCompilerMap.get(e.projectPath);return t||(t=new ReactiveJSONCompiler(e),reactiveJSONCompilerMap.set(e.projectPath,t),t)}function wrapCompileJSONFunc(e,t){return function(i,...o){i instanceof ReactiveProject||(i=tryToGetReactiveProject(i));return tryToGetReactiveJSONCompiler(i).registerOrGet(e,t,...o)}}function cleanReactiveCache(){reactiveProjectMap.forEach(e=>{e.release()}),reactiveProjectMap.clear(),reactiveJSONCompilerMap.forEach(e=>{e.release()}),reactiveJSONCompilerMap.clear()}exports.tryToGetReactiveJSONCompiler=tryToGetReactiveJSONCompiler,exports.wrapCompileJSONFunc=wrapCompileJSONFunc,exports.cleanReactiveCache=cleanReactiveCache;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/tools":1679975017847,"../../config":1679975017839}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017857, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.NEW_CHECK_JSON_WAY=exports.schemaValidate=exports.config=void 0;const jsonschema_1=require("jsonschema"),validator=new jsonschema_1.Validator,app=require("../../vendor/schema/dist/app.js"),ext=require("../../vendor/schema/dist/ext.js"),game=require("../../vendor/schema/dist/game.js"),page=require("../../vendor/schema/dist/page.js"),plugin=require("../../vendor/schema/dist/plugin.js"),pluginpage=require("../../vendor/schema/dist/pluginpage.js"),projectconfig=require("../../vendor/schema/dist/projectconfig.js"),sitemap=require("../../vendor/schema/dist/sitemap.js"),theme=require("../../vendor/schema/dist/theme.js");exports.config={app:app,ext:ext,game:game,page:page,plugin:plugin,pluginpage:pluginpage,projectconfig:projectconfig,sitemap:sitemap,theme:theme};const SchemaMap=Object.assign({},exports.config);function schemaValidate(e,r){const a=validator.validate(r,SchemaMap[e]).errors,t=a.filter(e=>"additionalProperties"===e.name),n=a.filter(e=>"additionalProperties"!==e.name).map(e=>{if("type"===e.name||"enum"===e.name||"anyOf"===e.name){let r=e.argument;if("string"==typeof r&&(r=[r]),"anyOf"===e.name){r=[(e.schema.anyOf||[]).map(e=>e.type).join(", ")]}const a=e.property.replace(/^instance\.?/,"");return{errorType:e.name,errorProperty:a,correctType:r}}return{errorType:e.name,errorProperty:e.property.replace(/^instance\.?/,""),requireProperty:e.argument}});return{warning:t.map(r=>{const a=r.property.replace(/^instance\.?/,"");return`${e}.json ${a.length?a:""}["${r.argument}"]`}).join("、")||"",error:n}}exports.schemaValidate=schemaValidate,exports.NEW_CHECK_JSON_WAY=!0;
}, function(modId) { var map = {"../../vendor/schema/dist/app.js":1679975017858,"../../vendor/schema/dist/ext.js":1679975017859,"../../vendor/schema/dist/game.js":1679975017860,"../../vendor/schema/dist/page.js":1679975017861,"../../vendor/schema/dist/plugin.js":1679975017862,"../../vendor/schema/dist/pluginpage.js":1679975017863,"../../vendor/schema/dist/projectconfig.js":1679975017864,"../../vendor/schema/dist/sitemap.js":1679975017865,"../../vendor/schema/dist/theme.js":1679975017866}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017858, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "__warning__": {
      "type": "string"
    },
    "pages": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "window": {
      "$ref": "#/definitions/IWindow"
    },
    "plugins": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/IPluginConfig"
      }
    },
    "entryPagePath": {
      "type": "string"
    },
    "permission": {
      "type": "object",
      "properties": {
        "scope.userLocation": {
          "type": "object",
          "properties": {
            "desc": {
              "type": "string"
            }
          },
          "additionalProperties": false,
          "required": [
            "desc"
          ]
        },
        "scope.userFuzzyLocation": {
          "type": "object",
          "properties": {
            "desc": {
              "type": "string"
            }
          },
          "additionalProperties": false,
          "required": [
            "desc"
          ]
        }
      },
      "additionalProperties": false
    },
    "workers": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
            },
            "isSubpackage": {
              "type": "boolean"
            }
          },
          "additionalProperties": false,
          "required": [
            "isSubpackage",
            "path"
          ]
        },
        {
          "type": "string"
        }
      ]
    },
    "subPackages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISubPackageItem"
      }
    },
    "subpackages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISubPackageItem"
      }
    },
    "preloadRule": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "network": {
            "enum": [
              "all",
              "wifi"
            ],
            "type": "string"
          },
          "packages": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "packages"
        ]
      }
    },
    "usingComponents": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "componentPlaceholder": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "tabBar": {
      "$ref": "#/definitions/ITabBar"
    },
    "requiredBackgroundModes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "mimeTypeDeclarations": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "networkTimeout": {
      "type": "object",
      "properties": {
        "request": {
          "type": "number"
        },
        "connectSocket": {
          "type": "number"
        },
        "uploadFile": {
          "type": "number"
        },
        "downloadFile": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "debug": {
      "type": "boolean"
    },
    "resizable": {
      "type": "boolean"
    },
    "frameset": {
      "type": "boolean"
    },
    "functionalPages": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "independent": {
              "type": "boolean"
            }
          },
          "additionalProperties": false,
          "required": [
            "independent"
          ]
        },
        {
          "type": "boolean"
        }
      ]
    },
    "cloud": {
      "type": "boolean"
    },
    "cloudVersion": {
      "type": "string"
    },
    "openDataContext": {
      "type": "string"
    },
    "openLocationPagePath": {
      "type": "string"
    },
    "sitemapLocation": {
      "type": "string"
    },
    "serviceProviderTicket": {
      "type": "string"
    },
    "style": {
      "enum": [
        "v2"
      ],
      "type": "string"
    },
    "useExtendedLib": {
      "type": "object",
      "additionalProperties": {
        "type": [
          "string",
          "boolean"
        ]
      }
    },
    "entranceDeclare": {
      "type": "object",
      "properties": {
        "locationMessage": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
            },
            "query": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "darkmode": {
      "type": "boolean"
    },
    "themeLocation": {
      "type": "string"
    },
    "theme": {
      "type": "string"
    },
    "singlePage": {
      "type": "object",
      "properties": {
        "navigationBarFit": {
          "enum": [
            "float",
            "squeezed"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "lazyCodeLoading": {
      "enum": [
        "requiredComponents"
      ],
      "type": "string"
    },
    "enablePassiveEvent": {
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": {
            "type": "boolean"
          }
        },
        {
          "type": "boolean"
        }
      ]
    },
    "supportedMaterials": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISupportMaterial"
      }
    },
    "requireBackgroundModes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "embeddedAppIdList": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "renderer": {
      "enum": [
        "skyline",
        "webview"
      ],
      "type": "string"
    },
    "resolveAlias": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "debugOptions": {
      "type": "object",
      "properties": {
        "enableFPSPanel": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "halfPage": {
      "type": "object",
      "properties": {
        "firstPageNavigationStyle": {
          "enum": [
            "custom",
            "default"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "requiredPrivateInfos": {
      "type": "array",
      "items": {
        "enum": [
          "chooseAddress",
          "chooseLocation",
          "choosePoi",
          "getFuzzyLocation",
          "getLocation",
          "onLocationChange",
          "startLocationUpdate",
          "startLocationUpdateBackground"
        ],
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "pages"
  ],
  "definitions": {
    "IWindow": {
      "type": "object",
      "properties": {
        "backgroundColorTop": {
          "type": "string"
        },
        "backgroundColorBottom": {
          "type": "string"
        },
        "backgroundColorContent": {
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        },
        "enablePullDownRefresh": {
          "type": "boolean"
        },
        "navigationBarTextStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "navigationBarTitleText": {
          "type": "string"
        },
        "navigationStyle": {
          "enum": [
            "custom",
            "default"
          ],
          "type": "string"
        },
        "backgroundTextStyle": {
          "enum": [
            "dark",
            "light"
          ],
          "type": "string"
        },
        "onReachBottomDistance": {
          "type": "number"
        },
        "pageOrientation": {
          "enum": [
            "auto",
            "landscape",
            "portrait"
          ],
          "type": "string"
        },
        "navigationBarBackgroundColor": {
          "type": "string"
        },
        "renderingMode": {
          "enum": [
            "mixed",
            "seperated"
          ],
          "type": "string"
        },
        "restartStrategy": {
          "enum": [
            "homePage",
            "homePageAndLatestPage"
          ],
          "type": "string"
        },
        "visualEffectInBackground": {
          "enum": [
            "hidden",
            "none"
          ],
          "type": "string"
        },
        "initialRenderingCache": {
          "enum": [
            "dynamic",
            "static"
          ],
          "type": "string"
        },
        "handleWebviewPreload": {
          "enum": [
            "auto",
            "manual",
            "static"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "IPluginConfig": {
      "type": "object",
      "properties": {
        "provider": {
          "type": "string"
        },
        "version": {
          "type": "string"
        },
        "path": {
          "type": "string"
        },
        "export": {
          "type": "string"
        },
        "genericsImplementation": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      },
      "additionalProperties": false,
      "required": [
        "provider",
        "version"
      ]
    },
    "ISubPackageItem": {
      "type": "object",
      "properties": {
        "independent": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "root": {
          "type": "string"
        },
        "pages": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "plugins": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/IPluginConfig"
          }
        },
        "useExtendedLib": {
          "type": "object",
          "additionalProperties": {
            "type": [
              "string",
              "boolean"
            ]
          }
        }
      },
      "additionalProperties": false,
      "required": [
        "pages",
        "root"
      ]
    },
    "ITabBar": {
      "type": "object",
      "properties": {
        "custom": {
          "type": "boolean"
        },
        "list": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "pagePath": {
                "type": "string"
              },
              "text": {
                "type": "string"
              },
              "iconPath": {
                "type": "string"
              },
              "selectedIconPath": {
                "type": "string"
              },
              "renderer": {
                "enum": [
                  "cover-view",
                  "skyline",
                  "webview"
                ],
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "pagePath"
            ]
          }
        },
        "borderStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "position": {
          "enum": [
            "bottom",
            "top"
          ],
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "selectedColor": {
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [
        "list"
      ]
    },
    "ISupportMaterial": {
      "type": "object",
      "properties": {
        "materialType": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "desc": {
          "type": "string"
        },
        "path": {
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [
        "desc",
        "materialType",
        "name",
        "path"
      ]
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1671418174318
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017859, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "extAppid": {
      "type": "string"
    },
    "extEnable": {
      "type": "boolean"
    },
    "directCommit": {
      "type": "boolean"
    },
    "ext": {
      "type": "object",
      "additionalProperties": {}
    },
    "extPages": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/IPageJSON"
      }
    },
    "__warning__": {
      "type": "string"
    },
    "pages": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "window": {
      "$ref": "#/definitions/IWindow"
    },
    "plugins": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/IPluginConfig"
      }
    },
    "entryPagePath": {
      "type": "string"
    },
    "permission": {
      "type": "object",
      "properties": {
        "scope.userLocation": {
          "type": "object",
          "properties": {
            "desc": {
              "type": "string"
            }
          },
          "additionalProperties": false,
          "required": [
            "desc"
          ]
        }
      },
      "additionalProperties": false
    },
    "workers": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
            },
            "isSubpackage": {
              "type": "boolean"
            }
          },
          "additionalProperties": false,
          "required": [
            "isSubpackage",
            "path"
          ]
        },
        {
          "type": "string"
        }
      ]
    },
    "subPackages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISubPackageItem"
      }
    },
    "subpackages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISubPackageItem"
      }
    },
    "preloadRule": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "network": {
            "enum": [
              "all",
              "wifi"
            ],
            "type": "string"
          },
          "packages": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "packages"
        ]
      }
    },
    "usingComponents": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "componentPlaceholder": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "tabBar": {
      "$ref": "#/definitions/ITabBar"
    },
    "requiredBackgroundModes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "mimeTypeDeclarations": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "networkTimeout": {
      "type": "object",
      "properties": {
        "request": {
          "type": "number"
        },
        "connectSocket": {
          "type": "number"
        },
        "uploadFile": {
          "type": "number"
        },
        "downloadFile": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "debug": {
      "type": "boolean"
    },
    "resizable": {
      "type": "boolean"
    },
    "functionalPages": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "independent": {
              "type": "boolean"
            }
          },
          "additionalProperties": false,
          "required": [
            "independent"
          ]
        },
        {
          "type": "boolean"
        }
      ]
    },
    "cloud": {
      "type": "boolean"
    },
    "openLocationPagePath": {
      "type": "string"
    },
    "sitemapLocation": {
      "type": "string"
    },
    "serviceProviderTicket": {
      "type": "string"
    },
    "style": {
      "enum": [
        "v2"
      ],
      "type": "string"
    },
    "useExtendedLib": {
      "type": "object",
      "additionalProperties": {
        "type": "boolean"
      }
    },
    "entranceDeclare": {
      "type": "object",
      "properties": {
        "locationMessage": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
            },
            "query": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "darkmode": {
      "type": "boolean"
    },
    "themeLocation": {
      "type": "string"
    },
    "theme": {
      "type": "string"
    },
    "enablePassiveEvent": {
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": {
            "type": "boolean"
          }
        },
        {
          "type": "boolean"
        }
      ]
    },
    "supportedMaterials": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISupportMaterial"
      }
    },
    "lazyCodeLoading": {
      "enum": [
        "requiredComponents"
      ],
      "type": "string"
    },
    "requiredPrivateInfos": {
      "type": "array",
      "items": {
        "enum": [
          "chooseAddress",
          "chooseLocation",
          "choosePoi",
          "getFuzzyLocation",
          "getLocation",
          "onLocationChange",
          "startLocationUpdate",
          "startLocationUpdateBackground"
        ],
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "extAppid"
  ],
  "definitions": {
    "IPageJSON": {
      "type": "object",
      "properties": {
        "navigationBarBackgroundColor": {
          "type": "string"
        },
        "navigationBarTextStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "navigationBarTitleText": {
          "type": "string"
        },
        "navigationStyle": {
          "enum": [
            "custom",
            "default"
          ],
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        },
        "backgroundTextStyle": {
          "enum": [
            "dark",
            "light"
          ],
          "type": "string"
        },
        "enablePullDownRefresh": {
          "type": "boolean"
        },
        "onReachBottomDistance": {
          "type": "number"
        },
        "disableScroll": {
          "type": "boolean"
        },
        "disableSwipeBack": {
          "type": "boolean"
        },
        "backgroundColorTop": {
          "type": "string"
        },
        "backgroundColorBottom": {
          "type": "string"
        },
        "usingComponents": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "pageOrientation": {
          "enum": [
            "auto",
            "landscape",
            "portrait"
          ],
          "type": "string"
        },
        "visualEffectInBackground": {
          "enum": [
            "hidden",
            "none"
          ],
          "type": "string"
        },
        "restartStrategy": {
          "enum": [
            "homePage",
            "homePageAndLatestPage"
          ],
          "type": "string"
        },
        "component": {
          "type": "boolean"
        },
        "componentGenerics": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              {
                "type": "object",
                "additionalProperties": {
                  "type": "string"
                }
              },
              {
                "type": "boolean"
              }
            ]
          }
        },
        "singlePage": {
          "type": "object",
          "properties": {
            "navigationBarFit": {
              "enum": [
                "float",
                "squeezed"
              ],
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "pageJSONLight": {
          "$ref": "#/definitions/IOriginalPageJSON"
        },
        "pageJSONDark": {
          "$ref": "#/definitions/IOriginalPageJSON"
        },
        "enablePassiveEvent": {
          "anyOf": [
            {
              "type": "object",
              "additionalProperties": {
                "type": "boolean"
              }
            },
            {
              "type": "boolean"
            }
          ]
        },
        "style": {
          "enum": [
            "v2"
          ],
          "type": "string"
        },
        "componentPlaceholder": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "renderer": {
          "enum": [
            "skyline",
            "webview",
            "xr-frame"
          ],
          "type": "string"
        },
        "initialRenderingCache": {
          "enum": [
            "dynamic",
            "static"
          ],
          "type": "string"
        },
        "handleWebviewPreload": {
          "enum": [
            "auto",
            "manual",
            "static"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "IOriginalPageJSON": {
      "type": "object",
      "properties": {
        "navigationBarBackgroundColor": {
          "type": "string"
        },
        "navigationBarTextStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "navigationBarTitleText": {
          "type": "string"
        },
        "navigationStyle": {
          "enum": [
            "custom",
            "default"
          ],
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        },
        "backgroundTextStyle": {
          "enum": [
            "dark",
            "light"
          ],
          "type": "string"
        },
        "enablePullDownRefresh": {
          "type": "boolean"
        },
        "onReachBottomDistance": {
          "type": "number"
        },
        "disableScroll": {
          "type": "boolean"
        },
        "disableSwipeBack": {
          "type": "boolean"
        },
        "backgroundColorTop": {
          "type": "string"
        },
        "backgroundColorBottom": {
          "type": "string"
        },
        "backgroundColorContent": {
          "type": "string"
        },
        "usingComponents": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "pageOrientation": {
          "enum": [
            "auto",
            "landscape",
            "portrait"
          ],
          "type": "string"
        },
        "visualEffectInBackground": {
          "enum": [
            "hidden",
            "none"
          ],
          "type": "string"
        },
        "initialRenderingCache": {
          "enum": [
            "dynamic",
            "static"
          ],
          "type": "string"
        },
        "restartStrategy": {
          "enum": [
            "homePage",
            "homePageAndLatestPage"
          ],
          "type": "string"
        },
        "renderer": {
          "enum": [
            "cover-view",
            "skyline",
            "webview",
            "xr-frame"
          ],
          "type": "string"
        },
        "component": {
          "type": "boolean"
        },
        "componentGenerics": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              {
                "type": "object",
                "additionalProperties": {
                  "type": "string"
                }
              },
              {
                "type": "boolean"
              }
            ]
          }
        },
        "singlePage": {
          "type": "object",
          "properties": {
            "navigationBarFit": {
              "enum": [
                "float",
                "squeezed"
              ],
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "handleWebviewPreload": {
          "enum": [
            "auto",
            "manual",
            "static"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "IWindow": {
      "type": "object",
      "properties": {
        "backgroundColorTop": {
          "type": "string"
        },
        "backgroundColorBottom": {
          "type": "string"
        },
        "backgroundColorContent": {
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        },
        "enablePullDownRefresh": {
          "type": "boolean"
        },
        "navigationBarTextStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "navigationBarTitleText": {
          "type": "string"
        },
        "navigationStyle": {
          "enum": [
            "custom",
            "default"
          ],
          "type": "string"
        },
        "backgroundTextStyle": {
          "enum": [
            "dark",
            "light"
          ],
          "type": "string"
        },
        "onReachBottomDistance": {
          "type": "number"
        },
        "pageOrientation": {
          "enum": [
            "auto",
            "landscape",
            "portrait"
          ],
          "type": "string"
        },
        "navigationBarBackgroundColor": {
          "type": "string"
        },
        "renderingMode": {
          "enum": [
            "mixed",
            "seperated"
          ],
          "type": "string"
        },
        "restartStrategy": {
          "enum": [
            "homePage",
            "homePageAndLatestPage"
          ],
          "type": "string"
        },
        "visualEffectInBackground": {
          "enum": [
            "hidden",
            "none"
          ],
          "type": "string"
        },
        "initialRenderingCache": {
          "enum": [
            "dynamic",
            "static"
          ],
          "type": "string"
        },
        "handleWebviewPreload": {
          "enum": [
            "auto",
            "manual",
            "static"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "IPluginConfig": {
      "type": "object",
      "properties": {
        "provider": {
          "type": "string"
        },
        "version": {
          "type": "string"
        },
        "path": {
          "type": "string"
        },
        "export": {
          "type": "string"
        },
        "genericsImplementation": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      },
      "additionalProperties": false,
      "required": [
        "provider",
        "version"
      ]
    },
    "ISubPackageItem": {
      "type": "object",
      "properties": {
        "independent": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "root": {
          "type": "string"
        },
        "pages": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "plugins": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/IPluginConfig"
          }
        },
        "useExtendedLib": {
          "type": "object",
          "additionalProperties": {
            "type": [
              "string",
              "boolean"
            ]
          }
        }
      },
      "additionalProperties": false,
      "required": [
        "pages",
        "root"
      ]
    },
    "ITabBar": {
      "type": "object",
      "properties": {
        "custom": {
          "type": "boolean"
        },
        "list": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "pagePath": {
                "type": "string"
              },
              "text": {
                "type": "string"
              },
              "iconPath": {
                "type": "string"
              },
              "selectedIconPath": {
                "type": "string"
              },
              "renderer": {
                "enum": [
                  "cover-view",
                  "skyline",
                  "webview"
                ],
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "pagePath"
            ]
          }
        },
        "borderStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "position": {
          "enum": [
            "bottom",
            "top"
          ],
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "selectedColor": {
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [
        "list"
      ]
    },
    "ISupportMaterial": {
      "type": "object",
      "properties": {
        "materialType": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "desc": {
          "type": "string"
        },
        "path": {
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [
        "desc",
        "materialType",
        "name",
        "path"
      ]
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1669016223495
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017860, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "deviceOrientation": {
      "enum": [
        "landscape",
        "landscapeLeft",
        "landscapeRight",
        "portrait"
      ],
      "type": "string"
    },
    "networkTimeout": {
      "type": "object",
      "properties": {
        "request": {
          "type": "number"
        },
        "connectSocket": {
          "type": "number"
        },
        "uploadFile": {
          "type": "number"
        },
        "downloadFile": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "openDataContext": {
      "type": "string"
    },
    "showStatusBar": {
      "type": "boolean"
    },
    "workers": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
            },
            "isSubpackage": {
              "type": "boolean"
            }
          },
          "additionalProperties": false,
          "required": [
            "isSubpackage",
            "path"
          ]
        },
        {
          "type": "string"
        }
      ]
    },
    "disableSetUserStorageFromMiniProgram": {
      "type": "boolean"
    },
    "permission": {
      "type": "object",
      "properties": {
        "scope.userLocation": {
          "type": "object",
          "properties": {
            "desc": {
              "type": "string"
            }
          },
          "additionalProperties": false,
          "required": [
            "desc"
          ]
        }
      },
      "additionalProperties": false
    },
    "subPackages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISubPackageItem"
      }
    },
    "subpackages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ISubPackageItem"
      }
    },
    "loadingImageInfo": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "progressBarColor": {
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [
        "path"
      ]
    },
    "plugins": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/IPluginConfig"
      }
    },
    "resizable": {
      "type": "boolean"
    },
    "lockStepOptions": {
      "type": "object",
      "properties": {
        "gameTick": {
          "type": "number"
        },
        "heartBeatTick": {
          "type": "number"
        },
        "offlineTimeLength": {
          "type": "number"
        },
        "UDPReliabilityStrategy": {
          "type": "number"
        },
        "dataType": {
          "enum": [
            "ArrayBuffer",
            "String"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false,
  "definitions": {
    "ISubPackageItem": {
      "type": "object",
      "properties": {
        "independent": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "root": {
          "type": "string"
        },
        "plugins": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/IPluginConfig"
          }
        }
      },
      "additionalProperties": false,
      "required": [
        "root"
      ]
    },
    "IPluginConfig": {
      "type": "object",
      "properties": {
        "provider": {
          "type": "string"
        },
        "version": {
          "type": "string"
        },
        "path": {
          "type": "string"
        },
        "contexts": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "enum": [
                  "gameContext",
                  "isolatedContext",
                  "openDataContext"
                ],
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "type"
            ]
          }
        }
      },
      "additionalProperties": false,
      "required": [
        "provider",
        "version"
      ]
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1669016223495
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017861, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "navigationBarBackgroundColor": {
      "type": "string"
    },
    "navigationBarTextStyle": {
      "enum": [
        "black",
        "white"
      ],
      "type": "string"
    },
    "navigationBarTitleText": {
      "type": "string"
    },
    "navigationStyle": {
      "enum": [
        "custom",
        "default"
      ],
      "type": "string"
    },
    "backgroundColor": {
      "type": "string"
    },
    "backgroundTextStyle": {
      "enum": [
        "dark",
        "light"
      ],
      "type": "string"
    },
    "enablePullDownRefresh": {
      "type": "boolean"
    },
    "onReachBottomDistance": {
      "type": "number"
    },
    "disableScroll": {
      "type": "boolean"
    },
    "disableSwipeBack": {
      "type": "boolean"
    },
    "backgroundColorTop": {
      "type": "string"
    },
    "backgroundColorBottom": {
      "type": "string"
    },
    "usingComponents": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "pageOrientation": {
      "enum": [
        "auto",
        "landscape",
        "portrait"
      ],
      "type": "string"
    },
    "visualEffectInBackground": {
      "enum": [
        "hidden",
        "none"
      ],
      "type": "string"
    },
    "restartStrategy": {
      "enum": [
        "homePage",
        "homePageAndLatestPage"
      ],
      "type": "string"
    },
    "component": {
      "type": "boolean"
    },
    "componentGenerics": {
      "type": "object",
      "additionalProperties": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          },
          {
            "type": "boolean"
          }
        ]
      }
    },
    "singlePage": {
      "type": "object",
      "properties": {
        "navigationBarFit": {
          "enum": [
            "float",
            "squeezed"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "pageJSONLight": {
      "$ref": "#/definitions/IOriginalPageJSON"
    },
    "pageJSONDark": {
      "$ref": "#/definitions/IOriginalPageJSON"
    },
    "enablePassiveEvent": {
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": {
            "type": "boolean"
          }
        },
        {
          "type": "boolean"
        }
      ]
    },
    "style": {
      "enum": [
        "v2"
      ],
      "type": "string"
    },
    "componentPlaceholder": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "renderer": {
      "enum": [
        "skyline",
        "webview",
        "xr-frame"
      ],
      "type": "string"
    },
    "initialRenderingCache": {
      "enum": [
        "dynamic",
        "static"
      ],
      "type": "string"
    },
    "handleWebviewPreload": {
      "enum": [
        "auto",
        "manual",
        "static"
      ],
      "type": "string"
    }
  },
  "additionalProperties": false,
  "definitions": {
    "IOriginalPageJSON": {
      "type": "object",
      "properties": {
        "navigationBarBackgroundColor": {
          "type": "string"
        },
        "navigationBarTextStyle": {
          "enum": [
            "black",
            "white"
          ],
          "type": "string"
        },
        "navigationBarTitleText": {
          "type": "string"
        },
        "navigationStyle": {
          "enum": [
            "custom",
            "default"
          ],
          "type": "string"
        },
        "backgroundColor": {
          "type": "string"
        },
        "backgroundTextStyle": {
          "enum": [
            "dark",
            "light"
          ],
          "type": "string"
        },
        "enablePullDownRefresh": {
          "type": "boolean"
        },
        "onReachBottomDistance": {
          "type": "number"
        },
        "disableScroll": {
          "type": "boolean"
        },
        "disableSwipeBack": {
          "type": "boolean"
        },
        "backgroundColorTop": {
          "type": "string"
        },
        "backgroundColorBottom": {
          "type": "string"
        },
        "backgroundColorContent": {
          "type": "string"
        },
        "usingComponents": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "pageOrientation": {
          "enum": [
            "auto",
            "landscape",
            "portrait"
          ],
          "type": "string"
        },
        "visualEffectInBackground": {
          "enum": [
            "hidden",
            "none"
          ],
          "type": "string"
        },
        "initialRenderingCache": {
          "enum": [
            "dynamic",
            "static"
          ],
          "type": "string"
        },
        "restartStrategy": {
          "enum": [
            "homePage",
            "homePageAndLatestPage"
          ],
          "type": "string"
        },
        "renderer": {
          "enum": [
            "cover-view",
            "skyline",
            "webview",
            "xr-frame"
          ],
          "type": "string"
        },
        "component": {
          "type": "boolean"
        },
        "componentGenerics": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              {
                "type": "object",
                "additionalProperties": {
                  "type": "string"
                }
              },
              {
                "type": "boolean"
              }
            ]
          }
        },
        "singlePage": {
          "type": "object",
          "properties": {
            "navigationBarFit": {
              "enum": [
                "float",
                "squeezed"
              ],
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "handleWebviewPreload": {
          "enum": [
            "auto",
            "manual",
            "static"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1671418085036
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017862, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "publicComponents": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "usingComponents": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "pages": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "main": {
      "type": "string"
    },
    "themeLocation": {
      "type": "string"
    },
    "lazyCodeLoading": {
      "enum": [
        "requiredComponents"
      ],
      "type": "string"
    },
    "workers": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1656299567866
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017863, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "usingComponents": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1631795974264
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017864, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "libVersion": {
      "type": "string"
    },
    "editorSetting": {
      "type": "object",
      "properties": {
        "tabIndent": {
          "enum": [
            "auto",
            "insertSpaces",
            "tab"
          ],
          "type": "string"
        },
        "tabSize": {
          "anyOf": [
            {
              "enum": [
                "\t"
              ],
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        }
      }
    },
    "cloudfunctionRoot": {
      "type": "string"
    },
    "cloudfunctionTemplateRoot": {
      "type": "string"
    },
    "cloudcontainerRoot": {
      "type": "string"
    },
    "srcMiniprogramRoot": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "simulatorType": {
      "type": "string"
    },
    "simulatorPluginLibVersion": {},
    "miniprogramRoot": {
      "type": "string"
    },
    "qcloudRoot": {
      "type": "string"
    },
    "pluginRoot": {
      "type": "string"
    },
    "cloudbaseRoot": {
      "type": "string"
    },
    "compileType": {
      "type": "string"
    },
    "pluginAppid": {
      "type": "string"
    },
    "jsserverRoot": {
      "type": "string"
    },
    "projectname": {
      "type": "string"
    },
    "appid": {
      "type": "string"
    },
    "packOptions": {
      "type": "object",
      "properties": {
        "ignore": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "value"
            ]
          }
        },
        "include": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "value"
            ]
          }
        }
      }
    },
    "watchOptions": {
      "type": "object",
      "properties": {
        "ignore": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "setting": {
      "type": "object",
      "properties": {
        "es6": {
          "type": "boolean"
        },
        "enhance": {
          "type": "boolean"
        },
        "postcss": {
          "type": "boolean"
        },
        "minified": {
          "type": "boolean"
        },
        "minifyWXSS": {
          "type": "boolean"
        },
        "minifyWXML": {
          "type": "boolean"
        },
        "uglifyFileName": {
          "type": "boolean"
        },
        "ignoreUploadUnusedFiles": {
          "type": "boolean"
        },
        "autoAudits": {
          "type": "boolean"
        },
        "urlCheck": {
          "type": "boolean"
        },
        "compileHotReLoad": {
          "type": "boolean"
        },
        "preloadBackgroundData": {
          "type": "boolean"
        },
        "lazyloadPlaceholderEnable": {
          "type": "boolean"
        },
        "useStaticServer": {
          "type": "boolean"
        },
        "babelSetting": {
          "type": "object",
          "properties": {
            "outputPath": {
              "type": "string"
            },
            "ignore": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "disablePlugins": {
              "type": "array",
              "items": {}
            }
          }
        },
        "useCompilerPlugins": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "enum": [
                  "less",
                  "sass",
                  "typescript"
                ],
                "type": "string"
              }
            },
            {
              "enum": [
                false
              ],
              "type": "boolean"
            }
          ]
        },
        "disableUseStrict": {
          "type": "boolean"
        },
        "uploadWithSourceMap": {
          "type": "boolean"
        },
        "localPlugins": {
          "type": "boolean"
        },
        "packNpmManually": {
          "type": "boolean"
        },
        "packNpmRelationList": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "packageJsonPath": {
                "type": "string"
              },
              "miniprogramNpmDistDir": {
                "type": "string"
              }
            }
          }
        },
        "coverView": {
          "type": "boolean"
        },
        "ignoreDevUnusedFiles": {
          "type": "boolean"
        },
        "checkInvalidKey": {
          "type": "boolean"
        },
        "showShadowRootInWxmlPanel": {
          "type": "boolean"
        },
        "useIsolateContext": {
          "type": "boolean"
        },
        "useMultiFrameRuntime": {
          "type": "boolean"
        },
        "useApiHook": {
          "type": "boolean"
        },
        "useApiHostProcess": {
          "type": "boolean"
        },
        "useLanDebug": {
          "type": "boolean"
        },
        "enableEngineNative": {
          "type": "boolean"
        },
        "showES6CompileOption": {
          "type": "boolean"
        }
      }
    },
    "staticServerOptions": {
      "type": "object",
      "properties": {
        "servePath": {
          "type": "string"
        }
      }
    },
    "scripts": {
      "type": "object",
      "properties": {
        "beforeCompile": {
          "type": "string"
        },
        "beforePreview": {
          "type": "string"
        },
        "beforeUpload": {
          "type": "string"
        }
      }
    },
    "debugOptions": {
      "type": "object",
      "properties": {
        "hideInDevtools": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "condition": {
      "type": "object",
      "properties": {
        "game": {
          "type": "object",
          "properties": {
            "current": {
              "type": "number"
            },
            "list": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "pathName": {
                    "type": "string"
                  },
                  "query": {
                    "type": "string"
                  },
                  "scene": {
                    "type": [
                      "null",
                      "string",
                      "number"
                    ]
                  },
                  "shareInfo": {},
                  "referrerInfo": {},
                  "chatroomUsernameInfo": {},
                  "groupInfo": {}
                }
              }
            }
          }
        },
        "gamePlugin": {
          "type": "object",
          "properties": {
            "current": {
              "type": "number"
            },
            "list": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "query": {
                    "type": "string"
                  },
                  "scene": {
                    "type": [
                      "null",
                      "string",
                      "number"
                    ]
                  },
                  "shareInfo": {},
                  "referrerInfo": {},
                  "groupInfo": {}
                }
              }
            }
          }
        },
        "plugin": {
          "type": "object",
          "properties": {
            "current": {
              "type": "number"
            },
            "list": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "pathName": {
                    "type": "string"
                  },
                  "query": {
                    "type": "string"
                  },
                  "launchMode": {
                    "type": "string"
                  },
                  "scene": {
                    "type": [
                      "null",
                      "string",
                      "number"
                    ]
                  },
                  "shareInfo": {},
                  "referrerInfo": {},
                  "groupInfo": {}
                }
              }
            }
          }
        },
        "miniprogram": {
          "type": "object",
          "properties": {
            "current": {
              "type": "number"
            },
            "list": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "pathName": {
                    "type": "string"
                  },
                  "query": {
                    "type": "string"
                  },
                  "launchMode": {
                    "type": "string"
                  },
                  "scene": {
                    "type": [
                      "null",
                      "string",
                      "number"
                    ]
                  },
                  "partialCompile": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean"
                      },
                      "pages": {
                        "type": "array",
                        "items": {}
                      }
                    }
                  },
                  "shareInfo": {},
                  "referrerInfo": {},
                  "chatroomUsernameInfo": {},
                  "groupInfo": {}
                }
              }
            }
          }
        }
      }
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1651127201809
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017865, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "desc": {
      "type": "string"
    },
    "rules": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "action": {
            "enum": [
              "allow",
              "disallow"
            ],
            "type": "string"
          },
          "page": {
            "type": "string"
          },
          "params": {
            "type": "array",
            "items": {}
          },
          "matching": {
            "enum": [
              "exact",
              "exclusive",
              "inclusive",
              "partial"
            ],
            "type": "string"
          },
          "priority": {
            "type": "number"
          }
        },
        "additionalProperties": false,
        "required": [
          "action",
          "page"
        ]
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "rules"
  ],
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1631795974265
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017866, function(require, module, exports) {
module.exports = {
  "type": "object",
  "properties": {
    "light": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "dark": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$version": 1631795974265
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017867, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.mergeThemeJSONToPageJSON=exports.mergeThemeJSONToAppJSON=exports.checkThemeJSON=exports.getPluginThemeLocation=exports.getThemeLocation=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),lodash_1=(0,tslib_1.__importStar)(require("lodash")),tools_1=require("../../utils/tools"),projectconfig_1=require("./projectconfig"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),common_1=require("../../utils/common"),common_2=require("./common"),cache_1=require("../../utils/cache"),getAppJSON_1=require("./app/getAppJSON"),schemaValidate_1=require("../validate/schemaValidate"),config_1=require("../../config"),plugin_1=require("./plugin/plugin"),reactiveCache_1=require("./reactiveCache");async function getPluginThemeLocation(e){return(await(0,plugin_1.getDevPluginJSON)(e)).themeLocation||null}function checkThemeJSON(e,o){const{isPlugin:t}=o;return t?originCheckThemeJSONForPlugin(e,o):originCheckThemeJSONForMiniProgram(e,o)}exports.getThemeLocation=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.APP_JSON_THEME_LOCATION,e=>{const o=(0,getAppJSON_1.getRawAppJSON)(e).themeLocation;return"[object Undefined]"!==Object.prototype.toString.call(o)?"string"==typeof o?((0,common_1.checkPath)({value:o,tips:'["themeLocation"]',filePath:"app.json"}),o):((0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format('appJSON["themeLocation"]',"string"),filePath:"app.json"}),null):null}),exports.getPluginThemeLocation=getPluginThemeLocation,exports.checkThemeJSON=checkThemeJSON;const originCheckThemeJSONForMiniProgram=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.THEME_JSON,originCheckThemeJSON),originCheckThemeJSONForPlugin=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.PLUGIN_THEME_JSON,originCheckThemeJSON);function originCheckThemeJSON(e,o){const{isPlugin:t}=o,r=(0,exports.getThemeLocation)(e),i=(0,projectconfig_1.getProjectConfigJSON)(e),a=t?i.pluginRoot:i.miniprogramRoot,c=(0,tools_1.normalizePath)(path_1.default.posix.join(a||"",r));e.stat("",c)||(0,common_1.throwError)({msg:locales_1.default.config.FILE_NOT_FOUND.format(c),filePath:"app.json"});const n=e.getFile("",c),l=(0,common_1.checkUTF8)(n,c),s=(0,common_2.checkJSONFormat)(l,c),h=(0,schemaValidate_1.schemaValidate)("theme",s);if(h.error.length){const e=h.error.map(e=>"type"===e.errorType||"enum"===e.errorType||"anyOf"===e.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([e.errorProperty,e.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([e.requireProperty])).join("\n");(0,common_1.throwError)({msg:e,filePath:c})}return s}function mergeThemeJSONToAppJSON(e,o){var t,r;const{windowPropertWhiteList:i,tabBarPropertyWhiteList:a,tabbarListItemPropertyWhiteList:c}=config_1.jsonVariablePropertyWhiteList,n=/^@/,l=lodash_1.default.cloneDeep(o.window||{}),s=lodash_1.default.cloneDeep(o.window||{});Object.keys(l).forEach(o=>{const t=l[o];if(n.test(t)){i.includes(o)||(0,common_1.throwError)({msg:""+locales_1.default.config.SHOULD_NOT_IN.format([t,o]),filePath:"app.json"});const r=t.slice(1);l[o]=e.light[r]||t,s[o]=e.dark[r]||t}});const h=(0,lodash_1.cloneDeep)(o),m=(0,lodash_1.cloneDeep)(o);if(h.window=l,m.window=s,null===(r=null===(t=o.tabBar)||void 0===t?void 0:t.list)||void 0===r?void 0:r.length){const t=lodash_1.default.cloneDeep(o.tabBar||{list:[]}),r=lodash_1.default.cloneDeep(o.tabBar||{list:[]});t.list&&t.list.length>0&&Object.keys(t).forEach(o=>{if("list"!==o){const i=t[o];if(n.test(i)){a.includes(o)||(0,common_1.throwError)({msg:""+locales_1.default.config.SHOULD_NOT_IN.format([i,o]),filePath:"app.json"});const c=i.slice(1);t[o]=e.light[c]||i,r[o]=e.dark[c]||i}}else t.list.forEach((o,i)=>{Object.keys(o).forEach(a=>{const l=o[a];if(n.test(l)){c.includes(a)||(0,common_1.throwError)({msg:""+locales_1.default.config.SHOULD_NOT_IN.format([l,a]),filePath:"app.json"});const o=l.slice(1);t.list[i][a]=e.light[o]||l,r.list[i][a]=e.dark[o]||l}})})}),m.tabBar=r,h.tabBar=t}return{appJSONLight:h,appJSONDark:m}}function mergeThemeJSONToPageJSON(e,o,t){const r=config_1.jsonVariablePropertyWhiteList.windowPropertWhiteList,i=lodash_1.default.cloneDeep(o||{}),a=lodash_1.default.cloneDeep(o||{}),c=/^@/;return Object.keys(o).forEach(n=>{const l=o[n];if(c.test(l)){const o=l.slice(1);r.includes(n)||(0,common_1.throwError)({msg:""+locales_1.default.config.SHOULD_NOT_IN.format([l,n]),filePath:t}),a[n]=e.light[o]||l,i[n]=e.dark[o]||l}}),{pageJSONDark:i,pageJSONLight:a}}exports.mergeThemeJSONToAppJSON=mergeThemeJSONToAppJSON,exports.mergeThemeJSONToPageJSON=mergeThemeJSONToPageJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/tools":1679975017847,"./projectconfig":1679975017851,"../../utils/locales/locales":1679975017841,"../../utils/common":1679975017852,"./common":1679975017853,"../../utils/cache":1679975017855,"./app/getAppJSON":1679975017854,"../validate/schemaValidate":1679975017857,"../../config":1679975017839,"./plugin/plugin":1679975017868,"./reactiveCache":1679975017856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017868, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getGameLocalPluginJSON=exports.getDevPluginJSON=exports.checkWorkers=exports.checkComponentPath=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),projectconfig_1=require("../projectconfig"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),common_1=require("../common"),config_1=require("../../../config"),schemaValidate_1=require("../../validate/schemaValidate"),tools_1=require("../../../utils/tools"),cache_1=require("../../../utils/cache"),common_2=require("../../../utils/common"),reactiveCache_1=require("../reactiveCache");function checkComponentPath(o,e){const{project:t,root:c,filePath:i}=o;void 0!==e.usingComponents&&(0,common_1.checkComponentPath)({project:t,root:c,relativePath:path_1.default.posix.relative(c,i),inputJSON:e})}function checkPublicComponentsAndPages(o,e){const{project:t,root:c,filePath:i}=o,{publicComponents:n,pages:r}=e,a={};if(n){const o=[];for(const r in n){const n=e.publicComponents[r];(0,common_2.checkPath)({value:n,tips:`["publicComponents"]["${r}"]`,filePath:i,code:config_1.PLUGIN_JSON_CONTENT_ERR});let l=t.stat(c,n+".wxml");l&&!l.isDirectory||o.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["publicComponents"]["${n}"]`,n+".wxml")),l=t.stat(c,n+".js"),l&&!l.isDirectory||o.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["publicComponents"]["${n}"]`,n+".js")),l=t.stat(c,n+".json"),l&&!l.isDirectory||o.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["publicComponents"]["${n}"]`,n+".json")),a[r]=!0}o.length>0&&(0,common_2.throwError)({msg:o.join("\n"),code:config_1.PLUGIN_JSON_CONTENT_ERR,filePath:i})}if(r){const o=[];for(const e in r){const n=r[e];(0,common_2.checkPath)({value:n,tips:`["pages"]["${e}"]`,filePath:i,code:config_1.PLUGIN_JSON_CONTENT_ERR});let l=t.stat(c,n+".wxml");l&&!l.isDirectory||o.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["pages"]["${n}"]`,n+".wxml")),l=t.stat(c,n+".js"),l&&!l.isDirectory||o.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["pages"]["${n}"]`,n+".js")),l=t.stat(c,n+".json"),l&&!l.isDirectory||o.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["pages"]["${n}"]`,n+".json")),a[e]&&o.push(locales_1.default.config.SAME_KEY_PAGE_PUBLICCOMPONENTS.format(`"${e}"`)),a[e]=!0}o.length>0&&(0,common_2.throwError)({msg:o.join("\n"),code:config_1.PLUGIN_JSON_CONTENT_ERR,filePath:i})}}function checkWorkers(o,e){const{project:t,root:c,filePath:i}=o,{workers:n}=e;if(void 0===n)return;const r='["workers"]';""===n&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(r,locales_1.default.config.DIRECTORY),filePath:i}),(0,common_2.checkPath)({value:n,tips:r,filePath:i});const a=t.stat(c,n);a&&a.isDirectory||(0,common_2.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([r,locales_1.default.config.DIRECTORY]),filePath:i}),e.workers=(0,tools_1.normalizePath)(n+"/")}function checkMain(o,e){const{project:t,root:c,filePath:i}=o,{main:n}=e;if(void 0===n)return;""===n&&(0,common_2.throwError)({msg:locales_1.default.config.SHOULD_NOT_BE_EMPTY.format('["main"]'),code:config_1.PLUGIN_JSON_CONTENT_ERR,filePath:i}),(0,common_2.checkPath)({value:n,tips:'["main"]',filePath:i,code:config_1.PLUGIN_JSON_CONTENT_ERR});const r=t.stat(c,n);r&&!r.isDirectory||(0,common_2.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format('["main"]',n),code:config_1.PLUGIN_JSON_CONTENT_ERR,filePath:i})}function isKindOfGamePlugin(o){return o.type===config_1.COMPILE_TYPE.miniGamePlugin}function checkPluginJSON(o){const{root:e="",project:t}=o,c=path_1.default.posix.join(e,"plugin.json");t.stat(e,"plugin.json")||(0,common_2.throwError)({msg:locales_1.default.config.PLUGIN_JSON_NOT_FOUND.format(e,"plugin.json"),code:config_1.PLUGIN_JSON_FILE_NOT_FOUND,filePath:c});const i=t.getFile(e,"plugin.json"),n=(0,common_1.checkJSONFormat)((0,common_2.checkUTF8)(i,c),c),r=(0,schemaValidate_1.schemaValidate)("plugin",n);if(r.error.length){const o=r.error.map(o=>"type"===o.errorType||"enum"===o.errorType||"anyOf"===o.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([o.errorProperty,o.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([o.requireProperty])).join("\n");(0,common_2.throwError)({msg:"pluginJSON$"+o,code:config_1.PLUGIN_JSON_CONTENT_ERR,filePath:c})}return void 0!==n.themeLocation&&(0,common_2.checkPath)({value:n.themeLocation,tips:'["themeLocation"]',filePath:c}),isKindOfGamePlugin(t)||(checkPublicComponentsAndPages(o,n),checkComponentPath(o,n)),checkMain(o,n),checkWorkers(o,n),n}exports.checkComponentPath=checkComponentPath,exports.checkWorkers=checkWorkers,exports.getDevPluginJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.PLUGIN_JSON,(o,e="")=>{const t=(0,projectconfig_1.getProjectConfigJSON)(o),{pluginRoot:c=""}=t;let i=c;o.type===config_1.COMPILE_TYPE.miniGame&&e&&(i=e),e||c||(0,common_2.throwError)({msg:locales_1.default.config.NOT_FOUND.format('["pluginRoot"]'),filePath:"project.config.json",code:config_1.JSON_CONTENT_ERR});return checkPluginJSON({project:o,filePath:path_1.default.posix.join(i,"plugin.json"),root:i})});const getGameLocalPluginJSON=async(o,e)=>{const t=await(0,projectconfig_1.getProjectConfigJSON)(o),{miniprogramRoot:c}=t;if(!e)return{};const i=(0,tools_1.normalizePath)(path_1.default.posix.join(c||"",e));return checkPluginJSON({project:(0,reactiveCache_1.tryToGetReactiveProject)(o),filePath:path_1.default.posix.join(i,"plugin.json"),root:i})};exports.getGameLocalPluginJSON=getGameLocalPluginJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../projectconfig":1679975017851,"../../../utils/locales/locales":1679975017841,"../common":1679975017853,"../../../config":1679975017839,"../../validate/schemaValidate":1679975017857,"../../../utils/tools":1679975017847,"../../../utils/cache":1679975017855,"../../../utils/common":1679975017852,"../reactiveCache":1679975017856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017869, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkRequiredPrivateInfos=exports.checkResolveAlias=exports.checkRenderer=exports.checkOpenDataContext=exports.getAppJSONVariableDecalearProperty=exports.checkEntranceDeclare=exports.checkComponentPath=exports.checkMainPkgPluginIsInSubPkg=exports.checkMainPkgPageIsInSubpkg=exports.checkTabbarPage=exports.checkEntryPagePath=exports.checkPreloadRule=exports.checkFunctionalPages=exports.checkNavigateToMiniProgramAppIdList=exports.checkPlugins=exports.checkSubpackages=exports.checkSitemapLocation=exports.checkMainPkgPages=exports.checkOpenLocationPagePath=exports.checkWorkers=exports.checkTabbar=exports.checkWindow=exports.checkPageExist=void 0;const tslib_1=require("tslib"),lodash_1=(0,tslib_1.__importDefault)(require("lodash")),config_1=require("../../../config"),common_1=require("../common"),common_2=require("../../../utils/common"),tools_1=require("../../../utils/tools"),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),schemaValidate_1=require("../../validate/schemaValidate"),projectconfig_1=require("../projectconfig");function checkPageExist(e,o,t){const{miniprogramRoot:a,project:c,filePath:n}=e;c.stat(a,o+".wxml")||(0,common_2.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(t,o+".wxml"),code:config_1.FILE_NOT_FOUND,filePath:n}),c.stat(a,o+".js")||(0,common_2.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(t,o+".js"),code:config_1.FILE_NOT_FOUND,filePath:n})}function checkWindow(e){const{inputJSON:o,mode:t}=e;let a=""+e.filePath;o.themeLocation&&(a+=` or ${o.themeLocation}["${t}"]`);const c=[],{window:n}=o;n&&(void 0!==n.navigationBarBackgroundColor&&((0,tools_1.isHexColor)(n.navigationBarBackgroundColor)||c.push(`["window"]["navigationBarBackgroundColor"]: "${n.navigationBarBackgroundColor}" is not hexColor`)),void 0!==n.backgroundColor&&((0,tools_1.isHexColor)(n.backgroundColor)||c.push(`["window"]["backgroundColor"]: "${n.backgroundColor}" is not hexColor`)),c.length>0&&(0,common_2.throwError)({msg:c.join("\n"),filePath:a}))}function checkTabbar(e){const{project:o,miniprogramRoot:t,inputJSON:a,mode:c}=e;let n=""+e.filePath;a.themeLocation&&(n+=` or ${a.themeLocation}["${c}"]`);const{tabBar:r}=a,i=o.attrSync(),{setting:s}=i;if(!r)return;const l=[];r.list.length<s.MinTabbarCount&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_TABBAR_AT_LEAST.format(s.MinTabbarCount),filePath:n}),r.list.length>s.MaxTabbarCount&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_TABBAR_AT_MOST.format(s.MaxTabbarCount),filePath:n});for(let e=0;e<r.list.length;e++){const a=r.list[e],{pagePath:c}=a;if((0,common_2.checkPath)({value:c,tips:`["tabBar"]["list"][${e}]["pagePath"]`,filePath:n}),!c){l.push(locales_1.default.config.JSON_TABBAR_PATH_EMPTY.format(e));continue}c.indexOf("?")>=0&&l.push(locales_1.default.config.JSON_SHOULD_NOT_CONTAIN.format(`["tabBar"]["list"][${e}]["pagePath"]`,"?")),c.indexOf(".")>=0&&l.push(locales_1.default.config.JSON_SHOULD_NOT_CONTAIN.format(`["tabBar"]["list"][${e}]["pagePath"]`,"."));const i=r.list.slice(0,e).findIndex(e=>e.pagePath===c);i>=0&&l.push(locales_1.default.config.JSON_TABBAR_PATH_SAME_WITH_OTHER.format(e,i));const f=[];a.iconPath&&((0,common_2.checkPath)({value:a.iconPath,tips:`["tabBar"]["list"][${e}]["iconPath"]`,filePath:n,checkPathType:common_2.ECheckPathType.TAB_BAR_ICON}),f.push({name:"iconPath",path:a.iconPath})),a.selectedIconPath&&((0,common_2.checkPath)({value:a.selectedIconPath,tips:`["tabBar"]["list"][${e}]["selectedIconPath"]`,filePath:n,checkPathType:common_2.ECheckPathType.TAB_BAR_ICON}),f.push({name:"selectedIconPath",path:a.selectedIconPath})),f.forEach(a=>{const c=o.stat(t,a.path);if(!c)return void l.push(locales_1.default.config.NOT_FOUND.format(`["tabBar"]["list"][${e}]["${a.name}"]: "${a.path}"`));if(c.isDirectory)return void l.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(`["tabBar"]["list"][${e}]["${a.name}"]`,locales_1.default.config.FILE));c.size>1024*s.MaxTabbarIconSize&&l.push(locales_1.default.config.JSON_TABBAR_ICON_MAX_SIZE.format([e,a.name,s.MaxTabbarIconSize]));const n=path_1.default.posix.extname(a.path);config_1.TABBAR_ICON_WHITE_LIST.indexOf(n)<0&&l.push(locales_1.default.config.JSON_TABBAR_ICON_EXT.format([e,a.name,config_1.TABBAR_ICON_WHITE_LIST.join("、")]))})}l.length>0&&(0,common_2.throwError)({msg:l.join("\n"),filePath:n})}function checkWorkers(e){const{project:o,miniprogramRoot:t,filePath:a,inputJSON:c}=e,{workers:n}=c;if(void 0===n)return;const r='["workers"]';""===n&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(r,locales_1.default.config.DIRECTORY),filePath:a});const i=(0,tools_1.getWorkersPath)(n);(0,common_2.checkPath)({value:i,tips:r,filePath:a});const s=o.stat(t,i);s&&s.isDirectory||(0,common_2.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([r,locales_1.default.config.DIRECTORY]),filePath:a}),"string"==typeof c.workers?c.workers=(0,tools_1.normalizePath)(c.workers+"/"):c.workers.path=(0,tools_1.normalizePath)(c.workers.path+"/")}function checkOpenLocationPagePath(e){const{filePath:o,inputJSON:t}=e,{openLocationPagePath:a}=t;if(void 0===a)return;const c='["openLocationPagePath"]';(0,common_2.checkPath)({value:a,tips:c,filePath:o}),checkPageExist(e,a,c)}exports.checkPageExist=checkPageExist,exports.checkWindow=checkWindow,exports.checkTabbar=checkTabbar,exports.checkWorkers=checkWorkers,exports.checkOpenLocationPagePath=checkOpenLocationPagePath;const checkMainPkgPages=e=>{const{filePath:o,inputJSON:t}=e,{pages:a}=t;if(!a)return;const c={};for(let t=0;t<a.length;t++){const n=a[t],r=`["pages"][${t}]`;(0,common_2.checkPath)({value:n,tips:r,filePath:o}),c[n]&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_PAGES_REPEAT.format(`"${n}"`,'["pages"]'),filePath:o}),c[n]=!0,checkPageExist(e,n,r)}};function checkSitemapLocation(e){const{filePath:o,inputJSON:t}=e,{sitemapLocation:a}=t;if(void 0===a)return;const{project:c,miniprogramRoot:n}=e,r='["sitemapLocation"]';(0,common_2.checkPath)({value:a,tips:r,filePath:o});const i=c.stat(n,a);i&&!i.isDirectory||(0,common_2.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(r,a),filePath:o});".json"!==path_1.default.posix.extname(a)&&(0,common_2.throwError)({msg:locales_1.default.config.EXT_SHOULD_BE_ERROR.format(r,".json"),filePath:o});const s=c.getFile(n,a),l=(0,common_2.checkUTF8)(s,a),f=(0,common_1.checkJSONFormat)(l,a),h=(0,schemaValidate_1.schemaValidate)("sitemap",f);if(h.error.length){const e=h.error.map(e=>"type"===e.errorType||"enum"===e.errorType||"anyOf"===e.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([e.errorProperty,e.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([e.requireProperty])).join("\n");(0,common_2.throwError)({msg:e,filePath:a})}}function checkSubpackages(e){const{project:o,miniprogramRoot:t,filePath:a,inputJSON:c}=e;let n='["subPackages"]';c.subpackages&&(n='["subpackages"]',c.subPackages=c.subpackages,delete c.subpackages);const r=[];if(c.subPackages){const i=o.attrSync(),{setting:s}=i;c.subPackages.length>s.MaxSubPackageLimit&&(0,common_2.throwError)({msg:locales_1.default.config.EXCEED_LIMIT.format([n,s.MaxSubPackageLimit]),filePath:a});const l={},f={};for(let i=0;i<c.subPackages.length;i++){const s=c.subPackages[i],h=`${n}[${i}]`;if((0,common_2.checkPath)({value:s.root,tips:`${n}[${i}]["root"]`,filePath:a}),s.root===config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT){r.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${i}]["root"]`,config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT));continue}if(s.name){if(s.name===config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT){r.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${i}]["name"]`,config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT));continue}if(f[s.name]){r.push(locales_1.default.config.SAME_ITEM.format(h,f[s.name],"name"));continue}f[s.name]=h}if(s.root=(0,tools_1.normalizePath)(s.root+"/"),l[s.root]){r.push(locales_1.default.config.SAME_ITEM.format(h,l[s.root],"root"));continue}l[s.root]=h;const _=o.stat(t,s.root);if(!_){r.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([`${n}[${i}]["root"]`,locales_1.default.config.DIRECTORY]));continue}if(!_.isDirectory){r.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([`${n}[${i}]["root"]`,locales_1.default.config.DIRECTORY]));continue}const p={};for(let o=0,t=s.pages.length;o<t;o++){const t=s.pages[o];(0,common_2.checkPath)({value:t,tips:`${n}[${i}]["pages"][${o}]`,filePath:a});const c=(0,tools_1.normalizePath)(path_1.default.posix.join(s.root,t));p[c]?r.push(locales_1.default.config.JSON_PAGES_REPEAT.format([`"${t}"`,`${n}[${i}]`])):(p[c]=!0,checkPageExist(e,c,`${n}[${i}]["pages"][${o}]`))}}r.length>0&&(0,common_2.throwError)({msg:r.join("\n"),filePath:a});for(let e=0;e<c.subPackages.length;e++){const o=c.subPackages[e];let t=-1;const a="/"+o.root;c.subPackages.forEach((o,c)=>{if(c!==e&&o.root){const e="/"+o.root;0===a.indexOf(e)&&(t=c)}}),-1===t||r.push(locales_1.default.config.JSON_SHOULD_NOT_CONTAIN.format(`${n}[${t}]["root"]`,`${n}[${e}]["root"]`))}r.length>0&&(0,common_2.throwError)({msg:r.join("\n"),filePath:a})}}function checkPlugins(e){const{filePath:o,inputJSON:t,project:a}=e,c=[],n=t.plugins||{},r=(0,projectconfig_1.getProjectConfigJSON)(a);function i(e,o){var t;const{appid:n}=a,i=a.type===config_1.COMPILE_TYPE.miniProgramPlugin;if(i||"dev"!==e.version)if(i)"dev"===e.version&&e.provider!==n&&e.provider!==r.pluginAppid?c.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(o+'["provider"]',`"${null!==(t=r.pluginAppid)&&void 0!==t?t:n}"`)):e.provider===n&&"dev"!==e.version&&c.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(o+'["version"]','"dev"'));else{if("dev"===e.version||"latest"===e.version||/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(e.version)||/^dev-[A-Za-z0-9]+$/.test(e.version))return!0;c.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([o+'["version"]',locales_1.default.config.TRIPLE_NUMBER_DOT]))}else c.push(`${locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(o+'["version"]',"dev")}\n${locales_1.default.config.PLEASE_CHOOSE_PLUGIN_MODE}`)}for(const e in n){i(n[e],`["plugins"]["${e}"]`)}t.subPackages&&t.subPackages.forEach((e,o)=>{if(!e.plugins)return;const t=`["subPackages"][${o}]`;for(const o in e.plugins){i(e.plugins[o],`${t}["plugins"]["${o}"]`)}}),c.length>0&&(0,common_2.throwError)({msg:c.join("\n"),filePath:o})}function checkNavigateToMiniProgramAppIdList(e){const{filePath:o,inputJSON:t,project:a}=e,c=[];if(t.navigateToMiniProgramAppIdList){const e=a.attrSync(),{appType:o=config_1.APP_TYPE.NORMAL,setting:n}=e;if(o!==config_1.APP_TYPE.NATIVE){const e=null==n?void 0:n.NavigateMiniprogramLimit;t.navigateToMiniProgramAppIdList.length>e&&c.push(locales_1.default.config.EXCEED_LIMIT.format('["navigateToMiniProgramAppIdList"]',e))}}c.length>0&&(0,common_2.throwError)({msg:c.join("\n"),filePath:o})}function checkFunctionalPages(e){const{inputJSON:o}=e;if(o.functionalPages&&"object"!==(0,tools_1.getType)(o.functionalPages)){const e='["functionalPages"] 配置需要更新，详见文档: https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html';o.__warning__?o.__warning__=`${o.__warning__}\n${e}`:o.__warning__=e}}function checkPreloadRule(e,o){const{inputJSON:t,filePath:a}=e,{preloadRule:c,subPackages:n}=t;if(!c||!n)return;const r=[],i={},s={},l={};o.forEach(e=>{i[e.root]=!0,l[e.path]=!0,e.name&&(s[e.name]=!0)});for(const e in c){if(!l[e]&&!e.includes("__plugin__/")){r.push(locales_1.default.config.NOT_FOUND.format(`["preloadRule"]["${e}"]: ${locales_1.default.config.PAGE_PATH}`));continue}const o=c[e];for(let t=0,a=o.packages.length;t<a;t++){let a=o.packages[t];a!==config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT&&(s[a]||(a=(0,tools_1.normalizePath)(a+"/"),i[a]||r.push(locales_1.default.config.NOT_FOUND.format(`["preloadRule"]["${e}"]["packages"][${t}]: ${a}`))))}}r.length>0&&(0,common_2.throwError)({msg:r.join("\n"),filePath:a})}function checkEntryPagePath(e,o){const{inputJSON:t,filePath:a}=e,{entryPagePath:c}=t;if(!c)return;(0,common_2.checkPath)({value:c,tips:'["entryPagePath"]',filePath:a});let n=!1;for(const e of o)if(e.path===c){n=!0;break}n||(0,common_2.throwError)({msg:locales_1.default.config.JSON_ENTRY_PAGE_PATH_NOT_FOUND.format(["pages、subPackages","entryPagePath"]),filePath:a})}function checkTabbarPage(e){const{filePath:o,inputJSON:t}=e,{tabBar:a,pages:c=[]}=t;if(!a)return;const n=[];for(let e=0;e<a.list.length;e++){const o=a.list[e],{pagePath:t}=o;c.indexOf(t)<0&&n.push(`["tabBar"][${e}]["pagePath"]: "${t}" need in ["pages"]`)}n.length>0&&(0,common_2.throwError)({msg:n.join("\n"),filePath:o})}function checkMainPkgPageIsInSubpkg(e){const{filePath:o,inputJSON:t}=e,{subPackages:a,pages:c=[]}=t;if(!a)return;const n=[];for(let e=0;e<a.length;e++){const o=a[e];for(let t=0;t<c.length;t++){const a=c[t];0===a.indexOf(o.root)&&n.push(locales_1.default.config.SHOULD_NOT_IN.format([`["pages"][${t}]: "${a}"`,`["subPackages"][${e}]`]))}}n.length>0&&(0,common_2.throwError)({msg:n.join("\n"),filePath:o})}function checkMainPkgPluginIsInSubPkg(e){const{filePath:o,inputJSON:t}=e,{plugins:a={},subPackages:c}=t,n={},r={},i=[];for(const e in a){const o=a[e],t=`["plugins"]["${e}"]`;n[o.provider]?i.push(locales_1.default.config.SAME_ITEM.format(`["plugins"]["${e}"]`,n[o.provider].tips,"provider")):n[o.provider]=r[e]={provider:o.provider,version:o.version,alias:e,tips:t}}if(c)for(let e=0;e<c.length;e++){const o=c[e];if(o.plugins)for(const t in o.plugins){const a=`["subPackages"][${e}]["plugins"]`,c=o.plugins[t];n[c.provider]?i.push(locales_1.default.config.SAME_ITEM.format(`${a}["${t}"]`,n[c.provider].tips,"provider")):r[t]?i.push(locales_1.default.config.PLUGINS_SAME_ALIAS.format(`${a}["${t}"]`,r[t].tips)):n[c.provider]=r[t]={provider:c.provider,version:c.version,alias:c,tips:a}}}i.length>0&&(0,common_2.throwError)({msg:i.join("\n"),filePath:o})}function checkComponentPath(e){const{project:o,miniprogramRoot:t,filePath:a,inputJSON:c}=e;(0,common_1.checkComponentPath)({project:o,root:t,relativePath:path_1.default.posix.relative(t,a),inputJSON:c})}function checkEntranceDeclare(e){const o=e.inputJSON;if(!o.entranceDeclare||!o.entranceDeclare.locationMessage)return;let t=o.pages||[];o.subpackages&&(t=t.concat(o.subpackages.map(e=>e.pages.map(o=>e.root+o))),t=lodash_1.default.flattenDeep(t)),o.subPackages&&(t=t.concat(o.subPackages.map(e=>e.pages.map(o=>e.root+o))),t=lodash_1.default.flattenDeep(t));const a=[],c=o.entranceDeclare.locationMessage.path;void 0===c?a.push(locales_1.default.config.JSON_ENTRANCE_DECLARE_PATH_EMPTY.format([])):t.includes(c)||a.push(locales_1.default.config.JSON_ENTRANCE_DECLARE_PATH_ERR.format([c||"undefined"])),a.length>0&&(0,common_2.throwError)({msg:a.join("\n"),filePath:e.filePath})}function getAppJSONVariableDecalearProperty(e){const{windowPropertWhiteList:o,tabBarPropertyWhiteList:t,tabbarListItemPropertyWhiteList:a}=config_1.jsonVariablePropertyWhiteList;let c=[];return"[object Object]"===Object.prototype.toString.call(e.window)&&(c=c.concat(Object.keys(e.window).filter(e=>o.includes(e)).map(o=>({property:`["window"]["${o}"]`,value:e.window[o]})).filter(e=>e.value.startsWith("@")))),"[object Object]"===Object.prototype.toString.call(e.tabBar)&&(c=c.concat(Object.keys(e.tabBar).filter(e=>t.includes(e)).map(o=>({property:`["tabBar"]["${o}"]`,value:e.tabBar[o]})).filter(e=>e.value.startsWith("@"))),Array.isArray(e.tabBar.list)&&e.tabBar.list.forEach((o,t)=>{c=c.concat(Object.keys(o).filter(e=>a.includes(e)).map(o=>({property:`["tabBar"]["list"][${t}]["${o}"]`,value:e.tabBar.list[t][o]})).filter(e=>e.value.startsWith("@")))})),c}function checkOpenDataContext(e,o){const{project:t,miniprogramRoot:a,filePath:c}=e,{openDataContext:n}=o;if(void 0===n)return;(0,common_2.checkPath)({value:n,tips:'["openDataContext"]',filePath:c});const r=t.stat(a,n);r&&r.isDirectory||(0,common_2.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(['["openDataContext"]',locales_1.default.config.DIRECTORY]),filePath:c});const i=path_1.default.posix.join(n,"./index.js"),s=t.stat(a,i);s&&s.isFile||(0,common_2.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format('["openDataContext"]',i),filePath:c}),o.openDataContext=(0,tools_1.normalizePath)(n+"/")}function checkRenderer(e){const{filePath:o,inputJSON:t}=e,{renderer:a,lazyCodeLoading:c}=t;"skyline"===a&&"requiredComponents"!==c&&(0,common_2.throwError)({msg:locales_1.default.config.APP_JSON_SHOULD_SET_LAZYCODELOADING.format("app.json"),filePath:o})}function checkResolveAlias(e){const{filePath:o,inputJSON:t}=e,{resolveAlias:a}=t;if(a){const e=e=>e.includes("//");for(const t in a)(e(t)||e(a[t]))&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_RESOLVE_ALIAS_ILLEGAL.format(t,a[t]),filePath:o}),a[t].startsWith("./")&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_RESOLVE_ALIAS_SHOULD_NOT_START_WITH.format(a[t]),filePath:o}),t.endsWith("/*")&&a[t].endsWith("/*")||(0,common_2.throwError)({msg:locales_1.default.config.JSON_RESOLVE_ALIAS_INCLUDE_STAR.format(t,a[t]),filePath:o})}}exports.checkMainPkgPages=checkMainPkgPages,exports.checkSitemapLocation=checkSitemapLocation,exports.checkSubpackages=checkSubpackages,exports.checkPlugins=checkPlugins,exports.checkNavigateToMiniProgramAppIdList=checkNavigateToMiniProgramAppIdList,exports.checkFunctionalPages=checkFunctionalPages,exports.checkPreloadRule=checkPreloadRule,exports.checkEntryPagePath=checkEntryPagePath,exports.checkTabbarPage=checkTabbarPage,exports.checkMainPkgPageIsInSubpkg=checkMainPkgPageIsInSubpkg,exports.checkMainPkgPluginIsInSubPkg=checkMainPkgPluginIsInSubPkg,exports.checkComponentPath=checkComponentPath,exports.checkEntranceDeclare=checkEntranceDeclare,exports.getAppJSONVariableDecalearProperty=getAppJSONVariableDecalearProperty,exports.checkOpenDataContext=checkOpenDataContext,exports.checkRenderer=checkRenderer,exports.checkResolveAlias=checkResolveAlias;const detailLocationApis={getLocation:!0,onLocationChange:!0,startLocationUpdate:!0,startLocationUpdateBackground:!0};function checkRequiredPrivateInfos(e){const{filePath:o,inputJSON:t}=e,{requiredPrivateInfos:a}=t;if(a){if(a.indexOf("getFuzzyLocation")>=0){const e=[];for(let o=0;o<a.length;o++){const t=a[o];detailLocationApis[t]&&e.push(`'${t}'`)}e.length>0&&(0,common_2.throwError)({msg:locales_1.default.config.JSON_REQUIRED_PRIVATE_INFOS_MUTUALLY_EXCLUSIVE.format("'getFuzzyLocation'",e.join("、")),filePath:o})}}}exports.checkRequiredPrivateInfos=checkRequiredPrivateInfos;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../config":1679975017839,"../common":1679975017853,"../../../utils/common":1679975017852,"../../../utils/tools":1679975017847,"../../../utils/locales/locales":1679975017841,"../../validate/schemaValidate":1679975017857,"../projectconfig":1679975017851}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017870, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.innerUpload=exports.upload=exports.SIGNATURE_FILE_NAME=void 0;const tslib_1=require("tslib"),request_1=require("../utils/request"),compile_1=require("../core/compile"),pack_1=require("./utils/pack"),zlib_1=(0,tslib_1.__importDefault)(require("zlib")),sign_1=require("../utils/sign"),tools_1=require("../utils/tools"),config_1=require("../config"),taskstatus_1=require("../utils/taskstatus"),log_1=(0,tslib_1.__importDefault)(require("../utils/log")),error_1=require("../utils/error"),locales_1=(0,tslib_1.__importDefault)(require("../utils/locales/locales")),querystring_1=(0,tslib_1.__importDefault)(require("querystring")),url_config_1=require("../utils/url_config"),jsonParse_1=require("../utils/jsonParse"),cache_1=require("../utils/cache"),cos_upload_1=require("./cos-upload"),filterUnusedFile_1=require("./utils/filterUnusedFile");exports.SIGNATURE_FILE_NAME="ci.signature";const MIN_COS_UPLOAD_SIZE=5242880;async function upload(e){var o;const t=await innerUpload(e);return(null===(o=t.respBody)||void 0===o?void 0:o.dev_plugin_id)&&(log_1.default.log("Development Version Plugin ID: "+t.respBody.dev_plugin_id),t.devPluginId=t.respBody.dev_plugin_id),{subPackageInfo:t.subPackageInfo,pluginInfo:t.pluginInfo,devPluginId:t.devPluginId}}async function innerUpload(e){const{project:o,setting:t={},desc:r=`robot ${e.robot||"1"} use miniprogram-ci to upload at ${(0,tools_1.formatTime)(new Date)}`,version:i="",robot:a="1",onProgressUpdate:l=function(e){console.log(""+e)},test:s,pagePath:n,searchQuery:u,threads:p=0,bigPackageSizeSupport:_,allowIgnoreUnusedFiles:d=!0}=e;let{useCOS:c}=e;if(process.env.COMPILE_THREADS=p.toString(),!i)throw new error_1.CodeError(locales_1.default.config.PARAM_ERROR.format("upload","version"),config_1.PARAM_ERROR);if(!o)throw new error_1.CodeError(locales_1.default.config.PARAM_ERROR.format("upload","project"),config_1.PARAM_ERROR);cache_1.cacheManager.clean();let f=await(0,compile_1.compile)(o,{setting:t,onProgressUpdate:l});!1!==d&&(f=await(0,filterUnusedFile_1.filterUnusedFile)(!!s,o,f));const g=config_1.CI_VERSION,b={codeprotect:t.codeProtect?1:0,type:o.type,appid:o.appid,version:i,desc:r,robot:a},y={scene:e.scene||1011};let S;n&&(y.path=n,b.path=n),u&&(y.query=querystring_1.default.parse(u)),b.debugLaunchInfo=JSON.stringify(y),n&&u&&(b.path+="?"+u),s&&_&&(b.bigPackageSizeSupport=1);let q={};try{S=await o.getFile(o.miniprogramRoot,"ext.json"),q=JSON.parse(S.toString("utf-8"))}catch(e){}if(q&&(q.extEnable&&(b.extAppId=q.extAppid),q.directCommit)){let e="";e=q.extEnable?"The code will be uploaded into the waiting list of extAppid.":"The code will be uploaded into the draft box of the third-party platform.",log_1.default.warn(e)}try{const e=new taskstatus_1.TaskStatus(locales_1.default.config.UPLOAD.toString());l(e);const t=`${s?url_config_1.TEST_SOURCE_URL:url_config_1.UPLOAD_URL}?${querystring_1.default.stringify(b)}`;let r,i=!1,n=0;const u=(0,pack_1.pack)(f),p=zlib_1.default.gzipSync(u.buffer);if(log_1.default.info("useCOS parameter: ",c),log_1.default.info("upload zip buffer size: ",p.length),void 0===c&&(c=p.length>5242880),c){log_1.default.info("upload by COS: ",c);const e=await(0,cos_upload_1.uploadByCos)(p,t,o,a);e.fallback?(i=e.fallback,log_1.default.info("upload by COS failed, fallback to http way")):(r={body:e.body},n=e.uploadCOSCostTime)}if(!c||i){const e=await(0,sign_1.getSignature)(o.privateKey,o.appid);f[exports.SIGNATURE_FILE_NAME]=JSON.stringify({signature:e,version:g});const i=(0,pack_1.pack)(f),a=zlib_1.default.gzipSync(i.buffer);log_1.default.info("request url:",t);let l=(await(0,request_1.request)({url:t,method:"post",body:a})).body.toString();if(r=(0,jsonParse_1.jsonRespParse)(l,t),0!==r.errCode)throw new Error(l)}e.done(),l(e);const _={respBody:r.body};if(Array.isArray(r.body.subpackage_info)){const e=r.body.subpackage_info;_.subPackageInfo=e}if(Array.isArray(r.body.ext_plugin_info)){const e=r.body.ext_plugin_info;_.pluginInfo=e.map(e=>({pluginProviderAppid:e.provider,version:e.version,size:e.size}))}return _}catch(e){throw new error_1.CodeError(e.toString(),config_1.UPLOAD_CGI_ERR)}}exports.upload=upload,exports.innerUpload=innerUpload;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/request":1679975017835,"../core/compile":1679975017871,"./utils/pack":1679975017945,"../utils/sign":1679975017838,"../utils/tools":1679975017847,"../config":1679975017839,"../utils/taskstatus":1679975017880,"../utils/log":1679975017836,"../utils/error":1679975017840,"../utils/locales/locales":1679975017841,"../utils/url_config":1679975017845,"../utils/jsonParse":1679975017846,"../utils/cache":1679975017855,"./cos-upload":1679975017946,"./utils/filterUnusedFile":1679975017947}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017871, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compile=void 0;const tslib_1=require("tslib"),game_1=require("./game"),mini_program_1=require("./mini_program"),mini_program_plugin_1=require("./mini_program_plugin"),game_plugin_1=require("./game_plugin"),config_1=require("../../config"),reactiveCache_1=require("../json/reactiveCache"),common_1=require("../../utils/common"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales"));async function checkProjectTypeMatchProjectAttr(e){const i=await e.attr();!i.gameApp||e.type!==config_1.COMPILE_TYPE.miniProgramPlugin&&e.type!==config_1.COMPILE_TYPE.miniProgram||(0,common_1.throwError)({filePath:"",msg:locales_1.default.config.PROJECT_TYPE_ERROR.format(e.type,e.appid,locales_1.default.config.MINI_GAME),code:config_1.PROJECT_TYPE_ERROR}),i.gameApp||e.type!==config_1.COMPILE_TYPE.miniGame&&e.type!==config_1.COMPILE_TYPE.miniGamePlugin||(0,common_1.throwError)({filePath:"",msg:locales_1.default.config.PROJECT_TYPE_ERROR.format(e.type,e.appid,locales_1.default.config.MINI_PROGRAM),code:config_1.PROJECT_TYPE_ERROR})}async function compile(e,i){const o=(0,reactiveCache_1.tryToGetReactiveProject)(e);return await o.updateProject(),i.__compileDebugInfo__?i.__compileDebugInfo__.ciVersion=config_1.CI_VERSION:i.__compileDebugInfo__={from:"ci",useNewCompileModule:!0,devtoolsVersion:"0",compileSetting:i.setting,ciVersion:config_1.CI_VERSION},process.env.isDevtools&&(e.nameMappingFromDevtools=i.nameMapping||{}),await checkProjectTypeMatchProjectAttr(e),e.type===config_1.COMPILE_TYPE.miniGame?(0,game_1.compile)(e,i):e.type===config_1.COMPILE_TYPE.miniProgramPlugin?(0,mini_program_plugin_1.compile)(e,i):e.type===config_1.COMPILE_TYPE.miniGamePlugin?(0,game_plugin_1.compile)(e,i):(0,mini_program_1.compile)(e,i)}exports.compile=compile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./game":1679975017872,"./mini_program":1679975017927,"./mini_program_plugin":1679975017943,"./game_plugin":1679975017944,"../../config":1679975017839,"../json/reactiveCache":1679975017856,"../../utils/common":1679975017852,"../../utils/locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017872, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compile=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),game_1=(0,tslib_1.__importDefault)(require("../json/game")),projectconfig_1=require("../json/projectconfig"),common_1=require("./common"),taskstatus_1=require("../../utils/taskstatus"),config_1=require("../../config"),common_2=require("../../utils/common"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),white_ext_list_1=require("../../utils/white_ext_list"),uglifyfilenames_1=require("../protect/uglifyfilenames");async function compileGameJSON(e,t){const{onProgressUpdate:i=(()=>{})}=t,o=new taskstatus_1.TaskStatus("game.json");i(o);const a=await(0,game_1.default)(e);return o.done(),i(o),a}async function compile(e,t){var i;const o=await(0,projectconfig_1.getProjectConfigJSON)(e),a=o.miniprogramRoot||"",{GameWhiteList:s}=await(0,white_ext_list_1.getWhiteExtList)(),n=e.getFileList(a,"").filter(common_1.isNotIgnoredByProjectConfig.bind(null,o,a)).filter(e=>s.has(path_1.default.posix.extname(e))),r=await compileGameJSON(e,t);e.stat(a,"game.js")||(0,common_2.throwError)({msg:locales_1.default.config.FILE_NOT_FOUND.format(path_1.default.posix.join(a,"game.js")),filePath:path_1.default.posix.join(a,"game.js"),code:config_1.FILE_NOT_FOUND});const m=n.filter(e=>".js"===path_1.default.posix.extname(e)).map(e=>path_1.default.posix.relative(a,e)),l=await(0,common_1.compileJSFiles)(e,m,a,t),_=n.filter(e=>e!==path_1.default.posix.join(a,"game.json")&&".js"!==path_1.default.posix.extname(e)),c=await(0,common_1.compileOther)(e,_,t),p=await(0,common_1.getUploadProjectConfig)(e,o);let f=Object.assign(Object.assign({},l),c);if(e.type===config_1.COMPILE_TYPE.miniGame){if(p.miniprogramRoot&&"."!==p.miniprogramRoot&&"./"!==p.miniprogramRoot){const t={};for(const i in f)t[path_1.default.posix.relative(e.miniprogramRoot,i)]=f[i];f=t}p.miniprogramRoot="",f["game.json"]=JSON.stringify(r)}else f[path_1.default.posix.join(p.miniprogramRoot||"","game.json")]=JSON.stringify(r);return p.__compileDebugInfo__=t.__compileDebugInfo__||{},f["project.config.json"]=JSON.stringify(p),delete f["project.private.config.json"],e.type===config_1.COMPILE_TYPE.miniGame&&(null===(i=t.setting)||void 0===i?void 0:i.codeProtect)&&(f=await(0,uglifyfilenames_1.uglifyFileNames)(e,f)),f}exports.compile=compile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../json/game":1679975017873,"../json/projectconfig":1679975017851,"./common":1679975017877,"../../utils/taskstatus":1679975017880,"../../config":1679975017839,"../../utils/common":1679975017852,"../../utils/locales/locales":1679975017841,"../../utils/white_ext_list":1679975017924,"../protect/uglifyfilenames":1679975017925}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017873, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),cache_1=require("../../utils/cache"),common_1=require("../../utils/common"),config_1=require("../../config"),tools_1=require("../../utils/tools"),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),projectconfig_1=require("./projectconfig"),common_2=require("./common"),schemaValidate_1=require("../validate/schemaValidate"),reactiveCache_1=require("./reactiveCache"),signatureValidate=require("../validate/signaturejson"),gamePluginJSONValidate=require("../validate/gamepluginjson");function isPluginMode(o){return o.type===config_1.COMPILE_TYPE.miniGamePlugin}function checkLocalPlugin(o,t){const{project:e,root:a,filePath:r}=o,i=t.path;let n=e.stat(a,i);n&&n.isDirectory||(0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(t.tips+'["path"]',locales_1.default.config.DIRECTORY),filePath:r});const c=path_1.default.posix.join(i,"signature.json");n=e.stat(a,c);let _=(0,tools_1.normalizePath)(path_1.default.posix.join(a,c));n||(0,common_1.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(t.tips+'["path"]',_),filePath:r,code:config_1.FILE_NOT_FOUND});let s=e.getFile(a,c),l=(0,common_1.checkUTF8)(s,_);const f=(0,common_2.checkJSONFormat)(l,_);try{signatureValidate.check(f)}catch(o){(0,common_1.throwError)({msg:"signature.json"+o.message,filePath:_})}f.provider!==t.provider&&(0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format('["provider"]',`"${t.provider}"`),filePath:_});for(let o=0;o<f.signature.length;o++){const t=f.signature[o];(0,common_1.checkPath)({value:t.path,tips:`["signature"][${o}]["path"]`,filePath:_});const r=path_1.default.posix.join(i,t.path);n=e.stat(a,r),n&&n.isFile||(0,common_1.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`["signature"][${o}]["path"]`,r),filePath:_,code:config_1.FILE_NOT_FOUND});const c=e.getFile(a,r),s=(0,tools_1.generateMD5)(c);s!==t.md5&&(0,common_1.throwError)({msg:locales_1.default.config.GAME_PLUGIN_SIGNATURE_MD5_NOT_MATCH_CONTENT.format(path_1.default.posix.join(i,t.path),s,t.md5),code:config_1.GAME_PLUGIN_LIB_MD5_NOT_MATCH,filePath:_})}const m=path_1.default.posix.join(i,"plugin.json");n=e.stat(a,m),_=(0,tools_1.normalizePath)(path_1.default.posix.join(a,m)),n||(0,common_1.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(t.tips+'["path"]',_),code:config_1.FILE_NOT_FOUND,filePath:r}),s=e.getFile(a,m),l=(0,common_1.checkUTF8)(s,_);const g=(0,common_2.checkJSONFormat)(l,_);try{gamePluginJSONValidate.check(g)}catch(o){(0,common_1.throwError)({msg:"plugin.json"+o.message,filePath:_})}g.main&&((0,common_1.checkPath)({value:g.main,tips:'["main"]',filePath:_}),n=e.stat(a,path_1.default.posix.join(i,g.main)),n||(0,common_1.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format('["main"]',""+g.main),filePath:_,code:config_1.FILE_NOT_FOUND}))}function checkPluginPath(o,t){const{subPackages:e}=t,a=[],r=(o,t,e)=>{const{plugins:r}=o;if(r)for(const o in r){if(!r.hasOwnProperty(o))continue;const i=r[o];i&&i.path&&a.push({alias:o,version:i.version||"",provider:i.provider||"",tips:`${e}["plugins"]["${o}"]`,path:(0,tools_1.normalizePath)(path_1.default.posix.join(t,i.path))})}};if(r(t,"",""),e)for(let o=0;o<e.length;o++){const t=e[o];r(t,t.root||"",`["subPackages"][${o}]`)}if(!(a.length<=0))for(const t of a)checkLocalPlugin(o,t)}function checkPlugins(o,t){const{project:e,filePath:a}=o,r=[],i=t.plugins||{};function n(o,t){const i=e.appid,n=isPluginMode(e);if(n||"dev"!==o.version)if(n&&"dev"===o.version&&o.provider!==i)r.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(t+'["provider"]',i));else if("dev"!==o.version||"string"!=typeof o.path){if("dev"===o.version||"latest"===o.version||/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(o.version)||/^dev-[A-Za-z0-9]+$/.test(o.version))return o.path&&(0,common_1.checkPath)({value:o.path,tips:t+'["path"]',filePath:a}),!0;r.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(t+'["version"]',locales_1.default.config.TRIPLE_NUMBER_DOT))}else r.push(locales_1.default.config.GAME_DEV_PLUGIN_SHOULD_NOT_USE_LOCAL_PATH.format(t,t+'["path"]'));else r.push(`${locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(t+'["version"]',"dev")}\n${locales_1.default.config.PLEASE_CHOOSE_PLUGIN_MODE}`)}const c={},_={};for(const o in i){if(!i.hasOwnProperty(o))continue;const t=i[o];n(t,`["plugins"]["${o}"]`)&&(c[t.provider]?r.push(locales_1.default.config.SAME_ITEM.format(`["plugins"]["${o}"]`,c[t.provider].tips,"provider")):c[t.provider]=_[o]={provider:t.provider,version:t.version,alias:o,path:t.path||"",tips:`["plugins"]["${o}"]`})}const s=t.subPackages||t.subpackages;if(Array.isArray(s))for(let o=0,t=s.length;o<t;o++){const t=s[o];if(!t.plugins)continue;const e=`["subPackages"][${o}]["plugins"]`;for(const o in t.plugins){const a=t.plugins[o],i=`${e}["${o}"]`;n(a,i)&&(c[a.provider]?r.push(locales_1.default.config.SAME_ITEM.format(i,c[a.provider].tips,"provider")):_[o]?r.push(locales_1.default.config.PLUGINS_SAME_ALIAS.format(i,_[o].tips)):c[a.provider]=_[o]={provider:a.provider,version:a.version,alias:o,path:a.path||"",tips:i})}}r.length>0&&(0,common_1.throwError)({msg:r.join("\n"),filePath:a})}function checkSubpackages(o,t){const{root:e,project:a,filePath:r}=o,i=[];let n='["subPackages"]';if(t.subpackages&&(n='["subpackages"]',t.subPackages=t.subpackages,delete t.subpackages),t.subPackages){const o=a.attrSync(),{setting:c}=o;t.subPackages.length>c.MaxSubPackageLimit&&(0,common_1.throwError)({msg:locales_1.default.config.EXCEED_LIMIT.format([n,c.MaxSubPackageLimit]),filePath:r});const _={},s={};for(let o=0,r=t.subPackages.length;o<r;o++){const r=t.subPackages[o];if(r.name){if(r.name===config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT){i.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${o}]["name"]`,config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT));continue}if(r.name===config_1.MINI_GAME_MAIN_PACKAGE_ROOT){i.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${o}]["name"]`,config_1.MINI_GAME_MAIN_PACKAGE_ROOT));continue}_[r.name]&&i.push(locales_1.default.config.SAME_ITEM.format(`${n}[${o}]`,_[r.name],"name")),_[r.name]=`${n}[${o}]`}if(r.root===config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT){i.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${o}]["root"]`,config_1.MINI_PROGRAM_MAIN_PACKAGE_ROOT));continue}if(r.root===config_1.MINI_GAME_MAIN_PACKAGE_ROOT){i.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${o}]["root"]`,config_1.MINI_GAME_MAIN_PACKAGE_ROOT));continue}if(r.root===config_1.MINI_GAME_WORKERS_PACKAGE_ROOT){i.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${o}]["root"]`,config_1.MINI_GAME_WORKERS_PACKAGE_ROOT));continue}if(r.root==="/"+config_1.MINI_GAME_WORKERS_PACKAGE_ROOT){i.push(locales_1.default.config.JSON_CONTENT_SHOULD_NOT_BE.format(`${n}[${o}]["root"]`,"/"+config_1.MINI_GAME_WORKERS_PACKAGE_ROOT));continue}if(r.root.startsWith(".")){i.push(locales_1.default.config.JSON_SHOULD_NOT_START_WITH.format(`${n}[${o}]["root"]`,"."));continue}if(r.root.startsWith("__wx__")){i.push(locales_1.default.config.JSON_SHOULD_NOT_START_WITH.format(`${n}[${o}]["root"]`,"__wx__"));continue}r.root.startsWith("/")||(r.root=(0,tools_1.normalizePath)("/"+r.root)),/\.js$/.test(r.root)?r.root=(0,tools_1.normalizePath)(r.root):r.root=(0,tools_1.normalizePath)(r.root+"/"),s[r.root]&&i.push(locales_1.default.config.SAME_ITEM.format(`${n}[${o}]`,s[r.root],"root")),s[r.root]=`${n}[${o}]`;const c=a.stat(e,r.root);if(c){if(c.isDirectory){/\/$/.test(r.root)||(r.root+="/");const t=path_1.default.posix.join(r.root,"./game.js"),c=a.stat(e,t);c&&c.isFile||i.push(locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format(`${n}[${o}]["root"]`,t))}}else i.push(locales_1.default.config.JSON_CONTENT_NOT_FOUND.format(`${n}[${o}]["root"]`))}}i.length>0&&(0,common_1.throwError)({msg:i.join("\n"),filePath:r})}function checkLoadingImageUrl(o,t){const{project:e,root:a,filePath:r}=o,{loadingImageInfo:i}=t;if(!i)return;(0,common_1.checkPath)({tips:'["loadingImageInfo"]["path"]',value:i.path,filePath:r});const n=e.stat(a,i.path);n&&n.isFile||(0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_NOT_FOUND.format(`["loadingImageInfo"]["path"]: "${i.path}"`),filePath:r}),i.progressBarColor&&!(0,tools_1.isHexColor)(i.progressBarColor)&&(0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(`["loadingImageInfo"]["progressBarColor"]: "${i.progressBarColor}"`,"HexColor"),filePath:r})}function checkWorkers(o,t){const{project:e,root:a,filePath:r}=o,{workers:i}=t;if(void 0===i)return;const n=(0,tools_1.getWorkersPath)(i);(0,common_1.checkPath)({tips:'["workers"]',value:n,filePath:r});const c=e.stat(a,n);c&&!c.isFile||(0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(['["workers"]',locales_1.default.config.DIRECTORY]),filePath:r})}function checkOpenDataContext(o,t){const{project:e,root:a,filePath:r}=o,{openDataContext:i}=t;if(void 0===i)return;(0,common_1.checkPath)({value:i,tips:'["openDataContext"]',filePath:r});const n=e.stat(a,i);n&&n.isDirectory||(0,common_1.throwError)({msg:locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(['["openDataContext"]',locales_1.default.config.DIRECTORY]),filePath:r});const c=path_1.default.posix.join(i,"./index.js"),_=e.stat(a,c);_&&_.isFile||(0,common_1.throwError)({msg:locales_1.default.config.CORRESPONDING_FILE_NOT_FOUND.format('["openDataContext"]',c),filePath:r}),t.openDataContext=(0,tools_1.normalizePath)(i+"/")}function checkGameJSON(o){const{project:t,root:e,filePath:a}=o;t.stat(e,"game.json")||(0,common_1.throwError)({msg:locales_1.default.config.FILE_NOT_FOUND.format(path_1.default.posix.join(a)),filePath:a,code:config_1.FILE_NOT_FOUND});const r=t.getFile(e,"game.json"),i=(0,common_2.checkJSONFormat)((0,common_1.checkUTF8)(r,a),a),n=(0,schemaValidate_1.schemaValidate)("game",i);if(n.warning&&(i.__warning__=locales_1.default.config.INVALID.format(n.warning)),n.error.length){const o=n.error.map(o=>"type"===o.errorType||"enum"===o.errorType||"anyOf"===o.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([o.errorProperty,o.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([o.requireProperty])).join("\n");(0,common_1.throwError)({msg:o,filePath:a})}return checkOpenDataContext(o,i),checkPlugins(o,i),checkSubpackages(o,i),checkPluginPath(o,i),checkLoadingImageUrl(o,i),checkWorkers(o,i),i}const getGameJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.GAME_JSON,o=>{const t=(0,projectconfig_1.getProjectConfigJSON)(o).miniprogramRoot||"";return checkGameJSON({project:o,root:t,filePath:(0,tools_1.normalizePath)(path_1.default.posix.join(t,"game.json"))})});exports.default=getGameJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/cache":1679975017855,"../../utils/common":1679975017852,"../../config":1679975017839,"../../utils/tools":1679975017847,"../../utils/locales/locales":1679975017841,"./projectconfig":1679975017851,"./common":1679975017853,"../validate/schemaValidate":1679975017857,"./reactiveCache":1679975017856,"../validate/signaturejson":1679975017874,"../validate/gamepluginjson":1679975017876}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017874, function(require, module, exports) {
const T=require("./validate");module.exports=new T("object",!1,{signature:new T("array",!0,new T("object",!1,{path:new T("string",!0),md5:new T("string",!0)})),provider:new T("string",!0)});
}, function(modId) { var map = {"./validate":1679975017875}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017875, function(require, module, exports) {
const tslib_1=require("tslib"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales"));function getType(e){return Object.prototype.toString.call(e).toLowerCase().split(" ")[1].replace("]","")}class T{constructor(e,t,r){this.type=e,this.required=t||!1;const o=this.valueType=getType(r);if("undefined"!==o)if(r instanceof T){if("array"!==e&&"object"!==e)throw new Error("value can be instance of ValidateType only when type is object or array");this.value=r}else if("array"!==o)if("regexp"!==o)if("object"!==o){if(e!==o)throw new Error(`value should be ${e} instead of ${o}`);this.value=r}else{if("object"!==e)throw new Error(e+" could not have object value");for(const e in r)if(!(r[e]instanceof T))throw new Error(`value["${e}"] should be instance of ValidateType`);this.value=r}else{if("regexp"!==e&&"string"!==e)throw new Error(e+" could not have regexp value");this.value=r}else{if("array"===e||"object"===e||"function"===e)throw new Error(e+" could not have optional value");for(let t=0,o=r.length;t<o;t++){const o=getType(r[t]);if(o!==e)throw new Error(`value[${t}] should be ${e} instead of ${o}`)}this.value=r}}static invalidKeys(e,t){const r=[];if(e instanceof T){try{e.check(t)}catch(e){return}if("object"!==e.type||"object"!==e.valueType||"object"!==getType(t))return;const o=e.value instanceof T;for(const i in t){let n=[];if(o)n=T.invalidKeys(e.value,t[i]);else{if(!e.value.hasOwnProperty(i)){r.push(`["${i}"]`);continue}n=T.invalidKeys(e.value[i],t[i])}n&&n.forEach(e=>{r.push(`["${i}"]${e}`)})}}else for(const o in t){if(!e.hasOwnProperty(o)){r.push(`["${o}"]`);continue}const i=T.invalidKeys(e[o],t[o]);i&&i.forEach(e=>{r.push(`["${o}"]${e}`)})}if(r.length>0)return r}check(e){const t=getType(e);if(!this.required&&"undefined"===t)return;if("ignore"===this.type)return;if(t!==this.type)throw new Error(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(["",this.type]));const r=this.valueType;if("undefined"!==r){if(this.value instanceof T){if("object"===this.type){for(const t in e)try{this.value.check(e[t])}catch(e){throw new Error(`["${t}"]${e.message}`)}return}if("array"===this.type){if(0===e.length&&this.value.required)throw new Error(locales_1.default.config.SHOULD_AT_LEAST_ONE_ITEM.format(""));for(let t=0,r=e.length;t<r;t++)try{this.value.check(e[t])}catch(e){throw new Error(`[${t}]${e.message}`)}return}}if("array"!==r)if("object"!==r)if("regexp"!==r){if(this.value!==e)throw new Error(locales_1.default.config.SHOULD_EQUAL.format(["",this.value.toString()]))}else{if("string"===this.type){if(!this.value.test(e))throw new Error(locales_1.default.config.SHOULD_MATCH.format(["",this.value.toString()]));return}if("regexp"===this.type&&this.value.toString()!==e.toString())throw new Error(locales_1.default.config.SHOULD_EQUAL.format(["",this.value.toString()]))}else for(const t in this.value){const r=this.value[t];try{r.check(e[t])}catch(e){throw new Error(`["${t}"]${e.message}`)}}else{let t=!1;for(const r of this.value)if(r===e){t=!0;break}if(!t)throw new Error(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format(["",this.value.join(` ${locales_1.default.config.OR} `)]))}}}}module.exports=T;
}, function(modId) { var map = {"../../utils/locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017876, function(require, module, exports) {
const T=require("./validate");module.exports=new T("object",!1,{main:new T("string",!1)});
}, function(modId) { var map = {"./validate":1679975017875}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017877, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getUploadProjectConfig=exports.compileWXMLFiles=exports.compileWXSSFiles=exports.compileJSFiles=exports.compileOther=exports.isNotIgnoredByProjectConfig=exports.getBabelRoot=void 0;const tslib_1=require("tslib"),babel_helper_1=require("../../utils/babel_helper"),js_1=require("./handler/js"),wxss_1=require("./handler/wxss"),wxml_1=require("./handler/wxml"),tools_1=require("../../utils/tools"),taskstatus_1=require("../../utils/taskstatus"),index_1=require("../worker_thread/index"),path_1=(0,tslib_1.__importDefault)(require("path")),projectconfig_1=require("../json/projectconfig"),game_1=(0,tslib_1.__importDefault)(require("../json/game")),signaturejson_1=require("../json/signaturejson"),config_1=require("../../config");async function getBabelRoot(o){var e,t;const i=await(0,projectconfig_1.getProjectConfigJSON)(o);let s=null===(t=null===(e=null==i?void 0:i.setting)||void 0===e?void 0:e.babelSetting)||void 0===t?void 0:t.outputPath;return s?(s=(0,tools_1.normalizePath)(s),s.replace(/(^[./\\])|(\/$)/g,""),s):"@babel/runtime"}function isNotIgnoredByProjectConfig(o,e,t){var i,s;const n=path_1.default.posix.relative(e,t),a=(null===(i=o.packOptions)||void 0===i?void 0:i.include)||[];if((0,tools_1.isFileIncluded)(n,a))return!0;const l=(null===(s=o.packOptions)||void 0===s?void 0:s.ignore)||[];return!(0,tools_1.isFileIgnored)(path_1.default.posix.relative(e,t),l)}async function copyFile(o,e){return{filePath:e,code:await o.getFile("",e)}}async function compileOther(o,e,t){const{onProgressUpdate:i=(()=>{})}=t,s=new taskstatus_1.TaskStatus("compiling other files");i(s);const n=[];for(const t of e)n.push(copyFile(o,t));const a=await Promise.all(n),l={};for(const o of a){const{code:e,filePath:t}=o;e&&(l[t]=e)}return s.done(),i(s),l}async function canWeCompileJS(o,e,t){let i;for(const o of e)if((0,tools_1.normalizePath)(t).startsWith((0,tools_1.normalizePath)((0,signaturejson_1.trailing)(o.fullPath,"/")))){i=o;break}if(i){return i.signature.findIndex(o=>(0,tools_1.normalizePath)(o.fullPath)===(0,tools_1.normalizePath)(t))>=0}return!0}async function compileJSFiles(o,e,t,i){const{setting:s={}}=i;let n="@babel/runtime";s.es7&&(n=await getBabelRoot(o));const a=[];if(o.type===config_1.COMPILE_TYPE.miniGame||o.type===config_1.COMPILE_TYPE.miniGamePlugin){const s=await(0,signaturejson_1.getAllPluginSignatures)(o);for(const l of e){const e=path_1.default.join(o.projectPath,t,l);await canWeCompileJS(o,s,e)&&a.push((0,js_1.compileJS)(o,l,Object.assign(Object.assign({},i),{babelRoot:n,root:t})))}}else for(const s of e)a.push((0,js_1.compileJS)(o,s,Object.assign(Object.assign({},i),{babelRoot:n,root:t})));let l=[];try{l=await Promise.all(a)}catch(o){throw(0,index_1.abortTask)(index_1.TASK_NAME.COMPILE_JS),o}const r={},c=new Set;for(const o of l){const{filePath:e,map:i,code:s,helpers:n}=o,a=(0,tools_1.formatSourceMap)(i);void 0!==s&&(r[path_1.default.posix.normalize(path_1.default.posix.join(t,e))]=s),a&&(r[path_1.default.posix.normalize(path_1.default.posix.join(t,e+".map"))]=a),n.length>0&&n.forEach(o=>{c.add(o)})}return await(0,babel_helper_1.appendBabelHelpers)(c,path_1.default.join(t),n,r),r}async function compileWXSSFiles(o,e,t,i){const s=[];for(const n of e)s.push((0,wxss_1.compileWXSS)(o,n,Object.assign(Object.assign({},i),{root:t})));let n=[];try{n=await Promise.all(s)}catch(o){throw(0,index_1.abortTask)(index_1.TASK_NAME.COMPILE_WXSS),o}const a={};for(const o of n){const{filePath:e,code:i}=o;void 0!==i&&(a[path_1.default.posix.normalize(path_1.default.posix.join(t,e))]=i)}return a}async function compileWXMLFiles(o,e,t,i){const s=[];for(const n of e)s.push((0,wxml_1.compileWXML)(o,n,Object.assign(Object.assign({},i),{root:t})));let n=[];try{n=await Promise.all(s)}catch(o){throw(0,index_1.abortTask)(index_1.TASK_NAME.MINIFY_WXML),o}const a={};for(const o of n){const{filePath:e,code:i}=o;void 0!==i&&(a[path_1.default.posix.normalize(path_1.default.posix.join(t,e))]=i)}return a}async function getUploadProjectConfig(o,e){const t={miniprogramRoot:e.miniprogramRoot,localPlugins:[]};e.pluginRoot&&(t.pluginRoot=e.pluginRoot);const i=await(0,game_1.default)(o),s=(o,e="")=>{const i=t.localPlugins||[];for(const t in o)if(o.hasOwnProperty(t)&&o[t]&&"string"==typeof o[t].path){const s=o[t],n=path_1.default.posix.normalize(path_1.default.posix.join(e,s.path.replace(/\\/g,"/")).replace(/^\/+/,""));i.push({alias:t,provider:s.provider,path:n})}t.localPlugins=i};if(i.plugins){s(i.plugins)}const n=i.subpackages||i.subPackages;if(Array.isArray(n))for(const o of n)(null==o?void 0:o.plugins)&&s(o.plugins,o.root||"");return t}exports.getBabelRoot=getBabelRoot,exports.isNotIgnoredByProjectConfig=isNotIgnoredByProjectConfig,exports.compileOther=compileOther,exports.compileJSFiles=compileJSFiles,exports.compileWXSSFiles=compileWXSSFiles,exports.compileWXMLFiles=compileWXMLFiles,exports.getUploadProjectConfig=getUploadProjectConfig;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/babel_helper":1679975017878,"./handler/js":1679975017879,"./handler/wxss":1679975017921,"./handler/wxml":1679975017922,"../../utils/tools":1679975017847,"../../utils/taskstatus":1679975017880,"../worker_thread/index":1679975017881,"../json/projectconfig":1679975017851,"../json/game":1679975017873,"../json/signaturejson":1679975017923,"../../config":1679975017839}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017878, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.appendBabelHelpers=exports.getBabelOutputPath=exports.isValidBabelHelperFunc=exports.collectBabelHelpers=exports.replaceBabelHelpers=exports.searchBabelModule=exports.isIgnore=exports.getHelperContent=exports.getHelperDeps=exports.getCustomPlugins=exports.getDefaultPlugins=void 0;const tslib_1=require("tslib"),fs=(0,tslib_1.__importStar)(require("fs-extra")),path=(0,tslib_1.__importStar)(require("path")),tools_1=require("./tools"),DepMap={applyDecoratedDescriptor:[],arrayLikeToArray:[],arrayWithHoles:[],arrayWithoutHoles:["arrayLikeToArray"],assertThisInitialized:[],AsyncGenerator:["AwaitValue"],asyncGeneratorDelegate:[],asyncIterator:[],asyncToGenerator:[],awaitAsyncGenerator:["AwaitValue"],AwaitValue:[],classCallCheck:[],classNameTDZError:[],classPrivateFieldDestructureSet:[],classPrivateFieldGet:[],classPrivateFieldLooseBase:[],classPrivateFieldLooseKey:[],classPrivateFieldSet:[],classPrivateMethodGet:[],classPrivateMethodSet:[],classStaticPrivateFieldSpecGet:[],classStaticPrivateFieldSpecSet:[],classStaticPrivateMethodGet:[],classStaticPrivateMethodSet:[],construct:["setPrototypeOf","isNativeReflectConstruct"],createClass:[],createForOfIteratorHelper:["unsupportedIterableToArray"],createForOfIteratorHelperLoose:["unsupportedIterableToArray"],createSuper:["getPrototypeOf","isNativeReflectConstruct","possibleConstructorReturn"],decorate:["toArray","toPropertyKey"],defaults:[],defineEnumerableProperties:[],defineProperty:[],extends:[],get:["superPropBase"],getPrototypeOf:[],inherits:["setPrototypeOf"],inheritsLoose:[],initializerDefineProperty:[],initializerWarningHelper:[],instanceof:[],interopRequireDefault:[],interopRequireWildcard:["typeof"],isNativeFunction:[],isNativeReflectConstruct:[],iterableToArray:[],iterableToArrayLimit:[],iterableToArrayLimitLoose:[],jsx:[],maybeArrayLike:["arrayLikeToArray"],newArrowCheck:[],nonIterableRest:[],nonIterableSpread:[],objectDestructuringEmpty:[],objectSpread:["defineProperty"],objectSpread2:["defineProperty"],objectWithoutProperties:["objectWithoutPropertiesLoose"],objectWithoutPropertiesLoose:[],possibleConstructorReturn:["typeof","assertThisInitialized"],readOnlyError:[],set:["superPropBase","defineProperty"],setPrototypeOf:[],skipFirstGeneratorNext:[],slicedToArray:["arrayWithHoles","iterableToArrayLimit","unsupportedIterableToArray","nonIterableRest"],slicedToArrayLoose:["arrayWithHoles","iterableToArrayLimitLoose","unsupportedIterableToArray","nonIterableRest"],superPropBase:["getPrototypeOf"],taggedTemplateLiteral:[],taggedTemplateLiteralLoose:[],tdz:[],temporalRef:["temporalUndefined","tdz"],temporalUndefined:[],toArray:["arrayWithHoles","iterableToArray","unsupportedIterableToArray","nonIterableRest"],toConsumableArray:["arrayWithoutHoles","iterableToArray","unsupportedIterableToArray","nonIterableSpread"],toPrimitive:["typeof"],toPropertyKey:["typeof","toPrimitive"],typeof:[],unsupportedIterableToArray:["arrayLikeToArray"],wrapAsyncGenerator:["AsyncGenerator"],wrapNativeSuper:["getPrototypeOf","setPrototypeOf","isNativeFunction","construct"],wrapRegExp:["typeof","wrapNativeSuper","getPrototypeOf","possibleConstructorReturn","inherits"],regenerator:[],Objectentries:[],Objectvalues:[],Arrayincludes:[]};function getDefaultPlugins(){const e=require("@babel/plugin-proposal-class-properties").default,r=require("@babel/plugin-proposal-decorators").default,t=require("@babel/plugin-proposal-function-sent").default,o=require("@babel/plugin-proposal-throw-expressions").default,a=require("@babel/plugin-proposal-export-default-from").default,s=require("@babel/plugin-proposal-pipeline-operator").default,l=require("@babel/plugin-proposal-do-expressions").default,i=require("@babel/plugin-proposal-function-bind").default,p=require("@babel/plugin-proposal-private-methods").default;return new Map([[i,0],[a,0],[s,{proposal:"minimal"}],[l,0],[r,{legacy:!0}],[t,0],[o,0],[e,{loose:!0}],[p,{loose:!0}]])}function getCustomPlugins(e=[]){const r=getDefaultPlugins(),t=[];for(const[e,o]of r)0===o?t.push(e):t.push([e,o]);return t}function getHelperDeps(e,r){const t={};for(;e.length;){const o=e.shift()||"",a=o.substr(0,o.indexOf(r)+r.length),s=o.replace(a+"/helpers/","");s in DepMap&&DepMap[s].forEach(r=>{const o=`${a}/helpers/${r}`;t[o]||(e.push(o),t[o]=!0)}),t[o]=!0}return t}function getHelperContent(e,r){const t=e.substr(0,e.indexOf(r)+r.length),o=e.replace(t,"babel_runtime"),a=(0,tools_1.normalizePath)(path.join(__dirname,"../vendor/",o+".js"));return fs.readFile(a,"utf8")}function isIgnore(e,r){const t=e||[],o=r.split(path.sep).join("/");for(const e of t){if(r===e)return!0;if(!/^[./\\]+/.test(e)&&/.+\/\*$/.test(e)&&-1!==o.indexOf(e.substr(0,e.length-1)))return!0}return!1}function searchBabelModule(e,r){const t=[],o=new RegExp(`require\\("[\\.\\/]*(${r}[^"]+)"\\)`,"gi");return e.replace(o,(e,o)=>{const a=o.replace(r,"").match(/\/(helpers|regenerator)\/?(.+)?/);return(a&&"regenerator"===a[1]||a&&"helpers"===a[1]&&DepMap.hasOwnProperty(a[2]))&&t.push(o),e}),t}function replaceBabelHelpers(e,r={},t,o){const a=new Set,s=t.split("/").map((e,r)=>0===r?"":"../").join("");return{transformCode:e.replace(/require\("(@babel\/runtime\/[^"]+)"\)/gi,(e,t)=>{const l=t.replace(/@babel\/runtime\/(helpers\/)?/,"").replace(/\.js$/,""),i=t.replace("@babel/runtime",o),p=DepMap.hasOwnProperty(l);return!r[t]&&p?(a.add(i),`require("${s+i}")`):e}),helpers:Array.from(a)}}function collectBabelHelpers(e){const r={};return e.replace(/require\("(@babel\/runtime\/[^"]+)"\)/gi,(e,t)=>(r[t]=!0,e)),r}function isValidBabelHelperFunc(e){return DepMap.hasOwnProperty(e)}function getBabelOutputPath(e){var r;let t=(null===(r=e.setting)||void 0===r?void 0:r.babelSetting)?e.setting.babelSetting.outputPath:"";return t?(t=(0,tools_1.normalizePath)(t),t.replace(/(^[./\\])|(\/$)/g,""),t):"@babel/runtime"}async function appendBabelHelpers(e,r,t,o){const a=getHelperDeps(Array.from(e),t),s=Object.keys(a).map(async e=>{try{const a=await getHelperContent(e,t),s=(0,tools_1.normalizePath)(path.posix.join(r,/\.js$/.test(e)?""+e:e+".js"));o[s]||(o[s]=a)}catch(e){if("EEXIST"===e.code);else if("ENOENT"!==e.code)throw e}});return Promise.all(s)}exports.getDefaultPlugins=getDefaultPlugins,exports.getCustomPlugins=getCustomPlugins,exports.getHelperDeps=getHelperDeps,exports.getHelperContent=getHelperContent,exports.isIgnore=isIgnore,exports.searchBabelModule=searchBabelModule,exports.replaceBabelHelpers=replaceBabelHelpers,exports.collectBabelHelpers=collectBabelHelpers,exports.isValidBabelHelperFunc=isValidBabelHelperFunc,exports.getBabelOutputPath=getBabelOutputPath,exports.appendBabelHelpers=appendBabelHelpers;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017879, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compileJS=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),taskstatus_1=require("../../../utils/taskstatus"),worker_thread_1=require("../../worker_thread"),common_1=require("../../../utils/common"),config_1=require("../../../config"),tools_1=require("../../../utils/tools"),app_1=require("../../json/app"),common_2=require("../../json/common"),projectconfig_1=require("../../json/projectconfig"),game_1=(0,tslib_1.__importDefault)(require("../../json/game")),core_1=require("../../../core");async function formatBabelRoot(e,t,o,r){const a=e.type;if(a===config_1.COMPILE_TYPE.miniProgram){const t=await(0,app_1.getAppJSON)(e),a=(0,common_2.checkPagePathIsInIndependentSubpackage)(t,o);a&&(r=`${a.root}/${r}`),"object"==typeof t.functionalPages&&!0===t.functionalPages.independent&&o.startsWith("functional-pages/")&&(r="functional-pages/"+r),"string"==typeof t.openDataContext&&o.startsWith(t.openDataContext)&&(r=`${t.openDataContext}/${r}`),t.workers&&o.startsWith((0,tools_1.getWorkersPath)(t.workers))&&(r=`${(0,tools_1.getWorkersPath)(t.workers)}/${r}`)}else if(a===config_1.COMPILE_TYPE.miniGame){const t=await(0,game_1.default)(e),a=(0,common_2.checkFilePathIsInIndependentSubpackage)(t,o);a&&(r=`${a}/${r}`),"string"==typeof t.openDataContext&&o.startsWith(t.openDataContext)&&(r=`${t.openDataContext}/${r}`),t.workers&&o.startsWith((0,tools_1.getWorkersPath)(t.workers))&&(r=`${(0,tools_1.getWorkersPath)(t.workers)}/${r}`)}else if(a===config_1.COMPILE_TYPE.miniProgramPlugin||a===config_1.COMPILE_TYPE.miniGamePlugin){const t=await(0,core_1.getPluginJSON)(e);"string"==typeof t.workers&&o.startsWith(t.workers)&&(r=`${t.workers}/${r}`)}return(0,tools_1.normalizePath)(""+r)}async function compileJS(e,t,o){var r,a;const{setting:s={},onProgressUpdate:i=(()=>{}),root:n="",devToolsCompileCache:c}=o,l=path_1.default.posix.join(n,t);let _=[],p=o.babelRoot||"@babel/runtime";if(s.es7){const o=await(0,projectconfig_1.getProjectConfigJSON)(e);_=(null===(a=null===(r=o.setting)||void 0===r?void 0:r.babelSetting)||void 0===a?void 0:a.ignore)||[],p=await formatBabelRoot(e,n,t,p)}const u=new taskstatus_1.TaskStatus(t),g=o.sourceCode?o.sourceCode:await e.getFile(n,t);async function m(){const o=await(0,worker_thread_1.runTask)(worker_thread_1.TASK_NAME.COMPILE_JS,{projectPath:e.projectPath,root:n,filePath:t,setting:s,code:g,babelRoot:p,babelIgnore:_},e=>{e===worker_thread_1.ETaskStatus.progress?i(u):e===worker_thread_1.ETaskStatus.done&&(u.done(),i(u))});return o.error&&(0,common_1.throwError)({msg:o.error.message,code:o.error.code,filePath:l}),o}let f={};if(c){const o=(0,tools_1.normalizePath)(path_1.default.posix.join(e.projectPath,n,t)),r=`${o}_${JSON.stringify(s)}`;f=await c.getFile(o,r),f&&!s.codeProtect||(f=await m(),c.setFile(o,f,r))}else f=await m();return Object.assign({filePath:t},f)}exports.compileJS=compileJS;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/taskstatus":1679975017880,"../../worker_thread":1679975017881,"../../../utils/common":1679975017852,"../../../config":1679975017839,"../../../utils/tools":1679975017847,"../../json/app":1679975017914,"../../json/common":1679975017853,"../../json/projectconfig":1679975017851,"../../json/game":1679975017873,"../../../core":1679975017916}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017880, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.TaskStatus=void 0;const tslib_1=require("tslib"),locales_1=(0,tslib_1.__importDefault)(require("./locales/locales"));class TaskStatus{constructor(t){this._status="doing",this._msg="",this._id=`${Math.random()}${Date.now()}`,this._msg=t}get id(){return this._id}get status(){return this._status}get message(){return this._msg}done(){this._status="done"}toString(){return"doing"===this._status?locales_1.default.config.PROCESSING.format(this._msg):"done"===this._status?locales_1.default.config.DONE.format(this._msg):this._msg}}exports.TaskStatus=TaskStatus;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017881, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.abortTask=exports.runTask=void 0;const tslib_1=require("tslib"),worker_manager_1=require("./worker_manager"),childprocess_manager_1=require("./childprocess_manager"),index_1=(0,tslib_1.__importDefault)(require("./task/index")),logger_1=require("../utils/logger");(0,tslib_1.__exportStar)(require("./config"),exports);const isDevtools=void 0!==process.env.__nwjs;async function runTask(r,e,a=(()=>{})){if(logger_1.logger.info("runTask",r,e.filePath),global.__MINIPROGRAM_CI_TEST__)return(0,index_1.default)(r,e);try{if(process.__nwjs&&"wechatwebdevtools"===nw.App.manifest.appname)return await childprocess_manager_1.childProcessManager.runTask(r,e,a);const o=(0,worker_manager_1.getWorkerManager)(isDevtools);return await o.runTask(r,e,a)}catch(a){if(a===worker_manager_1.AbortEvent)throw a;if(logger_1.logger.error(`runTask ${r}, ${e.filePath} catch error ${a}`),a instanceof childprocess_manager_1.ChildProcessCrashedError)throw new Error(`runTask ${r}, ${e.filePath} catch error ${a}`);return(0,index_1.default)(r,e)}}function abortTask(r){(0,worker_manager_1.getWorkerManager)(isDevtools).abort(r)}exports.runTask=runTask,exports.abortTask=abortTask;
}, function(modId) { var map = {"./worker_manager":1679975017882,"./childprocess_manager":1679975017888,"./task/index":1679975017889,"../utils/logger":1679975017886,"./config":1679975017883}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017882, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWorkerManager=exports.AbortEvent=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),os_1=(0,tslib_1.__importDefault)(require("os")),events_1=(0,tslib_1.__importDefault)(require("events")),log_1=(0,tslib_1.__importDefault)(require("../../utils/log")),config_1=require("./config"),call_func_1=require("./task/call_func"),child_process_1=require("child_process"),logger_1=require("../utils/logger"),env_1=require("../utils/env"),cpus=os_1.default.cpus().length,WORKER_PATH=path_1.default.posix.join(__dirname,"./worker.js"),FORK_PATH=path_1.default.posix.join(__dirname,"./fork.js"),MAX_TASK_TRY_TIME=2;let envIsDevtools=!1;function getCurrentScriptPath(){const e=path_1.default.posix.relative(process.cwd(),__filename);return process.cwd()===__dirname?`.${path_1.default.posix.resolve}${e}`:e}let Worker,workerManagerInstance,supportWorkerThread=!1;try{Worker=require("worker_threads").Worker,supportWorkerThread=!0}catch(e){supportWorkerThread=!1}exports.AbortEvent="WorkerTaskAborted";class WorkerInstance extends events_1.default{constructor(){super(),this.status=config_1.EWorkerStatus.free,this.threadId=-1,this._suicideTime=config_1.SUICIDE_TIME["miniprogram-ci"],this._postMessage=()=>{},envIsDevtools&&(this._suicideTime=config_1.SUICIDE_TIME.devtools);const e={NODE_PATH:path_1.default.posix.join(getCurrentScriptPath(),"../../../node_modules"),isDevtools:String(envIsDevtools)};supportWorkerThread?(logger_1.logger.info("create worker start"),this._instance=new Worker(WORKER_PATH,{env:Object.assign(Object.assign({},e),{cpprocessEnv:"workerthread"}),stdout:!0}),this.threadId=this._instance.threadId,this._postMessage=this._instance.postMessage.bind(this._instance)):(this._instance=(0,child_process_1.fork)(FORK_PATH,[""],{env:Object.assign(Object.assign({},e),{cpprocessEnv:"workerprocess"})}),this.threadId=this._instance.pid,this._postMessage=this._instance.send.bind(this._instance));this._instance.on("message",e=>{const{command:t,data:s}=e;t===config_1.COMMAND.TASK_DONE&&this.onTaskDone(s),t===config_1.COMMAND.SEND_LOG&&logger_1.logger.send(s.level,s.args),t===config_1.COMMAND.CALL_FUNC&&call_func_1.call.apply(null,[s.funcName,...s.args]).then(e=>{this._postMessage({command:config_1.COMMAND.CALL_FUNC_RESULT,data:{id:s.id,result:e}})}).catch(e=>{this._postMessage({command:config_1.COMMAND.CALL_FUNC_RESULT,data:{id:s.id,error:e.toString()}})})}),this._instance.on("exit",e=>{0!==e&&1!==e&&log_1.default.error(`worker thread: ${this.threadId}, status: ${this.status}, exit with code: ${e}`),this.emit("exit",{code:e,status:this.status,task:this._task,threadId:this.threadId})})}on(e,t){return super.on(e,t)}onTaskDone(e){var t;this.status=config_1.EWorkerStatus.free,(null===(t=this._task)||void 0===t?void 0:t.resolve)&&(this._task.onStatusUpdate(config_1.ETaskStatus.done),this._task.resolve(e)),this._task=void 0,this.emit("taskDone",this.threadId),env_1.summerProcess||this.setUpSuicideTimer()}setUpSuicideTimer(){this._suicideTimer=setTimeout(()=>{clearTimeout(this._suicideTimer),this.status===config_1.EWorkerStatus.free?(this.status=config_1.EWorkerStatus.dying,supportWorkerThread?this._instance.terminate():this._instance.kill("SIGTERM")):this._suicideTimer||this.setUpSuicideTimer()},this._suicideTime)}runTask(e){clearTimeout(this._suicideTimer),this.status=config_1.EWorkerStatus.busy,this._task=e,this._task.onStatusUpdate(config_1.ETaskStatus.progress),this._postMessage({command:config_1.COMMAND.RUN_TASK,data:{taskName:e.name,data:e.data}})}}class WorkerManager{constructor(e,t=!1){this._taskQueue=[],this._workerPool={},this._max_pool_size=4,this.onWorkerExit=e=>{const{code:t,status:s,task:r,threadId:i}=e;delete this._workerPool[i],s===config_1.EWorkerStatus.busy&&(r.retryTimes+=1,r.retryTimes<=2?(log_1.default.error(`worker thread: ${i} exit with code: ${t} when it is busy, retry ${r.retryTimes} times`),this._taskQueue.push(r)):r.reject(`worker thread exit with code: ${t} when it is busy`)),this._run()},this._actualWorkerPoolSize=1,this._doneThreadSet=new Set,this.onTaskDone=e=>{this._doneThreadSet.add(e),this._actualWorkerPoolSize=Math.min(howManyWorker(this._doneThreadSet.size),this._max_pool_size),this._run()},this._max_pool_size=e>8?8:e,envIsDevtools=t}runTask(e,t,s=(()=>{})){return new Promise((r,i)=>{const o={name:e,data:t,resolve:r,reject:i,retryTimes:0,onStatusUpdate:s};s(config_1.ETaskStatus.waiting),this._taskQueue.push(o),this._run()})}abort(e){const t=[],s=[];this._taskQueue.forEach(r=>{r.name!==e?s.push(r):t.push(r)}),t.forEach(e=>{e.reject(exports.AbortEvent)}),this._taskQueue=s}_run(){let e=this._taskQueue[0];for(;e;){const t=this.allocWorker();if(!t)return;this._taskQueue.shift(),t.runTask(e),e=this._taskQueue[0]}}allocWorker(){for(const e in this._workerPool){const t=this._workerPool[e];if(t.status===config_1.EWorkerStatus.free)return t}if(this.workerCount()<this._max_pool_size){const e=new WorkerInstance;return e.on("taskDone",this.onTaskDone),e.on("exit",this.onWorkerExit),this._workerPool[e.threadId]=e,e}return null}workerCount(){return Object.keys(this._workerPool).length}}function howManyWorker(e){switch(e){case 1:return 4;case 2:return 6;default:return 8}}const getWorkerManager=function(e=!1){if(!workerManagerInstance){let t=parseInt(process.env.COMPILE_THREADS||"0",10);(t<=0||t>cpus)&&(t=cpus),workerManagerInstance=new WorkerManager(t,e)}return workerManagerInstance};exports.getWorkerManager=getWorkerManager;
}, function(modId) { var map = {"../../utils/log":1679975017836,"./config":1679975017883,"./task/call_func":1679975017884,"../utils/logger":1679975017886,"../utils/env":1679975017887}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017883, function(require, module, exports) {
var ETaskStatus,EWorkerStatus,EChildProcessStatus;Object.defineProperty(exports,"__esModule",{value:!0}),exports.SUICIDE_TIME=exports.EChildProcessStatus=exports.EWorkerStatus=exports.COMMAND=exports.TASK_NAME=exports.ETaskStatus=void 0,function(s){s[s.waiting=0]="waiting",s[s.progress=1]="progress",s[s.done=2]="done"}(ETaskStatus=exports.ETaskStatus||(exports.ETaskStatus={})),exports.TASK_NAME={COMPILE_JS:"COMPILE_JS",COMPILE_WXSS:"COMPILE_WXSS",MINIFY_WXML:"MINIFY_WXML",SUMMER_HOOK:"SUMMER_HOOK"},exports.COMMAND={RUN_TASK:"RUN_TASK",TASK_DONE:"TASK_DONE",CALL_FUNC:"CALL_FUNC",CALL_FUNC_RESULT:"CALL_FUNC_RESULT",CHILD_PROCESS_READY:"CHILD_PROCESS_READY",SEND_LOG:"SEND_LOG"},function(s){s[s.free=0]="free",s[s.busy=1]="busy",s[s.dying=2]="dying"}(EWorkerStatus=exports.EWorkerStatus||(exports.EWorkerStatus={})),function(s){s[s.free=0]="free",s[s.busy=1]="busy",s[s.fullload=2]="fullload",s[s.dying=3]="dying"}(EChildProcessStatus=exports.EChildProcessStatus||(exports.EChildProcessStatus={})),exports.SUICIDE_TIME={devtools:864e5,"miniprogram-ci":1e4};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017884, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.call=void 0;const tslib_1=require("tslib"),config_1=require("../config"),FUNC=(0,tslib_1.__importStar)(require("./func"));let workerThreads,supportWorkerThread=!1;try{workerThreads=require("worker_threads"),supportWorkerThread=!0}catch(r){supportWorkerThread=!1}const callMainThread=function(){if(!supportWorkerThread||workerThreads.isMainThread)return(r,e)=>{};let r=0;const e={};return workerThreads.parentPort.on("message",r=>{const{command:o,data:t}=r;if(o!==config_1.COMMAND.CALL_FUNC_RESULT)return;const{id:a,result:s,error:n}=t,i=e[a];return delete e[a],i?n?i.reject(n):void i.resolve(s):void 0}),(o,t)=>new Promise((a,s)=>{const n=r++;e[n]={resolve:a,reject:s},workerThreads.parentPort.postMessage({command:config_1.COMMAND.CALL_FUNC,data:{id:n,funcName:o,args:t}})})}();function call(r,...e){return!supportWorkerThread||workerThreads.isMainThread?FUNC[r].apply(null,e):callMainThread(r,e)}exports.call=call;
}, function(modId) { var map = {"../config":1679975017883,"./func":1679975017885}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017885, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.readFileAsync=void 0;const tslib_1=require("tslib"),fs_1=(0,tslib_1.__importDefault)(require("fs"));function readFileAsync(e,r){return new Promise((s,i)=>{fs_1.default.readFile(e,r,(e,r)=>{if(e)return i(e);s(r)})})}exports.readFileAsync=readFileAsync;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017886, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.logger=void 0;const worker_thread_1=require("../worker_thread"),env_1=require("./env");function pad(e,t=2){return e>10**t?String(e):`${new Array(t).join("0")}${e}`.slice(-t)}const LevelMap={trace:1,info:2,log:3,warn:4,error:5};class Logger{constructor(e){this.output=e,this.enableLevel=LevelMap.log,this.ready=!1,this.logs=[]}setOutput(e){this.output=e}setEnableLevel(e){this.enableLevel=e}setReady(){if(this.ready=!0,this.logs.length>0)for(const e of this.logs)this.output(e.level,e.args)}send(e,t){this.ready?this.output(e,t):this.logs.push({level:e,args:t})}getPrintTime(){const e=new Date;return`${String(e.getFullYear())}-${pad(e.getMonth()+1)}-${pad(e.getDate())} ${pad(e.getHours())}:${pad(e.getMinutes())}:${pad(e.getSeconds())}.${pad(e.getMilliseconds(),3)}`}_receive(e,t,r){const s=LevelMap[e];this.enableLevel>s||(r=[t=`[compiler][${env_1.processEnv}][${this.getPrintTime()}] ${t}`,...r],this.send(e,r))}info(e,...t){this._receive("info",e,t)}log(e,...t){this._receive("log",e,t)}error(e,...t){this._receive("error",e,t)}}if(exports.logger=new Logger((e,t)=>{console[e](...t)}),exports.logger.setReady(),"ci"===env_1.hostEnv&&("compiler"===process.env.debug?exports.logger.setEnableLevel(LevelMap.info):exports.logger.setEnableLevel(LevelMap.warn)),"childprocess"===env_1.processEnv&&exports.logger.setOutput((e,t)=>{process.send({command:worker_thread_1.COMMAND.SEND_LOG,data:{level:e,args:t}})}),"workerthread"===env_1.processEnv){const e=require("worker_threads").parentPort;e&&exports.logger.setOutput((t,r)=>{e.postMessage({command:worker_thread_1.COMMAND.SEND_LOG,data:{level:t,args:r}})})}
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../worker_thread":1679975017881,"./env":1679975017887}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017887, function(require, module, exports) {
!function(require, directRequire){
function getProcessEnv(){const s=process.env.cpprocessEnv;return"childprocess"===s||"workerthread"===s||"workerprocess"===s?s:"main"}function getHostEnv(){var s;return(null===(s=process.env)||void 0===s?void 0:s.isDevtools)||process.__nwjs&&"wechatwebdevtools"===nw.App.manifest.appname?"devtools":"ci"}Object.defineProperty(exports,"__esModule",{value:!0}),exports.summerProcess=exports.hostEnv=exports.processEnv=void 0,exports.processEnv=getProcessEnv(),exports.hostEnv=getHostEnv(),exports.summerProcess="1"===process.env.summerProcess;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017888, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.childProcessManager=exports.ChildProcessCrashedError=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),child_process_1=require("child_process"),config_1=require("./config"),events_1=(0,tslib_1.__importDefault)(require("events")),log_1=(0,tslib_1.__importDefault)(require("../../utils/log")),os=(0,tslib_1.__importStar)(require("os")),logger_1=require("../utils/logger"),cpus=os.cpus().length,FORK_PATH=path_1.default.posix.join(__dirname,"./childprocess.js"),MAX_TASK_TRY_TIME=2;class ChildProcessCrashedError extends Error{constructor(s,e){super(e),this.type=s}}exports.ChildProcessCrashedError=ChildProcessCrashedError;class ChildProcessInstance extends events_1.default{constructor(s){super(),this.status=config_1.EChildProcessStatus.free,this._lastActiveTime=0,this._taskMap={},this._fullload_task_count=4,this._suicideTime=config_1.SUICIDE_TIME["miniprogram-ci"],this._fullload_task_count=s;const e={stdio:["pipe","pipe","pipe","ipc"],env:Object.assign(Object.assign({},process.env),{cpprocessEnv:"childprocess"})};if(e.env.isDevtools=process.__nwjs&&"wechatwebdevtools"===nw.App.manifest.appname,e.env.isDevtools){this._suicideTime=config_1.SUICIDE_TIME.devtools;let s=path_1.default.join(path_1.default.dirname(process.execPath),"node");"darwin"!==process.platform&&(s+=".exe"),e.execPath=s}logger_1.logger.info("fork childprocess start");const t=(0,child_process_1.fork)(FORK_PATH,["--expose-gc"],e);t.stdout.setEncoding("utf8"),logger_1.logger.info("fork childprocess end"),t.stdout.on("data",s=>{log_1.default.log("child process stdout: "+s)}),t.stderr.on("data",s=>{log_1.default.error("child process stderr: "+s),this.checkIfProcessCrashed(s.toString())}),t.on("message",this.onChildProcessMessage.bind(this,t)),t.on("exit",s=>{this.emit("exit",{code:s,crashedReason:this.crashedReason,status:this.status,tasks:Object.values(this._taskMap),pid:t.pid})}),t.unref(),this._instance=t}checkIfProcessCrashed(s){s.includes("ERR_WORKER_OUT_OF_MEMORY")&&(this.crashedReason=new ChildProcessCrashedError("ERR_WORKER_OUT_OF_MEMORY",s))}onChildProcessMessage(s,e){if("object"!=typeof e)return void logger_1.logger.error("unrecognized message from child process",e);const{command:t,data:i}=e;t!==config_1.COMMAND.SEND_LOG?(logger_1.logger.info("onChildProcessMessage "+t,i),t===config_1.COMMAND.TASK_DONE?this.onTaskDone(i):t===config_1.COMMAND.SEND_LOG&&logger_1.logger.send(i.level,i.args)):logger_1.logger.send(i.level,i.args)}onTaskDone(s){const{taskId:e,result:t}=s,i=this._taskMap[e];delete this._taskMap[e],i?(i.resolve&&(i.onStatusUpdate(config_1.ETaskStatus.done),i.resolve(t)),0===Object.keys(this._taskMap).length&&(this.status=config_1.EChildProcessStatus.free,this.setUpSuicideTimer()),this.emit("taskDone")):log_1.default.error(`child process task: ${e} not found`)}setUpSuicideTimer(){this._suicideTimer=setTimeout(()=>{clearTimeout(this._suicideTimer),this.status===config_1.EChildProcessStatus.free?(this.status=config_1.EChildProcessStatus.dying,this._instance.kill("SIGTERM")):this._suicideTimer||this.setUpSuicideTimer()},this._suicideTime)}runTask(s){clearTimeout(this._suicideTimer),this.status=config_1.EChildProcessStatus.busy,this._lastActiveTime=Date.now();const e=getId();this._taskMap[e]=s,Object.keys(this._taskMap).length>=this._fullload_task_count?this.status=config_1.EChildProcessStatus.fullload:this.status=config_1.EChildProcessStatus.busy,s.onStatusUpdate(config_1.ETaskStatus.progress),this._instance.send({command:config_1.COMMAND.RUN_TASK,data:{taskId:e,taskName:s.name,data:s.data}})}}const getId=(()=>{let s=0;return()=>s++})();class TaskManager{constructor(){this._taskQueue=[],this.onChildProcessExit=s=>{const{code:e,crashedReason:t,status:i,tasks:o,pid:r}=s;if(this._instance=void 0,i===config_1.EChildProcessStatus.busy||i===config_1.EChildProcessStatus.fullload)for(const s of o)s.retryTimes+=1,s.retryTimes<=2?(log_1.default.error(`child process: ${r} exit with code: ${e} when it is busy, retry running ${s.retryTimes} times`),this._taskQueue.push(s)):t?s.reject(t):s.reject(`child process exit with code: ${e} when it is busy`);this._run()},this.onTaskDone=()=>{this._run()}}runTask(s,e,t=(()=>{})){return new Promise((i,o)=>{const r={name:s,data:e,resolve:i,reject:o,retryTimes:0,onStatusUpdate:t};t(config_1.ETaskStatus.waiting),this._taskQueue.push(r),this._run()})}_run(){if(0===this._taskQueue.length)return;const s=this.allocChildProcess();s.status!==config_1.EChildProcessStatus.fullload&&s.status!==config_1.EChildProcessStatus.dying&&(s.runTask(this._taskQueue.shift()),this._run())}allocChildProcess(){return this._instance||(this._instance=new ChildProcessInstance(2*cpus),this._instance.on("exit",this.onChildProcessExit),this._instance.on("taskDone",this.onTaskDone)),this._instance}}exports.childProcessManager=new TaskManager;
}, function(modId) { var map = {"./config":1679975017883,"../../utils/log":1679975017836,"../utils/logger":1679975017886}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017889, function(require, module, exports) {
const config_1=require("../config"),compileJS=()=>require("./compilejs"),compileWXSS=()=>require("./compilewxss"),minifyWXMLMod=()=>require("./minifywxml"),summerWorker=()=>require("../../../summer/worker");async function processTask(e,r){return e===config_1.TASK_NAME.COMPILE_JS?require("./compilejs")(r):e===config_1.TASK_NAME.COMPILE_WXSS?require("./compilewxss")(r):e===config_1.TASK_NAME.MINIFY_WXML?require("./minifywxml").minifyWXML(r):e===config_1.TASK_NAME.SUMMER_HOOK?require("../../../summer/worker").runSummerPluginHook(r):void 0}module.exports=processTask;
}, function(modId) { var map = {"../config":1679975017883,"./compilejs":1679975017890,"./compilewxss":1679975017898,"./minifywxml":1679975017899,"../../../summer/worker":1679975017900}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017890, function(require, module, exports) {
const tslib_1=require("tslib"),fs_1=(0,tslib_1.__importDefault)(require("fs")),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),tools_1=require("../../../utils/tools"),config_1=require("../../../config"),call_func_1=require("./call_func"),log_1=(0,tslib_1.__importDefault)(require("../../../utils/log")),babel_helper_1=require("../../../utils/babel_helper"),jsonParse_1=require("../../../utils/jsonParse"),sourcemap=()=>require("source-map"),enhanceCompile=()=>require("../../js/enhance"),es6Compile=()=>require("../../js/es6_transform"),minifyJS=()=>require("../../js/minifyjs"),minifyJSAfterWrap=()=>require("../../js/minifyjs_after_wrap"),generateMap=()=>require("../../js/generateMap"),MAX_CODE_LENGTH=512e3;async function tryGetInputSourceMap(e,r){try{const t=/\/\/[#|@] sourceMappingURL=[\s]*(\S*)[\s]*$/m.exec(e),s=path_1.default.posix.dirname(r),o=path_1.default.posix.basename(r);let i;if(null==t?void 0:t[1])if(/\.js\.map$/.test(t[1]))i=await(0,call_func_1.call)("readFileAsync",path_1.default.posix.join(s,t[1]),"utf-8");else{const e=t[1].split("base64,")[1];i=Buffer.from(e,"base64").toString()}else{const e=path_1.default.posix.join(s,o+".map");fs_1.default.existsSync(e)&&(i=await(0,call_func_1.call)("readFileAsync",e,"utf-8"))}if(i){const e=(0,jsonParse_1.jsonParse)(i);new(require("source-map").SourceMapConsumer)(e);return await insertSourcesContent(e,r),e}}catch(e){log_1.default.log(`try to get input sourcemap of ${r} catch error ${e}`)}}const insertSourcesContent=async(e,r)=>{if(Array.isArray(e.sources)&&!Array.isArray(e.sourcesContent)){const t=e.sourcesContent;try{const t=path_1.default.posix.dirname(r),s=[],o=e.sources;for(const e of o){const r=await(0,call_func_1.call)("readFileAsync",path_1.default.posix.join(t,e),"utf-8");s.push(r)}e.sourcesContent=s}catch(r){e.sourcesContent=t}}};async function compileJS(e){const{code:r,filePath:t,projectPath:s,setting:o,babelRoot:i="@babel/runtime",root:a="",babelIgnore:n=[]}=e,{es7:c,es6:l,disableUseStrict:u}=o,f="string"==typeof r?r:(0,tools_1.bufferToUtf8String)(Buffer.from(r)),p=path_1.default.posix.join(a,t),_=o.minify||o.minifyJS;if(void 0===f)return{error:{code:config_1.FILE_NOT_UTF8,path:p,message:locales_1.default.config.FILE_NOT_UTF8.format(p)}};const m=f.length>=512e3;let g=!1;c&&(g=(0,babel_helper_1.isIgnore)(n,t));const b=await tryGetInputSourceMap(f,path_1.default.posix.join(s,a,t));if(m||g)return{error:null,isLargeFile:m,isBabelIgnore:g,map:"object"==typeof b?JSON.stringify(b):b,code:f,helpers:[]};let h=f,d=b,j=[];if(c){const e=await require("../../js/enhance")({code:f,babelRoot:i,filePath:t,disableUseStrict:u,inputSourceMap:b});if(e.error)return{error:Object.assign(Object.assign({},e.error),{path:p})};h=e.code||"",d=e.map,j=e.helpers||[]}else if(l){const e=require("../../js/es6_transform")({code:f,filePath:t,inputSourceMap:b});if(e.error)return{error:Object.assign(Object.assign({},e.error),{path:p})};h=e.code||"",d=e.map}if(_){if(!l&&!c){const e=require("../../js/minifyjs_after_wrap")({filePath:t,code:h,inputSourceMap:d});if(e.error)return{error:Object.assign(Object.assign({},e.error),{path:p})};h=e.code,d=e.map}else{const e=require("../../js/minifyjs")({filePath:t,code:h,useTerser:!!c,inputSourceMap:d});if(e.error)return{error:Object.assign(Object.assign({},e.error),{path:p})};h=e.code,d=e.map}}if("string"!=typeof d)try{(null==d?void 0:d.sourcesContent)&&(d.sourcesContent=d.sourcesContent.map(e=>e.replace(/\r\n/g,"\n"))),d=JSON.stringify(d)}catch(e){d=""}else d=d.replace(/\\r\\n/g,"\\n");return{error:null,isLargeFile:m,isBabelIgnore:g,map:d,code:h.replace(/\r\n/g,"\n"),helpers:j||[]}}module.exports=compileJS;
}, function(modId) { var map = {"../../../utils/locales/locales":1679975017841,"../../../utils/tools":1679975017847,"../../../config":1679975017839,"./call_func":1679975017884,"../../../utils/log":1679975017836,"../../../utils/babel_helper":1679975017878,"../../../utils/jsonParse":1679975017846,"../../js/enhance":1679975017891,"../../js/es6_transform":1679975017894,"../../js/minifyjs":1679975017895,"../../js/minifyjs_after_wrap":1679975017896,"../../js/generateMap":1679975017897}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017891, function(require, module, exports) {
const config_1=require("../../config"),babel_helper_1=require("../../utils/babel_helper"),_transformRuntimeCustom=()=>require("../../utils/babel_transform_plugin"),_pluginTransformWorklet=()=>require("../../utils/babel_plugin_worklet"),babel7=()=>require("@babel/core"),_pluginTransformRuntime=()=>require("@babel/plugin-transform-runtime"),_pluginTransformModulesCommonjs=()=>require("@babel/plugin-transform-modules-commonjs"),_presetEnv=()=>require("@babel/preset-env");function getPluginsList(e){const r=[[require("../../utils/babel_transform_plugin")],[require("@babel/plugin-transform-runtime"),{corejs:!1,helpers:!0,regenerator:!e.hasRegenerator,version:"7.12.1"}]].concat((0,babel_helper_1.getCustomPlugins)([]));return r.push([require("@babel/plugin-transform-modules-commonjs"),{allowTopLevelThis:e.disableUseStrict,importInterop:e=>e.startsWith("@babel/runtime/helpers/")?"node":"babel"}]),e.supportWorklet&&r.push([require("../../utils/babel_plugin_worklet")]),r}const enhance=e=>{const{code:r,babelRoot:l,filePath:t,inputSourceMap:s}=e,o=r,n=/regeneratorRuntime\.mark/.test(r),i=e.disableUseStrict||/^\s*\/\/\s?use strict disable;/i.test(r),u=o.includes('"worklet"')||o.includes("'worklet'");let a=null;try{a=require("@babel/core").transform(r,{presets:[[require("@babel/preset-env"),{targets:{chrome:53,ios:8},include:["@babel/plugin-transform-computed-properties"]}]],babelrc:!1,plugins:getPluginsList({hasRegenerator:n,disableUseStrict:i,supportWorklet:u}),sourceFileName:t,inputSourceMap:s,sourceMaps:!0,configFile:!1})}catch(e){return{error:{message:`file: ${t}\n ${e.message}`,code:config_1.BABEL_TRANS_JS_ERR}}}let b=(null==a?void 0:a.code)||r;const p=(null==a?void 0:a.map)||s;i&&(b=b.replace(/^"use strict";/,""));const c=(0,babel_helper_1.collectBabelHelpers)(o),{transformCode:m,helpers:g}=(0,babel_helper_1.replaceBabelHelpers)(b,c,t,l);return b=m,{code:b,map:p,helpers:g||[]}};module.exports=enhance;
}, function(modId) { var map = {"../../config":1679975017839,"../../utils/babel_helper":1679975017878,"../../utils/babel_transform_plugin":1679975017892,"../../utils/babel_plugin_worklet":1679975017893}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017892, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const core_1=require("@babel/core"),{addSideEffect:addSideEffect,isModule:isModule}=require("@babel/helper-module-imports");function hasStaticMapping(e,t,r,o){try{if("Object"===e){if("entries"===t||"values"===t)return!0}else if("includes"===t){if("Identifier"===r||"ArrayExpression"===r)return!0;if("MemberExpression"===r&&"prototype"===o.property.name&&"Array"===o.object.name)return!0}return!1}catch(e){return!1}}exports.default={name:"transform-runtime-custom",pre(e){const t=new Map;this.addDefaultImport=(r,o,i)=>{const n=`${r}:${o}:${isModule(e.path)||""}`;let s=t.get(n);return s?s=core_1.types.cloneNode(s):(s=addSideEffect(e.path,r,{importedInterop:"uncompiled",nameHint:o,blockHoist:i}),t.set(n,s)),s}},visitor:{MemberExpression:{enter(e){const{node:t}=e,{object:r,property:o}=t;if(!core_1.types.isReferenced(r,t))return;let i=r.name;const n=o.name;hasStaticMapping(i,n,r.type,r)&&("Object"!==i&&(i="Array"),this.addDefaultImport(`@babel/runtime/helpers/${i}${n}`))}}}};
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017893, function(require, module, exports) {
!function(require, directRequire){
const template=require("@babel/template").default,generate=require("@babel/generator").default,hash=require("string-hash-64"),{transformSync:transformSync}=require("@babel/core"),traverse=require("@babel/traverse").default,parse=require("@babel/parser").parse,buildBindFunc=e=>template.ast(`\n  var ${e} = this.${e}.bind(this);\n`),buildWorkletFunc=e=>template.ast(`\n  var ${e} = this._${e}_worklet_factory_();\n`),globals=new Set(["this","console","_setGlobalConsole","Date","Array","ArrayBuffer","Int8Array","Int16Array","Int32Array","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","Float32Array","Float64Array","Date","HermesInternal","JSON","Math","Number","Object","String","Symbol","undefined","null","UIManager","requestAnimationFrame","_WORKLET","arguments","Boolean","parseInt","parseFloat","Map","Set","_log","_updateProps","RegExp","Error","global","_measure","_scrollTo","_setGestureState","_getCurrentTime","_eventTimestamp","_frameTimestamp","isNaN","LayoutAnimationRepository","_stopObservingProgress","_startObservingProgress","setTimeout","globalThis","workletUIModule"]),blacklistedFunctions=new Set(["stopCapturing","toString","map","filter","forEach","valueOf","toPrecision","toExponential","constructor","toFixed","toLocaleString","toSource","charAt","charCodeAt","concat","indexOf","lastIndexOf","localeCompare","length","match","replace","search","slice","split","substr","substring","toLocaleLowerCase","toLocaleUpperCase","toLowerCase","toUpperCase","every","join","pop","push","reduce","reduceRight","reverse","shift","slice","some","sort","splice","unshift","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","bind","apply","call","__callAsync","includes"]),possibleOptFunction=new Set(["interpolate"]);class ClosureGenerator{constructor(){this.trie=[{},!1]}mergeAns(e,t){const[r,n]=e,[o,i]=t;return 0!==o.length?[r.concat(o),i]:[r,n]}findPrefixRec(e){const t=[[],null];if(!e||"MemberExpression"!==e.node.type)return t;const r=e.node;if("Identifier"!==r.property.type)return t;if(r.computed||"value"===r.property.name||blacklistedFunctions.has(r.property.name))return t;if(e.parent&&"AssignmentExpression"===e.parent.type&&e.parent.left===e.node)return t;const n=[r.property.name],o=r,i=this.findPrefixRec(e.parentPath);return this.mergeAns([n,o],i)}findPrefix(e,t){const r=[e],n=t.node,o=this.findPrefixRec(t.parentPath);return this.mergeAns([r,n],o)}addPath(e,t){const[r,n]=this.findPrefix(e,t);let o=this.trie,i=-1;for(const e of r)i++,o[1]||(o[0][e]||(o[0][e]=[{},!1]),i===r.length-1&&(o[0][e]=[n,!0]),o=o[0][e])}generateNodeForBase(e,t,r){const n=r[0][t];return n[1]?n[0]:e.objectExpression(Object.keys(n[0]).map(t=>e.objectProperty(e.identifier(t),this.generateNodeForBase(e,t,n),!1,!0)))}generate(e,t,r){const n=[...r];return e.objectExpression(t.map((t,r)=>e.objectProperty(e.identifier(t.name),this.generateNodeForBase(e,n[r],this.trie),!1,!0)))}}function buildWorkletString(e,t,r,n){traverse(t,{enter(t){e.removeComments(t.node)}});const o=e.functionExpression(e.identifier(n),t.program.body[0].expression.params,function(t,r){return 0===t.length?r:e.blockStatement([e.variableDeclaration("const",[e.variableDeclarator(e.objectPattern(t.map(t=>e.objectProperty(e.identifier(t.name),e.identifier(t.name),!1,!0))),e.memberExpression(e.identifier("jsThis"),e.identifier("_closure")))]),r])}(r,t.program.body[0].expression.body));return generate(o,{compact:!0}).code}function generateWorkletFactory(e,t){const r=new Map;t.traverse({CallExpression:{enter(t){if(!e.isMemberExpression(t.node.callee))return;const n=[];let o=t.node.callee;for(;e.isMemberExpression(o);){const e=o.property.name;n.unshift(e),o=o.object}if(!e.isThisExpression(o))return;let i=n[n.length-1];if("bind"===i)return i=n[n.length-2],r.set(i,"bind"),void t.replaceWith(e.identifier(i));t.get("callee").replaceWith(e.identifier(i)),r.set(i,"worklet")}}});const n=[];r.forEach((e,t)=>{const r="bind"===e?(o=t,template.ast(`\n  var ${o} = this.${o}.bind(this);\n`)):buildWorkletFunc(t);var o;n.push(r)});const o=e.arrowFunctionExpression(t.node.params,t.node.body),i=e.identifier("f");return e.functionExpression(null,[],e.blockStatement([...n,e.variableDeclaration("var",[e.variableDeclarator(i,o)]),e.returnStatement(i)]))}function removeWorkletDirective(e){let t;const r=parse("\n("+e.toString()+"\n)");return traverse(r,{DirectiveLiteral(e){"worklet"===e.node.value&&e.parentPath.remove()},Program:{exit(e){t=e.get("body.0.expression").node}}}),t}function makeWorkletName(e,t){return e.isObjectMethod(t)?t.node.key.name:e.isFunctionDeclaration(t)||e.isFunctionExpression(t)&&e.isIdentifier(t.node.id)?t.node.id.name:"_f"}function makeWorklet(e,t,r){const n=makeWorkletName(e,t),o=new Map,i=new Set,s=new ClosureGenerator,a={};t.traverse({DirectiveLiteral(e){"worklet"===e.node.value&&e.getFunctionParent()===t&&e.parentPath.remove()}});const l="\n("+(e.isObjectMethod(t)?"function ":"")+t.toString()+"\n)",c=transformSync(l,{filename:r,ast:!0,babelrc:!1,configFile:!1});t.parent&&t.parent.callee&&"createAnimatedStyle"===t.parent.callee.name&&(a.optFlags=isPossibleOptimization(c.ast)),traverse(c.ast,{ReferencedIdentifier(e){const r=e.node.name;if(globals.has(r)||t.node.id&&t.node.id.name===r)return;const n=e.parent;if("MemberExpression"===n.type&&n.property===e.node&&!n.computed)return;if("ObjectProperty"===n.type&&"ObjectExpression"===e.parentPath.parent.type&&e.node!==n.value)return;let i=e.scope;for(;null!=i;){if(null!=i.bindings[r])return;i=i.parent}o.set(r,e.node),s.addPath(r,e)},AssignmentExpression(t){const r=t.node.left;e.isMemberExpression(r)&&e.isIdentifier(r.object)&&e.isIdentifier(r.property,{name:"value"})&&i.add(r.object.name)}});const p=Array.from(o.values()),u=e.identifier("_f"),d=e.cloneNode(t.node);let m;m="BlockStatement"===d.body.type?e.functionExpression(null,d.params,d.body):d;const f=buildWorkletString(e,c.ast,p,n),b=hash(f),h=t&&t.node&&t.node.loc&&t.node.loc.start;if(h){const{line:e,column:t}=h;"number"==typeof e&&"number"==typeof t&&(r=`${r} (${e}:${t})`)}const g=[e.variableDeclaration("const",[e.variableDeclarator(u,m)]),e.expressionStatement(e.assignmentExpression("=",e.memberExpression(u,e.identifier("_closure"),!1),s.generate(e,p,o.keys()))),e.expressionStatement(e.assignmentExpression("=",e.memberExpression(u,e.identifier("asString"),!1),e.stringLiteral(f))),e.expressionStatement(e.assignmentExpression("=",e.memberExpression(u,e.identifier("__workletHash"),!1),e.numericLiteral(b))),e.expressionStatement(e.assignmentExpression("=",e.memberExpression(u,e.identifier("__location"),!1),e.stringLiteral(r))),e.expressionStatement(e.assignmentExpression("=",e.memberExpression(u,e.identifier("__worklet"),!1),e.booleanLiteral(!0)))];g.push(e.returnStatement(u));return e.functionExpression(t.id,[],e.blockStatement(g))}function processWorkletFunction(e,t,r){if(!e.isFunctionParent(t))return;if(t.parentPath.isObjectProperty()){const r=t.parent.key.name,n=removeWorkletDirective(t),o=generateWorkletFactory(e,t),i=`_${r}_worklet_factory_`;return void t.parentPath.replaceWithMultiple([e.objectProperty(e.identifier(r),n,!1,!1),e.objectProperty(e.identifier(i),o,!1,!1)])}const n=makeWorklet(e,t,r),o=e.callExpression(n,[]),i=e.isScopable(t.parent)||e.isExportNamedDeclaration(t.parent);t.replaceWith(t.node.id&&i?e.variableDeclaration("const",[e.variableDeclarator(t.node.id,o)]):o)}function processIfWorkletNode(e,t,r){t.traverse({DirectiveLiteral(n){if("worklet"===n.node.value&&n.getFunctionParent()===t){const n=t.node.body.directives;n&&n.length>0&&n.some(t=>e.isDirectiveLiteral(t.value)&&"worklet"===t.value.value)&&processWorkletFunction(e,t,r)}}})}const FUNCTIONLESS_FLAG=1,STATEMENTLESS_FLAG=2;function isPossibleOptimization(e){let t=!1,r=!1;traverse(e,{CallExpression(e){possibleOptFunction.has(e.node.callee.name)||(t=!0)},IfStatement(){r=!0}});let n=0;return t||(n|=1),r||(n|=2),n}module.exports=function({types:e}){return{pre(){null!=this.opts&&Array.isArray(this.opts.globals)&&this.opts.globals.forEach(e=>{globals.add(e)})},visitor:{"FunctionDeclaration|FunctionExpression|ArrowFunctionExpression":{exit(t,r){const n=r.file.opts.filename||r.file.opts.sourceFileName;processIfWorkletNode(e,t,n)}}}}},module.exports.version="0.0.5";
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017894, function(require, module, exports) {
const config_1=require("../../config"),_babelCodeFrame=()=>require("babel-code-frame"),_babel=()=>require("babel-core"),es6Compile=e=>{const{code:r,filePath:o,inputSourceMap:c}=e;try{const e=require("babel-core").transform(r,{presets:["babel-preset-es2015","babel-preset-stage-0"].map(e=>require.resolve(e)),babelrc:!1,sourceFileName:o,filename:o,inputSourceMap:c,sourceMaps:!0});return{code:e.code,map:e.map}}catch(e){if(e.loc){return{error:{message:`file: ${o}\n ${e.message}\n ${require("babel-code-frame")(r,e.loc.line,e.loc.column>0?e.loc.column:1)}`,code:config_1.BABEL_TRANS_JS_ERR}}}return{error:{message:""+e,code:config_1.BABEL_TRANS_JS_ERR}}}};module.exports=es6Compile;
}, function(modId) { var map = {"../../config":1679975017839}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017895, function(require, module, exports) {
const config_1=require("../../config"),_Terser=()=>require("terser"),_UglifyJS=()=>require("uglify-js"),_babelCodeFrame=()=>require("babel-code-frame"),minify=e=>{const{code:r,inputSourceMap:o,useTerser:i,filePath:n}=e;let c;const s=o?{includeSources:!0,content:o,filename:n}:{includeSources:!0,content:void 0,filename:n};if(c=i?require("terser").minify(r,{output:{comments:!1},toplevel:!0,compress:{drop_console:!1,drop_debugger:!1},sourceMap:s}):require("uglify-js").minify(r,{toplevel:!0,sourceMap:s}),c.error){const e=c.error;return{error:{message:`file: ${n}\n ${c.error.message}\n ${require("babel-code-frame")(r,e.line,e.col>0?e.col:1)}`,code:config_1.UGLIFY_JS_ERR}}}return c};module.exports=minify;
}, function(modId) { var map = {"../../config":1679975017839}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017896, function(require, module, exports) {
const tslib_1=require("tslib"),minifyjs_1=(0,tslib_1.__importDefault)(require("./minifyjs")),_sourcemap=()=>require("source-map"),transformInputSourceMapWhenWraped=e=>{const{code:n,filePath:r,inputSourceMap:o}=e;if(o){const e=new(_sourcemap().SourceMapConsumer)(o),n=new(_sourcemap().SourceMapGenerator)({file:r});return e.eachMapping(e=>{if("number"!=typeof e.originalLine||"number"!=typeof e.originalColumn)return;const r={generated:{line:e.generatedLine+1,column:e.generatedColumn}};null!=e.source&&(r.source=e.source,r.original={line:e.originalLine,column:e.originalColumn},null!=e.name&&(r.name=e.name)),n.addMapping(r)}),e.sources.forEach(r=>{const o=r;n._sources.has(o)||n._sources.add(o);const s=e.sourceContentFor(r);null!==s&&n.setSourceContent(r,s)}),n.toJSON()}{const e=new(_sourcemap().SourceMapGenerator)({file:r}),o=n.split("\n").length;for(let n=0;n<o;n++)e.addMapping({generated:{line:n+2,column:0},original:{line:n+1,column:0},source:r});return e._sources.add(r),e.setSourceContent(r,n),e.toJSON()}},minifyAfterWrap=e=>{const n=transformInputSourceMapWhenWraped(Object.assign({},e)),r=(0,minifyjs_1.default)(Object.assign(Object.assign({},e),{inputSourceMap:n,code:`(function(){\n${e.code}\n})()`,useTerser:!0}));return r.error?(console.error(r.error),(0,minifyjs_1.default)(Object.assign(Object.assign({},e),{useTerser:!0}))):r};module.exports=minifyAfterWrap;
}, function(modId) { var map = {"./minifyjs":1679975017895}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017897, function(require, module, exports) {
const babel7=()=>require("@babel/core"),generateMap=(e,r)=>{let a=void 0;try{if(a=require("@babel/core").transform(r,{presets:[],babelrc:!1,sourceFileName:e,sourceMaps:!0,configFile:!1}),null==a?void 0:a.map)return Object.assign(Object.assign({},a.map),{version:""+(null==a?void 0:a.map.version)})}catch(e){}};module.exports=generateMap;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017898, function(require, module, exports) {
const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),postcss_1=(0,tslib_1.__importDefault)(require("postcss")),autoprefixer_1=(0,tslib_1.__importDefault)(require("autoprefixer")),cssnano_1=(0,tslib_1.__importDefault)(require("cssnano")),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),tools_1=require("../../../utils/tools"),config_1=require("../../../config"),log_1=(0,tslib_1.__importDefault)(require("../../../utils/log")),wxssBrowser=["iOS >= 8","Chrome >= 37"];async function compileWXSS(e){const{code:r,filePath:o,setting:s={},root:t=""}=e,i=Buffer.from(r),l=(0,tools_1.bufferToUtf8String)(i),{minify:a,minifyWXSS:u,autoPrefixWXSS:_}=s,c=path_1.default.posix.join(t,o),f=a&&!1!==u||u;if(void 0===l)return{error:{code:config_1.FILE_NOT_UTF8,path:c,message:locales_1.default.config.FILE_NOT_UTF8.format(c)}};if(f||_)try{const e=[];_&&e.push((0,autoprefixer_1.default)({overrideBrowserslist:wxssBrowser,remove:!1})),f&&e.push((0,cssnano_1.default)({preset:["default",{reduceTransforms:!1,calc:!1,minifySelectors:!1,normalizeUrl:!1}]}));return{error:null,code:(await(0,postcss_1.default)(e).process(l,{from:(0,tools_1.leading)(o,"/")})).css.replace(/\r\n/g,"\n")}}catch(e){return log_1.default.error("postcss error @ "+c),log_1.default.error(e),{error:{code:config_1.POST_WXSS_ERR,path:c,message:e.message}}}return{error:null,code:l.replace(/\r\n/g,"\n")}}process.env.BROWSERSLIST=process.env.BROWSERSLIST||"iOS >= 8, Chrome >= 37",module.exports=compileWXSS;
}, function(modId) { var map = {"../../../utils/locales/locales":1679975017841,"../../../utils/tools":1679975017847,"../../../config":1679975017839,"../../../utils/log":1679975017836}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017899, function(require, module, exports) {
const tslib_1=require("tslib"),tools_1=require("../../../utils/tools"),path_1=(0,tslib_1.__importDefault)(require("path")),log_1=(0,tslib_1.__importDefault)(require("../../../utils/log")),config_1=require("../../../config"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales"));function getCharCode(T){return T.charCodeAt(0)>=STATE.OTHERS?STATE.OTHERS:T.charCodeAt(0)}var TokenType,STATE,ACTION;!function(T){T[T.ATTR=0]="ATTR",T[T.STRING1=1]="STRING1",T[T.STRING2=2]="STRING2",T[T.OTHERS=3]="OTHERS"}(TokenType||(TokenType={})),function(T){T[T.ERROR=-1]="ERROR",T[T.NOT_SET=0]="NOT_SET",T[T.SIMPLE=1]="SIMPLE",T[T.TAG_START=2]="TAG_START",T[T.IN_TAG=3]="IN_TAG",T[T.IN_TAG_WORD=4]="IN_TAG_WORD",T[T.IN_STRING=5]="IN_STRING",T[T.IN_STRING_ESCAPE=6]="IN_STRING_ESCAPE",T[T.TAG_EQ=7]="TAG_EQ",T[T.IN_STRING2=9]="IN_STRING2",T[T.IN_STRING2_ESCAPE=10]="IN_STRING2_ESCAPE",T[T.IN_TEMPLATE_STRING=11]="IN_TEMPLATE_STRING",T[T.IN_TEMPLATE_STRING_ESCAPE=12]="IN_TEMPLATE_STRING_ESCAPE",T[T.IN_TEMPLATE_STRING2=13]="IN_TEMPLATE_STRING2",T[T.IN_TEMPLATE_STRING2_ESCAPE=14]="IN_TEMPLATE_STRING2_ESCAPE",T[T.WAIT_TEMPLATE_START=15]="WAIT_TEMPLATE_START",T[T.IN_TEMPLATE=16]="IN_TEMPLATE",T[T.WAIT_TEMPLATE_END=17]="WAIT_TEMPLATE_END",T[T.WAIT_FOR_RIGHT_BRACKET=18]="WAIT_FOR_RIGHT_BRACKET",T[T.IN_COMMENT=19]="IN_COMMENT",T[T.WAIT_FOR_COMMENT_END1=20]="WAIT_FOR_COMMENT_END1",T[T.WAIT_FOR_COMMENT_END2=21]="WAIT_FOR_COMMENT_END2",T[T.IN_COMMENT_BEGIN1=33]="IN_COMMENT_BEGIN1",T[T.IN_COMMENT_BEGIN2=34]="IN_COMMENT_BEGIN2",T[T.WXS_BEGIN_STEP1=22]="WXS_BEGIN_STEP1",T[T.WXS_BEGIN_STEP2=23]="WXS_BEGIN_STEP2",T[T.WXS_BEGIN_STEP3=24]="WXS_BEGIN_STEP3",T[T.WXS_BEGIN_STEP4=25]="WXS_BEGIN_STEP4",T[T.WXS_END_STEP1=26]="WXS_END_STEP1",T[T.WXS_END_STEP2=27]="WXS_END_STEP2",T[T.WXS_END_STEP3=28]="WXS_END_STEP3",T[T.WXS_END_STEP4=29]="WXS_END_STEP4",T[T.WXS_END_STEP5=30]="WXS_END_STEP5",T[T.IN_WXS=31]="IN_WXS",T[T.WXS_BEGIN_WAIT_FOR_RIGHT_BRACKET=32]="WXS_BEGIN_WAIT_FOR_RIGHT_BRACKET",T[T.SIMPLE_LINE_BREAK_BEGIN1=35]="SIMPLE_LINE_BREAK_BEGIN1",T[T.SIMPLE_LINE_BREAK_BEGIN2=36]="SIMPLE_LINE_BREAK_BEGIN2",T[T.SIMPLE_SPACE_OR_TAB=37]="SIMPLE_SPACE_OR_TAB",T[T.TEXT_BEGIN_STEP1=38]="TEXT_BEGIN_STEP1",T[T.TEXT_BEGIN_STEP2=39]="TEXT_BEGIN_STEP2",T[T.TEXT_BEGIN_STEP3=40]="TEXT_BEGIN_STEP3",T[T.TEXT_BEGIN_STEP4=41]="TEXT_BEGIN_STEP4",T[T.TEXT_BEGIN_STEP5=42]="TEXT_BEGIN_STEP5",T[T.TEXT_END_STEP1=43]="TEXT_END_STEP1",T[T.TEXT_END_STEP2=44]="TEXT_END_STEP2",T[T.TEXT_END_STEP3=45]="TEXT_END_STEP3",T[T.TEXT_END_STEP4=46]="TEXT_END_STEP4",T[T.TEXT_END_STEP5=47]="TEXT_END_STEP5",T[T.TEXT_END_STEP6=48]="TEXT_END_STEP6",T[T.IN_TEXT=49]="IN_TEXT",T[T.TEXT_BEGIN_WAIT_FOR_RIGHT_BRACKET=50]="TEXT_BEGIN_WAIT_FOR_RIGHT_BRACKET",T[T.END=99]="END",T[T.OTHERS=256]="OTHERS"}(STATE||(STATE={})),function(T){T[T.NOTHING=0]="NOTHING",T[T.DO_ACTION=65536]="DO_ACTION",T[T.STORE_TOKEN_EXCLUDE=131072]="STORE_TOKEN_EXCLUDE",T[T.STORE_TOKEN_INCLUDE=262144]="STORE_TOKEN_INCLUDE",T[T.IGNORE=524288]="IGNORE",T[T.REFEED=1048576]="REFEED",T[T.STORE_TOKEN_FIRST=2097152]="STORE_TOKEN_FIRST",T[T.STORE_ONE_SPACE=4194304]="STORE_ONE_SPACE",T[T.STORE_ONE_LINE_BREAK=8388608]="STORE_ONE_LINE_BREAK",T[T.GET_WHITECHARS_BEFORE=16777216]="GET_WHITECHARS_BEFORE",T[T.STORE_STATE_BEFORE_COMMENT=33554432]="STORE_STATE_BEFORE_COMMENT",T[T.SET_WXS_STATE=67108864]="SET_WXS_STATE",T[T.WXS_BACK=134217728]="WXS_BACK",T[T.SET_TEXT_STATE=268435456]="SET_TEXT_STATE",T[T.TEXT_BACK=536870912]="TEXT_BACK"}(ACTION||(ACTION={}));class Token{constructor(T,E){this.type=T,this.value=E}}class MachineState{constructor(){this.cur_pos=0,this.last_pos=0,this.line=1,this.col=1,this.last_line=this.line,this.last_col=1,this.state=STATE.SIMPLE}}class Machine{constructor(T,E){this.mState=new MachineState,this.TT=new Array(1024);for(let T=0;T<1024;T++){const E=new Array(257);this.TT[T]=E}this.InitTransitTable(),this.mPath=T,this.mSrc=E,this.stateBeforeComment=STATE.SIMPLE,this.wxsState=!1,this.textState=!1}Reset(){return this.mState.cur_pos=this.mState.last_pos=0,this.mState.line=1,this.mState.col=1,this.mState.last_line=this.mState.line,this.mState.last_col=1,this.mState.state=STATE.SIMPLE,0}Feed(T,E){let _,S,t,A,N;"\n"===T&&(this.mState.line++,this.mState.col=0);do{if(N=!1,void 0!==_&&_&ACTION.REFEED&&(N=!0),_=this.TT[this.mState.state][getCharCode(T)],_===STATE.NOT_SET&&(_=this.TT[this.mState.state][STATE.OTHERS]),_===STATE.NOT_SET)throw{msg:`BAD STATE MACHINE! AT INPUT ${this.mState.state} ${T}`};if(_<0)throw"\0"!==T?{msg:`${this.mState.line}:${this.mState.col}:unexpected character \`${T.replace("\n","\\n")}\``}:{msg:`${this.mState.line}:${this.mState.col}:unexpected end`};if(S=_,t=65535&_,A=this.mState.state,S&ACTION.STORE_STATE_BEFORE_COMMENT&&!N&&(this.stateBeforeComment=A),A===STATE.WAIT_FOR_RIGHT_BRACKET&&">"===T&&this.wxsState&&(this.wxsState=!1),A===STATE.WAIT_FOR_RIGHT_BRACKET&&">"===T&&this.textState&&(this.textState=!1),S&ACTION.SET_WXS_STATE&&(this.wxsState=!this.wxsState),S&ACTION.SET_TEXT_STATE&&(this.textState=!this.textState),">"===T&&t===STATE.SIMPLE&&this.wxsState&&(t=STATE.IN_WXS),">"===T&&t===STATE.SIMPLE&&this.textState&&(t=STATE.IN_TEXT),this.mState.state=t,S&ACTION.STORE_TOKEN_FIRST&&this.mState.cur_pos>this.mState.last_pos){const T=new Token(TokenType.OTHERS,this.mSrc.substring(this.mState.last_pos,this.mState.last_pos+1));E.push(T),this.mState.last_pos++,this.mState.last_col++}if(S&ACTION.STORE_ONE_LINE_BREAK){const T=new Token(TokenType.OTHERS,"\n");E.push(T),this.mState.last_pos=this.mState.cur_pos,this.mState.last_col=this.mState.col,this.mState.last_line=this.mState.line}if(S&ACTION.STORE_ONE_SPACE){const T=new Token(TokenType.OTHERS," ");E.push(T),this.mState.last_pos=this.mState.cur_pos,this.mState.last_col=this.mState.col,this.mState.last_line=this.mState.line}}while(_&ACTION.REFEED);if(S&ACTION.STORE_TOKEN_EXCLUDE){const T=this.mState.cur_pos,_=this.mState.last_pos;if(T>_){let S;S=A===STATE.IN_TAG_WORD&&_>0&&" \n\t\r".includes(this.mSrc[_-1])?new Token(TokenType.ATTR,this.mSrc.substring(_,T)):(this.wxsState&&STATE.IN_WXS,new Token(TokenType.OTHERS,this.mSrc.substring(_,T))),E.push(S),this.mState.last_pos=this.mState.cur_pos,this.mState.last_col=this.mState.col,this.mState.last_line=this.mState.line}}if(S&ACTION.WXS_BACK){const T=new Token(TokenType.OTHERS,this.mSrc.substring(this.mState.last_pos,this.mState.cur_pos-4));E.push(T),this.mState.last_pos=this.mState.cur_pos-4,this.mState.last_col=this.mState.col-4,this.mState.last_line=this.mState.line}if(S&ACTION.TEXT_BACK){const T=new Token(TokenType.OTHERS,this.mSrc.substring(this.mState.last_pos,this.mState.cur_pos-5));E.push(T),this.mState.last_pos=this.mState.cur_pos-5,this.mState.last_col=this.mState.col-5,this.mState.last_line=this.mState.line}if(this.mState.cur_pos++,this.mState.col++,S&ACTION.STORE_TOKEN_INCLUDE){let T;T=A===STATE.IN_STRING?TokenType.STRING1:A===STATE.IN_STRING2?TokenType.STRING2:TokenType.OTHERS;const _=new Token(T,this.mSrc.substring(this.mState.last_pos,this.mState.cur_pos));E.push(_),this.mState.last_pos=this.mState.cur_pos,this.mState.last_col=this.mState.col,this.mState.last_line=this.mState.line}return S&ACTION.IGNORE&&(this.mState.last_pos=this.mState.cur_pos,this.mState.last_col=this.mState.col),S&ACTION.GET_WHITECHARS_BEFORE&&(this.mState.state=this.stateBeforeComment,this.stateBeforeComment!==STATE.SIMPLE_LINE_BREAK_BEGIN2&&this.stateBeforeComment!==STATE.SIMPLE_SPACE_OR_TAB||E.pop(),this.stateBeforeComment=STATE.SIMPLE),0}FillTT(T,E,_,S){for(const t of S)this.TT[T][getCharCode(t)]=E|_}FillTT_template_string(T,E){const _=T+1;this.TT[T][getCharCode("\\")]=_,this.TT[_][STATE.OTHERS]=T,this.TT[T][getCharCode(E)]=STATE.IN_TEMPLATE,this.TT[T][0]=STATE.ERROR,this.TT[T][STATE.OTHERS]=T}FillTT_string(T,E){const _=T+1;this.TT[T][getCharCode("\\")]=_,this.TT[T][getCharCode("\n")]=STATE.ERROR,this.TT[_][STATE.OTHERS]=T,this.TT[_][getCharCode("\n")]=STATE.IN_TAG|ACTION.STORE_TOKEN_EXCLUDE|ACTION.IGNORE,this.TT[T][getCharCode(E)]=STATE.IN_TAG|ACTION.STORE_TOKEN_INCLUDE,this.TT[T][0]=STATE.ERROR,this.TT[T][STATE.OTHERS]=T}InitTransitTable(){for(let T=0;T<1024;T++)this.TT[T].fill(0);const T="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-:";this.TT[STATE.END][STATE.OTHERS]=STATE.END,this.TT[STATE.SIMPLE][getCharCode("<")]=STATE.TAG_START|ACTION.STORE_TOKEN_EXCLUDE|ACTION.STORE_STATE_BEFORE_COMMENT,this.TT[STATE.SIMPLE][getCharCode("{")]=STATE.WAIT_TEMPLATE_START,this.TT[STATE.SIMPLE][STATE.OTHERS]=STATE.SIMPLE,this.TT[STATE.SIMPLE][0]=STATE.END|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.WAIT_TEMPLATE_START][getCharCode("{")]=STATE.IN_TEMPLATE,this.TT[STATE.WAIT_TEMPLATE_START][STATE.OTHERS]=STATE.SIMPLE,this.TT[STATE.IN_TEMPLATE][getCharCode("}")]=STATE.WAIT_TEMPLATE_END,this.TT[STATE.IN_TEMPLATE][0]=STATE.ERROR,this.TT[STATE.IN_TEMPLATE][STATE.OTHERS]=STATE.IN_TEMPLATE,this.TT[STATE.WAIT_TEMPLATE_END][getCharCode("}")]=STATE.SIMPLE,this.TT[STATE.WAIT_TEMPLATE_END][STATE.OTHERS]=STATE.IN_TEMPLATE|ACTION.REFEED,this.TT[STATE.IN_TEMPLATE][getCharCode('"')]=STATE.IN_TEMPLATE_STRING,this.TT[STATE.IN_TEMPLATE][getCharCode("'")]=STATE.IN_TEMPLATE_STRING2,this.FillTT_template_string(STATE.IN_TEMPLATE_STRING,'"'),this.FillTT_template_string(STATE.IN_TEMPLATE_STRING2,"'"),this.FillTT(STATE.TAG_START,STATE.IN_TAG,ACTION.STORE_TOKEN_EXCLUDE|ACTION.IGNORE," \n\t\r"),this.FillTT(STATE.TAG_START,STATE.IN_TAG_WORD,ACTION.STORE_TOKEN_EXCLUDE,T),this.TT[STATE.TAG_START][getCharCode("/")]=STATE.IN_TAG|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.TAG_START][getCharCode("!")]=STATE.IN_COMMENT_BEGIN1,this.TT[STATE.TAG_START][STATE.OTHERS]=STATE.ERROR,this.TT[STATE.IN_COMMENT_BEGIN1][getCharCode("-")]=STATE.IN_COMMENT_BEGIN2,this.TT[STATE.IN_COMMENT_BEGIN1][STATE.OTHERS]=STATE.ERROR,this.TT[STATE.IN_COMMENT_BEGIN2][getCharCode("-")]=STATE.IN_COMMENT,this.TT[STATE.IN_COMMENT_BEGIN2][STATE.OTHERS]=STATE.ERROR,this.TT[STATE.IN_COMMENT][getCharCode("-")]=STATE.WAIT_FOR_COMMENT_END1,this.TT[STATE.IN_COMMENT][STATE.OTHERS]=STATE.IN_COMMENT,this.TT[STATE.WAIT_FOR_COMMENT_END1][getCharCode("-")]=STATE.WAIT_FOR_COMMENT_END2,this.TT[STATE.WAIT_FOR_COMMENT_END1][STATE.OTHERS]=STATE.IN_COMMENT,this.TT[STATE.WAIT_FOR_COMMENT_END2][getCharCode(">")]=STATE.SIMPLE|ACTION.IGNORE|ACTION.GET_WHITECHARS_BEFORE,this.TT[STATE.WAIT_FOR_COMMENT_END2][getCharCode("-")]=STATE.WAIT_FOR_COMMENT_END2,this.TT[STATE.WAIT_FOR_COMMENT_END2][STATE.OTHERS]=STATE.IN_COMMENT,this.FillTT(STATE.IN_TAG_WORD,STATE.IN_TAG_WORD,ACTION.NOTHING,T),this.FillTT(STATE.IN_TAG_WORD,STATE.IN_TAG_WORD,ACTION.NOTHING,"0123456789"),this.FillTT(STATE.IN_TAG_WORD,STATE.IN_TAG,ACTION.STORE_TOKEN_EXCLUDE|ACTION.IGNORE," \n\t\r"),this.TT[STATE.IN_TAG_WORD][getCharCode("=")]=STATE.TAG_EQ|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.IN_TAG_WORD][getCharCode('"')]=STATE.ERROR,this.TT[STATE.IN_TAG_WORD][getCharCode(">")]=STATE.SIMPLE|ACTION.STORE_TOKEN_EXCLUDE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.IN_TAG_WORD][getCharCode("/")]=STATE.WAIT_FOR_RIGHT_BRACKET|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.IN_TAG_WORD][STATE.OTHERS]=STATE.IN_TAG|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.IN_TAG_WORD][0]=STATE.ERROR,this.FillTT(STATE.TAG_EQ,STATE.IN_TAG,ACTION.STORE_TOKEN_EXCLUDE|ACTION.IGNORE," \n\t\r"),this.FillTT(STATE.TAG_EQ,STATE.IN_STRING,ACTION.STORE_TOKEN_EXCLUDE,T),this.TT[STATE.TAG_EQ][getCharCode('"')]=STATE.IN_STRING|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.TAG_EQ][getCharCode("'")]=STATE.IN_STRING2|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.TAG_EQ][0]=STATE.ERROR,this.TT[STATE.TAG_EQ][STATE.OTHERS]=STATE.ERROR,this.FillTT(STATE.IN_TAG,STATE.IN_TAG,ACTION.IGNORE," \n\t\r"),this.FillTT(STATE.IN_TAG,STATE.IN_TAG_WORD,ACTION.NOTHING,T),this.FillTT(STATE.IN_TAG,STATE.ERROR,ACTION.NOTHING,"0123456789"),this.TT[STATE.IN_TAG][getCharCode("<")]=STATE.ERROR,this.TT[STATE.IN_TAG][getCharCode('"')]=STATE.IN_STRING,this.TT[STATE.IN_TAG][getCharCode("'")]=STATE.IN_STRING2,this.TT[STATE.IN_TAG][getCharCode("/")]=STATE.WAIT_FOR_RIGHT_BRACKET,this.TT[STATE.IN_TAG][getCharCode(">")]=STATE.SIMPLE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.IN_TAG][getCharCode("=")]=STATE.TAG_EQ,this.TT[STATE.IN_TAG][0]=STATE.ERROR,this.TT[STATE.IN_TAG][STATE.OTHERS]=STATE.ERROR,this.FillTT(STATE.WAIT_FOR_RIGHT_BRACKET,STATE.IN_TAG_WORD,ACTION.STORE_TOKEN_EXCLUDE,T),this.TT[STATE.WAIT_FOR_RIGHT_BRACKET][getCharCode(">")]=STATE.SIMPLE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.WAIT_FOR_RIGHT_BRACKET][STATE.OTHERS]=STATE.ERROR,this.FillTT_string(STATE.IN_STRING,'"'),this.FillTT_string(STATE.IN_STRING2,"'"),this.TT[STATE.TAG_START][getCharCode("w")]=STATE.WXS_BEGIN_STEP1;let E="wxs",_=STATE.WXS_BEGIN_STEP1;for(let T=1,S=_;T<E.length;T++)this.TT[S][getCharCode(E[T])]=_+T,this.TT[S][STATE.OTHERS]=STATE.IN_TAG_WORD|ACTION.REFEED|ACTION.STORE_TOKEN_FIRST,2===T&&(this.TT[S][getCharCode(E[T])]|=ACTION.SET_WXS_STATE),S=_+T;this.FillTT(STATE.WXS_BEGIN_STEP3,STATE.IN_TAG,ACTION.STORE_TOKEN_EXCLUDE|ACTION.IGNORE," \n\t\r"),this.TT[STATE.WXS_BEGIN_STEP3][getCharCode(">")]=STATE.IN_WXS|ACTION.STORE_TOKEN_EXCLUDE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.WXS_BEGIN_STEP3][STATE.OTHERS]=STATE.IN_TAG_WORD|ACTION.REFEED|ACTION.STORE_TOKEN_FIRST|ACTION.SET_WXS_STATE,this.TT[STATE.IN_WXS][getCharCode("<")]=STATE.WXS_END_STEP1,this.TT[STATE.IN_WXS][STATE.OTHERS]=STATE.IN_WXS,E="</wxs",_=STATE.WXS_END_STEP1;for(let T=1,S=_;T<E.length;T++)this.TT[S][getCharCode(E[T])]=_+T,4===T&&(this.TT[S][getCharCode(E[T])]|=ACTION.WXS_BACK|ACTION.SET_WXS_STATE),this.TT[S][STATE.OTHERS]=STATE.IN_WXS|ACTION.REFEED,S=_+T;this.FillTT(STATE.WXS_END_STEP5,STATE.WXS_END_STEP5,ACTION.NOTHING," \n\t\r"),this.TT[STATE.WXS_END_STEP5][getCharCode(">")]=STATE.SIMPLE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.WXS_END_STEP5][STATE.OTHERS]=STATE.ERROR,this.TT[STATE.SIMPLE][getCharCode(" ")]=STATE.SIMPLE_SPACE_OR_TAB|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.SIMPLE][getCharCode("\t")]=STATE.SIMPLE_SPACE_OR_TAB|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.SIMPLE][getCharCode("\n")]=STATE.SIMPLE_LINE_BREAK_BEGIN1|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.SIMPLE_SPACE_OR_TAB][getCharCode(" ")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_SPACE_OR_TAB][getCharCode("\t")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_SPACE_OR_TAB][getCharCode("\n")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_SPACE_OR_TAB][getCharCode("<")]=STATE.SIMPLE|ACTION.STORE_ONE_SPACE|ACTION.REFEED|ACTION.STORE_STATE_BEFORE_COMMENT,this.TT[STATE.SIMPLE_SPACE_OR_TAB][STATE.OTHERS]=STATE.SIMPLE|ACTION.STORE_ONE_SPACE|ACTION.REFEED,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN1][getCharCode("\n")]=STATE.SIMPLE_LINE_BREAK_BEGIN2,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN1][getCharCode("\t")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN1][getCharCode(" ")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN1][getCharCode("<")]=STATE.SIMPLE|ACTION.REFEED|ACTION.STORE_STATE_BEFORE_COMMENT,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN1][STATE.OTHERS]=STATE.SIMPLE|ACTION.REFEED|ACTION.STORE_TOKEN_EXCLUDE,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN2][getCharCode("\n")]=STATE.SIMPLE_LINE_BREAK_BEGIN2,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN2][getCharCode("\t")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN2][getCharCode(" ")]=STATE.SIMPLE_SPACE_OR_TAB,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN2][getCharCode("<")]=STATE.SIMPLE|ACTION.STORE_ONE_LINE_BREAK|ACTION.REFEED|ACTION.STORE_STATE_BEFORE_COMMENT,this.TT[STATE.SIMPLE_LINE_BREAK_BEGIN2][STATE.OTHERS]=STATE.SIMPLE|ACTION.REFEED|ACTION.STORE_ONE_LINE_BREAK,this.TT[STATE.TAG_START][getCharCode("t")]=STATE.TEXT_BEGIN_STEP1,E="text",_=STATE.TEXT_BEGIN_STEP1;for(let T=1,S=_;T<E.length;T++)this.TT[S][getCharCode(E[T])]=_+T,3===T&&(this.TT[S][getCharCode(E[T])]|=ACTION.SET_TEXT_STATE),this.TT[S][STATE.OTHERS]=STATE.IN_TAG_WORD|ACTION.REFEED|ACTION.STORE_TOKEN_FIRST,S=_+T;this.FillTT(STATE.TEXT_BEGIN_STEP4,STATE.IN_TAG,ACTION.STORE_TOKEN_EXCLUDE|ACTION.IGNORE," \n\t\r"),this.TT[STATE.TEXT_BEGIN_STEP4][getCharCode(">")]=STATE.IN_TEXT|ACTION.STORE_TOKEN_EXCLUDE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.TEXT_BEGIN_STEP4][STATE.OTHERS]=STATE.IN_TAG_WORD|ACTION.REFEED|ACTION.STORE_TOKEN_FIRST|ACTION.SET_TEXT_STATE,this.TT[STATE.IN_TEXT][getCharCode("<")]=STATE.TEXT_END_STEP1,this.TT[STATE.IN_TEXT][STATE.OTHERS]=STATE.IN_TEXT,E="</text",_=STATE.TEXT_END_STEP1;for(let T=1,S=_;T<E.length;T++)this.TT[S][getCharCode(E[T])]=_+T,5===T&&(this.TT[S][getCharCode(E[T])]|=ACTION.TEXT_BACK|ACTION.SET_TEXT_STATE),this.TT[S][STATE.OTHERS]=STATE.IN_TEXT|ACTION.REFEED,S=_+T;this.FillTT(STATE.TEXT_END_STEP6,STATE.TEXT_END_STEP6,ACTION.NOTHING," \n\t\r"),this.TT[STATE.TEXT_END_STEP6][getCharCode(">")]=STATE.SIMPLE|ACTION.STORE_TOKEN_INCLUDE,this.TT[STATE.TEXT_END_STEP6][STATE.OTHERS]=STATE.ERROR}}class Tokenizer{constructor(T,E){this.machine=new Machine(E,T),this.m_pSrc=T,this.path=E}generateTokens(T){this.machine.Reset();let E=0;if(0===this.m_pSrc.length)return E;for(let _=0;_<this.m_pSrc.length&&0==E;_++){const S=this.m_pSrc[_];E=this.machine.Feed(S,T)}return 0!==E||(E=this.machine.Feed("\0",T)),E}}function generateWXMLFromTokens(T){let E="";for(const _ of T){let T=_.value;_.type===TokenType.ATTR&&(T=" "+T),E+=T}return E}async function minifyWXML(T){const{code:E,filePath:_,setting:S={},root:t=""}=T,{minify:A,minifyWXML:N}=S,e=!!N,I=path_1.default.posix.join(t,_),s=Buffer.from(E);let O=(0,tools_1.bufferToUtf8String)(s);if(void 0===O)return{error:{code:config_1.FILE_NOT_UTF8,path:I,message:locales_1.default.config.FILE_NOT_UTF8.format(I)}};if(e&&O.length>0)try{const T=new Tokenizer(O.replace(/\r\n/g,"\n"),I),E=[],_=T.generateTokens(E);if(0!==_)throw new Error("minifywxml tokenizer error ret: "+_);return O=generateWXMLFromTokens(E),{error:null,code:O.replace(/\r\n/g,"\n")}}catch(T){return log_1.default.error("minifywxml error @ "+I),log_1.default.error(T.msg),{error:{code:config_1.MINIFY_WXML_ERR,path:I,message:T.msg}}}return{error:null,code:O.replace(/\r\n/g,"\n")}}module.exports={minifyWXML:minifyWXML,Tokenizer:Tokenizer,generateWXMLFromTokens:generateWXMLFromTokens,Token:Token};
}, function(modId) { var map = {"../../../utils/tools":1679975017847,"../../../utils/log":1679975017836,"../../../config":1679975017839,"../../../utils/locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017900, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.runSummerPluginHook=void 0;const error_1=require("./error"),initPlugin_1=require("./initPlugin");class PluginContainer{constructor(){this.initedPlugins=new Map}getPluginInstance(n,r,e){let i=this.initedPlugins.get(n);return i||(i=(0,initPlugin_1.initPlugin)(n,r,e),this.initedPlugins.set(n,i)),i}clear(){this.initedPlugins.clear()}}const pluginContainer=new PluginContainer;async function runSummerPluginHook(n){var r;if("clear"===n.command)return pluginContainer.clear(),{};const{plugin:e,projectPath:i,pluginOption:t,method:o,args:u}=n,l=pluginContainer.getPluginInstance(e,i,t);if("runMethod"===n.command){const n=null===(r=l.workerMethods)||void 0===r?void 0:r[o];if(!n||"function"!=typeof n)throw new Error(`the ${n} is not a workerMethod of plugin(${e})`);try{return{result:await n(...u)}}catch(n){return{error:n instanceof error_1.SummerError?n.toJSON():n}}}return{}}exports.runSummerPluginHook=runSummerPluginHook;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./error":1679975017901,"./initPlugin":1679975017902}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017901, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.makeSummerError=exports.SummerErrors=exports.SummerError=void 0;const config_1=require("../config");class SummerError extends Error{constructor(r){super(r.message),this.stack=r.stack,r.code&&(this.code=r.code),r.path&&(this.path=r.path),r.plugin&&(this.plugin=r.plugin),r.hook&&(this.hook=r.hook)}toString(){return`${super.toString()}${this.path?"\nFile: "+this.path:""}`}toJSON(){return{type:"SummerError",message:this.message,stack:this.stack,code:this.code,path:this.path,plugin:this.plugin,hook:this.hook}}}function makeSummerError(r,e,o){if(r instanceof SummerError)return e&&!r.code&&(r.code=e),o&&!r.path&&(r.path=o),r;return new SummerError({code:e||exports.SummerErrors.SUMMER_PLUGIN_ERR,message:r instanceof Error?r.toString():"string"==typeof r?r:"Unknown Error Message "+r,path:o,stack:r instanceof Error?null==r?void 0:r.stack:void 0})}exports.SummerError=SummerError,exports.SummerErrors={SUMMER_PLUGIN_ERR:config_1.SUMMER_PLUGIN_ERR,SUMMER_PLUGIN_CODE_ERR:config_1.SUMMER_PLUGIN_CODE_ERR},exports.makeSummerError=makeSummerError;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../config":1679975017839}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017902, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.initPlugin=void 0;const tslib_1=require("tslib"),index_1=(0,tslib_1.__importDefault)(require("./plugins/index"));function initPlugin(i,e,t){i.startsWith("summer-")&&(i=i.replace("summer-",""));const n=index_1.default.load(i);if(n)return n(e,t);throw new Error("not found plugin for "+i)}exports.initPlugin=initPlugin;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./plugins/index":1679975017903}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017903, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});const typescript=()=>require("./typescript"),sass=()=>require("./sass"),less=()=>require("./less"),enhance=()=>require("./enhance"),terser=()=>require("./terser"),javascript=()=>require("./base/javascript"),wxss=()=>require("./base/wxss"),es6module=()=>require("./base/es6module"),minifywxml=()=>require("./minifywxml"),plugins={typescript:typescript,less:less,sass:sass,enhance:enhance,javascript:javascript,terser:terser,wxss:wxss,es6module:es6module,minifywxml:minifywxml};exports.default={load:e=>e in plugins?plugins[e]().default:null};
}, function(modId) { var map = {"./typescript":1679975017904,"./sass":1679975017906,"./less":1679975017907,"./enhance":1679975017908,"./terser":1679975017910,"./base/javascript":1679975017911,"./base/wxss":1679975017912,"./base/es6module":1679975017909,"./minifywxml":1679975017913}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017904, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),types_1=require("../types"),fs_1=(0,tslib_1.__importDefault)(require("fs")),error_1=require("../error"),babel7=()=>require("@babel/core"),pluginTransformTypescript=()=>require("@babel/plugin-transform-typescript"),pluginReplaceTsExportAssignment=e=>{const r=e.template("\n    module.exports = ASSIGNMENT;\n  ");return{name:"replace-ts-export-assignment",visitor:{TSExportAssignment(e){e.replaceWith(r({ASSIGNMENT:e.node.expression}))}}}},pluginReplaceTsImportEqualsDeclaration=e=>{const r=e.template("\n    const ID = require(SOURCE);\n  ");return{name:"replace-ts-import-equals-declaration",visitor:{TSImportEqualsDeclaration(e){e.replaceWith(r({ID:e.node.id,SOURCE:e.node.moduleReference.expression}))}}}};function default_1(){return{name:"summer-typescript",resolveExt:{js:"ts"},workerMethods:{doTransform(e,r){let t;try{t=require("@babel/core").transform(e,{babelrc:!1,plugins:[[pluginReplaceTsImportEqualsDeclaration,{}],[pluginReplaceTsExportAssignment,{}],[require("@babel/plugin-transform-typescript"),{}]],sourceFileName:r,sourceMaps:!1,ast:!0,configFile:!1,code:!1})}catch(e){throw(0,error_1.makeSummerError)(e,error_1.SummerErrors.SUMMER_PLUGIN_CODE_ERR,r)}return{sourceCode:e,inputMap:void 0,astInfo:{ast:t.ast,type:types_1.AstType.Babel}}}},async load(e,r){if(r.endsWith(".ts")){const e=fs_1.default.readFileSync(r,{encoding:"utf-8"});return await this.runWorkerMethod("doTransform",e,r)}}}}exports.default=default_1;
}, function(modId) { var map = {"../types":1679975017905,"../error":1679975017901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017905, function(require, module, exports) {
!function(require, directRequire){
var FileType,JSONType,AstType;Object.defineProperty(exports,"__esModule",{value:!0}),exports.AstType=exports.JSONType=exports.FileType=exports.BasicCodeExts=void 0,exports.BasicCodeExts=["js","wxml","wxss","json","wxs"],function(e){e.JSON="json",e.WXML="wxml",e.WXSS="wxss",e.WXS="wxs",e.JS="js"}(FileType=exports.FileType||(exports.FileType={})),function(e){e.APP="app",e.Page="page",e.EXT="ext",e.SITEMAP="sitemap",e.THEME="theme"}(JSONType=exports.JSONType||(exports.JSONType={})),function(e){e.Babel="babel",e.Acorn="acorn"}(AstType=exports.AstType||(exports.AstType={}));
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017906, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.random=void 0;const tslib_1=require("tslib"),tools_1=require("../../utils/tools"),error_1=require("../error"),fs_extra_1=(0,tslib_1.__importDefault)(require("fs-extra")),path_1=(0,tslib_1.__importDefault)(require("path")),sass=()=>require("sass");function random(){return(0,tools_1.generateMD5)(`${Math.random()}${Date.now()}`)}exports.random=random;const importWxssReg=/(?:^|\s)?(?:@import)(?:\s*)?(["'])([^"']+.wxss)\1(?:\s*);/g,importCssReg=/(?:^|\s)?(?:@import)(?:\s*)?(["'])([^"']+.css)\1(?:\s*);/g;function default_1(s){return{name:"summer-sass",resolveExt:{wxss:["sass","scss"]},async load(e,r){if(r.endsWith(".scss")||r.endsWith(".sass")){let e=await fs_extra_1.default.readFile(r,"utf-8");const t=[];e=e.replace(importWxssReg,(s,e,r)=>(t.push(r),s.replace(r,r.slice(0,-4)+"css")));const o=path_1.default.posix.dirname(path_1.default.relative(s,r));return new Promise((s,a)=>{require("sass").render({file:r,data:e,sourceMap:!0,sourceMapContents:!0,omitSourceMapUrl:!0,outFile:r.slice(0,-5)+".wxss",includePaths:this.rootPath?[this.rootPath]:[]},(e,i)=>{if(e){const s=(0,error_1.makeSummerError)(e,error_1.SummerErrors.SUMMER_PLUGIN_CODE_ERR);return void a(s)}if(!i)return void a(new Error("no result"));const n=i.css.toString("utf-8").replace(importCssReg,(s,e,r)=>{const o=r.slice(0,-3)+"wxss";return t.includes(o)?s.replace(r,o):s});if(i.stats.includedFiles.length>0)for(const s of i.stats.includedFiles)s!==r&&this.addWatchFile(s);const u=i.map?JSON.parse(i.map.toString("utf-8")):void 0;u&&(u.sourceRoot=o),s({sourceCode:n,inputMap:u})})})}}}}exports.default=default_1;
}, function(modId) { var map = {"../../utils/tools":1679975017847,"../error":1679975017901,"sass":1679975017906}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017907, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.importWxssCssReg=exports.importWxssReg=void 0;const tslib_1=require("tslib"),fs_extra_1=(0,tslib_1.__importDefault)(require("fs-extra")),path_1=(0,tslib_1.__importDefault)(require("path")),error_1=require("../error"),less=()=>require("less");function default_1(s,e){return{name:"summer-less",resolveExt:{wxss:"less"},async load(r,t){var o;if(t.endsWith(".less")){let r=await fs_extra_1.default.readFile(t,"utf-8");const a=[];r=r.replace(exports.importWxssReg,(s,e,r)=>(a.push(r),s.replace(r,r+"?css")));try{const i=await require("less").render(r,{sourceMap:{outputSourceFiles:!0},paths:this.rootPath?[this.rootPath]:[],filename:t,globalVars:null!==(o=null==e?void 0:e.globalVars)&&void 0!==o?o:{}}),l=i.css.replace(exports.importWxssCssReg,(s,e,r)=>{const t=r.slice(0,-4);return a.includes(t)?s.replace(r,t):s});if(i.imports.length)for(const s of i.imports)this.addWatchFile(s);let p=void 0;return i.map&&(p=JSON.parse(i.map),p.sources=p.sources.map(e=>path_1.default.posix.relative(s,e))),{sourceCode:l,inputMap:p}}catch(s){throw(0,error_1.makeSummerError)(s,error_1.SummerErrors.SUMMER_PLUGIN_CODE_ERR)}}}}}exports.importWxssReg=/(?:^|\s)?(?:@import)(?:\s*)?(["'])([^"']+.wxss)\1(?:\s*);/g,exports.importWxssCssReg=/(?:^|\s)?(?:@import)(?:\s*)?(["'])([^"']+.wxss\?css)\1(?:\s*);/g,exports.default=default_1;
}, function(modId) { var map = {"../error":1679975017901,"less":1679975017907}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017908, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});const types_1=require("../types"),config_1=require("../../config"),babel_helper_1=require("../../utils/babel_helper"),es6module_1=require("./base/es6module"),_transformRuntimeCustom=()=>require("../../utils/babel_transform_plugin"),_pluginTransformRuntime=()=>require("@babel/plugin-transform-runtime"),_pluginTransformWorklet=()=>require("../../utils/babel_plugin_worklet"),babel7=()=>require("@babel/core"),_presetEnv=()=>require("@babel/preset-env");function getEnhancePluginsList(e){const r=[[require("../../utils/babel_transform_plugin")],[require("@babel/plugin-transform-runtime"),{corejs:!1,helpers:!0,regenerator:!0,version:"7.12.1"}]].concat((0,babel_helper_1.getCustomPlugins)([]));return e.supportWorklet&&r.push([require("../../utils/babel_plugin_worklet")]),r}const enhance=(e,r)=>{const t=babel7(),s=e.sourceCode.includes('"worklet"')||e.sourceCode.includes("'worklet'");let o;try{const n={presets:[[require("@babel/preset-env"),{targets:{chrome:53,ios:8},modules:!1,include:["@babel/plugin-transform-computed-properties"]}]],babelrc:!1,plugins:getEnhancePluginsList({supportWorklet:s}),sourceFileName:r,inputSourceMap:!1,configFile:!1,code:!1,ast:!0,cloneInputAst:!1};if(e.astInfo){if(e.astInfo.type!==types_1.AstType.Babel)throw new Error("ast type is not babel");o=t.transformFromAstSync(e.astInfo.ast,e.sourceCode,n)}else{if(null===e.sourceCode)throw new Error("source.targetCode is null");o=babel7().transform(e.sourceCode,n)}}catch(e){const t=`file: ${r}\n ${e.message}`,s=new Error(t);throw s.code=config_1.BABEL_TRANS_JS_ERR,s}return{sourceCode:e.sourceCode,inputMap:e.inputMap,astInfo:{ast:o.ast,type:types_1.AstType.Babel}}};function default_1(e,r){return{name:"summer-enhance",workerMethods:{doTransform(e,r,t,s){const o=enhance(e,r),n=(0,es6module_1.transformES6ModuleAndGenCode)(o,r,t,s);return Object.assign(Object.assign({},o),{target:n})}},async transform(e,t,s,{independentRoot:o,isBabelIgnore:n}){if(t.endsWith(".js")&&!e.largeFile&&!n){const t=(0,es6module_1.getBabelRoot)(o);return await this.runWorkerMethod("doTransform",e,s,t,r.disableUseStrict)}return e}}}exports.default=default_1;
}, function(modId) { var map = {"../types":1679975017905,"../../config":1679975017839,"../../utils/babel_helper":1679975017878,"./base/es6module":1679975017909,"../../utils/babel_transform_plugin":1679975017892,"../../utils/babel_plugin_worklet":1679975017893}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017909, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.transformES6ModuleAndGenCode=exports.getBabelRoot=void 0;const types_1=require("../../types"),config_1=require("../../../config"),babel_helper_1=require("../../../utils/babel_helper"),tools_1=require("../../../utils/tools"),pluginTransformModulesCommonjs=()=>require("@babel/plugin-transform-modules-commonjs"),babel7=()=>require("@babel/core");function getES6ModulePluginsList(e){return[[require("@babel/plugin-transform-modules-commonjs"),{allowTopLevelThis:e,importInterop:e=>e.startsWith("@babel/runtime/helpers/")?"node":"babel"}]]}function getBabelRoot(e){return""===e?"@babel/runtime":(0,tools_1.normalizePath)(e+"/@babel/runtime")}function transformES6ModuleAndGenCode(e,o,r,t){let s;t=t||/^\s*\/\/\s?use strict disable;/i.test(e.sourceCode||"");try{const r={babelrc:!1,plugins:getES6ModulePluginsList(t),filename:o,sourceFileName:o,sourceMaps:!0,inputSourceMap:e.inputMap,configFile:!1,code:!0,cloneInputAst:!0},n=require("@babel/core");if(e.astInfo){if(e.astInfo.type!==types_1.AstType.Babel)throw new Error("ast type is not babel");s=n.transformFromAstSync(e.astInfo.ast,e.sourceCode,r)}else{if(null===e.sourceCode)throw new Error("source.sourceCode is null");s=n.transform(e.sourceCode,r)}}catch(e){throw e.code=config_1.BABEL_TRANS_JS_ERR,e.message=`file: ${o}\n ${e.message}`,e.path=o,e}if(!s)throw new Error("no trans result for callPostEnhance");let n=s.code;const l=s.map;t&&(n=n.replace(/^"use strict";/,""));const a=(0,babel_helper_1.collectBabelHelpers)(e.sourceCode),u=(0,babel_helper_1.replaceBabelHelpers)(n,a,o,r);return{code:u.transformCode,map:l,helpers:u.helpers}}function default_1(e,o){return{name:"summer-es6module",workerMethods:{transformES6ModuleAndGenCode:transformES6ModuleAndGenCode},async generate(e,r,t,{independentRoot:s,isBabelIgnore:n}){if(r.endsWith(".js")&&!e.largeFile&&!n){const r=getBabelRoot(s);return this.runWorkerMethod("transformES6ModuleAndGenCode",e,t,r,o.disableUseStrict)}}}}exports.getBabelRoot=getBabelRoot,exports.transformES6ModuleAndGenCode=transformES6ModuleAndGenCode,exports.default=default_1;
}, function(modId) { var map = {"../../types":1679975017905,"../../../config":1679975017839,"../../../utils/babel_helper":1679975017878,"../../../utils/tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017910, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});const config_1=require("../../config"),javascript_1=require("./base/javascript"),error_1=require("../error"),terser=()=>require("terser"),babelCodeFrame=()=>require("babel-code-frame");function default_1(){return{name:"summer-terser",workerMethods:{doCompress:async(e,r)=>require("terser").minify(e,{toplevel:!0,compress:{drop_console:!1,drop_debugger:!1},sourceMap:r})},async compress(e){const r=Object.keys(e).filter(e=>e.endsWith(".js")),o={};return await Promise.all(r.map(async r=>{if(e[r].length>=javascript_1.MAX_CODE_LENGTH)return o[r]=e[r],void(e[r+".map"]&&(o[r+".map"]=e[r+".map"]));const s=e[r+".map"]?{includeSources:!0,content:JSON.parse(e[r+".map"]),filename:r}:{includeSources:!0,content:void 0,filename:r},a=await this.runWorkerMethod("doCompress",e[r],s);if(a.error){const o=a.error,s=`file: ${r}\n ${a.error.message}\n ${require("babel-code-frame")(e[r],o.line,o.col>0?o.col:1)}`;throw(0,error_1.makeSummerError)(s,config_1.UGLIFY_JS_ERR,r)}o[r]=a.code,a.map&&(o[r+".map"]=a.map)})),Object.assign(Object.assign({},e),o)}}}exports.default=default_1;
}, function(modId) { var map = {"../../config":1679975017839,"./base/javascript":1679975017911,"../error":1679975017901,"terser":1679975017910}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017911, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.MAX_CODE_LENGTH=void 0;const tslib_1=require("tslib"),fs_extra_1=(0,tslib_1.__importDefault)(require("fs-extra")),path_1=(0,tslib_1.__importDefault)(require("path")),jsonParse_1=require("../../../utils/jsonParse"),sourcemap=()=>require("source-map");async function tryGetInputSourceMap(e,t){try{const s=/\/\/[#|@] sourceMappingURL=[\s]*(\S*)[\s]*$/m.exec(e),r=path_1.default.posix.dirname(t),a=path_1.default.posix.basename(t);let o;if(null==s?void 0:s[1])if(/\.js\.map$/.test(s[1]))o=await fs_extra_1.default.readFile(path_1.default.posix.join(r,s[1]),"utf-8");else{const e=s[1].split("base64,")[1];o=Buffer.from(e,"base64").toString()}else{const e=path_1.default.posix.join(r,a+".map");fs_extra_1.default.existsSync(e)&&(o=await fs_extra_1.default.readFile(e,"utf-8"))}if(o){const e=(0,jsonParse_1.jsonParse)(o);new(require("source-map").SourceMapConsumer)(e);return await insertSourcesContent(e,t),e}}catch(e){console.log(`try to get input sourcemap of ${t} catch error ${e}`)}}exports.MAX_CODE_LENGTH=512e3;const insertSourcesContent=async(e,t)=>{if(Array.isArray(e.sources)&&!Array.isArray(e.sourcesContent)){const s=e.sourcesContent;try{const s=path_1.default.posix.dirname(t),r=[],a=e.sources;for(const e of a){const t=await fs_extra_1.default.readFile(path_1.default.posix.join(s,e),"utf-8");r.push(t)}e.sourcesContent=r}catch(t){e.sourcesContent=s}}};function default_1(){return{name:"summer-javascript",async load(e,t){if(t.endsWith(".js")){const e=await fs_extra_1.default.readFile(t,{encoding:"utf-8"}),s=await tryGetInputSourceMap(e,t);return{sourceCode:e,inputMap:null!=s?s:void 0,astInfo:void 0,largeFile:e.length>=exports.MAX_CODE_LENGTH}}}}}exports.default=default_1;
}, function(modId) { var map = {"../../../utils/jsonParse":1679975017846}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017912, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),postcss_1=(0,tslib_1.__importDefault)(require("postcss")),autoprefixer_1=(0,tslib_1.__importDefault)(require("autoprefixer")),cssnano_1=(0,tslib_1.__importDefault)(require("cssnano")),tools_1=require("../../../utils/tools"),config_1=require("../../../config"),log_1=(0,tslib_1.__importDefault)(require("../../../utils/log")),error_1=require("../../error");function default_1(e,r){const{autoPrefix:s=!0,minify:t=!0}=r||{},o=["iOS >= 8","Chrome >= 37"];return{name:"summer-wxss",async optimize(e){const r={};if(s||t)for(const i of Object.keys(e).filter(e=>e.endsWith(".wxss")))try{const u=[];s&&u.push((0,autoprefixer_1.default)({overrideBrowserslist:o,remove:!1})),t&&u.push((0,cssnano_1.default)({preset:["default",{reduceTransforms:!1,calc:!1,minifySelectors:!1,normalizeUrl:!1}]}));const l=await(0,postcss_1.default)(u).process(e[i],{from:(0,tools_1.leading)(i,"/")});r[i]=l.css.replace(/\r\n/g,"\n")}catch(e){throw log_1.default.error(e),(0,error_1.makeSummerError)(e,config_1.POST_WXSS_ERR,i)}return Object.assign(Object.assign({},e),r)}}}process.env.BROWSERSLIST=process.env.BROWSERSLIST||"iOS >= 8, Chrome >= 37",exports.default=default_1;
}, function(modId) { var map = {"../../../utils/tools":1679975017847,"../../../config":1679975017839,"../../../utils/log":1679975017836,"../../error":1679975017901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017913, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),config_1=require("../../config"),log_1=(0,tslib_1.__importDefault)(require("../../utils/log")),error_1=require("../error"),minifyWXMLMod=require("../../core/worker_thread/task/minifywxml"),{generateWXMLFromTokens:generateWXMLFromTokens,Tokenizer:Tokenizer}=minifyWXMLMod;function default_1(e,r){const{minify:o=!0}=r||{};return{name:"summer-minifywxml",workerMethods:{async doCompress(e,r){try{const o=new Tokenizer(e.replace(/\r\n/g,"\n"),r),t=[],n=o.generateTokens(t);if(0!==n)throw new Error("minifywxml tokenizer error ret: "+n);return generateWXMLFromTokens(t)}catch(e){throw log_1.default.error(e),(0,error_1.makeSummerError)(e.msg,config_1.MINIFY_WXML_ERR,r)}}},async compress(e){const r={};if(o){const o=Object.keys(e).filter(e=>e.endsWith(".wxml"));await Promise.all(o.map(async o=>{const t=e[o];if(t&&t.length>0){const t=await this.runWorkerMethod("doCompress",e[o],o);r[o]=t}}))}return Object.assign(Object.assign({},e),r)}}}exports.default=default_1;
}, function(modId) { var map = {"../../config":1679975017839,"../../utils/log":1679975017836,"../error":1679975017901,"../../core/worker_thread/task/minifywxml":1679975017899}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017914, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getAppJSON=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),cache_1=require("../../../utils/cache"),lodash_1=require("lodash"),getAppJSON_1=require("./getAppJSON"),getExtJSON_1=require("./getExtJSON"),projectconfig_1=require("../projectconfig"),common_1=require("../../../utils/common"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),theme_1=require("../theme"),reactiveCache_1=require("../reactiveCache"),tools_1=require("../../../utils/tools");function mergeExtJSON(e,t){if(t)for(const o in t)if("__warning__"!==o){if("extPages"!==o){if("plugins"===o||"supportedMaterials"===o){e[o]=t[o];continue}"object"===(0,tools_1.getType)(t[o])?"object"!==(0,tools_1.getType)(e[o])?e[o]=Object.assign({},t[o]):e[o]=Object.assign({},e[o]||{},t[o]):e[o]=t[o]}}else e.__warning__=e.__warning__?`${e.__warning__}、${t.__warning__}`:t.__warning__}exports.getAppJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.COMPILED_APP_JSON,e=>{const t=(0,projectconfig_1.getProjectConfigJSON)(e),{miniprogramRoot:o=""}=t;let i=(0,getAppJSON_1.getAppJSON)(e);const r=(0,getExtJSON_1.getExtJSON)(e);if(r&&(i=(0,lodash_1.cloneDeep)(i),mergeExtJSON(i,r),r.extEnable))try{const t=(0,theme_1.getThemeLocation)(e);let r={};t&&(r=(0,theme_1.checkThemeJSON)(e,{themeLocation:t}));const _=(0,theme_1.mergeThemeJSONToAppJSON)(r,i);(0,getAppJSON_1.checkAppJSON)({project:e,miniprogramRoot:o,inputJSON:_.appJSONLight,filePath:path_1.default.posix.join(o,"app.json")}),(0,getAppJSON_1.checkAppJSON)({project:e,miniprogramRoot:o,inputJSON:_.appJSONDark,filePath:path_1.default.posix.join(o,"app.json")})}catch(e){(0,common_1.throwError)({msg:e.message,code:e.code,filePath:`app.json ${locales_1.default.config.OR} ext.json`})}return i});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/cache":1679975017855,"./getAppJSON":1679975017854,"./getExtJSON":1679975017915,"../projectconfig":1679975017851,"../../../utils/common":1679975017852,"../../../utils/locales/locales":1679975017841,"../theme":1679975017867,"../reactiveCache":1679975017856,"../../../utils/tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017915, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getExtJSON=void 0;const tslib_1=require("tslib"),cache_1=require("../../../utils/cache"),common_1=require("../common"),common_2=require("../../../utils/common"),lodash_1=require("lodash"),tools_1=require("../../../utils/tools"),path_1=(0,tslib_1.__importDefault)(require("path")),projectconfig_1=require("../projectconfig"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),schemaValidate_1=require("../../validate/schemaValidate"),theme_1=require("../theme"),checkAppFields_1=require("./checkAppFields"),reactiveCache_1=require("../reactiveCache");function checkExtPages(e){const{project:o,inputJSON:r,filePath:t,miniprogramRoot:c}=e,{extPages:a}=r;if(a)for(const e in a){const r=a[e];if(r){r.navigationBarBackgroundColor&&!(0,tools_1.isHexColor)(r.navigationBarBackgroundColor)&&(0,common_2.throwError)({msg:`["extPages"]["${e}"]["navigationBarBackgroundColor"]: "${r.navigationBarBackgroundColor}" is not hexColor`,filePath:t}),r.backgroundColor&&!(0,tools_1.isHexColor)(r.backgroundColor)&&(0,common_2.throwError)({msg:`["extPages"]["${e}"]["backgroundColor"]: "${r.backgroundColor}" is not hexColor`,filePath:t});try{(0,checkAppFields_1.checkComponentPath)({project:o,miniprogramRoot:c,inputJSON:r,filePath:e+".json"})}catch(o){(0,common_2.throwError)({msg:`["extPages"]["${e}"]${o.message}`,filePath:t})}}}}exports.getExtJSON=(0,reactiveCache_1.wrapCompileJSONFunc)(cache_1.CACHE_KEY.EXT_JSON,e=>{const o=(0,projectconfig_1.getProjectConfigJSON)(e),{miniprogramRoot:r=""}=o,t=e.attrSync(),c=(0,tools_1.normalizePath)(path_1.default.posix.join(r,"ext.json"));if(!t||!t.platform)return e.stat(r,"ext.json")?{__warning__:locales_1.default.config.EXT_JSON_INVALID.format(e.appid,"https://developers.weixin.qq.com/miniprogram/dev/devtools/ext.html")}:void 0;if(!e.stat(r,"ext.json"))return;const a=e.getFile(r,"ext.json"),i=(0,common_1.checkJSONFormat)((0,common_2.checkUTF8)(a,c),c);if(!i.extEnable)return{};const n=(0,theme_1.getThemeLocation)(e);let l={};n&&(l=(0,theme_1.checkThemeJSON)(e,{themeLocation:n}));const s=(0,theme_1.mergeThemeJSONToAppJSON)(l,i),p=(0,schemaValidate_1.schemaValidate)("ext",s.appJSONLight),_=(0,schemaValidate_1.schemaValidate)("ext",s.appJSONDark);if(p.warning&&(i.__warning__=locales_1.default.config.INVALID.format(p.warning)),_.warning&&(i.__warning__=locales_1.default.config.INVALID.format(_.warning)),p.error.length||_.error.length){const e=p.error.map(e=>"type"===e.errorType||"enum"===e.errorType||"anyOf"===e.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([e.errorProperty,e.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([e.requireProperty])),o=_.error.map(e=>"type"===e.errorType||"enum"===e.errorType||"anyOf"===e.errorType?locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([e.errorProperty,e.correctType]):locales_1.default.config.SHOULD_NOT_BE_EMPTY.format([e.requireProperty])),r=e.concat(o).join("\n");(0,common_2.throwError)({msg:r,filePath:c})}i.extAppid||(0,common_2.throwError)({msg:""+locales_1.default.config.EXT_APPID_SHOULD_NOT_BE_EMPTY,filePath:c});const h={filePath:c,project:e,miniprogramRoot:r,inputJSON:i},m=(0,lodash_1.cloneDeep)(h);m.inputJSON=s.appJSONLight,m.mode="light";const g=(0,lodash_1.cloneDeep)(h);return g.inputJSON=s.appJSONDark,g.mode="dark",(0,checkAppFields_1.checkMainPkgPages)(h),(0,checkAppFields_1.checkMainPkgPages)(h),(0,checkAppFields_1.checkSubpackages)(h),(0,checkAppFields_1.checkTabbar)(m),(0,checkAppFields_1.checkTabbar)(g),(0,checkAppFields_1.checkWorkers)(h),(0,checkAppFields_1.checkFunctionalPages)(h),(0,checkAppFields_1.checkOpenLocationPagePath)(h),(0,checkAppFields_1.checkPlugins)(h),(0,checkAppFields_1.checkWindow)(m),(0,checkAppFields_1.checkWindow)(g),(0,checkAppFields_1.checkComponentPath)(h),checkExtPages(h),i});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/cache":1679975017855,"../common":1679975017853,"../../../utils/common":1679975017852,"../../../utils/tools":1679975017847,"../projectconfig":1679975017851,"../../../utils/locales/locales":1679975017841,"../../validate/schemaValidate":1679975017857,"../theme":1679975017867,"./checkAppFields":1679975017869,"../reactiveCache":1679975017856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017916, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.cleanCache=exports.mergeThemeJSONToPageJSON=exports.mergeThemeJSONToAppJSON=exports.schemaValidate=exports.checkThemeJSON=exports.getPluginPageJSON=exports.getPluginJSON=exports.getGameJSON=exports.compile=exports.compileJS=exports.getPageJSON=exports.getAppJSON=exports.setLocale=exports.setFSAgent=exports.partialAnalyse=void 0;const tslib_1=require("tslib"),index_1=require("./core/compile/index");Object.defineProperty(exports,"compile",{enumerable:!0,get:function(){return index_1.compile}});const app_1=require("./core/json/app"),getPageJSON_1=require("./core/json/page/getPageJSON");Object.defineProperty(exports,"getPageJSON",{enumerable:!0,get:function(){return getPageJSON_1.getPageJSON}});const js_1=require("./core/compile/handler/js");Object.defineProperty(exports,"compileJS",{enumerable:!0,get:function(){return js_1.compileJS}});const plugin_1=require("./core/json/plugin/plugin");Object.defineProperty(exports,"getPluginJSON",{enumerable:!0,get:function(){return plugin_1.getDevPluginJSON}});const plugin_page_1=require("./core/json/plugin/plugin_page");Object.defineProperty(exports,"getPluginPageJSON",{enumerable:!0,get:function(){return plugin_page_1.getPluginPageJSON}});const cache_1=require("./utils/cache"),theme_1=require("./core/json/theme");Object.defineProperty(exports,"checkThemeJSON",{enumerable:!0,get:function(){return theme_1.checkThemeJSON}}),Object.defineProperty(exports,"mergeThemeJSONToAppJSON",{enumerable:!0,get:function(){return theme_1.mergeThemeJSONToAppJSON}}),Object.defineProperty(exports,"mergeThemeJSONToPageJSON",{enumerable:!0,get:function(){return theme_1.mergeThemeJSONToPageJSON}});const schemaValidate_1=require("./core/validate/schemaValidate");Object.defineProperty(exports,"schemaValidate",{enumerable:!0,get:function(){return schemaValidate_1.schemaValidate}});const reactiveCache_1=require("./core/json/reactiveCache"),fs_1=(0,tslib_1.__importDefault)(require("./utils/fs")),locales_1=(0,tslib_1.__importDefault)(require("./utils/locales/locales")),game_1=(0,tslib_1.__importDefault)(require("./core/json/game"));function setFSAgent(e){fs_1.default.setAgent(e)}async function getAppJSON(e){try{const t=(0,reactiveCache_1.tryToGetReactiveProject)(e);return await t.updateProject(),(0,app_1.getAppJSON)(e)}catch(e){throw console.error("getAppJSON error",e),e}}async function getGameJSON(e){try{const t=(0,reactiveCache_1.tryToGetReactiveProject)(e);return await t.updateProject(),(0,game_1.default)(e)}catch(e){throw console.error("getGameJSON error",e),e}}function cleanCache(){cache_1.cacheManager.clean()}exports.partialAnalyse=(0,tslib_1.__importStar)(require("./core/analyse/partial")),exports.setFSAgent=setFSAgent,exports.setLocale=locales_1.default.setLocale,exports.getAppJSON=getAppJSON,exports.getGameJSON=getGameJSON,exports.cleanCache=cleanCache;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./core/compile/index":1679975017871,"./core/json/app":1679975017914,"./core/json/page/getPageJSON":1679975017917,"./core/compile/handler/js":1679975017879,"./core/json/plugin/plugin":1679975017868,"./core/json/plugin/plugin_page":1679975017919,"./utils/cache":1679975017855,"./core/json/theme":1679975017867,"./core/validate/schemaValidate":1679975017857,"./core/json/reactiveCache":1679975017856,"./utils/fs":1679975017848,"./utils/locales/locales":1679975017841,"./core/json/game":1679975017873,"./core/analyse/partial":1679975017920}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017917, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getPageJSON=exports.originGetPageJSON=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),lodash_1=require("lodash"),getExtJSON_1=require("../app/getExtJSON"),app_1=require("../app"),tools_1=require("../../../utils/tools"),checkPageJSON_1=require("./checkPageJSON"),common_1=require("../common"),common_2=require("../../../utils/common"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),reactiveCache_1=require("../reactiveCache"),spreadUsingComponent=e=>{const{project:t,pagePath:o,inputJSON:n}=e;if(o.includes("miniprogram_npm"))return;const i=(0,app_1.getAppJSON)(t);if((0,common_1.checkPagePathIsInIndependentSubpackage)(i,o))return;if(i.componentPlaceholder){n.componentPlaceholder=n.componentPlaceholder||{};for(const e in i.componentPlaceholder)n.componentPlaceholder[e]=n.componentPlaceholder[e]||i.componentPlaceholder[e]}const c=Object.assign({},i.usingComponents);if(0!==Object.keys(c).length){n.usingComponents||(n.usingComponents={});for(const e in c){if(n.usingComponents[e])continue;const t=c[e]||"";if(t.startsWith("/")||t.startsWith("plugin://")){n.usingComponents[e]=t;continue}const i=(0,tools_1.normalizePath)(path_1.default.posix.relative(path_1.default.posix.dirname(o),t));n.usingComponents[e]=i.startsWith(".")?i:"./"+i}}},mergeExtJSON=e=>{var t;const{project:o,inputJSON:n,pagePath:i}=e,c=(0,getExtJSON_1.getExtJSON)(o);(null===(t=null==c?void 0:c.extPages)||void 0===t?void 0:t[i])&&Object.assign(n,c.extPages[i])},checkComponentPath=e=>{const{project:t,miniprogramRoot:o,pagePath:n,inputJSON:i}=e;(0,common_1.checkComponentPath)({project:t,root:o,relativePath:n+".json",inputJSON:i})},checkComponentGenerics=e=>{const{pagePath:t,inputJSON:o}=e,n=t+".json";if(!o.componentGenerics)return;const i=[];for(const e in o.componentGenerics){const t=o.componentGenerics[e],n=(0,tools_1.getType)(t);"boolean"===n||"object"===n?"object"===n&&"string"!==(0,tools_1.getType)(t.default)&&i.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([`["componentGenerics"]["${e}"]["default"]`,"string"])):i.push(locales_1.default.config.JSON_CONTENT_SHOULD_BE.format([`["componentGenerics"]["${e}"]`,"boolean/object"]))}i.length>0&&(0,common_2.throwError)({msg:i.join("\n"),filePath:n})};function checkRenderer(e){const{filePath:t,inputJSON:o}=e,{renderer:n}=o,i=(0,app_1.getAppJSON)(e.project);(0,common_2.getAllPages)(i).includes(e.pagePath)&&("skyline"===n&&"requiredComponents"!==i.lazyCodeLoading&&(0,common_2.throwError)({msg:locales_1.default.config.APP_JSON_SHOULD_SET_LAZYCODELOADING.format(t),filePath:t}),("skyline"===n||"skyline"===i.renderer&&"webview"!==n)&&(o.disableScroll=!0,o.navigationStyle="custom"))}const compilePageJSON=e=>{mergeExtJSON(e),checkComponentGenerics(e),checkComponentPath(e),spreadUsingComponent(e),checkRenderer(e)};function originGetPageJSON(e,t){const{pagePath:o,miniprogramRoot:n=""}=t,i=(0,tools_1.normalizePath)(path_1.default.posix.join(n,o+".json")),c=(0,reactiveCache_1.tryToGetReactiveJSONCompiler)(e),r=(0,lodash_1.cloneDeep)(c.getPageJSON("checked",t));return compilePageJSON({project:e,miniprogramRoot:n,inputJSON:r,filePath:i,pagePath:o}),r.usingComponents||(r.usingComponents={}),r}async function getPageJSON(e,t){const o=(0,reactiveCache_1.tryToGetReactiveProject)(e);return(0,reactiveCache_1.tryToGetReactiveJSONCompiler)(o).getPageJSON("compiled",t)}exports.originGetPageJSON=originGetPageJSON,reactiveCache_1.ReactiveJSONCompiler.setOriginCheckPageJSON(checkPageJSON_1.checkPageJSON),reactiveCache_1.ReactiveJSONCompiler.setOriginGetPageJSON(originGetPageJSON),exports.getPageJSON=getPageJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../app/getExtJSON":1679975017915,"../app":1679975017914,"../../../utils/tools":1679975017847,"./checkPageJSON":1679975017918,"../common":1679975017853,"../../../utils/common":1679975017852,"../../../utils/locales/locales":1679975017841,"../reactiveCache":1679975017856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017918, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkPageJSON=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),common_1=require("../common"),schemaValidate_1=require("../../validate/schemaValidate"),tools_1=require("../../../utils/tools"),common_2=require("../../../utils/common"),theme_1=require("../theme"),checkHexColor=e=>{const{inputJSON:o,mode:a,pagePath:t,themeLocation:r}=e;let i=t+".json";if(o){r&&(i=`${t}.json or ${r}["${a}"]`);const{navigationBarBackgroundColor:e,backgroundColor:n}=o;void 0===e||(0,tools_1.isHexColor)(e)||(0,common_2.throwError)({msg:`["navigationBarBackgroundColor"]: "${e}" is not hexColor`,filePath:i}),void 0===n||(0,tools_1.isHexColor)(n)||(0,common_2.throwError)({msg:`["backgroundColor"]: "${n}" is not hexColor`,filePath:i})}};function checkPageJSON(e,o){const{pagePath:a,miniprogramRoot:t=""}=o;let r=(0,tools_1.normalizePath)(path_1.default.posix.join(t,a+".json"));if(!e.stat("",r))return{};const i=e.getFile("",r),n=(0,common_1.checkJSONFormat)((0,common_2.checkUTF8)(i,r),r),l=(0,theme_1.getThemeLocation)(e);if(!l){const e=(0,common_1.getPageJSONVariableDecalearProperty)(n);e.length&&(0,common_2.throwError)({msg:'["themeLocation"] is required because:\n'+e.map(e=>`"${e.value}" as variable was declared at ${r}:${e.property}`).join("\n"),filePath:r})}let c={light:{},dark:{}};l&&(c=(0,theme_1.checkThemeJSON)(e,{themeLocation:l}));const m=(0,theme_1.mergeThemeJSONToPageJSON)(c,n,r),h=(0,schemaValidate_1.schemaValidate)("page",m.pageJSONLight),s=(0,schemaValidate_1.schemaValidate)("page",m.pageJSONDark),g=(0,common_1.getPageJSONVariableDecalearProperty)(m.pageJSONLight);g.length&&(0,common_2.throwError)({msg:g.map(e=>`"${e.value}" as variable was declared at ${r}:${e.property}, but not found at ${l}["light"]`).join("\n"),filePath:r});const _=(0,common_1.getPageJSONVariableDecalearProperty)(m.pageJSONDark);if(_.length&&(0,common_2.throwError)({msg:_.map(e=>`"${e.value}" as variable was declared at ${r}:${e.property}, but not found at ${l}["dark"]`).join("\n"),filePath:r}),h.warning&&(n.__warning__=locales_1.default.config.INVALID.format(h.warning)),l&&s.warning&&(n.__warning__=locales_1.default.config.INVALID.format(s.warning)),h.error.length){const e=(0,common_1.transValidateResult)(h);l&&(r+=` or ${l}["light"]`),(0,common_2.throwError)({msg:e,filePath:r})}if(l&&s.error.length){const e=(0,common_1.transValidateResult)(s);l&&(r+=` or ${l}["dark"]`),(0,common_2.throwError)({msg:e,filePath:r})}return checkHexColor({inputJSON:m.pageJSONLight,mode:"light",themeLocation:l||"",filePath:r,pagePath:a}),checkHexColor({inputJSON:m.pageJSONDark,mode:"dark",themeLocation:l||"",filePath:r,pagePath:a}),n}exports.checkPageJSON=checkPageJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/locales/locales":1679975017841,"../common":1679975017853,"../../validate/schemaValidate":1679975017857,"../../../utils/tools":1679975017847,"../../../utils/common":1679975017852,"../theme":1679975017867}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017919, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getPluginPageJSON=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),common_1=require("../common"),schemaValidate_1=require("../../validate/schemaValidate"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),common_2=require("../../../utils/common"),plugin_1=require("./plugin"),theme_1=require("../theme"),spreadUsingComponent=async(e,t)=>{const{project:a,root:o,filePath:n}=t,i=path_1.default.posix.relative(o,n);if(n.includes("miniprogram_npm/"))return;const r=await(0,plugin_1.getDevPluginJSON)(a,!0),s=Object.assign({},r.usingComponents);if(0!==Object.keys(s).length){e.usingComponents||(e.usingComponents={});for(const t in s){if(e.usingComponents[t])continue;const a=s[t]||"";if(a.startsWith("/")||a.startsWith("plugin://")){e.usingComponents[t]=a;continue}const o=path_1.default.posix.normalize(path_1.default.posix.relative(path_1.default.posix.dirname(i),a));e.usingComponents[t]=o.startsWith(".")?o:"./"+o}}};async function checkComponentPath(e,t){const{project:a,root:o,filePath:n}=t;await(0,common_1.checkComponentPath)({project:a,root:o,relativePath:path_1.default.posix.relative(o,n),inputJSON:e})}async function getPluginPageJSON(e){const{project:t}=e;let a=e.filePath;if(!t.stat("",a))return{};const o=await t.getFile("",a),n=(0,common_1.checkJSONFormat)((0,common_2.checkUTF8)(o,a),a),i=await(0,theme_1.getPluginThemeLocation)(t);if(!i){const e=(0,common_1.getPageJSONVariableDecalearProperty)(n);e.length&&(0,common_2.throwError)({msg:'pluginJSON["themeLocation"] is required because:\n'+e.map(e=>`"${e.value}" as variable was declared at ${a}:${e.property}`).join("\n"),filePath:a})}let r={light:{},dark:{}};i&&(r=await(0,theme_1.checkThemeJSON)(t,{themeLocation:i,isPlugin:!0}));const s=(0,theme_1.mergeThemeJSONToPageJSON)(r,n,a),l=(0,schemaValidate_1.schemaValidate)("page",s.pageJSONLight),c=(0,schemaValidate_1.schemaValidate)("page",s.pageJSONDark);if(l.warning&&(n.__warning__=locales_1.default.config.INVALID.format(l.warning)),i&&c.warning&&(n.__warning__=locales_1.default.config.INVALID.format(c.warning)),l.error.length){const e=(0,common_1.transValidateResult)(l);i&&(a+=` or ${i}["light"]`),(0,common_2.throwError)({msg:e,filePath:a})}if(i&&c.error.length){const e=(0,common_1.transValidateResult)(c);i&&(a+=` or ${i}["dark"]`),(0,common_2.throwError)({msg:e,filePath:a})}return await checkComponentPath(n,e),await spreadUsingComponent(n,e),n}exports.getPluginPageJSON=getPluginPageJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../common":1679975017853,"../../validate/schemaValidate":1679975017857,"../../../utils/locales/locales":1679975017841,"../../../utils/common":1679975017852,"./plugin":1679975017868,"../theme":1679975017867}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017920, function(require, module, exports) {
!function(require, directRequire){
function findAllDescendant(e,t){let n;n=Array.isArray(e)?e:[e];const s=n.slice(0),a=[],o=[];for(;s.length>0;){const e=s.pop();a.push(e),e.childModules.forEach(e=>{s.indexOf(e)<0&&a.indexOf(e)<0&&(s.push(e),e.type===t&&o.push(e))})}return o}function findModsByType(e,t){var n;return(null===(n=null==e?void 0:e.graph)||void 0===n?void 0:n.modules.filter(e=>e.type===t))||[]}function findModByTypeAndPath(e,t,n){var s;return null===(s=e.graph)||void 0===s?void 0:s.modules.find(e=>e.type===t&&e.path===n)}function findPageMods(e,t){return(findModsByType(e,"Page")||[]).filter(e=>t.includes(e.path.replace(/\.json$/,"")))}function findGlobalCompMods(e){const t=findModByTypeAndPath(e,"MainPackage","app.json");return(null==t?void 0:t.childModules.filter(e=>"Component"===e.type))||[]}function getAllSubpackagePath(e){return findModsByType(e,"SubPackage").map(e=>e.path)}function innerGetSortedJSFiles(e,t){const n=new Set,s=new Set,a=new Set,o=[];for(const t of e){const e=t.findChild("Js");e&&(t.config?a.add(e.path):s.add(e.path),n.add(e.path),o.push(e))}const i=findAllDescendant(e.concat(t),"Component");for(const e of i.concat(t)){const t=e.findChild("Js");t&&(a.add(t.path),n.add(t.path),o.push(t))}const l=findAllDescendant(o,"Js");for(const e of l){const t=e.path;n.add(t)}return{allFiles:Array.from(n),pageFiles:Array.from(s),componentFiles:Array.from(a)}}function groupBySubpackage(e,t){const n=[],s={};for(const a of e){const e=t.find(e=>a.startsWith(e));e?(s[e]||(s[e]=[]),s[e].push(a)):n.push(a)}return{main:n,subs:s}}function partialGetSubPkgSortedJSFiles(e,t,n){const s=findPageMods(e,t);let{allFiles:a,pageFiles:o,componentFiles:i}=innerGetSortedJSFiles(s,[]);const l=getAllSubpackagePath(e);return{allFiles:groupBySubpackage(a,l).subs[n]||[],pageFiles:groupBySubpackage(o,l).subs[n]||[],componentFiles:groupBySubpackage(i,l).subs[n]||[]}}function partialGetMainPkgSortedJSFiles(e,t){const n=findPageMods(e,t),s=findGlobalCompMods(e);let{allFiles:a,pageFiles:o,componentFiles:i}=innerGetSortedJSFiles(n,s),l=!1;const p=findModByTypeAndPath(e,"Js","app.js");if(p){l=!0,a.push(p.path);const e=findAllDescendant([p],"Js");for(const t of e){const e=t.path;a.indexOf(e)<0&&a.push(e)}}const r=getAllSubpackagePath(e);return{hasAppJS:l,allFiles:groupBySubpackage(a,r).main,pageFiles:groupBySubpackage(o,r).main,componentFiles:groupBySubpackage(i,r).main}}function partialWholePkgGetSortedJSFiles(e,t){const n=findPageMods(e,t),s=findGlobalCompMods(e);let{allFiles:a,pageFiles:o,componentFiles:i}=innerGetSortedJSFiles(n,s),l=!1;const p=findModByTypeAndPath(e,"Js","app.js");if(p){l=!0,a.push(p.path);const e=findAllDescendant([p],"Js");for(const t of e){const e=t.path;a.indexOf(e)<0&&a.push(e)}}return{hasAppJS:l,allFiles:a,pageFiles:o,componentFiles:i}}function innerGetResourceFiles(e,t){let n=[];for(const s of e){n=findAllDescendant(e,t).map(e=>e.path)}return n}function partialGetWxmlAndWxsFiles(e,t,n){const s=findPageMods(e,t),a=findGlobalCompMods(e),o=innerGetResourceFiles(s.concat(a),"Wxml"),i=innerGetResourceFiles(s.concat(a),"Wxs"),l=getAllSubpackagePath(e),p=groupBySubpackage(o,l),r=groupBySubpackage(i,l);return{wxmlFiles:n?p.main.concat(p.subs[n]||[]):p.main,wxsFiles:n?r.main.concat(r.subs[n]||[]):r.main}}function partialGetWxssFiles(e,t,n){const s=findPageMods(e,t),a=findGlobalCompMods(e),o=innerGetResourceFiles(s.concat(a),"Wxss"),i=findModByTypeAndPath(e,"Wxss","app.wxss");if(i&&!o.includes(i.path)){o.push(i.path);const e=findAllDescendant(i,"Wxss");for(const t of e)o.includes(t.path)||o.push(t.path)}const l=groupBySubpackage(o,getAllSubpackagePath(e));return n?l.main.concat(l.subs[n]||[]):l.main}function partialGetCodeFiles(e,t){const n=new Set,s=findModByTypeAndPath(e,"MainPackage","app.json");n.add("app.json");const a=new Set;function o(e){switch(a.add(e),e.type){case"Page":case"Component":case"Wxml":case"Wxss":case"Wxs":case"Js":case"Config":n.add(e.path)}for(const t of e.childModules)a.has(t)||o(t)}for(const e of null==s?void 0:s.childModules)if("Page"===e.type)t.includes(e.path.replace(/\.json$/,""))&&o(e);else if("SubPackage"===e.type)for(const n of e.childModules)t.includes(n.path.replace(/\.json$/,""))&&o(n);else o(e);return console.log("[partial-compile] compile",n),Array.from(n)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.partialGetCodeFiles=exports.partialGetWxssFiles=exports.partialGetWxmlAndWxsFiles=exports.partialWholePkgGetSortedJSFiles=exports.partialGetMainPkgSortedJSFiles=exports.partialGetSubPkgSortedJSFiles=exports.findAllDescendant=void 0,exports.findAllDescendant=findAllDescendant,exports.partialGetSubPkgSortedJSFiles=partialGetSubPkgSortedJSFiles,exports.partialGetMainPkgSortedJSFiles=partialGetMainPkgSortedJSFiles,exports.partialWholePkgGetSortedJSFiles=partialWholePkgGetSortedJSFiles,exports.partialGetWxmlAndWxsFiles=partialGetWxmlAndWxsFiles,exports.partialGetWxssFiles=partialGetWxssFiles,exports.partialGetCodeFiles=partialGetCodeFiles;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017921, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compileWXSS=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),tools_1=require("../../../utils/tools"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),config_1=require("../../../config"),taskstatus_1=require("../../../utils/taskstatus"),worker_thread_1=require("../../worker_thread"),common_1=require("../../../utils/common");async function compileWXSS(e,t,o){const{root:r="",setting:i={},onProgressUpdate:s=(()=>{}),devToolsCompileCache:a}=o,{minify:l,minifyWXSS:_,autoPrefixWXSS:c}=i,n=new taskstatus_1.TaskStatus(t),u=path_1.default.posix.join(r,t),f=await e.getFile(r,t);if(!l&&!_&&!c){s(n);const e=(0,tools_1.bufferToUtf8String)(f);return void 0===e&&(0,common_1.throwError)({msg:locales_1.default.config.FILE_NOT_UTF8.format(u),code:config_1.FILE_NOT_UTF8,filePath:u}),n.done(),s(n),{filePath:t,code:e}}async function d(){const o=await(0,worker_thread_1.runTask)(worker_thread_1.TASK_NAME.COMPILE_WXSS,{projectPath:e.projectPath,root:r,filePath:t,setting:i,code:f},e=>{e===worker_thread_1.ETaskStatus.progress?s(n):e===worker_thread_1.ETaskStatus.done&&(n.done(),s(n))});return o.error&&(0,common_1.throwError)({msg:o.error.message,code:o.error.code,filePath:u}),o.code}let h="";if(a){const o=(0,tools_1.normalizePath)(path_1.default.posix.join(e.projectPath,r,t)),s=`${o}_${JSON.stringify(i)}`;h=await a.getFile(o,s),h&&!i.codeProtect||(h=await d(),a.setFile(o,h,s))}else h=await d();return{filePath:t,code:h}}exports.compileWXSS=compileWXSS;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/tools":1679975017847,"../../../utils/locales/locales":1679975017841,"../../../config":1679975017839,"../../../utils/taskstatus":1679975017880,"../../worker_thread":1679975017881,"../../../utils/common":1679975017852}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017922, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compileWXML=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),tools_1=require("../../../utils/tools"),locales_1=(0,tslib_1.__importDefault)(require("../../../utils/locales/locales")),config_1=require("../../../config"),taskstatus_1=require("../../../utils/taskstatus"),worker_thread_1=require("../../worker_thread"),common_1=require("../../../utils/common");async function compileWXML(e,r,t){const{root:o="",setting:s={},onProgressUpdate:i=(()=>{})}=t,{minify:a,minifyWXML:_}=s,l=new taskstatus_1.TaskStatus(r),c=path_1.default.posix.join(o,r),n=await e.getFile(o,r);if(!a&&!_){i(l);const e=(0,tools_1.bufferToUtf8String)(n);return void 0===e&&(0,common_1.throwError)({msg:locales_1.default.config.FILE_NOT_UTF8.format(c),code:config_1.FILE_NOT_UTF8,filePath:c}),l.done(),i(l),{filePath:r,code:e.replace(/\r\n/g,"\n")}}const u=await(0,worker_thread_1.runTask)(worker_thread_1.TASK_NAME.MINIFY_WXML,{projectPath:e.projectPath,root:o,filePath:r,setting:s,code:n},e=>{e===worker_thread_1.ETaskStatus.progress?i(l):e===worker_thread_1.ETaskStatus.done&&(l.done(),i(l))});return u.error&&(0,common_1.throwError)({msg:u.error.message,code:u.error.code,filePath:c}),{filePath:r,code:u.code.replace(/\r\n/g,"\n")}}exports.compileWXML=compileWXML;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../../utils/tools":1679975017847,"../../../utils/locales/locales":1679975017841,"../../../config":1679975017839,"../../../utils/taskstatus":1679975017880,"../../worker_thread":1679975017881,"../../../utils/common":1679975017852}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017923, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getAllPluginSignatures=exports.isPathValid=exports.getAllPluginsWithPath=exports.friendlyPathMake=exports.trailing=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),game_1=(0,tslib_1.__importDefault)(require("./game")),fs_extra_1=(0,tslib_1.__importDefault)(require("fs-extra")),tools_1=require("../../utils/tools"),log_1=(0,tslib_1.__importDefault)(require("../../utils/log")),trailing=(t,e)=>t.endsWith(e)?t:t+e;exports.trailing=trailing;const friendlyPathMake=(t,e)=>path_1.default.normalize(path_1.default.join(t,e.replace(/\\/g,"/")).replace(/^\/+/,""));async function getAllPluginsWithPath(t){const e=await(0,game_1.default)(t),i=[],a=(t,e="")=>{if(t.plugins)for(const a in t.plugins){if(!t.plugins.hasOwnProperty(a))continue;const r=t.plugins[a];r&&"string"==typeof r.path&&i.push({alias:a,version:r.version||"",provider:r.provider||"",path:r.path,friendlyPath:(0,exports.friendlyPathMake)(e,r.path)})}};a(e,"");const r=e.subPackages||e.subpackages;if(Array.isArray(r))for(const t of r)t&&"string"==typeof t.root&&a(t,t.root);return i}function isPathValid(t,e){if(e=e.replace(/\\/g,"/"),t=t.replace(/\\/g,"/"),e.includes("../")||e.endsWith("/.."))return!1;const i=(0,tools_1.normalizePath)(path_1.default.join(t,e)),a=(0,tools_1.normalizePath)(t);return!!i.startsWith(a)}async function getAllPluginSignatures(t){const e=await getAllPluginsWithPath(t),i=[];let a=t.miniprogramRoot?path_1.default.join(t.projectPath,t.miniprogramRoot):t.projectPath;a=(0,tools_1.normalizePath)(a),a=a.endsWith("/")?a:a+"/";for(const t of e)try{const e=path_1.default.join(a,t.friendlyPath);let r=await fs_extra_1.default.pathExists(e);if(!r)continue;const n=await fs_extra_1.default.stat(e);let l=e;n.isDirectory()||(l=path_1.default.dirname(e));const s=path_1.default.join(l,"signature.json");if(r=await fs_extra_1.default.pathExists(s),!r)continue;const o=await fs_extra_1.default.readFile(s,"utf8");let u=null;try{u=JSON.parse(o)}catch(t){log_1.default.error(t);continue}if(!u||!Array.isArray(u.signature))continue;const p=[];for(let t=0;t<u.signature.length;t++){const e=u.signature[t];if(!e)continue;if("string"!=typeof e.path||"string"!=typeof e.md5)continue;if(!isPathValid(l,e.path))continue;const i=path_1.default.join(l,e.path);p.push({fullPath:i,md5:e.md5})}i.push({provider:t.provider,fullPath:e,signature:p})}catch(t){log_1.default.error(t);continue}return i}exports.friendlyPathMake=friendlyPathMake,exports.getAllPluginsWithPath=getAllPluginsWithPath,exports.isPathValid=isPathValid,exports.getAllPluginSignatures=getAllPluginSignatures;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./game":1679975017873,"../../utils/tools":1679975017847,"../../utils/log":1679975017836}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017924, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWhiteExtList=exports.GameWhiteList=exports.MiniProgramWhiteList=void 0;const tslib_1=require("tslib"),url_config_1=require("./url_config"),request_1=require("./request"),log_1=(0,tslib_1.__importDefault)(require("./log")),jsonParse_1=require("./jsonParse");let cacheResult;async function getWhiteExtList(){if(cacheResult)return cacheResult;try{const{body:t}=await(0,request_1.request)({url:url_config_1.GET_WHITE_EXT_LIST,method:"get"}),e=(0,jsonParse_1.jsonRespParse)(t,url_config_1.GET_WHITE_EXT_LIST);if(0===e.errCode&&e.data)return cacheResult={GameWhiteList:new Set(e.data.game||exports.GameWhiteList),MiniProgramWhiteList:new Set(e.data.miniProgram||exports.MiniProgramWhiteList)},cacheResult}catch(t){log_1.default.error("get white ext list fail "+t)}return{GameWhiteList:new Set(exports.GameWhiteList),MiniProgramWhiteList:new Set(exports.MiniProgramWhiteList)}}exports.MiniProgramWhiteList=[".wxml",".wxss",".wxs",".png",".jpg",".jpeg",".gif",".svg",".js",".json",".cer",".mp3",".aac",".m4a",".mp4",".wav",".ogg",".silk",".wasm",".br",".cur",".ico",".skel",".crt",".cert"],exports.GameWhiteList=[".png",".jpg",".jpeg",".gif",".svg",".js",".json",".cer",".obj",".dae",".fbx",".mtl",".stl",".3ds",".mp3",".pvr",".wav",".plist",".ttf",".fnt",".gz",".ccz",".m4a",".mp4",".bmp",".atlas",".swf",".ani",".part",".proto",".bin",".sk",".mipmaps",".txt",".zip",".ogg",".silk",".dbbin",".dbmv",".etc",".lmat",".lm",".ls",".lh",".lani",".lav",".lsani",".ltc",".csv",".scene",".prefab",".lml",".lmani",".ktx",".dds",".xml",".aac",".pkm",".skel",".cur",".ico",".wasm",".br",".gltf",".glb",".astc",".dat",".tt"],exports.getWhiteExtList=getWhiteExtList;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./url_config":1679975017845,"./request":1679975017835,"./log":1679975017836,"./jsonParse":1679975017846}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017925, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.uglifyFileNames=exports.getGameNameMapping=exports.getNameMapping=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),config_1=require("../../config"),error_1=require("../../utils/error"),tools_1=require("../../utils/tools"),game_1=(0,tslib_1.__importDefault)(require("../json/game")),app_1=require("../json/app"),file_flatter_1=require("./file_flatter"),url_config_1=require("../../utils/url_config"),request_1=require("../../utils/request"),sign_1=require("../../utils/sign"),jsonParse_1=require("../../utils/jsonParse"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),config=(0,tslib_1.__importStar)(require("../../config")),common_1=require("../../utils/common");function checkPrefix(e,t){for(const a of t)if(0===e.indexOf(a))return a;return""}const getNameMapping=async(e,t)=>{if(process.env.isDevtools)return e.nameMappingFromDevtools||{};{const a=e.getFileList(t,".js").map(e=>path_1.default.posix.relative(t,e));try{let r={};if("miniProgram"===e.type){const o=await(0,app_1.getAppJSON)(e);r=await getMiniProgramNameMapping(e,t,o,a)}if("miniGame"===e.type){const t=await(0,game_1.default)(e);r=await(0,exports.getGameNameMapping)(e,t,a)}return r}catch(e){throw new error_1.CodeError(e.toString(),config_1.CODE_PROTECT_TRANSLATE_FILENAME)}}};exports.getNameMapping=getNameMapping;const getMiniProgramNameMapping=async(e,t,a,r)=>{const o=[{type:"file",value:"app.js"},{type:"regex",value:/\/miniprogram_npm\/|^miniprogram_npm\//},{type:"folder",value:"functional-pages/"}],i=e.getFileList(t,".wxml").map(e=>path_1.default.posix.relative(t,e));for(const e of i)o.push({type:"file",value:""+e.replace(/\.wxml$/,".js")});let s=[];return a.subPackages&&(s=a.subPackages.map(e=>e.root)),a.widgets&&a.widgets.length>0&&a.widgets.forEach(e=>{o.push({type:"folder",value:/\/$/.test(e.path)?e.path:e.path+"/"})}),a.workers&&o.push({type:"folder",value:(0,tools_1.getWorkersPath)(a.workers)}),a.openDataContext&&(o.push({type:"file",value:path_1.default.posix.join(a.openDataContext,"index.js")}),s.push(a.openDataContext)),await _getNameMapping(e,r,o,s)},getGameNameMapping=async(e,t,a)=>{const r=[{type:"file",value:"game.js"},{type:"regex",value:/\/miniprogram_npm\/|^miniprogram_npm\//}],o=[];if(t.subPackages&&t.subPackages.forEach(e=>{const t=e.root.replace(/^\//,"");/\.js$/.test(t)?(r.push({type:"file",value:t}),o.push(path_1.default.posix.dirname(t))):(r.push({type:"file",value:path_1.default.posix.join(t,"./game.js")}),o.push(t))}),t.openDataContext&&(r.push({type:"file",value:path_1.default.posix.join(t.openDataContext,"index.js")}),o.push(t.openDataContext)),t.workers&&r.push({type:"folder",value:(0,tools_1.getWorkersPath)(t.workers)}),t.plugins)for(const e in t.plugins){const a=t.plugins[e];if(a.path){const e=a.path.replace(/^\//,"");r.push({type:"folder",value:e})}}return await _getNameMapping(e,a,r,o)};async function _getNameMapping(e,t,a,r=[]){const o={},i=[];for(const e of t){let t=!1;for(const r of a)if("file"===r.type&&r.value===e||"folder"===r.type&&0===e.indexOf(r.value)||"regex"===r.type&&r.value.test(e)){t=!0;break}t||i.push(e)}const s=await(0,sign_1.getSignature)(e.privateKey,e.appid),{body:n}=await(0,request_1.request)({url:url_config_1.TRANSLATE_FILENAME,method:"post",body:JSON.stringify({appid:e.appid,signature:s,arrPaths:i}),headers:{"content-type":"application/json"}}),p=(0,jsonParse_1.jsonRespParse)(n,url_config_1.TRANSLATE_FILENAME);if(0===p.errCode)return p.body.pairs.forEach(e=>{const t=checkPrefix(e.origin,r);o[e.origin]=(0,tools_1.normalizePath)(path_1.default.posix.join(t,e.translated+".js"))}),o;throw new Error(`errCode: ${p.errCode} errMsg: ${p.errMsg}`)}function genResolveAlias(e){if(e){const t=[];return Object.keys(e).forEach(a=>{let r=a;a.endsWith("*")&&(r=r.slice(0,-1));let o=e[a];e[a].endsWith("*")&&(o=o.slice(0,-1)),t.push({key:r,value:o})}),e=>{let a={key:"",value:""},r=!1;if(t.forEach(t=>{e.startsWith(t.key)&&a.key.length<t.key.length&&(a=t,r=!0)}),!r)return;let o=e.replace(a.key,a.value);return"/"===o[0]&&(o=o.slice(1)),o}}return e=>{}}async function uglifyFileNames(e,t,a){let r={miniprogramRoot:""};try{r=JSON.parse(t["project.config.json"].toString())}catch(e){}let o=(0,tools_1.normalizePath)(r.miniprogramRoot);"."===o&&(o=""),a=a||await(0,exports.getNameMapping)(e,e.miniprogramRoot);const i=Object.keys(t).filter(e=>e.endsWith(".js")),s={};let n,p=t[path_1.default.posix.join(o,"app.json")];p?(Buffer.isBuffer(p)&&(p=p.toString("utf-8")),p=JSON.parse(p),n=genResolveAlias(p.resolveAlias)):n=genResolveAlias(void 0);for(const e of i){if(/\/miniprogram_npm\/|^miniprogram_npm\//.test(e))continue;const r=e,p=t[e].toString(),l=t[e+".map"]||"";s[r]=(0,file_flatter_1.tryTranslateSingleFile)({rootPath:o,code:p,nameMapping:a,check:!0,sourceFileName:e,sourceMap:l,filePath:e,miniProgramJSFiles:i,resolveAlias:n})}const l=Object.keys(t),u={};for(const e of l){u[(0,tools_1.normalizePath)(e)]=t[e]}for(const e in s){const t=(0,tools_1.normalizePath)(e);let r=t;const i=s[e];if(i.errMsg){if(!process.env.isDevtools)throw new Error(`\n${locales_1.default.config.COULD_NOT_USE_CODE_PROTECT}\n${i.errMsg}`);(0,common_1.throwError)({code:config.FILE_FLAT_ERR,msg:`${locales_1.default.config.COULD_NOT_USE_CODE_PROTECT}\n${i.errMsg}`,filePath:t})}const n=path_1.default.posix.relative(o,e);a[n]&&(r=(0,tools_1.normalizePath)(path_1.default.posix.join(o,a[n])),delete u[t],delete u[t+".map"]),u[r]=i.translatedContent,i.translatedSourceMap&&(u[r+".map"]=i.translatedSourceMap)}return u}exports.getGameNameMapping=getGameNameMapping,exports.uglifyFileNames=uglifyFileNames;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../config":1679975017839,"../../utils/error":1679975017840,"../../utils/tools":1679975017847,"../json/game":1679975017873,"../json/app":1679975017914,"./file_flatter":1679975017926,"../../utils/url_config":1679975017845,"../../utils/request":1679975017835,"../../utils/sign":1679975017838,"../../utils/jsonParse":1679975017846,"../../utils/locales/locales":1679975017841,"../../utils/common":1679975017852}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017926, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.tryTranslateSingleFile=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),parser=(0,tslib_1.__importStar)(require("@babel/parser")),traverse_1=(0,tslib_1.__importDefault)(require("@babel/traverse")),sourcemap=(0,tslib_1.__importStar)(require("source-map")),babel_code_frame_1=(0,tslib_1.__importDefault)(require("babel-code-frame"));class TranslateResult{constructor(){this.translated=!0,this.errMsg="",this.debugs=[],this.translatedContent="",this.fullPath="",this.translatedSourceMap=""}}function getErrorCodeFrame(e,n,t,r){let o;try{o=new sourcemap.SourceMapConsumer(n||""),e=o.sourceContentFor(t)||e}catch(e){}const i=[];for(const n of r){let t={line:n.line,column:n.column>0?n.column:0};try{o&&(t=o.originalPositionFor({line:n.line,column:n.column}))}catch(e){}const r=(0,babel_code_frame_1.default)(e,t.line,t.column);i.push(`${n.reason}\n${r}`)}return i.join("\n\n")}function translateCode(e,n){const t=e.replace(/\r\n/g,"\n").split("\n");for(let e=0;e<t.length;e++){const r=t[e],o=n[e+1];if(o){const n=[];let i=0;for(const e in o){const t=o[e];n.push(r.substr(i,t.column-i+1)),n.push(t.toString),i=t.column+t.fromString.length+1}n.push(r.substr(i)),t[e]=n.join("")}}return t.join("\n")}function translateSourceMap(e,n,t){const r=new sourcemap.SourceMapConsumer(e),o=new sourcemap.SourceMapGenerator({file:n});let i;return r.eachMapping(e=>{if("number"!=typeof e.originalLine||"number"!=typeof e.originalColumn)return;const n={generated:{line:e.generatedLine,column:e.generatedColumn},source:e.source,name:e.name,original:{line:e.originalLine,column:e.originalColumn}};if(i&&i.line===e.generatedLine?n.generated.column+=i.offset:i=void 0,t[e.generatedLine]){const n=t[e.generatedLine][e.generatedColumn];n&&(i&&i.line===n.line?i.offset+=n.offset:i={line:n.line,offset:n.offset})}o.addMapping(n)}),o.toString()}function dirname(e){const n=e.split("/");return n.pop(),n.join("/")}function getNpmRequirePath(e,n,t){if(e.startsWith(".")||e.startsWith("/"))return!1;{let r,o=n;for(;o;)if(o=dirname(o),r=e.endsWith(".js")?path_1.default.posix.join(o,"miniprogram_npm",e):path_1.default.posix.join(o,"miniprogram_npm",e,"index.js"),t.includes(r))return r;return!1}}const tryTranslateSingleFile=e=>{var n,t;const r=new TranslateResult,{filePath:o,nameMapping:i,code:a,rootPath:l,miniProgramJSFiles:s}=e;let u=path_1.default.posix.dirname(path_1.default.posix.relative(l,o));"."===u&&(u="");const c=[];let p;try{p=parser.parse(a)}catch(i){return c.push({line:(null===(n=i.loc)||void 0===n?void 0:n.line)||1,column:(null===(t=i.loc)||void 0===t?void 0:t.column)||1,reason:i.message}),r.translated=!1,r.errMsg=`in ${path_1.default.posix.join(l,o)}\n${getErrorCodeFrame(a,e.sourceMap,e.sourceFileName,c)}`,r}const d={};if((0,traverse_1.default)(p,{AssignmentExpression(e){const n=e.node.loc.start;"Identifier"===e.node.left.type&&"require"===e.node.left.name&&c.push({line:n.line,column:n.column,reason:"assigning other name with 'require'"}),"Identifier"===e.node.right.type&&"require"===e.node.right.name&&c.push({line:n.line,column:n.column,reason:"'require' should not be renamed"})},VariableDeclarator(e){const n=e.node.loc.start;e.node.id&&"Identifier"===e.node.id.type&&"require"===e.node.id.name&&c.push({line:n.line,column:n.column,reason:"(init) assigning other name with 'require'"}),e.node.init&&"Identifier"===e.node.init.type&&"require"===e.node.init.name&&c.push({line:n.line,column:n.column,reason:"(init) 'require' should not be renamed"})},CallExpression(n){const t=n.node.loc.start;for(const e of n.node.arguments)"Identifier"===e.type&&"require"===e.name&&c.push({line:t.line,column:t.column,reason:"passing 'require' as a parameter is not a good taste"});if("Identifier"===n.node.callee.type&&"require"===n.node.callee.name&&(1===n.node.arguments.length&&"StringLiteral"===n.node.arguments[0].type||c.push({line:t.line,column:t.column,reason:"'require' requires one and only one static string literal"})),"require"===n.node.callee.name&&1===n.node.arguments.length&&"StringLiteral"===n.node.arguments[0].type){const t=n.node.arguments[0].loc.start,a=n.node.arguments[0].value,c=e.resolveAlias(a);let p;p=c?path_1.default.posix.join(l,c):path_1.default.posix.normalize(path_1.default.posix.join(u,a)),/\.js$/.test(p)||(p+=".js"),/^\//.test(p)&&(p=p.replace(/^\//,""));let m=i[p];if(m)m=i[o]?path_1.default.posix.relative(path_1.default.posix.dirname(i[o]),m):path_1.default.posix.relative(u,m),d[t.line]||(d[t.line]={}),d[t.line][t.column]={line:t.line,column:t.column,fromString:a,toString:m,offset:m.length-a.length},r.debugs.push([o,a,"replace",[p,m]]);else{if(i[o]){const e=getNpmRequirePath(a,o,s);e&&(p=e),m=path_1.default.posix.relative(path_1.default.posix.dirname(i[o]),p),d[t.line]||(d[t.line]={}),d[t.line][t.column]={line:t.line,column:t.column,fromString:a,toString:m,offset:m.length-a.length},r.debugs.push([o,a,"replace",[p,m]])}r.debugs.push([o,a,"ignored"])}}},Identifier(e){const n=e.node.loc.start;if("require"===e.node.name){if("UnaryExpression"===e.parent.type&&"typeof"===e.parent.operator)return;"CallExpression"!==e.parent.type&&c.push({line:n.line,column:n.column,reason:`require is not being used properly in '${e.parent.type}'`})}}}),c.length>0)return r.translated=!1,r.errMsg=`in ${o}\n${getErrorCodeFrame(a,e.sourceMap,e.sourceFileName,c)}`,r;if(Object.keys(d).length>0){r.translatedContent=translateCode(a,d);try{r.translatedSourceMap=translateSourceMap(e.sourceMap||"",e.sourceFileName,d)}catch(e){}}else r.translatedContent=a,r.translatedSourceMap=e.sourceMap;return r};exports.tryTranslateSingleFile=tryTranslateSingleFile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017927, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compile=void 0;const tslib_1=require("tslib"),common_1=require("./common"),mpjson_1=require("./handler/mpjson"),white_ext_list_1=require("../../utils/white_ext_list"),config_1=require("../../config"),path_1=(0,tslib_1.__importDefault)(require("path")),projectconfig_1=require("../json/projectconfig"),uglifyfilenames_1=require("../protect/uglifyfilenames"),partial_1=require("../analyse/partial"),lodash_1=(0,tslib_1.__importDefault)(require("lodash")),summer=(0,tslib_1.__importStar)(require("../../summer/ci"));async function compile(e,i){var t,o,a,l;const s=await(0,projectconfig_1.getProjectConfigJSON)(e);if(null===(t=s.setting)||void 0===t?void 0:t.useCompilerPlugins)return summer.compile(e,s,i,s.setting.useCompilerPlugins);const r=s.miniprogramRoot||"",{MiniProgramWhiteList:p}=await(0,white_ext_list_1.getWhiteExtList)();let n=e.getFileList(r,"").filter(common_1.isNotIgnoredByProjectConfig.bind(null,s,r)).filter(e=>p.has(path_1.default.posix.extname(e)));if((null===(o=i.compilePages)||void 0===o?void 0:o.length)&&i.analyzer){const e=(0,partial_1.partialGetCodeFiles)(i.analyzer,i.compilePages).map(e=>path_1.default.posix.join(r,e)),t=n.filter(e=>{const i=path_1.default.posix.extname(e);return".js"!==i&&".json"!==i&&".wxss"!==i&&".wxml"!==i});n=t.concat(e)}let c=!1,m=await(0,mpjson_1.compileJSON)(e,i);if((null===(a=i.compilePages)||void 0===a?void 0:a.length)&&i.analyzer){const e=JSON.parse(m[path_1.default.posix.join(r,"app.json")]);e.pages=e.pages.filter(e=>{var t;return null===(t=i.compilePages)||void 0===t?void 0:t.includes(e)}),0===e.pages.length&&(e.pages=["partialcompileplaceholder"],c=!0),e.subPackages&&(e.subPackages.forEach(e=>{e.pages=e.pages.filter(t=>{var o;return null===(o=i.compilePages)||void 0===o?void 0:o.includes(e.root+t)})}),e.subPackages=e.subPackages.filter(e=>e.pages.length>0)),m[path_1.default.posix.join(r,"app.json")]=JSON.stringify(e),m=lodash_1.default.pick(m,Object.keys(m).filter(e=>m[e]instanceof Buffer||n.includes(e)))}const _=n.filter(e=>".js"===path_1.default.posix.extname(e)).map(e=>path_1.default.posix.relative(r,e)),u=await(0,common_1.compileJSFiles)(e,_,r,i),f=n.filter(e=>".wxss"===path_1.default.posix.extname(e)).map(e=>path_1.default.posix.relative(r,e)),g=await(0,common_1.compileWXSSFiles)(e,f,r,i),d=n.filter(e=>".wxml"===path_1.default.posix.extname(e)).map(e=>path_1.default.posix.relative(r,e)),h=await(0,common_1.compileWXMLFiles)(e,d,r,i),j=n.filter(e=>{const i=path_1.default.posix.extname(e);return".js"!==i&&".json"!==i&&".wxss"!==i&&".wxml"!==i}),x=await(0,common_1.compileOther)(e,j,i);let v=Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},m),u),x),g),h);if(c&&(v[path_1.default.posix.join(r,"partialcompileplaceholder.js")]||(v[path_1.default.posix.join(r,"partialcompileplaceholder.js")]=""),v[path_1.default.posix.join(r,"partialcompileplaceholder.wxml")]||(v[path_1.default.posix.join(r,"partialcompileplaceholder.wxml")]="")),e.type===config_1.COMPILE_TYPE.miniProgram){if(s.miniprogramRoot&&"."!==s.miniprogramRoot&&"./"!==s.miniprogramRoot){const i={};for(const t in v)i[path_1.default.posix.relative(e.miniprogramRoot,t)]=v[t];v=i}v["project.config.json"]=JSON.stringify({miniprogramRoot:"",__compileDebugInfo__:i.__compileDebugInfo__||{}}),delete v["project.private.config.json"]}else v["project.config.json"]=JSON.stringify({miniprogramRoot:e.miniprogramRoot||"",__compileDebugInfo__:i.__compileDebugInfo__||{}}),delete v["project.private.config.json"];return e.type===config_1.COMPILE_TYPE.miniProgram&&(null===(l=i.setting)||void 0===l?void 0:l.codeProtect)&&(v=await(0,uglifyfilenames_1.uglifyFileNames)(e,v)),v}exports.compile=compile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./common":1679975017877,"./handler/mpjson":1679975017928,"../../utils/white_ext_list":1679975017924,"../../config":1679975017839,"../json/projectconfig":1679975017851,"../protect/uglifyfilenames":1679975017925,"../analyse/partial":1679975017920,"../../summer/ci":1679975017929}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017928, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compileJSON=exports.addSkylineRendererToComponents=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),app_1=require("../../json/app"),getExtJSON_1=require("../../json/app/getExtJSON"),common_1=require("../../../utils/common"),getPageJSON_1=require("../../json/page/getPageJSON"),taskstatus_1=require("../../../utils/taskstatus"),projectconfig_1=require("../../json/projectconfig"),common_2=require("../common");function addSkylineRendererToComponents(e,t){const o=new Set,n=new Set;function s(e,t){Object.values(t.usingComponents||{}).forEach(t=>{const s=t.startsWith("/")?t.substring(1)+".json":path_1.default.posix.join(path_1.default.posix.dirname(e),t+".json");o.has(s)||n.add(s)}),Object.values(t.componentGenerics||{}).forEach(t=>{if("object"==typeof t&&"string"==typeof t.default){const s=t.default.startsWith("/")?t.default.substring(1)+".json":path_1.default.posix.join(path_1.default.posix.dirname(e),t.default+".json");o.has(s)||n.add(s)}})}for(const t of Object.keys(e)){const o=JSON.parse(e[t]);"skyline"===o.renderer&&s(t,o)}for(;n.size>0;){const e=n.values().next().value;if(n.delete(e),o.add(e),t[e]&&"string"==typeof t[e]){const o=JSON.parse(t[e]);if("xr-frame"===o.renderer)continue;if("webview"===o.renderer)throw new Error(`The component (${e}) is configured with renderer: 'webview', but is used in skyline pages`);o.renderer="skyline",t[e]=JSON.stringify(o),s(e,o)}}}async function compilePageJSON(e,t,o,n){const{onProgressUpdate:s=(()=>{})}=n,a={};for(const n of t){const t=new taskstatus_1.TaskStatus(n);s(t);const i=await(0,getPageJSON_1.getPageJSON)(e,{miniprogramRoot:o,pagePath:n});a[path_1.default.posix.join(o,n+".json")]=JSON.stringify(Object.assign(Object.assign({},i),{__warning__:void 0})),t.done(),s(t)}return a}async function compileJSON(e,t){const{onProgressUpdate:o=(()=>{})}=t,n=await(0,projectconfig_1.getProjectConfigJSON)(e),{miniprogramRoot:s=""}=n;let a=new taskstatus_1.TaskStatus("app.json");o(a);const i=await(0,app_1.getAppJSON)(e);let r;a.done(),o(a);const p=await e.attr();(null==p?void 0:p.platform)&&(a=new taskstatus_1.TaskStatus("ext.json"),o(a),r=await(0,getExtJSON_1.getExtJSON)(e),a.done(),o(a));const c=(0,common_1.getAllPages)(i),l=await compilePageJSON(e,c,s,t),d=new Set(["app.json","ext.json"].concat(c.map(e=>e+".json"))),u=(0,common_1.getAllTargetTypeFilesWithOtherTypeFilesOfSameName)(e,".json",[".wxml",".js"],s).filter(common_2.isNotIgnoredByProjectConfig.bind(null,n,s)).filter(e=>{const t=path_1.default.posix.relative(s,e);return!d.has(t)}).map(e=>path_1.default.posix.relative(s,e).replace(/\.json$/,"")),g=await compilePageJSON(e,u,s,t);u.forEach(e=>d.add(e+".json")),addSkylineRendererToComponents(l,g);const f=e.getFileList(s,".json").filter(common_2.isNotIgnoredByProjectConfig.bind(null,n,s)).filter(e=>{const t=path_1.default.posix.relative(s,e);return!d.has(t)}),m=await(0,common_2.compileOther)(e,f,t),j=Object.assign(Object.assign(Object.assign({[path_1.default.posix.join(s,"app.json")]:JSON.stringify(Object.assign(Object.assign({},i),{__warning__:void 0}))},l),g),m);return r&&(j[path_1.default.posix.join(s,"ext.json")]=JSON.stringify(r)),j}exports.addSkylineRendererToComponents=addSkylineRendererToComponents,exports.compileJSON=compileJSON;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../json/app":1679975017914,"../../json/app/getExtJSON":1679975017915,"../../../utils/common":1679975017852,"../../json/page/getPageJSON":1679975017917,"../../../utils/taskstatus":1679975017880,"../../json/projectconfig":1679975017851,"../common":1679975017877}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017929, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compile=void 0;const tools_1=require("../utils/tools"),common_1=require("../core/compile/common"),project_1=require("./project"),recorder_1=require("./recorder"),summer_1=require("./summer");function getSummerOptions(e,r){const i=new Set;return i.add("javascript"),e&&(i.add(["es6module",{disableUseStrict:e.disableUseStrict}]),(e.es7||e.es6)&&i.add(["enhance",{disableUseStrict:e.disableUseStrict}]),(e.minifyWXSS||e.autoPrefixWXSS)&&i.add("wxss"),e.minifyWXML&&i.add("minifywxml"),e.minify&&(i.add("terser"),i.add("wxss"))),r&&r.forEach(e=>{if("string"==typeof e)i.add(e);else{if(!Array.isArray(e))throw new Error("invalid useSummerCompiler options: "+JSON.stringify(e));if("string"!=typeof e[0]||void 0===e[1])throw new Error("invalid useSummerCompiler options: "+JSON.stringify(e));i.add(e)}}),Array.from(i)}async function compile(e,r,i,o){var t;const s={appid:e.appid,attr:await e.attr(),compileType:e.type,miniprogramRoot:e.miniprogramRoot,pluginRoot:e.pluginRoot,summerPlugins:getSummerOptions(i.setting,o),babelSetting:null===(t=null==r?void 0:r.setting)||void 0===t?void 0:t.babelSetting},n=e.getFilesAndDirs();n.files=n.files.filter(common_1.isNotIgnoredByProjectConfig.bind(null,r,e.miniprogramRoot));const m=new project_1.Project((0,tools_1.normalizePath)(e.projectPath),n.files,n.dirs,s),a=new summer_1.SummerCompiler(m,"",s),l=new recorder_1.Recorder((e,r,o)=>{var t;null===(t=i.onProgressUpdate)||void 0===t||t.call(i,{id:e.toString(),message:o,status:r})});return await a.compile({},l)}exports.compile=compile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/tools":1679975017847,"../core/compile/common":1679975017877,"./project":1679975017930,"./recorder":1679975017931,"./summer":1679975017932}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017930, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.Project=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),fs_1=(0,tslib_1.__importDefault)(require("fs")),tools_1=require("../utils/tools"),events_1=(0,tslib_1.__importDefault)(require("events"));class Project{constructor(t,e,i,r){this.projectPath=t,this._dirSet=new Set,this._fileSet=new Set,this.type="miniProgram",this.privateKey="",this.event=new events_1.default,this.updateOptions(r),this._fileSet=new Set(e.filter(t=>!this.isIgnore(t))),this._dirSet=new Set(i)}getFilesAndDirs(){return{files:Array.from(this._fileSet),dirs:Array.from(this._dirSet)}}async attr(){return this._attr}updateOptions(t){this.appid=t.appid,this._attr=t.attr,this.updateType(t.attr,t.compileType),this.miniprogramRoot=t.miniprogramRoot,this.pluginRoot=t.pluginRoot}updateType(t,e){if(null==t?void 0:t.gameApp)return"miniGamePlugin"===e?void(this.type="miniGamePlugin"):void(this.type="miniGame");this.type=e}getExtAppid(){throw new Error("Method not implemented.")}updateFiles(){throw new Error("Method not implemented.")}isIgnore(t){return t.endsWith(".d.ts")}cacheDirName(t){this._dirSet.has(t)||(this._dirSet.add(t),this.cacheDirName(path_1.default.posix.dirname(t)))}getTargetPath(t,e){return(0,tools_1.normalizePath)(path_1.default.posix.join(t,e)).replace(/\/$/,"").replace(/^\//,"")}stat(t,e){const i=this.getTargetPath(t,e);return this._fileSet.has(i)?{isFile:!0,isDirectory:!1}:this._dirSet.has(i)?{isFile:!1,isDirectory:!0}:void 0}getFileSize(t,e){const i=this.getTargetPath(t,e),r=(0,tools_1.normalizePath)(path_1.default.posix.join(this.projectPath,i));return fs_1.default.statSync(r).size}getFile(t,e){const i=this.getTargetPath(t,e),r=(0,tools_1.normalizePath)(path_1.default.posix.join(this.projectPath,i));return fs_1.default.readFileSync(r,null)}getJson(t,e){const i=this.getFile(t,e).toString("utf-8");try{return JSON.parse(i)}catch(i){throw new Error("JSON parse failed: "+this.getTargetPath(t,e))}}getFileList(t,e=""){return Array.from(this._fileSet).filter(i=>(!e||path_1.default.posix.extname(i)===e)&&(!t||0===i.indexOf(t)))}onFileChange(t,e){if("add"!==t&&"addDir"!==t||(this.cacheDirName(path_1.default.posix.dirname(e)),this.isIgnore(e)||this._fileSet.add(e)),"addDir"===t&&this.cacheDirName(e),"unlink"===t&&this._fileSet.has(e)&&this._fileSet.delete(e),"unlinkDir"===t&&this._dirSet.has(e)){this._dirSet.delete(e);const t=e+"/",i=Array.from(this._dirSet);for(const e of i)0===e.indexOf(t)&&this._dirSet.delete(e);const r=Array.from(this._fileSet);for(const e of r)0===e.indexOf(t)&&this._fileSet.delete(e)}this.event.emit("fileChange",t,e)}}exports.Project=Project;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017931, function(require, module, exports) {
!function(require, directRequire){
function pad(e,t=2){return e>10**t?String(e):`${new Array(t).join("0")}${e}`.slice(-t)}function getPrintTime(){const e=new Date;return`${String(e.getFullYear())}-${pad(e.getMonth()+1)}-${pad(e.getDate())} ${pad(e.getHours())}:${pad(e.getMinutes())}:${pad(e.getSeconds())}.${pad(e.getMilliseconds(),3)}`}Object.defineProperty(exports,"__esModule",{value:!0}),exports.silentRecorder=exports.Recorder=exports.getPrintTime=void 0,exports.getPrintTime=getPrintTime;let taskId=5e7;function genTaskId(){return taskId++}class Recorder{constructor(e){this.sendProgress=e}start(e){const t=genTaskId(),r=e.startsWith("!");r||this.sendProgress(t,"doing",e);const s=()=>{r||this.sendProgress(t,"done","")};return s.id=t,s}async run(e,t){const r=this.start(e);try{return await t()}finally{r()}}}exports.Recorder=Recorder,exports.silentRecorder=new Recorder(()=>{});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017932, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.SummerCompiler=void 0;const tslib_1=require("tslib"),plugingraph_1=require("./graph/plugingraph"),appgraph_1=require("./graph/appgraph"),path_1=(0,tslib_1.__importDefault)(require("path")),reactiveCache_1=require("../core/json/reactiveCache"),initPlugin_1=require("./initPlugin"),lodash_1=require("lodash"),locales_1=(0,tslib_1.__importDefault)(require("../utils/locales/locales")),plugin_driver_1=require("./plugin_driver"),persist_cache_1=(0,tslib_1.__importDefault)(require("./persist_cache")),tools_1=require("../utils/tools");let proxyProject;function initProxyProjectForJSON(t){if(proxyProject&&proxyProject.projectPath!==t.projectPath&&(proxyProject.clearResolver(),proxyProject=void 0),!proxyProject){let e={};function i(i,r){const o=t.stat(i,r);if(o)return o;const p=t.getTargetPath(i,r);for(const t in e)if(p.startsWith(t))return e[t].stat(path_1.default.posix.relative(t,p))}proxyProject=new Proxy(t,{get:(t,e,r)=>"stat"===e?i:Reflect.get(t,e,r)}),proxyProject.addResolver=t=>{(0,reactiveCache_1.cleanReactiveCache)(),e[t.root]=t},proxyProject.removeResolver=t=>{(0,reactiveCache_1.cleanReactiveCache)(),delete e[t.root]},proxyProject.clearResolver=()=>{e={},(0,reactiveCache_1.cleanReactiveCache)()}}return proxyProject}function getCacheBaseKey(t){const i=`${t.miniprogramRoot}|${t.pluginRoot}|${t.summerPlugins.join(",")}`;return(0,tools_1.generateMD5)(i)}class SummerCompiler{constructor(t,i,e){this.project=t,this.cachePath=i,this.options=e,this.proxyProject=initProxyProjectForJSON(t),this.projectPath=t.projectPath,this.persistCache=new persist_cache_1.default(i,getCacheBaseKey(e)),this.initPlugins(),this.initAppGraph(),"miniProgramPlugin"===this.options.compileType&&this.initPluginGraph()}getBabelSetting(){return this.options.babelSetting}initPlugins(){this.plugins=this.options.summerPlugins.map(t=>{let i,e={};return"string"==typeof t?i=t:(i=t[0],e=t[1]),(0,initPlugin_1.initPlugin)(i,this.project.projectPath,e)})}initAppGraph(){this.appGraph=new appgraph_1.AppGraph({type:"miniprogram",root:this.project.miniprogramRoot,persistCache:this.persistCache,plugins:this.plugins,compiler:this})}initPluginGraph(){this.pluginGraph=new plugingraph_1.PluginGraph({type:"plugin",root:this.project.pluginRoot,persistCache:this.persistCache,plugins:this.plugins,compiler:this})}updateOptions(t){var i,e;const r=this.options;if(this.options=t,this.persistCache.updateBaseCacheKey(getCacheBaseKey(t)),!(0,lodash_1.isEqual)(t.babelSetting,r.babelSetting)||!(0,lodash_1.isEqual)(this.options.summerPlugins,r.summerPlugins))return this.initPlugins(),this.appGraph.destroy(),null===(i=this.pluginGraph)||void 0===i||i.destroy(),this.initAppGraph(),void("miniProgramPlugin"===this.options.compileType&&this.initPluginGraph());this.options.compileType!==r.compileType&&("miniProgramPlugin"===this.options.compileType?this.initPluginGraph():(null===(e=this.pluginGraph)||void 0===e||e.destroy(),this.pluginGraph=void 0)),this.appGraph.root!==this.project.miniprogramRoot&&(this.appGraph.destroy(),this.initAppGraph()),this.pluginGraph&&this.pluginGraph.root!==this.project.pluginRoot&&(this.pluginGraph.destroy(),this.initPluginGraph())}destroy(){var t;this.appGraph.destroy(),null===(t=this.pluginGraph)||void 0===t||t.destroy(),this.proxyProject.clearResolver()}getStatus(){const t=(0,plugin_driver_1.genResovleExtConf)(this.plugins),i={},e=new Set;for(const r of["json","js","wxml","wxss","wxs"])i[r]={exts:t[r].reverse()},t[r].forEach(t=>{e.add(t)});return{codeExts:Array.from(e.keys()),codeConf:i}}clearCache(){var t;this.appGraph.clearCache(),null===(t=this.pluginGraph)||void 0===t||t.clearCache(),this.persistCache.clean(),(0,reactiveCache_1.cleanReactiveCache)()}async getConf({graphId:t},i){if("miniprogram"===t){return await this.appGraph.getConf(i)}if("plugin"===t){return await this.pluginGraph.getConf(i)}throw new Error("no support getConf for "+t)}async getCode(t,i){if("miniprogram"===t.graphId){return await this.appGraph.getDevCode(i,{package:t.package})}if("plugin"===t.graphId){return await this.pluginGraph.getDevCode(i)}throw new Error("no support getCode for "+t.graphId)}async getLocalFileList(t){if("miniprogram"===t)return await this.appGraph.getLocalFileList();if("plugin"===t)return await this.pluginGraph.getLocalFileList();throw new Error("no support getCode for "+t)}async compileSingleCode(t,i){if("miniprogram"===t.graphId){return await this.appGraph.compileSingleCode(t.filePath,t.sourceCode)}if("plugin"===t.graphId){return await this.pluginGraph.compileSingleCode(t.filePath,t.sourceCode)}throw new Error("no support getCode for "+t.graphId)}async compile(t,i){const e=await i.run(locales_1.default.config.SUMMER_COMPILE_MINIPROGRAM.format(),()=>this.appGraph.compile(i));if("miniProgram"===this.project.type)return e["project.config.json"]=JSON.stringify({miniprogramRoot:"",__compileDebugInfo__:{useSummer:!0}}),e;if("miniProgramPlugin"===this.project.type){const t={},r=await(await i.run(locales_1.default.config.SUMMER_COMPILE_PLUGIN.format(),()=>this.pluginGraph.compile(i)));return Object.keys(e).forEach(i=>{t[path_1.default.posix.join(this.project.miniprogramRoot,i)]=e[i]}),Object.keys(r).forEach(i=>{t[path_1.default.posix.join(this.project.pluginRoot,i)]=r[i]}),t["project.config.json"]=JSON.stringify({miniprogramRoot:this.project.miniprogramRoot,pluginRoot:this.project.pluginRoot,__compileDebugInfo__:{useSummer:!0}}),t}throw new Error("no support compile for  "+this.project.type)}}exports.SummerCompiler=SummerCompiler;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./graph/plugingraph":1679975017933,"./graph/appgraph":1679975017940,"../core/json/reactiveCache":1679975017856,"./initPlugin":1679975017902,"../utils/locales/locales":1679975017841,"./plugin_driver":1679975017935,"./persist_cache":1679975017942,"../utils/tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017933, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.PluginGraph=void 0;const recorder_1=require("../recorder"),basegraph_1=require("./basegraph"),pluginconf_1=require("./pluginconf");class PluginGraph extends basegraph_1.BaseGraph{constructor(e){super(e),this.pluginConf=new pluginconf_1.PluginConf(this.compiler,this)}destroy(){this.pluginConf.destroy(),super.destroy()}async getConf(e){if("plugin"!==this.type)throw new Error("Couldn't call getAppConf without plugin type");return await this.pluginConf.build(e),this.conf={plugin:this.pluginConf.plugin,pages:Object.fromEntries(this.pluginConf.pages.entries()),comps:Object.fromEntries(this.pluginConf.comps.entries())},this.conf}async ensureConf(e){this.conf||await this.getConf(e)}async compileSingleCode(e,t){await this.ensureConf(recorder_1.silentRecorder);const n=this.resolver.resolveInfoMap.get(e);if(n)return super.doCompileSingleCode(Object.assign(Object.assign({},n),{independentRoot:this.getIndependentRoot(n.path),isBabelIgnore:this.isBabelSettingIgnore(n)}),t);throw new Error("file not found")}async getDevCode(e){await this.ensureConf(e);let t=this.getPackageFile();return t=t.filter(e=>!e.path.endsWith("json")),this.getCodeFiles(t,e)}async getProdCode(e){await this.ensureConf(e);let t=this.getPackageFile();return t=t.filter(e=>!e.path.endsWith("json")),this.getCodeFiles(t,e,!1)}getLocalCodeFileList(){return Array.from(this.resolver.resolveInfoMap.entries()).map(([e,t])=>t.source)}onFileChangeForGraph(e,t){}getPackageFile(){const e=[];for(const[t,n]of this.resolver.resolveInfoMap.entries())e.push(n);return e.map(e=>Object.assign(Object.assign({},e),{independentRoot:this.getIndependentRoot(e.path),isBabelIgnore:this.isBabelSettingIgnore(e)}))}getIndependentRoot(e){const t=this.conf.plugin;return"string"==typeof t.workers&&e.startsWith(t.workers)?t.workers:""}async compileJSON(){const e=await this.getConf(recorder_1.silentRecorder),t={};t["plugin.json"]=JSON.stringify(e.plugin);for(const n in e.pages)t[n+".json"]=JSON.stringify(e.pages[n]);for(const n in e.comps)t[n+".json"]=JSON.stringify(e.comps[n]);return{conf:e,jsons:t}}}exports.PluginGraph=PluginGraph;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../recorder":1679975017931,"./basegraph":1679975017934,"./pluginconf":1679975017939}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017934, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.BaseGraph=void 0;const tslib_1=require("tslib"),plugin_driver_1=require("../plugin_driver"),types_1=require("../types"),module_1=(0,tslib_1.__importDefault)(require("../module")),path_1=(0,tslib_1.__importDefault)(require("path")),fs_1=(0,tslib_1.__importDefault)(require("fs")),devtool_1=require("../devtool"),resolver_1=require("../resolver"),white_ext_list_1=require("../../utils/white_ext_list"),common_1=require("../../core/compile/common"),tools_1=require("../../utils/tools"),babel_helper_1=require("../../utils/babel_helper"),recorder_1=require("../recorder"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),lodash_1=require("lodash"),error_1=require("../error");let MiniProgramWhiteList;function getFileType(e){let t=path_1.default.extname(e);if(t.startsWith(".")){if(t=t.slice(1),t===types_1.FileType.JS)return types_1.FileType.JS;if(t===types_1.FileType.WXML)return types_1.FileType.WXML;if(t===types_1.FileType.WXSS)return types_1.FileType.WXSS;if(t===types_1.FileType.WXS)return types_1.FileType.WXS;if(t===types_1.FileType.JSON)return types_1.FileType.JSON}throw Error("unknown the filetype of "+e)}class BaseGraph{constructor(e){this.invalidated=!0,this.running=!1,this.onFileChange=(e,t)=>{t.startsWith(this.root)&&(t=t.replace(new RegExp("^"+this.root),""),this.resolver.onFileChange(e,t),"change"!==e&&"unlink"!==e||this.invalidateModules(t),this.onFileChangeForGraph(e,t))},this.type=e.type,this.root=e.root,this.rootPath=path_1.default.posix.join(e.compiler.project.projectPath,this.root),this.persistCache=e.persistCache,this.compiler=e.compiler,this.project=this.compiler.project,this.cachedModules=new Map,this.pluginDriver=new plugin_driver_1.PluginDriver(this,e),this.modulesByPath=new Map,this.resolver=new resolver_1.Resolver(this,this.root,this.pluginDriver.resolveExtConf),this.project.event.on("fileChange",this.onFileChange)}destroy(){}clearCache(){this.modulesByPath.clear()}invalidateModules(e){for(const t of this.modulesByPath.values())(t.sourcePath===e||t.depFiles.includes(e))&&this.modulesByPath.delete(t.path)}async loadModuleFromFile(e,t){var i;let o=this.modulesByPath.get(e.path);if(null==o?void 0:o.loadingPromise)return await o.loadingPromise,this.loadModuleFromFile(e,t);let r=!o||o.sourcePath!==e.source||o.independentRoot!==e.independentRoot;if(!r&&(null==o?void 0:o.error)){if(o.loadEnd+1e3>Date.now())return o;r=!0}if(r){const r=getFileType(e.path);o=new module_1.default(this,e.path,e.source,r),o.independentRoot=e.independentRoot,e.isBabelIgnore&&(null===(i=o.jsTag)||void 0===i||i.setBabelIgnore()),this.modulesByPath.set(e.path,o),o.loadingPromise=t.run(locales_1.default.config.SUMMER_COMPILING_MODULE.format(e.source),()=>this.loadSourceForModule(o)),await o.loadingPromise,o.loadingPromise=void 0}return o}async loadSourceForModule(e){var t,i;try{const o=path_1.default.posix.join(this.rootPath,e.sourcePath),r=t=>Object.assign(Object.assign({},t),{rootPath:this.rootPath,addWatchFile:t=>{const i=(0,tools_1.normalizePath)(t);if(!i.startsWith(this.rootPath))throw(0,error_1.makeSummerError)(`The file (${t}) required by ${e.sourcePath} is outside the project`,error_1.SummerErrors.SUMMER_PLUGIN_CODE_ERR,e.path);e.addWatchFile(path_1.default.posix.relative(this.rootPath,i))}}),s=null!==(i=await this.pluginDriver.hookFirst("load",[e.path,o,{independentRoot:e.independentRoot,isBabelIgnore:(null===(t=e.jsTag)||void 0===t?void 0:t.isBabelIgnore)||!1}],r))&&void 0!==i?i:await this.readFile(o),a="string"==typeof s?{sourceCode:s}:s,l=await this.tranform(a,e,r);return e.setSource(l),!0}catch(t){return t.path=path_1.default.posix.join(this.root,e.sourcePath),e.setError(t),!1}}async doCompileSingleCode(e,t){const i=getFileType(e.path),o=new module_1.default(this,e.path,e.source,i);if(await this.loadSourceForModule(o),o.error)throw o.error;return o.target||(o.target=await this.generate(o.source,o)),o.toCodeFile()}async getCodeFiles(e,t,i=!0){const o={};return await Promise.all(e.map(async e=>{if(i&&!this.modulesByPath.get(e.path)&&e.path.endsWith(".js")){const t=await this.persistCache.get(this.project.projectPath,this.root,e);if(t)return console.log("use cache",e.path),o[e.path]=t,void this.loadModuleFromFile(e,recorder_1.silentRecorder)}const r=await this.loadModuleFromFile(e,t);r.error||r.target||(r.target=await this.generate(r.source,r));const s=r.toCodeFile();o[r.path]=s,!("error"in s)&&e.path.endsWith(".js")&&this.persistCache.set(this.project.projectPath,this.root,e,s)})),o}async readFile(e){return fs_1.default.promises.readFile(e,{encoding:"utf-8"})}async tranform(e,t,i){var o;return await this.pluginDriver.hookReduceArg0("transform",[e,t.path,t.sourcePath,{independentRoot:t.independentRoot,isBabelIgnore:(null===(o=t.jsTag)||void 0===o?void 0:o.isBabelIgnore)||!1}],(function(e,t){return"string"==typeof t?{sourceCode:t}:t}),i)}async generate(e,t){var i;let o=await this.pluginDriver.hookFirst("generate",[e,t.path,t.sourcePath,{independentRoot:t.independentRoot,isBabelIgnore:(null===(i=t.jsTag)||void 0===i?void 0:i.isBabelIgnore)||!1}]);return void 0===o||(0,lodash_1.isNull)(o)?{code:e.sourceCode,map:e.inputMap}:("string"==typeof o&&(o={code:o}),o)}async compile(e){const{conf:t,jsons:i}=await e.run(locales_1.default.config.SUMMER_COMPILE_JSON.format(),()=>this.compileJSON(e)),o=await this.compileCodeWithoutJSON(e);function r(e,t){return t}const s=await e.run(locales_1.default.config.SUMMER_OPTIMIZE_CODE.format(),()=>this.pluginDriver.hookReduceArg0("optimize",[o,t],r,e=>e)),a=await e.run(locales_1.default.config.SUMMER_PACK_FILES.format(),()=>this.compileOther(Object.keys(i))),l=Object.assign(Object.assign(Object.assign({},a),s),i),n=await e.run(locales_1.default.config.SUMMER_COMPRESS_PACK.format(),()=>this.pluginDriver.hookReduceArg0("compress",[l],(e,t)=>t,e=>e));return await e.run(locales_1.default.config.SUMMER_SEAL_PACK.format(),()=>this.pluginDriver.hookParallel("sealed",[n])),n}async getLocalFileList(){const e=this.getLocalCodeFileList(),t=new Set(this.resolver.allExts.map(e=>"."+e));if(!MiniProgramWhiteList){const e=await(0,white_ext_list_1.getWhiteExtList)();MiniProgramWhiteList=e.MiniProgramWhiteList}const i=this.project.getFileList(this.root,"").filter(e=>{const i=path_1.default.posix.extname(e);return MiniProgramWhiteList.has(i)&&!t.has(i)}).map(e=>e.replace(new RegExp("^"+this.root),"")),o={};for(const t of e.concat(i))o[t]={size:this.project.getFileSize(this.root,t)};return o}async compileOther(e){const t=new Set(this.resolver.allExts.map(e=>"."+e));if(t.delete(".json"),!MiniProgramWhiteList){const e=await(0,white_ext_list_1.getWhiteExtList)();MiniProgramWhiteList=e.MiniProgramWhiteList}const i=this.project.getFileList(this.root,"").filter(e=>{const i=path_1.default.posix.extname(e);return MiniProgramWhiteList.has(i)&&!t.has(i)}),o=await(0,common_1.compileOther)(this.project,i,{onProgressUpdate:()=>{}}),r={};for(const t in o){const i=path_1.default.posix.relative(this.root,t);e.includes(i)||(r[i]=o[t])}return r}async compileCodeWithoutJSON(e){var t;const i={},o=await this.getProdCode(e,{package:devtool_1.FullPkg}),r=new Set;for(const e in o){const s=o[e];if("error"in s)throw s.error;if(s.path.endsWith(".js")){((null===(t=s.jsTag)||void 0===t?void 0:t.helpers)||[]).forEach(e=>{r.add(e)}),i[e]=s.code;const o=s.map&&(0,tools_1.formatSourceMap)(s.map);o&&(i[e+".map"]=o)}else i[e]=s.code}return await e.run(locales_1.default.config.SUMMER_APPEND_BABEL_HELPERS.format(),()=>(0,babel_helper_1.appendBabelHelpers)(r,"","@babel/runtime",i)),i}isBabelSettingIgnore(e){var t;let i=!1;if(e.path.endsWith(".js")){const o=null===(t=this.compiler.getBabelSetting())||void 0===t?void 0:t.ignore;o&&(i=(0,babel_helper_1.isIgnore)(o,e.source))}return i}}exports.BaseGraph=BaseGraph;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../plugin_driver":1679975017935,"../types":1679975017905,"../module":1679975017936,"../devtool":1679975017937,"../resolver":1679975017938,"../../utils/white_ext_list":1679975017924,"../../core/compile/common":1679975017877,"../../utils/tools":1679975017847,"../../utils/babel_helper":1679975017878,"../recorder":1679975017931,"../../utils/locales/locales":1679975017841,"../error":1679975017901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017935, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.PluginDriver=exports.getPluginContext=exports.genResovleExtConf=void 0;const error_1=require("./error"),worker_thread_1=require("../core/worker_thread");function genResovleExtConf(r){const e={json:["json"],wxml:["wxml"],wxss:["wxss"],js:["js"],wxs:["wxs"]};for(const o of r)if(o.resolveExt)for(const r of["json","wxml","wxss","js","wxs"]){const t=o.resolveExt[r];if("string"==typeof t)e[r].includes(t)||e[r].push(t);else if(Array.isArray(t))for(const o of t)e[r].includes(o)||e[r].push(o)}return e}function throwPluginError(r,e,{hook:o,id:t}={}){const n=(0,error_1.makeSummerError)(r);throw n.code||(n.code=error_1.SummerErrors.SUMMER_PLUGIN_ERR),n.plugin=e,o&&(n.hook=o),t&&!n.path&&(n.path=t),r.stack&&(n.stack=r.stack),n}function getPluginContext(r,e){return{addWatchFile(){throw new Error("addWatchFile should be implemented by replaceContext")},async runWorkerMethod(o,...t){const n={command:"runMethod",plugin:r.name,projectPath:e.project.projectPath,pluginOption:{},method:o,args:t},s=await(0,worker_thread_1.runTask)(worker_thread_1.TASK_NAME.SUMMER_HOOK,n);if(s.error){if("SummerError"===s.error.type)throw new error_1.SummerError(s.error);throw s.error}return s.result},error:e=>throwPluginError(e,r.name)}}exports.genResovleExtConf=genResovleExtConf,exports.getPluginContext=getPluginContext;class PluginDriver{constructor(r,e){this.graph=r,this.options=e,this.pluginContexts=new Map,this.plugins=e.plugins,this.resolveExtConf=genResovleExtConf(e.plugins);for(const e of this.plugins)this.pluginContexts.set(e,getPluginContext(e,r))}runHook(r,e,o,t){const n=o[r];if(!n)return;let s=this.pluginContexts.get(o);return t&&(s=t(s,o)),Promise.resolve().then(()=>n.apply(s,e)).catch(e=>throwPluginError(e,o.name,{hook:r}))}hookFirst(r,e,o){let t=Promise.resolve(void 0);for(const n of this.plugins)t=t.then(t=>null!=t?t:this.runHook(r,e,n,o));return t}hookParallel(r,e,o){const t=[];for(const n of this.plugins){const s=this.runHook(r,e,n,o);s&&t.push(s)}return Promise.all(t).then(()=>{})}hookReduceArg0(r,[e,...o],t,n){let s=Promise.resolve(e);for(const e of this.plugins)s=s.then(s=>{const i=[s,...o],l=this.runHook(r,i,e,n);return l?l.then(r=>t.call(this.pluginContexts.get(e),s,r,e)):s});return s}}exports.PluginDriver=PluginDriver;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./error":1679975017901,"../core/worker_thread":1679975017881}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017936, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const types_1=require("./types"),tools_1=require("../utils/tools"),error_1=require("./error");class JsTag{constructor(){this.isLargeFile=!1,this.isBabelIgnore=!1,this.helpers=[]}setBabelIgnore(){this.isBabelIgnore=!0}setLargeFile(){this.isLargeFile=!0}addHelpers(e){for(const s of e)this.helpers.includes(s)||this.helpers.push(s)}toJSON(){return{isLargeFile:this.isLargeFile,isBabelIgnore:this.isBabelIgnore,helpers:this.helpers}}}class Module{constructor(e,s,t,r){this.graph=e,this.path=s,this.sourcePath=t,this.fileType=r,this.md5="",this.depFiles=[],this.independentRoot="",this.loadStart=Date.now(),r===types_1.FileType.JS&&(this.jsTag=new JsTag)}setError(e){this.error=e,this.loadEnd=Date.now()}setSource(e){var s,t;this.source=e,e.target&&(this.target=e.target,null===(s=this.jsTag)||void 0===s||s.addHelpers(e.target.helpers||[]),e.target=void 0),e.largeFile&&(null===(t=this.jsTag)||void 0===t||t.setLargeFile()),this.fileType===types_1.FileType.JSON&&(this.json=JSON.parse(this.source.sourceCode)),this.md5=(0,tools_1.generateMD5)(this.source.sourceCode),this.loadEnd=Date.now()}toCodeFile(){var e;return this.error?this.error instanceof error_1.SummerError?{path:this.path,error:this.error.toJSON()}:{path:this.path,error:this.error}:Object.assign({path:this.path,md5:this.md5,jsTag:null===(e=this.jsTag)||void 0===e?void 0:e.toJSON()},this.target)}toJSON(){return{code:"",map:void 0,path:this.path,sourcePath:this.sourcePath,depFileIds:this.depFiles}}addWatchFile(e){-1===this.depFiles.indexOf(e)&&this.depFiles.push(e)}}exports.default=Module;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./types":1679975017905,"../utils/tools":1679975017847,"./error":1679975017901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017937, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.SummerCompiler=exports.FullPkg=exports.MainPkg=void 0;const tslib_1=require("tslib"),child_process_1=require("child_process"),request_1=require("../utils/request"),path_1=(0,tslib_1.__importDefault)(require("path")),lodash_1=(0,tslib_1.__importDefault)(require("lodash")),recorder_1=require("./recorder"),tools_1=require("../utils/tools"),uglifyfilenames_1=require("../core/protect/uglifyfilenames"),error_1=require("./error"),miniprogram="miniprogram",plugin="plugin";function performanceMark(e,s){console.warn(`[summer-compiler] [${(0,recorder_1.getPrintTime)()}] [${Math.floor(performance.now())}ms elapsed] ${e}${s?" end":""}`)}exports.MainPkg="__APP__",exports.FullPkg="__FULL__";class SummerCompilerProcess{constructor(e,s){this.projectPath=e,this.cachePath=s,this.taskMap=new Map,this.taskId=0,this.initedPromise=new Promise((e,s)=>{this.initedResolve=e,this.initedReject=s})}async init(e,s,t){this.process=this.forkProcess();const r={type:"init",data:Object.assign({projectPath:this.projectPath,cachePath:this.cachePath,files:s,dirs:t},e)};performanceMark("process init"),this.sendProcessMessage(r),performanceMark("process init",!0),await this.initedPromise}destroy(){this.process.kill("SIGTERM")}sendProcessMessage(e){this.process.send(e)}forkProcess(){const e=path_1.default.posix.join(__dirname,"./entry_process.js"),s={stdio:["pipe","pipe","pipe","ipc"],cwd:this.projectPath,env:Object.assign(Object.assign({},process.env),{cpprocessEnv:"childprocess",summerProcess:"1"})};if(s.env.isDevtools=process.__nwjs&&"wechatwebdevtools"===nw.App.manifest.appname,s.env.isDevtools){let e=path_1.default.join(path_1.default.dirname(process.execPath),"node");"darwin"!==process.platform&&(e+=".exe"),s.execPath=e}performanceMark("fork process");const t=(0,child_process_1.fork)(e,["--expose-gc"],s);return t.stdout.setEncoding("utf8"),t.stdout.on("data",e=>{}),t.stderr.on("data",e=>{console.error("child process stderr: "+e)}),t.on("exit",e=>{console.error(`child process exit: code(${e})`),0!==e&&this.initedReject(new Error(`summer child process exit: code(${e})`))}),t.on("message",this.onChildProcessMessage.bind(this)),t.unref(),t}onChildProcessMessage(e){if("ready"===e.type)return performanceMark("process ready"),void this.initedResolve(!0);if("progress"===e.type){const s=this.taskMap.get(e.taskId);(null==s?void 0:s.progressUpdate)&&s.progressUpdate(e.id,e.status,e.message)}else if("response"===e.type){const{id:s,data:t,error:r}=e;if(r){const e=new error_1.SummerError(r);this.onResponse(s,void 0,e)}else this.onResponse(s,t,void 0)}}onResponse(e,s,t){const r=this.taskMap.get(e);this.taskMap.delete(e),r?t?r.reject(t):r.resolve(s):console.error(`child process task: ${e} not found`)}async sendEvent(e,s){await this.initedPromise,this.sendProcessMessage({type:"event",name:e,data:s})}async runTask(e,s,t){await this.initedPromise;return new Promise((r,i)=>{const o={name:e,data:s,resolve:r,reject:i,progressUpdate:t};this.taskId=this.taskId+1,this.taskMap.set(this.taskId,o),this.sendProcessMessage({type:"request",id:this.taskId,name:e,data:s})})}}class MessageHub{constructor(e){this.devtoolMessagehub=e,this.showing=new Set}showStatus(e,s){this.showing.add(e),this.devtoolMessagehub.showStatus(e,s)}hideStatus(e){this.showing.delete(e),this.devtoolMessagehub.hideStatus(e)}clear(){for(const e of this.showing.values())this.hideStatus(e);this.showing.clear()}}class SummerCompiler{constructor(e,s,t,r){this.projectPath=e,this.cachePath=s,this.options=t,this.devtoolMessagehub=r,this.isSummer=!0,this.codeCache=new Map,this.promiseCache=new Map,this.status=void 0,this.onProgressUpdate=(e,s,t)=>{"doing"===s?this.messageHub.showStatus(e,t):this.messageHub.hideStatus(e)},this.projectPath=(0,tools_1.normalizePath)(this.projectPath),performanceMark("create summer compiler"),this.messageHub=new MessageHub(r),this.process=new SummerCompilerProcess(this.projectPath,this.cachePath)}async init(e,s,t){performanceMark("init summer compiler"),await this.process.init(this.options,e,s),await this.loadStatus(),performanceMark("init summer compiler",!0)}async loadStatus(){var e;this.status=await(null===(e=this.process)||void 0===e?void 0:e.runTask("loadStatus"))}destroy(){this.process.destroy(),this.messageHub.clear()}async clearCache(){var e;await(null===(e=this.process)||void 0===e?void 0:e.runTask("clearCache")),this.codeCache.clear(),this.promiseCache.clear()}updateOptions(e){var s;lodash_1.default.isEqual(e,this.options)||(this.options=e,this.promiseCache.clear(),this.codeCache.clear(),null===(s=this.process)||void 0===s||s.sendEvent("updateOptions",e),this.loadStatus())}fileChange(e,s){if("change"!==e||s.endsWith(".json"))for(const e of this.promiseCache.keys())e.startsWith("getConf-")&&this.promiseCache.delete(e);this.invalidCodeCache(),this.process.sendEvent("fileChange",{type:e,targetPath:s})}invalidCodeCache(){for(const e of this.codeCache.values())e.isValid=!1}async getConf(e){const s="getConf-"+e;if(this.promiseCache.has(s))return console.log(s,"hit cache"),this.promiseCache.get(s);{console.log(s,"do request"),performanceMark("request get conf");const t={graphId:e},r=this.process.runTask("getConf",t,this.onProgressUpdate);return this.promiseCache.set(s,r),performanceMark("request get conf",!0),r}}async getCode(e,s){const t=`getCode-${e}${s?"-"+s.package:""}`;if(this.promiseCache.has(t))return console.log(t,"hit promise cache"),this.promiseCache.get(t);{const r=this.codeCache.get(t);if(null==r?void 0:r.isValid)return r.codeFiles;console.log(t,"do request");const i={};if(r){const e=r.codeFiles;for(const s of Object.keys(e)){const t=e[s];"error"in t||(i[s]=t.md5)}}const o={graphId:e,cacheMd5:i,package:null==s?void 0:s.package};performanceMark("request get code");const a=Date.now();console.time("[summer-compiler] runTask "+t),console.log(`[summer-compiler] [${(0,recorder_1.getPrintTime)()}] runTask ${t}`);const n=this.process.runTask("getCode",o,this.onProgressUpdate).then(e=>{var s;console.timeEnd("[summer-compiler] runTask "+t);const r=(null===(s=this.codeCache.get(t))||void 0===s?void 0:s.codeFiles)||{};for(const s of Object.keys(e)){const t=e[s];"error"in t||""!==t.md5?r[s]=t:delete r[s]}return this.codeCache.set(t,{isValid:!0,codeFiles:r}),r},e=>{throw e.code?console.error(e):console.error("Unexpected error when getCode",e),this.messageHub.clear(),e});return n.finally(()=>{performanceMark("request get code",!0),console.log(`[summer-compiler] [${(0,recorder_1.getPrintTime)()}] [cost ${Date.now()-a}ms] runTask ${t}`),this.promiseCache.delete(t)}),this.promiseCache.set(t,n),n}}async ready(){return this.process.initedPromise}async getAppJSON(e,s){return(await this.getConf(miniprogram)).app}async getPageJSON(e,s){const t=await this.getConf(miniprogram),r=t.pages[s]||t.comps[s];if(!r)throw new Error("summer-compiler 收集json配置有遗漏, "+s);return r}async getAllPageAndComponentJSON(){const e=await this.getConf(miniprogram);return Object.keys(e.pages).concat(Object.keys(e.comps))}async getAllSortedJSFiles(){const e=await this.getConf(miniprogram),s=Object.keys(e.pages),t=Object.keys(e.comps),r=s.filter(e=>!t.includes(e)).map(e=>e+".js"),i=t.map(e=>e+".js"),o=await this.getCode(miniprogram,{package:exports.FullPkg}),a=Object.keys(o).filter(e=>e.endsWith(".js")&&"app.js"!==e&&!r.includes(e)&&!i.includes(e));return{jsPagesFiles:r,components:i,otherJsFiles:a}}async getWxmlAndWxsFiles(e){let s=await this.getCode(miniprogram,{package:e});if(e!==exports.MainPkg){const e=await this.getCode(miniprogram,{package:exports.MainPkg});s=Object.assign(Object.assign({},s),e)}const t=Object.keys(s).filter(e=>e.endsWith(".wxml")),r=Object.keys(s).filter(e=>e.endsWith(".wxs"));return{wxmlFiles:t,wxsFiles:r,content:t.concat(r).reduce((e,t)=>{const r=s[t];if("error"in r)throw r.error;return e[t]=r.code,e["./"+t]=r.code,e},{})}}async getWxssFiles(e){let s=await this.getCode(miniprogram,{package:e});if(e!==exports.MainPkg){const e=await this.getCode(miniprogram,{package:exports.MainPkg});s=Object.assign(Object.assign({},s),e)}const t=Object.keys(s).filter(e=>e.endsWith(".wxss"));return{wxssFiles:t,content:t.reduce((e,t)=>{const r=s[t];if("error"in r)throw r.error;return e[t]=r.code,e["./"+t]=r.code,e},{})}}getWxssMap(e,s){s=(0,tools_1.normalizePath)(s);for(const[t,r]of this.codeCache.entries())if(t.startsWith("getCode-"+e)){const e=r.codeFiles[s];if(e&&!("error"in e))return e.map}}async getMainPkgSortedJSFiles(){const e=await this.getConf(miniprogram),s=await this.getCode(miniprogram,{package:"__APP__"}),t=Object.keys(s).filter(e=>e.endsWith(".js")),r=[],i=[],o=[],a=[],n=[];let c=!1;const p={},h=s=>Object.keys(e.packages).find(e=>s.startsWith(e))||exports.MainPkg;e.app.functionalPages&&t.forEach(e=>{if(e.startsWith("functional-pages/")){const s=e.replace(/\.js$/,"");if(p[s])return;p[s]=!0,n.push(encodeURI(s))}}),e.app.workers&&t.forEach(s=>{if(s.startsWith((0,tools_1.getWorkersPath)(e.app.workers))){const e=s.replace(/\.js$/,"");if(p[e])return;p[e]=!0,a.push(e)}});Object.keys(e.comps).filter(e=>h(e)===exports.MainPkg).forEach(s=>{if((s.startsWith("miniprogram_npm/weui-miniprogram")||s.startsWith("weui-miniprogram"))&&e.app.useExtendedLib&&e.app.useExtendedLib.weui)return;if(p[s])return;p[s]=!0;const t=encodeURI(s);o.push(""+t)});Object.keys(e.pages).filter(e=>h(e)===exports.MainPkg).forEach(e=>{if(p[e])return;p[e]=!0;const s=encodeURI(e);r.push(""+s)}),t.forEach(e=>{const s=e.replace(/\.js$/,"");p[s]||(p[s]=!0,"app.js"!==e?i.push(""+encodeURI(s)):c=!0)});const l=[...i,...o,...r];return c&&l.push("app"),{hasAppJS:c,allFiles:l,pageFiles:r,componentFiles:o,workerFiles:a,functionalPageFiles:n,otherFiles:i}}async getSubPkgSortedJSFiles(e){const s=await this.getConf(miniprogram),t=await this.getCode(miniprogram,{package:e}),r=Object.keys(t).filter(e=>e.endsWith(".js")),i=[],o=[],a={},n=e=>Object.keys(s.packages).find(s=>e.startsWith(s))||exports.MainPkg;Object.keys(s.comps).filter(s=>n(s)===e).forEach(e=>{if((e.startsWith("miniprogram_npm/weui-miniprogram")||e.startsWith("weui-miniprogram"))&&s.app.useExtendedLib&&s.app.useExtendedLib.weui)return;if(a[e])return;a[e]=!0;const t=encodeURI(e);o.push(""+t)});Object.keys(s.pages).filter(s=>n(s)===e).forEach(e=>{if(a[e])return;a[e]=!0;const s=encodeURI(e);i.push(""+s)});const c=r.map(e=>""+encodeURI(e.replace(/\.js$/,"")));return{allFiles:c,pageFiles:i,componentFiles:o,otherFiles:c.filter(e=>!i.includes(e)&&!o.includes(e))}}async compileJS(e,s){let t;if(s.root===e.miniprogramRoot){const e=await this.getConf(miniprogram),r=Object.keys(e.packages).find(e=>s.filePath.startsWith(e))||exports.MainPkg;t=(await this.getCode(miniprogram,{package:r,partialCompilePath:[]}))[s.filePath]}else{t=(await this.getCode(plugin))[s.filePath]}if(!t){const e=new Error(`summer-compiler miss ${s.root} js file, ${s.filePath}`);throw e.code="ENOENT",e}if("error"in t)throw t.error;return Object.assign({filePath:s.filePath,code:t.code,map:t.map},t.jsTag)}async compile(e,s){const t=await this.process.runTask("compile",{},(e,t,r)=>{s.onProgressUpdate({id:e,status:t,message:r})});for(const e of Object.keys(t))"object"==typeof t[e]&&"Buffer"===t[e].type&&(t[e]=Buffer.from(t[e].data));return t}async getPluginJSON(e,s=""){return(await this.getConf(plugin)).plugin}async getPluginPageJSON(e,s){const t=await this.getConf(plugin),r=t.pages[s]||t.comps[s];if(!r)throw new Error("summer-compiler 收集plugin json配置有遗漏, "+s);return r}async getPluginJSFiles(){const e=await this.getCode(plugin);return Object.keys(e).filter(e=>e.endsWith(".js"))}async getPluginComponents(){const e=await this.getConf(plugin),s=new Set(Object.keys(e.pages).concat(Object.keys(e.comps)));return Array.from(s)}async getPluginWxssFiles(){const e=await this.getCode(plugin),s=Object.keys(e).filter(e=>e.endsWith(".wxss"));return{wxssFiles:s,content:s.reduce((s,t)=>{const r=e[t];if("error"in r)throw r.error;return s[t]=r.code,s["./"+t]=r.code,s},{})}}async getPluginWxmlAndWxsFiles(){const e=await this.getCode(plugin),s=Object.keys(e).filter(e=>e.endsWith(".wxml")),t=Object.keys(e).filter(e=>e.endsWith(".wxs"));return{wxmlFiles:s,wxsFiles:t,content:s.concat(t).reduce((s,t)=>{const r=e[t];if("error"in r)throw r.error;return s[t]=r.code,s["./"+t]=r.code,s},{})}}async checkThemeJSON(e,s){return(await this.getConf(miniprogram)).theme}setProxy(e){(0,request_1.setCiProxy)(e)}setLocale(e){this.process.runTask("setLocale",e)}async uglifyFileNames(e,s,t){return await(0,uglifyfilenames_1.uglifyFileNames)(e,s,t)}async getLocalFileList(){return this.process.runTask("getLocalFileList",miniprogram)}async getPluginLocalFileList(){return this.process.runTask("getLocalFileList",plugin)}async packNpm(e){throw new Error("packNpm not implemented")}async packNpmManually(e){throw new Error("packNpmManually not implemented")}async getGameJSON(e){throw new Error("getGameJSON not implemented")}}exports.SummerCompiler=SummerCompiler;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/request":1679975017835,"./recorder":1679975017931,"../utils/tools":1679975017847,"../core/protect/uglifyfilenames":1679975017925,"./error":1679975017901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017938, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.Resolver=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),targetCodeExts=["json","wxml","wxss","js","wxs"];function getAllExts(t){const e=[];for(const s of targetCodeExts)for(const o of t[s])e.includes(o)||e.push(o);return e}function getExtToTarget(t){const e={};for(const s of targetCodeExts){const o=[];for(const i of t[s])e[i]=e[i]||{},e[i][s]=[...o],o.push(i)}return e}class Resolver{constructor(t,e,s){this.graph=t,this.root=e,this.extConf=s,this.fileSet=new Set,this.resolveInfoMap=new Map,this.onFileChange=(t,e)=>{var s;if(this.isCodeFile(e)&&("unlink"===t||"add"===t))if("add"===t)this.updateFile(e);else{const t=this.getExt(e),o=this.resolve(e);for(const e of o){const o=this.getExt(e.path);this.resolveInfoMap.delete(e.path);for(const i of this.extToTarget[t][o]){const t=e.path.slice(0,e.path.length-o.length)+i;if(null===(s=this.graph.project.stat(this.root,t))||void 0===s?void 0:s.isFile){this.updateFile(t);break}}}}},this.allExts=getAllExts(s),this.extToTarget=getExtToTarget(s),this.updateFiles()}updateFiles(){const t=this.graph.project.getFileList(this.root).map(t=>t.replace(new RegExp("^"+this.root),""));for(const e of t){const t=this.getExt(e);this.allExts.includes(t)&&(this.fileSet.add(e),this.updateFile(e))}}resolve(t){const e=[];if(this.isCodeFile(t))for(const s of this.resolveInfoMap.values())s.source===t&&e.push(s);return e}stat(t){return this.resolveInfoMap.has(t)?{isFile:!0,isDirectory:!1}:void 0}isCodeFile(t){const e=path_1.default.extname(t).replace(/^./,"");return this.allExts.includes(e)}getExt(t){return path_1.default.extname(t).replace(/^./,"")}updateFile(t){if(t.endsWith(".d.ts"))return;const e=this.getExt(t);for(const s of targetCodeExts)if(this.extToTarget[e][s]){const o=t.substr(0,t.length-e.length)+s,i=this.resolveInfoMap.get(o);if(i){if(!this.extToTarget[e][s].includes(i.sourceExt))continue}this.resolveInfoMap.set(o,{path:o,source:t,sourceExt:e})}}}exports.Resolver=Resolver;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017939, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.PluginConf=exports.resolvePath=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),core_1=require("../../core"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales"));function resolvePath(t,o){const e=path_1.default.posix.dirname(t);let s=null;return s=o.startsWith("/")?o.replace(/^\//,""):path_1.default.posix.join(e,o),s}exports.resolvePath=resolvePath;class PluginConf{constructor(t,o){this.graph=o,this.pages=new Map,this.comps=new Map,this.proxyProject=t.proxyProject,this.proxyProject.addResolver(o.resolver)}destroy(){this.proxyProject.removeResolver(this.graph.resolver)}async build(t){this.resetState(),await this.loadPlugin(t)}async resetState(){this.plugin=void 0,this.pages.clear(),this.comps.clear()}async loadPlugin(t){const o=await t.run(locales_1.default.config.SUMMER_COMPILE.format("plugin.json"),()=>(0,core_1.getPluginJSON)(this.proxyProject));this.plugin=o;const e=new Set;for(const t of Object.values(o.pages||{}))e.add(t);await t.run(locales_1.default.config.SUMMER_COMPILE_PLUGIN_PAGE_JSON.format(e.size),async()=>{for(const[t]of e.entries())await this.loadPage(t);for(const t of Object.values(o.publicComponents||{}))await this.loadComp(t);for(const t of Object.values(o.usingComponents||{}))await this.loadComp(t)})}async loadPage(t){const o=await(0,core_1.getPluginPageJSON)({project:this.proxyProject,root:this.graph.root,filePath:path_1.default.posix.join(this.graph.root,t+".json")});this.pages.set(t,o);for(const e of Object.values(o.usingComponents||{})){const o=resolvePath(t,e);await this.loadComp(o)}}async loadComp(t){if(this.comps.has(t))return;const o=await(0,core_1.getPluginPageJSON)({project:this.proxyProject,root:this.graph.root,filePath:path_1.default.posix.join(this.graph.root,t+".json")});this.comps.set(t,o);for(const e of Object.values(o.usingComponents||{})){const o=resolvePath(t,e);await this.loadComp(o)}}}exports.PluginConf=PluginConf;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../core":1679975017916,"../../utils/locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017940, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.AppGraph=void 0;const tools_1=require("../../utils/tools"),mpjson_1=require("../../core/compile/handler/mpjson"),devtool_1=require("../devtool"),recorder_1=require("../recorder"),appconf_1=require("./appconf"),basegraph_1=require("./basegraph");class AppGraph extends basegraph_1.BaseGraph{constructor(e){super(e),this.appConf=new appconf_1.AppConf(this.compiler,this)}destroy(){this.appConf.destroy(),super.destroy()}async getConf(e){return await this.appConf.build(e),this.conf={app:this.appConf.app,packages:Object.fromEntries(this.appConf.packages.entries()),pages:Object.fromEntries(this.appConf.pages.entries()),comps:Object.fromEntries(this.appConf.comps.entries()),sitemap:this.appConf.sitemap,theme:this.appConf.theme},this.conf}async ensureConf(e){this.conf||await this.getConf(e)}async compileSingleCode(e,t){await this.ensureConf(recorder_1.silentRecorder);const s=this.resolver.resolveInfoMap.get(e);if(s)return super.doCompileSingleCode(Object.assign(Object.assign({},s),{independentRoot:this.getIndependentRoot(s.path),isBabelIgnore:this.isBabelSettingIgnore(s)}),t);throw new Error("file not found")}async getDevCode(e,t){await this.ensureConf(e);let s=this.getPackageFile(t.package);return s=s.filter(e=>!e.path.endsWith("json")),this.getCodeFiles(s,e)}async getProdCode(e,t){await this.ensureConf(e);let s=this.getPackageFile(t.package);return s=s.filter(e=>!e.path.endsWith("json")),this.getCodeFiles(s,e,!1)}getLocalCodeFileList(){return Array.from(this.resolver.resolveInfoMap.entries()).map(([e,t])=>t.source)}onFileChangeForGraph(e,t){this.appConf.onFileChange(e,t)}getPackageFile(e){const t=[];for(const[s,o]of this.resolver.resolveInfoMap.entries())e!==devtool_1.FullPkg&&this.checkFilePackage(s)!==e||t.push(o);return t.map(e=>Object.assign(Object.assign({},e),{independentRoot:this.getIndependentRoot(e.path),isBabelIgnore:this.isBabelSettingIgnore(e)}))}getIndependentRoot(e){for(const t of Object.values(this.conf.packages))if(!0===t.independent){const s=t.root.replace(/^\//,"");if(e.startsWith(s))return s}if("object"==typeof this.conf.app.functionalPages&&!0===this.conf.app.functionalPages.independent&&e.startsWith("functional-pages/"))return"functional-pages";if("string"==typeof this.conf.app.openDataContext&&e.startsWith(this.conf.app.openDataContext))return this.conf.app.openDataContext;const t=this.conf.app.workers&&(0,tools_1.getWorkersPath)(this.conf.app.workers);return t&&e.startsWith(t)?t:""}checkFilePackage(e){for(const t of Object.keys(this.conf.packages))if(e.startsWith(t))return t;return devtool_1.MainPkg}async compileJSON(){const e=await this.getConf(recorder_1.silentRecorder),t={};t["app.json"]=JSON.stringify(e.app);const s={};for(const t in e.pages)s[t+".json"]=JSON.stringify(e.pages[t]);const o={};for(const t in e.comps)o[t+".json"]=JSON.stringify(e.comps[t]);return(0,mpjson_1.addSkylineRendererToComponents)(s,o),{conf:e,jsons:Object.assign(Object.assign(Object.assign({},t),s),o)}}}exports.AppGraph=AppGraph;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/tools":1679975017847,"../../core/compile/handler/mpjson":1679975017928,"../devtool":1679975017937,"../recorder":1679975017931,"./appconf":1679975017941,"./basegraph":1679975017934}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017941, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.AppConf=exports.resolvePath=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),core_1=require("../../core"),common_1=require("../../core/json/common"),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales"));function resolvePath(t,o){const e=path_1.default.posix.dirname(t);let s=null;return s=o.startsWith("/")?o.replace(/^\//,""):path_1.default.posix.join(e,o),s}function isPluginPath(t){return t.startsWith("plugin://")||t.startsWith("plugin-private://")}exports.resolvePath=resolvePath;class AppConf{constructor(t,o){this.graph=o,this.packages=new Map,this.pages=new Map,this.comps=new Map,this.onFileChange=(t,o)=>{},this.proxyProject=t.proxyProject,this.proxyProject.addResolver(o.resolver)}destroy(){this.proxyProject.removeResolver(this.graph.resolver)}async build(t){this.resetState(),await this.loadApp(t)}async resetState(){this.app=void 0,this.packages.clear(),this.pages.clear(),this.comps.clear(),this.sitemap=void 0,this.theme=void 0}async loadApp(t){const o=await t.run(locales_1.default.config.SUMMER_COMPILE.format("app.json"),()=>(0,core_1.getAppJSON)(this.proxyProject));this.app=o;const e=new Set;for(const t of o.pages)e.add(t);const s=o.subPackages||[];for(const t of s){const o=t.root;this.packages.set(o,t);for(const s of t.pages)e.add(path_1.default.posix.join(o,s))}await t.run(locales_1.default.config.SUMMER_COMPILE_PAGE_JSON.format(e.size),async()=>{var t;for(const[t]of e.entries())isPluginPath(t)||await this.loadPage(t);for(const t of Object.values(o.usingComponents||{}))if(!isPluginPath(t)){const o=resolvePath("app.json",t);await this.loadComp(o,t,"app.json")}if(null===(t=o.tabBar)||void 0===t?void 0:t.custom){const t=resolvePath("app.json","custom-tab-bar/index");await this.loadComp(t,"custom-tab-bar/index","app.json")}}),o.themeLocation&&await t.run(locales_1.default.config.SUMMER_COMPILE.format(o.themeLocation),()=>this.loadTheme(o.themeLocation))}async loadPage(t){const o=await(0,core_1.getPageJSON)(this.proxyProject,{miniprogramRoot:this.graph.root,pagePath:t});this.pages.set(t,o);const e=async o=>{if(isPluginPath(o))return;const e=resolvePath(t,o);await this.loadComp(e,o,t)};if(o.usingComponents)for(const t of Object.values(o.usingComponents))await e(t);if(o.componentGenerics)for(const t of Object.values(o.componentGenerics)){const o=t.default;o&&await e(o)}}async loadComp(t,o,e){if(await this.isExtendedLibComp(t,e))return;if(this.comps.has(t))return;if(!this.proxyProject.stat(this.graph.root,t+".json"))throw new Error(`[summer-compiler] Couldn't found the '${o}.json' file relative to '${e}.json'`);const s=await(0,core_1.getPageJSON)(this.proxyProject,{miniprogramRoot:this.graph.root,pagePath:t});this.comps.set(t,s);const a=async o=>{if(isPluginPath(o))return;const e=resolvePath(t,o);await this.loadComp(e,o,t)};if(s.usingComponents)for(const t of Object.values(s.usingComponents))await a(t);if(s.componentGenerics)for(const t of Object.values(s.componentGenerics)){const o=t.default;o&&await a(o)}}async loadTheme(t){const o=await(0,core_1.checkThemeJSON)(this.proxyProject,{themeLocation:t});this.theme=o}async isExtendedLibComp(t,o){if(t.startsWith("miniprogram_npm/")){const e=(0,common_1.getUseExtendLib)(this.proxyProject,o);if(e.length>0){const o=e.map(t=>"miniprogram_npm/"+t);for(const e of o)if(t.startsWith(e))return!0}}return!1}}exports.AppConf=AppConf;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../core":1679975017916,"../../core/json/common":1679975017853,"../../utils/locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017942, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),tools_1=require("../utils/tools"),fs=(0,tslib_1.__importStar)(require("fs-extra")),path_1=(0,tslib_1.__importDefault)(require("path"));class PersistCache{constructor(e){this.cachePath=e}getFilePath(e){const t=(0,tools_1.generateMD5)(e);return{cacheFile:path_1.default.join(this.cachePath,t),infoFile:path_1.default.join(this.cachePath,t+".json")}}async get(e){const{cacheFile:t,infoFile:a}=this.getFilePath(e);try{const e=await fs.readFile(a,"utf8"),s=JSON.parse(e);return{data:await fs.readFile(t,{encoding:s.encoding||null}),info:s}}catch(e){}return{}}async set(e,t){var a;const{cacheFile:s,infoFile:i}=this.getFilePath(e);try{const e=(null===(a=t.info)||void 0===a?void 0:a.encoding)||null;await fs.writeFile(s,t.data,e),await fs.writeFile(i,JSON.stringify(t.info),"utf8")}catch(e){}}async remove(e){const{cacheFile:t,infoFile:a}=this.getFilePath(e);try{await fs.unlink(t),await fs.unlink(a)}catch(e){}}async clean(){const e=fs.readdirSync(this.cachePath);await Promise.all(e.map(async e=>{try{await fs.unlink(path_1.default.join(this.cachePath,e))}catch(e){}}))}}class FakePersistCache{async get(e){return{}}async set(e,t){}async remove(e){}async clean(){}}class LogicPersistCache{constructor(e,t){this.baseCacheKey=t,this.persistCache=e?new PersistCache(e):new FakePersistCache}updateBaseCacheKey(e){this.baseCacheKey!==e&&(this.persistCache.clean(),this.baseCacheKey=e)}getCacheKey(e){return`${e.independentRoot}|${e.source}`}async get(e,t,a){var s;const i=path_1.default.posix.join(e,t,a.path),c=path_1.default.posix.join(e,t,a.source),n=await this.persistCache.get(i);if((null===(s=n.info)||void 0===s?void 0:s.baseCacheKey)===this.baseCacheKey){if(n.info&&n.info.cacheKey===this.getCacheKey(a)){const e=fs.statSync(c);if(n.info.mtimeMs===e.mtimeMs)return console.log("use cache",a.path),JSON.parse(n.data)}}else this.persistCache.remove(i)}async set(e,t,a,s){const i=path_1.default.posix.join(e,t,a.path),c=path_1.default.posix.join(e,t,a.source),n=fs.statSync(c);this.persistCache.set(i,{info:{encoding:"utf8",cacheKey:this.getCacheKey(a),baseCacheKey:this.baseCacheKey,mtimeMs:n.mtimeMs},data:JSON.stringify(s)})}async clean(){this.persistCache.clean()}}exports.default=LogicPersistCache;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017943, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compile=exports.compilePlugin=void 0;const tslib_1=require("tslib"),mini_program_1=require("./mini_program"),common_1=require("./common"),plugin_1=require("../json/plugin/plugin"),plugin_page_1=require("../json/plugin/plugin_page"),white_ext_list_1=require("../../utils/white_ext_list"),path_1=(0,tslib_1.__importDefault)(require("path")),projectconfig_1=require("../json/projectconfig"),summer=(0,tslib_1.__importStar)(require("../../summer/ci"));async function compilePlugin(i,e){const t=await(0,projectconfig_1.getProjectConfigJSON)(i),{MiniProgramWhiteList:o}=await(0,white_ext_list_1.getWhiteExtList)(),n=t.pluginRoot,s=i.getFileList(n,"").filter(common_1.isNotIgnoredByProjectConfig.bind(null,t,n)).filter(i=>o.has(path_1.default.posix.extname(i))),a=await(0,plugin_1.getDevPluginJSON)(i,!1),l=s.filter(i=>".json"===path_1.default.posix.extname(i)&&i!==path_1.default.posix.join(n,"plugin.json")),p={};for(const e of l){const t=await(0,plugin_page_1.getPluginPageJSON)({project:i,root:n,filePath:e});p[e]=JSON.stringify(t)}const r=s.filter(i=>".js"===path_1.default.posix.extname(i)).map(i=>path_1.default.posix.relative(n,i)),m=await(0,common_1.compileJSFiles)(i,r,n,e),g=s.filter(i=>".wxss"===path_1.default.posix.extname(i)).map(i=>path_1.default.posix.relative(n,i)),u=await(0,common_1.compileWXSSFiles)(i,g,n,e),c=s.filter(i=>".wxml"===path_1.default.posix.extname(i)).map(i=>path_1.default.posix.relative(n,i)),_=await(0,common_1.compileWXMLFiles)(i,c,n,e),f=s.filter(i=>{const e=path_1.default.posix.extname(i);return".js"!==e&&".json"!==e&&".wxss"!==e&&".wxml"!==e}),j=await(0,common_1.compileOther)(i,f,e);return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({[path_1.default.posix.join(n,"plugin.json")]:JSON.stringify(a)},p),m),j),u),_)}async function compile(i,e){var t;const o=await(0,projectconfig_1.getProjectConfigJSON)(i);if(null===(t=o.setting)||void 0===t?void 0:t.useCompilerPlugins)return summer.compile(i,o,e,o.setting.useCompilerPlugins);const n=await compilePlugin(i,e),s=await(0,mini_program_1.compile)(i,e);return Object.assign(Object.assign(Object.assign({},n),s),{"project.config.json":JSON.stringify({miniprogramRoot:o.miniprogramRoot,pluginRoot:o.pluginRoot,__compileDebugInfo__:e.__compileDebugInfo__||{}})})}exports.compilePlugin=compilePlugin,exports.compile=compile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./mini_program":1679975017927,"./common":1679975017877,"../json/plugin/plugin":1679975017868,"../json/plugin/plugin_page":1679975017919,"../../utils/white_ext_list":1679975017924,"../json/projectconfig":1679975017851,"../../summer/ci":1679975017929}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017944, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.compile=exports.compilePlugin=void 0;const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),projectconfig_1=require("../json/projectconfig"),common_1=require("./common"),plugin_1=require("../json/plugin/plugin"),game_1=require("./game"),white_ext_list_1=require("../../utils/white_ext_list");async function compilePlugin(e,i){const t=await(0,projectconfig_1.getProjectConfigJSON)(e),o=t.pluginRoot,{GameWhiteList:n}=await(0,white_ext_list_1.getWhiteExtList)(),l=e.getFileList(o,"").filter(common_1.isNotIgnoredByProjectConfig.bind(null,t,o)).filter(e=>n.has(path_1.default.posix.extname(e))),a=await(0,plugin_1.getDevPluginJSON)(e,!1),s=l.filter(e=>".js"===path_1.default.posix.extname(e)).map(e=>path_1.default.posix.relative(o,e)),p=await(0,common_1.compileJSFiles)(e,s,o,i),c=l.filter(e=>".js"!==path_1.default.posix.extname(e)&&e!==path_1.default.posix.join(o,"plugin.json")),r=await(0,common_1.compileOther)(e,c,i);return Object.assign(Object.assign({[path_1.default.posix.join(o,"plugin.json")]:JSON.stringify(a)},p),r)}async function compile(e,i){const t=await(0,projectconfig_1.getProjectConfigJSON)(e),o=await compilePlugin(e,i),n=await(0,game_1.compile)(e,i),l=await(0,common_1.getUploadProjectConfig)(e,t);return l.__compileDebugInfo__=i.__compileDebugInfo__||{},Object.assign(Object.assign(Object.assign({},o),n),{"project.config.json":JSON.stringify(l)})}exports.compilePlugin=compilePlugin,exports.compile=compile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../json/projectconfig":1679975017851,"./common":1679975017877,"../json/plugin/plugin":1679975017868,"./game":1679975017872,"../../utils/white_ext_list":1679975017924}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017945, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.pack=void 0;const B_PROTOCOL=0,B_PROTOCOL_VERSION=1,B_FILEINFO_LEN=2,B_FILEDATA_LEN=3,B_PROTOCOL_END=4;function pack(t){const e=[Buffer.alloc(1),Buffer.alloc(4),Buffer.alloc(4),Buffer.alloc(4),Buffer.alloc(1)];e[0][0]=190,e[1].writeInt32BE(0,0),e[4][0]=237;const f=Object.keys(t),r=f.length,c=[],n=[];let o=0;for(const e of f){const f=e.replace(/\\/g,"/"),r=f.startsWith("/")?f:"/"+f,l=Buffer.from(r);c.push(l);const a=t[e];let B;if(a instanceof Buffer)B=a;else{if("string"!=typeof a)throw new Error("pack invalid data: "+e);B=Buffer.from(a,"utf8")}n.push(B),/\.js\.map$/.test(e)||(o+=B.length,o+=l.length)}let l=18+12*r+Buffer.concat(c).length;const a=c.map((t,e)=>{const f=Buffer.alloc(4);f.writeInt32BE(t.length,0);const r=Buffer.alloc(4),c=n[e].length,o=l;r.writeInt32BE(o,0),l+=c;const a=Buffer.alloc(4);return a.writeInt32BE(c,0),Buffer.concat([f,t,r,a])}),B=Buffer.alloc(4);B.writeInt32BE(r,0),a.unshift(B);const s=Buffer.concat(a),u=Buffer.concat(n);e[2].writeInt32BE(s.length,0),e[3].writeInt32BE(u.length,0);const i=Buffer.concat(e);return{validSize:o,buffer:Buffer.concat([i,s,u])}}exports.pack=pack;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017946, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.uploadByCos=void 0;const tslib_1=require("tslib"),url_config_1=require("../utils/url_config"),tools_1=require("../utils/tools"),request_1=require("../utils/request"),sign_1=require("../utils/sign"),pack_1=require("./utils/pack"),zlib=require("zlib"),crypto=require("crypto"),config_1=require("../config"),upload_1=require("./upload"),log_1=(0,tslib_1.__importDefault)(require("../utils/log")),jsonParse_1=require("../utils/jsonParse"),COS=require("cos-nodejs-sdk-v5");async function putBufferToCos(e,t){const r=new COS({Proxy:(0,request_1.getCiProxy)(),getAuthorization(e,r){r({TmpSecretId:t.secret_id,TmpSecretKey:t.secret_key,XCosSecurityToken:t.token,ExpiredTime:t.expired_time})}});try{return await new Promise((o,i)=>{r.putObject({Bucket:t.bucket,Region:"ap-shanghai",Key:t.object,Body:e,onProgress(e){}},(e,t)=>{if(e)return console.error(e),i(e.error);o(t)})})}catch(e){throw new Error("upload to cos failed: "+e.message)}}async function innerRequest(e,t){const r=await(0,request_1.request)({url:e,method:"post",body:t,headers:{"content-type":"application/json"}});let o;try{o=JSON.parse(r.body)}catch(t){const r=`request ${e} failed: resp body is not a valid json`;throw log_1.default.error(r),new Error(r)}if(0!==o.errCode)throw new Error(`request failed, errCode: ${o.errCode}, errMsg: ${o.errMsg}`);return o.data}async function uploadByCos(e,t,r,o){let i;try{const e=await(0,sign_1.getSignature)(r.privateKey,r.appid);i=await innerRequest(url_config_1.GET_UPLOAD_TOKEN,JSON.stringify({appid:r.appid,signature:e,robot:o}))}catch(e){return console.error("uploadToken error",e),{fallback:!0}}const s=e,a=crypto.randomBytes(12),n=crypto.createCipheriv("aes-256-gcm",Buffer.from(i.crypt_key,"base64"),a),u=Buffer.concat([n.update(s),n.final()]),c=n.getAuthTag(),l=Buffer.alloc(1);l.writeUInt8(c.length+a.length,0);const p=Buffer.concat([l,c,a,u]),d=Date.now();await putBufferToCos(p,i);const _=Date.now()-d,f=(0,tools_1.generateMD5)(s),g=await(0,sign_1.getSignature)(r.privateKey,r.appid),y=`${t}&task_id=${i.task_id}&new_hash=${f}&upload_cos_cost_time=${_}`;log_1.default.info("request url:",y);let w=await(0,request_1.request)({url:y,method:"post",body:zlib.gzipSync((0,pack_1.pack)({[upload_1.SIGNATURE_FILE_NAME]:JSON.stringify({signature:g,version:config_1.CI_VERSION})}).buffer)});if(0!==(0,jsonParse_1.jsonRespParse)(w.body.toString(),t).errCode)throw new Error(w.body.toString());for(;;){const e=await(0,sign_1.getSignature)(r.privateKey,r.appid),t=await innerRequest(`${url_config_1.GET_ASYNC_RESULT}?task_id=${i.task_id}`,JSON.stringify({appid:r.appid,signature:e,robot:o}));if(1!==t.status){if(0===t.status)return{fallback:!1,body:t,uploadCOSCostTime:_};if(3===t.status)throw new Error(`upload failed with status ${t.status}, task not found`);throw new Error("upload failed with status "+t.status)}await new Promise(e=>{setTimeout(e,1e3)})}}exports.uploadByCos=uploadByCos;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/url_config":1679975017845,"../utils/tools":1679975017847,"../utils/request":1679975017835,"../utils/sign":1679975017838,"./utils/pack":1679975017945,"../config":1679975017839,"./upload":1679975017870,"../utils/log":1679975017836,"../utils/jsonParse":1679975017846}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017947, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.filterUnusedFile=void 0;const tslib_1=require("tslib"),projectconfig_1=require("../../core/json/projectconfig"),path=(0,tslib_1.__importStar)(require("path")),code_analyse_1=require("../../vendor/code-analyse"),code_analyse_2=require("../code-analyse"),babel_helper_1=require("../../utils/babel_helper"),tools_1=require("../../utils/tools");class CodeDataFileHelper{constructor(e,t){this.project=e,this.codes=t,this._dirSet=new Set,this._fileSet=new Set,this._cacheFileSize=new Map;for(const e of Object.keys(this.codes))this._fileSet.add(e),this.cacheDirName(path.posix.dirname(e))}cacheDirName(e){this._dirSet.has(e)||(this._dirSet.add(e),this.cacheDirName(path.posix.dirname(e)))}cacheFileSize(e){if(this._cacheFileSize.has(e))return this._cacheFileSize.get(e);const t=this.codes[e];let i=0;return i="string"==typeof t?Buffer.from(t,"utf-8").length:t.length,this._cacheFileSize.set(e,i),i}stat(e){const t=this._fileSet.has(e),i=this._dirSet.has(e);if(!t&&!i)return;let r=0;return r=i?Object.keys(this.codes).filter(t=>t.startsWith(e)).reduce((e,t)=>e+this.cacheFileSize(t),0):this.cacheFileSize(e),{isFile:t,isDirectory:i,size:r,mtime:0}}mtime(e){return 0}exist(e){return this.existFile(e)||this.existDir(e)}existDir(e){return e.endsWith("/")&&(e=e.replace(/\/$/,"")),this._dirSet.has(e)}existFile(e){return this._fileSet.has(e)}getFileList(e="",t=""){return Array.from(this._fileSet).filter(i=>(!t||path.extname(i)===t)&&!(e&&!i.startsWith(e)))}async getString(e){const t=this.codes[e];if("string"==typeof t)return t;if(Buffer.isBuffer(t))return t.toString("utf-8");throw new Error(e+" is not in codes")}async getLocalFileString(e){return this.project.getFile(this.project.miniprogramRoot,e).toString("utf-8")}async getJSON(e){const t=await this.getString(e);try{return JSON.parse(t)}catch(e){return null}}async readdir(e){e.endsWith("/")||(e+="/");const t=Array.from(this._fileSet).filter(t=>t.startsWith(e));return Array.from(this._dirSet).filter(t=>t.startsWith(e)).concat(t).filter(t=>t.slice(e.length).indexOf("/")<0).map(t=>t.slice(e.length))}watchFileChange(e){throw new Error("Method not implemented.")}}async function filterUnusedFile(e,t,i){var r,s;if("miniProgram"!==t.type)return i;const n=await(0,projectconfig_1.getProjectConfigJSON)(t);let o=!1;return o=e?!1!==(null===(r=n.setting)||void 0===r?void 0:r.ignoreDevUnusedFiles):!1!==(null===(s=n.setting)||void 0===s?void 0:s.ignoreUploadUnusedFiles),o?doFilterUnusedFile(t,i):i}function checkUnusedCodeFiles(e,t){const i=t.fileHelper.getFileList("").filter(e=>{return t=path.posix.extname(e),/\.(json|wxml|wxss|js|wxs|ts|less|sass|scss)/.test(t);var t}),r=new Set;t.graph.modules.forEach(e=>{const t=i.find(t=>t===e.path);t&&r.add(t)});const s=(0,babel_helper_1.getBabelOutputPath)((0,projectconfig_1.getProjectConfigJSON)(e));return i.forEach(e=>{(function(e){return e.indexOf(s)>=0})(e)&&r.add(e)}),i.filter(e=>!r.has(e))}async function doFilterUnusedFile(e,t){var i;const r=(0,projectconfig_1.getProjectConfigJSON)(e),s=(0,code_analyse_2.transCompileType)(e);if("gamePlugin"===s)throw new Error("gamePlugin is not support yet!");let n="plugin"===s?r.pluginRoot:r.miniprogramRoot;n=n?path.posix.join(e.projectPath,n):e.projectPath;const o=new CodeDataFileHelper(e,t),l=new code_analyse_1.Analyzer({root:n,type:s,fileHelper:o,plugins:[]});await l.analyse();const a=checkUnusedCodeFiles(e,l),c=(null===(i=r.packOptions)||void 0===i?void 0:i.include)||[];return((e,t)=>{const i=Object.keys(e);for(const r of i)t(r)&&delete e[r];return e})(t,e=>(e=>{if((0,tools_1.isFileIncluded)(e,c))return!1;const t=e.startsWith("/")?e:"/"+e;for(const e of a){if(t===(e.startsWith("/")?e:"/"+e))return!0}return!1})(e))}exports.filterUnusedFile=filterUnusedFile;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../core/json/projectconfig":1679975017851,"../../vendor/code-analyse":1679975017948,"../code-analyse":1679975017949,"../../utils/babel_helper":1679975017878,"../../utils/tools":1679975017847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017948, function(require, module, exports) {
//# sourceMappingURL=index.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017949, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.analyseCode=exports.transCompileType=void 0;const tslib_1=require("tslib"),projectconfig_1=require("../core/json/projectconfig"),code_analyse_1=require("../vendor/code-analyse"),path_1=(0,tslib_1.__importDefault)(require("path"));function transCompileType(e){if("miniProgram"===e.type)return"miniprogram";if("miniProgramPlugin"===e.type)return"plugin";if("miniGame"===e.type)return"game";if("miniGamePlugin"===e.type)return"gamePlugin";throw new Error("unknown compile type "+e.type)}exports.transCompileType=transCompileType;class LogPlugin{constructor(){this.name="LogPlugin"}onDepResolveFailed(e,o){var n,i;console.warn(`${null===(n=e.originModule)||void 0===n?void 0:n.type} module ${null===(i=e.originModule)||void 0===i?void 0:i.path} resolve dep failed`),console.warn(o)}onModuleBuildFailed(e,o,n){console.warn(`${e.type} module ${e.path} build failed`),console.warn(n)}}async function analyseCode(e,o){const n=(0,projectconfig_1.getProjectConfigJSON)(e),i=transCompileType(e);if("gamePlugin"===i)throw new Error("gamePlugin is not support yet!");let r="plugin"===i?n.pluginRoot:n.miniprogramRoot;r=r?path_1.default.posix.join(e.projectPath,r):e.projectPath;const t=new code_analyse_1.Analyzer({root:r,type:i,plugins:(null==o?void 0:o.silent)?[]:[new LogPlugin]});return await t.analyse(),t.serialize()}exports.analyseCode=analyseCode;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../core/json/projectconfig":1679975017851,"../vendor/code-analyse":1679975017948}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017950, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.preview=void 0;const tslib_1=require("tslib"),upload_1=require("./upload"),terminalQrcode_1=require("./utils/terminalQrcode"),fs_1=(0,tslib_1.__importDefault)(require("fs")),config_1=require("../config"),error_1=require("../utils/error"),locales_1=(0,tslib_1.__importDefault)(require("../utils/locales/locales")),log_1=(0,tslib_1.__importDefault)(require("../utils/log"));async function preview(e){const r=Object.assign({},e);if(r.test=!0,r.version="0.0.1",r.qrcodeFormat||(r.qrcodeFormat="terminal"),!["base64","image","terminal"].includes(r.qrcodeFormat))throw new error_1.CodeError(locales_1.default.config.INVALID.format("qrcodeFormat"),config_1.PARAM_ERROR);if(["base64","image"].includes(r.qrcodeFormat)&&("string"!=typeof r.qrcodeOutputDest||"."===r.qrcodeOutputDest.trim()))throw new error_1.CodeError(locales_1.default.config.INVALID.format("qrcodeOutputDest"),config_1.PARAM_ERROR);const o=await(0,upload_1.innerUpload)(r);if(!o.respBody.qrcode_img)throw new Error("No `qrcode_img` in response.");if("terminal"===r.qrcodeFormat)try{const e=await(0,terminalQrcode_1.generateTerminalQrcode)(o.respBody.qrcode_img);log_1.default.log(e),log_1.default.log("terminal qrcode shown above")}catch(e){log_1.default.error("Termianl qrcode generate failed, but you can still visit the dev version on your cell phone.")}else if(r.qrcodeOutputDest)if("image"===r.qrcodeFormat)try{fs_1.default.writeFileSync(r.qrcodeOutputDest,Buffer.from(o.respBody.qrcode_img,"base64")),log_1.default.info(`Qrcode image saved, file path: '${r.qrcodeOutputDest}'`)}catch(e){throw new Error("write qrcode image error: "+JSON.stringify(e))}else if("base64"===r.qrcodeFormat)try{fs_1.default.writeFileSync(r.qrcodeOutputDest,"data:image/jpeg;base64,"+o.respBody.qrcode_img,"utf8"),log_1.default.info(`Qrcode base64 file saved, file path: '${r.qrcodeOutputDest}'`)}catch(e){throw new Error("write qrcode base64 error: "+JSON.stringify(e))}return{subPackageInfo:o.subPackageInfo,pluginInfo:o.pluginInfo}}exports.preview=preview;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./upload":1679975017870,"./utils/terminalQrcode":1679975017951,"../config":1679975017839,"../utils/error":1679975017840,"../utils/locales/locales":1679975017841,"../utils/log":1679975017836}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017951, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateTerminalQrcode=void 0;const qrcodeTerminal=require("qrcode-terminal"),QrCode=require("qrcode-reader"),Jimp=require("jimp");async function generateTerminalQrcode(e){return new Promise((r,o)=>{const n=Buffer.from(e,"base64");Jimp.read(n,(function(n,t){n&&o(n);const c=new QrCode;c.callback=function(n,t){n&&o(n),t&&t.result?qrcodeTerminal.generate(t.result,e=>{r(e)}):o("qrcode decode error, no result, qrcodeDataURI: "+e)},c.decode(t.bitmap)}))})}exports.generateTerminalQrcode=generateTerminalQrcode;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017952, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDevSourceMap=void 0;const tslib_1=require("tslib"),fs_1=(0,tslib_1.__importDefault)(require("fs")),path_1=(0,tslib_1.__importDefault)(require("path")),log_1=(0,tslib_1.__importDefault)(require("../utils/log")),request_1=require("../utils/request"),url_config_1=require("../utils/url_config"),sign_1=require("../utils/sign"),JsZip=require("jszip"),ERR_MSG_PREFIX="download source map failed:";async function getExtAppId(e){let r,t={};try{r=await e.getFile(e.miniprogramRoot,"ext.json"),t=JSON.parse(r.toString("utf-8"))}catch(e){}if(null==t?void 0:t.extEnable)return t.extAppid}async function getDevSourceMap(e){const{project:r,robot:t,streaming:o}=e;let{sourceMapSavePath:a}=e;if(!r){const e="params project is requried";throw log_1.default.error(e),e}if("number"!=typeof t||Math.round(t)>30||Math.round(t)<=0){const e="params robot is invalid";throw log_1.default.error(e),e}if(!a){const e="params sourceMapSavePath is invalid";throw log_1.default.error(e),e}path_1.default.isAbsolute(a)||(a=path_1.default.join(process.cwd(),a));const i=await(0,sign_1.getSignature)(r.privateKey,r.appid),s=await getExtAppId(r),{body:l}=await(0,request_1.request)({url:url_config_1.GET_DEV_SOURCE_MAP,method:"post",gzip:!0,body:JSON.stringify({appid:r.appid,signature:i,robot:t,extAppId:s,streaming:o}),headers:{"content-type":"application/json"}});let u,p;try{u=JSON.parse(l)}catch(e){const r=ERR_MSG_PREFIX+" resp body is not a valid json";throw log_1.default.error(r),r}if(o)p=u.sourcemap_list;else{if(0!==u.errCode)throw new Error(`request failed, errCode: ${u.errCode}, errMsg: ${u.errMsg}`);const e=u.data;if(!Array.isArray(e.sourcemap_list)){const r=`${ERR_MSG_PREFIX} respData.sourcemap_list, respData: ${JSON.stringify(e)}`;throw log_1.default.error(r),r}p=e.sourcemap_list}const n=p,c=new JsZip;try{n.forEach(e=>{c.folder(path_1.default.dirname(e.fullpath)).file(path_1.default.basename(e.fullpath),e.sourcemap)})}catch(e){const r=ERR_MSG_PREFIX+" source map add folder or add file error";throw log_1.default.error(r),r}let _;try{_=await c.generateAsync({type:"nodebuffer"})}catch(e){const r=ERR_MSG_PREFIX+" source map generate zip error";throw log_1.default.error(r),r}try{fs_1.default.writeFileSync(a,_)}catch(e){const r=`${ERR_MSG_PREFIX} save source map to ${a} failed. Error detail: ${JSON.stringify(e)}`;throw log_1.default.error(r),r}return _}exports.getDevSourceMap=getDevSourceMap;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../utils/log":1679975017836,"../utils/request":1679975017835,"../utils/url_config":1679975017845,"../utils/sign":1679975017838}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017953, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.packNpmManually=exports.packNpm=void 0;const tslib_1=require("tslib"),config_1=require("../../config"),lodash_1=(0,tslib_1.__importDefault)(require("lodash")),rimraf_1=(0,tslib_1.__importDefault)(require("rimraf")),path_1=(0,tslib_1.__importDefault)(require("path")),fs_1=(0,tslib_1.__importDefault)(require("fs")),glob_1=(0,tslib_1.__importDefault)(require("glob")),source_map_1=(0,tslib_1.__importDefault)(require("source-map")),filterdeps_1=(0,tslib_1.__importDefault)(require("./filterdeps")),locales_1=(0,tslib_1.__importDefault)(require("../../utils/locales/locales")),error_1=require("../../utils/error"),log_1=(0,tslib_1.__importDefault)(require("../../utils/log")),projectconfig_1=require("../json/projectconfig"),acorn=require("acorn"),NPM_RECORD={start_time:Date.now(),pack_time:0,miniprogram_pack_num:0,other_pack_num:0,warn_not_found_num:0,warn_require_var_num:0,warn_require_rename_num:0,extra1:"",extra2:"",extra3:""},REPORT_LIST=["pack_time","miniprogram_pack_num","other_pack_num","warn_not_found_num","warn_require_var_num","warn_require_rename_num","extra1","extra2","extra3"];function wrap(e,t){return function(...a){if(a.length){const e=a.pop();"function"!=typeof e&&a.push(e)}return new Promise((r,n)=>{a.push((e,t)=>{e?n(e):r(t)}),e.apply(t||null,a)})}}const statSync=wrap(fs_1.default.stat),mkdirSync=wrap(fs_1.default.mkdir),readFileSync=wrap(fs_1.default.readFile),writeFileSync=wrap(fs_1.default.writeFile),accessSync=wrap(fs_1.default.access),renameSync=wrap(fs_1.default.rename),globSync=wrap(glob_1.default);let seed=+new Date;function getId(){return++seed}function startRecord(){NPM_RECORD.start_time=Date.now(),REPORT_LIST.forEach(e=>NPM_RECORD[e]=0===e.indexOf("extra")?"":0)}function endRecord(e){NPM_RECORD.pack_time=Date.now()-NPM_RECORD.start_time;const t={};REPORT_LIST.forEach(e=>t[e]=NPM_RECORD[e]);try{null==e||e(t)}catch(e){}}async function recursiveMkdir(e){const t=path_1.default.posix.dirname(e);try{await accessSync(t)}catch(e){await recursiveMkdir(t)}try{await accessSync(e);const t=await statSync(e);t&&!t.isDirectory()&&(await renameSync(e,e+".bak"),log_1.default.warn(e+" already exists but is not a directory, so it will be rename to a file with the suffix ending in '.bak'"),await mkdirSync(e))}catch(t){await mkdirSync(e)}}async function copyFile(e,t){const a=await readFileSync(e);await writeFile(a,t)}async function writeFile(e,t){await recursiveMkdir(path_1.default.posix.dirname(t)),await writeFileSync(t,e)}function walkNode(e,t){t(e),Object.keys(e).forEach(a=>{const r=e[a];Array.isArray(r)&&r.forEach(e=>{(null==e?void 0:e.type)&&walkNode(e,t)}),(null==r?void 0:r.type)&&walkNode(r,t)})}function parseDeps(e,t,a){const r=[];let n,o=[];try{n=acorn.parse(e,{sourceType:"module",locations:!0,allowHashBang:!0,onComment(t,a,r,n){t||"#"!==e[r]||o.push({start:r,end:n,adjustContent:""})}})}catch(e){const a=`parse js file (${t}) failed: `+e.message;throw console.error(a),e.message=a,e}return walkNode(n,n=>{const i=n.callee,s=n.arguments;if("CallExpression"===n.type&&i&&"Identifier"===i.type&&"require"===i.name&&s&&1===s.length&&("Literal"===s[0].type?r.push(s[0].value):(a.push({jsPath:t,code:e.substring(n.start,n.end),startLine:n.loc.start.line,endLine:n.loc.end.line,tips:"require variable is not allowed",msg:locales_1.default.config.NOT_ALLOWED_REQUIRE_VAR.format()}),NPM_RECORD.warn_require_var_num++)),"ExpressionStatement"===n.type&&n.expression&&"use strict"===n.expression.value&&o.push({start:n.start,end:n.end,adjustContent:""}),"ImportDeclaration"===n.type){const e=n.source,t=n.specifiers,a={start:n.start,end:n.end,adjustContent:""},i=[];e&&"Literal"===e.type&&(r.push(e.value),i.push(`var __TEMP__ = require('${e.value}');`)),t&&Array.isArray(t)&&t.forEach(e=>{if("ImportSpecifier"===e.type){const t=e.local,a=e.imported;"Identifier"===t.type&&"Identifier"===a.type&&i.push(`var ${t.name} = __TEMP__['${a.name}'];`)}else if("ImportDefaultSpecifier"===e.type){const t=e.local;"Identifier"===t.type&&i.push(`var ${t.name} = __REQUIRE_DEFAULT__(__TEMP__);`)}else if("ImportNamespaceSpecifier"===e.type){const t=e.local;"Identifier"===t.type&&i.push(`var ${t.name} = __REQUIRE_WILDCARD__(__TEMP__);`)}}),a.adjustContent=i.join(""),o.push(a)}if("ExportNamedDeclaration"===n.type){const t=n.source,a=n.specifiers,i=n.declaration;let s=!1;const p={start:n.start,end:n.end,adjustContent:""},c=['if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });'];if(t&&"Literal"===t.type&&(r.push(t.value),c.push(`var __TEMP__ = require('${t.value}');`),s=!0),i){if("VariableDeclaration"===i.type){const t=i.declarations;t&&Array.isArray(t)&&t.forEach(t=>{if("VariableDeclarator"===t.type){const a=t.id,r=t.init;a&&"Identifier"===a.type&&(p.notAddLines=!0,c.push(`var ${a.name} = exports.${a.name} = ${r?e.substring(r.start,r.end):"undefined"};`))}})}else if("FunctionDeclaration"===i.type){const t=i.id;t&&"Identifier"===t.type&&(p.notAddLines=!0,c.push(`${e.substring(i.start,i.end)};exports.${t.name} = ${t.name}`))}else if("ClassDeclaration"===i.type){const t=i.id;t&&"Identifier"===t.type&&(p.notAddLines=!0,c.push(`${e.substring(i.start,i.end)};exports.${t.name} = ${t.name}`))}}else;a&&Array.isArray(a)&&a.forEach(e=>{if("ExportSpecifier"===e.type){const t=e.local,a=e.exported;"Identifier"===t.type&&"Identifier"===a.type&&c.push(`Object.defineProperty(exports, '${a.name}', { enumerable: true, configurable: true, get: function() { return ${s?"__TEMP__.":""}${t.name}; } });`)}}),p.adjustContent=c.join(""),o.push(p)}else if("ExportAllDeclaration"===n.type){const e=n.source,t={start:n.start,end:n.end,adjustContent:""},a=['if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });'];e&&"Literal"===e.type&&(r.push(e.value),a.push(`var __TEMP__ = require('${e.value}');`)),a.push('Object.keys(__TEMP__).forEach(function(k) { if (k === "default" || k === "__esModule") return; Object.defineProperty(exports, k, { enumerable: true, configurable: true, get: function() { return __TEMP__[k]; } }); });'),t.adjustContent=a.join(""),o.push(t)}else if("ExportDefaultDeclaration"===n.type){const t=n.declaration,a={start:n.start,end:n.end,adjustContent:""},r=['if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });'];if(t)if(a.notAddLines=!0,t.id){const a=t.id;r.push(`${e.substring(t.start,t.end)};exports.default = ${a.name}`)}else r.push(`exports.default = ${e.substring(t.start,t.end)};`);a.adjustContent=r.join(""),o.push(a)}const p=n.expression;"ExpressionStatement"===n.type&&p&&"AssignmentExpression"===p.type&&"Identifier"===p.right.type&&"require"===p.right.name&&(a.push({jsPath:t,code:e.substring(n.start,n.end),startLine:n.loc.start.line,endLine:n.loc.end.line,tips:"assign require function to a variable is not allowed",msg:locales_1.default.config.NOT_ALLOWED_REQUIRE_ASSIGN.format()}),NPM_RECORD.warn_require_rename_num++);const c=n.declarations;"VariableDeclaration"===n.type&&c.length>0&&c.forEach(r=>{const o=r.init;"VariableDeclarator"===r.type&&o&&"Identifier"===o.type&&"require"===o.name&&(a.push({jsPath:t,code:e.substring(n.start,n.end),startLine:n.loc.start.line,endLine:n.loc.end.line,tips:"assign require function to a variable is not allowed",msg:locales_1.default.config.NOT_ALLOWED_REQUIRE_ASSIGN.format()}),NPM_RECORD.warn_require_rename_num++)})}),o=o.sort((e,t)=>t.start-e.start),o.forEach(t=>{const a=e.substring(t.start,t.end),r=t.notAddLines?0:a.split("\n").length;e=e.substring(0,t.start)+t.adjustContent+new Array(r).join("\n")+e.substring(t.end)}),{deps:r,parsedContent:e}}async function parseJs(e,t,a,r,n,o){if(n[t=path_1.default.posix.normalize(t)])return n[t];const i=await readFileSync(t,"utf8"),s=getId(),p=path_1.default.posix.relative(e,t);if(/\.json$/.test(t)){const e={id:s,name:p,content:"module.exports = "+i,deps:[],depsMap:{}};return n[t]=s,r.push(e),s}const{deps:c,parsedContent:_}=parseDeps(i,t,o),u={id:s,name:p,content:_,deps:c,depsMap:{}};n[t]=s,r.push(u);for(const i of c){let s,p=path_1.default.posix.join(path_1.default.posix.dirname(t),i);if(!/\.js$/.test(p)&&!/\.json$/.test(p)){const e=p+".js";try{await accessSync(e),p=e}catch(e){}}try{const e=await statSync(p);(null==e?void 0:e.isDirectory())&&(p=path_1.default.posix.join(p,"index.js"))}catch(e){}/\.js$/.test(p)||/\.json$/.test(p)||(p+=".js");try{await accessSync(p),s=await parseJs(e,p,a,r,n,o)}catch(e){}s&&(u.depsMap[i]=s)}return s}function addJsToMap(e,t,a,r){const n=t.split("\n").length;for(let o=1;o<=n;o++)e.addMapping({generated:{line:r+o,column:0},original:{line:o,column:0},source:a}),e.setSourceContent(a,t)}function findOutsideDeps(e){const t=new Set;return e.forEach(e=>{e.deps.forEach(a=>{Object.keys(e.depsMap).includes(a)||t.add(a)})}),Array.from(t)}async function packJs(e,t,a){try{const t=await statSync(e);(null==t?void 0:t.isDirectory())&&(e=path_1.default.posix.join(e,"index.js"))}catch(e){}/\.js$/.test(e)||/\.json$/.test(e)||(e+=".js");try{await accessSync(e)}catch(t){return a.push({jsPath:e,code:"",tips:"entry file is not found",msg:locales_1.default.config.NOT_FOUND_NPM_ENTRY.format()}),void NPM_RECORD.warn_not_found_num++}const r=new source_map_1.default.SourceMapGenerator({file:"index.js"}),n=[];await parseJs(path_1.default.posix.dirname(e),e,t,n,{},a);const o=findOutsideDeps(n),i=["module.exports = (function() {","var __MODS__ = {};","var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };",'var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };',"var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };","var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };"];if(n.length){const e=n.shift();i.push(`__DEFINE__(${e.id}, function(require, module, exports) {`),addJsToMap(r,e.content,e.name,i.length),i.push(e.content),i.push(`}, function(modId) {var map = ${JSON.stringify(e.depsMap)}; return __REQUIRE__(map[modId], modId); })`);for(const e of n)i.push(`__DEFINE__(${e.id}, function(require, module, exports) {`),addJsToMap(r,e.content,e.name,i.length),i.push(e.content),i.push(`}, function(modId) { var map = ${JSON.stringify(e.depsMap)}; return __REQUIRE__(map[modId], modId); })`);i.push(`return __REQUIRE__(${e.id});`)}return i.push("})()"),i.push("//miniprogram-npm-outsideDeps="+JSON.stringify(o)),i.push("//# sourceMappingURL=index.js.map"),{js:i.join("\n"),map:r.toString()}}async function checkIsMiniprogramPack(e,t){let a="miniprogram_dist";t.miniprogram&&"string"==typeof t.miniprogram&&(a=t.miniprogram);try{const t=path_1.default.posix.join(e,a);await accessSync(t);const r=await statSync(t);if(null==r?void 0:r.isDirectory())return t}catch(e){}return""}async function packNpm(e,t={}){const a=e.projectPath,r=e.type,n=await(0,projectconfig_1.getProjectConfigJSON)(e),o=n.pluginRoot||"",i=n.miniprogramRoot||"",s="miniProgramPlugin"===r||"miniGamePlugin"===r,{ignores:p,reporter:c}=t;if(!a)throw new error_1.CodeError(locales_1.default.config.SHOULD_NOT_BE_EMPTY.format("projectPath"),config_1.PARAM_ERROR);if("miniProgramPlugin"===r&&!o)throw new error_1.CodeError(locales_1.default.config.SHOULD_NOT_BE_EMPTY.format('project.config.json "pluginRoot"'),config_1.PARAM_ERROR);startRecord();const _=path_1.default.isAbsolute(a)?a:path_1.default.posix.join(process.cwd(),a),u=[{searchRoot:path_1.default.posix.join(_,i),paths:await globSync("**/package.json",{cwd:path_1.default.posix.join(_,i),nodir:!0,dot:!0,ignore:(p||[]).concat("**/node_modules/**")})}];s&&u.push({searchRoot:path_1.default.posix.join(_,o),paths:await globSync("**/package.json",{cwd:path_1.default.posix.join(_,o),nodir:!0,dot:!0,ignore:(p||[]).concat("**/node_modules/**")})});lodash_1.default.flattenDeep(u.map(e=>e.paths.map(t=>path_1.default.posix.join(e.searchRoot,path_1.default.dirname(t),"miniprogram_npm")))).forEach(e=>rimraf_1.default.sync(e));const l=[];for(const e of u)for(const t of e.paths){const a=path_1.default.dirname(path_1.default.posix.join(e.searchRoot,t)),r=lodash_1.default.xorWith(e.paths,[t]).map(e=>path_1.default.posix.join(path_1.default.posix.dirname(e),"/**")).filter(e=>"**"!==e);let n=await globSync("**/package.json",{cwd:a.replace(/\\/g,"/"),nodir:!0,dot:!0,ignore:(p||[]).concat(r).concat(["node_modules/@types/**"])});if(n=await(0,filterdeps_1.default)(a,n),n&&n.length)for(const e of n){const t=path_1.default.posix.join(a,e);let r=await readFileSync(t,"utf8");const n=path_1.default.dirname(t);let o=n.replace(/([\b/\\])node_modules([\b/\\])/g,(e,t,a)=>`${t}miniprogram_npm${a}`),i=path_1.default.basename(o);const s=i.split("@");s.length&&(i=s.pop()||""),o=o.replace(path_1.default.basename(o),i),r=JSON.parse(r);const p=path_1.default.posix.join(n,r.main||"index.js"),c=await checkIsMiniprogramPack(n,r);if(c){const e=await globSync("**/*",{cwd:c.replace(/\\/g,"/"),nodir:!0,dot:!0,ignore:"**/node_modules/**"});for(const t of e)await copyFile(path_1.default.posix.join(c,t),path_1.default.posix.join(o,t));NPM_RECORD.miniprogram_pack_num++}else{const e=await packJs(p,o,l);if(!e)continue;await writeFile(e.js,path_1.default.posix.join(o,"./index.js")),await writeFile(e.map,path_1.default.posix.join(o,"./index.js.map")),NPM_RECORD.other_pack_num++}}}if(endRecord(c),NPM_RECORD.miniprogram_pack_num+NPM_RECORD.other_pack_num<=0)throw new Error("__NO_NODE_MODULES__ "+locales_1.default.config.NOT_FOUND_NODE_MODULES.format());return"function"==typeof e.updateFiles&&e.updateFiles(),l}async function packNpmManually(e){let{packageJsonPath:t,miniprogramNpmDistDir:a}=e;const r=e.ignores||[],n={pack_time:0,miniprogram_pack_num:0,other_pack_num:0,warn_not_found_num:0,warn_require_var_num:0,warn_require_rename_num:0},o=[];if(!a)throw new Error("param miniprogramNpmDistDir is required");if(!t)throw new Error("param packageJsonPath is required");if(path_1.default.isAbsolute(a)||(a=path_1.default.join(process.cwd(),a)),path_1.default.isAbsolute(t)||(t=path_1.default.join(process.cwd(),t)),!fs_1.default.existsSync(t))throw new Error(`param packageJsonPath: ${t} file is not exited`);const i=path_1.default.dirname(t);let s=await globSync("**/package.json",{cwd:i.replace(/\\/g,"/"),nodir:!0,dot:!0,ignore:(r||[]).concat(["node_modules/@types/**"])});if(s=await(0,filterdeps_1.default)(i,s),!s||!s.length)return log_1.default.warn("No miniprogram_npm package was built."),{miniProgramPackNum:0,otherNpmPackNum:0,warnList:[]};s=s.filter(e=>e.startsWith("node_modules"));for(const e of s){const t=path_1.default.posix.join(i,e);let r=await readFileSync(t,"utf8");const s=path_1.default.dirname(t);let p=s.replace(/([\b/\\])node_modules([\b/\\])/g,(e,t,a)=>`${t}miniprogram_npm${a}`);p=path_1.default.posix.normalize(path_1.default.posix.join(a,"miniprogram_npm",p.split(/[/\\]miniprogram_npm[/\\]/)[1]));let c=path_1.default.basename(p);const _=c.split("@");_.length&&(c=_.pop()||""),p=p.replace(path_1.default.basename(p),c),r=JSON.parse(r);const u=path_1.default.posix.join(s,r.main||"index.js"),l=await checkIsMiniprogramPack(s,r);if(l){const e=await globSync("**/*",{cwd:l.replace(/\\/g,"/"),nodir:!0,dot:!0,ignore:"**/node_modules/**"});for(const t of e)await copyFile(path_1.default.posix.join(l,t),path_1.default.posix.join(p,t));n.miniprogram_pack_num++}else{const e=await packJs(u,p,o);if(!e)continue;await writeFile(e.js,path_1.default.posix.join(p,"./index.js")),await writeFile(e.map,path_1.default.posix.join(p,"./index.js.map")),n.other_pack_num++}}return{miniProgramPackNum:n.miniprogram_pack_num,otherNpmPackNum:n.other_pack_num,warnList:o}}exports.packNpm=packNpm,exports.packNpmManually=packNpmManually;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../config":1679975017839,"./filterdeps":1679975017954,"../../utils/locales/locales":1679975017841,"../../utils/error":1679975017840,"../../utils/log":1679975017836,"../json/projectconfig":1679975017851}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017954, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib"),path_1=(0,tslib_1.__importDefault)(require("path")),read_package_tree_1=(0,tslib_1.__importDefault)(require("read-package-tree"));function checkDeps(e,t){var a,r;const n=new Set(Object.keys((null===(a=e.package)||void 0===a?void 0:a.dependencies)||{})),o=[];let s=e;for(;s;){const e=s.children||[];for(const t of e){const e=(null===(r=t.package)||void 0===r?void 0:r.name)||"";n.has(e)&&(n.delete(e),o.push(t))}s=s.parent}for(const e of o)t.has(e)||(t.add(e),checkDeps(e,t))}async function getDeps(e){return new Promise((t,a)=>{(0,read_package_tree_1.default)(e,(e,r)=>{if(e)return a(e);const n=new Set;try{checkDeps(r,n)}catch(e){return a(e)}t(Array.from(n))})})}async function default_1(e,t){if(null==t?void 0:t.length){const a=t.filter(e=>!/([\\/]|\b)node_modules/.test(e)),r=[],n={};for(const t of a){(await getDeps(path_1.default.join(e,path_1.default.dirname(t)))).forEach(e=>{r.push(e)})}for(const e of r){const t=e.isLink?e.path:e.realpath;n[path_1.default.normalize(path_1.default.join(t,"./package.json"))]=e}t=t.filter(t=>{const a=path_1.default.normalize(path_1.default.join(e,t));return!!n[a]})}return t}exports.default=default_1;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017955, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.uploadFunction=void 0;const tslib_1=require("tslib"),cloudapi_1=require("./cloudapi"),cloudAPI=(0,tslib_1.__importStar)(require("../vendor/cloud-api")),utils_1=require("./utils"),log_1=(0,tslib_1.__importDefault)(require("../utils/log")),error_1=require("../utils/error"),config_1=require("../config"),locales_1=(0,tslib_1.__importDefault)(require("../utils/locales/locales")),HelloWordCode="UEsDBBQACAAIALB+WU4AAAAAAAAAAAAAAAAIABAAaW5kZXguanNVWAwAAZ9zXPuec1z1ARQAdY7BCsIwEETv+Yoll6ZQ+wOhnv0DD+IhxkWC664kWwmI/27V3IpzGuYNw3RzQSiaU9TOG6x3yVrGW0gMEzh8IOsAUVixfkwgOoV47WHawtPAooUVIRxJLs7ukEhgL5nOtl/h79qf+GBZeIM1FbXHdac9aKC9cDwTDfCb9eblzRtQSwcI6+pcr4AAAADOAAAAUEsBAhUDFAAIAAgAsH5ZTuvqXK+AAAAAzgAAAAgADAAAAAAAAAAAQKSBAAAAAGluZGV4LmpzVVgIAAGfc1z7nnNcUEsFBgAAAAABAAEAQgAAAMYAAAAAAA==",requiredParams=["project","name","path"];async function uploadFunction(e){requiredParams.forEach(t=>{if(!e[t])throw new error_1.CodeError(locales_1.default.config.PARAM_ERROR.format("cloud.uploadFunction",t),config_1.PARAM_ERROR)});const{project:t,remoteNpmInstall:o=!1,name:n,path:a,env:c}=e,i=await t.getExtAppid();(0,cloudapi_1.initCloudAPI)(i||t.appid),log_1.default.info(`will upload code under ${a} as cloudfunction '${n}' of env ${c}. remote-npm-install: ${o}`);const{envList:u}=await cloudAPI.tcbGetEnvironments({},{request:(0,cloudapi_1.boundTransactRequest)(t),transactType:cloudAPI.TransactType.IDE}),r=u.find(e=>e.envId===c);if(!r)throw new Error("env not found");const l=r.functions[0].region,{clsLogsetId:s,clsTopicId:d}=getLogServiceProperties(r),p=await(0,cloudapi_1.get3rdCloudCodeSecret)(t);log_1.default.info("checking cloudfunction status, will only proceed on normal status"),await waitFuncDeploy({namespace:c,region:l,functionName:n,codeSecret:p,topts:{request:(0,cloudapi_1.boundTransactRequest)(e.project),transactType:cloudAPI.TransactType.IDE}});let A,f=!1;try{if(A=await cloudAPI.scfGetFunctionInfo({namespace:c,region:"",functionName:n,codeSecret:p},{request:(0,cloudapi_1.boundTransactRequest)(t),transactType:cloudAPI.TransactType.IDE}),"DeleteFailed"===A.status)throw new Error("delete failed")}catch(e){if("ResourceNotFound.Function"!==e.code)throw e;f=!0}if(log_1.default.info("get cloudfunction info done"),log_1.default.info(`will ${f?"create":"update"} cloudfunction`),f)await cloudAPI.scfCreateFunction({functionName:n,code:{zipFile:HelloWordCode},handler:"index.main",description:"",memorySize:256,timeout:3,environment:{variables:[]},role:"TCB_QcsRole",runtime:"Nodejs8.9",namespace:c,region:l,stamp:"MINI_QCBASE",installDependency:o,codeSecret:p,clsLogsetId:s,clsTopicId:d},{request:(0,cloudapi_1.boundTransactRequest)(e.project),transactType:cloudAPI.TransactType.IDE}),log_1.default.info("create cloudfunction done, continue to update code");else{if("Updating"===A.status)throw new Error("there's another ongoing update, please wait for it to complete and try again later");const t=o?"TRUE":"FALSE";A.installDependency!==t&&(log_1.default.info("updating cloudfunction info"),await cloudAPI.scfUpdateFunctionInfo({namespace:c,region:l,functionName:n,installDependency:o,clsLogsetId:s,clsTopicId:d},{request:(0,cloudapi_1.boundTransactRequest)(e.project),transactType:cloudAPI.TransactType.IDE}),log_1.default.info("update cloudfunction info done, waiting for it to take into effect"),await waitFuncDeploy({namespace:c,region:l,functionName:n,codeSecret:p,topts:{request:(0,cloudapi_1.boundTransactRequest)(e.project),transactType:cloudAPI.TransactType.IDE}}),log_1.default.info("cloudfunction info updated"))}const g=(0,utils_1.zipFile)(a,{ignore:o?["node_modules"]:void 0}),I=await(0,utils_1.zipToBuffer)(g);log_1.default.info("zip file done, updating cloudfunction code"),await cloudAPI.scfUpdateFunction({functionName:n,namespace:c,region:l,handler:"index.main",installDependency:o,fileData:I.toString("base64"),codeSecret:p},{request:(0,cloudapi_1.boundTransactRequest)(e.project),transactType:cloudAPI.TransactType.IDE}),log_1.default.info("cloudfunction code updated, "+(o?"installing dependencies in the cloud and deploying":"deploying")),await waitFuncDeploy({namespace:c,region:l,functionName:n,codeSecret:p,topts:{request:(0,cloudapi_1.boundTransactRequest)(e.project),transactType:cloudAPI.TransactType.IDE}}),log_1.default.info("deployed");return{filesCount:Object.keys(g.files).length,packSize:I.byteLength}}exports.uploadFunction=uploadFunction;const waitFuncDeploy=async e=>new Promise(async(t,o)=>{let n=!1;const{namespace:a,region:c,functionName:i,onStatusUpdate:u=(t=>{log_1.default.info(`env ${e.namespace}'s cloudfunction '${e.functionName}' status: ${t}`)}),maxWaitTimeout:r=9e5,codeSecret:l}=e,s=setTimeout(()=>{n||(n=!0,o(new Error("timeout waiting for function to deploy")))},r);try{let o="";const s=+new Date;for(;!n&&+new Date-s<r;){const r=await cloudAPI.scfGetFunctionInfo({namespace:a,region:c,functionName:i,codeSecret:l},e.topts);switch(r.status!==o&&(u(r.status),o=r.status),r.status){case"Creating":case"Updating":case"Publishing":case"UpdatingAndPublishing":case"UpdateFailed":break;case"CreateFailed":throw new Error("create function failed: "+r.statusDesc);case"Active":n=!0,t(void 0)}}}catch(e){try{log_1.default.error(`upload ${a} ${i} failed: `,"string"==typeof e?e:JSON.stringify(e))}catch(e){log_1.default.error(`upload ${a} ${i} failed: `,e.toString())}clearTimeout(s),o(e)}});function getLogServiceProperties(e){let t,o;try{const n=e.logServices[0];t=n.logsetId,o=n.topicId}catch(e){}return{clsLogsetId:t,clsTopicId:o}}
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./cloudapi":1679975017956,"../vendor/cloud-api":1679975017987,"./utils":1679975017988,"../utils/log":1679975017836,"../utils/error":1679975017840,"../config":1679975017839,"../utils/locales/locales":1679975017841}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017956, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.boundTransactRequest=exports.get3rdCloudCodeSecret=exports.initCloudAPI=void 0;const tslib_1=require("tslib"),crypto_1=(0,tslib_1.__importDefault)(require("crypto")),request_1=(0,tslib_1.__importDefault)(require("request")),cloudAPI=(0,tslib_1.__importStar)(require("../vendor/cloud-api/src/index")),request_2=require("../utils/request"),sign_1=require("../utils/sign"),jsonParse_1=require("../utils/jsonParse"),urlConfig=(0,tslib_1.__importStar)(require("../utils/url_config"));function initCloudAPI(e){cloudAPI.setDefaultAppID(e),cloudAPI.setTransactType(cloudAPI.TransactType.IDE),cloudAPI.setRequest(transactRequest)}exports.initCloudAPI=initCloudAPI;const SERVICE_CLOUD_URL={scf:"https://scf.tencentcloudapi.com",flexdb:"https://flexdb.tencentcloudapi.com",tcb:"https://tcb.tencentcloudapi.com"},DIRECT_CLOUD_API_SET=new Set(["UpdateFunctionCode","CreateFunction"]);async function transactRequest(e){var t;const r=e.project,o=await(0,sign_1.getSignature)(r.privateKey,r.appid),s=await r.getExtAppid();if(DIRECT_CLOUD_API_SET.has(e.identity.action||"")&&Boolean(SERVICE_CLOUD_URL[e.identity.service])){const{body:i}=await(0,request_2.request)({url:urlConfig.GET_CLOUD_API_SIGNATURE,method:"post",body:JSON.stringify({appid:r.appid,extAppid:s||void 0,signature:o,signReq:{action:e.identity.action,path:e.identity.path,service:e.identity.service,version:e.identity.version,region:e.identity.region,hashed_postdata:crypto_1.default.createHash("sha256").update(e.postdata).digest("hex")}}),headers:{"content-type":"application/json"}}),n=(0,jsonParse_1.jsonRespParse)(i,"cloudapi.getCloudAPISignedHeader");if(n.errCode)throw new Error(`getCloudAPISignedHeader failed, errCode: ${i.errCode}, errMsg: ${i.errMsg}`);const a=n.header;if(!a)throw new Error("empty header, recv cgi resp: "+i);const{resp:d}=await new Promise((t,r)=>{(0,request_1.default)({url:SERVICE_CLOUD_URL[e.identity.service],method:"post",body:e.postdata,headers:a.split("\n").map(e=>e.trim()).reduce((e,t)=>{const r=t.indexOf(":");return e[t.slice(0,r)]=t.slice(r+1),e},{})},(e,o)=>{e?r(e):t({resp:o})})});if(413===d.statusCode)throw new Error("Body too large");const p=d.body;if(!p)throw new Error("Empty body "+d);const c="string"==typeof p?JSON.parse(p):p;if(!c.Response||(null===(t=c.Response)||void 0===t?void 0:t.Error))throw new Error("TencentCloud API error: "+p);return p}{const{resp:t,body:i}=await(0,request_2.request)({url:urlConfig.cloudAPIAgentURL,method:"post",body:JSON.stringify({appid:r.appid,extAppid:s||void 0,signature:o,agentReq:Object.assign({postdata:e.postdata,test:!1},e.identity)}),headers:Object.assign(Object.assign({},e.headers),{"content-type":"application/json"})});if(413===t.statusCode)throw new Error("Body too large");if(!i)throw new Error("Empty body "+t);const n="string"==typeof i?JSON.parse(i):i;if(n.errCode)throw new Error(`${n.errCode} ${n.errMsg}`);const a=n.data;if(!a||!a.base_resp||"0"!=a.base_resp.ret){if(80210===a.base_resp.ret)throw new Error("NO_CLOUD_MANAGE_PERMISSION_AUTHORIZED_TO_3RD_PLATFORM");throw new Error("Base resp abnormal, "+JSON.stringify(null==a?void 0:a.base_resp))}return a.content}}async function get3rdCloudCodeSecret(e){const t=await e.attr();let r,o="",s={};try{r=await e.getFile(e.miniprogramRoot,"ext.json"),s=JSON.parse(r.toString("utf-8"))}catch(e){}if(s&&s.extEnable&&(o=s.extAppid||""),(null==t?void 0:t.platform)&&o)try{const t=await(0,sign_1.getSignature)(e.privateKey,e.appid),{body:r}=await(0,request_2.request)({url:urlConfig.get3rdCloudCodeSecret,method:"post",headers:{"content-type":"application/json"},body:JSON.stringify({appid:e.appid,extAppid:o,signature:t})}),s=(0,jsonParse_1.jsonRespParse)(r);if(0===s.errCode)return s.codeSecret;throw new Error("get 3rd cloud codesecret invalid resp "+JSON.stringify(r))}catch(e){throw new Error("get 3rd cloud codesecret error "+e)}}function boundTransactRequest(e){return t=>transactRequest(Object.assign(Object.assign({},t),{project:e}))}exports.get3rdCloudCodeSecret=get3rdCloudCodeSecret,exports.boundTransactRequest=boundTransactRequest;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../vendor/cloud-api/src/index":1679975017957,"../utils/request":1679975017835,"../utils/sign":1679975017838,"../utils/jsonParse":1679975017846,"../utils/url_config":1679975017845}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017957, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib");(0,tslib_1.__exportStar)(require("./apis/apis"),exports),(0,tslib_1.__exportStar)(require("./transaction/transactor"),exports),(0,tslib_1.__exportStar)(require("./transaction/contracts/contracts"),exports),(0,tslib_1.__exportStar)(require("./transaction/validations/validations"),exports);
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./apis/apis":1679975017958,"./transaction/transactor":1679975017961,"./transaction/contracts/contracts":1679975017962,"./transaction/validations/validations":1679975017966}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017958, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib");(0,tslib_1.__exportStar)(require("./tcb/index"),exports),(0,tslib_1.__exportStar)(require("./flexdb/index"),exports),(0,tslib_1.__exportStar)(require("./scf/index"),exports),(0,tslib_1.__exportStar)(require("./cdn/index"),exports),(0,tslib_1.__exportStar)(require("./ssl/index"),exports);
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./tcb/index":1679975017959,"./flexdb/index":1679975017979,"./scf/index":1679975017981,"./cdn/index":1679975017983,"./ssl/index":1679975017985}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017959, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib");(0,tslib_1.__exportStar)(require("./general.apis"),exports),(0,tslib_1.__exportStar)(require("./tcb.apis"),exports);
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./general.apis":1679975017960,"./tcb.apis":1679975017978}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017960, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.tcbDescribeStatData=exports.tcbDescribeEnvAccountCircle=exports.tcbDescribeQuotaData=exports.tcbGetResourceLimit=exports.tcbGetEnvironments=void 0;const tslib_1=require("tslib"),transactor_1=(0,tslib_1.__importStar)(require("../../transaction/transactor")),contracts_1=require("../../transaction/contracts/contracts"),common_1=require("../../utils/common");async function tcbGetEnvironments(t,e){const i={Action:"DescribeEnvs",Version:"2018-06-08",EnvId:t.envId,Source:t.source,WxAppId:t.useEmptyAppId?void 0:t.appId||(0,transactor_1.getDefaultAppID)()};try{const t=await(0,transactor_1.default)(contracts_1.tcbGetEnvironmentsContract,i,e);return{requestId:t.RequestId,envList:t.EnvList.map(t=>({envId:t.EnvId,alias:t.Alias,createTime:(0,common_1.strToDate)(t.CreateTime),updateTime:(0,common_1.strToDate)(t.UpdateTime),status:t.Status,source:t.Source,envChannel:t.EnvChannel,storages:(t.Storages||[]).map(t=>({region:(t=t||{}).Region,bucket:t.Bucket,cdnDomain:t.CdnDomain,tcAppId:t.AppId})),functions:(t.Functions||[]).map(t=>({namespace:(t=t||{}).Namespace,region:t.Region})),databases:(t.Databases||[]).map(t=>({instanceId:(t=t||{}).InstanceId,status:t.Status,region:t.Region})),packageId:t.PackageId||"",packageName:t.PackageName||"",logServices:(t.LogServices||[]).map(t=>({logsetName:(t=t||{}).LogsetName,logsetId:t.LogsetId,topicName:t.TopicName,topicId:t.TopicId,region:t.Region})),staticStorages:(t.StaticStorages||[]).map(t=>({region:(t=t||{}).Region,bucket:t.Bucket,staticDomain:t.StaticDomain,status:t.Status,defaultDirName:t.DefaultDirName}))}))}}catch(t){throw t}}async function tcbGetResourceLimit(t){const e={Action:"DescribeResourceLimit",Version:"2018-06-08",EnvId:t.envId,WxAppId:t.appId||(0,transactor_1.getDefaultAppID)()},i=await(0,transactor_1.default)(contracts_1.tcbGetResourceLimitContract,e);return{function:(i.Function||[]).map(t=>({numberLimit:t.NumberLimit,callLimit:{maxSize:t.CallLimit.MaxSize,timeUnit:t.CallLimit.TimeUnit},resourceUsageLimit:{maxSize:t.ResourceUsageLimit.MaxSize,timeUnit:t.ResourceUsageLimit.TimeUnit},concurrentLimit:t.ConcurrentLimit,outboundTrafficLimit:{maxSize:t.OutboundTrafficLimit.MaxSize,timeUnit:t.OutboundTrafficLimit.TimeUnit}})),database:(i.Database||[]).map(t=>({capacityLimit:t.CapacityLimit,connectionLimit:t.ConnectionLimit,collectionLimit:t.CollectionLimit,indexLimit:t.IndexLimit,readLimit:{maxSize:t.ReadLimit.MaxSize,timeUnit:t.ReadLimit.TimeUnit},writeLimit:{maxSize:t.WriteLimit.MaxSize,timeUnit:t.WriteLimit.TimeUnit},QPSLimit:t.QPSLimit})),storage:(i.Storage||[]).map(t=>({capacityLimit:t.CapacityLimit,downloadLimit:{maxSize:t.DownloadLimit.MaxSize,timeUnit:t.DownloadLimit.TimeUnit},downloadLimitMonthly:{maxSize:t.DownloadLimitMonthly.MaxSize,timeUnit:t.DownloadLimitMonthly.TimeUnit},uploadLimit:{maxSize:t.UploadLimit.MaxSize,timeUnit:t.UploadLimit.TimeUnit},uploadLimitMonthly:{maxSize:t.UploadLimitMonthly.MaxSize,timeUnit:t.UploadLimitMonthly.TimeUnit},cdnOriginFlowLimit:{maxSize:t.CdnOriginFlowLimit.MaxSize,timeUnit:t.CdnOriginFlowLimit.TimeUnit},cdnFlowLimit:{maxSize:t.CdnFlowLimit.MaxSize,timeUnit:t.CdnFlowLimit.TimeUnit}}))}}async function tcbDescribeQuotaData(t){const e={Action:"DescribeQuotaData",Version:"2018-06-08",EnvId:t.envId,MetricName:t.metricName,ResourceID:t.resourceId,WxAppId:t.appId||(0,transactor_1.getDefaultAppID)()},i=await(0,transactor_1.default)(contracts_1.tcbDescribeQuotaDataContract,e);return{metricName:i.MetricName,value:i.Value}}async function tcbDescribeEnvAccountCircle(t){const e={Action:"DescribeEnvAccountCircle",Version:"2018-06-08",EnvId:t.envId,WxAppId:t.appId||(0,transactor_1.getDefaultAppID)()},i=await(0,transactor_1.default)(contracts_1.tcbDescribeEnvAccountCircleContract,e);return{startTime:i.StartTime,endTime:i.EndTime}}async function tcbDescribeStatData(t){const e={Action:"DescribeStatData",Version:"2018-06-08",EnvId:t.envId,WxAppId:t.appId||(0,transactor_1.getDefaultAppID)(),Mask:t.mask};return{resources:(await(0,transactor_1.default)(contracts_1.tcbDescribeStatDataContract,e)).Resources.map(t=>({resourceType:t.ResourceType,resourceName:t.ResourceName,status:t.Status,maxSize:t.MaxSize,curSize:t.CurSize,unit:"string"==typeof t.Unit?t.Unit.toUpperCase():t.Unit}))}}exports.tcbGetEnvironments=tcbGetEnvironments,exports.tcbGetResourceLimit=tcbGetResourceLimit,exports.tcbDescribeQuotaData=tcbDescribeQuotaData,exports.tcbDescribeEnvAccountCircle=tcbDescribeEnvAccountCircle,exports.tcbDescribeStatData=tcbDescribeStatData;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../transaction/transactor":1679975017961,"../../transaction/contracts/contracts":1679975017962,"../../utils/common":1679975017977}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017961, function(require, module, exports) {
!function(require, directRequire){
var TransactType;Object.defineProperty(exports,"__esModule",{value:!0}),exports.transact=exports.getDefaultAppID=exports.setDefaultAppID=exports.setTransactType=exports.setRequest=exports.TransactType=void 0,function(t){t[t.Mock=1]="Mock",t[t.HTTP=2]="HTTP",t[t.IDEPlugin=3]="IDEPlugin",t[t.IDE=4]="IDE"}(TransactType=exports.TransactType||(exports.TransactType={}));const defaultOptions={validOutput:!0,autoRecord:!0,isPoll:!1};let request,transactType,defaultAppID;function setRequest(t){request=t}function setTransactType(t){transactType=t}function setDefaultAppID(t){defaultAppID=t}function getDefaultAppID(){return defaultAppID}async function transact(t,e,a={}){const s=a.request||request;if(!s)throw new Error("[transactor] request function hasn't been initialized.");const r=a.transactType||transactType;if(!r)throw new Error("[transactor] transactType hasn't been initialized.");const n=Date.now(),p=Object.assign(Object.assign({},defaultOptions),a);let o,u;const c=t.getHttpAgentIdentity(e);let i;try{const a=t.inputTransformation(e,r);i=await s({postdata:a,identity:c,contract:t,_input:e}),o=t.outputTransformationThrows(i,r)}catch(t){u=t}const T=Date.now();if(!u&&p.validOutput)try{t.validOutputThrows(o)}catch(t){u=t}if(p.autoRecord&&t.commitRecord({timestamps:[n,T],input:e,output:o,error:u,rawOutput:i,httpAgentIdentity:c},p.isPoll),u)throw u;return o}exports.setRequest=setRequest,exports.setTransactType=setTransactType,exports.setDefaultAppID=setDefaultAppID,exports.getDefaultAppID=getDefaultAppID,exports.transact=transact,exports.default=transact;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017962, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.TransactionContract=void 0;const tslib_1=require("tslib");(0,tslib_1.__exportStar)(require("./tcb.contracts"),exports),(0,tslib_1.__exportStar)(require("./flexdb.contracts"),exports),(0,tslib_1.__exportStar)(require("./scf.contracts"),exports),(0,tslib_1.__exportStar)(require("./cdn.contracts"),exports),(0,tslib_1.__exportStar)(require("./ssl.contracts"),exports);const factory_1=(0,tslib_1.__importDefault)(require("./factory"));exports.TransactionContract=factory_1.default;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./tcb.contracts":1679975017963,"./flexdb.contracts":1679975017973,"./scf.contracts":1679975017974,"./cdn.contracts":1679975017975,"./ssl.contracts":1679975017976,"./factory":1679975017964}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017963, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.tcbDescribeVoucherPlanAvailableContract=exports.tcbDescribeVouchersInfoContract=exports.tcbDescribeAmountAfterDeductionContract=exports.tcbDescribeVouchersInfoByDealContract=exports.tcbDescribeResourceRecoverJobContract=exports.tcbResourceRecoverContract=exports.tcbDescribeEnvResourceExceptionContract=exports.tcbDescribeAuthentificationContract=exports.tcbRevokeInvoiceContract=exports.tcbDescribeInvoiceDetailContract=exports.tcbDescribeInvoiceListContract=exports.tcbCreateInvoiceContract=exports.tcbDeleteInvoicePostInfoContract=exports.tcbModifyInvoicePostInfoContract=exports.tcbCreateInvoicePostInfoContract=exports.tcbDescribeInvoicePostInfoContract=exports.tcbSetInvoiceSubjectContract=exports.tcbDescribeInvoiceSubjectContract=exports.tcbDescribeInvoiceAmountContract=exports.tcbDescribeNextExpireTimeContract=exports.tcbDescribeBillingInfoContract=exports.tcbCheckEnvPackageModifyContract=exports.tcbDeleteDealContract=exports.tcbCancelDealContract=exports.tcbQueryDealsContract=exports.tcbDescribePayInfoContract=exports.tcbCreateDealContract=exports.tcbInqueryPriceContract=exports.tcbDescribePackagesContract=exports.tcbDescribeEnvAccountCircleContract=exports.tcbCheckEnvIdContract=exports.tcbCreateEnvAndResourceContract=exports.tcbDescribeSafeRuleContract=exports.tcbModifySafeRuleContract=exports.tcbDatabaseMigrateQueryInfoContract=exports.tcbDatabaseMigrateExportContract=exports.tcbDatabaseMigrateImportContract=exports.tcbModifyDatabaseACLContract=exports.tcbDescribeDatabaseACLContract=exports.tcbDescribeStorageACLTaskContract=exports.tcbModifyStorageACLContract=exports.tcbDescribeStorageACLContract=exports.tcbDescribeCurveDataContract=exports.tcbDescribeMonitorDataContract=exports.tcbDescribeDbDistributionContract=exports.tcbDescribeQuotaDataContract=exports.tcbDescribeStatDataContract=exports.tcbGetResourceLimitContract=exports.tcbGetUsersContract=exports.tcbGetEnvironmentsContract=void 0,exports.tcbDescribeCloudBaseGWAPIContract=exports.tcbModifyCloudBaseRunServerVersionContract=exports.tcbDescribeCloudBaseRunVersionExceptionContract=exports.tcbDescribeCloudBaseBuildServiceContract=exports.tcbDescribeCloudBaseRunBuildLogContract=exports.tcbDescribeCloudBaseRunPodListContract=exports.tcbDeleteCloudBaseRunResourceContract=exports.tcbEstablishCloudBaseRunServerContract=exports.tcbDescribeCloudBaseRunServerVersionContract=exports.tcbCreateCloudBaseRunServerVersionContract=exports.tcbDescribeCloudBaseRunContainerSpecContract=exports.tcbDescribeCloudBaseRunServerContract=exports.tcbDescribeCloudBaseRunBuildServerContract=exports.tcbCreateCloudBaseRunResourceContract=exports.tcbDescribeCloudBaseRunServersContract=exports.tcbDescribeCloudBaseRunResourceContract=exports.tcbDescribeHostingDomainContract=exports.tcbDescribeEnvFreeQuotaContract=exports.tcbDescribeAccountInfoByPlatformIdContract=exports.tcbDescribeEnvLimitContract=exports.tcbDescribeStaticStoreContract=exports.tcbDestroyStaticStoreContract=exports.tcbCreateStaticStoreContract=exports.tcbModifySecurityRuleContract=exports.tcbDescribeSecurityRuleContract=exports.tcbUpdateLoginConfigContract=exports.tcbCreateLoginConfigContract=exports.tcbDescribeLoginConfigsContract=exports.tcbDescribeCDNChainTaskContract=exports.tcbDescribeStorageSafeRuleContract=exports.tcbModifyStorageSafeRuleContract=exports.tcbDescribePostpayFreeQuotasContract=exports.tcbInqueryPostpayPriceContract=exports.tcbCreatePostpayPackageContract=exports.tcbCommonServiceAPIContract=exports.tcbDescribeRestoreHistoryContract=exports.tcbDescribeChangePayContract=exports.tcbDescribeDauDataContract=exports.tcbModifyMonitorConditionContract=exports.tcbDeleteMonitorConditionContract=exports.tcbCreateMonitorConditionContract=exports.tcbDescribeMonitorConditionContract=exports.tcbModifyMonitorPolicyContract=exports.tcbDeleteMonitorPolicyContract=exports.tcbCreateMonitorPolicyContract=exports.tcbDescribeMonitorPolicyContract=exports.tcbDescribeMonitorResourceContract=exports.tcbDeleteVoucherApplicationContract=exports.tcbDescribeVoucherApplicationContract=exports.tcbApplyVoucherContract=void 0,exports.tcbCreateAuditRulesContract=exports.tcbDescribeCollectionsContract=exports.tcbDescribeAuditRuleContract=exports.tcbSearchClsLogContract=exports.tcbQueryPostpaidPackageDealsContract=exports.tcbRefundPostpaidPackageContract=exports.tcbDescribeWxCloudBaseRunSubNetsContract=exports.tcbDescribeWxCloudBaseRunEnvsContract=exports.tcbModifyEnvContract=exports.tcbDescribeCloudBaseRunServiceDomainContract=exports.tcbDescribeSmsRecordsContract=exports.tcbDescribeTcbBalanceContract=exports.tcbDescribeSmsAttrInfoContract=exports.tcbDescribeSmsQuotasContract=exports.tcbDescribeQcloudSceneContract=exports.tcbDescribeCloudBaseRunVersionSnapshotContract=exports.tcbDescribeCloudBaseRunOperationDetailsContract=exports.tcbCreateUpgradeExtensionTaskContract=exports.tcbDescribeExtensionsContract=exports.tcbDescribeExtensionUpgradeContract=exports.tcbDescribeExtensionTemplatesContract=exports.tcbDescribeExtensionTaskStatusContract=exports.tcbDescribeExtensionInstalledContract=exports.tcbCreateUninstallExtensionTaskContract=exports.tcbCreateInstallExtensionTaskContract=exports.tcbUpdateScfConfigContract=exports.tcbUpdatePostpayQuotaLimitContract=exports.tcbUpdatePostpayQuotaLimitStatusContract=exports.tcbDescribePostpayQuotaLimitContract=exports.tcbDescribeEnvPostpayPackageContract=exports.tcbInqueryPackagePriceContract=exports.tcbDescribeActivityGoodsContract=exports.tcbCreateActivityDealContract=exports.tcbOnlineHostingDomainContract=exports.tcbCheckQualificationContract=exports.tcbModifyHostingDomainContract=exports.tcbQueryActivityPriceContract=exports.tcbDeleteHostingDomainContract=exports.tcbDescribePostpayPackageListContract=exports.tcbCreateHostingDomainContract=exports.tcbDescribeCloudBaseCodeBranchContract=exports.tcbDescribeCloudBaseCodeReposContract=exports.tcbDeleteCloudBaseRunServerContract=exports.tcbModifyCloudBaseRunServerFlowConfContract=exports.tcbRollUpdateCloudBaseRunServerVersionContract=exports.tcbDeleteCloudBaseRunImageRepoContract=exports.tcbDeleteCloudBaseRunServerVersionContract=exports.tcbDescribeCloudBaseRunBuildStepLogContract=exports.tcbDescribeCloudBaseRunBuildStepsContract=exports.tcbDescribeCloudBaseRunBuildStagesContract=void 0,exports.tcbDescribeExtensionsInstalledContract=exports.tcbCreateCopyEnvTaskContract=exports.tcbDeleteTriggerConfigsContract=exports.tcbUpdateTriggerConfigContract=exports.tcbDescribeTriggerConfigsContract=exports.tcbCreateTriggerConfigsContract=exports.tcbDescribeTriggerServiceParametersContract=exports.tcbCreateSecurityAuditConfigContract=exports.tcbDeleteSecurityAuditConfigContract=exports.tcbDescribeSecurityAuditConfigContract=exports.tcbUnfreezeSecurityAuditRecordContract=exports.tcbDescribeAuditResultsContract=exports.tcbModifyAuditRuleContract=exports.tcbDeleteAuditRuleContract=void 0;const tslib_1=require("tslib"),factory_1=(0,tslib_1.__importDefault)(require("./factory")),validations=(0,tslib_1.__importStar)(require("../validations/validations")),transactor_1=require("../transactor");function sharedInputTransformation(t,o){return(t&&o===transactor_1.TransactType.HTTP||o===transactor_1.TransactType.IDEPlugin||o===transactor_1.TransactType.IDE)&&(delete t.Action,delete t.Version),JSON.stringify(t)}function sharedOutputTransformationThrows(t,o){if(!(t=JSON.parse(t))||!t.Response)throw new Error("content empty, "+JSON.stringify(t));const r=t.Response;if(r.Error&&r.Error.Code)throw new Error(r.Error.Code+", "+r.Error.Message+" ("+(r.RequestId||"?")+")");return delete r.Error,r}exports.tcbGetEnvironmentsContract=new factory_1.default("ITCTCBGetEnvironmentsInput","ITCTCBGetEnvironmentsOutput",validations.tcbGetEnvironmentsOutputValidation,()=>({cgi_id:101,service:"tcb",action:"DescribeEnvs",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbGetUsersContract=new factory_1.default("ITCTCBGetUsersInput","ITCTCBGetUsersOutput",validations.tcbGetUsersOutputValidation,()=>({cgi_id:102,service:"tcb",action:"DescribeUsers",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbGetResourceLimitContract=new factory_1.default("ITCTCBGetResourceLimitInput","ITCTCBGetResourceLimitOutput",validations.tcbGetResourceLimitOutputValidation,()=>({cgi_id:103,service:"tcb",action:"DescribeResourceLimit",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeStatDataContract=new factory_1.default("ITCTCBDescribeStatDataInput","ITCTCBDescribeStatDataOutput",validations.tcbDescribeStatDataOutputValidation,()=>({cgi_id:104,service:"tcb",action:"DescribeStatData",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeQuotaDataContract=new factory_1.default("ITCTCBDescribeQuotaDataInput","ITCTCBDescribeQuotaDataOutput",validations.tcbDescribeQuotaDataOutputValidation,()=>({cgi_id:118,service:"tcb",action:"DescribeQuotaData",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeDbDistributionContract=new factory_1.default("ITCTCBDescribeDbDistributionInput","ITCTCBDescribeDbDistributionOutput",validations.tcbDescribeDbDistributionOutputValidation,()=>({cgi_id:105,service:"tcb",action:"DescribeDbDistribution",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeMonitorDataContract=new factory_1.default("ITCTCBDescribeMonitorDataInput","ITCTCBDescribeMonitorDataOutput",validations.tcbDescribeMonitorDataOutputValidation,()=>({cgi_id:106,service:"tcb",action:"DescribeMonitorData",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCurveDataContract=new factory_1.default("ITCTCBDescribeCurveDataInput","ITCTCBDescribeCurveDataOutput",validations.tcbDescribeCurveDataOutputValidation,()=>({cgi_id:117,service:"tcb",action:"DescribeCurveData",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeStorageACLContract=new factory_1.default("ITCTCBDescribeStorageACLInput","ITCTCBDescribeStorageACLOutput",validations.tcbDescribeStorageACLOutputValidation,()=>({cgi_id:107,service:"tcb",action:"DescribeStorageACL",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyStorageACLContract=new factory_1.default("ITCTCBModifyStorageACLInput","ITCTCBModifyStorageACLOutput",validations.tcbModifyStorageACLOutputValidation,()=>({cgi_id:108,service:"tcb",action:"ModifyStorageACL",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeStorageACLTaskContract=new factory_1.default("ITCTCBDescribeStorageACLTaskInput","ITCTCBDescribeStorageACLTaskOutput",validations.tcbDescribeStorageACLTaskOutputValidation,()=>({cgi_id:109,service:"tcb",action:"DescribeStorageACLTask",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeDatabaseACLContract=new factory_1.default("ITCTCBDescribeDatabaseACLInput","ITCTCBDescribeDatabaseACLOutput",validations.tcbDescribeDatabaseACLOutputValidation,()=>({cgi_id:110,service:"tcb",action:"DescribeDatabaseACL",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyDatabaseACLContract=new factory_1.default("ITCTCBModifyDatabaseACLInput","ITCTCBModifyDatabaseACLOutput",validations.tcbModifyDatabaseACLOutputValidation,()=>({cgi_id:111,service:"tcb",action:"ModifyDatabaseACL",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDatabaseMigrateImportContract=new factory_1.default("ITCTCBDatabaseMigrateImportInput","ITCTCBDatabaseMigrateImportOutput",validations.tcbDatabaseMigrateImportOutputValidation,()=>({cgi_id:112,service:"tcb",action:"DatabaseMigrateImport",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDatabaseMigrateExportContract=new factory_1.default("ITCTCBDatabaseMigrateExportInput","ITCTCBDatabaseMigrateExportOutput",validations.tcbDatabaseMigrateExportOutputValidation,()=>({cgi_id:113,service:"tcb",action:"DatabaseMigrateExport",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDatabaseMigrateQueryInfoContract=new factory_1.default("ITCTCBDatabaseMigrateQueryInfoInput","ITCTCBDatabaseMigrateQueryInfoOutput",validations.tcbDatabaseMigrateQueryInfoOutputValidation,()=>({cgi_id:114,service:"tcb",action:"DatabaseMigrateQueryInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifySafeRuleContract=new factory_1.default("ITCTCBModifySafeRuleInput","ITCTCBModifySafeRuleOutput",validations.tcbModifySafeRuleOutputValidation,()=>({cgi_id:114,service:"tcb",action:"ModifySafeRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeSafeRuleContract=new factory_1.default("ITCTCBDescribeSafeRuleInput","ITCTCBDescribeSafeRuleOutput",validations.tcbDescribeSafeRuleOutputValidation,()=>({cgi_id:114,service:"tcb",action:"DescribeSafeRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateEnvAndResourceContract=new factory_1.default("ITCTCBCreateEnvAndResourceInput","ITCTCBCreateEnvAndResourceOutput",validations.tcbCreateEnvAndResourceOutputValidation,()=>({cgi_id:115,service:"tcb",action:"CreateEnvAndResource",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCheckEnvIdContract=new factory_1.default("ITCTCBCheckEnvIdInput","ITCTCBCheckEnvIdOutput",validations.tcbCheckEnvIdOutputValidation,()=>({cgi_id:116,service:"tcb",action:"CheckEnvId",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeEnvAccountCircleContract=new factory_1.default("ITCTCBDescribeEnvAccountCircleInput","ITCTCBDescribeEnvAccountCircleOutput",validations.tcbDescribeEnvAccountCircleOutputValidation,()=>({cgi_id:119,service:"tcb",action:"DescribeEnvAccountCircle",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribePackagesContract=new factory_1.default("ITCTCBDescribePackagesInput","ITCTCBDescribePackagesOutput",validations.tcbDescribePackagesOutputValidation,()=>({cgi_id:120,service:"tcb",action:"DescribePackages",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbInqueryPriceContract=new factory_1.default("ITCTCBInqueryPriceInput","ITCTCBInqueryPriceOutput",validations.tcbInqueryPriceOutputValidation,()=>({cgi_id:121,service:"tcb",action:"InqueryPrice",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateDealContract=new factory_1.default("ITCTCBCreateDealInput","ITCTCBCreateDealOutput",validations.tcbCreateDealOutputValidation,()=>({cgi_id:122,service:"tcb",action:"CreateDeal",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribePayInfoContract=new factory_1.default("ITCTCBDescribePayInfoInput","ITCTCBDescribePayInfoOutput",validations.tcbDescribePayInfoOutputValidation,()=>({cgi_id:123,service:"tcb",action:"DescribePayInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbQueryDealsContract=new factory_1.default("ITCTCBQueryDealsInput","ITCTCBQueryDealsOutput",validations.tcbQueryDealsOutputValidation,()=>({cgi_id:124,service:"tcb",action:"QueryDeals",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCancelDealContract=new factory_1.default("ITCTCBCancelDealInput","ITCTCBCancelDealOutput",validations.tcbCancelDealOutputValidation,()=>({cgi_id:125,service:"tcb",action:"CancelDeal",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteDealContract=new factory_1.default("ITCTCBDeleteDealInput","ITCTCBDeleteDealOutput",validations.tcbDeleteDealOutputValidation,()=>({cgi_id:126,service:"tcb",action:"DeleteDeal",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCheckEnvPackageModifyContract=new factory_1.default("ITCTCBCheckEnvPackageModifyInput","ITCTCBCheckEnvPackageModifyOutput",validations.tcbCheckEnvPackageModifyOutputValidation,()=>({cgi_id:127,service:"tcb",action:"CheckEnvPackageModify",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeBillingInfoContract=new factory_1.default("ITCTCBDescribeBillingInfoInput","ITCTCBDescribeBillingInfoOutput",validations.tcbDescribeBillingInfoOutputValidation,()=>({cgi_id:128,service:"tcb",action:"DescribeBillingInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeNextExpireTimeContract=new factory_1.default("ITCTCBDescribeNextExpireTimeInput","ITCTCBDescribeNextExpireTimeOutput",validations.tcbDescribeNextExpireTimeOutputValidation,()=>({cgi_id:129,service:"tcb",action:"DescribeNextExpireTime",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeInvoiceAmountContract=new factory_1.default("ITCTCBDescribeInvoiceAmountInput","ITCTCBDescribeInvoiceAmountOutput",validations.tcbDescribeInvoiceAmountOutputValidation,()=>({cgi_id:129,service:"tcb",action:"DescribeInvoiceAmount",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeInvoiceSubjectContract=new factory_1.default("ITCTCBDescribeInvoiceSubjectInput","ITCTCBDescribeInvoiceSubjectOutput",validations.tcbDescribeInvoiceSubjectOutputValidation,()=>({cgi_id:130,service:"tcb",action:"DescribeInvoiceSubject",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbSetInvoiceSubjectContract=new factory_1.default("ITCTCBSetInvoiceSubjectInput","ITCTCBSetInvoiceSubjectOutput",validations.tcbSetInvoiceSubjectOutputValidation,()=>({cgi_id:131,service:"tcb",action:"SetInvoiceSubject",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeInvoicePostInfoContract=new factory_1.default("ITCTCBDescribeInvoicePostInfoInput","ITCTCBDescribeInvoicePostInfoOutput",validations.tcbDescribeInvoicePostInfoOutputValidation,()=>({cgi_id:132,service:"tcb",action:"DescribeInvoicePostInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateInvoicePostInfoContract=new factory_1.default("ITCTCBCreateInvoicePostInfoInput","ITCTCBCreateInvoicePostInfoOutput",validations.tcbCreateInvoicePostInfoOutputValidation,()=>({cgi_id:133,service:"tcb",action:"CreateInvoicePostInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyInvoicePostInfoContract=new factory_1.default("ITCTCBModifyInvoicePostInfoInput","ITCTCBModifyInvoicePostInfoOutput",validations.tcbModifyInvoicePostInfoOutputValidation,()=>({cgi_id:134,service:"tcb",action:"ModifyInvoicePostInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteInvoicePostInfoContract=new factory_1.default("ITCTCBDeleteInvoicePostInfoInput","ITCTCBDeleteInvoicePostInfoOutput",validations.tcbDeleteInvoicePostInfoOutputValidation,()=>({cgi_id:135,service:"tcb",action:"DeleteInvoicePostInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateInvoiceContract=new factory_1.default("ITCTCBCreateInvoiceInput","ITCTCBCreateInvoiceOutput",validations.tcbCreateInvoiceOutputValidation,()=>({cgi_id:136,service:"tcb",action:"CreateInvoice",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeInvoiceListContract=new factory_1.default("ITCTCBDescribeInvoiceListInput","ITCTCBDescribeInvoiceListOutput",validations.tcbDescribeInvoiceListOutputValidation,()=>({cgi_id:137,service:"tcb",action:"DescribeInvoiceList",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeInvoiceDetailContract=new factory_1.default("ITCTCBDescribeInvoiceDetailInput","ITCTCBDescribeInvoiceDetailOutput",validations.tcbDescribeInvoiceDetailOutputValidation,()=>({cgi_id:138,service:"tcb",action:"DescribeInvoiceDetail",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbRevokeInvoiceContract=new factory_1.default("ITCTCBRevokeInvoiceInput","ITCTCBRevokeInvoiceOutput",validations.tcbRevokeInvoiceOutputValidation,()=>({cgi_id:139,service:"tcb",action:"RevokeInvoice",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeAuthentificationContract=new factory_1.default("ITCTCBDescribeAuthentificationInput","ITCTCBDescribeAuthentificationOutput",validations.tcbDescribeAuthentificationOutputValidation,()=>({cgi_id:140,service:"tcb",action:"DescribeAuthentification",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeEnvResourceExceptionContract=new factory_1.default("ITCTCBDescribeEnvResourceExceptionInput","ITCTCBDescribeEnvResourceExceptionOutput",validations.tcbDescribeEnvResourceExceptionOutputValidation,()=>({cgi_id:141,service:"tcb",action:"DescribeEnvResourceException",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbResourceRecoverContract=new factory_1.default("ITCTCBResourceRecoverInput","ITCTCBResourceRecoverOutput",validations.tcbResourceRecoverOutputValidation,()=>({cgi_id:142,service:"tcb",action:"ResourceRecover",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeResourceRecoverJobContract=new factory_1.default("ITCTCBDescribeResourceRecoverJobInput","ITCTCBDescribeResourceRecoverJobOutput",validations.tcbDescribeResourceRecoverJobOutputValidation,()=>({cgi_id:143,service:"tcb",action:"DescribeResourceRecoverJob",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeVouchersInfoByDealContract=new factory_1.default("ITCTCBDescribeVouchersInfoByDealInput","ITCTCBDescribeVouchersInfoByDealOutput",validations.tcbDescribeVouchersInfoByDealOutputValidation,()=>({cgi_id:144,service:"tcb",action:"DescribeVouchersInfoByDeal",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeAmountAfterDeductionContract=new factory_1.default("ITCTCBDescribeAmountAfterDeductionInput","ITCTCBDescribeAmountAfterDeductionOutput",validations.tcbDescribeAmountAfterDeductionOutputValidation,()=>({cgi_id:145,service:"tcb",action:"DescribeAmountAfterDeduction",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeVouchersInfoContract=new factory_1.default("ITCTCBDescribeVouchersInfoInput","ITCTCBDescribeVouchersInfoOutput",validations.tcbDescribeVouchersInfoOutputValidation,()=>({cgi_id:146,service:"tcb",action:"DescribeVouchersInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeVoucherPlanAvailableContract=new factory_1.default("ITCTCBDescribeVoucherPlanAvailableInput","ITCTCBDescribeVoucherPlanAvailableOutput",validations.tcbDescribeVoucherPlanAvailableOutputValidation,()=>({cgi_id:147,service:"tcb",action:"DescribeVoucherPlanAvailable",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbApplyVoucherContract=new factory_1.default("ITCTCBApplyVoucherInput","ITCTCBApplyVoucherOutput",validations.tcbApplyVoucherOutputValidation,()=>({cgi_id:148,service:"tcb",action:"ApplyVoucher",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeVoucherApplicationContract=new factory_1.default("ITCTCBDescribeVoucherApplicationInput","ITCTCBDescribeVoucherApplicationOutput",validations.tcbDescribeVoucherApplicationOutputValidation,()=>({cgi_id:149,service:"tcb",action:"DescribeVoucherApplication",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteVoucherApplicationContract=new factory_1.default("ITCTCBDeleteVoucherApplicationInput","ITCTCBDeleteVoucherApplicationOutput",validations.tcbDeleteVoucherApplicationOutputValidation,()=>({cgi_id:150,service:"tcb",action:"DeleteVoucherApplication",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeMonitorResourceContract=new factory_1.default("ITCTCBDescribeMonitorResourceInput","ITCTCBDescribeMonitorResourceOutput",validations.tcbDescribeMonitorResourceOutputValidation,()=>({cgi_id:151,service:"tcb",action:"DescribeMonitorResource",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeMonitorPolicyContract=new factory_1.default("ITCTCBDescribeMonitorPolicyInput","ITCTCBDescribeMonitorPolicyOutput",validations.tcbDescribeMonitorPolicyOutputValidation,()=>({cgi_id:152,service:"tcb",action:"DescribeMonitorPolicy",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateMonitorPolicyContract=new factory_1.default("ITCTCBCreateMonitorPolicyInput","ITCTCBCreateMonitorPolicyOutput",validations.tcbCreateMonitorPolicyOutputValidation,()=>({cgi_id:153,service:"tcb",action:"CreateMonitorPolicy",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteMonitorPolicyContract=new factory_1.default("ITCTCBDeleteMonitorPolicyInput","ITCTCBDeleteMonitorPolicyOutput",validations.tcbDeleteMonitorPolicyOutputValidation,()=>({cgi_id:154,service:"tcb",action:"DeleteMonitorPolicy",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyMonitorPolicyContract=new factory_1.default("ITCTCBModifyMonitorPolicyInput","ITCTCBModifyMonitorPolicyOutput",validations.tcbModifyMonitorPolicyOutputValidation,()=>({cgi_id:155,service:"tcb",action:"ModifyMonitorPolicy",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeMonitorConditionContract=new factory_1.default("ITCTCBDescribeMonitorConditionInput","ITCTCBDescribeMonitorConditionOutput",validations.tcbDescribeMonitorConditionOutputValidation,()=>({cgi_id:156,service:"tcb",action:"DescribeMonitorCondition",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateMonitorConditionContract=new factory_1.default("ITCTCBCreateMonitorConditionInput","ITCTCBCreateMonitorConditionOutput",validations.tcbCreateMonitorConditionOutputValidation,()=>({cgi_id:157,service:"tcb",action:"CreateMonitorCondition",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteMonitorConditionContract=new factory_1.default("ITCTCBDeleteMonitorConditionInput","ITCTCBDeleteMonitorConditionOutput",validations.tcbDeleteMonitorConditionOutputValidation,()=>({cgi_id:158,service:"tcb",action:"DeleteMonitorCondition",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyMonitorConditionContract=new factory_1.default("ITCTCBModifyMonitorConditionInput","ITCTCBModifyMonitorConditionOutput",validations.tcbModifyMonitorConditionOutputValidation,()=>({cgi_id:159,service:"tcb",action:"ModifyMonitorCondition",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeDauDataContract=new factory_1.default("ITCTCBDescribeDauDataInput","ITCTCBDescribeDauDataOutput",validations.tcbDescribeDauDataOutputValidation,()=>({cgi_id:160,service:"tcb",action:"DescribeDauData",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeChangePayContract=new factory_1.default("ITCTCBDescribeChangePayInput","ITCTCBDescribeChangePayOutput",validations.tcbDescribeChangePayOutputValidation,()=>({cgi_id:161,service:"tcb",action:"DescribeChangePay",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeRestoreHistoryContract=new factory_1.default("ITCTCBDescribeRestoreHistoryInput","ITCTCBDescribeRestoreHistoryOutput",validations.tcbDescribeRestoreHistoryOutputValidation,()=>({cgi_id:162,service:"tcb",action:"DescribeRestoreHistory",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCommonServiceAPIContract=new factory_1.default("ITCTCBCommonServiceAPIInput","ITCTCBCommonServiceAPIOutput",validations.tcbCommonServiceAPIOutputValidation,()=>({cgi_id:163,service:"tcb",action:"CommonServiceAPI",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreatePostpayPackageContract=new factory_1.default("ITCTCBCreatePostpayPackageInput","ITCTCBCreatePostpayPackageOutput",validations.tcbCreatePostpayPackageOutputValidation,()=>({cgi_id:164,service:"tcb",action:"CreatePostpayPackage",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbInqueryPostpayPriceContract=new factory_1.default("ITCTCBInqueryPostpayPriceInput","ITCTCBInqueryPostpayPriceOutput",validations.tcbInqueryPostpayPriceOutputValidation,()=>({cgi_id:165,service:"tcb",action:"InqueryPostpayPrice",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribePostpayFreeQuotasContract=new factory_1.default("ITCTCBDescribePostpayFreeQuotasInput","ITCTCBDescribePostpayFreeQuotasOutput",validations.tcbDescribePostpayFreeQuotasOutputValidation,()=>({cgi_id:166,service:"tcb",action:"DescribePostpayFreeQuotas",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyStorageSafeRuleContract=new factory_1.default("ITCTCBModifyStorageSafeRuleInput","ITCTCBModifyStorageSafeRuleOutput",validations.tcbModifyStorageSafeRuleOutputValidation,()=>({cgi_id:167,service:"tcb",action:"ModifyStorageSafeRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeStorageSafeRuleContract=new factory_1.default("ITCTCBDescribeStorageSafeRuleInput","ITCTCBDescribeStorageSafeRuleOutput",validations.tcbDescribeStorageSafeRuleOutputValidation,()=>({cgi_id:168,service:"tcb",action:"DescribeStorageSafeRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCDNChainTaskContract=new factory_1.default("ITCTCBDescribeCDNChainTaskInput","ITCTCBDescribeCDNChainTaskOutput",validations.tcbDescribeCDNChainTaskOutputValidation,()=>({cgi_id:169,service:"tcb",action:"DescribeCDNChainTask",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeLoginConfigsContract=new factory_1.default("ITCTCBDescribeLoginConfigsInput","ITCTCBDescribeLoginConfigsOutput",validations.tcbDescribeLoginConfigsOutputValidation,()=>({cgi_id:170,service:"tcb",action:"DescribeLoginConfigs",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateLoginConfigContract=new factory_1.default("ITCTCBCreateLoginConfigInput","ITCTCBCreateLoginConfigOutput",validations.tcbCreateLoginConfigOutputValidation,()=>({cgi_id:171,service:"tcb",action:"CreateLoginConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbUpdateLoginConfigContract=new factory_1.default("ITCTCBUpdateLoginConfigInput","ITCTCBUpdateLoginConfigOutput",validations.tcbUpdateLoginConfigOutputValidation,()=>({cgi_id:172,service:"tcb",action:"UpdateLoginConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeSecurityRuleContract=new factory_1.default("ITCTCBDescribeSecurityRuleInput","ITCTCBDescribeSecurityRuleOutput",validations.tcbDescribeSecurityRuleOutputValidation,()=>({cgi_id:173,service:"tcb",action:"DescribeSecurityRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifySecurityRuleContract=new factory_1.default("ITCTCBModifySecurityRuleInput","ITCTCBModifySecurityRuleOutput",validations.tcbModifySecurityRuleOutputValidation,()=>({cgi_id:174,service:"tcb",action:"ModifySecurityRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateStaticStoreContract=new factory_1.default("ITCTCBCreateStaticStoreInput","ITCTCBCreateStaticStoreOutput",validations.tcbCreateStaticStoreOutputValidation,()=>({cgi_id:175,service:"tcb",action:"CreateStaticStore",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDestroyStaticStoreContract=new factory_1.default("ITCTCBDestroyStaticStoreInput","ITCTCBDestroyStaticStoreOutput",validations.tcbDestroyStaticStoreOutputValidation,()=>({cgi_id:176,service:"tcb",action:"DestroyStaticStore",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeStaticStoreContract=new factory_1.default("ITCTCBDescribeStaticStoreInput","ITCTCBDescribeStaticStoreOutput",validations.tcbDescribeStaticStoreOutputValidation,()=>({cgi_id:177,service:"tcb",action:"DescribeStaticStore",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeEnvLimitContract=new factory_1.default("ITCTCBDescribeEnvLimitInput","ITCTCBDescribeEnvLimitOutput",validations.tcbDescribeEnvLimitOutputValidation,()=>({cgi_id:178,service:"tcb",action:"DescribeEnvLimit",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeAccountInfoByPlatformIdContract=new factory_1.default("ITCTCBDescribeAccountInfoByPlatformIdInput","ITCTCBDescribeAccountInfoByPlatformIdOutput",validations.tcbDescribeAccountInfoByPlatformIdOutputValidation,()=>({cgi_id:179,service:"tcb",action:"DescribeAccountInfoByPlatformId",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeEnvFreeQuotaContract=new factory_1.default("ITCTCBDescribeEnvFreeQuotaInput","ITCTCBDescribeEnvFreeQuotaOutput",validations.tcbDescribeEnvFreeQuotaOutputValidation,()=>({cgi_id:180,service:"tcb",action:"DescribeEnvFreeQuota",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeHostingDomainContract=new factory_1.default("ITCTCBDescribeHostingDomainInput","ITCTCBDescribeHostingDomainOutput",validations.tcbDescribeHostingDomainOutputValidation,()=>({cgi_id:181,service:"tcb",action:"DescribeHostingDomain",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunResourceContract=new factory_1.default("ITCTCBDescribeCloudBaseRunResourceInput","ITCTCBDescribeCloudBaseRunResourceOutput",validations.tcbDescribeCloudBaseRunResourceOutputValidation,()=>({cgi_id:182,service:"tcb",action:"DescribeCloudBaseRunResource",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunServersContract=new factory_1.default("ITCTCBDescribeCloudBaseRunServersInput","ITCTCBDescribeCloudBaseRunServersOutput",validations.tcbDescribeCloudBaseRunServersOutputValidation,()=>({cgi_id:183,service:"tcb",action:"DescribeCloudBaseRunServers",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateCloudBaseRunResourceContract=new factory_1.default("ITCTCBCreateCloudBaseRunResourceInput","ITCTCBCreateCloudBaseRunResourceOutput",validations.tcbCreateCloudBaseRunResourceOutputValidation,()=>({cgi_id:184,service:"tcb",action:"CreateCloudBaseRunResource",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunBuildServerContract=new factory_1.default("ITCTCBDescribeCloudBaseRunBuildServerInput","ITCTCBDescribeCloudBaseRunBuildServerOutput",validations.tcbDescribeCloudBaseRunBuildServerOutputValidation,()=>({cgi_id:210,service:"tcb",action:"DescribeCloudBaseRunBuildServer",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunServerContract=new factory_1.default("ITCTCBDescribeCloudBaseRunServerInput","ITCTCBDescribeCloudBaseRunServerOutput",validations.tcbDescribeCloudBaseRunServerOutputValidation,()=>({cgi_id:211,service:"tcb",action:"DescribeCloudBaseRunServer",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunContainerSpecContract=new factory_1.default("ITCTCBDescribeCloudBaseRunContainerSpecInput","ITCTCBDescribeCloudBaseRunContainerSpecOutput",validations.tcbDescribeCloudBaseRunContainerSpecOutputValidation,()=>({cgi_id:212,service:"tcb",action:"DescribeCloudBaseRunContainerSpec",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateCloudBaseRunServerVersionContract=new factory_1.default("ITCTCBCreateCloudBaseRunServerVersionInput","ITCTCBCreateCloudBaseRunServerVersionOutput",validations.tcbCreateCloudBaseRunServerVersionOutputValidation,()=>({cgi_id:213,service:"tcb",action:"CreateCloudBaseRunServerVersion",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunServerVersionContract=new factory_1.default("ITCTCBDescribeCloudBaseRunServerVersionInput","ITCTCBDescribeCloudBaseRunServerVersionOutput",validations.tcbDescribeCloudBaseRunServerVersionOutputValidation,()=>({cgi_id:214,service:"tcb",action:"DescribeCloudBaseRunServerVersion",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbEstablishCloudBaseRunServerContract=new factory_1.default("ITCTCBEstablishCloudBaseRunServerInput","ITCTCBEstablishCloudBaseRunServerOutput",validations.tcbEstablishCloudBaseRunServerOutputValidation,()=>({cgi_id:215,service:"tcb",action:"EstablishCloudBaseRunServer",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteCloudBaseRunResourceContract=new factory_1.default("ITCTCBDeleteCloudBaseRunResourceInput","ITCTCBDeleteCloudBaseRunResourceOutput",validations.tcbDeleteCloudBaseRunResourceOutputValidation,()=>({cgi_id:216,service:"tcb",action:"DeleteCloudBaseRunResource",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunPodListContract=new factory_1.default("ITCTCBDescribeCloudBaseRunPodListInput","ITCTCBDescribeCloudBaseRunPodListOutput",validations.tcbDescribeCloudBaseRunPodListOutputValidation,()=>({cgi_id:217,service:"tcb",action:"DescribeCloudBaseRunPodList",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunBuildLogContract=new factory_1.default("ITCTCBDescribeCloudBaseRunBuildLogInput","ITCTCBDescribeCloudBaseRunBuildLogOutput",validations.tcbDescribeCloudBaseRunBuildLogOutputValidation,()=>({cgi_id:218,service:"tcb",action:"DescribeCloudBaseRunBuildLog",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseBuildServiceContract=new factory_1.default("ITCTCBDescribeCloudBaseBuildServiceInput","ITCTCBDescribeCloudBaseBuildServiceOutput",validations.tcbDescribeCloudBaseBuildServiceOutputValidation,()=>({cgi_id:219,service:"tcb",action:"DescribeCloudBaseBuildService",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunVersionExceptionContract=new factory_1.default("ITCTCBDescribeCloudBaseRunVersionExceptionInput","ITCTCBDescribeCloudBaseRunVersionExceptionOutput",validations.tcbDescribeCloudBaseRunVersionExceptionOutputValidation,()=>({cgi_id:220,service:"tcb",action:"DescribeCloudBaseRunVersionException",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyCloudBaseRunServerVersionContract=new factory_1.default("ITCTCBModifyCloudBaseRunServerVersionInput","ITCTCBModifyCloudBaseRunServerVersionOutput",validations.tcbModifyCloudBaseRunServerVersionOutputValidation,()=>({cgi_id:221,service:"tcb",action:"ModifyCloudBaseRunServerVersion",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseGWAPIContract=new factory_1.default("ITCTCBDescribeCloudBaseGWAPIInput","ITCTCBDescribeCloudBaseGWAPIOutput",validations.tcbDescribeCloudBaseGWAPIOutputValidation,()=>({cgi_id:222,service:"tcb",action:"DescribeCloudBaseGWAPI",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunBuildStagesContract=new factory_1.default("ITCTCBDescribeCloudBaseRunBuildStagesInput","ITCTCBDescribeCloudBaseRunBuildStagesOutput",validations.tcbDescribeCloudBaseRunBuildStagesOutputValidation,()=>({cgi_id:223,service:"tcb",action:"DescribeCloudBaseRunBuildStages",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunBuildStepsContract=new factory_1.default("ITCTCBDescribeCloudBaseRunBuildStepsInput","ITCTCBDescribeCloudBaseRunBuildStepsOutput",validations.tcbDescribeCloudBaseRunBuildStepsOutputValidation,()=>({cgi_id:224,service:"tcb",action:"DescribeCloudBaseRunBuildSteps",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunBuildStepLogContract=new factory_1.default("ITCTCBDescribeCloudBaseRunBuildStepLogInput","ITCTCBDescribeCloudBaseRunBuildStepLogOutput",validations.tcbDescribeCloudBaseRunBuildStepLogOutputValidation,()=>({cgi_id:225,service:"tcb",action:"DescribeCloudBaseRunBuildStepLog",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteCloudBaseRunServerVersionContract=new factory_1.default("ITCTCBDeleteCloudBaseRunServerVersionInput","ITCTCBDeleteCloudBaseRunServerVersionOutput",validations.tcbDeleteCloudBaseRunServerVersionOutputValidation,()=>({cgi_id:226,service:"tcb",action:"DeleteCloudBaseRunServerVersion",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteCloudBaseRunImageRepoContract=new factory_1.default("ITCTCBDeleteCloudBaseRunImageRepoInput","ITCTCBDeleteCloudBaseRunImageRepoOutput",validations.tcbDeleteCloudBaseRunImageRepoOutputValidation,()=>({cgi_id:227,service:"tcb",action:"DeleteCloudBaseRunImageRepo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbRollUpdateCloudBaseRunServerVersionContract=new factory_1.default("ITCTCBRollUpdateCloudBaseRunServerVersionInput","ITCTCBRollUpdateCloudBaseRunServerVersionOutput",validations.tcbRollUpdateCloudBaseRunServerVersionOutputValidation,()=>({cgi_id:228,service:"tcb",action:"RollUpdateCloudBaseRunServerVersion",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyCloudBaseRunServerFlowConfContract=new factory_1.default("ITCTCBModifyCloudBaseRunServerFlowConfInput","ITCTCBModifyCloudBaseRunServerFlowConfOutput",validations.tcbModifyCloudBaseRunServerFlowConfOutputValidation,()=>({cgi_id:229,service:"tcb",action:"ModifyCloudBaseRunServerFlowConf",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteCloudBaseRunServerContract=new factory_1.default("ITCTCBDeleteCloudBaseRunServerInput","ITCTCBDeleteCloudBaseRunServerOutput",validations.tcbDeleteCloudBaseRunServerOutputValidation,()=>({cgi_id:230,service:"tcb",action:"DeleteCloudBaseRunServer",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseCodeReposContract=new factory_1.default("ITCTCBDescribeCloudBaseCodeReposInput","ITCTCBDescribeCloudBaseCodeReposOutput",validations.tcbDescribeCloudBaseCodeReposOutputValidation,()=>({cgi_id:231,service:"tcb",action:"DescribeCloudBaseCodeRepos",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseCodeBranchContract=new factory_1.default("ITCTCBDescribeCloudBaseCodeBranchInput","ITCTCBDescribeCloudBaseCodeBranchOutput",validations.tcbDescribeCloudBaseCodeBranchOutputValidation,()=>({cgi_id:232,service:"tcb",action:"DescribeCloudBaseCodeBranch",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateHostingDomainContract=new factory_1.default("ITCTCBCreateHostingDomainInput","ITCTCBCreateHostingDomainOutput",validations.tcbCreateHostingDomainOutputValidation,()=>({cgi_id:233,service:"tcb",action:"CreateHostingDomain",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribePostpayPackageListContract=new factory_1.default("ITCTCBDescribePostpayPackageListInput","ITCTCBDescribePostpayPackageListOutput",validations.tcbDescribePostpayPackageListOutputValidation,()=>({cgi_id:233,service:"tcb",action:"DescribePostpayPackageList",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteHostingDomainContract=new factory_1.default("ITCTCBDeleteHostingDomainInput","ITCTCBDeleteHostingDomainOutput",validations.tcbDeleteHostingDomainOutputValidation,()=>({cgi_id:234,service:"tcb",action:"DeleteHostingDomain",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbQueryActivityPriceContract=new factory_1.default("ITCTCBQueryActivityPriceInput","ITCTCBQueryActivityPriceOutput",validations.tcbQueryActivityPriceOutputValidation,()=>({cgi_id:234,service:"tcb",action:"QueryActivityPrice",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyHostingDomainContract=new factory_1.default("ITCTCBModifyHostingDomainInput","ITCTCBModifyHostingDomainOutput",validations.tcbModifyHostingDomainOutputValidation,()=>({cgi_id:235,service:"tcb",action:"ModifyHostingDomain",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCheckQualificationContract=new factory_1.default("ITCTCBCheckQualificationInput","ITCTCBCheckQualificationOutput",validations.tcbCheckQualificationOutputValidation,()=>({cgi_id:235,service:"tcb",action:"CheckQualification",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbOnlineHostingDomainContract=new factory_1.default("ITCTCBOnlineHostingDomainInput","ITCTCBOnlineHostingDomainOutput",validations.tcbOnlineHostingDomainOutputValidation,()=>({cgi_id:236,service:"tcb",action:"OnlineHostingDomain",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateActivityDealContract=new factory_1.default("ITCTCBCreateActivityDealInput","ITCTCBCreateActivityDealOutput",validations.tcbCreateActivityDealOutputValidation,()=>({cgi_id:236,service:"tcb",action:"CreateActivityDeal",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeActivityGoodsContract=new factory_1.default("ITCTCBDescribeActivityGoodsInput","ITCTCBDescribeActivityGoodsOutput",validations.tcbDescribeActivityGoodsOutputValidation,()=>({cgi_id:237,service:"tcb",action:"DescribeActivityGoods",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbInqueryPackagePriceContract=new factory_1.default("ITCTCBInqueryPackagePriceInput","ITCTCBInqueryPackagePriceOutput",validations.tcbInqueryPackagePriceOutputValidation,()=>({cgi_id:238,service:"tcb",action:"InqueryPackagePrice",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeEnvPostpayPackageContract=new factory_1.default("ITCTCBDescribeEnvPostpayPackageInput","ITCTCBDescribeEnvPostpayPackageOutput",validations.tcbDescribeEnvPostpayPackageOutputValidation,()=>({cgi_id:239,service:"tcb",action:"DescribeEnvPostpayPackage",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribePostpayQuotaLimitContract=new factory_1.default("ITCTCBDescribePostpayQuotaLimitInput","ITCTCBDescribePostpayQuotaLimitOutput",validations.tcbDescribePostpayQuotaLimitOutputValidation,()=>({cgi_id:240,service:"tcb",action:"DescribePostpayQuotaLimit",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbUpdatePostpayQuotaLimitStatusContract=new factory_1.default("ITCTCBUpdatePostpayQuotaLimitStatusInput","ITCTCBUpdatePostpayQuotaLimitStatusOutput",validations.tcbUpdatePostpayQuotaLimitStatusOutputValidation,()=>({cgi_id:241,service:"tcb",action:"UpdatePostpayQuotaLimitStatus",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbUpdatePostpayQuotaLimitContract=new factory_1.default("ITCTCBUpdatePostpayQuotaLimitInput","ITCTCBUpdatePostpayQuotaLimitOutput",validations.tcbUpdatePostpayQuotaLimitOutputValidation,()=>({cgi_id:242,service:"tcb",action:"UpdatePostpayQuotaLimit",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbUpdateScfConfigContract=new factory_1.default("ITCTCBUpdateScfConfigInput","ITCTCBUpdateScfConfigOutput",validations.tcbUpdateScfConfigOutputValidation,()=>({cgi_id:243,service:"tcb",action:"UpdateScfConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateInstallExtensionTaskContract=new factory_1.default("ITCTCBCreateInstallExtensionTaskInput","ITCTCBCreateInstallExtensionTaskOutput",validations.tcbCreateInstallExtensionTaskOutputValidation,()=>({cgi_id:244,service:"tcb",action:"CreateInstallExtensionTask",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateUninstallExtensionTaskContract=new factory_1.default("ITCTCBCreateUninstallExtensionTaskInput","ITCTCBCreateUninstallExtensionTaskOutput",validations.tcbCreateUninstallExtensionTaskOutputValidation,()=>({cgi_id:245,service:"tcb",action:"CreateUninstallExtensionTask",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeExtensionInstalledContract=new factory_1.default("ITCTCBDescribeExtensionInstalledInput","ITCTCBDescribeExtensionInstalledOutput",validations.tcbDescribeExtensionInstalledOutputValidation,()=>({cgi_id:246,service:"tcb",action:"DescribeExtensionInstalled",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeExtensionTaskStatusContract=new factory_1.default("ITCTCBDescribeExtensionTaskStatusInput","ITCTCBDescribeExtensionTaskStatusOutput",validations.tcbDescribeExtensionTaskStatusOutputValidation,()=>({cgi_id:247,service:"tcb",action:"DescribeExtensionTaskStatus",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeExtensionTemplatesContract=new factory_1.default("ITCTCBDescribeExtensionTemplatesInput","ITCTCBDescribeExtensionTemplatesOutput",validations.tcbDescribeExtensionTemplatesOutputValidation,()=>({cgi_id:248,service:"tcb",action:"DescribeExtensionTemplates",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeExtensionUpgradeContract=new factory_1.default("ITCTCBDescribeExtensionUpgradeInput","ITCTCBDescribeExtensionUpgradeOutput",validations.tcbDescribeExtensionUpgradeOutputValidation,()=>({cgi_id:249,service:"tcb",action:"DescribeExtensionUpgrade",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeExtensionsContract=new factory_1.default("ITCTCBDescribeExtensionsInput","ITCTCBDescribeExtensionsOutput",validations.tcbDescribeExtensionsOutputValidation,()=>({cgi_id:250,service:"tcb",action:"DescribeExtensions",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateUpgradeExtensionTaskContract=new factory_1.default("ITCTCBCreateUpgradeExtensionTaskInput","ITCTCBCreateUpgradeExtensionTaskOutput",validations.tcbCreateUpgradeExtensionTaskOutputValidation,()=>({cgi_id:251,service:"tcb",action:"CreateUpgradeExtensionTask",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunOperationDetailsContract=new factory_1.default("ITCTCBDescribeCloudBaseRunOperationDetailsInput","ITCTCBDescribeCloudBaseRunOperationDetailsOutput",validations.tcbDescribeCloudBaseRunOperationDetailsOutputValidation,()=>({cgi_id:252,service:"tcb",action:"DescribeCloudBaseRunOperationDetails",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunVersionSnapshotContract=new factory_1.default("ITCTCBDescribeCloudBaseRunVersionSnapshotInput","ITCTCBDescribeCloudBaseRunVersionSnapshotOutput",validations.tcbDescribeCloudBaseRunVersionSnapshotOutputValidation,()=>({cgi_id:253,service:"tcb",action:"DescribeCloudBaseRunVersionSnapshot",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeQcloudSceneContract=new factory_1.default("ITCTCBDescribeQcloudSceneInput","ITCTCBDescribeQcloudSceneOutput",validations.tcbDescribeQcloudSceneOutputValidation,()=>({cgi_id:254,service:"tcb",action:"DescribeQcloudScene",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeSmsQuotasContract=new factory_1.default("ITCTCBDescribeSmsQuotasInput","ITCTCBDescribeSmsQuotasOutput",validations.tcbDescribeSmsQuotasOutputValidation,()=>({cgi_id:255,service:"tcb",action:"DescribeSmsQuotas",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeSmsAttrInfoContract=new factory_1.default("ITCTCBDescribeSmsAttrInfoInput","ITCTCBDescribeSmsAttrInfoOutput",validations.tcbDescribeSmsAttrInfoOutputValidation,()=>({cgi_id:256,service:"tcb",action:"DescribeSmsAttrInfo",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeTcbBalanceContract=new factory_1.default("ITCTCBDescribeTcbBalanceInput","ITCTCBDescribeTcbBalanceOutput",validations.tcbDescribeTcbBalanceOutputValidation,()=>({cgi_id:257,service:"tcb",action:"DescribeTcbBalance",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeSmsRecordsContract=new factory_1.default("ITCTCBDescribeSmsRecordsInput","ITCTCBDescribeSmsRecordsOutput",validations.tcbDescribeSmsRecordsOutputValidation,()=>({cgi_id:258,service:"tcb",action:"DescribeSmsRecords",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCloudBaseRunServiceDomainContract=new factory_1.default("ITCTCBDescribeCloudBaseRunServiceDomainInput","ITCTCBDescribeCloudBaseRunServiceDomainOutput",validations.tcbDescribeCloudBaseRunServiceDomainOutputValidation,()=>({cgi_id:259,service:"tcb",action:"DescribeCloudBaseRunServiceDomain",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyEnvContract=new factory_1.default("ITCTCBModifyEnvInput","ITCTCBModifyEnvOutput",validations.tcbModifyEnvOutputValidation,()=>({cgi_id:260,service:"tcb",action:"ModifyEnv",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeWxCloudBaseRunEnvsContract=new factory_1.default("ITCTCBDescribeWxCloudBaseRunEnvsInput","ITCTCBDescribeWxCloudBaseRunEnvsOutput",validations.tcbDescribeWxCloudBaseRunEnvsOutputValidation,()=>({cgi_id:260,service:"tcb",action:"DescribeWxCloudBaseRunEnvs",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeWxCloudBaseRunSubNetsContract=new factory_1.default("ITCTCBDescribeWxCloudBaseRunSubNetsInput","ITCTCBDescribeWxCloudBaseRunSubNetsOutput",validations.tcbDescribeWxCloudBaseRunSubNetsOutputValidation,()=>({cgi_id:261,service:"tcb",action:"DescribeWxCloudBaseRunSubNets",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbRefundPostpaidPackageContract=new factory_1.default("ITCTCBRefundPostpaidPackageInput","ITCTCBRefundPostpaidPackageOutput",validations.tcbRefundPostpaidPackageOutputValidation,()=>({cgi_id:266,service:"tcb",action:"RefundPostpaidPackage",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbQueryPostpaidPackageDealsContract=new factory_1.default("ITCTCBQueryPostpaidPackageDealsInput","ITCTCBQueryPostpaidPackageDealsOutput",validations.tcbQueryPostpaidPackageDealsOutputValidation,()=>({cgi_id:267,service:"tcb",action:"QueryPostpaidPackageDeals",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbSearchClsLogContract=new factory_1.default("ITCTCBSearchClsLogInput","ITCTCBSearchClsLogOutput",validations.tcbSearchClsLogOutputValidation,()=>({cgi_id:268,service:"tcb",action:"SearchClsLog",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeAuditRuleContract=new factory_1.default("ITCTCBDescribeAuditRuleInput","ITCTCBDescribeAuditRuleOutput",validations.tcbDescribeAuditRuleOutputValidation,()=>({cgi_id:269,service:"tcb",action:"DescribeAuditRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeCollectionsContract=new factory_1.default("ITCTCBDescribeCollectionsInput","ITCTCBDescribeCollectionsOutput",validations.tcbDescribeCollectionsOutputValidation,()=>({cgi_id:270,service:"tcb",action:"DescribeCollections",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateAuditRulesContract=new factory_1.default("ITCTCBCreateAuditRulesInput","ITCTCBCreateAuditRulesOutput",validations.tcbCreateAuditRulesOutputValidation,()=>({cgi_id:271,service:"tcb",action:"CreateAuditRules",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteAuditRuleContract=new factory_1.default("ITCTCBDeleteAuditRuleInput","ITCTCBDeleteAuditRuleOutput",validations.tcbDeleteAuditRuleOutputValidation,()=>({cgi_id:274,service:"tcb",action:"DeleteAuditRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbModifyAuditRuleContract=new factory_1.default("ITCTCBModifyAuditRuleInput","ITCTCBModifyAuditRuleOutput",validations.tcbModifyAuditRuleOutputValidation,()=>({cgi_id:275,service:"tcb",action:"ModifyAuditRule",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeAuditResultsContract=new factory_1.default("ITCTCBDescribeAuditResultsInput","ITCTCBDescribeAuditResultsOutput",validations.tcbDescribeAuditResultsOutputValidation,()=>({cgi_id:276,service:"tcb",action:"DescribeAuditResults",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbUnfreezeSecurityAuditRecordContract=new factory_1.default("ITCTCBUnfreezeSecurityAuditRecordInput","ITCTCBUnfreezeSecurityAuditRecordOutput",validations.tcbUnfreezeSecurityAuditRecordOutputValidation,()=>({cgi_id:277,service:"tcb",action:"UnfreezeSecurityAuditRecord",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeSecurityAuditConfigContract=new factory_1.default("ITCTCBDescribeSecurityAuditConfigInput","ITCTCBDescribeSecurityAuditConfigOutput",validations.tcbDescribeSecurityAuditConfigOutputValidation,()=>({cgi_id:278,service:"tcb",action:"DescribeSecurityAuditConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteSecurityAuditConfigContract=new factory_1.default("ITCTCBDeleteSecurityAuditConfigInput","ITCTCBDeleteSecurityAuditConfigOutput",validations.tcbDeleteSecurityAuditConfigOutputValidation,()=>({cgi_id:279,service:"tcb",action:"DeleteSecurityAuditConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateSecurityAuditConfigContract=new factory_1.default("ITCTCBCreateSecurityAuditConfigInput","ITCTCBCreateSecurityAuditConfigOutput",validations.tcbCreateSecurityAuditConfigOutputValidation,()=>({cgi_id:280,service:"tcb",action:"CreateSecurityAuditConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeTriggerServiceParametersContract=new factory_1.default("ITCTCBDescribeTriggerServiceParametersInput","ITCTCBDescribeTriggerServiceParametersOutput",validations.tcbDescribeTriggerServiceParametersOutputValidation,()=>({cgi_id:281,service:"tcb",action:"DescribeTriggerServiceParameters",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateTriggerConfigsContract=new factory_1.default("ITCTCBCreateTriggerConfigsInput","ITCTCBCreateTriggerConfigsOutput",validations.tcbCreateTriggerConfigsOutputValidation,()=>({cgi_id:282,service:"tcb",action:"CreateTriggerConfigs",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeTriggerConfigsContract=new factory_1.default("ITCTCBDescribeTriggerConfigsInput","ITCTCBDescribeTriggerConfigsOutput",validations.tcbDescribeTriggerConfigsOutputValidation,()=>({cgi_id:283,service:"tcb",action:"DescribeTriggerConfigs",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbUpdateTriggerConfigContract=new factory_1.default("ITCTCBUpdateTriggerConfigInput","ITCTCBUpdateTriggerConfigOutput",validations.tcbUpdateTriggerConfigOutputValidation,()=>({cgi_id:284,service:"tcb",action:"UpdateTriggerConfig",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDeleteTriggerConfigsContract=new factory_1.default("ITCTCBDeleteTriggerConfigsInput","ITCTCBDeleteTriggerConfigsOutput",validations.tcbDeleteTriggerConfigsOutputValidation,()=>({cgi_id:285,service:"tcb",action:"DeleteTriggerConfigs",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbCreateCopyEnvTaskContract=new factory_1.default("ITCTCBCreateCopyEnvTaskInput","ITCTCBCreateCopyEnvTaskOutput",validations.tcbCreateCopyEnvTaskOutputValidation,()=>({cgi_id:286,service:"tcb",action:"CreateCopyEnvTask",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.tcbDescribeExtensionsInstalledContract=new factory_1.default("ITCTCBDescribeExtensionsInstalledInput","ITCTCBDescribeExtensionsInstalledOutput",validations.tcbDescribeExtensionsInstalledOutputValidation,()=>({cgi_id:287,service:"tcb",action:"DescribeExtensionsInstalled",version:"2018-06-08",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./factory":1679975017964,"../validations/validations":1679975017966,"../transactor":1679975017961}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017964, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.allContractRecorder=exports.allContractsRecords=void 0;const validator_1=require("../../utils/validator"),eventemitter3_1=require("eventemitter3");exports.allContractsRecords=[],exports.allContractRecorder=new eventemitter3_1.EventEmitter,"undefined"!=typeof window&&"undefined"==typeof global&&(window.global={}),global.env&&global.env.isDev&&global.env.transact&&(global.allContractsRecords=exports.allContractsRecords);const noop=(...t)=>{};class TransactionContract extends eventemitter3_1.EventEmitter{constructor(t,o,e,r,n={}){super(),this.inputTypeName=t,this.outputTypeName=o,this.outputValidation=e,this.getHttpAgentIdentity=r,this.options=n,this.validator=new validator_1.Validator(o,e)}outputTransformationThrows(t,o){return this.options.outputTransformationThrows?this.options.outputTransformationThrows(t,o):t}inputTransformation(t,o){return this.options.inputTransformation?this.options.inputTransformation(t,o):t}validOutput(t){try{return this.validator.validThrows(t),!0}catch(t){return!1}}validOutputThrows(t){this.validator.validThrows(t)}commitRecord(t,o){if(!global.env||!global.env.transact)return;const e={timestamps:t.timestamps,rawOutput:t.rawOutput,input:t.input,maybeBrokenOutput:t.output,error:t.error,isPoll:Boolean(o),httpAgentIdentity:t.httpAgentIdentity};this.emit("record",e);const r=Object.assign({inputName:this.inputTypeName},e);exports.allContractsRecords.push(r),exports.allContractRecorder.emit("record",r)}}exports.default=TransactionContract;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017965, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.$multiType=exports.$arrayOf=exports.$optional=exports.Validator=exports.getType=void 0;const eventemitter3_1=require("eventemitter3");function getType(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}exports.getType=getType;class Validator extends eventemitter3_1.EventEmitter{constructor(t,e){super(),this.typeName=t||"#",this.structure=e}validThrows(t){const e=Date.now();try{validJSON(t,this.structure,this.typeName),this.emit("success",t)}catch(e){throw this.emit("fail",t,e),e}finally{"undefined"!=typeof window&&(window.log&&window.log.i?log.i("[validator]",this.typeName,"cost time",Date.now()-e):console.log("[validator]",this.typeName,"cost time",Date.now()-e))}}}exports.Validator=Validator;class _S{constructor(t,e){this.symbol=t,this.o=e}}const _optionalSymbol=Symbol(),_arrayOfSymbol=Symbol(),_multiTypeSymbol=Symbol();function $optional(t){return new _S(_optionalSymbol,t)}function $arrayOf(t){return new _S(_arrayOfSymbol,t)}function $multiType(...t){return new _S(_multiTypeSymbol,t)}function validJSON(t,e,r="#"){if("function"==typeof e)return e(t,r,validJSON);if(e instanceof _S){switch(e.symbol){case _arrayOfSymbol:return validJSON(t,(t,r,o)=>{if(!Array.isArray(t))throw new Error(`Type not equal, at ${r}, ${getType(t)} !== array`);t.every((t,a)=>(o(t,e.o,r+"["+a+"]"),!0))},r);case _optionalSymbol:return validJSON(t,(t,r,o)=>{o(t,$multiType(void 0,null,e.o),r)},r);case _multiTypeSymbol:return validJSON(t,(t,r,o)=>{const a=e.o.length;let i=0;for(let n=0;n<a;n++)try{return void o(t,e.o[n],r)}catch(t){if(i+=1,i>=a)throw new Error(t)}},r);default:throw new Error("Unknown validation schema")}}const o=getType(t),a=getType(e);if(o!==a)throw new Error(`Type not equal, at ${r}, ${o} !== ${a}`);if((Array.isArray(t)?1:-1)*(Array.isArray(e)?1:-1)<0)throw new Error(`Type array not equal, at ${r}, ${Array.isArray(t)} !== ${Array.isArray(e)}`);if(Array.isArray(t)){if(e.length>t.length)throw new Error(`Array length < expected size, at ${r},  ${t.length} < ${e.length}`);for(let o=0;o<e.length;o++)validJSON(t[o],e[o],r+"["+o+"]");return}if(null==t){if(t!==e)throw new Error(`Type not equal, at ${r}, ${t} !== ${e}`);return}if("object"!==o){if(o!==a)throw new Error(`Type not equal, at ${r}, ${o} !== ${a}`);return}const i=Object.keys(e);for(const o of i)validJSON(t[o],e[o],r+"."+o)}exports.$optional=$optional,exports.$arrayOf=$arrayOf,exports.$multiType=$multiType;
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017966, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0});const tslib_1=require("tslib");(0,tslib_1.__exportStar)(require("./common.validations"),exports),(0,tslib_1.__exportStar)(require("./tcb.validations"),exports),(0,tslib_1.__exportStar)(require("./flexdb.validations"),exports),(0,tslib_1.__exportStar)(require("./scf.validations"),exports),(0,tslib_1.__exportStar)(require("./cdn.validations"),exports),(0,tslib_1.__exportStar)(require("./ssl.validations"),exports);
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./common.validations":1679975017967,"./tcb.validations":1679975017968,"./flexdb.validations":1679975017969,"./scf.validations":1679975017970,"./cdn.validations":1679975017971,"./ssl.validations":1679975017972}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017967, function(require, module, exports) {
!function(require, directRequire){
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017968, function(require, module, exports) {
!function(require, directRequire){
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965,"./validations":1679975017966}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017969, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.flexdbModifyNameSpaceOutputValidation=exports.flexdbDescribeRestoreTimeOutputValidation=exports.flexdbRestoreTCBTablesOutputValidation=exports.flexdbDescribeRestoreTaskOutputValidation=exports.flexdbDescribeRestoreTablesOutputValidation=exports.flexdbModifyTableNamesOutputValidation=exports.flexdbRunCommandsOutputValidation=exports.flexdbUpdateTableOutputValidation=exports.flexdbDescribeTableOutputValidation=exports.flexdbCountOutputValidation=exports.flexdbDeleteItemOutputValidation=exports.flexdbUpdateItemOutputValidation=exports.flexdbPutItemOutputValidation=exports.flexdbQueryOutputValidation=exports.flexdbDeleteTableOutputValidation=exports.flexdbCreateTableOutputValidation=exports.flexdbListTablesOutputValidation=exports.flexdbIndexInfoValidation=exports.flexdbIndexAccessesValidation=exports.flexdbIndexkeyValidation=exports.flexdbTableInfoValidation=exports.flexdbPagerValidation=void 0;const tslib_1=require("tslib"),v=(0,tslib_1.__importStar)(require("../../utils/validator")),common=(0,tslib_1.__importStar)(require("./validations"));exports.flexdbPagerValidation=Object.assign({},common.commonOutputValidation,{Offset:1,Limit:1,Total:1}),exports.flexdbTableInfoValidation=Object.assign({},common.commonOutputValidation,{TableName:"",Count:1,Size:1,IndexCount:1,IndexSize:1}),exports.flexdbIndexkeyValidation=Object.assign({},common.commonOutputValidation,{Name:"",Direction:""}),exports.flexdbIndexAccessesValidation=Object.assign({},common.commonOutputValidation,{Ops:1,Since:""}),exports.flexdbIndexInfoValidation=Object.assign({},common.commonOutputValidation,{Name:"",Size:1,Keys:v.$arrayOf(exports.flexdbIndexkeyValidation),Accesses:exports.flexdbIndexAccessesValidation,Unique:v.$multiType(!0,null)}),exports.flexdbListTablesOutputValidation=Object.assign({},common.commonOutputValidation,{Tables:v.$multiType(v.$arrayOf(exports.flexdbTableInfoValidation),null),Pager:exports.flexdbPagerValidation}),exports.flexdbCreateTableOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.flexdbDeleteTableOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.flexdbQueryOutputValidation=Object.assign({},common.commonOutputValidation,{Data:v.$arrayOf(""),Pager:exports.flexdbPagerValidation}),exports.flexdbPutItemOutputValidation=Object.assign({},common.commonOutputValidation,{InsertedIds:v.$multiType(v.$arrayOf(""),v.$arrayOf(1))}),exports.flexdbUpdateItemOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.flexdbDeleteItemOutputValidation=Object.assign({},common.commonOutputValidation,{Deleted:1}),exports.flexdbCountOutputValidation=Object.assign({},common.commonOutputValidation,{Count:1}),exports.flexdbDescribeTableOutputValidation=Object.assign({},common.commonOutputValidation,{Indexes:v.$arrayOf(exports.flexdbIndexInfoValidation),IndexNum:1}),exports.flexdbUpdateTableOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.flexdbRunCommandsOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.flexdbModifyTableNamesOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.flexdbDescribeRestoreTablesOutputValidation=Object.assign({},common.commonOutputValidation,{Tables:v.$arrayOf("")}),exports.flexdbDescribeRestoreTaskOutputValidation=Object.assign({},common.commonOutputValidation,{Tasks:v.$arrayOf(common.restoreTaskValidation)}),exports.flexdbRestoreTCBTablesOutputValidation=Object.assign({},common.commonOutputValidation,{FlowId:1}),exports.flexdbDescribeRestoreTimeOutputValidation=Object.assign({},common.commonOutputValidation,{RestoreTimes:v.$arrayOf("")}),exports.flexdbModifyNameSpaceOutputValidation=Object.assign({},common.commonOutputValidation,{FlowId:1});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965,"./validations":1679975017966}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017970, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.scfPutProvisionedConcurrencyConfigOutputValidation=exports.scfGetProvisionedConcurrencyConfigOutputValidation=exports.scfListVersionByFunctionOutputValidation=exports.scfPublishVersionOutputValidation=exports.scfGetAliasOutputValidation=exports.scfUpdateAliasOutputValidation=exports.scfGetFunctionLogsOutputValidation=exports.scfInvokeFunctionOutputValidation=exports.scfGetFunctionAddressOutputValidation=exports.scfBatchCreateTriggerOutputValidation=exports.scfUpdateFunctionTestModelOutputValidation=exports.scfDeleteFunctionTestModelOutputValidation=exports.scfCreateFunctionTestModelOutputValidation=exports.scfGetFunctionTestModelOutputValidation=exports.scfListFunctionTestModelsOutputValidation=exports.scfGetFunctionInfoOutputValidation=exports.scfDeleteFunctionOutputValidation=exports.scfUpdateFunctionInfoOutputValidation=exports.scfUpdateFunctionIncrementalCodeOutputValidation=exports.scfUpdateFunctionOutputValidation=exports.scfCreateFunctionOutputValidation=exports.scfListFunctionsOutputValidation=exports.scfFunctionValidation=exports.scfFunctionTagValidation=void 0;const tslib_1=require("tslib"),v=(0,tslib_1.__importStar)(require("../../utils/validator")),common=(0,tslib_1.__importStar)(require("./validations"));exports.scfFunctionTagValidation=Object.assign({},{Key:"",Value:""}),exports.scfFunctionValidation=Object.assign({},{ModTime:"",AddTime:"",Runtime:"",FunctionName:"",FunctionId:"",Namespace:"",Status:"",StatusDesc:"",Description:"",Tags:v.$arrayOf(exports.scfFunctionTagValidation)}),exports.scfListFunctionsOutputValidation=Object.assign({},common.commonOutputValidation,{Functions:v.$arrayOf(exports.scfFunctionValidation),TotalCount:1}),exports.scfCreateFunctionOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfUpdateFunctionOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfUpdateFunctionIncrementalCodeOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfUpdateFunctionInfoOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfDeleteFunctionOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfGetFunctionInfoOutputValidation=Object.assign({},common.commonOutputValidation,{Environment:v.$optional({Variables:v.$arrayOf({Key:"",Value:""})}),FunctionName:"",Runtime:"",Handler:"",MemorySize:1,Timeout:1}),exports.scfListFunctionTestModelsOutputValidation=Object.assign({},common.commonOutputValidation,{TestModels:v.$optional(v.$arrayOf(""))}),exports.scfGetFunctionTestModelOutputValidation=Object.assign({},common.commonOutputValidation,{TestModelValue:""}),exports.scfCreateFunctionTestModelOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfDeleteFunctionTestModelOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfUpdateFunctionTestModelOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfBatchCreateTriggerOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfGetFunctionAddressOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfInvokeFunctionOutputValidation=Object.assign({},common.commonOutputValidation,{Result:{FunctionRequestId:""}}),exports.scfGetFunctionLogsOutputValidation=Object.assign({},common.commonOutputValidation,{Data:v.$optional(v.$arrayOf({FunctionName:"",RetMsg:"",RequestId:"",StartTime:"",RetCode:1,InvokeFinished:1,Duration:1,BillDuration:1,MemUsage:1,Log:""}))}),exports.scfUpdateAliasOutputValidation=Object.assign({},common.commonOutputValidation,{}),exports.scfGetAliasOutputValidation=Object.assign({},common.commonOutputValidation,{FunctionVersion:"",Name:"",RoutingConfig:common.routingConfigValidation,Description:v.$optional(""),AddTime:v.$optional(""),ModTime:v.$optional("")}),exports.scfPublishVersionOutputValidation=Object.assign({},common.commonOutputValidation,{FunctionVersion:"",CodeSize:1,MemorySize:1,Description:"",Handler:"",Timeout:1,Runtime:"",Namespace:""}),exports.scfListVersionByFunctionOutputValidation=Object.assign({},common.commonOutputValidation,{FunctionVersion:v.$arrayOf(""),Versions:v.$optional(v.$arrayOf(common.functionVersionValidation))}),exports.scfGetProvisionedConcurrencyConfigOutputValidation=Object.assign({},common.commonOutputValidation,{UnallocatedConcurrencyNum:1,Allocated:v.$arrayOf(common.versionProvisionedConcurrencyInfoValidation)}),exports.scfPutProvisionedConcurrencyConfigOutputValidation=Object.assign({},common.commonOutputValidation,{});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965,"./validations":1679975017966}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017971, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.cdnTcbCheckResourceOutputValidation=exports.cdnTcbModifyAttributeOutputValidation=void 0;const tslib_1=require("tslib"),v=(0,tslib_1.__importStar)(require("../../utils/validator")),common=(0,tslib_1.__importStar)(require("./validations"));exports.cdnTcbModifyAttributeOutputValidation=Object.assign({},common.commonOutputValidation,{DomainId:1,Origin:common.tcbOriginValidation,CosPrivateAccess:"",Authentication:common.tcbAuthenticationValidation,Cache:v.$arrayOf(common.tcbCacheValidation),StaticWeb:v.$optional(common.tcbStaticValidation),RootAccess:v.$optional("")}),exports.cdnTcbCheckResourceOutputValidation=Object.assign({},common.commonOutputValidation,{Domains:v.$arrayOf(common.tcbDomainInfoValidation),RecordCount:1});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965,"./validations":1679975017966}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017972, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.sslDescribeCertificatesOutputValidation=void 0;const tslib_1=require("tslib"),v=(0,tslib_1.__importStar)(require("../../utils/validator")),common=(0,tslib_1.__importStar)(require("./validations"));exports.sslDescribeCertificatesOutputValidation=Object.assign({},common.commonOutputValidation,{TotalCount:v.$optional(1),Certificates:v.$optional(v.$arrayOf(common.certificatesValidation))});
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"../../utils/validator":1679975017965,"./validations":1679975017966}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017973, function(require, module, exports) {
!function(require, directRequire){
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./factory":1679975017964,"../validations/validations":1679975017966,"../transactor":1679975017961}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017974, function(require, module, exports) {
!function(require, directRequire){
}(require("licia/lazyImport")(require), require)
}, function(modId) { var map = {"./factory":1679975017964,"../validations/validations":1679975017966,"../transactor":1679975017961}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017975, function(require, module, exports) {
!function(require, directRequire){
Object.defineProperty(exports,"__esModule",{value:!0}),exports.cdnTcbCheckResourceContract=exports.cdnTcbModifyAttributeContract=void 0;const tslib_1=require("tslib"),factory_1=(0,tslib_1.__importDefault)(require("./factory")),validations=(0,tslib_1.__importStar)(require("../validations/validations")),transactor_1=require("../transactor");function sharedInputTransformation(t,r){return(t&&r===transactor_1.TransactType.HTTP||r===transactor_1.TransactType.IDEPlugin||r===transactor_1.TransactType.IDE)&&(delete t.Action,delete t.Version,delete t.Region),JSON.stringify(t)}function sharedOutputTransformationThrows(t,r){if(!(t=JSON.parse(t))||!t.Response)throw new Error("content empty, "+JSON.stringify(t));const e=t.Response;if(e.Error&&e.Error.Code){const t=new Error(e.Error.Code+", "+e.Error.Message+" ("+(e.RequestId||"?")+")");throw t.code=e.Error.Code,t}return delete e.Error,e}exports.cdnTcbModifyAttributeContract=new factory_1.default("ITCCDNTcbModifyAttributeInput","ITCCDNTcbModifyAttributeOutput",validations.cdnTcbModifyAttributeOutputValidation,()=>({cgi_id:-1,service:"cdn",action:"TcbModifyAttribute",version:"2018-06-06",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows}),exports.cdnTcbCheckResourceContract=new factory_1.default("ITCCDNTcbCheckResourceInput","ITCCDNTcbCheckResourceOutput",validations.cdnTcbCheckResourceOutputValidation,()=>({cgi_id:-1,service:"cdn",action:"TcbCheckResource",version:"2018-06-06",region:""}),{inputTransformation:sharedInputTransformation,outputTransformationThrows:sharedOutputTransformationThrows});
}(require("licia/lazyImport")(require), require)
__DEFINE__(1679975017976, function(require, module, exports) {