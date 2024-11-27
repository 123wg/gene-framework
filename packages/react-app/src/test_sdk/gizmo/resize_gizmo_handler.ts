import { I_ResizeGizmoHandler } from "@gene/render";
import { ImageElement } from "../image/image_element";
import { T_Rect } from "@gene/core";

/**
 * 变换大小数据处理器
 */
export class ResizeGizmoHandler implements I_ResizeGizmoHandler {
    private _element: ImageElement;
    constructor(element: ImageElement) {
        this._element = element;
    }
    public getGeoms(): T_Rect {
        return this._element.getGRep().getClientRect();
    }
}