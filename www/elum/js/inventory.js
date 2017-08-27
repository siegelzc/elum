var inventory = {
	string: 'inventory', 
	canCloseP: false, 
	x: undefined, 
	y: undefined, 
	width: 450, 
	height: undefined, 
	rows: {
		start: undefined, 
		count: undefined, 
		max: 6
	}, 
	cursor: {
		position: undefined, 
		x: undefined, 
		y: undefined, 
		diameter: 6
	}, 
	text: {
		left: [], 
		right: []
	}, 
	getContent: function(indeX) {
		for (i in this) {
			if (i == 'ores' || i == 'refined') { // Must make case for every branch of items
				for (j in this[i]) {
					if (this[i][j].string == this.text.left[indeX]) {
						return this[i][j];
					}
				}
			}
		}
	}, 
	ores: {
		therodite: {
			value: 0, 
			string: 'Therodite Ore'
		}, 
		oxytrite: {
			value: 0, 
			string: 'Oxytrite Ore'
		}, 
		ikredein: {
			value: 0, 
			string: 'Ikredein Ore'
		}, 
		embryan: {
			value: 0, 
			string: 'Embryan Ore'
		},  
		odium: {
			value: 0, 
			string: 'Odium Ore'
		}, 
		sybril: {
			value: 0, 
			string: 'Sybril Ore'
		}
	}, 
	refined: {
		therodite: {
			value: 0, 
			string: 'Refined Therodite'
		}, 
		oxytrite: {
			value: 0, 
			string: 'Refined Oxytrite'
		}, 
		ikredein: {
			value: 0, 
			string: 'Refined Ikredein'
		}, 
		embryan: {
			value: 0, 
			string: 'Refined Embryan'
		},  
		odium: {
			value: 0, 
			string: 'Refined Odium'
		}, 
		sybril: {
			value: 0, 
			string: 'Refined Sybril'
		}
	}
};
function openInventory(augmenT, reseT) {
	clearInterval(systemInterval);
	belt.clearInterval();
	mine.clearInterval();
	planetPlayer.clearInterval();
	if (reseT == true) {
		inventory.rows.start = 0;
		inventory.cursor.position = 0;
		previousState = state;
	}
	if (augmenT == 'inventory') {
		state = 'inventory';
	} else if (augmenT == 'refinery') {
		state = 'refineInventory';
	} else if (augmenT == 'deposit') {
		state = 'depositInventory';
	} else if (augmenT == 'withdraw') {
		state = 'withdrawInventory';
	}

	inventory.rows.count = 0;
	inventory.text.left = [];
	inventory.text.right = [];
	if (augmenT == 'inventory' || augmenT == 'deposit' || augmenT == 'refinery') {
		for (i in inventory.ores) {
			if (inventory.ores[i].value > 0) {
				inventory.rows.count++;
				inventory.text.left.push(inventory.ores[i].string);
				inventory.text.right.push(inventory.ores[i].value.toString());
			}
		}
		for (i in inventory.refined) {
			if (inventory.refined[i].value > 0) {
				inventory.rows.count++;
				inventory.text.left.push(inventory.refined[i].string);
				inventory.text.right.push(inventory.refined[i].value.toString());
			}
		}
	} else if (augmenT == 'withdraw') {
		for (i in cargoHold.ores) {
			if (cargoHold.ores[i].value > 0) {
				inventory.rows.count++;
				inventory.text.left.push(cargoHold.ores[i].string);
				inventory.text.right.push(cargoHold.ores[i].value.toString());
			}
		}
		for (i in cargoHold.refined) {
			if (cargoHold.refined[i].value > 0) {
				inventory.rows.count++;
				inventory.text.left.push(cargoHold.refined[i].string);
				inventory.text.right.push(cargoHold.refined[i].value.toString());
			}
		}
	}

	fill(255);
	stroke(0);
	textFont('Courier New');
	textSize(14);
	inventory.height = 20;
	for (i = 0; i < inventory.rows.count && i < inventory.rows.max; i++) {
		inventory.height += 20;
	}
	if (inventory.rows.count == 0) {
		inventory.height += 20;
	}
	inventory.x = centerX - inventory.width / 2;
	inventory.y = centerY - inventory.height / 2;
	rect(inventory.x, inventory.y, inventory.width, inventory.height, 5, 5, 5, 5);
	noFill();
	stroke(0);
	for (i = inventory.rows.start; i < inventory.rows.count + inventory.rows.start && i < inventory.rows.start + inventory.rows.max; i++) { // Left Text
		text(inventory.text.left[i], inventory.x + 15, inventory.y + 23 + (i - inventory.rows.start) * 20);
	}
	for (i = inventory.rows.start; i < inventory.rows.count + inventory.rows.start && i < inventory.rows.start + inventory.rows.max; i++) { // Right Text
		text(inventory.text.right[i], inventory.x + inventory.width - 10 - textWidth(inventory.text.right[i]), inventory.y + 23 + (i - inventory.rows.start) * 20);
	}
	if (inventory.rows.count == 0) { // Empty Text
		text('Inventory is empty', inventory.x + inventory.width / 2 - textWidth('Inventory is empty') / 2, inventory.y + 23);
	}
	if (inventory.rows.start < inventory.rows.count - inventory.rows.max) { // Down Arrow
		fill(10);
		noStroke();
		triangle(inventory.x + inventory.width - 10, inventory.y + inventory.height - 5, inventory.x + inventory.width - 15, inventory.y + inventory.height - 10, inventory.x + inventory.width - 5, inventory.y + inventory.height - 10);
	}
	if (inventory.rows.start > 0) { // Up Arrow
		fill(10);
		noStroke();
		triangle(inventory.x + inventory.width - 10, inventory.y + 5, inventory.x + inventory.width - 15, inventory.y + 10, inventory.x + inventory.width - 5, inventory.y + 10);
	}
	if (inventory.rows.count > 0) { // Cursor
		inventory.cursor.x = inventory.x + 9;
		inventory.cursor.y = inventory.y + 20;
		if (inventory.cursor.position > inventory.rows.count - 1) {
			inventory.cursor.position = inventory.rows.count - 1;
		}
		for (i = inventory.rows.start; i < inventory.cursor.position; i++) {
			inventory.cursor.y += 20;
		}
		fill(10);
		noStroke();
		ellipse(inventory.cursor.x, inventory.cursor.y, inventory.cursor.diameter);
	}
}

function refine(counT) {
	var orE = inventory.getContent(inventory.cursor.position);
	for (i in inventory.refined) { // Determine which refined metal matches the specified ore
		for (j = 0; j < inventory.refined[i].string.length; j++) {
			if (inventory.refined[i].string.charAt(j) == ' ') {
				var refinedIndeX = j + 1;
				break;
			}
		}
		for (j = 0; j < orE.string.length; j++) {
			if (orE.string.charAt(j) == ' ') {
				var oreIndeX = j;
			}
		}
		if (inventory.refined[i].string.slice(refinedIndeX) == orE.string.slice(0, oreIndeX)){
			var refineD = inventory.refined[i];
		}
	}
	if (counT == 'one') {
		refineD.value++;
		orE.value--;
	} else if (counT == 'all') {
		refineD.value += orE.value;
		orE.value = 0;
	}
}

var cargoHold = {
	ores: {
		therodite: {
			value: 0, 
			string: 'Therodite Ore'
		}, 
		oxytrite: {
			value: 0, 
			string: 'Oxytrite Ore'
		}, 
		ikredein: {
			value: 0, 
			string: 'Ikredein Ore'
		}, 
		embryan: {
			value: 0, 
			string: 'Embryan Ore'
		},  
		odium: {
			value: 0, 
			string: 'Odium Ore'
		}, 
		sybril: {
			value: 0, 
			string: 'Sybril Ore'
		}
	}, 
	refined: {
		therodite: {
			value: 0, 
			string: 'Refined Therodite'
		}, 
		oxytrite: {
			value: 0, 
			string: 'Refined Oxytrite'
		}, 
		ikredein: {
			value: 0, 
			string: 'Refined Ikredein'
		}, 
		embryan: {
			value: 0, 
			string: 'Refined Embryan'
		},  
		odium: {
			value: 0, 
			string: 'Refined Odium'
		}, 
		sybril: {
			value: 0, 
			string: 'Refined Sybril'
		}
	}
};
function deposit(counT) {
	var deposiT = inventory.getContent(inventory.cursor.position);
	for (i in cargoHold) {
		for (j in cargoHold[i]) {
			if (cargoHold[i][j].string == deposiT.string) {
				if (counT == 'one') {
					cargoHold[i][j].value++;
					deposiT.value--;
					break;
				} else if (counT == 'all') {
					cargoHold[i][j].value += deposiT.value;
					deposiT.value = 0;
					break;
				}
			}
		}
	}
	for (i = 0; i < galaxy.systems.count; i++) {
		if (saves[i].system.name == system.name) {
			saves[i].cargoHold = JSON.parse(JSON.stringify(cargoHold));
		}
	}
}
function withdraw(counT) {
	var withdrawaL = getCargo(inventory.cursor.position);
	for (i in inventory) {
		if (i == 'ores' || i == 'refined') {
			for (j in inventory[i]) {
				if (inventory[i][j].string == withdrawaL.string) {
					if (counT == 'one') {
						inventory[i][j].value++;
						withdrawaL.value--;
						break;
					} else if (counT == 'all') {
						inventory[i][j].value += withdrawaL.value;
						withdrawaL.value = 0;
						break;
					}
				}
			}
		}
	}
	for (i = 0; i < galaxy.systems.count; i++) {
		if (saves[i].system.name == system.name) {
			saves[i].cargoHold = JSON.parse(JSON.stringify(cargoHold));
		}
	}
}
var getCargo = function(indeX) {
	for (i in cargoHold) {
		if (i == 'ores' || i == 'refined') { // Must make case for every branch of items
			for (j in cargoHold[i]) {
				if (cargoHold[i][j].string == inventory.text.left[indeX]) {
					return cargoHold[i][j];
				}
			}
		}
	}
}
var isEmpty = function(objecT) {
	for (e in objecT) {
		if (e == 'ores' || e == 'refined') { // Must make case for every branch of items
			for (f in objecT[e]) {
				if (objecT[e][f].value > 0) {
					return false;
				}
			}
		}
	}
	return true;
}