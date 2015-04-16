var socket = io();
var users = [];
var me = {};
var $me, $spies = [];
var disconnectedUsers = [];

// data to display
var playersPerMission = [];
var currentMission = 0;
var consecutiveFailedProposals = 0;
var twoFailsMissionFour;
var leader;

var inMissionProposal = false;

var selectedUsers = [];

var $mainPage = document.getElementById('main-page');
var $gameInProgress = document.getElementById('game-in-progress');
var $gameFinish = document.getElementById('game-finish');

var $disconnected = document.getElementById('disconnected-players');
var $disconnectedList = document.getElementById('list-disconnected');

var $failedProposals = document.getElementById('failed-proposals');
var $missions = document.getElementById('list-mission');
var $gameInfo= document.getElementById('game-info');
var $userList = document.getElementById('list-users');
var $options = document.getElementById('options');

var $acceptButton = document.getElementById('btn-vote-yes');
var $refuseButton = document.getElementById('btn-vote-no');
var $succeedButton = document.getElementById('btn-succeed');
var $failButton = document.getElementById('btn-fail');
var $proposeMissionButton = document.getElementById('btn-propose-mission');

var $instructions = document.getElementById('instructions');

$gameInProgress.onclick = function () {
	socket.emit('reset game');
};

function missionReset(){
	inMissionProposal = false;
	$('.user-leader').empty();
	$('.user').removeClass('selected');
	selectedUsers.length = 0;
	hideAllButtons();
}

function hideAllButtons(){
	$startButton.style.display = 'none';
	$acceptButton.style.display = 'none';
	$refuseButton.style.display = 'none';
	$proposeMissionButton.style.display = 'none';
	$failButton.style.display = 'none';
	$succeedButton.style.display = 'none';
}

function showInstruction(text, revert) {
	var previousText = $instructions.innerHTML;
	$instructions.innerHTML = text;
	$instructions.classList.add('highlight');
	setTimeout(function() {
		$instructions.classList.remove('highlight');
		if (revert && previousText.length > 0) {
			$instructions.innerHTML = previousText;
		}
	}, 1000);
}

function setLeaderDisplay(callback){
	var $leaderView = getUserListItem(leader);
	$leaderView.find(".user-leader").html('<i class="fa fa-star"></i>');

	if(me.name === leader.name){
		$proposeMissionButton.disabled = true;
		$proposeMissionButton.style.display = 'inline';
		inMissionProposal = true;
		showInstruction('\nAs this round\'s leader, select ' + playersPerMission[currentMission] + ' users by tapping them.');
	}

	callback && callback();
}

function getUserListItem(user){
	return $('.user:nth-child(' + (user.id + 1) + ')');
}

function hideAllVotes(){
	$('.user-vote').removeClass('accepted');
	$('.user-vote').removeClass('rejected');
}

function setProposalFails(count) {
	consecutiveFailedProposals = count;
	$failedProposals.innerHTML = 'Failed votes: <b>' + consecutiveFailedProposals + '/5</b>';
}

function populateDisconnectedList(){
	disconnectedUsers.foreach(function(user){
		var $li = document.createElement('li');
		$li.className = 'list-group-item user';
		$li.innerHTML = '<div class="col-xs-12 user-name">' + user.name + '</div>';
		$li.onclick = function() {
			// TO DO: Emit reconnect, set up socket to take role of the player
			disconnectedUsers.splice(disconnectedUsers.indexOf(user), 1);
			$mainPage.style.display = 'block';
			$gameInProgress.style.display = 'none';
		};
		$userList.appendChild($li);
	});
}

socket.on('state', function(state){
	if(state !== "USERS_JOINING"){
		$mainPage.style.display = 'none';
		$gameInProgress.style.display = 'block';
		if(disconnectedUsers.length > 0){
			populateDisconnectedList();
			$disconnected.style.display = 'block';
		}
	}
});

socket.on('refresh view', function() {
	window.location.reload();
});

socket.on('player disconnect', function(socketId) {
	users.foreach(function(user){
		if(user.connectionId == socketId){
			disconnectedUsers.push(user);
		}
	});
});