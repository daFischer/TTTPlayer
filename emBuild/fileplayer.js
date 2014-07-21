Module['preRun'] = function() {

	Module['FS_createPath']('/', 'TTT', true, true);
	Module['FS_createPath']('TTT', x_filename+"_a", true, true);
	FS.createPreloadedFile("TTT/"+x_filename+"_a",x_filename+".ttt",x_getPath("ttt"), true, false)

	Module['FS_createPath']('/', 'Assets', true, true);
	FS.createPreloadedFile("Assets","PlayPause.bmp","Assets/PlayPause.bmp", true, false)
	FS.createPreloadedFile("Assets","volume.bmp","Assets/volume.bmp", true, false)
	FS.createPreloadedFile("Assets","volume2.bmp","Assets/volume2.bmp", true, false)
	FS.createPreloadedFile("Assets","fullscreen.bmp","Assets/fullscreen.bmp", true, false)
};

// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = (typeof Module !== 'undefined' ? Module : null) || {};

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    window['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    var source = Pointer_stringify(code);
    if (source[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (source.indexOf('"', 1) === source.length-1) {
        source = source.substr(1, source.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + source + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    try {
      var evalled = eval('(function(' + args.join(',') + '){ ' + source + ' })'); // new Function does not allow upvars in node
    } catch(e) {
      Module.printErr('error in executing inline EM_ASM code: ' + e + ' on: \n\n' + source + '\n\nwith args |' + args + '| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)');
      throw e;
    }
    return Runtime.asmConstCache[code] = evalled;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      /* TODO: use TextEncoder when present,
        var encoder = new TextEncoder();
        encoder['encoding'] = "utf-8";
        var utf8Array = encoder['encode'](aMsg.data);
      */
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  var i = 3;
  // params, etc.
  var basicTypes = {
    'v': 'void',
    'b': 'bool',
    'c': 'char',
    's': 'short',
    'i': 'int',
    'l': 'long',
    'f': 'float',
    'd': 'double',
    'w': 'wchar_t',
    'a': 'signed char',
    'h': 'unsigned char',
    't': 'unsigned short',
    'j': 'unsigned int',
    'm': 'unsigned long',
    'x': 'long long',
    'y': 'unsigned long long',
    'z': '...'
  };
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
  function parseNested() {
    i++;
    if (func[i] === 'K') i++; // ignore const
    var parts = [];
    while (func[i] !== 'E') {
      if (func[i] === 'S') { // substitution
        i++;
        var next = func.indexOf('_', i);
        var num = func.substring(i, next) || 0;
        parts.push(subs[num] || '?');
        i = next+1;
        continue;
      }
      if (func[i] === 'C') { // constructor
        parts.push(parts[parts.length-1]);
        i += 2;
        continue;
      }
      var size = parseInt(func.substr(i));
      var pre = size.toString().length;
      if (!size || !pre) { i--; break; } // counter i++ below us
      var curr = func.substr(i + pre, size);
      parts.push(curr);
      subs.push(curr);
      i += pre + size;
    }
    i++; // skip E
    return parts;
  }
  function parse(rawList, limit, allowVoid) { // main parser
    limit = limit || Infinity;
    var ret = '', list = [];
    function flushList() {
      return '(' + list.join(', ') + ')';
    }
    var name;
    if (func[i] === 'N') {
      // namespaced N-E
      name = parseNested().join('::');
      limit--;
      if (limit === 0) return rawList ? [name] : name;
    } else {
      // not namespaced
      if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
      var size = parseInt(func.substr(i));
      if (size) {
        var pre = size.toString().length;
        name = func.substr(i + pre, size);
        i += pre + size;
      }
    }
    first = false;
    if (func[i] === 'I') {
      i++;
      var iList = parse(true);
      var iRet = parse(true, 1, true);
      ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
    } else {
      ret = name;
    }
    paramLoop: while (i < func.length && limit-- > 0) {
      //dump('paramLoop');
      var c = func[i++];
      if (c in basicTypes) {
        list.push(basicTypes[c]);
      } else {
        switch (c) {
          case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
          case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
          case 'L': { // literal
            i++; // skip basic type
            var end = func.indexOf('E', i);
            var size = end - i;
            list.push(func.substr(i, size));
            i += size + 2; // size + 'EE'
            break;
          }
          case 'A': { // array
            var size = parseInt(func.substr(i));
            i += size.toString().length;
            if (func[i] !== '_') throw '?';
            i++; // skip _
            list.push(parse(true, 1, true)[0] + ' [' + size + ']');
            break;
          }
          case 'E': break paramLoop;
          default: ret += '?' + c; break paramLoop;
        }
      }
    }
    if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
    if (rawList) {
      if (ret) {
        list.push(ret + '?');
      }
      return list;
    } else {
      return ret + flushList();
    }
  }
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  // TOTAL_MEMORY is the current size of the actual array, and DYNAMICTOP is the new top.

  while (TOTAL_MEMORY <= DYNAMICTOP) { // Simple heuristic.
    TOTAL_MEMORY = alignMemoryPage(2*TOTAL_MEMORY);
  }
  assert(TOTAL_MEMORY <= Math.pow(2, 30)); // 2^30==1GB is a practical maximum - 2^31 is already close to possible negative numbers etc.
  var oldHEAP8 = HEAP8;
  var buffer = new ArrayBuffer(TOTAL_MEMORY);
  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
  HEAP8.set(oldHEAP8);
  _emscripten_replace_memory(HEAP8, HEAP16, HEAP32, HEAPU8, HEAPU16, HEAPU32, HEAPF32, HEAPF64);
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===
var __ZTVN10__cxxabiv117__class_type_infoE = 27760;
var __ZTVN10__cxxabiv120__si_class_type_infoE = 27800;




STATIC_BASE = 8;

STATICTOP = STATIC_BASE + Runtime.alignMemory(28627);
/* global initializers */ __ATINIT__.push({ func: function() { __GLOBAL__I_a() } }, { func: function() { __GLOBAL__I_a64() } }, { func: function() { __GLOBAL__I_a68() } }, { func: function() { __GLOBAL__I_a89() } }, { func: function() { __GLOBAL__I_a163() } });


/* memory initializer */ allocate([0,0,0,0,72,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,1,0,0,0,4,0,0,0,0,0,0,0,49,52,65,117,100,105,111,73,110,116,101,114,102,97,99,101,0,0,0,0,0,0,0,0,120,108,0,0,48,0,0,0,0,0,0,0,80,1,0,0,2,0,0,0,5,0,0,0,2,0,0,0,6,0,0,0,7,0,0,0,2,0,0,0,8,0,0,0,0,0,0,0,123,32,114,101,116,117,114,110,32,120,95,103,101,116,68,117,114,97,116,105,111,110,40,41,59,32,125,0,0,0,0,0,68,117,114,97,116,105,111,110,58,32,37,100,32,109,105,110,10,0,0,0,0,0,0,0,120,95,116,111,103,103,108,101,80,108,97,121,40,41,59,0,123,32,120,95,115,101,116,80,111,115,105,116,105,111,110,40,36,48,41,59,32,114,101,116,117,114,110,32,48,59,32,125,0,0,0,0,0,0,0,0,123,32,114,101,116,117,114,110,32,120,95,103,101,116,80,111,115,105,116,105,111,110,40,41,59,32,125,0,0,0,0,0,123,32,120,95,99,104,97,110,103,101,86,111,108,117,109,101,40,36,48,41,59,32,125,0,123,32,114,101,116,117,114,110,32,120,95,97,117,100,105,111,46,112,97,117,115,101,100,59,32,125,0,0,0,0,0,0,55,65,117,100,105,111,74,83,0,0,0,0,0,0,0,0,160,108,0,0,64,1,0,0,72,0,0,0,0,0,0,0,255,255,255,255,255,255,255,192,255,255,255,128,255,255,255,64,64,64,64,255,64,64,64,192,64,64,64,128,64,64,64,64,128,128,128,255,128,128,128,192,128,128,128,128,128,128,128,64,192,192,192,255,192,192,192,192,192,192,192,128,192,192,192,64,0,0,0,255,0,0,0,192,0,0,0,128,0,0,0,64,255,200,0,255,255,200,0,192,255,200,0,128,255,200,0,64,255,175,175,255,255,175,175,192,255,175,175,128,255,175,175,64,0,0,255,255,0,0,255,192,0,0,255,128,0,0,255,64,255,0,0,255,255,0,0,192,255,0,0,128,255,0,0,64,0,255,0,255,0,255,0,192,0,255,0,128,0,255,0,64,255,0,255,255,255,0,255,192,255,0,255,128,255,0,255,64,255,255,0,255,255,255,0,192,255,255,0,128,255,255,0,64,0,255,255,255,0,255,255,192,0,255,255,128,0,255,255,64,0,0,153,255,0,0,153,192,0,0,153,128,0,0,153,64,102,102,255,255,102,102,255,192,102,102,255,128,102,102,255,64,204,204,255,255,204,204,255,192,204,204,255,128,204,204,255,64,255,102,102,255,255,102,102,192,255,102,102,128,255,102,102,64,255,204,204,255,255,204,204,192,255,204,204,128,255,204,204,64,0,102,0,255,0,102,0,192,0,102,0,128,0,102,0,64,102,255,102,255,102,255,102,192,102,255,102,128,102,255,102,64,204,255,204,255,204,255,204,192,204,255,204,128,204,255,204,64,102,0,102,255,102,0,102,192,102,0,102,128,102,0,102,64,255,0,255,255,255,0,255,192,255,0,255,128,255,0,255,64,255,102,255,255,255,102,255,192,255,102,255,128,255,102,255,64,255,204,255,255,255,204,255,192,255,204,255,128,255,204,255,64,102,102,0,255,102,102,0,192,102,102,0,128,102,102,0,64,255,255,102,255,255,255,102,192,255,255,102,128,255,255,102,64,255,255,204,255,255,255,204,192,255,255,204,128,255,255,204,64,0,0,102,255,0,0,102,192,0,0,102,128,0,0,102,64,102,255,255,255,102,255,255,192,102,255,255,128,102,255,255,64,204,255,255,255,204,255,255,192,204,255,255,128,204,255,255,64,153,0,255,255,153,0,255,192,153,0,255,128,153,0,255,64,102,0,153,255,102,0,153,192,102,0,153,128,102,0,153,64,153,102,255,255,153,102,255,192,153,102,255,128,153,102,255,64,204,102,255,255,204,102,255,192,204,102,255,128,204,102,255,64,204,102,0,255,204,102,0,192,204,102,0,128,204,102,0,64,255,102,51,255,255,102,51,192,255,102,51,128,255,102,51,64,255,204,153,255,255,204,153,192,255,204,153,128,255,204,153,64,255,215,0,255,255,215,0,192,255,215,0,128,255,215,0,64,240,230,140,255,240,230,140,192,240,230,140,128,240,230,140,64,218,165,32,255,218,165,32,192,218,165,32,128,218,165,32,64,245,245,220,255,245,245,220,192,245,245,220,128,245,245,220,64,255,228,181,255,255,228,181,192,255,228,181,128,255,228,181,64,255,99,71,255,255,99,71,192,255,99,71,128,255,99,71,64,255,140,0,255,255,140,0,192,255,140,0,128,255,140,0,64,220,20,60,255,220,20,60,192,220,20,60,128,220,20,60,64,70,130,180,255,70,130,180,192,70,130,180,128,70,130,180,64,65,105,225,255,65,105,225,192,65,105,225,128,65,105,225,64,123,104,238,255,123,104,238,192,123,104,238,128,123,104,238,64,127,255,212,255,127,255,212,192,127,255,212,128,127,255,212,64,0,255,127,255,0,255,127,192,0,255,127,128,0,255,127,64,150,205,50,255,150,205,50,192,150,205,50,128,150,205,50,64,216,191,216,255,216,191,216,192,216,191,216,128,216,191,216,64,245,222,179,255,245,222,179,192,245,222,179,128,245,222,179,64,160,82,45,255,160,82,45,192,160,82,45,128,160,82,45,64,233,150,122,255,233,150,122,192,233,150,122,128,233,150,122,64,165,42,42,255,165,42,42,192,165,42,42,128,165,42,42,64,210,105,30,255,210,105,30,192,210,105,30,128,210,105,30,64,244,164,96,255,244,164,96,192,244,164,96,128,244,164,96,64,255,20,147,255,255,20,147,192,255,20,147,128,255,20,147,64,255,105,180,255,255,105,180,192,255,105,180,128,255,105,180,64,221,160,221,255,221,160,221,192,221,160,221,128,221,160,221,64,186,85,211,255,186,85,211,192,186,85,211,128,186,85,211,64,112,128,144,255,112,128,144,192,112,128,144,128,112,128,144,64,84,114,105,101,100,32,116,111,32,100,101,99,111,100,101,32,119,114,111,110,103,32,99,111,108,111,114,32,102,111,114,109,97,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,95,115,101,116,117,112,70,117,108,108,83,99,114,101,101,110,40,41,59,0,0,0,0,65,115,115,101,116,115,47,80,108,97,121,80,97,117,115,101,46,98,109,112,0,0,0,0,114,98,0,0,0,0,0,0,65,115,115,101,116,115,47,118,111,108,117,109,101,46,98,109,112,0,0,0,0,0,0,0,65,115,115,101,116,115,47,118,111,108,117,109,101,50,46,98,109,112,0,0,0,0,0,0,65,115,115,101,116,115,47,102,117,108,108,115,99,114,101,101,110,46,98,109,112,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,32,0,0,0,66,77,80,115,32,65,82,69,32,78,85,76,76,0,0,0,102,105,108,108,32,114,101,99,116,32,101,114,114,111,114,0,49,46,50,46,53,0,0,0,114,101,116,32,33,61,32,90,95,83,84,82,69,65,77,95,69,82,82,79,82,0,0,0,46,46,47,73,110,102,108,97,116,101,114,46,99,112,112,0,73,110,102,108,97,116,101,114,0,0,0,0,0,0,0,0,86,105,100,101,111,32,73,110,102,108,97,116,105,111,110,32,102,97,105,108,101,100,58,32,37,100,10,0,0,0,0,0,114,101,97,100,66,121,116,101,0,0,0,0,0,0,0,0,73,110,102,108,97,116,101,114,32,102,97,105,108,32,51,0,73,110,102,108,97,116,101,114,32,102,97,105,108,32,50,0,73,110,102,108,97,116,101,114,32,102,97,105,108,32,49,0,116,104,105,115,32,97,115,115,101,114,116,32,102,97,105,108,115,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,7,0,0,3,0,0,0,4,0,0,0,85,110,97,98,108,101,32,116,111,32,105,110,105,116,105,97,108,105,122,101,32,83,68,76,58,32,37,115,10,0,0,0,47,0,0,0,0,0,0,0,95,97,47,0,0,0,0,0,46,116,116,116,0,0,0,0,65,117,100,105,111,32,102,97,105,108,101,100,58,32,37,115,10,86,105,100,101,111,32,102,97,105,108,101,100,58,32,37,115,10,0,0,0,0,0,0,116,114,117,101,0,0,0,0,102,97,108,115,101,0,0,0,54,80,108,97,121,101,114,0,120,108,0,0,128,7,0,0,115,116,97,114,116,32,108,111,111,112,105,110,103,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,9,0,0,5,0,0,0,6,0,0,0,114,0,0,0,0,0,0,0,86,105,100,101,111,32,73,110,105,116,105,97,108,105,122,97,116,105,111,110,32,115,117,99,99,101,115,115,58,32,10,37,115,10,0,0,0,0,0,0,82,101,97,100,32,37,100,32,109,101,115,115,97,103,101,115,32,115,117,99,99,101,115,115,102,117,108,108,121,10,0,0,37,100,32,120,32,37,100,44,32,99,111,108,111,114,32,100,101,112,116,104,58,32,37,100,10,0,0,0,0,0,0,0,115,99,114,101,101,110,61,40,37,100,44,37,100,44,37,100,44,37,100,41,10,0,0,0,85,110,97,98,108,101,32,116,111,32,115,101,116,32,118,105,100,101,111,32,109,111,100,101,58,32,37,115,10,0,0,0,114,101,100,114,97,119,110,32,97,102,116,101,114,32,115,101,101,107,105,110,103,32,40,37,100,44,32,37,100,41,10,0,65,98,111,117,116,32,116,111,32,114,101,97,100,32,35,98,121,116,101,115,58,32,37,100,10,0,0,0,0,0,0,0,69,120,116,101,110,115,105,111,110,58,32,84,97,103,91,37,100,93,32,37,100,32,98,121,116,101,115,10,0,0,0,0,53,86,105,100,101,111,0,0,120,108,0,0,72,9,0,0,115,101,101,107,105,110,103,46,46,46,0,0,0,0,0,0,67,114,101,97,116,101,32,65,110,110,83,99,114,101,101,110,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,84,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,123,32,118,97,114,32,120,95,109,101,109,111,114,121,32,61,32,95,109,97,108,108,111,99,40,120,95,102,105,108,101,110,97,109,101,46,108,101,110,103,116,104,43,49,41,59,32,119,114,105,116,101,83,116,114,105,110,103,84,111,77,101,109,111,114,121,40,120,95,102,105,108,101,110,97,109,101,44,32,120,95,109,101,109,111,114,121,41,59,32,114,101,116,117,114,110,32,120,95,109,101,109,111,114,121,59,32,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,10,0,0,7,0,0,0,8,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,49,48,65,110,110,111,116,97,116,105,111,110,0,0,0,0,160,108,0,0,88,10,0,0,192,12,0,0,0,0,0,0,114,101,100,114,97,119,32,65,110,110,111,116,97,116,105,111,110,115,0,0,0,0,0,0,0,0,0,0,200,10,0,0,9,0,0,0,10,0,0,0,3,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,49,57,68,101,108,101,116,101,65,108,108,65,110,110,111,116,97,116,105,111,110,0,0,0,160,108,0,0,176,10,0,0,104,10,0,0,0,0,0,0,100,101,108,101,116,101,32,97,108,108,32,97,110,110,111,116,97,116,105,111,110,115,0,0,0,0,0,0,40,11,0,0,11,0,0,0,12,0,0,0,4,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,49,54,68,101,108,101,116,101,65,110,110,111,116,97,116,105,111,110,0,0,0,0,0,0,160,108,0,0,16,11,0,0,104,10,0,0,0,0,0,0,0,0,0,0,96,11,0,0,13,0,0,0,14,0,0,0,5,0,0,0,3,0,0,0,49,50,69,109,112,116,121,77,101,115,115,97,103,101,0,0,160,108,0,0,80,11,0,0,192,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,11,0,0,15,0,0,0,16,0,0,0,6,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,49,52,72,101,120,116,105,108,101,77,101,115,115,97,103,101,0,0,0,0,0,0,0,0,160,108,0,0,176,11,0,0,192,12,0,0,0,0,0,0,112,97,105,110,116,32,72,101,120,116,105,108,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,69,114,114,111,114,58,32,109,101,115,115,97,103,101,32,119,105,116,104,32,101,110,99,111,100,105,110,103,32,37,100,32,103,101,116,115,32,110,111,32,116,121,112,101,63,10,0,0,67,114,101,97,116,101,100,32,82,97,119,77,101,115,115,97,103,101,32,119,105,116,104,32,116,105,109,101,115,116,97,109,112,32,37,100,44,32,110,101,101,100,115,32,116,101,115,116,105,110,103,33,10,0,0,0,115,107,105,112,112,105,110,103,32,117,110,115,117,112,112,111,114,116,101,100,32,109,101,115,115,97,103,101,58,32,69,110,99,111,100,105,110,103,32,61,32,37,100,9,37,100,32,98,121,116,101,115,10,0,0,0,55,77,101,115,115,97,103,101,0,0,0,0,0,0,0,0,120,108,0,0,176,12,0,0,69,78,67,79,68,73,78,71,87,72,73,84,69,66,79,65,82,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,13,0,0,17,0,0,0,18,0,0,0,7,0,0,0,5,0,0,0,68,114,97,119,110,32,82,97,119,77,101,115,115,97,103,101,32,97,116,32,123,37,100,44,32,37,100,44,32,37,100,44,32,37,100,125,10,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,49,48,82,97,119,77,101,115,115,97,103,101,0,0,0,0,160,108,0,0,56,13,0,0,192,12,0,0,0,0,0,0,0,0,0,0,192,13,0,0,19,0,0,0,20,0,0,0,1,0,0,0,6,0,0,0,8,0,0,0,0,0,0,0,100,114,97,119,32,82,101,99,116,97,110,103,108,101,65,110,110,111,116,97,116,105,111,110,40,37,100,44,37,100,44,37,100,44,37,100,41,44,37,100,10,0,0,0,0,0,0,0,49,57,82,101,99,116,97,110,103,108,101,65,110,110,111,116,97,116,105,111,110,0,0,0,160,108,0,0,168,13,0,0,104,10,0,0,0,0,0,0,82,101,99,116,97,110,103,108,101,65,110,110,111,116,97,116,105,111,110,0,0,0,0,0,0,0,0,0,24,14,0,0,21,0,0,0,22,0,0,0,9,0,0,0,7,0,0,0,49,55,87,104,105,116,101,98,111,97,114,100,77,101,115,115,97,103,101,0,0,0,0,0,160,108,0,0,0,14,0,0,192,12,0,0,0,0,0,0,112,97,105,110,116,32,87,104,105,116,101,98,111,97,114,100,0,0,0,0,0,0,0,0,0,0,0,0,150,48,7,119,44,97,14,238,186,81,9,153,25,196,109,7,143,244,106,112,53,165,99,233,163,149,100,158,50,136,219,14,164,184,220,121,30,233,213,224,136,217,210,151,43,76,182,9,189,124,177,126,7,45,184,231,145,29,191,144,100,16,183,29,242,32,176,106,72,113,185,243,222,65,190,132,125,212,218,26,235,228,221,109,81,181,212,244,199,133,211,131,86,152,108,19,192,168,107,100,122,249,98,253,236,201,101,138,79,92,1,20,217,108,6,99,99,61,15,250,245,13,8,141,200,32,110,59,94,16,105,76,228,65,96,213,114,113,103,162,209,228,3,60,71,212,4,75,253,133,13,210,107,181,10,165,250,168,181,53,108,152,178,66,214,201,187,219,64,249,188,172,227,108,216,50,117,92,223,69,207,13,214,220,89,61,209,171,172,48,217,38,58,0,222,81,128,81,215,200,22,97,208,191,181,244,180,33,35,196,179,86,153,149,186,207,15,165,189,184,158,184,2,40,8,136,5,95,178,217,12,198,36,233,11,177,135,124,111,47,17,76,104,88,171,29,97,193,61,45,102,182,144,65,220,118,6,113,219,1,188,32,210,152,42,16,213,239,137,133,177,113,31,181,182,6,165,228,191,159,51,212,184,232,162,201,7,120,52,249,0,15,142,168,9,150,24,152,14,225,187,13,106,127,45,61,109,8,151,108,100,145,1,92,99,230,244,81,107,107,98,97,108,28,216,48,101,133,78,0,98,242,237,149,6,108,123,165,1,27,193,244,8,130,87,196,15,245,198,217,176,101,80,233,183,18,234,184,190,139,124,136,185,252,223,29,221,98,73,45,218,21,243,124,211,140,101,76,212,251,88,97,178,77,206,81,181,58,116,0,188,163,226,48,187,212,65,165,223,74,215,149,216,61,109,196,209,164,251,244,214,211,106,233,105,67,252,217,110,52,70,136,103,173,208,184,96,218,115,45,4,68,229,29,3,51,95,76,10,170,201,124,13,221,60,113,5,80,170,65,2,39,16,16,11,190,134,32,12,201,37,181,104,87,179,133,111,32,9,212,102,185,159,228,97,206,14,249,222,94,152,201,217,41,34,152,208,176,180,168,215,199,23,61,179,89,129,13,180,46,59,92,189,183,173,108,186,192,32,131,184,237,182,179,191,154,12,226,182,3,154,210,177,116,57,71,213,234,175,119,210,157,21,38,219,4,131,22,220,115,18,11,99,227,132,59,100,148,62,106,109,13,168,90,106,122,11,207,14,228,157,255,9,147,39,174,0,10,177,158,7,125,68,147,15,240,210,163,8,135,104,242,1,30,254,194,6,105,93,87,98,247,203,103,101,128,113,54,108,25,231,6,107,110,118,27,212,254,224,43,211,137,90,122,218,16,204,74,221,103,111,223,185,249,249,239,190,142,67,190,183,23,213,142,176,96,232,163,214,214,126,147,209,161,196,194,216,56,82,242,223,79,241,103,187,209,103,87,188,166,221,6,181,63,75,54,178,72,218,43,13,216,76,27,10,175,246,74,3,54,96,122,4,65,195,239,96,223,85,223,103,168,239,142,110,49,121,190,105,70,140,179,97,203,26,131,102,188,160,210,111,37,54,226,104,82,149,119,12,204,3,71,11,187,185,22,2,34,47,38,5,85,190,59,186,197,40,11,189,178,146,90,180,43,4,106,179,92,167,255,215,194,49,207,208,181,139,158,217,44,29,174,222,91,176,194,100,155,38,242,99,236,156,163,106,117,10,147,109,2,169,6,9,156,63,54,14,235,133,103,7,114,19,87,0,5,130,74,191,149,20,122,184,226,174,43,177,123,56,27,182,12,155,142,210,146,13,190,213,229,183,239,220,124,33,223,219,11,212,210,211,134,66,226,212,241,248,179,221,104,110,131,218,31,205,22,190,129,91,38,185,246,225,119,176,111,119,71,183,24,230,90,8,136,112,106,15,255,202,59,6,102,92,11,1,17,255,158,101,143,105,174,98,248,211,255,107,97,69,207,108,22,120,226,10,160,238,210,13,215,84,131,4,78,194,179,3,57,97,38,103,167,247,22,96,208,77,71,105,73,219,119,110,62,74,106,209,174,220,90,214,217,102,11,223,64,240,59,216,55,83,174,188,169,197,158,187,222,127,207,178,71,233,255,181,48,28,242,189,189,138,194,186,202,48,147,179,83,166,163,180,36,5,54,208,186,147,6,215,205,41,87,222,84,191,103,217,35,46,122,102,179,184,74,97,196,2,27,104,93,148,43,111,42,55,190,11,180,161,142,12,195,27,223,5,90,141,239,2,45,0,0,0,0,65,49,27,25,130,98,54,50,195,83,45,43,4,197,108,100,69,244,119,125,134,167,90,86,199,150,65,79,8,138,217,200,73,187,194,209,138,232,239,250,203,217,244,227,12,79,181,172,77,126,174,181,142,45,131,158,207,28,152,135,81,18,194,74,16,35,217,83,211,112,244,120,146,65,239,97,85,215,174,46,20,230,181,55,215,181,152,28,150,132,131,5,89,152,27,130,24,169,0,155,219,250,45,176,154,203,54,169,93,93,119,230,28,108,108,255,223,63,65,212,158,14,90,205,162,36,132,149,227,21,159,140,32,70,178,167,97,119,169,190,166,225,232,241,231,208,243,232,36,131,222,195,101,178,197,218,170,174,93,93,235,159,70,68,40,204,107,111,105,253,112,118,174,107,49,57,239,90,42,32,44,9,7,11,109,56,28,18,243,54,70,223,178,7,93,198,113,84,112,237,48,101,107,244,247,243,42,187,182,194,49,162,117,145,28,137,52,160,7,144,251,188,159,23,186,141,132,14,121,222,169,37,56,239,178,60,255,121,243,115,190,72,232,106,125,27,197,65,60,42,222,88,5,79,121,240,68,126,98,233,135,45,79,194,198,28,84,219,1,138,21,148,64,187,14,141,131,232,35,166,194,217,56,191,13,197,160,56,76,244,187,33,143,167,150,10,206,150,141,19,9,0,204,92,72,49,215,69,139,98,250,110,202,83,225,119,84,93,187,186,21,108,160,163,214,63,141,136,151,14,150,145,80,152,215,222,17,169,204,199,210,250,225,236,147,203,250,245,92,215,98,114,29,230,121,107,222,181,84,64,159,132,79,89,88,18,14,22,25,35,21,15,218,112,56,36,155,65,35,61,167,107,253,101,230,90,230,124,37,9,203,87,100,56,208,78,163,174,145,1,226,159,138,24,33,204,167,51,96,253,188,42,175,225,36,173,238,208,63,180,45,131,18,159,108,178,9,134,171,36,72,201,234,21,83,208,41,70,126,251,104,119,101,226,246,121,63,47,183,72,36,54,116,27,9,29,53,42,18,4,242,188,83,75,179,141,72,82,112,222,101,121,49,239,126,96,254,243,230,231,191,194,253,254,124,145,208,213,61,160,203,204,250,54,138,131,187,7,145,154,120,84,188,177,57,101,167,168,75,152,131,59,10,169,152,34,201,250,181,9,136,203,174,16,79,93,239,95,14,108,244,70,205,63,217,109,140,14,194,116,67,18,90,243,2,35,65,234,193,112,108,193,128,65,119,216,71,215,54,151,6,230,45,142,197,181,0,165,132,132,27,188,26,138,65,113,91,187,90,104,152,232,119,67,217,217,108,90,30,79,45,21,95,126,54,12,156,45,27,39,221,28,0,62,18,0,152,185,83,49,131,160,144,98,174,139,209,83,181,146,22,197,244,221,87,244,239,196,148,167,194,239,213,150,217,246,233,188,7,174,168,141,28,183,107,222,49,156,42,239,42,133,237,121,107,202,172,72,112,211,111,27,93,248,46,42,70,225,225,54,222,102,160,7,197,127,99,84,232,84,34,101,243,77,229,243,178,2,164,194,169,27,103,145,132,48,38,160,159,41,184,174,197,228,249,159,222,253,58,204,243,214,123,253,232,207,188,107,169,128,253,90,178,153,62,9,159,178,127,56,132,171,176,36,28,44,241,21,7,53,50,70,42,30,115,119,49,7,180,225,112,72,245,208,107,81,54,131,70,122,119,178,93,99,78,215,250,203,15,230,225,210,204,181,204,249,141,132,215,224,74,18,150,175,11,35,141,182,200,112,160,157,137,65,187,132,70,93,35,3,7,108,56,26,196,63,21,49,133,14,14,40,66,152,79,103,3,169,84,126,192,250,121,85,129,203,98,76,31,197,56,129,94,244,35,152,157,167,14,179,220,150,21,170,27,0,84,229,90,49,79,252,153,98,98,215,216,83,121,206,23,79,225,73,86,126,250,80,149,45,215,123,212,28,204,98,19,138,141,45,82,187,150,52,145,232,187,31,208,217,160,6,236,243,126,94,173,194,101,71,110,145,72,108,47,160,83,117,232,54,18,58,169,7,9,35,106,84,36,8,43,101,63,17,228,121,167,150,165,72,188,143,102,27,145,164,39,42,138,189,224,188,203,242,161,141,208,235,98,222,253,192,35,239,230,217,189,225,188,20,252,208,167,13,63,131,138,38,126,178,145,63,185,36,208,112,248,21,203,105,59,70,230,66,122,119,253,91,181,107,101,220,244,90,126,197,55,9,83,238,118,56,72,247,177,174,9,184,240,159,18,161,51,204,63,138,114,253,36,147,0,0,0,0,55,106,194,1,110,212,132,3,89,190,70,2,220,168,9,7,235,194,203,6,178,124,141,4,133,22,79,5,184,81,19,14,143,59,209,15,214,133,151,13,225,239,85,12,100,249,26,9,83,147,216,8,10,45,158,10,61,71,92,11,112,163,38,28,71,201,228,29,30,119,162,31,41,29,96,30,172,11,47,27,155,97,237,26,194,223,171,24,245,181,105,25,200,242,53,18,255,152,247,19,166,38,177,17,145,76,115,16,20,90,60,21,35,48,254,20,122,142,184,22,77,228,122,23,224,70,77,56,215,44,143,57,142,146,201,59,185,248,11,58,60,238,68,63,11,132,134,62,82,58,192,60,101,80,2,61,88,23,94,54,111,125,156,55,54,195,218,53,1,169,24,52,132,191,87,49,179,213,149,48,234,107,211,50,221,1,17,51,144,229,107,36,167,143,169,37,254,49,239,39,201,91,45,38,76,77,98,35,123,39,160,34,34,153,230,32,21,243,36,33,40,180,120,42,31,222,186,43,70,96,252,41,113,10,62,40,244,28,113,45,195,118,179,44,154,200,245,46,173,162,55,47,192,141,154,112,247,231,88,113,174,89,30,115,153,51,220,114,28,37,147,119,43,79,81,118,114,241,23,116,69,155,213,117,120,220,137,126,79,182,75,127,22,8,13,125,33,98,207,124,164,116,128,121,147,30,66,120,202,160,4,122,253,202,198,123,176,46,188,108,135,68,126,109,222,250,56,111,233,144,250,110,108,134,181,107,91,236,119,106,2,82,49,104,53,56,243,105,8,127,175,98,63,21,109,99,102,171,43,97,81,193,233,96,212,215,166,101,227,189,100,100,186,3,34,102,141,105,224,103,32,203,215,72,23,161,21,73,78,31,83,75,121,117,145,74,252,99,222,79,203,9,28,78,146,183,90,76,165,221,152,77,152,154,196,70,175,240,6,71,246,78,64,69,193,36,130,68,68,50,205,65,115,88,15,64,42,230,73,66,29,140,139,67,80,104,241,84,103,2,51,85,62,188,117,87,9,214,183,86,140,192,248,83,187,170,58,82,226,20,124,80,213,126,190,81,232,57,226,90,223,83,32,91,134,237,102,89,177,135,164,88,52,145,235,93,3,251,41,92,90,69,111,94,109,47,173,95,128,27,53,225,183,113,247,224,238,207,177,226,217,165,115,227,92,179,60,230,107,217,254,231,50,103,184,229,5,13,122,228,56,74,38,239,15,32,228,238,86,158,162,236,97,244,96,237,228,226,47,232,211,136,237,233,138,54,171,235,189,92,105,234,240,184,19,253,199,210,209,252,158,108,151,254,169,6,85,255,44,16,26,250,27,122,216,251,66,196,158,249,117,174,92,248,72,233,0,243,127,131,194,242,38,61,132,240,17,87,70,241,148,65,9,244,163,43,203,245,250,149,141,247,205,255,79,246,96,93,120,217,87,55,186,216,14,137,252,218,57,227,62,219,188,245,113,222,139,159,179,223,210,33,245,221,229,75,55,220,216,12,107,215,239,102,169,214,182,216,239,212,129,178,45,213,4,164,98,208,51,206,160,209,106,112,230,211,93,26,36,210,16,254,94,197,39,148,156,196,126,42,218,198,73,64,24,199,204,86,87,194,251,60,149,195,162,130,211,193,149,232,17,192,168,175,77,203,159,197,143,202,198,123,201,200,241,17,11,201,116,7,68,204,67,109,134,205,26,211,192,207,45,185,2,206,64,150,175,145,119,252,109,144,46,66,43,146,25,40,233,147,156,62,166,150,171,84,100,151,242,234,34,149,197,128,224,148,248,199,188,159,207,173,126,158,150,19,56,156,161,121,250,157,36,111,181,152,19,5,119,153,74,187,49,155,125,209,243,154,48,53,137,141,7,95,75,140,94,225,13,142,105,139,207,143,236,157,128,138,219,247,66,139,130,73,4,137,181,35,198,136,136,100,154,131,191,14,88,130,230,176,30,128,209,218,220,129,84,204,147,132,99,166,81,133,58,24,23,135,13,114,213,134,160,208,226,169,151,186,32,168,206,4,102,170,249,110,164,171,124,120,235,174,75,18,41,175,18,172,111,173,37,198,173,172,24,129,241,167,47,235,51,166,118,85,117,164,65,63,183,165,196,41,248,160,243,67,58,161,170,253,124,163,157,151,190,162,208,115,196,181,231,25,6,180,190,167,64,182,137,205,130,183,12,219,205,178,59,177,15,179,98,15,73,177,85,101,139,176,104,34,215,187,95,72,21,186,6,246,83,184,49,156,145,185,180,138,222,188,131,224,28,189,218,94,90,191,237,52,152,190,0,0,0,0,101,103,188,184,139,200,9,170,238,175,181,18,87,151,98,143,50,240,222,55,220,95,107,37,185,56,215,157,239,40,180,197,138,79,8,125,100,224,189,111,1,135,1,215,184,191,214,74,221,216,106,242,51,119,223,224,86,16,99,88,159,87,25,80,250,48,165,232,20,159,16,250,113,248,172,66,200,192,123,223,173,167,199,103,67,8,114,117,38,111,206,205,112,127,173,149,21,24,17,45,251,183,164,63,158,208,24,135,39,232,207,26,66,143,115,162,172,32,198,176,201,71,122,8,62,175,50,160,91,200,142,24,181,103,59,10,208,0,135,178,105,56,80,47,12,95,236,151,226,240,89,133,135,151,229,61,209,135,134,101,180,224,58,221,90,79,143,207,63,40,51,119,134,16,228,234,227,119,88,82,13,216,237,64,104,191,81,248,161,248,43,240,196,159,151,72,42,48,34,90,79,87,158,226,246,111,73,127,147,8,245,199,125,167,64,213,24,192,252,109,78,208,159,53,43,183,35,141,197,24,150,159,160,127,42,39,25,71,253,186,124,32,65,2,146,143,244,16,247,232,72,168,61,88,20,155,88,63,168,35,182,144,29,49,211,247,161,137,106,207,118,20,15,168,202,172,225,7,127,190,132,96,195,6,210,112,160,94,183,23,28,230,89,184,169,244,60,223,21,76,133,231,194,209,224,128,126,105,14,47,203,123,107,72,119,195,162,15,13,203,199,104,177,115,41,199,4,97,76,160,184,217,245,152,111,68,144,255,211,252,126,80,102,238,27,55,218,86,77,39,185,14,40,64,5,182,198,239,176,164,163,136,12,28,26,176,219,129,127,215,103,57,145,120,210,43,244,31,110,147,3,247,38,59,102,144,154,131,136,63,47,145,237,88,147,41,84,96,68,180,49,7,248,12,223,168,77,30,186,207,241,166,236,223,146,254,137,184,46,70,103,23,155,84,2,112,39,236,187,72,240,113,222,47,76,201,48,128,249,219,85,231,69,99,156,160,63,107,249,199,131,211,23,104,54,193,114,15,138,121,203,55,93,228,174,80,225,92,64,255,84,78,37,152,232,246,115,136,139,174,22,239,55,22,248,64,130,4,157,39,62,188,36,31,233,33,65,120,85,153,175,215,224,139,202,176,92,51,59,182,89,237,94,209,229,85,176,126,80,71,213,25,236,255,108,33,59,98,9,70,135,218,231,233,50,200,130,142,142,112,212,158,237,40,177,249,81,144,95,86,228,130,58,49,88,58,131,9,143,167,230,110,51,31,8,193,134,13,109,166,58,181,164,225,64,189,193,134,252,5,47,41,73,23,74,78,245,175,243,118,34,50,150,17,158,138,120,190,43,152,29,217,151,32,75,201,244,120,46,174,72,192,192,1,253,210,165,102,65,106,28,94,150,247,121,57,42,79,151,150,159,93,242,241,35,229,5,25,107,77,96,126,215,245,142,209,98,231,235,182,222,95,82,142,9,194,55,233,181,122,217,70,0,104,188,33,188,208,234,49,223,136,143,86,99,48,97,249,214,34,4,158,106,154,189,166,189,7,216,193,1,191,54,110,180,173,83,9,8,21,154,78,114,29,255,41,206,165,17,134,123,183,116,225,199,15,205,217,16,146,168,190,172,42,70,17,25,56,35,118,165,128,117,102,198,216,16,1,122,96,254,174,207,114,155,201,115,202,34,241,164,87,71,150,24,239,169,57,173,253,204,94,17,69,6,238,77,118,99,137,241,206,141,38,68,220,232,65,248,100,81,121,47,249,52,30,147,65,218,177,38,83,191,214,154,235,233,198,249,179,140,161,69,11,98,14,240,25,7,105,76,161,190,81,155,60,219,54,39,132,53,153,146,150,80,254,46,46,153,185,84,38,252,222,232,158,18,113,93,140,119,22,225,52,206,46,54,169,171,73,138,17,69,230,63,3,32,129,131,187,118,145,224,227,19,246,92,91,253,89,233,73,152,62,85,241,33,6,130,108,68,97,62,212,170,206,139,198,207,169,55,126,56,65,127,214,93,38,195,110,179,137,118,124,214,238,202,196,111,214,29,89,10,177,161,225,228,30,20,243,129,121,168,75,215,105,203,19,178,14,119,171,92,161,194,185,57,198,126,1,128,254,169,156,229,153,21,36,11,54,160,54,110,81,28,142,167,22,102,134,194,113,218,62,44,222,111,44,73,185,211,148,240,129,4,9,149,230,184,177,123,73,13,163,30,46,177,27,72,62,210,67,45,89,110,251,195,246,219,233,166,145,103,81,31,169,176,204,122,206,12,116,148,97,185,102,241,6,5,222,0,0,0,0,119,7,48,150,238,14,97,44,153,9,81,186,7,109,196,25,112,106,244,143,233,99,165,53,158,100,149,163,14,219,136,50,121,220,184,164,224,213,233,30,151,210,217,136,9,182,76,43,126,177,124,189,231,184,45,7,144,191,29,145,29,183,16,100,106,176,32,242,243,185,113,72,132,190,65,222,26,218,212,125,109,221,228,235,244,212,181,81,131,211,133,199,19,108,152,86,100,107,168,192,253,98,249,122,138,101,201,236,20,1,92,79,99,6,108,217,250,15,61,99,141,8,13,245,59,110,32,200,76,105,16,94,213,96,65,228,162,103,113,114,60,3,228,209,75,4,212,71,210,13,133,253,165,10,181,107,53,181,168,250,66,178,152,108,219,187,201,214,172,188,249,64,50,216,108,227,69,223,92,117,220,214,13,207,171,209,61,89,38,217,48,172,81,222,0,58,200,215,81,128,191,208,97,22,33,180,244,181,86,179,196,35,207,186,149,153,184,189,165,15,40,2,184,158,95,5,136,8,198,12,217,178,177,11,233,36,47,111,124,135,88,104,76,17,193,97,29,171,182,102,45,61,118,220,65,144,1,219,113,6,152,210,32,188,239,213,16,42,113,177,133,137,6,182,181,31,159,191,228,165,232,184,212,51,120,7,201,162,15,0,249,52,150,9,168,142,225,14,152,24,127,106,13,187,8,109,61,45,145,100,108,151,230,99,92,1,107,107,81,244,28,108,97,98,133,101,48,216,242,98,0,78,108,6,149,237,27,1,165,123,130,8,244,193,245,15,196,87,101,176,217,198,18,183,233,80,139,190,184,234,252,185,136,124,98,221,29,223,21,218,45,73,140,211,124,243,251,212,76,101,77,178,97,88,58,181,81,206,163,188,0,116,212,187,48,226,74,223,165,65,61,216,149,215,164,209,196,109,211,214,244,251,67,105,233,106,52,110,217,252,173,103,136,70,218,96,184,208,68,4,45,115,51,3,29,229,170,10,76,95,221,13,124,201,80,5,113,60,39,2,65,170,190,11,16,16,201,12,32,134,87,104,181,37,32,111,133,179,185,102,212,9,206,97,228,159,94,222,249,14,41,217,201,152,176,208,152,34,199,215,168,180,89,179,61,23,46,180,13,129,183,189,92,59,192,186,108,173,237,184,131,32,154,191,179,182,3,182,226,12,116,177,210,154,234,213,71,57,157,210,119,175,4,219,38,21,115,220,22,131,227,99,11,18,148,100,59,132,13,109,106,62,122,106,90,168,228,14,207,11,147,9,255,157,10,0,174,39,125,7,158,177,240,15,147,68,135,8,163,210,30,1,242,104,105,6,194,254,247,98,87,93,128,101,103,203,25,108,54,113,110,107,6,231,254,212,27,118,137,211,43,224,16,218,122,90,103,221,74,204,249,185,223,111,142,190,239,249,23,183,190,67,96,176,142,213,214,214,163,232,161,209,147,126,56,216,194,196,79,223,242,82,209,187,103,241,166,188,87,103,63,181,6,221,72,178,54,75,216,13,43,218,175,10,27,76,54,3,74,246,65,4,122,96,223,96,239,195,168,103,223,85,49,110,142,239,70,105,190,121,203,97,179,140,188,102,131,26,37,111,210,160,82,104,226,54,204,12,119,149,187,11,71,3,34,2,22,185,85,5,38,47,197,186,59,190,178,189,11,40,43,180,90,146,92,179,106,4,194,215,255,167,181,208,207,49,44,217,158,139,91,222,174,29,155,100,194,176,236,99,242,38,117,106,163,156,2,109,147,10,156,9,6,169,235,14,54,63,114,7,103,133,5,0,87,19,149,191,74,130,226,184,122,20,123,177,43,174,12,182,27,56,146,210,142,155,229,213,190,13,124,220,239,183,11,219,223,33,134,211,210,212,241,212,226,66,104,221,179,248,31,218,131,110,129,190,22,205,246,185,38,91,111,176,119,225,24,183,71,119,136,8,90,230,255,15,106,112,102,6,59,202,17,1,11,92,143,101,158,255,248,98,174,105,97,107,255,211,22,108,207,69,160,10,226,120,215,13,210,238,78,4,131,84,57,3,179,194,167,103,38,97,208,96,22,247,73,105,71,77,62,110,119,219,174,209,106,74,217,214,90,220,64,223,11,102,55,216,59,240,169,188,174,83,222,187,158,197,71,178,207,127,48,181,255,233,189,189,242,28,202,186,194,138,83,179,147,48,36,180,163,166,186,208,54,5,205,215,6,147,84,222,87,41,35,217,103,191,179,102,122,46,196,97,74,184,93,104,27,2,42,111,43,148,180,11,190,55,195,12,142,161,90,5,223,27,45,2,239,141,0,0,0,0,25,27,49,65,50,54,98,130,43,45,83,195,100,108,197,4,125,119,244,69,86,90,167,134,79,65,150,199,200,217,138,8,209,194,187,73,250,239,232,138,227,244,217,203,172,181,79,12,181,174,126,77,158,131,45,142,135,152,28,207,74,194,18,81,83,217,35,16,120,244,112,211,97,239,65,146,46,174,215,85,55,181,230,20,28,152,181,215,5,131,132,150,130,27,152,89,155,0,169,24,176,45,250,219,169,54,203,154,230,119,93,93,255,108,108,28,212,65,63,223,205,90,14,158,149,132,36,162,140,159,21,227,167,178,70,32,190,169,119,97,241,232,225,166,232,243,208,231,195,222,131,36,218,197,178,101,93,93,174,170,68,70,159,235,111,107,204,40,118,112,253,105,57,49,107,174,32,42,90,239,11,7,9,44,18,28,56,109,223,70,54,243,198,93,7,178,237,112,84,113,244,107,101,48,187,42,243,247,162,49,194,182,137,28,145,117,144,7,160,52,23,159,188,251,14,132,141,186,37,169,222,121,60,178,239,56,115,243,121,255,106,232,72,190,65,197,27,125,88,222,42,60,240,121,79,5,233,98,126,68,194,79,45,135,219,84,28,198,148,21,138,1,141,14,187,64,166,35,232,131,191,56,217,194,56,160,197,13,33,187,244,76,10,150,167,143,19,141,150,206,92,204,0,9,69,215,49,72,110,250,98,139,119,225,83,202,186,187,93,84,163,160,108,21,136,141,63,214,145,150,14,151,222,215,152,80,199,204,169,17,236,225,250,210,245,250,203,147,114,98,215,92,107,121,230,29,64,84,181,222,89,79,132,159,22,14,18,88,15,21,35,25,36,56,112,218,61,35,65,155,101,253,107,167,124,230,90,230,87,203,9,37,78,208,56,100,1,145,174,163,24,138,159,226,51,167,204,33,42,188,253,96,173,36,225,175,180,63,208,238,159,18,131,45,134,9,178,108,201,72,36,171,208,83,21,234,251,126,70,41,226,101,119,104,47,63,121,246,54,36,72,183,29,9,27,116,4,18,42,53,75,83,188,242,82,72,141,179,121,101,222,112,96,126,239,49,231,230,243,254,254,253,194,191,213,208,145,124,204,203,160,61,131,138,54,250,154,145,7,187,177,188,84,120,168,167,101,57,59,131,152,75,34,152,169,10,9,181,250,201,16,174,203,136,95,239,93,79,70,244,108,14,109,217,63,205,116,194,14,140,243,90,18,67,234,65,35,2,193,108,112,193,216,119,65,128,151,54,215,71,142,45,230,6,165,0,181,197,188,27,132,132,113,65,138,26,104,90,187,91,67,119,232,152,90,108,217,217,21,45,79,30,12,54,126,95,39,27,45,156,62,0,28,221,185,152,0,18,160,131,49,83,139,174,98,144,146,181,83,209,221,244,197,22,196,239,244,87,239,194,167,148,246,217,150,213,174,7,188,233,183,28,141,168,156,49,222,107,133,42,239,42,202,107,121,237,211,112,72,172,248,93,27,111,225,70,42,46,102,222,54,225,127,197,7,160,84,232,84,99,77,243,101,34,2,178,243,229,27,169,194,164,48,132,145,103,41,159,160,38,228,197,174,184,253,222,159,249,214,243,204,58,207,232,253,123,128,169,107,188,153,178,90,253,178,159,9,62,171,132,56,127,44,28,36,176,53,7,21,241,30,42,70,50,7,49,119,115,72,112,225,180,81,107,208,245,122,70,131,54,99,93,178,119,203,250,215,78,210,225,230,15,249,204,181,204,224,215,132,141,175,150,18,74,182,141,35,11,157,160,112,200,132,187,65,137,3,35,93,70,26,56,108,7,49,21,63,196,40,14,14,133,103,79,152,66,126,84,169,3,85,121,250,192,76,98,203,129,129,56,197,31,152,35,244,94,179,14,167,157,170,21,150,220,229,84,0,27,252,79,49,90,215,98,98,153,206,121,83,216,73,225,79,23,80,250,126,86,123,215,45,149,98,204,28,212,45,141,138,19,52,150,187,82,31,187,232,145,6,160,217,208,94,126,243,236,71,101,194,173,108,72,145,110,117,83,160,47,58,18,54,232,35,9,7,169,8,36,84,106,17,63,101,43,150,167,121,228,143,188,72,165,164,145,27,102,189,138,42,39,242,203,188,224,235,208,141,161,192,253,222,98,217,230,239,35,20,188,225,189,13,167,208,252,38,138,131,63,63,145,178,126,112,208,36,185,105,203,21,248,66,230,70,59,91,253,119,122,220,101,107,181,197,126,90,244,238,83,9,55,247,72,56,118,184,9,174,177,161,18,159,240,138,63,204,51,147,36,253,114,0,0,0,0,1,194,106,55,3,132,212,110,2,70,190,89,7,9,168,220,6,203,194,235,4,141,124,178,5,79,22,133,14,19,81,184,15,209,59,143,13,151,133,214,12,85,239,225,9,26,249,100,8,216,147,83,10,158,45,10,11,92,71,61,28,38,163,112,29,228,201,71,31,162,119,30,30,96,29,41,27,47,11,172,26,237,97,155,24,171,223,194,25,105,181,245,18,53,242,200,19,247,152,255,17,177,38,166,16,115,76,145,21,60,90,20,20,254,48,35,22,184,142,122,23,122,228,77,56,77,70,224,57,143,44,215,59,201,146,142,58,11,248,185,63,68,238,60,62,134,132,11,60,192,58,82,61,2,80,101,54,94,23,88,55,156,125,111,53,218,195,54,52,24,169,1,49,87,191,132,48,149,213,179,50,211,107,234,51,17,1,221,36,107,229,144,37,169,143,167,39,239,49,254,38,45,91,201,35,98,77,76,34,160,39,123,32,230,153,34,33,36,243,21,42,120,180,40,43,186,222,31,41,252,96,70,40,62,10,113,45,113,28,244,44,179,118,195,46,245,200,154,47,55,162,173,112,154,141,192,113,88,231,247,115,30,89,174,114,220,51,153,119,147,37,28,118,81,79,43,116,23,241,114,117,213,155,69,126,137,220,120,127,75,182,79,125,13,8,22,124,207,98,33,121,128,116,164,120,66,30,147,122,4,160,202,123,198,202,253,108,188,46,176,109,126,68,135,111,56,250,222,110,250,144,233,107,181,134,108,106,119,236,91,104,49,82,2,105,243,56,53,98,175,127,8,99,109,21,63,97,43,171,102,96,233,193,81,101,166,215,212,100,100,189,227,102,34,3,186,103,224,105,141,72,215,203,32,73,21,161,23,75,83,31,78,74,145,117,121,79,222,99,252,78,28,9,203,76,90,183,146,77,152,221,165,70,196,154,152,71,6,240,175,69,64,78,246,68,130,36,193,65,205,50,68,64,15,88,115,66,73,230,42,67,139,140,29,84,241,104,80,85,51,2,103], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
/* memory initializer */ allocate([87,117,188,62,86,183,214,9,83,248,192,140,82,58,170,187,80,124,20,226,81,190,126,213,90,226,57,232,91,32,83,223,89,102,237,134,88,164,135,177,93,235,145,52,92,41,251,3,94,111,69,90,95,173,47,109,225,53,27,128,224,247,113,183,226,177,207,238,227,115,165,217,230,60,179,92,231,254,217,107,229,184,103,50,228,122,13,5,239,38,74,56,238,228,32,15,236,162,158,86,237,96,244,97,232,47,226,228,233,237,136,211,235,171,54,138,234,105,92,189,253,19,184,240,252,209,210,199,254,151,108,158,255,85,6,169,250,26,16,44,251,216,122,27,249,158,196,66,248,92,174,117,243,0,233,72,242,194,131,127,240,132,61,38,241,70,87,17,244,9,65,148,245,203,43,163,247,141,149,250,246,79,255,205,217,120,93,96,216,186,55,87,218,252,137,14,219,62,227,57,222,113,245,188,223,179,159,139,221,245,33,210,220,55,75,229,215,107,12,216,214,169,102,239,212,239,216,182,213,45,178,129,208,98,164,4,209,160,206,51,211,230,112,106,210,36,26,93,197,94,254,16,196,156,148,39,198,218,42,126,199,24,64,73,194,87,86,204,195,149,60,251,193,211,130,162,192,17,232,149,203,77,175,168,202,143,197,159,200,201,123,198,201,11,17,241,204,68,7,116,205,134,109,67,207,192,211,26,206,2,185,45,145,175,150,64,144,109,252,119,146,43,66,46,147,233,40,25,150,166,62,156,151,100,84,171,149,34,234,242,148,224,128,197,159,188,199,248,158,126,173,207,156,56,19,150,157,250,121,161,152,181,111,36,153,119,5,19,155,49,187,74,154,243,209,125,141,137,53,48,140,75,95,7,142,13,225,94,143,207,139,105,138,128,157,236,139,66,247,219,137,4,73,130,136,198,35,181,131,154,100,136,130,88,14,191,128,30,176,230,129,220,218,209,132,147,204,84,133,81,166,99,135,23,24,58,134,213,114,13,169,226,208,160,168,32,186,151,170,102,4,206,171,164,110,249,174,235,120,124,175,41,18,75,173,111,172,18,172,173,198,37,167,241,129,24,166,51,235,47,164,117,85,118,165,183,63,65,160,248,41,196,161,58,67,243,163,124,253,170,162,190,151,157,181,196,115,208,180,6,25,231,182,64,167,190,183,130,205,137,178,205,219,12,179,15,177,59,177,73,15,98,176,139,101,85,187,215,34,104,186,21,72,95,184,83,246,6,185,145,156,49,188,222,138,180,189,28,224,131,191,90,94,218,190,152,52,237,0,0,0,0,184,188,103,101,170,9,200,139,18,181,175,238,143,98,151,87,55,222,240,50,37,107,95,220,157,215,56,185,197,180,40,239,125,8,79,138,111,189,224,100,215,1,135,1,74,214,191,184,242,106,216,221,224,223,119,51,88,99,16,86,80,25,87,159,232,165,48,250,250,16,159,20,66,172,248,113,223,123,192,200,103,199,167,173,117,114,8,67,205,206,111,38,149,173,127,112,45,17,24,21,63,164,183,251,135,24,208,158,26,207,232,39,162,115,143,66,176,198,32,172,8,122,71,201,160,50,175,62,24,142,200,91,10,59,103,181,178,135,0,208,47,80,56,105,151,236,95,12,133,89,240,226,61,229,151,135,101,134,135,209,221,58,224,180,207,143,79,90,119,51,40,63,234,228,16,134,82,88,119,227,64,237,216,13,248,81,191,104,240,43,248,161,72,151,159,196,90,34,48,42,226,158,87,79,127,73,111,246,199,245,8,147,213,64,167,125,109,252,192,24,53,159,208,78,141,35,183,43,159,150,24,197,39,42,127,160,186,253,71,25,2,65,32,124,16,244,143,146,168,72,232,247,155,20,88,61,35,168,63,88,49,29,144,182,137,161,247,211,20,118,207,106,172,202,168,15,190,127,7,225,6,195,96,132,94,160,112,210,230,28,23,183,244,169,184,89,76,21,223,60,209,194,231,133,105,126,128,224,123,203,47,14,195,119,72,107,203,13,15,162,115,177,104,199,97,4,199,41,217,184,160,76,68,111,152,245,252,211,255,144,238,102,80,126,86,218,55,27,14,185,39,77,182,5,64,40,164,176,239,198,28,12,136,163,129,219,176,26,57,103,215,127,43,210,120,145,147,110,31,244,59,38,247,3,131,154,144,102,145,47,63,136,41,147,88,237,180,68,96,84,12,248,7,49,30,77,168,223,166,241,207,186,254,146,223,236,70,46,184,137,84,155,23,103,236,39,112,2,113,240,72,187,201,76,47,222,219,249,128,48,99,69,231,85,107,63,160,156,211,131,199,249,193,54,104,23,121,138,15,114,228,93,55,203,92,225,80,174,78,84,255,64,246,232,152,37,174,139,136,115,22,55,239,22,4,130,64,248,188,62,39,157,33,233,31,36,153,85,120,65,139,224,215,175,51,92,176,202,237,89,182,59,85,229,209,94,71,80,126,176,255,236,25,213,98,59,33,108,218,135,70,9,200,50,233,231,112,142,142,130,40,237,158,212,144,81,249,177,130,228,86,95,58,88,49,58,167,143,9,131,31,51,110,230,13,134,193,8,181,58,166,109,189,64,225,164,5,252,134,193,23,73,41,47,175,245,78,74,50,34,118,243,138,158,17,150,152,43,190,120,32,151,217,29,120,244,201,75,192,72,174,46,210,253,1,192,106,65,102,165,247,150,94,28,79,42,57,121,93,159,150,151,229,35,241,242,77,107,25,5,245,215,126,96,231,98,209,142,95,222,182,235,194,9,142,82,122,181,233,55,104,0,70,217,208,188,33,188,136,223,49,234,48,99,86,143,34,214,249,97,154,106,158,4,7,189,166,189,191,1,193,216,173,180,110,54,21,8,9,83,29,114,78,154,165,206,41,255,183,123,134,17,15,199,225,116,146,16,217,205,42,172,190,168,56,25,17,70,128,165,118,35,216,198,102,117,96,122,1,16,114,207,174,254,202,115,201,155,87,164,241,34,239,24,150,71,253,173,57,169,69,17,94,204,118,77,238,6,206,241,137,99,220,68,38,141,100,248,65,232,249,47,121,81,65,147,30,52,83,38,177,218,235,154,214,191,179,249,198,233,11,69,161,140,25,240,14,98,161,76,105,7,60,155,81,190,132,39,54,219,150,146,153,53,46,46,254,80,38,84,185,153,158,232,222,252,140,93,113,18,52,225,22,119,169,54,46,206,17,138,73,171,3,63,230,69,187,131,129,32,227,224,145,118,91,92,246,19,73,233,89,253,241,85,62,152,108,130,6,33,212,62,97,68,198,139,206,170,126,55,169,207,214,127,65,56,110,195,38,93,124,118,137,179,196,202,238,214,89,29,214,111,225,161,177,10,243,20,30,228,75,168,121,129,19,203,105,215,171,119,14,178,185,194,161,92,1,126,198,57,156,169,254,128,36,21,153,229,54,160,54,11,142,28,81,110,134,102,22,167,62,218,113,194,44,111,222,44,148,211,185,73,9,4,129,240,177,184,230,149,163,13,73,123,27,177,46,30,67,210,62,72,251,110,89,45,233,219,246,195,81,103,145,166,204,176,169,31,116,12,206,122,102,185,97,148,222,5,6,241,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,116,111,111,32,102,97,114,32,98,97,99,107,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,99,111,100,101,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,32,99,111,100,101,0,0,0,0,0,49,46,50,46,53,0,0,0,16,0,17,0,18,0,0,0,8,0,7,0,9,0,6,0,10,0,5,0,11,0,4,0,12,0,3,0,13,0,2,0,14,0,1,0,15,0,0,0,105,110,99,111,114,114,101,99,116,32,104,101,97,100,101,114,32,99,104,101,99,107,0,0,117,110,107,110,111,119,110,32,99,111,109,112,114,101,115,115,105,111,110,32,109,101,116,104,111,100,0,0,0,0,0,0,105,110,118,97,108,105,100,32,119,105,110,100,111,119,32,115,105,122,101,0,0,0,0,0,117,110,107,110,111,119,110,32,104,101,97,100,101,114,32,102,108,97,103,115,32,115,101,116,0,0,0,0,0,0,0,0,104,101,97,100,101,114,32,99,114,99,32,109,105,115,109,97,116,99,104,0,0,0,0,0,105,110,118,97,108,105,100,32,98,108,111,99,107,32,116,121,112,101,0,0,0,0,0,0,105,110,118,97,108,105,100,32,115,116,111,114,101,100,32,98,108,111,99,107,32,108,101,110,103,116,104,115,0,0,0,0,116,111,111,32,109,97,110,121,32,108,101,110,103,116,104,32,111,114,32,100,105,115,116,97,110,99,101,32,115,121,109,98,111,108,115,0,0,0,0,0,105,110,118,97,108,105,100,32,99,111,100,101,32,108,101,110,103,116,104,115,32,115,101,116,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,98,105,116,32,108,101,110,103,116,104,32,114,101,112,101,97,116,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,99,111,100,101,32,45,45,32,109,105,115,115,105,110,103,32,101,110,100,45,111,102,45,98,108,111,99,107,0,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,115,32,115,101,116,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,115,32,115,101,116,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,32,99,111,100,101,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,99,111,100,101,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,116,111,111,32,102,97,114,32,98,97,99,107,0,0,0,105,110,99,111,114,114,101,99,116,32,100,97,116,97,32,99,104,101,99,107,0,0,0,0,105,110,99,111,114,114,101,99,116,32,108,101,110,103,116,104,32,99,104,101,99,107,0,0,96,7,0,0,0,8,80,0,0,8,16,0,20,8,115,0,18,7,31,0,0,8,112,0,0,8,48,0,0,9,192,0,16,7,10,0,0,8,96,0,0,8,32,0,0,9,160,0,0,8,0,0,0,8,128,0,0,8,64,0,0,9,224,0,16,7,6,0,0,8,88,0,0,8,24,0,0,9,144,0,19,7,59,0,0,8,120,0,0,8,56,0,0,9,208,0,17,7,17,0,0,8,104,0,0,8,40,0,0,9,176,0,0,8,8,0,0,8,136,0,0,8,72,0,0,9,240,0,16,7,4,0,0,8,84,0,0,8,20,0,21,8,227,0,19,7,43,0,0,8,116,0,0,8,52,0,0,9,200,0,17,7,13,0,0,8,100,0,0,8,36,0,0,9,168,0,0,8,4,0,0,8,132,0,0,8,68,0,0,9,232,0,16,7,8,0,0,8,92,0,0,8,28,0,0,9,152,0,20,7,83,0,0,8,124,0,0,8,60,0,0,9,216,0,18,7,23,0,0,8,108,0,0,8,44,0,0,9,184,0,0,8,12,0,0,8,140,0,0,8,76,0,0,9,248,0,16,7,3,0,0,8,82,0,0,8,18,0,21,8,163,0,19,7,35,0,0,8,114,0,0,8,50,0,0,9,196,0,17,7,11,0,0,8,98,0,0,8,34,0,0,9,164,0,0,8,2,0,0,8,130,0,0,8,66,0,0,9,228,0,16,7,7,0,0,8,90,0,0,8,26,0,0,9,148,0,20,7,67,0,0,8,122,0,0,8,58,0,0,9,212,0,18,7,19,0,0,8,106,0,0,8,42,0,0,9,180,0,0,8,10,0,0,8,138,0,0,8,74,0,0,9,244,0,16,7,5,0,0,8,86,0,0,8,22,0,64,8,0,0,19,7,51,0,0,8,118,0,0,8,54,0,0,9,204,0,17,7,15,0,0,8,102,0,0,8,38,0,0,9,172,0,0,8,6,0,0,8,134,0,0,8,70,0,0,9,236,0,16,7,9,0,0,8,94,0,0,8,30,0,0,9,156,0,20,7,99,0,0,8,126,0,0,8,62,0,0,9,220,0,18,7,27,0,0,8,110,0,0,8,46,0,0,9,188,0,0,8,14,0,0,8,142,0,0,8,78,0,0,9,252,0,96,7,0,0,0,8,81,0,0,8,17,0,21,8,131,0,18,7,31,0,0,8,113,0,0,8,49,0,0,9,194,0,16,7,10,0,0,8,97,0,0,8,33,0,0,9,162,0,0,8,1,0,0,8,129,0,0,8,65,0,0,9,226,0,16,7,6,0,0,8,89,0,0,8,25,0,0,9,146,0,19,7,59,0,0,8,121,0,0,8,57,0,0,9,210,0,17,7,17,0,0,8,105,0,0,8,41,0,0,9,178,0,0,8,9,0,0,8,137,0,0,8,73,0,0,9,242,0,16,7,4,0,0,8,85,0,0,8,21,0,16,8,2,1,19,7,43,0,0,8,117,0,0,8,53,0,0,9,202,0,17,7,13,0,0,8,101,0,0,8,37,0,0,9,170,0,0,8,5,0,0,8,133,0,0,8,69,0,0,9,234,0,16,7,8,0,0,8,93,0,0,8,29,0,0,9,154,0,20,7,83,0,0,8,125,0,0,8,61,0,0,9,218,0,18,7,23,0,0,8,109,0,0,8,45,0,0,9,186,0,0,8,13,0,0,8,141,0,0,8,77,0,0,9,250,0,16,7,3,0,0,8,83,0,0,8,19,0,21,8,195,0,19,7,35,0,0,8,115,0,0,8,51,0,0,9,198,0,17,7,11,0,0,8,99,0,0,8,35,0,0,9,166,0,0,8,3,0,0,8,131,0,0,8,67,0,0,9,230,0,16,7,7,0,0,8,91,0,0,8,27,0,0,9,150,0,20,7,67,0,0,8,123,0,0,8,59,0,0,9,214,0,18,7,19,0,0,8,107,0,0,8,43,0,0,9,182,0,0,8,11,0,0,8,139,0,0,8,75,0,0,9,246,0,16,7,5,0,0,8,87,0,0,8,23,0,64,8,0,0,19,7,51,0,0,8,119,0,0,8,55,0,0,9,206,0,17,7,15,0,0,8,103,0,0,8,39,0,0,9,174,0,0,8,7,0,0,8,135,0,0,8,71,0,0,9,238,0,16,7,9,0,0,8,95,0,0,8,31,0,0,9,158,0,20,7,99,0,0,8,127,0,0,8,63,0,0,9,222,0,18,7,27,0,0,8,111,0,0,8,47,0,0,9,190,0,0,8,15,0,0,8,143,0,0,8,79,0,0,9,254,0,96,7,0,0,0,8,80,0,0,8,16,0,20,8,115,0,18,7,31,0,0,8,112,0,0,8,48,0,0,9,193,0,16,7,10,0,0,8,96,0,0,8,32,0,0,9,161,0,0,8,0,0,0,8,128,0,0,8,64,0,0,9,225,0,16,7,6,0,0,8,88,0,0,8,24,0,0,9,145,0,19,7,59,0,0,8,120,0,0,8,56,0,0,9,209,0,17,7,17,0,0,8,104,0,0,8,40,0,0,9,177,0,0,8,8,0,0,8,136,0,0,8,72,0,0,9,241,0,16,7,4,0,0,8,84,0,0,8,20,0,21,8,227,0,19,7,43,0,0,8,116,0,0,8,52,0,0,9,201,0,17,7,13,0,0,8,100,0,0,8,36,0,0,9,169,0,0,8,4,0,0,8,132,0,0,8,68,0,0,9,233,0,16,7,8,0,0,8,92,0,0,8,28,0,0,9,153,0,20,7,83,0,0,8,124,0,0,8,60,0,0,9,217,0,18,7,23,0,0,8,108,0,0,8,44,0,0,9,185,0,0,8,12,0,0,8,140,0,0,8,76,0,0,9,249,0,16,7,3,0,0,8,82,0,0,8,18,0,21,8,163,0,19,7,35,0,0,8,114,0,0,8,50,0,0,9,197,0,17,7,11,0,0,8,98,0,0,8,34,0,0,9,165,0,0,8,2,0,0,8,130,0,0,8,66,0,0,9,229,0,16,7,7,0,0,8,90,0,0,8,26,0,0,9,149,0,20,7,67,0,0,8,122,0,0,8,58,0,0,9,213,0,18,7,19,0,0,8,106,0,0,8,42,0,0,9,181,0,0,8,10,0,0,8,138,0,0,8,74,0,0,9,245,0,16,7,5,0,0,8,86,0,0,8,22,0,64,8,0,0,19,7,51,0,0,8,118,0,0,8,54,0,0,9,205,0,17,7,15,0,0,8,102,0,0,8,38,0,0,9,173,0,0,8,6,0,0,8,134,0,0,8,70,0,0,9,237,0,16,7,9,0,0,8,94,0,0,8,30,0,0,9,157,0,20,7,99,0,0,8,126,0,0,8,62,0,0,9,221,0,18,7,27,0,0,8,110,0,0,8,46,0,0,9,189,0,0,8,14,0,0,8,142,0,0,8,78,0,0,9,253,0,96,7,0,0,0,8,81,0,0,8,17,0,21,8,131,0,18,7,31,0,0,8,113,0,0,8,49,0,0,9,195,0,16,7,10,0,0,8,97,0,0,8,33,0,0,9,163,0,0,8,1,0,0,8,129,0,0,8,65,0,0,9,227,0,16,7,6,0,0,8,89,0,0,8,25,0,0,9,147,0,19,7,59,0,0,8,121,0,0,8,57,0,0,9,211,0,17,7,17,0,0,8,105,0,0,8,41,0,0,9,179,0,0,8,9,0,0,8,137,0,0,8,73,0,0,9,243,0,16,7,4,0,0,8,85,0,0,8,21,0,16,8,2,1,19,7,43,0,0,8,117,0,0,8,53,0,0,9,203,0,17,7,13,0,0,8,101,0,0,8,37,0,0,9,171,0,0,8,5,0,0,8,133,0,0,8,69,0,0,9,235,0,16,7,8,0,0,8,93,0,0,8,29,0,0,9,155,0,20,7,83,0,0,8,125,0,0,8,61,0,0,9,219,0,18,7,23,0,0,8,109,0,0,8,45,0,0,9,187,0,0,8,13,0,0,8,141,0,0,8,77,0,0,9,251,0,16,7,3,0,0,8,83,0,0,8,19,0,21,8,195,0,19,7,35,0,0,8,115,0,0,8,51,0,0,9,199,0,17,7,11,0,0,8,99,0,0,8,35,0,0,9,167,0,0,8,3,0,0,8,131,0,0,8,67,0,0,9,231,0,16,7,7,0,0,8,91,0,0,8,27,0,0,9,151,0,20,7,67,0,0,8,123,0,0,8,59,0,0,9,215,0,18,7,19,0,0,8,107,0,0,8,43,0,0,9,183,0,0,8,11,0,0,8,139,0,0,8,75,0,0,9,247,0,16,7,5,0,0,8,87,0,0,8,23,0,64,8,0,0,19,7,51,0,0,8,119,0,0,8,55,0,0,9,207,0,17,7,15,0,0,8,103,0,0,8,39,0,0,9,175,0,0,8,7,0,0,8,135,0,0,8,71,0,0,9,239,0,16,7,9,0,0,8,95,0,0,8,31,0,0,9,159,0,20,7,99,0,0,8,127,0,0,8,63,0,0,9,223,0,18,7,27,0,0,8,111,0,0,8,47,0,0,9,191,0,0,8,15,0,0,8,143,0,0,8,79,0,0,9,255,0,16,5,1,0,23,5,1,1,19,5,17,0,27,5,1,16,17,5,5,0,25,5,1,4,21,5,65,0,29,5,1,64,16,5,3,0,24,5,1,2,20,5,33,0,28,5,1,32,18,5,9,0,26,5,1,8,22,5,129,0,64,5,0,0,16,5,2,0,23,5,129,1,19,5,25,0,27,5,1,24,17,5,7,0,25,5,1,6,21,5,97,0,29,5,1,96,16,5,4,0,24,5,1,3,20,5,49,0,28,5,1,48,18,5,13,0,26,5,1,12,22,5,193,0,64,5,0,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0,10,0,11,0,13,0,15,0,17,0,19,0,23,0,27,0,31,0,35,0,43,0,51,0,59,0,67,0,83,0,99,0,115,0,131,0,163,0,195,0,227,0,2,1,0,0,0,0,0,0,16,0,16,0,16,0,16,0,16,0,16,0,16,0,16,0,17,0,17,0,17,0,17,0,18,0,18,0,18,0,18,0,19,0,19,0,19,0,19,0,20,0,20,0,20,0,20,0,21,0,21,0,21,0,21,0,16,0,73,0,195,0,0,0,1,0,2,0,3,0,4,0,5,0,7,0,9,0,13,0,17,0,25,0,33,0,49,0,65,0,97,0,129,0,193,0,1,1,129,1,1,2,1,3,1,4,1,6,1,8,1,12,1,16,1,24,1,32,1,48,1,64,1,96,0,0,0,0,16,0,16,0,16,0,16,0,17,0,17,0,18,0,18,0,19,0,19,0,20,0,20,0,21,0,21,0,22,0,22,0,23,0,23,0,24,0,24,0,25,0,25,0,26,0,26,0,27,0,27,0,28,0,28,0,29,0,29,0,64,0,64], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+10240);
/* memory initializer */ allocate([224,62,0,0,23,0,0,0,24,0,0,0,3,0,0,0,8,0,0,0,1,0,0,0,1,0,0,0,9,0,0,0,10,0,0,0,9,0,0,0,11,0,0,0,12,0,0,0,1,0,0,0,10,0,0,0,2,0,0,0,78,83,116,51,95,95,49,49,49,95,95,115,116,100,111,117,116,98,117,102,73,119,69,69,0,0,0,0,0,0,0,0,160,108,0,0,192,62,0,0,16,69,0,0,0,0,0,0,0,0,0,0,72,63,0,0,25,0,0,0,26,0,0,0,4,0,0,0,8,0,0,0,1,0,0,0,1,0,0,0,13,0,0,0,10,0,0,0,9,0,0,0,14,0,0,0,15,0,0,0,3,0,0,0,11,0,0,0,4,0,0,0,78,83,116,51,95,95,49,49,48,95,95,115,116,100,105,110,98,117,102,73,119,69,69,0,160,108,0,0,48,63,0,0,16,69,0,0,0,0,0,0,117,110,115,117,112,112,111,114,116,101,100,32,108,111,99,97,108,101,32,102,111,114,32,115,116,97,110,100,97,114,100,32,105,110,112,117,116,0,0,0,0,0,0,0,224,63,0,0,27,0,0,0,28,0,0,0,5,0,0,0,12,0,0,0,2,0,0,0,2,0,0,0,16,0,0,0,17,0,0,0,13,0,0,0,18,0,0,0,19,0,0,0,5,0,0,0,14,0,0,0,6,0,0,0,78,83,116,51,95,95,49,49,49,95,95,115,116,100,111,117,116,98,117,102,73,99,69,69,0,0,0,0,0,0,0,0,160,108,0,0,192,63,0,0,208,68,0,0,0,0,0,0,0,0,0,0,72,64,0,0,29,0,0,0,30,0,0,0,6,0,0,0,12,0,0,0,2,0,0,0,2,0,0,0,20,0,0,0,17,0,0,0,13,0,0,0,21,0,0,0,22,0,0,0,7,0,0,0,15,0,0,0,8,0,0,0,78,83,116,51,95,95,49,49,48,95,95,115,116,100,105,110,98,117,102,73,99,69,69,0,160,108,0,0,48,64,0,0,208,68,0,0,0,0,0,0,78,83,116,51,95,95,49,49,52,95,95,115,104,97,114,101,100,95,99,111,117,110,116,69,0,0,0,0,0,0,0,0,120,108,0,0,88,64,0,0,0,0,0,0,192,64,0,0,31,0,0,0,32,0,0,0,23,0,0,0,0,0,0,0,0,0,0,0,40,65,0,0,33,0,0,0,34,0,0,0,24,0,0,0,0,0,0,0,83,116,49,49,108,111,103,105,99,95,101,114,114,111,114,0,160,108,0,0,176,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,0,0,31,0,0,0,35,0,0,0,23,0,0,0,0,0,0,0,83,116,49,50,108,101,110,103,116,104,95,101,114,114,111,114,0,0,0,0,0,0,0,0,160,108,0,0,232,64,0,0,192,64,0,0,0,0,0,0,83,116,49,51,114,117,110,116,105,109,101,95,101,114,114,111,114,0,0,0,0,0,0,0,160,108,0,0,16,65,0,0,0,0,0,0,0,0,0,0,58,32,0,0,0,0,0,0,0,0,0,0,112,65,0,0,36,0,0,0,37,0,0,0,24,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,50,115,121,115,116,101,109,95,101,114,114,111,114,69,0,0,160,108,0,0,88,65,0,0,40,65,0,0,0,0,0,0,78,83,116,51,95,95,49,49,52,101,114,114,111,114,95,99,97,116,101,103,111,114,121,69,0,0,0,0,0,0,0,0,120,108,0,0,128,65,0,0,78,83,116,51,95,95,49,49,50,95,95,100,111,95,109,101,115,115,97,103,101,69,0,0,160,108,0,0,168,65,0,0,160,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,97,115,105,99,95,115,116,114,105,110,103,0,0,0,0,0,0,0,0,208,68,0,0,38,0,0,0,39,0,0,0,7,0,0,0,12,0,0,0,2,0,0,0,2,0,0,0,20,0,0,0,17,0,0,0,13,0,0,0,18,0,0,0,19,0,0,0,5,0,0,0,15,0,0,0,8,0,0,0,0,0,0,0,16,69,0,0,40,0,0,0,41,0,0,0,8,0,0,0,8,0,0,0,1,0,0,0,1,0,0,0,13,0,0,0,10,0,0,0,9,0,0,0,11,0,0,0,12,0,0,0,1,0,0,0,11,0,0,0,4,0,0,0,8,0,0,0,0,0,0,0,72,69,0,0,42,0,0,0,43,0,0,0,248,255,255,255,248,255,255,255,72,69,0,0,44,0,0,0,45,0,0,0,8,0,0,0,0,0,0,0,144,69,0,0,46,0,0,0,47,0,0,0,248,255,255,255,248,255,255,255,144,69,0,0,48,0,0,0,49,0,0,0,4,0,0,0,0,0,0,0,216,69,0,0,50,0,0,0,51,0,0,0,252,255,255,255,252,255,255,255,216,69,0,0,52,0,0,0,53,0,0,0,4,0,0,0,0,0,0,0,32,70,0,0,54,0,0,0,55,0,0,0,252,255,255,255,252,255,255,255,32,70,0,0,56,0,0,0,57,0,0,0,105,111,115,116,114,101,97,109,0,0,0,0,0,0,0,0,117,110,115,112,101,99,105,102,105,101,100,32,105,111,115,116,114,101,97,109,95,99,97,116,101,103,111,114,121,32,101,114,114,111,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,67,0,0,58,0,0,0,59,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,16,68,0,0,60,0,0,0,61,0,0,0,105,111,115,95,98,97,115,101,58,58,99,108,101,97,114,0,78,83,116,51,95,95,49,56,105,111,115,95,98,97,115,101,55,102,97,105,108,117,114,101,69,0,0,0,0,0,0,0,160,108,0,0,200,67,0,0,112,65,0,0,0,0,0,0,78,83,116,51,95,95,49,56,105,111,115,95,98,97,115,101,69,0,0,0,0,0,0,0,120,108,0,0,248,67,0,0,78,83,116,51,95,95,49,57,98,97,115,105,99,95,105,111,115,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,0,0,0,0,0,160,108,0,0,24,68,0,0,16,68,0,0,0,0,0,0,78,83,116,51,95,95,49,57,98,97,115,105,99,95,105,111,115,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,0,0,0,0,0,160,108,0,0,88,68,0,0,16,68,0,0,0,0,0,0,78,83,116,51,95,95,49,49,53,98,97,115,105,99,95,115,116,114,101,97,109,98,117,102,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,0,0,0,0,0,0,120,108,0,0,152,68,0,0,78,83,116,51,95,95,49,49,53,98,97,115,105,99,95,115,116,114,101,97,109,98,117,102,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,0,0,0,0,0,0,120,108,0,0,216,68,0,0,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,105,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,0,109,0,0,24,69,0,0,0,0,0,0,1,0,0,0,72,68,0,0,3,244,255,255,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,105,115,116,114,101,97,109,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,0,109,0,0,96,69,0,0,0,0,0,0,1,0,0,0,136,68,0,0,3,244,255,255,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,111,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,0,109,0,0,168,69,0,0,0,0,0,0,1,0,0,0,72,68,0,0,3,244,255,255,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,111,115,116,114,101,97,109,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,0,109,0,0,240,69,0,0,0,0,0,0,1,0,0,0,136,68,0,0,3,244,255,255,0,0,0,0,128,70,0,0,62,0,0,0,63,0,0,0,25,0,0,0,10,0,0,0,16,0,0,0,17,0,0,0,11,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,57,95,95,105,111,115,116,114,101,97,109,95,99,97,116,101,103,111,114,121,69,0,0,0,160,108,0,0,96,70,0,0,192,65,0,0,0,0,0,0,0,0,0,0,168,84,0,0,64,0,0,0,65,0,0,0,66,0,0,0,1,0,0,0,3,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,84,0,0,67,0,0,0,68,0,0,0,66,0,0,0,2,0,0,0,4,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,89,0,0,69,0,0,0,70,0,0,0,66,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,65,66,67,68,69,70,120,88,43,45,112,80,105,73,110,78,0,0,0,0,0,0,0,0,37,112,0,0,0,0,0,0,0,0,0,0,24,90,0,0,71,0,0,0,72,0,0,0,66,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,18,0,0,0,19,0,0,0,20,0,0,0,21,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,90,0,0,73,0,0,0,74,0,0,0,66,0,0,0,3,0,0,0,4,0,0,0,23,0,0,0,5,0,0,0,24,0,0,0,1,0,0,0,2,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,91,0,0,75,0,0,0,76,0,0,0,66,0,0,0,7,0,0,0,8,0,0,0,25,0,0,0,9,0,0,0,26,0,0,0,3,0,0,0,4,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,0,0,0,0,37,112,0,0,0,0,0,0,0,0,0,0,152,86,0,0,77,0,0,0,78,0,0,0,66,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,31,0,0,0,1,0,0,0,248,255,255,255,152,86,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,31,0,0,0,32,0,0,0,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,72,58,37,77,58,37,83,37,109,47,37,100,47,37,121,37,89,45,37,109,45,37,100,37,73,58,37,77,58,37,83,32,37,112,0,0,0,0,0,37,72,58,37,77,0,0,0,37,72,58,37,77,58,37,83,0,0,0,0,56,87,0,0,79,0,0,0,80,0,0,0,66,0,0,0,34,0,0,0,32,0,0,0,33,0,0,0,34,0,0,0,35,0,0,0,36,0,0,0,2,0,0,0,248,255,255,255,56,87,0,0,35,0,0,0,36,0,0,0,37,0,0,0,38,0,0,0,39,0,0,0,40,0,0,0,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,37,0,0,0,109,0,0,0,47,0,0,0,37,0,0,0,100,0,0,0,47,0,0,0,37,0,0,0,121,0,0,0,37,0,0,0,89,0,0,0,45,0,0,0,37,0,0,0,109,0,0,0,45,0,0,0,37,0,0,0,100,0,0,0,37,0,0,0,73,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,32,0,0,0,37,0,0,0,112,0,0,0,0,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,0,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,0,0,0,0,200,87,0,0,81,0,0,0,82,0,0,0,66,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,88,0,0,83,0,0,0,84,0,0,0,66,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,85,0,0,85,0,0,0,86,0,0,0,66,0,0,0,42,0,0,0,43,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,44,0,0,0,13,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,85,0,0,87,0,0,0,88,0,0,0,66,0,0,0,45,0,0,0,46,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,18,0,0,0,47,0,0,0,19,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,85,0,0,89,0,0,0,90,0,0,0,66,0,0,0,48,0,0,0,49,0,0,0,21,0,0,0,22,0,0,0,23,0,0,0,24,0,0,0,50,0,0,0,25,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,85,0,0,91,0,0,0,92,0,0,0,66,0,0,0,51,0,0,0,52,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,53,0,0,0,31,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,92,0,0,93,0,0,0,94,0,0,0,66,0,0,0,3,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,49,50,51,52,53,54,55,56,57,0,0,0,0,0,0,37,76,102,0,0,0,0,0,109,111,110,101,121,95,103,101,116,32,101,114,114,111,114,0,0,0,0,0,144,92,0,0,95,0,0,0,96,0,0,0,66,0,0,0,5,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,49,50,51,52,53,54,55,56,57,0,0,0,0,0,0,0,0,0,0,32,93,0,0,97,0,0,0,98,0,0,0,66,0,0,0,1,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,46,48,76,102,0,0,0,0,0,0,0,176,93,0,0,99,0,0,0,100,0,0,0,66,0,0,0,2,0,0,0,38,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,88,0,0,101,0,0,0,102,0,0,0,66,0,0,0,20,0,0,0,11,0,0,0,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,88,0,0,103,0,0,0,104,0,0,0,66,0,0,0,21,0,0,0,12,0,0,0,34,0,0,0,0,0,0,0,0,0,0,0,118,101,99,116,111,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,0,0,0,0,0,0,0,0,128,84,0,0,105,0,0,0,106,0,0,0,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,81,0,0,107,0,0,0,108,0,0,0,66,0,0,0,9,0,0,0,22,0,0,0,10,0,0,0,23,0,0,0,11,0,0,0,1,0,0,0,24,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,82,0,0,109,0,0,0,110,0,0,0,66,0,0,0,1,0,0,0,2,0,0,0,4,0,0,0,54,0,0,0,55,0,0,0,5,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,84,0,0,111,0,0,0,112,0,0,0,66,0,0,0,57,0,0,0,58,0,0,0,35,0,0,0,36,0,0,0,37,0,0,0,0,0,0,0,88,84,0,0,113,0,0,0,114,0,0,0,66,0,0,0,59,0,0,0,60,0,0,0,38,0,0,0,39,0,0,0,40,0,0,0,116,114,117,101,0,0,0,0,116,0,0,0,114,0,0,0,117,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,102,97,108,115,101,0,0,0,102,0,0,0,97,0,0,0,108,0,0,0,115,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,109,47,37,100,47,37,121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,109,0,0,0,47,0,0,0,37,0,0,0,100,0,0,0,47,0,0,0,37,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,72,58,37,77,58,37,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,97,32,37,98,32,37,100,32,37,72,58,37,77,58,37,83,32,37,89,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,97,0,0,0,32,0,0,0,37,0,0,0,98,0,0,0,32,0,0,0,37,0,0,0,100,0,0,0,32,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,32,0,0,0,37,0,0,0,89,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,73,58,37,77,58,37,83,32,37,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,73,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,32,0,0,0,37,0,0,0,112,0,0,0,0,0,0,0,108,111,99,97,108,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,0,0,0,0,0,0,144,80,0,0,115,0,0,0,116,0,0,0,66,0,0,0,0,0,0,0,78,83,116,51,95,95,49,54,108,111,99,97,108,101,53,102,97,99,101,116,69,0,0,0,160,108,0,0,120,80,0,0,120,64,0,0,0,0,0,0,0,0,0,0,32,81,0,0,115,0,0,0,117,0,0,0,66,0,0,0,25,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,12,0,0,0,26,0,0,0,13,0,0,0,27,0,0,0,14,0,0,0,5,0,0,0,28,0,0,0,6,0,0,0,0,0,0,0,78,83,116,51,95,95,49,53,99,116,121,112,101,73,119,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,48,99,116,121,112,101,95,98,97,115,101,69,0,0,0,0,120,108,0,0,0,81,0,0,0,109,0,0,232,80,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,81,0,0,2,0,0,0,78,83,116,51,95,95,49,53,99,116,121,112,101,73,99,69,69,0,0,0,0,0,0,0,0,109,0,0,64,81,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,81,0,0,2,0,0,0,0,0,0,0,240,81,0,0,115,0,0,0,118,0,0,0,66,0,0,0,3,0,0,0,4,0,0,0,7,0,0,0,61,0,0,0,62,0,0,0,8,0,0,0,63,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,99,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,50,99,111,100,101,99,118,116,95,98,97,115,101,69,0,0,120,108,0,0,208,81,0,0,0,109,0,0,168,81,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,232,81,0,0,2,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,119,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,0,0,109,0,0,16,82,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,232,81,0,0,2,0,0,0,0,0,0,0,176,82,0,0,115,0,0,0,119,0,0,0,66,0,0,0,5,0,0,0,6,0,0,0,9,0,0,0,64,0,0,0,65,0,0,0,10,0,0,0,66,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,68,115,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,0,109,0,0,136,82,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,232,81,0,0,2,0,0,0,0,0,0,0,40,83,0,0,115,0,0,0,120,0,0,0,66,0,0,0,7,0,0,0,8,0,0,0,11,0,0,0,67,0,0,0,68,0,0,0,12,0,0,0,69,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,68,105,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,0,109,0,0,0,83,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,232,81,0,0,2,0,0,0,0,0,0,0,160,83,0,0,115,0,0,0,121,0,0,0,66,0,0,0,7,0,0,0,8,0,0,0,11,0,0,0,67,0,0,0,68,0,0,0,12,0,0,0,69,0,0,0,78,83,116,51,95,95,49,49,54,95,95,110,97,114,114,111,119,95,116,111,95,117,116,102,56,73,76,106,51,50,69,69,69,0,0,0,0,0,0,0,160,108,0,0,120,83,0,0,40,83,0,0,0,0,0,0,0,0,0,0,8,84,0,0,115,0,0,0,122,0,0,0,66,0,0,0,7,0,0,0,8,0,0,0,11,0,0,0,67,0,0,0,68,0,0,0,12,0,0,0,69,0,0,0,78,83,116,51,95,95,49,49,55,95,95,119,105,100,101,110,95,102,114,111,109,95,117,116,102,56,73,76,106,51,50,69,69,69,0,0,0,0,0,0,160,108,0,0,224,83,0,0,40,83,0,0,0,0,0,0,78,83,116,51,95,95,49,56,110,117,109,112,117,110,99,116,73,99,69,69,0,0,0,0,160,108,0,0,24,84,0,0,144,80,0,0,0,0,0,0,78,83,116,51,95,95,49,56,110,117,109,112,117,110,99,116,73,119,69,69,0,0,0,0,160,108,0,0,64,84,0,0,144,80,0,0,0,0,0,0,78,83,116,51,95,95,49,54,108,111,99,97,108,101,53,95,95,105,109,112,69,0,0,0,160,108,0,0,104,84,0,0,144,80,0,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,108,108,97,116,101,73,99,69,69,0,0,0,0,0,160,108,0,0,144,84,0,0,144,80,0,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,108,108,97,116,101,73,119,69,69,0,0,0,0,0,160,108,0,0,184,84,0,0,144,80,0,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,99,76,98,48,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,95,98,97,115,101,69,0,0,0,0,120,108,0,0,0,85,0,0,0,109,0,0,224,84,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,85,0,0,2,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,99,76,98,49,69,69,69,0,0,0,0,0,0,109,0,0,64,85,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,85,0,0,2,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,119,76,98,48,69,69,69,0,0,0,0,0,0,109,0,0,128,85,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,85,0,0,2,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,119,76,98,49,69,69,69,0,0,0,0,0,0,109,0,0,192,85,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,85,0,0,2,0,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,103,101,116,73,99,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,57,116,105,109,101,95,98,97,115,101,69,0,0,0,0,0,0,120,108,0,0,72,86,0,0,78,83,116,51,95,95,49,50,48,95,95,116,105,109,101,95,103,101,116,95,99,95,115,116,111,114,97,103,101,73,99,69,69,0,0,0,0,0,0,0,120,108,0,0,104,86,0,0,0,109,0,0,0,86,0,0,0,0,0,0,3,0,0,0,144,80,0,0,2,0,0,0,96,86,0,0,2,0,0,0,144,86,0,0,0,8,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,103,101,116,73,119,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,50,48,95,95,116,105,109,101,95,103,101,116,95,99,95,115,116,111,114,97,103,101,73,119,69,69,0,0,0,0,0,0,0,120,108,0,0,8,87,0,0,0,109,0,0,192,86,0,0,0,0,0,0,3,0,0,0,144,80,0,0,2,0,0,0,96,86,0,0,2,0,0,0,48,87,0,0,0,8,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,112,117,116,73,99,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,49,48,95,95,116,105,109,101,95,112,117,116,69,0,0,0,0,120,108,0,0,168,87,0,0,0,109,0,0,96,87,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,192,87,0,0,0,8,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,112,117,116,73,119,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,0,109,0,0,232,87,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,192,87,0,0,0,8,0,0,78,83,116,51,95,95,49,56,109,101,115,115,97,103,101,115,73,99,69,69,0,0,0,0,78,83,116,51,95,95,49,49,51,109,101,115,115,97,103,101,115,95,98,97,115,101,69,0,120,108,0,0,104,88,0,0,0,109,0,0,80,88,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,128,88,0,0,2,0,0,0,78,83,116,51,95,95,49,56,109,101,115,115,97,103,101,115,73,119,69,69,0,0,0,0,0,109,0,0,168,88,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,128,88,0,0,2,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,103,101,116,73,99,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,103,101,116,73,99,69,69,0,0,0,78,83,116,51,95,95,49,49,52,95,95,110,117,109,95,103,101,116,95,98,97,115,101,69,0,0,0,0,0,0,0,0,120,108,0,0,64,89,0,0,0,109,0,0,40,89,0,0,0,0,0,0,1,0,0,0,96,89,0,0,0,0,0,0,0,109,0,0,224,88,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,104,89,0,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,103,101,116,73,119,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,103,101,116,73,119,69,69,0,0,0,0,109,0,0,232,89,0,0,0,0,0,0,1,0,0,0,96,89,0,0,0,0,0,0,0,109,0,0,160,89,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,0,90,0,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,112,117,116,73,99,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,112,117,116,73,99,69,69,0,0,0,78,83,116,51,95,95,49,49,52,95,95,110,117,109,95,112,117,116,95,98,97,115,101,69,0,0,0,0,0,0,0,0,120,108,0,0,152,90,0,0,0,109,0,0,128,90,0,0,0,0,0,0,1,0,0,0,184,90,0,0,0,0,0,0,0,109,0,0,56,90,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,192,90,0,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,112,117,116,73,119,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,112,117,116,73,119,69,69,0,0,0,0,109,0,0,64,91,0,0,0,0,0,0,1,0,0,0,184,90,0,0,0,0,0,0,0,109,0,0,248,90,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,88,91,0,0,0,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,103,101,116,73,99,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,103,101,116,73,99,69,69,0,0,0,0,0,0,0,0,120,108,0,0,216,91,0,0,0,109,0,0,144,91,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,248,91,0,0,0,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,103,101,116,73,119,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,103,101,116,73,119,69,69,0,0,0,0,0,0,0,0,120,108,0,0,104,92,0,0,0,109,0,0,32,92,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,136,92,0,0,0,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,112,117,116,73,99,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,112,117,116,73,99,69,69,0,0,0,0,0,0,0,0,120,108,0,0,248,92,0,0,0,109,0,0,176,92,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,24,93,0,0,0,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,112,117,116,73,119,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,112,117,116,73,119,69,69,0,0,0,0,0,0,0,0,120,108,0,0,136,93,0,0,0,109,0,0,64,93,0,0,0,0,0,0,2,0,0,0,144,80,0,0,2,0,0,0,168,93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,0,0,0,77,0,0,0,0,0,0,0,0,0,0,0,80,0,0,0,77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,77,0,0,0,0,0,0,80,77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,74,0,0,0,97,0,0,0,110,0,0,0,117,0,0,0,97,0,0,0,114,0,0,0,121,0,0,0,0,0,0,0,70,0,0,0,101,0,0,0,98,0,0,0,114,0,0,0,117,0,0,0,97,0,0,0,114,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,77,0,0,0,97,0,0,0,114,0,0,0,99,0,0,0,104,0,0,0,0,0,0,0,65,0,0,0,112,0,0,0,114,0,0,0,105,0,0,0,108,0,0,0,0,0,0,0,74,0,0,0,117,0,0,0,110,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,74,0,0,0,117,0,0,0,108,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,65,0,0,0,117,0,0,0,103,0,0,0,117,0,0,0,115,0,0,0,116,0,0,0,0,0,0,0,0,0,0,0,83,0,0,0,101,0,0,0,112,0,0,0,116,0,0,0,101,0,0,0,109,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,79,0,0,0,99,0,0,0,116,0,0,0,111,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,78,0,0,0,111,0,0,0,118,0,0,0,101,0,0,0,109,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,101,0,0,0,99,0,0,0,101,0,0,0,109,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,0,0,0,0,74,0,0,0,97,0,0,0,110,0,0,0,0,0,0,0,70,0,0,0,101,0,0,0,98,0,0,0,0,0,0,0,77,0,0,0,97,0,0,0,114,0,0,0,0,0,0,0,65,0,0,0,112,0,0,0,114,0,0,0,0,0,0,0,77,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,74,0,0,0,117,0,0,0,110,0,0,0,0,0,0,0,74,0,0,0,117,0,0,0,108,0,0,0,0,0,0,0,65,0,0,0,117,0,0,0,103,0,0,0,0,0,0,0,83,0,0,0,101,0,0,0,112,0,0,0,0,0,0,0,79,0,0,0,99,0,0,0,116,0,0,0,0,0,0,0,78,0,0,0,111,0,0,0,118,0,0,0,0,0,0,0,68,0,0,0,101,0,0,0,99], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+15996);
/* memory initializer */ allocate([74,97,110,117,97,114,121,0,70,101,98,114,117,97,114,121,0,0,0,0,0,0,0,0,77,97,114,99,104,0,0,0,65,112,114,105,108,0,0,0,77,97,121,0,0,0,0,0,74,117,110,101,0,0,0,0,74,117,108,121,0,0,0,0,65,117,103,117,115,116,0,0,83,101,112,116,101,109,98,101,114,0,0,0,0,0,0,0,79,99,116,111,98,101,114,0,78,111,118,101,109,98,101,114,0,0,0,0,0,0,0,0,68,101,99,101,109,98,101,114,0,0,0,0,0,0,0,0,74,97,110,0,0,0,0,0,70,101,98,0,0,0,0,0,77,97,114,0,0,0,0,0,65,112,114,0,0,0,0,0,74,117,110,0,0,0,0,0,74,117,108,0,0,0,0,0,65,117,103,0,0,0,0,0,83,101,112,0,0,0,0,0,79,99,116,0,0,0,0,0,78,111,118,0,0,0,0,0,68,101,99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,0,0,0,117,0,0,0,110,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,77,0,0,0,111,0,0,0,110,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,84,0,0,0,117,0,0,0,101,0,0,0,115,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,87,0,0,0,101,0,0,0,100,0,0,0,110,0,0,0,101,0,0,0,115,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,84,0,0,0,104,0,0,0,117,0,0,0,114,0,0,0,115,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,70,0,0,0,114,0,0,0,105,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,83,0,0,0,97,0,0,0,116,0,0,0,117,0,0,0,114,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,83,0,0,0,117,0,0,0,110,0,0,0,0,0,0,0,77,0,0,0,111,0,0,0,110,0,0,0,0,0,0,0,84,0,0,0,117,0,0,0,101,0,0,0,0,0,0,0,87,0,0,0,101,0,0,0,100,0,0,0,0,0,0,0,84,0,0,0,104,0,0,0,117,0,0,0,0,0,0,0,70,0,0,0,114,0,0,0,105,0,0,0,0,0,0,0,83,0,0,0,97,0,0,0,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,117,110,100,97,121,0,0,77,111,110,100,97,121,0,0,84,117,101,115,100,97,121,0,87,101,100,110,101,115,100,97,121,0,0,0,0,0,0,0,84,104,117,114,115,100,97,121,0,0,0,0,0,0,0,0,70,114,105,100,97,121,0,0,83,97,116,117,114,100,97,121,0,0,0,0,0,0,0,0,83,117,110,0,0,0,0,0,77,111,110,0,0,0,0,0,84,117,101,0,0,0,0,0,87,101,100,0,0,0,0,0,84,104,117,0,0,0,0,0,70,114,105,0,0,0,0,0,83,97,116,0,0,0,0,0,2,0,0,192,3,0,0,192,4,0,0,192,5,0,0,192,6,0,0,192,7,0,0,192,8,0,0,192,9,0,0,192,10,0,0,192,11,0,0,192,12,0,0,192,13,0,0,192,14,0,0,192,15,0,0,192,16,0,0,192,17,0,0,192,18,0,0,192,19,0,0,192,20,0,0,192,21,0,0,192,22,0,0,192,23,0,0,192,24,0,0,192,25,0,0,192,26,0,0,192,27,0,0,192,28,0,0,192,29,0,0,192,30,0,0,192,31,0,0,192,0,0,0,179,1,0,0,195,2,0,0,195,3,0,0,195,4,0,0,195,5,0,0,195,6,0,0,195,7,0,0,195,8,0,0,195,9,0,0,195,10,0,0,195,11,0,0,195,12,0,0,195,13,0,0,211,14,0,0,195,15,0,0,195,0,0,12,187,1,0,12,195,2,0,12,195,3,0,12,195,4,0,12,211,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,107,0,0,123,0,0,0,124,0,0,0,70,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,99,97,115,116,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,120,108,0,0,200,107,0,0,83,116,56,98,97,100,95,99,97,115,116,0,0,0,0,0,160,108,0,0,224,107,0,0,0,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,160,108,0,0,0,108,0,0,216,107,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,160,108,0,0,56,108,0,0,40,108,0,0,0,0,0,0,0,0,0,0,96,108,0,0,125,0,0,0,126,0,0,0,127,0,0,0,128,0,0,0,29,0,0,0,13,0,0,0,1,0,0,0,5,0,0,0,0,0,0,0,232,108,0,0,125,0,0,0,129,0,0,0,127,0,0,0,128,0,0,0,29,0,0,0,14,0,0,0,2,0,0,0,6,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,160,108,0,0,192,108,0,0,96,108,0,0,0,0,0,0,0,0,0,0,72,109,0,0,125,0,0,0,130,0,0,0,127,0,0,0,128,0,0,0,29,0,0,0,15,0,0,0,3,0,0,0,7,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,49,95,95,118,109,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,160,108,0,0,32,109,0,0,96,108,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,111,0,0,131,0,0,0,132,0,0,0,71,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,160,108,0,0,120,111,0,0,0,0,0,0,0,0,0,0,105,110,102,105,110,105,116,121,0,0,0,0,0,0,0,0,110,97,110,0,0,0,0,0,95,112,137,0,255,9,47,15,10,0,0,0,100,0,0,0,232,3,0,0,16,39,0,0,160,134,1,0,64,66,15,0,128,150,152,0,0,225,245,5], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+26256);




var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  
  function _atexit(func, arg) {
      __ATEXIT__.unshift({ func: func, arg: arg });
    }var ___cxa_atexit=_atexit;

  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
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
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
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
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = Math.floor(idx / this.chunkSize);
          return this.getter(chunkNum)[chunkOffset];
        }
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        }
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var chunkSize = 1024*1024; // Chunk size in bytes
  
            if (!hasByteServing) chunkSize = datalength;
  
            // Function to get a range from the remote URL.
            var doXHR = (function(from, to) {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
              // Some hints to the browser that we want binary data.
              if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
  
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || []);
              } else {
                return intArrayFromString(xhr.responseText || '', true);
              }
            });
            var lazyArray = this;
            lazyArray.setDataGetter(function(chunkNum) {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
              return lazyArray.chunks[chunkNum];
            });
  
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
        }
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  
  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        
        // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
        // Module['forcedAspectRatio'] = 4 / 3;
        
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'] ||
                                    canvas['msRequestPointerLock'] ||
                                    function(){};
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 document['msExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas ||
                                document['msPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement'] ||
               document['msFullScreenElement'] || document['msFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'] ||
                                      document['msExitFullscreen'] ||
                                      document['exitFullscreen'] ||
                                      function() {};
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
          document.addEventListener('MSFullscreenChange', fullScreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullScreen = canvasContainer['requestFullScreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvasContainer.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
            
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              Browser.lastTouches[touch.identifier] = Browser.touches[touch.identifier];
              Browser.touches[touch.identifier] = { x: adjustedX, y: adjustedY };
            } 
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
             document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
             document['fullScreenElement'] || document['fullscreenElement'] ||
             document['msFullScreenElement'] || document['msFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      }};
  
  function _SDL_GetTicks() {
      return Math.floor(Date.now() - SDL.startTime);
    }var SDL={defaults:{width:320,height:200,copyOnLock:true},version:null,surfaces:{},canvasPool:[],events:[],fonts:[null],audios:[null],rwops:[null],music:{audio:null,volume:1},mixerFrequency:22050,mixerFormat:32784,mixerNumChannels:2,mixerChunkSize:1024,channelMinimumNumber:0,GL:false,glAttributes:{0:3,1:3,2:2,3:0,4:0,5:1,6:16,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:1,16:0,17:0,18:0},keyboardState:null,keyboardMap:{},canRequestFullscreen:false,isRequestingFullscreen:false,textInput:false,startTime:null,initFlags:0,buttonState:0,modState:0,DOMButtons:[0,0,0],DOMEventToSDLEvent:{},TOUCH_DEFAULT_ID:0,keyCodes:{16:1249,17:1248,18:1250,20:1081,33:1099,34:1102,35:1101,36:1098,37:1104,38:1106,39:1103,40:1105,44:316,45:1097,46:127,91:1251,93:1125,96:1122,97:1113,98:1114,99:1115,100:1116,101:1117,102:1118,103:1119,104:1120,105:1121,106:1109,107:1111,109:1110,110:1123,111:1108,112:1082,113:1083,114:1084,115:1085,116:1086,117:1087,118:1088,119:1089,120:1090,121:1091,122:1092,123:1093,124:1128,125:1129,126:1130,127:1131,128:1132,129:1133,130:1134,131:1135,132:1136,133:1137,134:1138,135:1139,144:1107,160:94,161:33,162:34,163:35,164:36,165:37,166:38,167:95,168:40,169:41,170:42,171:43,172:124,173:45,174:123,175:125,176:126,181:127,182:129,183:128,188:44,190:46,191:47,192:96,219:91,220:92,221:93,222:39},scanCodes:{8:42,9:43,13:40,27:41,32:44,35:204,39:53,44:54,46:55,47:56,48:39,49:30,50:31,51:32,52:33,53:34,54:35,55:36,56:37,57:38,58:203,59:51,61:46,91:47,92:49,93:48,96:52,97:4,98:5,99:6,100:7,101:8,102:9,103:10,104:11,105:12,106:13,107:14,108:15,109:16,110:17,111:18,112:19,113:20,114:21,115:22,116:23,117:24,118:25,119:26,120:27,121:28,122:29,127:76,305:224,308:226,316:70},loadRect:function (rect) {
        return {
          x: HEAP32[((rect + 0)>>2)],
          y: HEAP32[((rect + 4)>>2)],
          w: HEAP32[((rect + 8)>>2)],
          h: HEAP32[((rect + 12)>>2)]
        };
      },loadColorToCSSRGB:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgb(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ')';
      },loadColorToCSSRGBA:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgba(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ',' + (((rgba >> 24)&255)/255) + ')';
      },translateColorToCSSRGBA:function (rgba) {
        return 'rgba(' + (rgba&0xff) + ',' + (rgba>>8 & 0xff) + ',' + (rgba>>16 & 0xff) + ',' + (rgba>>>24)/0xff + ')';
      },translateRGBAToCSSRGBA:function (r, g, b, a) {
        return 'rgba(' + (r&0xff) + ',' + (g&0xff) + ',' + (b&0xff) + ',' + (a&0xff)/255 + ')';
      },translateRGBAToColor:function (r, g, b, a) {
        return r | g << 8 | b << 16 | a << 24;
      },makeSurface:function (width, height, flags, usePageCanvas, source, rmask, gmask, bmask, amask) {
        flags = flags || 0;
        var is_SDL_HWSURFACE = flags & 0x00000001;
        var is_SDL_HWPALETTE = flags & 0x00200000;
        var is_SDL_OPENGL = flags & 0x04000000;
  
        var surf = _malloc(60);
        var pixelFormat = _malloc(44);
        //surface with SDL_HWPALETTE flag is 8bpp surface (1 byte)
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
        var buffer = 0;
  
        // preemptively initialize this for software surfaces,
        // otherwise it will be lazily initialized inside of SDL_LockSurface
        if (!is_SDL_HWSURFACE && !is_SDL_OPENGL) {
          buffer = _malloc(width * height * 4);
        }
  
        HEAP32[((surf)>>2)]=flags;
        HEAP32[(((surf)+(4))>>2)]=pixelFormat;
        HEAP32[(((surf)+(8))>>2)]=width;
        HEAP32[(((surf)+(12))>>2)]=height;
        HEAP32[(((surf)+(16))>>2)]=width * bpp;  // assuming RGBA or indexed for now,
                                                                                          // since that is what ImageData gives us in browsers
        HEAP32[(((surf)+(20))>>2)]=buffer;
        HEAP32[(((surf)+(36))>>2)]=0;
        HEAP32[(((surf)+(56))>>2)]=1;
  
        HEAP32[((pixelFormat)>>2)]=0 /* XXX missing C define SDL_PIXELFORMAT_RGBA8888 */;
        HEAP32[(((pixelFormat)+(4))>>2)]=0;// TODO
        HEAP8[(((pixelFormat)+(8))|0)]=bpp * 8;
        HEAP8[(((pixelFormat)+(9))|0)]=bpp;
  
        HEAP32[(((pixelFormat)+(12))>>2)]=rmask || 0x000000ff;
        HEAP32[(((pixelFormat)+(16))>>2)]=gmask || 0x0000ff00;
        HEAP32[(((pixelFormat)+(20))>>2)]=bmask || 0x00ff0000;
        HEAP32[(((pixelFormat)+(24))>>2)]=amask || 0xff000000;
  
        // Decide if we want to use WebGL or not
        SDL.GL = SDL.GL || is_SDL_OPENGL;
        var canvas;
        if (!usePageCanvas) {
          if (SDL.canvasPool.length > 0) {
            canvas = SDL.canvasPool.pop();
          } else {
            canvas = document.createElement('canvas');
          }
          canvas.width = width;
          canvas.height = height;
        } else {
          canvas = Module['canvas'];
        }
  
        var webGLContextAttributes = {
          antialias: ((SDL.glAttributes[13 /*SDL_GL_MULTISAMPLEBUFFERS*/] != 0) && (SDL.glAttributes[14 /*SDL_GL_MULTISAMPLESAMPLES*/] > 1)),
          depth: (SDL.glAttributes[6 /*SDL_GL_DEPTH_SIZE*/] > 0),
          stencil: (SDL.glAttributes[7 /*SDL_GL_STENCIL_SIZE*/] > 0)
        };
        
        var ctx = Browser.createContext(canvas, is_SDL_OPENGL, usePageCanvas, webGLContextAttributes);
              
        SDL.surfaces[surf] = {
          width: width,
          height: height,
          canvas: canvas,
          ctx: ctx,
          surf: surf,
          buffer: buffer,
          pixelFormat: pixelFormat,
          alpha: 255,
          flags: flags,
          locked: 0,
          usePageCanvas: usePageCanvas,
          source: source,
  
          isFlagSet: function(flag) {
            return flags & flag;
          }
        };
  
        return surf;
      },copyIndexedColorData:function (surfData, rX, rY, rW, rH) {
        // HWPALETTE works with palette
        // setted by SDL_SetColors
        if (!surfData.colors) {
          return;
        }
        
        var fullWidth  = Module['canvas'].width;
        var fullHeight = Module['canvas'].height;
  
        var startX  = rX || 0;
        var startY  = rY || 0;
        var endX    = (rW || (fullWidth - startX)) + startX;
        var endY    = (rH || (fullHeight - startY)) + startY;
        
        var buffer  = surfData.buffer;
        var data    = surfData.image.data;
        var colors  = surfData.colors;
  
        for (var y = startY; y < endY; ++y) {
          var indexBase = y * fullWidth;
          var colorBase = indexBase * 4;
          for (var x = startX; x < endX; ++x) {
            // HWPALETTE have only 256 colors (not rgba)
            var index = HEAPU8[((buffer + indexBase + x)|0)] * 3;
            var colorOffset = colorBase + x * 4;
  
            data[colorOffset   ] = colors[index   ];
            data[colorOffset +1] = colors[index +1];
            data[colorOffset +2] = colors[index +2];
            //unused: data[colorOffset +3] = color[index +3];
          }
        }
      },freeSurface:function (surf) {
        var refcountPointer = surf + 56;
        var refcount = HEAP32[((refcountPointer)>>2)];
        if (refcount > 1) {
          HEAP32[((refcountPointer)>>2)]=refcount - 1;
          return;
        }
  
        var info = SDL.surfaces[surf];
        if (!info.usePageCanvas && info.canvas) SDL.canvasPool.push(info.canvas);
        if (info.buffer) _free(info.buffer);
        _free(info.pixelFormat);
        _free(surf);
        SDL.surfaces[surf] = null;
  
        if (surf === SDL.screen) {
          SDL.screen = null;
        }
      },downFingers:{},savedKeydown:null,receiveEvent:function (event) {
        switch(event.type) {
          case 'touchstart': case 'touchmove': {
            event.preventDefault();
  
            var touches = [];
            
            // Clear out any touchstart events that we've already processed
            if (event.type === 'touchstart') {
              for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                if (SDL.downFingers[touch.identifier] != true) {
                  SDL.downFingers[touch.identifier] = true;
                  touches.push(touch);
                }
              }
            } else {
              touches = event.touches;
            }
            
            var firstTouch = touches[0];
            if (event.type == 'touchstart') {
              SDL.DOMButtons[0] = 1;
            }
            var mouseEventType;
            switch(event.type) {
              case 'touchstart': mouseEventType = 'mousedown'; break;
              case 'touchmove': mouseEventType = 'mousemove'; break;
            }
            var mouseEvent = {
              type: mouseEventType,
              button: 0,
              pageX: firstTouch.clientX,
              pageY: firstTouch.clientY
            };
            SDL.events.push(mouseEvent);
  
            for (var i = 0; i < touches.length; i++) {
              var touch = touches[i];
              SDL.events.push({
                type: event.type,
                touch: touch
              });
            };
            break;
          }
          case 'touchend': {
            event.preventDefault();
            
            // Remove the entry in the SDL.downFingers hash
            // because the finger is no longer down.
            for(var i = 0; i < event.changedTouches.length; i++) {
              var touch = event.changedTouches[i];
              if (SDL.downFingers[touch.identifier] === true) {
                delete SDL.downFingers[touch.identifier];
              }
            }
  
            var mouseEvent = {
              type: 'mouseup',
              button: 0,
              pageX: event.changedTouches[0].clientX,
              pageY: event.changedTouches[0].clientY
            };
            SDL.DOMButtons[0] = 0;
            SDL.events.push(mouseEvent);
            
            for (var i = 0; i < event.changedTouches.length; i++) {
              var touch = event.changedTouches[i];
              SDL.events.push({
                type: 'touchend',
                touch: touch
              });
            };
            break;
          }
          case 'mousemove':
            if (SDL.DOMButtons[0] === 1) {
              SDL.events.push({
                type: 'touchmove',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
            }
            if (Browser.pointerLock) {
              // workaround for firefox bug 750111
              if ('mozMovementX' in event) {
                event['movementX'] = event['mozMovementX'];
                event['movementY'] = event['mozMovementY'];
              }
              // workaround for Firefox bug 782777
              if (event['movementX'] == 0 && event['movementY'] == 0) {
                // ignore a mousemove event if it doesn't contain any movement info
                // (without pointer lock, we infer movement from pageX/pageY, so this check is unnecessary)
                event.preventDefault();
                return;
              }
            }
            // fall through
          case 'keydown': case 'keyup': case 'keypress': case 'mousedown': case 'mouseup': case 'DOMMouseScroll': case 'mousewheel':
            // If we preventDefault on keydown events, the subsequent keypress events
            // won't fire. However, it's fine (and in some cases necessary) to
            // preventDefault for keys that don't generate a character. Otherwise,
            // preventDefault is the right thing to do in general.
            if (event.type !== 'keydown' || (!SDL.unicode && !SDL.textInput) || (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */)) {
              event.preventDefault();
            }
  
            if (event.type == 'DOMMouseScroll' || event.type == 'mousewheel') {
              var button = Browser.getMouseWheelDelta(event) > 0 ? 4 : 3;
              var event2 = {
                type: 'mousedown',
                button: button,
                pageX: event.pageX,
                pageY: event.pageY
              };
              SDL.events.push(event2);
              event = {
                type: 'mouseup',
                button: button,
                pageX: event.pageX,
                pageY: event.pageY
              };
            } else if (event.type == 'mousedown') {
              SDL.DOMButtons[event.button] = 1;
              SDL.events.push({
                type: 'touchstart',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
            } else if (event.type == 'mouseup') {
              // ignore extra ups, can happen if we leave the canvas while pressing down, then return,
              // since we add a mouseup in that case
              if (!SDL.DOMButtons[event.button]) {
                return;
              }
  
              SDL.events.push({
                type: 'touchend',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
              SDL.DOMButtons[event.button] = 0;
            }
  
            // We can only request fullscreen as the result of user input.
            // Due to this limitation, we toggle a boolean on keydown which
            // SDL_WM_ToggleFullScreen will check and subsequently set another
            // flag indicating for us to request fullscreen on the following
            // keyup. This isn't perfect, but it enables SDL_WM_ToggleFullScreen
            // to work as the result of a keypress (which is an extremely
            // common use case).
            if (event.type === 'keydown' || event.type === 'mousedown') {
              SDL.canRequestFullscreen = true;
            } else if (event.type === 'keyup' || event.type === 'mouseup') {
              if (SDL.isRequestingFullscreen) {
                Module['requestFullScreen'](true, true);
                SDL.isRequestingFullscreen = false;
              }
              SDL.canRequestFullscreen = false;
            }
  
            // SDL expects a unicode character to be passed to its keydown events.
            // Unfortunately, the browser APIs only provide a charCode property on
            // keypress events, so we must backfill in keydown events with their
            // subsequent keypress event's charCode.
            if (event.type === 'keypress' && SDL.savedKeydown) {
              // charCode is read-only
              SDL.savedKeydown.keypressCharCode = event.charCode;
              SDL.savedKeydown = null;
            } else if (event.type === 'keydown') {
              SDL.savedKeydown = event;
            }
  
            // Don't push keypress events unless SDL_StartTextInput has been called.
            if (event.type !== 'keypress' || SDL.textInput) {
              SDL.events.push(event);
            }
            break;
          case 'mouseout':
            // Un-press all pressed mouse buttons, because we might miss the release outside of the canvas
            for (var i = 0; i < 3; i++) {
              if (SDL.DOMButtons[i]) {
                SDL.events.push({
                  type: 'mouseup',
                  button: i,
                  pageX: event.pageX,
                  pageY: event.pageY
                });
                SDL.DOMButtons[i] = 0;
              }
            }
            event.preventDefault();
            break;
          case 'blur':
          case 'visibilitychange': {
            // Un-press all pressed keys: TODO
            for (var code in SDL.keyboardMap) {
              SDL.events.push({
                type: 'keyup',
                keyCode: SDL.keyboardMap[code]
              });
            }
            event.preventDefault();
            break;
          }
          case 'unload':
            if (Browser.mainLoop.runner) {
              SDL.events.push(event);
              // Force-run a main event loop, since otherwise this event will never be caught!
              Browser.mainLoop.runner();
            }
            return;
          case 'resize':
            SDL.events.push(event);
            // manually triggered resize event doesn't have a preventDefault member
            if (event.preventDefault) {
              event.preventDefault();
            }
            break;
        }
        if (SDL.events.length >= 10000) {
          Module.printErr('SDL event queue full, dropping events');
          SDL.events = SDL.events.slice(0, 10000);
        }
        return;
      },handleEvent:function (event) {
        if (event.handled) return;
        event.handled = true;
  
        switch (event.type) {
          case 'touchstart': case 'touchend': case 'touchmove': {
            Browser.calculateMouseEvent(event);
            break;
          }
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            var code = event.keyCode;
            if (code >= 65 && code <= 90) {
              code += 32; // make lowercase for SDL
            } else {
              code = SDL.keyCodes[event.keyCode] || event.keyCode;
            }
  
            HEAP8[(((SDL.keyboardState)+(code))|0)]=down;
            // TODO: lmeta, rmeta, numlock, capslock, KMOD_MODE, KMOD_RESERVED
            SDL.modState = (HEAP8[(((SDL.keyboardState)+(1248))|0)] ? 0x0040 | 0x0080 : 0) | // KMOD_LCTRL & KMOD_RCTRL
              (HEAP8[(((SDL.keyboardState)+(1249))|0)] ? 0x0001 | 0x0002 : 0) | // KMOD_LSHIFT & KMOD_RSHIFT
              (HEAP8[(((SDL.keyboardState)+(1250))|0)] ? 0x0100 | 0x0200 : 0); // KMOD_LALT & KMOD_RALT
  
            if (down) {
              SDL.keyboardMap[code] = event.keyCode; // save the DOM input, which we can use to unpress it during blur
            } else {
              delete SDL.keyboardMap[code];
            }
  
            break;
          }
          case 'mousedown': case 'mouseup':
            if (event.type == 'mousedown') {
              // SDL_BUTTON(x) is defined as (1 << ((x)-1)).  SDL buttons are 1-3,
              // and DOM buttons are 0-2, so this means that the below formula is
              // correct.
              SDL.buttonState |= 1 << event.button;
            } else if (event.type == 'mouseup') {
              SDL.buttonState &= ~(1 << event.button);
            }
            // fall through
          case 'mousemove': {
            Browser.calculateMouseEvent(event);
            break;
          }
        }
      },makeCEvent:function (event, ptr) {
        if (typeof event === 'number') {
          // This is a pointer to a native C event that was SDL_PushEvent'ed
          _memcpy(ptr, event, 28); // XXX
          return;
        }
  
        SDL.handleEvent(event);
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            //Module.print('Received key event: ' + event.keyCode);
            var key = event.keyCode;
            if (key >= 65 && key <= 90) {
              key += 32; // make lowercase for SDL
            } else {
              key = SDL.keyCodes[event.keyCode] || event.keyCode;
            }
            var scan;
            if (key >= 1024) {
              scan = key - 1024;
            } else {
              scan = SDL.scanCodes[key] || key;
            }
  
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(8))|0)]=down ? 1 : 0;
            HEAP8[(((ptr)+(9))|0)]=0; // TODO
            HEAP32[(((ptr)+(12))>>2)]=scan;
            HEAP32[(((ptr)+(16))>>2)]=key;
            HEAP16[(((ptr)+(20))>>1)]=SDL.modState;
            // some non-character keys (e.g. backspace and tab) won't have keypressCharCode set, fill in with the keyCode.
            HEAP32[(((ptr)+(24))>>2)]=event.keypressCharCode || key;
  
            break;
          }
          case 'keypress': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            // Not filling in windowID for now
            var cStr = intArrayFromString(String.fromCharCode(event.charCode));
            for (var i = 0; i < cStr.length; ++i) {
              HEAP8[(((ptr)+(8 + i))|0)]=cStr[i];
            }
            break;
          }
          case 'mousedown': case 'mouseup': case 'mousemove': {
            if (event.type != 'mousemove') {
              var down = event.type === 'mousedown';
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP32[(((ptr)+(4))>>2)]=0;
              HEAP32[(((ptr)+(8))>>2)]=0;
              HEAP32[(((ptr)+(12))>>2)]=0;
              HEAP8[(((ptr)+(16))|0)]=event.button+1; // DOM buttons are 0-2, SDL 1-3
              HEAP8[(((ptr)+(17))|0)]=down ? 1 : 0;
              HEAP32[(((ptr)+(20))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(24))>>2)]=Browser.mouseY;
            } else {
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP32[(((ptr)+(4))>>2)]=0;
              HEAP32[(((ptr)+(8))>>2)]=0;
              HEAP32[(((ptr)+(12))>>2)]=0;
              HEAP32[(((ptr)+(16))>>2)]=SDL.buttonState;
              HEAP32[(((ptr)+(20))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(24))>>2)]=Browser.mouseY;
              HEAP32[(((ptr)+(28))>>2)]=Browser.mouseMovementX;
              HEAP32[(((ptr)+(32))>>2)]=Browser.mouseMovementY;
            }
            break;
          }
          case 'touchstart': case 'touchend': case 'touchmove': {
            var touch = event.touch;
            var w = Module['canvas'].width;
            var h = Module['canvas'].height;
            var x = Browser.touches[touch.identifier].x / w;
            var y = Browser.touches[touch.identifier].y / h;
            var lx = Browser.lastTouches[touch.identifier].x / w;
            var ly = Browser.lastTouches[touch.identifier].y / h;
            var dx = x - lx;
            var dy = y - ly;
            if (touch['deviceID'] === undefined) touch.deviceID = SDL.TOUCH_DEFAULT_ID;
            if (dx === 0 && dy === 0 && event.type === 'touchmove') return; // don't send these if nothing happened
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=_SDL_GetTicks();
            (tempI64 = [touch.deviceID>>>0,(tempDouble=touch.deviceID,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[(((ptr)+(8))>>2)]=tempI64[0],HEAP32[(((ptr)+(12))>>2)]=tempI64[1]);
            (tempI64 = [touch.identifier>>>0,(tempDouble=touch.identifier,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[(((ptr)+(16))>>2)]=tempI64[0],HEAP32[(((ptr)+(20))>>2)]=tempI64[1]);
            HEAPF32[(((ptr)+(24))>>2)]=x;
            HEAPF32[(((ptr)+(28))>>2)]=y;
            HEAPF32[(((ptr)+(32))>>2)]=dx;
            HEAPF32[(((ptr)+(36))>>2)]=dy;
            if (touch.force !== undefined) {
              HEAPF32[(((ptr)+(40))>>2)]=touch.force;
            } else { // No pressure data, send a digital 0/1 pressure.
              HEAPF32[(((ptr)+(40))>>2)]=event.type == "touchend" ? 0 : 1;
            }
            break;
          }
          case 'unload': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            break;
          }
          case 'resize': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=event.w;
            HEAP32[(((ptr)+(8))>>2)]=event.h;
            break;
          }
          case 'joystick_button_up': case 'joystick_button_down': {
            var state = event.type === 'joystick_button_up' ? 0 : 1;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))|0)]=event.index;
            HEAP8[(((ptr)+(5))|0)]=event.button;
            HEAP8[(((ptr)+(6))|0)]=state;
            break;
          }
          case 'joystick_axis_motion': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))|0)]=event.index;
            HEAP8[(((ptr)+(5))|0)]=event.axis;
            HEAP32[(((ptr)+(8))>>2)]=SDL.joystickAxisValueConversion(event.value);
            break;
          }
          default: throw 'Unhandled SDL event: ' + event.type;
        }
      },estimateTextWidth:function (fontData, text) {
        var h = fontData.size;
        var fontString = h + 'px ' + fontData.name;
        var tempCtx = SDL.ttfContext;
        tempCtx.save();
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        tempCtx.restore();
        return ret;
      },allocateChannels:function (num) { // called from Mix_AllocateChannels and init
        if (SDL.numChannels && SDL.numChannels >= num && num != 0) return;
        SDL.numChannels = num;
        SDL.channels = [];
        for (var i = 0; i < num; i++) {
          SDL.channels[i] = {
            audio: null,
            volume: 1.0
          };
        }
      },setGetVolume:function (info, volume) {
        if (!info) return 0;
        var ret = info.volume * 128; // MIX_MAX_VOLUME
        if (volume != -1) {
          info.volume = volume / 128;
          if (info.audio) info.audio.volume = info.volume;
        }
        return ret;
      },fillWebAudioBufferFromHeap:function (heapPtr, sizeSamplesPerChannel, dstAudioBuffer) {
        // The input audio data is interleaved across the channels, i.e. [L, R, L, R, L, R, ...] and is either 8-bit or 16-bit as
        // supported by the SDL API. The output audio wave data for Web Audio API must be in planar buffers of [-1,1]-normalized Float32 data,
        // so perform a buffer conversion for the data.
        var numChannels = SDL.audio.channels;
        for(var c = 0; c < numChannels; ++c) {
          var channelData = dstAudioBuffer['getChannelData'](c);
          if (channelData.length != sizeSamplesPerChannel) {
            throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + sizeSamplesPerChannel + ' samples!';
          }
          if (SDL.audio.format == 0x8010 /*AUDIO_S16LSB*/) {
            for(var j = 0; j < sizeSamplesPerChannel; ++j) {
              channelData[j] = (HEAP16[(((heapPtr)+((j*numChannels + c)*2))>>1)]) / 0x8000;
            }
          } else if (SDL.audio.format == 0x0008 /*AUDIO_U8*/) {
            for(var j = 0; j < sizeSamplesPerChannel; ++j) {
              var v = (HEAP8[(((heapPtr)+(j*numChannels + c))|0)]);
              channelData[j] = ((v >= 0) ? v-128 : v+128) /128;
            }
          }
        }
      },debugSurface:function (surfData) {
        console.log('dumping surface ' + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
          console.log('   diagonal ' + i + ':' + [data[i*surfData.width*4 + i*4 + 0], data[i*surfData.width*4 + i*4 + 1], data[i*surfData.width*4 + i*4 + 2], data[i*surfData.width*4 + i*4 + 3]]);
        }
      },joystickEventState:1,lastJoystickState:{},joystickNamePool:{},recordJoystickState:function (joystick, state) {
        // Standardize button state.
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
          buttons[i] = SDL.getJoystickButtonState(state.buttons[i]);
        }
  
        SDL.lastJoystickState[joystick] = {
          buttons: buttons,
          axes: state.axes.slice(0),
          timestamp: state.timestamp,
          index: state.index,
          id: state.id
        };
      },getJoystickButtonState:function (button) {
        if (typeof button === 'object') {
          // Current gamepad API editor's draft (Firefox Nightly)
          // https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html#idl-def-GamepadButton
          return button.pressed;
        } else {
          // Current gamepad API working draft (Firefox / Chrome Stable)
          // http://www.w3.org/TR/2012/WD-gamepad-20120529/#gamepad-interface
          return button > 0;
        }
      },queryJoysticks:function () {
        for (var joystick in SDL.lastJoystickState) {
          var state = SDL.getGamepad(joystick - 1);
          var prevState = SDL.lastJoystickState[joystick];
          // Check only if the timestamp has differed.
          // NOTE: Timestamp is not available in Firefox.
          if (typeof state.timestamp !== 'number' || state.timestamp !== prevState.timestamp) {
            var i;
            for (i = 0; i < state.buttons.length; i++) {
              var buttonState = SDL.getJoystickButtonState(state.buttons[i]);
              // NOTE: The previous state already has a boolean representation of
              //       its button, so no need to standardize its button state here.
              if (buttonState !== prevState.buttons[i]) {
                // Insert button-press event.
                SDL.events.push({
                  type: buttonState ? 'joystick_button_down' : 'joystick_button_up',
                  joystick: joystick,
                  index: joystick - 1,
                  button: i
                });
              }
            }
            for (i = 0; i < state.axes.length; i++) {
              if (state.axes[i] !== prevState.axes[i]) {
                // Insert axes-change event.
                SDL.events.push({
                  type: 'joystick_axis_motion',
                  joystick: joystick,
                  index: joystick - 1,
                  axis: i,
                  value: state.axes[i]
                });
              }
            }
  
            SDL.recordJoystickState(joystick, state);
          }
        }
      },joystickAxisValueConversion:function (value) {
        // Ensures that 0 is 0, 1 is 32767, and -1 is 32768.
        return Math.ceil(((value+1) * 32767.5) - 32768);
      },getGamepads:function () {
        var fcn = navigator.getGamepads || navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads || navigator.webkitGetGamepads;
        if (fcn !== undefined) {
          // The function must be applied on the navigator object.
          return fcn.apply(navigator);
        } else {
          return [];
        }
      },getGamepad:function (deviceIndex) {
        var gamepads = SDL.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
          return gamepads[deviceIndex];
        }
        return null;
      }};function _SDL_MapRGB(fmt, r, g, b) {
      // Canvas screens are always RGBA. We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|0xff000000;
    }

   
  Module["_i64Subtract"] = _i64Subtract;

   
  Module["_i64Add"] = _i64Add;

  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  
  
  
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }
  
  
  
  var ___cxa_last_thrown_exception=0;function ___resumeException(ptr) {
      if (!___cxa_last_thrown_exception) { ___cxa_last_thrown_exception = ptr; }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }
  
  var ___cxa_exception_header_size=8;function ___cxa_find_matching_catch(thrown, throwntype) {
      if (thrown == -1) thrown = ___cxa_last_thrown_exception;
      header = thrown - ___cxa_exception_header_size;
      if (throwntype == -1) throwntype = HEAP32[((header)>>2)];
      var typeArray = Array.prototype.slice.call(arguments, 2);
  
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      var header = ptr - ___cxa_exception_header_size;
      HEAP32[((header)>>2)]=type;
      HEAP32[(((header)+(4))>>2)]=destructor;
      ___cxa_last_thrown_exception = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }

  function _pthread_mutex_lock() {}

  
  
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              // runtimeConfig gets set to true if WebSocket runtime configuration is available.
              var runtimeConfig = (Module['websocket'] && ('object' === typeof Module['websocket']));
  
              // The default value is 'ws://' the replace is needed because the compiler replaces "//" comments with '#'
              // comments without checking context, so we'd end up with ws:#, the replace swaps the "#" for "//" again.
              var url = 'ws:#'.replace('#', '//');
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['url']) {
                  url = Module['websocket']['url']; // Fetch runtime WebSocket URL config.
                }
              }
  
              if (url === 'ws://' || url === 'wss://') { // Is the supplied URL config just a prefix, if so complete it.
                url = url + addr + ':' + port;
              }
  
              // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
              var subProtocols = 'binary'; // The default value is 'binary'
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['subprotocol']) {
                  subProtocols = Module['websocket']['subprotocol']; // Fetch runtime WebSocket subprotocol config.
                }
              }
  
              // The regex trims the string (removes spaces at the beginning and end, then splits the string by
              // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
              subProtocols = subProtocols.replace(/^ +| +$/g,"").split(/ *, */);
  
              // The node ws library API for specifying optional subprotocol is slightly different than the browser's.
              var opts = ENVIRONMENT_IS_NODE ? {'protocol': subProtocols.toString()} : subProtocols;
  
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) return -1;
      return stream.fd;
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }


  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var fd = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return fd === -1 ? 0 : FS.getPtrForStream(FS.getStream(fd));
    }

  
  
  
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }
  function __parseInt64(str, endptr, base, min, max, unsign) {
      var isNegative = false;
      // Skip space.
      while (_isspace(HEAP8[(str)])) str++;
  
      // Check for a plus/minus sign.
      if (HEAP8[(str)] == 45) {
        str++;
        isNegative = true;
      } else if (HEAP8[(str)] == 43) {
        str++;
      }
  
      // Find base.
      var ok = false;
      var finalBase = base;
      if (!finalBase) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            finalBase = 16;
            str += 2;
          } else {
            finalBase = 8;
            ok = true; // we saw an initial zero, perhaps the entire thing is just "0"
          }
        }
      } else if (finalBase==16) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            str += 2;
          }
        }
      }
      if (!finalBase) finalBase = 10;
      var start = str;
  
      // Get digits.
      var chr;
      while ((chr = HEAP8[(str)]) != 0) {
        var digit = parseInt(String.fromCharCode(chr), finalBase);
        if (isNaN(digit)) {
          break;
        } else {
          str++;
          ok = true;
        }
      }
  
      if (!ok) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return ((asm["setTempRet0"](0),0)|0);
      }
  
      // Set end pointer.
      if (endptr) {
        HEAP32[((endptr)>>2)]=str;
      }
  
      try {
        var numberString = isNegative ? '-'+Pointer_stringify(start, str - start) : Pointer_stringify(start, str - start);
        i64Math.fromString(numberString, finalBase, min, max, unsign);
      } catch(e) {
        ___setErrNo(ERRNO_CODES.ERANGE); // not quite correct
      }
  
      return ((asm["setTempRet0"](((HEAP32[(((tempDoublePtr)+(4))>>2)])|0)),((HEAP32[((tempDoublePtr)>>2)])|0))|0);
    }function _strtoull(str, endptr, base) {
      return __parseInt64(str, endptr, base, 0, '18446744073709551615', true);  // ULONG_MAX.
    }function _strtoull_l(str, endptr, base) {
      return _strtoull(str, endptr, base); // no locale support yet
    }

  function _llvm_stackrestore(p) {
      var self = _llvm_stacksave;
      var ret = self.LLVM_SAVEDSTACKS[p];
      self.LLVM_SAVEDSTACKS.splice(p, 1);
      Runtime.stackRestore(ret);
    }

  function _SDL_PollEvent(ptr) {
      if (SDL.initFlags & 0x200 && SDL.joystickEventState) {
        // If SDL_INIT_JOYSTICK was supplied AND the joystick system is configured
        // to automatically query for events, query for joystick events.
        SDL.queryJoysticks();
      }
      if (SDL.events.length === 0) return 0;
      if (ptr) {
        SDL.makeCEvent(SDL.events.shift(), ptr);
      }
      return 1;
    }


  
  function _strtoll(str, endptr, base) {
      return __parseInt64(str, endptr, base, '-9223372036854775808', '9223372036854775807');  // LLONG_MIN, LLONG_MAX.
    }function _strtoll_l(str, endptr, base) {
      return _strtoll(str, endptr, base); // no locale support yet
    }

  function _SDL_Flip(surf) {
      // We actually do this in Unlock, since the screen surface has as its canvas
      // backing the page canvas element
    }

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  function _SDL_GetError() {
      if (!SDL.errorMessage) {
        SDL.errorMessage = allocate(intArrayFromString("unknown SDL-emscripten error"), 'i8', ALLOC_NORMAL);
      }
      return SDL.errorMessage;
    }


  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(streamObj.fd, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }

  function _pthread_cond_broadcast() {
      return 0;
    }

  
  
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]);
      return sum;
    }
  
  
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month 
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
      
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)]
      };
  
      var pattern = Pointer_stringify(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate date representation
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      };
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      };
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        };
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      };
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      };
  
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else { 
            return thisDate.getFullYear()-1;
          }
      };
  
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls(Math.floor(year/100),2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year. 
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes 
          // January 4th, which is also the week that includes the first Thursday of the year, and 
          // is also the first week that contains at least four days in the year. 
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of 
          // the last week of the preceding year; thus, for Saturday 2nd January 1999, 
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th, 
          // or 31st is a Monday, it and any following days are part of week 1 of the following year. 
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
          
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          return leadingNulls(date.tm_hour < 13 ? date.tm_hour : date.tm_hour-12, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour > 0 && date.tm_hour < 13) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay() || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Sunday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
  
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week) 
          // as a decimal number [01,53]. If the week containing 1 January has four 
          // or more days in the new year, then it is considered week 1. 
          // Otherwise, it is the last week of the previous year, and the next week is week 1. 
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          } 
  
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
  
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay();
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Monday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ),
          // or by no characters if no timezone is determinable. 
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich). 
          // If tm_isdst is zero, the standard time offset is used. 
          // If tm_isdst is greater than zero, the daylight savings time offset is used. 
          // If tm_isdst is negative, no characters are returned. 
          // FIXME: we cannot determine time zone (or can we?)
          return '';
        },
        '%Z': function(date) {
          // Replaced by the timezone name or abbreviation, or by no bytes if no timezone information exists. [ tm_isdst]
          // FIXME: we cannot determine time zone (or can we?)
          return '';
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      } 
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm); // no locale support yet
    }

  
  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }function __ZSt9terminatev() {
      _exit(-1234);
    }

  function _pthread_mutex_unlock() {}

  
  function _isxdigit(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 102) ||
             (chr >= 65 && chr <= 70);
    }function _isxdigit_l(chr) {
      return _isxdigit(chr); // no locale support yet
    }

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

   
  Module["_memmove"] = _memmove;

  
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;function _newlocale(mask, locale, base) {
      return _malloc(4);
    }

  function ___errno_location() {
      return ___errno_state;
    }

  
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          writeAsciiToMemory(msg, strerrbuf);
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }

  function _pthread_cond_wait() {
      return 0;
    }

  function _fmod(x, y) {
      return x % y;
    }

  function ___cxa_guard_release() {}

  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }

  
  
  function _SDL_LockSurface(surf) {
      var surfData = SDL.surfaces[surf];
  
      surfData.locked++;
      if (surfData.locked > 1) return 0;
  
      if (!surfData.buffer) {
        surfData.buffer = _malloc(surfData.width * surfData.height * 4);
        HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
      }
  
      // Mark in C/C++-accessible SDL structure
      // SDL_Surface has the following fields: Uint32 flags, SDL_PixelFormat *format; int w, h; Uint16 pitch; void *pixels; ...
      // So we have fields all of the same size, and 5 of them before us.
      // TODO: Use macros like in library.js
      HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
  
      if (surf == SDL.screen && Module.screenIsReadOnly && surfData.image) return 0;
  
      surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
      if (surf == SDL.screen) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num/4; i++) {
          data[i*4+3] = 255; // opacity, as canvases blend alpha
        }
      }
  
      if (SDL.defaults.copyOnLock) {
        // Copy pixel data to somewhere accessible to 'C/C++'
        if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
          // If this is neaded then
          // we should compact the data from 32bpp to 8bpp index.
          // I think best way to implement this is use
          // additional colorMap hash (color->index).
          // Something like this:
          //
          // var size = surfData.width * surfData.height;
          // var data = '';
          // for (var i = 0; i<size; i++) {
          //   var color = SDL.translateRGBAToColor(
          //     surfData.image.data[i*4   ], 
          //     surfData.image.data[i*4 +1], 
          //     surfData.image.data[i*4 +2], 
          //     255);
          //   var index = surfData.colorMap[color];
          //   HEAP8[(((surfData.buffer)+(i))|0)]=index;
          // }
          throw 'CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set' + new Error().stack;
        } else {
        HEAPU8.set(surfData.image.data, surfData.buffer);
        }
      }
  
      return 0;
    }
  
  function _SDL_FreeRW(rwopsID) {
      SDL.rwops[rwopsID] = null;
      while (SDL.rwops.length > 0 && SDL.rwops[SDL.rwops.length-1] === null) {
        SDL.rwops.pop();
      }
    }function _IMG_Load_RW(rwopsID, freeSrc) {
      try {
        // stb_image integration support
        function cleanup() {
          if (rwops && freeSrc) _SDL_FreeRW(rwopsID);
        };
        function addCleanup(func) {
          var old = cleanup;
          cleanup = function added_cleanup() {
            old();
            func();
          }
        }
        function callStbImage(func, params) {
          var x = Module['_malloc'](4);
          var y = Module['_malloc'](4);
          var comp = Module['_malloc'](4);
          addCleanup(function() {
            Module['_free'](x);
            Module['_free'](y);
            Module['_free'](comp);
            if (data) Module['_stbi_image_free'](data);
          });
          var data = Module['_' + func].apply(null, params.concat([x, y, comp, 0]));
          if (!data) return null;
          return {
            rawData: true,
            data: data,
            width: HEAP32[((x)>>2)],
            height: HEAP32[((y)>>2)],
            size: HEAP32[((x)>>2)] * HEAP32[((y)>>2)] * HEAP32[((comp)>>2)],
            bpp: HEAP32[((comp)>>2)]
          };
        }
  
        var rwops = SDL.rwops[rwopsID];
        if (rwops === undefined) {
          return 0;
        }
  
        var filename = rwops.filename;
        if (filename === undefined) {
          Runtime.warnOnce('Only file names that have been preloaded are supported for IMG_Load_RW. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js)');
          return 0;
        }
  
        if (!raw) {
          filename = PATH.resolve(filename);
          var raw = Module["preloadedImages"][filename];
          if (!raw) {
            if (raw === null) Module.printErr('Trying to reuse preloaded image, but freePreloadedMediaOnUse is set!');
            Runtime.warnOnce('Cannot find preloaded image ' + filename);
            Runtime.warnOnce('Cannot find preloaded image ' + filename + '. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js)');
            return 0;
          } else if (Module['freePreloadedMediaOnUse']) {
            Module["preloadedImages"][filename] = null;
          }
        }
  
        var surf = SDL.makeSurface(raw.width, raw.height, 0, false, 'load:' + filename);
        var surfData = SDL.surfaces[surf];
        surfData.ctx.globalCompositeOperation = "copy";
        if (!raw.rawData) {
          surfData.ctx.drawImage(raw, 0, 0, raw.width, raw.height, 0, 0, raw.width, raw.height);
        } else {
          var imageData = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
          if (raw.bpp == 4) {
            imageData.data.set(HEAPU8.subarray((raw.data),(raw.data+raw.size)));
          } else if (raw.bpp == 3) {
            var pixels = raw.size/3;
            var data = imageData.data;
            var sourcePtr = raw.data;
            var destPtr = 0;
            for (var i = 0; i < pixels; i++) {
              data[destPtr++] = HEAPU8[((sourcePtr++)|0)];
              data[destPtr++] = HEAPU8[((sourcePtr++)|0)];
              data[destPtr++] = HEAPU8[((sourcePtr++)|0)];
              data[destPtr++] = 255;
            }
          } else {
            Module.printErr('cannot handle bpp ' + raw.bpp);
            return 0;
          }
          surfData.ctx.putImageData(imageData, 0, 0);
        }
        surfData.ctx.globalCompositeOperation = "source-over";
        // XXX SDL does not specify that loaded images must have available pixel data, in fact
        //     there are cases where you just want to blit them, so you just need the hardware
        //     accelerated version. However, code everywhere seems to assume that the pixels
        //     are in fact available, so we retrieve it here. This does add overhead though.
        _SDL_LockSurface(surf);
        surfData.locked--; // The surface is not actually locked in this hack
        if (SDL.GL) {
          // After getting the pixel data, we can free the canvas and context if we do not need to do 2D canvas blitting
          surfData.canvas = surfData.ctx = null;
        }
        return surf;
      } finally {
        cleanup();
      }
    }var _SDL_LoadBMP_RW=_IMG_Load_RW;

  function _uselocale(locale) {
      return 0;
    }

  
  function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _vsnprintf(s, n, format, va_arg) {
      return _snprintf(s, n, format, HEAP32[((va_arg)>>2)]);
    }

  
  
  
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
  
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
  
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
                if (next === 0) return i > 0 ? fields : fields-1; // we failed to read the full length of this field
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
  
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
  
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
  
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
  
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
  
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            
            continue;
          }
        }      
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
  
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
  
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16);
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text);
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text);
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j];
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }function _sscanf(s, format, varargs) {
      // int sscanf(const char *restrict s, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var index = 0;
      function get() { return HEAP8[(((s)+(index++))|0)]; };
      function unget() { index--; };
      return __scanString(format, get, unget, varargs);
    }function _vsscanf(s, format, va_arg) {
      return _sscanf(s, format, HEAP32[((va_arg)>>2)]);
    }



  function _SDL_RWFromFile(_name, mode) {
      var id = SDL.rwops.length; // TODO: recycle ids when they are null
      var name = Pointer_stringify(_name)
      SDL.rwops.push({ filename: name, mimetype: Browser.getMimetype(name) });
      return id;
    }

  function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }

   
  Module["_memset"] = _memset;

  var _BItoD=true;


  function _abort() {
      Module['abort']();
    }

  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }


  function _SDL_SetVideoMode(width, height, depth, flags) {
      ['touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mouseout'].forEach(function(event) {
        Module['canvas'].addEventListener(event, SDL.receiveEvent, true);
      });
  
      // (0,0) means 'use fullscreen' in native; in Emscripten, use the current canvas size.
      if (width == 0 && height == 0) {
        var canvas = Module['canvas'];
        width = canvas.width;
        height = canvas.height;
      }
  
      Browser.setCanvasSize(width, height, true);
      // Free the old surface first.
      if (SDL.screen) {
        SDL.freeSurface(SDL.screen);
        assert(!SDL.screen);
      }
      SDL.screen = SDL.makeSurface(width, height, flags, true, 'screen');
      if (!SDL.addedResizeListener) {
        SDL.addedResizeListener = true;
        Browser.resizeListeners.push(function(w, h) {
          SDL.receiveEvent({
            type: 'resize',
            w: w,
            h: h
          });
        });
      }
      return SDL.screen;
    }

  function _SDL_FillRect(surf, rect, color) {
      var surfData = SDL.surfaces[surf];
      assert(!surfData.locked); // but we could unlock and re-lock if we must..
      
      if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
        //in SDL_HWPALETTE color is index (0..255)
        //so we should translate 1 byte value to
        //32 bit canvas
        var index = color * 3;
        color = SDL.translateRGBAToColor(surfData.colors[index], surfData.colors[index +1], surfData.colors[index +2], 255);
      }
  
      var r = rect ? SDL.loadRect(rect) : { x: 0, y: 0, w: surfData.width, h: surfData.height };
      surfData.ctx.save();
      surfData.ctx.fillStyle = SDL.translateColorToCSSRGBA(color);
      surfData.ctx.fillRect(r.x, r.y, r.w, r.h);
      surfData.ctx.restore();
      return 0;
    }

  function _catclose(catd) {
      // int catclose (nl_catd catd)
      return 0;
    }

  function _emscripten_asm_const(code) {
      Runtime.getAsmConst(code, 0)();
    }

  
  function _isdigit(chr) {
      return chr >= 48 && chr <= 57;
    }function _isdigit_l(chr) {
      return _isdigit(chr); // no locale support yet
    }

  var _fabs=Math_abs;

  var _getc=_fgetc;

  function _SDL_MapRGBA(fmt, r, g, b, a) {
      // Canvas screens are always RGBA. We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|(a&0xff)<<24;
    }

  function _emscripten_asm_const_int(code) {
      var args = Array.prototype.slice.call(arguments, 1);
      return Runtime.getAsmConst(code, args.length).apply(null, args) | 0;
    }

  function _SDL_UpperBlit(src, srcrect, dst, dstrect) {
      var srcData = SDL.surfaces[src];
      var dstData = SDL.surfaces[dst];
      var sr, dr;
      if (srcrect) {
        sr = SDL.loadRect(srcrect);
      } else {
        sr = { x: 0, y: 0, w: srcData.width, h: srcData.height };
      }
      if (dstrect) {
        dr = SDL.loadRect(dstrect);
      } else {
        dr = { x: 0, y: 0, w: -1, h: -1 };
      }
      var oldAlpha = dstData.ctx.globalAlpha;
      dstData.ctx.globalAlpha = srcData.alpha/255;
      dstData.ctx.drawImage(srcData.canvas, sr.x, sr.y, sr.w, sr.h, dr.x, dr.y, sr.w, sr.h);
      dstData.ctx.globalAlpha = oldAlpha;
      if (dst != SDL.screen) {
        // XXX As in IMG_Load, for compatibility we write out |pixels|
        Runtime.warnOnce('WARNING: copying canvas data to memory for compatibility');
        _SDL_LockSurface(dst);
        dstData.locked--; // The surface is not actually locked in this hack
      }
      return 0;
    }

  var _abs=Math_abs;


  function ___ctype_b_loc() {
      // http://refspecs.freestandards.org/LSB_3.0.0/LSB-Core-generic/LSB-Core-generic/baselib---ctype-b-loc.html
      var me = ___ctype_b_loc;
      if (!me.ret) {
        var values = [
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,8195,8194,8194,8194,8194,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,24577,49156,49156,49156,
          49156,49156,49156,49156,49156,49156,49156,49156,49156,49156,49156,49156,55304,55304,55304,55304,55304,55304,55304,55304,
          55304,55304,49156,49156,49156,49156,49156,49156,49156,54536,54536,54536,54536,54536,54536,50440,50440,50440,50440,50440,
          50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,49156,49156,49156,49156,49156,
          49156,54792,54792,54792,54792,54792,54792,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,
          50696,50696,50696,50696,50696,50696,50696,49156,49156,49156,49156,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ];
        var i16size = 2;
        var arr = _malloc(values.length * i16size);
        for (var i = 0; i < values.length; i++) {
          HEAP16[(((arr)+(i * i16size))>>1)]=values[i];
        }
        me.ret = allocate([arr + 128 * i16size], 'i16*', ALLOC_NORMAL);
      }
      return me.ret;
    }

  function _SDL_UpdateRect(surf, x, y, w, h) {
      // We actually do the whole screen in Unlock...
    }

  
  function _free() {
  }
  Module["_free"] = _free;function _freelocale(locale) {
      _free(locale);
    }

  function _SDL_CreateRGBSurface(flags, width, height, depth, rmask, gmask, bmask, amask) {
      return SDL.makeSurface(width, height, flags, false, 'CreateRGBSurface', rmask, gmask, bmask, amask);
    }

  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg) {
      Module['noExitRuntime'] = true;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from non-main loop sources
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          Module.printErr('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        if (Module['preMainLoop']) {
          Module['preMainLoop']();
        }
  
        try {
          if (typeof arg !== 'undefined') {
            Runtime.dynCall('vi', func, [arg]);
          } else {
            Runtime.dynCall('v', func);
          }
        } catch (e) {
          if (e instanceof ExitStatus) {
            return;
          } else {
            if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
            throw e;
          }
        }
  
        if (Module['postMainLoop']) {
          Module['postMainLoop']();
        }
  
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from the main loop itself
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
        Browser.mainLoop.scheduler();
      }
      if (fps && fps > 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          setTimeout(Browser.mainLoop.runner, 1000/fps); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      }
      Browser.mainLoop.scheduler();
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }

  var _fmodl=_fmod;

  function _catopen(name, oflag) {
      // nl_catd catopen (const char *name, int oflag)
      return -1;
    }

  function _catgets(catd, set_id, msg_id, s) {
      // char *catgets (nl_catd catd, int set_id, int msg_id, const char *s)
      return s;
    }

  
  
  function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }function _asprintf(s, format, varargs) {
      return _sprintf(-s, format, varargs);
    }function _vasprintf(s, format, va_arg) {
      return _asprintf(s, format, HEAP32[((va_arg)>>2)]);
    }

  function _ferror(stream) {
      // int ferror(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ferror.html
      stream = FS.getStreamFromPtr(stream);
      return Number(stream && stream.error);
    }

  function ___cxa_allocate_exception(size) {
      var ptr = _malloc(size + ___cxa_exception_header_size);
      return ptr + ___cxa_exception_header_size;
    }

  function _copysign(a, b) {
      return __reallyNegative(a) === __reallyNegative(b) ? a : -a;
    }


  function ___ctype_toupper_loc() {
      // http://refspecs.freestandards.org/LSB_3.1.1/LSB-Core-generic/LSB-Core-generic/libutil---ctype-toupper-loc.html
      var me = ___ctype_toupper_loc;
      if (!me.ret) {
        var values = [
          128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
          158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,
          188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,
          218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,
          248,249,250,251,252,253,254,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
          33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,
          73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
          81,82,83,84,85,86,87,88,89,90,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,
          145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,
          175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,
          205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,
          235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255
        ];
        var i32size = 4;
        var arr = _malloc(values.length * i32size);
        for (var i = 0; i < values.length; i++) {
          HEAP32[(((arr)+(i * i32size))>>2)]=values[i];
        }
        me.ret = allocate([arr + 128 * i32size], 'i32*', ALLOC_NORMAL);
      }
      return me.ret;
    }

  function ___cxa_guard_acquire(variable) {
      if (!HEAP8[(variable)]) { // ignore SAFE_HEAP stuff because llvm mixes i64 and i8 here
        HEAP8[(variable)]=1;
        return 1;
      }
      return 0;
    }

  function ___ctype_tolower_loc() {
      // http://refspecs.freestandards.org/LSB_3.1.1/LSB-Core-generic/LSB-Core-generic/libutil---ctype-tolower-loc.html
      var me = ___ctype_tolower_loc;
      if (!me.ret) {
        var values = [
          128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
          158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,
          188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,
          218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,
          248,249,250,251,252,253,254,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
          33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,97,98,99,100,101,102,103,
          104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,91,92,93,94,95,96,97,98,99,100,101,102,103,
          104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,
          134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,
          164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,
          194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,
          224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,
          254,255
        ];
        var i32size = 4;
        var arr = _malloc(values.length * i32size);
        for (var i = 0; i < values.length; i++) {
          HEAP32[(((arr)+(i * i32size))>>2)]=values[i];
        }
        me.ret = allocate([arr + 128 * i32size], 'i32*', ALLOC_NORMAL);
      }
      return me.ret;
    }

  
  var ___cxa_caught_exceptions=[];function ___cxa_begin_catch(ptr) {
      __ZSt18uncaught_exceptionv.uncaught_exception--;
      ___cxa_caught_exceptions.push(___cxa_last_thrown_exception);
      return ptr;
    }

   
  Module["_bitshift64Shl"] = _bitshift64Shl;


  
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      var fd = _fileno(stream);
      return _write(fd, s, _strlen(s));
    }
  
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }

  function __ZNSt9exceptionD2Ev() {}

  function _llvm_stacksave() {
      var self = _llvm_stacksave;
      if (!self.LLVM_SAVEDSTACKS) {
        self.LLVM_SAVEDSTACKS = [];
      }
      self.LLVM_SAVEDSTACKS.push(Runtime.stackSave());
      return self.LLVM_SAVEDSTACKS.length-1;
    }

  function _SDL_Init(initFlags) {
      SDL.startTime = Date.now();
      SDL.initFlags = initFlags;
  
      // capture all key events. we just keep down and up, but also capture press to prevent default actions
      if (!Module['doNotCaptureKeyboard']) {
        document.addEventListener("keydown", SDL.receiveEvent);
        document.addEventListener("keyup", SDL.receiveEvent);
        document.addEventListener("keypress", SDL.receiveEvent);
        window.addEventListener("blur", SDL.receiveEvent);
        document.addEventListener("visibilitychange", SDL.receiveEvent);
      }
  
      if (initFlags & 0x200) {
        // SDL_INIT_JOYSTICK
        // Firefox will not give us Joystick data unless we register this NOP
        // callback.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=936104
        addEventListener("gamepadconnected", function() {});
      }
  
      window.addEventListener("unload", SDL.receiveEvent);
      SDL.keyboardState = _malloc(0x10000); // Our SDL needs 512, but 64K is safe for older SDLs
      _memset(SDL.keyboardState, 0, 0x10000);
      // Initialize this structure carefully for closure
      SDL.DOMEventToSDLEvent['keydown']    = 0x300  /* SDL_KEYDOWN */;
      SDL.DOMEventToSDLEvent['keyup']      = 0x301  /* SDL_KEYUP */;
      SDL.DOMEventToSDLEvent['keypress']   = 0x303  /* SDL_TEXTINPUT */;
      SDL.DOMEventToSDLEvent['mousedown']  = 0x401  /* SDL_MOUSEBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['mouseup']    = 0x402  /* SDL_MOUSEBUTTONUP */;
      SDL.DOMEventToSDLEvent['mousemove']  = 0x400  /* SDL_MOUSEMOTION */;
      SDL.DOMEventToSDLEvent['touchstart'] = 0x700  /* SDL_FINGERDOWN */;
      SDL.DOMEventToSDLEvent['touchend']   = 0x701  /* SDL_FINGERUP */;
      SDL.DOMEventToSDLEvent['touchmove']  = 0x702  /* SDL_FINGERMOTION */;
      SDL.DOMEventToSDLEvent['unload']     = 0x100  /* SDL_QUIT */;
      SDL.DOMEventToSDLEvent['resize']     = 0x7001 /* SDL_VIDEORESIZE/SDL_EVENT_COMPAT2 */;
      // These are not technically DOM events; the HTML gamepad API is poll-based.
      // However, we define them here, as the rest of the SDL code assumes that
      // all SDL events originate as DOM events.
      SDL.DOMEventToSDLEvent['joystick_axis_motion'] = 0x600 /* SDL_JOYAXISMOTION */;
      SDL.DOMEventToSDLEvent['joystick_button_down'] = 0x603 /* SDL_JOYBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['joystick_button_up'] = 0x604 /* SDL_JOYBUTTONUP */;
      return 0; // success
    }

  var _copysignl=_copysign;

  var __ZTISt9exception=allocate([allocate([1,0,0,0,0,0,0], "i8", ALLOC_STATIC)+8, 0], "i32", ALLOC_STATIC);

  var ___dso_handle=allocate(1, "i32*", ALLOC_STATIC);




   
  Module["_emscripten_replace_memory"] = _emscripten_replace_memory;
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);

var Math_min = Math.min;
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vid(index,a1,a2) {
  try {
    Module["dynCall_vid"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  try {
    Module["dynCall_viiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiid(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiid"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiid(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiid"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"almost asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=env.__ZTISt9exception|0;var p=env.___dso_handle|0;var q=env._stderr|0;var r=env._stdin|0;var s=env._stdout|0;var t=0;var u=0;var v=0;var w=0;var x=+env.NaN,y=+env.Infinity;var z=0,A=0,B=0,C=0,D=0.0,E=0,F=0,G=0,H=0.0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=0;var O=0;var P=0;var Q=0;var R=0;var S=global.Math.floor;var T=global.Math.abs;var U=global.Math.sqrt;var V=global.Math.pow;var W=global.Math.cos;var X=global.Math.sin;var Y=global.Math.tan;var Z=global.Math.acos;var _=global.Math.asin;var $=global.Math.atan;var aa=global.Math.atan2;var ba=global.Math.exp;var ca=global.Math.log;var da=global.Math.ceil;var ea=global.Math.imul;var fa=env.abort;var ga=env.assert;var ha=env.asmPrintInt;var ia=env.asmPrintFloat;var ja=env.min;var ka=env.invoke_iiii;var la=env.invoke_vid;var ma=env.invoke_viiiii;var na=env.invoke_vi;var oa=env.invoke_viiiiiii;var pa=env.invoke_vii;var qa=env.invoke_viiiiiiiii;var ra=env.invoke_ii;var sa=env.invoke_viiiiiid;var ta=env.invoke_viii;var ua=env.invoke_viiiiid;var va=env.invoke_v;var wa=env.invoke_iiiiiiiii;var xa=env.invoke_iiiii;var ya=env.invoke_viiiiiiii;var za=env.invoke_viiiiii;var Aa=env.invoke_iii;var Ba=env.invoke_iiiiii;var Ca=env.invoke_viiii;var Da=env._fabs;var Ea=env._fread;var Fa=env.__ZSt9terminatev;var Ga=env.___cxa_guard_acquire;var Ha=env._SDL_RWFromFile;var Ia=env.___assert_fail;var Ja=env.__ZSt18uncaught_exceptionv;var Ka=env.___ctype_toupper_loc;var La=env.__addDays;var Ma=env._SDL_GetError;var Na=env._sbrk;var Oa=env.___cxa_begin_catch;var Pa=env._emscripten_memcpy_big;var Qa=env._sysconf;var Ra=env._ferror;var Sa=env._fileno;var Ta=env._llvm_stacksave;var Ua=env._vsscanf;var Va=env._puts;var Wa=env._write;var Xa=env.__isLeapYear;var Ya=env.__ZNSt9exceptionD2Ev;var Za=env.___cxa_does_inherit;var _a=env.__exit;var $a=env._catclose;var ab=env._SDL_UpdateRect;var bb=env._send;var cb=env.___cxa_is_number_type;var db=env._llvm_stackrestore;var eb=env.___cxa_find_matching_catch;var fb=env._isxdigit_l;var gb=env.___cxa_guard_release;var hb=env._SDL_LockSurface;var ib=env._strerror_r;var jb=env.___setErrNo;var kb=env._newlocale;var lb=env._isdigit_l;var mb=env.___resumeException;var nb=env._freelocale;var ob=env._abs;var pb=env._printf;var qb=env._sprintf;var rb=env._vasprintf;var sb=env._SDL_MapRGB;var tb=env._SDL_CreateRGBSurface;var ub=env._vsnprintf;var vb=env._strtoull_l;var wb=env._read;var xb=env._SDL_SetVideoMode;var yb=env._fwrite;var zb=env._time;var Ab=env._pthread_mutex_lock;var Bb=env._catopen;var Cb=env._exit;var Db=env.___ctype_b_loc;var Eb=env._fmod;var Fb=env.___cxa_allocate_exception;var Gb=env._strtoll;var Hb=env._pwrite;var Ib=env._open;var Jb=env._uselocale;var Kb=env._SDL_Init;var Lb=env._snprintf;var Mb=env.__scanString;var Nb=env._strtoull;var Ob=env._strftime;var Pb=env._isxdigit;var Qb=env.__reallyNegative;var Rb=env._pthread_cond_broadcast;var Sb=env._recv;var Tb=env._fgetc;var Ub=env.__parseInt64;var Vb=env.__getFloat;var Wb=env._abort;var Xb=env._SDL_MapRGBA;var Yb=env._SDL_Flip;var Zb=env._isspace;var _b=env._fopen;var $b=env._pthread_cond_wait;var ac=env._SDL_GetTicks;var bc=env._emscripten_asm_const;var cc=env._emscripten_asm_const_int;var dc=env._ungetc;var ec=env._fflush;var fc=env._SDL_FreeRW;var gc=env._strftime_l;var hc=env._fprintf;var ic=env._sscanf;var jc=env._SDL_PollEvent;var kc=env._catgets;var lc=env._asprintf;var mc=env._strtoll_l;var nc=env._IMG_Load_RW;var oc=env.__arraySum;var pc=env.___ctype_tolower_loc;var qc=env._SDL_FillRect;var rc=env._fputs;var sc=env._pthread_mutex_unlock;var tc=env._pread;var uc=env._mkport;var vc=env._emscripten_set_main_loop;var wc=env.___errno_location;var xc=env._copysign;var yc=env._fputc;var zc=env.___cxa_throw;var Ac=env._isdigit;var Bc=env._strerror;var Cc=env.__formatString;var Dc=env._atexit;var Ec=env._SDL_UpperBlit;var Fc=0.0;
// EMSCRIPTEN_START_FUNCS
function ok(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;g=i;h=c[a>>2]|0;do{if((h|0)!=0){j=c[h+12>>2]|0;if((j|0)==(c[h+16>>2]|0)){k=Nc[c[(c[h>>2]|0)+36>>2]&127](h)|0}else{k=c[j>>2]|0}if((k|0)==-1){c[a>>2]=0;l=1;break}else{l=(c[a>>2]|0)==0;break}}else{l=1}}while(0);k=c[b>>2]|0;do{if((k|0)!=0){h=c[k+12>>2]|0;if((h|0)==(c[k+16>>2]|0)){m=Nc[c[(c[k>>2]|0)+36>>2]&127](k)|0}else{m=c[h>>2]|0}if(!((m|0)==-1)){if(l){n=k;break}else{o=16;break}}else{c[b>>2]=0;o=14;break}}else{o=14}}while(0);if((o|0)==14){if(l){o=16}else{n=0}}if((o|0)==16){c[d>>2]=c[d>>2]|6;p=0;i=g;return p|0}l=c[a>>2]|0;k=c[l+12>>2]|0;if((k|0)==(c[l+16>>2]|0)){q=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{q=c[k>>2]|0}if(!(Gc[c[(c[e>>2]|0)+12>>2]&31](e,2048,q)|0)){c[d>>2]=c[d>>2]|4;p=0;i=g;return p|0}k=(Gc[c[(c[e>>2]|0)+52>>2]&31](e,q,0)|0)<<24>>24;q=c[a>>2]|0;l=q+12|0;m=c[l>>2]|0;if((m|0)==(c[q+16>>2]|0)){Nc[c[(c[q>>2]|0)+40>>2]&127](q)|0;r=f;s=n;t=n;u=k}else{c[l>>2]=m+4;r=f;s=n;t=n;u=k}while(1){v=u+ -48|0;k=r+ -1|0;n=c[a>>2]|0;do{if((n|0)!=0){f=c[n+12>>2]|0;if((f|0)==(c[n+16>>2]|0)){w=Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0}else{w=c[f>>2]|0}if((w|0)==-1){c[a>>2]=0;x=1;break}else{x=(c[a>>2]|0)==0;break}}else{x=1}}while(0);do{if((t|0)!=0){n=c[t+12>>2]|0;if((n|0)==(c[t+16>>2]|0)){y=Nc[c[(c[t>>2]|0)+36>>2]&127](t)|0}else{y=c[n>>2]|0}if((y|0)==-1){c[b>>2]=0;z=0;A=0;B=1;break}else{z=s;A=s;B=(s|0)==0;break}}else{z=s;A=0;B=1}}while(0);C=c[a>>2]|0;if(!((x^B)&(k|0)>0)){break}n=c[C+12>>2]|0;if((n|0)==(c[C+16>>2]|0)){D=Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0}else{D=c[n>>2]|0}if(!(Gc[c[(c[e>>2]|0)+12>>2]&31](e,2048,D)|0)){p=v;o=63;break}n=((Gc[c[(c[e>>2]|0)+52>>2]&31](e,D,0)|0)<<24>>24)+(v*10|0)|0;f=c[a>>2]|0;m=f+12|0;l=c[m>>2]|0;if((l|0)==(c[f+16>>2]|0)){Nc[c[(c[f>>2]|0)+40>>2]&127](f)|0;r=k;s=z;t=A;u=n;continue}else{c[m>>2]=l+4;r=k;s=z;t=A;u=n;continue}}if((o|0)==63){i=g;return p|0}do{if((C|0)!=0){u=c[C+12>>2]|0;if((u|0)==(c[C+16>>2]|0)){E=Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0}else{E=c[u>>2]|0}if((E|0)==-1){c[a>>2]=0;F=1;break}else{F=(c[a>>2]|0)==0;break}}else{F=1}}while(0);do{if((z|0)!=0){a=c[z+12>>2]|0;if((a|0)==(c[z+16>>2]|0)){G=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{G=c[a>>2]|0}if((G|0)==-1){c[b>>2]=0;o=60;break}if(F){p=v;i=g;return p|0}}else{o=60}}while(0);if((o|0)==60?!F:0){p=v;i=g;return p|0}c[d>>2]=c[d>>2]|2;p=v;i=g;return p|0}function pk(b){b=b|0;var d=0,e=0,f=0,g=0;d=i;e=b+8|0;f=c[e>>2]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){g=kb(2147483647,19576,0)|0;c[4890]=g;gb(19568)}if((f|0)==(c[4890]|0)){ap(b);i=d;return}nb(c[e>>2]|0);ap(b);i=d;return}function qk(b){b=b|0;var d=0,e=0,f=0;d=i;e=b+8|0;b=c[e>>2]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){f=kb(2147483647,19576,0)|0;c[4890]=f;gb(19568)}if((b|0)==(c[4890]|0)){i=d;return}nb(c[e>>2]|0);i=d;return}function rk(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;g=i;i=i+112|0;f=g+100|0;l=g;a[f]=37;m=f+1|0;a[m]=j;n=f+2|0;a[n]=k;a[f+3|0]=0;if(!(k<<24>>24==0)){a[m]=k;a[n]=j}j=gc(l|0,100,f|0,h|0,c[d+8>>2]|0)|0;d=l+j|0;h=c[e>>2]|0;if((j|0)==0){o=h;c[b>>2]=o;i=g;return}else{p=l;q=h;r=h}while(1){h=a[p]|0;do{if((q|0)!=0){l=q+24|0;j=c[l>>2]|0;if((j|0)==(c[q+28>>2]|0)){e=(Wc[c[(c[q>>2]|0)+52>>2]&15](q,h&255)|0)==-1;s=e?0:r;t=e?0:q;break}else{c[l>>2]=j+1;a[j]=h;s=r;t=q;break}}else{s=r;t=0}}while(0);h=p+1|0;if((h|0)==(d|0)){o=s;break}else{p=h;q=t;r=s}}c[b>>2]=o;i=g;return}function sk(b){b=b|0;var d=0,e=0,f=0,g=0;d=i;e=b+8|0;f=c[e>>2]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){g=kb(2147483647,19576,0)|0;c[4890]=g;gb(19568)}if((f|0)==(c[4890]|0)){ap(b);i=d;return}nb(c[e>>2]|0);ap(b);i=d;return}function tk(b){b=b|0;var d=0,e=0,f=0;d=i;e=b+8|0;b=c[e>>2]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){f=kb(2147483647,19576,0)|0;c[4890]=f;gb(19568)}if((b|0)==(c[4890]|0)){i=d;return}nb(c[e>>2]|0);i=d;return}function uk(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;i=i+416|0;e=f+8|0;k=f;c[k>>2]=e+400;vk(b+8|0,e,k,g,h,j);j=c[k>>2]|0;k=c[d>>2]|0;if((e|0)==(j|0)){l=k;c[a>>2]=l;i=f;return}else{m=e;n=k;o=k}while(1){k=c[m>>2]|0;if((o|0)==0){p=n;q=0}else{e=o+24|0;d=c[e>>2]|0;if((d|0)==(c[o+28>>2]|0)){r=Wc[c[(c[o>>2]|0)+52>>2]&15](o,k)|0}else{c[e>>2]=d+4;c[d>>2]=k;r=k}k=(r|0)==-1;p=k?0:n;q=k?0:o}k=m+4|0;if((k|0)==(j|0)){l=p;break}else{m=k;n=p;o=q}}c[a>>2]=l;i=f;return}function vk(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0;j=i;i=i+128|0;k=j+112|0;l=j+12|0;m=j;n=j+8|0;a[k]=37;o=k+1|0;a[o]=g;p=k+2|0;a[p]=h;a[k+3|0]=0;if(!(h<<24>>24==0)){a[o]=h;a[p]=g}gc(l|0,100,k|0,f|0,c[b>>2]|0)|0;f=m;c[f>>2]=0;c[f+4>>2]=0;c[n>>2]=l;l=(c[e>>2]|0)-d>>2;f=Jb(c[b>>2]|0)|0;b=qo(d,n,l,m)|0;if((f|0)!=0){Jb(f|0)|0}if((b|0)==-1){rl(20552)}else{c[e>>2]=d+(b<<2);i=j;return}}function wk(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function xk(a){a=a|0;return}function yk(a){a=a|0;return 127}function zk(a){a=a|0;return 127}function Ak(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Bk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Ck(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Dk(a,b){a=a|0;b=b|0;b=i;Hg(a,1,45);i=b;return}function Ek(a){a=a|0;return 0}function Fk(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function Gk(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function Hk(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Ik(a){a=a|0;return}function Jk(a){a=a|0;return 127}function Kk(a){a=a|0;return 127}function Lk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Mk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Nk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Ok(a,b){a=a|0;b=b|0;b=i;Hg(a,1,45);i=b;return}function Pk(a){a=a|0;return 0}function Qk(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function Rk(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function Sk(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Tk(a){a=a|0;return}function Uk(a){a=a|0;return 2147483647}function Vk(a){a=a|0;return 2147483647}function Wk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Xk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Yk(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function Zk(a,b){a=a|0;b=b|0;b=i;Sg(a,1,45);i=b;return}function _k(a){a=a|0;return 0}function $k(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function al(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function bl(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function cl(a){a=a|0;return}function dl(a){a=a|0;return 2147483647}function el(a){a=a|0;return 2147483647}function fl(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function gl(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function hl(a,b){a=a|0;b=b|0;b=i;c[a+0>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;i=b;return}function il(a,b){a=a|0;b=b|0;b=i;Sg(a,1,45);i=b;return}function jl(a){a=a|0;return 0}function kl(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function ll(b,c){b=b|0;c=c|0;a[b]=67109634;a[b+1|0]=262147;a[b+2|0]=1024;a[b+3|0]=4;return}function ml(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function nl(a){a=a|0;return}function ol(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;d=i;i=i+256|0;l=d;m=d+144|0;n=d+24|0;o=d+20|0;p=d+16|0;q=d+142|0;r=d+12|0;s=d+132|0;t=d+32|0;c[n>>2]=m;u=n+4|0;c[u>>2]=138;v=m+100|0;ah(p,h);m=c[p>>2]|0;if(!((c[4918]|0)==-1)){c[l>>2]=19672;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19672,l,137)}w=(c[19676>>2]|0)+ -1|0;x=c[m+8>>2]|0;if(!((c[m+12>>2]|0)-x>>2>>>0>w>>>0)){y=Fb(4)|0;Ao(y);zc(y|0,27632,123)}m=c[x+(w<<2)>>2]|0;if((m|0)==0){y=Fb(4)|0;Ao(y);zc(y|0,27632,123)}a[q]=0;c[r>>2]=c[f>>2];y=c[h+4>>2]|0;c[l+0>>2]=c[r+0>>2];if(ql(e,l,g,p,y,j,q,m,n,o,v)|0){Tc[c[(c[m>>2]|0)+32>>2]&7](m,19288,19298|0,s)|0;m=c[o>>2]|0;v=c[n>>2]|0;y=m-v|0;if((y|0)>98){g=Vo(y+2|0)|0;if((g|0)==0){fp()}else{z=g;A=g}}else{z=0;A=t}if((a[q]|0)==0){B=A}else{a[A]=45;B=A+1|0}if(v>>>0<m>>>0){m=s+10|0;A=s;q=B;g=v;while(1){v=a[g]|0;y=s;while(1){r=y+1|0;if((a[y]|0)==v<<24>>24){C=y;break}if((r|0)==(m|0)){C=m;break}else{y=r}}a[q]=a[19288+(C-A)|0]|0;y=g+1|0;v=q+1|0;if(y>>>0<(c[o>>2]|0)>>>0){q=v;g=y}else{D=v;break}}}else{D=B}a[D]=0;c[l>>2]=k;if((ic(t|0,19304,l|0)|0)!=1){l=Fb(8)|0;pg(l,19312);zc(l|0,16680,33)}if((z|0)!=0){Wo(z)}}z=c[e>>2]|0;if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[e>>2]=0;E=0}else{E=z}}else{E=0}z=(E|0)==0;e=c[f>>2]|0;do{if((e|0)!=0){if((c[e+12>>2]|0)!=(c[e+16>>2]|0)){if(z){break}else{F=33;break}}if(!((Nc[c[(c[e>>2]|0)+36>>2]&127](e)|0)==-1)){if(z){break}else{F=33;break}}else{c[f>>2]=0;F=31;break}}else{F=31}}while(0);if((F|0)==31?z:0){F=33}if((F|0)==33){c[j>>2]=c[j>>2]|2}c[b>>2]=E;jg(c[p>>2]|0)|0;p=c[n>>2]|0;c[n>>2]=0;if((p|0)==0){i=d;return}Jc[c[u>>2]&255](p);i=d;return}function pl(a){a=a|0;return}function ql(e,f,g,h,j,k,l,m,n,o,p){e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;p=p|0;var q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,eb=0,fb=0,gb=0,hb=0,ib=0,jb=0,kb=0,lb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,vb=0,wb=0,xb=0,yb=0,zb=0,Ab=0,Bb=0,Cb=0,Db=0,Eb=0,Fb=0,Gb=0,Hb=0,Ib=0,Jb=0,Kb=0,Lb=0,Mb=0,Nb=0,Ob=0,Pb=0,Qb=0,Rb=0,Sb=0,Tb=0,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,Zb=0,_b=0,$b=0,ac=0,bc=0,cc=0,dc=0,ec=0,fc=0,gc=0,hc=0,ic=0,jc=0,kc=0;q=i;i=i+480|0;r=q+72|0;s=q+68|0;t=q+473|0;u=q+472|0;v=q+56|0;w=q+44|0;x=q+32|0;y=q+20|0;z=q+8|0;A=q+4|0;B=q;c[s>>2]=0;c[v+0>>2]=0;c[v+4>>2]=0;c[v+8>>2]=0;c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;c[x+0>>2]=0;c[x+4>>2]=0;c[x+8>>2]=0;c[y+0>>2]=0;c[y+4>>2]=0;c[y+8>>2]=0;c[z+0>>2]=0;c[z+4>>2]=0;c[z+8>>2]=0;ul(g,h,s,t,u,v,w,x,y,A);c[o>>2]=c[n>>2];h=m+8|0;m=y+1|0;g=y+4|0;C=y+8|0;D=x+1|0;E=x+4|0;F=x+8|0;G=(j&512|0)!=0;j=w+1|0;H=w+8|0;I=w+4|0;J=z+1|0;K=z+8|0;L=z+4|0;M=s+3|0;N=n+4|0;O=v+4|0;P=r+400|0;Q=r;R=r;r=p;p=0;S=0;T=138;a:while(1){U=c[e>>2]|0;do{if((U|0)!=0){if((c[U+12>>2]|0)==(c[U+16>>2]|0)){if((Nc[c[(c[U>>2]|0)+36>>2]&127](U)|0)==-1){c[e>>2]=0;V=0;break}else{V=c[e>>2]|0;break}}else{V=U}}else{V=0}}while(0);U=(V|0)==0;W=c[f>>2]|0;do{if((W|0)!=0){if((c[W+12>>2]|0)!=(c[W+16>>2]|0)){if(U){X=W;break}else{Y=R;Z=Q;_=S;$=T;aa=269;break a}}if(!((Nc[c[(c[W>>2]|0)+36>>2]&127](W)|0)==-1)){if(U){X=W;break}else{Y=R;Z=Q;_=S;$=T;aa=269;break a}}else{c[f>>2]=0;aa=12;break}}else{aa=12}}while(0);if((aa|0)==12){aa=0;if(U){Y=R;Z=Q;_=S;$=T;aa=269;break}else{X=0}}b:do{switch(a[s+p|0]|0){case 0:{aa=26;break};case 1:{if((p|0)==3){Y=R;Z=Q;_=S;$=T;aa=269;break a}W=c[e>>2]|0;ba=c[W+12>>2]|0;if((ba|0)==(c[W+16>>2]|0)){ca=Nc[c[(c[W>>2]|0)+36>>2]&127](W)|0}else{ca=d[ba]|0}if(!((ca&255)<<24>>24>-1)){aa=25;break a}if((b[(c[h>>2]|0)+(ca<<24>>24<<1)>>1]&8192)==0){aa=25;break a}ba=c[e>>2]|0;W=ba+12|0;da=c[W>>2]|0;if((da|0)==(c[ba+16>>2]|0)){ea=Nc[c[(c[ba>>2]|0)+40>>2]&127](ba)|0}else{c[W>>2]=da+1;ea=d[da]|0}Ng(z,ea&255);aa=26;break};case 4:{da=r;W=Q;ba=P;fa=R;ga=0;ha=T;c:while(1){ia=c[e>>2]|0;do{if((ia|0)!=0){if((c[ia+12>>2]|0)==(c[ia+16>>2]|0)){if((Nc[c[(c[ia>>2]|0)+36>>2]&127](ia)|0)==-1){c[e>>2]=0;ja=0;break}else{ja=c[e>>2]|0;break}}else{ja=ia}}else{ja=0}}while(0);ia=(ja|0)==0;ka=c[f>>2]|0;do{if((ka|0)!=0){if((c[ka+12>>2]|0)!=(c[ka+16>>2]|0)){if(ia){break}else{break c}}if(!((Nc[c[(c[ka>>2]|0)+36>>2]&127](ka)|0)==-1)){if(ia){break}else{break c}}else{c[f>>2]=0;aa=173;break}}else{aa=173}}while(0);if((aa|0)==173?(aa=0,ia):0){break}ka=c[e>>2]|0;la=c[ka+12>>2]|0;if((la|0)==(c[ka+16>>2]|0)){ma=Nc[c[(c[ka>>2]|0)+36>>2]&127](ka)|0}else{ma=d[la]|0}la=ma&255;if(la<<24>>24>-1?!((b[(c[h>>2]|0)+(ma<<24>>24<<1)>>1]&2048)==0):0){ka=c[o>>2]|0;if((ka|0)==(da|0)){na=(c[N>>2]|0)!=138;oa=c[n>>2]|0;pa=da-oa|0;qa=pa>>>0<2147483647?pa<<1:-1;ra=Xo(na?oa:0,qa)|0;if((ra|0)==0){aa=182;break a}if(!na){na=c[n>>2]|0;c[n>>2]=ra;if((na|0)==0){sa=ra}else{Jc[c[N>>2]&255](na);sa=c[n>>2]|0}}else{c[n>>2]=ra;sa=ra}c[N>>2]=139;ra=sa+pa|0;c[o>>2]=ra;ta=ra;ua=(c[n>>2]|0)+qa|0}else{ta=ka;ua=da}c[o>>2]=ta+1;a[ta]=la;va=ua;wa=fa;xa=W;ya=ba;za=ga+1|0;Aa=ha}else{ka=a[v]|0;if((ka&1)==0){Ba=(ka&255)>>>1}else{Ba=c[O>>2]|0}if((Ba|0)==0|(ga|0)==0){break}if(!(la<<24>>24==(a[u]|0))){break}if((W|0)==(ba|0)){la=W-fa|0;ka=la>>>0<2147483647?la<<1:-1;if((ha|0)==138){Ca=0}else{Ca=fa}qa=Xo(Ca,ka)|0;if((qa|0)==0){aa=198;break a}Da=qa+(la>>2<<2)|0;Ea=qa;Fa=qa+(ka>>>2<<2)|0;Ga=139}else{Da=W;Ea=fa;Fa=ba;Ga=ha}c[Da>>2]=ga;va=da;wa=Ea;xa=Da+4|0;ya=Fa;za=0;Aa=Ga}ka=c[e>>2]|0;qa=ka+12|0;la=c[qa>>2]|0;if((la|0)==(c[ka+16>>2]|0)){Nc[c[(c[ka>>2]|0)+40>>2]&127](ka)|0;da=va;W=xa;ba=ya;fa=wa;ga=za;ha=Aa;continue}else{c[qa>>2]=la+1;da=va;W=xa;ba=ya;fa=wa;ga=za;ha=Aa;continue}}if((fa|0)==(W|0)|(ga|0)==0){Ha=fa;Ia=W;Ja=ba;Ka=ha}else{if((W|0)==(ba|0)){la=W-fa|0;qa=la>>>0<2147483647?la<<1:-1;if((ha|0)==138){La=0}else{La=fa}ka=Xo(La,qa)|0;if((ka|0)==0){aa=209;break a}Ma=ka+(la>>2<<2)|0;Na=ka;Oa=ka+(qa>>>2<<2)|0;Pa=139}else{Ma=W;Na=fa;Oa=ba;Pa=ha}c[Ma>>2]=ga;Ha=Na;Ia=Ma+4|0;Ja=Oa;Ka=Pa}qa=c[A>>2]|0;if((qa|0)>0){ka=c[e>>2]|0;do{if((ka|0)!=0){if((c[ka+12>>2]|0)==(c[ka+16>>2]|0)){if((Nc[c[(c[ka>>2]|0)+36>>2]&127](ka)|0)==-1){c[e>>2]=0;Qa=0;break}else{Qa=c[e>>2]|0;break}}else{Qa=ka}}else{Qa=0}}while(0);ka=(Qa|0)==0;ga=c[f>>2]|0;do{if((ga|0)!=0){if((c[ga+12>>2]|0)!=(c[ga+16>>2]|0)){if(ka){Ra=ga;break}else{aa=229;break a}}if(!((Nc[c[(c[ga>>2]|0)+36>>2]&127](ga)|0)==-1)){if(ka){Ra=ga;break}else{aa=229;break a}}else{c[f>>2]=0;aa=223;break}}else{aa=223}}while(0);if((aa|0)==223){aa=0;if(ka){aa=229;break a}else{Ra=0}}ga=c[e>>2]|0;ha=c[ga+12>>2]|0;if((ha|0)==(c[ga+16>>2]|0)){Sa=Nc[c[(c[ga>>2]|0)+36>>2]&127](ga)|0}else{Sa=d[ha]|0}if(!((Sa&255)<<24>>24==(a[t]|0))){aa=229;break a}ha=c[e>>2]|0;ga=ha+12|0;ba=c[ga>>2]|0;if((ba|0)==(c[ha+16>>2]|0)){Nc[c[(c[ha>>2]|0)+40>>2]&127](ha)|0;Ta=Ra;Ua=Ra;Va=da;Wa=qa}else{c[ga>>2]=ba+1;Ta=Ra;Ua=Ra;Va=da;Wa=qa}while(1){ba=c[e>>2]|0;do{if((ba|0)!=0){if((c[ba+12>>2]|0)==(c[ba+16>>2]|0)){if((Nc[c[(c[ba>>2]|0)+36>>2]&127](ba)|0)==-1){c[e>>2]=0;Xa=0;break}else{Xa=c[e>>2]|0;break}}else{Xa=ba}}else{Xa=0}}while(0);ba=(Xa|0)==0;do{if((Ua|0)!=0){if((c[Ua+12>>2]|0)!=(c[Ua+16>>2]|0)){if(ba){Ya=Ta;Za=Ua;break}else{aa=250;break a}}if(!((Nc[c[(c[Ua>>2]|0)+36>>2]&127](Ua)|0)==-1)){if(ba^(Ta|0)==0){Ya=Ta;Za=Ta;break}else{aa=250;break a}}else{c[f>>2]=0;_a=0;aa=243;break}}else{_a=Ta;aa=243}}while(0);if((aa|0)==243){aa=0;if(ba){aa=250;break a}else{Ya=_a;Za=0}}ia=c[e>>2]|0;ga=c[ia+12>>2]|0;if((ga|0)==(c[ia+16>>2]|0)){$a=Nc[c[(c[ia>>2]|0)+36>>2]&127](ia)|0}else{$a=d[ga]|0}if(!(($a&255)<<24>>24>-1)){aa=250;break a}if((b[(c[h>>2]|0)+($a<<24>>24<<1)>>1]&2048)==0){aa=250;break a}ga=c[o>>2]|0;if((ga|0)==(Va|0)){ia=(c[N>>2]|0)!=138;ha=c[n>>2]|0;fa=Va-ha|0;W=fa>>>0<2147483647?fa<<1:-1;la=Xo(ia?ha:0,W)|0;if((la|0)==0){aa=253;break a}if(!ia){ia=c[n>>2]|0;c[n>>2]=la;if((ia|0)==0){ab=la}else{Jc[c[N>>2]&255](ia);ab=c[n>>2]|0}}else{c[n>>2]=la;ab=la}c[N>>2]=139;la=ab+fa|0;c[o>>2]=la;bb=la;cb=(c[n>>2]|0)+W|0}else{bb=ga;cb=Va}ga=c[e>>2]|0;W=c[ga+12>>2]|0;if((W|0)==(c[ga+16>>2]|0)){la=Nc[c[(c[ga>>2]|0)+36>>2]&127](ga)|0;db=la;eb=c[o>>2]|0}else{db=d[W]|0;eb=bb}c[o>>2]=eb+1;a[eb]=db;W=Wa+ -1|0;c[A>>2]=W;la=c[e>>2]|0;ga=la+12|0;fa=c[ga>>2]|0;if((fa|0)==(c[la+16>>2]|0)){Nc[c[(c[la>>2]|0)+40>>2]&127](la)|0}else{c[ga>>2]=fa+1}if((W|0)>0){Ta=Ya;Ua=Za;Va=cb;Wa=W}else{fb=cb;break}}}else{fb=da}if((c[o>>2]|0)==(c[n>>2]|0)){aa=267;break a}else{gb=fb;hb=Ha;ib=Ia;jb=Ja;kb=S;lb=Ka}break};case 3:{qa=a[x]|0;ka=(qa&1)==0;if(ka){mb=(qa&255)>>>1}else{mb=c[E>>2]|0}W=a[y]|0;fa=(W&1)==0;if(fa){nb=(W&255)>>>1}else{nb=c[g>>2]|0}if((mb|0)==(0-nb|0)){gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T}else{if(ka){ob=(qa&255)>>>1}else{ob=c[E>>2]|0}if((ob|0)!=0){if(fa){pb=(W&255)>>>1}else{pb=c[g>>2]|0}if((pb|0)!=0){fa=c[e>>2]|0;ga=c[fa+12>>2]|0;la=c[fa+16>>2]|0;if((ga|0)==(la|0)){ia=Nc[c[(c[fa>>2]|0)+36>>2]&127](fa)|0;ha=c[e>>2]|0;qb=ia;rb=a[x]|0;sb=ha;tb=c[ha+12>>2]|0;ub=c[ha+16>>2]|0}else{qb=d[ga]|0;rb=qa;sb=fa;tb=ga;ub=la}la=sb+12|0;ga=(tb|0)==(ub|0);if((qb&255)<<24>>24==(a[(rb&1)==0?D:c[F>>2]|0]|0)){if(ga){Nc[c[(c[sb>>2]|0)+40>>2]&127](sb)|0}else{c[la>>2]=tb+1}la=a[x]|0;if((la&1)==0){vb=(la&255)>>>1}else{vb=c[E>>2]|0}gb=r;hb=R;ib=Q;jb=P;kb=vb>>>0>1?x:S;lb=T;break b}if(ga){wb=Nc[c[(c[sb>>2]|0)+36>>2]&127](sb)|0}else{wb=d[tb]|0}if(!((wb&255)<<24>>24==(a[(a[y]&1)==0?m:c[C>>2]|0]|0))){aa=112;break a}ga=c[e>>2]|0;la=ga+12|0;fa=c[la>>2]|0;if((fa|0)==(c[ga+16>>2]|0)){Nc[c[(c[ga>>2]|0)+40>>2]&127](ga)|0}else{c[la>>2]=fa+1}a[l]=1;fa=a[y]|0;if((fa&1)==0){xb=(fa&255)>>>1}else{xb=c[g>>2]|0}gb=r;hb=R;ib=Q;jb=P;kb=xb>>>0>1?y:S;lb=T;break b}}if(ka){yb=(qa&255)>>>1}else{yb=c[E>>2]|0}ka=c[e>>2]|0;fa=c[ka+12>>2]|0;la=(fa|0)==(c[ka+16>>2]|0);if((yb|0)==0){if(la){ga=Nc[c[(c[ka>>2]|0)+36>>2]&127](ka)|0;zb=ga;Ab=a[y]|0}else{zb=d[fa]|0;Ab=W}if(!((zb&255)<<24>>24==(a[(Ab&1)==0?m:c[C>>2]|0]|0))){gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break b}W=c[e>>2]|0;ga=W+12|0;ha=c[ga>>2]|0;if((ha|0)==(c[W+16>>2]|0)){Nc[c[(c[W>>2]|0)+40>>2]&127](W)|0}else{c[ga>>2]=ha+1}a[l]=1;ha=a[y]|0;if((ha&1)==0){Bb=(ha&255)>>>1}else{Bb=c[g>>2]|0}gb=r;hb=R;ib=Q;jb=P;kb=Bb>>>0>1?y:S;lb=T;break b}if(la){la=Nc[c[(c[ka>>2]|0)+36>>2]&127](ka)|0;Cb=la;Db=a[x]|0}else{Cb=d[fa]|0;Db=qa}if(!((Cb&255)<<24>>24==(a[(Db&1)==0?D:c[F>>2]|0]|0))){a[l]=1;gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break b}qa=c[e>>2]|0;fa=qa+12|0;la=c[fa>>2]|0;if((la|0)==(c[qa+16>>2]|0)){Nc[c[(c[qa>>2]|0)+40>>2]&127](qa)|0}else{c[fa>>2]=la+1}la=a[x]|0;if((la&1)==0){Eb=(la&255)>>>1}else{Eb=c[E>>2]|0}gb=r;hb=R;ib=Q;jb=P;kb=Eb>>>0>1?x:S;lb=T}break};case 2:{if(!((S|0)!=0|p>>>0<2)){if((p|0)==2){Fb=(a[M]|0)!=0}else{Fb=0}if(!(G|Fb)){gb=r;hb=R;ib=Q;jb=P;kb=0;lb=T;break b}}la=a[w]|0;fa=(la&1)==0;qa=fa?j:c[H>>2]|0;d:do{if((p|0)!=0?(d[s+(p+ -1)|0]|0)<2:0){ka=qa+(fa?(la&255)>>>1:c[I>>2]|0)|0;ha=qa;while(1){if((ha|0)==(ka|0)){Gb=ka;break}ga=a[ha]|0;if(!(ga<<24>>24>-1)){Gb=ha;break}if((b[(c[h>>2]|0)+(ga<<24>>24<<1)>>1]&8192)==0){Gb=ha;break}else{ha=ha+1|0}}ha=Gb-qa|0;ka=a[z]|0;ba=(ka&1)==0;if(ba){Hb=(ka&255)>>>1}else{Hb=c[L>>2]|0}if(!(ha>>>0>Hb>>>0)){if(ba){ba=(ka&255)>>>1;Ib=J;Jb=ba;Kb=z+(ba-ha)+1|0}else{ba=c[K>>2]|0;ka=c[L>>2]|0;Ib=ba;Jb=ka;Kb=ba+(ka-ha)|0}ha=Ib+Jb|0;if((Kb|0)==(ha|0)){Lb=X;Mb=la;Nb=Gb;Ob=X}else{ka=Kb;ba=qa;while(1){if((a[ka]|0)!=(a[ba]|0)){Lb=X;Mb=la;Nb=qa;Ob=X;break d}ga=ka+1|0;if((ga|0)==(ha|0)){Lb=X;Mb=la;Nb=Gb;Ob=X;break}else{ka=ga;ba=ba+1|0}}}}else{Lb=X;Mb=la;Nb=qa;Ob=X}}else{Lb=X;Mb=la;Nb=qa;Ob=X}}while(0);e:while(1){if((Mb&1)==0){Pb=j;Qb=(Mb&255)>>>1}else{Pb=c[H>>2]|0;Qb=c[I>>2]|0}if((Nb|0)==(Pb+Qb|0)){break}qa=c[e>>2]|0;do{if((qa|0)!=0){if((c[qa+12>>2]|0)==(c[qa+16>>2]|0)){if((Nc[c[(c[qa>>2]|0)+36>>2]&127](qa)|0)==-1){c[e>>2]=0;Rb=0;break}else{Rb=c[e>>2]|0;break}}else{Rb=qa}}else{Rb=0}}while(0);qa=(Rb|0)==0;do{if((Ob|0)!=0){if((c[Ob+12>>2]|0)!=(c[Ob+16>>2]|0)){if(qa){Sb=Lb;Tb=Ob;break}else{break e}}if(!((Nc[c[(c[Ob>>2]|0)+36>>2]&127](Ob)|0)==-1)){if(qa^(Lb|0)==0){Sb=Lb;Tb=Lb;break}else{break e}}else{c[f>>2]=0;Ub=0;aa=147;break}}else{Ub=Lb;aa=147}}while(0);if((aa|0)==147){aa=0;if(qa){break}else{Sb=Ub;Tb=0}}la=c[e>>2]|0;fa=c[la+12>>2]|0;if((fa|0)==(c[la+16>>2]|0)){Vb=Nc[c[(c[la>>2]|0)+36>>2]&127](la)|0}else{Vb=d[fa]|0}if(!((Vb&255)<<24>>24==(a[Nb]|0))){break}fa=c[e>>2]|0;la=fa+12|0;da=c[la>>2]|0;if((da|0)==(c[fa+16>>2]|0)){Nc[c[(c[fa>>2]|0)+40>>2]&127](fa)|0}else{c[la>>2]=da+1}Lb=Sb;Mb=a[w]|0;Nb=Nb+1|0;Ob=Tb}if(G){da=a[w]|0;if((da&1)==0){Wb=j;Xb=(da&255)>>>1}else{Wb=c[H>>2]|0;Xb=c[I>>2]|0}if((Nb|0)!=(Wb+Xb|0)){aa=162;break a}else{gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T}}else{gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T}break};default:{gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T}}}while(0);f:do{if((aa|0)==26){aa=0;if((p|0)==3){Y=R;Z=Q;_=S;$=T;aa=269;break a}else{Yb=X;Zb=X}while(1){U=c[e>>2]|0;do{if((U|0)!=0){if((c[U+12>>2]|0)==(c[U+16>>2]|0)){if((Nc[c[(c[U>>2]|0)+36>>2]&127](U)|0)==-1){c[e>>2]=0;_b=0;break}else{_b=c[e>>2]|0;break}}else{_b=U}}else{_b=0}}while(0);U=(_b|0)==0;do{if((Zb|0)!=0){if((c[Zb+12>>2]|0)!=(c[Zb+16>>2]|0)){if(U){$b=Yb;ac=Zb;break}else{gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break f}}if(!((Nc[c[(c[Zb>>2]|0)+36>>2]&127](Zb)|0)==-1)){if(U^(Yb|0)==0){$b=Yb;ac=Yb;break}else{gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break f}}else{c[f>>2]=0;bc=0;aa=37;break}}else{bc=Yb;aa=37}}while(0);if((aa|0)==37){aa=0;if(U){gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break f}else{$b=bc;ac=0}}qa=c[e>>2]|0;da=c[qa+12>>2]|0;if((da|0)==(c[qa+16>>2]|0)){cc=Nc[c[(c[qa>>2]|0)+36>>2]&127](qa)|0}else{cc=d[da]|0}if(!((cc&255)<<24>>24>-1)){gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break f}if((b[(c[h>>2]|0)+(cc<<24>>24<<1)>>1]&8192)==0){gb=r;hb=R;ib=Q;jb=P;kb=S;lb=T;break f}da=c[e>>2]|0;qa=da+12|0;la=c[qa>>2]|0;if((la|0)==(c[da+16>>2]|0)){dc=Nc[c[(c[da>>2]|0)+40>>2]&127](da)|0}else{c[qa>>2]=la+1;dc=d[la]|0}Ng(z,dc&255);Yb=$b;Zb=ac}}}while(0);la=p+1|0;if(la>>>0<4){P=jb;Q=ib;R=hb;r=gb;p=la;S=kb;T=lb}else{Y=hb;Z=ib;_=kb;$=lb;aa=269;break}}g:do{if((aa|0)==25){c[k>>2]=c[k>>2]|4;ec=0;fc=R;gc=T}else if((aa|0)==112){c[k>>2]=c[k>>2]|4;ec=0;fc=R;gc=T}else if((aa|0)==162){c[k>>2]=c[k>>2]|4;ec=0;fc=R;gc=T}else if((aa|0)==182){fp()}else if((aa|0)==198){fp()}else if((aa|0)==209){fp()}else if((aa|0)==229){c[k>>2]=c[k>>2]|4;ec=0;fc=Ha;gc=Ka}else if((aa|0)==250){c[k>>2]=c[k>>2]|4;ec=0;fc=Ha;gc=Ka}else if((aa|0)==253){fp()}else if((aa|0)==267){c[k>>2]=c[k>>2]|4;ec=0;fc=Ha;gc=Ka}else if((aa|0)==269){h:do{if((_|0)!=0){lb=_+1|0;kb=_+8|0;ib=_+4|0;hb=1;i:while(1){S=a[_]|0;if((S&1)==0){hc=(S&255)>>>1}else{hc=c[ib>>2]|0}if(!(hb>>>0<hc>>>0)){break h}S=c[e>>2]|0;do{if((S|0)!=0){if((c[S+12>>2]|0)==(c[S+16>>2]|0)){if((Nc[c[(c[S>>2]|0)+36>>2]&127](S)|0)==-1){c[e>>2]=0;ic=0;break}else{ic=c[e>>2]|0;break}}else{ic=S}}else{ic=0}}while(0);S=(ic|0)==0;U=c[f>>2]|0;do{if((U|0)!=0){if((c[U+12>>2]|0)!=(c[U+16>>2]|0)){if(S){break}else{break i}}if(!((Nc[c[(c[U>>2]|0)+36>>2]&127](U)|0)==-1)){if(S){break}else{break i}}else{c[f>>2]=0;aa=285;break}}else{aa=285}}while(0);if((aa|0)==285?(aa=0,S):0){break}U=c[e>>2]|0;p=c[U+12>>2]|0;if((p|0)==(c[U+16>>2]|0)){jc=Nc[c[(c[U>>2]|0)+36>>2]&127](U)|0}else{jc=d[p]|0}if((a[_]&1)==0){kc=lb}else{kc=c[kb>>2]|0}if(!((jc&255)<<24>>24==(a[kc+hb|0]|0))){break}p=hb+1|0;U=c[e>>2]|0;gb=U+12|0;r=c[gb>>2]|0;if((r|0)==(c[U+16>>2]|0)){Nc[c[(c[U>>2]|0)+40>>2]&127](U)|0;hb=p;continue}else{c[gb>>2]=r+1;hb=p;continue}}c[k>>2]=c[k>>2]|4;ec=0;fc=Y;gc=$;break g}}while(0);if((Y|0)!=(Z|0)){c[B>>2]=0;vl(v,Y,Z,B);if((c[B>>2]|0)==0){ec=1;fc=Y;gc=$}else{c[k>>2]=c[k>>2]|4;ec=0;fc=Y;gc=$}}else{ec=1;fc=Z;gc=$}}}while(0);Ig(z);Ig(y);Ig(x);Ig(w);Ig(v);if((fc|0)==0){i=q;return ec|0}Jc[gc&255](fc);i=q;return ec|0}function rl(a){a=a|0;var b=0;b=Fb(8)|0;pg(b,a);zc(b|0,16680,33)}function sl(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;i=i+144|0;l=d;m=d+36|0;n=d+24|0;o=d+20|0;p=d+16|0;q=d+32|0;r=d+12|0;c[n>>2]=m;s=n+4|0;c[s>>2]=138;t=m+100|0;ah(p,h);m=c[p>>2]|0;if(!((c[4918]|0)==-1)){c[l>>2]=19672;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19672,l,137)}u=(c[19676>>2]|0)+ -1|0;v=c[m+8>>2]|0;if(!((c[m+12>>2]|0)-v>>2>>>0>u>>>0)){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}m=c[v+(u<<2)>>2]|0;if((m|0)==0){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}a[q]=0;w=c[f>>2]|0;c[r>>2]=w;u=c[h+4>>2]|0;c[l+0>>2]=c[r+0>>2];if(ql(e,l,g,p,u,j,q,m,n,o,t)|0){if((a[k]&1)==0){a[k+1|0]=0;a[k]=0}else{a[c[k+8>>2]|0]=0;c[k+4>>2]=0}if((a[q]|0)!=0){Ng(k,Wc[c[(c[m>>2]|0)+28>>2]&15](m,45)|0)}q=Wc[c[(c[m>>2]|0)+28>>2]&15](m,48)|0;m=c[n>>2]|0;t=c[o>>2]|0;o=t+ -1|0;a:do{if(m>>>0<o>>>0){u=m;while(1){g=u+1|0;if(!((a[u]|0)==q<<24>>24)){x=u;break a}if(g>>>0<o>>>0){u=g}else{x=g;break}}}else{x=m}}while(0);tl(k,x,t)|0}t=c[e>>2]|0;if((t|0)!=0){if((c[t+12>>2]|0)==(c[t+16>>2]|0)?(Nc[c[(c[t>>2]|0)+36>>2]&127](t)|0)==-1:0){c[e>>2]=0;y=0}else{y=t}}else{y=0}t=(y|0)==0;do{if((w|0)!=0){if((c[w+12>>2]|0)!=(c[w+16>>2]|0)){if(t){break}else{z=27;break}}if(!((Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0)==-1)){if(t^(w|0)==0){break}else{z=27;break}}else{c[f>>2]=0;z=25;break}}else{z=25}}while(0);if((z|0)==25?t:0){z=27}if((z|0)==27){c[j>>2]=c[j>>2]|2}c[b>>2]=y;jg(c[p>>2]|0)|0;p=c[n>>2]|0;c[n>>2]=0;if((p|0)==0){i=d;return}Jc[c[s>>2]&255](p);i=d;return}function tl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;g=d;h=a[b]|0;if((h&1)==0){j=(h&255)>>>1;k=10;l=h}else{h=c[b>>2]|0;j=c[b+4>>2]|0;k=(h&-2)+ -1|0;l=h&255}h=e-g|0;if((e|0)==(d|0)){i=f;return b|0}if((k-j|0)>>>0<h>>>0){Qg(b,k,j+h-k|0,j,j,0,0);m=a[b]|0}else{m=l}if((m&1)==0){n=b+1|0}else{n=c[b+8>>2]|0}m=e+(j-g)|0;g=d;d=n+j|0;while(1){a[d]=a[g]|0;g=g+1|0;if((g|0)==(e|0)){break}else{d=d+1|0}}a[n+m|0]=0;m=j+h|0;if((a[b]&1)==0){a[b]=m<<1;i=f;return b|0}else{c[b+4>>2]=m;i=f;return b|0}return 0}function ul(b,d,e,f,g,h,j,k,l,m){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;n=i;i=i+128|0;o=n;p=n+112|0;q=n+100|0;r=n+88|0;s=n+76|0;t=n+64|0;u=n+60|0;v=n+48|0;w=n+36|0;x=n+24|0;y=n+12|0;if(b){b=c[d>>2]|0;if(!((c[4778]|0)==-1)){c[o>>2]=19112;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19112,o,137)}z=(c[19116>>2]|0)+ -1|0;A=c[b+8>>2]|0;if(!((c[b+12>>2]|0)-A>>2>>>0>z>>>0)){B=Fb(4)|0;Ao(B);zc(B|0,27632,123)}b=c[A+(z<<2)>>2]|0;if((b|0)==0){B=Fb(4)|0;Ao(B);zc(B|0,27632,123)}Lc[c[(c[b>>2]|0)+44>>2]&63](p,b);B=c[p>>2]|0;a[e]=B;a[e+1|0]=B>>8;a[e+2|0]=B>>16;a[e+3|0]=B>>24;Lc[c[(c[b>>2]|0)+32>>2]&63](q,b);if((a[l]&1)==0){a[l+1|0]=0;a[l]=0}else{a[c[l+8>>2]|0]=0;c[l+4>>2]=0}Mg(l,0);c[l+0>>2]=c[q+0>>2];c[l+4>>2]=c[q+4>>2];c[l+8>>2]=c[q+8>>2];c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Ig(q);Lc[c[(c[b>>2]|0)+28>>2]&63](r,b);if((a[k]&1)==0){a[k+1|0]=0;a[k]=0}else{a[c[k+8>>2]|0]=0;c[k+4>>2]=0}Mg(k,0);c[k+0>>2]=c[r+0>>2];c[k+4>>2]=c[r+4>>2];c[k+8>>2]=c[r+8>>2];c[r+0>>2]=0;c[r+4>>2]=0;c[r+8>>2]=0;Ig(r);r=Nc[c[(c[b>>2]|0)+12>>2]&127](b)|0;a[f]=r;r=Nc[c[(c[b>>2]|0)+16>>2]&127](b)|0;a[g]=r;Lc[c[(c[b>>2]|0)+20>>2]&63](s,b);if((a[h]&1)==0){a[h+1|0]=0;a[h]=0}else{a[c[h+8>>2]|0]=0;c[h+4>>2]=0}Mg(h,0);c[h+0>>2]=c[s+0>>2];c[h+4>>2]=c[s+4>>2];c[h+8>>2]=c[s+8>>2];c[s+0>>2]=0;c[s+4>>2]=0;c[s+8>>2]=0;Ig(s);Lc[c[(c[b>>2]|0)+24>>2]&63](t,b);if((a[j]&1)==0){a[j+1|0]=0;a[j]=0}else{a[c[j+8>>2]|0]=0;c[j+4>>2]=0}Mg(j,0);c[j+0>>2]=c[t+0>>2];c[j+4>>2]=c[t+4>>2];c[j+8>>2]=c[t+8>>2];c[t+0>>2]=0;c[t+4>>2]=0;c[t+8>>2]=0;Ig(t);C=Nc[c[(c[b>>2]|0)+36>>2]&127](b)|0;c[m>>2]=C;i=n;return}else{b=c[d>>2]|0;if(!((c[4762]|0)==-1)){c[o>>2]=19048;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19048,o,137)}o=(c[19052>>2]|0)+ -1|0;d=c[b+8>>2]|0;if(!((c[b+12>>2]|0)-d>>2>>>0>o>>>0)){D=Fb(4)|0;Ao(D);zc(D|0,27632,123)}b=c[d+(o<<2)>>2]|0;if((b|0)==0){D=Fb(4)|0;Ao(D);zc(D|0,27632,123)}Lc[c[(c[b>>2]|0)+44>>2]&63](u,b);D=c[u>>2]|0;a[e]=D;a[e+1|0]=D>>8;a[e+2|0]=D>>16;a[e+3|0]=D>>24;Lc[c[(c[b>>2]|0)+32>>2]&63](v,b);if((a[l]&1)==0){a[l+1|0]=0;a[l]=0}else{a[c[l+8>>2]|0]=0;c[l+4>>2]=0}Mg(l,0);c[l+0>>2]=c[v+0>>2];c[l+4>>2]=c[v+4>>2];c[l+8>>2]=c[v+8>>2];c[v+0>>2]=0;c[v+4>>2]=0;c[v+8>>2]=0;Ig(v);Lc[c[(c[b>>2]|0)+28>>2]&63](w,b);if((a[k]&1)==0){a[k+1|0]=0;a[k]=0}else{a[c[k+8>>2]|0]=0;c[k+4>>2]=0}Mg(k,0);c[k+0>>2]=c[w+0>>2];c[k+4>>2]=c[w+4>>2];c[k+8>>2]=c[w+8>>2];c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;Ig(w);w=Nc[c[(c[b>>2]|0)+12>>2]&127](b)|0;a[f]=w;w=Nc[c[(c[b>>2]|0)+16>>2]&127](b)|0;a[g]=w;Lc[c[(c[b>>2]|0)+20>>2]&63](x,b);if((a[h]&1)==0){a[h+1|0]=0;a[h]=0}else{a[c[h+8>>2]|0]=0;c[h+4>>2]=0}Mg(h,0);c[h+0>>2]=c[x+0>>2];c[h+4>>2]=c[x+4>>2];c[h+8>>2]=c[x+8>>2];c[x+0>>2]=0;c[x+4>>2]=0;c[x+8>>2]=0;Ig(x);Lc[c[(c[b>>2]|0)+24>>2]&63](y,b);if((a[j]&1)==0){a[j+1|0]=0;a[j]=0}else{a[c[j+8>>2]|0]=0;c[j+4>>2]=0}Mg(j,0);c[j+0>>2]=c[y+0>>2];c[j+4>>2]=c[y+4>>2];c[j+8>>2]=c[y+8>>2];c[y+0>>2]=0;c[y+4>>2]=0;c[y+8>>2]=0;Ig(y);C=Nc[c[(c[b>>2]|0)+36>>2]&127](b)|0;c[m>>2]=C;i=n;return}}function vl(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;h=a[b]|0;if((h&1)==0){j=(h&255)>>>1}else{j=c[b+4>>2]|0}if((j|0)==0){i=g;return}if((d|0)!=(e|0)?(j=e+ -4|0,j>>>0>d>>>0):0){k=d;l=j;do{j=c[k>>2]|0;c[k>>2]=c[l>>2];c[l>>2]=j;k=k+4|0;l=l+ -4|0}while(k>>>0<l>>>0);m=a[b]|0}else{m=h}if((m&1)==0){n=b+1|0;o=(m&255)>>>1}else{n=c[b+8>>2]|0;o=c[b+4>>2]|0}b=e+ -4|0;e=a[n]|0;m=e<<24>>24<1|e<<24>>24==127;a:do{if(b>>>0>d>>>0){h=n+o|0;l=e;k=n;j=d;p=m;while(1){if(!p?(l<<24>>24|0)!=(c[j>>2]|0):0){break}q=(h-k|0)>1?k+1|0:k;r=j+4|0;s=a[q]|0;t=s<<24>>24<1|s<<24>>24==127;if(r>>>0<b>>>0){l=s;k=q;j=r;p=t}else{u=s;v=t;break a}}c[f>>2]=4;i=g;return}else{u=e;v=m}}while(0);if(v){i=g;return}v=c[b>>2]|0;if(!(u<<24>>24>>>0<v>>>0|(v|0)==0)){i=g;return}c[f>>2]=4;i=g;return}function wl(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function xl(a){a=a|0;return}function yl(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;d=i;i=i+592|0;l=d;m=d+80|0;n=d+72|0;o=d+64|0;p=d+60|0;q=d+580|0;r=d+56|0;s=d+16|0;t=d+480|0;c[n>>2]=m;u=n+4|0;c[u>>2]=138;v=m+400|0;ah(p,h);m=c[p>>2]|0;if(!((c[4916]|0)==-1)){c[l>>2]=19664;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19664,l,137)}w=(c[19668>>2]|0)+ -1|0;x=c[m+8>>2]|0;if(!((c[m+12>>2]|0)-x>>2>>>0>w>>>0)){y=Fb(4)|0;Ao(y);zc(y|0,27632,123)}m=c[x+(w<<2)>>2]|0;if((m|0)==0){y=Fb(4)|0;Ao(y);zc(y|0,27632,123)}a[q]=0;c[r>>2]=c[f>>2];y=c[h+4>>2]|0;c[l+0>>2]=c[r+0>>2];if(zl(e,l,g,p,y,j,q,m,n,o,v)|0){Tc[c[(c[m>>2]|0)+48>>2]&7](m,19368,19378|0,s)|0;m=c[o>>2]|0;v=c[n>>2]|0;y=m-v|0;if((y|0)>392){g=Vo((y>>2)+2|0)|0;if((g|0)==0){fp()}else{z=g;A=g}}else{z=0;A=t}if((a[q]|0)==0){B=A}else{a[A]=45;B=A+1|0}if(v>>>0<m>>>0){m=s+40|0;A=s;q=B;g=v;while(1){v=c[g>>2]|0;y=s;while(1){r=y+4|0;if((c[y>>2]|0)==(v|0)){C=y;break}if((r|0)==(m|0)){C=m;break}else{y=r}}a[q]=a[19368+(C-A>>2)|0]|0;y=g+4|0;v=q+1|0;if(y>>>0<(c[o>>2]|0)>>>0){q=v;g=y}else{D=v;break}}}else{D=B}a[D]=0;c[l>>2]=k;if((ic(t|0,19304,l|0)|0)!=1){l=Fb(8)|0;pg(l,19312);zc(l|0,16680,33)}if((z|0)!=0){Wo(z)}}z=c[e>>2]|0;do{if((z|0)!=0){l=c[z+12>>2]|0;if((l|0)==(c[z+16>>2]|0)){E=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{E=c[l>>2]|0}if((E|0)==-1){c[e>>2]=0;F=1;break}else{F=(c[e>>2]|0)==0;break}}else{F=1}}while(0);E=c[f>>2]|0;do{if((E|0)!=0){z=c[E+12>>2]|0;if((z|0)==(c[E+16>>2]|0)){G=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{G=c[z>>2]|0}if(!((G|0)==-1)){if(F){break}else{H=37;break}}else{c[f>>2]=0;H=35;break}}else{H=35}}while(0);if((H|0)==35?F:0){H=37}if((H|0)==37){c[j>>2]=c[j>>2]|2}c[b>>2]=c[e>>2];jg(c[p>>2]|0)|0;p=c[n>>2]|0;c[n>>2]=0;if((p|0)==0){i=d;return}Jc[c[u>>2]&255](p);i=d;return}function zl(b,e,f,g,h,j,k,l,m,n,o){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;var p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,eb=0,fb=0,gb=0,hb=0,ib=0,jb=0,kb=0,lb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,vb=0,wb=0,xb=0,yb=0,zb=0,Ab=0,Bb=0,Cb=0,Db=0,Eb=0,Fb=0,Gb=0,Hb=0,Ib=0,Jb=0,Kb=0,Lb=0,Mb=0,Nb=0,Ob=0,Pb=0,Qb=0,Rb=0,Sb=0,Tb=0,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,Zb=0,_b=0,$b=0,ac=0,bc=0,cc=0,dc=0,ec=0,fc=0,gc=0,hc=0,ic=0,jc=0,kc=0,lc=0,mc=0,nc=0,oc=0,pc=0,qc=0,rc=0,sc=0,tc=0;p=i;i=i+480|0;q=p+80|0;r=p+76|0;s=p+72|0;t=p+68|0;u=p+56|0;v=p+44|0;w=p+32|0;x=p+20|0;y=p+8|0;z=p+4|0;A=p;c[r>>2]=0;c[u+0>>2]=0;c[u+4>>2]=0;c[u+8>>2]=0;c[v+0>>2]=0;c[v+4>>2]=0;c[v+8>>2]=0;c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;c[x+0>>2]=0;c[x+4>>2]=0;c[x+8>>2]=0;c[y+0>>2]=0;c[y+4>>2]=0;c[y+8>>2]=0;Cl(f,g,r,s,t,u,v,w,x,z);c[n>>2]=c[m>>2];g=x+4|0;f=x+8|0;B=w+4|0;C=w+8|0;D=(h&512|0)!=0;h=v+4|0;E=v+8|0;F=y+4|0;G=y+8|0;H=r+3|0;I=m+4|0;J=u+4|0;K=q+400|0;L=q;M=q;q=o;o=0;N=0;O=138;a:while(1){P=c[b>>2]|0;do{if((P|0)!=0){Q=c[P+12>>2]|0;if((Q|0)==(c[P+16>>2]|0)){R=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{R=c[Q>>2]|0}if((R|0)==-1){c[b>>2]=0;S=1;break}else{S=(c[b>>2]|0)==0;break}}else{S=1}}while(0);P=c[e>>2]|0;do{if((P|0)!=0){Q=c[P+12>>2]|0;if((Q|0)==(c[P+16>>2]|0)){T=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{T=c[Q>>2]|0}if(!((T|0)==-1)){if(S){U=P;break}else{V=M;W=L;X=N;Y=O;Z=292;break a}}else{c[e>>2]=0;Z=15;break}}else{Z=15}}while(0);if((Z|0)==15){Z=0;if(S){V=M;W=L;X=N;Y=O;Z=292;break}else{U=0}}b:do{switch(a[r+o|0]|0){case 1:{if((o|0)==3){V=M;W=L;X=N;Y=O;Z=292;break a}P=c[b>>2]|0;Q=c[P+12>>2]|0;if((Q|0)==(c[P+16>>2]|0)){_=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{_=c[Q>>2]|0}if(!(Gc[c[(c[l>>2]|0)+12>>2]&31](l,8192,_)|0)){Z=27;break a}Q=c[b>>2]|0;P=Q+12|0;$=c[P>>2]|0;if(($|0)==(c[Q+16>>2]|0)){aa=Nc[c[(c[Q>>2]|0)+40>>2]&127](Q)|0}else{c[P>>2]=$+4;aa=c[$>>2]|0}Xg(y,aa);Z=28;break};case 2:{if(!((N|0)!=0|o>>>0<2)){if((o|0)==2){ba=(a[H]|0)!=0}else{ba=0}if(!(D|ba)){ca=q;da=M;ea=L;fa=K;ga=0;ha=O;break b}}$=a[v]|0;P=($&1)==0?h:c[E>>2]|0;c:do{if((o|0)!=0?(d[r+(o+ -1)|0]|0)<2:0){Q=$;ia=P;while(1){if((Q&1)==0){ja=h;ka=(Q&255)>>>1}else{ja=c[E>>2]|0;ka=c[h>>2]|0}if((ia|0)==(ja+(ka<<2)|0)){la=Q;break}if(!(Gc[c[(c[l>>2]|0)+12>>2]&31](l,8192,c[ia>>2]|0)|0)){Z=129;break}Q=a[v]|0;ia=ia+4|0}if((Z|0)==129){Z=0;la=a[v]|0}Q=(la&1)==0;ma=ia-(Q?h:c[E>>2]|0)>>2;na=a[y]|0;oa=(na&1)==0;if(oa){pa=(na&255)>>>1}else{pa=c[F>>2]|0}d:do{if(!(ma>>>0>pa>>>0)){if(oa){qa=F;ra=(na&255)>>>1;sa=F+(((na&255)>>>1)-ma<<2)|0}else{ta=c[G>>2]|0;ua=c[F>>2]|0;qa=ta;ra=ua;sa=ta+(ua-ma<<2)|0}ua=qa+(ra<<2)|0;if((sa|0)==(ua|0)){va=U;wa=la;xa=ia;ya=U;break c}else{za=sa;Aa=Q?h:c[E>>2]|0}while(1){if((c[za>>2]|0)!=(c[Aa>>2]|0)){break d}ta=za+4|0;if((ta|0)==(ua|0)){va=U;wa=la;xa=ia;ya=U;break c}za=ta;Aa=Aa+4|0}}}while(0);va=U;wa=la;xa=Q?h:c[E>>2]|0;ya=U}else{va=U;wa=$;xa=P;ya=U}}while(0);e:while(1){if((wa&1)==0){Ba=h;Ca=(wa&255)>>>1}else{Ba=c[E>>2]|0;Ca=c[h>>2]|0}if((xa|0)==(Ba+(Ca<<2)|0)){break}P=c[b>>2]|0;do{if((P|0)!=0){$=c[P+12>>2]|0;if(($|0)==(c[P+16>>2]|0)){Da=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{Da=c[$>>2]|0}if((Da|0)==-1){c[b>>2]=0;Ea=1;break}else{Ea=(c[b>>2]|0)==0;break}}else{Ea=1}}while(0);do{if((ya|0)!=0){P=c[ya+12>>2]|0;if((P|0)==(c[ya+16>>2]|0)){Fa=Nc[c[(c[ya>>2]|0)+36>>2]&127](ya)|0}else{Fa=c[P>>2]|0}if(!((Fa|0)==-1)){if(Ea^(va|0)==0){Ga=va;Ha=va;break}else{break e}}else{c[e>>2]=0;Ia=0;Z=159;break}}else{Ia=va;Z=159}}while(0);if((Z|0)==159){Z=0;if(Ea){break}else{Ga=Ia;Ha=0}}P=c[b>>2]|0;Q=c[P+12>>2]|0;if((Q|0)==(c[P+16>>2]|0)){Ja=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{Ja=c[Q>>2]|0}if((Ja|0)!=(c[xa>>2]|0)){break}Q=c[b>>2]|0;P=Q+12|0;$=c[P>>2]|0;if(($|0)==(c[Q+16>>2]|0)){Nc[c[(c[Q>>2]|0)+40>>2]&127](Q)|0}else{c[P>>2]=$+4}va=Ga;wa=a[v]|0;xa=xa+4|0;ya=Ha}if(D){$=a[v]|0;if(($&1)==0){Ka=h;La=($&255)>>>1}else{Ka=c[E>>2]|0;La=c[h>>2]|0}if((xa|0)!=(Ka+(La<<2)|0)){Z=174;break a}else{ca=q;da=M;ea=L;fa=K;ga=N;ha=O}}else{ca=q;da=M;ea=L;fa=K;ga=N;ha=O}break};case 3:{$=a[w]|0;P=($&1)==0;if(P){Ma=($&255)>>>1}else{Ma=c[B>>2]|0}Q=a[x]|0;ia=(Q&1)==0;if(ia){Na=(Q&255)>>>1}else{Na=c[g>>2]|0}if((Ma|0)==(0-Na|0)){ca=q;da=M;ea=L;fa=K;ga=N;ha=O}else{if(P){Oa=($&255)>>>1}else{Oa=c[B>>2]|0}if((Oa|0)!=0){if(ia){Pa=(Q&255)>>>1}else{Pa=c[g>>2]|0}if((Pa|0)!=0){ia=c[b>>2]|0;ma=c[ia+12>>2]|0;if((ma|0)==(c[ia+16>>2]|0)){na=Nc[c[(c[ia>>2]|0)+36>>2]&127](ia)|0;Qa=na;Ra=a[w]|0}else{Qa=c[ma>>2]|0;Ra=$}ma=c[b>>2]|0;na=ma+12|0;ia=c[na>>2]|0;oa=(ia|0)==(c[ma+16>>2]|0);if((Qa|0)==(c[((Ra&1)==0?B:c[C>>2]|0)>>2]|0)){if(oa){Nc[c[(c[ma>>2]|0)+40>>2]&127](ma)|0}else{c[na>>2]=ia+4}na=a[w]|0;if((na&1)==0){Sa=(na&255)>>>1}else{Sa=c[B>>2]|0}ca=q;da=M;ea=L;fa=K;ga=Sa>>>0>1?w:N;ha=O;break b}if(oa){Ta=Nc[c[(c[ma>>2]|0)+36>>2]&127](ma)|0}else{Ta=c[ia>>2]|0}if((Ta|0)!=(c[((a[x]&1)==0?g:c[f>>2]|0)>>2]|0)){Z=116;break a}ia=c[b>>2]|0;ma=ia+12|0;oa=c[ma>>2]|0;if((oa|0)==(c[ia+16>>2]|0)){Nc[c[(c[ia>>2]|0)+40>>2]&127](ia)|0}else{c[ma>>2]=oa+4}a[k]=1;oa=a[x]|0;if((oa&1)==0){Ua=(oa&255)>>>1}else{Ua=c[g>>2]|0}ca=q;da=M;ea=L;fa=K;ga=Ua>>>0>1?x:N;ha=O;break b}}if(P){Va=($&255)>>>1}else{Va=c[B>>2]|0}P=c[b>>2]|0;oa=c[P+12>>2]|0;ma=(oa|0)==(c[P+16>>2]|0);if((Va|0)==0){if(ma){ia=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0;Wa=ia;Xa=a[x]|0}else{Wa=c[oa>>2]|0;Xa=Q}if((Wa|0)!=(c[((Xa&1)==0?g:c[f>>2]|0)>>2]|0)){ca=q;da=M;ea=L;fa=K;ga=N;ha=O;break b}Q=c[b>>2]|0;ia=Q+12|0;na=c[ia>>2]|0;if((na|0)==(c[Q+16>>2]|0)){Nc[c[(c[Q>>2]|0)+40>>2]&127](Q)|0}else{c[ia>>2]=na+4}a[k]=1;na=a[x]|0;if((na&1)==0){Ya=(na&255)>>>1}else{Ya=c[g>>2]|0}ca=q;da=M;ea=L;fa=K;ga=Ya>>>0>1?x:N;ha=O;break b}if(ma){ma=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0;Za=ma;_a=a[w]|0}else{Za=c[oa>>2]|0;_a=$}if((Za|0)!=(c[((_a&1)==0?B:c[C>>2]|0)>>2]|0)){a[k]=1;ca=q;da=M;ea=L;fa=K;ga=N;ha=O;break b}$=c[b>>2]|0;oa=$+12|0;ma=c[oa>>2]|0;if((ma|0)==(c[$+16>>2]|0)){Nc[c[(c[$>>2]|0)+40>>2]&127]($)|0}else{c[oa>>2]=ma+4}ma=a[w]|0;if((ma&1)==0){$a=(ma&255)>>>1}else{$a=c[B>>2]|0}ca=q;da=M;ea=L;fa=K;ga=$a>>>0>1?w:N;ha=O}break};case 4:{ma=q;oa=L;$=K;P=M;na=0;ia=O;f:while(1){Q=c[b>>2]|0;do{if((Q|0)!=0){ua=c[Q+12>>2]|0;if((ua|0)==(c[Q+16>>2]|0)){ab=Nc[c[(c[Q>>2]|0)+36>>2]&127](Q)|0}else{ab=c[ua>>2]|0}if((ab|0)==-1){c[b>>2]=0;bb=1;break}else{bb=(c[b>>2]|0)==0;break}}else{bb=1}}while(0);Q=c[e>>2]|0;do{if((Q|0)!=0){ua=c[Q+12>>2]|0;if((ua|0)==(c[Q+16>>2]|0)){cb=Nc[c[(c[Q>>2]|0)+36>>2]&127](Q)|0}else{cb=c[ua>>2]|0}if(!((cb|0)==-1)){if(bb){break}else{break f}}else{c[e>>2]=0;Z=188;break}}else{Z=188}}while(0);if((Z|0)==188?(Z=0,bb):0){break}Q=c[b>>2]|0;ua=c[Q+12>>2]|0;if((ua|0)==(c[Q+16>>2]|0)){db=Nc[c[(c[Q>>2]|0)+36>>2]&127](Q)|0}else{db=c[ua>>2]|0}if(Gc[c[(c[l>>2]|0)+12>>2]&31](l,2048,db)|0){ua=c[n>>2]|0;if((ua|0)==(ma|0)){Q=(c[I>>2]|0)!=138;ta=c[m>>2]|0;eb=ma-ta|0;fb=eb>>>0<2147483647?eb<<1:-1;gb=eb>>2;if(Q){hb=ta}else{hb=0}ta=Xo(hb,fb)|0;if((ta|0)==0){Z=198;break a}if(!Q){Q=c[m>>2]|0;c[m>>2]=ta;if((Q|0)==0){ib=ta}else{Jc[c[I>>2]&255](Q);ib=c[m>>2]|0}}else{c[m>>2]=ta;ib=ta}c[I>>2]=139;ta=ib+(gb<<2)|0;c[n>>2]=ta;jb=ta;kb=(c[m>>2]|0)+(fb>>>2<<2)|0}else{jb=ua;kb=ma}c[n>>2]=jb+4;c[jb>>2]=db;lb=kb;mb=P;nb=oa;ob=$;pb=na+1|0;qb=ia}else{ua=a[u]|0;if((ua&1)==0){rb=(ua&255)>>>1}else{rb=c[J>>2]|0}if((rb|0)==0|(na|0)==0){break}if((db|0)!=(c[t>>2]|0)){break}if((oa|0)==($|0)){ua=oa-P|0;fb=ua>>>0<2147483647?ua<<1:-1;if((ia|0)!=138){sb=P}else{sb=0}ta=Xo(sb,fb)|0;if((ta|0)==0){Z=214;break a}tb=ta+(ua>>2<<2)|0;ub=ta;vb=ta+(fb>>>2<<2)|0;wb=139}else{tb=oa;ub=P;vb=$;wb=ia}c[tb>>2]=na;lb=ma;mb=ub;nb=tb+4|0;ob=vb;pb=0;qb=wb}fb=c[b>>2]|0;ta=fb+12|0;ua=c[ta>>2]|0;if((ua|0)==(c[fb+16>>2]|0)){Nc[c[(c[fb>>2]|0)+40>>2]&127](fb)|0;ma=lb;oa=nb;$=ob;P=mb;na=pb;ia=qb;continue}else{c[ta>>2]=ua+4;ma=lb;oa=nb;$=ob;P=mb;na=pb;ia=qb;continue}}if((P|0)==(oa|0)|(na|0)==0){xb=P;yb=oa;zb=$;Ab=ia}else{if((oa|0)==($|0)){ua=oa-P|0;ta=ua>>>0<2147483647?ua<<1:-1;if((ia|0)!=138){Bb=P}else{Bb=0}fb=Xo(Bb,ta)|0;if((fb|0)==0){Z=225;break a}Cb=fb+(ua>>2<<2)|0;Db=fb;Eb=fb+(ta>>>2<<2)|0;Fb=139}else{Cb=oa;Db=P;Eb=$;Fb=ia}c[Cb>>2]=na;xb=Db;yb=Cb+4|0;zb=Eb;Ab=Fb}ta=c[z>>2]|0;if((ta|0)>0){fb=c[b>>2]|0;do{if((fb|0)!=0){ua=c[fb+12>>2]|0;if((ua|0)==(c[fb+16>>2]|0)){Gb=Nc[c[(c[fb>>2]|0)+36>>2]&127](fb)|0}else{Gb=c[ua>>2]|0}if((Gb|0)==-1){c[b>>2]=0;Hb=1;break}else{Hb=(c[b>>2]|0)==0;break}}else{Hb=1}}while(0);fb=c[e>>2]|0;do{if((fb|0)!=0){na=c[fb+12>>2]|0;if((na|0)==(c[fb+16>>2]|0)){Ib=Nc[c[(c[fb>>2]|0)+36>>2]&127](fb)|0}else{Ib=c[na>>2]|0}if(!((Ib|0)==-1)){if(Hb){Jb=fb;break}else{Z=248;break a}}else{c[e>>2]=0;Z=242;break}}else{Z=242}}while(0);if((Z|0)==242){Z=0;if(Hb){Z=248;break a}else{Jb=0}}fb=c[b>>2]|0;na=c[fb+12>>2]|0;if((na|0)==(c[fb+16>>2]|0)){Kb=Nc[c[(c[fb>>2]|0)+36>>2]&127](fb)|0}else{Kb=c[na>>2]|0}if((Kb|0)!=(c[s>>2]|0)){Z=248;break a}na=c[b>>2]|0;fb=na+12|0;ia=c[fb>>2]|0;if((ia|0)==(c[na+16>>2]|0)){Nc[c[(c[na>>2]|0)+40>>2]&127](na)|0;Lb=Jb;Mb=Jb;Nb=ma;Ob=ta}else{c[fb>>2]=ia+4;Lb=Jb;Mb=Jb;Nb=ma;Ob=ta}while(1){ia=c[b>>2]|0;do{if((ia|0)!=0){fb=c[ia+12>>2]|0;if((fb|0)==(c[ia+16>>2]|0)){Pb=Nc[c[(c[ia>>2]|0)+36>>2]&127](ia)|0}else{Pb=c[fb>>2]|0}if((Pb|0)==-1){c[b>>2]=0;Qb=1;break}else{Qb=(c[b>>2]|0)==0;break}}else{Qb=1}}while(0);do{if((Mb|0)!=0){ia=c[Mb+12>>2]|0;if((ia|0)==(c[Mb+16>>2]|0)){Rb=Nc[c[(c[Mb>>2]|0)+36>>2]&127](Mb)|0}else{Rb=c[ia>>2]|0}if(!((Rb|0)==-1)){if(Qb^(Lb|0)==0){Sb=Lb;Tb=Lb;break}else{Z=271;break a}}else{c[e>>2]=0;Ub=0;Z=265;break}}else{Ub=Lb;Z=265}}while(0);if((Z|0)==265){Z=0;if(Qb){Z=271;break a}else{Sb=Ub;Tb=0}}ia=c[b>>2]|0;fb=c[ia+12>>2]|0;if((fb|0)==(c[ia+16>>2]|0)){Vb=Nc[c[(c[ia>>2]|0)+36>>2]&127](ia)|0}else{Vb=c[fb>>2]|0}if(!(Gc[c[(c[l>>2]|0)+12>>2]&31](l,2048,Vb)|0)){Z=271;break a}fb=c[n>>2]|0;if((fb|0)==(Nb|0)){ia=(c[I>>2]|0)!=138;na=c[m>>2]|0;$=Nb-na|0;P=$>>>0<2147483647?$<<1:-1;oa=$>>2;if(ia){Wb=na}else{Wb=0}na=Xo(Wb,P)|0;if((na|0)==0){Z=276;break a}if(!ia){ia=c[m>>2]|0;c[m>>2]=na;if((ia|0)==0){Xb=na}else{Jc[c[I>>2]&255](ia);Xb=c[m>>2]|0}}else{c[m>>2]=na;Xb=na}c[I>>2]=139;na=Xb+(oa<<2)|0;c[n>>2]=na;Yb=na;Zb=(c[m>>2]|0)+(P>>>2<<2)|0}else{Yb=fb;Zb=Nb}fb=c[b>>2]|0;P=c[fb+12>>2]|0;if((P|0)==(c[fb+16>>2]|0)){na=Nc[c[(c[fb>>2]|0)+36>>2]&127](fb)|0;_b=na;$b=c[n>>2]|0}else{_b=c[P>>2]|0;$b=Yb}c[n>>2]=$b+4;c[$b>>2]=_b;P=Ob+ -1|0;c[z>>2]=P;na=c[b>>2]|0;fb=na+12|0;oa=c[fb>>2]|0;if((oa|0)==(c[na+16>>2]|0)){Nc[c[(c[na>>2]|0)+40>>2]&127](na)|0}else{c[fb>>2]=oa+4}if((P|0)>0){Lb=Sb;Mb=Tb;Nb=Zb;Ob=P}else{ac=Zb;break}}}else{ac=ma}if((c[n>>2]|0)==(c[m>>2]|0)){Z=290;break a}else{ca=ac;da=xb;ea=yb;fa=zb;ga=N;ha=Ab}break};case 0:{Z=28;break};default:{ca=q;da=M;ea=L;fa=K;ga=N;ha=O}}}while(0);g:do{if((Z|0)==28){Z=0;if((o|0)==3){V=M;W=L;X=N;Y=O;Z=292;break a}else{bc=U;cc=U}while(1){ta=c[b>>2]|0;do{if((ta|0)!=0){P=c[ta+12>>2]|0;if((P|0)==(c[ta+16>>2]|0)){dc=Nc[c[(c[ta>>2]|0)+36>>2]&127](ta)|0}else{dc=c[P>>2]|0}if((dc|0)==-1){c[b>>2]=0;ec=1;break}else{ec=(c[b>>2]|0)==0;break}}else{ec=1}}while(0);do{if((cc|0)!=0){ta=c[cc+12>>2]|0;if((ta|0)==(c[cc+16>>2]|0)){fc=Nc[c[(c[cc>>2]|0)+36>>2]&127](cc)|0}else{fc=c[ta>>2]|0}if(!((fc|0)==-1)){if(ec^(bc|0)==0){gc=bc;hc=bc;break}else{ca=q;da=M;ea=L;fa=K;ga=N;ha=O;break g}}else{c[e>>2]=0;ic=0;Z=42;break}}else{ic=bc;Z=42}}while(0);if((Z|0)==42){Z=0;if(ec){ca=q;da=M;ea=L;fa=K;ga=N;ha=O;break g}else{gc=ic;hc=0}}ta=c[b>>2]|0;P=c[ta+12>>2]|0;if((P|0)==(c[ta+16>>2]|0)){jc=Nc[c[(c[ta>>2]|0)+36>>2]&127](ta)|0}else{jc=c[P>>2]|0}if(!(Gc[c[(c[l>>2]|0)+12>>2]&31](l,8192,jc)|0)){ca=q;da=M;ea=L;fa=K;ga=N;ha=O;break g}P=c[b>>2]|0;ta=P+12|0;oa=c[ta>>2]|0;if((oa|0)==(c[P+16>>2]|0)){kc=Nc[c[(c[P>>2]|0)+40>>2]&127](P)|0}else{c[ta>>2]=oa+4;kc=c[oa>>2]|0}Xg(y,kc);bc=gc;cc=hc}}}while(0);ma=o+1|0;if(ma>>>0<4){K=fa;L=ea;M=da;q=ca;o=ma;N=ga;O=ha}else{V=da;W=ea;X=ga;Y=ha;Z=292;break}}h:do{if((Z|0)==27){c[j>>2]=c[j>>2]|4;lc=0;mc=M;nc=O}else if((Z|0)==116){c[j>>2]=c[j>>2]|4;lc=0;mc=M;nc=O}else if((Z|0)==174){c[j>>2]=c[j>>2]|4;lc=0;mc=M;nc=O}else if((Z|0)==198){fp()}else if((Z|0)==214){fp()}else if((Z|0)==225){fp()}else if((Z|0)==248){c[j>>2]=c[j>>2]|4;lc=0;mc=xb;nc=Ab}else if((Z|0)==271){c[j>>2]=c[j>>2]|4;lc=0;mc=xb;nc=Ab}else if((Z|0)==276){fp()}else if((Z|0)==290){c[j>>2]=c[j>>2]|4;lc=0;mc=xb;nc=Ab}else if((Z|0)==292){i:do{if((X|0)!=0){ha=X+4|0;ga=X+8|0;ea=1;j:while(1){da=a[X]|0;if((da&1)==0){oc=(da&255)>>>1}else{oc=c[ha>>2]|0}if(!(ea>>>0<oc>>>0)){break i}da=c[b>>2]|0;do{if((da|0)!=0){N=c[da+12>>2]|0;if((N|0)==(c[da+16>>2]|0)){pc=Nc[c[(c[da>>2]|0)+36>>2]&127](da)|0}else{pc=c[N>>2]|0}if((pc|0)==-1){c[b>>2]=0;qc=1;break}else{qc=(c[b>>2]|0)==0;break}}else{qc=1}}while(0);da=c[e>>2]|0;do{if((da|0)!=0){N=c[da+12>>2]|0;if((N|0)==(c[da+16>>2]|0)){rc=Nc[c[(c[da>>2]|0)+36>>2]&127](da)|0}else{rc=c[N>>2]|0}if(!((rc|0)==-1)){if(qc){break}else{break j}}else{c[e>>2]=0;Z=311;break}}else{Z=311}}while(0);if((Z|0)==311?(Z=0,qc):0){break}da=c[b>>2]|0;N=c[da+12>>2]|0;if((N|0)==(c[da+16>>2]|0)){sc=Nc[c[(c[da>>2]|0)+36>>2]&127](da)|0}else{sc=c[N>>2]|0}if((a[X]&1)==0){tc=ha}else{tc=c[ga>>2]|0}if((sc|0)!=(c[tc+(ea<<2)>>2]|0)){break}N=ea+1|0;da=c[b>>2]|0;o=da+12|0;ca=c[o>>2]|0;if((ca|0)==(c[da+16>>2]|0)){Nc[c[(c[da>>2]|0)+40>>2]&127](da)|0;ea=N;continue}else{c[o>>2]=ca+4;ea=N;continue}}c[j>>2]=c[j>>2]|4;lc=0;mc=V;nc=Y;break h}}while(0);if((V|0)!=(W|0)){c[A>>2]=0;vl(u,V,W,A);if((c[A>>2]|0)==0){lc=1;mc=V;nc=Y}else{c[j>>2]=c[j>>2]|4;lc=0;mc=V;nc=Y}}else{lc=1;mc=W;nc=Y}}}while(0);Tg(y);Tg(x);Tg(w);Tg(v);Ig(u);if((mc|0)==0){i=p;return lc|0}Jc[nc&255](mc);i=p;return lc|0}function Al(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+448|0;l=d;m=d+32|0;n=d+24|0;o=d+20|0;p=d+16|0;q=d+432|0;r=d+12|0;c[n>>2]=m;s=n+4|0;c[s>>2]=138;t=m+400|0;ah(p,h);m=c[p>>2]|0;if(!((c[4916]|0)==-1)){c[l>>2]=19664;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19664,l,137)}u=(c[19668>>2]|0)+ -1|0;v=c[m+8>>2]|0;if(!((c[m+12>>2]|0)-v>>2>>>0>u>>>0)){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}m=c[v+(u<<2)>>2]|0;if((m|0)==0){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}a[q]=0;w=c[f>>2]|0;c[r>>2]=w;u=c[h+4>>2]|0;c[l+0>>2]=c[r+0>>2];if(zl(e,l,g,p,u,j,q,m,n,o,t)|0){if((a[k]&1)==0){c[k+4>>2]=0;a[k]=0}else{c[c[k+8>>2]>>2]=0;c[k+4>>2]=0}if((a[q]|0)!=0){Xg(k,Wc[c[(c[m>>2]|0)+44>>2]&15](m,45)|0)}q=Wc[c[(c[m>>2]|0)+44>>2]&15](m,48)|0;m=c[n>>2]|0;t=c[o>>2]|0;o=t+ -4|0;a:do{if(m>>>0<o>>>0){u=m;while(1){g=u+4|0;if((c[u>>2]|0)!=(q|0)){x=u;break a}if(g>>>0<o>>>0){u=g}else{x=g;break}}}else{x=m}}while(0);Bl(k,x,t)|0}t=c[e>>2]|0;do{if((t|0)!=0){x=c[t+12>>2]|0;if((x|0)==(c[t+16>>2]|0)){y=Nc[c[(c[t>>2]|0)+36>>2]&127](t)|0}else{y=c[x>>2]|0}if((y|0)==-1){c[e>>2]=0;z=1;break}else{z=(c[e>>2]|0)==0;break}}else{z=1}}while(0);do{if((w|0)!=0){y=c[w+12>>2]|0;if((y|0)==(c[w+16>>2]|0)){A=Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0}else{A=c[y>>2]|0}if(!((A|0)==-1)){if(z){break}else{B=31;break}}else{c[f>>2]=0;B=29;break}}else{B=29}}while(0);if((B|0)==29?z:0){B=31}if((B|0)==31){c[j>>2]=c[j>>2]|2}c[b>>2]=c[e>>2];jg(c[p>>2]|0)|0;p=c[n>>2]|0;c[n>>2]=0;if((p|0)==0){i=d;return}Jc[c[s>>2]&255](p);i=d;return}function Bl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;g=d;h=a[b]|0;if((h&1)==0){j=(h&255)>>>1;k=1;l=h}else{h=c[b>>2]|0;j=c[b+4>>2]|0;k=(h&-2)+ -1|0;l=h&255}h=e-g>>2;if((h|0)==0){i=f;return b|0}if((k-j|0)>>>0<h>>>0){Zg(b,k,j+h-k|0,j,j,0,0);m=a[b]|0}else{m=l}if((m&1)==0){n=b+4|0}else{n=c[b+8>>2]|0}m=n+(j<<2)|0;if((d|0)==(e|0)){o=m}else{l=j+((e+ -4+(0-g)|0)>>>2)+1|0;g=d;d=m;while(1){c[d>>2]=c[g>>2];g=g+4|0;if((g|0)==(e|0)){break}else{d=d+4|0}}o=n+(l<<2)|0}c[o>>2]=0;o=j+h|0;if((a[b]&1)==0){a[b]=o<<1;i=f;return b|0}else{c[b+4>>2]=o;i=f;return b|0}return 0}function Cl(b,d,e,f,g,h,j,k,l,m){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;n=i;i=i+128|0;o=n;p=n+112|0;q=n+100|0;r=n+88|0;s=n+76|0;t=n+64|0;u=n+60|0;v=n+48|0;w=n+36|0;x=n+24|0;y=n+12|0;if(b){b=c[d>>2]|0;if(!((c[4810]|0)==-1)){c[o>>2]=19240;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19240,o,137)}z=(c[19244>>2]|0)+ -1|0;A=c[b+8>>2]|0;if(!((c[b+12>>2]|0)-A>>2>>>0>z>>>0)){B=Fb(4)|0;Ao(B);zc(B|0,27632,123)}b=c[A+(z<<2)>>2]|0;if((b|0)==0){B=Fb(4)|0;Ao(B);zc(B|0,27632,123)}Lc[c[(c[b>>2]|0)+44>>2]&63](p,b);B=c[p>>2]|0;a[e]=B;a[e+1|0]=B>>8;a[e+2|0]=B>>16;a[e+3|0]=B>>24;Lc[c[(c[b>>2]|0)+32>>2]&63](q,b);if((a[l]&1)==0){c[l+4>>2]=0;a[l]=0}else{c[c[l+8>>2]>>2]=0;c[l+4>>2]=0}Wg(l,0);c[l+0>>2]=c[q+0>>2];c[l+4>>2]=c[q+4>>2];c[l+8>>2]=c[q+8>>2];c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Tg(q);Lc[c[(c[b>>2]|0)+28>>2]&63](r,b);if((a[k]&1)==0){c[k+4>>2]=0;a[k]=0}else{c[c[k+8>>2]>>2]=0;c[k+4>>2]=0}Wg(k,0);c[k+0>>2]=c[r+0>>2];c[k+4>>2]=c[r+4>>2];c[k+8>>2]=c[r+8>>2];c[r+0>>2]=0;c[r+4>>2]=0;c[r+8>>2]=0;Tg(r);r=Nc[c[(c[b>>2]|0)+12>>2]&127](b)|0;c[f>>2]=r;r=Nc[c[(c[b>>2]|0)+16>>2]&127](b)|0;c[g>>2]=r;Lc[c[(c[b>>2]|0)+20>>2]&63](s,b);if((a[h]&1)==0){a[h+1|0]=0;a[h]=0}else{a[c[h+8>>2]|0]=0;c[h+4>>2]=0}Mg(h,0);c[h+0>>2]=c[s+0>>2];c[h+4>>2]=c[s+4>>2];c[h+8>>2]=c[s+8>>2];c[s+0>>2]=0;c[s+4>>2]=0;c[s+8>>2]=0;Ig(s);Lc[c[(c[b>>2]|0)+24>>2]&63](t,b);if((a[j]&1)==0){c[j+4>>2]=0;a[j]=0}else{c[c[j+8>>2]>>2]=0;c[j+4>>2]=0}Wg(j,0);c[j+0>>2]=c[t+0>>2];c[j+4>>2]=c[t+4>>2];c[j+8>>2]=c[t+8>>2];c[t+0>>2]=0;c[t+4>>2]=0;c[t+8>>2]=0;Tg(t);C=Nc[c[(c[b>>2]|0)+36>>2]&127](b)|0;c[m>>2]=C;i=n;return}else{b=c[d>>2]|0;if(!((c[4794]|0)==-1)){c[o>>2]=19176;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19176,o,137)}o=(c[19180>>2]|0)+ -1|0;d=c[b+8>>2]|0;if(!((c[b+12>>2]|0)-d>>2>>>0>o>>>0)){D=Fb(4)|0;Ao(D);zc(D|0,27632,123)}b=c[d+(o<<2)>>2]|0;if((b|0)==0){D=Fb(4)|0;Ao(D);zc(D|0,27632,123)}Lc[c[(c[b>>2]|0)+44>>2]&63](u,b);D=c[u>>2]|0;a[e]=D;a[e+1|0]=D>>8;a[e+2|0]=D>>16;a[e+3|0]=D>>24;Lc[c[(c[b>>2]|0)+32>>2]&63](v,b);if((a[l]&1)==0){c[l+4>>2]=0;a[l]=0}else{c[c[l+8>>2]>>2]=0;c[l+4>>2]=0}Wg(l,0);c[l+0>>2]=c[v+0>>2];c[l+4>>2]=c[v+4>>2];c[l+8>>2]=c[v+8>>2];c[v+0>>2]=0;c[v+4>>2]=0;c[v+8>>2]=0;Tg(v);Lc[c[(c[b>>2]|0)+28>>2]&63](w,b);if((a[k]&1)==0){c[k+4>>2]=0;a[k]=0}else{c[c[k+8>>2]>>2]=0;c[k+4>>2]=0}Wg(k,0);c[k+0>>2]=c[w+0>>2];c[k+4>>2]=c[w+4>>2];c[k+8>>2]=c[w+8>>2];c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;Tg(w);w=Nc[c[(c[b>>2]|0)+12>>2]&127](b)|0;c[f>>2]=w;w=Nc[c[(c[b>>2]|0)+16>>2]&127](b)|0;c[g>>2]=w;Lc[c[(c[b>>2]|0)+20>>2]&63](x,b);if((a[h]&1)==0){a[h+1|0]=0;a[h]=0}else{a[c[h+8>>2]|0]=0;c[h+4>>2]=0}Mg(h,0);c[h+0>>2]=c[x+0>>2];c[h+4>>2]=c[x+4>>2];c[h+8>>2]=c[x+8>>2];c[x+0>>2]=0;c[x+4>>2]=0;c[x+8>>2]=0;Ig(x);Lc[c[(c[b>>2]|0)+24>>2]&63](y,b);if((a[j]&1)==0){c[j+4>>2]=0;a[j]=0}else{c[c[j+8>>2]>>2]=0;c[j+4>>2]=0}Wg(j,0);c[j+0>>2]=c[y+0>>2];c[j+4>>2]=c[y+4>>2];c[j+8>>2]=c[y+8>>2];c[y+0>>2]=0;c[y+4>>2]=0;c[y+8>>2]=0;Tg(y);C=Nc[c[(c[b>>2]|0)+36>>2]&127](b)|0;c[m>>2]=C;i=n;return}}function Dl(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function El(a){a=a|0;return}function Fl(b,d,e,f,g,j,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;l=+l;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0;d=i;i=i+384|0;m=d;n=d+280|0;o=d+72|0;p=d+180|0;q=d+68|0;r=d+64|0;s=d+177|0;t=d+176|0;u=d+52|0;v=d+40|0;w=d+28|0;x=d+24|0;y=d+76|0;z=d+20|0;A=d+16|0;B=d+12|0;c[o>>2]=n;h[k>>3]=l;c[m>>2]=c[k>>2];c[m+4>>2]=c[k+4>>2];C=Lb(n|0,100,19424,m|0)|0;if(C>>>0>99){if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){n=kb(2147483647,19576,0)|0;c[4890]=n;gb(19568)}n=c[4890]|0;h[k>>3]=l;c[m>>2]=c[k>>2];c[m+4>>2]=c[k+4>>2];D=Aj(o,n,19424,m)|0;n=c[o>>2]|0;if((n|0)==0){fp()}E=Vo(D)|0;if((E|0)==0){fp()}else{F=E;G=n;H=E;I=D}}else{F=0;G=0;H=p;I=C}ah(q,g);C=c[q>>2]|0;if(!((c[4918]|0)==-1)){c[m>>2]=19672;c[m+4>>2]=136;c[m+8>>2]=0;Dg(19672,m,137)}p=(c[19676>>2]|0)+ -1|0;D=c[C+8>>2]|0;if(!((c[C+12>>2]|0)-D>>2>>>0>p>>>0)){J=Fb(4)|0;Ao(J);zc(J|0,27632,123)}C=c[D+(p<<2)>>2]|0;if((C|0)==0){J=Fb(4)|0;Ao(J);zc(J|0,27632,123)}J=c[o>>2]|0;Tc[c[(c[C>>2]|0)+32>>2]&7](C,J,J+I|0,H)|0;if((I|0)==0){K=0}else{K=(a[c[o>>2]|0]|0)==45}c[r>>2]=0;c[u+0>>2]=0;c[u+4>>2]=0;c[u+8>>2]=0;c[v+0>>2]=0;c[v+4>>2]=0;c[v+8>>2]=0;c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;Gl(f,K,q,r,s,t,u,v,w,x);f=c[x>>2]|0;if((I|0)>(f|0)){x=a[w]|0;if((x&1)==0){L=(x&255)>>>1}else{L=c[w+4>>2]|0}x=a[v]|0;if((x&1)==0){M=(x&255)>>>1}else{M=c[v+4>>2]|0}N=L+(I-f<<1|1)+M|0}else{M=a[w]|0;if((M&1)==0){O=(M&255)>>>1}else{O=c[w+4>>2]|0}M=a[v]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[v+4>>2]|0}N=O+2+P|0}P=N+f|0;if(P>>>0>100){N=Vo(P)|0;if((N|0)==0){fp()}else{Q=N;R=N}}else{Q=0;R=y}Hl(R,z,A,c[g+4>>2]|0,H,H+I|0,C,K,r,a[s]|0,a[t]|0,u,v,w,f);c[B>>2]=c[e>>2];e=c[z>>2]|0;z=c[A>>2]|0;c[m+0>>2]=c[B+0>>2];vj(b,m,R,e,z,g,j);if((Q|0)!=0){Wo(Q)}Ig(w);Ig(v);Ig(u);jg(c[q>>2]|0)|0;if((F|0)!=0){Wo(F)}if((G|0)==0){i=d;return}Wo(G);i=d;return}function Gl(b,d,e,f,g,h,j,k,l,m){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;n=i;i=i+128|0;o=n;p=n+120|0;q=n+108|0;r=n+104|0;s=n+92|0;t=n+80|0;u=n+68|0;v=n+64|0;w=n+52|0;x=n+48|0;y=n+36|0;z=n+24|0;A=n+12|0;B=c[e>>2]|0;if(b){if(!((c[4778]|0)==-1)){c[o>>2]=19112;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19112,o,137)}b=(c[19116>>2]|0)+ -1|0;e=c[B+8>>2]|0;if(!((c[B+12>>2]|0)-e>>2>>>0>b>>>0)){C=Fb(4)|0;Ao(C);zc(C|0,27632,123)}D=c[e+(b<<2)>>2]|0;if((D|0)==0){C=Fb(4)|0;Ao(C);zc(C|0,27632,123)}C=c[D>>2]|0;if(d){Lc[c[C+44>>2]&63](p,D);b=c[p>>2]|0;a[f]=b;a[f+1|0]=b>>8;a[f+2|0]=b>>16;a[f+3|0]=b>>24;Lc[c[(c[D>>2]|0)+32>>2]&63](q,D);if((a[l]&1)==0){a[l+1|0]=0;a[l]=0}else{a[c[l+8>>2]|0]=0;c[l+4>>2]=0}Mg(l,0);c[l+0>>2]=c[q+0>>2];c[l+4>>2]=c[q+4>>2];c[l+8>>2]=c[q+8>>2];c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Ig(q)}else{Lc[c[C+40>>2]&63](r,D);C=c[r>>2]|0;a[f]=C;a[f+1|0]=C>>8;a[f+2|0]=C>>16;a[f+3|0]=C>>24;Lc[c[(c[D>>2]|0)+28>>2]&63](s,D);if((a[l]&1)==0){a[l+1|0]=0;a[l]=0}else{a[c[l+8>>2]|0]=0;c[l+4>>2]=0}Mg(l,0);c[l+0>>2]=c[s+0>>2];c[l+4>>2]=c[s+4>>2];c[l+8>>2]=c[s+8>>2];c[s+0>>2]=0;c[s+4>>2]=0;c[s+8>>2]=0;Ig(s)}s=Nc[c[(c[D>>2]|0)+12>>2]&127](D)|0;a[g]=s;s=Nc[c[(c[D>>2]|0)+16>>2]&127](D)|0;a[h]=s;Lc[c[(c[D>>2]|0)+20>>2]&63](t,D);if((a[j]&1)==0){a[j+1|0]=0;a[j]=0}else{a[c[j+8>>2]|0]=0;c[j+4>>2]=0}Mg(j,0);c[j+0>>2]=c[t+0>>2];c[j+4>>2]=c[t+4>>2];c[j+8>>2]=c[t+8>>2];c[t+0>>2]=0;c[t+4>>2]=0;c[t+8>>2]=0;Ig(t);Lc[c[(c[D>>2]|0)+24>>2]&63](u,D);if((a[k]&1)==0){a[k+1|0]=0;a[k]=0}else{a[c[k+8>>2]|0]=0;c[k+4>>2]=0}Mg(k,0);c[k+0>>2]=c[u+0>>2];c[k+4>>2]=c[u+4>>2];c[k+8>>2]=c[u+8>>2];c[u+0>>2]=0;c[u+4>>2]=0;c[u+8>>2]=0;Ig(u);E=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0;c[m>>2]=E;i=n;return}else{if(!((c[4762]|0)==-1)){c[o>>2]=19048;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19048,o,137)}o=(c[19052>>2]|0)+ -1|0;D=c[B+8>>2]|0;if(!((c[B+12>>2]|0)-D>>2>>>0>o>>>0)){F=Fb(4)|0;Ao(F);zc(F|0,27632,123)}B=c[D+(o<<2)>>2]|0;if((B|0)==0){F=Fb(4)|0;Ao(F);zc(F|0,27632,123)}F=c[B>>2]|0;if(d){Lc[c[F+44>>2]&63](v,B);d=c[v>>2]|0;a[f]=d;a[f+1|0]=d>>8;a[f+2|0]=d>>16;a[f+3|0]=d>>24;Lc[c[(c[B>>2]|0)+32>>2]&63](w,B);if((a[l]&1)==0){a[l+1|0]=0;a[l]=0}else{a[c[l+8>>2]|0]=0;c[l+4>>2]=0}Mg(l,0);c[l+0>>2]=c[w+0>>2];c[l+4>>2]=c[w+4>>2];c[l+8>>2]=c[w+8>>2];c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;Ig(w)}else{Lc[c[F+40>>2]&63](x,B);F=c[x>>2]|0;a[f]=F;a[f+1|0]=F>>8;a[f+2|0]=F>>16;a[f+3|0]=F>>24;Lc[c[(c[B>>2]|0)+28>>2]&63](y,B);if((a[l]&1)==0){a[l+1|0]=0;a[l]=0}else{a[c[l+8>>2]|0]=0;c[l+4>>2]=0}Mg(l,0);c[l+0>>2]=c[y+0>>2];c[l+4>>2]=c[y+4>>2];c[l+8>>2]=c[y+8>>2];c[y+0>>2]=0;c[y+4>>2]=0;c[y+8>>2]=0;Ig(y)}y=Nc[c[(c[B>>2]|0)+12>>2]&127](B)|0;a[g]=y;y=Nc[c[(c[B>>2]|0)+16>>2]&127](B)|0;a[h]=y;Lc[c[(c[B>>2]|0)+20>>2]&63](z,B);if((a[j]&1)==0){a[j+1|0]=0;a[j]=0}else{a[c[j+8>>2]|0]=0;c[j+4>>2]=0}Mg(j,0);c[j+0>>2]=c[z+0>>2];c[j+4>>2]=c[z+4>>2];c[j+8>>2]=c[z+8>>2];c[z+0>>2]=0;c[z+4>>2]=0;c[z+8>>2]=0;Ig(z);Lc[c[(c[B>>2]|0)+24>>2]&63](A,B);if((a[k]&1)==0){a[k+1|0]=0;a[k]=0}else{a[c[k+8>>2]|0]=0;c[k+4>>2]=0}Mg(k,0);c[k+0>>2]=c[A+0>>2];c[k+4>>2]=c[A+4>>2];c[k+8>>2]=c[A+8>>2];c[A+0>>2]=0;c[A+4>>2]=0;c[A+8>>2]=0;Ig(A);E=Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0;c[m>>2]=E;i=n;return}}function Hl(d,e,f,g,h,j,k,l,m,n,o,p,q,r,s){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;p=p|0;q=q|0;r=r|0;s=s|0;var t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0;t=i;c[f>>2]=d;u=r+1|0;v=r+8|0;w=r+4|0;x=(g&512|0)==0;y=q+1|0;z=q+8|0;A=q+4|0;B=(s|0)>0;C=p+1|0;D=p+8|0;E=p+4|0;F=k+8|0;G=0-s|0;H=h;h=0;while(1){switch(a[m+h|0]|0){case 3:{I=a[r]|0;J=(I&1)==0;if(J){K=(I&255)>>>1}else{K=c[w>>2]|0}if((K|0)==0){L=H}else{if(J){M=u}else{M=c[v>>2]|0}J=a[M]|0;I=c[f>>2]|0;c[f>>2]=I+1;a[I]=J;L=H}break};case 2:{J=a[q]|0;I=(J&1)==0;if(I){N=(J&255)>>>1}else{N=c[A>>2]|0}if((N|0)==0|x){L=H}else{if(I){O=y;P=(J&255)>>>1}else{O=c[z>>2]|0;P=c[A>>2]|0}J=O+P|0;I=c[f>>2]|0;if((O|0)==(J|0)){Q=I}else{R=I;I=O;while(1){a[R]=a[I]|0;S=I+1|0;T=R+1|0;if((S|0)==(J|0)){Q=T;break}else{R=T;I=S}}}c[f>>2]=Q;L=H}break};case 4:{I=c[f>>2]|0;R=l?H+1|0:H;a:do{if(R>>>0<j>>>0){J=R;while(1){S=a[J]|0;if(!(S<<24>>24>-1)){U=J;break a}T=J+1|0;if((b[(c[F>>2]|0)+(S<<24>>24<<1)>>1]&2048)==0){U=J;break a}if(T>>>0<j>>>0){J=T}else{U=T;break}}}else{U=R}}while(0);J=U;if(B){if(U>>>0>R>>>0){T=R+(0-J)|0;J=T>>>0<G>>>0?G:T;T=J+s|0;S=I;V=U;W=s;while(1){X=V+ -1|0;Y=a[X]|0;c[f>>2]=S+1;a[S]=Y;Y=W+ -1|0;Z=(Y|0)>0;if(!(X>>>0>R>>>0&Z)){break}S=c[f>>2]|0;V=X;W=Y}W=U+J|0;if(Z){_=W;$=T;aa=32}else{ba=0;ca=W;da=T}}else{_=U;$=s;aa=32}if((aa|0)==32){aa=0;ba=Wc[c[(c[k>>2]|0)+28>>2]&15](k,48)|0;ca=_;da=$}W=c[f>>2]|0;c[f>>2]=W+1;if((da|0)>0){V=W;S=da;while(1){a[V]=ba;Y=S+ -1|0;X=c[f>>2]|0;c[f>>2]=X+1;if((Y|0)>0){V=X;S=Y}else{ea=X;break}}}else{ea=W}a[ea]=n;fa=ca}else{fa=U}if((fa|0)==(R|0)){S=Wc[c[(c[k>>2]|0)+28>>2]&15](k,48)|0;V=c[f>>2]|0;c[f>>2]=V+1;a[V]=S}else{S=a[p]|0;V=(S&1)==0;if(V){ga=(S&255)>>>1}else{ga=c[E>>2]|0}if((ga|0)==0){ha=fa;ia=-1;ja=0;ka=0}else{if(V){la=C}else{la=c[D>>2]|0}ha=fa;ia=a[la]|0;ja=0;ka=0}while(1){if((ka|0)==(ia|0)){V=c[f>>2]|0;c[f>>2]=V+1;a[V]=o;V=ja+1|0;S=a[p]|0;T=(S&1)==0;if(T){ma=(S&255)>>>1}else{ma=c[E>>2]|0}if(V>>>0<ma>>>0){if(T){na=C}else{na=c[D>>2]|0}if((a[na+V|0]|0)==127){oa=-1;pa=V;qa=0}else{if(T){ra=C}else{ra=c[D>>2]|0}oa=a[ra+V|0]|0;pa=V;qa=0}}else{oa=ia;pa=V;qa=0}}else{oa=ia;pa=ja;qa=ka}ha=ha+ -1|0;V=a[ha]|0;T=c[f>>2]|0;c[f>>2]=T+1;a[T]=V;if((ha|0)==(R|0)){break}else{ia=oa;ja=pa;ka=qa+1|0}}}W=c[f>>2]|0;if((I|0)!=(W|0)?(V=W+ -1|0,V>>>0>I>>>0):0){W=I;T=V;while(1){V=a[W]|0;a[W]=a[T]|0;a[T]=V;V=W+1|0;S=T+ -1|0;if(V>>>0<S>>>0){W=V;T=S}else{L=R;break}}}else{L=R}break};case 0:{c[e>>2]=c[f>>2];L=H;break};case 1:{c[e>>2]=c[f>>2];T=Wc[c[(c[k>>2]|0)+28>>2]&15](k,32)|0;W=c[f>>2]|0;c[f>>2]=W+1;a[W]=T;L=H;break};default:{L=H}}h=h+1|0;if((h|0)==4){break}else{H=L}}L=a[r]|0;r=(L&1)==0;if(r){sa=(L&255)>>>1}else{sa=c[w>>2]|0}if(sa>>>0>1){if(r){ta=u;ua=(L&255)>>>1}else{ta=c[v>>2]|0;ua=c[w>>2]|0}w=ta+1|0;v=ta+ua|0;ua=c[f>>2]|0;if((w|0)==(v|0)){va=ua}else{ta=ua;ua=w;while(1){a[ta]=a[ua]|0;w=ua+1|0;L=ta+1|0;if((w|0)==(v|0)){va=L;break}else{ta=L;ua=w}}}c[f>>2]=va}va=g&176;if((va|0)==32){c[e>>2]=c[f>>2];i=t;return}else if((va|0)==16){i=t;return}else{c[e>>2]=d;i=t;return}}function Il(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;d=i;i=i+176|0;k=d;l=d+68|0;m=d+64|0;n=d+173|0;o=d+172|0;p=d+52|0;q=d+40|0;r=d+28|0;s=d+24|0;t=d+72|0;u=d+20|0;v=d+16|0;w=d+12|0;ah(l,g);x=c[l>>2]|0;if(!((c[4918]|0)==-1)){c[k>>2]=19672;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19672,k,137)}y=(c[19676>>2]|0)+ -1|0;z=c[x+8>>2]|0;if(!((c[x+12>>2]|0)-z>>2>>>0>y>>>0)){A=Fb(4)|0;Ao(A);zc(A|0,27632,123)}x=c[z+(y<<2)>>2]|0;if((x|0)==0){A=Fb(4)|0;Ao(A);zc(A|0,27632,123)}A=a[j]|0;y=(A&1)==0;if(y){B=(A&255)>>>1}else{B=c[j+4>>2]|0}if((B|0)==0){C=0}else{if(y){D=j+1|0}else{D=c[j+8>>2]|0}y=a[D]|0;C=y<<24>>24==(Wc[c[(c[x>>2]|0)+28>>2]&15](x,45)|0)<<24>>24}c[m>>2]=0;c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;c[r+0>>2]=0;c[r+4>>2]=0;c[r+8>>2]=0;Gl(f,C,l,m,n,o,p,q,r,s);f=a[j]|0;y=(f&1)==0;if(y){E=(f&255)>>>1}else{E=c[j+4>>2]|0}D=c[s>>2]|0;if((E|0)>(D|0)){if(y){F=(f&255)>>>1}else{F=c[j+4>>2]|0}y=a[r]|0;if((y&1)==0){G=(y&255)>>>1}else{G=c[r+4>>2]|0}y=a[q]|0;if((y&1)==0){H=(y&255)>>>1}else{H=c[q+4>>2]|0}I=G+(F-D<<1|1)+H|0}else{H=a[r]|0;if((H&1)==0){J=(H&255)>>>1}else{J=c[r+4>>2]|0}H=a[q]|0;if((H&1)==0){K=(H&255)>>>1}else{K=c[q+4>>2]|0}I=J+2+K|0}K=I+D|0;if(K>>>0>100){I=Vo(K)|0;if((I|0)==0){fp()}else{L=I;M=I}}else{L=0;M=t}if((f&1)==0){N=j+1|0;O=(f&255)>>>1}else{N=c[j+8>>2]|0;O=c[j+4>>2]|0}Hl(M,u,v,c[g+4>>2]|0,N,N+O|0,x,C,m,a[n]|0,a[o]|0,p,q,r,D);c[w>>2]=c[e>>2];e=c[u>>2]|0;u=c[v>>2]|0;c[k+0>>2]=c[w+0>>2];vj(b,k,M,e,u,g,h);if((L|0)==0){Ig(r);Ig(q);Ig(p);P=c[l>>2]|0;jg(P)|0;i=d;return}Wo(L);Ig(r);Ig(q);Ig(p);P=c[l>>2]|0;jg(P)|0;i=d;return}function Jl(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Kl(a){a=a|0;return}function Ll(b,d,e,f,g,j,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;l=+l;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0;d=i;i=i+992|0;m=d;n=d+884|0;o=d+880|0;p=d+480|0;q=d+476|0;r=d+472|0;s=d+468|0;t=d+464|0;u=d+452|0;v=d+440|0;w=d+428|0;x=d+424|0;y=d+24|0;z=d+20|0;A=d+16|0;B=d+12|0;c[o>>2]=n;h[k>>3]=l;c[m>>2]=c[k>>2];c[m+4>>2]=c[k+4>>2];C=Lb(n|0,100,19424,m|0)|0;if(C>>>0>99){if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){n=kb(2147483647,19576,0)|0;c[4890]=n;gb(19568)}n=c[4890]|0;h[k>>3]=l;c[m>>2]=c[k>>2];c[m+4>>2]=c[k+4>>2];D=Aj(o,n,19424,m)|0;n=c[o>>2]|0;if((n|0)==0){fp()}E=Vo(D<<2)|0;if((E|0)==0){fp()}else{F=E;G=n;H=E;I=D}}else{F=0;G=0;H=p;I=C}ah(q,g);C=c[q>>2]|0;if(!((c[4916]|0)==-1)){c[m>>2]=19664;c[m+4>>2]=136;c[m+8>>2]=0;Dg(19664,m,137)}p=(c[19668>>2]|0)+ -1|0;D=c[C+8>>2]|0;if(!((c[C+12>>2]|0)-D>>2>>>0>p>>>0)){J=Fb(4)|0;Ao(J);zc(J|0,27632,123)}C=c[D+(p<<2)>>2]|0;if((C|0)==0){J=Fb(4)|0;Ao(J);zc(J|0,27632,123)}J=c[o>>2]|0;Tc[c[(c[C>>2]|0)+48>>2]&7](C,J,J+I|0,H)|0;if((I|0)==0){K=0}else{K=(a[c[o>>2]|0]|0)==45}c[r>>2]=0;c[u+0>>2]=0;c[u+4>>2]=0;c[u+8>>2]=0;c[v+0>>2]=0;c[v+4>>2]=0;c[v+8>>2]=0;c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;Ml(f,K,q,r,s,t,u,v,w,x);f=c[x>>2]|0;if((I|0)>(f|0)){x=a[w]|0;if((x&1)==0){L=(x&255)>>>1}else{L=c[w+4>>2]|0}x=a[v]|0;if((x&1)==0){M=(x&255)>>>1}else{M=c[v+4>>2]|0}N=L+(I-f<<1|1)+M|0}else{M=a[w]|0;if((M&1)==0){O=(M&255)>>>1}else{O=c[w+4>>2]|0}M=a[v]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[v+4>>2]|0}N=O+2+P|0}P=N+f|0;if(P>>>0>100){N=Vo(P<<2)|0;if((N|0)==0){fp()}else{Q=N;R=N}}else{Q=0;R=y}Nl(R,z,A,c[g+4>>2]|0,H,H+(I<<2)|0,C,K,r,c[s>>2]|0,c[t>>2]|0,u,v,w,f);c[B>>2]=c[e>>2];e=c[z>>2]|0;z=c[A>>2]|0;c[m+0>>2]=c[B+0>>2];Jj(b,m,R,e,z,g,j);if((Q|0)!=0){Wo(Q)}Tg(w);Tg(v);Ig(u);jg(c[q>>2]|0)|0;if((F|0)!=0){Wo(F)}if((G|0)==0){i=d;return}Wo(G);i=d;return}function Ml(b,d,e,f,g,h,j,k,l,m){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;n=i;i=i+128|0;o=n;p=n+120|0;q=n+108|0;r=n+104|0;s=n+92|0;t=n+80|0;u=n+68|0;v=n+64|0;w=n+52|0;x=n+48|0;y=n+36|0;z=n+24|0;A=n+12|0;B=c[e>>2]|0;if(b){if(!((c[4810]|0)==-1)){c[o>>2]=19240;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19240,o,137)}b=(c[19244>>2]|0)+ -1|0;e=c[B+8>>2]|0;if(!((c[B+12>>2]|0)-e>>2>>>0>b>>>0)){C=Fb(4)|0;Ao(C);zc(C|0,27632,123)}D=c[e+(b<<2)>>2]|0;if((D|0)==0){C=Fb(4)|0;Ao(C);zc(C|0,27632,123)}C=c[D>>2]|0;if(d){Lc[c[C+44>>2]&63](p,D);b=c[p>>2]|0;a[f]=b;a[f+1|0]=b>>8;a[f+2|0]=b>>16;a[f+3|0]=b>>24;Lc[c[(c[D>>2]|0)+32>>2]&63](q,D);if((a[l]&1)==0){c[l+4>>2]=0;a[l]=0}else{c[c[l+8>>2]>>2]=0;c[l+4>>2]=0}Wg(l,0);c[l+0>>2]=c[q+0>>2];c[l+4>>2]=c[q+4>>2];c[l+8>>2]=c[q+8>>2];c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Tg(q)}else{Lc[c[C+40>>2]&63](r,D);C=c[r>>2]|0;a[f]=C;a[f+1|0]=C>>8;a[f+2|0]=C>>16;a[f+3|0]=C>>24;Lc[c[(c[D>>2]|0)+28>>2]&63](s,D);if((a[l]&1)==0){c[l+4>>2]=0;a[l]=0}else{c[c[l+8>>2]>>2]=0;c[l+4>>2]=0}Wg(l,0);c[l+0>>2]=c[s+0>>2];c[l+4>>2]=c[s+4>>2];c[l+8>>2]=c[s+8>>2];c[s+0>>2]=0;c[s+4>>2]=0;c[s+8>>2]=0;Tg(s)}s=Nc[c[(c[D>>2]|0)+12>>2]&127](D)|0;c[g>>2]=s;s=Nc[c[(c[D>>2]|0)+16>>2]&127](D)|0;c[h>>2]=s;Lc[c[(c[D>>2]|0)+20>>2]&63](t,D);if((a[j]&1)==0){a[j+1|0]=0;a[j]=0}else{a[c[j+8>>2]|0]=0;c[j+4>>2]=0}Mg(j,0);c[j+0>>2]=c[t+0>>2];c[j+4>>2]=c[t+4>>2];c[j+8>>2]=c[t+8>>2];c[t+0>>2]=0;c[t+4>>2]=0;c[t+8>>2]=0;Ig(t);Lc[c[(c[D>>2]|0)+24>>2]&63](u,D);if((a[k]&1)==0){c[k+4>>2]=0;a[k]=0}else{c[c[k+8>>2]>>2]=0;c[k+4>>2]=0}Wg(k,0);c[k+0>>2]=c[u+0>>2];c[k+4>>2]=c[u+4>>2];c[k+8>>2]=c[u+8>>2];c[u+0>>2]=0;c[u+4>>2]=0;c[u+8>>2]=0;Tg(u);E=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0;c[m>>2]=E;i=n;return}else{if(!((c[4794]|0)==-1)){c[o>>2]=19176;c[o+4>>2]=136;c[o+8>>2]=0;Dg(19176,o,137)}o=(c[19180>>2]|0)+ -1|0;D=c[B+8>>2]|0;if(!((c[B+12>>2]|0)-D>>2>>>0>o>>>0)){F=Fb(4)|0;Ao(F);zc(F|0,27632,123)}B=c[D+(o<<2)>>2]|0;if((B|0)==0){F=Fb(4)|0;Ao(F);zc(F|0,27632,123)}F=c[B>>2]|0;if(d){Lc[c[F+44>>2]&63](v,B);d=c[v>>2]|0;a[f]=d;a[f+1|0]=d>>8;a[f+2|0]=d>>16;a[f+3|0]=d>>24;Lc[c[(c[B>>2]|0)+32>>2]&63](w,B);if((a[l]&1)==0){c[l+4>>2]=0;a[l]=0}else{c[c[l+8>>2]>>2]=0;c[l+4>>2]=0}Wg(l,0);c[l+0>>2]=c[w+0>>2];c[l+4>>2]=c[w+4>>2];c[l+8>>2]=c[w+8>>2];c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;Tg(w)}else{Lc[c[F+40>>2]&63](x,B);F=c[x>>2]|0;a[f]=F;a[f+1|0]=F>>8;a[f+2|0]=F>>16;a[f+3|0]=F>>24;Lc[c[(c[B>>2]|0)+28>>2]&63](y,B);if((a[l]&1)==0){c[l+4>>2]=0;a[l]=0}else{c[c[l+8>>2]>>2]=0;c[l+4>>2]=0}Wg(l,0);c[l+0>>2]=c[y+0>>2];c[l+4>>2]=c[y+4>>2];c[l+8>>2]=c[y+8>>2];c[y+0>>2]=0;c[y+4>>2]=0;c[y+8>>2]=0;Tg(y)}y=Nc[c[(c[B>>2]|0)+12>>2]&127](B)|0;c[g>>2]=y;y=Nc[c[(c[B>>2]|0)+16>>2]&127](B)|0;c[h>>2]=y;Lc[c[(c[B>>2]|0)+20>>2]&63](z,B);if((a[j]&1)==0){a[j+1|0]=0;a[j]=0}else{a[c[j+8>>2]|0]=0;c[j+4>>2]=0}Mg(j,0);c[j+0>>2]=c[z+0>>2];c[j+4>>2]=c[z+4>>2];c[j+8>>2]=c[z+8>>2];c[z+0>>2]=0;c[z+4>>2]=0;c[z+8>>2]=0;Ig(z);Lc[c[(c[B>>2]|0)+24>>2]&63](A,B);if((a[k]&1)==0){c[k+4>>2]=0;a[k]=0}else{c[c[k+8>>2]>>2]=0;c[k+4>>2]=0}Wg(k,0);c[k+0>>2]=c[A+0>>2];c[k+4>>2]=c[A+4>>2];c[k+8>>2]=c[A+8>>2];c[A+0>>2]=0;c[A+4>>2]=0;c[A+8>>2]=0;Tg(A);E=Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0;c[m>>2]=E;i=n;return}}function Nl(b,d,e,f,g,h,j,k,l,m,n,o,p,q,r){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;p=p|0;q=q|0;r=r|0;var s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0;s=i;c[e>>2]=b;t=q+4|0;u=q+8|0;v=(f&512|0)==0;w=p+4|0;x=p+8|0;y=(r|0)>0;z=o+1|0;A=o+8|0;B=o+4|0;C=g;g=0;while(1){switch(a[l+g|0]|0){case 0:{c[d>>2]=c[e>>2];D=C;break};case 3:{E=a[q]|0;F=(E&1)==0;if(F){G=(E&255)>>>1}else{G=c[t>>2]|0}if((G|0)==0){D=C}else{if(F){H=t}else{H=c[u>>2]|0}F=c[H>>2]|0;E=c[e>>2]|0;c[e>>2]=E+4;c[E>>2]=F;D=C}break};case 4:{F=c[e>>2]|0;E=k?C+4|0:C;a:do{if(E>>>0<h>>>0){I=E;while(1){J=I+4|0;if(!(Gc[c[(c[j>>2]|0)+12>>2]&31](j,2048,c[I>>2]|0)|0)){K=I;break a}if(J>>>0<h>>>0){I=J}else{K=J;break}}}else{K=E}}while(0);if(y){if(K>>>0>E>>>0){I=c[e>>2]|0;J=K;L=r;while(1){M=J+ -4|0;N=I+4|0;c[I>>2]=c[M>>2];O=L+ -1|0;P=(O|0)>0;if(M>>>0>E>>>0&P){I=N;J=M;L=O}else{break}}c[e>>2]=N;if(P){Q=M;R=O;S=34}else{L=c[e>>2]|0;c[e>>2]=L+4;T=L;U=M}}else{Q=K;R=r;S=34}if((S|0)==34){S=0;L=Wc[c[(c[j>>2]|0)+44>>2]&15](j,48)|0;J=c[e>>2]|0;I=J+4|0;c[e>>2]=I;if((R|0)>0){V=J;W=I;I=R;while(1){c[V>>2]=L;I=I+ -1|0;if((I|0)<=0){break}else{X=W;W=W+4|0;V=X}}c[e>>2]=J+(R+1<<2);T=J+(R<<2)|0;U=Q}else{T=J;U=Q}}c[T>>2]=m;Y=U}else{Y=K}if((Y|0)==(E|0)){V=Wc[c[(c[j>>2]|0)+44>>2]&15](j,48)|0;W=c[e>>2]|0;I=W+4|0;c[e>>2]=I;c[W>>2]=V;Z=I}else{I=a[o]|0;V=(I&1)==0;if(V){_=(I&255)>>>1}else{_=c[B>>2]|0}if((_|0)==0){$=Y;aa=-1;ba=0;ca=0}else{if(V){da=z}else{da=c[A>>2]|0}$=Y;aa=a[da]|0;ba=0;ca=0}while(1){V=c[e>>2]|0;if((ca|0)==(aa|0)){I=V+4|0;c[e>>2]=I;c[V>>2]=n;W=ba+1|0;L=a[o]|0;X=(L&1)==0;if(X){ea=(L&255)>>>1}else{ea=c[B>>2]|0}if(W>>>0<ea>>>0){if(X){fa=z}else{fa=c[A>>2]|0}if((a[fa+W|0]|0)==127){ga=I;ha=-1;ia=W;ja=0}else{if(X){ka=z}else{ka=c[A>>2]|0}ga=I;ha=a[ka+W|0]|0;ia=W;ja=0}}else{ga=I;ha=aa;ia=W;ja=0}}else{ga=V;ha=aa;ia=ba;ja=ca}V=$+ -4|0;W=c[V>>2]|0;I=ga+4|0;c[e>>2]=I;c[ga>>2]=W;if((V|0)==(E|0)){Z=I;break}else{$=V;aa=ha;ba=ia;ca=ja+1|0}}}if((F|0)!=(Z|0)?(J=Z+ -4|0,J>>>0>F>>>0):0){V=F;I=J;while(1){J=c[V>>2]|0;c[V>>2]=c[I>>2];c[I>>2]=J;J=V+4|0;W=I+ -4|0;if(J>>>0<W>>>0){V=J;I=W}else{D=E;break}}}else{D=E}break};case 2:{I=a[p]|0;V=(I&1)==0;if(V){la=(I&255)>>>1}else{la=c[w>>2]|0}if((la|0)==0|v){D=C}else{if(V){ma=w;na=(I&255)>>>1}else{ma=c[x>>2]|0;na=c[w>>2]|0}I=ma+(na<<2)|0;V=c[e>>2]|0;if((ma|0)==(I|0)){oa=V}else{F=(ma+(na+ -1<<2)+(0-ma)|0)>>>2;W=V;J=ma;while(1){c[W>>2]=c[J>>2];X=J+4|0;if((X|0)==(I|0)){break}W=W+4|0;J=X}oa=V+(F+1<<2)|0}c[e>>2]=oa;D=C}break};case 1:{c[d>>2]=c[e>>2];J=Wc[c[(c[j>>2]|0)+44>>2]&15](j,32)|0;W=c[e>>2]|0;c[e>>2]=W+4;c[W>>2]=J;D=C;break};default:{D=C}}g=g+1|0;if((g|0)==4){break}else{C=D}}D=a[q]|0;q=(D&1)==0;if(q){pa=(D&255)>>>1}else{pa=c[t>>2]|0}if(pa>>>0>1){if(q){qa=t;ra=(D&255)>>>1}else{qa=c[u>>2]|0;ra=c[t>>2]|0}t=qa+4|0;u=qa+(ra<<2)|0;D=c[e>>2]|0;if((t|0)==(u|0)){sa=D}else{q=(qa+(ra+ -1<<2)+(0-t)|0)>>>2;ra=D;qa=t;while(1){c[ra>>2]=c[qa>>2];qa=qa+4|0;if((qa|0)==(u|0)){break}else{ra=ra+4|0}}sa=D+(q+1<<2)|0}c[e>>2]=sa}sa=f&176;if((sa|0)==32){c[d>>2]=c[e>>2];i=s;return}else if((sa|0)==16){i=s;return}else{c[d>>2]=b;i=s;return}}function Ol(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;d=i;i=i+480|0;k=d;l=d+476|0;m=d+472|0;n=d+468|0;o=d+464|0;p=d+452|0;q=d+440|0;r=d+428|0;s=d+424|0;t=d+24|0;u=d+20|0;v=d+16|0;w=d+12|0;ah(l,g);x=c[l>>2]|0;if(!((c[4916]|0)==-1)){c[k>>2]=19664;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19664,k,137)}y=(c[19668>>2]|0)+ -1|0;z=c[x+8>>2]|0;if(!((c[x+12>>2]|0)-z>>2>>>0>y>>>0)){A=Fb(4)|0;Ao(A);zc(A|0,27632,123)}x=c[z+(y<<2)>>2]|0;if((x|0)==0){A=Fb(4)|0;Ao(A);zc(A|0,27632,123)}A=a[j]|0;y=(A&1)==0;if(y){B=(A&255)>>>1}else{B=c[j+4>>2]|0}if((B|0)==0){C=0}else{if(y){D=j+4|0}else{D=c[j+8>>2]|0}y=c[D>>2]|0;C=(y|0)==(Wc[c[(c[x>>2]|0)+44>>2]&15](x,45)|0)}c[m>>2]=0;c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;c[r+0>>2]=0;c[r+4>>2]=0;c[r+8>>2]=0;Ml(f,C,l,m,n,o,p,q,r,s);f=a[j]|0;y=(f&1)==0;if(y){E=(f&255)>>>1}else{E=c[j+4>>2]|0}D=c[s>>2]|0;if((E|0)>(D|0)){if(y){F=(f&255)>>>1}else{F=c[j+4>>2]|0}y=a[r]|0;if((y&1)==0){G=(y&255)>>>1}else{G=c[r+4>>2]|0}y=a[q]|0;if((y&1)==0){H=(y&255)>>>1}else{H=c[q+4>>2]|0}I=G+(F-D<<1|1)+H|0}else{H=a[r]|0;if((H&1)==0){J=(H&255)>>>1}else{J=c[r+4>>2]|0}H=a[q]|0;if((H&1)==0){K=(H&255)>>>1}else{K=c[q+4>>2]|0}I=J+2+K|0}K=I+D|0;if(K>>>0>100){I=Vo(K<<2)|0;if((I|0)==0){fp()}else{L=I;M=I}}else{L=0;M=t}if((f&1)==0){N=j+4|0;O=(f&255)>>>1}else{N=c[j+8>>2]|0;O=c[j+4>>2]|0}Nl(M,u,v,c[g+4>>2]|0,N,N+(O<<2)|0,x,C,m,c[n>>2]|0,c[o>>2]|0,p,q,r,D);c[w>>2]=c[e>>2];e=c[u>>2]|0;u=c[v>>2]|0;c[k+0>>2]=c[w+0>>2];Jj(b,k,M,e,u,g,h);if((L|0)==0){Tg(r);Tg(q);Ig(p);P=c[l>>2]|0;jg(P)|0;i=d;return}Wo(L);Tg(r);Tg(q);Ig(p);P=c[l>>2]|0;jg(P)|0;i=d;return}function Pl(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Ql(a){a=a|0;return}function Rl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;e=i;if((a[d]&1)==0){f=d+1|0}else{f=c[d+8>>2]|0}d=Bb(f|0,1)|0;i=e;return d>>>((d|0)!=(-1|0)|0)|0}function Sl(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;d=i;i=i+16|0;j=d;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;k=a[h]|0;if((k&1)==0){l=h+1|0;m=(k&255)>>>1;n=h+1|0}else{k=c[h+8>>2]|0;l=k;m=c[h+4>>2]|0;n=k}k=l+m|0;if(n>>>0<k>>>0){m=n;do{Ng(j,a[m]|0);m=m+1|0}while((m|0)!=(k|0));k=(e|0)==-1?-1:e<<1;if((a[j]&1)==0){o=k;p=9}else{q=k;r=c[j+8>>2]|0}}else{o=(e|0)==-1?-1:e<<1;p=9}if((p|0)==9){q=o;r=j+1|0}o=kc(q|0,f|0,g|0,r|0)|0;c[b+0>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;r=sp(o|0)|0;g=o+r|0;if((r|0)>0){s=o}else{Ig(j);i=d;return}do{Ng(b,a[s]|0);s=s+1|0}while((s|0)!=(g|0));Ig(j);i=d;return}function Tl(a,b){a=a|0;b=b|0;a=i;$a(((b|0)==-1?-1:b<<1)|0)|0;i=a;return}function Ul(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Vl(a){a=a|0;return}function Wl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;e=i;if((a[d]&1)==0){f=d+1|0}else{f=c[d+8>>2]|0}d=Bb(f|0,1)|0;i=e;return d>>>((d|0)!=(-1|0)|0)|0}function Xl(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;i=i+176|0;j=d;k=d+48|0;l=d+40|0;m=d+36|0;n=d+24|0;o=d+16|0;p=d+8|0;c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;c[o+4>>2]=0;c[o>>2]=21328;q=a[h]|0;if((q&1)==0){r=h+4|0;s=(q&255)>>>1;t=h+4|0}else{q=c[h+8>>2]|0;r=q;s=c[h+4>>2]|0;t=q}q=r+(s<<2)|0;s=j;c[s>>2]=0;c[s+4>>2]=0;a:do{if(t>>>0<q>>>0){s=k+32|0;r=t;h=21328|0;while(1){c[m>>2]=r;u=(Sc[c[h+12>>2]&15](o,j,r,q,m,k,s,l)|0)==2;v=c[m>>2]|0;if(u|(v|0)==(r|0)){break}if(k>>>0<(c[l>>2]|0)>>>0){u=k;do{Ng(n,a[u]|0);u=u+1|0}while(u>>>0<(c[l>>2]|0)>>>0);w=c[m>>2]|0}else{w=v}if(!(w>>>0<q>>>0)){break a}r=w;h=c[o>>2]|0}rl(20552)}}while(0);if((a[n]&1)==0){x=n+1|0}else{x=c[n+8>>2]|0}o=kc(((e|0)==-1?-1:e<<1)|0,f|0,g|0,x|0)|0;c[b+0>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;c[p+4>>2]=0;c[p>>2]=21432;x=sp(o|0)|0;g=o+x|0;f=j;c[f>>2]=0;c[f+4>>2]=0;if((x|0)<=0){Ig(n);i=d;return}x=g;f=k+128|0;e=o;o=21432|0;while(1){c[m>>2]=e;w=(Sc[c[o+16>>2]&15](p,j,e,(x-e|0)>32?e+32|0:g,m,k,f,l)|0)==2;q=c[m>>2]|0;if(w|(q|0)==(e|0)){y=20;break}if(k>>>0<(c[l>>2]|0)>>>0){w=k;do{Xg(b,c[w>>2]|0);w=w+4|0}while(w>>>0<(c[l>>2]|0)>>>0);z=c[m>>2]|0}else{z=q}if(!(z>>>0<g>>>0)){y=25;break}e=z;o=c[p>>2]|0}if((y|0)==20){rl(20552)}else if((y|0)==25){Ig(n);i=d;return}}function Yl(a,b){a=a|0;b=b|0;a=i;$a(((b|0)==-1?-1:b<<1)|0)|0;i=a;return}function Zl(b){b=b|0;var d=0,e=0,f=0;d=i;c[b>>2]=19760;e=b+8|0;b=c[e>>2]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){f=kb(2147483647,19576,0)|0;c[4890]=f;gb(19568)}if((b|0)==(c[4890]|0)){i=d;return}nb(c[e>>2]|0);i=d;return}function _l(a){a=a|0;a=Fb(8)|0;kg(a,19552);c[a>>2]=16600;zc(a|0,16640,31)}function $l(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;i=i+16|0;f=e;c[b+4>>2]=d+ -1;c[b>>2]=19592;d=b+8|0;g=b+12|0;h=b+136|0;j=b+24|0;a[h]=1;c[g>>2]=j;c[d>>2]=j;c[b+16>>2]=h;h=28;k=j;do{if((k|0)==0){l=0}else{c[k>>2]=0;l=c[g>>2]|0}k=l+4|0;c[g>>2]=k;h=h+ -1|0}while((h|0)!=0);Gg(b+144|0,19576,1);h=c[d>>2]|0;d=c[g>>2]|0;if((d|0)!=(h|0)){c[g>>2]=d+(~((d+ -4+(0-h)|0)>>>2)<<2)}c[24484>>2]=0;c[6120]=18072;if(!((c[4524]|0)==-1)){c[f>>2]=18096;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18096,f,137)}am(b,24480,(c[18100>>2]|0)+ -1|0);c[24476>>2]=0;c[6118]=18112;if(!((c[4534]|0)==-1)){c[f>>2]=18136;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18136,f,137)}am(b,24472,(c[18140>>2]|0)+ -1|0);c[24460>>2]=0;c[6114]=19688;c[24464>>2]=0;a[24468|0]=0;h=Db()|0;c[24464>>2]=c[h>>2];if(!((c[4918]|0)==-1)){c[f>>2]=19672;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19672,f,137)}am(b,24456,(c[19676>>2]|0)+ -1|0);c[24452>>2]=0;c[6112]=20648;if(!((c[4916]|0)==-1)){c[f>>2]=19664;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19664,f,137)}am(b,24448,(c[19668>>2]|0)+ -1|0);c[24444>>2]=0;c[6110]=20864;if(!((c[4934]|0)==-1)){c[f>>2]=19736;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19736,f,137)}am(b,24440,(c[19740>>2]|0)+ -1|0);c[24428>>2]=0;c[6106]=19760;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){h=kb(2147483647,19576,0)|0;c[4890]=h;gb(19568)}c[24432>>2]=c[4890];if(!((c[4936]|0)==-1)){c[f>>2]=19744;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19744,f,137)}am(b,24424,(c[19748>>2]|0)+ -1|0);c[24420>>2]=0;c[6104]=21088;if(!((c[4950]|0)==-1)){c[f>>2]=19800;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19800,f,137)}am(b,24416,(c[19804>>2]|0)+ -1|0);c[24412>>2]=0;c[6102]=21208;if(!((c[4952]|0)==-1)){c[f>>2]=19808;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19808,f,137)}am(b,24408,(c[19812>>2]|0)+ -1|0);c[24388>>2]=0;c[6096]=19840;a[24392|0]=46;a[24393|0]=44;c[24396>>2]=0;c[24400>>2]=0;c[24404>>2]=0;if(!((c[4954]|0)==-1)){c[f>>2]=19816;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19816,f,137)}am(b,24384,(c[19820>>2]|0)+ -1|0);c[24356>>2]=0;c[6088]=19880;c[24360>>2]=46;c[24364>>2]=44;c[24368>>2]=0;c[24372>>2]=0;c[24376>>2]=0;if(!((c[4956]|0)==-1)){c[f>>2]=19824;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19824,f,137)}am(b,24352,(c[19828>>2]|0)+ -1|0);c[24348>>2]=0;c[6086]=18152;if(!((c[4552]|0)==-1)){c[f>>2]=18208;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18208,f,137)}am(b,24344,(c[18212>>2]|0)+ -1|0);c[24340>>2]=0;c[6084]=18272;if(!((c[4582]|0)==-1)){c[f>>2]=18328;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18328,f,137)}am(b,24336,(c[18332>>2]|0)+ -1|0);c[24332>>2]=0;c[6082]=18344;if(!((c[4598]|0)==-1)){c[f>>2]=18392;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18392,f,137)}am(b,24328,(c[18396>>2]|0)+ -1|0);c[24324>>2]=0;c[6080]=18408;if(!((c[4614]|0)==-1)){c[f>>2]=18456;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18456,f,137)}am(b,24320,(c[18460>>2]|0)+ -1|0);c[24316>>2]=0;c[6078]=19e3;if(!((c[4762]|0)==-1)){c[f>>2]=19048;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19048,f,137)}am(b,24312,(c[19052>>2]|0)+ -1|0);c[24308>>2]=0;c[6076]=19064;if(!((c[4778]|0)==-1)){c[f>>2]=19112;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19112,f,137)}am(b,24304,(c[19116>>2]|0)+ -1|0);c[24300>>2]=0;c[6074]=19128;if(!((c[4794]|0)==-1)){c[f>>2]=19176;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19176,f,137)}am(b,24296,(c[19180>>2]|0)+ -1|0);c[24292>>2]=0;c[6072]=19192;if(!((c[4810]|0)==-1)){c[f>>2]=19240;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19240,f,137)}am(b,24288,(c[19244>>2]|0)+ -1|0);c[24284>>2]=0;c[6070]=19256;if(!((c[4820]|0)==-1)){c[f>>2]=19280;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19280,f,137)}am(b,24280,(c[19284>>2]|0)+ -1|0);c[24276>>2]=0;c[6068]=19336;if(!((c[4840]|0)==-1)){c[f>>2]=19360;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19360,f,137)}am(b,24272,(c[19364>>2]|0)+ -1|0);c[24268>>2]=0;c[6066]=19392;if(!((c[4854]|0)==-1)){c[f>>2]=19416;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19416,f,137)}am(b,24264,(c[19420>>2]|0)+ -1|0);c[24260>>2]=0;c[6064]=19440;if(!((c[4866]|0)==-1)){c[f>>2]=19464;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19464,f,137)}am(b,24256,(c[19468>>2]|0)+ -1|0);c[24244>>2]=0;c[6060]=18488;c[24248>>2]=18536;if(!((c[4642]|0)==-1)){c[f>>2]=18568;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18568,f,137)}am(b,24240,(c[18572>>2]|0)+ -1|0);c[24228>>2]=0;c[6056]=18640;c[24232>>2]=18688;if(!((c[4680]|0)==-1)){c[f>>2]=18720;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18720,f,137)}am(b,24224,(c[18724>>2]|0)+ -1|0);c[24212>>2]=0;c[6052]=20584;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){h=kb(2147483647,19576,0)|0;c[4890]=h;gb(19568)}c[24216>>2]=c[4890];c[6052]=18936;if(!((c[4738]|0)==-1)){c[f>>2]=18952;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18952,f,137)}am(b,24208,(c[18956>>2]|0)+ -1|0);c[24196>>2]=0;c[6048]=20584;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){h=kb(2147483647,19576,0)|0;c[4890]=h;gb(19568)}c[24200>>2]=c[4890];c[6048]=18968;if(!((c[4746]|0)==-1)){c[f>>2]=18984;c[f+4>>2]=136;c[f+8>>2]=0;Dg(18984,f,137)}am(b,24192,(c[18988>>2]|0)+ -1|0);c[24188>>2]=0;c[6046]=19480;if(!((c[4876]|0)==-1)){c[f>>2]=19504;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19504,f,137)}am(b,24184,(c[19508>>2]|0)+ -1|0);c[24180>>2]=0;c[6044]=19520;if((c[4886]|0)==-1){m=c[19548>>2]|0;n=m+ -1|0;am(b,24176,n);i=e;return}c[f>>2]=19544;c[f+4>>2]=136;c[f+8>>2]=0;Dg(19544,f,137);m=c[19548>>2]|0;n=m+ -1|0;am(b,24176,n);i=e;return}function am(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;ig(b);f=a+8|0;g=a+12|0;a=c[g>>2]|0;h=c[f>>2]|0;j=a-h>>2;do{if(!(j>>>0>d>>>0)){k=d+1|0;if(j>>>0<k>>>0){go(f,k-j|0);l=c[f>>2]|0;break}if(j>>>0>k>>>0?(m=h+(k<<2)|0,(a|0)!=(m|0)):0){c[g>>2]=a+(~((a+ -4+(0-m)|0)>>>2)<<2);l=h}else{l=h}}else{l=h}}while(0);h=c[l+(d<<2)>>2]|0;if((h|0)==0){n=l;o=n+(d<<2)|0;c[o>>2]=b;i=e;return}jg(h)|0;n=c[f>>2]|0;o=n+(d<<2)|0;c[o>>2]=b;i=e;return}function bm(a){a=a|0;var b=0;b=i;cm(a);ap(a);i=b;return}function cm(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;c[b>>2]=19592;e=b+12|0;f=c[e>>2]|0;g=b+8|0;h=c[g>>2]|0;if((f|0)!=(h|0)){j=f;f=h;h=0;while(1){k=c[f+(h<<2)>>2]|0;if((k|0)==0){l=j;m=f}else{jg(k)|0;l=c[e>>2]|0;m=c[g>>2]|0}h=h+1|0;if(!(h>>>0<l-m>>2>>>0)){break}else{j=l;f=m}}}Ig(b+144|0);m=c[g>>2]|0;if((m|0)==0){i=d;return}g=c[e>>2]|0;if((g|0)!=(m|0)){c[e>>2]=g+(~((g+ -4+(0-m)|0)>>>2)<<2)}if((b+24|0)==(m|0)){a[b+136|0]=0;i=d;return}else{ap(m);i=d;return}}function dm(){var b=0,d=0,e=0;b=i;if((a[19648]|0)!=0){d=c[4910]|0;i=b;return d|0}if((Ga(19648)|0)==0){d=c[4910]|0;i=b;return d|0}if((a[19624]|0)==0?(Ga(19624)|0)!=0:0){$l(24016,1);c[4902]=24016;c[4904]=19608;gb(19624)}e=c[c[4904]>>2]|0;c[4908]=e;ig(e);c[4910]=19632;gb(19648);d=c[4910]|0;i=b;return d|0}function em(a){a=a|0;var b=0,d=0,e=0;b=i;d=dm()|0;e=c[d>>2]|0;c[a>>2]=e;ig(e);i=b;return}function fm(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;e=c[b>>2]|0;c[a>>2]=e;ig(e);i=d;return}function gm(a){a=a|0;var b=0;b=i;jg(c[a>>2]|0)|0;i=b;return}function hm(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;i=i+16|0;e=d;f=c[a>>2]|0;if(!((c[b>>2]|0)==-1)){c[e>>2]=b;c[e+4>>2]=136;c[e+8>>2]=0;Dg(b,e,137)}e=(c[b+4>>2]|0)+ -1|0;b=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-b>>2>>>0>e>>>0)){g=Fb(4)|0;Ao(g);zc(g|0,27632,123)}f=c[b+(e<<2)>>2]|0;if((f|0)==0){g=Fb(4)|0;Ao(g);zc(g|0,27632,123)}else{i=d;return f|0}return 0}function im(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function jm(a){a=a|0;var b=0;b=i;if((a|0)==0){i=b;return}Jc[c[(c[a>>2]|0)+4>>2]&255](a);i=b;return}function km(a){a=a|0;var b=0;b=c[4914]|0;c[4914]=b+1;c[a+4>>2]=b+1;return}function lm(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function mm(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0;a=i;if(!(e>>>0<128)){f=0;i=a;return f|0}g=Db()|0;f=(b[(c[g>>2]|0)+(e<<1)>>1]&d)<<16>>16!=0;i=a;return f|0}function nm(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0;a=i;if((d|0)==(e|0)){g=d;i=a;return g|0}else{h=d;j=f}while(1){f=c[h>>2]|0;if(f>>>0<128){d=Db()|0;k=b[(c[d>>2]|0)+(f<<1)>>1]|0}else{k=0}b[j>>1]=k;f=h+4|0;if((f|0)==(e|0)){g=e;break}else{h=f;j=j+2|0}}i=a;return g|0}function om(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0;a=i;a:do{if((e|0)==(f|0)){g=e}else{h=e;while(1){j=c[h>>2]|0;if(j>>>0<128?(k=Db()|0,!((b[(c[k>>2]|0)+(j<<1)>>1]&d)<<16>>16==0)):0){g=h;break a}j=h+4|0;if((j|0)==(f|0)){g=f;break}else{h=j}}}}while(0);i=a;return g|0}function pm(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0;a=i;a:do{if((e|0)==(f|0)){g=e}else{h=e;while(1){j=c[h>>2]|0;if(!(j>>>0<128)){g=h;break a}k=Db()|0;l=h+4|0;if((b[(c[k>>2]|0)+(j<<1)>>1]&d)<<16>>16==0){g=h;break a}if((l|0)==(f|0)){g=f;break}else{h=l}}}}while(0);i=a;return g|0}function qm(a,b){a=a|0;b=b|0;var d=0,e=0;a=i;if(!(b>>>0<128)){d=b;i=a;return d|0}e=Ka()|0;d=c[(c[e>>2]|0)+(b<<2)>>2]|0;i=a;return d|0}function rm(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;a=i;if((b|0)==(d|0)){e=b;i=a;return e|0}else{f=b}while(1){b=c[f>>2]|0;if(b>>>0<128){g=Ka()|0;h=c[(c[g>>2]|0)+(b<<2)>>2]|0}else{h=b}c[f>>2]=h;b=f+4|0;if((b|0)==(d|0)){e=d;break}else{f=b}}i=a;return e|0}function sm(a,b){a=a|0;b=b|0;var d=0,e=0;a=i;if(!(b>>>0<128)){d=b;i=a;return d|0}e=pc()|0;d=c[(c[e>>2]|0)+(b<<2)>>2]|0;i=a;return d|0}function tm(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;a=i;if((b|0)==(d|0)){e=b;i=a;return e|0}else{f=b}while(1){b=c[f>>2]|0;if(b>>>0<128){g=pc()|0;h=c[(c[g>>2]|0)+(b<<2)>>2]|0}else{h=b}c[f>>2]=h;b=f+4|0;if((b|0)==(d|0)){e=d;break}else{f=b}}i=a;return e|0}function um(a,b){a=a|0;b=b|0;return b<<24>>24|0}function vm(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0;b=i;if((d|0)==(e|0)){g=d;i=b;return g|0}else{h=d;j=f}while(1){c[j>>2]=a[h]|0;f=h+1|0;if((f|0)==(e|0)){g=e;break}else{h=f;j=j+4|0}}i=b;return g|0}function wm(a,b,c){a=a|0;b=b|0;c=c|0;return(b>>>0<128?b&255:c)|0}function xm(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0;b=i;if((d|0)==(e|0)){h=d;i=b;return h|0}j=((e+ -4+(0-d)|0)>>>2)+1|0;k=d;l=g;while(1){g=c[k>>2]|0;a[l]=g>>>0<128?g&255:f;k=k+4|0;if((k|0)==(e|0)){break}else{l=l+1|0}}h=d+(j<<2)|0;i=b;return h|0}function ym(b){b=b|0;var d=0,e=0;d=i;c[b>>2]=19688;e=c[b+8>>2]|0;if((e|0)!=0?(a[b+12|0]|0)!=0:0){bp(e)}ap(b);i=d;return}function zm(b){b=b|0;var d=0,e=0;d=i;c[b>>2]=19688;e=c[b+8>>2]|0;if((e|0)!=0?(a[b+12|0]|0)!=0:0){bp(e)}i=d;return}function Am(a,b){a=a|0;b=b|0;var d=0,e=0;a=i;if(!(b<<24>>24>-1)){d=b;i=a;return d|0}e=Ka()|0;d=c[(c[e>>2]|0)+((b&255)<<2)>>2]&255;i=a;return d|0}function Bm(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;b=i;if((d|0)==(e|0)){f=d;i=b;return f|0}else{g=d}while(1){d=a[g]|0;if(d<<24>>24>-1){h=Ka()|0;j=c[(c[h>>2]|0)+(d<<24>>24<<2)>>2]&255}else{j=d}a[g]=j;d=g+1|0;if((d|0)==(e|0)){f=e;break}else{g=d}}i=b;return f|0}function Cm(a,b){a=a|0;b=b|0;var d=0,e=0;a=i;if(!(b<<24>>24>-1)){d=b;i=a;return d|0}e=pc()|0;d=c[(c[e>>2]|0)+(b<<24>>24<<2)>>2]&255;i=a;return d|0}function Dm(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;b=i;if((d|0)==(e|0)){f=d;i=b;return f|0}else{g=d}while(1){d=a[g]|0;if(d<<24>>24>-1){h=pc()|0;j=c[(c[h>>2]|0)+(d<<24>>24<<2)>>2]&255}else{j=d}a[g]=j;d=g+1|0;if((d|0)==(e|0)){f=e;break}else{g=d}}i=b;return f|0}function Em(a,b){a=a|0;b=b|0;return b|0}function Fm(b,c,d,e){b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0;b=i;if((c|0)==(d|0)){f=c}else{g=c;c=e;while(1){a[c]=a[g]|0;e=g+1|0;if((e|0)==(d|0)){f=d;break}else{g=e;c=c+1|0}}}i=b;return f|0}function Gm(a,b,c){a=a|0;b=b|0;c=c|0;return(b<<24>>24>-1?b:c)|0}function Hm(b,c,d,e,f){b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0;b=i;if((c|0)==(d|0)){g=c;i=b;return g|0}else{h=c;j=f}while(1){f=a[h]|0;a[j]=f<<24>>24>-1?f:e;f=h+1|0;if((f|0)==(d|0)){g=d;break}else{h=f;j=j+1|0}}i=b;return g|0}function Im(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Jm(a,b,d,e,f,g,h,i){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;c[f>>2]=d;c[i>>2]=g;return 3}function Km(a,b,d,e,f,g,h,i){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;c[f>>2]=d;c[i>>2]=g;return 3}function Lm(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;c[f>>2]=d;return 3}function Mm(a){a=a|0;return 1}function Nm(a){a=a|0;return 1}function Om(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;b=d-c|0;return(b>>>0<e>>>0?b:e)|0}function Pm(a){a=a|0;return 1}function Qm(a){a=a|0;var b=0;b=i;Zl(a);ap(a);i=b;return}function Rm(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;l=i;i=i+16|0;m=l;n=l+8|0;o=(e|0)==(f|0);a:do{if(!o){p=e;while(1){q=p+4|0;if((c[p>>2]|0)==0){r=p;break}if((q|0)==(f|0)){r=f;break}else{p=q}}c[k>>2]=h;c[g>>2]=e;if(!(o|(h|0)==(j|0))){p=j;q=b+8|0;s=e;t=h;u=r;while(1){v=d;w=c[v+4>>2]|0;x=m;c[x>>2]=c[v>>2];c[x+4>>2]=w;w=Jb(c[q>>2]|0)|0;x=to(t,g,u-s>>2,p-t|0,d)|0;if((w|0)!=0){Jb(w|0)|0}if((x|0)==-1){y=10;break}else if((x|0)==0){z=1;y=33;break}w=(c[k>>2]|0)+x|0;c[k>>2]=w;if((w|0)==(j|0)){y=31;break}if((u|0)==(f|0)){A=c[g>>2]|0;B=w;C=f}else{w=Jb(c[q>>2]|0)|0;x=so(n,0,d)|0;if((w|0)!=0){Jb(w|0)|0}if((x|0)==-1){z=2;y=33;break}w=c[k>>2]|0;if(x>>>0>(p-w|0)>>>0){z=1;y=33;break}b:do{if((x|0)!=0){v=w;D=x;E=n;while(1){F=a[E]|0;c[k>>2]=v+1;a[v]=F;F=D+ -1|0;if((F|0)==0){break b}v=c[k>>2]|0;D=F;E=E+1|0}}}while(0);x=(c[g>>2]|0)+4|0;c[g>>2]=x;c:do{if((x|0)==(f|0)){G=f}else{w=x;while(1){E=w+4|0;if((c[w>>2]|0)==0){G=w;break c}if((E|0)==(f|0)){G=f;break}else{w=E}}}}while(0);A=x;B=c[k>>2]|0;C=G}if((A|0)==(f|0)|(B|0)==(j|0)){H=A;break a}else{s=A;t=B;u=C}}if((y|0)==10){c[k>>2]=t;d:do{if((s|0)==(c[g>>2]|0)){I=s}else{u=s;p=t;while(1){w=c[u>>2]|0;E=Jb(c[q>>2]|0)|0;D=so(p,w,m)|0;if((E|0)!=0){Jb(E|0)|0}if((D|0)==-1){I=u;break d}E=(c[k>>2]|0)+D|0;c[k>>2]=E;D=u+4|0;if((D|0)==(c[g>>2]|0)){I=D;break}else{u=D;p=E}}}}while(0);c[g>>2]=I;z=2;i=l;return z|0}else if((y|0)==31){H=c[g>>2]|0;break}else if((y|0)==33){i=l;return z|0}}else{H=e}}else{c[k>>2]=h;c[g>>2]=e;H=e}}while(0);z=(H|0)!=(f|0)|0;i=l;return z|0}function Sm(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;l=i;i=i+16|0;m=l;n=(e|0)==(f|0);a:do{if(!n){o=e;while(1){p=o+1|0;if((a[o]|0)==0){q=o;break}if((p|0)==(f|0)){q=f;break}else{o=p}}c[k>>2]=h;c[g>>2]=e;if(!(n|(h|0)==(j|0))){o=j;p=b+8|0;r=e;s=h;t=q;while(1){u=d;v=c[u+4>>2]|0;w=m;c[w>>2]=c[u>>2];c[w+4>>2]=v;x=t;v=Jb(c[p>>2]|0)|0;w=po(s,g,x-r|0,o-s>>2,d)|0;if((v|0)!=0){Jb(v|0)|0}if((w|0)==0){y=2;z=32;break}else if((w|0)==-1){z=10;break}v=(c[k>>2]|0)+(w<<2)|0;c[k>>2]=v;if((v|0)==(j|0)){z=30;break}w=c[g>>2]|0;if((t|0)==(f|0)){A=w;B=v;C=f}else{u=Jb(c[p>>2]|0)|0;D=oo(v,w,1,d)|0;if((u|0)!=0){Jb(u|0)|0}if((D|0)!=0){y=2;z=32;break}c[k>>2]=(c[k>>2]|0)+4;D=(c[g>>2]|0)+1|0;c[g>>2]=D;b:do{if((D|0)==(f|0)){E=f}else{u=D;while(1){w=u+1|0;if((a[u]|0)==0){E=u;break b}if((w|0)==(f|0)){E=f;break}else{u=w}}}}while(0);A=D;B=c[k>>2]|0;C=E}if((A|0)==(f|0)|(B|0)==(j|0)){F=A;break a}else{r=A;s=B;t=C}}if((z|0)==10){c[k>>2]=s;c:do{if((r|0)!=(c[g>>2]|0)){t=r;o=s;while(1){u=Jb(c[p>>2]|0)|0;w=oo(o,t,x-t|0,m)|0;if((u|0)!=0){Jb(u|0)|0}if((w|0)==-2){z=16;break}else if((w|0)==-1){z=15;break}else if((w|0)==0){G=t+1|0}else{G=t+w|0}w=(c[k>>2]|0)+4|0;c[k>>2]=w;if((G|0)==(c[g>>2]|0)){H=G;break c}else{t=G;o=w}}if((z|0)==15){c[g>>2]=t;y=2;i=l;return y|0}else if((z|0)==16){c[g>>2]=t;y=1;i=l;return y|0}}else{H=r}}while(0);c[g>>2]=H;y=(H|0)!=(f|0)|0;i=l;return y|0}else if((z|0)==30){F=c[g>>2]|0;break}else if((z|0)==32){i=l;return y|0}}else{F=e}}else{c[k>>2]=h;c[g>>2]=e;F=e}}while(0);y=(F|0)!=(f|0)|0;i=l;return y|0}function Tm(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0;h=i;i=i+16|0;j=h;c[g>>2]=e;e=Jb(c[b+8>>2]|0)|0;b=so(j,0,d)|0;if((e|0)!=0){Jb(e|0)|0}if((b|0)==0|(b|0)==-1){k=2;i=h;return k|0}e=b+ -1|0;b=c[g>>2]|0;if(e>>>0>(f-b|0)>>>0){k=1;i=h;return k|0}if((e|0)==0){k=0;i=h;return k|0}else{l=b;m=e;n=j}while(1){j=a[n]|0;c[g>>2]=l+1;a[l]=j;j=m+ -1|0;if((j|0)==0){k=0;break}l=c[g>>2]|0;m=j;n=n+1|0}i=h;return k|0}function Um(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=a+8|0;a=Jb(c[d>>2]|0)|0;e=ro(0,0,4)|0;if((a|0)!=0){Jb(a|0)|0}if((e|0)==0){e=c[d>>2]|0;if((e|0)!=0){d=Jb(e|0)|0;if((d|0)==0){f=0}else{Jb(d|0)|0;f=0}}else{f=1}}else{f=-1}i=b;return f|0}function Vm(a){a=a|0;return 0}function Wm(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=i;if((f|0)==0|(d|0)==(e|0)){h=0;i=g;return h|0}j=e;k=a+8|0;a=d;d=0;l=0;while(1){m=Jb(c[k>>2]|0)|0;n=no(a,j-a|0,b)|0;if((m|0)!=0){Jb(m|0)|0}if((n|0)==-2|(n|0)==-1){h=d;o=9;break}else if((n|0)==0){p=a+1|0;q=1}else{p=a+n|0;q=n}n=q+d|0;m=l+1|0;if(m>>>0>=f>>>0|(p|0)==(e|0)){h=n;o=9;break}else{a=p;d=n;l=m}}if((o|0)==9){i=g;return h|0}return 0}function Xm(a){a=a|0;var b=0,d=0,e=0;b=i;d=c[a+8>>2]|0;if((d|0)!=0){a=Jb(d|0)|0;if((a|0)==0){e=4}else{Jb(a|0)|0;e=4}}else{e=1}i=b;return e|0}function Ym(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Zm(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0;b=i;i=i+16|0;a=b+4|0;k=b;c[a>>2]=d;c[k>>2]=g;l=_m(d,e,a,g,h,k,1114111,0)|0;c[f>>2]=d+((c[a>>2]|0)-d>>1<<1);c[j>>2]=g+((c[k>>2]|0)-g);i=b;return l|0}function _m(d,f,g,h,j,k,l,m){d=d|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0;n=i;c[g>>2]=d;c[k>>2]=h;do{if((m&2|0)!=0){if((j-h|0)<3){o=1;i=n;return o|0}else{c[k>>2]=h+1;a[h]=-17;d=c[k>>2]|0;c[k>>2]=d+1;a[d]=-69;d=c[k>>2]|0;c[k>>2]=d+1;a[d]=-65;break}}}while(0);h=f;m=c[g>>2]|0;if(!(m>>>0<f>>>0)){o=0;i=n;return o|0}d=j;j=m;a:while(1){m=b[j>>1]|0;p=m&65535;if(p>>>0>l>>>0){o=2;q=26;break}do{if((m&65535)<128){r=c[k>>2]|0;if((d-r|0)<1){o=1;q=26;break a}c[k>>2]=r+1;a[r]=m}else{if((m&65535)<2048){r=c[k>>2]|0;if((d-r|0)<2){o=1;q=26;break a}c[k>>2]=r+1;a[r]=p>>>6|192;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=p&63|128;break}if((m&65535)<55296){r=c[k>>2]|0;if((d-r|0)<3){o=1;q=26;break a}c[k>>2]=r+1;a[r]=p>>>12|224;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=p>>>6&63|128;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=p&63|128;break}if(!((m&65535)<56320)){if((m&65535)<57344){o=2;q=26;break a}r=c[k>>2]|0;if((d-r|0)<3){o=1;q=26;break a}c[k>>2]=r+1;a[r]=p>>>12|224;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=p>>>6&63|128;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=p&63|128;break}if((h-j|0)<4){o=1;q=26;break a}r=j+2|0;s=e[r>>1]|0;if((s&64512|0)!=56320){o=2;q=26;break a}if((d-(c[k>>2]|0)|0)<4){o=1;q=26;break a}t=p&960;if(((t<<10)+65536|p<<10&64512|s&1023)>>>0>l>>>0){o=2;q=26;break a}c[g>>2]=r;r=(t>>>6)+1|0;t=c[k>>2]|0;c[k>>2]=t+1;a[t]=r>>>2|240;t=c[k>>2]|0;c[k>>2]=t+1;a[t]=p>>>2&15|r<<4&48|128;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=p<<4&48|s>>>6&15|128;r=c[k>>2]|0;c[k>>2]=r+1;a[r]=s&63|128}}while(0);p=(c[g>>2]|0)+2|0;c[g>>2]=p;if(p>>>0<f>>>0){j=p}else{o=0;q=26;break}}if((q|0)==26){i=n;return o|0}return 0}function $m(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0;b=i;i=i+16|0;a=b+4|0;k=b;c[a>>2]=d;c[k>>2]=g;l=an(d,e,a,g,h,k,1114111,0)|0;c[f>>2]=d+((c[a>>2]|0)-d);c[j>>2]=g+((c[k>>2]|0)-g>>1<<1);i=b;return l|0}function an(e,f,g,h,j,k,l,m){e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;n=i;c[g>>2]=e;c[k>>2]=h;h=c[g>>2]|0;if(((((m&4|0)!=0?(f-h|0)>2:0)?(a[h]|0)==-17:0)?(a[h+1|0]|0)==-69:0)?(a[h+2|0]|0)==-65:0){m=h+3|0;c[g>>2]=m;o=m}else{o=h}a:do{if(o>>>0<f>>>0){h=f;m=j;e=c[k>>2]|0;p=o;b:while(1){if(!(e>>>0<j>>>0)){q=p;break a}r=a[p]|0;s=r&255;if(s>>>0>l>>>0){t=2;u=41;break}do{if(r<<24>>24>-1){b[e>>1]=r&255;c[g>>2]=p+1}else{if((r&255)<194){t=2;u=41;break b}if((r&255)<224){if((h-p|0)<2){t=1;u=41;break b}v=d[p+1|0]|0;if((v&192|0)!=128){t=2;u=41;break b}w=v&63|s<<6&1984;if(w>>>0>l>>>0){t=2;u=41;break b}b[e>>1]=w;c[g>>2]=p+2;break}if((r&255)<240){if((h-p|0)<3){t=1;u=41;break b}w=a[p+1|0]|0;v=a[p+2|0]|0;if((s|0)==224){if(!((w&-32)<<24>>24==-96)){t=2;u=41;break b}}else if((s|0)==237){if(!((w&-32)<<24>>24==-128)){t=2;u=41;break b}}else{if(!((w&-64)<<24>>24==-128)){t=2;u=41;break b}}x=v&255;if((x&192|0)!=128){t=2;u=41;break b}v=(w&255)<<6&4032|s<<12|x&63;if((v&65535)>>>0>l>>>0){t=2;u=41;break b}b[e>>1]=v;c[g>>2]=p+3;break}if(!((r&255)<245)){t=2;u=41;break b}if((h-p|0)<4){t=1;u=41;break b}v=a[p+1|0]|0;x=a[p+2|0]|0;w=a[p+3|0]|0;if((s|0)==240){if(!((v+112<<24>>24&255)<48)){t=2;u=41;break b}}else if((s|0)==244){if(!((v&-16)<<24>>24==-128)){t=2;u=41;break b}}else{if(!((v&-64)<<24>>24==-128)){t=2;u=41;break b}}y=x&255;if((y&192|0)!=128){t=2;u=41;break b}x=w&255;if((x&192|0)!=128){t=2;u=41;break b}if((m-e|0)<4){t=1;u=41;break b}w=s&7;z=v&255;v=y<<6;A=x&63;if((z<<12&258048|w<<18|v&4032|A)>>>0>l>>>0){t=2;u=41;break b}b[e>>1]=z<<2&60|y>>>4&3|((z>>>4&3|w<<2)<<6)+16320|55296;w=e+2|0;c[k>>2]=w;b[w>>1]=A|v&960|56320;c[g>>2]=(c[g>>2]|0)+4}}while(0);s=(c[k>>2]|0)+2|0;c[k>>2]=s;r=c[g>>2]|0;if(r>>>0<f>>>0){e=s;p=r}else{q=r;break a}}if((u|0)==41){i=n;return t|0}}else{q=o}}while(0);t=q>>>0<f>>>0|0;i=n;return t|0}function bn(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;c[f>>2]=d;return 3}function cn(a){a=a|0;return 0}function dn(a){a=a|0;return 0}function en(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;b=i;a=fn(c,d,e,1114111,0)|0;i=b;return a|0}function fn(b,c,e,f,g){b=b|0;c=c|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;h=i;if((((g&4|0)!=0?(c-b|0)>2:0)?(a[b]|0)==-17:0)?(a[b+1|0]|0)==-69:0){j=(a[b+2|0]|0)==-65?b+3|0:b}else{j=b}a:do{if(j>>>0<c>>>0&(e|0)!=0){g=c;k=j;l=0;b:while(1){m=a[k]|0;n=m&255;if(n>>>0>f>>>0){o=k;break a}do{if(m<<24>>24>-1){p=k+1|0;q=l}else{if((m&255)<194){o=k;break a}if((m&255)<224){if((g-k|0)<2){o=k;break a}r=d[k+1|0]|0;if((r&192|0)!=128){o=k;break a}if((r&63|n<<6&1984)>>>0>f>>>0){o=k;break a}p=k+2|0;q=l;break}if((m&255)<240){s=k;if((g-s|0)<3){o=k;break a}r=a[k+1|0]|0;t=a[k+2|0]|0;if((n|0)==224){if(!((r&-32)<<24>>24==-96)){u=21;break b}}else if((n|0)==237){if(!((r&-32)<<24>>24==-128)){u=23;break b}}else{if(!((r&-64)<<24>>24==-128)){u=25;break b}}v=t&255;if((v&192|0)!=128){o=k;break a}if(((r&255)<<6&4032|n<<12&61440|v&63)>>>0>f>>>0){o=k;break a}p=k+3|0;q=l;break}if(!((m&255)<245)){o=k;break a}w=k;if((g-w|0)<4){o=k;break a}if((e-l|0)>>>0<2){o=k;break a}v=a[k+1|0]|0;r=a[k+2|0]|0;t=a[k+3|0]|0;if((n|0)==240){if(!((v+112<<24>>24&255)<48)){u=34;break b}}else if((n|0)==244){if(!((v&-16)<<24>>24==-128)){u=36;break b}}else{if(!((v&-64)<<24>>24==-128)){u=38;break b}}x=r&255;if((x&192|0)!=128){o=k;break a}r=t&255;if((r&192|0)!=128){o=k;break a}if(((v&255)<<12&258048|n<<18&1835008|x<<6&4032|r&63)>>>0>f>>>0){o=k;break a}p=k+4|0;q=l+1|0}}while(0);n=q+1|0;if(p>>>0<c>>>0&n>>>0<e>>>0){k=p;l=n}else{o=p;break a}}if((u|0)==21){y=s-b|0;i=h;return y|0}else if((u|0)==23){y=s-b|0;i=h;return y|0}else if((u|0)==25){y=s-b|0;i=h;return y|0}else if((u|0)==34){y=w-b|0;i=h;return y|0}else if((u|0)==36){y=w-b|0;i=h;return y|0}else if((u|0)==38){y=w-b|0;i=h;return y|0}}else{o=j}}while(0);y=o-b|0;i=h;return y|0}function gn(a){a=a|0;return 4}function hn(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function jn(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0;b=i;i=i+16|0;a=b+4|0;k=b;c[a>>2]=d;c[k>>2]=g;l=kn(d,e,a,g,h,k,1114111,0)|0;c[f>>2]=d+((c[a>>2]|0)-d>>2<<2);c[j>>2]=g+((c[k>>2]|0)-g);i=b;return l|0}function kn(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0;l=i;c[e>>2]=b;c[h>>2]=f;do{if((k&2|0)!=0){if((g-f|0)<3){m=1;i=l;return m|0}else{c[h>>2]=f+1;a[f]=-17;b=c[h>>2]|0;c[h>>2]=b+1;a[b]=-69;b=c[h>>2]|0;c[h>>2]=b+1;a[b]=-65;break}}}while(0);f=c[e>>2]|0;if(!(f>>>0<d>>>0)){m=0;i=l;return m|0}k=g;g=f;a:while(1){f=c[g>>2]|0;if((f&-2048|0)==55296|f>>>0>j>>>0){m=2;n=19;break}do{if(!(f>>>0<128)){if(f>>>0<2048){b=c[h>>2]|0;if((k-b|0)<2){m=1;n=19;break a}c[h>>2]=b+1;a[b]=f>>>6|192;b=c[h>>2]|0;c[h>>2]=b+1;a[b]=f&63|128;break}b=c[h>>2]|0;o=k-b|0;if(f>>>0<65536){if((o|0)<3){m=1;n=19;break a}c[h>>2]=b+1;a[b]=f>>>12|224;p=c[h>>2]|0;c[h>>2]=p+1;a[p]=f>>>6&63|128;p=c[h>>2]|0;c[h>>2]=p+1;a[p]=f&63|128;break}else{if((o|0)<4){m=1;n=19;break a}c[h>>2]=b+1;a[b]=f>>>18|240;b=c[h>>2]|0;c[h>>2]=b+1;a[b]=f>>>12&63|128;b=c[h>>2]|0;c[h>>2]=b+1;a[b]=f>>>6&63|128;b=c[h>>2]|0;c[h>>2]=b+1;a[b]=f&63|128;break}}else{b=c[h>>2]|0;if((k-b|0)<1){m=1;n=19;break a}c[h>>2]=b+1;a[b]=f}}while(0);f=(c[e>>2]|0)+4|0;c[e>>2]=f;if(f>>>0<d>>>0){g=f}else{m=0;n=19;break}}if((n|0)==19){i=l;return m|0}return 0}function ln(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0;b=i;i=i+16|0;a=b+4|0;k=b;c[a>>2]=d;c[k>>2]=g;l=mn(d,e,a,g,h,k,1114111,0)|0;c[f>>2]=d+((c[a>>2]|0)-d);c[j>>2]=g+((c[k>>2]|0)-g>>2<<2);i=b;return l|0}function mn(b,e,f,g,h,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;m=i;c[f>>2]=b;c[j>>2]=g;g=c[f>>2]|0;if(((((l&4|0)!=0?(e-g|0)>2:0)?(a[g]|0)==-17:0)?(a[g+1|0]|0)==-69:0)?(a[g+2|0]|0)==-65:0){l=g+3|0;c[f>>2]=l;n=l}else{n=g}a:do{if(n>>>0<e>>>0){g=e;l=c[j>>2]|0;b=n;while(1){if(!(l>>>0<h>>>0)){o=b;p=39;break a}q=a[b]|0;r=q&255;do{if(q<<24>>24>-1){if(r>>>0>k>>>0){s=2;break a}c[l>>2]=r;c[f>>2]=b+1}else{if((q&255)<194){s=2;break a}if((q&255)<224){if((g-b|0)<2){s=1;break a}t=d[b+1|0]|0;if((t&192|0)!=128){s=2;break a}u=t&63|r<<6&1984;if(u>>>0>k>>>0){s=2;break a}c[l>>2]=u;c[f>>2]=b+2;break}if((q&255)<240){if((g-b|0)<3){s=1;break a}u=a[b+1|0]|0;t=a[b+2|0]|0;if((r|0)==224){if(!((u&-32)<<24>>24==-96)){s=2;break a}}else if((r|0)==237){if(!((u&-32)<<24>>24==-128)){s=2;break a}}else{if(!((u&-64)<<24>>24==-128)){s=2;break a}}v=t&255;if((v&192|0)!=128){s=2;break a}t=(u&255)<<6&4032|r<<12&61440|v&63;if(t>>>0>k>>>0){s=2;break a}c[l>>2]=t;c[f>>2]=b+3;break}if(!((q&255)<245)){s=2;break a}if((g-b|0)<4){s=1;break a}t=a[b+1|0]|0;v=a[b+2|0]|0;u=a[b+3|0]|0;if((r|0)==244){if(!((t&-16)<<24>>24==-128)){s=2;break a}}else if((r|0)==240){if(!((t+112<<24>>24&255)<48)){s=2;break a}}else{if(!((t&-64)<<24>>24==-128)){s=2;break a}}w=v&255;if((w&192|0)!=128){s=2;break a}v=u&255;if((v&192|0)!=128){s=2;break a}u=(t&255)<<12&258048|r<<18&1835008|w<<6&4032|v&63;if(u>>>0>k>>>0){s=2;break a}c[l>>2]=u;c[f>>2]=b+4}}while(0);r=(c[j>>2]|0)+4|0;c[j>>2]=r;q=c[f>>2]|0;if(q>>>0<e>>>0){l=r;b=q}else{o=q;p=39;break}}}else{o=n;p=39}}while(0);if((p|0)==39){s=o>>>0<e>>>0|0}i=m;return s|0}function nn(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;c[f>>2]=d;return 3}function on(a){a=a|0;return 0}function pn(a){a=a|0;return 0}function qn(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;b=i;a=rn(c,d,e,1114111,0)|0;i=b;return a|0}function rn(b,c,e,f,g){b=b|0;c=c|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;h=i;if((((g&4|0)!=0?(c-b|0)>2:0)?(a[b]|0)==-17:0)?(a[b+1|0]|0)==-69:0){j=(a[b+2|0]|0)==-65?b+3|0:b}else{j=b}a:do{if(j>>>0<c>>>0&(e|0)!=0){g=c;k=j;l=1;b:while(1){m=a[k]|0;n=m&255;do{if(m<<24>>24>-1){if(n>>>0>f>>>0){o=k;break a}p=k+1|0}else{if((m&255)<194){o=k;break a}if((m&255)<224){if((g-k|0)<2){o=k;break a}q=d[k+1|0]|0;if((q&192|0)!=128){o=k;break a}if((q&63|n<<6&1984)>>>0>f>>>0){o=k;break a}p=k+2|0;break}if((m&255)<240){r=k;if((g-r|0)<3){o=k;break a}q=a[k+1|0]|0;s=a[k+2|0]|0;if((n|0)==237){if(!((q&-32)<<24>>24==-128)){t=23;break b}}else if((n|0)==224){if(!((q&-32)<<24>>24==-96)){t=21;break b}}else{if(!((q&-64)<<24>>24==-128)){t=25;break b}}u=s&255;if((u&192|0)!=128){o=k;break a}if(((q&255)<<6&4032|n<<12&61440|u&63)>>>0>f>>>0){o=k;break a}p=k+3|0;break}if(!((m&255)<245)){o=k;break a}v=k;if((g-v|0)<4){o=k;break a}u=a[k+1|0]|0;q=a[k+2|0]|0;s=a[k+3|0]|0;if((n|0)==240){if(!((u+112<<24>>24&255)<48)){t=33;break b}}else if((n|0)==244){if(!((u&-16)<<24>>24==-128)){t=35;break b}}else{if(!((u&-64)<<24>>24==-128)){t=37;break b}}w=q&255;if((w&192|0)!=128){o=k;break a}q=s&255;if((q&192|0)!=128){o=k;break a}if(((u&255)<<12&258048|n<<18&1835008|w<<6&4032|q&63)>>>0>f>>>0){o=k;break a}p=k+4|0}}while(0);if(!(p>>>0<c>>>0&l>>>0<e>>>0)){o=p;break a}k=p;l=l+1|0}if((t|0)==21){x=r-b|0;i=h;return x|0}else if((t|0)==23){x=r-b|0;i=h;return x|0}else if((t|0)==25){x=r-b|0;i=h;return x|0}else if((t|0)==33){x=v-b|0;i=h;return x|0}else if((t|0)==35){x=v-b|0;i=h;return x|0}else if((t|0)==37){x=v-b|0;i=h;return x|0}}else{o=j}}while(0);x=o-b|0;i=h;return x|0}function sn(a){a=a|0;return 4}function tn(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function un(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function vn(a){a=a|0;var b=0;b=i;c[a>>2]=19840;Ig(a+12|0);ap(a);i=b;return}function wn(a){a=a|0;var b=0;b=i;c[a>>2]=19840;Ig(a+12|0);i=b;return}function xn(a){a=a|0;var b=0;b=i;c[a>>2]=19880;Ig(a+16|0);ap(a);i=b;return}function yn(a){a=a|0;var b=0;b=i;c[a>>2]=19880;Ig(a+16|0);i=b;return}function zn(b){b=b|0;return a[b+8|0]|0}function An(a){a=a|0;return c[a+8>>2]|0}function Bn(b){b=b|0;return a[b+9|0]|0}function Cn(a){a=a|0;return c[a+12>>2]|0}function Dn(a,b){a=a|0;b=b|0;var c=0;c=i;Fg(a,b+12|0);i=c;return}function En(a,b){a=a|0;b=b|0;var c=0;c=i;Fg(a,b+16|0);i=c;return}function Fn(a,b){a=a|0;b=b|0;b=i;Gg(a,19912,4);i=b;return}function Gn(a,b){a=a|0;b=b|0;b=i;Rg(a,19920,vo(19920)|0);i=b;return}function Hn(a,b){a=a|0;b=b|0;b=i;Gg(a,19944,5);i=b;return}function In(a,b){a=a|0;b=b|0;b=i;Rg(a,19952,vo(19952)|0);i=b;return}function Jn(b){b=b|0;var d=0;b=i;if((a[19984]|0)!=0){d=c[4994]|0;i=b;return d|0}if((Ga(19984)|0)==0){d=c[4994]|0;i=b;return d|0}if((a[27184]|0)==0?(Ga(27184)|0)!=0:0){vp(27016,0,168)|0;Dc(140,0,p|0)|0;gb(27184)}Jg(27016,27192)|0;Jg(27028|0,27200)|0;Jg(27040|0,27208)|0;Jg(27052|0,27216)|0;Jg(27064|0,27232)|0;Jg(27076|0,27248)|0;Jg(27088|0,27256)|0;Jg(27100|0,27272)|0;Jg(27112|0,27280)|0;Jg(27124|0,27288)|0;Jg(27136|0,27296)|0;Jg(27148|0,27304)|0;Jg(27160|0,27312)|0;Jg(27172|0,27320)|0;c[4994]=27016;gb(19984);d=c[4994]|0;i=b;return d|0}function Kn(b){b=b|0;var d=0;b=i;if((a[2e4]|0)!=0){d=c[4998]|0;i=b;return d|0}if((Ga(2e4)|0)==0){d=c[4998]|0;i=b;return d|0}if((a[26648]|0)==0?(Ga(26648)|0)!=0:0){vp(26480,0,168)|0;Dc(141,0,p|0)|0;gb(26648)}Ug(26480,26656)|0;Ug(26492|0,26688)|0;Ug(26504|0,26720)|0;Ug(26516|0,26752)|0;Ug(26528|0,26792)|0;Ug(26540|0,26832)|0;Ug(26552|0,26864)|0;Ug(26564|0,26904)|0;Ug(26576|0,26920)|0;Ug(26588|0,26936)|0;Ug(26600|0,26952)|0;Ug(26612|0,26968)|0;Ug(26624|0,26984)|0;Ug(26636|0,27e3)|0;c[4998]=26480;gb(2e4);d=c[4998]|0;i=b;return d|0}function Ln(b){b=b|0;var d=0;b=i;if((a[20016]|0)!=0){d=c[5002]|0;i=b;return d|0}if((Ga(20016)|0)==0){d=c[5002]|0;i=b;return d|0}if((a[26256]|0)==0?(Ga(26256)|0)!=0:0){vp(25968,0,288)|0;Dc(142,0,p|0)|0;gb(26256)}Jg(25968,26264)|0;Jg(25980|0,26272)|0;Jg(25992|0,26288)|0;Jg(26004|0,26296)|0;Jg(26016|0,26304)|0;Jg(26028|0,26312)|0;Jg(26040|0,26320)|0;Jg(26052|0,26328)|0;Jg(26064|0,26336)|0;Jg(26076|0,26352)|0;Jg(26088|0,26360)|0;Jg(26100|0,26376)|0;Jg(26112|0,26392)|0;Jg(26124|0,26400)|0;Jg(26136|0,26408)|0;Jg(26148|0,26416)|0;Jg(26160|0,26304)|0;Jg(26172|0,26424)|0;Jg(26184|0,26432)|0;Jg(26196|0,26440)|0;Jg(26208|0,26448)|0;Jg(26220|0,26456)|0;Jg(26232|0,26464)|0;Jg(26244|0,26472)|0;c[5002]=25968;gb(20016);d=c[5002]|0;i=b;return d|0}function Mn(b){b=b|0;var d=0;b=i;if((a[20032]|0)!=0){d=c[5006]|0;i=b;return d|0}if((Ga(20032)|0)==0){d=c[5006]|0;i=b;return d|0}if((a[25416]|0)==0?(Ga(25416)|0)!=0:0){vp(25128,0,288)|0;Dc(143,0,p|0)|0;gb(25416)}Ug(25128,25424)|0;Ug(25140|0,25456)|0;Ug(25152|0,25496)|0;Ug(25164|0,25520)|0;Ug(25176|0,25840)|0;Ug(25188|0,25544)|0;Ug(25200|0,25568)|0;Ug(25212|0,25592)|0;Ug(25224|0,25624)|0;Ug(25236|0,25664)|0;Ug(25248|0,25696)|0;Ug(25260|0,25736)|0;Ug(25272|0,25776)|0;Ug(25284|0,25792)|0;Ug(25296|0,25808)|0;Ug(25308|0,25824)|0;Ug(25320|0,25840)|0;Ug(25332|0,25856)|0;Ug(25344|0,25872)|0;Ug(25356|0,25888)|0;Ug(25368|0,25904)|0;Ug(25380|0,25920)|0;Ug(25392|0,25936)|0;Ug(25404|0,25952)|0;c[5006]=25128;gb(20032);d=c[5006]|0;i=b;return d|0}function Nn(b){b=b|0;var d=0;b=i;if((a[20048]|0)!=0){d=c[5010]|0;i=b;return d|0}if((Ga(20048)|0)==0){d=c[5010]|0;i=b;return d|0}if((a[25104]|0)==0?(Ga(25104)|0)!=0:0){vp(24816,0,288)|0;Dc(144,0,p|0)|0;gb(25104)}Jg(24816,25112)|0;Jg(24828|0,25120)|0;c[5010]=24816;gb(20048);d=c[5010]|0;i=b;return d|0}function On(b){b=b|0;var d=0;b=i;if((a[20064]|0)!=0){d=c[5014]|0;i=b;return d|0}if((Ga(20064)|0)==0){d=c[5014]|0;i=b;return d|0}if((a[24776]|0)==0?(Ga(24776)|0)!=0:0){vp(24488,0,288)|0;Dc(145,0,p|0)|0;gb(24776)}Ug(24488,24784)|0;Ug(24500|0,24800)|0;c[5014]=24488;gb(20064);d=c[5014]|0;i=b;return d|0}function Pn(b){b=b|0;b=i;if((a[20088]|0)==0?(Ga(20088)|0)!=0:0){Gg(20072,20096,8);Dc(133,20072,p|0)|0;gb(20088)}i=b;return 20072}function Qn(b){b=b|0;b=i;if((a[20128]|0)!=0){i=b;return 20112}if((Ga(20128)|0)==0){i=b;return 20112}Rg(20112,20136,vo(20136)|0);Dc(146,20112,p|0)|0;gb(20128);i=b;return 20112}function Rn(b){b=b|0;b=i;if((a[20192]|0)==0?(Ga(20192)|0)!=0:0){Gg(20176,20200,8);Dc(133,20176,p|0)|0;gb(20192)}i=b;return 20176}function Sn(b){b=b|0;b=i;if((a[20232]|0)!=0){i=b;return 20216}if((Ga(20232)|0)==0){i=b;return 20216}Rg(20216,20240,vo(20240)|0);Dc(146,20216,p|0)|0;gb(20232);i=b;return 20216}function Tn(b){b=b|0;b=i;if((a[20296]|0)==0?(Ga(20296)|0)!=0:0){Gg(20280,20304,20);Dc(133,20280,p|0)|0;gb(20296)}i=b;return 20280}function Un(b){b=b|0;b=i;if((a[20344]|0)!=0){i=b;return 20328}if((Ga(20344)|0)==0){i=b;return 20328}Rg(20328,20352,vo(20352)|0);Dc(146,20328,p|0)|0;gb(20344);i=b;return 20328}function Vn(b){b=b|0;b=i;if((a[20456]|0)==0?(Ga(20456)|0)!=0:0){Gg(20440,20464,11);Dc(133,20440,p|0)|0;gb(20456)}i=b;return 20440}function Wn(b){b=b|0;b=i;if((a[20496]|0)!=0){i=b;return 20480}if((Ga(20496)|0)==0){i=b;return 20480}Rg(20480,20504,vo(20504)|0);Dc(146,20480,p|0)|0;gb(20496);i=b;return 20480}function Xn(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0.0,j=0,k=0,l=0,m=0.0;f=i;i=i+16|0;g=f;if((b|0)==(d|0)){c[e>>2]=4;h=0.0;i=f;return+h}j=wc()|0;k=c[j>>2]|0;c[j>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){l=kb(2147483647,19576,0)|0;c[4890]=l;gb(19568)}m=+op(b,g,c[4890]|0);b=c[j>>2]|0;if((b|0)==0){c[j>>2]=k}if((c[g>>2]|0)!=(d|0)){c[e>>2]=4;h=0.0;i=f;return+h}if((b|0)!=34){h=m;i=f;return+h}c[e>>2]=4;h=m;i=f;return+h}function Yn(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0.0,j=0,k=0,l=0,m=0.0;f=i;i=i+16|0;g=f;if((b|0)==(d|0)){c[e>>2]=4;h=0.0;i=f;return+h}j=wc()|0;k=c[j>>2]|0;c[j>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){l=kb(2147483647,19576,0)|0;c[4890]=l;gb(19568)}m=+op(b,g,c[4890]|0);b=c[j>>2]|0;if((b|0)==0){c[j>>2]=k}if((c[g>>2]|0)!=(d|0)){c[e>>2]=4;h=0.0;i=f;return+h}if((b|0)!=34){h=m;i=f;return+h}c[e>>2]=4;h=m;i=f;return+h}function Zn(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0.0,j=0,k=0,l=0,m=0.0;f=i;i=i+16|0;g=f;if((b|0)==(d|0)){c[e>>2]=4;h=0.0;i=f;return+h}j=wc()|0;k=c[j>>2]|0;c[j>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){l=kb(2147483647,19576,0)|0;c[4890]=l;gb(19568)}m=+op(b,g,c[4890]|0);b=c[j>>2]|0;if((b|0)==0){c[j>>2]=k}if((c[g>>2]|0)!=(d|0)){c[e>>2]=4;h=0.0;i=f;return+h}if((b|0)==34){c[e>>2]=4}h=m;i=f;return+h}function _n(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;g=i;i=i+16|0;h=g;do{if((b|0)!=(d|0)){if((a[b]|0)==45){c[e>>2]=4;j=0;k=0;break}l=wc()|0;m=c[l>>2]|0;c[l>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){n=kb(2147483647,19576,0)|0;c[4890]=n;gb(19568)}n=vb(b|0,h|0,f|0,c[4890]|0)|0;o=c[l>>2]|0;if((o|0)==0){c[l>>2]=m}if((c[h>>2]|0)!=(d|0)){c[e>>2]=4;j=0;k=0;break}if((o|0)==34){c[e>>2]=4;j=-1;k=-1}else{j=I;k=n}}else{c[e>>2]=4;j=0;k=0}}while(0);I=j;i=g;return k|0}function $n(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;g=i;i=i+16|0;h=g;if((b|0)==(d|0)){c[e>>2]=4;j=0;i=g;return j|0}if((a[b]|0)==45){c[e>>2]=4;j=0;i=g;return j|0}k=wc()|0;l=c[k>>2]|0;c[k>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){m=kb(2147483647,19576,0)|0;c[4890]=m;gb(19568)}m=vb(b|0,h|0,f|0,c[4890]|0)|0;f=I;b=c[k>>2]|0;if((b|0)==0){c[k>>2]=l}if((c[h>>2]|0)!=(d|0)){c[e>>2]=4;j=0;i=g;return j|0}if((b|0)==34|(f>>>0>0|(f|0)==0&m>>>0>4294967295)){c[e>>2]=4;j=-1;i=g;return j|0}else{j=m;i=g;return j|0}return 0}function ao(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;g=i;i=i+16|0;h=g;if((b|0)==(d|0)){c[e>>2]=4;j=0;i=g;return j|0}if((a[b]|0)==45){c[e>>2]=4;j=0;i=g;return j|0}k=wc()|0;l=c[k>>2]|0;c[k>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){m=kb(2147483647,19576,0)|0;c[4890]=m;gb(19568)}m=vb(b|0,h|0,f|0,c[4890]|0)|0;f=I;b=c[k>>2]|0;if((b|0)==0){c[k>>2]=l}if((c[h>>2]|0)!=(d|0)){c[e>>2]=4;j=0;i=g;return j|0}if((b|0)==34|(f>>>0>0|(f|0)==0&m>>>0>4294967295)){c[e>>2]=4;j=-1;i=g;return j|0}else{j=m;i=g;return j|0}return 0}function bo(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;g=i;i=i+16|0;h=g;if((b|0)==(d|0)){c[e>>2]=4;j=0;i=g;return j|0}if((a[b]|0)==45){c[e>>2]=4;j=0;i=g;return j|0}k=wc()|0;l=c[k>>2]|0;c[k>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){m=kb(2147483647,19576,0)|0;c[4890]=m;gb(19568)}m=vb(b|0,h|0,f|0,c[4890]|0)|0;f=I;b=c[k>>2]|0;if((b|0)==0){c[k>>2]=l}if((c[h>>2]|0)!=(d|0)){c[e>>2]=4;j=0;i=g;return j|0}if((b|0)==34|(f>>>0>0|(f|0)==0&m>>>0>65535)){c[e>>2]=4;j=-1;i=g;return j|0}else{j=m&65535;i=g;return j|0}return 0}function co(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;i=i+16|0;h=g;if((b|0)==(d|0)){c[e>>2]=4;j=0;k=0;I=j;i=g;return k|0}l=wc()|0;m=c[l>>2]|0;c[l>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){n=kb(2147483647,19576,0)|0;c[4890]=n;gb(19568)}n=mc(b|0,h|0,f|0,c[4890]|0)|0;f=I;b=c[l>>2]|0;if((b|0)==0){c[l>>2]=m}if((c[h>>2]|0)!=(d|0)){c[e>>2]=4;j=0;k=0;I=j;i=g;return k|0}if((b|0)==34){c[e>>2]=4;e=(f|0)>0|(f|0)==0&n>>>0>0;I=e?2147483647:-2147483648;i=g;return(e?-1:0)|0}else{j=f;k=n;I=j;i=g;return k|0}return 0}function eo(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;g=i;i=i+16|0;h=g;if((b|0)==(d|0)){c[e>>2]=4;j=0;i=g;return j|0}k=wc()|0;l=c[k>>2]|0;c[k>>2]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){m=kb(2147483647,19576,0)|0;c[4890]=m;gb(19568)}m=mc(b|0,h|0,f|0,c[4890]|0)|0;f=I;b=c[k>>2]|0;if((b|0)==0){c[k>>2]=l}if((c[h>>2]|0)!=(d|0)){c[e>>2]=4;j=0;i=g;return j|0}do{if((b|0)==34){c[e>>2]=4;if((f|0)>0|(f|0)==0&m>>>0>0){j=2147483647;i=g;return j|0}}else{if((f|0)<-1|(f|0)==-1&m>>>0<2147483648){c[e>>2]=4;break}if((f|0)>0|(f|0)==0&m>>>0>2147483647){c[e>>2]=4;j=2147483647;i=g;return j|0}else{j=m;i=g;return j|0}}}while(0);j=-2147483648;i=g;return j|0}function fo(a){a=a|0;var b=0,e=0,f=0,g=0,h=0;b=i;e=a+4|0;f=d[e]|d[e+1|0]<<8|d[e+2|0]<<16|d[e+3|0]<<24;g=e+4|0;e=d[g]|d[g+1|0]<<8|d[g+2|0]<<16|d[g+3|0]<<24;g=(c[a>>2]|0)+(e>>1)|0;if((e&1|0)==0){h=f;Jc[h&255](g);i=b;return}else{h=c[(c[g>>2]|0)+f>>2]|0;Jc[h&255](g);i=b;return}}function go(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;e=i;f=b+8|0;g=b+4|0;h=c[g>>2]|0;j=c[f>>2]|0;k=h;if(!(j-k>>2>>>0<d>>>0)){l=d;m=h;do{if((m|0)==0){n=0}else{c[m>>2]=0;n=c[g>>2]|0}m=n+4|0;c[g>>2]=m;l=l+ -1|0}while((l|0)!=0);i=e;return}l=b+16|0;m=c[b>>2]|0;n=k-m>>2;k=n+d|0;if(k>>>0>1073741823){_l(0)}h=j-m|0;if(h>>2>>>0<536870911){m=h>>1;h=m>>>0<k>>>0?k:m;if((h|0)!=0){m=b+128|0;if((a[m]|0)==0&h>>>0<29){a[m]=1;o=h;p=l}else{q=h;r=11}}else{o=0;p=0}}else{q=1073741823;r=11}if((r|0)==11){o=q;p=_o(q<<2)|0}q=d;d=p+(n<<2)|0;do{if((d|0)==0){s=0}else{c[d>>2]=0;s=d}d=s+4|0;q=q+ -1|0}while((q|0)!=0);q=c[b>>2]|0;s=(c[g>>2]|0)-q|0;r=p+(n-(s>>2)<<2)|0;tp(r|0,q|0,s|0)|0;c[b>>2]=r;c[g>>2]=d;c[f>>2]=p+(o<<2);if((q|0)==0){i=e;return}if((l|0)==(q|0)){a[b+128|0]=0;i=e;return}else{ap(q);i=e;return}}function ho(a){a=a|0;a=i;Tg(24764|0);Tg(24752|0);Tg(24740|0);Tg(24728|0);Tg(24716|0);Tg(24704|0);Tg(24692|0);Tg(24680|0);Tg(24668|0);Tg(24656|0);Tg(24644|0);Tg(24632|0);Tg(24620|0);Tg(24608|0);Tg(24596|0);Tg(24584|0);Tg(24572|0);Tg(24560|0);Tg(24548|0);Tg(24536|0);Tg(24524|0);Tg(24512|0);Tg(24500|0);Tg(24488);i=a;return}function io(a){a=a|0;a=i;Ig(25092|0);Ig(25080|0);Ig(25068|0);Ig(25056|0);Ig(25044|0);Ig(25032|0);Ig(25020|0);Ig(25008|0);Ig(24996|0);Ig(24984|0);Ig(24972|0);Ig(24960|0);Ig(24948|0);Ig(24936|0);Ig(24924|0);Ig(24912|0);Ig(24900|0);Ig(24888|0);Ig(24876|0);Ig(24864|0);Ig(24852|0);Ig(24840|0);Ig(24828|0);Ig(24816);i=a;return}function jo(a){a=a|0;a=i;Tg(25404|0);Tg(25392|0);Tg(25380|0);Tg(25368|0);Tg(25356|0);Tg(25344|0);Tg(25332|0);Tg(25320|0);Tg(25308|0);Tg(25296|0);Tg(25284|0);Tg(25272|0);Tg(25260|0);Tg(25248|0);Tg(25236|0);Tg(25224|0);Tg(25212|0);Tg(25200|0);Tg(25188|0);Tg(25176|0);Tg(25164|0);Tg(25152|0);Tg(25140|0);Tg(25128);i=a;return}function ko(a){a=a|0;a=i;Ig(26244|0);Ig(26232|0);Ig(26220|0);Ig(26208|0);Ig(26196|0);Ig(26184|0);Ig(26172|0);Ig(26160|0);Ig(26148|0);Ig(26136|0);Ig(26124|0);Ig(26112|0);Ig(26100|0);Ig(26088|0);Ig(26076|0);Ig(26064|0);Ig(26052|0);Ig(26040|0);Ig(26028|0);Ig(26016|0);Ig(26004|0);Ig(25992|0);Ig(25980|0);Ig(25968);i=a;return}function lo(a){a=a|0;a=i;Tg(26636|0);Tg(26624|0);Tg(26612|0);Tg(26600|0);Tg(26588|0);Tg(26576|0);Tg(26564|0);Tg(26552|0);Tg(26540|0);Tg(26528|0);Tg(26516|0);Tg(26504|0);Tg(26492|0);Tg(26480);i=a;return}function mo(a){a=a|0;a=i;Ig(27172|0);Ig(27160|0);Ig(27148|0);Ig(27136|0);Ig(27124|0);Ig(27112|0);Ig(27100|0);Ig(27088|0);Ig(27076|0);Ig(27064|0);Ig(27052|0);Ig(27040|0);Ig(27028|0);Ig(27016);i=a;return}function no(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=i;e=oo(0,a,b,(c|0)!=0?c:27536)|0;i=d;return e|0}function oo(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;i=i+16|0;h=g;c[h>>2]=b;j=(f|0)==0?27544:f;f=c[j>>2]|0;a:do{if((d|0)==0){if((f|0)==0){k=0;i=g;return k|0}}else{if((b|0)==0){c[h>>2]=h;l=h}else{l=b}if((e|0)==0){k=-2;i=g;return k|0}do{if((f|0)==0){m=a[d]|0;n=m&255;if(m<<24>>24>-1){c[l>>2]=n;k=m<<24>>24!=0|0;i=g;return k|0}else{m=n+ -194|0;if(m>>>0>50){break a}o=e+ -1|0;p=c[27328+(m<<2)>>2]|0;q=d+1|0;break}}else{o=e;p=f;q=d}}while(0);b:do{if((o|0)==0){r=p}else{m=a[q]|0;n=(m&255)>>>3;if((n+ -16|n+(p>>26))>>>0>7){break a}else{s=o;t=m;u=p;v=q}while(1){v=v+1|0;u=(t&255)+ -128|u<<6;s=s+ -1|0;if((u|0)>=0){break}if((s|0)==0){r=u;break b}t=a[v]|0;if(((t&255)+ -128|0)>>>0>63){break a}}c[j>>2]=0;c[l>>2]=u;k=e-s|0;i=g;return k|0}}while(0);c[j>>2]=r;k=-2;i=g;return k|0}}while(0);c[j>>2]=0;j=wc()|0;c[j>>2]=84;k=-1;i=g;return k|0}function po(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;g=i;i=i+1040|0;h=g+8|0;j=g;k=c[b>>2]|0;c[j>>2]=k;l=(a|0)!=0;m=l?e:256;e=l?a:h;a:do{if((k|0)==0|(m|0)==0){n=d;o=m;p=k;q=0;r=e}else{a=d;s=m;t=k;u=0;v=e;while(1){w=a>>>2;x=w>>>0>=s>>>0;if(!(x|a>>>0>131)){n=a;o=s;p=t;q=u;r=v;break a}y=x?s:w;z=a-y|0;w=qo(v,j,y,f)|0;if((w|0)==-1){break}if((v|0)==(h|0)){A=s;B=h}else{A=s-w|0;B=v+(w<<2)|0}y=w+u|0;w=c[j>>2]|0;if((w|0)==0|(A|0)==0){n=z;o=A;p=w;q=y;r=B;break a}else{a=z;s=A;t=w;u=y;v=B}}n=z;o=0;p=c[j>>2]|0;q=-1;r=v}}while(0);b:do{if((p|0)!=0?!((o|0)==0|(n|0)==0):0){z=n;B=o;A=p;h=q;e=r;while(1){C=oo(e,A,z,f)|0;if((C+2|0)>>>0<3){break}k=(c[j>>2]|0)+C|0;c[j>>2]=k;m=B+ -1|0;d=h+1|0;if((m|0)==0|(z|0)==(C|0)){D=d;break b}else{z=z-C|0;B=m;A=k;h=d;e=e+4|0}}if((C|0)==-1){D=-1;break}else if((C|0)==0){c[j>>2]=0;D=h;break}else{c[f>>2]=0;D=h;break}}else{D=q}}while(0);if(!l){i=g;return D|0}c[b>>2]=c[j>>2];i=g;return D|0}function qo(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0;h=i;j=c[e>>2]|0;if((g|0)!=0?(k=c[g>>2]|0,(k|0)!=0):0){if((b|0)==0){l=f;m=k;n=j;o=16}else{c[g>>2]=0;p=b;q=f;r=k;s=j;o=36}}else{if((b|0)==0){t=f;u=j;o=7}else{v=b;w=f;x=j;o=6}}a:while(1){if((o|0)==6){o=0;if((w|0)==0){y=f;o=53;break}else{z=v;A=w;B=x}while(1){j=a[B]|0;do{if(((j&255)+ -1|0)>>>0<127?(B&3|0)==0&A>>>0>3:0){k=z;g=A;C=B;while(1){D=c[C>>2]|0;if(((D+ -16843009|D)&-2139062144|0)!=0){o=30;break}c[k>>2]=D&255;c[k+4>>2]=d[C+1|0]|0;c[k+8>>2]=d[C+2|0]|0;E=C+4|0;F=k+16|0;c[k+12>>2]=d[C+3|0]|0;G=g+ -4|0;if(G>>>0>3){k=F;g=G;C=E}else{o=31;break}}if((o|0)==30){o=0;H=k;I=g;J=D&255;K=C;break}else if((o|0)==31){o=0;H=F;I=G;J=a[E]|0;K=E;break}}else{H=z;I=A;J=j;K=B}}while(0);L=J&255;if(!((L+ -1|0)>>>0<127)){break}c[H>>2]=L;j=I+ -1|0;if((j|0)==0){y=f;o=53;break a}else{z=H+4|0;A=j;B=K+1|0}}j=L+ -194|0;if(j>>>0>50){M=H;N=I;O=K;o=47;break}p=H;q=I;r=c[27328+(j<<2)>>2]|0;s=K+1|0;o=36;continue}else if((o|0)==7){o=0;j=a[u]|0;if(((j&255)+ -1|0)>>>0<127?(u&3|0)==0:0){P=c[u>>2]|0;if(((P+ -16843009|P)&-2139062144|0)==0){Q=t;R=u;while(1){S=R+4|0;T=Q+ -4|0;U=c[S>>2]|0;if(((U+ -16843009|U)&-2139062144|0)==0){Q=T;R=S}else{V=T;W=U;X=S;break}}}else{V=t;W=P;X=u}Y=V;Z=W&255;_=X}else{Y=t;Z=j;_=u}R=Z&255;if((R+ -1|0)>>>0<127){t=Y+ -1|0;u=_+1|0;o=7;continue}Q=R+ -194|0;if(Q>>>0>50){M=b;N=Y;O=_;o=47;break}l=Y;m=c[27328+(Q<<2)>>2]|0;n=_+1|0;o=16;continue}else if((o|0)==16){o=0;Q=(d[n]|0)>>>3;if((Q+ -16|Q+(m>>26))>>>0>7){o=17;break}Q=n+1|0;if((m&33554432|0)!=0){if(((d[Q]|0)+ -128|0)>>>0>63){o=20;break}R=n+2|0;if((m&524288|0)==0){$=R}else{if(((d[R]|0)+ -128|0)>>>0>63){o=23;break}$=n+3|0}}else{$=Q}t=l+ -1|0;u=$;o=7;continue}else if((o|0)==36){o=0;Q=d[s]|0;R=Q>>>3;if((R+ -16|R+(r>>26))>>>0>7){o=37;break}R=s+1|0;aa=Q+ -128|r<<6;if((aa|0)<0){Q=(d[R]|0)+ -128|0;if(Q>>>0>63){o=40;break}S=s+2|0;ba=Q|aa<<6;if((ba|0)<0){Q=(d[S]|0)+ -128|0;if(Q>>>0>63){o=43;break}ca=Q|ba<<6;da=s+3|0}else{ca=ba;da=S}}else{ca=aa;da=R}c[p>>2]=ca;v=p+4|0;w=q+ -1|0;x=da;o=6;continue}}if((o|0)==17){ea=b;fa=l;ga=m;ha=n+ -1|0;o=46}else if((o|0)==20){ea=b;fa=l;ga=m;ha=n+ -1|0;o=46}else if((o|0)==23){ea=b;fa=l;ga=m;ha=n+ -1|0;o=46}else if((o|0)==37){ea=p;fa=q;ga=r;ha=s+ -1|0;o=46}else if((o|0)==40){ea=p;fa=q;ga=aa;ha=s+ -1|0;o=46}else if((o|0)==43){ea=p;fa=q;ga=ba;ha=s+ -1|0;o=46}else if((o|0)==53){i=h;return y|0}if((o|0)==46){if((ga|0)==0){M=ea;N=fa;O=ha;o=47}else{ia=ea;ja=ha}}if((o|0)==47){if((a[O]|0)==0){if((M|0)!=0){c[M>>2]=0;c[e>>2]=0}y=f-N|0;i=h;return y|0}else{ia=M;ja=O}}O=wc()|0;c[O>>2]=84;if((ia|0)==0){y=-1;i=h;return y|0}c[e>>2]=ja;y=-1;i=h;return y|0}function ro(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;i=i+16|0;h=g;c[h>>2]=b;if((e|0)==0){j=0;i=g;return j|0}do{if((f|0)!=0){if((b|0)==0){c[h>>2]=h;k=h}else{k=b}l=a[e]|0;m=l&255;if(l<<24>>24>-1){c[k>>2]=m;j=l<<24>>24!=0|0;i=g;return j|0}l=m+ -194|0;if(!(l>>>0>50)){m=e+1|0;n=c[27328+(l<<2)>>2]|0;if(f>>>0<4?(n&-2147483648>>>((f*6|0)+ -6|0)|0)!=0:0){break}l=d[m]|0;m=l>>>3;if(!((m+ -16|m+(n>>26))>>>0>7)){m=l+ -128|n<<6;if((m|0)>=0){c[k>>2]=m;j=2;i=g;return j|0}n=(d[e+2|0]|0)+ -128|0;if(!(n>>>0>63)){l=n|m<<6;if((l|0)>=0){c[k>>2]=l;j=3;i=g;return j|0}m=(d[e+3|0]|0)+ -128|0;if(!(m>>>0>63)){c[k>>2]=m|l<<6;j=4;i=g;return j|0}}}}}}while(0);k=wc()|0;c[k>>2]=84;j=-1;i=g;return j|0}function so(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;e=i;if((b|0)==0){f=1;i=e;return f|0}if(d>>>0<128){a[b]=d;f=1;i=e;return f|0}if(d>>>0<2048){a[b]=d>>>6|192;a[b+1|0]=d&63|128;f=2;i=e;return f|0}if(d>>>0<55296|(d+ -57344|0)>>>0<8192){a[b]=d>>>12|224;a[b+1|0]=d>>>6&63|128;a[b+2|0]=d&63|128;f=3;i=e;return f|0}if((d+ -65536|0)>>>0<1048576){a[b]=d>>>18|240;a[b+1|0]=d>>>12&63|128;a[b+2|0]=d>>>6&63|128;a[b+3|0]=d&63|128;f=4;i=e;return f|0}else{d=wc()|0;c[d>>2]=84;f=-1;i=e;return f|0}return 0}function to(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=i;i=i+272|0;g=f+8|0;h=f;j=c[b>>2]|0;c[h>>2]=j;k=(a|0)!=0;l=k?e:256;e=k?a:g;a:do{if((j|0)==0|(l|0)==0){m=d;n=l;o=j;p=0;q=e}else{a=d;r=l;s=j;t=0;u=e;while(1){v=a>>>0>=r>>>0;if(!(v|a>>>0>32)){m=a;n=r;o=s;p=t;q=u;break a}w=v?r:a;x=a-w|0;v=uo(u,h,w,0)|0;if((v|0)==-1){break}if((u|0)==(g|0)){y=r;z=g}else{y=r-v|0;z=u+v|0}w=v+t|0;v=c[h>>2]|0;if((v|0)==0|(y|0)==0){m=x;n=y;o=v;p=w;q=z;break a}else{a=x;r=y;s=v;t=w;u=z}}m=x;n=0;o=c[h>>2]|0;p=-1;q=u}}while(0);b:do{if((o|0)!=0?!((n|0)==0|(m|0)==0):0){x=m;z=n;y=o;g=p;e=q;while(1){A=so(e,c[y>>2]|0,0)|0;if((A+1|0)>>>0<2){break}j=(c[h>>2]|0)+4|0;c[h>>2]=j;l=x+ -1|0;d=g+1|0;if((z|0)==(A|0)|(l|0)==0){B=d;break b}else{x=l;z=z-A|0;y=j;g=d;e=e+A|0}}if((A|0)==0){c[h>>2]=0;B=g}else{B=-1}}else{B=p}}while(0);if(!k){i=f;return B|0}c[b>>2]=c[h>>2];i=f;return B|0}function uo(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;f=i;i=i+16|0;g=f;if((b|0)==0){h=c[d>>2]|0;j=c[h>>2]|0;if((j|0)==0){k=0;i=f;return k|0}else{l=0;m=j;n=h}while(1){if(m>>>0>127){h=so(g,m,0)|0;if((h|0)==-1){k=-1;o=26;break}else{p=h}}else{p=1}h=p+l|0;j=n+4|0;q=c[j>>2]|0;if((q|0)==0){k=h;o=26;break}else{l=h;m=q;n=j}}if((o|0)==26){i=f;return k|0}}a:do{if(e>>>0>3){n=b;m=e;l=c[d>>2]|0;while(1){p=c[l>>2]|0;if((p|0)==0){r=n;s=m;break a}if(p>>>0>127){j=so(n,p,0)|0;if((j|0)==-1){k=-1;break}t=n+j|0;u=m-j|0;v=l}else{a[n]=p;t=n+1|0;u=m+ -1|0;v=c[d>>2]|0}p=v+4|0;c[d>>2]=p;if(u>>>0>3){n=t;m=u;l=p}else{r=t;s=u;break a}}i=f;return k|0}else{r=b;s=e}}while(0);b:do{if((s|0)!=0){b=r;u=s;t=c[d>>2]|0;while(1){v=c[t>>2]|0;if((v|0)==0){o=24;break}if(v>>>0>127){l=so(g,v,0)|0;if((l|0)==-1){k=-1;o=26;break}if(l>>>0>u>>>0){o=20;break}so(b,c[t>>2]|0,0)|0;w=b+l|0;x=u-l|0;y=t}else{a[b]=v;w=b+1|0;x=u+ -1|0;y=c[d>>2]|0}v=y+4|0;c[d>>2]=v;if((x|0)==0){z=0;break b}else{b=w;u=x;t=v}}if((o|0)==20){k=e-u|0;i=f;return k|0}else if((o|0)==24){a[b]=0;z=u;break}else if((o|0)==26){i=f;return k|0}}else{z=0}}while(0);c[d>>2]=0;k=e-z|0;i=f;return k|0}function vo(a){a=a|0;var b=0,d=0;b=i;d=a;while(1){if((c[d>>2]|0)==0){break}else{d=d+4|0}}i=b;return d-a>>2|0}function wo(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;if((d|0)==0){i=e;return a|0}else{f=d;g=b;h=a}while(1){f=f+ -1|0;c[h>>2]=c[g>>2];if((f|0)==0){break}else{g=g+4|0;h=h+4|0}}i=e;return a|0}function xo(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;f=(d|0)==0;if(a-b>>2>>>0<d>>>0){if(!f){g=d;do{g=g+ -1|0;c[a+(g<<2)>>2]=c[b+(g<<2)>>2]}while((g|0)!=0)}}else{if(!f){f=b;b=a;g=d;while(1){g=g+ -1|0;c[b>>2]=c[f>>2];if((g|0)==0){break}else{f=f+4|0;b=b+4|0}}}}i=e;return a|0}function yo(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;if((d|0)!=0){f=d;d=a;while(1){f=f+ -1|0;c[d>>2]=b;if((f|0)==0){break}else{d=d+4|0}}}i=e;return a|0}function zo(a){a=a|0;return}function Ao(a){a=a|0;c[a>>2]=27560;return}function Bo(a){a=a|0;var b=0;b=i;Ya(a|0);ap(a);i=b;return}function Co(a){a=a|0;var b=0;b=i;Ya(a|0);i=b;return}function Do(a){a=a|0;return 27576}function Eo(a){a=a|0;return}function Fo(a){a=a|0;return}function Go(a){a=a|0;return}function Ho(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Io(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Jo(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Ko(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;i=i+64|0;f=e;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=Oo(b,27688,27744,0)|0;if((h|0)==0){g=0;i=e;return g|0}b=f+0|0;j=b+56|0;do{c[b>>2]=0;b=b+4|0}while((b|0)<(j|0));c[f>>2]=h;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;Yc[c[(c[h>>2]|0)+28>>2]&7](h,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2];g=1;i=e;return g|0}function Lo(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=i;if((c[d+8>>2]|0)!=(b|0)){i=g;return}b=d+16|0;h=c[b>>2]|0;if((h|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;i=g;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;i=g;return}e=d+24|0;if((c[e>>2]|0)!=2){i=g;return}c[e>>2]=f;i=g;return}function Mo(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=i;if((b|0)!=(c[d+8>>2]|0)){h=c[b+8>>2]|0;Yc[c[(c[h>>2]|0)+28>>2]&7](h,d,e,f);i=g;return}h=d+16|0;b=c[h>>2]|0;if((b|0)==0){c[h>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;i=g;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;i=g;return}e=d+24|0;if((c[e>>2]|0)!=2){i=g;return}c[e>>2]=f;i=g;return}function No(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;g=i;if((b|0)==(c[d+8>>2]|0)){h=d+16|0;j=c[h>>2]|0;if((j|0)==0){c[h>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;i=g;return}if((j|0)!=(e|0)){j=d+36|0;c[j>>2]=(c[j>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;i=g;return}j=d+24|0;if((c[j>>2]|0)!=2){i=g;return}c[j>>2]=f;i=g;return}j=c[b+12>>2]|0;h=b+(j<<3)+16|0;k=c[b+20>>2]|0;l=k>>8;if((k&1|0)==0){m=l}else{m=c[(c[e>>2]|0)+l>>2]|0}l=c[b+16>>2]|0;Yc[c[(c[l>>2]|0)+28>>2]&7](l,d,e+m|0,(k&2|0)!=0?f:2);if((j|0)<=1){i=g;return}j=d+54|0;k=b+24|0;while(1){b=c[k+4>>2]|0;m=b>>8;if((b&1|0)==0){n=m}else{n=c[(c[e>>2]|0)+m>>2]|0}m=c[k>>2]|0;Yc[c[(c[m>>2]|0)+28>>2]&7](m,d,e+n|0,(b&2|0)!=0?f:2);if((a[j]|0)!=0){o=16;break}b=k+8|0;if(b>>>0<h>>>0){k=b}else{o=16;break}}if((o|0)==16){i=g;return}}function Oo(d,e,f,g){d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;h=i;i=i+64|0;j=h;k=c[d>>2]|0;l=d+(c[k+ -8>>2]|0)|0;m=c[k+ -4>>2]|0;c[j>>2]=f;c[j+4>>2]=d;c[j+8>>2]=e;c[j+12>>2]=g;g=j+16|0;e=j+20|0;d=j+24|0;k=j+28|0;n=j+32|0;o=j+40|0;p=(m|0)==(f|0);f=g+0|0;q=f+36|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(q|0));b[g+36>>1]=0;a[g+38|0]=0;if(p){c[j+48>>2]=1;Vc[c[(c[m>>2]|0)+20>>2]&15](m,j,l,l,1,0);r=(c[d>>2]|0)==1?l:0;i=h;return r|0}Ic[c[(c[m>>2]|0)+24>>2]&3](m,j,l,1,0);l=c[j+36>>2]|0;if((l|0)==0){if((c[o>>2]|0)!=1){r=0;i=h;return r|0}if((c[k>>2]|0)!=1){r=0;i=h;return r|0}r=(c[n>>2]|0)==1?c[e>>2]|0:0;i=h;return r|0}else if((l|0)==1){if((c[d>>2]|0)!=1){if((c[o>>2]|0)!=0){r=0;i=h;return r|0}if((c[k>>2]|0)!=1){r=0;i=h;return r|0}if((c[n>>2]|0)!=1){r=0;i=h;return r|0}}r=c[g>>2]|0;i=h;return r|0}else{r=0;i=h;return r|0}return 0}function Po(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;h=i;if((b|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){i=h;return}j=d+28|0;if((c[j>>2]|0)==1){i=h;return}c[j>>2]=f;i=h;return}if((b|0)==(c[d>>2]|0)){if((c[d+16>>2]|0)!=(e|0)?(j=d+20|0,(c[j>>2]|0)!=(e|0)):0){c[d+32>>2]=f;k=d+44|0;if((c[k>>2]|0)==4){i=h;return}l=c[b+12>>2]|0;m=b+(l<<3)+16|0;a:do{if((l|0)>0){n=d+52|0;o=d+53|0;p=d+54|0;q=b+8|0;r=d+24|0;s=0;t=0;u=b+16|0;b:while(1){a[n]=0;a[o]=0;v=c[u+4>>2]|0;w=v>>8;if((v&1|0)==0){x=w}else{x=c[(c[e>>2]|0)+w>>2]|0}w=c[u>>2]|0;Vc[c[(c[w>>2]|0)+20>>2]&15](w,d,e,e+x|0,2-(v>>>1&1)|0,g);if((a[p]|0)!=0){y=s;z=t;break}do{if((a[o]|0)!=0){if((a[n]|0)==0){if((c[q>>2]&1|0)==0){y=s;z=1;break b}else{A=s;B=1;break}}if((c[r>>2]|0)==1){C=27;break a}if((c[q>>2]&2|0)==0){C=27;break a}else{A=1;B=1}}else{A=s;B=t}}while(0);v=u+8|0;if(v>>>0<m>>>0){s=A;t=B;u=v}else{y=A;z=B;break}}if(y){D=z;C=26}else{E=z;C=23}}else{E=0;C=23}}while(0);if((C|0)==23){c[j>>2]=e;j=d+40|0;c[j>>2]=(c[j>>2]|0)+1;if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0){a[d+54|0]=1;if(E){C=27}else{C=28}}else{D=E;C=26}}if((C|0)==26){if(D){C=27}else{C=28}}if((C|0)==27){c[k>>2]=3;i=h;return}else if((C|0)==28){c[k>>2]=4;i=h;return}}if((f|0)!=1){i=h;return}c[d+32>>2]=1;i=h;return}k=c[b+12>>2]|0;D=b+(k<<3)+16|0;E=c[b+20>>2]|0;j=E>>8;if((E&1|0)==0){F=j}else{F=c[(c[e>>2]|0)+j>>2]|0}j=c[b+16>>2]|0;Ic[c[(c[j>>2]|0)+24>>2]&3](j,d,e+F|0,(E&2|0)!=0?f:2,g);E=b+24|0;if((k|0)<=1){i=h;return}k=c[b+8>>2]|0;if((k&2|0)==0?(b=d+36|0,(c[b>>2]|0)!=1):0){if((k&1|0)==0){k=d+54|0;F=E;while(1){if((a[k]|0)!=0){C=53;break}if((c[b>>2]|0)==1){C=53;break}j=c[F+4>>2]|0;z=j>>8;if((j&1|0)==0){G=z}else{G=c[(c[e>>2]|0)+z>>2]|0}z=c[F>>2]|0;Ic[c[(c[z>>2]|0)+24>>2]&3](z,d,e+G|0,(j&2|0)!=0?f:2,g);j=F+8|0;if(j>>>0<D>>>0){F=j}else{C=53;break}}if((C|0)==53){i=h;return}}F=d+24|0;G=d+54|0;k=E;while(1){if((a[G]|0)!=0){C=53;break}if((c[b>>2]|0)==1?(c[F>>2]|0)==1:0){C=53;break}j=c[k+4>>2]|0;z=j>>8;if((j&1|0)==0){H=z}else{H=c[(c[e>>2]|0)+z>>2]|0}z=c[k>>2]|0;Ic[c[(c[z>>2]|0)+24>>2]&3](z,d,e+H|0,(j&2|0)!=0?f:2,g);j=k+8|0;if(j>>>0<D>>>0){k=j}else{C=53;break}}if((C|0)==53){i=h;return}}k=d+54|0;H=E;while(1){if((a[k]|0)!=0){C=53;break}E=c[H+4>>2]|0;F=E>>8;if((E&1|0)==0){I=F}else{I=c[(c[e>>2]|0)+F>>2]|0}F=c[H>>2]|0;Ic[c[(c[F>>2]|0)+24>>2]&3](F,d,e+I|0,(E&2|0)!=0?f:2,g);E=H+8|0;if(E>>>0<D>>>0){H=E}else{C=53;break}}if((C|0)==53){i=h;return}}



function ui(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];vi(a,0,k,j,f,g,h);i=b;return}function vi(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;e=i;i=i+224|0;l=e+198|0;m=e+196|0;n=e+184|0;o=e+172|0;p=e+168|0;q=e+8|0;r=e+4|0;s=e;t=c[h+4>>2]&74;if((t|0)==8){u=16}else if((t|0)==0){u=0}else if((t|0)==64){u=8}else{u=10}jj(n,h,l,m);c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){h=o+1|0;v=h;w=o+8|0;x=h}else{h=o+8|0;v=o+1|0;w=h;x=c[h>>2]|0}c[p>>2]=x;c[r>>2]=q;c[s>>2]=0;h=o+4|0;t=a[m]|0;m=c[f>>2]|0;y=x;a:while(1){if((m|0)!=0){if((c[m+12>>2]|0)==(c[m+16>>2]|0)?(Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0)==-1:0){c[f>>2]=0;z=0}else{z=m}}else{z=0}x=(z|0)==0;A=c[g>>2]|0;do{if((A|0)!=0){if((c[A+12>>2]|0)!=(c[A+16>>2]|0)){if(x){B=A;break}else{C=A;D=y;break a}}if(!((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1)){if(x){B=A;break}else{C=A;D=y;break a}}else{c[g>>2]=0;E=18;break}}else{E=18}}while(0);if((E|0)==18){E=0;if(x){C=0;D=y;break}else{B=0}}A=a[o]|0;F=(A&1)==0;if(F){G=(A&255)>>>1}else{G=c[h>>2]|0}if(((c[p>>2]|0)-y|0)==(G|0)){if(F){H=(A&255)>>>1;J=(A&255)>>>1}else{A=c[h>>2]|0;H=A;J=A}Kg(o,H<<1,0);if((a[o]&1)==0){K=10}else{K=(c[o>>2]&-2)+ -1|0}Kg(o,K,0);if((a[o]&1)==0){L=v}else{L=c[w>>2]|0}c[p>>2]=L+J;M=L}else{M=y}A=z+12|0;F=c[A>>2]|0;N=z+16|0;if((F|0)==(c[N>>2]|0)){O=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{O=d[F]|0}if((Li(O&255,u,M,p,s,t,n,q,r,l)|0)!=0){C=B;D=M;break}F=c[A>>2]|0;if((F|0)==(c[N>>2]|0)){Nc[c[(c[z>>2]|0)+40>>2]&127](z)|0;m=z;y=M;continue}else{c[A>>2]=F+1;m=z;y=M;continue}}M=a[n]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[n+4>>2]|0}if((P|0)!=0?(P=c[r>>2]|0,(P-q|0)<160):0){M=c[s>>2]|0;c[r>>2]=P+4;c[P>>2]=M}M=co(D,c[p>>2]|0,j,u)|0;u=k;c[u>>2]=M;c[u+4>>2]=I;vl(n,q,c[r>>2]|0,j);if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[f>>2]=0;Q=0}else{Q=z}}else{Q=0}z=(Q|0)==0;do{if((C|0)!=0){if((c[C+12>>2]|0)!=(c[C+16>>2]|0)){if(!z){break}c[b>>2]=Q;Ig(o);Ig(n);i=e;return}if((Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1){c[g>>2]=0;E=54;break}if(z^(C|0)==0){c[b>>2]=Q;Ig(o);Ig(n);i=e;return}}else{E=54}}while(0);if((E|0)==54?!z:0){c[b>>2]=Q;Ig(o);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[b>>2]=Q;Ig(o);Ig(n);i=e;return}function wi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];xi(a,0,k,j,f,g,h);i=b;return}function xi(e,f,g,h,j,k,l){e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;f=i;i=i+224|0;m=f+198|0;n=f+196|0;o=f+184|0;p=f+172|0;q=f+168|0;r=f+8|0;s=f+4|0;t=f;u=c[j+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==8){v=16}else if((u|0)==0){v=0}else{v=10}jj(o,j,m,n);c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;Kg(p,10,0);if((a[p]&1)==0){j=p+1|0;w=j;x=p+8|0;y=j}else{j=p+8|0;w=p+1|0;x=j;y=c[j>>2]|0}c[q>>2]=y;c[s>>2]=r;c[t>>2]=0;j=p+4|0;u=a[n]|0;n=c[g>>2]|0;z=y;a:while(1){if((n|0)!=0){if((c[n+12>>2]|0)==(c[n+16>>2]|0)?(Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0)==-1:0){c[g>>2]=0;A=0}else{A=n}}else{A=0}y=(A|0)==0;B=c[h>>2]|0;do{if((B|0)!=0){if((c[B+12>>2]|0)!=(c[B+16>>2]|0)){if(y){C=B;break}else{D=B;E=z;break a}}if(!((Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0)==-1)){if(y){C=B;break}else{D=B;E=z;break a}}else{c[h>>2]=0;F=18;break}}else{F=18}}while(0);if((F|0)==18){F=0;if(y){D=0;E=z;break}else{C=0}}B=a[p]|0;G=(B&1)==0;if(G){H=(B&255)>>>1}else{H=c[j>>2]|0}if(((c[q>>2]|0)-z|0)==(H|0)){if(G){I=(B&255)>>>1;J=(B&255)>>>1}else{B=c[j>>2]|0;I=B;J=B}Kg(p,I<<1,0);if((a[p]&1)==0){K=10}else{K=(c[p>>2]&-2)+ -1|0}Kg(p,K,0);if((a[p]&1)==0){L=w}else{L=c[x>>2]|0}c[q>>2]=L+J;M=L}else{M=z}B=A+12|0;G=c[B>>2]|0;N=A+16|0;if((G|0)==(c[N>>2]|0)){O=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{O=d[G]|0}if((Li(O&255,v,M,q,t,u,o,r,s,m)|0)!=0){D=C;E=M;break}G=c[B>>2]|0;if((G|0)==(c[N>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0;n=A;z=M;continue}else{c[B>>2]=G+1;n=A;z=M;continue}}M=a[o]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[o+4>>2]|0}if((P|0)!=0?(P=c[s>>2]|0,(P-r|0)<160):0){M=c[t>>2]|0;c[s>>2]=P+4;c[P>>2]=M}M=bo(E,c[q>>2]|0,k,v)|0;b[l>>1]=M;vl(o,r,c[s>>2]|0,k);if((A|0)!=0){if((c[A+12>>2]|0)==(c[A+16>>2]|0)?(Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1:0){c[g>>2]=0;Q=0}else{Q=A}}else{Q=0}A=(Q|0)==0;do{if((D|0)!=0){if((c[D+12>>2]|0)!=(c[D+16>>2]|0)){if(!A){break}c[e>>2]=Q;Ig(p);Ig(o);i=f;return}if((Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0)==-1){c[h>>2]=0;F=54;break}if(A^(D|0)==0){c[e>>2]=Q;Ig(p);Ig(o);i=f;return}}else{F=54}}while(0);if((F|0)==54?!A:0){c[e>>2]=Q;Ig(p);Ig(o);i=f;return}c[k>>2]=c[k>>2]|2;c[e>>2]=Q;Ig(p);Ig(o);i=f;return}function yi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];zi(a,0,k,j,f,g,h);i=b;return}function zi(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;e=i;i=i+224|0;l=e+198|0;m=e+196|0;n=e+184|0;o=e+172|0;p=e+168|0;q=e+8|0;r=e+4|0;s=e;t=c[h+4>>2]&74;if((t|0)==64){u=8}else if((t|0)==0){u=0}else if((t|0)==8){u=16}else{u=10}jj(n,h,l,m);c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){h=o+1|0;v=h;w=o+8|0;x=h}else{h=o+8|0;v=o+1|0;w=h;x=c[h>>2]|0}c[p>>2]=x;c[r>>2]=q;c[s>>2]=0;h=o+4|0;t=a[m]|0;m=c[f>>2]|0;y=x;a:while(1){if((m|0)!=0){if((c[m+12>>2]|0)==(c[m+16>>2]|0)?(Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0)==-1:0){c[f>>2]=0;z=0}else{z=m}}else{z=0}x=(z|0)==0;A=c[g>>2]|0;do{if((A|0)!=0){if((c[A+12>>2]|0)!=(c[A+16>>2]|0)){if(x){B=A;break}else{C=A;D=y;break a}}if(!((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1)){if(x){B=A;break}else{C=A;D=y;break a}}else{c[g>>2]=0;E=18;break}}else{E=18}}while(0);if((E|0)==18){E=0;if(x){C=0;D=y;break}else{B=0}}A=a[o]|0;F=(A&1)==0;if(F){G=(A&255)>>>1}else{G=c[h>>2]|0}if(((c[p>>2]|0)-y|0)==(G|0)){if(F){H=(A&255)>>>1;I=(A&255)>>>1}else{A=c[h>>2]|0;H=A;I=A}Kg(o,H<<1,0);if((a[o]&1)==0){J=10}else{J=(c[o>>2]&-2)+ -1|0}Kg(o,J,0);if((a[o]&1)==0){K=v}else{K=c[w>>2]|0}c[p>>2]=K+I;L=K}else{L=y}A=z+12|0;F=c[A>>2]|0;M=z+16|0;if((F|0)==(c[M>>2]|0)){N=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{N=d[F]|0}if((Li(N&255,u,L,p,s,t,n,q,r,l)|0)!=0){C=B;D=L;break}F=c[A>>2]|0;if((F|0)==(c[M>>2]|0)){Nc[c[(c[z>>2]|0)+40>>2]&127](z)|0;m=z;y=L;continue}else{c[A>>2]=F+1;m=z;y=L;continue}}L=a[n]|0;if((L&1)==0){O=(L&255)>>>1}else{O=c[n+4>>2]|0}if((O|0)!=0?(O=c[r>>2]|0,(O-q|0)<160):0){L=c[s>>2]|0;c[r>>2]=O+4;c[O>>2]=L}L=ao(D,c[p>>2]|0,j,u)|0;c[k>>2]=L;vl(n,q,c[r>>2]|0,j);if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[f>>2]=0;P=0}else{P=z}}else{P=0}z=(P|0)==0;do{if((C|0)!=0){if((c[C+12>>2]|0)!=(c[C+16>>2]|0)){if(!z){break}c[b>>2]=P;Ig(o);Ig(n);i=e;return}if((Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1){c[g>>2]=0;E=54;break}if(z^(C|0)==0){c[b>>2]=P;Ig(o);Ig(n);i=e;return}}else{E=54}}while(0);if((E|0)==54?!z:0){c[b>>2]=P;Ig(o);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[b>>2]=P;Ig(o);Ig(n);i=e;return}function Ai(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Bi(a,0,k,j,f,g,h);i=b;return}function Bi(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;e=i;i=i+224|0;l=e+198|0;m=e+196|0;n=e+184|0;o=e+172|0;p=e+168|0;q=e+8|0;r=e+4|0;s=e;t=c[h+4>>2]&74;if((t|0)==64){u=8}else if((t|0)==8){u=16}else if((t|0)==0){u=0}else{u=10}jj(n,h,l,m);c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){h=o+1|0;v=h;w=o+8|0;x=h}else{h=o+8|0;v=o+1|0;w=h;x=c[h>>2]|0}c[p>>2]=x;c[r>>2]=q;c[s>>2]=0;h=o+4|0;t=a[m]|0;m=c[f>>2]|0;y=x;a:while(1){if((m|0)!=0){if((c[m+12>>2]|0)==(c[m+16>>2]|0)?(Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0)==-1:0){c[f>>2]=0;z=0}else{z=m}}else{z=0}x=(z|0)==0;A=c[g>>2]|0;do{if((A|0)!=0){if((c[A+12>>2]|0)!=(c[A+16>>2]|0)){if(x){B=A;break}else{C=A;D=y;break a}}if(!((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1)){if(x){B=A;break}else{C=A;D=y;break a}}else{c[g>>2]=0;E=18;break}}else{E=18}}while(0);if((E|0)==18){E=0;if(x){C=0;D=y;break}else{B=0}}A=a[o]|0;F=(A&1)==0;if(F){G=(A&255)>>>1}else{G=c[h>>2]|0}if(((c[p>>2]|0)-y|0)==(G|0)){if(F){H=(A&255)>>>1;I=(A&255)>>>1}else{A=c[h>>2]|0;H=A;I=A}Kg(o,H<<1,0);if((a[o]&1)==0){J=10}else{J=(c[o>>2]&-2)+ -1|0}Kg(o,J,0);if((a[o]&1)==0){K=v}else{K=c[w>>2]|0}c[p>>2]=K+I;L=K}else{L=y}A=z+12|0;F=c[A>>2]|0;M=z+16|0;if((F|0)==(c[M>>2]|0)){N=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{N=d[F]|0}if((Li(N&255,u,L,p,s,t,n,q,r,l)|0)!=0){C=B;D=L;break}F=c[A>>2]|0;if((F|0)==(c[M>>2]|0)){Nc[c[(c[z>>2]|0)+40>>2]&127](z)|0;m=z;y=L;continue}else{c[A>>2]=F+1;m=z;y=L;continue}}L=a[n]|0;if((L&1)==0){O=(L&255)>>>1}else{O=c[n+4>>2]|0}if((O|0)!=0?(O=c[r>>2]|0,(O-q|0)<160):0){L=c[s>>2]|0;c[r>>2]=O+4;c[O>>2]=L}L=$n(D,c[p>>2]|0,j,u)|0;c[k>>2]=L;vl(n,q,c[r>>2]|0,j);if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[f>>2]=0;P=0}else{P=z}}else{P=0}z=(P|0)==0;do{if((C|0)!=0){if((c[C+12>>2]|0)!=(c[C+16>>2]|0)){if(!z){break}c[b>>2]=P;Ig(o);Ig(n);i=e;return}if((Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1){c[g>>2]=0;E=54;break}if(z^(C|0)==0){c[b>>2]=P;Ig(o);Ig(n);i=e;return}}else{E=54}}while(0);if((E|0)==54?!z:0){c[b>>2]=P;Ig(o);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[b>>2]=P;Ig(o);Ig(n);i=e;return}function Ci(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Di(a,0,k,j,f,g,h);i=b;return}function Di(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;e=i;i=i+224|0;l=e+198|0;m=e+196|0;n=e+184|0;o=e+172|0;p=e+168|0;q=e+8|0;r=e+4|0;s=e;t=c[h+4>>2]&74;if((t|0)==0){u=0}else if((t|0)==64){u=8}else if((t|0)==8){u=16}else{u=10}jj(n,h,l,m);c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){h=o+1|0;v=h;w=o+8|0;x=h}else{h=o+8|0;v=o+1|0;w=h;x=c[h>>2]|0}c[p>>2]=x;c[r>>2]=q;c[s>>2]=0;h=o+4|0;t=a[m]|0;m=c[f>>2]|0;y=x;a:while(1){if((m|0)!=0){if((c[m+12>>2]|0)==(c[m+16>>2]|0)?(Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0)==-1:0){c[f>>2]=0;z=0}else{z=m}}else{z=0}x=(z|0)==0;A=c[g>>2]|0;do{if((A|0)!=0){if((c[A+12>>2]|0)!=(c[A+16>>2]|0)){if(x){B=A;break}else{C=A;D=y;break a}}if(!((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1)){if(x){B=A;break}else{C=A;D=y;break a}}else{c[g>>2]=0;E=18;break}}else{E=18}}while(0);if((E|0)==18){E=0;if(x){C=0;D=y;break}else{B=0}}A=a[o]|0;F=(A&1)==0;if(F){G=(A&255)>>>1}else{G=c[h>>2]|0}if(((c[p>>2]|0)-y|0)==(G|0)){if(F){H=(A&255)>>>1;J=(A&255)>>>1}else{A=c[h>>2]|0;H=A;J=A}Kg(o,H<<1,0);if((a[o]&1)==0){K=10}else{K=(c[o>>2]&-2)+ -1|0}Kg(o,K,0);if((a[o]&1)==0){L=v}else{L=c[w>>2]|0}c[p>>2]=L+J;M=L}else{M=y}A=z+12|0;F=c[A>>2]|0;N=z+16|0;if((F|0)==(c[N>>2]|0)){O=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{O=d[F]|0}if((Li(O&255,u,M,p,s,t,n,q,r,l)|0)!=0){C=B;D=M;break}F=c[A>>2]|0;if((F|0)==(c[N>>2]|0)){Nc[c[(c[z>>2]|0)+40>>2]&127](z)|0;m=z;y=M;continue}else{c[A>>2]=F+1;m=z;y=M;continue}}M=a[n]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[n+4>>2]|0}if((P|0)!=0?(P=c[r>>2]|0,(P-q|0)<160):0){M=c[s>>2]|0;c[r>>2]=P+4;c[P>>2]=M}M=_n(D,c[p>>2]|0,j,u)|0;u=k;c[u>>2]=M;c[u+4>>2]=I;vl(n,q,c[r>>2]|0,j);if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[f>>2]=0;Q=0}else{Q=z}}else{Q=0}z=(Q|0)==0;do{if((C|0)!=0){if((c[C+12>>2]|0)!=(c[C+16>>2]|0)){if(!z){break}c[b>>2]=Q;Ig(o);Ig(n);i=e;return}if((Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1){c[g>>2]=0;E=54;break}if(z^(C|0)==0){c[b>>2]=Q;Ig(o);Ig(n);i=e;return}}else{E=54}}while(0);if((E|0)==54?!z:0){c[b>>2]=Q;Ig(o);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[b>>2]=Q;Ig(o);Ig(n);i=e;return}function Ei(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Fi(a,0,k,j,f,g,h);i=b;return}function Fi(b,e,f,h,j,k,l){b=b|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0.0,T=0;e=i;i=i+240|0;m=e+200|0;n=e+199|0;o=e+198|0;p=e+184|0;q=e+172|0;r=e+168|0;s=e+8|0;t=e+4|0;u=e;v=e+197|0;w=e+196|0;kj(p,j,m,n,o);c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Kg(q,10,0);if((a[q]&1)==0){j=q+1|0;x=j;y=q+8|0;z=j}else{j=q+8|0;x=q+1|0;y=j;z=c[j>>2]|0}c[r>>2]=z;c[t>>2]=s;c[u>>2]=0;a[v]=1;a[w]=69;j=q+4|0;A=a[n]|0;n=a[o]|0;o=c[f>>2]|0;B=z;a:while(1){if((o|0)!=0){if((c[o+12>>2]|0)==(c[o+16>>2]|0)?(Nc[c[(c[o>>2]|0)+36>>2]&127](o)|0)==-1:0){c[f>>2]=0;C=0}else{C=o}}else{C=0}z=(C|0)==0;D=c[h>>2]|0;do{if((D|0)!=0){if((c[D+12>>2]|0)!=(c[D+16>>2]|0)){if(z){E=D;break}else{F=D;G=B;break a}}if(!((Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0)==-1)){if(z){E=D;break}else{F=D;G=B;break a}}else{c[h>>2]=0;H=14;break}}else{H=14}}while(0);if((H|0)==14){H=0;if(z){F=0;G=B;break}else{E=0}}D=a[q]|0;I=(D&1)==0;if(I){J=(D&255)>>>1}else{J=c[j>>2]|0}if(((c[r>>2]|0)-B|0)==(J|0)){if(I){K=(D&255)>>>1;L=(D&255)>>>1}else{D=c[j>>2]|0;K=D;L=D}Kg(q,K<<1,0);if((a[q]&1)==0){M=10}else{M=(c[q>>2]&-2)+ -1|0}Kg(q,M,0);if((a[q]&1)==0){N=x}else{N=c[y>>2]|0}c[r>>2]=N+L;O=N}else{O=B}D=C+12|0;I=c[D>>2]|0;P=C+16|0;if((I|0)==(c[P>>2]|0)){Q=Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0}else{Q=d[I]|0}if((lj(Q&255,v,w,O,r,A,n,p,s,t,u,m)|0)!=0){F=E;G=O;break}I=c[D>>2]|0;if((I|0)==(c[P>>2]|0)){Nc[c[(c[C>>2]|0)+40>>2]&127](C)|0;o=C;B=O;continue}else{c[D>>2]=I+1;o=C;B=O;continue}}O=a[p]|0;if((O&1)==0){R=(O&255)>>>1}else{R=c[p+4>>2]|0}if(((R|0)!=0?(a[v]|0)!=0:0)?(v=c[t>>2]|0,(v-s|0)<160):0){R=c[u>>2]|0;c[t>>2]=v+4;c[v>>2]=R}S=+Zn(G,c[r>>2]|0,k);g[l>>2]=S;vl(p,s,c[t>>2]|0,k);if((C|0)!=0){if((c[C+12>>2]|0)==(c[C+16>>2]|0)?(Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1:0){c[f>>2]=0;T=0}else{T=C}}else{T=0}C=(T|0)==0;do{if((F|0)!=0){if((c[F+12>>2]|0)!=(c[F+16>>2]|0)){if(!C){break}c[b>>2]=T;Ig(q);Ig(p);i=e;return}if((Nc[c[(c[F>>2]|0)+36>>2]&127](F)|0)==-1){c[h>>2]=0;H=51;break}if(C^(F|0)==0){c[b>>2]=T;Ig(q);Ig(p);i=e;return}}else{H=51}}while(0);if((H|0)==51?!C:0){c[b>>2]=T;Ig(q);Ig(p);i=e;return}c[k>>2]=c[k>>2]|2;c[b>>2]=T;Ig(q);Ig(p);i=e;return}function Gi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Hi(a,0,k,j,f,g,h);i=b;return}function Hi(b,e,f,g,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0.0,T=0;e=i;i=i+240|0;m=e+200|0;n=e+199|0;o=e+198|0;p=e+184|0;q=e+172|0;r=e+168|0;s=e+8|0;t=e+4|0;u=e;v=e+197|0;w=e+196|0;kj(p,j,m,n,o);c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Kg(q,10,0);if((a[q]&1)==0){j=q+1|0;x=j;y=q+8|0;z=j}else{j=q+8|0;x=q+1|0;y=j;z=c[j>>2]|0}c[r>>2]=z;c[t>>2]=s;c[u>>2]=0;a[v]=1;a[w]=69;j=q+4|0;A=a[n]|0;n=a[o]|0;o=c[f>>2]|0;B=z;a:while(1){if((o|0)!=0){if((c[o+12>>2]|0)==(c[o+16>>2]|0)?(Nc[c[(c[o>>2]|0)+36>>2]&127](o)|0)==-1:0){c[f>>2]=0;C=0}else{C=o}}else{C=0}z=(C|0)==0;D=c[g>>2]|0;do{if((D|0)!=0){if((c[D+12>>2]|0)!=(c[D+16>>2]|0)){if(z){E=D;break}else{F=D;G=B;break a}}if(!((Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0)==-1)){if(z){E=D;break}else{F=D;G=B;break a}}else{c[g>>2]=0;H=14;break}}else{H=14}}while(0);if((H|0)==14){H=0;if(z){F=0;G=B;break}else{E=0}}D=a[q]|0;I=(D&1)==0;if(I){J=(D&255)>>>1}else{J=c[j>>2]|0}if(((c[r>>2]|0)-B|0)==(J|0)){if(I){K=(D&255)>>>1;L=(D&255)>>>1}else{D=c[j>>2]|0;K=D;L=D}Kg(q,K<<1,0);if((a[q]&1)==0){M=10}else{M=(c[q>>2]&-2)+ -1|0}Kg(q,M,0);if((a[q]&1)==0){N=x}else{N=c[y>>2]|0}c[r>>2]=N+L;O=N}else{O=B}D=C+12|0;I=c[D>>2]|0;P=C+16|0;if((I|0)==(c[P>>2]|0)){Q=Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0}else{Q=d[I]|0}if((lj(Q&255,v,w,O,r,A,n,p,s,t,u,m)|0)!=0){F=E;G=O;break}I=c[D>>2]|0;if((I|0)==(c[P>>2]|0)){Nc[c[(c[C>>2]|0)+40>>2]&127](C)|0;o=C;B=O;continue}else{c[D>>2]=I+1;o=C;B=O;continue}}O=a[p]|0;if((O&1)==0){R=(O&255)>>>1}else{R=c[p+4>>2]|0}if(((R|0)!=0?(a[v]|0)!=0:0)?(v=c[t>>2]|0,(v-s|0)<160):0){R=c[u>>2]|0;c[t>>2]=v+4;c[v>>2]=R}S=+Yn(G,c[r>>2]|0,k);h[l>>3]=S;vl(p,s,c[t>>2]|0,k);if((C|0)!=0){if((c[C+12>>2]|0)==(c[C+16>>2]|0)?(Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1:0){c[f>>2]=0;T=0}else{T=C}}else{T=0}C=(T|0)==0;do{if((F|0)!=0){if((c[F+12>>2]|0)!=(c[F+16>>2]|0)){if(!C){break}c[b>>2]=T;Ig(q);Ig(p);i=e;return}if((Nc[c[(c[F>>2]|0)+36>>2]&127](F)|0)==-1){c[g>>2]=0;H=51;break}if(C^(F|0)==0){c[b>>2]=T;Ig(q);Ig(p);i=e;return}}else{H=51}}while(0);if((H|0)==51?!C:0){c[b>>2]=T;Ig(q);Ig(p);i=e;return}c[k>>2]=c[k>>2]|2;c[b>>2]=T;Ig(q);Ig(p);i=e;return}function Ii(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Ji(a,0,k,j,f,g,h);i=b;return}function Ji(b,e,f,g,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0.0,T=0;e=i;i=i+240|0;m=e+200|0;n=e+199|0;o=e+198|0;p=e+184|0;q=e+172|0;r=e+168|0;s=e+8|0;t=e+4|0;u=e;v=e+197|0;w=e+196|0;kj(p,j,m,n,o);c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;Kg(q,10,0);if((a[q]&1)==0){j=q+1|0;x=j;y=q+8|0;z=j}else{j=q+8|0;x=q+1|0;y=j;z=c[j>>2]|0}c[r>>2]=z;c[t>>2]=s;c[u>>2]=0;a[v]=1;a[w]=69;j=q+4|0;A=a[n]|0;n=a[o]|0;o=c[f>>2]|0;B=z;a:while(1){if((o|0)!=0){if((c[o+12>>2]|0)==(c[o+16>>2]|0)?(Nc[c[(c[o>>2]|0)+36>>2]&127](o)|0)==-1:0){c[f>>2]=0;C=0}else{C=o}}else{C=0}z=(C|0)==0;D=c[g>>2]|0;do{if((D|0)!=0){if((c[D+12>>2]|0)!=(c[D+16>>2]|0)){if(z){E=D;break}else{F=D;G=B;break a}}if(!((Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0)==-1)){if(z){E=D;break}else{F=D;G=B;break a}}else{c[g>>2]=0;H=14;break}}else{H=14}}while(0);if((H|0)==14){H=0;if(z){F=0;G=B;break}else{E=0}}D=a[q]|0;I=(D&1)==0;if(I){J=(D&255)>>>1}else{J=c[j>>2]|0}if(((c[r>>2]|0)-B|0)==(J|0)){if(I){K=(D&255)>>>1;L=(D&255)>>>1}else{D=c[j>>2]|0;K=D;L=D}Kg(q,K<<1,0);if((a[q]&1)==0){M=10}else{M=(c[q>>2]&-2)+ -1|0}Kg(q,M,0);if((a[q]&1)==0){N=x}else{N=c[y>>2]|0}c[r>>2]=N+L;O=N}else{O=B}D=C+12|0;I=c[D>>2]|0;P=C+16|0;if((I|0)==(c[P>>2]|0)){Q=Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0}else{Q=d[I]|0}if((lj(Q&255,v,w,O,r,A,n,p,s,t,u,m)|0)!=0){F=E;G=O;break}I=c[D>>2]|0;if((I|0)==(c[P>>2]|0)){Nc[c[(c[C>>2]|0)+40>>2]&127](C)|0;o=C;B=O;continue}else{c[D>>2]=I+1;o=C;B=O;continue}}O=a[p]|0;if((O&1)==0){R=(O&255)>>>1}else{R=c[p+4>>2]|0}if(((R|0)!=0?(a[v]|0)!=0:0)?(v=c[t>>2]|0,(v-s|0)<160):0){R=c[u>>2]|0;c[t>>2]=v+4;c[v>>2]=R}S=+Xn(G,c[r>>2]|0,k);h[l>>3]=S;vl(p,s,c[t>>2]|0,k);if((C|0)!=0){if((c[C+12>>2]|0)==(c[C+16>>2]|0)?(Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1:0){c[f>>2]=0;T=0}else{T=C}}else{T=0}C=(T|0)==0;do{if((F|0)!=0){if((c[F+12>>2]|0)!=(c[F+16>>2]|0)){if(!C){break}c[b>>2]=T;Ig(q);Ig(p);i=e;return}if((Nc[c[(c[F>>2]|0)+36>>2]&127](F)|0)==-1){c[g>>2]=0;H=51;break}if(C^(F|0)==0){c[b>>2]=T;Ig(q);Ig(p);i=e;return}}else{H=51}}while(0);if((H|0)==51?!C:0){c[b>>2]=T;Ig(q);Ig(p);i=e;return}c[k>>2]=c[k>>2]|2;c[b>>2]=T;Ig(q);Ig(p);i=e;return}function Ki(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;e=i;i=i+240|0;l=e;m=e+204|0;n=e+192|0;o=e+188|0;p=e+176|0;q=e+16|0;c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;ah(o,h);h=c[o>>2]|0;if(!((c[4918]|0)==-1)){c[l>>2]=19672;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19672,l,137)}r=(c[19676>>2]|0)+ -1|0;s=c[h+8>>2]|0;if(!((c[h+12>>2]|0)-s>>2>>>0>r>>>0)){t=Fb(4)|0;Ao(t);zc(t|0,27632,123)}h=c[s+(r<<2)>>2]|0;if((h|0)==0){t=Fb(4)|0;Ao(t);zc(t|0,27632,123)}Tc[c[(c[h>>2]|0)+32>>2]&7](h,18216,18242|0,m)|0;jg(c[o>>2]|0)|0;c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;Kg(p,10,0);if((a[p]&1)==0){o=p+1|0;u=o;v=p+8|0;w=o}else{o=p+8|0;u=p+1|0;v=o;w=c[o>>2]|0}o=p+4|0;h=m+24|0;t=m+25|0;r=q;s=m+26|0;x=m;y=n+4|0;z=c[f>>2]|0;A=q;q=0;B=w;C=w;a:while(1){if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[f>>2]=0;D=0}else{D=z}}else{D=0}w=(D|0)==0;E=c[g>>2]|0;do{if((E|0)!=0){if((c[E+12>>2]|0)!=(c[E+16>>2]|0)){if(w){break}else{F=C;break a}}if(!((Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0)==-1)){if(w){break}else{F=C;break a}}else{c[g>>2]=0;G=19;break}}else{G=19}}while(0);if((G|0)==19?(G=0,w):0){F=C;break}E=a[p]|0;H=(E&1)==0;if(H){I=(E&255)>>>1}else{I=c[o>>2]|0}if((B-C|0)==(I|0)){if(H){J=(E&255)>>>1;K=(E&255)>>>1}else{E=c[o>>2]|0;J=E;K=E}Kg(p,J<<1,0);if((a[p]&1)==0){L=10}else{L=(c[p>>2]&-2)+ -1|0}Kg(p,L,0);if((a[p]&1)==0){M=u}else{M=c[v>>2]|0}N=M+K|0;O=M}else{N=B;O=C}E=c[D+12>>2]|0;if((E|0)==(c[D+16>>2]|0)){P=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{P=d[E]|0}E=P&255;H=(N|0)==(O|0);do{if(H){Q=(a[h]|0)==E<<24>>24;if(!Q?!((a[t]|0)==E<<24>>24):0){G=40;break}a[N]=Q?43:45;R=N+1|0;S=A;T=0}else{G=40}}while(0);do{if((G|0)==40){G=0;w=a[n]|0;if((w&1)==0){U=(w&255)>>>1}else{U=c[y>>2]|0}if((U|0)!=0&E<<24>>24==0){if((A-r|0)>=160){R=N;S=A;T=q;break}c[A>>2]=q;R=N;S=A+4|0;T=0;break}else{V=m}while(1){w=V+1|0;if((a[V]|0)==E<<24>>24){W=V;break}if((w|0)==(s|0)){W=s;break}else{V=w}}w=W-x|0;if((w|0)>23){F=O;break a}if((w|0)<22){a[N]=a[18216+w|0]|0;R=N+1|0;S=A;T=q+1|0;break}if(H){F=N;break a}if((N-O|0)>=3){F=O;break a}if((a[N+ -1|0]|0)!=48){F=O;break a}a[N]=a[18216+w|0]|0;R=N+1|0;S=A;T=0}}while(0);H=c[f>>2]|0;E=H+12|0;w=c[E>>2]|0;if((w|0)==(c[H+16>>2]|0)){Nc[c[(c[H>>2]|0)+40>>2]&127](H)|0;z=H;A=S;q=T;B=R;C=O;continue}else{c[E>>2]=w+1;z=H;A=S;q=T;B=R;C=O;continue}}a[F+3|0]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){O=kb(2147483647,19576,0)|0;c[4890]=O;gb(19568)}O=c[4890]|0;c[l>>2]=k;if((Mi(F,O,18256,l)|0)!=1){c[j>>2]=4}l=c[f>>2]|0;if((l|0)!=0){if((c[l+12>>2]|0)==(c[l+16>>2]|0)?(Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0)==-1:0){c[f>>2]=0;X=0}else{X=l}}else{X=0}l=(X|0)==0;f=c[g>>2]|0;do{if((f|0)!=0){if((c[f+12>>2]|0)!=(c[f+16>>2]|0)){if(!l){break}c[b>>2]=X;Ig(p);Ig(n);i=e;return}if((Nc[c[(c[f>>2]|0)+36>>2]&127](f)|0)==-1){c[g>>2]=0;G=72;break}if(l^(f|0)==0){c[b>>2]=X;Ig(p);Ig(n);i=e;return}}else{G=72}}while(0);if((G|0)==72?!l:0){c[b>>2]=X;Ig(p);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[b>>2]=X;Ig(p);Ig(n);i=e;return}function Li(b,d,e,f,g,h,j,k,l,m){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0;n=i;o=c[f>>2]|0;p=(o|0)==(e|0);do{if(p){q=(a[m+24|0]|0)==b<<24>>24;if(!q?!((a[m+25|0]|0)==b<<24>>24):0){break}c[f>>2]=e+1;a[e]=q?43:45;c[g>>2]=0;r=0;i=n;return r|0}}while(0);q=a[j]|0;if((q&1)==0){s=(q&255)>>>1}else{s=c[j+4>>2]|0}if((s|0)!=0&b<<24>>24==h<<24>>24){h=c[l>>2]|0;if((h-k|0)>=160){r=0;i=n;return r|0}k=c[g>>2]|0;c[l>>2]=h+4;c[h>>2]=k;c[g>>2]=0;r=0;i=n;return r|0}k=m+26|0;h=m;while(1){l=h+1|0;if((a[h]|0)==b<<24>>24){t=h;break}if((l|0)==(k|0)){t=k;break}else{h=l}}h=t-m|0;if((h|0)>23){r=-1;i=n;return r|0}if((d|0)==16){if((h|0)>=22){if(p){r=-1;i=n;return r|0}if((o-e|0)>=3){r=-1;i=n;return r|0}if((a[o+ -1|0]|0)!=48){r=-1;i=n;return r|0}c[g>>2]=0;e=a[18216+h|0]|0;c[f>>2]=o+1;a[o]=e;r=0;i=n;return r|0}}else if((d|0)==10|(d|0)==8?(h|0)>=(d|0):0){r=-1;i=n;return r|0}d=a[18216+h|0]|0;c[f>>2]=o+1;a[o]=d;c[g>>2]=(c[g>>2]|0)+1;r=0;i=n;return r|0}function Mi(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+16|0;g=f;c[g>>2]=e;e=Jb(b|0)|0;b=Ua(a|0,d|0,g|0)|0;if((e|0)==0){i=f;return b|0}Jb(e|0)|0;i=f;return b|0}function Ni(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Oi(a){a=a|0;return}function Pi(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;k=i;i=i+80|0;l=k;m=k+64|0;n=k+60|0;o=k+56|0;p=k+52|0;q=k+48|0;r=k+44|0;s=k+40|0;t=k+16|0;u=k+12|0;if((c[g+4>>2]&1|0)==0){c[n>>2]=-1;v=c[(c[d>>2]|0)+16>>2]|0;c[p>>2]=c[e>>2];c[q>>2]=c[f>>2];c[m+0>>2]=c[p+0>>2];c[l+0>>2]=c[q+0>>2];Kc[v&63](o,d,m,l,g,h,n);m=c[o>>2]|0;c[e>>2]=m;o=c[n>>2]|0;if((o|0)==1){a[j]=1}else if((o|0)==0){a[j]=0}else{a[j]=1;c[h>>2]=4}c[b>>2]=m;i=k;return}ah(r,g);m=c[r>>2]|0;if(!((c[4916]|0)==-1)){c[l>>2]=19664;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19664,l,137)}o=(c[19668>>2]|0)+ -1|0;n=c[m+8>>2]|0;if(!((c[m+12>>2]|0)-n>>2>>>0>o>>>0)){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}m=c[n+(o<<2)>>2]|0;if((m|0)==0){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}jg(c[r>>2]|0)|0;ah(s,g);g=c[s>>2]|0;if(!((c[4956]|0)==-1)){c[l>>2]=19824;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19824,l,137)}r=(c[19828>>2]|0)+ -1|0;w=c[g+8>>2]|0;if(!((c[g+12>>2]|0)-w>>2>>>0>r>>>0)){x=Fb(4)|0;Ao(x);zc(x|0,27632,123)}g=c[w+(r<<2)>>2]|0;if((g|0)==0){x=Fb(4)|0;Ao(x);zc(x|0,27632,123)}jg(c[s>>2]|0)|0;Lc[c[(c[g>>2]|0)+24>>2]&63](t,g);Lc[c[(c[g>>2]|0)+28>>2]&63](t+12|0,g);c[u>>2]=c[f>>2];f=t+24|0;c[l+0>>2]=c[u+0>>2];u=(Qi(e,l,t,f,m,h,1)|0)==(t|0)|0;a[j]=u;c[b>>2]=c[e>>2];Tg(t+12|0);Tg(t);i=k;return}function Qi(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0;k=i;i=i+112|0;l=k;m=(f-e|0)/12|0;if(m>>>0>100){n=Vo(m)|0;if((n|0)==0){fp()}else{o=n;p=n}}else{o=0;p=l}l=(e|0)==(f|0);if(l){q=0;r=m}else{n=e;s=0;t=m;m=p;while(1){u=a[n]|0;if((u&1)==0){v=(u&255)>>>1}else{v=c[n+4>>2]|0}if((v|0)==0){a[m]=2;w=s+1|0;x=t+ -1|0}else{a[m]=1;w=s;x=t}u=n+12|0;if((u|0)==(f|0)){q=w;r=x;break}else{n=u;s=w;t=x;m=m+1|0}}}m=0;x=q;q=r;a:while(1){r=c[b>>2]|0;do{if((r|0)!=0){t=c[r+12>>2]|0;if((t|0)==(c[r+16>>2]|0)){y=Nc[c[(c[r>>2]|0)+36>>2]&127](r)|0}else{y=c[t>>2]|0}if((y|0)==-1){c[b>>2]=0;z=1;break}else{z=(c[b>>2]|0)==0;break}}else{z=1}}while(0);r=c[d>>2]|0;if((r|0)!=0){t=c[r+12>>2]|0;if((t|0)==(c[r+16>>2]|0)){A=Nc[c[(c[r>>2]|0)+36>>2]&127](r)|0}else{A=c[t>>2]|0}if((A|0)==-1){c[d>>2]=0;B=0;C=1}else{B=r;C=0}}else{B=0;C=1}D=c[b>>2]|0;if(!((z^C)&(q|0)!=0)){break}r=c[D+12>>2]|0;if((r|0)==(c[D+16>>2]|0)){E=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{E=c[r>>2]|0}if(j){F=E}else{F=Wc[c[(c[g>>2]|0)+28>>2]&15](g,E)|0}r=m+1|0;if(l){m=r;continue}b:do{if(j){t=0;w=e;s=x;n=q;v=p;while(1){do{if((a[v]|0)==1){u=a[w]|0;G=(u&1)==0;if(G){H=w+4|0}else{H=c[w+8>>2]|0}if((F|0)!=(c[H+(m<<2)>>2]|0)){a[v]=0;I=t;J=s;K=n+ -1|0;break}if(G){L=(u&255)>>>1}else{L=c[w+4>>2]|0}if((L|0)==(r|0)){a[v]=2;I=1;J=s+1|0;K=n+ -1|0}else{I=1;J=s;K=n}}else{I=t;J=s;K=n}}while(0);u=w+12|0;if((u|0)==(f|0)){M=I;N=J;O=K;break b}t=I;w=u;s=J;n=K;v=v+1|0}}else{v=0;n=e;s=x;w=q;t=p;while(1){do{if((a[t]|0)==1){if((a[n]&1)==0){P=n+4|0}else{P=c[n+8>>2]|0}if((F|0)!=(Wc[c[(c[g>>2]|0)+28>>2]&15](g,c[P+(m<<2)>>2]|0)|0)){a[t]=0;Q=v;R=s;S=w+ -1|0;break}u=a[n]|0;if((u&1)==0){T=(u&255)>>>1}else{T=c[n+4>>2]|0}if((T|0)==(r|0)){a[t]=2;Q=1;R=s+1|0;S=w+ -1|0}else{Q=1;R=s;S=w}}else{Q=v;R=s;S=w}}while(0);u=n+12|0;if((u|0)==(f|0)){M=Q;N=R;O=S;break b}v=Q;n=u;s=R;w=S;t=t+1|0}}}while(0);if(!M){m=r;x=N;q=O;continue}t=c[b>>2]|0;w=t+12|0;s=c[w>>2]|0;if((s|0)==(c[t+16>>2]|0)){Nc[c[(c[t>>2]|0)+40>>2]&127](t)|0}else{c[w>>2]=s+4}if((O+N|0)>>>0<2){m=r;x=N;q=O;continue}else{U=e;V=N;W=p}while(1){if((a[W]|0)==2){s=a[U]|0;if((s&1)==0){X=(s&255)>>>1}else{X=c[U+4>>2]|0}if((X|0)!=(r|0)){a[W]=0;Y=V+ -1|0}else{Y=V}}else{Y=V}s=U+12|0;if((s|0)==(f|0)){m=r;x=Y;q=O;continue a}else{U=s;V=Y;W=W+1|0}}}do{if((D|0)!=0){W=c[D+12>>2]|0;if((W|0)==(c[D+16>>2]|0)){Z=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{Z=c[W>>2]|0}if((Z|0)==-1){c[b>>2]=0;_=1;break}else{_=(c[b>>2]|0)==0;break}}else{_=1}}while(0);do{if((B|0)!=0){b=c[B+12>>2]|0;if((b|0)==(c[B+16>>2]|0)){$=Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0}else{$=c[b>>2]|0}if(!(($|0)==-1)){if(_){break}else{aa=87;break}}else{c[d>>2]=0;aa=85;break}}else{aa=85}}while(0);if((aa|0)==85?_:0){aa=87}if((aa|0)==87){c[h>>2]=c[h>>2]|2}c:do{if(!l){if((a[p]|0)==2){ba=e}else{_=e;d=p;while(1){$=_+12|0;B=d+1|0;if(($|0)==(f|0)){aa=92;break c}if((a[B]|0)==2){ba=$;break}else{_=$;d=B}}}}else{aa=92}}while(0);if((aa|0)==92){c[h>>2]=c[h>>2]|4;ba=f}if((o|0)==0){i=k;return ba|0}Wo(o);i=k;return ba|0}function Ri(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Si(a,0,k,j,f,g,h);i=b;return}function Si(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;d=i;i=i+304|0;k=d+200|0;l=d+196|0;m=d+184|0;n=d+172|0;o=d+168|0;p=d+8|0;q=d+4|0;r=d;s=c[g+4>>2]&74;if((s|0)==0){t=0}else if((s|0)==8){t=16}else if((s|0)==64){t=8}else{t=10}mj(m,g,k,l);c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;Kg(n,10,0);if((a[n]&1)==0){g=n+1|0;u=g;v=n+8|0;w=g}else{g=n+8|0;u=n+1|0;v=g;w=c[g>>2]|0}c[o>>2]=w;c[q>>2]=p;c[r>>2]=0;g=n+4|0;s=c[l>>2]|0;l=c[e>>2]|0;x=w;a:while(1){if((l|0)!=0){w=c[l+12>>2]|0;if((w|0)==(c[l+16>>2]|0)){y=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{y=c[w>>2]|0}if((y|0)==-1){c[e>>2]=0;z=1;A=0}else{z=0;A=l}}else{z=1;A=0}w=c[f>>2]|0;do{if((w|0)!=0){B=c[w+12>>2]|0;if((B|0)==(c[w+16>>2]|0)){C=Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0}else{C=c[B>>2]|0}if(!((C|0)==-1)){if(z){D=w;break}else{E=w;F=x;break a}}else{c[f>>2]=0;G=21;break}}else{G=21}}while(0);if((G|0)==21){G=0;if(z){E=0;F=x;break}else{D=0}}w=a[n]|0;B=(w&1)==0;if(B){H=(w&255)>>>1}else{H=c[g>>2]|0}if(((c[o>>2]|0)-x|0)==(H|0)){if(B){I=(w&255)>>>1;J=(w&255)>>>1}else{w=c[g>>2]|0;I=w;J=w}Kg(n,I<<1,0);if((a[n]&1)==0){K=10}else{K=(c[n>>2]&-2)+ -1|0}Kg(n,K,0);if((a[n]&1)==0){L=u}else{L=c[v>>2]|0}c[o>>2]=L+J;M=L}else{M=x}w=A+12|0;B=c[w>>2]|0;N=A+16|0;if((B|0)==(c[N>>2]|0)){O=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{O=c[B>>2]|0}if((ij(O,t,M,o,r,s,m,p,q,k)|0)!=0){E=D;F=M;break}B=c[w>>2]|0;if((B|0)==(c[N>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0;l=A;x=M;continue}else{c[w>>2]=B+4;l=A;x=M;continue}}M=a[m]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[m+4>>2]|0}if((P|0)!=0?(P=c[q>>2]|0,(P-p|0)<160):0){M=c[r>>2]|0;c[q>>2]=P+4;c[P>>2]=M}M=eo(F,c[o>>2]|0,h,t)|0;c[j>>2]=M;vl(m,p,c[q>>2]|0,h);if((A|0)!=0){q=c[A+12>>2]|0;if((q|0)==(c[A+16>>2]|0)){Q=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{Q=c[q>>2]|0}if((Q|0)==-1){c[e>>2]=0;R=0;S=1}else{R=A;S=0}}else{R=0;S=1}do{if((E|0)!=0){A=c[E+12>>2]|0;if((A|0)==(c[E+16>>2]|0)){T=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{T=c[A>>2]|0}if((T|0)==-1){c[f>>2]=0;G=60;break}if(S){c[b>>2]=R;Ig(n);Ig(m);i=d;return}}else{G=60}}while(0);if((G|0)==60?!S:0){c[b>>2]=R;Ig(n);Ig(m);i=d;return}c[h>>2]=c[h>>2]|2;c[b>>2]=R;Ig(n);Ig(m);i=d;return}function Ti(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Ui(a,0,k,j,f,g,h);i=b;return}function Ui(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0;d=i;i=i+304|0;k=d+200|0;l=d+196|0;m=d+184|0;n=d+172|0;o=d+168|0;p=d+8|0;q=d+4|0;r=d;s=c[g+4>>2]&74;if((s|0)==64){t=8}else if((s|0)==0){t=0}else if((s|0)==8){t=16}else{t=10}mj(m,g,k,l);c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;Kg(n,10,0);if((a[n]&1)==0){g=n+1|0;u=g;v=n+8|0;w=g}else{g=n+8|0;u=n+1|0;v=g;w=c[g>>2]|0}c[o>>2]=w;c[q>>2]=p;c[r>>2]=0;g=n+4|0;s=c[l>>2]|0;l=c[e>>2]|0;x=w;a:while(1){if((l|0)!=0){w=c[l+12>>2]|0;if((w|0)==(c[l+16>>2]|0)){y=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{y=c[w>>2]|0}if((y|0)==-1){c[e>>2]=0;z=1;A=0}else{z=0;A=l}}else{z=1;A=0}w=c[f>>2]|0;do{if((w|0)!=0){B=c[w+12>>2]|0;if((B|0)==(c[w+16>>2]|0)){C=Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0}else{C=c[B>>2]|0}if(!((C|0)==-1)){if(z){D=w;break}else{E=w;F=x;break a}}else{c[f>>2]=0;G=21;break}}else{G=21}}while(0);if((G|0)==21){G=0;if(z){E=0;F=x;break}else{D=0}}w=a[n]|0;B=(w&1)==0;if(B){H=(w&255)>>>1}else{H=c[g>>2]|0}if(((c[o>>2]|0)-x|0)==(H|0)){if(B){J=(w&255)>>>1;K=(w&255)>>>1}else{w=c[g>>2]|0;J=w;K=w}Kg(n,J<<1,0);if((a[n]&1)==0){L=10}else{L=(c[n>>2]&-2)+ -1|0}Kg(n,L,0);if((a[n]&1)==0){M=u}else{M=c[v>>2]|0}c[o>>2]=M+K;N=M}else{N=x}w=A+12|0;B=c[w>>2]|0;O=A+16|0;if((B|0)==(c[O>>2]|0)){P=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{P=c[B>>2]|0}if((ij(P,t,N,o,r,s,m,p,q,k)|0)!=0){E=D;F=N;break}B=c[w>>2]|0;if((B|0)==(c[O>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0;l=A;x=N;continue}else{c[w>>2]=B+4;l=A;x=N;continue}}N=a[m]|0;if((N&1)==0){Q=(N&255)>>>1}else{Q=c[m+4>>2]|0}if((Q|0)!=0?(Q=c[q>>2]|0,(Q-p|0)<160):0){N=c[r>>2]|0;c[q>>2]=Q+4;c[Q>>2]=N}N=co(F,c[o>>2]|0,h,t)|0;t=j;c[t>>2]=N;c[t+4>>2]=I;vl(m,p,c[q>>2]|0,h);if((A|0)!=0){q=c[A+12>>2]|0;if((q|0)==(c[A+16>>2]|0)){R=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{R=c[q>>2]|0}if((R|0)==-1){c[e>>2]=0;S=0;T=1}else{S=A;T=0}}else{S=0;T=1}do{if((E|0)!=0){A=c[E+12>>2]|0;if((A|0)==(c[E+16>>2]|0)){U=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{U=c[A>>2]|0}if((U|0)==-1){c[f>>2]=0;G=60;break}if(T){c[b>>2]=S;Ig(n);Ig(m);i=d;return}}else{G=60}}while(0);if((G|0)==60?!T:0){c[b>>2]=S;Ig(n);Ig(m);i=d;return}c[h>>2]=c[h>>2]|2;c[b>>2]=S;Ig(n);Ig(m);i=d;return}function Vi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Wi(a,0,k,j,f,g,h);i=b;return}function Wi(d,e,f,g,h,j,k){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0;e=i;i=i+304|0;l=e+200|0;m=e+196|0;n=e+184|0;o=e+172|0;p=e+168|0;q=e+8|0;r=e+4|0;s=e;t=c[h+4>>2]&74;if((t|0)==8){u=16}else if((t|0)==64){u=8}else if((t|0)==0){u=0}else{u=10}mj(n,h,l,m);c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){h=o+1|0;v=h;w=o+8|0;x=h}else{h=o+8|0;v=o+1|0;w=h;x=c[h>>2]|0}c[p>>2]=x;c[r>>2]=q;c[s>>2]=0;h=o+4|0;t=c[m>>2]|0;m=c[f>>2]|0;y=x;a:while(1){if((m|0)!=0){x=c[m+12>>2]|0;if((x|0)==(c[m+16>>2]|0)){z=Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0}else{z=c[x>>2]|0}if((z|0)==-1){c[f>>2]=0;A=1;B=0}else{A=0;B=m}}else{A=1;B=0}x=c[g>>2]|0;do{if((x|0)!=0){C=c[x+12>>2]|0;if((C|0)==(c[x+16>>2]|0)){D=Nc[c[(c[x>>2]|0)+36>>2]&127](x)|0}else{D=c[C>>2]|0}if(!((D|0)==-1)){if(A){E=x;break}else{F=x;G=y;break a}}else{c[g>>2]=0;H=21;break}}else{H=21}}while(0);if((H|0)==21){H=0;if(A){F=0;G=y;break}else{E=0}}x=a[o]|0;C=(x&1)==0;if(C){I=(x&255)>>>1}else{I=c[h>>2]|0}if(((c[p>>2]|0)-y|0)==(I|0)){if(C){J=(x&255)>>>1;K=(x&255)>>>1}else{x=c[h>>2]|0;J=x;K=x}Kg(o,J<<1,0);if((a[o]&1)==0){L=10}else{L=(c[o>>2]&-2)+ -1|0}Kg(o,L,0);if((a[o]&1)==0){M=v}else{M=c[w>>2]|0}c[p>>2]=M+K;N=M}else{N=y}x=B+12|0;C=c[x>>2]|0;O=B+16|0;if((C|0)==(c[O>>2]|0)){P=Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0}else{P=c[C>>2]|0}if((ij(P,u,N,p,s,t,n,q,r,l)|0)!=0){F=E;G=N;break}C=c[x>>2]|0;if((C|0)==(c[O>>2]|0)){Nc[c[(c[B>>2]|0)+40>>2]&127](B)|0;m=B;y=N;continue}else{c[x>>2]=C+4;m=B;y=N;continue}}N=a[n]|0;if((N&1)==0){Q=(N&255)>>>1}else{Q=c[n+4>>2]|0}if((Q|0)!=0?(Q=c[r>>2]|0,(Q-q|0)<160):0){N=c[s>>2]|0;c[r>>2]=Q+4;c[Q>>2]=N}N=bo(G,c[p>>2]|0,j,u)|0;b[k>>1]=N;vl(n,q,c[r>>2]|0,j);if((B|0)!=0){r=c[B+12>>2]|0;if((r|0)==(c[B+16>>2]|0)){R=Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0}else{R=c[r>>2]|0}if((R|0)==-1){c[f>>2]=0;S=0;T=1}else{S=B;T=0}}else{S=0;T=1}do{if((F|0)!=0){B=c[F+12>>2]|0;if((B|0)==(c[F+16>>2]|0)){U=Nc[c[(c[F>>2]|0)+36>>2]&127](F)|0}else{U=c[B>>2]|0}if((U|0)==-1){c[g>>2]=0;H=60;break}if(T){c[d>>2]=S;Ig(o);Ig(n);i=e;return}}else{H=60}}while(0);if((H|0)==60?!T:0){c[d>>2]=S;Ig(o);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[d>>2]=S;Ig(o);Ig(n);i=e;return}function Xi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];Yi(a,0,k,j,f,g,h);i=b;return}function Yi(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;d=i;i=i+304|0;k=d+200|0;l=d+196|0;m=d+184|0;n=d+172|0;o=d+168|0;p=d+8|0;q=d+4|0;r=d;s=c[g+4>>2]&74;if((s|0)==8){t=16}else if((s|0)==0){t=0}else if((s|0)==64){t=8}else{t=10}mj(m,g,k,l);c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;Kg(n,10,0);if((a[n]&1)==0){g=n+1|0;u=g;v=n+8|0;w=g}else{g=n+8|0;u=n+1|0;v=g;w=c[g>>2]|0}c[o>>2]=w;c[q>>2]=p;c[r>>2]=0;g=n+4|0;s=c[l>>2]|0;l=c[e>>2]|0;x=w;a:while(1){if((l|0)!=0){w=c[l+12>>2]|0;if((w|0)==(c[l+16>>2]|0)){y=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{y=c[w>>2]|0}if((y|0)==-1){c[e>>2]=0;z=1;A=0}else{z=0;A=l}}else{z=1;A=0}w=c[f>>2]|0;do{if((w|0)!=0){B=c[w+12>>2]|0;if((B|0)==(c[w+16>>2]|0)){C=Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0}else{C=c[B>>2]|0}if(!((C|0)==-1)){if(z){D=w;break}else{E=w;F=x;break a}}else{c[f>>2]=0;G=21;break}}else{G=21}}while(0);if((G|0)==21){G=0;if(z){E=0;F=x;break}else{D=0}}w=a[n]|0;B=(w&1)==0;if(B){H=(w&255)>>>1}else{H=c[g>>2]|0}if(((c[o>>2]|0)-x|0)==(H|0)){if(B){I=(w&255)>>>1;J=(w&255)>>>1}else{w=c[g>>2]|0;I=w;J=w}Kg(n,I<<1,0);if((a[n]&1)==0){K=10}else{K=(c[n>>2]&-2)+ -1|0}Kg(n,K,0);if((a[n]&1)==0){L=u}else{L=c[v>>2]|0}c[o>>2]=L+J;M=L}else{M=x}w=A+12|0;B=c[w>>2]|0;N=A+16|0;if((B|0)==(c[N>>2]|0)){O=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{O=c[B>>2]|0}if((ij(O,t,M,o,r,s,m,p,q,k)|0)!=0){E=D;F=M;break}B=c[w>>2]|0;if((B|0)==(c[N>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0;l=A;x=M;continue}else{c[w>>2]=B+4;l=A;x=M;continue}}M=a[m]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[m+4>>2]|0}if((P|0)!=0?(P=c[q>>2]|0,(P-p|0)<160):0){M=c[r>>2]|0;c[q>>2]=P+4;c[P>>2]=M}M=ao(F,c[o>>2]|0,h,t)|0;c[j>>2]=M;vl(m,p,c[q>>2]|0,h);if((A|0)!=0){q=c[A+12>>2]|0;if((q|0)==(c[A+16>>2]|0)){Q=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{Q=c[q>>2]|0}if((Q|0)==-1){c[e>>2]=0;R=0;S=1}else{R=A;S=0}}else{R=0;S=1}do{if((E|0)!=0){A=c[E+12>>2]|0;if((A|0)==(c[E+16>>2]|0)){T=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{T=c[A>>2]|0}if((T|0)==-1){c[f>>2]=0;G=60;break}if(S){c[b>>2]=R;Ig(n);Ig(m);i=d;return}}else{G=60}}while(0);if((G|0)==60?!S:0){c[b>>2]=R;Ig(n);Ig(m);i=d;return}c[h>>2]=c[h>>2]|2;c[b>>2]=R;Ig(n);Ig(m);i=d;return}function Zi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];_i(a,0,k,j,f,g,h);i=b;return}function _i(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;d=i;i=i+304|0;k=d+200|0;l=d+196|0;m=d+184|0;n=d+172|0;o=d+168|0;p=d+8|0;q=d+4|0;r=d;s=c[g+4>>2]&74;if((s|0)==8){t=16}else if((s|0)==64){t=8}else if((s|0)==0){t=0}else{t=10}mj(m,g,k,l);c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;Kg(n,10,0);if((a[n]&1)==0){g=n+1|0;u=g;v=n+8|0;w=g}else{g=n+8|0;u=n+1|0;v=g;w=c[g>>2]|0}c[o>>2]=w;c[q>>2]=p;c[r>>2]=0;g=n+4|0;s=c[l>>2]|0;l=c[e>>2]|0;x=w;a:while(1){if((l|0)!=0){w=c[l+12>>2]|0;if((w|0)==(c[l+16>>2]|0)){y=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{y=c[w>>2]|0}if((y|0)==-1){c[e>>2]=0;z=1;A=0}else{z=0;A=l}}else{z=1;A=0}w=c[f>>2]|0;do{if((w|0)!=0){B=c[w+12>>2]|0;if((B|0)==(c[w+16>>2]|0)){C=Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0}else{C=c[B>>2]|0}if(!((C|0)==-1)){if(z){D=w;break}else{E=w;F=x;break a}}else{c[f>>2]=0;G=21;break}}else{G=21}}while(0);if((G|0)==21){G=0;if(z){E=0;F=x;break}else{D=0}}w=a[n]|0;B=(w&1)==0;if(B){H=(w&255)>>>1}else{H=c[g>>2]|0}if(((c[o>>2]|0)-x|0)==(H|0)){if(B){I=(w&255)>>>1;J=(w&255)>>>1}else{w=c[g>>2]|0;I=w;J=w}Kg(n,I<<1,0);if((a[n]&1)==0){K=10}else{K=(c[n>>2]&-2)+ -1|0}Kg(n,K,0);if((a[n]&1)==0){L=u}else{L=c[v>>2]|0}c[o>>2]=L+J;M=L}else{M=x}w=A+12|0;B=c[w>>2]|0;N=A+16|0;if((B|0)==(c[N>>2]|0)){O=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{O=c[B>>2]|0}if((ij(O,t,M,o,r,s,m,p,q,k)|0)!=0){E=D;F=M;break}B=c[w>>2]|0;if((B|0)==(c[N>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0;l=A;x=M;continue}else{c[w>>2]=B+4;l=A;x=M;continue}}M=a[m]|0;if((M&1)==0){P=(M&255)>>>1}else{P=c[m+4>>2]|0}if((P|0)!=0?(P=c[q>>2]|0,(P-p|0)<160):0){M=c[r>>2]|0;c[q>>2]=P+4;c[P>>2]=M}M=$n(F,c[o>>2]|0,h,t)|0;c[j>>2]=M;vl(m,p,c[q>>2]|0,h);if((A|0)!=0){q=c[A+12>>2]|0;if((q|0)==(c[A+16>>2]|0)){Q=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{Q=c[q>>2]|0}if((Q|0)==-1){c[e>>2]=0;R=0;S=1}else{R=A;S=0}}else{R=0;S=1}do{if((E|0)!=0){A=c[E+12>>2]|0;if((A|0)==(c[E+16>>2]|0)){T=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{T=c[A>>2]|0}if((T|0)==-1){c[f>>2]=0;G=60;break}if(S){c[b>>2]=R;Ig(n);Ig(m);i=d;return}}else{G=60}}while(0);if((G|0)==60?!S:0){c[b>>2]=R;Ig(n);Ig(m);i=d;return}c[h>>2]=c[h>>2]|2;c[b>>2]=R;Ig(n);Ig(m);i=d;return}function $i(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];aj(a,0,k,j,f,g,h);i=b;return}function aj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0;d=i;i=i+304|0;k=d+200|0;l=d+196|0;m=d+184|0;n=d+172|0;o=d+168|0;p=d+8|0;q=d+4|0;r=d;s=c[g+4>>2]&74;if((s|0)==64){t=8}else if((s|0)==8){t=16}else if((s|0)==0){t=0}else{t=10}mj(m,g,k,l);c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;Kg(n,10,0);if((a[n]&1)==0){g=n+1|0;u=g;v=n+8|0;w=g}else{g=n+8|0;u=n+1|0;v=g;w=c[g>>2]|0}c[o>>2]=w;c[q>>2]=p;c[r>>2]=0;g=n+4|0;s=c[l>>2]|0;l=c[e>>2]|0;x=w;a:while(1){if((l|0)!=0){w=c[l+12>>2]|0;if((w|0)==(c[l+16>>2]|0)){y=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{y=c[w>>2]|0}if((y|0)==-1){c[e>>2]=0;z=1;A=0}else{z=0;A=l}}else{z=1;A=0}w=c[f>>2]|0;do{if((w|0)!=0){B=c[w+12>>2]|0;if((B|0)==(c[w+16>>2]|0)){C=Nc[c[(c[w>>2]|0)+36>>2]&127](w)|0}else{C=c[B>>2]|0}if(!((C|0)==-1)){if(z){D=w;break}else{E=w;F=x;break a}}else{c[f>>2]=0;G=21;break}}else{G=21}}while(0);if((G|0)==21){G=0;if(z){E=0;F=x;break}else{D=0}}w=a[n]|0;B=(w&1)==0;if(B){H=(w&255)>>>1}else{H=c[g>>2]|0}if(((c[o>>2]|0)-x|0)==(H|0)){if(B){J=(w&255)>>>1;K=(w&255)>>>1}else{w=c[g>>2]|0;J=w;K=w}Kg(n,J<<1,0);if((a[n]&1)==0){L=10}else{L=(c[n>>2]&-2)+ -1|0}Kg(n,L,0);if((a[n]&1)==0){M=u}else{M=c[v>>2]|0}c[o>>2]=M+K;N=M}else{N=x}w=A+12|0;B=c[w>>2]|0;O=A+16|0;if((B|0)==(c[O>>2]|0)){P=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{P=c[B>>2]|0}if((ij(P,t,N,o,r,s,m,p,q,k)|0)!=0){E=D;F=N;break}B=c[w>>2]|0;if((B|0)==(c[O>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0;l=A;x=N;continue}else{c[w>>2]=B+4;l=A;x=N;continue}}N=a[m]|0;if((N&1)==0){Q=(N&255)>>>1}else{Q=c[m+4>>2]|0}if((Q|0)!=0?(Q=c[q>>2]|0,(Q-p|0)<160):0){N=c[r>>2]|0;c[q>>2]=Q+4;c[Q>>2]=N}N=_n(F,c[o>>2]|0,h,t)|0;t=j;c[t>>2]=N;c[t+4>>2]=I;vl(m,p,c[q>>2]|0,h);if((A|0)!=0){q=c[A+12>>2]|0;if((q|0)==(c[A+16>>2]|0)){R=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{R=c[q>>2]|0}if((R|0)==-1){c[e>>2]=0;S=0;T=1}else{S=A;T=0}}else{S=0;T=1}do{if((E|0)!=0){A=c[E+12>>2]|0;if((A|0)==(c[E+16>>2]|0)){U=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{U=c[A>>2]|0}if((U|0)==-1){c[f>>2]=0;G=60;break}if(T){c[b>>2]=S;Ig(n);Ig(m);i=d;return}}else{G=60}}while(0);if((G|0)==60?!T:0){c[b>>2]=S;Ig(n);Ig(m);i=d;return}c[h>>2]=c[h>>2]|2;c[b>>2]=S;Ig(n);Ig(m);i=d;return}function bj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];cj(a,0,k,j,f,g,h);i=b;return}function cj(b,d,e,f,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0.0,U=0,V=0,W=0,X=0;d=i;i=i+352|0;l=d+208|0;m=d+200|0;n=d+196|0;o=d+184|0;p=d+172|0;q=d+168|0;r=d+8|0;s=d+4|0;t=d;u=d+337|0;v=d+336|0;nj(o,h,l,m,n);c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;Kg(p,10,0);if((a[p]&1)==0){h=p+1|0;w=h;x=p+8|0;y=h}else{h=p+8|0;w=p+1|0;x=h;y=c[h>>2]|0}c[q>>2]=y;c[s>>2]=r;c[t>>2]=0;a[u]=1;a[v]=69;h=p+4|0;z=c[m>>2]|0;m=c[n>>2]|0;n=c[e>>2]|0;A=y;a:while(1){if((n|0)!=0){y=c[n+12>>2]|0;if((y|0)==(c[n+16>>2]|0)){B=Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0}else{B=c[y>>2]|0}if((B|0)==-1){c[e>>2]=0;C=1;D=0}else{C=0;D=n}}else{C=1;D=0}y=c[f>>2]|0;do{if((y|0)!=0){E=c[y+12>>2]|0;if((E|0)==(c[y+16>>2]|0)){F=Nc[c[(c[y>>2]|0)+36>>2]&127](y)|0}else{F=c[E>>2]|0}if(!((F|0)==-1)){if(C){G=y;break}else{H=y;I=A;break a}}else{c[f>>2]=0;J=17;break}}else{J=17}}while(0);if((J|0)==17){J=0;if(C){H=0;I=A;break}else{G=0}}y=a[p]|0;E=(y&1)==0;if(E){K=(y&255)>>>1}else{K=c[h>>2]|0}if(((c[q>>2]|0)-A|0)==(K|0)){if(E){L=(y&255)>>>1;M=(y&255)>>>1}else{y=c[h>>2]|0;L=y;M=y}Kg(p,L<<1,0);if((a[p]&1)==0){N=10}else{N=(c[p>>2]&-2)+ -1|0}Kg(p,N,0);if((a[p]&1)==0){O=w}else{O=c[x>>2]|0}c[q>>2]=O+M;P=O}else{P=A}y=D+12|0;E=c[y>>2]|0;Q=D+16|0;if((E|0)==(c[Q>>2]|0)){R=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{R=c[E>>2]|0}if((oj(R,u,v,P,q,z,m,o,r,s,t,l)|0)!=0){H=G;I=P;break}E=c[y>>2]|0;if((E|0)==(c[Q>>2]|0)){Nc[c[(c[D>>2]|0)+40>>2]&127](D)|0;n=D;A=P;continue}else{c[y>>2]=E+4;n=D;A=P;continue}}P=a[o]|0;if((P&1)==0){S=(P&255)>>>1}else{S=c[o+4>>2]|0}if(((S|0)!=0?(a[u]|0)!=0:0)?(u=c[s>>2]|0,(u-r|0)<160):0){S=c[t>>2]|0;c[s>>2]=u+4;c[u>>2]=S}T=+Zn(I,c[q>>2]|0,j);g[k>>2]=T;vl(o,r,c[s>>2]|0,j);if((D|0)!=0){s=c[D+12>>2]|0;if((s|0)==(c[D+16>>2]|0)){U=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{U=c[s>>2]|0}if((U|0)==-1){c[e>>2]=0;V=0;W=1}else{V=D;W=0}}else{V=0;W=1}do{if((H|0)!=0){D=c[H+12>>2]|0;if((D|0)==(c[H+16>>2]|0)){X=Nc[c[(c[H>>2]|0)+36>>2]&127](H)|0}else{X=c[D>>2]|0}if((X|0)==-1){c[f>>2]=0;J=57;break}if(W){c[b>>2]=V;Ig(p);Ig(o);i=d;return}}else{J=57}}while(0);if((J|0)==57?!W:0){c[b>>2]=V;Ig(p);Ig(o);i=d;return}c[j>>2]=c[j>>2]|2;c[b>>2]=V;Ig(p);Ig(o);i=d;return}function dj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];ej(a,0,k,j,f,g,h);i=b;return}function ej(b,d,e,f,g,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0.0,U=0,V=0,W=0,X=0;d=i;i=i+352|0;l=d+208|0;m=d+200|0;n=d+196|0;o=d+184|0;p=d+172|0;q=d+168|0;r=d+8|0;s=d+4|0;t=d;u=d+337|0;v=d+336|0;nj(o,g,l,m,n);c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;Kg(p,10,0);if((a[p]&1)==0){g=p+1|0;w=g;x=p+8|0;y=g}else{g=p+8|0;w=p+1|0;x=g;y=c[g>>2]|0}c[q>>2]=y;c[s>>2]=r;c[t>>2]=0;a[u]=1;a[v]=69;g=p+4|0;z=c[m>>2]|0;m=c[n>>2]|0;n=c[e>>2]|0;A=y;a:while(1){if((n|0)!=0){y=c[n+12>>2]|0;if((y|0)==(c[n+16>>2]|0)){B=Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0}else{B=c[y>>2]|0}if((B|0)==-1){c[e>>2]=0;C=1;D=0}else{C=0;D=n}}else{C=1;D=0}y=c[f>>2]|0;do{if((y|0)!=0){E=c[y+12>>2]|0;if((E|0)==(c[y+16>>2]|0)){F=Nc[c[(c[y>>2]|0)+36>>2]&127](y)|0}else{F=c[E>>2]|0}if(!((F|0)==-1)){if(C){G=y;break}else{H=y;I=A;break a}}else{c[f>>2]=0;J=17;break}}else{J=17}}while(0);if((J|0)==17){J=0;if(C){H=0;I=A;break}else{G=0}}y=a[p]|0;E=(y&1)==0;if(E){K=(y&255)>>>1}else{K=c[g>>2]|0}if(((c[q>>2]|0)-A|0)==(K|0)){if(E){L=(y&255)>>>1;M=(y&255)>>>1}else{y=c[g>>2]|0;L=y;M=y}Kg(p,L<<1,0);if((a[p]&1)==0){N=10}else{N=(c[p>>2]&-2)+ -1|0}Kg(p,N,0);if((a[p]&1)==0){O=w}else{O=c[x>>2]|0}c[q>>2]=O+M;P=O}else{P=A}y=D+12|0;E=c[y>>2]|0;Q=D+16|0;if((E|0)==(c[Q>>2]|0)){R=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{R=c[E>>2]|0}if((oj(R,u,v,P,q,z,m,o,r,s,t,l)|0)!=0){H=G;I=P;break}E=c[y>>2]|0;if((E|0)==(c[Q>>2]|0)){Nc[c[(c[D>>2]|0)+40>>2]&127](D)|0;n=D;A=P;continue}else{c[y>>2]=E+4;n=D;A=P;continue}}P=a[o]|0;if((P&1)==0){S=(P&255)>>>1}else{S=c[o+4>>2]|0}if(((S|0)!=0?(a[u]|0)!=0:0)?(u=c[s>>2]|0,(u-r|0)<160):0){S=c[t>>2]|0;c[s>>2]=u+4;c[u>>2]=S}T=+Yn(I,c[q>>2]|0,j);h[k>>3]=T;vl(o,r,c[s>>2]|0,j);if((D|0)!=0){s=c[D+12>>2]|0;if((s|0)==(c[D+16>>2]|0)){U=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{U=c[s>>2]|0}if((U|0)==-1){c[e>>2]=0;V=0;W=1}else{V=D;W=0}}else{V=0;W=1}do{if((H|0)!=0){D=c[H+12>>2]|0;if((D|0)==(c[H+16>>2]|0)){X=Nc[c[(c[H>>2]|0)+36>>2]&127](H)|0}else{X=c[D>>2]|0}if((X|0)==-1){c[f>>2]=0;J=57;break}if(W){c[b>>2]=V;Ig(p);Ig(o);i=d;return}}else{J=57}}while(0);if((J|0)==57?!W:0){c[b>>2]=V;Ig(p);Ig(o);i=d;return}c[j>>2]=c[j>>2]|2;c[b>>2]=V;Ig(p);Ig(o);i=d;return}function fj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];gj(a,0,k,j,f,g,h);i=b;return}function gj(b,d,e,f,g,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0.0,U=0,V=0,W=0,X=0;d=i;i=i+352|0;l=d+208|0;m=d+200|0;n=d+196|0;o=d+184|0;p=d+172|0;q=d+168|0;r=d+8|0;s=d+4|0;t=d;u=d+337|0;v=d+336|0;nj(o,g,l,m,n);c[p+0>>2]=0;c[p+4>>2]=0;c[p+8>>2]=0;Kg(p,10,0);if((a[p]&1)==0){g=p+1|0;w=g;x=p+8|0;y=g}else{g=p+8|0;w=p+1|0;x=g;y=c[g>>2]|0}c[q>>2]=y;c[s>>2]=r;c[t>>2]=0;a[u]=1;a[v]=69;g=p+4|0;z=c[m>>2]|0;m=c[n>>2]|0;n=c[e>>2]|0;A=y;a:while(1){if((n|0)!=0){y=c[n+12>>2]|0;if((y|0)==(c[n+16>>2]|0)){B=Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0}else{B=c[y>>2]|0}if((B|0)==-1){c[e>>2]=0;C=1;D=0}else{C=0;D=n}}else{C=1;D=0}y=c[f>>2]|0;do{if((y|0)!=0){E=c[y+12>>2]|0;if((E|0)==(c[y+16>>2]|0)){F=Nc[c[(c[y>>2]|0)+36>>2]&127](y)|0}else{F=c[E>>2]|0}if(!((F|0)==-1)){if(C){G=y;break}else{H=y;I=A;break a}}else{c[f>>2]=0;J=17;break}}else{J=17}}while(0);if((J|0)==17){J=0;if(C){H=0;I=A;break}else{G=0}}y=a[p]|0;E=(y&1)==0;if(E){K=(y&255)>>>1}else{K=c[g>>2]|0}if(((c[q>>2]|0)-A|0)==(K|0)){if(E){L=(y&255)>>>1;M=(y&255)>>>1}else{y=c[g>>2]|0;L=y;M=y}Kg(p,L<<1,0);if((a[p]&1)==0){N=10}else{N=(c[p>>2]&-2)+ -1|0}Kg(p,N,0);if((a[p]&1)==0){O=w}else{O=c[x>>2]|0}c[q>>2]=O+M;P=O}else{P=A}y=D+12|0;E=c[y>>2]|0;Q=D+16|0;if((E|0)==(c[Q>>2]|0)){R=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{R=c[E>>2]|0}if((oj(R,u,v,P,q,z,m,o,r,s,t,l)|0)!=0){H=G;I=P;break}E=c[y>>2]|0;if((E|0)==(c[Q>>2]|0)){Nc[c[(c[D>>2]|0)+40>>2]&127](D)|0;n=D;A=P;continue}else{c[y>>2]=E+4;n=D;A=P;continue}}P=a[o]|0;if((P&1)==0){S=(P&255)>>>1}else{S=c[o+4>>2]|0}if(((S|0)!=0?(a[u]|0)!=0:0)?(u=c[s>>2]|0,(u-r|0)<160):0){S=c[t>>2]|0;c[s>>2]=u+4;c[u>>2]=S}T=+Xn(I,c[q>>2]|0,j);h[k>>3]=T;vl(o,r,c[s>>2]|0,j);if((D|0)!=0){s=c[D+12>>2]|0;if((s|0)==(c[D+16>>2]|0)){U=Nc[c[(c[D>>2]|0)+36>>2]&127](D)|0}else{U=c[s>>2]|0}if((U|0)==-1){c[e>>2]=0;V=0;W=1}else{V=D;W=0}}else{V=0;W=1}do{if((H|0)!=0){D=c[H+12>>2]|0;if((D|0)==(c[H+16>>2]|0)){X=Nc[c[(c[H>>2]|0)+36>>2]&127](H)|0}else{X=c[D>>2]|0}if((X|0)==-1){c[f>>2]=0;J=57;break}if(W){c[b>>2]=V;Ig(p);Ig(o);i=d;return}}else{J=57}}while(0);if((J|0)==57?!W:0){c[b>>2]=V;Ig(p);Ig(o);i=d;return}c[j>>2]=c[j>>2]|2;c[b>>2]=V;Ig(p);Ig(o);i=d;return}function hj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0;d=i;i=i+320|0;k=d;l=d+208|0;m=d+192|0;n=d+188|0;o=d+176|0;p=d+16|0;c[m+0>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;ah(n,g);g=c[n>>2]|0;if(!((c[4916]|0)==-1)){c[k>>2]=19664;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19664,k,137)}q=(c[19668>>2]|0)+ -1|0;r=c[g+8>>2]|0;if(!((c[g+12>>2]|0)-r>>2>>>0>q>>>0)){s=Fb(4)|0;Ao(s);zc(s|0,27632,123)}g=c[r+(q<<2)>>2]|0;if((g|0)==0){s=Fb(4)|0;Ao(s);zc(s|0,27632,123)}Tc[c[(c[g>>2]|0)+48>>2]&7](g,18216,18242|0,l)|0;jg(c[n>>2]|0)|0;c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){n=o+1|0;t=n;u=o+8|0;v=n}else{n=o+8|0;t=o+1|0;u=n;v=c[n>>2]|0}n=o+4|0;g=l+96|0;s=l+100|0;q=p;r=l+104|0;w=l;x=m+4|0;y=c[e>>2]|0;z=p;p=0;A=v;B=v;a:while(1){if((y|0)!=0){v=c[y+12>>2]|0;if((v|0)==(c[y+16>>2]|0)){C=Nc[c[(c[y>>2]|0)+36>>2]&127](y)|0}else{C=c[v>>2]|0}if((C|0)==-1){c[e>>2]=0;D=1;E=0}else{D=0;E=y}}else{D=1;E=0}v=c[f>>2]|0;do{if((v|0)!=0){F=c[v+12>>2]|0;if((F|0)==(c[v+16>>2]|0)){G=Nc[c[(c[v>>2]|0)+36>>2]&127](v)|0}else{G=c[F>>2]|0}if(!((G|0)==-1)){if(D){break}else{H=B;break a}}else{c[f>>2]=0;I=22;break}}else{I=22}}while(0);if((I|0)==22?(I=0,D):0){H=B;break}v=a[o]|0;F=(v&1)==0;if(F){J=(v&255)>>>1}else{J=c[n>>2]|0}if((A-B|0)==(J|0)){if(F){K=(v&255)>>>1;L=(v&255)>>>1}else{v=c[n>>2]|0;K=v;L=v}Kg(o,K<<1,0);if((a[o]&1)==0){M=10}else{M=(c[o>>2]&-2)+ -1|0}Kg(o,M,0);if((a[o]&1)==0){N=t}else{N=c[u>>2]|0}O=N+L|0;P=N}else{O=A;P=B}v=c[E+12>>2]|0;if((v|0)==(c[E+16>>2]|0)){Q=Nc[c[(c[E>>2]|0)+36>>2]&127](E)|0}else{Q=c[v>>2]|0}v=(O|0)==(P|0);do{if(v){F=(c[g>>2]|0)==(Q|0);if(!F?(c[s>>2]|0)!=(Q|0):0){I=43;break}a[O]=F?43:45;R=O+1|0;S=z;T=0}else{I=43}}while(0);do{if((I|0)==43){I=0;F=a[m]|0;if((F&1)==0){U=(F&255)>>>1}else{U=c[x>>2]|0}if((U|0)!=0&(Q|0)==0){if((z-q|0)>=160){R=O;S=z;T=p;break}c[z>>2]=p;R=O;S=z+4|0;T=0;break}else{V=l}while(1){F=V+4|0;if((c[V>>2]|0)==(Q|0)){W=V;break}if((F|0)==(r|0)){W=r;break}else{V=F}}F=W-w|0;X=F>>2;if((F|0)>92){H=P;break a}if((F|0)<88){a[O]=a[18216+X|0]|0;R=O+1|0;S=z;T=p+1|0;break}if(v){H=O;break a}if((O-P|0)>=3){H=P;break a}if((a[O+ -1|0]|0)!=48){H=P;break a}a[O]=a[18216+X|0]|0;R=O+1|0;S=z;T=0}}while(0);v=c[e>>2]|0;X=v+12|0;F=c[X>>2]|0;if((F|0)==(c[v+16>>2]|0)){Nc[c[(c[v>>2]|0)+40>>2]&127](v)|0;y=v;z=S;p=T;A=R;B=P;continue}else{c[X>>2]=F+4;y=v;z=S;p=T;A=R;B=P;continue}}a[H+3|0]=0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){P=kb(2147483647,19576,0)|0;c[4890]=P;gb(19568)}P=c[4890]|0;c[k>>2]=j;if((Mi(H,P,18256,k)|0)!=1){c[h>>2]=4}k=c[e>>2]|0;if((k|0)!=0){P=c[k+12>>2]|0;if((P|0)==(c[k+16>>2]|0)){Y=Nc[c[(c[k>>2]|0)+36>>2]&127](k)|0}else{Y=c[P>>2]|0}if((Y|0)==-1){c[e>>2]=0;Z=0;_=1}else{Z=k;_=0}}else{Z=0;_=1}k=c[f>>2]|0;do{if((k|0)!=0){e=c[k+12>>2]|0;if((e|0)==(c[k+16>>2]|0)){$=Nc[c[(c[k>>2]|0)+36>>2]&127](k)|0}else{$=c[e>>2]|0}if(($|0)==-1){c[f>>2]=0;I=78;break}if(_){c[b>>2]=Z;Ig(o);Ig(m);i=d;return}}else{I=78}}while(0);if((I|0)==78?!_:0){c[b>>2]=Z;Ig(o);Ig(m);i=d;return}c[h>>2]=c[h>>2]|2;c[b>>2]=Z;Ig(o);Ig(m);i=d;return}function ij(b,d,e,f,g,h,j,k,l,m){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0;n=i;o=c[f>>2]|0;p=(o|0)==(e|0);do{if(p){q=(c[m+96>>2]|0)==(b|0);if(!q?(c[m+100>>2]|0)!=(b|0):0){break}c[f>>2]=e+1;a[e]=q?43:45;c[g>>2]=0;r=0;i=n;return r|0}}while(0);q=a[j]|0;if((q&1)==0){s=(q&255)>>>1}else{s=c[j+4>>2]|0}if((s|0)!=0&(b|0)==(h|0)){h=c[l>>2]|0;if((h-k|0)>=160){r=0;i=n;return r|0}k=c[g>>2]|0;c[l>>2]=h+4;c[h>>2]=k;c[g>>2]=0;r=0;i=n;return r|0}k=m+104|0;h=m;while(1){l=h+4|0;if((c[h>>2]|0)==(b|0)){t=h;break}if((l|0)==(k|0)){t=k;break}else{h=l}}h=t-m|0;m=h>>2;if((h|0)>92){r=-1;i=n;return r|0}if((d|0)==16){if((h|0)>=88){if(p){r=-1;i=n;return r|0}if((o-e|0)>=3){r=-1;i=n;return r|0}if((a[o+ -1|0]|0)!=48){r=-1;i=n;return r|0}c[g>>2]=0;e=a[18216+m|0]|0;c[f>>2]=o+1;a[o]=e;r=0;i=n;return r|0}}else if((d|0)==10|(d|0)==8?(m|0)>=(d|0):0){r=-1;i=n;return r|0}d=a[18216+m|0]|0;c[f>>2]=o+1;a[o]=d;c[g>>2]=(c[g>>2]|0)+1;r=0;i=n;return r|0}function jj(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;i=i+16|0;h=g;j=g+12|0;ah(j,d);d=c[j>>2]|0;if(!((c[4918]|0)==-1)){c[h>>2]=19672;c[h+4>>2]=136;c[h+8>>2]=0;Dg(19672,h,137)}k=(c[19676>>2]|0)+ -1|0;l=c[d+8>>2]|0;if(!((c[d+12>>2]|0)-l>>2>>>0>k>>>0)){m=Fb(4)|0;Ao(m);zc(m|0,27632,123)}d=c[l+(k<<2)>>2]|0;if((d|0)==0){m=Fb(4)|0;Ao(m);zc(m|0,27632,123)}Tc[c[(c[d>>2]|0)+32>>2]&7](d,18216,18242|0,e)|0;e=c[j>>2]|0;if(!((c[4954]|0)==-1)){c[h>>2]=19816;c[h+4>>2]=136;c[h+8>>2]=0;Dg(19816,h,137)}h=(c[19820>>2]|0)+ -1|0;d=c[e+8>>2]|0;if(!((c[e+12>>2]|0)-d>>2>>>0>h>>>0)){n=Fb(4)|0;Ao(n);zc(n|0,27632,123)}e=c[d+(h<<2)>>2]|0;if((e|0)==0){n=Fb(4)|0;Ao(n);zc(n|0,27632,123)}else{n=Nc[c[(c[e>>2]|0)+16>>2]&127](e)|0;a[f]=n;Lc[c[(c[e>>2]|0)+20>>2]&63](b,e);jg(c[j>>2]|0)|0;i=g;return}}function kj(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0;h=i;i=i+16|0;j=h;k=h+12|0;ah(k,d);d=c[k>>2]|0;if(!((c[4918]|0)==-1)){c[j>>2]=19672;c[j+4>>2]=136;c[j+8>>2]=0;Dg(19672,j,137)}l=(c[19676>>2]|0)+ -1|0;m=c[d+8>>2]|0;if(!((c[d+12>>2]|0)-m>>2>>>0>l>>>0)){n=Fb(4)|0;Ao(n);zc(n|0,27632,123)}d=c[m+(l<<2)>>2]|0;if((d|0)==0){n=Fb(4)|0;Ao(n);zc(n|0,27632,123)}Tc[c[(c[d>>2]|0)+32>>2]&7](d,18216,18248|0,e)|0;e=c[k>>2]|0;if(!((c[4954]|0)==-1)){c[j>>2]=19816;c[j+4>>2]=136;c[j+8>>2]=0;Dg(19816,j,137)}j=(c[19820>>2]|0)+ -1|0;d=c[e+8>>2]|0;if(!((c[e+12>>2]|0)-d>>2>>>0>j>>>0)){o=Fb(4)|0;Ao(o);zc(o|0,27632,123)}e=c[d+(j<<2)>>2]|0;if((e|0)==0){o=Fb(4)|0;Ao(o);zc(o|0,27632,123)}else{o=Nc[c[(c[e>>2]|0)+12>>2]&127](e)|0;a[f]=o;o=Nc[c[(c[e>>2]|0)+16>>2]&127](e)|0;a[g]=o;Lc[c[(c[e>>2]|0)+20>>2]&63](b,e);jg(c[k>>2]|0)|0;i=h;return}}function lj(b,d,e,f,g,h,j,k,l,m,n,o){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;var p=0,q=0,r=0,s=0,t=0,u=0;p=i;if(b<<24>>24==h<<24>>24){if((a[d]|0)==0){q=-1;i=p;return q|0}a[d]=0;h=c[g>>2]|0;c[g>>2]=h+1;a[h]=46;h=a[k]|0;if((h&1)==0){r=(h&255)>>>1}else{r=c[k+4>>2]|0}if((r|0)==0){q=0;i=p;return q|0}r=c[m>>2]|0;if((r-l|0)>=160){q=0;i=p;return q|0}h=c[n>>2]|0;c[m>>2]=r+4;c[r>>2]=h;q=0;i=p;return q|0}if(b<<24>>24==j<<24>>24){j=a[k]|0;if((j&1)==0){s=(j&255)>>>1}else{s=c[k+4>>2]|0}if((s|0)!=0){if((a[d]|0)==0){q=-1;i=p;return q|0}s=c[m>>2]|0;if((s-l|0)>=160){q=0;i=p;return q|0}j=c[n>>2]|0;c[m>>2]=s+4;c[s>>2]=j;c[n>>2]=0;q=0;i=p;return q|0}}j=o+32|0;s=o;while(1){h=s+1|0;if((a[s]|0)==b<<24>>24){t=s;break}if((h|0)==(j|0)){t=j;break}else{s=h}}s=t-o|0;if((s|0)>31){q=-1;i=p;return q|0}o=a[18216+s|0]|0;if((s|0)==24|(s|0)==25){t=c[g>>2]|0;if((t|0)!=(f|0)?(a[t+ -1|0]&95|0)!=(a[e]&127|0):0){q=-1;i=p;return q|0}c[g>>2]=t+1;a[t]=o;q=0;i=p;return q|0}else if((s|0)==23|(s|0)==22){a[e]=80;t=c[g>>2]|0;c[g>>2]=t+1;a[t]=o;q=0;i=p;return q|0}else{t=o&95;if((t|0)==(a[e]|0)?(a[e]=t|128,(a[d]|0)!=0):0){a[d]=0;d=a[k]|0;if((d&1)==0){u=(d&255)>>>1}else{u=c[k+4>>2]|0}if((u|0)!=0?(u=c[m>>2]|0,(u-l|0)<160):0){l=c[n>>2]|0;c[m>>2]=u+4;c[u>>2]=l}}l=c[g>>2]|0;c[g>>2]=l+1;a[l]=o;if((s|0)>21){q=0;i=p;return q|0}c[n>>2]=(c[n>>2]|0)+1;q=0;i=p;return q|0}return 0}function mj(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+16|0;g=f;h=f+12|0;ah(h,b);b=c[h>>2]|0;if(!((c[4916]|0)==-1)){c[g>>2]=19664;c[g+4>>2]=136;c[g+8>>2]=0;Dg(19664,g,137)}j=(c[19668>>2]|0)+ -1|0;k=c[b+8>>2]|0;if(!((c[b+12>>2]|0)-k>>2>>>0>j>>>0)){l=Fb(4)|0;Ao(l);zc(l|0,27632,123)}b=c[k+(j<<2)>>2]|0;if((b|0)==0){l=Fb(4)|0;Ao(l);zc(l|0,27632,123)}Tc[c[(c[b>>2]|0)+48>>2]&7](b,18216,18242|0,d)|0;d=c[h>>2]|0;if(!((c[4956]|0)==-1)){c[g>>2]=19824;c[g+4>>2]=136;c[g+8>>2]=0;Dg(19824,g,137)}g=(c[19828>>2]|0)+ -1|0;b=c[d+8>>2]|0;if(!((c[d+12>>2]|0)-b>>2>>>0>g>>>0)){m=Fb(4)|0;Ao(m);zc(m|0,27632,123)}d=c[b+(g<<2)>>2]|0;if((d|0)==0){m=Fb(4)|0;Ao(m);zc(m|0,27632,123)}else{m=Nc[c[(c[d>>2]|0)+16>>2]&127](d)|0;c[e>>2]=m;Lc[c[(c[d>>2]|0)+20>>2]&63](a,d);jg(c[h>>2]|0)|0;i=f;return}}function nj(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;i=i+16|0;h=g;j=g+12|0;ah(j,b);b=c[j>>2]|0;if(!((c[4916]|0)==-1)){c[h>>2]=19664;c[h+4>>2]=136;c[h+8>>2]=0;Dg(19664,h,137)}k=(c[19668>>2]|0)+ -1|0;l=c[b+8>>2]|0;if(!((c[b+12>>2]|0)-l>>2>>>0>k>>>0)){m=Fb(4)|0;Ao(m);zc(m|0,27632,123)}b=c[l+(k<<2)>>2]|0;if((b|0)==0){m=Fb(4)|0;Ao(m);zc(m|0,27632,123)}Tc[c[(c[b>>2]|0)+48>>2]&7](b,18216,18248|0,d)|0;d=c[j>>2]|0;if(!((c[4956]|0)==-1)){c[h>>2]=19824;c[h+4>>2]=136;c[h+8>>2]=0;Dg(19824,h,137)}h=(c[19828>>2]|0)+ -1|0;b=c[d+8>>2]|0;if(!((c[d+12>>2]|0)-b>>2>>>0>h>>>0)){n=Fb(4)|0;Ao(n);zc(n|0,27632,123)}d=c[b+(h<<2)>>2]|0;if((d|0)==0){n=Fb(4)|0;Ao(n);zc(n|0,27632,123)}else{n=Nc[c[(c[d>>2]|0)+12>>2]&127](d)|0;c[e>>2]=n;n=Nc[c[(c[d>>2]|0)+16>>2]&127](d)|0;c[f>>2]=n;Lc[c[(c[d>>2]|0)+20>>2]&63](a,d);jg(c[j>>2]|0)|0;i=g;return}}function oj(b,d,e,f,g,h,j,k,l,m,n,o){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;var p=0,q=0,r=0,s=0,t=0,u=0;p=i;if((b|0)==(h|0)){if((a[d]|0)==0){q=-1;i=p;return q|0}a[d]=0;h=c[g>>2]|0;c[g>>2]=h+1;a[h]=46;h=a[k]|0;if((h&1)==0){r=(h&255)>>>1}else{r=c[k+4>>2]|0}if((r|0)==0){q=0;i=p;return q|0}r=c[m>>2]|0;if((r-l|0)>=160){q=0;i=p;return q|0}h=c[n>>2]|0;c[m>>2]=r+4;c[r>>2]=h;q=0;i=p;return q|0}if((b|0)==(j|0)){j=a[k]|0;if((j&1)==0){s=(j&255)>>>1}else{s=c[k+4>>2]|0}if((s|0)!=0){if((a[d]|0)==0){q=-1;i=p;return q|0}s=c[m>>2]|0;if((s-l|0)>=160){q=0;i=p;return q|0}j=c[n>>2]|0;c[m>>2]=s+4;c[s>>2]=j;c[n>>2]=0;q=0;i=p;return q|0}}j=o+128|0;s=o;while(1){h=s+4|0;if((c[s>>2]|0)==(b|0)){t=s;break}if((h|0)==(j|0)){t=j;break}else{s=h}}s=t-o|0;o=s>>2;if((s|0)>124){q=-1;i=p;return q|0}t=a[18216+o|0]|0;if((o|0)==24|(o|0)==25){j=c[g>>2]|0;if((j|0)!=(f|0)?(a[j+ -1|0]&95|0)!=(a[e]&127|0):0){q=-1;i=p;return q|0}c[g>>2]=j+1;a[j]=t;q=0;i=p;return q|0}else if(!((o|0)==23|(o|0)==22)){o=t&95;if((o|0)==(a[e]|0)?(a[e]=o|128,(a[d]|0)!=0):0){a[d]=0;d=a[k]|0;if((d&1)==0){u=(d&255)>>>1}else{u=c[k+4>>2]|0}if((u|0)!=0?(u=c[m>>2]|0,(u-l|0)<160):0){l=c[n>>2]|0;c[m>>2]=u+4;c[u>>2]=l}}}else{a[e]=80}e=c[g>>2]|0;c[g>>2]=e+1;a[e]=t;if((s|0)>84){q=0;i=p;return q|0}c[n>>2]=(c[n>>2]|0)+1;q=0;i=p;return q|0}function pj(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function qj(a){a=a|0;return}function rj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;j=i;i=i+32|0;k=j;l=j+28|0;m=j+24|0;n=j+12|0;if((c[f+4>>2]&1|0)==0){o=c[(c[d>>2]|0)+24>>2]|0;c[l>>2]=c[e>>2];p=h&1;c[k+0>>2]=c[l+0>>2];Vc[o&15](b,d,k,f,g,p);i=j;return}ah(m,f);f=c[m>>2]|0;if(!((c[4954]|0)==-1)){c[k>>2]=19816;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19816,k,137)}k=(c[19820>>2]|0)+ -1|0;p=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-p>>2>>>0>k>>>0)){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}f=c[p+(k<<2)>>2]|0;if((f|0)==0){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}jg(c[m>>2]|0)|0;m=c[f>>2]|0;if(h){Lc[c[m+24>>2]&63](n,f)}else{Lc[c[m+28>>2]&63](n,f)}f=a[n]|0;if((f&1)==0){m=n+1|0;r=m;s=m;t=n+8|0}else{m=n+8|0;r=c[m>>2]|0;s=n+1|0;t=m}m=n+4|0;h=f;f=r;while(1){if((h&1)==0){u=s;v=(h&255)>>>1}else{u=c[t>>2]|0;v=c[m>>2]|0}if((f|0)==(u+v|0)){break}r=a[f]|0;q=c[e>>2]|0;do{if((q|0)!=0){k=q+24|0;p=c[k>>2]|0;if((p|0)!=(c[q+28>>2]|0)){c[k>>2]=p+1;a[p]=r;break}if((Wc[c[(c[q>>2]|0)+52>>2]&15](q,r&255)|0)==-1){c[e>>2]=0}}}while(0);h=a[n]|0;f=f+1|0}c[b>>2]=c[e>>2];Ig(n);i=j;return}function sj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+64|0;j=d;k=d+56|0;l=d+44|0;m=d+20|0;n=d+16|0;o=d+12|0;p=d+8|0;q=d+4|0;a[k+0|0]=a[18464|0]|0;a[k+1|0]=a[18465|0]|0;a[k+2|0]=a[18466|0]|0;a[k+3|0]=a[18467|0]|0;a[k+4|0]=a[18468|0]|0;a[k+5|0]=a[18469|0]|0;r=k+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=k+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else if((v|0)==64){a[u]=111}else{a[u]=100}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){u=kb(2147483647,19576,0)|0;c[4890]=u;gb(19568)}u=c[4890]|0;c[j>>2]=h;h=tj(l,12,u,k,j)|0;k=l+h|0;u=c[s>>2]&176;do{if((u|0)==32){w=k}else if((u|0)==16){s=a[l]|0;if(s<<24>>24==43|s<<24>>24==45){w=l+1|0;break}if((h|0)>1&s<<24>>24==48?(s=a[l+1|0]|0,s<<24>>24==88|s<<24>>24==120):0){w=l+2|0}else{x=20}}else{x=20}}while(0);if((x|0)==20){w=l}ah(p,f);uj(l,w,k,m,n,o,p);jg(c[p>>2]|0)|0;c[q>>2]=c[e>>2];e=c[n>>2]|0;n=c[o>>2]|0;c[j+0>>2]=c[q+0>>2];vj(b,j,m,e,n,f,g);i=d;return}function tj(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=i;i=i+16|0;h=g;c[h>>2]=f;f=Jb(d|0)|0;d=ub(a|0,b|0,e|0,h|0)|0;if((f|0)==0){i=g;return d|0}Jb(f|0)|0;i=g;return d|0}function uj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;k=i;i=i+32|0;l=k;m=k+12|0;n=c[j>>2]|0;if(!((c[4918]|0)==-1)){c[l>>2]=19672;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19672,l,137)}o=(c[19676>>2]|0)+ -1|0;p=c[n+8>>2]|0;if(!((c[n+12>>2]|0)-p>>2>>>0>o>>>0)){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}n=c[p+(o<<2)>>2]|0;if((n|0)==0){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}q=c[j>>2]|0;if(!((c[4954]|0)==-1)){c[l>>2]=19816;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19816,l,137)}l=(c[19820>>2]|0)+ -1|0;j=c[q+8>>2]|0;if(!((c[q+12>>2]|0)-j>>2>>>0>l>>>0)){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}q=c[j+(l<<2)>>2]|0;if((q|0)==0){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}Lc[c[(c[q>>2]|0)+20>>2]&63](m,q);r=a[m]|0;if((r&1)==0){s=(r&255)>>>1}else{s=c[m+4>>2]|0}if((s|0)!=0){c[h>>2]=f;s=a[b]|0;if(s<<24>>24==43|s<<24>>24==45){r=Wc[c[(c[n>>2]|0)+28>>2]&15](n,s)|0;s=c[h>>2]|0;c[h>>2]=s+1;a[s]=r;t=b+1|0}else{t=b}if(((e-t|0)>1?(a[t]|0)==48:0)?(r=t+1|0,s=a[r]|0,s<<24>>24==88|s<<24>>24==120):0){s=Wc[c[(c[n>>2]|0)+28>>2]&15](n,48)|0;l=c[h>>2]|0;c[h>>2]=l+1;a[l]=s;s=Wc[c[(c[n>>2]|0)+28>>2]&15](n,a[r]|0)|0;r=c[h>>2]|0;c[h>>2]=r+1;a[r]=s;u=t+2|0}else{u=t}if((u|0)!=(e|0)?(t=e+ -1|0,t>>>0>u>>>0):0){s=u;r=t;do{t=a[s]|0;a[s]=a[r]|0;a[r]=t;s=s+1|0;r=r+ -1|0}while(s>>>0<r>>>0)}r=Nc[c[(c[q>>2]|0)+16>>2]&127](q)|0;if(u>>>0<e>>>0){q=m+1|0;s=m+4|0;t=m+8|0;l=0;j=0;o=u;while(1){p=(a[m]&1)==0;if((a[(p?q:c[t>>2]|0)+j|0]|0)!=0?(l|0)==(a[(p?q:c[t>>2]|0)+j|0]|0):0){p=c[h>>2]|0;c[h>>2]=p+1;a[p]=r;p=a[m]|0;if((p&1)==0){v=(p&255)>>>1}else{v=c[s>>2]|0}w=0;x=(j>>>0<(v+ -1|0)>>>0)+j|0}else{w=l;x=j}p=Wc[c[(c[n>>2]|0)+28>>2]&15](n,a[o]|0)|0;y=c[h>>2]|0;c[h>>2]=y+1;a[y]=p;o=o+1|0;if(!(o>>>0<e>>>0)){break}else{l=w+1|0;j=x}}}x=f+(u-b)|0;u=c[h>>2]|0;if((x|0)!=(u|0)?(j=u+ -1|0,j>>>0>x>>>0):0){u=x;x=j;do{j=a[u]|0;a[u]=a[x]|0;a[x]=j;u=u+1|0;x=x+ -1|0}while(u>>>0<x>>>0)}}else{Tc[c[(c[n>>2]|0)+32>>2]&7](n,b,e,f)|0;c[h>>2]=f+(e-b)}if((d|0)==(e|0)){z=c[h>>2]|0;c[g>>2]=z;Ig(m);i=k;return}else{z=f+(d-b)|0;c[g>>2]=z;Ig(m);i=k;return}}function vj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;k=i;i=i+16|0;l=k;m=c[d>>2]|0;if((m|0)==0){c[b>>2]=0;i=k;return}n=g;g=e;o=n-g|0;p=h+12|0;h=c[p>>2]|0;q=(h|0)>(o|0)?h-o|0:0;o=f;h=o-g|0;if((h|0)>0?(Gc[c[(c[m>>2]|0)+48>>2]&31](m,e,h)|0)!=(h|0):0){c[d>>2]=0;c[b>>2]=0;i=k;return}do{if((q|0)>0){Hg(l,q,j);if((a[l]&1)==0){r=l+1|0}else{r=c[l+8>>2]|0}if((Gc[c[(c[m>>2]|0)+48>>2]&31](m,r,q)|0)==(q|0)){Ig(l);break}c[d>>2]=0;c[b>>2]=0;Ig(l);i=k;return}}while(0);l=n-o|0;if((l|0)>0?(Gc[c[(c[m>>2]|0)+48>>2]&31](m,f,l)|0)!=(l|0):0){c[d>>2]=0;c[b>>2]=0;i=k;return}c[p>>2]=0;c[b>>2]=m;i=k;return}function wj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;d=i;i=i+96|0;k=d+8|0;l=d;m=d+74|0;n=d+32|0;o=d+28|0;p=d+24|0;q=d+20|0;r=d+16|0;s=l;c[s>>2]=37;c[s+4>>2]=0;s=l+1|0;t=f+4|0;u=c[t>>2]|0;if((u&2048|0)==0){v=s}else{a[s]=43;v=l+2|0}if((u&512|0)==0){w=v}else{a[v]=35;w=v+1|0}v=w+2|0;a[w]=108;a[w+1|0]=108;w=u&74;do{if((w|0)==8){if((u&16384|0)==0){a[v]=120;break}else{a[v]=88;break}}else if((w|0)==64){a[v]=111}else{a[v]=100}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;w=k;c[w>>2]=h;c[w+4>>2]=j;j=tj(m,22,v,l,k)|0;l=m+j|0;v=c[t>>2]&176;do{if((v|0)==32){x=l}else if((v|0)==16){t=a[m]|0;if(t<<24>>24==43|t<<24>>24==45){x=m+1|0;break}if((j|0)>1&t<<24>>24==48?(t=a[m+1|0]|0,t<<24>>24==88|t<<24>>24==120):0){x=m+2|0}else{y=20}}else{y=20}}while(0);if((y|0)==20){x=m}ah(q,f);uj(m,x,l,n,o,p,q);jg(c[q>>2]|0)|0;c[r>>2]=c[e>>2];e=c[o>>2]|0;o=c[p>>2]|0;c[k+0>>2]=c[r+0>>2];vj(b,k,n,e,o,f,g);i=d;return}function xj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+64|0;j=d;k=d+56|0;l=d+44|0;m=d+20|0;n=d+16|0;o=d+12|0;p=d+8|0;q=d+4|0;a[k+0|0]=a[18464|0]|0;a[k+1|0]=a[18465|0]|0;a[k+2|0]=a[18466|0]|0;a[k+3|0]=a[18467|0]|0;a[k+4|0]=a[18468|0]|0;a[k+5|0]=a[18469|0]|0;r=k+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=k+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else if((v|0)==64){a[u]=111}else{a[u]=117}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){u=kb(2147483647,19576,0)|0;c[4890]=u;gb(19568)}u=c[4890]|0;c[j>>2]=h;h=tj(l,12,u,k,j)|0;k=l+h|0;u=c[s>>2]&176;do{if((u|0)==32){w=k}else if((u|0)==16){s=a[l]|0;if(s<<24>>24==43|s<<24>>24==45){w=l+1|0;break}if((h|0)>1&s<<24>>24==48?(s=a[l+1|0]|0,s<<24>>24==88|s<<24>>24==120):0){w=l+2|0}else{x=20}}else{x=20}}while(0);if((x|0)==20){w=l}ah(p,f);uj(l,w,k,m,n,o,p);jg(c[p>>2]|0)|0;c[q>>2]=c[e>>2];e=c[n>>2]|0;n=c[o>>2]|0;c[j+0>>2]=c[q+0>>2];vj(b,j,m,e,n,f,g);i=d;return}function yj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;d=i;i=i+112|0;k=d+8|0;l=d;m=d+75|0;n=d+32|0;o=d+28|0;p=d+24|0;q=d+20|0;r=d+16|0;s=l;c[s>>2]=37;c[s+4>>2]=0;s=l+1|0;t=f+4|0;u=c[t>>2]|0;if((u&2048|0)==0){v=s}else{a[s]=43;v=l+2|0}if((u&512|0)==0){w=v}else{a[v]=35;w=v+1|0}v=w+2|0;a[w]=108;a[w+1|0]=108;w=u&74;do{if((w|0)==8){if((u&16384|0)==0){a[v]=120;break}else{a[v]=88;break}}else if((w|0)==64){a[v]=111}else{a[v]=117}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;w=k;c[w>>2]=h;c[w+4>>2]=j;j=tj(m,23,v,l,k)|0;l=m+j|0;v=c[t>>2]&176;do{if((v|0)==16){t=a[m]|0;if(t<<24>>24==43|t<<24>>24==45){x=m+1|0;break}if((j|0)>1&t<<24>>24==48?(t=a[m+1|0]|0,t<<24>>24==88|t<<24>>24==120):0){x=m+2|0}else{y=20}}else if((v|0)==32){x=l}else{y=20}}while(0);if((y|0)==20){x=m}ah(q,f);uj(m,x,l,n,o,p,q);jg(c[q>>2]|0)|0;c[r>>2]=c[e>>2];e=c[o>>2]|0;o=c[p>>2]|0;c[k+0>>2]=c[r+0>>2];vj(b,k,n,e,o,f,g);i=d;return}function zj(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;d=i;i=i+144|0;l=d+8|0;m=d;n=d+102|0;o=d+40|0;p=d+44|0;q=d+36|0;r=d+32|0;s=d+28|0;t=d+24|0;u=d+20|0;v=m;c[v>>2]=37;c[v+4>>2]=0;v=m+1|0;w=f+4|0;x=c[w>>2]|0;if((x&2048|0)==0){y=v}else{a[v]=43;y=m+2|0}if((x&1024|0)==0){z=y}else{a[y]=35;z=y+1|0}y=x&260;v=x>>>14;do{if((y|0)==260){if((v&1|0)==0){a[z]=97;A=0;break}else{a[z]=65;A=0;break}}else{a[z]=46;x=z+2|0;a[z+1|0]=42;if((y|0)==256){if((v&1|0)==0){a[x]=101;A=1;break}else{a[x]=69;A=1;break}}else if((y|0)==4){if((v&1|0)==0){a[x]=102;A=1;break}else{a[x]=70;A=1;break}}else{if((v&1|0)==0){a[x]=103;A=1;break}else{a[x]=71;A=1;break}}}}while(0);c[o>>2]=n;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;if(A){c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}else{h[k>>3]=j;c[l>>2]=c[k>>2];c[l+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}if((B|0)>29){v=(a[19568]|0)==0;if(A){if(v?(Ga(19568)|0)!=0:0){A=kb(2147483647,19576,0)|0;c[4890]=A;gb(19568)}A=c[4890]|0;c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];C=Aj(o,A,m,l)|0}else{if(v?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;c[l>>2]=c[f+8>>2];A=l+4|0;h[k>>3]=j;c[A>>2]=c[k>>2];c[A+4>>2]=c[k+4>>2];C=Aj(o,v,m,l)|0}m=c[o>>2]|0;if((m|0)==0){fp()}else{D=m;E=m;F=C}}else{D=c[o>>2]|0;E=0;F=B}B=D+F|0;o=c[w>>2]&176;do{if((o|0)==16){w=a[D]|0;if(w<<24>>24==43|w<<24>>24==45){G=D+1|0;break}if((F|0)>1&w<<24>>24==48?(w=a[D+1|0]|0,w<<24>>24==88|w<<24>>24==120):0){G=D+2|0}else{H=44}}else if((o|0)==32){G=B}else{H=44}}while(0);if((H|0)==44){G=D}if((D|0)!=(n|0)){H=Vo(F<<1)|0;if((H|0)==0){fp()}else{I=D;J=H;K=H}}else{I=n;J=0;K=p}ah(s,f);Bj(I,G,B,K,q,r,s);jg(c[s>>2]|0)|0;c[u>>2]=c[e>>2];s=c[q>>2]|0;q=c[r>>2]|0;c[l+0>>2]=c[u+0>>2];vj(t,l,K,s,q,f,g);g=c[t>>2]|0;c[e>>2]=g;c[b>>2]=g;if((J|0)!=0){Wo(J)}if((E|0)==0){i=d;return}Wo(E);i=d;return}function Aj(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+16|0;g=f;c[g>>2]=e;e=Jb(b|0)|0;b=rb(a|0,d|0,g|0)|0;if((e|0)==0){i=f;return b|0}Jb(e|0)|0;i=f;return b|0}function Bj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;k=i;i=i+32|0;l=k;m=k+12|0;n=c[j>>2]|0;if(!((c[4918]|0)==-1)){c[l>>2]=19672;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19672,l,137)}o=(c[19676>>2]|0)+ -1|0;p=c[n+8>>2]|0;if(!((c[n+12>>2]|0)-p>>2>>>0>o>>>0)){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}n=c[p+(o<<2)>>2]|0;if((n|0)==0){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}q=c[j>>2]|0;if(!((c[4954]|0)==-1)){c[l>>2]=19816;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19816,l,137)}l=(c[19820>>2]|0)+ -1|0;j=c[q+8>>2]|0;if(!((c[q+12>>2]|0)-j>>2>>>0>l>>>0)){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}q=c[j+(l<<2)>>2]|0;if((q|0)==0){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}Lc[c[(c[q>>2]|0)+20>>2]&63](m,q);c[h>>2]=f;r=a[b]|0;if(r<<24>>24==43|r<<24>>24==45){l=Wc[c[(c[n>>2]|0)+28>>2]&15](n,r)|0;r=c[h>>2]|0;c[h>>2]=r+1;a[r]=l;s=b+1|0}else{s=b}l=e;a:do{if(((l-s|0)>1?(a[s]|0)==48:0)?(r=s+1|0,j=a[r]|0,j<<24>>24==88|j<<24>>24==120):0){j=Wc[c[(c[n>>2]|0)+28>>2]&15](n,48)|0;o=c[h>>2]|0;c[h>>2]=o+1;a[o]=j;j=s+2|0;o=Wc[c[(c[n>>2]|0)+28>>2]&15](n,a[r]|0)|0;r=c[h>>2]|0;c[h>>2]=r+1;a[r]=o;if(j>>>0<e>>>0){o=j;while(1){r=a[o]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){p=kb(2147483647,19576,0)|0;c[4890]=p;gb(19568)}p=o+1|0;if((fb(r<<24>>24|0,c[4890]|0)|0)==0){t=j;u=o;break a}if(p>>>0<e>>>0){o=p}else{t=j;u=p;break}}}else{t=j;u=j}}else{v=14}}while(0);b:do{if((v|0)==14){if(s>>>0<e>>>0){o=s;while(1){p=a[o]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){r=kb(2147483647,19576,0)|0;c[4890]=r;gb(19568)}r=o+1|0;if((lb(p<<24>>24|0,c[4890]|0)|0)==0){t=s;u=o;break b}if(r>>>0<e>>>0){o=r}else{t=s;u=r;break}}}else{t=s;u=s}}}while(0);s=a[m]|0;if((s&1)==0){w=(s&255)>>>1}else{w=c[m+4>>2]|0}if((w|0)!=0){if((t|0)!=(u|0)?(w=u+ -1|0,w>>>0>t>>>0):0){s=t;v=w;do{w=a[s]|0;a[s]=a[v]|0;a[v]=w;s=s+1|0;v=v+ -1|0}while(s>>>0<v>>>0)}v=Nc[c[(c[q>>2]|0)+16>>2]&127](q)|0;if(t>>>0<u>>>0){s=m+1|0;w=m+4|0;o=m+8|0;j=0;r=0;p=t;while(1){x=(a[m]&1)==0;if((a[(x?s:c[o>>2]|0)+r|0]|0)>0?(j|0)==(a[(x?s:c[o>>2]|0)+r|0]|0):0){x=c[h>>2]|0;c[h>>2]=x+1;a[x]=v;x=a[m]|0;if((x&1)==0){y=(x&255)>>>1}else{y=c[w>>2]|0}z=0;A=(r>>>0<(y+ -1|0)>>>0)+r|0}else{z=j;A=r}x=Wc[c[(c[n>>2]|0)+28>>2]&15](n,a[p]|0)|0;B=c[h>>2]|0;c[h>>2]=B+1;a[B]=x;p=p+1|0;if(!(p>>>0<u>>>0)){break}else{j=z+1|0;r=A}}}A=f+(t-b)|0;r=c[h>>2]|0;if((A|0)!=(r|0)?(z=r+ -1|0,z>>>0>A>>>0):0){r=A;A=z;do{z=a[r]|0;a[r]=a[A]|0;a[A]=z;r=r+1|0;A=A+ -1|0}while(r>>>0<A>>>0)}}else{Tc[c[(c[n>>2]|0)+32>>2]&7](n,t,u,c[h>>2]|0)|0;c[h>>2]=(c[h>>2]|0)+(u-t)}c:do{if(u>>>0<e>>>0){t=u;while(1){A=a[t]|0;if(A<<24>>24==46){break}r=Wc[c[(c[n>>2]|0)+28>>2]&15](n,A)|0;A=c[h>>2]|0;c[h>>2]=A+1;a[A]=r;r=t+1|0;if(r>>>0<e>>>0){t=r}else{C=r;break c}}r=Nc[c[(c[q>>2]|0)+12>>2]&127](q)|0;A=c[h>>2]|0;c[h>>2]=A+1;a[A]=r;C=t+1|0}else{C=u}}while(0);Tc[c[(c[n>>2]|0)+32>>2]&7](n,C,e,c[h>>2]|0)|0;n=(c[h>>2]|0)+(l-C)|0;c[h>>2]=n;if((d|0)==(e|0)){D=n;c[g>>2]=D;Ig(m);i=k;return}D=f+(d-b)|0;c[g>>2]=D;Ig(m);i=k;return}function Cj(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;d=i;i=i+144|0;l=d+8|0;m=d;n=d+102|0;o=d+40|0;p=d+44|0;q=d+36|0;r=d+32|0;s=d+28|0;t=d+24|0;u=d+20|0;v=m;c[v>>2]=37;c[v+4>>2]=0;v=m+1|0;w=f+4|0;x=c[w>>2]|0;if((x&2048|0)==0){y=v}else{a[v]=43;y=m+2|0}if((x&1024|0)==0){z=y}else{a[y]=35;z=y+1|0}y=x&260;v=x>>>14;do{if((y|0)==260){a[z]=76;x=z+1|0;if((v&1|0)==0){a[x]=97;A=0;break}else{a[x]=65;A=0;break}}else{a[z]=46;a[z+1|0]=42;a[z+2|0]=76;x=z+3|0;if((y|0)==256){if((v&1|0)==0){a[x]=101;A=1;break}else{a[x]=69;A=1;break}}else if((y|0)==4){if((v&1|0)==0){a[x]=102;A=1;break}else{a[x]=70;A=1;break}}else{if((v&1|0)==0){a[x]=103;A=1;break}else{a[x]=71;A=1;break}}}}while(0);c[o>>2]=n;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;if(A){c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}else{h[k>>3]=j;c[l>>2]=c[k>>2];c[l+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}if((B|0)>29){v=(a[19568]|0)==0;if(A){if(v?(Ga(19568)|0)!=0:0){A=kb(2147483647,19576,0)|0;c[4890]=A;gb(19568)}A=c[4890]|0;c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];C=Aj(o,A,m,l)|0}else{if(v?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;h[k>>3]=j;c[l>>2]=c[k>>2];c[l+4>>2]=c[k+4>>2];C=Aj(o,v,m,l)|0}m=c[o>>2]|0;if((m|0)==0){fp()}else{D=m;E=m;F=C}}else{D=c[o>>2]|0;E=0;F=B}B=D+F|0;o=c[w>>2]&176;do{if((o|0)==16){w=a[D]|0;if(w<<24>>24==43|w<<24>>24==45){G=D+1|0;break}if((F|0)>1&w<<24>>24==48?(w=a[D+1|0]|0,w<<24>>24==88|w<<24>>24==120):0){G=D+2|0}else{H=44}}else if((o|0)==32){G=B}else{H=44}}while(0);if((H|0)==44){G=D}if((D|0)!=(n|0)){H=Vo(F<<1)|0;if((H|0)==0){fp()}else{I=D;J=H;K=H}}else{I=n;J=0;K=p}ah(s,f);Bj(I,G,B,K,q,r,s);jg(c[s>>2]|0)|0;c[u>>2]=c[e>>2];s=c[q>>2]|0;q=c[r>>2]|0;c[l+0>>2]=c[u+0>>2];vj(t,l,K,s,q,f,g);g=c[t>>2]|0;c[e>>2]=g;c[b>>2]=g;if((J|0)!=0){Wo(J)}if((E|0)==0){i=d;return}Wo(E);i=d;return}function Dj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;i=i+96|0;j=d;k=d+80|0;l=d+60|0;m=d+20|0;n=d+16|0;o=d+12|0;a[k+0|0]=a[18472|0]|0;a[k+1|0]=a[18473|0]|0;a[k+2|0]=a[18474|0]|0;a[k+3|0]=a[18475|0]|0;a[k+4|0]=a[18476|0]|0;a[k+5|0]=a[18477|0]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){p=kb(2147483647,19576,0)|0;c[4890]=p;gb(19568)}p=c[4890]|0;c[j>>2]=h;h=tj(l,20,p,k,j)|0;k=l+h|0;p=c[f+4>>2]&176;do{if((p|0)==32){q=k}else if((p|0)==16){r=a[l]|0;if(r<<24>>24==43|r<<24>>24==45){q=l+1|0;break}if((h|0)>1&r<<24>>24==48?(r=a[l+1|0]|0,r<<24>>24==88|r<<24>>24==120):0){q=l+2|0}else{s=10}}else{s=10}}while(0);if((s|0)==10){q=l}ah(n,f);s=c[n>>2]|0;if(!((c[4918]|0)==-1)){c[j>>2]=19672;c[j+4>>2]=136;c[j+8>>2]=0;Dg(19672,j,137)}p=(c[19676>>2]|0)+ -1|0;r=c[s+8>>2]|0;if(!((c[s+12>>2]|0)-r>>2>>>0>p>>>0)){t=Fb(4)|0;Ao(t);zc(t|0,27632,123)}s=c[r+(p<<2)>>2]|0;if((s|0)==0){t=Fb(4)|0;Ao(t);zc(t|0,27632,123)}jg(c[n>>2]|0)|0;Tc[c[(c[s>>2]|0)+32>>2]&7](s,l,k,m)|0;s=m+h|0;if((q|0)==(k|0)){u=s;v=c[e>>2]|0;c[o>>2]=v;c[j+0>>2]=c[o+0>>2];vj(b,j,m,u,s,f,g);i=d;return}u=m+(q-l)|0;v=c[e>>2]|0;c[o>>2]=v;c[j+0>>2]=c[o+0>>2];vj(b,j,m,u,s,f,g);i=d;return}function Ej(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Fj(a){a=a|0;return}function Gj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;j=i;i=i+32|0;k=j;l=j+28|0;m=j+24|0;n=j+12|0;if((c[f+4>>2]&1|0)==0){o=c[(c[d>>2]|0)+24>>2]|0;c[l>>2]=c[e>>2];p=h&1;c[k+0>>2]=c[l+0>>2];Vc[o&15](b,d,k,f,g,p);i=j;return}ah(m,f);f=c[m>>2]|0;if(!((c[4956]|0)==-1)){c[k>>2]=19824;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19824,k,137)}k=(c[19828>>2]|0)+ -1|0;p=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-p>>2>>>0>k>>>0)){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}f=c[p+(k<<2)>>2]|0;if((f|0)==0){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}jg(c[m>>2]|0)|0;m=c[f>>2]|0;if(h){Lc[c[m+24>>2]&63](n,f)}else{Lc[c[m+28>>2]&63](n,f)}f=a[n]|0;if((f&1)==0){m=n+4|0;r=m;s=n+8|0;t=m}else{m=n+8|0;r=c[m>>2]|0;s=m;t=n+4|0}m=f;f=r;while(1){if((m&1)==0){u=t;v=(m&255)>>>1}else{u=c[s>>2]|0;v=c[t>>2]|0}if((f|0)==(u+(v<<2)|0)){break}r=c[f>>2]|0;h=c[e>>2]|0;if((h|0)!=0){q=h+24|0;k=c[q>>2]|0;if((k|0)==(c[h+28>>2]|0)){w=Wc[c[(c[h>>2]|0)+52>>2]&15](h,r)|0}else{c[q>>2]=k+4;c[k>>2]=r;w=r}if((w|0)==-1){c[e>>2]=0}}m=a[n]|0;f=f+4|0}c[b>>2]=c[e>>2];Tg(n);i=j;return}function Hj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+128|0;j=d;k=d+116|0;l=d+104|0;m=d+20|0;n=d+16|0;o=d+12|0;p=d+8|0;q=d+4|0;a[k+0|0]=a[18464|0]|0;a[k+1|0]=a[18465|0]|0;a[k+2|0]=a[18466|0]|0;a[k+3|0]=a[18467|0]|0;a[k+4|0]=a[18468|0]|0;a[k+5|0]=a[18469|0]|0;r=k+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=k+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else if((v|0)==64){a[u]=111}else{a[u]=100}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){u=kb(2147483647,19576,0)|0;c[4890]=u;gb(19568)}u=c[4890]|0;c[j>>2]=h;h=tj(l,12,u,k,j)|0;k=l+h|0;u=c[s>>2]&176;do{if((u|0)==16){s=a[l]|0;if(s<<24>>24==43|s<<24>>24==45){w=l+1|0;break}if((h|0)>1&s<<24>>24==48?(s=a[l+1|0]|0,s<<24>>24==88|s<<24>>24==120):0){w=l+2|0}else{x=20}}else if((u|0)==32){w=k}else{x=20}}while(0);if((x|0)==20){w=l}ah(p,f);Ij(l,w,k,m,n,o,p);jg(c[p>>2]|0)|0;c[q>>2]=c[e>>2];e=c[n>>2]|0;n=c[o>>2]|0;c[j+0>>2]=c[q+0>>2];Jj(b,j,m,e,n,f,g);i=d;return}function Ij(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;k=i;i=i+32|0;l=k;m=k+12|0;n=c[j>>2]|0;if(!((c[4916]|0)==-1)){c[l>>2]=19664;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19664,l,137)}o=(c[19668>>2]|0)+ -1|0;p=c[n+8>>2]|0;if(!((c[n+12>>2]|0)-p>>2>>>0>o>>>0)){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}n=c[p+(o<<2)>>2]|0;if((n|0)==0){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}q=c[j>>2]|0;if(!((c[4956]|0)==-1)){c[l>>2]=19824;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19824,l,137)}l=(c[19828>>2]|0)+ -1|0;j=c[q+8>>2]|0;if(!((c[q+12>>2]|0)-j>>2>>>0>l>>>0)){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}q=c[j+(l<<2)>>2]|0;if((q|0)==0){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}Lc[c[(c[q>>2]|0)+20>>2]&63](m,q);r=a[m]|0;if((r&1)==0){s=(r&255)>>>1}else{s=c[m+4>>2]|0}if((s|0)!=0){c[h>>2]=f;s=a[b]|0;if(s<<24>>24==43|s<<24>>24==45){r=Wc[c[(c[n>>2]|0)+44>>2]&15](n,s)|0;s=c[h>>2]|0;c[h>>2]=s+4;c[s>>2]=r;t=b+1|0}else{t=b}if(((e-t|0)>1?(a[t]|0)==48:0)?(r=t+1|0,s=a[r]|0,s<<24>>24==88|s<<24>>24==120):0){s=Wc[c[(c[n>>2]|0)+44>>2]&15](n,48)|0;l=c[h>>2]|0;c[h>>2]=l+4;c[l>>2]=s;s=Wc[c[(c[n>>2]|0)+44>>2]&15](n,a[r]|0)|0;r=c[h>>2]|0;c[h>>2]=r+4;c[r>>2]=s;u=t+2|0}else{u=t}if((u|0)!=(e|0)?(t=e+ -1|0,t>>>0>u>>>0):0){s=u;r=t;do{t=a[s]|0;a[s]=a[r]|0;a[r]=t;s=s+1|0;r=r+ -1|0}while(s>>>0<r>>>0)}r=Nc[c[(c[q>>2]|0)+16>>2]&127](q)|0;if(u>>>0<e>>>0){q=m+1|0;s=m+4|0;t=m+8|0;l=0;j=0;o=u;while(1){p=(a[m]&1)==0;if((a[(p?q:c[t>>2]|0)+j|0]|0)!=0?(l|0)==(a[(p?q:c[t>>2]|0)+j|0]|0):0){p=c[h>>2]|0;c[h>>2]=p+4;c[p>>2]=r;p=a[m]|0;if((p&1)==0){v=(p&255)>>>1}else{v=c[s>>2]|0}w=0;x=(j>>>0<(v+ -1|0)>>>0)+j|0}else{w=l;x=j}p=Wc[c[(c[n>>2]|0)+44>>2]&15](n,a[o]|0)|0;y=c[h>>2]|0;z=y+4|0;c[h>>2]=z;c[y>>2]=p;p=o+1|0;if(p>>>0<e>>>0){l=w+1|0;j=x;o=p}else{A=z;break}}}else{A=c[h>>2]|0}o=f+(u-b<<2)|0;if((o|0)!=(A|0)?(u=A+ -4|0,u>>>0>o>>>0):0){x=o;o=u;while(1){u=c[x>>2]|0;c[x>>2]=c[o>>2];c[o>>2]=u;u=x+4|0;j=o+ -4|0;if(u>>>0<j>>>0){x=u;o=j}else{B=A;break}}}else{B=A}}else{Tc[c[(c[n>>2]|0)+48>>2]&7](n,b,e,f)|0;n=f+(e-b<<2)|0;c[h>>2]=n;B=n}if((d|0)==(e|0)){C=B;c[g>>2]=C;Ig(m);i=k;return}C=f+(d-b<<2)|0;c[g>>2]=C;Ig(m);i=k;return}function Jj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;k=i;i=i+16|0;l=k;m=c[d>>2]|0;if((m|0)==0){c[b>>2]=0;i=k;return}n=g;g=e;o=n-g>>2;p=h+12|0;h=c[p>>2]|0;q=(h|0)>(o|0)?h-o|0:0;o=f;h=o-g|0;g=h>>2;if((h|0)>0?(Gc[c[(c[m>>2]|0)+48>>2]&31](m,e,g)|0)!=(g|0):0){c[d>>2]=0;c[b>>2]=0;i=k;return}do{if((q|0)>0){Sg(l,q,j);if((a[l]&1)==0){r=l+4|0}else{r=c[l+8>>2]|0}if((Gc[c[(c[m>>2]|0)+48>>2]&31](m,r,q)|0)==(q|0)){Tg(l);break}c[d>>2]=0;c[b>>2]=0;Tg(l);i=k;return}}while(0);l=n-o|0;o=l>>2;if((l|0)>0?(Gc[c[(c[m>>2]|0)+48>>2]&31](m,f,o)|0)!=(o|0):0){c[d>>2]=0;c[b>>2]=0;i=k;return}c[p>>2]=0;c[b>>2]=m;i=k;return}function Kj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;d=i;i=i+224|0;k=d+8|0;l=d;m=d+196|0;n=d+32|0;o=d+28|0;p=d+24|0;q=d+20|0;r=d+16|0;s=l;c[s>>2]=37;c[s+4>>2]=0;s=l+1|0;t=f+4|0;u=c[t>>2]|0;if((u&2048|0)==0){v=s}else{a[s]=43;v=l+2|0}if((u&512|0)==0){w=v}else{a[v]=35;w=v+1|0}v=w+2|0;a[w]=108;a[w+1|0]=108;w=u&74;do{if((w|0)==64){a[v]=111}else if((w|0)==8){if((u&16384|0)==0){a[v]=120;break}else{a[v]=88;break}}else{a[v]=100}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;u=k;c[u>>2]=h;c[u+4>>2]=j;j=tj(m,22,v,l,k)|0;l=m+j|0;v=c[t>>2]&176;do{if((v|0)==16){t=a[m]|0;if(t<<24>>24==43|t<<24>>24==45){x=m+1|0;break}if((j|0)>1&t<<24>>24==48?(t=a[m+1|0]|0,t<<24>>24==88|t<<24>>24==120):0){x=m+2|0}else{y=20}}else if((v|0)==32){x=l}else{y=20}}while(0);if((y|0)==20){x=m}ah(q,f);Ij(m,x,l,n,o,p,q);jg(c[q>>2]|0)|0;c[r>>2]=c[e>>2];e=c[o>>2]|0;o=c[p>>2]|0;c[k+0>>2]=c[r+0>>2];Jj(b,k,n,e,o,f,g);i=d;return}function Lj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+128|0;j=d;k=d+116|0;l=d+104|0;m=d+20|0;n=d+16|0;o=d+12|0;p=d+8|0;q=d+4|0;a[k+0|0]=a[18464|0]|0;a[k+1|0]=a[18465|0]|0;a[k+2|0]=a[18466|0]|0;a[k+3|0]=a[18467|0]|0;a[k+4|0]=a[18468|0]|0;a[k+5|0]=a[18469|0]|0;r=k+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=k+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else if((v|0)==64){a[u]=111}else{a[u]=117}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){u=kb(2147483647,19576,0)|0;c[4890]=u;gb(19568)}u=c[4890]|0;c[j>>2]=h;h=tj(l,12,u,k,j)|0;k=l+h|0;u=c[s>>2]&176;do{if((u|0)==32){w=k}else if((u|0)==16){s=a[l]|0;if(s<<24>>24==43|s<<24>>24==45){w=l+1|0;break}if((h|0)>1&s<<24>>24==48?(s=a[l+1|0]|0,s<<24>>24==88|s<<24>>24==120):0){w=l+2|0}else{x=20}}else{x=20}}while(0);if((x|0)==20){w=l}ah(p,f);Ij(l,w,k,m,n,o,p);jg(c[p>>2]|0)|0;c[q>>2]=c[e>>2];e=c[n>>2]|0;n=c[o>>2]|0;c[j+0>>2]=c[q+0>>2];Jj(b,j,m,e,n,f,g);i=d;return}function Mj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;d=i;i=i+240|0;k=d+8|0;l=d;m=d+204|0;n=d+32|0;o=d+28|0;p=d+24|0;q=d+20|0;r=d+16|0;s=l;c[s>>2]=37;c[s+4>>2]=0;s=l+1|0;t=f+4|0;u=c[t>>2]|0;if((u&2048|0)==0){v=s}else{a[s]=43;v=l+2|0}if((u&512|0)==0){w=v}else{a[v]=35;w=v+1|0}v=w+2|0;a[w]=108;a[w+1|0]=108;w=u&74;do{if((w|0)==64){a[v]=111}else if((w|0)==8){if((u&16384|0)==0){a[v]=120;break}else{a[v]=88;break}}else{a[v]=117}}while(0);if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;u=k;c[u>>2]=h;c[u+4>>2]=j;j=tj(m,23,v,l,k)|0;l=m+j|0;v=c[t>>2]&176;do{if((v|0)==32){x=l}else if((v|0)==16){t=a[m]|0;if(t<<24>>24==43|t<<24>>24==45){x=m+1|0;break}if((j|0)>1&t<<24>>24==48?(t=a[m+1|0]|0,t<<24>>24==88|t<<24>>24==120):0){x=m+2|0}else{y=20}}else{y=20}}while(0);if((y|0)==20){x=m}ah(q,f);Ij(m,x,l,n,o,p,q);jg(c[q>>2]|0)|0;c[r>>2]=c[e>>2];e=c[o>>2]|0;o=c[p>>2]|0;c[k+0>>2]=c[r+0>>2];Jj(b,k,n,e,o,f,g);i=d;return}function Nj(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;d=i;i=i+304|0;l=d+8|0;m=d;n=d+272|0;o=d+268|0;p=d+40|0;q=d+36|0;r=d+32|0;s=d+28|0;t=d+24|0;u=d+20|0;v=m;c[v>>2]=37;c[v+4>>2]=0;v=m+1|0;w=f+4|0;x=c[w>>2]|0;if((x&2048|0)==0){y=v}else{a[v]=43;y=m+2|0}if((x&1024|0)==0){z=y}else{a[y]=35;z=y+1|0}y=x&260;v=x>>>14;do{if((y|0)==260){if((v&1|0)==0){a[z]=97;A=0;break}else{a[z]=65;A=0;break}}else{a[z]=46;x=z+2|0;a[z+1|0]=42;if((y|0)==4){if((v&1|0)==0){a[x]=102;A=1;break}else{a[x]=70;A=1;break}}else if((y|0)==256){if((v&1|0)==0){a[x]=101;A=1;break}else{a[x]=69;A=1;break}}else{if((v&1|0)==0){a[x]=103;A=1;break}else{a[x]=71;A=1;break}}}}while(0);c[o>>2]=n;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;if(A){c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}else{h[k>>3]=j;c[l>>2]=c[k>>2];c[l+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}if((B|0)>29){v=(a[19568]|0)==0;if(A){if(v?(Ga(19568)|0)!=0:0){A=kb(2147483647,19576,0)|0;c[4890]=A;gb(19568)}A=c[4890]|0;c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];C=Aj(o,A,m,l)|0}else{if(v?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;c[l>>2]=c[f+8>>2];A=l+4|0;h[k>>3]=j;c[A>>2]=c[k>>2];c[A+4>>2]=c[k+4>>2];C=Aj(o,v,m,l)|0}m=c[o>>2]|0;if((m|0)==0){fp()}else{D=m;E=m;F=C}}else{D=c[o>>2]|0;E=0;F=B}B=D+F|0;o=c[w>>2]&176;do{if((o|0)==16){w=a[D]|0;if(w<<24>>24==43|w<<24>>24==45){G=D+1|0;break}if((F|0)>1&w<<24>>24==48?(w=a[D+1|0]|0,w<<24>>24==88|w<<24>>24==120):0){G=D+2|0}else{H=44}}else if((o|0)==32){G=B}else{H=44}}while(0);if((H|0)==44){G=D}if((D|0)!=(n|0)){H=Vo(F<<3)|0;if((H|0)==0){fp()}else{I=D;J=H;K=H}}else{I=n;J=0;K=p}ah(s,f);Oj(I,G,B,K,q,r,s);jg(c[s>>2]|0)|0;c[u>>2]=c[e>>2];s=c[q>>2]|0;q=c[r>>2]|0;c[l+0>>2]=c[u+0>>2];Jj(t,l,K,s,q,f,g);g=c[t>>2]|0;c[e>>2]=g;c[b>>2]=g;if((J|0)!=0){Wo(J)}if((E|0)==0){i=d;return}Wo(E);i=d;return}function Oj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;k=i;i=i+32|0;l=k;m=k+12|0;n=c[j>>2]|0;if(!((c[4916]|0)==-1)){c[l>>2]=19664;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19664,l,137)}o=(c[19668>>2]|0)+ -1|0;p=c[n+8>>2]|0;if(!((c[n+12>>2]|0)-p>>2>>>0>o>>>0)){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}n=c[p+(o<<2)>>2]|0;if((n|0)==0){q=Fb(4)|0;Ao(q);zc(q|0,27632,123)}q=c[j>>2]|0;if(!((c[4956]|0)==-1)){c[l>>2]=19824;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19824,l,137)}l=(c[19828>>2]|0)+ -1|0;j=c[q+8>>2]|0;if(!((c[q+12>>2]|0)-j>>2>>>0>l>>>0)){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}q=c[j+(l<<2)>>2]|0;if((q|0)==0){r=Fb(4)|0;Ao(r);zc(r|0,27632,123)}Lc[c[(c[q>>2]|0)+20>>2]&63](m,q);c[h>>2]=f;r=a[b]|0;if(r<<24>>24==43|r<<24>>24==45){l=Wc[c[(c[n>>2]|0)+44>>2]&15](n,r)|0;r=c[h>>2]|0;c[h>>2]=r+4;c[r>>2]=l;s=b+1|0}else{s=b}l=e;a:do{if(((l-s|0)>1?(a[s]|0)==48:0)?(r=s+1|0,j=a[r]|0,j<<24>>24==88|j<<24>>24==120):0){j=Wc[c[(c[n>>2]|0)+44>>2]&15](n,48)|0;o=c[h>>2]|0;c[h>>2]=o+4;c[o>>2]=j;j=s+2|0;o=Wc[c[(c[n>>2]|0)+44>>2]&15](n,a[r]|0)|0;r=c[h>>2]|0;c[h>>2]=r+4;c[r>>2]=o;if(j>>>0<e>>>0){o=j;while(1){r=a[o]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){p=kb(2147483647,19576,0)|0;c[4890]=p;gb(19568)}p=o+1|0;if((fb(r<<24>>24|0,c[4890]|0)|0)==0){t=j;u=o;break a}if(p>>>0<e>>>0){o=p}else{t=j;u=p;break}}}else{t=j;u=j}}else{v=14}}while(0);b:do{if((v|0)==14){if(s>>>0<e>>>0){o=s;while(1){p=a[o]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){r=kb(2147483647,19576,0)|0;c[4890]=r;gb(19568)}r=o+1|0;if((lb(p<<24>>24|0,c[4890]|0)|0)==0){t=s;u=o;break b}if(r>>>0<e>>>0){o=r}else{t=s;u=r;break}}}else{t=s;u=s}}}while(0);s=a[m]|0;if((s&1)==0){w=(s&255)>>>1}else{w=c[m+4>>2]|0}if((w|0)!=0){if((t|0)!=(u|0)?(w=u+ -1|0,w>>>0>t>>>0):0){s=t;v=w;do{w=a[s]|0;a[s]=a[v]|0;a[v]=w;s=s+1|0;v=v+ -1|0}while(s>>>0<v>>>0)}v=Nc[c[(c[q>>2]|0)+16>>2]&127](q)|0;if(t>>>0<u>>>0){s=m+1|0;w=m+4|0;o=m+8|0;j=0;r=0;p=t;while(1){x=(a[m]&1)==0;if((a[(x?s:c[o>>2]|0)+r|0]|0)>0?(j|0)==(a[(x?s:c[o>>2]|0)+r|0]|0):0){x=c[h>>2]|0;c[h>>2]=x+4;c[x>>2]=v;x=a[m]|0;if((x&1)==0){y=(x&255)>>>1}else{y=c[w>>2]|0}z=0;A=(r>>>0<(y+ -1|0)>>>0)+r|0}else{z=j;A=r}x=Wc[c[(c[n>>2]|0)+44>>2]&15](n,a[p]|0)|0;B=c[h>>2]|0;C=B+4|0;c[h>>2]=C;c[B>>2]=x;x=p+1|0;if(x>>>0<u>>>0){j=z+1|0;r=A;p=x}else{D=C;break}}}else{D=c[h>>2]|0}p=f+(t-b<<2)|0;if((p|0)!=(D|0)?(A=D+ -4|0,A>>>0>p>>>0):0){r=p;p=A;while(1){A=c[r>>2]|0;c[r>>2]=c[p>>2];c[p>>2]=A;A=r+4|0;z=p+ -4|0;if(A>>>0<z>>>0){r=A;p=z}else{E=D;break}}}else{E=D}}else{Tc[c[(c[n>>2]|0)+48>>2]&7](n,t,u,c[h>>2]|0)|0;D=(c[h>>2]|0)+(u-t<<2)|0;c[h>>2]=D;E=D}c:do{if(u>>>0<e>>>0){D=u;while(1){t=a[D]|0;if(t<<24>>24==46){break}p=Wc[c[(c[n>>2]|0)+44>>2]&15](n,t)|0;t=c[h>>2]|0;r=t+4|0;c[h>>2]=r;c[t>>2]=p;p=D+1|0;if(p>>>0<e>>>0){D=p}else{F=r;G=p;break c}}p=Nc[c[(c[q>>2]|0)+12>>2]&127](q)|0;r=c[h>>2]|0;t=r+4|0;c[h>>2]=t;c[r>>2]=p;F=t;G=D+1|0}else{F=E;G=u}}while(0);Tc[c[(c[n>>2]|0)+48>>2]&7](n,G,e,F)|0;F=(c[h>>2]|0)+(l-G<<2)|0;c[h>>2]=F;if((d|0)==(e|0)){H=F;c[g>>2]=H;Ig(m);i=k;return}H=f+(d-b<<2)|0;c[g>>2]=H;Ig(m);i=k;return}function Pj(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;d=i;i=i+304|0;l=d+8|0;m=d;n=d+272|0;o=d+268|0;p=d+40|0;q=d+36|0;r=d+32|0;s=d+28|0;t=d+24|0;u=d+20|0;v=m;c[v>>2]=37;c[v+4>>2]=0;v=m+1|0;w=f+4|0;x=c[w>>2]|0;if((x&2048|0)==0){y=v}else{a[v]=43;y=m+2|0}if((x&1024|0)==0){z=y}else{a[y]=35;z=y+1|0}y=x&260;v=x>>>14;do{if((y|0)==260){a[z]=76;x=z+1|0;if((v&1|0)==0){a[x]=97;A=0;break}else{a[x]=65;A=0;break}}else{a[z]=46;a[z+1|0]=42;a[z+2|0]=76;x=z+3|0;if((y|0)==4){if((v&1|0)==0){a[x]=102;A=1;break}else{a[x]=70;A=1;break}}else if((y|0)==256){if((v&1|0)==0){a[x]=101;A=1;break}else{a[x]=69;A=1;break}}else{if((v&1|0)==0){a[x]=103;A=1;break}else{a[x]=71;A=1;break}}}}while(0);c[o>>2]=n;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;if(A){c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}else{h[k>>3]=j;c[l>>2]=c[k>>2];c[l+4>>2]=c[k+4>>2];B=tj(n,30,v,m,l)|0}if((B|0)>29){v=(a[19568]|0)==0;if(A){if(v?(Ga(19568)|0)!=0:0){A=kb(2147483647,19576,0)|0;c[4890]=A;gb(19568)}A=c[4890]|0;c[l>>2]=c[f+8>>2];y=l+4|0;h[k>>3]=j;c[y>>2]=c[k>>2];c[y+4>>2]=c[k+4>>2];C=Aj(o,A,m,l)|0}else{if(v?(Ga(19568)|0)!=0:0){v=kb(2147483647,19576,0)|0;c[4890]=v;gb(19568)}v=c[4890]|0;h[k>>3]=j;c[l>>2]=c[k>>2];c[l+4>>2]=c[k+4>>2];C=Aj(o,v,m,l)|0}m=c[o>>2]|0;if((m|0)==0){fp()}else{D=m;E=m;F=C}}else{D=c[o>>2]|0;E=0;F=B}B=D+F|0;o=c[w>>2]&176;do{if((o|0)==16){w=a[D]|0;if(w<<24>>24==43|w<<24>>24==45){G=D+1|0;break}if((F|0)>1&w<<24>>24==48?(w=a[D+1|0]|0,w<<24>>24==88|w<<24>>24==120):0){G=D+2|0}else{H=44}}else if((o|0)==32){G=B}else{H=44}}while(0);if((H|0)==44){G=D}if((D|0)!=(n|0)){H=Vo(F<<3)|0;if((H|0)==0){fp()}else{I=D;J=H;K=H}}else{I=n;J=0;K=p}ah(s,f);Oj(I,G,B,K,q,r,s);jg(c[s>>2]|0)|0;c[u>>2]=c[e>>2];s=c[q>>2]|0;q=c[r>>2]|0;c[l+0>>2]=c[u+0>>2];Jj(t,l,K,s,q,f,g);g=c[t>>2]|0;c[e>>2]=g;c[b>>2]=g;if((J|0)!=0){Wo(J)}if((E|0)==0){i=d;return}Wo(E);i=d;return}function Qj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;i=i+208|0;j=d;k=d+188|0;l=d+168|0;m=d+20|0;n=d+16|0;o=d+12|0;a[k+0|0]=a[18472|0]|0;a[k+1|0]=a[18473|0]|0;a[k+2|0]=a[18474|0]|0;a[k+3|0]=a[18475|0]|0;a[k+4|0]=a[18476|0]|0;a[k+5|0]=a[18477|0]|0;if((a[19568]|0)==0?(Ga(19568)|0)!=0:0){p=kb(2147483647,19576,0)|0;c[4890]=p;gb(19568)}p=c[4890]|0;c[j>>2]=h;h=tj(l,20,p,k,j)|0;k=l+h|0;p=c[f+4>>2]&176;do{if((p|0)==32){q=k}else if((p|0)==16){r=a[l]|0;if(r<<24>>24==43|r<<24>>24==45){q=l+1|0;break}if((h|0)>1&r<<24>>24==48?(r=a[l+1|0]|0,r<<24>>24==88|r<<24>>24==120):0){q=l+2|0}else{s=10}}else{s=10}}while(0);if((s|0)==10){q=l}ah(n,f);s=c[n>>2]|0;if(!((c[4916]|0)==-1)){c[j>>2]=19664;c[j+4>>2]=136;c[j+8>>2]=0;Dg(19664,j,137)}p=(c[19668>>2]|0)+ -1|0;r=c[s+8>>2]|0;if(!((c[s+12>>2]|0)-r>>2>>>0>p>>>0)){t=Fb(4)|0;Ao(t);zc(t|0,27632,123)}s=c[r+(p<<2)>>2]|0;if((s|0)==0){t=Fb(4)|0;Ao(t);zc(t|0,27632,123)}jg(c[n>>2]|0)|0;Tc[c[(c[s>>2]|0)+48>>2]&7](s,l,k,m)|0;s=m+(h<<2)|0;if((q|0)==(k|0)){u=s;v=c[e>>2]|0;c[o>>2]=v;c[j+0>>2]=c[o+0>>2];Jj(b,j,m,u,s,f,g);i=d;return}u=m+(q-l<<2)|0;v=c[e>>2]|0;c[o>>2]=v;c[j+0>>2]=c[o+0>>2];Jj(b,j,m,u,s,f,g);i=d;return}function Rj(e,f,g,h,j,k,l,m,n){e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;var o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0;o=i;i=i+32|0;p=o;q=o+28|0;r=o+24|0;s=o+20|0;t=o+16|0;u=o+12|0;ah(r,j);v=c[r>>2]|0;if(!((c[4918]|0)==-1)){c[p>>2]=19672;c[p+4>>2]=136;c[p+8>>2]=0;Dg(19672,p,137)}w=(c[19676>>2]|0)+ -1|0;x=c[v+8>>2]|0;if(!((c[v+12>>2]|0)-x>>2>>>0>w>>>0)){y=Fb(4)|0;Ao(y);zc(y|0,27632,123)}v=c[x+(w<<2)>>2]|0;if((v|0)==0){y=Fb(4)|0;Ao(y);zc(y|0,27632,123)}jg(c[r>>2]|0)|0;c[k>>2]=0;a:do{if((m|0)!=(n|0)){r=v+8|0;y=m;w=0;b:while(1){x=w;while(1){if((x|0)!=0){z=65;break a}A=c[g>>2]|0;if((A|0)!=0){if((c[A+12>>2]|0)==(c[A+16>>2]|0)?(Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1:0){c[g>>2]=0;B=0}else{B=A}}else{B=0}A=(B|0)==0;C=c[h>>2]|0;do{if((C|0)!=0){if((c[C+12>>2]|0)==(c[C+16>>2]|0)?(Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1:0){c[h>>2]=0;z=19;break}if(A){D=C}else{z=20;break b}}else{z=19}}while(0);if((z|0)==19){z=0;if(A){z=20;break b}else{D=0}}if((Gc[c[(c[v>>2]|0)+36>>2]&31](v,a[y]|0,0)|0)<<24>>24==37){z=22;break}C=a[y]|0;if(C<<24>>24>-1?(E=c[r>>2]|0,!((b[E+(C<<24>>24<<1)>>1]&8192)==0)):0){F=y;z=33;break}G=B+12|0;C=c[G>>2]|0;H=B+16|0;if((C|0)==(c[H>>2]|0)){I=Nc[c[(c[B>>2]|0)+36>>2]&127](B)|0}else{I=d[C]|0}C=Wc[c[(c[v>>2]|0)+12>>2]&15](v,I&255)|0;if(C<<24>>24==(Wc[c[(c[v>>2]|0)+12>>2]&15](v,a[y]|0)|0)<<24>>24){z=60;break}c[k>>2]=4;x=4}c:do{if((z|0)==22){z=0;x=y+1|0;if((x|0)==(n|0)){z=23;break b}C=Gc[c[(c[v>>2]|0)+36>>2]&31](v,a[x]|0,0)|0;if(C<<24>>24==48|C<<24>>24==69){J=y+2|0;if((J|0)==(n|0)){z=26;break b}K=J;L=Gc[c[(c[v>>2]|0)+36>>2]&31](v,a[J]|0,0)|0;M=C}else{K=x;L=C;M=0}C=c[(c[f>>2]|0)+36>>2]|0;c[t>>2]=B;c[u>>2]=D;c[q+0>>2]=c[t+0>>2];c[p+0>>2]=c[u+0>>2];Mc[C&3](s,f,q,p,j,k,l,L,M);c[g>>2]=c[s>>2];N=K+1|0}else if((z|0)==33){while(1){z=0;C=F+1|0;if((C|0)==(n|0)){O=n;break}x=a[C]|0;if(!(x<<24>>24>-1)){O=C;break}if((b[E+(x<<24>>24<<1)>>1]&8192)==0){O=C;break}else{F=C;z=33}}A=B;C=D;x=D;while(1){if((A|0)!=0){if((c[A+12>>2]|0)==(c[A+16>>2]|0)?(Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1:0){c[g>>2]=0;P=0}else{P=A}}else{P=0}J=(P|0)==0;do{if((x|0)!=0){if((c[x+12>>2]|0)!=(c[x+16>>2]|0)){if(J){Q=C;R=x;break}else{N=O;break c}}if(!((Nc[c[(c[x>>2]|0)+36>>2]&127](x)|0)==-1)){if(J^(C|0)==0){Q=C;R=C;break}else{N=O;break c}}else{c[h>>2]=0;S=0;z=46;break}}else{S=C;z=46}}while(0);if((z|0)==46){z=0;if(J){N=O;break c}else{Q=S;R=0}}T=P+12|0;U=c[T>>2]|0;V=P+16|0;if((U|0)==(c[V>>2]|0)){W=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{W=d[U]|0}if(!((W&255)<<24>>24>-1)){N=O;break c}if((b[(c[r>>2]|0)+(W<<24>>24<<1)>>1]&8192)==0){N=O;break c}U=c[T>>2]|0;if((U|0)==(c[V>>2]|0)){Nc[c[(c[P>>2]|0)+40>>2]&127](P)|0;A=P;C=Q;x=R;continue}else{c[T>>2]=U+1;A=P;C=Q;x=R;continue}}}else if((z|0)==60){z=0;x=c[G>>2]|0;if((x|0)==(c[H>>2]|0)){Nc[c[(c[B>>2]|0)+40>>2]&127](B)|0}else{c[G>>2]=x+1}N=y+1|0}}while(0);if((N|0)==(n|0)){z=65;break a}y=N;w=c[k>>2]|0}if((z|0)==20){c[k>>2]=4;X=B;break}else if((z|0)==23){c[k>>2]=4;X=B;break}else if((z|0)==26){c[k>>2]=4;X=B;break}}else{z=65}}while(0);if((z|0)==65){X=c[g>>2]|0}if((X|0)!=0){if((c[X+12>>2]|0)==(c[X+16>>2]|0)?(Nc[c[(c[X>>2]|0)+36>>2]&127](X)|0)==-1:0){c[g>>2]=0;Y=0}else{Y=X}}else{Y=0}X=(Y|0)==0;g=c[h>>2]|0;do{if((g|0)!=0){if((c[g+12>>2]|0)==(c[g+16>>2]|0)?(Nc[c[(c[g>>2]|0)+36>>2]&127](g)|0)==-1:0){c[h>>2]=0;z=75;break}if(X){c[e>>2]=Y;i=o;return}}else{z=75}}while(0);if((z|0)==75?!X:0){c[e>>2]=Y;i=o;return}c[k>>2]=c[k>>2]|2;c[e>>2]=Y;i=o;return}function Sj(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function Tj(a){a=a|0;return}function Uj(a){a=a|0;return 2}function Vj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0;j=i;i=i+16|0;k=j+12|0;l=j+8|0;m=j+4|0;n=j;c[m>>2]=c[d>>2];c[n>>2]=c[e>>2];c[l+0>>2]=c[m+0>>2];c[k+0>>2]=c[n+0>>2];Rj(a,b,l,k,f,g,h,18576,18584|0);i=j;return}function Wj(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;k=i;i=i+16|0;l=k+12|0;m=k+8|0;n=k+4|0;o=k;p=d+8|0;q=Nc[c[(c[p>>2]|0)+20>>2]&127](p)|0;c[n>>2]=c[e>>2];c[o>>2]=c[f>>2];f=a[q]|0;if((f&1)==0){r=q+1|0;s=(f&255)>>>1;t=q+1|0}else{f=c[q+8>>2]|0;r=f;s=c[q+4>>2]|0;t=f}f=r+s|0;c[m+0>>2]=c[n+0>>2];c[l+0>>2]=c[o+0>>2];Rj(b,d,m,l,g,h,j,t,f);i=k;return}function Xj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=i;i=i+32|0;k=j;l=j+16|0;m=j+12|0;ah(m,f);f=c[m>>2]|0;if(!((c[4918]|0)==-1)){c[k>>2]=19672;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19672,k,137)}n=(c[19676>>2]|0)+ -1|0;o=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-o>>2>>>0>n>>>0)){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}f=c[o+(n<<2)>>2]|0;if((f|0)==0){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}jg(c[m>>2]|0)|0;m=c[e>>2]|0;e=b+8|0;b=Nc[c[c[e>>2]>>2]&127](e)|0;c[l>>2]=m;m=b+168|0;c[k+0>>2]=c[l+0>>2];l=(ri(d,k,b,m,f,g,0)|0)-b|0;if((l|0)>=168){q=c[d>>2]|0;c[a>>2]=q;i=j;return}c[h+24>>2]=((l|0)/12|0|0)%7|0;q=c[d>>2]|0;c[a>>2]=q;i=j;return}function Yj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=i;i=i+32|0;k=j;l=j+16|0;m=j+12|0;ah(m,f);f=c[m>>2]|0;if(!((c[4918]|0)==-1)){c[k>>2]=19672;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19672,k,137)}n=(c[19676>>2]|0)+ -1|0;o=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-o>>2>>>0>n>>>0)){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}f=c[o+(n<<2)>>2]|0;if((f|0)==0){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}jg(c[m>>2]|0)|0;m=c[e>>2]|0;e=b+8|0;b=Nc[c[(c[e>>2]|0)+4>>2]&127](e)|0;c[l>>2]=m;m=b+288|0;c[k+0>>2]=c[l+0>>2];l=(ri(d,k,b,m,f,g,0)|0)-b|0;if((l|0)>=288){q=c[d>>2]|0;c[a>>2]=q;i=j;return}c[h+16>>2]=((l|0)/12|0|0)%12|0;q=c[d>>2]|0;c[a>>2]=q;i=j;return}function Zj(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;b=i;i=i+32|0;j=b;k=b+16|0;l=b+12|0;ah(l,f);f=c[l>>2]|0;if(!((c[4918]|0)==-1)){c[j>>2]=19672;c[j+4>>2]=136;c[j+8>>2]=0;Dg(19672,j,137)}m=(c[19676>>2]|0)+ -1|0;n=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-n>>2>>>0>m>>>0)){o=Fb(4)|0;Ao(o);zc(o|0,27632,123)}f=c[n+(m<<2)>>2]|0;if((f|0)==0){o=Fb(4)|0;Ao(o);zc(o|0,27632,123)}jg(c[l>>2]|0)|0;l=h+20|0;c[k>>2]=c[e>>2];c[j+0>>2]=c[k+0>>2];k=bk(d,j,g,f,4)|0;if((c[g>>2]&4|0)!=0){p=c[d>>2]|0;c[a>>2]=p;i=b;return}if((k|0)<69){q=k+2e3|0}else{q=(k+ -69|0)>>>0<31?k+1900|0:k}c[l>>2]=q+ -1900;p=c[d>>2]|0;c[a>>2]=p;i=b;return}function _j(b,d,e,f,g,h,j,k,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0;l=i;i=i+176|0;m=l;n=l+164|0;o=l+160|0;p=l+156|0;q=l+152|0;r=l+148|0;s=l+144|0;t=l+140|0;u=l+136|0;v=l+132|0;w=l+128|0;x=l+124|0;y=l+120|0;z=l+116|0;A=l+112|0;B=l+108|0;C=l+104|0;D=l+100|0;E=l+96|0;F=l+92|0;G=l+88|0;H=l+84|0;I=l+80|0;J=l+76|0;K=l+72|0;L=l+68|0;M=l+64|0;N=l+60|0;O=l+56|0;P=l+52|0;Q=l+48|0;R=l+44|0;S=l+40|0;T=l+36|0;U=l+32|0;V=l+28|0;W=l+24|0;X=l+20|0;Y=l+16|0;Z=l+12|0;c[h>>2]=0;ah(A,g);_=c[A>>2]|0;if(!((c[4918]|0)==-1)){c[m>>2]=19672;c[m+4>>2]=136;c[m+8>>2]=0;Dg(19672,m,137)}$=(c[19676>>2]|0)+ -1|0;aa=c[_+8>>2]|0;if(!((c[_+12>>2]|0)-aa>>2>>>0>$>>>0)){ba=Fb(4)|0;Ao(ba);zc(ba|0,27632,123)}_=c[aa+($<<2)>>2]|0;if((_|0)==0){ba=Fb(4)|0;Ao(ba);zc(ba|0,27632,123)}jg(c[A>>2]|0)|0;a:do{switch(k<<24>>24|0){case 101:case 100:{A=j+12|0;c[x>>2]=c[f>>2];c[m+0>>2]=c[x+0>>2];ba=bk(e,m,h,_,2)|0;$=c[h>>2]|0;if(($&4|0)==0?(ba+ -1|0)>>>0<31:0){c[A>>2]=ba;break a}c[h>>2]=$|4;break};case 65:case 97:{$=c[f>>2]|0;ba=d+8|0;A=Nc[c[c[ba>>2]>>2]&127](ba)|0;c[z>>2]=$;c[m+0>>2]=c[z+0>>2];$=(ri(e,m,A,A+168|0,_,h,0)|0)-A|0;if(($|0)<168){c[j+24>>2]=(($|0)/12|0|0)%7|0}break};case 99:{$=d+8|0;A=Nc[c[(c[$>>2]|0)+12>>2]&127]($)|0;c[C>>2]=c[e>>2];c[D>>2]=c[f>>2];$=a[A]|0;if(($&1)==0){ca=A+1|0;da=($&255)>>>1;ea=A+1|0}else{$=c[A+8>>2]|0;ca=$;da=c[A+4>>2]|0;ea=$}c[n+0>>2]=c[C+0>>2];c[m+0>>2]=c[D+0>>2];Rj(B,d,n,m,g,h,j,ea,ca+da|0);c[e>>2]=c[B>>2];break};case 112:{$=j+8|0;A=c[f>>2]|0;ba=d+8|0;aa=Nc[c[(c[ba>>2]|0)+8>>2]&127](ba)|0;ba=a[aa]|0;if((ba&1)==0){fa=(ba&255)>>>1}else{fa=c[aa+4>>2]|0}ba=a[aa+12|0]|0;if((ba&1)==0){ga=(ba&255)>>>1}else{ga=c[aa+16>>2]|0}if((fa|0)==(0-ga|0)){c[h>>2]=c[h>>2]|4;break a}c[r>>2]=A;c[m+0>>2]=c[r+0>>2];A=ri(e,m,aa,aa+24|0,_,h,0)|0;ba=A-aa|0;if((A|0)==(aa|0)?(c[$>>2]|0)==12:0){c[$>>2]=0;break a}if((ba|0)==12?(ba=c[$>>2]|0,(ba|0)<12):0){c[$>>2]=ba+12}break};case 72:{c[w>>2]=c[f>>2];c[m+0>>2]=c[w+0>>2];ba=bk(e,m,h,_,2)|0;$=c[h>>2]|0;if(($&4|0)==0&(ba|0)<24){c[j+8>>2]=ba;break a}else{c[h>>2]=$|4;break a}break};case 106:{c[u>>2]=c[f>>2];c[m+0>>2]=c[u+0>>2];$=bk(e,m,h,_,3)|0;ba=c[h>>2]|0;if((ba&4|0)==0&($|0)<366){c[j+28>>2]=$;break a}else{c[h>>2]=ba|4;break a}break};case 116:case 110:{c[K>>2]=c[f>>2];c[m+0>>2]=c[K+0>>2];$j(0,e,m,h,_);break};case 109:{c[t>>2]=c[f>>2];c[m+0>>2]=c[t+0>>2];ba=bk(e,m,h,_,2)|0;$=c[h>>2]|0;if(($&4|0)==0&(ba|0)<13){c[j+16>>2]=ba+ -1;break a}else{c[h>>2]=$|4;break a}break};case 37:{c[Z>>2]=c[f>>2];c[m+0>>2]=c[Z+0>>2];ak(0,e,m,h,_);break};case 88:{$=d+8|0;ba=Nc[c[(c[$>>2]|0)+24>>2]&127]($)|0;c[X>>2]=c[e>>2];c[Y>>2]=c[f>>2];$=a[ba]|0;if(($&1)==0){ha=ba+1|0;ia=($&255)>>>1;ja=ba+1|0}else{$=c[ba+8>>2]|0;ha=$;ia=c[ba+4>>2]|0;ja=$}c[n+0>>2]=c[X+0>>2];c[m+0>>2]=c[Y+0>>2];Rj(W,d,n,m,g,h,j,ja,ha+ia|0);c[e>>2]=c[W>>2];break};case 121:{$=j+20|0;c[o>>2]=c[f>>2];c[m+0>>2]=c[o+0>>2];ba=bk(e,m,h,_,4)|0;if((c[h>>2]&4|0)==0){if((ba|0)<69){ka=ba+2e3|0}else{ka=(ba+ -69|0)>>>0<31?ba+1900|0:ba}c[$>>2]=ka+ -1900}break};case 89:{c[n>>2]=c[f>>2];c[m+0>>2]=c[n+0>>2];$=bk(e,m,h,_,4)|0;if((c[h>>2]&4|0)==0){c[j+20>>2]=$+ -1900}break};case 68:{c[F>>2]=c[e>>2];c[G>>2]=c[f>>2];c[n+0>>2]=c[F+0>>2];c[m+0>>2]=c[G+0>>2];Rj(E,d,n,m,g,h,j,18584,18592|0);c[e>>2]=c[E>>2];break};case 83:{c[q>>2]=c[f>>2];c[m+0>>2]=c[q+0>>2];$=bk(e,m,h,_,2)|0;ba=c[h>>2]|0;if((ba&4|0)==0&($|0)<61){c[j>>2]=$;break a}else{c[h>>2]=ba|4;break a}break};case 84:{c[S>>2]=c[e>>2];c[T>>2]=c[f>>2];c[n+0>>2]=c[S+0>>2];c[m+0>>2]=c[T+0>>2];Rj(R,d,n,m,g,h,j,18624,18632|0);c[e>>2]=c[R>>2];break};case 73:{ba=j+8|0;c[v>>2]=c[f>>2];c[m+0>>2]=c[v+0>>2];$=bk(e,m,h,_,2)|0;aa=c[h>>2]|0;if((aa&4|0)==0?($+ -1|0)>>>0<12:0){c[ba>>2]=$;break a}c[h>>2]=aa|4;break};case 119:{c[p>>2]=c[f>>2];c[m+0>>2]=c[p+0>>2];aa=bk(e,m,h,_,1)|0;$=c[h>>2]|0;if(($&4|0)==0&(aa|0)<7){c[j+24>>2]=aa;break a}else{c[h>>2]=$|4;break a}break};case 120:{$=c[(c[d>>2]|0)+20>>2]|0;c[U>>2]=c[e>>2];c[V>>2]=c[f>>2];c[n+0>>2]=c[U+0>>2];c[m+0>>2]=c[V+0>>2];Kc[$&63](b,d,n,m,g,h,j);i=l;return};case 114:{c[M>>2]=c[e>>2];c[N>>2]=c[f>>2];c[n+0>>2]=c[M+0>>2];c[m+0>>2]=c[N+0>>2];Rj(L,d,n,m,g,h,j,18600,18611|0);c[e>>2]=c[L>>2];break};case 82:{c[P>>2]=c[e>>2];c[Q>>2]=c[f>>2];c[n+0>>2]=c[P+0>>2];c[m+0>>2]=c[Q+0>>2];Rj(O,d,n,m,g,h,j,18616,18621|0);c[e>>2]=c[O>>2];break};case 70:{c[I>>2]=c[e>>2];c[J>>2]=c[f>>2];c[n+0>>2]=c[I+0>>2];c[m+0>>2]=c[J+0>>2];Rj(H,d,n,m,g,h,j,18592,18600|0);c[e>>2]=c[H>>2];break};case 77:{c[s>>2]=c[f>>2];c[m+0>>2]=c[s+0>>2];$=bk(e,m,h,_,2)|0;aa=c[h>>2]|0;if((aa&4|0)==0&($|0)<60){c[j+4>>2]=$;break a}else{c[h>>2]=aa|4;break a}break};case 104:case 66:case 98:{aa=c[f>>2]|0;$=d+8|0;ba=Nc[c[(c[$>>2]|0)+4>>2]&127]($)|0;c[y>>2]=aa;c[m+0>>2]=c[y+0>>2];aa=(ri(e,m,ba,ba+288|0,_,h,0)|0)-ba|0;if((aa|0)<288){c[j+16>>2]=((aa|0)/12|0|0)%12|0}break};default:{c[h>>2]=c[h>>2]|4}}}while(0);c[b>>2]=c[e>>2];i=l;return}function $j(a,e,f,g,h){a=a|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;a=i;j=h+8|0;a:while(1){h=c[e>>2]|0;do{if((h|0)!=0){if((c[h+12>>2]|0)==(c[h+16>>2]|0)){if((Nc[c[(c[h>>2]|0)+36>>2]&127](h)|0)==-1){c[e>>2]=0;k=0;break}else{k=c[e>>2]|0;break}}else{k=h}}else{k=0}}while(0);h=(k|0)==0;l=c[f>>2]|0;do{if((l|0)!=0){if((c[l+12>>2]|0)!=(c[l+16>>2]|0)){if(h){m=l;break}else{n=l;break a}}if(!((Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0)==-1)){if(h){m=l;break}else{n=l;break a}}else{c[f>>2]=0;o=12;break}}else{o=12}}while(0);if((o|0)==12){o=0;if(h){n=0;break}else{m=0}}l=c[e>>2]|0;p=c[l+12>>2]|0;if((p|0)==(c[l+16>>2]|0)){q=Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0}else{q=d[p]|0}if(!((q&255)<<24>>24>-1)){n=m;break}if((b[(c[j>>2]|0)+(q<<24>>24<<1)>>1]&8192)==0){n=m;break}p=c[e>>2]|0;l=p+12|0;r=c[l>>2]|0;if((r|0)==(c[p+16>>2]|0)){Nc[c[(c[p>>2]|0)+40>>2]&127](p)|0;continue}else{c[l>>2]=r+1;continue}}m=c[e>>2]|0;do{if((m|0)!=0){if((c[m+12>>2]|0)==(c[m+16>>2]|0)){if((Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0)==-1){c[e>>2]=0;s=0;break}else{s=c[e>>2]|0;break}}else{s=m}}else{s=0}}while(0);m=(s|0)==0;do{if((n|0)!=0){if((c[n+12>>2]|0)==(c[n+16>>2]|0)?(Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0)==-1:0){c[f>>2]=0;o=32;break}if(m){i=a;return}}else{o=32}}while(0);if((o|0)==32?!m:0){i=a;return}c[g>>2]=c[g>>2]|2;i=a;return}function ak(a,b,e,f,g){a=a|0;b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0;a=i;h=c[b>>2]|0;do{if((h|0)!=0){if((c[h+12>>2]|0)==(c[h+16>>2]|0)){if((Nc[c[(c[h>>2]|0)+36>>2]&127](h)|0)==-1){c[b>>2]=0;j=0;break}else{j=c[b>>2]|0;break}}else{j=h}}else{j=0}}while(0);h=(j|0)==0;j=c[e>>2]|0;do{if((j|0)!=0){if((c[j+12>>2]|0)==(c[j+16>>2]|0)?(Nc[c[(c[j>>2]|0)+36>>2]&127](j)|0)==-1:0){c[e>>2]=0;k=11;break}if(h){l=j}else{k=12}}else{k=11}}while(0);if((k|0)==11){if(h){k=12}else{l=0}}if((k|0)==12){c[f>>2]=c[f>>2]|6;i=a;return}h=c[b>>2]|0;j=c[h+12>>2]|0;if((j|0)==(c[h+16>>2]|0)){m=Nc[c[(c[h>>2]|0)+36>>2]&127](h)|0}else{m=d[j]|0}if(!((Gc[c[(c[g>>2]|0)+36>>2]&31](g,m&255,0)|0)<<24>>24==37)){c[f>>2]=c[f>>2]|4;i=a;return}m=c[b>>2]|0;g=m+12|0;j=c[g>>2]|0;if((j|0)==(c[m+16>>2]|0)){Nc[c[(c[m>>2]|0)+40>>2]&127](m)|0}else{c[g>>2]=j+1}j=c[b>>2]|0;do{if((j|0)!=0){if((c[j+12>>2]|0)==(c[j+16>>2]|0)){if((Nc[c[(c[j>>2]|0)+36>>2]&127](j)|0)==-1){c[b>>2]=0;n=0;break}else{n=c[b>>2]|0;break}}else{n=j}}else{n=0}}while(0);j=(n|0)==0;do{if((l|0)!=0){if((c[l+12>>2]|0)==(c[l+16>>2]|0)?(Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0)==-1:0){c[e>>2]=0;k=31;break}if(j){i=a;return}}else{k=31}}while(0);if((k|0)==31?!j:0){i=a;return}c[f>>2]=c[f>>2]|2;i=a;return}function bk(a,e,f,g,h){a=a|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;j=i;k=c[a>>2]|0;do{if((k|0)!=0){if((c[k+12>>2]|0)==(c[k+16>>2]|0)){if((Nc[c[(c[k>>2]|0)+36>>2]&127](k)|0)==-1){c[a>>2]=0;l=0;break}else{l=c[a>>2]|0;break}}else{l=k}}else{l=0}}while(0);k=(l|0)==0;l=c[e>>2]|0;do{if((l|0)!=0){if((c[l+12>>2]|0)==(c[l+16>>2]|0)?(Nc[c[(c[l>>2]|0)+36>>2]&127](l)|0)==-1:0){c[e>>2]=0;m=11;break}if(k){n=l}else{m=12}}else{m=11}}while(0);if((m|0)==11){if(k){m=12}else{n=0}}if((m|0)==12){c[f>>2]=c[f>>2]|6;o=0;i=j;return o|0}k=c[a>>2]|0;l=c[k+12>>2]|0;if((l|0)==(c[k+16>>2]|0)){p=Nc[c[(c[k>>2]|0)+36>>2]&127](k)|0}else{p=d[l]|0}l=p&255;if(l<<24>>24>-1?(k=g+8|0,!((b[(c[k>>2]|0)+(p<<24>>24<<1)>>1]&2048)==0)):0){p=(Gc[c[(c[g>>2]|0)+36>>2]&31](g,l,0)|0)<<24>>24;l=c[a>>2]|0;q=l+12|0;r=c[q>>2]|0;if((r|0)==(c[l+16>>2]|0)){Nc[c[(c[l>>2]|0)+40>>2]&127](l)|0;s=h;t=n;u=n;v=p}else{c[q>>2]=r+1;s=h;t=n;u=n;v=p}while(1){w=v+ -48|0;p=s+ -1|0;n=c[a>>2]|0;do{if((n|0)!=0){if((c[n+12>>2]|0)==(c[n+16>>2]|0)){if((Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0)==-1){c[a>>2]=0;x=0;break}else{x=c[a>>2]|0;break}}else{x=n}}else{x=0}}while(0);n=(x|0)==0;if((u|0)!=0){if((c[u+12>>2]|0)==(c[u+16>>2]|0)){if((Nc[c[(c[u>>2]|0)+36>>2]&127](u)|0)==-1){c[e>>2]=0;y=0;z=0}else{y=t;z=t}}else{y=t;z=u}}else{y=t;z=0}A=c[a>>2]|0;if(!((n^(z|0)==0)&(p|0)>0)){m=40;break}n=c[A+12>>2]|0;if((n|0)==(c[A+16>>2]|0)){B=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{B=d[n]|0}n=B&255;if(!(n<<24>>24>-1)){o=w;m=52;break}if((b[(c[k>>2]|0)+(B<<24>>24<<1)>>1]&2048)==0){o=w;m=52;break}h=((Gc[c[(c[g>>2]|0)+36>>2]&31](g,n,0)|0)<<24>>24)+(w*10|0)|0;n=c[a>>2]|0;r=n+12|0;q=c[r>>2]|0;if((q|0)==(c[n+16>>2]|0)){Nc[c[(c[n>>2]|0)+40>>2]&127](n)|0;s=p;t=y;u=z;v=h;continue}else{c[r>>2]=q+1;s=p;t=y;u=z;v=h;continue}}if((m|0)==40){do{if((A|0)!=0){if((c[A+12>>2]|0)==(c[A+16>>2]|0)){if((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1){c[a>>2]=0;C=0;break}else{C=c[a>>2]|0;break}}else{C=A}}else{C=0}}while(0);A=(C|0)==0;do{if((y|0)!=0){if((c[y+12>>2]|0)==(c[y+16>>2]|0)?(Nc[c[(c[y>>2]|0)+36>>2]&127](y)|0)==-1:0){c[e>>2]=0;m=50;break}if(A){o=w;i=j;return o|0}}else{m=50}}while(0);if((m|0)==50?!A:0){o=w;i=j;return o|0}c[f>>2]=c[f>>2]|2;o=w;i=j;return o|0}else if((m|0)==52){i=j;return o|0}}c[f>>2]=c[f>>2]|4;o=0;i=j;return o|0}function ck(a,b,d,e,f,g,h,j,k){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0;l=i;i=i+32|0;m=l;n=l+28|0;o=l+24|0;p=l+20|0;q=l+16|0;r=l+12|0;ah(o,f);s=c[o>>2]|0;if(!((c[4916]|0)==-1)){c[m>>2]=19664;c[m+4>>2]=136;c[m+8>>2]=0;Dg(19664,m,137)}t=(c[19668>>2]|0)+ -1|0;u=c[s+8>>2]|0;if(!((c[s+12>>2]|0)-u>>2>>>0>t>>>0)){v=Fb(4)|0;Ao(v);zc(v|0,27632,123)}s=c[u+(t<<2)>>2]|0;if((s|0)==0){v=Fb(4)|0;Ao(v);zc(v|0,27632,123)}jg(c[o>>2]|0)|0;c[g>>2]=0;a:do{if((j|0)!=(k|0)){o=j;v=0;b:while(1){t=v;while(1){if((t|0)!=0){w=69;break a}u=c[d>>2]|0;if((u|0)!=0){x=c[u+12>>2]|0;if((x|0)==(c[u+16>>2]|0)){y=Nc[c[(c[u>>2]|0)+36>>2]&127](u)|0}else{y=c[x>>2]|0}if((y|0)==-1){c[d>>2]=0;z=1;A=0}else{z=0;A=u}}else{z=1;A=0}u=c[e>>2]|0;do{if((u|0)!=0){x=c[u+12>>2]|0;if((x|0)==(c[u+16>>2]|0)){B=Nc[c[(c[u>>2]|0)+36>>2]&127](u)|0}else{B=c[x>>2]|0}if(!((B|0)==-1)){if(z){C=u;break}else{w=24;break b}}else{c[e>>2]=0;w=22;break}}else{w=22}}while(0);if((w|0)==22){w=0;if(z){w=24;break b}else{C=0}}if((Gc[c[(c[s>>2]|0)+52>>2]&31](s,c[o>>2]|0,0)|0)<<24>>24==37){w=26;break}if(Gc[c[(c[s>>2]|0)+12>>2]&31](s,8192,c[o>>2]|0)|0){D=o;w=36;break}E=A+12|0;u=c[E>>2]|0;F=A+16|0;if((u|0)==(c[F>>2]|0)){G=Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0}else{G=c[u>>2]|0}u=Wc[c[(c[s>>2]|0)+28>>2]&15](s,G)|0;if((u|0)==(Wc[c[(c[s>>2]|0)+28>>2]&15](s,c[o>>2]|0)|0)){w=64;break}c[g>>2]=4;t=4}c:do{if((w|0)==26){w=0;t=o+4|0;if((t|0)==(k|0)){w=27;break b}u=Gc[c[(c[s>>2]|0)+52>>2]&31](s,c[t>>2]|0,0)|0;if(u<<24>>24==48|u<<24>>24==69){x=o+8|0;if((x|0)==(k|0)){w=30;break b}H=x;I=Gc[c[(c[s>>2]|0)+52>>2]&31](s,c[x>>2]|0,0)|0;J=u}else{H=t;I=u;J=0}u=c[(c[b>>2]|0)+36>>2]|0;c[q>>2]=A;c[r>>2]=C;c[n+0>>2]=c[q+0>>2];c[m+0>>2]=c[r+0>>2];Mc[u&3](p,b,n,m,f,g,h,I,J);c[d>>2]=c[p>>2];K=H+4|0}else if((w|0)==36){while(1){w=0;u=D+4|0;if((u|0)==(k|0)){L=k;break}if(Gc[c[(c[s>>2]|0)+12>>2]&31](s,8192,c[u>>2]|0)|0){D=u;w=36}else{L=u;break}}u=A;t=C;x=C;while(1){if((u|0)!=0){M=c[u+12>>2]|0;if((M|0)==(c[u+16>>2]|0)){N=Nc[c[(c[u>>2]|0)+36>>2]&127](u)|0}else{N=c[M>>2]|0}if((N|0)==-1){c[d>>2]=0;O=1;P=0}else{O=0;P=u}}else{O=1;P=0}do{if((x|0)!=0){M=c[x+12>>2]|0;if((M|0)==(c[x+16>>2]|0)){Q=Nc[c[(c[x>>2]|0)+36>>2]&127](x)|0}else{Q=c[M>>2]|0}if(!((Q|0)==-1)){if(O^(t|0)==0){R=t;S=t;break}else{K=L;break c}}else{c[e>>2]=0;T=0;w=51;break}}else{T=t;w=51}}while(0);if((w|0)==51){w=0;if(O){K=L;break c}else{R=T;S=0}}M=P+12|0;U=c[M>>2]|0;V=P+16|0;if((U|0)==(c[V>>2]|0)){W=Nc[c[(c[P>>2]|0)+36>>2]&127](P)|0}else{W=c[U>>2]|0}if(!(Gc[c[(c[s>>2]|0)+12>>2]&31](s,8192,W)|0)){K=L;break c}U=c[M>>2]|0;if((U|0)==(c[V>>2]|0)){Nc[c[(c[P>>2]|0)+40>>2]&127](P)|0;u=P;t=R;x=S;continue}else{c[M>>2]=U+4;u=P;t=R;x=S;continue}}}else if((w|0)==64){w=0;x=c[E>>2]|0;if((x|0)==(c[F>>2]|0)){Nc[c[(c[A>>2]|0)+40>>2]&127](A)|0}else{c[E>>2]=x+4}K=o+4|0}}while(0);if((K|0)==(k|0)){w=69;break a}o=K;v=c[g>>2]|0}if((w|0)==24){c[g>>2]=4;X=A;break}else if((w|0)==27){c[g>>2]=4;X=A;break}else if((w|0)==30){c[g>>2]=4;X=A;break}}else{w=69}}while(0);if((w|0)==69){X=c[d>>2]|0}if((X|0)!=0){A=c[X+12>>2]|0;if((A|0)==(c[X+16>>2]|0)){Y=Nc[c[(c[X>>2]|0)+36>>2]&127](X)|0}else{Y=c[A>>2]|0}if((Y|0)==-1){c[d>>2]=0;Z=0;_=1}else{Z=X;_=0}}else{Z=0;_=1}X=c[e>>2]|0;do{if((X|0)!=0){d=c[X+12>>2]|0;if((d|0)==(c[X+16>>2]|0)){$=Nc[c[(c[X>>2]|0)+36>>2]&127](X)|0}else{$=c[d>>2]|0}if(($|0)==-1){c[e>>2]=0;w=82;break}if(_){c[a>>2]=Z;i=l;return}}else{w=82}}while(0);if((w|0)==82?!_:0){c[a>>2]=Z;i=l;return}c[g>>2]=c[g>>2]|2;c[a>>2]=Z;i=l;return}function dk(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function ek(a){a=a|0;return}function fk(a){a=a|0;return 2}function gk(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0;j=i;i=i+16|0;k=j+12|0;l=j+8|0;m=j+4|0;n=j;c[m>>2]=c[d>>2];c[n>>2]=c[e>>2];c[l+0>>2]=c[m+0>>2];c[k+0>>2]=c[n+0>>2];ck(a,b,l,k,f,g,h,18728,18760|0);i=j;return}function hk(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;k=i;i=i+16|0;l=k+12|0;m=k+8|0;n=k+4|0;o=k;p=d+8|0;q=Nc[c[(c[p>>2]|0)+20>>2]&127](p)|0;c[n>>2]=c[e>>2];c[o>>2]=c[f>>2];f=a[q]|0;if((f&1)==0){r=q+4|0;s=(f&255)>>>1;t=q+4|0}else{f=c[q+8>>2]|0;r=f;s=c[q+4>>2]|0;t=f}f=r+(s<<2)|0;c[m+0>>2]=c[n+0>>2];c[l+0>>2]=c[o+0>>2];ck(b,d,m,l,g,h,j,t,f);i=k;return}function ik(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=i;i=i+32|0;k=j;l=j+16|0;m=j+12|0;ah(m,f);f=c[m>>2]|0;if(!((c[4916]|0)==-1)){c[k>>2]=19664;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19664,k,137)}n=(c[19668>>2]|0)+ -1|0;o=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-o>>2>>>0>n>>>0)){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}f=c[o+(n<<2)>>2]|0;if((f|0)==0){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}jg(c[m>>2]|0)|0;m=c[e>>2]|0;e=b+8|0;b=Nc[c[c[e>>2]>>2]&127](e)|0;c[l>>2]=m;m=b+168|0;c[k+0>>2]=c[l+0>>2];l=(Qi(d,k,b,m,f,g,0)|0)-b|0;if((l|0)>=168){q=c[d>>2]|0;c[a>>2]=q;i=j;return}c[h+24>>2]=((l|0)/12|0|0)%7|0;q=c[d>>2]|0;c[a>>2]=q;i=j;return}function jk(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=i;i=i+32|0;k=j;l=j+16|0;m=j+12|0;ah(m,f);f=c[m>>2]|0;if(!((c[4916]|0)==-1)){c[k>>2]=19664;c[k+4>>2]=136;c[k+8>>2]=0;Dg(19664,k,137)}n=(c[19668>>2]|0)+ -1|0;o=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-o>>2>>>0>n>>>0)){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}f=c[o+(n<<2)>>2]|0;if((f|0)==0){p=Fb(4)|0;Ao(p);zc(p|0,27632,123)}jg(c[m>>2]|0)|0;m=c[e>>2]|0;e=b+8|0;b=Nc[c[(c[e>>2]|0)+4>>2]&127](e)|0;c[l>>2]=m;m=b+288|0;c[k+0>>2]=c[l+0>>2];l=(Qi(d,k,b,m,f,g,0)|0)-b|0;if((l|0)>=288){q=c[d>>2]|0;c[a>>2]=q;i=j;return}c[h+16>>2]=((l|0)/12|0|0)%12|0;q=c[d>>2]|0;c[a>>2]=q;i=j;return}function kk(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;b=i;i=i+32|0;j=b;k=b+16|0;l=b+12|0;ah(l,f);f=c[l>>2]|0;if(!((c[4916]|0)==-1)){c[j>>2]=19664;c[j+4>>2]=136;c[j+8>>2]=0;Dg(19664,j,137)}m=(c[19668>>2]|0)+ -1|0;n=c[f+8>>2]|0;if(!((c[f+12>>2]|0)-n>>2>>>0>m>>>0)){o=Fb(4)|0;Ao(o);zc(o|0,27632,123)}f=c[n+(m<<2)>>2]|0;if((f|0)==0){o=Fb(4)|0;Ao(o);zc(o|0,27632,123)}jg(c[l>>2]|0)|0;l=h+20|0;c[k>>2]=c[e>>2];c[j+0>>2]=c[k+0>>2];k=ok(d,j,g,f,4)|0;if((c[g>>2]&4|0)!=0){p=c[d>>2]|0;c[a>>2]=p;i=b;return}if((k|0)<69){q=k+2e3|0}else{q=(k+ -69|0)>>>0<31?k+1900|0:k}c[l>>2]=q+ -1900;p=c[d>>2]|0;c[a>>2]=p;i=b;return}function lk(b,d,e,f,g,h,j,k,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0;l=i;i=i+176|0;m=l;n=l+164|0;o=l+160|0;p=l+156|0;q=l+152|0;r=l+148|0;s=l+144|0;t=l+140|0;u=l+136|0;v=l+132|0;w=l+128|0;x=l+124|0;y=l+120|0;z=l+116|0;A=l+112|0;B=l+108|0;C=l+104|0;D=l+100|0;E=l+96|0;F=l+92|0;G=l+88|0;H=l+84|0;I=l+80|0;J=l+76|0;K=l+72|0;L=l+68|0;M=l+64|0;N=l+60|0;O=l+56|0;P=l+52|0;Q=l+48|0;R=l+44|0;S=l+40|0;T=l+36|0;U=l+32|0;V=l+28|0;W=l+24|0;X=l+20|0;Y=l+16|0;Z=l+12|0;c[h>>2]=0;ah(A,g);_=c[A>>2]|0;if(!((c[4916]|0)==-1)){c[m>>2]=19664;c[m+4>>2]=136;c[m+8>>2]=0;Dg(19664,m,137)}$=(c[19668>>2]|0)+ -1|0;aa=c[_+8>>2]|0;if(!((c[_+12>>2]|0)-aa>>2>>>0>$>>>0)){ba=Fb(4)|0;Ao(ba);zc(ba|0,27632,123)}_=c[aa+($<<2)>>2]|0;if((_|0)==0){ba=Fb(4)|0;Ao(ba);zc(ba|0,27632,123)}jg(c[A>>2]|0)|0;a:do{switch(k<<24>>24|0){case 109:{c[t>>2]=c[f>>2];c[m+0>>2]=c[t+0>>2];A=ok(e,m,h,_,2)|0;ba=c[h>>2]|0;if((ba&4|0)==0&(A|0)<13){c[j+16>>2]=A+ -1;break a}else{c[h>>2]=ba|4;break a}break};case 68:{c[F>>2]=c[e>>2];c[G>>2]=c[f>>2];c[n+0>>2]=c[F+0>>2];c[m+0>>2]=c[G+0>>2];ck(E,d,n,m,g,h,j,18760,18792|0);c[e>>2]=c[E>>2];break};case 65:case 97:{ba=c[f>>2]|0;A=d+8|0;$=Nc[c[c[A>>2]>>2]&127](A)|0;c[z>>2]=ba;c[m+0>>2]=c[z+0>>2];ba=(Qi(e,m,$,$+168|0,_,h,0)|0)-$|0;if((ba|0)<168){c[j+24>>2]=((ba|0)/12|0|0)%7|0}break};case 77:{c[s>>2]=c[f>>2];c[m+0>>2]=c[s+0>>2];ba=ok(e,m,h,_,2)|0;$=c[h>>2]|0;if(($&4|0)==0&(ba|0)<60){c[j+4>>2]=ba;break a}else{c[h>>2]=$|4;break a}break};case 114:{c[M>>2]=c[e>>2];c[N>>2]=c[f>>2];c[n+0>>2]=c[M+0>>2];c[m+0>>2]=c[N+0>>2];ck(L,d,n,m,g,h,j,18824,18868|0);c[e>>2]=c[L>>2];break};case 104:case 66:case 98:{$=c[f>>2]|0;ba=d+8|0;A=Nc[c[(c[ba>>2]|0)+4>>2]&127](ba)|0;c[y>>2]=$;c[m+0>>2]=c[y+0>>2];$=(Qi(e,m,A,A+288|0,_,h,0)|0)-A|0;if(($|0)<288){c[j+16>>2]=(($|0)/12|0|0)%12|0}break};case 99:{$=d+8|0;A=Nc[c[(c[$>>2]|0)+12>>2]&127]($)|0;c[C>>2]=c[e>>2];c[D>>2]=c[f>>2];$=a[A]|0;if(($&1)==0){ca=A+4|0;da=($&255)>>>1;ea=A+4|0}else{$=c[A+8>>2]|0;ca=$;da=c[A+4>>2]|0;ea=$}c[n+0>>2]=c[C+0>>2];c[m+0>>2]=c[D+0>>2];ck(B,d,n,m,g,h,j,ea,ca+(da<<2)|0);c[e>>2]=c[B>>2];break};case 101:case 100:{$=j+12|0;c[x>>2]=c[f>>2];c[m+0>>2]=c[x+0>>2];A=ok(e,m,h,_,2)|0;ba=c[h>>2]|0;if((ba&4|0)==0?(A+ -1|0)>>>0<31:0){c[$>>2]=A;break a}c[h>>2]=ba|4;break};case 106:{c[u>>2]=c[f>>2];c[m+0>>2]=c[u+0>>2];ba=ok(e,m,h,_,3)|0;A=c[h>>2]|0;if((A&4|0)==0&(ba|0)<366){c[j+28>>2]=ba;break a}else{c[h>>2]=A|4;break a}break};case 119:{c[p>>2]=c[f>>2];c[m+0>>2]=c[p+0>>2];A=ok(e,m,h,_,1)|0;ba=c[h>>2]|0;if((ba&4|0)==0&(A|0)<7){c[j+24>>2]=A;break a}else{c[h>>2]=ba|4;break a}break};case 120:{ba=c[(c[d>>2]|0)+20>>2]|0;c[U>>2]=c[e>>2];c[V>>2]=c[f>>2];c[n+0>>2]=c[U+0>>2];c[m+0>>2]=c[V+0>>2];Kc[ba&63](b,d,n,m,g,h,j);i=l;return};case 121:{ba=j+20|0;c[o>>2]=c[f>>2];c[m+0>>2]=c[o+0>>2];A=ok(e,m,h,_,4)|0;if((c[h>>2]&4|0)==0){if((A|0)<69){fa=A+2e3|0}else{fa=(A+ -69|0)>>>0<31?A+1900|0:A}c[ba>>2]=fa+ -1900}break};case 89:{c[n>>2]=c[f>>2];c[m+0>>2]=c[n+0>>2];ba=ok(e,m,h,_,4)|0;if((c[h>>2]&4|0)==0){c[j+20>>2]=ba+ -1900}break};case 37:{c[Z>>2]=c[f>>2];c[m+0>>2]=c[Z+0>>2];nk(0,e,m,h,_);break};case 83:{c[q>>2]=c[f>>2];c[m+0>>2]=c[q+0>>2];ba=ok(e,m,h,_,2)|0;A=c[h>>2]|0;if((A&4|0)==0&(ba|0)<61){c[j>>2]=ba;break a}else{c[h>>2]=A|4;break a}break};case 84:{c[S>>2]=c[e>>2];c[T>>2]=c[f>>2];c[n+0>>2]=c[S+0>>2];c[m+0>>2]=c[T+0>>2];ck(R,d,n,m,g,h,j,18896,18928|0);c[e>>2]=c[R>>2];break};case 70:{c[I>>2]=c[e>>2];c[J>>2]=c[f>>2];c[n+0>>2]=c[I+0>>2];c[m+0>>2]=c[J+0>>2];ck(H,d,n,m,g,h,j,18792,18824|0);c[e>>2]=c[H>>2];break};case 88:{A=d+8|0;ba=Nc[c[(c[A>>2]|0)+24>>2]&127](A)|0;c[X>>2]=c[e>>2];c[Y>>2]=c[f>>2];A=a[ba]|0;if((A&1)==0){ga=ba+4|0;ha=(A&255)>>>1;ia=ba+4|0}else{A=c[ba+8>>2]|0;ga=A;ha=c[ba+4>>2]|0;ia=A}c[n+0>>2]=c[X+0>>2];c[m+0>>2]=c[Y+0>>2];ck(W,d,n,m,g,h,j,ia,ga+(ha<<2)|0);c[e>>2]=c[W>>2];break};case 112:{A=j+8|0;ba=c[f>>2]|0;$=d+8|0;aa=Nc[c[(c[$>>2]|0)+8>>2]&127]($)|0;$=a[aa]|0;if(($&1)==0){ja=($&255)>>>1}else{ja=c[aa+4>>2]|0}$=a[aa+12|0]|0;if(($&1)==0){ka=($&255)>>>1}else{ka=c[aa+16>>2]|0}if((ja|0)==(0-ka|0)){c[h>>2]=c[h>>2]|4;break a}c[r>>2]=ba;c[m+0>>2]=c[r+0>>2];ba=Qi(e,m,aa,aa+24|0,_,h,0)|0;$=ba-aa|0;if((ba|0)==(aa|0)?(c[A>>2]|0)==12:0){c[A>>2]=0;break a}if(($|0)==12?($=c[A>>2]|0,($|0)<12):0){c[A>>2]=$+12}break};case 82:{c[P>>2]=c[e>>2];c[Q>>2]=c[f>>2];c[n+0>>2]=c[P+0>>2];c[m+0>>2]=c[Q+0>>2];ck(O,d,n,m,g,h,j,18872,18892|0);c[e>>2]=c[O>>2];break};case 72:{c[w>>2]=c[f>>2];c[m+0>>2]=c[w+0>>2];$=ok(e,m,h,_,2)|0;A=c[h>>2]|0;if((A&4|0)==0&($|0)<24){c[j+8>>2]=$;break a}else{c[h>>2]=A|4;break a}break};case 73:{A=j+8|0;c[v>>2]=c[f>>2];c[m+0>>2]=c[v+0>>2];$=ok(e,m,h,_,2)|0;aa=c[h>>2]|0;if((aa&4|0)==0?($+ -1|0)>>>0<12:0){c[A>>2]=$;break a}c[h>>2]=aa|4;break};case 116:case 110:{c[K>>2]=c[f>>2];c[m+0>>2]=c[K+0>>2];mk(0,e,m,h,_);break};default:{c[h>>2]=c[h>>2]|4}}}while(0);c[b>>2]=c[e>>2];i=l;return}function mk(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;a=i;a:while(1){g=c[b>>2]|0;do{if((g|0)!=0){h=c[g+12>>2]|0;if((h|0)==(c[g+16>>2]|0)){j=Nc[c[(c[g>>2]|0)+36>>2]&127](g)|0}else{j=c[h>>2]|0}if((j|0)==-1){c[b>>2]=0;k=1;break}else{k=(c[b>>2]|0)==0;break}}else{k=1}}while(0);g=c[d>>2]|0;do{if((g|0)!=0){h=c[g+12>>2]|0;if((h|0)==(c[g+16>>2]|0)){l=Nc[c[(c[g>>2]|0)+36>>2]&127](g)|0}else{l=c[h>>2]|0}if(!((l|0)==-1)){if(k){m=g;break}else{n=g;break a}}else{c[d>>2]=0;o=15;break}}else{o=15}}while(0);if((o|0)==15){o=0;if(k){n=0;break}else{m=0}}g=c[b>>2]|0;h=c[g+12>>2]|0;if((h|0)==(c[g+16>>2]|0)){p=Nc[c[(c[g>>2]|0)+36>>2]&127](g)|0}else{p=c[h>>2]|0}if(!(Gc[c[(c[f>>2]|0)+12>>2]&31](f,8192,p)|0)){n=m;break}h=c[b>>2]|0;g=h+12|0;q=c[g>>2]|0;if((q|0)==(c[h+16>>2]|0)){Nc[c[(c[h>>2]|0)+40>>2]&127](h)|0;continue}else{c[g>>2]=q+4;continue}}m=c[b>>2]|0;do{if((m|0)!=0){p=c[m+12>>2]|0;if((p|0)==(c[m+16>>2]|0)){r=Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0}else{r=c[p>>2]|0}if((r|0)==-1){c[b>>2]=0;s=1;break}else{s=(c[b>>2]|0)==0;break}}else{s=1}}while(0);do{if((n|0)!=0){b=c[n+12>>2]|0;if((b|0)==(c[n+16>>2]|0)){t=Nc[c[(c[n>>2]|0)+36>>2]&127](n)|0}else{t=c[b>>2]|0}if((t|0)==-1){c[d>>2]=0;o=37;break}if(s){i=a;return}}else{o=37}}while(0);if((o|0)==37?!s:0){i=a;return}c[e>>2]=c[e>>2]|2;i=a;return}function nk(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;a=i;g=c[b>>2]|0;do{if((g|0)!=0){h=c[g+12>>2]|0;if((h|0)==(c[g+16>>2]|0)){j=Nc[c[(c[g>>2]|0)+36>>2]&127](g)|0}else{j=c[h>>2]|0}if((j|0)==-1){c[b>>2]=0;k=1;break}else{k=(c[b>>2]|0)==0;break}}else{k=1}}while(0);j=c[d>>2]|0;do{if((j|0)!=0){g=c[j+12>>2]|0;if((g|0)==(c[j+16>>2]|0)){l=Nc[c[(c[j>>2]|0)+36>>2]&127](j)|0}else{l=c[g>>2]|0}if(!((l|0)==-1)){if(k){m=j;break}else{n=16;break}}else{c[d>>2]=0;n=14;break}}else{n=14}}while(0);if((n|0)==14){if(k){n=16}else{m=0}}if((n|0)==16){c[e>>2]=c[e>>2]|6;i=a;return}k=c[b>>2]|0;j=c[k+12>>2]|0;if((j|0)==(c[k+16>>2]|0)){o=Nc[c[(c[k>>2]|0)+36>>2]&127](k)|0}else{o=c[j>>2]|0}if(!((Gc[c[(c[f>>2]|0)+52>>2]&31](f,o,0)|0)<<24>>24==37)){c[e>>2]=c[e>>2]|4;i=a;return}o=c[b>>2]|0;f=o+12|0;j=c[f>>2]|0;if((j|0)==(c[o+16>>2]|0)){Nc[c[(c[o>>2]|0)+40>>2]&127](o)|0}else{c[f>>2]=j+4}j=c[b>>2]|0;do{if((j|0)!=0){f=c[j+12>>2]|0;if((f|0)==(c[j+16>>2]|0)){p=Nc[c[(c[j>>2]|0)+36>>2]&127](j)|0}else{p=c[f>>2]|0}if((p|0)==-1){c[b>>2]=0;q=1;break}else{q=(c[b>>2]|0)==0;break}}else{q=1}}while(0);do{if((m|0)!=0){b=c[m+12>>2]|0;if((b|0)==(c[m+16>>2]|0)){r=Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0}else{r=c[b>>2]|0}if((r|0)==-1){c[d>>2]=0;n=38;break}if(q){i=a;return}}else{n=38}}while(0);if((n|0)==38?!q:0){i=a;return}c[e>>2]=c[e>>2]|2;i=a;return}



function Zc(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function _c(){return i|0}function $c(a){a=a|0;i=a}function ad(a,b){a=a|0;b=b|0;if((t|0)==0){t=a;u=b}}function bd(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function cd(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function dd(a){a=a|0;I=a}function ed(a){a=a|0;J=a}function fd(a){a=a|0;K=a}function gd(a){a=a|0;L=a}function hd(a){a=a|0;M=a}function id(a){a=a|0;N=a}function jd(a){a=a|0;O=a}function kd(a){a=a|0;P=a}function ld(a){a=a|0;Q=a}function md(a){a=a|0;R=a}function nd(a){a=a|0;c[a>>2]=16;return}function od(a){a=a|0;return}function pd(a){a=a|0;return 0}function qd(a){a=a|0;return 0}function rd(a,b){a=a|0;b=b|0;return}function sd(a,b){a=a|0;b=+b;return}function td(a){a=a|0;return 1}function ud(a){a=a|0;return 0}function vd(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+16|0;d=b;nd(a);c[a>>2]=88;e=cc(120,0)|0;c[a+4>>2]=e;c[d>>2]=(e|0)/60|0;pb(152,d|0)|0;i=b;return}function wd(a){a=a|0;a=i;bc(176);i=a;return}function xd(a){a=a|0;return c[a+4>>2]|0}function yd(a,b){a=a|0;b=b|0;a=i;cc(192,b|0)|0;i=a;return}function zd(a){a=a|0;var b=0;a=i;b=cc(232,0)|0;i=a;return b|0}function Ad(a){a=a|0;return 0}function Bd(a,b){a=a|0;b=+b;a=i;cc(264,+b)|0;i=a;return}function Cd(a){a=a|0;var b=0;a=i;b=(cc(288,0)|0)==0;i=a;return b|0}function Dd(a){a=a|0;return}function Ed(b,c,e,f){b=b|0;c=c|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;b=i;i=i+16|0;if((e|0)>3){pb(1376,b|0)|0;g=0;i=b;return g|0}if((e|0)>0){h=e+ -1|0;j=0;k=0;while(1){l=d[c+(h-j)|0]|0;m=l|k<<8;j=j+1|0;if((j|0)==(e|0)){break}else{k=m}}if((e|0)==2){g=sb(f|0,l<<3&255|0,m>>>2&248|0,k&252|0)|0;i=b;return g|0}}g=a[352+(d[c]<<2)|0]|0;i=b;return g|0}function Fd(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;b=i;e=Xb(d|0,a[352+(c<<2)|0]|0,a[353+(c<<2)|0]|0,a[354+(c<<2)|0]|0,a[355+(c<<2)|0]|0)|0;i=b;return e|0}function Gd(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0;h=i;i=i+16|0;c[d+16>>2]=e;c[d+20>>2]=f;e=Nc[c[(c[f>>2]|0)+12>>2]&127](f)|0;c[d+64>>2]=e;$d(h);c[d+44>>2]=16;c[d+36>>2]=48;e=b[988]|0;c[d+32>>2]=e;f=b[992]|0;c[d+40>>2]=f;c[d+28>>2]=f;a[d+24|0]=0;c[d>>2]=0;c[d+4>>2]=0;c[d+8>>2]=e;c[d+12>>2]=f;a[d+48|0]=0;c[d+52>>2]=-1;a[d+56|0]=0;g[d+60>>2]=1.0;a[1416]=0;bc(1424);f=nc(Ha(1448,1472)|0,1)|0;e=d+68|0;c[e>>2]=f;f=nc(Ha(1480,1472)|0,1)|0;j=d+72|0;c[j>>2]=f;f=nc(Ha(1504,1472)|0,1)|0;k=d+76|0;c[k>>2]=f;f=nc(Ha(1528,1472)|0,1)|0;c[d+80>>2]=f;if(((c[e>>2]|0)!=0?(c[j>>2]|0)!=0:0)?!((c[k>>2]|0)==0|(f|0)==0):0){i=h;return}Va(1568)|0;i=h;return}function Hd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0.0,o=0.0,p=0;f=i;h=e&65535;e=b+28|0;j=c[e>>2]|0;if((h|0)<(j|0)){i=f;return}k=b+44|0;do{if((h|0)>=((c[k>>2]|0)+j|0)){if((d&65535)<48){l=c[b+20>>2]|0;Jc[c[c[l>>2]>>2]&255](l);break}if((d&65535|0)<((c[b+32>>2]|0)+ -48|0)&(d+ -64<<16>>16&65535)<65){a[b+56|0]=1}}else{a[b+48|0]=1}}while(0);j=a[b+48|0]|0;do{if((h|0)<((c[b+40>>2]|0)-(c[b+36>>2]|0)|0)){if(j<<24>>24==0){a[b+24|0]=a[b+56|0]|0;break}else{a[b+24|0]=1;m=13;break}}else{a[b+24|0]=1;if(!(j<<24>>24==0)){m=13}}}while(0);if((m|0)==13){c[b+52>>2]=d&65535}m=d&65535;if((a[b+56|0]|0)!=0){n=+(m+ -64|0);o=n>64.0?64.0:n;n=o<0.0?0.0:o*.015625;g[b+60>>2]=n;d=c[b+20>>2]|0;Hc[c[(c[d>>2]|0)+20>>2]&3](d,n)}if((m|0)<((c[b+32>>2]|0)+ -48|0)){p=0}else{p=(h|0)>=((c[k>>2]|0)+(c[e>>2]|0)|0)|0}a[1416]=p;i=f;return}function Id(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0.0,l=0.0,m=0;f=i;h=e&65535;e=a[b+48|0]|0;do{if((h|0)<((c[b+40>>2]|0)-(c[b+36>>2]|0)|0)){if(e<<24>>24==0){a[b+24|0]=a[b+56|0]|0;break}else{a[b+24|0]=1;j=6;break}}else{a[b+24|0]=1;if(!(e<<24>>24==0)){j=6}}}while(0);if((j|0)==6){c[b+52>>2]=d&65535}j=d&65535;if((a[b+56|0]|0)!=0){k=+(j+ -64|0);l=k>64.0?64.0:k;k=l<0.0?0.0:l*.015625;g[b+60>>2]=k;d=c[b+20>>2]|0;Hc[c[(c[d>>2]|0)+20>>2]&3](d,k)}if((j|0)<((c[b+32>>2]|0)+ -48|0)){m=0;a[1416]=m;i=f;return}m=(h|0)>=((c[b+44>>2]|0)+(c[b+28>>2]|0)|0)|0;a[1416]=m;i=f;return}function Jd(b){b=b|0;a[b+48|0]=0;a[b+56|0]=0;return}function Kd(){return(a[1416]|0)!=0|0}function Ld(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;e=b+28|0;f=c[e>>2]|0;g=c[b+40>>2]|0;do{if((a[b+24|0]|0)==0){h=c[b+32>>2]|0;c[b>>2]=0;j=b+4|0;if((f|0)<(g|0)){c[j>>2]=f;c[b+8>>2]=h;c[b+12>>2]=4;c[e>>2]=f+4;k=h;break}else{c[j>>2]=g;c[b+8>>2]=h;c[b+12>>2]=0;k=h;break}}else{if((f|0)>(g-(c[b+36>>2]|0)|0)){h=f+ -4|0;c[e>>2]=h;l=h}else{l=f}h=c[b+32>>2]|0;c[b>>2]=0;c[b+4>>2]=l;c[b+8>>2]=h;c[b+12>>2]=0;k=h}}while(0);if((a[b+48|0]|0)!=0){i=d;return}l=b+52|0;f=c[l>>2]|0;if(!((f|0)>-1)){i=d;return}e=g-(c[b+36>>2]|0)|0;c[b>>2]=0;c[b+4>>2]=0;c[b+8>>2]=k;c[b+12>>2]=e;e=(ea(f,c[b+64>>2]|0)|0)/(k|0)|0;k=c[b+20>>2]|0;Lc[c[(c[k>>2]|0)+8>>2]&63](k,e);he(c[b+16>>2]|0,e,b);c[l>>2]=-1;i=d;return}function Md(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;d=i;i=i+32|0;e=d+16|0;f=d;h=a+28|0;j=c[h>>2]|0;k=a+40|0;if((j|0)>=(c[k>>2]|0)){i=d;return}c[e+0>>2]=c[1552>>2];c[e+4>>2]=c[1556>>2];c[e+8>>2]=c[1560>>2];c[e+12>>2]=c[1564>>2];c[f>>2]=0;l=f+4|0;m=a+44|0;n=c[m>>2]|0;c[l>>2]=n+j;j=f+8|0;o=a+32|0;c[j>>2]=c[o>>2];p=f+12|0;q=a+36|0;c[p>>2]=(c[q>>2]|0)-n;if((qc(b|0,f|0,-16777216)|0)==-1){Va(1584)|0}n=c[m>>2]|0;r=n+(c[h>>2]|0)|0;s=(c[q>>2]|0)-n|0;c[f>>2]=0;c[l>>2]=r;c[j>>2]=48;c[p>>2]=s;qc(b|0,f|0,-12285901)|0;s=a+68|0;if((c[s>>2]|0)!=0){r=c[a+20>>2]|0;n=Nc[c[(c[r>>2]|0)+24>>2]&127](r)|0;c[e>>2]=n?48:0;Ec(c[s>>2]|0,e|0,b|0,f|0)|0}s=c[m>>2]|0;n=s+(c[h>>2]|0)|0;r=(c[q>>2]|0)-s|0;c[f>>2]=64;c[l>>2]=n;c[j>>2]=64;c[p>>2]=r;qc(b|0,f|0,-13421773)|0;r=c[m>>2]|0;n=r+(c[h>>2]|0)|0;s=a+60|0;t=~~(+g[s>>2]*64.0);u=(c[q>>2]|0)-r|0;c[f>>2]=64;c[l>>2]=n;c[j>>2]=t;c[p>>2]=u;qc(b|0,f|0,-16711936)|0;u=a+72|0;if(((c[u>>2]|0)!=0?(t=c[a+76>>2]|0,(t|0)!=0):0)?(n=(c[m>>2]|0)+(c[h>>2]|0)|0,c[f>>2]=64,c[l>>2]=n,c[j>>2]=64,c[p>>2]=32,c[e>>2]=0,n=e+4|0,c[n>>2]=0,r=e+8|0,c[r>>2]=64,v=e+12|0,c[v>>2]=32,Ec(t|0,e|0,b|0,f|0)|0,t=~~(+g[s>>2]*64.0),c[e>>2]=0,c[n>>2]=0,c[r>>2]=t,c[v>>2]=32,v=(c[m>>2]|0)+(c[h>>2]|0)|0,c[f>>2]=64,c[l>>2]=v,c[j>>2]=t,c[p>>2]=32,(t|0)>0):0){Ec(c[u>>2]|0,e|0,b|0,f|0)|0}u=c[m>>2]|0;t=u+(c[h>>2]|0)|0;v=(c[q>>2]|0)-u|0;c[f>>2]=(c[o>>2]|0)+ -48;c[l>>2]=t;c[j>>2]=48;c[p>>2]=v;qc(b|0,f|0,-12285901)|0;v=c[a+80>>2]|0;if((v|0)!=0){c[e>>2]=0;c[e+4>>2]=0;c[e+8>>2]=48;c[e+12>>2]=32;Ec(v|0,e|0,b|0,f|0)|0}e=c[h>>2]|0;v=c[o>>2]|0;t=c[m>>2]|0;c[f>>2]=0;c[l>>2]=e;c[j>>2]=v;c[p>>2]=t;qc(b|0,f|0,-13421773)|0;t=c[a+52>>2]|0;v=c[h>>2]|0;if((t|0)==-1){e=c[a+20>>2]|0;u=Nc[c[(c[e>>2]|0)+4>>2]&127](e)|0;e=ea(c[o>>2]|0,u)|0;w=(e|0)/(c[a+64>>2]|0)|0}else{w=t}t=c[m>>2]|0;c[f>>2]=0;c[l>>2]=v;c[j>>2]=w;c[p>>2]=t;qc(b|0,f|0,-16777046)|0;f=c[h>>2]|0;ab(b|0,0,f|0,c[o>>2]|0,(c[k>>2]|0)-f|0);Yb(b|0)|0;i=d;return}function Nd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;c[a>>2]=b;c[a+32772>>2]=0;b=a+32780|0;c[a+32812>>2]=0;c[a+32816>>2]=0;c[a+32820>>2]=0;e=a+32784|0;c[e>>2]=0;c[b>>2]=0;f=wf(b,1600,56)|0;g=a+32776|0;c[g>>2]=f;if((f|0)!=0){Va(1744)|0;i=d;return}f=a+4|0;h=Ea(f|0,1,16384,c[a>>2]|0)|0;c[e>>2]=h;if((Ra(c[a>>2]|0)|0)==0){j=h}else{Af(b)|0;c[g>>2]=-1;j=c[e>>2]|0}if((j|0)!=0){if((c[g>>2]|0)==0){c[b>>2]=f;c[a+32796>>2]=16384;c[a+32792>>2]=a+16388;a=xf(b,0)|0;c[g>>2]=a;if((a|0)==-2){Ia(1608,1632,50,1648)}else if((a|0)==2){c[g>>2]=-3}else if(!((a|0)==-4|(a|0)==-3)){i=d;return}Af(b)|0;Va(1712)|0;i=d;return}}else{c[g>>2]=-1}Va(1728)|0;i=d;return}function Od(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;e=i;i=i+16|0;f=e;g=b+32776|0;h=c[g>>2]|0;if((h|0)!=0){c[f>>2]=h;pb(1664,f|0)|0;j=1;i=e;return j|0}f=b+32772|0;h=c[f>>2]|0;k=b+32780|0;l=b+32796|0;m=c[l>>2]|0;do{if(h>>>0<(16384-m|0)>>>0){n=h}else{do{if((m|0)!=0){o=b+4|0;p=Ea(o|0,1,16384,c[b>>2]|0)|0;c[b+32784>>2]=p;if((Ra(c[b>>2]|0)|0)!=0){Af(k)|0;c[g>>2]=-1;j=1;i=e;return j|0}if((p|0)!=0){c[k>>2]=o;break}c[g>>2]=-1;j=1;i=e;return j|0}}while(0);c[l>>2]=16384;c[b+32792>>2]=b+16388;o=xf(k,0)|0;c[g>>2]=o;if((o|0)==-2){Va(1760)|0;q=c[g>>2]|0}else{q=o}if((q|0)==-2){Ia(1608,1632,102,1696)}else if((q|0)==2){c[g>>2]=-3}else if(!((q|0)==-4|(q|0)==-3)){c[f>>2]=0;n=0;break}Af(k)|0;j=(c[g>>2]|0)!=0;i=e;return j|0}}while(0);a[d]=a[b+n+16388|0]|0;c[f>>2]=(c[f>>2]|0)+1;j=(c[g>>2]|0)!=0;i=e;return j|0}function Pd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;e=b+4|0;a:do{if((c[e>>2]|0)>0){f=0;while(1){g=f+1|0;if(Od(a,(c[b>>2]|0)+f|0)|0){h=1;break a}if((g|0)<(c[e>>2]|0)){f=g}else{h=0;break}}}else{h=0}}while(0);i=d;return h|0}function Qd(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;a:do{if((d|0)>0){f=0;while(1){g=f+1|0;if(Od(b,c+f|0)|0){h=1;break}if((g|0)<(d|0)){f=g}else{break a}}i=e;return h|0}}while(0);a[c+d|0]=0;h=0;i=e;return h|0}function Rd(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=i;d=1;while(1){if(Od(a,b+d|0)|0){e=1;break}if((d|0)>0){d=d+ -1|0}else{e=0;break}}i=c;return e|0}function Sd(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=i;d=3;while(1){if(Od(a,b+d|0)|0){e=1;break}if((d|0)>0){d=d+ -1|0}else{e=0;break}}i=c;return e|0}function Td(a){a=a|0;return(c[a+32776>>2]|0)!=0|0}function Ud(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;f=i;i=i+96|0;g=f;h=f+80|0;j=f+68|0;k=f+56|0;l=f+44|0;m=f+32|0;n=f+20|0;o=f+8|0;c[b>>2]=1800;a[b+16|0]=0;c[446]=b;if((Kb(48)|0)!=0){p=Ma()|0;c[g>>2]=p;pb(1808,g|0)|0;i=f;return}p=sp(e|0)|0;if(p>>>0>4294967279){Eg(0)}if(p>>>0<11){a[h]=p<<1;q=h+1|0}else{r=p+16&-16;s=_o(r)|0;c[h+8>>2]=s;c[h>>2]=r|1;c[h+4>>2]=p;q=s}tp(q|0,e|0,p|0)|0;a[q+p|0]=0;p=sp(d|0)|0;if(p>>>0>4294967279){Eg(0)}if(p>>>0<11){a[j]=p<<1;t=j+1|0}else{q=p+16&-16;e=_o(q)|0;c[j+8>>2]=e;c[j>>2]=q|1;c[j+4>>2]=p;t=e}tp(t|0,d|0,p|0)|0;a[t+p|0]=0;p=_o(36)|0;Vd(o,j,1840);Wd(n,o,h);Vd(m,n,1848);Wd(l,m,h);Vd(k,l,1856);if((a[k]&1)==0){u=k+1|0}else{u=c[k+8>>2]|0}ce(p,u);u=b+8|0;c[u>>2]=p;if(!((a[k]&1)==0)){ap(c[k+8>>2]|0)}if(!((a[l]&1)==0)){ap(c[l+8>>2]|0)}if(!((a[m]&1)==0)){ap(c[m+8>>2]|0)}if(!((a[n]&1)==0)){ap(c[n+8>>2]|0)}if(!((a[o]&1)==0)){ap(c[o+8>>2]|0)}o=_o(8)|0;vd(o);n=b+4|0;c[n>>2]=o;do{if((a[(c[u>>2]|0)+4|0]|0)==0){if(Nc[c[(c[o>>2]|0)+16>>2]&127](o)|0){v=c[n>>2]|0;w=29;break}else{m=_o(84)|0;Gd(m,c[u>>2]|0,c[n>>2]|0);c[b+12>>2]=m;m=c[n>>2]|0;Jc[c[c[m>>2]>>2]&255](m);Va(1936)|0;vc(1,0,0);break}}else{v=o;w=29}}while(0);if((w|0)==29){w=Nc[c[(c[v>>2]|0)+16>>2]&127](v)|0;v=(a[(c[u>>2]|0)+4|0]|0)!=0?1904:1912;c[g>>2]=w?1904:1912;c[g+4>>2]=v;pb(1864,g|0)|0}if(!((a[j]&1)==0)){ap(c[j+8>>2]|0)}if((a[h]&1)==0){i=f;return}ap(c[h+8>>2]|0);i=f;return}function Vd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;c[b+0>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;g=a[d]|0;if((g&1)==0){h=(g&255)>>>1;j=sp(e|0)|0;k=d+1|0}else{g=c[d+4>>2]|0;l=sp(e|0)|0;h=g;j=l;k=c[d+8>>2]|0}d=j+h|0;if(d>>>0>4294967279){Eg(0)}if(d>>>0<11){a[b]=h<<1;m=b+1|0}else{l=d+16&-16;d=_o(l)|0;c[b+8>>2]=d;c[b>>2]=l|1;c[b+4>>2]=h;m=d}tp(m|0,k|0,h|0)|0;a[m+h|0]=0;Og(b,e,j)|0;i=f;return}function Wd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;c[b+0>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;g=a[d]|0;h=(g&1)==0;if(h){j=(g&255)>>>1}else{j=c[d+4>>2]|0}g=a[e]|0;if((g&1)==0){k=(g&255)>>>1}else{k=c[e+4>>2]|0}if(h){l=d+1|0}else{l=c[d+8>>2]|0}d=k+j|0;if(d>>>0>4294967279){Eg(0)}if(d>>>0<11){a[b]=j<<1;m=b+1|0}else{h=d+16&-16;d=_o(h)|0;c[b+8>>2]=d;c[b>>2]=h|1;c[b+4>>2]=j;m=d}tp(m|0,l|0,j|0)|0;a[m+j|0]=0;if((a[e]&1)==0){n=e+1|0;Og(b,n,k)|0;i=f;return}else{n=c[e+8>>2]|0;Og(b,n,k)|0;i=f;return}}function Xd(){var a=0;a=i;Yd(c[446]|0);i=a;return}function Yd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;i=i+48|0;e=d;if((jc(e|0)|0)==0){f=b+12|0}else{g=e+16|0;h=b+12|0;j=e+20|0;k=e+24|0;l=e+20|0;while(1){m=c[e>>2]|0;if((m|0)==1025){if((a[g]|0)==1){Hd(c[h>>2]|0,c[l>>2]&65535,c[k>>2]&65535)}}else if((m|0)==1026){if((a[g]|0)==1){Jd(c[h>>2]|0)}}else if((m|0)==1024){Id(c[h>>2]|0,c[j>>2]&65535,c[k>>2]&65535)}if((jc(e|0)|0)==0){f=h;break}}}Ld(c[f>>2]|0);h=c[b+8>>2]|0;e=c[b+4>>2]|0;b=Nc[c[(c[e>>2]|0)+4>>2]&127](e)|0;fe(h,b,c[f>>2]|0);i=d;return}function Zd(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function _d(a){a=a|0;return}function $d(a){a=a|0;return}function ae(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;e=Vo(b)|0;c[a>>2]=e;c[a+4>>2]=b;i=d;return}function be(a){a=a|0;var b=0;b=i;Wo(c[a>>2]|0);i=b;return}function ce(e,f){e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;g=i;i=i+32|0;h=g;j=g+16|0;c[e>>2]=2104;k=e+33|0;$d(k);a[e+32|0]=1;l=e+4|0;a[l]=0;m=_b(f|0,2112)|0;Ea(1952,1,12,m|0)|0;f=_o(32836)|0;Nd(f,m);if(de(f)|0){c[h>>2]=c[492];pb(2120,h|0)|0}ee(0,f);Sd(f,2088)|0;Sd(f,2088)|0;Ve();We(j,f,k);k=j+8|0;f=c[k>>2]|0;m=e+24|0;c[m>>2]=f;n=Vo(f<<2)|0;o=e+20|0;c[o>>2]=n;c[e+28>>2]=0;a:do{if((f|0)>0){p=j+4|0;q=n;r=f;s=0;while(1){c[q+(s<<2)>>2]=c[(c[p>>2]|0)+8>>2];t=c[p>>2]|0;u=t+4|0;c[(c[t>>2]|0)+4>>2]=c[u>>2];c[c[u>>2]>>2]=c[t>>2];c[k>>2]=r+ -1;ap(t);t=s+1|0;u=c[m>>2]|0;if((t|0)>=(u|0)){v=u;break a}q=c[o>>2]|0;r=c[k>>2]|0;s=t}}else{v=f}}while(0);c[h>>2]=v;pb(2160,h|0)|0;v=b[992]|0;f=c[500]|0;c[h>>2]=b[988]|0;c[h+4>>2]=v;c[h+8>>2]=f;pb(2192,h|0)|0;f=xb(b[988]|0,b[992]|0,a[1992]|0,5242880)|0;v=e+8|0;c[v>>2]=f;c[520]=c[f+4>>2];f=c[v>>2]|0;o=c[f+4>>2]|0;m=tb(c[f>>2]|0,c[f+8>>2]|0,c[f+12>>2]|0,d[o+8|0]|0,c[o+12>>2]|0,c[o+16>>2]|0,c[o+20>>2]|0,c[o+24>>2]|0)|0;c[e+12>>2]=m;if((a[3072]|0)!=0){Va(2408)|0;m=c[v>>2]|0;o=c[m+4>>2]|0;f=c[o+12>>2]|0;n=c[o+16>>2]|0;s=c[o+20>>2]|0;r=tb(c[m>>2]|0,c[m+8>>2]|0,c[m+12>>2]|0,d[o+8|0]|0,f|0,n|0,s|0,~f-n-s|0)|0;c[e+16>>2]=r;r=c[(c[v>>2]|0)+4>>2]|0;e=c[r+12>>2]|0;s=c[r+16>>2]|0;n=c[r+20>>2]|0;c[h>>2]=c[r+24>>2];c[h+4>>2]=e;c[h+8>>2]=s;c[h+12>>2]=n;pb(2224,h|0)|0}if((c[v>>2]|0)==0){v=Ma()|0;c[h>>2]=v;pb(2248,h|0)|0;a[l]=1}if((c[k>>2]|0)==0){i=g;return}l=c[j+4>>2]|0;h=(c[j>>2]|0)+4|0;c[(c[l>>2]|0)+4>>2]=c[h>>2];c[c[h>>2]>>2]=c[l>>2];c[k>>2]=0;if((l|0)==(j|0)){i=g;return}else{w=l}while(1){l=c[w+4>>2]|0;ap(w);if((l|0)==(j|0)){break}else{w=l}}i=g;return}function de(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+16|0;e=d+4|0;f=d;$d(d+5|0);Rd(b,1976)|0;Rd(b,1984)|0;Od(b,1992)|0;g=a[1992]|0;if((g|0)==8){c[500]=1}else if((g|0)==16){c[500]=2}else{c[500]=4}Od(b,2008)|0;Od(b,e)|0;a[2016]=(a[e]|0)!=0|0;Od(b,e)|0;a[2024]=(a[e]|0)!=0|0;Rd(b,2032)|0;Rd(b,2040)|0;Rd(b,2048)|0;Od(b,2056)|0;Od(b,2064)|0;Od(b,2072)|0;Od(b,e)|0;Od(b,e)|0;Od(b,e)|0;if(Sd(b,f)|0){h=0;i=d;return h|0}e=(c[f>>2]|0)+1|0;g=Ta()|0;j=i;i=i+((1*e|0)+15&-16)|0;Qd(b,j,c[f>>2]|0)|0;c[492]=j;db(g|0);h=1;i=d;return h|0}function ee(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;b=i;i=i+16|0;e=b;f=b+8|0;Sd(d,f)|0;g=c[f>>2]|0;if((g|0)>0){h=g}else{i=b;return}do{g=_o(8)|0;ae(g,h);c[e>>2]=c[f>>2];pb(2312,e|0)|0;Pd(d,g)|0;j=c[f>>2]|0;c[e>>2]=a[c[g>>2]|0]|0;c[e+4>>2]=j;pb(2344,e|0)|0;if((g|0)!=0){be(g);ap(g)}Sd(d,f)|0;h=c[f>>2]|0}while((h|0)>0);i=b;return}function fe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;f=i;g=b+20|0;h=b+28|0;j=c[h>>2]|0;k=b+24|0;if((j|0)<(c[k>>2]|0)){l=d*1e3|0;d=b+16|0;m=b+33|0;n=b+12|0;o=j;j=0;p=0;while(1){q=c[(c[g>>2]|0)+(o<<2)>>2]|0;if((c[q+8>>2]|0)>(l|0)){r=j;s=p;break}t=a[q+16|0]|0;if((t|0)==97){Pc[c[(c[q>>2]|0)+8>>2]&15](q,c[d>>2]|0,m);u=1;v=p}else if((t|0)==114){Pc[c[(c[q>>2]|0)+8>>2]&15](q,c[n>>2]|0,m);u=j;v=1}else if((t|0)==119){Pc[c[(c[q>>2]|0)+8>>2]&15](q,c[n>>2]|0,m);u=j;v=p}else{u=j;v=p}q=(c[h>>2]|0)+1|0;c[h>>2]=q;if((q|0)<(c[k>>2]|0)){o=q;j=u;p=v}else{r=u;s=v;break}}if((a[2592]|0)==0|r^1){w=r;x=s}else{se(c[b+16>>2]|0,b+33|0);w=r;x=s}}else{w=0;x=0}ge(b,e,w|x);i=f;return}function ge(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+16|0;f=e;if(d){c[f>>2]=0;c[f+4>>2]=0;g=a+8|0;h=c[g>>2]|0;c[f+8>>2]=c[h+8>>2];c[f+12>>2]=(c[b+12>>2]|0)+(c[b+4>>2]|0);Ec(c[a+12>>2]|0,f|0,h|0,f|0)|0;Ec(c[a+16>>2]|0,f|0,c[g>>2]|0,f|0)|0;Yb(c[g>>2]|0)|0;j=g;k=c[j>>2]|0;Md(b,k,d);i=e;return}if((c[b+12>>2]|0)==0){j=a+8|0;k=c[j>>2]|0;Md(b,k,d);i=e;return}else{g=a+8|0;Ec(c[a+12>>2]|0,b|0,c[g>>2]|0,b|0)|0;Ec(c[a+16>>2]|0,b|0,c[g>>2]|0,b|0)|0;Yb(c[g>>2]|0)|0;j=g;k=c[j>>2]|0;Md(b,k,d);i=e;return}}function he(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;g=i;i=i+16|0;h=g;Va(2392)|0;j=c[d+24>>2]|0;if((j|0)!=1){k=c[d+20>>2]|0;l=e*1e3|0;e=j;j=1;do{m=(e+j|0)/2|0;n=(c[(c[k+(m<<2)>>2]|0)+8>>2]|0)>(l|0);j=n?j:m+1|0;e=n?m:e}while((j|0)!=(e|0));e=j+ -1|0;j=d+28|0;c[j>>2]=e;if((e|0)>-1){o=j;p=e;q=6}else{r=j;s=0;t=0}}else{j=d+28|0;c[j>>2]=0;o=j;p=0;q=6}a:do{if((q|0)==6){j=d+20|0;e=d+8|0;l=d+33|0;k=d+12|0;m=0;n=0;u=0;v=0;w=p;while(1){x=(n|0)==0;if((v|x^1?(m|0)!=0|(a[3072]|0)==0:0)?u|(a[3064]|0)==0:0){r=o;s=m;t=n;break a}y=c[(c[j>>2]|0)+(w<<2)>>2]|0;z=a[y+16|0]|0;if((z|0)==97){if((m|0)==0){A=Gc[c[(c[y>>2]|0)+12>>2]&31](y,b[988]|0,b[992]|0)|0;B=A?w:0;C=n;D=u;E=v}else{B=m;C=n;D=u;E=v}}else if((z|0)==99){if(u){B=m;C=n;D=1;E=v}else{Pc[c[(c[y>>2]|0)+8>>2]&15](y,c[e>>2]|0,l);B=m;C=n;D=1;E=v}}else if((z|0)==114){if(x){x=Gc[c[(c[y>>2]|0)+12>>2]&31](y,b[988]|0,b[992]|0)|0;B=m;C=x?w:0;D=u;E=v}else{B=m;C=n;D=u;E=v}}else if((z|0)==119){if(v){B=m;C=n;D=u;E=1}else{Pc[c[(c[y>>2]|0)+8>>2]&15](y,c[k>>2]|0,l);B=w;C=n;D=u;E=1}}else{B=m;C=n;D=u;E=v}if((w|0)>0){m=B;n=C;u=D;v=E;w=w+ -1|0}else{r=o;s=B;t=C;break}}}}while(0);a[2592]=1;if((c[2608>>2]|0)!=0?(C=c[2604>>2]|0,B=(c[650]|0)+4|0,c[(c[C>>2]|0)+4>>2]=c[B>>2],c[c[B>>2]>>2]=c[C>>2],c[2608>>2]=0,(C|0)!=2600):0){B=C;while(1){C=c[B+4>>2]|0;ap(B);if((C|0)==2600){break}else{B=C}}}B=c[r>>2]|0;if((t|0)<(B|0)){C=d+20|0;o=d+12|0;E=d+33|0;D=B;p=t;while(1){q=c[(c[C>>2]|0)+(p<<2)>>2]|0;if((a[q+16|0]|0)==114){Pc[c[(c[q>>2]|0)+8>>2]&15](q,c[o>>2]|0,E);F=c[r>>2]|0}else{F=D}q=p+1|0;if((q|0)<(F|0)){D=F;p=q}else{G=F;break}}}else{G=B}if((s|0)<(G|0)){B=d+20|0;F=d+16|0;p=d+33|0;D=G;G=s;while(1){E=c[(c[B>>2]|0)+(G<<2)>>2]|0;if((a[E+16|0]|0)==97){Pc[c[(c[E>>2]|0)+8>>2]&15](E,c[F>>2]|0,p);H=c[r>>2]|0}else{H=D}E=G+1|0;if((E|0)<(H|0)){D=H;G=E}else{I=p;J=F;break}}}else{I=d+33|0;J=d+16|0}se(c[J>>2]|0,I);c[h>>2]=0;c[h+4>>2]=0;I=d+8|0;F=c[I>>2]|0;c[h+8>>2]=c[F+8>>2];c[h+12>>2]=(c[f+12>>2]|0)+(c[f+4>>2]|0);Ec(c[d+12>>2]|0,h|0,F|0,h|0)|0;Ec(c[J>>2]|0,h|0,c[I>>2]|0,h|0)|0;Yb(c[I>>2]|0)|0;Md(f,c[I>>2]|0,1);c[h>>2]=t;c[h+4>>2]=s;pb(2280,h|0)|0;i=g;return}function ie(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function je(a){a=a|0;return}function ke(){var b=0,d=0;b=i;d=cc(2472,0)|0;Jg(2456,d)|0;Wo(d);d=_o(24)|0;Ud(d,(a[2432]&1)==0?2433|0:c[2440>>2]|0,(a[2456]&1)==0?2457|0:c[2464>>2]|0);c[446]=d;i=b;return 0}function le(){var b=0;b=i;a[2432]=6;a[2433|0]=a[2448|0]|0;a[2434|0]=a[2449|0]|0;a[2435|0]=a[2450|0]|0;a[2436|0]=0;Dc(133,2432,p|0)|0;a[2456]=0;a[2457|0]=0;Dc(133,2456,p|0)|0;i=b;return}function me(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;d=a+8|0;if((c[d>>2]|0)==0){i=b;return}e=c[a+4>>2]|0;f=(c[a>>2]|0)+4|0;c[(c[e>>2]|0)+4>>2]=c[f>>2];c[c[f>>2]>>2]=c[e>>2];c[d>>2]=0;if((e|0)==(a|0)){i=b;return}else{g=e}while(1){e=c[g+4>>2]|0;ap(g);if((e|0)==(a|0)){break}else{g=e}}i=b;return}function ne(a){a=a|0;c[a>>2]=2624;return}function oe(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function pe(a){a=a|0;return}function qe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;g=_o(12)|0;c[g+8>>2]=b;c[(c[650]|0)+4>>2]=g;c[g>>2]=c[650];c[650]=g;c[g+4>>2]=2600;c[2608>>2]=(c[2608>>2]|0)+1;if((a[2592]|0)!=0){i=f;return}Pc[c[(c[b>>2]|0)+16>>2]&15](b,d,e);i=f;return}function re(a,b,c){a=a|0;b=b|0;c=c|0;return}function se(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+16|0;e=d;Va(2680)|0;c[e>>2]=0;c[e+4>>2]=0;f=e+8|0;c[f>>2]=c[a+8>>2];g=e+12|0;c[g>>2]=c[a+12>>2];qc(a|0,e|0,0)|0;ab(a|0,0,0,c[f>>2]|0,c[g>>2]|0);g=c[2604>>2]|0;if((g|0)==2600){i=d;return}else{h=g}do{g=c[h+8>>2]|0;Pc[c[(c[g>>2]|0)+16>>2]&15](g,a,b);h=c[h+4>>2]|0}while((h|0)!=2600);i=d;return}function te(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=i;f=c[2604>>2]|0;if((f|0)==2600){i=e;return}else{g=f}while(1){f=c[g+8>>2]|0;h=f+20|0;j=g+4|0;a:do{if((b[f+18>>1]|0)==(a|0)){do{if((b[h>>1]|0)!=(d|0)){k=11;break a}l=c[j>>2]|0;b:do{if((l|0)==2600){m=2600}else{n=l;while(1){o=c[n+8>>2]|0;if((b[o+18>>1]|0)!=(a|0)){m=n;break b}if((b[o+20>>1]|0)!=(d|0)){m=n;break b}o=c[n+4>>2]|0;if((o|0)==2600){m=2600;break}else{n=o}}}}while(0)}while((g|0)==(m|0));l=(c[m>>2]|0)+4|0;c[(c[g>>2]|0)+4>>2]=c[l>>2];c[c[l>>2]>>2]=c[g>>2];l=g;while(1){n=c[l+4>>2]|0;c[2608>>2]=(c[2608>>2]|0)+ -1;ap(l);if((n|0)==(m|0)){p=m;break}else{l=n}}}else{k=11}}while(0);if((k|0)==11){k=0;p=c[j>>2]|0}if((p|0)==2600){break}else{g=p}}i=e;return}function ue(){var a=0;a=i;Dd(2584);c[650]=2600;c[2604>>2]=2600;c[2608>>2]=0;Dc(134,2600,p|0)|0;i=a;return}function ve(a,b){a=a|0;b=b|0;var d=0;d=i;ne(a);c[a>>2]=2712;c[a+8>>2]=b;i=d;return}function we(a){a=a|0;var b=0;b=i;pe(a);ap(a);i=b;return}function xe(a){a=a|0;var b=0;b=i;pe(a);i=b;return}function ye(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;e=i;Va(2776)|0;a[2592]=1;if((c[2608>>2]|0)==0){i=e;return}d=c[2604>>2]|0;b=(c[650]|0)+4|0;c[(c[d>>2]|0)+4>>2]=c[b>>2];c[c[b>>2]>>2]=c[d>>2];c[2608>>2]=0;if((d|0)==2600){i=e;return}else{f=d}while(1){d=c[f+4>>2]|0;ap(f);if((d|0)==2600){break}else{f=d}}i=e;return}function ze(a,b,c){a=a|0;b=b|0;c=c|0;return 1}function Ae(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=i;ne(a);c[a>>2]=2808;c[a+8>>2]=b;Rd(d,a+26|0)|0;Rd(d,a+28|0)|0;i=e;return}function Be(a){a=a|0;Oa(a|0)|0;Fa()}function Ce(a){a=a|0;var b=0;b=i;pe(a);ap(a);i=b;return}function De(a){a=a|0;var b=0;b=i;pe(a);i=b;return}function Ee(c,d,e){c=c|0;d=d|0;e=e|0;e=i;te(b[c+26>>1]|0,b[c+28>>1]|0);a[2592]=1;i=e;return}function Fe(a,b){a=a|0;b=b|0;c[a>>2]=2880;c[a+8>>2]=b;return}function Ge(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function He(a){a=a|0;return}function Ie(a,b,c){a=a|0;b=b|0;c=c|0;return}function Je(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function Ke(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;c[a>>2]=2960;c[a+8>>2]=b;Rd(d,a+18|0)|0;Rd(d,a+20|0)|0;Rd(d,a+22|0)|0;Rd(d,a+24|0)|0;b=_o(8)|0;ae(b,e+ -8|0);c[a+28>>2]=b;Pd(d,b)|0;c[732]=0;c[734]=0;i=f;return}function Le(a){a=a|0;var b=0,d=0;b=i;c[a>>2]=2960;d=c[a+28>>2]|0;if((d|0)!=0){be(d);ap(d)}ap(a);i=b;return}function Me(a){a=a|0;var b=0,d=0;b=i;c[a>>2]=2960;d=c[a+28>>2]|0;if((d|0)==0){i=b;return}be(d);ap(d);i=b;return}function Ne(a,c,d){a=a|0;c=c|0;d=d|0;var e=0,f=0;e=i;if((b[a+22>>1]|0)!=(c|0)){f=0;i=e;return f|0}f=(b[a+24>>1]|0)==(d|0);i=e;return f|0}function Oe(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;f=i;Va(3032)|0;c[a+32>>2]=0;g=a+20|0;h=b[g>>1]|0;j=h<<16>>16;k=a+24|0;l=b[k>>1]|0;m=l<<16>>16;if(!(l<<16>>16>0)){n=j;o=m;p=b[a+18>>1]|0;q=b[a+22>>1]|0;r=p<<16>>16;s=q<<16>>16;ab(d|0,r|0,n|0,s|0,o|0);i=f;return}t=a+18|0;u=a+22|0;v=m+j|0;m=b[t>>1]|0;w=b[u>>1]|0;x=l;l=h;h=j;while(1){j=v-h|0;y=(j|0)<16?j:16;j=m<<16>>16;if(w<<16>>16>0){z=(w<<16>>16)+j|0;A=j;do{j=z-A|0;Pe(a,d,e,A,h,(j|0)<16?j:16,y);A=A+16|0;B=b[t>>1]|0;C=b[u>>1]|0;z=(C<<16>>16)+(B<<16>>16)|0}while((A|0)<(z|0));D=b[g>>1]|0;E=b[k>>1]|0;F=C;G=B}else{D=l;E=x;F=w;G=m}z=h+16|0;A=D<<16>>16;y=E<<16>>16;j=y+A|0;if((z|0)<(j|0)){v=j;m=G;w=F;x=E;l=D;h=z}else{n=A;o=y;p=G;q=F;break}}r=p<<16>>16;s=q<<16>>16;ab(d|0,r|0,n|0,s|0,o|0);i=f;return}function Pe(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;f=i;i=i+48|0;l=f+40|0;m=f+24|0;n=f+16|0;o=f;p=b+32|0;q=b+28|0;r=c[p>>2]|0;s=c[q>>2]|0;if((r|0)<(c[s+4>>2]|0)){a[l]=a[(c[s>>2]|0)+r|0]|0;c[p>>2]=r+1}r=a[l]|0;if(!((r&1)==0)){Qe(b,e,0,g,h,j,k);i=f;return}b=c[500]|0;l=Ta()|0;s=i;i=i+((1*b|0)+15&-16)|0;if((r&2)==0){t=c[732]|0}else{b=c[500]|0;if((b|0)>0){u=c[q>>2]|0;v=c[p>>2]|0;w=0;do{if((v|0)>=(c[u+4>>2]|0)){break}a[s+w|0]=a[(c[u>>2]|0)+v|0]|0;v=v+1|0;c[p>>2]=v;w=w+1|0}while((w|0)<(b|0));x=c[500]|0}else{x=b}b=Ed(2944,s,x,c[520]|0)|0;c[732]=b;t=b}c[m>>2]=g;c[m+4>>2]=h;c[m+8>>2]=j;c[m+12>>2]=k;qc(e|0,m|0,t|0)|0;if(!((r&4)==0)){t=c[500]|0;if((t|0)>0){m=c[q>>2]|0;k=c[p>>2]|0;j=0;do{if((k|0)>=(c[m+4>>2]|0)){break}a[s+j|0]=a[(c[m>>2]|0)+k|0]|0;k=k+1|0;c[p>>2]=k;j=j+1|0}while((j|0)<(t|0));y=c[500]|0}else{y=t}t=Ed(2944,s,y,c[520]|0)|0;c[734]=t}if(!((r&8)==0)){c[n>>2]=0;t=c[p>>2]|0;y=c[q>>2]|0;q=y+4|0;if((t|0)<(c[q>>2]|0)){a[n]=a[(c[y>>2]|0)+t|0]|0;s=t+1|0;c[p>>2]=s;z=s}else{z=t}t=c[n>>2]|0;n=t<<1;s=(r&16)==0;if(s){A=n}else{A=(ea(c[500]|0,t)|0)+n|0}n=i;i=i+((1*A|0)+15&-16)|0;a:do{if((A|0)>0){r=z;j=0;do{if((r|0)>=(c[q>>2]|0)){break a}a[n+j|0]=a[(c[y>>2]|0)+r|0]|0;r=r+1|0;c[p>>2]=r;j=j+1|0}while((j|0)<(A|0))}}while(0);if((t|0)!=0){A=o+4|0;p=o+8|0;y=o+12|0;if(s){s=0;q=0;while(1){z=d[n+s|0]|0;j=d[n+(s|1)|0]|0;c[o>>2]=(z>>>4)+g;c[A>>2]=(z&15)+h;c[p>>2]=(j>>>4)+1;c[y>>2]=(j&15)+1;qc(e|0,o|0,c[734]|0)|0;q=q+1|0;if(!(q>>>0<t>>>0)){break}else{s=s+2|0}}}else{s=0;q=0;while(1){j=Ed(2944,n+s|0,c[500]|0,c[520]|0)|0;c[734]=j;z=(c[500]|0)+s|0;r=d[n+z|0]|0;k=d[n+(z+1)|0]|0;c[o>>2]=(r>>>4)+g;c[A>>2]=(r&15)+h;c[p>>2]=(k>>>4)+1;c[y>>2]=(k&15)+1;qc(e|0,o|0,j|0)|0;q=q+1|0;if(!(q>>>0<t>>>0)){break}else{s=z+2|0}}}}}db(l|0);i=f;return}function Qe(d,e,f,g,h,j,k){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;f=i;i=i+16|0;l=f;c[l+0>>2]=c[2976>>2];c[l+4>>2]=c[2980>>2];c[l+8>>2]=c[2984>>2];c[l+12>>2]=c[2988>>2];m=c[500]|0;if((m|0)==2){n=Ta()|0;o=i;i=i+16|0;p=k+h|0;q=(k|0)>0;if((a[2016]|0)==0){if(q?(r=d+32|0,s=d+28|0,t=l+4|0,(j|0)>0):0){u=h;do{v=0;do{w=c[500]|0;if((w|0)>0){x=c[s>>2]|0;y=c[r>>2]|0;z=0;do{if((y|0)>=(c[x+4>>2]|0)){break}a[o+z|0]=a[(c[x>>2]|0)+y|0]|0;y=y+1|0;c[r>>2]=y;z=z+1|0}while((z|0)<(w|0));A=c[500]|0}else{A=w}z=Ed(2944,o,A,c[520]|0)|0;c[l>>2]=v+g;c[t>>2]=u;qc(e|0,l|0,z|0)|0;v=v+1|0}while((v|0)!=(j|0));u=u+1|0}while((u|0)<(p|0))}}else{if(q){q=(j|0)>0;u=d+32|0;t=d+28|0;A=l+4|0;r=h;do{if(q){s=0;do{v=c[500]|0;if((v|0)>0){z=c[t>>2]|0;y=c[u>>2]|0;x=0;do{if((y|0)>=(c[z+4>>2]|0)){break}a[o+x|0]=a[(c[z>>2]|0)+y|0]|0;y=y+1|0;c[u>>2]=y;x=x+1|0}while((x|0)<(v|0));B=c[500]|0}else{B=v}x=Ed(2944,o,B,c[520]|0)|0;c[l>>2]=s+g;c[A>>2]=r;qc(e|0,l|0,x|0)|0;s=s+1|0}while((s|0)!=(j|0))}r=r+1|0}while((r|0)<(p|0))}}db(n|0);i=f;return}else if((m|0)==1){m=k+h|0;if((k|0)<=0){i=f;return}k=e+20|0;e=d+32|0;n=d+28|0;if((j|0)>0){C=h}else{i=f;return}do{h=c[k>>2]|0;d=(ea(b[988]|0,C)|0)+g|0;p=c[e>>2]|0;r=0;do{l=c[n>>2]|0;if((p|0)>=(c[l+4>>2]|0)){break}a[h+(d+r)|0]=a[(c[l>>2]|0)+p|0]|0;p=(c[e>>2]|0)+1|0;c[e>>2]=p;r=r+1|0}while((r|0)<(j|0));C=C+1|0}while((C|0)<(m|0));i=f;return}else{i=f;return}}function Re(a){a=a|0;var c=0;c=ea(b[a+24>>1]|0,b[a+22>>1]|0)|0;return c|0}function Se(){var a=0;a=i;Dd(2944);i=a;return}function Te(a){a=a|0;return}function Ue(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function Ve(){c[762]=0;c[764]=0;a[3064]=0;a[3072]=0;a[3080]=0;return}function We(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;i=i+16|0;g=f;c[b>>2]=b;c[b+4>>2]=b;h=b+8|0;c[h>>2]=0;j=0;a:while(1){do{if(Td(d)|0){break a}k=Xe(d,e)|0;l=k+16|0}while((a[l]|0)==48);m=k+8|0;if((c[h>>2]|0)!=0){n=c[m>>2]|0;o=k+8|0;if((n|0)!=0){if((n|0)<(j|0)){c[o>>2]=j;p=j}else{p=n}}else{q=o;r=8}}else{c[m>>2]=0;q=k+8|0;r=8}if((r|0)==8){r=0;c[q>>2]=j;p=j}m=_o(12)|0;c[m+8>>2]=k;c[(c[b>>2]|0)+4>>2]=m;c[m>>2]=c[b>>2];c[b>>2]=m;c[m+4>>2]=b;c[h>>2]=(c[h>>2]|0)+1;m=c[k+12>>2]|0;switch(m|0){case 25:case 24:case 27:case 26:case 22:case 21:case 23:case 20:{a[3072]=1;a[l]=97;j=p;continue a;break};case 33:{a[3080]=1;a[l]=119;j=p;continue a;break};case 18:case 19:{a[3064]=1;a[l]=99;j=p;continue a;break};case 0:{break};case 5:{o=Re(k)|0;c[764]=(c[764]|0)+o;break};default:{a[l]=48;c[g>>2]=m;pb(3088,g|0)|0;j=p;continue a}}a[l]=114;j=p}i=f;return}function Xe(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=i;i=i+32|0;f=e;g=e+12|0;h=e+16|0;j=e+8|0;Sd(b,g)|0;Od(b,h)|0;k=a[h]|0;l=(c[g>>2]|0)+ -1|0;c[g>>2]=l;c[j>>2]=0;if((k&128|0)==0){m=0;n=l}else{Sd(b,j)|0;l=c[j>>2]|0;if((l|0)<0){c[j>>2]=0;o=0}else{o=l}l=(c[g>>2]|0)+ -4|0;c[g>>2]=l;m=o;n=l}l=k&63;switch(l|0){case 24:{o=_o(32)|0;Ae(o,m,b);p=o;break};case 0:{c[f>>2]=m;pb(3136,f|0)|0;o=_o(36)|0;Ye(o,c[j>>2]|0,b,c[g>>2]|0);p=o;break};case 20:{o=_o(28)|0;df(o,m,b);p=o;break};case 33:{Va(3272)|0;Od(b,h)|0;o=_o(20)|0;jf(o,c[j>>2]|0,a[h]|0,d);p=o;break};case 5:{o=_o(36)|0;Ke(o,m,b,n);p=o;break};case 25:{o=_o(28)|0;ve(o,m);p=o;break};default:{c[f>>2]=l;c[f+4>>2]=n;pb(3192,f|0)|0;f=c[g>>2]|0;if((f|0)>0){n=Ta()|0;o=i;i=i+((1*(f+1|0)|0)+15&-16)|0;Qd(b,o,c[g>>2]|0)|0;db(n|0)}c[g>>2]=0;g=_o(20)|0;Fe(g,c[j>>2]|0);a[g+16|0]=48;p=g}}a[p+4|0]=k>>>6&1;c[p+12>>2]=l;i=e;return p|0}function Ye(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;c[a>>2]=3312;c[a+8>>2]=b;Rd(d,a+18|0)|0;Rd(d,a+20|0)|0;Rd(d,a+22|0)|0;Rd(d,a+24|0)|0;b=_o(8)|0;ae(b,e+ -8|0);c[a+28>>2]=b;Pd(d,b)|0;i=f;return}function Ze(a){a=a|0;var b=0,d=0;b=i;c[a>>2]=3312;d=c[a+28>>2]|0;if((d|0)!=0){be(d);ap(d)}ap(a);i=b;return}function _e(a){a=a|0;var b=0,d=0;b=i;c[a>>2]=3312;d=c[a+28>>2]|0;if((d|0)==0){i=b;return}be(d);ap(d);i=b;return}function $e(a,c,d){a=a|0;c=c|0;d=d|0;var e=0,f=0;e=i;if((b[a+22>>1]|0)!=(c|0)){f=0;i=e;return f|0}f=(b[a+24>>1]|0)==(d|0);i=e;return f|0}function af(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0;e=i;i=i+16|0;f=e;bf(a,d,0);d=b[a+20>>1]|0;g=b[a+22>>1]|0;h=b[a+24>>1]|0;c[f>>2]=b[a+18>>1]|0;c[f+4>>2]=d;c[f+8>>2]=g;c[f+12>>2]=h;pb(3328,f|0)|0;i=e;return}function bf(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0;f=i;i=i+16|0;g=f;c[g+0>>2]=c[3368>>2];c[g+4>>2]=c[3372>>2];c[g+8>>2]=c[3376>>2];c[g+12>>2]=c[3380>>2];h=c[500]|0;if((h|0)==1){j=d+20|0;k=b[j>>1]|0;l=d+24|0;m=b[l>>1]|0;if(!(m<<16>>16>0)){i=f;return}n=e+20|0;o=d+18|0;p=d+22|0;q=d+32|0;r=d+28|0;s=m;m=k;t=k<<16>>16;while(1){k=c[n>>2]|0;u=ea(b[988]|0,t)|0;v=u+(b[o>>1]|0)|0;u=b[p>>1]|0;w=u<<16>>16;if(u<<16>>16>0){u=c[q>>2]|0;x=0;do{y=c[r>>2]|0;if((u|0)>=(c[y+4>>2]|0)){break}a[k+(v+x)|0]=a[(c[y>>2]|0)+u|0]|0;u=(c[q>>2]|0)+1|0;c[q>>2]=u;x=x+1|0}while((x|0)<(w|0));z=b[j>>1]|0;A=b[l>>1]|0}else{z=m;A=s}t=t+1|0;if((t|0)>=((A<<16>>16)+(z<<16>>16)|0)){break}else{s=A;m=z}}i=f;return}else if((h|0)==2){h=Ta()|0;z=i;i=i+16|0;m=d+20|0;A=b[m>>1]|0;s=A<<16>>16;t=d+24|0;l=b[t>>1]|0;j=l<<16>>16>0;if((a[2016]|0)==0){if(j){q=d+22|0;r=d+32|0;p=d+28|0;o=d+18|0;n=g+4|0;w=l;x=A;u=b[q>>1]|0;v=s;while(1){if(u<<16>>16>0){k=0;do{y=c[500]|0;if((y|0)>0){B=c[p>>2]|0;C=c[r>>2]|0;D=0;do{if((C|0)>=(c[B+4>>2]|0)){break}a[z+D|0]=a[(c[B>>2]|0)+C|0]|0;C=C+1|0;c[r>>2]=C;D=D+1|0}while((D|0)<(y|0));E=c[500]|0}else{E=y}D=Ed(3296,z,E,c[520]|0)|0;c[g>>2]=(b[o>>1]|0)+k;c[n>>2]=v;qc(e|0,g|0,D|0)|0;k=k+1|0;F=b[q>>1]|0}while((k|0)<(F<<16>>16|0));G=b[m>>1]|0;H=b[t>>1]|0;I=F}else{G=x;H=w;I=u}v=v+1|0;if((v|0)>=((H<<16>>16)+(G<<16>>16)|0)){break}else{w=H;x=G;u=I}}}}else{if(j){j=d+22|0;I=d+32|0;u=d+28|0;G=d+18|0;d=g+4|0;x=l;l=A;A=b[j>>1]|0;H=s;while(1){if(A<<16>>16>0){s=0;do{w=c[500]|0;if((w|0)>0){v=c[u>>2]|0;F=c[I>>2]|0;q=0;do{if((F|0)>=(c[v+4>>2]|0)){break}a[z+q|0]=a[(c[v>>2]|0)+F|0]|0;F=F+1|0;c[I>>2]=F;q=q+1|0}while((q|0)<(w|0));J=c[500]|0}else{J=w}q=Ed(3296,z,J,c[520]|0)|0;c[g>>2]=(b[G>>1]|0)+s;c[d>>2]=H;qc(e|0,g|0,q|0)|0;s=s+1|0;K=b[j>>1]|0}while((s|0)<(K<<16>>16|0));L=K;M=b[m>>1]|0;N=b[t>>1]|0}else{L=A;M=l;N=x}H=H+1|0;if((H|0)>=((N<<16>>16)+(M<<16>>16)|0)){break}else{x=N;l=M;A=L}}}}db(h|0);i=f;return}else{i=f;return}}function cf(){var a=0;a=i;Dd(3296);i=a;return}function df(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+16|0;g=f+6|0;h=f+4|0;j=f+2|0;k=f;ne(a);c[a>>2]=3424;c[a+8>>2]=d;Od(e,a+26|0)|0;Rd(e,g)|0;Rd(e,h)|0;Rd(e,j)|0;Rd(e,k)|0;e=b[j>>1]|0;j=b[g>>1]|0;b[a+18>>1]=e<<16>>16<j<<16>>16?e:j;g=(T((j<<16>>16)-(e<<16>>16)|0)|0)&65535;b[a+22>>1]=g;g=b[k>>1]|0;k=b[h>>1]|0;b[a+20>>1]=g<<16>>16<k<<16>>16?g:k;h=(T((k<<16>>16)-(g<<16>>16)|0)|0)&65535;b[a+24>>1]=h;Va(3536)|0;i=f;return}function ef(a){a=a|0;var b=0;b=i;pe(a);ap(a);i=b;return}function ff(a){a=a|0;var b=0;b=i;pe(a);i=b;return}function gf(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;f=i;i=i+48|0;g=f;h=f+24|0;j=d+18|0;k=b[j>>1]|0;l=d+20|0;m=b[l>>1]|0;n=d+22|0;o=b[n>>1]|0;p=d+24|0;q=b[p>>1]|0;r=d+26|0;d=e+4|0;s=Fd(2584,a[r]|0,c[d>>2]|0)|0;c[g>>2]=k;c[g+4>>2]=m;c[g+8>>2]=o;c[g+12>>2]=q;c[g+16>>2]=s;pb(3448,g|0)|0;c[h>>2]=b[j>>1]|0;c[h+4>>2]=b[l>>1]|0;c[h+8>>2]=b[n>>1]|0;c[h+12>>2]=b[p>>1]|0;qc(e|0,h|0,Fd(2584,a[r]|0,c[d>>2]|0)|0)|0;ab(e|0,b[j>>1]|0,b[l>>1]|0,b[n>>1]|0,b[p>>1]|0);i=f;return}function hf(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function jf(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;c[a>>2]=3568;c[a+8>>2]=b;return}function kf(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function lf(a){a=a|0;return}function mf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;d=i;i=i+16|0;a=d;Va(3624)|0;c[a>>2]=0;c[a+4>>2]=0;e=b+8|0;c[a+8>>2]=c[e>>2];f=b+12|0;c[a+12>>2]=c[f>>2];qc(b|0,a|0,-1)|0;ab(b|0,0,0,c[e>>2]|0,c[f>>2]|0);i=d;return}function nf(a,b,c){a=a|0;b=b|0;c=c|0;return 1}function of(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+32|0;g=f+20|0;h=f+16|0;j=f+12|0;k=f+8|0;l=f+4|0;m=f;c[h>>2]=a;c[j>>2]=b;c[k>>2]=e;c[l>>2]=(c[h>>2]|0)>>>16&65535;c[h>>2]=c[h>>2]&65535;e=c[j>>2]|0;if((c[k>>2]|0)==1){c[h>>2]=(c[h>>2]|0)+(d[e]|0);if((c[h>>2]|0)>>>0>=65521){c[h>>2]=(c[h>>2]|0)-65521}c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);if((c[l>>2]|0)>>>0>=65521){c[l>>2]=(c[l>>2]|0)-65521}c[g>>2]=c[h>>2]|c[l>>2]<<16;n=c[g>>2]|0;i=f;return n|0}if((e|0)==0){c[g>>2]=1;n=c[g>>2]|0;i=f;return n|0}if((c[k>>2]|0)>>>0<16){while(1){e=c[k>>2]|0;c[k>>2]=e+ -1;if((e|0)==0){break}e=c[j>>2]|0;c[j>>2]=e+1;c[h>>2]=(c[h>>2]|0)+(d[e]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0)}if((c[h>>2]|0)>>>0>=65521){c[h>>2]=(c[h>>2]|0)-65521}c[l>>2]=((c[l>>2]|0)>>>0)%65521|0;c[g>>2]=c[h>>2]|c[l>>2]<<16;n=c[g>>2]|0;i=f;return n|0}while(1){o=c[k>>2]|0;if(!((c[k>>2]|0)>>>0>=5552)){break}c[k>>2]=o-5552;c[m>>2]=347;do{c[h>>2]=(c[h>>2]|0)+(d[c[j>>2]|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+1|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+2|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+3|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+4|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+5|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+6|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+7|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+8|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+9|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+10|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+11|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+12|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+13|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+14|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+15|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[j>>2]=(c[j>>2]|0)+16;e=(c[m>>2]|0)+ -1|0;c[m>>2]=e}while((e|0)!=0);c[h>>2]=((c[h>>2]|0)>>>0)%65521|0;c[l>>2]=((c[l>>2]|0)>>>0)%65521|0}if((o|0)!=0){while(1){if(!((c[k>>2]|0)>>>0>=16)){break}c[k>>2]=(c[k>>2]|0)-16;c[h>>2]=(c[h>>2]|0)+(d[c[j>>2]|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+1|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+2|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+3|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+4|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+5|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+6|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+7|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+8|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+9|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+10|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+11|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+12|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+13|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+14|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[h>>2]=(c[h>>2]|0)+(d[(c[j>>2]|0)+15|0]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0);c[j>>2]=(c[j>>2]|0)+16}while(1){o=c[k>>2]|0;c[k>>2]=o+ -1;if((o|0)==0){break}o=c[j>>2]|0;c[j>>2]=o+1;c[h>>2]=(c[h>>2]|0)+(d[o]|0);c[l>>2]=(c[l>>2]|0)+(c[h>>2]|0)}c[h>>2]=((c[h>>2]|0)>>>0)%65521|0;c[l>>2]=((c[l>>2]|0)>>>0)%65521|0}c[g>>2]=c[h>>2]|c[l>>2]<<16;n=c[g>>2]|0;i=f;return n|0}function pf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+32|0;g=f+16|0;h=f+12|0;j=f+8|0;k=f+4|0;l=f;c[h>>2]=b;c[j>>2]=d;c[k>>2]=e;do{if((c[j>>2]|0)!=0){c[l>>2]=1;e=c[h>>2]|0;d=c[j>>2]|0;b=c[k>>2]|0;if((a[l]|0)!=0){m=qf(e,d,b)|0;c[g>>2]=m;break}else{m=rf(e,d,b)|0;c[g>>2]=m;break}}else{c[g>>2]=0}}while(0);i=f;return c[g>>2]|0}function qf(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=i;i=i+32|0;g=f+16|0;h=f+12|0;j=f+8|0;k=f+4|0;l=f;c[g>>2]=a;c[h>>2]=b;c[j>>2]=e;c[k>>2]=c[g>>2];c[k>>2]=~c[k>>2];while(1){if((c[j>>2]|0)==0){break}if((c[h>>2]&3|0)==0){break}g=c[k>>2]|0;e=c[h>>2]|0;c[h>>2]=e+1;c[k>>2]=c[3648+(((g^(d[e]|0))&255)<<2)>>2]^(c[k>>2]|0)>>>8;c[j>>2]=(c[j>>2]|0)+ -1}c[l>>2]=c[h>>2];while(1){if(!((c[j>>2]|0)>>>0>=32)){break}e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];e=c[l>>2]|0;c[l>>2]=e+4;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];c[j>>2]=(c[j>>2]|0)-32}while(1){m=c[l>>2]|0;if(!((c[j>>2]|0)>>>0>=4)){break}c[l>>2]=m+4;c[k>>2]=c[k>>2]^c[m>>2];c[k>>2]=c[6720+((c[k>>2]&255)<<2)>>2]^c[5696+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[4672+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[3648+((c[k>>2]|0)>>>24<<2)>>2];c[j>>2]=(c[j>>2]|0)-4}c[h>>2]=m;if((c[j>>2]|0)==0){n=c[k>>2]|0;o=~n;c[k>>2]=o;p=c[k>>2]|0;i=f;return p|0}do{m=c[k>>2]|0;l=c[h>>2]|0;c[h>>2]=l+1;c[k>>2]=c[3648+(((m^(d[l]|0))&255)<<2)>>2]^(c[k>>2]|0)>>>8;l=(c[j>>2]|0)+ -1|0;c[j>>2]=l}while((l|0)!=0);n=c[k>>2]|0;o=~n;c[k>>2]=o;p=c[k>>2]|0;i=f;return p|0}function rf(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;f=i;i=i+32|0;g=f+16|0;h=f+12|0;j=f+8|0;k=f+4|0;l=f;c[g>>2]=a;c[h>>2]=b;c[j>>2]=e;c[k>>2]=((c[g>>2]|0)>>>24&255)+((c[g>>2]|0)>>>8&65280)+((c[g>>2]&65280)<<8)+((c[g>>2]&255)<<24);c[k>>2]=~c[k>>2];while(1){if((c[j>>2]|0)==0){break}if((c[h>>2]&3|0)==0){break}g=(c[k>>2]|0)>>>24;e=c[h>>2]|0;c[h>>2]=e+1;c[k>>2]=c[7744+((g^(d[e]|0))<<2)>>2]^c[k>>2]<<8;c[j>>2]=(c[j>>2]|0)+ -1}c[l>>2]=c[h>>2];c[l>>2]=(c[l>>2]|0)+ -4;while(1){if(!((c[j>>2]|0)>>>0>=32)){break}e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];e=(c[l>>2]|0)+4|0;c[l>>2]=e;c[k>>2]=c[k>>2]^c[e>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];c[j>>2]=(c[j>>2]|0)-32}while(1){e=(c[j>>2]|0)>>>0>=4;g=(c[l>>2]|0)+4|0;c[l>>2]=g;if(!e){break}c[k>>2]=c[k>>2]^c[g>>2];c[k>>2]=c[7744+((c[k>>2]&255)<<2)>>2]^c[8768+(((c[k>>2]|0)>>>8&255)<<2)>>2]^c[9792+(((c[k>>2]|0)>>>16&255)<<2)>>2]^c[10816+((c[k>>2]|0)>>>24<<2)>>2];c[j>>2]=(c[j>>2]|0)-4}c[h>>2]=c[l>>2];if((c[j>>2]|0)==0){m=c[k>>2]|0;n=~m;c[k>>2]=n;o=c[k>>2]|0;p=o>>>24;q=p&255;r=c[k>>2]|0;s=r>>>8;t=s&65280;u=q+t|0;v=c[k>>2]|0;w=v&65280;x=w<<8;y=u+x|0;z=c[k>>2]|0;A=z&255;B=A<<24;C=y+B|0;i=f;return C|0}do{l=(c[k>>2]|0)>>>24;g=c[h>>2]|0;c[h>>2]=g+1;c[k>>2]=c[7744+((l^(d[g]|0))<<2)>>2]^c[k>>2]<<8;g=(c[j>>2]|0)+ -1|0;c[j>>2]=g}while((g|0)!=0);m=c[k>>2]|0;n=~m;c[k>>2]=n;o=c[k>>2]|0;p=o>>>24;q=p&255;r=c[k>>2]|0;s=r>>>8;t=s&65280;u=q+t|0;v=c[k>>2]|0;w=v&65280;x=w<<8;y=u+x|0;z=c[k>>2]|0;A=z&255;B=A<<24;C=y+B|0;i=f;return C|0}function sf(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;h=i;i=i+96|0;j=h+84|0;k=h+80|0;l=h+76|0;m=h+72|0;n=h+68|0;o=h+64|0;p=h+60|0;q=h+56|0;r=h+52|0;s=h+48|0;t=h+44|0;u=h+40|0;v=h+36|0;w=h+32|0;x=h+28|0;y=h+24|0;z=h+20|0;A=h+16|0;B=h+88|0;C=h+12|0;D=h+8|0;E=h+4|0;F=h;c[j>>2]=f;c[k>>2]=g;c[l>>2]=c[(c[j>>2]|0)+28>>2];c[m>>2]=(c[c[j>>2]>>2]|0)+ -1;c[n>>2]=(c[m>>2]|0)+((c[(c[j>>2]|0)+4>>2]|0)-5);c[o>>2]=(c[(c[j>>2]|0)+12>>2]|0)+ -1;c[p>>2]=(c[o>>2]|0)+(0-((c[k>>2]|0)-(c[(c[j>>2]|0)+16>>2]|0)));c[q>>2]=(c[o>>2]|0)+((c[(c[j>>2]|0)+16>>2]|0)-257);c[r>>2]=c[(c[l>>2]|0)+40>>2];c[s>>2]=c[(c[l>>2]|0)+44>>2];c[t>>2]=c[(c[l>>2]|0)+48>>2];c[u>>2]=c[(c[l>>2]|0)+52>>2];c[v>>2]=c[(c[l>>2]|0)+56>>2];c[w>>2]=c[(c[l>>2]|0)+60>>2];c[x>>2]=c[(c[l>>2]|0)+76>>2];c[y>>2]=c[(c[l>>2]|0)+80>>2];c[z>>2]=(1<<c[(c[l>>2]|0)+84>>2])-1;c[A>>2]=(1<<c[(c[l>>2]|0)+88>>2])-1;a:do{if((c[w>>2]|0)>>>0<15){k=(c[m>>2]|0)+1|0;c[m>>2]=k;c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]);c[w>>2]=(c[w>>2]|0)+8;k=(c[m>>2]|0)+1|0;c[m>>2]=k;c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]);c[w>>2]=(c[w>>2]|0)+8}k=(c[x>>2]|0)+((c[v>>2]&c[z>>2])<<2)|0;b[B+0>>1]=b[k+0>>1]|0;b[B+2>>1]=b[k+2>>1]|0;while(1){c[C>>2]=d[B+1|0]|0;c[v>>2]=(c[v>>2]|0)>>>(c[C>>2]|0);c[w>>2]=(c[w>>2]|0)-(c[C>>2]|0);c[C>>2]=d[B]|0;if((c[C>>2]|0)==0){G=6;break}if((c[C>>2]&16|0)!=0){G=8;break}if((c[C>>2]&64|0)!=0){G=55;break a}k=(c[x>>2]|0)+((e[B+2>>1]|0)+(c[v>>2]&(1<<c[C>>2])-1)<<2)|0;b[B+0>>1]=b[k+0>>1]|0;b[B+2>>1]=b[k+2>>1]|0}do{if((G|0)==6){G=0;k=b[B+2>>1]&255;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k}else if((G|0)==8){G=0;c[D>>2]=e[B+2>>1]|0;c[C>>2]=c[C>>2]&15;if((c[C>>2]|0)!=0){if((c[w>>2]|0)>>>0<(c[C>>2]|0)>>>0){k=(c[m>>2]|0)+1|0;c[m>>2]=k;c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]);c[w>>2]=(c[w>>2]|0)+8}c[D>>2]=(c[D>>2]|0)+(c[v>>2]&(1<<c[C>>2])-1);c[v>>2]=(c[v>>2]|0)>>>(c[C>>2]|0);c[w>>2]=(c[w>>2]|0)-(c[C>>2]|0)}if((c[w>>2]|0)>>>0<15){k=(c[m>>2]|0)+1|0;c[m>>2]=k;c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]);c[w>>2]=(c[w>>2]|0)+8;k=(c[m>>2]|0)+1|0;c[m>>2]=k;c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]);c[w>>2]=(c[w>>2]|0)+8}k=(c[y>>2]|0)+((c[v>>2]&c[A>>2])<<2)|0;b[B+0>>1]=b[k+0>>1]|0;b[B+2>>1]=b[k+2>>1]|0;while(1){c[C>>2]=d[B+1|0]|0;c[v>>2]=(c[v>>2]|0)>>>(c[C>>2]|0);c[w>>2]=(c[w>>2]|0)-(c[C>>2]|0);c[C>>2]=d[B]|0;if((c[C>>2]&16|0)!=0){break}if((c[C>>2]&64|0)!=0){G=52;break a}k=(c[y>>2]|0)+((e[B+2>>1]|0)+(c[v>>2]&(1<<c[C>>2])-1)<<2)|0;b[B+0>>1]=b[k+0>>1]|0;b[B+2>>1]=b[k+2>>1]|0}c[E>>2]=e[B+2>>1]|0;c[C>>2]=c[C>>2]&15;if((c[w>>2]|0)>>>0<(c[C>>2]|0)>>>0?(k=(c[m>>2]|0)+1|0,c[m>>2]=k,c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]),c[w>>2]=(c[w>>2]|0)+8,(c[w>>2]|0)>>>0<(c[C>>2]|0)>>>0):0){k=(c[m>>2]|0)+1|0;c[m>>2]=k;c[v>>2]=(c[v>>2]|0)+((d[k]|0)<<c[w>>2]);c[w>>2]=(c[w>>2]|0)+8}c[E>>2]=(c[E>>2]|0)+(c[v>>2]&(1<<c[C>>2])-1);c[v>>2]=(c[v>>2]|0)>>>(c[C>>2]|0);c[w>>2]=(c[w>>2]|0)-(c[C>>2]|0);c[C>>2]=(c[o>>2]|0)-(c[p>>2]|0);if(!((c[E>>2]|0)>>>0>(c[C>>2]|0)>>>0)){c[F>>2]=(c[o>>2]|0)+(0-(c[E>>2]|0));do{k=(c[F>>2]|0)+1|0;c[F>>2]=k;g=a[k]|0;k=(c[o>>2]|0)+1|0;c[o>>2]=k;a[k]=g;g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k;k=(c[F>>2]|0)+1|0;c[F>>2]=k;g=a[k]|0;k=(c[o>>2]|0)+1|0;c[o>>2]=k;a[k]=g;c[D>>2]=(c[D>>2]|0)-3}while((c[D>>2]|0)>>>0>2);if((c[D>>2]|0)==0){break}g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k;if(!((c[D>>2]|0)>>>0>1)){break}k=(c[F>>2]|0)+1|0;c[F>>2]=k;g=a[k]|0;k=(c[o>>2]|0)+1|0;c[o>>2]=k;a[k]=g;break}c[C>>2]=(c[E>>2]|0)-(c[C>>2]|0);if((c[C>>2]|0)>>>0>(c[s>>2]|0)>>>0?(c[(c[l>>2]|0)+7104>>2]|0)!=0:0){G=22;break a}c[F>>2]=(c[u>>2]|0)+ -1;do{if((c[t>>2]|0)==0){c[F>>2]=(c[F>>2]|0)+((c[r>>2]|0)-(c[C>>2]|0));if((c[C>>2]|0)>>>0<(c[D>>2]|0)>>>0){c[D>>2]=(c[D>>2]|0)-(c[C>>2]|0);do{g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k;k=(c[C>>2]|0)+ -1|0;c[C>>2]=k}while((k|0)!=0);c[F>>2]=(c[o>>2]|0)+(0-(c[E>>2]|0))}}else{if(!((c[t>>2]|0)>>>0<(c[C>>2]|0)>>>0)){c[F>>2]=(c[F>>2]|0)+((c[t>>2]|0)-(c[C>>2]|0));if(!((c[C>>2]|0)>>>0<(c[D>>2]|0)>>>0)){break}c[D>>2]=(c[D>>2]|0)-(c[C>>2]|0);do{k=(c[F>>2]|0)+1|0;c[F>>2]=k;g=a[k]|0;k=(c[o>>2]|0)+1|0;c[o>>2]=k;a[k]=g;g=(c[C>>2]|0)+ -1|0;c[C>>2]=g}while((g|0)!=0);c[F>>2]=(c[o>>2]|0)+(0-(c[E>>2]|0));break}c[F>>2]=(c[F>>2]|0)+((c[r>>2]|0)+(c[t>>2]|0)-(c[C>>2]|0));c[C>>2]=(c[C>>2]|0)-(c[t>>2]|0);if((c[C>>2]|0)>>>0<(c[D>>2]|0)>>>0){c[D>>2]=(c[D>>2]|0)-(c[C>>2]|0);do{g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k;k=(c[C>>2]|0)+ -1|0;c[C>>2]=k}while((k|0)!=0);c[F>>2]=(c[u>>2]|0)+ -1;if((c[t>>2]|0)>>>0<(c[D>>2]|0)>>>0){c[C>>2]=c[t>>2];c[D>>2]=(c[D>>2]|0)-(c[C>>2]|0);do{k=(c[F>>2]|0)+1|0;c[F>>2]=k;g=a[k]|0;k=(c[o>>2]|0)+1|0;c[o>>2]=k;a[k]=g;g=(c[C>>2]|0)+ -1|0;c[C>>2]=g}while((g|0)!=0);c[F>>2]=(c[o>>2]|0)+(0-(c[E>>2]|0))}}}}while(0);while(1){if(!((c[D>>2]|0)>>>0>2)){break}g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k;k=(c[F>>2]|0)+1|0;c[F>>2]=k;g=a[k]|0;k=(c[o>>2]|0)+1|0;c[o>>2]=k;a[k]=g;g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k;c[D>>2]=(c[D>>2]|0)-3}if((c[D>>2]|0)!=0?(k=(c[F>>2]|0)+1|0,c[F>>2]=k,g=a[k]|0,k=(c[o>>2]|0)+1|0,c[o>>2]=k,a[k]=g,(c[D>>2]|0)>>>0>1):0){g=(c[F>>2]|0)+1|0;c[F>>2]=g;k=a[g]|0;g=(c[o>>2]|0)+1|0;c[o>>2]=g;a[g]=k}}}while(0);if(!((c[m>>2]|0)>>>0<(c[n>>2]|0)>>>0)){break}}while((c[o>>2]|0)>>>0<(c[q>>2]|0)>>>0);do{if((G|0)==22){c[(c[j>>2]|0)+24>>2]=11840;c[c[l>>2]>>2]=29}else if((G|0)==52){c[(c[j>>2]|0)+24>>2]=11872;c[c[l>>2]>>2]=29}else if((G|0)==55){if((c[C>>2]&32|0)!=0){c[c[l>>2]>>2]=11;break}else{c[(c[j>>2]|0)+24>>2]=11896;c[c[l>>2]>>2]=29;break}}}while(0);c[D>>2]=(c[w>>2]|0)>>>3;c[m>>2]=(c[m>>2]|0)+(0-(c[D>>2]|0));c[w>>2]=(c[w>>2]|0)-(c[D>>2]<<3);c[v>>2]=c[v>>2]&(1<<c[w>>2])-1;c[c[j>>2]>>2]=(c[m>>2]|0)+1;c[(c[j>>2]|0)+12>>2]=(c[o>>2]|0)+1;if((c[m>>2]|0)>>>0<(c[n>>2]|0)>>>0){H=5+((c[n>>2]|0)-(c[m>>2]|0))|0}else{H=5-((c[m>>2]|0)-(c[n>>2]|0))|0}c[(c[j>>2]|0)+4>>2]=H;if((c[o>>2]|0)>>>0<(c[q>>2]|0)>>>0){I=257+((c[q>>2]|0)-(c[o>>2]|0))|0;J=c[j>>2]|0;K=J+16|0;c[K>>2]=I;L=c[v>>2]|0;M=c[l>>2]|0;N=M+56|0;c[N>>2]=L;O=c[w>>2]|0;P=c[l>>2]|0;Q=P+60|0;c[Q>>2]=O;i=h;return}else{I=257-((c[o>>2]|0)-(c[q>>2]|0))|0;J=c[j>>2]|0;K=J+16|0;c[K>>2]=I;L=c[v>>2]|0;M=c[l>>2]|0;N=M+56|0;c[N>>2]=L;O=c[w>>2]|0;P=c[l>>2]|0;Q=P+60|0;c[Q>>2]=O;i=h;return}}function tf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+16|0;d=b+8|0;e=b+4|0;f=b;c[e>>2]=a;if((c[e>>2]|0)!=0?(c[(c[e>>2]|0)+28>>2]|0)!=0:0){c[f>>2]=c[(c[e>>2]|0)+28>>2];c[(c[f>>2]|0)+28>>2]=0;c[(c[e>>2]|0)+20>>2]=0;c[(c[e>>2]|0)+8>>2]=0;c[(c[e>>2]|0)+24>>2]=0;c[(c[e>>2]|0)+48>>2]=1;c[c[f>>2]>>2]=0;c[(c[f>>2]|0)+4>>2]=0;c[(c[f>>2]|0)+12>>2]=0;c[(c[f>>2]|0)+20>>2]=32768;c[(c[f>>2]|0)+32>>2]=0;c[(c[f>>2]|0)+40>>2]=0;c[(c[f>>2]|0)+44>>2]=0;c[(c[f>>2]|0)+48>>2]=0;c[(c[f>>2]|0)+56>>2]=0;c[(c[f>>2]|0)+60>>2]=0;e=(c[f>>2]|0)+1328|0;c[(c[f>>2]|0)+108>>2]=e;c[(c[f>>2]|0)+80>>2]=e;c[(c[f>>2]|0)+76>>2]=e;c[(c[f>>2]|0)+7104>>2]=1;c[(c[f>>2]|0)+7108>>2]=-1;c[d>>2]=0;g=c[d>>2]|0;i=b;return g|0}c[d>>2]=-2;g=c[d>>2]|0;i=b;return g|0}function uf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+32|0;e=d+16|0;f=d+12|0;g=d+8|0;h=d+4|0;j=d;c[f>>2]=a;c[g>>2]=b;if((c[f>>2]|0)!=0?(c[(c[f>>2]|0)+28>>2]|0)!=0:0){c[j>>2]=c[(c[f>>2]|0)+28>>2];if((c[g>>2]|0)>=0){c[h>>2]=(c[g>>2]>>4)+1;if((c[g>>2]|0)<48){c[g>>2]=c[g>>2]&15}}else{c[h>>2]=0;c[g>>2]=0-(c[g>>2]|0)}if((c[g>>2]|0)!=0?(c[g>>2]|0)<8|(c[g>>2]|0)>15:0){c[e>>2]=-2;k=c[e>>2]|0;i=d;return k|0}if((c[(c[j>>2]|0)+52>>2]|0)!=0?(c[(c[j>>2]|0)+36>>2]|0)!=(c[g>>2]|0):0){Lc[c[(c[f>>2]|0)+36>>2]&63](c[(c[f>>2]|0)+40>>2]|0,c[(c[j>>2]|0)+52>>2]|0);c[(c[j>>2]|0)+52>>2]=0}c[(c[j>>2]|0)+8>>2]=c[h>>2];c[(c[j>>2]|0)+36>>2]=c[g>>2];g=tf(c[f>>2]|0)|0;c[e>>2]=g;k=c[e>>2]|0;i=d;return k|0}c[e>>2]=-2;k=c[e>>2]|0;i=d;return k|0}function vf(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;g=i;i=i+32|0;h=g+24|0;j=g+20|0;k=g+16|0;l=g+12|0;m=g+8|0;n=g+4|0;o=g;c[j>>2]=b;c[k>>2]=d;c[l>>2]=e;c[m>>2]=f;if(((c[l>>2]|0)!=0?(a[c[l>>2]|0]|0)==(a[11928]|0):0)?(c[m>>2]|0)==56:0){if((c[j>>2]|0)==0){c[h>>2]=-2;p=c[h>>2]|0;i=g;return p|0}c[(c[j>>2]|0)+24>>2]=0;if((c[(c[j>>2]|0)+32>>2]|0)==0){c[(c[j>>2]|0)+32>>2]=30;c[(c[j>>2]|0)+40>>2]=0}if((c[(c[j>>2]|0)+36>>2]|0)==0){c[(c[j>>2]|0)+36>>2]=41}m=Gc[c[(c[j>>2]|0)+32>>2]&31](c[(c[j>>2]|0)+40>>2]|0,1,7116)|0;c[o>>2]=m;if((c[o>>2]|0)==0){c[h>>2]=-4;p=c[h>>2]|0;i=g;return p|0}c[(c[j>>2]|0)+28>>2]=c[o>>2];c[(c[o>>2]|0)+52>>2]=0;m=uf(c[j>>2]|0,c[k>>2]|0)|0;c[n>>2]=m;if((c[n>>2]|0)!=0){Lc[c[(c[j>>2]|0)+36>>2]&63](c[(c[j>>2]|0)+40>>2]|0,c[o>>2]|0);c[(c[j>>2]|0)+28>>2]=0}c[h>>2]=c[n>>2];p=c[h>>2]|0;i=g;return p|0}c[h>>2]=-6;p=c[h>>2]|0;i=g;return p|0}function wf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+16|0;f=e+8|0;g=e+4|0;h=e;c[f>>2]=a;c[g>>2]=b;c[h>>2]=d;d=vf(c[f>>2]|0,15,c[g>>2]|0,c[h>>2]|0)|0;i=e;return d|0}function xf(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;h=i;i=i+80|0;j=h+60|0;k=h+56|0;l=h+52|0;m=h+48|0;n=h+44|0;o=h+40|0;p=h+36|0;q=h+32|0;r=h+28|0;s=h+24|0;t=h+20|0;u=h+16|0;v=h+12|0;w=h+8|0;x=h+68|0;y=h+64|0;z=h+4|0;A=h;B=h+72|0;c[k>>2]=f;c[l>>2]=g;do{if(((c[k>>2]|0)!=0?(c[(c[k>>2]|0)+28>>2]|0)!=0:0)?(c[(c[k>>2]|0)+12>>2]|0)!=0:0){if((c[c[k>>2]>>2]|0)==0?(c[(c[k>>2]|0)+4>>2]|0)!=0:0){break}c[m>>2]=c[(c[k>>2]|0)+28>>2];if((c[c[m>>2]>>2]|0)==11){c[c[m>>2]>>2]=12}c[o>>2]=c[(c[k>>2]|0)+12>>2];c[q>>2]=c[(c[k>>2]|0)+16>>2];c[n>>2]=c[c[k>>2]>>2];c[p>>2]=c[(c[k>>2]|0)+4>>2];c[r>>2]=c[(c[m>>2]|0)+56>>2];c[s>>2]=c[(c[m>>2]|0)+60>>2];c[t>>2]=c[p>>2];c[u>>2]=c[q>>2];c[A>>2]=0;a:while(1){b:do{switch(c[c[m>>2]>>2]|0){case 0:{if((c[(c[m>>2]|0)+8>>2]|0)==0){c[c[m>>2]>>2]=12;continue a}while(1){if(!((c[s>>2]|0)>>>0<16)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}if((c[(c[m>>2]|0)+8>>2]&2|0)!=0?(c[r>>2]|0)==35615:0){g=pf(0,0,0)|0;c[(c[m>>2]|0)+24>>2]=g;a[B]=c[r>>2];a[B+1|0]=(c[r>>2]|0)>>>8;g=pf(c[(c[m>>2]|0)+24>>2]|0,B,2)|0;c[(c[m>>2]|0)+24>>2]=g;c[r>>2]=0;c[s>>2]=0;c[c[m>>2]>>2]=1;continue a}c[(c[m>>2]|0)+16>>2]=0;if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+48>>2]=-1}if((c[(c[m>>2]|0)+8>>2]&1|0)!=0?(((((c[r>>2]&255)<<8)+((c[r>>2]|0)>>>8)|0)>>>0)%31|0|0)==0:0){if((c[r>>2]&15|0)!=8){c[(c[k>>2]|0)+24>>2]=12e3;c[c[m>>2]>>2]=29;continue a}c[r>>2]=(c[r>>2]|0)>>>4;c[s>>2]=(c[s>>2]|0)-4;c[z>>2]=(c[r>>2]&15)+8;g=c[z>>2]|0;f=(c[m>>2]|0)+36|0;if((c[(c[m>>2]|0)+36>>2]|0)!=0){if(g>>>0>(c[f>>2]|0)>>>0){c[(c[k>>2]|0)+24>>2]=12032;c[c[m>>2]>>2]=29;continue a}}else{c[f>>2]=g}c[(c[m>>2]|0)+20>>2]=1<<c[z>>2];g=of(0,0,0)|0;c[(c[m>>2]|0)+24>>2]=g;c[(c[k>>2]|0)+48>>2]=g;c[c[m>>2]>>2]=(c[r>>2]&512|0)!=0?9:11;c[r>>2]=0;c[s>>2]=0;continue a}c[(c[k>>2]|0)+24>>2]=11976;c[c[m>>2]>>2]=29;continue a;break};case 1:{while(1){if(!((c[s>>2]|0)>>>0<16)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[(c[m>>2]|0)+16>>2]=c[r>>2];if((c[(c[m>>2]|0)+16>>2]&255|0)!=8){c[(c[k>>2]|0)+24>>2]=12e3;c[c[m>>2]>>2]=29;continue a}if((c[(c[m>>2]|0)+16>>2]&57344|0)!=0){c[(c[k>>2]|0)+24>>2]=12056;c[c[m>>2]>>2]=29;continue a}if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[c[(c[m>>2]|0)+32>>2]>>2]=(c[r>>2]|0)>>>8&1}if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){a[B]=c[r>>2];a[B+1|0]=(c[r>>2]|0)>>>8;g=pf(c[(c[m>>2]|0)+24>>2]|0,B,2)|0;c[(c[m>>2]|0)+24>>2]=g}c[r>>2]=0;c[s>>2]=0;c[c[m>>2]>>2]=2;C=43;break};case 3:{C=51;break};case 2:{C=43;break};case 4:{C=59;break};case 5:{C=71;break};case 6:{C=86;break};case 7:{C=101;break};case 8:{C=116;break};case 10:{C=130;break};case 9:{while(1){if(!((c[s>>2]|0)>>>0<32)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}g=((c[r>>2]|0)>>>24&255)+((c[r>>2]|0)>>>8&65280)+((c[r>>2]&65280)<<8)+((c[r>>2]&255)<<24)|0;c[(c[m>>2]|0)+24>>2]=g;c[(c[k>>2]|0)+48>>2]=g;c[r>>2]=0;c[s>>2]=0;c[c[m>>2]>>2]=10;C=130;break};case 12:{C=134;break};case 11:{C=133;break};case 14:{C=153;break};case 15:{C=154;break};case 13:{c[r>>2]=(c[r>>2]|0)>>>(c[s>>2]&7);c[s>>2]=(c[s>>2]|0)-(c[s>>2]&7);while(1){if(!((c[s>>2]|0)>>>0<32)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}if((c[r>>2]&65535|0)==((c[r>>2]|0)>>>16^65535|0)){c[(c[m>>2]|0)+64>>2]=c[r>>2]&65535;c[r>>2]=0;c[s>>2]=0;c[c[m>>2]>>2]=14;if((c[l>>2]|0)==6){break a}else{C=153;break b}}else{c[(c[k>>2]|0)+24>>2]=12136;c[c[m>>2]>>2]=29;continue a}break};case 16:{while(1){if(!((c[s>>2]|0)>>>0<14)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[(c[m>>2]|0)+96>>2]=(c[r>>2]&31)+257;c[r>>2]=(c[r>>2]|0)>>>5;c[s>>2]=(c[s>>2]|0)-5;c[(c[m>>2]|0)+100>>2]=(c[r>>2]&31)+1;c[r>>2]=(c[r>>2]|0)>>>5;c[s>>2]=(c[s>>2]|0)-5;c[(c[m>>2]|0)+92>>2]=(c[r>>2]&15)+4;c[r>>2]=(c[r>>2]|0)>>>4;c[s>>2]=(c[s>>2]|0)-4;if(!((c[(c[m>>2]|0)+96>>2]|0)>>>0>286)?!((c[(c[m>>2]|0)+100>>2]|0)>>>0>30):0){c[(c[m>>2]|0)+104>>2]=0;c[c[m>>2]>>2]=17;C=169;break b}c[(c[k>>2]|0)+24>>2]=12168;c[c[m>>2]>>2]=29;continue a;break};case 17:{C=169;break};case 18:{C=179;break};case 19:{C=216;break};case 20:{C=217;break};case 21:{C=239;break};case 22:{C=245;break};case 24:{break};case 23:{C=257;break};case 25:{if((c[q>>2]|0)==0){break a}g=c[(c[m>>2]|0)+64>>2]&255;f=c[o>>2]|0;c[o>>2]=f+1;a[f]=g;c[q>>2]=(c[q>>2]|0)+ -1;c[c[m>>2]>>2]=20;continue a;break};case 26:{do{if((c[(c[m>>2]|0)+8>>2]|0)!=0){while(1){if(!((c[s>>2]|0)>>>0<32)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[u>>2]=(c[u>>2]|0)-(c[q>>2]|0);g=(c[k>>2]|0)+20|0;c[g>>2]=(c[g>>2]|0)+(c[u>>2]|0);g=(c[m>>2]|0)+28|0;c[g>>2]=(c[g>>2]|0)+(c[u>>2]|0);if((c[u>>2]|0)!=0){g=c[(c[m>>2]|0)+24>>2]|0;f=(c[o>>2]|0)+(0-(c[u>>2]|0))|0;D=c[u>>2]|0;if((c[(c[m>>2]|0)+16>>2]|0)!=0){E=pf(g,f,D)|0}else{E=of(g,f,D)|0}c[(c[m>>2]|0)+24>>2]=E;c[(c[k>>2]|0)+48>>2]=E}c[u>>2]=c[q>>2];D=c[r>>2]|0;if((c[(c[m>>2]|0)+16>>2]|0)!=0){F=D}else{F=(D>>>24&255)+((c[r>>2]|0)>>>8&65280)+((c[r>>2]&65280)<<8)+((c[r>>2]&255)<<24)|0}if((F|0)!=(c[(c[m>>2]|0)+24>>2]|0)){c[(c[k>>2]|0)+24>>2]=12456;c[c[m>>2]>>2]=29;continue a}else{c[r>>2]=0;c[s>>2]=0;break}}}while(0);c[c[m>>2]>>2]=27;C=297;break};case 27:{C=297;break};case 28:{C=306;break a;break};case 29:{C=307;break a;break};case 30:{C=308;break a;break};default:{C=309;break a}}}while(0);do{if((C|0)==43){while(1){C=0;if(!((c[s>>2]|0)>>>0<32)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;D=c[n>>2]|0;c[n>>2]=D+1;c[r>>2]=(c[r>>2]|0)+((d[D]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8;C=43}if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+4>>2]=c[r>>2]}if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){a[B]=c[r>>2];a[B+1|0]=(c[r>>2]|0)>>>8;a[B+2|0]=(c[r>>2]|0)>>>16;a[B+3|0]=(c[r>>2]|0)>>>24;D=pf(c[(c[m>>2]|0)+24>>2]|0,B,4)|0;c[(c[m>>2]|0)+24>>2]=D}c[r>>2]=0;c[s>>2]=0;c[c[m>>2]>>2]=3;C=51}else if((C|0)==130){C=0;if((c[(c[m>>2]|0)+12>>2]|0)==0){C=131;break a}D=of(0,0,0)|0;c[(c[m>>2]|0)+24>>2]=D;c[(c[k>>2]|0)+48>>2]=D;c[c[m>>2]>>2]=11;C=133}else if((C|0)==153){C=0;c[c[m>>2]>>2]=15;C=154}else if((C|0)==169){while(1){C=0;if(!((c[(c[m>>2]|0)+104>>2]|0)>>>0<(c[(c[m>>2]|0)+92>>2]|0)>>>0)){break}while(1){if(!((c[s>>2]|0)>>>0<3)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;D=c[n>>2]|0;c[n>>2]=D+1;c[r>>2]=(c[r>>2]|0)+((d[D]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}D=c[r>>2]&7;f=(c[m>>2]|0)+104|0;g=c[f>>2]|0;c[f>>2]=g+1;b[(c[m>>2]|0)+112+((e[11936+(g<<1)>>1]|0)<<1)>>1]=D;c[r>>2]=(c[r>>2]|0)>>>3;c[s>>2]=(c[s>>2]|0)-3;C=169}while(1){G=c[m>>2]|0;if(!((c[(c[m>>2]|0)+104>>2]|0)>>>0<19)){break}D=G+104|0;g=c[D>>2]|0;c[D>>2]=g+1;b[(c[m>>2]|0)+112+((e[11936+(g<<1)>>1]|0)<<1)>>1]=0}c[(c[m>>2]|0)+108>>2]=G+1328;c[(c[m>>2]|0)+76>>2]=c[(c[m>>2]|0)+108>>2];c[(c[m>>2]|0)+84>>2]=7;g=Bf(0,(c[m>>2]|0)+112|0,19,(c[m>>2]|0)+108|0,(c[m>>2]|0)+84|0,(c[m>>2]|0)+752|0)|0;c[A>>2]=g;if((c[A>>2]|0)!=0){c[(c[k>>2]|0)+24>>2]=12208;c[c[m>>2]>>2]=29;continue a}else{c[(c[m>>2]|0)+104>>2]=0;c[c[m>>2]>>2]=18;C=179;break}}else if((C|0)==297){C=0;if((c[(c[m>>2]|0)+8>>2]|0)==0){C=305;break a}if((c[(c[m>>2]|0)+16>>2]|0)==0){C=305;break a}while(1){if(!((c[s>>2]|0)>>>0<32)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}if((c[r>>2]|0)==(c[(c[m>>2]|0)+28>>2]|0)){C=304;break a}c[(c[k>>2]|0)+24>>2]=12480;c[c[m>>2]>>2]=29;continue a}}while(0);do{if((C|0)==51){while(1){C=0;if(!((c[s>>2]|0)>>>0<16)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8;C=51}if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+8>>2]=c[r>>2]&255;c[(c[(c[m>>2]|0)+32>>2]|0)+12>>2]=(c[r>>2]|0)>>>8}if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){a[B]=c[r>>2];a[B+1|0]=(c[r>>2]|0)>>>8;g=pf(c[(c[m>>2]|0)+24>>2]|0,B,2)|0;c[(c[m>>2]|0)+24>>2]=g}c[r>>2]=0;c[s>>2]=0;c[c[m>>2]>>2]=4;C=59}else if((C|0)==133){C=0;if((c[l>>2]|0)==5|(c[l>>2]|0)==6){break a}else{C=134}}else if((C|0)==154){C=0;c[v>>2]=c[(c[m>>2]|0)+64>>2];if((c[v>>2]|0)==0){c[c[m>>2]>>2]=11;continue a}if((c[v>>2]|0)>>>0>(c[p>>2]|0)>>>0){c[v>>2]=c[p>>2]}if((c[v>>2]|0)>>>0>(c[q>>2]|0)>>>0){c[v>>2]=c[q>>2]}if((c[v>>2]|0)==0){break a}tp(c[o>>2]|0,c[n>>2]|0,c[v>>2]|0)|0;c[p>>2]=(c[p>>2]|0)-(c[v>>2]|0);c[n>>2]=(c[n>>2]|0)+(c[v>>2]|0);c[q>>2]=(c[q>>2]|0)-(c[v>>2]|0);c[o>>2]=(c[o>>2]|0)+(c[v>>2]|0);g=(c[m>>2]|0)+64|0;c[g>>2]=(c[g>>2]|0)-(c[v>>2]|0);continue a}else if((C|0)==179){c:while(1){C=0;if(!((c[(c[m>>2]|0)+104>>2]|0)>>>0<((c[(c[m>>2]|0)+96>>2]|0)+(c[(c[m>>2]|0)+100>>2]|0)|0)>>>0)){break}while(1){g=(c[(c[m>>2]|0)+76>>2]|0)+((c[r>>2]&(1<<c[(c[m>>2]|0)+84>>2])-1)<<2)|0;b[x+0>>1]=b[g+0>>1]|0;b[x+2>>1]=b[g+2>>1]|0;if((d[x+1|0]|0)>>>0<=(c[s>>2]|0)>>>0){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}if((e[x+2>>1]|0|0)<16){while(1){if(!((c[s>>2]|0)>>>0<(d[x+1|0]|0)>>>0)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[r>>2]=(c[r>>2]|0)>>>(d[x+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[x+1|0]|0);g=b[x+2>>1]|0;D=(c[m>>2]|0)+104|0;f=c[D>>2]|0;c[D>>2]=f+1;b[(c[m>>2]|0)+112+(f<<1)>>1]=g;C=179;continue}do{if((e[x+2>>1]|0|0)!=16){if((e[x+2>>1]|0|0)==17){while(1){if(!((c[s>>2]|0)>>>0<((d[x+1|0]|0)+3|0)>>>0)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[r>>2]=(c[r>>2]|0)>>>(d[x+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[x+1|0]|0);c[z>>2]=0;c[v>>2]=3+(c[r>>2]&7);c[r>>2]=(c[r>>2]|0)>>>3;c[s>>2]=(c[s>>2]|0)-3;break}else{while(1){if(!((c[s>>2]|0)>>>0<((d[x+1|0]|0)+7|0)>>>0)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[r>>2]=(c[r>>2]|0)>>>(d[x+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[x+1|0]|0);c[z>>2]=0;c[v>>2]=11+(c[r>>2]&127);c[r>>2]=(c[r>>2]|0)>>>7;c[s>>2]=(c[s>>2]|0)-7;break}}else{while(1){if(!((c[s>>2]|0)>>>0<((d[x+1|0]|0)+2|0)>>>0)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[r>>2]=(c[r>>2]|0)>>>(d[x+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[x+1|0]|0);if((c[(c[m>>2]|0)+104>>2]|0)==0){C=193;break c}c[z>>2]=e[(c[m>>2]|0)+112+((c[(c[m>>2]|0)+104>>2]|0)-1<<1)>>1]|0;c[v>>2]=3+(c[r>>2]&3);c[r>>2]=(c[r>>2]|0)>>>2;c[s>>2]=(c[s>>2]|0)-2}}while(0);if(((c[(c[m>>2]|0)+104>>2]|0)+(c[v>>2]|0)|0)>>>0>((c[(c[m>>2]|0)+96>>2]|0)+(c[(c[m>>2]|0)+100>>2]|0)|0)>>>0){C=205;break}while(1){g=c[v>>2]|0;c[v>>2]=g+ -1;if((g|0)==0){C=179;continue c}g=c[z>>2]&65535;f=(c[m>>2]|0)+104|0;D=c[f>>2]|0;c[f>>2]=D+1;b[(c[m>>2]|0)+112+(D<<1)>>1]=g}}if((C|0)==193){C=0;c[(c[k>>2]|0)+24>>2]=12240;c[c[m>>2]>>2]=29}else if((C|0)==205){C=0;c[(c[k>>2]|0)+24>>2]=12240;c[c[m>>2]>>2]=29}if((c[c[m>>2]>>2]|0)==29){continue a}if((e[(c[m>>2]|0)+624>>1]|0|0)==0){c[(c[k>>2]|0)+24>>2]=12272;c[c[m>>2]>>2]=29;continue a}c[(c[m>>2]|0)+108>>2]=(c[m>>2]|0)+1328;c[(c[m>>2]|0)+76>>2]=c[(c[m>>2]|0)+108>>2];c[(c[m>>2]|0)+84>>2]=9;g=Bf(1,(c[m>>2]|0)+112|0,c[(c[m>>2]|0)+96>>2]|0,(c[m>>2]|0)+108|0,(c[m>>2]|0)+84|0,(c[m>>2]|0)+752|0)|0;c[A>>2]=g;if((c[A>>2]|0)!=0){c[(c[k>>2]|0)+24>>2]=12312;c[c[m>>2]>>2]=29;continue a}c[(c[m>>2]|0)+80>>2]=c[(c[m>>2]|0)+108>>2];c[(c[m>>2]|0)+88>>2]=6;g=Bf(2,(c[m>>2]|0)+112+(c[(c[m>>2]|0)+96>>2]<<1)|0,c[(c[m>>2]|0)+100>>2]|0,(c[m>>2]|0)+108|0,(c[m>>2]|0)+88|0,(c[m>>2]|0)+752|0)|0;c[A>>2]=g;if((c[A>>2]|0)==0){c[c[m>>2]>>2]=19;if((c[l>>2]|0)==6){break a}else{C=216;break}}else{c[(c[k>>2]|0)+24>>2]=12344;c[c[m>>2]>>2]=29;continue a}}}while(0);if((C|0)==59){C=0;if((c[(c[m>>2]|0)+16>>2]&1024|0)==0){if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+16>>2]=0}}else{while(1){if(!((c[s>>2]|0)>>>0<16)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[(c[m>>2]|0)+64>>2]=c[r>>2];if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+20>>2]=c[r>>2]}if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){a[B]=c[r>>2];a[B+1|0]=(c[r>>2]|0)>>>8;g=pf(c[(c[m>>2]|0)+24>>2]|0,B,2)|0;c[(c[m>>2]|0)+24>>2]=g}c[r>>2]=0;c[s>>2]=0}c[c[m>>2]>>2]=5;C=71}else if((C|0)==134){C=0;if((c[(c[m>>2]|0)+4>>2]|0)!=0){c[r>>2]=(c[r>>2]|0)>>>(c[s>>2]&7);c[s>>2]=(c[s>>2]|0)-(c[s>>2]&7);c[c[m>>2]>>2]=26;continue}while(1){if(!((c[s>>2]|0)>>>0<3)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[(c[m>>2]|0)+4>>2]=c[r>>2]&1;c[r>>2]=(c[r>>2]|0)>>>1;c[s>>2]=(c[s>>2]|0)-1;g=c[r>>2]&3;if((g|0)==0){c[c[m>>2]>>2]=13}else if((g|0)==1){yf(c[m>>2]|0);c[c[m>>2]>>2]=19;if((c[l>>2]|0)==6){C=142;break}}else if((g|0)==2){c[c[m>>2]>>2]=16}else if((g|0)==3){c[(c[k>>2]|0)+24>>2]=12112;c[c[m>>2]>>2]=29}c[r>>2]=(c[r>>2]|0)>>>2;c[s>>2]=(c[s>>2]|0)-2;continue}else if((C|0)==216){C=0;c[c[m>>2]>>2]=20;C=217}do{if((C|0)==71){C=0;if((c[(c[m>>2]|0)+16>>2]&1024|0)!=0){c[v>>2]=c[(c[m>>2]|0)+64>>2];if((c[v>>2]|0)>>>0>(c[p>>2]|0)>>>0){c[v>>2]=c[p>>2]}if((c[v>>2]|0)!=0){if((c[(c[m>>2]|0)+32>>2]|0)!=0?(c[(c[(c[m>>2]|0)+32>>2]|0)+16>>2]|0)!=0:0){c[z>>2]=(c[(c[(c[m>>2]|0)+32>>2]|0)+20>>2]|0)-(c[(c[m>>2]|0)+64>>2]|0);if(((c[z>>2]|0)+(c[v>>2]|0)|0)>>>0>(c[(c[(c[m>>2]|0)+32>>2]|0)+24>>2]|0)>>>0){H=(c[(c[(c[m>>2]|0)+32>>2]|0)+24>>2]|0)-(c[z>>2]|0)|0}else{H=c[v>>2]|0}tp((c[(c[(c[m>>2]|0)+32>>2]|0)+16>>2]|0)+(c[z>>2]|0)|0,c[n>>2]|0,H|0)|0}if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){g=pf(c[(c[m>>2]|0)+24>>2]|0,c[n>>2]|0,c[v>>2]|0)|0;c[(c[m>>2]|0)+24>>2]=g}c[p>>2]=(c[p>>2]|0)-(c[v>>2]|0);c[n>>2]=(c[n>>2]|0)+(c[v>>2]|0);g=(c[m>>2]|0)+64|0;c[g>>2]=(c[g>>2]|0)-(c[v>>2]|0)}if((c[(c[m>>2]|0)+64>>2]|0)!=0){break a}}c[(c[m>>2]|0)+64>>2]=0;c[c[m>>2]>>2]=6;C=86}else if((C|0)==217){C=0;if((c[p>>2]|0)>>>0>=6?(c[q>>2]|0)>>>0>=258:0){c[(c[k>>2]|0)+12>>2]=c[o>>2];c[(c[k>>2]|0)+16>>2]=c[q>>2];c[c[k>>2]>>2]=c[n>>2];c[(c[k>>2]|0)+4>>2]=c[p>>2];c[(c[m>>2]|0)+56>>2]=c[r>>2];c[(c[m>>2]|0)+60>>2]=c[s>>2];sf(c[k>>2]|0,c[u>>2]|0);c[o>>2]=c[(c[k>>2]|0)+12>>2];c[q>>2]=c[(c[k>>2]|0)+16>>2];c[n>>2]=c[c[k>>2]>>2];c[p>>2]=c[(c[k>>2]|0)+4>>2];c[r>>2]=c[(c[m>>2]|0)+56>>2];c[s>>2]=c[(c[m>>2]|0)+60>>2];if((c[c[m>>2]>>2]|0)!=11){continue a}c[(c[m>>2]|0)+7108>>2]=-1;continue a}c[(c[m>>2]|0)+7108>>2]=0;while(1){g=(c[(c[m>>2]|0)+76>>2]|0)+((c[r>>2]&(1<<c[(c[m>>2]|0)+84>>2])-1)<<2)|0;b[x+0>>1]=b[g+0>>1]|0;b[x+2>>1]=b[g+2>>1]|0;if((d[x+1|0]|0)>>>0<=(c[s>>2]|0)>>>0){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}if((d[x]|0|0)!=0?(a[x]&240|0)==0:0){b[y+0>>1]=b[x+0>>1]|0;b[y+2>>1]=b[x+2>>1]|0;while(1){g=(c[(c[m>>2]|0)+76>>2]|0)+((e[y+2>>1]|0)+((c[r>>2]&(1<<(d[y+1|0]|0)+(d[y]|0))-1)>>>(d[y+1|0]|0))<<2)|0;b[x+0>>1]=b[g+0>>1]|0;b[x+2>>1]=b[g+2>>1]|0;if(((d[y+1|0]|0)+(d[x+1|0]|0)|0)>>>0<=(c[s>>2]|0)>>>0){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[r>>2]=(c[r>>2]|0)>>>(d[y+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[y+1|0]|0);g=(c[m>>2]|0)+7108|0;c[g>>2]=(c[g>>2]|0)+(d[y+1|0]|0)}c[r>>2]=(c[r>>2]|0)>>>(d[x+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[x+1|0]|0);g=(c[m>>2]|0)+7108|0;c[g>>2]=(c[g>>2]|0)+(d[x+1|0]|0);c[(c[m>>2]|0)+64>>2]=e[x+2>>1]|0;if((d[x]|0|0)==0){c[c[m>>2]>>2]=25;continue a}if((a[x]&32|0)!=0){c[(c[m>>2]|0)+7108>>2]=-1;c[c[m>>2]>>2]=11;continue a}if((a[x]&64|0)!=0){c[(c[k>>2]|0)+24>>2]=12368;c[c[m>>2]>>2]=29;continue a}else{c[(c[m>>2]|0)+72>>2]=a[x]&15;c[c[m>>2]>>2]=21;C=239;break}}}while(0);if((C|0)==86){C=0;if((c[(c[m>>2]|0)+16>>2]&2048|0)!=0){if((c[p>>2]|0)==0){break}c[v>>2]=0;do{g=c[v>>2]|0;c[v>>2]=g+1;c[z>>2]=d[(c[n>>2]|0)+g|0]|0;if(((c[(c[m>>2]|0)+32>>2]|0)!=0?(c[(c[(c[m>>2]|0)+32>>2]|0)+28>>2]|0)!=0:0)?(c[(c[m>>2]|0)+64>>2]|0)>>>0<(c[(c[(c[m>>2]|0)+32>>2]|0)+32>>2]|0)>>>0:0){g=c[z>>2]&255;D=(c[m>>2]|0)+64|0;f=c[D>>2]|0;c[D>>2]=f+1;a[(c[(c[(c[m>>2]|0)+32>>2]|0)+28>>2]|0)+f|0]=g}if((c[z>>2]|0)==0){break}}while((c[v>>2]|0)>>>0<(c[p>>2]|0)>>>0);if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){g=pf(c[(c[m>>2]|0)+24>>2]|0,c[n>>2]|0,c[v>>2]|0)|0;c[(c[m>>2]|0)+24>>2]=g}c[p>>2]=(c[p>>2]|0)-(c[v>>2]|0);c[n>>2]=(c[n>>2]|0)+(c[v>>2]|0);if((c[z>>2]|0)!=0){break}}else{if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+28>>2]=0}}c[(c[m>>2]|0)+64>>2]=0;c[c[m>>2]>>2]=7;C=101}else if((C|0)==239){C=0;if((c[(c[m>>2]|0)+72>>2]|0)!=0){while(1){if(!((c[s>>2]|0)>>>0<(c[(c[m>>2]|0)+72>>2]|0)>>>0)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}g=(c[m>>2]|0)+64|0;c[g>>2]=(c[g>>2]|0)+(c[r>>2]&(1<<c[(c[m>>2]|0)+72>>2])-1);c[r>>2]=(c[r>>2]|0)>>>(c[(c[m>>2]|0)+72>>2]|0);c[s>>2]=(c[s>>2]|0)-(c[(c[m>>2]|0)+72>>2]|0);g=(c[m>>2]|0)+7108|0;c[g>>2]=(c[g>>2]|0)+(c[(c[m>>2]|0)+72>>2]|0)}c[(c[m>>2]|0)+7112>>2]=c[(c[m>>2]|0)+64>>2];c[c[m>>2]>>2]=22;C=245}do{if((C|0)==101){C=0;if((c[(c[m>>2]|0)+16>>2]&4096|0)!=0){if((c[p>>2]|0)==0){break a}c[v>>2]=0;do{g=c[v>>2]|0;c[v>>2]=g+1;c[z>>2]=d[(c[n>>2]|0)+g|0]|0;if(((c[(c[m>>2]|0)+32>>2]|0)!=0?(c[(c[(c[m>>2]|0)+32>>2]|0)+36>>2]|0)!=0:0)?(c[(c[m>>2]|0)+64>>2]|0)>>>0<(c[(c[(c[m>>2]|0)+32>>2]|0)+40>>2]|0)>>>0:0){g=c[z>>2]&255;f=(c[m>>2]|0)+64|0;D=c[f>>2]|0;c[f>>2]=D+1;a[(c[(c[(c[m>>2]|0)+32>>2]|0)+36>>2]|0)+D|0]=g}if((c[z>>2]|0)==0){break}}while((c[v>>2]|0)>>>0<(c[p>>2]|0)>>>0);if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){g=pf(c[(c[m>>2]|0)+24>>2]|0,c[n>>2]|0,c[v>>2]|0)|0;c[(c[m>>2]|0)+24>>2]=g}c[p>>2]=(c[p>>2]|0)-(c[v>>2]|0);c[n>>2]=(c[n>>2]|0)+(c[v>>2]|0);if((c[z>>2]|0)!=0){break a}}else{if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+36>>2]=0}}c[c[m>>2]>>2]=8;C=116}else if((C|0)==245){while(1){C=0;g=(c[(c[m>>2]|0)+80>>2]|0)+((c[r>>2]&(1<<c[(c[m>>2]|0)+88>>2])-1)<<2)|0;b[x+0>>1]=b[g+0>>1]|0;b[x+2>>1]=b[g+2>>1]|0;if((d[x+1|0]|0)>>>0<=(c[s>>2]|0)>>>0){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8;C=245}if((a[x]&240|0)==0){b[y+0>>1]=b[x+0>>1]|0;b[y+2>>1]=b[x+2>>1]|0;while(1){g=(c[(c[m>>2]|0)+80>>2]|0)+((e[y+2>>1]|0)+((c[r>>2]&(1<<(d[y+1|0]|0)+(d[y]|0))-1)>>>(d[y+1|0]|0))<<2)|0;b[x+0>>1]=b[g+0>>1]|0;b[x+2>>1]=b[g+2>>1]|0;if(((d[y+1|0]|0)+(d[x+1|0]|0)|0)>>>0<=(c[s>>2]|0)>>>0){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}c[r>>2]=(c[r>>2]|0)>>>(d[y+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[y+1|0]|0);g=(c[m>>2]|0)+7108|0;c[g>>2]=(c[g>>2]|0)+(d[y+1|0]|0)}c[r>>2]=(c[r>>2]|0)>>>(d[x+1|0]|0);c[s>>2]=(c[s>>2]|0)-(d[x+1|0]|0);g=(c[m>>2]|0)+7108|0;c[g>>2]=(c[g>>2]|0)+(d[x+1|0]|0);if((a[x]&64|0)!=0){c[(c[k>>2]|0)+24>>2]=12400;c[c[m>>2]>>2]=29;continue a}else{c[(c[m>>2]|0)+68>>2]=e[x+2>>1]|0;c[(c[m>>2]|0)+72>>2]=a[x]&15;c[c[m>>2]>>2]=23;C=257;break}}}while(0);if((C|0)==116){C=0;do{if((c[(c[m>>2]|0)+16>>2]&512|0)!=0){while(1){if(!((c[s>>2]|0)>>>0<16)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}if((c[r>>2]|0)!=(c[(c[m>>2]|0)+24>>2]&65535|0)){c[(c[k>>2]|0)+24>>2]=12088;c[c[m>>2]>>2]=29;continue a}else{c[r>>2]=0;c[s>>2]=0;break}}}while(0);if((c[(c[m>>2]|0)+32>>2]|0)!=0){c[(c[(c[m>>2]|0)+32>>2]|0)+44>>2]=c[(c[m>>2]|0)+16>>2]>>9&1;c[(c[(c[m>>2]|0)+32>>2]|0)+48>>2]=1}g=pf(0,0,0)|0;c[(c[m>>2]|0)+24>>2]=g;c[(c[k>>2]|0)+48>>2]=g;c[c[m>>2]>>2]=11;continue}else if((C|0)==257){C=0;if((c[(c[m>>2]|0)+72>>2]|0)!=0){while(1){if(!((c[s>>2]|0)>>>0<(c[(c[m>>2]|0)+72>>2]|0)>>>0)){break}if((c[p>>2]|0)==0){break a}c[p>>2]=(c[p>>2]|0)+ -1;g=c[n>>2]|0;c[n>>2]=g+1;c[r>>2]=(c[r>>2]|0)+((d[g]|0)<<c[s>>2]);c[s>>2]=(c[s>>2]|0)+8}g=(c[m>>2]|0)+68|0;c[g>>2]=(c[g>>2]|0)+(c[r>>2]&(1<<c[(c[m>>2]|0)+72>>2])-1);c[r>>2]=(c[r>>2]|0)>>>(c[(c[m>>2]|0)+72>>2]|0);c[s>>2]=(c[s>>2]|0)-(c[(c[m>>2]|0)+72>>2]|0);g=(c[m>>2]|0)+7108|0;c[g>>2]=(c[g>>2]|0)+(c[(c[m>>2]|0)+72>>2]|0)}c[c[m>>2]>>2]=24}if((c[q>>2]|0)==0){break}c[v>>2]=(c[u>>2]|0)-(c[q>>2]|0);if((c[(c[m>>2]|0)+68>>2]|0)>>>0>(c[v>>2]|0)>>>0){c[v>>2]=(c[(c[m>>2]|0)+68>>2]|0)-(c[v>>2]|0);if((c[v>>2]|0)>>>0>(c[(c[m>>2]|0)+44>>2]|0)>>>0?(c[(c[m>>2]|0)+7104>>2]|0)!=0:0){c[(c[k>>2]|0)+24>>2]=12424;c[c[m>>2]>>2]=29;continue}g=c[m>>2]|0;if((c[v>>2]|0)>>>0>(c[(c[m>>2]|0)+48>>2]|0)>>>0){c[v>>2]=(c[v>>2]|0)-(c[g+48>>2]|0);c[w>>2]=(c[(c[m>>2]|0)+52>>2]|0)+((c[(c[m>>2]|0)+40>>2]|0)-(c[v>>2]|0))}else{c[w>>2]=(c[g+52>>2]|0)+((c[(c[m>>2]|0)+48>>2]|0)-(c[v>>2]|0))}if((c[v>>2]|0)>>>0>(c[(c[m>>2]|0)+64>>2]|0)>>>0){c[v>>2]=c[(c[m>>2]|0)+64>>2]}}else{c[w>>2]=(c[o>>2]|0)+(0-(c[(c[m>>2]|0)+68>>2]|0));c[v>>2]=c[(c[m>>2]|0)+64>>2]}if((c[v>>2]|0)>>>0>(c[q>>2]|0)>>>0){c[v>>2]=c[q>>2]}c[q>>2]=(c[q>>2]|0)-(c[v>>2]|0);g=(c[m>>2]|0)+64|0;c[g>>2]=(c[g>>2]|0)-(c[v>>2]|0);do{g=c[w>>2]|0;c[w>>2]=g+1;D=a[g]|0;g=c[o>>2]|0;c[o>>2]=g+1;a[g]=D;D=(c[v>>2]|0)+ -1|0;c[v>>2]=D}while((D|0)!=0);if((c[(c[m>>2]|0)+64>>2]|0)!=0){continue}c[c[m>>2]>>2]=20}if((C|0)==131){c[(c[k>>2]|0)+12>>2]=c[o>>2];c[(c[k>>2]|0)+16>>2]=c[q>>2];c[c[k>>2]>>2]=c[n>>2];c[(c[k>>2]|0)+4>>2]=c[p>>2];c[(c[m>>2]|0)+56>>2]=c[r>>2];c[(c[m>>2]|0)+60>>2]=c[s>>2];c[j>>2]=2;I=c[j>>2]|0;i=h;return I|0}else if((C|0)==142){c[r>>2]=(c[r>>2]|0)>>>2;c[s>>2]=(c[s>>2]|0)-2}else if((C|0)==304){c[r>>2]=0;c[s>>2]=0;C=305}else if((C|0)==307){c[A>>2]=-3}else if((C|0)==308){c[j>>2]=-4;I=c[j>>2]|0;i=h;return I|0}else if((C|0)==309){c[j>>2]=-2;I=c[j>>2]|0;i=h;return I|0}if((C|0)==305){c[c[m>>2]>>2]=28;C=306}if((C|0)==306){c[A>>2]=1}c[(c[k>>2]|0)+12>>2]=c[o>>2];c[(c[k>>2]|0)+16>>2]=c[q>>2];c[c[k>>2]>>2]=c[n>>2];c[(c[k>>2]|0)+4>>2]=c[p>>2];c[(c[m>>2]|0)+56>>2]=c[r>>2];c[(c[m>>2]|0)+60>>2]=c[s>>2];if((c[(c[m>>2]|0)+40>>2]|0)==0){if((c[c[m>>2]>>2]|0)>>>0<26?(c[u>>2]|0)!=(c[(c[k>>2]|0)+16>>2]|0):0){C=313}}else{C=313}if((C|0)==313?(zf(c[k>>2]|0,c[u>>2]|0)|0)!=0:0){c[c[m>>2]>>2]=30;c[j>>2]=-4;I=c[j>>2]|0;i=h;return I|0}c[t>>2]=(c[t>>2]|0)-(c[(c[k>>2]|0)+4>>2]|0);c[u>>2]=(c[u>>2]|0)-(c[(c[k>>2]|0)+16>>2]|0);D=(c[k>>2]|0)+8|0;c[D>>2]=(c[D>>2]|0)+(c[t>>2]|0);D=(c[k>>2]|0)+20|0;c[D>>2]=(c[D>>2]|0)+(c[u>>2]|0);D=(c[m>>2]|0)+28|0;c[D>>2]=(c[D>>2]|0)+(c[u>>2]|0);if((c[(c[m>>2]|0)+8>>2]|0)!=0?(c[u>>2]|0)!=0:0){D=c[(c[m>>2]|0)+24>>2]|0;g=(c[(c[k>>2]|0)+12>>2]|0)+(0-(c[u>>2]|0))|0;f=c[u>>2]|0;if((c[(c[m>>2]|0)+16>>2]|0)!=0){J=pf(D,g,f)|0}else{J=of(D,g,f)|0}c[(c[m>>2]|0)+24>>2]=J;c[(c[k>>2]|0)+48>>2]=J}if((c[c[m>>2]>>2]|0)==19){K=1}else{K=(c[c[m>>2]>>2]|0)==14}c[(c[k>>2]|0)+44>>2]=(c[(c[m>>2]|0)+60>>2]|0)+((c[(c[m>>2]|0)+4>>2]|0)!=0?64:0)+((c[c[m>>2]>>2]|0)==11?128:0)+(K?256:0);if((c[t>>2]|0)==0?(c[u>>2]|0)==0:0){C=326}else{C=325}if((C|0)==325?(c[l>>2]|0)==4:0){C=326}if((C|0)==326?(c[A>>2]|0)==0:0){c[A>>2]=-5}c[j>>2]=c[A>>2];I=c[j>>2]|0;i=h;return I|0}}while(0);c[j>>2]=-2;I=c[j>>2]|0;i=h;return I|0}function yf(a){a=a|0;var b=0,d=0;b=i;i=i+16|0;d=b;c[d>>2]=a;c[(c[d>>2]|0)+76>>2]=12504;c[(c[d>>2]|0)+84>>2]=9;c[(c[d>>2]|0)+80>>2]=14552;c[(c[d>>2]|0)+88>>2]=5;i=b;return}function zf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+32|0;e=d+20|0;f=d+16|0;g=d+12|0;h=d+8|0;j=d+4|0;k=d;c[f>>2]=a;c[g>>2]=b;c[h>>2]=c[(c[f>>2]|0)+28>>2];if((c[(c[h>>2]|0)+52>>2]|0)==0?(b=Gc[c[(c[f>>2]|0)+32>>2]&31](c[(c[f>>2]|0)+40>>2]|0,1<<c[(c[h>>2]|0)+36>>2],1)|0,c[(c[h>>2]|0)+52>>2]=b,(c[(c[h>>2]|0)+52>>2]|0)==0):0){c[e>>2]=1;l=c[e>>2]|0;i=d;return l|0}if((c[(c[h>>2]|0)+40>>2]|0)==0){c[(c[h>>2]|0)+40>>2]=1<<c[(c[h>>2]|0)+36>>2];c[(c[h>>2]|0)+48>>2]=0;c[(c[h>>2]|0)+44>>2]=0}c[j>>2]=(c[g>>2]|0)-(c[(c[f>>2]|0)+16>>2]|0);g=c[h>>2]|0;do{if(!((c[j>>2]|0)>>>0>=(c[(c[h>>2]|0)+40>>2]|0)>>>0)){c[k>>2]=(c[g+40>>2]|0)-(c[(c[h>>2]|0)+48>>2]|0);if((c[k>>2]|0)>>>0>(c[j>>2]|0)>>>0){c[k>>2]=c[j>>2]}tp((c[(c[h>>2]|0)+52>>2]|0)+(c[(c[h>>2]|0)+48>>2]|0)|0,(c[(c[f>>2]|0)+12>>2]|0)+(0-(c[j>>2]|0))|0,c[k>>2]|0)|0;c[j>>2]=(c[j>>2]|0)-(c[k>>2]|0);if((c[j>>2]|0)!=0){tp(c[(c[h>>2]|0)+52>>2]|0,(c[(c[f>>2]|0)+12>>2]|0)+(0-(c[j>>2]|0))|0,c[j>>2]|0)|0;c[(c[h>>2]|0)+48>>2]=c[j>>2];c[(c[h>>2]|0)+44>>2]=c[(c[h>>2]|0)+40>>2];break}b=(c[h>>2]|0)+48|0;c[b>>2]=(c[b>>2]|0)+(c[k>>2]|0);if((c[(c[h>>2]|0)+48>>2]|0)==(c[(c[h>>2]|0)+40>>2]|0)){c[(c[h>>2]|0)+48>>2]=0}if((c[(c[h>>2]|0)+44>>2]|0)>>>0<(c[(c[h>>2]|0)+40>>2]|0)>>>0){b=(c[h>>2]|0)+44|0;c[b>>2]=(c[b>>2]|0)+(c[k>>2]|0)}}else{tp(c[g+52>>2]|0,(c[(c[f>>2]|0)+12>>2]|0)+(0-(c[(c[h>>2]|0)+40>>2]|0))|0,c[(c[h>>2]|0)+40>>2]|0)|0;c[(c[h>>2]|0)+48>>2]=0;c[(c[h>>2]|0)+44>>2]=c[(c[h>>2]|0)+40>>2]}}while(0);c[e>>2]=0;l=c[e>>2]|0;i=d;return l|0}function Af(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;i=i+16|0;d=b+8|0;e=b+4|0;f=b;c[e>>2]=a;if(((c[e>>2]|0)!=0?(c[(c[e>>2]|0)+28>>2]|0)!=0:0)?(c[(c[e>>2]|0)+36>>2]|0)!=0:0){c[f>>2]=c[(c[e>>2]|0)+28>>2];if((c[(c[f>>2]|0)+52>>2]|0)!=0){Lc[c[(c[e>>2]|0)+36>>2]&63](c[(c[e>>2]|0)+40>>2]|0,c[(c[f>>2]|0)+52>>2]|0)}Lc[c[(c[e>>2]|0)+36>>2]&63](c[(c[e>>2]|0)+40>>2]|0,c[(c[e>>2]|0)+28>>2]|0);c[(c[e>>2]|0)+28>>2]=0;c[d>>2]=0;g=c[d>>2]|0;i=b;return g|0}c[d>>2]=-2;g=c[d>>2]|0;i=b;return g|0}function Bf(d,f,g,h,j,k){d=d|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0;l=i;i=i+176|0;m=l+96|0;n=l+92|0;o=l+88|0;p=l+84|0;q=l+80|0;r=l+76|0;s=l+72|0;t=l+68|0;u=l+64|0;v=l+60|0;w=l+56|0;x=l+52|0;y=l+48|0;z=l+44|0;A=l+40|0;B=l+36|0;C=l+32|0;D=l+28|0;E=l+24|0;F=l+20|0;G=l+16|0;H=l+168|0;I=l+12|0;J=l+8|0;K=l+4|0;L=l;M=l+136|0;N=l+104|0;c[n>>2]=d;c[o>>2]=f;c[p>>2]=g;c[q>>2]=h;c[r>>2]=j;c[s>>2]=k;c[t>>2]=0;while(1){if(!((c[t>>2]|0)>>>0<=15)){break}b[M+(c[t>>2]<<1)>>1]=0;c[t>>2]=(c[t>>2]|0)+1}c[u>>2]=0;while(1){if(!((c[u>>2]|0)>>>0<(c[p>>2]|0)>>>0)){break}k=M+((e[(c[o>>2]|0)+(c[u>>2]<<1)>>1]|0)<<1)|0;b[k>>1]=(b[k>>1]|0)+1<<16>>16;c[u>>2]=(c[u>>2]|0)+1}c[x>>2]=c[c[r>>2]>>2];c[w>>2]=15;while(1){if(!((c[w>>2]|0)>>>0>=1)){break}if((e[M+(c[w>>2]<<1)>>1]|0|0)!=0){break}c[w>>2]=(c[w>>2]|0)+ -1}if((c[x>>2]|0)>>>0>(c[w>>2]|0)>>>0){c[x>>2]=c[w>>2]}if((c[w>>2]|0)==0){a[H]=64;a[H+1|0]=1;b[H+2>>1]=0;k=c[q>>2]|0;j=c[k>>2]|0;c[k>>2]=j+4;b[j+0>>1]=b[H+0>>1]|0;b[j+2>>1]=b[H+2>>1]|0;j=c[q>>2]|0;k=c[j>>2]|0;c[j>>2]=k+4;b[k+0>>1]=b[H+0>>1]|0;b[k+2>>1]=b[H+2>>1]|0;c[c[r>>2]>>2]=1;c[m>>2]=0;O=c[m>>2]|0;i=l;return O|0}c[v>>2]=1;while(1){if(!((c[v>>2]|0)>>>0<(c[w>>2]|0)>>>0)){break}if((e[M+(c[v>>2]<<1)>>1]|0|0)!=0){break}c[v>>2]=(c[v>>2]|0)+1}if((c[x>>2]|0)>>>0<(c[v>>2]|0)>>>0){c[x>>2]=c[v>>2]}c[A>>2]=1;c[t>>2]=1;while(1){P=c[A>>2]|0;if(!((c[t>>2]|0)>>>0<=15)){break}c[A>>2]=P<<1;c[A>>2]=(c[A>>2]|0)-(e[M+(c[t>>2]<<1)>>1]|0);if((c[A>>2]|0)<0){Q=24;break}c[t>>2]=(c[t>>2]|0)+1}if((Q|0)==24){c[m>>2]=-1;O=c[m>>2]|0;i=l;return O|0}do{if((P|0)>0){if((c[n>>2]|0)!=0?(c[w>>2]|0)==1:0){break}c[m>>2]=-1;O=c[m>>2]|0;i=l;return O|0}}while(0);b[N+2>>1]=0;c[t>>2]=1;while(1){if(!((c[t>>2]|0)>>>0<15)){break}b[N+((c[t>>2]|0)+1<<1)>>1]=(e[N+(c[t>>2]<<1)>>1]|0)+(e[M+(c[t>>2]<<1)>>1]|0);c[t>>2]=(c[t>>2]|0)+1}c[u>>2]=0;while(1){if(!((c[u>>2]|0)>>>0<(c[p>>2]|0)>>>0)){break}if((e[(c[o>>2]|0)+(c[u>>2]<<1)>>1]|0|0)!=0){P=c[u>>2]&65535;k=N+((e[(c[o>>2]|0)+(c[u>>2]<<1)>>1]|0)<<1)|0;j=b[k>>1]|0;b[k>>1]=j+1<<16>>16;b[(c[s>>2]|0)+((j&65535)<<1)>>1]=P}c[u>>2]=(c[u>>2]|0)+1}N=c[n>>2]|0;if((N|0)==0){p=c[s>>2]|0;c[K>>2]=p;c[J>>2]=p;c[L>>2]=19}else if((N|0)==1){c[J>>2]=14680;c[J>>2]=(c[J>>2]|0)+ -514;c[K>>2]=14744;c[K>>2]=(c[K>>2]|0)+ -514;c[L>>2]=256}else{c[J>>2]=14808;c[K>>2]=14872;c[L>>2]=-1}c[C>>2]=0;c[u>>2]=0;c[t>>2]=c[v>>2];c[I>>2]=c[c[q>>2]>>2];c[y>>2]=c[x>>2];c[z>>2]=0;c[F>>2]=-1;c[B>>2]=1<<c[x>>2];c[G>>2]=(c[B>>2]|0)-1;if(!((c[n>>2]|0)==1?(c[B>>2]|0)>>>0>=852:0)){Q=44}do{if((Q|0)==44){if((c[n>>2]|0)==2?(c[B>>2]|0)>>>0>=592:0){break}while(1){a[H+1|0]=(c[t>>2]|0)-(c[z>>2]|0);do{if((e[(c[s>>2]|0)+(c[u>>2]<<1)>>1]|0|0)>=(c[L>>2]|0)){if((e[(c[s>>2]|0)+(c[u>>2]<<1)>>1]|0|0)>(c[L>>2]|0)){a[H]=b[(c[K>>2]|0)+((e[(c[s>>2]|0)+(c[u>>2]<<1)>>1]|0)<<1)>>1];b[H+2>>1]=b[(c[J>>2]|0)+((e[(c[s>>2]|0)+(c[u>>2]<<1)>>1]|0)<<1)>>1]|0;break}else{a[H]=96;b[H+2>>1]=0;break}}else{a[H]=0;b[H+2>>1]=b[(c[s>>2]|0)+(c[u>>2]<<1)>>1]|0}}while(0);c[D>>2]=1<<(c[t>>2]|0)-(c[z>>2]|0);c[E>>2]=1<<c[y>>2];c[v>>2]=c[E>>2];do{c[E>>2]=(c[E>>2]|0)-(c[D>>2]|0);N=(c[I>>2]|0)+(((c[C>>2]|0)>>>(c[z>>2]|0))+(c[E>>2]|0)<<2)|0;b[N+0>>1]=b[H+0>>1]|0;b[N+2>>1]=b[H+2>>1]|0}while((c[E>>2]|0)!=0);c[D>>2]=1<<(c[t>>2]|0)-1;while(1){R=c[D>>2]|0;if((c[C>>2]&c[D>>2]|0)==0){break}c[D>>2]=R>>>1}if((R|0)!=0){c[C>>2]=c[C>>2]&(c[D>>2]|0)-1;c[C>>2]=(c[C>>2]|0)+(c[D>>2]|0)}else{c[C>>2]=0}c[u>>2]=(c[u>>2]|0)+1;N=M+(c[t>>2]<<1)|0;p=(b[N>>1]|0)+ -1<<16>>16;b[N>>1]=p;if((p&65535|0)==0){if((c[t>>2]|0)==(c[w>>2]|0)){break}c[t>>2]=e[(c[o>>2]|0)+((e[(c[s>>2]|0)+(c[u>>2]<<1)>>1]|0)<<1)>>1]|0}if(!((c[t>>2]|0)>>>0>(c[x>>2]|0)>>>0)){continue}if((c[C>>2]&c[G>>2]|0)==(c[F>>2]|0)){continue}if((c[z>>2]|0)==0){c[z>>2]=c[x>>2]}c[I>>2]=(c[I>>2]|0)+(c[v>>2]<<2);c[y>>2]=(c[t>>2]|0)-(c[z>>2]|0);c[A>>2]=1<<c[y>>2];while(1){if(!(((c[y>>2]|0)+(c[z>>2]|0)|0)>>>0<(c[w>>2]|0)>>>0)){break}c[A>>2]=(c[A>>2]|0)-(e[M+((c[y>>2]|0)+(c[z>>2]|0)<<1)>>1]|0);if((c[A>>2]|0)<=0){break}c[y>>2]=(c[y>>2]|0)+1;c[A>>2]=c[A>>2]<<1}c[B>>2]=(c[B>>2]|0)+(1<<c[y>>2]);if((c[n>>2]|0)==1?(c[B>>2]|0)>>>0>=852:0){Q=75;break}if((c[n>>2]|0)==2?(c[B>>2]|0)>>>0>=592:0){Q=75;break}c[F>>2]=c[C>>2]&c[G>>2];a[(c[c[q>>2]>>2]|0)+(c[F>>2]<<2)|0]=c[y>>2];a[(c[c[q>>2]>>2]|0)+(c[F>>2]<<2)+1|0]=c[x>>2];b[(c[c[q>>2]>>2]|0)+(c[F>>2]<<2)+2>>1]=((c[I>>2]|0)-(c[c[q>>2]>>2]|0)|0)/4|0}if((Q|0)==75){c[m>>2]=1;O=c[m>>2]|0;i=l;return O|0}a[H]=64;a[H+1|0]=(c[t>>2]|0)-(c[z>>2]|0);b[H+2>>1]=0;while(1){if((c[C>>2]|0)==0){break}if((c[z>>2]|0)!=0?(c[C>>2]&c[G>>2]|0)!=(c[F>>2]|0):0){c[z>>2]=0;c[t>>2]=c[x>>2];c[I>>2]=c[c[q>>2]>>2];a[H+1|0]=c[t>>2]}p=(c[I>>2]|0)+((c[C>>2]|0)>>>(c[z>>2]|0)<<2)|0;b[p+0>>1]=b[H+0>>1]|0;b[p+2>>1]=b[H+2>>1]|0;c[D>>2]=1<<(c[t>>2]|0)-1;while(1){S=c[D>>2]|0;if((c[C>>2]&c[D>>2]|0)==0){break}c[D>>2]=S>>>1}if((S|0)!=0){c[C>>2]=c[C>>2]&(c[D>>2]|0)-1;c[C>>2]=(c[C>>2]|0)+(c[D>>2]|0);continue}else{c[C>>2]=0;continue}}p=c[q>>2]|0;c[p>>2]=(c[p>>2]|0)+(c[B>>2]<<2);c[c[r>>2]>>2]=c[x>>2];c[m>>2]=0;O=c[m>>2]|0;i=l;return O|0}}while(0);c[m>>2]=1;O=c[m>>2]|0;i=l;return O|0}function Cf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+16|0;f=e+8|0;g=e+4|0;h=e;c[f>>2]=a;c[g>>2]=b;c[h>>2]=d;if((c[f>>2]|0)!=0){c[g>>2]=(c[g>>2]|0)+((c[h>>2]|0)-(c[h>>2]|0))}f=Vo(ea(c[g>>2]|0,c[h>>2]|0)|0)|0;i=e;return f|0}function Df(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;i=i+16|0;e=d;c[d+4>>2]=a;c[e>>2]=b;Wo(c[e>>2]|0);i=d;return}function Ef(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;b=i;i=i+16|0;d=b;e=c[r>>2]|0;_f(15648,e,15704);c[3734]=17076;c[14944>>2]=17096;c[14940>>2]=0;bh(14944|0,15648);c[15016>>2]=0;c[15020>>2]=-1;f=c[s>>2]|0;c[3938]=16944;em(15756|0);c[15760>>2]=0;c[15764>>2]=0;c[15768>>2]=0;c[15772>>2]=0;c[15776>>2]=0;c[15780>>2]=0;c[3938]=16264;c[15784>>2]=f;fm(d,15756|0);g=hm(d,19736)|0;gm(d);c[15788>>2]=g;c[15792>>2]=15712;h=(Nc[c[(c[g>>2]|0)+28>>2]&127](g)|0)&1;a[15796|0]=h;c[3756]=17156;c[15028>>2]=17176;bh(15028|0,15752);c[15100>>2]=0;c[15104>>2]=-1;h=c[q>>2]|0;c[3950]=16944;em(15804|0);c[15808>>2]=0;c[15812>>2]=0;c[15816>>2]=0;c[15820>>2]=0;c[15824>>2]=0;c[15828>>2]=0;c[3950]=16264;c[15832>>2]=h;fm(d,15804|0);g=hm(d,19736)|0;gm(d);c[15836>>2]=g;c[15840>>2]=15720;j=(Nc[c[(c[g>>2]|0)+28>>2]&127](g)|0)&1;a[15844|0]=j;c[3778]=17156;c[15116>>2]=17176;bh(15116|0,15800);c[15188>>2]=0;c[15192>>2]=-1;j=c[(c[(c[3778]|0)+ -12>>2]|0)+15136>>2]|0;c[3800]=17156;c[15204>>2]=17176;bh(15204|0,j);c[15276>>2]=0;c[15280>>2]=-1;c[(c[(c[3734]|0)+ -12>>2]|0)+15008>>2]=15024;j=(c[(c[3778]|0)+ -12>>2]|0)+15116|0;c[j>>2]=c[j>>2]|8192;c[(c[(c[3778]|0)+ -12>>2]|0)+15184>>2]=15024;Mf(15848,e,15728|0);c[3822]=17116;c[15296>>2]=17136;c[15292>>2]=0;bh(15296|0,15848);c[15368>>2]=0;c[15372>>2]=-1;c[3976]=17008;em(15908|0);c[15912>>2]=0;c[15916>>2]=0;c[15920>>2]=0;c[15924>>2]=0;c[15928>>2]=0;c[15932>>2]=0;c[3976]=16008;c[15936>>2]=f;fm(d,15908|0);f=hm(d,19744)|0;gm(d);c[15940>>2]=f;c[15944>>2]=15736;e=(Nc[c[(c[f>>2]|0)+28>>2]&127](f)|0)&1;a[15948|0]=e;c[3844]=17196;c[15380>>2]=17216;bh(15380|0,15904);c[15452>>2]=0;c[15456>>2]=-1;c[3988]=17008;em(15956|0);c[15960>>2]=0;c[15964>>2]=0;c[15968>>2]=0;c[15972>>2]=0;c[15976>>2]=0;c[15980>>2]=0;c[3988]=16008;c[15984>>2]=h;fm(d,15956|0);h=hm(d,19744)|0;gm(d);c[15988>>2]=h;c[15992>>2]=15744;d=(Nc[c[(c[h>>2]|0)+28>>2]&127](h)|0)&1;a[15996|0]=d;c[3866]=17196;c[15468>>2]=17216;bh(15468|0,15952);c[15540>>2]=0;c[15544>>2]=-1;d=c[(c[(c[3866]|0)+ -12>>2]|0)+15488>>2]|0;c[3888]=17196;c[15556>>2]=17216;bh(15556|0,d);c[15628>>2]=0;c[15632>>2]=-1;c[(c[(c[3822]|0)+ -12>>2]|0)+15360>>2]=15376;d=(c[(c[3866]|0)+ -12>>2]|0)+15468|0;c[d>>2]=c[d>>2]|8192;c[(c[(c[3866]|0)+ -12>>2]|0)+15536>>2]=15376;i=b;return}function Ff(a){a=a|0;a=i;Ih(15024)|0;Ih(15200)|0;Nh(15376)|0;Nh(15552)|0;i=a;return}function Gf(a){a=a|0;var b=0;b=i;c[a>>2]=17008;gm(a+4|0);i=b;return}function Hf(a){a=a|0;var b=0;b=i;c[a>>2]=17008;gm(a+4|0);ap(a);i=b;return}function If(b,d){b=b|0;d=d|0;var e=0,f=0;e=i;Nc[c[(c[b>>2]|0)+24>>2]&127](b)|0;f=hm(d,19744)|0;c[b+36>>2]=f;d=(Nc[c[(c[f>>2]|0)+28>>2]&127](f)|0)&1;a[b+44|0]=d;i=e;return}function Jf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;i=i+16|0;d=b+8|0;e=b;f=a+36|0;g=a+40|0;h=d+8|0;j=d;k=a+32|0;while(1){a=c[f>>2]|0;l=Xc[c[(c[a>>2]|0)+20>>2]&15](a,c[g>>2]|0,d,h,e)|0;a=(c[e>>2]|0)-j|0;if((yb(d|0,1,a|0,c[k>>2]|0)|0)!=(a|0)){m=-1;n=5;break}if((l|0)==2){m=-1;n=5;break}else if((l|0)!=1){n=4;break}}if((n|0)==4){m=((ec(c[k>>2]|0)|0)!=0)<<31>>31;i=b;return m|0}else if((n|0)==5){i=b;return m|0}return 0}function Kf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;a:do{if((a[b+44|0]|0)==0){if((e|0)>0){g=d;h=0;while(1){if((Wc[c[(c[b>>2]|0)+52>>2]&15](b,c[g>>2]|0)|0)==-1){j=h;break a}k=h+1|0;if((k|0)<(e|0)){g=g+4|0;h=k}else{j=k;break}}}else{j=0}}else{j=yb(d|0,4,e|0,c[b+32>>2]|0)|0}}while(0);i=f;return j|0}function Lf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;e=i;i=i+32|0;f=e+16|0;g=e+8|0;h=e+4|0;j=e;k=(d|0)==-1;a:do{if(!k){c[g>>2]=d;if((a[b+44|0]|0)!=0){if((yb(g|0,4,1,c[b+32>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}c[h>>2]=f;m=g+4|0;n=b+36|0;o=b+40|0;p=f+8|0;q=f;r=b+32|0;s=g;while(1){t=c[n>>2]|0;u=Sc[c[(c[t>>2]|0)+12>>2]&15](t,c[o>>2]|0,s,m,j,f,p,h)|0;if((c[j>>2]|0)==(s|0)){l=-1;v=12;break}if((u|0)==3){v=7;break}t=(u|0)==1;if(!(u>>>0<2)){l=-1;v=12;break}u=(c[h>>2]|0)-q|0;if((yb(f|0,1,u|0,c[r>>2]|0)|0)!=(u|0)){l=-1;v=12;break}if(t){s=t?c[j>>2]|0:s}else{break a}}if((v|0)==7){if((yb(s|0,1,1,c[r>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}else if((v|0)==12){i=e;return l|0}}}while(0);l=k?0:d;i=e;return l|0}function Mf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;i=i+16|0;g=f;c[b>>2]=17008;h=b+4|0;em(h);j=b+8|0;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;c[j+16>>2]=0;c[j+20>>2]=0;c[b>>2]=16120;c[b+32>>2]=d;c[b+40>>2]=e;c[b+48>>2]=-1;a[b+52|0]=0;fm(g,h);h=hm(g,19744)|0;e=b+36|0;c[e>>2]=h;d=Nc[c[(c[h>>2]|0)+24>>2]&127](h)|0;h=b+44|0;c[h>>2]=d;d=c[e>>2]|0;e=(Nc[c[(c[d>>2]|0)+28>>2]&127](d)|0)&1;a[b+53|0]=e;if((c[h>>2]|0)>8){rl(16216)}else{gm(g);i=f;return}}function Nf(a){a=a|0;var b=0;b=i;c[a>>2]=17008;gm(a+4|0);i=b;return}function Of(a){a=a|0;var b=0;b=i;c[a>>2]=17008;gm(a+4|0);ap(a);i=b;return}function Pf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=i;f=hm(d,19744)|0;d=b+36|0;c[d>>2]=f;g=Nc[c[(c[f>>2]|0)+24>>2]&127](f)|0;f=b+44|0;c[f>>2]=g;g=c[d>>2]|0;d=(Nc[c[(c[g>>2]|0)+28>>2]&127](g)|0)&1;a[b+53|0]=d;if((c[f>>2]|0)>8){rl(16216)}else{i=e;return}}function Qf(a){a=a|0;var b=0,c=0;b=i;c=Tf(a,0)|0;i=b;return c|0}function Rf(a){a=a|0;var b=0,c=0;b=i;c=Tf(a,1)|0;i=b;return c|0}function Sf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;e=i;i=i+32|0;f=e+16|0;g=e+8|0;h=e+4|0;j=e;k=b+52|0;l=(a[k]|0)!=0;if((d|0)==-1){if(l){m=-1;i=e;return m|0}n=c[b+48>>2]|0;a[k]=(n|0)!=-1|0;m=n;i=e;return m|0}n=b+48|0;a:do{if(l){c[h>>2]=c[n>>2];o=c[b+36>>2]|0;p=Sc[c[(c[o>>2]|0)+12>>2]&15](o,c[b+40>>2]|0,h,h+4|0,j,f,f+8|0,g)|0;if((p|0)==3){a[f]=c[n>>2];c[g>>2]=f+1}else if((p|0)==1|(p|0)==2){m=-1;i=e;return m|0}p=b+32|0;while(1){o=c[g>>2]|0;if(!(o>>>0>f>>>0)){break a}q=o+ -1|0;c[g>>2]=q;if((dc(a[q]|0,c[p>>2]|0)|0)==-1){m=-1;break}}i=e;return m|0}}while(0);c[n>>2]=d;a[k]=1;m=d;i=e;return m|0}function Tf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;e=i;i=i+32|0;f=e+16|0;g=e+8|0;h=e+4|0;j=e;k=b+52|0;if((a[k]|0)!=0){l=b+48|0;m=c[l>>2]|0;if(!d){n=m;i=e;return n|0}c[l>>2]=-1;a[k]=0;n=m;i=e;return n|0}m=c[b+44>>2]|0;k=(m|0)>1?m:1;a:do{if((k|0)>0){m=b+32|0;l=0;while(1){o=Tb(c[m>>2]|0)|0;if((o|0)==-1){n=-1;break}a[f+l|0]=o;l=l+1|0;if((l|0)>=(k|0)){break a}}i=e;return n|0}}while(0);b:do{if((a[b+53|0]|0)==0){l=b+40|0;m=b+36|0;o=g+4|0;p=b+32|0;q=k;while(1){r=c[l>>2]|0;s=r;t=c[s>>2]|0;u=c[s+4>>2]|0;s=c[m>>2]|0;v=f+q|0;w=Sc[c[(c[s>>2]|0)+16>>2]&15](s,r,f,v,h,g,o,j)|0;if((w|0)==3){x=14;break}else if((w|0)==2){n=-1;x=22;break}else if((w|0)!=1){y=q;break b}w=c[l>>2]|0;c[w>>2]=t;c[w+4>>2]=u;if((q|0)==8){n=-1;x=22;break}u=Tb(c[p>>2]|0)|0;if((u|0)==-1){n=-1;x=22;break}a[v]=u;q=q+1|0}if((x|0)==14){c[g>>2]=a[f]|0;y=q;break}else if((x|0)==22){i=e;return n|0}}else{c[g>>2]=a[f]|0;y=k}}while(0);if(d){d=c[g>>2]|0;c[b+48>>2]=d;n=d;i=e;return n|0}d=b+32|0;b=y;while(1){if((b|0)<=0){break}y=b+ -1|0;if((dc(a[f+y|0]|0,c[d>>2]|0)|0)==-1){n=-1;x=22;break}else{b=y}}if((x|0)==22){i=e;return n|0}n=c[g>>2]|0;i=e;return n|0}function Uf(a){a=a|0;var b=0;b=i;c[a>>2]=16944;gm(a+4|0);i=b;return}function Vf(a){a=a|0;var b=0;b=i;c[a>>2]=16944;gm(a+4|0);ap(a);i=b;return}function Wf(b,d){b=b|0;d=d|0;var e=0,f=0;e=i;Nc[c[(c[b>>2]|0)+24>>2]&127](b)|0;f=hm(d,19736)|0;c[b+36>>2]=f;d=(Nc[c[(c[f>>2]|0)+28>>2]&127](f)|0)&1;a[b+44|0]=d;i=e;return}function Xf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;i=i+16|0;d=b+8|0;e=b;f=a+36|0;g=a+40|0;h=d+8|0;j=d;k=a+32|0;while(1){a=c[f>>2]|0;l=Xc[c[(c[a>>2]|0)+20>>2]&15](a,c[g>>2]|0,d,h,e)|0;a=(c[e>>2]|0)-j|0;if((yb(d|0,1,a|0,c[k>>2]|0)|0)!=(a|0)){m=-1;n=5;break}if((l|0)==2){m=-1;n=5;break}else if((l|0)!=1){n=4;break}}if((n|0)==4){m=((ec(c[k>>2]|0)|0)!=0)<<31>>31;i=b;return m|0}else if((n|0)==5){i=b;return m|0}return 0}function Yf(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0;g=i;if((a[b+44|0]|0)!=0){h=yb(e|0,1,f|0,c[b+32>>2]|0)|0;i=g;return h|0}if((f|0)>0){j=e;k=0}else{h=0;i=g;return h|0}while(1){if((Wc[c[(c[b>>2]|0)+52>>2]&15](b,d[j]|0)|0)==-1){h=k;l=6;break}e=k+1|0;if((e|0)<(f|0)){j=j+1|0;k=e}else{h=e;l=6;break}}if((l|0)==6){i=g;return h|0}return 0}function Zf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;e=i;i=i+32|0;f=e+16|0;g=e+8|0;h=e+4|0;j=e;k=(d|0)==-1;a:do{if(!k){a[g]=d;if((a[b+44|0]|0)!=0){if((yb(g|0,1,1,c[b+32>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}c[h>>2]=f;m=g+1|0;n=b+36|0;o=b+40|0;p=f+8|0;q=f;r=b+32|0;s=g;while(1){t=c[n>>2]|0;u=Sc[c[(c[t>>2]|0)+12>>2]&15](t,c[o>>2]|0,s,m,j,f,p,h)|0;if((c[j>>2]|0)==(s|0)){l=-1;v=12;break}if((u|0)==3){v=7;break}t=(u|0)==1;if(!(u>>>0<2)){l=-1;v=12;break}u=(c[h>>2]|0)-q|0;if((yb(f|0,1,u|0,c[r>>2]|0)|0)!=(u|0)){l=-1;v=12;break}if(t){s=t?c[j>>2]|0:s}else{break a}}if((v|0)==7){if((yb(s|0,1,1,c[r>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}else if((v|0)==12){i=e;return l|0}}}while(0);l=k?0:d;i=e;return l|0}function _f(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;i=i+16|0;g=f;c[b>>2]=16944;h=b+4|0;em(h);j=b+8|0;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;c[j+16>>2]=0;c[j+20>>2]=0;c[b>>2]=16376;c[b+32>>2]=d;c[b+40>>2]=e;c[b+48>>2]=-1;a[b+52|0]=0;fm(g,h);h=hm(g,19736)|0;e=b+36|0;c[e>>2]=h;d=Nc[c[(c[h>>2]|0)+24>>2]&127](h)|0;h=b+44|0;c[h>>2]=d;d=c[e>>2]|0;e=(Nc[c[(c[d>>2]|0)+28>>2]&127](d)|0)&1;a[b+53|0]=e;if((c[h>>2]|0)>8){rl(16216)}else{gm(g);i=f;return}}function $f(a){a=a|0;var b=0;b=i;c[a>>2]=16944;gm(a+4|0);i=b;return}function ag(a){a=a|0;var b=0;b=i;c[a>>2]=16944;gm(a+4|0);ap(a);i=b;return}function bg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=i;f=hm(d,19736)|0;d=b+36|0;c[d>>2]=f;g=Nc[c[(c[f>>2]|0)+24>>2]&127](f)|0;f=b+44|0;c[f>>2]=g;g=c[d>>2]|0;d=(Nc[c[(c[g>>2]|0)+28>>2]&127](g)|0)&1;a[b+53|0]=d;if((c[f>>2]|0)>8){rl(16216)}else{i=e;return}}function cg(a){a=a|0;var b=0,c=0;b=i;c=fg(a,0)|0;i=b;return c|0}function dg(a){a=a|0;var b=0,c=0;b=i;c=fg(a,1)|0;i=b;return c|0}function eg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;e=i;i=i+32|0;f=e+16|0;g=e+4|0;h=e+8|0;j=e;k=b+52|0;l=(a[k]|0)!=0;if((d|0)==-1){if(l){m=-1;i=e;return m|0}n=c[b+48>>2]|0;a[k]=(n|0)!=-1|0;m=n;i=e;return m|0}n=b+48|0;a:do{if(l){a[h]=c[n>>2];o=c[b+36>>2]|0;p=Sc[c[(c[o>>2]|0)+12>>2]&15](o,c[b+40>>2]|0,h,h+1|0,j,f,f+8|0,g)|0;if((p|0)==3){a[f]=c[n>>2];c[g>>2]=f+1}else if((p|0)==1|(p|0)==2){m=-1;i=e;return m|0}p=b+32|0;while(1){o=c[g>>2]|0;if(!(o>>>0>f>>>0)){break a}q=o+ -1|0;c[g>>2]=q;if((dc(a[q]|0,c[p>>2]|0)|0)==-1){m=-1;break}}i=e;return m|0}}while(0);c[n>>2]=d;a[k]=1;m=d;i=e;return m|0}function fg(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;f=i;i=i+32|0;g=f+16|0;h=f+8|0;j=f+4|0;k=f;l=b+52|0;if((a[l]|0)!=0){m=b+48|0;n=c[m>>2]|0;if(!e){o=n;i=f;return o|0}c[m>>2]=-1;a[l]=0;o=n;i=f;return o|0}n=c[b+44>>2]|0;l=(n|0)>1?n:1;a:do{if((l|0)>0){n=b+32|0;m=0;while(1){p=Tb(c[n>>2]|0)|0;if((p|0)==-1){o=-1;break}a[g+m|0]=p;m=m+1|0;if((m|0)>=(l|0)){break a}}i=f;return o|0}}while(0);b:do{if((a[b+53|0]|0)==0){m=b+40|0;n=b+36|0;p=h+1|0;q=b+32|0;r=l;while(1){s=c[m>>2]|0;t=s;u=c[t>>2]|0;v=c[t+4>>2]|0;t=c[n>>2]|0;w=g+r|0;x=Sc[c[(c[t>>2]|0)+16>>2]&15](t,s,g,w,j,h,p,k)|0;if((x|0)==2){o=-1;y=23;break}else if((x|0)==3){y=14;break}else if((x|0)!=1){z=r;break b}x=c[m>>2]|0;c[x>>2]=u;c[x+4>>2]=v;if((r|0)==8){o=-1;y=23;break}v=Tb(c[q>>2]|0)|0;if((v|0)==-1){o=-1;y=23;break}a[w]=v;r=r+1|0}if((y|0)==14){a[h]=a[g]|0;z=r;break}else if((y|0)==23){i=f;return o|0}}else{a[h]=a[g]|0;z=l}}while(0);do{if(!e){l=b+32|0;k=z;while(1){if((k|0)<=0){y=21;break}j=k+ -1|0;if((dc(d[g+j|0]|0,c[l>>2]|0)|0)==-1){o=-1;y=23;break}else{k=j}}if((y|0)==21){A=a[h]|0;break}else if((y|0)==23){i=f;return o|0}}else{k=a[h]|0;c[b+48>>2]=k&255;A=k}}while(0);o=A&255;i=f;return o|0}function gg(){var a=0;a=i;Ef(0);Dc(135,15640,p|0)|0;i=a;return}function hg(a){a=a|0;return}function ig(a){a=a|0;var b=0;b=a+4|0;c[b>>2]=(c[b>>2]|0)+1;return}function jg(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=a+4|0;e=c[d>>2]|0;c[d>>2]=e+ -1;if((e|0)!=0){f=0;i=b;return f|0}Jc[c[(c[a>>2]|0)+8>>2]&255](a);f=1;i=b;return f|0}function kg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;c[a>>2]=16520;e=sp(b|0)|0;f=$o(e+13|0)|0;c[f+4>>2]=e;c[f>>2]=e;g=f+12|0;c[a+4>>2]=g;c[f+8>>2]=0;tp(g|0,b|0,e+1|0)|0;i=d;return}function lg(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;c[a>>2]=16520;d=a+4|0;e=(c[d>>2]|0)+ -4|0;f=c[e>>2]|0;c[e>>2]=f+ -1;if((f+ -1|0)<0){bp((c[d>>2]|0)+ -12|0)}Ya(a|0);ap(a);i=b;return}function mg(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;c[a>>2]=16520;d=a+4|0;e=(c[d>>2]|0)+ -4|0;f=c[e>>2]|0;c[e>>2]=f+ -1;if((f+ -1|0)>=0){Ya(a|0);i=b;return}bp((c[d>>2]|0)+ -12|0);Ya(a|0);i=b;return}function ng(a){a=a|0;return c[a+4>>2]|0}function og(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;c[b>>2]=16544;if((a[d]&1)==0){f=d+1|0}else{f=c[d+8>>2]|0}d=sp(f|0)|0;g=$o(d+13|0)|0;c[g+4>>2]=d;c[g>>2]=d;h=g+12|0;c[b+4>>2]=h;c[g+8>>2]=0;tp(h|0,f|0,d+1|0)|0;i=e;return}function pg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;c[a>>2]=16544;e=sp(b|0)|0;f=$o(e+13|0)|0;c[f+4>>2]=e;c[f>>2]=e;g=f+12|0;c[a+4>>2]=g;c[f+8>>2]=0;tp(g|0,b|0,e+1|0)|0;i=d;return}function qg(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;c[a>>2]=16544;d=a+4|0;e=(c[d>>2]|0)+ -4|0;f=c[e>>2]|0;c[e>>2]=f+ -1;if((f+ -1|0)<0){bp((c[d>>2]|0)+ -12|0)}Ya(a|0);ap(a);i=b;return}function rg(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;c[a>>2]=16544;d=a+4|0;e=(c[d>>2]|0)+ -4|0;f=c[e>>2]|0;c[e>>2]=f+ -1;if((f+ -1|0)>=0){Ya(a|0);i=b;return}bp((c[d>>2]|0)+ -12|0);Ya(a|0);i=b;return}function sg(a){a=a|0;return c[a+4>>2]|0}function tg(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;c[a>>2]=16520;d=a+4|0;e=(c[d>>2]|0)+ -4|0;f=c[e>>2]|0;c[e>>2]=f+ -1;if((f+ -1|0)<0){bp((c[d>>2]|0)+ -12|0)}Ya(a|0);ap(a);i=b;return}function ug(a){a=a|0;return}function vg(a,b,d){a=a|0;b=b|0;d=d|0;c[a>>2]=d;c[a+4>>2]=b;return}function wg(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;f=e;Pc[c[(c[a>>2]|0)+12>>2]&15](f,a,b);if((c[f+4>>2]|0)!=(c[d+4>>2]|0)){g=0;i=e;return g|0}g=(c[f>>2]|0)==(c[d>>2]|0);i=e;return g|0}function xg(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;if((c[b+4>>2]|0)!=(a|0)){f=0;i=e;return f|0}f=(c[b>>2]|0)==(d|0);i=e;return f|0}function yg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;d=i;f=Bc(e|0)|0;e=sp(f|0)|0;if(e>>>0>4294967279){Eg(0)}if(e>>>0<11){a[b]=e<<1;g=b+1|0;tp(g|0,f|0,e|0)|0;h=g+e|0;a[h]=0;i=d;return}else{j=e+16&-16;k=_o(j)|0;c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=e;g=k;tp(g|0,f|0,e|0)|0;h=g+e|0;a[h]=0;i=d;return}}function zg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+16|0;g=f;h=c[d>>2]|0;if((h|0)!=0){j=a[e]|0;if((j&1)==0){k=(j&255)>>>1}else{k=c[e+4>>2]|0}if((k|0)==0){l=h}else{Og(e,16696,2)|0;l=c[d>>2]|0}h=c[d+4>>2]|0;Pc[c[(c[h>>2]|0)+24>>2]&15](g,h,l);l=a[g]|0;if((l&1)==0){m=g+1|0;n=(l&255)>>>1}else{m=c[g+8>>2]|0;n=c[g+4>>2]|0}Og(e,m,n)|0;if(!((a[g]&1)==0)){ap(c[g+8>>2]|0)}}c[b+0>>2]=c[e+0>>2];c[b+4>>2]=c[e+4>>2];c[b+8>>2]=c[e+8>>2];c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;i=f;return}function Ag(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+32|0;g=f+12|0;h=f;j=sp(e|0)|0;if(j>>>0>4294967279){Eg(0)}if(j>>>0<11){a[h]=j<<1;k=h+1|0}else{l=j+16&-16;m=_o(l)|0;c[h+8>>2]=m;c[h>>2]=l|1;c[h+4>>2]=j;k=m}tp(k|0,e|0,j|0)|0;a[k+j|0]=0;zg(g,d,h);og(b,g);if(!((a[g]&1)==0)){ap(c[g+8>>2]|0)}if(!((a[h]&1)==0)){ap(c[h+8>>2]|0)}c[b>>2]=16712;h=d;d=c[h+4>>2]|0;g=b+8|0;c[g>>2]=c[h>>2];c[g+4>>2]=d;i=f;return}function Bg(a){a=a|0;var b=0;b=i;rg(a);ap(a);i=b;return}function Cg(a){a=a|0;var b=0;b=i;rg(a);i=b;return}function Dg(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=i;Ab(16848)|0;if((c[a>>2]|0)==1){do{$b(16872,16848)|0}while((c[a>>2]|0)==1)}if((c[a>>2]|0)==0){c[a>>2]=1;sc(16848)|0;Jc[d&255](b);Ab(16848)|0;c[a>>2]=-1;sc(16848)|0;Rb(16872)|0;i=e;return}else{sc(16848)|0;i=e;return}}function Eg(a){a=a|0;a=Fb(8)|0;kg(a,16920);c[a>>2]=16600;zc(a|0,16640,31)}function Fg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;if((a[d]&1)==0){c[b+0>>2]=c[d+0>>2];c[b+4>>2]=c[d+4>>2];c[b+8>>2]=c[d+8>>2];i=e;return}f=c[d+8>>2]|0;g=c[d+4>>2]|0;if(g>>>0>4294967279){Eg(0)}if(g>>>0<11){a[b]=g<<1;h=b+1|0}else{d=g+16&-16;j=_o(d)|0;c[b+8>>2]=j;c[b>>2]=d|1;c[b+4>>2]=g;h=j}tp(h|0,f|0,g|0)|0;a[h+g|0]=0;i=e;return}function Gg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;if(e>>>0>4294967279){Eg(0)}if(e>>>0<11){a[b]=e<<1;g=b+1|0}else{h=e+16&-16;j=_o(h)|0;c[b+8>>2]=j;c[b>>2]=h|1;c[b+4>>2]=e;g=j}tp(g|0,d|0,e|0)|0;a[g+e|0]=0;i=f;return}function Hg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;if(d>>>0>4294967279){Eg(0)}if(d>>>0<11){a[b]=d<<1;g=b+1|0}else{h=d+16&-16;j=_o(h)|0;c[b+8>>2]=j;c[b>>2]=h|1;c[b+4>>2]=d;g=j}vp(g|0,e|0,d|0)|0;a[g+d|0]=0;i=f;return}function Ig(b){b=b|0;var d=0;d=i;if((a[b]&1)==0){i=d;return}ap(c[b+8>>2]|0);i=d;return}function Jg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;f=sp(d|0)|0;g=a[b]|0;if((g&1)==0){h=g;j=10}else{g=c[b>>2]|0;h=g&255;j=(g&-2)+ -1|0}g=(h&1)==0;if(j>>>0<f>>>0){if(g){k=(h&255)>>>1}else{k=c[b+4>>2]|0}Pg(b,j,f-j|0,k,0,k,f,d);i=e;return b|0}if(g){l=b+1|0}else{l=c[b+8>>2]|0}up(l|0,d|0,f|0)|0;a[l+f|0]=0;if((a[b]&1)==0){a[b]=f<<1;i=e;return b|0}else{c[b+4>>2]=f;i=e;return b|0}return 0}function Kg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;g=a[b]|0;h=(g&1)==0;if(h){j=(g&255)>>>1}else{j=c[b+4>>2]|0}if(j>>>0<d>>>0){Lg(b,d-j|0,e)|0;i=f;return}if(h){a[b+d+1|0]=0;a[b]=d<<1;i=f;return}else{a[(c[b+8>>2]|0)+d|0]=0;c[b+4>>2]=d;i=f;return}}function Lg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;if((d|0)==0){i=f;return b|0}g=a[b]|0;if((g&1)==0){h=10;j=g}else{g=c[b>>2]|0;h=(g&-2)+ -1|0;j=g&255}if((j&1)==0){k=(j&255)>>>1}else{k=c[b+4>>2]|0}if((h-k|0)>>>0<d>>>0){Qg(b,h,d-h+k|0,k,k,0,0);l=a[b]|0}else{l=j}if((l&1)==0){m=b+1|0}else{m=c[b+8>>2]|0}vp(m+k|0,e|0,d|0)|0;e=k+d|0;if((a[b]&1)==0){a[b]=e<<1}else{c[b+4>>2]=e}a[m+e|0]=0;i=f;return b|0}function Mg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;e=i;if(d>>>0>4294967279){Eg(0)}f=a[b]|0;if((f&1)==0){g=10;h=f}else{f=c[b>>2]|0;g=(f&-2)+ -1|0;h=f&255}if((h&1)==0){j=(h&255)>>>1}else{j=c[b+4>>2]|0}f=j>>>0>d>>>0?j:d;if(f>>>0<11){k=10}else{k=(f+16&-16)+ -1|0}if((k|0)==(g|0)){i=e;return}do{if((k|0)!=10){f=k+1|0;if(k>>>0>g>>>0){l=_o(f)|0}else{l=_o(f)|0}if((h&1)==0){m=l;n=1;o=b+1|0;p=0;break}else{m=l;n=1;o=c[b+8>>2]|0;p=1;break}}else{m=b+1|0;n=0;o=c[b+8>>2]|0;p=1}}while(0);if((h&1)==0){q=(h&255)>>>1}else{q=c[b+4>>2]|0}tp(m|0,o|0,q+1|0)|0;if(p){ap(o)}if(n){c[b>>2]=k+1|1;c[b+4>>2]=j;c[b+8>>2]=m;i=e;return}else{a[b]=j<<1;i=e;return}}function Ng(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;f=a[b]|0;g=(f&1)!=0;if(g){h=(c[b>>2]&-2)+ -1|0;j=c[b+4>>2]|0}else{h=10;j=(f&255)>>>1}if((j|0)==(h|0)){Qg(b,h,1,h,h,0,0);if((a[b]&1)==0){k=7}else{k=8}}else{if(g){k=8}else{k=7}}if((k|0)==7){a[b]=(j<<1)+2;l=b+1|0;m=j+1|0;n=l+j|0;a[n]=d;o=l+m|0;a[o]=0;i=e;return}else if((k|0)==8){k=c[b+8>>2]|0;g=j+1|0;c[b+4>>2]=g;l=k;m=g;n=l+j|0;a[n]=d;o=l+m|0;a[o]=0;i=e;return}}function Og(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;g=a[b]|0;if((g&1)==0){h=10;j=g}else{g=c[b>>2]|0;h=(g&-2)+ -1|0;j=g&255}if((j&1)==0){k=(j&255)>>>1}else{k=c[b+4>>2]|0}if((h-k|0)>>>0<e>>>0){Pg(b,h,e-h+k|0,k,k,0,e,d);i=f;return b|0}if((e|0)==0){i=f;return b|0}if((j&1)==0){l=b+1|0}else{l=c[b+8>>2]|0}tp(l+k|0,d|0,e|0)|0;d=k+e|0;if((a[b]&1)==0){a[b]=d<<1}else{c[b+4>>2]=d}a[l+d|0]=0;i=f;return b|0}function Pg(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;l=i;if((-18-d|0)>>>0<e>>>0){Eg(0)}if((a[b]&1)==0){m=b+1|0}else{m=c[b+8>>2]|0}if(d>>>0<2147483623){n=e+d|0;e=d<<1;o=n>>>0<e>>>0?e:n;if(o>>>0<11){p=11}else{p=o+16&-16}}else{p=-17}o=_o(p)|0;if((g|0)!=0){tp(o|0,m|0,g|0)|0}if((j|0)!=0){tp(o+g|0,k|0,j|0)|0}k=f-h|0;if((k|0)!=(g|0)){tp(o+(j+g)|0,m+(h+g)|0,k-g|0)|0}if((d|0)==10){q=b+8|0;c[q>>2]=o;r=p|1;c[b>>2]=r;s=k+j|0;t=b+4|0;c[t>>2]=s;u=o+s|0;a[u]=0;i=l;return}ap(m);q=b+8|0;c[q>>2]=o;r=p|1;c[b>>2]=r;s=k+j|0;t=b+4|0;c[t>>2]=s;u=o+s|0;a[u]=0;i=l;return}function Qg(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0;k=i;if((-17-d|0)>>>0<e>>>0){Eg(0)}if((a[b]&1)==0){l=b+1|0}else{l=c[b+8>>2]|0}if(d>>>0<2147483623){m=e+d|0;e=d<<1;n=m>>>0<e>>>0?e:m;if(n>>>0<11){o=11}else{o=n+16&-16}}else{o=-17}n=_o(o)|0;if((g|0)!=0){tp(n|0,l|0,g|0)|0}m=f-h|0;if((m|0)!=(g|0)){tp(n+(j+g)|0,l+(h+g)|0,m-g|0)|0}if((d|0)==10){p=b+8|0;c[p>>2]=n;q=o|1;c[b>>2]=q;i=k;return}ap(l);p=b+8|0;c[p>>2]=n;q=o|1;c[b>>2]=q;i=k;return}function Rg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;if(e>>>0>1073741807){Eg(0)}if(e>>>0<2){a[b]=e<<1;g=b+4|0}else{h=e+4&-4;j=_o(h<<2)|0;c[b+8>>2]=j;c[b>>2]=h|1;c[b+4>>2]=e;g=j}wo(g,d,e)|0;c[g+(e<<2)>>2]=0;i=f;return}function Sg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;if(d>>>0>1073741807){Eg(0)}if(d>>>0<2){a[b]=d<<1;g=b+4|0}else{h=d+4&-4;j=_o(h<<2)|0;c[b+8>>2]=j;c[b>>2]=h|1;c[b+4>>2]=d;g=j}yo(g,e,d)|0;c[g+(d<<2)>>2]=0;i=f;return}function Tg(b){b=b|0;var d=0;d=i;if((a[b]&1)==0){i=d;return}ap(c[b+8>>2]|0);i=d;return}function Ug(a,b){a=a|0;b=b|0;var c=0,d=0;c=i;d=Vg(a,b,vo(b)|0)|0;i=c;return d|0}function Vg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;g=a[b]|0;if((g&1)==0){h=1;j=g}else{g=c[b>>2]|0;h=(g&-2)+ -1|0;j=g&255}g=(j&1)==0;if(h>>>0<e>>>0){if(g){k=(j&255)>>>1}else{k=c[b+4>>2]|0}Yg(b,h,e-h|0,k,0,k,e,d);i=f;return b|0}if(g){l=b+4|0}else{l=c[b+8>>2]|0}xo(l,d,e)|0;c[l+(e<<2)>>2]=0;if((a[b]&1)==0){a[b]=e<<1;i=f;return b|0}else{c[b+4>>2]=e;i=f;return b|0}return 0}function Wg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;e=i;if(d>>>0>1073741807){Eg(0)}f=a[b]|0;if((f&1)==0){g=1;h=f}else{f=c[b>>2]|0;g=(f&-2)+ -1|0;h=f&255}if((h&1)==0){j=(h&255)>>>1}else{j=c[b+4>>2]|0}f=j>>>0>d>>>0?j:d;if(f>>>0<2){k=1}else{k=(f+4&-4)+ -1|0}if((k|0)==(g|0)){i=e;return}do{if((k|0)!=1){f=(k<<2)+4|0;if(k>>>0>g>>>0){l=_o(f)|0}else{l=_o(f)|0}if((h&1)==0){m=l;n=1;o=b+4|0;p=0;break}else{m=l;n=1;o=c[b+8>>2]|0;p=1;break}}else{m=b+4|0;n=0;o=c[b+8>>2]|0;p=1}}while(0);if((h&1)==0){q=(h&255)>>>1}else{q=c[b+4>>2]|0}wo(m,o,q+1|0)|0;if(p){ap(o)}if(n){c[b>>2]=k+1|1;c[b+4>>2]=j;c[b+8>>2]=m;i=e;return}else{a[b]=j<<1;i=e;return}}function Xg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;f=a[b]|0;g=(f&1)!=0;if(g){h=(c[b>>2]&-2)+ -1|0;j=c[b+4>>2]|0}else{h=1;j=(f&255)>>>1}if((j|0)==(h|0)){Zg(b,h,1,h,h,0,0);if((a[b]&1)==0){k=7}else{k=8}}else{if(g){k=8}else{k=7}}if((k|0)==7){a[b]=(j<<1)+2;l=b+4|0;m=j+1|0;n=l+(j<<2)|0;c[n>>2]=d;o=l+(m<<2)|0;c[o>>2]=0;i=e;return}else if((k|0)==8){k=c[b+8>>2]|0;g=j+1|0;c[b+4>>2]=g;l=k;m=g;n=l+(j<<2)|0;c[n>>2]=d;o=l+(m<<2)|0;c[o>>2]=0;i=e;return}}function Yg(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;l=i;if((1073741806-d|0)>>>0<e>>>0){Eg(0)}if((a[b]&1)==0){m=b+4|0}else{m=c[b+8>>2]|0}if(d>>>0<536870887){n=e+d|0;e=d<<1;o=n>>>0<e>>>0?e:n;if(o>>>0<2){p=2}else{p=o+4&-4}}else{p=1073741807}o=_o(p<<2)|0;if((g|0)!=0){wo(o,m,g)|0}if((j|0)!=0){wo(o+(g<<2)|0,k,j)|0}k=f-h|0;if((k|0)!=(g|0)){wo(o+(j+g<<2)|0,m+(h+g<<2)|0,k-g|0)|0}if((d|0)==1){q=b+8|0;c[q>>2]=o;r=p|1;c[b>>2]=r;s=k+j|0;t=b+4|0;c[t>>2]=s;u=o+(s<<2)|0;c[u>>2]=0;i=l;return}ap(m);q=b+8|0;c[q>>2]=o;r=p|1;c[b>>2]=r;s=k+j|0;t=b+4|0;c[t>>2]=s;u=o+(s<<2)|0;c[u>>2]=0;i=l;return}function Zg(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0;k=i;if((1073741807-d|0)>>>0<e>>>0){Eg(0)}if((a[b]&1)==0){l=b+4|0}else{l=c[b+8>>2]|0}if(d>>>0<536870887){m=e+d|0;e=d<<1;n=m>>>0<e>>>0?e:m;if(n>>>0<2){o=2}else{o=n+4&-4}}else{o=1073741807}n=_o(o<<2)|0;if((g|0)!=0){wo(n,l,g)|0}m=f-h|0;if((m|0)!=(g|0)){wo(n+(j+g<<2)|0,l+(h+g<<2)|0,m-g|0)|0}if((d|0)==1){p=b+8|0;c[p>>2]=n;q=o|1;c[b>>2]=q;i=k;return}ap(l);p=b+8|0;c[p>>2]=n;q=o|1;c[b>>2]=q;i=k;return}function _g(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+16|0;f=e+8|0;g=e;h=(c[b+24>>2]|0)==0;if(h){c[b+16>>2]=d|1}else{c[b+16>>2]=d}if(((h&1|d)&c[b+20>>2]|0)==0){i=e;return}e=Fb(16)|0;if((a[17288]|0)==0?(Ga(17288)|0)!=0:0){c[4320]=17984;Dc(62,17280,p|0)|0;gb(17288)}b=g;c[b>>2]=1;c[b+4>>2]=17280;c[f+0>>2]=c[g+0>>2];c[f+4>>2]=c[g+4>>2];Ag(e,f,17336);c[e>>2]=17304;zc(e|0,17384,58)}function $g(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;c[a>>2]=17328;d=c[a+40>>2]|0;e=a+32|0;f=a+36|0;if((d|0)!=0){g=d;do{g=g+ -1|0;Pc[c[(c[e>>2]|0)+(g<<2)>>2]&15](0,a,c[(c[f>>2]|0)+(g<<2)>>2]|0)}while((g|0)!=0)}gm(a+28|0);Wo(c[e>>2]|0);Wo(c[f>>2]|0);Wo(c[a+48>>2]|0);Wo(c[a+60>>2]|0);i=b;return}function ah(a,b){a=a|0;b=b|0;var c=0;c=i;fm(a,b+28|0);i=c;return}function bh(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;c[a+24>>2]=b;c[a+16>>2]=(b|0)==0;c[a+20>>2]=0;c[a+4>>2]=4098;c[a+12>>2]=0;c[a+8>>2]=6;b=a+28|0;e=a+32|0;a=e+40|0;do{c[e>>2]=0;e=e+4|0}while((e|0)<(a|0));em(b);i=d;return}function ch(a){a=a|0;var b=0;b=i;c[a>>2]=16944;gm(a+4|0);ap(a);i=b;return}function dh(a){a=a|0;var b=0;b=i;c[a>>2]=16944;gm(a+4|0);i=b;return}function eh(a,b){a=a|0;b=b|0;return}function fh(a,b,c){a=a|0;b=b|0;c=c|0;return a|0}function gh(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;g=a;c[g>>2]=0;c[g+4>>2]=0;g=a+8|0;c[g>>2]=-1;c[g+4>>2]=-1;return}function hh(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=a;c[e>>2]=0;c[e+4>>2]=0;e=a+8|0;c[e>>2]=-1;c[e+4>>2]=-1;return}function ih(a){a=a|0;return 0}function jh(a){a=a|0;return 0}function kh(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;if((e|0)<=0){g=0;i=f;return g|0}h=b+12|0;j=b+16|0;k=d;d=0;while(1){l=c[h>>2]|0;if(l>>>0<(c[j>>2]|0)>>>0){c[h>>2]=l+1;m=a[l]|0}else{l=Nc[c[(c[b>>2]|0)+40>>2]&127](b)|0;if((l|0)==-1){g=d;n=8;break}m=l&255}a[k]=m;l=d+1|0;if((l|0)<(e|0)){k=k+1|0;d=l}else{g=l;n=8;break}}if((n|0)==8){i=f;return g|0}return 0}function lh(a){a=a|0;return-1}function mh(a){a=a|0;var b=0,e=0,f=0;b=i;if((Nc[c[(c[a>>2]|0)+36>>2]&127](a)|0)==-1){e=-1;i=b;return e|0}f=a+12|0;a=c[f>>2]|0;c[f>>2]=a+1;e=d[a]|0;i=b;return e|0}function nh(a,b){a=a|0;b=b|0;return-1}function oh(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;g=i;if((f|0)<=0){h=0;i=g;return h|0}j=b+24|0;k=b+28|0;l=e;e=0;while(1){m=c[j>>2]|0;if(!(m>>>0<(c[k>>2]|0)>>>0)){if((Wc[c[(c[b>>2]|0)+52>>2]&15](b,d[l]|0)|0)==-1){h=e;n=7;break}}else{o=a[l]|0;c[j>>2]=m+1;a[m]=o}o=e+1|0;if((o|0)<(f|0)){l=l+1|0;e=o}else{h=o;n=7;break}}if((n|0)==7){i=g;return h|0}return 0}function ph(a,b){a=a|0;b=b|0;return-1}function qh(a){a=a|0;var b=0;b=i;c[a>>2]=17008;gm(a+4|0);ap(a);i=b;return}function rh(a){a=a|0;var b=0;b=i;c[a>>2]=17008;gm(a+4|0);i=b;return}function sh(a,b){a=a|0;b=b|0;return}function th(a,b,c){a=a|0;b=b|0;c=c|0;return a|0}function uh(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;g=a;c[g>>2]=0;c[g+4>>2]=0;g=a+8|0;c[g>>2]=-1;c[g+4>>2]=-1;return}function vh(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=a;c[e>>2]=0;c[e+4>>2]=0;e=a+8|0;c[e>>2]=-1;c[e+4>>2]=-1;return}function wh(a){a=a|0;return 0}function xh(a){a=a|0;return 0}function yh(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;if((d|0)<=0){f=0;i=e;return f|0}g=a+12|0;h=a+16|0;j=b;b=0;while(1){k=c[g>>2]|0;if(!(k>>>0<(c[h>>2]|0)>>>0)){l=Nc[c[(c[a>>2]|0)+40>>2]&127](a)|0;if((l|0)==-1){f=b;m=8;break}else{n=l}}else{c[g>>2]=k+4;n=c[k>>2]|0}c[j>>2]=n;k=b+1|0;if((k|0)>=(d|0)){f=k;m=8;break}j=j+4|0;b=k}if((m|0)==8){i=e;return f|0}return 0}function zh(a){a=a|0;return-1}function Ah(a){a=a|0;var b=0,d=0,e=0;b=i;if((Nc[c[(c[a>>2]|0)+36>>2]&127](a)|0)==-1){d=-1;i=b;return d|0}e=a+12|0;a=c[e>>2]|0;c[e>>2]=a+4;d=c[a>>2]|0;i=b;return d|0}function Bh(a,b){a=a|0;b=b|0;return-1}function Ch(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;if((d|0)<=0){f=0;i=e;return f|0}g=a+24|0;h=a+28|0;j=b;b=0;while(1){k=c[g>>2]|0;if(!(k>>>0<(c[h>>2]|0)>>>0)){if((Wc[c[(c[a>>2]|0)+52>>2]&15](a,c[j>>2]|0)|0)==-1){f=b;l=8;break}}else{m=c[j>>2]|0;c[g>>2]=k+4;c[k>>2]=m}m=b+1|0;if((m|0)>=(d|0)){f=m;l=8;break}j=j+4|0;b=m}if((l|0)==8){i=e;return f|0}return 0}function Dh(a,b){a=a|0;b=b|0;return-1}function Eh(a){a=a|0;var b=0;b=i;$g(a+8|0);ap(a);i=b;return}function Fh(a){a=a|0;var b=0;b=i;$g(a+8|0);i=b;return}function Gh(a){a=a|0;var b=0,d=0;b=i;d=c[(c[a>>2]|0)+ -12>>2]|0;$g(a+(d+8)|0);ap(a+d|0);i=b;return}function Hh(a){a=a|0;var b=0;b=i;$g(a+((c[(c[a>>2]|0)+ -12>>2]|0)+8)|0);i=b;return}function Ih(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+16|0;e=d;f=c[(c[b>>2]|0)+ -12>>2]|0;if((c[b+(f+24)>>2]|0)==0){i=d;return b|0}a[e]=0;c[e+4>>2]=b;if((c[b+(f+16)>>2]|0)==0){g=c[b+(f+72)>>2]|0;if((g|0)==0){h=f}else{Ih(g)|0;h=c[(c[b>>2]|0)+ -12>>2]|0}a[e]=1;g=c[b+(h+24)>>2]|0;if((Nc[c[(c[g>>2]|0)+24>>2]&127](g)|0)==-1){g=c[(c[b>>2]|0)+ -12>>2]|0;_g(b+g|0,c[b+(g+16)>>2]|1)}}Sh(e);i=d;return b|0}function Jh(a){a=a|0;var b=0;b=i;$g(a+8|0);ap(a);i=b;return}function Kh(a){a=a|0;var b=0;b=i;$g(a+8|0);i=b;return}function Lh(a){a=a|0;var b=0,d=0;b=i;d=c[(c[a>>2]|0)+ -12>>2]|0;$g(a+(d+8)|0);ap(a+d|0);i=b;return}function Mh(a){a=a|0;var b=0;b=i;$g(a+((c[(c[a>>2]|0)+ -12>>2]|0)+8)|0);i=b;return}function Nh(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+16|0;e=d;f=c[(c[b>>2]|0)+ -12>>2]|0;if((c[b+(f+24)>>2]|0)==0){i=d;return b|0}a[e]=0;c[e+4>>2]=b;if((c[b+(f+16)>>2]|0)==0){g=c[b+(f+72)>>2]|0;if((g|0)==0){h=f}else{Nh(g)|0;h=c[(c[b>>2]|0)+ -12>>2]|0}a[e]=1;g=c[b+(h+24)>>2]|0;if((Nc[c[(c[g>>2]|0)+24>>2]&127](g)|0)==-1){g=c[(c[b>>2]|0)+ -12>>2]|0;_g(b+g|0,c[b+(g+16)>>2]|1)}}Xh(e);i=d;return b|0}function Oh(a){a=a|0;var b=0;b=i;$g(a+4|0);ap(a);i=b;return}function Ph(a){a=a|0;var b=0;b=i;$g(a+4|0);i=b;return}function Qh(a){a=a|0;var b=0,d=0;b=i;d=c[(c[a>>2]|0)+ -12>>2]|0;$g(a+(d+4)|0);ap(a+d|0);i=b;return}function Rh(a){a=a|0;var b=0;b=i;$g(a+((c[(c[a>>2]|0)+ -12>>2]|0)+4)|0);i=b;return}function Sh(a){a=a|0;var b=0,d=0,e=0;b=i;d=a+4|0;a=c[d>>2]|0;e=c[(c[a>>2]|0)+ -12>>2]|0;if((c[a+(e+24)>>2]|0)==0){i=b;return}if((c[a+(e+16)>>2]|0)!=0){i=b;return}if((c[a+(e+4)>>2]&8192|0)==0){i=b;return}if(Ja()|0){i=b;return}e=c[d>>2]|0;a=c[e+((c[(c[e>>2]|0)+ -12>>2]|0)+24)>>2]|0;if(!((Nc[c[(c[a>>2]|0)+24>>2]&127](a)|0)==-1)){i=b;return}a=c[d>>2]|0;d=c[(c[a>>2]|0)+ -12>>2]|0;_g(a+d|0,c[a+(d+16)>>2]|1);i=b;return}function Th(a){a=a|0;var b=0;b=i;$g(a+4|0);ap(a);i=b;return}function Uh(a){a=a|0;var b=0;b=i;$g(a+4|0);i=b;return}function Vh(a){a=a|0;var b=0,d=0;b=i;d=c[(c[a>>2]|0)+ -12>>2]|0;$g(a+(d+4)|0);ap(a+d|0);i=b;return}function Wh(a){a=a|0;var b=0;b=i;$g(a+((c[(c[a>>2]|0)+ -12>>2]|0)+4)|0);i=b;return}function Xh(a){a=a|0;var b=0,d=0,e=0;b=i;d=a+4|0;a=c[d>>2]|0;e=c[(c[a>>2]|0)+ -12>>2]|0;if((c[a+(e+24)>>2]|0)==0){i=b;return}if((c[a+(e+16)>>2]|0)!=0){i=b;return}if((c[a+(e+4)>>2]&8192|0)==0){i=b;return}if(Ja()|0){i=b;return}e=c[d>>2]|0;a=c[e+((c[(c[e>>2]|0)+ -12>>2]|0)+24)>>2]|0;if(!((Nc[c[(c[a>>2]|0)+24>>2]&127](a)|0)==-1)){i=b;return}a=c[d>>2]|0;d=c[(c[a>>2]|0)+ -12>>2]|0;_g(a+d|0,c[a+(d+16)>>2]|1);i=b;return}function Yh(a){a=a|0;return 17224}function Zh(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=i;if((c|0)==1){Gg(a,17240,35);i=d;return}else{yg(a,b,c);i=d;return}}function _h(a){a=a|0;return}function $h(a){a=a|0;var b=0;b=i;Cg(a);ap(a);i=b;return}function ai(a){a=a|0;var b=0;b=i;Cg(a);i=b;return}function bi(a){a=a|0;var b=0;b=i;$g(a);ap(a);i=b;return}function ci(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function di(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function ei(a){a=a|0;return}function fi(a){a=a|0;return}function gi(b,c,d,e,f){b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;a:do{if((e|0)==(f|0)){g=c;h=6}else{j=e;k=c;while(1){if((k|0)==(d|0)){l=-1;break a}m=a[k]|0;n=a[j]|0;if(m<<24>>24<n<<24>>24){l=-1;break a}if(n<<24>>24<m<<24>>24){l=1;break a}m=k+1|0;n=j+1|0;if((n|0)==(f|0)){g=m;h=6;break}else{j=n;k=m}}}}while(0);if((h|0)==6){l=(g|0)!=(d|0)|0}i=b;return l|0}function hi(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;g=e;h=f-g|0;if(h>>>0>4294967279){Eg(b)}if(h>>>0<11){a[b]=h<<1;j=b+1|0}else{k=h+16&-16;l=_o(k)|0;c[b+8>>2]=l;c[b>>2]=k|1;c[b+4>>2]=h;j=l}if((e|0)==(f|0)){m=j;a[m]=0;i=d;return}else{n=e;o=j}while(1){a[o]=a[n]|0;n=n+1|0;if((n|0)==(f|0)){break}else{o=o+1|0}}m=j+(f+(0-g))|0;a[m]=0;i=d;return}function ii(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;b=i;if((c|0)==(d|0)){e=0;i=b;return e|0}else{f=0;g=c}while(1){c=(a[g]|0)+(f<<4)|0;h=c&-268435456;j=(h>>>24|h)^c;c=g+1|0;if((c|0)==(d|0)){e=j;break}else{f=j;g=c}}i=b;return e|0}function ji(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function ki(a){a=a|0;return}function li(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;a=i;a:do{if((e|0)==(f|0)){g=b;h=6}else{j=e;k=b;while(1){if((k|0)==(d|0)){l=-1;break a}m=c[k>>2]|0;n=c[j>>2]|0;if((m|0)<(n|0)){l=-1;break a}if((n|0)<(m|0)){l=1;break a}m=k+4|0;n=j+4|0;if((n|0)==(f|0)){g=m;h=6;break}else{j=n;k=m}}}}while(0);if((h|0)==6){l=(g|0)!=(d|0)|0}i=a;return l|0}function mi(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;d=i;g=e;h=f-g|0;j=h>>2;if(j>>>0>1073741807){Eg(b)}if(j>>>0<2){a[b]=h>>>1;k=b+4|0}else{h=j+4&-4;l=_o(h<<2)|0;c[b+8>>2]=l;c[b>>2]=h|1;c[b+4>>2]=j;k=l}if((e|0)==(f|0)){m=k;c[m>>2]=0;i=d;return}l=f+ -4+(0-g)|0;g=e;e=k;while(1){c[e>>2]=c[g>>2];g=g+4|0;if((g|0)==(f|0)){break}else{e=e+4|0}}m=k+((l>>>2)+1<<2)|0;c[m>>2]=0;i=d;return}function ni(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;a=i;if((b|0)==(d|0)){e=0;i=a;return e|0}else{f=0;g=b}while(1){b=(c[g>>2]|0)+(f<<4)|0;h=b&-268435456;j=(h>>>24|h)^b;b=g+4|0;if((b|0)==(d|0)){e=j;break}else{f=j;g=b}}i=a;return e|0}function oi(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function pi(a){a=a|0;return}function qi(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;k=i;i=i+80|0;l=k;m=k+64|0;n=k+60|0;o=k+56|0;p=k+52|0;q=k+48|0;r=k+44|0;s=k+40|0;t=k+16|0;u=k+12|0;if((c[g+4>>2]&1|0)==0){c[n>>2]=-1;v=c[(c[d>>2]|0)+16>>2]|0;c[p>>2]=c[e>>2];c[q>>2]=c[f>>2];c[m+0>>2]=c[p+0>>2];c[l+0>>2]=c[q+0>>2];Kc[v&63](o,d,m,l,g,h,n);m=c[o>>2]|0;c[e>>2]=m;o=c[n>>2]|0;if((o|0)==0){a[j]=0}else if((o|0)==1){a[j]=1}else{a[j]=1;c[h>>2]=4}c[b>>2]=m;i=k;return}ah(r,g);m=c[r>>2]|0;if(!((c[4918]|0)==-1)){c[l>>2]=19672;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19672,l,137)}o=(c[19676>>2]|0)+ -1|0;n=c[m+8>>2]|0;if(!((c[m+12>>2]|0)-n>>2>>>0>o>>>0)){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}m=c[n+(o<<2)>>2]|0;if((m|0)==0){w=Fb(4)|0;Ao(w);zc(w|0,27632,123)}jg(c[r>>2]|0)|0;ah(s,g);g=c[s>>2]|0;if(!((c[4954]|0)==-1)){c[l>>2]=19816;c[l+4>>2]=136;c[l+8>>2]=0;Dg(19816,l,137)}r=(c[19820>>2]|0)+ -1|0;w=c[g+8>>2]|0;if(!((c[g+12>>2]|0)-w>>2>>>0>r>>>0)){x=Fb(4)|0;Ao(x);zc(x|0,27632,123)}g=c[w+(r<<2)>>2]|0;if((g|0)==0){x=Fb(4)|0;Ao(x);zc(x|0,27632,123)}jg(c[s>>2]|0)|0;Lc[c[(c[g>>2]|0)+24>>2]&63](t,g);Lc[c[(c[g>>2]|0)+28>>2]&63](t+12|0,g);c[u>>2]=c[f>>2];f=t+24|0;c[l+0>>2]=c[u+0>>2];u=(ri(e,l,t,f,m,h,1)|0)==(t|0)|0;a[j]=u;c[b>>2]=c[e>>2];Ig(t+12|0);Ig(t);i=k;return}function ri(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0;l=i;i=i+112|0;m=l;n=(g-f|0)/12|0;if(n>>>0>100){o=Vo(n)|0;if((o|0)==0){fp()}else{p=o;q=o}}else{p=0;q=m}m=(f|0)==(g|0);if(m){r=0;s=n}else{o=f;t=0;u=n;n=q;while(1){v=a[o]|0;if((v&1)==0){w=(v&255)>>>1}else{w=c[o+4>>2]|0}if((w|0)==0){a[n]=2;x=t+1|0;y=u+ -1|0}else{a[n]=1;x=t;y=u}v=o+12|0;if((v|0)==(g|0)){r=x;s=y;break}else{o=v;t=x;u=y;n=n+1|0}}}n=0;y=r;r=s;a:while(1){s=c[b>>2]|0;do{if((s|0)!=0){if((c[s+12>>2]|0)==(c[s+16>>2]|0)){if((Nc[c[(c[s>>2]|0)+36>>2]&127](s)|0)==-1){c[b>>2]=0;z=0;break}else{z=c[b>>2]|0;break}}else{z=s}}else{z=0}}while(0);s=(z|0)==0;u=c[e>>2]|0;if((u|0)!=0){if((c[u+12>>2]|0)==(c[u+16>>2]|0)?(Nc[c[(c[u>>2]|0)+36>>2]&127](u)|0)==-1:0){c[e>>2]=0;A=0}else{A=u}}else{A=0}B=(A|0)==0;C=c[b>>2]|0;if(!((s^B)&(r|0)!=0)){break}s=c[C+12>>2]|0;if((s|0)==(c[C+16>>2]|0)){D=Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0}else{D=d[s]|0}s=D&255;if(k){E=s}else{E=Wc[c[(c[h>>2]|0)+12>>2]&15](h,s)|0}s=n+1|0;if(m){n=s;continue}b:do{if(k){u=0;x=f;t=y;o=r;w=q;while(1){do{if((a[w]|0)==1){v=a[x]|0;F=(v&1)==0;if(F){G=x+1|0}else{G=c[x+8>>2]|0}if(!(E<<24>>24==(a[G+n|0]|0))){a[w]=0;H=u;I=t;J=o+ -1|0;break}if(F){K=(v&255)>>>1}else{K=c[x+4>>2]|0}if((K|0)==(s|0)){a[w]=2;H=1;I=t+1|0;J=o+ -1|0}else{H=1;I=t;J=o}}else{H=u;I=t;J=o}}while(0);v=x+12|0;if((v|0)==(g|0)){L=H;M=I;N=J;break b}u=H;x=v;t=I;o=J;w=w+1|0}}else{w=0;o=f;t=y;x=r;u=q;while(1){do{if((a[u]|0)==1){if((a[o]&1)==0){O=o+1|0}else{O=c[o+8>>2]|0}if(!(E<<24>>24==(Wc[c[(c[h>>2]|0)+12>>2]&15](h,a[O+n|0]|0)|0)<<24>>24)){a[u]=0;P=w;Q=t;R=x+ -1|0;break}v=a[o]|0;if((v&1)==0){S=(v&255)>>>1}else{S=c[o+4>>2]|0}if((S|0)==(s|0)){a[u]=2;P=1;Q=t+1|0;R=x+ -1|0}else{P=1;Q=t;R=x}}else{P=w;Q=t;R=x}}while(0);v=o+12|0;if((v|0)==(g|0)){L=P;M=Q;N=R;break b}w=P;o=v;t=Q;x=R;u=u+1|0}}}while(0);if(!L){n=s;y=M;r=N;continue}u=c[b>>2]|0;x=u+12|0;t=c[x>>2]|0;if((t|0)==(c[u+16>>2]|0)){Nc[c[(c[u>>2]|0)+40>>2]&127](u)|0}else{c[x>>2]=t+1}if((N+M|0)>>>0<2){n=s;y=M;r=N;continue}else{T=f;U=M;V=q}while(1){if((a[V]|0)==2){t=a[T]|0;if((t&1)==0){W=(t&255)>>>1}else{W=c[T+4>>2]|0}if((W|0)!=(s|0)){a[V]=0;X=U+ -1|0}else{X=U}}else{X=U}t=T+12|0;if((t|0)==(g|0)){n=s;y=X;r=N;continue a}else{T=t;U=X;V=V+1|0}}}do{if((C|0)!=0){if((c[C+12>>2]|0)==(c[C+16>>2]|0)){if((Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1){c[b>>2]=0;Y=0;break}else{Y=c[b>>2]|0;break}}else{Y=C}}else{Y=0}}while(0);C=(Y|0)==0;do{if(!B){if((c[A+12>>2]|0)!=(c[A+16>>2]|0)){if(C){break}else{Z=80;break}}if(!((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1)){if(C){break}else{Z=80;break}}else{c[e>>2]=0;Z=78;break}}else{Z=78}}while(0);if((Z|0)==78?C:0){Z=80}if((Z|0)==80){c[j>>2]=c[j>>2]|2}c:do{if(!m){if((a[q]|0)==2){_=f}else{C=f;e=q;while(1){A=C+12|0;B=e+1|0;if((A|0)==(g|0)){Z=85;break c}if((a[B]|0)==2){_=A;break}else{C=A;e=B}}}}else{Z=85}}while(0);if((Z|0)==85){c[j>>2]=c[j>>2]|4;_=g}if((p|0)==0){i=l;return _|0}Wo(p);i=l;return _|0}function si(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0;b=i;i=i+16|0;j=b+12|0;k=b+8|0;l=b+4|0;m=b;c[l>>2]=c[d>>2];c[m>>2]=c[e>>2];c[k+0>>2]=c[l+0>>2];c[j+0>>2]=c[m+0>>2];ti(a,0,k,j,f,g,h);i=b;return}function ti(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;e=i;i=i+224|0;l=e+198|0;m=e+196|0;n=e+184|0;o=e+172|0;p=e+168|0;q=e+8|0;r=e+4|0;s=e;t=c[h+4>>2]&74;if((t|0)==64){u=8}else if((t|0)==8){u=16}else if((t|0)==0){u=0}else{u=10}jj(n,h,l,m);c[o+0>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;Kg(o,10,0);if((a[o]&1)==0){h=o+1|0;v=h;w=o+8|0;x=h}else{h=o+8|0;v=o+1|0;w=h;x=c[h>>2]|0}c[p>>2]=x;c[r>>2]=q;c[s>>2]=0;h=o+4|0;t=a[m]|0;m=c[f>>2]|0;y=x;a:while(1){if((m|0)!=0){if((c[m+12>>2]|0)==(c[m+16>>2]|0)?(Nc[c[(c[m>>2]|0)+36>>2]&127](m)|0)==-1:0){c[f>>2]=0;z=0}else{z=m}}else{z=0}x=(z|0)==0;A=c[g>>2]|0;do{if((A|0)!=0){if((c[A+12>>2]|0)!=(c[A+16>>2]|0)){if(x){B=A;break}else{C=A;D=y;break a}}if(!((Nc[c[(c[A>>2]|0)+36>>2]&127](A)|0)==-1)){if(x){B=A;break}else{C=A;D=y;break a}}else{c[g>>2]=0;E=18;break}}else{E=18}}while(0);if((E|0)==18){E=0;if(x){C=0;D=y;break}else{B=0}}A=a[o]|0;F=(A&1)==0;if(F){G=(A&255)>>>1}else{G=c[h>>2]|0}if(((c[p>>2]|0)-y|0)==(G|0)){if(F){H=(A&255)>>>1;I=(A&255)>>>1}else{A=c[h>>2]|0;H=A;I=A}Kg(o,H<<1,0);if((a[o]&1)==0){J=10}else{J=(c[o>>2]&-2)+ -1|0}Kg(o,J,0);if((a[o]&1)==0){K=v}else{K=c[w>>2]|0}c[p>>2]=K+I;L=K}else{L=y}A=z+12|0;F=c[A>>2]|0;M=z+16|0;if((F|0)==(c[M>>2]|0)){N=Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0}else{N=d[F]|0}if((Li(N&255,u,L,p,s,t,n,q,r,l)|0)!=0){C=B;D=L;break}F=c[A>>2]|0;if((F|0)==(c[M>>2]|0)){Nc[c[(c[z>>2]|0)+40>>2]&127](z)|0;m=z;y=L;continue}else{c[A>>2]=F+1;m=z;y=L;continue}}L=a[n]|0;if((L&1)==0){O=(L&255)>>>1}else{O=c[n+4>>2]|0}if((O|0)!=0?(O=c[r>>2]|0,(O-q|0)<160):0){L=c[s>>2]|0;c[r>>2]=O+4;c[O>>2]=L}L=eo(D,c[p>>2]|0,j,u)|0;c[k>>2]=L;vl(n,q,c[r>>2]|0,j);if((z|0)!=0){if((c[z+12>>2]|0)==(c[z+16>>2]|0)?(Nc[c[(c[z>>2]|0)+36>>2]&127](z)|0)==-1:0){c[f>>2]=0;P=0}else{P=z}}else{P=0}z=(P|0)==0;do{if((C|0)!=0){if((c[C+12>>2]|0)!=(c[C+16>>2]|0)){if(!z){break}c[b>>2]=P;Ig(o);Ig(n);i=e;return}if((Nc[c[(c[C>>2]|0)+36>>2]&127](C)|0)==-1){c[g>>2]=0;E=54;break}if(z^(C|0)==0){c[b>>2]=P;Ig(o);Ig(n);i=e;return}}else{E=54}}while(0);if((E|0)==54?!z:0){c[b>>2]=P;Ig(o);Ig(n);i=e;return}c[j>>2]=c[j>>2]|2;c[b>>2]=P;Ig(o);Ig(n);i=e;return}



function Qo(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;h=i;if((b|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){i=h;return}j=d+28|0;if((c[j>>2]|0)==1){i=h;return}c[j>>2]=f;i=h;return}if((b|0)!=(c[d>>2]|0)){j=c[b+8>>2]|0;Ic[c[(c[j>>2]|0)+24>>2]&3](j,d,e,f,g);i=h;return}if((c[d+16>>2]|0)!=(e|0)?(j=d+20|0,(c[j>>2]|0)!=(e|0)):0){c[d+32>>2]=f;k=d+44|0;if((c[k>>2]|0)==4){i=h;return}l=d+52|0;a[l]=0;m=d+53|0;a[m]=0;n=c[b+8>>2]|0;Vc[c[(c[n>>2]|0)+20>>2]&15](n,d,e,e,1,g);if((a[m]|0)!=0){if((a[l]|0)==0){o=1;p=13}}else{o=0;p=13}do{if((p|0)==13){c[j>>2]=e;l=d+40|0;c[l>>2]=(c[l>>2]|0)+1;if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0){a[d+54|0]=1;if(o){break}}else{p=16}if((p|0)==16?o:0){break}c[k>>2]=4;i=h;return}}while(0);c[k>>2]=3;i=h;return}if((f|0)!=1){i=h;return}c[d+32>>2]=1;i=h;return}function Ro(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;g=i;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){i=g;return}h=d+28|0;if((c[h>>2]|0)==1){i=g;return}c[h>>2]=f;i=g;return}if((c[d>>2]|0)!=(b|0)){i=g;return}if((c[d+16>>2]|0)!=(e|0)?(b=d+20|0,(c[b>>2]|0)!=(e|0)):0){c[d+32>>2]=f;c[b>>2]=e;e=d+40|0;c[e>>2]=(c[e>>2]|0)+1;if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0){a[d+54|0]=1}c[d+44>>2]=4;i=g;return}if((f|0)!=1){i=g;return}c[d+32>>2]=1;i=g;return}function So(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;j=i;if((b|0)!=(c[d+8>>2]|0)){k=d+52|0;l=a[k]|0;m=d+53|0;n=a[m]|0;o=c[b+12>>2]|0;p=b+(o<<3)+16|0;a[k]=0;a[m]=0;q=c[b+20>>2]|0;r=q>>8;if((q&1|0)==0){s=r}else{s=c[(c[f>>2]|0)+r>>2]|0}r=c[b+16>>2]|0;Vc[c[(c[r>>2]|0)+20>>2]&15](r,d,e,f+s|0,(q&2|0)!=0?g:2,h);a:do{if((o|0)>1){q=d+24|0;s=b+8|0;r=d+54|0;t=b+24|0;do{if((a[r]|0)!=0){break a}if((a[k]|0)==0){if((a[m]|0)!=0?(c[s>>2]&1|0)==0:0){break a}}else{if((c[q>>2]|0)==1){break a}if((c[s>>2]&2|0)==0){break a}}a[k]=0;a[m]=0;u=c[t+4>>2]|0;v=u>>8;if((u&1|0)==0){w=v}else{w=c[(c[f>>2]|0)+v>>2]|0}v=c[t>>2]|0;Vc[c[(c[v>>2]|0)+20>>2]&15](v,d,e,f+w|0,(u&2|0)!=0?g:2,h);t=t+8|0}while(t>>>0<p>>>0)}}while(0);a[k]=l;a[m]=n;i=j;return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){i=j;return}a[d+52|0]=1;f=d+16|0;n=c[f>>2]|0;if((n|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){i=j;return}a[d+54|0]=1;i=j;return}if((n|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;i=j;return}e=d+24|0;n=c[e>>2]|0;if((n|0)==2){c[e>>2]=g;x=g}else{x=n}if(!((c[d+48>>2]|0)==1&(x|0)==1)){i=j;return}a[d+54|0]=1;i=j;return}function To(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0;j=i;if((b|0)!=(c[d+8>>2]|0)){k=c[b+8>>2]|0;Vc[c[(c[k>>2]|0)+20>>2]&15](k,d,e,f,g,h);i=j;return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){i=j;return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){i=j;return}a[d+54|0]=1;i=j;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;i=j;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;l=g}else{l=h}if(!((c[d+48>>2]|0)==1&(l|0)==1)){i=j;return}a[d+54|0]=1;i=j;return}function Uo(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0;h=i;if((c[d+8>>2]|0)!=(b|0)){i=h;return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){i=h;return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){i=h;return}a[d+54|0]=1;i=h;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;i=h;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;j=g}else{j=b}if(!((c[d+48>>2]|0)==1&(j|0)==1)){i=h;return}a[d+54|0]=1;i=h;return}function Vo(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0;b=i;do{if(a>>>0<245){if(a>>>0<11){d=16}else{d=a+11&-8}e=d>>>3;f=c[6998]|0;g=f>>>e;if((g&3|0)!=0){h=(g&1^1)+e|0;j=h<<1;k=28032+(j<<2)|0;l=28032+(j+2<<2)|0;j=c[l>>2]|0;m=j+8|0;n=c[m>>2]|0;do{if((k|0)!=(n|0)){if(n>>>0<(c[28008>>2]|0)>>>0){Wb()}o=n+12|0;if((c[o>>2]|0)==(j|0)){c[o>>2]=k;c[l>>2]=n;break}else{Wb()}}else{c[6998]=f&~(1<<h)}}while(0);n=h<<3;c[j+4>>2]=n|3;l=j+(n|4)|0;c[l>>2]=c[l>>2]|1;p=m;i=b;return p|0}if(d>>>0>(c[28e3>>2]|0)>>>0){if((g|0)!=0){l=2<<e;n=g<<e&(l|0-l);l=(n&0-n)+ -1|0;n=l>>>12&16;k=l>>>n;l=k>>>5&8;o=k>>>l;k=o>>>2&4;q=o>>>k;o=q>>>1&2;r=q>>>o;q=r>>>1&1;s=(l|n|k|o|q)+(r>>>q)|0;q=s<<1;r=28032+(q<<2)|0;o=28032+(q+2<<2)|0;q=c[o>>2]|0;k=q+8|0;n=c[k>>2]|0;do{if((r|0)!=(n|0)){if(n>>>0<(c[28008>>2]|0)>>>0){Wb()}l=n+12|0;if((c[l>>2]|0)==(q|0)){c[l>>2]=r;c[o>>2]=n;break}else{Wb()}}else{c[6998]=f&~(1<<s)}}while(0);f=s<<3;n=f-d|0;c[q+4>>2]=d|3;o=q+d|0;c[q+(d|4)>>2]=n|1;c[q+f>>2]=n;f=c[28e3>>2]|0;if((f|0)!=0){r=c[28012>>2]|0;e=f>>>3;f=e<<1;g=28032+(f<<2)|0;m=c[6998]|0;j=1<<e;if((m&j|0)!=0){e=28032+(f+2<<2)|0;h=c[e>>2]|0;if(h>>>0<(c[28008>>2]|0)>>>0){Wb()}else{t=e;u=h}}else{c[6998]=m|j;t=28032+(f+2<<2)|0;u=g}c[t>>2]=r;c[u+12>>2]=r;c[r+8>>2]=u;c[r+12>>2]=g}c[28e3>>2]=n;c[28012>>2]=o;p=k;i=b;return p|0}o=c[27996>>2]|0;if((o|0)!=0){n=(o&0-o)+ -1|0;o=n>>>12&16;g=n>>>o;n=g>>>5&8;r=g>>>n;g=r>>>2&4;f=r>>>g;r=f>>>1&2;j=f>>>r;f=j>>>1&1;m=c[28296+((n|o|g|r|f)+(j>>>f)<<2)>>2]|0;f=(c[m+4>>2]&-8)-d|0;j=m;r=m;while(1){m=c[j+16>>2]|0;if((m|0)==0){g=c[j+20>>2]|0;if((g|0)==0){break}else{v=g}}else{v=m}m=(c[v+4>>2]&-8)-d|0;g=m>>>0<f>>>0;f=g?m:f;j=v;r=g?v:r}j=c[28008>>2]|0;if(r>>>0<j>>>0){Wb()}k=r+d|0;if(!(r>>>0<k>>>0)){Wb()}q=c[r+24>>2]|0;s=c[r+12>>2]|0;do{if((s|0)==(r|0)){g=r+20|0;m=c[g>>2]|0;if((m|0)==0){o=r+16|0;n=c[o>>2]|0;if((n|0)==0){w=0;break}else{x=n;y=o}}else{x=m;y=g}while(1){g=x+20|0;m=c[g>>2]|0;if((m|0)!=0){x=m;y=g;continue}g=x+16|0;m=c[g>>2]|0;if((m|0)==0){break}else{x=m;y=g}}if(y>>>0<j>>>0){Wb()}else{c[y>>2]=0;w=x;break}}else{g=c[r+8>>2]|0;if(g>>>0<j>>>0){Wb()}m=g+12|0;if((c[m>>2]|0)!=(r|0)){Wb()}o=s+8|0;if((c[o>>2]|0)==(r|0)){c[m>>2]=s;c[o>>2]=g;w=s;break}else{Wb()}}}while(0);do{if((q|0)!=0){s=c[r+28>>2]|0;j=28296+(s<<2)|0;if((r|0)==(c[j>>2]|0)){c[j>>2]=w;if((w|0)==0){c[27996>>2]=c[27996>>2]&~(1<<s);break}}else{if(q>>>0<(c[28008>>2]|0)>>>0){Wb()}s=q+16|0;if((c[s>>2]|0)==(r|0)){c[s>>2]=w}else{c[q+20>>2]=w}if((w|0)==0){break}}if(w>>>0<(c[28008>>2]|0)>>>0){Wb()}c[w+24>>2]=q;s=c[r+16>>2]|0;do{if((s|0)!=0){if(s>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[w+16>>2]=s;c[s+24>>2]=w;break}}}while(0);s=c[r+20>>2]|0;if((s|0)!=0){if(s>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[w+20>>2]=s;c[s+24>>2]=w;break}}}}while(0);if(f>>>0<16){q=f+d|0;c[r+4>>2]=q|3;s=r+(q+4)|0;c[s>>2]=c[s>>2]|1}else{c[r+4>>2]=d|3;c[r+(d|4)>>2]=f|1;c[r+(f+d)>>2]=f;s=c[28e3>>2]|0;if((s|0)!=0){q=c[28012>>2]|0;j=s>>>3;s=j<<1;g=28032+(s<<2)|0;o=c[6998]|0;m=1<<j;if((o&m|0)!=0){j=28032+(s+2<<2)|0;n=c[j>>2]|0;if(n>>>0<(c[28008>>2]|0)>>>0){Wb()}else{z=j;A=n}}else{c[6998]=o|m;z=28032+(s+2<<2)|0;A=g}c[z>>2]=q;c[A+12>>2]=q;c[q+8>>2]=A;c[q+12>>2]=g}c[28e3>>2]=f;c[28012>>2]=k}p=r+8|0;i=b;return p|0}else{B=d}}else{B=d}}else{if(!(a>>>0>4294967231)){g=a+11|0;q=g&-8;s=c[27996>>2]|0;if((s|0)!=0){m=0-q|0;o=g>>>8;if((o|0)!=0){if(q>>>0>16777215){C=31}else{g=(o+1048320|0)>>>16&8;n=o<<g;o=(n+520192|0)>>>16&4;j=n<<o;n=(j+245760|0)>>>16&2;h=14-(o|g|n)+(j<<n>>>15)|0;C=q>>>(h+7|0)&1|h<<1}}else{C=0}h=c[28296+(C<<2)>>2]|0;a:do{if((h|0)==0){D=m;E=0;F=0}else{if((C|0)==31){G=0}else{G=25-(C>>>1)|0}n=m;j=0;g=q<<G;o=h;e=0;while(1){l=c[o+4>>2]&-8;H=l-q|0;if(H>>>0<n>>>0){if((l|0)==(q|0)){D=H;E=o;F=o;break a}else{I=H;J=o}}else{I=n;J=e}H=c[o+20>>2]|0;l=c[o+(g>>>31<<2)+16>>2]|0;K=(H|0)==0|(H|0)==(l|0)?j:H;if((l|0)==0){D=I;E=K;F=J;break}else{n=I;j=K;g=g<<1;o=l;e=J}}}}while(0);if((E|0)==0&(F|0)==0){h=2<<C;m=s&(h|0-h);if((m|0)==0){B=q;break}h=(m&0-m)+ -1|0;m=h>>>12&16;r=h>>>m;h=r>>>5&8;k=r>>>h;r=k>>>2&4;f=k>>>r;k=f>>>1&2;e=f>>>k;f=e>>>1&1;L=c[28296+((h|m|r|k|f)+(e>>>f)<<2)>>2]|0}else{L=E}if((L|0)==0){M=D;N=F}else{f=D;e=L;k=F;while(1){r=(c[e+4>>2]&-8)-q|0;m=r>>>0<f>>>0;h=m?r:f;r=m?e:k;m=c[e+16>>2]|0;if((m|0)!=0){f=h;e=m;k=r;continue}m=c[e+20>>2]|0;if((m|0)==0){M=h;N=r;break}else{f=h;e=m;k=r}}}if((N|0)!=0?M>>>0<((c[28e3>>2]|0)-q|0)>>>0:0){k=c[28008>>2]|0;if(N>>>0<k>>>0){Wb()}e=N+q|0;if(!(N>>>0<e>>>0)){Wb()}f=c[N+24>>2]|0;s=c[N+12>>2]|0;do{if((s|0)==(N|0)){r=N+20|0;m=c[r>>2]|0;if((m|0)==0){h=N+16|0;o=c[h>>2]|0;if((o|0)==0){O=0;break}else{P=o;Q=h}}else{P=m;Q=r}while(1){r=P+20|0;m=c[r>>2]|0;if((m|0)!=0){P=m;Q=r;continue}r=P+16|0;m=c[r>>2]|0;if((m|0)==0){break}else{P=m;Q=r}}if(Q>>>0<k>>>0){Wb()}else{c[Q>>2]=0;O=P;break}}else{r=c[N+8>>2]|0;if(r>>>0<k>>>0){Wb()}m=r+12|0;if((c[m>>2]|0)!=(N|0)){Wb()}h=s+8|0;if((c[h>>2]|0)==(N|0)){c[m>>2]=s;c[h>>2]=r;O=s;break}else{Wb()}}}while(0);do{if((f|0)!=0){s=c[N+28>>2]|0;k=28296+(s<<2)|0;if((N|0)==(c[k>>2]|0)){c[k>>2]=O;if((O|0)==0){c[27996>>2]=c[27996>>2]&~(1<<s);break}}else{if(f>>>0<(c[28008>>2]|0)>>>0){Wb()}s=f+16|0;if((c[s>>2]|0)==(N|0)){c[s>>2]=O}else{c[f+20>>2]=O}if((O|0)==0){break}}if(O>>>0<(c[28008>>2]|0)>>>0){Wb()}c[O+24>>2]=f;s=c[N+16>>2]|0;do{if((s|0)!=0){if(s>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[O+16>>2]=s;c[s+24>>2]=O;break}}}while(0);s=c[N+20>>2]|0;if((s|0)!=0){if(s>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[O+20>>2]=s;c[s+24>>2]=O;break}}}}while(0);b:do{if(!(M>>>0<16)){c[N+4>>2]=q|3;c[N+(q|4)>>2]=M|1;c[N+(M+q)>>2]=M;f=M>>>3;if(M>>>0<256){s=f<<1;k=28032+(s<<2)|0;r=c[6998]|0;h=1<<f;if((r&h|0)!=0){f=28032+(s+2<<2)|0;m=c[f>>2]|0;if(m>>>0<(c[28008>>2]|0)>>>0){Wb()}else{R=f;S=m}}else{c[6998]=r|h;R=28032+(s+2<<2)|0;S=k}c[R>>2]=e;c[S+12>>2]=e;c[N+(q+8)>>2]=S;c[N+(q+12)>>2]=k;break}k=M>>>8;if((k|0)!=0){if(M>>>0>16777215){T=31}else{s=(k+1048320|0)>>>16&8;h=k<<s;k=(h+520192|0)>>>16&4;r=h<<k;h=(r+245760|0)>>>16&2;m=14-(k|s|h)+(r<<h>>>15)|0;T=M>>>(m+7|0)&1|m<<1}}else{T=0}m=28296+(T<<2)|0;c[N+(q+28)>>2]=T;c[N+(q+20)>>2]=0;c[N+(q+16)>>2]=0;h=c[27996>>2]|0;r=1<<T;if((h&r|0)==0){c[27996>>2]=h|r;c[m>>2]=e;c[N+(q+24)>>2]=m;c[N+(q+12)>>2]=e;c[N+(q+8)>>2]=e;break}r=c[m>>2]|0;if((T|0)==31){U=0}else{U=25-(T>>>1)|0}c:do{if((c[r+4>>2]&-8|0)!=(M|0)){m=M<<U;h=r;while(1){V=h+(m>>>31<<2)+16|0;s=c[V>>2]|0;if((s|0)==0){break}if((c[s+4>>2]&-8|0)==(M|0)){W=s;break c}else{m=m<<1;h=s}}if(V>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[V>>2]=e;c[N+(q+24)>>2]=h;c[N+(q+12)>>2]=e;c[N+(q+8)>>2]=e;break b}}else{W=r}}while(0);r=W+8|0;m=c[r>>2]|0;s=c[28008>>2]|0;if(W>>>0<s>>>0){Wb()}if(m>>>0<s>>>0){Wb()}else{c[m+12>>2]=e;c[r>>2]=e;c[N+(q+8)>>2]=m;c[N+(q+12)>>2]=W;c[N+(q+24)>>2]=0;break}}else{m=M+q|0;c[N+4>>2]=m|3;r=N+(m+4)|0;c[r>>2]=c[r>>2]|1}}while(0);p=N+8|0;i=b;return p|0}else{B=q}}else{B=q}}else{B=-1}}}while(0);N=c[28e3>>2]|0;if(!(B>>>0>N>>>0)){M=N-B|0;W=c[28012>>2]|0;if(M>>>0>15){c[28012>>2]=W+B;c[28e3>>2]=M;c[W+(B+4)>>2]=M|1;c[W+N>>2]=M;c[W+4>>2]=B|3}else{c[28e3>>2]=0;c[28012>>2]=0;c[W+4>>2]=N|3;M=W+(N+4)|0;c[M>>2]=c[M>>2]|1}p=W+8|0;i=b;return p|0}W=c[28004>>2]|0;if(B>>>0<W>>>0){M=W-B|0;c[28004>>2]=M;W=c[28016>>2]|0;c[28016>>2]=W+B;c[W+(B+4)>>2]=M|1;c[W+4>>2]=B|3;p=W+8|0;i=b;return p|0}do{if((c[7116]|0)==0){W=Qa(30)|0;if((W+ -1&W|0)==0){c[28472>>2]=W;c[28468>>2]=W;c[28476>>2]=-1;c[28480>>2]=-1;c[28484>>2]=0;c[28436>>2]=0;W=(zb(0)|0)&-16^1431655768;c[7116]=W;break}else{Wb()}}}while(0);W=B+48|0;M=c[28472>>2]|0;N=B+47|0;V=M+N|0;U=0-M|0;M=V&U;if(!(M>>>0>B>>>0)){p=0;i=b;return p|0}T=c[28432>>2]|0;if((T|0)!=0?(S=c[28424>>2]|0,R=S+M|0,R>>>0<=S>>>0|R>>>0>T>>>0):0){p=0;i=b;return p|0}d:do{if((c[28436>>2]&4|0)==0){T=c[28016>>2]|0;e:do{if((T|0)!=0){R=28440|0;while(1){S=c[R>>2]|0;if(!(S>>>0>T>>>0)?(X=R+4|0,(S+(c[X>>2]|0)|0)>>>0>T>>>0):0){break}S=c[R+8>>2]|0;if((S|0)==0){Y=182;break e}else{R=S}}if((R|0)!=0){S=V-(c[28004>>2]|0)&U;if(S>>>0<2147483647){O=Na(S|0)|0;P=(O|0)==((c[R>>2]|0)+(c[X>>2]|0)|0);Z=O;_=S;$=P?O:-1;aa=P?S:0;Y=191}else{ba=0}}else{Y=182}}else{Y=182}}while(0);do{if((Y|0)==182){T=Na(0)|0;if((T|0)!=(-1|0)){q=T;S=c[28468>>2]|0;P=S+ -1|0;if((P&q|0)==0){ca=M}else{ca=M-q+(P+q&0-S)|0}S=c[28424>>2]|0;q=S+ca|0;if(ca>>>0>B>>>0&ca>>>0<2147483647){P=c[28432>>2]|0;if((P|0)!=0?q>>>0<=S>>>0|q>>>0>P>>>0:0){ba=0;break}P=Na(ca|0)|0;q=(P|0)==(T|0);Z=P;_=ca;$=q?T:-1;aa=q?ca:0;Y=191}else{ba=0}}else{ba=0}}}while(0);f:do{if((Y|0)==191){q=0-_|0;if(($|0)!=(-1|0)){da=$;ea=aa;Y=202;break d}do{if((Z|0)!=(-1|0)&_>>>0<2147483647&_>>>0<W>>>0?(T=c[28472>>2]|0,P=N-_+T&0-T,P>>>0<2147483647):0){if((Na(P|0)|0)==(-1|0)){Na(q|0)|0;ba=aa;break f}else{fa=P+_|0;break}}else{fa=_}}while(0);if((Z|0)==(-1|0)){ba=aa}else{da=Z;ea=fa;Y=202;break d}}}while(0);c[28436>>2]=c[28436>>2]|4;ga=ba;Y=199}else{ga=0;Y=199}}while(0);if((((Y|0)==199?M>>>0<2147483647:0)?(ba=Na(M|0)|0,M=Na(0)|0,(M|0)!=(-1|0)&(ba|0)!=(-1|0)&ba>>>0<M>>>0):0)?(fa=M-ba|0,M=fa>>>0>(B+40|0)>>>0,M):0){da=ba;ea=M?fa:ga;Y=202}if((Y|0)==202){ga=(c[28424>>2]|0)+ea|0;c[28424>>2]=ga;if(ga>>>0>(c[28428>>2]|0)>>>0){c[28428>>2]=ga}ga=c[28016>>2]|0;g:do{if((ga|0)!=0){fa=28440|0;while(1){ha=c[fa>>2]|0;ia=fa+4|0;ja=c[ia>>2]|0;if((da|0)==(ha+ja|0)){Y=214;break}M=c[fa+8>>2]|0;if((M|0)==0){break}else{fa=M}}if(((Y|0)==214?(c[fa+12>>2]&8|0)==0:0)?ga>>>0>=ha>>>0&ga>>>0<da>>>0:0){c[ia>>2]=ja+ea;M=(c[28004>>2]|0)+ea|0;ba=ga+8|0;if((ba&7|0)==0){ka=0}else{ka=0-ba&7}ba=M-ka|0;c[28016>>2]=ga+ka;c[28004>>2]=ba;c[ga+(ka+4)>>2]=ba|1;c[ga+(M+4)>>2]=40;c[28020>>2]=c[28480>>2];break}if(da>>>0<(c[28008>>2]|0)>>>0){c[28008>>2]=da}M=da+ea|0;ba=28440|0;while(1){if((c[ba>>2]|0)==(M|0)){Y=224;break}Z=c[ba+8>>2]|0;if((Z|0)==0){break}else{ba=Z}}if((Y|0)==224?(c[ba+12>>2]&8|0)==0:0){c[ba>>2]=da;M=ba+4|0;c[M>>2]=(c[M>>2]|0)+ea;M=da+8|0;if((M&7|0)==0){la=0}else{la=0-M&7}M=da+(ea+8)|0;if((M&7|0)==0){ma=0}else{ma=0-M&7}M=da+(ma+ea)|0;fa=la+B|0;Z=da+fa|0;aa=M-(da+la)-B|0;c[da+(la+4)>>2]=B|3;h:do{if((M|0)!=(c[28016>>2]|0)){if((M|0)==(c[28012>>2]|0)){_=(c[28e3>>2]|0)+aa|0;c[28e3>>2]=_;c[28012>>2]=Z;c[da+(fa+4)>>2]=_|1;c[da+(_+fa)>>2]=_;break}_=ea+4|0;N=c[da+(_+ma)>>2]|0;if((N&3|0)==1){W=N&-8;$=N>>>3;do{if(!(N>>>0<256)){ca=c[da+((ma|24)+ea)>>2]|0;X=c[da+(ea+12+ma)>>2]|0;do{if((X|0)==(M|0)){U=ma|16;V=da+(_+U)|0;q=c[V>>2]|0;if((q|0)==0){R=da+(U+ea)|0;U=c[R>>2]|0;if((U|0)==0){na=0;break}else{oa=U;pa=R}}else{oa=q;pa=V}while(1){V=oa+20|0;q=c[V>>2]|0;if((q|0)!=0){oa=q;pa=V;continue}V=oa+16|0;q=c[V>>2]|0;if((q|0)==0){break}else{oa=q;pa=V}}if(pa>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[pa>>2]=0;na=oa;break}}else{V=c[da+((ma|8)+ea)>>2]|0;if(V>>>0<(c[28008>>2]|0)>>>0){Wb()}q=V+12|0;if((c[q>>2]|0)!=(M|0)){Wb()}R=X+8|0;if((c[R>>2]|0)==(M|0)){c[q>>2]=X;c[R>>2]=V;na=X;break}else{Wb()}}}while(0);if((ca|0)!=0){X=c[da+(ea+28+ma)>>2]|0;h=28296+(X<<2)|0;if((M|0)==(c[h>>2]|0)){c[h>>2]=na;if((na|0)==0){c[27996>>2]=c[27996>>2]&~(1<<X);break}}else{if(ca>>>0<(c[28008>>2]|0)>>>0){Wb()}X=ca+16|0;if((c[X>>2]|0)==(M|0)){c[X>>2]=na}else{c[ca+20>>2]=na}if((na|0)==0){break}}if(na>>>0<(c[28008>>2]|0)>>>0){Wb()}c[na+24>>2]=ca;X=ma|16;h=c[da+(X+ea)>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[na+16>>2]=h;c[h+24>>2]=na;break}}}while(0);h=c[da+(_+X)>>2]|0;if((h|0)!=0){if(h>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[na+20>>2]=h;c[h+24>>2]=na;break}}}}else{h=c[da+((ma|8)+ea)>>2]|0;ca=c[da+(ea+12+ma)>>2]|0;V=28032+($<<1<<2)|0;if((h|0)!=(V|0)){if(h>>>0<(c[28008>>2]|0)>>>0){Wb()}if((c[h+12>>2]|0)!=(M|0)){Wb()}}if((ca|0)==(h|0)){c[6998]=c[6998]&~(1<<$);break}if((ca|0)!=(V|0)){if(ca>>>0<(c[28008>>2]|0)>>>0){Wb()}V=ca+8|0;if((c[V>>2]|0)==(M|0)){qa=V}else{Wb()}}else{qa=ca+8|0}c[h+12>>2]=ca;c[qa>>2]=h}}while(0);ra=da+((W|ma)+ea)|0;sa=W+aa|0}else{ra=M;sa=aa}$=ra+4|0;c[$>>2]=c[$>>2]&-2;c[da+(fa+4)>>2]=sa|1;c[da+(sa+fa)>>2]=sa;$=sa>>>3;if(sa>>>0<256){_=$<<1;N=28032+(_<<2)|0;h=c[6998]|0;ca=1<<$;if((h&ca|0)!=0){$=28032+(_+2<<2)|0;V=c[$>>2]|0;if(V>>>0<(c[28008>>2]|0)>>>0){Wb()}else{ta=$;ua=V}}else{c[6998]=h|ca;ta=28032+(_+2<<2)|0;ua=N}c[ta>>2]=Z;c[ua+12>>2]=Z;c[da+(fa+8)>>2]=ua;c[da+(fa+12)>>2]=N;break}N=sa>>>8;if((N|0)!=0){if(sa>>>0>16777215){va=31}else{_=(N+1048320|0)>>>16&8;ca=N<<_;N=(ca+520192|0)>>>16&4;h=ca<<N;ca=(h+245760|0)>>>16&2;V=14-(N|_|ca)+(h<<ca>>>15)|0;va=sa>>>(V+7|0)&1|V<<1}}else{va=0}V=28296+(va<<2)|0;c[da+(fa+28)>>2]=va;c[da+(fa+20)>>2]=0;c[da+(fa+16)>>2]=0;ca=c[27996>>2]|0;h=1<<va;if((ca&h|0)==0){c[27996>>2]=ca|h;c[V>>2]=Z;c[da+(fa+24)>>2]=V;c[da+(fa+12)>>2]=Z;c[da+(fa+8)>>2]=Z;break}h=c[V>>2]|0;if((va|0)==31){wa=0}else{wa=25-(va>>>1)|0}i:do{if((c[h+4>>2]&-8|0)!=(sa|0)){V=sa<<wa;ca=h;while(1){xa=ca+(V>>>31<<2)+16|0;_=c[xa>>2]|0;if((_|0)==0){break}if((c[_+4>>2]&-8|0)==(sa|0)){ya=_;break i}else{V=V<<1;ca=_}}if(xa>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[xa>>2]=Z;c[da+(fa+24)>>2]=ca;c[da+(fa+12)>>2]=Z;c[da+(fa+8)>>2]=Z;break h}}else{ya=h}}while(0);h=ya+8|0;W=c[h>>2]|0;V=c[28008>>2]|0;if(ya>>>0<V>>>0){Wb()}if(W>>>0<V>>>0){Wb()}else{c[W+12>>2]=Z;c[h>>2]=Z;c[da+(fa+8)>>2]=W;c[da+(fa+12)>>2]=ya;c[da+(fa+24)>>2]=0;break}}else{W=(c[28004>>2]|0)+aa|0;c[28004>>2]=W;c[28016>>2]=Z;c[da+(fa+4)>>2]=W|1}}while(0);p=da+(la|8)|0;i=b;return p|0}fa=28440|0;while(1){za=c[fa>>2]|0;if(!(za>>>0>ga>>>0)?(Aa=c[fa+4>>2]|0,Ba=za+Aa|0,Ba>>>0>ga>>>0):0){break}fa=c[fa+8>>2]|0}fa=za+(Aa+ -39)|0;if((fa&7|0)==0){Ca=0}else{Ca=0-fa&7}fa=za+(Aa+ -47+Ca)|0;Z=fa>>>0<(ga+16|0)>>>0?ga:fa;fa=Z+8|0;aa=da+8|0;if((aa&7|0)==0){Da=0}else{Da=0-aa&7}aa=ea+ -40-Da|0;c[28016>>2]=da+Da;c[28004>>2]=aa;c[da+(Da+4)>>2]=aa|1;c[da+(ea+ -36)>>2]=40;c[28020>>2]=c[28480>>2];c[Z+4>>2]=27;c[fa+0>>2]=c[28440>>2];c[fa+4>>2]=c[28444>>2];c[fa+8>>2]=c[28448>>2];c[fa+12>>2]=c[28452>>2];c[28440>>2]=da;c[28444>>2]=ea;c[28452>>2]=0;c[28448>>2]=fa;fa=Z+28|0;c[fa>>2]=7;if((Z+32|0)>>>0<Ba>>>0){aa=fa;while(1){fa=aa+4|0;c[fa>>2]=7;if((aa+8|0)>>>0<Ba>>>0){aa=fa}else{break}}}if((Z|0)!=(ga|0)){aa=Z-ga|0;fa=ga+(aa+4)|0;c[fa>>2]=c[fa>>2]&-2;c[ga+4>>2]=aa|1;c[ga+aa>>2]=aa;fa=aa>>>3;if(aa>>>0<256){M=fa<<1;ba=28032+(M<<2)|0;W=c[6998]|0;h=1<<fa;if((W&h|0)!=0){fa=28032+(M+2<<2)|0;V=c[fa>>2]|0;if(V>>>0<(c[28008>>2]|0)>>>0){Wb()}else{Ea=fa;Fa=V}}else{c[6998]=W|h;Ea=28032+(M+2<<2)|0;Fa=ba}c[Ea>>2]=ga;c[Fa+12>>2]=ga;c[ga+8>>2]=Fa;c[ga+12>>2]=ba;break}ba=aa>>>8;if((ba|0)!=0){if(aa>>>0>16777215){Ga=31}else{M=(ba+1048320|0)>>>16&8;h=ba<<M;ba=(h+520192|0)>>>16&4;W=h<<ba;h=(W+245760|0)>>>16&2;V=14-(ba|M|h)+(W<<h>>>15)|0;Ga=aa>>>(V+7|0)&1|V<<1}}else{Ga=0}V=28296+(Ga<<2)|0;c[ga+28>>2]=Ga;c[ga+20>>2]=0;c[ga+16>>2]=0;h=c[27996>>2]|0;W=1<<Ga;if((h&W|0)==0){c[27996>>2]=h|W;c[V>>2]=ga;c[ga+24>>2]=V;c[ga+12>>2]=ga;c[ga+8>>2]=ga;break}W=c[V>>2]|0;if((Ga|0)==31){Ha=0}else{Ha=25-(Ga>>>1)|0}j:do{if((c[W+4>>2]&-8|0)!=(aa|0)){V=aa<<Ha;h=W;while(1){Ia=h+(V>>>31<<2)+16|0;M=c[Ia>>2]|0;if((M|0)==0){break}if((c[M+4>>2]&-8|0)==(aa|0)){Ja=M;break j}else{V=V<<1;h=M}}if(Ia>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[Ia>>2]=ga;c[ga+24>>2]=h;c[ga+12>>2]=ga;c[ga+8>>2]=ga;break g}}else{Ja=W}}while(0);W=Ja+8|0;aa=c[W>>2]|0;Z=c[28008>>2]|0;if(Ja>>>0<Z>>>0){Wb()}if(aa>>>0<Z>>>0){Wb()}else{c[aa+12>>2]=ga;c[W>>2]=ga;c[ga+8>>2]=aa;c[ga+12>>2]=Ja;c[ga+24>>2]=0;break}}}else{aa=c[28008>>2]|0;if((aa|0)==0|da>>>0<aa>>>0){c[28008>>2]=da}c[28440>>2]=da;c[28444>>2]=ea;c[28452>>2]=0;c[28028>>2]=c[7116];c[28024>>2]=-1;aa=0;do{W=aa<<1;Z=28032+(W<<2)|0;c[28032+(W+3<<2)>>2]=Z;c[28032+(W+2<<2)>>2]=Z;aa=aa+1|0}while((aa|0)!=32);aa=da+8|0;if((aa&7|0)==0){Ka=0}else{Ka=0-aa&7}aa=ea+ -40-Ka|0;c[28016>>2]=da+Ka;c[28004>>2]=aa;c[da+(Ka+4)>>2]=aa|1;c[da+(ea+ -36)>>2]=40;c[28020>>2]=c[28480>>2]}}while(0);ea=c[28004>>2]|0;if(ea>>>0>B>>>0){da=ea-B|0;c[28004>>2]=da;ea=c[28016>>2]|0;c[28016>>2]=ea+B;c[ea+(B+4)>>2]=da|1;c[ea+4>>2]=B|3;p=ea+8|0;i=b;return p|0}}ea=wc()|0;c[ea>>2]=12;p=0;i=b;return p|0}function Wo(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;b=i;if((a|0)==0){i=b;return}d=a+ -8|0;e=c[28008>>2]|0;if(d>>>0<e>>>0){Wb()}f=c[a+ -4>>2]|0;g=f&3;if((g|0)==1){Wb()}h=f&-8;j=a+(h+ -8)|0;do{if((f&1|0)==0){k=c[d>>2]|0;if((g|0)==0){i=b;return}l=-8-k|0;m=a+l|0;n=k+h|0;if(m>>>0<e>>>0){Wb()}if((m|0)==(c[28012>>2]|0)){o=a+(h+ -4)|0;if((c[o>>2]&3|0)!=3){p=m;q=n;break}c[28e3>>2]=n;c[o>>2]=c[o>>2]&-2;c[a+(l+4)>>2]=n|1;c[j>>2]=n;i=b;return}o=k>>>3;if(k>>>0<256){k=c[a+(l+8)>>2]|0;r=c[a+(l+12)>>2]|0;s=28032+(o<<1<<2)|0;if((k|0)!=(s|0)){if(k>>>0<e>>>0){Wb()}if((c[k+12>>2]|0)!=(m|0)){Wb()}}if((r|0)==(k|0)){c[6998]=c[6998]&~(1<<o);p=m;q=n;break}if((r|0)!=(s|0)){if(r>>>0<e>>>0){Wb()}s=r+8|0;if((c[s>>2]|0)==(m|0)){t=s}else{Wb()}}else{t=r+8|0}c[k+12>>2]=r;c[t>>2]=k;p=m;q=n;break}k=c[a+(l+24)>>2]|0;r=c[a+(l+12)>>2]|0;do{if((r|0)==(m|0)){s=a+(l+20)|0;o=c[s>>2]|0;if((o|0)==0){u=a+(l+16)|0;v=c[u>>2]|0;if((v|0)==0){w=0;break}else{x=v;y=u}}else{x=o;y=s}while(1){s=x+20|0;o=c[s>>2]|0;if((o|0)!=0){x=o;y=s;continue}s=x+16|0;o=c[s>>2]|0;if((o|0)==0){break}else{x=o;y=s}}if(y>>>0<e>>>0){Wb()}else{c[y>>2]=0;w=x;break}}else{s=c[a+(l+8)>>2]|0;if(s>>>0<e>>>0){Wb()}o=s+12|0;if((c[o>>2]|0)!=(m|0)){Wb()}u=r+8|0;if((c[u>>2]|0)==(m|0)){c[o>>2]=r;c[u>>2]=s;w=r;break}else{Wb()}}}while(0);if((k|0)!=0){r=c[a+(l+28)>>2]|0;s=28296+(r<<2)|0;if((m|0)==(c[s>>2]|0)){c[s>>2]=w;if((w|0)==0){c[27996>>2]=c[27996>>2]&~(1<<r);p=m;q=n;break}}else{if(k>>>0<(c[28008>>2]|0)>>>0){Wb()}r=k+16|0;if((c[r>>2]|0)==(m|0)){c[r>>2]=w}else{c[k+20>>2]=w}if((w|0)==0){p=m;q=n;break}}if(w>>>0<(c[28008>>2]|0)>>>0){Wb()}c[w+24>>2]=k;r=c[a+(l+16)>>2]|0;do{if((r|0)!=0){if(r>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[w+16>>2]=r;c[r+24>>2]=w;break}}}while(0);r=c[a+(l+20)>>2]|0;if((r|0)!=0){if(r>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[w+20>>2]=r;c[r+24>>2]=w;p=m;q=n;break}}else{p=m;q=n}}else{p=m;q=n}}else{p=d;q=h}}while(0);if(!(p>>>0<j>>>0)){Wb()}d=a+(h+ -4)|0;w=c[d>>2]|0;if((w&1|0)==0){Wb()}if((w&2|0)==0){if((j|0)==(c[28016>>2]|0)){e=(c[28004>>2]|0)+q|0;c[28004>>2]=e;c[28016>>2]=p;c[p+4>>2]=e|1;if((p|0)!=(c[28012>>2]|0)){i=b;return}c[28012>>2]=0;c[28e3>>2]=0;i=b;return}if((j|0)==(c[28012>>2]|0)){e=(c[28e3>>2]|0)+q|0;c[28e3>>2]=e;c[28012>>2]=p;c[p+4>>2]=e|1;c[p+e>>2]=e;i=b;return}e=(w&-8)+q|0;x=w>>>3;do{if(!(w>>>0<256)){y=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(j|0)){g=a+(h+12)|0;f=c[g>>2]|0;if((f|0)==0){r=a+(h+8)|0;k=c[r>>2]|0;if((k|0)==0){z=0;break}else{A=k;B=r}}else{A=f;B=g}while(1){g=A+20|0;f=c[g>>2]|0;if((f|0)!=0){A=f;B=g;continue}g=A+16|0;f=c[g>>2]|0;if((f|0)==0){break}else{A=f;B=g}}if(B>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[B>>2]=0;z=A;break}}else{g=c[a+h>>2]|0;if(g>>>0<(c[28008>>2]|0)>>>0){Wb()}f=g+12|0;if((c[f>>2]|0)!=(j|0)){Wb()}r=t+8|0;if((c[r>>2]|0)==(j|0)){c[f>>2]=t;c[r>>2]=g;z=t;break}else{Wb()}}}while(0);if((y|0)!=0){t=c[a+(h+20)>>2]|0;n=28296+(t<<2)|0;if((j|0)==(c[n>>2]|0)){c[n>>2]=z;if((z|0)==0){c[27996>>2]=c[27996>>2]&~(1<<t);break}}else{if(y>>>0<(c[28008>>2]|0)>>>0){Wb()}t=y+16|0;if((c[t>>2]|0)==(j|0)){c[t>>2]=z}else{c[y+20>>2]=z}if((z|0)==0){break}}if(z>>>0<(c[28008>>2]|0)>>>0){Wb()}c[z+24>>2]=y;t=c[a+(h+8)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[z+16>>2]=t;c[t+24>>2]=z;break}}}while(0);t=c[a+(h+12)>>2]|0;if((t|0)!=0){if(t>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[z+20>>2]=t;c[t+24>>2]=z;break}}}}else{t=c[a+h>>2]|0;y=c[a+(h|4)>>2]|0;n=28032+(x<<1<<2)|0;if((t|0)!=(n|0)){if(t>>>0<(c[28008>>2]|0)>>>0){Wb()}if((c[t+12>>2]|0)!=(j|0)){Wb()}}if((y|0)==(t|0)){c[6998]=c[6998]&~(1<<x);break}if((y|0)!=(n|0)){if(y>>>0<(c[28008>>2]|0)>>>0){Wb()}n=y+8|0;if((c[n>>2]|0)==(j|0)){C=n}else{Wb()}}else{C=y+8|0}c[t+12>>2]=y;c[C>>2]=t}}while(0);c[p+4>>2]=e|1;c[p+e>>2]=e;if((p|0)==(c[28012>>2]|0)){c[28e3>>2]=e;i=b;return}else{D=e}}else{c[d>>2]=w&-2;c[p+4>>2]=q|1;c[p+q>>2]=q;D=q}q=D>>>3;if(D>>>0<256){w=q<<1;d=28032+(w<<2)|0;e=c[6998]|0;C=1<<q;if((e&C|0)!=0){q=28032+(w+2<<2)|0;j=c[q>>2]|0;if(j>>>0<(c[28008>>2]|0)>>>0){Wb()}else{E=q;F=j}}else{c[6998]=e|C;E=28032+(w+2<<2)|0;F=d}c[E>>2]=p;c[F+12>>2]=p;c[p+8>>2]=F;c[p+12>>2]=d;i=b;return}d=D>>>8;if((d|0)!=0){if(D>>>0>16777215){G=31}else{F=(d+1048320|0)>>>16&8;E=d<<F;d=(E+520192|0)>>>16&4;w=E<<d;E=(w+245760|0)>>>16&2;C=14-(d|F|E)+(w<<E>>>15)|0;G=D>>>(C+7|0)&1|C<<1}}else{G=0}C=28296+(G<<2)|0;c[p+28>>2]=G;c[p+20>>2]=0;c[p+16>>2]=0;E=c[27996>>2]|0;w=1<<G;a:do{if((E&w|0)!=0){F=c[C>>2]|0;if((G|0)==31){H=0}else{H=25-(G>>>1)|0}b:do{if((c[F+4>>2]&-8|0)!=(D|0)){d=D<<H;e=F;while(1){I=e+(d>>>31<<2)+16|0;j=c[I>>2]|0;if((j|0)==0){break}if((c[j+4>>2]&-8|0)==(D|0)){J=j;break b}else{d=d<<1;e=j}}if(I>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[I>>2]=p;c[p+24>>2]=e;c[p+12>>2]=p;c[p+8>>2]=p;break a}}else{J=F}}while(0);F=J+8|0;d=c[F>>2]|0;j=c[28008>>2]|0;if(J>>>0<j>>>0){Wb()}if(d>>>0<j>>>0){Wb()}else{c[d+12>>2]=p;c[F>>2]=p;c[p+8>>2]=d;c[p+12>>2]=J;c[p+24>>2]=0;break}}else{c[27996>>2]=E|w;c[C>>2]=p;c[p+24>>2]=C;c[p+12>>2]=p;c[p+8>>2]=p}}while(0);p=(c[28024>>2]|0)+ -1|0;c[28024>>2]=p;if((p|0)==0){K=28448|0}else{i=b;return}while(1){p=c[K>>2]|0;if((p|0)==0){break}else{K=p+8|0}}c[28024>>2]=-1;i=b;return}function Xo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;do{if((a|0)!=0){if(b>>>0>4294967231){e=wc()|0;c[e>>2]=12;f=0;break}if(b>>>0<11){g=16}else{g=b+11&-8}e=Yo(a+ -8|0,g)|0;if((e|0)!=0){f=e+8|0;break}e=Vo(b)|0;if((e|0)==0){f=0}else{h=c[a+ -4>>2]|0;j=(h&-8)-((h&3|0)==0?8:4)|0;tp(e|0,a|0,(j>>>0<b>>>0?j:b)|0)|0;Wo(a);f=e}}else{f=Vo(b)|0}}while(0);i=d;return f|0}function Yo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;e=a+4|0;f=c[e>>2]|0;g=f&-8;h=a+g|0;j=c[28008>>2]|0;if(a>>>0<j>>>0){Wb()}k=f&3;if(!((k|0)!=1&a>>>0<h>>>0)){Wb()}l=a+(g|4)|0;m=c[l>>2]|0;if((m&1|0)==0){Wb()}if((k|0)==0){if(b>>>0<256){n=0;i=d;return n|0}if(!(g>>>0<(b+4|0)>>>0)?!((g-b|0)>>>0>c[28472>>2]<<1>>>0):0){n=a;i=d;return n|0}n=0;i=d;return n|0}if(!(g>>>0<b>>>0)){k=g-b|0;if(!(k>>>0>15)){n=a;i=d;return n|0}c[e>>2]=f&1|b|2;c[a+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;Zo(a+b|0,k);n=a;i=d;return n|0}if((h|0)==(c[28016>>2]|0)){k=(c[28004>>2]|0)+g|0;if(!(k>>>0>b>>>0)){n=0;i=d;return n|0}l=k-b|0;c[e>>2]=f&1|b|2;c[a+(b+4)>>2]=l|1;c[28016>>2]=a+b;c[28004>>2]=l;n=a;i=d;return n|0}if((h|0)==(c[28012>>2]|0)){l=(c[28e3>>2]|0)+g|0;if(l>>>0<b>>>0){n=0;i=d;return n|0}k=l-b|0;if(k>>>0>15){c[e>>2]=f&1|b|2;c[a+(b+4)>>2]=k|1;c[a+l>>2]=k;o=a+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=a+b|0;q=k}else{c[e>>2]=f&1|l|2;f=a+(l+4)|0;c[f>>2]=c[f>>2]|1;p=0;q=0}c[28e3>>2]=q;c[28012>>2]=p;n=a;i=d;return n|0}if((m&2|0)!=0){n=0;i=d;return n|0}p=(m&-8)+g|0;if(p>>>0<b>>>0){n=0;i=d;return n|0}q=p-b|0;f=m>>>3;do{if(!(m>>>0<256)){l=c[a+(g+24)>>2]|0;k=c[a+(g+12)>>2]|0;do{if((k|0)==(h|0)){o=a+(g+20)|0;r=c[o>>2]|0;if((r|0)==0){s=a+(g+16)|0;t=c[s>>2]|0;if((t|0)==0){u=0;break}else{v=t;w=s}}else{v=r;w=o}while(1){o=v+20|0;r=c[o>>2]|0;if((r|0)!=0){v=r;w=o;continue}o=v+16|0;r=c[o>>2]|0;if((r|0)==0){break}else{v=r;w=o}}if(w>>>0<j>>>0){Wb()}else{c[w>>2]=0;u=v;break}}else{o=c[a+(g+8)>>2]|0;if(o>>>0<j>>>0){Wb()}r=o+12|0;if((c[r>>2]|0)!=(h|0)){Wb()}s=k+8|0;if((c[s>>2]|0)==(h|0)){c[r>>2]=k;c[s>>2]=o;u=k;break}else{Wb()}}}while(0);if((l|0)!=0){k=c[a+(g+28)>>2]|0;o=28296+(k<<2)|0;if((h|0)==(c[o>>2]|0)){c[o>>2]=u;if((u|0)==0){c[27996>>2]=c[27996>>2]&~(1<<k);break}}else{if(l>>>0<(c[28008>>2]|0)>>>0){Wb()}k=l+16|0;if((c[k>>2]|0)==(h|0)){c[k>>2]=u}else{c[l+20>>2]=u}if((u|0)==0){break}}if(u>>>0<(c[28008>>2]|0)>>>0){Wb()}c[u+24>>2]=l;k=c[a+(g+16)>>2]|0;do{if((k|0)!=0){if(k>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[u+16>>2]=k;c[k+24>>2]=u;break}}}while(0);k=c[a+(g+20)>>2]|0;if((k|0)!=0){if(k>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[u+20>>2]=k;c[k+24>>2]=u;break}}}}else{k=c[a+(g+8)>>2]|0;l=c[a+(g+12)>>2]|0;o=28032+(f<<1<<2)|0;if((k|0)!=(o|0)){if(k>>>0<j>>>0){Wb()}if((c[k+12>>2]|0)!=(h|0)){Wb()}}if((l|0)==(k|0)){c[6998]=c[6998]&~(1<<f);break}if((l|0)!=(o|0)){if(l>>>0<j>>>0){Wb()}o=l+8|0;if((c[o>>2]|0)==(h|0)){x=o}else{Wb()}}else{x=l+8|0}c[k+12>>2]=l;c[x>>2]=k}}while(0);if(q>>>0<16){c[e>>2]=p|c[e>>2]&1|2;x=a+(p|4)|0;c[x>>2]=c[x>>2]|1;n=a;i=d;return n|0}else{c[e>>2]=c[e>>2]&1|b|2;c[a+(b+4)>>2]=q|3;e=a+(p|4)|0;c[e>>2]=c[e>>2]|1;Zo(a+b|0,q);n=a;i=d;return n|0}return 0}function Zo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;d=i;e=a+b|0;f=c[a+4>>2]|0;do{if((f&1|0)==0){g=c[a>>2]|0;if((f&3|0)==0){i=d;return}h=a+(0-g)|0;j=g+b|0;k=c[28008>>2]|0;if(h>>>0<k>>>0){Wb()}if((h|0)==(c[28012>>2]|0)){l=a+(b+4)|0;if((c[l>>2]&3|0)!=3){m=h;n=j;break}c[28e3>>2]=j;c[l>>2]=c[l>>2]&-2;c[a+(4-g)>>2]=j|1;c[e>>2]=j;i=d;return}l=g>>>3;if(g>>>0<256){o=c[a+(8-g)>>2]|0;p=c[a+(12-g)>>2]|0;q=28032+(l<<1<<2)|0;if((o|0)!=(q|0)){if(o>>>0<k>>>0){Wb()}if((c[o+12>>2]|0)!=(h|0)){Wb()}}if((p|0)==(o|0)){c[6998]=c[6998]&~(1<<l);m=h;n=j;break}if((p|0)!=(q|0)){if(p>>>0<k>>>0){Wb()}q=p+8|0;if((c[q>>2]|0)==(h|0)){r=q}else{Wb()}}else{r=p+8|0}c[o+12>>2]=p;c[r>>2]=o;m=h;n=j;break}o=c[a+(24-g)>>2]|0;p=c[a+(12-g)>>2]|0;do{if((p|0)==(h|0)){q=16-g|0;l=a+(q+4)|0;s=c[l>>2]|0;if((s|0)==0){t=a+q|0;q=c[t>>2]|0;if((q|0)==0){u=0;break}else{v=q;w=t}}else{v=s;w=l}while(1){l=v+20|0;s=c[l>>2]|0;if((s|0)!=0){v=s;w=l;continue}l=v+16|0;s=c[l>>2]|0;if((s|0)==0){break}else{v=s;w=l}}if(w>>>0<k>>>0){Wb()}else{c[w>>2]=0;u=v;break}}else{l=c[a+(8-g)>>2]|0;if(l>>>0<k>>>0){Wb()}s=l+12|0;if((c[s>>2]|0)!=(h|0)){Wb()}t=p+8|0;if((c[t>>2]|0)==(h|0)){c[s>>2]=p;c[t>>2]=l;u=p;break}else{Wb()}}}while(0);if((o|0)!=0){p=c[a+(28-g)>>2]|0;k=28296+(p<<2)|0;if((h|0)==(c[k>>2]|0)){c[k>>2]=u;if((u|0)==0){c[27996>>2]=c[27996>>2]&~(1<<p);m=h;n=j;break}}else{if(o>>>0<(c[28008>>2]|0)>>>0){Wb()}p=o+16|0;if((c[p>>2]|0)==(h|0)){c[p>>2]=u}else{c[o+20>>2]=u}if((u|0)==0){m=h;n=j;break}}if(u>>>0<(c[28008>>2]|0)>>>0){Wb()}c[u+24>>2]=o;p=16-g|0;k=c[a+p>>2]|0;do{if((k|0)!=0){if(k>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[u+16>>2]=k;c[k+24>>2]=u;break}}}while(0);k=c[a+(p+4)>>2]|0;if((k|0)!=0){if(k>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[u+20>>2]=k;c[k+24>>2]=u;m=h;n=j;break}}else{m=h;n=j}}else{m=h;n=j}}else{m=a;n=b}}while(0);u=c[28008>>2]|0;if(e>>>0<u>>>0){Wb()}v=a+(b+4)|0;w=c[v>>2]|0;if((w&2|0)==0){if((e|0)==(c[28016>>2]|0)){r=(c[28004>>2]|0)+n|0;c[28004>>2]=r;c[28016>>2]=m;c[m+4>>2]=r|1;if((m|0)!=(c[28012>>2]|0)){i=d;return}c[28012>>2]=0;c[28e3>>2]=0;i=d;return}if((e|0)==(c[28012>>2]|0)){r=(c[28e3>>2]|0)+n|0;c[28e3>>2]=r;c[28012>>2]=m;c[m+4>>2]=r|1;c[m+r>>2]=r;i=d;return}r=(w&-8)+n|0;f=w>>>3;do{if(!(w>>>0<256)){k=c[a+(b+24)>>2]|0;g=c[a+(b+12)>>2]|0;do{if((g|0)==(e|0)){o=a+(b+20)|0;l=c[o>>2]|0;if((l|0)==0){t=a+(b+16)|0;s=c[t>>2]|0;if((s|0)==0){x=0;break}else{y=s;z=t}}else{y=l;z=o}while(1){o=y+20|0;l=c[o>>2]|0;if((l|0)!=0){y=l;z=o;continue}o=y+16|0;l=c[o>>2]|0;if((l|0)==0){break}else{y=l;z=o}}if(z>>>0<u>>>0){Wb()}else{c[z>>2]=0;x=y;break}}else{o=c[a+(b+8)>>2]|0;if(o>>>0<u>>>0){Wb()}l=o+12|0;if((c[l>>2]|0)!=(e|0)){Wb()}t=g+8|0;if((c[t>>2]|0)==(e|0)){c[l>>2]=g;c[t>>2]=o;x=g;break}else{Wb()}}}while(0);if((k|0)!=0){g=c[a+(b+28)>>2]|0;j=28296+(g<<2)|0;if((e|0)==(c[j>>2]|0)){c[j>>2]=x;if((x|0)==0){c[27996>>2]=c[27996>>2]&~(1<<g);break}}else{if(k>>>0<(c[28008>>2]|0)>>>0){Wb()}g=k+16|0;if((c[g>>2]|0)==(e|0)){c[g>>2]=x}else{c[k+20>>2]=x}if((x|0)==0){break}}if(x>>>0<(c[28008>>2]|0)>>>0){Wb()}c[x+24>>2]=k;g=c[a+(b+16)>>2]|0;do{if((g|0)!=0){if(g>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[x+16>>2]=g;c[g+24>>2]=x;break}}}while(0);g=c[a+(b+20)>>2]|0;if((g|0)!=0){if(g>>>0<(c[28008>>2]|0)>>>0){Wb()}else{c[x+20>>2]=g;c[g+24>>2]=x;break}}}}else{g=c[a+(b+8)>>2]|0;k=c[a+(b+12)>>2]|0;j=28032+(f<<1<<2)|0;if((g|0)!=(j|0)){if(g>>>0<u>>>0){Wb()}if((c[g+12>>2]|0)!=(e|0)){Wb()}}if((k|0)==(g|0)){c[6998]=c[6998]&~(1<<f);break}if((k|0)!=(j|0)){if(k>>>0<u>>>0){Wb()}j=k+8|0;if((c[j>>2]|0)==(e|0)){A=j}else{Wb()}}else{A=k+8|0}c[g+12>>2]=k;c[A>>2]=g}}while(0);c[m+4>>2]=r|1;c[m+r>>2]=r;if((m|0)==(c[28012>>2]|0)){c[28e3>>2]=r;i=d;return}else{B=r}}else{c[v>>2]=w&-2;c[m+4>>2]=n|1;c[m+n>>2]=n;B=n}n=B>>>3;if(B>>>0<256){w=n<<1;v=28032+(w<<2)|0;r=c[6998]|0;A=1<<n;if((r&A|0)!=0){n=28032+(w+2<<2)|0;e=c[n>>2]|0;if(e>>>0<(c[28008>>2]|0)>>>0){Wb()}else{C=n;D=e}}else{c[6998]=r|A;C=28032+(w+2<<2)|0;D=v}c[C>>2]=m;c[D+12>>2]=m;c[m+8>>2]=D;c[m+12>>2]=v;i=d;return}v=B>>>8;if((v|0)!=0){if(B>>>0>16777215){E=31}else{D=(v+1048320|0)>>>16&8;C=v<<D;v=(C+520192|0)>>>16&4;w=C<<v;C=(w+245760|0)>>>16&2;A=14-(v|D|C)+(w<<C>>>15)|0;E=B>>>(A+7|0)&1|A<<1}}else{E=0}A=28296+(E<<2)|0;c[m+28>>2]=E;c[m+20>>2]=0;c[m+16>>2]=0;C=c[27996>>2]|0;w=1<<E;if((C&w|0)==0){c[27996>>2]=C|w;c[A>>2]=m;c[m+24>>2]=A;c[m+12>>2]=m;c[m+8>>2]=m;i=d;return}w=c[A>>2]|0;if((E|0)==31){F=0}else{F=25-(E>>>1)|0}a:do{if((c[w+4>>2]&-8|0)==(B|0)){G=w}else{E=B<<F;A=w;while(1){H=A+(E>>>31<<2)+16|0;C=c[H>>2]|0;if((C|0)==0){break}if((c[C+4>>2]&-8|0)==(B|0)){G=C;break a}else{E=E<<1;A=C}}if(H>>>0<(c[28008>>2]|0)>>>0){Wb()}c[H>>2]=m;c[m+24>>2]=A;c[m+12>>2]=m;c[m+8>>2]=m;i=d;return}}while(0);H=G+8|0;B=c[H>>2]|0;w=c[28008>>2]|0;if(G>>>0<w>>>0){Wb()}if(B>>>0<w>>>0){Wb()}c[B+12>>2]=m;c[H>>2]=m;c[m+8>>2]=B;c[m+12>>2]=G;c[m+24>>2]=0;i=d;return}function _o(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;d=(a|0)==0?1:a;while(1){e=Vo(d)|0;if((e|0)!=0){f=6;break}a=c[7122]|0;c[7122]=a+0;if((a|0)==0){f=5;break}Rc[a&1]()}if((f|0)==5){d=Fb(4)|0;c[d>>2]=28504;zc(d|0,28552,131)}else if((f|0)==6){i=b;return e|0}return 0}function $o(a){a=a|0;var b=0,c=0;b=i;c=_o(a)|0;i=b;return c|0}function ap(a){a=a|0;var b=0;b=i;if((a|0)!=0){Wo(a)}i=b;return}function bp(a){a=a|0;var b=0;b=i;ap(a);i=b;return}function cp(a){a=a|0;var b=0;b=i;Ya(a|0);ap(a);i=b;return}function dp(a){a=a|0;var b=0;b=i;Ya(a|0);i=b;return}function ep(a){a=a|0;return 28520}function fp(){var a=0;a=Fb(4)|0;c[a>>2]=28504;zc(a|0,28552,131)}function gp(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0,N=0,O=0.0,P=0,Q=0.0,R=0,S=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0.0,ba=0,ca=0.0,da=0,fa=0.0,ga=0,ha=0.0,ia=0,ja=0.0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0.0,sa=0,ta=0.0,ua=0,va=0,wa=0,xa=0,ya=0.0,za=0,Aa=0.0,Ba=0.0,Ca=0,Da=0.0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,eb=0,fb=0,gb=0,hb=0,ib=0,jb=0,kb=0,lb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,vb=0,wb=0,xb=0,yb=0,zb=0,Ab=0,Bb=0,Cb=0,Db=0,Fb=0,Gb=0,Hb=0,Ib=0,Jb=0,Kb=0,Lb=0,Mb=0,Nb=0,Ob=0,Pb=0,Qb=0,Rb=0,Sb=0,Tb=0,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,_b=0,$b=0,ac=0,bc=0,cc=0,dc=0,ec=0,fc=0,gc=0,hc=0,ic=0,jc=0,kc=0,lc=0,mc=0,nc=0,oc=0,pc=0.0,qc=0,rc=0,sc=0.0,tc=0.0,uc=0.0,vc=0.0,yc=0.0,zc=0.0,Ac=0,Bc=0,Cc=0.0,Dc=0,Ec=0.0,Fc=0,Gc=0,Hc=0,Ic=0;g=i;i=i+512|0;h=g;if((e|0)==2){j=53;k=-1074}else if((e|0)==0){j=24;k=-149}else if((e|0)==1){j=53;k=-1074}else{l=0.0;i=g;return+l}e=b+4|0;m=b+100|0;do{n=c[e>>2]|0;if(n>>>0<(c[m>>2]|0)>>>0){c[e>>2]=n+1;o=d[n]|0}else{o=jp(b)|0}}while((Zb(o|0)|0)!=0);do{if((o|0)==43|(o|0)==45){n=1-(((o|0)==45)<<1)|0;p=c[e>>2]|0;if(p>>>0<(c[m>>2]|0)>>>0){c[e>>2]=p+1;q=d[p]|0;r=n;break}else{q=jp(b)|0;r=n;break}}else{q=o;r=1}}while(0);o=q;q=0;while(1){if((o|32|0)!=(a[28568+q|0]|0)){s=o;t=q;break}do{if(q>>>0<7){n=c[e>>2]|0;if(n>>>0<(c[m>>2]|0)>>>0){c[e>>2]=n+1;u=d[n]|0;break}else{u=jp(b)|0;break}}else{u=o}}while(0);n=q+1|0;if(n>>>0<8){o=u;q=n}else{s=u;t=n;break}}do{if((t|0)==3){v=23}else if((t|0)!=8){u=(f|0)==0;if(!(t>>>0<4|u)){if((t|0)==8){break}else{v=23;break}}a:do{if((t|0)==0){q=s;o=0;while(1){if((q|32|0)!=(a[28584+o|0]|0)){w=q;z=o;break a}do{if(o>>>0<2){n=c[e>>2]|0;if(n>>>0<(c[m>>2]|0)>>>0){c[e>>2]=n+1;A=d[n]|0;break}else{A=jp(b)|0;break}}else{A=q}}while(0);n=o+1|0;if(n>>>0<3){q=A;o=n}else{w=A;z=n;break}}}else{w=s;z=t}}while(0);if((z|0)==0){do{if((w|0)==48){o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;B=d[o]|0}else{B=jp(b)|0}if((B|32|0)!=120){if((c[m>>2]|0)==0){C=48;break}c[e>>2]=(c[e>>2]|0)+ -1;C=48;break}o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;D=d[o]|0;E=0}else{D=jp(b)|0;E=0}while(1){if((D|0)==46){v=70;break}else if((D|0)!=48){F=0;G=0;H=0;J=0;K=D;L=E;M=0;N=0;O=1.0;P=0;Q=0.0;break}o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;D=d[o]|0;E=1;continue}else{D=jp(b)|0;E=1;continue}}b:do{if((v|0)==70){o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;R=d[o]|0}else{R=jp(b)|0}if((R|0)==48){o=-1;q=-1;while(1){n=c[e>>2]|0;if(n>>>0<(c[m>>2]|0)>>>0){c[e>>2]=n+1;S=d[n]|0}else{S=jp(b)|0}if((S|0)!=48){F=0;G=0;H=o;J=q;K=S;L=1;M=1;N=0;O=1.0;P=0;Q=0.0;break b}n=rp(o|0,q|0,-1,-1)|0;o=n;q=I}}else{F=0;G=0;H=0;J=0;K=R;L=E;M=1;N=0;O=1.0;P=0;Q=0.0}}}while(0);c:while(1){q=K+ -48|0;do{if(!(q>>>0<10)){o=K|32;n=(K|0)==46;if(!((o+ -97|0)>>>0<6|n)){U=K;break c}if(n){if((M|0)==0){V=G;W=F;X=G;Y=F;Z=L;_=1;$=N;aa=O;ba=P;ca=Q;break}else{U=46;break c}}else{da=(K|0)>57?o+ -87|0:q;v=84;break}}else{da=q;v=84}}while(0);if((v|0)==84){v=0;do{if(!((F|0)<0|(F|0)==0&G>>>0<8)){if((F|0)<0|(F|0)==0&G>>>0<14){fa=O*.0625;ga=N;ha=fa;ia=P;ja=Q+fa*+(da|0);break}if((da|0)!=0&(N|0)==0){ga=1;ha=O;ia=P;ja=Q+O*.5}else{ga=N;ha=O;ia=P;ja=Q}}else{ga=N;ha=O;ia=da+(P<<4)|0;ja=Q}}while(0);q=rp(G|0,F|0,1,0)|0;V=H;W=J;X=q;Y=I;Z=1;_=M;$=ga;aa=ha;ba=ia;ca=ja}q=c[e>>2]|0;if(q>>>0<(c[m>>2]|0)>>>0){c[e>>2]=q+1;F=Y;G=X;H=V;J=W;K=d[q]|0;L=Z;M=_;N=$;O=aa;P=ba;Q=ca;continue}else{F=Y;G=X;H=V;J=W;K=jp(b)|0;L=Z;M=_;N=$;O=aa;P=ba;Q=ca;continue}}if((L|0)==0){q=(c[m>>2]|0)==0;if(!q){c[e>>2]=(c[e>>2]|0)+ -1}if(!u){if(!q?(q=c[e>>2]|0,c[e>>2]=q+ -1,(M|0)!=0):0){c[e>>2]=q+ -2}}else{ip(b,0)}l=+(r|0)*0.0;i=g;return+l}q=(M|0)==0;o=q?G:H;n=q?F:J;if((F|0)<0|(F|0)==0&G>>>0<8){q=G;p=F;ka=P;while(1){la=ka<<4;ma=rp(q|0,p|0,1,0)|0;na=I;if((na|0)<0|(na|0)==0&ma>>>0<8){q=ma;p=na;ka=la}else{oa=la;break}}}else{oa=P}do{if((U|32|0)==112){ka=hp(b,f)|0;p=I;if((ka|0)==0&(p|0)==-2147483648){if(u){ip(b,0);l=0.0;i=g;return+l}else{if((c[m>>2]|0)==0){pa=0;qa=0;break}c[e>>2]=(c[e>>2]|0)+ -1;pa=0;qa=0;break}}else{pa=ka;qa=p}}else{if((c[m>>2]|0)==0){pa=0;qa=0}else{c[e>>2]=(c[e>>2]|0)+ -1;pa=0;qa=0}}}while(0);p=wp(o|0,n|0,2)|0;ka=rp(p|0,I|0,-32,-1)|0;p=rp(ka|0,I|0,pa|0,qa|0)|0;ka=I;if((oa|0)==0){l=+(r|0)*0.0;i=g;return+l}if((ka|0)>0|(ka|0)==0&p>>>0>(0-k|0)>>>0){q=wc()|0;c[q>>2]=34;l=+(r|0)*1.7976931348623157e+308*1.7976931348623157e+308;i=g;return+l}q=k+ -106|0;la=((q|0)<0)<<31>>31;if((ka|0)<(la|0)|(ka|0)==(la|0)&p>>>0<q>>>0){q=wc()|0;c[q>>2]=34;l=+(r|0)*2.2250738585072014e-308*2.2250738585072014e-308;i=g;return+l}if((oa|0)>-1){q=p;la=ka;na=oa;fa=Q;while(1){ma=na<<1;if(!(fa>=.5)){ra=fa;sa=ma}else{ra=fa+-1.0;sa=ma|1}ta=fa+ra;ma=rp(q|0,la|0,-1,-1)|0;ua=I;if((sa|0)>-1){q=ma;la=ua;na=sa;fa=ta}else{va=ma;wa=ua;xa=sa;ya=ta;break}}}else{va=p;wa=ka;xa=oa;ya=Q}na=qp(32,0,k|0,((k|0)<0)<<31>>31|0)|0;la=rp(va|0,wa|0,na|0,I|0)|0;na=I;if(0>(na|0)|0==(na|0)&j>>>0>la>>>0){za=(la|0)<0?0:la}else{za=j}if((za|0)<53){fa=+(r|0);ta=+xc(+(+kp(1.0,84-za|0)),+fa);if((za|0)<32&ya!=0.0){la=xa&1;Aa=fa;Ba=ta;Ca=(la^1)+xa|0;Da=(la|0)==0?0.0:ya}else{Aa=fa;Ba=ta;Ca=xa;Da=ya}}else{Aa=+(r|0);Ba=0.0;Ca=xa;Da=ya}ta=Aa*Da+(Ba+Aa*+(Ca>>>0))-Ba;if(!(ta!=0.0)){la=wc()|0;c[la>>2]=34}l=+lp(ta,va);i=g;return+l}else{C=w}}while(0);la=k+j|0;na=0-la|0;q=C;n=0;while(1){if((q|0)==46){v=139;break}else if((q|0)!=48){Ea=q;Fa=0;Ga=0;Ha=n;Ia=0;break}o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;q=d[o]|0;n=1;continue}else{q=jp(b)|0;n=1;continue}}d:do{if((v|0)==139){q=c[e>>2]|0;if(q>>>0<(c[m>>2]|0)>>>0){c[e>>2]=q+1;Ja=d[q]|0}else{Ja=jp(b)|0}if((Ja|0)==48){q=-1;o=-1;while(1){ua=c[e>>2]|0;if(ua>>>0<(c[m>>2]|0)>>>0){c[e>>2]=ua+1;Ka=d[ua]|0}else{Ka=jp(b)|0}if((Ka|0)!=48){Ea=Ka;Fa=q;Ga=o;Ha=1;Ia=1;break d}ua=rp(q|0,o|0,-1,-1)|0;q=ua;o=I}}else{Ea=Ja;Fa=0;Ga=0;Ha=n;Ia=1}}}while(0);c[h>>2]=0;n=Ea+ -48|0;o=(Ea|0)==46;e:do{if(n>>>0<10|o){q=h+496|0;ka=Ea;p=0;ua=0;ma=o;La=n;Ma=Fa;Na=Ga;Oa=Ha;Pa=Ia;Qa=0;Ra=0;Sa=0;while(1){do{if(ma){if((Pa|0)==0){Ta=p;Ua=ua;Va=p;Wa=ua;Xa=Oa;Ya=1;Za=Qa;_a=Ra;$a=Sa}else{ab=ka;bb=Ma;cb=Na;db=p;eb=ua;fb=Oa;gb=Qa;hb=Ra;ib=Sa;break e}}else{jb=rp(p|0,ua|0,1,0)|0;kb=I;lb=(ka|0)!=48;if((Ra|0)>=125){if(!lb){Ta=Ma;Ua=Na;Va=jb;Wa=kb;Xa=Oa;Ya=Pa;Za=Qa;_a=Ra;$a=Sa;break}c[q>>2]=c[q>>2]|1;Ta=Ma;Ua=Na;Va=jb;Wa=kb;Xa=Oa;Ya=Pa;Za=Qa;_a=Ra;$a=Sa;break}mb=h+(Ra<<2)|0;if((Qa|0)==0){nb=La}else{nb=ka+ -48+((c[mb>>2]|0)*10|0)|0}c[mb>>2]=nb;mb=Qa+1|0;ob=(mb|0)==9;Ta=Ma;Ua=Na;Va=jb;Wa=kb;Xa=1;Ya=Pa;Za=ob?0:mb;_a=(ob&1)+Ra|0;$a=lb?jb:Sa}}while(0);jb=c[e>>2]|0;if(jb>>>0<(c[m>>2]|0)>>>0){c[e>>2]=jb+1;pb=d[jb]|0}else{pb=jp(b)|0}jb=pb+ -48|0;lb=(pb|0)==46;if(jb>>>0<10|lb){ka=pb;p=Va;ua=Wa;ma=lb;La=jb;Ma=Ta;Na=Ua;Oa=Xa;Pa=Ya;Qa=Za;Ra=_a;Sa=$a}else{qb=pb;rb=Ta;sb=Va;tb=Ua;ub=Wa;vb=Xa;wb=Ya;xb=Za;yb=_a;zb=$a;v=162;break}}}else{qb=Ea;rb=Fa;sb=0;tb=Ga;ub=0;vb=Ha;wb=Ia;xb=0;yb=0;zb=0;v=162}}while(0);if((v|0)==162){n=(wb|0)==0;ab=qb;bb=n?sb:rb;cb=n?ub:tb;db=sb;eb=ub;fb=vb;gb=xb;hb=yb;ib=zb}n=(fb|0)!=0;if(n?(ab|32|0)==101:0){o=hp(b,f)|0;Sa=I;do{if((o|0)==0&(Sa|0)==-2147483648){if(u){ip(b,0);l=0.0;i=g;return+l}else{if((c[m>>2]|0)==0){Ab=0;Bb=0;break}c[e>>2]=(c[e>>2]|0)+ -1;Ab=0;Bb=0;break}}else{Ab=o;Bb=Sa}}while(0);Sa=rp(Ab|0,Bb|0,bb|0,cb|0)|0;Cb=Sa;Db=I}else{if((ab|0)>-1?(c[m>>2]|0)!=0:0){c[e>>2]=(c[e>>2]|0)+ -1;Cb=bb;Db=cb}else{Cb=bb;Db=cb}}if(!n){Sa=wc()|0;c[Sa>>2]=22;ip(b,0);l=0.0;i=g;return+l}Sa=c[h>>2]|0;if((Sa|0)==0){l=+(r|0)*0.0;i=g;return+l}do{if((Cb|0)==(db|0)&(Db|0)==(eb|0)&((eb|0)<0|(eb|0)==0&db>>>0<10)){if(!(j>>>0>30)?(Sa>>>j|0)!=0:0){break}l=+(r|0)*+(Sa>>>0);i=g;return+l}}while(0);Sa=(k|0)/-2|0;n=((Sa|0)<0)<<31>>31;if((Db|0)>(n|0)|(Db|0)==(n|0)&Cb>>>0>Sa>>>0){Sa=wc()|0;c[Sa>>2]=34;l=+(r|0)*1.7976931348623157e+308*1.7976931348623157e+308;i=g;return+l}Sa=k+ -106|0;n=((Sa|0)<0)<<31>>31;if((Db|0)<(n|0)|(Db|0)==(n|0)&Cb>>>0<Sa>>>0){Sa=wc()|0;c[Sa>>2]=34;l=+(r|0)*2.2250738585072014e-308*2.2250738585072014e-308;i=g;return+l}if((gb|0)==0){Fb=hb}else{if((gb|0)<9){Sa=h+(hb<<2)|0;n=c[Sa>>2]|0;o=gb;do{n=n*10|0;o=o+1|0}while((o|0)!=9);c[Sa>>2]=n}Fb=hb+1|0}do{if((ib|0)<9?(ib|0)<=(Cb|0)&(Cb|0)<18:0){if((Cb|0)==9){l=+(r|0)*+((c[h>>2]|0)>>>0);i=g;return+l}if((Cb|0)<9){l=+(r|0)*+((c[h>>2]|0)>>>0)/+(c[28600+(8-Cb<<2)>>2]|0);i=g;return+l}o=j+27+(ea(Cb,-3)|0)|0;Ra=c[h>>2]|0;if((o|0)<=30?(Ra>>>o|0)!=0:0){break}l=+(r|0)*+(Ra>>>0)*+(c[28600+(Cb+ -10<<2)>>2]|0);i=g;return+l}}while(0);n=(Cb|0)%9|0;if((n|0)==0){Gb=0;Hb=0;Ib=Cb;Jb=Fb}else{Sa=(Cb|0)>-1?n:n+9|0;n=c[28600+(8-Sa<<2)>>2]|0;if((Fb|0)!=0){Ra=1e9/(n|0)|0;o=0;Qa=0;Pa=0;Oa=Cb;while(1){Na=h+(Pa<<2)|0;Ma=c[Na>>2]|0;La=((Ma>>>0)/(n>>>0)|0)+Qa|0;c[Na>>2]=La;Kb=ea((Ma>>>0)%(n>>>0)|0,Ra)|0;Ma=Pa+1|0;if((Pa|0)==(o|0)&(La|0)==0){Lb=Ma&127;Mb=Oa+ -9|0}else{Lb=o;Mb=Oa}if((Ma|0)==(Fb|0)){break}else{o=Lb;Qa=Kb;Pa=Ma;Oa=Mb}}if((Kb|0)==0){Nb=Lb;Ob=Mb;Pb=Fb}else{c[h+(Fb<<2)>>2]=Kb;Nb=Lb;Ob=Mb;Pb=Fb+1|0}}else{Nb=0;Ob=Cb;Pb=0}Gb=Nb;Hb=0;Ib=9-Sa+Ob|0;Jb=Pb}f:while(1){Oa=h+(Gb<<2)|0;if((Ib|0)<18){Pa=Hb;Qa=Jb;while(1){o=0;Ra=Qa+127|0;n=Qa;while(1){Ma=Ra&127;La=h+(Ma<<2)|0;Na=wp(c[La>>2]|0,0,29)|0;ma=rp(Na|0,I|0,o|0,0)|0;Na=I;if(Na>>>0>0|(Na|0)==0&ma>>>0>1e9){ua=Gp(ma|0,Na|0,1e9,0)|0;p=Hp(ma|0,Na|0,1e9,0)|0;Qb=p;Rb=ua}else{Qb=ma;Rb=0}c[La>>2]=Qb;La=(Ma|0)==(Gb|0);if((Ma|0)!=(n+127&127|0)|La){Sb=n}else{Sb=(Qb|0)==0?Ma:n}if(La){break}else{o=Rb;Ra=Ma+ -1|0;n=Sb}}n=Pa+ -29|0;if((Rb|0)==0){Pa=n;Qa=Sb}else{Tb=n;Ub=Rb;Vb=Sb;break}}}else{if((Ib|0)==18){Wb=Hb;Xb=Jb}else{Yb=Gb;_b=Hb;$b=Ib;ac=Jb;break}while(1){if(!((c[Oa>>2]|0)>>>0<9007199)){Yb=Gb;_b=Wb;$b=18;ac=Xb;break f}Qa=0;Pa=Xb+127|0;n=Xb;while(1){Ra=Pa&127;o=h+(Ra<<2)|0;Ma=wp(c[o>>2]|0,0,29)|0;La=rp(Ma|0,I|0,Qa|0,0)|0;Ma=I;if(Ma>>>0>0|(Ma|0)==0&La>>>0>1e9){ma=Gp(La|0,Ma|0,1e9,0)|0;ua=Hp(La|0,Ma|0,1e9,0)|0;bc=ua;cc=ma}else{bc=La;cc=0}c[o>>2]=bc;o=(Ra|0)==(Gb|0);if((Ra|0)!=(n+127&127|0)|o){dc=n}else{dc=(bc|0)==0?Ra:n}if(o){break}else{Qa=cc;Pa=Ra+ -1|0;n=dc}}n=Wb+ -29|0;if((cc|0)==0){Wb=n;Xb=dc}else{Tb=n;Ub=cc;Vb=dc;break}}}Oa=Gb+127&127;if((Oa|0)==(Vb|0)){n=Vb+127&127;Pa=h+((Vb+126&127)<<2)|0;c[Pa>>2]=c[Pa>>2]|c[h+(n<<2)>>2];ec=n}else{ec=Vb}c[h+(Oa<<2)>>2]=Ub;Gb=Oa;Hb=Tb;Ib=Ib+9|0;Jb=ec}g:while(1){fc=ac+1&127;Sa=h+((ac+127&127)<<2)|0;Oa=Yb;n=_b;Pa=$b;while(1){Qa=(Pa|0)==18;Ra=(Pa|0)>27?9:1;gc=Oa;hc=n;while(1){o=0;while(1){La=o+gc&127;if((La|0)==(ac|0)){ic=2;break}ma=c[h+(La<<2)>>2]|0;La=c[28592+(o<<2)>>2]|0;if(ma>>>0<La>>>0){ic=2;break}ua=o+1|0;if(ma>>>0>La>>>0){ic=o;break}if((ua|0)<2){o=ua}else{ic=ua;break}}if((ic|0)==2&Qa){break g}jc=Ra+hc|0;if((gc|0)==(ac|0)){gc=ac;hc=jc}else{break}}Qa=(1<<Ra)+ -1|0;o=1e9>>>Ra;kc=gc;lc=0;ua=gc;mc=Pa;do{La=h+(ua<<2)|0;ma=c[La>>2]|0;Ma=(ma>>>Ra)+lc|0;c[La>>2]=Ma;lc=ea(ma&Qa,o)|0;ma=(ua|0)==(kc|0)&(Ma|0)==0;ua=ua+1&127;mc=ma?mc+ -9|0:mc;kc=ma?ua:kc}while((ua|0)!=(ac|0));if((lc|0)==0){Oa=kc;n=jc;Pa=mc;continue}if((fc|0)!=(kc|0)){break}c[Sa>>2]=c[Sa>>2]|1;Oa=kc;n=jc;Pa=mc}c[h+(ac<<2)>>2]=lc;Yb=kc;_b=jc;$b=mc;ac=fc}Pa=gc&127;if((Pa|0)==(ac|0)){c[h+(fc+ -1<<2)>>2]=0;nc=fc}else{nc=ac}ta=+((c[h+(Pa<<2)>>2]|0)>>>0);Pa=gc+1&127;if((Pa|0)==(nc|0)){n=nc+1&127;c[h+(n+ -1<<2)>>2]=0;oc=n}else{oc=nc}fa=+(r|0);pc=fa*(ta*1.0e9+ +((c[h+(Pa<<2)>>2]|0)>>>0));Pa=hc+53|0;n=Pa-k|0;if((n|0)<(j|0)){qc=(n|0)<0?0:n;rc=1}else{qc=j;rc=0}if((qc|0)<53){ta=+xc(+(+kp(1.0,105-qc|0)),+pc);sc=+Eb(+pc,+(+kp(1.0,53-qc|0)));tc=ta;uc=sc;vc=ta+(pc-sc)}else{tc=0.0;uc=0.0;vc=pc}Oa=gc+2&127;if((Oa|0)!=(oc|0)){Sa=c[h+(Oa<<2)>>2]|0;do{if(!(Sa>>>0<5e8)){if(Sa>>>0>5e8){yc=fa*.75+uc;break}if((gc+3&127|0)==(oc|0)){yc=fa*.5+uc;break}else{yc=fa*.75+uc;break}}else{if((Sa|0)==0?(gc+3&127|0)==(oc|0):0){yc=uc;break}yc=fa*.25+uc}}while(0);if((53-qc|0)>1?!(+Eb(+yc,1.0)!=0.0):0){zc=yc+1.0}else{zc=yc}}else{zc=uc}fa=vc+zc-tc;do{if((Pa&2147483647|0)>(-2-la|0)){if(!(+T(+fa)>=9007199254740992.0)){Ac=rc;Bc=hc;Cc=fa}else{Ac=(rc|0)!=0&(qc|0)==(n|0)?0:rc;Bc=hc+1|0;Cc=fa*.5}if((Bc+50|0)<=(na|0)?!((Ac|0)!=0&zc!=0.0):0){Dc=Bc;Ec=Cc;break}Sa=wc()|0;c[Sa>>2]=34;Dc=Bc;Ec=Cc}else{Dc=hc;Ec=fa}}while(0);l=+lp(Ec,Dc);i=g;return+l}else if((z|0)==3){na=c[e>>2]|0;if(na>>>0<(c[m>>2]|0)>>>0){c[e>>2]=na+1;Fc=d[na]|0}else{Fc=jp(b)|0}if((Fc|0)==40){Gc=1}else{if((c[m>>2]|0)==0){l=x;i=g;return+l}c[e>>2]=(c[e>>2]|0)+ -1;l=x;i=g;return+l}while(1){na=c[e>>2]|0;if(na>>>0<(c[m>>2]|0)>>>0){c[e>>2]=na+1;Hc=d[na]|0}else{Hc=jp(b)|0}if(!((Hc+ -48|0)>>>0<10|(Hc+ -65|0)>>>0<26)?!((Hc+ -97|0)>>>0<26|(Hc|0)==95):0){break}Gc=Gc+1|0}if((Hc|0)==41){l=x;i=g;return+l}na=(c[m>>2]|0)==0;if(!na){c[e>>2]=(c[e>>2]|0)+ -1}if(u){n=wc()|0;c[n>>2]=22;ip(b,0);l=0.0;i=g;return+l}if((Gc|0)==0|na){l=x;i=g;return+l}else{Ic=Gc}while(1){na=Ic+ -1|0;c[e>>2]=(c[e>>2]|0)+ -1;if((na|0)==0){l=x;break}else{Ic=na}}i=g;return+l}else{if((c[m>>2]|0)!=0){c[e>>2]=(c[e>>2]|0)+ -1}u=wc()|0;c[u>>2]=22;ip(b,0);l=0.0;i=g;return+l}}}while(0);if((v|0)==23){v=(c[m>>2]|0)==0;if(!v){c[e>>2]=(c[e>>2]|0)+ -1}if(!(t>>>0<4|(f|0)==0|v)){v=t;do{c[e>>2]=(c[e>>2]|0)+ -1;v=v+ -1|0}while(v>>>0>3)}}l=+(r|0)*y;i=g;return+l}function hp(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;e=i;f=a+4|0;g=c[f>>2]|0;h=a+100|0;if(g>>>0<(c[h>>2]|0)>>>0){c[f>>2]=g+1;j=d[g]|0}else{j=jp(a)|0}if((j|0)==43|(j|0)==45){g=(j|0)==45|0;k=c[f>>2]|0;if(k>>>0<(c[h>>2]|0)>>>0){c[f>>2]=k+1;l=d[k]|0}else{l=jp(a)|0}if(!((l+ -48|0)>>>0<10|(b|0)==0)?(c[h>>2]|0)!=0:0){c[f>>2]=(c[f>>2]|0)+ -1;m=l;n=g}else{m=l;n=g}}else{m=j;n=0}if((m+ -48|0)>>>0>9){if((c[h>>2]|0)==0){o=-2147483648;p=0;I=o;i=e;return p|0}c[f>>2]=(c[f>>2]|0)+ -1;o=-2147483648;p=0;I=o;i=e;return p|0}else{q=m;r=0}while(1){s=q+ -48+r|0;m=c[f>>2]|0;if(m>>>0<(c[h>>2]|0)>>>0){c[f>>2]=m+1;t=d[m]|0}else{t=jp(a)|0}if(!((t+ -48|0)>>>0<10&(s|0)<214748364)){break}q=t;r=s*10|0}r=((s|0)<0)<<31>>31;if((t+ -48|0)>>>0<10){q=s;m=r;j=t;while(1){g=Fp(q|0,m|0,10,0)|0;l=I;b=rp(j|0,((j|0)<0)<<31>>31|0,-48,-1)|0;k=rp(b|0,I|0,g|0,l|0)|0;l=I;g=c[f>>2]|0;if(g>>>0<(c[h>>2]|0)>>>0){c[f>>2]=g+1;u=d[g]|0}else{u=jp(a)|0}if((u+ -48|0)>>>0<10&((l|0)<21474836|(l|0)==21474836&k>>>0<2061584302)){q=k;m=l;j=u}else{v=k;w=l;x=u;break}}}else{v=s;w=r;x=t}if((x+ -48|0)>>>0<10){do{x=c[f>>2]|0;if(x>>>0<(c[h>>2]|0)>>>0){c[f>>2]=x+1;y=d[x]|0}else{y=jp(a)|0}}while((y+ -48|0)>>>0<10)}if((c[h>>2]|0)!=0){c[f>>2]=(c[f>>2]|0)+ -1}f=(n|0)!=0;n=qp(0,0,v|0,w|0)|0;o=f?I:w;p=f?n:v;I=o;i=e;return p|0}function ip(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;c[a+104>>2]=b;e=c[a+8>>2]|0;f=c[a+4>>2]|0;g=e-f|0;c[a+108>>2]=g;if((b|0)!=0&(g|0)>(b|0)){c[a+100>>2]=f+b;i=d;return}else{c[a+100>>2]=e;i=d;return}}function jp(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;f=b+104|0;g=c[f>>2]|0;if(!((g|0)!=0?(c[b+108>>2]|0)>=(g|0):0)){h=3}if((h|0)==3?(h=np(b)|0,(h|0)>=0):0){g=c[f>>2]|0;f=c[b+8>>2]|0;if((g|0)!=0?(j=c[b+4>>2]|0,k=g-(c[b+108>>2]|0)+ -1|0,(f-j|0)>(k|0)):0){c[b+100>>2]=j+k}else{c[b+100>>2]=f}k=c[b+4>>2]|0;if((f|0)!=0){j=b+108|0;c[j>>2]=f+1-k+(c[j>>2]|0)}j=k+ -1|0;if((d[j]|0|0)==(h|0)){l=h;i=e;return l|0}a[j]=h;l=h;i=e;return l|0}c[b+100>>2]=0;l=-1;i=e;return l|0}function kp(a,b){a=+a;b=b|0;var d=0,e=0.0,f=0,g=0,j=0,l=0.0;d=i;if((b|0)>1023){e=a*8.98846567431158e+307;f=b+ -1023|0;if((f|0)>1023){g=b+ -2046|0;j=(g|0)>1023?1023:g;l=e*8.98846567431158e+307}else{j=f;l=e}}else{if((b|0)<-1022){e=a*2.2250738585072014e-308;f=b+1022|0;if((f|0)<-1022){g=b+2044|0;j=(g|0)<-1022?-1022:g;l=e*2.2250738585072014e-308}else{j=f;l=e}}else{j=b;l=a}}b=wp(j+1023|0,0,52)|0;j=I;c[k>>2]=b;c[k+4>>2]=j;a=l*+h[k>>3];i=d;return+a}function lp(a,b){a=+a;b=b|0;var c=0,d=0.0;c=i;d=+kp(a,b);i=c;return+d}function mp(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;e=b+74|0;f=a[e]|0;a[e]=f+255|f;f=b+20|0;e=b+44|0;if((c[f>>2]|0)>>>0>(c[e>>2]|0)>>>0){Gc[c[b+36>>2]&31](b,0,0)|0}c[b+16>>2]=0;c[b+28>>2]=0;c[f>>2]=0;f=c[b>>2]|0;if((f&20|0)==0){g=c[e>>2]|0;c[b+8>>2]=g;c[b+4>>2]=g;h=0;i=d;return h|0}if((f&4|0)==0){h=-1;i=d;return h|0}c[b>>2]=f|32;h=-1;i=d;return h|0}function np(a){a=a|0;var b=0,e=0,f=0;b=i;i=i+16|0;e=b;if((c[a+8>>2]|0)==0?(mp(a)|0)!=0:0){f=-1}else{if((Gc[c[a+32>>2]&31](a,e,1)|0)==1){f=d[e]|0}else{f=-1}}i=b;return f|0}function op(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0.0,j=0,k=0;d=i;i=i+112|0;e=d;f=e+0|0;g=f+112|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(g|0));f=e+4|0;c[f>>2]=a;g=e+8|0;c[g>>2]=-1;c[e+44>>2]=a;c[e+76>>2]=-1;ip(e,0);h=+gp(e,2,1);j=(c[f>>2]|0)-(c[g>>2]|0)+(c[e+108>>2]|0)|0;if((b|0)==0){i=d;return+h}if((j|0)==0){k=a}else{k=a+j|0}c[b>>2]=k;i=d;return+h}function pp(){c[4146]=o;c[4172]=o;c[6910]=o;c[7140]=o}function qp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b-d>>>0;e=b-d-(c>>>0>a>>>0|0)>>>0;return(I=e,a-c>>>0|0)|0}function rp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=a+c>>>0;return(I=b+d+(e>>>0<a>>>0|0)>>>0,e|0)|0}function sp(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function tp(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return Pa(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function up(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;if((c|0)<(b|0)&(b|0)<(c+d|0)){e=b;c=c+d|0;b=b+d|0;while((d|0)>0){b=b-1|0;c=c-1|0;d=d-1|0;a[b]=a[c]|0}b=e}else{tp(b,c,d)|0}return b|0}function vp(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function wp(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){I=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}I=a<<c-32;return 0}function xp(i,j,k,l,m,n,o,p){i=i;j=j;k=k;l=l;m=m;n=n;o=o;p=p;a=i;b=j;c=k;d=l;e=m;f=n;g=o;h=p}function yp(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){I=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}I=0;return b>>>c-32|0}function zp(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){I=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}I=(b|0)<0?-1:0;return b>>c-32|0}function Ap(b){b=b|0;var c=0;c=a[n+(b>>>24)|0]|0;if((c|0)<8)return c|0;c=a[n+(b>>16&255)|0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>8&255)|0]|0;if((c|0)<8)return c+16|0;return(a[n+(b&255)|0]|0)+24|0}function Bp(b){b=b|0;var c=0;c=a[m+(b&255)|0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)|0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)|0]|0;if((c|0)<8)return c+16|0;return(a[m+(b>>>24)|0]|0)+24|0}function Cp(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=a&65535;d=b&65535;e=ea(d,c)|0;f=a>>>16;a=(e>>>16)+(ea(d,f)|0)|0;d=b>>>16;b=ea(d,c)|0;return(I=(a>>>16)+(ea(d,f)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|e&65535|0)|0}function Dp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b>>31|((b|0)<0?-1:0)<<1;f=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;g=d>>31|((d|0)<0?-1:0)<<1;h=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;i=qp(e^a,f^b,e,f)|0;b=I;a=g^e;e=h^f;f=qp((Ip(i,b,qp(g^c,h^d,g,h)|0,I,0)|0)^a,I^e,a,e)|0;return f|0}function Ep(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+8|0;g=f|0;h=b>>31|((b|0)<0?-1:0)<<1;j=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;k=e>>31|((e|0)<0?-1:0)<<1;l=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;m=qp(h^a,j^b,h,j)|0;b=I;Ip(m,b,qp(k^d,l^e,k,l)|0,I,g)|0;l=qp(c[g>>2]^h,c[g+4>>2]^j,h,j)|0;j=I;i=f;return(I=j,l)|0}function Fp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;a=c;c=Cp(e,a)|0;f=I;return(I=(ea(b,a)|0)+(ea(d,e)|0)+f|f&0,c|0|0)|0}function Gp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=Ip(a,b,c,d,0)|0;return e|0}function Hp(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+8|0;g=f|0;Ip(a,b,d,e,g)|0;i=f;return(I=c[g+4>>2]|0,c[g>>2]|0)|0}function Ip(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0;g=a;h=b;i=h;j=d;k=e;l=k;if((i|0)==0){m=(f|0)!=0;if((l|0)==0){if(m){c[f>>2]=(g>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(g>>>0)/(j>>>0)>>>0;return(I=n,o)|0}else{if(!m){n=0;o=0;return(I=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;n=0;o=0;return(I=n,o)|0}}m=(l|0)==0;do{if((j|0)!=0){if(!m){p=(Ap(l|0)|0)-(Ap(i|0)|0)|0;if(p>>>0<=31){q=p+1|0;r=31-p|0;s=p-31>>31;t=q;u=g>>>(q>>>0)&s|i<<r;v=i>>>(q>>>0)&s;w=0;x=g<<r;break}if((f|0)==0){n=0;o=0;return(I=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(I=n,o)|0}r=j-1|0;if((r&j|0)!=0){s=(Ap(j|0)|0)+33-(Ap(i|0)|0)|0;q=64-s|0;p=32-s|0;y=p>>31;z=s-32|0;A=z>>31;t=s;u=p-1>>31&i>>>(z>>>0)|(i<<p|g>>>(s>>>0))&A;v=A&i>>>(s>>>0);w=g<<q&y;x=(i<<q|g>>>(z>>>0))&y|g<<p&s-33>>31;break}if((f|0)!=0){c[f>>2]=r&g;c[f+4>>2]=0}if((j|0)==1){n=h|b&0;o=a|0|0;return(I=n,o)|0}else{r=Bp(j|0)|0;n=i>>>(r>>>0)|0;o=i<<32-r|g>>>(r>>>0)|0;return(I=n,o)|0}}else{if(m){if((f|0)!=0){c[f>>2]=(i>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(i>>>0)/(j>>>0)>>>0;return(I=n,o)|0}if((g|0)==0){if((f|0)!=0){c[f>>2]=0;c[f+4>>2]=(i>>>0)%(l>>>0)}n=0;o=(i>>>0)/(l>>>0)>>>0;return(I=n,o)|0}r=l-1|0;if((r&l|0)==0){if((f|0)!=0){c[f>>2]=a|0;c[f+4>>2]=r&i|b&0}n=0;o=i>>>((Bp(l|0)|0)>>>0);return(I=n,o)|0}r=(Ap(l|0)|0)-(Ap(i|0)|0)|0;if(r>>>0<=30){s=r+1|0;p=31-r|0;t=s;u=i<<p|g>>>(s>>>0);v=i>>>(s>>>0);w=0;x=g<<p;break}if((f|0)==0){n=0;o=0;return(I=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(I=n,o)|0}}while(0);if((t|0)==0){B=x;C=w;D=v;E=u;F=0;G=0}else{b=d|0|0;d=k|e&0;e=rp(b,d,-1,-1)|0;k=I;h=x;x=w;w=v;v=u;u=t;t=0;while(1){H=x>>>31|h<<1;J=t|x<<1;a=v<<1|h>>>31|0;g=v>>>31|w<<1|0;qp(e,k,a,g)|0;i=I;l=i>>31|((i|0)<0?-1:0)<<1;K=l&1;L=qp(a,g,l&b,(((i|0)<0?-1:0)>>31|((i|0)<0?-1:0)<<1)&d)|0;M=I;i=u-1|0;if((i|0)==0){break}else{h=H;x=J;w=M;v=L;u=i;t=K}}B=H;C=J;D=M;E=L;F=0;G=K}K=C;C=0;if((f|0)!=0){c[f>>2]=E;c[f+4>>2]=D}n=(K|0)>>>31|(B|C)<<1|(C<<1|K>>>31)&0|F;o=(K<<1|0>>>31)&-2|G;return(I=n,o)|0}function Jp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Gc[a&31](b|0,c|0,d|0)|0}function Kp(a,b,c){a=a|0;b=b|0;c=+c;Hc[a&3](b|0,+c)}function Lp(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Ic[a&3](b|0,c|0,d|0,e|0,f|0)}function Mp(a,b){a=a|0;b=b|0;Jc[a&255](b|0)}function Np(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;Kc[a&63](b|0,c|0,d|0,e|0,f|0,g|0,h|0)}function Op(a,b,c){a=a|0;b=b|0;c=c|0;Lc[a&63](b|0,c|0)}function Pp(a,b,c,d,e,f,g,h,i,j){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;Mc[a&3](b|0,c|0,d|0,e|0,f|0,g|0,h|0,i|0,j|0)}function Qp(a,b){a=a|0;b=b|0;return Nc[a&127](b|0)|0}function Rp(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=+h;Oc[a&3](b|0,c|0,d|0,e|0,f|0,g|0,+h)}function Sp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;Pc[a&15](b|0,c|0,d|0)}function Tp(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=+g;Qc[a&7](b|0,c|0,d|0,e|0,f|0,+g)}function Up(a){a=a|0;Rc[a&1]()}function Vp(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;return Sc[a&15](b|0,c|0,d|0,e|0,f|0,g|0,h|0,i|0)|0}function Wp(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return Tc[a&7](b|0,c|0,d|0,e|0)|0}function Xp(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;Uc[a&7](b|0,c|0,d|0,e|0,f|0,g|0,h|0,i|0)}function Yp(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;Vc[a&15](b|0,c|0,d|0,e|0,f|0,g|0)}function Zp(a,b,c){a=a|0;b=b|0;c=c|0;return Wc[a&15](b|0,c|0)|0}function _p(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return Xc[a&15](b|0,c|0,d|0,e|0,f|0)|0}function $p(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;Yc[a&7](b|0,c|0,d|0,e|0)}function aq(a,b,c){a=a|0;b=b|0;c=c|0;fa(0);return 0}function bq(a,b){a=a|0;b=+b;fa(1)}function cq(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;fa(2)}function dq(a){a=a|0;fa(3)}function eq(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;fa(4)}function fq(a,b){a=a|0;b=b|0;fa(5)}function gq(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;fa(6)}function hq(a){a=a|0;fa(7);return 0}function iq(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=+g;fa(8)}function jq(a,b,c){a=a|0;b=b|0;c=c|0;fa(9)}function kq(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=+f;fa(10)}function lq(){fa(11)}function mq(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;fa(12);return 0}function nq(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;fa(13);return 0}function oq(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;fa(14)}function pq(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;fa(15)}function qq(a,b){a=a|0;b=b|0;fa(16);return 0}function rq(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;fa(17);return 0}function sq(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;fa(18)}




// EMSCRIPTEN_END_FUNCS
var Gc=[aq,Ue,ze,Je,Ne,$e,hf,nf,th,yh,Kf,Ch,fh,kh,Yf,oh,wg,xg,ii,ni,Rl,Wl,Bm,Dm,Gm,mm,rm,tm,wm,Ko,Cf,aq];var Hc=[bq,sd,Bd,bq];var Ic=[cq,Ro,Qo,Po];var Jc=[dq,od,wd,_d,Zd,je,ie,pe,oe,xe,we,De,Ce,He,Ge,Me,Le,_e,Ze,ff,ef,lf,kf,Gf,Hf,Nf,Of,Uf,Vf,$f,ag,mg,lg,rg,qg,tg,Cg,Bg,dh,ch,rh,qh,Fh,Eh,Hh,Gh,Kh,Jh,Mh,Lh,Ph,Oh,Rh,Qh,Uh,Th,Wh,Vh,ai,$h,$g,bi,_h,ci,ei,di,jm,ki,ji,pi,oi,Oi,Ni,qj,pj,Fj,Ej,Tj,Sj,ek,dk,qk,pk,tk,sk,xk,wk,Ik,Hk,Tk,Sk,cl,bl,nl,ml,xl,wl,El,Dl,Kl,Jl,Ql,Pl,Vl,Ul,cm,bm,zm,ym,Zl,Qm,wn,vn,yn,xn,fi,im,lm,Im,Ym,hn,tn,un,Co,Bo,Eo,Ho,Fo,Go,Io,Jo,dp,cp,Ig,me,Ff,km,fo,pl,Wo,mo,lo,ko,jo,io,ho,Tg,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq,dq];var Kc=[eq,qi,si,ui,wi,yi,Ai,Ci,Ei,Gi,Ii,Ki,Pi,Ri,Ti,Vi,Xi,Zi,$i,bj,dj,fj,hj,wj,yj,Kj,Mj,Vj,Wj,Xj,Yj,Zj,gk,hk,ik,jk,kk,Il,Ol,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq,eq];var Lc=[fq,rd,yd,If,Pf,Wf,bg,eh,sh,Ak,Bk,Ck,Dk,Fk,Gk,Lk,Mk,Nk,Ok,Qk,Rk,Wk,Xk,Yk,Zk,$k,al,fl,gl,hl,il,kl,ll,Tl,Yl,Dn,Fn,Hn,En,Gn,In,Df,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq,fq];var Mc=[gq,_j,lk,gq];var Nc=[hq,qd,pd,td,ud,zd,xd,Ad,Cd,Jf,xh,zh,Ah,wh,Qf,Rf,Xf,jh,lh,mh,ih,cg,dg,ng,sg,Yh,Uj,Jn,Ln,Nn,Tn,Vn,Pn,Rn,fk,Kn,Mn,On,Un,Wn,Qn,Sn,yk,zk,Ek,Jk,Kk,Pk,Uk,Vk,_k,dl,el,jl,Um,Vm,Xm,zn,Bn,An,Cn,Mm,Nm,Pm,cn,dn,gn,on,pn,sn,Do,ep,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq,hq];var Oc=[iq,Fl,Ll,iq];var Pc=[jq,qe,re,ye,Ee,Ie,Oe,af,gf,mf,vg,Zh,jq,jq,jq,jq];var Qc=[kq,zj,Cj,Nj,Pj,kq,kq,kq];var Rc=[lq,Xd];var Sc=[mq,Rm,Sm,Jm,Km,Zm,$m,jn,ln,mq,mq,mq,mq,mq,mq,mq];var Tc=[nq,Fm,nm,om,pm,vm,nq,nq];var Uc=[oq,rk,uk,ol,sl,yl,Al,oq];var Vc=[pq,uh,gh,rj,sj,xj,Dj,Gj,Hj,Lj,Qj,Sl,Xl,Uo,To,So];var Wc=[qq,Bh,Lf,Sf,Dh,nh,Zf,eg,ph,Am,Cm,Em,qm,sm,um,qq];var Xc=[rq,gi,li,Hm,Tm,Wm,xm,Lm,Om,bn,en,nn,qn,rq,rq,rq];var Yc=[sq,vh,hh,hi,mi,Lo,Mo,No];return{_i64Subtract:qp,_getOnFullScreenButton:Kd,_free:Wo,_main:ke,_realloc:Xo,_i64Add:rp,_memmove:up,_strlen:sp,_memset:vp,_malloc:Vo,_memcpy:tp,_emscripten_replace_memory:xp,_bitshift64Shl:wp,__GLOBAL__I_a:le,__GLOBAL__I_a64:ue,__GLOBAL__I_a68:Se,__GLOBAL__I_a89:cf,__GLOBAL__I_a163:gg,runPostSets:pp,stackAlloc:Zc,stackSave:_c,stackRestore:$c,setThrew:ad,setTempRet0:dd,setTempRet1:ed,setTempRet2:fd,setTempRet3:gd,setTempRet4:hd,setTempRet5:id,setTempRet6:jd,setTempRet7:kd,setTempRet8:ld,setTempRet9:md,dynCall_iiii:Jp,dynCall_vid:Kp,dynCall_viiiii:Lp,dynCall_vi:Mp,dynCall_viiiiiii:Np,dynCall_vii:Op,dynCall_viiiiiiiii:Pp,dynCall_ii:Qp,dynCall_viiiiiid:Rp,dynCall_viii:Sp,dynCall_viiiiid:Tp,dynCall_v:Up,dynCall_iiiiiiiii:Vp,dynCall_iiiii:Wp,dynCall_viiiiiiii:Xp,dynCall_viiiiii:Yp,dynCall_iii:Zp,dynCall_iiiiii:_p,dynCall_viiii:$p}})


// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_iiii": invoke_iiii, "invoke_vid": invoke_vid, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_viiiiiii": invoke_viiiiiii, "invoke_vii": invoke_vii, "invoke_viiiiiiiii": invoke_viiiiiiiii, "invoke_ii": invoke_ii, "invoke_viiiiiid": invoke_viiiiiid, "invoke_viii": invoke_viii, "invoke_viiiiid": invoke_viiiiid, "invoke_v": invoke_v, "invoke_iiiiiiiii": invoke_iiiiiiiii, "invoke_iiiii": invoke_iiiii, "invoke_viiiiiiii": invoke_viiiiiiii, "invoke_viiiiii": invoke_viiiiii, "invoke_iii": invoke_iii, "invoke_iiiiii": invoke_iiiiii, "invoke_viiii": invoke_viiii, "_fabs": _fabs, "_fread": _fread, "__ZSt9terminatev": __ZSt9terminatev, "___cxa_guard_acquire": ___cxa_guard_acquire, "_SDL_RWFromFile": _SDL_RWFromFile, "___assert_fail": ___assert_fail, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "___ctype_toupper_loc": ___ctype_toupper_loc, "__addDays": __addDays, "_SDL_GetError": _SDL_GetError, "_sbrk": _sbrk, "___cxa_begin_catch": ___cxa_begin_catch, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_sysconf": _sysconf, "_ferror": _ferror, "_fileno": _fileno, "_llvm_stacksave": _llvm_stacksave, "_vsscanf": _vsscanf, "_puts": _puts, "_write": _write, "__isLeapYear": __isLeapYear, "__ZNSt9exceptionD2Ev": __ZNSt9exceptionD2Ev, "___cxa_does_inherit": ___cxa_does_inherit, "__exit": __exit, "_catclose": _catclose, "_SDL_UpdateRect": _SDL_UpdateRect, "_send": _send, "___cxa_is_number_type": ___cxa_is_number_type, "_llvm_stackrestore": _llvm_stackrestore, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_isxdigit_l": _isxdigit_l, "___cxa_guard_release": ___cxa_guard_release, "_SDL_LockSurface": _SDL_LockSurface, "_strerror_r": _strerror_r, "___setErrNo": ___setErrNo, "_newlocale": _newlocale, "_isdigit_l": _isdigit_l, "___resumeException": ___resumeException, "_freelocale": _freelocale, "_abs": _abs, "_printf": _printf, "_sprintf": _sprintf, "_vasprintf": _vasprintf, "_SDL_MapRGB": _SDL_MapRGB, "_SDL_CreateRGBSurface": _SDL_CreateRGBSurface, "_vsnprintf": _vsnprintf, "_strtoull_l": _strtoull_l, "_read": _read, "_SDL_SetVideoMode": _SDL_SetVideoMode, "_fwrite": _fwrite, "_time": _time, "_pthread_mutex_lock": _pthread_mutex_lock, "_catopen": _catopen, "_exit": _exit, "___ctype_b_loc": ___ctype_b_loc, "_fmod": _fmod, "___cxa_allocate_exception": ___cxa_allocate_exception, "_strtoll": _strtoll, "_pwrite": _pwrite, "_open": _open, "_uselocale": _uselocale, "_SDL_Init": _SDL_Init, "_snprintf": _snprintf, "__scanString": __scanString, "_strtoull": _strtoull, "_strftime": _strftime, "_isxdigit": _isxdigit, "__reallyNegative": __reallyNegative, "_pthread_cond_broadcast": _pthread_cond_broadcast, "_recv": _recv, "_fgetc": _fgetc, "__parseInt64": __parseInt64, "__getFloat": __getFloat, "_abort": _abort, "_SDL_MapRGBA": _SDL_MapRGBA, "_SDL_Flip": _SDL_Flip, "_isspace": _isspace, "_fopen": _fopen, "_pthread_cond_wait": _pthread_cond_wait, "_SDL_GetTicks": _SDL_GetTicks, "_emscripten_asm_const": _emscripten_asm_const, "_emscripten_asm_const_int": _emscripten_asm_const_int, "_ungetc": _ungetc, "_fflush": _fflush, "_SDL_FreeRW": _SDL_FreeRW, "_strftime_l": _strftime_l, "_fprintf": _fprintf, "_sscanf": _sscanf, "_SDL_PollEvent": _SDL_PollEvent, "_catgets": _catgets, "_asprintf": _asprintf, "_strtoll_l": _strtoll_l, "_IMG_Load_RW": _IMG_Load_RW, "__arraySum": __arraySum, "___ctype_tolower_loc": ___ctype_tolower_loc, "_SDL_FillRect": _SDL_FillRect, "_fputs": _fputs, "_pthread_mutex_unlock": _pthread_mutex_unlock, "_pread": _pread, "_mkport": _mkport, "_emscripten_set_main_loop": _emscripten_set_main_loop, "___errno_location": ___errno_location, "_copysign": _copysign, "_fputc": _fputc, "___cxa_throw": ___cxa_throw, "_isdigit": _isdigit, "_strerror": _strerror, "__formatString": __formatString, "_atexit": _atexit, "_SDL_UpperBlit": _SDL_UpperBlit, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "__ZTISt9exception": __ZTISt9exception, "___dso_handle": ___dso_handle, "_stderr": _stderr, "_stdin": _stdin, "_stdout": _stdout }, buffer);
var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
var _getOnFullScreenButton = Module["_getOnFullScreenButton"] = asm["_getOnFullScreenButton"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _i64Add = Module["_i64Add"] = asm["_i64Add"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = asm["_emscripten_replace_memory"];
var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
var __GLOBAL__I_a = Module["__GLOBAL__I_a"] = asm["__GLOBAL__I_a"];
var __GLOBAL__I_a64 = Module["__GLOBAL__I_a64"] = asm["__GLOBAL__I_a64"];
var __GLOBAL__I_a68 = Module["__GLOBAL__I_a68"] = asm["__GLOBAL__I_a68"];
var __GLOBAL__I_a89 = Module["__GLOBAL__I_a89"] = asm["__GLOBAL__I_a89"];
var __GLOBAL__I_a163 = Module["__GLOBAL__I_a163"] = asm["__GLOBAL__I_a163"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_vid = Module["dynCall_vid"] = asm["dynCall_vid"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = asm["dynCall_viiiiiii"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = asm["dynCall_viiiiiiiii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viiiiiid = Module["dynCall_viiiiiid"] = asm["dynCall_viiiiiid"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_viiiiid = Module["dynCall_viiiiid"] = asm["dynCall_viiiiid"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = asm["dynCall_iiiiiiiii"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = asm["dynCall_viiiiiiii"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];

Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };


// TODO: strip out parts of this we do not need

//======= begin closure i64 code =======

// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */

var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };


  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.

    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };


  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.


  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};


  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }

    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };


  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };


  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };


  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }

    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }

    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));

    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };


  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.


  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;


  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);


  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);


  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);


  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);


  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);


  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);


  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };


  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };


  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }

    if (this.isZero()) {
      return '0';
    }

    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));

    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);

      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };


  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };


  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };


  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };


  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };


  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };


  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };


  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };


  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }

    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }

    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };


  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };


  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;

    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };


  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };


  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }

    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }

    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;

    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };


  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }

    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }

      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }

      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };


  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };


  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };


  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };


  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };


  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };


  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };


  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };


  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };

  //======= begin jsbn =======

  var navigator = { appName: 'Modern Browser' }; // polyfill a little

  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */

  // Basic JavaScript BN library - subset useful for RSA encryption.

  // Bits per digit
  var dbits;

  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);

  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }

  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }

  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.

  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }

  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);

  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;

  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }

  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }

  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }

  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }

  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }

  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }

  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }

  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }

  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }

  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }

  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }

  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }

  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }

  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }

  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }

  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }

  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }

  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }

  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }

  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;

  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }

  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }

  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }

  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }

  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }

  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;

  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }

  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }

  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;

  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;

  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);

  // jsbn2 stuff

  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }

  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }

  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }

  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }

  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }

  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }

  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }

  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;

  //======= end jsbn =======

  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();

//======= end closure i64 code =======



// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      HEAPU8.set(data, STATIC_BASE);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
      Module.printErr('pre-main prep time: ' + (Date.now() - preloadStartTime) + ' ms');
    }

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.';

  throw 'abort() at ' + stackTrace() + extra;
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}






