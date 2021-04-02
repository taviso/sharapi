import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"
import { Vector } from "./Radmath"

export class CoinManager extends Base {
    constructor() {
        super(CoinManager.GetInstance());
    }

    static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("CoinManager::GetInstance");
    }

    static AdjustBankValue(num: number): void {
        Symbols.call("CoinManager::AdjustBankValue", num);
    }

    SpawnInstantCoins(position: Vector, count: number) : void {
        Symbols.call("CoinManager::SpawnInstantCoins", this.ptr, count, position.toPointer());
    }

    // FIXME, this doesnt work right
    SpawnCoins(position: Vector, count: number) {
        let _SpawnCoins = Symbols.find("CoinManager::SpawnCoins");
        _SpawnCoins(this.ptr, position.toPointer(), 0, count, position.toPointer());
    }
}
