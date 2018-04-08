$(function () {
	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	
	var connection = new WebSocket('ws://localhost:3000'); //sinchroninis ar asinchroninis
	var data = {};
	var url = document.URL;
	var mousemove; //mousemove event
	

	connection.onopen = function () {
		console.log("connection opened");
		mousemove = window.addEventListener("mousemove", function(event){ //count
		data = {
			"url": url,
			"time": Date(),
			"mousepositionX": event.pageX,
			"mousepositionY": event.pageY
		}
		connection.send(JSON.stringify(data));	//pasidaryti masyva	
	});
	 };

	connection.onerror = function (error) {
		console.log("connection error");
		document.removeEventListener("mousemove", mousemove);
	};
	
	connection.onclose = function () {
		console.log("connection closed");
		document.removeEventListener("mousemove", mousemove);
	}
});