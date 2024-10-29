import { I_Document } from "@gene/core";

/**
 * 选择集合
 */
export class Selection {
    private static _instance:Selection;

    private _doc:I_Document;

    public static instance(){
        if(!this._instance) {
            this._instance = new Selection();
        }
        return this._instance;
    }

    public setDoc(doc:I_Document){
        this._doc = doc;
    }

    public getDoc(){
        return this._doc;
    }


    /**
     * 将对象加入选择集
     */
    public add(){}

    /**
     * 将对象从选择集去除
     */
    public delete(){}

    /**
     * 清空选择集
     */
    public clear(){}

    /**
     * 重置选择集
     */
    public reset(){}

}
