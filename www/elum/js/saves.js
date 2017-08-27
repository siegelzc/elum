var saves = [];
var currentSave = {};
function saveSystem(overwritE, indeX) {
	var repeated = {
		value: false, 
		index: undefined
	};
	for (s = 0; s < saves.length; s++) {
		if (system.name == saves[s].system.name) {
			repeated.value = true;
			repeated.index = s;
			break;
		}
	}
	if (overwritE == true && indeX != undefined) { // Save to specific location in array
		repeated.value = true;
		repeated.index = indeX;
	}
	if (repeated.value == false || overwritE == true) {
		currentSave = {};
		currentSave = {
			system: JSON.parse(JSON.stringify(system)), 
			orbits: JSON.parse(JSON.stringify(orbits)), 
			star: JSON.parse(JSON.stringify(star)), 
			ship: JSON.parse(JSON.stringify(ship)), 
			asteroidBelt: JSON.parse(JSON.stringify(asteroidBelt)), 
			warpGates: JSON.parse(JSON.stringify(warpGates)), 
			stations: JSON.parse(JSON.stringify(stations)), 
			beacons: JSON.parse(JSON.stringify(beacons)), 
			barges: JSON.parse(JSON.stringify(barges)), 
			military: JSON.parse(JSON.stringify(military)), 
			cargoHold: JSON.parse(JSON.stringify(cargoHold)), 
			pan: JSON.parse(JSON.stringify(pan)), 
			planets: {
				colors: planets.colors, 
				types: planets.types, 
				x: planets.x, 
				y: planets.y, 
				diameter: planets.diameter, 
				radius: planets.radius, 
				color: planets.color, 
				radian: planets.radian, 
				loaded: planets.loaded, 
				type: planets.type, 
				arrays: [], 
				name: planets.name
			}
		};
		if (repeated.value == false) {
			saves[saves.length] = {
				system: JSON.parse(JSON.stringify(currentSave.system)), 
				orbits: JSON.parse(JSON.stringify(currentSave.orbits)), 
				star: JSON.parse(JSON.stringify(currentSave.star)), 
				ship: JSON.parse(JSON.stringify(currentSave.ship)), 
				asteroidBelt: JSON.parse(JSON.stringify(currentSave.asteroidBelt)), 
				warpGates: JSON.parse(JSON.stringify(currentSave.warpGates)), 
				stations: JSON.parse(JSON.stringify(currentSave.stations)), 
				beacons: JSON.parse(JSON.stringify(currentSave.beacons)), 
				barges: JSON.parse(JSON.stringify(currentSave.barges)), 
				military: JSON.parse(JSON.stringify(currentSave.military)), 
				cargoHold: JSON.parse(JSON.stringify(currentSave.cargoHold)), 
				pan: JSON.parse(JSON.stringify(currentSave.pan)), 
				planets: { 
					colors: currentSave.planets.colors, 
					types: currentSave.planets.types, 
					x: currentSave.planets.x, 
					y: currentSave.planets.y, 
					diameter: currentSave.planets.diameter, 
					radius: currentSave.planets.radius, 
					color: currentSave.planets.color, 
					radian: currentSave.planets.radian, 
					loaded: currentSave.planets.loaded, 
					type: currentSave.planets.type, 
					arrays: [], 
					name: currentSave.planets.name
				}
			};
		} else if (overwritE == true) {
			saves[repeated.index] = {
				system: JSON.parse(JSON.stringify(currentSave.system)), 
				orbits: JSON.parse(JSON.stringify(currentSave.orbits)), 
				star: JSON.parse(JSON.stringify(currentSave.star)), 
				ship: JSON.parse(JSON.stringify(currentSave.ship)), 
				asteroidBelt: JSON.parse(JSON.stringify(currentSave.asteroidBelt)), 
				warpGates: JSON.parse(JSON.stringify(currentSave.warpGates)), 
				stations: JSON.parse(JSON.stringify(currentSave.stations)), 
				beacons: JSON.parse(JSON.stringify(currentSave.beacons)), 
				barges: JSON.parse(JSON.stringify(currentSave.barges)), 
				military: JSON.parse(JSON.stringify(currentSave.military)), 
				cargoHold: JSON.parse(JSON.stringify(currentSave.cargoHold)), 
				pan: JSON.parse(JSON.stringify(currentSave.pan)), 
				planets: { 
					colors: currentSave.planets.colors, 
					types: currentSave.planets.types, 
					x: currentSave.planets.x, 
					y: currentSave.planets.y, 
					diameter: currentSave.planets.diameter, 
					radius: currentSave.planets.radius, 
					color: currentSave.planets.color, 
					radian: currentSave.planets.radian, 
					loaded: currentSave.planets.loaded, 
					type: currentSave.planets.type, 
					arrays: [], 
					name: currentSave.planets.name
				}
			};
		}
		if (state == 'overwriteSaveFlag') {
			drawInnerStation();
		}
	} else {
		console.error('Cannot Save Coordinates');
	}
}

function loadSystem(indeX, modifY) {
	clearInterval(systemInterval);
	if (typeof indeX == 'string') {
		for (i = 0; i < galaxy.systems.count; i++) {
			if (saves[i].system.name == indeX) {
				indeX = i;
				break;
			}
		}
	}
	if (modifY != 'respawn') {
		initializeWarp('save');
	}
	currentSave = saves[indeX];
	system = JSON.parse(JSON.stringify(saves[indeX].system));
	orbits = JSON.parse(JSON.stringify(saves[indeX].orbits));
	star = JSON.parse(JSON.stringify(saves[indeX].star));
	ship = JSON.parse(JSON.stringify(saves[indeX].ship));
	asteroidBelt = JSON.parse(JSON.stringify(saves[indeX].asteroidBelt));
	warpGates = JSON.parse(JSON.stringify(saves[indeX].warpGates));
	stations = JSON.parse(JSON.stringify(saves[indeX].stations));
	beacons = JSON.parse(JSON.stringify(saves[indeX].beacons));
	barges = JSON.parse(JSON.stringify(saves[indeX].barges));
	military = JSON.parse(JSON.stringify(saves[indeX].military));
	cargoHold = JSON.parse(JSON.stringify(saves[indeX].cargoHold));
	pan = JSON.parse(JSON.stringify(saves[indeX].pan));
	planets = {
		colors: saves[indeX].planets.colors, 
		types: saves[indeX].planets.types, 
		x: saves[indeX].planets.x, 
		y: saves[indeX].planets.y, 
		diameter: saves[indeX].planets.diameter, 
		radius: saves[indeX].planets.radius, 
		color: saves[indeX].planets.color, 
		radian: saves[indeX].planets.radian, 
		loaded: saves[indeX].planets.loaded, 
		type: saves[indeX].planets.type, 
		arrays: [], 
		name: saves[indeX].planets.name
	};

	ship.load.radian = random(0, TWO_PI);
	if (ship.load.radian < PI / 6 && ship.load.radian > 11 * PI / 6) {
		ship.direction = 'r';
	} else if (ship.load.radian < PI / 3 && ship.load.radian > PI / 6) {
		ship.direction = 'dr';
	} else if (ship.load.radian < TWO_PI / 3 && ship.load.radian > PI / 3) {
		ship.direction = 'd';
	} else if (ship.load.radian < 5 * PI / 6 && ship.load.radian > TWO_PI / 3) {
		ship.direction = 'dl';
	} else if (ship.load.radian < 7 * PI / 6 && ship.load.radian > 5 * PI / 6) {
		ship.direction = 'l';
	} else if (ship.load.radian < 4 * PI / 3 && ship.load.radian > 7 * PI / 6) {
		ship.direction = 'ul';
	} else if (ship.load.radian < 5 * PI / 3 && ship.load.radian > 4 * PI / 3) {
		ship.direction = 'u';
	} else if (ship.load.radian < 11 * PI / 6 && ship.load.radian > 5 * PI / 3) {
		ship.direction = 'ur';
	}

	if (modifY == 'respawn') {
		ship.x = stations.outer[stations.id].x + stationClickBuffer * cos(ship.load.radian);
		ship.y = stations.outer[stations.id].y + stationClickBuffer * sin(ship.load.radian);
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		// ship.radian = acos(ship.radius / ship.x);
		// if (ship.y < system.y) {
		// 	ship.radian *= -1;
		// }
		socket.emit('Respawn', { object: ship, client: socket.id });
	} else {
		ship.radius = random(star.diameter, system.radius - 50)
		ship.radian = random(0, TWO_PI);
		ship.x = system.x + ship.radius * cos(ship.radian);
		ship.y = system.y + ship.radius * sin(ship.radian);
	}
}

var saved = function() {
	var saveD = false;
	for (s = 0; s < saves.length; s++) {
		if (saves[s].system.name == system.name) {
			saveD = true;
		}
	}
	return saveD;
}

function updateSaves(saveS) {
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
	}
}