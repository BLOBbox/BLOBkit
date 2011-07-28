/**
 * TwitTiVi - Twitter and Television
 * @author Francesco Facconi <francesco.facconi@tvblob.com>
 * @copyright 2009-2010 TVBLOB S.r.l.
 */

/* CONFIGURATION AREA - EDIT IF YOU NEED TO */
var startingTweets = 10;
var maxTweets = 20;
var updateInterval = 60000;
var applicationTitle = "My Application Name"; // string; used by title bar and favorite handler
var hashtag = "worldcup"; // hash tag or search query for Twitter
var dttChannelName = null; // exact match with channel name declared by broadcaster in DVB stream. Null if not needed
var streamName = "http://media.meteo.it/wmv/Italia_tg.wmv"; // URI of the stream to be played. Null if not needed
var icon = null;
var primaryColor = "#0b1000"; // update this also in css file
var secondaryColor = "#5c7300";
var startingFullScreen = false;
var fullScreenRowNumber = 2;


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
	locales.newTweets = "new Tweets";
	locales.yellow = "YELLOW";
	locales.openTweets = "Open Tweets";
	locales.closeTweets = "Close Tweets";

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
			locales.newTweets = "nuovi Tweets";
			locales.yellow = "GIALLO";
			locales.openTweets = "Apri i Tweets";
			locales.closeTweets = "Chiudi i Tweets";
	}
} catch (e) {
	TVB.exception(e, 'resources.js');
}
/* END OF CONFIGURATION AREA - DO NOT EDIT ANYTHING THAT FOLLOWS */


var isFullScreen = startingFullScreen;
var onOffTimeout;
var reducedView;
var URI;
var channelTripletDecoded = null;

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
			isTitleEditable = true;
		}
		
		if(document.body.offsetWidth < "700") {
			reducedView = true;
			reduce();
		} else {
			reducedView = false;
		}
		
		if (isTitleEditable) {
			document.title = applicationTitle;
		}
		
		// Remove temporary loading
		TVB.system.deleteElementById('loadingForTheFirstTime');
		
		// Draw title
		TVB.widget.titleBar.setTitle(applicationTitle);
		if(icon !== null)
			TVB.widget.titleBar.setIcon(icon);
		TVB.widget.titleBar.setBackgroundColor(primaryColor);
		TVB.widget.titleBar.render();
		

		TVB.remoteInit();
		TVB.CustomEvent.subscribeEvent(TVB.remote.button.RED, redHandler);
		
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
		if(reducedView){
			fullScreenMessageContainer.style.bottom = "165px";
			fullScreenMessageContainer.style.width = "575px";
		}else{
			fullScreenMessageContainer.style.bottom = "465px";
			fullScreenMessageContainer.style.width = "595px";
		}
		
		document.body.appendChild(fullScreenMessageContainer);
		
		var openMessageDiv = document.createElement('div');
		openMessageDiv.id = 'openMessageDiv';
		openMessageDiv.style.backgroundColor = primaryColor;
		openMessageDiv.style.display = "none";
		openMessageDiv.innerHTML = locales.closeTweets + ": " + locales.yellow;
		document.body.appendChild(openMessageDiv);

		if (dttChannelName !== null)
		{
			var channels = TVB.tuner.getDvbChannelsList();
			
			for (var i = 0; i < channels.length; i++) {
				if (channels[i].name == dttChannelName) 
				{
					channelTripletDecoded = channels[i].uri;
					break;
				}
			}
		}
		
		var gd = document.createElement('div');
		gd.id = 'gd';
		gd.style.top = '120px';
		gd.style.left = '40px';
		gd.style.width = '283px';
		gd.style.height = '286px';
		gd.style.position = 'fixed';
		gd.style.backgroundColor = primaryColor;
		document.body.appendChild(gd);
		
		var td = document.createElement('div');
		td.id = 'td';
		td.className = 'tweet';
		td.innerHTML = locales.getFromTwitter;
		td.style.backgroundColor = primaryColor;
		container.appendChild(td);
		
		if (channelTripletDecoded !== null)
		{
			URI = channelTripletDecoded;
		}
		else if (streamName !== null)
		{
			URI = streamName;
		}
			
		var playerConfig = {
			top: 120,// 120
			left: 40, // 40
			width: 283,
			height: 286,
			switchKey: null,
			uri: URI,//channelTripletDecoded,
			autoplay: true,
			fullscreen: startingFullScreen,
			noLittleHole: false
		};
		
		setTimeout(function() {
			//TVB.log("Starting playback");
			TVB.player.init(playerConfig);
			TVB.CustomEvent.unsubscribeEvent(TVB.player.events.end_of_streaming);
			TVB.CustomEvent.subscribeEvent(TVB.player.events.end_of_streaming, eos);	
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.STOP);
	        TVB.CustomEvent.subscribeEvent(TVB.remote.button.STOP, function(){
	        	if(isFullScreen){
	        		isFullScreen = false;
	        		TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
	    			document.getElementById("fs_msg_container").style.display = "none";
	    			document.getElementById("openMessageDiv").style.display = "none";
	    			halfScroller.enter();
	    		}
	        	TVB.player.stop();
	        });
			document.body.style.overflow = 'auto';
		}, 500);
		
		
		var nextShow = document.createElement('div');
		nextShow.id = 'next_show';
		nextShow.style.color = secondaryColor;
		nextShow.innerHTML = locales.useRed; 
		document.body.appendChild(nextShow);

		setTimeout(function() {
			container.removeChild(document.getElementById('td'));
			updateTwitter();
		}, 1000);
		
		setInterval(function() {
			updateTwitter();
		}, updateInterval);


	} catch (e) {
		TVB.exception(e, 'init()');
	}
};

function reduce(){
	try{
		halfScreenMenu.rowWidthPx = 300;
		//halfScreenMenu.rowHeightPx = 120;
		halfScreenMenu.visible = 5;
		tweetMenu.rowWidthPx = 554;
	}catch(e){
		TVB.log(e);
	}
};

var redHandler = function() {
	try {
		TVB.player.switchFullScreen();
		isFullScreen = !isFullScreen;
		
		if(isFullScreen){
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
			TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.open);
			document.getElementById("openMessageDiv").innerHTML = locales.openTweets + ": " + locales.yellow;
			document.getElementById("fs_msg_container").style.display = "none";
			document.getElementById("openMessageDiv").style.display = "";
			clearTimeout(onOffTimeout);
			onOffTimeout = setTimeout(function(){
				document.getElementById("openMessageDiv").style.display = "none";
			},4000);
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

function eos(){
	if(isFullScreen){
		isFullScreen = !isFullScreen;
		TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
		TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.open);
		document.getElementById("openMessageDiv").innerHTML = locales.openTweets + ": " + locales.yellow;
		document.getElementById("fs_msg_container").style.display = "none";
		document.getElementById("openMessageDiv").style.display = "";
		clearTimeout(onOffTimeout);
		onOffTimeout = setTimeout(function(){
			document.getElementById("openMessageDiv").style.display = "none";
		},4000);
		scroller.enter();
		
	}
}


var tweets = [];
var last_tweet = null;
var updatingTwitter = false;
var scroller;
var halfScroller;

var updateTwitter = function(){
	try {
		if (updatingTwitter === true) {
			//TVB.log("TwitTiVi: updating twitter in progress");
			return false;
		}
		//TVB.log("TwitTiVi: start updating twitter");
		//var url = "http://search.twitter.com/search.json?q=" + encodeURIComponent(hashtag);
		
		var url = "q=" + encodeURIComponent(hashtag);
		
		if (last_tweet !== null) {
			url += "&since_id=" + last_tweet;
		} else {
			url += "&rpp=" + startingTweets;
		}
		$.ajax({
		  url: "http://search.twitter.com/search.json?" + url,
		  dataType: "jsonp",
		  jsonpCallback: "updateTwitterCBK"
		});
		 
		
	}catch(e){
		TVB.error(e);
	}
}

function updateTwitterCBK(received) {
	var newTweets = received.results;
	//TVB.log("New tweets: " + newTweets.length);
	var con = document.getElementById('container');		
	if (newTweets.length > 0) {
		for(var t in newTweets){
			newTweets[t].read = false;
		}
		
		tweets = newTweets.concat(tweets);
		if(tweets.length > maxTweets){
			tweets = tweets.slice(0,maxTweets);
		}
		
		last_tweet = newTweets[0].id;
		
		try{
			halfScroller = new TVB.scroller(halfScreenMenu);
			if(tweets.length < maxTweets)
				halfScroller.total = tweets.length;
			else
				halfScroller.total = maxTweets;

			halfScroller.draw();
			
		}catch(e){
			TVB.log(e);
		}
		
		try{
			scroller = new TVB.scroller(tweetMenu);
			if(tweets.length < maxTweets)
				scroller.total = tweets.length;
			else
				scroller.total = maxTweets;

			scroller.draw();
			
		}catch(e){
			TVB.log(e);
		}
		
		if(!isFullScreen){
			document.getElementById("fs_msg_container").style.display = "none";
			document.getElementById("openMessageDiv").style.display = "none";
			halfScroller.enter();
		}
		
		if(isFullScreen){
			TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.close);
			newTweet(newTweets.length);
			scroller.enter();
			
		}
	}
}

var updateTwitter2 = function() {
	try {
		if (updatingTwitter === true) {
			//TVB.log("TwitTiVi: updating twitter in progress");
			return false;
		}
		//TVB.log("TwitTiVi: start updating twitter");
		//var url = "http://search.twitter.com/search.json?q=" + encodeURIComponent(hashtag);
		
		var url = "search.php?q=" + encodeURIComponent(hashtag);
		
		if (last_tweet !== null) {
			url += "&since_id=" + last_tweet;
		} else {
			url += "&rpp=" + startingTweets;
		}
		
		TVB.log("TwitTiVi: loading " + url);
		url = "http://search.twitter.com/search.json?q=worldcup&rpp=10";
		var req = new HTTPRelay();
		var res = req.get(url);
		TVB.log(res);
		var received = TVB.json.parse(res);
		newTweets = received.results;
		//TVB.log(newTweets);
		delete received;
		
		//TVB.log("New tweets: " + newTweets.length);
		var con = document.getElementById('container');		
		if (newTweets.length > 0) {
			for(var t in newTweets){
				newTweets[t].read = false;
			}
			
			tweets = newTweets.concat(tweets);
			if(tweets.length > maxTweets){
				tweets = tweets.slice(0,maxTweets);
			}
			
			last_tweet = newTweets[0].id;
			
			try{
				halfScroller = new TVB.scroller(halfScreenMenu);
				if(tweets.length < maxTweets)
					halfScroller.total = tweets.length;
				else
					halfScroller.total = maxTweets;
	
				halfScroller.draw();
				
			}catch(e){
				TVB.log(e);
			}
			
			try{
				scroller = new TVB.scroller(tweetMenu);
				if(tweets.length < maxTweets)
					scroller.total = tweets.length;
				else
					scroller.total = maxTweets;
	
				scroller.draw();
				
			}catch(e){
				TVB.log(e);
			}
			
			if(!isFullScreen){
				document.getElementById("fs_msg_container").style.display = "none";
				document.getElementById("openMessageDiv").style.display = "none";
				halfScroller.enter();
			}
			
			if(isFullScreen){
				TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.close);
				newTweet(newTweets.length);
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
			td.style.backgroundColor = primaryColor;
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


function newTweet(num){
	clearTimeout(onOffTimeout);
	document.getElementById("openMessageDiv").style.backgroundColor = secondaryColor;
	if(fsTweets.isOpen){
		document.getElementById("openMessageDiv").innerHTML = num + " " + locales.newTweets + " !";
		onOffTimeout = setTimeout(function(){
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
			TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.close);
			document.getElementById("openMessageDiv").style.backgroundColor = primaryColor;
			document.getElementById("openMessageDiv").innerHTML = locales.closeTweets + ": " + locales.yellow;
		},6000);
	}else{
		TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
		TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.open);
		document.getElementById("openMessageDiv").innerHTML = num + " " + locales.newTweets + " !"  + locales.yellow;
		onOffTimeout = setTimeout(function(){
			document.getElementById("openMessageDiv").style.backgroundColor = primaryColor;
			document.getElementById("openMessageDiv").style.display = "none";
		},6000);
	}
	document.getElementById("openMessageDiv").style.display = "";
	
	
}

var fsTweets = {
		isOpen: false,
		
		open : function(){
			clearTimeout(onOffTimeout);
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
			TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.close);
			document.getElementById("fs_msg_container").style.display = "";
			document.getElementById("openMessageDiv").innerHTML = locales.closeTweets + ": " + locales.yellow;
			document.getElementById("openMessageDiv").style.display = "";
			scroller.setCurrentLine(0);
			fsTweets.isOpen = true;
		},
		
		close: function(){
			TVB.log("close");
			fsTweets.isOpen = false;
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.YELLOW);
			TVB.CustomEvent.subscribeEvent(TVB.remote.button.YELLOW, fsTweets.open);
			document.getElementById("fs_msg_container").style.display = "none";
			document.getElementById("openMessageDiv").innerHTML = locales.openTweets + ": " + locales.yellow;
			document.getElementById("openMessageDiv").style.display = "";
			clearTimeout(onOffTimeout);
			onOffTimeout = setTimeout(function(){
				document.getElementById("openMessageDiv").style.display = "none";
			},4000);
		}
}

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



var tweetMenu = {
		cid : "fs_msg_container",
		name : "fullScreen",
		visible: fullScreenRowNumber,
		total:16,
		scrollerColor: primaryColor,
		barColor: secondaryColor,
		rowSelectedColor:secondaryColor,
		rowUnselectedColor:primaryColor,
		rowWidthPx:576,
		rowHeightPx:75,
		rowBorderPx: 2,

		drawLineCB: function(line){
			try{
				var html = "";
				if(tweets[line] != null && tweets[line] != undefined){
					html = "<div id='over_tweet_" + line + "' class='tweet' style=''>";
					if (tweets[line].from_user != 'SKAgnozzo') {
						html += "<img align=left src='" + tweets[line].profile_image_url + "' width='48px' height='48px'/>";
					} else {
						//TVB.log(newTweets[tweet]);
					}
					html += "<span class='from'>" + tweets[line].from_user + ": </span><span class='text'>" + tweets[line].text + "</span></div>";
				
				}
				return html;
			}catch(e){
				TVB.error(e);
				var html = "<div id='over_tweet_" + line + "' class='tweet' style=''>";
				html += "<img align=left src='' width='48px' height='48px'/>";
				html += "<span class='from'>Anonymous: </span><span class='text'> --- </span></div>";
			
				
				return html;
			}
		},

		navLeftCB: function(){

		},

		navRightCB: function(line){

		},

		selectLineCB: function(line){
			TVB.log("Selected line: " + line);
		},
		
		focusLineCB: function(line){
			try{
				
				if(!tweets[line].read){
					tweets[line].read = true;
					document.getElementById("fullScreen_row_" + line).style.border = "2px solid " + primaryColor;
					document.getElementById("halfScreen_row_" + line).style.border = "2px solid " + primaryColor;
					
				}
			}catch(e){
				TVB.error(e);
			}
		}
}

var halfScreenMenu = {
		cid : "container",
		name : "halfScreen",
		visible: 5,
		total:16,
		scrollerColor: primaryColor,
		barColor: secondaryColor,
		rowSelectedColor:secondaryColor,
		rowUnselectedColor:primaryColor,
		rowWidthPx:580,
		rowHeightPx:75,
		rowBorderPx: 2,

		drawLineCB: function(line){
			try{
				var html = "";
				if(tweets[line] != null && tweets[line] != undefined){
					if(reducedView)
						html = "<div id='tweet_" + line + "' class='tweet' style=''>";
					else
						html = "<div id='tweet_" + line + "' class='tweet' style=''>";
					
					if (tweets[line].from_user != 'SKAgnozzo') {
						html += "<img align=left src='" + tweets[line].profile_image_url + "' width='48px' height='48px'/>";
					} else {
						//TVB.log(newTweets[tweet]);
					}
					html += "<span class='from'>" + tweets[line].from_user + ": </span><span class='text'>" + tweets[line].text + "</span>";
					html += "<span class='pubdate'>" + prettyDate(tweets[line].created_at) + "</span></div>";
				}
				return html;
			}catch(e){
				TVB.error(e);
				var html = "<div id='over_tweet_" + line + "' class='tweet' style=''>";
				html += "<img align=left src='' width='48px' height='48px'/>";
				html += "<span class='from'>Anonymous: </span><span class='text'> --- </span></div>";
			
				
				return html;
			}
		},

		navLeftCB: function(){

		},

		navRightCB: function(line){

		},

		selectLineCB: function(line){
			TVB.log("Selected line: " + line);
		},
		
		focusLineCB: function(line){
			try{
				
				if(!tweets[line].read){
					tweets[line].read = true;
					document.getElementById("fullScreen_row_" + line).style.border = "2px solid " + primaryColor;
					document.getElementById("halfScreen_row_" + line).style.border = "2px solid " + primaryColor;
				}
			}catch(e){
				TVB.error(e);
			}
		}
}

try {
	init();
} catch (e) {
	TVB.error(e);
}


