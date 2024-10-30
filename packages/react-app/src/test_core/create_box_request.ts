import { I_Document, Request } from "@gene/core";
import { BoxElement } from "./boxElement";

export class CreateBoxRequest extends Request {
    constructor(doc: I_Document) {
        super(doc);
    }
    public onCommit(): BoxElement {
        const box = this._doc.create(BoxElement);
        box.x = 50;
        return box;
    }
}
