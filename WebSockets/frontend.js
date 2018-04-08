$(function () {
	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	
	var connection = new WebSocket('ws://localhost:3000'); //sinchroninis ar asinchroninis
	var data = {};
	var url = document.URL;
	var ip; //ip address
	var mousemove; //mousemove event

	$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
	  ip = data.geobytesremoteip
	}); //is serverio
	
	document.addEventListener("mousemove", mousemove);
	
	function mousemove(event){ //count
		data = {
			"domain": url,
			"userID": ip,
			"time": Date(),
			"mousepositionX": event.pageX,
			"mousepositionY": event.pageY
		}
		connection.send(JSON.stringify(data));	//pasidaryti masyva	
	}; //patikrinti ant narsykliu
  
	connection.onopen = function () {
		console.log("connection opened");
		mousemove();
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