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