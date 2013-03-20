(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    var global = typeof window !== 'undefined' ? window : {};
    var definedProcess = false;
    
    require.define = function (filename, fn) {
        if (!definedProcess && require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
            definedProcess = true;
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process,
                global
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process,global){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process,global){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/init.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, HighresiO, Handlebars, undefined) {
	"use strict";
	
	// Define HighresiO as an object only if it doesn't exist. 
	// Good practice based on: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailnamespacing
	HighresiO = window.HighresiO || (window.HighresiO = {});

	// Added for namespacing - All objects/methods/function are under: HighresiO.Highbrow 
	// Done to avoid conflicts with other libraries that might be named Highbrow.
	// Has a very small performance / load time impact perhaps, but safer.
    // Inner scope - All things will reside inside Highbrow.
	HighresiO.Highbrow = {};

    // Check if Handlebars already exist, if it doesn't create an object under Highbrow namespace. 
    // The extern lib included in our project will be used.
    Handlebars = window.Handlebars || (HighresiO.Highbrow.Handlebars = {});

    // Attach it to Highbrow anyway 
    HighresiO.Highbrow.Handlebars = Handlebars;

	/**
	 * A test function - remove it :)
	 */
    HighresiO.Highbrow.mainFunc = function(hi) {
    	// Functions will have access to log from util package, if they aren't invoked with in this file.
    	HighresiO.Highbrow.Util.log("Saying " + hi + " from mainFunc");
    };

})(window);
});

require.define("/extern/handlebars.runtime-1.0.rc.1.hibrow.js",function(require,module,exports,__dirname,__filename,process,global){// lib/handlebars/base.js

/*jshint eqnull:true*/
// Changed by Akshay for Highbrow:
// this.Handlebars = {};
var Handlebars = window.HighresiO.Highbrow.Handlebars;

(function(Handlebars) {

Handlebars.VERSION = "1.0.rc.1";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      if (data) { data.index = i; }
      ret = ret + fn(context[i], { data: data });
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});

}(Handlebars));
;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
});

require.define("/util.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, Handlebars, undefined) {	
	// Util namespace
	Highbrow.Util = Highbrow.Util || (Highbrow.Util = {});

    //TODO: Disable for production...
    var cons = window.console || {log: function(msg){}};
    Highbrow.Util.log = function(msg) {
        cons.log(msg);
    };

    Highbrow.Util.getProp = function(prop, obj) {
		if (prop) {
			var s = obj[prop]; 
			return s ? s : "";
		} else {
			return "";
		}
    };

    // Douglas Crockford way :)
    Highbrow.Util.createObject = function(obj) {

        if (typeof Object.create !== 'function') {
              Object.create = function (o) {
                var F = function () {};
                F.prototype = o;
                return new F();
            };
         }
         return Object.create(obj);
    };

    Highbrow.Util.mergeProps = function(props, into) {
        if (!props)
            return
        
        for(var prop in props) {
            if(props.hasOwnProperty(prop)){
                into[prop] = props[prop];
            }
        }
    };

    // Get the context object to pass to handlebars. Computed by concatenating styles and labels.
    /*
         config = {
            "styles":{"key1":"val1","key2":"val2"...},
            "labels":{"key1":"val1","key2":"val2"...}, 
            "domids":{"key1":"val1","key2":"val2"...}
        }
    */
    Highbrow.Util.handlebarsContext = function(options) {
    	// TODO: Cache this for repeated lookups??

        // var ls = Highbrow.Labels.all();
        // if (options["labels"]) {
        //    ls  = Highbrow.Util.createObject(Highbrow.Labels.all());
        //    Highbrow.Util.mergeProps(options["labels"], ls);
        // } 

        // var st = Highbrow.Styles.all();
        // if (options["styles"]) {
        //    st  = Highbrow.Util.createObject(Highbrow.Styles.all());
        //    Highbrow.Util.mergeProps(options["styles"], st);
        // } 

        // // TODO: Should we support domids too? Why? - for now yes
        // var di = Highbrow.DomIds.all();
        // if (options["domids"]) {
        //    di  = Highbrow.Util.createObject(Highbrow.DomIds.all());
        //    Highbrow.Util.mergeProps(options["domids"], di);
        // } 

    	return {
    		"s": mergeAfterCloneIfNeeded(Highbrow.Styles.all(), options["styles"]),
            "l": mergeAfterCloneIfNeeded(Highbrow.Labels.all(), options["labels"]),
            "d": mergeAfterCloneIfNeeded(Highbrow.DomIds.all(), options["domids"])
    	}
    };

    function mergeAfterCloneIfNeeded(origProps, newProps) {
        if (!newProps)
            return origProps;

        var p  = Highbrow.Util.createObject(origProps);
        Highbrow.Util.mergeProps(newProps, p);
        return p;
    };

})(window, HighresiO.Highbrow);
});

require.define("/styles/base.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.Styles = function(){
		// List the styles
		var styles = {
		    "t-email": "textbox",
		    "t-comm": "text-area",
		    "b-send": "btn btn-small btn-primary"
		};

		// Will add and override the passed in styles. Designed to override from inheritence.
		var add = function(newStyles) {
		 	Highbrow.Util.mergeProps(newStyles, styles);
		};
		
		var get = function(style) {
			return Highbrow.Util.getProp(style, styles);
		};

		var all = function() {
			return styles;
		};

		return {
			add: add,
			get: get,
			all:all
		}
	}();

})(window, HighresiO.Highbrow);

});

require.define("/styles/photo.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {

	Highbrow.Styles.add({
	    "email-box": "textbox-photo",
	    "webcam-on-btn": "btn webcam-btn",
	    "click-btn": "btn click-primary"
	});

})(window, HighresiO.Highbrow);

});

require.define("/labels/base_en.js",function(require,module,exports,__dirname,__filename,process,global){// This is content as key value pair. This makes it easy to support internalization.
// One locale per file. 
(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.Labels = function(){
		// List the labels
		var labels = {
		    "l-feedback": "Give Feedback",
		    "b-feedback": "Feedback",
		    "b-send": "Send",
		    "l-email": "Email",
		    "l-comm": "Comments"
		};

		// Will add and override the passed in labels. Designed to override from inheritence.
		var add = function(newLabels) {
		 	Highbrow.Util.mergeProps(newLabels, labels);
		};

		var get = function(label) {
			return Highbrow.Util.getProp(label, labels);
		};

		var all = function() {
			return labels;
		};

		return {
			add: add,
			get: get,
			all: all
		};
	}();

})(window, HighresiO.Highbrow);

});

require.define("/labels/photo_en.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {
	Highbrow.Labels.add({
	    "l-feedback": "Click a pic and share your feedback!",
	    "b-feedback": "Send us a pic!",
	    "b-snap": "Click"
	});
})(window, HighresiO.Highbrow);

});

require.define("/app.js",function(require,module,exports,__dirname,__filename,process,global){// Follow the IIFE style decleration so that mimifiers can optimize namespace (HighresiO.Highbrow)
(function(window, Highbrow, undefined) {
	var util = Highbrow.Util;
	
	Highbrow.func1 = function() {
	    //util.log(Highbrow);
	    Highbrow.mainFunc(" Hi called from app.js");
	};

	Highbrow.Photo = function (options) {
	    this.options = options || (options = {});
	    options.emailAdd =  options.emailAdd || "noadd@noadd.com";
	    options.emailLabel =  options.emailLabel || "Email adress (optional)";

	    util.log(options);
	    util.log("returning this - " + this);
	    return this;
	};

	Highbrow.Photo.prototype.snapPic = function() {
	    util.log(this.options);
	
		var template = Highbrow.Handlebars.templates["test.hbs"];
	    
	    var div = document.createElement("div");
	    div.innerHTML = template(Highbrow.Util.handlebarsContext());

	    if(document.body != null){ document.body.appendChild(div);}
	}
})(window, HighresiO.Highbrow);

});

require.define("/router.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {
	Highbrow.func2 = function() {
	    Highbrow.mainFunc(" Hi called from router.js");
	};

})(window, HighresiO.Highbrow);

});

require.define("/store.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {
	Highbrow.func3 = function() {
	    Highbrow.mainFunc(" Hi called from store.js");
	};
})(window, HighresiO.Highbrow);

});

require.define("/templates/dom_id/base.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.DomIds = function(){
		// No default dom_ids
		var dom_ids = {};

		// Will add and override the passed in styles. Designed to override from inheritence.
		var add = function(newIds) {
		 	Highbrow.Util.mergeProps(newIds, dom_ids);
		};
		
		var get = function(id) {
			return Highbrow.Util.getProp(id, dom_ids);
		};

		var all = function() {
			return dom_ids;
		};

		return {
			add: add,
			get: get,
			all:all
		}
	}();

})(window, HighresiO.Highbrow);

});

require.define("/templates/dom_id/form_feedback.js",function(require,module,exports,__dirname,__filename,process,global){(function(window, Highbrow, undefined) {
	Highbrow.DomIds.add({
	    "ff-main-div": "ff-highresio-hibrow",
	    "ff-t-email": "ff-email-box",
	    "ff-t-comm": "ff-comm-box",
	    "ff-b-send": "ff-send-btn"
	});
})(window, HighresiO.Highbrow);

});

require.define("/form_feedback.js",function(require,module,exports,__dirname,__filename,process,global){// Follow the IIFE style decleration so that mimifiers can optimize namespace (HighresiO.Highbrow)
(function(window, Highbrow, undefined) {
	// config is an object with options override. It is optional and works with sensible defaults.
	// Config structure supported: (All optional, but if supplied will override only for this instance)
	/*
		 config = {
			"styles":{"key1":"val1","key2":"val2"...}, // Override the defaults
			"labels":{"key1":"val1","key2":"val2"...}, // Override the defaults
			"domids":{"key1":"val1","key2":"val2"...}, // Override the defaults
			"url":"some_http/s_end_point_to_send_info"
		}
	*/
	Highbrow.FormFeedback = function(config) {
		this.config = config || {};
		// TODO: Override init logic needed (like passed in styles / lablels)

		var template = Highbrow.Handlebars.templates["form_feedback.hbs"];
		var compiledTemplate = template(Highbrow.Util.handlebarsContext(this.config));
	    
	    var div = document.createElement("div");
	    div.innerHTML = compiledTemplate;

	    if(document.body != null){ document.body.appendChild(div);}

	    // Attach button handler
	    attachBtnClick();

	    function attachBtnClick() {
		    // Add a test alert message on click for fun
		    var domids = Highbrow.DomIds;
		    var btn = document.getElementById(domids.get("ff-b-send"));	    	
		    btn.addEventListener("click", function() {alert("hello") });
	    };


	};
})(window, HighresiO.Highbrow);

});

require.define("/templates/all_templates_output.js",function(require,module,exports,__dirname,__filename,process,global){// A hacky way to do things, but a necessity.
// The content of this file will be included (prepended) in the output file generated by handlebars template.
// Hanbdlebar pre-compiled templates need variables/configuration and this file can contain them.
var Handlebars = window.Handlebars || window.HighresiO.Highbrow.Handlebars;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['form_feedback.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "\n<div id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['d']),stack1 == null || stack1 === false ? stack1 : stack1['ff-main-div'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n	<h2>"
    + escapeExpression(((stack1 = ((stack1 = depth0['l']),stack1 == null || stack1 === false ? stack1 : stack1['l-feedback'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\n	<div>\n		<p>\n		<input type=\"text\" id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['d']),stack1 == null || stack1 === false ? stack1 : stack1['ff-t-email'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['t-email'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['l']),stack1 == null || stack1 === false ? stack1 : stack1['l-email'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n		<textarea id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['d']),stack1 == null || stack1 === false ? stack1 : stack1['ff-t-comm'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['t-comm'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['l']),stack1 == null || stack1 === false ? stack1 : stack1['l-comm'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></textarea>\n		</p>\n		<p>\n			<input id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['d']),stack1 == null || stack1 === false ? stack1 : stack1['ff-b-send'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['b-send'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['l']),stack1 == null || stack1 === false ? stack1 : stack1['b-send'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n		</p>\n	</div>\n</div>";
  return buffer;
  });
templates['test.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n	<p>\n		<div id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['email-box'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['email-box'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n			<h4>"
    + escapeExpression(((stack1 = ((stack1 = depth0['l']),stack1 == null || stack1 === false ? stack1 : stack1['l-feedback'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n			<h4>"
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['email-box'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n			<h4>\""
    + escapeExpression(((stack1 = ((stack1 = depth0['s']),stack1 == null || stack1 === false ? stack1 : stack1['email-box'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"</h4>\n		</div>\n	</p>\n</div>";
  return buffer;
  });
templates['test2.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n	";
  if (stack1 = helpers.whoha) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.whoha; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  });
})();
});

require.define("/entry.js",function(require,module,exports,__dirname,__filename,process,global){require("./init.js");

// Extern lib - load only if Handlebars hasn't been defined. 
// Has to be loaded before util.js
// Browserify built file prevents the IIFE of our custom Handlerbars this way.
// if (window.Handlebars === undefined) {
	require("./extern/handlebars.runtime-1.0.rc.1.hibrow.js");
// }



require("./util.js");

require("./styles/base.js");
require("./styles/photo.js");
require("./labels/base_en.js");
require("./labels/photo_en.js");
			
		// Testing 	
		require("./app.js");
		require("./router.js");
		require("./store.js");


require("./templates/dom_id/base.js");
require("./templates/dom_id/form_feedback.js");

require("./form_feedback.js");

// Include auto-generated file after handlebars compilation. (Note: this will be deleted from the workshpace though.)
require("./templates/all_templates_output.js");


HighresiO.Highbrow.Util.log("Loaded all scripts from entry.js!")

});
require("/entry.js");
})();
