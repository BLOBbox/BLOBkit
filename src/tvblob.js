/**
 * Base module for BLOBkit. Contains the System functions
 * @module tvblob
 * @title BLOBkit Global Object
 * @author Francesco Facconi  francesco.facconi@tvblob.com
 * @author Edoardo Esposito   edoardo.esposito@tvblob.com
 */

/**
 * Create a new instance of TVB.
 * @class TVB
 * @namespace
 * @static
 */
var TVB = {};

/**
 * Dumps the content of an object or an array.
 * @method TVB.dump
 * @param {Object} obj The array, the object or any kind of data
 * @param {Integer} [level] Optional: the starting level
 * @return {String} Dumped text, print in a console or on a log file
 */
TVB.dump = function(obj, level) {
	try {
		//TVB.log("System: dump()");
		var dumped_text = "";
		if (!level) {
			level = 0;
		}
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for (var j = 0; j < level; j++) {
			level_padding += "    ";
		}
		
		if (typeof(obj) == 'object') { // Array/Hashes/Objects
			for (var item in obj) {
				var value = obj[item];
				
				if (typeof(value) == 'object') { // If it is an array,
					dumped_text += level_padding + item + " ...\n";
					dumped_text += TVB.dump(value, level + 1);
				} else {
					dumped_text += level_padding + item + ": " + value + "\n";
				}
			}
		}
		else { // Stings/Chars/Numbers etc.
			dumped_text = "===>" + obj + "<===(" + typeof(obj) + ")";
		}
		return dumped_text;
	} catch (e) {
		TVB.error("System: dump: " + e.message);
		throw e;
	}
};

/**
 * User Agent Based Browser Detection<br>
 * This function uses the userAgent string to get the browsers information.<br>
 * The returned object will look like:<br>
 * <pre>
 *   obj {
 *       ua: 'Full UserAgent String'
 *       opera: boolean
 *       safari: boolean
 *       firefox: boolean
 *       mozilla: boolean
 *       msie: boolean
 *       mac: boolean
 *       win: boolean
 *       unix: boolean
 *       version: string
 *       flash: version string
 *   }
 * </pre><br>
 * @method TVB.getBrowserAgent
 * @return {Object} Browser Information Object
 * @type Object
 */
TVB.getBrowserAgent = function() 
{
	var ua = navigator.userAgent.toLowerCase();
	var opera = ((ua.indexOf('opera') != -1) ? true : false);
	var espial = ((ua.indexOf('scattermedia') != -1) ? true : false);
	var blobkit = ((ua.indexOf('blobkit') != -1) ? true : false);
//	var espial = ((ua.indexOf('escape') != -1) ? true : false);
	var safari = ((ua.indexOf('safari') != -1) ? true : false);
	var firefox = ((ua.indexOf('firefox') != -1) ? true : false);
	var msie = ((ua.indexOf('msie') != -1) ? true : false);
	var mac = ((ua.indexOf('mac') != -1) ? true : false);
	var unix = ((ua.indexOf('x11') != -1) ? true : false);
	var win = ((mac || unix) ? false : true);
	var version = false;
	var mozilla = false;
	var _tmp = null;
	
	if (!firefox && !safari && (ua.indexOf('gecko') != -1)) {
		mozilla = true;
		_tmp = ua.split('/');
		version = _tmp[_tmp.length - 1].split(' ')[0];
	}

	if (firefox) {
		_tmp = ua.split('/');
		version = _tmp[_tmp.length - 1].split(' ')[0];
	}
	
	if (msie) {
		version = ua.substring((ua.indexOf('msie ') + 5)).split(';')[0];
	}

	if (safari) {
		/*
		* Safari doesn't report a string, have to use getBrowserEngine to get it
		*/
		version = this.getBrowserEngine().version;
	}

	if (opera) {
		version = ua.substring((ua.indexOf('opera/') + 6)).split(' ')[0];
	}
	
	/*
	* Return the Browser Object
	* @type Object
	*/
	var browsers = {
	    ua: navigator.userAgent,
	    opera: opera,
	    espial: espial,
	    blobkit: blobkit,
	    safari: safari,
	    firefox: firefox,
	    mozilla: mozilla,
	    msie: msie,
	    mac: mac,
	    win: win,
	    unix: unix,
	    version: version
	};
	return browsers;
};

/**
 * Logs an object or a string to the console; works on 
 * Microsoft Internet Explorer, Mozilla Firefox,
 * Apple Safari and TVBLOB BLOBBOX.
 * @method TVB.log
 * @namespace TVB
 * @param {Object} message An object or a string to be printed on the log console
 * @return {Void}
 */
TVB.log = function(message) {
	try {
		if (message === null) {
			message = 'null';
		}
		
		var output = null;
		if (typeof message == 'object' && message.name !== undefined && message.message !== undefined && message.fileName !== undefined && message.lineNumber !== undefined) {
			output = "Error name: " + message.name + "\nError message: " + message.message + "\nFile name: " + message.fileName + "\nLine number: " + message.lineNumber;
		} else if (typeof message == 'string') {
			output = message;
		} else {
			output = TVB.dump(message, 0);
		}

		if (typeof tvblob != 'undefined') {
			tvblob.logInfo(output);
		}
		else 
			if (window.console) {
				window.console.log(output);
			} else
				if (typeof console != 'undefined') {
					console.log(output);
				} else {
					alert(output);
				}
		return;
	} catch (e) {
		throw e;
	}	
};

/**
 * Similar to TVB.log, is used internally just to display errors
 * @method TVB.error
 * @namespace TVB
 * @param {Object} message An object or a string to be printed on the log console
 * @return {Void}
 */
TVB.error = function(message) {
	try {
		if (message === null) {
			message = 'null';
		}
		
		var output = null;
		if (typeof message == 'object' && message.name !== undefined && message.message !== undefined && message.fileName !== undefined && message.lineNumber !== undefined) {
			output = "Error name: " + message.name + "\nError message: " + message.message + "\nFile name: " + message.fileName + "\nLine number: " + message.lineNumber;
		} else if (typeof message == 'string') {
			output = message;
		} else {
			output = TVB.dump(message, 0);
		}

		if (typeof tvblob != 'undefined') {
			tvblob.logError(output);
		}
		else 
			if (window.console) {
				window.console.error(message);
			} else
				if (typeof console != 'undefined') {
					console.error(message);
				} else {
					alert(output);
				}
		return;
	} catch (e) {
		throw e;
	}	
};

/**
 * Similar to TVB.log, is used internally just to display warnings
 * @method TVB.warning
 * @namespace TVB
 * @param {Object} message An object or a string to be printed on the log console
 * @return {Void}
 */
TVB.warning = function(message) {
	try {
		if (message === null) {
			message = 'null';
		}
		
		var output = null;
		if (typeof message == 'object' && message.name !== undefined && message.message !== undefined && message.fileName !== undefined && message.lineNumber !== undefined) {
			output = "Error name: " + message.name + "\nError message: " + message.message + "\nFile name: " + message.fileName + "\nLine number: " + message.lineNumber;
		} else if (typeof message == 'string') {
			output = message;
		} else {
			output = TVB.dump(message, 0);
		}

		if (typeof tvblob != 'undefined') {
			tvblob.logWarning(output);
		}
		else 
			if (window.console) {
				window.console.warn(message);
			} else
				if (typeof console != 'undefined') {
					console.warn(message);
				} else {
					alert(output);
				}
		return;
	} catch (e) {
		throw e;
	}	
};

/**
 * Logs exceptions on BLOBbox's webdev console, in a readable and debuggable way.
 * @param {Object} exceptionObject The exception object catched
 * @param {String} functionName Name of the function (for tracking purpose)
 */
TVB.exception = function(exceptionObject, functionName) {
	try {
		if (typeof tvblob != 'undefined') {
			tvblob.logError('*****************');
			tvblob.logError('Message: ' + exceptionObject.message);
			tvblob.logError('Name: ' + exceptionObject.name);
			tvblob.logError('exceptionObject: ' + exceptionObject.exceptionObject);
			tvblob.logError('File name: ' + exceptionObject.fileName + " (line " + exceptionObject.lineNumber + ")");
			tvblob.logError('Function name: ' + functionName);
			tvblob.logError('*****************');
		} else {
			TVB.error(functionName);
			TVB.error(exceptionObject);
		}
		return;
	} catch (e) {
		throw e;
	}	
};


try {
	tvblob.logInfo("BLOBkit version %%VERSION%%");
} catch (e) {
	TVB.log("BLOBkit version %%VERSION%%");
}

/**
 * BLOBkit's configuration class
 * @class config
 * @namespace TVB
 * @classDescription	BLOBkit's configuration class
 * @static
 * @return	{Void}
 */
TVB.config = {};
