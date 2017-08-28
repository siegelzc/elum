var devMode =  false;
var quality = 'low'; // 'high' or 'low'

var G = .0000000000667408;
var cos45 = 0.707106781;

var spaceBackground = 10;
var starFrequency = .8;
var minimumSystemDiameter = 1600;
var maximumSystemDiameter = 3400;
var minimumStarDiameter = 60;
var maximumStarDiameter = 280;
var starMassCoefficient	= 1000;
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
var minimumAsteroidVerticesFull = 10;
var maximumAsteroidVerticesFull = 15;
var minimumAsteroidSpeed = .01;
var maximumAsteroidSpeed = .1;
var minimumAsteroidMass = 1;
var maximumAsteroidMass = 1000000;
var asteroidColors = ['#808080', '#696969', '#a3a3a3', '#727272', '#4a4a4a', '#5c5c5c', '#454545'];

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
	starMassCoefficient = 10000;
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
var centerX;
var centerY;
function setup() {
	canvasWidth = windowWidth;
	canvasHeight = windowHeight;
	cnv = createCanvas(canvasWidth, canvasHeight);
	canvasArea = width * height;
	centerX = width / 2;
	centerY = height / 2;
	generate();
}

function generate() {
	state = 'solarSystem';
	drawSolarSystems(true);
}

function regenerate(from) {
	state = 'solarSystem';
	if (from == 'save') {
		drawSolarSystems(false, 'save');
	} else {
		drawSolarSystems(false);
	}
}

function cancel() {
	clearInterval(systemInterval);
	systemInterval = setInterval(function () { animateSystem(); }, 25);
	regenerate('cancel');
}

var stars = {
	y: [], 
	color: []
};
function drawStars(newSystem) {
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

var orbitVelocity;
var system = {
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
	speed: 0
};
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
var station = {
	x: undefined, 
	y: undefined, 
	orbitRadius: undefined, 
	radian: undefined, 
	orbitSpeed: undefined, 
	units: [], 
	count: undefined, 
	build: {
		x: undefined, 
		y: undefined
	}
};
var warpGate = {
	initial: {
		x: undefined, 
		y: undefined
	},
	x: undefined, 
	y: undefined, 
	diameterX: undefined, 
	diameterY: undefined, 
	maxDiameterX: undefined, 
	maxDiameterY: undefined, 
	minDiameterX: undefined, 
	minDiameterY: undefined, 
	pulseSpeedX: undefined, 
	pulseSpeedY: undefined, 
	orbitRadius: undefined, 
	radian: undefined, 
	orbitSpeed: undefined
};
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
var innerStationLoaded;
var arrivalMessage = {};
var fadeInterval;
function drawSolarSystems(newSystem, from) {
	clear();
	background(spaceBackground);

	// Stars
	if (from == 'save') {
		stars = JSON.parse(JSON.stringify(currentSave.stars));
	}
	drawStars(newSystem);

	// System
	noFill();
	stroke(255);
	if (newSystem == true) {
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
		planets.loaded = [];
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
			orbitVelocity = sqrt((G * star.mass) / orbits.radii[i]);
			if (random() < .5) {
				orbitVelocity *= -1;
			}
			orbits.velocities.push(orbitVelocity);
		}
		noFill();
		stroke(90);
		ellipse(system.x, system.y, orbits.diameters[i]);

		// Planets
		var planetDiameter = map(random(), 0, 1, minimumPlanetRadius, maximumPlanetRadius || star.diameter);
		if (from == 'save') {
			planets.radian[i] = map(random(), 0, 1, 0, TWO_PI);
		}
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
		for (i = 0; i < orbits.count; i++) {
			planets.loaded.push(false);
		}
	}

	// Goldilocks Zone
	if (devMode == true) {
		noFill();
		stroke(255);
		ellipse(system.x, system.y, minimumGoldilocks + star.diameter);
		ellipse(system.x, system.y, maximumGoldilocks + star.diameter);
	}

	// Warp Gate
	if (newSystem == true) {
		warpGate.maxDiameterX = map(random(), 0, 1, minimumWarpGateRaidus, maximumWarpGateRadius); // Positon Gate
		warpGate.maxDiameterY = map(random(), 0, 1, minimumWarpGateRaidus, maximumWarpGateRadius);
		warpGate.minDiameterX = warpGate.maxDiameterX / 100;
		warpGate.minDiameterY = warpGate.maxDiameterY / 100;
		warpGate.pulseSpeedX = warpGate.maxDiameterX / 100;
		warpGate.pulseSpeedY = warpGate.maxDiameterY / 100;
		warpGate.diameterX = warpGate.minDiameterX;
		warpGate.diameterY = warpGate.minDiameterY;
		warpGate.orbitRadius = random(star.diameter, system.radius);
		warpGate.radian = random(0, TWO_PI);
		warpGate.orbitSpeed = sqrt((G * star.mass) / warpGate.orbitRadius) / 3;
		warpGate.initial.x = system.x + warpGate.orbitRadius * cos(warpGate.radian);
		warpGate.initial.y = system.y + warpGate.orbitRadius * sin(warpGate.radian);
		warpGate.x = warpGate.initial.x;
		warpGate.y = warpGate.initial.y;
		if (random() < .5) {
			warpGate.orbitSpeed *= -1;
		}
	}
	warpGate.x = system.x + warpGate.orbitRadius * cos(warpGate.radian);
	warpGate.y = system.y + warpGate.orbitRadius * sin(warpGate.radian);
	noFill();
	stroke(255);
	ellipse(warpGate.x, warpGate.y, warpGate.diameterX, warpGate.diameterY);

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

	// Station
	fill(160);
	noStroke();
	if (newSystem == true) {
		station.units = [];
		innerStationLoaded = false;
		station.orbitRadius = random(star.diameter, system.radius);
		station.radian = random(0, TWO_PI);
		station.orbitSpeed = sqrt((G * star.mass) / warpGate.orbitRadius) / 3;
		if (random() < .5) {
			station.orbitSpeed *= -1;
		}
		station.count = ceil(map(random(), 0, 1, minimumStationUnitCount, maximumStationUnitCount));
		for (i = 0; i < station.count; i++){
			var buildSide = map(random(), 0, 1, 0, 4);
			placeStationUnit();
		}
	}
	if (from == 'save') {
		station.radian = random(0, TWO_PI);
	}
	station.x = system.x + station.orbitRadius * cos(station.radian);
	station.y = system.y + station.orbitRadius * sin(station.radian);
	buildStationUnit();

	function placeStationUnit() {
		if (0 <= buildSide && buildSide < 1) { // Build up
			station.units.push('u');
		} else if(1 <= buildSide && buildSide < 2) { // Build right
			station.units.push('r');
		} else if(2 <= buildSide && buildSide < 3) { // Build down
			station.units.push('d');
		} else if(3 <= buildSide && buildSide < 4) { // Build left
			station.units.push('l');
		} else {
			console.error('Error: placeStationUnit()');
		}
	}

	function buildStationUnit() {
		fill(180);
		noStroke();
		station.build.x = station.x;
		station.build.y = station.y;
		rect(station.build.x, station.build.y, stationUnitLength, stationUnitLength); // Center unit
		for (i = 0; i < station.count; i++) {
			if (station.units[i] == 'u') {
				station.build.y -= stationUnitLength;
				rect(station.build.x, station.build.y, stationUnitLength, stationUnitLength);
			} else if (station.units[i] == 'r') {
				station.build.x += stationUnitLength;
				rect(station.build.x, station.build.y, stationUnitLength, stationUnitLength);
			} else if (station.units[i] == 'd') {
				station.build.y += stationUnitLength;
				rect(station.build.x, station.build.y, stationUnitLength, stationUnitLength);
			} else if (station.units[i] == 'l') {
				station.build.x -= stationUnitLength;
				rect(station.build.x, station.build.y, stationUnitLength, stationUnitLength);
			} else {
				console.error('Error: buildStationUnit()');
			}
		}
	}
}

function animateSystem() {
	// Planet Revolution
	for (i = 0; i < orbits.count; i++) {
		planets.radian[i] += orbits.velocities[i];
	}

	// Warp Gate Revolution
	warpGate.radian += warpGate.orbitSpeed;

	// Station Revolution
	station.radian += station.orbitSpeed;

	// Warp Gate Pulsation
	warpGate.diameterX += warpGate.pulseSpeedX;
	warpGate.diameterY += warpGate.pulseSpeedY;
	if (warpGate.diameterX >= warpGate.maxDiameterX) {
		warpGate.diameterX = warpGate.minDiameterX;
		warpGate.diameterY = warpGate.minDiameterY;
	} else if (warpGate.diameterY >= warpGate.maxDiameterY) {
		warpGate.diameterX = warpGate.minDiameterX;
		warpGate.diameterY = warpGate.minDiameterY;
	}

	// Asteroid Belt Revolution
	for (i = 0; i < asteroidBelt.asteroids.count; i++) {
		asteroidBelt.asteroids.array[i].radian += asteroidBelt.asteroids.array[i].orbitSpeed;
	}

	if (state == 'solarSystem') {
		regenerate();
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
}

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
			systemInterval = setInterval(function () { animateSystem(); }, 25);
			regenerate('save');
		} else {
			generate();
		}
	}
}

function mousePressed() {
	if (state == 'solarSystem') {
		initializeWarp();
	}
}

function keyPressed() {
	if (keyCode == 37) { // LEFT_ARROW
		if (state == 'innerStation') {
			stationMove('l');
		}
	} else if (keyCode == 38) { // UP_ARROW
		if (state == 'innerStation') {
			stationMove('u');
		}
	} else if (keyCode == 39) { // RIGHT_ARROW
		if (state == 'innerStation') {
			stationMove('r');
		}
	} else if (keyCode == 40) { // DOWN_ARROW
		if (state == 'innerStation') {
			stationMove('d');
		}
	} else if (keyCode == 65) { // A
		if (state == 'innerStation') {
			stationMove('l');
		} else if (state == 'navComputerFlag' && saves.length >= 1) {
			loadIndex = 0;
			loadSystem(loadIndex);
		}
	} else if (keyCode == 87) { // W
		if (state == 'innerStation') {
			stationMove('u');
		}
	} else if (keyCode == 68) { // D
		if (state == 'innerStation') {
			stationMove('r');
		} else if (state == 'navComputerFlag' && saves.length >= 4) {
			loadIndex = 3;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 83) { // S
		if (state == 'innerStation') {
			stationMove('d');
		}
	}
	else if (keyCode == 69) { // E
		if (state == 'exitStationFlag') {
			undock('station');
		} else if (state == 'enterStationFlag') {
			if (innerStationLoaded == false) {
				drawInnerStation(true, false);
				setTimeout(function() { drawInnerStation(false, false); }, 5);
			} else if (innerStationLoaded == true) {
				drawInnerStation(false, true);
				setTimeout(function() { drawInnerStation(false, false); }, 5);
			}
		} else if (state == 'warpFlag') {
			loadIndex = -1;
			cancel();
			flag('warpCaution');
		} else if (state == 'warpCautionFlag') {
			if (loadIndex == -1) {
				initializeWarp();
			} else {
				loadSystem(loadIndex);
			}
		}	else if (state == 'enterPlanetFlag') {
			for (e = 0; e < planets.x.length; e++) { // All for loops here use variable 'e'
				if (planets.loaded[planets.id] == true) {
					drawSurface(planets.type[planets.id], false, true);
				} else if (planets.loaded[planets.id] == false) {
					drawSurface(planets.type[planets.id], true, false);
					planets.loaded[planets.id] = true;
				}
				break;
			}
		} else if (state == 'exitPlanetFlag') {
			clearInterval(planetPlayerInterval);
			undock('planet');
		} else if (state == 'enterAsteroidBeltFlag') {
			drawAsteroidBelt(true);
		} else if (state == 'terminalFlag') {
			drawInnerStation(false, false);
			flag('saveSystem');
		}	else if (state == 'saveSystemFlag') {
			saveSystem();
			if (state == 'saveSystemFlag') {
				drawInnerStation(false, false);
			}
		} else if (state == 'overwriteSaveFlag') {
			saveSystem(true);
		} else if (state == 'navComputerFlag' && saves.length >= 5) {
			loadIndex = 4;
			cancel();
			flag('warpCaution');
		} else if (state == 'innerStation') {
			if (innerStation.player.room == innerStation.rooms.hanger.string) {
				flag('exitStation');
			} else if (innerStation.player.room == innerStation.rooms.terminal.string) {
				flag('terminal');
			}
		}
	} else if (keyCode == 82) { // R
		if (state == 'warpFlag') {
			cancel();
			flag('navComputer');
		}
	} else if (keyCode == 81) { // Q
		if (state == 'warpFlag') {
			undock('warpGate');
		} else if (state == 'warpCautionFlag') {
			cancel();
			flag('warp');
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
			drawInnerStation(false, false);
		}	else if (state == 'saveSystemFlag') {
			drawInnerStation(false, false);
		} else if (state == 'loadSystemFlag') {
			drawInnerStation(false, false);
		} else if (state == 'overwriteSaveFlag') {
			drawInnerStation(false, false);
			flag('saveSystem');
		} else if (state == 'navComputerFlag') {
			cancel();
			flag('warp');
		} else if (state == 'currentSystemLoadFlag') {
			cancel();
			flag('navComputer');
		} else if (state == 'exitStationFlag') {
			drawInnerStation();
		} else if (state == 'terminalFlag') {
			drawInnerStation();
		} else if (state == 'asteroidMiningFlag') {
			undock('asteroid');
		}
	} else if (keyCode == 122) { // F11
		if (state == 'intro') {
			if (browser == 'edge') {
				flag('edgeFullscreen');
			}
		}
	} else if (keyCode == 66) { // B
		if (state == 'navComputerFlag' && saves.length >= 2) {
			loadIndex = 1;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 67) { // C
		if (state == 'navComputerFlag' && saves.length >= 3) {
			loadIndex = 2;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 70) { // F
		if (state == 'navComputerFlag' && saves.length >= 6) {
			loadIndex = 5;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 71) { // G
		if (state == 'navComputerFlag' && saves.length >= 7) {
			loadIndex = 6;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 72) { // H
		if (state == 'navComputerFlag' && saves.length >= 8) {
			loadIndex = 7;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 73) { // I
		if (state == 'navComputerFlag' && saves.length >= 9) {
			loadIndex = 8;
			cancel();
			flag('warpCaution');
		}
	} else if (keyCode == 74) { // J
		if (state == 'navComputerFlag' && saves.length >= 10) {
			loadIndex = 9;
			cancel();
			flag('warpCaution');
		}
	}
}

function windowResized() {
	if (state == 'intro') {
		canvasWidth = windowWidth;
		canvasHeight = windowHeight;
		cnv = createCanvas(canvasWidth, canvasHeight);
		setup();
	}
}