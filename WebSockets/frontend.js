$(function () {
	start();
	function start(websocketServerLocation){
		
		// if user is running mozilla then use it's built-in WebSocket
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		var connection = new WebSocket('ws://localhost:3000'); //sinchroninis ar asinchroninis
		
		var data = {};
		var url = document.URL;
		var mousemove; //mousemove event
		var conn;

		connection.onopen = function () {
			conn=true;
			console.log("connection opened");
			mousemove = window.addEventListener("mousemove", function(event){ //count
			data = {
				"url": url,
				"time": Date(),
				"mousepositionX": event.pageX,
				"mousepositionY": event.pageY
			}
			if (conn == true){
			connection.send(JSON.stringify(data));	//pasidaryti masyva	
			}
		});
		 };

		connection.onerror = function (error) {
			document.removeEventListener("mousemove", mousemove);
			setTimeout(function(){start(websocketServerLocation)}, 5000); //reconnect every 5sec
		};
		
		connection.onclose = function () {
			document.removeEventListener("mousemove", mousemove);
			conn = false;
			setTimeout(function(){start(websocketServerLocation)}, 5000); //reconnect every 5sec
		}
	}
});