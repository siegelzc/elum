var pause = {
	state: 'pauseMenu', 
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
		left: ['Galactic Map', 'Inventory', 'Navigational Computer', 'Stored Assets', 'Controls'], 
		right: []
	}
};
var navComputer = {
	state: 'navComputerMenu', 
	choose: '', 
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
		left: function() {
			var lefT = [];
			for (i = 0; i < saves.length; i++) {
				lefT[i] = saves[i].system.name;
			}
			return lefT;
		}, 
		right: function() {
			righT = [];
			if (navComputer.choose == 'to') {
				righT[0] = 'To:';
			} else if (navComputer.choose == 'from') {
				righT[0] = 'From:';
			} else {
				righT[0] = 'Destination:';
			}
			return righT;
		}, 
		empty: 'There are no stored coordinates'
	}
};
var controls = {
	state: 'controlsMenu', 
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
		left: ['Movement', 'Primary Interaction', 'Secondary Interaction', 'Back/Exit', 'Inventory', 'Galactic Map', 'Pause'], 
		right: ['WASD or Arrow Keys', 'E', 'R', 'Q', 'I', 'G', 'P']
	}
};
var assets = {
	state: 'assetsMenu', 
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
		left: function() {
			var lefT = [];
			for (i = saves.length - 1; i >= 0; i--) {
				if (isEmpty(saves[i].cargoHold) == false) {
					lefT.push(saves[i].system.name);
				}
			}
			return lefT;
		}, 
		right: [], 
		empty: 'There are no stored assets'
	}
};
var constructionProjects = {
	state: 'constructionProjectsMenu', 
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
		left: ['Mobile Station', 'Warp Gate (Mono-Directional)', 'Beacon', 'Mining Barge'], 
		right: function() {
			var righT = [];
			for (i in cost.structures) {
				var strinG = '';
				for (j in cost.structures[i]) {
					if (cost.structures[i][j] != 0) {
						strinG += ' ' + j[0].toUpperCase() + j[1] + ':' + cost.structures[i][j];
					}
				}
				righT.push(strinG);
			}
			return righT;
		}, 
		empty: 'There are no projects available'
	}
};
var militaryConstruction = {
	state: 'militaryConstructionMenu', 
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
		left: ['Mine Field'], 
		right: function() {
			var righT = [];
			for (i in cost.military) {
				var strinG = '';
				for (j in cost.military[i]) {
					if (cost.military[i][j] != 0) {
						strinG += ' ' + j[0].toUpperCase() + j[1] + ':' + cost.military[i][j];
					}
				}
				righT.push(strinG);
			}
			return righT;
		},  
		empty: 'There is nothing to construct'
	}
};
var militaryManagement = {
	state: 'militaryManagementMenu', 
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
		right: [], 
		empty: 'There is nothing to manage'
	}
};
var bargeMenu = {
	state: 'bargeMenu', 
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
		left: function() {
			var arraY = [];
			var strinG = '';
			for (i in barges.array[barges.id].inventory) {
				if (barges.array[barges.id].inventory[i] > 0) {
					strinG = i[0].toUpperCase() + i.slice(1) + ' Ore';
					arraY.push(strinG);
				}
			}
			return arraY;
		}, 
		right: function() {
			var arraY = [];
			for (i in barges.array[barges.id].inventory) {
				if (barges.array[barges.id].inventory[i] > 0) {
					arraY.push(barges.array[barges.id].inventory[i]);
				}
			}
			return arraY;
		}, 
		empty: 'The barge\'s inventory is empty'
	}
};
var labMenu = {
	state: 'labMenu', 
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
		left: ['Refining Therodite', 'Refining Oxytrite', 'Refining Ikredein', 'Refining Embryan', 'Refining Odium', 'Refining Sybril'], 
		right: [], 
		empty: 'There are no available upgrades'
	}
};

var menU;
function scrollMenu(objecT, reseT) {
	clearInterval(systemInterval);
	belt.clearInterval();
	mine.clearInterval();
	planetPlayer.clearInterval();
	menU = objecT;
	if (reseT == true) {
		objecT.rows.start = 0;
		objecT.cursor.position = 0;
		previousState = state;
	}
	state = objecT.state;

	fill(255);
	stroke(0);
	textFont('Courier New');
	textSize(14);
	objecT.height = 20;
	if (typeof objecT.text.left == 'function') {
		if (typeof objecT.text.right == 'function') {
			objecT.rows.count = max(objecT.text.left().length, objecT.text.right().length);
		} else {
			objecT.rows.count = max(objecT.text.left().length, objecT.text.right.length);
		}
	} else {
		if (typeof objecT.text.right == 'function') {
			objecT.rows.count = max(objecT.text.left.length, objecT.text.right().length);
		} else {
			objecT.rows.count = max(objecT.text.left.length, objecT.text.right.length);
		}
	}
	for (m = 0; m < objecT.rows.count && m < objecT.rows.max; m++) {
		objecT.height += 20;
	}
	if (objecT.rows.count == 0) {
		objecT.height += 20;
	}
	objecT.x = centerX - objecT.width / 2;
	objecT.y = centerY - objecT.height / 2;
	rect(objecT.x, objecT.y, objecT.width, objecT.height, 5, 5, 5, 5);
	fill(0);
	stroke(0);
	if (typeof objecT.text.left == 'function') {
		if (objecT.text.left().length > 0) {
			for (m = objecT.rows.start; m < objecT.rows.count + objecT.rows.start && m < objecT.rows.start + objecT.rows.max && m < objecT.text.left().length; m++) { // Left Text
				text(objecT.text.left()[m], objecT.x + 15, objecT.y + 23 + (m - objecT.rows.start) * 20);
			}
		}
		if (objecT.text.left().length == 0) {
			text(objecT.text.empty, objecT.x + objecT.width / 2 - textWidth(objecT.text.empty) / 2, objecT.y + 23);
		}
	} else {
		if (objecT.text.left.length > 0) {
			for (m = objecT.rows.start; m < objecT.rows.count + objecT.rows.start && m < objecT.rows.start + objecT.rows.max && m < objecT.text.left.length; m++) { // Left Text
				text(objecT.text.left[m], objecT.x + 15, objecT.y + 23 + (m - objecT.rows.start) * 20);
			}
		}
		if (objecT.text.left.length == 0) {
			text(objecT.text.empty, objecT.x + objecT.width / 2 - textWidth(objecT.text.empty) / 2, objecT.y + 23);
		}
	}
	if (typeof objecT.text.right == 'function') {
		if (objecT.text.right().length > 0) {
			for (m = objecT.rows.start; m < objecT.rows.count + objecT.rows.start && m < objecT.rows.start + objecT.rows.max && m < objecT.text.right().length; m++) { // Right Text
				text(objecT.text.right()[m], objecT.x + objecT.width - 10 - textWidth(objecT.text.right()[m]), objecT.y + 23 + (m - objecT.rows.start) * 20);
			}
		}
	} else {
		if (objecT.text.right.length > 0) {
			for (m = objecT.rows.start; m < objecT.rows.count + objecT.rows.start && m < objecT.rows.start + objecT.rows.max && m < objecT.text.right.length; m++) { // Right Text
				text(objecT.text.right[m], objecT.x + objecT.width - 10 - textWidth(objecT.text.right[m]), objecT.y + 23 + (m - objecT.rows.start) * 20);
			}
		}
	}
	if (objecT.rows.start < objecT.rows.count - objecT.rows.max) { // Down Arrow
		fill(10);
		noStroke();
		triangle(objecT.x + objecT.width - 10, objecT.y + objecT.height - 5, objecT.x + objecT.width - 15, objecT.y + objecT.height - 10, objecT.x + objecT.width - 5, objecT.y + objecT.height - 10);
	}
	if (objecT.rows.start > 0) { // Up Arrow
		fill(10);
		noStroke();
		triangle(objecT.x + objecT.width - 10, objecT.y + 5, objecT.x + objecT.width - 15, objecT.y + 10, objecT.x + objecT.width - 5, objecT.y + 10);
	}
	if (objecT.rows.count > 0) { // Cursor
		objecT.cursor.x = objecT.x + 9;
		objecT.cursor.y = objecT.y + 20;
		if (objecT.cursor.position > objecT.rows.count - 1) {
			objecT.cursor.position = objecT.rows.count - 1;
		}
		for (m = objecT.rows.start; m < objecT.cursor.position; m++) {
			objecT.cursor.y += 20;
		}
		fill(10);
		noStroke();
		ellipse(objecT.cursor.x, objecT.cursor.y, objecT.cursor.diameter);
	}
}