/**
 * The connection module provides syncronous and asyncronous connection tools.
 * 
 * @module connection
 * @namespace TVB
 * @title Connection Manager
 * @requires tvblob, system, event, widgets
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * TVBLOB custom event class
 * @class Connection
 * @classDescription TVBLOB custom event class
 * @return {Void}
 */
TVB.Connection = {
	/**
	 * Set this property to the callback to be called after a successfull XHR connection
	 * @config callback
	 */
	callback: null
};

TVB.Connection.events = {
	loadingstart : $CE.createEvent("loadingstart"),
	loadingstop  : $CE.createEvent("loadingstop"),
	failureevent : $CE.createEvent("failureevent"),
	timeoutevent : $CE.createEvent("timeoutevent")
};

TVB.Connection.config = {};

/**
 * Create a new http asyncronous request
 * @method xmlhttp
 * @constructor
 * @return	{Object}	xmlHttp object
 */
TVB.Connection.xmlhttp = function()
{
	TVB.log("Connection: xmlhttp()");
	var oSelf = this;
	var timeout = 8000;
	var maxRetries = 5;

	var method;
	var url;
	var params;
	var retry = 0;
	var tid;
	var transaction;
	
	this.success = function(o)
	{
		clearTimeout(oSelf.tid);

		TVB.widget.setLoading(false);

		try {
			if (o.responseText !== undefined) {
				if (oSelf.callback) {
					oSelf.callback(o);
				}
			}
		} catch (e) {
		}
	};

	/**
	 * Internal callback for XHR connection
	 * @mathod callback
	 * @private
	 * @since 1.0
	 */
	var callback = 
	{ 
		success:this.success,
		customevents:
		{ 
			onStart:function()
				{
					TVB.widget.setLoading(true);
					$CE.fireEvent(TVB.Connection.events.loadingstart);
				},
			onSuccess:function()
				{
					TVB.widget.setLoading(false);
					$CE.fireEvent(TVB.Connection.events.loadingstop);
					clearTimeout(oSelf.tid);
				},
			onAbort: function()
				{
					TVB.widget.setLoading(false);
					clearTimeout(oSelf.tid);
					TVB.log("Connection: timeout occured");
					$CE.fireEvent(TVB.Connection.events.timeoutevent);
				}
		}
	}; 

	/**
	 * Start a new XHR async connection
	 * @method request
	 * @param	{String}	oMethod		"POST" or "GET"
	 * @param	{String}	oUrl		URI to be called
	 * @param	{Object}	oParams		JSON object to be passed to the POST call
	 * @param	{Number}	oTimeout	Milliseconds for the timeout (default 8000ms)
	 * @since	1.0
	 */
	this.request = function (oMethod,oUrl,oParams,oTimeout)
	{
		TVB.log("Connection: request url " + oUrl);
		if (retry > maxRetries)
		{
			$CE.fireEvent(TVB.Connection.events.failureevent);
			$CE.fireEvent(TVB.Connection.events.loadingstop);
			return;
		}

		if (params === undefined) {
			params = null;
		}

		oSelf.method = oMethod;
		oSelf.url = oUrl;
		oSelf.params = oParams;
		retry ++;

		if (oTimeout === undefined) {
			oTimeout = timeout;
		} else {
			timeout = oTimeout;
		}

		oSelf.transaction = YAHOO.util.Connect.asyncRequest(oSelf.method, oSelf.url , callback, oSelf.params);

		oSelf.tid = setTimeout(function()
			{
				YAHOO.util.Connect.abort(oSelf.transaction);
				clearTimeout(oSelf.tid);
				oSelf.request(oSelf.method,oSelf.url,oSelf.params,Number(oTimeout * 2));
			},oTimeout);
	};

};

/**
 * Perform a sync request and returns the content
 * 
 * @param	{Object}	method	'POST' or 'GET'
 * @param	{Object}	uri
 * @param	{Object}	params
 * @return	{String}	The message returned, false if connection failed
 */
TVB.Connection.syncRequest = function(method, uri, params) {
	try {
		TVB.log("Connection: syncRequest(" + method + ", " + uri + ")");
		TVB.widget.setLoading(true);
		
		var xmlHttp = null;
		if (window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		} else {
			throw UnsupportedError;
		}
		
		xmlHttp.open(method, uri, false);
		xmlHttp.send(params);

		TVB.widget.setLoading(false);

		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			return xmlHttp.responseText;
		} else {
			return false;
		}
	} catch (e) {
		TVB.warning("Connection: syncRequest: " + e.message);
		return false;
	}
};

/**
 * Alias to TVB.Connection
 * @class $C
 */
$C = TVB.Connection;
