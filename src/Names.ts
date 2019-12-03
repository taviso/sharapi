import "./frida"
import { Symbols } from "./Symbols"
import { Cache } from "./uidcache.js"

let NameCache = <Map<string, string>>new Map(<any>Cache);
let FenceDSGCount = 0;

console.log("NameCache initialized", NameCache.size, "entries");

Interceptor.attach(Symbols.addr("tName::MakeUID"), {
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
        if (gameStr.startsWith("FenceDSG")) {
            let num = parseInt(gameStr.substr(8));
            
            if (isNaN(num))
                return;
            
            if (num > FenceDSGCount)
                FenceDSGCount = num;
            return;
        }

        NameCache.set(hashVal, gameStr);

        if (NameCache.size % 2048 == 0)
            console.log("NameCache occupancy=", NameCache.size,
                        "FenceDSGCount=", FenceDSGCount,
                        "Last name=", gameStr);
    },
});

export class Names {
    static lookupUid(hash: UInt64): string {
        let result = NameCache.get(hash.toString());
        return result ? result : hash.toString();
    }
}