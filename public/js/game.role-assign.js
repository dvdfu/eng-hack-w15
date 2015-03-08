var $rolesButton = document.getElementById('btn-roles');
var $twoFailsText = document.getElementById('two-fails');

$rolesButton.onclick = function() {
	showRoles();
};

socket.on('start game', function (_users, _leader, _playersPerMission, _twoFailsMissionFour) {
	leader = _leader;
	playersPerMission = _playersPerMission;
	setProposalFails(0);
	for (var i = 0; i < playersPerMission.length; i++) {
		var $mission = $('.mission:nth-child(' + (i + 1) + ')');
		var string = '' + playersPerMission[i];
		if (i === 3 && _twoFailsMissionFour) {
			string += '*';
		}
		$mission.html(string);
		if (i === 0) {
			$mission.addClass('current-mission');
		}
	}
	twoFailsMissionFour = _twoFailsMissionFour;

	$twoFailsText.style.display = twoFailsMissionFour ? 'block' : 'none';


	$missions.style.display = 'block';
	$gameInfo.style.display = 'block';

	setLeaderDisplay();

	$nameField.style.display = 'none';
	$startButton.style.display = 'none';
	$gameInfo.style.display = 'block';

	users = _users;
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
	var string = '\nAs this round\'s leader, select ' + playersPerMission[currentMission] + ' users by tapping them.';
	if (me.role === 'spy') {
		$spies.forEach(function ($spy) {
			$spy.addClass('user-spy');
		});
		showInstruction('You\'re a <b>spy</b>!' + (me.name === leader.name ? string : ''));
	} else {
		showInstruction('You\'re a <b>resistance member</b>!' + (me.name === leader.name ? string : ''));
	}
	setTimeout(hideRoles, 1000);

	function hideRoles() {
		$spies.forEach(function ($spy) {
			$spy.removeClass('user-spy');
		});
	}
}
