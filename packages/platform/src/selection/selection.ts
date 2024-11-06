import { Element, I_Document, I_Selection } from "@gene/core";

/**
 * 选择集合
 */
export class Selection implements I_Selection {
    private static _instance: Selection;

    private _doc: I_Document;

    /**当前选中id集合*/
    private _selectedIds: number[] = [];

    public static instance() {
        if (!this._instance) {
            this._instance = new Selection();
        }
        return this._instance;
    }

    public setDoc(doc: I_Document) {
        this._doc = doc;
    }

    public getDoc() {
        return this._doc;
    }

    /**
     * 将对象加入选择集
     */
    public add(ids: number[]) {
        const addElementIds: number[] = [];
        const validIds = [...new Set(ids)].filter(id => !this._selectedIds.find(_ => _ === id));
        addElementIds.push(...validIds);

        if (!addElementIds.length) return;
        this._selectedIds.push(...addElementIds);
        this._doc.modelView.cacheForView.cacheSelection(this);
    }

    /**
     * 将对象从选择集去除
     */
    public delete(ids: number[]) {
        let success = false;
        for (const id of ids) {
            const i = this._selectedIds.indexOf(id);
            if (i > -1) {
                this._selectedIds.splice(i, 1);
                success = true;
            }
        }
        if (success) {
            this._doc.modelView.cacheForView.cacheSelection(this);
        }
    }

    /**
     * 清空选择集
     */
    public clear() {
        if (!this._selectedIds.length) return;
        this._selectedIds.splice(0);
        this._doc.modelView.cacheForView.cacheSelection(this);
    }

    /**
     * 重置选择集
     */
    public reset(ids: number[]) {
        this._selectedIds.splice(0);
        this._selectedIds.push(...new Set(ids));
        this._doc.modelView.cacheForView.cacheSelection(this);
    }

    /**
     * 不包括GNode对应的Element id
     */
    public getActiveElements(): Element[] {
        return this.getDoc().getElementsByIds(this._selectedIds);
    }
}
