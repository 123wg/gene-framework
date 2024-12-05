import { PsHVLsSnap, SnapBase, T_SnapResult, TransformElement, Vec2 } from "@gene/core";
import { app } from "@gene/platform";

/**
 * 可变换图元移动吸附
 * 主要是多点吸水平竖直线
 */
export class TransformMoveSnap extends SnapBase {
    private _moveEle: TransformElement;

    /**鼠标动的偏移量*/
    private _offset: Vec2;

    constructor(moveEle: TransformElement, offset: Vec2) {
        super();
        this._moveEle = moveEle;
        this._offset = offset;
    }

    /**
     * 可吸其它transform的变换后的角点组成的线
     */
    public doSnap(): T_SnapResult {
        let transEles = app.doc.filterElements(ele => ele.isLike(TransformElement)) as TransformElement[];
        transEles = transEles.filter(_ => !_.id.equals(this._moveEle.id));

        const points = this._moveEle.getTransformedCorners();
        points.forEach(p => p.add(this._offset));
        const hLines = transEles.map(_ => _.getTransformedRectHLines()).flat();
        const vLines = transEles.map(_ => _.getTransformedRectVLines()).flat();


        const snap = new PsHVLsSnap(points, hLines, vLines);
        const result = snap.doSnap();
        return result;
    }
}