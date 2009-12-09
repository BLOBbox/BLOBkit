/** Template

doTest({
	name: "",
	expectedException: false,
	expectedValue: true,
	test: function() {
		return true;
	}
});

*/

// Control tests

doTest({
	name: "true is true (expected success)",
	expectedException: false,
	expectedValue: true,
	test: function() {
		return true;
	}
});

doTest({
	name: "false is not true (expected fail)",
	expectedException: false,
	expectedValue: true,
	test: function() {
		return false;
	}
});

// System calls

doTest({
	name: "getTvblobNumber()",
	expectedException: isUntrustedPage,
	expectedValue: tvblobNumber,
	test: function() {
		return tvblob.getTvblobNumber();
	}
});

doTest({
	name: "getSMOJVersion()",
	expectedException: false,
	expectedValue: SMOJVersion,
	test: function() {
		return tvblob.getSMOJVersion();
	}
});

doTest({
	name: "getProductName()",
	expectedException: false,
	expectedValue: productName,
	test: function() {
		return tvblob.getProductName();
	}
});

doTest({
	name: "getProductVersion()",
	expectedException: false,
	expectedValue: productVersion,
	test: function() {
		return tvblob.getProductVersion();
	}
});
