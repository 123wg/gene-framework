import { TransformElement } from "../../element/built_in_element/transform_element";
import { Transform } from "../../math/transform";
import { EN_CoreRequestIds } from "../en_request_id";
import { Request } from "../request";
import { registerRequest } from "../request_decorator";


/**
 * 更新可变换物体
 */
@registerRequest(EN_CoreRequestIds.UPDATE_TRANSFORM)
export class UpdateTransformRequest extends Request {

    public elementId: number;

    public deltaTransform: Transform;

    public useOldTrans = true;

    constructor(eleId: number, deltaTransform: Transform, useOldTrans = true) {
        super();
        this.elementId = eleId;
        this.deltaTransform = deltaTransform;
        this.useOldTrans = useOldTrans;
    }
    public commit() {
        const element = this.doc.getElementById(this.elementId);
        if (element?.isLike(TransformElement)) {
            if (this.useOldTrans) {
                const oldTrans = element.getTransform();
                let newTrans = new Transform();
                newTrans = oldTrans.multiply(this.deltaTransform);
                element.setTransform(newTrans);
            } else {
                element.setTransform(this.deltaTransform);
            }

            element.markGRepDirty();
        }
    }
}