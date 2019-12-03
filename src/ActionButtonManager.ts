import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"
import { Names } from "./Names";
import { IHudMapIconLocator } from "./Mission";

export class ActionButtonManager extends Base {
    constructor() {
        super(ActionButtonManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("ActionButtonManager::GetInstance");
    }

    public static GetActionByIndex(index: number): ActionButton {
        return new ActionButton(this.GetInstance().add(0x8
                + index * 16
                + 0).readPointer());
    }
}

export class ActionButton extends Base {
    private ActionTypes = [
        "generic",              // 0
        "unknown",              // 1
        "summonvehiclephone",   // 2
        "enterinterior",        // 3
        "animswitch",           // 4
        "purchasecar",          // 5
        "purchaseskin",         // 6
        "getincar",             // 7
        "collectiblecard",      // 8
        "unknown",              // 9
        "wrenchicon",           // 10
        "nitroicon",            // 11
        "teleport",             // 12
        "actionevent",          // 13
    ];
    constructor(p: NativePointer) {
        super(p);
    }

    get eventLocator(): EventLocator {
        return new EventLocator(this.ptr.add(0xc).readPointer());
    }

    UsesActionButton(): boolean {
        return !! this.callVirtual<number>(7, "int");
    }

    GetType(): string {
        return this.ActionTypes[this.callVirtual<number>(10, "int")];
    }

    IsInstanceEnabled(): boolean {
        return !! this.callVirtual<number>(11, "int");
    }
}

export class EventLocator extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    get eventName(): string {
        return Names.lookupUid(this.ptr.add(0x8).readU64());
    }

    getLocator(): IHudMapIconLocator {
        return new IHudMapIconLocator(this.ptr.add(0x10));
    }

    GetNumTriggers(): number {
        return this.callVirtual<number>(5, "int");
    }
}