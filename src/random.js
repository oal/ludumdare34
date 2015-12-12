export class Random {
	constructor(seed) {
		this.seed = seed;
	}

	inRange(a, b) {
		var x = Math.sin(this.seed++) * 10000;
		var val = a + (b - a) * (x - Math.floor(x));
		//console.log(a, b, val);
		return val;
	}
}