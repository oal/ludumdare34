import {Mesh, SphereGeometry, MeshPhongMaterial, Vector3} from 'three';

export class Food extends Mesh {
	constructor(x, z) {
		var geometry = new SphereGeometry(0.5, 8, 4);
		var material = new MeshPhongMaterial({
			color: 0xaa0000
		});
		super(geometry, material);

		this.position.x = x;
		this.position.y = 0;
		this.position.z = z;

		this.velocity = -0.11;

	}

	update(dt) {

	}
}