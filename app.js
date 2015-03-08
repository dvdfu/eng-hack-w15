var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var states = {
	USERS_JOINING: "USERS_JOINING",
	ROLE_ASSIGNMENT: "ROLE_ASSIGNMENT",
}
var state = states.USERS_JOINING;
var colors [
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







app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.emit('state', state);


	socket.on('add user', function (name) {
		var user = new User(name);
		users.push(user);
		socket.emit('user joined', user);
		if (users.length >= 5) {
			socket.emit('allow game start');
		}
	});

	socket.on('start game', function (user) {
		if (state === states.USERS_JOINING && users.length > 1) {
			state = states.ROLE_ASSIGNMENT;

		}
	});
});

http.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000');
});