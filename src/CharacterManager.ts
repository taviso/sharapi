import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"

export class CharacterManager extends Base {
    constructor() {
        super(CharacterManager.GetInstance());
    }
    static GetInstance(): NativePointer {
        let _GetInstance = Symbols.find("CharacterManager::GetInstance");
        return _GetInstance();
    }
}
