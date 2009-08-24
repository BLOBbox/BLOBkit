/**
 * <h1>Tuner Manager for BLOBbox</h1>
 * 
 * <h2>channelObject</h2>
 * <dl>
 * 		<dt>ID:</dt><dd>String, unique identifier of the channel</dd>
 * 		<dt>name:</dt><dd>String, human readable channel name</dd>
 * 		<dt>uri:</dt><dd>String, URI of the channel, ready to the player</dd>
 *      <dt>number:</dt><dd>Integer, the number of the channel following LCN and user's ordering</dd>
 * </dl>
 * 
 *
 * @module tuner
 * @namespace TVB
 * @title Tuner Manager
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 */

/**
 * Object for handling the Tuner Manager
 * @class tuner
 * @static
 * @namespace TVB
 */
TVB.tuner = {};

/**
 * Count the number of DVB channels available to user.<br />
 * This function requires that the user authorize the use in current application (a popup screen is displayed)
 * @method countDvbChannels
 * @return {Integer} the number of channels available, null if the requested information is not available
 */
TVB.tuner.countDvbChannels = function() {
	try {
		TVB.log("Tuner: countDvbChannels()");
		var tuner = BlobTunerManager();
		return tuner.getAllTunerChannels().length;
	} catch (e) {
		TVB.error("Tuner: countDvbChannels:" + e.message);
		return null;
	}
};

/**
 * Get all "scanned" DVB channels available to the user.<br />
 * This function requires that the user authorize the use in current application (a popup screen is displayed)
 * @method getDvbChannelsList
 * @return {Object} channelObject[]
 */
TVB.tuner.getDvbChannelsList = function() {
	try {
		TVB.log("Tuner: getDvbChannelsList()");
		var tuner = BlobTunerManager();
		var list = tuner.getAllTunerChannels();
		var data = [];
		for (var i in list) {
			var co = {};
			co.ID = list[i].getID();
			co.name = list[i].getName();
			co.uri = list[i].getURI();
			co.number = i; // will be replaced with the LCN
			data.push(co);
		}
		return data;
	} catch (e) {
		TVB.error("Tuner: getDvbChannelsList:" + e.message);
		return null;
	}
};
