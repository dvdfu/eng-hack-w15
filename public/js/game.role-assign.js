var $rolesButton = document.getElementById('btn-roles');

$rolesButton.onclick = function() {
	// $me.
};

socket.on('assign role', function (_users) {
	$nameField.style.display = 'none';
	$startButton.style.display = 'none';
	$gameInfo.style.display = 'block';
	_users.forEach(function (user) {
		var $currentUser = $('.user:nth-child(' + (user.id + 1) + ')');
		if (user.name === me.name) {
			me = user;
			$me = $currentUser;
			$me.css( "background-color", "#ff0" );
		}
		if (user.role === 'spy') {
			$spies.push($currentUser);
		}
	});
	if (me.role === 'spy') {
		$spies.forEach(function ($spy) {
			$spy.css( "border", "5px solid red" );
		})
	}
});
