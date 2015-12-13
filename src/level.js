import {
	Object3D,
	Geometry,
	MeshBasicMaterial,
	Vector3, Face3, Color, LineSegments, LineDashedMaterial,
	Mesh, PlaneGeometry,
	PerspectiveCamera
} from 'three';

import {Random} from './random';
import {Food} from './food';

export class Level extends Object3D {
	constructor(models, textures, player) {
		super();

		this.player = player;
		this._plant = models.plant;
		this._dirtTexture = textures.dirt;
		this._size = 14;
		this.random = new Random(Math.random());
		this.food = [];

		var outline = this.buildOutline();
		this.add(outline);

		var plane = this.buildPlane();
		this.add(plane);

		this.addCamera();
	}

	addCamera() {
		this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.setX(6);
		this.camera.position.setY(17);
		this.camera.position.setZ(21);

		this.camera.lookAt(new Vector3(0, 0, 0));
	}

	update(dt) {
		var tailPos = this.player.getTailPosition();
		for (var i = 0; i < this.food.length; i++) {
			var plant = this.food[i];
			if (plant.scale.x < 0) this.food.splice(i, 1);
			if (plant.position.distanceTo(tailPos) < 1) {
				plant.kill();
				this.player.addPart();
			}
			plant.update(dt);
		}

		if (this.food.length < 10) {
			this.addFood();
		}
	}

	addFood() {
		var food = new Food(
			this._plant,
			this.random.inRange(-this._size + 2, this._size - 2),
			this.random.inRange(-this._size + 2, this._size - 2)
		);
		this.food.push(food);
		this.add(food);
	}

	buildPlane() {
		var material = new MeshBasicMaterial({
			color: 0xffffff,
			map: this._dirtTexture
		});
		var geometry = new PlaneGeometry(this._size * 2, this._size * 2, 1, 1);
		var mesh = new Mesh(geometry, material);
		mesh.rotation.set(-Math.PI / 2, 0, 0);

		return mesh;
	}

	buildOutline() {
		var geometry = new Geometry();

		geometry.vertices.push(new Vector3(-this._size, 0.1, -this._size));
		geometry.vertices.push(new Vector3(-this._size, 0.1, this._size));

		geometry.vertices.push(new Vector3(-this._size, 0.1, this._size));
		geometry.vertices.push(new Vector3(this._size, 0.1, this._size));

		geometry.vertices.push(new Vector3(this._size, 0.1, this._size));
		geometry.vertices.push(new Vector3(this._size, 0.1, -this._size));

		geometry.vertices.push(new Vector3(this._size, 0.1, -this._size));
		geometry.vertices.push(new Vector3(-this._size, 0.1, -this._size));

		geometry.computeLineDistances();

		return new LineSegments(geometry, new LineDashedMaterial({
			color: 0xD61C1C,
			dashSize: 1, gapSize: 0.5,
			linewidth: 5,
		}));
	}

}