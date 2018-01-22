$(function () {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('ws://localhost:3000');

	$(document).mousemove(function(event){
    connection.send(event.pageX + ", " + event.pageY);
	});
  
  connection.onopen = function () {
	console.log("connection opened");
  };

  connection.onerror = function (error) {
	  console.log("connection error");
  };

  connection.onmessage = function (message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('error data', message.data);
      return;
    }
	
	var div = document.getElementById('content');;
    div.innerHTML += message.data + "<br>";

  };
});