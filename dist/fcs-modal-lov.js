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
      searchFirstColOnly: true,
      nextOnEnter: true,
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
        if (self.options.returnOnEnterKey && self.options.nextOnEnter) {
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
          // No changes, no further processing (if not enter press on empty input).
          if (self._item$.val().toUpperCase() === apex.item(self.options.itemName).getValue().toUpperCase()
            && !(e.keyCode === 13 && !self._item$.val())) {
            self._triggerLOVOnDisplay('011 - key no change')
            return;
          }

          if (e.keyCode === 9) {
            // Stop tab event
            e.preventDefault()
            if (e.shiftKey) {
              self.options.isPrevIndex = true
            }
          } else if (e.keyCode === 13) {
            // Stop enter event
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
              if (e.keyCode === 13) {
                if (self.options.nextOnEnter) {
                  self._focusNextElement();
                }
              } else if (self.options.isPrevIndex) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvYmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9kZWNvcmF0b3JzL2lubGluZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2Jsb2NrLWhlbHBlci1taXNzaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9oZWxwZXJzL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2lmLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9sb2cuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2xvb2t1cC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL2NyZWF0ZS1uZXctbG9va3VwLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL3Byb3RvLWFjY2Vzcy5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2ludGVybmFsL3dyYXBIZWxwZXIuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9sb2dnZXIuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyIsInNyYy9qcy9mY3MtbW9kYWwtbG92LmpzIiwic3JjL2pzL3RlbXBsYXRlcy9tb2RhbC1yZXBvcnQuaGJzIiwic3JjL2pzL3RlbXBsYXRlcy9wYXJ0aWFscy9fcGFnaW5hdGlvbi5oYnMiLCJzcmMvanMvdGVtcGxhdGVzL3BhcnRpYWxzL19yZXBvcnQuaGJzIiwic3JjL2pzL3RlbXBsYXRlcy9wYXJ0aWFscy9fcm93cy5oYnMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs4QkNBc0IsbUJBQW1COztJQUE3QixJQUFJOzs7OztvQ0FJTywwQkFBMEI7Ozs7bUNBQzNCLHdCQUF3Qjs7OzsrQkFDdkIsb0JBQW9COztJQUEvQixLQUFLOztpQ0FDUSxzQkFBc0I7O0lBQW5DLE9BQU87O29DQUVJLDBCQUEwQjs7Ozs7QUFHakQsU0FBUyxNQUFNLEdBQUc7QUFDaEIsTUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzK0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi9oYW5kbGViYXJzL2Jhc2UnO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxuaW1wb3J0IFNhZmVTdHJpbmcgZnJvbSAnLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi9oYW5kbGViYXJzL2V4Y2VwdGlvbic7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL2hhbmRsZWJhcnMvdXRpbHMnO1xuaW1wb3J0ICogYXMgcnVudGltZSBmcm9tICcuL2hhbmRsZWJhcnMvcnVudGltZSc7XG5cbmltcG9ydCBub0NvbmZsaWN0IGZyb20gJy4vaGFuZGxlYmFycy9uby1jb25mbGljdCc7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxuZnVuY3Rpb24gY3JlYXRlKCkge1xuICBsZXQgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuICBoYi5lc2NhcGVFeHByZXNzaW9uID0gVXRpbHMuZXNjYXBlRXhwcmVzc2lvbjtcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59XG5cbmxldCBpbnN0ID0gY3JlYXRlKCk7XG5pbnN0LmNyZWF0ZSA9IGNyZWF0ZTtcblxubm9Db25mbGljdChpbnN0KTtcblxuaW5zdFsnZGVmYXVsdCddID0gaW5zdDtcblxuZXhwb3J0IGRlZmF1bHQgaW5zdDtcbiIsImltcG9ydCB7IGNyZWF0ZUZyYW1lLCBleHRlbmQsIHRvU3RyaW5nIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7IHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyB9IGZyb20gJy4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IHJlc2V0TG9nZ2VkUHJvcGVydGllcyB9IGZyb20gJy4vaW50ZXJuYWwvcHJvdG8tYWNjZXNzJztcblxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnNC43LjcnO1xuZXhwb3J0IGNvbnN0IENPTVBJTEVSX1JFVklTSU9OID0gODtcbmV4cG9ydCBjb25zdCBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04gPSA3O1xuXG5leHBvcnQgY29uc3QgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc9PSAxLngueCcsXG4gIDU6ICc9PSAyLjAuMC1hbHBoYS54JyxcbiAgNjogJz49IDIuMC4wLWJldGEuMScsXG4gIDc6ICc+PSA0LjAuMCA8NC4zLjAnLFxuICA4OiAnPj0gNC4zLjAnXG59O1xuXG5jb25zdCBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMsIGRlY29yYXRvcnMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuICB0aGlzLmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG4gIHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnModGhpcyk7XG59XG5cbkhhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nZ2VyLmxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpO1xuICAgICAgfVxuICAgICAgZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLmhlbHBlcnNbbmFtZV07XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBwYXJ0aWFsKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGV4dGVuZCh0aGlzLnBhcnRpYWxzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBwYXJ0aWFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgICAgIGBBdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIGEgcGFydGlhbCBjYWxsZWQgXCIke25hbWV9XCIgYXMgdW5kZWZpbmVkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHBhcnRpYWw7XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLnBhcnRpYWxzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBkZWNvcmF0b3JzJyk7XG4gICAgICB9XG4gICAgICBleHRlbmQodGhpcy5kZWNvcmF0b3JzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWNvcmF0b3JzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdG9yc1tuYW1lXTtcbiAgfSxcbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtZW1vcnkgb2YgaWxsZWdhbCBwcm9wZXJ0eSBhY2Nlc3NlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGxvZ2dlZC5cbiAgICogQGRlcHJlY2F0ZWQgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiBoYW5kbGViYXJzIHRlc3QtY2FzZXNcbiAgICovXG4gIHJlc2V0TG9nZ2VkUHJvcGVydHlBY2Nlc3NlcygpIHtcbiAgICByZXNldExvZ2dlZFByb3BlcnRpZXMoKTtcbiAgfVxufTtcblxuZXhwb3J0IGxldCBsb2cgPSBsb2dnZXIubG9nO1xuXG5leHBvcnQgeyBjcmVhdGVGcmFtZSwgbG9nZ2VyIH07XG4iLCJpbXBvcnQgcmVnaXN0ZXJJbmxpbmUgZnJvbSAnLi9kZWNvcmF0b3JzL2lubGluZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVySW5saW5lKGluc3RhbmNlKTtcbn1cbiIsImltcG9ydCB7IGV4dGVuZCB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJEZWNvcmF0b3IoJ2lubGluZScsIGZ1bmN0aW9uKGZuLCBwcm9wcywgY29udGFpbmVyLCBvcHRpb25zKSB7XG4gICAgbGV0IHJldCA9IGZuO1xuICAgIGlmICghcHJvcHMucGFydGlhbHMpIHtcbiAgICAgIHByb3BzLnBhcnRpYWxzID0ge307XG4gICAgICByZXQgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJ0aWFscyBzdGFjayBmcmFtZSBwcmlvciB0byBleGVjLlxuICAgICAgICBsZXQgb3JpZ2luYWwgPSBjb250YWluZXIucGFydGlhbHM7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGV4dGVuZCh7fSwgb3JpZ2luYWwsIHByb3BzLnBhcnRpYWxzKTtcbiAgICAgICAgbGV0IHJldCA9IGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcmlnaW5hbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvcHMucGFydGlhbHNbb3B0aW9ucy5hcmdzWzBdXSA9IG9wdGlvbnMuZm47XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiIsImNvbnN0IGVycm9yUHJvcHMgPSBbXG4gICdkZXNjcmlwdGlvbicsXG4gICdmaWxlTmFtZScsXG4gICdsaW5lTnVtYmVyJyxcbiAgJ2VuZExpbmVOdW1iZXInLFxuICAnbWVzc2FnZScsXG4gICduYW1lJyxcbiAgJ251bWJlcicsXG4gICdzdGFjaydcbl07XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIGxldCBsb2MgPSBub2RlICYmIG5vZGUubG9jLFxuICAgIGxpbmUsXG4gICAgZW5kTGluZU51bWJlcixcbiAgICBjb2x1bW4sXG4gICAgZW5kQ29sdW1uO1xuXG4gIGlmIChsb2MpIHtcbiAgICBsaW5lID0gbG9jLnN0YXJ0LmxpbmU7XG4gICAgZW5kTGluZU51bWJlciA9IGxvYy5lbmQubGluZTtcbiAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuICAgIGVuZENvbHVtbiA9IGxvYy5lbmQuY29sdW1uO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBjb2x1bW47XG4gIH1cblxuICBsZXQgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXhjZXB0aW9uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGxvYykge1xuICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICAgIHRoaXMuZW5kTGluZU51bWJlciA9IGVuZExpbmVOdW1iZXI7XG5cbiAgICAgIC8vIFdvcmsgYXJvdW5kIGlzc3VlIHVuZGVyIHNhZmFyaSB3aGVyZSB3ZSBjYW4ndCBkaXJlY3RseSBzZXQgdGhlIGNvbHVtbiB2YWx1ZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjb2x1bW4nLCB7XG4gICAgICAgICAgdmFsdWU6IGNvbHVtbixcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2VuZENvbHVtbicsIHtcbiAgICAgICAgICB2YWx1ZTogZW5kQ29sdW1uLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgICAgdGhpcy5lbmRDb2x1bW4gPSBlbmRDb2x1bW47XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChub3ApIHtcbiAgICAvKiBJZ25vcmUgaWYgdGhlIGJyb3dzZXIgaXMgdmVyeSBwYXJ0aWN1bGFyICovXG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnQgZGVmYXVsdCBFeGNlcHRpb247XG4iLCJpbXBvcnQgcmVnaXN0ZXJCbG9ja0hlbHBlck1pc3NpbmcgZnJvbSAnLi9oZWxwZXJzL2Jsb2NrLWhlbHBlci1taXNzaW5nJztcbmltcG9ydCByZWdpc3RlckVhY2ggZnJvbSAnLi9oZWxwZXJzL2VhY2gnO1xuaW1wb3J0IHJlZ2lzdGVySGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVySWYgZnJvbSAnLi9oZWxwZXJzL2lmJztcbmltcG9ydCByZWdpc3RlckxvZyBmcm9tICcuL2hlbHBlcnMvbG9nJztcbmltcG9ydCByZWdpc3Rlckxvb2t1cCBmcm9tICcuL2hlbHBlcnMvbG9va3VwJztcbmltcG9ydCByZWdpc3RlcldpdGggZnJvbSAnLi9oZWxwZXJzL3dpdGgnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyhpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyRWFjaChpbnN0YW5jZSk7XG4gIHJlZ2lzdGVySGVscGVyTWlzc2luZyhpbnN0YW5jZSk7XG4gIHJlZ2lzdGVySWYoaW5zdGFuY2UpO1xuICByZWdpc3RlckxvZyhpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9va3VwKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJXaXRoKGluc3RhbmNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmVIZWxwZXJUb0hvb2tzKGluc3RhbmNlLCBoZWxwZXJOYW1lLCBrZWVwSGVscGVyKSB7XG4gIGlmIChpbnN0YW5jZS5oZWxwZXJzW2hlbHBlck5hbWVdKSB7XG4gICAgaW5zdGFuY2UuaG9va3NbaGVscGVyTmFtZV0gPSBpbnN0YW5jZS5oZWxwZXJzW2hlbHBlck5hbWVdO1xuICAgIGlmICgha2VlcEhlbHBlcikge1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmhlbHBlcnNbaGVscGVyTmFtZV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBhcHBlbmRDb250ZXh0UGF0aCwgY3JlYXRlRnJhbWUsIGlzQXJyYXkgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgbGV0IGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgICAgb3B0aW9ucy5pZHMgPSBbb3B0aW9ucy5uYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuICAgICAgICBsZXQgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBhcHBlbmRDb250ZXh0UGF0aChcbiAgICAgICAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsXG4gICAgICAgICAgb3B0aW9ucy5uYW1lXG4gICAgICAgICk7XG4gICAgICAgIG9wdGlvbnMgPSB7IGRhdGE6IGRhdGEgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQge1xuICBhcHBlbmRDb250ZXh0UGF0aCxcbiAgYmxvY2tQYXJhbXMsXG4gIGNyZWF0ZUZyYW1lLFxuICBpc0FycmF5LFxuICBpc0Z1bmN0aW9uXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdNdXN0IHBhc3MgaXRlcmF0b3IgdG8gI2VhY2gnKTtcbiAgICB9XG5cbiAgICBsZXQgZm4gPSBvcHRpb25zLmZuLFxuICAgICAgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgIGkgPSAwLFxuICAgICAgcmV0ID0gJycsXG4gICAgICBkYXRhLFxuICAgICAgY29udGV4dFBhdGg7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9XG4gICAgICAgIGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7XG4gICAgICBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9XG4gICAgICAgIHJldCArXG4gICAgICAgIGZuKGNvbnRleHRbZmllbGRdLCB7XG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICBibG9ja1BhcmFtczogYmxvY2tQYXJhbXMoXG4gICAgICAgICAgICBbY29udGV4dFtmaWVsZF0sIGZpZWxkXSxcbiAgICAgICAgICAgIFtjb250ZXh0UGF0aCArIGZpZWxkLCBudWxsXVxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGdsb2JhbC5TeW1ib2wgJiYgY29udGV4dFtnbG9iYWwuU3ltYm9sLml0ZXJhdG9yXSkge1xuICAgICAgICBjb25zdCBuZXdDb250ZXh0ID0gW107XG4gICAgICAgIGNvbnN0IGl0ZXJhdG9yID0gY29udGV4dFtnbG9iYWwuU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICBmb3IgKGxldCBpdCA9IGl0ZXJhdG9yLm5leHQoKTsgIWl0LmRvbmU7IGl0ID0gaXRlcmF0b3IubmV4dCgpKSB7XG4gICAgICAgICAgbmV3Q29udGV4dC5wdXNoKGl0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0ID0gbmV3Q29udGV4dDtcbiAgICAgICAgZm9yIChsZXQgaiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgZXhlY0l0ZXJhdGlvbihpLCBpLCBpID09PSBjb250ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgdGhlIGl0ZXJhdGlvbnMgb25lIHN0ZXAgb3V0IG9mIHN5bmMgc28gd2UgY2FuIGRldGVjdFxuICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAvLyBhbiBpdGVybWVkaWF0ZSBrZXlzIGFycmF5LlxuICAgICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHByaW9yS2V5ID0ga2V5O1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaSAtIDEsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG4iLCJpbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oLyogW2FyZ3MsIF1vcHRpb25zICovKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIEEgbWlzc2luZyBmaWVsZCBpbiBhIHt7Zm9vfX0gY29uc3RydWN0LlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29tZW9uZSBpcyBhY3R1YWxseSB0cnlpbmcgdG8gY2FsbCBzb21ldGhpbmcsIGJsb3cgdXAuXG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgICAnTWlzc2luZyBoZWxwZXI6IFwiJyArIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0ubmFtZSArICdcIidcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IGlzRW1wdHksIGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignI2lmIHJlcXVpcmVzIGV4YWN0bHkgb25lIGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkge1xuICAgICAgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignI3VubGVzcyByZXF1aXJlcyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7XG4gICAgICBmbjogb3B0aW9ucy5pbnZlcnNlLFxuICAgICAgaW52ZXJzZTogb3B0aW9ucy5mbixcbiAgICAgIGhhc2g6IG9wdGlvbnMuaGFzaFxuICAgIH0pO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbigvKiBtZXNzYWdlLCBvcHRpb25zICovKSB7XG4gICAgbGV0IGFyZ3MgPSBbdW5kZWZpbmVkXSxcbiAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuXG4gICAgbGV0IGxldmVsID0gMTtcbiAgICBpZiAob3B0aW9ucy5oYXNoLmxldmVsICE9IG51bGwpIHtcbiAgICAgIGxldmVsID0gb3B0aW9ucy5oYXNoLmxldmVsO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuZGF0YS5sZXZlbDtcbiAgICB9XG4gICAgYXJnc1swXSA9IGxldmVsO1xuXG4gICAgaW5zdGFuY2UubG9nKC4uLmFyZ3MpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb29rdXAnLCBmdW5jdGlvbihvYmosIGZpZWxkLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIC8vIE5vdGUgZm9yIDUuMDogQ2hhbmdlIHRvIFwib2JqID09IG51bGxcIiBpbiA1LjBcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zLmxvb2t1cFByb3BlcnR5KG9iaiwgZmllbGQpO1xuICB9KTtcbn1cbiIsImltcG9ydCB7XG4gIGFwcGVuZENvbnRleHRQYXRoLFxuICBibG9ja1BhcmFtcyxcbiAgY3JlYXRlRnJhbWUsXG4gIGlzRW1wdHksXG4gIGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCcjd2l0aCByZXF1aXJlcyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkge1xuICAgICAgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBsZXQgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKCFpc0VtcHR5KGNvbnRleHQpKSB7XG4gICAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBhcHBlbmRDb250ZXh0UGF0aChcbiAgICAgICAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsXG4gICAgICAgICAgb3B0aW9ucy5pZHNbMF1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgYmxvY2tQYXJhbXM6IGJsb2NrUGFyYW1zKFtjb250ZXh0XSwgW2RhdGEgJiYgZGF0YS5jb250ZXh0UGF0aF0pXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgZXh0ZW5kIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCBcIm51bGxcIi1wcm90b3R5cGUgdG8gYXZvaWQgdHJ1dGh5IHJlc3VsdHMgb24gcHJvdG90eXBlIHByb3BlcnRpZXMuXG4gKiBUaGUgcmVzdWx0aW5nIG9iamVjdCBjYW4gYmUgdXNlZCB3aXRoIFwib2JqZWN0W3Byb3BlcnR5XVwiIHRvIGNoZWNrIGlmIGEgcHJvcGVydHkgZXhpc3RzXG4gKiBAcGFyYW0gey4uLm9iamVjdH0gc291cmNlcyBhIHZhcmFyZ3MgcGFyYW1ldGVyIG9mIHNvdXJjZSBvYmplY3RzIHRoYXQgd2lsbCBiZSBtZXJnZWRcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdMb29rdXBPYmplY3QoLi4uc291cmNlcykge1xuICByZXR1cm4gZXh0ZW5kKE9iamVjdC5jcmVhdGUobnVsbCksIC4uLnNvdXJjZXMpO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlTmV3TG9va3VwT2JqZWN0IH0gZnJvbSAnLi9jcmVhdGUtbmV3LWxvb2t1cC1vYmplY3QnO1xuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJy4uL2xvZ2dlcic7XG5cbmNvbnN0IGxvZ2dlZFByb3BlcnRpZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sKHJ1bnRpbWVPcHRpb25zKSB7XG4gIGxldCBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdFsnY29uc3RydWN0b3InXSA9IGZhbHNlO1xuICBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0WydfX2RlZmluZUdldHRlcl9fJ10gPSBmYWxzZTtcbiAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdFsnX19kZWZpbmVTZXR0ZXJfXyddID0gZmFsc2U7XG4gIGRlZmF1bHRNZXRob2RXaGl0ZUxpc3RbJ19fbG9va3VwR2V0dGVyX18nXSA9IGZhbHNlO1xuXG4gIGxldCBkZWZhdWx0UHJvcGVydHlXaGl0ZUxpc3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG9cbiAgZGVmYXVsdFByb3BlcnR5V2hpdGVMaXN0WydfX3Byb3RvX18nXSA9IGZhbHNlO1xuXG4gIHJldHVybiB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgd2hpdGVsaXN0OiBjcmVhdGVOZXdMb29rdXBPYmplY3QoXG4gICAgICAgIGRlZmF1bHRQcm9wZXJ0eVdoaXRlTGlzdCxcbiAgICAgICAgcnVudGltZU9wdGlvbnMuYWxsb3dlZFByb3RvUHJvcGVydGllc1xuICAgICAgKSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogcnVudGltZU9wdGlvbnMuYWxsb3dQcm90b1Byb3BlcnRpZXNCeURlZmF1bHRcbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIHdoaXRlbGlzdDogY3JlYXRlTmV3TG9va3VwT2JqZWN0KFxuICAgICAgICBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0LFxuICAgICAgICBydW50aW1lT3B0aW9ucy5hbGxvd2VkUHJvdG9NZXRob2RzXG4gICAgICApLFxuICAgICAgZGVmYXVsdFZhbHVlOiBydW50aW1lT3B0aW9ucy5hbGxvd1Byb3RvTWV0aG9kc0J5RGVmYXVsdFxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3VsdElzQWxsb3dlZChyZXN1bHQsIHByb3RvQWNjZXNzQ29udHJvbCwgcHJvcGVydHlOYW1lKSB7XG4gIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGNoZWNrV2hpdGVMaXN0KHByb3RvQWNjZXNzQ29udHJvbC5tZXRob2RzLCBwcm9wZXJ0eU5hbWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjaGVja1doaXRlTGlzdChwcm90b0FjY2Vzc0NvbnRyb2wucHJvcGVydGllcywgcHJvcGVydHlOYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1doaXRlTGlzdChwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgaWYgKHByb3RvQWNjZXNzQ29udHJvbEZvclR5cGUud2hpdGVsaXN0W3Byb3BlcnR5TmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLndoaXRlbGlzdFtwcm9wZXJ0eU5hbWVdID09PSB0cnVlO1xuICB9XG4gIGlmIChwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLmRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHByb3RvQWNjZXNzQ29udHJvbEZvclR5cGUuZGVmYXVsdFZhbHVlO1xuICB9XG4gIGxvZ1VuZXhwZWNlZFByb3BlcnR5QWNjZXNzT25jZShwcm9wZXJ0eU5hbWUpO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGxvZ1VuZXhwZWNlZFByb3BlcnR5QWNjZXNzT25jZShwcm9wZXJ0eU5hbWUpIHtcbiAgaWYgKGxvZ2dlZFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSAhPT0gdHJ1ZSkge1xuICAgIGxvZ2dlZFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRydWU7XG4gICAgbG9nZ2VyLmxvZyhcbiAgICAgICdlcnJvcicsXG4gICAgICBgSGFuZGxlYmFyczogQWNjZXNzIGhhcyBiZWVuIGRlbmllZCB0byByZXNvbHZlIHRoZSBwcm9wZXJ0eSBcIiR7cHJvcGVydHlOYW1lfVwiIGJlY2F1c2UgaXQgaXMgbm90IGFuIFwib3duIHByb3BlcnR5XCIgb2YgaXRzIHBhcmVudC5cXG5gICtcbiAgICAgICAgYFlvdSBjYW4gYWRkIGEgcnVudGltZSBvcHRpb24gdG8gZGlzYWJsZSB0aGUgY2hlY2sgb3IgdGhpcyB3YXJuaW5nOlxcbmAgK1xuICAgICAgICBgU2VlIGh0dHBzOi8vaGFuZGxlYmFyc2pzLmNvbS9hcGktcmVmZXJlbmNlL3J1bnRpbWUtb3B0aW9ucy5odG1sI29wdGlvbnMtdG8tY29udHJvbC1wcm90b3R5cGUtYWNjZXNzIGZvciBkZXRhaWxzYFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0TG9nZ2VkUHJvcGVydGllcygpIHtcbiAgT2JqZWN0LmtleXMobG9nZ2VkUHJvcGVydGllcykuZm9yRWFjaChwcm9wZXJ0eU5hbWUgPT4ge1xuICAgIGRlbGV0ZSBsb2dnZWRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyLCB0cmFuc2Zvcm1PcHRpb25zRm4pIHtcbiAgaWYgKHR5cGVvZiBoZWxwZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgYXBwYXJlbnRseSBpdCBkb2VzIGluIGh0dHBzOi8vZ2l0aHViLmNvbS93eWNhdHMvaGFuZGxlYmFycy5qcy9pc3N1ZXMvMTYzOVxuICAgIC8vIFdlIHRyeSB0byBtYWtlIHRoZSB3cmFwcGVyIGxlYXN0LWludmFzaXZlIGJ5IG5vdCB3cmFwcGluZyBpdCwgaWYgdGhlIGhlbHBlciBpcyBub3QgYSBmdW5jdGlvbi5cbiAgICByZXR1cm4gaGVscGVyO1xuICB9XG4gIGxldCB3cmFwcGVyID0gZnVuY3Rpb24oLyogZHluYW1pYyBhcmd1bWVudHMgKi8pIHtcbiAgICBjb25zdCBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID0gdHJhbnNmb3JtT3B0aW9uc0ZuKG9wdGlvbnMpO1xuICAgIHJldHVybiBoZWxwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG4iLCJpbXBvcnQgeyBpbmRleE9mIH0gZnJvbSAnLi91dGlscyc7XG5cbmxldCBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcbiAgbGV2ZWw6ICdpbmZvJyxcblxuICAvLyBNYXBzIGEgZ2l2ZW4gbGV2ZWwgdmFsdWUgdG8gdGhlIGBtZXRob2RNYXBgIGluZGV4ZXMgYWJvdmUuXG4gIGxvb2t1cExldmVsOiBmdW5jdGlvbihsZXZlbCkge1xuICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbGV2ZWxNYXAgPSBpbmRleE9mKGxvZ2dlci5tZXRob2RNYXAsIGxldmVsLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgaWYgKGxldmVsTWFwID49IDApIHtcbiAgICAgICAgbGV2ZWwgPSBsZXZlbE1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldmVsID0gcGFyc2VJbnQobGV2ZWwsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGV2ZWw7XG4gIH0sXG5cbiAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgLi4ubWVzc2FnZSkge1xuICAgIGxldmVsID0gbG9nZ2VyLmxvb2t1cExldmVsKGxldmVsKTtcblxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgbG9nZ2VyLmxvb2t1cExldmVsKGxvZ2dlci5sZXZlbCkgPD0gbGV2ZWxcbiAgICApIHtcbiAgICAgIGxldCBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICBtZXRob2QgPSAnbG9nJztcbiAgICAgIH1cbiAgICAgIGNvbnNvbGVbbWV0aG9kXSguLi5tZXNzYWdlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihIYW5kbGViYXJzKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGxldCByb290ID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3csXG4gICAgJEhhbmRsZWJhcnMgPSByb290LkhhbmRsZWJhcnM7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIEhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyb290LkhhbmRsZWJhcnMgPT09IEhhbmRsZWJhcnMpIHtcbiAgICAgIHJvb3QuSGFuZGxlYmFycyA9ICRIYW5kbGViYXJzO1xuICAgIH1cbiAgICByZXR1cm4gSGFuZGxlYmFycztcbiAgfTtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2V4Y2VwdGlvbic7XG5pbXBvcnQge1xuICBDT01QSUxFUl9SRVZJU0lPTixcbiAgY3JlYXRlRnJhbWUsXG4gIExBU1RfQ09NUEFUSUJMRV9DT01QSUxFUl9SRVZJU0lPTixcbiAgUkVWSVNJT05fQ0hBTkdFU1xufSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgbW92ZUhlbHBlclRvSG9va3MgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IHsgd3JhcEhlbHBlciB9IGZyb20gJy4vaW50ZXJuYWwvd3JhcEhlbHBlcic7XG5pbXBvcnQge1xuICBjcmVhdGVQcm90b0FjY2Vzc0NvbnRyb2wsXG4gIHJlc3VsdElzQWxsb3dlZFxufSBmcm9tICcuL2ludGVybmFsL3Byb3RvLWFjY2Vzcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICBjb25zdCBjb21waWxlclJldmlzaW9uID0gKGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0pIHx8IDEsXG4gICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKFxuICAgIGNvbXBpbGVyUmV2aXNpb24gPj0gTEFTVF9DT01QQVRJQkxFX0NPTVBJTEVSX1JFVklTSU9OICYmXG4gICAgY29tcGlsZXJSZXZpc2lvbiA8PSBDT01QSUxFUl9SRVZJU0lPTlxuICApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IExBU1RfQ09NUEFUSUJMRV9DT01QSUxFUl9SRVZJU0lPTikge1xuICAgIGNvbnN0IHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAnVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICdQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uICgnICtcbiAgICAgICAgcnVudGltZVZlcnNpb25zICtcbiAgICAgICAgJykgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uICgnICtcbiAgICAgICAgY29tcGlsZXJWZXJzaW9ucyArXG4gICAgICAgICcpLidcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAnVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiAnICtcbiAgICAgICAgJ1BsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArXG4gICAgICAgIGNvbXBpbGVySW5mb1sxXSArXG4gICAgICAgICcpLidcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ05vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZScpO1xuICB9XG4gIGlmICghdGVtcGxhdGVTcGVjIHx8ICF0ZW1wbGF0ZVNwZWMubWFpbikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1Vua25vd24gdGVtcGxhdGUgb2JqZWN0OiAnICsgdHlwZW9mIHRlbXBsYXRlU3BlYyk7XG4gIH1cblxuICB0ZW1wbGF0ZVNwZWMubWFpbi5kZWNvcmF0b3IgPSB0ZW1wbGF0ZVNwZWMubWFpbl9kO1xuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc2V1ZG8tc3VwcG9ydGVkIEFQSXMuXG4gIGVudi5WTS5jaGVja1JldmlzaW9uKHRlbXBsYXRlU3BlYy5jb21waWxlcik7XG5cbiAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZm9yIHByZWNvbXBpbGVkIHRlbXBsYXRlcyB3aXRoIGNvbXBpbGVyLXZlcnNpb24gNyAoPDQuMy4wKVxuICBjb25zdCB0ZW1wbGF0ZVdhc1ByZWNvbXBpbGVkV2l0aENvbXBpbGVyVjcgPVxuICAgIHRlbXBsYXRlU3BlYy5jb21waWxlciAmJiB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJbMF0gPT09IDc7XG5cbiAgZnVuY3Rpb24gaW52b2tlUGFydGlhbFdyYXBwZXIocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICAgIGNvbnRleHQgPSBVdGlscy5leHRlbmQoe30sIGNvbnRleHQsIG9wdGlvbnMuaGFzaCk7XG4gICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgb3B0aW9ucy5pZHNbMF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICBsZXQgZXh0ZW5kZWRPcHRpb25zID0gVXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zLCB7XG4gICAgICBob29rczogdGhpcy5ob29rcyxcbiAgICAgIHByb3RvQWNjZXNzQ29udHJvbDogdGhpcy5wcm90b0FjY2Vzc0NvbnRyb2xcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5jYWxsKFxuICAgICAgdGhpcyxcbiAgICAgIHBhcnRpYWwsXG4gICAgICBjb250ZXh0LFxuICAgICAgZXh0ZW5kZWRPcHRpb25zXG4gICAgKTtcblxuICAgIGlmIChyZXN1bHQgPT0gbnVsbCAmJiBlbnYuY29tcGlsZSkge1xuICAgICAgb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdID0gZW52LmNvbXBpbGUoXG4gICAgICAgIHBhcnRpYWwsXG4gICAgICAgIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsXG4gICAgICAgIGVudlxuICAgICAgKTtcbiAgICAgIHJlc3VsdCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXShjb250ZXh0LCBleHRlbmRlZE9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLmluZGVudCkge1xuICAgICAgICBsZXQgbGluZXMgPSByZXN1bHQuc3BsaXQoJ1xcbicpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmICghbGluZXNbaV0gJiYgaSArIDEgPT09IGwpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpbmVzW2ldID0gb3B0aW9ucy5pbmRlbnQgKyBsaW5lc1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAgICdUaGUgcGFydGlhbCAnICtcbiAgICAgICAgICBvcHRpb25zLm5hbWUgK1xuICAgICAgICAgICcgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZSdcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgbGV0IGNvbnRhaW5lciA9IHtcbiAgICBzdHJpY3Q6IGZ1bmN0aW9uKG9iaiwgbmFtZSwgbG9jKSB7XG4gICAgICBpZiAoIW9iaiB8fCAhKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmosIHtcbiAgICAgICAgICBsb2M6IGxvY1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250YWluZXIubG9va3VwUHJvcGVydHkob2JqLCBuYW1lKTtcbiAgICB9LFxuICAgIGxvb2t1cFByb3BlcnR5OiBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgbGV0IHJlc3VsdCA9IHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0SXNBbGxvd2VkKHJlc3VsdCwgY29udGFpbmVyLnByb3RvQWNjZXNzQ29udHJvbCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIGxvb2t1cDogZnVuY3Rpb24oZGVwdGhzLCBuYW1lKSB7XG4gICAgICBjb25zdCBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZGVwdGhzW2ldICYmIGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eShkZXB0aHNbaV0sIG5hbWUpO1xuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZGVwdGhzW2ldW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBsYW1iZGE6IGZ1bmN0aW9uKGN1cnJlbnQsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgY3VycmVudCA9PT0gJ2Z1bmN0aW9uJyA/IGN1cnJlbnQuY2FsbChjb250ZXh0KSA6IGN1cnJlbnQ7XG4gICAgfSxcblxuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG5cbiAgICBmbjogZnVuY3Rpb24oaSkge1xuICAgICAgbGV0IHJldCA9IHRlbXBsYXRlU3BlY1tpXTtcbiAgICAgIHJldC5kZWNvcmF0b3IgPSB0ZW1wbGF0ZVNwZWNbaSArICdfZCddO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICAgIGxldCBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0sXG4gICAgICAgIGZuID0gdGhpcy5mbihpKTtcbiAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gd3JhcFByb2dyYW0oXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGZuLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZGVjbGFyZWRCbG9ja1BhcmFtcyxcbiAgICAgICAgICBibG9ja1BhcmFtcyxcbiAgICAgICAgICBkZXB0aHNcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHdyYXBQcm9ncmFtKHRoaXMsIGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuXG4gICAgZGF0YTogZnVuY3Rpb24odmFsdWUsIGRlcHRoKSB7XG4gICAgICB3aGlsZSAodmFsdWUgJiYgZGVwdGgtLSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLl9wYXJlbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcbiAgICBtZXJnZUlmTmVlZGVkOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICBsZXQgb2JqID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIHBhcmFtICE9PSBjb21tb24pIHtcbiAgICAgICAgb2JqID0gVXRpbHMuZXh0ZW5kKHt9LCBjb21tb24sIHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuICAgIC8vIEFuIGVtcHR5IG9iamVjdCB0byB1c2UgYXMgcmVwbGFjZW1lbnQgZm9yIG51bGwtY29udGV4dHNcbiAgICBudWxsQ29udGV4dDogT2JqZWN0LnNlYWwoe30pLFxuXG4gICAgbm9vcDogZW52LlZNLm5vb3AsXG4gICAgY29tcGlsZXJJbmZvOiB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJcbiAgfTtcblxuICBmdW5jdGlvbiByZXQoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG5cbiAgICByZXQuX3NldHVwKG9wdGlvbnMpO1xuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsICYmIHRlbXBsYXRlU3BlYy51c2VEYXRhKSB7XG4gICAgICBkYXRhID0gaW5pdERhdGEoY29udGV4dCwgZGF0YSk7XG4gICAgfVxuICAgIGxldCBkZXB0aHMsXG4gICAgICBibG9ja1BhcmFtcyA9IHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyA/IFtdIDogdW5kZWZpbmVkO1xuICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlRGVwdGhzKSB7XG4gICAgICBpZiAob3B0aW9ucy5kZXB0aHMpIHtcbiAgICAgICAgZGVwdGhzID1cbiAgICAgICAgICBjb250ZXh0ICE9IG9wdGlvbnMuZGVwdGhzWzBdXG4gICAgICAgICAgICA/IFtjb250ZXh0XS5jb25jYXQob3B0aW9ucy5kZXB0aHMpXG4gICAgICAgICAgICA6IG9wdGlvbnMuZGVwdGhzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVwdGhzID0gW2NvbnRleHRdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1haW4oY29udGV4dCAvKiwgb3B0aW9ucyovKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAnJyArXG4gICAgICAgIHRlbXBsYXRlU3BlYy5tYWluKFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgIGNvbnRhaW5lci5oZWxwZXJzLFxuICAgICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGJsb2NrUGFyYW1zLFxuICAgICAgICAgIGRlcHRoc1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIG1haW4gPSBleGVjdXRlRGVjb3JhdG9ycyhcbiAgICAgIHRlbXBsYXRlU3BlYy5tYWluLFxuICAgICAgbWFpbixcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIG9wdGlvbnMuZGVwdGhzIHx8IFtdLFxuICAgICAgZGF0YSxcbiAgICAgIGJsb2NrUGFyYW1zXG4gICAgKTtcbiAgICByZXR1cm4gbWFpbihjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuXG4gIHJldC5pc1RvcCA9IHRydWU7XG5cbiAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgbGV0IG1lcmdlZEhlbHBlcnMgPSBVdGlscy5leHRlbmQoe30sIGVudi5oZWxwZXJzLCBvcHRpb25zLmhlbHBlcnMpO1xuICAgICAgd3JhcEhlbHBlcnNUb1Bhc3NMb29rdXBQcm9wZXJ0eShtZXJnZWRIZWxwZXJzLCBjb250YWluZXIpO1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBtZXJnZWRIZWxwZXJzO1xuXG4gICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwpIHtcbiAgICAgICAgLy8gVXNlIG1lcmdlSWZOZWVkZWQgaGVyZSB0byBwcmV2ZW50IGNvbXBpbGluZyBnbG9iYWwgcGFydGlhbHMgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gY29udGFpbmVyLm1lcmdlSWZOZWVkZWQoXG4gICAgICAgICAgb3B0aW9ucy5wYXJ0aWFscyxcbiAgICAgICAgICBlbnYucGFydGlhbHNcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCB8fCB0ZW1wbGF0ZVNwZWMudXNlRGVjb3JhdG9ycykge1xuICAgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IFV0aWxzLmV4dGVuZChcbiAgICAgICAgICB7fSxcbiAgICAgICAgICBlbnYuZGVjb3JhdG9ycyxcbiAgICAgICAgICBvcHRpb25zLmRlY29yYXRvcnNcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLmhvb2tzID0ge307XG4gICAgICBjb250YWluZXIucHJvdG9BY2Nlc3NDb250cm9sID0gY3JlYXRlUHJvdG9BY2Nlc3NDb250cm9sKG9wdGlvbnMpO1xuXG4gICAgICBsZXQga2VlcEhlbHBlckluSGVscGVycyA9XG4gICAgICAgIG9wdGlvbnMuYWxsb3dDYWxsc1RvSGVscGVyTWlzc2luZyB8fFxuICAgICAgICB0ZW1wbGF0ZVdhc1ByZWNvbXBpbGVkV2l0aENvbXBpbGVyVjc7XG4gICAgICBtb3ZlSGVscGVyVG9Ib29rcyhjb250YWluZXIsICdoZWxwZXJNaXNzaW5nJywga2VlcEhlbHBlckluSGVscGVycyk7XG4gICAgICBtb3ZlSGVscGVyVG9Ib29rcyhjb250YWluZXIsICdibG9ja0hlbHBlck1pc3NpbmcnLCBrZWVwSGVscGVySW5IZWxwZXJzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLnByb3RvQWNjZXNzQ29udHJvbCA9IG9wdGlvbnMucHJvdG9BY2Nlc3NDb250cm9sOyAvLyBpbnRlcm5hbCBvcHRpb25cbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gb3B0aW9ucy5kZWNvcmF0b3JzO1xuICAgICAgY29udGFpbmVyLmhvb2tzID0gb3B0aW9ucy5ob29rcztcbiAgICB9XG4gIH07XG5cbiAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zICYmICFibG9ja1BhcmFtcykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIGJsb2NrIHBhcmFtcycpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocyAmJiAhZGVwdGhzKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdtdXN0IHBhc3MgcGFyZW50IGRlcHRocycpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwUHJvZ3JhbShcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGksXG4gICAgICB0ZW1wbGF0ZVNwZWNbaV0sXG4gICAgICBkYXRhLFxuICAgICAgMCxcbiAgICAgIGJsb2NrUGFyYW1zLFxuICAgICAgZGVwdGhzXG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBQcm9ncmFtKFxuICBjb250YWluZXIsXG4gIGksXG4gIGZuLFxuICBkYXRhLFxuICBkZWNsYXJlZEJsb2NrUGFyYW1zLFxuICBibG9ja1BhcmFtcyxcbiAgZGVwdGhzXG4pIHtcbiAgZnVuY3Rpb24gcHJvZyhjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgY3VycmVudERlcHRocyA9IGRlcHRocztcbiAgICBpZiAoXG4gICAgICBkZXB0aHMgJiZcbiAgICAgIGNvbnRleHQgIT0gZGVwdGhzWzBdICYmXG4gICAgICAhKGNvbnRleHQgPT09IGNvbnRhaW5lci5udWxsQ29udGV4dCAmJiBkZXB0aHNbMF0gPT09IG51bGwpXG4gICAgKSB7XG4gICAgICBjdXJyZW50RGVwdGhzID0gW2NvbnRleHRdLmNvbmNhdChkZXB0aHMpO1xuICAgIH1cblxuICAgIHJldHVybiBmbihcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGNvbnRleHQsXG4gICAgICBjb250YWluZXIuaGVscGVycyxcbiAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyxcbiAgICAgIG9wdGlvbnMuZGF0YSB8fCBkYXRhLFxuICAgICAgYmxvY2tQYXJhbXMgJiYgW29wdGlvbnMuYmxvY2tQYXJhbXNdLmNvbmNhdChibG9ja1BhcmFtcyksXG4gICAgICBjdXJyZW50RGVwdGhzXG4gICAgKTtcbiAgfVxuXG4gIHByb2cgPSBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKTtcblxuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gZGVwdGhzID8gZGVwdGhzLmxlbmd0aCA6IDA7XG4gIHByb2cuYmxvY2tQYXJhbXMgPSBkZWNsYXJlZEJsb2NrUGFyYW1zIHx8IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY3VycmVudGx5IHBhcnQgb2YgdGhlIG9mZmljaWFsIEFQSSwgdGhlcmVmb3JlIGltcGxlbWVudGF0aW9uIGRldGFpbHMgc2hvdWxkIG5vdCBiZSBjaGFuZ2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIXBhcnRpYWwpIHtcbiAgICBpZiAob3B0aW9ucy5uYW1lID09PSAnQHBhcnRpYWwtYmxvY2snKSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCFwYXJ0aWFsLmNhbGwgJiYgIW9wdGlvbnMubmFtZSkge1xuICAgIC8vIFRoaXMgaXMgYSBkeW5hbWljIHBhcnRpYWwgdGhhdCByZXR1cm5lZCBhIHN0cmluZ1xuICAgIG9wdGlvbnMubmFtZSA9IHBhcnRpYWw7XG4gICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbcGFydGlhbF07XG4gIH1cbiAgcmV0dXJuIHBhcnRpYWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgLy8gVXNlIHRoZSBjdXJyZW50IGNsb3N1cmUgY29udGV4dCB0byBzYXZlIHRoZSBwYXJ0aWFsLWJsb2NrIGlmIHRoaXMgcGFydGlhbFxuICBjb25zdCBjdXJyZW50UGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuICBvcHRpb25zLnBhcnRpYWwgPSB0cnVlO1xuICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGggPSBvcHRpb25zLmlkc1swXSB8fCBvcHRpb25zLmRhdGEuY29udGV4dFBhdGg7XG4gIH1cblxuICBsZXQgcGFydGlhbEJsb2NrO1xuICBpZiAob3B0aW9ucy5mbiAmJiBvcHRpb25zLmZuICE9PSBub29wKSB7XG4gICAgb3B0aW9ucy5kYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAvLyBXcmFwcGVyIGZ1bmN0aW9uIHRvIGdldCBhY2Nlc3MgdG8gY3VycmVudFBhcnRpYWxCbG9jayBmcm9tIHRoZSBjbG9zdXJlXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbjtcbiAgICBwYXJ0aWFsQmxvY2sgPSBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXSA9IGZ1bmN0aW9uIHBhcnRpYWxCbG9ja1dyYXBwZXIoXG4gICAgICBjb250ZXh0LFxuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgKSB7XG4gICAgICAvLyBSZXN0b3JlIHRoZSBwYXJ0aWFsLWJsb2NrIGZyb20gdGhlIGNsb3N1cmUgZm9yIHRoZSBleGVjdXRpb24gb2YgdGhlIGJsb2NrXG4gICAgICAvLyBpLmUuIHRoZSBwYXJ0IGluc2lkZSB0aGUgYmxvY2sgb2YgdGhlIHBhcnRpYWwgY2FsbC5cbiAgICAgIG9wdGlvbnMuZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgICBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXSA9IGN1cnJlbnRQYXJ0aWFsQmxvY2s7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBpZiAoZm4ucGFydGlhbHMpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIGZuLnBhcnRpYWxzKTtcbiAgICB9XG4gIH1cblxuICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkICYmIHBhcnRpYWxCbG9jaykge1xuICAgIHBhcnRpYWwgPSBwYXJ0aWFsQmxvY2s7XG4gIH1cblxuICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gIH0gZWxzZSBpZiAocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgISgncm9vdCcgaW4gZGF0YSkpIHtcbiAgICBkYXRhID0gZGF0YSA/IGNyZWF0ZUZyYW1lKGRhdGEpIDoge307XG4gICAgZGF0YS5yb290ID0gY29udGV4dDtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcykge1xuICBpZiAoZm4uZGVjb3JhdG9yKSB7XG4gICAgbGV0IHByb3BzID0ge307XG4gICAgcHJvZyA9IGZuLmRlY29yYXRvcihcbiAgICAgIHByb2csXG4gICAgICBwcm9wcyxcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGRlcHRocyAmJiBkZXB0aHNbMF0sXG4gICAgICBkYXRhLFxuICAgICAgYmxvY2tQYXJhbXMsXG4gICAgICBkZXB0aHNcbiAgICApO1xuICAgIFV0aWxzLmV4dGVuZChwcm9nLCBwcm9wcyk7XG4gIH1cbiAgcmV0dXJuIHByb2c7XG59XG5cbmZ1bmN0aW9uIHdyYXBIZWxwZXJzVG9QYXNzTG9va3VwUHJvcGVydHkobWVyZ2VkSGVscGVycywgY29udGFpbmVyKSB7XG4gIE9iamVjdC5rZXlzKG1lcmdlZEhlbHBlcnMpLmZvckVhY2goaGVscGVyTmFtZSA9PiB7XG4gICAgbGV0IGhlbHBlciA9IG1lcmdlZEhlbHBlcnNbaGVscGVyTmFtZV07XG4gICAgbWVyZ2VkSGVscGVyc1toZWxwZXJOYW1lXSA9IHBhc3NMb29rdXBQcm9wZXJ0eU9wdGlvbihoZWxwZXIsIGNvbnRhaW5lcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwYXNzTG9va3VwUHJvcGVydHlPcHRpb24oaGVscGVyLCBjb250YWluZXIpIHtcbiAgY29uc3QgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHk7XG4gIHJldHVybiB3cmFwSGVscGVyKGhlbHBlciwgb3B0aW9ucyA9PiB7XG4gICAgcmV0dXJuIFV0aWxzLmV4dGVuZCh7IGxvb2t1cFByb3BlcnR5IH0sIG9wdGlvbnMpO1xuICB9KTtcbn1cbiIsIi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBTYWZlU3RyaW5nLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcnICsgdGhpcy5zdHJpbmc7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTYWZlU3RyaW5nO1xuIiwiY29uc3QgZXNjYXBlID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgJ2AnOiAnJiN4NjA7JyxcbiAgJz0nOiAnJiN4M0Q7J1xufTtcblxuY29uc3QgYmFkQ2hhcnMgPSAvWyY8PlwiJ2A9XS9nLFxuICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iaiAvKiAsIC4uLnNvdXJjZSAqLykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGtleSBpbiBhcmd1bWVudHNbaV0pIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJndW1lbnRzW2ldLCBrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0gYXJndW1lbnRzW2ldW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZXhwb3J0IGxldCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbi8qIGVzbGludC1kaXNhYmxlIGZ1bmMtc3R5bGUgKi9cbmxldCBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nXG4gICAgKTtcbiAgfTtcbn1cbmV4cG9ydCB7IGlzRnVuY3Rpb24gfTtcbi8qIGVzbGludC1lbmFibGUgZnVuYy1zdHlsZSAqL1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPVxuICBBcnJheS5pc0FycmF5IHx8XG4gIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgICBpZiAoc3RyaW5nICYmIHN0cmluZy50b0hUTUwpIHtcbiAgICAgIHJldHVybiBzdHJpbmcudG9IVE1MKCk7XG4gICAgfSBlbHNlIGlmIChzdHJpbmcgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSBpZiAoIXN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZyArICcnO1xuICAgIH1cblxuICAgIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAgIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAgIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nO1xuICB9XG5cbiAgaWYgKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpW1wiZGVmYXVsdFwiXTtcbiIsIi8qIGdsb2JhbCBhcGV4ICovXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKVxuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdyYXcnLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKVxufSlcblxuLy8gUmVxdWlyZSBkeW5hbWljIHRlbXBsYXRlc1xudmFyIG1vZGFsUmVwb3J0VGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy9tb2RhbC1yZXBvcnQuaGJzJylcbkhhbmRsZWJhcnMucmVnaXN0ZXJQYXJ0aWFsKCdyZXBvcnQnLCByZXF1aXJlKCcuL3RlbXBsYXRlcy9wYXJ0aWFscy9fcmVwb3J0LmhicycpKVxuSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwoJ3Jvd3MnLCByZXF1aXJlKCcuL3RlbXBsYXRlcy9wYXJ0aWFscy9fcm93cy5oYnMnKSlcbkhhbmRsZWJhcnMucmVnaXN0ZXJQYXJ0aWFsKCdwYWdpbmF0aW9uJywgcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcGFydGlhbHMvX3BhZ2luYXRpb24uaGJzJykpXG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdykge1xuICAkLndpZGdldCgnZmNzLm1vZGFsTG92Jywge1xuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIGlkOiAnJyxcbiAgICAgIHRpdGxlOiAnJyxcbiAgICAgIGl0ZW1OYW1lOiAnJyxcbiAgICAgIHNlYXJjaEZpZWxkOiAnJyxcbiAgICAgIHNlYXJjaEJ1dHRvbjogJycsXG4gICAgICBzZWFyY2hQbGFjZWhvbGRlcjogJycsXG4gICAgICBhamF4SWRlbnRpZmllcjogJycsXG4gICAgICBzaG93SGVhZGVyczogZmFsc2UsXG4gICAgICByZXR1cm5Db2w6ICcnLFxuICAgICAgZGlzcGxheUNvbDogJycsXG4gICAgICB2YWxpZGF0aW9uRXJyb3I6ICcnLFxuICAgICAgY2FzY2FkaW5nSXRlbXM6ICcnLFxuICAgICAgbW9kYWxXaWR0aDogNjAwLFxuICAgICAgbm9EYXRhRm91bmQ6ICcnLFxuICAgICAgYWxsb3dNdWx0aWxpbmVSb3dzOiBmYWxzZSxcbiAgICAgIHJvd0NvdW50OiAxNSxcbiAgICAgIHBhZ2VJdGVtc1RvU3VibWl0OiAnJyxcbiAgICAgIG1hcmtDbGFzc2VzOiAndS1ob3QnLFxuICAgICAgaG92ZXJDbGFzc2VzOiAnaG92ZXIgdS1jb2xvci0xJyxcbiAgICAgIHByZXZpb3VzTGFiZWw6ICdwcmV2aW91cycsXG4gICAgICBuZXh0TGFiZWw6ICduZXh0JyxcbiAgICAgIHRleHRDYXNlOiAnTicsXG4gICAgICBhZGRpdGlvbmFsT3V0cHV0c1N0cjogJycsXG4gICAgICBzZWFyY2hGaXJzdENvbE9ubHk6IHRydWUsXG4gICAgICBuZXh0T25FbnRlcjogdHJ1ZSxcbiAgICB9LFxuXG4gICAgX3JldHVyblZhbHVlOiAnJyxcblxuICAgIF9pdGVtJDogbnVsbCxcbiAgICBfc2VhcmNoQnV0dG9uJDogbnVsbCxcbiAgICBfY2xlYXJJbnB1dCQ6IG51bGwsXG5cbiAgICBfc2VhcmNoRmllbGQkOiBudWxsLFxuXG4gICAgX3RlbXBsYXRlRGF0YToge30sXG4gICAgX2xhc3RTZWFyY2hUZXJtOiAnJyxcblxuICAgIF9tb2RhbERpYWxvZyQ6IG51bGwsXG5cbiAgICBfYWN0aXZlRGVsYXk6IGZhbHNlLFxuICAgIF9kaXNhYmxlQ2hhbmdlRXZlbnQ6IGZhbHNlLFxuXG4gICAgX2lnJDogbnVsbCxcbiAgICBfZ3JpZDogbnVsbCxcblxuICAgIF90b3BBcGV4OiBhcGV4LnV0aWwuZ2V0VG9wQXBleCgpLFxuXG4gICAgX3Jlc2V0Rm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgaWYgKHRoaXMuX2dyaWQpIHtcbiAgICAgICAgdmFyIHJlY29yZElkID0gdGhpcy5fZ3JpZC5tb2RlbC5nZXRSZWNvcmRJZCh0aGlzLl9ncmlkLnZpZXckLmdyaWQoJ2dldFNlbGVjdGVkUmVjb3JkcycpWzBdKVxuICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5faWckLmludGVyYWN0aXZlR3JpZCgnb3B0aW9uJykuY29uZmlnLmNvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgICAgICByZXR1cm4gY29sdW1uLnN0YXRpY0lkID09PSBzZWxmLm9wdGlvbnMuaXRlbU5hbWVcbiAgICAgICAgfSlbMF1cbiAgICAgICAgdGhpcy5fZ3JpZC52aWV3JC5ncmlkKCdnb3RvQ2VsbCcsIHJlY29yZElkLCBjb2x1bW4ubmFtZSlcbiAgICAgICAgdGhpcy5fZ3JpZC5mb2N1cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9pdGVtJC5mb2N1cygpO1xuXG4gICAgICAvLyBGb2N1cyBvbiBuZXh0IGVsZW1lbnQgaWYgRU5URVIga2V5IHVzZWQgdG8gc2VsZWN0IHJvdy5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgJiYgc2VsZi5vcHRpb25zLm5leHRPbkVudGVyKSB7XG4gICAgICAgICAgc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmlzUHJldkluZGV4KSB7XG4gICAgICAgICAgICBzZWxmLl9mb2N1c1ByZXZFbGVtZW50KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5fZm9jdXNOZXh0RWxlbWVudCgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IGZhbHNlXG4gICAgICB9LCAxMDApXG4gICAgfSxcblxuICAgIC8vIENvbWJpbmF0aW9uIG9mIG51bWJlciwgY2hhciBhbmQgc3BhY2UsIGFycm93IGtleXNcbiAgICBfdmFsaWRTZWFyY2hLZXlzOiBbNDgsIDQ5LCA1MCwgNTEsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIC8vIG51bWJlcnNcbiAgICAgIDY1LCA2NiwgNjcsIDY4LCA2OSwgNzAsIDcxLCA3MiwgNzMsIDc0LCA3NSwgNzYsIDc3LCA3OCwgNzksIDgwLCA4MSwgODIsIDgzLCA4NCwgODUsIDg2LCA4NywgODgsIDg5LCA5MCwgLy8gY2hhcnNcbiAgICAgIDkzLCA5NCwgOTUsIDk2LCA5NywgOTgsIDk5LCAxMDAsIDEwMSwgMTAyLCAxMDMsIDEwNCwgMTA1LCAvLyBudW1wYWQgbnVtYmVyc1xuICAgICAgNDAsIC8vIGFycm93IGRvd25cbiAgICAgIDMyLCAvLyBzcGFjZWJhclxuICAgICAgOCwgLy8gYmFja3NwYWNlXG4gICAgICAxMDYsIDEwNywgMTA5LCAxMTAsIDExMSwgMTg2LCAxODcsIDE4OCwgMTg5LCAxOTAsIDE5MSwgMTkyLCAyMTksIDIyMCwgMjIxLCAyMjAgLy8gaW50ZXJwdW5jdGlvblxuICAgIF0sXG5cbiAgICAvLyBLZXlzIHRvIGluZGljYXRlIGNvbXBsZXRpbmcgaW5wdXQgKGVzYywgdGFiLCBlbnRlcilcbiAgICBfdmFsaWROZXh0S2V5czogWzksIDI3LCAxM10sXG5cbiAgICBfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgc2VsZi5faXRlbSQgPSAkKCcjJyArIHNlbGYub3B0aW9ucy5pdGVtTmFtZSlcbiAgICAgIHNlbGYuX3JldHVyblZhbHVlID0gc2VsZi5faXRlbSQuZGF0YSgncmV0dXJuVmFsdWUnKS50b1N0cmluZygpXG4gICAgICBzZWxmLl9zZWFyY2hCdXR0b24kID0gJCgnIycgKyBzZWxmLm9wdGlvbnMuc2VhcmNoQnV0dG9uKVxuICAgICAgc2VsZi5fY2xlYXJJbnB1dCQgPSBzZWxmLl9pdGVtJC5wYXJlbnQoKS5maW5kKCcuZmNzLXNlYXJjaC1jbGVhcicpXG5cbiAgICAgIHNlbGYuX2FkZENTU1RvVG9wTGV2ZWwoKVxuXG4gICAgICAvLyBUcmlnZ2VyIGV2ZW50IG9uIGNsaWNrIGlucHV0IGRpc3BsYXkgZmllbGRcbiAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwMCAtIGNyZWF0ZScpXG5cbiAgICAgIC8vIFRyaWdnZXIgZXZlbnQgb24gY2xpY2sgaW5wdXQgZ3JvdXAgYWRkb24gYnV0dG9uIChtYWduaWZpZXIgZ2xhc3MpXG4gICAgICBzZWxmLl90cmlnZ2VyTE9WT25CdXR0b24oKVxuXG4gICAgICAvLyBDbGVhciB0ZXh0IHdoZW4gY2xlYXIgaWNvbiBpcyBjbGlja2VkXG4gICAgICBzZWxmLl9pbml0Q2xlYXJJbnB1dCgpXG5cbiAgICAgIC8vIENhc2NhZGluZyBMT1YgaXRlbSBhY3Rpb25zXG4gICAgICBzZWxmLl9pbml0Q2FzY2FkaW5nTE9WcygpXG5cbiAgICAgIC8vIEluaXQgQVBFWCBwYWdlaXRlbSBmdW5jdGlvbnNcbiAgICAgIHNlbGYuX2luaXRBcGV4SXRlbSgpXG4gICAgfSxcblxuICAgIF9vbk9wZW5EaWFsb2c6IGZ1bmN0aW9uIChtb2RhbCwgb3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSBvcHRpb25zLndpZGdldFxuICAgICAgc2VsZi5fbW9kYWxEaWFsb2ckID0gc2VsZi5fdG9wQXBleC5qUXVlcnkobW9kYWwpXG4gICAgICAvLyBGb2N1cyBvbiBzZWFyY2ggZmllbGQgaW4gTE9WXG4gICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSgnIycgKyBzZWxmLm9wdGlvbnMuc2VhcmNoRmllbGQpLmZvY3VzKClcbiAgICAgIC8vIFJlbW92ZSB2YWxpZGF0aW9uIHJlc3VsdHNcbiAgICAgIHNlbGYuX3JlbW92ZVZhbGlkYXRpb24oKVxuICAgICAgLy8gQWRkIHRleHQgZnJvbSBkaXNwbGF5IGZpZWxkXG4gICAgICBpZiAob3B0aW9ucy5maWxsU2VhcmNoVGV4dCkge1xuICAgICAgICBzZWxmLl90b3BBcGV4Lml0ZW0oc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKS5zZXRWYWx1ZShzZWxmLl9pdGVtJC52YWwoKSlcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBjbGFzcyBvbiBob3ZlclxuICAgICAgc2VsZi5fb25Sb3dIb3ZlcigpXG4gICAgICAvLyBzZWxlY3RJbml0aWFsUm93XG4gICAgICBzZWxmLl9zZWxlY3RJbml0aWFsUm93KClcbiAgICAgIC8vIFNldCBhY3Rpb24gd2hlbiBhIHJvdyBpcyBzZWxlY3RlZFxuICAgICAgc2VsZi5fb25Sb3dTZWxlY3RlZCgpXG4gICAgICAvLyBOYXZpZ2F0ZSBvbiBhcnJvdyBrZXlzIHRyb3VnaCBMT1ZcbiAgICAgIHNlbGYuX2luaXRLZXlib2FyZE5hdmlnYXRpb24oKVxuICAgICAgLy8gU2V0IHNlYXJjaCBhY3Rpb25cbiAgICAgIHNlbGYuX2luaXRTZWFyY2goKVxuICAgICAgLy8gU2V0IHBhZ2luYXRpb24gYWN0aW9uc1xuICAgICAgc2VsZi5faW5pdFBhZ2luYXRpb24oKVxuICAgIH0sXG5cbiAgICBfb25DbG9zZURpYWxvZzogZnVuY3Rpb24gKG1vZGFsLCBvcHRpb25zKSB7XG4gICAgICAvLyBjbG9zZSB0YWtlcyBwbGFjZSB3aGVuIG5vIHJlY29yZCBoYXMgYmVlbiBzZWxlY3RlZCwgaW5zdGVhZCB0aGUgY2xvc2UgbW9kYWwgKG9yIGVzYykgd2FzIGNsaWNrZWQvIHByZXNzZWRcbiAgICAgIC8vIEl0IGNvdWxkIG1lYW4gdHdvIHRoaW5nczoga2VlcCBjdXJyZW50IG9yIHRha2UgdGhlIHVzZXIncyBkaXNwbGF5IHZhbHVlXG4gICAgICAvLyBXaGF0IGFib3V0IHR3byBlcXVhbCBkaXNwbGF5IHZhbHVlcz9cblxuICAgICAgLy8gQnV0IG5vIHJlY29yZCBzZWxlY3Rpb24gY291bGQgbWVhbiBjYW5jZWxcbiAgICAgIC8vIGJ1dCBvcGVuIG1vZGFsIGFuZCBmb3JnZXQgYWJvdXQgaXRcbiAgICAgIC8vIGluIHRoZSBlbmQsIHRoaXMgc2hvdWxkIGtlZXAgdGhpbmdzIGludGFjdCBhcyB0aGV5IHdlcmVcbiAgICAgIG9wdGlvbnMud2lkZ2V0Ll9kZXN0cm95KG1vZGFsKVxuICAgICAgdGhpcy5fc2V0SXRlbVZhbHVlcyhvcHRpb25zLndpZGdldC5fcmV0dXJuVmFsdWUpO1xuICAgICAgb3B0aW9ucy53aWRnZXQuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwOSAtIGNsb3NlIGRpYWxvZycpXG4gICAgfSxcblxuICAgIF9pbml0R3JpZENvbmZpZzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5faWckID0gdGhpcy5faXRlbSQuY2xvc2VzdCgnLmEtSUcnKVxuXG4gICAgICBpZiAodGhpcy5faWckLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5fZ3JpZCA9IHRoaXMuX2lnJC5pbnRlcmFjdGl2ZUdyaWQoJ2dldFZpZXdzJykuZ3JpZFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSBvcHRpb25zLndpZGdldFxuXG4gICAgICBzZWxmLl9pbml0R3JpZENvbmZpZygpXG5cbiAgICAgIC8vIENyZWF0ZSBMT1YgcmVnaW9uXG4gICAgICB2YXIgJG1vZGFsUmVnaW9uID0gc2VsZi5fdG9wQXBleC5qUXVlcnkobW9kYWxSZXBvcnRUZW1wbGF0ZShzZWxmLl90ZW1wbGF0ZURhdGEpKS5hcHBlbmRUbygnYm9keScpXG5cbiAgICAgIC8vIE9wZW4gbmV3IG1vZGFsXG4gICAgICAkbW9kYWxSZWdpb24uZGlhbG9nKHtcbiAgICAgICAgaGVpZ2h0OiAoc2VsZi5vcHRpb25zLnJvd0NvdW50ICogMzMpICsgMTk5LCAvLyArIGRpYWxvZyBidXR0b24gaGVpZ2h0XG4gICAgICAgIHdpZHRoOiBzZWxmLm9wdGlvbnMubW9kYWxXaWR0aCxcbiAgICAgICAgY2xvc2VUZXh0OiBhcGV4LmxhbmcuZ2V0TWVzc2FnZSgnQVBFWC5ESUFMT0cuQ0xPU0UnKSxcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBjbG9zZU9uRXNjYXBlOiB0cnVlLFxuICAgICAgICBkaWFsb2dDbGFzczogJ3VpLWRpYWxvZy0tYXBleCAnLFxuICAgICAgICBvcGVuOiBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICAgICAvLyByZW1vdmUgb3BlbmVyIGJlY2F1c2UgaXQgbWFrZXMgdGhlIHBhZ2Ugc2Nyb2xsIGRvd24gZm9yIElHXG4gICAgICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkodGhpcykuZGF0YSgndWlEaWFsb2cnKS5vcGVuZXIgPSBzZWxmLl90b3BBcGV4LmpRdWVyeSgpXG4gICAgICAgICAgc2VsZi5fdG9wQXBleC5uYXZpZ2F0aW9uLmJlZ2luRnJlZXplU2Nyb2xsKClcbiAgICAgICAgICBzZWxmLl9vbk9wZW5EaWFsb2codGhpcywgb3B0aW9ucylcbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9vbkNsb3NlRGlhbG9nKHRoaXMsIG9wdGlvbnMpXG4gICAgICAgICAgLy8gUHJldmVudCBzY3JvbGxpbmcgZG93biBvbiBtb2RhbCBjbG9zZVxuICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl90b3BBcGV4Lm5hdmlnYXRpb24uZW5kRnJlZXplU2Nyb2xsKClcbiAgICAgICAgICBzZWxmLl9yZXNldEZvY3VzKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX29uUmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgYWZ0ZXIgYSBzZWFyY2hcbiAgICAgIHZhciByZXBvcnRIdG1sID0gSGFuZGxlYmFycy5wYXJ0aWFscy5yZXBvcnQoc2VsZi5fdGVtcGxhdGVEYXRhKVxuICAgICAgdmFyIHBhZ2luYXRpb25IdG1sID0gSGFuZGxlYmFycy5wYXJ0aWFscy5wYWdpbmF0aW9uKHNlbGYuX3RlbXBsYXRlRGF0YSlcblxuICAgICAgLy8gR2V0IGN1cnJlbnQgbW9kYWwtbG92IHRhYmxlXG4gICAgICB2YXIgbW9kYWxMT1ZUYWJsZSA9IHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcubW9kYWwtbG92LXRhYmxlJylcbiAgICAgIHZhciBwYWdpbmF0aW9uID0gc2VsZi5fbW9kYWxEaWFsb2ckLmZpbmQoJy50LUJ1dHRvblJlZ2lvbi13cmFwJylcblxuICAgICAgLy8gUmVwbGFjZSByZXBvcnQgd2l0aCBuZXcgZGF0YVxuICAgICAgJChtb2RhbExPVlRhYmxlKS5yZXBsYWNlV2l0aChyZXBvcnRIdG1sKVxuICAgICAgJChwYWdpbmF0aW9uKS5odG1sKHBhZ2luYXRpb25IdG1sKVxuXG4gICAgICAvLyBzZWxlY3RJbml0aWFsUm93IGluIG5ldyBtb2RhbC1sb3YgdGFibGVcbiAgICAgIHNlbGYuX3NlbGVjdEluaXRpYWxSb3coKVxuXG4gICAgICAvLyBNYWtlIHRoZSBlbnRlciBrZXkgZG8gc29tZXRoaW5nIGFnYWluXG4gICAgICBzZWxmLl9hY3RpdmVEZWxheSA9IGZhbHNlXG4gICAgfSxcblxuICAgIF91bmVzY2FwZTogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCAvLyAkKCc8aW5wdXQgdmFsdWU9XCInICsgdmFsICsgJ1wiLz4nKS52YWwoKVxuICAgIH0sXG5cbiAgICBfZ2V0VGVtcGxhdGVEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgLy8gQ3JlYXRlIHJldHVybiBPYmplY3RcbiAgICAgIHZhciB0ZW1wbGF0ZURhdGEgPSB7XG4gICAgICAgIGlkOiBzZWxmLm9wdGlvbnMuaWQsXG4gICAgICAgIGNsYXNzZXM6ICdtb2RhbC1sb3YnLFxuICAgICAgICB0aXRsZTogc2VsZi5vcHRpb25zLnRpdGxlLFxuICAgICAgICBtb2RhbFNpemU6IHNlbGYub3B0aW9ucy5tb2RhbFNpemUsXG4gICAgICAgIHJlZ2lvbjoge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6ICdzdHlsZT1cImJvdHRvbTogNjZweDtcIidcbiAgICAgICAgfSxcbiAgICAgICAgc2VhcmNoRmllbGQ6IHtcbiAgICAgICAgICBpZDogc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkLFxuICAgICAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLm9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgdGV4dENhc2U6IHNlbGYub3B0aW9ucy50ZXh0Q2FzZSA9PT0gJ1UnID8gJ3UtdGV4dFVwcGVyJyA6IHNlbGYub3B0aW9ucy50ZXh0Q2FzZSA9PT0gJ0wnID8gJ3UtdGV4dExvd2VyJyA6ICcnLFxuICAgICAgICB9LFxuICAgICAgICByZXBvcnQ6IHtcbiAgICAgICAgICBjb2x1bW5zOiB7fSxcbiAgICAgICAgICByb3dzOiB7fSxcbiAgICAgICAgICBjb2xDb3VudDogMCxcbiAgICAgICAgICByb3dDb3VudDogMCxcbiAgICAgICAgICBzaG93SGVhZGVyczogc2VsZi5vcHRpb25zLnNob3dIZWFkZXJzLFxuICAgICAgICAgIG5vRGF0YUZvdW5kOiBzZWxmLm9wdGlvbnMubm9EYXRhRm91bmQsXG4gICAgICAgICAgY2xhc3NlczogKHNlbGYub3B0aW9ucy5hbGxvd011bHRpbGluZVJvd3MpID8gJ211bHRpbGluZScgOiAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgIHJvd0NvdW50OiAwLFxuICAgICAgICAgIGZpcnN0Um93OiAwLFxuICAgICAgICAgIGxhc3RSb3c6IDAsXG4gICAgICAgICAgYWxsb3dQcmV2OiBmYWxzZSxcbiAgICAgICAgICBhbGxvd05leHQ6IGZhbHNlLFxuICAgICAgICAgIHByZXZpb3VzOiBzZWxmLm9wdGlvbnMucHJldmlvdXNMYWJlbCxcbiAgICAgICAgICBuZXh0OiBzZWxmLm9wdGlvbnMubmV4dExhYmVsLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICAvLyBObyByb3dzIGZvdW5kP1xuICAgICAgaWYgKHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvdy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlRGF0YVxuICAgICAgfVxuXG4gICAgICAvLyBHZXQgY29sdW1uc1xuICAgICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyhzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3dbMF0pXG5cbiAgICAgIC8vIFBhZ2luYXRpb25cbiAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmZpcnN0Um93ID0gc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93WzBdWydST1dOVU0jIyMnXVxuICAgICAgdGVtcGxhdGVEYXRhLnBhZ2luYXRpb24ubGFzdFJvdyA9IHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvd1tzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3cubGVuZ3RoIC0gMV1bJ1JPV05VTSMjIyddXG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgbmV4dCByZXN1bHRzZXRcbiAgICAgIHZhciBuZXh0Um93ID0gc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93W3NlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvdy5sZW5ndGggLSAxXVsnTkVYVFJPVyMjIyddXG5cbiAgICAgIC8vIEFsbG93IHByZXZpb3VzIGJ1dHRvbj9cbiAgICAgIGlmICh0ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5maXJzdFJvdyA+IDEpIHtcbiAgICAgICAgdGVtcGxhdGVEYXRhLnBhZ2luYXRpb24uYWxsb3dQcmV2ID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBBbGxvdyBuZXh0IGJ1dHRvbj9cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChuZXh0Um93LnRvU3RyaW5nKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmFsbG93TmV4dCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmFsbG93TmV4dCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSBpbnRlcm5hbCBjb2x1bW5zIChST1dOVU0jIyMsIC4uLilcbiAgICAgIGNvbHVtbnMuc3BsaWNlKGNvbHVtbnMuaW5kZXhPZignUk9XTlVNIyMjJyksIDEpXG4gICAgICBjb2x1bW5zLnNwbGljZShjb2x1bW5zLmluZGV4T2YoJ05FWFRST1cjIyMnKSwgMSlcblxuICAgICAgLy8gUmVtb3ZlIGNvbHVtbiByZXR1cm4taXRlbVxuICAgICAgY29sdW1ucy5zcGxpY2UoY29sdW1ucy5pbmRleE9mKHNlbGYub3B0aW9ucy5yZXR1cm5Db2wpLCAxKVxuICAgICAgLy8gUmVtb3ZlIGNvbHVtbiByZXR1cm4tZGlzcGxheSBpZiBkaXNwbGF5IGNvbHVtbnMgYXJlIHByb3ZpZGVkXG4gICAgICBpZiAoY29sdW1ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbHVtbnMuc3BsaWNlKGNvbHVtbnMuaW5kZXhPZihzZWxmLm9wdGlvbnMuZGlzcGxheUNvbCksIDEpXG4gICAgICB9XG5cbiAgICAgIHRlbXBsYXRlRGF0YS5yZXBvcnQuY29sQ291bnQgPSBjb2x1bW5zLmxlbmd0aFxuXG4gICAgICAvLyBSZW5hbWUgY29sdW1ucyB0byBzdGFuZGFyZCBuYW1lcyBsaWtlIGNvbHVtbjAsIGNvbHVtbjEsIC4uXG4gICAgICB2YXIgY29sdW1uID0ge31cbiAgICAgICQuZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKGNvbHVtbnMubGVuZ3RoID09PSAxICYmIHNlbGYub3B0aW9ucy5pdGVtTGFiZWwpIHtcbiAgICAgICAgICBjb2x1bW5bJ2NvbHVtbicgKyBrZXldID0ge1xuICAgICAgICAgICAgbmFtZTogdmFsLFxuICAgICAgICAgICAgbGFiZWw6IHNlbGYub3B0aW9ucy5pdGVtTGFiZWxcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sdW1uWydjb2x1bW4nICsga2V5XSA9IHtcbiAgICAgICAgICAgIG5hbWU6IHZhbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZURhdGEucmVwb3J0LmNvbHVtbnMgPSAkLmV4dGVuZCh0ZW1wbGF0ZURhdGEucmVwb3J0LmNvbHVtbnMsIGNvbHVtbilcbiAgICAgIH0pXG5cbiAgICAgIC8qIEdldCByb3dzXG5cbiAgICAgICAgZm9ybWF0IHdpbGwgYmUgbGlrZSB0aGlzOlxuXG4gICAgICAgIHJvd3MgPSBbe2NvbHVtbjA6IFwiYVwiLCBjb2x1bW4xOiBcImJcIn0sIHtjb2x1bW4wOiBcImNcIiwgY29sdW1uMTogXCJkXCJ9XVxuXG4gICAgICAqL1xuICAgICAgdmFyIHRtcFJvd1xuXG4gICAgICB2YXIgcm93cyA9ICQubWFwKHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvdywgZnVuY3Rpb24gKHJvdywgcm93S2V5KSB7XG4gICAgICAgIHRtcFJvdyA9IHtcbiAgICAgICAgICBjb2x1bW5zOiB7fVxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZCBjb2x1bW4gdmFsdWVzIHRvIHJvd1xuICAgICAgICAkLmVhY2godGVtcGxhdGVEYXRhLnJlcG9ydC5jb2x1bW5zLCBmdW5jdGlvbiAoY29sSWQsIGNvbCkge1xuICAgICAgICAgIHRtcFJvdy5jb2x1bW5zW2NvbElkXSA9IHNlbGYuX3VuZXNjYXBlKHJvd1tjb2wubmFtZV0pXG4gICAgICAgIH0pXG4gICAgICAgIC8vIGFkZCBtZXRhZGF0YSB0byByb3dcbiAgICAgICAgdG1wUm93LnJldHVyblZhbCA9IHJvd1tzZWxmLm9wdGlvbnMucmV0dXJuQ29sXVxuICAgICAgICB0bXBSb3cuZGlzcGxheVZhbCA9IHJvd1tzZWxmLm9wdGlvbnMuZGlzcGxheUNvbF1cbiAgICAgICAgcmV0dXJuIHRtcFJvd1xuICAgICAgfSlcblxuICAgICAgdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzID0gcm93c1xuXG4gICAgICB0ZW1wbGF0ZURhdGEucmVwb3J0LnJvd0NvdW50ID0gKHJvd3MubGVuZ3RoID09PSAwID8gZmFsc2UgOiByb3dzLmxlbmd0aClcbiAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLnJvd0NvdW50ID0gdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dDb3VudFxuXG4gICAgICByZXR1cm4gdGVtcGxhdGVEYXRhXG4gICAgfSxcblxuICAgIF9kZXN0cm95OiBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgJCh3aW5kb3cudG9wLmRvY3VtZW50KS5vZmYoJ2tleWRvd24nKVxuICAgICAgJCh3aW5kb3cudG9wLmRvY3VtZW50KS5vZmYoJ2tleXVwJywgJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKVxuICAgICAgc2VsZi5faXRlbSQub2ZmKCdrZXl1cCcpXG4gICAgICBzZWxmLl9tb2RhbERpYWxvZyQucmVtb3ZlKClcbiAgICAgIHNlbGYuX3RvcEFwZXgubmF2aWdhdGlvbi5lbmRGcmVlemVTY3JvbGwoKVxuICAgIH0sXG5cbiAgICBfZ2V0RGF0YTogZnVuY3Rpb24gKG9wdGlvbnMsIGhhbmRsZXIpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICAgIHNlYXJjaFRlcm06ICcnLFxuICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHRydWVcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZChzZXR0aW5ncywgb3B0aW9ucylcbiAgICAgIHZhciBzZWFyY2hUZXJtID0gKHNldHRpbmdzLnNlYXJjaFRlcm0ubGVuZ3RoID4gMCkgPyBzZXR0aW5ncy5zZWFyY2hUZXJtIDogc2VsZi5fdG9wQXBleC5pdGVtKHNlbGYub3B0aW9ucy5zZWFyY2hGaWVsZCkuZ2V0VmFsdWUoKVxuICAgICAgdmFyIGl0ZW1zID0gW3NlbGYub3B0aW9ucy5wYWdlSXRlbXNUb1N1Ym1pdCwgc2VsZi5vcHRpb25zLmNhc2NhZGluZ0l0ZW1zXVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICAgIHJldHVybiAoc2VsZWN0b3IpXG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCcsJylcblxuICAgICAgLy8gU3RvcmUgbGFzdCBzZWFyY2hUZXJtXG4gICAgICBzZWxmLl9sYXN0U2VhcmNoVGVybSA9IHNlYXJjaFRlcm1cblxuICAgICAgYXBleC5zZXJ2ZXIucGx1Z2luKHNlbGYub3B0aW9ucy5hamF4SWRlbnRpZmllciwge1xuICAgICAgICB4MDE6ICdHRVRfREFUQScsXG4gICAgICAgIHgwMjogc2VhcmNoVGVybSwgLy8gc2VhcmNodGVybVxuICAgICAgICB4MDM6IHNldHRpbmdzLmZpcnN0Um93LCAvLyBmaXJzdCByb3dudW0gdG8gcmV0dXJuXG4gICAgICAgIHBhZ2VJdGVtczogaXRlbXNcbiAgICAgIH0sIHtcbiAgICAgICAgdGFyZ2V0OiBzZWxmLl9pdGVtJCxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgbG9hZGluZ0luZGljYXRvcjogJC5wcm94eShvcHRpb25zLmxvYWRpbmdJbmRpY2F0b3IsIHNlbGYpLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocERhdGEpIHtcbiAgICAgICAgICBzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZSA9IHBEYXRhXG4gICAgICAgICAgc2VsZi5fdGVtcGxhdGVEYXRhID0gc2VsZi5fZ2V0VGVtcGxhdGVEYXRhKClcbiAgICAgICAgICBoYW5kbGVyKHtcbiAgICAgICAgICAgIHdpZGdldDogc2VsZixcbiAgICAgICAgICAgIGZpbGxTZWFyY2hUZXh0OiBzZXR0aW5ncy5maWxsU2VhcmNoVGV4dFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9pbml0U2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIGlmIHRoZSBsYXN0U2VhcmNoVGVybSBpcyBub3QgZXF1YWwgdG8gdGhlIGN1cnJlbnQgc2VhcmNoVGVybSwgdGhlbiBzZWFyY2ggaW1tZWRpYXRlXG4gICAgICBpZiAoc2VsZi5fbGFzdFNlYXJjaFRlcm0gIT09IHNlbGYuX3RvcEFwZXguaXRlbShzZWxmLm9wdGlvbnMuc2VhcmNoRmllbGQpLmdldFZhbHVlKCkpIHtcbiAgICAgICAgc2VsZi5fZ2V0RGF0YSh7XG4gICAgICAgICAgZmlyc3RSb3c6IDEsXG4gICAgICAgICAgbG9hZGluZ0luZGljYXRvcjogc2VsZi5fbW9kYWxMb2FkaW5nSW5kaWNhdG9yXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9vblJlbG9hZCgpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdGlvbiB3aGVuIHVzZXIgaW5wdXRzIHNlYXJjaCB0ZXh0XG4gICAgICAkKHdpbmRvdy50b3AuZG9jdW1lbnQpLm9uKCdrZXl1cCcsICcjJyArIHNlbGYub3B0aW9ucy5zZWFyY2hGaWVsZCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgZm9yIG5hdmlnYXRpb24ga2V5cywgZXNjYXBlIGFuZCBlbnRlclxuICAgICAgICB2YXIgbmF2aWdhdGlvbktleXMgPSBbMzcsIDM4LCAzOSwgNDAsIDksIDMzLCAzNCwgMjcsIDEzXVxuICAgICAgICBpZiAoJC5pbkFycmF5KGV2ZW50LmtleUNvZGUsIG5hdmlnYXRpb25LZXlzKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdG9wIHRoZSBlbnRlciBrZXkgZnJvbSBzZWxlY3RpbmcgYSByb3dcbiAgICAgICAgc2VsZi5fYWN0aXZlRGVsYXkgPSB0cnVlXG5cbiAgICAgICAgLy8gRG9uJ3Qgc2VhcmNoIG9uIGFsbCBrZXkgZXZlbnRzIGJ1dCBhZGQgYSBkZWxheSBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgdmFyIHNyY0VsID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgICBpZiAoc3JjRWwuZGVsYXlUaW1lcikge1xuICAgICAgICAgIGNsZWFyVGltZW91dChzcmNFbC5kZWxheVRpbWVyKVxuICAgICAgICB9XG5cbiAgICAgICAgc3JjRWwuZGVsYXlUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgICAgZmlyc3RSb3c6IDEsXG4gICAgICAgICAgICBsb2FkaW5nSW5kaWNhdG9yOiBzZWxmLl9tb2RhbExvYWRpbmdJbmRpY2F0b3JcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9vblJlbG9hZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSwgMzUwKVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2luaXRQYWdpbmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHZhciBwcmV2U2VsZWN0b3IgPSAnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tcHJldidcbiAgICAgIHZhciBuZXh0U2VsZWN0b3IgPSAnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tbmV4dCdcblxuICAgICAgLy8gcmVtb3ZlIGN1cnJlbnQgbGlzdGVuZXJzXG4gICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSh3aW5kb3cudG9wLmRvY3VtZW50KS5vZmYoJ2NsaWNrJywgcHJldlNlbGVjdG9yKVxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkod2luZG93LnRvcC5kb2N1bWVudCkub2ZmKCdjbGljaycsIG5leHRTZWxlY3RvcilcblxuICAgICAgLy8gUHJldmlvdXMgc2V0XG4gICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSh3aW5kb3cudG9wLmRvY3VtZW50KS5vbignY2xpY2snLCBwcmV2U2VsZWN0b3IsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgIGZpcnN0Um93OiBzZWxmLl9nZXRGaXJzdFJvd251bVByZXZTZXQoKSxcbiAgICAgICAgICBsb2FkaW5nSW5kaWNhdG9yOiBzZWxmLl9tb2RhbExvYWRpbmdJbmRpY2F0b3JcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX29uUmVsb2FkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIE5leHQgc2V0XG4gICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSh3aW5kb3cudG9wLmRvY3VtZW50KS5vbignY2xpY2snLCBuZXh0U2VsZWN0b3IsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgIGZpcnN0Um93OiBzZWxmLl9nZXRGaXJzdFJvd251bU5leHRTZXQoKSxcbiAgICAgICAgICBsb2FkaW5nSW5kaWNhdG9yOiBzZWxmLl9tb2RhbExvYWRpbmdJbmRpY2F0b3JcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX29uUmVsb2FkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9nZXRGaXJzdFJvd251bVByZXZTZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3RlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmZpcnN0Um93IC0gc2VsZi5vcHRpb25zLnJvd0NvdW50XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldEZpcnN0Um93bnVtTmV4dFNldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gc2VsZi5fdGVtcGxhdGVEYXRhLnBhZ2luYXRpb24ubGFzdFJvdyArIDFcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gMTZcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29wZW5MT1Y6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBtb2RhbC1sb3YgcmVnaW9uXG4gICAgICAkKCcjJyArIHNlbGYub3B0aW9ucy5pZCwgZG9jdW1lbnQpLnJlbW92ZSgpXG5cbiAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgc2VhcmNoVGVybTogb3B0aW9ucy5zZWFyY2hUZXJtLFxuICAgICAgICBmaWxsU2VhcmNoVGV4dDogb3B0aW9ucy5maWxsU2VhcmNoVGV4dCxcbiAgICAgICAgLy8gbG9hZGluZ0luZGljYXRvcjogc2VsZi5faXRlbUxvYWRpbmdJbmRpY2F0b3JcbiAgICAgIH0sIG9wdGlvbnMuYWZ0ZXJEYXRhKVxuICAgIH0sXG5cbiAgICBfYWRkQ1NTVG9Ub3BMZXZlbDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBDU1MgZmlsZSBpcyBhbHdheXMgcHJlc2VudCB3aGVuIHRoZSBjdXJyZW50IHdpbmRvdyBpcyB0aGUgdG9wIHdpbmRvdywgc28gZG8gbm90aGluZ1xuICAgICAgaWYgKHdpbmRvdyA9PT0gd2luZG93LnRvcCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHZhciBjc3NTZWxlY3RvciA9ICdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl1baHJlZio9XCJtb2RhbC1sb3ZcIl0nXG5cbiAgICAgIC8vIENoZWNrIGlmIGZpbGUgZXhpc3RzIGluIHRvcCB3aW5kb3dcbiAgICAgIGlmIChzZWxmLl90b3BBcGV4LmpRdWVyeShjc3NTZWxlY3RvcikubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHNlbGYuX3RvcEFwZXgualF1ZXJ5KCdoZWFkJykuYXBwZW5kKCQoY3NzU2VsZWN0b3IpLmNsb25lKCkpXG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEZ1bmN0aW9uIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNTE3MzQ0M1xuICAgIF9mb2N1c05leHRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAvL2FkZCBhbGwgZWxlbWVudHMgd2Ugd2FudCB0byBpbmNsdWRlIGluIG91ciBzZWxlY3Rpb25cbiAgICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IFtcbiAgICAgICAgJ2E6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnW3RhYmluZGV4XTpub3QoW2Rpc2FibGVkXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICBdLmpvaW4oJywgJyk7XG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmZvcm0pIHtcbiAgICAgICAgdmFyIGZvY3VzYWJsZSA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChkb2N1bWVudC5hY3RpdmVFbGVtZW50LmZvcm0ucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cyksXG4gICAgICAgICAgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vY2hlY2sgZm9yIHZpc2liaWxpdHkgd2hpbGUgYWx3YXlzIGluY2x1ZGUgdGhlIGN1cnJlbnQgYWN0aXZlRWxlbWVudFxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCB8fCBlbGVtZW50ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICAgICAgfSk7XG4gICAgICAgIHZhciBpbmRleCA9IGZvY3VzYWJsZS5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgIHZhciBuZXh0RWxlbWVudCA9IGZvY3VzYWJsZVtpbmRleCArIDFdIHx8IGZvY3VzYWJsZVswXTtcbiAgICAgICAgICBhcGV4LmRlYnVnLnRyYWNlKCdGQ1MgTE9WIC0gZm9jdXMgbmV4dCcpO1xuICAgICAgICAgIG5leHRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRnVuY3Rpb24gYmFzZWQgb24gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM1MTczNDQzXG4gICAgX2ZvY3VzUHJldkVsZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vYWRkIGFsbCBlbGVtZW50cyB3ZSB3YW50IHRvIGluY2x1ZGUgaW4gb3VyIHNlbGVjdGlvblxuICAgICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gW1xuICAgICAgICAnYTpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ2lucHV0Om5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdbdGFiaW5kZXhdOm5vdChbZGlzYWJsZWRdKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgIF0uam9pbignLCAnKTtcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZm9ybSkge1xuICAgICAgICB2YXIgZm9jdXNhYmxlID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzKSxcbiAgICAgICAgICBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgLy9jaGVjayBmb3IgdmlzaWJpbGl0eSB3aGlsZSBhbHdheXMgaW5jbHVkZSB0aGUgY3VycmVudCBhY3RpdmVFbGVtZW50XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwIHx8IGVsZW1lbnQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgdmFyIGluZGV4ID0gZm9jdXNhYmxlLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgdmFyIHByZXZFbGVtZW50ID0gZm9jdXNhYmxlW2luZGV4IC0gMV0gfHwgZm9jdXNhYmxlWzBdO1xuICAgICAgICAgIGFwZXguZGVidWcudHJhY2UoJ0ZDUyBMT1YgLSBmb2N1cyBwcmV2aW91cycpO1xuICAgICAgICAgIHByZXZFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldEl0ZW1WYWx1ZXM6IGZ1bmN0aW9uIChyZXR1cm5WYWx1ZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIHJlcG9ydFJvdztcbiAgICAgIGlmIChzZWxmLl90ZW1wbGF0ZURhdGEucmVwb3J0Py5yb3dzPy5sZW5ndGgpIHtcbiAgICAgICAgcmVwb3J0Um93ID0gc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzLmZpbmQocm93ID0+IHJvdy5yZXR1cm5WYWwgPT09IHJldHVyblZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgYXBleC5pdGVtKHNlbGYub3B0aW9ucy5pdGVtTmFtZSkuc2V0VmFsdWUocmVwb3J0Um93Py5yZXR1cm5WYWwgfHwgJycsIHJlcG9ydFJvdz8uZGlzcGxheVZhbCB8fCAnJyk7XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWRkaXRpb25hbE91dHB1dHNTdHIpIHtcbiAgICAgICAgc2VsZi5faW5pdEdyaWRDb25maWcoKVxuXG4gICAgICAgIHZhciBkYXRhUm93ID0gc2VsZi5vcHRpb25zLmRhdGFTb3VyY2U/LnJvdz8uZmluZChyb3cgPT4gcm93W3NlbGYub3B0aW9ucy5yZXR1cm5Db2xdID09PSByZXR1cm5WYWx1ZSk7XG5cbiAgICAgICAgc2VsZi5vcHRpb25zLmFkZGl0aW9uYWxPdXRwdXRzU3RyLnNwbGl0KCcsJykuZm9yRWFjaChzdHIgPT4ge1xuICAgICAgICAgIHZhciBkYXRhS2V5ID0gc3RyLnNwbGl0KCc6JylbMF07XG4gICAgICAgICAgdmFyIGl0ZW1JZCA9IHN0ci5zcGxpdCgnOicpWzFdO1xuICAgICAgICAgIHZhciBjb2x1bW47XG4gICAgICAgICAgaWYgKHNlbGYuX2dyaWQpIHtcbiAgICAgICAgICAgIGNvbHVtbiA9IHNlbGYuX2dyaWQuZ2V0Q29sdW1ucygpPy5maW5kKGNvbCA9PiBpdGVtSWQ/LmluY2x1ZGVzKGNvbC5wcm9wZXJ0eSkpXG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBhZGRpdGlvbmFsSXRlbSA9IGFwZXguaXRlbShjb2x1bW4gPyBjb2x1bW4uZWxlbWVudElkIDogaXRlbUlkKTtcblxuICAgICAgICAgIGlmIChpdGVtSWQgJiYgZGF0YUtleSAmJiBhZGRpdGlvbmFsSXRlbSkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gT2JqZWN0LmtleXMoZGF0YVJvdyB8fCB7fSkuZmluZChrID0+IGsudG9VcHBlckNhc2UoKSA9PT0gZGF0YUtleSk7XG4gICAgICAgICAgICBpZiAoZGF0YVJvdyAmJiBkYXRhUm93W2tleV0pIHtcbiAgICAgICAgICAgICAgYWRkaXRpb25hbEl0ZW0uc2V0VmFsdWUoZGF0YVJvd1trZXldLCBkYXRhUm93W2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWRkaXRpb25hbEl0ZW0uc2V0VmFsdWUoJycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfdHJpZ2dlckxPVk9uRGlzcGxheTogZnVuY3Rpb24gKGNhbGxlZEZyb20gPSBudWxsKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgaWYgKGNhbGxlZEZyb20pIHtcbiAgICAgICAgYXBleC5kZWJ1Zy50cmFjZSgnX3RyaWdnZXJMT1ZPbkRpc3BsYXkgY2FsbGVkIGZyb20gXCInICsgY2FsbGVkRnJvbSArICdcIicpO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmlnZ2VyIGV2ZW50IG9uIGNsaWNrIG91dHNpZGUgZWxlbWVudFxuICAgICAgJChkb2N1bWVudCkubW91c2Vkb3duKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBzZWxmLl9pdGVtJC5vZmYoJ2tleWRvd24nKVxuICAgICAgICAkKGRvY3VtZW50KS5vZmYoJ21vdXNlZG93bicpXG5cbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgaWYgKCEkdGFyZ2V0LmNsb3Nlc3QoJyMnICsgc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5sZW5ndGggJiYgIXNlbGYuX2l0ZW0kLmlzKFwiOmZvY3VzXCIpKSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDAxIC0gbm90IGZvY3VzZWQgY2xpY2sgb2ZmJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCR0YXJnZXQuY2xvc2VzdCgnIycgKyBzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwMiAtIGNsaWNrIG9uIGlucHV0Jyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCR0YXJnZXQuY2xvc2VzdCgnIycgKyBzZWxmLm9wdGlvbnMuc2VhcmNoQnV0dG9uKS5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDMgLSBjbGljayBvbiBzZWFyY2g6ICcgKyBzZWxmLl9pdGVtJC52YWwoKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCR0YXJnZXQuY2xvc2VzdCgnLmZjcy1zZWFyY2gtY2xlYXInKS5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDQgLSBjbGljayBvbiBjbGVhcicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5faXRlbSQudmFsKCkpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDUgLSBubyBpdGVtcycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLl9pdGVtJC52YWwoKS50b1VwcGVyQ2FzZSgpID09PSBhcGV4Lml0ZW0oc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5nZXRWYWx1ZSgpLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMTAgLSBjbGljayBubyBjaGFuZ2UnKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGljayBvZmYgLSBjaGVjayB2YWx1ZScpXG4gICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgIHNlYXJjaFRlcm06IHNlbGYuX2l0ZW0kLnZhbCgpLFxuICAgICAgICAgIGZpcnN0Um93OiAxLFxuICAgICAgICAgIC8vIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvclxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHNlbGYuX3RlbXBsYXRlRGF0YS5wYWdpbmF0aW9uWydyb3dDb3VudCddID09PSAxKSB7XG4gICAgICAgICAgICAvLyAxIHZhbGlkIG9wdGlvbiBtYXRjaGVzIHRoZSBzZWFyY2guIFVzZSB2YWxpZCBvcHRpb24uXG4gICAgICAgICAgICBzZWxmLl9zZXRJdGVtVmFsdWVzKHNlbGYuX3RlbXBsYXRlRGF0YS5yZXBvcnQucm93c1swXS5yZXR1cm5WYWwpO1xuICAgICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA2IC0gY2xpY2sgb2ZmIG1hdGNoIGZvdW5kJylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3BlbiB0aGUgbW9kYWxcbiAgICAgICAgICAgIHNlbGYuX29wZW5MT1Yoe1xuICAgICAgICAgICAgICBzZWFyY2hUZXJtOiBzZWxmLl9pdGVtJC52YWwoKSxcbiAgICAgICAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHRydWUsXG4gICAgICAgICAgICAgIGFmdGVyRGF0YTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9vbkxvYWQob3B0aW9ucylcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBpbnB1dCBhcyBzb29uIGFzIG1vZGFsIGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSAnJ1xuICAgICAgICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbCgnJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgLy8gVHJpZ2dlciBldmVudCBvbiB0YWIgb3IgZW50ZXJcbiAgICAgIHNlbGYuX2l0ZW0kLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5faXRlbSQub2ZmKCdrZXlkb3duJylcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZWRvd24nKVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdrZXlkb3duJywgZS5rZXlDb2RlKVxuXG4gICAgICAgIGlmICgoZS5rZXlDb2RlID09PSA5ICYmICEhc2VsZi5faXRlbSQudmFsKCkpIHx8IGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAvLyBObyBjaGFuZ2VzLCBubyBmdXJ0aGVyIHByb2Nlc3NpbmcgKGlmIG5vdCBlbnRlciBwcmVzcyBvbiBlbXB0eSBpbnB1dCkuXG4gICAgICAgICAgaWYgKHNlbGYuX2l0ZW0kLnZhbCgpLnRvVXBwZXJDYXNlKCkgPT09IGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmdldFZhbHVlKCkudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgJiYgIShlLmtleUNvZGUgPT09IDEzICYmICFzZWxmLl9pdGVtJC52YWwoKSkpIHtcbiAgICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAxMSAtIGtleSBubyBjaGFuZ2UnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDkpIHtcbiAgICAgICAgICAgIC8vIFN0b3AgdGFiIGV2ZW50XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIC8vIFN0b3AgZW50ZXIgZXZlbnRcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2tleWRvd24gdGFiIG9yIGVudGVyIC0gY2hlY2sgdmFsdWUnKVxuICAgICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgICAgIC8vIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvclxuICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLl90ZW1wbGF0ZURhdGEucGFnaW5hdGlvblsncm93Q291bnQnXSA9PT0gMSkge1xuICAgICAgICAgICAgICAvLyAxIHZhbGlkIG9wdGlvbiBtYXRjaGVzIHRoZSBzZWFyY2guIFVzZSB2YWxpZCBvcHRpb24uXG4gICAgICAgICAgICAgIHNlbGYuX3NldEl0ZW1WYWx1ZXMoc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzWzBdLnJldHVyblZhbCk7XG4gICAgICAgICAgICAgIHNlbGYuX3Jlc2V0Rm9jdXMoKTtcbiAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLm5leHRPbkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLl9mb2N1c05leHRFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCkge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZvY3VzUHJldkVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9mb2N1c05leHRFbGVtZW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA3IC0ga2V5IG9mZiBtYXRjaCBmb3VuZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gT3BlbiB0aGUgbW9kYWxcbiAgICAgICAgICAgICAgc2VsZi5fb3BlbkxPVih7XG4gICAgICAgICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYWZ0ZXJEYXRhOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgc2VsZi5fb25Mb2FkKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAvLyBDbGVhciBpbnB1dCBhcyBzb29uIGFzIG1vZGFsIGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9ICcnXG4gICAgICAgICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwoJycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA4IC0ga2V5IGRvd24nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfdHJpZ2dlckxPVk9uQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIFRyaWdnZXIgZXZlbnQgb24gY2xpY2sgaW5wdXQgZ3JvdXAgYWRkb24gYnV0dG9uIChtYWduaWZpZXIgZ2xhc3MpXG4gICAgICBzZWxmLl9zZWFyY2hCdXR0b24kLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYuX29wZW5MT1Yoe1xuICAgICAgICAgIHNlYXJjaFRlcm06IHNlbGYuX2l0ZW0kLnZhbCgpIHx8ICcnLFxuICAgICAgICAgIGZpbGxTZWFyY2hUZXh0OiB0cnVlLFxuICAgICAgICAgIGFmdGVyRGF0YTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHNlbGYuX29uTG9hZChvcHRpb25zKVxuICAgICAgICAgICAgLy8gQ2xlYXIgaW5wdXQgYXMgc29vbiBhcyBtb2RhbCBpcyByZWFkeVxuICAgICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSAnJ1xuICAgICAgICAgICAgc2VsZi5faXRlbSQudmFsKCcnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9vblJvd0hvdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5vbignbW91c2VlbnRlciBtb3VzZWxlYXZlJywgJy50LVJlcG9ydC1yZXBvcnQgdGJvZHkgdHInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdtYXJrJykpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKHNlbGYub3B0aW9ucy5ob3ZlckNsYXNzZXMpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfc2VsZWN0SW5pdGlhbFJvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBJZiBjdXJyZW50IGl0ZW0gaW4gTE9WIHRoZW4gc2VsZWN0IHRoYXQgcm93XG4gICAgICAvLyBFbHNlIHNlbGVjdCBmaXJzdCByb3cgb2YgcmVwb3J0XG4gICAgICB2YXIgJGN1clJvdyA9IHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1SZXBvcnQtcmVwb3J0IHRyW2RhdGEtcmV0dXJuPVwiJyArIHNlbGYuX3JldHVyblZhbHVlICsgJ1wiXScpXG4gICAgICBpZiAoJGN1clJvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgICRjdXJSb3cuYWRkQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1SZXBvcnQtcmVwb3J0IHRyW2RhdGEtcmV0dXJuXScpLmZpcnN0KCkuYWRkQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRLZXlib2FyZE5hdmlnYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICBmdW5jdGlvbiBuYXZpZ2F0ZShkaXJlY3Rpb24sIGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdmFyIGN1cnJlbnRSb3cgPSBzZWxmLl9tb2RhbERpYWxvZyQuZmluZCgnLnQtUmVwb3J0LXJlcG9ydCB0ci5tYXJrJylcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBpZiAoJChjdXJyZW50Um93KS5wcmV2KCkuaXMoJy50LVJlcG9ydC1yZXBvcnQgdHInKSkge1xuICAgICAgICAgICAgICAkKGN1cnJlbnRSb3cpLnJlbW92ZUNsYXNzKCdtYXJrICcgKyBzZWxmLm9wdGlvbnMubWFya0NsYXNzZXMpLnByZXYoKS5hZGRDbGFzcygnbWFyayAnICsgc2VsZi5vcHRpb25zLm1hcmtDbGFzc2VzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIGlmICgkKGN1cnJlbnRSb3cpLm5leHQoKS5pcygnLnQtUmVwb3J0LXJlcG9ydCB0cicpKSB7XG4gICAgICAgICAgICAgICQoY3VycmVudFJvdykucmVtb3ZlQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcykubmV4dCgpLmFkZENsYXNzKCdtYXJrICcgKyBzZWxmLm9wdGlvbnMubWFya0NsYXNzZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICQod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXG4gICAgICAgICAgICBuYXZpZ2F0ZSgndXAnLCBlKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnZG93bicsIGUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnZG93bicsIGUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICBpZiAoIXNlbGYuX2FjdGl2ZURlbGF5KSB7XG4gICAgICAgICAgICAgIHZhciBjdXJyZW50Um93ID0gc2VsZi5fbW9kYWxEaWFsb2ckLmZpbmQoJy50LVJlcG9ydC1yZXBvcnQgdHIubWFyaycpLmZpcnN0KClcbiAgICAgICAgICAgICAgc2VsZi5fcmV0dXJuU2VsZWN0ZWRSb3coY3VycmVudFJvdylcbiAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzM6IC8vIFBhZ2UgdXBcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkoJyMnICsgc2VsZi5vcHRpb25zLmlkICsgJyAudC1CdXR0b25SZWdpb24tYnV0dG9ucyAudC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLXByZXYnKS50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzQ6IC8vIFBhZ2UgZG93blxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSgnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LUJ1dHRvblJlZ2lvbi1idXR0b25zIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tbmV4dCcpLnRyaWdnZXIoJ2NsaWNrJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9yZXR1cm5TZWxlY3RlZFJvdzogZnVuY3Rpb24gKCRyb3cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAvLyBEbyBub3RoaW5nIGlmIHJvdyBkb2VzIG5vdCBleGlzdFxuICAgICAgaWYgKCEkcm93IHx8ICRyb3cubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhcGV4Lml0ZW0oc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5zZXRWYWx1ZShzZWxmLl91bmVzY2FwZSgkcm93LmRhdGEoJ3JldHVybicpLnRvU3RyaW5nKCkpLCBzZWxmLl91bmVzY2FwZSgkcm93LmRhdGEoJ2Rpc3BsYXknKSkpXG5cblxuICAgICAgLy8gVHJpZ2dlciBhIGN1c3RvbSBldmVudCBhbmQgYWRkIGRhdGEgdG8gaXQ6IGFsbCBjb2x1bW5zIG9mIHRoZSByb3dcbiAgICAgIHZhciBkYXRhID0ge31cbiAgICAgICQuZWFjaCgkKCcudC1SZXBvcnQtcmVwb3J0IHRyLm1hcmsnKS5maW5kKCd0ZCcpLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgZGF0YVskKHZhbCkuYXR0cignaGVhZGVycycpXSA9ICQodmFsKS5odG1sKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmFsbHkgaGlkZSB0aGUgbW9kYWxcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5kaWFsb2coJ2Nsb3NlJylcbiAgICB9LFxuXG4gICAgX29uUm93U2VsZWN0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gQWN0aW9uIHdoZW4gcm93IGlzIGNsaWNrZWRcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5vbignY2xpY2snLCAnLm1vZGFsLWxvdi10YWJsZSAudC1SZXBvcnQtcmVwb3J0IHRib2R5IHRyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5fcmV0dXJuU2VsZWN0ZWRSb3coc2VsZi5fdG9wQXBleC5qUXVlcnkodGhpcykpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlVmFsaWRhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQ2xlYXIgY3VycmVudCBlcnJvcnNcbiAgICAgIGFwZXgubWVzc2FnZS5jbGVhckVycm9ycyh0aGlzLm9wdGlvbnMuaXRlbU5hbWUpXG4gICAgfSxcblxuICAgIF9jbGVhcklucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHNlbGYuX3NldEl0ZW1WYWx1ZXMoJycpXG4gICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9ICcnXG4gICAgICBzZWxmLl9yZW1vdmVWYWxpZGF0aW9uKClcbiAgICAgIHNlbGYuX2l0ZW0kLmZvY3VzKClcbiAgICB9LFxuXG4gICAgX2luaXRDbGVhcklucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgc2VsZi5fY2xlYXJJbnB1dCQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9jbGVhcklucHV0KClcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9pbml0Q2FzY2FkaW5nTE9WczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAkKHNlbGYub3B0aW9ucy5jYXNjYWRpbmdJdGVtcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5fY2xlYXJJbnB1dCgpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfc2V0VmFsdWVCYXNlZE9uRGlzcGxheTogZnVuY3Rpb24gKHBWYWx1ZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgIHZhciBwcm9taXNlID0gYXBleC5zZXJ2ZXIucGx1Z2luKHNlbGYub3B0aW9ucy5hamF4SWRlbnRpZmllciwge1xuICAgICAgICB4MDE6ICdHRVRfVkFMVUUnLFxuICAgICAgICB4MDI6IHBWYWx1ZSAvLyByZXR1cm5WYWxcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgbG9hZGluZ0luZGljYXRvcjogJC5wcm94eShzZWxmLl9pdGVtTG9hZGluZ0luZGljYXRvciwgc2VsZiksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICAgIHNlbGYuX2Rpc2FibGVDaGFuZ2VFdmVudCA9IGZhbHNlXG4gICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSBwRGF0YS5yZXR1cm5WYWx1ZVxuICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbChwRGF0YS5kaXNwbGF5VmFsdWUpXG4gICAgICAgICAgc2VsZi5faXRlbSQudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcHJvbWlzZVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAocERhdGEpIHtcbiAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9IHBEYXRhLnJldHVyblZhbHVlXG4gICAgICAgICAgc2VsZi5faXRlbSQudmFsKHBEYXRhLmRpc3BsYXlWYWx1ZSlcbiAgICAgICAgICBzZWxmLl9pdGVtJC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICAgICB9KVxuICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9kaXNhYmxlQ2hhbmdlRXZlbnQgPSBmYWxzZVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBfaW5pdEFwZXhJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIFNldCBhbmQgZ2V0IHZhbHVlIHZpYSBhcGV4IGZ1bmN0aW9uc1xuICAgICAgYXBleC5pdGVtLmNyZWF0ZShzZWxmLm9wdGlvbnMuaXRlbU5hbWUsIHtcbiAgICAgICAgZW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5faXRlbSQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICAgICAgICBzZWxmLl9zZWFyY2hCdXR0b24kLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgc2VsZi5fY2xlYXJJbnB1dCQuc2hvdygpXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9pdGVtJC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgc2VsZi5fY2xlYXJJbnB1dCQuaGlkZSgpXG4gICAgICAgIH0sXG4gICAgICAgIGlzRGlzYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5faXRlbSQucHJvcCgnZGlzYWJsZWQnKVxuICAgICAgICB9LFxuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5faXRlbSQuc2hvdygpXG4gICAgICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJC5zaG93KClcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX2l0ZW0kLmhpZGUoKVxuICAgICAgICAgIHNlbGYuX3NlYXJjaEJ1dHRvbiQuaGlkZSgpXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uIChwVmFsdWUsIHBEaXNwbGF5VmFsdWUsIHBTdXBwcmVzc0NoYW5nZUV2ZW50KSB7XG4gICAgICAgICAgaWYgKHBEaXNwbGF5VmFsdWUgfHwgIXBWYWx1ZSB8fCBwVmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBBc3N1bWluZyBubyBjaGVjayBpcyBuZWVkZWQgdG8gc2VlIGlmIHRoZSB2YWx1ZSBpcyBpbiB0aGUgTE9WXG4gICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwocERpc3BsYXlWYWx1ZSlcbiAgICAgICAgICAgIHNlbGYuX3JldHVyblZhbHVlID0gcFZhbHVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbChwRGlzcGxheVZhbHVlKVxuICAgICAgICAgICAgc2VsZi5fZGlzYWJsZUNoYW5nZUV2ZW50ID0gdHJ1ZVxuICAgICAgICAgICAgc2VsZi5fc2V0VmFsdWVCYXNlZE9uRGlzcGxheShwVmFsdWUpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIEFsd2F5cyByZXR1cm4gYXQgbGVhc3QgYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3JldHVyblZhbHVlIHx8ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGlzQ2hhbmdlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLnZhbHVlICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmRlZmF1bHRWYWx1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gT3JpZ2luYWwgSlMgZm9yIHVzZSBiZWZvcmUgQVBFWCAyMC4yXG4gICAgICAvLyBhcGV4Lml0ZW0oc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5jYWxsYmFja3MuZGlzcGxheVZhbHVlRm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICByZXR1cm4gc2VsZi5faXRlbSQudmFsKClcbiAgICAgIC8vIH1cbiAgICAgIC8vIE5ldyBKUyBmb3IgcG9zdCBBUEVYIDIwLjIgd29ybGRcbiAgICAgIGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmRpc3BsYXlWYWx1ZUZvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2l0ZW0kLnZhbCgpXG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgdHJpZ2dlciB0aGUgY2hhbmdlIGV2ZW50IGFmdGVyIHRoZSBBc3luYyBjYWxsYmFjayBpZiBuZWVkZWRcbiAgICAgIHNlbGYuX2l0ZW0kWyd0cmlnZ2VyJ10gPSBmdW5jdGlvbiAodHlwZSwgZGF0YSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2NoYW5nZScgJiYgc2VsZi5fZGlzYWJsZUNoYW5nZUV2ZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgJC5mbi50cmlnZ2VyLmNhbGwoc2VsZi5faXRlbSQsIHR5cGUsIGRhdGEpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9pdGVtTG9hZGluZ0luZGljYXRvcjogZnVuY3Rpb24gKGxvYWRpbmdJbmRpY2F0b3IpIHtcbiAgICAgICQoJyMnICsgdGhpcy5vcHRpb25zLnNlYXJjaEJ1dHRvbikuYWZ0ZXIobG9hZGluZ0luZGljYXRvcilcbiAgICAgIHJldHVybiBsb2FkaW5nSW5kaWNhdG9yXG4gICAgfSxcblxuICAgIF9tb2RhbExvYWRpbmdJbmRpY2F0b3I6IGZ1bmN0aW9uIChsb2FkaW5nSW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLl9tb2RhbERpYWxvZyQucHJlcGVuZChsb2FkaW5nSW5kaWNhdG9yKVxuICAgICAgcmV0dXJuIGxvYWRpbmdJbmRpY2F0b3JcbiAgICB9XG4gIH0pXG59KShhcGV4LmpRdWVyeSwgd2luZG93KVxuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzgsXCI+PSA0LjMuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGFsaWFzMj1jb250YWluZXIuaG9va3MuaGVscGVyTWlzc2luZywgYWxpYXMzPVwiZnVuY3Rpb25cIiwgYWxpYXM0PWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBhbGlhczU9Y29udGFpbmVyLmxhbWJkYSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiPGRpdiBpZD1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiaWRcIikgfHwgKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwiaWRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjo5fSxcImVuZFwiOntcImxpbmVcIjoxLFwiY29sdW1uXCI6MTV9fX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcInQtRGlhbG9nUmVnaW9uIGpzLXJlZ2llb25EaWFsb2cgdC1Gb3JtLS1zdHJldGNoSW5wdXRzIHQtRm9ybS0tbGFyZ2UgbW9kYWwtbG92XFxcIiB0aXRsZT1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwidGl0bGVcIikgfHwgKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwidGl0bGVcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjoxMTB9LFwiZW5kXCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjoxMTl9fX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInQtRGlhbG9nUmVnaW9uLWJvZHkganMtcmVnaW9uRGlhbG9nLWJvZHkgbm8tcGFkZGluZ1xcXCIgXCJcbiAgICArICgoc3RhY2sxID0gYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmVnaW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcImF0dHJpYnV0ZXNcIikgOiBzdGFjazEpLCBkZXB0aDApKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wgY29sLTEyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtUmVwb3J0IHQtUmVwb3J0LS1hbHRSb3dzRGVmYXVsdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1SZXBvcnQtd3JhcFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1Gb3JtLWZpZWxkQ29udGFpbmVyIHQtRm9ybS1maWVsZENvbnRhaW5lci0tc3RhY2tlZCB0LUZvcm0tZmllbGRDb250YWluZXItLXN0cmV0Y2hJbnB1dHMgbWFyZ2luLXRvcC1zbVxcXCIgaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwic2VhcmNoRmllbGRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiaWRcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJfQ09OVEFJTkVSXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtRm9ybS1pbnB1dENvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1Gb3JtLWl0ZW1XcmFwcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJhcGV4LWl0ZW0tdGV4dCBtb2RhbC1sb3YtaXRlbSBcIlxuICAgICsgYWxpYXM0KGFsaWFzNSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInNlYXJjaEZpZWxkXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInRleHRDYXNlXCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiIFxcXCIgaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwic2VhcmNoRmllbGRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiaWRcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJcXFwiIGF1dG9jb21wbGV0ZT1cXFwib2ZmXFxcIiBwbGFjZWhvbGRlcj1cXFwiXCJcbiAgICArIGFsaWFzNChhbGlhczUoKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJzZWFyY2hGaWVsZFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJwbGFjZWhvbGRlclwiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwiUDExMTBfWkFBTF9GS19DT0RFX0JVVFRPTlxcXCIgY2xhc3M9XFxcImEtQnV0dG9uIGZjcy1tb2RhbC1sb3YtYnV0dG9uIGEtQnV0dG9uLS1wb3B1cExPVlxcXCIgdGFiSW5kZXg9XFxcIi0xXFxcIiBzdHlsZT1cXFwibWFyZ2luLWxlZnQ6LTQwcHg7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCk7XFxcIiBkaXNhYmxlZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJmYSBmYS1zZWFyY2hcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5pbnZva2VQYXJ0aWFsKGxvb2t1cFByb3BlcnR5KHBhcnRpYWxzLFwicmVwb3J0XCIpLGRlcHRoMCx7XCJuYW1lXCI6XCJyZXBvcnRcIixcImRhdGFcIjpkYXRhLFwiaW5kZW50XCI6XCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsXCJoZWxwZXJzXCI6aGVscGVycyxcInBhcnRpYWxzXCI6cGFydGlhbHMsXCJkZWNvcmF0b3JzXCI6Y29udGFpbmVyLmRlY29yYXRvcnN9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0LURpYWxvZ1JlZ2lvbi1idXR0b25zIGpzLXJlZ2lvbkRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInQtQnV0dG9uUmVnaW9uIHQtQnV0dG9uUmVnaW9uLS1kaWFsb2dSZWdpb25cXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtQnV0dG9uUmVnaW9uLXdyYXBcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5pbnZva2VQYXJ0aWFsKGxvb2t1cFByb3BlcnR5KHBhcnRpYWxzLFwicGFnaW5hdGlvblwiKSxkZXB0aDAse1wibmFtZVwiOlwicGFnaW5hdGlvblwiLFwiZGF0YVwiOmRhdGEsXCJpbmRlbnRcIjpcIiAgICAgICAgICAgICAgICBcIixcImhlbHBlcnNcIjpoZWxwZXJzLFwicGFydGlhbHNcIjpwYXJ0aWFscyxcImRlY29yYXRvcnNcIjpjb250YWluZXIuZGVjb3JhdG9yc30pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCI7XG59LFwidXNlUGFydGlhbFwiOnRydWUsXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLCBhbGlhczI9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMzPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1jb2wgdC1CdXR0b25SZWdpb24tY29sLS1sZWZ0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidC1CdXR0b25SZWdpb24tYnV0dG9uc1xcXCI+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImlmXCIpLmNhbGwoYWxpYXMxLCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJhbGxvd1ByZXZcIikgOiBzdGFjazEpLHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDIsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjo0LFwiY29sdW1uXCI6Nn0sXCJlbmRcIjp7XCJsaW5lXCI6OCxcImNvbHVtblwiOjEzfX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1jb2wgdC1CdXR0b25SZWdpb24tY29sLS1jZW50ZXJcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXG4gIFwiXG4gICAgKyBhbGlhczMoYWxpYXMyKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJmaXJzdFJvd1wiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIiAtIFwiXG4gICAgKyBhbGlhczMoYWxpYXMyKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJsYXN0Um93XCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwidC1CdXR0b25SZWdpb24tY29sIHQtQnV0dG9uUmVnaW9uLWNvbC0tcmlnaHRcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1idXR0b25zXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiaWZcIikuY2FsbChhbGlhczEsKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJwYWdpbmF0aW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcImFsbG93TmV4dFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjE2LFwiY29sdW1uXCI6Nn0sXCJlbmRcIjp7XCJsaW5lXCI6MjAsXCJjb2x1bW5cIjoxM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiICAgICAgICA8YSBocmVmPVxcXCJqYXZhc2NyaXB0OnZvaWQoMCk7XFxcIiBjbGFzcz1cXFwidC1CdXR0b24gdC1CdXR0b24tLXNtYWxsIHQtQnV0dG9uLS1ub1VJIHQtUmVwb3J0LXBhZ2luYXRpb25MaW5rIHQtUmVwb3J0LXBhZ2luYXRpb25MaW5rLS1wcmV2XFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImEtSWNvbiBpY29uLWxlZnQtYXJyb3dcXFwiPjwvc3Bhbj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInBhZ2luYXRpb25cIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwicHJldmlvdXNcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJcXG4gICAgICAgIDwvYT5cXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgICAgIDxhIGhyZWY9XFxcImphdmFzY3JpcHQ6dm9pZCgwKTtcXFwiIGNsYXNzPVxcXCJ0LUJ1dHRvbiB0LUJ1dHRvbi0tc21hbGwgdC1CdXR0b24tLW5vVUkgdC1SZXBvcnQtcGFnaW5hdGlvbkxpbmsgdC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLW5leHRcXFwiPlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbihjb250YWluZXIubGFtYmRhKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJuZXh0XCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJhLUljb24gaWNvbi1yaWdodC1hcnJvd1xcXCI+PC9zcGFuPlxcbiAgICAgICAgPC9hPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzgsXCI+PSA0LjMuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJwYWdpbmF0aW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInJvd0NvdW50XCIpIDogc3RhY2sxKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MSxcImNvbHVtblwiOjB9LFwiZW5kXCI6e1wibGluZVwiOjIzLFwiY29sdW1uXCI6N319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgb3B0aW9ucywgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9LCBidWZmZXIgPSBcbiAgXCIgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIHN1bW1hcnk9XFxcIlxcXCIgY2xhc3M9XFxcInQtUmVwb3J0LXJlcG9ydCBcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJjbGFzc2VzXCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxcIiB3aWR0aD1cXFwiMTAwJVxcXCI+XFxuICAgICAgICAgICAgICA8dGJvZHk+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImlmXCIpLmNhbGwoYWxpYXMxLCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmVwb3J0XCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInNob3dIZWFkZXJzXCIpIDogc3RhY2sxKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MTIsXCJjb2x1bW5cIjoxNn0sXCJlbmRcIjp7XCJsaW5lXCI6MjQsXCJjb2x1bW5cIjoyM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcInJlcG9ydFwiKSB8fCAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJyZXBvcnRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogY29udGFpbmVyLmhvb2tzLmhlbHBlck1pc3NpbmcpLChvcHRpb25zPXtcIm5hbWVcIjpcInJlcG9ydFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSg4LCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MjUsXCJjb2x1bW5cIjoxNn0sXCJlbmRcIjp7XCJsaW5lXCI6MjgsXCJjb2x1bW5cIjoyN319fSksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGFsaWFzMSxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJyZXBvcnRcIikpIHsgc3RhY2sxID0gY29udGFpbmVyLmhvb2tzLmJsb2NrSGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIiAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgIDx0aGVhZD5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJyZXBvcnRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiY29sdW1uc1wiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgzLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MTQsXCJjb2x1bW5cIjoyMH0sXCJlbmRcIjp7XCJsaW5lXCI6MjIsXCJjb2x1bW5cIjoyOX19fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxcblwiO1xufSxcIjNcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XFxcInQtUmVwb3J0LWNvbEhlYWRcXFwiIGlkPVxcXCJcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImtleVwiKSB8fCAoZGF0YSAmJiBsb29rdXBQcm9wZXJ0eShkYXRhLFwia2V5XCIpKSkgIT0gbnVsbCA/IGhlbHBlciA6IGNvbnRhaW5lci5ob29rcy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImtleVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjoxNSxcImNvbHVtblwiOjU1fSxcImVuZFwiOntcImxpbmVcIjoxNSxcImNvbHVtblwiOjYzfX19KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGFsaWFzMSwoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJsYWJlbFwiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLnByb2dyYW0oNiwgZGF0YSwgMCksXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjE2LFwiY29sdW1uXCI6MjR9LFwiZW5kXCI6e1wibGluZVwiOjIwLFwiY29sdW1uXCI6MzF9fX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKGNvbnRhaW5lci5sYW1iZGEoKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwibGFiZWxcIikgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCJcXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJuYW1lXCIpIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuXCI7XG59LFwiOFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gY29udGFpbmVyLmludm9rZVBhcnRpYWwobG9va3VwUHJvcGVydHkocGFydGlhbHMsXCJyb3dzXCIpLGRlcHRoMCx7XCJuYW1lXCI6XCJyb3dzXCIsXCJkYXRhXCI6ZGF0YSxcImluZGVudFwiOlwiICAgICAgICAgICAgICAgICAgXCIsXCJoZWxwZXJzXCI6aGVscGVycyxcInBhcnRpYWxzXCI6cGFydGlhbHMsXCJkZWNvcmF0b3JzXCI6Y29udGFpbmVyLmRlY29yYXRvcnN9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcIjEwXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgPHNwYW4gY2xhc3M9XFxcIm5vZGF0YWZvdW5kXFxcIj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJub0RhdGFGb3VuZFwiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIjwvc3Bhbj5cXG5cIjtcbn0sXCJjb21waWxlclwiOls4LFwiPj0gNC4zLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBhbGlhczE9ZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiAoY29udGFpbmVyLm51bGxDb250ZXh0IHx8IHt9KSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwidC1SZXBvcnQtdGFibGVXcmFwIG1vZGFsLWxvdi10YWJsZVxcXCI+XFxuICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGNsYXNzPVxcXCJcXFwiIHdpZHRoPVxcXCIxMDAlXFxcIj5cXG4gICAgPHRib2R5PlxcbiAgICAgIDx0cj5cXG4gICAgICAgIDx0ZD48L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGFsaWFzMSwoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJyb3dDb3VudFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjksXCJjb2x1bW5cIjoxMH0sXCJlbmRcIjp7XCJsaW5lXCI6MzEsXCJjb2x1bW5cIjoxN319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgICAgIDwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgPC90Ym9keT5cXG4gIDwvdGFibGU+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcInVubGVzc1wiKS5jYWxsKGFsaWFzMSwoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJyb3dDb3VudFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDEwLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MzYsXCJjb2x1bW5cIjoyfSxcImVuZFwiOntcImxpbmVcIjozOCxcImNvbHVtblwiOjEzfX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvZGl2PlxcblwiO1xufSxcInVzZVBhcnRpYWxcIjp0cnVlLFwidXNlRGF0YVwiOnRydWV9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBhbGlhczE9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMyPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgIDx0ciBkYXRhLXJldHVybj1cXFwiXCJcbiAgICArIGFsaWFzMihhbGlhczEoKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmV0dXJuVmFsXCIpIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiXFxcIiBkYXRhLWRpc3BsYXk9XFxcIlwiXG4gICAgKyBhbGlhczIoYWxpYXMxKChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcImRpc3BsYXlWYWxcIikgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJwb2ludGVyXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwiY29sdW1uc1wiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MyxcImNvbHVtblwiOjR9LFwiZW5kXCI6e1wibGluZVwiOjUsXCJjb2x1bW5cIjoxM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgIDwvdHI+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlciwgYWxpYXMxPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgICA8dGQgaGVhZGVycz1cXFwiXCJcbiAgICArIGFsaWFzMSgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwia2V5XCIpIHx8IChkYXRhICYmIGxvb2t1cFByb3BlcnR5KGRhdGEsXCJrZXlcIikpKSAhPSBudWxsID8gaGVscGVyIDogY29udGFpbmVyLmhvb2tzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLHtcIm5hbWVcIjpcImtleVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjo0LFwiY29sdW1uXCI6MTl9LFwiZW5kXCI6e1wibGluZVwiOjQsXCJjb2x1bW5cIjoyN319fSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwidC1SZXBvcnQtY2VsbFxcXCI+XCJcbiAgICArIGFsaWFzMShjb250YWluZXIubGFtYmRhKGRlcHRoMCwgZGVwdGgwKSlcbiAgICArIFwiPC90ZD5cXG5cIjtcbn0sXCJjb21waWxlclwiOls4LFwiPj0gNC4zLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicm93c1wiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MSxcImNvbHVtblwiOjB9LFwiZW5kXCI6e1wibGluZVwiOjcsXCJjb2x1bW5cIjo5fX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iXX0=
