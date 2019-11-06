import { Base } from "./Base"
import { Vector, Box3D, Sphere } from "./Radmath"

export class SimState extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    SetHasMoved(hasMoved: boolean): boolean {
        return this.callVirtual<boolean>(3, 'bool', ['bool'], hasMoved);
    }

    AddVirtualCM(x: number, y: number): number {
        return this.callVirtual<number>(4, 'uint32', ['int', 'uint'], x, y);
    }

    InitVirtualCM(x: number): number {
        return this.callVirtual<number>(5, 'uint32', ['int'], x);
    }

    InitAllVirtualCM(): void {
        this.callVirtual<void>(6);
    }

    GetVirtualCM(unused = 0): NativePointer {
        return this.callVirtual<NativePointer>(7, 'pointer', ['int'], unused);
    }

    AddCacheToVirtualCM(x: Vector, y: Vector, z: number): void {
        this.callVirtual<void>(8, 'void', [
                "pointer",
                "pointer",
                "float"],
            x.toPointer(),
            y.toPointer(),
            z);
    }

    GetTransform(unused = 0): NativePointer {
        return this.callVirtual<NativePointer>(9, 'pointer', ['int'], unused);
    }

    GetPosition(unused = 0): Vector {
        return new Vector(this.callVirtual<NativePointer>(10, 'pointer', ['int'], unused));
    }

    SetTransform() {
        return; // 11
    }

    ResetVelocities(): void {
        this.callVirtual<void>(12);
    }

    GetVelocity(a: Vector, unused = 0): Vector {
        let velocity = new Vector();
        this.callVirtual<NativePointer>(13, 'void', [
                'pointer',
                'pointer',
                'int',
            ], a.toPointer(), velocity.toPointer(), unused);
        return velocity;
    }

    GetSimulatedObject(unused = 0): NativePointer {
        return this.callVirtual<NativePointer>(14, 'pointer', ['int'], unused);
    }

    DebugDisplay(val: number) : number {
       return this.callVirtual<number>(15, 'int', ["int"], val);
    }

    RequiresPushTransForDisplay(): Boolean {
        return true; // 16
    }

    DynamicPositionAdjustment(a: Vector, b: number, c: boolean) {
        this.callVirtual<void>(17, 'void', [
                'pointer',
                'float',
                'int'
        ], a.toPointer(), b, c);
    }

    SetSimulatedObject() {
        return; // 18
    }
    SetCollisionObject() { 
        return; // 19
    }

}

export class sim {
    static SimState = SimState;
}