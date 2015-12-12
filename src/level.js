import {
	Object3D,
	Geometry,
	MeshBasicMaterial,
	Vector3, Face3, Color, LineSegments, LineDashedMaterial,
	Mesh, PlaneGeometry} from 'three';

import {Random} from './random';

export class Level extends Object3D {
	constructor() {
		super();

		this.random = new Random(Math.random());

		this.buildData();

		var outline = this.buildOutline();
		this.add(outline);

		var plane = this.buildPlane();
		this.add(plane);

		this.rotation.set(-Math.PI / 2, 0, 0);
	}

	update(dt) {

	}

	buildPlane() {
		var material = new MeshBasicMaterial({
			color: 0xfafafa
		});
		var geometry = new PlaneGeometry(150, 150, 1, 1);
		var mesh = new Mesh(geometry, material);

		return mesh;
	}

	buildData() {
		this.data = new Array(3);
		this.data[0] = [1, -5];
		this.data[1] = [1, 1];

		var x = 20;
		this.data[2] = [20, 1.25];

		var y = this.data[2][1];
		var i = 3;
		while (x > 2) {
			x -= (this.random.inRange(0, 1)-0.2) * 4;
			y += this.random.inRange(1.5, 5);
			//console.log(x);
			this.data.push([x, y]);
			i++;
		}
	}

	buildOutline() {
		var geometry = new Geometry();

		var prevX = 0;
		var prevY = -5;

		var leftSide = [];
		var rightSide = [];
		for (var i = 0; i < this.data.length; i++) {
			var point = this.data[i];
			var [x, y] = point;
			//console.log(x, y);
			if (i == this.data.length - 1) x = 0;


			leftSide.push(new Vector3(-prevX, prevY, 0));
			rightSide.push(new Vector3(prevX, prevY, 0));

			leftSide.push(new Vector3(-x, y, 0));
			rightSide.push(new Vector3(x, y, 0));

			prevX = x;
			prevY = y;
		}

		geometry.vertices = leftSide.concat(rightSide.reverse());
		geometry.computeLineDistances();

		return new LineSegments(geometry, new LineDashedMaterial({
			color: 0xD61C1C,
			dashSize: 1, gapSize: 0.5,
			linewidth: 5,
		}));
	}

}