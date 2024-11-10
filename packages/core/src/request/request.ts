import { I_Document } from "../document/i_document";

/**
 * 请求抽象类
 */
export abstract class Request {
    private _doc: I_Document;

    public get doc() {
        return this._doc;
    }

    public setDoc(doc: I_Document) {
        this._doc = doc;
    }

    public abstract commit(): unknown
}
