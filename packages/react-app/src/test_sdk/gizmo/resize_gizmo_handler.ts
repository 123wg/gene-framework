import { I_ResizeGizmoHandler } from "@gene/render";
import { ImageElement } from "../element/image_element";
import { MathUtil, Vec2 } from "@gene/core";

/**
 * 变换大小数据处理器
 */
export class ResizeGizmoHandler implements I_ResizeGizmoHandler {
    private _element: ImageElement;
    constructor(element: ImageElement) {
        this._element = element;
    }
    public getGeoms(): Array<Vec2> {
        // 获取夹紧的包围盒点
        const rect = this._element.getGRep().getClientRect();
        const transform = this._element.getTransform();
        const points = MathUtil.getCornerPoints(rect);
        const tPoints = points.map(_ => {
            const vec = transform.point(_);
            return new Vec2(vec.x, vec.y);
        });
        return tPoints;
    }
}