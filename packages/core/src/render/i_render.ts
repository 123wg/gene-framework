import { GRep } from "../grep/grep";

/**
 * 抽象渲染器
 */
export abstract class IRender {
    public abstract updateView(): void
    public abstract addGrep(grep: GRep): void
    public abstract removeGRep(eId: number): void
}