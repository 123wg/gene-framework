import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";

export class IDPool {
    public static readonly MAX_TMP_NUM = 1000;

    public static readonly MAX_TMP_OFFSET = 2 ** 32 - IDPool.MAX_TMP_NUM;

    public static readonly MAX_UNSTABLE_NUM = 1e6;

    public static readonly MAX_UNSTABLE_OFFSET = 2 ** 32 - IDPool.MAX_UNSTABLE_NUM - IDPool.MAX_TMP_NUM;

    private _unstablePool: number[] = [];

    private _tmpPool: number[] = [];

    private _currentStableIndex: number = 0;

    constructor() {
        this.reset();
    }

    public reset(usedIds?: Set<number>) {
        this._unstablePool.splice(0);
        for (let i = 0; i < IDPool.MAX_UNSTABLE_NUM; i++) {
            const id = IDPool.MAX_UNSTABLE_OFFSET + i;
            if (!usedIds?.has(id)) {
                this._unstablePool.push(id);
                if (this._unstablePool.length >= IDPool.MAX_UNSTABLE_NUM) {
                    break;
                }
            }
        }

        this._tmpPool.splice(0);
        for (let i = 0; i < IDPool.MAX_TMP_NUM; i++) {
            const id = IDPool.MAX_TMP_OFFSET + i;
            if (!usedIds?.has(id)) {
                this._tmpPool.push(id);
            }
        }
    }

    public genId(e: Element): ElementId | undefined {
        // TODO add unStable space
        if (e.isTemporary()) {
            return this.genTmpId();
        } else {
            return this.genStableId();
        }
    }

    /**
     * reusable small pool of tmp id, undefined behavior when having too much tmp Element
     */
    public genTmpId(): ElementId | undefined {
        const id = this._tmpPool.pop();
        if (id === undefined) return undefined;
        return new ElementId(id);
    }

    /**
     * pool of unstable ElementId. elements in this pool will not be saved;
     */
    public genUnstableId(): ElementId | undefined {
        const id = this._unstablePool.pop();
        if (id === undefined) return undefined;
        return new ElementId(id);
    }

    /**
     * pool of stable ElementId. no conflict when saving/loading.Incremental
     */
    public genStableId(): ElementId {
        const id = ++this._currentStableIndex;
        DebugUtil.assert(id < IDPool.MAX_UNSTABLE_OFFSET, 'stable id资源已耗尽', EN_UserName.GENE, '2024-10-22');
        return new ElementId(id);
    }

    public clearStableId(startIdx: number) {
        this._currentStableIndex = startIdx;
    }

    /**
     * if id is in stable space
     */
    public isStableId(id: number) {
        return id < IDPool.MAX_UNSTABLE_OFFSET;
    }
}