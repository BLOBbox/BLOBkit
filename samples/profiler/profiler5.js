/**
 * @author Francesco Facconi francesco.facconi@tvbob.com
 */


var maxIter = 100;

function test1() {
	try {
		return new PushVodFeedsManager();
	} catch (e) {
		TVB.error("profiler5.js: " + e.message);
	}
}

try {
	document.getElementById('iter').innerHTML = maxIter;
	
	$PR.register('test1', window);
	for (var i = 0; i < maxIter; i++) {
		test1();
	}
	document.getElementById('min').innerHTML = $PR.minTime('test1');
	document.getElementById('avg').innerHTML = $PR.averageTime('test1');
	document.getElementById('max').innerHTML = $PR.maxTime('test1');
	$PR.unregister('test1');
	
} catch (e) {
	TVB.error("profiler5.js: " + e.message);
}
