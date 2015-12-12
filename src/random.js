export class Random {
	constructor(seed) {
		this.seed = seed;
	}

	inRange(a, b) {
		var x = Math.sin(this.seed++) * 10000;
		return a + (b - a) * (x - Math.floor(x));
	}
}