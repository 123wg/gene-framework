import { GLine } from "../../grep/gline";
import { Ln2 } from "../../math/ln2";
import { Vec2 } from "../../math/vec2";
import { CoreConfig } from "../../tooltik/core_config";
import { EN_GeoSnapType, T_GeoSnapResult } from "../../type_define/type_define";
import { GeoSnap } from "./geo_snap";

/**
 * 点线几何吸附
 */
export class PLGeoSnap extends GeoSnap<Ln2> {
    private _mPoint: Vec2;

    private _cLine: Ln2;
    constructor(mPoint: Vec2, cLine: Ln2) {
        super();
        this._mPoint = mPoint;
        this._cLine = cLine;
    }
    public getType(): EN_GeoSnapType {
        return EN_GeoSnapType.POINT_LINE;
    }
    public execute() {
        const footer = this._cLine.getProjectedPtBy(this._mPoint);
        const distance = this._mPoint.distanceTo(footer);
        if (distance < this._snapSetting.plDistance) {

            const pInLine = this._cLine.containsPt(footer);
            let previewLine = this._cLine;
            if (!pInLine) {
                const closestPoint = this._cLine.getClosestPoint(footer);
                previewLine = new Ln2(closestPoint, footer);
            }
            const start = previewLine.getStartPt();
            const end = previewLine.getEndPt();
            const gLine = new GLine({
                points: [start.x, start.y, end.x, end.y]
            });
            gLine.setStyle(CoreConfig.snapLinePreviewStyle);

            const result: T_GeoSnapResult<Ln2> = {
                type: this.getType(),
                geo: this._cLine,
                snapPos: footer,
                distance,
                dx: footer.x - this._mPoint.x,
                dy: footer.y - this._mPoint.y,
                previewNodes: [gLine]
            };
            return result;
        }
    }
}