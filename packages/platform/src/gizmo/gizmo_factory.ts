import { Element, SignalHook } from "@gene/core";
import { Selection } from "../selection/selection";
import { GizmoBase, GizmoMgr, I_GizmoFactory } from "@gene/render";

/**
 * 交互层gizmo工厂,业务层继承此类
 */
export abstract class GizmoFactory implements I_GizmoFactory {
    public static ID_SPLIT = '-';

    /**上次选择的id*/
    private _lastSelectedId: string;

    private _signalHook = new SignalHook(this);
    constructor() {
        this._signalHook.listen(Selection.instance().signalChange, this._onSelectionChange);
    }

    /**
     * 根据选中物体创建gizmo
     */
    public abstract createGizmos(elements: Element[]): GizmoBase[]

    public clear() {
        GizmoMgr.instance().clearActiveGizmos();
        this._lastSelectedId = '';
    }

    /**
     * 监听选择集变更
     */
    private _onSelectionChange() {
        const selIds = Selection.instance().getSelectedElementIds();
        const selEles = Selection.instance().getSelectedElements();
        const id = selIds.join(GizmoFactory.ID_SPLIT);
        if (!!id && id === this._lastSelectedId) {
            GizmoMgr.instance().updateGizmos();
            return;
        }
        this.clear();
        this._lastSelectedId = id;
        const gizmos = this.createGizmos(selEles);
        GizmoMgr.instance().addGizmo(...gizmos);
    }
}