var military = {
	mineFields: {
		array: [], 
		count: 0, 
		id: undefined
	}
};

/////////////////////////////////////////////////////////////////////////////// Mine Fields
var MineField = function() {
	if (devMode == true) {
		this.radius = 20;
		this.count = 5;
	} else {
		this.radius = 40;
		this.count = 10;
	}
	this.mines = [];
	this.system = saves[navComputer.cursor.position].system.name;
	this.id = military.mineFields.array.length;

	this.client = socket.id;
	this.r = random(star.diameter, system.radius - this.radius - 50);
	this.radian = random(0, TWO_PI);
	this.x = system.x + this.r * cos(this.radian);
	this.y = system.y + this.r * sin(this.radian);
	this.speed = sqrt((G * star.mass) / this.r) / 3;
	if (random() < .5) {
		this.speed *= -1;
	}

	// Cost
	for (i in cost.military.mineField) {
		inventory.refined[i].value -= cost.military.mineField[i];
	}
};

var Mine = function() {
	this.client = socket.id
	// Field = saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id]
	this.index = saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id].mines.length;
	this.radius = 3;
	this.r = random(this.radius * 2, saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id].radius);
	this.radian = random(0, TWO_PI);
	this.speed = sqrt((G * star.mass) / this.r) / 3;
	this.x = saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id].x + this.r * cos(this.radian);
	this.y = saves[navComputer.cursor.position].military.mineFields.array[saves[navComputer.cursor.position].military.mineFields.id].y + this.r * sin(this.radian);
	
	// Explosion
	this.exploding = false;
	this.explode = {
		max: undefined, 
		spacing: undefined, 
		weight: undefined, 
		size: undefined, 
		interval: undefined
	};
};

function explodeMine(objecT) {
	objecT.exploding = true;
	objecT.explode.max = 4;
	objecT.explode.spacing = 4;
	objecT.explode.weight = 1.5;
	objecT.explode.size = 0;
	objecT.explode.interval = setInterval(function() {
		objecT.explode.size += .07;
		if (objecT.explode.size > objecT.explode.max) {
			objecT.exploding = false;
			clearInterval(objecT.explode.interval);
			military.mineFields.array[military.mineFields.id].count--;
			military.mineFields.array[military.mineFields.id].mines.splice(objecT.index, 1);
			saves[system.index].military.mineFields.array[saves[system.index].military.mineFields.id].count--;
			saves[system.index].military.mineFields.array[saves[system.index].military.mineFields.id].mines.splice(objecT.index, 1);
			if (military.mineFields.array[military.mineFields.id].count == 0) {
				military.mineFields.count--;
				military.mineFields.array.splice(military.mineFields.id, 1);
			}
			if (saves[system.index].military.mineFields.array[saves[system.index].military.mineFields.id].count == 0) {
				saves[system.index].military.mineFields.count--;
				saves[system.index].military.mineFields.array.splice(saves[system.index].military.mineFields.id, 1);
			}
		}
	}, 25);
}