import { I_Document } from "../document/i_document";

export interface I_DbBaseProps {}

/**
 * 文档数据基类,负责处理底层的数据保存加载和缓存管理
 */
export class DbBase<T extends I_DbBaseProps = I_DbBaseProps> {
    private _doc: I_Document;

    /**缓存*/
    private _cache:Partial<T>;

    /**真正保存数据的地方*/
    private _db:Partial<T>;

    public cache(){
        return this._cache;
    }

    public db(){
        return this._db;
    }

    public getDoc() {
        return this._doc;
    }

    public setDoc(doc: I_Document) {
        this._doc = doc;
    }
}


