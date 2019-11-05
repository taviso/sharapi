import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"

export class CharacterSheetManager extends Base {
    constructor() {
        super(CharacterSheetManager.GetInstance());
    }
    static GetInstance(): NativePointer {
        let _GetInstance = Symbols.find("CharacterSheetManager::GetInstance")
        return _GetInstance();
    }

    static GetNumberOfTokens(): number {
        let _GetNumberOfTokens = Symbols.find("CharacterSheetManager::GetNumberOfTokens")
        return _GetNumberOfTokens();
    }
}
