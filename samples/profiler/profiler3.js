/**
 * @author Francesco Facconi francesco.facconi@tvbob.com
 */

function addDIV() {
	for (var i = 0; i < 100; i++) {
		var div = document.createElement('div');
		div.id = 'prova1_' + i;
		div.style.width = '2px';
		div.style.height = '2px';
		div.style.backgroundColor = 'red';
		//div.style.float = 'left';
		div.setAttribute("style","float:left");
		document.getElementById('area1').appendChild(div);
	}
}

function addHTML() {
	var text = '';
	for (var i = 0; i < 100; i++) {
		text += "<div id='prova2_" + i + "' style='width: 2px; height: 2px; background-color: green; float:left;'></div>";
	}
	document.getElementById('area2').innerHTML = text;
}

try {
	$PR.register('addDIV',window);
	addDIV();
	document.getElementById('test1').innerHTML = $PR.averageTime('addDIV');
	$PR.unregister('addDIV');

	$PR.register('addHTML',window);
	addHTML();
	document.getElementById('test2').innerHTML = $PR.averageTime('addHTML');
	$PR.unregister('addHTML');

} catch (e) {
	TVB.log("ERROR profiler3.html: " + e.message);
}
