(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("gqlcacheclient", [], factory);
	else if(typeof exports === 'object')
		exports["gqlcacheclient"] = factory();
	else
		root["gqlcacheclient"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphql = __webpack_require__(/*! graphql */ "graphql");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function recurseFields(field, variables) {
  if (field.kind.toLowerCase() === 'field') {
    var key = field.name.value;
    if (field.alias) {
      key = field.alias.value + ':' + key;
    }
    var argKeys = field.arguments.map(function (arg) {
      var argKey = arg.name.value;
      if (arg.value.kind.toLowerCase() === 'variable' && variables && arg.value.name && variables[arg.value.name.value]) {
        argKey += '=' + JSON.stringify(variables[arg.value.name.value]);
      } else if (arg.value.kind.toLowerCase() !== 'variable') {
        argKey += '=' + JSON.stringify(arg.value.value);
      }
      return argKey;
    });
    if (argKeys.length > 0) {
      key += '(' + argKeys.join(' ') + ')';
    }
    if (!field.selectionSet || !field.selectionSet.selections || field.selectionSet.selections.length === 0) {
      return key;
    }
    var fieldsKey = field.selectionSet.selections.map(function (f) {
      return recurseFields(f, variables);
    }).join(' ');
    return key + '{' + fieldsKey + '}';
  }
  if (field.kind.toLowerCase() === 'inlinefragment') {
    var _key = '...' + field.typeCondition.name.value;
    if (!field.selectionSet || !field.selectionSet.selections || field.selectionSet.selections.length === 0) {
      return _key;
    }
    var _fieldsKey = field.selectionSet.selections.map(function (f) {
      return recurseFields(f, variables);
    }).join(' ');
    return _key + '{' + _fieldsKey + '}';
  }
  throw new Error('Selection is of unknown type');
}

function getCacheKey(doc, variables) {
  var outer = [];
  outer.push(doc.operation);
  outer.push(doc.name ? doc.name.value : null);
  var key = outer.join('|');

  return doc.selectionSet.selections.map(function (sel) {
    if (sel.kind.toLowerCase() === 'field') {
      var alias = sel.alias ? sel.alias.value : sel.name.value;
      var queryKey = key + '|' + recurseFields(sel, variables);
      return {
        queryKey: queryKey,
        alias: alias
      };
    }
    throw new Error('First level selections must be of kind "Field"');
  });
}

function fetchQuery(endpoint, headers, operationName, query, variables) {
  return fetch(endpoint, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: _extends({
      'Content-Type': 'application/json; charset=utf-8'
    }, headers),
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify({
      operationName: operationName,
      query: query,
      variables: variables
    })
  }).then(function (response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error({
      networkError: {
        status: response.status,
        statusText: response.statusText
      }
    }));
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.errors && data.errors.length > 0) {
      return Promise.reject(new Error({ graphqlErrors: data.errors }));
    }
    return Promise.resolve(data.data);
  });
}

var GqlClient = function () {
  function GqlClient(endpoint, headers, errorHandler) {
    _classCallCheck(this, GqlClient);

    this.endpoint = endpoint;
    this.headers = headers;
    this.cache = new Map();
    this.errorHandler = errorHandler;
  }

  _createClass(GqlClient, [{
    key: 'request',
    value: function request(query, variables, options) {
      var _this = this;

      var reqOptions = {
        cache: true
      };
      if (options) {
        reqOptions = _extends({}, reqOptions, options);
      }
      var queryDoc = void 0;
      try {
        queryDoc = (0, _graphql.parse)(query);
        if (queryDoc.definitions.length > 1) {
          return Promise.reject(new Error('Multiple operations not supported'));
        }
      } catch (e) {
        return Promise.reject(e);
      }
      var doc = queryDoc.definitions[0];
      var cacheKeys = void 0;
      if (reqOptions.cache && doc.operation.toLowerCase() === 'query') {
        try {
          cacheKeys = getCacheKey(doc, variables);
        } catch (e) {
          return Promise.reject(e);
        }
        var result = {};
        var count = 0;
        cacheKeys.forEach(function (key) {
          var cached = _this.cache.get(key.queryKey);
          if (cached) {
            result[key.alias] = cached;
            count += 1;
          }
        });
        if (count === cacheKeys.length) {
          return Promise.resolve(result);
        }
      }
      var promise = fetchQuery(this.endpoint, this.headers, queryDoc.definitions[0].name ? queryDoc.definitions[0].name.value : null, query, variables).then(function (data) {
        if (reqOptions.cache && doc.operation.toLowerCase() === 'query' && cacheKeys) {
          cacheKeys.forEach(function (key) {
            _this.cache.set(key.queryKey, data[key.alias]);
          });
        }
        return Promise.resolve(data);
      });
      if (this.errorHandler) {
        return promise.catch(function (err) {
          return _this.errorHandler(err);
        });
      }
      return promise;
    }
  }]);

  return GqlClient;
}();

exports.default = GqlClient;

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ })

/******/ });
});
//# sourceMappingURL=gqlcacheclient.js.map