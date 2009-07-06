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
 * @param {String} feedID The ID of the feed you want to get information about
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

/**
 * Returns the number of items of a given feedID.
 * The returned object contains the following fields:
 *    count: the total number of elements in the feed
 *    complete: the number of completed elements
 *    downloading: the number of elements in download
 *    error: the number of elements that have errors
 *    playable: the number of playable elements (can be different from complete in firmwares that supports progressive download)
 * @method countFeedContentByID
 * @param {String} feedID The ID of a feed
 * @return {Object} Some integer numbers: complete, count (the total number) and downloading; null if feedID doesn't exist
 */
TVB.podcast.countFeedContentByID = function(feedID) {
	try {
		TVB.log("Podcast: countFeedContentByID(" + feedID + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);

		var content = {
			count: 0,
			complete: 0,
			downloading: 0,
			error: 0,
			playable: 0,
		};

		if (fho == null) {
			return null;
		} else {
			// cl = content list
			cl = fho.getAllContents();
			content.count = cl.length;
			for (var i in cl) {
				if (cl[i].getURI() != null) {
					content.complete++;
					content.playable++; // complete and playable will differ when progressive download will be implemented
				} else if (cl[i].getDownloadInfo() != null) {
					var di = cl[i].getDownloadInfo();
					switch (di.getDownloadStatus()) {
						case 'ERROR_CODE':
						case 'MOVE_ERROR':
						case 'INVALID':
							content.error++;
							break;
						default:
							content.downloading++;
					}
				} else {
					content.error++;
				}
			}
			return content;
		}
	} catch (e) {
		TVB.error("podcast.countFeedContentByID: " + e.message);
		throw e;
	}
}

// CONTENTS

/**
 * @method formatContentObject
 * @param {Object} contentHandler
 * @return contentObject
 * @private
 */
TVB.podcast.formatContentObject = function(contentHandler) {
	try {
		TVB.log("Podcast: formatContentObject()");
		
		var chd = {
			ID: contentHandler.getID(),
			name: contentHandler.getName(),
			title: contentHandler.getName(),
			description: contentHandler.getDescription(),
			publicationDate: contentHandler.getPublicationDate(),
			uri: contentHandler.getURI(),
			retrieveURI: contentHandler.getRetrieveURI(), 
			expectedSize: contentHandler.getExpectedSize(),
			downloadPercentage: null,
			downloadStatus: null,
			downloadStatusCode: null,
			downloadedBytes: null,
			downloadRate: null,
			remainingDownloadTimeSeconds: null,
			remainingDownloadTime: null,
			isPlayable: false,
			isDownloading: false
		}

		if (chd.uri != null) {
			chd.isPlayable = true;
			chd.downloadStatus = 'COMPLETED';
			chd.downloadStatusCode = 6;
			chd.downloadPercentage = 100;
		} else {
			chd.isPlayable = false;
			chd.downloadStatus = 'ERROR';
			chd.downloadStatusCode = 5;
		}
		
		var di = contentHandler.getDownloadInfo();
		if (di == null) {
			isDownloading = false;
		} else {
			isDownloading = true;
			downloadPercentage = di.getDownloadPercentage();
			downloadStatus = di.getDownloadStatus();
			downloadStatusCode = di.getDownloadStatusCode();
			downloadedBytes = di.getDownloadedBytes();
			downloadRate = di.getDownloadRate();
			remainingDownloadTimeSeconds = di.getRemainingDownloadTimeSeconds();
			remainingDownloadTime = di.getRemainingDownloadTime();
		}
		return chd;
	} catch (e) {
		TVB.error("Podcast: formatContentObject: " + e.message);
		throw e;
	}
}

/**
 * Returns the content (items) of a given feedID
 * @method getFeedContentByID
 * @param {String} feedID The id of a feed
 * @return {Object} An array of objects filled with informations about all of the items included in the given feed
 */
TVB.podcast.getFeedContentByID = function(feedID) {
	try {
		TVB.log("Podcast: getFeedContentByID(" + feed_id + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		var cho = fho.getAllContents();
		var cl = [];
		for (var i in cho) {
			cl[cho[i].getID()] = TVB.podcast.formatContentObject(cho[i]);
		}
		return cl;
	} catch (e) {
		TVB.error("Podcast: getFeedContentByID: " + e.message);
		throw e;
	}
}

/**
 * Returns an URI from an ID
 * @method getUriByID
 * @param {String} feedID The ID of a feed
 * @param {String} contentID The ID of a content
 * @return {String} an URI, null if not found
 */
TVB.podcast.getUriByID = function(feedID, contentID) {
	try {
		TVB.log("Podcast: getUriByID(" + feedID + ", " + contentID + ")");
		if (TVB.podcast.mgr == null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		var cho = fho.getContentByID(contentID); 
		return cho.getURI();
	} catch (e) {
		TVB.error("Podcast: getUriByID: " + e.message);
		throw e;
	}
}
