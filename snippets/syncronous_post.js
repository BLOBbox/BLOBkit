/*
	category: BLOBkit
	name: Connection - Syncronous - POST
	toolTip: Syncronous connection - POST
*/
var params = 'param1=value1&param2=value2'
var responseText = TVB.Connection.syncRequest('POST', '${selection}', params);
