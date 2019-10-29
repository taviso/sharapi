var Symbols = {
    "CharacterManager::GetInstance": {
        address:    ptr(0x4fa5a0),
        returnType: 'pointer',
        argTypes:   [],
        abi:        'mscdecl',
    },
    "Vehicle::SetPosition": {
        address:    ptr(0x4E9C30),
        returnType: 'void',
        argTypes:   [ 'pointer', 'pointer' ],
        abi:        'stdcall',
    },
    "Vehicle::GetPosition": {
        address:    userpurge(["ecx"], 0x4EC670),
        returnType: 'void',
        argTypes:   [ 'pointer', 'pointer' ],
        abi:        'stdcall',
    },
    "CoinManager::AdjustBankValue": {
        address:    ptr(0x505C80),
        returnType: 'void',
        argTypes:   [ 'int' ],
        abi:        'fastcall',
    },
    "CoinManager::GetInstance": {
        address:    ptr(0x505300),
        returnType: 'pointer',
        argTypes:   [],
        abi:        'mscdecl',
    },
    "CoinManager::SpawnInstantCoins": {
        address:    userpurge(["eax"], 0x505690),
        returnType: 'void',
        argTypes:   ['pointer', 'int', 'pointer'],
        abi:        'stdcall',
    },
    "CoinManager::SpawnCoins": {
        address:    userpurge(["edx", "ecx", "eax"], 0x5055D0),
        returnType: 'void',
        argTypes:   ['pointer', 'pointer', 'int', 'int', 'pointer'],
        abi:        'stdcall',
    },
    "CoinManager::LoseCoins": {
        address:    userpurge(["ebx", "eax", "esi"], 0x505BC0),
        returnType: 'void',
        argTypes:   [ 'pointer', 'int', 'pointer' ],
        abi:        'stdcall',
    },
    "CoinManager::OnVehicleDestroyed": {
        address:    userpurge(["eax", "ecx"], 0x505A50),
        returnType: 'void',
        argTypes:   [ 'pointer', 'pointer' ],
        abi:        'stdcall',
    },
    "CharacterSheetManager::GetNumberOfTokens": {
        address:    ptr(0x462F10),
        returnType: 'int',
        argTypes:   [],
        abi:        'mscdecl',
    },
    "CommandLineOptions::sOptions": {
        address:    ptr(0x6C8FD0),
    },
    "InputManager::GetInstance": {
        address:    ptr(0x435210),
        returnType: 'pointer',
        argTypes:   [],
        abi:        'mscdecl'
    },
    "InputManager::GetController": {
        address:    userpurge(["ecx", "eax"], 0x435450),
        returnType: 'pointer',
        argTypes:   ['pointer','int'],
        abi:        'stdcall'
    },
    "Mappable::DispatchOnButton": {
        address:    userpurge(["eax", "ebx"], 0x435C30),
        returnType: 'void',
        argTypes:   ['pointer','int','int','pointer'],
        abi:        'stdcall'
    },
    "Mappable::IsActive": {
        address:    userpurge(["eax"], 0x435E40),
        returnType: 'char',
        argTypes:   ['pointer'],
        abi:        'stdcall',
    },
    "Mappable::IsButtonDown": {
        address:    userpurge(["ecx"], 0x435E50),
        returnType: 'bool',
        argTypes:   ['int', 'pointer'],
        abi:        'stdcall'
    },
    "Mappable::UpdateButtonState": {
        address:    userpurge(["esi", "eax", "ecx"], 0x435D40),
        returnType: 'void',
        argTypes:   ['pointer','pointer','int','int'],
        abi:        'stdcall',
    },
    "Button::mTickCount": {
        address:    ptr(0x6C900C),
    },
    "Mapper::GetLogicalIndex": {
        address:    userpurge(["eax", "ecx"], 0x435F20),
        returnType: 'int',
        argTypes:   ['pointer','int'],
        abi:        'stdcall',
    },
    "Mappable::GetActiveMapper": {
        address:    userpurge(["eax"], 0x435DE0),
        returnType: 'pointer',
        argTypes:   ['pointer'],
        abi:        'stdcall',
    },
};

class Symbol {
    static find(name) {
        if (!Symbols[name])
            throw "Unknown Symbol " + name;

        return new NativeFunction(Symbols[name].address,
            Symbols[name].returnType,
            Symbols[name].argTypes,
            Symbols[name].abi);
    }
    static addr(name) {
        return Symbols[name].address.toInt32();
    }
    static ptr(name) {
        return Symbols[name].address;
    }
}
