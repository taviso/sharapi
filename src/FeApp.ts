import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"

export class FeApp extends Base {
    static _GetInstance = Symbols.find("FeApp::GetInstance");

    constructor() {
        super(FeApp.GetInstance());
    }

    static GetInstance() {
        return FeApp._GetInstance();
    }

    GetProject(): FeProjectScroobyProject {
        var _GetProject = this.getVirtual(7, 'pointer', ['pointer']);
        return new FeProjectScroobyProject(_GetProject(this.ptr));
    }
    GetProjectIndex() {
        var _GetProjectIndex = this.getVirtual(8, 'int', ['pointer']);
        return _GetProjectIndex(this.ptr);
    }

    GetScreenHeight() {
        var _GetScreenHeight = this.getVirtual(21, 'int', ['pointer']);
        return _GetScreenHeight(this.ptr);
    }

    GetScreenWidth() {
        var _GetScreenWidth = this.getVirtual(22, 'int', ['pointer']);
        return _GetScreenWidth(this.ptr);
    }
}

class FeScreenScroobyScreen extends Base {
    constructor(p) {
        super(p);
    }

    GetPageByIndex(index) {
        var _GetPageByIndex = this.getVirtual(3, 'pointer', ['pointer', 'int']);
        return new FePageScroobyPage(_GetPageByIndex(this.ptr, index));
    }

    GetNumberOfPages() {
        var _GetNumberOfPages = this.getVirtual(4, 'int', ['pointer']);
        return _GetNumberOfPages(this.ptr);
    }

    SetScale(scale) {
        var _SetScale = this.getVirtual(5, 'float', ['pointer', 'float']);
        _SetScale(this.ptr, scale);
    }

    GetScale() {
        var _GetScale = this.getVirtual(6, 'float', ['pointer']);
        return _GetScale(this.ptr);
    }
}

class FeLayerScroobyOwner extends Base {
    constructor(p) {
        super(p);
    }

    Size() {
        var _Size = this.getVirtual(11, 'int', ['pointer']);
        return _Size(this.ptr);
    }
}

class FeLayerFeParent extends Base {
    constructor(p) {
        super(p);
    }

    AddChild(entity) {
        var _AddChild = this.getVirtual(0, 'void', ['pointer', 'pointer']);
        return _AddChild(this.ptr, entity.ptr);
    }
}

class FeLayerScroobyDrawable extends Base {
    constructor(p) {
        super(p);
        this.vbtable = this.ptr.add(0x10);
    }

    getFeParent() {
        return this.getSuper(0, FeLayer.FeParent);
    }

    getScroobyOwner() {
        return this.getSuper(1, FeLayer.Scrooby.Owner);
    }

    RotateX(deg) {
        var _RotateX = this.getVirtual(11, 'void', ['pointer', 'float']);
        return _RotateX(this.ptr, deg);
    }
    RotateY(deg) {
        var _RotateY = this.getVirtual(12, 'void', ['pointer', 'float']);
        return _RotateY(this.ptr, deg);
    }
    RotateZ(deg) {
        var _RotateZ = this.getVirtual(13, 'void', ['pointer', 'float']);
        return _RotateZ(this.ptr, deg);
    }
    Scale(factor) {
        var _Scale = this.getVirtual(15, 'void', ['pointer', 'float']);
        return _Scale(this.ptr, factor);
    }
    SetAlpha(factor) {
        var _SetAlpha = this.getVirtual(16, 'void', ['pointer', 'float']);
        return _SetAlpha(this.ptr, factor);
    }
    SetPosition(x, y) {
        var _SetPosition = this.getVirtual(18, 'void', ['pointer', 'int', 'int']);
        return _SetPosition(this.ptr, x, y);
    }
    SetVisible(visible) {
        var _SetVisible = this.getVirtual(22, 'void', ['pointer', 'int']);
        return _SetVisible(this.ptr, visible);
    }
}


export class FeLayer extends Base {
    static FeParent = FeLayerFeParent;
    static Scrooby = {
        Drawable: FeLayerScroobyDrawable,
        Owner: FeLayerScroobyOwner,
    };

    constructor(p) {
        super(p);
    }
}

class FePageScroobyPage extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetNumberOfLayers() {
        var _GetNumberOfLayers = this.getVirtual(2, 'int', ['pointer']);
        return _GetNumberOfLayers(this.ptr);
    }

    GetLayerByIndex(index): FeLayerScroobyDrawable {
        let _GetLayerByIndex = this.getVirtual(5, 'pointer', ['pointer', 'int']);
        let layer: NativePointer = _GetLayerByIndex(this.ptr, index);
        let idx: number = layer.readPointer().add(4).readU32();
        return new FeLayer.Scrooby.Drawable(layer.add(idx));
    }
}

class FeProjectScroobyProject extends Base {
    constructor(p: NativePointer) {
        super(p);
    }

    GetCurrentScreen(): FeScreenScroobyScreen {
        let _GetCurrentScreen = this.getVirtual(0, 'pointer', ['pointer']);
        return new FeScreenScroobyScreen(_GetCurrentScreen(this.ptr));
    }

    GetScreenCount(): number {
        let _GetScreenCount = this.getVirtual(8, 'int', ['pointer']);
        return _GetScreenCount(this.ptr);
    }
}

