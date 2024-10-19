import { DebugUtil } from "./debug_util";
import { EN_UserName } from "./user_name";

/**
 * 类管理器
 */
export class ClassManager<T, K> {

    private _clsMap: Map<T, K> = new Map();
    /**
     * 注册类
     */
    public registerCls(key: T, val: K) {
        const ctor = this._clsMap.get(key);
        if (ctor) DebugUtil.assert(!val, `${val}已注册,请检查`, EN_UserName.GENE, '2024-10-18');
        this._clsMap.set(key, val);
    }

    /**
     * 获取类
     */
    public getCls(key: T) {
        return this._clsMap.get(key);
    }

    public getEnsureCls(key: T) {
        const cls = this.getCls(key);
        DebugUtil.assert(cls, `未获取到键为${key}对应的类`, 'gene', '2024-10-18');
        return cls!;
    }

    /**
     * 获取所有类
     */
    public getAllCls() {
        return this._clsMap;
    }

    /**
     * 查看所有类个数
     */
    public getClsLength() {
        return this._clsMap.size;
    }
}
