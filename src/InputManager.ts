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

import "./frida"
import { Symbols } from "./Symbols"
import { Base } from "./Base"

export class Button extends Base {

    constructor(state) {
        super(Memory.alloc(8));
        this.ptr.add(0).writeFloat(state);
        this.ptr.add(4).writeU32(Button.TickCount);
    }

    static get TickCount(): number {
        let _TickCount = Symbols.addr("Button::mTickCount");
        return _TickCount.readU32();
    }

    get state(): number {
        return this.ptr.add(0).readFloat();
    }

    set state(value: number) {
        this.ptr.add(0).writeFloat(value);
    }
}

export class Mapper extends Base {
    static MAX_BUTTONS = 0x53;

    constructor(ptr) {
        super(ptr);
    }

    GetLogicalIndex(code: number): number {
        return Symbols.call<number>("Mapper::GetLogicalIndex", this.ptr, code);
    }

    GetCodeFromLogicalIndex(index): number {
        for (let i = 0; i < Mapper.MAX_BUTTONS; i++) {
            if (this.GetLogicalIndex(i) == index)
                return i;
        }
        return -1;
    }
}

export class Mappable extends Base {
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
        super(ptr);
    }

    DispatchOnButton(code: number, state = 1.0): void {
        let _DispatchOnButton = Symbols.find("Mappable::DispatchOnButton");
        let b = new Button(state);
        _DispatchOnButton(this.ptr, 0, code, b.toPointer());
    }

    IsActive(): boolean {
        let _IsActive = Symbols.find("Mappable::IsActive");
        return !! _IsActive(this.ptr);
    }

    IsButtonDown(index: number): boolean {
        let _IsButtonDown = Symbols.find("Mappable::IsButtonDown");
        return !! _IsButtonDown(index, this.ptr);
    }

    // This kinda works, I don't know what the last parameter is, it doesn't
    // seem to be used.
    UpdateButtonState(index: number, state = 1.0) {
        let _UpdateButtonState = Symbols.find("Mappable::UpdateButtonState");
        let b = new Button(state);
        _UpdateButtonState(this.ptr, b.toPointer(), index, 0);
    }

    GetActiveMapper(): Mapper {
        let _GetActiveMapper = Symbols.find("Mappable::GetActiveMapper");
        return new Mapper(_GetActiveMapper(this.ptr));
    }

    // Convenience Function to press Jump/Attack/etc
    SimulateKeyPress(key, duration=0.1): boolean {
        var code = this.GetActiveMapper().GetCodeFromLogicalIndex(key);

        if (code < 0)
            return false;

        while (!this.IsButtonDown(key)) {
            this.DispatchOnButton(code, 1.0);
        }

        Thread.sleep(duration);

        while (this.IsButtonDown(key)) {
            this.DispatchOnButton(code, 0.0);
        }

        return true;
    }

    // Convenience Function to toggle key status, for Move/Sprint/etc.
    ToggleKeyDown(key): number {
        if (this.IsButtonDown(key)) {
            this.UpdateButtonState(key, 0.0);
            return 0;
        } else {
            this.UpdateButtonState(key, 1.0);
            return 1;
        }
    }
}

export class UserController extends Base {
    constructor(ptr) {
        super(ptr);
    }

    GetMappable(num: number): Mappable {
        return new Mappable(this
            .ptr
            .add(0x3c)
            .add(num * 4)
            .readPointer());
    }
}

export class InputManager extends Base {

    constructor() {
        super(InputManager.GetInstance());
    }

    static GetInstance(): NativePointer {
        return Symbols.call<NativePointer>("InputManager::GetInstance");
    }

    static GetController(num = 0): UserController {
        let Controller = Symbols.call<NativePointer>(
            "InputManager::GetController",
            this.GetInstance(),
            num
        );
        return new UserController(Controller);
    }

    // FIXME: I don't know what this thing is.
    GetContext(): number {
        return this.ptr.add(0x8).readU32();
    }
}


export class Input {
    static MoveUp(count = 1) {
        while (count--)
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.MoveUp);
    }
    static MoveDown(count = 1) {
        while (count--)
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.MoveDown);
    }
    static MoveLeft(count = 1) {
        while (count--)
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.MoveLeft);
    }
    static MoveRight(count = 1) {
        while (count--)
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.MoveRight);
    }
    static Jump() {
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.Jump);
    }
    static Attack() {
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.Attack);
    }
    static Action() {
        InputManager
            .GetController()
            .GetMappable(2)
            .SimulateKeyPress(Mappable.id.Character.DoAction);
    }
}

// var m = InputManager.GetController().GetMappable(2);
// // Start moving
// m.UpdateButtonState(Mappable.id.Character.MoveUp, 1.0);
// // Start sprinting
// m.UpdateButtonState(Mappable.id.Character.Sprint, 1.0);