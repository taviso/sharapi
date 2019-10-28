class CharacterSheetManager {
    static _GetNumberOfTokens = Symbol.find("CharacterSheetManager::GetNumberOfTokens");
    static GetNumberOfTokens() {
        return this._GetNumberOfTokens();
    }
}

class CharacterManager {
    static _GetInstance = Symbol.find("CharacterManager::GetInstance");
    static GetInstance() {
        return this._GetInstance();
    }
}

class Character {
    constructor(num = 0) {
        this._charactermanager = CharacterManager.GetInstance();
        this._character = this._charactermanager.add(0xC0 + num * 4).readPointer();
    }

    GetVehicle() {
        return new Vehicle(this._character.add(0x15C).readPointer());
    }

    IsInCar() {
        return !! this._character.add(0x15c).readU32();
    }
}

class Vehicle {
    static _SetPosition = Symbol.find("Vehicle::SetPosition");
    static _GetPosition = Symbol.find("Vehicle::GetPosition");

    constructor(v) {
        this._vehicle = v;
    }

    GetPosition() {
        var Position = new Radmath.Vector();

        Vehicle._GetPosition(this._vehicle, Position.addr);
        return Position;
    }

    SetPosition(x, y, z) {
        var Position = new Radmath.Vector(x, y, z);
        return Vehicle._SetPosition(this._vehicle, Position.addr);
    }

}

class CoinManager {
    static _SpawnInstantCoins = Symbol.find("CoinManager::SpawnInstantCoins");
    static _AdjustBankValue = Symbol.find("CoinManager::AdjustBankValue");
    static _GetInstance = Symbol.find("CoinManager::GetInstance");
    static _SpawnCoins = Symbol.find("CoinManager::SpawnCoins");
    static _VehicleDestroyed = Symbol.find("CoinManager::OnVehicleDestroyed");

    static GetInstance() {
        return this._GetInstance()
    }

    static AdjustBankValue(num) {
        return this._AdjustBankValue(num);
    }

    static SpawnInstantCoins(x, y, z, count) {
        var Position = new Radmath.Vector(x, y, z);
        this._SpawnInstantCoins(this.GetInstance(), count, Position.addr);
    }

    // FIXME, this doesnt work right
    static SpawnCoins(x, y, z, count) {
        var Position = new Radmath.Vector(x, y, z);
        this._spawnCoins(this.GetInstance(), Position.addr, 0, count, Position.addr);
    }

    static VehicleDestroyed(vehicle) {
        VehicleDestroyed(this.GetInstance(), vehicle._vehicle);
    }
}

class CommandLineOptions {
    static _Options = Symbol.ptr("CommandLineOptions::sOptions");

    static flags = {
        NOEFFECTS:      1,
        NODIALOG:       2,
        RANDOMBUTTONS:  12,
    }

    static Get(n) {
        return !! (this._Options.readU64() & (1 << n))
    }

    static Set(n) {
        this._Options.writeU64(this._Options.readU64() | (1 << n));
    }

    static Clear(n) {
        this._Options.writeU64(this._Options.readU64() & ~(1 << n));
    }
}
