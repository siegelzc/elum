// socket.emit('Saves', saves) // Emit to specific client
// socket.broadcast.emit('Saves', saves); // Emit to all other clients
// io.sockets.emit('Saves', saves); // Emit to all clients

// Express
// var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
// var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var express = require('express');
var app = express();
var server = app.listen(8080);

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
		} else {
			socket.emit('GalaxyLoaded', true);
			socket.emit('Saves', saves);
		}
	});

	// Saves
	if (saves.length != 0) {
		socket.emit('Saves', saves);
		socket.emit('Territory', territory);
	}
	socket.on('Saves', function(saveS) {
		if (saves.length == 0) {
			console.log('                                                   Galaxy recieved');
			for (i = 0; i < saveS.length; i++) {
				saves[i] = {
					system: JSON.parse(JSON.stringify(saveS[i].system)), 
					orbits: JSON.parse(JSON.stringify(saveS[i].orbits)), 
					star: JSON.parse(JSON.stringify(saveS[i].star)), 
					ship: JSON.parse(JSON.stringify(saveS[i].ship)), 
					asteroidBelt: JSON.parse(JSON.stringify(saveS[i].asteroidBelt)), 
					warpGates: JSON.parse(JSON.stringify(saveS[i].warpGates)), 
					stations: JSON.parse(JSON.stringify(saveS[i].stations)), 
					beacons: JSON.parse(JSON.stringify(saveS[i].beacons)), 
					barges: JSON.parse(JSON.stringify(saveS[i].barges)), 
					military: JSON.parse(JSON.stringify(saveS[i].military)), 
					cargoHold: JSON.parse(JSON.stringify(saveS[i].cargoHold)), 
					pan: JSON.parse(JSON.stringify(saveS[i].pan)), 
					planets: {
						colors: saveS[i].planets.colors, 
						types: saveS[i].planets.types, 
						x: saveS[i].planets.x, 
						y: saveS[i].planets.y, 
						diameter: saveS[i].planets.diameter, 
						radius: saveS[i].planets.radius, 
						color: saveS[i].planets.color, 
						radian: saveS[i].planets.radian, 
						loaded: saveS[i].planets.loaded, 
						type: saveS[i].planets.type, 
						arrays: [], 
						name: saveS[i].planets.name
					}
				};
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