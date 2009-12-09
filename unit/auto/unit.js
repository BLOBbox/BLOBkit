/* jslint evil: true */

function appendResult(test, success, testResult) {
	var testName = test.name;
	var reference = test.reference;
	var expectedValue = test.expectedValue;
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
		appendMessage("Reference URI: " + reference);
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
			appendResult(test, false, "Exception");
		} else {
			if (res == test.expectedValue) {
				appendResult(test, true, res);
			} else {
				appendResult(test, false, res);
			}
		}
	} catch (e) {
		if (test.expectedException === true) {
			appendResult(test, true, "Exception");
		} else {
			appendResult(test, false, "Exception");
			appendMessage(e.message);
		}
	}
}