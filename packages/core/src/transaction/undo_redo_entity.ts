import { I_DBElementProps } from "../db/db_element";
import { I_Document } from "../document/i_document";
import { Element } from "../element/element";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { EN_ModelViewChanged, T_ModifiedProps } from "../type_define/type_define";

/**
 * 记录一次undo/redo的Element变化
 */
export class UndoRedoEntity {
    private _doc: I_Document;

    private readonly _added = new Set<Element>();

    private readonly _deleted = new Set<Element>();

    private readonly _modified = new Set<Element>();

    private readonly _modifiedProperties: Map<number, T_ModifiedProps[]> = new Map();

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
        this._updateViewCache();
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
     * undo变redo,redo变undo
     */
    public reverseAndExecute() {
        this._reverse();
        this._execute();
    }

    /**
     * 合并其它提交
     */
    public merge(other: UndoRedoEntity) {
        const otherAdded = new Set([...other._added]);
        const otherDeleted = new Set([...other._deleted]);
        const otherModifiedProps: Map<number, T_ModifiedProps[]> = new Map();
        other._modifiedProperties.forEach((v, k) => otherModifiedProps.set(k, v));

        // 新增
        for (const ele of [...this._added]) {
            DebugUtil.assert(!otherAdded.has(ele), '不可能发生', EN_UserName.GENE, '2024-10-21');
            if (otherDeleted.has(ele)) {
                // add + delete = null
                this._added.delete(ele);
                otherDeleted.delete(ele);
            } else {
                // add + modify = add
                otherModifiedProps.delete(ele.id.asInt());
            }
        }

        // 删除
        for (const ele of [...this._deleted]) {
            DebugUtil.assert(
                !otherAdded.has(ele) &&
                !otherDeleted.has(ele) &&
                !otherModifiedProps.has(ele.id.asInt()),
                '不可能发生',
                EN_UserName.GENE,
                '2024-10-21'
            );
        }

        // 修改
        for (const [thisId, thisPvs] of this._modifiedProperties) {
            if ([...otherAdded].find(_ => _.id.asInt() === thisId)) {
                DebugUtil.assert(false, '不可能发生', EN_UserName.GENE, '2024-10-21');
            } else if (otherModifiedProps.has(thisId)) {
                const otherPvs = otherModifiedProps.get(thisId)!;
                otherPvs.forEach(otherPv => {
                    const thisPv = thisPvs.find(_ => _.propertyName === otherPv.propertyName);
                    if (thisPv) {
                        thisPv.newValue = otherPv.newValue;
                    } else {
                        thisPvs.push(otherPv);
                    }
                });
                // 合并完需要删除
                otherModifiedProps.delete(thisId);
            } else if ([...otherDeleted].find(_ => _.id.asInt() === thisId)) {
                // modify + delete = delete
                this._modifiedProperties.delete(thisId);
                // 需要把更新回滚
                const otherDelElement = [...otherDeleted].find(_ => _.id.asInt() === thisId);
                thisPvs.forEach(({ propertyName, oldValue }) => {
                    const tKey = propertyName as keyof I_DBElementProps;
                    const tVal = oldValue as I_DBElementProps[typeof tKey];
                    otherDelElement?.db.setDbValue(tKey, tVal);
                });
            }
        }

        otherAdded.forEach(ele => this._added.add(ele));
        otherDeleted.forEach(ele => this._deleted.add(ele));
        otherModifiedProps.forEach((v, k) => {
            this._modifiedProperties.set(k, v);
        });
        this._modified.clear();
        this._modifiedProperties.forEach((_v, k) => {
            const ele = this._doc.getElementByIdEnsure(k);
            this._modified.add(ele);
        });
    }

    /**
     * 将操作reverse
     */
    private _reverse() {
        // 新增变删除
        const oldAdded = [...this._added];
        const oldDeleted = [...this._deleted];

        this._added.clear();
        this._deleted.clear();

        oldAdded.forEach(ele => this._deleted.add(ele));
        oldDeleted.forEach(ele => this._added.add(ele));

        // 修改
        for (const [, values] of this._modifiedProperties) {
            for (const v of values) {
                [v.oldValue, v.newValue] = [v.newValue, v.oldValue];
            }
        }
    }

    /**
     * 正向执行
     */
    public _execute() {
        this._handleElementsFromDB(false, ...this._added);
        // 修改
        for (const [id, values] of this._modifiedProperties) {
            const element = this._doc.getElementByIdEnsure(id);
            for (const v of values) {
                const tKey = v.propertyName as keyof I_DBElementProps;
                const tVal = v.newValue as I_DBElementProps[typeof tKey];
                element.db.setDbValue(tKey, tVal);
            }
        }
        this._handleElementsFromDB(true, ...this._deleted);

        // TODO 事件分发 关联更新等
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

    public collectUsedIds(set: Set<number>) {
        [...this._added, ...this._deleted].forEach(e => set.add(e.id.asInt()));
        [...this._modifiedProperties.keys()].forEach(id => set.add(id));
    }

    private _updateViewCache() {
        const changedElements: Set<Element> = new Set();
        for (const [id, values] of this._modifiedProperties) {
            const element = this._doc.getElementByIdEnsure(id);

            if (values.find(({ propertyName }) => {
                return element?.propNameChangeShouldCacheToView(propertyName);
            })) {
                changedElements.add(element);
            }
        }

        // 刷新视图
        this._doc.cacheElementChanged(EN_ModelViewChanged.ELEMENT_CREATE, [...this._added]);
        this._doc.cacheElementChanged(EN_ModelViewChanged.ELEMENT_UPDATE, [...changedElements]);
        this._doc.cacheElementChanged(EN_ModelViewChanged.ELEMENT_DELETE, [...this._deleted]);
    }
}
