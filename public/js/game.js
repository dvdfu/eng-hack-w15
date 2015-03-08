var socket = io();
var users = [];
var me = {};
var $me, $spies = [];

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

function missionReset(){
	inMissionProposal = false;
	$('.user-leader').empty();
	$('.user').removeClass('selected');
	selectedUsers.length = 0;
	hideAllButtons();

	// TO DO: set top UI stuff
}

function hideAllButtons(){
	$startButton.style.display = 'none';
	$acceptButton.style.display = 'none';
	$refuseButton.style.display = 'none';
	$proposeMissionButton.style.display = 'none';
	$failButton.style.display = 'none';
	$succeedButton.style.display = 'none';
}

function showInstruction(text) {
	$instructions.innerHTML = text;
	$instructions.classList.add('highlight');
	setTimeout(function() {
		$instructions.classList.remove('highlight');
	}, 1000);
}

function setLeaderDisplay(){
	var $leaderView = getUserListItem(leader);
	$leaderView.find(".user-leader").html( '<i class="fa fa-star"></i>' ); // David pls change dis

	if(me.name === leader.name){
		$proposeMissionButton.disabled = true;
		$proposeMissionButton.style.display = 'inline';
		inMissionProposal = true;
	}
}

function getUserListItem(user){
	return $('.user:nth-child(' + (user.id + 1) + ')');
}

function hideAllVotes(){
	$('.user-vote').removeClass('accepted');
	$('.user-vote').removeClass('rejected');
}

socket.on('state', function(state){
	if(state !== "USERS_JOINING"){
		$mainPage.style.display = 'none';
		$gameInProgress.style.display = 'block';
	}
});