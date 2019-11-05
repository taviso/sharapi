import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vehicle } from "./Vehicle"
import { CharacterManager } from "./CharacterManager"


export class Character extends Base {
    constructor(num = 0) {
        let manager = CharacterManager.GetInstance();
        let character = manager.add(0xC0 + num * 4).readPointer();
        super(character);
    }

    GetVehicle(): Vehicle {
        return new Vehicle(this.ptr.add(0x15C).readPointer());
    }

    IsInCar(): boolean {
        return !! this.ptr.add(0x15c).readU32();
    }
}
