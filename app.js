var express = require('express');
var app	    = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var states = {
	USERS_JOINING: "USERS_JOINING",
	ROLE_ASSIGNMENT: "ROLE_ASSIGNMENT",
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
var currentMission = 1;
var playersPerMission = [];

// variables for counting how many users have done an action
var rolesSeen = 0;
var missionSuccessVotes = 0;
var missionFailVotes = 0;

function User(name) {
	this.name = name;
	this.id = currId;
	currId++;
}

function assignRoles() {
	var numSpies = Math.floor((users.length - 1) / 3) + 1;
	users = shuffle(users);
	for (var i = 0; i < users.length; i++) {
		if (i < numSpies) users[i].role = 'spy';
		else users[i].role = 'resistance';
	}

	console.log(users);

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
}

function initializeMissions(){
	if(users.length === 5){
		playersPerMission[1] = 2;
		playersPerMission[2] = 3;
		playersPerMission[3] = 2;
		playersPerMission[4] = 3;
		playersPerMission[5] = 3;
	}else if(users.length === 6){
		playersPerMission[1] = 2;
		playersPerMission[2] = 3;
		playersPerMission[3] = 3;
		playersPerMission[4] = 3;
		playersPerMission[5] = 4;
	} else if(users.length === 7){
		playersPerMission[1] = 2;
		playersPerMission[2] = 3;
		playersPerMission[3] = 3;
		playersPerMission[4] = 4;
		playersPerMission[5] = 4;
	}else{
		playersPerMission[1] = 3;
		playersPerMission[2] = 4;
		playersPerMission[3] = 4;
		playersPerMission[4] = 5;
		playersPerMission[5] = 5;
	}
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
			if (users.length >= 5) {
				io.emit('allow game start');
			}
			console.log(name + ' joined the game');
		}
	});

	socket.on('request role', function (user) {
		if (state === states.USERS_JOINING && users.length >= 5) {
			state = states.ROLE_ASSIGNMENT;
			assignRoles();
			io.emit('assign role', users);
		}
	});

	socket.on('role seen', function(){
		rolesSeen++;
		if(rolesSeen === users.length){
			state = states.PROPOSE_MISSION;
			leaderIndex = Math.floor(Math.random() * users.length);
			initializeMissions();

			var twoFailsRequired = false;
			if(users.length > 6 && currentMission === 4){
				twoFailsRequired = true;
			}

			io.emit('start game'
					users[leaderIndex],
					playersPerMission
				);
			rolesSeen = 0;
		}
	});

	socket.on('mission proposed', function(usersOnMission){
		playersOnMission = usersOnMission; // not used if vote fails
		state = states.MISSION_VOTE;
		io.emit('mission proposed', usersOnMission);
	});

	socket.on('sent proposal vote', function(user, userAgrees){
		proposalVotes[user.name] = userAgrees;
		if(proposalVotes.length === users.length){
			var agreed = 0;
			var reject = 0;
			for (var i = 0; i < proposalVotes.length; i++) {
				if(proposalVotes[i]){
					agreed++;
				}else{
					reject++;
				}
			};

			// reset array
			proposalVotes.length = 0;

			if(agreed > reject){
				// mission passes and mission vote begins
				state = states.MISSION_VOTE;
				consecutiveFailedProposals = 0;
				io.emit('proposal passed', proposalVotes, playersOnMission);
			}else{
				// mission fails and leader changes
				state = states.PROPOSE_MISSION;
				leaderIndex = (leaderIndex + 1) % users.length;
				consecutiveFailedProposals++;
				if(consecutiveFailedProposals === 5){
					// resistanceWins: false
					io.emit('game over', false);
				}else{
					io.emit('proposal rejected', proposalVotes, users[leaderIndex]);
				}
			}
		}
	});

	socket.on('sent mission vote', function(user, missionSuccess){
		if(missionSuccess){
			missionSuccessVotes++;
		}else{
			missionFailVotes++;
		}

		if(missionSuccessVotes + missionFailVotes === playersPerMission[currentMission]){

		}
	});
});

http.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000');
});