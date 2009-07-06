/**
 * Podcast Manager
 * @module podcast
 * @namespace TVB
 * @title Podcast Manager
 * @requires tvblob, system, event, remote
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * Object for handling TVBLOB podcast explorer
 * @class podcast
 * @static
 * @namespace TVB
 */
TVB.podcast = {
	mgr: null,
	feeds: [],
	fh: null,
	version: null,
	version_integer: null,
}

try {
	TVB.podcast.version = tvblob.getFeatureVersion("PushVodFeedsManager");
	var vrs = TVB.podcast.version.split(".");
	if (vrs.length > 1) {
		TVB.podcast.version_integer = parseInt(parseInt(vrs[0] * 100) + parseInt(vrs[1]));
	} else if (vrs.length == 1) {
		TVB.podcast.version_integer = parseInt(vrs[0] * 100);
	} else {
		TVB.podcast.version_integer = 100;
	}
	TVB.log("Podcast: system API version " + TVB.podcast.version + " (" + TVB.podcast.version_integer + ")");
} catch (e) {
	TVB.podcast.version = '1.0';
	TVB.podcast.version_integer = 100;
}


/**
 * Initialize the podcast system; this function is no more required before using any other method of this API
 * @method init
 * @deprecated it is no more necessary to init the podcast system
 * @return {Boolean} Result of the operation
 */
TVB.podcast.init = function() {
	try {
		TVB.log("Podcast: init");
		
		if (TVB.podcast.mgr != null) {
			return false;
		}
		TVB.podcast.mgr = new PushVodFeedsManager();
		return true;
	} catch (e) {
		TVB.error("Podcast: init: " + e.message);
		throw e;
	}
}

// FEEDS

/**
 * Alias to getFeeds
 * @method getAllFeeds
 * @return {Object} feed[]
 */
TVB.podcast.getAllFeeds = function() {
	try {
		TVB.log("Podcast: getAllFeeds()");
		return TVB.podcast.getFeeds();
	} catch (e) {
		throw e;
	}
}

/**
 * Returns all feeds meta information in a structured array
 * @method getFeeds
 * @return {Object} feed[]
 */
TVB.podcast.getFeeds = function() {
	try {
		TVB.log("Podcast: getFeeds()");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fe = [];
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			var fho = fh[i];
			fe[fho.getID()] = TVB.podcast.formatFeedObject(fho);
		}
		return fe;
	} catch (e) {
		TVB.error("Podcast: getFeeds: " + e.message);
		throw e;
	}
}

/**
 * Alias to getAllFeedsID
 * @method getAllFeedsID
 * @return {Object} feedID[] Array of feed id
 */
TVB.podcast.getAllFeedsID = function() {
	try {
		TVB.log("Podcast: getAllFeedsID()");
		return TVB.podcast.getFeedsID();
	} catch (e) {
		throw e;
	}
}

/**
 * Returns an array of IDs of all subscribed feeds
 * @method getFeedsID
 * @return {Array} feedID[] The list of feeds IDs
 */
TVB.podcast.getFeedsID = function() {
	try {
		TVB.log("Podcast: getFeedsID()");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		
		var ids = [];
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			var fho = fh[i];
			ids.push(fho.getID());
		}
		return ids;
	} catch (e) {
		TVB.error("Podcast: getFeedsID: " + e.message);
		throw e;
	}
}

/**
 * Returns given feed meta information in a structured object 
 * @method getFeedByID
 * @param {String} feedID The ID of the feed you want to get information about 
 * @return {Object} feed, null if not found
 */
TVB.podcast.getFeedByID = function(feedID) {
	try {
		TVB.log("Podcast: getFeedByID(" + feedID + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho == null) {
			return null;
		} else {
			return TVB.podcast.formatFeedObject(fho);
		}
	} catch (e) {
		TVB.error("Podcast: getFeeds: " + e.message);
		throw e;
	}
}

/**
 * Returns all visible feeds meta informations
 * @method getVisibleFeeds
 * @return {Object} Feeds
 */
TVB.podcast.getVisibleFeeds = function() {
	try {
		TVB.log("Podcast: getVisibleFeeds()");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fe = [];
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			var fho = fh[i];
			if (fho.isHidden() == false) {
				fe[fho.getID()] = TVB.podcast.formatFeedObject(fho);
			}
		}
		return fe;
	} catch (e) {
		TVB.error("podcast.getFeeds: " + e.message);
		throw e;
	}
}

/**
 * Returns an array of IDs of all subscribed feeds that are not hidden
 * @method getVisibleFeedsID
 * @return {Array} The list of feeds IDs
 */
TVB.podcast.getVisibleFeedsID = function() {
	try {
		TVB.log("Podcast: getVisibleFeedsID()");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		
		var ids = [];
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			var fho = fh[i];
			if (fho.isHidden() == false) {
				ids.push(fho.getID());
			}
		}
		return ids;
	} catch (e) {
		TVB.error("Podcast: getVisibleFeedsID: " + e.message);
		throw e;
	}
}

/**
 * @method formatFeedObject
 * @param {Object} feedHandler
 * @return feedObject
 * @private
 */
TVB.podcast.formatFeedObject = function(feedHandler) {
	try {
		TVB.log("Podcast: formatFeedObject()");
		
		var fhd = {
			ID: feedHandler.getID(),
			title: feedHandler.getTitle(),
			description: feedHandler.getDescription(),
			isHidden: feedHandler.isHidden(),
			lastBuildDate: feedHandler.getLastBuildDate(),
			pubDate: feedHandler.getPubDate(),
			timeToLive: feedHandler.getTimeToLive(),
			isTimeToLiveInfinite: feedHandler.isTimeToLiveInfinite(),
			contentIdentifiers: feedHandler.getAllContentIdentifiers(),
			hasContent: false,
			contentCounter: -1
		}
		
		if (fhd.contentIdentifiers.length > 0) fhd.hasContent = true;
		fhd.contentCounter = fhd.contentIdentifiers.length;
		
		return fhd;
	} catch (e) {
		TVB.error("Podcast: formatFeedObject: " + e.message);
		throw e;
	}
}

/**
 * Returns description for a given feedID
 * @method getFeedDescription
 * @param {String} feedID The ID of the feed
 * @return {String} The description of the feed
 */
TVB.podcast.getFeedDescription = function(feedID) {
	try {
		TVB.log("Podcast: getFeedDescription(" + feedID + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho == null) {
			return null;
		} else {
			return fho.getDescription();
		}
	} catch (e) {
		TVB.error("podcast.getFeedDescription: " + e.message);
		return false;
	}
}

/**
 * Returns title for a given feedID
 * @method getFeedTitle
 * @param {String} feedID The ID of the feed
 * @return {String} The title of the feed
 */
TVB.podcast.getFeedTitle = function(feedID) {
	try {
		TVB.log("Podcast: getFeedTitle(" + feedID + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho == null) {
			return null;
		} else {
			return fho.getTitle();
		}
	} catch (e) {
		TVB.error("podcast.getFeedTitle: " + e.message);
		return false;
	}
}

/**
 * Returns the information for a given feed
 * @method feedExist
 * @deprecated prefere using feedExists instead
 * @param {String} feedID The ID of a feed
 * @return {Boolean} True if the feed exists, false otherwise
 */
TVB.podcast.feedExist = function(feedID) {
	try {
		TVB.log("Podcast: feedExist(" + feedID + ")");
		TVB.error("Podcast: feedExist: this function is deprecated, please use feedExists.");
		return TVB.podcast.feedExists(feedID);
	} catch (e) {
		TVB.error("Podcast: feedExist: " + e.message);
		throw e;
	}
}

/**
 * Returns the information for a given feed
 * @method feedExists
 * @param {String} feedID The ID of a feed
 * @return {Boolean} True if the feed exists, false otherwise
 */
TVB.podcast.feedExists = function(feedID) {
	try {
		TVB.log("Podcast: feedExists(" + feedID + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho == null) {
			return false;
		} else {
			return true;
		}
	} catch (e) {
		TVB.error("Podcast: feedExists: " + e.message);
		throw e;
	}
}


// STILL TO BE REFACTORED

/*
 * Refreshes the content of the feeds in memory
 * @method refresh
 * @private
 * @return {Boolean}
 */
/*
TVB.podcast.refresh = function() {
	try {
		TVB.log("Podcast: refresh");
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in TVB.podcast.fh) {
			var fho = TVB.podcast.fh[i];
			var fhd = {
				ID: fho.getID(),
				title: fho.getTitle(),
				isHidden: fho.isHidden(),
				hasContents: fho.hasContents(),
				lastBuildDate: fho.getLastBuildDate(),
				pubDate: fho.getPubDate(),
				timeToLive: fho.getTimeToLive(),
				isTimeToLiveInfinite: fho.isTimeToLiveInfinite()
			}
			TVB.podcast.feeds[fho.getID()] = fhd;
		}
		return true;
	} catch (e) {
		TVB.error("podcast.refresh: " + e.message);
		throw e;
	}
}
*/

/**
 * Returns the content (items) of a given feed
 * @method getFeedContentByID
 * @param {String} feed_id The id of a feed
 * @return {Object} An array of objects filled with informations about all of the items included in the given feed
 */
TVB.podcast.getFeedContentByID = function(feed_id) {
	try {
		TVB.log("Podcast: get feed content by id " + feed_id);
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
		var content = [];
		for (var i in TVB.podcast.fh) {
			if (TVB.podcast.fh[i].getID() == feed_id) {
				var ch = TVB.podcast.fh[i].getAllContent();
				for (var j in ch) {
					var co = {};
					co.ID = ch[j].getID();
					co.name = ch[j].getName();
					co.downloadStatus = ch[j].getDownloadStatus();
					co.publicationDate = ch[j].getPublicationDate();
					co.retrieveURI = ch[j].getRetrieveURI();
					co.expectedSize = ch[j].getExpectedSize();
					co.downloadedBytes = ch[j].getDownloadedBytes();
					co.downloadRate = ch[j].getDownloadRate();
					co.downloadStatusCode = ch[j].getDownloadStatusCode();
					co.remainingDownloadTimeSeconds = ch[j].getRemainingDownloadTimeSeconds();
					co.remainingDownloadTime = ch[j].getRemainingDownloadTime();
					if (co.downloadStatus == 'COMPLETED') {
						co.uri = ch[j].getURI();
						co.downloadPercentage = 100;
					} else {
						co.uri = ch[j].getURI();
						co.downloadPercentage = ch[j].getDownloadPercentage();
					}
					content.push(co);
				}
				return content;
			}
		}
		return null;
	} catch (e) {
		TVB.error("podcast.getFeedContentById: " + e.message);
		throw e;
	}
}

/**
 * Returns the number of items of a given feed
 * @method countFeedContentByID
 * @param {String} feed_id The id of a feed
 * @return {Object} Some integer numbers: complete, count and downloading
 */
TVB.podcast.countFeedContentByID = function(feed_id) {
	try {
		TVB.log("Podcast: count feed content by id " + feed_id);
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
		var content = {};
		content.complete = 0;
		content.count = 0;
		content.downloading = 0;
		
		for (var i in TVB.podcast.fh) {
			if (TVB.podcast.fh[i].getID() == feed_id) {
				var ch = TVB.podcast.fh[i].getAllContent();
				for (var j in ch) {
					content.count++;
					if (ch[j].getDownloadStatus() == 'COMPLETED') {
						content.complete++;
					} else if (ch[j].getDownloadStatus() == 'DOWNLOADING') {
						content.downloading++;
					}
				}
				return content;
			}
		}
		return null;
	} catch (e) {
		TVB.error("podcast.countFeedContentById: " + e.message);
		throw e;
	}
}

/**
 * Returns an URI from an ID
 * @method getUriByID
 * @param {String} feed_id The ID of a feed
 * @param {String} id The ID of a content
 */
TVB.podcast.getUriByID = function(feed_id, id) {
	try {
		TVB.log("Podcast: get uri by id " + id);
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		var data = TVB.podcast.getFeedContentByID(feed_id);
		for (var i in data) {
			//TVB.log("Podcast: examinating " + data[i].ID + " = " + id + "...");
			if (data[i].ID == id) {
				return data[i].uri;
			}
		}
		return false;
	} catch (e) {
		TVB.error("podcast.getUriByID: " + e.message);
		throw e;
	}
}
