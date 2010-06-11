/**
 * TwitTiVi - Twitter and Television
 * @author Francesco Facconi <francesco.facconi@tvblob.com>
 * @copyright 2009-2010 TVBLOB S.r.l.
 */

/* CONFIGURATION AREA - EDIT IF YOU NEED TO */
var startingTweets = 20;
var maxTweets = 50;
var applicationTitle = "My Application Name"; // string; used by title bar and favorite handler
var hashtag = "#ballaro"; // hash tag or search query for Twitter
var dttChannelName = "RaiTre"; // exact match with channel name declared by broadcaster in DVB stream
var themeColor = "#0b1000"; // update this also in css file
var startingFullScreen = false;
/* END OF CONFIGURATION AREA - DO NOT EDIT ANYTHING THAT FOLLOWS */


var isFullScreen = startingFullScreen;
var onOffTimeout;
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
			var SMOJVersion = "1.49.8".split('.');
		}
		
		try {
			if (parseInt(SMOJVersion[0] > 1, 10)) {
				isTitleEditable = true;
			} else {
				if (parseInt(SMOJVersion[0], 10) === 1 && parseInt(SMOJVersion[1], 10) > 49) {
					isTitleEditable = true;
				} else {
					if (parseInt(SMOJVersion[0], 10) === 1 && parseInt(SMOJVersion[1], 10) === 49 && parseInt(SMOJVersion[2], 10) > 7) {
						isTitleEditable = true;
					} else {
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
		TVB.CustomEvent.subscribeEvent(TVB.remote.button.BLUE, blueHandler);
		//TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, yellowHandler);
		TVB.remote.disableLetters();
		TVB.remote.disableNav();

		document.body.style.paddingTop = "72px";
		document.body.style.margin = "8px";

		var container = document.createElement('div');
		container.id = 'container';
		document.body.appendChild(container);
		
		var fullScreenMessageContainer = document.createElement('div');
		fullScreenMessageContainer.id = 'fs_msg_container';
		fullScreenMessageContainer.style.display = "none";
		document.body.appendChild(fullScreenMessageContainer);
		
		var openMessageDiv = document.createElement('div');
		openMessageDiv.id = 'openMessageDiv';
		openMessageDiv.style.display = "none";
		openMessageDiv.innerHTML = "Close tweets: YELLOW";
		document.body.appendChild(openMessageDiv);

		var channels = TVB.tuner.getDvbChannelsList();
		
		for (var i = 0; i < channels.length; i++) {
			if (channels[i].name == dttChannelName) {
				var channelTripletDecoded = channels[i].uri;
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
		
		var movie = "http://cdn-0.tvblob.com/hdtv/ratatouille_720p.mov?bitrate=1000";
			
		var playerConfig = {
			top: 120,// 120
			left: 40, // 40
			width: 283,
			height: 286,
			switchKey: null,
			uri: channelTripletDecoded,
			autoplay: true,
			fullscreen: startingFullScreen,
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
		isFullScreen = !isFullScreen;
		
		if(isFullScreen){
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
			TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, openTweetBar);
			document.getElementById("openMessageDiv").innerHTML = "Open tweets: YELLOW";
			document.getElementById("fs_msg_container").style.display = "none";
			document.getElementById("openMessageDiv").style.display = "";
			scroller.enter();
			
		}else{
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
			document.getElementById("fs_msg_container").style.display = "none";
			document.getElementById("openMessageDiv").style.display = "none";
			halfScroller.enter();
			
		}
	} catch (e) {
		TVB.exception(e, 'redHandler()');
	}
};

var blueHandler = function() {
	try {
		simulateTweet();
	} catch (e) {
		TVB.exception(e, 'blueHandler()');
	}
};

var yellowHandler = function() {
	try {
		var movie = "http://cdn-0.tvblob.com/hdtv/ratatouille_720p.mov?bitrate=1000"
		var playerConfig = {
				top: 120,// 120
				left: 40, // 40
				width: 283,
				height: 286,
				switchKey: null,
				uri: movie,//channelTripletDecoded,
				autoplay: true,
				fullscreen: true
			};
			
			TVB.player.init(playerConfig);
			/*setTimeout(function() {
				//TVB.log("Starting playback");
				TVB.player.init(playerConfig);
				document.body.style.overflow = 'auto';
			}, 500);
			*/
	} catch (e) {
		TVB.exception(e, 'blueHandler()');
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

var tweets = [];
var last_tweet = null;
var updatingTwitter = false;
var scroller;
var halfScroller;
var updateTwitter = function() {
	try {
		if (updatingTwitter === true) {
			//TVB.log("TwitTiVi: updating twitter in progress");
			return false;
		}
		//TVB.log("TwitTiVi: start updating twitter");
		
		var url = "http://search.twitter.com/search.json?q=" + encodeURIComponent(hashtag);
		TVB.log(url);
		if (last_tweet !== null) {
			url += "&since_id=" + last_tweet;
		} else {
			url += "&rpp=" + startingTweets;
		}
		
		//TVB.log("TwitTiVi: loading " + url);
		
		var req = new HTTPRelay();
		var received = TVB.json.parse(req.get(url));
		newTweets = received.results;
		TVB.log(newTweets);
		delete received;
		
		TVB.log("New tweets: " + newTweets.length);
		var con = document.getElementById('container');		
		if (newTweets.length > 0) {
			tweets = newTweets.concat(tweets);
			last_tweet = newTweets[0].id;

			/*
			for (var tweet = newTweets.length - 1; tweet >= 0; tweet--) {
				var st = document.createElement('div');
				html = "<table><tr>";
				html += "<td class='col1'>";
				// Commented to not show avatars (some are big) see bug 3302
				if (newTweets[tweet].from_user != 'SKAgnozzo') {
					html += "<img src='" + newTweets[tweet].profile_image_url + "' width='48px' height='48px' alt='" + newTweets[tweet].from_user + "' />";
				} else {
					//TVB.log(newTweets[tweet]);
				}
				//tvblob.logInfo(newTweets[tweet].profile_image_url);
				
				html += "</td><td class='col2'>";
				html += "<span class='from'>" + newTweets[tweet].from_user + ": </span><span class='text'>" + newTweets[tweet].text + "</span>";
				html += " <span class='pubdate'></span>";
				html += "</td>";
				html += "</tr></table>";
				st.setAttribute('tweet_date', newTweets[tweet].created_at);
				st.className = 'tweet';
				st.innerHTML = html;
				if (con.firstChild === null) {
					con.appendChild(st);
				} else {
					con.insertBefore(st, con.firstChild);
				}
			}*/
			
			try{
				TVB.log("create menu");
				halfScroller = new TVB.scroller(halfScreenMenu);
				if(tweets.length < maxTweets)
					halfScroller.total = tweets.length;
				else
					halfScroller.total = maxTweets;
	
				halfScroller.draw();
				
				
				//document.getElementById("fs_msg_container").style.display = "";
				//document.getElementById("openMessageDiv").style.display = "";
			}catch(e){
				TVB.log(e);
			}
			
			try{
				TVB.log("create menu");
				scroller = new TVB.scroller(tweetMenu);
				if(tweets.length < maxTweets)
					scroller.total = tweets.length;
				else
					scroller.total = maxTweets;
	
				scroller.draw();
				
				
				
				//document.getElementById("fs_msg_container").style.display = "";
				//document.getElementById("openMessageDiv").style.display = "";
			}catch(e){
				TVB.log(e);
			}
			
			if(!isFullScreen){
				document.getElementById("fs_msg_container").style.display = "none";
				document.getElementById("openMessageDiv").style.display = "none";
				halfScroller.enter();
				
			}
			
			if(isFullScreen){
				TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, closeTweetBar);
				//document.getElementById("fs_msg_container").style.display = "";
				//document.getElementById("openMessageDiv").style.display = "";
				newTweet();
				scroller.enter();
				
			}
		}
		
		/*
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
		*/
		//TVB.log("Last tweet: " + last_tweet);
		
	} catch (e) {
		TVB.exception(e, 'updateTwitter()');
	}
};

function closeTweetBar(){
	TVB.log("close");
	TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
	TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, openTweetBar);
	document.getElementById("fs_msg_container").style.display = "none";
	document.getElementById("openMessageDiv").innerHTML = "Open tweets: YELLOW";
	document.getElementById("openMessageDiv").style.display = "";
	clearTimeout(onOffTimeout);
	onOffTimeout = setTimeout(function(){
		document.getElementById("openMessageDiv").style.display = "none";
	},4000);
}

function openTweetBar(){
	clearTimeout(onOffTimeout);
	TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
	TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, closeTweetBar);
	document.getElementById("fs_msg_container").style.display = "";
	document.getElementById("openMessageDiv").innerHTML = "Close tweets: YELLOW";
	document.getElementById("openMessageDiv").style.display = "";
	scroller.setCurrentLine(0);
	
}

function simulateTweet(){
	/*if(true){
		try{
			if (true) {
				var html = "<img src='' width='48px' height='48px'/>";
				html += "<span class='from'>Diabolik: </span><span class='text'>un bel video</span>";
				var msgContainer = document.getElementById("fs_msg_container");
				var msg = document.createElement('div');
				msg.innerHTML = html;
				msg.className = "footer_message";
				
				msgContainer.appendChild(msg);
			}
		}catch(e){
			TVB.log(e);
		}
		
	}*/
	/*
	clearTimeout(onOffTimeout);
	TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
	TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, openTweetBar);
	document.getElementById("openMessageDiv").innerHTML = "New tweets! YELLOW";
	document.getElementById("openMessageDiv").style.display = "";
	onOffTimeout = setTimeout(function(){
		document.getElementById("openMessageDiv").style.display = "none";
	},4000);*/
	var t = new Array();
	t[0] = new Object();
	t[0].profile_image_url = "#";
	t[0].text = "nuovo messaggio";
	t[0].from_user = "Diabolik";
	t[0].created_at = null;
	
	tweets = t.concat(tweets);
	
	try{
		TVB.log("create menu");
		halfScroller = new TVB.scroller(halfScreenMenu);
		if(tweets.length < maxTweets)
			halfScroller.total = tweets.length;
		else
			halfScroller.total = maxTweets;

		halfScroller.draw();
		
		
		//document.getElementById("fs_msg_container").style.display = "";
		//document.getElementById("openMessageDiv").style.display = "";
	}catch(e){
		TVB.log(e);
	}
};

function newTweet(){
	clearTimeout(onOffTimeout);
	TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
	TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, openTweetBar);
	document.getElementById("openMessageDiv").innerHTML = "New tweets! YELLOW";
	document.getElementById("openMessageDiv").style.display = "";
	onOffTimeout = setTimeout(function(){
		document.getElementById("openMessageDiv").style.display = "none";
	},4000);
	
}

var prettyDate = function(t) {
	try {
		TVB.log(t);
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
	locales.useRed = "Push RED button<br />for full screen";

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

var tweetMenu = {
		cid : "fs_msg_container",
		name : "test",
		visible: 1,
		total:16,
		rowSelectedColor:"#324f1c",
		rowWidthPx:"610",
		rowHeightPx:"68",
		scrollerColor: "#0b1000",
		barColor: "#5c7300",

		drawLineCB: function(line){
			try{
				var html = "";
				if(tweets[line] != null && tweets[line] != undefined){
					html = "<div class='footer_message'>";
					if (tweets[line].from_user != 'SKAgnozzo') {
						html += "<img src='" + tweets[line].profile_image_url + "' width='48px' height='48px'/>";
					} else {
						//TVB.log(newTweets[tweet]);
					}
					html += "<span class='from'>" + tweets[line].from_user + ": </span><span class='text'>" + tweets[line].text + "</span></div>";
				
				}
				return html;
			}catch(e){
				TVB.log(e);
				var html = "<div class='footer_message'><img src='aaaa' width='48px' height='48px'/>";
				html += "<span class='from'>Diabolik: </span><span class='text'>shjsasha  hjfsj hfdh fhg hfhasg  jfhgh dhjfdhhddhdhdh  fdjbgj  hjfbhdfqwygy h fdedf </span></div>";
				
				
				return html;
			}
		},

		navLeftCB: function(){

		},

		navRightCB: function(line){

		},

		selectLineCB: function(line){
			TVB.log("Selected line: " + line);
		}
}

var halfScreenMenu = {
		cid : "container",
		name : "halfScreen",
		visible: 5,
		total:16,
		rowSelectedColor:"#324f1c",
		rowWidthPx:"580",
		rowHeightPx:"68",
		scrollerColor: "#0b1000",
		barColor: "#5c7300",

		drawLineCB: function(line){
			try{
				var html = "";
				if(tweets[line] != null && tweets[line] != undefined){
					html = "<div class='tweet'>";
					if (tweets[line].from_user != 'SKAgnozzo') {
						html += "<img src='" + tweets[line].profile_image_url + "' width='48px' height='48px'/>";
					} else {
						//TVB.log(newTweets[tweet]);
					}
					html += "<span class='from'>" + tweets[line].from_user + ": </span><span class='text'>" + tweets[line].text + "</span>";
					html += "<span class='pubdate'>" + prettyDate(tweets[line].created_at) + "</span></div>";
				}
				return html;
			}catch(e){
				TVB.log(e);
				var html = "<div class='footer_message'><img src='aaaa' width='48px' height='48px'/>";
				html += "<span class='from'>Diabolik: </span><span class='text'>shjsasha  hjfsj hfdh fhg hfhasg  jfhgh dhjfdhhddhdhdh  fdjbgj  hjfbhdfqwygy h fdedf </span></div>";
				
				
				return html;
			}
		},

		navLeftCB: function(){

		},

		navRightCB: function(line){

		},

		selectLineCB: function(line){
			TVB.log("Selected line: " + line);
		}
}

