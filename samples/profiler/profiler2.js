/**
 * @author Francesco Facconi francesco.facconi@tvbob.com
 */

function write_logs(number, log_yes_no) {
	for (var i = 0; i < number; i++) {
		if (log_yes_no) {
			TVB.log("This is the log number " + i);
		}
	}
}

function write_logs_no_concat(number, log_yes_no) {
	for (var i = 0; i < number; i++) {
		if (log_yes_no) {
			TVB.log("This is the log without any number");
		}
	}
}

function write_logs_smoj(number, log_yes_no) {
	for (var i = 0; i < number; i++) {
		if (log_yes_no) {
			tvblob.logInfo("This is the log without any number");
		}
	}
}

function write_logs_pre_concat(number, log_yes_no) {
	for (var i = 0; i < number; i++) {
		var string = "This is the log number " + i;,
		if (log_yes_no) {
			TVB.log(string);
		}
	}
}

try {
	$PR.register('write_logs',window);
	write_logs(100, true);
	var avg = $PR.averageTime('write_logs');
	$PR.unregister('write_logs');
	document.getElementById('test1').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs',window);
	write_logs(100, false);
	var avg = $PR.averageTime('write_logs');
	$PR.unregister('write_logs');
	document.getElementById('test2').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs',window);
	write_logs(1000, true);
	var avg = $PR.averageTime('write_logs');
	$PR.unregister('write_logs');
	document.getElementById('test3').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs',window);
	write_logs(1000, false);
	var avg = $PR.averageTime('write_logs');
	$PR.unregister('write_logs');
	document.getElementById('test4').innerHTML = avg;
	TVB.system.sleep(1000);

	
	$PR.register('write_logs_no_concat',window);
	write_logs_no_concat(100, true);
	var avg = $PR.averageTime('write_logs_no_concat');
	$PR.unregister('write_logs_no_concat');
	document.getElementById('test5').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_no_concat',window);
	write_logs_no_concat(100, false);
	var avg = $PR.averageTime('write_logs_no_concat');
	$PR.unregister('write_logs_no_concat');
	document.getElementById('test6').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_no_concat',window);
	write_logs_no_concat(1000, true);
	var avg = $PR.averageTime('write_logs_no_concat');
	$PR.unregister('write_logs_no_concat');
	document.getElementById('test7').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_no_concat',window);
	write_logs_no_concat(1000, false);
	var avg = $PR.averageTime('write_logs_no_concat');
	$PR.unregister('write_logs_no_concat');
	document.getElementById('test8').innerHTML = avg;
	TVB.system.sleep(1000);


	$PR.register('write_logs_pre_concat',window);
	write_logs_pre_concat(100, true);
	var avg = $PR.averageTime('write_logs_pre_concat');
	$PR.unregister('write_logs_pre_concat');
	document.getElementById('test9').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_pre_concat',window);
	write_logs_pre_concat(100, false);
	var avg = $PR.averageTime('write_logs_pre_concat');
	$PR.unregister('write_logs_pre_concat');
	document.getElementById('test10').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_pre_concat',window);
	write_logs_pre_concat(1000, true);
	var avg = $PR.averageTime('write_logs_pre_concat');
	$PR.unregister('write_logs_pre_concat');
	document.getElementById('test11').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_pre_concat',window);
	write_logs_pre_concat(1000, false);
	var avg = $PR.averageTime('write_logs_pre_concat');
	$PR.unregister('write_logs_pre_concat');
	document.getElementById('test12').innerHTML = avg;
	TVB.system.sleep(1000);

	
	$PR.register('write_logs_smoj',window);
	write_logs_smoj(100, true);
	var avg = $PR.averageTime('write_logs_smoj');
	$PR.unregister('write_logs_smoj');
	document.getElementById('test13').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_smoj',window);
	write_logs_smoj(100, false);
	var avg = $PR.averageTime('write_logs_smoj');
	$PR.unregister('write_logs_smoj');
	document.getElementById('test14').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_smoj',window);
	write_logs_smoj(1000, true);
	var avg = $PR.averageTime('write_logs_smoj');
	$PR.unregister('write_logs_smoj');
	document.getElementById('test15').innerHTML = avg;
	TVB.system.sleep(1000);

	$PR.register('write_logs_smoj',window);
	write_logs_smoj(1000, false);
	var avg = $PR.averageTime('write_logs_smoj');
	$PR.unregister('write_logs_smoj');
	document.getElementById('test16').innerHTML = avg;
	TVB.system.sleep(1000);
} catch (e) {
	TVB.log("ERROR profiler2.html: " + e.message);
}
