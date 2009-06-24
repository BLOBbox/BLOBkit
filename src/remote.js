/**
 * Remote Manager
 * @module remote
 * @namespace TVB
 * @title Remote Manager
 * @requires tvblob, system, event
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * TVBLOB's remote control class; initialize the Remote Control
 * @class remote
 * @classDescription TVBLOB's remote control class
 * @constructor
 * @return {Void}
 */
TVB.remote = function() {
	try {
		TVB.log("Remote: __constructor__()");
		if (typeof BlobRemoteControl == undefined) {
			throw {message: "BlobRemoteControl is not available on this browser"};
		} else {
			TVB.remote.rc = new BlobRemoteControl();
			
			for (var i = 0; i < TVB.remote.btns.length; i++) {
				TVB.remote.rc.setKeyHandler(TVB.remote.btns[i], "TVB.remote.handler");
			}
		}
		return;
	} catch (e) {
		TVB.error("Remote: __constructor__: " + e.message);
	}
};

/**
 * Handler the low level remote control
 * @method rc
 * @private
 */
TVB.remote.rc = {};

TVB.remote.prototype = {
	rh: null,
	eh: null,
	oSelf: this,
	lastButton: null,
}

/**
 * TVBLOB's remote buttons class
 * @method buttons
 * @private
 */
TVB.remote.buttons = {};

try {
	/**
	 * Contains the list of all the buttons that belongs to the VCR area
	 * @final btns_vcr
	 */
	TVB.remote.btns_vcr = ['RECORD', 'PAUSE', 'REWIND', 'PLAY', 'PLAY_PAUSE', 'FAST_FORWARD', 'SKIP_BACKWARD', 'SKIP_FORWARD', 'STOP'];
	/**
	 * Contains the list of all the buttons that belongs to the COLOR area
	 * @final btns_color
	 */
	TVB.remote.btns_color = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
	/**
	 * Contains the list of all the buttons that belongs to the LETTERS area
	 * @final btns_letters
	 */
	TVB.remote.btns_letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'HASH', 'STAR'];
	/**
	 * Contains the list of all the buttons that belongs to the NAV area
	 * @final btns_nav
	 */
	TVB.remote.btns_nav = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'OK', 'BACK', 'HELP', 'TOOLS', 'INFO'];
	/**
	 * Contains the list of all the buttons that belongs to the MORE area
	 * @final btns_more
	 */
	TVB.remote.btns_more = ['VOTE', 'CHANNEL_UP', 'CHANNEL_DOWN', 'BACKSPACE'];
	/**
	 * Contains the list of all the buttons that belongs to all areas
	 * @final btns
	 */
	TVB.remote.btns = TVB.remote.btns_color.concat(TVB.remote.btns_letters.concat(TVB.remote.btns_vcr.concat(TVB.remote.btns_nav.concat(TVB.remote.btns_more))));
	
	TVB.remote.buttons.ALL = TVB.CustomEvent.createEvent('remote');
	TVB.remote.buttons.VCR = TVB.CustomEvent.createEvent('remote_vcr');
	TVB.remote.buttons.NAV = TVB.CustomEvent.createEvent('remote_nav');
	TVB.remote.buttons.LETTER = TVB.CustomEvent.createEvent('remote_letter');
	TVB.remote.buttons.COLOR = TVB.CustomEvent.createEvent('remote_color');
	
	TVB.remote.button = [];
	for (var i = 0; i < TVB.remote.btns.length; i++) {
		TVB.remote.button[TVB.remote.btns[i]] = TVB.CustomEvent.createEvent('button_' + TVB.remote.btns[i]);
	}
} catch (e) {
	TVB.error("Remote: __constructor__: " + e.message);
}

/**
 * Handler function for the remote controll
 * When a button is pressed, it launches the event
 * TVB.remote.buttons.ALL.
 * 
 * Relatively to the area of the remote control, the events
 * TVB.remote.buttons.VCR,
 * TVB.remote.buttons.NAV,
 * TVB.remote.buttons.LETTER or
 * TVB.remote.buttons.COLOR
 * may be launched.
 * 
 * It launches also a TVB.remote.button[keyName]
 * where keyName is the name of the key.
 * @method handler
 * @param {Object} o Object passed by the callback
 * @private
 */
TVB.remote.handler = function(o) {
	try {
		TVB.log("Remote: handler(" + o.keyName + ")");
		var params = {
			keyName: o.keyName,
			previousKeyName: TVB.remote.lastButton
		};
		TVB.remote.lastButton = o.keyName;
		
		TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
		
		// if it is a VCR button, send the remote_vcr event
		for (var i = 0; i < TVB.remote.btns_vcr.length; i++) {
			if (o.keyName == TVB.remote.btns_vcr[i]) {
				TVB.CustomEvent.fireEvent(TVB.remote.buttons.VCR, params);
			}
		}
		
		// if it is a NAV button, send the remote_nav event
		for (var i = 0; i < TVB.remote.btns_nav.length; i++) 
		{
			if (o.keyName == TVB.remote.btns_nav[i]) 
			{
				TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			}
		}
		
		// if it is a LETTER button, send the remote_letter event
		for (var i = 0; i < TVB.remote.btns_letters.length; i++) {
			if (o.keyName == TVB.remote.btns_letters[i]) {
				TVB.CustomEvent.fireEvent(TVB.remote.buttons.LETTER, params);
			}
		}
		
		// if it is a COLOR button, send the remote_color event
		for (var i = 0; i < TVB.remote.btns_color.length; i++) {
			if (o.keyName == TVB.remote.btns_color[i]) {
				TVB.CustomEvent.fireEvent(TVB.remote.buttons.COLOR, params);
			}
		}
		
		TVB.CustomEvent.fireEvent(TVB.remote.button[o.keyName], params);
		
		if (TVB.remote.getGreenRefreshStatus() == true && o.keyName == 'GREEN') {
			TVB.system.refresh();
		} else if (TVB.remote.getBackStatus() == true && o.keyName == 'BACK') {
			tvblob.goBackOrExitBrowser();
		} 
	} catch (e) {
		TVB.error("Remote: handler: " + e.message);
	}
}

/**
 * Returns the name of the last button
 * that has been pushed on the remote control.
 * @method getLastButtonPressed
 * @return {String}	The name of the button
 */
TVB.remote.getLastButtonPressed = function() {
	try {
		TVB.log("Remote: getLastButtonPressed() -> " + TVB.remote.lastButton);
		return TVB.remote.lastButton;
	} catch (e) {
		TVB.error("Remote: getLastButtonPressed: " + e.message);
		return null;
	}
}

/**
 * Remote control configuration variables
 * @method config
 * @private
 */
TVB.remote.config = {
	/*
	 * True if the BACK button acts in standard way
	 * @config back
	 * @type Boolean
	 * @default true
	 */
	back: true,
	/*
	 * True if the GREEN button acts in standard way
	 * @config refresh
	 * @type Boolean
	 * @default true
	 */
	refresh: true,
	/*
	 * True if remote does not fire events when pressing Left / Right buttons
	 * @config disableLeftRight
	 * @type Boolean
	 * @default false
	 */
	disableLeftRight : false,
	/*
	 * True if remote does not fire events when pressing Up / Down buttons
	 * @config disableUpDown
	 * @type Boolean
	 * @default false
	 */
	disableUpDown : false,
	/*
	 * True if remote does not fire events when pressing letters buttons
	 * @config disableLetters
	 * @type Boolean
	 * @default false
	 */
	disableLetters : false,
	/*
	 * True if remote does not fire events when pressing OK
	 * @config disableOk
	 * @type Boolean
	 * @default false
	 */
	disableOk : false,
}

/**
 * Enables the use of the green button to refresh
 * current page.
 * @method enableGreenRefresh
 */
TVB.remote.enableGreenRefresh = function() {
	try {
		TVB.log("Remote: enableGreenRefresh()");
		TVB.remote.config.refresh = true;
	} catch (e) {
		TVB.error("Remote: enableGreenRefresh: " + e.message);
	}
}

/**
 * Disable the use of the green button to refresh
 * current page.
 * @method disableGreenRefresh
 */
TVB.remote.disableGreenRefresh = function() {
	try {
		TVB.log("Remote: disableGreenRefresh()");
		TVB.remote.config.refresh = false;
	} catch (e) {
		TVB.error("Remote: disableGreenRefresh: " + e.message);
	}
}

/**
 * Enable the use of the OK buttons in the 
 * current page.
 * @method enableOk
 */
TVB.remote.enableOk = function() 
{
	try {
		TVB.log("Remote: enableOk()");
		if (TVB.remoteHandler == undefined)
			TVB.remoteInit();

		TVB.remote.config.disableOk= true;
				
		TVB.remote.rc.setKeyHandler('OK', "TVB.remote.handler");

	} catch (e) {
		TVB.error("Remote: disableOk: " + e.message);
	}
}

/**
 * Disable the use of the Ok buttons in the 
 * current page.
 * @method disableOk
 */
TVB.remote.disableOk = function() {
	try {
		TVB.log("Remote: disableOk()");
		if (TVB.remoteHandler == undefined)
			TVB.remoteInit();

		TVB.remote.config.disableOk= true;

		TVB.remote.rc.removeKeyHandler('OK');

	} catch (e) {
		TVB.error("Remote: disableOk: " + e.message);
	}
}

/**
 * Enable the use of the nav buttons in the 
 * current page.
 * @method enableNav
 */
TVB.remote.enableNav = function() 
{
	try {
		TVB.log("Remote: enableNav()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableLeftRight = true;
				
		TVB.remote.rc.setKeyHandler('UP', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('DOWN', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('LEFT', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('RIGHT', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('OK', "TVB.remote.handler");

	} catch (e) {
		TVB.error("Remote: enableNav: " + e.message);
	}
}

/**
 * Disable the use of the nav buttons in the 
 * current page.
 * @method disableNav
 */
TVB.remote.disableNav = function() {
	try {
		TVB.log("Remote: disableNav()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableLeftRight = true;

		TVB.remote.rc.removeKeyHandler('UP');
		TVB.remote.rc.removeKeyHandler('DOWN');
		TVB.remote.rc.removeKeyHandler('LEFT');
		TVB.remote.rc.removeKeyHandler('RIGHT');
		TVB.remote.rc.removeKeyHandler('OK');

	} catch (e) {
		TVB.error("Remote: disableNav: " + e.message);
	}
}


/**
 * Enable the use of the up / down buttons in the 
 * current page.
 * @method enableUpDown
 */
TVB.remote.enableUpDown = function() 
{
	try {
		TVB.log("Remote: disableUpDown()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableUpDown = true;
				
		TVB.remote.rc.setKeyHandler('UP', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('DOWN', "TVB.remote.handler");

	} catch (e) {
		TVB.error("Remote: disableUpDown: " + e.message);
	}
}

/**
 * Disable the use of the up / down buttons in the 
 * current page.
 * @method disableUpDown
 */
TVB.remote.disableUpDown = function() 
{
	try {
		TVB.log("Remote: disableUpDown()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableUpDown = true;

		TVB.remote.rc.removeKeyHandler('UP');
		TVB.remote.rc.removeKeyHandler('DOWN');

	} catch (e) {
		TVB.error("Remote: disableUpDown: " + e.message);
	}
}

/**
 * Enable the use of the left / right buttons in the 
 * current page.
 * @method enableLeftRight
 */
TVB.remote.enableLeftRight = function() 
{
	try {
		TVB.log("Remote: disableLeftRight()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableLeftRight = true;
				
		TVB.remote.rc.setKeyHandler('LEFT', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('RIGHT', "TVB.remote.handler");

	} catch (e) {
		TVB.error("Remote: disableLeftRight: " + e.message);
	}
}

/**
 * Disable the use of the left / right buttons in the 
 * current page.
 * @method disableLeftRight
 */
TVB.remote.disableLeftRight = function() 
{
	try {
		TVB.log("Remote: disableLeftRight()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableLeftRight = true;

		TVB.remote.rc.removeKeyHandler('LEFT');
		TVB.remote.rc.removeKeyHandler('RIGHT');

	} catch (e) {
		TVB.error("Remote: disableLeftRight: " + e.message);
	}
}

/**
 * Enable the use of letter keys in the 
 * current page.
 * @method enableLetters
 */
TVB.remote.enableLetters = function() 
{
	try {
		TVB.log("Remote: enableLetters()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableLetters= false;

		TVB.remote.rc.setKeyHandler('1', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('2', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('3', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('4', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('5', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('6', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('7', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('8', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('9', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('0', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('HASH', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('STAR', "TVB.remote.handler");
		TVB.remote.rc.setKeyHandler('BACKSPACE', "TVB.remote.handler");

	} catch (e) {
		TVB.error("Remote: enableLetters: " + e.message);
	}
}

/**
 * Disable the use of letter keys in the 
 * current page.
 * @method disableLetters
 */
TVB.remote.disableLetters = function() 
{
	try {
		TVB.log("Remote: disableLetters()");
		if (TVB.remoteHandler == undefined) {
			TVB.remoteInit();
		}
		TVB.remote.config.disableLetters= true;

		TVB.remote.rc.removeKeyHandler('1');
		TVB.remote.rc.removeKeyHandler('2');
		TVB.remote.rc.removeKeyHandler('3');
		TVB.remote.rc.removeKeyHandler('4');
		TVB.remote.rc.removeKeyHandler('5');
		TVB.remote.rc.removeKeyHandler('6');
		TVB.remote.rc.removeKeyHandler('7');
		TVB.remote.rc.removeKeyHandler('8');
		TVB.remote.rc.removeKeyHandler('9');
		TVB.remote.rc.removeKeyHandler('0');
		TVB.remote.rc.removeKeyHandler('HASH');
		TVB.remote.rc.removeKeyHandler('STAR');
		TVB.remote.rc.removeKeyHandler('BACKSPACE');

	} catch (e) {
		TVB.error("Remote: disableLetters: " + e.message);
	}
}

/**
 * Returns true if the page can be refreshed
 * automatically by pressing the green button
 * on the remote control
 * @method getGreenRefreshStatus
 * @return {Boolean}	true: green button automatically refresh page, false: doesn't
 */
TVB.remote.getGreenRefreshStatus = function() {
	try {
		TVB.log("Remote: getGreenRefreshStatus() -> " + TVB.remote.config.refresh);
		return TVB.remote.config.refresh;
	} catch (e) {
		TVB.error("Remote: getGreenRefreshStatus: " + e.message);
		throw e;
	}
}

/**
 * Enables the use of the back button.
 * @method enableBack
 */
TVB.remote.enableBack = function() {
	try {
		TVB.log("Remote: enableBack()");
		TVB.remote.config.back = true;
	} catch (e) {
		TVB.error("Remote: enableBack: " + e.message);
		throw e;
	}
}

/**
 * Disable the use of the back button.
 * @method disableBack
 */
TVB.remote.disableBack = function() {
	try {
		TVB.log("Remote: disableBack()");
		TVB.remote.config.back = false;
	} catch (e) {
		TVB.error("Remote: disableBack: " + e.message);
		throw e;
	}
}

/**
 * Returns true if the back button works
 * platform-like, false otherwise.
 * @method getBackStatus
 * @return {Boolean}
 */
TVB.remote.getBackStatus = function() {
	try {
		TVB.log("Remote: getBackStatus() -> " + TVB.remote.config.back);
		return TVB.remote.config.back;
	} catch (e) {
		TVB.error("Remote: getBackStatus: " + e.message);
		throw e;
	}
}

/**
 * Destroys the remote control and release
 * all the buttons to the default behaviour
 * @method destroy
 * @return	{Boolean}
 * @since	1.0
 */
TVB.remote.destroy = function() {
	try {
		TVB.log("Remote: destroy()");
		//for (var i = 0; i < TVB.remote.btns.length; i++) {
		//	TVB.remote.rc.removeKeyHandler(TVB.remote.btns[i]);
		//}
		TVB.remote.rc = new BlobRemoteControl();
		TVB.remote.rc = undefined;
		TVB.remoteHandler = undefined;
		delete TVB.remote.rc;
		delete TVB.remoteHandler;
		return true;
	} catch (e) {
		TVB.error("Remote: destroy: " + e.message);
		throw e;
	}
}

/**
 * Handles keyboard buttons
 * @param {Integer} keyunicode The unicode of a keyboard button
 */
TVB.remote.keyboard = function(keyunicode) {
	switch (keyunicode)
	{
		case 32:
		case 13:
			var params = {
				keyName: 'OK',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['OK'],params);
			break;
		case 37:
			var params = {
				keyName: 'LEFT',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['LEFT'],params);
			break;
		case 39:
			var params = {
				keyName: 'RIGHT',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['RIGHT'],params);
			break;
		case 38:
			var params = {
				keyName: 'UP',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['UP'],params);
			break;
		case 40:
			var params = {
				keyName: 'DOWN',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['DOWN'],params);
			break;
		case 63:
			var params = {
				keyName: 'HELP',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['HELP'],params);
			break;
		case 8:
			var params = {
				keyName: 'BACK',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.NAV, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['BACK'],params);
			break;
		case 113:
			var params = {
				keyName: 'RED',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.COLOR, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['RED'],params);
			break;
		case 119:
			var params = {
				keyName: 'GREEN',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.COLOR, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['GREEN'],params);
			break;
		case 101:
			var params = {
				keyName: 'YELLOW',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.COLOR, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['YELLOW'],params);
			break;
		case 114:
			var params = {
				keyName: 'BLUE',
				previousKeyName: TVB.remote.lastButton
			};

			TVB.CustomEvent.fireEvent(TVB.remote.buttons.ALL, params);
			TVB.CustomEvent.fireEvent(TVB.remote.buttons.COLOR, params);
			TVB.CustomEvent.fireEvent(TVB.remote.button['BLUE'],params);
			break;


	}


}

/**
 * Remote Handler
 * @class remoteHandler
 * @namespace TVB
 * @private
 */
TVB.remoteHandler = undefined;

/**
 * Initialize the TVBLOB Remote Control System
 * @class remoteInit
 * @namespace TVB
 * @static
 */
TVB.remoteInit = function() 
{
	var browser = TVB.getBrowserAgent();

	if (browser.espial == false && browser.blobkit == false)
	{
		document.onkeypress = function(e)
		{
			var e = window.event || e;
			var keyunicode = e.charCode || e.keyCode;
			TVB.remote.keyboard(keyunicode);
			TVB.log(keyunicode);
		} 
		
		return;
	}

	try 
	{
		if (TVB.remoteHandler == undefined) {
			TVB.log("Remote: remoteInit()");
			TVB.remoteHandler = new TVB.remote();
		} else {
			TVB.log("Remote: remoteInit() already inited");
			return false;
		}
	} catch (e) {
		TVB.log("Remote: remoteInit: " + e.message);
		throw e;
	} 
}
