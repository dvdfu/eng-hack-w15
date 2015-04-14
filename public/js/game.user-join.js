var $nameField = document.getElementById('input-name');
var $nameInputGroup = document.getElementById('name-input-group');
var $userList = document.getElementById('list-users');
var $startButton = document.getElementById('btn-start');
var $nameSubmit = document.getElementById('submit-name');

function submitName(name) {
	var nameTaken = false;
	users.forEach(function (user) {
		if (name == user.name) nameTaken = true;
	});

	if (name.length > 0){
		if (!nameTaken) {
			me.name = name;
			socket.emit('add user', name);
			$nameField.disabled = true;
			$nameSubmit.disabled = true;
		} else {
			showInstruction(name + ' has already been taken!');
		}
	} else {
		showInstruction('Enter a name!');
	}
}

$nameField.onkeypress = function(e) {
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
    	submitName($nameField.value);
    }
}

$nameSubmit.onclick = function() {
	submitName($nameField.value);
};

$startButton.onclick = function() {
	socket.emit('request role');
	$startButton.disabled = true;
};

socket.on('users joined', function (_users) {
	_users.forEach(function (user) {
		users.push(user);

		var $li = document.createElement('li');
		$li.className = 'list-group-item user';
		$li.innerHTML = '<div class="row"><div class="col-xs-2 user-leader"></div>' + 
			'<div class="col-xs-8 user-name">' + user.name + '</div>' +
			'<div class="col-xs-2 user-vote"></div></div>';
		$li.onclick = function() {
			if(me.id === leader.id && inMissionProposal){
				if($li.classList.contains('selected')){
					$proposeMissionButton.disabled = true;
					$li.classList.remove("selected");
					var index = selectedUsers.indexOf(user);
					selectedUsers.splice(index, 1);
				}else if(selectedUsers.length < playersPerMission[currentMission]){
					$li.classList.add("selected");
					selectedUsers.push(user);
					if(selectedUsers.length === playersPerMission[currentMission]){
						$proposeMissionButton.disabled = false;
					}
				}
			}
		};
		$userList.appendChild($li);
	});
	if (users.length < 5) {
		$startButton.disabled = true;
		showInstruction('Need ' + (5 - users.length) + ' more players to begin!');
	} else {
		$startButton.disabled = false;
		showInstruction('Ready to play!');
	}
});