/*
	category: BLOBkit
	name: Player - Full
	toolTip: Add a fully configurable media player
*/
var playerConfig = {
	disableRemote: false, // disable the automatic configuration of the remote control
	switchKey: 'OK', // the key to switch from full screen from boxed player; use null to disable the feature
	uri: '${selection}', // the url to be played
	autoplay: false, // if true, the player starts immediatly to play
	top: 160, // the top coord of the boxed player
	left: 160, // the left coord of the boxed player
	fullscreen: false, // if true, the player starts fullscreen
}
TVB.player.init(playerConfig);
