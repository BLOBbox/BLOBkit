/* jslint evil: true */

function appendResult(testName, success, expectedValue) {
	var logMessage = testName + " = " + expectedValue + ": "; 
	var htmlLogMessage = document.createElement('p');
	if (success) {
		logMessage += 'SUCCESS';
		htmlLogMessage.className = 'success';
		try {
			tvblob.logInfo(logMessage);
		} catch (e) {
			console.log(logMessage);
		}
	} else {
		logMessage += 'FAIL';
		htmlLogMessage.className = 'fail';
		try {
			tvblob.logError(logMessage);
		} catch (e) {
			console.error(logMessage);
		}
	}
	htmlLogMessage.innerHTML = logMessage;
	document.getElementById('results').appendChild(htmlLogMessage);
}

function appendMessage(message) {
	var htmlMessage = document.createElement('p');
	htmlMessage.className = 'message';
	htmlMessage.innerHTML = message;
	document.getElementById('results').appendChild(htmlMessage);
}

function doTest(test) {
	try {
		var res = test.test();
		if (test.expectedException === true) {
			appendResult(test.name, false, "Exception");
		} else {
			if (res == test.expectedValue) {
				appendResult(test.name, true, test.expectedValue);
			} else {
				appendResult(test.name, false, test.expectedValue);
			}
		}
	} catch (e) {
		if (test.expectedException === true) {
			appendResult(test.name, true, "Exception");
		} else {
			appendResult(test.name, false, "Exception");
			appendMessage(e.message);
		}
	}
}