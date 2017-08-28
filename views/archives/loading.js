function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	center = {
		x: width / 2, 
		y: height / 2
	};
	for (i = 0; i < 5; i++) {
		load.circles[i] = {
			x: center.x - 50 + 25 * i, 
			y: center.y, 
			r: 12.5, 
			fill: 255, 
			offset: 100 * i
		};
	}
}

var load = {
	circles: [], 
	s: 0
};
function draw() {
	clear();
	background(50);
	for (i = 0; i < load.circles.length; i++) {
		load.circles[i].y = 20 * sin(load.s - load.circles[i].offset) + center.y;

		fill(load.circles[i].fill);
		noStroke();
		ellipse(load.circles[i].x, load.circles[i].y, load.circles[i].r);
	}
	load.s += .1;
}