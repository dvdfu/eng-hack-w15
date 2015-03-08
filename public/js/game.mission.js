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
	if(failed){

	}else{

	}

	missionReset();
	hideAllVotes();
	currentMission = _currentMission;
	leader = newLeader;
	setLeaderDisplay();
	showInstruction('The new leader is now ' + leader.name);
	inMissionProposal = true;
});

socket.on('game over', function(resistanceWins, missionSuccessVotes, missionFailVotes){
// also david's job??
});