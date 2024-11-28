import { GRep, I_Vec2 } from "@gene/core";
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

    pos: I_Vec2
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

/**
 * Gizmo的渲染数据
 */
export type T_GizmoRenderData = {
    grep?: GRep
    gizmoId: number
}


/**
 * GizmoMgr的渲染数据
 */
export type T_GizmoMgrRenderData = {
    update: Array<T_GizmoRenderData>
    remove: Array<number>
}


/**
 * 画布鼠标样式枚举
 */
export enum EN_MouseCursor {
    DEFAULT = 'default',
    /**左下右上*/
    NESW_RESIZE = 'nesw-resize',
    /**左上右下*/
    NWSE_RESIZE = 'nwse-resize'
}


/**
 * 角点名称到索引映射
 */
export enum EN_AnchorName {
    TOP_LEFT = 0,
    TOP_RIGHT,
    BTM_RIGHT,
    BTM_LEFT
}
