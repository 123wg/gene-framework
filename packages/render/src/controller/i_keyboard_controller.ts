import { I_KeyboardEvent } from "../type_define/type_define";

/**
 * 处理键盘事件接口
 */
export interface I_ProcessKeyboardEvent {
    /**
     * 处理键盘事件
     * 若返回true则不在向上冒泡
     */
    processKeyboardEvent(event: I_KeyboardEvent): boolean
}

/**
 * 键盘事件控制接口
 */
export interface I_KeyboardController extends I_ProcessKeyboardEvent {

    onKeyDown(event: I_KeyboardEvent): boolean

    onKeyUp(event: I_KeyboardEvent): boolean

    onKeyPress(event: I_KeyboardEvent): boolean
}
