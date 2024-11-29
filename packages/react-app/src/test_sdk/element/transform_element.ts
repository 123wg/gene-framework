import { Element, MathUtil, Transform } from "@gene/core";
import { DBTransform } from "../db/db_transform";

/**
 * 可变换图元基类
 */
export class TransformElement<T extends DBTransform = DBTransform> extends Element<T> {
    public get x() {
        return this.db.x;
    }

    public set x(v: number) {
        this.db.x = v;
    }

    public get y() {
        return this.db.y;
    }

    public set y(v: number) {
        this.db.y = v;
    }

    public get rotation() {
        return this.db.rotation;
    }

    public set rotation(v: number) {
        this.db.rotation = v;
    }

    public get scaleX() {
        return this.db.scaleX;
    }

    public set scaleX(v: number) {
        this.db.scaleX = v;
    }

    public get scaleY() {
        return this.db.scaleY;
    }

    public set scaleY(v: number) {
        this.db.scaleY = v;
    }

    public getTransformAttrs() {
        return {
            x: this.x,
            y: this.y,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            rotation: this.rotation
        };
    }

    /**
     * 获取变换对象
     */
    public getTransform() {
        const transform = new Transform();
        transform.translate(this.x, this.y);
        transform.rotate(MathUtil.degToRad(this.rotation));
        transform.scale(this.scaleX, this.scaleY);
        return transform;
    }

    /**
     * 设置变换对象
     */
    public setTransform(transform: Transform) {
        const decompose = transform.decompose();
        console.log(decompose);
        this.x = decompose.x;
        this.y = decompose.y;
        this.rotation = MathUtil.radToDeg(decompose.rotation);
        this.scaleX = decompose.scaleX;
        this.scaleY = decompose.scaleY;
    }
}