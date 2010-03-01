/**
 * <h1>Podcast Manager</h1>
 * 
 * <h2>feedObject</h2>
 * <dl>
 * 		<dt>ID:</dt><dd>String, unique identifier that represents the feed</dd>
 * 		<dt>title:</dt><dd>String, taken from the RSS feed, it is the name of this feed</dd>
 * 		<dt>description:</dt><dd>String, taken from the RSS feed, is a brief description of this feed</dd>
 * 		<dt>isHidden:</dt><dd>Boolean, true is the feed is hidden in standard podcast application, false if it is visible</dd>
 * 		<dt>lastBuildDate:</dt><dd>String containing a standard RSS date, represents the feed last build date</dd>
 * 		<dt>pubDate:</dt><dd>String containing a standard RSS date, represents the feed publication date</dd>
 * 		<dt>timeToLive:</dt><dd>Integer, number of minutes before refreshing the feed</dd>
 * 		<dt>isTimeToLiveInfinite:</dt><dd>Boolean, true if the feed has no expiring date</dd>
 * 		<dt>hasContent:</dt><dd>Boolean, true if the feed contains at least one element</dd>
 * 		<dt>contentCounter:</dt><dd>Integer, number of elements in the feed</dd>
 * 		<dt>contentIdentifiers:</dt><dd>Array of strings, contains the IDs of all feed's contents</dd>
 * </dl>
 * 
 * <h2>contentObject</h2>
 * <dl>
 * 		<dt>ID:</dt><dd>String, unique identifier that represents the content</dd>
 * 		<dt>title:</dt><dd>String, taken from the RSS feed, it is the name of this content</dd>
 * 		<dt>name:</dt><dd>String, alias for title</dd>
 * 		<dt>description:</dt><dd>String, taken from the RSS feed, is a brief description of this content</dd>
 * 		<dt>publicationDate:</dt><dd>String containing a standard RSS date, represents the content publication date</dd>
 * 		<dt>uri:</dt><dd>String, URI for content playback or null if not playable</dd>
 * 		<dt>retrieveURI:</dt><dd>String, the original download URI</dd>
 * 		<dt>expectedSize:</dt><dd>Long, the size in bytes of the file as stated in the RSS feed, or given by remote server; can be wrong if RSS feed or server return a wrong information</dd>
 * 		<dt>downloadPercentage:</dt><dd>Integer, [0..100], < 0 if not available</dd>
 * 		<dt>downloadStatus:</dt><dd>String, see downloadStatus table for the complete list of statuses</dd>
 * 		<dt>downloadStatusCode:</dt><dd>Integer, see downloadStatus table for the complete list of statuses</dd>
 * 		<dt>downloadedBytes:</dt><dd>Integer, number of downloaded bytes for this download (available only when the file is downloading)</dd>
 * 		<dt>downloadRate:</dt><dd>Integer, return current download speed in bytes per second at this moment or < 0 if information is not available (available only when the file is downloading)</dd>
 * 		<dt>remainingDownloadTimeSeconds:</dt><dd>Integer, estimate remaining download time in seconds. Returns 0 if completed, < 0 if estimate not possible (stalled, info unavailable, error)</dd>
 * 		<dt>remainingDownloadTime:</dt><dd>Array, return an estimate of the remaining download time as an array of longs {days, hours, minutes, seconds}. If estimate is not available, null is returned. If download is complete, an array {0, 0, 0, 0} is returned. (available only when the file is downloading)</dd>
 * 		<dt>isPlayable:</dt><dd>Boolean, true if the media is playable</dd>
 * 		<dt>isDownloading:</dt><dd>Boolean, true if the file is currently being downloaded</dd>
 * </dl>
 * 
 * <h2>downloadStatus</h2>
 * 
 * <table>
 * <thead><td>Code</td><td>Status name</td></thead>
 * <tr><td>0</td><td>UNKNOWN</td></tr>
 * <tr><td>1</td><td>STARTING</td></tr>
 * <tr><td>2</td><td>INVALID</td></tr>
 * <tr><td>3</td><td>DOWNLOADING</td></tr>
 * <tr><td>4</td><td>PAUSED</td></tr>
 * <tr><td>5</td><td>ERROR</td></tr>
 * <tr><td>6</td><td>COMPLETED</td></tr>
 * <tr><td>7</td><td>MOVING</td></tr>
 * <tr><td>8</td><td>MOVED</td></tr>
 * <tr><td>9</td><td>MOVE_ERROR</td></tr>
 * </table>
 * 
 * <h2>counterObject</h2>
 * <dl>
 *    <dt>count:</dt><dd>the total number of elements in the feed</dd>
 *    <dt>complete:</dt><dd>the number of completed elements</dd>
 *    <dt>downloading:</dt><dd>the number of elements in download</dd>
 *    <dt>error:</dt><dd>the number of elements that have errors</dd>
 *    <dt>playable:</dt><dd>the number of playable elements (can be different from complete in firmwares that supports progressive download)</dd>
 * </dl>
 * 
 * <h2>Security warning</h2>
 * 
 * <p>To prevent unauthorized use of private information, the first time the Podcast API is used in an application, a popup window is displayed
 * to the user to ask his permission.</p>
 * 
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
	version_integer: null
};

try {
	TVB.podcast.version = tvblob.getFeatureVersion("PushVodFeedsManager");
	var vrs = TVB.podcast.version.split(".");
	if (vrs.length > 1) {
		TVB.podcast.version_integer = parseInt(parseInt(vrs[0] * 100, 10) + parseInt(vrs[1], 10), 10);
	} else if (vrs.length == 1) {
		TVB.podcast.version_integer = parseInt(vrs[0] * 100, 10);
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
 * @exception {InitError}
 */
TVB.podcast.init = function() {
	try {
		TVB.log("Podcast: init");
		
		if (TVB.podcast.mgr !== null) {
			return false;
		}
		TVB.podcast.mgr = new PushVodFeedsManager();
		return true;
	} catch (e) {
		TVB.warning("Podcast: init: " + e.message);
		throw InitError;
	}
};

// FEEDS

/**
 * Alias to getFeeds
 * @method getAllFeeds
 * @return {Object} feedObject[]
 */
TVB.podcast.getAllFeeds = function() {
	try {
		TVB.log("Podcast: getAllFeeds()");
		return TVB.podcast.getFeeds();
	} catch (e) {
		throw e;
	}
};

/**
 * Returns all feeds meta information in a structured array
 * @method getFeeds
 * @return {Object} feedObject[]
 */
TVB.podcast.getFeeds = function() {
	try {
		TVB.log("Podcast: getFeeds()");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fe = [];
		TVB.log("Initializing fh");
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			TVB.log("Iteration " + i);
			var fho = fh[i];
			fe[fho.getID()] = TVB.podcast.formatFeedObject(fho);
		}
		return fe;
	} catch (e) {
		TVB.warning("Podcast: getFeeds: " + e.message);
		throw e;
	}
};

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
};

/**
 * Returns an array of IDs of all subscribed feeds
 * @method getFeedsID
 * @return {Array} feedID[] The list of feeds IDs
 */
TVB.podcast.getFeedsID = function() {
	try {
		TVB.log("Podcast: getFeedsID()");
		if (TVB.podcast.mgr === null) {
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
		TVB.warning("Podcast: getFeedsID: " + e.message);
		throw e;
	}
};

/**
 * Returns given feed meta information in a structured object 
 * @method getFeedByID
 * @param {String} feedID The ID of the feed you want to get information about
 * @return {Object} feedObject, null if not found
 */
TVB.podcast.getFeedByID = function(feedID) {
	try {
		TVB.log("Podcast: getFeedByID(" + feedID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho === null) {
			return null;
		} else {
			return TVB.podcast.formatFeedObject(fho);
		}
	} catch (e) {
		TVB.warning("Podcast: getFeeds: " + e.message);
		throw e;
	}
};

/**
 * Returns all visible feeds meta informations
 * @method getVisibleFeeds
 * @return {Object} feedObject
 */
TVB.podcast.getVisibleFeeds = function() {
	try {
		TVB.log("Podcast: getVisibleFeeds()");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fe = [];
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			var fho = fh[i];
			if (fho.isHidden() === false) {
				fe[fho.getID()] = TVB.podcast.formatFeedObject(fho);
			}
		}
		return fe;
	} catch (e) {
		TVB.warning("podcast.getFeeds: " + e.message);
		throw e;
	}
};

/**
 * Returns an array of IDs of all subscribed feeds that are not hidden
 * @method getVisibleFeedsID
 * @return {Array} feedID[]
 */
TVB.podcast.getVisibleFeedsID = function() {
	try {
		TVB.log("Podcast: getVisibleFeedsID()");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		
		var ids = [];
		var fh = TVB.podcast.mgr.getAllFeeds();
		for (var i in fh) {
			var fho = fh[i];
			if (fho.isHidden() === false) {
				ids.push(fho.getID());
			}
		}
		return ids;
	} catch (e) {
		TVB.warning("Podcast: getVisibleFeedsID: " + e.message);
		throw e;
	}
};

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
		};
		
		if (fhd.contentIdentifiers.length > 0) {
			fhd.hasContent = true;
		}
		fhd.contentCounter = fhd.contentIdentifiers.length;
		
		return fhd;
	} catch (e) {
		TVB.warning("Podcast: formatFeedObject: " + e.message);
		throw e;
	}
};

/**
 * Returns description for a given feedID
 * @method getFeedDescription
 * @param {String} feedID The ID of the feed
 * @return {String} The description of the feed
 */
TVB.podcast.getFeedDescription = function(feedID) {
	try {
		TVB.log("Podcast: getFeedDescription(" + feedID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho === null) {
			return null;
		} else {
			return fho.getDescription();
		}
	} catch (e) {
		TVB.warning("podcast.getFeedDescription: " + e.message);
		return false;
	}
};

/**
 * Returns title for a given feedID
 * @method getFeedTitle
 * @param {String} feedID The ID of the feed
 * @return {String} The title of the feed
 */
TVB.podcast.getFeedTitle = function(feedID) {
	try {
		TVB.log("Podcast: getFeedTitle(" + feedID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho === null) {
			return null;
		} else {
			return fho.getTitle();
		}
	} catch (e) {
		TVB.warning("podcast.getFeedTitle: " + e.message);
		return false;
	}
};

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
		TVB.warning("Podcast: feedExist: this function is deprecated, please use feedExists.");
		return TVB.podcast.feedExists(feedID);
	} catch (e) {
		TVB.warning("Podcast: feedExist: " + e.message);
		throw e;
	}
};

/**
 * Returns the information for a given feed
 * @method feedExists
 * @param {String} feedID The ID of a feed
 * @return {Boolean} True if the feed exists, false otherwise
 */
TVB.podcast.feedExists = function(feedID) {
	try {
		TVB.log("Podcast: feedExists(" + feedID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		
		if (fho === null) {
			return false;
		} else {
			return true;
		}
	} catch (e) {
		TVB.warning("Podcast: feedExists: " + e.message);
		throw e;
	}
};

/**
 * Returns the number of items of a given feedID.
 * @method countFeedContentByID
 * @param {String} feedID The ID of a feed
 * @return {Object} counterObject, null if feedID doesn't exist
 */
TVB.podcast.countFeedContentByID = function(feedID) {
	try {
		TVB.log("Podcast: countFeedContentByID(" + feedID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);

		var content = {
			count: 0,
			complete: 0,
			downloading: 0,
			error: 0,
			playable: 0
		};

		if (fho === null) {
			return null;
		} else {
			// cl = content list
			cl = fho.getAllContents();
			content.count = cl.length;
			for (var i in cl) {
				if (cl[i].getURI() !== null) {
					content.complete++;
					content.playable++; // complete and playable will differ when progressive download will be implemented
				} else if (cl[i].getDownloadInfo() !== null) {
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
		TVB.warning("podcast.countFeedContentByID: " + e.message);
		throw e;
	}
};

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
		};

		if (chd.uri !== null) {
			chd.isPlayable = true;
			chd.downloadStatus = 'COMPLETED';
			chd.downloadStatusCode = 6;
			chd.downloadPercentage = 100;
		} else {
			chd.isPlayable = false;
			chd.downloadStatus = 'STARTING';
			chd.downloadStatusCode = 5;
		}
		
		var di = contentHandler.getDownloadInfo();
		if (di === null) {
			chd.isDownloading = false;
		} else {
			chd.isDownloading = true;
			chd.downloadPercentage = di.getDownloadPercentage();
			chd.downloadStatus = di.getDownloadStatus();
			chd.downloadStatusCode = di.getDownloadStatusCode();
			chd.downloadedBytes = di.getDownloadedBytes();
			chd.downloadRate = di.getDownloadRate();
			chd.remainingDownloadTimeSeconds = di.getRemainingDownloadTimeSeconds();
			chd.remainingDownloadTime = di.getRemainingDownloadTime();
		}
		return chd;
	} catch (e) {
		TVB.warning("Podcast: formatContentObject: " + e.message);
		throw e;
	}
};

/**
 * Returns the content (items) of a given feedID
 * @method getFeedContentByID
 * @param {String} feedID The ID of a feed
 * @return {Object} contentObject[]
 */
TVB.podcast.getFeedContentByID = function(feedID) {
	try {
		TVB.log("Podcast: getFeedContentByID(" + feedID + ")");
		if (TVB.podcast.mgr === null) {
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
		TVB.warning("Podcast: getFeedContentByID: " + e.message);
		throw e;
	}
};

/**
 * Returns the content (items) of a given feedID and contentID
 * @method getFeedContentByContentID
 * @param {String} feedID The ID of a feed
 * @param {String] contentID The ID of a content in the feed
 * @return {Object} contentObject
 */
TVB.podcast.getFeedContentByContentID = function(feedID, contentID) {
	try {
		TVB.log("Podcast: getFeedContentByContentID(" + feedID + ", " + contentID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		var cho = fho.getContentByID(contentID);
		if (cho === null) {
			return null;
		} else {
			return TVB.podcast.formatContentObject(cho);
		}
	} catch (e) {
		TVB.warning("Podcast: getFeedContentByID: " + e.message);
		throw e;
	}
};

/**
 * Returns an URI from an ID
 * @method getUriByID
 * @param {String} feedID The ID of a feed
 * @param {String} contentID The ID of a content
 * @return {String} an URI, null if not found
 */
TVB.podcast.getUriByID = function(feedID, contentID) {
	try {
		TVB.log("Podcast: getUriByID(" + feedID + ", " + contentID + ")");
		if (TVB.podcast.mgr === null) {
			TVB.podcast.init();
		}
		var fho = TVB.podcast.mgr.getFeedByID(feedID);
		var cho = fho.getContentByID(contentID); 
		return cho.getURI();
	} catch (e) {
		TVB.warning("Podcast: getUriByID: " + e.message);
		throw e;
	}
};

///////////////////
// PODCAST 1.0.0 //
///////////////////

/*
 * Podcast Manager for BlobScript PushVOD API 1.0
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

if (TVB.podcast.version_integer < 101) {
	
	TVB.podcast.init = function() {
		try {
			TVB.log("Podcast: init");
			
			if (TVB.podcast.mgr !== null) {
				return false;
			}
			TVB.podcast.mgr = new PushVodFeedsManager();
			return true;
		} catch (e) {
			TVB.warning("podcast.init: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.refresh = function() {
		try {
			TVB.log("Podcast: refresh");
			if (TVB.podcast.mgr === null) {
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
				};
				TVB.podcast.feeds[fho.getID()] = fhd;
			}
			return true;
		} catch (e) {
			TVB.warning("podcast.refresh: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getFeedDescription = function(feedID) {
		try {
			TVB.log("Podcast: get feed description " + feedID);
			TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
			for (var i in TVB.podcast.fh) {
				var fho = TVB.podcast.fh[i];
				if (fho.getID() == feedID) {
					return fho.getDescription();
				}
			}
			return false;
		} catch (e) {
			TVB.warning("podcast.getFeedDescription: " + e.message);
			return false;
		}
	};
	
	TVB.podcast.getFeedTitle = function(feedID) {
		try {
			TVB.log("Podcast: get feed title " + feedID);
			TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
			for (var i in TVB.podcast.fh) {
				var fho = TVB.podcast.fh[i];
				if (fho.getID() == feedID) {
					return fho.getTitle();
				}
			}
			return false;
		} catch (e) {
			TVB.warning("podcast.getFeedTitle: " + e.message);
			return false;
		}
	};
	
	TVB.podcast.getFeeds = function() {
		try {
			TVB.log("Podcast: get feeds");
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			TVB.podcast.refresh();
			return TVB.podcast.feeds;
		} catch (e) {
			TVB.warning("podcast.getFeeds: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getVisibleFeeds = function() {
		try {
			TVB.log("Podcast: get feeds");
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			TVB.podcast.refresh();
			var data = [];
			for (var i in TVB.podcast.feeds) {
				if (TVB.podcast.feeds[i].isHidden === false) {
					data.push(TVB.podcast.feeds[i]);
				}
			}
			return data;
		} catch (e) {
			TVB.warning("podcast.getFeeds: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getFeedsID = function() {
		try {
			TVB.log("Podcast: get feeds ID");
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			TVB.podcast.refresh();
			var ids = [];
			for (var i in TVB.podcast.feeds) {
				ids.push(TVB.podcast.feeds[i].ID);
			}
			TVB.log(TVB.dump(ids));
			return TVB.podcast.feeds;
		} catch (e) {
			TVB.warning("podcast.getFeedsID: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.feedExist = function(feedID) {
		try {
			TVB.log("Podcast: feed exist " + feedID);
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			TVB.podcast.refresh();
			for (var i in TVB.podcast.feeds) {
				if (TVB.podcast.feeds[i].ID == feedID) {
					return true;
				}
			}
			return false;
		} catch (e) {
			TVB.warning("podcast.: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getFeedContentByID = function(feedID) {
		try {
			TVB.log("Podcast: get feed content by id " + feedID);
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
			var content = [];
			for (var i in TVB.podcast.fh) {
				if (TVB.podcast.fh[i].getID() == feedID) {
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
			TVB.warning("podcast.getFeedContentById: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.countFeedContentByID = function(feedID) {
		try {
			TVB.log("Podcast: count feed content by id " + feedID);
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			TVB.podcast.fh = TVB.podcast.mgr.getAllFeeds();
			var content = {};
			content.complete = 0;
			content.count = 0;
			content.downloading = 0;
			
			for (var i in TVB.podcast.fh) {
				if (TVB.podcast.fh[i].getID() == feedID) {
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
			TVB.warning("podcast.countFeedContentById: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getUriByID = function(feedID, id) {
		try {
			TVB.log("Podcast: get uri by id " + id);
			if (TVB.podcast.mgr === null) {
				throw {message: "Not inited"};
			}
			var data = TVB.podcast.getFeedContentByID(feedID);
			for (var i in data) {
				//TVB.log("Podcast: examinating " + data[i].ID + " = " + id + "...");
				if (data[i].ID == id) {
					return data[i].uri;
				}
			}
			return false;
		} catch (e) {
			TVB.warning("podcast.getUriByID: " + e.message);
			throw e;
		}
	};
}
