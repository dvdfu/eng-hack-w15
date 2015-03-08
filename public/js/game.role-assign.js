var $rolesButton = document.getElementById('btn-roles');

$rolesButton.onclick = function() {
	if (me.role === 'spy') {

	} else if (me.role == 'resistance') {

	}
};

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
