document.getElementById('container').style.width = (parseInt(window.innerWidth, 10) - (parseInt(document.getElementById('container').style.left, 10) * 2)) + "px"; 			

var eosPlayback = function() {
	try {
		if (myMenu.getCurrentLine() < (menuData.length - 1)) {
			myMenu.currentElement++;
			TVB.player.setContent(menuData[myMenu.getCurrentLine()].video);
			TVB.player.play();
		} else {
			TVB.player.stop();
		}
	} catch (e) {
		TVB.error(e);
	}
};

var stopPlayback = function() {
	try {
		document.getElementById('container').appendChild(myMenu.get());
	} catch (e) {
		TVB.error(e);
	}
};

if (menuData.length === 0) {
	document.getElementById('pager').innerHTML = nodata_string;
} else {
	try {
		TVB.player.init({
			uri: null,
			switchKey: null,
			autoplay: false,
			fullscreen: true,
			noLittleHole: false
		});
		TVB.CustomEvent.subscribeEvent(TVB.player.events.end_of_streaming, eosPlayback);
		TVB.CustomEvent.subscribeEvent(TVB.player.events.stop, stopPlayback);
	} catch (e) {
	}
	var menuConfig = {
		menuName: 'mainMenu',
		visibleElements: 3,
		numElements: menuData.length,
		updateMode: 'manipulate',
		disableChannelDown: false,
		disableChannelUp: false,
		disableUpDown: false,
		disableLeftRight: false,
		disableOk: false,
		menuType: 'paged',
		drawSingleLineCB: function(line) { // mandatory

			var elem = document.createElement('div');
			elem.className = 'row';
			var html = "<table><tr>";
			html += "<td class='thumb'><img src='" + menuData[line].thumbnail + "' width='120px' heigth='90px' /></td>";
			html += "<td class='desc'>";
			html += "<p class='h1'>" + menuData[line].title + "</p>";
			html += "<p class='h2'>" + menuData[line].subtitle + "</p>";
			html += "<p>" + menuData[line].description + "</p>";
			html += "</td>";
			html += "</tr></table>";
			elem.innerHTML = html;
			return elem;
		},
		onSelectCB: function(line) { // optional

			TVB.player.setContent(menuData[line].video);
			myMenu.deactivate();
			TVB.player.play();
		},
		onFocusCB: function(obj, line) { // optional

			obj.style.backgroundColor = '#333';
		},
		onBlurCB: function(obj, line) { // optional

			obj.style.backgroundColor = 'transparent';
		},
		onUpdateCB: function(obj, line) {
			return;
		}
	};
	var myMenu = new TVB.menu(menuConfig);
	document.getElementById('container').appendChild(myMenu.get());
	if (myMenu.getTotalPages() > 1) {
		var pagerUpdate = function() {
			//document.getElementById('pager').innerHTML = "Pagina " + (myMenu.getCurrentPage() + 1) + " di " + myMenu.getTotalPages();
			document.getElementById('pager').innerHTML = page_string.replace("%%X%%", (myMenu.getCurrentPage() + 1)).replace("%%Y%%", myMenu.getTotalPages());
			document.getElementById('pager').style.zIndex = '8000';
		};
		pagerUpdate();
		TVB.CustomEvent.subscribeEvent(myMenu.pageFocusEvent, pagerUpdate);
	} else {
		document.getElementById('pager').innerHTML = '';
	}
}