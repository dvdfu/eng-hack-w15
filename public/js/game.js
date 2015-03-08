var socket = io();
var users = [];
var me = {};
var $me, $spies = [];

// data to display
var playersPerMission = [];
var consecutiveFailedProposals = 0;
var twoFailsMissionFour;
var leader;

var $failedProposals = document.getElementById('failed-proposals');
var $gameInfo = document.getElementById('game-info');