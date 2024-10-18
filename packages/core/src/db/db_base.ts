/*
 * Author: Gene
 * Description:
 * Last Modified: 2024-10-17
 */

import { I_Document } from "../document/i_document";
import { I_DBBaseProps } from "../type_define/type_define";

/**
 * 文档数据基类,负责处理底层的数据保存加载和缓存管理
 */
export class DBBase<T extends I_DBBaseProps = I_DBBaseProps> {
    private _doc: I_Document;

    /**缓存*/
    private _cache: Partial<T>;

    /**真正保存数据的地方*/
    private _db: Partial<T>;

    public get cache() {
        return this._cache;
    }

    public db() {
        return this._db;
    }

    public getDoc() {
        return this._doc;
    }

    public setDoc(doc: I_Document) {
        this._doc = doc;
    }
}
