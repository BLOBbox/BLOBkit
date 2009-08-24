/**
 * Graphical Widgets
 * @module widgets
 * @namespace TVB
 * @title Graphical Widgets
 * @requires tvblob, system
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

if (typeof TVB.widget == "undefined" || !TVB.widget) {
  	/**
	 * TVBLOB's widget class
	 * @class widget
	 * @namespace TVB
	 * @classDescription TVBLOB's widget class
	 * @static
	 */
    TVB.widget = {};
}


/**
 * DOM object handlers 
 * @method colorButtonsBarHandler
 * @private
 */
TVB.widget.colorButtonsBarHandler = null;
/**
 * DOM object handlers 
 * @method colorButtonsBarB1Handler
 * @private
 */
TVB.widget.colorButtonsBarB1Handler = null;
/**
 * DOM object handlers 
 * @method colorButtonsBarB2Handler
 * @private
 */
TVB.widget.colorButtonsBarB2Handler = null;
/**
 * DOM object handlers 
 * @method colorButtonsBarB3Handler
 * @private
 */
TVB.widget.colorButtonsBarB3Handler = null;
/**
 * DOM object handlers 
 * @method colorButtonsBarB4Handler
 * @private
 */
TVB.widget.colorButtonsBarB4Handler = null;

/**
 * Add a new color buttons bar widget to the page (if doesn't exist),
 * and set the label of the four buttons
 * @method colorButtonsBar
 * @param	{String}	butt1	Description for RED button
 * @param	{String}	butt2	Description for GREEN button
 * @param	{String}	butt3	Description for YELLOW button
 * @param	{String}	butt4	Description for BLUE button
 */
TVB.widget.colorButtonsBar = function(butt1, butt2, butt3, butt4) {
	try {		
		TVB.log("Widget: colorButtonsBar(" + butt1 + ", " + butt2 + ", " + butt3 + ", " + butt4 + ")");
		if (document.getElementById('TVB.widget.colorButtonsBarHandler') === null) {
			TVB.log("Widget: drawing new color button bar");
			
			//var configWidth = 600;
			var configWidth = window.innerWidth - 80;
			var singleWidth = parseInt(configWidth / 4, 10);
			
			var baseUri = null;
			if (TVB.system.getFirmwareVersion() == "NON_TVBLOB") {
				baseUri = 'http://storage.tvblob.com/lib/resources/';
			} else {
				baseUri = 'file://gui/resources/themes/' + TVB.system.getVideoSystem() + '/consumer_v1/platform/icons/';
			}
			
			TVB.log("Widget: configWidth = " + configWidth);
			TVB.log("Widget: singleWidth = " + singleWidth);
			
			TVB.widget.colorButtonsBarHandler = document.createElement('div');
			TVB.widget.colorButtonsBarHandler.style.position = 'fixed';
			TVB.widget.colorButtonsBarHandler.style.overflow = 'hidden';
			TVB.widget.colorButtonsBarHandler.style.top = parseInt(window.innerHeight - 21, 10) + "px";
			TVB.widget.colorButtonsBarHandler.style.left = '0px';
			TVB.widget.colorButtonsBarHandler.style.width = window.innerWidth;
			TVB.widget.colorButtonsBarHandler.style.height = '21px';
			TVB.widget.colorButtonsBarHandler.style.fontSize = '19px';
			TVB.widget.colorButtonsBarHandler.style.fontFamily = 'Tiresias';
			TVB.widget.colorButtonsBarHandler.style.backgroundColor = '#000001';
			TVB.widget.colorButtonsBarHandler.style.color = '#cccccc';
			TVB.widget.colorButtonsBarHandler.style.margin = 0;
			TVB.widget.colorButtonsBarHandler.style.padding = 0;
			TVB.widget.colorButtonsBarHandler.style.zIndex = '1000';
			TVB.widget.colorButtonsBarHandler.id = 'TVB.widget.colorButtonsBarHandler';
			document.body.appendChild(TVB.widget.colorButtonsBarHandler);
			
			TVB.widget.colorButtonsBarB1Handler = document.createElement('div');
			TVB.widget.colorButtonsBarB1Handler.style.position = 'absolute';
			TVB.widget.colorButtonsBarB1Handler.style.width = (singleWidth - 21) + 'px';
			TVB.widget.colorButtonsBarB1Handler.style.height = '21px';
			TVB.widget.colorButtonsBarB1Handler.style.top = '0px';
			TVB.widget.colorButtonsBarB1Handler.style.left = ((singleWidth * 0) + 40) + 'px';
			TVB.widget.colorButtonsBarB1Handler.style.backgroundPosition = 'top left';
			TVB.widget.colorButtonsBarB1Handler.style.backgroundRepeat = 'no-repeat';
			TVB.widget.colorButtonsBarB1Handler.style.backgroundImage = 'url("' + baseUri + 'button_red.png")';
			TVB.widget.colorButtonsBarB1Handler.style.paddingLeft = '21px';
			TVB.widget.colorButtonsBarB1Handler.style.paddingTop = '0px';
			TVB.widget.colorButtonsBarB1Handler.style.fontSize = '19px';
			TVB.widget.colorButtonsBarHandler.appendChild(TVB.widget.colorButtonsBarB1Handler);
			
			TVB.widget.colorButtonsBarB2Handler = document.createElement('div');
			TVB.widget.colorButtonsBarB2Handler.style.position = 'absolute';
			TVB.widget.colorButtonsBarB2Handler.style.width = (singleWidth - 21) + 'px';
			TVB.widget.colorButtonsBarB2Handler.style.height = '21px';
			TVB.widget.colorButtonsBarB2Handler.style.top = '0px';
			TVB.widget.colorButtonsBarB2Handler.style.left = ((singleWidth * 1) + 40) + 'px';
			TVB.widget.colorButtonsBarB2Handler.style.backgroundPosition = 'top left';
			TVB.widget.colorButtonsBarB2Handler.style.backgroundRepeat = 'no-repeat';
			TVB.widget.colorButtonsBarB2Handler.style.backgroundImage = 'url("' + baseUri + 'button_green.png")';
			TVB.widget.colorButtonsBarB2Handler.style.paddingLeft = '21px';
			TVB.widget.colorButtonsBarB2Handler.style.fontSize = '19px';
			TVB.widget.colorButtonsBarB2Handler.style.paddingTop = '0px';			
			TVB.widget.colorButtonsBarHandler.appendChild(TVB.widget.colorButtonsBarB2Handler);
			
			TVB.widget.colorButtonsBarB3Handler = document.createElement('div');
			TVB.widget.colorButtonsBarB3Handler.style.position = 'absolute';
			TVB.widget.colorButtonsBarB3Handler.style.width = (singleWidth - 21) + 'px';
			TVB.widget.colorButtonsBarB3Handler.style.height = '21px';
			TVB.widget.colorButtonsBarB3Handler.style.top = '0px';
			TVB.widget.colorButtonsBarB3Handler.style.left = ((singleWidth * 2) + 40) + 'px';
			TVB.widget.colorButtonsBarB3Handler.style.backgroundPosition = 'top left';
			TVB.widget.colorButtonsBarB3Handler.style.backgroundRepeat = 'no-repeat';
			TVB.widget.colorButtonsBarB3Handler.style.backgroundImage = 'url("' + baseUri + 'button_yellow.png")';
			TVB.widget.colorButtonsBarB3Handler.style.paddingLeft = '21px';
			TVB.widget.colorButtonsBarB3Handler.style.paddingTop = '0px';
			TVB.widget.colorButtonsBarB3Handler.style.fontSize = '19px';
			TVB.widget.colorButtonsBarHandler.appendChild(TVB.widget.colorButtonsBarB3Handler);
			
			TVB.widget.colorButtonsBarB4Handler = document.createElement('div');
			TVB.widget.colorButtonsBarB4Handler.style.position = 'absolute';
			TVB.widget.colorButtonsBarB4Handler.style.width = (singleWidth - 21) + 'px';
			TVB.widget.colorButtonsBarB4Handler.style.height = '21px';
			TVB.widget.colorButtonsBarB4Handler.style.top = '0px';
			TVB.widget.colorButtonsBarB4Handler.style.left = ((singleWidth * 3) + 40) + 'px';
			TVB.widget.colorButtonsBarB4Handler.style.backgroundPosition = 'top left';
			TVB.widget.colorButtonsBarB4Handler.style.backgroundRepeat = 'no-repeat';
			TVB.widget.colorButtonsBarB4Handler.style.backgroundImage = 'url("' + baseUri + 'button_blue.png")';
			TVB.widget.colorButtonsBarB4Handler.style.paddingLeft = '21px';
			TVB.widget.colorButtonsBarB4Handler.style.paddingTop = '0px';
			TVB.widget.colorButtonsBarB4Handler.style.fontSize = '19px';
			TVB.widget.colorButtonsBarHandler.appendChild(TVB.widget.colorButtonsBarB4Handler);
		}
		
		if (butt1 === null) {
			butt1 = '';
		}

		if (butt2 === null) {
			butt2 = '';
		}

		if (butt3 === null) {
			butt3 = '';
		}

		if (butt4 === null) {
			butt4 = '';
		}
		
		TVB.widget.colorButtonsBarB1Handler.innerHTML = butt1.toUpperCase();
		TVB.widget.colorButtonsBarB2Handler.innerHTML = butt2.toUpperCase();
		TVB.widget.colorButtonsBarB3Handler.innerHTML = butt3.toUpperCase();
		TVB.widget.colorButtonsBarB4Handler.innerHTML = butt4.toUpperCase();
		
	} catch (e) {
		TVB.error("Widget: colorButtonsBar: " + e.message);
		throw e;
	}	
};

/**
 * Removes the color buttons bar widget from the DOM
 * @method colorButtonsBarRemove
 */
TVB.widget.colorButtonsBarRemove = function() {
	try {
		TVB.log("Color Buttons Bar: remove");
		if (document.getElementById('TVB.widget.colorButtonsBarHandler') !== undefined) {
			document.body.removeChild(TVB.widget.colorButtonsBarHandler);
		}
	} catch (e) {
		TVB.error("Widget: colorButtonsBar: " + e.message);
		throw e;
	}
};

/**
 * Handles remote control feedback.
 * It is reserved for future uses.
 * @method colorButtonsBarRemote
 * @private
 * @param	{Object}	o	Object for the callback
 */
TVB.widget.colorButtonsBarRemote = function(o) {
	try {
		TVB.log("Widget: colorButtonsBarRemote " + o.keyName);
	} catch (e) {
		TVB.error("Widget: colorButtonsBarRemote: " + e.message);
		throw e;
	}
};

/**
 * Display or hide the loading dongle on the task bar
 * @method setLoading
 * @param	{Boolean}	loadingState
 */
TVB.widget.setLoading = function(loadingState) {
	try {
		TVB.log("Widget: setLoading(" + loadingState + ")");
		if (typeof tvblob != 'undefined') {
			tvblob.setLoading(loadingState);
		}
	} catch (e) {
		TVB.error("Widget: setLoading: " + e.message);
	}
};

/**
 * Display a pop up with the text in it, and two options: YES or NO
 * @param {String} text The text to be written on the yes/no widget
 * @param {Function} callback
 * @param {Boolean} [default_value] true to set Yes as the default, false otherwise
 */
TVB.widget.yesno = function(text, callback, default_value) {
	try {
		TVB.log("Widget: yesno('" + text + "', " + default_value + ")");
		
		var yesno = document.createElement('div');
		yesno.style.backgroundColor = 'black';
		yesno.style.border = '2px solid #999';
		yesno.style.position = 'absolute';
		yesno.style.zIndex= '31000';

		// centering popup		
		var desired_width = '300';
		yesno.style.width = desired_width + 'px';
		var viewportwidth = window.innerWidth;
		var viewportheight = window.innerHeight;
		var left = (viewportwidth - desired_width) / 2;
		yesno.style.left = left + 'px';

		var inner_text = document.createElement('p');
		inner_text.innerHTML = text;
		inner_text.style.padding = '5px';
		inner_text.className = 'TVB_yesno_text';
		yesno.appendChild(inner_text);

		var menu = document.createElement('div');
		menu.style.textAlign = 'center';
		menu.style.width = '300px';
		yesno.appendChild(menu);

		var myMenuData = [
		{ title: 'YES', value: true }, 
		{ title: 'NO', value: false }
		];
		
		var menuConfig = {
			menuName: 'TVByesnoMenu',
			visibleElements: 2,
			numElements: 2,
			updateMode: 'manipulate',
			disableChannelDown: true,
			drawSingleLineCB: function(line) {
				var elem = document.createElement('div');
				elem.style.backgroundColor = 'black';
				elem.style.color = 'white';
				elem.innerHTML = myMenuData[line].title;
				elem.style.marginLeft = '0px';
				elem.style.width = '80px';
				elem.style.textAlign = 'center';
				elem.style.cssFloat = 'left';
				return elem;
			},
			onSelectCB: function(line) {
				myMenu.deactivate();
				callback(myMenuData[line].value);
				yesno.style.position = 'relative';
				document.body.removeChild(yesno);
			},
			onFocusCB: function(obj, line) {
				obj.style.backgroundColor = 'white';
				obj.style.color = 'black';
			},
			onBlurCB: function(obj, line) {
				obj.style.backgroundColor = 'black';
				obj.style.color = 'white';
			},
			onUpdateCB: function(obj, line) {
			}
		};
		
		var myMenu = new TVB.menu(menuConfig);
		menu.appendChild(myMenu.get());


		yesno.style.top = '160px';
		yesno.className = 'TVB_yesno';
		yesno.style.visibility = 'hidden';
		document.body.appendChild(yesno);

		var desired_height = yesno.clientHeight;
		var top = (viewportheight - desired_height) / 2;
		yesno.style.top = top + 'px';
		yesno.style.visibility = 'visible';
		
		TVB.log("Working height dopo: " + desired_height);
		TVB.log("Width: " + viewportwidth + " - Height: " + viewportheight);
	} catch (e) {
		TVB.error("Widget: yesno: " + e.message);
		throw e;
	}	
};

/**
 * Change the color of the selected cursor in the browser.<br />
 * The codes are 4 bytes: alpha red green blue<br />
 * In alpha, FF is opaque, 00 transparent
 * @method setSelectedCursorColor
 * @param {String} selectedColorCode ARGB color string
 */
TVB.widget.setSelectedCursorColor = function(selectedColorCode) {
	try {
		TVB.log("Widget: setSelectedCursorColor(" + selectedColorCode + ")");
		if (typeof tvblob != 'undefined') {
			tvblob.setSelectedCursorColor(selectedColorCode);
		}
	} catch (e) {
		TVB.error("Widget: setSelectedCursorColor: " + e.message);
	}
};

/**
 * Change the color of the highlighted cursor in the browser.<br />
 * The codes are 4 bytes: alpha red green blue<br />
 * In alpha, FF is opaque, 00 transparent
 * @method setHighlightCursorColor
 * @param {String} selectedColorCode ARGB color string
 */
TVB.widget.setHighlightCursorColor = function(selectedColorCode) {
	try {
		TVB.log("Widget: setHighlightCursorColor(" + selectedColorCode + ")");
		if (typeof tvblob != 'undefined') {
			tvblob.setHighlightCursorColor(selectedColorCode);
		}
	} catch (e) {
		TVB.error("Widget: setHighlightCursorColor: " + e.message);
	}
};

/**
 * Set browser's label (only for trusted applications)
 * @method setLabel
 * @param {String} message The message for the label bar
 */
TVB.widget.setLabel = function(message) {
	try {
		// puoi controlare per feature "tvblob" version "1.3"
		TVB.log("Widget: setLabel(" + message + ")");
		if (typeof tvblob != 'undefined') {
			tvblob.setLabel(message);
		}
	} catch (e) {
		TVB.error("Widget: setLabel: " + e.message);
	}
};

/**
 * Add a message on the button bar, lasts 5 seconds on the screen
 * @method messageBar
 * @param {String} message Message to be shown
 */
TVB.widget.messageBar = function(message) {
	try {		
		TVB.log("Widget: messageBar(" + message + ")");
		if (document.getElementById('TVB.widget.messageBarHandler') === null) {
			var configWidth = 600;
			var singleWidth = configWidth / 4;
			
			var baseUri = null;
			if (TVB.system.getFirmwareVersion() == "NON_TVBLOB") {
				baseUri = 'http://storage.tvblob.com/lib/resources/';
			} else {
				baseUri = 'file://gui/resources/themes/' + TVB.system.getVideoSystem() + '/consumer_v1/platform/icons/';
			}
			
			TVB.log("Widget: configWidth = " + configWidth);
			TVB.log("Widget: singleWidth = " + singleWidth);
			
			TVB.widget.messageBarHandler = document.createElement('div');
			TVB.widget.messageBarHandler.style.position = 'absolute';
			if (TVB.system.getVideoSystem() == "NTSC") {
				TVB.widget.messageBarHandler.style.top = '400px'; // 78 meno di PAL
			} else {
				TVB.widget.messageBarHandler.style.top = '478px';
			}
			TVB.widget.messageBarHandler.style.left = '40px';
			TVB.widget.messageBarHandler.style.width = configWidth + 'px';
			TVB.widget.messageBarHandler.style.height = '21px';
			TVB.widget.messageBarHandler.style.fontSize = '19px';
			TVB.widget.messageBarHandler.style.fontFamily = 'Tiresias';
			TVB.widget.messageBarHandler.style.backgroundColor = '#000001';
			TVB.widget.messageBarHandler.style.zIndex = '31000';
			TVB.widget.messageBarHandler.id = 'TVB.widget.messageBarHandler';
			TVB.widget.messageBarHandler.innerHTML = message;
			document.body.appendChild(TVB.widget.messageBarHandler);

			setTimeout( function() {
						TVB.widget.messageBarRemove();
			}, 5000);
		}
	} catch (e) {
		TVB.error("Widget: messageBar: " + e.message);
		throw e;
	}	
};

/**
 * Removes the message bar widget from the DOM
 * @method messageBarRemove
 */
TVB.widget.messageBarRemove = function() {
	try {
		TVB.log("Widget: messageBarRemove()");
		if (document.getElementById('TVB.widget.messageBarHandler') !== undefined) {
			document.body.removeChild(TVB.widget.messageBarHandler);
		}
	} catch (e) {
		TVB.error("Widget: messageBar: " + e.message);
		throw e;
	}
};

/**
 * @method titleBarHandler
 * @private
 */
TVB.widget.titleBarHandler = function() {
	try {

		if (window.innerHeight !== null) {
			this.iwc = window.innerWidth;
		} else {
			this.iwc = 974; /* 16/9 fixed */
		}

		/**
		 * DOM object handlers - bar
		 * @method titleBar.bar
		 * @private
		 */
		this.bar = document.createElement('div');
		this.bar.style.backgroundColor = "#212121";
		this.bar.style.position = 'absolute';
		this.bar.style.bottom = "0px";
		this.bar.style.left = "0px";
		this.bar.style.height = "28px";
		this.bar.style.width = parseInt(this.iwc, 10) + "px";		
		
		/**
		 * DOM object handlers - logo
		 * @method titleBar.logo
		 * @private
		 */
		this.logo = document.createElement('div');
		this.logo.style.backgroundColor = 'transparent';
		this.logo.style.backgroundPosition = 'top left';
		this.logo.style.backgroundRepeat = 'no-repeat';
		this.logo.style.backgroundImage = "url('http://www.blobforge.com/static/lib/resources/lfb.png')";
		this.logo.style.position = 'absolute';
		this.logo.style.top = "0px";
		this.logo.style.right = "20px";
		this.logo.style.width = "109px";
		this.logo.style.height = "72px";

		/**
		 * DOM object handlers - title
		 * @method titleBar.title
		 * @private
		 */
		this.title = document.createElement('div');
		this.title.style.position = 'absolute';
		this.title.style.top = "44px";
		this.title.style.left = "40px";
		this.title.style.width = parseInt(window.innerWidth - 169, 10) + "px";// (40 + 20 + 109)
		this.title.style.fontSize = "23pt";
		this.title.style.fontFamily = "TVBLOB, TireriasScreen, Tiresias, sans-serif";
		this.title.style.color = '#cccccc';
		this.title.style.overflow = 'hidden';
		this.title.innerHTML = '&nbsp;';

		/**
		 * DOM object handlers - icon
		 * @method titleBar.icon
		 * @private
		 */
		this.icon = document.createElement('div');
		this.icon.style.position = 'absolute';
		this.icon.style.top = "0px";
		this.icon.style.left = "40px";
		this.icon.style.height = "72px";
		this.icon.style.width = "100px";
		this.icon.style.backgroundColor = 'transparent';
		this.icon.style.overflow = 'hidden';

		/**
		 * DOM object handlers
		 * @method titleBar.handler
		 * @private
		 */
		this.handler = document.createElement('div');
		this.handler.id = 'TVB.widget.titleHandler';
		this.handler.style.backgroundColor = "#000001";
		this.handler.style.position = 'fixed';
		this.handler.style.top = "0px";
		this.handler.style.left = "0px";
		this.handler.style.height = "72px";
		this.handler.style.width = parseInt(this.iwc, 10) + "px";
		this.handler.style.overflow = 'hidden';
		this.handler.style.zIndex = 100;
		this.handler.appendChild(this.bar);
		this.handler.appendChild(this.logo);
		this.handler.appendChild(this.icon);
		this.handler.appendChild(this.title);
		
		/**
		 * Renders the title bar on the TV screen
		 * @method titleBar.render
		 */
		this.render = function() {
			try {
				TVB.log("Widget: titleBar.render()");
				if (document.getElementById('TVB.widget.titleHandler') === null) {
					if (document.body.firstChild === null) {
						document.body.appendChild(this.handler);
					} else {
						document.body.insertBefore(this.handler, document.body.firstChild);
					}
				}
				YAHOO.util.Event.onDOMReady(function(){
					document.body.style.paddingTop = "72px";
				});
			} catch (e) {
				TVB.error("Widget: titleBar: render: " + e.message);
				throw e;
			}			
		};
		
		/**
		 * Removes the title bar from the TV screen
		 * @method titleBar.remove
		 */
		this.remove = function() {
			try {
				TVB.log("Widget: titleBar.remove()");
				if (document.getElementById('TVB.widget.titleHandler') !== null) {
					document.body.removeChild(document.getElementById('TVB.widget.titleHandler'));
				}
			} catch (e) {
				TVB.error("Widget: titleBar: remove: " + e.message);
				throw e;
			}
		};
		
		/**
		 * Sets or changes the text for the title bar
		 * @method titleBar.setTitle
		 * @param {String} title A string containing the title; html is suggested not to be used. The string will be trimmed to the right size. Please, try the string on 4/3 PAL displays!!!
		 */
		this.setTitle = function(title) {
			try {
				TVB.log("Widget: titleBar.setTitle(" + title + ")");
				this.title.innerHTML = title.toUpperCase();
			} catch (e) {
				TVB.error("Widget: titleBar: setTitle: " + e.message);
				throw e;
			}
		};
		
		/**
		 * @method titleBar.setIcon
		 * @param {String} iconUrl The url of an icon file to be displayed in the very beginning of the titleBar. The icon will be resized to a height of 72px, and a variable width.
		 */
		this.setIcon = function(iconUrl) {
			try {
				TVB.log("Widget: titleBar.setIcon(" + iconUrl + ")");
				//this.icon.innerHTML = "<img src='" + iconUrl + "' id='imggg' alt='Icon' height=72 />";
				
				var ic = document.createElement('img');
				ic.src = iconUrl;
				ic.style.height = "72px";
				ic.alt = 'Icon';
				ic.id = "TVB.widget.titleBar.icon.firstChild";
				this.icon.appendChild(ic);
				
				YAHOO.util.Event.onContentReady("TVB.widget.titleBar.icon.firstChild", function(){
					try {
						var iw = TVB.widget.titleBar.icon.firstChild.offsetWidth;
						var tl = parseInt(iw, 10) + 50;
						var tw = window.innerWidth - 179 - parseInt(iw, 10);
						TVB.widget.titleBar.title.style.left = parseInt(tl, 10) + "px";
						TVB.widget.titleBar.title.style.width = parseInt(tw, 10) + "px";
					} catch (e) {
						TVB.error(e.message);
					}
				});
				
			} catch (e) {
				TVB.error("Widget: titleBar: setIcon: " + e.message);
				throw e;
			}
		};
		
		/**
		 * Changes the logo on the left side of the title bar from "for BLOBbox" to "BLOBbox" only.
		 * @method titleBar.setLogo
		 * @param {Boolean} isTVBLOB true if the web site is developed by TVBLOB, false if the application is build for BLOBbox by third party developers
		 * @private
		 */
		this.setLogo = function(isTVBLOB) {
			try {
				TVB.log("Widget: titleBar.setLogo(" + isTVBLOB + ")");
				if (isTVBLOB === true) {
					this.logo.style.backgroundImage = "url('http://www.blobforge.com/static/lib/resources/lbb.png')";
				} else {
					this.logo.style.backgroundImage = "url('http://www.blobforge.com/static/lib/resources/lfb.png')";
				}
			} catch (e) {
				TVB.error("Widget: titleBar: setLogo: " + e.message);
				throw e;
			}
		};
		
		/**
		 * Sets the position of the title bar to fixed (strongly recommended). When scrolling a page, the title bar doesn't move
		 * @method titleBar.setFixedPosition
		 */
		this.setFixedPosition = function() {
			try {
				TVB.log("Widget: titleBar.setFixedPosition()");
				this.handler.style.position = 'fixed';
			} catch (e) {
				TVB.error("Widget: titleBar: setFixedPosition: " + e.message);
				throw e;
			}
		};

		/**
		 * Sets the position of the title bar to absolute: when scrolling a page, the title bar moves within the rest of the page
		 * @method titleBar.setAbsolutePosition
		 */
		this.setAbsolutePosition = function() {
			try {
				TVB.log("Widget: titleBar.setAbsolutePosition()");
				this.handler.style.position = 'absolute';
			} catch (e) {
				TVB.error("Widget: titleBar: setAbsolutePosition: " + e.message);
				throw e;
			}
		};

		/**
		 * Changes the background color of the title bar
		 * @method titleBar.setBackgroundColor
		 */
		this.setBackgroundColor = function(color) {
			try {
				TVB.log("Widget: titleBar.setBackgroundColor(" + color + ")");
				this.bar.style.backgroundColor = color;
			} catch (e) {
				TVB.error("Widget: titleBar: setBackgroundColor: " + e.message);
				throw e;
			}
		};

		/**
		 * Changes the color of the text of title bar
		 * @method titleBar.setColor
		 */
		this.setColor = function(color) {
			try {
				TVB.log("Widget: titleBar.setColor(" + color + ")");
				this.title.style.color = color;
			} catch (e) {
				TVB.error("Widget: titleBar: setColor: " + e.message);
				throw e;
			}
		};

	} catch (e) {
		TVB.error("Widget: titleBar: " + e.message);
		throw e;
	}
};

/**
 * @method titleBar
 */
TVB.widget.titleBar = new TVB.widget.titleBarHandler();
