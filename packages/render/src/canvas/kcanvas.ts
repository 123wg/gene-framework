import { KeyboardInteractor } from "../controller/keyboard_interactor";
import { MouseInteractor } from "../controller/mouse_interactor";
import { EN_MouseCursor, T_CanvasParams } from "../type_define/type_define";
import { Renderer } from "../render/renderer";
import { GizmoMgr } from "../gizmo/gizmo_mgr";
import { renderState } from "../render/render_state";
import { I_Vec2, ModelView } from "@gene/core";

/**
 * 画布,封装渲染器、图元、交互操作实现
 */
export class KCanvas {
    private _mouseInteractor: MouseInteractor;

    private _keyboardInteractor: KeyboardInteractor;

    private _container: HTMLElement;

    private _renderer: Renderer;

    constructor(params: T_CanvasParams) {
        this._container = params.container;
        this._renderer = new Renderer(params);
        this._mouseInteractor = new MouseInteractor(this, params.container, params.mouseControllers);
        this._keyboardInteractor = new KeyboardInteractor(params.keyboardControllers);
        GizmoMgr.instance().setCanvas(this);
        window.addEventListener('resize', this.onResize);
    }

    public getCanvasContainer() {
        return this._container;
    }

    /**
     * 开启鼠标事件监听
     */
    public startMouseEventListen() {
        this._mouseInteractor.startListen();
    }

    /**
     * 关闭鼠标事件监听
     */
    public stopMouseEventListen() {
        this._mouseInteractor.stopListen();
    }

    /**
     * 开启键盘事件监听
     */
    public startKeyboardEventListen() {
        this._keyboardInteractor.startListen();
    }

    /**
     * 关闭键盘事件监听
     */
    public stopKeyboardEventListen() {
        this._keyboardInteractor.stopListen();
    }

    /**
     * 绑定ModelView的renderer
     */
    public resetModelView(modelView: ModelView) {
        modelView.iRender = this._renderer;
    }

    /**
     * 鼠标事件转位置
     */
    public mouseEventToStagePos(event: MouseEvent) {
        return this._renderer.mouseEventToStagePos(event);
    }

    /**
     * 重置画布大小
     */
    public onResize() {
        renderState.requestResize();
        renderState.requestUpdateView();
    }

    public pickElement(pos: I_Vec2) {
        return this._renderer.pickElement(pos);
    }

    public pickGizmo(pos: I_Vec2) {
        return this._renderer.pickGizmo(pos);
    }

    /**
     * 设置鼠标样式
     */
    public setMouseCursor(cursor: EN_MouseCursor) {
        this._container.style.cursor = cursor;
    }
}