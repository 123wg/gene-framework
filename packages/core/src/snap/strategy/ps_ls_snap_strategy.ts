import { EN_SnapStrategyType, T_SnapResult } from "../../type_define/type_define";
import { SnapStrategy } from "./snap_strategy";

/**
 * 多点吸水平竖直线
 */
export class PPSLSSnapStrategy extends SnapStrategy {
    public getType(): EN_SnapStrategyType {
        return EN_SnapStrategyType.PSLS;
    }
    public doSnap(): T_SnapResult {
        throw new Error("Method not implemented.");
    }
    public updateClientGeos(): void {
        throw new Error("Method not implemented.");
    }
}
