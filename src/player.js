import {
	Object3D,
	Mesh,
	PlaneGeometry,
	BoxGeometry,
	SphereGeometry,
	MeshPhongMaterial,
	MeshBasicMaterial,
	Vector3
} from 'three';

export class Player extends Object3D {
	constructor(models, textures) {
		super();

		this._material = new MeshPhongMaterial({
			color: 0x9C0324
		});

		this._bodyGeometry = models.body;
		this._targetTexture = textures.target;

		this.bridgeMode = 0;
		this.head = null;
		this.tail = null;
		this.numParts = 0;
		this.addPart();
		this.addPart();
		this.addPart();
		this.addPart();

		this.addTarget();

		this.curl = 0;
		this.angle = 0;

		this.hungerStr = '100';
		this.hunger = 100.0;
	}

	getTailPosition() {
		return this.tail.localToWorld(new Vector3(0, 1, 0));
	}

	addPart() {
		var mesh = new Mesh(this._bodyGeometry, this._material);

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
		this.hunger = 100;

		this.updateMatrixWorld(true);

		document.getElementById('score').innerHTML = '' + this.numParts;
	}

	addTarget() {
		var geom = new PlaneGeometry(1, 1, 1);
		var material = new MeshBasicMaterial({
			map: this._targetTexture,
			transparent: true
		});
		var mesh = new Mesh(geom, material);
		mesh.position.y = 0.01;
		mesh.rotation.x = -Math.PI / 2;
		this.add(mesh);
		this.target = mesh;
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
		this.curl *= 0.95
	}

	flipCurls() {
		var tmp = this.head.next;
		while (tmp) {
			tmp.rotation.x = -tmp.rotation.x;
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

		if (keysPressed.indexOf(38) === -1 && keysPressed.indexOf(40) === -1) {
			this.curl += (Math.PI - this.curl) * (Math.random() - 0.5) * dt;
		}

		var tailPos = this.tail.localToWorld(new Vector3(0, 0, 0));
		if (tailPos.y < 1.05 && this.bridgeMode === 0) {
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

		this.hunger -= (dt * this.numParts * 0.7);
		var newHungerStr = '' + parseInt(this.hunger);
		if (newHungerStr !== this.hungerStr) {
			this.hungerStr = newHungerStr;
			document.getElementById('hunger').innerHTML = newHungerStr;
		}

		var ltw = this.tail.localToWorld(new Vector3(0,0,0));
		this.target.position.setX(ltw.x + this.position.x);
		this.target.position.setZ(ltw.z + this.position.z);
		this.target.material.opacity = Math.max(0, 0.7-(ltw.y/this.numParts));
	}
}

// halv/pi = r