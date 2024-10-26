import { I_KeyboardEvent } from "../type_define/type_define";

/**
 * 键盘事件控制接口
 */
export interface I_KeyboardController {
    processKeyboardEvent(event:I_KeyboardEvent):boolean

    onKeyDown(event:I_KeyboardEvent):boolean

    onKeyUp(event:I_KeyboardEvent):boolean

    onKeyPress(event:I_KeyboardEvent):boolean
}
