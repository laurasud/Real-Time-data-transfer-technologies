$(function () {
	start();
	function start(){
		
		// if user is running mozilla then use it's built-in WebSocket
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		var connection = new WebSocket('ws://localhost:3000');
		
		var data = {};
		var send = [{}];
		var url = document.URL;
		var mousemove; //mousemove event
		var conn;

		connection.onopen = function () {
			conn=true;
			console.log("connection opened");
			mousemove = window.addEventListener("mousemove", function(event){ //count
				if (conn == true){
					data = {
						"url": url,
						"time": Date(),
						"mousepositionX": event.pageX,
						"mousepositionY": event.pageY
					}
					toArray(data);
				}
			});
		};
		
		function toArray(data) {
			console.log("data");
			if (send.length === 200){
				connection.send(JSON.stringify(send));
				send = [{}];
			}
			else{
				send.push(data);
			}	
		}

		connection.onerror = function (error) {
			document.removeEventListener("mousemove", mousemove);
			setTimeout(function(){start()}, 5000); //reconnect every 5sec
		};
		
		connection.onclose = function () {
			document.removeEventListener("mousemove", mousemove);
			conn = false;
			setTimeout(function(){start()}, 5000); //reconnect every 5sec
		}
	}
});