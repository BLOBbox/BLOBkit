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

// Control tests

if (showDebugMessages) {
	doTest({
		name: "true is true (expected success)",
		expectedException: false,
		expectedValue: true,
		reference: "http://bigone/wiki/doku.php?id=blobscript_api",
		test: function() {
			return true;
		}
	});
	
	doTest({
		name: "false is not true (expected fail)",
		expectedException: false,
		expectedValue: true,
		reference: "http://bigone/wiki/doku.php?id=blobscript_api",
		test: function() {
			return false;
		}
	});
}

// System calls

doTest({
	name: "getTvblobNumber()",
	expectedException: isUntrustedPage,
	expectedValue: tvblobNumber,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getTvblobNumber();
	}
});

doTest({
	name: "getSMOJVersion()",
	expectedException: false,
	expectedValue: SMOJVersion,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getSMOJVersion();
	}
});

doTest({
	name: "getProductName()",
	expectedException: false,
	expectedValue: productName,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getProductName();
	}
});

doTest({
	name: "getProductVersion()",
	expectedException: false,
	expectedValue: productVersion,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getProductVersion();
	}
});

doTest({
	name: "getSMOSVersion()",
	expectedException: false,
	expectedValue: SMOSVersion,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getSMOSVersion();
	}
});

doTest({
	name: "getLanguageCode()",
	expectedException: false,
	expectedValue: languageCode,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getLanguageCode();
	}
});

doTest({
	name: "getVideoSystem()",
	expectedException: false,
	expectedValue: videoSystem,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getVideoSystem();
	}
});

doTest({
	name: "getFirmwareVersion()",
	expectedException: false,
	expectedValue: firmwareVersion,
	reference: "http://bigone/wiki/doku.php?id=blobscript_api",
	test: function() {
		return tvblob.getFirmwareVersion();
	}
});

doTest({
	name: "getFeatureVersion('tvblob')",
	expectedException: false,
	expectedValue: featureVersionTvblob,
	reference: "http://bigone/wiki/doku.php?id=feature",
	test: function() {
		return tvblob.getFeatureVersion("tvblob");
	}
});

doTest({
	name: "getFeatureVersion('BlobPlayer')",
	expectedException: false,
	expectedValue: featureVersionBlobPlayer,
	reference: "http://bigone/wiki/doku.php?id=feature",
	test: function() {
		return tvblob.getFeatureVersion("BlobPlayer");
	}
});

doTest({
	name: "getFeatureVersion('HTTPRelay')",
	expectedException: false,
	expectedValue: featureVersionHTTPRelay,
	reference: "http://bigone/wiki/doku.php?id=feature",
	test: function() {
		return tvblob.getFeatureVersion("HTTPRelay");
	}
});

doTest({
	name: "getFeatureVersion('PushVodFeedsManager')",
	expectedException: false,
	expectedValue: featureVersionPushVodFeedsManager,
	reference: "http://bigone/wiki/doku.php?id=feature",
	test: function() {
		return tvblob.getFeatureVersion("PushVodFeedsManager");
	}
});

doTest({
	name: "getFeatureVersion('BlobRemoteControl')",
	expectedException: false,
	expectedValue: featureVersionBlobRemoteControl,
	reference: "http://bigone/wiki/doku.php?id=feature",
	test: function() {
		return tvblob.getFeatureVersion("BlobRemoteControl");
	}
});
