/* jslint evil: true */

function appendResult(testName, success, expectedValue, testResult) {
	var logMessage = testName + ": "; 
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
	if (success === false) {
		appendMessage("Excepted: " + expectedValue + " - Obtained: " + testResult);
	}
}

function appendMessage(message) {
	if (showDebugMessages) {
		var htmlMessage = document.createElement('p');
		htmlMessage.className = 'message';
		htmlMessage.innerHTML = "&nbsp;&nbsp;&nbsp;" + message;
		try {
			tvblob.logWarning(message);
		} catch (e) {
			console.debug(message);
		}
		document.getElementById('results').appendChild(htmlMessage);
	}
}

function doTest(test) {
	try {
		var res = test.test();
		if (test.expectedException === true) {
			appendResult(test.name, false, "Exception", "Exception");
		} else {
			if (res == test.expectedValue) {
				appendResult(test.name, true, test.expectedValue, res);
			} else {
				appendResult(test.name, false, test.expectedValue, res);
			}
		}
	} catch (e) {
		if (test.expectedException === true) {
			appendResult(test.name, true, "Exception", "Exception");
		} else {
			appendResult(test.name, false, test.expectedValue, "Exception");
			appendMessage(e.message);
		}
	}
}