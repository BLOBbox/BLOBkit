/**
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

try {
	function factorial(num){
		if (num > 1) 
			return num * factorial(num - 1);
		else 
			return 1
	}
	
	for (var i = 0; i < 100; i++) {
		$PR.register('factorial', window);
		var num = 10;
		var res = factorial(num);
		var avg = $PR.averageTime('factorial');
		var min = $PR.minTime('factorial');
		var max = $PR.maxTime('factorial');
		var call = $PR.callCount('factorial');
		$PR.unregister('factorial');
		
		document.getElementById('avg').innerHTML = avg;
		document.getElementById('min').innerHTML = min;
		document.getElementById('max').innerHTML = max;
		document.getElementById('call').innerHTML = call;
		document.getElementById('num').innerHTML = num;
		document.getElementById('res').innerHTML = res;
		
		var string = 'CSV: ' + avg + ', ' + min + ', ' + max + ', ' + call + ', ' + num;
		document.getElementById('string').innerHTML = string;
		TVB.log(string);
	}
	
} catch (e) {
	TVB.log(e);
}
