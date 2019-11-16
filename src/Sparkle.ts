import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"
import { Vector } from "./Radmath"

export class Sparkle extends Base {
    constructor() {
        super(Sparkle.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("Sparkle::GetInstance");
    }

    AddSparks(position1: Vector, position2: Vector, size: number): void {
        Symbols.call<void>("Sparkle::AddSparks",
            this.ptr,
            position1.toPointer(),
            position2.toPointer(),
            size);
    }
}
