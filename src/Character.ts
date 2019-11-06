import "./frida"
import { Vehicle } from "./Vehicle"
import { InstDynaPhysDSG } from "./InstDynaPhysDSG"

/**
 * The active character, instantiate from CharacterManager.
 */
export class Character extends InstDynaPhysDSG {
    constructor(p: NativePointer) {
        super(p);
    }

    GetVehicle(): Vehicle {
        return new Vehicle(this.ptr.add(0x15C).readPointer());
    }

    IsInCar(): boolean {
        return !! this.ptr.add(0x15c).readU32();
    }
}
