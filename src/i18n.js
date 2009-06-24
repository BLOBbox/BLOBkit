/**
 * Internationalization (i18n) Support Library
 * @module i18n
 * @namespace TVB
 * @title i18n Support
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * TVBLOB's i18n Class
 * @class i18n
 * @classDescription	TVBLOB's i18n Class
 */
TVB.i18n = {};

/**
 * Return translation for the given messageID in the named resource bundle
 * or defaultValue if no such translation is available.
 * @method TVB.i18n.getI18NString
 * @param {String} messageID
 * @param {String} defaultValue
 * @param {String} bundleName
 * @return {String} 
 */
TVB.i18n.getI18NString = function(messageID, defaultValue, bundleName) {
	try {
		TVB.log("i18n: getI18NString(" + messageID + ", " + defaultValue + ", " + bundleName + ")");
		if (typeof messageID != 'string') {
			throw {message: "messageID is required and must be a string"};
		}
		if (typeof defaultValue != 'string') {
			throw {message: "defaultValue is required and must be a string"};
		}
		if (typeof bundleName != 'string') {
			throw {message: "bundleName is required and must be a string"};
		}
		try {
			return tvblob.getI18NString(messageID, defaultValue, bundleName);
		} catch (e) {
			TVB.log("i18n: tvblob.getI18NString not found - using default value");
			TVB.log("i18n: reported error: " + e.message);
			return defaultValue;
		}
	} catch (e) {
		TVB.error("i18n: getI18NString: " + e.message);
		throw e;
	}
}

/**
 * Return translation for the given messageID in the named resource bundle
 * or defaultValue if no such translation is available.
 * @method TVB.i18n.getI18NStringWithArgs
 * @param {String} messageID
 * @param {String} defaultValue
 * @param {String} bundleName
 * @param {Array} messageArgs
 * @return {String} 
 */
TVB.i18n.getI18NStringWithArgs = function(messageID, defaultValue, bundleName, messageArgs) {
	try {
		TVB.log("i18n: getI18NStringWithArgs(" + messageID + ", " + defaultValue + ", " + bundleName + ", " + messageArgs + ")");
		if (typeof messageID != 'string') {
			throw {message: "messageID is required and must be a string"};
		}
		if (typeof defaultValue != 'string') {
			throw {message: "defaultValue is required and must be a string"};
		}
		if (typeof bundleName != 'string') {
			throw {message: "bundleName is required and must be a string"};
		}
		try {
			return tvblob.getI18NStringWithArgs(messageID, defaultValue, bundleName, messageArgs);
		} catch (e) {
			TVB.log("i18n: tvblob.getI18NStringWithArgs not found - using default value");
			TVB.log("i18n: reported error: " + e.message);
			return defaultValue;
		}
	} catch (e) {
		TVB.error("i18n: getI18NStringWithArgs: " + e.message);
		throw e;
	}
}

/**
 * Return translation for the given messageID in the platform resource 
 * bundle or defaultValue if no such translation is available.
 * @param {String} messageID
 * @param {String} defaultValue
 * @return {String}
 */
TVB.i18n.getPlatformI18NString = function(messageID, defaultValue) {
	try {
		TVB.log("i18n: getPlatformI18NString(" + messageID + ", " + defaultValue + ")");
		if (typeof messageID != 'string') {
			throw {message: "messageID is required and must be a string"};
		}
		if (typeof defaultValue != 'string') {
			throw {message: "defaultValue is required and must be a string"};
		}
		try {
			return tvblob.getPlatformI18NString(messageID, defaultValue);
		} catch (e) {
			TVB.log("i18n: tvblob.getPlatformI18NString not found - using default value");
			TVB.log("i18n: reported error: " + e.message);
			return defaultValue;
		}
	} catch (e) {
		TVB.error("i18n: getPlatformI18NString: " + e.message);
		throw e;
	}
}

/**
 * Return translation for the given messageID in the platform resource 
 * bundle or defaultValue if no such translation is available.
 * @param {String} messageID
 * @param {String} defaultValue
 * @param {Array} messageArgs
 * @return {String}
 */
TVB.i18n.getPlatformI18NStringWithArgs = function(messageID, defaultValue, messageArgs) {
	try {
		TVB.log("i18n: getPlatformI18NStringWithArgs(" + messageID + ", " + defaultValue + ", " + messageArgs + ")");
		if (typeof messageID != 'string') {
			throw {message: "messageID is required and must be a string"};
		}
		if (typeof defaultValue != 'string') {
			throw {message: "defaultValue is required and must be a string"};
		}
		try {
			return tvblob.getPlatformI18NStringWithArgs(messageID, defaultValue, messageArgs);
		} catch (e) {
			TVB.log("i18n: tvblob.getPlatformI18NStringWithArgs not found - using default value");
			TVB.log("i18n: reported error: " + e.message);
			return defaultValue;
		}
	} catch (e) {
		TVB.error("i18n: getPlatformI18NStringWithArgs: " + e.message);
		throw e;
	}
}
