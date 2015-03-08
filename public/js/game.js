var socket = io();
var users = [];
var me = {};
var $me, $spies = [];

// data to display
var playersPerMission = [];
var consecutiveFailedProposals = 0;
var twoFailsMissionFour;
var leader;

var selectedUsers = [];

var $failedProposals = document.getElementById('failed-proposals');
var $missions = document.getElementById('list-mission');
var $gameInfo= document.getElementById('game-info');
var $userList = document.getElementById('list-users');
var $options = document.getElementById('options');

function missionReset(){
	$('.user-leader').empty();
	$('.user').removeClass('selected');
	selectedUsers.length = 0;
}
