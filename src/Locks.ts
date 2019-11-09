import "./frida"
import { Symbols } from "./Symbols";

export class Lock {
    private critsection: NativePointer;

    constructor() {
        this.critsection = Memory.alloc(6 * 4);
        Symbols.call<void>("KERNEL32!InitializeCriticalSection", this.critsection);
    }

    enter(): void {
        Symbols.call<void>("KERNEL32!EnterCriticalSection", this.critsection);
    }

    leave(): void {
        Symbols.call<void>("KERNEL32!LeaveCriticalSection", this.critsection);
    }

    delete(): void {
        Symbols.call<void>("KERNEL32!DeleteCriticalSection", this.critsection);
    }
}

export class SimpleLock extends Lock {
    private name: string;
    private handle: InvocationListener;
    
    constructor(symbol: string) {
        let lock: SimpleLock;
        super();
        this.name = symbol;
        lock = this;
        this.handle = Interceptor.attach(Symbols.addr(this.name), {
            onEnter: function (args: Array<NativePointer>): void {
                lock.enter();
            },
            onLeave: function(retval: NativePointer): void {
                lock.leave();
            },
        });
    }
}

export var WorldRenderLayerLock = new SimpleLock("WorldRenderLayer::Render");
export var WorldPhysicsLock = new SimpleLock("WorldPhysicsManager::Update");
export var ContextUpdateLock = new SimpleLock("Context::Update");
