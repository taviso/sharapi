//Interceptor.attach(ptr(0x4344D0), {
//   onEnter: function (args) {
//       console.log("Mouse::Input a2=",this.context.edx.toInt32(), "a4=",this.context.ebx.toInt32())
//   },
//});

//  Interceptor.attach(ptr(0x434150), {
//     onEnter: function (args) {
//         console.log("Keyboard::Input Key=",this.context.edx.toInt32(), "Event=",this.context.ebx.toInt32())
//     },
//  });

class Button {
    static _TickCount = Symbol.ptr("Button::mTickCount");
    static get TickCount() {
        return Button._TickCount.readU32();
    }
}

class Mappable {
    static _DispatchOnButton = Symbol.find("Mappable::DispatchOnButton");
    static _IsActive = Symbol.find("Mappable::IsActive");
    static _IsButtonDown = Symbol.find("Mappable::IsButtonDown");
    static _UpdateButtonState = Symbol.find("Mappable::UpdateButtonState");

    constructor(ptr) {
        this._mappable = ptr;
    }

    DispatchOnButton(i, code, s) {
        var f = Memory.alloc(4).writeFloat(s);
        Mappable._DispatchOnButton(this._mappable, i, code, f);
        return r.readFloat();
    }

    IsActive() {
        return !! Mappable._IsActive(this._mappable);
    }

    IsButtonDown(index) {
        return !! Mappable._IsButtonDown(index, this._mappable);
    }

    // This kinda works, I don't know what the last parameter is, it doesn't
    // seem to be used.
    UpdateButtonState(state, index) {
        var b = Memory.alloc(8);
        b.add(0).writeFloat(state);
        b.add(4).writeU32(+Button.Tickcount);
        return Mappable._UpdateButtonState(this._mappable, b, index, 0);
    }

}

class UserController {
    constructor(ptr) {
        this._controller = ptr;
    }

    GetMappable(num) {
        return new Mappable(this._controller
            .add(0x3c)
            .add(num * 4)
            .readPointer());
    }
}

class InputManager
{
    static _GetInstance = Symbol.find("InputManager::GetInstance");
    static _GetController = Symbol.find("InputManager::GetController");

    static GetInstance() {
        return this._GetInstance();
    }

    static GetController(num = 0) {
        return new UserController(this._GetController(this._GetInstance(), num));
    }

    // FIXME: I don't know what this thing is.
    static GetContext() {
        return this._GetInstance().add(0x8).readU32();
    }
}

// var m = InputManager.GetController().GetMappable(2);
// m.UpdateButtonState(1.0, 7);


