import { I_Document } from "../../document/i_document";
import { ElementId } from "../element_id";
import { TmpElement } from "./tmp_element";

/**
 * 用于绘制临时对象
 */
export class TmpElementPainter {
    /**临时的ElementId,用于画线*/
    private _tmpElementId: ElementId;

    private _doc: I_Document;

    constructor(doc: I_Document) {
        this._doc = doc;
        this._tmpElementId = doc.create(TmpElement).id;
    }

    public get tmpElement() {

    }
}