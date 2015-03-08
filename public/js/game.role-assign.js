var $rolesButton = document.getElementById('btn-roles');

$rolesButton.onclick = function() {
	// $me.
};

socket.on('start game', function (_users, _leader, _playersPerMission, _twoFailsMissionFour) {
	leader = _leader;
	playersPerMission = _playersPerMission;
	twoFailsMissionFour = _twoFailsMissionFour;

	$missions.style.display = 'block';
	$gameInfo.style.display = 'block';

	var $leaderView = $('.user:nth-child(' + (leader.id + 1) + ')');
	$leaderView.find(".user-leader").html( 'LEAD' ); // David pls change dis

	if(me.name === leader.name){
		options.innerHTML = '<button id="btn-propose-mission" type="button" class="btn btn-primary">Propose Mission</button>';
	}

	$nameField.style.display = 'none';
	$startButton.style.display = 'none';
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
