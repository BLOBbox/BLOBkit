/**
 * Scroller Menu Manager
 * @module scroller
 * @namespace TVB
 * @title Scroller Menu Manager
 * @requires tvblob, system, event, remote
 * @author Emilio Sabatucci emilio.sabatucci@tvblob.com
 */

/**
 * styles:
 * scroller bar: "TVB_scroller_bar"
 * scroller widget: "TVB_scroller_barrer";
 * bar container: "TVB_scroller_bar_container"; //contains bar and arrows
 * loading: "TVB_scroller_loading";
 * row: "TVB_scroller_row";
 * row_selected: "TVB_scroller_row_selected";
 * menuContainer: "TVB_scroller_menu_container"
 * 
 */

/**
 * Constructor for the Menu Widget
 * @class scroller
 * @param {Object} config Configuration object, see user manual for specifications
 * @return {Object}
 * @constructor
 */

TVB.scroller = function(config){
	try{
		this.container = document.getElementById(config.cid);
		if(config.drawLineCB !== null && config.drawLineCB !== undefined )
			this.drawLineCB = config.drawLineCB;
		if(config.navLeftCB !== null && config.navLeftCB !== undefined )
			this.navLeftCB = config.navLeftCB;
		if(config.navRightCB !== null && config.navRightCB !== undefined )
			this.navRightCB = config.navRightCB;
		if(config.focusLineCB !== null && config.focusLineCB !== undefined )
			this.focusLineCB = config.focusLineCB;
		if(config.blurLineCB !== null && config.blurLineCB !== undefined )
			this.blurLineCB = config.blurLineCB;
		if(config.visible !== null && config.visible !== undefined )
			this.visible = config.visible;
		if(config.total !== null && config.total !== undefined )
			this.total = config.total;
		if(config.selectLineCB !== null && config.selectLineCB !== undefined )
			this.selectLineCB = config.selectLineCB;
		if(config.name !== null && config.name !== undefined )
			this.name = config.name;
		if(config.enableChannelUpDown !== null && config.enableChannelUpDown !== undefined )
			this.enableChannelUpDown = config.enableChannelUpDown;
		if(config.rowHeightPx !== null && config.rowHeightPx !== undefined )
			this.rowHeightPx = config.rowHeightPx;
		if(config.rowWidthPx !== null && config.rowWidthPx !== undefined )
			this.rowWidthPx = config.rowWidthPx;
		if(config.barColor !== null && config.barColor !== undefined )
			this.barColor = config.barColor;
		if(config.scrollerColor !== null && config.scrollerColor !== undefined )
			this.scrollerColor = config.scrollerColor;
		if(config.rowSelectedColor !== null && config.rowSelectedColor !== undefined )
			this.rowSelectedColor = config.rowSelectedColor;
		if(config.rowUnselectedColor !== null && config.rowUnselectedColor !== undefined )
			this.rowUnselectedColor = config.rowUnselectedColor;
		if(config.rowBorderPx !== null && config.rowBorderPx !== undefined )
			this.rowBorderPx = config.rowBorderPx;
		this.container.innerHTML = "<div class='TVB_scroller_loading' >Loading</div>";

	}catch(e){
		TVB.log(e);
	}
};

TVB.scroller.prototype = {
		name: "default",
		/**
		 * @config visible
		 * @type Integer
		 * @default 8
		 */
		visible: 8,
		/**
		 * @config total
		 * @type Integer
		 */
		total:undefined,
		/**
		 * @config container
		 * @type String
		 */
		container: null,
		/**
		 * @config selectLineCB
		 * @type Function
		 */
		selectLineCB:undefined,
		/**
		 * @config focusLineCB
		 * @type Function
		 */
		focusLineCB:undefined,
		/**
		 * @config blurLineCB
		 * @type Function
		 */
		blurLineCB:undefined,
		/**
		 * @config drawLineCB
		 * @type Function
		 */
		drawLineCB:undefined,
		/**
		 * @config navLeftCB
		 * @type Function
		 */
		navLeftCB:undefined,
		/**
		 * @config navRightCB
		 * @type Function
		 */
		navRightCB:undefined,
		/**
		 * @config enableChannelUpDown
		 * @type Boolean
		 * default:true,
		 */
		enableChannelUpDown:true,
		/**
		 * @config rowHeightPx
		 * @type String
		 * default:33,
		 */
		rowHeightPx:"33",
		/**
		 * @config rowWidthPx
		 * @type String
		 * default:200,
		 */
		rowWidthPx:"200",
		/**
		 * @config barColor
		 * @type String
		 * default:#333333,
		 */
		barColor:"#333333",
		/**
		 * @config scrollerColor
		 * @type String
		 * default:#cccccc,
		 */
		scrollerColor:"#cccccc",
		/**
		 * @config rowSelectedColor
		 * @type String
		 * default:#dddddd,
		 */
		rowSelectedColor:"#dddddd",
		rowUnselectedColor: "#ffffff",
		rowBorderPx: "2",
		menuContainer:null,
		from:null,
		to:null,
		barHeightForEl:null,
		currentLine:0,
		prevLine:null,
		page:null,

		/**
		 * This function must to be called on order to enter in the scroller menu
		 * @method enter
		 */
		enter: function(){
			try{

				TVB.remote.enableNav();
				TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.OK);
	            TVB.CustomEvent.subscribeEvent(TVB.remote.button.OK, this.selectLine, this, true);
	            TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.UP);
	            TVB.CustomEvent.subscribeEvent(TVB.remote.button.UP, this.navup, this, true);
	            TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.DOWN);
	            TVB.CustomEvent.subscribeEvent(TVB.remote.button.DOWN, this.navdown, this, true);
	            TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.LEFT);
	            TVB.CustomEvent.subscribeEvent(TVB.remote.button.LEFT, this.navLeft, this, true);
	            TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.RIGHT);
	            TVB.CustomEvent.subscribeEvent(TVB.remote.button.RIGHT, this.navRight, this, true);
	            if(this.enableChannelUpDown){
	            	TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.CHANNEL_DOWN);
		            TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.CHANNEL_UP);
		            TVB.CustomEvent.subscribeEvent(TVB.remote.button.CHANNEL_UP, this.pageDown, this, true);
		            TVB.CustomEvent.subscribeEvent(TVB.remote.button.CHANNEL_DOWN, this.pageUp, this, true);
	            }
	            if(this.total > 0)
	            	this.focusLine(this.currentLine);
			}catch(e){
				TVB.log(e);
			}
		},
		
		exit: function(){
			this.blurLine(this.currentLine);
		},

		/**
		 * Propagate the control to the config navLeftCB
		 * @method navLeft
		 */
		navLeft: function(){
			this.navLeftCB(this.currentLine);
		},

		/**
		 * Propagate the control to the config navRightCB
		 * @method navRight
		 */
		navRight: function(){
			this.navRightCB(this.currentLine);
		},

		/**
		 * Propagate the drawing of a line to config drawLineCB
		 * @method drawLine
		 * @return {Object}
		 */
		drawLine: function(line){
			try{
				return this.drawLineCB(line);

			}catch(e){
				TVB.log(e);
			}
		},

		/**
		 * Draws both visible and not visible lines into container
		 * @method draw
		 */
		draw: function(){
			try{
				this.page = 1;
				var totalHeight = this.visible * this.rowHeightPx + "px";
				var barHeight = (this.visible * (this.rowHeightPx + (2* this.rowBorderPx)) - 32);
				barHeight +=  "px";
				this.container.innerHTML = '<div style="float:left;height:' + totalHeight + ';" class="TVB_scroller_menu_container"><div id="' + this.name + '_container" style="float:left;"></div><div class="TVB_scroller_bar_container" id="' + this.name + '_bar_container" style="float:left"><div style="width:11px;border:1px solid ' + this.barColor + ';text-align:center;font-size:12px;font-weight:bold;line-height:14px;background-color:' + this.barColor + ';color:' + this.scrollerColor +';clear:both">/\\</div><div id="' + this.name + '_bar" class="TVB_scroller_bar" style="background-color:' + this.barColor + ';clear:both;height:' + barHeight + ';width:13px;"><div id="' + this.name + '_barrer" class="TVB_scroller_barrer" style="width:11px;position:relative;background-color:' + this.scrollerColor + ';margin-left:1px"></div></div><div style="font-size:12px;;line-height:14px;font-weight:bold;background-color:' + this.barColor + ';color:' + this.scrollerColor +';width:11px;border:1px solid ' + this.barColor + ';text-align:center;clear:both">\\/</div></div></div>';
				this.menuContainer = document.getElementById(this.name + '_container');
	
				if(this.total === 0){
					this.menuContainer.innerText = "Nessun Risultato";
					document.getElementById(this.name + "_bar").style.display = "none";
					return;
				}
				this.from = 0;
				this.currentLine = 0;
	
				var tmp = this.visible;
				if(this.total < this.visible)
					tmp = this.total;
				this.to = tmp-1;
				for(var i=0; i < tmp; i++){
					var row = document.createElement('div');
		            row.id = this.name + '_row_' + i;
		            row.className = "TVB_scroller_row";
		            row.style.width = this.rowWidthPx + "px";
		            row.style.height = this.rowHeightPx + "px";
		            row.style.border = this.rowBorderPx + "px solid " + this.rowSelectedColor;
		            row.style.backgroundColor = this.rowUnselectedColor;
		            row.innerHTML = this.drawLine(i);
		            this.menuContainer.appendChild(row);
				}
				for(var i=this.visible; i < this.total; i++){
					var row = document.createElement('div');
		            row.id = this.name + '_row_' + i;
		            row.style.width = this.rowWidthPx + "px";
		            row.style.height = this.rowHeightPx + "px";
		            row.style.backgroundColor = this.rowUnselectedColor;
		            row.style.border = this.rowBorderPx + "px solid " + this.rowSelectedColor;
		            row.className = "TVB_scroller_row";
		            row.style.display = "none";
		            row.innerHTML = this.drawLine(i);
		            this.menuContainer.appendChild(row);
				}
	
				this.drawBar();
			}catch(e){
				TVB.error(e);
			}
		},


		/**
		 * Delete menuContainer and all its content
		 * @method dispose
		 */
		dispose: function(){
			try{
				TVB.system.deleteElementById(this.menuContainer.id);
			}catch(e){
				TVB.log(e);
			}
		},

		/**
		 * Set the focus to the line and center the pagination to its page
		 * @method setCurrentLine
		 * @param {Integer} line
		 */
		setCurrentLine: function(line){
			var tmp = this.page;
			this.page = Math.floor((line/this.visible) + 1);

			if(this.page != tmp)
				this.drawPage(this.page);

			this.prevLine = this.currentLine;
			this.currentLine = line;
			this.focusLine(line);
		},

		/**
		 * Set the focus to a line
		 * @method focusLine
		 * @param {Integer} line
		 */
		focusLine: function(line){
			try{
				
				if(this.prevLine !== null && this.prevLine !== undefined )
					this.blurLine(this.prevLine);
				else
					this.prevLine = 0;
				if(this.focusLineCB !== null && this.focusLineCB !== undefined )
					this.focusLineCB(this.currentLine);
				document.getElementById(this.name + "_row_" + line).style.backgroundColor = this.rowSelectedColor;
				document.getElementById(this.name + "_row_" + line).className ="TVB_scroller_row_selected" ;
				
			}catch(e){
				TVB.error(e);
			}
		},

		/**
		 * Blur a line
		 * @method blurLine
		 * @param {Integer} line
		 */
		blurLine: function(line){
			try{
				
				document.getElementById(this.name + "_row_" + line).style.backgroundColor = this.rowUnselectedColor;
				document.getElementById(this.name + "_row_" + line).className ="TVB_scroller_row" ;
				if(this.blurLineCB != undefined)
					this.blurLineCB(line);
				
			}catch(e){
				TVB.error(e);
			}
		},

		/**
		 * Select the current line
		 * @method seletcLine
		 * @param {Integer} line
		 */
		selectLine: function(){
			try{
				this.selectLineCB(this.currentLine);
			}catch(e){
				TVB.log(e);
			}
		},

		/**
		 * Manage the navigation down
		 * @method navdown
		 * @private
		 */
		navdown: function(){
			if(this.currentLine === this.total -1)
				return;
			if(this.currentLine === this.to)
				this.down();
			this.prevLine = this.currentLine;
			this.currentLine++;

			this.focusLine(this.currentLine);
		},

		/**
		 * Manage the navigation up
		 * @method navup
		 * @private
		 */
		navup: function(){
			if(this.currentLine === 0)
				return;
			if(this.currentLine === this.from)
				this.up();
			this.prevLine = this.currentLine;
			this.currentLine--;
			this.focusLine(this.currentLine);
		},


		/**
		 * Manage the up line display
		 * @method up
		 * @private
		 */
		up: function(){

			try{
				if(this.from > 0){
					this.prevLine = this.from;
					this.from--;
					document.getElementById(this.name + "_row_" + this.to).style.display = "none";
					document.getElementById(this.name + "_row_" + this.from).style.display = "";
					this.focusLine(this.from);
					document.getElementById(this.name + "_barrer").style.top = this.from * this.barHeightForEl +"%";
					this.to--;
				}
			}catch(e){
				TVB.log(e);
			}
		},

		/**
		 * Manage the down line display
		 * @method down
		 * @private
		 */
		down:function(){
			try{

				if(this.to < this.total-1){
					document.getElementById(this.name + "_row_" + this.from).style.display = "none";
					this.prevLine = this.to;
					this.from++;
					this.to++;
					document.getElementById(this.name + "_row_" + this.to).style.display = "";
					this.focusLine(this.to);
					document.getElementById(this.name + "_barrer").style.top = this.from * this.barHeightForEl +"%";
				}
			}catch(e){
				TVB.error(e);
			}
		},

		/**
		 * Display a page
		 * @method drawPage
		 * @param {Integer} page
		 * @private
		 */
		drawPage: function(page){
			this.blurLine(this.currentLine);
			for(var i = this.from; i<this.to+1; i++){
				document.getElementById(this.name + "_row_" + i).style.display = "none";
			}

			this.to = (page * this.visible) - 1;
			if(this.to > (this.total -1))
				this.to = this.total - 1;

			this.from = this.to - this.visible + 1;
			if(this.from < 0)
				this.from = 0;

			for(var j = this.from; j<= this.to; j++){
				document.getElementById(this.name + "_row_" + j).style.display = "";
			}

			this.currentLine = this.from;

			if(this.from > 0)
				this.prevLine = this.from -1;
			else
				this.prevLine = null;

			this.focusLine(this.currentLine);
			document.getElementById(this.name + "_barrer").style.top = this.from * this.barHeightForEl +"%";

		},

		/**
		 * Manage the pagination up
		 * @method pageUp
		 * @private
		 */
		pageUp: function(){
			if(this.page * this.visible > this.total)
				return;

			this.page++;

			this.drawPage(this.page);

		},

		/**
		 * Manage the pagination down
		 * @method pageDown
		 * @private
		 */
		pageDown: function(){
			if(this.page === 1)
				return;

			this.page--;
			this.drawPage(this.page);
		},

		/**
		 * Draw the scroller bar
		 * @method drawBar
		 * @private
		 */
		drawBar: function(){
			try{
				if(this.visible >= this.total){
					document.getElementById(this.name + "_bar_container").style.display = "none";
				}else{
					var barrer_height = (this.visible/this.total)*100;
					document.getElementById(this.name + "_barrer").style.height = barrer_height + "%";
					document.getElementById(this.name + "_bar_container").style.display = "";
					this.barHeightForEl = (100 - barrer_height)/(this.total-this.visible);
	
				}
			}catch(e){
				TVB.error(e);
			}
		}
};