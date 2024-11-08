import { ElementId } from "../element/element_id";
import { EN_RenderShapeType, T_NodeAttrs, T_NodeStyle } from "../type_define/type_define";
import type { GGroup } from "./ggroup";
/**
 * 数据层显示对象基类
 */
export abstract class GNode<T extends T_NodeAttrs = T_NodeAttrs, K extends T_NodeStyle = T_NodeStyle> {
    /**全局id标识*/
    private static _gId = 0;

    private _id: number;

    /**样式*/
    private _style: K = {} as K;

    public parent?: GGroup;

    constructor() {
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
     * 是否可拾取 先直接返回布尔,如果状态多了采用位运算表示,即category和flag机制
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
    public toRenderAttrs(): T {
        const attrs = this._toRenderAttrsWithoutStyle();
        Object.assign(attrs, this._style);
        attrs.id = `${this.id}`;
        return attrs;
    }

    /**
     * 获取渲染属性(纯几何信息)
     */
    protected abstract _toRenderAttrsWithoutStyle(): T

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
}


