import { ElementId, registerRequest, Request, Transform, TransformElement } from "@gene/core";
import { EN_EditorRequestId } from "./request_id";

/**
 * 更新可变换物体
 */
@registerRequest(EN_EditorRequestId.UPDATE_TRANSFORM)
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