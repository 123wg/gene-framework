/*
 * Author: Gene
 * Description:
 * Last Modified: 2024-10-17
 */

import { I_Document } from "../document/i_document";
import { DebugUtil } from "../tooltik/debug_util";
import { DumpLoadUtil } from "../tooltik/dump_load_util";
import { EN_UserName } from "../tooltik/user_name";
import { EN_DBNotSavePrefix, I_DBBaseProps, I_DumpLoad, T_DumpLoadData, T_ModifiedProps } from "../type_define/type_define";
import { EN_BasicType, T_BasicType, T_Constructor, T_JSON } from "../type_define/type_guard";

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
     * db中所有的key
     */
    public ownKeys() {
        const set = new Set([...Object.keys(this._db), ...Object.keys(this._cache)]);
        return [...set];
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

    /**
     * 加载JSON对象
     */
    public load(json: T_JSON) {
        const obj = this as unknown as T_JSON;
        for (const key of this.ownKeys()) {
            // const tKey = key as keyof T;
            if (key.startsWith(EN_DBNotSavePrefix.UNDER) || key.startsWith(EN_DBNotSavePrefix.CUNDER)) continue;

            // 文件没有存这个值
            if (json[key] === undefined || json[key] === null) continue;

            if (Array.isArray(obj[key])) {
                obj[key] = this._loadArray(json, key);
            } else if (obj[key] instanceof Map) {
                obj[key] = this._loadMap(json, key);
            } else if (obj[key] instanceof Set) {
                obj[key] = this._loadSet(json, key);
            } else if (DumpLoadUtil.isDumpLoad(obj[key])) {
                const cloned = new (obj[key].constructor as T_Constructor<I_DumpLoad>)();
                cloned.load(json[key] as T_DumpLoadData);
                obj[key] = cloned;
            } else {
                // 数学库对象暂无
            }

        }
    }

    private _dumpData(data: T_JSON) {
        const defaultValue: T_JSON = this.constructor();
        const result: T_JSON = {};

        for (const key of Object.keys(data)) {
            if (key.startsWith(EN_DBNotSavePrefix.UNDER) || key.startsWith(EN_DBNotSavePrefix.CUNDER)) continue;

            if (Array.isArray(data[key])) {
                const res1 = this._dumpArray(data[key]);
                const res2 = this._dumpArray(defaultValue[key] as unknown[]);
                if (JSON.stringify(res1) === JSON.stringify(res2)) continue;
                result[key] = res1;
            } else if (data[key] instanceof Map) {
                const res1 = this._dumpMap(data[key]);
                const res2 = this._dumpMap(defaultValue[key] as Map<T_BasicType, unknown>);
                if (JSON.stringify(res1) === JSON.stringify(res2)) continue;
                result[key] = res1;
            } else if (data[key] instanceof Set) {
                const res1 = this._dumpSet(data[key]);
                const res2 = this._dumpSet(defaultValue[key] as Set<unknown>);
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

    private _dumpArray(arr: Array<unknown>) {
        const array = [...arr];
        for (let i = 0; i < array.length; i += 1) {
            const item = array[i];
            if (item instanceof Array) {
                array[i] = this._dumpArray(item);
            } else {
                array[i] = this._dumpAProperty(item);
            }
        }
        return array;
    }

    private _loadArray() {

    }

    private _dumpMap(objMap: Map<T_BasicType, unknown>) {
        const mapToArray = [...objMap];
        for (let i = 0; i < mapToArray.length; i += 1) {
            const tmp = this._dumpArray(mapToArray[i]);
            mapToArray[i] = tmp as [T_BasicType, unknown];
        }
        return this._dumpArray(mapToArray);
    }

    private _dumpSet(objSet: Set<unknown>) {
        const setToArray = [...objSet];
        return this._dumpArray(setToArray);
    }

    private _dumpAProperty(obj: unknown) {
        const type = typeof obj;
        if (EN_BasicType.BOOLEAN === type ||
            EN_BasicType.NUMBER === type ||
            EN_BasicType.STRING === type
        ) return obj;

        if (DumpLoadUtil.isDumpLoad(obj)) {
            return obj.dump();
        }

        if (Array.isArray(obj) || obj instanceof Map || obj instanceof Set || !obj) {
            DebugUtil.assert(false, '未支持的数据类型', EN_UserName.GENE, '2024-12-16');
        }

        return obj;
    }
}
