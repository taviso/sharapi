import "./frida"
import { Base } from "./Base";
import { Symbols } from "./Symbols";

export class tName extends Base {
    private name: NativePointer;

    constructor(str: string) {
        let Init: NativeFunction = Symbols.find("tName::Init");

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
var f = new FeText("ActionTextLabel2", 0x72, 0x140);
f.getFeParent().Resize(0x40);
f.AddHardCodedString("Hello!");
f.toScroobyBoundedDrawable().SetBoundingBoxSize(0x1A4, 0x10);
f.toScroobyBoundedDrawable().SetVerticalJustification(2);
f.toScroobyBoundedDrawable().SetHorizontalJustification(4);
f.toScroobyDrawable().SetColour(0xFFFFFFFF);
f.SetTextStyle("font0_16");
f.toScroobyText().SetDisplayShadow(0x1);
f.toScroobyText().SetShadowColour(0xC00000);
f.toScroobyText().SetShadowOffset(2, -2);
f.toScroobyText().SetIndex(0);


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
        let _Display: NativeFunction = this.getVirtual(0, 'void', ['pointer']);
        _Display(this.ptr);
    }


    SetColour(color: number): void {
        let _SetColour: NativeFunction;
        _SetColour = this.getVirtual(17, 'void', ['pointer', 'int']);
        _SetColour(this.ptr, color);
    }
}

export class FeText extends Base {
    private name: tName;
    static Scrooby = {
        Drawable: FeTextScroobyDrawable,
    };

    constructor(name: string, x: number, y: number) {
        let n: tName = new tName(name);
        let p: NativePointer = Memory.alloc(0x120);
        let _Init: NativeFunction = Symbols.find("FeText::Init");

        _Init(p, n.toPointer(), x, y, 1);

        super(p);

        this.name = n;
        this.vbtable = this.ptr.add(0x10);
    }

    AddHardCodedString(str: string): void {
        let _AddHardCodedString: NativeFunction = Symbols.find("FeText::AddHardCodedString");
        _AddHardCodedString(this.ptr, Memory.allocAnsiString(str));
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
        let _SetTextStyle: NativeFunction = Symbols.find("FeText::SetTextStyle");
        _SetTextStyle(this.ptr, Memory.allocAnsiString(font));
    }
}

class FeTextFeParent extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    Resize(size: number) {
        let _Resize: NativeFunction = Symbols.find("FeParent::Resize");
        return _Resize(this.ptr, size);
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

    SetIndex(index: number): void {
        let _SetIndex: NativeFunction = this.getVirtual(2, 'void', ['pointer', 'int']);
        _SetIndex(this.ptr, index);
    }

    SetDisplayShadow(status: boolean): void {
        let _SetDisplayShadow: NativeFunction = this.getVirtual(16, 'void', ['pointer', 'bool']);
        _SetDisplayShadow(this.ptr, +status);
    }

    IsDisplayingShadow(): boolean {
        let _IsDisplayingShadow: NativeFunction = this.getVirtual(17, 'bool', ['pointer']);
        return _IsDisplayingShadow(this.ptr);
    }

    SetShadowOffset(x: number, y: number): void {
        let _SetShadowOffset: NativeFunction = this.getVirtual(18, 'void', ['pointer', 'int', 'int']);
        _SetShadowOffset(this.ptr, x, y);
    }

    SetShadowColour(color: number): void {
        let _SetShadowColour: NativeFunction = this.getVirtual(21, 'void', ['pointer', 'int']);
        _SetShadowColour(this.ptr, color);
    }
}
