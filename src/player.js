import {Object3D, Mesh, BoxGeometry, SphereGeometry, MeshPhongMaterial, Vector3} from 'three';

export class Player extends Object3D {
	constructor(level) {
		super();

		this.level = level;

		this._material = new MeshPhongMaterial({
			color: 0x1E9C08
		});
		this._sphere = new SphereGeometry(0.45, 8, 3);


		this.bridgeMode = 0;
		this.head = null;
		this.tail = null;
		this.numParts = 0;
		this.addPart();
		this.addPart();
		this.addPart();
		this.addPart();

		this.updateMatrixWorld(true);

		this.curl = 0;
		this.angle = 0;
	}

	addPart() {
		var geom = new BoxGeometry(0.5, 1, 0.5);
		for (var i = 0; i < geom.vertices.length; i++) {
			var vertex = geom.vertices[i];
			vertex.y += 0.5;
		}
		if (this.head !== null) {
			geom.merge(this._sphere);
		}
		var mesh = new Mesh(geom, this._material);

		if (this.head === null) {
			this.head = mesh;
			this.add(mesh);
		}
		else {
			this.tail.add(mesh);
			this.tail.next = mesh;
			mesh.position.y = 1;
		}
		this.tail = mesh;
		this.numParts++;

	}

	changeVelocity(delta) {
		this.velocity += delta;
	}


	updateCurl(dt) {
		var tmp = this.head.next;
		var delta = dt * this.curl;

		var maxCurl = Math.PI / (this.numParts - 1);

		while (tmp) {
			tmp.rotation.x += delta;
			if (tmp.rotation.x > maxCurl) tmp.rotation.x = maxCurl;
			else if (tmp.rotation.x < -maxCurl) tmp.rotation.x = -maxCurl;
			tmp = tmp.next;
			delta = delta * 0.9;
		}
		this.curl *= 0.9
	}

	flipCurls() {
		var tmp = this.head.next;
		while (tmp) {
			tmp.rotation.x = -tmp.rotation.x;
			console.log(tmp.rotation.x)
			tmp = tmp.next;
		}
	}

	update(dt, keysPressed) {
		this.bridgeMode = 0;
		for (var i = 0; i < keysPressed.length; i++) {
			//console.log(keysPressed);
			var keyCode = keysPressed[i];
			if (keyCode == 37) {
				this.angle += 15 * dt;
			}
			if (keyCode == 39) {
				this.angle -= 15 * dt;
			}
			if (keyCode == 38) {
				this.curl -= 10 * dt;
			}
			if (keyCode == 40) {
				this.curl += 10 * dt;
			}
		}

		var tailPos = this.tail.localToWorld(new Vector3(0, 0, 0));
		if (tailPos.y === 1 && this.bridgeMode === 0) {
			this.head.position.set(tailPos.x, 0, tailPos.z);

			//this.head.rotation.y += Math.PI;
			this.bridgeMode = 0;
			this.flipCurls();

			if (this.tail.rotation.x < 0) this.bridgeMode = -1;
			else this.bridgeMode = 1;
		}

		this.updateCurl(dt);
		this.head.rotation.y += this.angle * dt;
		this.angle *= 0.9;
	}
}