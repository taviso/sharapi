import "./frida"
import { Vehicle } from "./Vehicle"
import { InstDynaPhysDSG } from "./InstDynaPhysDSG"
import { Vector } from "./Radmath";
import { Symbols } from "./Symbols";

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

    /**
     * 
     * @param pos New position for Character.
     * @param heading Desired facing angle.
     * @param b Unknown
     * @param reset Reset action state?
     */
    RelocateAndReset(pos: Vector,
                     heading: number,
                     b: boolean,
                     reset: boolean = false): void {
        Symbols.call<void>("Character::RelocateAndReset",
            this.ptr,
            pos.toPointer(),
            heading,
            +b,
            +reset
        );
    }
}
