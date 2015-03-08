var socket = io();
var nameButton = document.getElementById('btn-name');
var nameField = document.getElementById('input-name');
var startButton = document.getElementById('btn-start');
var userList = document.getElementById('list-users');

startButton.disabled = true;

nameButton.onclick = function() {
	submitName(nameField.value);
};

startButton.onclick = function(){
	socket.emit('start game');
};

socket.on('users joined', function (users) {
	users.forEach(function (user) {
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(user.name));
		userList.appendChild(li);
	});
});

socket.on('allow game start', function(){
	startButton.disabled = false;
});

function submitName( name ){
	if (name.length > 1){
		socket.emit('add user', name);
		nameButton.disabled = true;
		nameField.disabled = true;
	}
}