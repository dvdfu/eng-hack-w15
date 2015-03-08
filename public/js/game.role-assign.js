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
		options.innerHTML = '<button id="btn-propose-mission" type="button" class="btn btn-primary">Propose Mission</button>';
	}

	$nameField.style.display = 'none';
	$startButton.style.display = 'none';
	$gameInfo.style.display = 'block';

	_users.forEach(function (user) {
		var $currentUser = $('.user:nth-child(' + (user.id + 1) + ')');
		if (user.name === me.name) {
			me = user;
			$me = $currentUser;
		}
		if (user.role === 'spy') {
			$spies.push($currentUser);
		}
	});

	showRoles();
});

function showRoles() {
	$me.addClass('user-self');
	if (me.role === 'spy') {
		$spies.forEach(function ($spy) {
			$spy.addClass('user-spy');
		});
	}
	setTimeout(hideRoles, 1000);

	function hideRoles() {
		$me.removeClass('user-self');
		$spies.forEach(function ($spy) {
			$spy.removeClass('user-spy');
		});
	}
}
