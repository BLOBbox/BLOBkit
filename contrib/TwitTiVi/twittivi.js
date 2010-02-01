/**
 * TwitTiVi - Twitter and Television
 * @author Francesco Facconi <francesco.facconi@tvblob.com>
 * @copyright 2009-2010 TVBLOB S.r.l.
 */

/* CONFIGURATION AREA - EDIT IF YOU NEED TO */
var startingTweets = 20;
var maxTweets = 50;
var applicationTitle = "Ballarò"; // string; used by title bar and favorite handler
var hashtag = "#ballaro"; // hash tag or search query for Twitter
var dttChannelName = "RaiTre"; // exact match with channel name declared by broadcaster in DVB stream
var themeColor = "#0b1000"; // update this also in css file
/* END OF CONFIGURATION AREA - DO NOT EDIT ANYTHING THAT FOLLOWS */

/**
 * Initialize Application
 */
var init = function() {
	try {
		try {
			tvblob.logInfo("TwitTiVi version %%VERSION%%");
		} catch (e) {
			try {
				console.log("TwitTiVi version %%VERSION%%");
			} catch (e) {}
		}

		try {
			var SMOJVersion = TVB.system.getSMOJVersion().split('.');
		} catch (e) {
			//TVB.log(e.message);
			vasr SMOJVersion = "1.49.8".split('.');
		}
		
		try {
			if (parseInt(SMOJVersion[0] > 1, 10)) {
				//TVB.log("SMOJVersion > 1.X");
				isTitleEditable = true;
			} else {
				if (parseInt(SMOJVersion[0], 10) === 1 && parseInt(SMOJVersion[1], 10) > 49) {
					//TVB.log("SMOJVersion > 1.49.X");
					isTitleEditable = true;
				} else {
					if (parseInt(SMOJVersion[0], 10) === 1 && parseInt(SMOJVersion[1], 10) === 49 && parseInt(SMOJVersion[2], 10) > 7) {
						//TVB.log("SMOJVersion > 1.49.7");
						isTitleEditable = true;
					} else {
						//TVB.log("SMOJVersion < 1.49.8");
						isTitleEditable = false;
					}
				}
			}
		} catch (e) {
			//TVB.log(e.message);
			isTitleEditable = true;
		}
		//TVB.log("isTitleEditable = " + isTitleEditable);

		if (isTitleEditable) {
			document.title = applicationTitle;
		}
		
		// Remove temporary loading
		TVB.system.deleteElementById('loadingForTheFirstTime');
		
		// Draw title
		TVB.widget.titleBar.setTitle(applicationTitle);
		//TVB.widget.titleBar.setIcon("images/icon_digitalia.png");
		TVB.widget.titleBar.setBackgroundColor(themeColor);
		TVB.widget.titleBar.render();
		
		// Draw color buttons bar
		//TVB.widget.colorButtonsBar(locales.subscribe, '', '', '');
		//TVB.widget.colorButtonsBar('', '', '', '');
		
		TVB.widget.setSelectedCursorColor('ff7178c3');
		TVB.widget.setHighlightCursorColor('fff6c048');

		TVB.remoteInit();
		TVB.CustomEvent.subscribeEvent(TVB.remote.button.RED, redHandler);
		TVB.remote.disableLetters();
		TVB.remote.disableNav();

		document.body.style.paddingTop = "72px";
		document.body.style.margin = "8px";

		var container = document.createElement('div');
		container.id = 'container';
		document.body.appendChild(container);

		var channels = TVB.tuner.getDvbChannelsList();
		
		for (var i = 0; i < channels.length; i++) {
			if (channels[i].name == dttChannelName) {
				var raitre = channels[i].uri;
				//TVB.log("Found " + dttChannelName + ": " + channels[i].uri);
			}
		}
		
		var gd = document.createElement('div');
		gd.id = 'gd';
		gd.style.top = '120px';
		gd.style.left = '40px';
		gd.style.width = '283px';
		gd.style.height = '286px';
		gd.style.position = 'fixed';
		gd.style.backgroundColor = themeColor;
		document.body.appendChild(gd);
		
		var td = document.createElement('div');
		td.id = 'td';
		td.className = 'tweet';
		td.innerHTML = locales.getFromTwitter;
		td.style.backgroundColor = themeColor;
		container.appendChild(td);
		
		var playerConfig = {
			top: 120,// 120
			left: 40, // 40
			width: 283,
			height: 286,
			switchKey: null,
			uri: raitre,
			autoplay: true,
			fullscreen: false,
			noLittleHole: false
		};
		
		setTimeout(function() {
			//TVB.log("Starting playback");
			TVB.player.init(playerConfig);
			document.body.style.overflow = 'auto';
		}, 500);
		
		var nextShow = document.createElement('div');
		nextShow.id = 'next_show';
		nextShow.innerHTML = locales.useRed; 
		document.body.appendChild(nextShow);

		setTimeout(function() {
			container.removeChild(document.getElementById('td'));
			updateTwitter();
		}, 1000);
		
		setInterval(function() {
			updateTwitter();
		}, 30000);


	} catch (e) {
		TVB.exception(e, 'init()');
	}
};

var redHandler = function() {
	try {
		TVB.player.switchFullScreen();
	} catch (e) {
		TVB.exception(e, 'redHandler()');
	}
};

var eosPlayback = function() {
	try {
		//TVB.log("TwitTiVi: trying again to connect to stream in 5 seconds...");
		setTimeout(function() {
			TVB.player.play();
		}, 5000);
	} catch (e) {
		TVB.exception(e, 'eosPlayback()');
	}
};

var tweet_list = [];
var last_tweet = null;
var updatingTwitter = false;
var updateTwitter = function() {
	try {
		if (updatingTwitter === true) {
			//TVB.log("TwitTiVi: updating twitter in progress");
			return false;
		}
		//TVB.log("TwitTiVi: start updating twitter");
		
		var url = "http://search.twitter.com/search.json?q=" + encodeURIComponent(hashtag);
		
		if (last_tweet !== null) {
			url += "&since_id=" + last_tweet;
		} else {
			url += "&rpp=" + startingTweets;
		}
		
		//TVB.log("TwitTiVi: loading " + url);
		
		var req = new HTTPRelay();
		var received = TVB.json.parse(req.get(url));
		var tweets = received.results;
		delete received;
		
		//TVB.log("New tweets: " + tweets.length);
		var con = document.getElementById('container');		
		if (tweets.length > 0) {
			last_tweet = tweets[0].id;

			for (var tweet = tweets.length - 1; tweet >= 0; tweet--) {
				var st = document.createElement('div');
				html = "<table><tr>";
				html += "<td class='col1'>";
				// Commented to not show avatars (some are big) see bug 3302
				if (tweets[tweet].from_user != 'SKAgnozzo') {
					html += "<img src='" + tweets[tweet].profile_image_url + "' width='48px' height='48px' alt='" + tweets[tweet].from_user + "' />";
				} else {
					//TVB.log(tweets[tweet]);
				}
				//tvblob.logInfo(tweets[tweet].profile_image_url);
				
				html += "</td><td class='col2'>";
				html += "<span class='from'>" + tweets[tweet].from_user + ": </span><span class='text'>" + tweets[tweet].text + "</span>";
				html += " <span class='pubdate'></span>";
				html += "</td>";
				html += "</tr></table>";
				st.setAttribute('tweet_date', tweets[tweet].created_at);
				st.className = 'tweet';
				st.innerHTML = html;
				if (con.firstChild === null) {
					con.appendChild(st);
				} else {
					con.insertBefore(st, con.firstChild);
				}
			}
		}
		
		// vedo se ci sono troppi oggetti
		var all = con.getElementsByTagName('div');
		for (var h = maxTweets; h < all.length; h++) {
			//TVB.log("Removing old tweet " + h);
			con.removeChild(all[h]);
		}
		
		if (all.length === 0) {
			//TVB.log(locales.noTweets);
			var td = document.createElement('div');
			td.id = 'td';
			td.className = 'tweet';
			td.innerHTML = locales.noTweets;
			td.style.backgroundColor = themeColor;
			container.appendChild(td);			
		} else {
			if (document.getElementById('td') !== null) {
				con.removeChild(document.getElementById('td'));
			}
		}
		
		// per ogni oggetto, verifico se è cambiata la data
		var ot = con.getElementsByTagName('div');
		for (var i in ot) {
			if (ot[i].className == 'tweet') {
				var ct = ot[i].getElementsByTagName('span');
				for (var j in ct) {
					if (ct[j].className == 'pubdate') {
						ct[j].innerHTML = "(" + prettyDate(ot[i].getAttribute('tweet_date')) + ")";
					}
				}
			}
		}
		
		//TVB.log("Last tweet: " + last_tweet);
		
	} catch (e) {
		TVB.exception(e, 'updateTwitter()');
	}
};

var prettyDate = function(t) {
	try {
		var date = new Date(t),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
				
		if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
			return t;
		}
				
		return day_diff === 0 && (
				diff < 60 && locales.justNow ||
				diff < 120 && locales.oneMinuteAgo ||
				diff < 3600 && Math.floor( diff / 60 ) + locales.minutesAgo ||
				diff < 7200 && locales.oneHourAgo ||
				diff < 86400 && Math.floor( diff / 3600 ) + locales.hoursAgo) ||
			day_diff == 1 && locales.yesterday ||
			day_diff < 7 && day_diff + locales.daysAgo ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + locales.weeksAgo;
	} catch (e) {
		//return date;
		TVB.exception(e, 'prettyDate()');
	}
};

try {
	var languageCode = TVB.system.getLanguageCode();
	if (languageCode === false) {
		languageCode = 'en';
	}

	var locales = {};
	locales.hoursAgo = " hours ago";
	locales.minutesAgo = " minutes ago";
	locales.justNow = "just now";
	locales.yesterday = "Yesterday";
	locales.oneMinuteAgo = "1 minute ago";
	locales.oneHourAgo = "1 hour ago";
	locales.daysAgo = " days ago";
	locales.weeksAgo = " weeks ago";
	locales.subscribe = "SUBSCRIBE";
	locales.getFromTwitter = 'Fetching messages from Twitter...';
	locales.noTweets = 'No tweets are available now.';
	locales.useRed = "Push ROSSO button<br />for full screen";

	switch (languageCode) {
		case 'it':
			locales.hoursAgo = " ore fa";
			locales.minutesAgo = " minuti fa";
			locales.justNow = "proprio ora";
			locales.yesterday = "Ieri";
			locales.oneMinuteAgo = "1 minuto fa";
			locales.oneHourAgo = "1 ora fa";
			locales.daysAgo = " giorni fa";
			locales.weeksAgo = " settimane fa";
			locales.subscribe = "ABBONATI";
			locales.getFromTwitter = 'Sto caricando i messaggi da Twitter...';
			locales.noTweets = "Al momento non sono disponibili Tweet sull'argomento.";
			locales.useRed = "Premi ROSSO per<br />schermo intero";
	}
} catch (e) {
	TVB.exception(e, 'resources.js');
}

try {
	init();
} catch (e) {
	TVB.error(e);
}
