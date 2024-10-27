import { EN_KeyboardEvent, EN_NativeKeyboardEvent, I_KeyboardEvent } from "../type_define/type_define";
import { I_KeyboardController } from "./i_keyboard_controller";

/**
 * 键盘事件监听器
 */
export class KeyboardInteractor {
    /**
     * 处理键盘事件的控制器集合
     */
    private _keyboardControls:Array<I_KeyboardController> = [];
    constructor(keyboardControls:Array<I_KeyboardController>){
        this._keyboardControls = keyboardControls;
    }

    public startListen(){
        window.addEventListener(EN_NativeKeyboardEvent.KeyDown,this);
        window.addEventListener(EN_NativeKeyboardEvent.KeyUp,this);
        window.addEventListener(EN_NativeKeyboardEvent.KeyPress,this);
    }

    public stopListen(){
        window.removeEventListener(EN_NativeKeyboardEvent.KeyDown,this);
        window.removeEventListener(EN_NativeKeyboardEvent.KeyUp,this);
        window.removeEventListener(EN_NativeKeyboardEvent.KeyPress,this);
    }

    public handleEvent(event:KeyboardEvent){
        const type = event.type as EN_NativeKeyboardEvent;
        switch(type){
        case EN_NativeKeyboardEvent.KeyDown:
            this._dispatchEvent(EN_KeyboardEvent.KeyDown,event);
            break;
        case EN_NativeKeyboardEvent.KeyUp:
            this._dispatchEvent(EN_KeyboardEvent.KeyUp,event);
            break;
        case EN_NativeKeyboardEvent.KeyPress:
            this._dispatchEvent(EN_KeyboardEvent.KeyPress,event);
            break;
        }
    }

    private _dispatchEvent(type:EN_KeyboardEvent,event:KeyboardEvent){
        const e:I_KeyboardEvent = {type,domEvent:event};
        let consumed = false;
        for(const controller of this._keyboardControls) {
            consumed = controller.processKeyboardEvent(e);
            if(consumed) break;
        }
        return consumed;
    }
}
