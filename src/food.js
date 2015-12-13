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

		this.velocity = -0.11;

	}

	update(dt) {

	}
}