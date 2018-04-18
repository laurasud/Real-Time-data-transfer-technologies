$(function() {
	var data = {};
	var send = [];
	var url = document.URL;
	
	mousemove = window.addEventListener("mousemove", function(event){
		data = {
				"url": url,
				"time": Date(),
				"mousepositionX": event.pageX,
				"mousepositionY": event.pageY,
				"count": 1
				}
		toArray(data);
	})
	
	function toArray(data) {
			//console.log("data");
			var unique = true;
			for (var i=1; i<send.length; i++){
				if(send[i].mousepositionX === data.mousepositionX && send[i].mousepositionY === data.mousepositionY ){
					send[i].count++;
					unique=false;
				}else{
					unique=true;
				}
			}
			if (unique === true){
				send.push(data);
			}	
	}
	
	
	(function poll(){
		console.log(send);
    $.ajax({ 
		url: "http://localhost:3002/poll",
		type: "POST",
		dataType: 'json',
		data: {data: JSON.stringify(send)},
		success: function(){
			send = [];
		},
		error: function (request, status, error) {
			console.log(request.responseText);
		},complete: poll, timeout: 3000 });
		send = [];
	})();
	
});