import { DBElement } from "../../db/db_element";
import { Element } from "../element";
import { injectDB } from "../element_decorator";

/**
 * 临时对象
 */
@injectDB('2fac4113-d775-4b36-b01d-7c6401b02554', DBElement)
export class TmpElement extends Element {
    public isTemporary(): boolean {
        return true;
    }

    public getStaticConfig() {
        return {
            dontSave: true
        };
    }
}