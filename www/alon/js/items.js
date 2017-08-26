/*
Format:
var item = [ pixelLength, 'direction', 'direction', 'direction'];
*/

// Player
var itemShip = [ 1 , 'd', 'd', 'l', 'r', 'r', 'd', 'l', 'l', 'd', 'r', 'r', 'd', 'r', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'd', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'u', 'r', 'u', 'd', 'd', 'd', 'l', 'd', 'l', 'd', 'l', 'u', 'l', 'd', 'l', 'd', 'u', 'u', 'l', 'd', 'd', 'l', 'd', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'l', 'd', 'd', 'u', 'l', 'u', 'l', 'd', 'l', 'u', 'l', 'u', 'l', 'u', 'u', 'u', 'd', 'r', 'd', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'];
var player = [ 2 , 'r', 'r', 'r', 'd', 'd', 'l', 'u', 'l', 'l', 'd', 'r', 'd', 'r', 'd', 'r', 'r', 'd', 'd', 'd', 'u', 'u', 'l', 'l', 'd', 'd', 'd', 'r', 'd', 'd', 'u', 'u', 'l', 'l', 'l', 'd', 'd', 'u', 'u', 'r', 'u', 'u', 'u', 'u', 'l', 'd', 'l', 'u', 'd', 'd', 'd'];
var boat = [ 1 , 'd', 'r', 'd', 'r', 'r', 'd', 'r', 'r', 'd', 'r', 'r', 'd', 'r', 'l', 'l', 'l', 'l', 'u', 'l', 'd', 'l', 'u', 'u', 'l', 'l', 'u', 'd', 'd', 'r', 'd', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'd', 'l', 'd', 'd', 'd', 'l', 'd', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'l', 'd', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'd', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'u', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'u', 'u', 'd', 'd', 'l', 'd', 'd', 'u', 'l', 'u', 'l', 'u'];
var playerAnimationRight = [ 2 , 'r', 'r', 'r', 'd', 'd', 'l', 'u', 'l', 'l', 'd', 'r', 'd', 'r', 'd', 'r', 'r', 'd', 'd', 'd', 'u', 'u', 'l', 'l', 'd', 'd', 'd', 'r', 'd', 'u', 'l', 'l', 'l', 'd', 'd', 'u', 'u', 'r', 'u', 'u', 'u', 'u', 'l', 'd', 'l', 'u', 'd', 'd', 'd'];
var playerAnimationLeft = [ 2 , 'r', 'r', 'r', 'd', 'd', 'l', 'u', 'l', 'l', 'd', 'r', 'd', 'r', 'd', 'r', 'r', 'd', 'd', 'd', 'u', 'u', 'l', 'l', 'd', 'd', 'd', 'r', 'd', 'd', 'u', 'u', 'l', 'l', 'l', 'd', 'u', 'r', 'u', 'u', 'u', 'u', 'l', 'd', 'l', 'u', 'd', 'd', 'd'];

// Structures
var beaconItem = [ 1 , 'r', 'd', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'l', 'd', 'r', 'l', 'l', 'd', 'r', 'l', 'd', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'u', 'u', 'u', 'l', 'r', 'r', 'r', 'l', 'd', 'd', 'd', 'd', 'r', 'r', 'r', 'r', 'r', 'u', 'u', 'l', 'u', 'l', 'u', 'l', 'r', 'r', 'd', 'r', 'd', 'd', 'r', 'd', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'd', 'l', 'l', 'l', 'd', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'r', 'd', 'r', 'd', 'l', 'd', 'r', 'd', 'l'];
var bargeItem = [ 1.5, 'u', 'r', 'u', 'u', 'u', 'r', 'u', 'd', 'd', 'd', 'd', 'l', 'd', 'd', 'r', 'd', 'd', 'u', 'u', 'u', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'u', 'u', 'd', 'd', 'd', 'd', 'd', 'r', 'd', 'u', 'u', 'u', 'u', 'r', 'd', 'r', 'u', 'u', 'd', 'r', 'd', 'r', 'd', 'd', 'u', 'u', 'u', 'r', 'u', 'u', 'd', 'r', 'd', 'd', 'l', 'r', 'r', 'u', 'r', 'd', 'd', 'd', 'd', 'd', 'u', 'r', 'u', 'u', 'u', 'u', 'r', 'u', 'd', 'd', 'r', 'd', 'u', 'u', 'r', 'u', 'u', 'd', 'd', 'd', 'r', 'u', 'r', 'd', 'd', 'd', 'u', 'u', 'r', 'r', 'u', 'l', 'u', 'l', 'u', 'r', 'u'];

// Rooms
var rankStar = [ 2 , 'l', 'r', 'u', 'd', 'r', 'l', 'd', 'u'];
var rankV = [ 2 , 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'u', 'r', 'u', 'r', 'u', 'r', 'u'];
var hammer = [ 2 , 'd', 'l', 'd', 'l', 'd', 'r', 'd', 'r', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd'];
var anvil = [ 2 , 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'r', 'd', 'r', 'r', 'd', 'r', 'l', 'l', 'l', 'l'];
var monitor = [ 3 , 'r', 'r', 'r', 'r', 'l', 'l', 'u', 'u', 'r', 'r', 'r', 'u', 'u', 'l', 'd', 'l', 'u', 'l', 'd', 'd', 'l', 'u', 'u', 'l', 'd', 'd', 'l', 'u', 'u'];
var cpu = [ 3 , 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r'];
var cpuWire = [ 1 , 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'];
var crucible = [ 2 , 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'r', 'u', 'r', 'u', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'd', 'd', 'd', 'l', 'l', 'u', 'd', 'd', 'r', 'd', 'r', 'u', 'r', 'u', 'r', 'r', 'u', 'd', 'd', 'l', 'd', 'l'];
var crates = [ 2 , 'u', 'u', 'u', 'r', 'r', 'd', 'l', 'd', 'r', 'd', 'l', 'r', 'r', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'l', 'd', 'r', 'd', 'l', 'd', 'r', 'r', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'r', 'u', 'r', 'r', 'd', 'd', 'd', 'd', 'r', 'r', 'r', 'u', 'u', 'u', 'l', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'd', 'd', 'l', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'l', 'l', 'd', 'r', 'd', 'l', 'd', 'r'];
var roundBottomFlask = [ 2 , 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'd', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'd', 'r', 'r', 'r', 'r', 'r'];

// Animals
var cat = [ 2 , 'r', 'u', 'd', 'r', 'r', 'u', 'd', 'd', 'd', 'l', 'd', 'r', 'd', 'l', 'd', 'd', 'l', 'r', 'r', 'u', 'r', 'r', 'r', 'd', 'u', 'l', 'u', 'l', 'u'];
var kitty = [ 2 , 'r', 'u', 'd', 'd', 'd', 'r', 'd', 'd', 'u', 'r', 'r', 'd', 'u', 'u', 'l', 'r', 'u', 'u', 'u', 'r', 'd'];
var duck = [ 2 , 'u', 'l', 'd', 'l', 'd', 'r', 'd', 'r', 'd', 'u', 'r', 'u', 'l', 'r', 'u', 'r', 'u', 'l', 'r', 'u', 'r', 'u', 'l', 'u', 'r', 'd', 'r'];
var chicken = [ 2 , 'l', 'u', 'l', 'u', 'u', 'r', 'd', 'r', 'r', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'u', 'r', 'd', 'r'];
var chick = [ 2 , 'r', 'd', 'd', 'r', 'r', 'd', 'l', 'l', 'd', 'r', 'd', 'u', 'r'];
var dog = [ 2 , 'u', 'u', 'r', 'd', 'r', 'r', 'r', 'd', 'r', 'u', 'u', 'l', 'u', 'r', 'r', 'd', 'r'];
var rabbit = [ 2 , 'r', 'r', 'u', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'u', 'r', 'u', 'l', 'u', 'r'];
var bunny = [ 2 , 'u', 'u', 'l', 'd', 'l', 'd', 'u', 'l', 'u', 'l', 'r', 'u', 'u', 'r', 'd', 'd'];
var giraffe = [ 2 , 'u', 'l', 'r', 'r', 'u', 'r', 'd', 'r', 'd', 'u', 'u', 'l', 'u', 'r', 'r', 'd', 'r', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'r', 'u'];
var babyGiraffe = [ 2 , 'u', 'r', 'r', 'd', 'd', 'u', 'r', 'r', 'd', 'u', 'u', 'l', 'r', 'u', 'r', 'u', 'l', 'r', 'u', 'r', 'u', 'u', 'u', 'r', 'd', 'd', 'r'];
var bug = [ 1 , 'r', 'r', 'd', 'r', 'u', 'r', 'd', 'd', 'u', 'r', 'r', 'd', 'u', 'r', 'r', 'u', 'l', 'u', 'l', 'r', 'u'];
var fish = [ 1 , 'd', 'd', 'u', 'r', 'r', 'r', 'd', 'r', 'u', 'u', 'r', 'l', 'l', 'l', 'u'];
var ostrich = [ 2 , 'r', 'u', 'r', 'd', 'r', 'd', 'd', 'd', 'd', 'r', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'l', 'd', 'd', 'l', 'l', 'd', 'r'];
var tallCreature = [ 2 , 'r', 'u', 'r', 'd', 'd', 'l', 'd', 'd', 'd', 'd', 'r', 'd', 'd', 'd', 'u', 'r', 'r', 'r', 'd'];

// Plants
var oldTree = [ 2.5 , 'u', 'u', 'u', 'r', 'r', 'u', 'u', 'l', 'd', 'l', 'u', 'u', 'l', 'l', 'l', 'd', 'r', 'u', 'r', 'u', 'r', 'r', 'l', 'u', 'u', 'u', 'd', 'l', 'l'];

// Objects

var gun = [ 2 , 'r', 'u', 'r', 'r', 'r', 'r', 'u', 'u', 'd', 'r', 'd', 'd', 'u', 'r', 'r', 'd', 'u', 'u', 'r', 'r', 'd', 'l', 'r', 'r', 'r', 'd', 'l', 'd', 'd', 'r'];
var skull = [ 2 , 'd', 'd', 'r', 'd', 'r', 'r', 'u', 'r', 'u', 'u', 'l', 'l', 'd', 'u', 'l'];
var helmet = [ 2 , 'r', 'u', 'd', 'r', 'r', 'u', 'u', 'l', 'u', 'l', 'd', 'l'];

// NPCs
var oldMan = [ 2 , 'u', 'l', 'l', 'u', 'r', 'r', 'r', 'd', 'u', 'u', 'l', 'l', 'u', 'r', 'r', 'u', 'r', 'r', 'u', 'l'];
var robotHead = [ 2 , 'd', 'd', 'r', 'u', 'u', 'r', 'r', 'r', 'r', 'd', 'r', 'l', 'd', 'l', 'u', 'l', 'd', 'l', 'd'];

// Appliances
var chair = [ 2 , 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'l', 'u', 'u', 'l', 'd', 'd', 'l', 'u', 'u'];
var couch = [ 2 , 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'u', 'r', 'd', 'r', 'u', 'l', 'u', 'u', 'l', 'd', 'd', 'l', 'u', 'u', 'l', 'd', 'd', 'l', 'u', 'u', 'l', 'd', 'd'];

function drawItem(iteM, startX, startY, sizE) {
	var itemLength = iteM.length;
	if (sizE != undefined) {
		var pixelLength = sizE;
	} else {
		var pixelLength = iteM[0];
	}
	var currentX = startX;
	var currentY = startY;
	rect(startX, startY, pixelLength, pixelLength);
	for (it = 1; it < itemLength; it++) {
		if (iteM[it] == 'u') {
			currentY -= pixelLength;
			rect(currentX, currentY, pixelLength, pixelLength);
		} else if (iteM[it] == 'r') {
			currentX += pixelLength;
			rect(currentX, currentY, pixelLength, pixelLength);
		} else if (iteM[it] == 'd') {
			currentY += pixelLength;
			rect(currentX, currentY, pixelLength, pixelLength);
		} else if (iteM[it] == 'l') {
			currentX -= pixelLength;
			rect(currentX, currentY, pixelLength, pixelLength);
		} else {
			console.log('Error: drawItem()');
		}
	}
}