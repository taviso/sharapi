import "./frida"
import { Base } from "./Base"

export class Box3D extends Base {
    constructor(minPos?: NativePointer | Vector, maxPos?: Vector) {
        if (minPos instanceof NativePointer) {
            super(minPos);
            return;
        }
        super(Memory.alloc(4 * 3 * 2));
        
        if (minPos !== undefined)
            this.minPos = minPos;
        if (maxPos !== undefined)
            this.maxPos = maxPos;
    }

    get minPos(): Vector {
        return new Vector(this.ptr);
    }
    get maxPos(): Vector {
        return new Vector(this.ptr.add(4 * 3));
    }
    set minPos(value: Vector) {
        this.minPos.x = value.x;
        this.minPos.y = value.y;
        this.minPos.z = value.z;
    }
    set maxPos(value: Vector) {
        this.maxPos.x = value.x;
        this.maxPos.y = value.y;
        this.maxPos.z = value.z;
    }

    toArray(): Array<Vector> {
        return [ this.minPos, this.maxPos ];
    }
}

export class Sphere extends Base {
    spherePosition: Vector;

    constructor(position?: Vector | NativePointer, radius = 0) {
        if (position instanceof NativePointer) {
            super(position);
            return;
        }
        super(Memory.alloc(4 * 3 + 4));
        
        this.spherePosition = new Vector(position?.toPointer());
        this.radius = radius;
    }

    get position(): Vector {
        return this.spherePosition;
    }

    get radius(): number {
        return this.ptr.add(3 * 4).readFloat();
    }

    set position(value: Vector) {
        this.spherePosition.x = value.x;
        this.spherePosition.y = value.y;
        this.spherePosition.z = value.z;
    }
    set radius(value: number) {
        this.ptr.add(3 * 4).writeFloat(value);
    }
}

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
        return this.ptr.add(0 * 4).readFloat();
    }
    set x(value: number) {
        this.ptr.add(0 * 4).writeFloat(value)
    }
    get y(): number {
        return this.ptr.add(1 * 4).readFloat();
    }
    set y(value: number) {
        this.ptr.add(1 * 4).writeFloat(value)
    }
    get z(): number {
        return this.ptr.add(2 * 4).readFloat();
    }
    set z(value: number) {
        this.ptr.add(2 * 4).writeFloat(value);
    }

    /**
     * Compare two vector values.
     * @param v Vector to compare to.
     * @param delta Small difference allowed, set to zero for strict equality.
     */
    equals(v: Vector, delta=0.01): boolean {
        return (Math.abs(this.x - v.x) < delta)
            && (Math.abs(this.y - v.y) < delta)
            && (Math.abs(this.z - v.z) < delta);
    }

    /**
     * Find the euclidean distance between two points.
     * @param v Point to compare.
     * @param overGround Ignore height, for example when walking towards an aircraft position.
     */
    distanceTo(v: Vector, overGround = false): number {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        let dz = this.z - v.z;

        if (overGround)
            dy = 0;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    toArray(): Array<number> {
        return [ this.x, this.y, this.z ];
    }

    toString(): string {
        return `(${Math.round(this.x)}, ${Math.round(this.y)}, ${Math.round(this.z)})`;
    }
}



export class Radmath {
    static Vector = Vector;
    static Box3D = Box3D;
    static Sphere = Sphere;
}
