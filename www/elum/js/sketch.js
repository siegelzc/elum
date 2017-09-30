var socket;

const devMode = true;
const quality = 'low'; // 'high' or 'low'

const G = .0000000000667408;
const cos45 = 0.707106781;
const cos25 = 0.90630779;

var spaceBackground = 10;
var starFrequency = .8;
var minimumSystemDiameter = 1600;
var maximumSystemDiameter = 3400;
var minimumStarDiameter = 60;
var maximumStarDiameter = 280;
var starMassCoefficient	= 500;
var starColors = ['#9bb0ff', '#aabfff', '#cad7ff', '#f8f7ff', '#fff4ea', '#ffd2a1', '#ffcc6f'];
var minimumOrbitRadius = 450;
var maximumOrbitBuffer = 60;
var minimumOrbitBuffer = 40;
var minimumOrbitCount = 3;
var maximumOrbitCount = 11;
var minimumPlanetRadius = 18;
var maximumPlanetRadius = 35;
var minimumGoldilocks = 600;
var maximumGoldilocks = 1600;
var stationUnitLength = 4;
var minimumStationUnitCount = 30;
var maximumStationUnitCount = 50;
var stationClickBuffer = 25;
var minimumWarpGateRaidus = 15;
var maximumWarpGateRadius = 25;
var warpGateLineBuffer = 3;
var shipAcceleration = .2;
var shipDeceleration = .9;
var shipSpeedCap = 3.25;
var panSideBuffer = 50;
var panTopBuffer = 50;
var minimumAsteroidsFull = 250;
var maximumAsteroidsFull = 350;
var minimumAsteroidsBelt = 15;
var maximumAsteroidsBelt = 30;
var minimumAsteroidBeltWidth = 75;
var maximumAsteroidBeltWidth = 125;
var minimumAsteroidRadiusBelt = 6;
var maximumAsteroidRadiusBelt = 10
var minimumAsteroidRadiusFull = 10;
var maximumAsteroidRadiusFull = 30;
var minimumAsteroidVerticesBelt;
var maximumAsteroidVerticesBelt;
var asteroidIncrement;
var minimumAsteroidVerticesFull = 10;
var maximumAsteroidVerticesFull = 15;
var minimumAsteroidSpeed = .01;
var maximumAsteroidSpeed = .1;
var minimumAsteroidMass = 1;
var maximumAsteroidMass = 1000000;
var asteroidColors = ['#808080', '#696969', '#a3a3a3', '#727272', '#4a4a4a', '#5c5c5c', '#454545'];

const autoMineSpeed = 5000;

if (quality == 'high') {
	minimumAsteroidVerticesBelt = 20;
	maximumAsteroidVerticesBelt = 30;
	minimumAsteroidVerticesFull = 30;
	maximumAsteroidVerticesFull = 40;
	asteroidIncrement = .25
} else if (quality == 'low') {
	minimumAsteroidVerticesBelt = 10;
	maximumAsteroidVerticesBelt = 15;
	minimumAsteroidVerticesFull = 10;
	maximumAsteroidVerticesFull = 15;
	asteroidIncrement = 1;
} else {
	console.error('Error: No quality level selected');
}

if (devMode == true) {
	minimumSystemDiameter = 500;
	maximumSystemDiameter = 850;
	minimumStarDiameter = 25;
	maximumStarDiameter = 70;
	starMassCoefficient = 5000;
	minimumOrbitRadius = 80;
	maximumOrbitBuffer = 30;
	minimumPlanetRadius = 10;
	maximumPlanetRadius = 18;
	minimumGoldilocks = 150;
	maximumGoldilocks = 400;
	stationUnitLength = 2;
	shipAcceleration = 2;
	minimumAsteroidsFull = 200;
	maximumAsteroidsFull = 300;
	minimumAsteroidBeltWidth = 25;
	maximumAsteroidBeltWidth = 50;
	asteroidRadiusFull = 10;
}

var cnv;
var canvasWidth;
var canvasHeight;
var state;
var previousState;
var centerX;
var centerY;
var shipImage;
var load = {
	circles: [], 
	s: 0, 
	interval: undefined
};
function setup(neW) {
	if (neW != false) {
		// Sockets
		// socket = io.connect('localhost:80'); // Local
		socket = io.connect('http://server-elum.1d35.starter-us-east-1.openshiftapps.com:80'); // Openshift
		socket.emit('GalaxyLoaded');
		socket.on('GalaxyLoaded', function(loadeD) {
			if (loadeD == false) {
				createGalaxy();
				galaxy.loaded = true;
			} else if (loadeD == true) {
				galaxy.loaded = true;
			}
		});
		socket.on('Saves', updateSaves);
		socket.on('Ships', function(shipS) {
			ships = shipS;
		});
		socket.on('ExplodeShip', function(shiP){
			explodeShip(ships[shiP.client]);
		});
		socket.on('Stations', function(stationS) {
			if (stationS.system == system.name) {
				var iD = stations.id;
				stations = JSON.parse(JSON.stringify(stationS));
				stations.id = iD;
			}
			for (i = 0; i < galaxy.systems.count; i++) {
				if (saves[i].system.name == stationS.system) {
					saves[i].stations = JSON.parse(JSON.stringify(stationS));
					break;
				}
			}
		});
		socket.on('WarpGates', function(warpGateS) {
			if (saves[warpGateS.from].system.name == system.name) {
				warpGates = JSON.parse(JSON.stringify(warpGateS));
			}
			saves[warpGateS.from].warpGates = JSON.parse(JSON.stringify(warpGateS));
		});
		socket.on('Beacons', function(beaconS) {
			if (beaconS.system == system.name) {
				beacons = JSON.parse(JSON.stringify(beaconS));
			}
			for (i = 0; i < galaxy.systems.count; i++) {
				if (saves[i].system.name == beaconS.system) {
					saves[i].beacons = JSON.parse(JSON.stringify(beaconS));
					territory[saves[i].beacons.system] = saves[i].beacons.array[0].client;
					break;
				}
			}
		});
		socket.on('Territory', function(territorY) {
			territory = JSON.parse(JSON.stringify(territorY));
		});
		socket.on('Barges', function(bargeS) {
			saves[bargeS.index].barges = JSON.parse(JSON.stringify(bargeS.object));
			if (saves[bargeS.index].system.name == system.name) {
				barges = JSON.parse(JSON.stringify(bargeS.object));
			}
		});
		socket.on('Military', function(militarY) {
			if (system.name == militarY.system) {
				military = JSON.parse(JSON.stringify(militarY.object));
			}
			for (i = 0; i < galaxy.systems.count; i++) {
				if (saves[i].system.name == militarY.system) {
					saves[i].military = JSON.parse(JSON.stringify(militarY.object));
				}
			}
		});
		socket.on('ExplodeMine', function(explodeMinE) {
			if (explodeMinE.system == system.name) {
				military.mineFields.id = explodeMinE.id;
				saves[system.index].military.mineFields.id = explodeMinE.id;
				military.mineFields.array[explodeMinE.id].mines[explodeMinE.mineIndex].index = explodeMinE.mineIndex;
				saves[system.index].military.mineFields.array[explodeMinE.id].mines[explodeMinE.mineIndex].index = explodeMinE.mineIndex;
				explodeMine(military.mineFields.array[explodeMinE.id].mines[explodeMinE.mineIndex]);
			} else {
				for (i = 0; i < galaxy.systems.count; i++) {
					if (saves[i].system.name == explodeMinE.system) {
						saves[i].military.mineFields.array[explodeMinE.id].count--;
						saves[i].military.mineFields.array[explodeMinE.id].mines.splice(explodeMinE.mineIndex, 1);
						if (saves[i].military.mineFields.array[explodeMinE.id].count == 0) {
							saves[i].military.mineFields.count--;
							saves[i].military.mineFields.array.splice(explodeMinE.id);
						}
					}
				}
			}
		});
	}

	// Setup
	canvasWidth = windowWidth;
	canvasHeight = windowHeight;
	cnv = createCanvas(canvasWidth, canvasHeight);
	canvasArea = width * height;
	centerX = width / 2;
	centerY = height / 2;
	center = {
		x: width / 2, 
		y: height / 2
	};

	// Intro
	intro(true);
	function intro(neW) {
		background(50);
		fill(230);
		strokeWeight(1);
		noStroke();
		textFont('Verdana')
		textSize(100);
		text('Elum', width / 2 - textWidth('Elum') / 2, height / 3);
		textSize(34);
		text('Instructions:', 20, height - 140);
		textSize(26);
		text('Pilot your ship using the arrow keys or \'wasd\'', 30, height - 100);
		text('Press \'P\' to open the pause menu', 30, height - 70);
		text('Click the screen to start', 30, height - 40);
		drawStars(neW);
		// fill(200);
		// noStroke();
		// drawItem(bargeItem, 100, 100);
	}

	if (neW != false) {
		// Loading
		shipImage = loadImage('./elum/assets/ship.png', ship.loaded = true);
		if (ship.loaded != true || galaxy.loaded != true) {
			state = 'loading';
			for (i = 0; i < 10; i++) {
				load.circles[i] = {
					x: center.x - 160 + 40 * i, 
					y: center.y + 80, 
					r: undefined, 
					fill: 255, 
					offset: 160 * i
				};
			}
			clearInterval(load.interval);
			load.interval = setInterval(loading, 50);
		}
	}

	function loading() {
		intro(false);
		for (i = 0; i < load.circles.length; i++) {
			load.circles[i].x = center.x - 180 + 40 * i;
			load.circles[i].r = 15 * sin(load.s - load.circles[i].offset);

			fill(load.circles[i].fill);
			noStroke();
			ellipse(load.circles[i].x, load.circles[i].y, load.circles[i].r);
		}
		load.s -= .05;

		if (ship.loaded == true && galaxy.loaded == true) {
			clearInterval(load.interval);
			intro();
			state = 'intro';
		}
	}
}

function generate(from) {
	state = 'solarSystem';
	if (from == 'init') {
		drawSolarSystems(true, 'init');
	} else {
		drawSolarSystems(true);
	}
	setCoord();
	function setCoord() {
		system.coord.r = random(galaxy.core.d * 2, min(width / 2, height / 2));
		system.coord.radian = random(0, TWO_PI);
		system.coord.x = system.coord.r * cos(system.coord.radian);
		system.coord.y = system.coord.r * sin(system.coord.radian);
		for (i = 0; i < saves.length; i++) {
			if (system.coord.x >= saves[i].system.coord.x - galaxy.systems.d && system.coord.x <= saves[i].system.coord.x + galaxy.systems.d && system.coord.y >= saves[i].system.coord.y - galaxy.systems.d && system.coord.y <= saves[i].system.coord.y + galaxy.systems.d) {
				setCoord();
			}
		}
	}
}

function regenerate(from) {
	state = 'solarSystem';
	if (from == 'save') {
		drawSolarSystems(false, 'save');
	} else {
		drawSolarSystems(false);
	}
	if (from !== 'cancel') {
		fly(ship);
		checkCollisions();
	}
}

function cancel() {
	ship.speed = 0;
	clearInterval(systemInterval);
	adjustSystem();
	systemInterval = setInterval(function () { animateSystem(); }, 25);
	regenerate('cancel');
}

var stars = {
	y: [], 
	color: []
};
function drawStars(newSystem) {
	strokeWeight(1);
	if (newSystem == true) {
		stars.y = [];
		stars.color = [];
		for (i = 0; i < width; i++) {
			stars.color.push(random(180));
			stars.y.push(random(height));
		}
	}
	for (i = 0; i < width; i++){
		stroke(stars.color[i]);
		point(i, stars.y[i]);
	}
}

var home = {
	name: undefined, 
	index: undefined
};
var system = {
	coord: {
		x: undefined, 
		y: undefined, 
		r: undefined, 
		radian: undefined
	}, 
	initial: {
		x: undefined, 
		y: undefined
	},
	name: undefined, 
	diameter: undefined, 
	radius: undefined, 
	x: undefined, 
	y: undefined
};
var star = {
	color: undefined,
	diameter: undefined, 
	radius: undefined, 
	mass: undefined
};
var orbits = {
	count: undefined, 
	diameters: [], 
	radii: [], 
	velocities: []
};
var ship = {
	client: undefined, 
	direction: 'u', 
	radius: undefined, 
	radian: undefined, 
	width: 15, 
	height: 15, 
	load: {
		radian: undefined, 
		x: undefined, 
		y: undefined
	}, 
	initial: {
		x: undefined, 
		y: undefined
	}, 
	x: undefined, 
	y: undefined, 
	speed: 0, 
	loaded: false, 
	exploding: false, 
	explode: {
		max: 5, 
		spacing: 4, 
		weight: 2, 
		size: 0, 
		interval: undefined
	}
};
var ships = [];
var planets = {
	colors: ['#db3d3d' /*Magma Red*/, '#d65c00' /*Mars Red*/, '#966343' /*Dirt Brown*/, '#3cb75f' /*Grass Green*/, '#47b5ed' /*Water Blue*/, '#878787' /*Rock Grey*/, '#f1f2ea' /*Snow White*/, '#87eded' /*Ice Blue*/, '#ef9bef' /*Gas Pink*/, '#dded55', /*Sulfur Yellow*/], 
	types: ['magma', 'mars', 'dirt', 'grass', 'water', 'rock', 'snow', 'ice', 'pink', 'sulfur'], 
	x: [], 
	y: [], 
	diameter: [], 
	radius: [], 
	color: [],
	radian: [], 
	loaded: [], 
	loadcount: undefined, 
	type: [], 
	arrays: [], 
	name: []
};
var lessThanGoldilocks = planets.colors.slice(0, 2);
var goldilocks = planets.colors.slice(2, 6);
var greaterThanGoldilocks = planets.colors.slice(6);
var asteroidBelt = {
	x: undefined, 
	y: undefined, 
	radius: undefined, 
	width: undefined, 
	asteroids: {
		coefficient: undefined, 
		count: undefined, 
		array: []
	}
};
var assignedPlanetColor;
var systemInterval;
var arrivalMessage = {};
var fadeInterval;
var based = false;
function drawSolarSystems(newSystem, from) {
	clear();
	background(spaceBackground);
	if (newSystem == true) {
		for (i in cargoHold) {
			for (j in cargoHold[i]) {
				cargoHold[i][j].value = 0;
			}
		}
	}

	// Stars
	drawStars(newSystem);

	// System
	noFill();
	stroke(255);
	if (newSystem == true) {
		system.index = saves.length;
		system.diameter = random(minimumSystemDiameter, maximumSystemDiameter);
		system.radius = system.diameter / 2;
		system.initial.x = map(random(), 0, 1, 100, width - 100);
		system.initial.y = map(random(), 0, 1, 100, height - 100);
		system.x = system.initial.x;
		system.y = system.initial.y;
	}
	if (devMode == true) {
		ellipse(system.x, system.y, system.diameter);
	}

	// Star
	if (newSystem == true) {
		star.color = random(starColors);
		star.diameter = map(random(), 0, 1, minimumStarDiameter, maximumStarDiameter);
		star.radius = star.diameter / 2;
		star.mass = star.diameter * starMassCoefficient;
	}
	fill(star.color);
	stroke(star.color);
	ellipse(system.x, system.y, star.diameter);

	// Orbits and Planets
	if (newSystem == true) {
		orbits.count = floor(map(random(), 0, 1, minimumOrbitCount, maximumOrbitCount));
		orbits.diameters = [];
		orbits.radii = [];
		planets.x = [];
		planets.y = [];
		planets.diameter = [];
		planets.radius = [];
		planets.color = [];
		planets.radian = [];
		planets.loadcount = 0;
		planets.type = [];
		planets.arrays = [];
	}
	for (i = 0; i < orbits.count; i++){
		// Orbits
		if (newSystem == true) {
			var orbitDiameter = map(random(), 0, 1, minimumOrbitRadius, system.diameter - maximumOrbitBuffer);
			for (j = 0; j < orbits.count; j++) {
				while (abs(orbits.diameters[j] - orbitDiameter) <= 24) {
					orbitDiameter = map(random(), 0, 1, minimumOrbitRadius, system.diameter - maximumOrbitBuffer);
				}
			}
			orbits.diameters.push(orbitDiameter);
			orbits.radii.push(orbits.diameters[i] / 2);
			orbits.velocities[i] = sqrt((G * star.mass) / orbits.radii[i]);
			if (random() < .5) {
				orbits.velocities[i] *= -1;
			}
		}
		noFill();
		stroke(90);
		ellipse(system.x, system.y, orbits.diameters[i]);

		// Planets
		var planetDiameter = map(random(), 0, 1, minimumPlanetRadius, maximumPlanetRadius || star.diameter);
		if (newSystem == true) {
			if (orbits.diameters[i] < minimumGoldilocks + star.diameter) {
				var planetColorIndex = planets.colors.indexOf(random(lessThanGoldilocks));
				planets.type.push(planets.types[planetColorIndex]);
				planets.color.push(planets.colors[planetColorIndex]);
				planetDiameter *= map(random(), 0, 1, .3, .5);
			} else if (orbits.diameters[i] >= minimumGoldilocks + star.diameter && orbits.diameters[i] <= maximumGoldilocks + star.diameter) {
				var planetColorIndex = planets.colors.indexOf(random(goldilocks));
				planets.type.push(planets.types[planetColorIndex]);
				planets.color.push(planets.colors[planetColorIndex]);
				planetDiameter *= map(random(), 0, 1, .7, 1);
			} else if (orbits.diameters[i] > maximumGoldilocks + star.diameter) {
				var planetColorIndex = planets.colors.indexOf(random(greaterThanGoldilocks));
				planets.type.push(planets.types[planetColorIndex]);
				planets.color.push(planets.colors[planetColorIndex]);
				planetDiameter *= map(random(), 0, 1, 1.2, 1.8);
				if (planets.type[i] == 'pink' || planets.type[i] == 'sulfur') {
					planetDiameter *= map(random(), 0, 1, 1.2, 1.6);
				}
			} else {
				console.error('Error: Goldilocks Zone');
			}
			planets.diameter.push(planetDiameter);
			planets.radius.push(planets.diameter[i] / 2);
			planets.radian.push(map(random(), 0, 1, 0, TWO_PI));
			planets.x.push(system.x + orbits.radii[i] * cos(planets.radian[i]));
			planets.y.push(system.y - orbits.radii[i] * sin(planets.radian[i]));
		} else if (newSystem == false) {
			planets.x[i] = system.x + orbits.radii[i] * cos(planets.radian[i]);
			planets.y[i] = system.y - orbits.radii[i] * sin(planets.radian[i]);
		}
		noStroke();
		fill(planets.color[i]);
		ellipse(planets.x[i], planets.y[i], planets.diameter[i]);
	}
	if (newSystem == true) {
		clearInterval(systemInterval);
		systemInterval = setInterval(function () { animateSystem(); }, 25);
	}

	// Goldilocks Zone
	if (devMode == true) {
		noFill();
		stroke(255);
		ellipse(system.x, system.y, minimumGoldilocks + star.diameter);
		ellipse(system.x, system.y, maximumGoldilocks + star.diameter);
	}

	// Asteroids
	if (newSystem == true) {
		asteroidBelt.radius = system.radius;
		asteroidBelt.width = random(minimumAsteroidBeltWidth, maximumAsteroidBeltWidth);
		asteroidBelt.asteroids.coefficient = map(system.diameter, minimumSystemDiameter, maximumSystemDiameter, .75, 1.25);
		asteroidBelt.asteroids.count = ceil(asteroidBelt.asteroids.coefficient * ceil(random(minimumAsteroidsFull, maximumAsteroidsFull)));
		for (i = 0; i < asteroidBelt.asteroids.count; i++) {
			asteroidBelt.asteroids.array.push(new Asteroid());
		}
	}
	for (i = 0; i < asteroidBelt.asteroids.count; i++) {
		asteroidBelt.asteroids.array[i].x = system.x + (asteroidBelt.radius + asteroidBelt.asteroids.array[i].offset) * cos(asteroidBelt.asteroids.array[i].radian);
		asteroidBelt.asteroids.array[i].y = system.y + (asteroidBelt.radius + asteroidBelt.asteroids.array[i].offset) * sin(asteroidBelt.asteroids.array[i].radian);
		drawAsteroid(asteroidBelt.asteroids.array[i]);
	}

	// Warp Gates
	if (newSystem == true) {
		warpGates.count = 0;
		warpGates.array = [];
	}
	for (i = 0; i < warpGates.count; i++) {
		warpGates.array[i].x = system.x + warpGates.array[i].orbitRadius * cos(warpGates.array[i].radian);
		warpGates.array[i].y = system.y + warpGates.array[i].orbitRadius * sin(warpGates.array[i].radian);
		noFill();
		stroke(255);
		ellipse(warpGates.array[i].x, warpGates.array[i].y, warpGates.array[i].diameterX, warpGates.array[i].diameterY);
	}

	// Stations
	if (newSystem == true) {
		stations.count = 0;
		stations.outer = [];
		stations.inner = [];
	}
	fill(180);
	noStroke();
	for (i = 0; i < stations.count; i++) {
		stations.outer[i].x = system.x + stations.outer[i].orbitRadius * cos(stations.outer[i].radian);
		stations.outer[i].y = system.y + stations.outer[i].orbitRadius * sin(stations.outer[i].radian);
		drawItem(stations.outer[i].directions, stations.outer[i].x, stations.outer[i].y, stationUnitLength);
	}

	if (devMode == true) {
		for (i = 0; i < stations.outer.length; i++) {
			noFill();
			stroke(255);
			rect(stations.outer[i].x - stationClickBuffer, stations.outer[i].y - stationClickBuffer, stationClickBuffer * 2, stationClickBuffer * 2);
		}
	}

	// Beacons
	if (newSystem == true) {
		beacons.count = 0;
		beacons.array = [];
	}
	fill(180);
	noStroke();
	for (i = 0; i < beacons.count; i++) {
		beacons.array[i].x = system.x + beacons.array[i].r * cos(beacons.array[i].radian);
		beacons.array[i].y = system.y + beacons.array[i].r * sin(beacons.array[i].radian);
		drawItem(beaconItem, beacons.array[i].x, beacons.array[i].y);
	}

	// Mining Barges
	if (newSystem == true) {
		barges.count = 0;
		barges.array = [];
	}

	// Mine Fields
	if (newSystem == true) {
		military.mineFields.count = 0;
		military.mineFields.array = [];
	}

	for (i = 0; i < military.mineFields.count; i++) {
		military.mineFields.array[i].x = system.x + military.mineFields.array[i].r * cos(military.mineFields.array[i].radian);
		military.mineFields.array[i].y = system.y + military.mineFields.array[i].r * sin(military.mineFields.array[i].radian);
		for (j = 0; j < military.mineFields.array[i].count; j++) {
			military.mineFields.array[i].mines[j].x = military.mineFields.array[i].x + military.mineFields.array[i].mines[j].r * cos(military.mineFields.array[i].mines[j].radian);
			military.mineFields.array[i].mines[j].y = military.mineFields.array[i].y + military.mineFields.array[i].mines[j].r * sin(military.mineFields.array[i].mines[j].radian);
			if (military.mineFields.array[i].mines[j].exploding == true) {
				drawExplosion(military.mineFields.array[i].mines[j]);
			} else {
				fill(30);
				stroke(200);
				ellipse(military.mineFields.array[i].mines[j].x, military.mineFields.array[i].mines[j].y, military.mineFields.array[i].mines[j].radius * 2); // Base
				fill('#a01843'); // Dark Red
				noStroke();
				ellipse(military.mineFields.array[i].mines[j].x, military.mineFields.array[i].mines[j].y, military.mineFields.array[i].mines[j].radius * 2 / 3); // Center
			}
		}
	}

	if (devMode == true) { // Point at center of mine field
		fill(255);
		noStroke();
		for (i = 0; i < military.mineFields.count; i++) {
			ellipse(military.mineFields.array[i].x, military.mineFields.array[i].y, 4);
		}
	}

	// Name
	if (newSystem == true || from == 'save') {
		clearInterval(fadeInterval);
		if (from !== 'save') {
			system.name = '';
			system.syllables = random(1, 4);
			for (i = 0; i < system.syllables; i++) {
				system.name += random(consonants) + random(vowels);
			}
			while (previousNames.indexOf(system.name) !== -1) {
				system.name = '';
				system.syllables = random(1, 4);
				for (i = 0; i < system.syllables; i++) {
					system.name += random(consonants) + random(vowels);
				}
			}
			system.name = system.name.charAt(0).toUpperCase() + system.name.slice(1);
			previousNames.push(system.name);
		}
		arrivalMessage = {
			color: 255, 
			fade: 1, 
			endFade: spaceBackground
		}
		fadeInterval = setInterval(function() { 
			if (state == 'solarSystem') {
				arrivalMessage.color -= arrivalMessage.fade;
			}
		}, 20);
	} else if (newSystem == false) {
		textFont('Verdana');
		textSize(60);
		noStroke();
		if (arrivalMessage.color <= arrivalMessage.endFade) {
			clearInterval(fadeInterval);
			arrivalMessage.color = arrivalMessage.endFade;
		} else {
			fill(arrivalMessage.color); 
			text(system.name, center.x - textWidth(system.name) / 2, center.y * 2 / 3);
		}
	}
	if (newSystem) {
		planets.name = [];
		for (i = 0; i < orbits.count; i++) {
			planets.name.push(system.name + '-' + (i + 1));
		}
	}
	socket.emit('CurrentSystem', system.name);

	// Ship
	ship.client = socket.id;
	ship.system = system.name;
	if (newSystem == true) {
		ship.speed = 0;
		ship.initial.x = map(random(), 0, 1, panSideBuffer, width - panSideBuffer);
		ship.initial.y = map(random(), 0, 1, panTopBuffer, height - panTopBuffer);
		ship.radius = sqrt(sq(ship.initial.x - system.x) + sq(ship.initial.y - system.y));
		for (i = 0; i < warpGates.count; i++) {
			for (j = 0; j < stations.count; j++) {
				while ((ship.initial.x >= warpGates.array[i].x - warpGates.array[i].maxDiameterX && ship.initial.x <= warpGates.array[i].x + warpGates.array[i].maxDiameterX && ship.initial.y >= warpGates.array[i].y - warpGates.array[i].maxDiameterY && ship.initial.y <= warpGates.array[i].y + warpGates.array[i].maxDiameterY) || // Warp Gates
					(ship.initial.x >= stations.outer[j].x - stationClickBuffer * 2 && ship.initial.x <= stations.outer[j].x + stationClickBuffer * 2 && ship.initial.y >= stations.outer[j].y - stationClickBuffer * 2 && ship.initial.y <= stations.outer[j].y + stationClickBuffer * 2) || // Stations
					(ship.initial.x >= system.x - star.radius && ship.initial.x <= system.x + star.radius && ship.initial.y >= system.y - star.radius && ship.initial.y <= system.y + star.radius) || // Star
					(ship.radius >= asteroidBelt.radius && ship.radius <= asteroidBelt.radius + asteroidBelt.width)) {	// Asteroid Belt
					ship.initial.x = map(random(), 0, 1, panSideBuffer, width - panSideBuffer);
					ship.initial.y = map(random(), 0, 1, panTopBuffer, height - panTopBuffer);
					ship.radius = sqrt(sq(ship.initial.x - system.x) + sq(ship.initial.y - system.y));
				}
			}
		}
		
		ship.x = ship.initial.x;
		ship.y = ship.initial.y;
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
	}
	for (i in ships) {
		if (i != socket.id && ships[i].system == system.name && ships[i].exploding != true) {
			drawShip(ships[i]);
		}
	}
	if (from != 'init') {
		socket.emit('Ship', ship);
		if (ship.exploding == true) {
			drawExplosion(ship);
		} else {
			drawShip(ship);
		}
	}

	// Pan
	if (newSystem) {
		pan.x = 0;
		pan.y = 0;
	}
	adjustSystem();

	// Don't Draw
	if (from == 'init') {
		clear();
		background(spaceBackground);
		drawStars(false);
	}
}

function animateSystem() {
	// Planet Revolution
	for (i = 0; i < orbits.count; i++) {
		planets.radian[i] += orbits.velocities[i];
	}

	// Station Revolution
	for (i = 0; i < stations.count; i++) {
		stations.outer[i].radian += stations.outer[i].orbitSpeed;
	}

	// Warp Gates
	for (i = 0; i < warpGates.count; i++) {
		// Revolution
		warpGates.array[i].radian += warpGates.array[i].orbitSpeed;

		// Pulsation
		warpGates.array[i].diameterX += warpGates.array[i].pulseSpeedX;
		warpGates.array[i].diameterY += warpGates.array[i].pulseSpeedY;
		if (warpGates.array[i].diameterX >= warpGates.array[i].maxDiameterX) {
			warpGates.array[i].diameterX = warpGates.array[i].minDiameterX;
			warpGates.array[i].diameterY = warpGates.array[i].minDiameterY;
		} else if (warpGates.array[i].diameterY >= warpGates.array[i].maxDiameterY) {
			warpGates.array[i].diameterX = warpGates.array[i].minDiameterX;
			warpGates.array[i].diameterY = warpGates.array[i].minDiameterY;
		}
	}

	// Asteroid Belt Revolution
	for (i = 0; i < asteroidBelt.asteroids.count; i++) {
		asteroidBelt.asteroids.array[i].radian += asteroidBelt.asteroids.array[i].orbitSpeed;
	}

	// Beacon Revolution
	for (i = 0; i < beacons.count; i++) {
		beacons.array[i].radian += beacons.array[i].speed;
	}

	// Mine Field Revolution
	for (i = 0; i < military.mineFields.count; i++) {
		military.mineFields.array[i].radian += military.mineFields.array[i].speed;
		for (j = 0; j < military.mineFields.array[i].count; j++) {
			military.mineFields.array[i].mines[j].r += military.mineFields.array[i].mines[j].speed;
		}
	}

	if (state == 'solarSystem') {
		regenerate();
	}

	if (based != true) {
		flag('startGame');
	}
}

var warpInterval;
var starInterval;
var warp = {
	time: undefined, 
	diameter: undefined, 
	exponent: undefined, 
}
function initializeWarp(from) {
	clearInterval(systemInterval);
	state = 'warp';
	warp.time = 0;
	warp.diameter = 1.1;
	warp.exponent = 1;
	if (from == 'save') {
		warpInterval = setInterval(function() { warpAnimation('save'); }, 25);
	} else {
		warpInterval = setInterval(function() { warpAnimation(); }, 25);
	}
	starInterval = setInterval(function() { drawStars(true); }, 32);

	function warpAnimation(from) {
		state = 'warp';
		clear();
		background(spaceBackground);
		fill(200);
		stroke(200);
		ellipse(centerX, centerY, warp.diameter);
		stroke(0);
		warp.diameter = pow(warp.diameter, warp.exponent);
		warp.exponent += .01;
		warp.time++;
		if (warp.time >= 34) {
			clearInterval(warpInterval);
			clearInterval(starInterval);
			if (from == 'save') {
				ship.speed = 0;
				systemInterval = setInterval(function () { animateSystem(); }, 25);
				regenerate('save');
			} else {
				generate();
			}
		}
	}
}

function fly(shiP) {
	if (((keyIsDown(38) || keyIsDown(87)) && (keyIsDown(37) || keyIsDown(65))) && shiP.exploding != true) {
		shiP.direction = 'ul';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.x - shiP.speed * cos45 > 0 && shiP.y - shiP.speed * cos45 > 0) {
			shiP.x -= shiP.speed * cos45;
			shiP.y -= shiP.speed * cos45;
		}
	} else if (((keyIsDown(38) || keyIsDown(87)) && (keyIsDown(39) || keyIsDown(68))) && shiP.exploding != true) {
		shiP.direction = 'ur';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.x + shiP.speed * cos45 < width && shiP.y - shiP.speed * cos45 > 0) {
			shiP.x += shiP.speed * cos45;
			shiP.y -= shiP.speed * cos45;
		}
	} else if (((keyIsDown(40) || keyIsDown(83)) && (keyIsDown(39) || keyIsDown(68))) && shiP.exploding != true) {
		shiP.direction = 'dr';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.x + shiP.speed * cos45 < width && shiP.y + shiP.speed * cos45 < height) {
			shiP.x += shiP.speed * cos45;
			shiP.y += shiP.speed * cos45;
		}
	} else if (((keyIsDown(40) || keyIsDown(83)) && (keyIsDown(37) || keyIsDown(65))) && shiP.exploding != true) {
		shiP.direction = 'dl';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.x - shiP.speed * cos45 > 0 && shiP.y + shiP.speed * cos45 < height) {
			shiP.x -= shiP.speed * cos45;
			shiP.y += shiP.speed * cos45;
		}
	} else	if ((keyIsDown(37) || keyIsDown(65)) && shiP.exploding != true) {
		shiP.direction = 'l';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.x - shiP.speed > 0) {
			shiP.x -= shiP.speed;
		}
	} else if ((keyIsDown(38) || keyIsDown(87)) && shiP.exploding != true) {
		shiP.direction = 'u';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.y - shiP.speed > 0) {
			shiP.y -= shiP.speed;
		}
	} else if ((keyIsDown(39) || keyIsDown(68)) && shiP.exploding != true) {
		shiP.direction = 'r';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.x + shiP.speed < width) {
			shiP.x += shiP.speed;
		}
	} else if ((keyIsDown(40) || keyIsDown(83)) && shiP.exploding != true) {
		shiP.direction = 'd';
		if (shiP.speed < shipSpeedCap) {
			shiP.speed += shipAcceleration;
		}
		if (shiP.y + shiP.speed < height) {
			shiP.y += shiP.speed;
		}
	} else if (shiP.direction == 'ul' && !((keyIsDown(38) || keyIsDown(87)) && (keyIsDown(37) || keyIsDown(65))) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.x - shiP.speed * cos45 > 0 && shiP.y - shiP.speed * cos45 > 0) {
			shiP.x -= shiP.speed * cos45;
			shiP.y -= shiP.speed * cos45;
		}
	} else if (shiP.direction == 'ur' && !((keyIsDown(38) || keyIsDown(87)) && (keyIsDown(39) || keyIsDown(68))) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.x + shiP.speed * cos45 < width && shiP.y - shiP.speed * cos45 > 0) {
			shiP.x += shiP.speed * cos45;
			shiP.y -= shiP.speed * cos45;
		}
	} else if (shiP.direction == 'dr' && !((keyIsDown(40) || keyIsDown(83)) && (keyIsDown(39) || keyIsDown(68))) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.x + shiP.speed * cos45 < width && shiP.y + shiP.speed * cos45 < height) {
			shiP.x += shiP.speed * cos45;
			shiP.y += shiP.speed * cos45;
		}
	} else if (shiP.direction == 'dl' && !((keyIsDown(40) || keyIsDown(83)) && (keyIsDown(37) || keyIsDown(65))) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.x - shiP.speed * cos45 > 0 && shiP.y + shiP.speed * cos45 < height) {
			shiP.x -= shiP.speed * cos45;
			shiP.y += shiP.speed * cos45;
		}
	} else if (shiP.direction == 'l' && !(keyIsDown(37) || keyIsDown(65)) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.x + shiP.speed < width) {
			shiP.x -= shiP.speed;
		}
	} else if (shiP.direction == 'u' && !(keyIsDown(38) || keyIsDown(87)) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.y - shiP.speed > 0) {
			shiP.y -= shiP.speed;
		}
	} else if (shiP.direction == 'r' && !(keyIsDown(39) || keyIsDown(68)) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.x + shiP.speed < width) {
			shiP.x += shiP.speed;
		}
	} else if (shiP.direction == 'd' && !(keyIsDown(40) || keyIsDown(83)) && shiP.exploding != true) {
		shiP.speed = shipDeceleration * shiP.speed;
		if (shiP.y + shiP.speed < height) {
			shiP.y += shiP.speed;
		}
	}
	if (state == 'solarSystem') {
		shiP.radius = sqrt(sq(shiP.x - system.x) + sq(shiP.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
	}
}

function explodeShip(shiP) { // Ship explode only
	shiP.speed = 0;
	if (shiP.client == socket.id) {
		shiP.exploding = true;
		socket.emit('ExplodeShip', shiP);
	}
	shiP.explode.max = 5;
	shiP.explode.spacing = 4;
	shiP.explode.weight = 2;
	shiP.explode.size = 0;
	drawSolarSystems(false);
	shiP.explode.interval = setInterval(function() {
		shiP.explode.size += .07;
		drawExplosion(shiP);
		if (shiP.explode.size > shiP.explode.max) {
			clearInterval(shiP.explode.interval);
			shiP.exploding = false;
			for (i in ships) {
				if (ships[i].client == socket.id) {
					ships[i].exploding = false;
				}
			}
			if (shiP.client == socket.id) {
				for (iE in inventory) { // Clear ship inventory
					if (iE == 'ores' || iE == 'refined') { // Inventory possible contents
						for (jE in inventory[iE]) {
							inventory[iE][jE].value = 0;
						}
					}
				}
				loadSystem(home.index, 'respawn');
				for (iE = 0; iE < stations.count; iE++) {
					if (stations.outer[iE].type == 'base') {
						stations.id = iE;
						drawInnerStation(true);
					}
				}
			}
		}
	}, 25);
}

function drawExplosion(objecT) {
	push();
	translate(objecT.x, objecT.y);
	noFill();
	stroke(245);
	strokeWeight(objecT.explode.weight);
	line(objecT.explode.spacing, 0, objecT.explode.spacing + objecT.explode.size, 0);
	line(objecT.explode.spacing * cos45, objecT.explode.spacing * cos45, (objecT.explode.spacing + objecT.explode.size) * cos45, (objecT.explode.spacing + objecT.explode.size) * cos45);
	line(0, objecT.explode.spacing, 0, objecT.explode.spacing + objecT.explode.size);
	line(-objecT.explode.spacing * cos45, objecT.explode.spacing * cos45, -(objecT.explode.spacing + objecT.explode.size) * cos45, (objecT.explode.spacing + objecT.explode.size) * cos45);
	line(-objecT.explode.spacing, 0, -objecT.explode.spacing - objecT.explode.size, 0);
	line(-objecT.explode.spacing * cos45, -objecT.explode.spacing * cos45, -(objecT.explode.spacing + objecT.explode.size) * cos45, -(objecT.explode.spacing + objecT.explode.size) * cos45);
	line(0, -objecT.explode.spacing, 0, -objecT.explode.spacing - objecT.explode.size);
	line(objecT.explode.spacing * cos45, -objecT.explode.spacing * cos45, (objecT.explode.spacing + objecT.explode.size) * cos45, -(objecT.explode.spacing + objecT.explode.size) * cos45);
	pop();
}

function drawShip(shiP) {
	if (state == 'solarSystem') {
		shiP.x = system.x + shiP.radius * cos(shiP.radian);
		shiP.y = system.y + shiP.radius * sin(shiP.radian);
	}
	push();
	translate(shiP.x, shiP.y);
	if (shiP.direction == 'l') {
		rotate(-HALF_PI);
	} else if (shiP.direction == 'ul') {
		rotate(-QUARTER_PI);
	} else if (shiP.direction == 'u') {
		// rotate(0);
	} else if (shiP.direction == 'ur') {
		rotate(QUARTER_PI);
	} else if (shiP.direction == 'r') {
		rotate(HALF_PI);
	} else if (shiP.direction == 'dr') {
		rotate(HALF_PI + QUARTER_PI);
	}	else if (shiP.direction == 'd') {
		rotate(PI);
	} else if (shiP.direction == 'dl') {
		rotate(-HALF_PI - QUARTER_PI);
	}
	image(shipImage, -shiP.width / 2, -shiP.height / 2, shiP.width, shiP.height);
	pop();
}

function drawShips(shipS) {
	ships = shipS;
}

function undock(from) {
	if (from == 'station') {
		if (ship.direction == 'l') {
			ship.x += 2 * stationClickBuffer;
			ship.direction = 'r';
		} else if (ship.direction == 'ul') {
			ship.x += 2 * stationClickBuffer;
			ship.y += 2 * stationClickBuffer;
			ship.direction = 'dr';
		} else if (ship.direction == 'u') {
			ship.y += 2 * stationClickBuffer;
			ship.direction = 'd';
		} else if (ship.direction == 'ur') {
			ship.x -= 2 * stationClickBuffer;
			ship.y += 2 * stationClickBuffer;
			ship.direction = 'dl';
		} else if (ship.direction == 'r') {
			ship.x -= 2 * stationClickBuffer;
			ship.direction = 'l';
		} else if (ship.direction == 'dr') {
			ship.x -= 2 * stationClickBuffer;
			ship.y -= 2 * stationClickBuffer;
			ship.direction = 'ul';
		} else if (ship.direction == 'd') {
			ship.y -= 2 * stationClickBuffer;
			ship.direction = 'u';
		} else if (ship.direction == 'dl') {
			ship.x += 2 * stationClickBuffer;
			ship.y -= 2 * stationClickBuffer;
			ship.direction = 'ur';
		}
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
		cancel();
	} else if (from == 'warpGate') {
		if (ship.direction == 'l') {
			ship.x += warpGates.array[warpGates.id].maxDiameterX;
			ship.direction = 'r';
		} else if (ship.direction == 'ul') {
			ship.x += warpGates.array[warpGates.id].maxDiameterX * cos45;
			ship.y += warpGates.array[warpGates.id].maxDiameterY * cos45;
			ship.direction = 'dr';
		}	else if (ship.direction == 'u') {
			ship.y += warpGates.array[warpGates.id].maxDiameterY;
			ship.direction = 'd';
		} else if (ship.direction == 'ur') {
			ship.x -= warpGates.array[warpGates.id].maxDiameterX * cos45;
			ship.y += warpGates.array[warpGates.id].maxDiameterY * cos45;
			ship.direction = 'dl';
		}	else if (ship.direction == 'r') {
			ship.x -= warpGates.array[warpGates.id].maxDiameterX;
			ship.direction = 'l';
		} else if (ship.direction == 'dr') {
			ship.x -= warpGates.array[warpGates.id].maxDiameterX * cos45;
			ship.y -= warpGates.array[warpGates.id].maxDiameterY * cos45;
			ship.direction = 'ul';
		}	else if (ship.direction == 'd') {
			ship.y -= warpGates.array[warpGates.id].maxDiameterY;
			ship.direction = 'u';
		} else if (ship.direction == 'dl') {
			ship.x += warpGates.array[warpGates.id].maxDiameterX * cos45;
			ship.y -= warpGates.array[warpGates.id].maxDiameterY * cos45;
			ship.direction = 'ur';
		}
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
		cancel();
	} else if (from == 'planet') {
		if (ship.direction == 'l') {
			ship.x += planets.diameter[planets.id];
			ship.direction = 'r';
		} else if (ship.direction == 'ul') {
			ship.x += planets.diameter[planets.id];
			ship.y += planets.diameter[planets.id];
			ship.direction = 'dr';
		}	else if (ship.direction == 'u') {
			ship.y += planets.diameter[planets.id];
			ship.direction = 'd';
		} else if (ship.direction == 'ur') {
			ship.x -= planets.diameter[planets.id];
			ship.y += planets.diameter[planets.id];
			ship.direction = 'dl';
		}	else if (ship.direction == 'r') {
			ship.x -= planets.diameter[planets.id];
			ship.direction = 'l';
		} else if (ship.direction == 'dr') {
			ship.x -= planets.diameter[planets.id];
			ship.y -= planets.diameter[planets.id];
			ship.direction = 'ul';
		}	else if (ship.direction == 'd') {
			ship.y -= planets.diameter[planets.id];
			ship.direction = 'u';
		} else if (ship.direction == 'dl') {
			ship.x += planets.diameter[planets.id];
			ship.y -= planets.diameter[planets.id];
			ship.direction = 'ur';
		}
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
		cancel();
	} else if (from == 'star') {
		if (ship.direction == 'l') {
			ship.x += star.diameter / 4;
			ship.direction = 'r';
		} else if (ship.direction == 'ul') {
			ship.x += star.diameter / 4 * cos45;
			ship.y += star.diameter / 4 * cos45;
			ship.direction = 'dr';
		}	else if (ship.direction == 'u') {
			ship.y += star.diameter / 4;
			ship.direction = 'd';
		} else if (ship.direction == 'ur') {
			ship.x -= star.diameter / 4 * cos45;
			ship.y += star.diameter / 4 * cos45;
			ship.direction = 'dl';
		}	else if (ship.direction == 'r') {
			ship.x -= star.diameter / 4;
			ship.direction = 'l';
		} else if (ship.direction == 'dr') {
			ship.x -= star.diameter / 4 * cos45;
			ship.y -= star.diameter / 4 * cos45;
			ship.direction = 'ul';
		}	else if (ship.direction == 'd') {
			ship.y -= star.diameter / 4;
			ship.direction = 'u';
		} else if (ship.direction == 'dl') {
			ship.x += star.diameter / 4 * cos45;
			ship.y -= star.diameter / 4 * cos45;
			ship.direction = 'ur';
		}
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
		cancel();
	}	else if (from == 'asteroidBelt') {
		if (ship.direction == 'l') {
			ship.x += asteroidBelt.width / 2;
			ship.direction = 'r';
		} else if (ship.direction == 'ul') {
			ship.x += asteroidBelt.width / 2 * cos45;
			ship.y += asteroidBelt.width / 2 * cos45;
			ship.direction = 'dr';
		}	else if (ship.direction == 'u') {
			ship.y += asteroidBelt.width / 2;
			ship.direction = 'd';
		} else if (ship.direction == 'ur') {
			ship.x -= asteroidBelt.width / 2 * cos45;
			ship.y += asteroidBelt.width / 2 * cos45;
			ship.direction = 'dl';
		}	else if (ship.direction == 'r') {
			ship.x -= asteroidBelt.width / 2;
			ship.direction = 'l';
		} else if (ship.direction == 'dr') {
			ship.x -= asteroidBelt.width / 2 * cos45;
			ship.y -= asteroidBelt.width / 2 * cos45;
			ship.direction = 'ul';
		}	else if (ship.direction == 'd') {
			ship.y -= asteroidBelt.width / 2;
			ship.direction = 'u';
		} else if (ship.direction == 'dl') {
			ship.x += asteroidBelt.width / 2 * cos45;
			ship.y -= asteroidBelt.width / 2 * cos45;
			ship.direction = 'ur';
		}
		ship.radius = sqrt(sq(ship.x - system.x) + sq(ship.y - system.y));
		ship.radian = acos((ship.x - system.x) / ship.radius);
		if (ship.y < system.y) {
			ship.radian *= -1;
		}
		cancel();
	} else if (from == 'asteroid') {
		if (belt.ship.direction == 'l') {
			belt.ship.x += belt.asteroids.array[belt.asteroids.index].r * 2;
			belt.ship.direction = 'r';
		} else if (belt.ship.direction == 'ul') {
			belt.ship.x += belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.y += belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.direction = 'dr';
		}	else if (belt.ship.direction == 'u') {
			belt.ship.y += belt.asteroids.array[belt.asteroids.index].r * 2;
			belt.ship.direction = 'd';
		} else if (belt.ship.direction == 'ur') {
			belt.ship.x -= belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.y += belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.direction = 'dl';
		}	else if (belt.ship.direction == 'r') {
			belt.ship.x -= belt.asteroids.array[belt.asteroids.index].r * 2;
			belt.ship.direction = 'l';
		} else if (belt.ship.direction == 'dr') {
			belt.ship.x -= belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.y -= belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.direction = 'ul';
		}	else if (belt.ship.direction == 'd') {
			belt.ship.y -= belt.asteroids.array[belt.asteroids.index].r * 2;
			belt.ship.direction = 'u';
		} else if (belt.ship.direction == 'dl') {
			belt.ship.x += belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.y -= belt.asteroids.array[belt.asteroids.index].r * 2 * cos45;
			belt.ship.direction = 'ur';
		}
		belt.ship.speed = 0;
		belt.setInterval();
	} else if (from == 'beltMargin') {
		if (belt.ship.direction == 'l') {
			belt.ship.x += abs(belt.ship.x - panSideBuffer) + 10;
			belt.ship.direction = 'r';
		} else if (belt.ship.direction == 'ul') {
			belt.ship.x += abs(belt.ship.x - panSideBuffer) + 10 * cos45;
			belt.ship.y += 10 * cos45;
			belt.ship.direction = 'dr';
		} else if (belt.ship.direction == 'ur') {
			belt.ship.x -= abs(belt.ship.x - width + panSideBuffer) + 10 * cos45;
			belt.ship.y += 10 * cos45;
			belt.ship.direction = 'dl';
		}	else if (belt.ship.direction == 'r') {
			belt.ship.x -= abs(belt.ship.x - width + panSideBuffer) + 10;
			belt.ship.direction = 'l';
		} else if (belt.ship.direction == 'dr') {
			belt.ship.x -= abs(belt.ship.x - width + panSideBuffer) + 10 * cos45;
			belt.ship.y -= 10 * cos45;
			belt.ship.direction = 'ul';
		} else if (belt.ship.direction == 'dl') {
			belt.ship.x += abs(belt.ship.x - panSideBuffer) + 10 * cos45;
			belt.ship.y -= 10 * cos45;
			belt.ship.direction = 'ur';
		}
		for (i = 0; i < belt.asteroids.count; i++) {
			if (belt.asteroids.array[i].x >= belt.ship.x - maximumAsteroidRadiusFull && belt.asteroids.array[i].x <= belt.ship.x + maximumAsteroidRadiusFull && belt.asteroids.array[i].y >= belt.ship.y - maximumAsteroidRadiusFull && belt.asteroids.array[i].y <= belt.ship.y + maximumAsteroidRadiusFull){
				while (sqrt(sq(belt.ship.x - belt.asteroids.array[i].x) + sq(belt.ship.y - belt.asteroids.array[i].y)) <= belt.asteroids.array[i].r) {
					belt.asteroids.index = i;
					if (belt.ship.direction.indexOf('r') !== -1) {
						belt.ship.x += belt.asteroids.array[i].r;
					} else if (belt.ship.direction.indexOf('l') !== -1) {
						belt.ship.x -= belt.asteroids.array[i].r;
					}
				}
			}
		}
		belt.ship.speed = 0;
		belt.setInterval();
	}	else if (from == 'ten') {
		if (belt.ship.direction == 'l') {
			belt.ship.x += 10;
			belt.ship.direction = 'r';
		} else if (belt.ship.direction == 'ul') {
			belt.ship.x += 10 * cos45;
			belt.ship.y += 10 * cos45;
			belt.ship.direction = 'dr';
		}	else if (belt.ship.direction == 'u') {
			belt.ship.y += 10;
			belt.ship.direction = 'd';
		} else if (belt.ship.direction == 'ur') {
			belt.ship.x -= 10 * cos45;
			belt.ship.y += 10 * cos45;
			belt.ship.direction = 'dl';
		}	else if (belt.ship.direction == 'r') {
			belt.ship.x -= 10;
			belt.ship.direction = 'l';
		} else if (belt.ship.direction == 'dr') {
			belt.ship.x -= 10 * cos45;
			belt.ship.y -= 10 * cos45;
			belt.ship.direction = 'ul';
		}	else if (belt.ship.direction == 'd') {
			belt.ship.y -= 10;
			belt.ship.direction = 'u';
		} else if (belt.ship.direction == 'dl') {
			belt.ship.x += 10 * cos45;
			belt.ship.y -= 10 * cos45;
			belt.ship.direction = 'ur';
		}
		belt.ship.speed = 0;
		belt.setInterval();
	}
	else {
		console.error('Error: undock()');
	}
}

var pan = {
	speed: undefined, 
	x: undefined, 
	y: undefined, 
	load: {
		x: undefined, 
		y: undefined
	}
};
function adjustSystem() {
	if (ship.x < panSideBuffer && ship.y < panTopBuffer) {
		pan.x -= ship.x - panSideBuffer;
		ship.x -= ship.x - panSideBuffer;
		pan.y -= ship.y - panTopBuffer;
		ship.y -= ship.y - panTopBuffer;
		system.x = system.initial.x + pan.x;
		system.y = system.initial.y + pan.y;
	} else if (ship.x > width - panSideBuffer && ship.y < panTopBuffer) {
		pan.x -= ship.x - width + panSideBuffer;
		ship.x -= ship.x - width + panSideBuffer;
		pan.y -= ship.y - panTopBuffer;
		ship.y -= ship.y - panTopBuffer;
		system.x = system.initial.x + pan.x;
		system.y = system.initial.y + pan.y;
	} else if (ship.x > width - panSideBuffer && ship.y > height - panTopBuffer) {
		pan.x -= ship.x - width + panSideBuffer;
		ship.x -= ship.x - width + panSideBuffer;
		pan.y -= ship.y - height + panTopBuffer;
		ship.y -= ship.y - height + panTopBuffer;
		system.x = system.initial.x + pan.x;
		system.y = system.initial.y + pan.y;
	} else if (ship.x < panSideBuffer && ship.y > height - panTopBuffer) {
		pan.x -= ship.x - panSideBuffer;
		ship.x -= ship.x - panSideBuffer;
		pan.y -= ship.y - height + panTopBuffer;
		ship.y -= ship.y - height + panTopBuffer;
		system.x = system.initial.x + pan.x;
		system.y = system.initial.y + pan.y;
	} else if (ship.x < panSideBuffer) {
		pan.x -= ship.x - panSideBuffer;
		ship.x -= ship.x - panSideBuffer;
		system.x = system.initial.x + pan.x;
	} else if (ship.x > width - panSideBuffer) {
		pan.x -= ship.x - width + panSideBuffer;
		ship.x -= ship.x - width + panSideBuffer;
		system.x = system.initial.x + pan.x;
	} else if (ship.y < panTopBuffer) {
		pan.y -= ship.y - panTopBuffer;
		ship.y -= ship.y - panTopBuffer;
		system.y = system.initial.y + pan.y;
	} else if (ship.y > height - panTopBuffer) {
		pan.y -= ship.y - height + panTopBuffer;
		ship.y -= ship.y - height + panTopBuffer;
		system.y = system.initial.y + pan.y;
	}
}

function checkCollisions() {
	if (state == 'solarSystem') {
		for (i = 0; i < warpGates.count; i++) {
			if (ship.x >= warpGates.array[i].x - warpGates.array[i].maxDiameterX / 2 && ship.x <= warpGates.array[i].x + warpGates.array[i].maxDiameterX / 2&& ship.y >= warpGates.array[i].y - warpGates.array[i].maxDiameterY / 2 && ship.y <= warpGates.array[i].y + warpGates.array[i].maxDiameterY / 2) { // Warp Gate
				ship.speed = 0;
				warpGates.id = i;
				flag('warp');
			}
		}
		for (i = 0; i < stations.count; i++) {
			if (ship.x >= stations.outer[i].x - stationClickBuffer && ship.x <= stations.outer[i].x + stationClickBuffer && ship.y >= stations.outer[i].y - stationClickBuffer && ship.y <= stations.outer[i].y + stationClickBuffer) { // Station
				ship.speed = 0;
				stations.id = i;
				if (stations.outer[stations.id].type == 'base') {
					if (stations.outer[stations.id].client == socket.id) {
						flag('enterStation');
					} else {
						flag('enterEnemyBase');
					}
				} else if (stations.outer[stations.id].type == 'mobile') {
					flag('enterStation');
				}
			}
		}
		if (ship.radius <= star.diameter / 2) { // Star
			ship.speed = 0;
			flag('star');
		} else if (ship.radius >= system.radius && ship.radius <= system.radius + asteroidBelt.width) { // Asteroid Belt
			ship.speed = 0;
			flag('enterAsteroidBelt');
		}
		for (i = 0; i < orbits.count; i++) { // Enter Planet
			if (ship.x >= planets.x[i] - planets.radius[i] && ship.x <= planets.x[i] + planets.radius[i] && ship.y >= planets.y[i] - planets.radius[i] && ship.y <= planets.y[i] + planets.radius[i]) {
				planets.id = i;
				if (planets.type[planets.id] == 'pink' || planets.type[planets.id] == 'sulfur') { // If planet is a gas giant
					flag('gasGiant');
				} else {
					flag('enterPlanet');
				}
			}
		}
		for (i = 0; i < military.mineFields.count; i++) { // Mine Field
			if (ship.x >= military.mineFields.array[i].x - military.mineFields.array[i].radius - military.mineFields.array[i].mines[0].radius && ship.x <= military.mineFields.array[i].x + military.mineFields.array[i].radius + military.mineFields.array[i].mines[0].radius && ship.y >= military.mineFields.array[i].y - military.mineFields.array[i].radius - military.mineFields.array[i].mines[0].radius && ship.y <= military.mineFields.array[i].y + military.mineFields.array[i].radius + military.mineFields.array[i].mines[0].radius) {
				military.mineFields.id = i;
				saves[system.index].military.mineFields.id = i;
				for (j = 0; j < military.mineFields.array[military.mineFields.id].count; j++) {
					if (ship.exploding != true && ship.x >= military.mineFields.array[military.mineFields.id].mines[j].x - military.mineFields.array[military.mineFields.id].mines[j].radius && ship.x <= military.mineFields.array[military.mineFields.id].mines[j].x + military.mineFields.array[military.mineFields.id].mines[j].radius && ship.y >= military.mineFields.array[military.mineFields.id].mines[j].y - military.mineFields.array[military.mineFields.id].mines[j].radius && ship.y <= military.mineFields.array[military.mineFields.id].mines[j].y + military.mineFields.array[military.mineFields.id].mines[j].radius) {
						military.mineFields.array[military.mineFields.id].mines[j].index = j;
						saves[system.index].military.mineFields.array[saves[system.index].military.mineFields.id].mines[j].index = j;
						socket.emit('ExplodeMine', { system: system.name, id: military.mineFields.id, mineIndex: j });
						explodeMine(military.mineFields.array[military.mineFields.id].mines[j]);
						explodeShip(ship);
						break;
					}
				}
			}
		}
	} else if (state == 'planet') { // Exit Planet
		if (planetPlayer.x + 3.5 + display.x >= planet.ship.x - planet.ship.width / 2 && planetPlayer.x + 3.5 + display.x <= planet.ship.x - planet.ship.width / 2 + planet.ship.width && planetPlayer.y + display.y >= planet.ship.y - planet.ship.height / 2 && planetPlayer.y + display.y <= planet.ship.y - planet.ship.height / 2 + planet.ship.height) {
			flag('exitPlanet');
		}
	}
}

function toPreviousState() {
	if (previousState == 'solarSystem') {
		cancel();
	} else if (previousState == 'innerStation') {
		drawInnerStation();
	} else if (previousState == 'belt') {
		belt.setInterval();
	} else if (previousState == 'mining') {
		mine.setInterval();
	} else if (previousState == 'planet') {
		planetPlayer.setInterval();
	}
}

function createGalaxy() {
	for (t = 0; t < galaxy.systems.count; t++) { // Generate Galaxy
		generate('init');
		saveSystem();
		clearInterval(systemInterval);
	}
	socket.emit('Saves', saves);
}

var homeIndex;
function mousePressed() {
	if (state == 'intro') {
		setHome();
		function setHome() {
			homeIndex = floor(random(0, saves.length));
			for (i = 0; i < saves[homeIndex].stations.count; i++) {
				for (j = 0; j < galaxy.systems.count; j++) {
					if (saves[j].stations.count == 0) {
						break;
					}
				}
				if (j == galaxy.systems.count) {
					flag('gameFull');
				} else if (saves[homeIndex].stations.outer[i].type == 'base' || saves[homeIndex].beacons.count != 0) {
					setHome();
					break;
				}
			}
		}
		if (state != 'gameFullFlag') {
			loadSystem(homeIndex);
			bargeMiningInterval = setInterval(bargeMining, autoMineSpeed);
		}
	} else if (state == 'galaxy') {
		for (i = 0; i < galaxy.systems.count; i++) {
			if (mouseX >= galaxy.core.x + saves[i].system.coord.x - galaxy.systems.d / 2 && mouseX <= galaxy.core.x + saves[i].system.coord.x + galaxy.systems.d / 2 && mouseY >= galaxy.core.y + saves[i].system.coord.y - galaxy.systems.d / 2 && mouseY <= galaxy.core.y + saves[i].system.coord.y + galaxy.systems.d / 2) {
				if (galaxy.systems.selected != true) {
					galaxy.systems.selected = true;
					galaxy.systems.index = i;
					break;
				}	else if (galaxy.systems.selected == true && i == galaxy.systems.index) {
					if (devMode == true) {
						galaxy.clearInterval();
						loadSystem(galaxy.systems.index);
					}
					break;
				} else {
					galaxy.systems.selected = true;
					galaxy.systems.index = i;
					break;
				}
			} else if (i == galaxy.systems.count - 1) {
				galaxy.systems.selected = false;
			}
		}
	}
}

var loadIndex;
function keyPressed() {
	if (keyCode == 37) { // LEFT_ARROW
		if (state == 'innerStation') {
			stationMove('l');
		}
	} else if (keyCode == 38) { // UP_ARROW
		if (state == 'innerStation') {
			stationMove('u');
		} else if (state == 'inventory' || state == 'refineInventory' || state == 'depositInventory' || state == 'withdrawInventory') {
			if (inventory.cursor.position > 0) {
				inventory.cursor.position--;
				if (inventory.cursor.position < inventory.rows.start && inventory.rows.start > 0) {
					inventory.rows.start--;
				}
				if (state == 'inventory') {
					openInventory('inventory');
				} else if (state == 'refineInventory') {
					openInventory('refinery');
				} else if (state == 'depositInventory') {
					openInventory('deposit');
				} else if (state == 'withdrawInventory') {
					openInventory('withdraw');
				}
			}
		} else if (state.indexOf('Menu') != -1 || state == 'labMining' || state == 'labRefining') {
			if (menU.cursor.position > 0) {
				menU.cursor.position--;
				if (menU.cursor.position < menU.rows.start && menU.rows.start > 0) {
					menU.rows.start--;
				}
				scrollMenu(menU);
			}
		}
	} else if (keyCode == 39) { // RIGHT_ARROW
		if (state == 'innerStation') {
			stationMove('r');
		}
	} else if (keyCode == 40) { // DOWN_ARROW
		if (state == 'innerStation') {
			stationMove('d');
		} else if (state.indexOf('nventory') != -1) {
			if (inventory.cursor.position < inventory.rows.count - 1) {
				inventory.cursor.position++;
				if (inventory.cursor.position > inventory.rows.max - 1  + inventory.rows.start && inventory.rows.start < inventory.rows.count - inventory.rows.max) {
					inventory.rows.start++;
				}
				if (state == 'inventory') {
					openInventory('inventory');
				} else if (state == 'refineInventory') {
					openInventory('refinery');
				} else if (state == 'depositInventory') {
					openInventory('deposit');
				} else if (state == 'withdrawInventory') {
					openInventory('withdraw');
				}
			}
		} else if (state.indexOf('Menu') != -1 || state == 'labMining' || state == 'labRefining') {
			menU.cursor.position++;
			if (menU.cursor.position > menU.rows.max - 1  + menU.rows.start && menU.rows.start < menU.rows.count - menU.rows.max) {
				menU.rows.start++;
			}
			scrollMenu(menU);
		}
	} else if (keyCode == 65) { // A
		if (state == 'innerStation') {
			stationMove('l');
		}
	} else if (keyCode == 87) { // W
		if (state == 'innerStation') {
			stationMove('u');
		} else if (state == 'inventory' || state == 'refineInventory' || state == 'depositInventory' || state == 'withdrawInventory') {
			if (inventory.cursor.position > 0) {
				inventory.cursor.position--;
				if (inventory.cursor.position < inventory.rows.start && inventory.rows.start > 0) {
					inventory.rows.start--;
				}
				if (state == 'inventory') {
					openInventory('inventory');
				} else if (state == 'refineInventory') {
					openInventory('refinery');
				} else if (state == 'depositInventory') {
					openInventory('deposit');
				} else if (state == 'withdrawInventory') {
					openInventory('withdraw');
				}
			}
		} else if (state.indexOf('Menu') != -1 || state == 'labMining' || state == 'labRefining') {
			if (menU.cursor.position > 0) {
				menU.cursor.position--;
				if (menU.cursor.position < menU.rows.start && menU.rows.start > 0) {
					menU.rows.start--;
				}
				scrollMenu(menU);
			}
		}
	} else if (keyCode == 68) { // D
		if (state == 'innerStation') {
			stationMove('r');
		}
	} else if (keyCode == 83) { // S
		if (state == 'innerStation') {
			stationMove('d');
		} else if (state == 'inventory' || state == 'refineInventory' || state == 'depositInventory' || state == 'withdrawInventory') {
			if (inventory.cursor.position < inventory.rows.count - 1) {
				inventory.cursor.position++;
				if (inventory.cursor.position > inventory.rows.max - 1  + inventory.rows.start && inventory.rows.start < inventory.rows.count - inventory.rows.max) {
					inventory.rows.start++;
				}
				if (state == 'inventory') {
					openInventory('inventory');
				} else if (state == 'refineInventory') {
					openInventory('refinery');
				} else if (state == 'depositInventory') {
					openInventory('deposit');
				} else if (state == 'withdrawInventory') {
					openInventory('withdraw');
				}
			}
		} else if (state.indexOf('Menu') != -1 || state == 'labMining' || state == 'labRefining') {
			menU.cursor.position++;
			if (menU.cursor.position > menU.rows.max - 1  + menU.rows.start && menU.rows.start < menU.rows.count - menU.rows.max) {
				menU.rows.start++;
			}
			scrollMenu(menU);
		}
	}
	else if (keyCode == 69) { // E
		if (state == 'exitStationFlag') {
			undock('station');
		} else if (state == 'enterStationFlag') {
			drawInnerStation(true);
			drawInnerStation();
		} else if (state == 'warpFlag') {
			cancel();
			loadSystem(warpGates.array[warpGates.id].destination.index);
		}	else if (state == 'enterPlanetFlag') {
			for (i = 0; i < planets.x.length; i++) {
				drawSurface(planets.type[planets.id], true, false);
				break;
			}
		} else if (state == 'exitPlanetFlag') {
			clearInterval(planetPlayerInterval);
			undock('planet');
		} else if (state == 'enterAsteroidBeltFlag') {
			drawAsteroidBelt(true);
		}	else if (state == 'innerStation') {
			if (stations.inner[stations.id].type == 'mobile') {
				if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.hanger.string) {
					flag('exitStation');
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.refinery.string) {
					flag('refinery');
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.cargoHold.string) {
					flag('cargoHold')
				}
			} else if (stations.inner[stations.id].type == 'base') {
				if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.hanger.string) {
					flag('exitStation');
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.refinery.string) {
					flag('refinery');
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.cargoHold.string) {
					flag('cargoHold')
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.engineering.string) {
					flag('engineering');
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.military.string) {
					flag('military');
				} else if (stations.inner[stations.id].player.room == stations.inner[stations.id].rooms.lab.string) {
					flag('lab');
				}
			}
		} else if (state == 'asteroidMiningFlag') {
			mine.setInterval();
		} else if (state == 'exitSystemFlag') {
			if (inSystem == true) {
				ship.radius += asteroidBelt.width * 3 / 2;
				ship.x = system.x + ship.radius * cos(ship.radian);
				ship.y = system.y + ship.radius * sin(ship.radian);
			} else if (inSystem == false) {
				undock('asteroidBelt');
			}		
			cancel();
		} else if (state == 'enterSystemFlag') {
			if (inSystem == true) {
				undock('asteroidBelt');
			} else if (inSystem == false) {
				ship.radius -= asteroidBelt.width * 3 / 2;
				ship.x = system.x + ship.radius * cos(ship.radian);
				ship.y = system.y + ship.radius * sin(ship.radian);
			}
			cancel();
		} else if (state == 'refineryFlag') {
			drawInnerStation();
			openInventory('refinery', true);
		} else if (state == 'refineInventory' && inventory.rows.count > 0) {
			if (inventory.text.left[inventory.cursor.position].indexOf('Ore') !== -1) {
				flag('cautionRefine');
			} else {
				flag('cannotRefineMetal');
			}
		} else if (state == 'cautionRefineFlag') {
			refine('one');
			drawInnerStation();
			openInventory('refinery');
		} else if (state == 'cargoHoldFlag') {
			drawInnerStation();
			openInventory('deposit', true);
		} else if (state == 'depositInventory' && inventory.rows.count > 0) {
			flag('cautionDeposit');
		} else if (state == 'withdrawInventory' && inventory.rows.count > 0) {
			flag('cautionWithdraw');
		} else if (state == 'cautionDepositFlag') {
			deposit('one');
			drawInnerStation();
			openInventory('deposit');
		} else if (state == 'cautionWithdrawFlag') {
			withdraw('one');
			drawInnerStation();
			openInventory('withdraw');
		} else if (state == 'pauseMenu') {
			if (pause.text.left[pause.cursor.position] == 'Galactic Map') {
				galaxy.setInterval();
			}	else if (pause.text.left[pause.cursor.position] == 'Inventory') {
				toPreviousState();
				setTimeout(function() {openInventory('inventory', true);}, 30);
				inventory.canCloseP = true;
			} else if (pause.text.left[pause.cursor.position] == 'Navigational Computer') {
				toPreviousState();
				setTimeout(function() {scrollMenu(navComputer, true);}, 30);
			} else if (pause.text.left[pause.cursor.position] == 'Personal Assets') {
				toPreviousState();
				setTimeout(function() {scrollMenu(assets, true);}, 30);
			}	else if (pause.text.left[pause.cursor.position] == 'Controls') {
				toPreviousState();
				setTimeout(function() {scrollMenu(controls, true);}, 30);
			}
		} else if (state == 'constructWarpGateFlag') {
			saves[warpGates.from].warpGates.array.push(new WarpGate(warpGates.to));
			saves[warpGates.from].warpGates.count++;
			saves[warpGates.from].warpGates.id = saves[warpGates.from].warpGates.array.length - 1;
			saves[warpGates.from].warpGates.from = warpGates.from;
			saves[warpGates.from].warpGates.to = warpGates.to;
			socket.emit('WarpGates', saves[warpGates.from].warpGates);
			if (saves[warpGates.from].system.name == system.name) {
				warpGates = JSON.parse(JSON.stringify(saves[warpGates.from].warpGates));
			}
			drawInnerStation();
		}	else if (state == 'navComputerMenu') {
			/*
				// Beacon Block Code
				for (i = 0; i < saves[navComputer.cursor.position].beacons.count; i++) {
					if (saves[navComputer.cursor.position].beacons.array[i].client != socket.id) {
						flag('beaconBlock');
						break;
					}
				}

				// Station Block Code
				for (i = 0; i < saves[navComputer.cursor.position].stations.count; i++) {
					if (saves[navComputer.cursor.position].stations.outer[i].client == socket.id) {
						flag('constructBeacon');
						break;
					}
				}
				if (state != 'constructBeaconFlag') {
					flag('stationBeforeStructure');
				}
			*/
			if (navComputer.choose == 'from') {
				for (i = 0; i < saves[navComputer.cursor.position].beacons.count; i++) {
					if (saves[navComputer.cursor.position].beacons.array[i].client != socket.id) {
						flag('beaconBlock');
						break;
					}
				}
				if (state != 'beaconBlockFlag') {
					warpGates.from = navComputer.cursor.position;
					navComputer.choose = 'to';
					scrollMenu(navComputer, true);
				}
			}	else if (navComputer.choose == 'to') {
				warpGates.to = navComputer.cursor.position;
				if (warpGates.to == warpGates.from) {
					flag('sameSystemWarpGate');
				} else {
					flag('constructWarpGate');
				}
			} else if (navComputer.choose == 'station') {
				for (i = 0; i < saves[navComputer.cursor.position].beacons.count; i++) {
					if (saves[navComputer.cursor.position].beacons.array[i].client != socket.id) {
						flag('beaconBlock');
						break;
					}
				}
				if (state != 'beaconBlockFlag') {
					flag('constructStation');
				}
			} else if (navComputer.choose == 'beacon') {
				if (saves[navComputer.cursor.position].beacons.count > 0) {
					for (i = 0; i < saves[navComputer.cursor.position].beacons.count; i++) {
						if (saves[navComputer.cursor.position].beacons.array[i].client != socket.id) {
							flag('beaconBlock');
							break;
						} else if (saves[navComputer.cursor.position].beacons.array[i].client == socket.id) {
							flag('alreadyBeacon');
							break;
						}
					}
				} else {
					for (i = 0; i < saves[navComputer.cursor.position].stations.count; i++) {
						if (saves[navComputer.cursor.position].stations.outer[i].client == socket.id) {
							flag('constructBeacon');
							break;
						}
					}
					if (state != 'constructBeaconFlag') {
						flag('stationBeforeStructure');
					}
				}
			} else if (navComputer.choose == 'mineField') {
				for (i = 0; i < saves[navComputer.cursor.position].beacons.count; i++) {
					if (saves[navComputer.cursor.position].beacons.array[i].client != socket.id) {
						flag('beaconBlock');
						break;
					}
				}
				// Station Block Code
				for (i = 0; i < saves[navComputer.cursor.position].stations.count; i++) {
					if (saves[navComputer.cursor.position].stations.outer[i].client == socket.id) {
						flag('constructMineField');
						break;
					}
				}
				if (state != 'constructMineFieldFlag' && state != 'beaconBlockFlag') {
					flag('stationBeforeStructure');
				}
			} else if (navComputer.choose == 'barge') {
				for (i = 0; i < saves[navComputer.cursor.position].beacons.count; i++) {
					if (saves[navComputer.cursor.position].beacons.array[i].client != socket.id) {
						flag('beaconBlock');
						break;
					}
				}
				for (i = 0; i < saves[navComputer.cursor.position].stations.count; i++) {
					if (saves[navComputer.cursor.position].stations.outer[i].client == socket.id) {
						flag('constructBarge');
						break;
					}
				}
				if (state != 'constructBargeFlag' && state != 'beaconBlockFlag') {
					flag('stationBeforeStructure');
				}
			}
		} else if (state == 'constructStationFlag') {
			saves[navComputer.cursor.position].stations.outer.push(new OuterStation('mobile'));
			while (saves[navComputer.cursor.position].stations.outer[saves[navComputer.cursor.position].stations.outer.length - 1].rooms.x.length < 7) {
				saves[navComputer.cursor.position].stations.outer[saves[navComputer.cursor.position].stations.outer.length - 1] = new OuterStation('mobile');
			}
			saves[navComputer.cursor.position].stations.inner.push(new InnerStation('mobile'));
			saves[navComputer.cursor.position].stations.count++;
			saves[navComputer.cursor.position].stations.system = saves[navComputer.cursor.position].system.name;
			if (system.index == navComputer.cursor.position) {
				saves[navComputer.cursor.position].stations.id = stations.id;
				saves[navComputer.cursor.position].stations.inner[stations.id] = stations.inner[stations.id];
				stations = JSON.parse(JSON.stringify(saves[navComputer.cursor.position].stations));
			}
			socket.emit('Stations', saves[navComputer.cursor.position].stations);
			drawInnerStation();
		} else if (state == 'startGameFlag') {
			navComputer.cursor.position = system.index; // Constructor uses cursor position
			stations.outer.push(new OuterStation('base'));
			while (stations.outer[stations.outer.length - 1].rooms.x.length < 50) {
				stations.outer[stations.outer.length - 1] = new OuterStation('base');
			}
			saves[system.index].stations = JSON.parse(JSON.stringify(stations));
			stations.inner.push(new InnerStation('base'));
			stations.count++;
			saves[system.index].stations = JSON.parse(JSON.stringify(stations));
			stations.system = system.name;
			socket.emit('Stations', stations);
			home.index = system.index;
			home.name = saves[system.index].system.name;
			based = true;
			cancel();
		} else if (state == 'engineeringFlag') {
			drawInnerStation();
			scrollMenu(constructionProjects, true);
		} else if (state == 'constructionProjectsMenu') {
			if (constructionProjects.text.left[constructionProjects.cursor.position] == 'Mobile Station') {
				if (canAfford('mobileStation') == true) {
					drawInnerStation();
					navComputer.choose = 'station';
					scrollMenu(navComputer, true);
				} else {
					flag('cannotAffordStructure');
				}				
			} else if (constructionProjects.text.left[constructionProjects.cursor.position] == 'Warp Gate (Mono-Directional)') {
				if (canAfford('warpGate') == true) {
					drawInnerStation();
					navComputer.choose = 'from';
					scrollMenu(navComputer, true);
				} else {
					flag('cannotAffordStructure');
				}
			} else if (constructionProjects.text.left[constructionProjects.cursor.position] == 'Beacon') {
				if (canAfford('beacon') == true) {
					drawInnerStation();
					navComputer.choose = 'beacon';
					scrollMenu(navComputer, true);
				} else {
					flag('cannotAffordStructure');
				}
			} else if (constructionProjects.text.left[constructionProjects.cursor.position] == 'Mining Barge') {
				if (canAfford('barge') == true) {
					drawInnerStation();
					navComputer.choose = 'barge';
					scrollMenu(navComputer, true);
				} else {
					flag('cannotAffordStructure');
				}
			}
		} else if (state == 'warpHomeFlag') {
			if (system.name != home.name) {
				loadSystem(home.index);
			} else {
				flag('sameSystemWarp');
			}			
		} else if (state == 'constructBeaconFlag') {
			saves[navComputer.cursor.position].beacons.array.push(new Beacon());
			saves[navComputer.cursor.position].beacons.count++;
			saves[navComputer.cursor.position].beacons.system = saves[navComputer.cursor.position].system.name;
			if (saves[navComputer.cursor.position].system.name == system.name) {
				beacons = JSON.parse(JSON.stringify(saves[navComputer.cursor.position].beacons));
			}
			territory[saves[navComputer.cursor.position].system.name] = socket.id;
			socket.emit('Beacons', saves[navComputer.cursor.position].beacons);
			drawInnerStation();
		} else if (state == 'militaryFlag') {
			drawInnerStation();
			scrollMenu(militaryConstruction, true);
		} else if (state == 'militaryConstructionMenu') {
			if (militaryConstruction.text.left[militaryConstruction.cursor.position] == 'Mine Field') {
				if (canAfford('mineField') == true) {
					drawInnerStation();
					navComputer.choose = 'mineField';
					scrollMenu(navComputer, true);
				} else {
					flag('cannotAffordMilitary');
				}
			}
		} else if (state == 'constructMineFieldFlag') {
			saves[navComputer.cursor.position].military.mineFields.count++;
			saves[navComputer.cursor.position].military.mineFields.id = saves[navComputer.cursor.position].military.mineFields.array.length;
			saves[navComputer.cursor.position].military.mineFields.array.push(new MineField());
			for (i = 0; i < saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id].count; i++) {
				saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id].mines.push(new Mine());
			}
			if (saves[navComputer.cursor.position].system.name == system.name) {
				military = JSON.parse(JSON.stringify(saves[navComputer.cursor.position].military));
			}
			socket.emit('Military', { object: saves[navComputer.cursor.position].military, system: saves[navComputer.cursor.position].system.name, event: 'mineFieldConstruction' });
			drawInnerStation();
		} else if (state == 'constructBargeFlag') {
			saves[navComputer.cursor.position].barges.count++;
			saves[navComputer.cursor.position].barges.id = saves[navComputer.cursor.position].barges.array.length;
			saves[navComputer.cursor.position].barges.array.push(new Barge());
			if (navComputer.cursor.position = system.index) {
				barges = JSON.parse(JSON.stringify(saves[navComputer.cursor.position].barges));
			}
			socket.emit('Barges', { object: saves[navComputer.cursor.position].barges, index: navComputer.cursor.position });
			drawInnerStation();
		} else if (state == 'bargeFlag') {
			drawAsteroidBelt(false);
			scrollMenu(bargeMenu, true);
		} else if (state == 'bargeMenu') {
			flag('bargeWithdrawl');
		}	else if (state == 'bargeWithdrawlFlag') {
			inventory.ores[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)].value++;
			barges.array[barges.id].inventory[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)]--;
			saves[system.index].barges.array[barges.id].inventory[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)]--;
			drawAsteroidBelt(false);
			scrollMenu(bargeMenu);
		}	else if (state == 'bargeRecalibrateFlag') {
			if (canAfford('bargeRecalibrate') == true) {
				// Recalibrate
				barges.array[barges.id].prob.therodite = random(0, .8); // Same probabilities as average asteroids -- Can recalibrate (for a price)
				barges.array[barges.id].prob.oxytrite = .8;
				barges.array[barges.id].prob.ikredein = random(0, .2) + barges.array[barges.id].prob.oxytrite;
				barges.array[barges.id].prob.embryan = random(0, .2 - (barges.array[barges.id].prob.ikredein - barges.array[barges.id].prob.oxytrite)) + barges.array[barges.id].prob.ikredein;
				barges.array[barges.id].prob.odium = random(0, .2 - (barges.array[barges.id].prob.embryan - barges.array[barges.id].prob.ikredein) - (barges.array[barges.id].prob.ikredein - barges.array[barges.id].prob.oxytrite)) + barges.array[barges.id].prob.embryan;
				barges.array[barges.id].prob.sybril = 1;
				saves[system.index].barges.array[barges.id].prob.therodite = barges.array[barges.id].prob.therodite;
				saves[system.index].barges.array[barges.id].prob.oxytrite = barges.array[barges.id].prob.oxytrite;
				saves[system.index].barges.array[barges.id].prob.ikredein = barges.array[barges.id].prob.ikredein;
				saves[system.index].barges.array[barges.id].prob.embryan = barges.array[barges.id].prob.embryan;
				saves[system.index].barges.array[barges.id].prob.odium = barges.array[barges.id].prob.odium;
				saves[system.index].barges.array[barges.id].prob.sybril = barges.array[barges.id].prob.sybril;
				// Cost
				for (i in cost.other.bargeRecalibrate) {
					inventory.refined[i].value -= cost.other.bargeRecalibrate[i];
				}
				drawAsteroidBelt(false);
				flag('barge');
			} else {
				flag('cannotAffordRecalibration')
			}
		} else if (state == 'labFlag') {
			drawInnerStation();
			scrollMenu(labMenu, true);
		} else if (state == 'labMenu') {
			if (labMenu.text.left[labMenu.cursor.position] == 'Mining') {
				drawInnerStation();
				scrollMenu(labMining, true);
			} else if (labMenu.text.left[labMenu.cursor.position] == 'Refining') {
				drawInnerStation();
				scrollMenu(labRefining, true);
			}
		} else if (state == 'labMining') {

		} else if (state == 'labRefining') {

		}
	} else if (keyCode == 82) { // R
		if (state == 'asteroidMiningFlag') {
			belt.asteroids.array[belt.asteroids.index].scanned = true;
			belt.setInterval();
		} else if (state == 'mining') {
			belt.asteroids.array[belt.asteroids.index].scanned = true;
		} else if (state == 'cautionRefineFlag') {
			refine('all');
			drawInnerStation();
			openInventory('refinery');
		} else if (state == 'cargoHoldFlag') {
			drawInnerStation();
			openInventory('withdraw', true);
		} else if (state == 'cautionDepositFlag') {
			deposit('all');
			drawInnerStation();
			openInventory('deposit');
		} else if (state == 'cautionWithdrawFlag') {
			withdraw('all');
			drawInnerStation();
			openInventory('withdraw');
		} else if (state == 'militaryFlag') {
			drawInnerStation();
			scrollMenu(militaryManagement, true);
		} else if (state == 'bargeFlag') {
			flag('bargeRecalibrate');
		} else if (state == 'bargeWithdrawlFlag') {
			inventory.ores[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)].value += barges.array[barges.id].inventory[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)];
			barges.array[barges.id].inventory[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)] = 0;
			saves[system.index].barges.array[barges.id].inventory[bargeMenu.text.left()[bargeMenu.cursor.position][0].toLowerCase() + bargeMenu.text.left()[bargeMenu.cursor.position].slice(1, -4)] = 0;
			drawAsteroidBelt(false);
			scrollMenu(bargeMenu);
		}
	} else if (keyCode == 81) { // Q
		if (state == 'galaxy') {
			galaxy.clearInterval();
			toPreviousState();
		}	else if (state == 'warpFlag') {
			undock('warpGate');
		}	else if (state == 'enterStationFlag') {
			undock('station');
		} else if (state == 'enterPlanetFlag') {
			undock('planet');
		} else if (state == 'gasGiantFlag') {
			undock('planet');
		} else if (state == 'starFlag') {
			undock('star');
		} else if (state == 'edgeFullscreenFlag') {
			setup();
		} else if (state == 'enterAsteroidBeltFlag') {
			undock('asteroidBelt');
		} else if (state == 'saveSystemFlag') {
			drawInnerStation();
		}	else if (state == 'saveSystemFlag') {
			drawInnerStation();
		} else if (state == 'loadSystemFlag') {
			drawInnerStation();
		}	else if (state == 'overwriteSaveFlag') {
			drawInnerStation();
			flag('saveSystem');
		} else if (state == 'exitStationFlag') {
			drawInnerStation();
		} else if (state == 'asteroidMiningFlag') {
			undock('asteroid');
		} else if (state == 'mining') {
			mine.clearInterval();
			belt.setInterval();
			shipSpeedCap = 3.25;
			shipAcceleration = .2;
		}	else if (state == 'exitSystemFlag') {
			undock('beltMargin');
		} else if (state == 'enterSystemFlag') {
			undock('beltMargin');
		} else if (state == 'refineryFlag') {
			drawInnerStation();
		}	else if (state == 'navComputerMenu') {
			if (navComputer.choose == 'station' || navComputer.choose == 'from' || navComputer.choose == 'to' || navComputer.choose == 'beacon' || navComputer.choose == 'barge') { // Construction Projects
				drawInnerStation();
				scrollMenu(constructionProjects);
			} else if (navComputer.choose == 'mineField') { // Military Construction
				drawInnerStation();
				scrollMenu(militaryConstruction);
			}
		}	else if (state == 'constructionProjectsMenu') {
			drawInnerStation();
		}	else if (state == 'bargeMenu') {
			drawAsteroidBelt(false);
			flag('barge');
		}	else if (state.indexOf('ventory') != -1 || state.indexOf('Menu') != -1) {
			toPreviousState();
		} else if (state == 'cautionRefineFlag') {
			drawInnerStation();
			openInventory('refinery');
		} else if (state == 'cannotRefineMetalFlag') {
			drawInnerStation();
			openInventory('refinery');
		} else if (state == 'cargoHoldFlag') {
			drawInnerStation();
		} else if (state == 'cautionDepositFlag') {
			drawInnerStation();
			openInventory('deposit');
		} else if (state == 'cautionWithdrawFlag') {
			drawInnerStation();
			openInventory('withdraw');
		} else if (state == 'sameSystemWarpGateFlag') {
			toPreviousState();
			scrollMenu(navComputer);
		}	else if (state == 'constructWarpGateFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		}	else if (state == 'constructStationFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'engineeringFlag') {
			drawInnerStation();
		} else if (state == 'warpHomeFlag') {
			cancel();
		} else if (state == 'sameSystemWarpFlag') {
			cancel();
		} else if (state == 'cannotAffordStructureFlag') {
			drawInnerStation();
			scrollMenu(constructionProjects);
		} else if (state == 'constructBeaconFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'stationBeforeStructureFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'alreadyBeaconFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'beaconBlockFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'gameFullFlag') {
			state = 'intro';
			setup(false);
		} else if (state == 'militaryFlag') {
			drawInnerStation();
		} else if (state == 'militaryManagementMenu') {
			drawInnerStation();
		} else if (state == 'enterEnemyBaseFlag') {
			undock('station');
		} else if (state == 'constructMineFieldFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'cannotAffordMilitaryFlag') {
			drawInnerStation();
			scrollMenu(militaryConstruction);
		} else if (state == 'constructBargeFlag') {
			drawInnerStation();
			scrollMenu(navComputer);
		} else if (state == 'bargeFlag') {
			undock('ten');
		} else if (state == 'bargeRecalibrateFlag') {
			drawAsteroidBelt(false);
			flag('barge');
		} else if (state == 'cannotAffordRecalibrationFlag') {
			drawAsteroidBelt(false);
			flag('bargeRecalibrate');
		} else if (state == 'bargeWithdrawlFlag') {
			drawAsteroidBelt(false);
			scrollMenu(bargeMenu);
		} else if (state == 'labFlag') {
			drawInnerStation();
		} else if (state == 'labMenu') {
			drawInnerStation();
			flag('lab');
		} else if (state == 'labMining') {
			drawInnerStation();
			scrollMenu(labMenu);
		} else if (state == 'labRefining') {
			drawInnerStation();
			scrollMenu(labMenu);
		}
	} else if (keyCode == 122) { // F11
		if (state == 'intro') {
			if (browser == 'edge') {
				flag('edgeFullscreen');
			}
		}
	} else if (keyCode == 73) { // I
		if (state == 'solarSystem' || state == 'belt' || state == 'mining' || state == 'innerStation' || state == 'planet') {
			openInventory('inventory', true);
		}	else if (state == 'inventory' || state == 'refineInventory' || state == 'depositInventory' || state == 'withdrawInventory') {
			toPreviousState();
		}
	} else if (keyCode == 80) { // P
		if (state == 'solarSystem' || state == 'belt' || state == 'mining' || state == 'innerStation' || state == 'planet') {
			scrollMenu(pause, true);
		} else if (state.indexOf('Menu') != -1) {
			toPreviousState();
		} else if (state == 'inventory' && inventory.canCloseP == true) {
			toPreviousState();
			inventory.canCloseP = false;
		}
	} else if (keyCode == 90) { // Z
		if (state == 'solarSystem') {
			flag('warpHome');
		}
	} else if (keyCode == 71) { // G
		if (state == 'solarSystem' || state == 'belt' || state == 'mining' || state == 'innerStation' || state == 'planet') {
			previousState = state;
			galaxy.setInterval();
		} else if (state == 'galaxy') {
			galaxy.clearInterval();
			toPreviousState();
		}
	}
}

function windowResized() {
	if (state == 'intro' || state == 'loading') {
		setup(false);
	}
}
