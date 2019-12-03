// This file is based on http://www.frida.re/docs/javascript-api

type bool = number;

declare function hexdump(target: NativePointer, options?: object): void;
declare function int64(v: string | number): Int64;
declare function uint64(v: string | number): UInt64;
declare function ptr(v: string | number): NativePointer;
declare var NULL: NativePointer;

// TODO: recv([type, ]callback)
declare function recv(callback);
declare function send(message, data?);
declare function setTimeout(fn, delay);
declare function clearTimeout(id);
declare function setInterval(fn, delay);
declare function clearInterval(id);

declare var rpc: {
    exports: {}
}

declare namespace Frida {
    var version: string;
}

declare namespace Process {
    var arch: string;
    var platform: string;
    var pageSize: number;
    var pointerSize: number;
    function isDebuggerAttached();
    function getCurrentThreadId();
    function enumerateThreads(callbacks: { onMatch: (thread) => string, onComplete: () => void });
    function enumerateThreadsSync(): Array<any>;
    function findModuleByAddress(address);
    function getModuleByAddress(address);
    function findModuleByName(name);
    function getModuleByName(name);
    function enumerateModules(callbacks: { onMatch: (module) => string, onComplete: () => void });
    function enumerateModulesSync();
    function findRangeByAddress(address);
    function getRangeByAddress(address);
    function enumerateRanges(protection_or_specifier, callbacks: { onMatch: (range) => string, onComplete: () => void });
    function enumerateRangesSync(protection_or_specifier);
    function enumerateMallocRanges(callbacks: { onMatch: (range) => string, onComplete: () => void });
    function enumerateMallocRangesSync(protection);
}

declare namespace Module {
    function enumerateImports(name, callbacks: { onMatch: (imp) => string, onComplete: () => void });
    function enumerateImportsSync(name);
    function enumerateExports(name, callbacks: { onMatch: (imp) => string, onComplete: () => void });
    function enumerateExportsSync(name);
    function enumerateRanges(name, protection, callbacks: { onMatch: (range) => string, onComplete: () => void });
    function enumerateRangesSync(name, protection);
    function findBaseAddress(name);
    function findExportByName(module: string | null, exp: string): NativePointer | null;
    function getExportByName(module: string | null, exp: string): NativePointer;
}

declare namespace Memory {
    function scan(address, size, pattern, callbacks: { onMatch: (address, size) => string, onError: (reason) => void, onComplete: () => void });
    function scanSync(address, size, pattern);
    function alloc(size): NativePointer;
    function copy(dst, src, n);
    function dup(address, size);
    function protect(address, size, protection);
    function allocUtf8String(str): NativePointer;
    function allocUtf16String(str): NativePointer;
    function allocAnsiString(str): NativePointer;
    function patchCode(address, size, apply): void;
}

declare namespace MemoryAccessMonitor {
    function enable(ranges, callbacks: { onAccess: (details) => void });
    function disable();
}

declare namespace Thread {
    function backtrace(context?, backtracer?: Backtracer);
    function sleep(delay: number);
}

declare enum Backtracer {
    ACCURATE,
    FUZZY
}

declare class Int64 {
    constructor(v);
    add(rhs: Int64 | number): Int64;
    sub(rhs: Int64 | number): Int64;
    and(rhs: Int64 | number): Int64;
    or(rhs: Int64 | number): Int64;
    xor(rhs: Int64 | number): Int64;
    shr(n: number): Int64;
    shl(n: number): Int64;
    compare(rhs: Int64 | number);
    toNumber(): number;
    toString(radix?);
}

declare class UInt64 {
    constructor(v);
    add(rhs: UInt64 | number): UInt64;
    sub(rhs: UInt64 | number): UInt64;
    and(rhs: UInt64 | number): UInt64;
    or(rhs: UInt64 | number): UInt64;
    xor(rhs: UInt64 | number): UInt64;
    shr(n: number): UInt64;
    shl(n: number): UInt64;
    compare(rhs: UInt64 | number);
    toNumber(): number;
    toString(radix?);
}

declare class X86Writer {
    offset: number;
    constructor(codeAddress: NativePointer, options?: object);
    flush();
    putRet();
    putRetImm(immValue: number);
    putPopReg(reg: string);
    putMovRegReg(dstReg: string, srcReg: string);
    putAddRegImm(dstReg: string, immValue: number);
    putSubRegImm(dstReg: string, immValue: number);
    putCallAddress(address: NativePointer);
    putU8(value: number);
    putBytes(data: ArrayBuffer);
    putPushReg(reg: string);
}


declare class NativePointer {
    constructor(s);
    add(rhs: NativePointer | number): NativePointer;
    sub(rhs: NativePointer | number): NativePointer;
    and(rhs: NativePointer | number): NativePointer;
    or(rhs: NativePointer | number): NativePointer;
    xor(rhs: NativePointer | number): NativePointer;
    shr(n: number): NativePointer;
    shl(n: number): NativePointer;
    equals(rhs: NativePointer);
    compare(rhs: NativePointer | number);
    toInt32(): number;
    toString(radix?);
    toMatchPattern(): string;
    readPointer(): NativePointer;
    writePointer(ptr: NativePointer);
    readS8(): number;
    readU8(): number;
    readS16(): number;
    readU16(): number;
    readS32(): number;
    readU32(): number;
    // readShort(address);
    // readUShort(address);
    // readInt(address);
    // readUInt(address);
    readFloat(): number;
    // readDouble(address);
    // writeS8(address, value);
    // writeU8(address, value);
    // writeS16(address, value);
    // writeU16(address, value);
    // writeS32(address, value);
    writeU32(value: number);
    // writeShort(address, value);
    // writeUShort(address, value);
    // writeInt(address, value);
    // writeUInt(address, value);
    writeFloat(value: number);
    // writeDouble(address, value);
    // readS64(address): Int64;
    readU64(): UInt64;
    // readLong(address): Int64;
    // readULong(address): UInt64;
    // writeS64(address, value: Int64);
    writeU64(value: number);
    // writeLong(address, value: Int64);
    // writeULong(address, value: UInt64);
    // readByteArray(address, length): ArrayBuffer;
    // writeByteArray(address, bytes: ArrayBuffer | Array<any>);
    readCString(size?: number): string;
    readUtf8String(size?: number) : string;
    readUtf16String(length?: number): string;
    // readAnsiString(address, size?);
    // writeUtf8String(address, str);
    // writeUtf16String(address, str);
    // writeAnsiString(address, str);
    toJSON(): string;
}

interface NativeFunction {
    (...args: Array<NativePointer|number>);
}

declare class NativeFunction extends NativePointer {
    constructor(address: NativePointer,
                returnType: string,
                argTypes: Array<string>,
                abi?: string);
}

declare class NativeCallback extends NativePointer {
    constructor(func, returnType, argTypes, abi?);
}

declare namespace Socket {
    function type(handle): string;
    function localAddress(handle): { ip: string, port: number, path: string };
    function peerAddress(handle): { ip: string, port: number, path: string };
}

declare abstract class Stream {
    close();
}

declare abstract class InputStream extends Stream {
    // TODO: the read and readAll functions return type should be Promise<ArrayBuffer>
    read(size: number): any;
    readAll(size: number): any;
}

declare abstract class OutputStream extends Stream {
    write(data: ArrayBuffer | Array<number>): any;
    writeAll(data: ArrayBuffer | Array<number>): any;
}

declare class UnixInputStream extends InputStream {
    constructor(fd, options?: { autoClose: boolean });
}

declare class UnixOutputStream extends OutputStream {
    constructor(fd, options?: { autoClose: boolean });
}

declare class Win32InputStream extends InputStream {
    constructor(handle, options?: { autoClose: boolean });
}

declare class Win32OutputStream extends OutputStream {
    constructor(handle, options?: { autoClose: boolean });
}

// Cannot define class File, because of default typescript definition in lib.d.ts
// declare class File {
// }

declare interface InvocationListener {
    detach(): void;
}

declare namespace Interceptor {
    function attach(target: NativePointer, callbacks: { onEnter: (args) => void, onLeave?: (retval: NativePointer) => void }): InvocationListener;
    function detachAll();
    function replace(target: NativePointer, replacement: NativeCallback);
    function revert(target: NativePointer);
}

declare namespace Stalker {
    function follow(threadId?, options?: { events: { call: boolean, ret: boolean, exec: boolean }, onReceive: (events) => void, onCallSummary: (summary) => void });
    function unfollow(threadId?);
    function garbageCollect();
    function addCallProbe(address, callback: (args) => void);
    var thrustThreshold: number;
    var queueCapacity: number;
    var queueDrainInterval: number;
}

declare class ApiResolver {
    constructor(type);
    enumerateMatches(query: string, callbacks: { onMatch: (match) => void, onComplete: () => void });
    enumerateMatchesSync(query: string);
}

declare namespace DebugSymbol {
    function fromAddress(address);
    function getFunctionByName(name: string): NativePointer;
    function findFunctionsNamed(name: string): NativePointer[];
    function findFunctionsMatching(glob: string): NativePointer[];
}

declare namespace Instruction {
    function parse(target: NativePointer);
}

declare namespace ObjC {
    var available: boolean;
    var api: any;
    var classes: any;
    var protocols: any;
    var mainQueue: any;
    function schedule(queue, work);
    class Object {
        constructor(handle: NativePointer, protocol?);
        $kind: string;
        $super: ObjC.Object;
        $superClass: ObjC.Object;
        $class: ObjC.Object;
        $className: string;
        $protocols: ObjC.Protocol[];
        $methods: string[];
        equals(other: ObjC.Object): boolean;
    }

    class Protocol {
        constructor(handle: NativePointer);
    }

    function implement(method, fn): NativeCallback;
    function registerProxy(properties: { protocols?, methods?, events?});
    function registerClass(properties: { name?, super?, protocols?, methods?});
    function registerProtocol(properties: { name?, protocols?, methods?});
    function bind(obj: ObjC.Object, data);
    function unbind(obj: ObjC.Object);
    function getBoundData(obj: ObjC.Object);
    function choose(specifier, callbacks: { onMatch: (instance) => void, onComplete: () => void });
    function chooseSync(specifier);
    function selector(name: string);
    function selectorAsString(sel): string;
}

declare namespace Java {
    var available: boolean;
    function enumerateLoadedClasses(callbacks: { onMatch: (className) => void, onComplete: () => void });
    function perform(fn);
    function use(className);
    function choose(className, callbacks: { onMatch: (instance) => string | void, onComplete: () => void });
    function cast(handle, klass);
}

declare namespace WeakRef {
    function bind(value, fn);
    function unbind(id);
}
