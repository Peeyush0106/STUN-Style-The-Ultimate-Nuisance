var point_positions = [];
var loadBallsSpeed = 3;
var point_last_movements_bool = [false, false, false, false, false];
var stoppedEllipses = [];
var stopping_pos;
var noOfBalls = 4;
var canvas;
setPointPos();

function setup() {
	canvas = createCanvas(window.outerWidth - 100, 200);
	stopping_pos = [
		(canvas.width / 2) - 137.5,
		(canvas.width / 2) - 127,
		(canvas.width / 2) - 112.5,
		(canvas.width / 2) - 98.5,
		(canvas.width / 2) - 81
	];
}

function setPointPos() {
	for (var i = -200; i < -200 + (37.5 * noOfBalls); i += 37.5) {
		point_positions.push({ x: i, y: 60 });
	}
}

function showLoadingAnim() {
	clear();
	if (document.getElementById("logout-btn")) document.getElementById("logout-btn").hidden = true;
	if (document.getElementById("dnlad-btn")) document.getElementById("dnlad-btn").hidden = true;

	for (var j = 0; j < point_positions.length; j++) {
		if (point_positions[j] !== null) {
			fill(64, 93, 196);
			noStroke();
			ellipse(point_positions[j].x, point_positions[j].y, 12.5);
			point_positions[j].x += ((j + 10) * 4) * loadBallsSpeed / 25;
		}
		if (point_positions[j] !== null) {
			if (point_positions[j].x >= stopping_pos[4 - j]) {
				stoppedEllipses.push(point_positions[j]);
				point_positions[j] = null;
			}
		}
		else if (stoppedEllipses.length === noOfBalls) {
			displayStoppedEllipses();
			runStoppedEllipses();
		}
		else {
			displayStoppedEllipses();
		}
	}
	if (stoppedEllipses[0] !== undefined && stoppedEllipses[0].x >= canvas.width) {
		stoppedEllipses = [];
		point_positions = [];
		setPointPos();
	}
}

function isTouching(x1, x2, y1, y2, radius) {
	return (x1 - x2 < (radius + radius) / 2 &&
		x2 - x1 < (radius + radius) / 2 &&
		y1 - y2 < (radius + radius) / 2 &&
		y2 - y1 < (radius + radius) / 2)
}

function runStoppedEllipses() {
	for (var k = 0; k < stoppedEllipses.length; k++) {
		stoppedEllipses[k].x += ((k + 1) * 20) * loadBallsSpeed / 35;
	}
}

function displayStoppedEllipses() {
	for (var k = 0; k < stoppedEllipses.length; k++) {
		fill(64, 93, 196);
		noStroke();
		ellipse(stoppedEllipses[k].x, stoppedEllipses[k].y, 12.5);
	}
}