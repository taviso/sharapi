import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"
import { Vector } from "./Radmath";

export class SuperCamManager extends Base {
    constructor() {
        super(SuperCamManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("SuperCamManager::GetInstance");
    }

    GetSCC(num: number): SuperCamCentral {
        return new SuperCamCentral(Symbols.call<NativePointer>(
            "SuperCamManager::GetSCC",
            this.ptr,
            num
        ));
    }

    static getSuperCam(scc = 0, type = 2) {
        return (new SuperCamManager()).GetSCC(scc).GetSuperCam(type);
    }
}

export class SuperCamCentral extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetSuperCam(type: number): SuperCam {
        return new SuperCam(Symbols.call<NativePointer>("SuperCamCentral::GetSuperCam",
            this.ptr,
            type
        ));
    }
}

export class SuperCam extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetPosition(): Vector {
        let position = new Vector();
        Symbols.call<NativePointer>("SuperCam::GetPosition", this.ptr, position.toPointer());
        return position;
    }

    GetTarget(): Vector {
        let target = new Vector();
        Symbols.call<NativePointer>("SuperCam::GetTarget", this.ptr, target.toPointer());
        return target;
    }

    SetCameraValues(arg1: number, position: Vector, target: Vector): Vector {
        let result = new Vector();
        Symbols.call<void>("SuperCam::SetCameraValues",
            this.ptr,
            arg1,
            position.x,
            position.y,
            position.z,
            target.x,
            target.y,
            target.z,
            result.toPointer()
        );
        return result;
    }
}