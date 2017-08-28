function Asteroid(x, y) {
	this.x = x;
	this.y = y;
	this.color = random(55, 140);
	if (state == 'solarSystem') {
		this.r = random(minimumAsteroidRadiusBelt, maximumAsteroidRadiusBelt);
		this.x = system.x + (asteroidBelt.radius + this.offset) * cos(this.radian);
		this.y = system.y + (asteroidBelt.radius + this.offset) * sin(this.radian);
		this.mass = random(minimumAsteroidMass, maximumAsteroidMass);
		this.offset = random(0, asteroidBelt.width);
		this.radian = random(0, TWO_PI);
		this.orbitSpeed = sqrt(G * (star.mass + this.mass) / (asteroidBelt.radius + this.offset)) / 6;
		if (random() < .5) {
			this.orbitSpeed *= -1;
		}
		this.minVert = minimumAsteroidVerticesBelt;
		this.maxVert = maximumAsteroidVerticesBelt;
	} else if (state == 'belt') {
		this.x = random(0, width);
		this.y = random(0, height);
		this.r = random(minimumAsteroidRadiusFull, maximumAsteroidRadiusFull);
		this.direction = random(0, TWO_PI);
		this.speed = random(minimumAsteroidSpeed, maximumAsteroidSpeed);
		this.minVert = minimumAsteroidVerticesFull;
		this.maxVert = maximumAsteroidVerticesFull;
		this.ores = { // therodite, oxytrite, ikredein, embryan, odium, sybril (ascending rarity)
			therodite: undefined, 
			oxytrite: undefined, 
			ikredein: undefined, 
			embryan: undefined, 
			odium: undefined, 
			sybril: undefined
		}; // Calculates percentage concentration (probability) to be which ore
		if (this.color >= 55 && this.color < 65) { // Uncommon 11.76%
			this.ores.therodite = random(0, .5);
			this.ores.oxytrite = .5 - this.ores.therodite;
			this.ores.ikredein = random(0, .3);
			this.ores.embryan = random(0, .4 - this.ores.ikredein);
			this.ores.odium = random(.05, .5 - this.ores.embryan - this.ores.ikredein);
			this.ores.sybril = .5 - this.ores.embryan - this.ores.ikredein - this.ores.odium;
		} else if (this.color >= 65 && this.color <= 130) { // Common 76.47%
			this.ores.therodite = random(0, .8);
			this.ores.oxytrite = .8 - this.ores.therodite;
			this.ores.ikredein = random(0, .2);
			this.ores.embryan = random(0, .2 - this.ores.ikredein);
			this.ores.odium = random(0, .2 - this.ores.embryan - this.ores.ikredein);
			this.ores.sybril = .2 - this.ores.embryan - this.ores.ikredein - this.ores.odium;
		} else if (this.color > 130 && this.color <= 140) { // Rare 11.76%
			this.ores.therodite = random(0, .3);
			this.ores.oxytrite = .3 - this.ores.therodite;
			this.ores.ikredein = random(0, .4);
			this.ores.embryan = random(0, .5 - this.ores.ikredein);
			this.ores.odium = random(.05, .55 - this.ores.embryan - this.ores.ikredein);
			this.ores.sybril = .15 + .55 - this.ores.embryan - this.ores.ikredein - this.ores.odium;
		}
	}
	this.scanned = false;
	this.inc = asteroidIncrement;
	this.minOff = -this.r / 2;
	this.maxOff = this.r / 2;
	this.vertices = {
		radius: [], 
		radian: [], 
		offset: [], 
		x: [], 
		y: [], 
		count: floor(map(random(), 0, 1, this.minVert, this.maxVert)), 
		xoff: random(0, 1000000000)
	};
	for (a = 0; a < this.vertices.count; a++) {
		this.vertices.offset.push(map(noise(this.vertices.xoff), 0, 1, this.minOff, this.maxOff));
		this.vertices.xoff += this.inc;
		this.vertices.radius.push(this.r + this.vertices.offset[a]);
		this.vertices.radian.push(a * TWO_PI / this.vertices.count);
		this.vertices.x.push(this.vertices.radius[a] * cos(this.vertices.radian[a]) + this.x);
		this.vertices.y.push(this.vertices.radius[a] * sin(this.vertices.radian[a]) + this.y);
	}
}

function drawAsteroid(asteroiD) {
	fill(asteroiD.color);
	noStroke();
	beginShape();
	for (a = 0; a < asteroiD.vertices.count; a++) {
		asteroiD.vertices.x[a] = asteroiD.vertices.radius[a] * cos(asteroiD.vertices.radian[a]) + asteroiD.x;
		asteroiD.vertices.y[a] = asteroiD.vertices.radius[a] * sin(asteroiD.vertices.radian[a]) + asteroiD.y;
		vertex(asteroiD.vertices.x[a], asteroiD.vertices.y[a]);
	}
	endShape(CLOSE);
}

var belt = {
	width: undefined, 
	height: undefined, 
	asteroids: {
		count: undefined, 
		index: undefined, 
		array: []
	}, 
	ship: {
		radian: undefined, 
		radius: undefined, 
		x: undefined, 
		y: undefined, 
		direction: 'u', 
		speed: 0, 
		width: 15, 
		height: 15
	}, 
	setInterval: function() {
		clearInterval(beltInterval);
		beltInterval = setInterval(function() { drawAsteroidBelt(false); }, 25);
	}, 
	clearInterval: function() {
		clearInterval(beltInterval);
		belt.ship.speed = 0;
	}
};
var beltInterval;
var inSystem;
function drawAsteroidBelt(newBelt) {
	state = 'belt';
	clear();
	background(spaceBackground);
	drawStars(false);
	if (newBelt) {
		belt.width = width;
		belt.height = height;
		belt.ship.radian = ship.radian;
		belt.ship.radius = ship.radius;
		belt.setInterval();
	}

	// Asteroids
	if (newBelt) {
		belt.asteroids.array = [];
		belt.asteroids.count = floor(canvasArea / 20000);
		for (i = 0; i < belt.asteroids.count; i++) {
			belt.asteroids.array[i] = new Asteroid();
		}
	}
	for (i = 0; i < belt.asteroids.count; i++) {
		belt.asteroids.array[i].x += belt.asteroids.array[i].speed * cos(belt.asteroids.array[i].direction);
		belt.asteroids.array[i].y += belt.asteroids.array[i].speed * sin(belt.asteroids.array[i].direction);
		if (belt.asteroids.array[i].x <= 0) { // Left
			belt.asteroids.array[i].x = width;
		} else if (belt.asteroids.array[i].x >= width) { // Right
			belt.asteroids.array[i].x = 0;
		} else if (belt.asteroids.array[i].y <= 0) { // Top
			belt.asteroids.array[i].y = height;
		} else if (belt.asteroids.array[i] >= height) { // Bottom
			belt.asteroids.array[i].y = 0;
		}
		drawAsteroid(belt.asteroids.array[i]);
	}

	// Mining Barges
	for (i = 0; i < barges.count; i++) {
		fill(200);
		noStroke();
		drawItem(bargeItem, barges.array[i].x - 18 + map(noise(barges.array[i].xoff1), 0, 1, -barges.array[i].moveCap, barges.array[i].moveCap), barges.array[i].y + map(noise(barges.array[i].xoff2), 0, 1, -barges.array[i].moveCap, barges.array[i].moveCap));
		barges.array[i].xoff1 += barges.array[i].inc;
		barges.array[i].xoff2 += barges.array[i].inc;
	}

	// Ship
	if (newBelt) {
		if (ship.radius < asteroidBelt.radius + asteroidBelt.width / 2) { // Inside System
			inSystem = true;
			belt.ship.x = panSideBuffer + 10;
			belt.ship.direction = 'r';
		} else if (ship.radius >= asteroidBelt.radius + asteroidBelt.width / 2) { // Outside System
			inSystem = false;
			belt.ship.x = width - panSideBuffer - 10;
			belt.ship.direction = 'l';
		}
		belt.ship.y = height / 2;
		for (i = 0; i < belt.asteroids.count; i++) {
			if (belt.asteroids.array[i].x >= belt.ship.x - maximumAsteroidRadiusFull && belt.asteroids.array[i].x <= belt.ship.x + maximumAsteroidRadiusFull && belt.asteroids.array[i].y >= belt.ship.y - maximumAsteroidRadiusFull && belt.asteroids.array[i].y <= belt.ship.y + maximumAsteroidRadiusFull){
				while (sqrt(sq(belt.ship.x - belt.asteroids.array[i].x) + sq(belt.ship.y - belt.asteroids.array[i].y)) <= belt.asteroids.array[i].r) {
					belt.asteroids.index = i;
					if (inSystem == true) {
						belt.ship.x += belt.asteroids.array[i].r;
					} else if (inSystem == false) {
						belt.ship.x -= belt.asteroids.array[i].r;
					}
				}
			}
		}
		belt.ship.speed = 0;
	}
	fly(belt.ship);
	drawShip(belt.ship);

	// Collision
	for (i = 0; i < belt.asteroids.count; i++) {
		if (belt.asteroids.array[i].x >= belt.ship.x - maximumAsteroidRadiusFull && belt.asteroids.array[i].x <= belt.ship.x + maximumAsteroidRadiusFull && belt.asteroids.array[i].y >= belt.ship.y - maximumAsteroidRadiusFull && belt.asteroids.array[i].y <= belt.ship.y + maximumAsteroidRadiusFull){
			if (sqrt(sq(belt.ship.x - belt.asteroids.array[i].x) + sq(belt.ship.y - belt.asteroids.array[i].y)) <= belt.asteroids.array[i].r) {
				belt.asteroids.index = i;
				flag('asteroidMining');
			}
		}
	}
	if (belt.ship.x >= width - panSideBuffer) { // Right Side
		flag('exitSystem');
	} else if (belt.ship.x <= panSideBuffer) { // Left Side
		flag('enterSystem');
	}

	// Scan Results
	if (belt.asteroids.index !== undefined && belt.asteroids.array[belt.asteroids.index].scanned == true) {
		fill(255);
		noStroke();
		textFont('Courier New');
		textSize(14);
		mine.scan.therodite = 'Therodite : ' + round(belt.asteroids.array[belt.asteroids.index].ores.therodite * 10000) / 100 + '%';
		mine.scan.oxytrite = 'Oxytrite : ' + round(belt.asteroids.array[belt.asteroids.index].ores.oxytrite * 10000) / 100 + '%';
		mine.scan.ikredein = 'Ikredein : ' + round(belt.asteroids.array[belt.asteroids.index].ores.ikredein * 10000) / 100 + '%';
		mine.scan.embryan = 'Embryan : ' + round(belt.asteroids.array[belt.asteroids.index].ores.embryan * 10000) / 100 + '%';
		mine.scan.odium = 'Odium : ' + round(belt.asteroids.array[belt.asteroids.index].ores.odium * 10000) / 100 + '%';
		mine.scan.sybril = 'Sybril : ' + round(belt.asteroids.array[belt.asteroids.index].ores.sybril * 10000) / 100 + '%';
		mine.scan.width = max(textWidth(mine.scan.therodite), textWidth(mine.scan.oxytrite), textWidth(mine.scan.ikredein), textWidth(mine.scan.embryan), textWidth(mine.scan.odium), textWidth(mine.scan.sybril)) + 20;
		rect(20, 20, mine.scan.width, 132, 5, 5, 5, 5);
		noFill();
		stroke(0);
		text(mine.scan.therodite, 30, 40);
		text(mine.scan.oxytrite, 30, 60);
		text(mine.scan.ikredein, 30, 80);
		text(mine.scan.embryan, 30, 100);
		text(mine.scan.odium, 30, 120);
		text(mine.scan.sybril, 30, 140);
	}

	// Collision
	for (i = 0; i < barges.count; i++) {
		if (barges.array[i].x - 25 <= belt.ship.x && belt.ship.x <= barges.array[i].x + 25 && barges.array[i].y - 11 <= belt.ship.y && belt.ship.y <= barges.array[i].y + 9.5) { // Barge
			barges.id = i;
			flag('barge');
		}
	}
}

var mine = {
	setInterval: function() {
		mineInterval = setInterval(function() { mineAsteroid(); }, 25);
		mine.laser.ore.length = 0;
	}, 
	clearInterval: function() {
		clearInterval(mineInterval);
	},
	speed: undefined, 
	laser: {
		color: 255, 
		strokeWeight: undefined, 
		xoff: 0, 
		ore: {
			x: undefined,
			y: undefined, 
			diameter: undefined, 
			length: undefined, 
			random: undefined, 
			type: undefined
		}, 
		length: undefined, 
		radian: undefined
	}, 
	ores: {
		therodite: undefined, 
		oxytrite: undefined, 
		ikredein: undefined, 
		embryan: undefined, 
		odium: undefined, 
		sybril: undefined
	}, 
	scan: {
		width: undefined, 
		therodite: '', 
		oxytrite: '', 
		ikredein: '', 
		embryan: '', 
		odium: '', 
		sybril: ''
	}
};
var mineInterval;
function mineAsteroid() {
	state = 'mining';
	clear();
	background(spaceBackground);
	drawStars(false);
	for (i = 0; i < belt.asteroids.count; i++) {
		belt.asteroids.array[i].x += belt.asteroids.array[i].speed * cos(belt.asteroids.array[i].direction);
		belt.asteroids.array[i].y += belt.asteroids.array[i].speed * sin(belt.asteroids.array[i].direction);
		if (belt.asteroids.array[i].x <= 0) { // Left
			belt.asteroids.array[i].x = width;
		} else if (belt.asteroids.array[i].x >= width) { // Right
			belt.asteroids.array[i].x = 0;
		} else if (belt.asteroids.array[i].y <= 0) { // Top
			belt.asteroids.array[i].y = height;
		} else if (belt.asteroids.array[i] >= height) { // Bottom
			belt.asteroids.array[i].y = 0;
		}
		drawAsteroid(belt.asteroids.array[i]);
	}

	// Scan Results
	if (belt.asteroids.index !== undefined && belt.asteroids.array[belt.asteroids.index].scanned == true) {
		fill(255);
		noStroke();
		textFont('Courier New');
		textSize(14);
		mine.scan.therodite = 'Therodite : ' + round(belt.asteroids.array[belt.asteroids.index].ores.therodite * 10000) / 100 + '%';
		mine.scan.oxytrite = 'Oxytrite : ' + round(belt.asteroids.array[belt.asteroids.index].ores.oxytrite * 10000) / 100 + '%';
		mine.scan.ikredein = 'Ikredein : ' + round(belt.asteroids.array[belt.asteroids.index].ores.ikredein * 10000) / 100 + '%';
		mine.scan.embryan = 'Embryan : ' + round(belt.asteroids.array[belt.asteroids.index].ores.embryan * 10000) / 100 + '%';
		mine.scan.odium = 'Odium : ' + round(belt.asteroids.array[belt.asteroids.index].ores.odium * 10000) / 100 + '%';
		mine.scan.sybril = 'Sybril : ' + round(belt.asteroids.array[belt.asteroids.index].ores.sybril * 10000) / 100 + '%';
		mine.scan.width = max(textWidth(mine.scan.therodite), textWidth(mine.scan.oxytrite), textWidth(mine.scan.ikredein), textWidth(mine.scan.embryan), textWidth(mine.scan.odium), textWidth(mine.scan.sybril)) + 20;
		rect(20, 20, mine.scan.width, 132, 5, 5, 5, 5);
		noFill();
		stroke(0);
		text(mine.scan.therodite, 30, 40);
		text(mine.scan.oxytrite, 30, 60);
		text(mine.scan.ikredein, 30, 80);
		text(mine.scan.embryan, 30, 100);
		text(mine.scan.odium, 30, 120);
		text(mine.scan.sybril, 30, 140);
	}

	// Laser
	noFill();
	mine.laser.color = map(noise(mine.laser.xoff) * -1, -1, 0, 170, 255);
	stroke(mine.laser.color);
	mine.laser.strokeWeight = map(noise(mine.laser.xoff), 0, 1, .01, 4);
	mine.laser.xoff += .1;
	strokeWeight(mine.laser.strokeWeight);
	line(belt.ship.x, belt.ship.y, belt.asteroids.array[belt.asteroids.index].x, belt.asteroids.array[belt.asteroids.index].y);
	strokeWeight(1);
	mine.laser.length = sqrt(sq(belt.ship.x - belt.asteroids.array[belt.asteroids.index].x) + sq(belt.ship.y - belt.asteroids.array[belt.asteroids.index].y));
	mine.speed = mine.laser.length / 100;
	mine.laser.radian = asin((belt.ship.y - belt.asteroids.array[belt.asteroids.index].y) / mine.laser.length);
	if (mine.laser.ore.length >= mine.laser.length) {
		mine.laser.ore.length = 0;
		mine.ores.therodite = belt.asteroids.array[belt.asteroids.index].ores.therodite; // "Stacks up" percentages to be useable as probabilities
		mine.ores.oxytrite = belt.asteroids.array[belt.asteroids.index].ores.oxytrite + mine.ores.therodite;
		mine.ores.ikredein = belt.asteroids.array[belt.asteroids.index].ores.ikredein + mine.ores.oxytrite;
		mine.ores.embryan = belt.asteroids.array[belt.asteroids.index].ores.embryan + mine.ores.ikredein;
		mine.ores.odium = belt.asteroids.array[belt.asteroids.index].ores.odium + mine.ores.embryan;
		mine.ores.sybril = belt.asteroids.array[belt.asteroids.index].ores.sybril + mine.ores.odium;
		mine.laser.ore.random = random(0, 1);
		if (mine.laser.ore.random >= 0 && mine.laser.ore.random <= mine.ores.therodite) {
			mine.laser.ore.type = 'therodite';
			inventory.ores.therodite.value++;
		} else if (mine.laser.ore.random > mine.ores.therodite && mine.laser.ore.random <= mine.ores.oxytrite) {
			mine.laser.ore.type = 'oxytrite';
			inventory.ores.oxytrite.value++;
		} else if (mine.laser.ore.random > mine.ores.oxytrite && mine.laser.ore.random <= mine.ores.ikredein) {
			mine.laser.ore.type = 'ikredein';
			inventory.ores.ikredein.value++;
		} else if (mine.laser.ore.random > mine.ores.ikredein && mine.laser.ore.random <= mine.ores.embryan) {
			mine.laser.ore.type = 'embryan';
			inventory.ores.embryan.value++;
		} else if (mine.laser.ore.random > mine.ores.embryan && mine.laser.ore.random <= mine.ores.odium) {
			mine.laser.ore.type = 'odium';
			inventory.ores.odium.value++;
		} else if (mine.laser.ore.random > mine.ores.oxytrite && mine.laser.ore.random <= 1) {
			mine.laser.ore.type = 'sybril';
			inventory.ores.sybril.value++;
		}
	} else {
		mine.laser.ore.length += mine.speed;
	}
	if (belt.ship.x < belt.asteroids.array[belt.asteroids.index].x) {
		mine.laser.ore.x = belt.asteroids.array[belt.asteroids.index].x - mine.laser.ore.length * cos(mine.laser.radian);
	} else {
		mine.laser.ore.x = belt.asteroids.array[belt.asteroids.index].x + mine.laser.ore.length * cos(mine.laser.radian);
	}
	mine.laser.ore.y = belt.asteroids.array[belt.asteroids.index].y + mine.laser.ore.length * sin(mine.laser.radian);
	mine.laser.ore.diameter = mine.laser.strokeWeight;
	fill(0);
	noStroke();
	ellipse(mine.laser.ore.x, mine.laser.ore.y, mine.laser.ore.diameter);

	// Ship
	shipSpeedCap = 2;
	shipAcceleration = .15;
	fly(belt.ship);
	drawShip(belt.ship);
	if (sqrt(sq(belt.ship.x - belt.asteroids.array[belt.asteroids.index].x) + sq(belt.ship.y - belt.asteroids.array[belt.asteroids.index].y)) > belt.asteroids.array[belt.asteroids.index].r *  2) {
		mine.clearInterval();
		belt.setInterval();
		shipSpeedCap = 3.25;
		shipAcceleration = .2;
	}

	// Collisions
	if (belt.ship.x >= width - panSideBuffer) { // Right Side
		shipSpeedCap = 3.25;
		shipAcceleration = .2;
		flag('exitSystem');
	} else if (belt.ship.x <= panSideBuffer) { // Left Side
		shipSpeedCap = 3.25;
		shipAcceleration = .2;
		flag('enterSystem');
	}
}