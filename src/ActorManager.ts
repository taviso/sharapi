import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"

export class ActorManager extends Base {
    constructor() {
        super(ActorManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("ActorManager::GetInstance");
    }
}
