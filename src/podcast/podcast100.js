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
	
	TVB.podcast.feedExist = function(feed_id) {
		try {
			TVB.log("Podcast: feed exist " + feed_id);
			if (TVB.podcast.mgr === null) {
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
			TVB.warning("podcast.: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getFeedContentByID = function(feed_id) {
		try {
			TVB.log("Podcast: get feed content by id " + feed_id);
			if (TVB.podcast.mgr === null) {
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
			TVB.warning("podcast.getFeedContentById: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.countFeedContentByID = function(feed_id) {
		try {
			TVB.log("Podcast: count feed content by id " + feed_id);
			if (TVB.podcast.mgr === null) {
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
			TVB.warning("podcast.countFeedContentById: " + e.message);
			throw e;
		}
	};
	
	TVB.podcast.getUriByID = function(feed_id, id) {
		try {
			TVB.log("Podcast: get uri by id " + id);
			if (TVB.podcast.mgr === null) {
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
			TVB.warning("podcast.getUriByID: " + e.message);
			throw e;
		}
	};
}
