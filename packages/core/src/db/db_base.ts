/*
 * Author: Gene
 * Description:
 * Last Modified: 2024-10-17
 */

import { I_Document } from "../document/i_document";
import { EN_DBNotSavePrefix, I_DBBaseProps, T_ModifiedProps } from "../type_define/type_define";
import { T_JSON } from "../type_define/type_guard";

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

    /**
     * 返回JSON对象
     */
    public dump(): T_JSON {
        if (Object.keys(this._cache).length) {
            return {
                ...this._dumpData(this._cache),
                ...this._dumpData(this._db)
            };
        }
        return this._dumpData(this._db);
    }

    private _dumpData(data: T_JSON) {
        const defaultValue: T_JSON = this.constructor();
        const result: T_JSON = {};

        for (const key of Object.keys(data)) {
            if (key.startsWith(EN_DBNotSavePrefix.UNDER) || key.startsWith(EN_DBNotSavePrefix.CUNDER)) continue;

            if (Array.isArray(data[key])) {
                const res1 = this._dumpArray(data[key]);
                const res2 = this._dumpArray(defaultValue[key]);
                if (JSON.stringify(res1) === JSON.stringify(res2)) continue;
                result[key] = res1;
            } else if (data[key] instanceof Map) {
                const res1 = this._dumpMap(data[key]);
                const res2 = this._dumpMap(defaultValue[key]);
                if (JSON.stringify(res1) === JSON.stringify(res2)) continue;
                result[key] = res1;
            } else if (data[key] instanceof Set) {
                const res1 = this._dumpSet(data[key]);
                const res2 = this._dumpSet(defaultValue[key]);
                if (JSON.stringify(res1) === JSON.stringify(res2)) continue;
                result[key] = res1;
            } else {
                const res1 = this._dumpAProperty(data[key]);
                const res2 = this._dumpAProperty(defaultValue[key]);
                if (JSON.stringify(res1) === JSON.stringify(res2)) continue;
                result[key] = res1;
            }
        }
        return result;
    }

}
