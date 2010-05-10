/**
 * <h1>VFS Manager</h1>
 * 
 * <h2>spaceStatus</h2>
 * 
 * <table>
 * <thead><td>Code</td><td>Status name</td></thead>
 * <tr><td>0</td><td>UNKNOWN</td></tr>
 * <tr><td>1</td><td>ABOVE</td></tr>
 * <tr><td>2</td><td>BELOW</td></tr>
 * </table>
 * 
 * @module vfs
 * @namespace TVB
 * @title VFS Manager
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * TVBLOB's VFS Manager Class
 * @class vfs
 * @namespace TVB
 * @classDescription TVBLOB's VFS Manager Class
 * @static
 */
TVB.vfs = {};

/**
 * Get space status code (w.r.t. the minimum space threshold set for this storage).
 * @method getStorageSpaceStatusCode
 * @return {Number} spaceStatus Code
 * @exception {UnsupportedError}
 */
TVB.vfs.getStorageSpaceStatusCode = function() {
	try {
		TVB.log("Vfs: getStorageSpaceStatusCode()");
		var s = new LocalStorage();
		return s.getStorageSpaceStatusCode();
	} catch (e) {
		TVB.warning("Vfs: getStorageSpaceStatusCode: " + e.message);
		throw UnsupportedError;
	}
};

/**
 * Get storage space status string (w.r.t. the minimum space threshold set for this storage).
 * @method getStorageSpaceStatusName
 * @return {String} spaceStatus Name
 * @exception {UnsupportedError}
 */
TVB.vfs.getStorageSpaceStatusName = function() {
	try {
		TVB.log("Vfs: getStorageSpaceStatusName()");
		var s = new LocalStorage();
		return s.getStorageSpaceStatusName();
	} catch (e) {
		TVB.warning("Vfs: getStorageSpaceStatusName: " + e.message);
		throw UnsupportedError;
	}
};

/**
 * Get the local storage free space as string.
 * @method getFreeSpaceAsString
 * @return {String} a string that can be converted to long and represents free space, null if the information is not available
 * @exception {UnsupportedError}
 */
TVB.vfs.getFreeSpaceAsString = function() {
	try {
		TVB.log("Vfs: getFreeSpaceAsString()");
		var s = new LocalStorage();
		return s.getFreeSpaceAsString();
	} catch (e) {
		TVB.warning("Vfs: getFreeSpaceAsString: " + e.message);
		throw UnsupportedError;
	}
};

/**
 * Get the local storage free space as string.
 * @method getFreeSpaceAsString
 * @return {Number} a float converted from the string that represents free space, null if the information is not available
 * @exception {UnsupportedError}
 */
TVB.vfs.getFreeSpaceAsFloat = function() {
	try {
		TVB.log("Vfs: getFreeSpaceAsFloat()");
		var s = new LocalStorage();
		var c = s.getFreeSpaceAsString();
		if (c === null) {
			return null;
		} else {
			return parseInt(c, 10);
		}
	} catch (e) {
		TVB.warning("Vfs: getFreeSpaceAsFloat: " + e.message);
		throw UnsupportedError;
	}
};

/**
 * Get a formatted string that represents the local storage free space.
 * @method getFreeSpaceAsFormattedString
 * @return {String} a formatted string to show free space, null if the information is not available
 * @exception {UnsupportedError}
 */
TVB.vfs.getFreeSpaceAsFormattedString = function() {
	try {
		TVB.log("Vfs: getFreeSpaceAsFormattedString()");
		var s = new LocalStorage();
		return s.getFreeSpaceAsFormattedString();
	} catch (e) {
		TVB.warning("Vfs: getFreeSpaceAsFormattedString: " + e.message);
		throw UnsupportedError;
	}
};
