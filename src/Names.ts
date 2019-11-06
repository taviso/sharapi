import "./frida"
import { Symbols } from "./Symbols";

var NameCache = new Map();

Interceptor.attach(Symbols.ptr("tName::MakeUID"), {
    onEnter: function (args: Array<NativePointer>): void {
        this.hashAddr   = args[0];
        this.gameStr    = args[1];
    },
    onLeave: function(retval: NativePointer): void {
        let hashVal: string;
        let gameStr: string;

        hashVal = this.hashAddr.readU64().toString();

        if (NameCache.has(hashVal))
            return;

        gameStr = this.gameStr.readCString();

        // Boring auto-generated names.
        if (gameStr.startsWith("FenceDSG"))
            return;

        NameCache.set(hashVal, gameStr);

        if (NameCache.size % 1024 == 0)
            console.log("NameCache occupancy", NameCache.size);
    },
});

export class Names {
    static lookupUid(hash: UInt64): string {
        return NameCache.get(hash.toString());
    }
}