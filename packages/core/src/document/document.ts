import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { ElementMgr } from "./element_manager";
import { I_Document } from "./i_document";
import * as Short from 'short-uuid';

export class Document implements I_Document{
    /**文档唯一标识*/
    private _docUUID:string;

    public elementMgr:ElementMgr;

    constructor(uuid?:string){
        this.elementMgr = new ElementMgr();
        if(uuid){
            this._docUUID = uuid;
        }else {
            this._docUUID = Short.uuid();
        }
    }

    public getUUID():string {
        return this._docUUID;
    }

    getElementById<T = Element>(eleId: ElementId | number): T | undefined {
        const id = eleId instanceof ElementId ? eleId.asInt() : eleId;
        return this.elementMgr.getElementById(id) as T;
    }

    getElementByIdEnsure<T = Element>(eleId:ElementId | number):T {
        const ele = this.getElementById<T>(eleId);
        if(!ele) {
            throw new Error(`The Element with ID ${eleId} does not exist`);
        }
        return ele;
    }

    checkIfCanModifyDoc(): void {
        // TODO 实现检查方法
        throw new Error("Method not implemented.");
    }
}
