import { Base } from "./Base"
import { Vector, Box3D, Sphere } from "./Radmath"
import { SimState } from "./Sim"
import { Names } from "./Names"

/**
 * A Dynamic Physics Object.
 */
export class InstDynaPhysDSG extends Base {
    constructor(ptr: NativePointer) {
        super(ptr);
    }

    getUniqueId(): UInt64 {
        return this.ptr.add(8).readU64();
    }

    getName(): string {
        return Names.lookupUid(this.getUniqueId());
    }

    Display(): number {
        return this.callVirtual<number>(3, 'int');
    }

    ProcessShaders(): void {
        return; // 4
    }

    GetBoundingBox(): Box3D {
        let boundingBox = new Box3D();
        this.callVirtual<void>(5, 'pointer', ['pointer'], boundingBox.toPointer());
        return boundingBox;
    }

    GetBoundingSphere(): Sphere {
        let boundingSphere = new Sphere();
        this.callVirtual<void>(6, 'pointer', ['pointer'], boundingSphere.toPointer());
        return boundingSphere;
    }

    get pPosition(): NativePointer {
        return this.callVirtual<NativePointer>(7, 'pointer');
    }

    get rPosition(): NativePointer {
        return this.callVirtual<NativePointer>(8, 'pointer');
    }

    SetShadowSkin(): void {
        return; // 9
    }

    SetShadowMesh(): void {
        return; // 10
    }

    CastsShadow(): boolean {
        return this.callVirtual<boolean>(11, 'bool');
    }

    DisplayShadow(): void {
        this.callVirtual<void>(12);
    }

    DisplaySimpleShadow(): void {
        this.callVirtual<void>(13);
    }

    RenderUpdate(): void {
        return; // 14
    }

    SetShader(): void {
        return; // 15
    }

    GetPosition(): Vector {
        let position = new Vector();
        this.callVirtual(16, 'pointer', ['pointer'], position.toPointer());
        return position;
    }

    SetRank(x: Vector, y: Vector):void {
        this.callVirtual<void>(17, 'void', [
                'pointer',
                'pointer'
            ], x.toPointer(), y.toPointer());
    }

    PreReactToCollision(): void {
        return; // 18
    }
    PostReactToCollision(): void {
        return; // 19
    }
    
    GetAIRef(): number {
        return this.callVirtual<number>(20, 'uint32');
    }

    OnSetSimState(): void {
        return; // 21
    }
    
    GetSimState(): SimState {
        return new SimState(this.callVirtual<NativePointer>(22, 'pointer'));
    }

    get mpSimState(): SimState {
        return new SimState(this.callVirtual<NativePointer>(23, 'pointer'));
    }

    SetShadow(): void {
        return; // 24
    }
    
    RecomputeShadowPosition(pos: number): void {
        this.callVirtual<void>(25, 'void', ['float'], pos);
    }

    RecomputeShadowPositionNoIntersect(p: number, v: Vector, x: number, y: number): void {
        this.callVirtual<void>(26, 'void', [
                'float',
                'pointer',
                'float',
                'float'
            ], p, v.toPointer(), x, y);
    }

    SetInternalState(): number {
        return this.callVirtual<number>(27, 'uint32');
    }

    Update(f: number): void {
        this.callVirtual<void>(28, 'void', ['float'], f);
    }

    FetchGroundPlane(): void {
        return; // 29
    }
    
    FreeGroundPlane(): void {
        return; // 30
    }

    IsAtRest(): boolean {
        return this.callVirtual<boolean>(31, 'bool');
    }

    RestTest(): void {
        this.callVirtual<void>(32);
    }

    OnTransitToAICtrl(): void {
        return; // 33
    }

    GetGroundPlaneIndex(): number {
        return this.callVirtual<number>(34, 'uint32');
    }

    AddToSimulation(): void {
        this.callVirtual<void>(35);
    }

    ApplyForce(direction: Vector, magnitude: number): void {
        this.callVirtual<void>(36, 'void', [
                "pointer",
                "float"
            ], direction.toPointer(), magnitude);
    }

    Break(): boolean {
        return this.callVirtual<boolean>(37, 'bool');
    }
}

/*
var i = new IntersectManager();
var e = i.FindDynaPhysElems(new Vector(), 200);
e.toArray()
*/