var inputdata;
var scilabeditor;
var normaleditor;
document.addEventListener('mouseup',function(event)
{
	var sel = window.getSelection().toString();
	if(sel.length)
		chrome.extension.sendRequest({'message':'setText','data': sel},function(response){})
})

$(document).ready(function(){


		var html;
	  if (document.documentElement) {
		html = $(document.documentElement); //just drop $ wrapper if no jQuery
	  } else if (document.getElementsByTagName('html') && document.getElementsByTagName('html')[0]) {
		html = $(document.getElementsByTagName('html')[0]);
	  } else if ($('html').length > -1) {//drop this branch if no jQuery
		html = $('html');
	  } else {
		alert('no html tag retrieved...!');
		throw 'no html tag retrieved son.';
	  }
  var content = "<a id=\"scilab-on-cloud-inline\" href=\"#scilab-on-cloud-data\" style=\"display:none;\">This shows content of element who has id=\"data\"</a><div><div id=\"scilab-on-cloud-data\"></div></div>";
  html.append(content);
  $("a#scilab-on-cloud-inline").fancybox({
		'hideOnContentClick': true,
		'hideOnOverlayClick' : false,
		'hideOnContentClick': false
	});

$("#scilab-run-code").live("click",function(){
	var imgUrl = chrome.extension.getURL("images/spinner.gif");
	$("#scilab-run-code").html("<img src=\""+imgUrl+"\"> Running.....");

	var scilabinput = scilabeditor.getValue();//$("#scilab-code").val();
	//alert(scilabinput);
	$.post(

      "http://127.0.0.1/cloud/scilab_evaluate",
      { scilab_code:scilabinput,graphicsmode:1,external_user:'guest' },

    function( msg ){

		$("#scilab-run-code").html("Run");
		//alert(JSON.parse(msg).output)
		//content = "<img src=\""+"http://scilab-test.garudaindia.in/cloud/graphs/3/"+"/"+msg["graph"]+".png"+"\">"

		var content = "<br/><hr/><h3>Results:<br/> </h3>"+ "<textarea id=\"code-output\">"+JSON.parse(msg).output+"</textarea>";
		if (JSON.parse(msg).graph!=""){
			content += "<img src=\""+"http://127.0.0.1/cloud/graphs/3/"+JSON.parse(msg).graph+".png"+"\">"
		}
		console.log(msg);
	    $("#scilab-output").html(content);
	    var editorout = CodeMirror.fromTextArea(document.getElementById("code-output"), {
					lineNumbers: true
		});

	});
});


	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.typeofrequest == "scilab")
		{


			inputdata = request.data;
			content = "<h3>Input</h3><br/>"+"<br><div id=\"codeblock\"><textarea id=\"scilab-code\">"+inputdata+"</textarea><br/><button id='scilab-run-code'>Run </button> </div><div id=\"scilab-output\"></div><div id=\"scilab-graph\"></div>";
			$("#scilab-on-cloud-data").html(content);
			scilabeditor = CodeMirror.fromTextArea(document.getElementById("scilab-code"), {
				lineNumbers: true,
				mode: "clike"
			});
			//alert(scilabeditor.getValue())

			$("a#scilab-on-cloud-inline").trigger("click");

			sendResponse({farewell: "done"});
		}

	});
});
