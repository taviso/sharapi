import "./frida"

export class Base {
    protected ptr: NativePointer;
    protected vbtable: NativePointer;
    private vftable: NativePointer;

    constructor(p: NativePointer) {
        if (!p || p == NULL || p.toInt32() == 0)
            throw "Constructing class with NULL pointer";

        console.log(this.constructor['name'], "@", p.toString());

        this.ptr = p;
        this.vftable = p.readPointer();
    }

    /**
     * Get a NativePointer for this object.
     */
    public toPointer(): NativePointer {
        return this.ptr;
    }

    /**
     * Get a pointer to a vtable entry for this object.
     * @param index vtable entry index
     * @param returnType frida NativeFunction return type
     * @param argTypes frida parameters
     * @param abi frida NativeFunction abi, thiscall is normal for virtual calls.
     */
    protected getVirtual(index: number,
                         returnType: string,
                         argTypes: Array<string>,
                         abi='thiscall'): NativeFunction {
        return new NativeFunction(this.vftable.add(index * 4).readPointer(),
                                  returnType,
                                  argTypes,
                                  abi);
    }

    /**
     * Convenience wrapper to call thiscall virtual functions, useful for
     * the common case to avoid boilerplate code.
     * 
     * DO NOT INCLUDE this in argTypes, it is added automatically.
     *
     * @param index vtable entry index
     * @param returnType frida Nativefunction return type
     * @param argTypes frida Parameters, do not include the this parameter.
     * @param args Arguments
     */
    protected callVirtual<T>(index: number,
                          returnType: string = 'void',
                          argTypes: Array<string> = [],
                          ...args:Array<NativePointer | number | boolean>): T {
        let func: NativeFunction;
        let argTypesCopy: Array<string> = Array.from(argTypes);
        let argsCopy: Array<NativePointer | number | boolean> = Array.from(args);

        if (args.length != argTypes.length) {
            throw "argTypes count does not provided match arguments";
        }

        // Add implicit this parameter
        argTypesCopy.unshift("pointer");
        argsCopy.unshift(this.ptr);

        // Call vtable entry and cast to specified type.
        func = this.getVirtual(index, returnType, argTypesCopy);
        return <T>func.apply(func, argsCopy);
    }

    protected getSuper<T extends Base>(index: number, superClass: {new(p: NativePointer): T}): T {
        if (!this.vbtable)
            throw "Cannot get super class without base table";
        var offset  = this.vbtable.readPointer().add(index * 4).readU32();
        return new superClass(this.vbtable.add(offset));
    }

    // FIXME: should verify an object is reference counted.

    /**
     * Add a reference count to this object.
     */
    protected AddRef(): void {
        this.callVirtual<void>(0);
    }

    /**
     * Remove a reference count from this object.
     */
    protected Release(): number {
        return this.callVirtual<number>(1, 'uint32');
    }
}
