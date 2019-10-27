class Tls {
    static _tlsfreeaddr     = ptr(Module.getExportByName("KERNEL32", "TlsFree"));
    static _tlsallocaddr    = ptr(Module.getExportByName("KERNEL32", "TlsAlloc"));
    static _tlssetvalueaddr = ptr(Module.getExportByName("KERNEL32", "TlsSetValue"));
    static _tlsgetvalueaddr = ptr(Module.getExportByName("KERNEL32", "TlsGetValue"));
    static _tlsfree         = new SystemFunction(this._tlsfreeaddr, 'int', ['int']);
    static _tlsalloc        = new SystemFunction(this._tlsallocaddr, 'int', []);
    static _tlssetvalue     = new SystemFunction(this._tlssetvalueaddr, 'int', ['int', 'pointer']);
    static _tlsgetvalue     = new SystemFunction(this._tlsgetvalueaddr, 'pointer', ['int']);

    static TlsFree(dwTlsIndex) {
        return this._tlsfree(dwTlsIndex);
    }

    static TlsAlloc() {
        return this._tlsalloc();
    }

    static TlsSetValue(dwTlsIndex, lpTlsValue) {
        return this._tlssetvalue(dwTlsIndex, lpTlsValue);
    }

    static TlsGetValue(dwTlsIndex) {
        return this._tlsgetvalue(dwTlsIndex);
    }
}
