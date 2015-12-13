'use strict';

import {Scene, WebGLRenderer, Clock, Fog, DirectionalLight, AmbientLight} from 'three';
import {Level} from './level';
import {Player} from './player';
import {Loader} from './loader';

class Game {
	constructor() {
		new Loader(['body', 'joint', 'plant'], ['target.png', 'dirt.jpg'], (models, textures) => {
			this.models = models;
			this.textures = textures;
			this.setUp();
		});

	}

	setUp() {
		this.scene = new Scene();
		this.setUpLights();

		var skyColor = 0xC4FCFF;
		var fog = new Fog(skyColor, 10, 100);
		this.scene.fog = fog;


		this.renderer = new WebGLRenderer();
		this.renderer.setClearColor(0x37BF0A);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.clock = new Clock();

		this.player = new Player(this.models, this.textures);
		this.scene.add(this.player);

		this.level = new Level(this.models, this.textures, this.player);
		this.scene.add(this.level);


		this.skipFrame = true;

		this.setUpControls();

		this.isPaused = true;
		this.start();
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

	gameOver() {
		this.isPaused = true;
		document.getElementById('finalscore').innerHTML = this.player.numParts;
		var tweet = encodeURIComponent(`I got a Crazy Slinky Snake score of ${this.player.numParts}! How much can you eat? #LDJAM http://static.olav.it/LD34/ via @lindekleiv`);
		document.getElementById('tweet').href = 'https://twitter.com/intent/tweet?text=' + tweet;
		document.getElementById('gameover').style.display = 'block';
	}

	update() {
		var dt = this.clock.getDelta();
		if (this.isPaused) return;
		if (this.player.hunger <= 0) this.gameOver();

		this.level.update(dt);
		this.player.update(dt, this.keysPressed);
		this.render();
		requestAnimationFrame(_ => this.update(this));
	}

	render() {
		this.renderer.render(this.scene, this.level.camera);
	}
}


document.getElementById('start').onclick = function () {
	new Game();
	document.getElementById('intro').style.display = 'none';
};