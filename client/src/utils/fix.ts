/*fix.js*/ /*修复lodash在小程序中不能使用问题*/
try {
  global.Array = Array;
} catch (e) {
  console.log("Array not support in MINA, skip");
}
try {
  global.Buffer = Buffer;
} catch (e) {
  console.log("Buffer not support in MINA, skip");
}
try {
  global.DataView = DataView;
} catch (e) {
  console.log("DataView not support in MINA, skip");
}
try {
  global.Date = Date;
} catch (e) {
  console.log("Date not support in MINA, skip");
}
try {
  global.Error = Error;
} catch (e) {
  console.log("Error not support in MINA, skip");
}
try {
  global.Float32Array = Float32Array;
} catch (e) {
  console.log("Float32Array not support in MINA, skip");
}
try {
  global.Float64Array = Float64Array;
} catch (e) {
  console.log("Float64Array not support in MINA, skip");
}
try {
  global.Function = Function;
} catch (e) {
  console.log("Function not support in MINA, skip");
}
try {
  global.Int8Array = Int8Array;
} catch (e) {
  console.log("Int8Array not support in MINA, skip");
}
try {
  global.Int16Array = Int16Array;
} catch (e) {
  console.log("Int16Array not support in MINA, skip");
}
try {
  global.Int32Array = Int32Array;
} catch (e) {
  console.log("Int32Array not support in MINA, skip");
}
try {
  global.Map = Map;
} catch (e) {
  console.log("Map not support in MINA, skip");
}
try {
  global.Math = Math;
} catch (e) {
  console.log("Math not support in MINA, skip");
}
try {
  global.Object = Object;
} catch (e) {
  console.log("Object not support in MINA, skip");
}
try {
  global.Promise = Promise;
} catch (e) {
  console.log("Promise not support in MINA, skip");
}
try {
  global.RegExp = RegExp;
} catch (e) {
  console.log("RegExp not support in MINA, skip");
}
try {
  global.Set = Set;
} catch (e) {
  console.log("Set not support in MINA, skip");
}
try {
  global.String = String;
} catch (e) {
  console.log("String not support in MINA, skip");
}
try {
  global.Symbol = Symbol;
} catch (e) {
  console.log("Symbol not support in MINA, skip");
}
try {
  global.TypeError = TypeError;
} catch (e) {
  console.log("TypeError not support in MINA, skip");
}
try {
  global.Uint8Array = Uint8Array;
} catch (e) {
  console.log("Uint8Array not support in MINA, skip");
}
try {
  global.Uint8ClampedArray = Uint8ClampedArray;
} catch (e) {
  console.log("Uint8ClampedArray not support in MINA, skip");
}
try {
  global.Uint16Array = Uint16Array;
} catch (e) {
  console.log("Uint16Array not support in MINA, skip");
}
try {
  global.Uint32Array = Uint32Array;
} catch (e) {
  console.log("Uint32Array not support in MINA, skip");
}
try {
  global.WeakMap = WeakMap;
} catch (e) {
  console.log("WeakMap not support in MINA, skip");
}
try {
  global._ = _;
} catch (e) {
  console.log("_ not support in MINA, skip");
}
try {
  global.clearTimeout = clearTimeout;
} catch (e) {
  console.log("clearTimeout not support in MINA, skip");
}
try {
  global.isFinite = isFinite;
} catch (e) {
  console.log("isFinite not support in MINA, skip");
}
try {
  global.parseInt = parseInt;
} catch (e) {
  console.log("parseInt not support in MINA, skip");
}
try {
  global.setTimeout = setTimeout;
} catch (e) {
  console.log("setTimeout not support in MINA, skip");
}
