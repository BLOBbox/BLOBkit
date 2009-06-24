/**
 * Media Player for BLOBbox
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
TVB.player = {}

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
 * @param {Object} config configuration array
 * @return {Boolean}
 */
TVB.player.init = function(config){
	try {
		TVB.log("Player: init(config)");
		
		if (TVB.player.config.isInit == false) {
			TVB.player.p = new BlobPlayer();
			
			TVB.player.config.isInit = true;
			TVB.player.config.isPlaying = false;
			TVB.player.config.isFullScreen = false;
			TVB.player.config.wasFullScreen = false;
			TVB.player.config.isBuffering = false;
			
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

			if (typeof config.noLittleHole != 'undefined' && config.noLittleHole == true) {
				TVB.log("Player: little hole disabled");
				TVB.player.config.noLittleHole = true;
			} else {
				TVB.player.config.noLittleHole = false;
			}

			// configure remote
			if (typeof config.disableRemote != 'undefined' && config.disableRemote == true) {
				TVB.player.config.disableRemote = true;
			} else {
				TVB.player.config.disableRemote = false;
				TVB.remoteInit();
				TVB.CustomEvent.subscribeEvent(TVB.remote.buttons.VCR, TVB.player.handleRemote);
				TVB.CustomEvent.subscribeEvent(TVB.remote.button['BACK'], TVB.player.handleRemote);
			}
			
			// configure auto switch full screen
			if (typeof config.switchKey != 'undefined') {
				TVB.player.config.keyForFullScreen = config.switchKey;
			}
			try {
				if (TVB.player.config.keyForFullScreen != null) {
					TVB.CustomEvent.subscribeEvent(TVB.remote.button[TVB.player.config.keyForFullScreen], function(){
						try {
							TVB.player.switchFullScreen()
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
				TVB.player.config.topCord = parseInt(config.top);
			} else {
				TVB.player.config.topCord = parseInt((window.innerHeight / 2) - (window.innerHeight / 4));
			}
			if (typeof config.left != 'undefined') {
				TVB.player.config.leftCord = parseInt(config.left);
			} else {
				TVB.player.config.leftCord = parseInt((window.innerWidth / 2) - (window.innerWidth / 4));
			}
			TVB.log("Player: init: new player in coords(" + TVB.player.config.leftCord + ", " + TVB.player.config.topCord + ")");
			
			// configure fullscreen
			if (typeof config.fullscreen != 'undefined' && config.fullscreen == true) {
				TVB.player.config.autoFullScreen = true; 
			} else {
				TVB.player.config.autoFullScreen = false;
			}
			TVB.log("Player: full screen mode configured to " + TVB.player.config.autoFullScreen);
			
			// configure autoplay
			if (typeof config.autoplay != 'undefined' && config.autoplay == false) {
				TVB.player.config.autoplay = false;
			} else {
				TVB.player.config.autoplay = true;
			}
			
			TVB.player.addHole(0,0);
			if (TVB.player.config.noLittleHole == false) {
				TVB.player.config.littleHole.style.visibility = 'hidden';
				TVB.player.config.littleHole.style.display = 'none';
			}
			
			if (TVB.player.config.autoplay == true) {
				TVB.player.play();
			}
			
			return true;
		} else {
			TVB.log("Player: already inited (warning)");
			return false;
		}
	} catch (e) {
		TVB.error("Player: init: " + e.message);
		throw e;
	}
}

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
		if (TVB.player.config.disableRemote == false) {
			switch (args[0].keyName) {
				case 'BACK':
					TVB.player.stop();
					TVB.CustomEvent.stopEvent(TVB.remote.button['BACK']);
					break;
				case 'STOP':
					TVB.player.stop();
					TVB.CustomEvent.stopEvent(TVB.remote.button['STOP']);
					break;
				case 'PLAY':
					TVB.player.play();
					break;
				case 'PAUSE':
					TVB.player.pause();
					break;
				case 'PLAY_PAUSE':
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
		TVB.error("Player: handleRemote: " + e.message);
	}
}

/**
 * Starts play of current content
 * @method play
 * @return {Boolean}
 */
TVB.player.play = function() {
	try {
		TVB.log("Player: play() --");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.currentUri == null) {
			TVB.error("Player: play: please config a player uri before trying to play");
			return false;
		}
		
		try {
			if (TVB.player.p.getContent() != TVB.player.config.currentUri) {
				TVB.log("Player: setContent start");
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
			}
			TVB.CustomEvent.fireEvent(TVB.player.events.stop, params);
			return false;
		}
		
		if (TVB.player.config.isStartPlay == true) {
			TVB.player.config.isStartPlay = false;
			TVB.CustomEvent.fireEvent(TVB.player.events.starting_playback, {});
			TVB.log("Player: Starting playback...");
		}
		if (TVB.player.config.wasFullScreen == true) {
			TVB.log("Player: entering full screen because TVB.player.config.wasFullScreen == true");
			TVB.player.enterFullScreen();
			TVB.player.config.wasFullScreen = false;
		} else {
			if (TVB.player.config.autoFullScreen == true) {
				TVB.log("Player: entering full screen because TVB.player.config.autoFullScreen == true");
				TVB.player.enterFullScreen();
			} else {
				TVB.player.exitFullScreen();
			}
		}
		try {
			if (TVB.player.config.noLittleHole == false) {
				TVB.player.config.littleHole.style.visibility = 'visible';
				TVB.player.config.littleHole.style.display = 'block';
			}
		} catch (e) {
			TVB.error("Player: play: " + e.message);
		}
		/*
		TVB.log("Player: play: TVB.player.config.isFullScreen == " + TVB.player.config.isFullScreen);
		
		if (TVB.player.config.isFullScreen == true) {
			TVB.player.enterFullScreen();
		} else {
			TVB.player.exitFullScreen();
		}
		*/
		setTimeout(function() {
			try {
				TVB.player.removeBufferingMessage();
				TVB.player.p.play();
				TVB.player.config.isPlaying = true;
			} catch (e) {
				TVB.error("Player: play: " + e.message);
				throw e;
			}
		}, 350);
		return true;
	} catch (e) {
		TVB.player.config.isPlaying = false;
		TVB.error("Player: play: " + e.message);
		throw e;
	}
}

/**
 * Pause of current playback
 * @method pause
 * @return {Boolean}
 */
TVB.player.pause = function() {
	try {
		TVB.log("Player: pause()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying == true) {
			TVB.player.p.pause();
		}
		return true;
	} catch (e) {
		TVB.error("Player: pause: " + e.message);
		throw e;
	}
}

/**
 * Play/Pause of current playback
 * @method playpause
 * @return {Boolean}
 */
TVB.player.playpause = function() {
	try {
		TVB.log("Player: playpause()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying == true) {
			try {
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
		TVB.error("Player: playpause: " + e.message);
		throw e;
	}
}

/**
 * Rewind of current playback
 * @method rewing
 * @return {Boolean}
 */
TVB.player.rewind = function() {
	try {
		TVB.log("Player: rewind()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying == true) {
			TVB.player.p.rewind();
		}
		return true;
	} catch (e) {
		TVB.error("Player: rewind: " + e.message);
		return false;
	}
}

/**
 * Fast forward of current playback
 * @method fastforward
 * @return {Boolean}
 */
TVB.player.fastforward = function() {
	try {
		TVB.log("Player: fastforward()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying == true) {
			TVB.player.p.fastForward();
		}
		return true;
	} catch (e) {
		TVB.error("Player: fastforward: " + e.message);
		return false;
	}
}

/**
 * Stops current playback, and put the marker to the first frame
 * @method stop
 * @return {Boolean}
 */
TVB.player.stop = function() {
	try {
		TVB.log("Player: stop()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (TVB.player.config.isPlaying == true) {
			TVB.player.config.littleHole.style.visibility = 'hidden';
			TVB.player.config.littleHole.style.display = 'none';
			TVB.player.p.stop();
			if (TVB.player.config.isFullScreen == true) {
				TVB.player.config.wasFullScreen = true;
				if (TVB.player.exitFullScreen() == false) {
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
		TVB.error("Player: stop: " + e.message);
		throw e;
	}
}

/**
 * Returns current content uri
 * @method getContent
 * @return {String}
 */
TVB.player.getContent = function() {
	try {
		TVB.log("Player: getContent()");
		if (TVB.player.config.currentUri != null) {
			return TVB.player.config.currentUri;
		} else {
			return null;
		}
	} catch (e) {
		TVB.error("Player: getContent: " + e.message);
		return null;
	}
}

/**
 * Set content uri for current player; if config.autoplay
 * is set to true, starts the playback
 * @method setContent
 * @param {String} uri Uri of the content
 * @return {Boolean}
 */
TVB.player.setContent = function(uri) {
	try {
		TVB.log("Player: setContent(" + uri + ")");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		if (uri == 'undefined') {
			TVB.log("Player: uri undefined");
			return false;
		}
		var wasPlaying = false;
		if (TVB.player.config.isPlaying == true) {
			wasPlaying = true;
			TVB.player.stop();
		}
		TVB.player.p.setContent(uri);
		TVB.player.config.currentUri = uri;
		TVB.player.config.isStartPlay = true;

		// configure fullscreen
		
		//////////// DEVO RIVEDERE QUESTO PASSAGGIO......
		
		if (TVB.player.config.inited == true) {
			if (TVB.player.config.isFullScreen == true) {
				TVB.player.enterFullScreen();
			}
			else {
				TVB.player.exitFullScreen();
			}
		}

		if (wasPlaying == true || TVB.player.config.autoplay == true) {
			TVB.player.play();
		}
		return true;
	} catch (e) {
		TVB.error("Player: setContent: " + e.message);
		TVB.player.config.isInit = false;
		throw e;
	}
}

/**
 * Enter full screen mode
 * @method enterFullScreen
 * @return {Boolean}
 */
TVB.player.enterFullScreen = function() {
	try {
		TVB.log("Player: enterFullScreen()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		// create a hole
		if (TVB.player.config.littleHole == null) {
			TVB.log("Player: enterFullScreen: before adding a hole");
			if (TVB.player.config.noLittleHole == false) TVB.player.addHole(744, 596);
			TVB.log("Player: enterFullScreen: after adding a hole");
		}
		TVB.player.config.littleHole.style.top = '0px';
		TVB.player.config.littleHole.style.left = '0px';
		TVB.log("Player: system width: " + window.innerWidth + " - height: " + window.innerHeight);
		TVB.player.config.littleHole.style.width = window.innerWidth; /* 744px */
		TVB.player.config.littleHole.style.height = window.innerHeight; /* 596px */
		if (TVB.player.config.noLittleHole == true) {
			TVB.player.config.littleHole.style.visibility = 'visible';
			TVB.player.config.littleHole.style.display = 'block';
		} 
		
		if (TVB.player.config.currentUri != null) {
			TVB.log("Player: enterFullScreen: before setPosition");
			TVB.player.p.setPosition(0, 0);
			TVB.log("Player: enterFullScreen: before setScale");
			TVB.player.p.setScale("D1");
			TVB.log("Player: enterFullScreen: before setFullScreenModeEnabled");
			TVB.player.p.setFullScreenModeEnabled(true);
			TVB.log("Player: enterFullScreen: after all of this");
		}
		TVB.player.config.isFullScreen = true;
		
		try {
			if (document.getElementById('TVB.widget.titleHandler') != null) {
				document.getElementById('TVB.widget.titleHandler').style.visibility = 'hidden';
			}
		} catch (e) {}
		
		try {
			if (document.getElementById('TVB.widget.colorButtonsBarHandler') != null) {
				document.getElementById('TVB.widget.colorButtonsBarHandler').style.visibility = 'hidden';
			}
		} catch (e) {}
		
		return true;
	} catch (e) {
		TVB.error("Player: enterFullScreen: " + e.message);
		return false;
	}
}

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
		if (TVB.player.config.littleHole == null) {
			document.body.style.padding = '0';
			document.body.style.margin = '0';
			document.body.style.overflow = 'hidden';
			TVB.player.config.littleHole = document.createElement('div');
			TVB.player.config.littleHole.style.backgroundColor = '#0000ff';
			TVB.player.config.littleHole.style.zIndex = '32000';
			TVB.player.config.littleHole.style.border = '0px';
			TVB.player.config.littleHole.style.top = TVB.player.config.topCord + 'px';
			TVB.player.config.littleHole.style.left = TVB.player.config.leftCord + 'px';
			TVB.player.config.littleHole.style.position = 'absolute';
			TVB.player.config.littleHole.style.visibility = 'hidden';
			TVB.player.config.littleHole.style.display = 'none'; // block
			TVB.player.config.littleHole.style.width = width + 'px';
			TVB.player.config.littleHole.style.height = height + 'px';
			TVB.player.config.littleHole.style.margin = '0';
			TVB.player.config.littleHole.style.padding = '0';
			document.body.appendChild(TVB.player.config.littleHole);
		} else {
			TVB.player.config.littleHole.style.top = TVB.player.config.topCord + 'px';
			TVB.player.config.littleHole.style.left = TVB.player.config.leftCord + 'px';
			TVB.player.config.littleHole.style.width = width + 'px';
			TVB.player.config.littleHole.style.height = height + 'px';
		}
		return;
	} catch (e) {
		TVB.error("Player: addHole: " + e.message);
	}
}

/**
 * Switches from full screen mode to quarter of screen, and viceversa
 * @method switchFullScreen
 * @return {Boolean}
 */
TVB.player.switchFullScreen = function() {
	try {
		TVB.log("Player: switchFullScreen()");
		if (TVB.player.config.isFullScreen == true) {
			return TVB.player.exitFullScreen();
		} else {
			return TVB.player.enterFullScreen();
		}
	} catch (e) {
		TVB.error("Player: switchFullScreen: " + e.message);
	}
}

/**
 * Exit from full screen mode
 * @method exitFullScreen
 * @return {Boolean}
 */
TVB.player.exitFullScreen = function() {
	try {
		TVB.log("Player: exitFullScreen()");
		if (TVB.player.config.isInit == false) {
			TVB.log("Player: still not inited");
			return false;
		}
		// create a hole
		if (TVB.player.config.littleHole == null) {
			if (TVB.player.config.noLittleHole == false) TVB.player.addHole(348, 238);
		}
		TVB.player.config.littleHole.style.width = parseInt(window.innerWidth / 2); /*'348px';*/
		TVB.player.config.littleHole.style.height = parseInt(window.innerHeight / 2) + 18; /*'238px';*/
		
		var newX = parseInt(TVB.player.config.leftCord) + parseInt(TVB.player.config.deltaX);
		var newY = parseInt(TVB.player.config.topCord) + parseInt(TVB.player.config.deltaY);
		if (newY < 0) 
			newY = 0;
		if (newX < 0) 
			newX = 0;
		TVB.log("Player: hole coords (" + TVB.player.config.leftCord + ", " + TVB.player.config.topCord + ")");
		TVB.log("Player: coords (" + newX + ", " + newY + ")");
		
		TVB.player.config.littleHole.style.top = TVB.player.config.topCord + 'px';
		TVB.player.config.littleHole.style.left = TVB.player.config.leftCord + 'px';
		if (TVB.player.config.noLittleHole == true) {
			TVB.player.config.littleHole.style.visibility = 'hidden';
			TVB.player.config.littleHole.style.display = 'none';
		} 
		
		TVB.log("Player: current URI = " + TVB.player.config.currentUri);
		
		if (TVB.player.config.currentUri != null) {
			TVB.log("Player: set position " + newX + ", " + newY);
			TVB.player.p.setPosition(newX, newY);
			TVB.log("Player: set scale SIF");
			TVB.player.p.setScale("SIF");
			TVB.log("Player: set full screen mode enabled false");
			TVB.player.p.setFullScreenModeEnabled(false);
		}
		TVB.player.config.isFullScreen = false;
		
		try {
			if (document.getElementById('TVB.widget.titleHandler') != null) {
				document.getElementById('TVB.widget.titleHandler').style.visibility = 'visible';
			}
		} catch (e) {}
		
		try {
			if (document.getElementById('TVB.widget.colorButtonsBarHandler') != null) {
				document.getElementById('TVB.widget.colorButtonsBarHandler').style.visibility = 'visible';
			}
		} catch (e) {}
		
		return true;
	} catch (e) {
		TVB.error("Player: exitFullScreen: " + e.message);
		return false;
	}
}

/**
 * Destroy the video player and releases resources
 * @method destroy
 * @return {Boolean}
 */
TVB.player.destroy = function() {
	try {
		TVB.log("Player: destroy()");
		if (TVB.player.config.isInit == false) {
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
			TVB.CustomEvent.unsubscribeEvent(TVB.remote.button['BACK']);
		} catch (e) {}
		TVB.player.config.isInit = false;
		return true;
	} catch (e) {
		TVB.error("Player: destroy: " + e.message);
		return false;
	}
}

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
		}
		TVB.CustomEvent.fireEvent(TVB.player.events.player, params);
		switch (event.newState) {
			case 'PLAYING':
				//if (TVB.player.config.isBuffering == false) {
				TVB.player.removeBufferingMessage();
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.play, params);
				break;
			case 'STOPPED':
				//if (TVB.player.config.isBuffering == false) {
				TVB.player.removeBufferingMessage();
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.stop, params);
				break;
			case 'PAUSED':
				//if (TVB.player.config.isBuffering == false) {
				TVB.player.removeBufferingMessage();
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.pause, params);
				break;
			case 'BUFFERING':
				//if (TVB.player.config.isBuffering == false) {
					TVB.player.config.isBuffering = true;
					//TVB.player.pause();
					TVB.player.showBufferingMessage();	
					/*setTimeout( function() {
						TVB.player.play();
						TVB.player.removeBufferingMessage();
						TVB.player.config.isBuffering = false;
					}, 3000);*/
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.buffering, params);
				break;
			case 'REWINDING':
				//if (TVB.player.config.isBuffering == false) {
				TVB.player.removeBufferingMessage();
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.rewinding, params);
				break;
			case 'FAST_FORWARDING':
				//if (TVB.player.config.isBuffering == false) {
				TVB.player.removeBufferingMessage();
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.fast_forwarding, params);
				break;
			case 'END_OF_STREAMING':
			case 'END_OF_STREAM':
				//if (TVB.player.config.isBuffering == false) {
				TVB.player.removeBufferingMessage();
				//}
				TVB.CustomEvent.fireEvent(TVB.player.events.end_of_streaming, params);
				break;
			default:
				TVB.log("Player: unhandled state: " + event.newState);
		}
	} catch (e) {
		TVB.error("Player: events: " + e.message);
	}
}

/**
 * Add muting to system
 * @method mute
 */
TVB.player.mute = function() {
	try {
		TVB.log("Player: mute()");
		TVB.player.p.setMuted(true);
	} catch (e) {
		TVB.error("Player: mute: " + e.message);
	}
}

/**
 * Remove muting from system
 * @method unmute
 */
TVB.player.unmute = function() {
	try {
		TVB.log("Player: unmute()");
		TVB.player.p.setMuted(false);
	} catch (e) {
		TVB.error("Player: unmute: " + e.message);
	}
}

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
		TVB.error("Player: isMuted: " + e.message);
		return false;
	}
}

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
		TVB.error("Player: isInited: " + e.message);
		return false;
	}
}

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
		TVB.error("Player: getContent: " + e.message);
		return null;
	}
}

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
		TVB.error("Player: getStatus: " + e.message);
		return null;
	}
}

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
		TVB.error("Player: isFullScreenModeEnabled:" + e.message);
		return false;
	}
}

TVB.player.showBufferingMessage = function() {
	try {
		if(!document.getElementById('bufferingmessage')) {
			TVB.log("Player: showBufferingMessage() - NEW");
			var div = document.createElement('div');
			div.id = 'bufferingmessage';
			div.style.background = '#000 url("") no-repeat';
			div.style.zIndex = '32010';
			div.style.border = '0';
			div.style.bottom = '10px';
			div.style.left = '40px';
			div.style.position = 'absolute';
			div.style.display = 'block';
			div.style.margin = '0';
			div.style.padding = '0';
			div.style.paddingLeft = '10px';
			div.style.paddingRight = '10px';
	
			div.innerHTML = '&nbsp;';
	
			document.body.appendChild(div);
		}
		
		document.getElementById('bufferingmessage').innerHTML = tvblob.getI18NString("hint.buffering", "Adapting to network conditions...", "messagesMediaPlayer");

	} catch (e) {
		TVB.error("Player: showBufferingMessage: " + e.message);
		throw e;
	}
}

TVB.player.showStartingPlaybackMessage = function() {
	try {
		TVB.log("Player: showStartingPlaybackMessage()");
		if(!document.getElementById('bufferingmessage')) {
			var div = document.createElement('div');
			div.id = 'bufferingmessage';
			div.style.background = '#000 url("") no-repeat';
			div.style.zIndex = '32010';
			div.style.border = '0';
			div.style.bottom = '10px';
			div.style.left = '40px';
			div.style.position = 'absolute';
			div.style.display = 'block';
			div.style.margin = '0';
			div.style.padding = '0';
			div.style.paddingLeft = '10px';
			div.style.paddingRight = '10px';

			div.innerHTML = '';
	
			document.body.appendChild(div);
		}

		document.getElementById('bufferingmessage').innerHTML = tvblob.getI18NString("hint.preparingToPlay", "Opening...", "messagesMediaPlayer");

	} catch (e) {
		TVB.error("Player: showStartingPlaybackMessage: " + e.message);
		throw e;
	}
}

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
			div.style.bottom = '10px';
			div.style.left = '40px';
			div.style.position = 'absolute';
			div.style.display = 'block';
			div.style.width = '300px';
			div.style.margin = '0';
			div.style.padding = '0';
			div.style.paddingLeft = '10px';
			div.style.paddingRight = '10px';

			div.innerHTML = '';
	
			document.body.appendChild(div);
		}

		document.getElementById('tvbplayererrormessage').innerHTML = tvblob.getI18NStringWithArgs("hint.unableToPlay", "Unable to play", "messagesMediaPlayer", ["..."]);

	} catch (e) {
		TVB.error("Player: showUnableToPlayMessage: " + e.message);
		throw e;
	}
}

TVB.player.removeBufferingMessage = function() {
	try {
		//if (TVB.player.config.isBuffering == true) {
		TVB.log("Player: removeBufferingMessage()");
		setTimeout(function() {
			if(document.getElementById('bufferingmessage'))
				document.getElementById('bufferingmessage').innerHTML = '';
				//document.body.removeChild(document.getElementById('bufferingmessage'));
		}, 1000);
		//}
	} catch (e) {
		TVB.error("Player: removeBufferingMessage: " + e.message);
	}
}

TVB.player.removeErrorMessage = function() {
	try {
		TVB.log("Player: removeErrorMessage()");
		setTimeout(function() {
			if(document.getElementById('tvbplayererrormessage'))
				document.getElementById('tvbplayererrormessage').innerHTML = '';
		}, 1000);
	} catch (e) {
		TVB.error("Player: removeErrorMessage: " + e.message);
	}
}

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
		TVB.error("Player: disableRemote:" + e.message);
		return false;
	}
}

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
		TVB.error("Player: enableRemote:" + e.message);
		return false;
	}
}
