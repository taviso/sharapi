import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"

export class Vector extends Base {
    constructor(x?: number | NativePointer, y = 0, z = 0) {
        if (x instanceof NativePointer) {
            super(x);
            return;
        }

        if (x == undefined) {
            x = 0;
        }

        super(Memory.alloc(4 * 3));

        this.x = x;
        this.y = y;
        this.z = z;
    }

    get x(): number {
        return this.ptr.add(2 * 4).readFloat();
    }
    set x(value: number) {
        this.ptr.add(2 * 4).writeFloat(value)
    }
    get y(): number {
        return this.ptr.add(0 * 4).readFloat();
    }
    set y(value: number) {
        this.ptr.add(0 * 4).writeFloat(value)
    }
    get z(): number {
        return this.ptr.add(1 * 4).readFloat();
    }
    set z(value: number) {
        this.ptr.add(1 * 4).writeFloat(value);
    }
    toArray(): Array<number> {
        return [ this.x, this.y, this.z ];
    }
}

export class Radmath {
    static Vector = Vector;
}
