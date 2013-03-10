var seltext = null;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
	
	switch(request.message)
	{
		case 'setText':
			window.seltext = request.data
			console.log(request.data);
		break;



		default:
			sendResponse({data: 'Invalid arguments'});
		break;
	}

});


function savetext(info,tab)
{
	chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {typeofrequest: "input",data:seltext}, function(response) {
		var resp = response.farewell;
		});
	});


}

function runOnScilab(info,tab)

{
	console.log("SSS")
	chrome.tabs.getSelected(null, function(tab) {
		console.log("DDD"+seltext);
	chrome.tabs.sendMessage(tab.id, {typeofrequest: "scilab",data:seltext}, function(response) {
		var resp = response.farewell;
		});
	});


}


var context = "selection";
var title = "Run as Scilab Code";
var second_params = {
 "id": "second_id",
 "title": "Run as Code",
 "type": "normal",
 "contexts":["selection"],
 "onclick": runOnScilab
};
chrome.contextMenus.create(second_params);
