/**
 * <h1>Tuner Manager for BLOBbox</h1>
 * 
 * <h2>channelObject</h2>
 * <dl>
 * 		<dt>uri:</dt><dd></dd>
 * 		<dt>uri:</dt><dd></dd>
 * 		<dt>uri:</dt><dd></dd>
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
TVB.tuner = {}

/**
 * Count the number of DVB channels available to user.
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
}

/**
 * Get all "scanned" DVB channels available to the user.
 * @method getDvbChannelsList
 * @return {Object} channelObject[]
 */
TVB.tuner.getDvbChannelsList = function() {
	try {
		TVB.log("Tuner: getDvbChannelsList()");
		var tuner = BlobTunerManager();
	} catch (e) {
		TVB.error("Tuner: getDvbChannelsList:" + e.message);
		return null;
	}
}
