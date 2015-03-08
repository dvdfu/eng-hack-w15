$failButton.onclick = function(){
	hideAllButtons();
	socket.emit('sent mission vote', me, false);
	showInstruction("Waiting on other players' actions...");
}

$succeedButton.onclick = function(){
	hideAllButtons();
	socket.emit('sent mission vote', me, true);
	showInstruction("Waiting on other players' actions...");
}

socket.on('mission end', function(failed, missionSuccessVotes, missionFailVotes, _currentMission, newLeader){
	// display mission results dramatically?? david's job
	for (var i = 0; i < 5; i++) {
		var $mission = $('.mission:nth-child(' + (i + 1) + ')');
		if (i === currentMission) {
			$mission.removeClass('current-mission');
			if (failed) $mission.addClass('failed-mission');
			else $mission.addClass('passed-mission');
		}
	}

	missionReset();
	hideAllVotes();
	currentMission = _currentMission;

	var $mission = $('.mission:nth-child(' + (currentMission + 1) + ')');
	$mission.addClass('current-mission');

	leader = newLeader;
	setLeaderDisplay();
	showInstruction('The new leader is now ' + leader.name + '.');
	inMissionProposal = true;
});

socket.on('game over', function(resistanceWins, missionSuccessVotes, missionFailVotes){
	$mainPage.style.display = 'none';
	$gameFinish.style.display = 'block';
	var winningTeam = [];
	if (resistanceWins) {
		$gameFinish.innerHTML = '<h3>The Resistance win the game!</h3>';
		users.forEach(function (user) {
			if (user.role === 'resistance') winningTeam.push(user.name);
		});
	} else {
		$gameFinish.innerHTML = '<h3>The Spies win the game!</h3>';
		users.forEach(function (user) {
			if (user.role === 'spy') winningTeam.push(user.name);
		});
	}

	$gameFinish.innerHTML += '<ul>';
	winningTeam.forEach(function (username) {
		$gameFinish.innerHTML += '<li>' + username + '</li>';
	});
	$gameFinish.innerHTML += '</ul>';

	setTimeout(function () {
		socket.emit('reset game');
	}, 5000);
});