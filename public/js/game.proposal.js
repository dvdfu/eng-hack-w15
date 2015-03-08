$proposeMissionButton.onclick = function() {
	inMissionProposal = false;
	socket.emit('mission proposed', selectedUsers);
};

socket.on('mission proposed', function(usersOnMission){
	// shows selected users for everyone
	if (leader.name === me.name) {
		showInstruction('Vote on your proposal!');
	} else {
		showInstruction('Vote on ' + leader.name + '\'s proposal!');
	}
	console.log(usersOnMission);
	for (var i = 0; i < usersOnMission.length; i++) {
		var $selected = $('.user:nth-child(' + (usersOnMission[i].id + 1) + ')');
		if(!$selected.hasClass('selected')){
			$selected.addClass("selected");
		}
	};
	// display vote buttons
	hideAllButtons();
	$acceptButton.style.display = 'inline';
	$refuseButton.style.display = 'inline';
});