import { ClassManager, T_Constructor } from "@gene/core";
import { I_ProcessEvent } from "../controller/i_process_event";
import { I_MouseEvent, I_KeyboardEvent, T_GizmoMgrRenderData, T_GizmoRenderData } from "../type_define/type_define";
import { GizmoBase } from "./gizmo_base";
import { KCanvas } from "../canvas/kcanvas";
import { Renderer } from "../render/renderer";

/**
 * 辅助体管理类
 */
export class GizmoMgr implements I_ProcessEvent {
    private static _instance: GizmoMgr;

    private _render: Renderer;

    private _canvas: KCanvas;

    /**
     * Gizmo的class管理
     */
    private _gizmoClsMgr = new ClassManager<string, T_Constructor<GizmoBase>>();

    /**
     * 当前活跃的gizmo
     */
    private _activeGizmoMap: Map<number, GizmoBase> = new Map();

    /**
     * 待移除显示对象的gizmoId集合
     */
    private _removeGizmoSet: Set<number> = new Set();

    public static instance() {
        if (!this._instance) {
            this._instance = new GizmoMgr();
        }
        return this._instance;
    }

    /**
     * 注册gizmo
     */
    public registerGizmo(gizmoId: string, gizmo: T_Constructor<GizmoBase>) {
        this._gizmoClsMgr.registerCls(gizmoId, gizmo);
    }

    /**
     * 设置渲染器
     */
    public setRender(render: Renderer) {
        this._render = render;
    }

    /**
     * 设置canvas
     */
    public setCanvas(canvas: KCanvas) {
        this._canvas = canvas;
    }

    /**
     * 添加gizmo
     */
    public addGizmo(gizmo: GizmoBase) {
        gizmo.init(this._canvas);
        this._activeGizmoMap.set(gizmo.id, gizmo);
    }

    /**
     * 根据id删除gizmo
     */
    public removeGizmoById(id: number) {
        let removed = false;
        const gizmo = this._activeGizmoMap.get(id);
        if (gizmo) {
            this._activeGizmoMap.delete(id);
            this._removeGizmoSet.add(id);
            removed = true;
        }
        return removed;
    }

    /**
     * 鼠标事件分发
     */
    public processMouseEvent(event: I_MouseEvent): boolean {
        let consumed = false;
        for (const gizmo of this._activeGizmoMap.values()) {
            if (gizmo.eventCheck(event)) {
                consumed = gizmo.processMouseEvent(event);
            }
        }
        return consumed;
    }

    public processKeyboardEvent(_event: I_KeyboardEvent): boolean {
        throw new Error("Method not implemented.");
    }

    /**
     * 渲染数据准备
     * 由render调用,获取所有需要更新和删除的Gizmo渲染数据,执行更新
     * Gizmo内判断自身是否dirty,是的话先执行onChange然后会返回更新后的最新渲染数据
     */
    public onBeforeRender(): T_GizmoMgrRenderData {
        const update: T_GizmoRenderData[] = [];
        for (const [, gizmo] of this._activeGizmoMap) {
            const renderData = gizmo.onBeforeRender();
            if (renderData) {
                update.push(renderData);
            }
        }
        const remove = Array.from(this._removeGizmoSet);
        this._removeGizmoSet.clear();
        return {
            update,
            remove
        };
    }
}