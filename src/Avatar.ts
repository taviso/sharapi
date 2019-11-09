import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"
import { Vehicle } from "./Vehicle"
import { Character } from "./Character"
import { Vector } from "./Radmath"

export class AvatarManager extends Base {
    constructor() {
        super(AvatarManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("AvatarManager::GetInstance");
    }

    HandleEvent(event: number, param: NativePointer): void {
        Symbols.call<void>(
            "AvatarManager::HandleEvent",
            this.ptr,
            param
        );
    }

    GetAvatarForVehicle(car: Vehicle): Avatar {
        let p = Symbols.call<NativePointer>(
            "AvatarManager::GetAvatarForVehicle",
            this.ptr,
            car.toPointer()
        );
        return new Avatar(p);
    }

    FindAvatarForCharacter(c: Character): Avatar {
        let p = Symbols.call<NativePointer>(
            "AvatarManager::FindAvatarForCharacter",
            this.ptr,
            c.toPointer()
        );
        return new Avatar(p);
    }

    PutCharacterOnGround(character: Character, vehicle: Vehicle): void {
        // Register parameters have to go first, this one has this on the stack.
        Symbols.call<void>(
            "AvatarManager::PutCharacterOnGround",
            character.toPointer(),
            this.ptr,
            vehicle.toPointer()
        );
    }

    PutCharacterInVehicle(c: Character, v: Vehicle): void {
        Symbols.call<void>(
            "AvatarManager::PutCharacterInVehicle",
            this.ptr,
            c.toPointer(),
            v.toPointer()
        );
    }

    GetAvatarForPlayer(num = 0): Avatar {
        let p = Symbols.call<NativePointer>(
            "AvatarManager::GetAvatarForPlayer",
            this.ptr,
            num
        );
        return new Avatar(p);
    }

    /**
     * static utility function to easily grab default avatar.
     * @param block Wait if an Avatar is not available.
     */
    static getAvatar(block = false): Avatar {
        let p: NativePointer;
        
        while (true) {
            p = Symbols.call<NativePointer>(
                "AvatarManager::GetAvatarForPlayer",
                AvatarManager.GetInstance(),
                0
            );
            if (p.toInt32() == 0) {
                if (block) {
                    Thread.sleep(1);
                    continue;
                }
                
                return null;
            }
            break;
        }

        return new Avatar(p);
    }
}

export class Avatar extends Base {
    private manager: AvatarManager;

    constructor(p) {
        super(p);
        // Keep a handy reference to the manager.
        this.manager = new AvatarManager(); 
    }

    /**
     * utility function to exit current vehicle.
     */
    putOnGround(): boolean {
        let character = this.GetCharacter();

        if (this.IsInCar()) {
            this.manager.PutCharacterOnGround(
                this.GetCharacter(),
                this.GetVehicle()
            );
        }
        return this.IsInCar();
    }

    HandleEvent(event: number, param: number | NativePointer): number {
        return this.callVirtual<number>(0, 'bool', ["int", "int"], event, param);
    }

    GetCharacter(): Character {
        let p = Symbols.call<NativePointer>(
            "Avatar::GetCharacter",
            this.ptr
        );
        return new Character(p);
    }

    GetVehicle(): Vehicle {
        let p = Symbols.call<NativePointer>(
            "Avatar::GetVehicle",
            this.ptr
        );
        return new Vehicle(p);
    }

    SetControllerId(id: number): void {
        Symbols.call<void>("Avatar::SetControllerId", this.ptr, id);
    }

    SetCharacter(c: Character): void {
        Symbols.call<void>("Avatar::SetCharacter",
            this.ptr,
            c.toPointer()
        );
    }

    SetVehicle(v: Vehicle): void {
        Symbols.call<void>("Avatar::SetVehicle",
            this.ptr,
            v.toPointer()
        );
    }

    SetInCarController(): void {
        Symbols.call<void>("Avatar::SetInCarController", this.ptr);
    }

    SetCameraTargetToVehicle(on: boolean): void {
        Symbols.call<void>("Avatar::SetCameraTargetToVehicle", this.ptr, on);
    }

    GetIntoVehicleStart(v: Vehicle): void {
        Symbols.call<void>("Avatar::GetIntoVehicleStart",
            this.ptr,
            v.toPointer()
        );
    }

    GetIntoVehicleEnd(v: Vehicle): void {
        Symbols.call<void>("Avatar::GetIntoVehicleEnd",
            this.ptr,
            v.toPointer()
        );
    }

    GetOutOfVehicleStart(v: Vehicle): void {
        Symbols.call<void>("Avatar::GetOutOfVehicleStart",
            this.ptr,
            v.toPointer()
        );
    }

    SetOutOfCarController(): void {
        Symbols.call<void>("Avatar::SetOutOfCarController", this.ptr);
    }

    SetCameraTargetToCharacter(on: boolean) {
        Symbols.call<void>("Avatar::SetCameraTargetToCharacter", this.ptr, on)
    }

    GetOutOfVehicleEnd(v: Vehicle): void {
        Symbols.call<void>("Avatar::GetOutOfVehicleEnd", this.ptr, v.toPointer());
    }

    IsInCar(): boolean {
        return !! Symbols.call<boolean>("Avatar::IsInCar", this.ptr);
    }

    GetPosition(): Vector {
        let v = new Vector();
        Symbols.call<void>("Avatar::GetPosition", this.ptr, v.toPointer());
        return v;
    }

    GetHeading(): Vector {
        let v = new Vector();
        Symbols.call<void>("Avatar::GetHeading", this.ptr, v.toPointer());
        return v;
    }

    GetVelocity(): Vector {
        let v = new Vector();
        Symbols.call<void>("Avatar::GetVelocity", this.ptr, v.toPointer());
        return v;
    }

    GetSpeedMps(): number {
        return Symbols.call<number>("Avatar::GetSpeedMps", this.ptr);
    }

    OnCheatEntered(cheat: number, enable: boolean): void {
        Symbols.call<void>("Avatar::OnCheatEntered", this.ptr, cheat, enable);
    }

    /**
     * 
     * @param f unused
     */
    Update(f = 0): void {
        Symbols.call<void>("Avatar::Update", this.ptr, f);
    }

    GetLastPathInfo(): void {
        // FIXME need pathelement
        return;
    }

    GetRaceInfo(): Array<number> {
        let a = Memory.alloc(4);
        let b = Memory.alloc(4);
        let c = Memory.alloc(4);
        Symbols.call<void>("Avatar::GetRaceInfo", this.ptr, a, b, c);
        return [
            a.readFloat(),
            b.readU32(),
            c.readU32(),
        ];
    }

    SetRaceInfo(a: number, b: number, c: number) {
        Symbols.call<void>("Avatar::SetRaceInfo", this.ptr, a, b, c);
    }
}