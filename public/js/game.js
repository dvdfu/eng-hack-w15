var socket = io();
var users = [];
var me = {};

// elements
var $userList = document.getElementById('list-users');
var $nameField = document.getElementById('input-name');
var $startButton = document.getElementById('btn-start');
var $rolesButton = document.getElementById('btn-start');

$nameField.onkeypress = function(e) {
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
    	submitName($nameField.value);
    }

    function submitName(name) {
		var nameTaken = false;
		users.forEach(function (user) {
			if (name == user.name) nameTaken = true;
		});

		if (name.length > 1 && !nameTaken){
			me.name = name;
			socket.emit('add user', name);
			$nameField.disabled = true;
		}
	}
}

$startButton.onclick = function() {
	socket.emit('request role');
	$startButton.disabled = true;
};

$rolesButton.onclick = function() {
	
};

socket.on('users joined', function (_users) {
	_users.forEach(function (user) {
		users.push(user);

		var $li = document.createElement('li');
		$li.className = 'list-group-item user';
		$li.innerHTML = user.name;
		$li.click(function() {

		});
		$userList.appendChild($li);
	});
	$startButton.disabled = users.length < 5;
});

socket.on('assign role', function (_users) {
	_users.forEach(function (user) {
		if (user.name === me.name) {
			me = user;
		}
	});

	for (var i = 0; i < _users.length; i++) {
		var $currentUser = $('.user:nth-child(' + (_users[i].id + 1) + ')');
		if (_users[i].role === 'spy') {
			$currentUser.css( "border", "13px solid red" );
		} else {

		}
	}
});
