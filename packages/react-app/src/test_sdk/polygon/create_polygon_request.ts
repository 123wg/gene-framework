import { registerRequest, Request } from "@gene/core";
import { EN_AppRequestId } from "../app_request_id";
import { PolygonElement } from "./polygon_element";

export type T_CreatePolygonParam = {
    radius: number,
    sides: number,
    x: number,
    y: number
}

@registerRequest(EN_AppRequestId.CREATE_REG_POLYGON)
export class CreatePolygonRequest extends Request {
    public param: T_CreatePolygonParam;
    constructor(param: T_CreatePolygonParam) {
        super();
        this.param = param;
    }
    public commit() {
        const polygon = this.doc.create(PolygonElement);
        polygon.radius = this.param.radius;
        polygon.sides = this.param.sides;
        polygon.x = this.param.x;
        polygon.y = this.param.y;
        polygon.markGRepDirty();
        return polygon;
    }
}