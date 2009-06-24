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

} catch (e) {
	TVB.log("ERROR profiler2.html: " + e.message);
}
