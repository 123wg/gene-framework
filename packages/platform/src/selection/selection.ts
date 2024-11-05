import { I_Document } from "@gene/core";

/**
 * 选择集合
 */
export class Selection {
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
        // this._doc.modelView.cacheForView.cacheElementChanged
    }

    /**
     * 将对象从选择集去除
     */
    public delete() { }

    /**
     * 清空选择集
     */
    public clear() { }

    /**
     * 重置选择集
     */
    public reset() { }

}
