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

    constructor(state) {
        this._button = Memory.alloc(8);
        this._button.add(0).writeFloat(state);
        this._button.add(4).writeU32(Button.TickCount);
    }

    static get TickCount() {
        return Button._TickCount.readU32();
    }

    get addr() {
        return this._button;
    }

    get state() {
        return this._button.add(0).readFloat();
    }

    set state(value) {
        return this._button.add(0).writeFloat(value);
    }
}

class Mapper {
    static _GetLogicalIndex = Symbol.find("Mapper::GetLogicalIndex");
    static MAX_BUTTONS = 0x53;

    constructor(ptr) {
        this._mapper = ptr;
    }

    GetLogicalIndex(code) {
        return Mapper._GetLogicalIndex(this._mapper, code);
    }

    GetCodeFromLogicalIndex(index) {
        for (var i = 0; i < Mapper.MAX_BUTTONS; i++) {
            if (this.GetLogicalIndex(i) == index)
                return i;
        }
        return -1;
    }
}

class Mappable {
    static _DispatchOnButton = Symbol.find("Mappable::DispatchOnButton");
    static _IsActive = Symbol.find("Mappable::IsActive");
    static _IsButtonDown = Symbol.find("Mappable::IsButtonDown");
    static _UpdateButtonState = Symbol.find("Mappable::UpdateButtonState");
    static _GetActiveMapper = Symbol.find("Mappable::GetActiveMapper");

    static id = {
        Camera: {
            CameraLeft:         17,
            CameraRight:        16,
            CameraMoveIn:       18,
            CameraMoveOut:      19,
            CameraZoom:         2,
            CameraLookUp:       3,
            CameraCarLeft:      20,
            CameraCarRight:     21,
            CameraCarLookUp:    22,
            CameraToggle:       15,
            feSelect:           9,
            feMouseUp:          23,
            feMouseDown:        24,
        },
        Gui: {
            feMoveLeft:         0,
            feMoveRight:        1,
            feMoveUp:           2,
            feMoveDown:         3,
            feStart:            11,
            feBack:             13,
            feSelect:           12,
            feFunction1:        14,
            feFunction2:        5,
            feMiniStart:        11,
            Accelerate:         22,
            Reverse:            23,
            SteerLeft:          24,
            SteerRight:         25,
        },
        Fmv: {  // Unbound?
            feStart:            0,
            feBack:             0,
            feKeyboardBack:     0,
            feSelect:           0,
        },
        Vehicle: {
            SteerLeft:          1,
            SteerRight:         2,
            Accelerate:         4,
            Reverse:            5,
            HandBrake:          10,
            Horn:               6,
            ResetCar:           7,
        },
        VehicleAlternate: {
            P1_KBD_Left:        1,
            P1_KBD_Right:       2,
            P1_KBD_Gas:         4,
            P1_KBD_Brake:       5,
            P1_KBD_EBrake:      10,
            P1_KBD_Nitro:       6,
        },
        Character: {
            MoveUp:             7,
            MoveDown:           8,
            MoveLeft:           9,
            MoveRight:          10,
            DoAction:           3,
            GetOutCar:          11,
            Jump:               4,
            Sprint:             5,
            Attack:             6,
            feMouseRight:       13,
            feMouseLeft:        12,
        },
        CheatInput: {
            feMoveUp:           0,
            feMoveDown:         1,
            feMoveLeft:         2,
            feMoveRight:        3,
            feFunction1:        4,
        },
        Sprint: {
            Pause:              0,
            Attack:             1,
            Jump:               2,
            MoveRight:          4,
            MoveLeft:           3,
            MoveX:              5,
            CameraToggle:       6,
        },
    };

    constructor(ptr) {
        this._mappable = ptr;
    }

    DispatchOnButton(code, state = 1.0) {
        var b = new Button(state);
        return Mappable._DispatchOnButton(this._mappable, 0, code, b.addr);
    }

    IsActive() {
        return !! Mappable._IsActive(this._mappable);
    }

    IsButtonDown(index) {
        return !! Mappable._IsButtonDown(index, this._mappable);
    }

    // This kinda works, I don't know what the last parameter is, it doesn't
    // seem to be used.
    UpdateButtonState(index, state = 1.0) {
        var b = new Button(state);
        return Mappable._UpdateButtonState(this._mappable, b.addr, index, 0);
    }

    GetActiveMapper() {
        return new Mapper(Mappable._GetActiveMapper(this._mappable));
    }

    // Convenience Function to press Jump/Attack/etc
    SimulateKeyPress(key) {
        var code = this.GetActiveMapper().GetCodeFromLogicalIndex(key);

        if (code < 0)
            return false;

        this.DispatchOnButton(code, 1.0);
        Thread.sleep(0.1);
        this.DispatchOnButton(code, 0.0);

        return true;
    }

    // Convenience Function to toggle key status, for Move/Sprint/etc.
    ToggleKeyDown(key) {
        if (this.IsButtonDown(key)) {
            this.UpdateButtonState(key, 0.0);
            return 0;
        } else {
            this.UpdateButtonState(key, 1.0);
            return 1;
        }
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
// // Start moving
// m.UpdateButtonState(Mappable.id.Character.MoveUp, 1.0);
// // Start sprinting
// m.UpdateButtonState(Mappable.id.Character.Sprint, 1.0);

// // Jump in the air



