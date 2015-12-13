import {Mesh, SphereGeometry, MeshPhongMaterial, Vector3} from 'three';

export class Food extends Mesh {
	constructor(plant, x, z) {
		var material = new MeshPhongMaterial({
			color: 0x1E9C08
		});
		super(plant, material);

		this.position.x = x;
		this.position.y = 0;
		this.position.z = z;

		this.growth = 1;
		this.scale.set(0, 0, 0);

		this.rotation.y = Math.random() * Math.PI * 2
		this.receiveShadow = true
		this.castShadow = true;

	}

	update(dt) {
		if (this.growth === 0) return;
		if (this.scale.x < 0) this.parent.remove(this);

		this.rotation.y += dt*this.growth;

		var s = this.scale.x;
		s += dt * this.growth;
		if (s > 1.0) this.growth = 0;

		this.scale.set(s, s, s);
	}

	kill() {
		this.growth = -5;
	}
}