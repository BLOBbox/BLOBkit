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
	
TVB.vfs.getStorageSpaceStatusCode = function() {
	try {
		TVB.log("Vfs: getStorageSpaceStatusCode()");
		var s = new LocalStorage();
		return s.getStorageSpaceStatusCode();
	} catch (e) {
		TVB.error("Vfs: getStorageSpaceStatusCode: " + e.message);
		throw e;
	}
}

TVB.vfs.getStorageSpaceStatusName = function() {
	try {
		TVB.log("Vfs: getStorageSpaceStatusName()");
		var s = new LocalStorage();
		return s.getStorageSpaceStatusName();
	} catch (e) {
		TVB.error("Vfs: getStorageSpaceStatusName: " + e.message);
		throw e;
	}
}

TVB.vfs.getFreeSpaceAsString = function() {
	try {
		TVB.log("Vfs: getFreeSpaceAsString()");
		var s = new LocalStorage();
		return s.getFreeSpaceAsString();
	} catch (e) {
		TVB.error("Vfs: getFreeSpaceAsString: " + e.message);
		throw e;
	}
}

TVB.vfs.getFreeSpaceAsFloat = function() {
	try {
		TVB.log("Vfs: getFreeSpaceAsFloat()");
		var s = new LocalStorage();
		return parseInt(s.getFreeSpaceAsString());
	} catch (e) {
		TVB.error("Vfs: getFreeSpaceAsFloat: " + e.message);
		throw e;
	}
}

TVB.vfs.getFreeSpaceAsFormattedString = function() {
	try {
		TVB.log("Vfs: getFreeSpaceAsFormattedString()");
		var s = new LocalStorage();
		return s.getFreeSpaceAsFormattedString();
	} catch (e) {
		TVB.error("Vfs: getFreeSpaceAsFormattedString: " + e.message);
		throw e;
	}
}

