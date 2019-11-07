import "./frida"
import { Symbols } from "./Symbols"

export class CommandLineOptions {
    static flags = {
        NOEFFECTS:      1,
        NODIALOG:       2,
        RANDOMBUTTONS:  12,
    }

    private static getOptionsPtr(): NativePointer {
        return Symbols.addr("CommandLineOptions::sOptions");
    }

    static getFlag(n: number): boolean {
        return !! (CommandLineOptions.getOptionsPtr().readU64().toNumber() & (1 << n))
    }

    static setFlag(n: number) {
        CommandLineOptions.getOptionsPtr().writeU64(
            CommandLineOptions.getOptionsPtr().readU64().toNumber() | (1 << n)
        );
    }

    static clearFlag(n: number) {
        CommandLineOptions.getOptionsPtr().writeU64(
            CommandLineOptions.getOptionsPtr().readU64().toNumber() & ~(1 << n)
        );
    }
}
