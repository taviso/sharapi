import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vector } from "./Radmath"

export class RoadSegment extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetCorner(num: number) {
        let _GetCorner = Symbols.find("RoadSegment::GetCorner");
        let corner = new Vector();
        _GetCorner(this.ptr, corner.toPointer(), num);
        return corner;
    }
}
