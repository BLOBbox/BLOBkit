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
 */
TVB.favorites.set = function(uri) {
	try {
		TVB.log("Favorites: set('" + uri + "')");
		if (typeof uri != 'string') {
			throw TypeError;
		}
		TVB.favorites.handler.setURI(encodeURI(uri));
	} catch (e) {
		TVB.error("Favorites: set: " + e.message);
		throw e;
	}
};

/**
 * Configure the callback the produce the favorite url<br />
 * This is an alternative way to use this API
 * @method setProducer
 * @parameter {String} functionName the name of a function (as string!) to be called when favorite button is pushed; the function should return a string (the url to be saved with the bookmark). Only valid urls will be accepted.
 */
TVB.favorites.setProducer = function(functionName) {
	try {
		TVB.log("Favorites: setProducer('" + functionName + "')");
		if (typeof functionName != 'string') {
			throw TypeError;
		}
		TVB.favorites.handler.setProducer(functionName);
	} catch (e) {
		TVB.error("Favorites: setProducer: " + e.message);
		throw e;
	}
};

/*
 * Initialization of the favorites module
 */
try {
	/**
	 * Hander for favorites events
	 * @private
	 */
	TVB.favorites.handler = new BlobFavoritesHandler();
	TVB.favorites.set(location.href);
} catch (e) {
	TVB.error("Favorites: " + e.message);
}

