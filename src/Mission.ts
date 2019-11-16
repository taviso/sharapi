import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"
import { Vector } from "./Radmath"
import { GameplayManager } from "./GameplayManager"

export class Mission extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    HandleEvent(eventNum: number, userParam: NativePointer): void {
        this.callVirtual<void>(1, 'void', ["int", "pointer"], eventNum, userParam);
    }

    /**
     * Convenient wrapper to get the current objective.
     */
    static getObjective() {
        var game = new GameplayManager();
        return game.GetCurrentMission().GetCurrentStage().missionObjective.getObjective();
    }

    // Initialize() 2

    Finalize(): void {
        this.callVirtual<void>(3);
    }

    NextStage(): void {
        this.callVirtual<void>(4);
    }

    PrevStage(): void {
        this.callVirtual<void>(5);
    }

    DoUpdate(): void {
        this.callVirtual<void>(6);
    }

    GetCurrentStage() : MissionStage {
        return new MissionStage(Symbols.call<NativePointer>(
            "Mission::GetCurrentStage",
            this.ptr));
    }
}

export class MissionObjective extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetObjectiveType(): string {
        let num = Symbols.call<number>("MissionObjective::GetObjectiveType", this.ptr);
        return MissionTypes[num].name;
    }

    getObjective(): any {
        let num = Symbols.call<number>("MissionObjective::GetObjectiveType", this.ptr);
        return new MissionTypes[num].object(this.ptr);
    }

    getLocator(): IHudMapIconLocator {
        return new IHudMapIconLocator(this.ptr.add(0x524));
    }

    getPosition(): Vector {
        return this.getLocator().GetPosition();
    }

    getHeading(): Vector {
        return this.getLocator().GetHeading();
    }
}

export class MissionStage extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    HandleEvent(eventNum: number, userParam: NativePointer): void {
        this.callVirtual(1, 'void', ["int", "pointer"], eventNum, userParam);
    }

    get missionObjective(): MissionObjective {
        return new MissionObjective(this.ptr.add(0x68).readPointer());
    }
    
}

export class MissionScriptLoader extends Base {
    constructor() {
        super(MissionScriptLoader.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("MissionScriptLoader::GetInstance");
    }

    OnExecuteScriptComplete(callback: NativePointer | NativeFunction): number {
        return this.callVirtual<number>(1, 'int', ["pointer"], callback);
    }

    get objectiveType(): number {
        return this.ptr.add(0x20).readU32();
    }

}

export class IHudMapIconLocator extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetPosition(): Vector {
        let p = new Vector();
        this.callVirtual<void>(0, 'void', ["pointer"], p.toPointer());
        return p;
    }

    GetHeading(): Vector {
        let p = new Vector();
        this.callVirtual<void>(1, 'void', ["pointer"], p.toPointer());
        return p;
    }
}

export class TalkToObjective extends MissionObjective {
    constructor(p: NativePointer) {
        super(p);
    }

    get targetName(): string {
        return this.ptr.add(0x550).readCString();
    }
    
    get iconType(): string {
        let types = [
            "exclamation",
            "gift",
            "interior_icon"
        ];
        return types[this.ptr.add(0x5a0).readU32()];
    }

    get float1(): number {
        return this.ptr.add(0x5a4).readFloat();
    }

    get float2(): number {
        return this.ptr.add(0x5a8).readFloat();
    }
}

export class GetInObjective extends MissionObjective {
    constructor(p: NativePointer) {
        super(p);
    }
}

export class GoToObjective extends MissionObjective {
    constructor(p: NativePointer) {
        super(p);
    }

    get targetName(): string {
        return this.ptr.add(0x56c).readCString();
    }

    get collectEffectName(): string {
        return this.ptr.add(0x58c).readCString();
    }

    getLocator(): IHudMapIconLocator {
        return new IHudMapIconLocator(this.ptr.add(0x5ac).readPointer().add(0x10));
    }
}

export class InteriorObjective extends MissionObjective {
    constructor(p: NativePointer) {
        super(p);
    }
}

const MissionTypes = [
    { name: "dummy", object: null },
    { name: "goto", object: GoToObjective },
    { name: "delivery", object: null }, 
    { name: "follow", object: null },
    { name: "destroy", object: null },
    { name: "race", object: null },
    { name: "losetail", object: null },
    { name: "talkto", object: TalkToObjective },
    { name: "dialogue", object: null },
    { name: "getin", object: GetInObjective },
    { name: "dump", object: null },
    { name: "fmv", object: null },
    { name: "interior", object: InteriorObjective },
    { name: "coins", object: null },
    { name: "destroyboss", object: null },
    { name: "loadvehicle", object: null },
    { name: "pickupitem", object: null },
    { name: "timer", object: null },
    { name: "buycar", object: null },
    { name: "buyskin", object: null },
    { name: "gooutside", object: null },
    { name: "invalid", object: null },
];

