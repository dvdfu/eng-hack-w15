var express = require('express');
var app	= express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);



var connections = [];
var states = {
	USERS_JOINING: "USERS_JOINING",
	ROLE_ASSIGNMENT: "ROLE_ASSIGNMENT",
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

function User(name) {
	this.name = name;
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
		var currentIndex = array.length, temporaryValue, randomIndex ;
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







app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	connections.push(socket);
	socket.emit('state', state);
	socket.emit('users joined', users);


	socket.on('add user', function (name) {
		var user = new User(name);
		users.push(user);
		socket.emit('users joined', [user]);
		if (users.length >= 5) {
			socket.emit('allow game start');
		}
		console.log(name + ' joined the game');
	});

	socket.on('start game', function (user) {
		if (state === states.USERS_JOINING && users.length >= 5) {
			state = states.ROLE_ASSIGNMENT;
			assignRoles();
		}
	});
});

http.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000');
});