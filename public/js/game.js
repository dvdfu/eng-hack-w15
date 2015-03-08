var socket = io();
var usernames = [];
var me = {};

// elements
var $userList = document.getElementById('list-users');
var $nameField = document.getElementById('input-name');
var $startButton = document.getElementById('btn-start');

$nameField.onkeypress = function(e) {
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
    	submitName($nameField.value);
    }

    function submitName(name) {
		var nameTaken = false;
		usernames.forEach(function (username) {
			if (name == username) nameTaken = true;
		});

		if (name.length > 1 && !nameTaken){
			me.name = name;
			socket.emit('add user', name);
			$nameField.disabled = true;
		}
	}
}

$startButton.onclick = function() {
	socket.emit('start game');
	$startButton.disabled = true;
};

socket.on('users joined', function (users) {
	users.forEach(function (user) {
		usernames.push(user.name);

		var $li = document.createElement('li');
		$li.className = 'list-group-item user';
		$li.innerHTML = user.name;
		$li.click(function() {

		});
		$userList.appendChild($li);
	});
	$startButton.disabled = usernames.length < 5;
});

socket.on('assign role', function (users) {
	users.forEach(function (user) {
		if (user.name === me.name) {
			me = user;
		}
	});
	// if (me.role === 'spy') {
		for (var i = 0; i < users.length; i++) {
			var $currentUser = $('.user:nth-child(' + (users[i].id + 1) + ')');
			if (users[i].role === 'spy') {
				$currentUser.css( "border", "13px solid red" );
			} else {

			}
		}
	// }
	// users.forEach(function (user) {
	// 	if (user.name == myUser.name) {
	// 		myUser = user;
	// 	}
	// 	if (user.role == 'spy') {
	// 		var $li = document.createElement('li');
	// 		$li.className = 'list-group-item';
	// 		$li.appendChild(document.createTextNode(user.name));
	// 		spyList.appendChild($li);
	// 	}
	// });
	// roleMessage.innerHTML = myUser.role.toUpperCase();
	// spyList.style.display = (myUser.role == 'spy') ? 'block' : 'none';

	// joinGameView.style.display = 'none';
	// bigShowRoleButton.style.display = 'block';
});