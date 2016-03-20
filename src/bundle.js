/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);

	var _GameArea = __webpack_require__(5);

	var _GameArea2 = _interopRequireDefault(_GameArea);

	var _TextComponent = __webpack_require__(6);

	var _TextComponent2 = _interopRequireDefault(_TextComponent);

	var _BaseComponent = __webpack_require__(7);

	var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

	var _Boat = __webpack_require__(8);

	var _Boat2 = _interopRequireDefault(_Boat);

	var _Plane = __webpack_require__(11);

	var _Plane2 = _interopRequireDefault(_Plane);

	var _Parachuter = __webpack_require__(12);

	var _Parachuter2 = _interopRequireDefault(_Parachuter);

	var _LevelService = __webpack_require__(13);

	var _LevelService2 = _interopRequireDefault(_LevelService);

	var _LifeService = __webpack_require__(14);

	var _LifeService2 = _interopRequireDefault(_LifeService);

	var _ScoreService = __webpack_require__(15);

	var _ScoreService2 = _interopRequireDefault(_ScoreService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var levelService = new _LevelService2.default(),
	    lifeService = new _LifeService2.default(),
	    scoreService = new _ScoreService2.default(),
	    gameWidth = 800,
	    gameHeight = 600,
	    FPS = 60,
	    gameArea = new _GameArea2.default(gameWidth, gameHeight),
	    background = new _BaseComponent2.default(getBackgorundSettings()),
	    water = new _BaseComponent2.default(getWaterSettings()),
	    boat = new _Boat2.default(getBoatSettings()),
	    plane = new _Plane2.default(getPlaneSettings()),
	    levelText = new _TextComponent2.default(getLevelTextSettings()),
	    lifeText = new _TextComponent2.default(getLifeTextSettings()),
	    scoreText = new _TextComponent2.default(getScoreTextSetting());

	var gameLoopInterval = void 0,
	    parachuters = [],
	    cyclesPerLevel = 3,
	    // Amount of plane cycles needed to level up.
	planeCycles = 0; // Plane cycle counter;

	initializeGame();

	function initializeGame() {
	    subscribeToEvents();
	    startGameLoop();
	}

	/* register to the events the game will shout at us */
	function subscribeToEvents() {
	    document.body.addEventListener("gameOver", stopGame, false);
	    document.body.addEventListener("parachuterDropped", dropParachuter, false);
	    document.body.addEventListener("hitsBoat", removeParachuter, false);
	    document.body.addEventListener("hitsWater", removeParachuter, false);
	    document.body.addEventListener("planeFinishedCycle", planeFinishedCycle, false);
	}

	function startGameLoop() {
	    gameLoopInterval = setInterval(gameLoop, 1000 / FPS);
	}

	// This is the main loop of the game and is called x times a second. Here we clean the canvas and redrew again.
	function gameLoop() {
	    gameArea.clear();

	    background.draw(gameArea.context);
	    water.draw(gameArea.context);

	    levelText.text = getLevelText();
	    levelText.draw(gameArea.context);

	    scoreText.text = getScoreText();
	    scoreText.draw(gameArea.context);

	    lifeText.text = getLivesText();
	    lifeText.draw(gameArea.context);

	    boat.update(); // update the behavior of the boat
	    boat.draw(gameArea.context); // redraw the boat

	    plane.update(); // update the behavior of the plane
	    plane.draw(gameArea.context); // redraw the plane

	    // We might have more than 1 parachuter in the game. Iterate over every parachuter.
	    for (var i = 0; i < parachuters.length; i++) {
	        parachuters[i].update(); // update the behavior of the parachuter. Notice that inside the update function, we might call 'hitsX' and essentially remove the parachuter from the game.

	        if (parachuters[i]) // at this point, the parachuters might not be at the parachuters array because they hit the boat/water. If he's not, he will be null and we will stop drawing it.
	            parachuters[i].draw(gameArea.context);
	    }
	}

	// Stop the game when it's game over. This will make the screen freeze.
	function stopGame() {
	    clearInterval(gameLoopInterval);
	}

	// This is called when we successfully catch a 'parachuterDropped' event that is fired from the Plane object. This creates an instance of a parachuter and adds it to the parachuters array
	function dropParachuter(e) {
	    parachuters.push(new _Parachuter2.default({
	        id: parachuters.length - 1,
	        width: 50,
	        height: 50,
	        y: 0,
	        image: "img/parachuter.png",
	        x: e.detail,
	        water: water, //We need a reference to the water object to detect collision
	        boat: boat }));
	}

	// This is called when we successfully catch a 'hitsBoat' or 'hitsWater' event that is fired from the parachuter object. We remove the parachuter from the parachuters array.
	// Once it is removed from the array, it will disappear with the next gameArea.clear() call.
	//We need a reference to the boat object to detect collision
	function removeParachuter(e) {
	    parachuters.splice(e.detail.id, 1);
	}

	function planeFinishedCycle() {
	    planeCycles++;
	    if (planeCycles % cyclesPerLevel == 0) {
	        levelService.levelUp();
	        plane.parachutersPerCycle = levelService.level;
	    }
	}

	function getBackgorundSettings() {
	    var backgroundSettings = { width: gameWidth, height: gameHeight, x: 0, y: 0, image: "img/background.jpg" };
	    return backgroundSettings;
	}

	function getWaterSettings() {
	    var waterSettings = { width: gameWidth, height: gameHeight / 3, x: 0, image: "img/water.jpg" };
	    waterSettings.y = gameHeight - waterSettings.height;
	    return waterSettings;
	}

	function getBoatSettings() {
	    var boatSettings = { width: 110, height: 55, image: "img/boat.png", gameWidth: gameWidth };
	    boatSettings.x = gameWidth - boatSettings.width;
	    boatSettings.y = gameHeight - water.height - boatSettings.height;
	    return boatSettings;
	}

	function getPlaneSettings() {
	    var planeSettings = { width: 80, height: 80, y: 0, x: 0, image: "img/plane.png", gameWidth: gameWidth };
	    return planeSettings;
	}

	function getLevelTextSettings() {
	    var levelTextSettings = { x: 0, y: gameHeight / 3 };
	    return levelTextSettings;
	}

	function getLifeTextSettings() {
	    var lifeTextSettings = { x: 0, y: levelText.y + 40 };
	    return lifeTextSettings;
	}

	function getScoreTextSetting() {
	    var scoreTextSettings = { x: 0, y: lifeText.y + 40 };
	    return scoreTextSettings;
	}

	//Returns the level text
	function getLevelText() {
	    return "LEVEL: " + levelService.level;
	}

	//Returns the lives text
	function getLivesText() {
	    return "LIVES: " + lifeService.lives;
	}

	//Returns the score text
	function getScoreText() {
	    return "SCORE: " + scoreService.score;
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "canvas {\r\n    border: 1px solid #4F81BD;\r\n    background-color: #f1f1f1;\r\n    cursor: none;\r\n}", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* GameArea hold the canvas and the context
	*
	* @class GameArea
	* @constructor
	*/

	var s_canvas = Symbol();

	var GameArea = function () {
	    function GameArea(width, height) {
	        _classCallCheck(this, GameArea);

	        this.setupCanvas(width, height);
	    }

	    //create a canvas dom element and append to the body.


	    _createClass(GameArea, [{
	        key: "setupCanvas",
	        value: function setupCanvas(width, height) {
	            this[s_canvas] = document.createElement("canvas");
	            this[s_canvas].width = width;
	            this[s_canvas].height = height;
	            this._context = this[s_canvas].getContext("2d");
	            document.body.insertBefore(this[s_canvas], document.body.childNodes[0]); //Append the canvas dom object as the first child of the body elemnt
	        }
	    }, {
	        key: "clear",


	        // Clears everything in the canvas. This is the first thing that is called inside our GameLoop.
	        value: function clear() {
	            this.context.clearRect(0, 0, this[s_canvas].width, this[s_canvas].height);
	        }
	    }, {
	        key: "context",
	        get: function get() {
	            return this._context;
	        }
	    }]);

	    return GameArea;
	}();

	exports.default = GameArea;
	;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* This text component is used by Levels, Score and Lives to display the stats.
	*
	* @class Text
	* @constructor
	*/

	var TextComponent = function () {
	    function TextComponent(settings) {
	        _classCallCheck(this, TextComponent);

	        //Validate
	        if (settings.x == undefined || settings.y == undefined) throw Error("Invalid settings for Text component");

	        this.x = settings.x;
	        this.y = settings.y;
	        this.color = settings.color || "#000";
	        this.text = settings.text || "";
	        this.font = settings.font || "20px Georgia";;
	    }

	    _createClass(TextComponent, [{
	        key: "draw",
	        value: function draw(canvasContext) {
	            canvasContext.fillStyle = this.color;
	            canvasContext.font = this.font;
	            canvasContext.fillText(this.text, this.x, this.y);
	        }
	    }]);

	    return TextComponent;
	}();

	exports.default = TextComponent;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* This is the Base Component. This is used as a parent constructor and contains the draw function our components run inside the gameLoop.
	*
	* @class BaseComponent
	* @constructor
	*/

	var BaseComponent = function () {
	    function BaseComponent(settings) {
	        _classCallCheck(this, BaseComponent);

	        // Validate
	        if (settings.width == undefined || settings.height == undefined || settings.x == undefined || settings.y == undefined || settings.image == undefined) throw Error("Invalid settings for component");

	        this.width = settings.width;
	        this.height = settings.height;
	        this.x = settings.x;
	        this.y = settings.y;
	        this.image = settings.image;
	    }

	    _createClass(BaseComponent, [{
	        key: "draw",
	        value: function draw(canvasContext) {
	            canvasContext.drawImage(this.image, this.x, this.y, this.width, this.height);
	        }
	    }, {
	        key: "image",
	        get: function get() {
	            return this._image;
	        },
	        set: function set(src) {
	            this._image = new Image();
	            this._image.src = src;
	        }
	    }]);

	    return BaseComponent;
	}();

	exports.default = BaseComponent;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseComponent2 = __webpack_require__(7);

	var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

	__webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * The boat component. Here we also set the keys to move the boat.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @class Boat
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @constructor
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


	//For the clamp/contains extensions

	var keysPressed = [];

	var Boat = function (_BaseComponent) {
	    _inherits(Boat, _BaseComponent);

	    function Boat(settings, stats) {
	        _classCallCheck(this, Boat);

	        //Validate

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Boat).call(this, settings));

	        if (settings.gameWidth == undefined) throw Error("Invalid settings for Boat component");

	        _this.gameWidth = settings.gameWidth;

	        stats = stats || {};
	        _this.speed = stats.speed || 3;

	        _this.bindKeys();
	        return _this;
	    }

	    _createClass(Boat, [{
	        key: "update",


	        //We always move the both with the last key that is held down. We also make sure to clamp the x position of the boat so we won't get off screen.
	        value: function update() {
	            var lastKeyPressed = keysPressed.last();
	            if (lastKeyPressed == 37) this.moveLeft();

	            if (lastKeyPressed == 39) this.moveRight();
	        }
	    }, {
	        key: "bindKeys",
	        value: function bindKeys() {
	            window.addEventListener('keydown', function (e) {
	                if (!keysPressed.contains(e.keyCode)) keysPressed.push(e.keyCode);
	            });

	            window.addEventListener('keyup', function (e) {
	                var index = keysPressed.indexOf(e.keyCode);
	                if (index != -1) keysPressed.splice(index, 1);
	            });
	        }
	    }, {
	        key: "moveLeft",
	        value: function moveLeft() {
	            //  console.log(keysPressed);
	            this.x -= this.speed;
	            //console.log(this.x);
	        }
	    }, {
	        key: "moveRight",
	        value: function moveRight() {
	            //   console.log(this.speed);
	            this.x += this.speed;
	            //  console.log(this.x);
	        }
	    }, {
	        key: "x",
	        get: function get() {
	            return this._x;
	        }

	        //Clamp the boat's location to the width of the canvas.
	        ,
	        set: function set(newX) {
	            this._x = this.gameWidth ? newX.clamp(0, this.gameWidth - this.width) : newX;
	        }
	    }]);

	    return Boat;
	}(_BaseComponent3.default);

	exports.default = Boat;

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";

	/**
	* Returns a number whose value is limited to the given range.
	*
	* Example: limit the output of this computation to between 0 and 255
	* (x * 255).clamp(0, 255)
	*
	* @param {Number} min The lower boundary of the output range
	* @param {Number} max The upper boundary of the output range
	* @returns A number in the range [min, max]
	* @type Number
	*/
	Number.prototype.clamp = function (min, max) {
	    return Math.min(Math.max(this, min), max);
	};

	/**
	* Returns whether an array contains the argument element or not
	*
	* @param {object} the needle element to check
	* @returns whether an array contains the argument element or not
	* @type Bool;
	*/
	Array.prototype.contains = function (element) {
	    var arrayLength = this.length;
	    for (var i = 0; i < arrayLength; i++) {
	        if (this[i] == element) {
	            return true;
	        }
	    }
	    return false;
	};

	/**
	* Returns the last element of an array.
	*/
	Array.prototype.last = function () {
	    return this[this.length - 1];
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseComponent2 = __webpack_require__(7);

	var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

	__webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * The plane component. In charge of plane movement pattern and calculating parachuters drop points
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @class Plane
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @constructor
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


	//For the clamp/contains extensions

	//deploymentXLocations holds the x coordinates in which the plane drops parachuters. It resets every time the plane completes a cycle.
	var deploymentXLocations = [],
	    planeFinishedCycleEvent = void 0,
	    parachuterDroppedEvent = void 0;

	var Plane = function (_BaseComponent) {
	    _inherits(Plane, _BaseComponent);

	    function Plane(settings, stats) {
	        _classCallCheck(this, Plane);

	        //Validate

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Plane).call(this, settings));

	        if (settings.gameWidth == undefined) throw Error("Invalid settings for Plane component");

	        stats = stats || {};
	        _this.speed = stats.speed || 3;
	        _this.parachutersPerCycle = stats.parachutersPerCycle || 1;
	        _this.gameWidth = settings.gameWidth;
	        _this.x = _this.getNewPlaneLocation();

	        _this.setDeploymentLocations();
	        _this.createEvents();
	        return _this;
	    }

	    _createClass(Plane, [{
	        key: "update",
	        value: function update() {
	            //When the plane hits an x location that is inside the deploymentXLocations, he will drop a parachuter.
	            if (deploymentXLocations.contains(this.x)) this.dropParachuter();

	            if (this.hasFinishedCycle()) {
	                document.body.dispatchEvent(planeFinishedCycleEvent);
	                this.planeFinishedCycle();
	            }
	            //If the plane didn't finish a cycle, move left.
	            else this.moveLeft();
	        }
	    }, {
	        key: "moveLeft",
	        value: function moveLeft() {
	            this.x -= this.speed;
	        }
	    }, {
	        key: "setDeploymentLocations",
	        value: function setDeploymentLocations() {
	            for (var i = 0; i < this.parachutersPerCycle; i++) {
	                //We generate a random number between 0 and the canvas' width. We multiply (and then divide) by the speed of the plane.
	                //This is needed to make sure that the plane will actually hit those x locations. If the speed of the plane is 3, we will need randomXlocations that can be divided by 3.
	                var deploymentLocation = Math.floor(Math.random() * this.gameWidth / this.speed) * this.speed;
	                deploymentXLocations.push(deploymentLocation);
	            }
	        }

	        //called when plane has finished a cycle. we pass the plane 'this' reference so we can use it inside the event listener.

	    }, {
	        key: "createEvents",
	        value: function createEvents() {
	            planeFinishedCycleEvent = new CustomEvent("planeFinishedCycle", { 'detail': this });
	        }

	        //If the plane has finished a cycle, we will clean the deploymentXLocations array, reset the plane position to the right of the screen and calculate deplyment x locations again.      

	    }, {
	        key: "planeFinishedCycle",
	        value: function planeFinishedCycle() {
	            deploymentXLocations = [];
	            this.restartPlaneLocation();
	            this.setDeploymentLocations();
	        }

	        //Checkes if the plane has fully left the canvas area.

	    }, {
	        key: "hasFinishedCycle",
	        value: function hasFinishedCycle() {
	            return this.x < -this.width;
	        }

	        // After the plane has crossed the canvas to the left, teleport him to the right.

	    }, {
	        key: "restartPlaneLocation",
	        value: function restartPlaneLocation() {
	            this.x = this.getNewPlaneLocation();
	        }

	        //When a parachuter dros, we call an event to be catched by other services that will handle it.

	    }, {
	        key: "dropParachuter",
	        value: function dropParachuter() {
	            var parachuterDropped = new CustomEvent("parachuterDropped", { 'detail': this.x });
	            document.body.dispatchEvent(parachuterDropped);
	        }

	        // This functions returns an xLocation for which the plane is teleported to the right of the canvas. Distance is a random number between zero and the canvas' width.
	        // We use distance to simulate the "time" it takes the plane to get back to the screen.
	        // Also, we have to make sure the plane will start at a coordinate that is divided by the speed. This is to make sure the plane will hit all his deploymentXLocations.
	        // This is why we run a while loop until we generate a location that can can be divided by the plane's speedn./

	    }, {
	        key: "getNewPlaneLocation",
	        value: function getNewPlaneLocation() {
	            var distance;
	            do {
	                distance = Math.floor(Math.random() * this.gameWidth);
	            } while ((this.gameWidth + distance) % this.speed != 0);

	            return this.gameWidth + distance;
	        }
	    }]);

	    return Plane;
	}(_BaseComponent3.default);

	exports.default = Plane;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseComponent2 = __webpack_require__(7);

	var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * The parachuter component.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @class Parachuter
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @constructor
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


	//declare the events.
	var hitsBoat = void 0,
	    hitsWater = void 0;

	var Plane = function (_BaseComponent) {
	    _inherits(Plane, _BaseComponent);

	    function Plane(settings, stats) {
	        _classCallCheck(this, Plane);

	        //Validate

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Plane).call(this, settings));

	        if (settings.water == undefined || settings.boat == undefined) throw Error("Invalid settings for Parachuter component");

	        stats = stats || {};
	        _this.speed = stats.speed || 2;
	        _this.reward = stats.reward || 10;
	        _this.water = settings.water;
	        _this.boat = settings.boat;

	        _this.createEvents();
	        return _this;
	    }

	    _createClass(Plane, [{
	        key: "update",
	        value: function update() {
	            this.y += this.speed;

	            if (this.landsOn(this.boat)) document.body.dispatchEvent(hitsBoat); //raise the hitsBoat event

	            if (this.landsOn(this.water)) document.body.dispatchEvent(hitsWater); //raise the hitsWater event.      
	        }
	    }, {
	        key: "createEvents",
	        value: function createEvents() {
	            hitsBoat = new CustomEvent("hitsBoat", { 'detail': this });
	            hitsWater = new CustomEvent("hitsWater", { 'detail': this });
	        }

	        // check if the parachuter collided with an object. return true or flase.

	    }, {
	        key: "landsOn",
	        value: function landsOn(otherobj) {
	            return this.x < otherobj.x + otherobj.width && this.x + this.width > otherobj.x && this.y < otherobj.y + otherobj.height && this.height + this.y > otherobj.y;
	        }
	    }]);

	    return Plane;
	}(_BaseComponent3.default);

	exports.default = Plane;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* In charge of levels
	*
	* @class LevelService
	* @constructor
	*/
	var s_level = Symbol();

	var LevelService = function () {
	    function LevelService() {
	        _classCallCheck(this, LevelService);

	        var initialLevel = 1;
	        this[s_level] = initialLevel;
	    }

	    _createClass(LevelService, [{
	        key: "levelUp",
	        value: function levelUp() {
	            this[s_level]++;
	        }
	    }, {
	        key: "level",
	        get: function get() {
	            return this[s_level];
	        }
	    }]);

	    return LevelService;
	}();

	exports.default = LevelService;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* In charge of lives
	*
	* @class LifeService
	* @constructor
	*/

	var s_currentLives = Symbol(),
	    gameOverEvent = void 0;

	var LifeService = function () {
	    function LifeService() {
	        _classCallCheck(this, LifeService);

	        var initialLives = 3;
	        this[s_currentLives] = initialLives;

	        this.subscribeToEvents();
	        this.createEvents();
	    }

	    _createClass(LifeService, [{
	        key: "createEvents",
	        value: function createEvents() {
	            gameOverEvent = new CustomEvent("gameOver");
	        }
	    }, {
	        key: "subscribeToEvents",
	        value: function subscribeToEvents() {
	            var _this = this;

	            document.body.addEventListener("hitsWater", function () {
	                _this.loseLife();
	            }, false); //Listen to the hitsWater event and fire a loseLife function.
	        }
	    }, {
	        key: "loseLife",
	        value: function loseLife() {
	            if (this.lives > 0) // Prevent Lives from reaching minus values.
	                this[s_currentLives]--;

	            if (this.lives == 0) // No more lives.
	                this.raiseGameOver();
	        }

	        // This will raise the gameOver event and essentially finish the game. Notice that I put a setTimeout because I want the frames to the changes the lives to 0 before the game ends.
	        // If I didn't put a setTimeout here, the game will be over with the "Lives: 1" text.

	    }, {
	        key: "raiseGameOver",
	        value: function raiseGameOver() {
	            setTimeout(function () {
	                document.body.dispatchEvent(gameOverEvent);
	            }, 100);
	        }
	    }, {
	        key: "lives",
	        get: function get() {
	            return this[s_currentLives];
	        }
	    }]);

	    return LifeService;
	}();

	exports.default = LifeService;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	* In charge of score
	*
	* @class ScoreService
	* @constructor
	*/

	var s_score = Symbol();

	var ScoreService = function () {
	    function ScoreService() {
	        _classCallCheck(this, ScoreService);

	        this[s_score] = 0;

	        this.listenToEvents();
	    }

	    _createClass(ScoreService, [{
	        key: "listenToEvents",
	        value: function listenToEvents() {
	            var _this = this;

	            document.body.addEventListener("hitsBoat", function (e) {
	                _this.addScore(e.detail.reward);
	            }, false); //Listen to the hitsBoat event and fire an addScore function.
	        }

	        //We add a score based on the 'reward' property the caught parachuter has.

	    }, {
	        key: "addScore",
	        value: function addScore(reward) {
	            this[s_score] += reward;
	        }
	    }, {
	        key: "score",
	        get: function get() {
	            return this[s_score];
	        }
	    }]);

	    return ScoreService;
	}();

	exports.default = ScoreService;

/***/ }
/******/ ]);