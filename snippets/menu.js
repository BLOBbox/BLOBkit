/*
	category: BLOBkit
	name: Menu
	toolTip: Add a paginated interactive menu
*/
var myMenuData = [];

var menuConfig = {
	menuName: 'mainMenu',				// mandatory
	visibleElements: 6,					// optional (default 4)
	numElements: 100,					// mandatory
	updateMode: 'manipulate',			// optional: redraw | manipulate (default 'redraw')
	disableChannelDown: false,			// optional (default false)
	disableChannelUp: false,	 		// optional (default false)
	disableUpDown: false,				// optional (default false)
	disableLeftRight: false,			// optional (default false)
	disableOk: false, 					// optional (default false)
	menuType: 'paged', 					// optional: paged (default 'paged')
	drawSingleLineCB: function(line) { 	// mandatory
		// draws the row for element number 'line'
		var elem = document.createElement('div');
		elem.style.backgroundColor = 'black';
		elem.style.color = 'white';
		elem.innerHTML = "Item #" + line;
		return elem;
	},
	onSelectCB: function(line) { 		// optional
		TVB.log("USER HAS SELECTED LINE " + line);
	},
	onFocusCB: function(obj, line) { 			// optional
		// change the element of line number 'line' for focus
		obj.style.backgroundColor = 'white';
		obj.style.color = 'black';
	},
	onBlurCB: function(obj, line) { 			// optional
		// change the element of line number 'line' for blur
		obj.style.backgroundColor = 'black';
		obj.style.color = 'white';
	},
	onUpdateCB: function(obj, line) { 	// mandatory if updateMode = 'manipulate'
		// update the content of a line
		obj.innerHTML = "Item #" + line + " UPDATED!!!";
	}
}

var myMenu = new TVB.menu(menuConfig);
document.body.appendChild(myMenu.get());
