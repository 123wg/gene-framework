import { DebugUtil } from "./debug_util";
import { EN_UserName } from "./user_name";

/**
 * 类管理器
 */
export class ClassManager<T, K> {

    private _kvMap: Map<T, K> = new Map();

    private _vkMap: Map<K, T> = new Map();
    /**
     * 注册类
     */
    public registerCls(key: T, val: K) {
        const ctor = this._kvMap.get(key);
        if (ctor) DebugUtil.assert(!val, `${val}已注册,请检查`, EN_UserName.GENE, '2024-10-18');
        this._kvMap.set(key, val);
        this._vkMap.set(val, key);
    }

    /**
     * 获取类
     */
    public getCls(key: T) {
        return this._kvMap.get(key);
    }

    public getClsEnsure(key: T) {
        const cls = this.getCls(key);
        DebugUtil.assert(cls, `未获取到键为${key}对应的类`, EN_UserName.GENE, '2024-10-18');
        return cls!;
    }

    /**
     * 获取标识
     */
    public getClsName(val: K) {
        return this._vkMap.get(val);
    }

    public getClsNameEnsure(val: K) {
        const name = this.getClsName(val);
        DebugUtil.assert(name, `未获取到值为${val}对应的标识`, EN_UserName.GENE, '2024-11-10');
        return name!;
    }

    /**
     * 获取所有类
     */
    public getAllCls() {
        return [...this._kvMap.values()];
    }

    /**
     * 查看所有类个数
     */
    public getClsLength() {
        return this._kvMap.size;
    }
}
