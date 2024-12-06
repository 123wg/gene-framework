import { EN_RenderShapeType, T_GRepRenderAttrs } from "../type_define/type_define";
import { GNode, T_NodeGeoAttrs, T_NodeStyle } from "./gnode";


export type T_GroupStyle = T_NodeStyle & {}
export type T_GroupGeoAttrs = T_NodeGeoAttrs & {}


/**
 * 组
 */
export class GGroup
    <T extends T_GroupGeoAttrs = T_GroupGeoAttrs, K extends T_GroupStyle = T_GroupStyle>
    extends GNode<T, K> {

    private _children: GNode[] = [];

    public get children() {
        return this._children;
    }

    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.GROUP;
    }

    public canPick(): boolean {
        return false;
    }

    /**
     * 是否为空
     */
    public isEmpty() {
        return this._children.length < 1;
    }

    /**
     * 添加子元素
     */
    public addNode<N extends GNode>(node: N): N {
        if (node.parent) {
            node.removeFromParent();
        }
        node.parent = this;
        this._children.push(node);
        return node;
    }

    /**
     * 添加子元素
     */
    public addNodes(...nodes: GNode[] | GNode[][]) {
        nodes.flat().forEach(node => this.addNode(node));
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
    public getRenderAttr(): T_GRepRenderAttrs {
        const childrenAttrs: Array<T_GRepRenderAttrs> = [];
        for (const child of this.children) {
            if (child instanceof GGroup) {
                childrenAttrs.push(child.getRenderAttr());
            } else {
                childrenAttrs.push({
                    ctorName: child.getShapeType(),
                    attrs: child.toRenderAttrs(),
                    gnode: child
                });
            }
        }
        return {
            ctorName: this.getShapeType(),
            attrs: this.toRenderAttrs(),
            children: childrenAttrs,
            gnode: this
        };
    }
}