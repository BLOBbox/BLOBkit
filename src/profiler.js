/**
 * Profiler
 * @module profiler
 * @namespace TVB
 * @title Profiler
 * @requires tvblob
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * TVBLOB profiler class
 * @class Profiler
 * @namespace TVB
 * @classDescription TVBLOB profiler class
 * @static
 * @return {Void}
 */
TVB.Profiler = {};

/**
 * Register a function to the profiler
 * @method register
 * @param {String} fn The name of the function to be profiled
 * @param {String} namespace The namespace of the funcion, default window
 */
TVB.Profiler.register = function(fn, namespace) {
	try {
		TVB.log("Profiler: register(" + fn + ")");
		if (namespace === undefined) {
			namespace = window;
		}
	
		YAHOO.tool.Profiler.registerFunction(fn, namespace);
	} catch (e) {
		TVB.error("Profiler: register: " + e.message);
		throw e;
	}
};

/**
 * Unregister a function from the profiler and stop profiling it
 * @method unregister
 * @param {String} fn The name of the function to be profiled
 */
TVB.Profiler.unregister = function(fn)
{
	try {
		TVB.log("Profiler: unregister(" + fn + ")");
		YAHOO.tool.Profiler.unregisterFunction(fn);
	} catch (e) {
		TVB.error("Profiler: register: " + e.message);
		throw e;
	}
};

/**
 * Profile a function, logging a lot of usefull informations
 * @method profile
 * @param {String}		fn			Name of the function
 * @param {String} 		namespace	The namespace of the funcion, default window
 * @param {Function}	callback	The function to be profiled passed as a callback
 * @param {Object}		params		Parameters to pass to the function
 */
TVB.Profiler.profile = function(fn,namespace,callback,params) {
	try {
		TVB.log("Profiler: profile(" + fn + ")");
		
		$PR.register(fn,namespace);
	
		var rv = callback(params);
	
		var min = TVB.Profiler.minTime(fn);
		var max = TVB.Profiler.maxTime(fn);
		var avg = TVB.Profiler.averageTime(fn);
		var cc = $PR.callCount(fn);
	
		$PR.unregister(fn);
	
		TVB.log("Profiler: " + fn + ': average time ' + avg + ' ms');
		TVB.log("Profiler: " + fn + ': min time ' + min + ' ms');
		TVB.log("Profiler: " + fn + ': max time ' + max + ' ms');
		TVB.log("Profiler: " + fn + ': call count ' + cc + ' ms');

		return rv;
	} catch (e) {
		TVB.error("Profiler: profile: " + e.message);
		throw e;
	}
};

/**
 * Returns how many times a function has been called
 * @method callCount
 * @param	{String}	fn	The name of the function to be profiled
 * @return	{Integer}	The number of call
 */
TVB.Profiler.callCount = function(fn) {
	try {
		TVB.log("Profiler: callCount(" + fn + ")");
		return (YAHOO.tool.Profiler.getCallCount(fn));
	} catch (e) {
		TVB.error("Profiler: callCount: " + e.message);
		throw e;
	}
};

/**
 * Returns the maximum execution time of a function
 * @method maxTime
 * @param	{String}	fn	The name of the function to be profiled
 * @return	{Integer}	The maximum execution time in milliseconds
 */
TVB.Profiler.maxTime = function(fn) {
	try {
		TVB.log("Profiler: maxTime(" + fn + ")");
		return(YAHOO.tool.Profiler.getMax(fn));
	} catch (e) {
		TVB.error("Profiler: maxTime: " + e.message);
		throw e;
	}
};

/**
 * Returns the minimum execution time of a function
 * @method minTime
 * @param	{String}	fn	The name of the function to be profiled
 * @return	{Integer}	The minimum execution time in milliseconds
 */
TVB.Profiler.minTime = function(fn) {
	try {
		TVB.log("Profiler: minTime(" + fn + ")");
		return(YAHOO.tool.Profiler.getMin(fn));
	} catch (e) {
		TVB.error("Profiler: minTime: " + e.message);
		throw e;
	}
};

/**
 * Returns the average execution time of a function
 * @method averageTime
 * @param	{String}	fn	The name of the function to be profiled
 * @return	{Integer}	The average execution time in milliseconds
 */
TVB.Profiler.averageTime = function(fn) {
	try {
		TVB.log("Profiler: averageTime(" + fn + ")");
		var avg = YAHOO.tool.Profiler.getAverage(fn);
		return avg;
	} catch (e) {
		TVB.error("Profiler: averageTime: " + e.message);
		throw e;
	}
};

/**
 * Alias to TVB.Profiler
 * @class $PR
 * @namespace
 */
$PR = TVB.Profiler;

