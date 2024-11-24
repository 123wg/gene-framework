import { GRep } from "@gene/core";
import { KCanvas } from "../canvas/kcanvas";
import { DefaultController } from "../controller/default_controller";
import { I_MouseEvent, T_GizmoRenderData } from "../type_define/type_define";

/**
 * 辅助体基类(状态对象)
 */
export abstract class GizmoBase extends DefaultController {
    private static _gID = 0;

    /**脏标识*/
    private _dirty = false;

    protected _canvas: KCanvas;

    public readonly id: number;
    constructor() {
        super();
        GizmoBase._gID++;
        this.id = GizmoBase._gID;
    }

    /**
     * 初始化
     */
    public init(canvas: KCanvas) {
        this._canvas = canvas;
        this.onInit();
        this.dirty();
    }

    /**
     * 初始化回调
     */
    public abstract onInit(): void

    /**
     * 变更回调
     * 主要用来处理渲染数据,重新生成grep或更新grep等
     */
    public abstract onChange(): void

    /**
     * 创建一个空的GRep
     */
    public createGRep(): GRep {
        const grep = new GRep();
        return grep;
    }

    /**
     * 是否可进行事件处理
     */
    public eventCheck(_event: I_MouseEvent) {
        return true;
    }

    /**
     * 标记脏
     */
    public dirty() {
        this._dirty = true;
    }

    /**
     * 清理脏
     */
    public unDirty() {
        this._dirty = false;
    }

    /**
     * 是否脏
     */
    public isDirty() {
        return this._dirty;
    }

    /**
     * 渲染前数据准备
     */
    public onBeforeRender() {
        if (this.isDirty()) {
            this.unDirty();
            const data = this.onRender();
            return data;
        }
        return null;
    }

    /**
     * 渲染数据
     */
    public abstract onRender(): T_GizmoRenderData | null
}