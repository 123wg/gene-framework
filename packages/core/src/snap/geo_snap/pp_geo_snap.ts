import { GCircle } from "../../grep/gcircle";
import { Vec2 } from "../../math/vec2";
import { CoreConfig } from "../../tooltik/core_config";
import { EN_GeoSnapType, T_GeoSnapResult } from "../../type_define/type_define";
import { GeoSnap } from "./geo_snap";

/**
 * 点点几何吸附
 */
export class PPGeoSnap extends GeoSnap<Vec2> {

    /**吸附主体*/
    private _mPoint: Vec2;

    /**吸附客体*/
    private _cPoint: Vec2;

    constructor(mPoint: Vec2, cPoint: Vec2) {
        super();
        this._mPoint = mPoint;
        this._cPoint = cPoint;
    }

    public getType(): EN_GeoSnapType {
        return EN_GeoSnapType.POINT_POINT;
    }
    public execute() {
        const distance = this._mPoint.distanceTo(this._cPoint);
        if (distance < this._snapSetting.ppDistance) {

            const gCircle = new GCircle({
                radius: CoreConfig.snapPointSize,
                x: this._cPoint.x,
                y: this._cPoint.y
            });


            const result: T_GeoSnapResult<Vec2> = {
                type: this.getType(),
                geo: this._cPoint,
                snapPos: this._cPoint,
                distance,
                dx: this._cPoint.x - this._mPoint.x,
                dy: this._cPoint.y - this._mPoint.y,
                previewNodes: [gCircle]
            };
            return result;
        }
    }
}