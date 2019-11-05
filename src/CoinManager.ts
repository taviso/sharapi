import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vector } from "./Radmath"

export class CoinManager extends Base {
    constructor() {
        super(CoinManager.GetInstance());
    }

    static GetInstance(): NativePointer {
        let _GetInstance = Symbols.find("CoinManager::GetInstance");
        return _GetInstance()
    }

    static AdjustBankValue(num: number): void {
        let _AdjustBankValue = Symbols.find("CoinManager::AdjustBankValue");
        _AdjustBankValue(num);
    }

    SpawnInstantCoins(position: Vector, count: number) {
        let _SpawnInstantCoins = Symbols.find("CoinManager::SpawnInstantCoins");
        _SpawnInstantCoins(this.ptr, count, position.toPointer());
    }

    // FIXME, this doesnt work right
    SpawnCoins(position: Vector, count: number) {
        let _SpawnCoins = Symbols.find("CoinManager::SpawnCoins");
        _SpawnCoins(this.ptr, position.toPointer(), 0, count, position.toPointer());
    }
}
