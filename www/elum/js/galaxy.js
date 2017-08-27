var galaxy = {
	setInterval: function() {
		clearInterval(galaxy.interval);
		galaxy.interval = setInterval(drawGalaxy, 25);
		galaxy.stars = JSON.parse(JSON.stringify(stars));
	}, 
	clearInterval: function() {
		galaxy.systems.selected = false;
		clearInterval(galaxy.interval);
	}, 
	loaded: false, 
	interval: undefined, 
	stars: undefined, 
	systems: {
		selected: [], 
		index: undefined, 
		count: 20, 
		d: 20
	}, 
	core: {
		x: undefined, 
		y: undefined, 
		d: 100, 
		fill: {
			h: 0, 
			s: 22, 
			b: 90
		}
	}
};
function drawGalaxy() {
	state = 'galaxy';
	clear();
	background(spaceBackground);

	// Stars
	drawStars(false);

	// Core
	galaxy.core.x = center.x;
	galaxy.core.y = center.y;
	galaxy.core.fill.h += 3;
	if (galaxy.core.fill.h >= 360) {
		galaxy.core.fill.h = 0;
	}
	colorMode(HSB);
	fill(galaxy.core.fill.h, galaxy.core.fill.s, galaxy.core.fill.b);
	noStroke();
	// ellipse(galaxy.core.x, galaxy.core.y, galaxy.core.d); // Replace with animation
	colorMode(RGB);

	// Territory
	for (i in territory) {
		if (territory[i] == socket.id) {
			for (j = 0; j < galaxy.systems.count; j++) {
				if (i == saves[j].system.name) { // Owned
					fill('#1752b2'); // Blue
					noStroke();
					ellipse(galaxy.core.x + saves[j].system.coord.x, galaxy.core.y + saves[j].system.coord.y, galaxy.systems.d + 6);
				}
			}
		} else if (territory[i] != socket.id && territory[i] != null) {
			for (j = 0; j < galaxy.systems.count; j++) {
				if (i == saves[j].system.name) { // Enemy
					fill('#d65448'); // Red
					noStroke();
					ellipse(galaxy.core.x + saves[j].system.coord.x, galaxy.core.y + saves[j].system.coord.y, galaxy.systems.d + 6);
				}
			}
		}
	}

	// Systems
	for (i = 0; i < galaxy.systems.count; i++) {
		while (saves[i].system.coord.x + galaxy.core.x <= galaxy.systems.d || saves[i].system.coord.x + galaxy.core.x >= width - galaxy.systems.d) {
			for (j = 0; j < galaxy.systems.count; j++) {
				saves[j].system.coord.x *= .9;
			}
		}
		while (saves[i].system.coord.y + galaxy.core.y <= galaxy.systems.d || saves[i].system.coord.y + galaxy.core.y >= height - galaxy.systems.d) {
			for (j = 0; j < galaxy.systems.count; j++) {
				saves[j].system.coord.y *= .9;
			}
		}
		fill(saves[i].star.color);
		noStroke();
		ellipse(galaxy.core.x + saves[i].system.coord.x, galaxy.core.y + saves[i].system.coord.y, galaxy.systems.d);
	}

	// Current System
	for (i = 0; i < saves.length; i++) {
		if (saves[i].system.name == system.name) {
			noFill();
			stroke('#81f461');
			ellipse(galaxy.core.x + saves[i].system.coord.x, galaxy.core.y + saves[i].system.coord.y, galaxy.systems.d + 8);
			fill(255);
			noStroke();
			textSize(16);
			textFont('Courier New');
			text('Current System: ' + saves[i].system.name, width - textWidth('Current System: ' + saves[i].system.name) - 30, 40);
		}
	}

	// System Selection
	if (galaxy.systems.selected == true) {
		noFill();
		stroke(255);
		ellipse(galaxy.core.x + saves[galaxy.systems.index].system.coord.x, galaxy.core.y + saves[galaxy.systems.index].system.coord.y, galaxy.systems.d + 7);
		fill(255);
		noStroke();
		textSize(16);
		textFont('Courier New');
		text(saves[galaxy.systems.index].system.name, 30, 40);
	}	
}