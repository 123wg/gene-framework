import { I_Document } from "../document/i_document";
import { Element } from "../element/element";
import { T_ModifiedProps } from "../type_define/type_define";

/**
 * 记录一次undo/redo的Element变化
 */
export class UndoRedoEntity {
    private _doc: I_Document;

    private readonly _added = new Set<Element>();

    private readonly _deleted = new Set<Element>();

    private readonly _modified = new Set<Element>();

    private readonly _modifiedProperties: Map<number, T_ModifiedProps[]>;

    constructor(doc: I_Document) {
        this._doc = doc;
    }

    public onElementsAdded(eles: Element[]) {
        eles.forEach(ele => this._added.add(ele));
    }

    public onElementsUpdated(eles: Element[]) {
        eles.forEach(ele => this._modified.add(ele));
    }

    public onElementsDeleted(eles: Element[]) {
        eles.forEach(ele => this._deleted.add(ele));
    }

    public clear() {
        this._added.clear();
        this._modified.clear();
        this._modifiedProperties.clear();
        this._deleted.clear();
    }

    /**
     * 真正去改变db
     */
    public commit() {
        // 1.压缩事务
        this._compress();
        if (this._isEmpty()) return false;

        // 2.记录属性的修改
        this._modifiedProperties.clear();
        this._modified.forEach(ele => {
            const modify = ele.db.getModified();
            if (!ele.isTemporary() && modify.length) {
                this._modifiedProperties.set(ele.id.asInt(), modify);
            }
            ele.db.commit();
        });

        this._added.forEach(ele => ele.db.commit());

        // TODO 事件分发和 关联更新 更新视图等
        return true;
    }

    /**
     * 数据回滚
     */
    public rollBack() {
        // 增加和删除的回滚
        this._handleElementsFromDB(true, ...this._added);
        this._handleElementsFromDB(false, ...this._deleted);

        // 修改的回滚
        this._modified.forEach(ele => {
            ele.db.rollBack();
        });

        return true;
    }


    /**
     * 压缩事务
     * 主要处理例如，新增一个Element,然后更改这个Element的属性,事务管理器会记录每一个操作，这时只需要记录增加的操作即可
     */
    private _compress() {
        // add + modified = add
        for (const ele of this._added) {
            if (this._modified.has(ele)) {
                ele.db.commit();
                this._modified.delete(ele);
            }
        }

        // modified + delete = (rollback modified) + delete
        for (const ele of this._deleted) {
            if (this._modified.has(ele)) {
                ele.db.rollBack();
                this._modified.delete(ele);
            }
        }

        // add + delete = null
        for (const ele of this._deleted) {
            if (this._added.has(ele)) {
                this._deleted.delete(ele);
                this._added.delete(ele);
            }
        }
    }

    public _isEmpty() {
        return !this._added.size && !this._deleted.size && !this._modified.size;
    }

    /**
     * 从容器中增删对象
     * @param del 是否删除
     * @param eles 对象数组
     */
    private _handleElementsFromDB(del: boolean, ...eles: Element[]) {
        const eleMgr = this._doc.elementMgr;
        eles.forEach(ele => {
            if (del) eleMgr.delete(ele);
            else eleMgr.add(ele);
        });
    }

}