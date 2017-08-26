var stations = {
	outer: [], 
	inner: [], 
	count: 0, 
	id: undefined, 
	system: undefined
};
var OuterStation = function(typE) {
	this.client = socket.id;
	if (typE == 'mobile') { // Unit Count
		this.type = typE;
		this.count = ceil(random(20, 30));
	} else if (typE == 'base') {
		this.type = typE;
		this.count = ceil(random(80, 110));
	} else {
		console.error('Error: Bad parameter to OuterStation()');
	}
	this.directions = [];
	this.orbitRadius = random(star.diameter, (system.radius + star.radius) / 2);
	this.radian = random(0, TWO_PI);
	this.x = system.x + this.orbitRadius * cos(this.radian);
	this.y = system.y + this.orbitRadius * sin(this.radian);
	this.orbitSpeed = sqrt((G * star.mass) / this.orbitRadius) / 3;
	if (random() < .5) {
		this.orbitSpeed *= -1;
	}
	for (i = 0; i < this.count; i++) {
		this.buildSide = random();
		if (0 <= this.buildSide && this.buildSide < .25) { // Build up
			this.directions.push('u');
		} else if(.25 <= this.buildSide && this.buildSide < .5) { // Build right
			this.directions.push('r');
		} else if(.5 <= this.buildSide && this.buildSide < .75) { // Build down
			this.directions.push('d');
		} else if(.75 <= this.buildSide && this.buildSide < 1) { // Build left
			this.directions.push('l');
		}
	}
	this.units = {
		x: [], 
		y: []
	};
	this.rooms = {
		x: [], 
		y: []
	};
	this.build = {
		x: this.x, 
		y: this.y
	};
	this.units.x[0] = this.build.x;
	this.units.y[0] = this.build.y;
	this.rooms.x[0] = this.build.x;
	this.rooms.y[0] = this.build.y;
	for (i = 0; i < this.count; i++) {
		if (this.directions[i] == 'u') {
			this.build.y -= stationUnitLength;
		} else if (this.directions[i] == 'r') {
			this.build.x += stationUnitLength;
		} else if (this.directions[i] == 'd') {
			this.build.y += stationUnitLength;
		} else if (this.directions[i] == 'l') {
			this.build.x -= stationUnitLength;
		}
		this.repeat = false;
		for (j = 0; j < this.count; j++) {
			if (this.build.x == this.units.x[j] && this.build.y == this.units.y[j]) {
				this.repeat = true;
				break;
			}
		}
		if (j == this.count && this.repeat == false) {
			this.rooms.x.push(this.build.x);
			this.rooms.y.push(this.build.y);
		}
		this.units.x.push(this.build.x);
		this.units.y.push(this.build.y);
	}

	// Cost
	if (this.type == 'mobile') {
		for (i in cost.structures.mobileStation) {
			inventory.refined[i].value -= cost.structures.mobileStation[i];
		}
	}
}

var InnerStation = function(adjusT) {
	this.client = socket.id;
	// Initial
	this.type = saves[navComputer.cursor.position].stations.outer[saves[navComputer.cursor.position].stations.outer.length - 1].type;
	this.unitLength = 100;
	this.roomChanceMaximum = 15;
	this.playerMoveDistance = this.unitLength;
	this.miniMapData = {
		x: 100, 
		y: 100, 
		pixelLength: 6, 
		radius: 150, 
		playerIndicatorLength: 3
	};
	this.x = center.x - this.unitLength / 2;
	this.y = center.y - this.unitLength / 2;
	this.player = {
		room: undefined, 
		x: this.x + this.unitLength / 2 - 4, 
		y: this.y + this.unitLength / 2
	};
	this.directions = saves[navComputer.cursor.position].stations.outer[saves[navComputer.cursor.position].stations.outer.length - 1].directions;
	this.units = {
		count: saves[navComputer.cursor.position].stations.outer[saves[navComputer.cursor.position].stations.outer.length - 1].count, 
		x: [], 
		y: []
	};
	if (this.type == 'mobile') {
		this.rooms = {
			count: 1, 
			x: [], 
			y: [], 
			hanger: {string: 'hanger', value: undefined, index: undefined}, // Ship dock
			refinery: {string: 'refinery', value: undefined, index: undefined}, // Refine raw ores into metal
			cargoHold: {string: 'cargoHold', value: undefined, index: undefined}, // Store materials in station cargo hold
			corridor: {string: 'corridor'}
		};
	} else if (this.type == 'base') {
		this.rooms = {
			count: 1, 
			x: [], 
			y: [], 
			hanger: {string: 'hanger', value: undefined, index: undefined}, // Ship dock
			refinery: {string: 'refinery', value: undefined, index: undefined}, // Refine raw ores into metal
			cargoHold: {string: 'cargoHold', value: undefined, index: undefined}, // Store materials in station cargo hold
			engineering: {string: 'engineering', value: undefined, index: undefined}, // Plan construction projects
			military: {string: 'military', value: undefined, index: undefined}, // Manage military
			lab: {string: 'lab', value: undefined, index: undefined}, // Upgrades
			corridor: {string:'corridor'}
		};
	}
	
	this.assignedRooms = [];
	
	// Frame
	this.build = {
		x: this.x, 
		y: this.y
	};
	this.units.x[0] = this.build.x;
	this.units.y[0] = this.build.y;
	this.rooms.x[0] = this.build.x;
	this.rooms.y[0] = this.build.y;
	for (i = 1; i < this.units.count; i++) {
		if (this.directions[i] == 'l') {
			this.build.x -= this.unitLength;
		} else if (this.directions[i] == 'u') {
			this.build.y -= this.unitLength;
		} else if (this.directions[i] == 'r') {
			this.build.x += this.unitLength;
		} else if (this.directions[i] == 'd') {
			this.build.y += this.unitLength;
		}
		this.repeat = false;
		for (j = 0; j < this.units.count; j++) {
			if (this.build.x == this.units.x[j] && this.build.y == this.units.y[j]) {
				this.repeat = true;
				break;
			}
		}
		if (j == this.units.count && this.repeat == false) {
			this.rooms.x.push(this.build.x);
			this.rooms.y.push(this.build.y);
			this.rooms.count++;
		}
		this.units.x[i] = this.build.x;
		this.units.y[i] = this.build.y;
	}

	// Rooms
	for (i in this.rooms) {
		if (typeof this.rooms[i] == 'object') {
			if ('value' in this.rooms[i]) {
				this.rooms[i].value = false;
			}
		}
	}
	for (i = 0; i < this.rooms.count; i++) { // All are set to 'corridor' at first
		this.assignedRooms[i] = this.rooms.corridor.string;
	}
	if (this.rooms.hanger.value == false) {
		this.assignedRooms[0] = this.rooms.hanger.string;
		this.rooms.hanger.value = true;
	}
	if (this.type == 'mobile') {
		for (i = 1; i < this.rooms.count; i++) {
			this.roomChance = random(0, this.roomChanceMaximum);
			if (this.roomChance >= 0 && this.roomChance < 1 && this.rooms.refinery.value == false) {
				this.assignedRooms[i] = this.rooms.refinery.string;
				this.rooms.refinery.value = true;
			} else if (this.roomChance >= 1 && this.roomChance < 2 && this.rooms.cargoHold.value == false) {
				this.assignedRooms[i] = this.rooms.cargoHold.string;
				this.rooms.cargoHold.value = true;
			} else {
				this.assignedRooms[i] = this.rooms.corridor.string;
			}
		}
	} else if (this.type == 'base') {
		for (i = 1; i < this.rooms.count; i++) {
			this.roomChance = random(0, this.roomChanceMaximum);
			if (this.roomChance >= 0 && this.roomChance < 1 && this.rooms.refinery.value == false) {
				this.assignedRooms[i] = this.rooms.refinery.string;
				this.rooms.refinery.value = true;
			} else if (this.roomChance >= 1 && this.roomChance < 2 && this.rooms.cargoHold.value == false) {
				this.assignedRooms[i] = this.rooms.cargoHold.string;
				this.rooms.cargoHold.value = true;
			} else if (this.roomChance >= 2 && this.roomChance < 3 && this.rooms.engineering.value == false) {
				this.assignedRooms[i] = this.rooms.engineering.string;
				this.rooms.engineering.value = true;
			}	else if (this.roomChance >= 3 && this.roomChance < 4 && this.rooms.military.value == false) {
				this.assignedRooms[i] = this.rooms.military.string;
				this.rooms.military.value = true;
			}	else if (this.roomChance >= 4 && this.roomChance < 5 && this.rooms.lab.value == false) {
				this.assignedRooms[i] = this.rooms.lab.string;
				this.rooms.lab.value = true;
			}	else {
				this.assignedRooms[i] = this.rooms.corridor.string;
			}
		}
	}
	for (i in this.rooms) {
		if (typeof this.rooms[i] == 'object') {
			if ('index' in this.rooms[i]) {
				this.rooms[i].index = this.assignedRooms.indexOf(this.rooms[i].string);
			}
		}
	}
	i = 0;
	for (i in this.rooms) {
		if (typeof this.rooms[i] == 'object') {
			if ('string' in this.rooms[i]) {
				if (this.rooms[i].index == -1) {
					for (j = 0; j < this.rooms.count; j++) {
						if (this.assignedRooms[j] == this.rooms.corridor.string) {
							this.assignedRooms[j] = this.rooms[i].string;
							this.rooms[i].value = true;
							this.rooms[i].index = this.assignedRooms.indexOf(this.rooms[i].string);
							break;
						}
					}
				}
			}
		}
	}

	// Mini Map
	this.miniMapData.playerIndicatorX = this.miniMapData.x + this.miniMapData.pixelLength / 4 + .5;
	this.miniMapData.playerIndicatorY = this.miniMapData.y + this.miniMapData.pixelLength / 4 + .5;

	// Pan
	this.panLog = {
		x: [], 
		y: [], 
		xCount: undefined, 
		yCount: undefined
	};
};

function drawInnerStation(reseT) {
	state = 'innerStation';

	// Background
	clear();
	background(50);
	drawStars(false);

	// Set to current screen dimensions
	if (reseT == true) {
		// Reset Station Position
		stations.inner[stations.id].dx = (center.x - stations.inner[stations.id].unitLength / 2) - stations.inner[stations.id].x;
		stations.inner[stations.id].dy = (center.y - stations.inner[stations.id].unitLength / 2) - stations.inner[stations.id].y;
		stations.inner[stations.id].x += stations.inner[stations.id].dx;
		stations.inner[stations.id].y += stations.inner[stations.id].dy;
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			stations.inner[stations.id].units.x[i] += stations.inner[stations.id].dx;
			stations.inner[stations.id].units.y[i] += stations.inner[stations.id].dy;
		}
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			stations.inner[stations.id].rooms.x[i] += stations.inner[stations.id].dx;
			stations.inner[stations.id].rooms.y[i] += stations.inner[stations.id].dy;
		}

		// Reset Player Position
		stations.inner[stations.id].player.x = stations.inner[stations.id].x + stations.inner[stations.id].unitLength / 2 - 4;
		stations.inner[stations.id].player.y = stations.inner[stations.id].y + stations.inner[stations.id].unitLength / 2;
		stations.inner[stations.id].miniMapData.playerIndicatorX = stations.inner[stations.id].miniMapData.x + stations.inner[stations.id].miniMapData.pixelLength / 4 + .5;
		stations.inner[stations.id].miniMapData.playerIndicatorY = stations.inner[stations.id].miniMapData.y + stations.inner[stations.id].miniMapData.pixelLength / 4 + .5;
	}
	
	// Pan
	if (stations.inner[stations.id].player.x < stations.inner[stations.id].unitLength / 2) {
		stations.inner[stations.id].x += stations.inner[stations.id].unitLength;
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			stations.inner[stations.id].units.x[i] += stations.inner[stations.id].unitLength;
		}
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			stations.inner[stations.id].rooms.x[i] += stations.inner[stations.id].unitLength;
		}
		stations.inner[stations.id].player.x += stations.inner[stations.id].unitLength;
		stations.inner[stations.id].panLog.x.push('r');
	} else if (stations.inner[stations.id].player.x > width - stations.inner[stations.id].unitLength / 2) {
		stations.inner[stations.id].x -= stations.inner[stations.id].unitLength;
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			stations.inner[stations.id].units.x[i] -= stations.inner[stations.id].unitLength;
		}
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			stations.inner[stations.id].rooms.x[i] -= stations.inner[stations.id].unitLength;
		}
		stations.inner[stations.id].player.x -= stations.inner[stations.id].unitLength;
		stations.inner[stations.id].panLog.x.push('l');
	} else if (stations.inner[stations.id].player.y < stations.inner[stations.id].unitLength / 2) {
		stations.inner[stations.id].y += stations.inner[stations.id].unitLength;
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			stations.inner[stations.id].units.y[i] += stations.inner[stations.id].unitLength;
		}
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			stations.inner[stations.id].rooms.y[i] += stations.inner[stations.id].unitLength;
		}
		stations.inner[stations.id].player.y += stations.inner[stations.id].unitLength;
		stations.inner[stations.id].panLog.y.push('d');
	} else if (stations.inner[stations.id].player.y > height - stations.inner[stations.id].unitLength / 2) {
		stations.inner[stations.id].y -= stations.inner[stations.id].unitLength;
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			stations.inner[stations.id].units.y[i] -= stations.inner[stations.id].unitLength;
		}
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			stations.inner[stations.id].rooms.y[i] -= stations.inner[stations.id].unitLength;
		}
		stations.inner[stations.id].player.y -= stations.inner[stations.id].unitLength;
		stations.inner[stations.id].panLog.y.push('u');
	}

	// Frame
	fill(200);
	stroke(70);
	drawItem(stations.inner[stations.id].directions, stations.inner[stations.id].x, stations.inner[stations.id].y, stations.inner[stations.id].unitLength);
	
	// Mini Map
	noFill(); // Circle
	stroke(230);
	strokeWeight(1);
	ellipse(stations.inner[stations.id].miniMapData.x, stations.inner[stations.id].miniMapData.y, stations.inner[stations.id].miniMapData.radius);
	fill(255); // Structure
	stroke(20);
	drawItem(stations.inner[stations.id].directions, stations.inner[stations.id].miniMapData.x, stations.inner[stations.id].miniMapData.y, stations.inner[stations.id].miniMapData.pixelLength);
	fill(10); // Player Indicator
	noStroke();
	rect(stations.inner[stations.id].miniMapData.playerIndicatorX, stations.inner[stations.id].miniMapData.playerIndicatorY, stations.inner[stations.id].miniMapData.playerIndicatorLength, stations.inner[stations.id].miniMapData.playerIndicatorLength);

	// Player
	fill(50);
	noStroke();
	drawItem(player, stations.inner[stations.id].player.x, stations.inner[stations.id].player.y);

	// Populate Rooms
	if (stations.inner[stations.id].type == 'mobile') {
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.hanger.string){
				stations.inner[stations.id].rooms.hanger.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.hanger.y = stations.inner[stations.id].rooms.y[i];

				image(shipImage, stations.inner[stations.id].rooms.hanger.x - ship.width / 2 + stations.inner[stations.id].unitLength / 2, stations.inner[stations.id].rooms.hanger.y + stations.inner[stations.id].unitLength / 6, ship.width, ship.height);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.refinery.string) {
				stations.inner[stations.id].rooms.refinery.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.refinery.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(crucible, stations.inner[stations.id].rooms.refinery.x + stations.inner[stations.id].unitLength / 2 - 5, stations.inner[stations.id].rooms.refinery.y + stations.inner[stations.id].unitLength / 3);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.cargoHold.string) {
				stations.inner[stations.id].rooms.cargoHold.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.cargoHold.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(crates, stations.inner[stations.id].rooms.cargoHold.x + stations.inner[stations.id].unitLength / 2 - 14, stations.inner[stations.id].rooms.cargoHold.y + stations.inner[stations.id].unitLength / 3 + 3);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.corridor.string) {
				
			} else {
				console.error('Error: populateRooms');
			}
		}
	} else if (stations.inner[stations.id].type == 'base') {
		for (i = 0; i < stations.inner[stations.id].rooms.count; i++) {
			if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.hanger.string){
				stations.inner[stations.id].rooms.hanger.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.hanger.y = stations.inner[stations.id].rooms.y[i];

				image(shipImage, stations.inner[stations.id].rooms.hanger.x - ship.width / 2 + stations.inner[stations.id].unitLength / 2, stations.inner[stations.id].rooms.hanger.y + stations.inner[stations.id].unitLength / 6, ship.width, ship.height);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.refinery.string) {
				stations.inner[stations.id].rooms.refinery.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.refinery.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(crucible, stations.inner[stations.id].rooms.refinery.x + stations.inner[stations.id].unitLength / 2 - 5, stations.inner[stations.id].rooms.refinery.y + stations.inner[stations.id].unitLength / 3);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.cargoHold.string) {
				stations.inner[stations.id].rooms.cargoHold.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.cargoHold.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(crates, stations.inner[stations.id].rooms.cargoHold.x + stations.inner[stations.id].unitLength / 2 - 14, stations.inner[stations.id].rooms.cargoHold.y + stations.inner[stations.id].unitLength / 3 + 3);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.engineering.string) {
				stations.inner[stations.id].rooms.engineering.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.engineering.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(hammer, stations.inner[stations.id].rooms.engineering.x + stations.inner[stations.id].unitLength / 2 - 2, stations.inner[stations.id].rooms.engineering.y + stations.inner[stations.id].unitLength / 3 - 20);
				drawItem(anvil, stations.inner[stations.id].rooms.engineering.x + stations.inner[stations.id].unitLength / 2 - 12, stations.inner[stations.id].rooms.engineering.y + stations.inner[stations.id].unitLength / 3 - 6)
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.military.string) {
				stations.inner[stations.id].rooms.military.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.military.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(rankStar, stations.inner[stations.id].rooms.military.x + stations.inner[stations.id].unitLength / 2 - 1, stations.inner[stations.id].rooms.military.y + stations.inner[stations.id].unitLength / 6);
				drawItem(rankV, stations.inner[stations.id].rooms.military.x + stations.inner[stations.id].unitLength / 2 - 7, stations.inner[stations.id].rooms.military.y + stations.inner[stations.id].unitLength / 6 + 4);
				drawItem(rankV, stations.inner[stations.id].rooms.military.x + stations.inner[stations.id].unitLength / 2 - 7, stations.inner[stations.id].rooms.military.y + stations.inner[stations.id].unitLength / 6 + 10);
				drawItem(rankV, stations.inner[stations.id].rooms.military.x + stations.inner[stations.id].unitLength / 2 - 7, stations.inner[stations.id].rooms.military.y + stations.inner[stations.id].unitLength / 6 + 16);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.lab.string) {
				stations.inner[stations.id].rooms.lab.x = stations.inner[stations.id].rooms.x[i];
				stations.inner[stations.id].rooms.lab.y = stations.inner[stations.id].rooms.y[i];

				fill(100);
				noStroke();
				drawItem(roundBottomFlask, stations.inner[stations.id].rooms.lab.x + stations.inner[stations.id].unitLength / 2 - 6, stations.inner[stations.id].rooms.lab.y + stations.inner[stations.id].unitLength / 7);
			} else if (stations.inner[stations.id].assignedRooms[i] == stations.inner[stations.id].rooms.corridor.string) {
				
			} else {
				console.error('Error: populateRooms');
			}
		}
	}
	
	// Check Room
	if (stations.inner[stations.id].type == 'mobile') {
		if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.hanger.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.hanger.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.hanger.string;
		} else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.refinery.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.refinery.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.refinery.string;
		} else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.cargoHold.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.cargoHold.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.cargoHold.string;
		} else {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.corridor.string;
		}
	} else if (stations.inner[stations.id].type == 'base') {
		if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.hanger.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.hanger.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.hanger.string;
		} else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.refinery.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.refinery.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.refinery.string;
		} else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.cargoHold.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.cargoHold.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.cargoHold.string;
		} else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.engineering.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.engineering.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.engineering.string;
		} else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.x[stations.inner[stations.id].rooms.military.index] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.y[stations.inner[stations.id].rooms.military.index] + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.military.string;
		}	else if (stations.inner[stations.id].player.x == stations.inner[stations.id].rooms.lab.x + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].rooms.lab.y + stations.inner[stations.id].unitLength / 2) {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.lab.string;
		}
		else {
			stations.inner[stations.id].player.room = stations.inner[stations.id].rooms.corridor.string;
		}
	}
}

function stationMove(direction) {
	if (direction == 'l') {
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			if (stations.inner[stations.id].player.x - stations.inner[stations.id].playerMoveDistance == stations.inner[stations.id].units.x[i] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].units.y[i] + stations.inner[stations.id].unitLength / 2) {
				stations.inner[stations.id].player.x -= stations.inner[stations.id].playerMoveDistance;
				stations.inner[stations.id].miniMapData.playerIndicatorX -= stations.inner[stations.id].miniMapData.pixelLength;
				break;
			}
		}
	} else if (direction == 'u') {
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			if (stations.inner[stations.id].player.y - stations.inner[stations.id].playerMoveDistance == stations.inner[stations.id].units.y[i] + stations.inner[stations.id].unitLength / 2 && stations.inner[stations.id].player.x == stations.inner[stations.id].units.x[i] + stations.inner[stations.id].unitLength / 2 - 4) {
				stations.inner[stations.id].player.y -= stations.inner[stations.id].playerMoveDistance;
				stations.inner[stations.id].miniMapData.playerIndicatorY -= stations.inner[stations.id].miniMapData.pixelLength;
				break;
			}
		}
	} else if (direction == 'r') {
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			if (stations.inner[stations.id].player.x + stations.inner[stations.id].playerMoveDistance == stations.inner[stations.id].units.x[i] + stations.inner[stations.id].unitLength / 2 - 4 && stations.inner[stations.id].player.y == stations.inner[stations.id].units.y[i] + stations.inner[stations.id].unitLength / 2) {
				stations.inner[stations.id].player.x += stations.inner[stations.id].playerMoveDistance;
				stations.inner[stations.id].miniMapData.playerIndicatorX += stations.inner[stations.id].miniMapData.pixelLength;
				break;
			}
		}
	} else if (direction == 'd') {
		for (i = 0; i < stations.inner[stations.id].units.count; i++) {
			if (stations.inner[stations.id].player.y + stations.inner[stations.id].playerMoveDistance == stations.inner[stations.id].units.y[i] + stations.inner[stations.id].unitLength / 2 && stations.inner[stations.id].player.x == stations.inner[stations.id].units.x[i] + stations.inner[stations.id].unitLength / 2 - 4) {
				stations.inner[stations.id].player.y += stations.inner[stations.id].playerMoveDistance;
				stations.inner[stations.id].miniMapData.playerIndicatorY += stations.inner[stations.id].miniMapData.pixelLength;
				break;
			}
		}
	}
	
	// Redraw
	drawInnerStation();
}