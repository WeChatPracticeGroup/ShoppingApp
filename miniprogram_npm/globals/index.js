module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1679975017002, function(require, module, exports) {

module.exports = require('./globals.json');

}, function(modId) {var map = {"./globals.json":1679975017003}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1679975017003, function(require, module, exports) {
module.exports = {
	"builtin": {
		"Array": false,
		"ArrayBuffer": false,
		"Atomics": false,
		"BigInt": false,
		"BigInt64Array": false,
		"BigUint64Array": false,
		"Boolean": false,
		"constructor": false,
		"DataView": false,
		"Date": false,
		"decodeURI": false,
		"decodeURIComponent": false,
		"encodeURI": false,
		"encodeURIComponent": false,
		"Error": false,
		"escape": false,
		"eval": false,
		"EvalError": false,
		"Float32Array": false,
		"Float64Array": false,
		"Function": false,
		"globalThis": false,
		"hasOwnProperty": false,
		"Infinity": false,
		"Int16Array": false,
		"Int32Array": false,
		"Int8Array": false,
		"isFinite": false,
		"isNaN": false,
		"isPrototypeOf": false,
		"JSON": false,
		"Map": false,
		"Math": false,
		"NaN": false,
		"Number": false,
		"Object": false,
		"parseFloat": false,
		"parseInt": false,
		"Promise": false,
		"propertyIsEnumerable": false,
		"Proxy": false,
		"RangeError": false,
		"ReferenceError": false,
		"Reflect": false,
		"RegExp": false,
		"Set": false,
		"SharedArrayBuffer": false,
		"String": false,
		"Symbol": false,
		"SyntaxError": false,
		"toLocaleString": false,
		"toString": false,
		"TypeError": false,
		"Uint16Array": false,
		"Uint32Array": false,
		"Uint8Array": false,
		"Uint8ClampedArray": false,
		"undefined": false,
		"unescape": false,
		"URIError": false,
		"valueOf": false,
		"WeakMap": false,
		"WeakSet": false
	},
	"es5": {
		"Array": false,
		"Boolean": false,
		"constructor": false,
		"Date": false,
		"decodeURI": false,
		"decodeURIComponent": false,
		"encodeURI": false,
		"encodeURIComponent": false,
		"Error": false,
		"escape": false,
		"eval": false,
		"EvalError": false,
		"Function": false,
		"hasOwnProperty": false,
		"Infinity": false,
		"isFinite": false,
		"isNaN": false,
		"isPrototypeOf": false,
		"JSON": false,
		"Math": false,
		"NaN": false,
		"Number": false,
		"Object": false,
		"parseFloat": false,
		"parseInt": false,
		"propertyIsEnumerable": false,
		"RangeError": false,
		"ReferenceError": false,
		"RegExp": false,
		"String": false,
		"SyntaxError": false,
		"toLocaleString": false,
		"toString": false,
		"TypeError": false,
		"undefined": false,
		"unescape": false,
		"URIError": false,
		"valueOf": false
	},
	"es2015": {
		"Array": false,
		"ArrayBuffer": false,
		"Boolean": false,
		"constructor": false,
		"DataView": false,
		"Date": false,
		"decodeURI": false,
		"decodeURIComponent": false,
		"encodeURI": false,
		"encodeURIComponent": false,
		"Error": false,
		"escape": false,
		"eval": false,
		"EvalError": false,
		"Float32Array": false,
		"Float64Array": false,
		"Function": false,
		"hasOwnProperty": false,
		"Infinity": false,
		"Int16Array": false,
		"Int32Array": false,
		"Int8Array": false,
		"isFinite": false,
		"isNaN": false,
		"isPrototypeOf": false,
		"JSON": false,
		"Map": false,
		"Math": false,
		"NaN": false,
		"Number": false,
		"Object": false,
		"parseFloat": false,
		"parseInt": false,
		"Promise": false,
		"propertyIsEnumerable": false,
		"Proxy": false,
		"RangeError": false,
		"ReferenceError": false,
		"Reflect": false,
		"RegExp": false,
		"Set": false,
		"String": false,
		"Symbol": false,
		"SyntaxError": false,
		"toLocaleString": false,
		"toString": false,
		"TypeError": false,
		"Uint16Array": false,
		"Uint32Array": false,
		"Uint8Array": false,
		"Uint8ClampedArray": false,
		"undefined": false,
		"unescape": false,
		"URIError": false,
		"valueOf": false,
		"WeakMap": false,
		"WeakSet": false
	},
	"es2017": {
		"Array": false,
		"ArrayBuffer": false,
		"Atomics": false,
		"Boolean": false,
		"constructor": false,
		"DataView": false,
		"Date": false,
		"decodeURI": false,
		"decodeURIComponent": false,
		"encodeURI": false,
		"encodeURIComponent": false,
		"Error": false,
		"escape": false,
		"eval": false,
		"EvalError": false,
		"Float32Array": false,
		"Float64Array": false,
		"Function": false,
		"hasOwnProperty": false,
		"Infinity": false,
		"Int16Array": false,
		"Int32Array": false,
		"Int8Array": false,
		"isFinite": false,
		"isNaN": false,
		"isPrototypeOf": false,
		"JSON": false,
		"Map": false,
		"Math": false,
		"NaN": false,
		"Number": false,
		"Object": false,
		"parseFloat": false,
		"parseInt": false,
		"Promise": false,
		"propertyIsEnumerable": false,
		"Proxy": false,
		"RangeError": false,
		"ReferenceError": false,
		"Reflect": false,
		"RegExp": false,
		"Set": false,
		"SharedArrayBuffer": false,
		"String": false,
		"Symbol": false,
		"SyntaxError": false,
		"toLocaleString": false,
		"toString": false,
		"TypeError": false,
		"Uint16Array": false,
		"Uint32Array": false,
		"Uint8Array": false,
		"Uint8ClampedArray": false,
		"undefined": false,
		"unescape": false,
		"URIError": false,
		"valueOf": false,
		"WeakMap": false,
		"WeakSet": false
	},
	"browser": {
		"AbortController": false,
		"AbortSignal": false,
		"addEventListener": false,
		"alert": false,
		"AnalyserNode": false,
		"Animation": false,
		"AnimationEffectReadOnly": false,
		"AnimationEffectTiming": false,
		"AnimationEffectTimingReadOnly": false,
		"AnimationEvent": false,
		"AnimationPlaybackEvent": false,
		"AnimationTimeline": false,
		"applicationCache": false,
		"ApplicationCache": false,
		"ApplicationCacheErrorEvent": false,
		"atob": false,
		"Attr": false,
		"Audio": false,
		"AudioBuffer": false,
		"AudioBufferSourceNode": false,
		"AudioContext": false,
		"AudioDestinationNode": false,
		"AudioListener": false,
		"AudioNode": false,
		"AudioParam": false,
		"AudioProcessingEvent": false,
		"AudioScheduledSourceNode": false,
		"AudioWorkletGlobalScope ": false,
		"AudioWorkletNode": false,
		"AudioWorkletProcessor": false,
		"BarProp": false,
		"BaseAudioContext": false,
		"BatteryManager": false,
		"BeforeUnloadEvent": false,
		"BiquadFilterNode": false,
		"Blob": false,
		"BlobEvent": false,
		"blur": false,
		"BroadcastChannel": false,
		"btoa": false,
		"BudgetService": false,
		"ByteLengthQueuingStrategy": false,
		"Cache": false,
		"caches": false,
		"CacheStorage": false,
		"cancelAnimationFrame": false,
		"cancelIdleCallback": false,
		"CanvasCaptureMediaStreamTrack": false,
		"CanvasGradient": false,
		"CanvasPattern": false,
		"CanvasRenderingContext2D": false,
		"ChannelMergerNode": false,
		"ChannelSplitterNode": false,
		"CharacterData": false,
		"clearInterval": false,
		"clearTimeout": false,
		"clientInformation": false,
		"ClipboardEvent": false,
		"close": false,
		"closed": false,
		"CloseEvent": false,
		"Comment": false,
		"CompositionEvent": false,
		"confirm": false,
		"console": false,
		"ConstantSourceNode": false,
		"ConvolverNode": false,
		"CountQueuingStrategy": false,
		"createImageBitmap": false,
		"Credential": false,
		"CredentialsContainer": false,
		"crypto": false,
		"Crypto": false,
		"CryptoKey": false,
		"CSS": false,
		"CSSConditionRule": false,
		"CSSFontFaceRule": false,
		"CSSGroupingRule": false,
		"CSSImportRule": false,
		"CSSKeyframeRule": false,
		"CSSKeyframesRule": false,
		"CSSMediaRule": false,
		"CSSNamespaceRule": false,
		"CSSPageRule": false,
		"CSSRule": false,
		"CSSRuleList": false,
		"CSSStyleDeclaration": false,
		"CSSStyleRule": false,
		"CSSStyleSheet": false,
		"CSSSupportsRule": false,
		"CustomElementRegistry": false,
		"customElements": false,
		"CustomEvent": false,
		"DataTransfer": false,
		"DataTransferItem": false,
		"DataTransferItemList": false,
		"defaultstatus": false,
		"defaultStatus": false,
		"DelayNode": false,
		"DeviceMotionEvent": false,
		"DeviceOrientationEvent": false,
		"devicePixelRatio": false,
		"dispatchEvent": false,
		"document": false,
		"Document": false,
		"DocumentFragment": false,
		"DocumentType": false,
		"DOMError": false,
		"DOMException": false,
		"DOMImplementation": false,
		"DOMMatrix": false,
		"DOMMatrixReadOnly": false,
		"DOMParser": false,
		"DOMPoint": false,
		"DOMPointReadOnly": false,
		"DOMQuad": false,
		"DOMRect": false,
		"DOMRectReadOnly": false,
		"DOMStringList": false,
		"DOMStringMap": false,
		"DOMTokenList": false,
		"DragEvent": false,
		"DynamicsCompressorNode": false,
		"Element": false,
		"ErrorEvent": false,
		"event": false,
		"Event": false,
		"EventSource": false,
		"EventTarget": false,
		"external": false,
		"fetch": false,
		"File": false,
		"FileList": false,
		"FileReader": false,
		"find": false,
		"focus": false,
		"FocusEvent": false,
		"FontFace": false,
		"FontFaceSetLoadEvent": false,
		"FormData": false,
		"frameElement": false,
		"frames": false,
		"GainNode": false,
		"Gamepad": false,
		"GamepadButton": false,
		"GamepadEvent": false,
		"getComputedStyle": false,
		"getSelection": false,
		"HashChangeEvent": false,
		"Headers": false,
		"history": false,
		"History": false,
		"HTMLAllCollection": false,
		"HTMLAnchorElement": false,
		"HTMLAreaElement": false,
		"HTMLAudioElement": false,
		"HTMLBaseElement": false,
		"HTMLBodyElement": false,
		"HTMLBRElement": false,
		"HTMLButtonElement": false,
		"HTMLCanvasElement": false,
		"HTMLCollection": false,
		"HTMLContentElement": false,
		"HTMLDataElement": false,
		"HTMLDataListElement": false,
		"HTMLDetailsElement": false,
		"HTMLDialogElement": false,
		"HTMLDirectoryElement": false,
		"HTMLDivElement": false,
		"HTMLDListElement": false,
		"HTMLDocument": false,
		"HTMLElement": false,
		"HTMLEmbedElement": false,
		"HTMLFieldSetElement": false,
		"HTMLFontElement": false,
		"HTMLFormControlsCollection": false,
		"HTMLFormElement": false,
		"HTMLFrameElement": false,
		"HTMLFrameSetElement": false,
		"HTMLHeadElement": false,
		"HTMLHeadingElement": false,
		"HTMLHRElement": false,
		"HTMLHtmlElement": false,
		"HTMLIFrameElement": false,
		"HTMLImageElement": false,
		"HTMLInputElement": false,
		"HTMLLabelElement": false,
		"HTMLLegendElement": false,
		"HTMLLIElement": false,
		"HTMLLinkElement": false,
		"HTMLMapElement": false,
		"HTMLMarqueeElement": false,
		"HTMLMediaElement": false,
		"HTMLMenuElement": false,
		"HTMLMetaElement": false,
		"HTMLMeterElement": false,
		"HTMLModElement": false,
		"HTMLObjectElement": false,
		"HTMLOListElement": false,
		"HTMLOptGroupElement": false,
		"HTMLOptionElement": false,
		"HTMLOptionsCollection": false,
		"HTMLOutputElement": false,
		"HTMLParagraphElement": false,
		"HTMLParamElement": false,
		"HTMLPictureElement": false,
		"HTMLPreElement": false,
		"HTMLProgressElement": false,
		"HTMLQuoteElement": false,
		"HTMLScriptElement": false,
		"HTMLSelectElement": false,
		"HTMLShadowElement": false,
		"HTMLSlotElement": false,
		"HTMLSourceElement": false,
		"HTMLSpanElement": false,
		"HTMLStyleElement": false,
		"HTMLTableCaptionElement": false,
		"HTMLTableCellElement": false,
		"HTMLTableColElement": false,
		"HTMLTableElement": false,
		"HTMLTableRowElement": false,
		"HTMLTableSectionElement": false,
		"HTMLTemplateElement": false,
		"HTMLTextAreaElement": false,
		"HTMLTimeElement": false,
		"HTMLTitleElement": false,
		"HTMLTrackElement": false,
		"HTMLUListElement": false,
		"HTMLUnknownElement": false,
		"HTMLVideoElement": false,
		"IDBCursor": false,
		"IDBCursorWithValue": false,
		"IDBDatabase": false,
		"IDBFactory": false,
		"IDBIndex": false,
		"IDBKeyRange": false,
		"IDBObjectStore": false,
		"IDBOpenDBRequest": false,
		"IDBRequest": false,
		"IDBTransaction": false,
		"IDBVersionChangeEvent": false,
		"IdleDeadline": false,
		"IIRFilterNode": false,
		"Image": false,
		"ImageBitmap": false,
		"ImageBitmapRenderingContext": false,
		"ImageCapture": false,
		"ImageData": false,
		"indexedDB": false,
		"innerHeight": false,
		"innerWidth": false,
		"InputEvent": false,
		"IntersectionObserver": false,
		"IntersectionObserverEntry": false,
		"Intl": false,
		"isSecureContext": false,
		"KeyboardEvent": false,
		"KeyframeEffect": false,
		"KeyframeEffectReadOnly": false,
		"length": false,
		"localStorage": false,
		"location": true,
		"Location": false,
		"locationbar": false,
		"matchMedia": false,
		"MediaDeviceInfo": false,
		"MediaDevices": false,
		"MediaElementAudioSourceNode": false,
		"MediaEncryptedEvent": false,
		"MediaError": false,
		"MediaKeyMessageEvent": false,
		"MediaKeySession": false,
		"MediaKeyStatusMap": false,
		"MediaKeySystemAccess": false,
		"MediaList": false,
		"MediaQueryList": false,
		"MediaQueryListEvent": false,
		"MediaRecorder": false,
		"MediaSettingsRange": false,
		"MediaSource": false,
		"MediaStream": false,
		"MediaStreamAudioDestinationNode": false,
		"MediaStreamAudioSourceNode": false,
		"MediaStreamEvent": false,
		"MediaStreamTrack": false,
		"MediaStreamTrackEvent": false,
		"menubar": false,
		"MessageChannel": false,
		"MessageEvent": false,
		"MessagePort": false,
		"MIDIAccess": false,
		"MIDIConnectionEvent": false,
		"MIDIInput": false,
		"MIDIInputMap": false,
		"MIDIMessageEvent": false,
		"MIDIOutput": false,
		"MIDIOutputMap": false,
		"MIDIPort": false,
		"MimeType": false,
		"MimeTypeArray": false,
		"MouseEvent": false,
		"moveBy": false,
		"moveTo": false,
		"MutationEvent": false,
		"MutationObserver": false,
		"MutationRecord": false,
		"name": false,
		"NamedNodeMap": false,
		"NavigationPreloadManager": false,
		"navigator": false,
		"Navigator": false,
		"NetworkInformation": false,
		"Node": false,
		"NodeFilter": false,
		"NodeIterator": false,
		"NodeList": false,
		"Notification": false,
		"OfflineAudioCompletionEvent": false,
		"OfflineAudioContext": false,
		"offscreenBuffering": false,
		"OffscreenCanvas": true,
		"onabort": true,
		"onafterprint": true,
		"onanimationend": true,
		"onanimationiteration": true,
		"onanimationstart": true,
		"onappinstalled": true,
		"onauxclick": true,
		"onbeforeinstallprompt": true,
		"onbeforeprint": true,
		"onbeforeunload": true,
		"onblur": true,
		"oncancel": true,
		"oncanplay": true,
		"oncanplaythrough": true,
		"onchange": true,
		"onclick": true,
		"onclose": true,
		"oncontextmenu": true,
		"oncuechange": true,
		"ondblclick": true,
		"ondevicemotion": true,
		"ondeviceorientation": true,
		"ondeviceorientationabsolute": true,
		"ondrag": true,
		"ondragend": true,
		"ondragenter": true,
		"ondragleave": true,
		"ondragover": true,
		"ondragstart": true,
		"ondrop": true,
		"ondurationchange": true,
		"onemptied": true,
		"onended": true,
		"onerror": true,
		"onfocus": true,
		"ongotpointercapture": true,
		"onhashchange": true,
		"oninput": true,
		"oninvalid": true,
		"onkeydown": true,
		"onkeypress": true,
		"onkeyup": true,
		"onlanguagechange": true,
		"onload": true,
		"onloadeddata": true,
		"onloadedmetadata": true,
		"onloadstart": true,
		"onlostpointercapture": true,
		"onmessage": true,
		"onmessageerror": true,
		"onmousedown": true,
		"onmouseenter": true,
		"onmouseleave": true,
		"onmousemove": true,
		"onmouseout": true,
		"onmouseover": true,
		"onmouseup": true,
		"onmousewheel": true,
		"onoffline": true,
		"ononline": true,
		"onpagehide": true,
		"onpageshow": true,
		"onpause": true,
		"onplay": true,
		"onplaying": true,
		"onpointercancel": true,
		"onpointerdown": true,
		"onpointerenter": true,
		"onpointerleave": true,
		"onpointermove": true,
		"onpointerout": true,
		"onpointerover": true,
		"onpointerup": true,
		"onpopstate": true,
		"onprogress": true,
		"onratechange": true,
		"onrejectionhandled": true,
		"onreset": true,
		"onresize": true,
		"onscroll": true,
		"onsearch": true,
		"onseeked": true,
		"onseeking": true,
		"onselect": true,
		"onstalled": true,
		"onstorage": true,
		"onsubmit": true,
		"onsuspend": true,
		"ontimeupdate": true,
		"ontoggle": true,
		"ontransitionend": true,
		"onunhandledrejection": true,
		"onunload": true,
		"onvolumechange": true,
		"onwaiting": true,
		"onwheel": true,
		"open": false,
		"openDatabase": false,
		"opener": false,
		"Option": false,
		"origin": false,
		"OscillatorNode": false,
		"outerHeight": false,
		"outerWidth": false,
		"PageTransitionEvent": false,
		"pageXOffset": false,
		"pageYOffset": false,
		"PannerNode": false,
		"parent": false,
		"Path2D": false,
		"PaymentAddress": false,
		"PaymentRequest": false,
		"PaymentRequestUpdateEvent": false,
		"PaymentResponse": false,
		"performance": false,
		"Performance": false,
		"PerformanceEntry": false,
		"PerformanceLongTaskTiming": false,
		"PerformanceMark": false,
		"PerformanceMeasure": false,
		"PerformanceNavigation": false,
		"PerformanceNavigationTiming": false,
		"PerformanceObserver": false,
		"PerformanceObserverEntryList": false,
		"PerformancePaintTiming": false,
		"PerformanceResourceTiming": false,
		"PerformanceTiming": false,
		"PeriodicWave": false,
		"Permissions": false,
		"PermissionStatus": false,
		"personalbar": false,
		"PhotoCapabilities": false,
		"Plugin": false,
		"PluginArray": false,
		"PointerEvent": false,
		"PopStateEvent": false,
		"postMessage": false,
		"Presentation": false,
		"PresentationAvailability": false,
		"PresentationConnection": false,
		"PresentationConnectionAvailableEvent": false,
		"PresentationConnectionCloseEvent": false,
		"PresentationConnectionList": false,
		"PresentationReceiver": false,
		"PresentationRequest": false,
		"print": false,
		"ProcessingInstruction": false,
		"ProgressEvent": false,
		"PromiseRejectionEvent": false,
		"prompt": false,
		"PushManager": false,
		"PushSubscription": false,
		"PushSubscriptionOptions": false,
		"queueMicrotask": false,
		"RadioNodeList": false,
		"Range": false,
		"ReadableStream": false,
		"registerProcessor": false,
		"RemotePlayback": false,
		"removeEventListener": false,
		"Request": false,
		"requestAnimationFrame": false,
		"requestIdleCallback": false,
		"resizeBy": false,
		"ResizeObserver": false,
		"ResizeObserverEntry": false,
		"resizeTo": false,
		"Response": false,
		"RTCCertificate": false,
		"RTCDataChannel": false,
		"RTCDataChannelEvent": false,
		"RTCDtlsTransport": false,
		"RTCIceCandidate": false,
		"RTCIceGatherer": false,
		"RTCIceTransport": false,
		"RTCPeerConnection": false,
		"RTCPeerConnectionIceEvent": false,
		"RTCRtpContributingSource": false,
		"RTCRtpReceiver": false,
		"RTCRtpSender": false,
		"RTCSctpTransport": false,
		"RTCSessionDescription": false,
		"RTCStatsReport": false,
		"RTCTrackEvent": false,
		"screen": false,
		"Screen": false,
		"screenLeft": false,
		"ScreenOrientation": false,
		"screenTop": false,
		"screenX": false,
		"screenY": false,
		"ScriptProcessorNode": false,
		"scroll": false,
		"scrollbars": false,
		"scrollBy": false,
		"scrollTo": false,
		"scrollX": false,
		"scrollY": false,
		"SecurityPolicyViolationEvent": false,
		"Selection": false,
		"self": false,
		"ServiceWorker": false,
		"ServiceWorkerContainer": false,
		"ServiceWorkerRegistration": false,
		"sessionStorage": false,
		"setInterval": false,
		"setTimeout": false,
		"ShadowRoot": false,
		"SharedWorker": false,
		"SourceBuffer": false,
		"SourceBufferList": false,
		"speechSynthesis": false,
		"SpeechSynthesisEvent": false,
		"SpeechSynthesisUtterance": false,
		"StaticRange": false,
		"status": false,
		"statusbar": false,
		"StereoPannerNode": false,
		"stop": false,
		"Storage": false,
		"StorageEvent": false,
		"StorageManager": false,
		"styleMedia": false,
		"StyleSheet": false,
		"StyleSheetList": false,
		"SubtleCrypto": false,
		"SVGAElement": false,
		"SVGAngle": false,
		"SVGAnimatedAngle": false,
		"SVGAnimatedBoolean": false,
		"SVGAnimatedEnumeration": false,
		"SVGAnimatedInteger": false,
		"SVGAnimatedLength": false,
		"SVGAnimatedLengthList": false,
		"SVGAnimatedNumber": false,
		"SVGAnimatedNumberList": false,
		"SVGAnimatedPreserveAspectRatio": false,
		"SVGAnimatedRect": false,
		"SVGAnimatedString": false,
		"SVGAnimatedTransformList": false,
		"SVGAnimateElement": false,
		"SVGAnimateMotionElement": false,
		"SVGAnimateTransformElement": false,
		"SVGAnimationElement": false,
		"SVGCircleElement": false,
		"SVGClipPathElement": false,
		"SVGComponentTransferFunctionElement": false,
		"SVGDefsElement": false,
		"SVGDescElement": false,
		"SVGDiscardElement": false,
		"SVGElement": false,
		"SVGEllipseElement": false,
		"SVGFEBlendElement": false,
		"SVGFEColorMatrixElement": false,
		"SVGFEComponentTransferElement": false,
		"SVGFECompositeElement": false,
		"SVGFEConvolveMatrixElement": false,
		"SVGFEDiffuseLightingElement": false,
		"SVGFEDisplacementMapElement": false,
		"SVGFEDistantLightElement": false,
		"SVGFEDropShadowElement": false,
		"SVGFEFloodElement": false,
		"SVGFEFuncAElement": false,
		"SVGFEFuncBElement": false,
		"SVGFEFuncGElement": false,
		"SVGFEFuncRElement": false,
		"SVGFEGaussianBlurElement": false,
		"SVGFEImageElement": false,
		"SVGFEMergeElement": false,
		"SVGFEMergeNodeElement": false,
		"SVGFEMorphologyElement": false,
		"SVGFEOffsetElement": false,
		"SVGFEPointLightElement": false,
		"SVGFESpecularLightingElement": false,
		"SVGFESpotLightElement": false,
		"SVGFETileElement": false,
		"SVGFETurbulenceElement": false,
		"SVGFilterElement": false,
		"SVGForeignObjectElement": false,
		"SVGGElement": false,
		"SVGGeometryElement": false,
		"SVGGradientElement": false,
		"SVGGraphicsElement": false,
		"SVGImageElement": false,
		"SVGLength": false,
		"SVGLengthList": false,
		"SVGLinearGradientElement": false,
		"SVGLineElement": false,
		"SVGMarkerElement": false,
		"SVGMaskElement": false,
		"SVGMatrix": false,
		"SVGMetadataElement": false,
		"SVGMPathElement": false,
		"SVGNumber": false,
		"SVGNumberList": false,
		"SVGPathElement": false,
		"SVGPatternElement": false,
		"SVGPoint": false,
		"SVGPointList": false,
		"SVGPolygonElement": false,
		"SVGPolylineElement": false,
		"SVGPreserveAspectRatio": false,
		"SVGRadialGradientElement": false,
		"SVGRect": false,
		"SVGRectElement": false,
		"SVGScriptElement": false,
		"SVGSetElement": false,
		"SVGStopElement": false,
		"SVGStringList": false,
		"SVGStyleElement": false,
		"SVGSVGElement": false,
		"SVGSwitchElement": false,
		"SVGSymbolElement": false,
		"SVGTextContentElement": false,
		"SVGTextElement": false,
		"SVGTextPathElement": false,
		"SVGTextPositioningElement": false,
		"SVGTitleElement": false,
		"SVGTransform": false,
		"SVGTransformList": false,
		"SVGTSpanElement": false,
		"SVGUnitTypes": false,
		"SVGUseElement": false,
		"SVGViewElement": false,
		"TaskAttributionTiming": false,
		"Text": false,
		"TextDecoder": false,
		"TextEncoder": false,
		"TextEvent": false,
		"TextMetrics": false,
		"TextTrack": false,
		"TextTrackCue": false,
		"TextTrackCueList": false,
		"TextTrackList": false,
		"TimeRanges": false,
		"toolbar": false,
		"top": false,
		"Touch": false,
		"TouchEvent": false,
		"TouchList": false,
		"TrackEvent": false,
		"TransitionEvent": false,
		"TreeWalker": false,
		"UIEvent": false,
		"URL": false,
		"URLSearchParams": false,
		"ValidityState": false,
		"visualViewport": false,
		"VisualViewport": false,
		"VTTCue": false,
		"WaveShaperNode": false,
		"WebAssembly": false,
		"WebGL2RenderingContext": false,
		"WebGLActiveInfo": false,
		"WebGLBuffer": false,
		"WebGLContextEvent": false,
		"WebGLFramebuffer": false,
		"WebGLProgram": false,
		"WebGLQuery": false,
		"WebGLRenderbuffer": false,
		"WebGLRenderingContext": false,
		"WebGLSampler": false,
		"WebGLShader": false,
		"WebGLShaderPrecisionFormat": false,
		"WebGLSync": false,
		"WebGLTexture": false,
		"WebGLTransformFeedback": false,
		"WebGLUniformLocation": false,
		"WebGLVertexArrayObject": false,
		"WebSocket": false,
		"WheelEvent": false,
		"window": false,
		"Window": false,
		"Worker": false,
		"WritableStream": false,
		"XMLDocument": false,
		"XMLHttpRequest": false,
		"XMLHttpRequestEventTarget": false,
		"XMLHttpRequestUpload": false,
		"XMLSerializer": false,
		"XPathEvaluator": false,
		"XPathExpression": false,
		"XPathResult": false,
		"XSLTProcessor": false
	},
	"worker": {
		"addEventListener": false,
		"applicationCache": false,
		"atob": false,
		"Blob": false,
		"BroadcastChannel": false,
		"btoa": false,
		"Cache": false,
		"caches": false,
		"clearInterval": false,
		"clearTimeout": false,
		"close": true,
		"console": false,
		"fetch": false,
		"FileReaderSync": false,
		"FormData": false,
		"Headers": false,
		"IDBCursor": false,
		"IDBCursorWithValue": false,
		"IDBDatabase": false,
		"IDBFactory": false,
		"IDBIndex": false,
		"IDBKeyRange": false,
		"IDBObjectStore": false,
		"IDBOpenDBRequest": false,
		"IDBRequest": false,
		"IDBTransaction": false,
		"IDBVersionChangeEvent": false,
		"ImageData": false,
		"importScripts": true,
		"indexedDB": false,
		"location": false,
		"MessageChannel": false,
		"MessagePort": false,
		"name": false,
		"navigator": false,
		"Notification": false,
		"onclose": true,
		"onconnect": true,
		"onerror": true,
		"onlanguagechange": true,
		"onmessage": true,
		"onoffline": true,
		"ononline": true,
		"onrejectionhandled": true,
		"onunhandledrejection": true,
		"performance": false,
		"Performance": false,
		"PerformanceEntry": false,
		"PerformanceMark": false,
		"PerformanceMeasure": false,
		"PerformanceNavigation": false,
		"PerformanceResourceTiming": false,
		"PerformanceTiming": false,
		"postMessage": true,
		"Promise": false,
		"queueMicrotask": false,
		"removeEventListener": false,
		"Request": false,
		"Response": false,
		"self": true,
		"ServiceWorkerRegistration": false,
		"setInterval": false,
		"setTimeout": false,
		"TextDecoder": false,
		"TextEncoder": false,
		"URL": false,
		"URLSearchParams": false,
		"WebSocket": false,
		"Worker": false,
		"WorkerGlobalScope": false,
		"XMLHttpRequest": false
	},
	"node": {
		"__dirname": false,
		"__filename": false,
		"Buffer": false,
		"clearImmediate": false,
		"clearInterval": false,
		"clearTimeout": false,
		"console": false,
		"exports": true,
		"global": false,
		"Intl": false,
		"module": false,
		"process": false,
		"queueMicrotask": false,
		"require": false,
		"setImmediate": false,
		"setInterval": false,
		"setTimeout": false,
		"TextDecoder": false,
		"TextEncoder": false,
		"URL": false,
		"URLSearchParams": false
	},
	"commonjs": {
		"exports": true,
		"global": false,
		"module": false,
		"require": false
	},
	"amd": {
		"define": false,
		"require": false
	},
	"mocha": {
		"after": false,
		"afterEach": false,
		"before": false,
		"beforeEach": false,
		"context": false,
		"describe": false,
		"it": false,
		"mocha": false,
		"run": false,
		"setup": false,
		"specify": false,
		"suite": false,
		"suiteSetup": false,
		"suiteTeardown": false,
		"teardown": false,
		"test": false,
		"xcontext": false,
		"xdescribe": false,
		"xit": false,
		"xspecify": false
	},
	"jasmine": {
		"afterAll": false,
		"afterEach": false,
		"beforeAll": false,
		"beforeEach": false,
		"describe": false,
		"expect": false,
		"fail": false,
		"fdescribe": false,
		"fit": false,
		"it": false,
		"jasmine": false,
		"pending": false,
		"runs": false,
		"spyOn": false,
		"spyOnProperty": false,
		"waits": false,
		"waitsFor": false,
		"xdescribe": false,
		"xit": false
	},
	"jest": {
		"afterAll": false,
		"afterEach": false,
		"beforeAll": false,
		"beforeEach": false,
		"describe": false,
		"expect": false,
		"fdescribe": false,
		"fit": false,
		"it": false,
		"jest": false,
		"pit": false,
		"require": false,
		"test": false,
		"xdescribe": false,
		"xit": false,
		"xtest": false
	},
	"qunit": {
		"asyncTest": false,
		"deepEqual": false,
		"equal": false,
		"expect": false,
		"module": false,
		"notDeepEqual": false,
		"notEqual": false,
		"notOk": false,
		"notPropEqual": false,
		"notStrictEqual": false,
		"ok": false,
		"propEqual": false,
		"QUnit": false,
		"raises": false,
		"start": false,
		"stop": false,
		"strictEqual": false,
		"test": false,
		"throws": false
	},
	"phantomjs": {
		"console": true,
		"exports": true,
		"phantom": true,
		"require": true,
		"WebPage": true
	},
	"couch": {
		"emit": false,
		"exports": false,
		"getRow": false,
		"log": false,
		"module": false,
		"provides": false,
		"require": false,
		"respond": false,
		"send": false,
		"start": false,
		"sum": false
	},
	"rhino": {
		"defineClass": false,
		"deserialize": false,
		"gc": false,
		"help": false,
		"importClass": false,
		"importPackage": false,
		"java": false,
		"load": false,
		"loadClass": false,
		"Packages": false,
		"print": false,
		"quit": false,
		"readFile": false,
		"readUrl": false,
		"runCommand": false,
		"seal": false,
		"serialize": false,
		"spawn": false,
		"sync": false,
		"toint32": false,
		"version": false
	},
	"nashorn": {
		"__DIR__": false,
		"__FILE__": false,
		"__LINE__": false,
		"com": false,
		"edu": false,
		"exit": false,
		"java": false,
		"Java": false,
		"javafx": false,
		"JavaImporter": false,
		"javax": false,
		"JSAdapter": false,
		"load": false,
		"loadWithNewGlobal": false,
		"org": false,
		"Packages": false,
		"print": false,
		"quit": false
	},
	"wsh": {
		"ActiveXObject": true,
		"Enumerator": true,
		"GetObject": true,
		"ScriptEngine": true,
		"ScriptEngineBuildVersion": true,
		"ScriptEngineMajorVersion": true,
		"ScriptEngineMinorVersion": true,
		"VBArray": true,
		"WScript": true,
		"WSH": true,
		"XDomainRequest": true
	},
	"jquery": {
		"$": false,
		"jQuery": false
	},
	"yui": {
		"YAHOO": false,
		"YAHOO_config": false,
		"YUI": false,
		"YUI_config": false
	},
	"shelljs": {
		"cat": false,
		"cd": false,
		"chmod": false,
		"config": false,
		"cp": false,
		"dirs": false,
		"echo": false,
		"env": false,
		"error": false,
		"exec": false,
		"exit": false,
		"find": false,
		"grep": false,
		"ln": false,
		"ls": false,
		"mkdir": false,
		"mv": false,
		"popd": false,
		"pushd": false,
		"pwd": false,
		"rm": false,
		"sed": false,
		"set": false,
		"target": false,
		"tempdir": false,
		"test": false,
		"touch": false,
		"which": false
	},
	"prototypejs": {
		"$": false,
		"$$": false,
		"$A": false,
		"$break": false,
		"$continue": false,
		"$F": false,
		"$H": false,
		"$R": false,
		"$w": false,
		"Abstract": false,
		"Ajax": false,
		"Autocompleter": false,
		"Builder": false,
		"Class": false,
		"Control": false,
		"Draggable": false,
		"Draggables": false,
		"Droppables": false,
		"Effect": false,
		"Element": false,
		"Enumerable": false,
		"Event": false,
		"Field": false,
		"Form": false,
		"Hash": false,
		"Insertion": false,
		"ObjectRange": false,
		"PeriodicalExecuter": false,
		"Position": false,
		"Prototype": false,
		"Scriptaculous": false,
		"Selector": false,
		"Sortable": false,
		"SortableObserver": false,
		"Sound": false,
		"Template": false,
		"Toggle": false,
		"Try": false
	},
	"meteor": {
		"_": false,
		"$": false,
		"Accounts": false,
		"AccountsClient": false,
		"AccountsCommon": false,
		"AccountsServer": false,
		"App": false,
		"Assets": false,
		"Blaze": false,
		"check": false,
		"Cordova": false,
		"DDP": false,
		"DDPRateLimiter": false,
		"DDPServer": false,
		"Deps": false,
		"EJSON": false,
		"Email": false,
		"HTTP": false,
		"Log": false,
		"Match": false,
		"Meteor": false,
		"Mongo": false,
		"MongoInternals": false,
		"Npm": false,
		"Package": false,
		"Plugin": false,
		"process": false,
		"Random": false,
		"ReactiveDict": false,
		"ReactiveVar": false,
		"Router": false,
		"ServiceConfiguration": false,
		"Session": false,
		"share": false,
		"Spacebars": false,
		"Template": false,
		"Tinytest": false,
		"Tracker": false,
		"UI": false,
		"Utils": false,
		"WebApp": false,
		"WebAppInternals": false
	},
	"mongo": {
		"_isWindows": false,
		"_rand": false,
		"BulkWriteResult": false,
		"cat": false,
		"cd": false,
		"connect": false,
		"db": false,
		"getHostName": false,
		"getMemInfo": false,
		"hostname": false,
		"ISODate": false,
		"listFiles": false,
		"load": false,
		"ls": false,
		"md5sumFile": false,
		"mkdir": false,
		"Mongo": false,
		"NumberInt": false,
		"NumberLong": false,
		"ObjectId": false,
		"PlanCache": false,
		"print": false,
		"printjson": false,
		"pwd": false,
		"quit": false,
		"removeFile": false,
		"rs": false,
		"sh": false,
		"UUID": false,
		"version": false,
		"WriteResult": false
	},
	"applescript": {
		"$": false,
		"Application": false,
		"Automation": false,
		"console": false,
		"delay": false,
		"Library": false,
		"ObjC": false,
		"ObjectSpecifier": false,
		"Path": false,
		"Progress": false,
		"Ref": false
	},
	"serviceworker": {
		"addEventListener": false,
		"applicationCache": false,
		"atob": false,
		"Blob": false,
		"BroadcastChannel": false,
		"btoa": false,
		"Cache": false,
		"caches": false,
		"CacheStorage": false,
		"clearInterval": false,
		"clearTimeout": false,
		"Client": false,
		"clients": false,
		"Clients": false,
		"close": true,
		"console": false,
		"ExtendableEvent": false,
		"ExtendableMessageEvent": false,
		"fetch": false,
		"FetchEvent": false,
		"FileReaderSync": false,
		"FormData": false,
		"Headers": false,
		"IDBCursor": false,
		"IDBCursorWithValue": false,
		"IDBDatabase": false,
		"IDBFactory": false,
		"IDBIndex": false,
		"IDBKeyRange": false,
		"IDBObjectStore": false,
		"IDBOpenDBRequest": false,
		"IDBRequest": false,
		"IDBTransaction": false,
		"IDBVersionChangeEvent": false,
		"ImageData": false,
		"importScripts": false,
		"indexedDB": false,
		"location": false,
		"MessageChannel": false,
		"MessagePort": false,
		"name": false,
		"navigator": false,
		"Notification": false,
		"onclose": true,
		"onconnect": true,
		"onerror": true,
		"onfetch": true,
		"oninstall": true,
		"onlanguagechange": true,
		"onmessage": true,
		"onmessageerror": true,
		"onnotificationclick": true,
		"onnotificationclose": true,
		"onoffline": true,
		"ononline": true,
		"onpush": true,
		"onpushsubscriptionchange": true,
		"onrejectionhandled": true,
		"onsync": true,
		"onunhandledrejection": true,
		"performance": false,
		"Performance": false,
		"PerformanceEntry": false,
		"PerformanceMark": false,
		"PerformanceMeasure": false,
		"PerformanceNavigation": false,
		"PerformanceResourceTiming": false,
		"PerformanceTiming": false,
		"postMessage": true,
		"Promise": false,
		"queueMicrotask": false,
		"registration": false,
		"removeEventListener": false,
		"Request": false,
		"Response": false,
		"self": false,
		"ServiceWorker": false,
		"ServiceWorkerContainer": false,
		"ServiceWorkerGlobalScope": false,
		"ServiceWorkerMessageEvent": false,
		"ServiceWorkerRegistration": false,
		"setInterval": false,
		"setTimeout": false,
		"skipWaiting": false,
		"TextDecoder": false,
		"TextEncoder": false,
		"URL": false,
		"URLSearchParams": false,
		"WebSocket": false,
		"WindowClient": false,
		"Worker": false,
		"WorkerGlobalScope": false,
		"XMLHttpRequest": false
	},
	"atomtest": {
		"advanceClock": false,
		"fakeClearInterval": false,
		"fakeClearTimeout": false,
		"fakeSetInterval": false,
		"fakeSetTimeout": false,
		"resetTimeouts": false,
		"waitsForPromise": false
	},
	"embertest": {
		"andThen": false,
		"click": false,
		"currentPath": false,
		"currentRouteName": false,
		"currentURL": false,
		"fillIn": false,
		"find": false,
		"findAll": false,
		"findWithAssert": false,
		"keyEvent": false,
		"pauseTest": false,
		"resumeTest": false,
		"triggerEvent": false,
		"visit": false,
		"wait": false
	},
	"protractor": {
		"$": false,
		"$$": false,
		"browser": false,
		"by": false,
		"By": false,
		"DartObject": false,
		"element": false,
		"protractor": false
	},
	"shared-node-browser": {
		"clearInterval": false,
		"clearTimeout": false,
		"console": false,
		"setInterval": false,
		"setTimeout": false,
		"URL": false,
		"URLSearchParams": false
	},
	"webextensions": {
		"browser": false,
		"chrome": false,
		"opr": false
	},
	"greasemonkey": {
		"cloneInto": false,
		"createObjectIn": false,
		"exportFunction": false,
		"GM": false,
		"GM_addStyle": false,
		"GM_deleteValue": false,
		"GM_getResourceText": false,
		"GM_getResourceURL": false,
		"GM_getValue": false,
		"GM_info": false,
		"GM_listValues": false,
		"GM_log": false,
		"GM_openInTab": false,
		"GM_registerMenuCommand": false,
		"GM_setClipboard": false,
		"GM_setValue": false,
		"GM_xmlhttpRequest": false,
		"unsafeWindow": false
	},
	"devtools": {
		"$": false,
		"$_": false,
		"$$": false,
		"$0": false,
		"$1": false,
		"$2": false,
		"$3": false,
		"$4": false,
		"$x": false,
		"chrome": false,
		"clear": false,
		"copy": false,
		"debug": false,
		"dir": false,
		"dirxml": false,
		"getEventListeners": false,
		"inspect": false,
		"keys": false,
		"monitor": false,
		"monitorEvents": false,
		"profile": false,
		"profileEnd": false,
		"queryObjects": false,
		"table": false,
		"undebug": false,
		"unmonitor": false,
		"unmonitorEvents": false,
		"values": false
	}
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1679975017002);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map