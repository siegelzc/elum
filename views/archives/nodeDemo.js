// Drawing Demo
var socket;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(20);

	// Sockets
	socket = io.connect('http://localhost:3000');
	socket.on('Mouse', newDrawing);
}

function mouseDragged() {
	fill(255);
	noStroke();
	ellipse(mouseX, mouseY, 20);

	var data = {
		x: mouseX, 
		y: mouseY
	};
	socket.emit('Mouse', data);
	console.log('Sent: ' + data.x + ', ' + data.y);
}

function mouseClicked() {
	fill(255);
	noStroke();
	ellipse(mouseX, mouseY, 20);

	var data = {
		x: mouseX, 
		y: mouseY
	};
	socket.emit('Mouse', data);
	console.log('Sent: ' + data.x + ', ' + data.y);
}

function newDrawing(datA) {
	fill(200);
	noStroke();
	ellipse(datA.x, datA.y, 10);
}