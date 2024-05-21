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

var VERSION = '4.7.8';
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
      } else if (typeof Symbol === 'function' && context[Symbol.iterator]) {
        var newContext = [];
        var iterator = context[Symbol.iterator]();
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createNewLookupObject = require('./create-new-lookup-object');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

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
    _logger2['default'].log('error', 'Handlebars: Access has been denied to resolve the property "' + propertyName + '" because it is not an "own property" of its parent.\n' + 'You can add a runtime option to disable the check or this warning:\n' + 'See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details');
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
/* global globalThis */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  // https://mathiasbynens.be/notes/globalthis
  (function () {
    if (typeof globalThis === 'object') return;
    Object.prototype.__defineGetter__('__magic__', function () {
      return this;
    });
    __magic__.globalThis = __magic__; // eslint-disable-line no-undef
    delete Object.prototype.__magic__;
  })();

  var $Handlebars = globalThis.Handlebars;

  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (globalThis.Handlebars === Handlebars) {
      globalThis.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


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
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":1}],23:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":22}],24:[function(require,module,exports){
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
      childColumnsStr: '',
      readOnly: false,
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
      if (!self.options.readOnly) {
        if (self._grid) {
          var recordId = self._grid.model.getRecordId(self._grid.view$.grid('getSelectedRecords')[0])
          var column = self._ig$.interactiveGrid('option').config.columns.filter(function (column) {
            return column.staticId === self.options.itemName
          })[0]
          self._grid.view$.grid('gotoCell', recordId, column.name);
          self._grid.focus()
        }
        self._item$.focus()
      }

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
      106, 107, 109, 110, 111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 220, // interpunction
    ],

    // Keys to indicate completing input (esc, tab, enter)
    _validNextKeys: [9, 27, 13],

    _create: function () {
      var self = this

      self._item$ = $('#' + self.options.itemName)
      self._returnValue = self._item$.data('returnValue').toString()
      self._searchButton$ = $('#' + self.options.searchButton)
      self._clearInput$ = self._item$.parent().find('.fcs-search-clear');

      self._addCSSToTopLevel()

      // Trigger event on click input display field
      self._triggerLOVOnDisplay('000 - create ' + self.options?.itemName)

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
      self._topApex.jQuery('#' + self.options.searchField)[0].focus()
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
        },
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
          attributes: 'style="bottom: 66px;"',
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
            label: self.options.itemLabel,
          }
        } else {
          column['column' + key] = {
            name: val,
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
          columns: {},
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
        fillSearchText: true,
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
        pageItems: items,
      }, {
        target: self._item$,
        dataType: 'json',
        loadingIndicator: $.proxy(options.loadingIndicator, self),
        success: function (pData) {
          self.options.dataSource = pData
          self._templateData = self._getTemplateData()
          handler({
            widget: self,
            fillSearchText: settings.fillSearchText,
          })
        },
      })
    },

    _initSearch: function () {
      var self = this
      // if the lastSearchTerm is not equal to the current searchTerm, then search immediate
      if (self._lastSearchTerm !== self._topApex.item(self.options.searchField).getValue()) {
        self._getData({
          firstRow: 1,
          loadingIndicator: self._modalLoadingIndicator,
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
            loadingIndicator: self._modalLoadingIndicator,
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
          loadingIndicator: self._modalLoadingIndicator,
        }, function () {
          self._onReload()
        })
      })

      // Next set
      self._topApex.jQuery(window.top.document).on('click', nextSelector, function (e) {
        self._getData({
          firstRow: self._getFirstRownumNextSet(),
          loadingIndicator: self._modalLoadingIndicator,
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
    _focusNextElement: function (ig) {
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
        var itemName = document.activeElement.id;
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

          // CW: interactive grid hack - tab next when there are cascading child columns
          if (ig?.length > 0) {
            var grid = ig.interactiveGrid('getViews').grid;
            var recordId = grid.model.getRecordId(grid.view$.grid('getSelectedRecords')[0])
            var nextColIndex = ig.interactiveGrid('option').config.columns.findIndex(col => col.staticId === itemName) + 1;
            var nextCol = ig.interactiveGrid('option').config.columns[nextColIndex];
            setTimeout(() => {
              grid.view$.grid('gotoCell', recordId, nextCol.name);
              grid.focus();
              apex.item(nextCol.staticId).setFocus();
            }, 50);
          }
        }
      }
    },

    // Function based on https://stackoverflow.com/a/35173443
    _focusPrevElement: function (ig) {
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
        var itemName = document.activeElement.id;
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

          // CW: interactive grid hack - tab next when there are cascading child columns
          if (ig?.length > 0) {
            var grid = ig.interactiveGrid('getViews').grid;
            var recordId = grid.model.getRecordId(grid.view$.grid('getSelectedRecords')[0])
            var prevColIndex = ig.interactiveGrid('option').config.columns.findIndex(col => col.staticId === itemName) - 1;
            var prevCol = ig.interactiveGrid('option').config.columns[prevColIndex];
            setTimeout(() => {
              grid.view$.grid('gotoCell', recordId, prevCol.name);
              grid.focus();
              apex.item(prevCol.staticId).setFocus();
            }, 50);
          }
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

      self.options.readOnly = $('#' + self.options.itemName).prop('readOnly')
        || $('#' + self.options.itemName).prop('disabled');

      // Trigger event on click outside element
      $(document).mousedown(function (event) {
        self._item$.off('keydown')
        $(document).off('mousedown')

        var $target = $(event.target);

        if (!$target.closest('#' + self.options.itemName).length && !self._item$.is(':focus')) {
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
              },
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
              self._initGridConfig();
              const prevValidity = self._removeChildValidation();

              // 1 valid option matches the search. Use valid option.
              self._setItemValues(self._templateData.report.rows[0].returnVal);
              self._resetFocus();
              if (e.keyCode === 13) {
                if (self.options.nextOnEnter) {
                  self._focusNextElement(self._ig$);
                }
              } else if (self.options.isPrevIndex) {
                self.options.isPrevIndex = false;
                self._focusPrevElement(self._ig$);
              } else {
                self._focusNextElement(self._ig$);
              }
              self._restoreChildValidation(prevValidity);
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
                },
              })
            }
          })
        } else {
          self._triggerLOVOnDisplay('008 - key down')
        }
      })
    },

    _removeChildValidation: function () {
      const self = this;

      const prevValidations = [];

      if (self.options.childColumnsStr) {
        self.options.childColumnsStr.split(',').forEach(colName => {
          var columnId = self._grid.getColumns()?.find(col => colName?.includes(col.property))?.elementId;
          var column = self._ig$.interactiveGrid('option').config.columns.find(col => col.staticId === columnId);
          var item = apex.item(columnId);
          apex.debug.trace('found child column', column);
          // Don't turn off validation if the item has a value.
          if (!item || !column || (item && item.getValue())) {
            return;
          }
          // Save previous state.
          prevValidations.push({
            id: columnId,
            isRequired: column?.validation.isRequired,
            validity: apex.item(columnId).getValidity,
          });
          // Turn off validation
          column.validation.isRequired = false;
          item.getValidity = function () { return { valid: true };};
        });
      }

      return prevValidations;
    },

    _restoreChildValidation: function (prevValidations) {
      const self = this;

      prevValidations?.forEach(({ id, isRequired, validity }) => {
        self._ig$.interactiveGrid('option').config.columns.find(col => col.staticId === id).validation.isRequired = isRequired;
        apex.item(id).getValidity = validity;
      });
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
          },
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

    _clearInput: function (doFocus = true) {
      var self = this
      self._setItemValues('')
      self._returnValue = ''
      self._removeValidation()
      if (doFocus && !self.options?.readOnly) {
        self._item$.focus();
      }
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
        self._clearInput(false)
      })
    },

    _setValueBasedOnDisplay: function (pValue) {
      var self = this

      var promise = apex.server.plugin(self.options.ajaxIdentifier, {
        x01: 'GET_VALUE',
        x02: pValue, // returnVal
      }, {
        dataType: 'json',
        loadingIndicator: $.proxy(self._itemLoadingIndicator, self),
        success: function (pData) {
          self._disableChangeEvent = false
          self._returnValue = pData.returnValue
          self._item$.val(pData.displayValue)
          self._item$.trigger('change')
        },
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
        },
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
    },
  })
})(apex.jQuery, window)

},{"./templates/modal-report.hbs":25,"./templates/partials/_pagination.hbs":26,"./templates/partials/_report.hbs":27,"./templates/partials/_rows.hbs":28,"hbsfy/runtime":23}],25:[function(require,module,exports){
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

},{"hbsfy/runtime":23}],26:[function(require,module,exports){
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

},{"hbsfy/runtime":23}],27:[function(require,module,exports){
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

},{"hbsfy/runtime":23}],28:[function(require,module,exports){
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

},{"hbsfy/runtime":23}]},{},[24])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvYmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9kZWNvcmF0b3JzL2lubGluZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2Jsb2NrLWhlbHBlci1taXNzaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9oZWxwZXItbWlzc2luZy5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaWYuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2xvZy5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9va3VwLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy93aXRoLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaW50ZXJuYWwvY3JlYXRlLW5ldy1sb29rdXAtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaW50ZXJuYWwvcHJvdG8tYWNjZXNzLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaW50ZXJuYWwvd3JhcEhlbHBlci5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiLCJzcmMvanMvZmNzLW1vZGFsLWxvdi5qcyIsInNyYy9qcy90ZW1wbGF0ZXMvbW9kYWwtcmVwb3J0LmhicyIsInNyYy9qcy90ZW1wbGF0ZXMvcGFydGlhbHMvX3BhZ2luYXRpb24uaGJzIiwic3JjL2pzL3RlbXBsYXRlcy9wYXJ0aWFscy9fcmVwb3J0LmhicyIsInNyYy9qcy90ZW1wbGF0ZXMvcGFydGlhbHMvX3Jvd3MuaGJzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OEJDQXNCLG1CQUFtQjs7SUFBN0IsSUFBSTs7Ozs7b0NBSU8sMEJBQTBCOzs7O21DQUMzQix3QkFBd0I7Ozs7K0JBQ3ZCLG9CQUFvQjs7SUFBL0IsS0FBSzs7aUNBQ1Esc0JBQXNCOztJQUFuQyxPQUFPOztvQ0FFSSwwQkFBMEI7Ozs7O0FBR2pELFNBQVMsTUFBTSxHQUFHO0FBQ2hCLE1BQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTFDLE9BQUssQ0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL2hhbmRsZWJhcnMvYmFzZSc7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG5pbXBvcnQgU2FmZVN0cmluZyBmcm9tICcuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2hhbmRsZWJhcnMvZXhjZXB0aW9uJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vaGFuZGxlYmFycy91dGlscyc7XG5pbXBvcnQgKiBhcyBydW50aW1lIGZyb20gJy4vaGFuZGxlYmFycy9ydW50aW1lJztcblxuaW1wb3J0IG5vQ29uZmxpY3QgZnJvbSAnLi9oYW5kbGViYXJzL25vLWNvbmZsaWN0JztcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIGxldCBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG4gIGhiLmVzY2FwZUV4cHJlc3Npb24gPSBVdGlscy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn1cblxubGV0IGluc3QgPSBjcmVhdGUoKTtcbmluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5ub0NvbmZsaWN0KGluc3QpO1xuXG5pbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5leHBvcnQgZGVmYXVsdCBpbnN0O1xuIiwiaW1wb3J0IHsgY3JlYXRlRnJhbWUsIGV4dGVuZCwgdG9TdHJpbmcgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi9leGNlcHRpb24nO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzIH0gZnJvbSAnLi9kZWNvcmF0b3JzJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgcmVzZXRMb2dnZWRQcm9wZXJ0aWVzIH0gZnJvbSAnLi9pbnRlcm5hbC9wcm90by1hY2Nlc3MnO1xuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9ICc0LjcuOCc7XG5leHBvcnQgY29uc3QgQ09NUElMRVJfUkVWSVNJT04gPSA4O1xuZXhwb3J0IGNvbnN0IExBU1RfQ09NUEFUSUJMRV9DT01QSUxFUl9SRVZJU0lPTiA9IDc7XG5cbmV4cG9ydCBjb25zdCBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz09IDEueC54JyxcbiAgNTogJz09IDIuMC4wLWFscGhhLngnLFxuICA2OiAnPj0gMi4wLjAtYmV0YS4xJyxcbiAgNzogJz49IDQuMC4wIDw0LjMuMCcsXG4gIDg6ICc+PSA0LjMuMCdcbn07XG5cbmNvbnN0IG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZXhwb3J0IGZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscywgZGVjb3JhdG9ycykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG4gIHRoaXMuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbiAgcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyh0aGlzKTtcbn1cblxuSGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2dnZXIubG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7XG4gICAgICB9XG4gICAgICBleHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuaGVscGVyc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHBhcnRpYWwpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgZXh0ZW5kKHRoaXMucGFydGlhbHMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHBhcnRpYWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXG4gICAgICAgICAgYEF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIgYSBwYXJ0aWFsIGNhbGxlZCBcIiR7bmFtZX1cIiBhcyB1bmRlZmluZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gcGFydGlhbDtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMucGFydGlhbHNbbmFtZV07XG4gIH0sXG5cbiAgcmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChmbikge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGRlY29yYXRvcnMnKTtcbiAgICAgIH1cbiAgICAgIGV4dGVuZCh0aGlzLmRlY29yYXRvcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlY29yYXRvcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0b3JzW25hbWVdO1xuICB9LFxuICAvKipcbiAgICogUmVzZXQgdGhlIG1lbW9yeSBvZiBpbGxlZ2FsIHByb3BlcnR5IGFjY2Vzc2VzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gbG9nZ2VkLlxuICAgKiBAZGVwcmVjYXRlZCBzaG91bGQgb25seSBiZSB1c2VkIGluIGhhbmRsZWJhcnMgdGVzdC1jYXNlc1xuICAgKi9cbiAgcmVzZXRMb2dnZWRQcm9wZXJ0eUFjY2Vzc2VzKCkge1xuICAgIHJlc2V0TG9nZ2VkUHJvcGVydGllcygpO1xuICB9XG59O1xuXG5leHBvcnQgbGV0IGxvZyA9IGxvZ2dlci5sb2c7XG5cbmV4cG9ydCB7IGNyZWF0ZUZyYW1lLCBsb2dnZXIgfTtcbiIsImltcG9ydCByZWdpc3RlcklubGluZSBmcm9tICcuL2RlY29yYXRvcnMvaW5saW5lJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnMoaW5zdGFuY2UpIHtcbiAgcmVnaXN0ZXJJbmxpbmUoaW5zdGFuY2UpO1xufVxuIiwiaW1wb3J0IHsgZXh0ZW5kIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckRlY29yYXRvcignaW5saW5lJywgZnVuY3Rpb24oZm4sIHByb3BzLCBjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgcmV0ID0gZm47XG4gICAgaWYgKCFwcm9wcy5wYXJ0aWFscykge1xuICAgICAgcHJvcHMucGFydGlhbHMgPSB7fTtcbiAgICAgIHJldCA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHBhcnRpYWxzIHN0YWNrIGZyYW1lIHByaW9yIHRvIGV4ZWMuXG4gICAgICAgIGxldCBvcmlnaW5hbCA9IGNvbnRhaW5lci5wYXJ0aWFscztcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gZXh0ZW5kKHt9LCBvcmlnaW5hbCwgcHJvcHMucGFydGlhbHMpO1xuICAgICAgICBsZXQgcmV0ID0gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9yaWdpbmFsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm9wcy5wYXJ0aWFsc1tvcHRpb25zLmFyZ3NbMF1dID0gb3B0aW9ucy5mbjtcblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xufVxuIiwiY29uc3QgZXJyb3JQcm9wcyA9IFtcbiAgJ2Rlc2NyaXB0aW9uJyxcbiAgJ2ZpbGVOYW1lJyxcbiAgJ2xpbmVOdW1iZXInLFxuICAnZW5kTGluZU51bWJlcicsXG4gICdtZXNzYWdlJyxcbiAgJ25hbWUnLFxuICAnbnVtYmVyJyxcbiAgJ3N0YWNrJ1xuXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgbGV0IGxvYyA9IG5vZGUgJiYgbm9kZS5sb2MsXG4gICAgbGluZSxcbiAgICBlbmRMaW5lTnVtYmVyLFxuICAgIGNvbHVtbixcbiAgICBlbmRDb2x1bW47XG5cbiAgaWYgKGxvYykge1xuICAgIGxpbmUgPSBsb2Muc3RhcnQubGluZTtcbiAgICBlbmRMaW5lTnVtYmVyID0gbG9jLmVuZC5saW5lO1xuICAgIGNvbHVtbiA9IGxvYy5zdGFydC5jb2x1bW47XG4gICAgZW5kQ29sdW1uID0gbG9jLmVuZC5jb2x1bW47XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIGNvbHVtbjtcbiAgfVxuXG4gIGxldCB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFeGNlcHRpb24pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAobG9jKSB7XG4gICAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuICAgICAgdGhpcy5lbmRMaW5lTnVtYmVyID0gZW5kTGluZU51bWJlcjtcblxuICAgICAgLy8gV29yayBhcm91bmQgaXNzdWUgdW5kZXIgc2FmYXJpIHdoZXJlIHdlIGNhbid0IGRpcmVjdGx5IHNldCB0aGUgY29sdW1uIHZhbHVlXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvbHVtbicsIHtcbiAgICAgICAgICB2YWx1ZTogY29sdW1uLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZW5kQ29sdW1uJywge1xuICAgICAgICAgIHZhbHVlOiBlbmRDb2x1bW4sXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgICAgICB0aGlzLmVuZENvbHVtbiA9IGVuZENvbHVtbjtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKG5vcCkge1xuICAgIC8qIElnbm9yZSBpZiB0aGUgYnJvd3NlciBpcyB2ZXJ5IHBhcnRpY3VsYXIgKi9cbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4Y2VwdGlvbjtcbiIsImltcG9ydCByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVyRWFjaCBmcm9tICcuL2hlbHBlcnMvZWFjaCc7XG5pbXBvcnQgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJJZiBmcm9tICcuL2hlbHBlcnMvaWYnO1xuaW1wb3J0IHJlZ2lzdGVyTG9nIGZyb20gJy4vaGVscGVycy9sb2cnO1xuaW1wb3J0IHJlZ2lzdGVyTG9va3VwIGZyb20gJy4vaGVscGVycy9sb29rdXAnO1xuaW1wb3J0IHJlZ2lzdGVyV2l0aCBmcm9tICcuL2hlbHBlcnMvd2l0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJFYWNoKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJJZihpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb29rdXAoaW5zdGFuY2UpO1xuICByZWdpc3RlcldpdGgoaW5zdGFuY2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZUhlbHBlclRvSG9va3MoaW5zdGFuY2UsIGhlbHBlck5hbWUsIGtlZXBIZWxwZXIpIHtcbiAgaWYgKGluc3RhbmNlLmhlbHBlcnNbaGVscGVyTmFtZV0pIHtcbiAgICBpbnN0YW5jZS5ob29rc1toZWxwZXJOYW1lXSA9IGluc3RhbmNlLmhlbHBlcnNbaGVscGVyTmFtZV07XG4gICAgaWYgKCFrZWVwSGVscGVyKSB7XG4gICAgICBkZWxldGUgaW5zdGFuY2UuaGVscGVyc1toZWxwZXJOYW1lXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGFwcGVuZENvbnRleHRQYXRoLCBjcmVhdGVGcmFtZSwgaXNBcnJheSB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGxldCBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCxcbiAgICAgICAgICBvcHRpb25zLm5hbWVcbiAgICAgICAgKTtcbiAgICAgICAgb3B0aW9ucyA9IHsgZGF0YTogZGF0YSB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7XG4gIGFwcGVuZENvbnRleHRQYXRoLFxuICBibG9ja1BhcmFtcyxcbiAgY3JlYXRlRnJhbWUsXG4gIGlzQXJyYXksXG4gIGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuICAgICAgaSA9IDAsXG4gICAgICByZXQgPSAnJyxcbiAgICAgIGRhdGEsXG4gICAgICBjb250ZXh0UGF0aDtcblxuICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgIGNvbnRleHRQYXRoID1cbiAgICAgICAgYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSkgKyAnLic7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHtcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlY0l0ZXJhdGlvbihmaWVsZCwgaW5kZXgsIGxhc3QpIHtcbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIGRhdGEua2V5ID0gZmllbGQ7XG4gICAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcbiAgICAgICAgZGF0YS5maXJzdCA9IGluZGV4ID09PSAwO1xuICAgICAgICBkYXRhLmxhc3QgPSAhIWxhc3Q7XG5cbiAgICAgICAgaWYgKGNvbnRleHRQYXRoKSB7XG4gICAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGNvbnRleHRQYXRoICsgZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0ID1cbiAgICAgICAgcmV0ICtcbiAgICAgICAgZm4oY29udGV4dFtmaWVsZF0sIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhcbiAgICAgICAgICAgIFtjb250ZXh0W2ZpZWxkXSwgZmllbGRdLFxuICAgICAgICAgICAgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgIGlmIChpIGluIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4ZWNJdGVyYXRpb24oaSwgaSwgaSA9PT0gY29udGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBjb250ZXh0W1N5bWJvbC5pdGVyYXRvcl0pIHtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dCA9IFtdO1xuICAgICAgICBjb25zdCBpdGVyYXRvciA9IGNvbnRleHRbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICBmb3IgKGxldCBpdCA9IGl0ZXJhdG9yLm5leHQoKTsgIWl0LmRvbmU7IGl0ID0gaXRlcmF0b3IubmV4dCgpKSB7XG4gICAgICAgICAgbmV3Q29udGV4dC5wdXNoKGl0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0ID0gbmV3Q29udGV4dDtcbiAgICAgICAgZm9yIChsZXQgaiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgZXhlY0l0ZXJhdGlvbihpLCBpLCBpID09PSBjb250ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgdGhlIGl0ZXJhdGlvbnMgb25lIHN0ZXAgb3V0IG9mIHN5bmMgc28gd2UgY2FuIGRldGVjdFxuICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAvLyBhbiBpdGVybWVkaWF0ZSBrZXlzIGFycmF5LlxuICAgICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHByaW9yS2V5ID0ga2V5O1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaSAtIDEsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG4iLCJpbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oLyogW2FyZ3MsIF1vcHRpb25zICovKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIEEgbWlzc2luZyBmaWVsZCBpbiBhIHt7Zm9vfX0gY29uc3RydWN0LlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29tZW9uZSBpcyBhY3R1YWxseSB0cnlpbmcgdG8gY2FsbCBzb21ldGhpbmcsIGJsb3cgdXAuXG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFxuICAgICAgICAnTWlzc2luZyBoZWxwZXI6IFwiJyArIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0ubmFtZSArICdcIidcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IGlzRW1wdHksIGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignI2lmIHJlcXVpcmVzIGV4YWN0bHkgb25lIGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkge1xuICAgICAgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignI3VubGVzcyByZXF1aXJlcyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7XG4gICAgICBmbjogb3B0aW9ucy5pbnZlcnNlLFxuICAgICAgaW52ZXJzZTogb3B0aW9ucy5mbixcbiAgICAgIGhhc2g6IG9wdGlvbnMuaGFzaFxuICAgIH0pO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbigvKiBtZXNzYWdlLCBvcHRpb25zICovKSB7XG4gICAgbGV0IGFyZ3MgPSBbdW5kZWZpbmVkXSxcbiAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuXG4gICAgbGV0IGxldmVsID0gMTtcbiAgICBpZiAob3B0aW9ucy5oYXNoLmxldmVsICE9IG51bGwpIHtcbiAgICAgIGxldmVsID0gb3B0aW9ucy5oYXNoLmxldmVsO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuZGF0YS5sZXZlbDtcbiAgICB9XG4gICAgYXJnc1swXSA9IGxldmVsO1xuXG4gICAgaW5zdGFuY2UubG9nKC4uLmFyZ3MpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb29rdXAnLCBmdW5jdGlvbihvYmosIGZpZWxkLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIC8vIE5vdGUgZm9yIDUuMDogQ2hhbmdlIHRvIFwib2JqID09IG51bGxcIiBpbiA1LjBcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zLmxvb2t1cFByb3BlcnR5KG9iaiwgZmllbGQpO1xuICB9KTtcbn1cbiIsImltcG9ydCB7XG4gIGFwcGVuZENvbnRleHRQYXRoLFxuICBibG9ja1BhcmFtcyxcbiAgY3JlYXRlRnJhbWUsXG4gIGlzRW1wdHksXG4gIGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCcjd2l0aCByZXF1aXJlcyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkge1xuICAgICAgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBsZXQgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKCFpc0VtcHR5KGNvbnRleHQpKSB7XG4gICAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBhcHBlbmRDb250ZXh0UGF0aChcbiAgICAgICAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsXG4gICAgICAgICAgb3B0aW9ucy5pZHNbMF1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgYmxvY2tQYXJhbXM6IGJsb2NrUGFyYW1zKFtjb250ZXh0XSwgW2RhdGEgJiYgZGF0YS5jb250ZXh0UGF0aF0pXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgZXh0ZW5kIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCBcIm51bGxcIi1wcm90b3R5cGUgdG8gYXZvaWQgdHJ1dGh5IHJlc3VsdHMgb24gcHJvdG90eXBlIHByb3BlcnRpZXMuXG4gKiBUaGUgcmVzdWx0aW5nIG9iamVjdCBjYW4gYmUgdXNlZCB3aXRoIFwib2JqZWN0W3Byb3BlcnR5XVwiIHRvIGNoZWNrIGlmIGEgcHJvcGVydHkgZXhpc3RzXG4gKiBAcGFyYW0gey4uLm9iamVjdH0gc291cmNlcyBhIHZhcmFyZ3MgcGFyYW1ldGVyIG9mIHNvdXJjZSBvYmplY3RzIHRoYXQgd2lsbCBiZSBtZXJnZWRcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdMb29rdXBPYmplY3QoLi4uc291cmNlcykge1xuICByZXR1cm4gZXh0ZW5kKE9iamVjdC5jcmVhdGUobnVsbCksIC4uLnNvdXJjZXMpO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlTmV3TG9va3VwT2JqZWN0IH0gZnJvbSAnLi9jcmVhdGUtbmV3LWxvb2t1cC1vYmplY3QnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi9sb2dnZXInO1xuXG5jb25zdCBsb2dnZWRQcm9wZXJ0aWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3RvQWNjZXNzQ29udHJvbChydW50aW1lT3B0aW9ucykge1xuICBsZXQgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGRlZmF1bHRNZXRob2RXaGl0ZUxpc3RbJ2NvbnN0cnVjdG9yJ10gPSBmYWxzZTtcbiAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdFsnX19kZWZpbmVHZXR0ZXJfXyddID0gZmFsc2U7XG4gIGRlZmF1bHRNZXRob2RXaGl0ZUxpc3RbJ19fZGVmaW5lU2V0dGVyX18nXSA9IGZhbHNlO1xuICBkZWZhdWx0TWV0aG9kV2hpdGVMaXN0WydfX2xvb2t1cEdldHRlcl9fJ10gPSBmYWxzZTtcblxuICBsZXQgZGVmYXVsdFByb3BlcnR5V2hpdGVMaXN0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvXG4gIGRlZmF1bHRQcm9wZXJ0eVdoaXRlTGlzdFsnX19wcm90b19fJ10gPSBmYWxzZTtcblxuICByZXR1cm4ge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHdoaXRlbGlzdDogY3JlYXRlTmV3TG9va3VwT2JqZWN0KFxuICAgICAgICBkZWZhdWx0UHJvcGVydHlXaGl0ZUxpc3QsXG4gICAgICAgIHJ1bnRpbWVPcHRpb25zLmFsbG93ZWRQcm90b1Byb3BlcnRpZXNcbiAgICAgICksXG4gICAgICBkZWZhdWx0VmFsdWU6IHJ1bnRpbWVPcHRpb25zLmFsbG93UHJvdG9Qcm9wZXJ0aWVzQnlEZWZhdWx0XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICB3aGl0ZWxpc3Q6IGNyZWF0ZU5ld0xvb2t1cE9iamVjdChcbiAgICAgICAgZGVmYXVsdE1ldGhvZFdoaXRlTGlzdCxcbiAgICAgICAgcnVudGltZU9wdGlvbnMuYWxsb3dlZFByb3RvTWV0aG9kc1xuICAgICAgKSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogcnVudGltZU9wdGlvbnMuYWxsb3dQcm90b01ldGhvZHNCeURlZmF1bHRcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXN1bHRJc0FsbG93ZWQocmVzdWx0LCBwcm90b0FjY2Vzc0NvbnRyb2wsIHByb3BlcnR5TmFtZSkge1xuICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjaGVja1doaXRlTGlzdChwcm90b0FjY2Vzc0NvbnRyb2wubWV0aG9kcywgcHJvcGVydHlOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY2hlY2tXaGl0ZUxpc3QocHJvdG9BY2Nlc3NDb250cm9sLnByb3BlcnRpZXMsIHByb3BlcnR5TmFtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tXaGl0ZUxpc3QocHJvdG9BY2Nlc3NDb250cm9sRm9yVHlwZSwgcHJvcGVydHlOYW1lKSB7XG4gIGlmIChwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLndoaXRlbGlzdFtwcm9wZXJ0eU5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcHJvdG9BY2Nlc3NDb250cm9sRm9yVHlwZS53aGl0ZWxpc3RbcHJvcGVydHlOYW1lXSA9PT0gdHJ1ZTtcbiAgfVxuICBpZiAocHJvdG9BY2Nlc3NDb250cm9sRm9yVHlwZS5kZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBwcm90b0FjY2Vzc0NvbnRyb2xGb3JUeXBlLmRlZmF1bHRWYWx1ZTtcbiAgfVxuICBsb2dVbmV4cGVjZWRQcm9wZXJ0eUFjY2Vzc09uY2UocHJvcGVydHlOYW1lKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBsb2dVbmV4cGVjZWRQcm9wZXJ0eUFjY2Vzc09uY2UocHJvcGVydHlOYW1lKSB7XG4gIGlmIChsb2dnZWRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gIT09IHRydWUpIHtcbiAgICBsb2dnZWRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuICAgIGxvZ2dlci5sb2coXG4gICAgICAnZXJyb3InLFxuICAgICAgYEhhbmRsZWJhcnM6IEFjY2VzcyBoYXMgYmVlbiBkZW5pZWQgdG8gcmVzb2x2ZSB0aGUgcHJvcGVydHkgXCIke3Byb3BlcnR5TmFtZX1cIiBiZWNhdXNlIGl0IGlzIG5vdCBhbiBcIm93biBwcm9wZXJ0eVwiIG9mIGl0cyBwYXJlbnQuXFxuYCArXG4gICAgICAgIGBZb3UgY2FuIGFkZCBhIHJ1bnRpbWUgb3B0aW9uIHRvIGRpc2FibGUgdGhlIGNoZWNrIG9yIHRoaXMgd2FybmluZzpcXG5gICtcbiAgICAgICAgYFNlZSBodHRwczovL2hhbmRsZWJhcnNqcy5jb20vYXBpLXJlZmVyZW5jZS9ydW50aW1lLW9wdGlvbnMuaHRtbCNvcHRpb25zLXRvLWNvbnRyb2wtcHJvdG90eXBlLWFjY2VzcyBmb3IgZGV0YWlsc2BcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldExvZ2dlZFByb3BlcnRpZXMoKSB7XG4gIE9iamVjdC5rZXlzKGxvZ2dlZFByb3BlcnRpZXMpLmZvckVhY2gocHJvcGVydHlOYW1lID0+IHtcbiAgICBkZWxldGUgbG9nZ2VkUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlciwgdHJhbnNmb3JtT3B0aW9uc0ZuKSB7XG4gIGlmICh0eXBlb2YgaGVscGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVGhpcyBzaG91bGQgbm90IGhhcHBlbiwgYnV0IGFwcGFyZW50bHkgaXQgZG9lcyBpbiBodHRwczovL2dpdGh1Yi5jb20vd3ljYXRzL2hhbmRsZWJhcnMuanMvaXNzdWVzLzE2MzlcbiAgICAvLyBXZSB0cnkgdG8gbWFrZSB0aGUgd3JhcHBlciBsZWFzdC1pbnZhc2l2ZSBieSBub3Qgd3JhcHBpbmcgaXQsIGlmIHRoZSBoZWxwZXIgaXMgbm90IGEgZnVuY3Rpb24uXG4gICAgcmV0dXJuIGhlbHBlcjtcbiAgfVxuICBsZXQgd3JhcHBlciA9IGZ1bmN0aW9uKC8qIGR5bmFtaWMgYXJndW1lbnRzICovKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gICAgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9IHRyYW5zZm9ybU9wdGlvbnNGbihvcHRpb25zKTtcbiAgICByZXR1cm4gaGVscGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIHJldHVybiB3cmFwcGVyO1xufVxuIiwiaW1wb3J0IHsgaW5kZXhPZiB9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG4gIGxldmVsOiAnaW5mbycsXG5cbiAgLy8gTWFwcyBhIGdpdmVuIGxldmVsIHZhbHVlIHRvIHRoZSBgbWV0aG9kTWFwYCBpbmRleGVzIGFib3ZlLlxuICBsb29rdXBMZXZlbDogZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mIGxldmVsID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IGxldmVsTWFwID0gaW5kZXhPZihsb2dnZXIubWV0aG9kTWFwLCBsZXZlbC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGlmIChsZXZlbE1hcCA+PSAwKSB7XG4gICAgICAgIGxldmVsID0gbGV2ZWxNYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXZlbCA9IHBhcnNlSW50KGxldmVsLCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9LFxuXG4gIC8vIENhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIC4uLm1lc3NhZ2UpIHtcbiAgICBsZXZlbCA9IGxvZ2dlci5sb29rdXBMZXZlbChsZXZlbCk7XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGxvZ2dlci5sb29rdXBMZXZlbChsb2dnZXIubGV2ZWwpIDw9IGxldmVsXG4gICAgKSB7XG4gICAgICBsZXQgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgaWYgKCFjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgbWV0aG9kID0gJ2xvZyc7XG4gICAgICB9XG4gICAgICBjb25zb2xlW21ldGhvZF0oLi4ubWVzc2FnZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyO1xuIiwiLyogZ2xvYmFsIGdsb2JhbFRoaXMgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKEhhbmRsZWJhcnMpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2dsb2JhbHRoaXNcbiAgKGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybjtcbiAgICBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX18oJ19fbWFnaWNfXycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSk7XG4gICAgX19tYWdpY19fLmdsb2JhbFRoaXMgPSBfX21hZ2ljX187IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiAgICBkZWxldGUgT2JqZWN0LnByb3RvdHlwZS5fX21hZ2ljX187XG4gIH0pKCk7XG5cbiAgY29uc3QgJEhhbmRsZWJhcnMgPSBnbG9iYWxUaGlzLkhhbmRsZWJhcnM7XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgSGFuZGxlYmFycy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGdsb2JhbFRoaXMuSGFuZGxlYmFycyA9PT0gSGFuZGxlYmFycykge1xuICAgICAgZ2xvYmFsVGhpcy5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG4gICAgfVxuICAgIHJldHVybiBIYW5kbGViYXJzO1xuICB9O1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7XG4gIENPTVBJTEVSX1JFVklTSU9OLFxuICBjcmVhdGVGcmFtZSxcbiAgTEFTVF9DT01QQVRJQkxFX0NPTVBJTEVSX1JFVklTSU9OLFxuICBSRVZJU0lPTl9DSEFOR0VTXG59IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyBtb3ZlSGVscGVyVG9Ib29rcyB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyB3cmFwSGVscGVyIH0gZnJvbSAnLi9pbnRlcm5hbC93cmFwSGVscGVyJztcbmltcG9ydCB7XG4gIGNyZWF0ZVByb3RvQWNjZXNzQ29udHJvbCxcbiAgcmVzdWx0SXNBbGxvd2VkXG59IGZyb20gJy4vaW50ZXJuYWwvcHJvdG8tYWNjZXNzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIGNvbnN0IGNvbXBpbGVyUmV2aXNpb24gPSAoY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSkgfHwgMSxcbiAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoXG4gICAgY29tcGlsZXJSZXZpc2lvbiA+PSBMQVNUX0NPTVBBVElCTEVfQ09NUElMRVJfUkVWSVNJT04gJiZcbiAgICBjb21waWxlclJldmlzaW9uIDw9IENPTVBJTEVSX1JFVklTSU9OXG4gICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb21waWxlclJldmlzaW9uIDwgTEFTVF9DT01QQVRJQkxFX0NPTVBJTEVSX1JFVklTSU9OKSB7XG4gICAgY29uc3QgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcbiAgICAgICdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiAnICtcbiAgICAgICAgJ1BsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKCcgK1xuICAgICAgICBydW50aW1lVmVyc2lvbnMgK1xuICAgICAgICAnKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKCcgK1xuICAgICAgICBjb21waWxlclZlcnNpb25zICtcbiAgICAgICAgJykuJ1xuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcbiAgICAgICdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uICgnICtcbiAgICAgICAgY29tcGlsZXJJbmZvWzFdICtcbiAgICAgICAgJykuJ1xuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlJyk7XG4gIH1cbiAgaWYgKCF0ZW1wbGF0ZVNwZWMgfHwgIXRlbXBsYXRlU3BlYy5tYWluKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVW5rbm93biB0ZW1wbGF0ZSBvYmplY3Q6ICcgKyB0eXBlb2YgdGVtcGxhdGVTcGVjKTtcbiAgfVxuXG4gIHRlbXBsYXRlU3BlYy5tYWluLmRlY29yYXRvciA9IHRlbXBsYXRlU3BlYy5tYWluX2Q7XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzZXVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgZW52LlZNLmNoZWNrUmV2aXNpb24odGVtcGxhdGVTcGVjLmNvbXBpbGVyKTtcblxuICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3IgcHJlY29tcGlsZWQgdGVtcGxhdGVzIHdpdGggY29tcGlsZXItdmVyc2lvbiA3ICg8NC4zLjApXG4gIGNvbnN0IHRlbXBsYXRlV2FzUHJlY29tcGlsZWRXaXRoQ29tcGlsZXJWNyA9XG4gICAgdGVtcGxhdGVTcGVjLmNvbXBpbGVyICYmIHRlbXBsYXRlU3BlYy5jb21waWxlclswXSA9PT0gNztcblxuICBmdW5jdGlvbiBpbnZva2VQYXJ0aWFsV3JhcHBlcihwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgICAgY29udGV4dCA9IFV0aWxzLmV4dGVuZCh7fSwgY29udGV4dCwgb3B0aW9ucy5oYXNoKTtcbiAgICAgIGlmIChvcHRpb25zLmlkcykge1xuICAgICAgICBvcHRpb25zLmlkc1swXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHBhcnRpYWwgPSBlbnYuVk0ucmVzb2x2ZVBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKTtcblxuICAgIGxldCBleHRlbmRlZE9wdGlvbnMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMsIHtcbiAgICAgIGhvb2tzOiB0aGlzLmhvb2tzLFxuICAgICAgcHJvdG9BY2Nlc3NDb250cm9sOiB0aGlzLnByb3RvQWNjZXNzQ29udHJvbFxuICAgIH0pO1xuXG4gICAgbGV0IHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgcGFydGlhbCxcbiAgICAgIGNvbnRleHQsXG4gICAgICBleHRlbmRlZE9wdGlvbnNcbiAgICApO1xuXG4gICAgaWYgKHJlc3VsdCA9PSBudWxsICYmIGVudi5jb21waWxlKSB7XG4gICAgICBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0gPSBlbnYuY29tcGlsZShcbiAgICAgICAgcGFydGlhbCxcbiAgICAgICAgdGVtcGxhdGVTcGVjLmNvbXBpbGVyT3B0aW9ucyxcbiAgICAgICAgZW52XG4gICAgICApO1xuICAgICAgcmVzdWx0ID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdKGNvbnRleHQsIGV4dGVuZGVkT3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG4gICAgICAgIGxldCBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcbiAgICAgICAgJ1RoZSBwYXJ0aWFsICcgK1xuICAgICAgICAgIG9wdGlvbnMubmFtZSArXG4gICAgICAgICAgJyBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBKdXN0IGFkZCB3YXRlclxuICBsZXQgY29udGFpbmVyID0ge1xuICAgIHN0cmljdDogZnVuY3Rpb24ob2JqLCBuYW1lLCBsb2MpIHtcbiAgICAgIGlmICghb2JqIHx8ICEobmFtZSBpbiBvYmopKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1wiJyArIG5hbWUgKyAnXCIgbm90IGRlZmluZWQgaW4gJyArIG9iaiwge1xuICAgICAgICAgIGxvYzogbG9jXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eShvYmosIG5hbWUpO1xuICAgIH0sXG4gICAgbG9va3VwUHJvcGVydHk6IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHRJc0FsbG93ZWQocmVzdWx0LCBjb250YWluZXIucHJvdG9BY2Nlc3NDb250cm9sLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgbG9va3VwOiBmdW5jdGlvbihkZXB0aHMsIG5hbWUpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGRlcHRocy5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBkZXB0aHNbaV0gJiYgY29udGFpbmVyLmxvb2t1cFByb3BlcnR5KGRlcHRoc1tpXSwgbmFtZSk7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBkZXB0aHNbaV1bbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGxhbWJkYTogZnVuY3Rpb24oY3VycmVudCwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBjdXJyZW50ID09PSAnZnVuY3Rpb24nID8gY3VycmVudC5jYWxsKGNvbnRleHQpIDogY3VycmVudDtcbiAgICB9LFxuXG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcblxuICAgIGZuOiBmdW5jdGlvbihpKSB7XG4gICAgICBsZXQgcmV0ID0gdGVtcGxhdGVTcGVjW2ldO1xuICAgICAgcmV0LmRlY29yYXRvciA9IHRlbXBsYXRlU3BlY1tpICsgJ19kJ107XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICAgICAgbGV0IHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSxcbiAgICAgICAgZm4gPSB0aGlzLmZuKGkpO1xuICAgICAgaWYgKGRhdGEgfHwgZGVwdGhzIHx8IGJsb2NrUGFyYW1zIHx8IGRlY2xhcmVkQmxvY2tQYXJhbXMpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB3cmFwUHJvZ3JhbShcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIGksXG4gICAgICAgICAgZm4sXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBkZWNsYXJlZEJsb2NrUGFyYW1zLFxuICAgICAgICAgIGJsb2NrUGFyYW1zLFxuICAgICAgICAgIGRlcHRoc1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG5cbiAgICBkYXRhOiBmdW5jdGlvbih2YWx1ZSwgZGVwdGgpIHtcbiAgICAgIHdoaWxlICh2YWx1ZSAmJiBkZXB0aC0tKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIG1lcmdlSWZOZWVkZWQ6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIGxldCBvYmogPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgcGFyYW0gIT09IGNvbW1vbikge1xuICAgICAgICBvYmogPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG4gICAgLy8gQW4gZW1wdHkgb2JqZWN0IHRvIHVzZSBhcyByZXBsYWNlbWVudCBmb3IgbnVsbC1jb250ZXh0c1xuICAgIG51bGxDb250ZXh0OiBPYmplY3Quc2VhbCh7fSksXG5cbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuICB9O1xuXG4gIGZ1bmN0aW9uIHJldChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcbiAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgbGV0IGRlcHRocyxcbiAgICAgIGJsb2NrUGFyYW1zID0gdGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zID8gW10gOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMpIHtcbiAgICAgIGlmIChvcHRpb25zLmRlcHRocykge1xuICAgICAgICBkZXB0aHMgPVxuICAgICAgICAgIGNvbnRleHQgIT0gb3B0aW9ucy5kZXB0aHNbMF1cbiAgICAgICAgICAgID8gW2NvbnRleHRdLmNvbmNhdChvcHRpb25zLmRlcHRocylcbiAgICAgICAgICAgIDogb3B0aW9ucy5kZXB0aHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXB0aHMgPSBbY29udGV4dF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFpbihjb250ZXh0IC8qLCBvcHRpb25zKi8pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICcnICtcbiAgICAgICAgdGVtcGxhdGVTcGVjLm1haW4oXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgY29udGFpbmVyLmhlbHBlcnMsXG4gICAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgYmxvY2tQYXJhbXMsXG4gICAgICAgICAgZGVwdGhzXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbWFpbiA9IGV4ZWN1dGVEZWNvcmF0b3JzKFxuICAgICAgdGVtcGxhdGVTcGVjLm1haW4sXG4gICAgICBtYWluLFxuICAgICAgY29udGFpbmVyLFxuICAgICAgb3B0aW9ucy5kZXB0aHMgfHwgW10sXG4gICAgICBkYXRhLFxuICAgICAgYmxvY2tQYXJhbXNcbiAgICApO1xuICAgIHJldHVybiBtYWluKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0LmlzVG9wID0gdHJ1ZTtcblxuICByZXQuX3NldHVwID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBsZXQgbWVyZ2VkSGVscGVycyA9IFV0aWxzLmV4dGVuZCh7fSwgZW52LmhlbHBlcnMsIG9wdGlvbnMuaGVscGVycyk7XG4gICAgICB3cmFwSGVscGVyc1RvUGFzc0xvb2t1cFByb3BlcnR5KG1lcmdlZEhlbHBlcnMsIGNvbnRhaW5lcik7XG4gICAgICBjb250YWluZXIuaGVscGVycyA9IG1lcmdlZEhlbHBlcnM7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCkge1xuICAgICAgICAvLyBVc2UgbWVyZ2VJZk5lZWRlZCBoZXJlIHRvIHByZXZlbnQgY29tcGlsaW5nIGdsb2JhbCBwYXJ0aWFscyBtdWx0aXBsZSB0aW1lc1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBjb250YWluZXIubWVyZ2VJZk5lZWRlZChcbiAgICAgICAgICBvcHRpb25zLnBhcnRpYWxzLFxuICAgICAgICAgIGVudi5wYXJ0aWFsc1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsIHx8IHRlbXBsYXRlU3BlYy51c2VEZWNvcmF0b3JzKSB7XG4gICAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gVXRpbHMuZXh0ZW5kKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIGVudi5kZWNvcmF0b3JzLFxuICAgICAgICAgIG9wdGlvbnMuZGVjb3JhdG9yc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuaG9va3MgPSB7fTtcbiAgICAgIGNvbnRhaW5lci5wcm90b0FjY2Vzc0NvbnRyb2wgPSBjcmVhdGVQcm90b0FjY2Vzc0NvbnRyb2wob3B0aW9ucyk7XG5cbiAgICAgIGxldCBrZWVwSGVscGVySW5IZWxwZXJzID1cbiAgICAgICAgb3B0aW9ucy5hbGxvd0NhbGxzVG9IZWxwZXJNaXNzaW5nIHx8XG4gICAgICAgIHRlbXBsYXRlV2FzUHJlY29tcGlsZWRXaXRoQ29tcGlsZXJWNztcbiAgICAgIG1vdmVIZWxwZXJUb0hvb2tzKGNvbnRhaW5lciwgJ2hlbHBlck1pc3NpbmcnLCBrZWVwSGVscGVySW5IZWxwZXJzKTtcbiAgICAgIG1vdmVIZWxwZXJUb0hvb2tzKGNvbnRhaW5lciwgJ2Jsb2NrSGVscGVyTWlzc2luZycsIGtlZXBIZWxwZXJJbkhlbHBlcnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIucHJvdG9BY2Nlc3NDb250cm9sID0gb3B0aW9ucy5wcm90b0FjY2Vzc0NvbnRyb2w7IC8vIGludGVybmFsIG9wdGlvblxuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBvcHRpb25zLmRlY29yYXRvcnM7XG4gICAgICBjb250YWluZXIuaG9va3MgPSBvcHRpb25zLmhvb2tzO1xuICAgIH1cbiAgfTtcblxuICByZXQuX2NoaWxkID0gZnVuY3Rpb24oaSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgJiYgIWJsb2NrUGFyYW1zKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdtdXN0IHBhc3MgYmxvY2sgcGFyYW1zJyk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlRGVwdGhzICYmICFkZXB0aHMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBwYXJlbnQgZGVwdGhzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBQcm9ncmFtKFxuICAgICAgY29udGFpbmVyLFxuICAgICAgaSxcbiAgICAgIHRlbXBsYXRlU3BlY1tpXSxcbiAgICAgIGRhdGEsXG4gICAgICAwLFxuICAgICAgYmxvY2tQYXJhbXMsXG4gICAgICBkZXB0aHNcbiAgICApO1xuICB9O1xuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcFByb2dyYW0oXG4gIGNvbnRhaW5lcixcbiAgaSxcbiAgZm4sXG4gIGRhdGEsXG4gIGRlY2xhcmVkQmxvY2tQYXJhbXMsXG4gIGJsb2NrUGFyYW1zLFxuICBkZXB0aHNcbikge1xuICBmdW5jdGlvbiBwcm9nKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjdXJyZW50RGVwdGhzID0gZGVwdGhzO1xuICAgIGlmIChcbiAgICAgIGRlcHRocyAmJlxuICAgICAgY29udGV4dCAhPSBkZXB0aHNbMF0gJiZcbiAgICAgICEoY29udGV4dCA9PT0gY29udGFpbmVyLm51bGxDb250ZXh0ICYmIGRlcHRoc1swXSA9PT0gbnVsbClcbiAgICApIHtcbiAgICAgIGN1cnJlbnREZXB0aHMgPSBbY29udGV4dF0uY29uY2F0KGRlcHRocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuKFxuICAgICAgY29udGFpbmVyLFxuICAgICAgY29udGV4dCxcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzLFxuICAgICAgY29udGFpbmVyLnBhcnRpYWxzLFxuICAgICAgb3B0aW9ucy5kYXRhIHx8IGRhdGEsXG4gICAgICBibG9ja1BhcmFtcyAmJiBbb3B0aW9ucy5ibG9ja1BhcmFtc10uY29uY2F0KGJsb2NrUGFyYW1zKSxcbiAgICAgIGN1cnJlbnREZXB0aHNcbiAgICApO1xuICB9XG5cbiAgcHJvZyA9IGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpO1xuXG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBkZXB0aHMgPyBkZXB0aHMubGVuZ3RoIDogMDtcbiAgcHJvZy5ibG9ja1BhcmFtcyA9IGRlY2xhcmVkQmxvY2tQYXJhbXMgfHwgMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbi8qKlxuICogVGhpcyBpcyBjdXJyZW50bHkgcGFydCBvZiB0aGUgb2ZmaWNpYWwgQVBJLCB0aGVyZWZvcmUgaW1wbGVtZW50YXRpb24gZGV0YWlscyBzaG91bGQgbm90IGJlIGNoYW5nZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghcGFydGlhbCkge1xuICAgIGlmIChvcHRpb25zLm5hbWUgPT09ICdAcGFydGlhbC1ibG9jaycpIHtcbiAgICAgIHBhcnRpYWwgPSBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIXBhcnRpYWwuY2FsbCAmJiAhb3B0aW9ucy5uYW1lKSB7XG4gICAgLy8gVGhpcyBpcyBhIGR5bmFtaWMgcGFydGlhbCB0aGF0IHJldHVybmVkIGEgc3RyaW5nXG4gICAgb3B0aW9ucy5uYW1lID0gcGFydGlhbDtcbiAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1twYXJ0aWFsXTtcbiAgfVxuICByZXR1cm4gcGFydGlhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICAvLyBVc2UgdGhlIGN1cnJlbnQgY2xvc3VyZSBjb250ZXh0IHRvIHNhdmUgdGhlIHBhcnRpYWwtYmxvY2sgaWYgdGhpcyBwYXJ0aWFsXG4gIGNvbnN0IGN1cnJlbnRQYXJ0aWFsQmxvY2sgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ107XG4gIG9wdGlvbnMucGFydGlhbCA9IHRydWU7XG4gIGlmIChvcHRpb25zLmlkcykge1xuICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCA9IG9wdGlvbnMuaWRzWzBdIHx8IG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aDtcbiAgfVxuXG4gIGxldCBwYXJ0aWFsQmxvY2s7XG4gIGlmIChvcHRpb25zLmZuICYmIG9wdGlvbnMuZm4gIT09IG5vb3ApIHtcbiAgICBvcHRpb25zLmRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIC8vIFdyYXBwZXIgZnVuY3Rpb24gdG8gZ2V0IGFjY2VzcyB0byBjdXJyZW50UGFydGlhbEJsb2NrIGZyb20gdGhlIGNsb3N1cmVcbiAgICBsZXQgZm4gPSBvcHRpb25zLmZuO1xuICAgIHBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gZnVuY3Rpb24gcGFydGlhbEJsb2NrV3JhcHBlcihcbiAgICAgIGNvbnRleHQsXG4gICAgICBvcHRpb25zID0ge31cbiAgICApIHtcbiAgICAgIC8vIFJlc3RvcmUgdGhlIHBhcnRpYWwtYmxvY2sgZnJvbSB0aGUgY2xvc3VyZSBmb3IgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgYmxvY2tcbiAgICAgIC8vIGkuZS4gdGhlIHBhcnQgaW5zaWRlIHRoZSBibG9jayBvZiB0aGUgcGFydGlhbCBjYWxsLlxuICAgICAgb3B0aW9ucy5kYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgIG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gY3VycmVudFBhcnRpYWxCbG9jaztcbiAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9O1xuICAgIGlmIChmbi5wYXJ0aWFscykge1xuICAgICAgb3B0aW9ucy5wYXJ0aWFscyA9IFV0aWxzLmV4dGVuZCh7fSwgb3B0aW9ucy5wYXJ0aWFscywgZm4ucGFydGlhbHMpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXJ0aWFsID09PSB1bmRlZmluZWQgJiYgcGFydGlhbEJsb2NrKSB7XG4gICAgcGFydGlhbCA9IHBhcnRpYWxCbG9jaztcbiAgfVxuXG4gIGlmIChwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUaGUgcGFydGlhbCAnICsgb3B0aW9ucy5uYW1lICsgJyBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgfSBlbHNlIGlmIChwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9vcCgpIHtcbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBpbml0RGF0YShjb250ZXh0LCBkYXRhKSB7XG4gIGlmICghZGF0YSB8fCAhKCdyb290JyBpbiBkYXRhKSkge1xuICAgIGRhdGEgPSBkYXRhID8gY3JlYXRlRnJhbWUoZGF0YSkgOiB7fTtcbiAgICBkYXRhLnJvb3QgPSBjb250ZXh0O1xuICB9XG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKSB7XG4gIGlmIChmbi5kZWNvcmF0b3IpIHtcbiAgICBsZXQgcHJvcHMgPSB7fTtcbiAgICBwcm9nID0gZm4uZGVjb3JhdG9yKFxuICAgICAgcHJvZyxcbiAgICAgIHByb3BzLFxuICAgICAgY29udGFpbmVyLFxuICAgICAgZGVwdGhzICYmIGRlcHRoc1swXSxcbiAgICAgIGRhdGEsXG4gICAgICBibG9ja1BhcmFtcyxcbiAgICAgIGRlcHRoc1xuICAgICk7XG4gICAgVXRpbHMuZXh0ZW5kKHByb2csIHByb3BzKTtcbiAgfVxuICByZXR1cm4gcHJvZztcbn1cblxuZnVuY3Rpb24gd3JhcEhlbHBlcnNUb1Bhc3NMb29rdXBQcm9wZXJ0eShtZXJnZWRIZWxwZXJzLCBjb250YWluZXIpIHtcbiAgT2JqZWN0LmtleXMobWVyZ2VkSGVscGVycykuZm9yRWFjaChoZWxwZXJOYW1lID0+IHtcbiAgICBsZXQgaGVscGVyID0gbWVyZ2VkSGVscGVyc1toZWxwZXJOYW1lXTtcbiAgICBtZXJnZWRIZWxwZXJzW2hlbHBlck5hbWVdID0gcGFzc0xvb2t1cFByb3BlcnR5T3B0aW9uKGhlbHBlciwgY29udGFpbmVyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhc3NMb29rdXBQcm9wZXJ0eU9wdGlvbihoZWxwZXIsIGNvbnRhaW5lcikge1xuICBjb25zdCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eTtcbiAgcmV0dXJuIHdyYXBIZWxwZXIoaGVscGVyLCBvcHRpb25zID0+IHtcbiAgICByZXR1cm4gVXRpbHMuZXh0ZW5kKHsgbG9va3VwUHJvcGVydHkgfSwgb3B0aW9ucyk7XG4gIH0pO1xufVxuIiwiLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IFNhZmVTdHJpbmcucHJvdG90eXBlLnRvSFRNTCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJycgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNhZmVTdHJpbmc7XG4iLCJjb25zdCBlc2NhcGUgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmI3gyNzsnLFxuICAnYCc6ICcmI3g2MDsnLFxuICAnPSc6ICcmI3gzRDsnXG59O1xuXG5jb25zdCBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG4gIHBvc3NpYmxlID0gL1smPD5cIidgPV0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQob2JqIC8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgbGV0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xubGV0IGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSdcbiAgICApO1xuICB9O1xufVxuZXhwb3J0IHsgaXNGdW5jdGlvbiB9O1xuLyogZXNsaW50LWVuYWJsZSBmdW5jLXN0eWxlICovXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgY29uc3QgaXNBcnJheSA9XG4gIEFycmF5LmlzQXJyYXkgfHxcbiAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuICAgICAgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuLy8gT2xkZXIgSUUgdmVyc2lvbnMgZG8gbm90IGRpcmVjdGx5IHN1cHBvcnQgaW5kZXhPZiBzbyB3ZSBtdXN0IGltcGxlbWVudCBvdXIgb3duLCBzYWRseS5cbmV4cG9ydCBmdW5jdGlvbiBpbmRleE9mKGFycmF5LCB2YWx1ZSkge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoYXJyYXlbaV0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG4gICAgfVxuXG4gICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gIH1cblxuICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRnJhbWUob2JqZWN0KSB7XG4gIGxldCBmcmFtZSA9IGV4dGVuZCh7fSwgb2JqZWN0KTtcbiAgZnJhbWUuX3BhcmVudCA9IG9iamVjdDtcbiAgcmV0dXJuIGZyYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmxvY2tQYXJhbXMocGFyYW1zLCBpZHMpIHtcbiAgcGFyYW1zLnBhdGggPSBpZHM7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRDb250ZXh0UGF0aChjb250ZXh0UGF0aCwgaWQpIHtcbiAgcmV0dXJuIChjb250ZXh0UGF0aCA/IGNvbnRleHRQYXRoICsgJy4nIDogJycpICsgaWQ7XG59XG4iLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJylbJ2RlZmF1bHQnXTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iLCIvKiBnbG9iYWwgYXBleCAqL1xudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJylcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigncmF3JywgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcylcbn0pXG5cbi8vIFJlcXVpcmUgZHluYW1pYyB0ZW1wbGF0ZXNcbnZhciBtb2RhbFJlcG9ydFRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbW9kYWwtcmVwb3J0LmhicycpXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCgncmVwb3J0JywgcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcGFydGlhbHMvX3JlcG9ydC5oYnMnKSlcbkhhbmRsZWJhcnMucmVnaXN0ZXJQYXJ0aWFsKCdyb3dzJywgcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcGFydGlhbHMvX3Jvd3MuaGJzJykpXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCgncGFnaW5hdGlvbicsIHJlcXVpcmUoJy4vdGVtcGxhdGVzL3BhcnRpYWxzL19wYWdpbmF0aW9uLmhicycpKVxuXG47KGZ1bmN0aW9uICgkLCB3aW5kb3cpIHtcbiAgJC53aWRnZXQoJ2Zjcy5tb2RhbExvdicsIHtcbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICBvcHRpb25zOiB7XG4gICAgICBpZDogJycsXG4gICAgICB0aXRsZTogJycsXG4gICAgICBpdGVtTmFtZTogJycsXG4gICAgICBzZWFyY2hGaWVsZDogJycsXG4gICAgICBzZWFyY2hCdXR0b246ICcnLFxuICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6ICcnLFxuICAgICAgYWpheElkZW50aWZpZXI6ICcnLFxuICAgICAgc2hvd0hlYWRlcnM6IGZhbHNlLFxuICAgICAgcmV0dXJuQ29sOiAnJyxcbiAgICAgIGRpc3BsYXlDb2w6ICcnLFxuICAgICAgdmFsaWRhdGlvbkVycm9yOiAnJyxcbiAgICAgIGNhc2NhZGluZ0l0ZW1zOiAnJyxcbiAgICAgIG1vZGFsV2lkdGg6IDYwMCxcbiAgICAgIG5vRGF0YUZvdW5kOiAnJyxcbiAgICAgIGFsbG93TXVsdGlsaW5lUm93czogZmFsc2UsXG4gICAgICByb3dDb3VudDogMTUsXG4gICAgICBwYWdlSXRlbXNUb1N1Ym1pdDogJycsXG4gICAgICBtYXJrQ2xhc3NlczogJ3UtaG90JyxcbiAgICAgIGhvdmVyQ2xhc3NlczogJ2hvdmVyIHUtY29sb3ItMScsXG4gICAgICBwcmV2aW91c0xhYmVsOiAncHJldmlvdXMnLFxuICAgICAgbmV4dExhYmVsOiAnbmV4dCcsXG4gICAgICB0ZXh0Q2FzZTogJ04nLFxuICAgICAgYWRkaXRpb25hbE91dHB1dHNTdHI6ICcnLFxuICAgICAgc2VhcmNoRmlyc3RDb2xPbmx5OiB0cnVlLFxuICAgICAgbmV4dE9uRW50ZXI6IHRydWUsXG4gICAgICBjaGlsZENvbHVtbnNTdHI6ICcnLFxuICAgICAgcmVhZE9ubHk6IGZhbHNlLFxuICAgIH0sXG5cbiAgICBfcmV0dXJuVmFsdWU6ICcnLFxuXG4gICAgX2l0ZW0kOiBudWxsLFxuICAgIF9zZWFyY2hCdXR0b24kOiBudWxsLFxuICAgIF9jbGVhcklucHV0JDogbnVsbCxcblxuICAgIF9zZWFyY2hGaWVsZCQ6IG51bGwsXG5cbiAgICBfdGVtcGxhdGVEYXRhOiB7fSxcbiAgICBfbGFzdFNlYXJjaFRlcm06ICcnLFxuXG4gICAgX21vZGFsRGlhbG9nJDogbnVsbCxcblxuICAgIF9hY3RpdmVEZWxheTogZmFsc2UsXG4gICAgX2Rpc2FibGVDaGFuZ2VFdmVudDogZmFsc2UsXG5cbiAgICBfaWckOiBudWxsLFxuICAgIF9ncmlkOiBudWxsLFxuXG4gICAgX3RvcEFwZXg6IGFwZXgudXRpbC5nZXRUb3BBcGV4KCksXG5cbiAgICBfcmVzZXRGb2N1czogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICBpZiAoIXNlbGYub3B0aW9ucy5yZWFkT25seSkge1xuICAgICAgICBpZiAoc2VsZi5fZ3JpZCkge1xuICAgICAgICAgIHZhciByZWNvcmRJZCA9IHNlbGYuX2dyaWQubW9kZWwuZ2V0UmVjb3JkSWQoc2VsZi5fZ3JpZC52aWV3JC5ncmlkKCdnZXRTZWxlY3RlZFJlY29yZHMnKVswXSlcbiAgICAgICAgICB2YXIgY29sdW1uID0gc2VsZi5faWckLmludGVyYWN0aXZlR3JpZCgnb3B0aW9uJykuY29uZmlnLmNvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4uc3RhdGljSWQgPT09IHNlbGYub3B0aW9ucy5pdGVtTmFtZVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgICAgc2VsZi5fZ3JpZC52aWV3JC5ncmlkKCdnb3RvQ2VsbCcsIHJlY29yZElkLCBjb2x1bW4ubmFtZSk7XG4gICAgICAgICAgc2VsZi5fZ3JpZC5mb2N1cygpXG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5faXRlbSQuZm9jdXMoKVxuICAgICAgfVxuXG4gICAgICAvLyBGb2N1cyBvbiBuZXh0IGVsZW1lbnQgaWYgRU5URVIga2V5IHVzZWQgdG8gc2VsZWN0IHJvdy5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgJiYgc2VsZi5vcHRpb25zLm5leHRPbkVudGVyKSB7XG4gICAgICAgICAgc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmlzUHJldkluZGV4KSB7XG4gICAgICAgICAgICBzZWxmLl9mb2N1c1ByZXZFbGVtZW50KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5fZm9jdXNOZXh0RWxlbWVudCgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IGZhbHNlXG4gICAgICB9LCAxMDApXG4gICAgfSxcblxuICAgIC8vIENvbWJpbmF0aW9uIG9mIG51bWJlciwgY2hhciBhbmQgc3BhY2UsIGFycm93IGtleXNcbiAgICBfdmFsaWRTZWFyY2hLZXlzOiBbNDgsIDQ5LCA1MCwgNTEsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIC8vIG51bWJlcnNcbiAgICAgIDY1LCA2NiwgNjcsIDY4LCA2OSwgNzAsIDcxLCA3MiwgNzMsIDc0LCA3NSwgNzYsIDc3LCA3OCwgNzksIDgwLCA4MSwgODIsIDgzLCA4NCwgODUsIDg2LCA4NywgODgsIDg5LCA5MCwgLy8gY2hhcnNcbiAgICAgIDkzLCA5NCwgOTUsIDk2LCA5NywgOTgsIDk5LCAxMDAsIDEwMSwgMTAyLCAxMDMsIDEwNCwgMTA1LCAvLyBudW1wYWQgbnVtYmVyc1xuICAgICAgNDAsIC8vIGFycm93IGRvd25cbiAgICAgIDMyLCAvLyBzcGFjZWJhclxuICAgICAgOCwgLy8gYmFja3NwYWNlXG4gICAgICAxMDYsIDEwNywgMTA5LCAxMTAsIDExMSwgMTg2LCAxODcsIDE4OCwgMTg5LCAxOTAsIDE5MSwgMTkyLCAyMTksIDIyMCwgMjIxLCAyMjAsIC8vIGludGVycHVuY3Rpb25cbiAgICBdLFxuXG4gICAgLy8gS2V5cyB0byBpbmRpY2F0ZSBjb21wbGV0aW5nIGlucHV0IChlc2MsIHRhYiwgZW50ZXIpXG4gICAgX3ZhbGlkTmV4dEtleXM6IFs5LCAyNywgMTNdLFxuXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgIHNlbGYuX2l0ZW0kID0gJCgnIycgKyBzZWxmLm9wdGlvbnMuaXRlbU5hbWUpXG4gICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9IHNlbGYuX2l0ZW0kLmRhdGEoJ3JldHVyblZhbHVlJykudG9TdHJpbmcoKVxuICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJCA9ICQoJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEJ1dHRvbilcbiAgICAgIHNlbGYuX2NsZWFySW5wdXQkID0gc2VsZi5faXRlbSQucGFyZW50KCkuZmluZCgnLmZjcy1zZWFyY2gtY2xlYXInKTtcblxuICAgICAgc2VsZi5fYWRkQ1NTVG9Ub3BMZXZlbCgpXG5cbiAgICAgIC8vIFRyaWdnZXIgZXZlbnQgb24gY2xpY2sgaW5wdXQgZGlzcGxheSBmaWVsZFxuICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDAwIC0gY3JlYXRlICcgKyBzZWxmLm9wdGlvbnM/Lml0ZW1OYW1lKVxuXG4gICAgICAvLyBUcmlnZ2VyIGV2ZW50IG9uIGNsaWNrIGlucHV0IGdyb3VwIGFkZG9uIGJ1dHRvbiAobWFnbmlmaWVyIGdsYXNzKVxuICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uQnV0dG9uKClcblxuICAgICAgLy8gQ2xlYXIgdGV4dCB3aGVuIGNsZWFyIGljb24gaXMgY2xpY2tlZFxuICAgICAgc2VsZi5faW5pdENsZWFySW5wdXQoKVxuXG4gICAgICAvLyBDYXNjYWRpbmcgTE9WIGl0ZW0gYWN0aW9uc1xuICAgICAgc2VsZi5faW5pdENhc2NhZGluZ0xPVnMoKVxuXG4gICAgICAvLyBJbml0IEFQRVggcGFnZWl0ZW0gZnVuY3Rpb25zXG4gICAgICBzZWxmLl9pbml0QXBleEl0ZW0oKVxuICAgIH0sXG5cbiAgICBfb25PcGVuRGlhbG9nOiBmdW5jdGlvbiAobW9kYWwsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gb3B0aW9ucy53aWRnZXRcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJCA9IHNlbGYuX3RvcEFwZXgualF1ZXJ5KG1vZGFsKVxuICAgICAgLy8gRm9jdXMgb24gc2VhcmNoIGZpZWxkIGluIExPVlxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkoJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKVswXS5mb2N1cygpXG4gICAgICAvLyBSZW1vdmUgdmFsaWRhdGlvbiByZXN1bHRzXG4gICAgICBzZWxmLl9yZW1vdmVWYWxpZGF0aW9uKClcbiAgICAgIC8vIEFkZCB0ZXh0IGZyb20gZGlzcGxheSBmaWVsZFxuICAgICAgaWYgKG9wdGlvbnMuZmlsbFNlYXJjaFRleHQpIHtcbiAgICAgICAgc2VsZi5fdG9wQXBleC5pdGVtKHNlbGYub3B0aW9ucy5zZWFyY2hGaWVsZCkuc2V0VmFsdWUoc2VsZi5faXRlbSQudmFsKCkpXG4gICAgICB9XG4gICAgICAvLyBBZGQgY2xhc3Mgb24gaG92ZXJcbiAgICAgIHNlbGYuX29uUm93SG92ZXIoKVxuICAgICAgLy8gc2VsZWN0SW5pdGlhbFJvd1xuICAgICAgc2VsZi5fc2VsZWN0SW5pdGlhbFJvdygpXG4gICAgICAvLyBTZXQgYWN0aW9uIHdoZW4gYSByb3cgaXMgc2VsZWN0ZWRcbiAgICAgIHNlbGYuX29uUm93U2VsZWN0ZWQoKVxuICAgICAgLy8gTmF2aWdhdGUgb24gYXJyb3cga2V5cyB0cm91Z2ggTE9WXG4gICAgICBzZWxmLl9pbml0S2V5Ym9hcmROYXZpZ2F0aW9uKClcbiAgICAgIC8vIFNldCBzZWFyY2ggYWN0aW9uXG4gICAgICBzZWxmLl9pbml0U2VhcmNoKClcbiAgICAgIC8vIFNldCBwYWdpbmF0aW9uIGFjdGlvbnNcbiAgICAgIHNlbGYuX2luaXRQYWdpbmF0aW9uKClcbiAgICB9LFxuXG4gICAgX29uQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIChtb2RhbCwgb3B0aW9ucykge1xuICAgICAgLy8gY2xvc2UgdGFrZXMgcGxhY2Ugd2hlbiBubyByZWNvcmQgaGFzIGJlZW4gc2VsZWN0ZWQsIGluc3RlYWQgdGhlIGNsb3NlIG1vZGFsIChvciBlc2MpIHdhcyBjbGlja2VkLyBwcmVzc2VkXG4gICAgICAvLyBJdCBjb3VsZCBtZWFuIHR3byB0aGluZ3M6IGtlZXAgY3VycmVudCBvciB0YWtlIHRoZSB1c2VyJ3MgZGlzcGxheSB2YWx1ZVxuICAgICAgLy8gV2hhdCBhYm91dCB0d28gZXF1YWwgZGlzcGxheSB2YWx1ZXM/XG5cbiAgICAgIC8vIEJ1dCBubyByZWNvcmQgc2VsZWN0aW9uIGNvdWxkIG1lYW4gY2FuY2VsXG4gICAgICAvLyBidXQgb3BlbiBtb2RhbCBhbmQgZm9yZ2V0IGFib3V0IGl0XG4gICAgICAvLyBpbiB0aGUgZW5kLCB0aGlzIHNob3VsZCBrZWVwIHRoaW5ncyBpbnRhY3QgYXMgdGhleSB3ZXJlXG4gICAgICBvcHRpb25zLndpZGdldC5fZGVzdHJveShtb2RhbClcbiAgICAgIHRoaXMuX3NldEl0ZW1WYWx1ZXMob3B0aW9ucy53aWRnZXQuX3JldHVyblZhbHVlKTtcbiAgICAgIG9wdGlvbnMud2lkZ2V0Ll90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDkgLSBjbG9zZSBkaWFsb2cnKVxuICAgIH0sXG5cbiAgICBfaW5pdEdyaWRDb25maWc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2lnJCA9IHRoaXMuX2l0ZW0kLmNsb3Nlc3QoJy5hLUlHJylcblxuICAgICAgaWYgKHRoaXMuX2lnJC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX2dyaWQgPSB0aGlzLl9pZyQuaW50ZXJhY3RpdmVHcmlkKCdnZXRWaWV3cycpLmdyaWRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gb3B0aW9ucy53aWRnZXRcblxuICAgICAgc2VsZi5faW5pdEdyaWRDb25maWcoKVxuXG4gICAgICAvLyBDcmVhdGUgTE9WIHJlZ2lvblxuICAgICAgdmFyICRtb2RhbFJlZ2lvbiA9IHNlbGYuX3RvcEFwZXgualF1ZXJ5KG1vZGFsUmVwb3J0VGVtcGxhdGUoc2VsZi5fdGVtcGxhdGVEYXRhKSkuYXBwZW5kVG8oJ2JvZHknKVxuXG4gICAgICAvLyBPcGVuIG5ldyBtb2RhbFxuICAgICAgJG1vZGFsUmVnaW9uLmRpYWxvZyh7XG4gICAgICAgIGhlaWdodDogKHNlbGYub3B0aW9ucy5yb3dDb3VudCAqIDMzKSArIDE5OSwgLy8gKyBkaWFsb2cgYnV0dG9uIGhlaWdodFxuICAgICAgICB3aWR0aDogc2VsZi5vcHRpb25zLm1vZGFsV2lkdGgsXG4gICAgICAgIGNsb3NlVGV4dDogYXBleC5sYW5nLmdldE1lc3NhZ2UoJ0FQRVguRElBTE9HLkNMT1NFJyksXG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY2xvc2VPbkVzY2FwZTogdHJ1ZSxcbiAgICAgICAgZGlhbG9nQ2xhc3M6ICd1aS1kaWFsb2ctLWFwZXggJyxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAgICAgLy8gcmVtb3ZlIG9wZW5lciBiZWNhdXNlIGl0IG1ha2VzIHRoZSBwYWdlIHNjcm9sbCBkb3duIGZvciBJR1xuICAgICAgICAgIHNlbGYuX3RvcEFwZXgualF1ZXJ5KHRoaXMpLmRhdGEoJ3VpRGlhbG9nJykub3BlbmVyID0gc2VsZi5fdG9wQXBleC5qUXVlcnkoKVxuICAgICAgICAgIHNlbGYuX3RvcEFwZXgubmF2aWdhdGlvbi5iZWdpbkZyZWV6ZVNjcm9sbCgpXG4gICAgICAgICAgc2VsZi5fb25PcGVuRGlhbG9nKHRoaXMsIG9wdGlvbnMpXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fb25DbG9zZURpYWxvZyh0aGlzLCBvcHRpb25zKVxuICAgICAgICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIGRvd24gb24gbW9kYWwgY2xvc2VcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fdG9wQXBleC5uYXZpZ2F0aW9uLmVuZEZyZWV6ZVNjcm9sbCgpXG4gICAgICAgICAgc2VsZi5fcmVzZXRGb2N1cygpXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfb25SZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBleGVjdXRlZCBhZnRlciBhIHNlYXJjaFxuICAgICAgdmFyIHJlcG9ydEh0bWwgPSBIYW5kbGViYXJzLnBhcnRpYWxzLnJlcG9ydChzZWxmLl90ZW1wbGF0ZURhdGEpXG4gICAgICB2YXIgcGFnaW5hdGlvbkh0bWwgPSBIYW5kbGViYXJzLnBhcnRpYWxzLnBhZ2luYXRpb24oc2VsZi5fdGVtcGxhdGVEYXRhKVxuXG4gICAgICAvLyBHZXQgY3VycmVudCBtb2RhbC1sb3YgdGFibGVcbiAgICAgIHZhciBtb2RhbExPVlRhYmxlID0gc2VsZi5fbW9kYWxEaWFsb2ckLmZpbmQoJy5tb2RhbC1sb3YtdGFibGUnKVxuICAgICAgdmFyIHBhZ2luYXRpb24gPSBzZWxmLl9tb2RhbERpYWxvZyQuZmluZCgnLnQtQnV0dG9uUmVnaW9uLXdyYXAnKVxuXG4gICAgICAvLyBSZXBsYWNlIHJlcG9ydCB3aXRoIG5ldyBkYXRhXG4gICAgICAkKG1vZGFsTE9WVGFibGUpLnJlcGxhY2VXaXRoKHJlcG9ydEh0bWwpXG4gICAgICAkKHBhZ2luYXRpb24pLmh0bWwocGFnaW5hdGlvbkh0bWwpXG5cbiAgICAgIC8vIHNlbGVjdEluaXRpYWxSb3cgaW4gbmV3IG1vZGFsLWxvdiB0YWJsZVxuICAgICAgc2VsZi5fc2VsZWN0SW5pdGlhbFJvdygpXG5cbiAgICAgIC8vIE1ha2UgdGhlIGVudGVyIGtleSBkbyBzb21ldGhpbmcgYWdhaW5cbiAgICAgIHNlbGYuX2FjdGl2ZURlbGF5ID0gZmFsc2VcbiAgICB9LFxuXG4gICAgX3VuZXNjYXBlOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsIC8vICQoJzxpbnB1dCB2YWx1ZT1cIicgKyB2YWwgKyAnXCIvPicpLnZhbCgpXG4gICAgfSxcblxuICAgIF9nZXRUZW1wbGF0ZURhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAvLyBDcmVhdGUgcmV0dXJuIE9iamVjdFxuICAgICAgdmFyIHRlbXBsYXRlRGF0YSA9IHtcbiAgICAgICAgaWQ6IHNlbGYub3B0aW9ucy5pZCxcbiAgICAgICAgY2xhc3NlczogJ21vZGFsLWxvdicsXG4gICAgICAgIHRpdGxlOiBzZWxmLm9wdGlvbnMudGl0bGUsXG4gICAgICAgIG1vZGFsU2l6ZTogc2VsZi5vcHRpb25zLm1vZGFsU2l6ZSxcbiAgICAgICAgcmVnaW9uOiB7XG4gICAgICAgICAgYXR0cmlidXRlczogJ3N0eWxlPVwiYm90dG9tOiA2NnB4O1wiJyxcbiAgICAgICAgfSxcbiAgICAgICAgc2VhcmNoRmllbGQ6IHtcbiAgICAgICAgICBpZDogc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkLFxuICAgICAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLm9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgdGV4dENhc2U6IHNlbGYub3B0aW9ucy50ZXh0Q2FzZSA9PT0gJ1UnID8gJ3UtdGV4dFVwcGVyJyA6IHNlbGYub3B0aW9ucy50ZXh0Q2FzZSA9PT0gJ0wnID8gJ3UtdGV4dExvd2VyJyA6ICcnLFxuICAgICAgICB9LFxuICAgICAgICByZXBvcnQ6IHtcbiAgICAgICAgICBjb2x1bW5zOiB7fSxcbiAgICAgICAgICByb3dzOiB7fSxcbiAgICAgICAgICBjb2xDb3VudDogMCxcbiAgICAgICAgICByb3dDb3VudDogMCxcbiAgICAgICAgICBzaG93SGVhZGVyczogc2VsZi5vcHRpb25zLnNob3dIZWFkZXJzLFxuICAgICAgICAgIG5vRGF0YUZvdW5kOiBzZWxmLm9wdGlvbnMubm9EYXRhRm91bmQsXG4gICAgICAgICAgY2xhc3NlczogKHNlbGYub3B0aW9ucy5hbGxvd011bHRpbGluZVJvd3MpID8gJ211bHRpbGluZScgOiAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgIHJvd0NvdW50OiAwLFxuICAgICAgICAgIGZpcnN0Um93OiAwLFxuICAgICAgICAgIGxhc3RSb3c6IDAsXG4gICAgICAgICAgYWxsb3dQcmV2OiBmYWxzZSxcbiAgICAgICAgICBhbGxvd05leHQ6IGZhbHNlLFxuICAgICAgICAgIHByZXZpb3VzOiBzZWxmLm9wdGlvbnMucHJldmlvdXNMYWJlbCxcbiAgICAgICAgICBuZXh0OiBzZWxmLm9wdGlvbnMubmV4dExhYmVsLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICAvLyBObyByb3dzIGZvdW5kP1xuICAgICAgaWYgKHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvdy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlRGF0YVxuICAgICAgfVxuXG4gICAgICAvLyBHZXQgY29sdW1uc1xuICAgICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyhzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3dbMF0pXG5cbiAgICAgIC8vIFBhZ2luYXRpb25cbiAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmZpcnN0Um93ID0gc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93WzBdWydST1dOVU0jIyMnXVxuICAgICAgdGVtcGxhdGVEYXRhLnBhZ2luYXRpb24ubGFzdFJvdyA9IHNlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvd1tzZWxmLm9wdGlvbnMuZGF0YVNvdXJjZS5yb3cubGVuZ3RoIC0gMV1bJ1JPV05VTSMjIyddXG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgbmV4dCByZXN1bHRzZXRcbiAgICAgIHZhciBuZXh0Um93ID0gc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93W3NlbGYub3B0aW9ucy5kYXRhU291cmNlLnJvdy5sZW5ndGggLSAxXVsnTkVYVFJPVyMjIyddXG5cbiAgICAgIC8vIEFsbG93IHByZXZpb3VzIGJ1dHRvbj9cbiAgICAgIGlmICh0ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5maXJzdFJvdyA+IDEpIHtcbiAgICAgICAgdGVtcGxhdGVEYXRhLnBhZ2luYXRpb24uYWxsb3dQcmV2ID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBBbGxvdyBuZXh0IGJ1dHRvbj9cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChuZXh0Um93LnRvU3RyaW5nKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmFsbG93TmV4dCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLmFsbG93TmV4dCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSBpbnRlcm5hbCBjb2x1bW5zIChST1dOVU0jIyMsIC4uLilcbiAgICAgIGNvbHVtbnMuc3BsaWNlKGNvbHVtbnMuaW5kZXhPZignUk9XTlVNIyMjJyksIDEpXG4gICAgICBjb2x1bW5zLnNwbGljZShjb2x1bW5zLmluZGV4T2YoJ05FWFRST1cjIyMnKSwgMSlcblxuICAgICAgLy8gUmVtb3ZlIGNvbHVtbiByZXR1cm4taXRlbVxuICAgICAgY29sdW1ucy5zcGxpY2UoY29sdW1ucy5pbmRleE9mKHNlbGYub3B0aW9ucy5yZXR1cm5Db2wpLCAxKVxuICAgICAgLy8gUmVtb3ZlIGNvbHVtbiByZXR1cm4tZGlzcGxheSBpZiBkaXNwbGF5IGNvbHVtbnMgYXJlIHByb3ZpZGVkXG4gICAgICBpZiAoY29sdW1ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbHVtbnMuc3BsaWNlKGNvbHVtbnMuaW5kZXhPZihzZWxmLm9wdGlvbnMuZGlzcGxheUNvbCksIDEpXG4gICAgICB9XG5cbiAgICAgIHRlbXBsYXRlRGF0YS5yZXBvcnQuY29sQ291bnQgPSBjb2x1bW5zLmxlbmd0aFxuXG4gICAgICAvLyBSZW5hbWUgY29sdW1ucyB0byBzdGFuZGFyZCBuYW1lcyBsaWtlIGNvbHVtbjAsIGNvbHVtbjEsIC4uXG4gICAgICB2YXIgY29sdW1uID0ge31cbiAgICAgICQuZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKGNvbHVtbnMubGVuZ3RoID09PSAxICYmIHNlbGYub3B0aW9ucy5pdGVtTGFiZWwpIHtcbiAgICAgICAgICBjb2x1bW5bJ2NvbHVtbicgKyBrZXldID0ge1xuICAgICAgICAgICAgbmFtZTogdmFsLFxuICAgICAgICAgICAgbGFiZWw6IHNlbGYub3B0aW9ucy5pdGVtTGFiZWwsXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbHVtblsnY29sdW1uJyArIGtleV0gPSB7XG4gICAgICAgICAgICBuYW1lOiB2YWwsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBsYXRlRGF0YS5yZXBvcnQuY29sdW1ucyA9ICQuZXh0ZW5kKHRlbXBsYXRlRGF0YS5yZXBvcnQuY29sdW1ucywgY29sdW1uKVxuICAgICAgfSlcblxuICAgICAgLyogR2V0IHJvd3NcblxuICAgICAgICBmb3JtYXQgd2lsbCBiZSBsaWtlIHRoaXM6XG5cbiAgICAgICAgcm93cyA9IFt7Y29sdW1uMDogXCJhXCIsIGNvbHVtbjE6IFwiYlwifSwge2NvbHVtbjA6IFwiY1wiLCBjb2x1bW4xOiBcImRcIn1dXG5cbiAgICAgICovXG4gICAgICB2YXIgdG1wUm93XG5cbiAgICAgIHZhciByb3dzID0gJC5tYXAoc2VsZi5vcHRpb25zLmRhdGFTb3VyY2Uucm93LCBmdW5jdGlvbiAocm93LCByb3dLZXkpIHtcbiAgICAgICAgdG1wUm93ID0ge1xuICAgICAgICAgIGNvbHVtbnM6IHt9LFxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZCBjb2x1bW4gdmFsdWVzIHRvIHJvd1xuICAgICAgICAkLmVhY2godGVtcGxhdGVEYXRhLnJlcG9ydC5jb2x1bW5zLCBmdW5jdGlvbiAoY29sSWQsIGNvbCkge1xuICAgICAgICAgIHRtcFJvdy5jb2x1bW5zW2NvbElkXSA9IHNlbGYuX3VuZXNjYXBlKHJvd1tjb2wubmFtZV0pXG4gICAgICAgIH0pXG4gICAgICAgIC8vIGFkZCBtZXRhZGF0YSB0byByb3dcbiAgICAgICAgdG1wUm93LnJldHVyblZhbCA9IHJvd1tzZWxmLm9wdGlvbnMucmV0dXJuQ29sXVxuICAgICAgICB0bXBSb3cuZGlzcGxheVZhbCA9IHJvd1tzZWxmLm9wdGlvbnMuZGlzcGxheUNvbF1cbiAgICAgICAgcmV0dXJuIHRtcFJvd1xuICAgICAgfSlcblxuICAgICAgdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzID0gcm93c1xuXG4gICAgICB0ZW1wbGF0ZURhdGEucmVwb3J0LnJvd0NvdW50ID0gKHJvd3MubGVuZ3RoID09PSAwID8gZmFsc2UgOiByb3dzLmxlbmd0aClcbiAgICAgIHRlbXBsYXRlRGF0YS5wYWdpbmF0aW9uLnJvd0NvdW50ID0gdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dDb3VudFxuXG4gICAgICByZXR1cm4gdGVtcGxhdGVEYXRhXG4gICAgfSxcblxuICAgIF9kZXN0cm95OiBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgJCh3aW5kb3cudG9wLmRvY3VtZW50KS5vZmYoJ2tleWRvd24nKVxuICAgICAgJCh3aW5kb3cudG9wLmRvY3VtZW50KS5vZmYoJ2tleXVwJywgJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKVxuICAgICAgc2VsZi5faXRlbSQub2ZmKCdrZXl1cCcpXG4gICAgICBzZWxmLl9tb2RhbERpYWxvZyQucmVtb3ZlKClcbiAgICAgIHNlbGYuX3RvcEFwZXgubmF2aWdhdGlvbi5lbmRGcmVlemVTY3JvbGwoKVxuICAgIH0sXG5cbiAgICBfZ2V0RGF0YTogZnVuY3Rpb24gKG9wdGlvbnMsIGhhbmRsZXIpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICAgIHNlYXJjaFRlcm06ICcnLFxuICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHRydWUsXG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzID0gJC5leHRlbmQoc2V0dGluZ3MsIG9wdGlvbnMpXG4gICAgICB2YXIgc2VhcmNoVGVybSA9IChzZXR0aW5ncy5zZWFyY2hUZXJtLmxlbmd0aCA+IDApID8gc2V0dGluZ3Muc2VhcmNoVGVybSA6IHNlbGYuX3RvcEFwZXguaXRlbShzZWxmLm9wdGlvbnMuc2VhcmNoRmllbGQpLmdldFZhbHVlKClcbiAgICAgIHZhciBpdGVtcyA9IFtzZWxmLm9wdGlvbnMucGFnZUl0ZW1zVG9TdWJtaXQsIHNlbGYub3B0aW9ucy5jYXNjYWRpbmdJdGVtc11cbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICByZXR1cm4gKHNlbGVjdG9yKVxuICAgICAgICB9KVxuICAgICAgICAuam9pbignLCcpXG5cbiAgICAgIC8vIFN0b3JlIGxhc3Qgc2VhcmNoVGVybVxuICAgICAgc2VsZi5fbGFzdFNlYXJjaFRlcm0gPSBzZWFyY2hUZXJtXG5cbiAgICAgIGFwZXguc2VydmVyLnBsdWdpbihzZWxmLm9wdGlvbnMuYWpheElkZW50aWZpZXIsIHtcbiAgICAgICAgeDAxOiAnR0VUX0RBVEEnLFxuICAgICAgICB4MDI6IHNlYXJjaFRlcm0sIC8vIHNlYXJjaHRlcm1cbiAgICAgICAgeDAzOiBzZXR0aW5ncy5maXJzdFJvdywgLy8gZmlyc3Qgcm93bnVtIHRvIHJldHVyblxuICAgICAgICBwYWdlSXRlbXM6IGl0ZW1zLFxuICAgICAgfSwge1xuICAgICAgICB0YXJnZXQ6IHNlbGYuX2l0ZW0kLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBsb2FkaW5nSW5kaWNhdG9yOiAkLnByb3h5KG9wdGlvbnMubG9hZGluZ0luZGljYXRvciwgc2VsZiksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICAgIHNlbGYub3B0aW9ucy5kYXRhU291cmNlID0gcERhdGFcbiAgICAgICAgICBzZWxmLl90ZW1wbGF0ZURhdGEgPSBzZWxmLl9nZXRUZW1wbGF0ZURhdGEoKVxuICAgICAgICAgIGhhbmRsZXIoe1xuICAgICAgICAgICAgd2lkZ2V0OiBzZWxmLFxuICAgICAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHNldHRpbmdzLmZpbGxTZWFyY2hUZXh0LFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaW5pdFNlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBpZiB0aGUgbGFzdFNlYXJjaFRlcm0gaXMgbm90IGVxdWFsIHRvIHRoZSBjdXJyZW50IHNlYXJjaFRlcm0sIHRoZW4gc2VhcmNoIGltbWVkaWF0ZVxuICAgICAgaWYgKHNlbGYuX2xhc3RTZWFyY2hUZXJtICE9PSBzZWxmLl90b3BBcGV4Lml0ZW0oc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkKS5nZXRWYWx1ZSgpKSB7XG4gICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgIGZpcnN0Um93OiAxLFxuICAgICAgICAgIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvcixcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX29uUmVsb2FkKClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gQWN0aW9uIHdoZW4gdXNlciBpbnB1dHMgc2VhcmNoIHRleHRcbiAgICAgICQod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2tleXVwJywgJyMnICsgc2VsZi5vcHRpb25zLnNlYXJjaEZpZWxkLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZyBmb3IgbmF2aWdhdGlvbiBrZXlzLCBlc2NhcGUgYW5kIGVudGVyXG4gICAgICAgIHZhciBuYXZpZ2F0aW9uS2V5cyA9IFszNywgMzgsIDM5LCA0MCwgOSwgMzMsIDM0LCAyNywgMTNdXG4gICAgICAgIGlmICgkLmluQXJyYXkoZXZlbnQua2V5Q29kZSwgbmF2aWdhdGlvbktleXMpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0b3AgdGhlIGVudGVyIGtleSBmcm9tIHNlbGVjdGluZyBhIHJvd1xuICAgICAgICBzZWxmLl9hY3RpdmVEZWxheSA9IHRydWVcblxuICAgICAgICAvLyBEb24ndCBzZWFyY2ggb24gYWxsIGtleSBldmVudHMgYnV0IGFkZCBhIGRlbGF5IGZvciBwZXJmb3JtYW5jZVxuICAgICAgICB2YXIgc3JjRWwgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICAgIGlmIChzcmNFbC5kZWxheVRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNyY0VsLmRlbGF5VGltZXIpXG4gICAgICAgIH1cblxuICAgICAgICBzcmNFbC5kZWxheVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fZ2V0RGF0YSh7XG4gICAgICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgICAgIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvcixcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9vblJlbG9hZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSwgMzUwKVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2luaXRQYWdpbmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHZhciBwcmV2U2VsZWN0b3IgPSAnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tcHJldidcbiAgICAgIHZhciBuZXh0U2VsZWN0b3IgPSAnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tbmV4dCdcblxuICAgICAgLy8gcmVtb3ZlIGN1cnJlbnQgbGlzdGVuZXJzXG4gICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSh3aW5kb3cudG9wLmRvY3VtZW50KS5vZmYoJ2NsaWNrJywgcHJldlNlbGVjdG9yKVxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkod2luZG93LnRvcC5kb2N1bWVudCkub2ZmKCdjbGljaycsIG5leHRTZWxlY3RvcilcblxuICAgICAgLy8gUHJldmlvdXMgc2V0XG4gICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSh3aW5kb3cudG9wLmRvY3VtZW50KS5vbignY2xpY2snLCBwcmV2U2VsZWN0b3IsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgIGZpcnN0Um93OiBzZWxmLl9nZXRGaXJzdFJvd251bVByZXZTZXQoKSxcbiAgICAgICAgICBsb2FkaW5nSW5kaWNhdG9yOiBzZWxmLl9tb2RhbExvYWRpbmdJbmRpY2F0b3IsXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9vblJlbG9hZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBOZXh0IHNldFxuICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2NsaWNrJywgbmV4dFNlbGVjdG9yLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzZWxmLl9nZXREYXRhKHtcbiAgICAgICAgICBmaXJzdFJvdzogc2VsZi5fZ2V0Rmlyc3RSb3dudW1OZXh0U2V0KCksXG4gICAgICAgICAgbG9hZGluZ0luZGljYXRvcjogc2VsZi5fbW9kYWxMb2FkaW5nSW5kaWNhdG9yLFxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fb25SZWxvYWQoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2dldEZpcnN0Um93bnVtUHJldlNldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gc2VsZi5fdGVtcGxhdGVEYXRhLnBhZ2luYXRpb24uZmlyc3RSb3cgLSBzZWxmLm9wdGlvbnMucm93Q291bnRcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gMVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0Rmlyc3RSb3dudW1OZXh0U2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBzZWxmLl90ZW1wbGF0ZURhdGEucGFnaW5hdGlvbi5sYXN0Um93ICsgMVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiAxNlxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfb3BlbkxPVjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIG1vZGFsLWxvdiByZWdpb25cbiAgICAgICQoJyMnICsgc2VsZi5vcHRpb25zLmlkLCBkb2N1bWVudCkucmVtb3ZlKClcblxuICAgICAgc2VsZi5fZ2V0RGF0YSh7XG4gICAgICAgIGZpcnN0Um93OiAxLFxuICAgICAgICBzZWFyY2hUZXJtOiBvcHRpb25zLnNlYXJjaFRlcm0sXG4gICAgICAgIGZpbGxTZWFyY2hUZXh0OiBvcHRpb25zLmZpbGxTZWFyY2hUZXh0LFxuICAgICAgICAvLyBsb2FkaW5nSW5kaWNhdG9yOiBzZWxmLl9pdGVtTG9hZGluZ0luZGljYXRvclxuICAgICAgfSwgb3B0aW9ucy5hZnRlckRhdGEpXG4gICAgfSxcblxuICAgIF9hZGRDU1NUb1RvcExldmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIC8vIENTUyBmaWxlIGlzIGFsd2F5cyBwcmVzZW50IHdoZW4gdGhlIGN1cnJlbnQgd2luZG93IGlzIHRoZSB0b3Agd2luZG93LCBzbyBkbyBub3RoaW5nXG4gICAgICBpZiAod2luZG93ID09PSB3aW5kb3cudG9wKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdmFyIGNzc1NlbGVjdG9yID0gJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXVtocmVmKj1cIm1vZGFsLWxvdlwiXSdcblxuICAgICAgLy8gQ2hlY2sgaWYgZmlsZSBleGlzdHMgaW4gdG9wIHdpbmRvd1xuICAgICAgaWYgKHNlbGYuX3RvcEFwZXgualF1ZXJ5KGNzc1NlbGVjdG9yKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkoJ2hlYWQnKS5hcHBlbmQoJChjc3NTZWxlY3RvcikuY2xvbmUoKSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRnVuY3Rpb24gYmFzZWQgb24gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM1MTczNDQzXG4gICAgX2ZvY3VzTmV4dEVsZW1lbnQ6IGZ1bmN0aW9uIChpZykge1xuICAgICAgLy9hZGQgYWxsIGVsZW1lbnRzIHdlIHdhbnQgdG8gaW5jbHVkZSBpbiBvdXIgc2VsZWN0aW9uXG4gICAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBbXG4gICAgICAgICdhOm5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ1t0YWJpbmRleF06bm90KFtkaXNhYmxlZF0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgXS5qb2luKCcsICcpO1xuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5mb3JtKSB7XG4gICAgICAgIHZhciBpdGVtTmFtZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaWQ7XG4gICAgICAgIHZhciBmb2N1c2FibGUgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMpLFxuICAgICAgICAgIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAvL2NoZWNrIGZvciB2aXNpYmlsaXR5IHdoaWxlIGFsd2F5cyBpbmNsdWRlIHRoZSBjdXJyZW50IGFjdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldFdpZHRoID4gMCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDAgfHwgZWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICAgIH0pO1xuICAgICAgICB2YXIgaW5kZXggPSBmb2N1c2FibGUuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICB2YXIgbmV4dEVsZW1lbnQgPSBmb2N1c2FibGVbaW5kZXggKyAxXSB8fCBmb2N1c2FibGVbMF07XG4gICAgICAgICAgYXBleC5kZWJ1Zy50cmFjZSgnRkNTIExPViAtIGZvY3VzIG5leHQnKTtcbiAgICAgICAgICBuZXh0RWxlbWVudC5mb2N1cygpO1xuXG4gICAgICAgICAgLy8gQ1c6IGludGVyYWN0aXZlIGdyaWQgaGFjayAtIHRhYiBuZXh0IHdoZW4gdGhlcmUgYXJlIGNhc2NhZGluZyBjaGlsZCBjb2x1bW5zXG4gICAgICAgICAgaWYgKGlnPy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IGlnLmludGVyYWN0aXZlR3JpZCgnZ2V0Vmlld3MnKS5ncmlkO1xuICAgICAgICAgICAgdmFyIHJlY29yZElkID0gZ3JpZC5tb2RlbC5nZXRSZWNvcmRJZChncmlkLnZpZXckLmdyaWQoJ2dldFNlbGVjdGVkUmVjb3JkcycpWzBdKVxuICAgICAgICAgICAgdmFyIG5leHRDb2xJbmRleCA9IGlnLmludGVyYWN0aXZlR3JpZCgnb3B0aW9uJykuY29uZmlnLmNvbHVtbnMuZmluZEluZGV4KGNvbCA9PiBjb2wuc3RhdGljSWQgPT09IGl0ZW1OYW1lKSArIDE7XG4gICAgICAgICAgICB2YXIgbmV4dENvbCA9IGlnLmludGVyYWN0aXZlR3JpZCgnb3B0aW9uJykuY29uZmlnLmNvbHVtbnNbbmV4dENvbEluZGV4XTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBncmlkLnZpZXckLmdyaWQoJ2dvdG9DZWxsJywgcmVjb3JkSWQsIG5leHRDb2wubmFtZSk7XG4gICAgICAgICAgICAgIGdyaWQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgYXBleC5pdGVtKG5leHRDb2wuc3RhdGljSWQpLnNldEZvY3VzKCk7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEZ1bmN0aW9uIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNTE3MzQ0M1xuICAgIF9mb2N1c1ByZXZFbGVtZW50OiBmdW5jdGlvbiAoaWcpIHtcbiAgICAgIC8vYWRkIGFsbCBlbGVtZW50cyB3ZSB3YW50IHRvIGluY2x1ZGUgaW4gb3VyIHNlbGVjdGlvblxuICAgICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gW1xuICAgICAgICAnYTpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFtoaWRkZW5dKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgICAgJ2lucHV0Om5vdChbZGlzYWJsZWRdKTpub3QoW2hpZGRlbl0pOm5vdChbdGFiaW5kZXg9XCItMVwiXSknLFxuICAgICAgICAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbaGlkZGVuXSk6bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG4gICAgICAgICdbdGFiaW5kZXhdOm5vdChbZGlzYWJsZWRdKTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJyxcbiAgICAgIF0uam9pbignLCAnKTtcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZm9ybSkge1xuICAgICAgICB2YXIgaXRlbU5hbWUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlkO1xuICAgICAgICB2YXIgZm9jdXNhYmxlID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzKSxcbiAgICAgICAgICBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgLy9jaGVjayBmb3IgdmlzaWJpbGl0eSB3aGlsZSBhbHdheXMgaW5jbHVkZSB0aGUgY3VycmVudCBhY3RpdmVFbGVtZW50XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwIHx8IGVsZW1lbnQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgdmFyIGluZGV4ID0gZm9jdXNhYmxlLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgdmFyIHByZXZFbGVtZW50ID0gZm9jdXNhYmxlW2luZGV4IC0gMV0gfHwgZm9jdXNhYmxlWzBdO1xuICAgICAgICAgIGFwZXguZGVidWcudHJhY2UoJ0ZDUyBMT1YgLSBmb2N1cyBwcmV2aW91cycpO1xuICAgICAgICAgIHByZXZFbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgICAgICAvLyBDVzogaW50ZXJhY3RpdmUgZ3JpZCBoYWNrIC0gdGFiIG5leHQgd2hlbiB0aGVyZSBhcmUgY2FzY2FkaW5nIGNoaWxkIGNvbHVtbnNcbiAgICAgICAgICBpZiAoaWc/Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBncmlkID0gaWcuaW50ZXJhY3RpdmVHcmlkKCdnZXRWaWV3cycpLmdyaWQ7XG4gICAgICAgICAgICB2YXIgcmVjb3JkSWQgPSBncmlkLm1vZGVsLmdldFJlY29yZElkKGdyaWQudmlldyQuZ3JpZCgnZ2V0U2VsZWN0ZWRSZWNvcmRzJylbMF0pXG4gICAgICAgICAgICB2YXIgcHJldkNvbEluZGV4ID0gaWcuaW50ZXJhY3RpdmVHcmlkKCdvcHRpb24nKS5jb25maWcuY29sdW1ucy5maW5kSW5kZXgoY29sID0+IGNvbC5zdGF0aWNJZCA9PT0gaXRlbU5hbWUpIC0gMTtcbiAgICAgICAgICAgIHZhciBwcmV2Q29sID0gaWcuaW50ZXJhY3RpdmVHcmlkKCdvcHRpb24nKS5jb25maWcuY29sdW1uc1twcmV2Q29sSW5kZXhdO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGdyaWQudmlldyQuZ3JpZCgnZ290b0NlbGwnLCByZWNvcmRJZCwgcHJldkNvbC5uYW1lKTtcbiAgICAgICAgICAgICAgZ3JpZC5mb2N1cygpO1xuICAgICAgICAgICAgICBhcGV4Lml0ZW0ocHJldkNvbC5zdGF0aWNJZCkuc2V0Rm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldEl0ZW1WYWx1ZXM6IGZ1bmN0aW9uIChyZXR1cm5WYWx1ZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIHJlcG9ydFJvdztcbiAgICAgIGlmIChzZWxmLl90ZW1wbGF0ZURhdGEucmVwb3J0Py5yb3dzPy5sZW5ndGgpIHtcbiAgICAgICAgcmVwb3J0Um93ID0gc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzLmZpbmQocm93ID0+IHJvdy5yZXR1cm5WYWwgPT09IHJldHVyblZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgYXBleC5pdGVtKHNlbGYub3B0aW9ucy5pdGVtTmFtZSkuc2V0VmFsdWUocmVwb3J0Um93Py5yZXR1cm5WYWwgfHwgJycsIHJlcG9ydFJvdz8uZGlzcGxheVZhbCB8fCAnJyk7XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWRkaXRpb25hbE91dHB1dHNTdHIpIHtcbiAgICAgICAgc2VsZi5faW5pdEdyaWRDb25maWcoKVxuXG4gICAgICAgIHZhciBkYXRhUm93ID0gc2VsZi5vcHRpb25zLmRhdGFTb3VyY2U/LnJvdz8uZmluZChyb3cgPT4gcm93W3NlbGYub3B0aW9ucy5yZXR1cm5Db2xdID09PSByZXR1cm5WYWx1ZSk7XG5cbiAgICAgICAgc2VsZi5vcHRpb25zLmFkZGl0aW9uYWxPdXRwdXRzU3RyLnNwbGl0KCcsJykuZm9yRWFjaChzdHIgPT4ge1xuICAgICAgICAgIHZhciBkYXRhS2V5ID0gc3RyLnNwbGl0KCc6JylbMF07XG4gICAgICAgICAgdmFyIGl0ZW1JZCA9IHN0ci5zcGxpdCgnOicpWzFdO1xuICAgICAgICAgIHZhciBjb2x1bW47XG4gICAgICAgICAgaWYgKHNlbGYuX2dyaWQpIHtcbiAgICAgICAgICAgIGNvbHVtbiA9IHNlbGYuX2dyaWQuZ2V0Q29sdW1ucygpPy5maW5kKGNvbCA9PiBpdGVtSWQ/LmluY2x1ZGVzKGNvbC5wcm9wZXJ0eSkpXG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBhZGRpdGlvbmFsSXRlbSA9IGFwZXguaXRlbShjb2x1bW4gPyBjb2x1bW4uZWxlbWVudElkIDogaXRlbUlkKTtcblxuICAgICAgICAgIGlmIChpdGVtSWQgJiYgZGF0YUtleSAmJiBhZGRpdGlvbmFsSXRlbSkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gT2JqZWN0LmtleXMoZGF0YVJvdyB8fCB7fSkuZmluZChrID0+IGsudG9VcHBlckNhc2UoKSA9PT0gZGF0YUtleSk7XG4gICAgICAgICAgICBpZiAoZGF0YVJvdyAmJiBkYXRhUm93W2tleV0pIHtcbiAgICAgICAgICAgICAgYWRkaXRpb25hbEl0ZW0uc2V0VmFsdWUoZGF0YVJvd1trZXldLCBkYXRhUm93W2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWRkaXRpb25hbEl0ZW0uc2V0VmFsdWUoJycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfdHJpZ2dlckxPVk9uRGlzcGxheTogZnVuY3Rpb24gKGNhbGxlZEZyb20gPSBudWxsKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgaWYgKGNhbGxlZEZyb20pIHtcbiAgICAgICAgYXBleC5kZWJ1Zy50cmFjZSgnX3RyaWdnZXJMT1ZPbkRpc3BsYXkgY2FsbGVkIGZyb20gXCInICsgY2FsbGVkRnJvbSArICdcIicpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLm9wdGlvbnMucmVhZE9ubHkgPSAkKCcjJyArIHNlbGYub3B0aW9ucy5pdGVtTmFtZSkucHJvcCgncmVhZE9ubHknKVxuICAgICAgICB8fCAkKCcjJyArIHNlbGYub3B0aW9ucy5pdGVtTmFtZSkucHJvcCgnZGlzYWJsZWQnKTtcblxuICAgICAgLy8gVHJpZ2dlciBldmVudCBvbiBjbGljayBvdXRzaWRlIGVsZW1lbnRcbiAgICAgICQoZG9jdW1lbnQpLm1vdXNlZG93bihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgc2VsZi5faXRlbSQub2ZmKCdrZXlkb3duJylcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZWRvd24nKVxuXG4gICAgICAgIHZhciAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgIGlmICghJHRhcmdldC5jbG9zZXN0KCcjJyArIHNlbGYub3B0aW9ucy5pdGVtTmFtZSkubGVuZ3RoICYmICFzZWxmLl9pdGVtJC5pcygnOmZvY3VzJykpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDEgLSBub3QgZm9jdXNlZCBjbGljayBvZmYnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHRhcmdldC5jbG9zZXN0KCcjJyArIHNlbGYub3B0aW9ucy5pdGVtTmFtZSkubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDAyIC0gY2xpY2sgb24gaW5wdXQnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHRhcmdldC5jbG9zZXN0KCcjJyArIHNlbGYub3B0aW9ucy5zZWFyY2hCdXR0b24pLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwMyAtIGNsaWNrIG9uIHNlYXJjaDogJyArIHNlbGYuX2l0ZW0kLnZhbCgpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHRhcmdldC5jbG9zZXN0KCcuZmNzLXNlYXJjaC1jbGVhcicpLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwNCAtIGNsaWNrIG9uIGNsZWFyJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9pdGVtJC52YWwoKSkge1xuICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAwNSAtIG5vIGl0ZW1zJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYuX2l0ZW0kLnZhbCgpLnRvVXBwZXJDYXNlKCkgPT09IGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmdldFZhbHVlKCkudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAxMCAtIGNsaWNrIG5vIGNoYW5nZScpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NsaWNrIG9mZiAtIGNoZWNrIHZhbHVlJylcbiAgICAgICAgc2VsZi5fZ2V0RGF0YSh7XG4gICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgZmlyc3RSb3c6IDEsXG4gICAgICAgICAgLy8gbG9hZGluZ0luZGljYXRvcjogc2VsZi5fbW9kYWxMb2FkaW5nSW5kaWNhdG9yXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoc2VsZi5fdGVtcGxhdGVEYXRhLnBhZ2luYXRpb25bJ3Jvd0NvdW50J10gPT09IDEpIHtcbiAgICAgICAgICAgIC8vIDEgdmFsaWQgb3B0aW9uIG1hdGNoZXMgdGhlIHNlYXJjaC4gVXNlIHZhbGlkIG9wdGlvbi5cbiAgICAgICAgICAgIHNlbGYuX3NldEl0ZW1WYWx1ZXMoc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzWzBdLnJldHVyblZhbCk7XG4gICAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDYgLSBjbGljayBvZmYgbWF0Y2ggZm91bmQnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPcGVuIHRoZSBtb2RhbFxuICAgICAgICAgICAgc2VsZi5fb3BlbkxPVih7XG4gICAgICAgICAgICAgIHNlYXJjaFRlcm06IHNlbGYuX2l0ZW0kLnZhbCgpLFxuICAgICAgICAgICAgICBmaWxsU2VhcmNoVGV4dDogdHJ1ZSxcbiAgICAgICAgICAgICAgYWZ0ZXJEYXRhOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHNlbGYuX29uTG9hZChvcHRpb25zKVxuICAgICAgICAgICAgICAgIC8vIENsZWFyIGlucHV0IGFzIHNvb24gYXMgbW9kYWwgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9ICcnXG4gICAgICAgICAgICAgICAgc2VsZi5faXRlbSQudmFsKCcnKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgLy8gVHJpZ2dlciBldmVudCBvbiB0YWIgb3IgZW50ZXJcbiAgICAgIHNlbGYuX2l0ZW0kLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5faXRlbSQub2ZmKCdrZXlkb3duJylcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZWRvd24nKVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdrZXlkb3duJywgZS5rZXlDb2RlKVxuXG4gICAgICAgIGlmICgoZS5rZXlDb2RlID09PSA5ICYmICEhc2VsZi5faXRlbSQudmFsKCkpIHx8IGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAvLyBObyBjaGFuZ2VzLCBubyBmdXJ0aGVyIHByb2Nlc3NpbmcgKGlmIG5vdCBlbnRlciBwcmVzcyBvbiBlbXB0eSBpbnB1dCkuXG4gICAgICAgICAgaWYgKHNlbGYuX2l0ZW0kLnZhbCgpLnRvVXBwZXJDYXNlKCkgPT09IGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmdldFZhbHVlKCkudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgJiYgIShlLmtleUNvZGUgPT09IDEzICYmICFzZWxmLl9pdGVtJC52YWwoKSkpIHtcbiAgICAgICAgICAgIHNlbGYuX3RyaWdnZXJMT1ZPbkRpc3BsYXkoJzAxMSAtIGtleSBubyBjaGFuZ2UnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDkpIHtcbiAgICAgICAgICAgIC8vIFN0b3AgdGFiIGV2ZW50XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIC8vIFN0b3AgZW50ZXIgZXZlbnRcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2tleWRvd24gdGFiIG9yIGVudGVyIC0gY2hlY2sgdmFsdWUnKVxuICAgICAgICAgIHNlbGYuX2dldERhdGEoe1xuICAgICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCksXG4gICAgICAgICAgICBmaXJzdFJvdzogMSxcbiAgICAgICAgICAgIC8vIGxvYWRpbmdJbmRpY2F0b3I6IHNlbGYuX21vZGFsTG9hZGluZ0luZGljYXRvclxuICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLl90ZW1wbGF0ZURhdGEucGFnaW5hdGlvblsncm93Q291bnQnXSA9PT0gMSkge1xuICAgICAgICAgICAgICBzZWxmLl9pbml0R3JpZENvbmZpZygpO1xuICAgICAgICAgICAgICBjb25zdCBwcmV2VmFsaWRpdHkgPSBzZWxmLl9yZW1vdmVDaGlsZFZhbGlkYXRpb24oKTtcblxuICAgICAgICAgICAgICAvLyAxIHZhbGlkIG9wdGlvbiBtYXRjaGVzIHRoZSBzZWFyY2guIFVzZSB2YWxpZCBvcHRpb24uXG4gICAgICAgICAgICAgIHNlbGYuX3NldEl0ZW1WYWx1ZXMoc2VsZi5fdGVtcGxhdGVEYXRhLnJlcG9ydC5yb3dzWzBdLnJldHVyblZhbCk7XG4gICAgICAgICAgICAgIHNlbGYuX3Jlc2V0Rm9jdXMoKTtcbiAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLm5leHRPbkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLl9mb2N1c05leHRFbGVtZW50KHNlbGYuX2lnJCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCkge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pc1ByZXZJbmRleCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZvY3VzUHJldkVsZW1lbnQoc2VsZi5faWckKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9mb2N1c05leHRFbGVtZW50KHNlbGYuX2lnJCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VsZi5fcmVzdG9yZUNoaWxkVmFsaWRhdGlvbihwcmV2VmFsaWRpdHkpO1xuICAgICAgICAgICAgICBzZWxmLl90cmlnZ2VyTE9WT25EaXNwbGF5KCcwMDcgLSBrZXkgb2ZmIG1hdGNoIGZvdW5kJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBtb2RhbFxuICAgICAgICAgICAgICBzZWxmLl9vcGVuTE9WKHtcbiAgICAgICAgICAgICAgICBzZWFyY2hUZXJtOiBzZWxmLl9pdGVtJC52YWwoKSxcbiAgICAgICAgICAgICAgICBmaWxsU2VhcmNoVGV4dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhZnRlckRhdGE6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLl9vbkxvYWQob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgIC8vIENsZWFyIGlucHV0IGFzIHNvb24gYXMgbW9kYWwgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICAgIHNlbGYuX3JldHVyblZhbHVlID0gJydcbiAgICAgICAgICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbCgnJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fdHJpZ2dlckxPVk9uRGlzcGxheSgnMDA4IC0ga2V5IGRvd24nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlQ2hpbGRWYWxpZGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgY29uc3QgcHJldlZhbGlkYXRpb25zID0gW107XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMuY2hpbGRDb2x1bW5zU3RyKSB7XG4gICAgICAgIHNlbGYub3B0aW9ucy5jaGlsZENvbHVtbnNTdHIuc3BsaXQoJywnKS5mb3JFYWNoKGNvbE5hbWUgPT4ge1xuICAgICAgICAgIHZhciBjb2x1bW5JZCA9IHNlbGYuX2dyaWQuZ2V0Q29sdW1ucygpPy5maW5kKGNvbCA9PiBjb2xOYW1lPy5pbmNsdWRlcyhjb2wucHJvcGVydHkpKT8uZWxlbWVudElkO1xuICAgICAgICAgIHZhciBjb2x1bW4gPSBzZWxmLl9pZyQuaW50ZXJhY3RpdmVHcmlkKCdvcHRpb24nKS5jb25maWcuY29sdW1ucy5maW5kKGNvbCA9PiBjb2wuc3RhdGljSWQgPT09IGNvbHVtbklkKTtcbiAgICAgICAgICB2YXIgaXRlbSA9IGFwZXguaXRlbShjb2x1bW5JZCk7XG4gICAgICAgICAgYXBleC5kZWJ1Zy50cmFjZSgnZm91bmQgY2hpbGQgY29sdW1uJywgY29sdW1uKTtcbiAgICAgICAgICAvLyBEb24ndCB0dXJuIG9mZiB2YWxpZGF0aW9uIGlmIHRoZSBpdGVtIGhhcyBhIHZhbHVlLlxuICAgICAgICAgIGlmICghaXRlbSB8fCAhY29sdW1uIHx8IChpdGVtICYmIGl0ZW0uZ2V0VmFsdWUoKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gU2F2ZSBwcmV2aW91cyBzdGF0ZS5cbiAgICAgICAgICBwcmV2VmFsaWRhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBpZDogY29sdW1uSWQsXG4gICAgICAgICAgICBpc1JlcXVpcmVkOiBjb2x1bW4/LnZhbGlkYXRpb24uaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIHZhbGlkaXR5OiBhcGV4Lml0ZW0oY29sdW1uSWQpLmdldFZhbGlkaXR5LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIFR1cm4gb2ZmIHZhbGlkYXRpb25cbiAgICAgICAgICBjb2x1bW4udmFsaWRhdGlvbi5pc1JlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgaXRlbS5nZXRWYWxpZGl0eSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgdmFsaWQ6IHRydWUgfTt9O1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZWYWxpZGF0aW9ucztcbiAgICB9LFxuXG4gICAgX3Jlc3RvcmVDaGlsZFZhbGlkYXRpb246IGZ1bmN0aW9uIChwcmV2VmFsaWRhdGlvbnMpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICBwcmV2VmFsaWRhdGlvbnM/LmZvckVhY2goKHsgaWQsIGlzUmVxdWlyZWQsIHZhbGlkaXR5IH0pID0+IHtcbiAgICAgICAgc2VsZi5faWckLmludGVyYWN0aXZlR3JpZCgnb3B0aW9uJykuY29uZmlnLmNvbHVtbnMuZmluZChjb2wgPT4gY29sLnN0YXRpY0lkID09PSBpZCkudmFsaWRhdGlvbi5pc1JlcXVpcmVkID0gaXNSZXF1aXJlZDtcbiAgICAgICAgYXBleC5pdGVtKGlkKS5nZXRWYWxpZGl0eSA9IHZhbGlkaXR5O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF90cmlnZ2VyTE9WT25CdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gVHJpZ2dlciBldmVudCBvbiBjbGljayBpbnB1dCBncm91cCBhZGRvbiBidXR0b24gKG1hZ25pZmllciBnbGFzcylcbiAgICAgIHNlbGYuX3NlYXJjaEJ1dHRvbiQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5fb3BlbkxPVih7XG4gICAgICAgICAgc2VhcmNoVGVybTogc2VsZi5faXRlbSQudmFsKCkgfHwgJycsXG4gICAgICAgICAgZmlsbFNlYXJjaFRleHQ6IHRydWUsXG4gICAgICAgICAgYWZ0ZXJEYXRhOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgc2VsZi5fb25Mb2FkKG9wdGlvbnMpXG4gICAgICAgICAgICAvLyBDbGVhciBpbnB1dCBhcyBzb29uIGFzIG1vZGFsIGlzIHJlYWR5XG4gICAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9ICcnXG4gICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwoJycpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9vblJvd0hvdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5vbignbW91c2VlbnRlciBtb3VzZWxlYXZlJywgJy50LVJlcG9ydC1yZXBvcnQgdGJvZHkgdHInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdtYXJrJykpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKHNlbGYub3B0aW9ucy5ob3ZlckNsYXNzZXMpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfc2VsZWN0SW5pdGlhbFJvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBJZiBjdXJyZW50IGl0ZW0gaW4gTE9WIHRoZW4gc2VsZWN0IHRoYXQgcm93XG4gICAgICAvLyBFbHNlIHNlbGVjdCBmaXJzdCByb3cgb2YgcmVwb3J0XG4gICAgICB2YXIgJGN1clJvdyA9IHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1SZXBvcnQtcmVwb3J0IHRyW2RhdGEtcmV0dXJuPVwiJyArIHNlbGYuX3JldHVyblZhbHVlICsgJ1wiXScpXG4gICAgICBpZiAoJGN1clJvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgICRjdXJSb3cuYWRkQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5maW5kKCcudC1SZXBvcnQtcmVwb3J0IHRyW2RhdGEtcmV0dXJuXScpLmZpcnN0KCkuYWRkQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRLZXlib2FyZE5hdmlnYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICBmdW5jdGlvbiBuYXZpZ2F0ZShkaXJlY3Rpb24sIGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdmFyIGN1cnJlbnRSb3cgPSBzZWxmLl9tb2RhbERpYWxvZyQuZmluZCgnLnQtUmVwb3J0LXJlcG9ydCB0ci5tYXJrJylcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBpZiAoJChjdXJyZW50Um93KS5wcmV2KCkuaXMoJy50LVJlcG9ydC1yZXBvcnQgdHInKSkge1xuICAgICAgICAgICAgICAkKGN1cnJlbnRSb3cpLnJlbW92ZUNsYXNzKCdtYXJrICcgKyBzZWxmLm9wdGlvbnMubWFya0NsYXNzZXMpLnByZXYoKS5hZGRDbGFzcygnbWFyayAnICsgc2VsZi5vcHRpb25zLm1hcmtDbGFzc2VzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIGlmICgkKGN1cnJlbnRSb3cpLm5leHQoKS5pcygnLnQtUmVwb3J0LXJlcG9ydCB0cicpKSB7XG4gICAgICAgICAgICAgICQoY3VycmVudFJvdykucmVtb3ZlQ2xhc3MoJ21hcmsgJyArIHNlbGYub3B0aW9ucy5tYXJrQ2xhc3NlcykubmV4dCgpLmFkZENsYXNzKCdtYXJrICcgKyBzZWxmLm9wdGlvbnMubWFya0NsYXNzZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICQod2luZG93LnRvcC5kb2N1bWVudCkub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXG4gICAgICAgICAgICBuYXZpZ2F0ZSgndXAnLCBlKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnZG93bicsIGUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4gICAgICAgICAgICBuYXZpZ2F0ZSgnZG93bicsIGUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICBpZiAoIXNlbGYuX2FjdGl2ZURlbGF5KSB7XG4gICAgICAgICAgICAgIHZhciBjdXJyZW50Um93ID0gc2VsZi5fbW9kYWxEaWFsb2ckLmZpbmQoJy50LVJlcG9ydC1yZXBvcnQgdHIubWFyaycpLmZpcnN0KClcbiAgICAgICAgICAgICAgc2VsZi5fcmV0dXJuU2VsZWN0ZWRSb3coY3VycmVudFJvdylcbiAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLnJldHVybk9uRW50ZXJLZXkgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzM6IC8vIFBhZ2UgdXBcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgc2VsZi5fdG9wQXBleC5qUXVlcnkoJyMnICsgc2VsZi5vcHRpb25zLmlkICsgJyAudC1CdXR0b25SZWdpb24tYnV0dG9ucyAudC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLXByZXYnKS50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzQ6IC8vIFBhZ2UgZG93blxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBzZWxmLl90b3BBcGV4LmpRdWVyeSgnIycgKyBzZWxmLm9wdGlvbnMuaWQgKyAnIC50LUJ1dHRvblJlZ2lvbi1idXR0b25zIC50LVJlcG9ydC1wYWdpbmF0aW9uTGluay0tbmV4dCcpLnRyaWdnZXIoJ2NsaWNrJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9yZXR1cm5TZWxlY3RlZFJvdzogZnVuY3Rpb24gKCRyb3cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAvLyBEbyBub3RoaW5nIGlmIHJvdyBkb2VzIG5vdCBleGlzdFxuICAgICAgaWYgKCEkcm93IHx8ICRyb3cubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhcGV4Lml0ZW0oc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5zZXRWYWx1ZShzZWxmLl91bmVzY2FwZSgkcm93LmRhdGEoJ3JldHVybicpLnRvU3RyaW5nKCkpLCBzZWxmLl91bmVzY2FwZSgkcm93LmRhdGEoJ2Rpc3BsYXknKSkpXG5cblxuICAgICAgLy8gVHJpZ2dlciBhIGN1c3RvbSBldmVudCBhbmQgYWRkIGRhdGEgdG8gaXQ6IGFsbCBjb2x1bW5zIG9mIHRoZSByb3dcbiAgICAgIHZhciBkYXRhID0ge31cbiAgICAgICQuZWFjaCgkKCcudC1SZXBvcnQtcmVwb3J0IHRyLm1hcmsnKS5maW5kKCd0ZCcpLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgZGF0YVskKHZhbCkuYXR0cignaGVhZGVycycpXSA9ICQodmFsKS5odG1sKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmFsbHkgaGlkZSB0aGUgbW9kYWxcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5kaWFsb2coJ2Nsb3NlJylcbiAgICB9LFxuXG4gICAgX29uUm93U2VsZWN0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLy8gQWN0aW9uIHdoZW4gcm93IGlzIGNsaWNrZWRcbiAgICAgIHNlbGYuX21vZGFsRGlhbG9nJC5vbignY2xpY2snLCAnLm1vZGFsLWxvdi10YWJsZSAudC1SZXBvcnQtcmVwb3J0IHRib2R5IHRyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5fcmV0dXJuU2VsZWN0ZWRSb3coc2VsZi5fdG9wQXBleC5qUXVlcnkodGhpcykpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlVmFsaWRhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQ2xlYXIgY3VycmVudCBlcnJvcnNcbiAgICAgIGFwZXgubWVzc2FnZS5jbGVhckVycm9ycyh0aGlzLm9wdGlvbnMuaXRlbU5hbWUpXG4gICAgfSxcblxuICAgIF9jbGVhcklucHV0OiBmdW5jdGlvbiAoZG9Gb2N1cyA9IHRydWUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgc2VsZi5fc2V0SXRlbVZhbHVlcygnJylcbiAgICAgIHNlbGYuX3JldHVyblZhbHVlID0gJydcbiAgICAgIHNlbGYuX3JlbW92ZVZhbGlkYXRpb24oKVxuICAgICAgaWYgKGRvRm9jdXMgJiYgIXNlbGYub3B0aW9ucz8ucmVhZE9ubHkpIHtcbiAgICAgICAgc2VsZi5faXRlbSQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRDbGVhcklucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgc2VsZi5fY2xlYXJJbnB1dCQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9jbGVhcklucHV0KClcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9pbml0Q2FzY2FkaW5nTE9WczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAkKHNlbGYub3B0aW9ucy5jYXNjYWRpbmdJdGVtcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5fY2xlYXJJbnB1dChmYWxzZSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9zZXRWYWx1ZUJhc2VkT25EaXNwbGF5OiBmdW5jdGlvbiAocFZhbHVlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgICAgdmFyIHByb21pc2UgPSBhcGV4LnNlcnZlci5wbHVnaW4oc2VsZi5vcHRpb25zLmFqYXhJZGVudGlmaWVyLCB7XG4gICAgICAgIHgwMTogJ0dFVF9WQUxVRScsXG4gICAgICAgIHgwMjogcFZhbHVlLCAvLyByZXR1cm5WYWxcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgbG9hZGluZ0luZGljYXRvcjogJC5wcm94eShzZWxmLl9pdGVtTG9hZGluZ0luZGljYXRvciwgc2VsZiksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICAgIHNlbGYuX2Rpc2FibGVDaGFuZ2VFdmVudCA9IGZhbHNlXG4gICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSBwRGF0YS5yZXR1cm5WYWx1ZVxuICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbChwRGF0YS5kaXNwbGF5VmFsdWUpXG4gICAgICAgICAgc2VsZi5faXRlbSQudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHByb21pc2VcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHBEYXRhKSB7XG4gICAgICAgICAgc2VsZi5fcmV0dXJuVmFsdWUgPSBwRGF0YS5yZXR1cm5WYWx1ZVxuICAgICAgICAgIHNlbGYuX2l0ZW0kLnZhbChwRGF0YS5kaXNwbGF5VmFsdWUpXG4gICAgICAgICAgc2VsZi5faXRlbSQudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICAgfSlcbiAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fZGlzYWJsZUNoYW5nZUV2ZW50ID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2luaXRBcGV4SXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAvLyBTZXQgYW5kIGdldCB2YWx1ZSB2aWEgYXBleCBmdW5jdGlvbnNcbiAgICAgIGFwZXguaXRlbS5jcmVhdGUoc2VsZi5vcHRpb25zLml0ZW1OYW1lLCB7XG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX2l0ZW0kLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgc2VsZi5fc2VhcmNoQnV0dG9uJC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgICAgIHNlbGYuX2NsZWFySW5wdXQkLnNob3coKVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5faXRlbSQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgIHNlbGYuX3NlYXJjaEJ1dHRvbiQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgIHNlbGYuX2NsZWFySW5wdXQkLmhpZGUoKVxuICAgICAgICB9LFxuICAgICAgICBpc0Rpc2FibGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX2l0ZW0kLnByb3AoJ2Rpc2FibGVkJylcbiAgICAgICAgfSxcbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX2l0ZW0kLnNob3coKVxuICAgICAgICAgIHNlbGYuX3NlYXJjaEJ1dHRvbiQuc2hvdygpXG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9pdGVtJC5oaWRlKClcbiAgICAgICAgICBzZWxmLl9zZWFyY2hCdXR0b24kLmhpZGUoKVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFZhbHVlOiBmdW5jdGlvbiAocFZhbHVlLCBwRGlzcGxheVZhbHVlLCBwU3VwcHJlc3NDaGFuZ2VFdmVudCkge1xuICAgICAgICAgIGlmIChwRGlzcGxheVZhbHVlIHx8ICFwVmFsdWUgfHwgcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gQXNzdW1pbmcgbm8gY2hlY2sgaXMgbmVlZGVkIHRvIHNlZSBpZiB0aGUgdmFsdWUgaXMgaW4gdGhlIExPVlxuICAgICAgICAgICAgc2VsZi5faXRlbSQudmFsKHBEaXNwbGF5VmFsdWUpXG4gICAgICAgICAgICBzZWxmLl9yZXR1cm5WYWx1ZSA9IHBWYWx1ZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLl9pdGVtJC52YWwocERpc3BsYXlWYWx1ZSlcbiAgICAgICAgICAgIHNlbGYuX2Rpc2FibGVDaGFuZ2VFdmVudCA9IHRydWVcbiAgICAgICAgICAgIHNlbGYuX3NldFZhbHVlQmFzZWRPbkRpc3BsYXkocFZhbHVlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBBbHdheXMgcmV0dXJuIGF0IGxlYXN0IGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXR1cm5WYWx1ZSB8fCAnJ1xuICAgICAgICB9LFxuICAgICAgICBpc0NoYW5nZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5vcHRpb25zLml0ZW1OYW1lKS52YWx1ZSAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5vcHRpb25zLml0ZW1OYW1lKS5kZWZhdWx0VmFsdWVcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAvLyBPcmlnaW5hbCBKUyBmb3IgdXNlIGJlZm9yZSBBUEVYIDIwLjJcbiAgICAgIC8vIGFwZXguaXRlbShzZWxmLm9wdGlvbnMuaXRlbU5hbWUpLmNhbGxiYWNrcy5kaXNwbGF5VmFsdWVGb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAgIHJldHVybiBzZWxmLl9pdGVtJC52YWwoKVxuICAgICAgLy8gfVxuICAgICAgLy8gTmV3IEpTIGZvciBwb3N0IEFQRVggMjAuMiB3b3JsZFxuICAgICAgYXBleC5pdGVtKHNlbGYub3B0aW9ucy5pdGVtTmFtZSkuZGlzcGxheVZhbHVlRm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5faXRlbSQudmFsKClcbiAgICAgIH1cblxuICAgICAgLy8gT25seSB0cmlnZ2VyIHRoZSBjaGFuZ2UgZXZlbnQgYWZ0ZXIgdGhlIEFzeW5jIGNhbGxiYWNrIGlmIG5lZWRlZFxuICAgICAgc2VsZi5faXRlbSRbJ3RyaWdnZXInXSA9IGZ1bmN0aW9uICh0eXBlLCBkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnY2hhbmdlJyAmJiBzZWxmLl9kaXNhYmxlQ2hhbmdlRXZlbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAkLmZuLnRyaWdnZXIuY2FsbChzZWxmLl9pdGVtJCwgdHlwZSwgZGF0YSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2l0ZW1Mb2FkaW5nSW5kaWNhdG9yOiBmdW5jdGlvbiAobG9hZGluZ0luZGljYXRvcikge1xuICAgICAgJCgnIycgKyB0aGlzLm9wdGlvbnMuc2VhcmNoQnV0dG9uKS5hZnRlcihsb2FkaW5nSW5kaWNhdG9yKVxuICAgICAgcmV0dXJuIGxvYWRpbmdJbmRpY2F0b3JcbiAgICB9LFxuXG4gICAgX21vZGFsTG9hZGluZ0luZGljYXRvcjogZnVuY3Rpb24gKGxvYWRpbmdJbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuX21vZGFsRGlhbG9nJC5wcmVwZW5kKGxvYWRpbmdJbmRpY2F0b3IpXG4gICAgICByZXR1cm4gbG9hZGluZ0luZGljYXRvclxuICAgIH0sXG4gIH0pXG59KShhcGV4LmpRdWVyeSwgd2luZG93KVxuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzgsXCI+PSA0LjMuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGFsaWFzMj1jb250YWluZXIuaG9va3MuaGVscGVyTWlzc2luZywgYWxpYXMzPVwiZnVuY3Rpb25cIiwgYWxpYXM0PWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBhbGlhczU9Y29udGFpbmVyLmxhbWJkYSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiPGRpdiBpZD1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiaWRcIikgfHwgKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwiaWRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjo5fSxcImVuZFwiOntcImxpbmVcIjoxLFwiY29sdW1uXCI6MTV9fX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcInQtRGlhbG9nUmVnaW9uIGpzLXJlZ2llb25EaWFsb2cgdC1Gb3JtLS1zdHJldGNoSW5wdXRzIHQtRm9ybS0tbGFyZ2UgbW9kYWwtbG92XFxcIiB0aXRsZT1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwidGl0bGVcIikgfHwgKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwidGl0bGVcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjoxMTB9LFwiZW5kXCI6e1wibGluZVwiOjEsXCJjb2x1bW5cIjoxMTl9fX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInQtRGlhbG9nUmVnaW9uLWJvZHkganMtcmVnaW9uRGlhbG9nLWJvZHkgbm8tcGFkZGluZ1xcXCIgXCJcbiAgICArICgoc3RhY2sxID0gYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmVnaW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcImF0dHJpYnV0ZXNcIikgOiBzdGFjazEpLCBkZXB0aDApKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wgY29sLTEyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtUmVwb3J0IHQtUmVwb3J0LS1hbHRSb3dzRGVmYXVsdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1SZXBvcnQtd3JhcFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1Gb3JtLWZpZWxkQ29udGFpbmVyIHQtRm9ybS1maWVsZENvbnRhaW5lci0tc3RhY2tlZCB0LUZvcm0tZmllbGRDb250YWluZXItLXN0cmV0Y2hJbnB1dHMgbWFyZ2luLXRvcC1zbVxcXCIgaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwic2VhcmNoRmllbGRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiaWRcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJfQ09OVEFJTkVSXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtRm9ybS1pbnB1dENvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidC1Gb3JtLWl0ZW1XcmFwcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJhcGV4LWl0ZW0tdGV4dCBtb2RhbC1sb3YtaXRlbSBcIlxuICAgICsgYWxpYXM0KGFsaWFzNSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInNlYXJjaEZpZWxkXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInRleHRDYXNlXCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiIFxcXCIgaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoYWxpYXM1KCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwic2VhcmNoRmllbGRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiaWRcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJcXFwiIGF1dG9jb21wbGV0ZT1cXFwib2ZmXFxcIiBwbGFjZWhvbGRlcj1cXFwiXCJcbiAgICArIGFsaWFzNChhbGlhczUoKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJzZWFyY2hGaWVsZFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJwbGFjZWhvbGRlclwiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwiUDExMTBfWkFBTF9GS19DT0RFX0JVVFRPTlxcXCIgY2xhc3M9XFxcImEtQnV0dG9uIGZjcy1tb2RhbC1sb3YtYnV0dG9uIGEtQnV0dG9uLS1wb3B1cExPVlxcXCIgdGFiSW5kZXg9XFxcIi0xXFxcIiBzdHlsZT1cXFwibWFyZ2luLWxlZnQ6LTQwcHg7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCk7XFxcIiBkaXNhYmxlZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJmYSBmYS1zZWFyY2hcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5pbnZva2VQYXJ0aWFsKGxvb2t1cFByb3BlcnR5KHBhcnRpYWxzLFwicmVwb3J0XCIpLGRlcHRoMCx7XCJuYW1lXCI6XCJyZXBvcnRcIixcImRhdGFcIjpkYXRhLFwiaW5kZW50XCI6XCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsXCJoZWxwZXJzXCI6aGVscGVycyxcInBhcnRpYWxzXCI6cGFydGlhbHMsXCJkZWNvcmF0b3JzXCI6Y29udGFpbmVyLmRlY29yYXRvcnN9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0LURpYWxvZ1JlZ2lvbi1idXR0b25zIGpzLXJlZ2lvbkRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInQtQnV0dG9uUmVnaW9uIHQtQnV0dG9uUmVnaW9uLS1kaWFsb2dSZWdpb25cXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInQtQnV0dG9uUmVnaW9uLXdyYXBcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5pbnZva2VQYXJ0aWFsKGxvb2t1cFByb3BlcnR5KHBhcnRpYWxzLFwicGFnaW5hdGlvblwiKSxkZXB0aDAse1wibmFtZVwiOlwicGFnaW5hdGlvblwiLFwiZGF0YVwiOmRhdGEsXCJpbmRlbnRcIjpcIiAgICAgICAgICAgICAgICBcIixcImhlbHBlcnNcIjpoZWxwZXJzLFwicGFydGlhbHNcIjpwYXJ0aWFscyxcImRlY29yYXRvcnNcIjpjb250YWluZXIuZGVjb3JhdG9yc30pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCI7XG59LFwidXNlUGFydGlhbFwiOnRydWUsXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLCBhbGlhczI9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMzPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1jb2wgdC1CdXR0b25SZWdpb24tY29sLS1sZWZ0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidC1CdXR0b25SZWdpb24tYnV0dG9uc1xcXCI+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImlmXCIpLmNhbGwoYWxpYXMxLCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJhbGxvd1ByZXZcIikgOiBzdGFjazEpLHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDIsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjo0LFwiY29sdW1uXCI6Nn0sXCJlbmRcIjp7XCJsaW5lXCI6OCxcImNvbHVtblwiOjEzfX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1jb2wgdC1CdXR0b25SZWdpb24tY29sLS1jZW50ZXJcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXG4gIFwiXG4gICAgKyBhbGlhczMoYWxpYXMyKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJmaXJzdFJvd1wiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIiAtIFwiXG4gICAgKyBhbGlhczMoYWxpYXMyKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJsYXN0Um93XCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwidC1CdXR0b25SZWdpb24tY29sIHQtQnV0dG9uUmVnaW9uLWNvbC0tcmlnaHRcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0LUJ1dHRvblJlZ2lvbi1idXR0b25zXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiaWZcIikuY2FsbChhbGlhczEsKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJwYWdpbmF0aW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcImFsbG93TmV4dFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjE2LFwiY29sdW1uXCI6Nn0sXCJlbmRcIjp7XCJsaW5lXCI6MjAsXCJjb2x1bW5cIjoxM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiICAgICAgICA8YSBocmVmPVxcXCJqYXZhc2NyaXB0OnZvaWQoMCk7XFxcIiBjbGFzcz1cXFwidC1CdXR0b24gdC1CdXR0b24tLXNtYWxsIHQtQnV0dG9uLS1ub1VJIHQtUmVwb3J0LXBhZ2luYXRpb25MaW5rIHQtUmVwb3J0LXBhZ2luYXRpb25MaW5rLS1wcmV2XFxcIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImEtSWNvbiBpY29uLWxlZnQtYXJyb3dcXFwiPjwvc3Bhbj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInBhZ2luYXRpb25cIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwicHJldmlvdXNcIikgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCJcXG4gICAgICAgIDwvYT5cXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgICAgIDxhIGhyZWY9XFxcImphdmFzY3JpcHQ6dm9pZCgwKTtcXFwiIGNsYXNzPVxcXCJ0LUJ1dHRvbiB0LUJ1dHRvbi0tc21hbGwgdC1CdXR0b24tLW5vVUkgdC1SZXBvcnQtcGFnaW5hdGlvbkxpbmsgdC1SZXBvcnQtcGFnaW5hdGlvbkxpbmstLW5leHRcXFwiPlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbihjb250YWluZXIubGFtYmRhKCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicGFnaW5hdGlvblwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJuZXh0XCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJhLUljb24gaWNvbi1yaWdodC1hcnJvd1xcXCI+PC9zcGFuPlxcbiAgICAgICAgPC9hPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzgsXCI+PSA0LjMuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJwYWdpbmF0aW9uXCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInJvd0NvdW50XCIpIDogc3RhY2sxKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MSxcImNvbHVtblwiOjB9LFwiZW5kXCI6e1wibGluZVwiOjIzLFwiY29sdW1uXCI6N319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgb3B0aW9ucywgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9LCBidWZmZXIgPSBcbiAgXCIgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIHN1bW1hcnk9XFxcIlxcXCIgY2xhc3M9XFxcInQtUmVwb3J0LXJlcG9ydCBcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJjbGFzc2VzXCIpIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiXFxcIiB3aWR0aD1cXFwiMTAwJVxcXCI+XFxuICAgICAgICAgICAgICA8dGJvZHk+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImlmXCIpLmNhbGwoYWxpYXMxLCgoc3RhY2sxID0gKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmVwb3J0XCIpIDogZGVwdGgwKSkgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KHN0YWNrMSxcInNob3dIZWFkZXJzXCIpIDogc3RhY2sxKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MTIsXCJjb2x1bW5cIjoxNn0sXCJlbmRcIjp7XCJsaW5lXCI6MjQsXCJjb2x1bW5cIjoyM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcInJlcG9ydFwiKSB8fCAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJyZXBvcnRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogY29udGFpbmVyLmhvb2tzLmhlbHBlck1pc3NpbmcpLChvcHRpb25zPXtcIm5hbWVcIjpcInJlcG9ydFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSg4LCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MjUsXCJjb2x1bW5cIjoxNn0sXCJlbmRcIjp7XCJsaW5lXCI6MjgsXCJjb2x1bW5cIjoyN319fSksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGFsaWFzMSxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJyZXBvcnRcIikpIHsgc3RhY2sxID0gY29udGFpbmVyLmhvb2tzLmJsb2NrSGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIiAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgIDx0aGVhZD5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJyZXBvcnRcIikgOiBkZXB0aDApKSAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoc3RhY2sxLFwiY29sdW1uc1wiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgzLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MTQsXCJjb2x1bW5cIjoyMH0sXCJlbmRcIjp7XCJsaW5lXCI6MjIsXCJjb2x1bW5cIjoyOX19fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxcblwiO1xufSxcIjNcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XFxcInQtUmVwb3J0LWNvbEhlYWRcXFwiIGlkPVxcXCJcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcImtleVwiKSB8fCAoZGF0YSAmJiBsb29rdXBQcm9wZXJ0eShkYXRhLFwia2V5XCIpKSkgIT0gbnVsbCA/IGhlbHBlciA6IGNvbnRhaW5lci5ob29rcy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImtleVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjoxNSxcImNvbHVtblwiOjU1fSxcImVuZFwiOntcImxpbmVcIjoxNSxcImNvbHVtblwiOjYzfX19KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGFsaWFzMSwoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJsYWJlbFwiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLnByb2dyYW0oNiwgZGF0YSwgMCksXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjE2LFwiY29sdW1uXCI6MjR9LFwiZW5kXCI6e1wibGluZVwiOjIwLFwiY29sdW1uXCI6MzF9fX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGxvb2t1cFByb3BlcnR5ID0gY29udGFpbmVyLmxvb2t1cFByb3BlcnR5IHx8IGZ1bmN0aW9uKHBhcmVudCwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyZW50LCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xuXG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKGNvbnRhaW5lci5sYW1iZGEoKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwibGFiZWxcIikgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCJcXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoZGVwdGgwICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShkZXB0aDAsXCJuYW1lXCIpIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiXFxuXCI7XG59LFwiOFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gY29udGFpbmVyLmludm9rZVBhcnRpYWwobG9va3VwUHJvcGVydHkocGFydGlhbHMsXCJyb3dzXCIpLGRlcHRoMCx7XCJuYW1lXCI6XCJyb3dzXCIsXCJkYXRhXCI6ZGF0YSxcImluZGVudFwiOlwiICAgICAgICAgICAgICAgICAgXCIsXCJoZWxwZXJzXCI6aGVscGVycyxcInBhcnRpYWxzXCI6cGFydGlhbHMsXCJkZWNvcmF0b3JzXCI6Y29udGFpbmVyLmRlY29yYXRvcnN9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcIjEwXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgPHNwYW4gY2xhc3M9XFxcIm5vZGF0YWZvdW5kXFxcIj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJub0RhdGFGb3VuZFwiKSA6IHN0YWNrMSksIGRlcHRoMCkpXG4gICAgKyBcIjwvc3Bhbj5cXG5cIjtcbn0sXCJjb21waWxlclwiOls4LFwiPj0gNC4zLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBhbGlhczE9ZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiAoY29udGFpbmVyLm51bGxDb250ZXh0IHx8IHt9KSwgbG9va3VwUHJvcGVydHkgPSBjb250YWluZXIubG9va3VwUHJvcGVydHkgfHwgZnVuY3Rpb24ocGFyZW50LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnQsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwidC1SZXBvcnQtdGFibGVXcmFwIG1vZGFsLWxvdi10YWJsZVxcXCI+XFxuICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGNsYXNzPVxcXCJcXFwiIHdpZHRoPVxcXCIxMDAlXFxcIj5cXG4gICAgPHRib2R5PlxcbiAgICAgIDx0cj5cXG4gICAgICAgIDx0ZD48L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGxvb2t1cFByb3BlcnR5KGhlbHBlcnMsXCJpZlwiKS5jYWxsKGFsaWFzMSwoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJyb3dDb3VudFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YSxcImxvY1wiOntcInN0YXJ0XCI6e1wibGluZVwiOjksXCJjb2x1bW5cIjoxMH0sXCJlbmRcIjp7XCJsaW5lXCI6MzEsXCJjb2x1bW5cIjoxN319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgICAgIDwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgPC90Ym9keT5cXG4gIDwvdGFibGU+XFxuXCJcbiAgICArICgoc3RhY2sxID0gbG9va3VwUHJvcGVydHkoaGVscGVycyxcInVubGVzc1wiKS5jYWxsKGFsaWFzMSwoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcInJlcG9ydFwiKSA6IGRlcHRoMCkpICE9IG51bGwgPyBsb29rdXBQcm9wZXJ0eShzdGFjazEsXCJyb3dDb3VudFwiKSA6IHN0YWNrMSkse1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDEwLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MzYsXCJjb2x1bW5cIjoyfSxcImVuZFwiOntcImxpbmVcIjozOCxcImNvbHVtblwiOjEzfX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvZGl2PlxcblwiO1xufSxcInVzZVBhcnRpYWxcIjp0cnVlLFwidXNlRGF0YVwiOnRydWV9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBhbGlhczE9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMyPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgIDx0ciBkYXRhLXJldHVybj1cXFwiXCJcbiAgICArIGFsaWFzMihhbGlhczEoKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicmV0dXJuVmFsXCIpIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiXFxcIiBkYXRhLWRpc3BsYXk9XFxcIlwiXG4gICAgKyBhbGlhczIoYWxpYXMxKChkZXB0aDAgIT0gbnVsbCA/IGxvb2t1cFByb3BlcnR5KGRlcHRoMCxcImRpc3BsYXlWYWxcIikgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJwb2ludGVyXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwiY29sdW1uc1wiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MyxcImNvbHVtblwiOjR9LFwiZW5kXCI6e1wibGluZVwiOjUsXCJjb2x1bW5cIjoxM319fSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgIDwvdHI+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlciwgYWxpYXMxPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gXCIgICAgICA8dGQgaGVhZGVycz1cXFwiXCJcbiAgICArIGFsaWFzMSgoKGhlbHBlciA9IChoZWxwZXIgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwia2V5XCIpIHx8IChkYXRhICYmIGxvb2t1cFByb3BlcnR5KGRhdGEsXCJrZXlcIikpKSAhPSBudWxsID8gaGVscGVyIDogY29udGFpbmVyLmhvb2tzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLHtcIm5hbWVcIjpcImtleVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGEsXCJsb2NcIjp7XCJzdGFydFwiOntcImxpbmVcIjo0LFwiY29sdW1uXCI6MTl9LFwiZW5kXCI6e1wibGluZVwiOjQsXCJjb2x1bW5cIjoyN319fSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwidC1SZXBvcnQtY2VsbFxcXCI+XCJcbiAgICArIGFsaWFzMShjb250YWluZXIubGFtYmRhKGRlcHRoMCwgZGVwdGgwKSlcbiAgICArIFwiPC90ZD5cXG5cIjtcbn0sXCJjb21waWxlclwiOls4LFwiPj0gNC4zLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBsb29rdXBQcm9wZXJ0eSA9IGNvbnRhaW5lci5sb29rdXBQcm9wZXJ0eSB8fCBmdW5jdGlvbihwYXJlbnQsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudCwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfTtcblxuICByZXR1cm4gKChzdGFjazEgPSBsb29rdXBQcm9wZXJ0eShoZWxwZXJzLFwiZWFjaFwiKS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gbG9va3VwUHJvcGVydHkoZGVwdGgwLFwicm93c1wiKSA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhLFwibG9jXCI6e1wic3RhcnRcIjp7XCJsaW5lXCI6MSxcImNvbHVtblwiOjB9LFwiZW5kXCI6e1wibGluZVwiOjcsXCJjb2x1bW5cIjo5fX19KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iXX0=
