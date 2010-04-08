/**
 * <h1>Favorites Manager for BLOBbox</h1>
 * 
 * @module favorites
 * @namespace TVB
 * @title Favorites Manager
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * Object for handling the Favorites Manager
 * @class favorites
 * @static
 * @namespace TVB
 */
TVB.favorites = {};

/**
 * Set the URL for favorite callback
 * @method set
 * @param {String} uri A complete URL that will be saved in the bookmark when the favorites button is pushed
 * @exception {TypeError}
 * @exception {InitError}
 */
TVB.favorites.set = function(uri) {
	try {
		TVB.log("Favorites: set('" + uri + "')");
		if (typeof uri != 'string') {
			throw TypeError;
		}
		if (TVB.favorites.handler === null) {
			if (typeof BlobFavoritesHandler == 'function') {
				TVB.favorites.handler = new BlobFavoritesHandler();
				TVB.favorites.set(location.href);
			} else {
				throw InitError;
			}
		}
		TVB.favorites.handler.setURI(encodeURI(uri));
	} catch (e) {
		TVB.warning("Favorites: set: " + e.message);
		throw e;
	}
};

/**
 * Configure the callback the produce the favorite url<br />
 * This is an alternative way to use this API
 * @method setProducer
 * @parameter {String} functionName the name of a function (as string!) to be called when favorite button is pushed; the function should return a string (the url to be saved with the bookmark). Only valid urls will be accepted.
 * @exception {TypeError}
 * @exception {InitError}
 */
TVB.favorites.setProducer = function(functionName) {
	try {
		TVB.log("Favorites: setProducer('" + functionName + "')");
		if (typeof functionName != 'string') {
			throw TypeError;
		}
		if (TVB.favorites.handler === null) {
			if (typeof BlobFavoritesHandler == 'function') {
				TVB.favorites.handler = new BlobFavoritesHandler();
				TVB.favorites.set(location.href);
			} else {
				throw InitError;
			}
		}
		TVB.favorites.handler.setProducer(functionName);
	} catch (e) {
		TVB.warning("Favorites: setProducer: " + e.message);
		throw e;
	}
};

TVB.favorites.handler = null;

tvblob.logWarning('Ending BLOBkit');
var blobkitEndTime = new Date();
var blobkitExecTime = blobkitEndTime - blobkitStartTime;
tvblob.logWarning("Exec time: " + blobkitExecTime);