import { SnapBase } from "@gene/core/src/snap/snap_base";
import { T_SnapResult } from "@gene/core/src/type_define/type_define";

/**
 * 管道吸附
 * 要求能实现吸附所有物体包围盒点、特征点、画线时上一个点构成的角度线
 */
export class PipeDrawSnap extends SnapBase {
    public doSnap(): T_SnapResult {
        throw new Error("Method not implemented.");
    }
}