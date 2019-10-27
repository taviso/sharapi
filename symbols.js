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
