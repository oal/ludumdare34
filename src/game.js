'use strict';

import {Scene, PerspectiveCamera, WebGLRenderer, Clock, Fog} from 'three';
import {Level} from './level';

class Game {
	constructor() {
		this.setUp();
		this.isPaused = true;
		this.start();
	}

	setUp() {
		this.scene = new Scene();

		var skyColor = 0xC4FCFF;
		var fog = new Fog(skyColor, 10, 100);
		this.scene.fog = fog;

		this.camera = new PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.setY(10);
		this.camera.position.setZ(10);
		this.camera.rotation.set(-Math.PI/6, 0, 0);

		this.renderer = new WebGLRenderer();
		this.renderer.setClearColor(skyColor);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.clock = new Clock();

		this.level = new Level();
		this.scene.add(this.level);

		this.skipFrame = true;
	}

	start() {
		this.togglePause();
	}

	togglePause() {
		if (this.isPaused) {
			this.clock.start();
			this.isPaused = false;
			this.render();
		} else {
			this.isPaused = true;
			this.clock.stop();
		}
	}

	render() {
		if (this.isPaused) return;

		//this.skipFrame = !this.skipFrame;
		//if(this.skipFrame) return;

		this.dt = this.clock.getDelta();

		this.level.position.setZ(this.level.position.z+this.dt*10);
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render.bind(this));
	}
}

new Game();