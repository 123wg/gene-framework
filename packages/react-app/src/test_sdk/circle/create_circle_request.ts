import { registerRequest, Request } from "@gene/core";
import { EN_AppRequestId } from "../app_request_id";
import { CircleElement } from "./circle_element";

/**
 * 创建圆请求
 */
@registerRequest(EN_AppRequestId.CREATE_CIRCLE)
export class CreateCircleRequest extends Request {
    public radius: number;

    public x: number;

    public y: number;

    constructor(radius: number, x: number, y: number) {
        super();
        this.radius = radius;
        this.x = x;
        this.y = y;
    }

    public commit() {
        const circle = this.doc.create(CircleElement);
        circle.x = this.x;
        circle.y = this.y;
        circle.radius = this.radius;
        circle.markGRepDirty();
        return circle;
    }
}