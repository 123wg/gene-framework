import { registerRequest, Request } from "@gene/core";
import { EN_EditorRequestId } from "./request_id";
import { RectElement } from "../element/rect_element";

/**
 * 创建矩形
 */
@registerRequest(EN_EditorRequestId.CREATE_RECT)
export class CreateRectRequest extends Request {
    public x: number;

    public y: number;

    public width: number;

    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public commit() {
        const rect = this.doc.create(RectElement);
        rect.x = this.x;
        rect.y = this.y;
        rect.width = this.width;
        rect.height = this.height;
        rect.markGRepDirty();
        return rect;
    }
}