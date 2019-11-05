import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vector } from "./Radmath"

export class Vehicle extends Base {

    constructor(p) {
        super(p);
    }

    GetPosition(): Vector {
        let _GetPosition = Symbols.find("Vehicle::GetPosition");
        let position = new Vector();

        _GetPosition(this.ptr, position.toPointer());
        return position;
    }

    SetPosition(position: Vector) {
        let _SetPosition = Symbols.find("Vehicle::SetPosition");
        _SetPosition(this.ptr, position.toPointer());
    }
}
