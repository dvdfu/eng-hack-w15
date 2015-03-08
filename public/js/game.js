var socket = io();

var usernames = [];
var myUser = {};

// main divs
var joinGameView = document.getElementById('join-game');
var roleRevealView = document.getElementById('reveal-roles');
var bigShowRoleButton = document.getElementById('btn-big-show-role');

// joinGameView elements
var nameButton = document.getElementById('btn-name');
var nameField = document.getElementById('input-name');
var startButton = document.getElementById('btn-start');
var userList = document.getElementById('list-users');

// roleRevealView elements
var roleMessage = document.getElementById('role-message');
var spyList = document.getElementById('list-spies');

// initial state
startButton.disabled = true;
bigShowRoleButton.style.display = 'none';
roleRevealView.style.display = 'none';

// bigShowRoleButton
bigShowRoleButton.onmousedown = function(){
	roleRevealView.style.display = 'block';
}
bigShowRoleButton.onmouseup = function(){
	roleRevealView.style.display = 'none';
}

// joinGameView
nameField.onkeypress = function(e){
	if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
    	submitName(nameField.value);
    }
}
nameButton.onclick = function() {
	submitName(nameField.value);
};
startButton.onclick = function(){
	socket.emit('start game');
	startButton.disabled = true;
};


socket.on('users joined', function (users) {
	users.forEach(function (user) {
		usernames.push(user.name);
		var li = document.createElement('li');
		li.className = 'list-group-item';
		li.appendChild(document.createTextNode(user.name));
		userList.appendChild(li);
	});
});

socket.on('allow game start', function(){
	startButton.disabled = false;
});

socket.on('assign role', function(users){
	users.forEach(function(user){
		if(user.name == myUser.name){
			myUser = user;
		}
		if(user.role == 'spy'){
			var li = document.createElement('li');
			li.className = 'list-group-item';
			li.appendChild(document.createTextNode(user.name));
			spyList.appendChild(li);
		}
	});
	roleMessage.innerHTML = myUser.role.toUpperCase();
	spyList.style.display = (myUser.role == 'spy') ? 'block' : 'none';

	joinGameView.style.display = 'none';
	bigShowRoleButton.style.display = 'block';
});

function submitName( name ){
	var nameTaken = false;

	usernames.forEach(
		function(username){
			if(name == username){
				nameTaken = true;
			}
		}
	);

	if (name.length > 1 && !nameTaken){
		myUser.name = name;
		socket.emit('add user', name);
		nameButton.disabled = true;
		nameField.disabled = true;
	}
}