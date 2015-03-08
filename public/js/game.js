var socket = io();
var nameButton = document.getElementById('btn-name');
var nameField = document.getElementById('input-name');

nameButton.onclick = function() {
	submitName(nameField.value);
};

function submitName( name ){
	socket.emit('add user', name);
	alert(name);
}