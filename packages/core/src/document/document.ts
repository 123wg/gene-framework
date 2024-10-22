import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { TransactionMgr } from "../transaction/transaction_mgr";
import { T_Constructor } from "../type_define/type_guard";
import { ElementMgr } from "./element_manager";
import { I_Document } from "./i_document";
import * as Short from 'short-uuid';

export class Document implements I_Document {
    public static canCreate = false;

    /**文档唯一标识*/
    private _docUUID: string;

    public readonly elementMgr: ElementMgr;

    public readonly transactionMgr: TransactionMgr;

    constructor(uuid?: string) {
        this.elementMgr = new ElementMgr();
        this.transactionMgr = new TransactionMgr(this);
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
        const id = this.idPool.genId(e);
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

    public checkIfCanModifyDoc(): void {
        DebugUtil.assert(this.transactionMgr.getCurrentTransaction(), '事务外不可修改文档', EN_UserName.GENE, '2024-10-22');
    }
}
