/**
 * @author Francesco Facconi francesco.facconi@tvbob.com
 */


var maxIter = 100;

function test1() {
	try {
		for (var i = 0; i < maxIter; i++) {
			try {
				var res = tvblob.setLabel("Iteration " + i);
			} catch (e) {}
		}
	} catch (e) {
		TVB.error("profiler4.js: " + e.message);
	}
}

function test2() {
	try {
		for (var i = 0; i < maxIter; i++) {
			var res = tvblob.getVideoSystem();
		}
	} catch (e) {
		TVB.error("profiler4.js: " + e.message);
	}
}

function test3() {
	try {
		for (var i = 0; i < maxIter; i++) {
			var res = new BlobPlayer();
		}
	} catch (e) {
		TVB.error("profiler4.js: " + e.message);
	}
}

function test4() {
	try {
		for (var i = 0; i < maxIter; i++) {
			try {
				var res = tvblob.getDvdSystem();
			} catch (e) {}
		}
	} catch (e) {
		TVB.error("profiler4.js: " + e.message);
	}
}

function test5() {
	try {
		for (var i = 0; i < maxIter; i++) {
			try {
				var res = tvblob.getVideoSystem();
			} catch (e) {}
		}
	} catch (e) {
		TVB.error("profiler4.js: " + e.message);
	}
}

function test6() {
	try {
		for (var i = 0; i < maxIter; i++) {
			try {
				a=b;
			} catch (e) {}
		}
	} catch (e) {
		TVB.error("profiler4.js: " + e.message);
	}
}

try {
	document.getElementById('iter1').innerHTML = maxIter;
	document.getElementById('iter2').innerHTML = maxIter;
	document.getElementById('iter3').innerHTML = maxIter;
	document.getElementById('iter4').innerHTML = maxIter;
	document.getElementById('iter5').innerHTML = maxIter;
	document.getElementById('iter6').innerHTML = maxIter;
	
	setTimeout(function() {
		try {
			TVB.log("Starting test 1");
			$PR.register('test1', window);
			test1();
			var avg = $PR.averageTime('test1');
			$PR.unregister('test1');
			document.getElementById('test1').innerHTML = avg;
			
			setTimeout(function(){
				TVB.log("Starting test 2");
				$PR.register('test2', window);
				test2();
				var avg = $PR.averageTime('test2');
				$PR.unregister('test2');
				document.getElementById('test2').innerHTML = avg;

				setTimeout(function(){
					TVB.log("Starting test 3");
					$PR.register('test3', window);
					test3();
					var avg = $PR.averageTime('test3');
					$PR.unregister('test3');
					document.getElementById('test3').innerHTML = avg;

					setTimeout(function(){
						TVB.log("Starting test 4");
						$PR.register('test4', window);
						test4();
						var avg = $PR.averageTime('test4');
						$PR.unregister('test4');
						document.getElementById('test4').innerHTML = avg;

						setTimeout(function(){
							TVB.log("Starting test 5");
							$PR.register('test5', window);
							test5();
							var avg = $PR.averageTime('test5');
							$PR.unregister('test5');
							document.getElementById('test5').innerHTML = avg;
							
							setTimeout(function(){
								TVB.log("Starting test 6");
								$PR.register('test6', window);
								test6();
								var avg = $PR.averageTime('test6');
								$PR.unregister('test6');
								document.getElementById('test6').innerHTML = avg;
							}, 2000);
						}, 2000);
					}, 2000);
				}, 2000);
			}, 2000);
		} catch (e) {
			TVB.error("profiler4.js timeout: " + e.message);
		}
	}, 2000);

} catch (e) {
	TVB.error("profiler4.js: " + e.message);
}
