/**
 * Graphical Menu Manager
 * @module gridmenu
 * @namespace TVB
 * @title Graphical Grid Menu Manager
 * @requires tvblob, system, event, remote
 * @author Emilio Sabatucci emilio.sabatucci@tvblob.com
 * @author Francesco Facconi francesco.facconi@tvblob.com
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * Constructor for the Menu Widget
 * @class gridmenu
 * @param {Object} config Configuration object, see user manual for specifications
 * @return {Object}
 * @constructor
 */
TVB.gridMenu = function(config) {
	try {
		TVB.log("Menu: __constructor");
		// configuration verification
		if (typeof(config.visibleElements) !== undefined && parseInt(config.visibleElements, 10) > 0) {
			this.visibleElements = config.visibleElements;
		} else {
			this.visibleElements = 4;
		}

		if (typeof(config.cols) !== undefined && parseInt(config.cols, 10) > 0) {
			this.cols = config.cols;
		} else {
			this.cols = 5;
		}

		if (typeof(config.numElements) !== undefined && parseInt(config.numElements, 10) > 0) {
			this.numElements = config.numElements;
		} else {
			throw {message: "Menu: numElements not defined"};
		}

		if (typeof(config.drawSingleCellCB) == 'function') {
			this.drawSingleCellCB = config.drawSingleCellCB;
		} else {
			throw {message: "Menu: drawSingleCellCB not defined"};
		}
		

		if (typeof(config.disableChannelUp) == 'boolean') {
			this.disableChannelUp = config.disableChannelUp;
		}
		if (typeof(config.disableChannelDown) == 'boolean') {
			this.disableChannelDown = config.disableChannelDown;
		}
		if (typeof(config.disableLeftRight) == 'boolean') {
			this.disableLeftRight = config.disableLeftRight;
		}
		if (typeof(config.disableUpDown) == 'boolean') {
			this.disableUpDown = config.disableUpDown;
		}
		if (typeof(config.disableOk) == 'boolean') {
			this.disableOk = config.disableOk;
		}

		if (typeof(config.onFocusCB) == 'function') {
			this.onFocusCB = config.onFocusCB;
		} else {
			this.onFocusCB = undefined;
		}

		if (typeof(config.onBlurCB) == 'function') {
			this.onBlurCB = config.onBlurCB;
		} else {
			this.onBlurCB = undefined;
		}

		if (typeof(config.onSelectCB) == 'function') {
			this.onSelectCB = config.onSelectCB;
		} else {
			this.onSelectCB = undefined;
		}

		if (typeof(config.onRemoteUpdateCB) == 'function') {
			this.onRemoteUpdateCB = config.onRemoteUpdateCB;
		} else {
			this.onRemoteUpdateCB = undefined;
		}

		if (typeof(config.menuName) == 'string') {
			this.menuName = config.menuName;
		} else {
			throw {message: "Menu: menuName not defined"};
		}

		if (typeof(config.menuType) == 'string') {
			switch (config.menuType) {
				case 'paged':
					this.menuType = 'paged';
					break;
				case 'dynamic':
					this.menuType = 'dynamic';
					break;
				case 'cilinder':
					throw {message: "Menu: menuType cilinder unimplemented"};
				default:
					throw {message: "Menu: menuType " + config.menuType + " is invalid"};
			}
		} else {
			this.menuType = 'paged';
		}

		if (typeof(config.updateMode) == 'string') {
			switch (config.updateMode) {
				case 'redraw':
					this.updateMode = 'redraw';
					break;
				case 'manipulate':
					this.updateMode = 'manipulate';
					break;
				default:
					throw {message: "Menu: updateMode " + config.updateMode + " is invalid"};
			}
		} else {
			this.updateMode = 'redraw';
		}

		if (this.updateMode == 'manipulate') {
			if (typeof(config.onUpdateCB) == 'function') {
				this.onUpdateCB = config.onUpdateCB;
			} else {
				throw {message: "Menu: onUpdateCB not defined, it is mandatory when updateMode = 'manipulate'"};
			}
		}

		// initializing the events
		this.lineFocusEvent = TVB.CustomEvent.createEvent('lineFocus');
		this.lineBlurEvent = TVB.CustomEvent.createEvent('lineBlur');
		this.pageFocusEvent = TVB.CustomEvent.createEvent('pageFocus');
		this.pageBlurEvent = TVB.CustomEvent.createEvent('pageBlur');
		this.lineSelectEvent = TVB.CustomEvent.createEvent('lineSelect');

		// initializing indexes
		this.currentElement = 0;
		this.countPages();

		// building menu container
		this.menuDiv = document.createElement('div');

		this.drawPage(false);

		// initializing remote control
		TVB.remoteInit();
	} catch (e) {
		TVB.warning("Menu: __constructor: " + e.message);
		throw e;
	}
};

TVB.gridMenu.prototype = {
	// configurations
	/**
	 * Number of cols of the menu. This value doesn't force the menu to have N cols but is used to navigate it
	 * @config cols
	 * @type Integer
	 * @default 5
	 */
	cols : 5,

	/**
	 * @config visibleElements
	 * @type Integer
	 * @default 4
	 */
	visibleElements: undefined,
	/**
	 * @config numElements
	 * @type Integer
	 */
	numElements: undefined,
	currentElement: undefined,
	menuDiv: undefined,
	/**
	 * @config menuType
	 * @type String
	 * @default paged
	 */
	menuType: undefined,
	numPages: undefined,
	currentPage: undefined,
	/**
	 * @config menuName
	 * @type String
	 */
	menuName: undefined,
	/**
	 * @config updateMode
	 * @type String
	 * @default redraw
	 */
	updateMode: undefined,
	/**
	 * @config disableChannelUp
	 * @type Boolean
	 * @default false
	 */
	disableChannelUp: false,
	/**
	 * @config disableChannelDown
	 * @type Boolean
	 * @default false
	 */
	disableChannelDown: false,
	/**
	 * @config disableUpDown
	 * @type Boolean
	 * @default false
	 */
	disableUpDown: false,
	/**
	 * @config disableLeftRight
	 * @type Boolean
	 * @default false
	 */
	disableLeftRight: false,
	/**
	 * @config disableOk
	 * @type Boolean
	 * @default false
	 */
	disableOk: false,
	oThis: this,

	// callbacks
	/**
	 * @config onSelectCB
	 * @type Function
	 */
	onSelectCB: undefined,
	/**
	 * This callback is called when the menu reaches the very first element or the last one.
	 * It should do anything the programmer wants to do, like loading more data or updating the menu.
	 * It must return false if the update fail.
	 * @config onRemoteUpdateCB
	 * @type Function
	 */
	onRemoteUpdateCB: undefined,
	/**
	 * @config onBlurCB
	 * @type Function
	 */
	onBlurCB: undefined,
	/**
	 * @config onFocusCB
	 * @type Function
	 */
	onFocusCB: undefined,
	/**
	 * @config onUpdateCB
	 * @type Function
	 */
	onUpdateCB: undefined,
	/**
	 * @config drawSingleCellCB
	 * @type Function
	 */
	drawSingleCellCB: undefined,
	

	// events
	lineFocusEvent: undefined,
	lineBlurEvent: undefined,
	pageFocusEvent: undefined,
	pageBlurEvent: undefined,
	lineSelectEvent: undefined,

	// functions

	/**
	 * Returns current menu div, it is usefult for appending to a DOM element
	 * @method get
	 * @return {Object} the child
	 */
	get: function() {
		try {
			TVB.log("Menu: get()");
			if (this.menuDiv !== undefined)
			{
				if (this.disableLeftRight === false)
				{
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.LEFT, this.remoteHandler, this, true);
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.RIGHT, this.remoteHandler, this, true);
				}

				if (this.disableUpDown === false) {
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.UP, this.remoteHandler, this, true);
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.DOWN, this.remoteHandler, this, true);
				}

				if (this.disableChannelUp === false) {
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.CHANNEL_UP, this.remoteHandler, this, true);
				}

				if (this.disableChannelDown === false) {
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.CHANNEL_DOWN, this.remoteHandler, this, true);
				}

				if (this.disableOk === false) {
					TVB.CustomEvent.subscribeEvent(TVB.remote.button.OK, this.remoteHandler, this, true);
				}

				return this.menuDiv;
			} else {
				throw {message: "Menu: please init first"};
			}
		} catch (e) {
			TVB.warning("Menu: get: " + e.message);
			throw e;
		}
	},

	/**
	 * Deactivate the remote and other important stuffs for the menu
	 * @method deactivate
	 */
	deactivate: function() {
		try {
			TVB.log("Menu: deactivate()");
			if (this.menuDiv !== undefined) {
				if (this.disableLeftRight === false) {
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.LEFT);
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.RIGHT);
				}

				if (this.disableUpDown === false) {
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.UP);
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.DOWN);
				}

				if (this.disableChannelUp === false) {
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.CHANNEL_UP);
				}

				if (this.disableChannelDown === false) {
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.CHANNEL_DOWN);
				}

				if (this.disableOk === false) {
					TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.OK);
				}

				return this.menuDiv;
			} else {
				throw {message: "Menu: please init first"};
			}
		} catch (e) {
			TVB.warning("Menu: deactivate: " + e.message);
			throw e;
		}
	},

	/**
	 * Recuounts how many pages are we using and in which page are we
	 * @method countPages
	 * @private
	 */
	countPages: function() {
		try {
			TVB.log("Menu: countPages()");
			// how many pages?
			var numPages = parseInt(this.numElements / this.visibleElements, 10) + 1;
			if ( (numPages - 1) * this.visibleElements == this.numElements) {
				numPages--;
			}
			this.numPages = numPages;

			// in what page do we are?
			var currentPage = parseInt(this.currentElement / this.visibleElements, 10);
			if ( (currentPage - 1) * this.visibleElements == this.currentElement) {
				currentPage--;
			}
			this.currentPage = currentPage;
		} catch (e) {
			TVB.warning("Menu: countPages: " + e.message);
			throw e;
		}
	},

	/**
	 * Draws a single page in the div. At first delete the old page, than put a loading div, and at the end draws the new page
	 * @method drawPage
	 * @private
	 */
	drawPage: function(sleep) {
		try {
			TVB.log("Menu: drawPage()");
			if (this.menuDiv !== undefined)
			{
				this.deletePage();
				if(sleep){
					this.menuDiv.innerHTML = "<div class='grid_menu_loading' style='font-size:28px;text-align:center;padding-top:20%;width:100%;height:80%;float:left;'>Loading</div>";
					TVB.system.sleep(500);

				}
				this.drawNextPage();
			} else {
				throw {message: "Menu: please init first"};
			}
		} catch (e) {
			TVB.warning("Menu: drawPage: " + e.message);
			throw e;
		}
	},

	/**
	 * Delete the page
	 * @method deletePage
	 * @private
	 */
	deletePage: function(){

		// clean up current page
		while (this.menuDiv.firstChild !== null) {
			this.menuDiv.removeChild(this.menuDiv.firstChild);
		}

	},

	/**
	 * Draws a single page
	 * @method drawPage
	 * @private
	 */
	drawNextPage: function(){
		this.menuDiv.innerHTML = "";
		var start = parseInt(this.currentPage * this.visibleElements, 10);
		var end = parseInt(start + this.visibleElements, 10);
		if (end > this.numElements) {
			end = this.numElements;
		}
		
		var col = 1;
		for (var i = start; i < end; i++)
		{
			var returned;
			if(col > this.cols)
				col = 1;
			if(col === 1){
				returned = this.drawSingleCell(i, true, true);
			}
			else{
				returned = this.drawSingleCell(i, true, false);
				
			}
			if (typeof(returned) == 'object') {
				if (i == this.currentElement && this.onFocusCB !== undefined) {
					this.onFocusCB(returned, this.currentElement);
				}

				this.menuDiv.appendChild(returned);
				TVB.log("Menu: appended child");
			}  else {
				TVB.log("Menu: drawPage: returned is not an object!");
			}
			col++;
		}

		this.menuDiv.style.display = "";
	},

	/**
	 * Draw a single line using the callback
	 * @method drawSingleCell
	 * @private
	 * @param {Integer} lineNumber
	 * @param {Boolean} visible
	 * @return {Object}
	 */
	drawSingleCell: function(lineNumber, visible, isFirstCol) {
		try {
			TVB.log("Menu: drawSingleCell(" + lineNumber + ", " + visible + ")");
			// chiamo una callback this.drawSigleLineCB
			if (typeof(visible) !== undefined && visible === false) {
				// prefetch
			} else {
				var newLine = this.drawSingleCellCB(lineNumber, isFirstCol);
				newLine.setAttribute('lineNumber', lineNumber);
				newLine.setAttribute('isVisible', visible);
				newLine.id = 'TVBLOB_' + this.menuName + '_' + lineNumber;
				return newLine;
			}
		} catch (e) {
			TVB.warning("Menu: drawSingleCell: " + e.message);
			throw e;
		}
	},
	

	/**
	 * Update a line if it is visible or prefetched
	 * @method updateLine
	 * @param {Integer} lineNumber
	 * @return {Boolean}
	 */
	updateLine: function(lineNumber) {
		try {
			TVB.log("Menu: updateSingleLine(" + lineNumber + ")");

			var start = parseInt(this.currentPage * this.visibleElements, 10);
			var end = parseInt(start + this.visibleElements, 10);
			if (end > this.numElements) {
				end = this.numElements;
			}
			end--;

			//TVB.log("Menu: " + start + " <= " + lineNumber + " <= " + end);
			if (lineNumber > end || lineNumber < start) {
				TVB.log("Menu: not updating line " + lineNumber + ", it is not visible");
				return false;
			}

			switch (this.updateMode) {
				case 'redraw':
					this.drawPage(true);
					break;
				case 'manipulate':
					var obj = document.getElementById('TVBLOB_' + this.menuName + '_' + lineNumber);
					this.onUpdateCB(obj, lineNumber);
					break;
				default:
					TVB.log("Menu: updateSingleLine: updateMode " + this.updateMode + " is not valid");
			}

			return true;
		} catch (e) {
			TVB.warning("Menu: updateSingleLine: " + e.message);
			throw e;
		}
	},

	/**
	 * Returns current element
	 * @method getCurrentLine
	 * @return {Integer}
	 */
	getCurrentLine: function() {
		try {
			TVB.log("Menu: getCurrentLine()");
			return this.currentElement;
		} catch (e) {
			TVB.warning("Menu: getCurrentLine: " + e.message);
			throw e;
		}
	},

	/**
	 * Returns current page number (starting from 0)
	 * @method getCurrentPage
	 * @return {Integer}
	 */
	getCurrentPage: function() {
		try {
			TVB.log("Menu: getCurrentPage()");
			return this.currentPage;
		} catch (e) {
			TVB.warning("Menu: getCurrentPage: " + e.message);
			throw e;
		}
	},

	/**
	 * Returns the number of pages
	 * @method getTotalPages
	 * @return {Integer}
	 */
	getTotalPages: function() {
		try {
			TVB.log("Menu: getTotalPages()");
			var total = parseInt(this.numElements / this.visibleElements, 10);
			if (total * this.visibleElements != this.numElements) {
				total++;
			}
			return total;
		} catch (e) {
			TVB.warning("Menu: getTotalPages: " + e.message);
			throw e;
		}
	},

	/**
	 * Set focus (using the callbacks) to a given element, blurring the element that
	 * was previously selected.
	 * @method setFocus
	 * @private
	 * @param	{Integer}	lineNumber
	 */
	setFocus: function(lineNumber) {
		try {
			TVB.log("Menu: setFocus(" + lineNumber + ")");

			var idToBlur = 'TVBLOB_' + this.menuName + '_' + this.currentElement;
			var lineBlurred = this.currentElement;
			this.currentElement = lineNumber;
			var idToFocus = 'TVBLOB_' + this.menuName + '_' + lineNumber;

			// raises the callbacks
			if (this.onBlurCB !== undefined && lineBlurred !== null) {
				if (document.getElementById(idToBlur) !== undefined) {
					TVB.log("Menu: blurring line " + lineBlurred);
					try {
						this.onBlurCB(document.getElementById(idToBlur), lineBlurred);
					} catch (e) {}
				}
			}
			if (this.onFocusCB !== undefined) {
				TVB.log("Menu: focussing " + this.currentElement + " by ID " + idToFocus);
				try {
					this.onFocusCB(document.getElementById(idToFocus), lineNumber);
				} catch (e) {}
			}

			// throw events
			if (lineBlurred !== null) {
				TVB.CustomEvent.fireEvent(this.lineBlurEvent, {lineNumber: lineBlurred});
			}
			TVB.CustomEvent.fireEvent(this.lineFocusEvent, {lineNumber: this.currentElement});
		} catch (e) {
			TVB.warning("Menu: setFocus: " + e.message);
			throw e;
		}
	},

	/**
	 * Handles the remote control
	 * @method remoteHandler
	 * @private
	 * @param {String} type
	 * @param {Object} args
	 */
	remoteHandler: function(type, args) {
		try {
			TVB.log("Menu: remoteHandler()");
			var start = parseInt(this.currentPage * this.visibleElements, 10);
			var end = parseInt(start + this.visibleElements, 10) - 1;
			if (end >= this.numElements) {
				end = this.numElements - 1;
			}

			var nextElement = null;

			TVB.log("Menu: start = " + start + " - end = " + end);
			switch (args[0].keyName) {
				case 'OK':
					if (this.disableOk === true) {
						TVB.CustomEvent.fireEvent(TVB.remote.button.OK);
						break;
					}

					TVB.log("Menu: OK pushed");
					if (this.onSelectCB !== undefined) {
						this.onSelectCB(this.currentElement);
					}
					TVB.CustomEvent.fireEvent(this.lineSelectEvent, {lineNumber: this.currentElement});
					break;
				case 'DOWN':
					if (this.disableUpDown !== true) {
						this.remoteHandlerDown(start, end);
					}
					break;
				case 'RIGHT':
					if (this.disableLeftRight !== true) {
						this.remoteHandlerRight(start, end);
					}
					break;
				case 'UP':
					if (this.disableUpDown !== true) {
						this.remoteHandlerUp(start, end);
					}
					break;
				case 'LEFT':
					if (this.disableLeftRight !== true) {
						this.remoteHandlerLeft(start, end);
					}
					break;
				case 'CHANNEL_DOWN':
					if (this.disableChannelDown === true) {
						break;
					}
					TVB.log("Menu: working on pagination");
					// go to next page
					nextElement = (this.currentPage + 1) * this.visibleElements;
					if (nextElement >= this.numElements) {
						TVB.log("Menu: this is the last page");
						if (this.menuType == 'dynamic' && this.onRemoteUpdateCB !== undefined) {
							this.currentPage = 0;
							var updateResult = this.onRemoteUpdateCB(0);
							if (updateResult === false) {
								this.setFocus(0);
							}
						} else if (this.currentPage > 0) {
							TVB.log("Menu: back to page 0");
							TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
							this.currentPage = 0;
							this.drawPage(true);
							TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
							this.setFocus(0);
						} else {
							this.setFocus(start);
						}
					} else {
						TVB.log("Menu: this is not the last page");
						TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
						this.currentPage++;
						TVB.log("Menu: going to page " + this.currentPage);
						this.drawPage(true);
						TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
						this.setFocus(nextElement);
					}
					break;
				case 'CHANNEL_UP':
					if (this.disableChannelUp === true) {
						break;
					}
					nextElement = (this.currentPage - 1) * this.visibleElements;
					if (this.currentPage === 0) {
						var lastPage = parseInt(this.numElements / this.visibleElements, 10);

						if (this.menuType == 'dynamic' && this.onRemoteUpdateCB !== undefined) {
							this.currentPage = lastPage;
							var updateResult = this.onRemoteUpdateCB(1);
							if (updateResult === false) {
								this.currentPage = 0;
								this.setFocus(0);
							}
							//this.setFocus((lastPage * this.visibleElements) -1);
						}
						else {
							if (lastPage * this.visibleElements == this.numElements) {
								lastPage--;
							}
							TVB.log("Menu: first page, going to last page number " + lastPage);
							TVB.CustomEvent.fireEvent(this.pageBlurEvent, {
								pageNumber: this.currentPage
							});
							this.currentPage = lastPage;
							this.drawPage(true);
							TVB.CustomEvent.fireEvent(this.pageFocusEvent, {
								pageNumber: this.currentPage
							});
							this.setFocus(lastPage * this.visibleElements);
						}
					} else {
						TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
						this.currentPage--;
						TVB.log("Menu: going to previous page number " + this.currentPage);
						this.drawPage(true);
						TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
						this.setFocus(nextElement);
					}
					break;
				default:
					TVB.log("Menu: nothing to do");
					TVB.log("Type: " + type);
			}
		} catch (e) {
			TVB.warning("Menu: remoteHandler: " + e.message);
			throw e;
		}
	},

	/**
	 * Act when using the UP button on the remote control. Moves the control to the 'current focused element less cols' element
	 * @method remoteHandlerUp
	 * @private
	 * @param {Integer} start
	 * @param {Integer} end
	 */
	remoteHandlerUp: function(start, end) {
		try {
			TVB.log("Menu: remoteHandlerUp(" + start + ", " + end + ")");
			//TVB.widget.setLoading(true);
			var nextElement = this.currentElement - this.cols;
			if (nextElement < start)
			{
				var lastPage = parseInt(this.numElements / this.visibleElements, 10);
				if (this.currentPage === 0)
				{
					if (this.menuType == 'dynamic')
					{
						if (this.onRemoteUpdateCB !== undefined)
						{
							this.currentPage = lastPage;
							var updateResult = this.onRemoteUpdateCB(1);
							if (updateResult === false) {
								this.currentPage = 0;
								this.setFocus(0);
							}
						}
					}
					else
					{
						if (lastPage * this.visibleElements == this.numElements) {
							lastPage--;
						}
						TVB.log("Menu: first page, going to last page number " + lastPage);
						TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
						this.currentPage = lastPage;
						if(this.numPages > 1)
							this.drawPage(true);
						TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
						if((this.visibleElements * this.numPages) - this.numElements > this.cols)
							var last = this.visibleElements * this.numPages + nextElement - this.cols;
						else
							var last = this.visibleElements * this.numPages + nextElement;
						TVB.error(last);
						if(last > this.numElements -1)
							this.setFocus(this.numElements - 1);
						else
							this.setFocus(last);
					}
				} else {
					TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
					this.currentPage--;
					TVB.log("Menu: going to previous page number " + this.currentPage);
					if(this.numPages > 1)
						this.drawPage(true);
					TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
					this.setFocus(nextElement);
				}

				nextElement = end;
			}
			else
			{
				this.setFocus(nextElement);
			}
			//TVB.widget.setLoading(false);
		} catch (e) {
			TVB.warning("Menu: remoteHandlerUp: " + e.message);
			throw e;
		}
	},

	/**
	 * Act when using the LEFT button on the remote control
	 * @method remoteHandlerUp
	 * @private
	 * @param {Integer} start
	 * @param {Integer} end
	 */
	remoteHandlerLeft: function(start, end) {
		try {
			TVB.log("Menu: remoteHandlerUp(" + start + ", " + end + ")");
			//TVB.widget.setLoading(true);
			var nextElement = this.currentElement - 1;
			if (nextElement < start)
			{
				var lastPage = parseInt(this.numElements / this.visibleElements, 10);
				if (this.currentPage === 0)
				{
					if (this.menuType == 'dynamic')
					{
						if (this.onRemoteUpdateCB !== undefined)
						{
							this.currentPage = lastPage;
							var updateResult = this.onRemoteUpdateCB(1);
							if (updateResult === false) {
								this.currentPage = 0;
								this.setFocus(0);
							}
						}
					}
					else
					{
						if (lastPage * this.visibleElements == this.numElements) {
							lastPage--;
						}
						TVB.log("Menu: first page, going to last page number " + lastPage);
						TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
						this.currentPage = lastPage;
						if(this.numPages > 1)
							this.drawPage(true);
						TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
						this.setFocus(this.numElements - 1);
					}
				} else {
					TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
					this.currentPage--;
					TVB.log("Menu: going to previous page number " + this.currentPage);
					if(this.numPages > 0)
						this.drawPage(true);
					TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
					this.setFocus(nextElement);
				}

				nextElement = end;
			}
			else
			{
				this.setFocus(nextElement);
			}
			//TVB.widget.setLoading(false);
		} catch (e) {
			TVB.warning("Menu: remoteHandlerUp: " + e.message);
			throw e;
		}
	},

	/**
	 * Act when using the DOWN button on the remote control. Moves the control to the 'current focused element plus cols' element
	 * @method remoteHandlerDown
	 * @private
	 * @param {Integer} start
	 * @param {Integer} end
	 */
	remoteHandlerDown: function(start, end)
	{
		try
		{
			TVB.log("Menu: remoteHandlerDown(" + start + ", " + end + ")");
			//TVB.widget.setLoading(true);
			var nextElement = this.currentElement + this.cols;
			if (nextElement > end)
			{
				// go to next page
				if (this.currentPage >= this.numPages - 1)
				{

					TVB.log("Menu: this is the last page");
					if (this.currentPage > 0)
					{
						if (this.menuType == 'dynamic') {
							if (this.onRemoteUpdateCB !== undefined)
							{
								this.currentPage = 0;
								var updateResult = this.onRemoteUpdateCB(0);
								if (updateResult === false) {
									this.currentPage = 0;
									this.setFocus(0);
								}
							}
						} else {
							TVB.log("Menu: back to page 0");
							TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
							this.currentPage = 0;
							//TVB.widget.setLoading(true);
							if(this.numPages > 1)
								this.drawPage(true);
							TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
							this.setFocus(0);
							//TVB.widget.setLoading(false);
						}
					} else {
						if (this.menuType == 'dynamic') {
							if (this.onRemoteUpdateCB !== undefined) {
								var updateResult = this.onRemoteUpdateCB(1);
								if (updateResult === false) {
									this.currentPage = 0;
									this.setFocus(0);
								}
							}
						} else {
							this.setFocus(start);
						}
					}
				}
				else
				{
					TVB.log("Menu: this is not the last page");
					TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
					this.currentPage++;
					TVB.log("Menu: going to page " + this.currentPage);
					//TVB.widget.setLoading(true);

					if(this.numPages > 1)
						this.drawPage(true);
					//TVB.widget.setLoading(false);
					TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
					if(nextElement > this.numElements -1)
						nextElement = this.numElements -1;
					this.setFocus(nextElement);
				}
			}
			else
			{

				this.setFocus(nextElement);
			}
			//TVB.widget.setLoading(false);
		}
		catch (e)
		{
			TVB.warning("Menu: remoteHandlerDown: " + e.message);
			throw e;
		}
	},

	/**
	 * Act when using the RIGHT button on the remote control
	 * @method remoteHandlerDown
	 * @private
	 * @param {Integer} start
	 * @param {Integer} end
	 */
	remoteHandlerRight: function(start, end)
	{
		try
		{
			TVB.log("Menu: remoteHandlerDown(" + start + ", " + end + ")");
			//TVB.widget.setLoading(true);
			var nextElement = this.currentElement + 1;
			if (nextElement > end)
			{
				// go to next page
				if (nextElement >= this.numElements)
				{
					TVB.log("Menu: this is the last page");
					if (this.currentPage > 0)
					{
						if (this.menuType == 'dynamic') {
							if (this.onRemoteUpdateCB !== undefined)
							{
								this.currentPage = 0;
								var updateResult = this.onRemoteUpdateCB(0);
								if (updateResult === false) {
									this.currentPage = 0;
									this.setFocus(0);
								}
							}
						} else {
							TVB.log("Menu: back to page 0");
							TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
							this.currentPage = 0;
							//TVB.widget.setLoading(true);
							if(this.numPages > 1)
								this.drawPage(true);
							TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
							this.setFocus(0);
							//TVB.widget.setLoading(false);
						}
					} else {
						if (this.menuType == 'dynamic') {
							if (this.onRemoteUpdateCB !== undefined) {
								var updateResult = this.onRemoteUpdateCB(1);
								if (updateResult === false) {
									this.currentPage = 0;
									this.setFocus(0);
								}
							}
						} else {
							this.setFocus(start);
						}
					}
				}
				else
				{
					TVB.log("Menu: this is not the last page");
					TVB.CustomEvent.fireEvent(this.pageBlurEvent, {pageNumber: this.currentPage});
					this.currentPage++;
					TVB.log("Menu: going to page " + this.currentPage);
					//TVB.widget.setLoading(true);
					if(this.numPages > 1)
						this.drawPage(true);
					//TVB.widget.setLoading(false);
					TVB.CustomEvent.fireEvent(this.pageFocusEvent, {pageNumber: this.currentPage});
					this.setFocus(nextElement);
				}
			}
			else
			{
				this.setFocus(nextElement);
			}
			//TVB.widget.setLoading(false);
		}
		catch (e)
		{
			TVB.warning("Menu: remoteHandlerDown: " + e.message);
			throw e;
		}
	},

	/**
	 * Changes the number of elements and redraw current page
	 * @method changeElementNumber
	 * @param {Integer} newElementNumber
	 */
	changeElementNumber: function(newElementNumber) {
		try {
			TVB.log("Menu: changeElementNumber(" + newElementNumber + ")");
			if (newElementNumber < 0) {
				throw {message: "Menu: cannot set numElement less then 0"};
			}
			var oldElementNumber = this.numElements;
			if (this.currentElement > newElementNumber) {
				this.currentElement = 0;
				this.currentPage = 0;
				this.numElements = newElementNumber;
				//TVB.widget.setLoading(true);
				this.drawPage(true);
				//TVB.widget.setLoading(false);
			} else {
				this.numElements = newElementNumber;
				this.drawPage(true);
			}
		} catch (e) {
			TVB.warning("Menu: remoteHandlerDown: " + e.message);
			throw e;
		}
	}

};
