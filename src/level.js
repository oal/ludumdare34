import {Mesh, Geometry, MeshBasicMaterial, Vector3, Face3, Color, FaceColors} from 'three';

import {Random} from './random';

export class Level extends Mesh {
	constructor() {
		var material = new MeshBasicMaterial({
			color: 0xD61C1C
		});
		super(new Geometry(), material);

		this.random = new Random(Math.random());

		this.buildData();
		this.geometry = this.buildGeometry();

		this.rotation.set(-Math.PI / 2, 0, 0);
	}

	buildData() {
		this.data = new Array(4);
		this.data[0] = [0, 0];
		this.data[1] = [0, 10];
		this.data[2] = [1, 10.5];
		this.data[3] = [1, 12];

		var x = 20;
		var y = this.data[3][1];
		var i = 4;
		while (x > 2) {
			x -= (this.random.inRange(i * 0.25, i * 0.5) - i * 0.3);
			y += this.random.inRange(1.5, 2.5);
			console.log(x);
			this.data.push([x, y]);
			i++;
		}

		this.data.push([0, this.data[i - 1][1] + 1]);
		this.data.push([0, this.data[i][1] + 10]);
	}

	buildGeometry() {
		var geometry = new Geometry();

		var prevX = 0;
		var prevY = 0;
		for (var i = 0; i < this.data.length; i++) {
			var point = this.data[i];
			var [x, y] = point;
			console.log(x, y);
			if (i == this.data.length - 1) x = 0;
			geometry.vertices.push(
				new Vector3(-150, y, 0),
				new Vector3(-x, y, 0),

				new Vector3(150, y, 0),
				new Vector3(x, y, 0)
			);

			if (i > 0) {
				geometry.faces.push(new Face3(i * 4, i * 4 - 3, i * 4 + 1));
				geometry.faces.push(new Face3(i * 4, i * 4 - 4, i * 4 - 3));

				geometry.faces.push(new Face3(i * 4 + 2, i * 4 + 3, i * 4 - 1));
				geometry.faces.push(new Face3(i * 4 + 2, i * 4 - 1, i * 4 - 2));
			}


			prevY = y;
		}

		geometry.colorsNeedUpdate = true;


		geometry.computeBoundingSphere();

		console.log(geometry);

		return geometry;
	}
}