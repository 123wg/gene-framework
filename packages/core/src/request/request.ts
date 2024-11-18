import { I_Document } from "../document/i_document";

/**
 * 请求抽象类
 */
export abstract class Request {
    private _doc: I_Document;

    public get doc() {
        return this._doc;
    }

    /**
     * 设置关联文档,框架内部调用
     */
    public setDoc(doc: I_Document) {
        this._doc = doc;
    }

    /**
     * 是否参与事务记录
     */
    public canTransact(): boolean {
        return true;
    }

    /**
     * 请求提交,对数据的操作写在这里
     */
    public abstract commit(): unknown
}
