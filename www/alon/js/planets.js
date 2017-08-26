var xoff = 0;
var yoff = 0;

var pixelLength = 20; // (Zoom Multiplier)
var index;
var panAmount = 10;
var planet = {
	width: undefined, 
	height: undefined, 
	biome: undefined, 
	ship: {
		x: undefined,
		y: undefined,
		width: undefined,
		height: undefined
	}
};
var planetPlayerInterval;
var planetPlayer = {
	planet: undefined, 
	item: 'player', 
	drawItem: undefined, 
	x: undefined, 
	y: undefined, 
	globalX: undefined, 
	globalY: undefined, 
	index: undefined, 
	current: undefined, 
	direction: undefined, 
	speed: undefined, 
	setInterval: function() {
		clearInterval(planetPlayerInterval);
		planetPlayerInterval = setInterval(function() { planetPlayer.move(); }, 25);
	}, 
	clearInterval: function() {
		clearInterval(planetPlayerInterval);
	}, 
	draw: function() {
		fill(50);
		noStroke();
		drawItem(planetPlayer.drawItem, planetPlayer.x, planetPlayer.y); 
	}, 
	move: function() {
		if ((keyIsDown(38) || keyIsDown(87)) && (keyIsDown(37) || keyIsDown(65))) {
			planetPlayer.x -= planetPlayer.speed * cos45;
			planetPlayer.y -= planetPlayer.speed * cos45;
			planetPlayer.direction = 'ul';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else if ((keyIsDown(38) || keyIsDown(87)) && (keyIsDown(39) || keyIsDown(68))) {
			planetPlayer.x += planetPlayer.speed * cos45;
			planetPlayer.y -= planetPlayer.speed * cos45;
			planetPlayer.direction = 'ur';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else if ((keyIsDown(40) || keyIsDown(83)) && (keyIsDown(39) || keyIsDown(68))) {
			planetPlayer.x += planetPlayer.speed * cos45;
			planetPlayer.y += planetPlayer.speed * cos45;
			planetPlayer.direction = 'dr';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else if ((keyIsDown(40) || keyIsDown(83)) && (keyIsDown(37) || keyIsDown(65))) {
			planetPlayer.x -= planetPlayer.speed * cos45;
			planetPlayer.y += planetPlayer.speed * cos45;
			planetPlayer.direction = 'dl';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else	if (keyIsDown(37) || keyIsDown(65)) {
			planetPlayer.x -= planetPlayer.speed;
			planetPlayer.direction = 'l';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else if (keyIsDown(38) || keyIsDown(87)) {
			planetPlayer.y -= planetPlayer.speed;
			planetPlayer.direction = 'u';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else if (keyIsDown(39) || keyIsDown(68)) {
			planetPlayer.x += planetPlayer.speed;
			planetPlayer.direction = 'r';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else if (keyIsDown(40) || keyIsDown(83)) {
			planetPlayer.y += planetPlayer.speed;
			planetPlayer.direction = 'd';
			if (planetPlayer.item == 'player') {
				if (planetPlayer.drawItem == player) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else if (planetPlayer.drawItem == playerAnimationLeft) {
					planetPlayer.drawItem = playerAnimationRight;
				} else if (planetPlayer.drawItem == playerAnimationRight) {
					planetPlayer.drawItem = playerAnimationLeft;
				} else {
					planetPlayer.drawItem = player;
				}
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		} else {
			if (planetPlayer.item == 'player') {
				planetPlayer.drawItem = player;
			} else if (planetPlayer.item == 'boat') {
				planetPlayer.drawItem = boat;
			}
			drawSurface(planetPlayer.planet, false, false);
		}
	}, 
	check: function() {
		planetPlayer.globalX = floor(planetPlayer.x / pixelLength + display.x);
		planetPlayer.globalY = floor(planetPlayer.y / pixelLength + display.y);
		planetPlayer.index = planetPlayer.globalX + planetPlayer.globalY * planet.width;
		planetPlayer.current = planets.arrays[planets.id][planetPlayer.index];
		if (planetPlayer.planet == 'magma') {
			if (planetPlayer.current == '#700500') {				// Magma
				planetPlayer.tile = 'magma';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 8;
			} else if (planetPlayer.current == '#dd6616') { // Lava
				planetPlayer.tile = 'lava';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 8;
			} else if (planetPlayer.current == '#441e1e') { // Igneous
				planetPlayer.tile = 'igneous';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#545454') { // Rock
				planetPlayer.tile = 'rock';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			}
		} else if (planetPlayer.planet == 'mars') {
			if (planetPlayer.current == '#af9679') {				// Plain
				planetPlayer.tile = 'plain';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#af7556') {	// Dirt
				planetPlayer.tile = 'dirt';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#875b43') {	// Hill
				planetPlayer.tile = 'hill';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#684634') { // Mountain
				planetPlayer.tile = 'mountain';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 8;
			}
		} else if (planetPlayer.planet == 'dirt') {
			if (planetPlayer.current == '#846d52') {				// Dirt
				planetPlayer.tile = 'dirt';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#e0b272') {	// Plain
				planetPlayer.tile = 'plain';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#b77842') {	// Hill
				planetPlayer.tile = 'hill';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#c4b98d') {	// Mountain
				planetPlayer.tile = 'mountain';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 8;
			}
		} else if (planetPlayer.planet == 'grass') {
			if (planetPlayer.current == '#356ecc') { 				// Ocean
				planetPlayer.tile = 'ocean';
				planetPlayer.item = 'boat';
				planetPlayer.speed = pixelLength / 3;
			} else if (planetPlayer.current == '#3ebcf2') {	// Lake
				planetPlayer.tile = 'lake';
				planetPlayer.item = 'boat';
				planetPlayer.speed = pixelLength / 4;
			} else if (planetPlayer.current == '#ffe2a0') {	// Sand
				planetPlayer.tile = 'sand';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#b5e07d') {	// Steppe
				planetPlayer.tile = 'steppe';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#7bd651') {	// Grass
				planetPlayer.tile = 'grass';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#23842e') {	// Forest
				planetPlayer.tile = 'forest';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 8;
			} else if (planetPlayer.current == '#97a2a3') {	// Rock
				planetPlayer.tile = 'rock';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#eaefef') {	// Snow
				planetPlayer.tile = 'snow';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			}
		} else if (planetPlayer.planet == 'water') {
			if (planetPlayer.current == '#214289') {				// Ocean
				planetPlayer.tile = 'ocean';
				planetPlayer.item = 'boat';
				planetPlayer.speed = pixelLength / 3;
			} else if (planetPlayer.current == '#286cbf') {	// Sea
				planetPlayer.tile = 'sea';
				planetPlayer.item = 'boat';
				planetPlayer.speed = pixelLength / 3.5;
			} else if (planetPlayer.current == '#1f90ba') {	// Lake
				planetPlayer.tile = 'lake';
				planetPlayer.item = 'boat';
				planetPlayer.speed = pixelLength / 4;
			}
		} else if (planetPlayer.planet == 'rock') {
			if (planetPlayer.current == '#707070') {				// Rock
				planetPlayer.tile = 'rock';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#999999') {	// Hill
				planetPlayer.tile = 'hill';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#c9c9c9') {	// Snow
				planetPlayer.tile = 'snow';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#bdfcf8') {	// Ice
				planetPlayer.tile = 'ice';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 5;
			}
		} else if (planetPlayer.planet == 'snow') {
			if (planetPlayer.current == '#dbfffd') {				// Ice
				planetPlayer.tile = 'ice';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 5;
			} else if (planetPlayer.current == '#f4f4f4') {	// Permafrost
				planetPlayer.tile = 'permafrost';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#bed9dd') {	// Snow
				planetPlayer.tile = 'snow';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			}
		} else if (planetPlayer.planet == 'ice') {
			if (planetPlayer.current == '#bdfcf8') {				// Ice
				planetPlayer.tile = 'ice';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 5;
			} else if (planetPlayer.current == '#bed9dd') {	// Snow
				planetPlayer.tile = 'snow';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			} else if (planetPlayer.current == '#f4f4f4') {	// Permafrost
				planetPlayer.tile = 'permafrost';
				planetPlayer.item = 'player';
				planetPlayer.speed = pixelLength / 6;
			}
		}
	}
}
var display = {
	width: undefined,
	height: undefined,
	x: undefined,
	y: undefined
};

function drawSurface(planetType, newPlanet, regeneratePlanet) {
	state = 'planet';
	if (newPlanet == true) {
		planets.loadcount++;
		xoff += 1000;
		yoff += 1000;
		planetPlayer.drawItem = player;
		planetPlayer.setInterval();
		planet.width = 1000;
		planet.height = 1000;
		display.x = planet.width / 2;
		display.y = planet.height / 2;
		display.width = floor(width / pixelLength);
		display.height = floor(height / pixelLength);
		planetPlayer.x = pixelLength * display.width / 2 - pixelLength / 4;
		planetPlayer.y = pixelLength * display.height / 2 - 5;
		planet.ship.width = ship.width * 3;
		planet.ship.height = ship.height * 3;
	} else if (regeneratePlanet == true) {
		planetPlayer.drawItem = player;
		planetPlayer.setInterval();
		planet.width = 1000;
		planet.height = 1000;
		display.x = planet.width / 2;
		display.y = planet.height / 2;
		display.width = floor(width / pixelLength);
		display.height = floor(height / pixelLength);
		planetPlayer.x = pixelLength * display.width / 2 - pixelLength / 4;
		planetPlayer.y = pixelLength * display.height / 2 - 5;
		planet.ship.width = ship.width * 3;
		planet.ship.height = ship.height * 3;
	}
	
	if (planetType == 'magma') {
		if (newPlanet == true) {
			magma(true);
		} else if (newPlanet == false) {
			magma(false);
		}
	} else if (planetType == 'mars') {
		if (newPlanet == true) {
			mars(true);
		} else if (newPlanet == false) {
			mars(false);
		}
	} else if (planetType == 'dirt') {
		if (newPlanet == true) {
			dirt(true);
		} else if (newPlanet == false) {
			dirt(false);
		}
	} else if (planetType == 'grass') {
		if (newPlanet == true) {
			grass(true);
		} else if (newPlanet == false) {
			grass(false);
		}
	} else if (planetType == 'water') {
		if (newPlanet == true) {
			water(true);
		} else if (newPlanet == false) {
			water(false);
		}
	} else if (planetType == 'rock') {
		if (newPlanet == true) {
			rock(true);
		} else if (newPlanet == false) {
			rock(false);
		}
	} else if (planetType == 'snow') {
		if (newPlanet == true) {
			snow(true);
		} else if (newPlanet == false) {
			snow(false);
		}
	} else if (planetType == 'ice') {
		if (newPlanet == true) {
			ice(true);
		} else if (newPlanet == false) {
			ice(false);
		}
	}

	function magma(newMagma) {
		var magma = {color: '#700500'};
		var lava = {color: '#dd6616'};
		var igneous = {color: '#441e1e'};
		var rock = {color: '#545454'};

		// Generate World
		if (newMagma == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .4) {
						planet.biome = magma;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .4 && biomeNoise < .55) {
						planet.biome = lava;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .55 && biomeNoise < .75) {
						planet.biome = igneous;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .75 && biomeNoise < 1) {
						planet.biome = rock;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 0;
			}
		}

		planetPlayer.planet = 'magma';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	function mars(newMars) {
		var plain = {color: '#af9679'};
		var dirt = {color: '#af7556'};
		var hill = {color: '#875b43'};
		var mountain = {color: '#684634'};

		// Generate World
		if (newMars == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .4) {
						planet.biome = plain;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .4 && biomeNoise < .6) {
						planet.biome = dirt;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .6 && biomeNoise < .8) {
						planet.biome = hill;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .8 && biomeNoise < 1) {
						planet.biome = mountain;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 1000;
			}
		}

		planetPlayer.planet = 'mars';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	function dirt(newDirt) {
		var dirt = {color: '#846d52'};
		var plain = {color: '#e0b272'};
		var hill = {color: '#b77842'};
		var mountain = {color: '#c4b98d'};

		// Generate World
		if (newDirt == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .45) {
						planet.biome = dirt;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .45 && biomeNoise < .55) {
						planet.biome = plain;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .55 && biomeNoise < .75) {
						planet.biome = hill;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .75 && biomeNoise < 1) {
						planet.biome = mountain;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 2000;
			}
		}

		planetPlayer.planet = 'dirt';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	function grass(newGrass) {
		var ocean = {color: '#356ecc'};
		var lake = {color: '#3ebcf2'};
		var sand = {color: '#ffe2a0'};
		var steppe = {color: '#b5e07d'};
		var grass = {color: '#7bd651'};
		var forest = {color: '#23842e'};
		var rock = {color: '#97a2a3'};
		var snow = {color: '#eaefef'};

		// Generate World
		if (newGrass == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;

			// Generate World
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .4) {
						planet.biome = ocean;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .4 && biomeNoise < .45) {
						planet.biome = lake;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .45 && biomeNoise < .5) {
						planet.biome = sand;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .5 && biomeNoise < .57) {
						planet.biome = steppe;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .57 && biomeNoise < .65) {
						planet.biome = grass;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .65 && biomeNoise < .75) {
						planet.biome = forest;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .75 && biomeNoise < .77) {
						planet.biome = rock;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .77 && biomeNoise < 1) {
						planet.biome = snow;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 3000;
			}
		}

		planetPlayer.planet = 'grass';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}
	

	function water(newWater) {
		var ocean = {color: '#214289'};
		var sea = {color: '#286cbf'};
		var lake = {color: '#1f90ba'};

		// Generate World
		if (newWater == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .5) {
						planet.biome = ocean;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .5 && biomeNoise < .7) {
						planet.biome = sea;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .7 && biomeNoise < 1) {
						planet.biome = lake;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 4000;
			}
		}
			
		planetPlayer.planet = 'water';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	function rock(newRock) {
		var rock = {color: '#707070'};
		var hill = {color: '#999999'};
		var snow = {color: '#c9c9c9'};
		var ice = {color: '#bdfcf8'};

		// Generate World
		if (newRock == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .5) {
						planet.biome = rock;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .5 && biomeNoise < .7) {
						planet.biome = hill;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .7 && biomeNoise < .8) {
						planet.biome = snow;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .8 && biomeNoise < 1) {
						planet.biome = ice;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 5000;
			}
		}

		planetPlayer.planet = 'rock';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	function snow(newSnow) {
		var ice = {color: '#dbfffd'};
		var permafrost = {color: '#f4f4f4'};
		var snow = {color: '#bed9dd'};

		// Generate World
		if (newSnow == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .3) {
						planet.biome = ice;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .3 && biomeNoise < .45) {
						planet.biome = snow;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .45 && biomeNoise < 1) {
						planet.biome = permafrost;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 6000;
			}
		}

		planetPlayer.planet = 'snow';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	function ice(newIce) {
		var ice = {color: '#bdfcf8'};
		var snow = {color: '#bed9dd'};
		var permafrost = {color: '#f4f4f4'};

		// Generate World
		if (newIce == true) {
			planets.arrays[planets.id] = [];
			var inc = .01;
			for (y = 0; y < planet.height; y++) {
				for (x = 0; x < planet.width; x++) {
					xoff += inc;
					biomeNoise = noise(xoff, yoff);
					if (biomeNoise < .5) {
						planet.biome = ice;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .5 && biomeNoise < .6) {
						planet.biome = permafrost;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					} else if (biomeNoise >= .6 && biomeNoise < 1) {
						planet.biome = snow;
						index = x + y * planet.width;
						planets.arrays[planets.id][index] = planet.biome.color;
					}
				}
				yoff += inc;
				xoff = 7000;
			}
		}

		planetPlayer.planet = 'ice';
		displayWorld();
		planetPlayer.draw();
		panPlanet();
	}

	checkCollisions();

	function displayWorld() {
		clear();
		for (j = display.y; j < height / pixelLength + display.y; j++) {
			for (i = display.x; i < width / pixelLength + display.x; i++) {
				index = i + j * planet.width;
				fill(planets.arrays[planets.id][index]);
				noStroke();
				rect((i - display.x) * pixelLength, (j - display.y) * pixelLength, pixelLength, pixelLength);
			}
		}
		planet.ship.startX = pixelLength * display.width / 2 + display.x;
		planet.ship.startY = pixelLength * display.height / 2 + display.y - ship.height * 4;
		planet.ship.x = planet.ship.startX - (display.x - planet.width / 2) * pixelLength;
		planet.ship.y = planet.ship.startY - (display.y - planet.height / 2) * pixelLength;
		image(shipImage, planet.ship.x - display.x - planet.ship.width / 2, planet.ship.y - display.y - planet.ship.height / 2, planet.ship.width, planet.ship.height);
		planetPlayer.check();
		pointToShip();
	}

	function pointToShip() {
		fill(255);
		noStroke();
		beginShape();
		if (planet.ship.x - display.x < 0 && planet.ship.y - display.y < 0) {
			vertex(20, 20);
			vertex(40, 25);
			vertex(28, 28);
			vertex(25, 40);
		} else if (planet.ship.x - display.x > width && planet.ship.y - display.y < 0) {
			vertex(width - 20, 20);
			vertex(width - 40, 25);
			vertex(width - 28, 28);
			vertex(width - 25, 40);
		} else if (planet.ship.x - display.x > width && planet.ship.y - display.y > height) {
			vertex(width - 20, height - 20);
			vertex(width - 40, height - 25);
			vertex(width - 28, height - 28);
			vertex(width - 25, height - 40);
		} else if (planet.ship.x - display.x < 0 && planet.ship.y - display.y > height) {
			vertex(20, height - 20);
			vertex(40, height - 25);
			vertex(28, height - 28);
			vertex(25, height - 40);
		}	else if (planet.ship.x - display.x < 0) {
			vertex(20, planet.ship.y - display.y);
			vertex(40 * 0.9, planet.ship.y - display.y - 8);
			vertex(31.3, planet.ship.y - display.y);
			vertex(40 * 0.9, planet.ship.y - display.y + 8);
		} else if (planet.ship.y - display.y < 0) {
			vertex(planet.ship.x - display.x, 20);
			vertex(planet.ship.x - display.x - 8, 40 * 0.9);
			vertex(planet.ship.x - display.x, 31.3);
			vertex(planet.ship.x - display.x + 8, 40 * 0.9);
		} else if (planet.ship.x - display.x > width) {
			vertex(width - 20, planet.ship.y - display.y);
			vertex(width - 40 * 0.9, planet.ship.y - display.y - 8);
			vertex(width - 31.3, planet.ship.y - display.y);
			vertex(width - 40 * 0.9, planet.ship.y - display.y + 8);
		} else if (planet.ship.y - display.y > height) {
			vertex(planet.ship.x - display.x, height - 20);
			vertex(planet.ship.x - display.x - 8, height - 40 * 0.9);
			vertex(planet.ship.x - display.x, height - 31.3);
			vertex(planet.ship.x - display.x + 8, height - 40 * 0.9);
		}
		endShape(CLOSE);
	}
 
	function panPlanet() {
		if (planetPlayer.x < pixelLength) {
			if (display.x - 10 >= 0) {
				display.x -= panAmount;
				planetPlayer.x += panAmount * pixelLength;
			} else {
				planetPlayer.x += planetPlayer.speed;
			}
		} else if (planetPlayer.x > display.width * pixelLength - pixelLength) {
			if (display.x + 10 <= planet.width - display.width - 10) {
				display.x += panAmount;
				planetPlayer.x -= panAmount * pixelLength;
			} else {
				planetPlayer.x -= planetPlayer.speed;
			}
		} else if (planetPlayer.y < pixelLength) {
			if (display.y - 10 >= 1) {
				display.y -= panAmount;
				planetPlayer.y += panAmount * pixelLength;
			} else {
				planetPlayer.y += planetPlayer.speed;
			}
		} else if (planetPlayer.y > display.height * pixelLength - pixelLength) {
			if (display.y + 10 <= planet.height - display.height - 10) {
				display.y += panAmount;
				planetPlayer.y -= panAmount * pixelLength;
			} else {
				planetPlayer.y -= planetPlayer.speed;
			}
		}
	}
}