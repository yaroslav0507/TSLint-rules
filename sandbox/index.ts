import { Engine, IEngine } from "./src/Engine";

interface ICar {
    model: string;
    engine: IEngine;
}

class Car implements ICar {
    public model: string;
    public engine: IEngine;

    constructor() {
        this.engine = new Engine();
    }

    public setModel(modelName: string): void {
        this.model = modelName;
    }

    public drive(): void {
        console.log(this.engine);
    }
}

const myCar = new Car();
myCar.setModel("Lexus");

console.log("Car name: ", myCar.model);
