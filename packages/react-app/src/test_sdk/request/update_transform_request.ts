import { ElementId, registerRequest, Request, Transform } from "@gene/core";
import { EN_AppRequestId } from "../app_request_id";
import { TransformElement } from "../element/transform_element";

@registerRequest(EN_AppRequestId.UPDATE_TRANSFORM)
export class UpdateTransformRequest extends Request {

    public elementId: ElementId;

    public deltaTransform: Transform;

    constructor(eleId: ElementId, deltaTransform: Transform) {
        super();
        this.elementId = eleId;
        this.deltaTransform = deltaTransform;
    }
    public commit() {
        const element = this.doc.getElementById(this.elementId);
        if (element?.isLike(TransformElement)) {
            const oldTrans = element.getTransform();
            const newTrans = oldTrans.multiply(this.deltaTransform);
            element.setTransform(newTrans);
            element.markGRepDirty();
        }
    }
}