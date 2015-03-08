function showVotes(proposalVotes){
	for(var userId in proposalVotes){
		$userListItem = $('.user:nth-child(' + (parseInt(userId) + 1) + ')');
		$userRow = $userListItem.find('.row');
		var $vote = $userRow.find('.user-vote');
		if(proposalVotes[userId]){
			$vote.addClass('accepted');
		}else{
			$vote.addClass('rejected');
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
	showInstruction("Waiting on other players' actions...");
};

$refuseButton.onclick = function(){
	socket.emit('sent proposal vote', me, false);
	hideAllButtons();
	showInstruction("Waiting on other players' actions...");
}

socket.on('mission proposed', function(usersOnMission){
	// shows selected users for everyone
	if (leader.name === me.name) {
		showInstruction('Vote on your proposal!');
	} else {
		showInstruction('Vote on ' + leader.name + '\'s proposal!');
	}
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

socket.on('proposal passed', function(proposalVotes, playersOnMission, _consecutiveFailedProposals){
	setProposalFails(_consecutiveFailedProposals);
	showVotes(proposalVotes);
	showInstruction('Proposal passed! The players chosen are now in the mission.');
	hideAllButtons();
	playersOnMission.forEach(function(player){
		if(me.id === player.id){
			if(me.role === 'resistance') $failButton.disabled = true;
			$failButton.style.display = 'inline';
			$succeedButton.style.display = 'inline';
		}
	});
});

socket.on('proposal rejected', function(proposalVotes, newLeader, _consecutiveFailedProposals){
	setProposalFails(_consecutiveFailedProposals);
	missionReset();
	leader = newLeader;
	setLeaderDisplay();
	showVotes(proposalVotes);
	showInstruction('Proposal failed. The new leader is now ' + leader.name);
	inMissionProposal = true;
});