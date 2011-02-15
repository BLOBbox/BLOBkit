/**
 * Ad Server Client
 * @module ad
 * @namespace TVB
 * @title Ad Server Client
 * @requires tvblob, system, remote, player, event
 * @author Francesco Facconi francesco.facconi@tvblob.com
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * Object for handling TVBLOB ad server
 * @class ad
 * @classDescription TVBLOB Ad Server
 * @static
 */
TVB.ad = {};

/**
 * Object for handling TVBLOB ad server low level
 * @method events
 * @private
 */
TVB.ad.events = {};

/**
 * Object for handling TVBLOB ad server configuration
 * @method config
 * @private
 */
TVB.ad.config = {
	/**
	 * @config autoplay
	 * @type Boolean
	 * @default false
	 */
	autoplay: false,
	admessage: undefined,
	mediauri: undefined,
	oMetadata: undefined,
	server_uri: 'http://www.blobforge.com/static/lib/resources/neodata.php',
	timeline: null,
	adPre: false,
	adPost: false,
	timeoutArray: [],
	uistatetype: {
		'BEFORE':0,
		'DURING':1,
		'AFTER':2
	},
	uistate: undefined
};

/**
 * Initialize the connection with your application and the AD server
 * @method init
 * @param	{Object}	config	See manual for configuration options
 * @exception {InitError}
 */
TVB.ad.init = function(config) {
	try {
		TVB.log('Ad client: init()');

		TVB.ad.config.uistate = TVB.ad.config.uistatetype.BEFORE;

		TVB.ad.config.admessage = TVB.ad.prepareMessage();
		TVB.ad.config.uistate = TVB.ad.config.uistatetype.BEFORE;

		TVB.ad.events.end_playlist = TVB.CustomEvent.createEvent('end_playlist');
		TVB.ad.events.start_ad_before = TVB.CustomEvent.createEvent('start_ad_before');
		TVB.ad.events.end_ad_before = TVB.CustomEvent.createEvent('end_ad_before');
		TVB.ad.events.start_ad_after = TVB.CustomEvent.createEvent('start_ad_after');
		TVB.ad.events.end_ad_after = TVB.CustomEvent.createEvent('end_ad_after');
		TVB.ad.events.start_media = TVB.CustomEvent.createEvent('start_media');
		TVB.ad.events.end_media = TVB.CustomEvent.createEvent('end_media');

		TVB.ad.config.server_uri = 'http://www.blobforge.com/static/lib/resources/neodata.php';

		if (typeof config.autoplay !== undefined && config.autoplay === true) {
			TVB.ad.config.autoplay = true;
		} else {
			TVB.ad.config.autoplay = false;
		}
	} catch (e) {
		TVB.warning("Ad client: init : " + e.message);
		throw InitError;
	}
};

/**
 * Prepare the message to be sent to the AD server
 * @method prepareMessage
 * @private
 */
TVB.ad.prepareMessage = function() {
	try {
		TVB.log("Ad client: prepareMessage()");
		TVB.podcast.init();
		var ext = TVB.podcast.feedExist('36');

		var feeds = TVB.podcast.getFeedContentByID('36');

		var ads = [];
		for (i in feeds) {
			ads.push(feeds[i].ID);
		}

		var msg = {
			'user': {},
			'show': {
				'type': 0,
				'metadata':{
					'media_id': '0',
					'channel_id':0,
					'timestamp': 0,
					'duration': 0,
					'publisher_id':1,
					'tags':[],
					'dvbresources': {
							'network_id':0,
							'transport_stream_id':0,
							'service_id':0
						}


				},
				'ads': ads
			}
		};

		return msg;
	} catch (e) {
		TVB.warning("Ad client: prepareMessage: " + e.message);
		throw e;
	}
};

/**
 * Ask the timeline to the AD server
 * @method askTimeline
 * @private
 * @param {Object} metadata
 */
TVB.ad.askTimeline = function(metadata) {
	try {
		TVB.log("Ad client: askTimeline()");

		var msg = TVB.ad.config.admessage;
		msg.show.metadata = metadata;
		msg.show.metadata.media_id = '' + msg.show.metadata.media_id;
		var reqUri = TVB.ad.config.server_uri + '?action=sendRequest&params=' + TVB.json.stringify(msg);

		var res = TVB.Connection.syncRequest('GET', reqUri, null);
		TVB.ad.config.timeline = TVB.json.parse(res);
		return TVB.ad.config.timeline;
	} catch (e) {
		TVB.warning("Ad client: askTimeline: " + e.message);
		throw e;
	}
};

/**
 * Set content uri and metadata for the AD server and lauches ads and playback
 * @method setContent
 * @param {String} uri	Uri of the content
 * @param {Object} metadata Metadata to send to the ad server
 * @return {Boolean}
 */
TVB.ad.setContent = function(uri, metadata) {
	try {
		TVB.log("Ad client: setContent(" + uri + ")");

		if (TVB.ad.config.uistate != TVB.ad.config.uistatetype.BEFORE) {
			TVB.log("Ad client: setContent: wrong state " + TVB.ad.config.uistate);
			return;
		}

		TVB.player.setContent(uri);

		TVB.ad.config.mediauri = uri;
		TVB.ad.config.oMetadata = metadata;

		var timeline = TVB.ad.askTimeline(metadata);

		TVB.ad.config.adPre = false;
		TVB.ad.config.adPost = false;

		var preload = [];

		for (var i in timeline) {
			if (i == -1) {
				TVB.ad.config.adPre = true;
			} else if (i == -2) {
				TVB.ad.config.adPost = true;
			} else {
				if (timeline[i].action_type > 1 && timeline[i].action_type < 4) {
					preload[i] = new Image();
					preload[i].src = timeline[i].ad_url;
					TVB.log("Faucet: preloaded " + timeline[i].ad_url);
				}
			}
		}

		TVB.CustomEvent.subscribeEvent(TVB.player.events.starting_playback,
			function() {
				try {
					TVB.log("Ad client: events_starting_playback");
					if (TVB.ad.config.adPre === true) {
						TVB.CustomEvent.fireEvent(TVB.ad.events.start_ad_before, {});
					} else {
						TVB.CustomEvent.fireEvent(TVB.ad.events.start_media, {});
					}
				} catch (e) {
					TVB.warning("Ad client: events_starting_playback: " + e.message);
					throw e;
				}
			});

		TVB.CustomEvent.subscribeEvent(TVB.ad.events.start_media,
			function() {
				try {
					TVB.log("Ad client: events_start_media");
					TVB.ad.config.uistate = TVB.ad.config.uistatetype.DURING;
					TVB.ad.showVideo();
				} catch (e) {
					TVB.warning("Ad client: events_start_media: " + e.message);
					throw e;
				}
			});

		TVB.CustomEvent.subscribeEvent(TVB.ad.events.start_ad_before,
			function() {
				try {
					TVB.log("Ad client: events_start_ad_before");
					TVB.ad.config.uistate = TVB.ad.config.uistatetype.BEFORE;
					TVB.ad.showAdBefore();
				} catch (e) {
					TVB.warning("Ad client: events_start_ad_before: " + e.message);
					throw e;
				}
			});

		TVB.CustomEvent.subscribeEvent(TVB.ad.events.start_ad_after,
			function() {
				try {
					TVB.log("Ad client: events_start_ad_after");
					TVB.ad.config.uistate = TVB.ad.config.uistatetype.AFTER;
					TVB.ad.showAdAfter();
				} catch (e) {
					TVB.warning("Ad client: events_start_ad_after: " + e.message);
					throw e;
				}
			});

		if (TVB.ad.config.autoplay === true) {
			TVB.player.play();
		}

		return true;
	} catch (e) {
		TVB.error("Ad client: setContent: " + e.message);
		throw e;
	}
};

/**
 * Show the label "promotional message"
 * @method showMessage
 * @private
 */
TVB.ad.showMessage = function() {
	try {
		TVB.log("Ad client: showMessage()");
		var div = document.createElement('div');
		div.id = 'messaggiopromozionale';
		div.style.background = '#00f url("http://www.blobforge.com/static/lib/resources/messprom.png") no-repeat';
		div.style.zIndex = '35000';
		div.style.border = '0';
		div.style.bottom = '0px';
		div.style.left = '0px';
		div.style.position = 'absolute';
		div.style.display = 'block';
		div.style.width = '374px';
		div.style.height = '50px';
		div.style.margin = '0';
		div.style.padding = '0';
		document.body.appendChild(div);
	} catch (e) {
		TVB.error("Ad client: showMessage: " + e.message);
		throw e;
	}
};

/**
 * Remove the label "promotional message"
 * @method removeMessage
 * @private
 */
TVB.ad.removeMessage = function() {
	try {
		TVB.log("Ad client: removeMessage()");
		if (document.getElementById('messaggiopromozionale') !== undefined) {
			document.body.removeChild(document.getElementById('messaggiopromozionale'));
		}
	} catch (e) {
		TVB.warning("Ad client: removeMessage: " + e.message);
	}
};

/**
 * Shows an embedded creativity
 * @method showEmbedded
 * @private
 */
TVB.ad.showEmbedded = function(opt, ts) {
	try {
		TVB.log("Ad client: showEmbedded()");

		var url = opt.url;
		var width = opt.width;
		var height = opt.height;
		var topCoord = opt.topCoord;
		var leftCoord = opt.leftCoord;
		var duration = opt.duration;
		if (duration < 1 || duration === undefined) {
			duration = 8000;
		}
		var ad_id = opt.ad_id;
		var action_id = opt.action_id;
		var action_type = opt.action_type;

		var tostart;
		var toend;

		tostart = setTimeout(function() {
			TVB.player.config.leftCord = parseInt(leftCoord - 5, 10);
			TVB.player.config.topCord = parseInt(topCoord - 5, 10);
			TVB.player.exitFullScreen();
			var div = document.createElement('div');
			div.id = 'banner';
			div.style.background = '#000 url("' + url + '") no-repeat';
			div.style.zIndex = '32000';
			div.style.border = '0';
			div.style.top = 0; //topCoord + 'px';
			div.style.left = 0; //leftCoord + 'px';
			div.style.position = 'absolute';
			div.style.display = 'block';
			div.style.width = '670px';
			div.style.height = '548px';
			div.style.margin = '0';
			div.style.padding = '0';

			TVB.log("Ad client: showing banner id = " + div.id);
			//TVB.ad.sendConfirmation(ad_id, action_id, ad_action_type, 0);
			document.body.appendChild(div);
		}, ts);

		toend = setTimeout(function(){
			TVB.player.enterFullScreen();
			document.body.removeChild(document.getElementById('banner'));
		}, parseInt(duration + ts, 10));

		TVB.ad.config.timeoutArray.push(tostart);
		TVB.ad.config.timeoutArray.push(toend);
	} catch (e) {
		TVB.error("Ad client: showEmbedded: " + e.message);
		throw e;
	}
};

/**
 * Shows a banner over the current video player
 * @method showBanner
 * @private
 */
TVB.ad.showBanner = function(opt,ts) {
	try {
		TVB.log("Ad client: showBanner()");
		var url = opt.url;
		var width = opt.width;
		var height = opt.height;
		var topCoord = opt.topCoord;
		var leftCoord = opt.leftCoord;
		var duration = opt.duration;
		if (duration < 1 || duration === undefined) {
			duration = 8000;
		}
		var ad_id = opt.ad_id;
		var action_id = opt.action_id;
		var action_type = opt.action_type;

		var tostart;
		var toend;

		tostart = setTimeout(function()
				{
					var div = document.createElement('div');
					div.id = 'banner';
					div.style.background = '#000 url("'+url+'") no-repeat';
					div.style.zIndex = '31000';
					div.style.border = '0';
					div.style.top = topCoord + 'px';
					div.style.left = leftCoord + 'px';
					div.style.position = 'absolute';
					div.style.display = 'block';
					div.style.width = width + 'px';
					div.style.height = height + 'px';
					div.style.margin = '0';
					div.style.padding = '0';

					TVB.ad.sendConfirmation(ad_id, action_id, 0, 0);
					document.body.appendChild(div);
				},ts);

		toend = setTimeout(function()
			{
				document.body.removeChild(document.getElementById('banner'));
			}, parseInt(duration + ts, 10));

		TVB.ad.config.timeoutArray.push(tostart);
		TVB.ad.config.timeoutArray.push(toend);
	} catch (e) {
		TVB.error("Ad client: showBanner: " + e.message);
		throw e;
	}
};

/**
 * Shows the ads BEFORE the video
 * @method showAdBefore
 * @private
 */
TVB.ad.showAdBefore = function() {
	try {
		TVB.log("Ad client: showAdBefore()");

		if (TVB.ad.config.uistate != TVB.ad.config.uistatetype.BEFORE) {
			TVB.log("Ad client: showAdBefore: wrong state " + TVB.ad.config.uistate);
			return;
		}

		var timeline = TVB.ad.config.timeline;

		if (timeline[-1] === undefined) {
			TVB.CustomEvent.fireEvent(TVB.ad.events.end_ad_before, {});
			TVB.CustomEvent.unsubscribeEvent(TVB.player.events.end_of_streaming);
			TVB.player.enableRemote();
			TVB.CustomEvent.fireEvent(TVB.ad.events.start_media, {});
			return;
		}

		var items = null;
		if (timeline[-1].media_items !== undefined) {
			items = timeline['-1'].media_items;
		}
		else {
			items = timeline['-1'];
		}

		var feedid = '36';

		var contentid = null;
		if (items.media_item_id !== undefined) {
			contentid = items.media_item_id;
		}
		else {
			contentid = items[0].media_item_id;
		}

		var uri = TVB.podcast.getUriByID(feedid, contentid);

		TVB.CustomEvent.unsubscribeEvent(TVB.player.events.starting_playback);

		TVB.player.setContent(uri);

		TVB.ad.showMessage();

		TVB.player.disableRemote();
		TVB.player.play();

		TVB.CustomEvent.subscribeEvent(TVB.player.events.end_of_streaming, function(){
			try {
				TVB.log("AD client: events_end_of_streaming");
				setTimeout(function(){
					TVB.CustomEvent.fireEvent(TVB.ad.events.end_ad_before, {});
					TVB.CustomEvent.unsubscribeEvent(TVB.player.events.end_of_streaming);
					TVB.player.enableRemote();
					TVB.ad.removeMessage();
					TVB.CustomEvent.fireEvent(TVB.ad.events.start_media, {});
				}, 200);
			}
			catch (e) {
				TVB.error("Ad client: events_end_of_streaming: " + e.message);
			}
		});

		//TVB.ad.sendConfirmation(timeline[-1].ad_id, action_id, ad_action_type, result);
	} catch (e) {
		TVB.error("Ad client: showAdBefore: " + e.message);
		throw e;
	}
};


/**
 * Shows current video
 * @method showVideo
 * @private
 */
TVB.ad.showVideo = function() {
	try {
		TVB.log("Ad client: showVideo()");

		if (TVB.ad.config.uistate != TVB.ad.config.uistatetype.DURING) {
			TVB.log("Ad client: showVideo: wrong state " + TVB.ad.config.uistate);
			return;
		}

		TVB.player.enableRemote();
		TVB.ad.config.uistate = TVB.ad.config.uistatetype.DURING;

		TVB.CustomEvent.unsubscribeEvent(TVB.player.events.starting_playback);

		TVB.CustomEvent.subscribeEvent(TVB.player.events.starting_playback, function() {
			if (TVB.ad.config.uistate != TVB.ad.config.uistatetype.DURING) {
				return;
			}

			var milliStart = null;
			var opt = null;
			var tl = TVB.ad.config.timeline;
			for (var i in tl) {
				if (i >= 0) {
					switch (tl[i].action_type) {
						case 1:
							TVB.log(tl[i]);

							TVB.ad.sendConfirmation(tl[i].ad_id, tl[i].action_id, 0, 2);
							for (var j in tl[i].media_items) {
								TVB.ad.sendConfirmation(tl[i].media_items[j].ad_id, tl[i].action_id, 0, 2);
							}
							break;
						case 2:
							opt = {
								'url':tl[i].ad_url,
								'width':tl[i].width,
								'height':tl[i].height,
								'topCoord':tl[i].top,
								'leftCoord':tl[i].left,
								'duration': (tl[i].duration * 1000),
								'ad_id': tl[i].ad_id,
								'action_id': tl[i].action_id,
								'action_type': 0
								};
							milliStart = i * 1000;
							TVB.ad.showBanner(opt, milliStart);
							break;
						case 3:
							opt = {
								'url':tl[i].ad_url,
								'width':tl[i].width,
								'height':tl[i].height,
								'topCoord':tl[i].top,
								'leftCoord':tl[i].left,
								'duration': (tl[i].duration * 1000),
								'ad_id': tl[i].ad_id,
								'action_id': tl[i].action_id,
								'action_type': 0
								};
							milliStart = i * 1000;
							TVB.ad.showEmbedded(opt, milliStart);
							break;
						default:
							TVB.ad.sendConfirmation(tl[i].ad_id, tl[i].action_id, 0, 9);
					}
				}
			}

		});

		var stopFunction = function() {
			TVB.ad.config.uistate = TVB.ad.config.uistatetype.BEFORE;

			TVB.CustomEvent.fireEvent(TVB.ad.events.end_playlist, {});
			TVB.CustomEvent.subscribeEvent(TVB.player.events.starting_playback,
					function()
					{
						TVB.CustomEvent.fireEvent(TVB.ad.events.start_ad_before, {});
					});


			for (i in TVB.ad.config.timeoutArray)
			{
				TVB.log('Ad client: Deactivating banner ' + i);
				clearTimeout(TVB.ad.config.timeoutArray[i]);
			}

			TVB.ad.config.timeoutArray = [];
		};

		TVB.CustomEvent.subscribeEvent(TVB.remote.button.STOP, stopFunction);
		TVB.CustomEvent.subscribeEvent(TVB.remote.button.BACK, stopFunction);

		TVB.log("Ad client: showVideo: mediauri = " + TVB.ad.config.mediauri);
		TVB.player.setContent(TVB.ad.config.mediauri);

		TVB.player.play();

		TVB.CustomEvent.subscribeEvent(TVB.player.events.end_of_streaming,function() {
			TVB.CustomEvent.fireEvent(TVB.ad.events.end_media, {});
			TVB.CustomEvent.unsubscribeEvent(TVB.player.events.end_of_streaming);
			TVB.CustomEvent.fireEvent(TVB.ad.events.start_ad_after, {});
		});
	} catch (e) {
		TVB.error("Ad client: showVideo: " + e.message);
		throw e;
	}
};

/**
 * Shows the ad AFTER the actual movie
 * @method showAdAfter
 * @private
 */
TVB.ad.showAdAfter = function() {
	try {
		TVB.log("Ad client: showAdAfter()");

		if (TVB.ad.config.uistate != TVB.ad.config.uistatetype.AFTER)
		{
			TVB.log("Ad client: showAdAfter: wrong state " + TVB.ad.config.uistate);
			return;
		}

		var timeline = TVB.ad.config.timeline;
		if (timeline[-2] === undefined) {
			TVB.CustomEvent.fireEvent(TVB.ad.events.end_playlist, {});
			return;
		}
		if (timeline[-2].action_type != 1) {
			TVB.ad.sendConfirmation(timeline[-2].ad_id, timeline[-2].action_id, 0, 2);
			for (var j in timeline[-2].media_items) {
				TVB.ad.sendConfirmation(timeline[-2].media_items[j].ad_id, timeline[-2].action_id, 0, 2);
			}
			TVB.CustomEvent.fireEvent(TVB.ad.events.end_playlist, {});
			return;
		}

		var items = timeline['-2'].media_items;
		//TVB.log("Ad client: showAdAfter: items = " + TVB.dump(items));

		var feedid = '36';
		var contentid = null;
		if (items.media_item_id !== undefined) {
			contentid = items.media_item_id;
		} else {
			contentid = items[0].media_item_id;
		}

		var uri = TVB.podcast.getUriByID(feedid,contentid);
		TVB.CustomEvent.unsubscribeEvent(TVB.player.events.starting_playback);

		TVB.player.disableRemote();
		TVB.player.config.autoplay = false;
		TVB.player.config.isPlaying = false;
		TVB.player.setContent(uri);
		TVB.player.config.autoplay = TVB.ad.config.autoplay;

		TVB.ad.showMessage();

		setTimeout(function() {
			TVB.player.play();
		}, 700);

		TVB.CustomEvent.subscribeEvent(TVB.player.events.end_of_streaming,function()
				{
					TVB.ad.removeMessage();
					TVB.CustomEvent.fireEvent(TVB.ad.events.end_ad_after, {});
					TVB.CustomEvent.fireEvent(TVB.ad.events.end_playlist, {});
					TVB.CustomEvent.unsubscribeEvent(TVB.player.events.end_of_streaming);
					TVB.player.enableRemote();
				});
	} catch (e) {
		TVB.error("Ad client: showAdAfter: " + e.message);
		throw e;
	}
};

/**
 * Sends a confirmation message to the AD server
 * @method sendConfirmation
 * @private
 */
TVB.ad.sendConfirmation = function(ad_id, action_id, ad_action_type, result) {
	try {
		TVB.log("Ad client: sendConfirmation(" + ad_id + ", " + action_id + ", " + ad_action_type + ", " + result + ")");

		if (ad_id === undefined) {
			return;
		}

		var msg = {
			'ad_id': ad_id,
			'ad_action_info': {
				'action_id': '' + action_id + '',
				'ad_action_type': ad_action_type,
				'result': result
			}
		};

		var reqUri = TVB.ad.config.server_uri + '?action=sendConfirm&params=' + TVB.json.stringify(msg);

		var req = new $C.xmlhttp();
		req.callback = function(o)
		{
			TVB.log("Ad client: sendConfirmation: received from server: " + o.responseText);
		};
		req.request('GET', reqUri, null);

		return;
	} catch (e) {
		TVB.error("Ad client: sendConfirmation: " + e.message);
	}
};
