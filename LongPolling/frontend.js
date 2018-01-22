var data = [0,1,2,3,4,5,6,7,8,9,10];
var poll = function () {
	$.ajax({
		url: "http://localhost:3002/poll",
		data: {id: data},
		success: function(data){
		console.log(data);
		var div = document.getElementById('content');;
		div.innerHTML += data.data + "</br>";
		poll();
		},
		error: function() {
			poll();
		},
			timeout: 10000 // 10 sec
		});
};
poll();