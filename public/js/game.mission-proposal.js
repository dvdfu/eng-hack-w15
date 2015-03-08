var $proposeMissionButton = document.getElementById('btn-propose-mission');

$proposeMissionButton.onclick = function() {
	socket.emit('mission proposed', selectedUsers);
};