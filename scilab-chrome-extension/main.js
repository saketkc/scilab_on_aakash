$(document).ready(function(){
	var editorout = CodeMirror.fromTextArea(document.getElementById("output"), {
					lineNumbers: true
	});
	var editorin = CodeMirror.fromTextArea(document.getElementById("input"), {
					lineNumbers: true
	});

$("#run-code").click(function(){
		$("#run-code").html("<img src=\"images/spinner.gif\">Running....");
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1/cloud/scilab_evaluate",
			data: { scilab_code: editorin.getValue(),graphicsmode:1,external_user:'guest' },
            dataType:'json',
			}).done(function( msg ) {
				$("#run-code").html("Run")
				editorout.setValue(msg["output"]);
				if (msg["graph"]!="")
				{
					content = "<img src=\""+"http://127.0.0.1/cloud/graphs/3/"+"/"+msg["graph"]+".png"+"\">"
					$("#scilab-graph").html(content);
				}
			});
	});
});
