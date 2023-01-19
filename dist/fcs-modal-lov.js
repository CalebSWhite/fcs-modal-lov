(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":2,"./handlebars/exception":5,"./handlebars/no-conflict":18,"./handlebars/runtime":19,"./handlebars/safe-string":20,"./handlebars/utils":21}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _internalProtoAccess = require('./internal/proto-access');

var VERSION = '4.7.7';
exports.VERSION = VERSION;
var COMPILER_REVISION = 8;
exports.COMPILER_REVISION = COMPILER_REVISION;
var LAST_COMPATIBLE_COMPILER_REVISION = 7;

exports.LAST_COMPATIBLE_COMPILER_REVISION = LAST_COMPATIBLE_COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0 <4.3.0',
  8: '>= 4.3.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  },
  /**
   * Reset the memory of illegal property accesses that have already been logged.
   * @deprecated should only be used in handlebars test-cases
   */
  resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
    _internalProtoAccess.resetLoggedProperties();
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":3,"./exception":5,"./helpers":6,"./internal/proto-access":15,"./logger":17,"./utils":21}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":4}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":21}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      endLineNumber = undefined,
      column = undefined,
      endColumn = undefined;

  if (loc) {
    line = loc.start.line;
    endLineNumber = loc.end.line;
    column = loc.start.column;
    endColumn = loc.end.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;
      this.endLineNumber = endLineNumber;

      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', {
          value: column,
          enumerable: true
        });
        Object.defineProperty(this, 'endColumn', {
          value: endColumn,
          enumerable: true
        });
      } else {
        this.column = column;
        this.endColumn = endColumn;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
exports.moveHelperToHooks = moveHelperToHooks;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}

function moveHelperToHooks(instance, helperName, keepHelper) {
  if (instance.helpers[helperName]) {
    instance.hooks[helperName] = instance.helpers[helperName];
    if (!keepHelper) {
      delete instance.helpers[helperName];
    }
  }
}


},{"./helpers/block-helper-missing":7,"./helpers/each":8,"./helpers/helper-missing":9,"./helpers/if":10,"./helpers/log":11,"./helpers/lookup":12,"./helpers/with":13}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":21}],8:[function(require,module,exports){
(function (global){(function (){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else if (global.Symbol && context[global.Symbol.iterator]) {
        var newContext = [];
        var iterator = context[global.Symbol.iterator]();
        for (var it = iterator.next(); !it.done; it = iterator.next()) {
          newContext.push(it.value);
        }
        context = newContext;
        for (var j = context.length; i < j; i++) {
          execIteration(i, i, i === context.length - 1);
        }
      } else {
        (function () {
          var priorKey = undefined;

          Object.keys(context).forEach(function (key) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          });
          if (priorKey !== undefined) {
            execIteration(priorKey, i - 1, true);
          }
        })();
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../exception":5,"../utils":21}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":5}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (arguments.length != 2) {
      throw new _exception2['default']('#if requires exactly one argument');
    }
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    if (arguments.length != 2) {
      throw new _exception2['default']('#unless requires exactly one argument');
    }
    return instance.helpers['if'].call(this, conditional, {
      fn: options.inverse,
      inverse: options.fn,
      hash: options.hash
    });
  });
};

module.exports = exports['default'];


},{"../exception":5,"../utils":21}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field, options) {
    if (!obj) {
      // Note for 5.0: Change to "obj == null" in 5.0
      return obj;
    }
    return options.lookupProperty(obj, field);
  });
};

module.exports = exports['default'];


},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (arguments.length != 2) {
      throw new _exception2['default']('#with requires exactly one argument');
    }
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../exception":5,"../utils":21}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.createNewLookupObject = createNewLookupObject;

var _utils = require('../utils');

/**
 * Create a new object with "null"-prototype to avoid truthy results on prototype properties.
 * The resulting object can be used with "object[property]" to check if a property exists
 * @param {...object} sources a varargs parameter of source objects that will be merged
 * @returns {object}
 */

function createNewLookupObject() {
  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return _utils.extend.apply(undefined, [Object.create(null)].concat(sources));
}


},{"../utils":21}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.createProtoAccessControl = createProtoAccessControl;
exports.resultIsAllowed = resultIsAllowed;
exports.resetLoggedProperties = resetLoggedProperties;
// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _createNewLookupObject = require('./create-new-lookup-object');

var _logger = require('../logger');

var logger = _interopRequireWildcard(_logger);

var loggedProperties = Object.create(null);

function createProtoAccessControl(runtimeOptions) {
  var defaultMethodWhiteList = Object.create(null);
  defaultMethodWhiteList['constructor'] = false;
  defaultMethodWhiteList['__defineGetter__'] = false;
  defaultMethodWhiteList['__defineSetter__'] = false;
  defaultMethodWhiteList['__lookupGetter__'] = false;

  var defaultPropertyWhiteList = Object.create(null);
  // eslint-disable-next-line no-proto
  defaultPropertyWhiteList['__proto__'] = false;

  return {
    properties: {
      whitelist: _createNewLookupObject.createNewLookupObject(defaultPropertyWhiteList, runtimeOptions.allowedProtoProperties),
      defaultValue: runtimeOptions.allowProtoPropertiesByDefault
    },
    methods: {
      whitelist: _createNewLookupObject.createNewLookupObject(defaultMethodWhiteList, runtimeOptions.allowedProtoMethods),
      defaultValue: runtimeOptions.allowProtoMethodsByDefault
    }
  };
}

function resultIsAllowed(result, protoAccessControl, propertyName) {
  if (typeof result === 'function') {
    return checkWhiteList(protoAccessControl.methods, propertyName);
  } else {
    return checkWhiteList(protoAccessControl.properties, propertyName);
  }
}

function checkWhiteList(protoAccessControlForType, propertyName) {
  if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
    return protoAccessControlForType.whitelist[propertyName] === true;
  }
  if (protoAccessControlForType.defaultValue !== undefined) {
    return protoAccessControlForType.defaultValue;
  }
  logUnexpecedPropertyAccessOnce(propertyName);
  return false;
}

function logUnexpecedPropertyAccessOnce(propertyName) {
  if (loggedProperties[propertyName] !== true) {
    loggedProperties[propertyName] = true;
    logger.log('error', 'Handlebars: Access has been denied to resolve the property "' + propertyName + '" because it is not an "own property" of its parent.\n' + 'You can add a runtime option to disable the check or this warning:\n' + 'See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details');
  }
}

function resetLoggedProperties() {
  Object.keys(loggedProperties).forEach(function (propertyName) {
    delete loggedProperties[propertyName];
  });
}


},{"../logger":17,"./create-new-lookup-object":14}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.wrapHelper = wrapHelper;

function wrapHelper(helper, transformOptionsFn) {
  if (typeof helper !== 'function') {
    // This should not happen, but apparently it does in https://github.com/wycats/handlebars.js/issues/1639
    // We try to make the wrapper least-invasive by not wrapping it, if the helper is not a function.
    return helper;
  }
  var wrapper = function wrapper() /* dynamic arguments */{
    var options = arguments[arguments.length - 1];
    arguments[arguments.length - 1] = transformOptionsFn(options);
    return helper.apply(this, arguments);
  };
  return wrapper;
}


},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      // eslint-disable-next-line no-console
      if (!console[method]) {
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":21}],18:[function(require,module,exports){
(function (global){(function (){
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

var _helpers = require('./helpers');

var _internalWrapHelper = require('./internal/wrapHelper');

var _internalProtoAccess = require('./internal/proto-access');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision >= _base.LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <= _base.COMPILER_REVISION) {
    return;
  }

  if (compilerRevision < _base.LAST_COMPATIBLE_COMPILER_REVISION) {
    var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
        compilerVersions = _base.REVISION_CHANGES[compilerRevision];
    throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
  } else {
    // Use the embedded version info since the runtime doesn't know about this revision yet
    throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as pseudo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  // backwards compatibility for precompiled templates with compiler-version 7 (<4.3.0)
  var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }
    partial = env.VM.resolvePartial.call(this, partial, context, options);

    var extendedOptions = Utils.extend({}, options, {
      hooks: this.hooks,
      protoAccessControl: this.protoAccessControl
    });

    var result = env.VM.invokePartial.call(this, partial, context, extendedOptions);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, extendedOptions);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name, loc) {
      if (!obj || !(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj, {
          loc: loc
        });
      }
      return container.lookupProperty(obj, name);
    },
    lookupProperty: function lookupProperty(parent, propertyName) {
      var result = parent[propertyName];
      if (result == null) {
        return result;
      }
      if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
        return result;
      }

      if (_internalProtoAccess.resultIsAllowed(result, container.protoAccessControl, propertyName)) {
        return result;
      }
      return undefined;
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        var result = depths[i] && container.lookupProperty(depths[i], name);
        if (result != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    mergeIfNeeded: function mergeIfNeeded(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },
    // An empty object to use as replacement for null-contexts
    nullContext: Object.seal({}),

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }

    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }

  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      var mergedHelpers = Utils.extend({}, env.helpers, options.helpers);
      wrapHelpersToPassLookupProperty(mergedHelpers, container);
      container.helpers = mergedHelpers;

      if (templateSpec.usePartial) {
        // Use mergeIfNeeded here to prevent compiling global partials multiple times
        container.partials = container.mergeIfNeeded(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = Utils.extend({}, env.decorators, options.decorators);
      }

      container.hooks = {};
      container.protoAccessControl = _internalProtoAccess.createProtoAccessControl(options);

      var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;
      _helpers.moveHelperToHooks(container, 'helperMissing', keepHelperInHelpers);
      _helpers.moveHelperToHooks(container, 'blockHelperMissing', keepHelperInHelpers);
    } else {
      container.protoAccessControl = options.protoAccessControl; // internal option
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
      container.hooks = options.hooks;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

/**
 * This is currently part of the official API, therefore implementation details should not be changed.
 */

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  // Use the current closure context to save the partial-block if this partial
  var currentPartialBlock = options.data && options.data['partial-block'];
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    (function () {
      options.data = _base.createFrame(options.data);
      // Wrapper function to get access to currentPartialBlock from the closure
      var fn = options.fn;
      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        // Restore the partial-block from the closure for the execution of the block
        // i.e. the part inside the block of the partial call.
        options.data = _base.createFrame(options.data);
        options.data['partial-block'] = currentPartialBlock;
        return fn(context, options);
      };
      if (fn.partials) {
        options.partials = Utils.extend({}, options.partials, fn.partials);
      }
    })();
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}

function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
  Object.keys(mergedHelpers).forEach(function (helperName) {
    var helper = mergedHelpers[helperName];
    mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
  });
}

function passLookupPropertyOption(helper, container) {
  var lookupProperty = container.lookupProperty;
  return _internalWrapHelper.wrapHelper(helper, function (options) {
    return Utils.extend({ lookupProperty: lookupProperty }, options);
  });
}


},{"./base":2,"./exception":5,"./helpers":6,"./internal/proto-access":15,"./internal/wrapHelper":16,"./utils":21}],20:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],22:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":1}],23:[function(require,module,exports){
/* global apex */
var Handlebars = require('hbsfy/runtime')

Handlebars.registerHelper('raw', function (options) {
  return options.fn(this)
})

// Require dynamic templates
var modalReportTemplate = require('./templates/modal-report.hbs')
Handlebars.registerPartial('report', require('./templates/partials/_report.hbs'))
Handlebars.registerPartial('rows', require('./templates/partials/_rows.hbs'))
Handlebars.registerPartial('pagination', require('./templates/partials/_pagination.hbs'))

;(function ($, window) {
  $.widget('fcs.modalLov', {
    // default options
    options: {
      id: '',
      title: '',
      itemName: '',
      searchField: '',
      searchButton: '',
      searchPlaceholder: '',
      ajaxIdentifier: '',
      showHeaders: false,
      returnCol: '',
      displayCol: '',
      validationError: '',
      cascadingItems: '',
      modalWidth: 600,
      noDataFound: '',
      allowMultilineRows: false,
      rowCount: 15,
      pageItemsToSubmit: '',
      markClasses: 'u-hot',
      hoverClasses: 'hover u-color-1',
      previousLabel: 'previous',
      nextLabel: 'next',
      textCase: 'N',
      additionalOutputsStr: '',
    },

    _returnValue: '',

    _item$: null,
    _searchButton$: null,
    _clearInput$: null,

    _searchField$: null,

    _templateData: {},
    _lastSearchTerm: '',

    _modalDialog$: null,

    _activeDelay: false,
    _disableChangeEvent: false,

    _ig$: null,
    _grid: null,

    _topApex: apex.util.getTopApex(),

    _resetFocus: function () {
      var self = this
      if (this._grid) {
        var recordId = this._grid.model.getRecordId(this._grid.view$.grid('getSelectedRecords')[0])
        var column = this._ig$.interactiveGrid('option').config.columns.filter(function (column) {
          return column.staticId === self.options.itemName
        })[0]
        this._grid.view$.grid('gotoCell', recordId, column.name)
        this._grid.focus()
      }
      this._item$.focus();

      // Focus on next element if ENTER key used to select row.
      setTimeout(function () {
        if (self.options.returnOnEnterKey) {
          self.options.returnOnEnterKey = false;
          if (self.options.isPrevIndex) {
            self._focusPrevElement()
          } else {
            self._focusNextElement()
          }
        }
        self.options.isPrevIndex = false
      }, 100)
    },

    // Combination of number, char and space, arrow keys
    _validSearchKeys: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // numbers
      65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, // chars
      93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // numpad numbers
      40, // arrow down
      32, // spacebar
      8, // backspace
      106, 107, 109, 110, 111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 220 // interpunction
    ],

    // Keys to indicate completing input (esc, tab, enter)
    _validNextKeys: [9, 27, 13],

    _create: function () {
      var self = this

      self._item$ = $('#' + self.options.itemName)
      self._returnValue = self._item$.data('returnValue').toString()
      self._searchButton$ = $('#' + self.options.searchButton)
      self._clearInput$ = self._item$.parent().find('.fcs-search-clear')

      self._addCSSToTopLevel()

      // Trigger event on click input display field
      self._triggerLOVOnDisplay('000 - create')

      // Trigger event on click input group addon button (magnifier glass)
      self._triggerLOVOnButton()

      // Clear text when clear icon is clicked
      self._initClearInput()

      // Cascading LOV item actions
      self._initCascadingLOVs()

      // Init APEX pageitem functions
      self._initApexItem()
    },

    _onOpenDialog: function (modal, options) {
      var self = options.widget
      self._modalDialog$ = self._topApex.jQuery(modal)
      // Focus on search field in LOV
      self._topApex.jQuery('#' + self.options.searchField).focus()
      // Remove validation results
      self._removeValidation()
      // Add text from display field
      if (options.fillSearchText) {
        self._topApex.item(self.options.searchField).setValue(self._item$.val())
      }
      // Add class on hover
      self._onRowHover()
      // selectInitialRow
      self._selectInitialRow()
      // Set action when a row is selected
      self._onRowSelected()
      // Navigate on arrow keys trough LOV
      self._initKeyboardNavigation()
      // Set search action
      self._initSearch()
      // Set pagination actions
      self._initPagination()
    },

    _onCloseDialog: function (modal, options) {
      // close takes place when no record has been selected, instead the close modal (or esc) was clicked/ pressed
      // It could mean two things: keep current or take the user's display value
      // What about two equal display values?

      // But no record selection could mean cancel
      // but open modal and forget about it
      // in the end, this should keep things intact as they were
      options.widget._destroy(modal)
      this._setItemValues(options.widget._returnValue);
      options.widget._triggerLOVOnDisplay('009 - close dialog')
    },

    _initGridConfig: function () {
      this._ig$ = this._item$.closest('.a-IG')

      if (this._ig$.length > 0) {
        this._grid = this._ig$.interactiveGrid('getViews').grid
      }
    },

    _onLoad: function (options) {
      var self = options.widget

      self._initGridConfig()

      // Create LOV region
      var $modalRegion = self._topApex.jQuery(modalReportTemplate(self._templateData)).appendTo('body')

      // Open new modal
      $modalRegion.dialog({
        height: (self.options.rowCount * 33) + 199, // + dialog button height
        width: self.options.modalWidth,
        closeText: apex.lang.getMessage('APEX.DIALOG.CLOSE'),
        draggable: true,
        modal: true,
        resizable: true,
        closeOnEscape: true,
        dialogClass: 'ui-dialog--apex ',
        open: function (modal) {
          // remove opener because it makes the page scroll down for IG
          self._topApex.jQuery(this).data('uiDialog').opener = self._topApex.jQuery()
          self._topApex.navigation.beginFreezeScroll()
          self._onOpenDialog(this, options)
        },
        beforeClose: function () {
          self._onCloseDialog(this, options)
          // Prevent scrolling down on modal close
          if (document.activeElement) {
            // document.activeElement.blur()
          }
        },
        close: function () {
          self._topApex.navigation.endFreezeScroll()
          self._resetFocus()
        }
      })
    },

    _onReload: function () {
      var self = this
      // This function is executed after a search
      var reportHtml = Handlebars.partials.report(self._templateData)
      var paginationHtml = Handlebars.partials.pagination(self._templateData)

      // Get current modal-lov table
      var modalLOVTable = self._modalDialog$.find('.modal-lov-table')
      var pagination = self._modalDialog$.find('.t-ButtonRegion-wrap')

      // Replace report with new data
      $(modalLOVTable).replaceWith(reportHtml)
      $(pagination).html(paginationHtml)

      // selectInitialRow in new modal-lov table
      self._selectInitialRow()

      // Make the enter key do something again
      self._activeDelay = false
    },

    _unescape: function (val) {
      return val // $('<input value="' + val + '"/>').val()
    },

    _getTemplateData: function () {
      var self = this

      // Create return Object
      var templateData = {
        id: self.options.id,
        classes: 'modal-lov',
        title: self.options.title,
        modalSize: self.options.modalSize,
        region: {
          attributes: 'style="bottom: 66px;"'
        },
        searchField: {
          id: self.options.searchField,
          placeholder: self.options.searchPlaceholder,
          textCase: self.options.textCase === 'U' ? 'u-textUpper' : self.options.textCase === 'L' ? 'u-textLower' : '',
        },
        report: {
          columns: {},
          rows: {},
          colCount: 0,
          rowCount: 0,
          showHeaders: self.options.showHeaders,
          noDataFound: self.options.noDataFound,
          classes: (self.options.allowMultilineRows) ? 'multiline' : '',
        },
        pagination: {
          rowCount: 0,
          firstRow: 0,
          lastRow: 0,
          allowPrev: false,
          allowNext: false,
          previous: self.options.previousLabel,
          next: self.options.nextLabel,
        },
      }

      // No rows found?
      if (self.options.dataSource.row.length === 0) {
        return templateData
      }

      // Get columns
      var columns = Object.keys(self.options.dataSource.row[0])

      // Pagination
      templateData.pagination.firstRow = self.options.dataSource.row[0]['ROWNUM###']
      templateData.pagination.lastRow = self.options.dataSource.row[self.options.dataSource.row.length - 1]['ROWNUM###']

      // Check if there is a next resultset
      var nextRow = self.options.dataSource.row[self.options.dataSource.row.length - 1]['NEXTROW###']

      // Allow previous button?
      if (templateData.pagination.firstRow > 1) {
        templateData.pagination.allowPrev = true
      }

      // Allow next button?
      try {
        if (nextRow.toString().length > 0) {
          templateData.pagination.allowNext = true
        }
      } catch (err) {
        templateData.pagination.allowNext = false
      }

      // Remove internal columns (ROWNUM###, ...)
      columns.splice(columns.indexOf('ROWNUM###'), 1)
      columns.splice(columns.indexOf('NEXTROW###'), 1)

      // Remove column return-item
      columns.splice(columns.indexOf(self.options.returnCol), 1)
      // Remove column return-display if display columns are provided
      if (columns.length > 1) {
        columns.splice(columns.indexOf(self.options.displayCol), 1)
      }

      templateData.report.colCount = columns.length

      // Rename columns to standard names like column0, column1, ..
      var column = {}
      $.each(columns, function (key, val) {
        if (columns.length === 1 && self.options.itemLabel) {
          column['column' + key] = {
            name: val,
            label: self.options.itemLabel
          }
        } else {
          column['column' + key] = {
            name: val
          }
        }
        templateData.report.columns = $.extend(templateData.report.columns, column)
      })

      /* Get rows

        format will be like this:

        rows = [{column0: "a", column1: "b"}, {column0: "c", column1: "d"}]

      */
      var tmpRow

      var rows = $.map(self.options.dataSource.row, function (row, rowKey) {
        tmpRow = {
          columns: {}
        }
        // add column values to row
        $.each(templateData.report.columns, function (colId, col) {
          tmpRow.columns[colId] = self._unescape(row[col.name])
        })
        // add metadata to row
        tmpRow.returnVal = row[self.options.returnCol]
        tmpRow.displayVal = row[self.options.displayCol]
        return tmpRow
      })

      templateData.report.rows = rows

      templateData.report.rowCount = (rows.length === 0 ? false : rows.length)
      templateData.pagination.rowCount = templateData.report.rowCount

      return templateData
    },

    _destroy: function (modal) {
      var self = this
      $(window.top.document).off('keydown')
      $(window.top.document).off('keyup', '#' + self.options.searchField)
      self._item$.off('keyup')
      self._modalDialog$.remove()
      self._topApex.navigation.endFreezeScroll()
    },

    _getData: function (options, handler) {
      var self = this

      var settings = {
        searchTerm: '',
        firstRow: 1,
        fillSearchText: true
      }

      settings = $.extend(settings, options)
      var searchTerm = (settings.searchTerm.length > 0) ? settings.searchTerm : self._topApex.item(self.options.searchField).getValue()
      var items = [self.options.pageItemsToSubmit, self.options.cascadingItems]
        .filter(function (selector) {
          return (selector)
        })
        .join(',')

      // Store last searchTerm
      self._lastSearchTerm = searchTerm

      apex.server.plugin(self.options.ajaxIdentifier, {
        x01: 'GET_DATA',
        x02: searchTerm, // searchterm
        x03: settings.firstRow, // first rownum to return
        pageItems: items
      }, {
        target: self._item$,
        dataType: 'json',
        loadingIndicator: $.proxy(options.loadingIndicator, self),
        success: function (pData) {
          self.options.dataSource = pData
          self._templateData = self._getTemplateData()
          handler({
            widget: self,
            fillSearchText: settings.fillSearchText
          })
        }
      })
    },

    _initSearch: function () {
      var self = this
      // if the lastSearchTerm is not equal to the current searchTerm, then search immediate
      if (self._lastSearchTerm !== self._topApex.item(self.options.searchField).getValue()) {
        self._getData({
          firstRow: 1,
          loadingIndicator: self._modalLoadingIndicator
        }, function () {
          self._onReload()
        })
      }

      // Action when user inputs search text
      $(window.top.document).on('keyup', '#' + self.options.searchField, function (event) {
        // Do nothing for navigation keys, escape and enter
        var navigationKeys = [37, 38, 39, 40, 9, 33, 34, 27, 13]
        if ($.inArray(event.keyCode, navigationKeys) > -1) {
          return false
        }

        // Stop the enter key from selecting a row
        self._activeDelay = true

        // Don't search on all key events but add a delay for performance
        var srcEl = event.currentTarget
        if (srcEl.delayTimer) {
          clearTimeout(srcEl.delayTimer)
        }

        srcEl.delayTimer = setTimeout(function () {
          self._getData({
            firstRow: 1,
            loadingIndicator: self._modalLoadingIndicator
          }, function () {
            self._onReload()
          })
        }, 350)
      })
    },

    _initPagination: function () {
      var self = this
      var prevSelector = '#' + self.options.id + ' .t-Report-paginationLink--prev'
      var nextSelector = '#' + self.options.id + ' .t-Report-paginationLink--next'

      // remove current listeners
      self._topApex.jQuery(window.top.document).off('click', prevSelector)
      self._topApex.jQuery(window.top.document).off('click', nextSelector)

      // Previous set
      self._topApex.jQuery(window.top.document).on('click', prevSelector, function (e) {
        self._getData({
          firstRow: self._getFirstRownumPrevSet(),
          loadingIndicator: self._modalLoadingIndicator
        }, function () {
          self._onReload()
        })
      })

      // Next set
      self._topApex.jQuery(window.top.document).on('click', nextSelector, function (e) {
        self._getData({
          firstRow: self._getFirstRownumNextSet(),
          loadingIndicator: self._modalLoadingIndicator
        }, function () {
          self._onReload()
        })
      })
    },

    _getFirstRownumPrevSet: function () {
      var self = this
      try {
        return self._templateData.pagination.firstRow - self.options.rowCount
      } catch (err) {
        return 1
      }
    },

    _getFirstRownumNextSet: function () {
      var self = this
      try {
        return self._templateData.pagination.lastRow + 1
      } catch (err) {
        return 16
      }
    },

    _openLOV: function (options) {
      var self = this
      // Remove previous modal-lov region
      $('#' + self.options.id, document).remove()

      self._getData({
        firstRow: 1,
        searchTerm: options.searchTerm,
        fillSearchText: options.fillSearchText,
        // loadingIndicator: self._itemLoadingIndicator
      }, options.afterData)
    },

    _addCSSToTopLevel: function () {
      var self = this
      // CSS file is always present when the current window is the top window, so do nothing
      if (window === window.top) {
        return
      }
      var cssSelector = 'link[rel="stylesheet"][href*="modal-lov"]'

      // Check if file exists in top window
      if (self._topApex.jQuery(cssSelector).length === 0) {
        self._topApex.jQuery('head').append($(cssSelector).clone())
      }
    },

    // Function based on https://stackoverflow.com/a/35173443
    _focusNextElement: function () {
      //add all elements we want to include in our selection
      var focusableElements = [
        'a:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'button:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'input:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'textarea:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'select:not([disabled]):not([hidden]):not([tabindex="-1"])',
        '[tabindex]:not([disabled]):not([tabindex="-1"])',
      ].join(', ');
      if (document.activeElement && document.activeElement.form) {
        var focusable = Array.prototype.filter.call(document.activeElement.form.querySelectorAll(focusableElements),
          function (element) {
            //check for visibility while always include the current activeElement
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
          });
        var index = focusable.indexOf(document.activeElement);
        if (index > -1) {
          var nextElement = focusable[index + 1] || focusable[0];
          apex.debug.trace('FCS LOV - focus next');
          nextElement.focus();
        }
      }
    },

    // Function based on https://stackoverflow.com/a/35173443
    _focusPrevElement: function () {
      //add all elements we want to include in our selection
      var focusableElements = [
        'a:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'button:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'input:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'textarea:not([disabled]):not([hidden]):not([tabindex="-1"])',
        'select:not([disabled]):not([hidden]):not([tabindex="-1"])',
        '[tabindex]:not([disabled]):not([tabindex="-1"])',
      ].join(', ');
      if (document.activeElement && document.activeElement.form) {
        var focusable = Array.prototype.filter.call(document.activeElement.form.querySelectorAll(focusableElements),
          function (element) {
            //check for visibility while always include the current activeElement
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
          });
        var index = focusable.indexOf(document.activeElement);
        if (index > -1) {
          var prevElement = focusable[index - 1] || focusable[0];
          apex.debug.trace('FCS LOV - focus previous');
          prevElement.focus();
        }
      }
    },

    _setItemValues: function (returnValue) {
      var self = this;
      var reportRow;
      if (self._templateData.report?.rows?.length) {
        reportRow = self._templateData.report.rows.find(row => row.returnVal === returnValue);
      }

      apex.item(self.options.itemName).setValue(reportRow?.returnVal || '', reportRow?.displayVal || '');

      if (self.options.additionalOutputsStr) {
        self._initGridConfig()

        var dataRow = self.options.dataSource?.row?.find(row => row[self.options.returnCol] === returnValue);

        self.options.additionalOutputsStr.split(',').forEach(str => {
          var dataKey = str.split(':')[0];
          var itemId = str.split(':')[1];
          var column;
          if (self._grid) {
            column = self._grid.getColumns()?.find(col => itemId?.includes(col.property))
          }
          var additionalItem = apex.item(column ? column.elementId : itemId);

          if (itemId && dataKey && additionalItem) {
            const key = Object.keys(dataRow || {}).find(k => k.toUpperCase() === dataKey);
            if (dataRow && dataRow[key]) {
              additionalItem.setValue(dataRow[key], dataRow[key]);
            } else {
              additionalItem.setValue('', '');
            }
          }
        });
      }
    },

    _triggerLOVOnDisplay: function (calledFrom = null) {
      var self = this

      if (calledFrom) {
        apex.debug.trace('_triggerLOVOnDisplay called from "' + calledFrom + '"');
      }

      // Trigger event on click outside element
      $(document).mousedown(function (event) {
        self._item$.off('keydown')
        $(document).off('mousedown')

        var $target = $(event.target);

        if (!$target.closest('#' + self.options.itemName).length && !self._item$.is(":focus")) {
          self._triggerLOVOnDisplay('001 - not focused click off');
          return;
        }

        if ($target.closest('#' + self.options.itemName).length) {
          self._triggerLOVOnDisplay('002 - click on input');
          return;
        }

        if ($target.closest('#' + self.options.searchButton).length) {
          self._triggerLOVOnDisplay('003 - click on search: ' + self._item$.val());
          return;
        }

        if ($target.closest('.fcs-search-clear').length) {
          self._triggerLOVOnDisplay('004 - click on clear');
          return;
        }

        if (!self._item$.val()) {
          self._triggerLOVOnDisplay('005 - no items');
          return;
        }

        if (self._item$.val().toUpperCase() === apex.item(self.options.itemName).getValue().toUpperCase()) {
          self._triggerLOVOnDisplay('010 - click no change')
          return;
        }

        // console.log('click off - check value')
        self._getData({
          searchTerm: self._item$.val(),
          firstRow: 1,
          // loadingIndicator: self._modalLoadingIndicator
        }, function () {
          if (self._templateData.pagination['rowCount'] === 1) {
            // 1 valid option matches the search. Use valid option.
            self._setItemValues(self._templateData.report.rows[0].returnVal);
            self._triggerLOVOnDisplay('006 - click off match found')
          } else {
            // Open the modal
            self._openLOV({
              searchTerm: self._item$.val(),
              fillSearchText: true,
              afterData: function (options) {
                self._onLoad(options)
                // Clear input as soon as modal is ready
                self._returnValue = ''
                self._item$.val('')
              }
            })
          }
        })
      });

      // Trigger event on tab or enter
      self._item$.on('keydown', function (e) {
        self._item$.off('keydown')
        $(document).off('mousedown')

        // console.log('keydown', e.keyCode)

        if ((e.keyCode === 9 && !!self._item$.val()) || e.keyCode === 13) {
          // Stop tab event
          if (e.keyCode === 9) {
            e.preventDefault()
            if (e.shiftKey) {
              self.options.isPrevIndex = true
            }
          }

          if (self._item$.val().toUpperCase() === apex.item(self.options.itemName).getValue().toUpperCase()) {
            if (self.options.isPrevIndex) {
              self.options.isPrevIndex = false
              self._focusPrevElement()
            } else if (e.keyCode !== 13) {
              self._focusNextElement()
            }
            self._triggerLOVOnDisplay('011 - key no change')
            return;
          }

          if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
          }

          // console.log('keydown tab or enter - check value')
          self._getData({
            searchTerm: self._item$.val(),
            firstRow: 1,
            // loadingIndicator: self._modalLoadingIndicator
          }, function () {
            if (self._templateData.pagination['rowCount'] === 1) {
              // 1 valid option matches the search. Use valid option.
              self._setItemValues(self._templateData.report.rows[0].returnVal);
              self._resetFocus();
              if (self.options.isPrevIndex) {
                self.options.isPrevIndex = false;
                self._focusPrevElement();
              } else {
                self._focusNextElement();
              }
              self._triggerLOVOnDisplay('007 - key off match found');
            } else {
              // Open the modal
              self._openLOV({
                searchTerm: self._item$.val(),
                fillSearchText: true,
                afterData: function (options) {
                  self._onLoad(options)
                  // Clear input as soon as modal is ready
                  self._returnValue = ''
                  self._item$.val('')
                }
              })
            }
          })
        } else {
          self._triggerLOVOnDisplay('008 - key down')
        }
      })
    },

    _triggerLOVOnButton: function () {
      var self = this
      // Trigger event on click input group addon button (magnifier glass)
      self._searchButton$.on('click', function (e) {
        self._openLOV({
          searchTerm: self._item$.val() || '',
          fillSearchText: true,
          afterData: function (options) {
            self._onLoad(options)
            // Clear input as soon as modal is ready
            self._returnValue = ''
            self._item$.val('')
          }
        })
      })
    },

    _onRowHover: function () {
      var self = this
      self._modalDialog$.on('mouseenter mouseleave', '.t-Report-report tbody tr', function () {
        if ($(this).hasClass('mark')) {
          return
        }
        $(this).toggleClass(self.options.hoverClasses)
      })
    },

    _selectInitialRow: function () {
      var self = this
      // If current item in LOV then select that row
      // Else select first row of report
      var $curRow = self._modalDialog$.find('.t-Report-report tr[data-return="' + self._returnValue + '"]')
      if ($curRow.length > 0) {
        $curRow.addClass('mark ' + self.options.markClasses)
      } else {
        self._modalDialog$.find('.t-Report-report tr[data-return]').first().addClass('mark ' + self.options.markClasses)
      }
    },

    _initKeyboardNavigation: function () {
      var self = this

      function navigate(direction, event) {
        event.stopImmediatePropagation()
        event.preventDefault()
        var currentRow = self._modalDialog$.find('.t-Report-report tr.mark')
        switch (direction) {
          case 'up':
            if ($(currentRow).prev().is('.t-Report-report tr')) {
              $(currentRow).removeClass('mark ' + self.options.markClasses).prev().addClass('mark ' + self.options.markClasses)
            }
            break
          case 'down':
            if ($(currentRow).next().is('.t-Report-report tr')) {
              $(currentRow).removeClass('mark ' + self.options.markClasses).next().addClass('mark ' + self.options.markClasses)
            }
            break
        }
      }

      $(window.top.document).on('keydown', function (e) {
        switch (e.keyCode) {
          case 38: // up
            navigate('up', e)
            break
          case 40: // down
            navigate('down', e)
            break
          case 9: // tab
            navigate('down', e)
            break
          case 13: // ENTER
            if (!self._activeDelay) {
              var currentRow = self._modalDialog$.find('.t-Report-report tr.mark').first()
              self._returnSelectedRow(currentRow)
              self.options.returnOnEnterKey = true
            }
            break
          case 33: // Page up
            e.preventDefault()
            self._topApex.jQuery('#' + self.options.id + ' .t-ButtonRegion-buttons .t-Report-paginationLink--prev').trigger('click')
            break
          case 34: // Page down
            e.preventDefault()
            self._topApex.jQuery('#' + self.options.id + ' .t-ButtonRegion-buttons .t-Report-paginationLink--next').trigger('click')
            break
        }
      })
    },

    _returnSelectedRow: function ($row) {
      var self = this

      // Do nothing if row does not exist
      if (!$row || $row.length === 0) {
        return
      }

      apex.item(self.options.itemName).setValue(self._unescape($row.data('return').toString()), self._unescape($row.data('display')))


      // Trigger a custom event and add data to it: all columns of the row
      var data = {}
      $.each($('.t-Report-report tr.mark').find('td'), function (key, val) {
        data[$(val).attr('headers')] = $(val).html()
      })

      // Finally hide the modal
      self._modalDialog$.dialog('close')
    },

    _onRowSelected: function () {
      var self = this
      // Action when row is clicked
      self._modalDialog$.on('click', '.modal-lov-table .t-Report-report tbody tr', function (e) {
        self._returnSelectedRow(self._topApex.jQuery(this))
      })
    },

    _removeValidation: function () {
      // Clear current errors
      apex.message.clearErrors(this.options.itemName)
    },

    _clearInput: function () {
      var self = this
      self._setItemValues('')
      self._returnValue = ''
      self._removeValidation()
      self._item$.focus()
    },

    _initClearInput: function () {
      var self = this

      self._clearInput$.on('click', function () {
        self._clearInput()
      })
    },

    _initCascadingLOVs: function () {
      var self = this
      $(self.options.cascadingItems).on('change', function () {
        self._clearInput()
      })
    },

    _setValueBasedOnDisplay: function (pValue) {
      var self = this

      var promise = apex.server.plugin(self.options.ajaxIdentifier, {
        x01: 'GET_VALUE',
        x02: pValue // returnVal
      }, {
        dataType: 'json',
        loadingIndicator: $.proxy(self._itemLoadingIndicator, self),
        success: function (pData) {
          self._disableChangeEvent = false
          self._returnValue = pData.returnValue
          self._item$.val(pData.displayValue)
          self._item$.trigger('change')
        }
      })

      promise
        .done(function (pData) {
          self._returnValue = pData.returnValue
          self._item$.val(pData.displayValue)
          self._item$.trigger('change')
        })
        .always(function () {
          self._disableChangeEvent = false
        })
    },

    _initApexItem: function () {
      var self = this
      // Set and get value via apex functions
      apex.item.create(self.options.itemName, {
        enable: function () {
          self._item$.prop('disabled', false)
          self._searchButton$.prop('disabled', false)
          self._clearInput$.show()
        },
        disable: function () {
          self._item$.prop('disabled', true)
          self._searchButton$.prop('disabled', true)
          self._clearInput$.hide()
        },
        isDisabled: function () {
          return self._item$.prop('disabled')
        },
        show: function () {
          self._item$.show()
          self._searchButton$.show()
        },
        hide: function () {
          self._item$.hide()
          self._searchButton$.hide()
        },

        setValue: function (pValue, pDisplayValue, pSuppressChangeEvent) {
          if (pDisplayValue || !pValue || pValue.length === 0) {
            // Assuming no check is needed to see if the value is in the LOV
            self._item$.val(pDisplayValue)
            self._returnValue = pValue
          } else {
            self._item$.val(pDisplayValue)
            self._disableChangeEvent = true
            self._setValueBasedOnDisplay(pValue)
          }
        },
        getValue: function () {
          // Always return at least an empty string
          return self._returnValue || ''
        },
        isChanged: function () {
          return document.getElementById(self.options.itemName).value !== document.getElementById(self.options.itemName).defaultValue
        }
      })
      // Original JS for use before APEX 20.2
      // apex.item(self.options.itemName).callbacks.displayValueFor = function () {
      //   return self._item$.val()
      // }
      // New JS for post APEX 20.2 world
      apex.item(self.options.itemName).displayValueFor = function () {
        return self._item$.val()
      }

      // Only trigger the change event after the Async callback if needed
      self._item$['trigger'] = function (type, data) {
        if (type === 'change' && self._disableChangeEvent) {
          return
        }
        $.fn.trigger.call(self._item$, type, data)
      }
    },

    _itemLoadingIndicator: function (loadingIndicator) {
      $('#' + this.options.searchButton).after(loadingIndicator)
      return loadingIndicator
    },

    _modalLoadingIndicator: function (loadingIndicator) {
      this._modalDialog$.prepend(loadingIndicator)
      return loadingIndicator
    }
  })
})(apex.jQuery, window)

},{"./templates/modal-report.hbs":24,"./templates/partials/_pagination.hbs":25,"./templates/partials/_report.hbs":26,"./templates/partials/_rows.hbs":27,"hbsfy/runtime":22}],24:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":15}}}) : helper)))
    + "\" class=\"t-DialogRegion js-regieonDialog t-Form--stretchInputs t-Form--large modal-lov\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":1,"column":110},"end":{"line":1,"column":119}}}) : helper)))
    + "\">\n    <div class=\"t-DialogRegion-body js-regionDialog-body no-padding\" "
    + ((stack1 = alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"region") : depth0)) != null ? lookupProperty(stack1,"attributes") : stack1), depth0)) != null ? stack1 : "")
    + ">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col col-12\">\n                    <div class=\"t-Report t-Report--altRowsDefault\">\n                        <div class=\"t-Report-wrap\" style=\"width: 100%\">\n                            <div class=\"t-Form-fieldContainer t-Form-fieldContainer--stacked t-Form-fieldContainer--stretchInputs margin-top-sm\" id=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"searchField") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "_CONTAINER\">\n                                <div class=\"t-Form-inputContainer\">\n                                    <div class=\"t-Form-itemWrapper\">\n                                        <input type=\"text\" class=\"apex-item-text modal-lov-item "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"searchField") : depth0)) != null ? lookupProperty(stack1,"textCase") : stack1), depth0))
    + " \" id=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"searchField") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "\" autocomplete=\"off\" placeholder=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"searchField") : depth0)) != null ? lookupProperty(stack1,"placeholder") : stack1), depth0))
    + "\">\n                                        <button type=\"button\" id=\"P1110_ZAAL_FK_CODE_BUTTON\" class=\"a-Button fcs-modal-lov-button a-Button--popupLOV\" tabIndex=\"-1\" style=\"margin-left:-40px;transform:translateX(0);\" disabled>\n                                            <span class=\"fa fa-search\" aria-hidden=\"true\"></span>\n                                        </button>\n                                    </div>\n                                </div>\n                            </div>\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"report"),depth0,{"name":"report","data":data,"indent":"                            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"t-DialogRegion-buttons js-regionDialog-buttons\">\n        <div class=\"t-ButtonRegion t-ButtonRegion--dialogRegion\">\n            <div class=\"t-ButtonRegion-wrap\">\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pagination"),depth0,{"name":"pagination","data":data,"indent":"                ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n</div>";
},"usePartial":true,"useData":true});

},{"hbsfy/runtime":22}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.lambda, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"t-ButtonRegion-col t-ButtonRegion-col--left\">\n    <div class=\"t-ButtonRegion-buttons\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"allowPrev") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":6},"end":{"line":8,"column":13}}})) != null ? stack1 : "")
    + "    </div>\n</div>\n<div class=\"t-ButtonRegion-col t-ButtonRegion-col--center\" style=\"text-align: center;\">\n  "
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"firstRow") : stack1), depth0))
    + " - "
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"lastRow") : stack1), depth0))
    + "\n</div>\n<div class=\"t-ButtonRegion-col t-ButtonRegion-col--right\">\n    <div class=\"t-ButtonRegion-buttons\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"allowNext") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":6},"end":{"line":20,"column":13}}})) != null ? stack1 : "")
    + "    </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <a href=\"javascript:void(0);\" class=\"t-Button t-Button--small t-Button--noUI t-Report-paginationLink t-Report-paginationLink--prev\">\n          <span class=\"a-Icon icon-left-arrow\"></span>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"previous") : stack1), depth0))
    + "\n        </a>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <a href=\"javascript:void(0);\" class=\"t-Button t-Button--small t-Button--noUI t-Report-paginationLink t-Report-paginationLink--next\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"next") : stack1), depth0))
    + "\n          <span class=\"a-Icon icon-right-arrow\"></span>\n        </a>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"pagination") : depth0)) != null ? lookupProperty(stack1,"rowCount") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":7}}})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":22}],26:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "            <table cellpadding=\"0\" border=\"0\" cellspacing=\"0\" summary=\"\" class=\"t-Report-report "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? lookupProperty(stack1,"classes") : stack1), depth0))
    + "\" width=\"100%\">\n              <tbody>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? lookupProperty(stack1,"showHeaders") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":16},"end":{"line":24,"column":23}}})) != null ? stack1 : "");
  stack1 = ((helper = (helper = lookupProperty(helpers,"report") || (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"report","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":16},"end":{"line":28,"column":27}}}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"report")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "              </tbody>\n            </table>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                  <thead>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? lookupProperty(stack1,"columns") : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":20},"end":{"line":22,"column":29}}})) != null ? stack1 : "")
    + "                  </thead>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                      <th class=\"t-Report-colHead\" id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":15,"column":55},"end":{"line":15,"column":63}}}) : helper)))
    + "\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"label") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":16,"column":24},"end":{"line":20,"column":31}}})) != null ? stack1 : "")
    + "                      </th>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                          "
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"label") : depth0), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                          "
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"rows"),depth0,{"name":"rows","data":data,"indent":"                  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <span class=\"nodatafound\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? lookupProperty(stack1,"noDataFound") : stack1), depth0))
    + "</span>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"t-Report-tableWrap modal-lov-table\">\n  <table cellpadding=\"0\" border=\"0\" cellspacing=\"0\" class=\"\" width=\"100%\">\n    <tbody>\n      <tr>\n        <td></td>\n      </tr>\n      <tr>\n        <td>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? lookupProperty(stack1,"rowCount") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":10},"end":{"line":31,"column":17}}})) != null ? stack1 : "")
    + "        </td>\n      </tr>\n    </tbody>\n  </table>\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"report") : depth0)) != null ? lookupProperty(stack1,"rowCount") : stack1),{"name":"unless","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":2},"end":{"line":38,"column":13}}})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});

},{"hbsfy/runtime":22}],27:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <tr data-return=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"returnVal") : depth0), depth0))
    + "\" data-display=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"displayVal") : depth0), depth0))
    + "\" class=\"pointer\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"columns") : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":5,"column":13}}})) != null ? stack1 : "")
    + "  </tr>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <td headers=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data,"loc":{"start":{"line":4,"column":19},"end":{"line":4,"column":27}}}) : helper)))
    + "\" class=\"t-Report-cell\">"
    + alias1(container.lambda(depth0, depth0))
    + "</td>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":9}}})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":22}]},{},[23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvYmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9kZWNvcmF0b3JzL2lubGluZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2Jsb2NrLWhlbHBlci1taXNzaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9oZWxwZXJzL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2lmLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9sb2cuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2xvb2t1cC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL2NyZWF0ZS1uZXctbG9va3VwLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL3Byb3RvLWFjY2Vzcy5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL3dyYXBIZWxwZXIuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9sb2dnZXIuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyIsInNyYy9qcy9mY3MtbW9kYWwtbG92LmpzIiwic3JjL2pzL3RlbXBsYXRlcy9tb2RhbC1yZXBvcnQuaGJzIiwic3JjL2pzL3RlbXBsYXRlcy9wYXJ0aWFscy9fcGFnaW5hdGlvbi5oYnMiLCJzcmMvanMvdGVtcGxhdGVzL3BhcnRpYWxzL19yZXBvcnQuaGJzIiwic3JjL2pzL3RlbXBsYXRlcy9wYXJ0aWFscy9fcm93cy5oYnMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs4QkNBc0IsbUJBQW1COztJQUE3QixJQUFJOzs7OztvQ0FJTywwQkFBMEI7Ozs7bUNBQzNCLHdCQUF3Qjs7OzsrQkFDdkIsb0JBQW9COztJQUEvQixLQUFLOztpQ0FDUSxzQkFBc0I7O0lBQW5DLE9BQU87O29DQUVJLDBCQUEwQjs7Ozs7QUFHakQsU0FBUyxNQUFNLEdBQUc7QUFDaEIsTUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMStCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4vaGFuZGxlYmFycy9iYXNlJztcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbmltcG9ydCBTYWZlU3RyaW5nIGZyb20gJy4vaGFuZGxlYmFycy9zYWZlLXN0cmluZyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vaGFuZGxlYmFycy9leGNlcHRpb24nO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9oYW5kbGViYXJzL3V0aWxzJztcbmltcG9ydCAqIGFzIHJ1bnRpbWUgZnJvbSAnLi9oYW5kbGViYXJzL3J1bnRpbWUnO1xuXG5pbXBvcnQgbm9Db25mbGljdCBmcm9tICcuL2hhbmRsZWJhcnMvbm8tY29uZmxpY3QnO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgbGV0IGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcbiAgaGIuZXNjYXBlRXhwcmVzc2lvbiA9IFV0aWxzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufVxuXG5sZXQgaW5zdCA9IGNyZWF0ZSgpO1xuaW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cbm5vQ29uZmxpY3QoaW5zdCk7XG5cbmluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3Q7XG4iLCJpbXBvcnQgeyBjcmVhdGVGcmFtZSwgZXh0ZW5kLCB0b1N0cmluZyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2V4Y2VwdGlvbic7XG5pbXBvcnQgeyByZWdpc3RlckRlZmF1bHRIZWxwZXJzIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7IHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnMgfSBmcm9tICcuL2RlY29yYXRvcnMnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyByZXNldExvZ2dlZFByb3BlcnRpZXMgfSBmcm9tICcuL2ludGVybmFsL3Byb3RvLWFjY2Vzcyc7XG5cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzQuNy43JztcbmV4cG9ydCBjb25zdCBDT01QSUxFUl9SRVZJU0lPTiA9IDg7XG5leHBvcnQgY29uc3QgTEFTVF9DT01QQVRJQkxFX0NPTVBJTEVSX1JFVklTSU9OID0gNztcblxuZXhwb3J0IGNvbnN0IFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPT0gMS54LngnLFxuICA1OiAnPT0gMi4wLjAtYWxwaGEueCcsXG4gIDY6ICc+PSAyLjAuMC1iZXRhLjEnLFxuICA3OiAnPj0gNC4wLjAgPDQuMy4wJyxcbiAgODogJz49IDQuMy4wJ1xufTtcblxuY29uc3Qgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5leHBvcnQgZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzLCBkZWNvcmF0b3JzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcbiAgdGhpcy5kZWNvcmF0b3JzID0gZGVjb3JhdG9ycyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xuICByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKHRoaXMpO1xufVxuXG5IYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZ2dlci5sb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChmbikge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTtcbiAgICAgIH1cbiAgICAgIGV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5oZWxwZXJzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgcGFydGlhbCkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBleHRlbmQodGhpcy5wYXJ0aWFscywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgcGFydGlhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcbiAgICAgICAgICBgQXR0ZW1wdGluZyB0byByZWdpc3RlciBhIHBhcnRpYWwgY2FsbGVkIFwiJHtuYW1lfVwiIGFzIHVuZGVmaW5lZGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBwYXJ0aWFsO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5wYXJ0aWFsc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgZGVjb3JhdG9ycycpO1xuICAgICAgfVxuICAgICAgZXh0ZW5kKHRoaXMuZGVjb3JhdG9ycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVjb3JhdG9yc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRvcnNbbmFtZV07XG4gIH0sXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbWVtb3J5IG9mIGlsbGVnYWwgcHJvcGVydHkgYWNjZXNzZXMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiBsb2dnZWQuXG4gICAqIEBkZXByZWNhdGVkIHNob3VsZCBvbmx5IGJlIHVzZWQgaW4gaGFuZGxlYmFycyB0ZXN0LWNhc2VzXG4gICAqL1xuICByZXNldExvZ2dlZFByb3BlcnR5QWNjZXNzZXMoKSB7XG4gICAgcmVzZXRMb2dnZWRQcm9wZXJ0aWVzKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBsZXQgbG9nID0gbG9nZ2VyLmxvZztcblxuZXhwb3J0IHsgY3JlYXRlRnJhbWUsIGxvZ2dlciB9O1xuIiwiaW1wb3J0IHJlZ2lzdGVySW5saW5lIGZyb20gJy4vZGVjb3JhdG9ycy9pbmxpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyhpbnN0YW5jZSkge1xuICByZWdpc3RlcklubGluZShpbnN0YW5jZSk7XG59XG4iLCJpbXBvcnQgeyBleHRlbmQgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVyRGVjb3JhdG9yKCdpbmxpbmUnLCBmdW5jdGlvbihmbiwgcHJvcHMsIGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgIGxldCByZXQgPSBmbjtcbiAgICBpZiAoIXByb3BzLnBhcnRpYWxzKSB7XG4gICAgICBwcm9wcy5wYXJ0aWFscyA9IHt9O1xuICAgICAgcmV0ID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcGFydGlhbHMgc3RhY2sgZnJhbWUgcHJpb3IgdG8gZXhlYy5cbiAgICAgICAgbGV0IG9yaWdpbmFsID0gY29udGFpbmVyLnBhcnRpYWxzO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBleHRlbmQoe30sIG9yaWdpbmFsLCBwcm9wcy5wYXJ0aWFscyk7XG4gICAgICAgIGxldCByZXQgPSBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3JpZ2luYWw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHByb3BzLnBhcnRpYWxzW29wdGlvbnMuYXJnc1swXV0gPSBvcHRpb25zLmZuO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG4iLCJjb25zdCBlcnJvclByb3BzID0gW1xuICAnZGVzY3JpcHRpb24nLFxuICAnZmlsZU5hbWUnLFxuICAnbGluZU51bWJlcicsXG4gICdlbmRMaW5lTnVtYmVyJyxcbiAgJ21lc3NhZ2UnLFxuICAnbmFtZScsXG4gICdudW1iZXInLFxuICAnc3RhY2snXG5dO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICBsZXQgbG9jID0gbm9kZSAmJiBub2RlLmxvYyxcbiAgICBsaW5lLFxuICAgIGVuZExpbmVOdW1iZXIsXG4gICAgY29sdW1uLFxuICAgIGVuZENvbHVtbjtcblxuICBpZiAobG9jKSB7XG4gICAgbGluZSA9IGxvYy5zdGFydC5saW5lO1xuICAgIGVuZExpbmVOdW1iZXIgPSBsb2MuZW5kLmxpbmU7XG4gICAgY29sdW1uID0gbG9jLnN0YXJ0LmNvbHVtbjtcbiAgICBlbmRDb2x1bW4gPSBsb2MuZW5kLmNvbHVtbjtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgY29sdW1uO1xuICB9XG5cbiAgbGV0IHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEV4Y2VwdGlvbik7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChsb2MpIHtcbiAgICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgICB0aGlzLmVuZExpbmVOdW1iZXIgPSBlbmRMaW5lTnVtYmVyO1xuXG4gICAgICAvLyBXb3JrIGFyb3VuZCBpc3N1ZSB1bmRlciBzYWZhcmkgd2hlcmUgd2UgY2FuJ3QgZGlyZWN0bHkgc2V0IHRoZSBjb2x1bW4gdmFsdWVcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29sdW1uJywge1xuICAgICAgICAgIHZhbHVlOiBjb2x1bW4sXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdlbmRDb2x1bW4nLCB7XG4gICAgICAgICAgdmFsdWU6IGVuZENvbHVtbixcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgICAgIHRoaXMuZW5kQ29sdW1uID0gZW5kQ29sdW1uO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAobm9wKSB7XG4gICAgLyogSWdub3JlIGlmIHRoZSBicm93c2VyIGlzIHZlcnkgcGFydGljdWxhciAqL1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0IGRlZmF1bHQgRXhjZXB0aW9uO1xuIiwiaW1wb3J0IHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9ibG9jay1oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJFYWNoIGZyb20gJy4vaGVscGVycy9lYWNoJztcbmltcG9ydCByZWdpc3RlckhlbHBlck1pc3NpbmcgZnJvbSAnLi9oZWxwZXJzL2hlbHBlci1taXNzaW5nJztcbmltcG9ydCByZWdpc3RlcklmIGZyb20gJy4vaGVscGVycy9pZic7XG5pbXBvcnQgcmVnaXN0ZXJMb2cgZnJvbSAnLi9oZWxwZXJzL2xvZyc7XG5pbXBvcnQgcmVnaXN0ZXJMb29rdXAgZnJvbSAnLi9oZWxwZXJzL2xvb2t1cCc7XG5pbXBvcnQgcmVnaXN0ZXJXaXRoIGZyb20gJy4vaGVscGVycy93aXRoJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgcmVnaXN0ZXJCbG9ja0hlbHBlck1pc3NpbmcoaW5zdGFuY2UpO1xuICByZWdpc3RlckVhY2goaW5zdGFuY2UpO1xuICByZWdpc3RlckhlbHBlck1pc3NpbmcoaW5zdGFuY2UpO1xuICByZWdpc3RlcklmKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb2coaW5zdGFuY2UpO1xuICByZWdpc3Rlckxvb2t1cChpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyV2l0aChpbnN0YW5jZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlSGVscGVyVG9Ib29rcyhpbnN0YW5jZSwgaGVscGVyTmFtZSwga2VlcEhlbHBlcikge1xuICBpZiAoaW5zdGFuY2UuaGVscGVyc1toZWxwZXJOYW1lXSkge1xuICAgIGluc3RhbmNlLmhvb2tzW2hlbHBlck5hbWVdID0gaW5zdGFuY2UuaGVscGVyc1toZWxwZXJOYW1lXTtcbiAgICBpZiAoIWtlZXBIZWxwZXIpIHtcbiAgICAgIGRlbGV0ZSBpbnN0YW5jZS5oZWxwZXJzW2hlbHBlck5hbWVdO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgYXBwZW5kQ29udGV4dFBhdGgsIGNyZWF0ZUZyYW1lLCBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGxldCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuICAgICAgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmlkcykge1xuICAgICAgICAgIG9wdGlvbnMuaWRzID0gW29wdGlvbnMubmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLFxuICAgICAgICAgIG9wdGlvbnMubmFtZVxuICAgICAgICApO1xuICAgICAgICBvcHRpb25zID0geyBkYXRhOiBkYXRhIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHtcbiAgYXBwZW5kQ29udGV4dFBhdGgsXG4gIGJsb2NrUGFyYW1zLFxuICBjcmVhdGVGcmFtZSxcbiAgaXNBcnJheSxcbiAgaXNGdW5jdGlvblxufSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignTXVzdCBwYXNzIGl0ZXJhdG9yIHRvICNlYWNoJyk7XG4gICAgfVxuXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbixcbiAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICBpID0gMCxcbiAgICAgIHJldCA9ICcnLFxuICAgICAgZGF0YSxcbiAgICAgIGNvbnRleHRQYXRoO1xuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuICAgICAgY29udGV4dFBhdGggPVxuICAgICAgICBhcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMuaWRzWzBdKSArICcuJztcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkge1xuICAgICAgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleGVjSXRlcmF0aW9uKGZpZWxkLCBpbmRleCwgbGFzdCkge1xuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZGF0YS5rZXkgPSBmaWVsZDtcbiAgICAgICAgZGF0YS5pbmRleCA9IGluZGV4O1xuICAgICAgICBkYXRhLmZpcnN0ID0gaW5kZXggPT09IDA7XG4gICAgICAgIGRhdGEubGFzdCA9ICEhbGFzdDtcblxuICAgICAgICBpZiAoY29udGV4dFBhdGgpIHtcbiAgICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gY29udGV4dFBhdGggKyBmaWVsZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXQgPVxuICAgICAgICByZXQgK1xuICAgICAgICBmbihjb250ZXh0W2ZpZWxkXSwge1xuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgYmxvY2tQYXJhbXM6IGJsb2NrUGFyYW1zKFxuICAgICAgICAgICAgW2NvbnRleHRbZmllbGRdLCBmaWVsZF0sXG4gICAgICAgICAgICBbY29udGV4dFBhdGggKyBmaWVsZCwgbnVsbF1cbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgaW4gY29udGV4dCkge1xuICAgICAgICAgICAgZXhlY0l0ZXJhdGlvbihpLCBpLCBpID09PSBjb250ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChnbG9iYWwuU3ltYm9sICYmIGNvbnRleHRbZ2xvYmFsLlN5bWJvbC5pdGVyYXRvcl0pIHtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dCA9IFtdO1xuICAgICAgICBjb25zdCBpdGVyYXRvciA9IGNvbnRleHRbZ2xvYmFsLlN5bWJvbC5pdGVyYXRvcl0oKTtcbiAgICAgICAgZm9yIChsZXQgaXQgPSBpdGVyYXRvci5uZXh0KCk7ICFpdC5kb25lOyBpdCA9IGl0ZXJhdG9yLm5leHQoKSkge1xuICAgICAgICAgIG5ld0NvbnRleHQucHVzaChpdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dCA9IG5ld0NvbnRleHQ7XG4gICAgICAgIGZvciAobGV0IGogPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgIGV4ZWNJdGVyYXRpb24oaSwgaSwgaSA9PT0gY29udGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByaW9yS2V5O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGNvbnRleHQpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAvLyB0aGUgbGFzdCBpdGVyYXRpb24gd2l0aG91dCBoYXZlIHRvIHNjYW4gdGhlIG9iamVjdCB0d2ljZSBhbmQgY3JlYXRlXG4gICAgICAgICAgLy8gYW4gaXRlcm1lZGlhdGUga2V5cyBhcnJheS5cbiAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaSAtIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGV4ZWNJdGVyYXRpb24ocHJpb3JLZXksIGkgLSAxLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpID09PSAwKSB7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xufVxuIiwiaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKC8qIFthcmdzLCBdb3B0aW9ucyAqLykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBBIG1pc3NpbmcgZmllbGQgaW4gYSB7e2Zvb319IGNvbnN0cnVjdC5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNvbWVvbmUgaXMgYWN0dWFsbHkgdHJ5aW5nIHRvIGNhbGwgc29tZXRoaW5nLCBibG93IHVwLlxuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcbiAgICAgICAgJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBpc0VtcHR5LCBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJyNpZiByZXF1aXJlcyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHtcbiAgICAgIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IGlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJyN1bmxlc3MgcmVxdWlyZXMgZXhhY3RseSBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge1xuICAgICAgZm46IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgIGludmVyc2U6IG9wdGlvbnMuZm4sXG4gICAgICBoYXNoOiBvcHRpb25zLmhhc2hcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oLyogbWVzc2FnZSwgb3B0aW9ucyAqLykge1xuICAgIGxldCBhcmdzID0gW3VuZGVmaW5lZF0sXG4gICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIGxldCBsZXZlbCA9IDE7XG4gICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG4gICAgfVxuICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuICAgIGluc3RhbmNlLmxvZyguLi5hcmdzKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24ob2JqLCBmaWVsZCwgb3B0aW9ucykge1xuICAgIGlmICghb2JqKSB7XG4gICAgICAvLyBOb3RlIGZvciA1LjA6IENoYW5nZSB0byBcIm9iaiA9PSBudWxsXCIgaW4gNS4wXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucy5sb29rdXBQcm9wZXJ0eShvYmosIGZpZWxkKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQge1xuICBhcHBlbmRDb250ZXh0UGF0aCxcbiAgYmxvY2tQYXJhbXMsXG4gIGNyZWF0ZUZyYW1lLFxuICBpc0VtcHR5LFxuICBpc0Z1bmN0aW9uXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignI3dpdGggcmVxdWlyZXMgZXhhY3RseSBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHtcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmICghaXNFbXB0eShjb250ZXh0KSkge1xuICAgICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLFxuICAgICAgICAgIG9wdGlvbnMuaWRzWzBdXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dF0sIFtkYXRhICYmIGRhdGEuY29udGV4dFBhdGhdKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IGV4dGVuZCB9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggXCJudWxsXCItcHJvdG90eXBlIHRvIGF2b2lkIHRydXRoeSByZXN1bHRzIG9uIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICogVGhlIHJlc3VsdGluZyBvYmplY3QgY2FuIGJlIHVzZWQgd2l0aCBcIm9iamVjdFtwcm9wZXJ0eV1cIiB0byBjaGVjayBpZiBhIHByb3BlcnR5IGV4aXN0c1xuICogQHBhcmFtIHsuLi5vYmplY3R9IHNvdXJjZXMgYSB2YXJhcmdzIHBhcmFtZXRlciBvZiBzb3VyY2Ugb2JqZWN0cyB0aGF0IHdpbGwgYmUgbWVyZ2VkXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmV3TG9va3VwT2JqZWN0KC4uLnNvdXJjZXMpIHtcbiAgcmV0dXJuIGV4dGVuZChPYmplY3QuY3JlYXRlKG51bGwpLCAuLi5zb3VyY2VzKTtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZU5ld0xvb2t1cE9iamVjdCB9IGZyb20gJy4vY3JlYXRlLW5ldy1sb29rdXAtb2JqZWN0JztcbmltcG9ydCAqIGFzIGxvZ2dlciBmcm9tICcuLi9sb2dnZXInO1xuXG5jb25zdCBsb2dnZWRQcm9wZXJ0aWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3RvQWNjZXNzQ29udHJvbChydW50aW1lT3B0aW9ucykge1xuICBsZXQgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGRlZmF1bHRNZXRob2RXaGl0ZUxpc3RbJ2NvbnN0cnVjdG9yJ10gPSBmYWxzZTtcbiAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdFsnX19kZWZpbmVHZXR0ZXJfXyddID0gZmFsc2U7XG4gIGRlZmF1bHRNZXRob2RXaGl0ZUxpc3RbJ19fZGVmaW5lU2V0dGVyX18nXSA9IGZhbHNlO1xuICBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0WydfX2xvb2t1cEdldHRlcl9fJ10gPSBmYWxzZTtcblxuICBsZXQgZGVmYXVsdFByb3BlcnR5V2hpdGVMaXN0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvXG4gIGRlZmF1bHRQcm9wZXJ0eVdoaXRlTGlzdFsnX19wcm90b19fJ10gPSBmYWxzZTtcblxuICByZXR1cm4ge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHdoaXRlbGlzdDogY3JlYXRlTmV3TG9va3VwT2JqZWN0KFxuICAgICAgICBkZWZhdWx0UHJvcGVydHlXaGl0ZUxpc3QsXG4gICAgICAgIHJ1bnRpbWVPcHRpb25zLmFsbG93ZWRQcm90b1Byb3BlcnRpZXNcbiAgICAgICksXG4gICAgICBkZWZhdWx0VmFsdWU6IHJ1bnRpbWVPcHRpb25zLmFsbG93UHJvdG9Qcm9wZXJ0aWVzQnlEZWZhdWx0XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICB3aGl0ZWxpc3Q6IGNyZWF0ZU5ld0xvb2t1cE9iamVjdChcbiAgICAgICAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdCxcbiAgICAgICAgcnVudGltZU9wdGlvbnMuYWxsb3dlZFByb3RvTWV0aG9kc1xuICAgICAgKSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogcnVudGltZU9wdGlvbnMuYWxsb3dQcm90b01ldGhvZHNCeURlZmF1bHRcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXN1bHRJc0FsbG93ZWQocmVzdWx0LCBwcm90b0FjY2Vzc0NvbnRyb2wsIHByb3BlcnR5TmFtZSkge1xuICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjaGVja1doaXRlTGlzdChwcm90b0FjY2Vzc0NvbnRyb2wubWV0aG9kcywgcHJvcGVydHlOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY2hlY2tXaGl0ZUxpc3QocHJvdG9BY2Nlc3NDb250cm9sLnByb3BlcnRpZXMsIHByb3BlcnR5TmFtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tXaGl0ZUxpc3QocHJvdG9BY2Nlc3NDb250cm9sRm9yVHlwZSwgcHJvcGVydHlOYW1lKSB7XG4gIGlmIChwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLndoaXRlbGlzdFtwcm9wZXJ0eU5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcHJvdG9BY2Nlc3NDb250cm9sRm9yVHlwZS53aGl0ZWxpc3RbcHJvcGVydHlOYW1lXSA9PT0gdHJ1ZTtcbiAgfVxuICBpZiAocHJvdG9BY2Nlc3NDb250cm9sRm9yVHlwZS5kZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLmRlZmF1bHRWYWx1ZTtcbiAgfVxuICBsb2dVbmV4cGVjZWRQcm9wZXJ0eUFjY2Vzc09uY2UocHJvcGVydHlOYW1lKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBsb2dVbmV4cGVjZWRQcm9wZXJ0eUFjY2Vzc09uY2UocHJvcGVydHlOYW1lKSB7XG4gIGlmIChsb2dnZWRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gIT09IHRydWUpIHtcbiAgICBsb2dnZWRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuICAgIGxvZ2dlci5sb2coXG4gICAgICAnZXJyb3InLFxuICAgICAgYEhhbmRsZWJhcnM6IEFjY2VzcyBoYXMgYmVlbiBkZW5pZWQgdG8gcmVzb2x2ZSB0aGUgcHJvcGVydHkgXCIke3Byb3BlcnR5TmFtZX1cIiBiZWNhdXNlIGl0IGlzIG5vdCBhbiBcIm93biBwcm9wZXJ0eVwiIG9mIGl0cyBwYXJlbnQuXFxuYCArXG4gICAgICAgIGBZb3UgY2FuIGFkZCBhIHJ1bnRpbWUgb3B0aW9uIHRvIGRpc2FibGUgdGhlIGNoZWNrIG9yIHRoaXMgd2FybmluZzpcXG5gICtcbiAgICAgICAgYFNlZSBodHRwczovL2hhbmRsZWJhcnNqcy5jb20vYXBpLXJlZmVyZW5jZS9ydW50aW1lLW9wdGlvbnMuaHRtbCNvcHRpb25zLXRvLWNvbnRyb2wtcHJvdG90eXBlLWFjY2VzcyBmb3IgZGV0YWlsc2BcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldExvZ2dlZFByb3BlcnRpZXMoKSB7XG4gIE9iamVjdC5rZXlzKGxvZ2dlZFByb3BlcnRpZXMpLmZvckVhY2gocHJvcGVydHlOYW1lID0+IHtcbiAgICBkZWxldGUgbG9nZ2VkUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlciwgdHJhbnNmb3JtT3B0aW9uc0ZuKSB7XG4gIGlmICh0eXBlb2YgaGVscGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVGhpcyBzaG91bGQgbm90IGhhcHBlbiwgYnV0IGFwcGFyZW50bHkgaXQgZG9lcyBpbiBodHRwczovL2dpdGh1Yi5jb20vd3ljYXRzL2hhbmRsZWJhcnMuanMvaXNzdWVzLzE2MzlcbiAgICAvLyBXZSB0cnkgdG8gbWFrZSB0aGUgd3JhcHBlciBsZWFzdC1pbnZhc2l2ZSBieSBub3Qgd3JhcHBpbmcgaXQsIGlmIHRoZSBoZWxwZXIgaXMgbm90IGEgZnVuY3Rpb24uXG4gICAgcmV0dXJuIGhlbHBlcjtcbiAgfVxuICBsZXQgd3JhcHBlciA9IGZ1bmN0aW9uKC8qIGR5bmFtaWMgYXJndW1lbnRzICovKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gICAgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9IHRyYW5zZm9ybU9wdGlvbnNGbihvcHRpb25zKTtcbiAgICByZXR1cm4gaGVscGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIHJldHVybiB3cmFwcGVyO1xufVxuIiwiaW1wb3J0IHsgaW5kZXhPZiB9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG4gIGxldmVsOiAnaW5mbycsXG5cbiAgLy8gTWFwcyBhIGdpdmVuIGxldmVsIHZhbHVlIHRvIHRoZSBgbWV0aG9kTWFwYCBpbmRleGVzIGFib3ZlLlxuICBsb29rdXBMZXZlbDogZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mIGxldmVsID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IGxldmVsTWFwID0gaW5kZXhPZihsb2dnZXIubWV0aG9kTWFwLCBsZXZlbC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGlmIChsZXZlbE1hcCA+PSAwKSB7XG4gICAgICAgIGxldmVsID0gbGV2ZWxNYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXZlbCA9IHBhcnNlSW50KGxldmVsLCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9LFxuXG4gIC8vIENhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIC4uLm1lc3NhZ2UpIHtcbiAgICBsZXZlbCA9IGxvZ2dlci5sb29rdXBMZXZlbChsZXZlbCk7XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGxvZ2dlci5sb29rdXBMZXZlbChsb2dnZXIubGV2ZWwpIDw9IGxldmVsXG4gICAgKSB7XG4gICAgICBsZXQgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgaWYgKCFjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgbWV0aG9kID0gJ2xvZyc7XG4gICAgICB9XG4gICAgICBjb25zb2xlW21ldGhvZF0oLi4ubWVzc2FnZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oSGFuZGxlYmFycykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBsZXQgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuICAgICRIYW5kbGViYXJzID0gcm9vdC5IYW5kbGViYXJzO1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBIYW5kbGViYXJzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocm9vdC5IYW5kbGViYXJzID09PSBIYW5kbGViYXJzKSB7XG4gICAgICByb290LkhhbmRsZWJhcnMgPSAkSGFuZGxlYmFycztcbiAgICB9XG4gICAgcmV0dXJuIEhhbmRsZWJhcnM7XG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi9leGNlcHRpb24nO1xuaW1wb3J0IHtcbiAgQ09NUElMRVJfUkVWSVNJT04sXG4gIGNyZWF0ZUZyYW1lLFxuICBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04sXG4gIFJFVklTSU9OX0NIQU5HRVNcbn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IG1vdmVIZWxwZXJUb0hvb2tzIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7IHdyYXBIZWxwZXIgfSBmcm9tICcuL2ludGVybmFsL3dyYXBIZWxwZXInO1xuaW1wb3J0IHtcbiAgY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sLFxuICByZXN1bHRJc0FsbG93ZWRcbn0gZnJvbSAnLi9pbnRlcm5hbC9wcm90by1hY2Nlc3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgY29uc3QgY29tcGlsZXJSZXZpc2lvbiA9IChjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdKSB8fCAxLFxuICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChcbiAgICBjb21waWxlclJldmlzaW9uID49IExBU1RfQ09NUEFUSUJMRV9DT01QSUxFUl9SRVZJU0lPTiAmJlxuICAgIGNvbXBpbGVyUmV2aXNpb24gPD0gQ09NUElMRVJfUkVWSVNJT05cbiAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04pIHtcbiAgICBjb25zdCBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArXG4gICAgICAgIHJ1bnRpbWVWZXJzaW9ucyArXG4gICAgICAgICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArXG4gICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgK1xuICAgICAgICAnKS4nXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICdQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKCcgK1xuICAgICAgICBjb21waWxlckluZm9bMV0gK1xuICAgICAgICAnKS4nXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHNldWRvLXN1cHBvcnRlZCBBUElzLlxuICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG4gIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciBwcmVjb21waWxlZCB0ZW1wbGF0ZXMgd2l0aCBjb21waWxlci12ZXJzaW9uIDcgKDw0LjMuMClcbiAgY29uc3QgdGVtcGxhdGVXYXNQcmVjb21waWxlZFdpdGhDb21waWxlclY3ID1cbiAgICB0ZW1wbGF0ZVNwZWMuY29tcGlsZXIgJiYgdGVtcGxhdGVTcGVjLmNvbXBpbGVyWzBdID09PSA3O1xuXG4gIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGFydGlhbCA9IGVudi5WTS5yZXNvbHZlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuXG4gICAgbGV0IGV4dGVuZGVkT3B0aW9ucyA9IFV0aWxzLmV4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgaG9va3M6IHRoaXMuaG9va3MsXG4gICAgICBwcm90b0FjY2Vzc0NvbnRyb2w6IHRoaXMucHJvdG9BY2Nlc3NDb250cm9sXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuY2FsbChcbiAgICAgIHRoaXMsXG4gICAgICBwYXJ0aWFsLFxuICAgICAgY29udGV4dCxcbiAgICAgIGV4dGVuZGVkT3B0aW9uc1xuICAgICk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKFxuICAgICAgICBwYXJ0aWFsLFxuICAgICAgICB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJPcHRpb25zLFxuICAgICAgICBlbnZcbiAgICAgICk7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgZXh0ZW5kZWRPcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbmRlbnQpIHtcbiAgICAgICAgbGV0IGxpbmVzID0gcmVzdWx0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWxpbmVzW2ldICYmIGkgKyAxID09PSBsKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaW5lc1tpXSA9IG9wdGlvbnMuaW5kZW50ICsgbGluZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgICAnVGhlIHBhcnRpYWwgJyArXG4gICAgICAgICAgb3B0aW9ucy5uYW1lICtcbiAgICAgICAgICAnIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGUnXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIGxldCBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUsIGxvYykge1xuICAgICAgaWYgKCFvYmogfHwgIShuYW1lIGluIG9iaikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignXCInICsgbmFtZSArICdcIiBub3QgZGVmaW5lZCBpbiAnICsgb2JqLCB7XG4gICAgICAgICAgbG9jOiBsb2NcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5KG9iaiwgbmFtZSk7XG4gICAgfSxcbiAgICBsb29rdXBQcm9wZXJ0eTogZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgIGxldCByZXN1bHQgPSBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdElzQWxsb3dlZChyZXN1bHQsIGNvbnRhaW5lci5wcm90b0FjY2Vzc0NvbnRyb2wsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBsb29rdXA6IGZ1bmN0aW9uKGRlcHRocywgbmFtZSkge1xuICAgICAgY29uc3QgbGVuID0gZGVwdGhzLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGRlcHRoc1tpXSAmJiBjb250YWluZXIubG9va3VwUHJvcGVydHkoZGVwdGhzW2ldLCBuYW1lKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIGxldCByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICBsZXQgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICBmbiA9IHRoaXMuZm4oaSk7XG4gICAgICBpZiAoZGF0YSB8fCBkZXB0aHMgfHwgYmxvY2tQYXJhbXMgfHwgZGVjbGFyZWRCbG9ja1BhcmFtcykge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHdyYXBQcm9ncmFtKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBmbixcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGRlY2xhcmVkQmxvY2tQYXJhbXMsXG4gICAgICAgICAgYmxvY2tQYXJhbXMsXG4gICAgICAgICAgZGVwdGhzXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKHZhbHVlLCBkZXB0aCkge1xuICAgICAgd2hpbGUgKHZhbHVlICYmIGRlcHRoLS0pIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5fcGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgbWVyZ2VJZk5lZWRlZDogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgbGV0IG9iaiA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiBwYXJhbSAhPT0gY29tbW9uKSB7XG4gICAgICAgIG9iaiA9IFV0aWxzLmV4dGVuZCh7fSwgY29tbW9uLCBwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcbiAgICAvLyBBbiBlbXB0eSBvYmplY3QgdG8gdXNlIGFzIHJlcGxhY2VtZW50IGZvciBudWxsLWNvbnRleHRzXG4gICAgbnVsbENvbnRleHQ6IE9iamVjdC5zZWFsKHt9KSxcblxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogdGVtcGxhdGVTcGVjLmNvbXBpbGVyXG4gIH07XG5cbiAgZnVuY3Rpb24gcmV0KGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgcmV0Ll9zZXR1cChvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCAmJiB0ZW1wbGF0ZVNwZWMudXNlRGF0YSkge1xuICAgICAgZGF0YSA9IGluaXREYXRhKGNvbnRleHQsIGRhdGEpO1xuICAgIH1cbiAgICBsZXQgZGVwdGhzLFxuICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG4gICAgICAgIGRlcHRocyA9XG4gICAgICAgICAgY29udGV4dCAhPSBvcHRpb25zLmRlcHRoc1swXVxuICAgICAgICAgICAgPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKVxuICAgICAgICAgICAgOiBvcHRpb25zLmRlcHRocztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlcHRocyA9IFtjb250ZXh0XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWluKGNvbnRleHQgLyosIG9wdGlvbnMqLykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgJycgK1xuICAgICAgICB0ZW1wbGF0ZVNwZWMubWFpbihcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICBjb250YWluZXIuaGVscGVycyxcbiAgICAgICAgICBjb250YWluZXIucGFydGlhbHMsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBibG9ja1BhcmFtcyxcbiAgICAgICAgICBkZXB0aHNcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBtYWluID0gZXhlY3V0ZURlY29yYXRvcnMoXG4gICAgICB0ZW1wbGF0ZVNwZWMubWFpbixcbiAgICAgIG1haW4sXG4gICAgICBjb250YWluZXIsXG4gICAgICBvcHRpb25zLmRlcHRocyB8fCBbXSxcbiAgICAgIGRhdGEsXG4gICAgICBibG9ja1BhcmFtc1xuICAgICk7XG4gICAgcmV0dXJuIG1haW4oY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cblxuICByZXQuaXNUb3AgPSB0cnVlO1xuXG4gIHJldC5fc2V0dXAgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGxldCBtZXJnZWRIZWxwZXJzID0gVXRpbHMuZXh0ZW5kKHt9LCBlbnYuaGVscGVycywgb3B0aW9ucy5oZWxwZXJzKTtcbiAgICAgIHdyYXBIZWxwZXJzVG9QYXNzTG9va3VwUHJvcGVydHkobWVyZ2VkSGVscGVycywgY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gbWVyZ2VkSGVscGVycztcblxuICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsKSB7XG4gICAgICAgIC8vIFVzZSBtZXJnZUlmTmVlZGVkIGhlcmUgdG8gcHJldmVudCBjb21waWxpbmcgZ2xvYmFsIHBhcnRpYWxzIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGNvbnRhaW5lci5tZXJnZUlmTmVlZGVkKFxuICAgICAgICAgIG9wdGlvbnMucGFydGlhbHMsXG4gICAgICAgICAgZW52LnBhcnRpYWxzXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwgfHwgdGVtcGxhdGVTcGVjLnVzZURlY29yYXRvcnMpIHtcbiAgICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBVdGlscy5leHRlbmQoXG4gICAgICAgICAge30sXG4gICAgICAgICAgZW52LmRlY29yYXRvcnMsXG4gICAgICAgICAgb3B0aW9ucy5kZWNvcmF0b3JzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5ob29rcyA9IHt9O1xuICAgICAgY29udGFpbmVyLnByb3RvQWNjZXNzQ29udHJvbCA9IGNyZWF0ZVByb3RvQWNjZXNzQ29udHJvbChvcHRpb25zKTtcblxuICAgICAgbGV0IGtlZXBIZWxwZXJJbkhlbHBlcnMgPVxuICAgICAgICBvcHRpb25zLmFsbG93Q2FsbHNUb0hlbHBlck1pc3NpbmcgfHxcbiAgICAgICAgdGVtcGxhdGVXYXNQcmVjb21waWxlZFdpdGhDb21waWxlclY3O1xuICAgICAgbW92ZUhlbHBlclRvSG9va3MoY29udGFpbmVyLCAnaGVscGVyTWlzc2luZycsIGtlZXBIZWxwZXJJbkhlbHBlcnMpO1xuICAgICAgbW92ZUhlbHBlclRvSG9va3MoY29udGFpbmVyLCAnYmxvY2tIZWxwZXJNaXNzaW5nJywga2VlcEhlbHBlckluSGVscGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5wcm90b0FjY2Vzc0NvbnRyb2wgPSBvcHRpb25zLnByb3RvQWNjZXNzQ29udHJvbDsgLy8gaW50ZXJuYWwgb3B0aW9uXG4gICAgICBjb250YWluZXIuaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IG9wdGlvbnMuZGVjb3JhdG9ycztcbiAgICAgIGNvbnRhaW5lci5ob29rcyA9IG9wdGlvbnMuaG9va3M7XG4gICAgfVxuICB9O1xuXG4gIHJldC5fY2hpbGQgPSBmdW5jdGlvbihpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcFByb2dyYW0oXG4gICAgICBjb250YWluZXIsXG4gICAgICBpLFxuICAgICAgdGVtcGxhdGVTcGVjW2ldLFxuICAgICAgZGF0YSxcbiAgICAgIDAsXG4gICAgICBibG9ja1BhcmFtcyxcbiAgICAgIGRlcHRoc1xuICAgICk7XG4gIH07XG4gIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwUHJvZ3JhbShcbiAgY29udGFpbmVyLFxuICBpLFxuICBmbixcbiAgZGF0YSxcbiAgZGVjbGFyZWRCbG9ja1BhcmFtcyxcbiAgYmxvY2tQYXJhbXMsXG4gIGRlcHRoc1xuKSB7XG4gIGZ1bmN0aW9uIHByb2coY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGN1cnJlbnREZXB0aHMgPSBkZXB0aHM7XG4gICAgaWYgKFxuICAgICAgZGVwdGhzICYmXG4gICAgICBjb250ZXh0ICE9IGRlcHRoc1swXSAmJlxuICAgICAgIShjb250ZXh0ID09PSBjb250YWluZXIubnVsbENvbnRleHQgJiYgZGVwdGhzWzBdID09PSBudWxsKVxuICAgICkge1xuICAgICAgY3VycmVudERlcHRocyA9IFtjb250ZXh0XS5jb25jYXQoZGVwdGhzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm4oXG4gICAgICBjb250YWluZXIsXG4gICAgICBjb250ZXh0LFxuICAgICAgY29udGFpbmVyLmhlbHBlcnMsXG4gICAgICBjb250YWluZXIucGFydGlhbHMsXG4gICAgICBvcHRpb25zLmRhdGEgfHwgZGF0YSxcbiAgICAgIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLFxuICAgICAgY3VycmVudERlcHRoc1xuICAgICk7XG4gIH1cblxuICBwcm9nID0gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcyk7XG5cbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGRlcHRocyA/IGRlcHRocy5sZW5ndGggOiAwO1xuICBwcm9nLmJsb2NrUGFyYW1zID0gZGVjbGFyZWRCbG9ja1BhcmFtcyB8fCAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGN1cnJlbnRseSBwYXJ0IG9mIHRoZSBvZmZpY2lhbCBBUEksIHRoZXJlZm9yZSBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIHNob3VsZCBub3QgYmUgY2hhbmdlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgaWYgKG9wdGlvbnMubmFtZSA9PT0gJ0BwYXJ0aWFsLWJsb2NrJykge1xuICAgICAgcGFydGlhbCA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICAgIH1cbiAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcbiAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcbiAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuICB9XG4gIHJldHVybiBwYXJ0aWFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIC8vIFVzZSB0aGUgY3VycmVudCBjbG9zdXJlIGNvbnRleHQgdG8gc2F2ZSB0aGUgcGFydGlhbC1ibG9jayBpZiB0aGlzIHBhcnRpYWxcbiAgY29uc3QgY3VycmVudFBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcbiAgb3B0aW9ucy5wYXJ0aWFsID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoID0gb3B0aW9ucy5pZHNbMF0gfHwgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoO1xuICB9XG5cbiAgbGV0IHBhcnRpYWxCbG9jaztcbiAgaWYgKG9wdGlvbnMuZm4gJiYgb3B0aW9ucy5mbiAhPT0gbm9vcCkge1xuICAgIG9wdGlvbnMuZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgLy8gV3JhcHBlciBmdW5jdGlvbiB0byBnZXQgYWNjZXNzIHRvIGN1cnJlbnRQYXJ0aWFsQmxvY2sgZnJvbSB0aGUgY2xvc3VyZVxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm47XG4gICAgcGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBmdW5jdGlvbiBwYXJ0aWFsQmxvY2tXcmFwcGVyKFxuICAgICAgY29udGV4dCxcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgICkge1xuICAgICAgLy8gUmVzdG9yZSB0aGUgcGFydGlhbC1ibG9jayBmcm9tIHRoZSBjbG9zdXJlIGZvciB0aGUgZXhlY3V0aW9uIG9mIHRoZSBibG9ja1xuICAgICAgLy8gaS5lLiB0aGUgcGFydCBpbnNpZGUgdGhlIGJsb2NrIG9mIHRoZSBwYXJ0aWFsIGNhbGwuXG4gICAgICBvcHRpb25zLmRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBjdXJyZW50UGFydGlhbEJsb2NrO1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH07XG4gICAgaWYgKGZuLnBhcnRpYWxzKSB7XG4gICAgICBvcHRpb25zLnBhcnRpYWxzID0gVXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zLnBhcnRpYWxzLCBmbi5wYXJ0aWFscyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFsQmxvY2spIHtcbiAgICBwYXJ0aWFsID0gcGFydGlhbEJsb2NrO1xuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICB9IGVsc2UgaWYgKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkge1xuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGluaXREYXRhKGNvbnRleHQsIGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8ICEoJ3Jvb3QnIGluIGRhdGEpKSB7XG4gICAgZGF0YSA9IGRhdGEgPyBjcmVhdGVGcmFtZShkYXRhKSA6IHt9O1xuICAgIGRhdGEucm9vdCA9IGNvbnRleHQ7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpIHtcbiAgaWYgKGZuLmRlY29yYXRvcikge1xuICAgIGxldCBwcm9wcyA9IHt9O1xuICAgIHByb2cgPSBmbi5kZWNvcmF0b3IoXG4gICAgICBwcm9nLFxuICAgICAgcHJvcHMsXG4gICAgICBjb250YWluZXIsXG4gICAgICBkZXB0aHMgJiYgZGVwdGhzWzBdLFxuICAgICAgZGF0YSxcbiAgICAgIGJsb2NrUGFyYW1zLFxuICAgICAgZGVwdGhzXG4gICAgKTtcbiAgICBVdGlscy5leHRlbmQocHJvZywgcHJvcHMpO1xuICB9XG4gIHJldHVybiBwcm9nO1xufVxuXG5mdW5jdGlvbiB3cmFwSGVscGVyc1RvUGFzc0xvb2t1cFByb3BlcnR5KG1lcmdlZEhlbHBlcnMsIGNvbnRhaW5lcikge1xuICBPYmplY3Qua2V5cyhtZXJnZWRIZWxwZXJzKS5mb3JFYWNoKGhlbHBlck5hbWUgPT4ge1xuICAgIGxldCBoZWxwZXIgPSBtZXJnZWRIZWxwZXJzW2hlbHBlck5hbWVdO1xuICAgIG1lcmdlZEhlbHBlcnNbaGVscGVyTmFtZV0gPSBwYXNzTG9va3VwUHJvcGVydHlPcHRpb24oaGVscGVyLCBjb250YWluZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFzc0xvb2t1cFByb3BlcnR5T3B0aW9uKGhlbHBlciwgY29udGFpbmVyKSB7XG4gIGNvbnN0IGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5O1xuICByZXR1cm4gd3JhcEhlbHBlcihoZWxwZXIsIG9wdGlvbnMgPT4ge1xuICAgIHJldHVybiBVdGlscy5leHRlbmQoeyBsb29rdXBQcm9wZXJ0eSB9LCBvcHRpb25zKTtcbiAgfSk7XG59XG4iLCIvLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gU2FmZVN0cmluZy5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJyArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2FmZVN0cmluZztcbiIsImNvbnN0IGVzY2FwZSA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnLFxuICBcIidcIjogJyYjeDI3OycsXG4gICdgJzogJyYjeDYwOycsXG4gICc9JzogJyYjeDNEOydcbn07XG5cbmNvbnN0IGJhZENoYXJzID0gL1smPD5cIidgPV0vZyxcbiAgcG9zc2libGUgPSAvWyY8PlwiJ2A9XS87XG5cbmZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG4gIHJldHVybiBlc2NhcGVbY2hyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChvYmogLyogLCAuLi5zb3VyY2UgKi8pIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYXJndW1lbnRzW2ldKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3VtZW50c1tpXSwga2V5KSkge1xuICAgICAgICBvYmpba2V5XSA9IGFyZ3VtZW50c1tpXVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmV4cG9ydCBsZXQgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLXN0eWxlICovXG5sZXQgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmXG4gICAgICB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJ1xuICAgICk7XG4gIH07XG59XG5leHBvcnQgeyBpc0Z1bmN0aW9uIH07XG4vKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBpc0FycmF5ID1cbiAgQXJyYXkuaXNBcnJheSB8fFxuICBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG4gICAgICA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4vLyBPbGRlciBJRSB2ZXJzaW9ucyBkbyBub3QgZGlyZWN0bHkgc3VwcG9ydCBpbmRleE9mIHNvIHdlIG11c3QgaW1wbGVtZW50IG91ciBvd24sIHNhZGx5LlxuZXhwb3J0IGZ1bmN0aW9uIGluZGV4T2YoYXJyYXksIHZhbHVlKSB7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChhcnJheVtpXSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gICAgaWYgKHN0cmluZyAmJiBzdHJpbmcudG9IVE1MKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnRvSFRNTCgpO1xuICAgIH0gZWxzZSBpZiAoc3RyaW5nID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2UgaWYgKCFzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcgKyAnJztcbiAgICB9XG5cbiAgICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZztcbiAgfVxuXG4gIGlmICghcG9zc2libGUudGVzdChzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGcmFtZShvYmplY3QpIHtcbiAgbGV0IGZyYW1lID0gZXh0ZW5kKHt9LCBvYmplY3QpO1xuICBmcmFtZS5fcGFyZW50ID0gb2JqZWN0O1xuICByZXR1cm4gZnJhbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBibG9ja1BhcmFtcyhwYXJhbXMsIGlkcykge1xuICBwYXJhbXMucGF0aCA9IGlkcztcbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZENvbnRleHRQYXRoKGNvbnRleHRQYXRoLCBpZCkge1xuICByZXR1cm4gKGNvbnRleHRQYXRoID8gY29udGV4dFBhdGggKyAnLicgOiAnJykgKyBpZDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iLCIvKiBnbG9iYWwgYXBleCAqL1xudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJylcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigncmF3JywgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcylcbn0pXG5cbi8vIFJlcXVpcmUgZHluYW1pYyB0ZW1wbGF0ZXNcbnZhciBtb2RhbFJlcG9ydFRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbW9kYWwtcmVwb3J0LmhicycpXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCgncmVwb3J0JywgcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcGFydGlhbHMvX3JlcG9ydC5oYnMnKSlcbkhhbmRsZWJhcnMucmVnaXN0ZXJQYXJ0aWFsKCdyb3dzJywgcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcGFydGlhbHMvX3Jvd3MuaGJzJykpXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCgncGFnaW5hdGlvbicsIHJlcXVpcmUoJy4vdGVtcGxhdGVzL3BhcnRpYWxzL19wYWdpbmF0aW9uLmhicycpKVxuXG47KGZ1bmN0aW9uICgkLCB3aW5kb3cpIHtcbiAgJC53aWRnZXQoJ2Zjcy5tb2RhbExvdicsIHtcbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICBvcHRpb25zOiB7XG4gICAgICBpZDogJycsXG4gICAgICB0aXRsZTogJycsXG4gICAgICBpdGVtTmFtZTogJycsXG4gICAgICBzZWFyY2hGaWVsZDogJycsXG4gICAgICBzZWFyY2hCdXR0b246ICcnLFxuICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6ICcnLFxuICAgICAgYWpheElkZW50aWZpZXI6ICcnLFxuICAgICAgc2hvd0hlYWRlcnM6IGZhbHNlLFxuICAgICAgcmV0dXJuQ29sOiAnJyxcbiAgICAgIGRpc3BsYXlDb2w6ICcnLFxuICAgICAgdmFsaWRhdGlvbkVycm9yOiAnJyxcbiAgICAgIGNhc2NhZGluZ0l0ZW1zOiAnJyxcbiAgICAgIG1vZGFsV2lkdGg6IDYwMCxcbiAgICAgIG5vRGF0YUZvdW5kOiAnJyxcbiAgICAgIGFsbG93TXVsdGlsaW5lUm93czogZmFsc2UsXG4gICAgICByb3dDb3VudDogMTUsXG4gICAgICBwYWdlSXRlbXNUb1N1Ym1pdDogJycsXG4gICAgICBtYXJrQ2xhc3NlczogJ3UtaG90JyxcbiAgICAgIGhvdmVyQ2xhc3NlczogJ2hvdmVyIHUtY29sb3ItMScsXG4gICAgICBwcmV2aW91c0xhYmVsOiAncHJldmlvdXMnLFxuICAgICAgbmV4dExhYmVsOiAnbmV4dCcsXG4gICAgICB0ZXh0Q2FzZTogJ04nLFxuICAgICAgYWRkaXRpb25hbE91dHB1dHNTdHI6ICcnLFxuICAgIH0sXG5cbiAgICBfcmV0dXJuVmFsdWU6ICcnLFxuXG4gICAgX2l0ZW0kOiBudWxsLFxuICAgIF9zZWFyY2hCdXR0b24kOiBudWxsLFxuICAgIF9jbGVhcklucHV0JDogbnVsbCxcblxuICAgIF9zZWFyY2hGaWVsZCQ6IG51bGwsXG5cbiAgICBfdGVtcGxhdGVEYXRhOiB7fSxcbiAgICBfbGFzdFNlYXJjaFRlcm06ICcnLFxuXG4gICAgX21vZGFsRGlhbG9nJDogbnVsbCxcblxuICAgIF9hY3RpdmVEZWxheTogZmFsc2UsXG4gICAgX2Rpc2FibGVDaGFuZ2VFdmVudDogZmFsc2UsXG5cbiAgICBfaWckOiBudWxsLFxuICAgIF9ncmlkOiBudWxsLFxuXG4gICAgX3RvcEFwZXg6IGFwZXgudXRpbC5nZXRUb3BBcGV4KCksXG5cbiAgICBfcmVzZXRGb2N1czogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICBpZiAodGhpcy5fZ3JpZCkge1xuICAgICAgICB2YXIgcmVjb3JkSWQgPSB0aGlzLl9ncmlkLm1vZGVsLmdldFJlY29yZElkKHRoaXMuX2dyaWQudmlldyQuZ3JpZCgnZ2V0U2VsZWN0ZWRSZWNvcmRzJylbMF0pXG4gICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLl9pZyQuaW50ZXJhY3RpdmVHcmlkKCdvcHRpb24nKS5jb25maWcuY29sdW1ucy5maWx0ZXIoZnVuY3Rpb24gKGNvbHVtbikge1xuICAgICAgICAgIHJldHVybiBjb2x1bW4uc3RhdGljSWQgPT09IHNlbGYub3B0aW9ucy5pdGVtTmFtZVxuICAgICAgICB9KVswXVxuICAgICAgICB0aGlzLl9ncmlkLnZpZXckLmdyaWQoJ2dvdG9DZWxsJywgcmVjb3JkSWQsIGNvbHVtbi5uYW1lKVxuICAgICAgICB0aGlzLl9ncmlkLmZvY3VzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2l0ZW0kLmZvY3VzKCk7XG5cbiAgICAgIC8vIEZvY3VzIG9uIG5leHQgZWxlbWVudCBpZiBFTlRFUiBrZXkgdXNlZCB0byBzZWxlY3Qgcm93LlxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMucmV0dXJuT25FbnRlcktleSkge1xuICAgICAgICAgIHNlbGYub3B0aW9ucy5yZXR1cm5PbkVudGVyS2V5ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCkge1xuICAgICAgICAgICAgc2VsZi5fZm9jdXNQcmV2RWxlbWVudCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX2ZvY3VzTmV4dEVsZW1lbnQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLm9wdGlvbnMuaXNQcmV2SW5kZXggPSBmYWxzZVxuICAgICAgfSwgMTAwKVxuICAgIH0sXG5cbiAgICAvLyBDb21iaW5hdGlvbiBvZiBudW1iZXIsIGNoYXIgYW5kIHNwYWNlLCBhcnJvdyBrZXlzXG4gICAgX3ZhbGlkU2VhcmNoS2V5czogWzQ4LCA0OSwgNTAsIDUxLCA1MiwgNTMsIDU0LCA1NSwgNTYsIDU3LCAvLyBudW1iZXJzXG4gICAgICA2NSwgNjYsIDY3LCA2OCwgNjksIDcwLCA3MSwgNzIsIDczLCA3NCwgNzUsIDc2LCA3NywgNzgsIDc5LCA4MCwgODEsIDgyLCA4MywgODQsIDg1LCA4NiwgODcsIDg4LCA4OSwgOTAsIC8vIGNoYXJzXG4gICAgICA5MywgOTQsIDk1LCA5NiwgOTcsIDk4LCA5OSwgMTAwLCAxMDEsIDEwMiwgMTAzLCAxMDQsIDEwNSwgLy8gbnVtcGFkIG51bWJlcnNcbiAgICAgIDQwLCAvLyBhcnJvdyBkb3duXG4gICAgICAzMiwgLy8gc3BhY2ViYXJcbiAgICAgIDgsIC8vIGJhY2tzcGFjZVxuICAgICAgMTA2LCAxMDcsIDEwOSwgMTEwLCAxMTEsIDE4NiwgMTg3LCAxODgsIDE4OSwgMTkwLCAxOTEsIDE5MiwgMjE5LCAyMjAsIDIyMSwgMjIwIC8vIGludGVycHVuY3Rpb25cbiAgICBdLFxuXG4gICAgLy8gS2V5cyB0byBpbmRpY2F0ZSBjb21wbGV0aW5nIGlucHV0IChlc2MsIHRhYiwgZW50ZXIpXG4gICAgX3ZhbGlkTmV4dEtleXM6IFs5LCAyNywgMTNdLFxuXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgIHNlbGYuX2l0ZW0kID0gJCgnIycgKyBzZWxmLm9wdGlvbnMuaXRlbU5hbWUpXG4gICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9IHNlbGYuX2l0ZW0kLmRhdGEoJ3JldHVyblZhbHVlJykudG9TdHJpbmcoKVxuICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJCA9ICQoJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEJ1dHRvbilcbiAgICAgIHNlbGYuX2NsZWFySW5wdXQkID0gc2VsZi5faXRlbSQucGFyZW50KCkuZmluZCgnLmZjcy1zZWFyY2gtY2xlYXInKVxuXG4gICAgICBzZWxmLl9hZGRDU1NUb1RvcExldmVsKClcblxuICAgICAgLy8gVHJpZ2dlciBldmVudCBvbiBjbGljayBpbnB1dCBkaXNwbGF5IGZpZWxkXG4gICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDAgLSBjcmVhdGUnKVxuXG4gICAgICAvLyBUcmlnZ2VyIGV2ZW50IG9uIGNsaWNrIGlucHV0IGdyb3VwIGFkZG9uIGJ1dHRvbiAobWFnbmlmaWVyIGdsYXNzKVxuICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uQnV0dG9uKClcblxuICAgICAgLy8gQ2xlYXIgdGV4dCB3aGVuIGNsZWFyIGljb24gaXMgY2xpY2tlZFxuICAgICAgc2VsZi5faW5pdENsZWFySW5wdXQoKVxuXG4gICAgICAvLyBDYXNjYWRpbmcgTE9WIGl0ZW0gYWN0aW9uc1xuICAgICAgc2VsZi5faW5pdENhc2NhZGluZ0xPVnMoKVxuXG4gICAgICAvLyBJbml0IEFQRVggcGFnZWl0ZW0gZnVuY3Rpb25zXG4gICAgICBzZWxmLl9pbml0QXBleEl0ZW0oKVxuICAgIH0sXG5cbiAgICBfb25PcGVuRGlhbG9nOiBmdW5jdGlvbiAobW9kYWwsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gb3B0aW9ucy53aWRnZXRcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJCA9IHNlbGYuX3RvcEFwZXgualF1ZXJ5KG1vZGFsKVxuICAgICAgLy8gRm9jdXMgb24gc2VhcmNoIGZpZWxkIGluIExPVlxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkoJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKS5mb2N1cygpXG4gICAgICAvLyBSZW1vdmUgdmFsaWRhdGlvbiByZXN1bHRzXG4gICAgICBzZWxmLl9yZW1vdmVWYWxpZGF0aW9uKClcbiAgICAgIC8vIEFkZCB0ZXh0IGZyb20gZGlzcGxheSBmaWVsZFxuICAgICAgaWYgKG9wdGlvbnMuZmlsbFNlYXJjaFRleHQpIHtcbiAgICAgICAgc2VsZi5fdG9wQXBleC5pdGVtKHNlbGYub3B0aW9ucy5zZWFyY2hGaWVsZCkuc2V0VmFsdWUoc2VsZi5faXRlbSQudmFsKCkpXG4gICAgICB9XG4gICAgICAvLyBBZGQgY2xhc3Mgb24gaG92ZXJcbiAgICAgIHNlbGYuX29uUm93SG92ZXIoKVxuICAgICAgLy8gc2VsZWN0SW5pdGlhbFJvd1xuICAgICAgc2VsZi5fc2VsZWN0SW5pdGlhbFJvdygpXG4gICAgICAvLyBTZXQgYWN0aW9uIHdoZW4gYSByb3cgaXMgc2VsZWN0ZWRcbiAgICAgIHNlbGYuX29uUm93U2VsZWN0ZWQoKVxuICAgICAgLy8gTmF2aWdhdGUgb24gYXJyb3cga2V5cyB0cm91Z2ggTE9WXG4gICAgICBzZWxmLl9pbml0S2V5Ym9hcmROYXZpZ2F0aW9uKClcbiAgICAgIC8vIFNldCBzZWFyY2ggYWN0aW9uXG4gICAgICBzZWxmLl9pbml0U2VhcmNoKClcbiAgICAgIC8vIFNldCBwYWdpbmF0aW9uIGFjdGlvbnNcbiAgICAgIHNlbGYuX2luaXRQYWdpbmF0aW9uKClcbiAgICB9LFxuXG4gICAgX29uQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIChtb2RhbCwgb3B0aW9ucykge1xuICAgICAgLy8gY2xvc2UgdGFrZXMgcGxhY2Ugd2hlbiBubyByZWNvcmQgaGFzIGJlZW4gc2VsZWN0ZWQsIGluc3RlYWQgdGhlIGNsb3NlIG1vZGFsIChvciBlc2MpIHdhcyBjbGlja2VkLyBwcmVzc2VkXG4gICAgICAvLyBJdCBjb3VsZCBtZWFuIHR3byB0aGluZ3M6IGtlZXAgY3VycmVudCBvciB0YWtlIHRoZSB1c2VyJ3MgZGlzcGxheSB2YWx1ZVxuICAgICAgLy8gV2hhdCBhYm91dCB0d28gZXF1YWwgZGlzcGxheSB2YWx1ZXM/XG5cbiAgICAgIC8vIEJ1dCBubyByZWNvcmQgc2VsZWN0aW9uIGNvdWxkIG1lYW4gY2FuY2VsXG4gICAgICAvLyBidXQgb3BlbiBtb2RhbCBhbmQgZm9yZ2V0IGFib3V0IGl0XG4gICAgICAvLyBpbiB0aGUgZW5kLCB0aGlzIHNob3VsZCBrZWVwIHRoaW5ncyBpbnRhY3QgYXMgdGhleSB3ZXJlXG4gICAgICBvcHRpb25zLndpZGdldC5fZGVzdHJveShtb2RhbClcbiAgICAgIHRoaXMuX3NldEl0ZW1WYWx1ZXMob3B0aW9ucy53aWRnZXQuX3JldHVyblZhbHVlKTtcbiAgICAgIG9wdGlvbnMud2lkZ2V0Ll90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDkgLSBjbG9zZSBkaWFsb2cnKVxuICAgIH0sXG5cbiAgICBfaW5pdEdyaWRDb25maWc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2lnJCA9IHRoaXMuX2l0ZW0kLmNsb3Nlc3QoJy5hLUlHJylcblxuICAgICAgaWYgKHRoaXMuX2lnJC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX2dyaWQgPSB0aGlzLl9pZyQuaW50ZXJhY3RpdmVHcmlkKCdnZXRWaWV3cycpLmdyaWRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gb3B0aW9ucy53aWRnZXRcblxuICAgICAgc2VsZi5faW5pdEdyaWRDb25maWcoKVxuXG4gICAgICAvLyBDcmVhdGUgTE9WIHJlZ2lvblxuICAgICAgdmFyICRtb2RhbFJlZ2lvbiA9IHNlbGYuX3RvcEFwZXgualF1ZXJ5KG1vZGFsUmVwb3J0VGVtcGxhdGUoc2VsZi5fdGVtcGxhdGVEYXRhKSkuYXBwZW5kVG8oJ2JvZHknKVxuXG4gICAgICAvLyBPcGVuIG5ldyBtb2RhbFxuICAgICAgJG1vZGFsUmVnaW9uLmRpYWxvZyh7XG4gICAgICAgIGhlaWdodDogKHNlbGYub3B0aW9ucy5yb3dDb3VudCAqIDMzKSArIDE5OSwgLy8gKyBkaWFsb2cgYnV0dG9uIGhlaWdodFxuICAgICAgICB3aWR0aDogc2VsZi5vcHRpb25zLm1vZGFsV2lkdGgsXG4gICAgICAgIGNsb3NlVGV4dDogYXBleC5sYW5nLmdldE1lc3NhZ2UoJ0FQRVguRElBTE9HLkNMT1NFJyksXG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY2xvc2VPbkVzY2FwZTogdHJ1ZSxcbiAgICAgICAgZGlhbG9nQ2xhc3M6ICd1aS1kaWFsb2ctLWFwZXggJyxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAgICAgLy8gcmVtb3ZlIG9wZW5lciBiZWNhdXNlIGl0IG1ha2VzIHRoZSBwYWdlIHNjcm9sbCBkb3duIGZvciBJR1xuICAgICAgICAgIHNlbGYuX3RvcEFwZXgualF1ZXJ5KHRoaXMpLmRhdGEoJ3VpRGlhbG9nJykub3BlbmVyID0gc2VsZi5fdG9wQXBleC5qUXVlcnkoKVxuICAgICAgICAgIHNlbGYuX3RvcEFwZXgubmF2aWdhdGlvbi5iZWdpbkZyZWV6ZVNjcm9sbCgpXG4gICAgICAgICAgc2VsZi5fb25PcGVuRGlhbG9nKHRoaXMsIG9wdGlvbnMpXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fb25DbG9zZURpYWxvZyh0aGlzLCBvcHRpb25zKVxuICAgICAgICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIGRvd24gb24gbW9kYWwgY2xvc2VcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fdG9wQXBleC5uYXZpZ2F0aW9uLmVuZEZyZWV6ZVNjcm9sbCgpXG4gICAgICAgICAgc2VsZi5fcmVzZXRGb2N1cygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9vblJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGFmdGVyIGEgc2VhcmNoXG4gICAgICB2YXIgcmVwb3J0SHRtbCA9IEhhbmRsZWJhcnMucGFydGlhbHMucmVwb3J0KHNlbGYuX3RlbXBsYXRlRGF0YSlcbiAgICAgIHZhciBwYWdpbmF0aW9uSHRtbCA9IEhhbmRsZWJhcnMucGFydGlhbHMucGFnaW5hdGlvbihzZWxmLl90ZW1wbGF0ZURhdGEpXG5cbiAgICAgIC8vIEdldCBjdXJyZW50IG1vZGFsLWxvdiB0YWJsZVxuICAgICAgdmFyIG1vZGFsTE9WVGFibGUgPSBzZWxmLl9tb2RhbERpYWxvZyQuZmluZCgnLm1vZGFsLWxvdi10YWJsZScpXG4gICAgICB2YXIgcGFnaW5hdGlvbiA9IHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1CdXR0b25SZWdpb24td3JhcCcpXG5cbiAgICAgIC8vIFJlcGxhY2UgcmVwb3J0IHdpdGggbmV3IGRhdGFcbiAgICAgICQobW9kYWxMT1ZUYWJsZSkucmVwbGFjZVdpdGgocmVwb3J0SHRtbClcbiAgICAgICQocGFnaW5hdGlvbikuaHRtbChwYWdpbmF0aW9uSHRtbClcblxuICAgICAgLy8gc2VsZWN0SW5pdGlhbFJvdyBpbiBuZXcgbW9kYWwtbG92IHRhYmxlXG4gICAgICBzZWxmLl9zZWxlY3RJbml0aWFsUm93KClcblxuICAgICAgLy8gTWFrZSB0aGUgZW50ZXIga2V5IGRvIHNvbWV0aGluZyBhZ2FpblxuICAgICAgc2VsZi5fYWN0aXZlRGVsYXkgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfdW5lc2NhcGU6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgLy8gJCgnPGlucHV0IHZhbHVlPVwiJyArIHZhbCArICdcIi8+JykudmFsKClcbiAgICB9LFxuXG4gICAgX2dldFRlbXBsYXRlRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgIC8vIENyZWF0ZSByZXR1cm4gT2JqZWN0XG4gICAgICB2YXIgdGVtcGxhdGVEYXRhID0ge1xuICAgICAgICBpZDogc2VsZi5vcHRpb25zLmlkLFxuICAgICAgICBjbGFzc2VzOiAnbW9kYWwtbG92JyxcbiAgICAgICAgdGl0bGU6IHNlbGYub3B0aW9ucy50aXRsZSxcbiAgICAgICAgbW9kYWxTaXplOiBzZWxmLm9wdGlvbnMubW9kYWxTaXplLFxuICAgICAgICByZWdpb246IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiAnc3R5bGU9XCJib3R0b206IDY2cHg7XCInXG4gICAgICAgIH0sXG4gICAgICAgIHNlYXJjaEZpZWxkOiB7XG4gICAgICAgICAgaWQ6IHNlbGYub3B0aW9ucy5zZWFyY2hGaWVsZCxcbiAgICAgICAgICBwbGFjZWhvbGRlcjogc2VsZi5vcHRpb25zLnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgIHRleHRDYXNlOiBzZWxmLm9wdGlvbnMudGV4dENhc2UgPT09ICdVJyA/ICd1LXRleHRVcHBlcicgOiBzZWxmLm9wdGlvbnMudGV4dENhc2UgPT09ICdMJyA/ICd1LXRleHRMb3dlcicgOiAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVwb3J0OiB7XG4gICAgICAgICAgY29sdW1uczoge30sXG4gICAgICAgICAgcm93czoge30sXG4gICAgICAgICAgY29sQ291bnQ6IDAsXG4gICAgICAgICAgcm93Q291bnQ6IDAsXG4gICAgICAgICAgc2hvd0hlYWRlcnM6IHNlbGYub3B0aW9ucy5zaG93SGVhZGVycyxcbiAgICAgICAgICBub0RhdGFGb3VuZDogc2VsZi5vcHRpb25zLm5vRGF0YUZvdW5kLFxuICAgICAgICAgIGNsYXNzZXM6IChzZWxmLm9wdGlvbnMuYWxsb3dNdWx0aWxpbmVSb3dzKSA/ICdtdWx0aWxpbmUnIDogJycsXG4gICAgICAgIH0sXG4gICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICByb3dDb3VudDogMCxcbiAgICAgICAgICBmaXJzdFJvdzogMCxcbiAgICAgICAgICBsYXN0Um93OiAwLFxuICAgICAgICAgIGFsbG93UHJldjogZmFsc2UsXG4gICAgICAgICAgYWxsb3dOZXh0OiBmYWxzZSxcbiAgICAgICAgICBwcmV2aW91czogc2VsZi5vcHRpb25zLnByZXZpb3VzTGFiZWwsXG4gICAgICAgICAgbmV4dDogc2VsZi5vcHRpb25zLm5leHRMYWJlbCxcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgLy8gTm8gcm93cyBmb3VuZD9cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3cubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZURhdGFcbiAgICAgIH1cblxuICAgICAgLy8gR2V0IGNvbHVtbnNcbiAgICAgIHZhciBjb2x1bW5zID0gT2JqZWN0LmtleXMoc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93WzBdKVxuXG4gICAgICAvLyBQYWdpbmF0aW9uXG4gICAgICB0ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5maXJzdFJvdyA9IHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvd1swXVsnUk9XTlVNIyMjJ11cbiAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmxhc3RSb3cgPSBzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3dbc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93Lmxlbmd0aCAtIDFdWydST1dOVU0jIyMnXVxuXG4gICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIG5leHQgcmVzdWx0c2V0XG4gICAgICB2YXIgbmV4dFJvdyA9IHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvd1tzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3cubGVuZ3RoIC0gMV1bJ05FWFRST1cjIyMnXVxuXG4gICAgICAvLyBBbGxvdyBwcmV2aW91cyBidXR0b24/XG4gICAgICBpZiAodGVtcGxhdGVEYXRhLnBhZ2luYXRpb24uZmlyc3RSb3cgPiAxKSB7XG4gICAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmFsbG93UHJldiA9IHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gQWxsb3cgbmV4dCBidXR0b24/XG4gICAgICB0cnkge1xuICAgICAgICBpZiAobmV4dFJvdy50b1N0cmluZygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5hbGxvd05leHQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5hbGxvd05leHQgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgaW50ZXJuYWwgY29sdW1ucyAoUk9XTlVNIyMjLCAuLi4pXG4gICAgICBjb2x1bW5zLnNwbGljZShjb2x1bW5zLmluZGV4T2YoJ1JPV05VTSMjIycpLCAxKVxuICAgICAgY29sdW1ucy5zcGxpY2UoY29sdW1ucy5pbmRleE9mKCdORVhUUk9XIyMjJyksIDEpXG5cbiAgICAgIC8vIFJlbW92ZSBjb2x1bW4gcmV0dXJuLWl0ZW1cbiAgICAgIGNvbHVtbnMuc3BsaWNlKGNvbHVtbnMuaW5kZXhPZihzZWxmLm9wdGlvbnMucmV0dXJuQ29sKSwgMSlcbiAgICAgIC8vIFJlbW92ZSBjb2x1bW4gcmV0dXJuLWRpc3BsYXkgaWYgZGlzcGxheSBjb2x1bW5zIGFyZSBwcm92aWRlZFxuICAgICAgaWYgKGNvbHVtbnMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb2x1bW5zLnNwbGljZShjb2x1bW5zLmluZGV4T2Yoc2VsZi5vcHRpb25zLmRpc3BsYXlDb2wpLCAxKVxuICAgICAgfVxuXG4gICAgICB0ZW1wbGF0ZURhdGEucmVwb3J0LmNvbENvdW50ID0gY29sdW1ucy5sZW5ndGhcblxuICAgICAgLy8gUmVuYW1lIGNvbHVtbnMgdG8gc3RhbmRhcmQgbmFtZXMgbGlrZSBjb2x1bW4wLCBjb2x1bW4xLCAuLlxuICAgICAgdmFyIGNvbHVtbiA9IHt9XG4gICAgICAkLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChjb2x1bW5zLmxlbmd0aCA9PT0gMSAmJiBzZWxmLm9wdGlvbnMuaXRlbUxhYmVsKSB7XG4gICAgICAgICAgY29sdW1uWydjb2x1bW4nICsga2V5XSA9IHtcbiAgICAgICAgICAgIG5hbWU6IHZhbCxcbiAgICAgICAgICAgIGxhYmVsOiBzZWxmLm9wdGlvbnMuaXRlbUxhYmVsXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbHVtblsnY29sdW1uJyArIGtleV0gPSB7XG4gICAgICAgICAgICBuYW1lOiB2YWxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGVEYXRhLnJlcG9ydC5jb2x1bW5zID0gJC5leHRlbmQodGVtcGxhdGVEYXRhLnJlcG9ydC5jb2x1bW5zLCBjb2x1bW4pXG4gICAgICB9KVxuXG4gICAgICAvKiBHZXQgcm93c1xuXG4gICAgICAgIGZvcm1hdCB3aWxsIGJlIGxpa2UgdGhpczpcblxuICAgICAgICByb3dzID0gW3tjb2x1bW4wOiBcImFcIiwgY29sdW1uMTogXCJiXCJ9LCB7Y29sdW1uMDogXCJjXCIsIGNvbHVtbjE6IFwiZFwifV1cblxuICAgICAgKi9cbiAgICAgIHZhciB0bXBSb3dcblxuICAgICAgdmFyIHJvd3MgPSAkLm1hcChzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3csIGZ1bmN0aW9uIChyb3csIHJvd0tleSkge1xuICAgICAgICB0bXBSb3cgPSB7XG4gICAgICAgICAgY29sdW1uczoge31cbiAgICAgICAgfVxuICAgICAgICAvLyBhZGQgY29sdW1uIHZhbHVlcyB0byByb3dcbiAgICAgICAgJC5lYWNoKHRlbXBsYXRlRGF0YS5yZXBvcnQuY29sdW1ucywgZnVuY3Rpb24gKGNvbElkLCBjb2wpIHtcbiAgICAgICAgICB0bXBSb3cuY29sdW1uc1tjb2xJZF0gPSBzZWxmLl91bmVzY2FwZShyb3dbY29sLm5hbWVdKVxuICAgICAgICB9KVxuICAgICAgICAvLyBhZGQgbWV0YWRhdGEgdG8gcm93XG4gICAgICAgIHRtcFJvdy5yZXR1cm5WYWwgPSByb3dbc2VsZi5vcHRpb25zLnJldHVybkNvbF1cbiAgICAgICAgdG1wUm93LmRpc3BsYXlWYWwgPSByb3dbc2VsZi5vcHRpb25zLmRpc3BsYXlDb2xdXG4gICAgICAgIHJldHVybiB0bXBSb3dcbiAgICAgIH0pXG5cbiAgICAgIHRlbXBsYXRlRGF0YS5yZXBvcnQucm93cyA9IHJvd3NcblxuICAgICAgdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dDb3VudCA9IChyb3dzLmxlbmd0aCA9PT0gMCA/IGZhbHNlIDogcm93cy5sZW5ndGgpXG4gICAgICB0ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5yb3dDb3VudCA9IHRlbXBsYXRlRGF0YS5yZXBvcnQucm93Q291bnRcblxuICAgICAgcmV0dXJuIHRlbXBsYXRlRGF0YVxuICAgIH0sXG5cbiAgICBfZGVzdHJveTogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICQod2luZG93LnRvcC5kb2N1bWVudCkub2ZmKCdrZXlkb3duJylcbiAgICAgICQod2luZG93LnRvcC5kb2N1bWVudCkub2ZmKCdrZXl1cCcsICcjJyArIHNlbGYub3B0aW9ucy5zZWFyY2hGaWVsZClcbiAgICAgIHNlbGYuX2l0ZW0kLm9mZigna2V5dXAnKVxuICAgICAgc2VsZi5fbW9kYWxEaWFsb2ckLnJlbW92ZSgpXG4gICAgICBzZWxmLl90b3BBcGV4Lm5hdmlnYXRpb24uZW5kRnJlZXplU2Nyb2xsKClcbiAgICB9LFxuXG4gICAgX2dldERhdGE6IGZ1bmN0aW9uIChvcHRpb25zLCBoYW5kbGVyKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgICBzZWFyY2hUZXJtOiAnJyxcbiAgICAgICAgZmlyc3RSb3c6IDEsXG4gICAgICAgIGZpbGxTZWFyY2hUZXh0OiB0cnVlXG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzID0gJC5leHRlbmQoc2V0dGluZ3MsIG9wdGlvbnMpXG4gICAgICB2YXIgc2VhcmNoVGVybSA9IChzZXR0aW5ncy5zZWFyY2hUZXJtLmxlbmd0aCA+IDApID8gc2V0dGluZ3Muc2VhcmNoVGVybSA6IHNlbGYuX3RvcEFwZXguaXRlbShzZWxmLm9wdGlvbnMuc2VhcmNoRmllbGQpLmdldFZhbHVlKClcbiAgICAgIHZhciBpdGVtcyA9IFtzZWxmLm9wdGlvbnMucGFnZUl0ZW1zVG9TdWJtaXQsIHNlbGYub3B0aW9ucy5jYXNjYWRpbmdJdGVtc11cbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICByZXR1cm4gKHNlbGVjdG9yKVxuICAgICAgICB9KVxuICAgICAgICAuam9pbignLCcpXG5cbiAgICAgIC8vIFN0b3JlIGxhc3Qgc2VhcmNoVGVybVxuICAgICAgc2VsZi5fbGFzdFNlYXJjaFRlcm0gPSBzZWFyY2hUZXJtXG5cbiAgICAgIGFwZXguc2VydmVyLnBsdWdpbihzZWxmLm9wdGlvbnMuYWpheElkZW50aWZpZXIsIHtcbiAgICAgICAgeDAxOiAnR0VUX0RBVEEnLFxuICAgICAgICB4MDI6IHNlYXJjaFRlcm0sIC8vIHNlYXJjaHRlcm1cbiAgICAgICAgeDAzOiBzZXR0aW5ncy5maXJzdFJvdywgLy8gZmlyc3Qgcm93bnVtIHRvIHJldHVyblxuICAgICAgICBwYWdlSXRlbXM6IGl0ZW1zXG4gICAgICB9LCB7XG4gICAgICAgIHRhcmdldDogc2VsZi5faXRlbSQsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGxvYWRpbmdJbmRpY2F0b3I6ICQucHJveHkob3B0aW9ucy5sb2FkaW5nSW5kaWNhdG9yLCBzZWxmKSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBEYXRhKSB7XG4gICAgICAgICAgc2VsZi5vcHRpb25zLmRhdGFTb3VyY2UgPSBwRGF0YVxuICAgICAgICAgIHNlbGYuX3RlbXBsYXRlRGF0YSA9IHNlbGYuX2dldFRlbXBsYXRlRGF0YSgpXG4gICAgICAgICAgaGFuZGxlcih7XG4gICAgICAgICAgICB3aWRnZXQ6IHNlbGYsXG4gICAgICAgICAgICBmaWxsU2VhcmNoVGV4dDogc2V0dGluZ3MuZmlsbFNlYXJjaFRleHRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaW5pdFNlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBpZiB0aGUgbGFzdFNlYXJjaFRlcm0gaXMgbm90IGVxdWFsIHRvIHRoZSBjdXJyZW50IHNlYXJjaFRlcm0sIHRoZW4gc2VhcmNoIGltbWVkaWF0ZVxuICAgICAgaWYgKHNlbGYuX2xhc3RTZWFyY2hUZXJtICE9PSBzZWxmLl90b3BBcGV4Lml0ZW0oc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKS5nZXRWYWx1ZSgpKSB7XG4gICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgIGZpcnN0Um93OiAxLFxuICAgICAgICAgIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvclxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fb25SZWxvYWQoKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBBY3Rpb24gd2hlbiB1c2VyIGlucHV0cyBzZWFyY2ggdGV4dFxuICAgICAgJCh3aW5kb3cudG9wLmRvY3VtZW50KS5vbigna2V5dXAnLCAnIycgKyBzZWxmLm9wdGlvbnMuc2VhcmNoRmllbGQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGZvciBuYXZpZ2F0aW9uIGtleXMsIGVzY2FwZSBhbmQgZW50ZXJcbiAgICAgICAgdmFyIG5hdmlnYXRpb25LZXlzID0gWzM3LCAzOCwgMzksIDQwLCA5LCAzMywgMzQsIDI3LCAxM11cbiAgICAgICAgaWYgKCQuaW5BcnJheShldmVudC5rZXlDb2RlLCBuYXZpZ2F0aW9uS2V5cykgPiAtMSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RvcCB0aGUgZW50ZXIga2V5IGZyb20gc2VsZWN0aW5nIGEgcm93XG4gICAgICAgIHNlbGYuX2FjdGl2ZURlbGF5ID0gdHJ1ZVxuXG4gICAgICAgIC8vIERvbid0IHNlYXJjaCBvbiBhbGwga2V5IGV2ZW50cyBidXQgYWRkIGEgZGVsYXkgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgIHZhciBzcmNFbCA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgICAgaWYgKHNyY0VsLmRlbGF5VGltZXIpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoc3JjRWwuZGVsYXlUaW1lcilcbiAgICAgICAgfVxuXG4gICAgICAgIHNyY0VsLmRlbGF5VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9nZXREYXRhKHtcbiAgICAgICAgICAgIGZpcnN0Um93OiAxLFxuICAgICAgICAgICAgbG9hZGluZ0luZGljYXRvcjogc2VsZi5fbW9kYWxMb2FkaW5nSW5kaWNhdG9yXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5fb25SZWxvYWQoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0sIDM1MClcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9pbml0UGFnaW5hdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB2YXIgcHJldlNlbGVjdG9yID0gJyMnICsgc2VsZi5vcHRpb25zLmlkICsgJyAudC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLXByZXYnXG4gICAgICB2YXIgbmV4dFNlbGVjdG9yID0gJyMnICsgc2VsZi5vcHRpb25zLmlkICsgJyAudC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLW5leHQnXG5cbiAgICAgIC8vIHJlbW92ZSBjdXJyZW50IGxpc3RlbmVyc1xuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkod2luZG93LnRvcC5kb2N1bWVudCkub2ZmKCdjbGljaycsIHByZXZTZWxlY3RvcilcbiAgICAgIHNlbGYuX3RvcEFwZXgualF1ZXJ5KHdpbmRvdy50b3AuZG9jdW1lbnQpLm9mZignY2xpY2snLCBuZXh0U2VsZWN0b3IpXG5cbiAgICAgIC8vIFByZXZpb3VzIHNldFxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2NsaWNrJywgcHJldlNlbGVjdG9yLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzZWxmLl9nZXREYXRhKHtcbiAgICAgICAgICBmaXJzdFJvdzogc2VsZi5fZ2V0Rmlyc3RSb3dudW1QcmV2U2V0KCksXG4gICAgICAgICAgbG9hZGluZ0luZGljYXRvcjogc2VsZi5fbW9kYWxMb2FkaW5nSW5kaWNhdG9yXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9vblJlbG9hZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBOZXh0IHNldFxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2NsaWNrJywgbmV4dFNlbGVjdG9yLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzZWxmLl9nZXREYXRhKHtcbiAgICAgICAgICBmaXJzdFJvdzogc2VsZi5fZ2V0Rmlyc3RSb3dudW1OZXh0U2V0KCksXG4gICAgICAgICAgbG9hZGluZ0luZGljYXRvcjogc2VsZi5fbW9kYWxMb2FkaW5nSW5kaWNhdG9yXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9vblJlbG9hZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfZ2V0Rmlyc3RSb3dudW1QcmV2U2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBzZWxmLl90ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5maXJzdFJvdyAtIHNlbGYub3B0aW9ucy5yb3dDb3VudFxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiAxXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRGaXJzdFJvd251bU5leHRTZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3RlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmxhc3RSb3cgKyAxXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIDE2XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9vcGVuTE9WOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBSZW1vdmUgcHJldmlvdXMgbW9kYWwtbG92IHJlZ2lvblxuICAgICAgJCgnIycgKyBzZWxmLm9wdGlvbnMuaWQsIGRvY3VtZW50KS5yZW1vdmUoKVxuXG4gICAgICBzZWxmLl9nZXREYXRhKHtcbiAgICAgICAgZmlyc3RSb3c6IDEsXG4gICAgICAgIHNlYXJjaFRlcm06IG9wdGlvbnMuc2VhcmNoVGVybSxcbiAgICAgICAgZmlsbFNlYXJjaFRleHQ6IG9wdGlvbnMuZmlsbFNlYXJjaFRleHQsXG4gICAgICAgIC8vIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX2l0ZW1Mb2FkaW5nSW5kaWNhdG9yXG4gICAgICB9LCBvcHRpb25zLmFmdGVyRGF0YSlcbiAgICB9LFxuXG4gICAgX2FkZENTU1RvVG9wTGV2ZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gQ1NTIGZpbGUgaXMgYWx3YXlzIHByZXNlbnQgd2hlbiB0aGUgY3VycmVudCB3aW5kb3cgaXMgdGhlIHRvcCB3aW5kb3csIHNvIGRvIG5vdGhpbmdcbiAgICAgIGlmICh3aW5kb3cgPT09IHdpbmRvdy50b3ApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB2YXIgY3NzU2VsZWN0b3IgPSAnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdW2hyZWYqPVwibW9kYWwtbG92XCJdJ1xuXG4gICAgICAvLyBDaGVjayBpZiBmaWxlIGV4aXN0cyBpbiB0b3Agd2luZG93XG4gICAgICBpZiAoc2VsZi5fdG9wQXBleC5qUXVlcnkoY3NzU2VsZWN0b3IpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSgnaGVhZCcpLmFwcGVuZCgkKGNzc1NlbGVjdG9yKS5jbG9uZSgpKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBGdW5jdGlvbiBiYXNlZCBvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzUxNzM0NDNcbiAgICBfZm9jdXNOZXh0RWxlbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgLy9hZGQgYWxsIGVsZW1lbnRzIHdlIHdhbnQgdG8gaW5jbHVkZSBpbiBvdXIgc2VsZWN0aW9uXG4gICAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBbXG4gICAgICAgICdhOm5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ1t0YWJpbmRleF06bm90KFtkaXNhYmxlZF0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgXS5qb2luKCcsICcpO1xuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5mb3JtKSB7XG4gICAgICAgIHZhciBmb2N1c2FibGUgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMpLFxuICAgICAgICAgIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAvL2NoZWNrIGZvciB2aXNpYmlsaXR5IHdoaWxlIGFsd2F5cyBpbmNsdWRlIHRoZSBjdXJyZW50IGFjdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldFdpZHRoID4gMCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDAgfHwgZWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICAgIH0pO1xuICAgICAgICB2YXIgaW5kZXggPSBmb2N1c2FibGUuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICB2YXIgbmV4dEVsZW1lbnQgPSBmb2N1c2FibGVbaW5kZXggKyAxXSB8fCBmb2N1c2FibGVbMF07XG4gICAgICAgICAgYXBleC5kZWJ1Zy50cmFjZSgnRkNTIExPViAtIGZvY3VzIG5leHQnKTtcbiAgICAgICAgICBuZXh0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEZ1bmN0aW9uIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNTE3MzQ0M1xuICAgIF9mb2N1c1ByZXZFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAvL2FkZCBhbGwgZWxlbWVudHMgd2Ugd2FudCB0byBpbmNsdWRlIGluIG91ciBzZWxlY3Rpb25cbiAgICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IFtcbiAgICAgICAgJ2E6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnW3RhYmluZGV4XTpub3QoW2Rpc2FibGVkXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICBdLmpvaW4oJywgJyk7XG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmZvcm0pIHtcbiAgICAgICAgdmFyIGZvY3VzYWJsZSA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChkb2N1bWVudC5hY3RpdmVFbGVtZW50LmZvcm0ucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cyksXG4gICAgICAgICAgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vY2hlY2sgZm9yIHZpc2liaWxpdHkgd2hpbGUgYWx3YXlzIGluY2x1ZGUgdGhlIGN1cnJlbnQgYWN0aXZlRWxlbWVudFxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCB8fCBlbGVtZW50ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgICAgfSk7XG4gICAgICAgIHZhciBpbmRleCA9IGZvY3VzYWJsZS5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgIHZhciBwcmV2RWxlbWVudCA9IGZvY3VzYWJsZVtpbmRleCAtIDFdIHx8IGZvY3VzYWJsZVswXTtcbiAgICAgICAgICBhcGV4LmRlYnVnLnRyYWNlKCdGQ1MgTE9WIC0gZm9jdXMgcHJldmlvdXMnKTtcbiAgICAgICAgICBwcmV2RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRJdGVtVmFsdWVzOiBmdW5jdGlvbiAocmV0dXJuVmFsdWUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciByZXBvcnRSb3c7XG4gICAgICBpZiAoc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydD8ucm93cz8ubGVuZ3RoKSB7XG4gICAgICAgIHJlcG9ydFJvdyA9IHNlbGYuX3RlbXBsYXRlRGF0YS5yZXBvcnQucm93cy5maW5kKHJvdyA9PiByb3cucmV0dXJuVmFsID09PSByZXR1cm5WYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLnNldFZhbHVlKHJlcG9ydFJvdz8ucmV0dXJuVmFsIHx8ICcnLCByZXBvcnRSb3c/LmRpc3BsYXlWYWwgfHwgJycpO1xuXG4gICAgICBpZiAoc2VsZi5vcHRpb25zLmFkZGl0aW9uYWxPdXRwdXRzU3RyKSB7XG4gICAgICAgIHNlbGYuX2luaXRHcmlkQ29uZmlnKClcblxuICAgICAgICB2YXIgZGF0YVJvdyA9IHNlbGYub3B0aW9ucy5kYXRhU291cmNlPy5yb3c/LmZpbmQocm93ID0+IHJvd1tzZWxmLm9wdGlvbnMucmV0dXJuQ29sXSA9PT0gcmV0dXJuVmFsdWUpO1xuXG4gICAgICAgIHNlbGYub3B0aW9ucy5hZGRpdGlvbmFsT3V0cHV0c1N0ci5zcGxpdCgnLCcpLmZvckVhY2goc3RyID0+IHtcbiAgICAgICAgICB2YXIgZGF0YUtleSA9IHN0ci5zcGxpdCgnOicpWzBdO1xuICAgICAgICAgIHZhciBpdGVtSWQgPSBzdHIuc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICB2YXIgY29sdW1uO1xuICAgICAgICAgIGlmIChzZWxmLl9ncmlkKSB7XG4gICAgICAgICAgICBjb2x1bW4gPSBzZWxmLl9ncmlkLmdldENvbHVtbnMoKT8uZmluZChjb2wgPT4gaXRlbUlkPy5pbmNsdWRlcyhjb2wucHJvcGVydHkpKVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgYWRkaXRpb25hbEl0ZW0gPSBhcGV4Lml0ZW0oY29sdW1uID8gY29sdW1uLmVsZW1lbnRJZCA6IGl0ZW1JZCk7XG5cbiAgICAgICAgICBpZiAoaXRlbUlkICYmIGRhdGFLZXkgJiYgYWRkaXRpb25hbEl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKGRhdGFSb3cgfHwge30pLmZpbmQoayA9PiBrLnRvVXBwZXJDYXNlKCkgPT09IGRhdGFLZXkpO1xuICAgICAgICAgICAgaWYgKGRhdGFSb3cgJiYgZGF0YVJvd1trZXldKSB7XG4gICAgICAgICAgICAgIGFkZGl0aW9uYWxJdGVtLnNldFZhbHVlKGRhdGFSb3dba2V5XSwgZGF0YVJvd1trZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFkZGl0aW9uYWxJdGVtLnNldFZhbHVlKCcnLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3RyaWdnZXJMT1ZPbkRpc3BsYXk6IGZ1bmN0aW9uIChjYWxsZWRGcm9tID0gbnVsbCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgIGlmIChjYWxsZWRGcm9tKSB7XG4gICAgICAgIGFwZXguZGVidWcudHJhY2UoJ190cmlnZ2VyTE9WT25EaXNwbGF5IGNhbGxlZCBmcm9tIFwiJyArIGNhbGxlZEZyb20gKyAnXCInKTtcbiAgICAgIH1cblxuICAgICAgLy8gVHJpZ2dlciBldmVudCBvbiBjbGljayBvdXRzaWRlIGVsZW1lbnRcbiAgICAgICQoZG9jdW1lbnQpLm1vdXNlZG93bihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgc2VsZi5faXRlbSQub2ZmKCdrZXlkb3duJylcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZWRvd24nKVxuXG4gICAgICAgIHZhciAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgIGlmICghJHRhcmdldC5jbG9zZXN0KCcjJyArIHNlbGYub3B0aW9ucy5pdGVtTmFtZSkubGVuZ3RoICYmICFzZWxmLl9pdGVtJC5pcyhcIjpmb2N1c1wiKSkge1xuICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwMSAtIG5vdCBmb2N1c2VkIGNsaWNrIG9mZicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkdGFyZ2V0LmNsb3Nlc3QoJyMnICsgc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDIgLSBjbGljayBvbiBpbnB1dCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkdGFyZ2V0LmNsb3Nlc3QoJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEJ1dHRvbikubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDAzIC0gY2xpY2sgb24gc2VhcmNoOiAnICsgc2VsZi5faXRlbSQudmFsKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkdGFyZ2V0LmNsb3Nlc3QoJy5mY3Mtc2VhcmNoLWNsZWFyJykubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA0IC0gY2xpY2sgb24gY2xlYXInKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNlbGYuX2l0ZW0kLnZhbCgpKSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA1IC0gbm8gaXRlbXMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5faXRlbSQudmFsKCkudG9VcHBlckNhc2UoKSA9PT0gYXBleC5pdGVtKHNlbGYub3B0aW9ucy5pdGVtTmFtZSkuZ2V0VmFsdWUoKS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDEwIC0gY2xpY2sgbm8gY2hhbmdlJylcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2xpY2sgb2ZmIC0gY2hlY2sgdmFsdWUnKVxuICAgICAgICBzZWxmLl9nZXREYXRhKHtcbiAgICAgICAgICBzZWFyY2hUZXJtOiBzZWxmLl9pdGVtJC52YWwoKSxcbiAgICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgICAvLyBsb2FkaW5nSW5kaWNhdG9yOiBzZWxmLl9tb2RhbExvYWRpbmdJbmRpY2F0b3JcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChzZWxmLl90ZW1wbGF0ZURhdGEucGFnaW5hdGlvblsncm93Q291bnQnXSA9PT0gMSkge1xuICAgICAgICAgICAgLy8gMSB2YWxpZCBvcHRpb24gbWF0Y2hlcyB0aGUgc2VhcmNoLiBVc2UgdmFsaWQgb3B0aW9uLlxuICAgICAgICAgICAgc2VsZi5fc2V0SXRlbVZhbHVlcyhzZWxmLl90ZW1wbGF0ZURhdGEucmVwb3J0LnJvd3NbMF0ucmV0dXJuVmFsKTtcbiAgICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwNiAtIGNsaWNrIG9mZiBtYXRjaCBmb3VuZCcpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9wZW4gdGhlIG1vZGFsXG4gICAgICAgICAgICBzZWxmLl9vcGVuTE9WKHtcbiAgICAgICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgICAgIGZpbGxTZWFyY2hUZXh0OiB0cnVlLFxuICAgICAgICAgICAgICBhZnRlckRhdGE6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fb25Mb2FkKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLy8gQ2xlYXIgaW5wdXQgYXMgc29vbiBhcyBtb2RhbCBpcyByZWFkeVxuICAgICAgICAgICAgICAgIHNlbGYuX3JldHVyblZhbHVlID0gJydcbiAgICAgICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwoJycpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRyaWdnZXIgZXZlbnQgb24gdGFiIG9yIGVudGVyXG4gICAgICBzZWxmLl9pdGVtJC5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYuX2l0ZW0kLm9mZigna2V5ZG93bicpXG4gICAgICAgICQoZG9jdW1lbnQpLm9mZignbW91c2Vkb3duJylcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygna2V5ZG93bicsIGUua2V5Q29kZSlcblxuICAgICAgICBpZiAoKGUua2V5Q29kZSA9PT0gOSAmJiAhIXNlbGYuX2l0ZW0kLnZhbCgpKSB8fCBlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgLy8gU3RvcCB0YWIgZXZlbnRcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA5KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VsZi5faXRlbSQudmFsKCkudG9VcHBlckNhc2UoKSA9PT0gYXBleC5pdGVtKHNlbGYub3B0aW9ucy5pdGVtTmFtZSkuZ2V0VmFsdWUoKS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmlzUHJldkluZGV4KSB7XG4gICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IGZhbHNlXG4gICAgICAgICAgICAgIHNlbGYuX2ZvY3VzUHJldkVsZW1lbnQoKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2ZvY3VzTmV4dEVsZW1lbnQoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDExIC0ga2V5IG5vIGNoYW5nZScpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2tleWRvd24gdGFiIG9yIGVudGVyIC0gY2hlY2sgdmFsdWUnKVxuICAgICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgICAgIC8vIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvclxuICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLl90ZW1wbGF0ZURhdGEucGFnaW5hdGlvblsncm93Q291bnQnXSA9PT0gMSkge1xuICAgICAgICAgICAgICAvLyAxIHZhbGlkIG9wdGlvbiBtYXRjaGVzIHRoZSBzZWFyY2guIFVzZSB2YWxpZCBvcHRpb24uXG4gICAgICAgICAgICAgIHNlbGYuX3NldEl0ZW1WYWx1ZXMoc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzWzBdLnJldHVyblZhbCk7XG4gICAgICAgICAgICAgIHNlbGYuX3Jlc2V0Rm9jdXMoKTtcbiAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCkge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZvY3VzUHJldkVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9mb2N1c05leHRFbGVtZW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA3IC0ga2V5IG9mZiBtYXRjaCBmb3VuZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gT3BlbiB0aGUgbW9kYWxcbiAgICAgICAgICAgICAgc2VsZi5fb3BlbkxPVih7XG4gICAgICAgICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYWZ0ZXJEYXRhOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgc2VsZi5fb25Mb2FkKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAvLyBDbGVhciBpbnB1dCBhcyBzb29uIGFzIG1vZGFsIGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9ICcnXG4gICAgICAgICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwoJycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA4IC0ga2V5IGRvd24nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfdHJpZ2dlckxPVk9uQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIFRyaWdnZXIgZXZlbnQgb24gY2xpY2sgaW5wdXQgZ3JvdXAgYWRkb24gYnV0dG9uIChtYWduaWZpZXIgZ2xhc3MpXG4gICAgICBzZWxmLl9zZWFyY2hCdXR0b24kLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYuX29wZW5MT1Yoe1xuICAgICAgICAgIHNlYXJjaFRlcm06IHNlbGYuX2l0ZW0kLnZhbCgpIHx8ICcnLFxuICAgICAgICAgIGZpbGxTZWFyY2hUZXh0OiB0cnVlLFxuICAgICAgICAgIGFmdGVyRGF0YTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHNlbGYuX29uTG9hZChvcHRpb25zKVxuICAgICAgICAgICAgLy8gQ2xlYXIgaW5wdXQgYXMgc29vbiBhcyBtb2RhbCBpcyByZWFkeVxuICAgICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSAnJ1xuICAgICAgICAgICAgc2VsZi5faXRlbSQudmFsKCcnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9vblJvd0hvdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5vbignbW91c2VlbnRlciBtb3VzZWxlYXZlJywgJy50LVJlcG9ydC1yZXBvcnQgdGJvZHkgdHInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdtYXJrJykpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKHNlbGYub3B0aW9ucy5ob3ZlckNsYXNzZXMpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfc2VsZWN0SW5pdGlhbFJvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBJZiBjdXJyZW50IGl0ZW0gaW4gTE9WIHRoZW4gc2VsZWN0IHRoYXQgcm93XG4gICAgICAvLyBFbHNlIHNlbGVjdCBmaXJzdCByb3cgb2YgcmVwb3J0XG4gICAgICB2YXIgJGN1clJvdyA9IHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1SZXBvcnQtcmVwb3J0IHRyW2RhdGEtcmV0dXJuPVwiJyArIHNlbGYuX3JldHVyblZhbHVlICsgJ1wiXScpXG4gICAgICBpZiAoJGN1clJvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgICRjdXJSb3cuYWRkQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1SZXBvcnQtcmVwb3J0IHRyW2RhdGEtcmV0dXJuXScpLmZpcnN0KCkuYWRkQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRLZXlib2FyZE5hdmlnYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICBmdW5jdGlvbiBuYXZpZ2F0ZShkaXJlY3Rpb24sIGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdmFyIGN1cnJlbnRSb3cgPSBzZWxmLl9tb2RhbERpYWxvZyQuZmluZCgnLnQtUmVwb3J0LXJlcG9ydCB0ci5tYXJrJylcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBpZiAoJChjdXJyZW50Um93KS5wcmV2KCkuaXMoJy50LVJlcG9ydC1yZXBvcnQgdHInKSkge1xuICAgICAgICAgICAgICAkKGN1cnJlbnRSb3cpLnJlbW92ZUNsYXNzKCdtYXJrICcgKyBzZWxmLm9wdGlvbnMubWFya0NsYXNzZXMpLnByZXYoKS5hZGRDbGFzcygnbWFyayAnICsgc2VsZi5vcHRpb25zLm1hcmtDbGFzc2VzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIGlmICgkKGN1cnJlbnRSb3cpLm5leHQoKS5pcygnLnQtUmVwb3J0LXJlcG9ydCB0cicpKSB7XG4gICAgICAgICAgICAgICQoY3VycmVudFJvdykucmVtb3ZlQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcykubmV4dCgpLmFkZENsYXNzKCdtYXJrICcgKyBzZWxmLm9wdGlvbnMubWFya0NsYXNzZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICQod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXG4gICAgICAgICAgICBuYXZpZ2F0ZSgndXAnLCBlKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnZG93bicsIGUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnZG93bicsIGUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICBpZiAoIXNlbGYuX2FjdGl2ZURlbGF5KSB7XG4gICAgICAgICAgICAgIHZhciBjdXJyZW50Um93ID0gc2VsZi5fbW9kYWxEaWFsb2ckLmZpbmQoJy50LVJlcG9ydC1yZXBvcnQgdHIubWFyaycpLmZpcnN0KClcbiAgICAgICAgICAgICAgc2VsZi5fcmV0dXJuU2VsZWN0ZWRSb3coY3VycmVudFJvdylcbiAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzM6IC8vIFBhZ2UgdXBcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkoJyMnICsgc2VsZi5vcHRpb25zLmlkICsgJyAudC1CdXR0b25SZWdpb24tYnV0dG9ucyAudC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLXByZXYnKS50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzQ6IC8vIFBhZ2UgZG93blxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSgnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LUJ1dHRvblJlZ2lvbi1idXR0b25zIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tbmV4dCcpLnRyaWdnZXIoJ2NsaWNrJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9yZXR1cm5TZWxlY3RlZFJvdzogZnVuY3Rpb24gKCRyb3cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAvLyBEbyBub3RoaW5nIGlmIHJvdyBkb2VzIG5vdCBleGlzdFxuICAgICAgaWYgKCEkcm93IHx8ICRyb3cubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhcGV4Lml0ZW0oc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5zZXRWYWx1ZShzZWxmLl91bmVzY2FwZSgkcm93LmRhdGEoJ3JldHVybicpLnRvU3RyaW5nKCkpLCBzZWxmLl91bmVzY2FwZSgkcm93LmRhdGEoJ2Rpc3BsYXknKSkpXG5cblxuICAgICAgLy8gVHJpZ2dlciBhIGN1c3RvbSBldmVudCBhbmQgYWRkIGRhdGEgdG8gaXQ6IGFsbCBjb2x1bW5zIG9mIHRoZSByb3dcbiAgICAgIHZhciBkYXRhID0ge31cbiAgICAgICQuZWFjaCgkKCcudC1SZXBvcnQtcmVwb3J0IHRyLm1hcmsnKS5maW5kKCd0ZCcpLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgZGF0YVskKHZhbCkuYXR0cignaGVhZGVycycpXSA9ICQodmFsKS5odG1sKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmFsbHkgaGlkZSB0aGUgbW9kYWxcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5kaWFsb2coJ2Nsb3NlJylcbiAgICB9LFxuXG4gICAgX29uUm93U2VsZWN0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gQWN0aW9uIHdoZW4gcm93IGlzIGNsaWNrZWRcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5vbignY2xpY2snLCAnLm1vZGFsLWxvdi10YWJsZSAudC1SZXBvcnQtcmVwb3J0IHRib2R5IHRyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5fcmV0dXJuU2VsZWN0ZWRSb3coc2VsZi5fdG9wQXBleC5qUXVlcnkodGhpcykpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlVmFsaWRhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQ2xlYXIgY3VycmVudCBlcnJvcnNcbiAgICAgIGFwZXgubWVzc2FnZS5jbGVhckVycm9ycyh0aGlzLm9wdGlvbnMuaXRlbU5hbWUpXG4gICAgfSxcblxuICAgIF9jbGVhcklucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHNlbGYuX3NldEl0ZW1WYWx1ZXMoJycpXG4gICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9ICcnXG4gICAgICBzZWxmLl9yZW1vdmVWYWxpZGF0aW9uKClcbiAgICAgIHNlbGYuX2l0ZW0kLmZvY3VzKClcbiAgICB9LFxuXG4gICAgX2luaXRDbGVhcklucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgc2VsZi5fY2xlYXJJbnB1dCQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9jbGVhcklucHV0KClcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9pbml0Q2FzY2FkaW5nTE9WczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAkKHNlbGYub3B0aW9ucy5jYXNjYWRpbmdJdGVtcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5fY2xlYXJJbnB1dCgpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfc2V0VmFsdWVCYXNlZE9uRGlzcGxheTogZnVuY3Rpb24gKHBWYWx1ZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgIHZhciBwcm9taXNlID0gYXBleC5zZXJ2ZXIucGx1Z2luKHNlbGYub3B0aW9ucy5hamF4SWRlbnRpZmllciwge1xuICAgICAgICB4MDE6ICdHRVRfVkFMVUUnLFxuICAgICAgICB4MDI6IHBWYWx1ZSAvLyByZXR1cm5WYWxcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgbG9hZGluZ0luZGljYXRvcjogJC5wcm94eShzZWxmLl9pdGVtTG9hZGluZ0luZGljYXRvciwgc2VsZiksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICAgIHNlbGYuX2Rpc2FibGVDaGFuZ2VFdmVudCA9IGZhbHNlXG4gICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSBwRGF0YS5yZXR1cm5WYWx1ZVxuICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbChwRGF0YS5kaXNwbGF5VmFsdWUpXG4gICAgICAgICAgc2VsZi5faXRlbSQudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcHJvbWlzZVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAocERhdGEpIHtcbiAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9IHBEYXRhLnJldHVyblZhbHVlXG4gICAgICAgICAgc2VsZi5faXRlbSQudmFsKHBEYXRhLmRpc3BsYXlWYWx1ZSlcbiAgICAgICAgICBzZWxmLl9pdGVtJC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICAgICB9KVxuICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9kaXNhYmxlQ2hhbmdlRXZlbnQgPSBmYWxzZVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBfaW5pdEFwZXhJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIFNldCBhbmQgZ2V0IHZhbHVlIHZpYSBhcGV4IGZ1bmN0aW9uc1xuICAgICAgYXBleC5pdGVtLmNyZWF0ZShzZWxmLm9wdGlvbnMuaXRlbU5hbWUsIHtcbiAgICAgICAgZW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5faXRlbSQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICAgICAgICBzZWxmLl9zZWFyY2hCdXR0b24kLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgc2VsZi5fY2xlYXJJbnB1dCQuc2hvdygpXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9pdGVtJC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgc2VsZi5fY2xlYXJJbnB1dCQuaGlkZSgpXG4gICAgICAgIH0sXG4gICAgICAgIGlzRGlzYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5faXRlbSQucHJvcCgnZGlzYWJsZWQnKVxuICAgICAgICB9LFxuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5faXRlbSQuc2hvdygpXG4gICAgICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJC5zaG93KClcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX2l0ZW0kLmhpZGUoKVxuICAgICAgICAgIHNlbGYuX3NlYXJjaEJ1dHRvbiQuaGlkZSgpXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uIChwVmFsdWUsIHBEaXNwbGF5VmFsdWUsIHBTdXBwcmVzc0NoYW5nZUV2ZW50KSB7XG4gICAgICAgICAgaWYgKHBEaXNwbGF5VmFsdWUgfHwgIXBWYWx1ZSB8fCBwVmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBBc3N1bWluZyBubyBjaGVjayBpcyBuZWVkZWQgdG8gc2VlIGlmIHRoZSB2YWx1ZSBpcyBpbiB0aGUgTE9WXG4gICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwocERpc3BsYXlWYWx1ZSlcbiAgICAgICAgICAgIHNlbGYuX3JldHVyblZhbHVlID0gcFZhbHVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbChwRGlzcGxheVZhbHVlKVxuICAgICAgICAgICAgc2VsZi5fZGlzYWJsZUNoYW5nZUV2ZW50ID0gdHJ1ZVxuICAgICAgICAgICAgc2VsZi5fc2V0VmFsdWVCYXNlZE9uRGlzcGxheShwVmFsdWUpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIEFsd2F5cyByZXR1cm4gYXQgbGVhc3QgYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3JldHVyblZhbHVlIHx8ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGlzQ2hhbmdlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLnZhbHVlICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmRlZmF1bHRWYWx1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gT3JpZ2luYWwgSlMgZm9yIHVzZSBiZWZvcmUgQVBFWCAyMC4yXG4gICAgICAvLyBhcGV4Lml0ZW0oc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5jYWxsYmFja3MuZGlzcGxheVZhbHVlRm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICByZXR1cm4gc2VsZi5faXRlbSQudmFsKClcbiAgICAgIC8vIH1cbiAgICAgIC8vIE5ldyBKUyBmb3IgcG9zdCBBUEVYIDIwLjIgd29ybGRcbiAgICAgIGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmRpc3BsYXlWYWx1ZUZvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2l0ZW0kLnZhbCgpXG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgdHJpZ2dlciB0aGUgY2hhbmdlIGV2ZW50IGFmdGVyIHRoZSBBc3luYyBjYWxsYmFjayBpZiBuZWVkZWRcbiAgICAgIHNlbGYuX2l0ZW0kWyd0cmlnZ2VyJ10gPSBmdW5jdGlvbiAodHlwZSwgZGF0YSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2NoYW5nZScgJiYgc2VsZi5fZGlzYWJsZUNoYW5nZUV2ZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgJC5mbi50cmlnZ2VyLmNhbGwoc2VsZi5faXRlbSQsIHR5cGUsIGRhdGEpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9pdGVtTG9hZGluZ0luZGljYXRvcjogZnVuY3Rpb24gKGxvYWRpbmdJbmRpY2F0b3IpIHtcbiAgICAgICQoJyMnICsgdGhpcy5vcHRpb25zLnNlYXJjaEJ1dHRvbikuYWZ0ZXIobG9hZGluZ0luZGljYXRvcilcbiAgICAgIHJldHVybiBsb2FkaW5nSW5kaWNhdG9yXG4gICAgfSxcblxuICAgIF9tb2RhbExvYWRpbmdJbmRpY2F0b3I6IGZ1bmN0aW9uIChsb2FkaW5nSW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLl9tb2RhbERpYWxvZyQucHJlcGVuZChsb2FkaW5nSW5kaWNhdG9yKVxuICAgICAgcmV0dXJuIGxvYWRpbmdJbmRpY2F0b3JcbiAgICB9XG4gIH0pXG59KShhcGV4LmpRdWVyeSwgd2luZG93KVxuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzgsXCI+PSA0LjMuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGFsaWFzMj1jb250YWluZXIuaG9va3MuaGVscGVyTWlzc2luZywgYWxpYXMzPVwiZnVuY3Rpb25cIiwgYWxpYXM0PWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBhbGlhczU9Y29udGFpbmVyLmxhbWJkYSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiPGRpdiBpZD1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiaWRcIikgfHwgKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwiaWRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjo5fSxcImVuZFwiOntcImxpbmVcIjoxLFwiY29sdW1uXCI6MTV9fX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcInQtRGlhbG9nUmVnaW9uIGpzLXJlZ2llb25EaWFsb2cgdC1Gb3JtLS1zdHJldGNoSW5wdXRzIHQtRm9ybS0tbGFyZ2UgbW9kYWwtbG92XFxcIiB0aXRsZT1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwidGl0bGVcIikgfHwgKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwidGl0bGVcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjoxMTB9LFwiZW5kXCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjoxMTl9fX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInQtRGlhbG9nUmVnaW9uLWJvZHkganMtcmVnaW9uRGlhbG9nLWJvZHkgbm8tcGFkZGluZ1xcXCIgXCJcbiAgICArICgoc3RhY2sxID0gYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmVnaW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcImF0dHJpYnV0ZXNcIikgOiBzdGFjazEpLCBkZXB0aDApKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wgY29sLTEyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtUmVwb3J0IHQtUmVwb3J0LS1hbHRSb3dzRGVmYXVsdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1SZXBvcnQtd3JhcFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1Gb3JtLWZpZWxkQ29udGFpbmVyIHQtRm9ybS1maWVsZENvbnRhaW5lci0tc3RhY2tlZCB0LUZvcm0tZmllbGRDb250YWluZXItLXN0cmV0Y2hJbnB1dHMgbWFyZ2luLXRvcC1zbVxcXCIgaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwic2VhcmNoRmllbGRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiaWRcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJfQ09OVEFJTkVSXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtRm9ybS1pbnB1dENvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1Gb3JtLWl0ZW1XcmFwcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJhcGV4LWl0ZW0tdGV4dCBtb2RhbC1sb3YtaXRlbSBcIlxuICAgICsgYWxpYXM0KGFsaWFzNSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInNlYXJjaEZpZWxkXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInRleHRDYXNlXCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiIFxcXCIgaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwic2VhcmNoRmllbGRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiaWRcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJcXFwiIGF1dG9jb21wbGV0ZT1cXFwib2ZmXFxcIiBwbGFjZWhvbGRlcj1cXFwiXCJcbiAgICArIGFsaWFzNChhbGlhczUoKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJzZWFyY2hGaWVsZFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJwbGFjZWhvbGRlclwiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwiUDExMTBfWkFBTF9GS19DT0RFX0JVVFRPTlxcXCIgY2xhc3M9XFxcImEtQnV0dG9uIGZjcy1tb2RhbC1sb3YtYnV0dG9uIGEtQnV0dG9uLS1wb3B1cExPVlxcXCIgdGFiSW5kZXg9XFxcIi0xXFxcIiBzdHlsZT1cXFwibWFyZ2luLWxlZnQ6LTQwcHg7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCk7XFxcIiBkaXNhYmxlZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJmYSBmYS1zZWFyY2hcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5pbnZva2VQYXJ0aWFsKGxvb2t1cFByb3BlcnR5KHBhcnRpYWxzLFwicmVwb3J0XCIpLGRlcHRoMCx7XCJuYW1lXCI6XCJyZXBvcnRcIixcImRhdGFcIjpkYXRhLFwiaW5kZW50XCI6XCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsXCJoZWxwZXJzXCI6aGVscGVycyxcInBhcnRpYWxzXCI6cGFydGlhbHMsXCJkZWNvcmF0b3JzXCI6Y29udGFpbmVyLmRlY29yYXRvcnN9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0LURpYWxvZ1JlZ2lvbi1idXR0b25zIGpzLXJlZ2lvbkRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInQtQnV0dG9uUmVnaW9uIHQtQnV0dG9uUmVnaW9uLS1kaWFsb2dSZWdpb25cXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtQnV0dG9uUmVnaW9uLXdyYXBcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5pbnZva2VQYXJ0aWFsKGxvb2t1cFByb3BlcnR5KHBhcnRpYWxzLFwicGFnaW5hdGlvblwiKSxkZXB0aDAse1wibmFtZVwiOlwicGFnaW5hdGlvblwiLFwiZGF0YVwiOmRhdGEsXCJpbmRlbnRcIjpcIiAgICAgICAgICAgICAgICBcIixcImhlbHBlcnNcIjpoZWxwZXJzLFwicGFydGlhbHNcIjpwYXJ0aWFscyxcImRlY29yYXRvcnNcIjpjb250YWluZXIuZGVjb3JhdG9yc30pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCI7XG59LFwidXNlUGFydGlhbFwiOnRydWUsXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLCBhbGlhczI9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMzPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1jb2wgdC1CdXR0b25SZWdpb24tY29sLS1sZWZ0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidC1CdXR0b25SZWdpb24tYnV0dG9uc1xcXCI+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImlmXCIpLmNhbGwoYWxpYXMxLCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJhbGxvd1ByZXZcIikgOiBzdGFjazEpLHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDIsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjo0LFwiY29sdW1uXCI6Nn0sXCJlbmRcIjp7XCJsaW5lXCI6OCxcImNvbHVtblwiOjEzfX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1jb2wgdC1CdXR0b25SZWdpb24tY29sLS1jZW50ZXJcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXG4gIFwiXG4gICAgKyBhbGlhczMoYWxpYXMyKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJmaXJzdFJvd1wiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIiAtIFwiXG4gICAgKyBhbGlhczMoYWxpYXMyKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJsYXN0Um93XCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwidC1CdXR0b25SZWdpb24tY29sIHQtQnV0dG9uUmVnaW9uLWNvbC0tcmlnaHRcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1idXR0b25zXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiaWZcIikuY2FsbChhbGlhczEsKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJwYWdpbmF0aW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcImFsbG93TmV4dFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjE2LFwiY29sdW1uXCI6Nn0sXCJlbmRcIjp7XCJsaW5lXCI6MjAsXCJjb2x1bW5cIjoxM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiICAgICAgICA8YSBocmVmPVxcXCJqYXZhc2NyaXB0OnZvaWQoMCk7XFxcIiBjbGFzcz1cXFwidC1CdXR0b24gdC1CdXR0b24tLXNtYWxsIHQtQnV0dG9uLS1ub1VJIHQtUmVwb3J0LXBhZ2luYXRpb25MaW5rIHQtUmVwb3J0LXBhZ2luYXRpb25MaW5rLS1wcmV2XFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImEtSWNvbiBpY29uLWxlZnQtYXJyb3dcXFwiPjwvc3Bhbj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInBhZ2luYXRpb25cIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwicHJldmlvdXNcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJcXG4gICAgICAgIDwvYT5cXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgICAgIDxhIGhyZWY9XFxcImphdmFzY3JpcHQ6dm9pZCgwKTtcXFwiIGNsYXNzPVxcXCJ0LUJ1dHRvbiB0LUJ1dHRvbi0tc21hbGwgdC1CdXR0b24tLW5vVUkgdC1SZXBvcnQtcGFnaW5hdGlvbkxpbmsgdC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLW5leHRcXFwiPlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbihjb250YWluZXIubGFtYmRhKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJuZXh0XCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJhLUljb24gaWNvbi1yaWdodC1hcnJvd1xcXCI+PC9zcGFuPlxcbiAgICAgICAgPC9hPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzgsXCI+PSA0LjMuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJwYWdpbmF0aW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInJvd0NvdW50XCIpIDogc3RhY2sxKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MSxcImNvbHVtblwiOjB9LFwiZW5kXCI6e1wibGluZVwiOjIzLFwiY29sdW1uXCI6N319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgb3B0aW9ucywgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9LCBidWZmZXIgPSBcbiAgXCIgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIHN1bW1hcnk9XFxcIlxcXCIgY2xhc3M9XFxcInQtUmVwb3J0LXJlcG9ydCBcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJjbGFzc2VzXCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxcIiB3aWR0aD1cXFwiMTAwJVxcXCI+XFxuICAgICAgICAgICAgICA8dGJvZHk+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImlmXCIpLmNhbGwoYWxpYXMxLCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmVwb3J0XCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInNob3dIZWFkZXJzXCIpIDogc3RhY2sxKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MTIsXCJjb2x1bW5cIjoxNn0sXCJlbmRcIjp7XCJsaW5lXCI6MjQsXCJjb2x1bW5cIjoyM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcInJlcG9ydFwiKSB8fCAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJyZXBvcnRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogY29udGFpbmVyLmhvb2tzLmhlbHBlck1pc3NpbmcpLChvcHRpb25zPXtcIm5hbWVcIjpcInJlcG9ydFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSg4LCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MjUsXCJjb2x1bW5cIjoxNn0sXCJlbmRcIjp7XCJsaW5lXCI6MjgsXCJjb2x1bW5cIjoyN319fSksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGFsaWFzMSxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJyZXBvcnRcIikpIHsgc3RhY2sxID0gY29udGFpbmVyLmhvb2tzLmJsb2NrSGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIiAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgIDx0aGVhZD5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJyZXBvcnRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiY29sdW1uc1wiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgzLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MTQsXCJjb2x1bW5cIjoyMH0sXCJlbmRcIjp7XCJsaW5lXCI6MjIsXCJjb2x1bW5cIjoyOX19fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxcblwiO1xufSxcIjNcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XFxcInQtUmVwb3J0LWNvbEhlYWRcXFwiIGlkPVxcXCJcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImtleVwiKSB8fCAoZGF0YSAmJiBsb29rdXBQcm9wZXJ0eShkYXRhLFwia2V5XCIpKSkgIT0gbnVsbCA/IGhlbHBlciA6IGNvbnRhaW5lci5ob29rcy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImtleVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjoxNSxcImNvbHVtblwiOjU1fSxcImVuZFwiOntcImxpbmVcIjoxNSxcImNvbHVtblwiOjYzfX19KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGFsaWFzMSwoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJsYWJlbFwiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLnByb2dyYW0oNiwgZGF0YSwgMCksXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjE2LFwiY29sdW1uXCI6MjR9LFwiZW5kXCI6e1wibGluZVwiOjIwLFwiY29sdW1uXCI6MzF9fX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKGNvbnRhaW5lci5sYW1iZGEoKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwibGFiZWxcIikgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCJcXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJuYW1lXCIpIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuXCI7XG59LFwiOFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gY29udGFpbmVyLmludm9rZVBhcnRpYWwobG9va3VwUHJvcGVydHkocGFydGlhbHMsXCJyb3dzXCIpLGRlcHRoMCx7XCJuYW1lXCI6XCJyb3dzXCIsXCJkYXRhXCI6ZGF0YSxcImluZGVudFwiOlwiICAgICAgICAgICAgICAgICAgXCIsXCJoZWxwZXJzXCI6aGVscGVycyxcInBhcnRpYWxzXCI6cGFydGlhbHMsXCJkZWNvcmF0b3JzXCI6Y29udGFpbmVyLmRlY29yYXRvcnN9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcIjEwXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgPHNwYW4gY2xhc3M9XFxcIm5vZGF0YWZvdW5kXFxcIj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJub0RhdGFGb3VuZFwiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIjwvc3Bhbj5cXG5cIjtcbn0sXCJjb21waWxlclwiOls4LFwiPj0gNC4zLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBhbGlhczE9ZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiAoY29udGFpbmVyLm51bGxDb250ZXh0IHx8IHt9KSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwidC1SZXBvcnQtdGFibGVXcmFwIG1vZGFsLWxvdi10YWJsZVxcXCI+XFxuICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGNsYXNzPVxcXCJcXFwiIHdpZHRoPVxcXCIxMDAlXFxcIj5cXG4gICAgPHRib2R5PlxcbiAgICAgIDx0cj5cXG4gICAgICAgIDx0ZD48L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGFsaWFzMSwoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJyb3dDb3VudFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjksXCJjb2x1bW5cIjoxMH0sXCJlbmRcIjp7XCJsaW5lXCI6MzEsXCJjb2x1bW5cIjoxN319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgICAgIDwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgPC90Ym9keT5cXG4gIDwvdGFibGU+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcInVubGVzc1wiKS5jYWxsKGFsaWFzMSwoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJyb3dDb3VudFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDEwLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MzYsXCJjb2x1bW5cIjoyfSxcImVuZFwiOntcImxpbmVcIjozOCxcImNvbHVtblwiOjEzfX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvZGl2PlxcblwiO1xufSxcInVzZVBhcnRpYWxcIjp0cnVlLFwidXNlRGF0YVwiOnRydWV9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBhbGlhczE9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMyPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgIDx0ciBkYXRhLXJldHVybj1cXFwiXCJcbiAgICArIGFsaWFzMihhbGlhczEoKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmV0dXJuVmFsXCIpIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiXFxcIiBkYXRhLWRpc3BsYXk9XFxcIlwiXG4gICAgKyBhbGlhczIoYWxpYXMxKChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcImRpc3BsYXlWYWxcIikgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJwb2ludGVyXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwiY29sdW1uc1wiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MyxcImNvbHVtblwiOjR9LFwiZW5kXCI6e1wibGluZVwiOjUsXCJjb2x1bW5cIjoxM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgIDwvdHI+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlciwgYWxpYXMxPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgICA8dGQgaGVhZGVycz1cXFwiXCJcbiAgICArIGFsaWFzMSgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwia2V5XCIpIHx8IChkYXRhICYmIGxvb2t1cFByb3BlcnR5KGRhdGEsXCJrZXlcIikpKSAhPSBudWxsID8gaGVscGVyIDogY29udGFpbmVyLmhvb2tzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLHtcIm5hbWVcIjpcImtleVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjo0LFwiY29sdW1uXCI6MTl9LFwiZW5kXCI6e1wibGluZVwiOjQsXCJjb2x1bW5cIjoyN319fSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwidC1SZXBvcnQtY2VsbFxcXCI+XCJcbiAgICArIGFsaWFzMShjb250YWluZXIubGFtYmRhKGRlcHRoMCwgZGVwdGgwKSlcbiAgICArIFwiPC90ZD5cXG5cIjtcbn0sXCJjb21waWxlclwiOls4LFwiPj0gNC4zLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicm93c1wiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MSxcImNvbHVtblwiOjB9LFwiZW5kXCI6e1wibGluZVwiOjcsXCJjb2x1bW5cIjo5fX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iXX0=
