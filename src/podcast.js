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
}

/**
 * Initialize the podcast system
 * @method init
 * @return {Boolean} Result of the operation
 */
TVB.podcast.init = function() {
	try {
		TVB.log("Podcast: init");
		if (TVB.podcast.mgr != null) {
			return false;
			//throw {message: "Already inited"};		
		}
		TVB.podcast.mgr = new PushVodFeedsManager();
		return true;
	} catch (e) {
		TVB.error("podcast.init: " + e.message);
		throw e;
	}
}

/**
 * Refreshes the content of the feeds in memory
 * @method refresh
 * @private
 * @return {Boolean}
 */
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

/**
 * Returns description for a particular feed
 * @method getFeedDescription
 * @param {String} feedID The ID of the feed
 * @return {String} The description of the feed
 */
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
		TVB.error("podcast.getFeedDescription: " + e.message);
		return false;
	}
}

/**
 * Returns title for a particular feed
 * @method getFeedTitle
 * @param {String} feedID The ID of the feed
 * @return {String} The title of the feed
 */
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
		TVB.error("podcast.getFeedTitle: " + e.message);
		return false;
	}
}

/**
 * Returns all feeds meta informations
 * @method getFeeds
 * @return {Object} Feeds
 */
TVB.podcast.getFeeds = function() {
	try {
		TVB.log("Podcast: get feeds");
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		TVB.podcast.refresh();
		return TVB.podcast.feeds;
	} catch (e) {
		TVB.error("podcast.getFeeds: " + e.message);
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
		TVB.log("Podcast: get feeds");
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		TVB.podcast.refresh();
		var data = [];
		for (var i in TVB.podcast.feeds) {
			if (TVB.podcast.feeds[i].isHidden == false) {
				data.push(TVB.podcast.feeds[i]);
			}
		}
		return data;
	} catch (e) {
		TVB.error("podcast.getFeeds: " + e.message);
		throw e;
	}
}

/**
 * Returns an array of IDs of all subscribed feeds
 * @method getFeedsID
 * @return {Array} The list of feeds' IDs
 */
TVB.podcast.getFeedsID = function() {
	try {
		TVB.log("Podcast: get feeds ID");
		if (TVB.podcast.mgr == null) {
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
		TVB.error("podcast.getFeedsID: " + e.message);
		throw e;
	}
}

/**
 * Returns the information for a given feed
 * @method feedExist
 * @param {String} feed_id The id of a feed
 * @return {Object} Informations about the feed
 */
TVB.podcast.feedExist = function(feed_id) {
	try {
		TVB.log("Podcast: feed exist " + feed_id);
		if (TVB.podcast.mgr == null) {
			throw {message: "Not inited"};
		}
		TVB.podcast.refresh();
		for (var i in TVB.podcast.feeds) {
			if (TVB.podcast.feeds[i].ID == feed_id) {
				return true;
			}
		}
		return false;
	} catch (e) {
		TVB.error("podcast.: " + e.message);
		throw e;
	}
}

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
