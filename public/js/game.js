var socket = io();
var users = [];
var me = {};
var $me, $spies = [];

// data to display
var playersPerMission = [];
var consecutiveFailedProposals = 0;
var twoFailsMissionFour;
var leader;

var $missions = document.getElementById('list-mission');
var $failedProposals= document.getElementById('failed-proposals');

$missions.style.display = 'none';
$failedProposals.style.display = 'none';