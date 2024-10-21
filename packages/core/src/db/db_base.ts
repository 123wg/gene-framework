/*
 * Author: Gene
 * Description:
 * Last Modified: 2024-10-17
 */

import { I_Document } from "../document/i_document";
import { I_DBBaseProps, T_ModifiedProps } from "../type_define/type_define";

/**
 * 文档数据基类,负责处理底层的数据保存加载和缓存管理
 */
export class DBBase<T extends I_DBBaseProps = I_DBBaseProps> {
    private _doc: I_Document;

    /**缓存*/
    private _cache: Partial<T> = {};

    /**真正保存数据的地方*/
    private _db: Partial<T> = {};

    public get cache() {
        return this._cache;
    }

    public get db() {
        return this._db;
    }

    /**
     * 向db写值,内部调用!!
     */
    public setDbValue<K extends keyof T>(key: K, val: T[K]) {
        this.db[key] = val;
    }

    public getDoc() {
        return this._doc;
    }

    public setDoc(doc: I_Document) {
        this._doc = doc;
    }

    /**
     * 获取修改的数据
     */
    public getModified(): T_ModifiedProps[] {
        const result: T_ModifiedProps[] = [];
        Object.keys(this._cache).forEach(key => {
            const tKey = key as keyof T;
            const modified: T_ModifiedProps = {
                propertyName: key,
                oldValue: this._db[tKey],
                newValue: this._cache[tKey]
            };
            result.push(modified);
        });
        return result;
    }

    /**
     * 数据入库
     */
    public commit() {
        Object.keys(this._cache).forEach((key) => {
            const tKey = key as keyof T;
            this._db[tKey] = this._cache[tKey];
        });
        this._clearCache();
    }

    /**
     * 数据回滚
     */
    public rollBack() {
        this._clearCache();
    }

    /**
     * 清空缓存
     */
    private _clearCache() {
        Object.keys(this._cache).forEach(key => {
            const tKey = key as keyof T;
            delete this._cache[tKey];
        });
        this._cache = {};
    }
}
