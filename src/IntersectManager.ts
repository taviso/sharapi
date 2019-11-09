import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vector } from "./Radmath"
import { RoadSegment } from "./RoadSegment"
import { InstDynaPhysDSG } from "./InstDynaPhysDSG"
import { WorldRenderLayerLock, WorldPhysicsLock, ContextUpdateLock } from "./Locks"

export class ReserveArray<T extends Base> extends Base {
    private type: {new(p: NativePointer): T;};

    /**
     * 
     * @param n An element count, or pointer to convert into a ReserveArray.
     * @param type Class to convert elements to.
     */
    constructor(type: {new(p: NativePointer): T;}, n: NativePointer | number = 0) {
        if (n instanceof NativePointer) {
            super(n);
        } else {
            let array = n ? Memory.alloc(n * 4) : NULL;
            super(Memory.alloc(0xC));
            this.ptr.add(0).writeU32(n);
            this.ptr.add(4).writeU32(0);
            this.ptr.add(8).writePointer(array);
        }
        this.type = type;
    }

    get maxOccupancy(): number {
        return this.ptr.add(0).readU32();
    }

    get currentOccupancy(): number {
        return this.ptr.add(4).readU32();
    }

    private getIndex(index: number): T {
        return new this.type(this.ptr.add(8).readPointer().add(index * 4).readPointer());
    }

    private toArray(): Array<T> {
        let all: Array<T> = [];
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

    FindStaticPhysElems(position: Vector, maxDistance: number): ReserveArray<PhysDSG> {
        let _FindStaticPhysElems = Symbols.find("IntersectManager::FindStaticPhysElems");
        let nodes = new ReserveArray<PhysDSG>(PhysDSG);

        _FindStaticPhysElems(this.ptr,
                             nodes.toPointer(),
                             position.toPointer(),
                             maxDistance);
        return nodes;
    }

    FindDynaPhysElems(position: Vector, maxDistance: number): ReserveArray<InstDynaPhysDSG> {
        let _FindDynaPhysElems = Symbols.find("IntersectManager::FindDynaPhysElems");
        let nodes = new ReserveArray<InstDynaPhysDSG>(InstDynaPhysDSG);

        // Take the lock, this is not reentrant.
        WorldRenderLayerLock.enter();
        //WorldPhysicsLock.enter();
        ContextUpdateLock.enter();

        _FindDynaPhysElems(this.ptr,
                           position.toPointer(),
                           maxDistance,
                           nodes.toPointer());


        ContextUpdateLock.leave();
        //WorldPhysicsLock.leave();
        WorldRenderLayerLock.leave();
        return nodes;
    }

    FindAnimPhysElems(position: Vector, maxDistance: number): ReserveArray<AnimCollisionEntityDSG> {
        let _FindAnimPhysElems = Symbols.find("IntersectManager::FindAnimPhysElems");
        let nodes = new ReserveArray<AnimCollisionEntityDSG>(AnimCollisionEntityDSG);

        _FindAnimPhysElems(this.ptr,
                           position.toPointer(),
                           maxDistance,
                           nodes.toPointer());
        return nodes;
    }
}