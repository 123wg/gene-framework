import { ElementId } from "../element/element_id";
import { EN_RenderShapeType, T_Rect, I_Vec2 } from "../type_define/type_define";
import type { GGroup } from "./ggroup";

export type T_NodeStyle = {
    opacity?: number
}

export type T_NodeGeoAttrs = {
    id?: string
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scale?: I_Vec2;
    scaleX?: number;
    skewX?: number;
    skewY?: number;
    scaleY?: number;
    rotation?: number;
    rotationDeg?: number;
    offset?: I_Vec2;
    offsetX?: number;
    offsetY?: number;
}

/**
 * 数据层显示对象基类
 */
export abstract class GNode<T extends T_NodeGeoAttrs = T_NodeGeoAttrs, K extends T_NodeStyle = T_NodeStyle> {
    /**全局id标识*/
    private static _gId = 0;

    /**实例id*/
    private _id: number;

    /**样式*/
    protected _style: K = {} as K;

    /**几何信息、必要*/
    private _geoAttrs: T_NodeGeoAttrs = {};

    /**包围矩形*/
    private _clientRect: T_Rect;

    /**父元素*/
    public parent?: GGroup;

    constructor(attrs?: T) {
        Object.assign(this._geoAttrs, attrs);
        GNode._gId++;
        this._id = GNode._gId;
    }

    public get id() {
        return this._id;
    }

    public get elementId(): ElementId {
        return this.getRoot().elementId;
    }

    /**
     * 是否可拾取,默认为true
     * 先直接返回布尔,如果状态多了采用位运算表示,即category和flag机制
     */
    public canPick() {
        return true;
    }

    /**
     * 获取跟节点
     */
    public getRoot(): GNode {
        return this.parent ? this.parent.getRoot() : this;
    }

    /**
     * 获取图元类型
     */
    public abstract getShapeType(): EN_RenderShapeType

    /**
     * 生成供渲染的attrs
     */
    public toRenderAttrs(): T & K {
        const attrs = { ...this._geoAttrs, ...this._style } as T & K;
        attrs.id = `${this.id}`;
        return attrs;
    }

    /**
     * 获取样式属性
     */
    public getStyle(): K {
        return this._style;
    }

    /**
     * 设置样式属性
     */
    public setStyle(style: K) {
        Object.assign(this._style, style);
        return this;
    }

    /**
     * 从父节点移除
     */
    public removeFromParent() {
        this.parent?.removeNode(this);
    }

    /**
     * 获取包围矩形
     */
    public getClientRect(): T_Rect {
        return this._clientRect;
    }

    /**
     * 设置包围矩形
     */
    public setClientRect(rect: T_Rect) {
        this._clientRect = rect;
    }
}


