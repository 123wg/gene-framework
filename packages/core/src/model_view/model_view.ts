import { I_Document } from "../document/i_document";
import { Element } from "../element/element";
import { GRep } from "../grep/grep";
import { IRender } from "../render/i_render";
import { EN_ModelViewChanged } from "../type_define/type_define";
import { ModelChangedCache } from "./model_changed_cache";

/**
 * ModelView,模型层视图,与UI无关的view
 * 将刷新视图的接口开放给用户,只有用户主动调用了刷新视图的接口,视图才刷新,否则只将变化缓存
 */
export class ModelView {
    private _doc: I_Document;

    public iRender: IRender;
    /**
     * 视图缓存
     */
    public readonly cacheForView = new ModelChangedCache();

    /**
     * Elementid到GRepId的映射
     */
    private _eIdToGidMap: Map<number, number> = new Map();


    /**
     * render是否dirty
     */
    private _renderDirty: boolean = true;

    constructor(doc: I_Document) {
        this._doc = doc;
    }

    /**
     * 增量更新视图
     */
    public updateView() {
        if (!this.cacheForView.isChanged()) {
            return;
        }

        this._renderDirty = false;
        this._updateElements();
        this._updateSelection();
        if (this._renderDirty) {
            this.iRender.updateView();
        }
        this.cacheForView.clear();
    }

    /**
     * Element是否可渲染
     */
    private _isElementValid(element: Element) {
        if (element.getStaticConfig()?.dontShowView) {
            return false;
        }
        const grep = element.getGRep();
        return grep && !grep.isEmpty() && element.isElementVisible();
    }

    private _addGRep(grep: GRep) {
        const eId = grep.elementId.asInt();
        if (grep.isEmpty()) {
            this._removeGRep(eId);
            return;
        }
        this._eIdToGidMap.set(eId, grep.id);
        this.iRender.addGrep(grep);
        this._renderDirty = true;
    }

    private _removeGRep(eId: number) {
        const gid = this._eIdToGidMap.get(eId);
        if (gid) {
            this._eIdToGidMap.delete(eId);
            this.iRender.removeGRep(eId);
            this._renderDirty = true;
        }
    }

    private _updateGRep(grep: GRep) {
        const eid = grep.elementId.asInt();
        this._eIdToGidMap.set(eid, grep.id);
        this.iRender.removeGRep(eid);
        this.iRender.addGrep(grep);
        this._renderDirty = true;
    }

    /**
     * 更新elements
     */
    private _updateElements() {
        const { container } = this.cacheForView;
        const added = container.get(EN_ModelViewChanged.ELEMENT_CREATE)?.keys();
        const modified = container.get(EN_ModelViewChanged.ELEMENT_UPDATE)?.keys();
        const deleted = container.get(EN_ModelViewChanged.ELEMENT_DELETE)?.keys();
        if (!added || !modified || !deleted) return;
        for (const id of added) {
            const element = this._doc.getElementById(id);
            if (!element) continue;
            const grep = element.getGRep();
            if (!grep) continue;
            if (this._isElementValid(element)) {
                this._addGRep(grep);
            }
        }
        for (const id of modified) {
            const element = this._doc.getElementById(id);
            if (!element) continue;
            const grep = element.getGRep();
            //空的grep应该走remove流程
            if (!this._isElementValid(element)) {
                this._removeGRep(id);
            } else {
                this._updateGRep(grep);
            }
        }

        for (const id of deleted) {
            this._removeGRep(id);
        }
    }

    /**
     * 更新选择集
     */
    private _updateSelection() {
        const selection = this.cacheForView.selection;
        if (!selection) return;

        const greps = this._toGReps(selection.getActiveElements());

        this.iRender.clearSelection();
        this._renderDirty = true;

        if (!greps.length) return;
        this.iRender.drawSelections(greps);
    }

    private _toGReps(_elements: Element[]): GRep[] {
        return [];
    }
}