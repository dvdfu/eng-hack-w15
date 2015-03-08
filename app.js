var express = require('express');
var app	    = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var MIN_PLAYERS = 5;

var states = {
	USERS_JOINING: "USERS_JOINING",
	PROPOSE_MISSION: "PROPOSE_MISSION",
	PROPOSAL_VOTE: "PROPOSAL_VOTE",
	MISSION_VOTE: "MISSION_VOTE",
	MISSION_RESULTS: "MISSION_RESULTS",
	GAME_OVER: "GAME_OVER"
}
var state = states.USERS_JOINING;
var colors = [
	'#f00',
	'#0f0',
	'#00f',
	'#ff0',
	'#f0f',
	'#0ff',
];
var users = [];
var currId = 0;
var leaderIndex;
var proposalVotes = [];
var playersOnMission = [];
var consecutiveFailedProposals = 0;

// mission variables
var currentMission = 0;
var playersPerMission = [];

// variables for counting how many users have done an action
var missionSuccessVotes = 0;
var missionFailVotes = 0;

var pointsResistance = 0;
var pointsSpy = 0;

function User(name) {
	this.name = name;
	this.id = currId;
	currId++;
}

function assignRoles() {
	console.log(users);
	var numSpies = Math.floor((users.length - 1) / 3) + 1;
	var tmp = shuffle(users);
	for (var i = 0; i < users.length; i++) {
		users[i].role = 'resistance';
		for (var j = 0; j < numSpies; j++) {
			if(tmp[j].id === users[i].id) users[i].role = 'spy';
		};
	}

	console.log(users);

	function shuffle(array) {
		var temp = JSON.parse(JSON.stringify(array));
		var currentIndex = temp.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = temp[currentIndex];
			temp[currentIndex] = temp[randomIndex];
			temp[randomIndex] = temporaryValue;
		}
		return temp;
	}
}

function initializeMissions(){
	if (users.length === 5) {
		playersPerMission = [ 2, 3, 2, 3, 3 ];
	} else if (users.length === 6) {
		playersPerMission = [ 2, 3, 3, 3, 4 ];
	} else if (users.length === 7) {
		playersPerMission = [ 2, 3, 3, 4, 4 ];
	} else {
		playersPerMission = [ 3, 4, 4, 5, 5 ];
	}
}

function areTwoFailsRequired(){
	return users.length > 6 && currentMission === 3;
}

function changeLeader(){
	leaderIndex = (leaderIndex + 1) % users.length;
}

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.emit('state', state);
	socket.emit('users joined', users);


	socket.on('add user', function (name) {
		if(users.length <= 10 && state === states.USERS_JOINING){
			var user = new User(name);
			users.push(user);
			io.emit('users joined', [user]);
			if (users.length >= MIN_PLAYERS) {
				io.emit('allow game start');
			}
			console.log(name + ' joined the game');
		}
	});

	socket.on('request role', function (user) {
		if (state === states.USERS_JOINING && users.length >= 1) {
			assignRoles();
			state = states.PROPOSE_MISSION;
			leaderIndex = Math.floor(Math.random() * users.length);
			console.log(users[leaderIndex].name + ' is the initial leader');
			initializeMissions();
			io.emit('start game',
				users,
				users[leaderIndex],
				playersPerMission,
				users.length >= 7 // are two fails required for mission 4);
			);
		}
	});

	socket.on('mission proposed', function(usersOnMission){
		playersOnMission = usersOnMission; // not used if vote fails
		console.log(playersOnMission);
		state = states.MISSION_VOTE;
		proposalVotes.length = 0;
		io.emit('mission proposed', usersOnMission);
	});

	socket.on('sent proposal vote', function(user, userAgrees){
		proposalVotes[user.id] = userAgrees;
		if(Object.keys(proposalVotes).length === users.length){
			console.log(users);
			var agreed = 0;
			var reject = 0;

			proposalVotes.forEach(function (vote){
				if(vote) agreed++;
				else reject++;
			});

			if(agreed > reject){
				// mission passes and mission vote begins
				state = states.MISSION_VOTE;
				consecutiveFailedProposals = 0;
				console.log(proposalVotes);
				io.emit('proposal passed', proposalVotes, playersOnMission, consecutiveFailedProposals);
			}else{
				console.log("Proposal failed!");
				// mission fails and leader changes
				state = states.PROPOSE_MISSION;
				changeLeader();
				consecutiveFailedProposals++;
				console.log(proposalVotes);
				if(consecutiveFailedProposals >= 5){
					// resistanceWins: false, successVotes: null, failVotes: null
					io.emit('game over', false, null, null);
				}else{
					io.emit('proposal rejected', proposalVotes, users[leaderIndex], consecutiveFailedProposals);
				}
			}
			// reset array
			proposalVotes.length = 0;
		}
	});

	socket.on('sent mission vote', function(user, missionSuccess){
		playersOnMission.length = 0;
		if(missionSuccess){
			missionSuccessVotes++;
		}else{
			missionFailVotes++;
		}

		if(missionSuccessVotes + missionFailVotes === playersPerMission[currentMission]){
			var failed = areTwoFailsRequired() ? (missionFailVotes > 1) : (missionFailVotes > 0);
			currentMission++;

			if(failed){
				pointsSpy++;
			}else{
				pointsResistance++;
			}

			if(pointsSpy === 3){
				io.emit('game over', false, missionSuccessVotes, missionFailVotes);
			}else if(pointsResistance === 3){
				io.emit('game over', true, missionSuccessVotes, missionFailVotes);
			}else{
				changeLeader();
				io.emit('mission end', failed, missionSuccessVotes, missionFailVotes, currentMission, users[leaderIndex]);
			}
			missionSuccessVotes = 0;
			missionFailVotes = 0;
		}
	});
	
});

http.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000');
});