/*
	category: BLOBkit
	name: Connection - Asyncronous - POST
	toolTip: Asyncronous connection - POST
*/
var req = new TVB.Connection.xmlhttp(); 
req.callback = function(o)
{
	var responseText = o.responseText;
};				

var params = 'param1=myParam1&param2=myParam2';
var uri = '${selection}';
var timeout = 5000;
req.request('POST', uri, params, timeout);
