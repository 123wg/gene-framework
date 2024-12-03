import { SnapStrategy } from "./strategy/snap_strategy";

/**
 * 吸附引擎，执行吸附的入口
 */
export class SnapEnginee {
    private _snapStrategy: SnapStrategy;

    // TODO 给个默认值
    constructor(snapStrategy: SnapStrategy) {
        this._snapStrategy = snapStrategy;
    }

    public doSnap() {
        // return this._snapStrategy.doSnap();
    }
}