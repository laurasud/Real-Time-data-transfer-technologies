$(function() {
	start();
	function start(){
		// if user is running mozilla then use it's built-in WebSocket
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		var connection = new WebSocket('ws://localhost:3000');
		
		var data = {};
		var send = [];
		var url = document.URL;
		var mousemove; //mousemove event
		var conn;

		connection.onopen = function () {
			conn=true;
			console.log("connection opened");
			mousemove = window.addEventListener("mousemove", function(event){
				if (conn == true){
					data = {
						"url": url,
						"time": Date(),
						"mousepositionX": event.pageX,
						"mousepositionY": event.pageY,
						"count": 1
					}
					toArray(data);
				}
			});
		};
		
		function toArray(data) {
			//console.log("data");
			var unique = true;
			if (send.length === 200){
				connection.send(JSON.stringify(send));
				send = [];
			} else{
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
					//console.log ("saved");
				}
			}	
		}

		connection.onerror = function (error) {
			document.removeEventListener("mousemove", mousemove);
			console.log("connectio error");
			setTimeout(function(){start()}, 5000); //reconnect every 5sec
		};
		
		connection.onclose = function () {
			document.removeEventListener("mousemove", mousemove);
			conn = false;
			console.log("connection closed");
			setTimeout(function(){start()}, 5000); //reconnect every 5sec
		}
	}
});