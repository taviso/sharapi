import "./frida"
import { Base } from "./Base"
import { Symbols } from "./Symbols"

export class EventManager extends Base {
    constructor() {
        super(EventManager.GetInstance());
    }

    private static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("EventManager::GetInstance");
    }

    static AddListener(eventNum: number, listener: EventListener): void {
        Symbols.call<void>("EventManager::AddListener", this.GetInstance(), eventNum, listener.toPointer());
    }

}

export class EventListener extends Base {
    private callback: NativeCallback;
    private wrapper: NativePointer;

    constructor(p: NativePointer) {
        super(p);
    }

    static createEventHandler(callback: (listener: NativePointer, eventNum: number, param: NativePointer) => any): EventListener {
        let obj = Memory.alloc(0x4);
        let vtable = Memory.alloc(0x8);
        let handler = new NativeCallback(callback, "void", ["pointer", "int", "pointer"]);
        let ev: EventListener;

        obj.writePointer(vtable);

        ev = new EventListener(obj);

        // Keep references to prevent gc from cleaning it up.
        ev.callback = handler;
        ev.vftable = vtable;
        ev.wrapper = genThiscallWrapper(handler, 3);

        // This is the HandleEvent method.
        vtable.add(0x4).writePointer(ev.wrapper);
        return ev;
    }
}

function genThiscallWrapper(param: NativeCallback, numArgs: number) {
    var impl = Memory.alloc(Process.pageSize);
    Memory.patchCode(impl, 64, function (code: NativePointer) {
        var cw = new X86Writer(code, { pc: impl });

        // Subtract one argument, because it's passed via register.
        numArgs--;

        // push dword [esp+n]
        for (let i = 0; i < numArgs; i++) {
            cw.putBytes(new Uint8Array([0xFF, 0x74, 0x24, 4 * numArgs]))
        }
        cw.putPushReg("ecx"); // this
        cw.putCallAddress(param);
        cw.putAddRegImm("esp", 4 + 4 * numArgs);
        cw.putRetImm(4 * numArgs);
        cw.flush();
    });
    return impl;
};

let EventCallbacks: Array<Array<Function>> = new Array();

Interceptor.attach(Symbols.addr("EventManager::TriggerEvent"), {
    onEnter: function (args: Array<NativePointer>): void {
        let eventNum = args[0].toInt32();
        EventCallbacks[eventNum]?.forEach((a: Function) => a.call(a, eventNum, args[1]));
    },
});

export class Event {
    static id = {
        EVENT_COLLECTED_COIN: 0x75,
    };

    static Listen(eventNum: number, callback: Function): void {
        if (!EventCallbacks[eventNum]) {
            EventCallbacks[eventNum] = new Array();
        }
        EventCallbacks[eventNum].push(callback);
    }
}