class Tls {
    static _tlsfreeaddr     = ptr(Module.getExportByName("KERNEL32", "TlsFree"));
    static _tlsallocaddr    = ptr(Module.getExportByName("KERNEL32", "TlsAlloc"));
    static _tlssetvalueaddr = ptr(Module.getExportByName("KERNEL32", "TlsSetValue"));
    static _tlsgetvalueaddr = ptr(Module.getExportByName("KERNEL32", "TlsGetValue"));
    static _tlsfree         = new SystemFunction(this._tlsfreeaddr, 'int', ['int']);
    static _tlsalloc        = new SystemFunction(this._tlsallocaddr, 'int', []);
    static _tlssetvalue     = new SystemFunction(this._tlssetvalueaddr, 'int', ['int', 'pointer']);
    static _tlsgetvalue     = new SystemFunction(this._tlsgetvalueaddr, 'pointer', ['int']);

    static TlsFree(dwTlsIndex) {
        return this._tlsfree(dwTlsIndex);
    }

    static TlsAlloc() {
        return this._tlsalloc();
    }

    static TlsSetValue(dwTlsIndex, lpTlsValue) {
        return this._tlssetvalue(dwTlsIndex, lpTlsValue);
    }

    static TlsGetValue(dwTlsIndex) {
        return this._tlsgetvalue(dwTlsIndex);
    }
}
var Symbols = {
    "CharacterManager::GetInstance": {
        address:    new NativePointer(0x4fa5a0),
        returnType: 'pointer',
        argTypes:   [],
        abi:        'mscdecl',
    },
    "Vehicle::SetPosition": {
        address:    new NativePointer(0x4E9C30),
        returnType: 'void',
        argTypes:   [ 'pointer', 'pointer' ],
        abi:        'stdcall',
    },
    "Vehicle::GetPosition": {
        address:    UserpurgeWrapper(["ecx"], new NativePointer(0x4EC670)),
        returnType: 'void',
        argTypes:   [ 'pointer', 'pointer' ],
        abi:        [ 'stdcall' ],
    },
    "CoinManager::AdjustBankValue": {
        address:    new NativePointer(0x505C80),
        returnType: 'void',
        argTypes:   [ 'int' ],
        abi:        'fastcall',
    },
    "CoinManager::GetInstance": {
        address:    new NativePointer(0x505300),
        returnType: 'pointer',
        argTypes:   [],
        abi:        'mscdecl',
    },
    "CoinManager::SpawnInstantCoins": {
        address:    UserpurgeWrapper(["eax"], new NativePointer(0x505690)),
        returnType: 'void',
        argTypes:   ['pointer', 'int', 'pointer'],
        abi:        'stdcall',
    },
    "CoinManager::SpawnCoins": {
        address:    UserpurgeWrapper(["edx", "ecx", "eax"], new NativePointer(0x5055D0)),
        returnType: 'void',
        argTypes:   ['pointer', 'pointer', 'int', 'int', 'pointer'],
        abi:        'stdcall',
    },
    "CoinManager::LoseCoins": {
        address:    UserpurgeWrapper(["ebx", "eax", "esi"], new NativePointer(0x505BC0)),
        returnType: 'void',
        argTypes:   [ 'pointer', 'int', 'pointer' ],
        abi:        'stdcall',
    },
    "CoinManager::OnVehicleDestroyed": {
        address:    UserpurgeWrapper(["eax", "ecx"], new NativePointer(0x505A50)),
        returnType: 'void',
        argTypes:   [ 'pointer', 'pointer' ],
        abi:        'stdcall',
    },
    "CharacterSheetManager::GetNumberOfTokens": {
        address:    new NativePointer(0x462F10),
        returnType: 'int',
        argTypes:   [],
        abi:        'mscdecl',
    },
};

class Symbol {
    static find(name) {
        return new NativeFunction(Symbols[name].address,
            Symbols[name].returnType,
            Symbols[name].argTypes,
            Symbols[name].abi);
    }
    static addr(name) {
        return Symbols[name].address.toInt32();
    }
}
function CreateVector(x, y, z)
{
    var v = Memory.alloc(4 * 3);
    v.add(0 * 4).writeFloat(y);
    v.add(1 * 4).writeFloat(z); // Not a typo, this is the order
    v.add(2 * 4).writeFloat(x);
    return v;
}
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
        var Position = CreateVector(0, 0, 0);
        var Result = [];

        Vehicle._GetPosition(this._vehicle, Position);

        Result.push(Position.add(2 * 4).readFloat());
        Result.push(Position.add(0 * 4).readFloat());
        Result.push(Position.add(1 * 4).readFloat());
        return Result;
    }

    SetPosition(x, y, z) {
        var Position = CreateVector(x, y, z);
        return Vehicle._SetPosition(this._vehicle, Position);
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
        var Position = CreateVector(x, y, z);
        this._SpawnInstantCoins(this.GetInstance(), count, Position);
    }

    // FIXME, this doesnt work right
    static SpawnCoins(x, y, z, count) {
        var Position = CreateVector(x, y, z);
        this._spawnCoins(this.GetInstance(), Position, 0, count, Position);
    }

    static VehicleDestroyed(vehicle) {
        VehicleDestroyed(this.GetInstance(), vehicle._vehicle);
    }
}

function UserpurgeWrapper(convention, address)
{
    var code = Memory.alloc(Process.pageSize);
    var gen = new X86Writer(code);

    if (convention.includes("edi"))
        return;

    gen.putPopReg("edi"); // Save return address

    // Setup parameters.
    for (var i = 0; i < convention.length; i++) {
        gen.putPopReg(convention[i]);
    }

    gen.putPushReg("edi");
    gen.putJmpAddress(address);
    gen.flush();
    return code;
}

function UsercallWrapper(convention, address)
{
    var code = Memory.alloc(Process.pageSize);
    var slot = Tls.TlsAlloc().value;
    var gen = new X86Writer(code);

    // Save return address into TLS
    gen.putPopReg("eax");
    gen.putCallAddressWithArguments(Tls._tlssetvalue, [slot, "eax"]);

    // Setup parameters.
    for (var i = 0; i < convention.length; i++) {
        gen.putPopReg(convention[i]);
    }

    gen.putCallAddress(address);

    // Save result.
    gen.putPushReg("eax");
    gen.putCallAddressWithArguments(Tls._tlsgetvalue, [slot]);
    gen.putXchgRegRegPtr("eax", "esp");
    gen.putRet();
    gen.flush();
    return code;
}

function BeginFuzz()
{
    var Player = new Character();
    var Car;

    // We teleport the vehicle, so must be in a car.
    if (Player.IsInCar() == false) {
        console.log("Please enter a car first!");
        return;
    }

    // Wait a few seconds.
    Thread.sleep(5);

    // Find the current vehicle.
    Car = Player.GetVehicle();

    while (true) {

        // Choose a random map position.
        var Target = {
            x: -400 + Math.random() * 800,
            y: -1   + Math.random() * 800,
            z: -1   + Math.random() * 20,
        };

        // Reset coins
        CoinManager.AdjustBankValue(-CharacterSheetManager.GetNumberOfTokens());

        // Teleport Random Location
        Car.SetPosition(Target.x, Target.y, Target.z);

        // Spawn coins.
        CoinManager.SpawnInstantCoins(Target.x + Math.random() * 5,
                                      Target.y + Math.random() * 5,
                                      Target.z + Math.random() * 1,
                                      10);

        // Wait to collect them.
        Thread.sleep(0.5);

        // Log Result.
        console.log("Position", Car.GetPosition(), "Coins", CharacterSheetManager.GetNumberOfTokens());
    }
}

// Interceptors are buggy on Windows if you intercept functions called via NativeFunction()
//
// Interceptor.attach(Symbol.find("CoinManager::AdjustBankValue"), {
//    onEnter: function (args) {
//        console.log("CoinManager::AdjustBankValue() count=" + this.context.ecx.toInt32())
//    },
// });
