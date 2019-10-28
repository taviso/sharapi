class Radmath {}

Radmath.Vector = class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this._vector = Memory.alloc(4 * 3);
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get x() {
        return this._vector.add(2 * 4).readFloat();
    }
    set x(value) {
        return this._vector.add(2 * 4).writeFloat(value)
    }
    get y() {
        return this._vector.add(0 * 4).readFloat();
    }
    set y(value) {
        return this._vector.add(0 * 4).writeFloat(value)
    }
    get z() {
        return this._vector.add(1 * 4).readFloat();
    }
    set z(value) {
        return this._vector.add(1 * 4).writeFloat(value);
    }
    get addr() {
        return this._vector;
    }
    toArray() {
        return [ this.x, this.y, this.z ];
    }
}

