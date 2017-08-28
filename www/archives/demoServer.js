// Express
var express = require('express');
var app = express();
var server = app.listen(3000);

// Socket.io
var socket = require('socket.io');
var io = socket(server);

// Send Static Data
app.use(express.static('www'));

// Start Message
console.log('Running --');

// New Connection
io.sockets.on('connection', newConnection);
function newConnection(sockeT) {
	console.log('Connection established: ' + sockeT.id);

	// 'Mouse' Data Recieved
	sockeT.on('Mouse', function(datA) {
		console.log('Recieved: ', datA);

		sockeT.broadcast.emit('Mouse', datA); // Emit to all other clients
		// io.sockets.emit('Mouse', datA); // Emit to all clients
	});
}