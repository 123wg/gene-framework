import { T_XY } from "@gene/core";
import { I_ProcessMouseEvent } from "./i_mouse_controller";
import { EN_MouseEvent, EN_NativeMouseEvent, I_MouseEvent } from "../type_define/type_define";

/**
 * 鼠标事件监听器
 */
export class MouseInteractor {
    private _container: HTMLElement;

    /**
     * 处理鼠标事件的控制器集合
     */
    private _mouseControllers: Array<I_ProcessMouseEvent> = [];

    private _isMouseDown = false;
    private _isDrag = false;
    private _lastMouseDownTime = 0;
    private _lastMouseDownPos: T_XY = { x: 0, y: 0 };
    private _lastClickTime = 0;



    constructor(container: HTMLElement, mouseControllers: Array<I_ProcessMouseEvent>) {
        this._container = container;
        this._mouseControllers = mouseControllers;
    }

    /**
     * 开启监听
     */
    public startListen() {
        this._container.addEventListener(EN_NativeMouseEvent.MouseDown, this);
        this._container.addEventListener(EN_NativeMouseEvent.MouseMove, this);
        this._container.addEventListener(EN_NativeMouseEvent.MouseUp, this);
    }

    /**
     * 停止监听
     */
    public stopListen() {
        this._container.removeEventListener(EN_NativeMouseEvent.MouseDown, this);
        this._container.removeEventListener(EN_NativeMouseEvent.MouseMove, this);
    }

    /**
     * 统一处理原生鼠标事件
     */
    public handleEvent(event: MouseEvent) {
        const type = event.type as EN_NativeMouseEvent;

        switch (type) {
            case EN_NativeMouseEvent.MouseDown:
                this._lastMouseDownTime = new Date().getTime();
                this._lastMouseDownPos.x = event.clientX;
                this._lastMouseDownPos.y = event.clientY;
                this._isMouseDown = true;

                if (event.button === 0) {
                    this._dispatchEvent(EN_MouseEvent.MouseDown, event);
                }

                break;

            case EN_NativeMouseEvent.MouseMove: {

                if (this._isMouseDown && !this._isDrag) {
                    const mx = Math.abs(event.clientX - this._lastMouseDownPos.x);
                    const my = Math.abs(event.clientY - this._lastMouseDownPos.y);
                    // 排除抖动影响
                    if (Math.sqrt(mx * mx + my * my) < 2) {
                        break;
                    }
                    this._isDrag = true;
                    this._dispatchEvent(EN_MouseEvent.MouseDragStart, event);
                    this._dispatchEvent(EN_MouseEvent.MouseDragMove, event);
                    break;
                } else if (this._isDrag) {
                    this._dispatchEvent(EN_MouseEvent.MouseDragMove, event);
                } else {
                    this._dispatchEvent(EN_MouseEvent.MouseMove, event);
                }
                break;
            }

            case EN_NativeMouseEvent.MouseUp: {
                if (this._isDrag) {
                    this._isDrag = false;
                    this._isMouseDown = false;
                    this._dispatchEvent(EN_MouseEvent.MouseDragEnd, event);
                    this._dispatchEvent(EN_MouseEvent.MouseUp, event);
                } else {
                    this._isMouseDown = false;
                    const isClick = new Date().getTime() - this._lastMouseDownTime < 300;
                    if (isClick) {
                        const isDblClick = new Date().getTime() - this._lastClickTime < 300;
                        if (isDblClick) {
                            this._dispatchEvent(EN_MouseEvent.MouseDblClick, event);
                        } else {
                            this._dispatchEvent(EN_MouseEvent.MouseClick, event);
                        }
                        this._lastClickTime = new Date().getTime();
                    }
                    this._dispatchEvent(EN_MouseEvent.MouseUp, event);
                }
            }
        }
    }

    /**
     * 事件分发
     */
    private _dispatchEvent(type: EN_MouseEvent, event: MouseEvent) {
        const screenPos = this._getScreenPos(event);
        const e: I_MouseEvent = {
            type,
            domEvent: event,
            screenPos: screenPos
        };
        let consumed = false;
        for (const controller of this._mouseControllers) {
            consumed = controller.processMouseEvent(e);
            if (consumed) break;
        }
        return consumed;
    }

    /**
     * 获取相对于container的屏幕坐标
     */
    private _getScreenPos(e: MouseEvent): T_XY {
        const rect = this._container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {
            x,
            y
        };
    }
}
