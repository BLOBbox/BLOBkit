/**
 * System utilities for BLOBkit
 * @module system
 * @namespace TVB
 * @title BLOBkit System Utils
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

if (typeof TVB.system == "undefined" || !TVB.system) {
  	/**
	 * TVBLOB's system utilities class
	 * @class system
	 * @namespace TVB
	 * @classDescription TVBLOB's system utilities class
	 * @static
	 */
  TVB.system = {};
}

/**
 * Returns current SMOJ version
 * @method getSMOJVersion
 * @return {String} Current SMOJ version, if any, otherwise 0.0.0
 */
TVB.system.getSMOJVersion = function() {
	try {
		TVB.log("System: getSMOJversion()");
		// return current SMOJ Version
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getSMOJVersion();
		} else {
			return "0.0.0";
		}
	} catch(e) {
		return "0.0.0";
	}
}

/**
 * Returns current BLOBkit version
 * @method getBLOBkitVersion
 * @return {String} Current BLOBkit version
 */
TVB.system.getBLOBkitVersion = function() {
	try {
		TVB.log("System: getBLOBkitVersion()");
		// return current BLOBkit Version
		var ver = "%%VERSION%%";
		var vor = ver.split(" build");
		return vor[0];
	} catch(e) {
		TVB.error("System: getBLOBkitVersion(): " + e.message);
	}
}

/**
 * Returns current SMOS version
 * @method getSMOSVersion
 * @return {String} Current SMOS version, if any, otherwise 0.0.0
 */
TVB.system.getSMOSVersion = function() {
	try {
		TVB.log("System: getSMOSversion()");
		// return current SMOS Version
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getSMOSVersion();
		} else {
			return "0.0.0";
		}
	} catch(e) {
		return "0.0.0";
	}
}

/**
 * Returns current Product name
 * @method getProductName
 * @return {String} Current product name, if any, otherwise NON_TVBLOB
 */
TVB.system.getProductName = function() {
	try {
		TVB.log("System: getProductName()");
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getProductName();
		} else {
			return "NON_TVBLOB";
		}
	} catch (e) {
		return "NON_TVBLOB";
	}
}

/**
 * Returns current product version
 * @method getProductVersion
 * @return {String} Current product version, if any, otherwise NON_TVBLOB
 */
TVB.system.getProductVersion = function() {
	try {
		TVB.log("System: getProductVersion()");
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getProductVersion();
		} else {
			return "NON_TVBLOB";
		}
	} catch (e) {
		return "NON_TVBLOB";
	}
}

/**
 * Returns current firmware version
 * @method getFirmwareVersion
 * @return {String} Current firmware version, if any, otherwise NON_TVBLOB
 */
TVB.system.getFirmwareVersion = function() {
	try {
		TVB.log("System: getFirmwareVersion()");
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getFirmwareVersion();
		} else {
			return "NON_TVBLOB";
		}
	} catch (e) {
		return "NON_TVBLOB";
	}
}

/**
 * Returns system language code
 * @method getLanguageCode
 * @return {String} Current system language code, if any, otherwise false
 */
TVB.system.getLanguageCode = function() {
	try {
		TVB.log("System: getLanguageCode()");
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getLanguageCode();
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}


/**
 * Returns user's TVBLOB Number if the user is logged in. 
 * This function works only on trusted applications.
 * @method getTvblobNumber
 * @return {String} User's TVBLOB Number, or none
 */
TVB.system.getTvblobNumber = function() {
	try {
		TVB.log("System: getTvblobNumber()");
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getTvblobNumber();
		} else {
			return null;
		}
	} catch (e) {
		return null;
	}
}

/**
 * Returns a unique identification for the User, based on his TVBLOB Number 
 * and current application domain.<br />
 * This functions requires that the user authorize the use in current application (a popup screen is displayed).
 * @method getUserID
 * @return {String} A unique identification string; if a user is not logged in TVBLOB's backends, returns null
 */
TVB.system.getUserID = function() {
	try {
		TVB.log("System: getUserID()");
		return tvblob.getDomainTackingID();
	} catch (e) {
		TVB.error("System: getUserID: " + e.message);
		return null;
	}
}

/**
 * Returns current video system code (PAL/NTSC)
 * @method getVideoSystem
 * @return {String} Current video system code, if any, otherwise NON_TV
 */
TVB.system.getVideoSystem = function() {
	try {
		TVB.log("System: getVideoSystem()");
		if (typeof tvblob != 'undefined' || !tvblob) {
			return tvblob.getVideoSystem();
		} else {
			return "NON_TV";
		}
	} catch (e) {
		return "NON_TV";
	}
}

/*
 * Returns true if minimumVersion is verified 
 * by current configuration
 * 
 * @param 	{String} 	minimumVersion A string that represents a SMOJ version (eg: "2.4.23")
 * @return	{Boolean}	true if the version is verified, false otherwise
 */
/*
TVB.system.isMinimumSMOJVersion = function(minimumVersion) {
	try {
		var currentVersion = TVB.system.getSMOJVersion();
		// TO BE DONE
		return false;
	} catch (e) {
		TVB.log(e);
		return false;
	}
}
*/

/**
 * Refresh current browser page
 * @method refresh
 */
TVB.system.refresh = function() {
	try {
		TVB.log("System: refresh()");
		window.location.reload(true);
	} catch (e) {
		TVB.error("System: refresh: " + e.message);
		throw e;
	}
}

/**
 * URI of a resource in the current theme or null if not present
 * @method getResourceURI
 * @param {String} relativeURI
 * @return {String} the complete URI, null if not found
 */
TVB.system.getResourceURI = function(relativeURI) {
	try {
		TVB.log("System: getResourceURI(" + relativeURI + ")");
		return tvblob.getResourceURI(relativeURI);
	} catch (e) {
		TVB.log("WARNING System: getResourceURI method not found");
		return 'file:///gui/resources/themes/PAL/consumer_v1/' + relativeURI;
	}
}

/**
 * Sleeps javascript execution for given milliseconds
 * @method sleep
 * @param {Integer} ms Milliseconds to sleep
 */
TVB.system.sleep = function(ms) {
	try {
		TVB.log("System: sleep(" + ms + ")");
		tvblob.sleep(ms);
		TVB.log("System: awakening");
	} catch (e) {
		TVB.error("System: sleep: " + e.message);
		throw e;
	}
}

/**
 * Sleeps for a given number of millisecons, than executes a callback function
 * @method sleepcb
 * @param {Integer} ms Milliseconds to sleep
 * @param {Function} cb Function
 */
TVB.system.sleepcb = function(ms, cb) {
	try {
		TVB.log("System: sleepcb(" + ms + ")");
		if (cb == undefined) {
			throw {message: "System: callback is undefined"};
		}
	
		var mindelay = 50;
	
		if (ms < mindelay) {
			ms = mindelay;
		}
	
		setTimeout( function() {
			try {
				TVB.log("System: sleeping for " + ms + " milliseconds");
				TVB.system.sleep(parseInt(ms - mindelay));
				TVB.log("System: executing callback");
				cb();
			} catch (e) {
				TVB.error("System: sleepcb-callback: " + e.message);
				throw e;
			}
		}, mindelay);
	} catch (e) {
		TVB.error("System: sleepcb: " + e.message);
		throw e;
	}
}

/**
 * Safely delete an element and all of his childrens
 * @method deleteElementById
 * @param {String} [id] ID of the element to be removed; default: body
 */
TVB.system.deleteElementById = function(id) {
	try {
		TVB.log("System: deleteElementById(" + id + ")");
		
		if (id == undefined) {
			var startNode = document.body;		
		} else {
			var startNode = document.getElementById(id);
			if (startNode == undefined) {
				throw {message: "element not found"};
			}
		}
		
		var myParent;
		var myDiv = startNode;
		
		while(true) {
			if (myDiv.hasChildNodes()) {
				myDiv = myDiv.firstChild;
			} else {
				if (myDiv == startNode) {
					break;
				}
				myParent = myDiv.parentNode;
				myParent.removeChild(myDiv);
				if (myDiv.style != null) {
					myDiv.style.position = 'relative';
				}
				myDiv = myParent;
			}
		}
	
		if (id != undefined) {
			var el = document.getElementById(id);
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}
	} catch (e) {
		TVB.error("System: deleteElementById: " + e.message);
		throw e;
	}
}

/**
 * Exit the browser and go back to main menu
 * @method exitBrowser
 */
TVB.system.exitBrowser = function() {
	try {
		TVB.log("System: exitBrowser()");
		tvblob.exitBrowser();
	} catch (e) {
		TVB.error("System: exitBrowser: " + e.message);
		throw e;
	}
}

/**
 * Returns to the previous page; if it is the first page of history,
 * exit the browser and go back to main menu
 * @method goBackOrExitBrowser
 */
TVB.system.goBackOrExitBrowser = function() {
	try {
		TVB.log("System: goBackOrExitBrowser()");
		tvblob.goBackOrExitBrowser();
	} catch (e) {
		TVB.error("System: goBackOrExitBrowser: " + e.message);
		throw e;
	}
}

/**
 * Returns current platform name
 * @method getPlatformName
 */
TVB.system.getPlatformName = function() {
	try {
		TVB.log("System: getPlatformName()");
		return tvblob.getPlatformName();
	} catch (e) {
		TVB.error("System: getPlatformName: " + e.message);
		throw e;
	}
}

/**
 * Retirns current platform version
 * @method getPlatformVersion
 */
TVB.system.getPlatformVersion = function() {
	try {
		TVB.log("System: getPlatformVersion()");
		return tvblob.getPlatformVersion();
	} catch (e) {
		TVB.error("System: getPlatformVersion: " + e.message);
		throw e;
	}
}

/**
 * Returns current platform fingerprint
 * @method getPlatformFingerprint
 */
TVB.system.getPlatformFingerprint = function() {
	try {
		TVB.log("System: getPlatformFingerprint()");
		return tvblob.getPlatformFingerprint();
	} catch (e) {
		TVB.error("System: getPlatformFingerprint: " + e.message);
		throw e;
	}
}
