import { T_Constructor } from "@gene/core";
import { GizmoMgr } from "./gizmo_mgr";
import { GizmoBase } from "./gizmo_base";

/**
 * 注册gizmo的装饰器
 */
export function registerGizmo<T extends GizmoBase>(gizmoId: string) {
    return (ctor: T_Constructor<T>) => {
        GizmoMgr.instance().registerGizmo(gizmoId, ctor);
    };
}