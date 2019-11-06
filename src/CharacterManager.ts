import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Character } from "./Character"

export class CharacterManager extends Base {
    constructor() {
        super(CharacterManager.GetInstance());
    }
    
    static GetInstance(): NativePointer {
        let _GetInstance = Symbols.find("CharacterManager::GetInstance");
        return _GetInstance();
    }

    /**
     * @param num Character number to fetch.
     */
    getCharacter(num = 0): Character {
        return new Character(this.ptr.add(0xC0 + num * 4).readPointer());
    }
}
