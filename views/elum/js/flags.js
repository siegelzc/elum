function flag(flagFunc) {
	var flagCornerRadius = 8;
	var flagFunction = {};
	
	clearInterval(systemInterval);
	belt.clearInterval();
	mine.clearInterval();
	if (flagFunc == 'startGame') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Start by constructing your home base', 'E : Construct']
		};
	} else if (flagFunc == 'exitStation') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Board your ship and exit the station?', 'E : Board', 'Q : Back']
		};
	} else if (flagFunc == 'enterStation') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Dock at the space station?', 'E : Dock', 'Q : Turn back']
		};
	}	else if (flagFunc == 'warp') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Warp to ' + warpGates.array[warpGates.id].destination.string + '?', 'E : Warp', 'Q : Turn back']
		};
	}	else if (flagFunc == 'enterPlanet') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Descend to ' + planets.name[planets.id] + '?', 'E : Descend', 'Q : Turn back']
		};
	} else if (flagFunc == 'exitPlanet') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Leave the planet?', 'E : Liftoff']
		};
	} else if (flagFunc == 'gasGiant') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Turbulence blocks you from breaching the atmosphere of ' + planets.name[planets.id], 'Q : Turn back']
		};
	} else if (flagFunc == 'star') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['The intense heat blocks you from breaching the star\'s chomosphere', 'Q : Turn back']
		};
	} else if (flagFunc == 'edgeFullscreen') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Microsoft Edge does not support fullscreen mode', 'Q : Return to the menu']
		};
	} else if (flagFunc == 'enterAsteroidBelt') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Enter the asteroid belt?', 'E : Proceed', 'Q : Turn Back']
		};
	} else if (flagFunc == 'asteroidMining') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Mine or scan the asteroid?', 'E : Mine', 'R : Scan', 'Q : Turn Back']
		};
	} else if (flagFunc == 'exitSystem') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Exit the asteroid belt and the solar system?', 'E : Exit', 'Q : Turn Back']
		};
	} else if (flagFunc == 'enterSystem') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Exit the asteroid belt and enter the solar system?', 'E : Exit', 'Q : Turn Back']
		};
	} else if (flagFunc == 'refinery') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Refine raw ores into metal?', 'E : Refine', 'Q : Back']
		};
	} else if (flagFunc == 'cautionRefine') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Refine the ' + inventory.text.left[inventory.cursor.position] + '?', 'E : One', 'R : All', 'Q : Back']
		};
	} else if (flagFunc == 'cannotRefineMetal') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['This metal is already refined', 'Q : Back']
		};
	} else if (flagFunc == 'cargoHold') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Deposit or Withdraw cargo from the hold?', 'E : Deposit', 'R : Withdraw', 'Q : Back']
		};
	} else if (flagFunc == 'cautionDeposit') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Deposit the ' + inventory.text.left[inventory.cursor.position] + '?', 'E : One', 'R : All', 'Q : Cancel']
		};
	} else if (flagFunc == 'cautionWithdraw') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Withdraw the ' + inventory.text.left[inventory.cursor.position] + '?', 'E : One', 'R : All', 'Q : Cancel']
		};
	} else if (flagFunc == 'sameSystemWarpGate') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['A warp gate cannot be directed to its own system', 'Q : Back']
		};
	} else if (flagFunc == 'constructWarpGate') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Construct a warp gate from ' + saves[warpGates.from].system.name + ' to ' + saves[warpGates.to].system.name + '?', 'E : Cosntruct', 'Q : Back']
		};
	}	else if (flagFunc == 'constructStation') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Construct a mobile station in ' + navComputer.text.left()[navComputer.cursor.position] + '?', 'E : Construct', 'Q : Back']
		};
	} else if (flagFunc == 'engineering') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Plan construction projects?', 'E : Plan', 'Q : Back']
		};
	} else if (flagFunc == 'warpHome') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Warp to home system (' + home.name + ')?', 'E : Warp', 'Q : Cancel']
		};
	} else if (flagFunc == 'sameSystemWarp') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You are already at your destination', 'Q : Back']
		};
	} else if (flagFunc == 'cannotAffordStructure') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You cannot afford the ' + constructionProjects.text.left[constructionProjects.cursor.position], 'Q : Back']
		};
	} else if (flagFunc == 'constructBeacon') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Construct a beacon in ' + navComputer.text.left()[navComputer.cursor.position] + '?', 'E : Construct', 'Q : Back']
		};
	} else if (flagFunc == 'stationBeforeStructure') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You must own a station in the system before constructing a ' + constructionProjects.text.left[constructionProjects.cursor.position], 'Q : Back']
		};
	} else if (flagFunc == 'alreadyBeacon') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You already own a beacon in the specified system', 'Q : Back']
		};
	} else if (flagFunc == 'beaconBlock') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You cannot construct in enemy territory', 'Q : Back']
		};
	} else if (flagFunc == 'gameFull') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['The game is full', 'Q : Back']
		};
	} else if (flagFunc == 'military') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Manage your military?', 'E : Construction', 'R : Management', 'Q : Back']
		};
	} else if (flagFunc == 'enterEnemyBase') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You cannot enter an enemy base', 'Q : Turn Back']
		};
	} else if (flagFunc == 'cannotAffordMilitary') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You cannot afford the ' + militaryConstruction.text.left[militaryConstruction.cursor.position], 'Q : Back']
		};
	} else if (flagFunc == 'constructMineField') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Construct a mine field in ' + navComputer.text.left()[navComputer.cursor.position] + '?', 'E : Construct', 'Q : Back']
		};
	} else if (flagFunc == 'constructBarge') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Construct a mining barge in ' + navComputer.text.left()[navComputer.cursor.position] + '?', 'E : Construct', 'Q : Back']
		};
	} else if (flagFunc == 'barge') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Manage the mining barge', 'E : Withdraw ore', 'R : Recalibrate instruments', 'Q : Turn Back']
		};
	} else if (flagFunc == 'bargeRecalibrate') {
		var strinG = '';
		for (i in cost.other.bargeRecalibrate) {
			if (cost.other.bargeRecalibrate[i] > 0) {
				strinG += i[0].toUpperCase() + i[1] + ':' + cost.other.bargeRecalibrate[i];
			}
		}
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Recalibrate the barge\'s instruments? - ' + strinG, 'E : Recalibrate', 'Q : Back']
		};
	} else if (flagFunc == 'cannotAffordRecalibration') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['You cannot afford to recalibrate the barge\'s instruments', 'Q : Back']
		};
	} else if (flagFunc == 'bargeWithdrawl') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Withdraw ' + bargeMenu.text.left()[bargeMenu.cursor.position] + '?', 'E : One', 'R : All', 'Q : Back']
		};
	} else if (flagFunc == 'lab') {
		flagFunction = {state: flagFunc + 'Flag', width: undefined, height: undefined, fill: 255, stroke: 0, leftBuffer: 10, topBuffer: 30, textFill: 0, textSize: 18, 
			strings: ['Purchase upgrades?', 'E : Upgrade List', 'Q : Back']
		};
	}
	else {
		console.error('Error: flagFunc is not defined');
	}

	state = flagFunction.state;
	flagFunction.height = 20 + 30 * flagFunction.strings.length;
	textFont('Verdana');
	textSize(flagFunction.textSize);
	flagFunction.width = textWidth(flagFunction.strings[0]) + 2 * flagFunction.leftBuffer;
	fill(flagFunction.fill);
	stroke(flagFunction.stroke);
	rect(centerX - flagFunction.width / 2, centerY - flagFunction.height / 2, flagFunction.width, flagFunction.height, flagCornerRadius);
	fill(flagFunction.textFill);
	noStroke();
	text(flagFunction.strings[0], centerX - flagFunction.width / 2 + flagFunction.leftBuffer, centerY - flagFunction.height / 2 + flagFunction.topBuffer);
	textSize(flagFunction.textSize - 2);
	for (f = 1; f < flagFunction.strings.length; f++) {
		text(flagFunction.strings[f], centerX - flagFunction.width / 2 + flagFunction.leftBuffer, centerY - flagFunction.height / 2 + flagFunction.topBuffer + f * 30);
	}

	// Barge 'Scan'
	if (flagFunc == 'barge' || flagFunc == 'bargeRecalibrate' || flagFunc == 'cannotAffordRecalibration') {
		textFont('Courier New');
		textSize(14);
		barges.array[barges.id].scan.therodite = 'Therodite : ' + round(barges.array[barges.id].prob.therodite * 10000) / 100 + '%';
		barges.array[barges.id].scan.oxytrite = 'Oxytrite : ' + round((barges.array[barges.id].prob.oxytrite - barges.array[barges.id].prob.therodite) * 10000) / 100 + '%';
		barges.array[barges.id].scan.ikredein = 'Ikredein : ' + round((barges.array[barges.id].prob.ikredein - barges.array[barges.id].prob.oxytrite) * 10000) / 100 + '%';
		barges.array[barges.id].scan.embryan = 'Embryan : ' + round((barges.array[barges.id].prob.embryan - barges.array[barges.id].prob.ikredein) * 10000) / 100 + '%';
		barges.array[barges.id].scan.odium = 'Odium : ' + round((barges.array[barges.id].prob.odium - barges.array[barges.id].prob.embryan) * 10000) / 100 + '%';
		barges.array[barges.id].scan.sybril = 'Sybril : ' + round((barges.array[barges.id].prob.sybril - barges.array[barges.id].prob.odium) * 10000) / 100 + '%';
		barges.array[barges.id].scan.width = max(textWidth('Current Calibration: '), textWidth(barges.array[barges.id].scan.therodite), textWidth(barges.array[barges.id].scan.oxytrite), textWidth(barges.array[barges.id].scan.ikredein), textWidth(barges.array[barges.id].scan.embryan), textWidth(barges.array[barges.id].scan.odium), textWidth(barges.array[barges.id].scan.sybril)) + 20;
		fill(255);
		noStroke();
		rect(20, 20, barges.array[barges.id].scan.width, 152, 5, 5, 5, 5);
		noFill();
		stroke(0);
		text('Current Calibration:', 30, 40);
		text(barges.array[barges.id].scan.therodite, 30, 60);
		text(barges.array[barges.id].scan.oxytrite, 30, 80);
		text(barges.array[barges.id].scan.ikredein, 30, 100);
		text(barges.array[barges.id].scan.embryan, 30, 120);
		text(barges.array[barges.id].scan.odium, 30, 140);
		text(barges.array[barges.id].scan.sybril, 30, 160);
	}
}