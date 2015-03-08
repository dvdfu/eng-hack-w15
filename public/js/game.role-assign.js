var $rolesButton = document.getElementById('btn-roles');

$rolesButton.onclick = function() {
	showRoles();
};

socket.on('start game', function (_users, _leader, _playersPerMission, _twoFailsMissionFour) {
	leader = _leader;
	playersPerMission = _playersPerMission;
	for (var i = 0; i < playersPerMission.length; i++) {
		var mission = $('.mission:nth-child(' + (i + 1) + ')');
		mission.html(playersPerMission[i]);
	}
	twoFailsMissionFour = _twoFailsMissionFour;

	$missions.style.display = 'block';
	$gameInfo.style.display = 'block';

	setLeaderDisplay();

	$nameField.style.display = 'none';
	$startButton.style.display = 'none';
	$gameInfo.style.display = 'block';

	_users.forEach(function (user) {
		var $currentUser = getUserListItem(user);
		if (user.name === me.name) {
			me = user;
			$me = $currentUser;
			$me.addClass('user-self');
		}
		if (user.role === 'spy') {
			$spies.push($currentUser);
		}
	});

	showRoles();
});

function showRoles() {
	if (me.role === 'spy') {
		$spies.forEach(function ($spy) {
			$spy.addClass('user-spy');
		});
		showInstruction('You\'re a spy!');
	}
	setTimeout(hideRoles, 1000);

	function hideRoles() {
		$spies.forEach(function ($spy) {
			$spy.removeClass('user-spy');
		});
	}
}
