// socket.emit('Saves', saves) // Emit to specific client
// socket.broadcast.emit('Saves', saves); // Emit to all other clients
// io.sockets.emit('Saves', saves); // Emit to all clients

// Express
var port = 8080; // Public IP: 54.174.11.214

var express = require('express');
var app = express();
var server = app.listen(port);

// Socket.io
var socketio = require('socket.io');
var io = socketio(server);

// Send Static Data
app.use(express.static('www'));

// Start
var connections = 0;
console.log('Running --');

//////////////////////////////////////////////////////////////

var saves = [];
var territory = {};
var ships = {};
var currentSystems = {};

// New Connection
io.sockets.on('connection', newConnection);
function newConnection(socket) {
	// Connect
	connections++;
	console.log('Client connected: ' + socket.id); // Server Message
	console.log('Connections: ' + connections);

	// Disconnect
	socket.on('disconnect', function() {
		connections--;
		console.log('Client disconnected: ' + socket.id); // Server Message
		console.log('Connections: ' + connections);

		delete ships[socket.id];
		delete currentSystems[socket.id];
	});

	// Galaxy Loaded
	socket.on('GalaxyLoaded', function() {
		if (saves.length == 0) {
			socket.emit('GalaxyLoaded', false);
			console.log('Sent: GalaxyLoaded: false');
		} else {
			socket.emit('GalaxyLoaded', true);
			socket.emit('Sent: GalaxyLoaded: true');
			socket.emit('Saves', saves);
			socket.emit('Sent: Galaxy');
		}
	});

	// Saves
	if (saves.length != 0) {
		socket.emit('Saves', saves);
		socket.emit('Territory', territory);
	}
	socket.on('Saves', function(saveS) {
		console.log('Current: ', saves);
		console.log('Import: ', saveS);
		if (saves.length == 0) {
			console.log('                                                   Galaxy recieved');
			saves = [];
			for (i = 0; i < saveS.length; i++) {
				saves[i].system = JSON.parse(JSON.stringify(saveS[i].system));
				saves[i].orbits = JSON.parse(JSON.stringify(saveS[i].orbits));
				saves[i].star = JSON.parse(JSON.stringify(saveS[i].star));
				saves[i].ship = JSON.parse(JSON.stringify(saveS[i].ship));
				saves[i].asteroidBelt = JSON.parse(JSON.stringify(saveS[i].asteroidBelt));
				saves[i].warpGates = JSON.parse(JSON.stringify(saveS[i].warpGates));
				saves[i].stations = JSON.parse(JSON.stringify(saveS[i].stations));
				saves[i].beacons = JSON.parse(JSON.stringify(saveS[i].beacons));
				saves[i].barges = JSON.parse(JSON.stringify(saveS[i].barges));
				saves[i].military = JSON.parse(JSON.stringify(saveS[i].military));
				saves[i].cargoHold = JSON.parse(JSON.stringify(saveS[i].cargoHold));
				saves[i].pan = JSON.parse(JSON.stringify(saveS[i].pan));
				saves[i].planets = JSON.parse(JSON.stringify(saveS[i].pan));
				territory[saves[i].system.name] = null;
			}
			socket.emit('Territory', territory);
			console.log('                                                   Galaxy stored');
		} else {
			socket.emit('Saves', saves);
			socket.emit('Territory', territory);
		}
	});

	// Current System
	socket.on('CurrentSystem', function(namE) {
		currentSystems[socket.id] = namE;
	});

	// Ship
	socket.on('Ship', function(shiP) {
		ships[socket.id] = JSON.parse(JSON.stringify(shiP));
		socket.broadcast.emit('Ships', ships);
	});

	// Ship Explode
	socket.on('ExplodeShip', function(shiP) {
		ships[socket.id] = shiP;
		socket.broadcast.emit('Ships', ships);
		socket.broadcast.emit('Explode', shiP);
		console.log('                                                   Ship Exploded: ' + shiP.system + ': ' + socket.id);
	});

	// Respawn
	socket.on('Respawn', function(shiP) {
		ships[shiP.client] = JSON.parse(JSON.stringify(shiP.object));
		socket.broadcast.emit('Ships', ships);
	});

	// Warp Gates
	socket.on('WarpGates', function(warpGateS) {
		socket.broadcast.emit('WarpGates', warpGateS); // Persist to other clients
		saves[warpGateS.from].warpGates = JSON.parse(JSON.stringify(warpGateS)); // Update server saves
		console.log('                                                   Warp Gate Constructed: ' + saves[warpGateS.from].system.name + ' --> ' + saves[warpGateS.to].system.name);
	});

	// Stations
	socket.on('Stations', function(stationS) {
		io.sockets.emit('Stations', stationS); // Persist to other clients
		for (i = 0; i < saves.length; i++) { // Update server saves
			if (saves[i].system.name == stationS.system) {
				saves[i].stations = JSON.parse(JSON.stringify(stationS));
				if (stationS.outer[stationS.outer.length - 1].type == 'mobile') {
					console.log('                                                   Mobile Station Constructed: ' + stationS.system);
				} else if (stationS.outer[stationS.outer.length - 1].type == 'base') {
					console.log('                                                   Base Station Constructed: ' + stationS.system);
				} else {
					console.log('                                                   Stations Constructed: ' + sattionS.system);
				}
				break;
			}
		}
	});

	// Beacons
	socket.on('Beacons', function(beaconS) {
		socket.broadcast.emit('Beacons', beaconS);
		for (i = 0; i < saves.length; i++) {
			if (saves[i].system.name == beaconS.system) {
				saves[i].beacons = JSON.parse(JSON.stringify(beaconS));
				console.log('                                                   Beacon Constructed: ' + beaconS.system);
				territory[beaconS.system] = socket.id;
				console.log('                                                   ' + beaconS.system + ' Controlled By: ' + socket.id);
				break;
			}
		}
	});

	// Mining Barges
	socket.on('Barges', function(bargeS) {
		socket.broadcast.emit('Barges', bargeS);
		saves[bargeS.index].barges = JSON.parse(JSON.stringify(bargeS.object));
		console.log('                                                   Mining Barge Constructed: ' + saves[bargeS.index].system.name);
	});

	// Military
	socket.on('Military', function(militarY) {
		socket.broadcast.emit('Military', militarY);
		for (i = 0; i < saves.length; i++) {
			if (saves[i].system.name == militarY.system) {
				saves[i].military = JSON.parse(JSON.stringify(militarY.object));
				if (militarY.event == 'mineFieldConstruction') {
					console.log('                                                   Mine Field Constructed: ' + militarY.system);
				} else {
					console.log('                                                   Unnamed Military Event: ' + militarY.system)
				}
				break;
			}
		}
	});

	// Mine Explode
	socket.on('ExplodeMine', function(explodeMinE) {
		socket.broadcast.emit('ExplodeMine', explodeMinE);
		for (i = 0; i < saves.length; i++) {
			if (saves[i].system.name == explodeMinE.system) {
				saves[i].military.mineFields.array[explodeMinE.id].count--;
				saves[i].military.mineFields.array[explodeMinE.id].mines.splice(explodeMinE.mineIndex, 1);
				if (saves[i].military.mineFields.array[explodeMinE.id].count == 0) {
					saves[i].military.mineFields.count--;
					saves[i].military.mineFields.array.splice(explodeMinE.id, 1);
				}
			}
		}
		console.log('                                                   Mine Exploded: ' + explodeMinE.system);
	});
}
