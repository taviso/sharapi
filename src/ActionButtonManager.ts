import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"

export class ActionButtonManager extends Base {
    constructor() {
        super(ActionButtonManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("ActionButtonManager::GetInstance");
    }
}
