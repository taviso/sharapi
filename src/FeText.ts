import "./frida"
import { Base } from "./Base";
import { Symbols } from "./Symbols";

export class tName extends Base {
    private name: NativePointer;

    constructor(str: string) {
        let Init = Symbols.find("tName::Init");

        super(Memory.alloc(0xC));
        this.name = Memory.allocAnsiString(str);
        Init(this.ptr, this.name);
    }

    public getString(): string {
        return this.name.readUtf8String();
    }
}

// 0x00 vftable
// 0x10 vbtable
//   0 -> FeText
//   4 -> ScroobyDrawable
//   8 -> ScroobyHasBoundingBox
//   C -> ScroobyBoundedDrawable
//  10 -> ScroobyOwner
//  14 -> ScroobyText

/*
var f = new FeText("Message", 150, 350);
f.AddHardCodedString("Hello!");
f.SetTextStyle("font0_16");
var app = new FeApp();
var layer = app.GetProject().GetCurrentScreen().GetPageByIndex(0).GetLayerByIndex(0);
var parent = layer.getFeParent();
parent.AddChild(f);
*/

class FeTextScroobyDrawable extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    Display(): void {
        let _Display = this.getVirtual(0, 'void', ['pointer']);
        _Display(this.ptr);
    }


    SetColour(color: number): void {
        let _SetColour = this.getVirtual(17, 'void', ['pointer', 'int']);
        _SetColour(this.ptr, color);
    }
}

export class FeText extends Base {
    private name: tName;
    private strings: Array<NativePointer>;

    static Scrooby = {
        Drawable: FeTextScroobyDrawable,
    };

    constructor(name: string, x: number, y: number) {
        let n: tName = new tName(name);
        let p: NativePointer = Memory.alloc(0x120);
        let _Init = Symbols.find("FeText::Init");

        _Init(p, n.toPointer(), x, y, 1);

        super(p);

        this.name = n;
        this.vbtable = this.ptr.add(0x10);
        this.strings = new Array();
    }

    AddHardCodedString(str: string): void {
        let newString = Memory.allocUtf8String(str);
        Symbols.call<void>("FeText::AddHardCodedString", this.ptr, newString);

        // Keep a reference to avoid gc.
        this.strings.push(newString);

        return;
    }

    toScroobyBoundedDrawable(): FeTextScroobyBoundedDrawable {
        return this.getSuper(3, FeTextScroobyBoundedDrawable);
    }

    toScroobyDrawable(): FeTextScroobyDrawable {
        return this.getSuper(1, FeTextScroobyDrawable);
    }

    toScroobyText(): FeTextScroobyText {
        return this.getSuper(5, FeTextScroobyText);
    }

    getFeParent(): FeTextFeParent {
        return new FeTextFeParent(this.ptr.add(0xA4));
    }

    SetTextStyle(font: string): void {
        let _SetTextStyle = Symbols.find("FeText::SetTextStyle");
        _SetTextStyle(this.ptr, Memory.allocAnsiString(font));
    }
}

class FeTextFeParent extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    Resize(size: number) {
        let _Resize = Symbols.find("FeParent::Resize");
        return _Resize(this.ptr, size);
    }

    RemoveChild(child: FeText): void {
        Symbols.call<void>("FeParent::RemoveChild", this.ptr, child.toPointer());
    }

    ReplaceChild(oldChild: FeText, newChild: FeText): void {
        Symbols.call<void>("FeParent::ReplaceChild",
            this.ptr,
            oldChild.toPointer(),
            newChild.toPointer()
        );
    }
}

class FeTextScroobyBoundedDrawable extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    SetBoundingBoxSize(x: number, y: number): void {
        let _SetBoundingBoxSize: NativeFunction;
        _SetBoundingBoxSize = this.getVirtual(0, 'void', ['pointer', 'int', 'int']);
        _SetBoundingBoxSize(this.ptr, x, y);
    }

    SetHorizontalJustification(justification: number): void {
        let _SetHorizontalJustification: NativeFunction;
        _SetHorizontalJustification = this.getVirtual(1, 'void', ['pointer', 'int']);
        _SetHorizontalJustification(this.ptr, justification);
    }

    SetVerticalJustification(justification): void {
        let _SetVerticalJustification: NativeFunction;
        _SetVerticalJustification = this.getVirtual(2, 'void', ['pointer', 'int']);
        _SetVerticalJustification(this.ptr, justification);
    }
}

class FeTextScroobyText extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    RestoreDefaultColour() : void {
        this.callVirtual<void>(0);
    }

    GetIndex(): number {
        return this.callVirtual<number>(1);
    }

    SetIndex(index: number): void {
        this.callVirtual<void>(2, 'void', ["int"], index);
    }

    GetNumOfStrings(): number {
        return this.callVirtual<number>(3, 'int');
    }

    GetStringNum(num: number): string {
        let wptr = Memory.alloc(4).writeU32(num);
        this.callVirtual<void>(4, 'pointer', ["pointer"], wptr);
        return wptr.readPointer().readUtf16String();
    }

    GetString(): string {
        let wptr = Memory.alloc(4);
        this.callVirtual<void>(5, 'pointer', ["pointer"], wptr);
        return wptr.readPointer().readUtf16String();
    }

    GetStringBuffer(): NativePointer {
        return this.callVirtual<NativePointer>(7, 'pointer');
    }

    SetDisplayShadow(status: boolean): void {
        let _SetDisplayShadow = this.getVirtual(16, 'void', ['pointer', 'bool']);
        _SetDisplayShadow(this.ptr, +status);
    }

    IsDisplayingShadow(): boolean {
        return this.callVirtual<boolean>(17, 'bool');
    }

    SetShadowOffset(x: number, y: number): void {
        let _SetShadowOffset = this.getVirtual(18, 'void', ['pointer', 'int', 'int']);
        _SetShadowOffset(this.ptr, x, y);
    }

    SetShadowColour(color: number): void {
        let _SetShadowColour = this.getVirtual(21, 'void', ['pointer', 'int']);
        _SetShadowColour(this.ptr, color);
    }
}
