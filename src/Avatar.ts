import "./frida"
import { Base } from "./Base";
import { Symbols } from "./Symbols";

export class AvatarManager extends Base {
    constructor() {
        super(AvatarManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("AvatarManager::GetInstance");
    }

    GetAvatarForPlayer(num = 0): Avatar {
        let p = Symbols.call<NativePointer>("AvatarManager::GetAvatarForPlayer",
            this.ptr,
            num);
        return new Avatar(p);
    }
}

export class Avatar extends Base {
    constructor(p) {
        super(p);
    }

    HandleEvent(event: number, param: number): number {
        return this.callVirtual<number>(0, 'bool', ["int", "int"], event, param);
    }
}