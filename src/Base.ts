import "./frida"

export class Base {
    protected ptr: NativePointer;
    protected vbtable: NativePointer;
    private vftable: NativePointer;

    constructor(p: NativePointer) {
        if (!p || p == NULL)
            throw "Constructing class with NULL pointer";

        console.log(this.constructor['name'], "@", p.toString());

        this.ptr = p;
        this.vftable = p.readPointer();
    }

    public toPointer(): NativePointer {
        return this.ptr;
    }

    protected getVirtual(index: number,
                         returnType: string,
                         argTypes: Array<string>,
                         abi='thiscall'): NativeFunction {
        return new NativeFunction(this.vftable.add(index * 4).readPointer(),
                                  returnType,
                                  argTypes,
                                  abi);
    }

    protected getSuper(index: number, superClass: any): any {
        if (!this.vbtable)
            throw "Cannot get super class without base table";
        var offset  = this.vbtable.readPointer().add(index * 4).readU32();
        return new superClass(this.vbtable.add(offset));
    }
}
