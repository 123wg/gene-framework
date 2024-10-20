import { DBElement } from "../db/db_element";
import { ElementId } from "./element_id";

export type T_SerializedId = {
    /**类序列化的唯一标识*/
    ctor: string
}

/**
 * 模型层数据基类
 */
export class Element<T extends DBElement = DBElement> {
    public readonly db: T;

    /**保存到文档中的序列化Id*/
    public static serializedId: T_SerializedId;

    // TODO 构造函数

    public get id() {
        return this.db.id;
    }

    public set id(v: ElementId) {
        this.db.id = v;
    }

    public get name() {
        return this.db.name;
    }

    public set name(v: string) {
        this.db.name = v;
    }

    public get visible() {
        return this.db.visible;
    }

    public set visible(v: boolean) {
        this.db.visible = v;
    }

    public getDoc() {
        return this.db.getDoc();
    }

    /**
     * 是否为临时对象
     */
    public isTemporary():boolean {
        return false;
    }

    /**
     * 获取序列化的id
     */
    public getSerialId(){
        return (this.constructor as typeof Element).serializedId.ctor;
    }

    /**创建对应DB的方法*/
    public createElementDB?(): T;
}

