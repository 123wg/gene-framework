import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { TransactionMgr } from "../transaction/transaction_mgr";
import { T_Constructor } from "../type_define/type_guard";
import { ElementMgr } from "./element_manager";
import { I_Document } from "./i_document";
import * as Short from 'short-uuid';
import { IDPool } from "./id_pool";
import { ModelView } from "../model_view/model_view";
import { EN_ModelViewChanged } from "../type_define/type_define";

export class Document implements I_Document {
    /**是否可以创建对象*/
    public static canCreate = false;

    /**文档唯一标识*/
    private _docUUID: string;

    public readonly elementMgr: ElementMgr;

    public readonly transactionMgr: TransactionMgr;

    public readonly idPool: IDPool = new IDPool();

    public readonly modelView: ModelView;

    constructor(uuid?: string) {
        this.elementMgr = new ElementMgr();
        this.transactionMgr = new TransactionMgr();
        this.transactionMgr.init(this);
        this.modelView = new ModelView(this);
        if (uuid) {
            this._docUUID = uuid;
        } else {
            this._docUUID = Short.uuid();
        }
    }

    public getUUID(): string {
        return this._docUUID;
    }

    public create<T extends Element>(ctor: T_Constructor<T>): T {
        Document.canCreate = true;
        const e = new ctor();
        e.db.setDoc(this);

        // TODO 补充完整
        let id = this.idPool.genId(e);
        if (!id) {
            const usedIds = this.transactionMgr.idPoolGC();
            [...this.elementMgr.getElementsMap().keys()].forEach(_ => usedIds.add(_));

            this.idPool.reset(usedIds);
            id = this.idPool.genId(e);
        }
        DebugUtil.assert(id, 'Id资源已耗尽', EN_UserName.GENE, '2024-10-22');

        e.id = id!;
        Document.canCreate = false;

        DebugUtil.assert(!this.getElementById(e.id), '该Id已存在', EN_UserName.GENE, '2024-10-22');

        if (!e.isTemporary()) {
            this.checkIfCanModifyDoc();
            this.transactionMgr.getCurrentUndoRedoEntity().onElementsAdded([e]);
        }

        this.elementMgr.add(e);
        return e;
    }

    public getElementById<T = Element>(eleId: ElementId | number): T | undefined {
        const id = eleId instanceof ElementId ? eleId.asInt() : eleId;
        return this.elementMgr.getElementById(id) as T;
    }

    public getElementByIdEnsure<T = Element>(eleId: ElementId | number): T {
        const ele = this.getElementById<T>(eleId);
        if (!ele) {
            throw new Error(`The Element with ID ${eleId} does not exist`);
        }
        return ele;
    }

    public getElementsByIds(eleIds: (ElementId | number)[]): Element[] {
        const result: Element[] = [];
        eleIds.forEach(id => {
            const ele = this.getElementById(id);
            if (ele) result.push(ele);
        });
        return result;
    }

    public filterElements(filter?: (ele: Element) => boolean): Element[] {
        if (!filter) return this.elementMgr.getAllElements();
        return this.elementMgr.getAllElements().filter(filter);
    }

    public getAllElementsByCtor<T extends Element>(filterType?: T_Constructor<T>): T[] {
        if (!filterType) {
            return this.filterElements() as T[];
        }
        return this.elementMgr.getElementByCtor(filterType.prototype.getSerialId()) as T[];
    }

    public deleteElementsById(...eleIds: (ElementId | number | number[] | ElementId[])[]): boolean {
        const elementsToDelete = this.getElementsByIds(eleIds.flat());
        if (!elementsToDelete) return false;

        if (elementsToDelete.some(_ => !_.isTemporary())) {
            this.checkIfCanModifyDoc();
            this.transactionMgr.getCurrentUndoRedoEntity().onElementsDeleted(elementsToDelete);
        }

        elementsToDelete.forEach(e => {
            this.elementMgr.delete(e);
        });

        return true;
    }

    public checkIfCanModifyDoc(): void {
        DebugUtil.assert(this.transactionMgr.getCurrentTransaction(), '事务外不可修改文档', EN_UserName.GENE, '2024-10-22');
    }

    public updateView(_rebuild = false): void {
        this.modelView.updateView();
    }

    public cacheElementChanged(type: EN_ModelViewChanged, elements: Element[]): void {
        this.modelView.cacheForView.cacheElementChanged(type, elements);
    }

    public destroy(): void {
        this.elementMgr.clear();
        this.transactionMgr.clear();
    }
}
