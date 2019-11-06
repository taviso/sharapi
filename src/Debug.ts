import "./frida"
import { Symbols } from "./Symbols"

export class Debug {
    static logGameStringUIDs(filename: string): InvocationListener {
        var file = new File(<any>filename, "wb");
        var cacheObj = new Map();

        console.log("Logging UIDs to", filename);

        return Interceptor.attach(Symbols.ptr("tName::MakeUID"), {
            onEnter: function (args: Array<NativePointer>) {
                this.hashAddr   = args[0];
                this.gameStr    = args[1].readCString();
            },
            onLeave: function(retval) {
                let hashVal: UInt64;

                if (cacheObj.has(this.gameStr))
                    return;

                if (this.gameStr.startsWith("FenceDSG"))
                    return;

                hashVal = this.hashAddr.readU64();
                
                cacheObj.set(this.gameStr, hashVal.toString(16));

                console.log("tName::MakeUID", this.gameStr, hashVal.toString(16));

                // @ts-ignore
                file.write(`"${this.gameStr}":"${hashVal.toString()}"\n`);
            },
        });
    }
}