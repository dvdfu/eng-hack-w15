var $rolesButton = document.getElementById('btn-roles');

$rolesButton.onclick = function() {
	showRoles();
};

socket.on('start game', function (_users, _leader, _playersPerMission, _twoFailsMissionFour) {
	leader = _leader;
	playersPerMission = _playersPerMission;
	twoFailsMissionFour = _twoFailsMissionFour;

	$missions.style.display = 'block';
	$gameInfo.style.display = 'block';

	var $leaderView = $('.user:nth-child(' + (leader.id + 1) + ')');
	$leaderView.find(".user-leader").html( '<i class="fa fa-star"></i>' ); // David pls change dis

	if(me.name === leader.name){
		$proposeMissionButton.disabled = true;
		$proposeMissionButton.style.display = 'inline';
		inMissionProposal = true;
	}

	$nameField.style.display = 'none';
	$startButton.style.display = 'none';
	$gameInfo.style.display = 'block';

	_users.forEach(function (user) {
		var $currentUser = $('.user:nth-child(' + (user.id + 1) + ')');
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
	}
	setTimeout(hideRoles, 1000);

	function hideRoles() {
		$spies.forEach(function ($spy) {
			$spy.removeClass('user-spy');
		});
	}
}
