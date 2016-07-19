const one = 1;
const two = 2;
const three = 3;
const four = 4;

export { Engine, one, two, three, four };

interface IT {
	a: string;
}

/**
 * @returns void
 * @param { number} age asdasd
 * @param { string } name -asad asd
 * @param {boolean} male //asdasd
 */
export function num(age: number, name: string, male: boolean): void {
	console.log(num);
}

/**
 * @interface IEngine
 */
export interface IEngine {
	volume: number;
	started: boolean;
}

/**
 * @class Engine
 */
class Engine implements IEngine {
	/**
	 * @type {number}
	 */
	public volume: number;

	/**
	 *
	 * @type {boolean}
	 */
	public started: boolean = false;

	/**
	 * sadasd
	 * @param {boolean} some adsda sasd as /// asd asd
	 * @returns {string} asdasd
	 */
	public start(some: boolean): string {
		this.started = true;
		return "";
	}

	/**
	 * @returns {number} something
	 */
	public stop(): number {
		this.started = false;
		return Math.random();
	}
}

function stub(): void {
	console.log("I am a stub function");
}

// let a = () => {
//     console.log(2);
// };
//
// let b = function(): void {
//     console.log(3);
// };

stub();
