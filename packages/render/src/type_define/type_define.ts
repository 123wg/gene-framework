import { I_ProcessKeyboardEvent } from "../controller/i_keyboard_controller";
import { I_ProcessMouseEvent } from "../controller/i_mouse_controller";

/**
 * 原生鼠标事件
 */
export enum EN_NativeMouseEvent {
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    MouseMove = 'mousemove',
}

/**
 * 原生键盘事件
 */
export enum EN_NativeKeyboardEvent {
    KeyDown = 'keydown',
    KeyUp = 'keyup',
    KeyPress = 'keypress'
}


/**
 * 鼠标事件枚举
 */
export enum EN_MouseEvent {
    MouseDown = "MouseDown",
    MouseUp = "MouseUp",
    MouseMove = "MouseMove",
    MouseDragMove = "MouseDragMove",
    MouseDragStart = "MouseDragStart",
    MouseDragEnd = "MouseDragEnd",
    MouseDragCancel = "MouseDragCancel",
    MouseClick = 'MouseClick',
    MouseDblClick = 'MouseDblClick',
}

/**
 * 键盘事件枚举
 */
export enum EN_KeyboardEvent {
    KeyDown = 'KeyDown',
    KeyUp = 'KeyUp',
    KeyPress = 'KeyPress'
}

/**
 * 鼠标事件类型
 */
export interface I_MouseEvent {
    type: EN_MouseEvent

    domEvent: MouseEvent
}

/**
 * 键盘事件类型
 */
export interface I_KeyboardEvent {
    type: EN_KeyboardEvent

    domEvent: KeyboardEvent
}



/**
 * 画布初始化参数
 */
export type T_CanvasParams = {
    /**容器*/
    container: HTMLDivElement
    /**画布宽 默认为容器宽*/
    width?: number
    /**画布高 默认为容器高*/
    height?: number
    /**处理鼠标事件控制器*/
    mouseControllers: Array<I_ProcessMouseEvent>
    /**处理键盘事件控制器*/
    keyboardControllers: Array<I_ProcessKeyboardEvent>
}

/**
 * 渲染器参数
 */
export type T_RendererParams = Pick<T_CanvasParams, 'container' | 'height' | 'width'>