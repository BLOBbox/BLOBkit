/** Template

doTest({
	name: "",
	expectedException: false,
	expectedValue: true,
	reference: "", // url where the api is documented
	test: function() {
		return true;
	}
});

*/

setTimeout(function() {

	appendMessage("*** STARTING TEST ***");
	
	// Player tests
	
	doTest({
		name: "sleep(3000)",
		expectedException: false,
		expectedValue: true,
		reference: "http://bigone:7070/do/view/userstory?oid=16036",
		test: function() {
			appendMessage("Control: before the sleep");
			var sleepTO = 3000;
			tvblob.sleep(sleepTO);
			appendMessage("Control: after the sleep");
			return true;
		}
	});

	doTest({
		name: "Player test 01",
		expectedException: false,
		expectedValue: true,
		reference: "http://bigone/wiki/doku.php?id=blobscript_api#player_methods",
		test: function() {
			/**
			 * Player test 01
			 * --------------
			 * 
			 * - inizializzo il player
			 * - verifico che lo stato sia STOPPED
			 * - configuro il filmato PlayerTestMovie (config.static.js)
			 * - verifico che lo stato sia STOPPED
			 * - avvio il playback
			 * - verifico che lo stato sia PLAYING
			 * - attendo il timeout PlayerTestMoviePlaybackTimeout / 2 (config.static.js)
			 * - verifico che lo stato sia PLAYING
			 * - metto in pausa il filmato
			 * - verifico che lo stato sia PAUSED
			 * - rimetto in play il filmato
			 * - verifico che lo stato sia PLAYING
			 * - attendo il timeout PlayerTestMoviePlaybackTimeout / 2 (config.static.js)
			 * - verifico che lo stato sia PLAYING
			 * - fermo il filmato
			 * - verifico che lo stato sia STOPPED
			 * - deinizializzo il player
			 * - restituisco true
			 */
			var p = new BlobPlayer();
			var status = p.getStatus();
			
		var timer = parseInt(PlayerTestMoviePlaybackTimeout * 1000);
		
		appendMessage(status);
		if (status != 'STOPPED') {
			return false;
		}
		
		p.setContent(PlayerTestMovie);
		appendMessage(status);
		if (status != 'STOPPED') {
			return false;
		}
		
		p.play();
		tvblob.sleep(5000);
		timer = timer - 1000;
		appendMessage(status);
		if (status != 'PLAYING') {
			return false;
		}
		
		tvblob.sleep(parseInt(PlayerTestMoviePlaybackTimeout / 2, 10) * 1000);
		
		appendMessage(status);
		return true;
	}
});

	appendMessage("*** TEST DONE ***");

}, 3000);
