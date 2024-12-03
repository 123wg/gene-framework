import { SnapStrategy } from "./strategy/snap_strategy";

/**
 * 吸附引擎，执行吸附的入口
 */
export class SnapEnginee {
    private _clientGeoHelper: I_ClientGeoHelper;
    /**吸附策略*/
    private _snapStrategy: SnapStrategy;

    constructor(snapStrategy: SnapStrategy) {
        this._snapStrategy = snapStrategy;

    }

    public doSnap() {
        return this._snapStrategy.doSnap();
    }
}