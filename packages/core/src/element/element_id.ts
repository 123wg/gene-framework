/**
 * Element在文档的唯一标识
 */
export class ElementId {
    public static get INVALID() {
        return new ElementId(-1);
    }

    protected _id: number = -1;

    constructor(id: number) {
        this._id = id;
    }

    /**
     * 将ElementId转为基本数据类型
     */
    public asInt() {
        return this._id;
    }

    /**
     *  ElementId是否相等
     */
    public equals(id: ElementId) {
        if (!id) {
            return false;
        }
        return this._id === id.asInt();
    }

    /**
     *  ElementId是否有效
     */
    public isValid() {
        return this._id && this._id > -1;
    }

    public toString() {
        return '' + this._id;
    }

    public dump() {
        return { id: this._id };
    }

    public load(json: { id: number }) {
        this._id = json.id;
    }
}