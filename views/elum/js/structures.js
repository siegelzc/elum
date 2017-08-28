/*
	// Cost Example
	for (i in cost.structures.warpGate) {
		inventory.refined[i].value -= cost.structures.warpGate[i];
	}
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////// Warp Gate
var warpGates = {
	array: [], 
	count: 0, 
	id: undefined, 
	to: undefined, 
	from: undefined
};
var WarpGate = function(tO) {
	this.client = socket.id;
	this.maxDiameterX = map(random(), 0, 1, minimumWarpGateRaidus, maximumWarpGateRadius);
	this.maxDiameterY = map(random(), 0, 1, minimumWarpGateRaidus, maximumWarpGateRadius);
	this.minDiameterX = this.maxDiameterX / 100;
	this.minDiameterY = this.maxDiameterY / 100;
	this.pulseSpeedX = this.maxDiameterX / 100;
	this.pulseSpeedY = this.maxDiameterY / 100;
	this.diameterX = this.minDiameterX;
	this.diameterY = this.minDiameterY;
	this.orbitRadius = random(star.diameter, system.radius - 30);
	this.radian = random(0, TWO_PI);
	this.orbitSpeed = sqrt((G * star.mass) / this.orbitRadius) / 3;
	if (random() < .5) {
		this.orbitSpeed *= -1;
	}
	this.x = system.x + this.orbitRadius * cos(this.radian);
	this.y = system.y + this.orbitRadius * sin(this.radian);

	this.id = warpGates.array.length;
	this.destination = {
		string: saves[tO].system.name, 
		index: tO
	};

	// Cost
	for (i in cost.structures.warpGate) {
		inventory.refined[i].value -= cost.structures.warpGate[i];
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////////// Beacons
var territory = {
	// solarSystem0: clientID, // Owned
	// solarSystem1: null // Unowned
};

var beacons = {
	array: [], 
	count: undefined, 
	system: undefined
};
var Beacon = function() {
	this.client = socket.id;
	this.r = random(star.diameter, system.radius - 30);
	this.radian = random(0, TWO_PI);
	this.x = system.x + this.r * cos(this.radian);
	this.y = system.y + this.r * sin(this.radian);
	this.speed = sqrt((G * star.mass) / this.r) / 3;
	if (random() < .5) {
		this.speed *= -1;
	}

	this.system = saves[navComputer.cursor.position].system.name;
	this.id = beacons.array.length;

	// Cost
	for (i in cost.structures.beacon) {
		inventory.refined[i].value -= cost.structures.beacon[i];
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////////// Mining Barges
var barges = {
	array: [], 
	count: undefined, 
	system: undefined, 
	id: undefined
};
var Barge = function() {
	this.client = socket.id;
	this.x = random(100, width - 100);
	this.y = random(100, height - 100);
	this.system = saves[navComputer.cursor.position].system.name;
	this.id = barges.array.length;

	// Movement
	this.xoff1 = 0;
	this.xoff2 = 10000;
	this.inc = .01;
	this.moveCap = 10;

	// Mining
	this.frequency = 2000;
	this.inventory = {
		therodite: 0, 
		oxytrite: 0, 
		ikredein: 0, 
		embryan: 0, 
		odium: 0, 
		sybril: 0
	};
	this.prob = {};
	this.prob.therodite = random(0, .8); // Same probabilities as average asteroids -- Can recalibrate (for a price)
	this.prob.oxytrite = .8;
	this.prob.ikredein = random(0, .2) + this.prob.oxytrite;
	this.prob.embryan = random(0, .2 - (this.prob.ikredein - this.prob.oxytrite)) + this.prob.ikredein;
	this.prob.odium = random(0, .2 - (this.prob.embryan - this.prob.ikredein) - (this.prob.ikredein - this.prob.oxytrite)) + this.prob.embryan;
	this.prob.sybril = 1;

	// Scan
	this.scan = {
		width: undefined, 
		therodite: '', 
		oxytrite: '', 
		ikredein: '', 
		embryan: '', 
		odium: '', 
		sybril: ''
	}

	// Cost
	for (i in cost.structures.barge) {
		inventory.refined[i].value -= cost.structures.barge[i];
	}
};

function bargeMining() {
	for (i = 0; i < galaxy.systems.count; i++) {
		for (j = 0; j < saves[i].barges.count; j++) {
			if (saves[i].barges.array[j].client == socket.id) {
				saves[i].barges.array[j].chance = random();
				if (0 <= saves[i].barges.array[j].chance && saves[i].barges.array[j].chance < saves[i].barges.array[j].prob.therodite) {
					saves[i].barges.array[j].ore = 'therodite';
				} else if (saves[i].barges.array[j].prob.therodite <= saves[i].barges.array[j].chance && saves[i].barges.array[j].chance < saves[i].barges.array[j].prob.oxytrite) {
					saves[i].barges.array[j].ore = 'oxytrite';
				} else if (saves[i].barges.array[j].prob.oxytrite <= saves[i].barges.array[j].chance && saves[i].barges.array[j].chance < saves[i].barges.array[j].prob.ikredein) {
					saves[i].barges.array[j].ore = 'ikredein';
				} else if (saves[i].barges.array[j].prob.ikredein <= saves[i].barges.array[j].chance && saves[i].barges.array[j].chance < saves[i].barges.array[j].prob.embryan) {
					saves[i].barges.array[j].ore = 'embryan';
				} else if (saves[i].barges.array[j].prob.embryan <= saves[i].barges.array[j].chance && saves[i].barges.array[j].chance < saves[i].barges.array[j].prob.odium) {
					saves[i].barges.array[j].ore = 'odium';
				} else if (saves[i].barges.array[j].prob.odium <= saves[i].barges.array[j].chance && saves[i].barges.array[j].chance < 1) {
					saves[i].barges.array[j].ore = 'sybril';
				}
				for (k in saves[i].barges.array[j].inventory) {
					if (saves[i].barges.array[j].ore == k) {
						saves[i].barges.array[j].inventory[k]++;
						if (i = system.index) {
							barges.array[j].inventory[k]++;
						}
						break;
					}
				}
			}
		}
	}
	if (state == 'bargeMenu') {
		drawAsteroidBelt(false);
		scrollMenu(bargeMenu);
	}
}