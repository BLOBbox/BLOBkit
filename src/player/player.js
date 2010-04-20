/**
 * <h1>Media Player for BLOBbox</h1>
 * 
 * <h2>configurationObject</h2>
 * <dl>
 * 		<dt>uri:</dt><dd>String, the uri to playback inside the player</dd>
 * 		<dt>top:</dt><dd>Integer, the top grid reference in which position the player when not in full screen mode</dd>
 * 		<dt>left:</dt><dd>Integer, the left grid reference in which position the player when not in full screen mode</dd>
 * 		<dt>fullscreen:</dt><dd>Boolean, if true the player automatically starts in fullscreen (default: false)</dd>
 * 		<dt>switchKey:</dt><dd>String, the name of the button (according with the remote control model) that automatically enter and exit the full screen mode; it works only if disableRemote is false, or if switchKey is not null (default: 'OK')</dd>
 * 		<dt>autoplay:</dt><dd>Boolean, if true the player automatically starts the playback as soon as it has been initialized (default: true)</dd>
 * 		<dt>noLittleHole:</dt><dd>Boolean, if true disable the player from automatically add the mask hole in front of the video; a blue screen mask with #0000ff color must be manually added in order to see the movie in the background (default: false)</dd>
 * 		<dt>disableRemote:</dt><dd>Boolean, if true prevent the player from listening to the remote control buttons and does not initialize the remote control with the event model (default: false)</dd>
 * 		<dt>width:</dt><dd>Integer, the width in pixels of the video player when not in full screen (default: half the width of the screen)</dd>
 * 		<dt>height:</dt><dd>Integer, the height in pixels of the video player when not in full screen (default: half the height of the screen)</dd>
 * </dl>
 * 
 * <h2>List of events</h2>
 * <dl>
 * 		<dt>TVB.player.events.player:</dt><dd></dd>
 * 		<dt>TVB.player.events.play:</dt><dd></dd>
 * 		<dt>TVB.player.events.stop:</dt><dd></dd>
 * 		<dt>TVB.player.events.pause:</dt><dd></dd>
 * 		<dt>TVB.player.events.buffering:</dt><dd></dd>
 * 		<dt>TVB.player.events.rewinding:</dt><dd></dd>
 * 		<dt>TVB.player.events.fast_forwarding:</dt><dd></dd>
 * 		<dt>TVB.player.events.end_of_streaming:</dt><dd></dd>
 * 		<dt>TVB.player.events.starting_playback:</dt><dd></dd>
 * </dl>
 *
 * <h2>Available uri schema</h2>
 * <p>Every schema supported by the BLOBbox is supported by the video player.</p>
 * <p>The following have been tested:</p>
 * <ul>
 *     <li>http://</li>
 *     <li>file:///mnt/storage/sm-core/media/RELATIVE_PATH (for content in the media archive)</li>
 *     <li>dvb://ONID.TSID.SID</li>
 *     <li>rtsp:// (only on hardware that supports rtsp)</li>
 * </ul>
 * 
 * @module player
 * @namespace TVB
 * @title Media Player
 * @requires tvblob, system, event, remote
 * @author Francesco Facconi francesco.facconi@tvblob.com
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * Object for handling TVBLOB video player
 * @class player
 * @static
 * @namespace TVB
 */
TVB.player = {};

/**
 * Default configuration for 
 * TVBLOB's media player
 * @method config
 * @private
 */
TVB.player.config = {
	isInit: false,
	isPlaying: false,
	isFullScreen: false,
	wasFullScreen: false,
	disableRemote: false,
	isStartPlay: true,
	autoplay: true,
	currentUri: null,
	littleHole: null,
	events: {},
	remote: null,
	keyForFullScreen: 'OK',
	scale: 'SIF',
	deltaX: 0,
	deltaY: 0,
	leftCord: 0,
	topCord: 0,
	isBuffering: false,
	autoFullScreen: false,
	noLittleHole: false,
	width: 0,
	height: 0,
	useSIF: true
};

/**
 * This object handles the low level api for
 * TVBLOB's media player
 * @method p
 * @private
 */
TVB.player.p = {};

/**
 * Initialize the video player
 * @method init
 * @param {Object} config configurationObject
 * @return {Boolean}
 */
TVB.player.init = function(config){
	try {
		TVB.log("Player: init(config)");
			
		if (TVB.player.config.isInit === false) {
			TVB.player.p = new BlobPlayer();
			
			TVB.player.config.isInit = true;
			TVB.player.config.isPlaying = false;
			TVB.player.config.isFullScreen = false;
			TVB.player.config.wasFullScreen = false;
			TVB.player.config.isBuffering = false;
			
			TVB.player.config.geometryAllowed = false;
			try {
				var temp_ver = TVB.system.getSMOJVersion();
				temp_ver = temp_ver.split('.'); 
				if (parseInt(temp_ver[0], 10) > 1) {
					TVB.player.config.geometryAllowed = true;
				} else if (parseInt(temp_ver[1], 10) > 49) {
					TVB.player.config.geometryAllowed = true;
				}
			} catch (e) {}
			TVB.log("Player: geometry allowed? " + TVB.player.config.geometryAllowed);
			
			var currentSMOJ = TVB.system.getSMOJVersion();
			var currentSMOJarr = currentSMOJ.split('.'); 
			if (currentSMOJarr[0] < 2 && currentSMOJarr[1] < 47) {
				TVB.player.config.deltaX = +25;
				TVB.player.config.deltaY = -8;
			} else {
				TVB.player.config.deltaX = 0; /* +63 */
				TVB.player.config.deltaY = 0;
			}
			
			TVB.player.p.setEventListener("TVB.player.events");

			if (typeof config.noLittleHole != 'undefined' && config.noLittleHole === true) {
				TVB.log("Player: little hole disabled");
				TVB.player.config.noLittleHole = true;
			} else {
				TVB.player.config.noLittleHole = false;
			}

			// configure remote
			if (typeof config.disableRemote != 'undefined' && config.disableRemote === true) {
				TVB.player.config.disableRemote = true;
			} else {
				TVB.player.config.disableRemote = false;
				TVB.remoteInit();
				TVB.CustomEvent.subscribeEvent(TVB.remote.buttons.VCR, TVB.player.handleRemote);
				TVB.CustomEvent.subscribeEvent(TVB.remote.button.BACK, TVB.player.handleRemote);
			}
			
			// configure auto switch full screen
			if (typeof config.switchKey != 'undefined') {
				TVB.player.config.keyForFullScreen = config.switchKey;
			}
			try {
				if (TVB.player.config.keyForFullScreen !== null) {
					TVB.CustomEvent.subscribeEvent(TVB.remote.button[TVB.player.config.keyForFullScreen], function(){
						try {
							TVB.player.switchFullScreen();
						} catch (e) {
							TVB.error("Player events: " + e.message);
						}
					});				
				}
			} catch (e) {
				TVB.player.config.keyForFullScreen = null;	
			}
			
			// configure events
			TVB.player.events.player = TVB.CustomEvent.createEvent('player');
			TVB.player.events.play = TVB.CustomEvent.createEvent('play');
			TVB.player.events.stop = TVB.CustomEvent.createEvent('stop');
			TVB.player.events.pause = TVB.CustomEvent.createEvent('pause');
			TVB.player.events.buffering = TVB.CustomEvent.createEvent('buffering');
			TVB.player.events.rewinding = TVB.CustomEvent.createEvent('rewinding');
			TVB.player.events.fast_forwarding = TVB.CustomEvent.createEvent('fast_forwarding');
			TVB.player.events.end_of_streaming = TVB.CustomEvent.createEvent('end_of_streaming');
			TVB.player.events.starting_playback = TVB.CustomEvent.createEvent('starting_playback');

			// configure uri
			if (typeof config.uri == 'string') {
				TVB.player.config.currentUri = config.uri;
			} else {
				TVB.player.config.currentUri = null;
			}

			// configure coords
			if (typeof config.top != 'undefined') {
				TVB.player.config.topCord = parseInt(config.top, 10);
			} else {
				TVB.player.config.topCord = parseInt((window.innerHeight / 2) - (window.innerHeight / 4), 10);
			}
			if (typeof config.left != 'undefined') {
				TVB.player.config.leftCord = parseInt(config.left, 10);
			} else {
				TVB.player.config.leftCord = parseInt((window.innerWidth / 2) - (window.innerWidth / 4), 10);
			}
			TVB.log("Player: init: new player in coords(" + TVB.player.config.leftCord + ", " + TVB.player.config.topCord + ")");
			
			// configure size
			TVB.player.config.useSIF = true;
			if (typeof config.width != 'undefined') {
				TVB.player.config.width = parseInt(config.width, 10);
				TVB.player.config.useSIF = false;
			} else {
				TVB.player.config.width = parseInt(window.innerWidth / 2, 10);
			}
			if (typeof config.height != 'undefined') {
				TVB.player.config.height = parseInt(config.height, 10);
				TVB.player.config.useSIF = false;
			} else {
				TVB.player.config.height = parseInt(window.innerHeight / 2, 10) + 18;
			}
			TVB.log("Player: init: new player with size (" + TVB.player.config.width + ", " + TVB.player.config.height + ")");
			
			// configure fullscreen
			if (typeof config.fullscreen != 'undefined' && config.fullscreen === true) {
				TVB.player.config.autoFullScreen = true; 
			} else {
				TVB.player.config.autoFullScreen = false;
			}
			TVB.log("Player: full screen mode configured to " + TVB.player.config.autoFullScreen);
			
			// configure autoplay
			if (typeof config.autoplay != 'undefined' && config.autoplay === false) {
				TVB.player.config.autoplay = false;
			} else {
				TVB.player.config.autoplay = true;
			}
			
			TVB.player.addHole(0,0);
			if (TVB.player.config.noLittleHole === false) {
				TVB.player.config.littleHole.style.visibility = 'hidden';
				TVB.player.config.littleHole.style.display = 'none';
			}
			
			if (TVB.player.config.autoplay === true) {
				TVB.player.play();
			}
			
			return true;
		} else {
			TVB.log("Player: already inited (warning)");
			return false;
		}
	} catch (e) {
		TVB.warning("Player: init: " + e.message);
		throw e;
	}
};

/**
 * This function handles the remote control for player class
 * @method handleRemote
 * @private
 * @param {String} type The area name of the remote control
 * @param {Object} args Array containing the pushed key name
 */
TVB.player.handleRemote = function(type, args) {
	try {
		TVB.log("Player: handleRemote() " + args[0].keyName);
		if (TVB.player.config.disableRemote === false) {
			switch (args[0].keyName) {
				case 'BACK':
					TVB.player.stop();
					TVB.CustomEvent.stopEvent(TVB.remote.button.BACK);
					break;
				case 'STOP':
					TVB.player.stop();
					TVB.CustomEvent.stopEvent(TVB.remote.button.STOP);
					break;
				case 'PLAY':
					TVB.player.play();
					break;
				case 'PAUSE':
					TVB.player.pause();
					break;
				case 'PLAY_PAUSE':
					TVB.log("Player: PLAY_PAUSE button catched");
					TVB.player.playpause();
					break;
				case 'REWIND':
					TVB.player.rewind();
					break;
				case 'FAST_FORWARD':
					TVB.player.fastforward();
					break;
				case 'SKIP_FORWARD':
					//TVB.player.skipforward();
					break;
				case 'SKIP_BACKWARD':
					//TVB.player.skipbackward();
					break;
				case 'RECORD':
					//TVB.player.record();
					break;
			}
		}
	} catch (e) {
		TVB.warning("Player: handleRemote: " + e.message);
	}
};

/**
 * Starts play of current content
 * @method play
 * @return {Boolean}
 */
TVB.player.play = function() {
	try {
		TVB.log("Player: play()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.currentUri === null) {
			TVB.warning("Player: play: please config a player uri before trying to play");
			return false;
		}
		
		try {
			TVB.player.config.isPlaying = true;
			if (TVB.player.p.getContent() != TVB.player.config.currentUri) {
				TVB.log("Player: setContent start");
				TVB.player.showStartingPlaybackMessage();
				TVB.player.p.setContent(TVB.player.config.currentUri);
				TVB.log("Player: setContent end");
			} else if (TVB.player.p.getStatus() == 'STOPPED') {
				TVB.log("Player: setContent start because STOPPED");
				TVB.player.showStartingPlaybackMessage();
				TVB.player.p.setContent(TVB.player.config.currentUri);
				TVB.log("Player: setContent end");
			}

		} catch (e) {
			TVB.error("Player: error setting content: " + e.message);
			TVB.player.removeBufferingMessage();
			TVB.player.showUnableToPlayMessage();
			setTimeout(function() {
				TVB.player.removeErrorMessage();
			}, 5000);
			TVB.player.stop();
			var params = {
				newState: 'STOP',
				previousState: 'STOP',
				source: 'ERROR',
				uri: TVB.player.config.currentUri
			};
			TVB.CustomEvent.fireEvent(TVB.player.events.stop, params);
			TVB.player.config.isPlaying = false;
			return false;
		}
		
		if (TVB.player.config.isStartPlay === true) {
			TVB.player.config.isStartPlay = false;
			TVB.CustomEvent.fireEvent(TVB.player.events.starting_playback, {});
			TVB.log("Player: Starting playback...");
		}
		if (TVB.player.config.wasFullScreen === true) {
			TVB.log("Player: entering full screen because TVB.player.config.wasFullScreen == true");
			TVB.player.enterFullScreen();
			TVB.player.config.wasFullScreen = false;
		} else {
			if (TVB.player.config.autoFullScreen === true) {
				TVB.log("Player: entering full screen because TVB.player.config.autoFullScreen == true");
				TVB.player.enterFullScreen();
			} else {
				TVB.player.exitFullScreen();
			}
		}
		try {
			if (TVB.player.config.noLittleHole === false) {
				TVB.player.config.littleHole.style.visibility = 'visible';
				TVB.player.config.littleHole.style.display = 'block';
			}
		} catch (e) {
			TVB.warning("Player: play: " + e.message);
		}
		/*
		TVB.log("Player: play: TVB.player.config.isFullScreen == " + TVB.player.config.isFullScreen);
		
		if (TVB.player.config.isFullScreen == true) {
			TVB.player.enterFullScreen();
		} else {
			TVB.player.exitFullScreen();
		}
		*/
		//setTimeout(function() {
		try {
			TVB.player.removeBufferingMessage();
			TVB.player.p.play();
			TVB.player.config.isPlaying = true;
		} catch (e) {
			TVB.warning("Player: play: " + e.message);
			TVB.player.config.isPlaying = false;
			throw e;
		}
		//}, 500);
		return true;
	} catch (e) {
		TVB.player.config.isPlaying = false;
		TVB.warning("Player: play: " + e.message);
		throw e;
	}
};

/**
 * Pause of current playback
 * @method pause
 * @return {Boolean}
 */
TVB.player.pause = function() {
	try {
		TVB.log("Player: pause()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying === true) {
			TVB.player.p.pause();
		}
		return true;
	} catch (e) {
		TVB.warning("Player: pause: " + e.message);
		throw e;
	}
};

/**
 * Play/Pause of current playback
 * @method playpause
 * @return {Boolean}
 */
TVB.player.playpause = function() {
	try {
		TVB.log("Player: playpause()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		TVB.log("Player: isPlaying is " + TVB.player.config.isPlaying);
		if (TVB.player.config.isPlaying === true) {
			try {
				TVB.log("Player: calling SMOJ playPause()...");
				TVB.player.p.playPause();
			} catch (e) {
				TVB.log(TVB.player.getStatus());
				if (TVB.player.getStatus() == 'PAUSED') {
					TVB.log("Player: playpause: playing...");
					TVB.player.play();
				} else {
					TVB.log("Player: playpause: pausing...");
					TVB.player.pause();
				}
			} 
		} else {
			TVB.log("Player: playpause: playing...");
			TVB.player.play();
		}
		// otherwise I can use p.playPause();
		return true;
	} catch (e) {
		TVB.warning("Player: playpause: " + e.message);
		throw e;
	}
};

/**
 * Rewind of current playback
 * @method rewind
 * @return {Boolean}
 */
TVB.player.rewind = function() {
	try {
		TVB.log("Player: rewind()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying === true) {
			TVB.player.p.rewind();
		}
		return true;
	} catch (e) {
		TVB.warning("Player: rewind: " + e.message);
		return false;
	}
};

/**
 * Fast forward of current playback
 * @method fastforward
 * @return {Boolean}
 */
TVB.player.fastforward = function() {
	try {
		TVB.log("Player: fastforward()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying === true) {
			TVB.player.p.fastForward();
		}
		return true;
	} catch (e) {
		TVB.warning("Player: fastforward: " + e.message);
		return false;
	}
};

/**
 * Stops current playback, and put the marker to the first frame
 * @method stop
 * @return {Boolean}
 */
TVB.player.stop = function() {
	try {
		TVB.log("Player: stop()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying === true) {
			if (TVB.player.config.noLittleHole === false) {
				TVB.player.config.littleHole.style.visibility = 'hidden';
				TVB.player.config.littleHole.style.display = 'none';
			}
			TVB.player.p.stop();
			/*try {
				TVB.player.p.setContent(null);
			} catch (e) {}*/
			if (TVB.player.config.isFullScreen === true) {
				TVB.player.config.wasFullScreen = true;
				if (TVB.player.exitFullScreen() === false) {
					TVB.log("Player: error exiting full screen mode");
					return false;
				}
			} else {
				TVB.player.config.wasFullScreen = false;
			}
			TVB.player.config.isPlaying = false;
			TVB.player.config.isStartPlay = true;
		}
		return true;
	} catch (e) {
		TVB.warning("Player: stop: " + e.message);
		throw e;
	}
};

/**
 * Returns current content uri
 * @method getContent
 * @return {String}
 */
TVB.player.getContent = function() {
	try {
		TVB.log("Player: getContent()");
		if (TVB.player.config.currentUri !== null) {
			return TVB.player.config.currentUri;
		} else {
			return null;
		}
	} catch (e) {
		TVB.warning("Player: getContent: " + e.message);
		return null;
	}
};

/**
 * Set content uri for current player; if config.autoplay
 * is set to true, starts the playback
 * @method setContent
 * @param {String} uri Uri of the content
 */
TVB.player.setContent = function(uri) {
	try {
		TVB.log("Player: setContent(" + uri + ")");
		TVB.player.config.currentUri = uri;
		if (TVB.player.config.autoplay === true) {
			TVB.player.play();
		}
	} catch (e) {
		TVB.warning("Player: setContent: " + e.message);
		throw e;
	}
};

/**
 * Enter full screen mode
 * @method enterFullScreen
 * @return {Boolean}
 */
TVB.player.enterFullScreen = function() {
	try {
		TVB.log("Player: enterFullScreen()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		// create a hole
		if (TVB.player.config.littleHole === null) {
			TVB.log("Player: enterFullScreen: before adding a hole");
			if (TVB.player.config.noLittleHole === false) {
				TVB.player.addHole(parseInt(window.innerWidth, 10), parseInt(window.innerHeight, 10));
			}
			TVB.log("Player: enterFullScreen: after adding a hole");
		}
		if (TVB.player.config.noLittleHole === false) {
			TVB.player.config.littleHole.style.top = '0px';
			TVB.player.config.littleHole.style.left = '0px';
			TVB.log("Player: system width: " + window.innerWidth + " - height: " + window.innerHeight);
			TVB.player.config.littleHole.style.width = window.innerWidth; /* 744px */
			TVB.player.config.littleHole.style.height = window.innerHeight; /* 596px */
			TVB.player.config.littleHole.style.visibility = 'visible';
			TVB.player.config.littleHole.style.display = 'block';
			TVB.player.config.littleHole.style.position = 'fixed';
			TVB.player.config.littleHole.style.zIndex = '10000';
		} 
		
		if (TVB.player.config.currentUri !== null) {
			TVB.log("Player: enterFullScreen: before setPosition");
			TVB.player.p.setPosition(0, 0);
			TVB.log("Player: enterFullScreen: before setScale");
			TVB.player.p.setScale("D1");
			TVB.log("Player: enterFullScreen: before setFullScreenModeEnabled");
			TVB.player.p.setFullScreenModeEnabled(true);
			TVB.log("Player: enterFullScreen: after all of this");
		}
		TVB.player.config.isFullScreen = true;
		/*
		try {
			if (document.getElementById('TVB.widget.colorButtonsBarHandler') !== null) {
				document.getElementById('TVB.widget.colorButtonsBarHandler').style.display = 'none';
			}
		} catch (e) {
			TVB.log("Player: warning 591: " + e.message);
		}
		
		try {
			if (document.getElementById('TVB.widget.titleHandler') !== null) {
				document.getElementById('TVB.widget.titleHandler').style.display = 'none';
			}
		} catch (e) {
			TVB.log("Player: warning 599: " + e.message);
		}
		*/
		return true;
	} catch (e) {
		TVB.warning("Player: enterFullScreen: " + e.message);
		return false;
	}
};

/**
 * Add a hole in the browser to view the video clip
 * @method addHole
 * @private
 * @param {Integer} width The width of the hole
 * @param {Integer} height The height of the hole
 */
TVB.player.addHole = function(width, height) {
	try {
		TVB.log("Player: addHole(" + width + ", " + height + ")");
		if (TVB.player.config.littleHole === null && TVB.player.config.noLittleHole === false) {
			document.body.style.padding = '0';
			document.body.style.margin = '0';
			document.body.style.overflow = 'hidden';
			TVB.player.config.littleHole = document.createElement('div');
			TVB.player.config.littleHole.style.backgroundColor = '#0000ff';
			TVB.player.config.littleHole.style.zIndex = '10000';
			TVB.player.config.littleHole.style.border = '0px';
			TVB.player.config.littleHole.style.top = TVB.player.config.topCord + 'px';
			TVB.player.config.littleHole.style.left = TVB.player.config.leftCord + 'px';
			TVB.player.config.littleHole.style.position = 'fixed';
			TVB.player.config.littleHole.style.visibility = 'hidden';
			TVB.player.config.littleHole.style.display = 'none'; // block
			TVB.player.config.littleHole.style.width = width + 'px';
			TVB.player.config.littleHole.style.height = height + 'px';
			TVB.player.config.littleHole.style.margin = '0';
			TVB.player.config.littleHole.style.padding = '0';
			document.body.appendChild(TVB.player.config.littleHole);
		} else {
			if (TVB.player.config.noLittleHole === false) {
				TVB.player.config.littleHole.style.top = TVB.player.config.topCord + 'px';
				TVB.player.config.littleHole.style.left = TVB.player.config.leftCord + 'px';
				TVB.player.config.littleHole.style.width = width + 'px';
				TVB.player.config.littleHole.style.height = height + 'px';
			} 
		}
		return;
	} catch (e) {
		TVB.warning("Player: addHole: " + e.message);
		throw e;
	}
};

/**
 * Switches from full screen mode to quarter of screen, and viceversa
 * @method switchFullScreen
 * @return {Boolean}
 */
TVB.player.switchFullScreen = function() {
	try {
		TVB.log("Player: switchFullScreen()");
		if (TVB.player.config.isFullScreen === true) {
			return TVB.player.exitFullScreen();
		} else {
			return TVB.player.enterFullScreen();
		}
	} catch (e) {
		TVB.warning("Player: switchFullScreen: " + e.message);
		return false;
	}
};

/**
 * Exit from full screen mode
 * @method exitFullScreen
 * @return {Boolean}
 */
TVB.player.exitFullScreen = function() {
	try {
		TVB.log("Player: exitFullScreen()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		// create a hole
		if (TVB.player.config.littleHole === null) {
			if (TVB.player.config.noLittleHole === false) {
				TVB.player.addHole(TVB.player.config.width, TVB.player.config.height);
			}
		}
		
		if (TVB.player.config.noLittleHole === false) {
			TVB.player.config.littleHole.style.width = TVB.player.config.width + "px";
			TVB.player.config.littleHole.style.height = TVB.player.config.height + "px";
		}
		
		var newX = parseInt(TVB.player.config.leftCord, 10) + parseInt(TVB.player.config.deltaX, 10);
		var newY = parseInt(TVB.player.config.topCord, 10) + parseInt(TVB.player.config.deltaY, 10);
		if (newY < 0) {
			newY = 0;
		}
		if (newX < 0) {
			newX = 0;
		}
		TVB.log("Player: hole coords (" + TVB.player.config.leftCord + ", " + TVB.player.config.topCord + ")");
		TVB.log("Player: coords (" + newX + ", " + newY + ")");
		
		if (TVB.player.config.noLittleHole === false) {
			TVB.player.config.littleHole.style.top = TVB.player.config.topCord + 'px';
			TVB.player.config.littleHole.style.left = TVB.player.config.leftCord + 'px';
		} 
		
		TVB.log("Player: current URI = " + TVB.player.config.currentUri);
		
		if (TVB.player.config.currentUri !== null) {
			
			if (TVB.player.config.geometryAllowed === true) {
				TVB.log("Player: setGeometry(" + newX + ", " + newY + ", " + TVB.player.config.width + ", " + TVB.player.config.height + ");");
				TVB.player.p.setGeometry(newX, newY, TVB.player.config.width, TVB.player.config.height);
			} else {
				if (TVB.player.config.useSIF === true) {
					TVB.log("Player: set scale SIF");
					TVB.player.p.setScale("SIF");
				} else {
					TVB.log("Player: set size (" + TVB.player.config.width + ", " + TVB.player.config.height + ")");
					TVB.player.p.setSize(TVB.player.config.width, TVB.player.config.height);
				}
				TVB.log("Player: set position " + newX + ", " + newY);
				TVB.player.p.setPosition(newX, newY);
			}
			TVB.log("Player: set full screen mode enabled false");
			TVB.player.p.setFullScreenModeEnabled(false);
		}
		TVB.player.config.isFullScreen = false;
		/*
		try {
			if (document.getElementById('TVB.widget.titleHandler') !== null) {
				document.getElementById('TVB.widget.titleHandler').style.display = 'block';
			}
		} catch (e) {
			TVB.error("Player: warning 719: " + e.message);
		}
		
		try {
			if (document.getElementById('TVB.widget.colorButtonsBarHandler') !== null) {
				document.getElementById('TVB.widget.colorButtonsBarHandler').style.display = 'block';
			}
		} catch (e) {
			TVB.error("Player: warning 727: " + e.message);
		}
		*/
		return true;
	} catch (e) {
		TVB.warning("Player: exitFullScreen: " + e.message);
		return false;
	}
};

/**
 * Destroy the video player and releases resources
 * @method destroy
 * @return {Boolean}
 */
TVB.player.destroy = function() {
	try {
		TVB.log("Player: destroy()");
		if (TVB.player.config.isInit === false) {
			TVB.log("Player: still not inited");
			return false;
		}
		TVB.player.stop();
		TVB.player.p.setScale("D1");
		TVB.player.p.setPosition(0,0);		
		TVB.log("Player: destroy: disposing");
		TVB.player.p.dispose();
		try {	
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.buttons.VCR);
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.BACK);
		} catch (e) {}
		TVB.player.config.isInit = false;
		return true;
	} catch (e) {
		TVB.warning("Player: destroy: " + e.message);
		return false;
	}
};

/**
 * Handle players events
 * @method events
 * @private
 * @param {Object} event The event thrown by the player
 */
TVB.player.events = function(event) {
	try {
		TVB.log("Player: events(" + event.newState + ")");
		var params = {
			newState: event.newState,
			previousState: event.previousState,
			source: event.source,
			uri: TVB.player.config.currentUri
		};
		TVB.CustomEvent.fireEvent(TVB.player.events.player, params);
		switch (event.newState) {
			case 'PLAYING':
				TVB.player.removeBufferingMessage();
				TVB.player.removePausedMessage();
				TVB.CustomEvent.fireEvent(TVB.player.events.play, params);
				break;
			case 'STOPPED':
				TVB.player.removeBufferingMessage();
				TVB.player.removePausedMessage();
				TVB.CustomEvent.fireEvent(TVB.player.events.stop, params);
				break;
			case 'PAUSED':
				TVB.player.removeBufferingMessage();
				TVB.player.showPausedMessage();
				TVB.CustomEvent.fireEvent(TVB.player.events.pause, params);
				break;
			case 'BUFFERING':
				TVB.player.config.isBuffering = true;
				TVB.player.showBufferingMessage();	
				TVB.CustomEvent.fireEvent(TVB.player.events.buffering, params);
				break;
			case 'REWINDING':
				TVB.player.removeBufferingMessage();
				TVB.player.removePausedMessage();
				TVB.CustomEvent.fireEvent(TVB.player.events.rewinding, params);
				break;
			case 'FAST_FORWARDING':
				TVB.player.removeBufferingMessage();
				TVB.player.removePausedMessage();
				TVB.CustomEvent.fireEvent(TVB.player.events.fast_forwarding, params);
				break;
			case 'END_OF_STREAMING':
			case 'END_OF_STREAM':
				TVB.player.removeBufferingMessage();
				TVB.player.removePausedMessage();
				TVB.CustomEvent.fireEvent(TVB.player.events.end_of_streaming, params);
				break;
			default:
				TVB.log("Player: unhandled state: " + event.newState);
		}
	} catch (e) {
		TVB.warning("Player: events: " + e.message);
		throw e;
	}
};

/**
 * Add muting to system
 * @method mute
 */
TVB.player.mute = function() {
	try {
		TVB.log("Player: mute()");
		TVB.player.p.setMuted(true);
	} catch (e) {
		TVB.warning("Player: mute: " + e.message);
		throw e;
	}
};

/**
 * Remove muting from system
 * @method unmute
 */
TVB.player.unmute = function() {
	try {
		TVB.log("Player: unmute()");
		TVB.player.p.setMuted(false);
	} catch (e) {
		TVB.warning("Player: unmute: " + e.message);
		throw e;
	}
};

/**
 * Returns current state of the mute subsystem
 * @method isMuted
 * @return {Boolean}
 */
TVB.player.isMuted = function() {
	try {
		TVB.log("Player: isMuted() -> " + TVB.player.p.isMuted());
		return TVB.player.p.isMuted();
	} catch (e) {
		TVB.warning("Player: isMuted: " + e.message);
		return false;
	}
};

/**
 * Returns current state of the player
 * @method isInited
 * @return {Boolean}
 */
TVB.player.isInited = function() {
	try {
		TVB.log("Player: isInited() -> " + TVB.player.config.isInit);
		return TVB.player.config.isInit;
	} catch (e) {
		TVB.warning("Player: isInited: " + e.message);
		return false;
	}
};

/**
 * Returns current content, if any
 * @method getContent
 * @return {String} Current content, false if no content available
 */
TVB.player.getContent = function() {
	try {
		TVB.log("Player: getContent() -> " + TVB.player.p.getContent());
		return TVB.player.p.getContent();
	} catch (e) {
		TVB.warning("Player: getContent: " + e.message);
		return null;
	}
};

/**
 * Returns current status, if any
 * @method getStatus
 * @return {String} Status name, false if no status available
 */
TVB.player.getStatus = function() {
	try {
		TVB.log("Player: getStatus() -> " + TVB.player.p.getStatus());
		return TVB.player.p.getStatus();
	} catch (e) {
		TVB.warning("Player: getStatus: " + e.message);
		return null;
	}
};

/**
 * Returns true if TVBLOB's browser has full screen mode enabled
 * (security bar non visible), false otherwise
 * @method isFullScreenModeEnabled
 * @return {Boolean}
 */
TVB.player.isFullScreenModeEnabled = function() {
	try {
		TVB.log("Player: isFullScreenModeEnabled() -> " + TVB.player.p.isFullScreenModeEnabled());
		return TVB.player.p.isFullScreenModeEnabled();
	} catch (e) {
		TVB.warning("Player: isFullScreenModeEnabled:" + e.message);
		return false;
	}
};

TVB.player.showPausedMessage = function() {
	try {
		if(!document.getElementById('TVB.player.pausedmessage')) {
			TVB.log("Player: showBufferingMessage()");
			var div = document.createElement('div');
			div.id = 'TVB.player.pausedmessage';
			div.style.width = '48px';
			div.style.height = '32px';
			div.style.position = 'fixed';
			div.style.top = parseInt(window.innerHeight - 55, 10) + "px";
			div.style.left = '30px';
			div.style.padding = 0;
			div.style.margin = 0;
			div.style.zIndex = '10004';			
			document.body.appendChild(div);
		}
		var ico = null;
		if (TVB.system.getFirmwareVersion() == "NON_TVBLOB") {
			ico = 'http://storage.tvblob.com/lib/resources/playback_paused.png';
		} else {
			ico = 'file://gui/resources/themes/' + TVB.system.getVideoSystem() + '/consumer_v1/player/icons/dashboard/playback_paused.png';
		}
		try {
			document.getElementById('TVB.player.pausedmessage').style.background = "#000001 url('" + ico + "') top left no-repeat";
		} catch (e) {
			TVB.log("Player: warning in showBufferingMessage: " + e.message);
		}
	} catch (e) {
		TVB.warning("Player: showPausedMessage: " + e.message);
		throw e;
	}
};

TVB.player.removePausedMessage = function() {
	try {
		TVB.log("Player: removePausedMessage()");
		if(document.getElementById('TVB.player.pausedmessage')) {
			TVB.system.deleteElementById('TVB.player.pausedmessage');
		}
	} catch (e) {
		TVB.warning("Player: removePausedMessage: " + e.message);
		throw e;
	}
};

TVB.player.showBufferingMessage = function() {
	try {
		if(!document.getElementById('bufferingmessage')) {
			TVB.log("Player: showBufferingMessage()");
			var div = document.createElement('div');
			div.id = 'bufferingmessage';
			div.style.width = '48px';
			div.style.height = '32px';
			div.style.position = 'fixed';
			div.style.top = parseInt(window.innerHeight - 85, 10) + "px"; // 55
			div.style.left = '30px';
			div.style.padding = 0;
			div.style.margin = 0;
			div.style.zIndex = '10001';			
			document.body.appendChild(div);
		}
		var ico = null;
		if (TVB.system.getFirmwareVersion() == "NON_TVBLOB") {
			ico = 'http://storage.tvblob.com/lib/resources/playback_buffering.png';
		} else {
			ico = 'file://gui/resources/themes/' + TVB.system.getVideoSystem() + '/consumer_v1/player/icons/dashboard/playback_buffering.png';
		}
		try {
			document.getElementById('bufferingmessage').style.background = "#000001 url('" + ico + "') top left no-repeat";
		} catch (e) {
			TVB.log("Player: warning in showBufferingMessage: " + e.message);
		}
		//document.getElementById('bufferingmessage').innerHTML = tvblob.getI18NString("hint.buffering", "Adapting to network conditions...", "messagesMediaPlayer");
	} catch (e) {
		TVB.warning("Player: showBufferingMessage: " + e.message);
		throw e;
	}
};

TVB.player.showStartingPlaybackMessage = function() {
	try {
		TVB.log("Player: showStartingPlaybackMessage()");
		if(!document.getElementById('bufferingmessage')) {
			TVB.log("Player: showBufferingMessage()");
			var div = document.createElement('div');
			div.id = 'bufferingmessage';
			div.style.width = '48px';
			div.style.height = '32px';
			div.style.position = 'fixed';
			div.style.top = parseInt(window.innerHeight - 85, 10) + "px";
			div.style.left = '30px';
			div.style.padding = 0;
			div.style.margin = 0;
			div.style.zIndex = '10002';			
			document.body.appendChild(div);
		}
		var ico = null;
		if (TVB.system.getFirmwareVersion() == "NON_TVBLOB") {
			ico = 'http://storage.tvblob.com/lib/resources/playback_working.png';
		} else {
			ico = 'file://gui/resources/themes/' + TVB.system.getVideoSystem() + '/consumer_v1/player/icons/dashboard/playback_working.png';
		}
		try {
			document.getElementById('bufferingmessage').style.background = "#000001 url('" + ico + "') top left no-repeat";
		} catch (e) {
			TVB.log("Player: warning in showStartingPlaybackMessage: " + e.message);
		}
	} catch (e) {
		TVB.warning("Player: showStartingPlaybackMessage: " + e.message);
		throw e;
	}
};

TVB.player.showUnableToPlayMessage = function() {
	try {
		TVB.log("Player: showUnableToPlayMessage()");
		if(!document.getElementById('tvbplayererrormessage')) {
			var div = document.createElement('div');
			div.id = 'tvbplayererrormessage';
			div.style.background = '#000 url("") no-repeat';
			div.style.color = 'red';
			div.style.zIndex = '32010';
			div.style.border = '0';
			div.style.top = parseInt(window.innerHeight - 28, 10) + "px";
			div.style.left = '0px';
			div.style.position = 'fixed';
			div.style.display = 'block';
			div.style.width = parseInt(window.innerWidth - 40, 10) + "px";
			div.style.margin = '0';
			div.style.padding = '0';
			div.style.paddingLeft = '20px';
			div.style.paddingRight = '20px';
			div.style.overflow = 'hidden';
			div.style.height = '28px';
			div.style.zIndex = '10004';

			div.innerHTML = '';
	
			document.body.appendChild(div);
		}

		//document.getElementById('tvbplayererrormessage').innerHTML = tvblob.getI18NStringWithArgs("hint.unableToPlay", "Unable to play", "messagesMediaPlayer", [TVB.player.config.currentUri]);
		document.getElementById('tvbplayererrormessage').innerHTML = tvblob.getI18NString("error.title", "Unable to play", "messagesMediaPlayer");

	} catch (e) {
		TVB.warning("Player: showUnableToPlayMessage: " + e.message);
		throw e;
	}
};

TVB.player.removeBufferingMessage = function() {
	try {
		TVB.log("Player: removeBufferingMessage()");
		setTimeout(function() {
			if(document.getElementById('bufferingmessage')) {
				//document.getElementById('bufferingmessage').style.background = "#0000ff url() top left no-repeat";
				TVB.system.deleteElementById('bufferingmessage');
			}
		}, 1000);
	} catch (e) {
		TVB.warning("Player: removeBufferingMessage: " + e.message);
		throw e;
	}
};

TVB.player.removeErrorMessage = function() {
	try {
		TVB.log("Player: removeErrorMessage()");
		setTimeout(function() {
			if (document.getElementById('tvbplayererrormessage')) {
				//document.getElementById('tvbplayererrormessage').innerHTML = '';
				TVB.system.deleteElementById('tvbplayererrormessage');
			}
		}, 1000);
	} catch (e) {
		TVB.warning("Player: removeErrorMessage: " + e.message);
		throw e;
	}
};

/**
 * Disables temporary the remote control
 * @method disableRemote
 * @return {Boolean}
 */
TVB.player.disableRemote = function() {
	try {
		TVB.log("Player: disableRemote()");
		TVB.player.config.disableRemote = true;
		return true;
	} catch (e) {
		TVB.warning("Player: disableRemote:" + e.message);
		return false;
	}
};

/**
 * Enables the remote control
 * @method enableRemote
 * @return {Boolean}
 */
TVB.player.enableRemote = function() {
	try {
		TVB.log("Player: enableRemote()");
		TVB.player.config.disableRemote = false;
		return true;
	} catch (e) {
		TVB.warning("Player: enableRemote:" + e.message);
		return false;
	}
};

/**
 * Change the size of the player
 * @method setSize
 * @param {Integer} w Width
 * @param {Integer} h Height
 * @exception TypeError
 * @exception RangeError
 */
TVB.player.setSize = function(w, h) {
	try {
		TVB.log("Player: setSize(" + w + ", " + h + ")");
		if (w < 0 || h < 0) {
			throw RangeError;
		}
		if (typeof w != 'number' || typeof h != 'number') {
			throw TypeError;
		}
		TVB.player.p.setSize(w, h);
		if (TVB.player.config.noLittleHole === false) {
			TVB.player.config.littleHole.style.width = w + 'px';
			TVB.player.config.littleHole.style.height = h + 'px';
		}
		TVB.player.config.width = w;
		TVB.player.config.height = h;
	} catch (e) {
		TVB.warning("Player: setSize: " + e.message);
		throw e;
	}
};

/**
 * Reposition current player instance on the canvas
 * @method setPosition
 * @param {Integer} x Left coord
 * @param {Integer} y Top coord
 * @exception TypeError
 */
TVB.player.setPosition = function(x, y) {
	try {
		if (typeof x != 'number' || typeof y != 'number') {
			throw TypeError;
		}
		
		TVB.log("Player: setPosition(" + x + ", " + y + ");");
		TVB.player.p.setPosition(x, y);			

		TVB.player.config.topCord = y;
		TVB.player.config.leftCord = x;

		if (TVB.player.config.noLittleHole === false) {
			TVB.player.config.littleHole.style.top = y + 'px';
			TVB.player.config.littleHole.style.left = x + 'px';
		}
	} catch (e) {
		TVB.error("Player: setPosition: " + e.message);
		throw e;
	}
};

/**
 * Change the whole geometry for the player
 * @method setGeometry
 * @param {Integer} x Left coord
 * @param {Integer} y Top coord
 * @param {Integer} w Width
 * @param {Integer} x Height
 * @exception TypeError
 * @exception RangeError
 */
TVB.player.setGeometry = function(x, y, w, h) {
	try {
		if (typeof x != 'number' || typeof y != 'number' || typeof w != 'number' || typeof h != 'number') {
			throw TypeError;
		}
		if (w < 0 || h < 0) {
			throw RangeError;
		}
		
		TVB.player.config.useSIF = false;
		
		if (TVB.player.config.geometryAllowed === false) {
			TVB.log("Player: setSize(" + w + ", " + h + ");");
			TVB.player.p.setSize(w, h);
			TVB.log("Player: setPosition(" + x + ", " + y + ");");
			TVB.player.p.setPosition(x, y);			
		} else {
			TVB.log("Player: setGeometry(" + x + ", " + y + ", " + w + ", " + h + ");");
			TVB.player.p.setGeometry(x, y, w, h);
		}
		
		TVB.player.config.topCord = y;
		TVB.player.config.leftCord = x;

		if (TVB.player.config.noLittleHole === false) {
			TVB.player.config.littleHole.style.top = y + 'px';
			TVB.player.config.littleHole.style.left = x + 'px';
			TVB.player.config.littleHole.style.width = w + 'px';
			TVB.player.config.littleHole.style.height = h + 'px';			
		}
	} catch (e) {
		TVB.error("Player: setGeometry: " + e.message);
		throw e;
	}
};

/**
 * Restart current video playback from the beginning
 * @method restartCurrentVideo
 */
TVB.player.restartCurrentVideo = function() {
	try {
		if (TVB.player.config.isPlaying === true) {
			TVB.player.stop();
		}
		TVB.player.play();
	} catch (e) {
		TVB.error("Player: restartCurrentVideo: " + e.message);
		throw e;
	}
};
