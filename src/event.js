/**
 * Custom Events Manager
 * @module event
 * @namespace TVB
 * @title Custom Events Manager
 * @requires tvblob, system
 * @author Edoardo Esposito edoardo.esposito@tvblob.com
 */

/**
 * BLOBkit custom event class
 * @class CustomEvent
 * @static
 */
TVB.CustomEvent = {};

/**
 * Creates a new custom event
 * @method createEvent
 * @param {String} eventName The name of the event
 * @return {Event} The event
 * @exception {EventError}
 * @exception {TypeError}
 */
TVB.CustomEvent.createEvent = function(eventName) {
	try {
		TVB.log("Event: createEvent(" + eventName + ")");
		if (eventName === undefined) {
			throw TypeError;
		}
		var ev = new YAHOO.util.CustomEvent(eventName);
		return ev;
	} catch (e) {
		TVB.warning("Event: createEvent: " + e.message);
		throw EventError;
	}
};

/**
 * Subscribes to a custom event
 * @method subscribeEvent
 * @param {Event} ev	The custom event
 * @param {Function} callback	A function to be raised
 * @param {Object}   obj        An object to be passed along when the event fires
 * @param {Boolean}  override   If true, the obj passed in becomes the execution
 *                              scope of the listener 
 * @exception {EventError}
 * @exception {TypeError}
 */
TVB.CustomEvent.subscribeEvent = function(ev, callback, obj, override) {
	try {
		TVB.log("Event: subscribeEvent(" + ev + ")");
		if (typeof ev !== 'object') {
			throw TypeError;
		}
		ev.subscribe(callback, obj, override);
	} catch (e) {
		if (e == TypeError) {
			throw TypeError;
		} else {
			TVB.warning("Event: subscribeEvent: " + e.message);
			throw EventError;
		}
	}
};

/**
 * Unsubscribes to a custom event
 * @method unsubscribeEvent
 * @param {Event} ev The custom event
 * @exception {EventError}
 */
TVB.CustomEvent.unsubscribeEvent = function(ev) {
	try {
		TVB.log("Event: unsubscribeEvent(" + ev + ")");
		ev.unsubscribe();
	} catch (e) {
		TVB.warning("Event: unsubscribeEvent: " + e.message);
		throw EventError;
	}
};

/**
 * Fires a custom event
 * @method fireEvent
 * @param {Event} ev The custom event
 * @param {Object} params Parameters to be passed to the callback
 * @exception {EventError}
 */
TVB.CustomEvent.fireEvent = function(ev,params) {
	try {
		TVB.log("Event: fireEvent(" + ev + ")");
		ev.fire(params);
	} catch (e) {
		TVB.warning("Event: fireEvent: " + e.message);
		throw EventError;
	}
};

/**
 * Stops event propagation
 * @method stopPropagation
 * @param {Event} ev The custom event
 * @exception {EventError}
 */
TVB.CustomEvent.stopPropagation = function(ev) {
	try {
		TVB.log("Event: stopPropagation(" + ev + ")");
		YAHOO.util.Event.stopPropagation(ev);
	} catch (e) {
		TVB.warning("Event: stopPropagation: " + e.message);
		throw EventError;
	}
};

/**
 * Stops event propagation and prevents the default behaviour
 * @method stopEvent
 * @param {Event} ev The custom event
 * @exception {EventError}
 */
TVB.CustomEvent.stopEvent = function(ev) {
	try {
		TVB.log("Event: stopEvent(" + ev + ")");
		YAHOO.util.Event.stopEvent(ev);
	} catch (e) {
		TVB.warning("Event: stopEvent: " + e.message);
		throw EventError;
	}
};


/**
 * Alias to TVB.CustomEvent
 * @class $CE
 */
$CE = TVB.CustomEvent;

