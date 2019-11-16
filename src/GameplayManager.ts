import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"
import { Mission } from "./Mission"

export class GameplayManager extends Base {
    constructor() {
        super(GameplayManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("GameplayManager::GetInstance");
    }

    HandleEvent(eventNum: number, userPtr: NativePointer): void {
        this.callVirtual<NativePointer>(1, 'void', [
            'int',
            'pointer'],
        eventNum, userPtr);
    }

    GetCurrentMission(): Mission {
        return new Mission(this.callVirtual<NativePointer>(2, 'pointer'));
    }

    CleanMissionData(): void {
        this.callVirtual<void>(3);
    }

    IsSundayDrive(): boolean {
        return !! this.callVirtual<number>(3, 'bool');
    }

    IsSuperSprint(): boolean {
        return !! this.callVirtual<number>(4, 'bool');
    }

    SetLevelIndex(levelIndex: number): void {
        this.callVirtual<void>(5, 'void', ["int"], levelIndex);
    }

    SetMissionIndex(missionIndex: number): void {
        this.callVirtual<void>(6, 'void', ["int"], missionIndex);
    }

    LoadLevelData(): void {
        this.callVirtual<void>(7);
    }

    InitLevelData(): void {
        this.callVirtual<void>(8);
    }

    PerformLoading(): void {
        this.callVirtual<void>(9);
    }

    LevelLoaded(): void {
        this.callVirtual<void>(10);
    }

    Initialize(): void {
        this.callVirtual<void>(11);
    }

    Finalize(): void {
        this.callVirtual<void>(12);
    }

    Reset(): void {
        this.callVirtual<void>(13);
    }

    Update(arg0: number): void {
        this.callVirtual<void>(14, 'void', ["int"], arg0);
    }

    RestartCurrentMission(): void {
        this.callVirtual<void>(15);
    }

    RestartToMission(missionNum: number): void {
        this.callVirtual<void>(16, 'void', ["int"], missionNum);
    }

    AbortCurrentMission(): void {
        this.callVirtual<void>(17);
    }

    LoadMission(): void {
        this.callVirtual<void>(18);
    }
}
