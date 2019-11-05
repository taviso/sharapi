
import "./frida"
import { usercall, userpurge } from "./usercall"

export class Symbols {
    static map: any = {
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
            address:    userpurge(["eax"], 3, 0x505690),
            returnType: 'void',
            argTypes:   ['pointer', 'int', 'pointer'],
            abi:        'stdcall',
        },
        "CoinManager::SpawnCoins": {
            address:    userpurge(["edx", "ecx", "eax"], 5, 0x5055D0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'int', 'int', 'pointer'],
            abi:        'stdcall',
        },
        "CoinManager::LoseCoins": {
            address:    userpurge(["ebx", "eax", "esi"], 3, 0x505BC0),
            returnType: 'void',
            argTypes:   [ 'pointer', 'int', 'pointer' ],
            abi:        'stdcall',
        },
        "CoinManager::OnVehicleDestroyed": {
            address:    userpurge(["eax", "ecx"], 2, 0x505A50),
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
            address:    userpurge(["ecx", "eax"], 2, 0x435450),
            returnType: 'pointer',
            argTypes:   ['pointer','int'],
            abi:        'stdcall'
        },
        "Mappable::DispatchOnButton": {
            address:    userpurge(["eax", "ebx"], 4, 0x435C30),
            returnType: 'void',
            argTypes:   ['pointer','int','int','pointer'],
            abi:        'stdcall'
        },
        "Mappable::IsActive": {
            address:    userpurge(["eax"], 1, 0x435E40),
            returnType: 'char',
            argTypes:   ['pointer'],
            abi:        'stdcall',
        },
        "Mappable::IsButtonDown": {
            address:    userpurge(["ecx"], 2, 0x435E50),
            returnType: 'bool',
            argTypes:   ['int', 'pointer'],
            abi:        'stdcall'
        },
        "Mappable::UpdateButtonState": {
            address:    userpurge(["esi", "eax", "ecx"], 4, 0x435D40),
            returnType: 'void',
            argTypes:   ['pointer','pointer','int','int'],
            abi:        'stdcall',
        },
        "Button::mTickCount": {
            address:    ptr(0x6C900C),
        },
        "Mapper::GetLogicalIndex": {
            address:    userpurge(["eax", "ecx"], 2, 0x435F20),
            returnType: 'int',
            argTypes:   ['pointer','int'],
            abi:        'stdcall',
        },
        "Mappable::GetActiveMapper": {
            address:    userpurge(["eax"], 1, 0x435DE0),
            returnType: 'pointer',
            argTypes:   ['pointer'],
            abi:        'stdcall',
        },
        "RenderManager::GetInstance": {
            address:    ptr(0x4A8E60),
            returnType: 'pointer',
            argTypes:   [],
            abi:        'stdcall',
        },
        "RenderManager::pWorldScene":  {
            address:    userpurge(["eax"], 1, 0x4A8E90),
            returnType: 'pointer',
            argTypes:   ['pointer'],
            abi:        'stdcall',
        },
        "IntersectManager::GetInstance": {
            address:    ptr(0x4B42A0),
            returnType: 'pointer',
            argTypes:   [],
            abi:        'stdcall',
        },
        "IntersectManager::FindClosestRoad": {
            address:    ptr(0x4B43A0),
            returnType: 'pointer',
            argTypes:   ['pointer', 'pointer', 'float', 'pointer', 'pointer'],
            abi:        'thiscall',
        },
        "RoadSegment::GetCorner": {
            address:    userpurge(["edx", "eax", "ecx"], 3, 0x4C01E0),
            returnType: 'pointer',
            argTypes:   ['pointer', 'pointer', 'int'],
            abi:        'stdcall',
        },
        "IntersectManager::FindStaticPhysElems": {
            address:    userpurge(["ecx", "edi"], 4, 0x4B4C00),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer', 'float'],
            abi:        'stdcall',
        },
        "StaticPhysDSG::GetPosition": {
            address:    ptr(0x4A5880),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'thiscall',
        },
        "DynaPhysDSG::ApplyForce": {
            address:    ptr(0x49FBA0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'float'],
            abi:        'thiscall',
        },
        "DynaPhysDSG::RestTest": {
            address:    ptr(0x49F800),
            returnType: 'bool',
            argTypes:   ['pointer'],
            abi:        'thiscall',
        },
        "DynaPhysDSG::IsAtRest": {
            address:    ptr(0x49F7D0),
            returnType: 'bool',
            argTypes:   ['pointer'],
            abi:        'thiscall',
        },
        "IntersectManager::FindDynaPhysElems": {
            address:    userpurge(["ecx", "ebx"], 4, 0x4B4DF0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'float', 'pointer'],
            abi:        'stdcall'
        },
        "Vehicle::GetPosition": {
            address:    userpurge(["ecx"], 2, 0x4EC670),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'stdcall',
        },
        "AnimCollisionEntityDSG::GetPosition": {
            address:    ptr(0x4A6680),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'thiscall',
        },
        "IntersectManager::FindAnimPhysElems": {
            address:    userpurge(["ecx", "ebx"], 4, 0x4B4FF0),
            returnType: 'int',
            argTypes:   ['pointer', 'pointer', 'float', 'pointer'],
            abi:        'stdcall',
        },
        "tName::Init": {
            address:    ptr(0x56F520),
            returnType: 'pointer',
            argTypes:   ['pointer', 'pointer'],
            abi:        'thiscall',
        },
        "FeText::Init": {
            address:    ptr(0x53F8B0),
            returnType: 'pointer',
            argTypes:   ['pointer', 'pointer', 'int', 'int', 'bool'],
            abi:        'thiscall',
        },
        "FeText::AddHardCodedString": {
            address:    ptr(0x540160),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'thiscall',
        },
        "FeText::Display": {
            address:    ptr(0x53FC00),
            returnType: 'void',
            argTypes:   ['pointer'],
            abi:        'thiscall'
        },
        "FeParent::Resize": {
            address:    ptr(0x544BA0),
            returnType: 'void',
            argTypes:   ['pointer', 'int'],
            abi:        'thiscall',
        },
        "FeText::SetTextStyle": {
            address:    ptr(0x540020),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'thiscall',
        },
        "FeApp::GetInstance": {
            address:    ptr(0x5369F0),
            returnType: 'pointer',
            argTypes:   [],
            abi:        'stdcall',
        }
    };
    static find(name: string): NativeFunction {
        if (!Symbols.map[name])
            throw "Unknown Symbol " + name;

        if (Symbols.map[name].cached)
            return Symbols.map[name].cached;

        return Symbols.map[name].cached = new NativeFunction(
            Symbols.map[name].address,
            Symbols.map[name].returnType,
            Symbols.map[name].argTypes,
            Symbols.map[name].abi
        );
    }
    static addr(name: string):  number {
        return Symbols.map[name].address.toInt32();
    }
    static ptr(name: string) : NativePointer {
        return Symbols.map[name].address;
    }
}
