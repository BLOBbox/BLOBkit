/*
	category: BLOBkit
	name: Connection - Asyncronous - GET
	toolTip: Asyncronous connection - GET
*/
var req = new TVB.Connection.xmlhttp(); 
req.callback = function(o)
{
	var responseText = o.responseText;
};				

var params = 'param1=myParam1&param2=myParam2';
var uri = '${selection}';
var timeout = 5000;
req.request('GET', uri + '?' + params, null, timeout);
