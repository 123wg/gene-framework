import { I_Document } from "../../document/i_document";
import { GRep } from "../../grep/grep";
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
        const ele = this._doc.getElementByIdEnsure<TmpElement>(this._tmpElementId);
        return ele;
    }

    /**
     * 绘制临时元素
     */
    public drawTmpElement(grep: GRep) {
        this.tmpElement.setGRep(grep);
    }

    /**
     * 清除临时元素
     */
    public clearTmp() {
        this.drawTmpElement(GRep.empty);
        this._doc.updateView();
    }

    /**
     * 销毁
     */
    public destroy() {
        this.clearTmp();
        this._doc.deleteElementsById(this._tmpElementId);
    }
}