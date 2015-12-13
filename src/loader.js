import {BufferGeometryLoader, JSONLoader, TextureLoader} from 'three';

export class Loader {
	constructor(names, textures, sounds, cb) {
		this.models = {};
		this.textures = {};
		this.sounds = {};


		this._cb = cb;
		this._numLoaded = 0;
		this._totalFiles = names.length + textures.length;

		var loader = new JSONLoader();
		for (var i = 0; i < names.length; i++) {
			var name = names[i];
			var f = (n) => {
				loader.load(`models/${n}.json`, (geometry) => {
					this.models[n] = geometry;
					this._incCounter()
				})
			};
			f(name);

		}

		var textureLoader = new TextureLoader();
		for (i = 0; i < textures.length; i++) {
			var texture = textures[i];
			var g = (n) => {
				textureLoader.load(`images/${n}`, (tex) => {
					this.textures[n.split('.')[0]] = tex;
					this._incCounter()
				})
			};
			g(texture);
		}

		for (i = 0; i < sounds.length; i++) {
			var sound = sounds[i];
			this.sounds[sound] = new Audio(`sound/${sound}.wav`);
		}

	}

	_incCounter() {
		this._numLoaded++;
		if (this._numLoaded === this._totalFiles) {
			console.log('done')
			this._cb(this.models, this.textures, this.sounds);
		}
	}
}