/**
 * Custom Events Manager
 * @module json
 * @namespace TVB
 * @title JSON Parser
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * TVBLOB's JSON class
 * @class json
 * @classDescription	TVBLOB's JSON class
 */
TVB.json = {};

/**
 * Parse a JSON string, returning the native JavaScript representation.
 * Only minor modifications from http://www.json.org/json.js.
 * @method	TVB.json.parse
 * @param	{String}	jsonString	A string containing JSON data
 * @param	{Function}	[customFormatter]	RESERVED FOR FUTURE USES function(k,v) passed each key value pair of object literals, allowing pruning or altering values
 * @return	{Object, Boolean}	Javascript data built on JSON string
 */
TVB.json.parse = function(jsonString, customFormatter) {
	try {
		TVB.log("Json: parse()");
		if (typeof jsonString != 'string') {
			return null;
		}
		else {
			if (jsonString.length === 0) {
				return null;
			} else {
				var myData = eval('(' + jsonString + ')');
				//return YAHOO.lang.JSON.parse(jsonString);
				return myData;
			}
		}
	} catch (e) {
		TVB.error("Json: parse: " + e.message);
	}
};

/**
 * Converts an arbitrary value to a JSON string representation.
 * Cyclical object or array references are replaced with null.
 * If a whitelist is provided, only matching object keys will be included.
 * If a depth limit is provided, objects and arrays at that depth will
 * be stringified as empty.
 * Uses YUI Library.
 * @method	TVB.json.stringify
 * @param	{Object}	data		An object conaining all of the data
 * @param	{Array}		[whitelist]	Whitelist of acceptable object keys to include
 * @param	{Number}	[depth]		Depth limit to recurse objects/arrays (practical minimum 1)
 * @return	{Object}	Javascript data built on JSON string
 */
TVB.json.stringify = function(data, whitelist, depth) {
	try {
		TVB.log("Json: stringify()");
		return YAHOO.lang.JSON.stringify(data, whitelist, depth);
	} catch (e) {
		TVB.error("Json: strinfigy: " + e.message);
	}
};
