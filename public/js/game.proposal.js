function showVotes(proposalVotes){
	for(var userId in proposalVotes){
		$userListItem = $('.user:nth-child(' + (userId + 1) + ')');
		var $vote = $userListItem.find('user-vote');
		if(proposalVotes[userId]){
			$vote.classList.add('accepted');
		}else{
			$vote.classList.add('rejected');
		}
	}
}

$proposeMissionButton.onclick = function() {
	inMissionProposal = false;
	socket.emit('mission proposed', selectedUsers);
};

$acceptButton.onclick = function(){
	socket.emit('sent proposal vote', me, true);
	hideAllButtons();
	// show waiting for other user actions?
};

$refuseButton.onclick = function(){
	socket.emit('sent proposal vote', me, false);
	hideAllButtons();
	// show waiting for other user actions?
}

socket.on('mission proposed', function(usersOnMission){
	// shows selected users for everyone
	console.log(usersOnMission);
	for (var i = 0; i < usersOnMission.length; i++) {
		var $selected = getUserListItem(usersOnMission[i]);
		if(!$selected.hasClass('selected')){
			$selected.addClass("selected");
		}
	};
	// display vote buttons
	hideAllButtons();
	$acceptButton.style.display = 'inline';
	$refuseButton.style.display = 'inline';
});

socket.on('proposal passed', function(proposalVotes, playersOnMission){
	showVotes(proposalVotes);
});

socket.on('proposal rejected', function(proposalVotes, newLeader, _consecutiveFailedProposals){
	consecutiveFailedProposals = _consecutiveFailedProposals;
	missionReset();
	leader = newLeader;
	setLeaderDisplay();
	showVotes(proposalVotes);
});