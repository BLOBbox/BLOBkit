/**
 * Custom Javascript Exceptions
 * 
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
 *
 * @module exceptions
 * @namespace TVB
 * @title Custom Javascript Extensions
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

var ConnectionError = new Error ("Error when trying to connect to server");
var EventError = new Error ("Error when trying to handle events");
var InitError = new Error ("Current module has not been inited");
var UnsupportedError = new Error ("Unsupported method or function");
