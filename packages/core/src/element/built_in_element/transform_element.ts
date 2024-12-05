import { DBTransform } from "../../db/built_in_db/db_transform";
import { Ln2 } from "../../math/ln2";
import { Transform } from "../../math/transform";
import { Vec2 } from "../../math/vec2";
import { MathUtil } from "../../tooltik/math_util";
import { T_Rect } from "../../type_define/type_define";
import { Element } from "../element";

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

    /**
     * 获取变换的属性
     */
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
        this.x = decompose.x;
        this.y = decompose.y;
        this.rotation = decompose.rotation;
        this.scaleX = decompose.scaleX;
        this.scaleY = decompose.scaleY;
    }

    /**
     * 获取变换前rect
     */
    public getOriginRect() {
        return this.getGRep().getClientRect();
    }

    /**
     * 获取变换前角点
     */
    public getOriginCorners() {
        const rect = this.getOriginRect();
        const corners = MathUtil.getCornerPoints(rect);
        return corners;
    }

    /**
     * 获取变换前角点中心点
     */
    public getOriginCenter() {
        const corners = this.getOriginCorners();
        const p1 = corners[0];
        const p2 = corners[2];
        return p1.midTo(p2);
    }


    /**
     * 获取变换后角点
     */
    public getTransformedCorners() {
        const corners = this.getOriginCorners();
        const transform = this.getTransform();
        const transCorners = corners.map(_ => {
            const transP = transform.point(_);
            return new Vec2(transP);
        });
        return transCorners;
    }

    /**
     * 获取变换后角点中心点
     */
    public getTransformedCenter() {
        const corners = this.getTransformedCorners();
        const p1 = corners[0];
        const p2 = corners[2];
        return p1.midTo(p2);
    }


    /**
     * 获取变换后AABB的rect
     */
    public getTransformedRect(): T_Rect {
        const corners = this.getTransformedCorners();
        const xs = corners.map(p => p.x);
        const ys = corners.map(p => p.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /**
     * 获取变换后AABB的corners
     */
    public getTransformedRectCorners() {
        const rect = this.getTransformedRect();
        const corners = MathUtil.getCornerPoints(rect);
        return corners;
    }

    /**
     * 获取变换后AABB的corners中心点
     */
    public getTransformedRectCenter() {
        const corners = this.getTransformedRectCorners();
        const p1 = corners[0];
        const p2 = corners[2];
        return p1.midTo(p2);
    }

    /**
     * 获取变换后的AABB线
     */
    public getTransformedRectLines(): Ln2[] {
        const corners = this.getTransformedRectCorners();
        const lines = corners.map((p, i) => {
            const next = corners[(i + 1) % 4];
            return new Ln2(p, next);
        });
        return lines;
    }
}