import { DBElement } from "../db/db_element";
import { ElementId } from "./element_id";

/**
 * 模型层数据基类
 */
export class Element<T extends DBElement = DBElement> {
    public readonly db: T;

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
}