import { GNode } from "@gene/core";
import Konva from "konva";

/**
 * 渲染对象桶
 */
export class RenderBucket {
    /**EleId到Group映射*/
    private _eIdToGroupMap: Map<number, Konva.Group> = new Map();

    /**高亮EleId到Group映射*/
    private _hightIdToGroupMap: Map<number, Konva.Group> = new Map();

    /**选中Eld到Group映射*/
    private _selIdToGroupMap: Map<number, Konva.Group> = new Map();

    /**GizmoId到Group映射*/
    private _gizmoIdToGroupMap: Map<number, Konva.Group> = new Map();

    /**Shape到GNode映射*/
    private _knodeToGNodeMap: Map<Konva.Node, GNode> = new Map();

    //==========element相关===============================================
    public getEidGroup(eId: number) {
        return this._eIdToGroupMap.get(eId);
    }

    public getAllEidGroups() {
        return Array.from(this._eIdToGroupMap.values());
    }

    public setEidGroup(eId: number, group: Konva.Group) {
        this._eIdToGroupMap.set(eId, group);
    }

    public delEidGroup(eId: number) {
        this._eIdToGroupMap.delete(eId);
    }

    //==========高亮element相关===============================================
    public getHightEidGroup(eId: number) {
        return this._hightIdToGroupMap.get(eId);
    }

    public getAllHightEidGroups() {
        return Array.from(this._hightIdToGroupMap.values());
    }
    public setHightEidGroup(eId: number, group: Konva.Group) {
        this._hightIdToGroupMap.set(eId, group);
    }

    public delHightEidGroup(eId: number) {
        this._hightIdToGroupMap.delete(eId);
    }

    //==========选中element相关===============================================
    public getSelEidGroup(eId: number) {
        return this._selIdToGroupMap.get(eId);
    }

    public getAllSelIdGroups() {
        return Array.from(this._selIdToGroupMap.values());
    }
    public setSelEidGroup(eId: number, group: Konva.Group) {
        this._selIdToGroupMap.set(eId, group);
    }

    public delSelEidGroup(eId: number) {
        this._selIdToGroupMap.delete(eId);
    }

    public clearSelEidGroupMap() {
        this._selIdToGroupMap.clear();
    }

    //==========gizmo相关===============================================
    public getGizmoIdGroup(gizmoId: number) {
        return this._gizmoIdToGroupMap.get(gizmoId);
    }

    public getAllGizmoIdGroups() {
        return Array.from(this._gizmoIdToGroupMap.values());
    }

    public setGizmoIdGroup(gizmoId: number, group: Konva.Group) {
        this._gizmoIdToGroupMap.set(gizmoId, group);
    }

    public delGizmoIdGroup(gizmoId: number) {
        this._gizmoIdToGroupMap.delete(gizmoId);
    }

    //==========knode和GNode想关===============================================
    public getKnodeGnode(knode: Konva.Node) {
        return this._knodeToGNodeMap.get(knode);
    }

    public getAllKnodeGnodes() {
        return Array.from(this._knodeToGNodeMap.values());
    }

    public setKnodeGnode(knode: Konva.Node, gnode: GNode) {
        this._knodeToGNodeMap.set(knode, gnode);
    }

    public delKnodeGnode(knode: Konva.Node) {
        this._knodeToGNodeMap.delete(knode);
    }

    /**
     * 获取Group展开的所有Node,包含自身
     */
    public _getAllNodesByGroup(group?: Konva.Group) {
        if (!group) return [];
        const list: Konva.Node[] = [group];
        group.children.forEach(c => {
            if (c instanceof Konva.Group) list.concat(this._getAllNodesByGroup(c));
            else list.push(c);
        });
        return list;
    }

    /**
     * 根据group清理knode和GNode的映射关系
     */
    public delKnodeGNodeByGroup(group: Konva.Group) {
        const nodes = this._getAllNodesByGroup(group);
        nodes.forEach(node => this.delKnodeGnode(node));
    }
}