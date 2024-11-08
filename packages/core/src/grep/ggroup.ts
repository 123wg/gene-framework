import { EN_RenderShapeType, T_GorupAttrs, T_GRepRenderAttrs, T_GroupStyle } from "../type_define/type_define";
import { GNode } from "./gnode";

export class GGroup
    <T extends T_GorupAttrs = T_GorupAttrs, K extends T_GroupStyle = T_GroupStyle>
    extends GNode<T, K> {

    private _children: GNode[] = [];

    public get children() {
        return this._children;
    }

    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.GROUP;
    }

    /**
     * 是否为空
     */
    public isEmpty() {
        return this._children.length < 1;
    }

    protected _toRenderAttrsWithoutStyle() {
        return {} as T;
    }

    /**
     * 添加子元素
     */
    public addNode<T extends GNode>(node: T) {
        if (node.parent) {
            node.removeFromParent();
        }
        node.parent = this;
        this._children.push(node);
        return node;
    }

    /**
     *移除元素
     */
    public removeNode(node: GNode) {
        const index = this.children.findIndex(_ => _ === node);
        if (index < 0) return false;
        node.parent = undefined;
        this._children.splice(index, 1);
        return true;
    }

    /**
     * 获取所有子元素的渲染配置
     */
    public getChildrenRenderAttrs(): T_GRepRenderAttrs {
        const childrenAttrs: Array<T_GRepRenderAttrs> = [];
        for (const child of this.children) {
            if (child instanceof GGroup) {
                childrenAttrs.push(child.getChildrenRenderAttrs());
            } else {
                childrenAttrs.push({
                    ctorName: child.getShapeType(),
                    attrs: child.toRenderAttrs()
                });
            }
        }
        return {
            ctorName: this.getShapeType(),
            attrs: this.toRenderAttrs(),
            children: childrenAttrs
        };
    }
}