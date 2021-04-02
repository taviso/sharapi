
import "./frida"
import { usercall, userpurge } from "./usercall"

export class Symbols {
    static map = {
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
        },
        "CoinManager::SpawnCoins": {
            address:    userpurge(["edx", "ecx", "eax"], 5, 0x5055D0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'int', 'int', 'pointer'],
        },
        "CoinManager::LoseCoins": {
            address:    userpurge(["ebx", "eax", "esi"], 3, 0x505BC0),
            returnType: 'void',
            argTypes:   [ 'pointer', 'int', 'pointer' ],
        },
        "CoinManager::OnVehicleDestroyed": {
            address:    userpurge(["eax", "ecx"], 2, 0x505A50),
            returnType: 'void',
            argTypes:   [ 'pointer', 'pointer' ],
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
        },
        "Mappable::DispatchOnButton": {
            address:    userpurge(["eax", "ebx"], 4, 0x435C30),
            returnType: 'void',
            argTypes:   ['pointer','int','int','pointer'],
        },
        "Mappable::IsActive": {
            address:    userpurge(["eax"], 1, 0x435E40),
            returnType: 'char',
            argTypes:   ['pointer'],
        },
        "Mappable::IsButtonDown": {
            address:    userpurge(["ecx"], 2, 0x435E50),
            returnType: 'bool',
            argTypes:   ['int', 'pointer'],
        },
        "Mappable::UpdateButtonState": {
            address:    userpurge(["esi", "eax", "ecx"], 4, 0x435D40),
            returnType: 'void',
            argTypes:   ['pointer','pointer','int','int'],
        },
        "Button::mTickCount": {
            address:    ptr(0x6C900C),
        },
        "Mapper::GetLogicalIndex": {
            address:    userpurge(["eax", "ecx"], 2, 0x435F20),
            returnType: 'int',
            argTypes:   ['pointer','int'],
        },
        "Mappable::GetActiveMapper": {
            address:    userpurge(["eax"], 1, 0x435DE0),
            returnType: 'pointer',
            argTypes:   ['pointer'],
        },
        "RenderManager::GetInstance": {
            address:    ptr(0x4A8E60),
            returnType: 'pointer',
            argTypes:   [],
        },
        "RenderManager::pWorldScene":  {
            address:    userpurge(["eax"], 1, 0x4A8E90),
            returnType: 'pointer',
            argTypes:   ['pointer'],
        },
        "IntersectManager::GetInstance": {
            address:    ptr(0x4B42A0),
            returnType: 'pointer',
            argTypes:   [],
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
        },
        "IntersectManager::FindStaticPhysElems": {
            address:    userpurge(["ecx", "edi"], 4, 0x4B4C00),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer', 'float'],
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
        },
        "Vehicle::GetPosition": {
            address:    userpurge(["ecx"], 2, 0x4EC670),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
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
        },
        "tName::MakeUID": {
            address:    ptr(0x56f3D0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'cdecl',
        },
        "AvatarManager::GetInstance": {
            address:    ptr(0x4D7A30),
            returnType: 'pointer',
            argTypes:   [],
        },
        "AvatarManager::GetAvatarForPlayer": {
            address:    userpurge(["ecx", "eax"], 2, 0x4d7f40),
            returnType: 'pointer',
            argTypes:   ['pointer', 'int'],
        },
        "Avatar::GetCharacter": {
            address:    userpurge(["eax"], 1, 0x4a7900),
            returnType: 'pointer',
            argTypes:   ['pointer'],
        },
        "Avatar::GetVehicle": {
            address:    userpurge(["eax"], 1, 0x4C7800),
            returnType: 'pointer',
            argTypes:   ['pointer'],
        },
        "Avatar::SetCharacter": {
            address:    userpurge(["ecx", "edx"], 2, 0x4d70c0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::SetVehicle": {
            address:    userpurge(["edi", "esi"], 2, 0x4d7100),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::SetInCarController": {
            address:    ptr(0x4D7180),
            returnType: 'void',
            argTypes:   ['pointer'],
        },
        "Avatar::SetCameraTargetToVehicle": {
            address:    userpurge(["esi"], 2, 0x4d72f0),
            returnType: 'void',
            argTypes:   ['pointer', 'bool'],
        },
        "Avatar::GetIntoVehicleStart": {
            address:    userpurge(["eax"], 2, 0x4D7360),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::GetIntoVehicleEnd": {
            address:    userpurge(["eax"], 2, 0x4d7440),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::GetOutOfVehicleStart": {
            address:    userpurge(["edi"], 2, 0x4d7460),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::SetOutOfCarController": {
            address:    ptr(0x4d74f0),
            returnType: 'void',
            argTypes:   ['pointer'],
        },
        "Avatar::SetCameraTargetToCharacter": {
            address:    userpurge(["esi"], 2, 0x4d75e0),
            returnType: 'void',
            argTypes:   ['pointer', 'bool'],
        },
        "Avatar::GetOutOfVehicleEnd": {
            address:    userpurge(["ebx", "eax"], 2, 0x4D7630),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::IsInCar": {
            address:    userpurge(["eax"], 1, 0x4d76d0),
            returnType: 'bool',
            argTypes:   ['pointer'],
        },
        "Avatar::GetPosition": {
            address:    userpurge(["eax", "esi"], 2, 0x4d76f0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::GetVelocity": {
            address:    userpurge(["eax", "esi"], 2, 0x4D7780),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Avatar::OnCheatEntered": {
            address:    ptr(0x4D77F0),
            returnType: 'void',
            argTypes:   ['int', 'bool'],
        },
        "Avatar::GetLastPathInfo": {
            address:    ptr(0x4d7820),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        },
        "Avatar::GetSpeedMps": {
            address:    userpurge(["esi"], 1, 0x4d77c0),
            returnType: 'float',
            argTypes:   ['pointer'],
        },
        "Avatar::GetRaceInfo": {
            address:    userpurge(["eax", "edx"], 4, 0x4D79B0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer', 'pointer'],
        },
        "Avatar::SetRaceInfo": {
            address:    userpurge(["eax", "edx"], 4, 0x4d79d4),
            returnType: 'void',
            argTypes:   ['pointer', 'int', 'float', 'int'],
        },
        "Avatar::Update": {
            address:    userpurge(["eax"], 2, 0x4d7810),
            returnType: 'void',
            argTypes:   ['pointer', 'float'],
        },
        "Avatar::SetControllerId": {
            address:    userpurge(["eax", "ecx"], 2, 0x4d70b0),
            returnType: 'void',
            argTypes:   ['pointer', 'int'],
        },
        "Avatar::GetHeading": {
            address:    userpurge(["edi", "eax"], 2, 0x4d7750),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "Character::RelocateAndReset": {
            address:    ptr(0x4f38d0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'float', 'bool', 'bool'],
        },
        "AvatarManager::PutCharacterOnGround": {
            address:    userpurge(["eax"], 3, 0x4d80e0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer'],
        },
        "FeParent::RemoveChild": {
            address:    ptr(0x544B60),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
            abi:        'thiscall',
        },
        "FeParent::ReplaceChild": {
            address:    ptr(0x544B80),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer'],
            abi:        'thiscall',
        },
        "WorldScene::Render": {
            address:    userpurge(["ebx"], 2, 0x49cc40),
            returnType: 'void',
            argTypes:   ['pointer', 'int'],
        },
        "WorldScene::RenderScene": {
            address:    ptr(0x49C0F0),
            returnType: 'void',
            argTypes:   ['pointer', 'int', 'pointer'],
        },
        "KERNEL32!EnterCriticalSection": {
            address:    Module.getExportByName("KERNEL32", "EnterCriticalSection"),
            returnType: 'void',
            argTypes:   ['pointer'],
        },
        "KERNEL32!LeaveCriticalSection": {
            address:    Module.getExportByName("KERNEL32", "LeaveCriticalSection"),
            returnType: 'void',
            argTypes:   ['pointer'],
        },
        "KERNEL32!DeleteCriticalSection": {
            address:    Module.getExportByName("KERNEL32", "LeaveCriticalSection"),
            returnType: 'void',
            argTypes:   ['pointer'],
        },
        "KERNEL32!InitializeCriticalSection": {
            address:    Module.getExportByName("KERNEL32", "InitializeCriticalSection"),
            returnType: 'void',
            argTypes:   ['pointer'],
        },
        "IntersectManager::FindFenceElems": {
            address:    userpurge(["ecx", "edi"], 4, 0x4B49C0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'int', 'pointer'],
        },
        "WorldRenderLayer::Render": {
            address:    userpurge(["ecx", "ebx", "edi", "esi"], 4, 0x4AAC00),
            returnType: 'void',
            argTypes:   ['int', 'int', 'int', 'int'],
        },
        "WorldPhysicsManager::Update": {
            address:    userpurge(["eax"], 2, 0x004DD410),
            returnType: 'void',
            argTypes:   ['pointer', 'int'],
        },
        "Context::Update": {
            address:    userpurge(["edi", "esi"], 2, 0x42FB20),
            returnType: 'void',
            argTypes:   ["pointer", "pointer"],
        },
        "GameplayManager::GetInstance": {
            address:   ptr(0x448080),
            returnType: 'pointer',
            argTypes:   [],
        },
        "ActionButtonManager::GetInstance": {
            address:    ptr(0x406140),
            returnType: 'pointer',
            argTypes:   [],
        },
        "ActorManager::GetInstance": {
            address:    ptr(0x416170),
            returnType: 'pointer',
            argTypes:   [],
        },
        "Sparkle::GetInstance": {
            address:    ptr(0x506A60),
            returnType: 'pointer',
            argTypes:   [],
        },
        "Sparkle::AddSparks": {
            address:    userpurge(["eax"], 4, 0x506fd0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer', 'pointer', 'float'],
        },
        "Mission::GetCurrentStage": {
            address:    ptr(0x44d3f0),
            returnType: 'pointer',
            argTypes:   ['pointer'],
            abi:        'thiscall',
        },
        "MissionScriptLoader::GetInstance": {
            address:    ptr(0x44eda0),
            returnType: 'pointer',
            argTypes:   [],
        },
        "MissionObjective::GetObjectiveType": {
            address:    userpurge(["eax"], 1, 0x40e8e0),
            returnType: 'int',
            argTypes:   ['pointer'],
        },
        "SuperCamManager::GetInstance": {
            address:    ptr(0x42A270),
            returnType: 'pointer',
            argTypes:   [],
        },
        "SuperCamCentral::GetSuperCam": {
            address:    userpurge(["ebx"], 2, 0x429400),
            returnType: 'pointer',
            argTypes:   ['pointer', 'int'],
        },
        "SuperCamManager::GetSCC": {
            address:    userpurge(["ecx", "eax"], 2, 0x42a2d0),
            returnType: 'pointer',
            argTypes:   ['pointer', 'int'],
        },
        "SuperCam::SetCameraValues": {
            address:    ptr(0x427410),
            returnType: 'void',
            argTypes:   ['pointer', 'int', 'float', 'float', 'float', 'float', 'float', 'float', 'pointer'],
        },
        "SuperCam::GetPosition": {
            address:    userpurge(["ecx", "eax"], 2, 0x4271A0),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "SuperCam::GetTarget": {
            address:    userpurge(["ecx", "eax"], 2, 0x427200),
            returnType: 'void',
            argTypes:   ['pointer', 'pointer'],
        },
        "IntersectionList": {
            address:    ptr(0x41AF80),
            returnType: 'pointer',
            argTypes:   ['pointer'],
        },
        "IntersectionList::FillIntersectionListDynamics": {
            address:    ptr(0x41BF60),
            returnType: 'int',
            argTypes:   ['pointer', 'pointer', 'float', 'bool', 'pointer'],
        },
        "~IntersectionList": {
            address:    ptr(0x41B050),
            returnType: 'void',
            argTypes:   ['pointer'],
            abi:        'thiscall',
        },
        "DynaPhysDSG::IsCollisionEnabled": {
            address:    ptr(0x49FC60),
            returnType: 'bool',
            argTypes:   ['pointer'],
            abi:        'thiscall',
        },
        "IntersectionList::TestIntersectionDynamics": {
            address:    userpurge(["eax", "edi"], 5, 0x41B490),
            returnType: 'bool',
            argTypes:   ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        },
        "__builtin_vec_new": {
            address:    ptr(0x445600),
            returnType: 'pointer',
            argTypes:   ['int'],
            abi:        'cdecl',
        },
        "EventManager::AddListener": {
            address:    userpurge(["ebx", "edi"], 3, 0x4329E0),
            returnType: 'void',
            argTypes:   ['pointer', 'int', 'pointer'],
        },
        "EventManager::GetInstance": {
            address:    ptr(0x4329A0),
            returnType: 'pointer',
            argTypes:   [],
        },
        "EventManager::TriggerEvent": {
            address:    userpurge(["edx"], 3, 0x432ad0),
            returnType: 'void',
            argTypes:   ['pointer', 'int', 'pointer'],
        },
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
                ? Symbols.map[name].abi
                : 'stdcall'
        );
    }

    static addr(name: string): NativePointer {
        // This check handles the case of the entry being a usercall/userpurge
        // wrapper.
        return "origAddress" in Symbols.map[name].address
            ? Symbols.map[name].address.origAddress
            : Symbols.map[name].address;
    }

    /**
     * Convenient wrapper to lookup and call a symbol in one call.
     * @param name Symbol to call.
     * @param args Parameters to subroutine.
     */
    static call<T>(name: string, ...args: Array<NativePointer | number | boolean>): T {
        let func = Symbols.find(name);
        return <T><unknown>func.apply(func, args);
    }
}
