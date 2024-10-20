import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { ElementMgr } from "./element_manager";
import { I_Document } from "./i_document";

export class Document implements I_Document{
    public elementMgr:ElementMgr;
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
        // TODO 实现
        throw new Error("Method not implemented.");
    }
}
