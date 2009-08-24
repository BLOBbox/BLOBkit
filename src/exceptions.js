/*
 * Default Exceptions used:
 * - EvalError
 * - RangeError
 * - ReferenceError
 * - SyntaxError
 * - TypeError
 * - URIError
 * 
 * Use try {} catch (e) {};
 * or try {} catch (e instanceOf errorType) {} catch (e) {};
 * to evaluate functions
 */

var InitError = new Error ("Current module has not been inited");
var UnsupportedError = new Error ("Unsupported method or function");
