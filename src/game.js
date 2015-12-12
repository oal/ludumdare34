'use strict';

import {Scene, WebGLRenderer, Clock, Fog, DirectionalLight, AmbientLight} from 'three';
import {Level} from './level';
import {Player} from './player';

class Game {
	constructor() {
		this.setUp();
		this.isPaused = true;
		this.start();
	}

	setUp() {
		this.scene = new Scene();
		this.setUpLights();

		var skyColor = 0xC4FCFF;
		var fog = new Fog(skyColor, 10, 100);
		this.scene.fog = fog;


		this.renderer = new WebGLRenderer();
		this.renderer.setClearColor(skyColor);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.clock = new Clock();

		this.level = new Level();
		this.scene.add(this.level);

		this.player = new Player(this.level);

		this.scene.add(this.player);

		this.skipFrame = true;

		this.setUpControls();
	}

	setUpLights() {
		var ambientLight = new AmbientLight(0x999999);
		this.scene.add(ambientLight);

		var directionalLight = new DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(0, 1, 0);
		this.scene.add(directionalLight);
	}

	setUpControls() {
		this.keysPressed = [];
		document.addEventListener('keydown', (e) => {
			e.preventDefault();
			if (this.keysPressed.indexOf(e.keyCode) != -1) return;
			this.keysPressed.push(e.keyCode);
		});
		document.addEventListener('keyup', (e) => {
			e.preventDefault();
			var keyIndex = this.keysPressed.indexOf(e.keyCode);
			if (keyIndex == -1) return;
			this.keysPressed.splice(keyIndex, 1);
		});
	}

	start() {
		this.togglePause();
	}

	togglePause() {
		if (this.isPaused) {
			this.clock.start();
			this.isPaused = false;
			this.update();
		} else {
			this.isPaused = true;
			this.clock.stop();
		}
	}

	update() {
		if (this.isPaused) return;

		var dt = this.clock.getDelta();
		this.level.update(dt);
		this.player.update(dt, this.keysPressed);
		this.render();
		requestAnimationFrame(this.update.bind(this));
	}

	render() {
		this.renderer.render(this.scene, this.level.camera);
	}
}

new Game();