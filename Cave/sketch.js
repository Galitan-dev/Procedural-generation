const S = 30;
let C = 40;
let R = 25;

const shapes = [
	null,
	'bottom-right',
	'bottom-left',
	'left-right',
	'top-right',
	'top-bottom',
	'top-left&bottom-right',
	'top-left',
	'top-left',
	'top-right&bottom-left',
	'top-bottom',
	'top-right',
	'left-right',
	'bottom-left',
	'bottom-right',
	null
]

function shape(i) {
	const schema = i.toString(2);
	return schema;
}

/** @type {Array2D} */
let nodes;

function noiseNode(x, y) {
	let t = millis() * .0001;
	const weight = Math.floor(noise(x / 10, y / 10, t) * 100) / 100;
	return {
		weight,
		x,
		y
	};
}

function setup() {
	createCanvas((C - 1) * S, (R - 1) * S);
	nodes = createArray2D(C, R, noiseNode);
}

function draw() {
	background(51);

	nodes.fill(noiseNode)

	// beginShape();
	for (let x = 0; x < C - 1; x++)
		for (let y = 0; y < R - 1; y++) {
			const rNodes = [];
			rNodes[0] = nodes.get(x + 0, y + 0);
			rNodes[1] = nodes.get(x + 1, y + 0);
			rNodes[2] = nodes.get(x + 0, y + 1);
			rNodes[3] = nodes.get(x + 1, y + 1);

			const moye = moy(rNodes.map(n => n.weight));
			const schema = rNodes.map(n => (moye < .5 ? (n.weight < .5) : (n.weight >= .5)) ? 1 : 0).join('');
			// const schema = "10";
			const shape = shapes[parseInt(schema, 2)];

			stroke(100)
			let recordX;
			let recordY;
			if (!!shape)
				for (const dirs of shape.split('&')) {
					const cos = dirs
						.split('-')
						.map(dir => {
							let x;
							let y;
							switch (dir) {
								case 'top':
									x = moy([rNodes[0].weight, rNodes[1].weight]);
									y = 0;
									break;
								case 'bottom':
									x = moy([rNodes[2].weight, rNodes[3].weight]);
									y = 1;
									break;
								case 'left':
									x = 0;
									y = moy([rNodes[0].weight, rNodes[2].weight]);
									break;
								case 'right':
									x = 1;
									y = moy([rNodes[1].weight, rNodes[3].weight]);
									break;
							}
							return {
								x: x * S,
								y: y * S
							};
						})

					line(cos[0].x + x * S, cos[0].y + y * S, cos[1].x + x * S, cos[1].y + y * S);

					// vertex(cos[0].x + x * S, cos[0].y + y * S);
					// vertex(cos[1].x + x * S, cos[1].y + y * S);
					// if (!recordX) {
					// 	recordX = cos[0].x + x;
					// 	recordY = cos[0].y + y;
					// } else {
					// 	if (cos[0].x + x == recordX && cos[0].y + y == recordY) {
					// 		recordX = null;
					// 		recordY = null;
					// 		vertex(0, 0)
					// 	}
					// 	if (cos[1].x + x == recordX && cos[1].y + y == recordY) {
					// 		recordX = null;
					// 		recordY = null;
					// 		vertex(0, 0);
					// 	}
					// }
				}
			// fill(100);
			// endShape();

			// fill(100);
			// noStroke();
			// rNodes.forEach((node) => {
			// 	if (node.flag) circle(node.x * S, node.y * S, 5);
			// })
		}

	// noLoop();
}

function moy(numbers) {
	let moye = 0;
	numbers.forEach(n => moye += n);
	moye /= numbers.length;
	return moye;
}