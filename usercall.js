function userpurge(convention, address)
{
    var code = Memory.alloc(Process.pageSize);
    var gen = new X86Writer(code);

    if (convention.includes("edi"))
        throw "fixme: no spare register";

    gen.putPopReg("edi"); // Save return address

    // Setup parameters.
    for (var i = 0; i < convention.length; i++) {
        gen.putPopReg(convention[i]);
    }

    gen.putPushReg("edi");
    gen.putJmpAddress(ptr(address));
    gen.flush();
    return code;
}

function UsercallWrapper(convention, address)
{
    var code = Memory.alloc(Process.pageSize);
    var slot = Tls.TlsAlloc().value;
    var gen = new X86Writer(code);

    // Save return address into TLS
    gen.putPopReg("eax");
    gen.putCallAddressWithArguments(Tls._tlssetvalue, [slot, "eax"]);

    // Setup parameters.
    for (var i = 0; i < convention.length; i++) {
        gen.putPopReg(convention[i]);
    }

    gen.putCallAddress(address);

    // Save result.
    gen.putPushReg("eax");
    gen.putCallAddressWithArguments(Tls._tlsgetvalue, [slot]);
    gen.putXchgRegRegPtr("eax", "esp");
    gen.putRet();
    gen.flush();
    return code;
}

