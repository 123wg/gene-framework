import { Element, I_Document, I_Selection, I_SignalEvent, RequestMgr, Signal, SignalHook, T_CommitRequestEventData } from "@gene/core";

/**
 * 选择集合
 */
export class Selection implements I_Selection {
    private static _instance: Selection;

    private _doc: I_Document;

    /**当前选中id集合*/
    private _selectedIds: number[] = [];

    /**选择集变更事件*/
    public signalChange = new Signal<this, undefined>(this);

    private _signalHook = new SignalHook(this);

    public static instance() {
        if (!this._instance) {
            this._instance = new Selection();
        }
        return this._instance;
    }

    constructor() {
        this._signalHook.listen(RequestMgr.instance().signalCommitRequest, this._onCommitRequest);
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
        this.signalChange.dispatch();
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
        this.signalChange.dispatch();
    }

    /**
     * 清空选择集
     */
    public clear() {
        if (!this._selectedIds.length) return;
        this._selectedIds.splice(0);
        this._doc.modelView.cacheForView.cacheSelection(this);
        this.signalChange.dispatch();
    }

    /**
     * 重置选择集
     */
    public reset(ids: number[]) {
        this._selectedIds.splice(0);
        this._selectedIds.push(...new Set(ids));
        this._doc.modelView.cacheForView.cacheSelection(this);
        this.signalChange.dispatch();
    }


    /**
     * 获取选中的Elements
     */
    public getSelectedElements(): Element[] {
        return this._doc.getElementsByIds(this._selectedIds);
    }

    /**
     * 获取选中的Element的id集合
     */
    public getSelectedElementIds(): number[] {
        return this._selectedIds;
    }

    /**
     * 监听提交请求
     * 1.重置选择集
     */
    public _onCommitRequest(evt: I_SignalEvent<RequestMgr, T_CommitRequestEventData>) {
        const transaction = evt.data?.transaction;
        if (!transaction) return;
        const eleIds = transaction.undoRedoEntity.getModifiedElementIds();
        if (this._selectedIds.length) {
            if (this._selectedIds.find(id => eleIds.has(id))) {
                Selection.instance().reset(this._selectedIds);
            }
        }
    }
}
