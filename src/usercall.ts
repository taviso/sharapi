// These are two wrappers to generate stubs for usercall and userpurge functions,
// which frida does not support natively.
//
// Apart from setting up the registers correctly, we also need to backup and
// restore callee saved registers (ebx, edi, esi, ebp). This is necessary
// because msvc will happily ignore that convention for non-exported
// functions, and a ton of stuff (including frida) depends on it.
//
// These functions return a NativePointer that you must turn into NativeFunction.
//
// Example:
//
//  // Convert a __userpurge function into __stdcall, which Frida supports.
//  // PVOID __userpurge ExampleFunc<eax>(PVOID arg1<ecx>, INT arg2<ebx>, INT arg3, INT arg4);
//  NativeFunction(userpurge(["ecx, "ebx"], 4, 0x12345), // 4 total params
//                           'pointer',
//                           ['pointer', 'int', 'int', 'int'],
//                           'stdcall');

import "./frida"

/**
 * Generate a stub to call native userpurge functions.
 * @param convention Array of registers used as parameter in order.
 * @param params Total parameters, including stack and register arguments.
 * @param address Address of the thiscall function.
 * @param result Register where the return value is stored.
 */
export function userpurge(convention: Array<string>,
                          params: number,
                          address: number,
                          result="eax"): NativePointer
{
    var code = Memory.alloc(64);
    var gen = new X86Writer(code);

    // Callee saved registers
    gen.putPushReg("ebx");
    gen.putPushReg("edi");
    gen.putPushReg("esi");
    gen.putPushReg("ebp");

    // Recreate call stack
    for (var i = 0; i < params; i++) {
        // push dword [esp+n]
        gen.putBytes(new Uint8Array([ 0xFF, 0x74, 0x24]))
        gen.putU8(4 * 4 + 4 * params);
    }

    // Setup parameters.
    for (var i = 0; i < convention.length; i++) {
        gen.putPopReg(convention[i]);
    }

    // Callee will purge stack params, and we've 
    // already cleared the ones we use.
    gen.putCallAddress(ptr(address));

    // Fetch result
    gen.putMovRegReg("eax", result);

    // Restore callee saved registers.
    gen.putPopReg("ebp");
    gen.putPopReg("esi");
    gen.putPopReg("edi");
    gen.putPopReg("ebx");
    gen.putRet();
    gen.flush();

    console.log("userpurge(), params=", params, "size=", gen.offset, "addr=", code.toString());
    return code;
}

export function usercall(convention: Array<string>,
                         params: number,
                         address: number,
                         result="eax"): NativePointer
{
    var code = Memory.alloc(64);
    var gen = new X86Writer(code);

    // Callee saved registers
    gen.putPushReg("ebx");
    gen.putPushReg("edi");
    gen.putPushReg("esi");
    gen.putPushReg("ebp");

    // Recreate call stack
    for (var i = 0; i < params; i++) {
        gen.putBytes(new Uint8Array([ 0xFF, 0x74, 0x24]))
        gen.putU8(4 * 4 + 4 * params);
    }

    // Setup parameters.
    for (var i = 0; i < convention.length; i++) {
        gen.putPopReg(convention[i]);
    }

    gen.putCallAddress(ptr(address));

    // Clear stack. c.f. userpurge
    // FIXME: this is wrong.
    gen.putAddRegImm("esp", params * 4);

    // Fetch result
    gen.putMovRegReg("eax", result);

    // Restore callee saved registers.
    gen.putPopReg("ebp");
    gen.putPopReg("esi");
    gen.putPopReg("edi");
    gen.putPopReg("ebx");
    gen.putRet();
    gen.flush();

    console.log("usercall(), params=", params, "size=", gen.offset, "addr=", code.toJSON());
    return code;
}
