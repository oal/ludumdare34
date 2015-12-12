import {Object3D, Mesh, SphereGeometry, MeshLambertMaterial, PerspectiveCamera} from 'three';

export class Player extends Object3D {
	constructor(level) {
		super();

		this.level = level;

		var ballMaterial = new MeshLambertMaterial({
			color: 0xeeeeee
		});

		this.ball1 = new Mesh(new SphereGeometry(1, 8, 6), ballMaterial);
		this.ball2 = new Mesh(new SphereGeometry(1, 8, 6), ballMaterial);


		this.ball1.position.setX(-1);
		this.ball2.position.setX(1);


		this.add(this.ball1);
		this.add(this.ball2);

		this.initCamera();

		this.ballVelocity = 0.75;
		this.ballAngle = 0.0;
		this.progress = 0.0;
	}

	changeVelocity(delta) {
		this.ballVelocity += delta;
	}

	changeAngle(delta) {
		this.ballAngle += delta;
	}

	initCamera() {
		this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.setY(10);
		this.camera.position.setZ(10);
		this.camera.rotation.set(-Math.PI / 6, 0, 0);

		//this.camera.position.setY(70);
		//this.camera.rotation.set(-Math.PI/2, 0, 0);
		this.add(this.camera);
	}

	calculateLinePoint() {
		var numSegments = this.level.data.length;
		var pos = this.progress * numSegments;
		var segmentIndex = parseInt(pos);

		if (segmentIndex >= numSegments - 1) {
			return [0, 0]
		}

		var s = this.level.data[segmentIndex];
		var s2 = this.level.data[segmentIndex + 1];

		var dx = s2[0] - s[0];
		var dy = s2[1] - s[1];
		var sLength = Math.sqrt(dx * dx + dy * dy);

		var segmentProgress = pos - segmentIndex;
		var x = s[0] + dx * segmentProgress;
		var y = -s[1] - dy * segmentProgress;

		return [x, y, sLength];
	}

	distanceFromLine() {

	}

	update(dt, keysPressed) {
		for (var i = 0; i < keysPressed.length; i++) {
			//console.log(keysPressed);
			var keyCode = keysPressed[i];
			if (keyCode == 37) {
				this.changeAngle(5 * dt);
			}
			if (keyCode == 39) {
				this.changeAngle(-5 * dt);
			}
			if (keyCode == 38) {
				this.changeVelocity(5 * dt);
			}
			if (keyCode == 40) {
				this.changeVelocity(-5 * dt);
			}
		}

		//this.progress += this.ballVelocity * dt;
		//if (this.progress > 1.0) {
		//	return
		//}
		//var [x, z, sLength] = this.calculateLinePoint();
		//this.progress += (this.ballVelocity * dt) / sLength;
		////
		//var oldX = this.ball1.position.x;
		//var oldZ = this.position.z;
		//
		//var dx = x-oldX;
		//var dz = z-oldZ;
		//
		//console.log(Math.sqrt(dx*dx + dz*dz));

		//var ballScale = this.progress/3*2+0.75;
		//this.ball1.scale.set(ballScale, ballScale, ballScale);
		//this.ball2.scale.set(ballScale, ballScale, ballScale);

		this.ball1.position.x += -Math.cos(this.ballAngle) * this.ballVelocity * dt;
		this.position.z += Math.sin(this.ballAngle) * this.ballVelocity * dt;

		this.ball2.position.x += Math.cos(this.ballAngle) * this.ballVelocity * dt;
		this.position.z += Math.sin(this.ballAngle) * this.ballVelocity * dt;


		//this.ball1.position.x = x;
		//this.ball2.position.x = -x;

		var ballScale = 1;
		this.ball1.position.y = ballScale;
		this.ball2.position.y = ballScale;

		//this.position.z = z;

		//this.ball1.position.z += 1/incline*dt;

		//this.ball2.position.x = s[0];
		//this.ball2.position.z = -s[1];
	}
}