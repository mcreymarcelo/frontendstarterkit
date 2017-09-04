// Main JS
import { sum } from './modules/mod_sum';

const main = `This is the main JS file`;

class Sample {
	constructor(x,y){
		this.x = x;
		this.y = y;

		this.render();
	}

	render(){
		return this.x + this.y;
	}
}

const x = sum(5,10);
console.log(x);

const y = sum(1000,100244566345);
console.log(y);
