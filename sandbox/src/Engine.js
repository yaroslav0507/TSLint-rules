"use strict";
var Engine = (function () {
    function Engine() {
        this.started = false;
    }
    Engine.prototype.getVolume = function () {
        return this.volume;
    };
    Engine.prototype.start = function () {
        this.started = true;
    };
    Engine.prototype.stop = function () {
        this.started = false;
    };
    return Engine;
}());
exports.Engine = Engine;
