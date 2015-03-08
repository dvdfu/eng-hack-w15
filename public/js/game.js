var socket = io();
var users = [];
var me = {};

// data to display
var playersPerMission = [];
var consecutiveFailedProposals = 0;
var twoFailsMissionFour;
var leader;