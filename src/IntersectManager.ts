import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vector } from "./Radmath"
import { RoadSegment } from "./RoadSegment"

export class ReserveArray extends Base {
    private array: NativePointer;

    constructor(n?: NativePointer | number) {
        if (n instanceof NativePointer) {
            super(n);
            return;
        }
        if (n === undefined) {
            super(Memory.alloc(0xC));
            this.ptr.add(0).writeU32(0);
            this.ptr.add(4).writeU32(0);
            this.ptr.add(8).writePointer(NULL);
            return;
        }

        super(Memory.alloc(0xC));

        this.array = Memory.alloc(n * 4)
        this.ptr.add(0).writeU32(n);
        this.ptr.add(4).writeU32(0);
        this.ptr.add(8).writePointer(this.array);
    }

    get maxOccupancy(): number {
        return this.ptr.add(0).readU32();
    }

    get currentOccupancy(): number {
        return this.ptr.add(4).readU32();
    }

    getIndex(index: number): NativePointer {
        return this.ptr.add(8).readPointer().add(index * 4).readPointer();
    }

    toArray(): Array<NativePointer> {
        let all: Array<NativePointer> = [];
        for (let i: number = 0; i < this.currentOccupancy; i++)
            all.push(this.getIndex(i));
        return all;
    }
}

export class PhysDSG extends Base {
    constructor(ptr: NativePointer) {
        super(ptr);
    }

    GetPosition(): Vector {
        let _GetPosition = Symbols.find("StaticPhysDSG::GetPosition");
        let position = new Vector();
        _GetPosition(this.ptr, position.toPointer())
        return position;
    }
}

export class DynaPhysDsg extends Base {
    constructor(ptr: NativePointer) {
        super(ptr);
    }

    IsAtRest(): boolean {
        let _IsAtRest = Symbols.find("DynaPhysDSG::IsAtRest");
        return _IsAtRest(this.ptr);
    }

    ApplyForce(direction: Vector, magnitude: number) {
        let _ApplyForce = Symbols.find("DynaPhysDSG::ApplyForce");
        _ApplyForce(this.ptr, direction.toPointer(), magnitude);
    }

    GetPosition(): Vector {
        let _GetPosition = Symbols.find("StaticPhysDSG::GetPosition");
        let position = new Vector();
        _GetPosition(this.ptr, position.toPointer())
        return position;
    }
}

export class AnimCollisionEntityDSG extends Base {
    constructor(ptr: NativePointer) {
        super(ptr);
    }

    GetPosition(): Vector {
        let _GetPosition = Symbols.find("AnimCollisionEntityDSG::GetPosition");
        let  position = new Vector();
        _GetPosition(this.ptr, position.toPointer());
        return position;
    }
}


export class IntersectManager extends Base {
    //static _FindClosestAnyRoad;
    //static _FindFenceElems;
    //static _FindRoadSegmentElems;
    //static _FindPathSegmentElems;
    //static _FindIntersection;

    constructor() {
        super(IntersectManager.GetInstance());
    }

    static GetInstance(): NativePointer {
        let _GetInstance = Symbols.find("IntersectManager::GetInstance");
        return _GetInstance();
    }

    FindClosestRoad(position: Vector, sphereRadius: number): RoadSegment {
        let _FindClosestRoad = Symbols.find("IntersectManager::FindClosestRoad");
        let segment = Memory.alloc(4).writePointer(NULL);
        let distance = Memory.alloc(4).writeFloat(0);

        _FindClosestRoad(this.ptr,
                         position.toPointer(),
                         sphereRadius,
                         segment,
                         distance);
        return new RoadSegment(segment.readPointer());
    }

    FindStaticPhysElems(position: Vector, maxDistance: number): ReserveArray {
        let _FindStaticPhysElems = Symbols.find("IntersectManager::FindStaticPhysElems");
        let nodes = new ReserveArray(NULL);

        _FindStaticPhysElems(this.ptr,
                             nodes.toPointer(),
                             position.toPointer(),
                             maxDistance);
        return nodes;
    }

    FindDynaPhysElems(position: Vector, maxDistance: number): ReserveArray {
        let _FindDynaPhysElems = Symbols.find("IntersectManager::FindDynaPhysElems");
        let nodes = new ReserveArray(NULL);
        _FindDynaPhysElems(this.ptr,
                           position.toPointer(),
                           maxDistance,
                           nodes.toPointer());
        return nodes;
    }

    FindAnimPhysElems(position: Vector, maxDistance: number): ReserveArray {
        let _FindAnimPhysElems = Symbols.find("IntersectManager::FindAnimPhysElems");
        let nodes = new ReserveArray(NULL);

        _FindAnimPhysElems(this.ptr,
                           position.toPointer(),
                           maxDistance,
                           nodes.toPointer());
        return nodes;
    }
}
