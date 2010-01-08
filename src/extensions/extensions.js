/**
 * Custom Javascript Extensions
 * @module extensions
 * @title Custom Javascript Extensions
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * Trims a string to len 
 * @method String.trim
 * @param {Integer} len is the length of the required string
 * @param {String} p is the string to prepend to the returned string
 */
String.prototype.trim = function(len,p) {
    if (this.length <= len) {
		return this.toString();
	}

    var output=[];

    for (var i = 0; i < len; i++) {
		output.push(this[i]);
	}

    return output.join("")+p;
};

/**
 * Sets a date string into ISO8601 format
 * @method Date.setISO8601
 * @param {String} string is the string of the date
 */
Date.prototype.setISO8601 = function(string) {
	var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "([T,\ ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";

	if (string === undefined || string === null) {
		return;
	}

	var d = string.match(new RegExp(regexp));

	var offset = 0;
	var date = new Date(d[1], 0, 1);

	if (d[3]) { date.setMonth(d[3] - 1); }
	if (d[5]) { date.setDate(d[5]); }
	if (d[7]) { date.setHours(d[7]); }
	if (d[8]) { date.setMinutes(d[8]); }
	if (d[10]) { date.setSeconds(d[10]); }
	if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
	if (d[14]) {
	    offset = (Number(d[16]) * 60) + Number(d[17]);
	    offset *= ((d[15] == '-') ? 1 : -1);
	}
	
	offset -= date.getTimezoneOffset();
	time = (Number(date) + (offset * 60 * 1000));
	this.setTime(Number(time));
};

/**
 * Converts a date into day/month/year format
 * @method Date.stringify
 */
Date.prototype.stringify = function() {
	var h = parseInt(this.getHours() - 1, 10);
	var m = this.getMinutes();
	if (m < 10) {m = '0' + m;}
	var d = '';
	d += this.getDate() + '/' + parseInt(this.getMonth() + 1, 10) + '/' + this.getFullYear() + ' ';
	return d;
};
