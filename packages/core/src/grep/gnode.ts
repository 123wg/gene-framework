import { ElementId } from "../element/element_id";
import { EN_RenderShapeType, T_NodeAttrs, T_NodeStyle } from "../type_define/type_define";

/**
 * 表示图形的基本单元
 * 以管道举例 生成管道需要两根线 
 * 线由起点和终点组成 element中保存起点和终点坐标
 * element对应的显示对象 主要用来干 1.能关联element 2.能生成渲染需要的数据 主要是attrs 3.提供方法能设置样式
 */
export abstract class GNode<T extends T_NodeAttrs = T_NodeAttrs, K extends T_NodeStyle = T_NodeStyle> {
    private static _gId = 0;

    public elementId: ElementId;

    private _id: number;

    private _style: K = {} as K;

    constructor() {
        GNode._gId++;
        this._id = GNode._gId;
    }


    public get id() {
        return this._id;
    }

    public abstract getShapeType(): EN_RenderShapeType

    /**
     * 生成供渲染的attrs
     */
    public toRenderAttrs(): T {
        const attrs = this._toRenderAttrsWithoutStyle();
        Object.assign(attrs, this._style);
        attrs.id = `${this.id}`;
        return attrs;
    }

    protected abstract _toRenderAttrsWithoutStyle(): T

    public getStyle(): K {
        return this._style;
    }

    public setStyle(style: K) {
        Object.assign(this._style, style);
        return this;
    }
}


