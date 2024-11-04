import { EN_RenderShapeType, T_GGroupChildrenAttr, T_GorupAttrs, T_GroupStyle } from "../type_define/type_define";
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
    public addNode(node: GNode) {
        this._children.push(node);
    }

    /**
     * 获取所有子元素的渲染配置
     */
    public getChildrenRenderAttrs() {
        const result: Array<T_GGroupChildrenAttr> = [];
        for (const child of this.children) {
            if (child instanceof GGroup) {
                result.push(...child.getChildrenRenderAttrs());
            } else {
                result.push({
                    ctorName: child.getShapeType(),
                    attrs: child.toRenderAttrs()
                });
            }
        }
        return result;
    }
}