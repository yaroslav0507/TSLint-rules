var Car = (function () {
    function Car() {
    }
    Car.prototype.setModel = function (modelName) {
        this.model = modelName;
    };
    return Car;
}());
var myCar = new Car();
myCar.setModel("Lexus");
console.log("Car name: ", myCar.model);
