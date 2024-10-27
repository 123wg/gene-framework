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
    type:EN_MouseEvent

    domEvent:MouseEvent
}

/**
 * 键盘事件类型
 */
export interface I_KeyboardEvent {
    type:EN_KeyboardEvent

    domEvent:KeyboardEvent
}
