import { ElementId, I_Document, Element } from "@gene/core";
import { DefaultController } from "@gene/render";

/**
 * 子环境编辑器
 */
export abstract class Editor extends DefaultController {

    private _doc: I_Document;

    private _edittingElement?: Element;

    constructor(doc: I_Document, elementId?: ElementId) {
        super();
        this._doc = doc;
        if (elementId) {
            this._edittingElement = doc.getElementById(elementId);
        }
    }
}
