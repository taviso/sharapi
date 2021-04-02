import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"

export class RenderManager extends Base {
    constructor() {
        super(RenderManager.GetInstance());
    }

    static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("RenderManager::GetInstance");
    }

    pWorldScene() {
        let _pWorldScene = Symbols.find("RenderManager::pWorldScene");
        return _pWorldScene(this.ptr);
    }
}
